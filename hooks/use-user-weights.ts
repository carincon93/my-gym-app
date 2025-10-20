import {
  addUserWeight,
  deleteUserWeight,
  getAllUserWeights,
  updateUserWeight,
} from "@/services/user-weights.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserWeights() {
  const queryClient = useQueryClient();

  const { data: userWeights, isLoading } = useQuery({
    queryKey: ["userWeights"],
    queryFn: () => getAllUserWeights(),
  });

  const addMutation = useMutation({
    mutationFn: ({ weight }: { weight: number }) => addUserWeight(weight),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userWeights"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { weight?: number } }) =>
      updateUserWeight(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userWeights"] });
      queryClient.invalidateQueries({
        queryKey: ["userWeights", variables.id],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteUserWeight(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userWeights"] });
      queryClient.invalidateQueries({
        queryKey: ["userWeights", variables.id],
      });
    },
  });

  return {
    userWeights,
    isLoading,
    addUserWeight: addMutation.mutateAsync,
    updateUserWeight: updateMutation.mutateAsync,
    deleteUserWeight: deleteMutation.mutateAsync,
  };
}
