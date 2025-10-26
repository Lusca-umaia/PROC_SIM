import type { InputHTMLAttributes } from 'react'

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  name: string
  value?: number | string
  onChange: (value: string) => void
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  ...props
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2 grid grid-cols-1">
        <input
          id={name}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          name={name}
          required
          type="number"
          placeholder={placeholder}
          className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-10 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pr-9 sm:text-sm/6"
          {...props}
        />
      </div>
    </div>
  )
}

export default Input
