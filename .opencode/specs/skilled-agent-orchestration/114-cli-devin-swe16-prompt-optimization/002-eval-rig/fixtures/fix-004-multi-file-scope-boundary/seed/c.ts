import { fetchUser } from './a';
export async function loadAvatar(id: string) {
  const u = await fetchUser(id);
  return u.avatarUrl;
}
