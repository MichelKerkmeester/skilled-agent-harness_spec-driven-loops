---
title: "Tasks: generation and cleanup"
description: "Task breakdown for the G1-G4 + A-W4/A-G2 generation-and-cleanup phase, ordered A-W4 schema standardization then G1 generator + --check gate then G2 command-local fixes then A-G2 deep-router slimming then G3 hint budget then G4 ergonomics canon then the full gate set. All tasks complete: G1/A-W4/G3/G4 shipped; G2 and A-G2 resolved by evidence."
status: complete
trigger_phrases:
  - "generation cleanup tasks"
  - "command router generator tasks"
  - "A-W4 table standardization"
  - "G4 ergonomics canon tasks"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/005-generation-and-cleanup"
    last_updated_at: "2026-07-16T18:23:19Z"
    last_updated_by: "claude"
    recent_action: "Shipped G1-G4 + resolved G2/A-G2 by evidence; gates green"
    next_safe_action: "Merge the worktree and FF-push to origin"
    completion_pct: 100
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
---
# Tasks: generation and cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`. All tasks are `[x]` — G1/A-W4/G3/G4 shipped; G2 and A-G2 resolved by evidence.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 Uniform tables | T001-T003 | Day 1 |
| M2 Generator live | T004-T007 | Day 2 |
| M3 Command-local clean | T008-T011 | Day 2 EOD |
| M4 Routers slimmed | T012-T015 | Day 3 AM |
| M5 Canon + gate green | T016-T024 | Day 3 EOD |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### A-W4 Schema Standardization (REQ-002, lands before the generator)
- [x] T001 Standardize the OWNED ASSETS table to `| Purpose | Asset |` across all families (`.opencode/commands/**`) — create×11 + memory×4 collapsed 3-col→2-col (`164b06a571`)
- [x] T002 Standardize the EXECUTION TARGETS table to `| Mode | Target |` across all families (`.opencode/commands/**`) {deps: T001} — design/speckit/deep headers flipped from `Workflow` (`164b06a571`)
- [x] T003 Reconcile the create family's divergent tables to the `command_router_template.md` shapes and confirm a single uniform parse target (`.opencode/commands/create/*.md`) {deps: T002} — 11 numbered procedures reshaped to `| Mode | Target |`, routing relocated to MODE ROUTING; `validate_document.py --type command` exit 0 (`5fbf223ec8`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### G1 Generator + `--check` drift gate (REQ-001)
- [x] T004 Scaffold `generate-command-routers.cjs` as a sibling to `sync-prompts.cjs` (`.opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs`) {deps: T003} — created (`2e21f4eb77`)
- [x] T005 Implement `buildExpectedSpans()` reading `command_contract.json` for the five contract-derivable spans (argument-hint, OWNED ASSETS, EXECUTION TARGETS, MODE ROUTING, PRESENTATION BOUNDARY) {deps: T004} — contract-derived, no hard-coded family names
- [x] T006 [P] Implement section-scoped write for the five spans (no whole-file render) {deps: T005} — `--write` normalizes table shape + asset-path cells only (`164b06a571`)
- [x] T007 Implement the `--check` span-diff gate; confirm clean on the conformant tree and failing on a staled committed span {deps: T006} — `--check`: `35/35 routers clean, 0 path-drift, 0 shape-drift`; staled path → `PATH-DRIFT`

### G2 Command-local contract fixes (REQ-003) — resolved as a confirmed no-op
- [x] T008 Repair the `deep/research.md` timeout claim to match the contract (`.opencode/commands/deep/research.md`) {deps: T007} — already contract-consistent (fixed by 001/003 conformance); phase-003 adapter `[]`
- [x] T009 [P] Repair the `memory/save.md` hint / fallback text to match the contract (`.opencode/commands/memory/save.md`) {deps: T007} — already contract-consistent; phase-003 adapter `[]`
- [x] T010 [P] Repair the create-family `.txt` presentation-ownership labels (`.opencode/commands/create/*_presentation.txt`) {deps: T007} — already contract-consistent; phase-003 adapter `[]`
- [x] T011 Confirm the phase-003 semantic checks (gate-obligation, mode-completeness, reference coverage) and the generator span-diff pass without exceptions for the three fixed files {deps: T008, T009, T010} — `sk-doc-command.cjs check .opencode/commands` returns `[]`; generator path-drift=0

### A-G2 Deep-router ownership slimming (REQ-004) — evidence-satisfied, operator-approved no mutation
- [x] T012 Snapshot the current `deep/*` dispatch behavior as the behavior-preserving baseline {deps: T007} — not required: display already externalized to `deep_*_presentation.txt` (300-470 lines)
- [x] T013 Move display-box prose the PRESENTATION BOUNDARY assigns to an asset out of the router into its asset file (`.opencode/commands/deep/*.md`, deep asset files) {deps: T012} — N/A: routers §2-6 are already thin references; remaining bulk is load-bearing behavioral safeguards the boundary does not assign to an asset
- [x] T014 [P] Move autonomous-directive prose the boundary assigns to an asset into its asset file {deps: T012} — N/A: `PHASE 0` gate, `MANDATORY INPUT GATE`, `AUTONOMOUS EXECUTION DIRECTIVE` are router-owned safeguards; inline `⛔ DIRECT INVOCATION REQUIRED` box is the fail-fast display (0/7 presentation assets)
- [x] T015 Confirm the slimmed routers keep gates, binding, mode-selection, and summary, and match the snapshot (behavior-preserving) {deps: T013, T014} — trivially behavior-preserving: `deep/*` routers unchanged (no mutation); operator-approved

### G3 Hint-budget WARN + canon (REQ-005)
- [x] T016 Add the soft `argument-hint` ≤140-char budget as a validator WARN (not hard-fail) to `validate_document.py` (`.opencode/skills/sk-doc/shared/scripts/validate_document.py`) — severity=warning, exit stays 0 (`801c636d7f`)
- [x] T017 Confirm over-budget hints warn (including `speckit/plan` at 511 chars) and conformant hints stay silent {deps: T016} — 22 over-budget WARN (speckit/plan 508, deep/research 540); conformant silent, exit 0
- [x] T018 [P] Wire the principle "hint summarizes, EXECUTION TARGETS enumerates" into `create-command/SKILL.md` Step 6 and `command_template.md` — Step 6 + `command_template.md` (`801c636d7f`)

### G4 Command ergonomics canon (REQ-006)
- [x] T019 Canonize loader-gating frontmatter + an agent-existence check in `create-command/SKILL.md` Steps 6/9/11 (`.opencode/skills/sk-doc/create-command/SKILL.md`) — Step 9 loader-gating + agent-existence (`71ed27a8e9`)
- [x] T020 [P] Document/deprecate the `User request: $ARGUMENTS` raw-echo idiom (copied into 14 files) in the ergonomics canon — Step 9 argument-echo deprecation + raw-echo WARN, 14 files warn (`71ed27a8e9`)
- [x] T021 [P] Canonize the template self-sufficiency invariant (each variant authors from its template alone) — Step 11 self-sufficiency invariant (`71ed27a8e9`)
- [x] T022 Add the ergonomics WARN checks to `validate_document.py` / `validate-command-references.cjs` and surface them through the `sk-doc-command.cjs` adapter; wire the create-quality-control gate {deps: T019} — WARNs live in the shared validator (create-quality-control gate); deliberately kept OUT of the differential-tested `sk-doc-command.cjs` conformance adapter (authoring-polish vs conformance-gate category separation; avoids a coordinated oracle+fixtures+re-freeze change)
- [x] T023 Record the subaction-dispatch `routing_source` naming sub-item as DEFERRED to phase 004 (field undefined for all families); do not enforce here — recorded in ADR-005, spec §3 Out of Scope

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 Run the full gate set — `generate-command-routers.cjs --check` clean, phase-003 semantic checks clean, `validate_document.py` WARN checks silent on conformant hints, and `validate.sh --strict` on this folder Errors:0 — then reconcile the doc set to the built state {deps: T011, T015, T017, T022} — `--check` `35/35 routers clean`; adapter `[]`; `validate_document.py --type command` exit 0; `validate.sh --strict` Errors:0 (see implementation-summary.md Verification)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T024 complete
- [x] No `[B]` blocked tasks remaining — none
- [x] `generate-command-routers.cjs --check` clean on the conformant tree; staled span fails — `35/35 routers clean, 0 path-drift, 0 shape-drift`; staled path → `PATH-DRIFT`
- [x] OWNED ASSETS / EXECUTION TARGETS tables uniform; generator parses all families — `164b06a571`, `5fbf223ec8`; `validate_document.py --type command` exit 0
- [x] Three command-local mismatches pass the phase-003 checks and the span-diff — G2 no-op; adapter `[]`, path-drift=0
- [x] Deep routers slimmed, snapshot-verified behavior-preserving — A-G2 evidence-satisfied; display externalized, safeguards stay; operator-approved no mutation
- [x] G3/G4 WARN checks wired and silent on conformant input; canon in Steps 6/9/11 + quality-control gate — hint WARN + raw-echo WARN, exit 0 (`801c636d7f`, `71ed27a8e9`)
- [x] `routing_source` sub-item recorded as deferred to phase 004 — ADR-005, T023
- [x] `checklist.md` fully verified; all ADRs status: Accepted — see checklist.md Verification Summary + decision-record.md

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation`
- **Predecessor**: `003-semantic-validation-and-fixtures` (dependency spine 000 → 001 → 003 → 005)

<!-- /ANCHOR:cross-refs -->
