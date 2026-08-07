---
title: "Tasks: cli-codex model roster + codex-hook doc alignment"
description: "Task breakdown across the live model×effort verification matrix, the four-model roster docs, the extended effort scale, the CX-002 reframe, the changelog, and the stale codex-surface claim fix."
trigger_phrases: ["cli-codex model roster tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/008-cli-codex-model-roster-and-alignment"
    last_updated_at: "2026-07-14T04:11:03Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete; 20/20 live matrix and doc set landed"
    next_safe_action: "Reindex renamed cli-codex docs after primary reconciles to v4"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: cli-codex model roster + codex-hook doc alignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed (carries source or verification evidence) |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (surface · evidence)`. The live model×effort matrix is complete and captured in the CX-002 playbook.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Enumerate the candidate roster: four models on `fast` with per-model ceilings (`gpt-5.5` ≤ `xhigh`; `gpt-5.6-luna` / `gpt-5.6-terra` ≤ `max`; `gpt-5.6-sol` ≤ `ultra`).
- [x] T002 Dispatch the full twenty-cell model×effort matrix through `codex exec` (ChatGPT OAuth, `service_tier=fast`, read-only, ~5s latency) → `20/20` PASS {deps: T001}. Captured in `manual_testing_playbook/cli_invocation/gpt_5_5_model_lock.md` (CX-002).
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Propagate one coherent roster (default unchanged: `gpt-5.5 medium fast`) across the cli-codex docs; no model is documented before its cell passed T002.

### Roster docs
- [x] T003 SKILL.md — Model Selection roster, flag table, override examples, effort ceilings; version bump `1.5.0.0` → `1.6.0.0` {deps: T002}. Roster table + `-c model_reasoning_effort` ceiling note landed.
- [x] T004 [P] README.md — four-model roster and per-model effort ceilings {deps: T002}. Landed in `README.md`.
- [x] T005 [P] references/cli_reference.md — Supported Models table, effort-value table extended with `max`/`ultra`, model-escalation guidance {deps: T002}.

### Templates + effort scale
- [x] T006 assets/prompt_templates.md — model-override note and extended effort levels {deps: T003}. Landed in `prompt_templates.md`.

### Playbook reframe + changelog
- [x] T007 Reframe CX-002 in place from "model lock" to "default + roster verification"; keep filename `gpt_5_5_model_lock.md` and id `CX-002` {deps: T002}.
- [x] T008 [P] manual_testing_playbook.md — CX-002 index entry + global precondition #6 updated {deps: T007}. Landed in `manual_testing_playbook.md`.
- [x] T009 [P] changelog/v1.6.0.0.md — release note for the roster expansion {deps: T003, T004, T005}. New file `v1.6.0.0.md`.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 [P] Correct the stale "`.codex/` is not present" claim in `sk-code/code-opencode/assets/checklists/agent_authoring.md` to reflect the live `.codex/` mirror (`hooks.json`, `config.toml`, `.codex/agents/*.toml` ↔ `.opencode/agents/` 13↔13).
- [x] T011 Finalize implementation-summary.md; reconcile completion metadata; `validate.sh --strict` Errors: 0 {deps: T003-T010}.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The roster documents four callable models with per-model ceilings, default unchanged. Landed across `SKILL.md` (`1.6.0.0`), `README.md`, `cli_reference.md`.
- [x] Every documented model×level is proven callable live. `20/20` matrix captured in `CX-002`.
- [x] CX-002 reframed in place; filename `gpt_5_5_model_lock.md` and id `CX-002` kept; index resolves.
- [x] The stale `.codex/` claim is corrected in `agent_authoring.md`.
- [x] `validate.sh --strict` green; `checklist.md` verified with evidence.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision Records**: `decision-record.md`
- **Predecessor**: `../007-codex-hook-parity/spec.md`
<!-- /ANCHOR:cross-refs -->
