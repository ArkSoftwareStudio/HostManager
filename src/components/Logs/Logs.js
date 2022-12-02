import { useRef, useState } from "react"

export function Logs() {

    const [logArr, setLogArr] = useState([]);
    const didRender = useRef(false);

    if(!didRender.current){
        window.logs.getLogsAsync().then((result) => {
            setLogArr(result)
        })
        didRender.current = true;
    }
    

    return (
        <div className="h-full w-full bg-slate-100 p-5 overflow-y-scroll rounded-lg">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Logs</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all changes made in the app.
                        </p>
                    </div>
                </div>
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr className="divide-x divide-gray-200">
                                            <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Date & Time
                                            </th>
                                            <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Action
                                            </th>
                                            <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {logArr.map((log) => (
                                            <tr key={log.logId} className="divide-x divide-gray-200">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {log.dateTime}
                                                </td>
                                                <td className="whitespace-nowrap p-4 text-sm text-gray-500">{log.action}</td>
                                                <td className="whitespace-nowrap flex justify-center p-4 text-sm text-gray-500">
                                                    <div className="rounded-lg flex justify-center w-2/3 py-1 px-5 border border-black shadow-md bg-slate-100">
                                                        <p className="font-semibold font-lg text-gray-700 italic">{log.description}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
