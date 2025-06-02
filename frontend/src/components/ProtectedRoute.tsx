import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactElement } from "react";

interface ProtectedRouteProps {
  children: ReactElement;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { telegramId } = useAuth();
  const location = useLocation();

  if (!telegramId) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
