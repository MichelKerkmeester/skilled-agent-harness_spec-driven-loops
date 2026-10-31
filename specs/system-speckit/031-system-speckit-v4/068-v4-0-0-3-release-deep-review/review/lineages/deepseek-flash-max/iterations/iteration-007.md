---
title: "Deep Review Iteration 007 — spec-kit runtime/lib internals"
trigger_phrases: []
---

# Iteration 7: Correctness — runtime/lib internals (graph metadata, integrity gate, description)

## Focus

Dimension: **correctness**. Slice: the generated-metadata stack — `runtime/lib/graph/**`
(schema, parser, fingerprint, derive/merge/serialize) and `runtime/lib/validation/generated-metadata-integrity.ts`,
plus `runtime/lib/description/description-schema.ts`. Executed read-only controls: the shipped
schemas against the target packet's `graph-metadata.json` and `description.json`, and the shipped
integrity gate (check + resolve) against the target packet, its phase parent, and a 279-packet sweep.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-schema.ts` (read via the parser's export surface)
- `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` (validation and fingerprint paths, lines 390-476, 740-830, 1365-1520)
- `.skilled/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts` (full, 433 lines)
- `.skilled/skills/system-spec-kit/runtime/lib/config/capability-flags.ts` (flag defaults, lines 82-213)
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` (rule wiring, lines 815-840, 1060-1075, 1183-1196)
- `.skilled/skills/system-spec-kit/runtime/lib/description/description-schema.ts` (executed)
- `.github/workflows/changed-packet-validation.yml` (packet selection and base comparison, lines 55-145)

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged this iteration).

### P2 Findings

- F006 — The shipped tree lets the 033-system-speckit-v4 phase folder resolve to error under its own generated-metadata integrity gate — `specs/system-speckit/033-system-speckit-v4/graph-metadata.json` (`derived.source_fingerprint`) — Executing the shipped modules (`checkGeneratedMetadataIntegrity` then `resolveGeneratedMetadataIntegrity` with the defaults the orchestrator passes: grandfather `false`, status-consistency gate `false`) returns status `error` with `SOURCE_FINGERPRINT_MISMATCH: source_fingerprint does not match a re-derive of the current source docs`; the same call on `specs/system-deep-loop/z_archive/010-deep-context-gathering` also returns `error`. The rule is pushed unconditionally (`orchestrator.ts:1068`), the grandfather default is `false` (`capability-flags.ts:97-98`), and the checker source plus its compiled `dist` are byte-identical at `v4.0.0.3` and HEAD, so a strict run over that folder on the tagged tree prints FAILED. The folder's `spec.md`, `graph-metadata.json` and `description.json` are also byte-identical at the tag and HEAD; the release range's only change to the folder was one `graph-metadata.json` update (`01162dfe43`) that did not refresh the digest. Note honestly: the last `spec.md` edit and the digest write are the same pre-range commit (`06b231a8db`, ancestor of `v4.0.0.2`), so the mismatch is pre-existing debt the release carried and touched, not a change the range introduced; the CI gate tolerates exactly this by re-checking the merge base before calling a failure a regression (`changed-packet-validation.yml:89-145`), which is why the tree can stay green. A 279-packet sweep found 10 folders with violations; the 7 `STATUS_COMPLETE_EVIDENCE_MISMATCH` cases resolve to `info` under the same defaults, so only the two fingerprint cases are blocking. Reconciliation attempt: the stored digest could not be reproduced from the folder's single source doc under the path and volatile-normalization variants tried, so why it diverged is INFERRED (a projection change between the writing tool version and the current re-derive without a docset bump, or a pre-range doc-set change without a re-derive); reproducing it would need the historical tool version.

  Finding class: `cross-consumer`
  Scope proof: Ran the repo's own checker and resolver on the folders, compared metadata and checker blobs across the tag, read the rule wiring and flag defaults, and swept 279 packets to size the class.
  Affected surface hints: [`specs/system-speckit/033-system-speckit-v4/graph-metadata.json`, `specs/system-deep-loop/z_archive/010-deep-context-gathering/graph-metadata.json`, `runtime/lib/validation/generated-metadata-integrity.ts`]

## Claim Adjudication

No new P0/P1; F006 is an advisory with executed gate output. The packet under review (`068-…`) also reports `SOURCE_FINGERPRINT_MISSING`, and is deliberately excluded from the finding: it is branch-local (absent at the tag) and the fan-out's own post-run metadata refresh runs `generate-description.js` and `backfill-graph-metadata.js` against the run's spec folder after all lineages settle (`fanout-run.cjs:3000-3060`), which is the expected repair path for it.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pending | Full traceability pass scheduled for iteration 8. |
| `checklist_evidence` | pending | Scheduled with the same pass. |

## Ruled Out

- "The target packet's generated metadata violates its own schema": ruled out — `validateGraphMetadataContent` returns `ok: true` with `migrated: false` on the packet's `graph-metadata.json`, and both `folderDescriptionSchema` and `perFolderDescriptionSchema` pass on its `description.json`.
- "`STATUS_COMPLETE_EVIDENCE_MISMATCH` failures are blocking": ruled out — the resolver treats that code as non-blocking unless `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` is enabled (default off), and executed runs on `039-review-state-init-and-dispatch` return `info`.
- "A re-derive can fix the fingerprint without touching content": ruled out as an assumption — a fingerprint refresh rewrites `graph-metadata.json`, so the repair is a generated-file write, not a doc edit; stated so the remediation is planned correctly.
- "The integrity gate reads only the current directory": ruled out — it reads the folder's own generated files and re-derives from its docs; it never walks children (`checkGeneratedMetadataIntegrity`, `:344-390`).

## Dead Ends

- Re-running the base-tree validation to prove the mismatch predates `v4.0.0.2`: not attempted — it needs a second worktree (`git worktree add`), a git write the lineage contract forbids; the tag-blob comparison already establishes the shipped state.

## Assessment

- New findings ratio: 1.0 (one new P2; weighted new = weighted total = 1)
- Dimensions addressed: correctness
- Novelty justification: this slice executed the metadata gate instead of reading it. The schemas pass on the target packet; the gate errors on the phase parent and one archived folder, with tag-identical blobs and tag-identical checker code.

## Next Focus

Dimension: traceability. Focus area: the `spec_code` protocol — map this packet's REQ-001..REQ-005 and acceptance criteria to the release evidence, and check the release's own docs (068 docs, parent phase map, v4.0.0.3 changelog) for claims that contradict observed behavior. Required evidence: one row per requirement with file:line or executed command. Rotations status: traceability pass 1 of 2.

Review verdict: CONDITIONAL
