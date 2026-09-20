---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/`. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session on cli-devin/cli-cursor hook adapter refinement.

### Usage

- **Init:** Populated Topic, Key Questions, Known Context, and Research Boundaries.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable -- analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration.
- **Protection:** Shared state with explicit ownership boundaries.

### Question Injection Surface

Use `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/inbox.jsonl` to append external questions during an active run.

---

## 2. TOPIC
What further hook refinements, upgrades, or additions should the cli-devin and cli-cursor CLI hook adapter layers get, now that Devin's hooks are confirmed to fire live (corrected `.devin/hooks.v1.json` nested schema -- no top-level version/hooks wrapper, each event is an array of `{matcher, hooks:[{type,command,timeout}]}` -- 6 of 8 lifecycle events observed firing with real payloads: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop, SessionEnd; PermissionRequest and PostCompaction did not occur in that session) and Cursor's hook layer is independently built and wired via `.cursor/hooks.json`?

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What coverage gaps exist for cli-devin and cli-cursor against the full Claude/Codex hook inventory (8 lifecycle events)?
- [ ] Q2: Given now-confirmed live Devin payload shapes, can the tolerant field-name fallbacks in `task-dispatch-guard.cjs`, `spec-gate-enforce.mjs`, and `mcp-route-guard.cjs` be tightened to the confirmed real shapes without losing fail-open safety?
- [ ] Q3: Is PermissionRequest/PostCompaction non-firing in the one observed Devin session expected (event genuinely did not occur) or does it warrant a further live-verification pass -- and how should that follow-up test be designed?
- [ ] Q4: What is `mcp-route-guard.cjs`'s dormancy status for both Devin and Cursor now that MCP servers may be independently registrable per runtime?
- [ ] Q5: What Devin or Cursor CLI features have shipped since the original research (docs.devin.ai / docs.cursor.com) that these two packets have not yet accounted for?
- [ ] Q6: What concrete duplication-reduction opportunities exist between the cli-devin and cli-cursor hook adapters given their structurally similar 4-runtime hook-directory pattern, fail-open contract, and guard-core wrapping?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not implementing any hook/guard code changes -- this is a research-only investigation; findings feed a future implementation packet.
- Not re-deriving already-settled facts already captured in `hook-testing-results.md` or the 008/011/012 (Devin) and 009/010 (Cursor) implementation summaries -- cite and extend, don't repeat.
- Not investigating runtimes other than Devin and Cursor (Claude/Codex/OpenCode hook behavior is reference context only, not a research target in itself).

---

## 5. STOP CONDITIONS
- All 6 key questions have evidence-backed answers cited to file:line or a fetched doc.
- Or: 5 iterations complete (hard max-iterations cap for this run) regardless of composite convergence.

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
- Q3: How to force and distinguish real Devin `PermissionRequest` and `PostCompaction` events in a follow-up live test. (iteration 1)
- Q5: Devin/Cursor CLI features shipped since the original packet research. (iteration 1)
- Q4: Current dormancy/applicability of both MCP route guards after per-runtime MCP registration changes. (iteration 1)
- Q6: Safe deduplication boundaries across Cursor and Devin adapters. (iteration 1)
- Q2: Whether confirmed Devin payloads justify tightening field fallbacks without reducing fail-open safety. (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q2: Whether confirmed Devin payloads justify tightening field fallbacks without reducing fail-open safety.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
None -- Spec Kit Memory MCP is not reachable from this runtime session; no prior `memory_context()` results were available. Prior on-disk research context: this same `029-cli-devin-revival/research/` packet previously completed an unrelated `devin-as-mcp-host-feasibility` investigation (archived to `research_archive/20260727T040816Z/` before this session started -- distinct topic, kept for reference, not reused here).

### Bounded Context Snapshot

- Source pointers: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md`, `008-devin-hook-parity/`, `011-hook-truth-and-runtime-readmes/`, `012-devin-hook-hardening/`, `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/` (6 phase children), `010-hook-code-style-cross-runtime/`.
- Reuse candidates: shared guard-core wrapping pattern already used by both `task-dispatch-guard.cjs`, `spec-gate-enforce.mjs`, `mcp-route-guard.cjs` adapters.
- Integration points: `.devin/hooks.v1.json`, `.cursor/hooks.json`, the 4-runtime hook-directory pattern shared by both packets.
- Constraints and risks: resource-map.md absent for this packet (no pre-inventoried file list); Spec Kit Memory MCP unreachable from this runtime (no prior-context recall) -- treat all findings as freshly derived from on-disk sources, not memory recall.

Do not inline full source bodies. Use `@context` for one-shot retrieval only if needed; this snapshot seeds the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Current generation: 2
- Started: 2026-07-27T04:08:21.000Z
- Stop policy: max-iterations (this run MUST complete all 5 iterations regardless of any early composite-convergence signal; convergence is telemetry-only for this run)
- Executor: cli-opencode, model openai/gpt-5.6-sol, reasoningEffort high, serviceTier default (not fast)
