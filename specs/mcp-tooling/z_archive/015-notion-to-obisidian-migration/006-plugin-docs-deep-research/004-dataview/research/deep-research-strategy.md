---
title: Deep Research Strategy - Dataview reference docs
description: Workflow-owned strategy for the bounded Dataview documentation research packet.
trigger_phrases: []
---

# Deep Research Strategy - Dataview reference docs

## 1. OVERVIEW
This packet investigates the official Obsidian Dataview plugin and translates verified behavior into recommendations for AI-facing mcp-obsidian file-layer references. The workflow owns state reduction and synthesis.

## 2. TOPIC
Optimize the mcp-obsidian dataview file-layer reference docs for AI operation. Research the real plugin (repo blacksmithgu/obsidian-dataview, docs) for DQL and DataviewJS query patterns, frontmatter and inline-field conventions, and common gotchas most relevant to an AI authoring queries against migrated notes. Recommend concrete additions or updates to references/plugins/dataview/.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] KQ1: Which DQL query structure, source forms, command ordering, and query-type semantics should an AI author use?
- [x] KQ2: How do frontmatter values, types, aliases, arrays, dates, nulls, and missing fields become Dataview data?
- [ ] KQ3: How do inline fields and DataviewJS access/query patterns differ, and what file-layer syntax should AI authors emit?
- [ ] KQ4: Which migrated-note, path, quoting, task, and indexing gotchas most often make an otherwise plausible query fail?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do not edit shipped mcp-obsidian documentation or plugin code.
- Do not implement recommendations during this research run.
- Do not make claims beyond evidence from the official repository, official docs, and scoped local references.

## 5. STOP CONDITIONS
- Stop at convergence or the four-iteration hard cap.
- Synthesis must preserve source citations, negative knowledge, unresolved questions, and concrete scoped recommendations.
- A recommendation is not considered verified without an official source or an explicitly marked inference.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ1: Which DQL query structure, source forms, command ordering, and query-type semantics should an AI author use?
- KQ2: How do frontmatter values, types, aliases, arrays, dates, nulls, and missing fields become Dataview data?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Attempting to verify inline field type inference against the installed `main.js` — not necessary; the official docs are authoritative and consistent with the local data-model.md examples -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Attempting to verify inline field type inference against the installed `main.js` — not necessary; the official docs are authoritative and consistent with the local data-model.md examples
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attempting to verify inline field type inference against the installed `main.js` — not necessary; the official docs are authoritative and consistent with the local data-model.md examples

### Deep-dive into DataviewJS API methods (deferred to KQ3) -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Deep-dive into DataviewJS API methods (deferred to KQ3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deep-dive into DataviewJS API methods (deferred to KQ3)

### Deep-dive into DataviewJS API methods (deferred to KQ3) — confirmed as BLOCKED in strategy -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Deep-dive into DataviewJS API methods (deferred to KQ3) — confirmed as BLOCKED in strategy
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deep-dive into DataviewJS API methods (deferred to KQ3) — confirmed as BLOCKED in strategy

### DQL query grammar details — already covered in iteration 001 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: DQL query grammar details — already covered in iteration 001
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: DQL query grammar details — already covered in iteration 001

### Frontmatter type coercion rules (deferred to KQ2) -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Frontmatter type coercion rules (deferred to KQ2)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Frontmatter type coercion rules (deferred to KQ2)

### None in this iteration. All official doc pages were accessible and provided clear information. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None in this iteration. All official doc pages were accessible and provided clear information.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None in this iteration. All official doc pages were accessible and provided clear information.

### Searching for "null" handling in frontmatter — the official docs do not document explicit null handling; YAML null values (`null`, `~`) are treated as null/absent fields in Dataview -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for "null" handling in frontmatter — the official docs do not document explicit null handling; YAML null values (`null`, `~`) are treated as null/absent fields in Dataview
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for "null" handling in frontmatter — the official docs do not document explicit null handling; YAML null values (`null`, `~`) are treated as null/absent fields in Dataview

### Task completion tracking settings (deferred to KQ4) -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Task completion tracking settings (deferred to KQ4)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Task completion tracking settings (deferred to KQ4)

### Task completion tracking settings (deferred to KQ4) — confirmed as BLOCKED in strategy -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Task completion tracking settings (deferred to KQ4) — confirmed as BLOCKED in strategy
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Task completion tracking settings (deferred to KQ4) — confirmed as BLOCKED in strategy

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Deep-dive into DataviewJS API methods (deferred to KQ3) (iteration 1)
- Frontmatter type coercion rules (deferred to KQ2) (iteration 1)
- None in this iteration. All official doc pages were accessible and provided clear information. (iteration 1)
- Task completion tracking settings (deferred to KQ4) (iteration 1)
- Attempting to verify inline field type inference against the installed `main.js` — not necessary; the official docs are authoritative and consistent with the local data-model.md examples (iteration 2)
- Deep-dive into DataviewJS API methods (deferred to KQ3) — confirmed as BLOCKED in strategy (iteration 2)
- DQL query grammar details — already covered in iteration 001 (iteration 2)
- Searching for "null" handling in frontmatter — the official docs do not document explicit null handling; YAML null values (`null`, `~`) are treated as null/absent fields in Dataview (iteration 2)
- Task completion tracking settings (deferred to KQ4) — confirmed as BLOCKED in strategy (iteration 2)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- KQ2: How do frontmatter values, types, aliases, arrays, dates, nulls, and missing fields become Dataview data? (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
KQ2: How do frontmatter values, types, aliases, arrays, dates, nulls, and missing fields become Dataview data?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- Memory context lookup timed out; no prior memory context was injected.
- resource-map.md not present at initialization; skipping coverage gate.
- Source pointers: official repository and docs at `https://github.com/blacksmithgu/obsidian-dataview` and `https://blacksmithgu.github.io/obsidian-dataview/`; local target surface is `references/plugins/dataview/`.
- Integration point: recommendations must remain research-only and packet-local; shipped documentation is read-only.
- Prior `research-oxalpha-iter1-backup/` is retained as a separate non-canonical artifact and is not treated as active state.

## 13. RESEARCH BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume and restart live; fork and completed-continue deferred
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-08-22T15:20:00Z
