# Iteration 2: feature-catalog/retrieval, memory-quality-and-indexing, ux-hooks, tooling-and-scripts (F2)

## Focus

Hold focus F2: audit the not-yet-cited feature-catalog entries — `feature-catalog/retrieval/session-recovery-spec-kit-resume.md`, `feature-catalog/memory-quality-and-indexing/*`, `feature-catalog/ux-hooks/*`, and the not-yet-cited `feature-catalog/tooling-and-scripts/*` — hunting retired-capability framing (vector/semantic/embedding/MCP-memory still described as live) plus path/flag drift. Excludes the pre-supplied already-found/fixed list.

## Findings

### F2-01 — Post-save review step placement & retired indexing framing (P1 wrong/harmful)

**Doc claim (quoted):** `feature-catalog/memory-quality-and-indexing/post-save-quality-review.md:19` and `:27`: the review "runs after canonical packet continuity is written (Step 10.5 in the save workflow) and before indexing starts (Step 11)"; and `:64-65`: "Runs before `indexMemoryFile()` embeds and persists the entry" / "The save always proceeds to indexing."

**Actual behavior:** `runtime/cli/core/workflow.ts:1712-1723` runs "Step 11: Semantic memory indexing" but logs `Skipping retired legacy memory indexing` and sets `memoryId = null` (the field is "Always null: this workflow no longer indexes", `:449`). The post-save review actually runs at **Step 11.75** (`workflow.ts:1741`, invoked at `:1744-1753` via `reviewPostSaveQuality`) — i.e. AFTER Step 11, not before it. `indexMemoryFile()` exists nowhere in live runtime code (only as a fixture string in `runtime/cli/tests/fixtures/manual-playbook-fixture.{js,ts}`), and `runtime/cli/core/post-save-review.ts` never references indexing (only `indexOf`/`findIndex` loop indices).

- Doc: [SOURCE: feature-catalog/memory-quality-and-indexing/post-save-quality-review.md:19,27,64-65]
- Actual: [SOURCE: runtime/cli/core/workflow.ts:1712-1723,1741,1744-1753,449]; [SOURCE: runtime/cli/core/post-save-review.ts] (no index reference)
- Severity: P1
- One-line fix: re-frame the review as running at Step 11.75 after the (retired/skipped) index step and after file write, and drop the "before indexing begins" / "proceeds to indexing" / `indexMemoryFile()` language.

### F2-02 — Phantom `workflow-e2e.vitest.ts` test file (P2 misleading)

**Doc claim (quoted):** `post-save-quality-review.md:98` lists `runtime/cli/tests/workflow-e2e.vitest.ts` as "End-to-end coverage of Step 10.5 placement within the save workflow."

**Actual behavior:** `runtime/cli/tests/workflow-e2e.vitest.ts` does not exist. The workflow test directory holds `workflow-canonical-save-metadata.vitest.ts`, `workflow-invariance.vitest.ts`, `workflow-step115-daemon-guard.vitest.ts`, `workflow-trigger-index-freshness.vitest.ts`, `workflow-session-id.vitest.ts`, `workflow-save-secret-scrub.vitest.ts` — none named `workflow-e2e`.

- Doc: [SOURCE: feature-catalog/memory-quality-and-indexing/post-save-quality-review.md:98]
- Actual: [SOURCE: runtime/cli/tests/workflow-e2e.vitest.ts] (missing; verified by `find`); the real suite is [SOURCE: runtime/cli/tests/workflow-*.vitest.ts]
- Severity: P2
- One-line fix: point at the actual workflow test file(s) (e.g. `workflow-canonical-save-metadata.vitest.ts`) or drop the row.

### F2-03 — Phantom post-save-review cross-references (P2 misleading)

**Doc claim (quoted):** `post-save-quality-review.md:80-81` cross-references "the pre-storage quality gate (entry `05-pre-storage-quality-gate.md`)" and "the verify-fix-verify memory quality loop (entry `01-verify-fix-verify-memory-quality-loop.md`)."

**Actual behavior:** Neither `05-pre-storage-quality-gate.md` nor `01-verify-fix-verify-memory-quality-loop.md` exists anywhere in the system-spec-kit tree (verified by filesystem find under the skill root). The named companion entries are phantom.

- Doc: [SOURCE: feature-catalog/memory-quality-and-indexing/post-save-quality-review.md:80-81]
- Actual: [SOURCE: no file `05-pre-storage-quality-gate.md` nor `01-verify-fix-verify-memory-quality-loop.md` under .opencode/skills/system-spec-kit/]
- Severity: P2
- One-line fix: drop both phantom companion-entry references or rename them to real companion docs.

### F2-04 — Phantom `runtime/handlers/memory-save.ts` save-path handler (P2 misleading)

**Doc claim (quoted):** `feature-catalog/memory-quality-and-indexing/spec-doc-structure-validator.md:46` lists `runtime/handlers/memory-save.ts` as the "Handler" that is the "Save-path integration that invokes the validator before storage."

**Actual behavior:** `runtime/handlers/memory-save.ts` does not exist. `runtime/handlers/` contains only `README.md`, `save/`, and `spec-doc-discovery.ts`. The validator is in fact exposed as a registered rule (`runtime/cli/lib/validator-registry.json` → `script_path: "ts:spec-doc-structure"`) and run through `runtime/cli/spec/validate.sh`, not through a memory-save handler (the memory save path was decommissioned).

- Doc: [SOURCE: feature-catalog/memory-quality-and-indexing/spec-doc-structure-validator.md:46]
- Actual: [SOURCE: runtime/handlers/] (no `memory-save.ts`); the validator runs via [SOURCE: runtime/cli/lib/validator-registry.json:117,127,138,149,160] and [SOURCE: runtime/cli/spec/validate.sh]
- Severity: P2
- One-line fix: replace the handler row with the real exposure (validator-registry / validate.sh integration), or drop the memory-save.ts row.

## Sources Consulted

- feature-catalog/memory-quality-and-indexing/post-save-quality-review.md:1-101
- feature-catalog/memory-quality-and-indexing/spec-doc-structure-validator.md:46,111-116
- feature-catalog/retrieval/session-recovery-spec-kit-resume.md (full)
- feature-catalog/ux-hooks/directive-lifecycle-dedup.md, goal-opencode-plugin.md (full)
- runtime/cli/core/workflow.ts:449,1649-1650,1703,1712-1723,1741-1770
- runtime/cli/core/post-save-review.ts (no index reference)
- runtime/cli/lib/validator-registry.json:117-160
- runtime/cli/tests/workflow-*.vitest.ts (real suite names)
- runtime/handlers/ (README.md, save/, spec-doc-discovery.ts)
- runtime/cli/retrieval/{lookup-trigger-index.mjs,generate-trigger-index.mjs,measure-cold-lookup.mjs}
- runtime/cli/continuity/generate-context.ts; runtime/cli/dist/continuity/generate-context.js
- .opencode/skills/system-skill-advisor/hooks/** (directive-lifecycle), .opencode/plugins/opencode-goal.js, .opencode/commands/goal-opencode.md

## Assessment

- newInfoRatio: 1.0
- Novelty justification: F2-01/02/03/04 are new to this packet. The prior passes corrected the save-flow vector re-index (references/workflows/execution-methods.md) and the description-discovery vector claim, but did NOT flag the post-save-quality-review step-placement/indexing framing, its phantom test/cross-references, nor the spec-doc-structure-validator memory-save.ts handler. No re-report of the already-fixed list.
- Confidence notes: F2-01 confirmed by reading workflow.ts steps and confirming `indexMemoryFile` is absent from live code; F2-02/F2-03 confirmed by direct `find` (no match); F2-04 confirmed by listing `runtime/handlers/`. The ux-hooks doc and the retrieval/session-recovery doc were verified accurate against their cited paths (all exist).

## Reflection

- What worked: reading the actual save workflow step sequence (rather than trusting the doc's stated step number) and confirming `indexMemoryFile`/`writeMemoryFile` do not exist in live code — the strongest signal that the memory-indexing framing is retired.
- What failed: two candidate "phantom" paths (`runtime/cli/lib/validator-registry.js`, `runtime/cli/scripts-registry.js`) turned out to be false positives — the docs actually cite `.json`, which exists. Avoid regex that lets `.js` match the `.json` prefix.
- Ruled out: session-recovery-spec-kit-resume.md — all cited runtime paths exist (`lookup-trigger-index.mjs`, `generate-trigger-index.mjs`, `measure-cold-lookup.mjs`, `continuity/generate-context.ts`, `manual-playbook-runner.vitest.ts`); the `_memory.continuity` ladder matches `resume.md`/`resume-ladder`. directive-lifecycle-dedup and goal-opencode-plugin — all cited implementation/test paths exist.

## Recommended Next Focus

[F3] manual-testing-playbook/doctor-commands, feature-flag-reference, governance — playbook scenario paths/commands and feature-flag contract claims against `_routes.yaml`, `validate.sh`, and `runtime-config-contract`.
