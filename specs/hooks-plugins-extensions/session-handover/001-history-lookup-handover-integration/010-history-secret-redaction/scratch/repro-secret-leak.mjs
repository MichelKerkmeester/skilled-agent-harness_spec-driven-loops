const core = process.argv[2];
const { createHistoryLookup } = await import(core);
const s = {
  ant: 'sk-' + 'ant-api03-' + 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0',
  gh: 'gh' + 'p_' + 'a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9',
  aws: 'AK' + 'IA' + 'IOSFODNN7EXAMPLE',
  pem: '-----BEGIN ' + 'RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAx1y2z3\n-----END ' + 'RSA PRIVATE KEY-----',
  auth: 'Authorization: ' + 'Bearer eyJhbGciOi' + 'JIUzI1NiJ9abc123def456ghi789',
  url: 'postgres://admin:' + 'Hunter2Secret99' + '@db.example.com:5432/app',
};
const text = Object.values(s).join('\n');
const entries = [
  { id: 'u1', role: 'user', sequence: 1, timestamp: '2026-11-15T00:00:00Z', content: [{ type: 'text', text }] },
  { id: 'a1', role: 'assistant', sequence: 2, timestamp: '2026-11-15T00:00:01Z', content: [{ type: 'toolCall', id: 't1', name: 'Bash', arguments: { command: 'curl -H "' + s.auth + '" ' + s.url } }] },
  { id: 'r1', role: 'toolResult', sequence: 3, timestamp: '2026-11-15T00:00:02Z', toolCallId: 't1', content: [{ type: 'text', text: 'token=' + s.gh }] },
];
const lookup = createHistoryLookup(entries);
const replies = {
  search: lookup.search({ query: 'ant' }),
  searchSecret: lookup.search({ query: s.aws }),
  browse: lookup.browse({ direction: 'backward' }),
  load: lookup.load(['u1', 'a1']),
};
for (const [op, reply] of Object.entries(replies)) {
  const body = JSON.stringify(reply);
  const leaked = Object.entries(s).filter(([, v]) => body.includes(v.split('\n')[0].slice(0, 30)) || body.includes(JSON.stringify(v).slice(1, 40))).map(([k]) => k);
  console.log(op.padEnd(13), 'leaked:', leaked.join(',') || 'none');
}
