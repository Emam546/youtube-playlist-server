import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SharedLayout from "./sharout";
import Main from "./pages/main";

function App() {
    return (
        <BrowserRouter basename="/youtubeDownlouderFrontEnd/b">
            <Routes>
                <Route
                    path="/"
                    element={<SharedLayout />}
                >
                    <Route
                        path="/"
                        element={<Main />}
                    />
                    <Route
                        path="/youtube/:id"
                        element={<Main />}
                    />
                    <Route
                        path="/search/:search"
                        element={<Main />}
                    />
                </Route>
                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
