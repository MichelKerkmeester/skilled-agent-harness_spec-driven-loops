---
title: Deep Research Strategy - Claudian Reference Docs
description: Research strategy for optimizing Claudian mcp-obsidian file-layer reference docs
trigger_phrases:
  - "claudian deep research strategy"
  - "claudian reference optimization"
importance_tier: normal
contextType: planning
version: 1.0
---

# Deep Research Strategy - Claudian Reference Docs

## 1. OVERVIEW

### Purpose

Investigates the real Claudian plugin (repo YishenTu/claudian, id realclaudian, main.js v2.2.4) to resolve VERIFY-flagged unknowns in the in-vault .claude config schemas and recommend concrete additions/updates to references/plugins/claudian/.

## 2. TOPIC

Optimize the mcp-obsidian claudian file-layer reference docs for AI operation. Research the real plugin (repo YishenTu/claudian, id realclaudian, docs, and the installed main.js v2.2.4) to confirm the in-vault .claude config schemas (mcp.json, claudian-settings.json, settings.json, commands, skills), provider setup, and MCP wiring currently flagged VERIFY. Recommend concrete additions or updates to references/plugins/claudian/.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What is the complete schema of claudian-settings.json (all keys, types, defaults)?
- [x] How does Claudian write/manage mcp.json — what fields does it set, and what wiring conventions does it follow?
- [x] What provider configs does Claudian support and how are they stored (settings.json vs claudian-settings.json)?
- [x] What is the exact schema of commands and skills files that Claudian manages?
- [x] What gotchas, edge cases, or undocumented behaviors exist in the current reference docs?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Editing the shipped reference docs under references/plugins/claudian/ (research-only)
- Implementing new features or fixing Claudian plugin bugs
- Researching other plugins in the mcp-obsidian skill

## 5. STOP CONDITIONS

- All key questions answered with VERIFY-confirmed evidence
- Convergence threshold (0.05 newInfoRatio) reached across 3+ iterations
- Max iterations (4) exhausted
- All reachable plugin source/docs exhausted without new findings

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What is the complete schema of claudian-settings.json (all keys, types, defaults)?
- How does Claudian write/manage mcp.json — what fields does it set, and what wiring conventions does it follow?
- What provider configs does Claudian support and how are they stored (settings.json vs claudian-settings.json)?
- What is the exact schema of commands and skills files that Claudian manages?
- What gotchas, edge cases, or undocumented behaviors exist in the current reference docs?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- cloning the repo at the exact installed version (2.2.4) and reading the unminified TypeScript storage/types modules gave byte-level, citable schemas; cross-checking `main.js` via grep proved the same strings exist in the shipped binary. The source-first approach resolved every VERIFY flag in one pass. (iteration 1)
- probing the operator's real vault was cheap and decisive — one `ls` pass proved the migration (`.claudian/` present, `.claude/` absent) more convincingly than any amount of source reading. Parsing the live `claudian-settings.json` gave an independent second source for the 45-key schema. (iteration 2)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed; the repo README was confirmed to be non-authoritative for on-disk JSON shapes (as the docs suspected), which is why schema extraction was routed to `src/`. (iteration 1)
- nothing failed. The only limitation is that `.claudian/sessions/` does not exist yet in this vault (no sessions have been persisted), so the sessions-migration claim stays source-backed rather than live-verified. (iteration 2)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Editing the shipped reference docs — out of scope by dispatch constraint (research-only); all corrections above are emitted as recommendations for the workflow's later edit phase. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Editing the shipped reference docs — out of scope by dispatch constraint (research-only); all corrections above are emitted as recommendations for the workflow's later edit phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing the shipped reference docs — out of scope by dispatch constraint (research-only); all corrections above are emitted as recommendations for the workflow's later edit phase.

### None this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration.

### None. The repo source (TypeScript, manifest 2.2.4 == installed) resolved every VERIFY-flagged unknown directly. No approach was exhausted this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. The repo source (TypeScript, manifest 2.2.4 == installed) resolved every VERIFY-flagged unknown directly. No approach was exhausted this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The repo source (TypeScript, manifest 2.2.4 == installed) resolved every VERIFY-flagged unknown directly. No approach was exhausted this iteration.

### Re-deriving schemas from the repo — already done in iteration 1 (BLOCKED approach per strategy: don't re-read `main.js`-only or README-only). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Re-deriving schemas from the repo — already done in iteration 1 (BLOCKED approach per strategy: don't re-read `main.js`-only or README-only).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-deriving schemas from the repo — already done in iteration 1 (BLOCKED approach per strategy: don't re-read `main.js`-only or README-only).

### Reading only the compiled `main.js` (5 MB, minified) as the sole source — the unminified TypeScript repo at the same version is the cleaner, equally-authoritative source; `main.js` grep was used to confirm the same strings are present in the shipped binary, not to extract schemas. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading only the compiled `main.js` (5 MB, minified) as the sole source — the unminified TypeScript repo at the same version is the cleaner, equally-authoritative source; `main.js` grep was used to confirm the same strings are present in the shipped binary, not to extract schemas.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading only the compiled `main.js` (5 MB, minified) as the sole source — the unminified TypeScript repo at the same version is the cleaner, equally-authoritative source; `main.js` grep was used to confirm the same strings are present in the shipped binary, not to extract schemas.

### Treating the repo README as a schema source — it documents the auto-detect-first provider flow but not the on-disk JSON shapes; schemas had to come from `src/`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the repo README as a schema source — it documents the auto-detect-first provider flow but not the on-disk JSON shapes; schemas had to come from `src/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the repo README as a schema source — it documents the auto-detect-first provider flow but not the on-disk JSON shapes; schemas had to come from `src/`.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None. The repo source (TypeScript, manifest 2.2.4 == installed) resolved every VERIFY-flagged unknown directly. No approach was exhausted this iteration. (iteration 1)
- Reading only the compiled `main.js` (5 MB, minified) as the sole source — the unminified TypeScript repo at the same version is the cleaner, equally-authoritative source; `main.js` grep was used to confirm the same strings are present in the shipped binary, not to extract schemas. (iteration 1)
- Treating the repo README as a schema source — it documents the auto-detect-first provider flow but not the on-disk JSON shapes; schemas had to come from `src/`. (iteration 1)
- Editing the shipped reference docs — out of scope by dispatch constraint (research-only); all corrections above are emitted as recommendations for the workflow's later edit phase. (iteration 2)
- None this iteration. (iteration 2)
- Re-deriving schemas from the repo — already done in iteration 1 (BLOCKED approach per strategy: don't re-read `main.js`-only or README-only). (iteration 2)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: references/plugins/claudian/ in the mcp-obsidian skill, Claudian GitHub repo (YishenTu/claudian), plugin main.js v2.2.4
- Reuse candidates: Existing claudian reference docs structure, mcp-obsidian skill's file-layer conventions
- Integration points: .claude/claudian-settings.json, .claude/mcp.json, .obsidian/settings.json (Claudian-managed sections), .claude/commands/, .claude/skills/
- Constraints and risks: Research-only; no edits to shipped docs. Plugin version v2.2.4 may differ from latest repo state.
- resource-map.md not present; skipping coverage gate.

## 13. RESEARCH BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart (live)
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-08-22T11:42:15Z
