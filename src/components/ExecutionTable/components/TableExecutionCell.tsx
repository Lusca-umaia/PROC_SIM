import type { Processo } from '../../../domain/entities/Processo'

const colorPalette = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-400',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-400'
]

const getColor = (numeroDoProcesso: number) => {
  if (numeroDoProcesso === null) return 'bg-gray-100'
  const index = numeroDoProcesso % colorPalette.length
  return colorPalette[index]
}

interface TableExecutionCellProps {
  atual: number | null
  processo: Processo
  isLast: boolean
  timeIndex: number
  isFirst: boolean
}

const TableExecutionCell: React.FC<TableExecutionCellProps> = ({
  atual,
  processo,
  isLast,
  isFirst,
  timeIndex
}) => {
  const isRunning = atual === processo.id
  const isWaiting =
    !isRunning &&
    processo.momentoCriacao! <= timeIndex &&
    timeIndex < processo.tempoFinalizacao

  const bgColor = isRunning
    ? getColor(processo.id)
    : isWaiting
    ? 'bg-gray-400/80'
    : 'bg-white'

  return (
    <td
      className={`px-2 py-1 ${bgColor} ${
        isLast ? 'border-b-0' : 'border-b border-gray-300'
      } ${isFirst ? '' : 'border-l border-gray-300'}`}
    ></td>
  )
}

export default TableExecutionCell
