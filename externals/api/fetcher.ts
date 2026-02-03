export const fetchData = <TData, TVariables>(
  _query: string,
  _variables?: TVariables,
  _options?: unknown,
): (() => Promise<TData>) => {
  return () => Promise.resolve({} as TData)
}
