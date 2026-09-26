export function GET(request) {
  const url = new URL(request.url);
  const admin = url.searchParams.get("admin") === "1";
  const owner = url.searchParams.get("owner") === "1";
  if (admin || owner) return Response.json({ permission: "allowed" });
  return Response.json({ permission: "denied" });
}
