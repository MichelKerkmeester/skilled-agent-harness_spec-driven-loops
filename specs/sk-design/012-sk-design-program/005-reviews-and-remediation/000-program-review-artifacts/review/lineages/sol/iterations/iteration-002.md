# Review Iteration 002 — Security

## Dispatcher

- Resolved route: `mode=review target_agent=deep-review`
- Session: `fanout-sol-1784457701676-6nfth8`; generation 1; lineage mode `new`
- Budget profile: `scan`
- Focus: SQLite/file trust boundaries, pointer validation, corpus and hydration containment, hostile retrieval inputs, exemplar trust, mutation boundaries, and alias recursion.

## Files Reviewed

- `.opencode/skills/sk-design/styles/_db/schema.mjs:17-49`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:220-240,618-668,1010-1173`
- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:20-97,99-230,267-460`
- `.opencode/skills/sk-design/styles/_db/vectors.mjs:5-21,128-286`
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs:520-678,694-782`
- `.opencode/skills/sk-design/styles/_engine/hydrate.mjs:66-122,182-370`
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:17-110,145-358`
- `.opencode/skills/sk-design/shared/creation-contract.md:18-38,78-129,143-206`
- `.opencode/commands/interface/design.md:1-86`
- `.opencode/commands/design/interface.md:1-18`
- `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:28-145`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/{spec.md:64-154,checklist.md:79-84,implementation-summary.md:47-98}`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/004-interface-commands/{spec.md:70-150,checklist.md:47-99,implementation-summary.md:52-123}`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The generation pointer accepts a symlinked database outside its publication directory** -- `.opencode/skills/sk-design/styles/_db/schema.mjs:23-48` -- Pointer validation constrains only the textual basename, then returns the sibling path after `existsSync`, which follows symlinks; it neither resolves/contains the target nor checks that `pointer.generationHash` equals the selected database's generation. `queryPersistentStyles` opens that returned path at `retrieval.mjs:338-347`. A focused probe confirmed that a basename symlink to an external file is accepted. This breaks the fail-closed publication trust boundary and can redirect readers to an unintended SQLite file. [SOURCE: `.opencode/skills/sk-design/styles/_db/schema.mjs:23-48`] [SOURCE: `.opencode/skills/sk-design/styles/_db/retrieval.mjs:338-347`]

   Finding class: cross-consumer

   Scope proof: Exact search found a single pointer resolver consumed by retrieval and the persistent adapter; publication validates staged files before writing the pointer, but the read path has no `realpath` containment or pointer-hash comparison. Existing schema tests contain no pointer/symlink case.

   Affected surface hints: generation pointer reader, persistent query open, persistent hydration open, rollback publication, pointer boundary tests

```json
{"type":"trust-boundary","claim":"A basename-only pointer can resolve through a symlink outside the generation directory and its declared generationHash is not bound to the opened database.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/schema.mjs:23-48",".opencode/skills/sk-design/styles/_db/retrieval.mjs:338-347","focused probe: pointer_symlink_accepted=true"],"counterevidenceSought":"Reviewed staged publication and rollback validation at indexer.mjs:1010-1173, searched pointer/symlink tests, and ran the focused schema/retrieval suites; writers validate ordinary retained files but readers do not contain or bind a tampered pointer target.","alternativeExplanation":"The database directory may be writable only by the same trusted principal that can already replace generation files, reducing exploitability in a locked-down deployment.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Prove and enforce that pointer and generation directories are an immutable trusted boundary for every caller, or add read-side realpath containment plus pointer/database generation binding."}
```

2. **Persistent retrieval accepts arbitrarily large query vectors** -- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:81-96,210-230` -- The request fingerprint serializes the full caller vector before validation, and the vector lane copies it with `map(Number)` while checking only non-empty finite values. Unlike embedder output, which is capped at 16,384 dimensions in `vectors.mjs:7-20`, query input has no dimension or byte cap. A focused probe passed a 20,000-element vector and received `ok=true`; larger hostile requests cause avoidable serialization, allocation, and scan work in the synchronous query path. [SOURCE: `.opencode/skills/sk-design/styles/_db/retrieval.mjs:81-96`] [SOURCE: `.opencode/skills/sk-design/styles/_db/retrieval.mjs:210-230`] [SOURCE: `.opencode/skills/sk-design/styles/_db/vectors.mjs:7-20`]

   Finding class: class-of-bug

   Scope proof: Exact search across `_db` and `_engine` found the only query-vector validation at `retrieval.mjs:210-215`; the 16,384-dimension cap applies only to embedder output, and retrieval tests cover valid two-dimensional vectors but no oversized input.

   Affected surface hints: persistent retrieval API, shadow adapter query, request fingerprinting, vector lane, hostile-input regression tests

```json
{"type":"availability-input-validation","claim":"The synchronous persistent query path accepts and duplicates an unbounded caller-controlled queryVector.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/retrieval.mjs:81-96",".opencode/skills/sk-design/styles/_db/retrieval.mjs:210-230",".opencode/skills/sk-design/styles/_db/vectors.mjs:7-20","focused probe: oversized_vector_accepted=true length=20000"],"counterevidenceSought":"Searched all queryVector and MAX_VECTOR_DIMENSIONS references and ran retrieval tests; no upstream or query-side cap was found, while output vectors are explicitly bounded.","alternativeExplanation":"Current callers may construct small vectors internally rather than expose this API directly to untrusted network input.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Demonstrate an enforced upstream vector-size cap on every dispatchStyleQuery/queryPersistentStyles caller; otherwise validate type, dimensions, and serialized size before fingerprinting."}
```

### P2 Findings

None.

## Traceability Checks

- `spec_code` (core): **fail** — phase-003 promises fail-closed generation behavior and retained containment guards, but the published database pointer read path admits an escaping symlink and does not bind its declared hash. New refs: `SOL-I002-P1-001`, `SOL-I002-P1-002`.
- `checklist_evidence` (core): **partial** — phase-003 CHK-040 and phase-004 CHK-040 were checked against direct code and 26 focused tests. Hydration containment, rights refusal, command mutation tools, and alias recursion are supported; pointer-symlink and oversized-vector cases are absent. The complete four-phase checklist matrix remains for traceability.

## Integration Evidence

- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:338-347` consumes `resolvePublishedDatabasePath` for persistent queries.
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:153-166,176-293` routes persistent query/hydration consumers and preserves rights/content checks.
- `.opencode/skills/sk-design/shared/creation-contract.md:128,176-196` names untrusted exemplar and mutation/handoff boundaries.
- `.opencode/commands/design/interface.md:15-18` executes the canonical contract in place and explicitly forbids public-command invocation.
- Focused verification: 26/26 tests passed across schema, retrieval, hydration guards, and interface command contracts; separate probes confirmed both active P1 paths.

## Edge Cases

- The pointer defect requires write influence over the pointer directory; deployment permissions were not represented in the packet, so severity stays at the lower supported P1 rather than P0.
- Oversized vectors are accepted by the reviewed API, but no network exposure was found; impact is synchronous local availability/resource pressure.
- Prompt-injection safety is expressed as a shared command contract and static assertion. No runtime/model-behavior harness exists in the declared target, so behavioral resistance remains unverified rather than silently passed.
- Structural-impact analysis remained unavailable from iteration 1; direct producer/consumer reads, exact searches, tests, and focused probes supplied the evidence.
- The first combined probe completed both demonstrations but exited non-zero during duplicate fixture cleanup (`ERR_INVALID_STATE`); the corrected probe completed cleanly and reproduced both results.

## Confirmed-Clean Surfaces

- Corpus artifact scanning resolves symlinks and rejects targets outside the corpus at `indexer.mjs:220-240` and `manifest.mjs:552-678`.
- Legacy and persistent hydration validate generation, style containment, artifact hashes, byte caps, and exact-reuse rights at `hydrate.mjs:225-370` and `persistent-adapter.mjs:176-293`.
- Interface advisory commands expose only `Read, Glob, Grep`; design-reference alone owns mutation through its extraction policy.
- Alias documents preserve `$ARGUMENTS` in place and prohibit nested public command dispatch; the static contract suite passed all nine command-boundary cases.

## Ruled Out

- Direct corpus/hydration traversal or static escaping symlinks: rejected by realpath containment and covered by hydration guard tests.
- Exact-reuse without known allowed rights: rejected in both legacy and persistent hydration paths.
- Alias command-to-command recursion: aliases execute canonical contracts in current context, and the boundary matcher/test suite rejects nested dispatch text.
- SQL injection through lexical query text: terms are bounded/tokenized, quoted for FTS syntax, and bound through prepared statements.

## Next Focus

- Dimension: traceability
- Focus area: complete the four-phase `spec_code` and `checklist_evidence` matrix, including security-claim evidence and command registration/runtime parity.
- Reason: correctness and security are complete with four active P1s and one P2; core traceability remains fail/partial.
- Rotation status: correctness and security completed; traceability is the first unchecked dimension.
- Blocked/productive carry-forward: direct reads, exact searches, focused tests, and bounded probes were productive; do not retry ruled-out hydration traversal, rights bypass, or alias recursion directions.
- Required evidence: phase 001-004 requirement/checklist rows mapped to exact implementation, tests, command metadata, hub-router, mode registry, and current verification outputs.

Review verdict: CONDITIONAL
