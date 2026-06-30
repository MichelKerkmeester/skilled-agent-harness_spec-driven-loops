# Iteration 3: SURFACE MAP — adjustable Public-repo surfaces × read-reliability per runtime

## Focus
Q3 (SURFACE MAP): Inventory every adjustable Public-repo surface the 002 spec names and rate each surface's **read-reliability per runtime** (OpenCode / Claude / Codex) — i.e. how reliably the surface is actually loaded into an agent's working context at decision time, since a high-leverage delta on a rarely-read surface is wasted. Verify each surface against the real repo before rating.

## Findings

### Repo-verified substrate (all claims confirmed this iteration)
- **AGENTS.md ≡ CLAUDE.md byte-identical, 424 lines each, 7 top-level sections** (§1 Critical Rules, §2 Mandatory Gates, §3 Spec Folder Docs, §4 Confidence, §5 Agent Routing, §6 MCP Tool Routing, §7 Skill Routing). ≈76 lines of headroom under the ~500-line soft budget. [SOURCE: AGENTS.md (wc -l = 424; diff -q AGENTS.md CLAUDE.md = identical); grep '^## ' AGENTS.md:15-400]
- **Constitutional folder = 16 rule files + README** (the spec's "~17 memories"): automated-writers-never-overwrite-manual, bash-output-truncation-verdict-visibility, cli-dispatch-skill-preload, code-graph-scope-intent, comment-hygiene, deep-skill-workflow-required, entity-cooccurrence-is-not-causal, **finding-is-a-hypothesis** (round-1), gate-enforcement, gate-tool-routing, **main-branch-direct-push** (round-1 fold), memory-system-spec-kit-only, post-implementation-deep-review, **regression-baseline-and-delta** (round-1), spec-folder-naming, verify-before-completion-claims. [SOURCE: ls constitutional/*.md]
- **The live `UserPromptSubmit` hook (Claude runtime)** runs `node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js` with `timeout: 3`, wired in `.claude/settings.json`. **It already re-injects a per-turn reminder every turn** — this very session shows it emitting "Advisor: live; …" plus a "Comment hygiene [HARD BLOCK] …" line. [SOURCE: .claude/settings.json:14-24; observed hook output this session] **This is the opus-fable-mode G2 "thermostat" surface, already built and firing** — and it already carries a constitutional reminder, proving the ride-along pattern works here.
- **`executor-config.ts` confirmed** at `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` (11.8KB) — the executor/flag parser (`parseExecutorConfig`, `EXECUTOR_KIND_FLAG_SUPPORT`). [SOURCE: ls; loop_protocol.md:235-248]
- **12 agents** in `.opencode/agents/`: ai-council, code, context, debug, deep-context, deep-improvement, deep-research, deep-review, markdown, orchestrate, prompt-improver, review — mirrored across `.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml` (round-1 flagged orchestrate.md as "three drifting mirrors" — a drift risk for any agent-prompt edit). [SOURCE: ls .opencode/agents/; AGENTS.md:340-378; 149/001 impl-summary.md:101]
- **Staleness candidate (F6 illustration):** AGENTS.md §"Startup & Resume Recovery" / Gate 2 cite `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md`, which **does not exist at that path** (`ls` → No such file). A dead doc pointer in the most-read surface — exactly the rot F6 says to convert into a failing check. [SOURCE: ls (file absent); AGENTS.md Gate 2 / Skill Loading Protocol]

### Read-reliability matrix (the deliverable of this iteration)
Read-reliability = probability the surface is in-context at the moment a decision is made. **Decay** = loses salience as context grows. **Subagent** = whether a dispatched sub-agent sees it.

| Surface | OpenCode | Claude | Codex | Decay | Subagent-visible | Notes |
|---|---|---|---|---|---|---|
| **AGENTS.md / CLAUDE.md §1-7** (setpoint) | HIGH (AGENTS.md) | HIGH (CLAUDE.md) | HIGH (AGENTS.md) | **YES** (G2 setpoint decay) | Partial — depends on whether agent brief re-states root doc | Most-read surface; ≈76-line headroom; byte-synced twin (edit once, syncs) |
| **Live `UserPromptSubmit` hook reminder** (thermostat) | runtime-dep (needs OpenCode hook wired) | **HIGHEST** (re-injects every turn, defeats decay) | runtime-dep | **NO** (re-asserted each turn) | **NO** (hook is main-session only — G2 subagent-blind constraint) | Already firing on Claude; already carries a constitutional reminder → proven ride-along point |
| **Constitutional memories (16)** | MED (memory_search relevance) | MED-HIGH (relevance + any rule hardcoded into the per-turn hook = HIGH) | MED | partial | via memory_search if agent queries | Auto-surface when trigger-matched; comment-hygiene already rides the per-turn hook |
| **Agent prompts** (.opencode/.claude/.codex, 12 agents) | HIGH for that agent's run | HIGH for that agent's run | HIGH for that agent's run | low (it's the agent's system prompt) | **YES — this IS the subagent surface** | The only reliable place to govern subagents (since the hook can't reach them); 3 drifting mirrors = drift risk |
| **Skills** (sk-code, sk-prompt, sk-doc, sk-git, deep-loop-workflows, system-spec-kit, system-skill-advisor) | LOW-MED (on-demand via Gate 2) | LOW-MED | LOW-MED | n/a | only when invoked | High leverage when read, but conditional on advisor routing/user invocation |
| **Commands** (deep/*, speckit/*, memory/*) | HIGH when invoked, 0 otherwise | same | same | n/a | n/a | Governs a specific workflow only when run |
| **deep-loop runtime / executor-config / prompt-pack render** | N/A (executable) | N/A | N/A | n/a | applies structurally to every dispatched iteration | Mechanism surface: `renderPromptPack` is where a subagent governor could be injected programmatically; `post-dispatch-validate` is where a leak_test-style metric/evidence-contract could be enforced |
| **skill-advisor scoring/triggers** | N/A (executable) | N/A | N/A | n/a | affects what surfaces | Adjusts which skills/memories surface — indirect leverage on read-reliability itself |

### Read-reliability conclusions (feed iteration 4's ranking)
1. **The single highest-read-reliability, decay-proof, low-blast surface is the live per-turn hook reminder** — but it is Claude-only and **subagent-blind**. A fable-5 governor line added there persists on the main Claude session at near-zero cost (it already emits a reminder string).
2. **Subagents can only be governed through agent prompts** (and through `renderPromptPack`/agent briefs for deep-loop iterations). Because our framework is agent-heavy (12 agents, deep-loop fanouts), the agent-prompt surface is where a governor earns the most — but it carries 3-runtime-mirror drift risk.
3. **AGENTS.md/CLAUDE.md is high-read but decays** (the exact G2 setpoint problem); it has ~76 lines of headroom, so a *small* doctrine-spine addition is affordable, but it should be paired with the hook (thermostat) to defeat decay rather than relying on the doc alone.
4. **Constitutional rules are the durable, auto-surfacing home for doctrine** (round-1 already used this for 2 rules) — MED-HIGH read-reliability, and any rule can be promoted to HIGH by wiring it into the per-turn hook reminder (as comment-hygiene already is).
5. **Mechanism surfaces (executor-config, post-dispatch-validate, renderPromptPack)** are where Tier-B mechanisms and Tier-C measurement actually become *enforced* rather than advisory — N/A on "read-reliability" because they execute unconditionally.

## Sources Consulted
- `AGENTS.md` / `CLAUDE.md` (line count, section headers, byte-identity)
- `.opencode/skills/system-spec-kit/constitutional/*.md` (16 rules + README inventory)
- `.claude/settings.json` (UserPromptSubmit hook wiring + command + timeout)
- observed live hook output this session (Advisor brief + comment-hygiene reminder)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` (existence + role per loop_protocol.md:235-248)
- `.opencode/agents/` listing (12 agents); AGENTS.md §5 Agent Routing
- `ls` of the cited skill-advisor-hook.md path (absent → staleness candidate)

## Assessment
- **newInfoRatio: 0.60** — Substantial new info distinct from iterations 1-2 (which extracted Fable techniques; this maps OUR surfaces): the read-reliability matrix, the confirmation that the per-turn hook is already a firing thermostat that carries a constitutional reminder, the ~76-line AGENTS.md headroom, the 16-rule constitutional inventory, the agent-prompt-as-only-subagent-surface conclusion, and a concrete staleness candidate (dead skill-advisor-hook.md pointer). Below the extraction iterations because part of the surface set was pre-enumerated in the 002 spec and some surfaces are familiar framework territory.
- **Novelty justification:** First mapping of the Fable mechanisms (iter 1-2) onto the actual adjustable surfaces with verified per-runtime read-reliability — the substrate iteration 4 needs to score leverage/(cost+blast).
- **Confidence:** HIGH on repo-verified facts (every line-count/inventory/hook-wiring claim names the command or file). MEDIUM on OpenCode/Codex hook read-reliability (rated "runtime-dep" because I verified only the Claude hook wiring directly; OpenCode/Codex equivalents were not opened this iteration — flagged as a gap for iteration 5).

## Reflection
- **What worked:** Verifying surfaces against the real repo (not the spec's enumeration) caught two things prose alone would miss — the per-turn hook already carries a constitutional reminder (proving the ride-along), and the dead skill-advisor-hook.md pointer.
- **What failed:** Could not directly confirm OpenCode/Codex per-turn-hook equivalents this iteration (budget) — rated as "runtime-dep" rather than asserting; logged as an iteration-5 gap.
- **Ruled out:** Treating AGENTS.md/CLAUDE.md as a sufficient home for a persistent governor *on its own* — it decays (G2), so a doc-only governor repeats round-1's advisory-only weakness; it must be paired with the thermostat. Ruled out editing the 3 agent mirrors by hand as a first move without a sync mechanism (drift risk per round-1's orchestrate.md note).

## Recommended Next Focus
Q4 (OPTIMIZE): Build the ranked surface×delta recommendation set — map each net-new finding (F1–F15, G1–G9) to its highest-read-reliability viable surface, score by behavioral-leverage / (cost + blast-radius), tier A (doctrine text) / B (mechanisms: governor on the live hook + agent prompts; recursion-control; lexicon/register) / C (measurement: leak_test-style metric), and dedup vs round 1.
