import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Registration } from './Registrate';
import { Authorization } from './Auth';
import AllCases from './AllCases';
import { Menu } from './Menu';
import { Case } from './Case';

export function App() {
    return (
        <Routes>
            <Route exact path="/" element={<Authorization />} />
            <Route exact path="/allcases" element={<AllCases />} />
            <Route path="/allcases/:id" element={<Case />} />
            <Route exact path="/reg" element={<Registration />} />
            <Route exact path="/menu" element={<Menu />} />
        </Routes>
    )
}