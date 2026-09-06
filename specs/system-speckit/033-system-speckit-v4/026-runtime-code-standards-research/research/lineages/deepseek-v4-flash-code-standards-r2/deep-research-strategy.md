---
title: Deep Research Strategy - Code Standards Audit (r2)
description: Lineage-local strategy for the read-only system-spec-kit code-standards audit, second-generation lineage targeting the priority surfaces. 5 iterations, one focus angle each.
trigger_phrases:
  - "system-spec-kit code standards audit r2"
  - "sk-code deviation inventory r2"
importance_tier: planning
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Code Standards Audit (deepseek-v4-flash-code-standards-r2)

## 1. OVERVIEW

Read-only, evidence-based audit of `.opencode/skills/system-spec-kit/shared/**` and `.opencode/skills/system-spec-kit/runtime/**` (excluding node_modules/ and dist/) against this repo's code standards (sk-code-opencode, sk-code-quality, universal code-quality-standards). This is the r2 lineage: it takes the priority surfaces left by the two prior passes, one focus angle per iteration over exactly 5 iterations (config.maxIterations, stopPolicy max-iterations). Output is a citation-complete deviation inventory feeding a remediation packet. No edits.

## 2. TOPIC

Read-only, evidence-based audit of system-spec-kit code against this repo's code standards. Priority surface per iteration; the generic angle rotations 1-8 are superseded by the priority surface plan in each iteration's Focus.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Do runtime/cli/core and runtime/cli/extractors (TypeScript) contain error-handling defects, dead/duplicate exports, naming deviations, or coverage-floor gaps?
- [x] Q2: Do runtime/cli/spec-folder, continuity, graph, templates and utils (TypeScript) hold boundary/naming/coverage deviations and duplicated helpers?
- [x] Q3: Do runtime/cli/rules/*.sh and runtime/cli/spec/*.sh satisfy the shell standards (exit codes, quoting, sourcing, documented vs parsed flags, dead helpers)?
- [x] Q4: Do runtime/hooks/lib, runtime/hooks/pi and the spec-gate .mjs adapters keep runtime parity, correct path handling, and hook conventions across runtimes?
- [x] Q5: Does shared/** beyond config/gate-3-classifier/frontmatter/path-containment hold dead code, boundary breaks, or coverage-floor gaps?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No code edits; audit only.
- No auditing sk-code or other skills' code.
- No proposing abstractions beyond a cited standard; no asserting unstated intent.
- Do not re-report any item in the "ALREADY FOUND AND FIXED BY TWO PRIOR PASSES" list supplied by the orchestrator.
- No verifying the repo's own tooling (validate.sh, generate-context.js) during this lineage; findings are produced by reading source.

---

## 5. STOP CONDITIONS
- Fixed 5-iteration cap reached (`maxIterations=5`, stopPolicy `max-iterations`).
- Terminal synthesis record carries `stopReason: maxIterationsReached`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Q1 (Iteration 1) — P1 duplicate-named `scoreMemoryQuality` across core/ and extractors/ (legacy live only via tests); P2 retired type-only `memory-indexer.ts`; P2 redundant `session-activity-signal.ts` shim. Naming negatives: snake_case usages all contract/domain-mapped; no `any`, no empty `catch {}`, no off-contract `process.exit`, no `console.log` in these two dirs.
- [x] Q2 (Iteration 2) — P1 duplicate `resolveRepoRoot()` in graph/ (byte-identical) plus divergent continuity/ constant-anchored resolvers (4 local root resolvers in cli); P1 `fact-coercion.ts` live public coercion surface with no focused test. Boundary/naming negatives: no dist import, no snake_case declarations, clean @spec-kit/shared reuse.
- [x] Q3 (Iteration 3) — P2 dead `log_suggest()` in progressive-validate.sh:172; P2 inconsistent standalone-entry / misdocumented `# Exit codes: 0` across rules family. Baseline conforming: all 42 scripts set -euo pipefail, source paths quoted, no off-contract bash exit.
- [x] Q4 (Iteration 4) — P1 cursor+devin `spec-gate-classify.mjs` duplicate the shared `readStdin`/`parseJsonFailOpen` helpers that claude/codex classify import; P2 cursor classify documented dormant with divergent output contract. Fail-open catches in spec-gate-core are documented, not silent.
- [x] Q5 (Iteration 5) — P2 vestigial `__ollamaProviderTestables`/`__secretScrubberTestables` (no test consumer); P2 non-co-located ranking tests with transitively-only matrix-math coverage. Embeddings providers + IPC are live and correctly layered (ruled out residue).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- A named-export census across the two `quality-scorer.ts` modules exposed the `scoreMemoryQuality` name collision that per-file reads hide (Iteration 1).
- Repo-wide import grep for a symbol decides "dead export" quickly — `memory-indexer.ts` types and `extractors/session-activity-signal.ts` both returned zero consumers (Iteration 1).
- Byte-comparing the two graph/ root resolvers made the copy-paste duplication unambiguous (Iteration 2).
- Grepping shared/, runtime/lib, runtime/api for a canonical repo-root util proved one does not exist before flagging the duplication (Iteration 2).
- Diffing the four runtime `spec-gate-classify.mjs` adapters exposed which reuse the shared stdin/parse helper and which reinstate it inline (Iteration 4).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The snake_case scan produced many false-positive hits; nearly all are contract/domain-mapped (reason codes, memory-metadata field names), so they are not findings (Iteration 1).
- The coverage-floor half of the core/extractors angle was largely a confirming pass — most public surfaces here are already referenced by tests (Iteration 1).
- The "dead helper" heuristic flagged `run_check` in every rules file, but it is the loader-contract entry point, not dead code — a false positive (Iteration 3).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- **Blanket snake_case scan in core/ and extractors/ — BLOCKED (iteration 1):** returns only contract/domain-mapped keys; not usable as a naming-deviation detector for this subsystem.
- **Boundary-import grep in spec-folder/continuity/graph/templates/utils — BLOCKED (iteration 2):** only package-alias boundary-compliant imports; no dist/ import found. Boundary angle largely exhausted for these dirs.
- **Strict-mode / source-quote / exit-code census over rules+spec — PRODUCTIVE (iteration 3):** confirming negative; the baseline is clean. Remaining work in the shell angle is only the two P2s found.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treating `core/quality-scorer.ts` snake_case dimension keys as a naming violation — they are trigger-phrase reason codes / memory-metadata field names under the documented snake_case exception (Iteration 1).
- Treating the `@spec-kit/runtime/api` and `@spec-kit/shared/*` imports in spec-folder/continuity/utils as a boundary break — they are package-alias boundary-compliant (Iteration 2).
- Treating `run_check` (defined, never locally called) as dead code — it is the loader-contract entry point (Iteration 3).
- Treating the `rc=20/21` Node subprocess codes in check-graph-metadata-child-drift.sh as a shell exit-code deviation — documented internal contract (Iteration 3).
- Treating the `catch (_) {}` blocks in spec-gate-core.mjs as swallowed errors — each is a documented fail-open path (Iteration 4).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: (populated per iteration)
- Pivot lineage: none yet
- Remaining frontier: single-executor lineage; no divergent pivots recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- (populated per iteration)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Loop complete (max-iterations reached at 5). Synthesized the 11-finding inventory into `research.md` and `synthesis-v1.md`; terminal record carries `stopReason: maxIterationsReached`. No further iterations scheduled.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot
- **Scope code paths:** `.opencode/skills/system-spec-kit/shared/**`; `.opencode/skills/system-spec-kit/runtime/**` excluding `node_modules/` and `dist/`.
- **Standards in force:** TS module-header (`// MODULE:`), numbered section dividers, TS naming (`camelCase` functions, `PascalCase` interfaces/types, `kebab-case` files, snake_case only for DB/domain-mapped); Shell shebang + header + `set -euo pipefail`; universal P0 (no silent failures, no commented-out code, no ephemeral-artifact pointers), P1 (test coverage happy-path + edge, error message quality, resource cleanup, type-safety).
- **Two prior lineages already inventoried a broad deviation set** and the corresponding fixes are on disk (see orchestrator "ALREADY FOUND AND FIXED" list). This lineage targets only the priority surfaces below and must not re-report fixed items.
- **Existing boundary contract:** `runtime/lib/MODULE-MAP.md`; `runtime/cli/tests/import-policy-rules.vitest.ts`.
- **resource-map.md:** not present at init; coverage gate skipped.

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 3 (telemetry only under max-iterations stopPolicy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-09-06T12:00:00.000Z
- Directed write surface: `specs/system-speckit/033-system-speckit-v4/026-runtime-code-standards-research/research/lineages/deepseek-v4-flash-code-standards-r2`
