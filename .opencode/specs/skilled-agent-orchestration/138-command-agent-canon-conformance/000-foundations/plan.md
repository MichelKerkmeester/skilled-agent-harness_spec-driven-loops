---
title: "Implementation Plan: foundations — deep-alignment lane-config authoring + live sk-doc adapter confirmation"
description: "Freeze the immutable BASE + census, author the deep-alignment --lane-config (sk-doc authority × command-docs + agent-docs lanes), resolve it via scoping.cjs, and run a live deep-alignment sk-doc audit that returns real validate_document.py-keyed findings so phases 001-003 can rely on the lane output."
trigger_phrases:
  - "deep-alignment lane config plan"
  - "canon conformance foundations plan"
  - "sk-doc adapter live confirmation plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/000-foundations"
    last_updated_at: "2026-07-14T18:10:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the foundations plan (BASE/census → lane-config → live audit)"
    next_safe_action: "Downstream phase 001 consumes the confirmed lane findings"
    blockers: []
    key_files:
      - "000-foundations/lane-config.json"
      - "000-foundations/alignment/deltas/iter-001.jsonl"
      - ".opencode/skills/system-deep-loop/deep-alignment/"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: foundations — deep-alignment lane-config authoring + live sk-doc adapter confirmation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON lane-config, Node deep-alignment engine (`scoping.cjs`), Python `validate_document.py`, Markdown spec docs |
| **Framework** | `system-deep-loop/deep-alignment` loop; sk-doc `validate_document.py` adapter |
| **Storage** | Checked-in `lane-config.json` + `alignment/**` loop state (state.jsonl, deltas, prompts, iterations, reduced report/registry) |
| **Testing** | `scoping.cjs --lane-config` exit-0 lane resolution; a live deep-alignment sk-doc run; raw delta-stream inspection |
| **Executor (frozen)** | `openai/gpt-5.6-luna-fast --variant xhigh` |

### Overview
Establish the audit foundation for the whole 138 program before any per-lane conformance edits begin. Three moves: (1) freeze an immutable BASE commit and record the command/agent census; (2) author a schema-valid deep-alignment `--lane-config` describing exactly two sk-doc/docs lanes (command-docs, agent-docs) and prove it resolves via `scoping.cjs` with exit 0; (3) run the live deep-alignment sk-doc audit and confirm the adapter returns REAL findings keyed off actual `validate_document.py` results — not the blanket `could-not-validate` failure mode a broken `template_rules.json` path previously produced. Downstream phases 001-003 consume these findings as their verifier contracts.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| `lane-config.json` shape | 2 objects, both `authority: sk-doc` / `artifactClass: docs`; lane 1 = command-docs globs (`create/design/doctor/memory/speckit/*.md` + `prompt-improve.md` + `goal_opencode.md`), lane 2 = agent-docs globs (`.opencode/agents/*.md` + `.claude/agents/*.md`). |
| Live run delta stream | `alignment/deltas/iter-001.jsonl` = 21 rows: 1 iteration row (`findingsCount: 20`, `findingsSummary.P1: 20`) + 20 finding rows, each `sourceTool: validate_document.py`, `validatorExitCode: 0`. |
| Reduced report | `alignment/alignment-report.md` shows `NOT_APPLICABLE` / 0 iterations / 0 findings — reducer gap (documented deviation). |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem, scope, and requirements documented in `spec.md`.
- [x] Success criteria measurable via `scoping.cjs` exit code and the live-run delta stream.
- [x] Dependencies identified: deep-alignment engine + sk-doc `validate_document.py` runnable from repo root.

### Definition of Done
- [x] `lane-config.json` resolves via `scoping.cjs --lane-config` with exit 0 and exactly 2 lanes (REQ-001).
- [x] A live deep-alignment sk-doc run returns ≥1 real `validate_document.py`-keyed finding (REQ-002, satisfied by the raw delta stream; reducer gap documented).
- [x] Immutable BASE commit + census recorded (REQ-003).
- [x] Deep-alignment run artifacts persisted in `alignment/**` (REQ-004).
- [ ] Loop convergence/reduce completes (reduced report populated) — NOT achieved; documented deviation, deferred follow-up.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-foundation-first: pin an immutable BASE, express the audit surface as declarative lane globs, then prove the audit engine is live before any consumer relies on it.

### Key Components
- **`lane-config.json`**: the declarative deep-alignment scope — 2 sk-doc/docs lanes over command docs and agent docs.
- **`scoping.cjs --lane-config`**: the deep-alignment resolver that expands globs to concrete artifacts and validates lane structure (exit 0 == resolvable).
- **sk-doc adapter (`validate_document.py`)**: the deterministic per-document validator whose real results become finding severities.
- **`alignment/**` loop state**: raw iteration/delta stream (source of truth for REQ-002) plus the reduced report/registry (reducer output).

### Data Flow
`lane-config.json` → `scoping.cjs` resolves lanes to artifact lists → the deep-alignment LEAF iteration runs `validate_document.py --type command|agent` per artifact → real validator results are emitted as P0/P1/P2 findings into `alignment/deltas/iter-001.jsonl` → (intended) the reducer rolls deltas into `alignment-report.md` + `deep-alignment-findings-registry.json`. In this run the leaf/delta hop completed; the reduce hop did not (documented deviation).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Freeze BASE + census
- [x] Pin the immutable pre-138 BASE commit (`9c1c523165`, merge commit) so every downstream diff has a stable anchor.
- [x] Record the census: 37 OpenCode command docs; 13 agents × 2 markdown runtimes (`.opencode/agents/` + `.claude/agents/` = 26 `.md`) + 13 `.codex/agents/*.toml`; Codex command prompts 0 (→ 37, built in phase 003).

### Phase 2: Author + resolve lane-config
- [x] Author `lane-config.json` with the two sk-doc/docs lanes (command-docs glob set + agent-docs glob set).
- [x] Resolve via `scoping.cjs --lane-config` and confirm exit 0 with exactly 2 lanes (REQ-001).

### Phase 3: Live audit + real-finding confirmation
- [x] Run the live deep-alignment sk-doc audit with executor `openai/gpt-5.6-luna-fast --variant xhigh`.
- [x] Confirm the delta stream carries real `validate_document.py`-keyed findings (20 P1 `missing_recommended_router_section`) — disproving blanket `could-not-validate` (REQ-002).
- [ ] Confirm the reducer rolled the deltas into the reduced report — NOT achieved; documented as a deviation and deferred.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Lane resolution | `lane-config.json` | `scoping.cjs --lane-config` (exit 0, 2 lanes) |
| Live adapter | sk-doc command-docs lane | deep-alignment run; inspect `alignment/deltas/iter-001.jsonl` for `sourceTool: validate_document.py` findings |
| Spec validation | This child | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` |
| Re-audit clean proof (downstream) | All command files | deterministic `validate_document.py` sweep (exit 0, 0/0) used by phases 001-003 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| deep-alignment engine (`system-deep-loop/deep-alignment`) | Internal tool | Available | No live audit possible; REQ-002 cannot be confirmed. |
| sk-doc `validate_document.py` (`shared/` variant) | Internal validator | Available | Adapter cannot key findings; risk of blanket `could-not-validate`. |
| `scoping.cjs` lane resolver | Internal tool | Available | Lane-config cannot be proven resolvable (REQ-001). |
| Immutable BASE commit `9c1c523165` | Git anchor | Pinned | Downstream diffs lose a stable reference. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the lane-config resolves the wrong surface, or the adapter is later found to emit blanket `could-not-validate` after all.
- **Procedure**: this phase is read-only/audit-only (no command/agent files edited). Roll back by reverting `lane-config.json` and deleting the regenerated `alignment/**` run state from git; re-author the config and re-run the audit. No behavior or runtime surface changes to reverse.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (BASE + census) -> Phase 2 (lane-config + resolve) -> Phase 3 (live audit + confirm)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| BASE + census | None | Lane-config authoring |
| Lane-config + resolve | BASE + census | Live audit |
| Live audit + confirm | Lane-config resolve | Phases 001-003 consuming findings |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| BASE + census | Low | <1 hour |
| Lane-config + resolve | Medium | 1-2 hours |
| Live audit + confirm | Medium | 1-2 hours |
| **Total** | | **2-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment or data migration — audit-only phase.
- [x] Git diff limited to `lane-config.json` + `alignment/**` run state and this child's spec docs.
- [x] BASE commit pinned so a clean revert is trivial.

### Rollback Procedure
1. Revert `lane-config.json` to the prior state (or delete if net-new).
2. Delete the regenerated `alignment/**` loop artifacts from git.
3. Re-author the lane-config and re-run `scoping.cjs` + the deep-alignment audit.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: git revert of the config + run state; nothing else changes.
<!-- /ANCHOR:enhanced-rollback -->
