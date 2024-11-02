// src/composables/useFetch.ts
import { ref } from 'vue';

export function useFetch<T>(url: string, options: { params?: Record<string, any>; [key: string]: any } = {}) {
  const data = ref<T | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  async function fetchData() {
    loading.value = true;
    error.value = null;

    // Serialize params to query string
    const queryParams = options.params
      ? '?' + new URLSearchParams(options.params).toString()
      : '';

    try {
      const response = await fetch(url + queryParams, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      data.value = await response.json() as T;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  // Fetch data immediately
  fetchData();

  return { data, loading, error, refetch: fetchData };
}
