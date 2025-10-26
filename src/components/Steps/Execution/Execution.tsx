import { ClockIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import ExecutionTable from '../../ExecutionTable/ExecutionTable'
import useAlgoritmosDeEscalonamento from '../../../hooks/useAlgoritmosDeEscalonamento'
import { useEscalonadorContext } from '../../../context/EscalonadorContext'
import ProcessSection from './components/ProcessSection'
import { contarTrocas } from '../../../utils/functions'
import InfoTable from '../InfoTable/InfoTable'

const Execution: React.FC = () => {
  const { schedulerConfiguration } = useEscalonadorContext()

  const {
    finalizados,
    tempoDecorrido,
    historicoDeExecucao,
    prontosOuEmExecucao,
    tudoFinalizado,
    programados
  } = useAlgoritmosDeEscalonamento()

  const tempoMedioDeExecucao = (
    finalizados.reduce(
      (acc, current) =>
        acc + (current.tempoFinalizacao - current.momentoCriacao!),
      0
    ) / finalizados.length
  ).toFixed(2)

  const tempoMedioDeEspera = (
    finalizados.reduce(
      (acc, current) =>
        acc +
        (current.tempoFinalizacao - current.duracao! - current.momentoCriacao!),
      0
    ) / finalizados.length
  ).toFixed(2)

  const quantidadeDeTrocasDeContexto = contarTrocas(historicoDeExecucao)

  return (
    <div className="mt-4 flex flex-col gap-4">
      <InfoTable
        title="Informações/configurações"
        headers={['Tempo decorrido', 'Algoritmo', 'Quantum', 'Envelhecimento']}
        rows={[
          <span
            key="tempo"
            className="w-fit gap-1 ml-auto inline-flex text-base items-center rounded-md bg-gray-50 px-2 py-1 font-bold text-gray-600 inset-ring inset-ring-gray-500/10"
          >
            <ClockIcon className="w-5 h-6" />
            {tempoDecorrido}
          </span>,
          schedulerConfiguration.algoritmo!.name,
          schedulerConfiguration.quantum,
          schedulerConfiguration.aging
        ]}
      />

      {tudoFinalizado && (
        <InfoTable
          title="Estatísticas"
          headers={[
            'Turnaround time',
            'Waiting time',
            'Quant. de trocas de contexto'
          ]}
          rows={[
            tempoMedioDeExecucao,
            tempoMedioDeEspera,
            quantidadeDeTrocasDeContexto
          ]}
        />
      )}

      <AnimatePresence>
        {tudoFinalizado && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex gap-2 flex-col bg-white p-4 items-center rounded-xl">
              <h3>Diagrama de execução</h3>
              <ExecutionTable
                historicoDeExecucao={historicoDeExecucao}
                processos={finalizados}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProcessSection
        title="Prontos ou em execução"
        processos={prontosOuEmExecucao}
        emptyMessage="Nenhum processo pronto"
      />

      <ProcessSection
        title="Finalizados"
        processos={finalizados}
        emptyMessage="Nenhum processo finalizado"
        processosFinalizados
      />

      <ProcessSection
        title="Programados"
        processos={programados}
        emptyMessage="Nenhum processo programado"
      />
    </div>
  )
}

export default Execution
