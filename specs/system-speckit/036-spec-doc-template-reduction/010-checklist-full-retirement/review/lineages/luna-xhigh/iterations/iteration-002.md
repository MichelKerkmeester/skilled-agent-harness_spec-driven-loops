# Deep Review Iteration 002

## Dispatcher
- Session: `fanout-luna-xhigh-1788073473072-dysoga`
- Lineage: `new`, generation 1
- Dimension: security
- Focus: fingerprint-generation boundaries, path normalization/confinement, symlink handling, stale-generation skips, and repair/write boundaries
- Budget profile: verify (direct evidence rereads and boundary adjudication)
- Iteration derivation: requested iteration 2; authoritative root projection currently contains only its `type=config` record, while the lineage ledger/registry and existing iteration-001 artifact establish the preceding pass. This mismatch is carried as an edge case; the requested write-once artifact remains iteration 002.
- Output verification status: error — the successful gateway receipt updated only the compatibility projection under `review/`; the authoritative root projection still lacks the iteration record, and direct repair/reducer execution is forbidden for this leaf.

## Files Reviewed
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:74-86`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:30-40`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:43-52`
- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:63-87`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1693-1739`
- `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:160-225,863-925,993-1050`
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:121-178`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-schema.ts:76-86`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:157-164,419-442,469-525,1053-1060,1170-1208`
- `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:90-105,344-362`

## Findings - New

### P0 Findings
None. The reviewed paths expose read/write integrity risks, but no confirmed authentication bypass, destructive data-loss path, or privilege crossing was established in this iteration. The P1 candidates below were challenged against their required attacker/control preconditions.

### P1 Findings
1. **Resume path confinement is lexical and follows in-tree symlinks to external packets** -- `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:895-918,214-225,993-1050` -- `resolveExistingFolder` checks `path.resolve` strings against `allowedRoots`, then accepts a directory using `fs.statSync` without canonicalizing it. Phase-parent redirection repeats the same pattern for `childPath`. A symlink located below `specs/` can therefore point outside the workspace, pass the lexical containment check, and make the resume ladder read `handover.md`, `implementation-summary.md`, or packet documents through that link. The `startsWith(folderPath)` filter is also lexical and does not restore the lost real-path boundary.
   - Finding class: cross-consumer
   - Scope proof: Both explicit/fallback folder resolution and phase-child pointer resolution were reread; each returns/propagates a non-canonical path after only lexical root checks, and every subsequent resume read is rooted from that path.
   - Affected surface hints: ["resume ladder", "phase-parent pointer", "findSpecDocuments read path", "workspace specs roots"]
   - Recommendation: Resolve the candidate and every redirected child with `realpath`, compare canonical paths against canonical allowed roots using a path-separator boundary, and retain the canonical path for all subsequent reads. Add an external-target symlink fixture for explicit resolution and phase-parent redirection.
   - Claim adjudication: {"type":"security path-confinement claim","claim":"A symlink under an allowed specs root can redirect resume reads outside the workspace.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:895-918",".opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:214-225",".opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:993-1050"],"counterevidenceSought":"A realpath-based check or a later canonical-path recheck before reading resume documents.","alternativeExplanation":"The workspace may be fully trusted and symlinks may be intentionally allowed, but the implementation comments describe an escape-prevention boundary and the code does not state such an exception.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"If all callers prove that workspace roots cannot contain attacker-controlled symlinks and the resume result is never exposed across a trust boundary; otherwise retain P1."}

2. **Graph metadata write guard accepts external paths merely containing a `specs` segment** -- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:63-87; .opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1693-1739` -- `isSpecsScopedPath` treats any absolute path containing `/specs/` as in-scope; it does not anchor the path to the current workspace's `specs` or `.opencode/specs` root. The graph writer canonicalizes a symlink target and then relies on that lexical classifier, so a caller can supply an external folder such as `/tmp/attacker/specs/system-spec-kit/999-packet` (or an in-root link to it) and the refresh path can write `graph-metadata.json` there despite reporting that it refuses paths outside a supported root.
   - Finding class: cross-consumer
   - Scope proof: The classifier has no workspace/root parameter or filesystem-root comparison, while both `writeGraphMetadataFile` and `refreshGraphMetadataForSpecFolder` use it as their final write authorization after `realpath`.
   - Affected surface hints: ["spec-doc path classifier", "graph metadata refresh", "atomic metadata writer", "API callers supplying folder paths"]
   - Recommendation: Make write authorization resolve against explicit canonical workspace roots (including the configured specs-root override where applicable), reject any target whose canonical parent is outside those roots, and test both an arbitrary external `/specs/` path and a symlinked in-root folder.
   - Claim adjudication: {"type":"security write-confinement claim","claim":"The graph metadata refresh/write path can write outside the supported workspace roots when the external path contains a `specs` segment.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:63-87",".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1693-1739"],"counterevidenceSought":"A caller-level canonical workspace-root check that always runs before the graph writer.","alternativeExplanation":"All current production callers may pass paths discovered from trusted roots, making the exported writer practically internal-only; that does not make the writer's stated boundary true for direct API use or future callers.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"If the exported refresh/write API is made non-callable outside a wrapper that performs canonical-root authorization, with a test proving the wrapper is universal; otherwise retain P1."}

3. **Unknown future fingerprint generations silently disable the integrity mismatch check** -- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:161-176; .opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-schema.ts:82-84` -- the validator returns immediately for every `source_fingerprint_docset` value other than the current `SOURCE_FINGERPRINT_DOCSET`, while the schema accepts any positive integer. That includes an unknown future generation, not only a known older generation. A generated metadata record carrying a future marker can therefore avoid `SOURCE_FINGERPRINT_MISMATCH` even when its stored digest disagrees with the current documents, turning the stale-generation compatibility escape into an integrity bypass rather than a bounded migration rule.
   - Finding class: cross-consumer
   - Scope proof: The validator's early return is unconditional for non-current values, and the schema imposes no upper bound or known-generation set; the parser persists the current marker at `graph-metadata-parser.ts:1471-1474`.
   - Affected surface hints: ["generated metadata integrity validator", "fingerprint generation schema", "strict validation gate", "future-generation compatibility tests"]
   - Recommendation: Treat only explicitly known older generations as grandfathered; surface an unknown/future generation as an integrity warning or error and do not claim current drift was checked. Add a fixture with a mismatching digest and a future positive marker.
   - Claim adjudication: {"type":"security integrity-gate claim","claim":"A future positive fingerprint-generation marker suppresses current-generation digest mismatch reporting.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:161-176",".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-schema.ts:82-84",".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1471-1474"],"counterevidenceSought":"A documented set of supported future generations or another integrity check that rejects unknown markers.","alternativeExplanation":"The early return may intentionally provide forward compatibility for validators older than the generator, but the current validator cannot distinguish that case from a forged or malformed marker.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"If a version-negotiation contract explicitly requires unknown future generations to be non-blocking and an independent check prevents stale derived data from being treated as current; otherwise retain P1."}

### P2 Findings
1. **Repair writes have a scan-to-write symlink race** -- `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:90-105,351-360` -- static discovery rejects symlink entries, but the repair loop later copies and writes the previously discovered pathname without rechecking its inode/type or using a no-follow/open-and-rename boundary. A concurrent replacement after discovery can make `copyFileSync` and `writeFileSync` follow a newly installed symlink and write outside the scanned tree. This requires a local concurrent attacker and is therefore advisory rather than a confirmed blocker.
   - Finding class: instance-only
   - Scope proof: `graphFiles` uses `Dirent.isFile()` during discovery, while the non-dry-run path later writes the path with no canonical revalidation or atomic destination replacement.
   - Affected surface hints: ["repair graph metadata", "non-dry-run write loop", "symlink race protection"]
   - Recommendation: Revalidate the destination immediately before writing and use an atomic temp-file plus rename in a canonical directory, or open the destination with no-follow semantics where supported; document the maintenance command's trust model.

## Traceability Checks
- `spec_code`: partial -- the packet promises no repair for pre-change fingerprints (`spec.md:76-85`, `acceptance-criteria.md:36-40`) and explicitly excludes symlinked repositories from writes, but it does not define in-tree symlink confinement or unknown-generation behavior.
- `checklist_evidence`: partial -- `tasks.md:43-52` records the generation marker and verification work, but no hostile path, symlink, future-marker, or repair-race evidence is present.
- `skill_agent`: notApplicable -- target is a spec folder.
- `agent_cross_runtime`: notApplicable -- no runtime mirror is in the declared security focus.
- `feature_catalog_code`: notApplicable -- no catalog entry is named by this packet.
- `playbook_capability`: notApplicable -- no named playbook claim was reviewed.

## Integration Evidence
- Fingerprint producer: `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:739,1471-1474`.
- Fingerprint consumer: `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:121-178`.
- Generation schema: `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-schema.ts:76-86`.
- Path classifier and document allowlist: `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:63-87`.
- Resume and phase-parent read path: `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:160-225,863-925,993-1050`.
- Discovery containment comparison: `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:157-164,419-442,469-525,1053-1060`.
- Repair/write boundary: `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:90-105,344-362`.

## Edge Cases
- The authoritative root `deep-review-state.jsonl` currently exposes only its initialization/config record, so its type=iteration count is zero despite the requested iteration 2, the registry's first finding, the existing iteration-001 artifact, and the ledger frame. The mismatch is recorded rather than silently rewriting the projection.
- Resume pointer segment validation blocks `..` and absolute pointer forms, but it does not protect against a symlink at a valid child name.
- `folder-discovery.ts` canonicalizes discovered directories and maintains a canonical visited set, and `generatePerFolderDescription` compares canonical folder/base paths; these clean surfaces do not cover the separate resume and graph-writer APIs.
- `repair-graph-metadata.mjs` does not statically traverse symlink entries, which is why the repair race remains P2 rather than a static symlink-follow finding.
- The packet's out-of-scope symlinked repositories are not a proof that a malicious symlink inside a supported root is safe; those are distinct boundaries.
- Code graph and semantic memory were unavailable; direct source reads and bounded searches were used. No validation, repair, build, or external CLI was run, consistent with the strategy non-goals and this review-only iteration.

## Confirmed-Clean Surfaces
- `folder-discovery.ts:469-525` realpath-normalizes the scan base, records canonical paths as visited, and prevents canonical relative paths escaping the base.
- `folder-discovery.ts:1053-1060` performs a canonical folder/base containment check before generating a per-folder description.
- `resume-ladder.ts:190-211` rejects malformed pointer shapes and parent-segment traversal lexically; the remaining defect is symlink canonicalization.
- `graph-metadata-parser.ts:1693-1714` uses a random temporary file and rename, so a destination replacement race is not equivalent to the direct repair writer's follow-on write.
- The prior iteration's acceptance-criteria fingerprint omission was not duplicated; the new findings concern path trust, symlink resolution, generation-version handling, and repair writes.

## Ruled Out
- No P0 was confirmed: the reviewed evidence did not establish an authentication/authorization bypass, destructive data loss, or privileged cross-tenant execution. The P1 findings remain required fixes because they cross read/write or integrity boundaries under plausible untrusted-input or repository conditions.
- Static symlink traversal by the repair scanner was ruled out: `Dirent.isFile()`/`isDirectory()` filters reject symlink entries during enumeration; only the scan-to-write race remains.
- The intended skip of known pre-change fingerprint generations was not itself treated as a defect; the active finding is that all unknown values are skipped without version discrimination.

## Next Focus
- dimension: traceability
- focus area: security evidence coverage for the packet's generation marker, path confinement, symlink assumptions, and repair boundary
- reason: this iteration found security-relevant gaps that are not represented in the packet's acceptance or task evidence; the final pass should reconcile exact claims, tests, and named integration surfaces without re-running exhausted correctness hypotheses.
- rotation status: planned
- blocked/productive carry-forward: productive -- carry the three P1 security boundaries and the P2 repair race for evidence reconciliation; do not duplicate the prior acceptance-criteria omission.
- required evidence: packet claim-to-code mapping, explicit hostile-path/symlink/future-generation test evidence, and exact command/workflow/skill integration touchpoints where available.
- recovery note: root projection/type=iteration mismatch remains unresolved; use the append gateway receipt and refreshed projection as the authoritative post-write check.

Review verdict: CONDITIONAL