# Research Report: mk-deep-loop-guard Hardening for Repeat-Dispatch Detection

**Spec Folder:** `016-mk-deep-loop-guard-hardening`
**Lineage:** glm-max (executor: cli-opencode model=zai-coding-plan/glm-5.2)
**Session:** `fanout-glm-max-1782925116331-6rt4hp`
**Iterations:** 2 (maxIterations reached)
**Date:** 2026-07-01

---

## 1. Executive Summary

The existing `mk-deep-loop-guard.js` plugin (109 lines) mechanically detects single-dispatch mode-mismatch via `mode-registry.json`. This research investigates extending it to detect repeated/loop-like orchestrate-to-command-owned-loop-executor dispatches (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`), while allowing exactly one legitimate bounded hand-off.

**Key findings:**
1. The `@opencode-ai/plugin` SDK exposes `sessionID` and `callID` on every `tool.execute.before` call, and the codebase already has two proven session-state patterns (in-process closure `Map`, external JSON file).
2. `subagent_type` is always `"general"` for all custom agents — the guard must parse agent identity from the prompt.
3. The "exactly one bounded hand-off" contract is stated in 4 independent documents, but GPT-5.5 inconsistently self-enforces it (refused `deep-research` direct dispatch, allowed `deep-review`).
4. Two concrete design options are proposed: **Option A** (in-process counter, minimal) and **Option B** (external state + iteration-aware counting, defense-in-depth).

---

## 2. Research Questions Answered

### Q1: SDK Session-Scoped State Capabilities

**Answer: YES — two proven mechanisms.**

The `tool.execute.before` hook signature (`@opencode-ai/plugin/dist/index.d.ts:235-241`) provides `input.sessionID` and `input.callID` on every call. Three sibling plugins already use in-process closure-scoped `Map<sessionID, ...>`:
- `mk-spec-memory.js:259-271` — `continuityCache: new Map()`
- `mk-code-graph.js:100,164` — `transportCache = new Map()`
- `mk-skill-advisor.js:420-422` — `advisorCache: new Map()`

One plugin (`mk-goal.js:24,647-649`) uses external file-based state: `{hex(sessionID)}.json` in `.opencode/skills/.goal-state/`.

**In-process closure state is the primary mechanism** for repeat detection (the pattern manifests within a single session/process). External file state is defense-in-depth for cross-process edge cases (resume/fork).

### Q2: Mechanical Definition of 'Loop-Like'

**Answer: Same loop-executor agent identity dispatched ≥3 times per session, identified by prompt parsing.**

`subagent_type` is always `"general"` (`orchestrate.md:73-81,189`). The guard must parse the prompt for agent identity via multi-pattern fallback:
1. `Agent: @deep-research` / `Agent: @deep-review` patterns
2. `Deep Route: mode=research` patterns
3. Existing `mode=([a-z0-9-]+)` regex mapped through `mode-registry.json`

**Threshold: N≥3 per session per executor type = block; N=2 = warn.** This accommodates 1 hand-off + 1 legitimate retry per `orchestrate.md:566-569` §6 RETRY protocol.

### Q3: Dispatch Path Grounding

**Answer: The "exactly one bounded hand-off" contract is stated in 4 independent documents.**

1. `cli-opencode/SKILL.md:293` — orchestrate is "caller/coordinator only ... exactly one bounded hand-off dispatch to the resolved leaf"
2. `agent_delegation.md:227-230` — both `deep-research` and `deep-review` are "**Command-only.** Direct dispatch forbidden"
3. `orchestrate.md:75,79` — Priority table, both LEAF at `subagent_type: "general"`
4. `deep-review.md:283` — "Caller/coordinator only; this agent must not call it back"

**Critical limitation:** The guard cannot reliably distinguish command-driven loop iterations (legitimate `/deep:research` YAML dispatching `@deep-research` N times) from orchestrate-driven re-dispatches (illegitimate loop re-implementation) from args alone. An iteration-state heuristic (`Iteration: N of M`, `STATE SUMMARY` markers) is the practical discriminator.

### Q4: Phase 012 Enforcement Inconsistency Evidence

**Answer: GPT-5.5 inconsistently self-enforces the Command-only convention.**

`benchmark-results.md:47,50,60`:
- GPT-5.5-fast **refused** direct Task-dispatch to `deep-research` (correctly citing Command-only)
- GPT-5.5-fast **allowed** identical direct Task-dispatch to `deep-review` (incorrectly)
- Both are documented identically as Command-only in `agent_delegation.md:227-228`

Phase 012 §7 confirms zero mode-mismatch failures (the existing guard handles those) — the remaining gap is enforcement inconsistency, which mechanical detection closes.

---

## 3. Design Options

### Option A: Session-Scoped In-Process Dispatch Counter

**Mechanism:** Add a closure-scoped `Map<sessionID, Map<executorType, count>>` to the plugin factory. Parse each `task` dispatch prompt for loop-executor identity. Increment per-session-per-executor count. At N≥3, emit WARN (default) or throw (when `MK_DEEP_LOOP_GUARD_REJECT=1`).

**Code size:** ~40 lines added to the existing 109-line plugin.

**False-positive mitigation:** Skip counting when the prompt contains iteration-state markers (`Iteration: N of M`, `STATE SUMMARY`) — these indicate command-driven loop iterations, not orchestrate hand-offs.

| Dimension | Assessment |
|-----------|------------|
| **Complexity** | LOW — minimal code, no file I/O |
| **False-positive risk** | MEDIUM — iteration-state heuristic may miss edge cases |
| **Persistence** | In-process only; lost on process restart |
| **Precedent** | 3 sibling plugins use the same pattern |
| **Audit trail** | stderr logs only |

### Option B: External State File + Iteration-Aware Counting

**Mechanism:** Follow `mk-goal.js` pattern: persist per-session dispatch log to `.opencode/skills/.loop-guard-state/{hex(sessionID)}.json`. Each dispatch record includes executor identity, callID, timestamp, and `commandDriven` flag (derived from iteration-state heuristic). Count only non-command-driven dispatches per executor. At N≥3, emit WARN or throw.

**Code size:** ~80 lines (file I/O + counting logic + atomic write).

**False-positive mitigation:** The iteration-state heuristic (`commandDriven: true/false`) separates legitimate command-driven loop iterations from orchestrate hand-offs. Counting only `commandDriven: false` dispatches eliminates the primary false-positive source.

| Dimension | Assessment |
|-----------|------------|
| **Complexity** | MODERATE — file I/O, atomic writes, cleanup |
| **False-positive risk** | LOW — iteration-aware counting |
| **Persistence** | Cross-process (catches resume/fork patterns) |
| **Precedent** | `mk-goal.js` uses the same pattern |
| **Audit trail** | Full dispatch log with timestamps |

### Option C: Telemetry-First Rollout (Supplementary)

Applies to both A and B:
1. WARN-only default (matches existing guard behavior)
2. `MK_DEEP_LOOP_GUARD_SKIP_REPEAT=1` env escape hatch
3. Structured stderr telemetry (`[mk-deep-loop-guard] WARN:` prefix)
4. Graduated enforcement: WARN → audit → enable REJECT after clean telemetry

---

## 4. Recommendations

### Primary Recommendation: Option B with Option C rollout

**Option B** (External State + Iteration-Aware Counting) is recommended because:
1. The iteration-state heuristic directly addresses Q3's finding that the guard cannot otherwise distinguish command-driven iterations from orchestrate re-dispatches.
2. External persistence catches the resume/fork edge case.
3. It follows the proven `mk-goal.js` pattern.
4. The false-positive risk is measurably lower than Option A.

**Option C** (telemetry-first) wraps the implementation for safe gradual rollout.

### Secondary: Option A as a first step

If implementation simplicity is the priority, **Option A** (in-process counter) with the iteration-state heuristic is viable. It can always be upgraded to external state later. The in-process `Map` can be replaced with file-backed state without changing the counting logic.

### Threshold recommendation

| Count (non-command-driven, same executor, per session) | Action |
|---|---|
| 1 | Silent allow |
| 2 | WARN (legitimate retry possible) |
| ≥3 | WARN (default) or BLOCK (when `MK_DEEP_LOOP_GUARD_REJECT=1`) |

---

## 5. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| Using `subagent_type` as discriminator | Always `"general"` — no signal | `orchestrate.md:73-81,189` |
| Time-windowed detection | Session-scoped is the natural boundary; time windows add complexity | `cli-opencode/SKILL.md:293` |
| Detecting repeat via `callID` patterns | callID is unique-per-call, not correlated across calls | `index.d.ts:235-241` |
| Counting without iteration-state heuristic | Would false-positive on legitimate command-driven loop iterations (loop dispatches executor N times) | `loop_protocol.md:254-267` |
| Latency-based detection | Phase 012 established latency is insufficient on its own without correctness failure | `benchmark-results.md:84` |

---

## 6. Open Questions / Follow-up

1. **Should the guard also detect cross-executor loop patterns?** E.g., orchestrate dispatching `@deep-research` then `@deep-review` then `@deep-research` again within a session. Current design counts per-executor-type independently. Cross-executor patterns are lower-risk but could indicate orchestrate trying to build its own meta-loop. Follow-up: assess with real session telemetry.
2. **prompt-improver is not in mode-registry.json.** The guard needs a static set for it. Follow-up: add to mode-registry.json or hardcode in the guard.
3. **What happens when the `/deep:*` command itself uses the Task tool to dispatch iterations?** The iteration-state heuristic addresses this, but it should be validated against actual command YAML prompts. Follow-up: grep the rendered prompt pack for iteration markers.

---

## 7. Sources

- `.opencode/plugins/mk-deep-loop-guard.js` — current guard implementation
- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241` — SDK hook signature
- `.opencode/plugins/mk-spec-memory.js:259-271` — in-process Map pattern
- `.opencode/plugins/mk-code-graph.js:100,164` — in-process Map pattern
- `.opencode/plugins/mk-skill-advisor.js:420-422` — in-process Map pattern
- `.opencode/plugins/mk-goal.js:24,178-179,647-649` — external file state pattern
- `.opencode/skills/cli-opencode/SKILL.md:293` — bounded hand-off contract
- `.opencode/skills/cli-opencode/references/agent_delegation.md:227-230` — Command-only convention
- `.opencode/agents/orchestrate.md:73-81,189,566-569` — dispatch routing + retry protocol
- `.opencode/agents/deep-review.md:283` — caller/coordinator contract
- `.opencode/skills/deep-loop-workflows/mode-registry.json:18-145` — mode→agent mapping
- `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md:254-267` — dispatch context with iteration markers
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:47,50,60,84` — enforcement inconsistency evidence
