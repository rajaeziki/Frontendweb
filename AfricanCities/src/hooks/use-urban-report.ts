import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "../shared/routes";

// Create a type without userId
type CreateUrbanReportInput = {
  city: string;
  country: string;
  formData: any; // Replace 'any' with your actual form data type
};

export function useUrbanReports() {
  return useQuery({
    queryKey: [api.urbanReports.list.path],
    queryFn: async () => {
      const res = await fetch(api.urbanReports.list.path);
      if (!res.ok) throw new Error("Failed to fetch reports");
      return api.urbanReports.list.responses[200].parse(await res.json());
    },
  });
}

export function useUrbanReport(id: number) {
  return useQuery({
    queryKey: [api.urbanReports.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.urbanReports.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch report");
      return api.urbanReports.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateUrbanReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUrbanReportInput) => {
      const res = await fetch(api.urbanReports.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create report");
      return api.urbanReports.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.urbanReports.list.path] });
    },
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.urbanReports.generate.path, { id });
      const res = await fetch(url, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate report");
      return res.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [api.urbanReports.get.path, id] });
      queryClient.invalidateQueries({ queryKey: [api.urbanReports.list.path] });
    },
  });
}