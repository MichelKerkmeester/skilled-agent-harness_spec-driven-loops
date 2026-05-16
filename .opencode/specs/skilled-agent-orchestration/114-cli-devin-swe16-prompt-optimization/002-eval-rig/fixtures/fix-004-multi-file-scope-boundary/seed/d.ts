// This file has its own UNRELATED getUserData. Do NOT touch.
function getUserData(payload: any): { ok: boolean } {
  return { ok: typeof payload === 'object' };
}
export const validate = (p: any) => getUserData(p);
