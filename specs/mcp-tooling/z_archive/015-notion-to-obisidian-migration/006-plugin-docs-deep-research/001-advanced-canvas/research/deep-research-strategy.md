---
title: Deep Research Strategy - Advanced Canvas Reference Docs
description: Research session tracking for optimizing mcp-obsidian Advanced Canvas file-layer reference docs.
trigger_phrases:
  - "advanced canvas reference docs"
  - "mcp-obsidian advanced canvas"
  - "canvas json schema"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

## 1. OVERVIEW

### Purpose

Research the real Advanced Canvas plugin (repo developer-mike/obsidian-advanced-canvas, docs, and installed main.js v6.5.4) to resolve VERIFY-flagged unknowns, confirm the extended .canvas JSON node and edge keys, and find missing workflows and gotchas. Recommend concrete additions or updates to references/plugins/advanced-canvas/.

### Usage

- **Init:** Populated during initialization.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence; reducer refreshes machine-owned sections.
- **Mutability:** Mutable — analyst-owned sections stable; machine-owned sections rewritten by reducer.

---

## 2. TOPIC

Optimize the mcp-obsidian advanced-canvas file-layer reference docs for AI operation. Research the real plugin (repo developer-mike/obsidian-advanced-canvas, docs, and the installed main.js v6.5.4) to resolve the VERIFY-flagged cross-portal (interdimensional) edge serialization, confirm the extended .canvas JSON node and edge keys, and find missing workflows and gotchas. Recommend concrete additions or updates to references/plugins/advanced-canvas/.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What is the exact extended .canvas JSON schema for nodes and edges in Advanced Canvas v6.5.4, including all non-standard keys?
- [ ] How does cross-portal (interdimensional) edge serialization work in the real plugin, and what are the VERIFY-flagged unknowns?
- [ ] What missing workflows and gotchas exist for AI operation of Advanced Canvas at the file layer?
- [ ] What concrete additions or updates are needed in references/plugins/advanced-canvas/ to optimize AI operation?
- [ ] What are the differences between documented behavior and actual compiled main.js v6.5.4 behavior?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do NOT edit any shipped doc files in references/plugins/advanced-canvas/
- Do NOT implement changes — research only
- Do NOT modify files outside the bound spec folder's research/ subtree

---

## 5. STOP CONDITIONS

- All VERIFY-flagged unknowns resolved
- Extended .canvas JSON schema confirmed against real plugin
- Missing workflows/gotchas identified with concrete recommendations
- Convergence reached or max iterations hit

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- grepping the compiled plugin directly turned the VERIFY item from "unknown" into a concrete code-backed serialization rule, because the minified bundle retains the string literals and the remapping logic verbatim. Reading the existing docs first made the delta cheap to compute — every hit could be classified as confirm/new/conflict against a written baseline. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `rg` is not on this shell's PATH, so the first grep pass failed; the cost was one wasted call under a tight budget. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Direct byte-level `.canvas` file read**: Blocked — no `.canvas` files exist in the vault. Not a dead end for the research as a whole, since the specification + TypeScript types were fetched and confirmed, but the "real file" path is exhausted for this vault. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Direct byte-level `.canvas` file read**: Blocked — no `.canvas` files exist in the vault. Not a dead end for the research as a whole, since the specification + TypeScript types were fetched and confirmed, but the "real file" path is exhausted for this vault.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Direct byte-level `.canvas` file read**: Blocked — no `.canvas` files exist in the vault. Not a dead end for the research as a whole, since the specification + TypeScript types were fetched and confirmed, but the "real file" path is exhausted for this vault.

### **GitHub source TypeScript files**: Returned 404 — the source tree uses filenames not discoverable from the README. The compiled `main.js` on disk remains the closest source-level evidence; the spec document is the authoritative format reference. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **GitHub source TypeScript files**: Returned 404 — the source tree uses filenames not discoverable from the README. The compiled `main.js` on disk remains the closest source-level evidence; the spec document is the authoritative format reference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **GitHub source TypeScript files**: Returned 404 — the source tree uses filenames not discoverable from the README. The compiled `main.js` on disk remains the closest source-level evidence; the spec document is the authoritative format reference.

### **Vault `.canvas` file scan**: Exhausted. No files to read. Recommend moving this to the "Byte-level confirmation" question as "confirmed by spec types, no vault files available." -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Vault `.canvas` file scan**: Exhausted. No files to read. Recommend moving this to the "Byte-level confirmation" question as "confirmed by spec types, no vault files available."
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Vault `.canvas` file scan**: Exhausted. No files to read. Recommend moving this to the "Byte-level confirmation" question as "confirmed by spec types, no vault files available."

### No approaches ruled out this iteration. All evidence was drawn from existing sources (spec, types, main.js, reference docs). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No approaches ruled out this iteration. All evidence was drawn from existing sources (spec, types, main.js, reference docs).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No approaches ruled out this iteration. All evidence was drawn from existing sources (spec, types, main.js, reference docs).

### No approaches ruled out this iteration. The one failed action (`rg` missing from PATH) was recovered with `grep -E` — a tooling quirk, not a dead end. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No approaches ruled out this iteration. The one failed action (`rg` missing from PATH) was recovered with `grep -E` — a tooling quirk, not a dead end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No approaches ruled out this iteration. The one failed action (`rg` missing from PATH) was recovered with `grep -E` — a tooling quirk, not a dead end.

### No approaches ruled out. All targeted research actions (doc reads, main.js greps) produced useful evidence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No approaches ruled out. All targeted research actions (doc reads, main.js greps) produced useful evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No approaches ruled out. All targeted research actions (doc reads, main.js greps) produced useful evidence.

### None. (Fetching the GitHub repo directly was deferred by budget, not eliminated.) -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. (Fetching the GitHub repo directly was deferred by budget, not eliminated.)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. (Fetching the GitHub repo directly was deferred by budget, not eliminated.)

### None. The synthesis phase used existing evidence; no new research paths attempted. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None. The synthesis phase used existing evidence; no new research paths attempted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The synthesis phase used existing evidence; no new research paths attempted.

### None. The synthesis phase uses existing evidence; no new unproductive paths attempted. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None. The synthesis phase uses existing evidence; no new unproductive paths attempted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The synthesis phase uses existing evidence; no new unproductive paths attempted.

### The `dynamicHeight` verification confirmed the docs are already correct — no gap to add. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The `dynamicHeight` verification confirmed the docs are already correct — no gap to add.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `dynamicHeight` verification confirmed the docs are already correct — no gap to add.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- No approaches ruled out this iteration. The one failed action (`rg` missing from PATH) was recovered with `grep -E` — a tooling quirk, not a dead end. (iteration 1)
- None. (Fetching the GitHub repo directly was deferred by budget, not eliminated.) (iteration 1)
- **Direct byte-level `.canvas` file read**: Blocked — no `.canvas` files exist in the vault. Not a dead end for the research as a whole, since the specification + TypeScript types were fetched and confirmed, but the "real file" path is exhausted for this vault. (iteration 2)
- **GitHub source TypeScript files**: Returned 404 — the source tree uses filenames not discoverable from the README. The compiled `main.js` on disk remains the closest source-level evidence; the spec document is the authoritative format reference. (iteration 2)
- **Vault `.canvas` file scan**: Exhausted. No files to read. Recommend moving this to the "Byte-level confirmation" question as "confirmed by spec types, no vault files available." (iteration 2)
- No approaches ruled out. All targeted research actions (doc reads, main.js greps) produced useful evidence. (iteration 3)
- None. The synthesis phase uses existing evidence; no new unproductive paths attempted. (iteration 3)
- The `dynamicHeight` verification confirmed the docs are already correct — no gap to add. (iteration 3)
- No approaches ruled out this iteration. All evidence was drawn from existing sources (spec, types, main.js, reference docs). (iteration 4)
- None. The synthesis phase used existing evidence; no new research paths attempted. (iteration 4)

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
Follow up on: `metadata.frontmatterPosition`/`frontmatterLinks`: runtime-only internal fields, correctly not documented

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
[Memory context timed out on startup; prior context not available]

### Bounded Context Snapshot

- Source pointers: references/plugins/advanced-canvas/ (existing mcp-obsidian reference docs), developer-mike/obsidian-advanced-canvas GitHub repo, installed main.js v6.5.4
- The spec folder is a child phase under 015-notion-to-obisidian-migration/006-plugin-docs-deep-research
- Existing spec.md defines the research scope and constraints

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart (live); fork, completed-continue (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-08-22T10:27:24Z
