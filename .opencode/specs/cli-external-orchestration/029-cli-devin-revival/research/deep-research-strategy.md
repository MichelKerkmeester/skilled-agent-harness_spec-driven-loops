---
title: Deep Research Strategy - devin-as-mcp-host-feasibility
description: Tracking file for deep-research loop resolving Open Question 3 of 029-cli-devin-revival
trigger_phrases:
  - "devin as mcp host"
  - "devin mcp add"
  - "devin mcp config"
  - "spec-kit-memory mcp host"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - devin-as-mcp-host-feasibility

## 1. OVERVIEW

### Purpose

Investigate whether Devin CLI's real MCP-host surface can genuinely host this repo's three MCP servers (spec-kit-memory, code-graph, skill-advisor) — the surface the original `cli-devin` deprecation explicitly left untouched. Resolve Open Question 3 of the parent `029-cli-devin-revival/spec.md`.

### Usage

Read by the orchestrator and `@deep-research` LEAF agent at every iteration.

### Question Injection Surface

Use `inbox.jsonl` to append external questions during an active run. The reducer owns question state.

---

## 2. TOPIC

devin-as-mcp-host-feasibility: Investigate whether Devin CLI can genuinely host this repo's MCP servers (spec-kit-memory, code-graph, skill-advisor) as referenced by `Devin-as-MCP-host` in project INSTALL_GUIDEs (a surface the original cli-devin deprecation explicitly left untouched, per `z_archive/022-cli-devin-deprecation/context/context-report.md`). Confirm Devin's real `devin mcp {add,list,get,remove,login,logout,enable,disable}` surface (`docs.devin.ai/cli/extensibility/mcp/overview.md` and `configuration.md`) against what these 3 MCP servers actually require (stdio vs http transport, env vars, auth, working directory). Determine whether bringing this into scope for the cli-devin revival (`029-cli-devin-revival`) is worthwhile, and if so what a new phase would need to cover. This directly resolves Open Question 3 in the parent `spec.md` (currently scoped OUT by default).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What is the real Devin CLI MCP surface (subcommands, config schema, transport options)?
- [ ] What do spec-kit-memory, code-graph, and skill-advisor MCP servers actually require (transport, env, auth, working directory)?
- [ ] How well does Devin's MCP surface match what these three servers need? Concrete gap list.
- [ ] Is bringing this surface into the cli-devin revival worthwhile, and if so what would a new phase need to cover?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Reverting or changing the original `cli-devin` deprecation (D1 in `022`); this is a research probe only.
- Restoring the separate Devin IDE-runtime hooks surface (D5) — that is Open Question 2, not 3.
- Implementing any Devin-as-MCP-host wiring — research outputs scope only; implementation is a follow-up.
- Re-running Phase 001 contract pin work; rely on `001-devin-contract-pin/implementation-summary.md` for the Devin CLI baseline.

---

## 5. STOP CONDITIONS

- All 4 key questions resolved with citations to `docs.devin.ai`, `001-devin-contract-pin`, and the three MCP server source files.
- OR `newInfoRatio < 0.05` (convergence threshold) across rolling 3-iteration window AND at least 3 iterations completed.
- OR `maxIterations=5` reached (per `--stop-policy=max-iterations`).
- OR a hard blocker (e.g., Devin MCP docs unreachable, all three server source files inaccessible).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Does Devin invoke project-scoped relative commands from the repository root in all supported session modes? (iteration 1)
- Which embedding tier is reliable and acceptable in Devin's sandbox, especially on first start without Ollama? (iteration 1)
- Can the live `devin mcp list/get/enable/disable` commands be exercised outside this shell's rolling-log permission failure? (iteration 1)
- Has a clean Devin Linux session successfully bootstrapped all three launchers and completed MCP `tools/list` discovery? (iteration 1)
- What is the least-privilege Devin permission/trust policy for advisor mutation tools and memory writes? (iteration 1)
- Does Devin invoke all three relative launcher commands from the repository root in a clean Linux session? (iteration 2)
- Which embedding tier and network allowlist are reliable on Devin's first cold start? (iteration 2)
- Does a project-level deny survive or get overridden by a session-level “allow all tools on this server” grant? (iteration 2)
- Does Devin normalize the three hyphenated server names to underscores in actual MCP tool names, and do deny rules match that normalized form? (iteration 2)
- Does Devin invoke all three relative launcher commands from the repository root? (iteration 3)
- Does a clean Devin Linux session preserve hyphens, normalize them to underscores, or reject one of the candidate server IDs? (iteration 3)
- Does a project-level deny remain effective when a session-level server-wide allow is granted? (iteration 3)
- Does a clean Linux Devin session preserve hyphens, normalize them to underscores, or reject one of the candidate IDs? (iteration 4)
- Does Devin invoke all three relative launcher commands from the repository root in a clean session? (iteration 4)
- Which exact namespace spelling does Devin emit for the mixed server IDs, and do permission denies match that spelling? (iteration 5)
- Which embedding tier and network/socket allowlist are reliable on a first cold start without Ollama? (iteration 5)
- Does Devin's stdio subprocess launcher always use the repository root for project-scoped servers across fresh, resumed, sandboxed, and handed-off sessions? (iteration 5)
- Do the three commands complete a clean Linux `initialize` plus `tools/list` discovery with dependencies already present in the Devin snapshot? (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Do the three commands complete a clean Linux `initialize` plus `tools/list` discovery with dependencies already present in the Devin snapshot?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Phase 001 evidence base (read-only)
- Devin CLI `3000.2.17 (2c489dfc)` is installed at `~/.local/bin/devin`.
- Real subcommands confirmed include: `mcp {add,list,get,remove,login,logout,enable,disable}` plus `auth`, `rules`, `skills`, `subagents`, `list`, `version`, `acp`, `update`, `setup`, `uninstall`.
- Three-tier JSON-with-comments config: user (`~/.config/devin/config.json`), project (`.devin/config.json`), local (`.devin/config.local.json`). Project-level only supports `permissions`, `mcpServers`, `read_config_from`.
- 4-mode permission model: `normal`, `accept-edits`, `bypass`, `autonomous`.
- Sandbox via `--sandbox`; file access derives from `Read()`/`Write()` permission scopes; network is domain-allowlist.
- Adaptive model router default; `swe`/`swe-1.6` is Cognition's coding-specialized model.
- Cloud handoff via `/handoff [task]` packages local session to cloud VM.
- Subagents: `subagent_explore`, `subagent_general`, plus custom `.devin/agents/[name]/AGENT.md`.

### Bounded Context Snapshot
- Source pointers:
  - `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md` — Phase 001 evidence base (live-verified)
  - `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/spec.md`
  - `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/z_archive/022-cli-devin-deprecation/context/context-report.md` — original deprecation's touch-list and boundaries
  - `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/spec.md` §3 Scope and §4 Open Questions (parent packet)
- Reuse candidates:
  - Phase 001 already pinned the Devin CLI baseline; this research starts from there.
  - The prior `research-devin-hooks-portability` packet (10 iterations, converged) is a sibling artifact for a different topic and serves as a shape reference but does NOT contribute findings to this packet.
- Integration points:
  - 3 MCP server entries in this repo's `opencode.json` (`mk-spec-memory`, `mk-code-index`, `mk_skill_advisor`) and any `.opencode/` MCP config.
  - Any project INSTALL_GUIDE mentioning Devin-as-MCP-host (e.g., `INSTALL_GUIDE.md`, project-level README sections, or skill READMEs).
- Constraints and risks:
  - `docs.devin.ai` URLs may have changed since Phase 001 (2026-07-23). Re-verify with current fetch.
  - The three MCP servers are local-first; their stdio commands and env expectations must be confirmed from current source, not inferred from a year-old config.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (per `--max-iterations=5`)
- Convergence threshold: 0.05 (default)
- Stop policy: `max-iterations` (convergence telemetry only; force 5 iterations per `--stop-policy=max-iterations`)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-07-24T05:28:04.819Z
