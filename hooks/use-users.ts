import {
  addUser,
  deleteUser,
  getFirstUser,
  updateUser,
} from "@/services/users.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<
    { id: string; height: number; gender: string } | undefined
  >({
    queryKey: ["users"],
    queryFn: async () => {
      const list = await getFirstUser();
      return list[0] ?? null;
    },
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: async ({
      id,
      height,
      gender,
    }: {
      id?: string;
      height: number;
      gender: string;
    }) => {
      if (id) {
        return await updateUser(id, { height, gender });
      }
      return await addUser(height, gender);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["users", variables.id],
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => await deleteUser(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });
    },
  });

  return {
    user,
    isLoading,
    createOrUpdateUser: createOrUpdateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
  };
}
