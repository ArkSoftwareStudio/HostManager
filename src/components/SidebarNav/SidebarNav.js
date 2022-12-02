import { Disclosure } from '@headlessui/react'
import { ChartBarIcon, HomeIcon, UsersIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Hosting', icon: HomeIcon, current: true, href: '#/' },
  {
    name: 'Waiters',
    icon: UsersIcon,
    current: false,
    children: [
      { name: 'Overview', href: '#/waiter' },
    ],
  },
  {
    name: 'Reports',
    icon: ChartBarIcon,
    current: false,
    children: [
      { name: 'Table Log', href: '#/logs' },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function SidebarNav() {

  function closeApp(){
    window.api.send('close-app');
  }


  return (
    <div className="flex flex-grow flex-col overflow-y-auto border-r h-full w-full border-gray-200 bg-slate-800 pt-5 pb-4 relative" id='sideBarNav'>
      <div className="mt-5 flex flex-grow flex-col">
        <nav className="flex-1 space-y-1 bg-slate-800 px-2" aria-label="Sidebar">
          {navigation.map((item) =>
            !item.children ? (
              <div key={item.name}>
                <a
                  href="#/"
                  className={classNames(
                    item.current
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-400 text-white hover:bg-slate-500',
                    'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current ? 'text-white' : 'text-white',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </div>
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        item.current
                          ? 'bg-slate-800 text-gray-900'
                          : 'bg-slate-800 text-white hover:bg-slate-600',
                        'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      )}
                    >
                      <item.icon
                        className="mr-3 h-6 w-6 flex-shrink-0 text-white "
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.name}</span>
                      <svg
                        className={classNames(
                          open ? 'text-white rotate-90' : 'text-white',
                          'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-white'
                        )}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                      </svg>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                      {item.children.map((subItem) => (
                        <Disclosure.Button
                          key={subItem.name}
                          as="a"
                          href={subItem.href}
                          className="group flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-white hover:bg-slate-500 hover:text-white"
                        >
                          {subItem.name}
                        </Disclosure.Button>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          )}
        </nav>
      </div>

      <div className='absolute bottom-0 w-full h-12'>
        <button className='flex justify-center items-center w-full h-full hover:bg-slate-500' onClick={closeApp}>
          <ArrowLeftOnRectangleIcon className='w-8 h-8 text-white' />
          <p className='text-lg font-semibold text-white'>Exit</p>        
        </button>
      </div>
    </div>
  )
}
