# Test and CI Bloat: What Should Be Deleted, Merged, Narrowed or Moved

**Lineage**: `pi-llmgateway` (cli-pi, deepseek-v4.1-flash-1017) · **Iterations**: 10 · **Stop reason**: maxIterationsReached
**Packet**: `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research`

---

## 1. Executive Summary

The repository's slow-feeling test cycle is not produced by everything equally. Measured and inferred together, the picture is:

- **The git hook path is already lean.** A commit costs about one to two seconds and a push about one second. Every pre-commit gate measured under a quarter second. There is no meaningful minute to win on the commit path, and the two expensive checks that used to live there — a whole-tree doc-model scan and 40 s of report-only pre-push tests — have already been removed.
- **The CI sweep is the cost**: about **4,129 s** of mean wall clock across the 21 workflows with recorded runs. The six largest workflows are **2,377 s (58%)**; the ten smallest guards are **960 s (23%)**.
- **The single largest structural finding is a placement error, not a deleted check**: the `Advisory Checks` workflow runs the node test corpus — including the largest and most gate-critical suites in the tree — with `continue-on-error: true`, so it pays the test cost and blocks nothing.
- **The largest file-count claim is inflated**: 111 of the "1,270 test files" are captured artifacts and archived packet tests under `specs/` that no CI path executes, so the live corpus is about **1,159 files**.
- **The honest total of the ranked cuts is about two to three minutes per sweep.** No single deletion of several minutes exists in this tree; the expensive workflows are expensive because of real test volume and dependency installation, which earlier phases of this packet and the settled CI-efficiency packet already address.

---

## 2. Research Scope and Method

Subjects: `.github/workflows/` (32 files), `.skilled/scripts/git-hooks/` (7 hook scripts, 1,056 + 609 lines in the two main ones), the vitest and node:test suites under `.skilled/skills/*/runtime` (1,124 test files), and test files under `specs/` (111).

Not repeated (settled): caching, trigger hygiene and the workflow-consolidation decision in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`; per-file splits and CI timing in phases 001-005 of this packet.

Method: read the hooks, workflows and test configuration; measure read-only checkers with `/usr/bin/time -p`; enumerate the corpus with `git ls-files` and the repository's own discovery runner (`--list`); never execute anything that rewrites the tree. Every write landed inside this lineage.

---

## 3. Baseline

| Measure | Value | Evidence |
|---|---|---|
| Test files (census) | 1,270 | `spec.md` census, reproduced with `git ls-files` |
| Test files under `.skilled` | 1,124 (88%) | per-tree count |
| Test files under `specs/` | 111, all artifacts/archives | path classification |
| Files covered by `run-node-tests.mjs` | 253 (250 `node:test`, 3 vitest) | `--list` |
| `.vitest.ts` files | 777, reachable only via spec-kit projects, 4 named suites, and the hooks tree | vitest config `include` patterns |
| CI workflows | 32; 26 trigger on both push and PR | `on:` parsing |
| CI sweep mean wall clock | ≈4,129 s over 21 workflows with runs | `spec.md:81` sum |
| Largest six workflows | 2,377 s (58%) | same table |
| Ten smallest guards | 960 s (23%) | same table |

---

## 4. Findings by Subject

### 4.1 Git hooks — no cut available

- `pre-commit` runs twelve blocking gate families, four of which re-mint and stage files during the hook (`route-remint`, `contract-recompile`, `spec-remint`, `doc-version-bump`). That is a design smell, not a time cost. [SOURCE: .skilled/scripts/git-hooks/pre-commit:641]
- Measured: comment hygiene 0.20 s over 40 files; agent mirror-sync 0.12 s over 91 mirror files; prompt-card sync 0.12 s; compiled-route guard 0.07 s; a bounded git call ≈20 ms; a Node spawn 0.02 s. A typical commit is 1-2 s, a push ≈1 s. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1]
- `pre-push` already dropped 40 s of report-only test suites and the doc-model validator left `pre-commit` for CI. Those two removals established the criterion this research applies: a check stays on the local path only if it can block and is cheap. [SOURCE: .skilled/scripts/git-hooks/pre-push:481]
- The duplicated source-root/trust preamble across six hook scripts and the 15-row gate switch table are maintenance debt: real, fixable, and worth under a second per commit.

### 4.2 CI workflows — where the minutes are, and the duplication that does not pay

- Five workflows re-run a check the local hooks already block: `comment-hygiene`, `agent-mirror-sync`, `prompt-card-sync`, `message-contract`, `routing-registry-drift`. Together with the four zero-run workflows they are the duplication story, but they are also the cheapest part of the sweep (about 960 s across the ten small guards). [SOURCE: .github/workflows/comment-hygiene.yml:1]
- `Advisory Checks` is green by construction: four `continue-on-error: true` steps, 87 s mean, and a comment telling the reader not to trust its run status. It is the only place the entire node test corpus runs. [SOURCE: .github/workflows/advisory-checks.yml:36]
- The trigger index has two owners: a 4.53 s `--check` in the advisory job and a 185 s rebuild workflow that repairs the same artifact after merge. [SOURCE: .github/workflows/advisory-checks.yml:67]
- `dispatch-enforcement-guard.yml` also runs the whole `.skilled/hooks` vitest tree in a job named "Every hook vitest suite passes", so a workflow named for one guard fails for unrelated reasons and its red X no longer says what broke. [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:69]
- `CodeQL` (319 s) has no workflow file in the tree; it is a repository-setting scan and belongs outside any cut list. [INFERENCE: based on the absence of a CodeQL workflow file]

### 4.3 Test corpus

- `run-node-tests.mjs` covers 253 of 1,270 files and becomes the *report-only* path. Thirteen `.test.mjs` files under system-spec-kit are gate-critical — gate menu parity, permission policy, recorded-failure audit, four mirror generators — and one of them, `spec-gate-core.test.mjs`, is 2,689 lines, the largest suite in the tree. None can turn a check red. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:1]
- All 111 spec-tree test files are captured logs, fixture seeds, archived packet suites and one-time script tests; no CI path runs them, so deleting them saves zero minutes and only corrects the census. [SOURCE: .skilled/scripts/run-node-tests.mjs:20]
- The three same-named pairs in `cli/tests` and `tests/` are layered coverage, not duplicates. The `.opencode` tree mirrors by link, so there is no duplicated suite tree to cut. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/progressive-validation.vitest.ts:1]

### 4.4 Suites and infrastructure

- The advisor default suite runs all 185 of its files with `fileParallelism: false` — a serial floor of about 2.7 minutes, with 31 spawning suites queued behind each other. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:40]
- That suite also carries a separate `vitest.stress.config.ts` behind `SPECKIT_RUN_STRESS`; the workflow's own comment records that nothing set the switch and two tests failed for months. [SOURCE: .github/workflows/skill-advisor-stress.yml:3]
- The deep-loop runtime keeps a hand-maintained five-pattern `SERIAL_FILES` list splitting the tree into parallel and serial projects with no test that the list is complete. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:16]
- Nine vitest entry points exist for one surface, two of them stress variants; fifteen harness/helper files back the suites, one shared across trees by relative path.
- `fanout-run.vitest.ts` is 6,115 lines. The only available cut is splitting it, and per-file splits are settled in earlier phases. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1]
- Both large runtime workflows spend most of their mean on installation: `Skill Advisor Stress Tests` runs five `npm ci` installs and a build before a test that takes about 3.4 minutes in total; `Deep-Loop Runtime Tests` runs four installs plus a build before a suite. [SOURCE: .github/workflows/skill-advisor-stress.yml:72]

---

## 5. Ranked Cuts

Ranked by minutes saved per sweep. "Regression it stops catching" is what the repository would no longer detect if the cut were taken as stated.

| # | Class | Path | Saving | Regression it stops catching | Confidence |
|---|---|---|---|---|---|
| 1 | **move**, then **delete** the leftover step | `.github/workflows/advisory-checks.yml:36` (`Node test suites (report-only)`) with `.skilled/scripts/run-node-tests.mjs` | ≈75-80 s per push and per PR (87 s mean − 7.3 s of measured validators) | None, once the 13 gate-critical suites move into a blocking vitest project — they currently cannot block, so the move *adds* coverage | Composition measured; split inferred |
| 2 | **merge** | `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:40` + `vitest.stress.config.ts`, and `.github/workflows/skill-advisor-stress.yml` | 30-60 s net per advisor run (serial 2.7 min halves, minus 30 s for the stress suite that then actually runs) | Nothing testing-wise; the risk is behavioural — if the suites share one skill-graph database, parallel runs may interfere | Mechanism high, number low (unmeasured) |
| 3 | **move** (to blocking) | `.github/workflows/advisory-checks.yml:50` (doc-model reference drift) | 0 s of net time (2.77 s measured); the gain is enforcement restored | Nothing today — it already detects drift and its output is never read by the status | Measured |
| 4 | **delete** | `.github/workflows/advisory-checks.yml:67` (trigger-index freshness) | 4.53 s per run (measured) | Trigger-index drift inside a PR window; the rebuild workflow still repairs it after merge | Measured cost; coverage trade-off is a judgement |
| 5 | **delete from the census** | `specs/**` (111 test-shaped files) | 0 s | Nothing; no CI path executes them | High |
| 6 | **merge** | `.github/workflows/playbook-operator-contract.yml:72` and `:79` | ≈1 s (one Node start) | Nothing, if `--strict --format json` preserves the fleet listing | Medium |
| 7 | **no cut** | `.skilled/scripts/git-hooks/*` | Under 1 s per commit by any deletion | Whichever gate is deleted, plus the uninstalled-hook case | Measured |

**Do not sum rows 1, 3 and 4 with the workflow mean**: they are steps inside the same 87 s mean.

**Not cut, and why**: `Spec-Kit Check` (595 s) is the only door for 339 vitest files and 777 `.vitest.ts` files in total; narrowing it without relocating them is coverage loss. `Skill Advisor Stress Tests` (457 s) and `Deep-Loop Runtime Tests` (472 s) are dominated by dependency installation, and caching is settled. `CodeQL` (319 s) is configured outside the tree.

---

## 6. Eliminated Alternatives

- **Deleting most pre-commit gates for speed.** Every measured gate is under 0.25 s; the removal buys under a second and loses a blocking check.
- **Deleting the hook-backstop CI workflows outright.** They cover the fresh-clone/no-hooks case, which is the normal case for a contributor.
- **Cutting a duplicated test tree under `.opencode`.** It holds 35 test files and links the rest; no duplicate suite tree exists.
- **Deleting the same-named `cli/tests` / `tests/` pairs.** Their imports show two layers (child-process driving versus in-process), not two copies.
- **Treating the 1,270-file census as the runnable corpus.** 111 files never run.
- **Deleting spec-tree test files as a time cut.** Measured at zero.
- **Keeping the stress suite behind `SPECKIT_RUN_STRESS`.** The gate is what let it rot unseen for months.
- **Deleting pre-push's contract-drift check as duplication.** It restates a suite assertion but fails in seconds instead of after the whole run.
- **Re-opening trigger hygiene, caching, workflow consolidation or per-file splits.** Settled elsewhere; out of scope here.

---

## 7. Divergence Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none
- Remaining frontier: per-step CI timing (not stored anywhere in the repository), which is what would convert rows 1, 2 and 6 of the ranking from inferred to measured.

---

## 8. Open Questions

1. Which CI workflows duplicate a local hook check or another workflow, and how many seconds per run would deleting or merging them save? — answered for the *set* (five duplication pairs, ten small guards at 960 s) but not at step level, because no per-step durations exist.
2. Which runtime test files are redundant, mirror the implementation, or re-assert framework behaviour, and how long does each suite take? — the redundancy hypothesis was refuted for the three same-named pairs; per-suite seconds remain unknown.
3. Which hook checks can move to CI or narrow to changed paths, and what does each cost? — the cost half is measured and closes the question's intent; no hook cut is worth taking.

Two further questions from the strategy are answered: the spec-tree coverage question (nothing runs, nothing lost) and the overengineered-infrastructure question (nine configs, a serial default suite, an always-off stress gate, a hand-maintained serial list, and fifteen harness files).

---

## 9. References

- `.github/workflows/` — 32 workflow files; `advisory-checks.yml`, `skill-advisor-stress.yml`, `deep-loop-runtime.yml`, `spec-kit-check.yml`, `playbook-operator-contract.yml`, `naming-standard-guard.yml`, `message-contract.yml` read in full or in relevant part.
- `.skilled/scripts/git-hooks/pre-commit`, `pre-push`, `lib/gates.tsv`, `README.md`, `lib/README.md`.
- `.skilled/scripts/run-node-tests.mjs`.
- `.skilled/skills/system-spec-kit/vitest.config.ts`, `.skilled/skills/system-spec-kit/runtime/vitest.stress.config.ts`, `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` and `vitest.stress.config.ts`, `.skilled/skills/system-deep-loop/runtime/vitest.config.ts`, `.skilled/hooks/vitest.config.ts`.
- `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`, `.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/check-agent-mirror-sync.cjs`.
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md` (inventory and CI run-time table).
- This lineage: `iterations/iteration-001.md` … `iteration-010.md`, `deltas/iter-001.jsonl` … `iter-010.jsonl`.

---

## 10. Appendix: Convergence Report
- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 2 / 5 (the spec-tree coverage question and the infrastructure question)
- Remaining questions: 3
- Last 3 iteration summaries: run 8: test infrastructure, nine configs and a serial advisor suite (0.90) · run 9: CI cost distribution, top six workflows are 58% (0.82) · run 10: ranked cut list with negative results ranked (0.55)
- Convergence threshold: 0.05 (recorded as telemetry; `stopPolicy: max-iterations` ran every iteration)
- Divergence summary: no divergent pivots recorded
- New-information trend across iterations: 0.92, 0.90, 0.92, 0.90, 0.90, 0.90, 0.88, 0.90, 0.82, 0.55 — high through iteration 8, falling at the ranking step, as expected when synthesis replaces discovery.
