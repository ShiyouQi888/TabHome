export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // 将响应数据附加到错误对象上，以便于调试
    error.data = await res.json().catch(() => ({}))
    throw error
  }

  return res.json()
}