import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ roles }) {
  const { user, role } = useSelector((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
