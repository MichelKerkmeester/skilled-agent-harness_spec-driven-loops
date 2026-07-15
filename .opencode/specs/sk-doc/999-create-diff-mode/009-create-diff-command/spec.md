---
title: "Feature Specification: /create:diff slash command for the create-diff mode"
description: "Build the missing /create:diff slash command so the create-diff mode is invocable like its 10 sibling /create:* commands, across both the OpenCode and Codex runtimes: a thin router plus presentation contract and auto/confirm workflow YAML that drive the existing create_diff.py engine and validate_report.py — the command never re-implements diffing."
trigger_phrases:
  - "create diff command"
  - "/create:diff slash command"
  - "create-diff command router"
  - "diff command auto confirm modes"
importance_tier: "important"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/009-create-diff-command"
    last_updated_at: "2026-07-15T20:10:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the Level 2 planning docs for the /create:diff command child"
    next_safe_action: "Author the command router, presentation contract, and auto/confirm workflow YAML assets"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-command-009"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should :confirm ask the four startup questions every run, or offer a fast-path when the operator passes explicit arguments?"
    answered_questions:
      - "create-diff is engine-backed but still follows the full 10-sibling command pattern (operator-selected)."
      - "The command is recorded as its own child (009) under 999-create-diff-mode, successor to 008."
---
# Feature Specification: /create:diff slash command for the create-diff mode

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress — planned, not yet built |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../008-fidelity-safety-a11y-hardening/spec.md` |
| **Successor** | None; new terminal child (adds the `/create:diff` command) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `create-diff` mode ships a working engine (`create_diff.py`) and validator (`validate_report.py`), is registered in the sk-doc hub, and routes through the advisor — but it is the only one of the eleven sk-doc `create-*` workflow packets with no dedicated slash command. Its `mode-registry.json` `command` field is `null`, there is no `.opencode/commands/create/diff.md` router, no presentation/YAML assets, and no Codex prompt stub. As a result the mode is reachable only by advisor aliases or by invoking the script directly, so it is inconsistent with the ten sibling commands (`/create:agent`, `/create:skill`, `/create:readme`, `/create:changelog`, `/create:command`, `/create:feature-catalog`, `/create:manual-testing-playbook`, `/create:benchmark`, `/create:flowchart`, `/create:skill-parent`) that every operator already knows how to reach.

### Purpose
Add the missing `/create:diff` command so the before/after document review workflow is invocable as a first-class slash command in both the OpenCode and Codex runtimes, following the exact router + presentation + auto/confirm YAML pattern the other ten `/create:*` commands use — while delegating all comparison, extraction, and rendering to the existing engine rather than re-implementing any of it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A thin command router `diff.md` modeled on the sibling `flowchart.md` router: frontmatter (`description`, `argument-hint`, `allowed-tools`) plus the six sibling sections (ROUTER CONTRACT / OWNED ASSETS / MODE ROUTING / EXECUTION TARGETS / PRESENTATION BOUNDARY / WORKFLOW SUMMARY), ending with `User request: $ARGUMENTS`.
- A presentation contract (`create_diff_presentation.txt`) owning Phase 0 packet-resource self-check, the startup questions, setup/status dashboards, and the completion display.
- Two workflow YAMLs — `create_diff_auto.yaml` (autonomous, no approval gates) and `create_diff_confirm.yaml` (interactive, checkpointed, the default when no mode is given) — that resolve inputs, drive `create_diff.py` (`compare` for an automatic baseline, `compare-pair` for an explicit before/after pair), then run `validate_report.py` on the output before presenting.
- The two command modes `:auto` and `:confirm`, matching the sibling mode grammar.
- An auto-generated Codex prompt stub (`.codex/prompts/create-diff.md`) produced by the existing sync tool from the OpenCode command.
- Wiring the create-diff mode's `command` field in `mode-registry.json` from `null` to `"/create:diff"`.

### Out of Scope
- Any change to the diff engine, extractor, snapshot store, renderer, or `validate_report.py` — the command drives them unchanged (their behavior is owned by phases 002–008).
- New diff formats, OCR, side-by-side redesign, or fidelity-tier changes.
- Hand-authoring the Codex stub — it is generated, never edited in place.
- Editing sibling 008 or the parent `spec.md` phase cross-links (handled separately by the operator).
- Advisor scoring/alias changes beyond setting the `command` field (the mode stays metadata-routed).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/create/diff.md` | Create | Thin router: frontmatter (`description`, `argument-hint`, `allowed-tools: Read, Write, Edit, Bash, Glob, Grep`) + ROUTER CONTRACT / OWNED ASSETS / MODE ROUTING / EXECUTION TARGETS / PRESENTATION BOUNDARY / WORKFLOW SUMMARY, ending `User request: $ARGUMENTS`. Modeled on `flowchart.md`. |
| `.opencode/commands/create/assets/create_diff_presentation.txt` | Create | Presentation contract: Phase 0 packet-resource self-check, startup questions, setup/status dashboards, completion display. |
| `.opencode/commands/create/assets/create_diff_auto.yaml` | Create | Autonomous workflow: resolve inputs → `create_diff.py compare`/`compare-pair` → `validate_report.py` → present. No approval gates. |
| `.opencode/commands/create/assets/create_diff_confirm.yaml` | Create | Interactive checkpointed workflow (default when no mode is given); same steps as `:auto` with operator checkpoints. |
| `.codex/prompts/create-diff.md` | Create (generated) | Codex runtime stub, AUTO-GENERATED by `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` from the OpenCode command — not hand-authored. |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | Set the create-diff mode's `command` field from `null` to `"/create:diff"`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The command loads and routes | `/create:diff` parses its frontmatter and dispatches to a workflow; `:auto` resolves `create_diff_auto.yaml` and `:confirm` (or an omitted mode) resolves `create_diff_confirm.yaml`; exactly one workflow is selected per invocation. |
| REQ-002 | The router references only assets that exist | Every path named in OWNED ASSETS / EXECUTION TARGETS (`create_diff_presentation.txt`, both YAMLs) is present on disk; a missing asset makes the router stop and report the path, not guess. |
| REQ-003 | The engine is never bypassed | The workflow drives `create_diff.py` (`compare`/`compare-pair`) and `validate_report.py`; it never re-implements diffing, extraction, snapshotting, or rendering, and never mutates the source document. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `allowed-tools` is a subset of the create-diff mode surface, with no `Task` | The router's `allowed-tools` is exactly `Read, Write, Edit, Bash, Glob, Grep` — a subset of the mode's `toolSurface.allowed`; `Task` is absent (matching `toolSurface.forbidden`). |
| REQ-005 | The `mode-registry.json` `command` field is wired | The create-diff mode's `command` reads `"/create:diff"` (was `null`); the JSON stays valid and `parent-skill-check.cjs` accepts it. |
| REQ-006 | The Codex stub is generated, not hand-edited | `.codex/prompts/create-diff.md` is produced by `sync-prompts.cjs` from the OpenCode command and is re-generatable idempotently; it carries no hand-authored drift. |
| REQ-007 | The presentation contract carries the full user surface | `create_diff_presentation.txt` holds the Phase 0 self-check, the four startup questions (which document; automatic-baseline vs explicit before/after pair; report output path; unified vs side-by-side view), setup/status dashboards, and a completion display showing the report path, change counts, fidelity tier, and validator result. |
| REQ-008 | Both modes follow the full sibling pattern | The command ships router + `presentation.txt` + `auto.yaml` + `confirm.yaml`, consistent with all ten existing `/create:*` commands, even though create-diff is engine-backed (operator-selected full pattern). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/create:diff`, `/create:diff :auto`, and `/create:diff :confirm` each resolve exactly one workflow YAML and reference only assets that exist.
- **SC-002**: The command produces a validated report by driving the existing engine end to end (`create_diff.py` → `validate_report.py`), with the source document byte-unchanged and no diffing logic re-implemented in the command layer.
- **SC-003**: `mode-registry.json` records `"/create:diff"`, the Codex stub is generated from the OpenCode command, and `validate.sh --recursive --strict` on the 999 parent reports 0 content/structure errors for this child (the only permitted residue being the not-yet-generated `description.json`/`graph-metadata.json`, produced by the operator afterward).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Drift between the OpenCode command and the generated Codex stub | Med | Never hand-edit the stub; regenerate via `sync-prompts.cjs` and verify idempotency after any router change. |
| Risk | The command layer re-implements diffing instead of calling the engine | High | Freeze REQ-003 as a P0 invariant; the YAML only shells out to `create_diff.py`/`validate_report.py`. |
| Risk | `allowed-tools` widens the mode surface (e.g. adds `Task`) | Med | Assert the router's tools are a subset of `toolSurface.allowed`; `parent-skill-check.cjs` gates it. |
| Dependency | `create_diff.py` + `validate_report.py` (phases 002–008) | Low | Already shipped and hardened; consumed read-only as a CLI. |
| Dependency | `sync-prompts.cjs` (Codex prompt generation) | Low | Existing tool; used unchanged to emit the stub. |
| Dependency | `mode-registry.json` + `parent-skill-check.cjs` (hub registration) | Low | Only the `command` field changes; the mode stays metadata-routed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The command adds only routing + presentation overhead; comparison cost stays entirely in the engine and is unchanged.

### Security
- **NFR-S01**: The command introduces no new network, upload, or telemetry surface; all processing stays local, consistent with the create-diff contract.
- **NFR-S02**: `allowed-tools` grants no capability beyond the mode surface, and `Task` (sub-agent dispatch) is excluded.

### Reliability
- **NFR-R01**: A missing owned asset makes the router stop and report the exact path rather than proceed on a guess.
- **NFR-R02**: The Codex stub is deterministic — regenerating it from the same OpenCode command yields the same file.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No mode token in `$ARGUMENTS`: defaults to `:confirm` (interactive), matching the sibling default.
- Explicit pair vs automatic baseline: the workflow selects `compare-pair` when a before/after pair is supplied and `compare` when a stored baseline exists; the startup questions disambiguate.
- Unknown or unsupported document format: the engine's own capability/exit-code contract governs; the command surfaces the fidelity tier and any warning rather than masking it.

### Error Scenarios
- Missing baseline for automatic flow: the workflow offers the explicit-pair fallback rather than fabricating a diff.
- Validator failure on the generated report: the completion display reports the failure explicitly; the command does not claim a clean, self-contained report.
- Missing owned asset (`presentation.txt` or a YAML): the router stops and reports the path.

### State Transitions
- Partial run: the command is additive and stateless beyond the engine's own snapshot store; an interrupted run leaves the source document and the store unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 1 router + 3 assets + 1 generated stub + 1 registry field; ~1.5–2k lines of authored presentation/YAML. |
| Risk | 12/25 | Low novel-logic risk (frozen 10-sibling template, engine already shipped); main hazards are stub drift and accidental engine re-implementation, both gated. |
| Research | 5/20 | Pattern is fully established by the ten sibling commands; no new investigation. |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `:confirm` ask all four startup questions on every run, or offer a fast-path when the operator already passes explicit before/after arguments?
- Should the completion display's change summary mirror the engine's `--json` fields exactly, or present a reduced operator-facing subset?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md` (phase parent for the create-diff engine and mode).
- **Predecessor**: `../008-fidelity-safety-a11y-hardening/spec.md` (the hardened engine this command drives).
- **Sibling router pattern**: `.opencode/commands/create/flowchart.md` (the modeled-on router).
- **Mode packet**: `.opencode/skills/sk-doc/create-diff/SKILL.md` (§3 workflow the command wraps).
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
