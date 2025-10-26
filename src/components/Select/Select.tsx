import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'

export interface Option {
  id: number
  name: string
  value: string
}

interface SelectProps {
  options: Option[]
  label: string
  selected: Option | null
  setSelected: React.Dispatch<React.SetStateAction<Option | null>>
}

const Select: React.FC<SelectProps> = ({
  options,
  selected,
  setSelected,
  label
}) => {
  return (
    <div>
      <Listbox value={selected} onChange={setSelected}>
        <Label className="block text-sm/6 font-medium text-gray-900">
          {label}
        </Label>
        <div className="relative mt-2">
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6">
            <span
              className={`font-medium col-start-1 row-start-1 ${
                !selected && 'text-gray-400'
              } truncate pr-6`}
            >
              {selected ? selected.name : 'Selecione'}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.id}
                value={option}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
              >
                <span className="block truncate font-normal group-data-selected:font-semibold">
                  {option.name}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}

export default Select
