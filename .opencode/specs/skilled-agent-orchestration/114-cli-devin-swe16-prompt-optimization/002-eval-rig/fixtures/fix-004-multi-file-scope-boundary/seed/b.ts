import { fetchUser } from './a';
export async function loadProfile(id: string) {
  const u = await fetchUser(id);
  return { name: u.name, email: u.email };
}
