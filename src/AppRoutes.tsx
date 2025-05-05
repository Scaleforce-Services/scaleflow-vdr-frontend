import { Routes, Route } from 'react-router';
import Login from './pages/Login';
import DataRoom from './pages/DataRoom';
import File from './pages/File';
import AuthorisedRoutes from './components/AuthorisedRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route element={<AuthorisedRoutes />}>
        <Route path="/data-room" element={<DataRoom />} />
        <Route path="/file/:fileName" element={<File />} />
      </Route>
    </Routes>
  );
}
