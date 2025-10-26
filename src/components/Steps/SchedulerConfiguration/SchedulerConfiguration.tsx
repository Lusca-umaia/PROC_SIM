import Select from '../../Select/Select'
import { SCHEDULER_OPTIONS } from '../../../utils/constants'
import Input from '../../Input/Input'
import {
  useEscalonadorContext,
  type Algoritmo
} from '../../../context/EscalonadorContext'

const SchedulerConfiguration = () => {
  const { schedulerConfiguration, handleChangeSchedulerConfiguration } =
    useEscalonadorContext()

  return (
    <div className="divide-y mt-4 divide-gray-200 rounded-xl bg-white shadow-lg">
      <div className="p-4">
        <div className="flex justify-between gap-2 items-center">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Características do escalonador
            </h3>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <Select
          label="Algoritmo de escalonamento"
          options={SCHEDULER_OPTIONS}
          selected={schedulerConfiguration.algoritmo}
          setSelected={(value) =>
            handleChangeSchedulerConfiguration('algoritmo', value as Algoritmo)
          }
        />
        <Input
          label="Quantum"
          name="quantum"
          placeholder="0"
          min={1}
          onChange={(value) =>
            handleChangeSchedulerConfiguration(
              'quantum',
              value ? Number(value) : null
            )
          }
          value={schedulerConfiguration.quantum?.toString()}
        />
        <Input
          label="Envelhecimento (Aging)"
          name="aging"
          min={1}
          placeholder="0"
          onChange={(value) =>
            handleChangeSchedulerConfiguration(
              'aging',
              value ? Number(value) : null
            )
          }
          value={schedulerConfiguration.aging?.toString()}
        />
      </div>
    </div>
  )
}

export default SchedulerConfiguration
