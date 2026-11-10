# Iteration 3: The `deep-improvement` packet (Lane B wiring)

## Focus

`loopHostMode model-benchmark` and every Lane B surface inside `.skilled/skills/system-deep-loop/deep-improvement/`: `SKILL.md`, `references/model-benchmark/**`, `assets/model-benchmark/**`, `scripts/model-benchmark/**`, the shared-script mode branches, feature-catalog pages, manual-testing-playbook pages, the behavior-benchmark scenario, `routing-allowlist.json`, `README.md`, and the `benchmark/` tree.

## Actions Taken

- Collected all `model.benchmark`/`Lane B` match lines in `SKILL.md` (including §4) and read the §4 block plus the shared-script mode branches (`loop-host.cjs`, `promote-candidate.cjs`, `shared/reduce-state.cjs`, `scripts/vitest.config.mjs`).
- Read `default.json` to resolve which fixtures Lane A consumes; read `run-benchmark.cjs` imports to resolve its dependency set.
- Swept feature-catalog, manual-testing-playbook, behavior-benchmark, rollout JSON, routing-allowlist, benchmark README/reports.

## Findings

1. `SKILL.md` carries the Lane B surface at lines 13, 34-36, 41-42, 50-51, 74, 107, 113-118, 123-124, 195-196, 217-226 (§4 "LANE B: MODEL-BENCHMARK", a whole section), 245, 260, 305, 314, 316. **EDIT** — remove the section and lane-B rows; keep every Lane A statement. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:217-226]
2. `references/model-benchmark/` holds exactly four Lane B-only files: `benchmark-operator-guide.md`, `evaluator-contract.md`, `lane-b-mechanics.md`, `mixed-executor-methodology.md`. **DELETE** the directory. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:314-316]
3. `assets/model-benchmark/README.md`, `benchmark-profiles/README.md`, `benchmark-fixtures/README.md` are Lane B data catalogs (each explicitly exempted in `routing-allowlist.json`). **DELETE** all three READMEs. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/routing-allowlist.json:3-5]
4. `assets/model-benchmark/benchmark-profiles/default.json` is consumed by the Lane A YAML fixture step (profiles `fixture-baseline`, `fixture-improved`, `fixture-edge`) — **SHARED-WITH-AGENT-IMPROVEMENT**; the other nine profiles (`capability-m3-vs-mimo[-v2|-v3]`, `framework-bakeoff`, `glm-5.2-frameworks`, `kimi-k2.7-discriminating`, `kimi-k2.7-frameworks`, `model-vs-model`, `reviewer-regression`) are Lane B-only — **DELETE**. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json:6]
5. Fixture split mirrors the profile split: `fixture-baseline.json`, `fixture-improved.json`, `fixture-edge.json` are the default profile's fixtures — SHARED; the tiered/oracle packs (`hard-*`, `harder-*`, `t1-*`, `t3-*`, `t4-*`, `validate-*`, `reviewer-*`) and `reviewer-schema.md` are Lane B-only — **DELETE**. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md:23-29]
6. `scripts/model-benchmark/run-benchmark.cjs` is invoked by the Lane A YAMLs directly — **SHARED-WITH-AGENT-IMPROVEMENT**; its pattern path must be verified self-contained before deletion, because its 5dim branch requires `./scorer/score-model-variant.cjs` (Lane B-only). Its shared imports — `scripts/lib/profile-resolve.cjs`, `scripts/shared/model-family.cjs`, `scripts/shared/extract-deliverable.cjs`, `scripts/shared/materialize-benchmark-fixtures.cjs` — are all SHARED and survive. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:17-24,684]
7. Lane B-only executables and docs: `dispatch-model.cjs`, `sweep-benchmark.cjs`, `lib/reviewer-scorer.cjs`, `lib/score-verdict-fallback.cjs`, `scorer/**` (`score-model-variant.cjs`, `score-d4-agreement.cjs`, `grader/**`, `deterministic/`), `MODES.md`, `SWEEP.md`, `README.md`, and the 16 `tests/**` vitest files. **DELETE** the set. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:221-222]
8. `scripts/shared/loop-host.cjs` is the mode-switch seam: `VALID_MODES` (line 42), `LANE_MODEL_BENCHMARK` (59-62), `planInvocation` mode branch (101-102, 137-140). **EDIT** — remove the model-benchmark arm; keep the agent-improvement default. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:42,59-62,137-140]
9. `scripts/shared/promote-candidate.cjs` has a Lane B promotion path (`--benchmark-report`, lines 666-667, 1017-1019) and `scripts/shared/reduce-state.cjs` has mode buckets and a Lane B plateau branch (640-641, 755-757, 794-799, 984+). **EDIT** both — remove the model-benchmark arms; keep Lane A behavior byte-identical. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:794-799]
10. `scripts/vitest.config.mjs:5` describes the lane layout in a comment; `. . .` — **EDIT**. The shared test suite files referencing mode=model-benchmark (`loop-host.vitest.ts`, `reduce-state-mode-mix.vitest.ts`, `promote-candidate-mirror-sync.vitest.ts`, `rollback-candidate-hash-guard.vitest.ts`, `materialize-fixture-id.vitest.ts`, `promote-candidate-benchmark.vitest.ts`, `tests/fixtures/README.md`, `tests/fixtures/low-sample-benchmark/**`, `tests/README.md`) — **EDIT** to drop mode-B arms while keeping Lane A fixtures. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs:5]
11. `feature-catalog/feature-catalog.md` keeps the mode in its description, lane table, feature count row, and the whole "5. MODEL-BENCHMARK MODE" section (lines 294-392) — **EDIT**; the six `feature-catalog/model-benchmark-mode/*.md` pages — **DELETE**; `evaluation-loop/promotion-gates.md:49` and `scoring-dispatch.md:42,53` reference Lane B files — **EDIT**. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md:294-392]
12. `manual-testing-playbook/manual-testing-playbook.md` keeps the mode in its description, package listing, category map, closure list, and section 15 with MB-038..MB-049 scenarios (lines 713-800 region) — **EDIT**; the eight `model-benchmark-mode/*.md` feature files — **DELETE**; the shared `benchmark-integration/` pages stay (they exercise the surviving Lane A benchmark runner) — no edit needed beyond any Lane B-only wording; `five-d-scorer/unknown-grader-and-d4-census.md` and the `intra-routing-recall/*` pages that name model-benchmark — **EDIT** (drop Lane B recall rows). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md:42,713-715]
13. `routing-allowlist.json:3-5` (three Lane B entries) — **EDIT**; `README.md` lines 9, 24-25, 38, 105-108 — **EDIT**; the `benchmark/README.md` exists to document the Lane B output tree while `benchmark/reports/**` hold historical skill-benchmark reports that mention the mode only in info rows — README **EDIT**, reports **KEEP-AS-HISTORY**. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/benchmark/README.md:20]
14. Cross-hub shared surfaces: `.skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md:36` lists `/deep:model-benchmark` in its command table — **EDIT**; `.skilled/skills/system-deep-loop/shared/rollout/command-injection-rollout.json:7` pins `"deep/model-benchmark": "fallback"` — **EDIT** (remove the key); `behavior-benchmark/scenarios/IMB-007-model-benchmark-bare-command-halt.md` — **DELETE**. [SOURCE: .skilled/skills/system-deep-loop/shared/rollout/command-injection-rollout.json:7]

## Ruled Out

- Treating `scripts/model-benchmark/` as one DELETE directory: Lane A consumes `run-benchmark.cjs` from it, so the directory is a carve-out, not a whole-tree delete.
- Classifying `benchmark/reports/**` as mode-owned: they are historical reports about the skill (info rows only) and carry no Lane B run outputs ("Recorded Lane B runs: none yet").
- Classifying the `benchmark-integration/` playbook pages as Lane B-only: the playbook's own lane map puts that category in the shared set.

## Dead Ends

- Grepping for a committed `benchmark/model-benchmark/{run_label}` outputs tree: none exists; only the two historical report folders are present.

## Edge Cases

- Ambiguous input: `benchmark/README.md` is Lane B-framed but sits beside a surviving historical reports tree; classified EDIT rather than DELETE.
- Contradictory evidence: none; the Lane A YAML calls verify the shared classification directly.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-deep-loop/deep-improvement/SKILL.md
- .skilled/skills/system-deep-loop/deep-improvement/README.md
- .skilled/skills/system-deep-loop/deep-improvement/routing-allowlist.json
- .skilled/skills/system-deep-loop/deep-improvement/benchmark/README.md
- .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json
- .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
- .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs
- .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs
- .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md
- .skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/system-deep-loop/shared/rollout/command-injection-rollout.json
- .skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md

## Assessment

- New information ratio: 0.9
- Questions addressed: KQ2
- Questions answered: KQ2

## Reflection

- What worked and why: reading the Lane A YAML call sites first fixed the shared/delete split before classification; the default.json fixture list pinned the exact fixture carve-out.
- What did not work and why: nothing material.
- What I would do differently: nothing; the carve-out rule (shared file inside a mode-named directory) should carry into iterations 7 and 9 where generated mirrors repeat the same directory shape.

## Recommended Next Focus

Iteration 4: `system-skill-advisor` surfaces — runtime scorer `aliases.ts`, `lanes/explicit.ts`, `projection.ts`, command-bridges JSON, `skill-graph.json`, `skill_advisor.py`, shadow-diff, and any routing-registry drift guard.
