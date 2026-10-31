# Deep Review Iteration 2 — Correctness

**Iteration**: 2 of 5
**Dimension**: correctness
**Target**: `specs/system-speckit/053-ci-workflow-efficiency`
**Focus**: whether the implementation claims the packet makes hold in the tree it ships with — the workflow inventory, the structural preconditions each phase's acceptance rows assert, and the evidence each phase pins its closure to.

---

## 1. FILES REVIEWED

- `.github/workflows/*.yml` (32 files) — parsed with PyYAML: workflow count, job count, `timeout-minutes` coverage, `vars.SKILLED_CI*` coverage, `permissions:` coverage.
- `.github/workflows/spec-kit-check.yml:130-160` — the two-process CLI vitest step.
- `.github/workflows/trigger-index-rebuild.yml:1-16,140-160,186-205` — `permissions: {}`, the skip token, the push job's scopes.
- `.github/workflows/command-tree-parity.yml:1-30` — the R4 path filter.
- `.github/workflows/dependabot-auto-merge.yml:1-60` — the R25 job split.
- `.github/workflows/README.md` — one row per workflow.
- `.github/scripts/check-gate-inputs.sh` — executed, output read.
- `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md:37-38`, `job-shape-rules.md:34,58` — the standard's own counts.
- `specs/system-speckit/053-ci-workflow-efficiency/spec.md:3,58,130` — the 33-workflow claims.
- `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md:57-58` — the shard branch and its local proof.
- `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/acceptance-criteria.md:61,122` — the report's count rule and the closure statement.

---

## 2. FINDINGS BY SEVERITY

### P0 Findings

None. Every structural precondition a phase asserts was checked against the tree and holds; the two defects this iteration found are a stale inventory in a gate criterion and two evidence-quality gaps.

### P1 Findings

#### R2-P1-001 — The packet's own standard says 32 workflows, the parent packet and the 006→009 handoff criterion still say 33

The tree holds 32 workflow files (`ls .github/workflows/*.yml | wc -l` = 32; PyYAML parse of all 32 yields 44 jobs). The packet's own CI standard, authored by phase 006, records the post-merge count:

- `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md:37` — "32 of 32 workflows, 89 remote `uses:` lines".
- `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md:38` — "32 of 32" README rows.
- `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:34` — "`44 of 44` jobs in the 32 workflows carry a timeout".
- `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:58` — "Today all 32 workflows declare `permissions:` at the top".

The parent packet was not updated with the R15 merge that deleted `.github/workflows/hooks-node-tests.yml`:

- `spec.md:3` — "cut the CI load of the 33 GitHub Actions workflows".
- `spec.md:58` — "The repository's 33 workflows spend about 3,812 runner-minutes a day".
- `spec.md:130` — the 006→009 handoff criterion: "`/doctor:ci report` lists all 33 workflows with switch state".

Phase 009's acceptance row handles the count correctly and cannot satisfy "33" as written: `009-.../acceptance-criteria.md:61` requires the report's count to equal `len(glob('.github/workflows/*.yml'))` and enumerates the legal pairs — "`32 32` when `hooks-node-tests.yml` is absent and phase 008 has not merged, `33 33` when it is present". The tree is the `32 32` case. So the report a reviewer runs returns 32, the gate text demands 33, and the packet's own standard says 32 is correct.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/spec.md:130]
[SOURCE: .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md:37]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/acceptance-criteria.md:61]

**Claim**: the 006→009 handoff criterion is unsatisfiable as written because it names a workflow count the packet's own merge deleted, and the packet's standard contradicts the packet's parent.
**evidenceRefs**: the three `[SOURCE:]` tags, plus `ls .github/workflows/*.yml | wc -l` = 32 and `rg -c '33 workflows|all 33|the 33 '` over the packet finding 12 files that still carry the pre-merge count.
**counterevidenceSought**: checked whether phase 008's eventual merge could restore 33 (it can only reduce, to 25 or 26 per `009-.../acceptance-criteria.md:61`); checked whether a 33rd file could live outside `.github/workflows/*.yml` (the gate and the report both glob that exact pattern); checked whether `hooks-node-tests.yml` still exists (`ls` returns "No such file or directory").
**alternativeExplanation**: "33" could be read as the count at authoring time and left as historical narrative in `spec.md:3` and `:58`. That reading is fair for those two lines and is why this finding is scoped to the handoff criterion; `:130` is a gate, not narrative.
**finalSeverity**: P1 — a handoff gate that cannot be met as written is a missing validation criterion, and a reviewer who compares the report's 32 against the criterion's 33 has no way to tell which is right from the packet alone.
**confidence**: 0.9
**downgradeTrigger**: a recorded operator ruling that the handoff criterion reads "every workflow the tree holds", or an update of `spec.md:130` to the glob-based phrasing 009 already uses.

### P2 Findings

#### R2-P2-001 — Phase 005 proves a concurrent two-process step by running the halves one after the other

`.github/workflows/spec-kit-check.yml:141-152` starts the CLI vitest project as two concurrent processes, one on `tests/upgrade-legacy.vitest.ts` and one on `--exclude tests/upgrade-legacy.vitest.ts`, joining both exit codes into `status`. `005-.../acceptance-criteria.md:58` records the local proof as "Local check, one process after the other: the `upgrade-legacy` file alone exit 0 in 313.90 s, the other 182 files exit 0 in 356.56 s".

That is a sequential proof of a concurrent configuration. The concurrency itself is what the R19 probe found unsafe: `005-.../acceptance-criteria.md:57` records three parallel probe runs of "292.33 s exit 0, 305.59 s exit 1, 311.91 s exit 1" with "30 s timeouts with an empty collision log". The CI evidence that the shipped concurrency is safe is the five green `Spec-Kit Check` runs timed in AC-003 (`:58`), which is real evidence — but it is a different run from the one AC-002 claims as its proof, and the row's wording invites a reader to believe the local check exercised the concurrent path.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md:58]
[SOURCE: .github/workflows/spec-kit-check.yml:147]

#### R2-P2-002 — Phase 009's closure statement defers a closure commit its own task list records as landed

`009-.../acceptance-criteria.md:122` ends "The closure commit (T033) is the orchestrator's and the one open task." `009-.../tasks.md:1232` records "- [x] All tasks marked `[x]` [EVIDENCE: T001 to T033 are `[x]`; the closure commit is `8811c7e36d`, on `origin/main`]", and `tasks.md:1189` marks `T033 [x]`.

This is the second occurrence of the pattern filed as R1-P2-001 against phase 002 (`002-.../acceptance-criteria.md:92` against `002-.../tasks.md:689`), so it is a systematic stale-closure habit rather than a one-off. Both packets read `Closeable: Yes`, so the verdict is unaffected; what is wrong is the last sentence a reader sees in the document that decides closure.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/acceptance-criteria.md:122]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/tasks.md:1232]

---

## 3. CONFIRMATIONS OF PRIOR FINDINGS

These are checks that make an earlier finding stronger. They are recorded here rather than re-filed, so the registry keeps one row per defect.

- **R1-P1-001 (007 completion inversion) — confirmed with a machine check.** A PyYAML parse of all 32 workflows and 44 jobs returns `no-timeout []` and `no-switch [('dependabot-auto-merge.yml','metadata'), ('dependabot-auto-merge.yml','auto-merge')]`. That is exactly what `007-.../acceptance-criteria.md:61-63` requires as `Met` and exactly what `007-.../implementation-summary.md:52` denies exists ("no job outside the seven existing `timeout-minutes` lines carries a value, and no job carries a `vars.SKILLED_CI` switch"). The denial is now false at the level of a parse, not only a grep.
- **R1-P1-003 (004 AC-014) — the 004 evidence base is otherwise sound.** Running the gate the row depends on returns `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0` and `RESULT: PASSED`, which is character-for-character the final-tree evidence `004-.../acceptance-criteria.md:71` records for AC-013. The phase's measurements are real; only AC-014's premise is stale.
- **R1-P1-002 (parent map) — the same staleness reaches the handoff criteria**, which is what R2-P1-001 records.

---

## 4. TRACEABILITY CHECKS

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | 002's token, filters, README rows, suite case and baseline all exist at the cited lines; 003's `fetch-depth: 2`, R4 path filter and PR-only `cancel-in-progress` exist; 004's composite action, five adoption sites, pip caches and sparse checkout exist; 005's shard step exists; 006's hub registration exists in `hub-router.json:36` and `mode-registry.json:79`; 009's `/doctor:ci` router and `ci-report.cjs` exist. The 32-vs-33 inventory is the one place the documents and the tree disagree on a count. |
| `checklist_evidence` | core | partial | The gate run above reproduces 004's AC-013 numbers exactly, so its evidence is traceable; 005's AC-002 proves a concurrent step with a sequential run; 007's rows carry no evidence at all (R1-P1-001). |
| `skill_agent` | overlay | pass | `sk-code-ci` is registered in `hub-router.json:36-39`, `mode-registry.json:79-89` and named in `SKILL.md:36`, and its rule data carries current counts (32 of 32). |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition is in scope. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog entry is claimed. |
| `playbook_capability` | overlay | notApplicable | No playbook is claimed. |

---

## 5. RULED OUT

- **The skip token or its guard is missing.** Ruled out: `trigger-index-rebuild.yml:151` carries the token, `:152` the trailer, `:33` the loop guard, and the suite's case at `:897`.
- **The shard step drops a test file.** Ruled out: the first process names the heavy file explicitly, so a rename leaves vitest with no matching file and a non-zero exit; the second process excludes exactly that path, so the union is the whole project.
- **The composite action is unused.** Ruled out: five `uses: ./.github/actions/setup` call sites across `routing-registry-drift.yml`, `opencode-plugin-tests.yml` and `opencode-dual-version.yml`.
- **The Dependabot split left a write scope on the metadata job.** Ruled out: `dependabot-auto-merge.yml:20-22` grants `contents: read` and `pull-requests: read` only, and `:41-42` holds the write scopes on the merge-only job.
- **`008` over-claims.** Ruled out: `T002 [B]` and 0 of 9 rows `Met` are consistent with its `Planned` status.

---

## 6. VERDICT

One P1: the 006→009 handoff criterion names a 33-workflow tree that the packet's own R15 merge turned into 32, while the packet's own standard and phase 009's acceptance row both say 32. Two P2: a concurrent step proven sequentially, and a closure statement that defers a commit its own tasks record. The implementation surface itself checks out — token, filters, timeouts, permissions, switches, composite action, shard, hub registration and the gate all hold in the tree.

Review verdict: CONDITIONAL
