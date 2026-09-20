---
title: Deep Research Strategy - Notion Bases reference-docs optimization
description: Optimize the mcp-obsidian notion-bases file-layer reference docs for AI operation.
trigger_phrases:
  - "notion bases plugin research"
  - "notion bases yaml key spelling"
  - "notion bases database schema"
  - "notion bases embed view edge cases"
  - "notion bases rollup lookup gotchas"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Notion Bases reference-docs optimization

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Investigate what to add, update, or create in `references/plugins/notion-bases/*` to optimize AI operation of the Notion Bases plugin (v1.12.0, bgarciamoura/obsidian-notion-bases-plugin). Resolve VERIFY-flagged _database.md per-column YAML key spelling, document embed/view edge cases, rollup/lookup gotchas, and identify concrete reference doc improvements.

### Usage

- **Init:** Orchestrator copies this template to `research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

---

## 2. TOPIC

Optimize the mcp-obsidian notion-bases file-layer reference docs for AI operation. Research the real plugin (repo bgarciamoura/obsidian-notion-bases-plugin, docs, installed v1.12.0) to confirm the _database.md per-column YAML key spelling flagged VERIFY, plus embed and view edge cases and rollup/lookup gotchas. Recommend concrete additions or updates to references/plugins/notion-bases/.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] What is the exact per-column YAML key spelling in _database.md for Notion Bases v1.12.0? (VERIFY flagged)
- [ ] What embed and view edge cases exist when operating Notion Bases at the file layer?
- [ ] What rollup and lookup configuration gotchas should the reference docs cover?
- [ ] What new reference documents (if any) should be created under references/plugins/notion-bases/?
- [ ] What existing reference docs need updating or correction?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do NOT modify any shipped reference docs or plugin files
- Do NOT implement any features or fixes
- Do NOT research unrelated Notion plugins
- Do NOT make changes outside the bound spec folder

---

## 5. STOP CONDITIONS

- All VERIFY-flagged items resolved with concrete evidence
- All 5 key questions answered with cited sources
- 4 iterations completed (max)

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

[None yet]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

[First iteration — populated after iteration 1 completes]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

[First iteration — populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

[Approaches that were investigated and definitively eliminated]
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

Start by analyzing the existing references/plugins/notion-bases/ docs (reading the current _database.md and other files), then investigate the actual plugin source and compiled main.js to verify the YAML key schema.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- **Spec folder:** specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/005-notion-bases/
- **Plugin:** bgarciamoura/obsidian-notion-bases-plugin, version 1.12.0 installed
- **Shipped docs to research:** references/plugins/notion-bases/ (read-only — do not modify)
- **Key target:** _database.md per-column YAML key spelling (currently VERIFY)
- **Edge cases to investigate:** embed blocks, view configurations, rollups, lookups
- **Constraint:** this run researches but must not touch shipped doc files

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-08-22T15:30:52.000Z