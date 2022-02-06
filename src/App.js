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

export function App() {
    return (
        <Container w="100%" at="center" behav="column" fe="space-between" h="90%">
            {
                useAuth().isAuth &&
                <Container w="90%" fe="flex-start" behav="row">
                    <Header />
                </Container>
            }
            <Container g={ useAuth().isAuth ? "0.8" : "1"} h="max-content" w="max-content">
                < Routes >
                    <Route exact path="/" element={<Authorization />} />
                    <Route exact path="/allcases" element={<AllCases />} />
                    <Route path="/allcases/:id" element={<Case />} />
                    <Route exact path="/reg" element={<Registration />} />
                    <Route exact path="/menu" element={<Menu />} />
                    <Route exact path="/profile" element={<Profile />} />
                    <Route exact path="/search" element={<SearchPage />} />
                    <Route path="/search/:id" element={<Card />} />
                </Routes >
            </Container>
        </Container>
    )
}