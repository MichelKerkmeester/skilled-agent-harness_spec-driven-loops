---
title: "Acceptance Criteria: Phase 15: deep-review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep review acceptance criteria"
  - "phase 15 deep review acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: deep-review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skilled-bots/003-openbot-parity-build/015-deep-review`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every command runs from the repository root and needs no tty. Export the two variables once, then run any Verification cell as written:

```bash
P=specs/system-skilled-bots/003-openbot-parity-build; R=$P/015-deep-review/review
```

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given phase 014's folder, When `validate.sh --strict` runs on it, Then it prints `RESULT: PASSED` and every row in its `acceptance-criteria.md` reads `Met` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P/014-skilled-and-doc-alignment --strict` prints `RESULT: PASSED`, and `rg -c '\| Met \| - \|$' $P/014-skilled-and-doc-alignment/acceptance-criteria.md` prints the same number as `rg -c '^\| AC-[0-9]' $P/014-skilled-and-doc-alignment/acceptance-criteria.md`. A validator line alone is not the gate, because 014's own criteria are what say its work is done | Unmet | - |
| AC-002 | REQ-002 | Given the review packet, When the config and the scope file are read, Then `depthMode` is `expansive`, `reviewDimensions` is the four canonical ids and the scope file names the executor audit and the CI workflow | `node -e "const c=require('./$R/deep-review-config.json'); console.log(c.antiConvergence.depthMode, c.reviewDimensions.join(','))"` prints `expansive correctness,security,traceability,maintainability`. `rg -c -F '.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts' $R/fanout-review-scope.txt` prints `1` and `rg -c -F '.github/workflows/bots-runtime.yml' $R/fanout-review-scope.txt` prints `1`, because the build changed both files outside the skill and the five lineages read only what the scope file names | Unmet | - |
| AC-003 | REQ-003 | Given the merged summary, When it is read, Then it lists five lineages and orphaned none, and the five are the count after the fallback replaced any absent binary rather than the count of binaries the host happened to have | `node -e "const s=require('./$R/orchestration-summary.json'); console.log(s.total_cli_lineages, s.orphaned_lineages.length)"` prints `5 0`, and `node -e "const s=require('./$R/orchestration-summary.json'); console.log(s.lineages.length)"` prints `5`. A host with fewer than five binaries still reads `5 0`, because the fallback re-runs the matrix with `--count=2` on the next executor in `plan.md` §8.3 | Unmet | - |
| AC-004 | REQ-004 | Given the registry after the P0 wave, When the severity counts are read, Then P0 is 0 and the ledger carries one row per finding | `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P0)"` prints `0`, and `rg -c '^\| F[0-9]' $R/fix-ledger.md` prints the same number as `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.openFindings.length)"` | Unmet | - |
| AC-005 | REQ-005 | Given the registry after the P1 wave, When the severity counts are read, Then P1 is 0 and every unfixed row reads `deferred` with a reason | `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P1)"` prints `0`, and `rg -c '^\| F[0-9].*\| (pass\|deferred) \|$' $R/fix-ledger.md` prints the same number as `rg -c '^\| F[0-9]' $R/fix-ledger.md` | Unmet | - |
| AC-006 | REQ-006 | Given the final state, When the runtime suite runs, Then it exits 0 with at least the count the setup run recorded | `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and prints at least the `suiteBaseline.tests` count `node -e "const p=require('./$R/preflight.json'); console.log(p.suiteBaseline.tests)"` prints. The floor is measured at setup from the post-013 run, so a build that deleted a phase's tests fails this row rather than passing it | Unmet | - |
| AC-007 | REQ-007 | Given the review config, When the stop settings are read, Then the threshold is 0.1 and the stuck threshold is 2, and the spec names the stop rule | `node -e "const c=require('./$R/deep-review-config.json'); console.log(c.convergenceThreshold, c.stuckThreshold)"` prints `0.1 2`, and `rg -c '^### Stop rule$' $P/015-deep-review/spec.md` prints `1` | Unmet | - |
| AC-008 | REQ-008 | Given the report, When its core headings and verdict are counted, Then there are nine core sections and one verdict line | `rg -c '^## (Executive Summary\|Planning Trigger\|Active Finding Registry\|Remediation Workstreams\|Spec Seed\|Plan Seed\|Traceability Status\|Deferred Items\|Audit Appendix)$' $R/review-report.md` prints `9`, and `rg -c '^Review verdict: ' $R/review-report.md` prints `1` | Unmet | - |
| AC-009 | REQ-009 | Given the final working tree, When the diff is filtered to the surfaces the review named, Then nothing remains | `git status --porcelain \| rg -v '^.. (\.skilled/bin/bots\.cjs\|\.skilled/skills/system-skilled-bots/\|.skilled/crates/bots-tui/\|\.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit\.ts\|\.skilled/skills/system-deep-loop/runtime/tests/(unit/)?(executor-audit\|dispatch-receipts)\|\.github/workflows/bots-runtime\.yml\|specs/system-skilled-bots/003-openbot-parity-build/)' \| wc -l` prints `0` | Unmet | - |
| AC-010 | REQ-010 | Given the implementation summary, When it is read, Then it names the verdict, the counts by severity and the fix list | `rg -c 'P0\|P1' $P/015-deep-review/implementation-summary.md` prints at least `1`, and `rg -c '^## ' $P/015-deep-review/implementation-summary.md` prints at least `1` | Unmet | - |
| AC-011 | REQ-011 | Given the three review inputs, When the seeded intake finishes and before any lineage spawns, Then every row of every input is a seeded finding with a source, a phase and a severity | `node -e "const s=require('./$R/seeded-findings.json'); console.log(s.seededCount===s.rows.length, s.sources.length===3)"` prints `true true`, and `node -e "const s=require('./$R/seeded-findings.json'); console.log(s.rows.every(r=>r.source&&r.phase&&r.severity))"` prints `true`. The counts are a relation and not a number, because how many rows the three inputs hold is a fact about the build and not about this criterion. A missing input appears in `missingSources` with its reason and does not stop the run | Unmet | - |
| AC-012 | REQ-012 | Given the finished fix ledger, When the scenarios whose owning phase a fix touched are re-run, Then each result is recorded with its evidence path, no result reads `FAIL`, and no result reads `SKIP` for a missing verb or a missing field | `node -e "const s=require('./$R/scenario-rerun.json'); console.log(s.rerunCount===s.scenarios.length, s.failedCount===s.scenarios.filter(x=>x.result==='FAIL').length)"` prints `true true`, and `node -e "const s=require('./$R/scenario-rerun.json'); console.log(s.scenarios.every(x=>x.result&&x.evidencePath))"` prints `true`. The counts are a relation and not a number, because how many scenarios a fix pass touches is a fact about the run. A `FAIL` becomes a new finding and blocks the close. A `SKIP` whose reason names a missing verb or field makes the verdict `CONDITIONAL` under `design/state-machines.md` section 5, because phases 001 to 011 are closed before the corpus runs | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Twelve rows, one per requirement. AC-001 is the gate on every other row: the review reads a checked surface or it does not start. It is `Unmet` today, because phase 014's own criteria are not all `Met` yet, so no row past the precondition can be checked. A validator line on 014 is not the gate on its own, since 014's criteria are what say its work is done.

Two rows carry the inputs the plan-depth research added. AC-011 holds the seeded intake, so a product failure 013 or 014 filed is a finding before the first lineage spawns rather than something the review might rediscover. AC-012 holds the scenario re-run, so a fix that breaks a scenario 013 already proved is caught before the close rather than after it. Both are checked against `design/fixtures/`, which carries a worked example of each record, so a builder can run the command before the real run exists.

AC-003 reads five lineages after the fallback, not five binaries on the host. A host with one binary still closes on `5 0`, because the fallback re-runs the matrix with `--count=2` on the next executor in `plan.md` §8.3.
<!-- /ANCHOR:closure -->
