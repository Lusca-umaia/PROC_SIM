import { motion } from 'framer-motion'
import type { Processo } from '../../../../domain/entities/Processo'

interface ProcessCardProps {
  processo: Processo
  processosFinalizados?: boolean
}

interface InfoProps {
  label: string
  value: number | null
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  processo,
  processosFinalizados
}) => {
  const progresso = (
    (processo.tempoExecucao * 100) /
    processo.duracao!
  ).toFixed(2)

  return (
    <motion.div
      key={processo.id}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid max-md:grid-cols-1 max-md:gap-y-2 grid-cols-5 md:gap-2">
        <div className="flex col-span-4 flex-1 justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-col gap-2">
          <div className="flex justify-between">
            <p># {processo.id}</p>
            <p>{progresso}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
            <div
              className="bg-blue-500 duration-500 h-3"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>
        <div className="flex bg-white shadow-sm p-2 rounded-xl border border-gray-300 flex-col gap-1">
          <Info label="Início" value={processo.momentoCriacao} />
          <Info label="Duração" value={processo.duracao} />
          <Info label="Prioridade" value={processo.prioridade} />
          {processosFinalizados && (
            <Info label="Término" value={processo.tempoFinalizacao} />
          )}
        </div>
      </div>
    </motion.div>
  )
}

const Info: React.FC<InfoProps> = ({ label, value }) => (
  <p className="text-sm gap-4 flex justify-between font-bold">
    {label}: <span className="text-gray-600">{value}</span>
  </p>
)

export default ProcessCard
