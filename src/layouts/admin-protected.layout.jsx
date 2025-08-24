import { Outlet, Navigate } from "react-router";
import { useAdmin } from "@/lib/hooks/useAdmin";

const AdminProtectedLayout = () => {
  const { isAdmin, isLoading } = useAdmin();

  // Show loading while checking admin status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminProtectedLayout;
