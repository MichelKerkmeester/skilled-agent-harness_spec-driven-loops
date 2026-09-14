---
title: "Goal: Hermes model roster and routing"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/007-hermes-model-registry-and-routing"
    last_updated_at: "2026-09-14T19:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Roster enforcement proven, registry rows landed, guard extended, levels checked live"
    next_safe_action: "Phase 008 playbook and catalog"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-007-hermes-model-registry-and-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Hermes model roster and routing

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every Hermes dispatch from this repo uses a rostered model with a known effort
mapping, and an off-roster id is refused at both dispatch entry points.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to the packet root `goal.md`.

| ID | Decision |
|----|----------|
| P1 | The roster starts with `deepseek-v4.1-flash` and `glm-5.3-flash` through the LLM Gateway custom provider; adding a model is an amendment to the parent's D3 |
| P2 | Profiles land in `sk-prompt/prompt-models` with the same fields the cli-pi profiles carry; the prompt-quality-card sync check must pass |
| P3 | The effort map from the repo's enum to what the gateway accepts is the one phase 002 observed live, pinned as data, not inferred |
| P4 | Enforcement lives in `executor-config.ts` and its byte mirror in `fanout-run.cjs`, and in the skill packet's cheat sheet; no `auto` default |

### Completion criteria

1. `check-prompt-quality-card-sync.sh` passes with the Hermes profiles.
2. A rostered model dispatches through the executor and an off-roster id is refused, runner output recorded for both.
3. Each effort level dispatches without a provider error, or the unsupported levels are documented as refused.

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Phase spec | `spec.md` |
| Closure gate | `acceptance-criteria.md` |

The parent directive in the packet root `goal.md` binds above this file. Evidence:
`../001-deep-research/research/research.md` angle 2 and section 4 row R6; the live effort mapping
from phase 002.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Quality-card sync check passes
- [x] Rostered model dispatches; off-roster id refused
- [x] Effort levels verified live or documented as refused
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Guard extended | Done | `GUARD PASS` with `cli-hermes` on both checks |
| Registry rows | Done | eligibility row in five files (two symlinked copies follow), persona row in the canonical card |
| Roster enforcement | Done | runner rejected `llmgateway/deepseek-v4.1-flash` in 12 ms (`scratch/offroster/runner.log`); rostered dispatch observed in the phase 003 lineage |
| Effort levels | Done | `none`/`max` on GLM, `low`/`ultra` on DeepSeek: all exit 0 `OK` |

### Deviations and findings

| Item | Note |
|------|------|
| No effort map written | The gateway accepts the whole `--reasoning` set for both roster models and the runtime pins them to `max`; P3's "pinned as data" is satisfied by the observed table in the providers reference rather than a code map. |
| `sk-prompt/prompt-models` no longer exists as a folder | The profile surface is the model-eligibility table whose canonical home is `.opencode/agents/prompt-improver.md`; P2 is met there. |
<!-- /ANCHOR:log -->
