import { useEffect, useRef, useState } from 'react'
import { STEPS, useEscalonadorContext } from '../context/EscalonadorContext'
import { Processo } from '../domain/entities/Processo'
import { sortProcessos } from '../utils/algoritmos'

const ALGORITMOS_COOPERATIVOS = ['FCFS', 'SJF', 'PRIORITY_NON_PREEMPTIVE']

const useAlgoritmosDeEscalonamento = () => {
  const { processos, currentIndexStep, schedulerConfiguration } =
    useEscalonadorContext()

  const [queue, setQueue] = useState<Processo[]>([])
  const [processoAtual, setProcessoAtual] = useState<Processo | null>(null)
  const [processosAtivos, setProcessosAtivos] = useState<Processo[]>([])
  const [isLiberado, setIsLiberado] = useState(true)
  const [historicoDeExecucao, setHistoricoDeExecucao] = useState<
    (number | null)[]
  >([])

  const [finalizados, setFinalizados] = useState<Processo[]>([])
  const [tempoDecorrido, setTempoDecorrido] = useState(0)

  const intervalRef = useRef<number | null>(null)

  const isCooperativo = ALGORITMOS_COOPERATIVOS.find(
    (algoritmo) => algoritmo === schedulerConfiguration.algoritmo!.value
  )

  const prontosOuEmExecucao = sortProcessos(
    processosAtivos.filter(
      ({ momentoCriacao, tempoFinalizacao }) =>
        momentoCriacao !== null &&
        momentoCriacao <= tempoDecorrido &&
        // processoAtual?.id !== id &&
        tempoFinalizacao === 0 // Significa que o processo ainda não terminou
    ),
    schedulerConfiguration.algoritmo!.value,
    processoAtual
  )

  const tudoFinalizado = finalizados.length === processos.length

  const programados = processosAtivos.filter(
    ({ momentoCriacao }) => momentoCriacao! > tempoDecorrido
  )

  useEffect(() => {
    if (currentIndexStep !== STEPS.EXECUCAO) return

    intervalRef.current = setInterval(() => {
      setTempoDecorrido((prev) => prev + 1)
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentIndexStep])

  useEffect(() => {
    if (currentIndexStep !== STEPS.EXECUCAO) return

    const processosPendentes = processosAtivos.filter(
      ({ duracao, tempoExecucao }) => duracao !== tempoExecucao
    )

    if (processosPendentes.length === 0) return

    let fila = isLiberado
      ? processosAtivos.filter(
          ({ duracao, tempoExecucao, momentoCriacao }) =>
            duracao !== tempoExecucao && momentoCriacao! < tempoDecorrido
        )
      : queue

    if (fila.length > 0 && isLiberado) {
      fila = sortProcessos(
        fila,
        schedulerConfiguration.algoritmo!.value,
        processoAtual
      )

      setQueue(() => [...fila])

      setProcessoAtual(fila[0] ? ({ ...fila[0] } as Processo) : null)
      if (isCooperativo) setIsLiberado(false)
    }

    const atual = fila[0]

    setHistoricoDeExecucao((prev) => [
      ...prev,
      !atual || atual.momentoCriacao! >= tempoDecorrido ? null : atual.id
    ])

    if (atual && atual.momentoCriacao! < tempoDecorrido) {
      setProcessoAtual(
        () =>
          ({
            ...atual,
            tempoExecucao: atual.tempoExecucao + 1,
            tempoFinalizacao:
              atual.tempoExecucao + 1 === atual.duracao
                ? tempoDecorrido
                : atual.tempoFinalizacao
          } as Processo)
      )
      // Atualiza tempo de execução e finalização
      setProcessosAtivos((prev) =>
        prev.map((p) =>
          p.id === atual.id
            ? ({
                ...p,
                tempoExecucao: p.tempoExecucao + 1,
                tempoFinalizacao:
                  p.tempoExecucao + 1 === p.duracao
                    ? tempoDecorrido
                    : p.tempoFinalizacao
              } as Processo)
            : p
        )
      )

      const novaFila = fila.map((p, idx) => {
        if (idx === 0) {
          const tempoExecucao = p.tempoExecucao + 1
          return {
            ...p,
            tempoExecucao,
            tempoFinalizacao:
              tempoExecucao === p.duracao ? tempoDecorrido : p.tempoFinalizacao
          }
        }
        return p
      }) as Processo[]

      const concluidos = novaFila.filter(
        ({ tempoExecucao, duracao }) => tempoExecucao === duracao
      )
      if (concluidos.length > 0) {
        setFinalizados((prev) => [...prev, ...concluidos])
      }

      setQueue(
        novaFila.filter(
          ({ tempoExecucao, duracao }) => tempoExecucao !== duracao
        )
      )

      if (novaFila[0].tempoExecucao === novaFila[0].duracao) {
        if (isCooperativo) {
          setIsLiberado(true)

          setProcessoAtual(novaFila.at(1) ?? null)
        }

        const restantes = processosAtivos.filter(
          ({ duracao, tempoExecucao }) => duracao !== tempoExecucao
        )

        if (restantes.length === 1 && intervalRef.current) {
          setProcessoAtual(null)
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [tempoDecorrido])

  useEffect(() => {
    setProcessosAtivos([...processos])

    const inicial = sortProcessos(
      processos.filter((p) => p.momentoCriacao! <= 0),
      schedulerConfiguration.algoritmo!.value,
      processoAtual
    )[0]

    setProcessoAtual(inicial ?? null)
  }, [processos])

  return {
    queue,
    finalizados,
    processoAtual,
    tempoDecorrido,
    historicoDeExecucao,
    processosAtivos,
    prontosOuEmExecucao,
    tudoFinalizado,
    programados
  }
}

export default useAlgoritmosDeEscalonamento
