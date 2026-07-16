# Iteration 002 — Coupling Count + system-spec-kit Tooling-Borrow Depth Math

**Lineage:** glm52-3 | **Iteration:** 2 of 5 | **Focus:** Q2 coupling count + Q3 tooling-borrow depth math + REQ-003 coverage-hole risk
**Date:** 2026-07-08

## Focus

Complete Q2 (full coupling count + mechanism uniformity) and Q3 (post-merge tooling-borrow arithmetic + the system-spec-kit test:council include-glob risk that REQ-003 depends on).

## Findings

### F2.1 — Reverse-direction coupling is 41 grep hits but only ~12 CODE sites; full count dominated by test fixtures/comments

`rg deep-loop-runtime` in deep-loop-workflows `.cjs`/`.ts` (excluding .md) = 41 hits. Decomposed:
- **~12 real relative-require/path sites** (mechanism D from iter 1, uniform 3→2 / 4→3 hop-reduce+rename): orchestrate-session.cjs, orchestrate-topic.cjs, reduce-state.cjs x2, runtime-capabilities.cjs x2, improvement reduce-state/improvement-journal, + 6 council test files. [SOURCE: iter-001 enumeration]
- **1 ABSOLUTE shell-out site MISSED by iter 1's "uniform" claim:** `deep-ai-council/scripts/replay-graph-from-artifacts.cjs:26` runs `node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --loop-type council`. This is a workspace-absolute string (class A in the reverse direction), NOT a relative require — needs skill-name+path segment replace (`deep-loop-runtime` → `system-deep-loop/runtime`), ZERO hop change. **CORRECTION to iter-001 F1.2: mechanism A (absolute-string) is NOT forward-only; it appears once in reverse.** [SOURCE: deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:26]
- **~28 comment banners + test-fixture string literals:** e.g. `findings-registry.vitest.ts:43` `claim: 'Extend deep-loop-runtime with council primitives'`, `persist-artifacts.vitest.ts:60,93,117` `expect(...).toContain('Extend deep-loop-runtime')`, `integration-deep-mode-e2e.vitest.ts:222` `verdictFor('extend-deep-loop-runtime',0.90)`, `orchestrate-topic.vitest.ts:28,131` `recommended_option:'extend-deep-loop-runtime'`. These assert council RECOMMENDATION TEXT, not path coupling — they need SEMANTIC review (does the council still recommend "extend deep-loop-runtime" or now "extend system-deep-loop/runtime"?), NOT mechanical path rewrite. [SOURCE: rg exceptions output]

**Implication for child 003:** a `grep | sed` rename would corrupt the ~28 test-assertion strings into semantically-wrong text (a test asserting `.toContain('Extend deep-loop-runtime')` would pass vacuously after rename to 'Extend system-deep-loop/runtime' but the underlying council playbook text it mirrors may NOT have been renamed). Field-scoped replace on code/paths only, separate semantic review for assertion strings.

### F2.2 — REQ-003 system-spec-kit edit surface is ~9 sites across 5 files, NOT the "4 edits" the plan scopes

This is a concrete plan revision. The spec.md:133 risk says "Child 002 explicitly owns these 4 edits (2 in runtime, 2 in system-spec-kit)." The real system-spec-kit surface is larger:

1. **`system-spec-kit/mcp_server/vitest.config.ts:20`** — `'../deep-loop-runtime/tests/**/*.{vitest,test}.ts'` glob. From mcp_server/, post-merge needs `'../../system-deep-loop/runtime/tests/**/*.{vitest,test}.ts'` (+1 hop + rename + re-path). [SOURCE: vitest.config.ts:20]
2. **`system-spec-kit/mcp_server/package.json:31`** `test:council` script — TWO explicit relative paths: `../../deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` and `council-graph-value-scenarios.vitest.ts`. Both break identically (+1 hop + rename). [SOURCE: package.json:31]
3. **`system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:12,28,30,64`** — `DEEP_LOOP_RUNTIME_TEST_ROOT = join(WORKSPACE_ROOT,'.opencode/skills/deep-loop-runtime/tests')` + regex patterns matching `.opencode/skills/deep-loop-runtime/tests`. Workspace-absolute → skill-name segment replace (`deep-loop-runtime` → `system-deep-loop/runtime`). 4 edit lines. [SOURCE: council-playbook-anchor-integrity.vitest.ts:12,28,30,64]
4. **`system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:9`** — `import {acquireLoopLock} from '../../../deep-loop-runtime/lib/deep-loop/loop-lock.js'` — relative require, +1 hop + rename. [SOURCE: memory-runtime-retention.vitest.ts:9]
5. **`system-spec-kit/scripts/tests/deep-review-auto-restart-contract.vitest.ts:19`** — `readWorkspaceFile('.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs')` — workspace-absolute string. [SOURCE: deep-review-auto-restart-contract.vitest.ts:19]

**Total: ≥9 edit sites across 5 files in system-spec-kit alone, plus the 2 in runtime (artifact-root.cjs + the runtime side of the test discovery).** The "4 edits" scope undercounts by ~2x. If child 002 lands only 4, test:council silently loses coverage of council-graph-script + council-graph-value-scenarios + council-playbook-anchor-integrity (the loud REQ-003 acceptance gate would still pass on its explicitly-named subset, masking the glob loss). **Mitigation: child 002 must enumerate ALL 9+ sites in a checklist, and REQ-003's acceptance should assert `test:council` run COUNT matches pre-merge, not just "passes green."**

### F2.3 — Q3 tooling-borrow: net NEUTRAL, not simplification; logic-borrow (not node_modules-borrow) is all that remains

`deep-loop-runtime/package.json` self-describes as "Self-contained dependency root so lib and scripts resolve zod, better-sqlite3, and the tsx loader from this skill rather than reaching into a sibling skill's node_modules." Runtime HAS its own node_modules + package.json (zod 4.x, tsx, vitest). [SOURCE: deep-loop-runtime/package.json:4,16] **This means the glm52-1-noted "8+ node_modules reach-ins into system-spec-kit" is STALE** — that decoupling already shipped.

The ONLY surviving tooling-borrow is `artifact-root.cjs`'s LOGIC borrow: `resolveArtifactRoot`'s single implementation lives in `system-spec-kit/shared/review-research-paths.cjs`, re-exported via the runtime seam. [SOURCE: artifact-root.cjs:18; lib/deep-loop/README.md:33]. Post-merge arithmetic:
- Pre: `deep-loop-runtime/lib/deep-loop/` → `../../../system-spec-kit/` (3 hops to `.opencode/skills/`)
- Post: `system-deep-loop/runtime/lib/deep-loop/` → `../../../../system-spec-kit/` (needs +1 hop = 4 hops)

**Verdict on Q3:** the merge does NOT simplify the tooling-borrow (still exactly 1 relative logic-seam, now at +1 hop), and does NOT add net risk (same 1 edit). The "genuine decoupling is a follow-up hardening" stance (spec.md:84) is CORRECT — moving review-research-paths.cjs into system-deep-loop is out of scope and would just relocate the duplication risk. **Recommendation: keep the borrow, fix the +1 hop, and document the single seam explicitly in runtime/lib/deep-loop/README.md so it's greppable for the future decoupling task.**

## Ruled Out

- **Ruled out:** "mechanism A (absolute-string) is forward-only." Iter-002 F2.1 found 1 reverse-direction absolute shell-out (replay-graph-from-artifacts.cjs:26). Iter-001 F1.2 corrected.
- **Ruled out:** "the tooling-borrow is net risk transfer." It's net neutral — the node_modules borrow already shipped; only the logic seam remains, at +1 hop.
- **Ruled out:** "4 system-spec-kit edits suffice for REQ-003." Real surface is ~9 sites / 5 files.

## Novelty Assessment

newInfoRatio: 0.70 — Partially-new + significant plan revision. The test:council overcount (4→9) and the stale node_modules-borrow claim are net-new corrections. The replay-graph-from-artifacts reverse-absolute site revises iter-001. Lower than iter-1 because structural mechanism framework already established.

## Sources

- [SOURCE: rg deep-loop-runtime in deep-loop-workflows *.cjs/*.ts = 41 hits]
- [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:26]
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:20]
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:31]
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:12,28,30,64]
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:9]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/deep-review-auto-restart-contract.vitest.ts:19]
- [SOURCE: .opencode/skills/deep-loop-runtime/package.json:4,16]
- [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:84,133]
