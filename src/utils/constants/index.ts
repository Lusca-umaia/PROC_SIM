export const processFields = [
  {
    name: 'momentoCriacao',
    label: 'Momento de Criação'
  },
  {
    name: 'duracao',
    label: 'Duração'
  },
  {
    name: 'prioridade',
    label: 'Prioridade'
  }
] as const

export const SCHEDULER_OPTIONS = [
  {
    id: 1,
    name: 'FCFS (First Come, First Served)',
    value: 'FCFS'
  },
  {
    id: 2,
    name: 'Shortest Job First',
    value: 'SJF'
  },
  {
    id: 3,
    name: 'Shortest Remaining Time First',
    value: 'SRTF'
  },
  {
    id: 4,
    name: 'Por prioridade, sem preempção',
    value: 'PRIORITY_NON_PREEMPTIVE'
  },
  {
    id: 5,
    name: 'Por prioridade, com preempção por prioridade',
    value: 'PRIORITY_PREEMPTIVE'
  }
]

export type TiposDeAlgoritmos =
  | 'FCFS'
  | 'SJF'
  | 'SRTF'
  | 'PRIORITY_NON_PREEMPTIVE'
  | 'PRIORITY_PREEMPTIVE'
