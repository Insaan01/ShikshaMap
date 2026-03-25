import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://localhost:8000";

export function useFetch<T>(url: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setData(initialValue);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}${url}`);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);

      const result = await response.json();

      console.log(`[API Success - ${url}]:`, result);

      if (Array.isArray(initialValue) && !Array.isArray(result)) {
         setData(initialValue);
      } else {
         setData(result);
      }

    } catch (err) {
      console.error(`[API Error - ${url}]:`, err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setData(initialValue);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useStateMetrics() {
  return useFetch<Record<string, any>>("/api/map/state-metrics", {});
}

export function useDistricts(stateName: string | null) {
  return useFetch<any[]>(stateName ? `/api/map/state/${stateName}/districts` : "", []);
}

export function useDistrictNGOs(districtName: string | null) {
  // Uses an empty array [] as the safe initialValue
  return useFetch<any[]>(districtName ? `/api/ngo/district/${districtName}` : "", []);
}

export function useNGOList() {
  return useFetch<any[]>("/api/ngo/list", []);
}