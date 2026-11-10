# Deep Research Strategy - Session Tracking Template

## 1. OVERVIEW

### Purpose

Documentation-fidelity audit of `system-spec-kit` docs against its runtime implementation. Every doc claim is treated as an unverified hypothesis; the runtime code under `.opencode/skills/system-spec-kit/runtime/`, `shared/`, `templates/`, `SKILL.md`, and `.opencode/commands/speckit/*.md` is the only confirming or refuting evidence.

### Usage

- Read state before each iteration.
- Pick one focus from `NEXT FOCUS`.
- Iteration findings land in `iterations/iteration-NNN.md` + `deltas/iter-NNN.jsonl`; this strategy's machine-owned sections are refreshed to reflect them.

---

## 2. TOPIC

system-spec-kit docs may have drifted from the implementation after the memory-system decommission and the `scripts/` -> `runtime/cli/` rename (continuity: `scripts/memory/` -> `runtime/cli/continuity/`). Docs under audit: `manual-testing-playbook/**`, `feature-catalog/**`, `references/**` (cli, config, debugging, memory, retrieval, structure, templates, validation, workflows) under `.opencode/skills/system-spec-kit/`. Ground truth: the same root's `runtime/` (cli/, lib/, dist/, data/trigger-index.json, hooks/), `shared/`, `templates/`, `SKILL.md`, and `.opencode/commands/speckit/*.md`.

PRIORITY FOR THIS PASS: Documents the first lane never opened.
- Iteration 1: manual-testing-playbook scenarios in context-preservation, lifecycle, plugins-and-hooks, retrieval and ux-hooks, executed step by step against the CLI.
- Iteration 2: references/cli, references/config, references/debugging, references/memory, references/templates and feature-catalog/lifecycle, governance, context-preservation and ux-hooks, checked claim by claim against runtime source.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] [P1-Playbook] In manual-testing-playbook (context-preservation, lifecycle, plugins-and-hooks, retrieval, ux-hooks), which scenarios, commands, flags, script paths, and expected outputs fail or cannot run verbatim against the current runtime?
- [x] [P2-References-Catalog] In references/ (cli, config, debugging, memory, templates) and feature-catalog/ (lifecycle, governance, context-preservation, ux-hooks), which entries contradict runtime behavior, cite obsolete paths, or describe decommissioned architecture as live?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No doc or code edits — produce an editing backlog only.
- No prose-style critique; every finding cites both a doc location and a code location.
- No research into `specs/` packets except as evidence.
- No inference from prose alone; read the matching runtime source before judging any claim.
- Do not re-report already found/fixed issues from prior lanes (e.g. strict mode warning semantics, finalize-dist.mjs, vector search in description discovery, doctor route lists, README tree counts/paths, validate.sh in phase-definitions, phantom rule scripts check-anchors/counts/headers/sections, save-flow vector re-index steps, runtime-config-contract decay sections, check-links.sh row, cli sibling enumeration, MEMORY_BASE_PATH).

---

## 5. STOP CONDITIONS

- `maxIterationsReached` (cap 2) — stopPolicy is max-iterations, so convergence-before-cap is telemetry only.
- A single out-of-scope write fails this lineage — never write outside `specs/system-speckit/033-system-speckit-v4/025-docs-reality-alignment-research/research/lineages/gemini-3-8-flash-docs-reality`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] P1-01: speckit-autopilot-lifecycle non-existent directory .opencode/skills/runtime (iteration 1)
- [x] P1-02: dist-freshness-guard watched package count mismatch (claims 7/lists 5 vs 6 actual) (iteration 1)
- [x] P1-03: speckit-completion-exposer ReferenceError on level2Incomplete and phantom .opencode/specs/ paths (iteration 1)
- [x] P1-04: cli-hook-transport-down-fail-open phantom session-prime adapter and miscounted hook (iteration 1)
- [x] P1-05: comment-hygiene-checker-baseline phantom context-server.ts target (iteration 1)
- [x] P1-06: comment-hygiene-claude-code-hook obsolete python hook target vs claude-posttooluse.cjs (iteration 1)
- [x] P1-07: resource-map-template CLAUDE.md unmatched target (iteration 1)
- [x] P1-08: authored-continuity-snapshot phantom openltm test suite (iteration 1)
- [x] P1-09: lookup-trigger-index phantom hybrid-search reference (iteration 1)
- [x] P2-01: /speckit:search advertises retired capabilities as live (iteration 2)
- [x] P2-02: epistemic vectors references memory search and contradicts Gate 1 (iteration 2)
- [x] P2-03: template guide claims save touches DB_UPDATED_FILE (iteration 2)
- [x] P2-04: template style guide documents decommissioned memory/*.md and semantic search (iteration 2)
- [x] P2-05: level specifications instructs verifying non-existent memory/ folder (iteration 2)
- [x] P2-06: trigger config documents unimplemented config.jsonc memory triggers (iteration 2)
- [x] P2-07: troubleshooting reference commands cite non-existent .opencode/specs path (iteration 2)
- [x] P2-08: troubleshooting reference cites removed CONTINUE SESSION section (iteration 2)
- [x] P2-09: daemon cli reference duplicates OPENCODE_PROMPT_TIME (iteration 2)
- [x] P2-10: level specifications and selection guide duplicate acceptance-criteria.md lines (iteration 2)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Direct source cross-verification comparing playbook instructions against CLI runtime commands and implementations.
- Tracing test fixtures and script snippets in playbooks exposed undeclared variables (`level2Incomplete`), deleted directories (`.opencode/skills/runtime`), and decommissioned files (`context-server.ts`).
- Cross-referencing command definitions (`/speckit:search`) with reference manuals exposed claims advertising retired capabilities (epistemic baselines, causal graph, evaluation).
- Comparing `AGENTS.md` Gate 1 with `epistemic-vectors.md` exposed dual-threshold divergence.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- None.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
None yet.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Re-reporting findings already in `confirmed-findings.md`.
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
None recorded yet.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Phase synthesis: consolidate all findings from iterations 1 and 2 into research.md, findings-registry.json, and deep-research-dashboard.md.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Doc root under audit: `.opencode/skills/system-spec-kit/` (manual-testing-playbook/**, feature-catalog/**, references/**).
- Ground truth: `.opencode/skills/system-spec-kit/runtime/` (cli/, lib/, dist/, data/trigger-index.json, hooks/), shared/, templates/, SKILL.md, `.opencode/commands/speckit/*.md`.
- Confirmed facts: memory database and MCP memory server decommissioned; retrieval is lexical-only via `runtime/cli/retrieval/lookup-trigger-index.mjs` + ripgrep recipes in `references/retrieval/retrieval-conventions.md`; validator registers 39 rules under `runtime/cli/spec/rules/`; continuity written by `runtime/cli/dist/continuity/generate-context.js`; metadata generated by `generate-description.js` and `backfill-graph-metadata.js`; validate.sh --strict exit codes 0/1/2/3.
- Priority for this pass:
  - Iteration 1: manual-testing-playbook scenarios in context-preservation, lifecycle, plugins-and-hooks, retrieval and ux-hooks.
  - Iteration 2: references/cli, references/config, references/debugging, references/memory, references/templates and feature-catalog/lifecycle, governance, context-preservation and ux-hooks.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 2
- Convergence threshold: 3
- Per-iteration budget: 12 tool calls
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (live)
- Question injection surface: `{artifact_dir}/inbox.jsonl` (not present)
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-09-06T11:00:00Z
