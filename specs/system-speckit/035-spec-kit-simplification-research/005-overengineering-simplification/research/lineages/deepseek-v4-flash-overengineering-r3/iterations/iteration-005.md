# Iteration 005 — KQ-R3e: neighbour-skill coupling into system-spec-kit/runtime

Session: fanout-deepseek-v4-flash-overengineering-r3-1788784311216-27elid | run 5 | focus: every path from `.opencode/skills/system-deep-loop` and `.opencode/skills/sk-doc` into `system-spec-kit/runtime` — classified as documented surface (CLI script, dist entry point, shared package) or internal reach (lib module, fixture, private helper). At most 12 hits, surrounding lines read.

Evidence reads (2 bash calls): full grep over both skills (25 raw matches → 12 distinct referenced targets), line reads of both fanout playbook steps, and `find`/`ls` checks for `tests/unit/`, `fanout-run*.vitest.ts`, and the two `runtime/` directories. No node/validate/git executed.

## Hit classification (12 distinct targets)

| # | Referenced path (in system-spec-kit/runtime) | Where reached from | Classification |
|---|---|---|---|
| 1 | `cli/dist/continuity/generate-context.js` | deep-research/feature-catalog/loop-lifecycle/memory-save.md:27; references/protocol/loop-protocol.md:571 | **Documented surface** — dist entry point; memory-save.md:27 names it "the supported save boundary" |
| 2 | `cli/optimizer/optimizer-manifest.json` | references/convergence/convergence-reference-only.md:96; assets/deep-research-config.json:78 | Documented (data contract; census F23 recorded keep) |
| 3 | `cli/resource-map/extract-from-evidence.cjs` | feature-catalog/loop-lifecycle/resource-map-emission.md:39,59; manual-testing-playbook/.../resource-map-emission.md:91 | **Internal reach** — lib script under `cli/`, no dist twin, no CLI contract |
| 4 | `scripts/tests/resource-map-extractor.vitest.ts` | resource-map-emission.md:49; playbook resource-map-emission.md:92 | Internal reach (test) |
| 5 | `handlers/coverage-graph/convergence.ts` | feature-catalog/convergence/graph-convergence.md:43 | **Internal reach** — MCP handler module inside spec-kit's runtime tree |
| 6 | `cli/tests/deep-research-reducer.vitest.ts` | negative-knowledge.md:49; iteration-dispatch.md:52; strategy-tracking.md:51; playbook:922 | Internal reach (test) |
| 7 | `cli/tests/deep-research-contract-parity.vitest.ts` | memory-save.md:49; config-management.md:50; playbook:923 | Internal reach (test) |
| 8 | `cli/tests/graph-aware-stop.vitest.ts` | graph-convergence.md:49 | Internal reach (test) |
| 9 | `cli/tests/coverage-graph-cross-layer.vitest.ts` | playbook/iteration-execution-and-state-discipline/graph-events-emission.md:53,78 | Internal reach (test) |
| 10 | `runtime/` + `npx vitest run ../../runtime//tests/unit/` | playbook/fanout/fanout-single-executor-parity-research.md:51 | **Broken command** (P1) |
| 11 | `runtime/` + `npx vitest run ../../runtime//tests/unit/fanout-run.vitest.ts` | playbook/fanout/fanout-cli-lineages-research.md:54 | **Broken command** (P1) |
| 12 | `vitest.config.ts`; `lib/deep-loop/README.md`, `handlers/coverage-graph/README.md` | deep-loop/runtime/references/integration-points.md:92,161 | Documented (deep-loop's own runtime doc describes the runtime move and stubs) |

`sk-doc`: zero hits — no coupling into system-spec-kit/runtime from the neighbouring documentation skill.

## Findings

**F3-16 [P2 — internal reach] The deep-loop resource-map emission depends on a lib script, not a surface: `system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs`.**
- Claim side: feature-catalog/loop-lifecycle/resource-map-emission.md:39 describes it as "Shared script — normalizes research evidence and renders the ten-category resource map"; the playbook (…/synthesis-save-and-guardrails/resource-map-emission.md:91) calls it "Shared template renderer and research-shape adapter".
- Actual: the file is a plain module under `runtime/cli/resource-map/` — no dist entry point, no CLI invocation contract, no exported API declaration; deep-loop's resource-map emission behavior is coupled to its internal shape, and every test of that behavior lives in the same tree (`runtime/scripts/tests/resource-map-extractor.vitest.ts`).
- Severity: P2. Recommendation: **document** (declare the module a shared surface with a stable contract) or **move** under the deep-loop hub's own runtime, which exists (`system-deep-loop/runtime/`).

**F3-17 [P2 — internal reach] The graph-convergence verdict deep-loop records is produced by `system-spec-kit/runtime/handlers/coverage-graph/convergence.ts`.**
- Claim side: feature-catalog/convergence/graph-convergence.md:43 — "MCP handler — produces the graph convergence verdict that the workflow records and the reducer consumes".
- Actual: a handler module inside system-spec-kit's runtime tree is the producer of deep-loop convergence semantics; deep-loop's SKILL.md §8 says the shared runtime lives in "this hub's own runtime infrastructure layer" — but the hub also owns `system-deep-loop/runtime/`, so the actually-coupled path is a module in the OTHER skill's package, reachable only by deep-loop docs.
- Severity: P2. Recommendation: **document** (own the handler in the shared-runtime note, or move it to deep-loop's runtime).

**F3-18 [P2 — internal reach] Deep-loop behavior is verified by five test files inside system-spec-kit's runtime tree.**
- Claim side: four feature-catalog files + the playbook index (manual-testing-playbook.md:922-923) cite `runtime/cli/tests/deep-research-reducer.vitest.ts`, `deep-research-contract-parity.vitest.ts`, `graph-aware-stop.vitest.ts`, `coverage-graph-cross-layer.vitest.ts`, `runtime/scripts/tests/resource-map-extractor.vitest.ts` as the automated verification of deep-loop reducer/strategy/dashboard/graph behavior.
- Actual: the deep-research reducer is deep-loop machinery, but its tests live in system-spec-kit's tree (integration-points.md:161 describes README stubs "documenting the runtime move" — the move is documented, the placement is not expressed as coupling).
- Severity: P2. Recommendation: **document** — one sentence in deep-research SKILL.md naming the test home, or move the deep-loop tests under `system-deep-loop/runtime/tests/`.

**F3-19 [P1 — wrong command] Both fanout playbook verification steps run `npx vitest` against a path that does not exist.**
- Claim side: fanout-single-executor-parity-research.md:51 — `cd .opencode/skills/system-spec-kit/runtime && npx vitest run ../../runtime//tests/unit/` ("Confirm 197/197 pass"); fanout-cli-lineages-research.md:54 — same with `…/tests/unit/fanout-run.vitest.ts` ("Confirm 5/5 pass").
- Actual: from that cwd, `../../runtime/` resolves to `.opencode/skills/runtime/` — no such directory (`ls` confirmed); `tests/unit/` does not exist anywhere under `system-spec-kit/runtime` (no `tests/unit` dir; tests are flat under `runtime/tests/` and `runtime/cli/tests/`); and no `fanout-run*.vitest.ts` exists outside `dist/` in the whole skill (`find` confirmed). The two "Confirm N/N pass" assertions cannot be executed as written.
- Severity: P1 (wrong — a manual-testing instruction that verifies nothing). Recommendation: **fix** — point at the real test file (its location unconfirmed here; see open question) or delete the steps and state the verification gap.

## Verified correct this iteration

- `generate-context.js` is consistently treated as the documented save boundary: memory-save.md:27 ("supported save boundary") and loop-protocol.md:571 invoke the same dist entry point; no deep-loop doc reaches into the continuity writer's lib internals.
- The optimizer manifest coupling is a data path (`assets/deep-research-config.json:78` → `runtime/cli/optimizer/optimizer-manifest.json`) and census F23 already recorded the keep with its reason; not re-reported.
- `sk-doc` maintains a clean boundary: zero mentions of system-spec-kit/runtime anywhere in the skill.
- The shared-runtime location is documented on all three surfaces that matter: deep-research SKILL.md §8 ("shared runtime lives in this hub's own runtime/ infrastructure layer"), integration-points.md:161 ("Original-location stubs documenting the runtime move"), and the README stubs themselves.
- deep-loop's own `runtime/` directory exists (system-deep-loop/runtime) — the coupling targets are inside system-spec-kit's tree, not deep-loop's, which is exactly what the internal-reach classification captures.

## Open questions

1. Where do the fanout unit tests live today (no `fanout-run*.vitest.ts` found under system-spec-kit/runtime outside dist — moved, renamed, or never committed? Not searched outside that tree).
2. Was the fanout playbook's npx step ever runnable, or was it written against a pre-move layout (the `../../` escape and `tests/unit/` both smell like pre-move paths)? Changelog not read (budget).
3. Does moving the deep-loop tests/handlers into `system-deep-loop/runtime/` break the workflow's own path expectations (their dist twins are referenced by the command assets)? Not verified (node tooling and dist excluded).
