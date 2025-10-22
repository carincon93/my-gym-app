import {
  addWorkoutSet,
  deleteWorkoutSet,
  getWorkoutSetsByExercisesId,
  updateWorkoutSet,
} from "@/services/workout-sets.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useWorkoutSets(exerciseId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: sets, isLoading } = useQuery({
    queryKey: ["sets", exerciseId],
    queryFn: () => getWorkoutSetsByExercisesId(exerciseId!),
    enabled: !!exerciseId,
  });

  const addMutation = useMutation({
    mutationFn: ({
      exerciseId,
      reps,
      weight,
      rest,
    }: {
      exerciseId: string;
      reps: number;
      weight: number;
      rest: number;
    }) => addWorkoutSet(exerciseId, reps, weight, rest),
    onSuccess: (_, variables) => {
      // ✅ invalida ambos caches
      queryClient.invalidateQueries({ queryKey: ["sets"] });
      queryClient.invalidateQueries({
        queryKey: ["sets", variables.exerciseId],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      exerciseId: string;
      data: { reps?: number; weight?: number; rest?: number };
    }) => updateWorkoutSet(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sets"] });
      queryClient.invalidateQueries({
        queryKey: ["sets", variables.exerciseId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string; exerciseId: string }) =>
      deleteWorkoutSet(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sets"] });
      queryClient.invalidateQueries({
        queryKey: ["sets", variables.exerciseId],
      });
    },
  });

  return {
    sets,
    isLoading,
    addWorkoutSet: addMutation.mutateAsync,
    updateWorkoutSet: updateMutation.mutateAsync,
    deleteWorkoutSet: deleteMutation.mutateAsync,
  };
}
