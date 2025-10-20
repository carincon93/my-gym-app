import {
  addUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "@/services/users.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  const addMutation = useMutation({
    mutationFn: ({ height, gender }: { height: number; gender: string }) =>
      addUser(height, gender),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { height?: number; gender?: string };
    }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteUser(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });
    },
  });

  return {
    users,
    isLoading,
    addUser: addMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
  };
}
