---
title: "Tasks: D2-R9 — Pipeline & handoff visibility across the /design:* surface"
description: "Ordered build tasks with verification for adding pipeline to command-metadata.json, generating wrapper Pipeline & Handoff sections + PRODUCES/NEXT/PROOF status tail, and extending design-command-surface-check.mjs to enforce a fully-declared, recommend-only pipeline graph reconciled with next."
trigger_phrases:
  - "d2-r9 pipeline handoff tasks"
  - "design command pipeline visibility tasks"
  - "design build handoff tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/009-pipeline-handoff-visibility"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all D2-R9 tasks complete with checker evidence; PASS invalid=0 drift=0"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r9-pipeline-handoff-visibility"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Recommend-only enforced positively (marker + bidirectional graph) instead of a phrase ban"
---
# Tasks: D2-R9 — Pipeline & handoff visibility across the /design:* surface

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Extend the SSOT (45–75 min)

- [x] T001 Confirm the prior D2 baseline is green: `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` → `invalid=0 drift=0` before any edit [10m] — EVID: additive baseline confirmed; final run still `STATUS=PASS invalid=0 drift=0`
- [x] T002 Add a `pipeline{ stage, acceptsFrom, produces, nextCommands, proofRequired }` object to each of the five records, using the `plan.md` §3 authored table (`.opencode/skills/sk-design/command-metadata.json`) [25m] — EVID: all 5 records carry `pipeline`; stages extract/direction/system/behavior/review
- [x] T003 Reconcile each record: `nextCommands ⊆ next`, `produces == outputContract.primaryArtifactName`, `proofRequired == proofFields` [15m] — EVID: checker `validatePipeline` green for all 5; produces==primaryArtifactName confirmed
- [x] T004 Confirm the pipeline graph is the exact inverse — `acceptsFrom = { B : A ∈ B.nextCommands }` — `md-generator` has empty `acceptsFrom`, and the five `stage` labels are distinct [10m] — EVID: `validatePipelineGraph` green; `md-generator` acceptsFrom=[]; 5 unique stages
- [x] T005 Confirm valid JSON, five records, and no spec/packet/phase ID or spec path embedded (evergreen [HARD]) [5m] — EVID: `python3 json.load` OK, 5 records; no IDs/paths in metadata

**Verify Phase 1:** JSON parses; exactly 5 records; every record has `pipeline` with valid sub-fields; `nextCommands ⊆ next`; `acceptsFrom == inverse(nextCommands)`; stages unique. — DONE

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Generate the wrapper sections (1–1.5 h)

- [x] T006 [P] Insert the generated `## 6. PIPELINE & HANDOFF` block in `md-generator.md`, projected from its `pipeline`; renumber `## 6. EXAMPLE` to `## 7. EXAMPLE` (`.opencode/commands/design/md-generator.md`) [15m] — EVID: section at line 72; `## 7. EXAMPLE` at line 81
- [x] T007 [P] Same for `interface.md` (`.opencode/commands/design/interface.md`) [10m] — EVID: PIPELINE & HANDOFF at line 70
- [x] T008 [P] Same for `foundations.md` (`.opencode/commands/design/foundations.md`) [10m] — EVID: PIPELINE & HANDOFF at line 70
- [x] T009 [P] Same for `motion.md` (`.opencode/commands/design/motion.md`) [10m] — EVID: PIPELINE & HANDOFF at line 70
- [x] T010 [P] Same for `audit.md` (`.opencode/commands/design/audit.md`) [10m] — EVID: PIPELINE & HANDOFF at line 70
- [x] T011 In each section, name the stage, the accepts-from sources, the produced artifact, the recommend-only next commands, and the `sk-code` build-handoff card (`.opencode/skills/sk-design/shared/sk_code_handoff.md`); include the `Recommend-only:` marker [15m] — EVID: `Recommend-only:` 5/5; `sk-code` handoff line 5/5
- [x] T012 Upgrade each INSTRUCTIONS Return-Status success line to `STATUS=OK PRODUCES=<artifact> NEXT=<recommended-commands> PROOF=<proof-fields>` (preserve the `STATUS=OK` substring) [15m] — EVID: `STATUS=OK PRODUCES= NEXT= PROOF=` 5/5; `STATUS=OK` substring preserved
- [x] T013 Confirm each wrapper's frontmatter (`description`, `argument-hint`, `allowed-tools`) is byte-unchanged so existing drift stays 0 [10m] — EVID: frontmatter drift stays 0 in full checker run

### Extend the checker (1.5–2 h)

- [x] T014 Add `pipeline` to `REQUIRED_FIELDS` and `DRIFT_FIELDS`; add `validatePipeline`: sub-field validity (`stage` string; `acceptsFrom`/`nextCommands` known commands, no self; `produces` string; `proofRequired` non-empty array) → exit 2 (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [30m] — EVID: `validatePipeline` at line 505; `REQUIRED_FIELDS`/`DRIFT_FIELDS` extended
- [x] T015 In `validatePipeline`, enforce reconciliation: `nextCommands ⊆ next`; `produces == outputContract.primaryArtifactName`; `proofRequired` set-equal `proofFields` → exit 2 [20m] — EVID: reconciliation rules wired via `validatePipelineCommandList` (lines 529–554)
- [x] T016 Add the cross-record `validatePipelineGraph`: `acceptsFrom` must equal `inverse(nextCommands)` for every record, and the five `stage` labels must be unique → exit 2 [25m] — EVID: `validatePipelineGraph` at line 579; called at line 259
- [x] T017 Add the Stage-2 rule: `extractPipelineSection` + `expectedPipelineDrift` — require the markers `Stage:` / `Accepts from:` / `Produces:` / `Hands to next` / `Hands to build:` / `Recommend-only:`, every `nextCommands` token, the `sk-code` handoff line, and the `PRODUCES=` / `NEXT=` / `PROOF=` tail; report misses as drift `field: "pipeline"` (exit 1) [30m] — EVID: `expectedPipelineDrift` at line 713; called at line 706
- [x] T018 Run `node --check` on the checker; confirm no spec/packet/phase ID or spec path is embedded (evergreen [HARD]) [10m] — EVID: `node --check` PASS (CHECKER_SYNTAX_OK)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (30–45 min)

#### Functional
- [x] T019 Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression; prior D2 sections intact) [10m] — EVID: `STATUS=PASS STAGE=complete` / `SUMMARY invalid=0 drift=0` / EXIT=0
- [x] T020 Synthetic break — remove one record's `pipeline` → checker exits 2 (INVALID); restore [5m] — EVID: orchestrator-verified; missing `pipeline` → INVALID, restored to invalid=0
- [x] T021 Synthetic break — set one `nextCommands` entry to a command not in that record's `next`, then separately break the `acceptsFrom` inverse → checker exits 2 each time; restore [5m] — EVID: orchestrator-verified; `acceptsFrom` non-inverse → "must match inverse nextCommands", restored
- [x] T022 Synthetic break — drop the `sk-code` handoff line / remove the `Recommend-only:` marker in one wrapper → checker reports `pipeline` drift, exit 1; restore [5m] — EVID: orchestrator-verified; Stage-2 `pipeline` drift fires, restored

#### Integrity
- [x] T023 Confirm `mode-registry.json` and `shared/sk_code_handoff.md` are byte-unchanged (sha / `git diff`) [5m] — EVID: `git status` shows neither file changed
- [x] T024 Confirm `git status` shows only the three intended targets changed (metadata, five wrappers, checker) [5m] — EVID: exactly 7 paths modified (1 JSON + 5 wrappers + checker)

#### Documentation
- [x] T025 Re-read the three artifacts; confirm evergreen (no IDs/paths in metadata, wrappers, or checker; the `sk_code_handoff.md` reference is a durable skill path, not a spec path); `node --check` passes [5m] — EVID: handoff card cited by durable skill path; `node --check` OK
- [x] T026 Mark all checklist items with evidence; author `implementation-summary.md` [10m] — EVID: checklist 33/33 verified; `implementation-summary.md` authored (Level 2)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `command-metadata.json` validates (5 records, each with a valid `pipeline`; `nextCommands ⊆ next`; `acceptsFrom == inverse(nextCommands)`; unique stages)
- [x] Every wrapper carries the generated `Pipeline & Handoff` section (incl. `sk-code` handoff line + recommend-only marker) and the `STATUS=OK PRODUCES= NEXT= PROOF=` tail
- [x] `node design-command-surface-check.mjs` passes additively (`invalid=0 drift=0`, exit 0)
- [x] Synthetic breaks flag (metadata exit 2 / wrapper drift exit 1)
- [x] `mode-registry.json` + `shared/sk_code_handoff.md` byte-unchanged; checker `node --check` clean
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `044-design-routing-and-integration-research/research/research.md` §5 (D2-R9)
- **Upstream SSOT**: See sibling `003-command-metadata-ssot` (D2-R3) — the record shape + checker extended here
- **Reconciliation anchors**: `next` (D2-R3), `outputContract.primaryArtifactName` (D2-R5 `005-deliverable-output-contract`), `proofFields` (D2-R3); the build-handoff card `sk-design/shared/sk_code_handoff.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Adds pipeline to command-metadata.json, generates wrapper Pipeline & Handoff sections + PRODUCES/NEXT/PROOF tail, extends the surface-check with reconciliation + a fully-declared graph rule
- Strictly additive: frontmatter frozen, mode-registry + sk_code_handoff untouched, final drift=0
-->
