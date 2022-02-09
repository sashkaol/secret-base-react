import { Route, Routes } from "react-router-dom";
import { Registration } from './Registrate';
import { Authorization } from './Auth';
import AllCases from './AllCases';
import { Menu } from './Menu';
import { Case } from './Case';
import { Header } from './Header';
import { useAuth } from './hooks/user-auth';
import { Container } from "./styles/styles";
import { Profile } from "./Profile";
import { SearchPage } from "./SearchPage";
import { Card } from './Card';
import { Testimony } from "./Testimony";
import { AddDetective, AddParticipant, AddProof } from "./AddAnything";

export function normalDate(date) {
    let month = ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июня', 'Июля', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'];
    let y = date.slice(0, 4);
    let m = +date.slice(5, 7);
    let d = +date.slice(8, 10);
    return `${d} ${month[m - 1]} ${y}`;
}

export function App() {
    return (
        <Container w="100%" at="center" behav="column" fe="space-between" h="90%">
            {
                useAuth().isAuth &&
                <Header />
            }
            < Routes >
                <Route exact path="/" element={<Authorization />} />
                <Route exact path="/allcases" element={<AllCases />} />
                <Route path="/allcases/:id" element={<Case />} />
                <Route exact path="/reg" element={<Registration />} />
                <Route exact path="/menu" element={<Menu />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/testimony/:id" element={<Testimony />} />
                <Route exact path="/search" element={<SearchPage />} />
                <Route path="/search/:id" element={<Card />} />
                <Route path="/addparticipants/:id" element={<AddParticipant />} />
                <Route path="/adddetective/:id" element={<AddDetective />} />
                <Route path="/addproof/:id/:red/:idPr" element={<AddProof />} />
            </Routes >
        </Container>
    )
}