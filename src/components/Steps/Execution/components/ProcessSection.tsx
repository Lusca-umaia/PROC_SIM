import { motion, AnimatePresence } from 'framer-motion'
import ProcessCard from './ProcessCard'
import { Processo } from '../../../../domain/entities/Processo'

interface ProcessSectionProps {
  title: string
  processos: Processo[]
  emptyMessage: string
  processosFinalizados?: boolean
}

const ProcessSection: React.FC<ProcessSectionProps> = ({
  title,
  processos,
  emptyMessage,
  processosFinalizados
}) => (
  <div className="bg-white p-4 rounded-xl shadow-md">
    <h3 className="font-bold mb-2">{title}</h3>
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {processos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.2 }}
          >
            <p className="my-3 text-center text-gray-600">{emptyMessage}</p>
          </motion.div>
        ) : (
          processos.map((processo) => (
            <ProcessCard
              key={processo.id}
              processosFinalizados={processosFinalizados}
              processo={processo}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  </div>
)

export default ProcessSection
