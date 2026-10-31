# Deep Review Iteration 1 — Traceability

**Iteration**: 1 of 5
**Dimension**: traceability
**Target**: `specs/system-speckit/053-ci-workflow-efficiency` (spec-folder, phase parent with nine children)
**Focus**: reconcile the parent phase map and continuity block against each child packet's own completion state, then reconcile each child's completion documents against the artifacts the packet claims to have produced.

---

## 1. FILES REVIEWED

- `specs/system-speckit/053-ci-workflow-efficiency/spec.md:1-30,100-160` — parent metadata, `_memory.continuity`, phase documentation map, recommendation traceability.
- `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/spec.md:1-60` — status, handoff criteria.
- `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/tasks.md:680-730` — T021 evidence, completion criteria.
- `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/acceptance-criteria.md:59,88-93` — AC-003 line citation, closure statement.
- `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/acceptance-criteria.md:73,101-106` — AC-014 row and the "still Unmet" narrative.
- `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/implementation-summary.md:38-52` — status and what-was-built claims.
- `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/spec.md:30-45` — status Planned.
- `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/acceptance-criteria.md:1-98` — metadata, thirteen `Unmet` rows, `Closeable: No`.
- `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/implementation-summary.md:1-60` — `Completed: Not built`, "Nothing yet", continuity `completion_pct: 90`.
- `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md:2300-2650` — task ticks, T100-T102.
- `.github/workflows/dependabot-auto-merge.yml:1-60` — the split the 007 summary says does not exist.
- `.github/workflows/*.yml` — `permissions:`, `timeout-minutes`, `vars.SKILLED_CI*` counts.
- `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/` and `007-.../scratch/` — evidence directories.

---

## 2. FINDINGS BY SEVERITY

### P0 Findings

None.

### P1 Findings

#### R1-P1-001 — Phase 007's completion state is inverted: four documents say "not built", the repository says built

`007-workflow-hygiene-on-off-control/spec.md:36` reads `Status | Planned`. `007-.../acceptance-criteria.md:98` reads `Closeable: No`, and all thirteen AC rows read `Unmet` (`acceptance-criteria.md:61-73`, `grep -c '| Met |'` returns 0). `007-.../implementation-summary.md:43` reads `Completed | Not built` and `:52` asserts "Nothing yet. This packet is a Level 3 plan, and every artifact it names is still in its pre-phase state: `.github/workflows/dependabot-auto-merge.yml` still has one job holding `contents: write` and `pull-requests: write`, twelve workflow files still declare no `permissions:` block, no job outside the seven existing `timeout-minutes` lines carries a value, and no job carries a `vars.SKILLED_CI` switch."

Every one of those four claims is false in the tree this packet lives in:

- `.github/workflows/dependabot-auto-merge.yml:18-45` has two jobs, `metadata` with `contents: read` and `pull-requests: read`, and `auto-merge` holding `contents: write` and `pull-requests: write` and running only `gh pr merge` — exactly the split `007-.../acceptance-criteria.md:62` describes as the unbuilt AC-002.
- 32 workflow files declare a top-level `permissions:` block (`rg -l '^permissions:' .github/workflows | wc -l` = 32), against the summary's "twelve ... declare no `permissions:` block".
- 32 workflow files carry `timeout-minutes` (`rg -l 'timeout-minutes' .github/workflows | wc -l` = 32), against "no job outside the seven existing `timeout-minutes` lines carries a value".
- 84 `vars.SKILLED_CI*` occurrences across 31 workflows (`rg -o 'vars\.SKILLED_CI[A-Z_]*' .github/workflows | wc -l` = 84), against "no job carries a `vars.SKILLED_CI` switch".

The packet contradicts itself in the same file: `007-.../implementation-summary.md:13` records `recent_action: "T001 to T099 on main, T022 proven on Dependabot runs 40148156911 and 40200559794"` and `:25` records `completion_pct: 90`, while `:52` says nothing is built. `007-.../tasks.md` marks 94 of 94 bracketed tasks `[x]` (T001-T099), and `007-.../scratch/` holds the phase's own evidence (`r24/timeouts.md`, `r25-dependabot.md`, `r26-probe.md`, `pass-permissions.md`, `pass-switch.md`, `gate-after-permissions.txt`, `phase-baseline.md`).

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/spec.md:36]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/implementation-summary.md:52]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/acceptance-criteria.md:98]
[SOURCE: .github/workflows/dependabot-auto-merge.yml:41]

**Claim**: the 007 packet's four completion documents report the phase as unbuilt while its task list, its scratch evidence and the repository report it as built.
**evidenceRefs**: the four `[SOURCE:]` tags above plus `rg -l '^permissions:' .github/workflows | wc -l` = 32 and `rg -o 'vars\.SKILLED_CI[A-Z_]*' .github/workflows | wc -l` = 84, both run this iteration.
**counterevidenceSought**: looked for a second `dependabot-auto-merge.yml` or a second `.github/workflows` tree the summary could be describing (none: one workflow directory, one file); looked for a `.deep-review-pause`-style marker saying the phase was rolled back (none); checked whether `permissions:` lines could come from something other than the phase's R25 pass (the twelve named files at `007-.../acceptance-criteria.md:61` all carry `^permissions:$`).
**alternativeExplanation**: the summary could be a deliberate "plan document, not a status document" convention, in which case the defect is naming rather than state. Rejected because `:43` uses the `Completed` field with the value `Not built` and `:52` is a present-tense assertion about the current tree, and because the same file's own continuity block claims the opposite.
**finalSeverity**: P1 — the phase is real work reported as absent, so the packet's closure gate understates progress and an operator following the packet would re-run 94 tasks against 32 already-edited workflows.
**confidence**: 0.95
**downgradeTrigger**: a commit or note in `007-.../scratch/` that reverts the permissions, timeout, switch and Dependabot edits, or a second workflow tree where they are absent.

#### R1-P1-002 — The parent phase map and continuity block are stale for six of nine phases

The parent `spec.md` phase documentation map reports `002` and `003` `In progress` (`spec.md:105-106`), `004` `In progress` (`:107`), and `005`, `006`, `007`, `009` `Planned` (`:108-112`). Each child's own documents say otherwise:

| Phase | Parent map (`spec.md:104-112`) | Child `spec.md` | Child tasks | Child AC |
|---|---|---|---|---|
| 002 | In progress | Complete | 21/21 `[x]` | 7/7 `Met` |
| 003 | In progress | Complete | 38/38 `[x]` | 17/17 `Met` |
| 004 | In progress | In progress | 71/71 `[x]` | 16 `Met`, 1 `Unmet` |
| 005 | Planned | Complete | 40/40 `[x]` | 10/10 `Met` |
| 006 | Planned | Complete | 68/68 `[x]` | 12/12 `Met` |
| 007 | Planned | Planned (see R1-P1-001) | 94/94 `[x]` | 0 `Met`, 13 `Unmet` |
| 009 | Planned | Complete | 33/33 `[x]` | 17/17 `Met` |

The parent's continuity block carries the same staleness: `spec.md:25` reads `completion_pct: 13` and `spec.md:17` reads `next_safe_action: "Remaining 002: T019 24 h baseline, then T020/T021; 003 T027-T034; 004 T002/T003"`, although 002's T019-T021 are `[x]` (`002-.../tasks.md:689`, commit `03baa89ac6` is on `main` per `git log --oneline -3 03baa89ac6`), 003's tasks are all `[x]`, and 004's T002/T003 are `[x]` (`004-.../tasks.md:69,110`).

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/spec.md:105]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/spec.md:17]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/spec.md:1-40]

**Claim**: the parent packet's only authored document misreports the completion state of six of its nine children, and its continuity block names work that is already done.
**evidenceRefs**: the phase-map rows and the per-child counts above, each read from the child's own `spec.md` metadata and `tasks.md`/`acceptance-criteria.md` this iteration.
**counterevidenceSought**: checked whether the parent map records something other than completion (its column header is `Status` and its values are the same vocabulary the children use); checked whether a later child could have been reopened (005, 006 and 009 each read `Status | Complete` and `Closeable: Yes`).
**alternativeExplanation**: the map may be intentionally frozen at the last parent-level save, with children owning their own truth. Rejected as an explanation for the *values* because the same document's `Handoff Criteria` field instructs that each phase validates on its own, and a status column that is six phases wrong carries no signal at all.
**finalSeverity**: P1 — the parent document is the packet's entry point; a reader who stops there concludes 70% of the work is unstarted.
**confidence**: 0.95
**downgradeTrigger**: a `graph-metadata.json` or orchestrator script that derives the displayed status from a source other than this table, and a documented convention that the table is not authoritative.

#### R1-P1-003 — Phase 004 holds `AC-014` `Unmet` on a premise the tree contradicts, which pins the phase at 10%

`004-.../acceptance-criteria.md:73` reads `... — remaining: neither scratch/phase-baseline.md nor scratch/phase-result.md exists (T002 takes the 001-dataset fallback until the 002 baseline lands; T072) | Unmet`. Both files exist:

```
$ ls specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/scratch/
cache-adoption-runs.md  cache-probe  checkout-probe.md  decisions.md  gate-fix.md
npm-dedupe.md  phase-baseline.md  phase-result.md  probe-branch-approval.md
```

The same file's other rows cite content inside those files: AC-005 and AC-006 say "recorded under `## R14 warm run` in `scratch/phase-result.md`" (`acceptance-criteria.md:65-66`), AC-007 says "recorded under `## R15 merge`" (`:67`), AC-013 says "Recorded under `## Final gates` in `scratch/phase-result.md`" (`:71`). The narrative at `:105` narrows the claim instead — "`scratch/phase-result.md` holds the R12 gate, R14 cold and warm runs but not the 14-row delta table" — so the row and its own explanation disagree about what is missing.

The consequence is a closure gate that cannot open on evidence that exists: `004-.../implementation-summary.md:45` reads `Status | In progress`, `004-.../acceptance-criteria.md:101` reads `Closeable: No`, and the frontmatter records `completion_pct: 10` while all 71 bracketed tasks are `[x]`.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/acceptance-criteria.md:73]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/acceptance-criteria.md:105]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/implementation-summary.md:45]

**Claim**: AC-014's `Unmet` rests on "neither file exists", which is false, so the row's status is not evidence-derived.
**evidenceRefs**: the `ls` output above; `acceptance-criteria.md:65-71` citing those files' contents; `:105` stating a narrower gap than the row does.
**counterevidenceSought**: checked for a second scratch root (the child has exactly one `scratch/`); checked whether `phase-baseline.md` and `phase-result.md` could be empty placeholders (both carry sections other rows quote); checked whether the delta table the row wants is genuinely absent — `:105` says it is, which is a different and narrower gap than the row records.
**alternativeExplanation**: the row may be a snapshot from before T072 and simply never refreshed, with `:105` being the current truth. That reading is consistent with the evidence and is the more likely one — it makes the defect a stale status cell rather than a wrong gate, which is why this stays P1 and not P0.
**finalSeverity**: P1 — an `Unmet` row is the packet's closure blocker; a false premise in it means the phase cannot close for a reason nobody can act on.
**confidence**: 0.9
**downgradeTrigger**: a delta table genuinely absent from `scratch/phase-result.md` and no other file supplying the 14 rows, plus a row text that says so.

### P2 Findings

#### R1-P2-001 — Phase 002's closure statement contradicts its own T021 evidence

`002-.../acceptance-criteria.md:92` ends "The closure commit (T021) is made by the orchestrator and does not exist yet." `002-.../tasks.md:689` records "the closure edits landed as commit `03baa89ac6`, `docs(spec): close the rebuild fan-out phase on the measured band`, and `git merge-base --is-ancestor 03baa89ac6 origin/main` printed `on-main` (observed 2026-10-25)", and `tasks.md:724` repeats it in the completion criteria. `git log --oneline -3 03baa89ac6` returns the commit.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/acceptance-criteria.md:92]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/tasks.md:689]

#### R1-P2-002 — Phase 002's AC-003 cites the guarding test case at the wrong line

`002-.../acceptance-criteria.md:59` cites "the new case sits at .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts:895"; the case opens at `:897` (`grep -n "marks the rebuild commit" ...` returns `897`). The `SKIP_TOKEN` constant is correctly cited at `:85`. The same drift appears in `002-.../tasks.md` T009's "Done" line, which says `:895`.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/acceptance-criteria.md:59]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts:897]

---

## 3. TRACEABILITY CHECKS

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | 002's token, filters, README rows and vitest case all exist at the cited lines; 007's documents assert the opposite of the tree; 004's AC-014 asserts the opposite of its own scratch directory. |
| `checklist_evidence` | core | partial | 002, 003, 005, 006 and 009 carry per-check `[EVIDENCE:]` lines that name observable commands; 007's 13 `Unmet` rows carry no evidence at all while its tasks claim completion; 004's `Unmet` row names a file state that is false. |
| `skill_agent` | overlay | notApplicable | The target is a spec packet, not a skill or agent surface. Phase 006's `sk-code-ci` surface is reviewed in a later iteration. |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition is in the review scope. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog entry is claimed by this packet. |
| `playbook_capability` | overlay | notApplicable | No playbook is claimed by this packet. |

Parent-to-child reconciliation result: 3 of 9 phases agree between parent map and child documents (001, 004, 008); 6 disagree (002, 003, 005, 006, 007, 009). Child-internal reconciliation result: 002 and 004 each carry one stale completion statement; 007 carries a whole-document inversion.

---

## 4. RULED OUT

- **Parent map is derived, not authored.** Ruled out: the table is static markdown in the only authored parent document, with no generator marker and no `graph-metadata.json` field feeding it.
- **007 rolled back after the edits.** Ruled out: no revert commit in `git log` for the four surfaces, and the edits are present in the working tree this review reads.
- **`008-consolidation-decision` is stale too.** Ruled out: 008 is genuinely unstarted — `tasks.md:83` carries `T002 [B]` blocked and `acceptance-criteria.md:96` reads `Closeable: No` with 0 of 9 rows `Met`, which is consistent with the parent map's `Planned`.

---

## 5. VERDICT

Three P1 findings: one whole-phase completion inversion (007), one six-phase stale parent map plus continuity block, and one acceptance row held `Unmet` on a false premise (004). Two P2 findings: a closure statement that contradicts its own task evidence (002) and a stale line citation (002). No P0: nothing in this iteration shows the packet's implemented work to be wrong, only that the packet misreports which work exists.

Review verdict: CONDITIONAL
