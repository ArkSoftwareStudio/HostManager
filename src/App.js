import './App.css';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {SidebarNav} from './components/SidebarNav/SidebarNav';
import {MainScreen} from './components/MainScreen/MainScreen';
import { WaiterList } from './components/Waiters/WaiterList';

function App() {
  return (
    <div className='h-screen bg-gray-700 grid grid-flow-col grid-cols-8'>
      <div className='container h-screen max-h-screen col-span-2'>
        <SidebarNav/>
      </div>
      <div className='col-span-6 bg-slate-100 p-2 w-full max-w-full max-h-full overflow-x-hidden overflow-y-auto'>
        <HashRouter>
          <Routes>
            <Route exact path='/' element={<MainScreen/>}></Route>
            <Route exact path='/waiter' element={<WaiterList/>}></Route>
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}

export default App;
  