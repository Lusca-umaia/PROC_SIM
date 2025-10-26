import type { ProcessoConstructor } from '../../@types/Processo'

export class Processo {
  public id: number = 0
  public momentoCriacao: number | null = null
  public duracao: number | null = null
  public prioridade: number | null = null
  public tempoExecucao: number = 0
  public tempoFinalizacao: number = 0

  setMomentoCriacao(momentoCriacao: number) {
    this.momentoCriacao = momentoCriacao
  }

  setDuracao(duracao: number) {
    this.duracao = duracao
  }

  setId(id: number) {
    this.id = id
  }

  setPrioridade(prioridade: number) {
    this.prioridade = prioridade
  }

  constructor({
    id,
    momentoCriacao,
    duracao,
    prioridade
  }: ProcessoConstructor) {
    this.setMomentoCriacao(momentoCriacao)
    this.setId(id)
    this.setDuracao(duracao)
    this.setPrioridade(prioridade)
  }
}
