import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
const ipcRenderer = window.require('electron').ipcRenderer;

export function AddWaiterForm() {

    ipcRenderer.on('success', ()=> {
        setOpen(true);
    })

    const [open, setOpen] = useState(false)
    return (
    <div className="divide-y divide-gray-200 h-full max-h-screen overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6 shadow-lg">
        <h4 className="text-lg font-sans mx-auto font-normal text-center subpixel-antialiased tracking-tight text-gray-900 sm:text-2xl"> Waiter Information </h4>
        </div>
        <div className="px-4 py-5 sm:p-6 shadow-inner shadow-lg">
            <div className="rounded-md border border-gray-300 my-6 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                First Name
                </label>
                <input
                type="text"
                name="name"
                id="firstName"
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                placeholder="Jane"
                />
            </div>
            <div className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                Last Name
                </label>
                <input
                type="text"
                name="name"
                id="lastName"
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                placeholder="Smith"
                />
            </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
            <button
                type="button"
                className="inline-flex items-center shadow-xl justify-center mx-4 rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                id='cancelBtn'
                onClick={closeWindow}
                >
                Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center shadow-xl justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              id='addWaiterBtn'
              onClick={addWaiter}
            >
              Add Waiter
            </button>
        </div>
        <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Waiter Added Succesfully!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You can now close this window or enter another waiter to keep adding more.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Continue
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

function closeWindow(){
    ipcRenderer.invoke('waiter', {
        method: 'cancel'
    });
}

function addWaiter(){
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;

    if(firstName === "" || lastName === "") return;

    let creationDate = new Date().toLocaleDateString('en-US').replaceAll('/', '-');
    let id = Math.random().toString(32).slice(2);
    const waiterObj = {
        id : id,
        firstName: firstName,
        lastName : lastName,
        currentSection : null,
        isActive : true,
        creationDate : creationDate,
    }

    ipcRenderer.invoke('waiter', {
        method: 'addWaiter',
        payload : waiterObj
    })
}
  