# Iteration 4: manual-testing-playbook/memory-quality-and-indexing, tooling-and-scripts, retrieval (F4)

## Focus

Hold focus F4: drive the playbook scenarios (not just source-file reference lists) for `manual-testing-playbook/memory-quality-and-indexing/**`, `tooling-and-scripts/**`, and `retrieval/**` against the runtime, to find scenarios that cannot run verbatim today or that assert retired save/index behavior. Excludes the pre-supplied already-found/fixed list.

## Findings

### F4-01 — Playbook commands reference five non-existent test files (P1 wrong/harmful)

**Doc claim (quoted):** `manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality.md:82` runs `npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/opencode-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts ... tests/memory-render-fixture.vitest.ts ...`; `:85` runs `npx vitest run tests/test-integration.vitest.ts tests/workflow-e2e.vitest.ts`; `:87` runs `npm test -- --run tests/workflow-e2e.vitest.ts ...`.

**Actual behavior:** Five of the named files do not exist anywhere in the repo (verified by `find .opencode/skills -name '*.vitest.ts'` across the whole skills tree): `tests/claude-code-capture.vitest.ts`, `tests/opencode-cli-capture.vitest.ts`, `tests/copilot-cli-capture.vitest.ts`, `tests/memory-render-fixture.vitest.ts`, `tests/workflow-e2e.vitest.ts`. Vitest fails when `--run` names a missing test file, so this scenario's js-verification suite cannot complete verbatim. (`spec-affinity`, `quality-scorer-calibration`, `runtime-memory-inputs`, `session-enrichment`, `task-enrichment`, `memory-sufficiency`, `memory-template-contract`, `test-integration`, `contamination-filter`, `generate-context-cli-authority` all exist; only the five are absent.)

- Doc: [SOURCE: manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality.md:82,85,87]
- Actual: [SOURCE: runtime/cli/tests/] (missing: claude-code-capture.vitest.ts, opencode-cli-capture.vitest.ts, copilot-cli-capture.vitest.ts, memory-render-fixture.vitest.ts, workflow-e2e.vitest.ts — absent repo-wide)
- Severity: P1
- One-line fix: replace the five phantom test-file names with the real suite files that exercise those lanes (or drop them), so the `npm test -- --run ...` and `npx vitest run ...` commands execute.

### F4-02 — Expected signal "Indexing succeeds" / "indexes successfully" contradicts the retired index step (P2 misleading)

**Doc claim (quoted):** `manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality.md:22,25` ("Indexing succeeds when validation passes"), `:27,142` ("`M-007a` validates and indexes successfully"), and `:130` ("Indexing succeeds when validation passes").

**Actual behavior:** The save workflow's Step 11 is "Semantic memory indexing", but `runtime/cli/core/workflow.ts:1712-1723` logs `Skipping retired legacy memory indexing` and sets `memoryId = null` (`:449`, "Always null: this workflow no longer indexes"). There is no live save-time memory index to "succeed". The expected signal and the M-007a pass condition therefore describe a save→index step that no longer exists; only the lexical trigger-index freshness check remains (workflow.ts:1725-1740).

- Doc: [SOURCE: manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality.md:22,25,27,130,142]
- Actual: [SOURCE: runtime/cli/core/workflow.ts:1712-1723,449]
- Severity: P2
- One-line fix: reword the signal/pass-condition to the trigger-index freshness check (or the canonical-spec-doc save landing) rather than "indexing succeeds".

## Sources Consulted

- manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality.md:22-142
- manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md:55,115-116
- manual-testing-playbook/memory-quality-and-indexing/post-save-quality-review.md (full; cross-ref only)
- manual-testing-playbook/memory-quality-and-indexing/spec-doc-structure-validator-and-continuity-frontmatter.md (full)
- manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md (full)
- runtime/cli/core/workflow.ts:449,1703,1712-1740
- runtime/cli/tests/ (real suite inventory)
- .opencode/skills/system-spec-kit/shared/embeddings/ (exists); shared/README.md; ARCHITECTURE.md:156 (advisor-owned embedding store, not spec-kit memory index)
- .opencode/skills/system-spec-kit/runtime/cli/tests/memory-pipeline-regressions.vitest.ts (exists)

## Assessment

- newInfoRatio: 1.0
- Novelty justification: F4-01/F4-02 are new to this packet. The prior passes fixed the finalize-dist path and the dist-freshness-guard package count (both in session-capturing-pipeline-quality-coverage.md), but did NOT flag the five phantom capture/test files in session-capturing-pipeline-quality.md nor its "Indexing succeeds" framing. No re-report of the already-fixed list.
- Confidence notes: F4-01 confirmed by repo-wide `find` (five basenames absent everywhere) plus presence check of the ten existing suite files. F4-02 confirmed by reading workflow.ts Step 11 (`Skipping retired legacy memory indexing`) and `memoryId` null. The memory-quality-and-indexing playbook post-save-review scenario and the retrieval playbook scenario are accurate (they only cross-reference the feature-catalog, which carried the F2 issues).

## Reflection

- What worked: treating the playbook's TEST EXECUTION Commands blocks as verbatim commands and checking every `tests/*.vitest.ts` they name against the actual suite — a phantom test file is a hard verbatim-run break, far more actionable than a prose mismatch.
- What failed: a naive existence base of `runtime/cli/tests/` over-flags files that live under `runtime/tests/` or `system-skill-advisor/mcp-server/tests/` (e.g. directive-lifecycle-adapter-parity, system-skill-advisor-plugin, user-prompt-submit-shim); a repo-wide `find` is required before declaring a file phantom.
- Ruled out: the memory-quality-and-indexing playbook post-save-review and spec-doc-structure-validator scenarios — they only cross-reference the feature-catalog (whose stale framing is already captured as F2-01/F2-04); the retrieval playbook scenario matches the resume runtime. A broader phantom cluster (evidence-marker-lint, handler-memory-save, memory-indexer-weighting, integration-save-pipeline, quality-loop, save-quality-gate, recovery-hints, session-isolation, session-cached-consumer, preflight) appears across core-workflow-infrastructure.md and related scenarios, but locating each exact doc line would need a follow-up pass; recorded here as an open cluster, not a single finding.

## Recommended Next Focus

[F5] references/structure, references/validation, references/workflows, references/config, claim-by-claim against runtime source, plus SKILL.md against .opencode/commands/speckit — and, in the same pass, pin the exact doc lines for the broader phantom memory-save test-file cluster in core-workflow-infrastructure.md.
