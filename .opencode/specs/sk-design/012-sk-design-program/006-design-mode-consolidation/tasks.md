---
title: "Tasks: sk-design mode consolidation"
description: "Executable tasks for baseline capture, foundations and audit consolidation, four-mode routing regeneration, and strict verification."
trigger_phrases:
  - "sk-design consolidation tasks"
  - "design subworkflow migration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-27T04:33:25.494Z"
    last_updated_by: "claude"
    recent_action: "Marked tasks per verified gate evidence; struck tasks obsoleted by ADR-002"
    next_safe_action: "Orchestrator runs validate.sh --strict, styles SHA-256 equality, and the design benchmark suite"
    blockers: []
    key_files: []
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Tasks: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`
<!-- /ANCHOR:notation -->

### Milestone Reference

| Milestone | Tasks | Status |
|-----------|-------|--------|
| M1 Baseline | T001-T005 | Done (partial) |
| M2 Foundations | T006-T009 | Superseded by ADR-002 — foundations retired, not relocated |
| M3 Audit | T010-T013 | Superseded by ADR-002 — audit retired, not relocated |
| M4 Four-mode hub | T014-T018 | Done |
| M5 Verification | T019-T025 | Partial — styles/benchmark/strict validation NOT run |

### AI Execution Protocol

### Pre-Task Checklist

- [x] Read the canonical research synthesis and approved override.
- [x] Create the Level 3 packet before skill-tree edits.
- [x] Capture baselines (foundations/audit file counts, styles SHA-256, command/corpus/checker pass counts) before any change.

### Task Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Baseline first; foundations and audit move sequentially; regenerate only after authored topology is final. |
| TASK-SCOPE | Modify only packet-listed consumers; classify historical references before changing them. |
| TASK-EVIDENCE | Record exact commands, counts, or paths for every completed task. |
| TASK-FROZEN | Do not edit any path beneath `styles/`; verify all tracked bytes before and after. |

#### Status Reporting Format

Record each task as `T### STATUS=<pending|active|done|blocked> EVIDENCE=<file:line|command|count>`.

### Blocked Task Protocol

Mark blocked work `[B]`, record the exact failing command and next safe action, and halt dependent tasks. Do not weaken assertions or hand-author generated metadata to bypass a gate.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Baseline and Inventory [Milestone M1]

- [ ] T001 Capture scoped Git status and current six-mode registry bytes. — no standalone git-status/registry-bytes artifact evidenced; leave pending.
- [x] T002 [P] Capture package, command, corpus, benchmark, and compiled-routing baselines. — DONE: `interface-command-contract.test.mjs` 8/0, `design-command-surface-check.test.mjs` 7/0, `design-command-surface-check.mjs` `commands=5 aliases=15`, `parent-skill-check.cjs` OK/0-warnings, `scratch/benchmark-before/report.json`, `scratch/routing.sha256.before`. Fingerprint baseline N/A — those scripts were later deleted as dead code (ADR-002).
- [x] T003 [P] Inventory all live, generated, and historical old-path consumers. — DONE: live `design-audit/`/`design-foundations/` reference count captured (152 baseline).
- [ ] T004 Capture exact foundations/audit file accounting and target 69-leaf projection. — PARTIAL/N-A: file counts captured (`scratch/foundations-files.before.txt` 48, `scratch/audit-files.before.txt` 70), but the 69-leaf interface projection is obsolete — scope reversed to retirement, not relocation (ADR-002).
- [x] T005 Capture tracked styles path count and SHA-256 manifest. — DONE: `scratch/styles.sha256.before`, 7,812 tracked paths.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Foundations Consolidation [Milestone M2] — Superseded by ADR-002

- [ ] T006 ~~Add interface-owned permanent foundations subworkflow doctrine and routing.~~ N/A — `commandSubworkflows` concept deleted entirely; no subworkflow doctrine was added.
- [ ] T007 ~~Relocate foundations leaves, README, and changelog; transform `SKILL.md` to `contract.md`.~~ N/A as written — actual outcome: foundations flattened into `design-interface/`; `contract.md`/`README.md`/`changelog/` were deleted, not transformed/preserved.
- [ ] T008 ~~Repoint foundations command assets, scripts, corpus, and live consumers.~~ N/A — `/interface:foundations` command retired entirely, not repointed.
- [ ] T009 ~~Run foundations command, corpus, and checker gates.~~ N/A — no dedicated foundations command gate exists post-retirement; foundations-derived content is covered by the interface+motion corpus (70/0, see gate table).

### Audit Consolidation [Milestone M3] — Superseded by ADR-002

- [ ] T010 ~~Add interface-owned permanent audit subworkflow doctrine and routing.~~ N/A — audit retired entirely; commandSubworkflows deleted.
- [ ] T011 ~~Relocate audit leaves, README, and changelog; transform `SKILL.md` to `contract.md`.~~ N/A — audit surface deleted outright (70 files / 6,202 lines), not relocated.
- [ ] T012 ~~Repoint audit reports, corpus, fingerprints, Bash verifiers, command assets, and live consumers.~~ N/A — two dead AI-fingerprint parity scripts (915 lines) deleted rather than repointed.
- [ ] T013 ~~Run audit command, corpus, fingerprint, and checker gates.~~ N/A — audit command retired; 7 binary anti-slop checks preserved in `interface-preflight-card.md` section 11 instead of a standalone audit gate.

### Four-Mode Hub and Generation [Milestone M4]

- [x] T014 Remove foundations and audit mode rows and nested identity metadata. {deps: T013} — DONE: final registry verified at 4 modes (`interface`, `motion`, `md-generator`, `design-mcp-open-design`); `design-command-surface-check.mjs` final `commands=3 aliases=9 invalid=0 drift=0`.
- [x] T015 Update hub/router/command metadata and canonical path/default prose. {deps: T014} — DONE: `commandSubworkflows`, `extensions["command-subworkflows"]`, `commandSubworkflowSignals`, `canonicalBySubworkflow`, `commandSubworkflowBundles`, `transformVerbRouting.excludedAliases` all deleted; pre-existing dangling `command-metadata.json` reference to a nonexistent `design-audit/references/transform-remediation.md` fixed.
- [ ] T016 ~~Verify exactly 112 subordinate relocations, two README moves, two contract transformations, and two changelogs.~~ N/A — superseded accounting model; actual outcome was deletion (audit) + flattening-without-preservation (foundations), not a 112/2/2/2 relocation count (ADR-002).
- [ ] T017 Regenerate the 69-leaf manifest, advisor metadata, compiled routing fixtures, and activation metadata. {deps: T016} — the 69-leaf figure is obsolete (retired plan); regeneration of leaf/advisor/compiled-routing metadata against the retirement outcome is not evidenced here.
- [x] T018 Prove no live old-path consumer or extra registry identity remains. {deps: T017} — DONE: live `design-audit/`/`design-foundations/` reference grep: 152 (baseline) -> 0 (final).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Final Verification and Reconciliation [Milestone M5]

- [ ] T019 Compare pre/post styles manifests and tracked path counts. {deps: T018} — NOT run; orchestrator runs this after this reconciliation pass.
- [ ] T020 Run final package, command, corpus, checker, and benchmark gates. {deps: T019} — PARTIAL: command/corpus/checker gates pass (see gate table in `implementation-summary.md`); design benchmark suite NOT run.
- [ ] T021 Run compiled route sync/drift and parent-hub checks. {deps: T020} — PARTIAL: `parent-skill-check.cjs` OK/0-warnings confirmed; compiled-route sync/drift NOT evidenced here.
- [ ] T022 Review scoped diff, comment hygiene, file permissions, and relocation accounting. {deps: T021} — the relocation-accounting clause is obsolete (ADR-002); the rest is not evidenced in this pass.
- [x] T023 Reconcile spec, plan, tasks, checklist, decisions, and implementation summary. {deps: T022} — DONE 2026-07-27: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (ADR-002 added), `implementation-summary.md`, and `handover.md` rewritten to the ADR-002 retirement outcome and the verified gate-evidence table.
- [ ] T024 Generate description/graph metadata and attempt memory indexing. {deps: T023} — out of scope for this documentation-accuracy pass; `description.json`/`graph-metadata.json` untouched.
- [ ] T025 Run strict SpecKit validation, completion analysis, and active-goal verification. {deps: T024} — NOT run; orchestrator runs `validate.sh --strict` after this pass.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All applicable tasks are marked `[x]` with evidence; obsolete relocation tasks are marked N/A under ADR-002.
- [ ] No blocked P0 or P1 task remains.
- [x] Registry invariant passes: 4 modes verified (`interface`, `motion`, `md-generator`, `design-mcp-open-design`).
- [ ] ~~Both permanent commands retain complete behavior from interface-owned paths.~~ N/A — both commands are retired (ADR-002); three remaining commands retain complete behavior instead.
- [ ] All automated and strict documentation gates pass. — command/corpus/checker gates pass; design benchmark, styles SHA-256 equality, and `validate.sh --strict` NOT run.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Architecture**: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
