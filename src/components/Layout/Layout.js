import {SidebarNav} from '../SidebarNav/SidebarNav';

export function Layout(props){
    return (
        <div className='h-screen bg-gray-700 grid grid-flow-col grid-cols-8'>
        <div className='container h-screen max-h-screen col-span-2'>
            <SidebarNav/>
        </div>
        <div className='col-span-6 bg-slate-100 p-2 w-full max-w-full max-h-full overflow-x-hidden overflow-y-auto'>
            {props.children}
        </div>
    </div>
    );
}

