export function canCheckout(signedIn, expired) {
  if (signedIn && !expired) return true;
  return false;
}
