import { useState } from 'react';
import { SidebarNav } from '../SidebarNav/SidebarNav';
import { InformationCircleIcon } from '@heroicons/react/24/outline'

export function Layout(props) {
    const [isOutdated, setIsOutdated] = useState(false);
    const [updateDownloaded, setUpdateDownloaded] = useState(false);

    window.api.receive('update_available', ()=> {
        setIsOutdated(true);
    });

    window.api.receive('update_downloaded', ()=> {
        setIsOutdated(false);
        setUpdateDownloaded(true);
    })


    return (
        <div className='h-screen bg-gray-700 relative grid grid-flow-col grid-cols-8'>
            <div className='container h-screen  max-h-screen '>
                <SidebarNav />
            </div>
            <div className='col-span-7 bg-gradient-to-r from-slate-500 via-slate-100 to-slate-400 p-2 w-full max-w-full max-h-full overflow-x-hidden overflow-y-auto'>
                {props.children}
            </div>

            <div className={isOutdated ? 'rounded-md bg-blue-100 p-4 absolute bottom-5 right-5' : 'rounded-md bg-blue-100 p-4 absolute bottom-5 right-5 hidden'}>
                <div className="flex">
                    <div className="flex-shrink-0">
                        <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">A new software update is available.</p>
                    </div>
                </div>
            </div>

            <div className={updateDownloaded ? 'rounded-md bg-blue-100 p-2 border absolute bottom-5 right-5' : 'rounded-md bg-blue-100 border shadow-lg p-4 absolute bottom-5 right-5 hidden'}>
                <div className="flex">
                    <div className="flex-shrink-0">
                        <InformationCircleIcon className="h-10 w-10 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 flex-1 items-center justify-center md:flex md:justify-between">
                        <p className="text-sm text-blue-700">The Update has finished Downloading</p>
                        <button className='rounded-md flex justify-center items-center mx-2 shadow-md w-16 p-2 h-10 bg-slate-200 text-gray-700 h-full'>Restart</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

