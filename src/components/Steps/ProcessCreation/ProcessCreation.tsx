import { useState } from 'react'
import { useEscalonadorContext } from '../../../context/EscalonadorContext'
import EditarProcessoModal from '../../Modal/EditarProcessoModal'
import ProcessCreationModal from '../../Modal/ProcessCreationModal'
import { ProcessTable } from '../../ProcessoTable/ProcessoTable'
import type { Processo } from '../../../domain/entities/Processo'
import { PlusIcon } from '@heroicons/react/24/solid'

const ProcessCreation = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)

  const { handleAddProcessoAtual } = useEscalonadorContext()

  const handleClickEditAction = (processo: Processo, index: number) => {
    handleAddProcessoAtual(processo, index)
    setOpenEditModal(true)
  }

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true)
  }

  return (
    <div className="divide-y mt-4 divide-gray-200 overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="p-4">
        <div className="flex justify-between gap-2 items-center">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Lista de Processos
            </h3>
          </div>
          <div>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="cursor-pointer rounded-full bg-gray-600 p-2 text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              <PlusIcon aria-hidden="true" className="size-5" />
            </button>
            {/* <button
              type="button"
              onClick={handleOpenCreateModal}
              className="relative inline-flex cursor-pointer items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Criar processo
            </button> */}
          </div>
        </div>
      </div>
      <div className="p-3 overflow-auto">
        <ProcessTable onEdit={handleClickEditAction} />
      </div>
      <ProcessCreationModal
        open={openCreateModal}
        setOpen={setOpenCreateModal}
      />
      <EditarProcessoModal open={openEditModal} setOpen={setOpenEditModal} />
    </div>
  )
}

export default ProcessCreation
