# Deep Review Iteration 002 — Security

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-gpt-56-sol-high-1784650021792-031fvi`
- Generation / lineage: `1` / `new`
- Budget profile: `scan`
- Scope: validated 118-file `goal-file-manifest.txt` at pinned HEAD `7b9d3b6b71`
- Structural caveat: Code Graph was unavailable by dispatch contract; direct reads, exact searches, and focused tests were used.

## Files Reviewed

- `.opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs`
- `.opencode/skills/sk-design/styles/lib/database/schema.mjs`
- `.opencode/skills/sk-design/styles/lib/database/indexer.mjs`
- `.opencode/skills/sk-design/styles/lib/database/operator.mjs`
- `.opencode/skills/sk-design/styles/lib/database/retrieval.mjs`
- `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs`
- `.opencode/skills/sk-design/styles/lib/engine/hydrate.mjs`
- `.opencode/skills/sk-design/styles/tests/database/manifest.test.mjs`
- `.opencode/skills/sk-design/styles/tests/database/schema.test.mjs`
- `.opencode/skills/sk-design/styles/tests/database/operator.test.mjs`
- `.opencode/skills/sk-design/styles/tests/database/retrieval.test.mjs`
- `.opencode/skills/sk-design/styles/tests/database/adapter.test.mjs`
- `.opencode/skills/sk-design/styles/tests/engine/hydrate-guard.test.mjs`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Published SQLite opens do not enforce the manifest's content digest** -- `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343` -- The publication manifest records and can verify each artifact's SHA-256, but the production open path resolves the pointer and checks only the mutable database's internal `generation_hash`. A same-generation database modified after publication can therefore supply altered query/provenance rows while still passing the pointer binding. The local-filesystem write prerequisite keeps this below P0, but it defeats the content-addressed publication integrity boundary. [SOURCE: `.opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs:212-234`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343-355`]
   - Finding class: cross-consumer
   - Scope proof: Exact search found `resolveManifestArtifacts(..., { verifyDigests: true })` exercised by manifest tests, while every production published-database consumer funnels through `openPublishedStyleDatabase`, which never invokes that verifier. The affected open path is shared by query, hydration, status, and vector repair.
   - Affected surface hints: `["published database open", "persistent query", "persistent hydration", "operator status/repair"]`
   - Recommendation: Bind production opens to the manifest artifact digest before trusting database rows, or provide an equivalently enforced immutable/read-only publication guarantee and test same-generation post-publication tampering through `openPublishedStyleDatabase`.
   - Content hash: `sha256:b9ba3149517c5b8648902997375a7f0fd36629b93eba9523849ee381136587b8`

```json
{"type":"security-integrity","claim":"A published SQLite artifact can be altered without changing its internal generation_hash and production opens will not compare it with the manifest sha256.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs:212-234",".opencode/skills/sk-design/styles/lib/database/schema.mjs:343-355"],"counterevidenceSought":"Reviewed pointer containment, generation-mismatch, artifact-tamper, operator, retrieval, adapter, and hydration tests; 35/35 passed. The tamper test proves the optional digest verifier works, but no production open calls it.","alternativeExplanation":"The artifact may be assumed immutable because it is generation-named and local; however, the reviewed code does not enforce read-only immutability and explicitly stores the digest as publication identity.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Downgrade if an in-scope enforced filesystem guarantee proves published artifacts cannot change, or if the production open path is shown to verify the manifest digest before exposing database rows."}
```

### P2 Findings

None.

## Traceability Checks

- `spec_code`: **partial**. Publication is atomic, pointer/artifact realpaths are contained, and open-time generation identity is checked, but the manifest's recorded SQLite digest is not enforced by the production open path [SOURCE: `.opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs:156-185`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343-355`].
- `checklist_evidence`: **pending**. Dedicated traceability replay remains assigned to the next dimension.

## Integration Evidence

- Exact shared surface reviewed: `openPublishedStyleDatabase` in `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343-356`; its consumers include persistent retrieval/hydration and operator status/repair.
- Focused verification: 35/35 tests passed across manifest, schema, operator, retrieval, adapter, and hydration-guard suites, including pointer symlink escape, generation mismatch, optional digest verification, flat-artifact digest checks, and missing-generation refusal.

## Edge Cases

- The digest gap requires write access to the published SQLite artifact or a compromised local publisher; no remote or privilege-escalation path was established, so the supported severity is P1 rather than P0.
- Generation-named files are described as immutable, but no in-scope enforcement of immutability was found; that assumption cannot be treated as a pass.
- Code Graph structural-impact analysis was unavailable; exact import/call searches and direct consumer reads supplied the bounded fallback.

## Confirmed-Clean Surfaces

- Pointer payload parsing rejects invalid shapes and confines SQLite resolution to the generation directory [SOURCE: `.opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs:127-185`].
- Rollback/cutover requires a same-directory regular file, resolves symlinks for containment, runs SQLite integrity validation, and requires an internal generation identity [SOURCE: `.opencode/skills/sk-design/styles/lib/database/indexer.mjs:1138-1179`].
- Legacy and persistent hydration enforce generation equality, realpath containment, per-flat-artifact SHA-256, rights restrictions, and byte caps [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:175-280`] [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/hydrate.mjs:225-370`].

## Ruled Out

- Pointer path traversal and escaping symlinks: rejected by basename validation plus realpath containment; adversarial schema/hydration tests passed.
- Missing-generation fallback: persistent retrieval fails closed instead of silently serving an unbound generation [SOURCE: `.opencode/skills/sk-design/styles/tests/database/retrieval.test.mjs:52-60`].
- Cutover to an outside-directory generation: rejected by resolved-directory and realpath containment checks [SOURCE: `.opencode/skills/sk-design/styles/lib/database/indexer.mjs:1141-1158`].

## Next Focus

- Dimension: traceability
- Focus area: full requirement and checklist-evidence replay for publication integrity, deferred cutover, and completion claims
- Reason: security found a production digest-binding gap while core traceability protocols remain partial/pending
- Rotation status: correctness and security completed; rotate to the next unchecked dimension
- Blocked/productive carry-forward: Code Graph unavailable; exact searches, direct reads, and focused executable tests remain productive
- Required evidence: packet requirements, checklist rows, implementation-summary claims, production digest/open behavior, and named test evidence

Review verdict: CONDITIONAL
