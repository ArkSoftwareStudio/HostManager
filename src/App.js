import './App.css';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {MainScreen} from './components/MainScreen/MainScreen';
import { WaiterList } from './components/Waiters/WaiterList';
import { Layout } from './components/Layout/Layout';
import { Logs } from './components/Logs/Logs';

function App() {
  return (
    <HashRouter>
          <Routes>
            <Route exact path='/' element={<Layout><MainScreen/></Layout>}></Route>
            <Route exact path='/waiter' element={<Layout><WaiterList/></Layout>}></Route>
            <Route exact path='/logs' element={<Layout><Logs/></Layout>}></Route>
          </Routes>
    </HashRouter>
  );
}

export default App;
  