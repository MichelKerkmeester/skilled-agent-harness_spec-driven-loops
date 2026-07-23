# Iteration 002: Security — Path traversal, SQL injection, cursor integrity, temp-file safety

## Focus

D2 Security across the 015-P0 styles-DB modules:
- Path-traversal guards in `generation-manifest.mjs`, `indexer.mjs` (isContained + realpath)
- SQL injection in `retrieval.mjs` FTS5 queries and parameterized statements
- Cursor tampering resistance in cursor decode/validate chain
- Query-vector bounds validation
- Temp-file naming races in `writeManifestPointer` and `buildStyleDatabase`
- Hardcoded secrets/credentials exposure

## Scorecard

- Dimensions covered: correctness, security
- Files reviewed: 8 (focused on security-sensitive paths)
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.25

## Findings

### P1, Required

- **F004**: `writeManifestPointer` temp-file naming is collision-prone under PID reuse, `generation-manifest.mjs:251`, The temp path `${pointerPath}.tmp-${process.pid}-${Date.now()}` uses `process.pid` for uniqueness. On Unix, PIDs are recycled and `Date.now()` has millisecond granularity. If process A exits, its PID is reused by process B within the same millisecond, AND both target the same pointer path, the `open(temporaryPath, 'wx')` flag (exclusive write) on line 254 will cause process B to fail with EEXIST. While `wx` prevents silent corruption, the error is surfaced as a generic crash rather than a retryable collision. The `buildStyleDatabase` caller at `indexer.mjs:1055` uses the same pattern for the building path. In production this is low-probability (requires same database path + same PID + same millisecond), but the defensive posture should either use a crypto-random suffix or add a retry loop. Category: security. [SOURCE: generation-manifest.mjs:251,254; indexer.mjs:1055]

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | REQ-001 verified; REQ-002 verified; no new P0 | Security surface reviewed |
| checklist_evidence | n/a | hard | — | No checklist.md |

## Claim Adjudication

### F004

```json
{
  "findingId": "F004",
  "claim": "Temp-file naming with process.pid is collision-prone under PID reuse within the same millisecond, though wx flag prevents silent corruption.",
  "evidenceRefs": [
    "generation-manifest.mjs:251-254",
    "indexer.mjs:1055"
  ],
  "counterevidenceSought": "Checked that wx flag fails on EEXIST (no silent overwrite). Checked that buildStyleDatabase's finally block cleans up the temp path. Checked whether crypto.randomUUID() is available in Node 22 — yes, and it would eliminate the PID-reuse concern entirely.",
  "alternativeExplanation": "The collision window is extremely narrow (same PID, same millisecond, same path) and the wx flag turns it into a hard error rather than corruption. In practice, this would only occur in high-concurrency test environments or CI with forked processes.",
  "finalSeverity": "P1",
  "confidence": 0.78,
  "downgradeTrigger": "If production workloads are confirmed single-process per database path OR if a crypto-random suffix is added, downgrade to P2 advisory.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Ruled Out

- **SQL injection via FTS5 MATCH**: `retrieval.mjs:206` — The `queryTerms()` function applies `match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu)` filtering, extracting only word-character sequences. Each term is then FTS5-quoted with `replaceAll('"', '""')` before being passed to a parameterized `MATCH ?` query at line 212. No user-controlled input reaches SQL unparameterized. CONFIRMED SAFE.
- **Cursor tampering/modification**: `retrieval.mjs:398-408` — The cursor is validated against generation hash, query fingerprint, fusion profile ID, candidateK, and vector revision. Any mismatch throws `invalid-cursor`. The cursor is base64url-encoded opaque JSON — modifying it produces a decode error (`invalid-cursor`). CONFIRMED SAFE.
- **Query-vector DoS via large input**: `retrieval.mjs:65-83` — `validateQueryVector` enforces `MAX_QUERY_VECTOR_DIMENSIONS=16384` and `MAX_QUERY_VECTOR_BYTES=256KB`. Both bounds are reasonable for production embedding models. CONFIRMED SAFE.
- **Path-traversal via symlinks**: Both `generation-manifest.mjs` and `indexer.mjs` resolve paths with `realpathSync`/`realpath` BEFORE calling `isContained` (a `path.relative` + prefix check). This resolves symlinks to their real targets, so a symlink-to-`/etc/passwd` in the corpus directory would be detected by the containment check. CONFIRMED SAFE.
- **Hardcoded secrets/keys**: No API keys, tokens, or credentials found in any of the reviewed files. The digest uses `node:crypto` SHA-256 (no external service). The embedder in query-set.mjs is a deterministic 2D vector for testing only. CONFIRMED CLEAN.

## Assessment

- New findings ratio: 0.25 (1 new P1 across 8 files, weighted: 5.0/20 = 0.25)
- Dimensions addressed: security
- The security surface is well-hardened. The PID-reuse collision is the only gap — low probability but deterministic under specific race conditions.

## Dead Ends

None.

## Recommended Next Focus

D3 Traceability — Execute spec_code protocol: verify REQ-001 through REQ-005 claims against shipped code, check comment hygiene in all reviewed files, verify no spec/phase/ADR/REQ IDs in code comments, and confirm the sk-doc/020 naming commit (`dc7fdfb0a7`) has consistent phase adjacency and no fabricated content.

Review verdict: CONDITIONAL
