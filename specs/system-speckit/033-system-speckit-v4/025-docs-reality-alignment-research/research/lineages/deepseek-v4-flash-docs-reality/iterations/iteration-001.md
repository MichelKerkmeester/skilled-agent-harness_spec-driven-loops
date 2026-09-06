# Iteration 1: Playbook commands/flags/paths/env-vars that changed or no longer exist (F1)

## Focus

Hold focus F1: find playbook commands, flags, paths, and env-vars that changed or no longer exist after the `scripts/` -> `runtime/cli/` rename and the memory-system decommission. Cross-check every claimed invocation path against the actual runtime tree. This pass swept the manual-testing-playbook and feature-catalog command references and the environment-variables reference.

## Findings

### F1-01 — Ghost path: `runtime/cli/finalize-dist.mjs` (P1 misleading)

**Doc claim (quoted):** `manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md:196` documents the MCP build command as `tsc --build && node runtime/cli/finalize-dist.mjs`.

**Actual behavior:** `runtime/cli/finalize-dist.mjs` does not exist on disk. The real file lives at `runtime/scripts/finalize-dist.mjs` (verified: `runtime/scripts/finalize-dist.mjs` present; `runtime/cli/finalize-dist.mjs` → "No such file or directory"). Running the documented MCP build verbatim thus fails with a module-not-found before any finalize step runs.

- Doc: [SOURCE: manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md:196]
- Actual: [SOURCE: runtime/scripts/finalize-dist.mjs] (exists); [SOURCE: runtime/cli/finalize-dist.mjs] (missing — verified by `ls`)
- Severity: P1
- One-line fix: change the MCP build command to `tsc --build && node runtime/scripts/finalize-dist.mjs`.

## Sources Consulted

- manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md:196
- manual-testing-playbook/doctor-commands/doctor-deep-loop-convergence.md:123,145,148,151
- manual-testing-playbook/tooling-and-scripts/spec-folder-detection-and-description.md:116
- references/config/environment-variables.md (sections 1-8)
- references/cli/memory-handback.md:1-52
- references/memory/memory-system.md, save-workflow.md
- runtime/scripts/finalize-dist.mjs; runtime/cli/spec/validate.sh; runtime/cli/dist/continuity/generate-context.js
- runtime/ENV-REFERENCE.md:117-138,220-270
- runtime/lib/validation/orchestrator.ts:984-998,1100-1104

## Assessment

- newInfoRatio: 1.0
- Novelty justification: First F1 pass; the ghost-path finding is new to this packet (no prior doc-vs-code inventory exists).
- Confidence notes: F1-01 is confirmed by direct filesystem checks (both the doc line and the missing/real path). Additional candidates surfaced for later passes: the `--strict` "warnings exit as validation errors" claim in `references/validation/validation-rules.md:44` (belongs to F3), and the `cli-* sibling` enumeration in `memory-handback.md:12` listing `cli-opencode` twice (belongs to F6/F7).

## Reflection

- What worked: scripts/ -> runtime/cli/ rename is mostly clean in the memory docs (they already cite `runtime/cli/dist/continuity/generate-context.js`, `runtime/cli/continuity/generate-context.ts`); the surviving drift is in shell/build command paths.
- What failed: the memory-system doc trail is already largely re-pointed, so F1 yields few hits in the memory docs; the stronger drift concentrates in validation and playbook command strings.
- Ruled out: `doctor-deep-loop-convergence.md` query.cjs examples — query types `coverage_gaps`/`uncovered_questions`/`unverified_claims` still exist (verified) and the referenced spec folder still exists, so not stale.

## Recommended Next Focus

[F2] catalog entries describing retired capabilities (semantic search, embeddings, MCP memory tools, causal graph, decay) as live — the `references/memory/**`, `references/cli/memory-handback.md`, and `feature-catalog` memory/indexing entries are the prime suspects.
