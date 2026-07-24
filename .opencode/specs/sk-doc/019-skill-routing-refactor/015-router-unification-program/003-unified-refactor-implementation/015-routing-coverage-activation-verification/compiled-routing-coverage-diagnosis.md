# Compiled-Routing Coverage Diagnosis & Resolution Plan
_Worktree: `.worktrees/0089-sk-doc-default-routing-cutover` (branch `sk-doc/0089-default-routing-cutover`). Nothing flipped/committed; `DEFAULT_ON_HUBS = new Set()` both resolvers; frozen scorer INTACT._

## The decisive finding (verified)
The compiled-routing **mechanism** works and is byte-identical to legacy (flag-off = nothing; on covered prompts = matches). But **compiled routing COVERAGE was only built out for some hubs, not all.** The program's own flip gate is `compiled-serving = compiled==legacy on EVERY scenario`; **no hub meets it today** — not because the router is broken, but because thin hubs *defer* most real prompts.

Two earlier reads were wrong and are corrected here: it is NOT a harness artifact (real divergence exists), and it is NOT "all 7 uniformly drift" (coverage varies hugely).

## Verified per-hub parity (SPECKIT_COMPILED_ROUTING=1, route-gold on, real run)
| Hub | match | safe-defer | UNSAFE-misroute | rgFail | stale | Verdict |
|---|---|---|---|---|---|---|
| sk-design | 36 | 0 | **1** (TV-003) | 1 | – | production-grade coverage; 1 over-detect bug |
| sk-code | 3 | 19 | 0 | 1 | – | thin coverage — defers most |
| cli-external-orchestration | 3 | 0 | 0 | 5 | – | thin |
| mcp-tooling | 1 | 8 | **1** (MT-008) | 4 | – | thin + 1 over-detect bug (fails gold) |
| sk-prompt | 0 | 0 | 0 | 5 | – | thin |
| sk-doc | – | – | – | – | **stale** | manifest stale → unevaluable until re-mint |
| system-deep-loop | – | – | – | – | **stale** | manifest stale → unevaluable until re-mint |

- **safe-defer** = compiled defers, legacy routes → falls back to legacy → byte-identical OUTCOME (SAFE).
- **UNSAFE-misroute** = compiled routes to a target legacy does not (byte-identity violation). Only 2 exist:
  - sk-design **TV-003**: compiled `[interface,foundations]` vs legacy `[interface]` (both gold-pass).
  - mcp-tooling **MT-008**: compiled `[md-generator,mcp-refero]` vs legacy `[mcp-refero]` (compiled FAILS gold).

## Root causes (5)
1. **Uneven coverage.** sk-design compiler = 562 lines (rich detectors, 36 matches); sk-code = 316 lines (thin, 3 matches). Runtime snapshot is `fixtures/canary-cases.v1.json` (sk-code = 5 routing cases, `policy:{}`). Coverage was built out for sk-design, left thin elsewhere.
2. **2 over-detection bugs** (sk-design TV-003, mcp-tooling MT-008) — compiled adds a 2nd target legacy doesn't.
3. **2 stale manifests** (sk-doc gen5, system-deep-loop gen3) — authored inputs drifted after mint; freshness = manifest `{gen,effectivePolicyHash}` must equal `compileCanonicalParent(current inputs)`. **No refresh tool exists** — `mint` is create-if-absent only (`.opencode/bin/lib/compiled-route-manifest.cjs`). Refresh = write current `{gen+1, hash}`.
4. **`defer` contract inconsistency.** Engine (`compiled-route.cjs`) intends defer = "fall back to legacy"; but `sk-code/SKILL.md:56` maps `defer`→"disambiguate" (only the `{servingAuthority:legacy}` sentinel/errors → registry routing). Until fixed, safe-defer is not provably byte-identical.
5. **Harness bar mismatch.** `compiled-routing-parity.cjs` blocks on `defer≠route` (compiled DECISION), not effective routing. Correct bar = block only on UNSAFE-misroute. Valid ONLY after #4. (`qualifiedIdToLeaf` bridge in `sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` is editable, not frozen.)

## Key files
- Cohort (persist flip): `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:26` (+ authored twin under `.../007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs`; sync via `.opencode/bin/compiled-route-sync.cjs`).
- Engine: `.../011-runtime-engine/lib/compiled-route.cjs` → per-hub `006-parent-hub-rollout/00N-<hub>/{lib/router.cjs|canary-router.cjs, fixtures/canary-cases.v1.json, lib/registry-compiler.cjs}`.
- Parity harness (non-frozen): `system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs`; driver `run-skill-benchmark.cjs --compiled-routing-parity on`.
- FROZEN (never edit): `router-replay.cjs` `d5e13da…`, `score-skill-benchmark.cjs` `d5a9cc7…`, `load-playbook-scenarios.cjs` `5029f22…`.

## Three paths
- **Path 1 — build full coverage (no concession).** Engineer production compiled policies for the thin hubs (sk-code, cli-ext, mcp-tooling, sk-prompt, + sk-doc/system-deep-loop post-remint) to route == legacy on all scenarios like sk-design. Fix 2 over-detections; re-mint 2 stale; then flip 7 genuinely-serving. **Proven feasible (sk-design); MAJOR multi-hub effort.**
- **Path 2 — byte-identical via fallback (a concession).** Fix `defer`→legacy contract (7 SKILL.md + templates) + correct harness bar + fix 2 over-detections + re-mint; flip with compiled serving what it covers + safe-defer→legacy for the rest. Byte-identical OUTCOMES, reversible, enabled-by-default. Compiled serves unevenly; legacy backs the gaps. MODERATE.
- **Path 3 — hold.** Don't flip. (Rejected by operator: "do not accept blocker".)

## No-regret work (needed under Path 1 AND Path 2)
1. Re-mint sk-doc + system-deep-loop (reveals their true coverage).
2. Fix the 2 over-detection bugs (sk-design TV-003, mcp-tooling MT-008).
3. This diagnosis doc (formalize into 015 tree).

## Context note
This session is heavy + post-compaction. Path 1 (multi-hub build) is best executed from a fresh session using this doc as the handoff (per global CLAUDE.md compaction guidance). No-regret items can start now.
