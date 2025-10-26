// Importa dependências principais: React, contexto do escalonador, classe Processo e função de ordenação
import { useEffect, useRef, useState } from 'react'
import { STEPS, useEscalonadorContext } from '../context/EscalonadorContext'
import { Processo } from '../domain/entities/Processo'
import { sortProcessos } from '../utils/algoritmos'

// Define os algoritmos cooperativos, ou seja, que não interrompem o processo em execução
const ALGORITMOS_COOPERATIVOS = ['FCFS', 'SJF', 'PRIORITY_NON_PREEMPTIVE']

const useAlgoritmosDeEscalonamento = () => {
  // Obtém dados e configurações globais do contexto
  const { processos, currentIndexStep, schedulerConfiguration } =
    useEscalonadorContext()

  // Estados principais do escalonador
  const [queue, setQueue] = useState<Processo[]>([]) // fila de prontos
  const [processoAtual, setProcessoAtual] = useState<Processo | null>(null) // processo em execução
  const [processosAtivos, setProcessosAtivos] = useState<Processo[]>([]) // todos os processos ativos
  const [isLiberado, setIsLiberado] = useState(true) // controla se o CPU está livre
  const [historicoDeExecucao, setHistoricoDeExecucao] = useState<
    (number | null)[]
  >([]) // log de execução

  const [finalizados, setFinalizados] = useState<Processo[]>([]) // processos concluídos
  const [tempoDecorrido, setTempoDecorrido] = useState(0) // tempo global do escalonamento

  const intervalRef = useRef<number | null>(null) // referência pro intervalo de tempo (tick do relógio)

  // Verifica se o algoritmo atual é cooperativo
  const isCooperativo = ALGORITMOS_COOPERATIVOS.find(
    (algoritmo) => algoritmo === schedulerConfiguration.algoritmo!.value
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
    if (currentIndexStep !== STEPS.EXECUCAO) return

    const processosPendentes = processosAtivos.filter(
      ({ duracao, tempoExecucao }) => duracao !== tempoExecucao
    )
    if (processosPendentes.length === 0) return

    // Atualiza a fila: se o CPU está livre, busca novos processos prontos
    let fila = isLiberado
      ? processosAtivos.filter(
          ({ duracao, tempoExecucao, momentoCriacao }) =>
            duracao !== tempoExecucao && momentoCriacao! < tempoDecorrido
        )
      : queue

    // Se há algo pronto e CPU livre, seleciona o próximo processo conforme o algoritmo
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

    // Registra histórico: qual processo rodou nesse instante (ou null se nenhum)
    setHistoricoDeExecucao((prev) => [
      ...prev,
      !atual || atual.momentoCriacao! >= tempoDecorrido ? null : atual.id
    ])

    // Executa o processo atual (incrementa tempo de CPU e marca finalização se concluir)
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

      // Atualiza a lista geral de processos ativos
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

      // Atualiza a fila e move processos concluídos para a lista de finalizados
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

      // Remove da fila processos que já terminaram
      setQueue(
        novaFila.filter(
          ({ tempoExecucao, duracao }) => tempoExecucao !== duracao
        )
      )

      // Se o processo atual terminou, libera o CPU (para cooperativos) e escolhe o próximo
      if (novaFila[0].tempoExecucao === novaFila[0].duracao) {
        if (isCooperativo) {
          setIsLiberado(true)
          setProcessoAtual(novaFila.at(1) ?? null)
        }

        // Se só resta um processo, encerra o intervalo (tudo terminou)
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

  // Inicializa os processos e define o primeiro processo ativo ao carregar ou mudar lista
  useEffect(() => {
    setProcessosAtivos([...processos])

    const inicial = sortProcessos(
      processos.filter((p) => p.momentoCriacao! <= 0),
      schedulerConfiguration.algoritmo!.value,
      processoAtual
    )[0]

    setProcessoAtual(inicial ?? null)
  }, [processos])

  // Retorna os estados e listas úteis para visualização e controle
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
