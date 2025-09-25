import { useUser } from "@clerk/clerk-react";

export const useAdmin = () => {
  const { user } = useUser();

  // Check if user is admin based on multiple criteria
  const isAdmin = user?.publicMetadata?.role === "admin";
  return {
    isAdmin,
    user,
    isLoading: !user,
  };
};
