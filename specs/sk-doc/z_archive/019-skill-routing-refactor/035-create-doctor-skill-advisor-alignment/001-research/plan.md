---
title: "Implementation Plan: Create/Doctor/Skill-Advisor Alignment Research"
description: "Run /deep:research:auto for 20 forced iterations via cli-codex (gpt-5.6-luna, max effort, fast tier), convergence disabled, then synthesize research.md with a prioritized alignment/automation plan."
trigger_phrases:
  - "create doctor skill advisor alignment research plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/035-create-doctor-skill-advisor-alignment/001-research"
    last_updated_at: "2026-07-30T20:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan from the deep-research SKILL.md and YAML workflow contract"
    next_safe_action: "Dispatch iteration 1"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-035-create-doctor-skill-advisor-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Create/Doctor/Skill-Advisor Alignment Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | `/deep:research:auto` (system-deep-loop, `deep-research` mode) |
| **Executor** | `cli-codex`, model `gpt-5.6-luna`, reasoning effort `max`, service tier `fast`, sandbox `workspace-write` |
| **Iteration cap** | 20, forced (`antiConvergence.convergenceMode: "off"` — early convergence disabled) |
| **State** | Externalized JSONL + markdown under `research/`, fresh codex context per iteration |

### Overview
The workflow is executed by hand as the acting runtime (no separate execution engine): init the state packet, then per iteration render the prompt-pack, dispatch a `codex exec` subprocess in its own sandbox to write the iteration file and JSONL delta directly, validate the executor invariants, run the reducer, and repeat until 20 iterations complete regardless of convergence signal. Synthesis then consolidates all 20 iteration files into `research/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Executor mechanics verified against the live YAML/SKILL.md/scripts, not assumed
- [x] `codex` CLI confirmed present

### Definition of Done
- [ ] 20/20 iterations complete, each passing the executor invariants
- [ ] `research/research.md` synthesized with prioritized, evidence-backed recommendations
- [ ] Continuity saved via `generate-context.js`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state autonomous loop (fresh executor context per iteration; continuity via files, not conversation memory).

### Key Components
- **`research/deep-research-config.json`**: immutable init config (topic, executor, anti-convergence, lineage)
- **`research/deep-research-strategy.md`**: mutable charter + reducer-owned machine sections (Next Focus, What Worked/Failed, etc.)
- **`research/deep-research-state.jsonl`**: append-only config + per-iteration delta log
- **`research/iterations/iteration-NNN.md`**: per-iteration findings, written directly by the codex executor
- **`research/prompts/iteration-NNN.md`**: rendered prompt-pack fed to codex via stdin
- **`.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`**: reducer, source of truth for derived state after every iteration

### Data Flow
Read state -> render prompt-pack from current strategy/questions -> dispatch codex (sandboxed, writes its own iteration file + JSONL delta) -> validate artifacts -> reduce state (regenerates strategy machine-sections, dashboard, registry) -> repeat for 20 iterations -> synthesize `research.md` -> save continuity.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Init**: populate config/strategy/dashboard/state-log from templates with this packet's topic, questions, non-goals, stop conditions, and executor settings.
2. **Loop** (x20): render prompt-pack -> dispatch codex -> validate -> reduce -> next.
3. **Synthesis**: consolidate all iteration files into `research/research.md` and emit `resource-map.md`.
4. **Save**: `generate-context.js` continuity save, release loop lock.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Per-iteration executor invariants checked mechanically (iteration file exists and non-empty; JSONL record has `type`, `run`, `status`, `focus`, `newInfoRatio`). One redispatch allowed per iteration on invariant failure, then marked `error` and the loop continues — never silently dropped.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`codex` CLI (confirmed present), Node 22 (`--experimental-strip-types` for the `.ts` executor-config/prompt-pack/executor-audit modules), the `system-deep-loop/runtime` npm install (zod), the `system-spec-kit/scripts` npm install (continuity/description tooling).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research-only packet: no production code changes. If the loop needs to be aborted, the state packet is self-contained under `research/`; deleting or archiving this folder fully reverts the attempt with no effect on any other packet or the shipped runtime.
<!-- /ANCHOR:rollback -->
