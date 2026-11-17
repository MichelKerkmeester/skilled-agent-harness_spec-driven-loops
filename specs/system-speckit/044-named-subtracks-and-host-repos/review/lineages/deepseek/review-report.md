# Deep Review Report - 044 Named Sub-Tracks and Host Repos

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is not PASS)
- **Active findings:** P0 = 0, P1 = 2, P2 = 14
- **Review scope:** commits `ac32d66fed..7714ff26b1` (36 changed files): declared sub-track support in track roots, refresh, sweep, `create.sh`, validation, parent derivation, `repair-derived.cjs` and `archive.sh`; the doctor `project_owned` entry and host `.skilled` merge build; and the host trigger-index docs. The target packet is `specs/system-speckit/044-named-subtracks-and-host-repos`.
- **Operator review focus:** Review the packet implementation in commits ac32d66fed..7714ff26b1: named sub-tracks (track-roots, refresh, sweep, create.sh, validate, parent derivation, repair-derived, archive.sh), the doctor project_owned entry and host .skilled build, and the host trigger-index docs. Check correctness, flat-track non-regression, path containment and symlink handling, and spec/doc alignment. Never open any .env file or any Barter file.
- **Workspace note:** the repository moved during the run. The packet was later relocated to `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos` by `26cc92b728a`; the reviewed commit range and implementation paths still resolve, and this lineage keeps the dispatch-bound artifact directory under the original `044-...` path. Scope safety: no `.env` file was opened; a single repository-wide `rg -l` during initial orientation traversed the tree and listed one match under `barter/`, but no Barter file content was reviewed, opened or cited. The review itself stayed within the packet and the changed code/docs.

The implementation is broad and test-heavy, and the flat-track paths are preserved. The conditional verdict comes from two path/declaration splits: `create.sh` follows a symlinked sub-track that every reader skips, and a symlinked `description.json` is accepted by validation/archive but refused by track-roots and the repair path. Both are reachable from ordinary operator actions and both produce a container whose classification differs between tools.
<!-- /ANCHOR:executive-summary -->

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL and two P1 findings remain active. The Planning Packet below is built from the reducer-owned registry and the iteration `findingDetails`. Every field is populated; no field is `UNKNOWN`.

```json Planning Packet
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R2-P1-001", "severity": "P1", "title": "create.sh --track <track>/<sub-track> writes through a symlinked sub-track that every reader skips", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1340"},
    {"id": "R2-P1-002", "severity": "P1", "title": "A linked description.json declares a sub-track in validation and archive but not in track-roots or the repair path", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:199"},
    {"id": "R1-P1-001", "severity": "P2", "title": "The parent repair cannot clear a sub-track parent after a move to the specs root or to another track", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:368"},
    {"id": "R1-P2-001", "severity": "P2", "title": "A symlinked graph-metadata.json reads differently in the two views", "file": ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:154"},
    {"id": "R1-P2-002", "severity": "P2", "title": "repair-derived treats the literal string null as absent but does not rewrite it", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:538"},
    {"id": "R2-P2-001", "severity": "P2", "title": "A three-segment --track value scaffolds a packet at a depth no reader scans", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1174"},
    {"id": "R2-P2-002", "severity": "P2", "title": "The doctor host-relative alias check is lexical; a host symlink inside the root can make the mirrored alias resolve outside it", "file": ".skilled/commands/doctor/scripts/symlink-engine.cjs:818"},
    {"id": "R3-P2-001", "severity": "P2", "title": "The declaration table requires a specId no reader enforces", "file": ".skilled/skills/system-spec-kit/references/structure/folder-structure.md:115"},
    {"id": "R3-P2-002", "severity": "P2", "title": "The track/sub-track example writes children_ids without the parent prefix", "file": ".skilled/skills/system-spec-kit/references/structure/folder-structure.md:385"},
    {"id": "R3-P2-003", "severity": "P2", "title": "The implementation summary says a deeper layout is reported but no reader scans a folder inside a sub-track", "file": "specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md:129"},
    {"id": "R3-P2-004", "severity": "P2", "title": "The packet completion percentage contradicts its complete status", "file": "specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md:26"},
    {"id": "R3-P2-005", "severity": "P2", "title": "The sub-track container parent_id contract has two writers with different answers", "file": ".skilled/skills/system-spec-kit/references/structure/folder-structure.md:116"},
    {"id": "R4-P2-001", "severity": "P2", "title": "The declaration rule exists in six copies that already disagree", "file": ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:76"},
    {"id": "R4-P2-002", "severity": "P2", "title": "readWorkingTreeTracks returns an array with an attached diagnostics property while readCommitTracks returns an object", "file": ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:163"},
    {"id": "R4-P2-003", "severity": "P2", "title": "create.sh declaration probe swallows every reader failure", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1031"},
    {"id": "R4-P2-004", "severity": "P2", "title": "The host-index instructions are duplicated in three files", "file": ".skilled/skills/system-spec-kit/references/structure/folder-structure.md:401"}
  ],
  "remediationWorkstreams": [
    {"order": 1, "severity": "P1", "theme": "Sub-track write containment", "findingIds": ["R2-P1-001"]},
    {"order": 2, "severity": "P1", "theme": "One declaration predicate across validation, archive and the readers", "findingIds": ["R2-P1-002", "R4-P2-001"]},
    {"order": 3, "severity": "P1", "theme": "Move-repair completeness for parents", "findingIds": ["R1-P1-001", "R1-P2-002"]},
    {"order": 4, "severity": "P2", "theme": "View and API parity", "findingIds": ["R1-P2-001", "R4-P2-002"]},
    {"order": 5, "severity": "P2", "theme": "Input validation and failure visibility", "findingIds": ["R2-P2-001", "R4-P2-003"]},
    {"order": 6, "severity": "P2", "theme": "Spec and doc alignment", "findingIds": ["R3-P2-001", "R3-P2-002", "R3-P2-003", "R3-P2-004", "R3-P2-005", "R4-P2-004"]},
    {"order": 7, "severity": "P2", "theme": "Doctor containment hardening", "findingIds": ["R2-P2-002"]}
  ],
  "specSeed": [
    "Add an explicit write-containment rule for `create.sh --track`: a two-segment value must resolve inside `specs/` after every component, and a symlinked sub-track must be refused or named rather than followed silently.",
    "Define the sub-track declaration as one predicate: exact `level` word, a regular (non-symlink) `description.json`, no `spec.md`, direct child of a track root, and one named level only. Make the validator, archive, orchestrator, repair and parser call it.",
    "State the linked-description policy in the packet docs and the manifest schema so a symlinked `description.json` has one answer across tools.",
    "Define the `parent_id` contract for a sub-track container itself and for a packet moved out of a sub-track to the specs root or another track.",
    "Correct the `specId` and `children_ids` examples in `folder-structure.md`, and align the known-limitation wording for a deeper layout with what the readers actually scan."
  ],
  "planSeed": [
    "T1: Reject or explicitly warn on a symlinked two-segment `--track` before `mkdir`; add a create-track containment test for `ln -s`.",
    "T2: Export one `isDeclaredSubTrack` helper (Node) and call it from `validate.sh`, `archive.sh`, `orchestrator.ts`, `repair-derived.cjs` and `graph-metadata-parser.ts`; add a matrix test for regular vs linked `description.json`.",
    "T3: Extend `expectedParentId` to the specs root and a different track, or document the limitation in the packet's Known Limitations and the repair output; add the two move cases.",
    "T4: Normalize the literal `\"null\"` parent to JSON null when the expected parent is null; add a repair test.",
    "T5: Return `{ tracks, diagnostics }` from `readWorkingTreeTracks`, update all callers and tests; optionally keep a compatibility wrapper.",
    "T6: Add a warning when `create.sh`'s declaration probe fails for a reason other than 'not declared'.",
    "T7: Fix the `child`/`children_ids` example, the `specId` row, the deeper-layout limitation, the `completion_pct`, and the container `parent_id` contract; cross-link the host-index docs and remove the duplicated command block.",
    "T8: Re-run the track, create, validate, archive, repair and doctor suites plus the two P1 regression cases."
  ],
  "findingClasses": [
    "path_containment",
    "declaration_consistency",
    "incomplete_move_repair",
    "view_parity",
    "repair_idempotence",
    "input_validation",
    "containment_hardening",
    "doc_contract_mismatch",
    "doc_example_wrong",
    "doc_behavior_mismatch",
    "completion_metadata_inconsistent",
    "writer_contract_mismatch",
    "duplicate_rule",
    "api_shape_asymmetry",
    "failure_visibility",
    "duplicated_documentation"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs",
    ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs",
    ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts",
    ".skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts",
    ".skilled/commands/doctor/scripts/symlink-engine.cjs",
    ".skilled/skills/system-spec-kit/references/structure/folder-structure.md",
    ".skilled/skills/system-spec-kit/runtime/data/README.md",
    ".skilled/commands/speckit/search.md",
    "specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | file:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|----|----------|-----------|-------|-----------|----------|--------|--------------------|-------------|---------------|-------------|------------------------|
| R2-P1-001 | P1 | security | `create.sh --track <track>/<sub-track>` writes through a symlinked sub-track that every reader skips | `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1340` | `validate_track_value` has no `-L` check; `SPECS_DIR` is appended and `mkdir -p` follows the link; `track-roots.mjs:133-136` skips the folder and `create.sh:1051` suppresses the refresh. | A packet can be written outside the tree the track tools read, invisible to refresh and sweep. | Refuse or warn on a symlinked two-segment value before `mkdir`; add a create containment test. | active | path_containment | `--track` is user input; the two-segment form is the new sub-track form. | `create.sh`, `track-roots.mjs`, `sweep-track-roots.mjs`, `archive.sh` |
| R2-P1-002 | P1 | security | A linked `description.json` declares a sub-track in validation and archive but not in track-roots or the repair path | `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:199` | `validate.sh:199`, `archive.sh:204`, `orchestrator.ts:226-236` follow the link; `track-roots.mjs:143-145`, `repair-derived.cjs:325`, `graph-metadata-parser.ts:860-862` refuse it. | One tree is classified two ways; validation/archive accept a container that refresh/sweep cannot see. | Export one declaration predicate that includes the link policy and call it everywhere. | active | declaration_consistency | All five implementations read the same field of the same folder. | `validate.sh`, `archive.sh`, `orchestrator.ts`, `track-roots.mjs`, `repair-derived.cjs`, `graph-metadata-parser.ts` |
| R1-P1-001 | P2 | correctness | The parent repair cannot clear a sub-track parent after a move to the specs root or to another track | `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:368` | `segments.length < 2` is unknown; the clear branch at `:384-388` requires the same track. | A moved packet keeps a stale parent and a review flag. | Document the limitation, or extend `expectedParentId` to the root and another track. | downgraded after documented decision | incomplete_move_repair | `repair-derived.cjs` is the move-repair tool; the destinations are ordinary `specs/` locations. | `repair-derived.cjs`, `graph-metadata-parser.ts` |
| R1-P2-001 | P2 | correctness | A symlinked `graph-metadata.json` reads differently in the two views | `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:154` | Working tree `readOptionalText` follows the link; commit view reads the blob (link text) at `:258-262`. | The pre-push sweep can call a metadata file unreadable that the refresh just wrote. | Refuse a linked metadata file in the working tree or follow it in the commit view with a normalized target. | active | view_parity | The two views are documented as equivalent. | refresh, `sweep --rev`, pre-push gate |
| R1-P2-002 | P2 | correctness | `repair-derived` treats the literal string `"null"` as absent but does not rewrite it | `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:538` | `recorded` normalizes to null; the action is skipped when equal, so the literal remains. | A repair reports clean while the file still carries a phantom parent. | Rewrite the literal to JSON null when the expected parent is null. | active | repair_idempotence | `fixRecordedLocation` is the repair for the field. | repair counts, graph merge |
| R2-P2-001 | P2 | security | A three-segment `--track` value scaffolds a packet at a depth no reader scans | `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1174` | `validate_track_value` has no segment-count limit; `refresh_track_root:1050` refuses the refresh. | An invisible packet at an unsupported depth. | Refuse or name the unsupported depth before scaffolding. | active | input_validation | `--track` is caller input. | `create.sh`, track readers, recursion |
| R2-P2-002 | P2 | security | The doctor host-relative alias check is lexical; a host symlink inside the root can make the mirrored alias resolve outside it | `.skilled/commands/doctor/scripts/symlink-engine.cjs:818` | `isWithin` is lexical (`:197-200`); `linkTargetExists` realpaths only for existence (`:481-484`). | A mirrored alias can resolve outside the host root; the host already owns the target symlink, so impact is reduced. | Realpath the host target before accepting it. | active | containment_hardening | The target check is the only gate before `op:link`. | `inspectMergeTree`, `planMergeTree` |
| R3-P2-001 | P2 | traceability | The declaration table requires a `specId` no reader enforces | `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:115` | Readers check only `level`; the fixture writes no `specId`; `specId` is the numeric prefix elsewhere. | A doc-compliant sub-track carries a semantically foreign id. | Remove the `specId` requirement or enforce it in the predicate. | active | doc_contract_mismatch | The table is the normative declaration contract. | docs, readers, fixture |
| R3-P2-002 | P2 | traceability | The track/sub-track example writes `children_ids` without the parent prefix | `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:385` | `expectedChildrenIds` prepends the identity; `compareTrackChildren` treats a bare entry as foreign. | A copied example produces sweep drift and a refresh rewrite. | Show full ids in the example. | active | doc_example_wrong | The writers and tests use full ids. | docs, refresh, sweep |
| R3-P2-003 | P2 | traceability | The implementation summary says a deeper layout is reported but no reader scans a folder inside a sub-track | `specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md:129` | Only direct children of a track are scanned; a folder inside a sub-track is never a candidate. | The known-limitation row overstates the diagnostics. | Correct the limitation or add the scan. | active | doc_behavior_mismatch | The statement is the packet's own contract. | readers, sweep, create |
| R3-P2-004 | P2 | traceability | The packet completion percentage contradicts its complete status | `specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md:26` | `completion_pct: 90` versus `recent_action` all tasks done, `spec.md` Complete, acceptance Closeable Yes. | A save or status reader reports an incomplete packet. | Reconcile the completion fields. | active | completion_metadata_inconsistent | Same packet, same transaction. | implementation summary, spec, acceptance |
| R3-P2-005 | P2 | traceability | The sub-track container `parent_id` contract has two writers with different answers | `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:116` | The docs and `repair-derived.cjs:374-375` say the track; `resolveParentId` returns null for the container (`graph-metadata-parser.ts:887-897`). | A container refresh re-derives null and the merge keeps a flagged stored parent. | Define the container contract in one writer and test it. | active | writer_contract_mismatch | Both writers target the same field. | parser, repair, schema, save |
| R4-P2-001 | P2 | maintainability | The declaration rule exists in six copies that already disagree | `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:76` | Linked description accepted by 3 copies and refused by 3; `archive.sh:201` rejects a `z_` track, `validate.sh:196` and `orchestrator.ts:242` do not. | A one-word policy change needs six coordinated edits. | Export one predicate and call it everywhere. | active | duplicate_rule | Every copy answers the same question. | all six copies |
| R4-P2-002 | P2 | maintainability | `readWorkingTreeTracks` returns an array with an attached `diagnostics` property while `readCommitTracks` returns an object | `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:163` | The property is outside the array elements; the commit view returns `{tracks, skipped, diagnostics}`. | A copied array silently loses diagnostics. | Return `{tracks, diagnostics}` from both views. | active | api_shape_asymmetry | Same module, two view functions. | callers, tests |
| R4-P2-003 | P2 | maintainability | `create.sh` declaration probe swallows every reader failure | `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1031` | `>/dev/null 2>&1` hides a missing or broken reader; the writer path has a `report_missing_generator` warning. | A silent skip looks like "not declared". | Warn when the probe fails for a non-declaration reason. | active | failure_visibility | The reader path is a hard prerequisite. | `is_declared_subtrack`, operator stderr |
| R4-P2-004 | P2 | maintainability | The host-index instructions are duplicated in three files | `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:401` | The same block appears in `runtime/data/README.md:37-56` and `search.md:81-84`. | A flag or path change can leave two stale copies. | Keep one canonical block and cross-link it. | active | duplicated_documentation | Same commands for the same host mode. | three docs, retrieval CLIs |

## 4. Remediation Workstreams

### P1 - fix before PASS

1. **Sub-track write containment (`R2-P1-001`).** Resolve `SPECS_DIR` after appending the two-segment `--track` and refuse a symlinked sub-track before `mkdir`; add a containment test for `ln -s` into and outside `specs/`.
2. **One declaration predicate (`R2-P1-002`, `R4-P2-001`).** Export a single `isDeclaredSubTrack` from `track-roots.mjs` (or a shared helper) that enforces the exact level word, a regular `description.json`, no `spec.md`, the direct-child rule and the one-level rule; call it from `validate.sh`, `archive.sh`, `orchestrator.ts`, `repair-derived.cjs` and `graph-metadata-parser.ts`.

### P2 - advisories

3. **Move-repair completeness (`R1-P1-001`, `R1-P2-002`).** Either extend `expectedParentId` to the specs root and a different track, or record the limitation in the Known Limitations and the repair output; normalize the literal `"null"` when the expected parent is null.
4. **View and API parity (`R1-P2-001`, `R4-P2-002`).** Refuse or normalize a linked metadata file in both views; return the same object shape from both view functions.
5. **Input validation and failure visibility (`R2-P2-001`, `R4-P2-003`).** Refuse a three-segment `--track` or name the unsupported depth; warn when the declaration probe fails for a reason other than "not declared".
6. **Doc alignment (`R3-P2-001` to `R3-P2-005`, `R4-P2-004`).** Fix the `specId` row, the `children_ids` example, the deeper-layout limitation, the `completion_pct`, the container `parent_id` contract, and the duplicated host-index block.
7. **Doctor containment hardening (`R2-P2-002`).** Realpath the host target before mirroring a host-relative alias.

## 5. Spec Seed

- Add a `create.sh --track` write-containment rule: a two-segment value must resolve inside `specs/` after every component; a symlinked sub-track is refused or named, never followed silently.
- Make the sub-track declaration a single contract with one implementation: exact `level` word, regular `description.json`, no `spec.md`, direct child of a track root, one named level only.
- State the linked-description policy once and apply it to validation, archive, orchestrator, repair and parser.
- Define the `parent_id` of a sub-track container itself and of a packet moved from a sub-track to the specs root or another track.
- Correct the declaration table (`specId`), the `children_ids` example, the deeper-layout limitation, the completion metadata and the host-index command duplication.

## 6. Plan Seed

- T1: Containment test and a symlink refusal/warning for `create.sh --track`.
- T2: Shared declaration predicate plus a matrix test for regular vs linked `description.json` and a `z_` track.
- T3: Parent-repair cases for the specs root and a different track, or a documented limitation.
- T4: Literal `"null"` normalization in `repair-derived`.
- T5: `{tracks, diagnostics}` return shape for both views.
- T6: Reader-failure warning in `create.sh`.
- T7: Documentation corrections and a single host-index command block.
- T8: Re-run the track, create, validate, archive, repair and doctor suites with the two P1 regression cases.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | REQ-001/002/003/007/008/009/010/011/012 map to the changed code and docs; REQ-004/005/006 carry the recorded caveats. | The create write path and the linked-description split are not covered by the requirements. |
| `checklist_evidence` | partial | AC-001 to AC-012 are written and evidenced in the packet; this review confirms the code paths the rows name. | The tests were not executed by this lineage, so the numeric claims are the packet's evidence, not this review's. AC-008's symlink policy is contradicted by R2-P1-001 and R2-P1-002. |

### Overlay Protocols

| Protocol | Status | Note |
|----------|--------|------|
| `skill_agent` | notApplicable | No skill or agent definition is changed. |
| `agent_cross_runtime` | notApplicable | No runtime mirror is changed. |
| `feature_catalog_code` | notApplicable | No feature-catalog entry is changed. |
| `playbook_capability` | notApplicable | No playbook capability is changed. |

### AC_COVERAGE

`AC_COVERAGE: advisory-shortfall` (Level 2, `acceptance-criteria.md` present, `implementation-summary.md` complete). The packet marks every criterion Met with evidence, but this review found two active P1s that contradict AC-008's symlink/diagnostic policy and the create write path; the signal is advisory and does not change the verdict enum, which is already CONDITIONAL on the P1s.

## 8. Deferred Items

- **Existing whole-link `.skilled` installs** are reported as linked and left alone (`implementation-summary.md:131`); the new per-child merge build only applies when the host has no `.skilled/` entry. A host that upgrades does not get the `specs` alias fix automatically.
- **A sub-track container's `parent_id`** is documented as its track by the table and written by `repair-derived`, but the parser returns null for the container; this is deferred with R3-P2-005.
- **The doctor `.env.example` fallback** links the checkout's file when the host has none; the test asserts it and the manifest marks the entry `project_owned`, but no operator-facing doc describes the fallback.
- **Trigger-index freshness** was not independently verified; the package does not ship a separate `corpus-manifest.json` to compare against the index's `manifestHash` without running the generator.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: the two active P1s and the P2 advisories above. No divergent pivot was taken; the loop used its five dimensions and the operator focus.

## 9. Search Ledger

- `searchCoverage`: not recorded by this lineage; the review used direct reads of the changed files and their tests, not a v2 search ledger.
- `candidateCoverage`: not recorded; no v2 `reviewDepthSchemaVersion` was emitted.
- `searchDebt`: empty.
- `ruledOutCandidates`: see each iteration's Ruled Out section; no candidate was left unresolved.
- `cleanSearchProof`: the reviewed surfaces are the files listed in each iteration's Files Reviewed; no generated coverage graph was seeded by this lineage.
- **hasSearchDebt:** false.

*No search-depth state captured beyond the iteration file lists (legacy v1 record).*

## 10. Audit Appendix

### Convergence Summary

- Iterations: 5 of 5 (`stopPolicy: max-iterations`); convergence was treated as telemetry and the loop ran to the ceiling because two P1s remained active.
- Dimension coverage: correctness, security, traceability, maintainability all covered.
- Finding trend: iteration 1 = 3 (P1 1, P2 2); iteration 2 = 4 (P1 2, P2 2); iteration 3 = 5 P2; iteration 4 = 4 P2; iteration 5 = 0. The R1-P1-001 downgrade moved one P1 to P2 after the packet's recorded decision.
- Active totals: P0 = 0, P1 = 2, P2 = 14. Registry convergence score 1.0, graph convergence score 0 (no graph seed).
- **Reducer dimension attribution:** the reducer derives a finding's dimension from the iteration focus sentence and the finding text. The two P1s are counted under `correctness` in the dashboard's dimension table because the iteration-2 focus sentence names "path containment" and "symlink handling" rather than the literal word "security"; the report labels them security because that is the substantive dimension. The severity counts that drive the verdict are unaffected.

### Coverage Summary

| Dimension | Iterations | Status | Main evidence |
|-----------|------------|--------|---------------|
| correctness | 1, 5 | complete | track roots, refresh, sweep, repair-derived, flat-tree tests |
| security | 2, 5 | complete | create.sh, archive.sh, validate.sh, orchestrator, doctor links |
| traceability | 3 | complete | spec/REQ/AC, folder-structure, host index docs, manifest |
| maintainability | 4 | complete | six predicates, view return shapes, create probe, doc duplication |

### Ruled-Out Claims

- Flat tracks keep byte-identical metadata after refresh (test and code).
- Both views skip a symlinked sub-track and a symlinked description.
- The sweep's diagnostics are advisory and do not change its exit code.
- `archive.sh` refuses a symlinked path component before classifying a packet home.
- The doctor `project_owned` entry preserves a real host file and the host `specs` alias is created only when the host folder exists.
- The host trigger-index commands name flags the target CLIs accept; the lookup defaults to the packaged index without `--index`.

### Sources Reviewed

All paths are relative to the repository root at the reviewed commit range `ac32d66fed..7714ff26b1`. The full per-iteration source lists are in `iterations/iteration-001.md` through `iteration-005.md` and in the iteration JSONL records. No `.env` file was opened. A single repository-wide `rg -l` during initial orientation listed one match under `barter/`; no Barter file content was reviewed, opened or cited, and the review was narrowed to the packet and the changed code/docs immediately after.

### Workspace Conflict

The repository was reorganized during the run; the packet now lives at `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos` after `26cc92b728a`. The reviewed commit range still resolves and the implementation paths are unchanged. This lineage keeps the dispatch-bound artifact directory and records the move as a workspace note, not a code finding.

---

**Review verdict: CONDITIONAL**
