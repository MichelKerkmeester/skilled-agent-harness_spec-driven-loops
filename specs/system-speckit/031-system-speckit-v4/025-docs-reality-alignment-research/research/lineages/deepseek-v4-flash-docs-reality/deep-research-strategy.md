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

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] [F1] Which playbook commands/flags/paths/env-vars changed or no longer exist after the scripts/ -> runtime/cli/ rename and memory decommission?
- [x] [F2] Which catalog entries still describe retired capabilities (semantic search, embeddings, MCP memory tools, causal graph, decay) as live?
- [x] [F3] Which references contradict runtime behavior (validate.sh exit codes, rule names, file layout, defaults)?
- [x] [F4] Which playbook scenarios cannot run verbatim today (retired paths, decommissioned binaries)?
- [x] [F5] Which shipped features (rules/, cli subcommands, hooks) have no catalog/playbook entry?
- [x] [F6] Which contradictions exist between the docs themselves (doc-vs-doc drift)?
- [x] [F7] Which README/index files list files or sections that do not exist?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No doc or code edits — produce an editing backlog only.
- No prose-style critique; every finding cites both a doc location and a code location.
- No research into `specs/` packets except as evidence.
- No inference from prose alone; read the matching runtime source before judging any claim.

---

## 5. STOP CONDITIONS

- `maxIterationsReached` (cap 10) — stopPolicy is max-iterations, so convergence-before-cap is telemetry only and review angles broaden rather than synthesize early.
- A single out-of-scope write fails this lineage — never write outside the lineage artifact dir.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] F1-01: runtime/cli/finalize-dist.mjs is a ghost path; real file is runtime/scripts/finalize-dist.mjs (iteration 1)
- [x] F2-01: description-discovery claims live vector search that is gone; self-contradiction (iteration 2)
- [x] F2-02: runtime-config-contract documents decay scoring as a current section (iteration 2)
- [x] F3-01: --strict does not turn warnings into validation errors (iteration 3)
- [x] F3-02: CONTINUITY_FRESHNESS stale warn does not pre-block --strict (iteration 3)
- [x] F4-01: feature-catalog /doctor docs list decommissioned routes as shipped (iteration 4)
- [x] F5-01: rule-engine catalog lists non-registered rule and omits registered ones (iteration 5)
- [x] F6-01: memory-handback cli-* family mis-enumeration (iteration 6)
- [x] F6-02: /doctor route count and contents disagree (iteration 6)
- [x] F6-03: environment-variables MEMORY_BASE_PATH vs ENV-REFERENCE (iteration 6)
- [x] F7-01: README tree lists phantom memory/ and constitutional/ dirs (iteration 7)
- [x] F7-02: README tree carries stale module/file counts (iteration 7)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Direct filesystem existence checks (ls) against every documented runtime path: conclusively confirms/refutes a claimed path without needing to run the tool (iteration 1)
- Cross-referencing a feature-catalog entry against its own decommission table + producer source exposes F2/F6 self-contradictions (iteration 2)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The memory-system docs are already re-pointed after the rename, so the F1 path drift concentrates in shell/build command strings rather than memory docs (iteration 1)
- The memory-system.md / embedder-pluggability.md references are already decommission-aware, so pure live-retired-capability hits concentrate in older feature-catalog entries (iteration 2)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Memory-doc path fishing (F1): exhausted after one pass; memory docs cite runtime/cli/dist/continuity/generate-context.js correctly. Do not re-fish memory docs for stale paths (iteration 1)
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- doctor-deep-loop-convergence query.cjs examples: query types and target spec folder still exist (iteration 1, evidence: runtime/scripts/query.cjs:208-217)
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
[Self-owned open questions from iteration write-back]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[Broaden] references/templates/** and references/structure/** group scan for retired-capability framing and layout drift (iteration 8).
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Doc root under audit: `.opencode/skills/system-spec-kit/` (manual-testing-playbook/**, feature-catalog/**, references/**).
- Ground truth: `.opencode/skills/system-spec-kit/runtime/` (cli/, lib/, dist/, data/trigger-index.json, hooks/), shared/, templates/, SKILL.md, `.opencode/commands/speckit/*.md`.
- Confirmed facts: memory database and MCP memory server decommissioned; retrieval is lexical-only via `runtime/cli/retrieval/lookup-trigger-index.mjs` + ripgrep recipes in `references/retrieval/retrieval-conventions.md`; validator registers 39 rules under `runtime/cli/spec/rules/`; continuity written by `runtime/cli/dist/continuity/generate-context.js`; metadata generated by `generate-description.js` and `backfill-graph-metadata.js`; validate.sh --strict exit codes 0/1/2/3.
- Audit casts: playbook commands/flags/paths/env-vars; catalog retired-capability entries; references-vs-runtime (exit codes, rule names, layout, defaults); playbook verbatim runs; shipped features with no doc entry; doc-vs-doc drift; README/index ghost entries.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (stopPolicy max-iterations)
- Per-iteration budget: 12 tool calls
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (live)
- Question injection surface: `{artifact_dir}/inbox.jsonl` (not present)
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-09-06T10:02:00Z
