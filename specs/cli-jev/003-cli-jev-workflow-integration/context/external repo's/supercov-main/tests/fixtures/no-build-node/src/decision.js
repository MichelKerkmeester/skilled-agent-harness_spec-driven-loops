export function accessLevel(isMember, isOwner) {
  if (isMember && isOwner) return "owner";
  return "visitor";
}
