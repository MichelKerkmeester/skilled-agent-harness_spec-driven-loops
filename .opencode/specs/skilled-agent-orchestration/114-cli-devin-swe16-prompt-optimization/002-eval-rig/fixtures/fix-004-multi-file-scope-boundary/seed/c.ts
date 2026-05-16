import { getUserData } from './a';
export async function loadAvatar(id: string) {
  const u = await getUserData(id);
  return u.avatarUrl;
}
