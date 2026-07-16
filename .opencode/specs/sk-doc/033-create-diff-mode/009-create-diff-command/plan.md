---
title: "Implementation Plan: /create:diff slash command for the create-diff mode"
description: "Build the /create:diff command as a thin router plus presentation contract and auto/confirm workflow YAML that drive the existing create_diff.py engine and validate_report.py, generate the Codex stub via sync-prompts.cjs, and wire the mode-registry command field — following the frozen 10-sibling /create:* pattern."
trigger_phrases:
  - "create diff command plan"
  - "diff command router plan"
  - "create-diff command workflow yaml"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/009-create-diff-command"
    last_updated_at: "2026-07-15T19:16:49Z"
    last_updated_by: "claude"
    recent_action: "Applied create-command conformance fix; reconciled 009 to Complete"
    next_safe_action: "Commit the conformance fix + finalized 009 and push to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-command-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: /create:diff slash command for the create-diff mode

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown router + `.txt` presentation contract + YAML workflows; the engine is Python 3 (unchanged) |
| **Framework** | None — the sk-doc `/create:*` router/presentation/workflow convention |
| **Storage** | The engine's local content-addressed snapshot store (unchanged; not touched by the command) |
| **Testing** | Router/asset existence + `allowed-tools` subset checks, `parent-skill-check.cjs`, Codex-stub idempotency, `validate.sh --recursive --strict` |

### Overview
Author the four OpenCode command artifacts (router, presentation contract, two workflow YAMLs) by copying the shape of the sibling `flowchart` command and retargeting every step at the create-diff engine, then generate the Codex stub and flip the registry `command` field. The command is a thin orchestration layer: it resolves the operator's inputs, shells out to `create_diff.py` and `validate_report.py`, and presents the result. No diffing, extraction, snapshotting, or rendering is re-implemented — that is the load-bearing invariant.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The sibling pattern is confirmed by reading `flowchart.md` + its three assets
- [ ] The create-diff engine CLI surface (`compare`, `compare-pair`, exit codes, `validate_report.py`) is confirmed from SKILL.md §3
- [ ] Operator selection recorded: full sibling pattern despite the mode being engine-backed

### Definition of Done
- [ ] Router + presentation + both YAMLs authored; every owned asset resolves
- [ ] `allowed-tools` is a subset of the mode surface with no `Task`
- [ ] `mode-registry.json` `command` = `"/create:diff"`; JSON valid; `parent-skill-check.cjs` clean
- [ ] Codex stub generated (not hand-edited) and idempotent
- [ ] `validate.sh --recursive --strict` on 033 = 0 content/structure errors for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin router → presentation contract → one of two workflow YAMLs → external engine CLI. Routing (mode selection, asset resolution) is separated from presentation (user-visible wording) is separated from workflow (ordered engine steps), exactly as the ten sibling commands do.

### Key Components
- **`diff.md` (router)**: frontmatter + ROUTER CONTRACT / OWNED ASSETS / MODE ROUTING / EXECUTION TARGETS / PRESENTATION BOUNDARY / WORKFLOW SUMMARY; selects the YAML and mode only.
- **`create_diff_presentation.txt` (presentation)**: Phase 0 self-check, startup questions, setup/status dashboards, completion display.
- **`create_diff_auto.yaml` (workflow)**: autonomous input-resolve → engine → validator → present; no approval gates.
- **`create_diff_confirm.yaml` (workflow)**: the same ordered steps with operator checkpoints; the default when no mode is given.
- **`.codex/prompts/create-diff.md` (generated stub)**: emitted by `sync-prompts.cjs`.
- **`mode-registry.json` (registration)**: `command` field flipped to `"/create:diff"`.

### Data Flow
`$ARGUMENTS` → router resolves mode + asset paths → presentation gathers the four setup answers → workflow runs `create_diff.py compare`/`compare-pair` (source read-only) → `validate_report.py <report>` → presentation renders the completion display (report path, change counts, fidelity tier, validator result). Content stays local end to end.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/create/diff.md` (router) | Does not exist | create: thin router modeled on `flowchart.md` | read: six sections present; `allowed-tools` subset; ends `User request: $ARGUMENTS` |
| `create_diff_presentation.txt` (presentation) | Does not exist | create: Phase 0 + startup questions + dashboards + completion display | grep: four startup questions + completion fields present |
| `create_diff_auto.yaml` (workflow) | Does not exist | create: autonomous engine-driving steps, no gates | read: resolves input → `create_diff.py` → `validate_report.py` → present |
| `create_diff_confirm.yaml` (workflow) | Does not exist | create: same steps, checkpointed; default mode | read: checkpoint steps present; identical engine calls |
| `.codex/prompts/create-diff.md` (generated) | Does not exist | generate via `sync-prompts.cjs`; never hand-edit | run: regenerate is idempotent; no manual drift |
| `mode-registry.json` create-diff `command` (registration) | `null` | update: `"/create:diff"` | grep: field set; `parent-skill-check.cjs` clean |
| `create_diff.py` / `validate_report.py` (engine, consumed) | Ships the comparison + validator | none — driven read-only as a CLI | invariant: command never re-implements diffing; source byte-unchanged |

Required inventories:
- Sibling pattern reference: `.opencode/commands/create/flowchart.md` + `assets/create_flowchart_{presentation.txt,auto.yaml,confirm.yaml}`.
- Engine CLI contract: `create-diff/SKILL.md` §3 (`compare`, `compare-pair`, `--report`, `--view`, `--json`; exit codes `0/2/3/4/5`) and `validate_report.py`.
- Registration consumers: `mode-registry.json`, `hub-router.json`, `parent-skill-check.cjs`.
- Invariant (no bypass): a produced report MUST come from `create_diff.py` + `validate_report.py`, never from command-layer diffing.
- Invariant (tool surface): the router's `allowed-tools` MUST be a subset of `toolSurface.allowed` and MUST NOT include `Task`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Router + presentation
- [ ] Author `diff.md` router modeled on `flowchart.md` (REQ-001, REQ-004)
- [ ] Author `create_diff_presentation.txt`: Phase 0 self-check, four startup questions, dashboards, completion display (REQ-007)

### Phase 2: Workflows + registration
- [ ] Author `create_diff_auto.yaml` (autonomous, engine-driving, no gates) (REQ-001, REQ-003)
- [ ] Author `create_diff_confirm.yaml` (checkpointed default) (REQ-001, REQ-003)
- [ ] Set `mode-registry.json` create-diff `command` = `"/create:diff"` (REQ-005)

### Phase 3: Codex stub + verification
- [ ] Generate `.codex/prompts/create-diff.md` via `sync-prompts.cjs`; confirm idempotency (REQ-006)
- [ ] Confirm asset existence, `allowed-tools` subset/no-`Task`, and engine-never-bypassed (REQ-002, REQ-003, REQ-004)
- [ ] Run `parent-skill-check.cjs` + `validate.sh --recursive --strict` on 033
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Router has all six sections + frontmatter; owned assets exist | Read + Glob |
| Contract | `allowed-tools` subset of mode surface; no `Task`; registry `command` set | Grep + `parent-skill-check.cjs` |
| Behavioral | `:auto`/`:confirm`/omitted-mode each resolve exactly one YAML; engine calls present | Read of router + YAML |
| Idempotency | Codex stub regenerates identically from the OpenCode command | `sync-prompts.cjs` |
| Spec | Child + parent recursive strict validation clean (content/structure) | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `create_diff.py` + `validate_report.py` (phases 002–008) | Internal | Green (shipped, hardened) | None — consumed read-only |
| `sync-prompts.cjs` (Codex stub generation) | Internal | Green | Codex stub cannot be generated |
| `mode-registry.json` + `parent-skill-check.cjs` | Internal | Green | Registration cannot be validated |
| Sibling `flowchart` command pattern | Internal | Green | Template shape unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the command mis-routes, references a missing asset, or the registry/stub change breaks `parent-skill-check.cjs`.
- **Procedure**: the change is additive — delete the four new command artifacts and the generated Codex stub, and revert the single `mode-registry.json` `command` field to `null`. No engine, data, or deployed consumer is affected; nothing is committed until operator go.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Router + presentation) ──► Phase 3 (Codex stub + verification)
Phase 2 (Workflows + registration) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Router + presentation | None | Codex stub + verification |
| Workflows + registration | Router (asset names) | Codex stub + verification |
| Codex stub + verification | Router, Workflows, Registration | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Router + presentation | Med | ~1-2 hours |
| Workflows + registration | Med | ~1-2 hours |
| Codex stub + verification | Low | ~0.5-1 hour |
| **Total** | | **~2.5-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Every owned asset resolves before the router is considered done
- [ ] `allowed-tools` verified as a subset with no `Task`
- [ ] Codex stub is generated, not hand-edited, and idempotent
- [ ] No concurrent-session files staged

### Rollback Procedure
1. Delete `diff.md` and the three `create_diff_*` assets
2. Delete the generated `.codex/prompts/create-diff.md`
3. Revert the `mode-registry.json` create-diff `command` field to `null`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — additive command artifacts + one registry field only; no persisted state schema change
<!-- /ANCHOR:enhanced-rollback -->
