# Deep Review Report — 053 CI Workflow Efficiency

**Target**: `specs/system-speckit/053-ci-workflow-efficiency` (spec-folder, Level 2 phase parent with nine Level 3 children)
**Lineage**: `fanout-deepseek-1792944728998-0esx2f`, generation 1, `lineageMode: new`
**Iterations**: 5 of 5 (`stopPolicy: max-iterations`)
**Dimensions**: correctness, security, traceability, maintainability — all four covered
**Report date**: 2026-10-25

---

## 1. EXECUTIVE SUMMARY

**Overall verdict: CONDITIONAL**

| Measure | Value |
|---|---|
| Active P0 | 0 |
| Active P1 | 4 |
| Active P2 | 12 |
| `hasAdvisories` | false (P2 advisories are carried, but the verdict is CONDITIONAL, so the flag stays false) |
| Iterations run | 5 (traceability, correctness, security, maintainability, frontier/adversarial) |
| Files reviewed | 64 packet documents, 32 workflows (44 jobs, parsed), 1 composite action, 1 gate script, 1 vitest suite, the `sk-code-ci` surface, the `/doctor:ci` router and its route manifest |
| Convergence score at close | 0.81 (telemetry only under `max-iterations`) |

**Review scope summary.** The packet plans and executes a CI cost reduction across 32 GitHub Actions workflows, adds a read-only `sk-code-ci` standards surface and a `/doctor:ci` command, and splits the work into nine phase children. Six children read `Complete` (001, 002, 003, 005, 006, 009), one is `In progress` (004), one is `Planned` with its work built (007), and one is genuinely unstarted (008, blocked on operator decision D8).

**What the review found.** The implementation is sound. Every structural property the packet claims was checked mechanically and holds: the `[skip ci]` token at `trigger-index-rebuild.yml:151` with its trailer still last and a guarding test at `trigger-index-rebuild-workflow.vitest.ts:897`; both `spec-kit-check.yml` filter entries; 30 workflows with PR-only `cancel-in-progress`; `fetch-depth: 2` on the deep-loop workflow; the composite setup action with five adoption sites; `hooks-node-tests.yml` merged and gone; four pip caches; the sparse checkout; 44 of 44 jobs with `timeout-minutes`; 32 of 32 workflows with a top-level `permissions:` block; 84 `vars.SKILLED_CI*` switch occurrences on every job except Dependabot's two; 89 of 89 remote actions pinned to full SHAs; no privileged PR trigger; no untrusted interpolation; the gate printing `RESULT: PASSED`. The `sk-code-ci` surface, its hub registration and the `/doctor:ci` router with its three routes all exist and are consistent with the tree.

What the packet gets wrong is **which of that work it says exists**. Four P1s, and they are all the same disease in different organs: a packet that reports its own state inaccurately. Phase 007 is the extreme case — its `spec.md`, its `acceptance-criteria.md` (13 of 13 rows `Unmet`, `Closeable: No`) and its `implementation-summary.md` ("Nothing yet … no job carries a `vars.SKILLED_CI` switch") all describe a tree that no longer exists, while its task list, its scratch evidence and the repository describe a phase that is essentially done. The parent phase map repeats the error at the top level, reporting six of nine children at the wrong status and a `completion_pct` of 13. Phase 007's task list is the mechanism that let this happen: 8 of its 102 headings carry no status marker at all, and they are precisely the five commit tasks and the three still-open ones, so every count anyone could run agrees the phase is finished.

The remaining twelve P2s are the normal tail: stale line and count citations (the 32-vs-33 workflow inventory recurs in the parent and in 009's decision record), closure statements that defer a commit their own task list records as landed, nine amended acceptance rows carrying two observations without saying which supersedes, nine children pointing at a `changelog/` folder that does not exist, and two security-standard gaps that fail closed (no `persist-credentials` rule; one of the two skip semantics undocumented).

---

## 2. PLANNING TRIGGER

`/speckit:plan` **is** required: four P1 findings need a remediation packet, and three of the four are documentation-state repairs that must land before the parent packet can be read as an accurate record. The fourth (the handoff criterion) needs an operator ruling or a one-line edit.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "CONDITIONAL",
    "hasAdvisories": false,
    "activeFindings": { "P0": 0, "P1": 4, "P2": 12 },
    "remediationWorkstreams": [
      {
        "id": "WS-1",
        "priority": "P1",
        "title": "Reconcile phase 007's completion state with the tree",
        "findings": ["R1-P1-001", "R4-P1-001"],
        "scope": [
          "specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/spec.md",
          "specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/acceptance-criteria.md",
          "specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/implementation-summary.md",
          "specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md"
        ],
        "exitCriteria": "Every one of the 102 task headings carries a status marker; the five commit tasks are marked from their commit records; T100-T102 read `[ ]`; the AC rows carry evidence for the work that is built and stay `Unmet` only where it is not; `implementation-summary.md` describes the delivered tree."
      },
      {
        "id": "WS-2",
        "priority": "P1",
        "title": "Refresh the parent phase map, continuity block and open questions from the children",
        "findings": ["R1-P1-002", "R5-P2-001"],
        "scope": ["specs/system-speckit/053-ci-workflow-efficiency/spec.md"],
        "exitCriteria": "The phase map matches each child's own `Status`; `completion_pct` reflects it; `next_safe_action` names work that is actually open; both open questions are closed with a pointer to phase 005's probe outcome and phase 009's D9 answer."
      },
      {
        "id": "WS-3",
        "priority": "P1",
        "title": "Settle the workflow count in the 006-to-009 handoff criterion",
        "findings": ["R2-P1-001", "R5-P2-002"],
        "scope": [
          "specs/system-speckit/053-ci-workflow-efficiency/spec.md",
          "specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/decision-record.md"
        ],
        "exitCriteria": "The handoff criterion states the count the way 009's AC-003 already does (equal to the `glob('.github/workflows/*.yml')` result), and no operative sentence states 33."
      },
      {
        "id": "WS-4",
        "priority": "P2",
        "title": "Correct stale evidence clauses and closure statements",
        "findings": ["R1-P1-003", "R1-P2-001", "R1-P2-002", "R2-P2-002", "R4-P2-001", "R4-P2-002"],
        "scope": [
          "specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal",
          "specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning",
          "specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring",
          "specs/system-speckit/053-ci-workflow-efficiency/00*/spec.md"
        ],
        "exitCriteria": "004's AC-014 states the real gap (the missing 14-row delta); 002's and 009's closure statements agree with their T021/T033 records; the `:895` citation reads `:897`; a `changelog/` folder exists or the instruction is removed; amended rows mark which observation supersedes."
      },
      {
        "id": "WS-5",
        "priority": "P2",
        "title": "Close the two standards gaps the security pass found",
        "findings": ["R3-P2-001", "R3-P2-002", "R2-P2-001"],
        "scope": [
          ".skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md",
          ".skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md",
          "specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md"
        ],
        "exitCriteria": "The standard carries a `persist-credentials` row; one place states both skip semantics and their opposite effects on required checks; 005's AC-002 says which run proved the concurrency."
      }
    ],
    "specSeed": [
      "A phase packet's `Status`, `Closeable`, `completion_pct` and `implementation-summary` are one claim written four times; a change to any of them is a change to all of them.",
      "A task list is a completion gate only if every task can be in a state the gate can read; a heading without a marker is a task outside the gate.",
      "The parent of a phase packet is the entry point a reader trusts first; a status column that disagrees with six of nine children carries no signal and teaches the reader to distrust the rest.",
      "A count in a gate criterion is a dependency on a mutable tree; state it as the expression that produces it, not as a number."
    ],
    "planSeed": [
      "Add a `tasks.md` lint that fails a `### T` heading with no `[ ]`, `[x]`, `[P]` or `[B]` marker.",
      "Add a parent-map reconciliation check that compares each phase row against the child's `spec.md` `Status` and fails on disagreement.",
      "Add a closure-statement check that fails when the statement defers a commit the same packet's task list records as landed.",
      "Add a `changelog/` existence check for every packet whose children instruct a changelog refresh.",
      "Replace numeric counts in handoff criteria with the expression that yields them."
    ],
    "findingClasses": [
      "completion_state_contradiction",
      "task_status_gate_gap",
      "stale_gate_criterion",
      "stale_evidence_clause",
      "broken_cross_reference",
      "unstated_standard_rule"
    ],
    "affectedSurfacesSeed": [
      "specs/system-speckit/053-ci-workflow-efficiency/spec.md",
      "specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/{spec,acceptance-criteria,implementation-summary,tasks}.md",
      "specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/acceptance-criteria.md",
      "specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/{acceptance-criteria,decision-record}.md",
      ".skilled/skills/sk-code/sk-code-ci/references/{ci-workflow-standards,job-shape-rules}.md"
    ],
    "fixCompletenessRequired": true
  }
}
```

---

## 3. ACTIVE FINDING REGISTRY

Ids are stable once written; severity is the field that decides the verdict. `R1-P1-003` keeps its original id but is P2 (downgraded on adversarial re-check, recorded in iteration 5 as `R5-P2-003`).

### P0 — Blockers (0)

None.

### P1 — Required (4)

| ID | Title | Dimension | Evidence | Impact | Fix | Finding class |
|---|---|---|---|---|---|---|
| R1-P1-001 | Phase 007's completion state is inverted: four documents say "not built", the tree says built | traceability | `007-.../spec.md:36`, `007-.../implementation-summary.md:43,52`, `007-.../acceptance-criteria.md:98` against `.github/workflows/dependabot-auto-merge.yml:41` and a PyYAML parse returning `no-timeout []`, `no-switch` = Dependabot's two jobs only | An operator following the packet re-runs 94 tasks against 32 already-edited workflows, and the closure gate cannot open on work that exists | Rewrite the four documents from the tree and the phase's own scratch records (WS-1) | `completion_state_contradiction` |
| R1-P1-002 | The parent phase map and continuity block are stale for six of nine phases | traceability | `spec.md:105-112` against each child's `spec.md` metadata; `spec.md:17,25` | The packet's entry point reports 70% of the work unstarted | Reconcile the map and the continuity block from the children (WS-2) | `completion_state_contradiction` |
| R2-P1-001 | The packet's own standard says 32 workflows, the parent and the 006→009 handoff criterion say 33 | correctness | `spec.md:130` against `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md:37` and `009-.../acceptance-criteria.md:61` | A handoff gate that cannot be satisfied as written | State the criterion as the glob expression 009 already uses (WS-3) | `stale_gate_criterion` |
| R4-P1-001 | Phase 007's task list cannot express its own completion: 8 of 102 headings carry no status marker | maintainability | `007-.../tasks.md:621,678,1580,2455,2488,2595,2618,2644` and `:2682` | The completion gate is blind to the five commit tasks and the three open ones — the mechanism behind R1-P1-001 | Mark all 102 headings, tick the five commits from their records, leave T100-T102 `[ ]` (WS-1) | `task_status_gate_gap` |

### P2 — Advisories (12)

| ID | Title | Evidence | Disposition |
|---|---|---|---|
| R1-P1-003 | 004's AC-014 is `Unmet` on a premise the tree contradicts (both named files exist), pinning the phase at 10% | `004-.../acceptance-criteria.md:73` against the `scratch/` listing; the delta table itself is genuinely absent (`scratch/phase-result.md:78`) | Downgraded to P2 in iteration 5. Fix the evidence clause; the `Unmet` stands on the real gap (WS-4) |
| R1-P2-001 | 002's closure statement says the closure commit "does not exist yet" while T021 records it on `main` | `002-.../acceptance-criteria.md:92` against `002-.../tasks.md:689` | Fix the last sentence (WS-4) |
| R1-P2-002 | 002's AC-003 cites the guarding test case at `:895`; it opens at `:897` | `002-.../acceptance-criteria.md:59` against the suite | Fix the citation (WS-4) |
| R2-P2-001 | 005 proves a concurrent two-process step by running the halves one after the other | `005-.../acceptance-criteria.md:58` against `spec-kit-check.yml:147` | Say which run proved the concurrency (WS-5) |
| R2-P2-002 | 009's closure statement defers a closure commit its own task list records as landed | `009-.../acceptance-criteria.md:122` against `009-.../tasks.md:1232` | Fix the last sentence (WS-4) |
| R3-P2-001 | The CI standard states no `persist-credentials` rule; the one write-scoped job relies on convention | `trigger-index-rebuild.yml:203`; `rg -c persist-credentials` over the standard returns nothing | Add the rule (WS-5) |
| R3-P2-002 | The packet documents one of its two skip semantics, which fail in opposite directions | `007-.../spec.md:195` (job skip → Success) vs `002-.../spec.md:239` (workflow skip → Pending, blocks merge) | Document both in one place (WS-5) |
| R4-P2-001 | All nine child packets instruct a changelog refresh in a folder that does not exist | `002-.../spec.md:68` and the same line in eight siblings; no `changelog/` at the packet root | Create the folder or drop the instruction (WS-4) |
| R4-P2-002 | Nine amended acceptance rows carry two "observed" clauses with no supersession marker | 002 AC-005/AC-007, 003 AC-013/AC-016/AC-017, 004 AC-013/AC-015/AC-017, 005 AC-006 | Use the `**Amendment (date, subject)**` form 002's AC-006 already uses (WS-4) |
| R5-P2-001 | The parent's OPEN QUESTIONS block lists two questions its own children have answered | `spec.md:186-187` against `005-.../acceptance-criteria.md:57` and `009-.../decision-record.md:74` | Close both with a pointer (WS-2) |
| R5-P2-002 | 009's decision record still describes the report as parsing 33 YAML files | `009-.../decision-record.md:861` against the 32-file tree | Fix the count (WS-3) |
| R5-P2-003 | Adjudication record: R1-P1-003 downgraded to P2 | iteration 5, section 2 | Record only |

---

## 4. REMEDIATION WORKSTREAMS

Ordered P1 first. WS-1 and WS-2 are the same repair at two levels and should land together; WS-4 and WS-5 can follow in any order.

1. **WS-1 — Phase 007's state (R1-P1-001, R4-P1-001).** Start from the task list, not the summary: mark all 102 headings, tick the five commit tasks from `scratch/commit-message-*.txt` and `git log`, leave T100-T102 `[ ]`, then rewrite `spec.md`'s status, `acceptance-criteria.md`'s rows with the evidence that already exists in `scratch/`, and `implementation-summary.md`'s "What Was Built". The phase still cannot close: T100 waits on 24 hours of run data and T101's gates have not run.
2. **WS-2 — Parent reconciliation (R1-P1-002, R5-P2-001).** Rebuild the phase map from the nine children's `spec.md` `Status` fields, set `completion_pct` from them, rewrite `next_safe_action` to name only open work, and close both open questions with a pointer to the answering artifact.
3. **WS-3 — Workflow count (R2-P1-001, R5-P2-002).** Replace the numeric 33 in the handoff criterion with the glob expression 009's AC-003 already uses; correct `009-.../decision-record.md:861`.
4. **WS-4 — Evidence and cross-reference repairs (R1-P1-003, R1-P2-001, R1-P2-002, R2-P2-002, R4-P2-001, R4-P2-002).** Six small edits, each with the current artifact in hand.
5. **WS-5 — Standards gaps (R3-P2-001, R3-P2-002, R2-P2-001).** Add the `persist-credentials` rule, state both skip semantics in one place, and name the run that proved 005's concurrency.

**P2 advisories not in a workstream:** none — all twelve are assigned above.

---

## 5. SPEC SEED

- A phase packet's `Status`, `Closeable`, `completion_pct` and `implementation-summary` are one claim written four times; changing one is changing all four.
- A task list is a completion gate only if every task can hold a state the gate can read. A heading with no marker is a task outside the gate, and the tasks most likely to be left unmarked are the commit tasks — the ones that prove the work landed.
- The parent of a phase packet is the surface a reader trusts first. A status column that disagrees with six of nine children teaches the reader to distrust the rest of the document.
- A count in a gate criterion is a dependency on a mutable tree. State the expression that produces it, not the number it produced on the day it was written.
- A closure statement is the last sentence a reader sees in the document that decides closure; "made by the orchestrator and does not exist yet" must not survive the commit that makes it.

---

## 6. PLAN SEED

- Add a `tasks.md` lint: a `### T` heading without `[ ]`, `[x]`, `[P]` or `[B]` fails the packet's own validation.
- Add a parent-map reconciliation check: each phase row must equal the child's `spec.md` `Status`.
- Add a closure-statement check: a statement that defers a commit the same packet's task list records as landed fails.
- Add a `changelog/` existence check wherever a child instructs a changelog refresh.
- Add a numeric-count check for handoff criteria: a bare integer describing a mutable tree fails in favour of the expression.
- Add a standard-coverage check: every `with:` key a workflow sets on `actions/checkout` in a write-scoped job must have a row in the CI standard.

---

## 7. TRACEABILITY STATUS

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | partial | Every implementation claim in 002, 003, 004, 005, 006 and 009 was checked against the tree and holds — token, filters, concurrency, checkout depth, composite action and its five adoption sites, the merge, pip caches, sparse checkout, the shard step, the hub registration, the doctor router, and the gate's own `RESULT: PASSED`. | 007's four documents assert the opposite of the tree; the 32-vs-33 count appears in the parent and in 009's decision record. |
| `checklist_evidence` | partial | 002, 003, 005, 006 and 009 carry per-check `[EVIDENCE:]` lines naming observable commands, and the gate output 004 records for AC-013 was reproduced exactly (`files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0`). | 007's 13 rows carry no evidence while its tasks claim completion; 004's AC-014 names a false file state; 005's AC-002 names a sequential run as its proof of a concurrent step. |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | partial | `sk-code-ci` is registered in `hub-router.json:36-39`, `mode-registry.json:79-89` and `SKILL.md:36`, and its rule data carries current counts (32 of 32, 44 of 44). It is one row short: no `persist-credentials` rule. |
| `agent_cross_runtime` | notApplicable | No agent definition is in the review target. |
| `feature_catalog_code` | notApplicable | No feature catalog entry is claimed by this packet. |
| `playbook_capability` | notApplicable | No playbook is claimed by this packet. |

### `AC_COVERAGE` signal

**exempt.** The target is a Level 2 spec folder, but it has no `checklist.md`: the verification checklists live inside each child's `tasks.md`. The lifecycle predicate for the advisory signal (`checklist.md` exists and `implementation-summary.md` is in-progress or later) is therefore not met, and the signal is exempt rather than disabled or short.

### Resource Map Coverage Gate

Skipped. `specs/system-speckit/053-ci-workflow-efficiency/resource-map.md` does not exist, so the gate is skipped by contract. No acceptance row in the packet claims map coverage.

---

## 8. DEFERRED ITEMS

- **Phase 008 (R27, D8)** is blocked by design: `008-.../tasks.md:83` carries `T002 [B]` and the phase holds 0 of 9 `Met` rows. It needs phases 002-007 landed plus a re-measurement, and the operator's D8 answer. No finding is filed against it.
- **Phase 007's T100-T102** need 24 hours of post-change run data and a gate run before the phase can close, regardless of how WS-1 repairs its documents.
- **Live GitHub verification** was unavailable to this lineage (no network): 002's three-rebuild `[]` results, 004's cold/warm runs and 005's five green `Spec-Kit Check` timings stand on the packet's own `gh` captures, which were read but not re-executed. Marked `blocked` in the search ledger rather than assumed.
- **The 001 research dataset** was sampled, not re-derived; the 3,812 runner-min/day baseline and the 2,191 post-change total are taken as recorded.

---

## DIMENSION EXPANSION MAP

| Item | State |
|---|---|
| Swept directions | `state_transition` (iteration 1), `template_drift` (iteration 4), `severity_inflation` (iteration 5), the five security bug classes (iteration 3) |
| Completed pivots | 0 (no divergent pivot was taken; the frontier pass in iteration 5 served the same purpose) |
| Failed pivots | 0 |
| Audited overrides | 1 — the R1-P1-003 downgrade, recorded in iteration 5 as R5-P2-003 |
| Selected review directions | traceability → correctness → security → maintainability → frontier/adversarial |
| Remaining frontier | Phase 001's research narrative (sampled only); the live GitHub run history (no network); phase 008 after D8 |

---

## 9. SEARCH LEDGER

**Search depth**: `reviewDepthSchemaVersion: 2` on all five iteration records; `scopeClass: complex`, `enforcement: strict`, `graphCoverageMode: graphless_fallback` (no coverage graph available in this lineage).

| Coverage | Values |
|---|---|
| Required bug classes | `state_transition`, `documentation_contradiction`, `evidence_integrity`, `missing_validation`, `off_by_one`, `credential_exposure`, `privilege_escalation`, `untrusted_input`, `supply_chain_pinning`, `cache_poisoning`, `template_drift`, `cross_reference_integrity`, `task_notation`, `evidence_supersession`, `open_question_staleness`, `severity_inflation` |
| Covered | 15 of 16 |
| Ruled out | `state_transition`, `template_drift`, `credential_exposure`, `privilege_escalation`, `untrusted_input`, `supply_chain_pinning`, `cache_poisoning`, `severity_inflation` |
| Deferred | none |
| Blocked | `live_run_verification` (no network in this lineage) |

**Ruled-out candidates (clean-search proof).** Each was searched for and eliminated with evidence, not assumed absent:

| Candidate | Why ruled out |
|---|---|
| 008 is stale rather than blocked | `T002 [B]` names its blocker; 0 of 9 rows `Met` |
| The skip token or its guard is missing | `trigger-index-rebuild.yml:151,152,33` and the suite case at `:897` |
| The shard step drops a file | The first process names the heavy file, so a rename fails loudly |
| The composite action is unused | Five call sites across three workflows |
| The Dependabot split left a write scope on the metadata job | `dependabot-auto-merge.yml:20-22` is read-only |
| A write token is reachable from untrusted PR code | No `pull_request_target` or `workflow_run`; the only PR-triggered write job runs `gh pr merge` behind a Dependabot-only condition |
| A secret is printed or shell-interpolated | Three references, all `env:`-scoped |
| The cache key lets a stale `dist` outlive a source change | Key includes the action file, lockfiles and tsconfigs; the walk stamps five outputs and the limitation is disclosed |
| `[skip ci]` is a merge bypass | The documented behaviour leaves required checks Pending, which blocks the merge |
| Anchor or template drift | 0 mismatches across 64 documents |
| 004 overstates its task count | 82 headings against the checklist's "82 tasks" |
| The D9 probe was assumed | `scratch/r28-probe.md` records `set exit=0` … `get-after-delete exit=1` |

**`searchDebt`**: none — no required bug class was deferred or blocked except live run verification, which is recorded as blocked rather than debt.

---

## 10. AUDIT APPENDIX

### Convergence summary

`stopPolicy: max-iterations` with `maxIterations: 5`. All five iterations ran; convergence was telemetry only. Final reducer values: `openFindingsCount` 16, `convergenceScore` 0.81, `searchDebtCount` 0, `corruptionCount` 0, dimension coverage 4 of 4.

| # | Dimension | Findings | P0/P1/P2 | Verdict line |
|---|---|---|---|---|
| 1 | traceability | 5 | 0/3/2 | CONDITIONAL |
| 2 | correctness | 3 | 0/1/2 | CONDITIONAL |
| 3 | security | 2 | 0/0/2 | PASS |
| 4 | maintainability | 3 | 0/1/2 | CONDITIONAL |
| 5 | frontier/adversarial | 3 (+1 downgrade) | 0/0/3 | PASS |

### Coverage summary

64 packet documents; 32 workflows and 44 jobs parsed; 1 composite action; 1 gate script executed; 1 vitest suite; the `sk-code-ci` surface (3 reference files); the `/doctor:ci` router, its `_routes.yaml` and `ci-report.cjs`; nine `acceptance-criteria.md` files (115 rows); nine `tasks.md` files; nine `implementation-summary.md` files; the parent `spec.md`, `graph-metadata.json` and `goal.md` by reference.

### Adversarial self-check

Every P1 was re-read against its source in iteration 5 with an explicit downgrade attempt. Three were confirmed (R1-P1-001 corroborated by `graph-metadata.json:201` naming 007 the last active child; R1-P1-002 confirmed because nothing regenerates the phase map; R2-P1-001 confirmed because the handoff happens after the merge that removed the 33rd workflow; R4-P1-001 confirmed because phase 002 marks its equivalent commit task). One was downgraded: R1-P1-003 from P1 to P2, because the gate it protects is genuine and only its evidence clause is false. No finding was withdrawn and none was upgraded.

### Sources reviewed

Parent: `spec.md`, `graph-metadata.json`, `description.json`. Children: `spec.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md` and `scratch/` listings for all nine, with full reads of 002, 004, 005, 007 and 009. Repository: `.github/workflows/*.yml` (all 32), `.github/workflows/README.md`, `.github/actions/setup/action.yml`, `.github/scripts/check-gate-inputs.sh`, `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts`, `.skilled/skills/system-spec-kit/vitest.config.ts`, `.skilled/skills/sk-code/` (SKILL.md, hub-router.json, mode-registry.json, `sk-code-ci/`), `.skilled/commands/doctor/` (ci.md, `_routes.yaml`, assets, `ci-report.cjs`).

### Continuity

No continuity save was performed and none is permitted in this lineage: the write surface is this directory. The lineage's own state is `deep-review-state.jsonl` (gateway-projected), `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `deep-review-strategy.md`, `resource-map.md`, `iterations/iteration-00{1..5}.md` and `deltas/iter-00{1..5}.jsonl`.
