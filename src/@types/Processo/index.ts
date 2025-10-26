export interface ProcessoAttributes {
  id: number
  tempoExecucao: number
  tempoFinalizacao: number
  momentoCriacao: number
  duracao: number
  prioridade: number
}

export interface ProcessoAtualAttributes extends ProcessoAttributes {
  index: number
}

export type ProcessoConstructor = Omit<
  ProcessoAttributes,
  'tempoFinalizacao' | 'tempoExecucao'
>
