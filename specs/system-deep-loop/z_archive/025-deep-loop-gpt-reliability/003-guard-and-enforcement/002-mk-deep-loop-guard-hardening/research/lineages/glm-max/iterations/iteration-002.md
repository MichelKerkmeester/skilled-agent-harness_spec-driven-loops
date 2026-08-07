# Iteration 002: Dispatch Path Grounding + Phase 012 Evidence + Design Options

**Focus:** Q3 (dispatch path grounding), Q4 (phase 012 benchmark evidence), and 2+ concrete design options with trade-offs.

---

## Q3: Grounding the design in the actual current dispatch paths

### The dispatch contract chain (evidence-grounded)

The "exactly one bounded hand-off" rule is stated in four independent documents that form a complete contract chain:

**1. cli-opencode/SKILL.md §3 Agent Delegation** (`cli-opencode/SKILL.md:293`):
> "Command-owned loop executors (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) are LOOP-OWNED by their parent commands ... Never dispatch these directly via raw `--agent <slug>` from the CLI. `orchestrate` is an authorized **caller/coordinator only** for these agents ... it may perform exactly one bounded hand-off dispatch to the resolved leaf, but MUST NOT re-implement the loop (no iterating, no convergence checks, no continuity tracking)."

**2. cli-opencode/references/agent_delegation.md §4** (`agent_delegation.md:227-230`):
> `deep-research`: "**Command-only.** Dispatch via `/deep:research` (or `/deep:research:auto`). Direct `opencode run --agent deep-research` is forbidden."
> `deep-review`: "**Command-only.** Dispatch via `/deep:review` ... Direct `opencode run --agent deep-review` is forbidden."

**3. orchestrate.md §2 Agent Selection Priority table** (`orchestrate.md:75,79`):
> Priority 3: `@deep-research` — LEAF — `subagent_type: "general"`
> Priority 7: `@deep-review` — LEAF — `subagent_type: "general"`

Both rows include the note: "orchestrate is an authorized **caller/coordinator only** ... exactly one bounded hand-off."

**4. deep-review.md Caller + Command Integrations** (`deep-review.md:283`):
> "Orchestrator agent | `@orchestrate` | Caller/coordinator only; this agent must not call it back"

### What "bounded hand-off" means mechanically

The contract chain establishes:
- ONE dispatch of a given loop executor per recognized loop request is legitimate.
- `orchestrate` MAY dispatch `@deep-research` once (the hand-off to the leaf).
- `orchestrate` MUST NOT then dispatch `@deep-research` again (that would be "re-implementing the loop").
- The parent command (`/deep:research`) owns iteration — it dispatches the leaf N times inside its YAML loop. The plugin's `tool.execute.before` hook sees the command's dispatches too, but the guard must distinguish command-driven dispatches (legitimate loop iterations) from orchestrate-driven re-dispatches (loop re-implementation).

### Critical distinction: command-driven vs orchestrate-driven dispatch

The `tool.execute.before` hook fires for ALL `task` tool calls. When `/deep:research` runs its loop, it dispatches `@deep-research` via the Task tool — the hook sees those. When `@orchestrate` dispatches `@deep-research` as a hand-off, the hook also sees that.

**How to distinguish:** The `/deep:*` commands dispatch with a `Deep Route:` header and iteration-specific context (iteration number, state summary, strategy pointer). The orchestrate dispatch includes `Agent: @deep-research` or `Deep Route: mode=research` but WITHOUT iteration-specific state — it's a one-shot hand-off.

The guard cannot reliably distinguish "this dispatch came from the command's YAML" vs "this dispatch came from orchestrate's Task tool" from the args alone, because both use `subagent_type: "general"` and both embed agent identity in the prompt. The key differentiator is **counting per-session**: the command's loop will dispatch the executor many times (that's its job), but orchestrate's hand-off should fire once. Since the guard cannot attribute the caller, it must count **total dispatches per executor type per session** and flag when the pattern suggests orchestrate is re-driving (as opposed to the command's normal loop).

**Refined approach:** The guard should count dispatches but NOT block at N≥3 unconditionally — because a legitimate `/deep:research` loop with maxIterations=10 would dispatch `@deep-research` 10 times, which is correct. The guard needs to distinguish:
- **Command-driven loop dispatches**: legitimate, expected to repeat N times up to maxIterations.
- **Orchestrate-driven hand-off dispatches**: should fire exactly once per loop request.

Since the guard cannot attribute the caller from args alone, the most practical signal is: **if the dispatch prompt lacks iteration-specific state (no `Iteration: N of M` marker, no `STATE SUMMARY` block), it is likely an orchestrate hand-off, not a command-driven loop iteration.** This is a heuristic, not a proof.

---

## Q4: Phase 012 benchmark evidence — the enforcement inconsistency

### Exact evidence from benchmark-results.md

Phase 012's `benchmark-results.md` §4 Cross-Cutting Observations (`012-gpt-claude-benchmark/benchmark-results.md:60`):

> "**Inconsistent 'Command-only' enforcement**: GPT refused to directly Task-dispatch `deep-research` (correctly citing the Command-only convention) but allowed an identical direct dispatch to `deep-review` in a separate run. Both are documented as Command-only in `cli-opencode/references/agent_delegation.md`. This inconsistency is itself a data point — not a Mode-D failure (nothing blocked incorrectly), but evidence the routing-discipline instruction isn't uniformly internalized across near-identical cases."

The specific cells from §3 Results (`benchmark-results.md:47,50`):

| Mode | Model | Dispatch path | Result |
|------|-------|---------------|--------|
| research | GPT-5.5-fast | Direct Task dispatch (`subagent_type=deep-research`) | **Refused** — GPT cited the "Command-only" routing rule and declined |
| review | GPT-5.5-fast | Direct Task dispatch (`subagent_type=deep-review`) | Clean pass — **inconsistent with deep-research's refusal** |

### Why this motivates hardening

The evidence shows GPT-5.5 **inconsistently self-enforces** the Command-only convention across identically-scoped agents. The convention is stated identically for both in `agent_delegation.md:227-228`. But the model applied it to `deep-research` and not to `deep-review`.

This is exactly the class of problem that **mechanical enforcement** solves: instead of relying on the model to internalize and apply a textual convention consistently, the plugin checks it programmatically. The current `mk-deep-loop-guard.js` already does this for **single-dispatch mode-mismatch** (checking that the declared `mode=` matches `mode-registry.json`). Extending it to detect **repeated dispatches** would catch the case where orchestrate re-drives a loop executor — the behavior the Command-only convention exists to prevent.

### What the hardening does NOT need to address

Phase 012 §7 Gate-Relevant Summary (`benchmark-results.md:84`) concludes: "zero semantic wrong-mode artifacts, zero route-proof mismatches, and zero Mode-D recurrences were observed across every GPT cell actually completed." The remaining gap is specifically the **inconsistent self-enforcement** of the Command-only restriction, not mode-mismatch or route-proof failures. The existing single-dispatch guard handles mode-mismatch. The new capability addresses the enforcement gap.

---

## Design Options

### Option A: Session-Scoped In-Process Dispatch Counter (Minimal Extension)

**Mechanism:** Add a closure-scoped `Map<sessionID, Map<loopExecutorType, count>>` to the plugin factory. On each `tool.execute.before` call where `input.tool === 'task'`:
1. Parse the prompt for loop-executor identity (reuse existing `mode=` regex + add `Agent: @deep-research` pattern).
2. If a loop executor is identified, increment the per-session-per-executor count.
3. At count ≥3, emit WARN or throw (if REJECT env set).

**State model:**
```javascript
const dispatchCounts = new Map(); // sessionID → Map(executorType → count)
```

**Threshold tuning:** N≥3 per session per executor type. Accommodates 1 hand-off + 1 legitimate retry.

**Prompt parsing strategy:** Multi-pattern fallback:
1. `/Agent:\s*@?(deep-research|deep-review|deep-improvement|prompt-improver)/i`
2. Existing `/mode=([a-z0-9-]+)/i` mapped through mode-registry.json
3. `/Deep Route:\s*mode=([a-z0-9-]+)/i`

**False-positive risk: MEDIUM** — A legitimate `/deep:research` loop with maxIterations≥3 would trip the counter, because the hook cannot distinguish command-driven iterations from orchestrate-driven re-dispatches. Mitigation: check for iteration-state markers in the prompt (`Iteration: N of`, `STATE SUMMARY`). If present, skip counting (it's a command-driven loop iteration, not an orchestrate hand-off).

**Trade-offs:**

| Pro | Con |
|-----|-----|
| Minimal code change (~40 lines added to existing plugin) | Cannot distinguish command-driven loop iterations from orchestrate re-dispatches without heuristic |
| In-process only — no file I/O, no cleanup needed | Lost on process restart (but repeat detection is per-session anyway) |
| Consistent with 3 sibling plugins' patterns | False-positive risk if iteration-state heuristic fails |
| WARN default (non-blocking) — gradual rollout | Does not catch cross-process patterns (resume/fork) |

**Implementation sketch:**
```javascript
const LOOP_EXECUTORS = new Set(['deep-research', 'deep-review', 'deep-improvement', 'prompt-improver']);
const REPEAT_THRESHOLD = 3;
const dispatchCounts = new Map(); // sessionID → Map(executor → count)

function identifyLoopExecutor(promptText) {
  // Pattern 1: Agent: @deep-research
  const agentMatch = /Agent:\s*@?(deep-research|deep-review|deep-improvement|prompt-improver)/i.exec(promptText || '');
  if (agentMatch) return agentMatch[1].toLowerCase();
  // Pattern 2: mode=X via registry
  const modeMatch = declaredModeFromPrompt(promptText);
  if (modeMatch) {
    const entry = [...registry.values()].find(e => e.workflowMode === modeMatch);
    if (entry?.agent && LOOP_EXECUTORS.has(entry.agent)) return entry.agent;
  }
  return null;
}

function isCommandDrivenIteration(promptText) {
  // Heuristic: command-driven iterations include iteration-state markers
  return /Iteration:\s*\d+\s+of\s+\d+/i.test(promptText || '')
      || /STATE SUMMARY/i.test(promptText || '');
}
```

---

### Option B: External State File + Iteration-Aware Counting (Defense-in-Depth)

**Mechanism:** Follow the `mk-goal.js` pattern: persist a per-session dispatch log to `.opencode/skills/.loop-guard-state/{hex(sessionID)}.json`. On each `tool.execute.before`:
1. Read the session's dispatch log from file (or initialize empty).
2. Parse prompt for executor identity + caller signal.
3. Append the dispatch record (executor, callID, timestamp, hasIterationState).
4. Count non-command-driven dispatches per executor type.
5. At count ≥3, emit WARN or throw.

**State model:**
```json
{
  "sessionId": "abc123",
  "dispatches": [
    {"executor": "deep-research", "callID": "call-1", "ts": "...", "commandDriven": false},
    {"executor": "deep-research", "callID": "call-2", "ts": "...", "commandDriven": true}
  ]
}
```

**Threshold tuning:** Count only `commandDriven: false` dispatches (those without iteration-state markers). Block at N≥3 non-command-driven dispatches of the same executor type.

**Caller attribution heuristic:** A dispatch is `commandDriven: true` if the prompt contains `Iteration: N of M` or `STATE SUMMARY` — markers injected by the command YAML's prompt rendering. A dispatch is `commandDriven: false` if it lacks these markers — suggesting it came from orchestrate's hand-off, not the command's loop.

**False-positive risk: LOW** — The iteration-state heuristic separates legitimate command-driven loop iterations from orchestrate-driven hand-offs. Even if the heuristic fails on one dispatch, the N≥3 threshold provides margin.

**Trade-offs:**

| Pro | Con |
|-----|-----|
| Persistent across processes (catches resume/fork patterns) | More code (~80 lines + file I/O) |
| Iteration-aware counting eliminates the main false-positive source | File I/O on every `task` dispatch (perf consideration) |
| Full audit trail (dispatch log with timestamps) | Cleanup needed (TTL or session-end sweep) |
| Can detect patterns across sessions (e.g., orchestrate re-driving after resume) | More complex to test and maintain |

**Implementation sketch:**
```javascript
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Buffer } from 'node:buffer';

const STATE_DIR = fileURLToPath(new URL('../skills/.loop-guard-state/', import.meta.url));
const REPEAT_THRESHOLD = 3;

function sessionKey(sessionID) {
  return Buffer.from(sessionID, 'utf8').toString('hex');
}

function statePath(sessionID) {
  return join(STATE_DIR, `${sessionKey(sessionID)}.json`);
}

function readDispatchLog(sessionID) {
  try {
    return JSON.parse(readFileSync(statePath(sessionID), 'utf8'));
  } catch { return { sessionId: sessionID, dispatches: [] }; }
}

function writeDispatchLog(log) {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  // Atomic write: temp + rename
  writeFileSync(statePath(log.sessionId), JSON.stringify(log, null, 2));
}
```

---

### Option C (Supplementary): Env-Gated Bypass + Telemetry-First Rollout

**Not a standalone design** — applies to both A and B as a deployment strategy:

1. **WARN-only default**: New counting logic emits `console.error` warnings, never blocks. This matches the existing guard's default (REJECT only when `MK_DEEP_LOOP_GUARD_REJECT=1`).
2. **Env escape hatch**: `MK_DEEP_LOOP_GUARD_SKIP_REPEAT=1` disables repeat-counting entirely (falls back to mode-mismatch-only). For operators who need to override.
3. **Telemetry**: Every repeat detection logs to stderr with structured fields (`sessionID`, `executor`, `count`, `commandDriven`). Operators can grep for `[mk-deep-loop-guard] WARN:` to audit.
4. **Graduated enforcement**: Ship WARN-only first. After N sessions of clean telemetry, enable REJECT for the repeat threshold.

---

## Recommendation

**Option B (External State + Iteration-Aware Counting)** is the stronger design because:
- The iteration-state heuristic directly addresses the Q3 finding that the guard cannot otherwise distinguish command-driven loop iterations from orchestrate re-dispatches.
- External persistence catches the resume/fork edge case where the same logical session spans processes.
- It follows the proven `mk-goal.js` pattern, so the codebase already has the architectural precedent.
- The false-positive risk is lower because non-command-driven dispatches are counted separately.

**However**, if implementation simplicity is prioritized, **Option A (In-Process Counter)** with the iteration-state heuristic is a viable first step — it can always be upgraded to external state later.

In either case, **Option C (telemetry-first rollout)** should wrap the chosen mechanism.

---

## Findings Summary

| # | Finding | Evidence |
|---|---------|----------|
| 3.1 | "Exactly one bounded hand-off" stated in 4 independent documents | cli-opencode SKILL.md:293, agent_delegation.md:227-230, orchestrate.md:75,79, deep-review.md:283 |
| 3.2 | Guard cannot attribute caller (command vs orchestrate) from args alone | both use subagent_type:"general", identity in prompt |
| 3.3 | Iteration-state markers (`Iteration: N of M`, `STATE SUMMARY`) distinguish command-driven iterations | loop_protocol.md:254-267 Step 3 dispatch context |
| 4.1 | GPT-5.5 inconsistently enforced Command-only: refused deep-research, allowed deep-review | benchmark-results.md:60 |
| 4.2 | Both agents documented identically as Command-only in agent_delegation.md | agent_delegation.md:227-228 |
| 4.3 | Zero mode-mismatch failures in phase 012 — existing guard handles mode-mismatch | benchmark-results.md:84 |
| 4.4 | Hardening targets enforcement inconsistency, not mode-mismatch | benchmark-results.md:60,84 |
| D-A | Option A: in-process counter, ~40 lines, MEDIUM false-positive risk | iteration findings |
| D-B | Option B: external state + iteration-aware counting, ~80 lines, LOW false-positive risk | iteration findings |
| D-C | Option C: telemetry-first rollout (supplementary to A or B) | deployment strategy |
