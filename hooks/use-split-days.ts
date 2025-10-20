import {
  addSplitDay,
  deleteSplitDay,
  getAllSplitDays,
  updateSplitDay,
} from "@/services/split-days.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSplitDays() {
  const queryClient = useQueryClient();

  const { data: splitDays, isLoading } = useQuery({
    queryKey: ["splitDays"],
    queryFn: () => getAllSplitDays(),
  });

  const addMutation = useMutation({
    mutationFn: ({
      days,
      areUpperDays,
    }: {
      days: string;
      areUpperDays: boolean;
    }) => addSplitDay(days, areUpperDays),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["splitDays"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { days?: string; areUpperDays?: boolean };
    }) => updateSplitDay(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["splitDays"] });
      queryClient.invalidateQueries({
        queryKey: ["splitDays", variables.id],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteSplitDay(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["splitDays"] });
      queryClient.invalidateQueries({
        queryKey: ["splitDays", variables.id],
      });
    },
  });

  return {
    splitDays,
    isLoading,
    addSplitDay: addMutation.mutateAsync,
    updateSplitDay: updateMutation.mutateAsync,
    deleteSplitDay: deleteMutation.mutateAsync,
  };
}
