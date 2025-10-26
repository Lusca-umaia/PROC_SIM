import React from 'react'
import { useEscalonadorContext } from '../../context/EscalonadorContext'
import type { Processo } from '../../domain/entities/Processo'

interface ProcessTableProps {
  onEdit: (processo: Processo, index: number) => void
}

const columns = [
  'ID',
  'Momento de Criação',
  'Duração',
  'Prioridade',
  'Ações'
] as const

export const ProcessTable: React.FC<ProcessTableProps> = ({ onEdit }) => {
  const { processos, removerProcesso } = useEscalonadorContext()

  return (
    <table className="relative min-w-full divide-y divide-gray-300">
      <thead>
        <tr className="divide-x divide-gray-300">
          {columns.map((column) => (
            <th
              key={column}
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 first:pl-4 first:sm:pl-0 first:pr-3"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {processos.length === 0 ? (
          <tr>
            <td colSpan={5}>
              <p className="my-3 text-center text-gray-600">
                Nenhum processo cadastrado :(
              </p>
            </td>
          </tr>
        ) : (
          processos.map((processo, index) => (
            <tr key={processo.id} className="divide-x divide-gray-300">
              <td className="py-4 pr-3 pl-4 text-sm font-bold whitespace-nowrap text-gray-500 sm:pl-0">
                # {processo.id}
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {processo.momentoCriacao}
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {processo.duracao}
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {processo.prioridade}
              </td>
              <td className="py-4 pr-4 pl-3 text-right text-sm flex gap-4 font-medium whitespace-nowrap sm:pr-0">
                <button
                  onClick={() => onEdit(processo, index)}
                  type="button"
                  className="cursor-pointer text-gray-600 hover:text-gray-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => removerProcesso(processo.id)}
                  type="button"
                  className="cursor-pointer text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
