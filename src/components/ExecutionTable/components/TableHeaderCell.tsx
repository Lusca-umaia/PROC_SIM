const TableHeaderCell: React.FC<{ children: React.ReactNode }> = ({
  children
}) => (
  <th className="py-2 px-3 whitespace-nowrap font-bold text-gray-700 border-b bg-gray-100 border-r border-gray-300">
    {children}
  </th>
)

export default TableHeaderCell
