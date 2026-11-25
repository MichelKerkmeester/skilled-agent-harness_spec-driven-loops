---
title: "Acceptance Criteria: Phase 14: deep-review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep review acceptance criteria"
  - "phase 14 deep review acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 14: deep-review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skilled-bots/003-openbot-parity-build/014-deep-review`
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
P=specs/system-skilled-bots/003-openbot-parity-build; R=$P/014-deep-review/review
```

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given phase 013's folder, When `validate.sh --strict` runs on it, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P/013-skilled-and-doc-alignment --strict` prints `RESULT: PASSED`. Observed on 2026-11-25: `Summary: Errors: 0  Warnings: 1`, `RESULT: PASSED` | Met | - |
| AC-002 | REQ-002 | Given the review packet, When the config is read, Then `depthMode` is `expansive` and `reviewDimensions` is the four canonical ids | `node -e "const c=require('./$R/deep-review-config.json'); console.log(c.antiConvergence.depthMode, c.reviewDimensions.join(','))"` prints `expansive correctness,security,traceability,maintainability` | Unmet | - |
| AC-003 | REQ-003 | Given the merged summary, When it is read, Then it lists five lineages and orphaned none | `node -e "const s=require('./$R/orchestration-summary.json'); console.log(s.total_cli_lineages, s.orphaned_lineages.length)"` prints `5 0` | Unmet | - |
| AC-004 | REQ-004 | Given the registry after the P0 wave, When the severity counts are read, Then P0 is 0 and the ledger carries one row per finding | `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P0)"` prints `0`, and `rg -c '^\| F[0-9]' $R/fix-ledger.md` prints the same number as `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.openFindings.length)"` | Unmet | - |
| AC-005 | REQ-005 | Given the registry after the P1 wave, When the severity counts are read, Then P1 is 0 and every unfixed row reads `deferred` with a reason | `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P1)"` prints `0`, and `rg -c '^\| F[0-9].*\| (pass\|deferred) \|$' $R/fix-ledger.md` prints the same number as `rg -c '^\| F[0-9]' $R/fix-ledger.md` | Unmet | - |
| AC-006 | REQ-006 | Given the final state, When the runtime suite runs, Then it exits 0 with at least 381 tests passing | `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and prints at least `Tests  381 passed` | Unmet | - |
| AC-007 | REQ-007 | Given the review config, When the stop settings are read, Then the threshold is 0.1 and the stuck threshold is 2, and the spec names the stop rule | `node -e "const c=require('./$R/deep-review-config.json'); console.log(c.convergenceThreshold, c.stuckThreshold)"` prints `0.1 2`, and `rg -c '^### Stop rule$' $P/014-deep-review/spec.md` prints `1` | Unmet | - |
| AC-008 | REQ-008 | Given the report, When its core headings and verdict are counted, Then there are nine core sections and one verdict line | `rg -c '^## (Executive Summary\|Planning Trigger\|Active Finding Registry\|Remediation Workstreams\|Spec Seed\|Plan Seed\|Traceability Status\|Deferred Items\|Audit Appendix)$' $R/review-report.md` prints `9`, and `rg -c '^Review verdict: ' $R/review-report.md` prints `1` | Unmet | - |
| AC-009 | REQ-009 | Given the final working tree, When the diff is filtered to the surfaces the review named, Then nothing remains | `git status --porcelain \| rg -v '^.. (\.skilled/(bin/bots\.cjs\|skills/system-skilled-bots/(runtime/(lib\|tests)/\|scripts/bot-check\.cjs))\|specs/system-skilled-bots/003-openbot-parity-build/)' \| wc -l` prints `0` | Unmet | - |
| AC-010 | REQ-010 | Given the implementation summary, When it is read, Then it names the verdict, the counts by severity and the fix list | `rg -c 'P0\|P1' $P/014-deep-review/implementation-summary.md` prints at least `1`, and `rg -c '^## ' $P/014-deep-review/implementation-summary.md` prints at least `1` | Unmet | - |

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

AC-002 is unmet: the review packet does not exist yet, so no row past the precondition can be checked. AC-001 is the one row already observed passing, and it stays the gate on every other row.
<!-- /ANCHOR:closure -->
