import {
  addUserWeight,
  deleteUserWeight,
  getAllUserWeights,
  getInitialWeight,
  updateUserWeight,
} from "@/services/user-weights.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserWeights() {
  const queryClient = useQueryClient();

  const { data: userWeights, isLoading: isLoadingWeights } = useQuery({
    queryKey: ["userWeights", "all"],
    queryFn: async () => await getAllUserWeights(),
  });

  const { data: initialWeight, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["userWeights", "initial"],
    queryFn: async () => {
      const list = await getInitialWeight();
      return list[0] ?? null;
    },
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: async ({ id, weight }: { id?: string; weight: number }) => {
      if (id) {
        return await updateUserWeight(id, { weight });
      }
      return await addUserWeight(weight);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userWeights"] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ["userWeights", variables.id],
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => await deleteUserWeight(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userWeights"] });
    },
  });

  return {
    userWeights,
    initialWeight,
    isLoading: isLoadingWeights || isLoadingInitial,
    createOrUpdateUserWeight: createOrUpdateMutation.mutateAsync,
    deleteUserWeight: deleteMutation.mutateAsync,
  };
}
