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

This is r2 (third pass). Two prior passes already corrected the strict/completion-freshness semantics, finalize-dist path, description-discovery vector claim, doctor route lists, README tree/counts, scripts/spec/validate.sh, the four phantom rule scripts, save-flow re-index steps, runtime-config-contract retired sections, rules/check-links.sh row, cli sibling enumeration, MEMORY_BASE_PATH, /speckit:search save-workflow claims, and the remaining items in the pre-supplied already-fixed list. Each focus below hunts NEW mismatches only.

- [x] [F1] feature-catalog/governance, lifecycle, context-preservation: claim-by-claim against commands, compiled-routing resolver, spec-doc-paths.
- [x] [F2] feature-catalog/retrieval, memory-quality-and-indexing, ux-hooks, tooling-and-scripts (entries not yet cited).
- [x] [F3] manual-testing-playbook/doctor-commands, feature-flag-reference, governance.
- [x] [F4] manual-testing-playbook/memory-quality-and-indexing, tooling-and-scripts, retrieval (scenarios not yet cited).
- [x] [F5] references/structure, validation, workflows, config, plus SKILL.md vs commands/speckit.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No doc or code edits — produce an editing backlog only.
- No prose-style critique; every finding cites both a doc location and a code location.
- No research into `specs/` packets except as evidence.
- No inference from prose alone; read the matching runtime source before judging any claim.
- Do not re-report any item in the pre-supplied "ALREADY FOUND AND FIXED" list.

---

## 5. STOP CONDITIONS

- `maxIterationsReached` (cap 5) — stopPolicy is max-iterations, so convergence-before-cap is telemetry only and review angles broaden rather than synthesize early.
- A single out-of-scope write fails this lineage — never write outside the lineage artifact dir.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] F1-01: runtime/ENV-REFERENCE.md does **not** document SPECKIT_COMPILED_ROUTING; flag lives in .env.example + resolver (iteration 1)
- [x] F2-01: post-save review runs at Step 11.75 (post index), not 10.5 before indexing; indexing retired/skipped (iteration 2)
- [x] F2-02: workflow-e2e.vitest.ts is a phantom test file; real suite is workflow-*.vitest.ts (iteration 2)
- [x] F2-03: post-save review companion entries 05-pre-storage-quality-gate.md / 01-verify-fix-verify-memory-quality-loop.md are phantom (iteration 2)
- [x] F2-04: runtime/handlers/memory-save.ts is a phantom handler; validator runs via validator-registry + validate.sh (iteration 2)
- [x] F3-01: compiled-route-status.cjs emits eight causeCode values, not the documented four (iteration 3)
- [x] F4-01: session-capturing-pipeline-quality.md commands cite five non-existent test files (claude-code-capture, opencode-cli-capture, copilot-cli-capture, memory-render-fixture, workflow-e2e) (iteration 4)
- [x] F4-02: playbook 'Indexing succeeds' / 'indexes successfully' contradicts the retired index step (iteration 4)
- [x] F5-01: agent-io-contract.md cites a non-existent cross-root double-slash evidence path (iteration 5)
- [x] F5-02: spec-folder-write-recipe.md cites dist/spec-folder/backfill-graph-metadata.js; file lives under dist/graph/ (iteration 5)
- [x] F5-03: core-workflow-infrastructure.md runs two phantom vitest files and asserts a retired indexer (iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Targeted grep counts (`grep -c`) plus a full 484-line read of ENV-REFERENCE.md conclusively confirms a flag is absent from a claimed canonical reference (iteration 1)
- Existence checks against every cited command-router / compiled-routing / spec-doc-paths path confirmed the lifecycle and resource-map-template docs are accurate (iteration 1)
- Reading the save workflow source step-by-step (workflow.ts) instead of trusting its stated step number, plus confirming indexMemoryFile absent from live code, exposed the retired-indexing framing (iteration 2)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The lifecycle and resource-map-template docs are already well-aligned with the command routers and spec-doc-paths.ts, so the F1 family yields only one fresh hit (iteration 1)
- Two phantom-path candidates (validator-registry.js, scripts-registry.js) were false positives from a regex that let `.js` match the `.json` prefix; the docs actually cite `.json`, which exists (iteration 2)
- The doctor-commands README route enumeration omission sits adjacent to the already-fixed doctor-route work, so it was recorded as ruled-out rather than re-reported (iteration 3)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- _(none yet)_
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- compiled-routing eligibility set / cutover claim: five-hub set, unset-resolves-to-compiled, and launcher allowlist all match runtime source (iteration 1, evidence: compiled-routing-flag.ts:14-19,30-35,59; resolve.cjs:25-36,51-54; system-skill-advisor-launcher.cjs:124)
- autopilot command-router contract: complete.md/plan.md/implement.md routers and auto.yaml match the lifecycle doc verbatim, including SPECKIT_AUTOPILOT_RESULT prefix and the four reason codes (iteration 1, evidence: complete.md:44-58; plan.md:48-60; implement.md:59-73; speckit-complete-auto.yaml:50-74,562-565)
- validator-registry.js / scripts-registry.js phantom extension claim: docs actually cite .json, which exists (iteration 2, evidence: spec-validation-rule-engine.md:33,68; markdown-link-integrity-guard.md:78)
- session-recovery-spec-kit-resume.md and ux-hooks (directive-lifecycle-dedup, goal-opencode-plugin): all cited runtime paths exist (iteration 2)
- doctor-commands README route enumeration omission: adjacent to already-fixed doctor-route list item, not re-reported (iteration 3)
- completion-freshness-validator and filter-config-contract scenarios: env vars, source, and test paths all exist and match runtime (iteration 3)
- memory-quality-and-indexing playbook post-save-review and spec-doc-structure-validator scenarios: cross-reference the feature-catalog only; stale framing is captured as F2-01/F2-04 (iteration 4)
- retrieval playbook scenario matches the resume runtime (iteration 4)
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
Loop complete at 5 iterations (maxIterationsReached). Synthesis has run — `research.md` is the canonical editing backlog (11 findings).
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
- Max iterations: 5
- Convergence threshold: 3 (stopPolicy max-iterations — convergence is telemetry only)
- Per-iteration budget: 12 tool calls
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (live)
- Question injection surface: `{artifact_dir}/inbox.jsonl` (not present)
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-09-06T09:39:31Z
