// Importa a entidade Processo do domínio
import { Processo } from '../../domain/entities/Processo'
// Importa o tipo TiposDeAlgoritmos para definir os algoritmos de escalonamento
import type { TiposDeAlgoritmos } from '../constants'

// Função para ordenar processos com base no algoritmo de escalonamento
export const sortProcessos = (
  processos: Processo[], // Lista de processos a serem ordenados
  tipo: TiposDeAlgoritmos, // Tipo de algoritmo (FCFS, SJF, SRTF, PRIORITY_NON_PREEMPTIVE, PRIORITY_PREEMPTIVE)
  processoAtual?: Processo | null // Processo atualmente em execução (opcional)
): Processo[] => {
  // Cria uma cópia da lista de processos para evitar mutação direta
  const clone = [...processos]

  // Função auxiliar para calcular o tempo restante de um processo
  const tempoRestante = (p: Processo) => p.duracao! - p.tempoExecucao!

  // Ordena a lista de processos com base no algoritmo especificado
  return clone.sort((a, b) => {
    switch (tipo) {
      // FCFS (First-Come, First-Served): ordena por momento de criação
      case 'FCFS':
        if (a.momentoCriacao! !== b.momentoCriacao!)
          return a.momentoCriacao! - b.momentoCriacao! // Menor momento de criação vem primeiro
        break

      // SJF (Shortest Job First): ordena por duração total do processo
      case 'SJF':
        if (a.duracao! !== b.duracao!) return a.duracao! - b.duracao! // Menor duração vem primeiro
        break

      // SRTF (Shortest Remaining Time First): ordena por tempo restante
      case 'SRTF':
        if (tempoRestante(a) !== tempoRestante(b))
          return tempoRestante(a) - tempoRestante(b) // Menor tempo restante vem primeiro
        break

      // PRIORITY_NON_PREEMPTIVE e PRIORITY_PREEMPTIVE: ordena por prioridade
      case 'PRIORITY_NON_PREEMPTIVE':
      case 'PRIORITY_PREEMPTIVE':
        if (a.prioridade! !== b.prioridade!)
          return b.prioridade! - a.prioridade! // Maior prioridade vem primeiro (ordem decrescente)
        break
    }

    // Se há um processo atual, dá prioridade a ele para mantê-lo na frente
    if (processoAtual) {
      if (a.id === processoAtual.id) return -1 // Processo atual fica em primeiro
      if (b.id === processoAtual.id) return 1 // Processo atual fica em primeiro
    }

    // Desempate: ordena por tempo restante (menor tempo restante vem primeiro)
    const diffTempo = tempoRestante(a) - tempoRestante(b)
    if (diffTempo !== 0) return diffTempo

    // Último desempate: ordenação aleatória para evitar ordem fixa
    return Math.random() - 0.5
  })
}
