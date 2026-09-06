# Iteration 5: references/structure, validation, workflows, config, plus SKILL.md (F5)

## Focus

Hold focus F5: audit `references/structure`, `references/validation`, `references/workflows`, `references/config` claim-by-claim against runtime source, plus `system-spec-kit/SKILL.md` against the `.opencode/commands/speckit/*.md` routers, and pin the broad phantom memory-save test-file cluster. Excludes the pre-supplied already-found/fixed list.

## Findings

### F5-01 — `agent-io-contract.md` cites a non-existent, cross-root, double-slash evidence-validation path (P2 misleading)

**Doc claim (quoted):** `references/workflows/agent-io-contract.md:186` — "the only consumer validates it as a structured object via `validateEvidenceContract(record.evidence)` (`runtime//lib/deep-loop/post-dispatch-validate.ts`)."

**Actual behavior:** The path has a double-slash typo (`runtime//lib`) and cannot resolve from the system-spec-kit root (`runtime/lib/` has no `deep-loop/` subdirectory; it has `config, context, continuity, description, discovery, extraction, graph, hooks, parsing, resume, search, spec, templates, test-helpers, utils, validation`). The real module is `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts` (and `evidence-contract.ts` exports `validateEvidenceContract`); the consumer is a deep-loop module, not a system-spec-kit one.

- Doc: [SOURCE: references/workflows/agent-io-contract.md:186]
- Actual: [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts]; [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/evidence-contract.ts] (also: runtime/tests/unit/evidence-contract.vitest.ts)
- Severity: P2
- One-line fix: change the cited path to `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts` (and fix the `runtime//lib` double slash).

### F5-02 — `spec-folder-write-recipe.md` cites `dist/spec-folder/backfill-graph-metadata.js`; the file lives under `dist/graph/` (P2 misleading)

**Doc claim (quoted):** `references/workflows/spec-folder-write-recipe.md:83` — `node .opencode/skills/system-spec-kit/runtime/cli/dist/spec-folder/backfill-graph-metadata.js --root <folder>`.

**Actual behavior:** `runtime/cli/dist/spec-folder/backfill-graph-metadata.js` does not exist (`dist/spec-folder/` holds `alignment-validator.js`, `directory-setup.js`, `folder-detector.js`, ...). The compiled file is at `runtime/cli/dist/graph/backfill-graph-metadata.js` (source `runtime/cli/graph/backfill-graph-metadata.ts`).

- Doc: [SOURCE: references/workflows/spec-folder-write-recipe.md:83]
- Actual: [SOURCE: runtime/cli/dist/graph/backfill-graph-metadata.js] (exists); [SOURCE: runtime/cli/graph/backfill-graph-metadata.ts] (source). `dist/spec-folder/backfill-graph-metadata.js` does not exist.
- Severity: P2
- One-line fix: change `dist/spec-folder/` to `dist/graph/` in the command.

### F5-03 — `core-workflow-infrastructure.md` runs two phantom vitest files and asserts a retired indexer (P1 wrong/harmful)

**Doc claim (quoted):** `manual-testing-playbook/tooling-and-scripts/core-workflow-infrastructure.md:22,23,36,41` — `npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`, with expected signals "all targeted Vitest suites pass; ... indexing/scoring regressions do not fail."

**Actual behavior:** `tests/memory-indexer-weighting.vitest.ts` and `tests/workflow-e2e.vitest.ts` are absent repo-wide (verified by `find .opencode/skills`) — vitest fails when `--run`/`npx vitest run` names a missing file, so the command cannot complete. `post-save-review.vitest.ts`, `quality-scorer-calibration.vitest.ts`, and `generate-context-cli-authority.vitest.ts` do exist. The "indexing/scoring regressions do not fail" signal also describes a now-retired memory indexer (`runtime/cli/core/workflow.ts:1712-1723` logs `Skipping retired legacy memory indexing`).

- Doc: [SOURCE: manual-testing-playbook/tooling-and-scripts/core-workflow-infrastructure.md:22,23,36,41]
- Actual: [SOURCE: runtime/cli/tests/] (missing: memory-indexer-weighting.vitest.ts, workflow-e2e.vitest.ts); [SOURCE: runtime/cli/core/workflow.ts:1712-1723]
- Severity: P1
- One-line fix: drop the two phantom test files from the vitest command and reword the indexing signal to the live post-save-review / trigger-index freshness checks.

## Sources Consulted

- references/workflows/agent-io-contract.md:186
- references/workflows/spec-folder-write-recipe.md:83
- references/workflows/rename-pattern.md:47,61,75,114,145
- references/workflows/quick-reference.md:172
- references/config/hook-system.md, launcher-lease.md (hook paths all exist)
- references/validation/*, references/structure/* (path/exit-code sweep)
- manual-testing-playbook/tooling-and-scripts/core-workflow-infrastructure.md:22-41
- system-spec-kit/SKILL.md:61,63,129,246-258,408,414,435,459-463,509,523
- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/{post-dispatch-validate.ts,evidence-contract.ts}; runtime/tests/unit/{evidence-contract,post-dispatch-validate}.vitest.ts
- .opencode/skills/system-spec-kit/runtime/cli/{graph/backfill-graph-metadata.ts,dist/graph/backfill-graph-metadata.js,dist/spec-folder/,spec/validate.sh}
- .opencode/commands/speckit/{plan,implement,complete,save,resume,search}.md (all exist)

## Assessment

- newInfoRatio: 1.0
- Novelty justification: F5-01/02/03 are new to this packet. The prior passes corrected the references/validation strict/freshness semantics, the phase-definitions validate.sh path and phantom rule scripts, and the execution-methods save flow, but did NOT flag the agent-io-contract cross-root path, the spec-folder-write-recipe dist/graph location, nor the core-workflow-infrastructure phantom vitest files. No re-report of the already-fixed list.
- Confidence notes: F5-01 confirmed by listing `runtime/lib/` (no `deep-loop/`) and finding the real module under system-deep-loop; F5-02 confirmed by listing `dist/spec-folder/` and finding `dist/graph/backfill-graph-metadata.js`; F5-03 confirmed by repo-wide `find` (two basenames absent). The spec-kit SKILL.md command references (`/speckit:plan|implement|complete|save|resume`, `--intake-only`) all match the existing `.opencode/commands/speckit/*.md`; config hook paths all exist.

## Reflection

- What worked: for path claims under `references/workflows`, checking the target directory listing (not just the file) is what caught `dist/spec-folder/` vs `dist/graph/` — the basename exists, so a naive existence test would have passed.
- What failed: the SKILL.md is largely aligned with the command routers; the residual drift concentrates in the workflow recipe/contract docs and the core-workflow playbook scenario rather than SKILL.md.
- Ruled out: `runtime//lib/deep-loop/post-dispatch-validate.ts`'s function `validateEvidenceContract` IS a real deep-loop symbol (system-deep-loop), so only the path string is wrong — not the function. `references/config` hook/lease paths all exist; `references/validation` and `references/structure` carry the already-fixed strict/freshness/validate.sh/phantom-rule items.

## Recommended Next Focus

Loop complete at 5 iterations (maxIterationsReached). Next best follow-up: produce the deduplicated editing backlog from findings-registry.json (synthesis), and optionally re-run F3-F5 against the remaining phantom memory-save test-file cluster (evidence-marker-lint, handler-memory-save, integration-save-pipeline, quality-loop, save-quality-gate, recovery-hints, session-isolation, session-cached-consumer, preflight) which appears in additional playbook scenarios not yet line-pinned.
