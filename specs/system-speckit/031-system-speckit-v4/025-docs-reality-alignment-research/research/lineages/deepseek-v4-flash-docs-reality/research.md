# system-spec-kit docs-reality alignment — synthesis

**lineage:** `deepseek-v4-flash-docs-reality` · **session:** `fanout-deepseek-v4-flash-docs-reality-1788681648256-twu5sb` · **loop:** research (max-iterations) · **iterations:** 10/10 · **stopReason:** `maxIterationsReached`

Audit of the `system-spec-kit` documentation (`manual-testing-playbook/**`, `feature-catalog/**`, `references/**`) against its runtime implementation (`.opencode/skills/system-spec-kit/runtime/`, `shared/`, `templates/`, `SKILL.md`, `.opencode/commands/speckit/*.md`). Every finding cites both a doc location and a code location. No file was edited.

---

## Summary

17 distinct doc-vs-code mismatches across 17 findings, dominated by two root causes:

1. **The `scripts/` → `runtime/cli/` rename left stale/phantom paths** in structure, templates, and playbook docs (F1-01, F7-01, F8-01) — and the rules layer has more phantom rule scripts than a single grep reveals (F10-01).
2. **The memory-system decommission (vector/BM25 search, embeddings indexing, MCP memory tools, causal graph, decay) is only partially reflected in the docs** — correct in `references/memory/**` and the manual-testing-playbook index, but stale in feature-catalog entries, README tree, and the `references/workflows/execution-methods.md` save flow (F2-01, F2-02, F4-01, F7-01, F9-01).

A second, independent root cause is **validation-severity semantics drift**: two docs claim `--strict` promotes warnings to errors, contradicting the orchestrator (F3-01, F3-02).

**Distribution:** 9 × P1 (wrong/harmful), 8 × P2 (misleading/cosmetic). No findings were refuted by the runtime; all confirmed by direct file existence checks, registry/registry inspection, or orchestrator source.

---

## P1 — wrong / harmful (fix first)

### F3-01 · `--strict` does not turn warnings into validation errors
`references/validation/validation-rules.md:44` (and the severity→exit table `:38-42`) claims "in strict mode, warnings exit as validation errors."
**Actual:** `runtime/lib/validation/orchestrator.ts:984-989` — "Strict still decides which rules RUN; it no longer decides what a warning MEANS," and `passed: summary.errors === 0`; a `warn` does not fail (`process.exitCode = report.passed ? 0 : 2`, `:1100`).
**Fix:** rewrite `:44` to state `--strict` selects which rules run and warnings stay advice; also fix the misleading `--strict  Warnings as errors` help line in `runtime/cli/spec/validate.sh`.

### F3-02 · `CONTINUITY_FRESHNESS` stale `warn` does not already block `--strict`
`references/validation/validation-rules.md:122,127` claims a stale-freshness `warn` "already FAILS the completion gate" and that ENFORCE "does not change the --strict exit code (both already exit 2)."
**Actual:** registry `CONTINUITY_FRESHNESS` description: "reports **warn by default and escalates to fail** under `SPECKIT_COMPLETION_FRESHNESS_ENFORCE`"; orchestrator `passed: summary.errors === 0` means a `warn` passes. ENFORCE is what escalates `warn`→`error`.
**Fix:** rewrite the "Completion-blocking note" and the ENFORCE row to state a stale `warn` does not block; ENFORCE escalates to error, which is what makes `--strict` fail.

### F1-01 · Ghost build path `runtime/cli/finalize-dist.mjs`
`manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md:196` documents the MCP build as `tsc --build && node runtime/cli/finalize-dist.mjs`.
**Actual:** `runtime/cli/finalize-dist.mjs` does not exist; the file is at `runtime/scripts/finalize-dist.mjs`. The documented command fails verbatim.
**Fix:** `tsc --build && node runtime/scripts/finalize-dist.mjs`.

### F2-01 · Description discovery claims live vector search that is gone (self-contradiction)
`feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md:19` says description discovery "uses it to short-circuit full-corpus vector search"; the same doc `:44-45` says the vector-query consumer "is gone."
**Actual:** `runtime/cli/spec-folder/generate-description.ts` has no vector/embed/similarity code; vector search is a declared loss (`references/memory/memory-system.md:9`).
**Fix:** rewrite `:19-21` as a per-folder identity card consumed by the trigger-index generator, not a vector-search short-circuit.

### F4-01 · Feature-catalog `/doctor` docs list decommissioned routes as shipped
`feature-catalog/doctor-commands/category-overview.md:27` ("five ... memory, causal-graph, deep-loop, code_graph, skill-advisor, skill-budget, code-graph") and `feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19` ("seven subsystem YAML workflows").
**Actual:** `_routes.yaml` targets are `speckit-retrieval, embeddings, deep-loop, skill-advisor, skill-budget, parent-skill, skill-graph-freshness, fable-mode, runtime-mirrors` — no `memory`/`causal-graph`/`code-graph`; `manual-testing-playbook/doctor-commands/README.md:22` confirms removal.
**Fix:** replace the route lists with the real targets and fix the count.

### F7-01 · README tree lists phantom `memory/` and `constitutional/` dirs
`README.md:413` (`runtime/cli/memory/ # Continuity scripts`), `:434` (`constitutional/ # Always-surface rules (never decay)`).
**Actual:** `runtime/cli/memory` does not exist (continuity is `runtime/cli/continuity/`); `constitutional/` does not exist (tier retired, `references/memory/memory-system.md:8`).
**Fix:** `runtime/cli/continuity/`; delete the `constitutional/` line.

### F8-01 · Stale pre-rename validate.sh path
`references/structure/phase-definitions.md:236` — `./scripts/spec/validate.sh specs/###-parent-feature/ --recursive`.
**Actual:** `scripts/spec/validate.sh` missing; real path `runtime/cli/spec/validate.sh`.
**Fix:** `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh ...`.

### F10-01 · Four phantom validator rule scripts across five docs
`phase-definitions.md:119` & `template-compliance-contract.md:236` (`check-anchors.sh`, `check-section-counts.sh`, `check-template-headers.sh`); `template-composition-system.md:51` (`check-sections.sh`); `template-compliance-contract-enforcement-blocks-non-compliant.md:153,161` & `level-selection-guide.md:167,191` (`check-section-counts.sh`).
**Actual:** none of the four exist under `runtime/cli/rules/`; `ANCHORS_VALID` is a **native** rule (`validator-registry.json` → `native:orchestrator`, enforced at `orchestrator.ts:685,724`).
**Fix:** replace the phantom names with the real enforcement (native node rules or registry-backed scripts).

### F9-01 · Save-flow steps re-index into a retired vector database
`references/workflows/execution-methods.md:234,237` — "Semantic Indexing — Re-index the updated packet docs in the vector database" and "Retry Processing — Process any pending embeddings from retry queue."
**Actual:** `runtime/database/` is empty, there is no vector store, and vector+BM25 fusion is declared gone (`references/memory/memory-system.md:9`). The save flow (`generate-context.js`) does not re-index.
**Fix:** drop or re-scope steps 11/12 to the lexical/packet-docs save flow.

---

## P2 — misleading / cosmetic

- **F2-02** `feature-catalog/feature-flag-reference/runtime-config-contract.md:52-59` documents `memoryDecay`/`importanceTiers.*.decay` as current sections; decay is a declared loss. → collapse into a retired docs-only note.
- **F5-01** `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md:79` lists `check-links.sh` as an orchestrator rule (it isn't registered) and omits several registered rule scripts. → drop the row / point at `validator-registry.json`.
- **F6-01** `references/cli/memory-handback.md:3,16,22` lists `cli-opencode` twice and omits four cli-* modes; the family is six (`cli-external-orchestration/SKILL.md:25-30`). → correct enumeration/count.
- **F6-02** `/doctor` route count and membership disagree across `category-overview.md:27` (5/7 listed), `dispatch.md:19` (7), `README.md:22` (removed two). → one canonical list from the manifest.
- **F6-03** `references/config/environment-variables.md:37` describes `MEMORY_BASE_PATH` as load-bearing while its cited authority `runtime/ENV-REFERENCE.md:138` says it has no effect. → annotate as exported-but-inert.
- **F7-02** `README.md:415,416,417,432` stale module/file counts (core 29, extractors 13, utils 19, references 41 `.md` on disk). → refresh counts.
- **F8-02** `references/templates/level-selection-guide.md:191` references `check-section-counts.sh` (missing) — subsumed by F10-01. See F10-01.
- **F8-03** `references/templates/level-specifications.md:78` names `check-completion.sh` (missing); gate is `validate.sh --strict`/`AC_CLOSURE`. → replace.

---

## Deduplication notes

- **F4-01** (doc-vs-code) and **F6-02** (doc-vs-doc) both concern the `/doctor` route set but cite different doc pairs and different failure modes — kept separate.
- **F8-02** is one instance of the broader **F10-01** phantom-rule-script cluster; F10-01 generalizes it.

## Ruled out (evidence-checked, not findings)

- `doctor-commands` `query.cjs` examples — query types + spec folder still exist (`runtime/scripts/query.cjs:208-217`).
- `epistemic-vectors.md` — conceptual framework, no contradicting runtime path.
- `CANONICAL_SAVE_CUTOFF` — prose ref to a real `SPECKIT_CANONICAL_SAVE_CUTOFF` env var.
- `rename-pattern.md:75` `skill_graph_compiler.py` — exists (verified from repo root).
- `semantic-summarizer`/`semantic-signal-extractor` — live skill-advisor consumer, not vestigial.
- `references/cli`/`references/config` retired-capability framing — already decommission-aware (`daemon-cli-reference.md:39`).
- Retired `memory/*.md` framing in `folder-structure.md`/`template-guide.md`/`sub-folder-versioning.md` — correct.

## References

- Ground-truth docs audited: `.opencode/skills/system-spec-kit/manual-testing-playbook/**`, `feature-catalog/**`, `references/**`.
- Run artifacts: `iterations/iteration-001..010.md`, `deltas/iter-001..010.jsonl`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`.
