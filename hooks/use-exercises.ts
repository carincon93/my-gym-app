import {
  addExercise,
  deleteExercise,
  getAllExercises,
  getExerciseById,
} from "@/services/exercises.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useExercises() {
  const queryClient = useQueryClient();

  const { data: exercises, isLoading } = useQuery({
    queryKey: ["exercises"],
    queryFn: getAllExercises,
  });

  const addMutation = useMutation({
    mutationFn: ({
      name,
      image,
      muscleGroup,
    }: {
      name: string;
      image?: string;
      muscleGroup?: string;
    }) => addExercise(name, image, muscleGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  return {
    exercises,
    isLoading,
    addExercise: addMutation.mutateAsync,
    deleteExercise: deleteMutation.mutateAsync,
  };
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: ["exercise", id],
    queryFn: () => getExerciseById(id),
    enabled: !!id, // evita ejecutarse si id es null/undefined
  });
}
