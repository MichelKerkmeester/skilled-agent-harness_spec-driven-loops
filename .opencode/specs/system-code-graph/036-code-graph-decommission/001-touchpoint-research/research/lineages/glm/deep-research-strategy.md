# Deep Research Strategy - GLM Lineage

## 1. OVERVIEW

### Purpose
Track the GLM-lineage touchpoint inventory for decommissioning system-code-graph and mk_code_index. Read-only inventory; writes confined to this lineage artifact directory.

## 2. TOPIC
Exhaustive touchpoint inventory for fully decommissioning the system-code-graph skill and the mk_code_index MCP server: every registration, import, shell-out, hook, plugin, CI job, doc reference, agent tool grant, and doctrine claim that must change, plus ordering constraints and rollback risk.

## 3. KEY QUESTIONS (remaining)
- [ ] q1: What are all live runtime registrations of mk_code_index / system-code-graph?
- [ ] q2: What are all imports, shell-outs, and executable dependencies on code-index.cjs / mk-code-index?
- [ ] q3: What hooks, plugins, CI jobs, and session reapers reference the code graph?
- [ ] q4: What doctrine claims, doc references, and agent tool grants mention the code graph?
- [ ] q5: What are the ordering constraints and rollback risks for removal?

## 4. NON-GOALS
- Mutating any repository file outside this lineage artifact directory.
- Proposing edits to .opencode/specs/**, changelogs, or benchmark reports (ARCHIVAL).
- Deciding replacement engine; this packet retires the existing one.
- Implementing any removal — later phases own that.

## 5. STOP CONDITIONS
- maxIterations (5) reached — convergence before that is telemetry only; broaden angles instead of synthesizing early.
- All five key questions answered with file:line evidence AND a post-research `rg --hidden --no-ignore` sweep finds no live-surface reference absent from the inventory.

## 6. ANSWERED QUESTIONS
[None yet]

## 7. WHAT WORKED
[First iteration -- populated after iteration 1 completes]

## 8. WHAT FAILED
[First iteration -- populated after iteration 1 completes]

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]

## 10. RULED OUT DIRECTIONS
[Populated from iteration dead-end data]

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Saturated: none yet
- Remaining frontier: none recorded

## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Populated after iteration 1 completes]

## 11. NEXT FOCUS
Iteration 1: Physical topology and raw occurrence baseline. Run `rg --hidden --no-ignore` for the core identifiers (system-code-graph, mk_code_index, mk-code-index, code_graph_, detect_changes, code-index.cjs) to establish the full hit set before classification. Dedupe symlinks. Classify each hit as live vs archival.

## 12. KNOWN CONTEXT

### Bounded Context Snapshot
- Source pointers: system-code-graph skill at .opencode/skills/system-code-graph/; mk_code_index MCP server registered in opencode.json, .claude/mcp.json, .codex/config.toml.
- Reuse candidates: sol lineage (research/lineages/sol/) already produced a 10-iteration inventory — GLM lane should broaden angles and independently confirm, not copy.
- Integration points: five runtime registrations, two plugins, three freshness hooks, git post-commit hook, two session reapers, spec-kit process boundary, skill-advisor graph, CI job, /doctor surface.
- Constraints: .opencode/specs/** is ARCHIVAL. Symlinks: CLAUDE.md=AGENTS.md; .mcp.json/.cursor/mcp.json resolve to .claude/mcp.json. Sweeps MUST use `rg --hidden --no-ignore`.
- Known non-goals: no mutation outside lineage dir; no archival edits.

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only before max; broaden angles)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: false (research.md created at synthesis)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart (live); fork, completed-continue (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-07-27T20:24:00.000Z
