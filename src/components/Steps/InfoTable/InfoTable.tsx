import React from 'react'

interface InfoTableProps {
  title?: string
  headers: string[]
  rows: (string | number | React.ReactNode)[]
}

const InfoTable: React.FC<InfoTableProps> = ({ title, headers, rows }) => {
  return (
    <div className="flex items-center flex-col gap-2 bg-white p-4 rounded-xl">
      {title && <h3>{title}</h3>}
      <div className="overflow-auto flex-1 w-full rounded-lg border border-gray-200">
        <table className="w-full text-sm text-gray-700 overflow-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="py-2 px-3 border-r font-bold text-left text-gray-700 border-b border-gray-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="divide-x divide-gray-200">
              {rows.map((cell, i) => (
                <td
                  key={i}
                  className="py-2 px-3 bg-white font-bold text-gray-600"
                >
                  {typeof cell === 'object' ? cell : <span>{cell}</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InfoTable
