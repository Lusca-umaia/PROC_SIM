/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'

import { Processo } from '../../domain/entities/Processo'
import type {
  ProcessoAtualAttributes,
  ProcessoConstructor,
  ProcessoAttributes
} from '../../@types/Processo'
import type { Option } from '../../components/Select/Select'
import type { TiposDeAlgoritmos } from '../../utils/constants'

interface EscalonadorProviderProps {
  children: React.ReactNode
}

export enum STEPS {
  CADASTRAR_PROCESSOS,
  CONFIGURAR_ESCALONADOR,
  EXECUCAO,
  TOTAL_STEPS
}

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

export interface Algoritmo extends Option {
  value: TiposDeAlgoritmos
}

interface SchedulerConfiguration {
  algoritmo: Algoritmo | null
  quantum: number | null
  aging: number | null
}

const initialConfiguration = {
  algoritmo: null,
  quantum: null,
  aging: null
}

const EscalonadorContext = createContext<EscalonadorType | null>(null)

export const EscalonadorProvider: React.FC<EscalonadorProviderProps> = ({
  children
}) => {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [nextId, setNextId] = useState<number>(1)
  const [schedulerConfiguration, setSchedulerConfiguration] =
    useState<SchedulerConfiguration>(initialConfiguration)

  const [currentIndexStep, setCurrentIndexStep] = useState<number>(
    STEPS.CADASTRAR_PROCESSOS
  )
  const [processoAtual, setProcessoAtual] =
    useState<ProcessoAtualAttributes | null>(null)

  const handleChangeSchedulerConfiguration = (
    name: keyof SchedulerConfiguration,
    value: number | null | Algoritmo
  ) => {
    setSchedulerConfiguration((prevValue) => ({
      ...prevValue,
      [name]: value ?? null
    }))
  }

  const handleNextStep = () => {
    setCurrentIndexStep((prevIndexStep) => prevIndexStep + 1)
  }
  const RELEASE_STEP: Record<number, boolean> = {
    [STEPS.CONFIGURAR_ESCALONADOR]: processos.length > 0,
    [STEPS.EXECUCAO]: Boolean(
      schedulerConfiguration.algoritmo &&
        schedulerConfiguration.aging &&
        schedulerConfiguration.quantum &&
        schedulerConfiguration.aging > 0 &&
        schedulerConfiguration.quantum > 0
    )
  }

  const releaseNextStep = RELEASE_STEP[currentIndexStep + 1]

  const handlePrevStep = () => {
    setCurrentIndexStep((prevIndexStep) => prevIndexStep - 1)
  }

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

  const removerProcesso = (id: number) => {
    setProcessos((prevData) =>
      prevData.filter((processo) => processo.id !== id)
    )
  }

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

  const handleAddProcessoAtual = (processo: Processo, index: number) => {
    setProcessoAtual({
      ...processo,
      index
    } as ProcessoAtualAttributes)
  }

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

export const useEscalonadorContext = () => {
  const context = useContext(EscalonadorContext)
  if (!context)
    throw new Error(
      'Utilize o provider EscalonadorProvider para ter acesso aos recursos do escalonador'
    )
  return context
}
