/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'

import { Processo } from '../../domain/entities/Processo'
import type {
  ProcessoAtualAttributes,
  ProcessoConstructor
} from '../../@types/Processo'
import type { Option } from '../../components/Select/Select'
import type { TiposDeAlgoritmos } from '../../utils/constants'

// Props do Provider (ele envolve toda a aplicação)
interface EscalonadorProviderProps {
  children: React.ReactNode
}

// Enum que define as etapas do escalonador
export enum STEPS {
  CADASTRAR_PROCESSOS, // Etapa 0: Cadastro dos processos
  CONFIGURAR_ESCALONADOR, // Etapa 1: Configuração do algoritmo
  EXECUCAO, // Etapa 2: Execução dos processos
  TOTAL_STEPS // Contador auxiliar
}

// Interface principal do contexto (o que será disponibilizado globalmente)
interface EscalonadorType {
  processos: Processo[]
  removerProcesso: (id: number) => void
  handleAddProcessoAtual: (processo: Processo, index: number) => void
  editarProcesso: (processoAtual: ProcessoAtualAttributes) => void
  cadastrarProcesso: ({
    duracao,
    momentoCriacao,
    prioridade
  }: Omit<ProcessoConstructor, 'id'>) => void
  processoAtual: ProcessoAtualAttributes | null
  handleChangeProcessoAtual: (
    name: keyof ProcessoAtualAttributes,
    value: number | null
  ) => void
  handleNextStep: () => void
  releaseNextStep: boolean
  handlePrevStep: () => void
  handleChangeSchedulerConfiguration: (
    name: keyof SchedulerConfiguration,
    value: number | null | Algoritmo
  ) => void
  schedulerConfiguration: SchedulerConfiguration
  currentIndexStep: number
}

// Representa um algoritmo de escalonamento (FCFS, SJF, RR, etc.)
export interface Algoritmo extends Option {
  value: TiposDeAlgoritmos
}

// Estrutura de configuração do escalonador
interface SchedulerConfiguration {
  algoritmo: Algoritmo | null
  quantum: number | null
  aging: number | null
}

// Estado inicial da configuração
const initialConfiguration = {
  algoritmo: null,
  quantum: null,
  aging: null
}

// Cria o contexto (vazio por padrão)
const EscalonadorContext = createContext<EscalonadorType | null>(null)

// Provider do contexto — envolve a aplicação e fornece os estados e funções
export const EscalonadorProvider: React.FC<EscalonadorProviderProps> = ({
  children
}) => {
  // Lista de processos criados
  const [processos, setProcessos] = useState<Processo[]>([])

  // Próximo ID a ser atribuído ao processo
  const [nextId, setNextId] = useState<number>(1)

  // Configuração do escalonador (algoritmo, quantum, aging)
  const [schedulerConfiguration, setSchedulerConfiguration] =
    useState<SchedulerConfiguration>(initialConfiguration)

  // Etapa atual do fluxo (cadastro → configuração → execução)
  const [currentIndexStep, setCurrentIndexStep] = useState<number>(
    STEPS.CADASTRAR_PROCESSOS
  )

  // Processo que está atualmente sendo manipulado ou executado
  const [processoAtual, setProcessoAtual] =
    useState<ProcessoAtualAttributes | null>(null)

  // Atualiza dinamicamente um campo da configuração do escalonador
  const handleChangeSchedulerConfiguration = (
    name: keyof SchedulerConfiguration,
    value: number | null | Algoritmo
  ) => {
    setSchedulerConfiguration((prevValue) => ({
      ...prevValue,
      [name]: value ?? null
    }))
  }

  // Avança para o próximo passo (ex: do cadastro para a configuração)
  const handleNextStep = () => {
    setCurrentIndexStep((prevIndexStep) => prevIndexStep + 1)
  }

  // Regras para liberar o avanço entre as etapas
  const RELEASE_STEP: Record<number, boolean> = {
    // Só libera a etapa de configuração se houver processos cadastrados
    [STEPS.CONFIGURAR_ESCALONADOR]: processos.length > 0,

    // Só libera a execução se houver um algoritmo e parâmetros válidos
    [STEPS.EXECUCAO]: Boolean(
      schedulerConfiguration.algoritmo &&
        schedulerConfiguration.aging &&
        schedulerConfiguration.quantum &&
        schedulerConfiguration.aging > 0 &&
        schedulerConfiguration.quantum > 0
    )
  }

  // Determina se a próxima etapa está liberada
  const releaseNextStep = RELEASE_STEP[currentIndexStep + 1]

  // Volta para a etapa anterior
  const handlePrevStep = () => {
    setCurrentIndexStep((prevIndexStep) => prevIndexStep - 1)
  }

  // Cadastra um novo processo com ID incremental
  const cadastrarProcesso = ({
    duracao,
    momentoCriacao,
    prioridade
  }: Omit<ProcessoConstructor, 'id'>) => {
    setProcessos((prevData) => [
      ...prevData,
      new Processo({
        id: nextId,
        duracao,
        momentoCriacao,
        prioridade
      })
    ])
    setNextId((prevNextId) => prevNextId + 1)
  }

  // Edita um processo já existente (substitui pelo novo estado)
  const editarProcesso = (processoAtual: ProcessoAtualAttributes) => {
    setProcessos((prevData) =>
      prevData.map((processo) => {
        if (processo.id === processoAtual.id) {
          const { index, ...rest } = processoAtual
          return rest as Processo
        }
        return processo
      })
    )
  }

  // Remove um processo pelo ID
  const removerProcesso = (id: number) => {
    setProcessos((prevData) =>
      prevData.filter((processo) => processo.id !== id)
    )
  }

  // Atualiza dinamicamente uma propriedade do processo atual
  const handleChangeProcessoAtual = (
    name: keyof ProcessoAtualAttributes,
    value: number | null
  ) => {
    if (processoAtual)
      setProcessoAtual({
        ...processoAtual,
        [name]: value
      })
  }

  // Define o processo atual em execução (com índice na lista)
  const handleAddProcessoAtual = (processo: Processo, index: number) => {
    setProcessoAtual({
      ...processo,
      index
    } as ProcessoAtualAttributes)
  }

  // Retorna o Provider com todos os valores e funções disponíveis globalmente
  return (
    <EscalonadorContext.Provider
      value={{
        removerProcesso,
        processos,
        releaseNextStep,
        editarProcesso,
        cadastrarProcesso,
        processoAtual,
        handleChangeProcessoAtual,
        handleAddProcessoAtual,
        handleNextStep,
        handlePrevStep,
        currentIndexStep,
        handleChangeSchedulerConfiguration,
        schedulerConfiguration
      }}
    >
      {children}
    </EscalonadorContext.Provider>
  )
}

// Hook personalizado para acessar o contexto facilmente
export const useEscalonadorContext = () => {
  const context = useContext(EscalonadorContext)

  // Se alguém tentar usar o hook fora do Provider, lança um erro explicativo
  if (!context)
    throw new Error(
      'Utilize o provider EscalonadorProvider para ter acesso aos recursos do escalonador'
    )

  return context
}
