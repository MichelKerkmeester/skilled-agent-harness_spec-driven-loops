export async function getUserData(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}
