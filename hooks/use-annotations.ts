import {
  addAnnotation,
  deleteAnnotation,
  getLastAnnotation,
  updateAnnotation,
} from "@/services/annotations.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAnnotations(exerciseId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: annotation, isLoading } = useQuery({
    queryKey: ["annotations", exerciseId],
    queryFn: () => getLastAnnotation(exerciseId!), // debe devolver Promise
    enabled: !!exerciseId, // 👈 evita llamadas innecesarias
  });

  const addMutation = useMutation({
    mutationFn: ({ annotation }: { annotation: string }) =>
      addAnnotation(exerciseId!, annotation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations", exerciseId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { annotation?: string } }) =>
      updateAnnotation(id, data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["annotations", exerciseId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteAnnotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations", exerciseId] });
    },
  });

  return {
    annotation,
    isLoading,
    addAnnotation: addMutation.mutateAsync,
    updateAnnotation: updateMutation.mutateAsync,
    deleteAnnotation: deleteMutation.mutateAsync,
  };
}
