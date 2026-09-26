export function permission(admin, owner) {
  if (admin || owner) return "allowed";
  return "denied";
}
