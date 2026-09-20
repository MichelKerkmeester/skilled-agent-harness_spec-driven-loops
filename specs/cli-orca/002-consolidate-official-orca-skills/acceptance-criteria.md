---
title: "Acceptance Criteria: Consolidate Official Orca Skills Into Standalone cli-orca"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
---
# Acceptance Criteria: Consolidate Official Orca Skills Into Standalone cli-orca

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-orca/002-consolidate-official-orca-skills
**Level:** 3
**Status:** In Progress
**Date:** 2026-09-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new skill root, When the root metadata gate runs, Then it classifies the root as class S with no forbidden, missing or stale rows | `ci-skill-root-metadata.cjs` output, `checked=14 passed=14 failed=0` with `OK [S] cli-orca` | Met | - |
| AC-002 | REQ-002 | Given the hub after extraction, When the parent check runs, Then it reports nine modes whose signals, resources and manifest entries all agree | `parent-skill-check.cjs` output, all hard invariants passed with 0 warnings at nine modes | Met | - |
| AC-003 | REQ-003 | Given the repository after extraction, When the retired identifiers are searched, Then hits appear only in preserved changelog history and the moved benchmark evidence | `rg "mcp-tooling/mcp-orca-cli" .skilled/skills` excluding changelogs returns 0 live references | Met | - |
| AC-004 | REQ-004 | Given both cli-orca packets, When the strict validator runs, Then each prints `RESULT: PASSED` | `validate.sh --strict` on both packets prints `RESULT: PASSED` | Met | - |
| AC-005 | REQ-005 | Given the eight official snapshots, When each is compared with the vendored source, Then the bytes are identical and the provenance file records the release revision and digest | `cmp` plus digest comparison, 8 of 8 | Met | - |
| AC-006 | REQ-006 | Given the re-ingested advisor, When an Orca CLI prompt and an unrelated holdout prompt are submitted, Then the first recommends `cli-orca` and the second does not | Advisor replay, `cli-orca` first at `0.7` for the Orca phrase and `recommendations: []` for the OpenOrca holdout | Met | - |
| AC-007 | REQ-007 | Given the specs tree, When the track metadata is read, Then `specs/cli-orca` carries identity metadata and the mcp-tooling track no longer lists the moved packet | `specs/cli-orca/{description.json,graph-metadata.json}` present, and the mcp-tooling track metadata carries no Orca child | Met | - |
| AC-008 | REQ-008 | Given the fleet catalogs, When the class table is read, Then eight class-S roots are named and the cli family is described as CLI tool surfaces | `.skilled/skills/README.txt` names fourteen roots with `cli-*` at 2, and the root metadata contract lists eight class-S roots | Met | - |
| AC-009 | REQ-009 | Given each authored skill document, When the document validator runs, Then it reports zero blocking issues | Corpus sweep, `cli-orca docs checked=32 blocking=0` | Met | - |
| AC-010 | REQ-010 | Given the five-iteration review loop, When it finishes, Then each iteration record ends in a single verdict line, every iteration is appended to the ledger, and the loop report exists | `review/iterations/iteration-00N.md` verdict lines, `review/deep-review-state.jsonl`, `review/review-report.md` | Unmet | - |
| AC-011 | REQ-011 | Given the loop report, ledger and declared audit surfaces, When the fresh-context synthesis returns, Then the fix list tags every finding and cites the file and line it lands in | `review/synthesis-remediation-plan.md` | Unmet | - |
| AC-012 | REQ-012 | Given the prioritised fix list, When the remediation set lands and every gate is re-run, Then each change carries its proving check and no gate that passed at baseline now fails | Applied diffs plus `scratch/gate-results-final-review.md` compared against `scratch/gate-results-baseline-review.md` | Unmet | - |
| AC-013 | REQ-013 | Given the eight playbook scenarios, When they run in wave order, Then each records a verdict, a transcript, an exit status and a reason | `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--playbook-post-remediation/**` | Unmet | - |
| AC-014 | REQ-014 | Given the vendored snapshot, When the leaked-key pattern is searched across the packet tree, Then no live secret remains | `git grep -E "AIza[0-9A-Za-z_-]{35}" -- specs/cli-orca/` returns no hits after the ADR-009 redaction | Met | - |

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

The packet was reopened on the operator's instruction so that a deep review of the shipped skill, the remediation it justifies and the playbook run can be recorded as evidence. The original closure evidence stands: the sixteen-gate close-out suite passed with zero failing gates, and the captured output plus exit status of each gate lives in `scratch/gate-results.md`. Five criteria are unmet until the review cycle lands. Two limits stay open and are recorded rather than waived: the advisor recall hole for long mixed Orca prompts, and the hub compiled-routing posture of `stale-manifest`, which reports legacy authority while the prose router keeps serving.

<!-- /ANCHOR:closure -->
