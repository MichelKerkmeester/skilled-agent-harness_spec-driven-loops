import { getUserData } from './a';
export async function loadProfile(id: string) {
  const u = await getUserData(id);
  return { name: u.name, email: u.email };
}
