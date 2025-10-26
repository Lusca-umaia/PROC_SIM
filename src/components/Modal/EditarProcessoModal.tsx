import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Input from '../Input/Input'
import { useEscalonadorContext } from '../../context/EscalonadorContext'
import { processFields } from '../../utils/constants'

interface ModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const EditarProcessoModal: React.FC<ModalProps> = ({ open, setOpen }) => {
  const { editarProcesso, handleChangeProcessoAtual, processoAtual } =
    useEscalonadorContext()

  const isFormValid =
    processFields.every(
      ({ name }) =>
        processoAtual &&
        processoAtual[name] !== null &&
        !Number.isNaN(Number(processoAtual[name]))
    ) &&
    processoAtual!.prioridade > 0 &&
    processoAtual!.duracao > 0

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (processoAtual)
      editarProcesso({
        ...processoAtual,
        duracao: processoAtual.duracao,
        momentoCriacao: processoAtual.momentoCriacao,
        prioridade: processoAtual.prioridade
      })

    setOpen(false)
  }

  return (
    <div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden max-w-lg rounded-lg bg-white p-4 text-left shadow-xl transition-all"
            >
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">
                        # {processoAtual && processoAtual.index + 1} - Editar
                        processo
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md cursor-pointer bg-white text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-gray-600"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                  <div></div>
                  <div className="mt-3 sm:mt-5">
                    {processoAtual && (
                      <div className="flex flex-col gap-2">
                        {processFields.map((field) => (
                          <Input
                            key={field.name}
                            min={0}
                            required
                            label={field.label}
                            name={field.name}
                            placeholder="0"
                            onChange={(value) =>
                              handleChangeProcessoAtual(
                                field.name,
                                value ? Number(value) : null
                              )
                            }
                            value={processoAtual[field.name]}
                          />
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Preencha as informações necessárias para editar o
                        processo.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className="inline-flex not-disabled:cursor-pointer disabled:opacity-80 w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-xs disabled:cursor-not-allowed not-disabled:hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default EditarProcessoModal
