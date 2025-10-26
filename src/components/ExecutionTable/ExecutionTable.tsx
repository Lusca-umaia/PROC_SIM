import type { Processo } from '../../domain/entities/Processo'
import TableExecutionCell from './components/TableExecutionCell'
import TableHeaderCell from './components/TableHeaderCell'
import TableProcessCell from './components/TableProcessCell'

interface ExecutionTableProps {
  processos: Processo[]
  historicoDeExecucao: (number | null)[]
}

const ExecutionTable: React.FC<ExecutionTableProps> = ({
  processos,
  historicoDeExecucao
}) => {
  const processosOrdenados = processos.sort((a, b) => a.id - b.id)

  return (
    <div className="w-full">
      <div className="w-full bg-white rounded-xl border border-gray-200 overflow-auto">
        <table className="w-full border-collapse text-sm text-center">
          <thead>
            <tr>
              <TableHeaderCell>Processo</TableHeaderCell>
              {historicoDeExecucao.map((_, index) => (
                <TableHeaderCell key={index}>
                  {`${index} - ${index + 1}`}
                </TableHeaderCell>
              ))}
            </tr>
          </thead>

          <tbody>
            {processosOrdenados.map((processo, processIndex) => (
              <tr key={processo.id}>
                <TableProcessCell
                  isLast={processIndex === processos.length - 1}
                  value={processo.id}
                />

                {historicoDeExecucao.map((atual, timeIndex) => (
                  <TableExecutionCell
                    key={timeIndex}
                    atual={atual}
                    timeIndex={timeIndex}
                    processo={processo}
                    isLast={processIndex === processos.length - 1}
                    isFirst={timeIndex === 0}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex gap-2 items-center justify-center">
        <div className="bg-gray-400/80 rounded-sm h-4 w-4"></div>
        <p className="text-sm text-gray-600">Espera</p>
      </div>
    </div>
  )
}

export default ExecutionTable
