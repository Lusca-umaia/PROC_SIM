const TableProcessCell: React.FC<{ value: number; isLast: boolean }> = ({
  value,
  isLast
}) => (
  <td
    className={`px-2 py-1 border-r border-gray-300 ${
      isLast ? 'border-b-0' : 'border-b border-gray-300'
    }`}
  >
    {value}
  </td>
)

export default TableProcessCell
