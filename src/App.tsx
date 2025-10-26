import Topbar from './components/Topbar/Topbar'
import Progress from './components/Progress/Progress'
import ProcessCreation from './components/Steps/ProcessCreation/ProcessCreation'
import { STEPS, useEscalonadorContext } from './context/EscalonadorContext'
import { type ReactNode } from 'react'
import SchedulerConfiguration from './components/Steps/SchedulerConfiguration/SchedulerConfiguration'
import Execution from './components/Steps/Execution/Execution'

const steps = [
  { id: STEPS.CADASTRAR_PROCESSOS, name: 'Cadastrar processos' },
  { id: STEPS.CONFIGURAR_ESCALONADOR, name: 'Configurar escalonador' },
  { id: STEPS.EXECUCAO, name: 'Execução' }
]

const App = () => {
  const { handleNextStep, handlePrevStep, releaseNextStep, currentIndexStep } =
    useEscalonadorContext()

  const STEP_COMPONENTS: Record<number, ReactNode> = {
    [STEPS.CADASTRAR_PROCESSOS]: <ProcessCreation />,
    [STEPS.CONFIGURAR_ESCALONADOR]: <SchedulerConfiguration />,
    [STEPS.EXECUCAO]: <Execution />
  }

  return (
    <div>
      <Topbar />
      <div className="bg-gray-100 min-h-screen h-full pb-4">
        <Progress steps={steps} currentStepIndex={currentIndexStep} />
        <div className="max-w-4xl px-2 mx-auto pt-4 font-bold">
          <div className="flex max-md:flex-wrap mt-4 justify-between gap-2 items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {steps[currentIndexStep].name}
              </h2>
            </div>
            <div className="flex gap-2">
              {currentIndexStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="cursor-pointer rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
                >
                  Voltar
                </button>
              )}
              {currentIndexStep + 1 < STEPS.TOTAL_STEPS && (
                <button
                  type="button"
                  disabled={!releaseNextStep}
                  onClick={handleNextStep}
                  className="rounded-md not-disabled:cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed not-disabled:hover:bg-gray-500 cursor-pointer bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Próxima etapa
                </button>
              )}
            </div>
          </div>
          <main>{STEP_COMPONENTS[currentIndexStep]}</main>
        </div>
      </div>
    </div>
  )
}

export default App
