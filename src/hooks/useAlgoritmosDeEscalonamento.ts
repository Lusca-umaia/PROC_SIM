// Importa dependências principais: React, contexto do escalonador, classe Processo e função de ordenação
import { useEffect, useRef, useState } from 'react'
import { STEPS, useEscalonadorContext } from '../context/EscalonadorContext'
import { Processo } from '../domain/entities/Processo'
import { sortProcessos } from '../utils/algoritmos'

// Define os algoritmos cooperativos, ou seja, que não interrompem o processo em execução
export const ALGORITMOS_COOPERATIVOS = [
  'FCFS',
  'SJF',
  'PRIORITY_NON_PREEMPTIVE'
]

interface AlgoritmosDeEscalonamentoProps {
  processos: Processo[]
}

const useAlgoritmosDeEscalonamento = ({
  processos
}: AlgoritmosDeEscalonamentoProps) => {
  // Obtém dados e configurações globais do contexto
  const { currentIndexStep, schedulerConfiguration } = useEscalonadorContext()

  const [processosAtivos, setProcessosAtivos] = useState<Processo[]>(processos) // todos os processos ativos
  const [isLiberado, setIsLiberado] = useState(true) // controla se o CPU está livre
  const [historicoDeExecucao, setHistoricoDeExecucao] = useState<
    (number | null)[]
  >([]) // log de execução
  const [processoAtual, setProcessoAtual] = useState<Processo | null>(null)

  const [tempoDecorrido, setTempoDecorrido] = useState(0) // tempo global do escalonamento

  const intervalRef = useRef<number | null>(null) // referência pro intervalo de tempo (tick do relógio)

  // Verifica se o algoritmo atual é cooperativo
  const isCooperativo = ALGORITMOS_COOPERATIVOS.find(
    (algoritmo) => algoritmo === schedulerConfiguration.algoritmo!.value
  )

  const finalizados = processosAtivos.filter(
    ({ duracao, tempoExecucao }) => tempoExecucao === duracao
  )

  // Seleciona processos prontos ou em execução, ordenados conforme o algoritmo escolhido
  const prontosOuEmExecucao = sortProcessos(
    processosAtivos.filter(
      ({ momentoCriacao, tempoFinalizacao }) =>
        momentoCriacao !== null &&
        momentoCriacao <= tempoDecorrido &&
        tempoFinalizacao === 0 // ainda não terminou
    ),
    schedulerConfiguration.algoritmo!.value,
    isLiberado,
    processoAtual
  )

  // Verifica se todos já foram concluídos
  const tudoFinalizado = finalizados.length === processos.length

  // Processos que ainda não atingiram o momento de criação
  const programados = processosAtivos.filter(
    ({ momentoCriacao }) => momentoCriacao! > tempoDecorrido
  )

  // Inicia o relógio (tempoDecorrido) quando o escalonamento entra na etapa de execução
  useEffect(() => {
    if (currentIndexStep !== STEPS.EXECUCAO) return

    intervalRef.current = setInterval(() => {
      setTempoDecorrido((prev) => prev + 1)
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentIndexStep])

  // Lógica principal de execução — chamada a cada segundo (tempoDecorrido muda)
  useEffect(() => {
    if (currentIndexStep !== STEPS.EXECUCAO || tempoDecorrido === 0) return

    const processosPendentes = processosAtivos.filter(
      ({ duracao, tempoExecucao }) => duracao !== tempoExecucao
    )

    if (processosPendentes.length === 0) return

    let fila = sortProcessos(
      processosAtivos.filter(
        ({ duracao, tempoExecucao, momentoCriacao }) =>
          duracao !== tempoExecucao && momentoCriacao! < tempoDecorrido
      ),
      schedulerConfiguration.algoritmo!.value,
      isLiberado,
      processoAtual
    )

    if (fila.length > 0 && isLiberado) {
      const processosAtivosOrdenados = sortProcessos(
        processosAtivos,
        schedulerConfiguration.algoritmo!.value,
        isLiberado,
        processoAtual
      )

      fila = processosAtivosOrdenados.filter(
        ({ duracao, tempoExecucao, momentoCriacao }) =>
          duracao !== tempoExecucao && momentoCriacao! < tempoDecorrido
      )

      setProcessosAtivos(() => [...processosAtivosOrdenados])
      setProcessoAtual({ ...fila[0] } as Processo)

      if (isCooperativo) setIsLiberado(false)
    }

    const atual = fila[0]

    setHistoricoDeExecucao((prev) => [
      ...prev,
      !atual || atual.momentoCriacao! >= tempoDecorrido ? null : atual.id
    ])

    if (atual && atual.momentoCriacao! < tempoDecorrido) {
      // Atualiza a lista geral de processos ativos
      const processoAtualTerminou = atual.tempoExecucao + 1 === atual.duracao

      const newProcessoAtual = {
        ...atual,
        tempoExecucao: atual.tempoExecucao + 1,
        tempoFinalizacao: processoAtualTerminou ? tempoDecorrido : 0
      }

      setProcessosAtivos((prev) =>
        prev.map((p) =>
          p.id === atual.id ? ({ ...newProcessoAtual } as Processo) : p
        )
      )

      if (processoAtualTerminou) {
        if (isCooperativo) {
          setIsLiberado(true)
        }

        setProcessoAtual(null)

        if (
          finalizados.length === processos.length - 1 &&
          intervalRef.current
        ) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [tempoDecorrido])

  return {
    finalizados,
    tempoDecorrido,
    historicoDeExecucao,
    processosAtivos,
    prontosOuEmExecucao,
    tudoFinalizado,
    programados
  }
}

export default useAlgoritmosDeEscalonamento
