import { CheckIcon } from '@heroicons/react/24/solid'

type StepStatus = 'complete' | 'current' | 'upcoming'

interface Step {
  id: number
  name: string
}

interface ProgressProps {
  steps: Step[]
  currentStepIndex: number
}

const StepItem = ({ step, status }: { step: Step; status: StepStatus }) => {
  const baseClasses =
    'flex items-center px-6 py-4 text-sm font-medium transition-colors duration-150'

  const renderStepContent = () => {
    switch (status) {
      case 'complete':
        return (
          <div className="group flex w-full items-center">
            <span className={baseClasses}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-600 ">
                <CheckIcon aria-hidden="true" className="size-6 text-white" />
              </span>
              <span className="ml-4 text-sm font-medium text-gray-900">
                {step.name}
              </span>
            </span>
          </div>
        )

      case 'current':
        return (
          <div className={baseClasses}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-600">
              <span className="text-gray-600">{step.id + 1}</span>
            </span>
            <span className="ml-4 text-sm font-medium text-gray-600">
              {step.name}
            </span>
          </div>
        )

      case 'upcoming':
      default:
        return (
          <div className="group flex items-center">
            <span className={baseClasses}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 ">
                <span className="text-gray-500">{step.id + 1}</span>
              </span>
              <span className="ml-4 text-sm font-medium text-gray-500">
                {step.name}
              </span>
            </span>
          </div>
        )
    }
  }

  return (
    <li className="relative md:flex md:flex-1">
      {renderStepContent()}

      <div
        aria-hidden="true"
        className="absolute top-0 right-0 hidden h-full w-5 md:block"
      >
        <svg
          fill="none"
          viewBox="0 0 22 80"
          preserveAspectRatio="none"
          className="size-full text-gray-300"
        >
          <path
            d="M0 -2L20 40L0 82"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </li>
  )
}

export const Progress = ({ steps, currentStepIndex }: ProgressProps) => {
  return (
    <nav className="bg-white divide-gray-300 border-b shadow-sm border-gray-300">
      <ol
        role="list"
        className="max-w-4xl mx-auto divide-y divide-gray-300 md:flex md:divide-y-0"
      >
        {steps.map((step, index) => {
          let status: StepStatus = 'upcoming'
          if (index < currentStepIndex) status = 'complete'
          else if (index === currentStepIndex) status = 'current'

          return <StepItem key={step.id} step={step} status={status} />
        })}
      </ol>
    </nav>
  )
}

export default Progress
