---
title: Deep Research Strategy - Dataview Reference Docs Optimization (004-dataview)
description: Session tracking for the mcp-obsidian Dataview file-layer reference-docs deep-research run.
trigger_phrases:
  - "dataview deep research strategy"
  - "004-dataview research tracking"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Dataview Reference Docs Optimization

## 1. OVERVIEW

### Purpose

Persistent brain for this deep-research session. Records what to investigate, what worked, what failed, and where to focus next.

### Usage

- **Init:** Orchestrator created this file at `research/deep-research-strategy.md` with Topic, Key Questions, Known Context, and Research Boundaries.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence; the reducer refreshes machine-owned sections after each iteration.
- **Mutability:** Mutable — analyst-owned sections remain stable; machine-owned sections are reducer-rewritten.

---

## 2. TOPIC

Optimize the mcp-obsidian dataview file-layer reference docs for AI operation. Research the real plugin (repo blacksmithgu/obsidian-dataview, docs) for DQL and DataviewJS query patterns, frontmatter and inline-field conventions, and common gotchas most relevant to an AI authoring queries against migrated notes. Recommend concrete additions or updates to references/plugins/dataview/.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] KQ1: Which DQL query patterns (TABLE/LIST/TASK/CALENDAR plus FROM/WHERE/SORT/GROUP BY/FLATTEN/LIMIT clauses) must `references/plugins/dataview/*` document so an AI authors valid queries against migrated notes, and what syntax gotchas apply?
- [ ] KQ2: Which DataviewJS APIs (`dv.pages`/`dv.pagePaths`/`dv.page`, `dv.table`/`dv.list`/`dv.task`, renderers, `dv.el`/`dv.paragraph`/`dv.span`, `dv.luxon`/`dv.date`) are essential for AI-authored embedded views, and how do they differ from DQL?
- [ ] KQ3: What frontmatter and inline-field conventions (field types, coercion rules, dates, links, lists, tags/aliases, inline fields in tasks/lists) does Dataview index, and which matter most when notes are migrated from Notion?
- [ ] KQ4: What common failure modes and gotchas (null/missing fields, type coercion mismatches, date math, source/path scoping, metadata cache staleness, DQL-vs-DataviewJS differences) most often break AI-authored queries?
- [ ] KQ5: What concrete additions, updates, or new documents should be made to `references/plugins/dataview/*` to close these gaps against the current file inventory?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not edit shipped docs or anything under `references/plugins/` — this run is research-only.
- Do not implement fixes; report findings only.
- Do not evaluate alternative query plugins beyond what Dataview itself depends on.
- Do not re-litigate the Notion migration design; only how migrated note shapes interact with Dataview queries.

---

## 5. STOP CONDITIONS

- maxIterations (4) reached — terminal cap bypasses quality-guard overrides.
- Convergence threshold met with quality guards passing (stop policy: convergence).
- All key questions answered with cited evidence.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the local grammar file side-by-side with the official structure page made gaps fall out as concrete, citable diffs instead of impressions; the repo-wide glob recovered instantly from the stale path hint. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the dispatch-context path assumption cost one glob call; the 12-call ceiling left 4 of 6 local files unread, so workflow/troubleshooting layers are unevaluated this iteration. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/` as the audit target: path does not exist in this repo; the live tree is under `.opencode/`. All later iterations should use the `.opencode/` path. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/` as the audit target: path does not exist in this repo; the live tree is under `.opencode/`. All later iterations should use the `.opencode/` path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/` as the audit target: path does not exist in this repo; the live tree is under `.opencode/`. All later iterations should use the `.opencode/` path.

### None. No approach was exhausted this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. No approach was exhausted this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. No approach was exhausted this iteration.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/` as the audit target: path does not exist in this repo; the live tree is under `.opencode/`. All later iterations should use the `.opencode/` path. (iteration 1)
- None. No approach was exhausted this iteration. (iteration 1)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: **Bracket inline-field syntax `[key:: value]` inside tasks/list items is absent from the local metadata docs** - surfaced by the official nav entry "Metadata on Tasks and Lists"; directly relevant to TASK queries agai...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Prior Spec Kit Memory context: none loaded — memory daemon unavailable at init (MCP timeout; CLI front door exit 75 retryable). Treat as cold start.
- Resource map: resource-map.md not present; skipping coverage gate.
- Target surface: mcp-obsidian file-layer reference tree at `references/plugins/dataview/` inside this repo (`.claude/skills/mcp-tooling/mcp-obsidian/`). The run is research-only; that tree is read-only evidence, never a write target.
- Real-plugin sources of truth: blacksmithgu/obsidian-dataview repository (docs/, src/), official docs site (blacksmithgu.github.io/obsidian-dataview), and Obsidian community documentation.
- Executor deviation (init-time): operator bound `--executor=cli-opencode --model=openrouter/stealth/ox-alpha`; ADR-001 self-invocation guard trips on this OpenCode dispatch surface (OPENCODE_PID set, opencode parent process), so the workflow resolved to its native branch (LEAF @deep-research Task dispatch per iteration). Model binding is agent-governed under native dispatch.

### Bounded Context Snapshot

- Source pointers: `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/` (current reference tree to optimize); sibling plugin reference folders show the house doc style.
- Reuse candidates: existing dataview reference files (audit rather than rewrite); mcp-obsidian SKILL.md conventions for how AI consumes these docs.
- Integration points: AI-authored DQL/DataviewJS queries run against migrated Notion notes inside the user's vault via mcp-obsidian operations.
- Constraints and risks: WebFetch-dependent evidence may rate-limit; keep citations exact; do not modify any investigated file.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Current generation: 1
- Started: 2026-08-22T14:31:20Z
