---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Analyze every change branch 091-consolidate-small-packets made to the spec folder tooling and the spec corpus (the commits in git log origin/main..HEAD plus the uncommitted corpus-wide repair of phase 013), then answer: how do we harden it, and how do we automate healing and fixing of specs in old formats, including pre-v4 repos, so external users on older versions are not burdened? Answer five questions with file:line evidence. (1) Which one-off repair fixes should become permanent idempotent tooling, and where should each live? (2) What causes each validation failure class at the source, and how do we stop new instances? (3) How should an older or pre-v4 repo be detected and migrated or healed safely (dry run first, idempotent, reversible, never changing what a document says, never inventing history), and how does that fit /doctor:update? (4) What should be hardened in this branch's own changes: the CI trigger-index rebuild job and its token push, the template phrase cleanup and census tools, the seeder and the Gate 3 wording? (5) Which checks belong in CI or pre-commit so drift is caught early and cheaply? The lead's full brief, evidence paths, write limits and output shape are in steer.md inside the lineage directory; read it before init and before every iteration.
- Started: 2026-10-07T21:09:36Z
- Status: COMPLETE
- Iteration: 15 of 15
- Session ID: fanout-codex-luna-6-max-fast-1791406414802-qayl99
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Branch inventory and phase 013 repair boundary | spec-folder-tooling | 1.00 | 4 | complete |
| 2 | Failure-class taxonomy and overlap in the strict-validation baseline | validation-failure-taxonomy | 1.00 | 4 | complete |
| 3 | Template anchor boundaries and scaffold validation | - | 1.00 | 0 | complete |
| 4 | Archive moves and generated path metadata | - | 1.00 | 0 | complete |
| 5 | Template provenance and legacy markers | - | 1.00 | 0 | complete |
| 6 | Anchor repair boundaries | - | 1.00 | 0 | complete |
| 7 | Frontmatter defaults and missing documents | - | 1.00 | 0 | complete |
| 8 | Pre-v4 layout detection and migration | - | 1.00 | 0 | complete |
| 9 | Inferred metadata versus recovered history | - | 1.00 | 0 | complete |
| 10 | Release update and migration transaction boundaries | - | 1.00 | 0 | complete |
| 11 | Template phrase cleanup and legacy healer interaction | - | 1.00 | 0 | complete |
| 12 | Phase scaffold graph derivation and seeding | - | 1.00 | 0 | complete |
| 13 | Trigger-index workflow, CI placement, and Gate 3 wording | - | 1.00 | 0 | complete |
| 14 | Anchor contract and repair-safety adversarial pass | - | 0.95 | 0 | complete |
| 15 | Ranked synthesis across the five questions | - | 0.05 | 5 | complete |

- iterationsCompleted: 15
- keyFindings: 51
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- [x] What causes each validation failure class at the source, and how do we stop new instances?
- [x] How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- [x] What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- [x] Which checks belong in CI or pre-commit so drift is caught early and cheaply?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██████████████████▆▁
- score sparkline: ██████████████████▆▁
- Last 3 ratios: 1.00 -> 0.95 -> 0.05
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.05
- coverageBySources: {"code":85,"other":29}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Treating the Claude 5.5 roster commits as direct spec-folder tooling changes. The commit paths are Claude runtime and roster files; retain them in the branch ledger but do not analyze them as causes of spec validation failures. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:49] (iteration 1)
- Summing all per-rule counts to estimate distinct failing packets. One missing Level 2 document pair is reported under both FILE_EXISTS and LEVEL_MATCH. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4080] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4083] (iteration 2)
- Fixing only existing packet copies or adding a one-time corpus repair. That leaves the current template source emitting the same malformed section boundary for future packets. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1184] (iteration 3)
- Treating `description.json.specFolder` repair by itself as a complete path repair. The validator checks graph metadata and continuity pointers as well, so one field cannot clear the full mismatch class. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:99] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:102] (iteration 4)
- Automatically assigning the current version to a markerless legacy document. The absent marker does not establish which template, if any, produced the file. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:167] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40] (iteration 5)
- Treating every older marker version as a validation failure. The migration contract explicitly keeps v2.1 marker support indefinitely and current validation checks presence only. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:56] (iteration 5)
- Adding every anchor-related validation failure to `repair-derived.cjs`'s allow-list. That tool's boundary is repository facts that can be recomputed; duplicate and overlapping anchor choices can affect structure and references without enough evidence to infer intent. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:59] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs:64] (iteration 6)
- Copying frontmatter classification from `spec.md` into every sibling document without a document-type check. The goal template demonstrates that values differ across document classes. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/add-fm-fields.mjs:44] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:10] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:11] (iteration 7)
- Filling missing plans, tasks, or summaries from generic current templates as if they recorded completed work. The packet spec requires history-backed reconstruction and an explicit note for reconstructed documents. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:76] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:102] (iteration 7)
- Using an old or absent template-source marker by itself as proof that the whole repository needs migration. The documented policy keeps legacy markers readable indefinitely and treats marker normalization as unnecessary churn. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40] (iteration 8)
- Treating builder-generated title, description, trigger phrases, or default classification as recovered historical metadata. The source derives them from present content and document type, not a historical template record. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:985] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1056] (iteration 9)
- Treating every legacy validation finding as a pass without showing the baseline entries. The validator requires exact finding coverage and leaves unmatched details as errors. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1001] (iteration 9)
- Adding specs/ migration writes to the current release-update apply plan and relying on release rollback. The current updater inventories .skilled and rejects rollback paths outside its release units. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391] (iteration 10)
- Running a spec migration from doctor update check. Its contract allows no checkout writes and check has no persisted run record. [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:77] (iteration 10)
- Automatically reseeding archives during archive or restore while the phase 013 live-and-archived repair scope conflicts with the upgrader's frozen-snapshot contract. Record the conflict and keep archive mutation opt-in until one policy is selected. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59] (iteration 11)
- Treating the phrase-cleanup tool as the sole source of empty-list behavior. A later legacy upgrade runs heal-spec-docs and can restore literal defaults to any already-empty supported field. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:129] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392] (iteration 11)
- Relying on --phase output to satisfy the same graph-metadata state as a normal root scaffold. The phase route exits before the normal route's backfill block, and the supplied graph sample shows empty derived values. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1919] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2006] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/graph-metadata.json.txt:13] (iteration 12)
- Treating track-root refresh as a replacement for updating the phase parent's children_ids. The phase-mode call refreshes the track, and the validation rule separately compares a phase parent's children_ids with its on-disk phase children. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1830] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:157] (iteration 12)
- Putting a whole-corpus strict validation sweep in every local pre-commit. The current hook explicitly scopes checks around the staged change, while a separate scheduled workflow owns the whole-corpus report. No local runtime measurement was collected. [SOURCE: .opencode/scripts/git-hooks/pre-commit:4] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:3] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:13] (iteration 13)
- Treating the push branch filter as a restriction on manual dispatch. The workflow lists branches under `push` only; `workflow_dispatch` has no branch pattern of its own. [SOURCE: .github/workflows/trigger-index-rebuild.yml:6] [SOURCE: .github/workflows/trigger-index-rebuild.yml:9] (iteration 13)
- Treating a successful second apply as proof of rollback. The legacy upgrader's stepwise writes can converge after partial application, but no rollback record is visible in the inspected path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:381] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:410] (iteration 14)
- Treating marker-only edits as semantically neutral. Anchors define retrieval and generated-content boundaries, so a marker change can alter document structure even when natural-language prose stays untouched. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:687] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:692] (iteration 14)
- Treating the registry's current ANCHORS_VALID description or the tests' expected failures as proof that the runtime enforces required anchor IDs and order. The called native implementation only checks the marker lists and the registry dispatcher suppresses a second rule for that ID. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:716] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:728] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1073] (iteration 14)
- Running full-corpus strict validation in every local pre-commit: it is not supported by measured runtime evidence and would duplicate scheduled reporting. (iteration 15)
- Treating markerless historical documents as current-template documents: marker absence does not prove creation version or author intent. (iteration 15)
- Widening `repair-derived.cjs` to repair anchors or authored prose: those operations have structural or semantic effects and need separate evidence and undo. (iteration 15)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
