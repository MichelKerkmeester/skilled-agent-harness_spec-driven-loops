---
title: "Feature Specification: cli-codex model roster + codex-hook doc alignment"
description: "Expand the cli-codex documented GPT model roster from a single gpt-5.5 lock to four fast-tier models with per-model reasoning-effort ceilings, prove all twenty model×effort cells callable live, and fix a stale codex-surface doc claim."
trigger_phrases: ["cli-codex model roster", "codex gpt-5.6 models", "codex effort ceilings", "codex doc alignment"]
importance_tier: important
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/008-cli-codex-model-roster-and-alignment"
    last_updated_at: "2026-07-14T04:11:03Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped four-model roster docs; 20/20 live matrix passed"
    next_safe_action: "Reindex renamed cli-codex docs after primary reconciles to v4"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: cli-codex model roster + codex-hook doc alignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY
Expand the cli-codex skill's documented GPT model roster from a single `gpt-5.5` lock to the full four-model set on the `fast` service tier, each with its own reasoning-effort ceiling, and correct the stale codex-surface doc claims that predated the `.codex/` runtime becoming live. The roster adds `gpt-5.6-luna`, `gpt-5.6-terra`, and `gpt-5.6-sol` alongside the default `gpt-5.5`, and extends the effort scale from `none…xhigh` to add `max` and `ultra`. Every documented model×effort cell was proven callable by a live `codex exec` matrix **before** the roster docs were written, so no phantom model ID reaches the docs.

**Key decisions** (see `decision-record.md`): document the full four-model roster with per-model ceilings while keeping `gpt-5.5 medium` as the backward-compatible skill default (ADR-001); reframe the CX-002 playbook in place rather than renaming, keeping the filename and id to protect the index (ADR-002); verify-then-document — run the 20-cell live matrix first so every documented model×level is proven (ADR-003).

**Load-bearing evidence**: a 20/20 live matrix under `codex exec` (ChatGPT OAuth, `service_tier=fast`, read-only, ~5s latency) and a shipped `1.6.0.0` doc set.
<!-- /ANCHOR:executive-summary -->
<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../007-codex-hook-parity/spec.md` |
| **Successor** | none |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The cli-codex skill documented a single-model contract — "the skill dispatches `gpt-5.5` for every task" — even though the `fast` service tier exposes three additional GPT-5.6 models (`luna`, `terra`, `sol`) that reach reasoning-effort levels (`max`, `ultra`) the docs never named. A caller who needed reasoning past `xhigh` had no documented, verified path. Separately, a `sk-code/code-opencode` authoring checklist still claimed "`.codex/` is not present", a stale assertion left over from before the codex surface became a live runtime mirror (`hooks.json`, `config.toml`, `.codex/agents/*.toml`).
### Purpose
Give cli-codex an accurate, verified model roster: document all four fast-tier models with per-model effort ceilings, prove each documented model×level callable live so no phantom ID ships, keep the default dispatch backward-compatible, and correct the stale codex-surface doc claim so the authoring checklist matches the live filesystem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Expand the cli-codex Model Selection roster to four models (`gpt-5.5`, `gpt-5.6-luna`, `gpt-5.6-terra`, `gpt-5.6-sol`) with per-model reasoning-effort ceilings.
- Extend the documented effort scale to add `max` and `ultra` above `xhigh`.
- Reframe the CX-002 manual-testing scenario from "model lock" to "default + roster verification" in place.
- Live-verify all twenty model×effort cells through `codex exec` before writing the roster docs.
- Fix the stale "`.codex/` is not present" claim in the `code-opencode` agent-authoring checklist.
### Out of Scope
- Changing the default dispatch (`gpt-5.5 medium fast` stays the default).
- Renaming the `gpt_5_5_model_lock.md` playbook file or the `CX-002` id.
- Defining repo-level `[profiles.*]` for models that have no config profile.
- Any change to codex hook adapters or the installer (owned by `../007-codex-hook-parity`).
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `cli-codex/SKILL.md` | Modify | Version 1.6.0.0; Model Selection roster, flag table, override examples, effort ceilings. |
| `cli-codex/README.md` | Modify | Four-model roster and per-model effort ceilings. |
| `cli-codex/references/cli_reference.md` | Modify | Supported Models table, extended effort-value table, escalation guidance. |
| `cli-codex/assets/prompt_templates.md` | Modify | Model-override note and extended effort levels. |
| `cli-codex/manual_testing_playbook/cli_invocation/gpt_5_5_model_lock.md` | Modify | CX-002 reframed to default + roster verification (filename + id kept). |
| `cli-codex/manual_testing_playbook/manual_testing_playbook.md` | Modify | CX-002 index entry + global precondition #6. |
| `cli-codex/changelog/v1.6.0.0.md` | Create | Release note for the roster expansion. |
| `sk-code/code-opencode/assets/checklists/agent_authoring.md` | Modify | Fix the stale "`.codex/` is not present" claim. |
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | The roster documents four callable models | SKILL.md, README.md, and cli_reference.md list `gpt-5.5`, `gpt-5.6-luna`, `gpt-5.6-terra`, `gpt-5.6-sol` on the `fast` tier. |
| REQ-002 | Every documented model×level is proven callable | A live `codex exec` matrix returns correctly for all twenty cells before the roster docs ship. |
| REQ-003 | The default dispatch is unchanged | `gpt-5.5 medium fast` remains the documented default; the change only adds selectable models. |
### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-004 | Per-model effort ceilings are documented | `gpt-5.5` ≤ `xhigh`; `gpt-5.6-luna` / `gpt-5.6-terra` ≤ `max`; `gpt-5.6-sol` ≤ `ultra`. |
| REQ-005 | CX-002 is reframed without breaking the index | Filename `gpt_5_5_model_lock.md` and id `CX-002` are kept; the scenario now verifies default + roster. |
| REQ-006 | The stale codex-surface claim is corrected | The agent-authoring checklist reflects the live `.codex/` mirror (`hooks.json`, `config.toml`, `.codex/agents/*.toml`). |
### P2 - Nice to have
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-007 | Escalation guidance is explicit | Docs state when to escalate from `gpt-5.5` to a GPT-5.6 model and to which effort level. |
| REQ-008 | No out-of-scope drift | The change touches only the eight declared files; codex hook adapters stay untouched. |
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- The cli-codex docs describe a four-model roster with per-model effort ceilings, and the default dispatch is unchanged.
- All twenty model×effort cells are confirmed callable by a live `codex exec` run captured in the playbook.
- The stale "`.codex/` is not present" claim is corrected to match the live filesystem.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | A documented model ID is not actually callable | A phantom model breaks a delegation | Verify-then-document: 20-cell live matrix before the docs are written (ADR-003). |
| Risk | Renaming CX-002 breaks the playbook index | Dangling references | Reframe in place; keep the filename and id (ADR-002). |
| Dependency | `fast` service tier exposes the GPT-5.6 models | Roster is inaccurate if unavailable | Confirmed live via `codex exec` under ChatGPT OAuth. |
<!-- /ANCHOR:risks -->
<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
### Performance
- **NFR-P01**: The live verification is read-only and low-cost; each cell returned in roughly 5 seconds on the `fast` tier, so the full 20-cell matrix is cheap to re-run.
### Reliability
- **NFR-R01**: The default dispatch path is unchanged, so existing delegations keep working exactly as before; only additive selectable models and effort levels are introduced.
### Security
- **NFR-S01**: Verification runs under the existing ChatGPT OAuth auth in `read-only` sandbox; no credential, config, or write surface is touched.
### Portability
- **NFR-PO1**: `gpt-5.6-terra` is documented as callable directly via `-m gpt-5.6-terra` even though it has no config profile, so the roster does not depend on machine-local `[profiles.*]`.
<!-- /ANCHOR:nfr -->
<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES
- **Effort above a model's ceiling**: docs cap each model explicitly (`gpt-5.5` ≤ `xhigh`, luna/terra ≤ `max`, sol ≤ `ultra`), so a caller does not request an unsupported level.
- **Model named with no config profile**: `gpt-5.6-terra` is reachable via `-m` directly; the docs note the absent profile rather than implying it is unusable.
- **`ultra` requested on a non-sol model**: docs state `ultra` is `gpt-5.6-sol` only, avoiding a rejected call.
- **Caller wants the old behavior**: the unchanged `gpt-5.5 medium fast` default preserves it with no action.
<!-- /ANCHOR:edge-cases -->
<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT
Level 3. The complexity is in **verification rigor and cross-doc consistency**, not code — no runtime code changes. The load-bearing work is proving twenty model×effort cells callable live and then propagating one coherent roster across six cli-codex docs plus a changelog plus a stale-claim fix, without drifting the default or breaking the playbook index. Blast radius: documentation only, but the docs steer every cross-AI codex delegation, so an inaccurate model ID would fail live.
<!-- /ANCHOR:complexity -->
<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX
| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | A documented model ID is not callable | H | L | 20/20 live matrix before docs (ADR-003) |
| R-002 | Roster drifts across the six docs | M | M | Single ceiling table mirrored into every doc; cross-check at close |
| R-003 | CX-002 rename breaks the index | M | L | Reframe in place; keep filename + id (ADR-002) |
| R-004 | Default dispatch silently changes | H | L | Default kept `gpt-5.5 medium fast`; additive-only change |
<!-- /ANCHOR:risk-matrix -->
<!-- ANCHOR:user-stories -->
## 11. USER STORIES
### US-001: A caller reaches deeper reasoning (Priority: P0)
**As a** developer delegating to codex, **I want** documented GPT-5.6 models with higher effort ceilings, **so that** I can escalate past `xhigh` on a hard task without guessing a model ID.
### US-002: Every documented model actually works (Priority: P0)
**As a** maintainer, **I want** each roster entry proven callable live before it is documented, **so that** the docs never point at a phantom model.
### US-003: The playbook index stays intact (Priority: P1)
**As a** playbook owner, **I want** CX-002 reframed in place rather than renamed, **so that** the manual-testing index and feature references keep resolving.
<!-- /ANCHOR:user-stories -->
<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS
- None blocking. `gpt-5.6-terra` has no config profile but is confirmed callable directly via `-m`; defining repo-level `[profiles.*]` is a noted out-of-scope follow-up.
<!-- /ANCHOR:questions -->
<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Predecessor**: `../007-codex-hook-parity/spec.md`
<!-- /ANCHOR:related-docs -->
