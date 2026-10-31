# provenance_fingerprint hash input

Source: `.skilled/skills/system-skill-advisor/runtime/lib/derived/provenance.ts:95-116` (`computeProvenanceFingerprint`).

Payload, hashed as `sha256(JSON.stringify(payload))` and stored as `sha256:<hex>`:
- one key per bucket name, each value `normalizeBucket(values)`;
- `dependencies`: every `{ path, hash, exists }` entry, sorted by `path` with `localeCompare`, where `hash` is the sha256 of the dependency file's bytes.

Each bucket also gets its own `bucketFingerprints[bucket] = sha256:<sha256(JSON.stringify(normalized))>`. `sync.ts:116` stores the result as `derived.provenance_fingerprint`.
