export async function locationSearch(query: string): Promise<{ name: string; id: string }[]> {
  const response = await fetch(`${NETLIFY_URL}/.netlify/functions/locationSearch?query=${query}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
}

export async function getTimezone(
  id: string
): Promise<{ rawOffset: number; timeZoneName: string }> {
  const response = await fetch(`${NETLIFY_URL}/.netlify/functions/timezone?id=${id}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
}
