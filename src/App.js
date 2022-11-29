import './App.css';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {MainScreen} from './components/MainScreen/MainScreen';
import { WaiterList } from './components/Waiters/WaiterList';
import { AddWaiterForm } from './components/Waiters/AddWaiterForm';
import { Layout } from './components/Layout/Layout';
import { AlertModal } from './components/Modals/AlertModal';

function App() {
  return (
    <HashRouter>
          <Routes>
            <Route exact path='/' element={<Layout><MainScreen/></Layout>}></Route>
            <Route exact path='/waiter' element={<Layout><WaiterList/></Layout>}></Route>
            <Route exact path='/waiterModal' element ={<AddWaiterForm/>} />
            <Route exact path='/deleteModal' element ={<AlertModal/>} />
          </Routes>
    </HashRouter>
  );
}

export default App;
  