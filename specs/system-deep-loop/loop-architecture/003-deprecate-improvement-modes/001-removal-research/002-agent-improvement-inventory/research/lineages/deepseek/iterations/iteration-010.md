# Iteration 10: Tests, validators and doctor checks — CI gates, suites, fixtures, and the SHARED-WITH-MODEL-BENCHMARK consolidation

## Focus

Close the inventory with the test and verification layer: the deep-loop runtime vitest suite and its CI workflow, the advisor drift-guard and compiled-routing workflows, the command-tree-parity and agent-mirror-sync gates, hook/git-hook tests, packet test dirs and behavior-benchmark scenarios, doctor checks, and the final SHARED-WITH-MODEL-BENCHMARK roll-up.

## Actions Taken

1. Enumerated every file under `runtime/tests/` mentioning the mode (20 in `tests/unit/`), split lane-dedicated vs mixed.
2. Read the CI workflow run steps: `deep-loop-runtime.yml` (runtime test command), `routing-registry-drift.yml` (drift-guard + parity suites), `command-tree-parity.yml` (tree checker + Hermes `--check`s), `dispatch-enforcement-guard.yml` (dispatch suites).
3. Read `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` fixture blocks; confirmed hooks/dispatch tests are mode-clean and the deep-loop guard tests live in `.opencode/plugins/tests` (iteration 6).
4. Listed `runtime/tests/` top level, the shared behavior-benchmark dir, and re-checked `runtime/tests/unit/README.md` index rows.
5. Compiled the SHARED-WITH-MODEL-BENCHMARK set across all previous iterations.

## Findings

1. **The runtime unit suite is the mode's largest test surface** — 20 files in `runtime/tests/unit/` carry the tokens: lane-dedicated `agent-improvement-ledger-schema.vitest.ts`, `agent-improvement-reducers.vitest.ts`, `agent-improvement-sealed-artifacts.vitest.ts` (DELETE); common `deep-improvement-common-*.vitest.ts` (EDIT); mixed `deep-improvement-ledgers-contract.vitest.ts`, `host-driven-improvement.vitest.ts`, `verify-authority-cli.vitest.ts`, `write-set-conflict-graph.vitest.ts`, `append-mode-event-cli.vitest.ts`, `authorized-ledger.vitest.ts`, `check-projection-coverage.vitest.ts`, `lifecycle-taxonomy.vitest.ts`, `fanout-merge.vitest.ts`, `blinded-adjudication.vitest.ts`, `model-benchmark-*.vitest.ts` (EDIT); the index `README.md` rows 25-27 describe the lane tests (EDIT). [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/README.md:25]
2. **CI runs the whole runtime suite** — `.github/workflows/deep-loop-runtime.yml` line 60: `npm --prefix .opencode/skills/system-deep-loop/runtime test`; the deletion must keep this gate green (it exercises the lane libs until they are removed with their tests). [SOURCE: .github/workflows/deep-loop-runtime.yml:60]
3. **The advisor drift-guard and routing parity suites are the authoritative CI gate for the projection maps** — `.github/workflows/routing-registry-drift.yml` installs the spec-kit workspace and runs the drift-guard + parity suites from `.opencode/skills/system-skill-advisor/runtime`; a registry-entry removal without the matching map edit fails this gate. [SOURCE: .github/workflows/routing-registry-drift.yml:120]
4. **The command-tree-parity workflow is the generated-mirror gate** — it runs `validate-command-tree-parity.sh` and then `sync-skills-hermes.cjs --check` plus `sync-prompts-hermes.cjs --check` (lines 63-67); stale Hermes copies after deletion fail this gate until the sync scripts are rerun. [SOURCE: .github/workflows/command-tree-parity.yml:63]
5. **The agent-mirror-sync workflow and the git-hook tests both exercise the packet checker's path** — `.github/workflows/agent-mirror-sync.yml:17` runs the `.opencode` mirror copy; `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` creates fake checker fixtures at lines 360-361, 539-540 and 610-611. Disposition: EDIT paths/fixtures when the checker moves or dies. [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:360]
6. **Hook and dispatch test suites outside the deep-loop trees are mode-clean** — the dispatch-enforcement-guard workflow's suites (`dispatch-rule-checks.test.mjs`, `dispatch-audit.test.mjs`) carry no tokens; the deep-loop guard tests live in `.opencode/plugins/tests` (iteration 6). [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:31]
7. **The packet's own test dirs split by lane** — `scripts/agent-improvement/tests/` (DELETE with the lane), `scripts/model-benchmark/tests/` (sibling), `scripts/shared/tests/` (EDIT; includes the mirror-checker test and `loop-host.vitest.ts`), `test-fixtures/060-stress-test/` (Lane A fixture, DELETE), with `scripts/vitest.config.mjs` as the runner. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:30]
8. **Behavior-benchmark splits at the contract boundary** — `shared/behavior-benchmark/` (framework, README, `behavior-bench-run.cjs`, its own tests dir) is mode-shared (EDIT the consumer list; keep for surviving modes); packet scenarios `IMB-001..006` are Lane A/common (DELETE candidates), `IMB-007` the sibling; the packet `behavior-benchmark/behavior-benchmark.md` contract is edited via regeneration of the consumer note. [SOURCE: .skilled/skills/system-deep-loop/shared/behavior-benchmark/]
9. **Doctor checks are name-agnostic (negative)** — no doctor asset or route mentions the mode; the agent-roster and runtime-mirror checks resolve agents dynamically, so the deletion must simply leave no orphaned mirrors for them to flag. [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml]
10. **Neither `validate.sh` nor the runtime drift scripts hardcode the mode (negative)** — `check-contract-drift.cjs`, `check-documentation-drift.cjs`, `verify-iteration.cjs` and the spec-kit validator carry no tokens; they validate structure, not mode names. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs]
11. **SHARED-WITH-MODEL-BENCHMARK roll-up (final)** — the shared packet chassis (`deep-improvement/SKILL.md`, `README.md`, `scripts/shared/*`, `references/shared/*`, `routing-allowlist.json`, `test-fixtures` boundary), the `deep-improvement-common-*` runtime libs, the appended hub registries that carry both lanes (`mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md`, `command-metadata.json`, `graph-metadata.json`, `leaf-scopes.json` shared scope), `legacy-projections` contracts, `mode-append-gateway` mapping, `shared/behavior-benchmark`, `shared/rollout` sibling entry, `create-skill-parent` examples, the Hermes packet copy, the sibling model-benchmark command assets, `opencode/plugins` guard fixtures, and every test file named for both lanes; all EDIT or regenerate, none DELETE while Lane B exists. [SOURCE: .skilled/skills/system-deep-loop/leaf-scopes.json:16]
12. **Convergence telemetry** — with iteration 10 recorded, the run reaches its configured cap; the remaining open questions (full reference list closure, indirect-wiring closure) are answered to the depth the cap allows and the synthesis consolidates them. [SOURCE: specs/system-deep-loop/039-deprecate-improvement-modes/001-removal-research/002-agent-improvement-inventory/research/lineages/deepseek/deep-research-config.json:2]

## Ruled Out

- Adding new tests or running repo tooling beyond the lineage: research-only run; the suites are inventoried, not executed, and every write stayed inside the lineage directory.

## Dead Ends

- None; the test layer resolved into CI gates (workflows), suites (runtime/hooks/plugins/packet), fixtures (retrieval corpus, git-hook fixtures, behavior scenarios) and name-agnostic validators.

## Edge Cases

- Ambiguous input: "doctor checks" could mean any of the doctor routes; resolved by the token sweep (negative) plus the runtime-mirror check note.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/tests/unit/ (20 files) + README.md:25-27
- .github/workflows/deep-loop-runtime.yml:60; routing-registry-drift.yml:120-140; command-tree-parity.yml:63-67; agent-mirror-sync.yml:17; dispatch-enforcement-guard.yml:31-47
- .skilled/scripts/git-hooks/tests/pre-commit.test.sh:360-361,539-540,610-611
- .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:30
- .skilled/skills/system-deep-loop/shared/behavior-benchmark/ (dir)
- .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml (negative)
- .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs (negative)
- .skilled/skills/system-deep-loop/leaf-scopes.json:16
- specs/system-deep-loop/039-deprecate-improvement-modes/001-removal-research/002-agent-improvement-inventory/research/lineages/deepseek/deep-research-config.json:2

## Assessment

- New information ratio: 0.8
- Questions addressed: KQ4 (tests/validators/doctor as part of the SHARED question), KQ2 (closure)
- Questions answered: the shared-classification half of KQ4 is consolidated; the tests/validators map is complete

## Reflection

- What worked and why: reading the CI workflows' run steps turned the test inventory into a gate map, which is what the deletion plan needs (which gates fail when each surface changes).
- What did not work and why: nothing failed; the name-agnostic doctor/validator negatives required explicit recording to avoid false confidence.
- What I would do differently: nothing; synthesis lifts these gates into the plan directly.

## SCOPE VIOLATIONS

- None.

## Recommended Next Focus

None — iteration cap reached. Proceed to synthesis (`research.md`, convergence report, terminal `maxIterationsReached`).
