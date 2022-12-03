import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon, ArrowPathRoundedSquareIcon, InformationCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

function randomKey() {
  return `${Math.floor(Math.random() * 100)}component ${Math.floor(Math.random() * 1000)}`;
}

const _CLASSES = {
  btn_text: 'text-xl font-semibold',
  default_btn: 'w-full h-full opacity-75 rounded-lg text-white shadow-lg',
  available_btn: 'bg-green-500 hover:bg-green-600 active:bg-green-700 hover:text-slate-100',
  taken_btn: 'bg-red-500 hover:bg-red-600 active:bg-red-700 hover:text-slate-100',
  section_div: 'bg-slate-100 relative flex justify-center content-start flex-row flex-wrap w-full h-full col-span-1',
  header_ctn: 'h-8 w-full relative bg-slate-800 shadow-lg',
  header_txt: 'text-2xl text-white font-semibold font-sans text-center tracking-tight',
  active_bounce: 'animate-bounce'
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function MainScreen() {
  const maxSections = 5;
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [openDeleteSection, setOpenDeleteSection] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [openToggle, setOpenToggle] = useState(false);
  const [sectionId, setSectionId] = useState('');
  const [sections, setSections] = useState([]);
  const cancelButtonRef = useRef(null)
  const didRender = useRef(false);
  const [info, setInfo] = useState({});
  const [addSectionAvailable, setAddSectionAvailable] = useState(true);
  const [waiterObj, setWaiterObj] = useState([])
  const [selected, setSelected] = useState(() => { return waiterObj[0] })

  useEffect(() => {
    if (!didRender.current) {
      window.data.getSectionsAsync().then((result) => {
        setSections(result);
        setAddSectionAvailable(result.length < maxSections);
      })

      window.data.getWaitersAsync().then((result) => {
        setWaiterObj(result);
      });
      didRender.current = true;
    }
  }, [])

  useEffect(() => {
    setSelected(waiterObj[0])
  }, [waiterObj])

  useEffect(() => {
  }, [selected])

  //#region TABLE EDITING FUNCTIONS
  function openDeleteModal(info) {
    setInfo(info)
    setOpenDelete(true);
  }

  function deleteTable() {
    window.data.deleteTableAsync(info).then((result) => {
      setSections(result);
      setOpenDelete(false);
    })
  }

  function toggleTable() {
    window.data.toggleTableAsync(info).then((result) => {
      setSections(result);
    })
  }

  function openAddModal(sectionId) {
    setSectionId(sectionId);
    setOpen(true)
  }

  function addTable() {
    let tableName = document.getElementById('tableName').value;

    if (tableName === "" || tableName === " ") {
      return;
    } else {
      window.data.addTableAsync({ sectionId: sectionId, tableName: tableName }).then((result) => {
        setSections(result);
      });
    }
  }
  //#endregion

  //#region SECTION EDITING FUNCTIONS
  function addSection() {
    let sectionName = document.getElementById('sectionName').value;

    if (sectionName === "" || sectionName === " ") {
      return;
    } else {
      let newSection = {
        sectionId: Math.random().toString(32).slice(2),
        sectionName: sectionName,
        tables: [],
        isFull: false,
        isActive: false,
        waiter: false,
        tableCount: 0
      }

      window.data.addSectionAsync({ newSection }).then((result) => {
        setSections(result);
        setAddSectionAvailable(result.length < maxSections);
        setOpenAddSection(false);
      });
    }
  }

  function deleteSection() {
    window.data.deleteSectionAsync(sectionId).then((result) => {
      setSections(result);
      setOpenDeleteSection(false);
      setAddSectionAvailable(result.length < maxSections);
    })
  }

  function assignWaiter() {
    window.data.assignWaiterAsync({ sectionId: sectionId, waiter: selected }).then((result) => {
      setSections(result);
      setOpenAssign(false);
    })
  }

  function resetCounter() {
    window.data.resetCounterAsync(sectionId).then((result) => {
      setSections(result);
      setOpenReset(false);
    })
  }

  function sectionMinusCount(sectionId){
    window.data.sectionCountDown(sectionId).then(result => {
      setSections(result);
    });
  }

  function sectionPlusCount(sectionId){
    window.data.sectionPlusCount(sectionId).then(result => {
      setSections(result);
    });
  }
  //#endregion

  return (
    <div className="w-full h-full grid grid-cols-5 relative overflow-hidden rounded-lg bg-white shadow ">
      {sections.map((section) => (
        <div key={section.sectionId} className={_CLASSES.section_div}>
          <div key={randomKey()} className={_CLASSES.header_ctn}>
            <button className='absolute top-1 left-12 rounded-full hover:bg-slate-600' onClick={() => {
              sectionPlusCount(section.sectionId);
            }}>
              <PlusCircleIcon className='h-6 w-6 text-white' />
            </button>
            <button className='absolute top-1 right-12 rounded-full hover:bg-slate-600' onClick={() => {
              sectionMinusCount(section.sectionId);
            }}>
              <MinusCircleIcon className='h-6 w-6 text-white' />
            </button>
            <button key={randomKey()} className='rounded-full shadow-lg w-6 h-6
                  absolute top-1 right-4 items-center justify-center flex hover:bg-red-600 z-40'
              onClick={() => { setSectionId(section.sectionId); setOpenDeleteSection(true) }}
            >

              <TrashIcon className='w-5 h-5 text-white' />
            </button>
            <h1 key={randomKey()} className={section.isActive ? `${_CLASSES.header_txt} ${_CLASSES.active_bounce}` : _CLASSES.header_txt}>{section.sectionName}</h1>
          </div>
          <div className='w-full h-full flex justify-center content-start border-r border-l flex-row flex-wrap'>
            {section.tables.map((table) => (
              <div key={randomKey()} className='w-20 h-20 mx-2 my-4 relative'>
                <button key={randomKey()} className='rounded-full bg-red-500 shadow-lg w-6 h-6
               absolute -top-2 z-10 -right-2 items-center justify-center flex hover:bg-red-600'
                  onClick={() => openDeleteModal({ sectionName: section.sectionName, tableId: table.tableId })}>
                  <TrashIcon className='w-5 h-5 text-white' />
                </button>
                <button key={table.tableId}
                  className={table.isTaken ? `${_CLASSES.default_btn} ${_CLASSES.taken_btn}` : `${_CLASSES.default_btn} ${_CLASSES.available_btn}`}
                  onClick={() => { setOpenToggle(true); setInfo({ sectionName: section.sectionName, tableNumber: table.tableNumber, tableState: table.isTaken }) }}
                >
                  <p key={randomKey()} className={_CLASSES.btn_text}>{table.tableNumber}</p>
                </button>
              </div>
            ))}
            <button key={randomKey()}
              className="w-20 mx-2 my-4 h-20 rounded-lg border-dotted border-4 text-white
                         flex shadow-lg items-center justify-center hover:bg-slate-200 active:bg-slate-300" onClick={() => {
                openAddModal(section.sectionId);
              }}>
              <PlusCircleIcon className="w-10 h-10 text-gray-500" />
            </button>
          </div>

          {
            //#region SECTION BOTTOM BUTTONS (RESET, ASSIGN, COUNT)
          }
          <div className='w-full h-12 absolute bottom-0 flex'>
            <button className='w-1/4 flex justify-center items-center hover:bg-slate-200 active:bg-slate-300
              disabled:bg-slate-500 disabled:opacity-50'
              onClick={() => {
                setOpenReset(true);
                setSectionId(section.sectionId);
              }}
            >
              <ArrowPathRoundedSquareIcon className='w-6 h-6 text-gray-600' />
            </button>
            <button className='w-full h-full hover:bg-slate-200 active:bg-slate-300
              disabled:bg-slate-500 disabled:opacity-50'
              disabled={(waiterObj.length <= 0)}
              onClick={() => { setOpenAssign(true); setSectionId(section.sectionId) }}>
              {section.waiter ? <p className='font-semibold text-lg'>{section.waiter.firstName}</p> : <p className='font-semibold text-lg'>Assign Waiter</p>}
            </button>
            <span className='w-1/4 border shadow-inner shadow-lg'>
              <p className='text-sm text-gray-500 text-center'>Count</p>
              <p className='text-center'> {section.tableCount} </p>
            </span>
          </div>
          {
            //#endregion
          }
        </div>
      ))}

      {
        addSectionAvailable ?
          <div className='col-span-1 p-2'>
            <div className='w-full h-full rounded-lg border-gray-400 border-2 border-dashed'>
              <button className='w-full h-full shadow-lg flex items-center justify-center hover:bg-slate-200 active:bg-slate-300'
                onClick={() => setOpenAddSection(true)}>
                <PlusCircleIcon className='text-gray-400 w-20 h-20' />
              </button>
            </div>
          </div>
          :
          <></>
      }

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Enter Table Number
                      </Dialog.Title>
                      <div className="mt-2">
                        <div className="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                          <label
                            htmlFor="name"
                            className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >
                            Table Number
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="tableName"
                            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                            placeholder="Ex. 1, 2, 3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={addTable}
                    >
                      Add Table
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenDelete}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Delete Table
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this table? data will be permanently removed
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={deleteTable}
                    >
                      Delete Table
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setOpenDelete(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openAddSection} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenAddSection}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Enter Section Name
                      </Dialog.Title>
                      <div className="mt-2">
                        <div className="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                          <label
                            htmlFor="name"
                            className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="sectionName"
                            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                            placeholder="Ex. Section A, Section B..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={addSection}
                    >
                      Add Section
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpenAddSection(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openDeleteSection} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenDeleteSection}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Delete Section
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this Section? data will be permanently removed
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={deleteSection}
                    >
                      Delete Table
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setOpenDeleteSection(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openAssign} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenAssign}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Select a Waiter
                      </Dialog.Title>
                      <Listbox value={selected} onChange={setSelected}>
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm font-medium text-gray-700">Assigned to</Listbox.Label>
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                <span className="block truncate">{`${selected.firstName} ${selected.lastName}`}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 w-full overflow-y-scroll rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {waiterObj.map((person) => (
                                    <Listbox.Option
                                      key={person.id}
                                      className={({ active }) =>
                                        classNames(
                                          active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                          'relative cursor-default select-none py-2 pl-3 pr-9'
                                        )
                                      }
                                      value={person}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                            {person.firstName}
                                          </span>

                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active ? 'text-white' : 'text-indigo-600',
                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                              )}
                                            >
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={assignWaiter}
                    >
                      Assign Waiter
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpenAssign(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openReset} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenReset}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Reset Counter
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to reset the Table Count? This Action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => { resetCounter(); setOpenReset(false); }}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setOpenReset(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openToggle} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenToggle}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                      <InformationCircleIcon className="h-10 w-10 antialiased  text-blue-700" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Change Table State
                      </Dialog.Title>
                      <div className="mt-2">

                        {
                          info.tableState ?
                            <div className='text-sm text-gray-500'>
                              Do you want to change this table to <p className='text-sky-700 font-semibold'>FREE?</p>
                            </div>
                            :
                            <div className='text-sm text-gray-500'>
                              Do you want to change this table to <p className='text-sky-700 font-semibold'>TAKEN?</p>
                            </div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={() => { toggleTable(); setOpenToggle(false) }}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpenToggle(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

    </div>
  )
}