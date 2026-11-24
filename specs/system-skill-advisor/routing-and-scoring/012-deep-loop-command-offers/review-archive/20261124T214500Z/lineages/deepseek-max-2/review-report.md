---
title: "Deep Review Report: deep-loop command offers, generation 9 lineage deepseek-max-2"
description: "One lineage of the generation 9 fan-out: seven iterations over specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers, traceability-led, with 0 P0, 0 P1 and 6 P2."
---

# Deep Review Report: deep-loop command offers (lineage deepseek-max-2)

## 1. Executive Summary

- **Verdict:** PASS with advisories (`hasAdvisories: true`). No active P0 and no active P1; six active P2.
- **Counts:** 0 P0, 0 P1, 6 P2, no search debt.
- **Stop:** `maxIterationsReached` — seven of seven iterations ran under `stopPolicy=max-iterations`; convergence before the cap was telemetry only.
- **Dimension coverage:** correctness, security, traceability and maintainability, each recorded with a completed review (1 of 4, 2 of 4, 3 of 4, and iterations 4 to 7).
- **Lead focus and how it was answered:** the focus asked for `spec_code` and `checklist_evidence` to be finished, for every REQ-001 to REQ-053 to be checked against the code or the ADR that records it, for every ticked task and every `Met` acceptance row to be checked against evidence in the tree, and for the twelfth fix round (T112 to T114) to be read closely. Iteration 4 swept all 53 REQ rows and completed `spec_code`; iteration 5 swept 141 ticked items and completed `checklist_evidence`; iteration 6 read the four overlay surfaces; iteration 7 traced generation 8's nine P2s to their closures. Findings carry full repo-relative paths throughout, as the focus required.
- **What it finds:** no correctness, security or behaviour defect that a real prompt reaches. The six P2s are: one child-boundary vetting gap on a second degraded brief path, two defects in the review reducer's strategy projection, one stale checklist count, and two documentation drifts (one requirement sentence, one reversed rule still stated on four surfaces).
- **Trend within this lineage:** iterations 1 to 3 produced 0, 1 and 2 findings; iterations 4 to 7 produced 1, 1, 1 and 0. The last iteration opened no new line of enquiry because every dimension and protocol was already recorded.
- **Run:** `fanout-deepseek-max-2-1795552859377-13gxwk`, a detached lineage of the generation 9 fan-out, `cli-pi` on `deepseek-v4.1-flash-1017` at max effort, session of 2026-11-24.

## 2. Scope & Method

- **Target:** `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 2). Read-only.
- **Scope:** the 72 files in `review/lineages/deepseek-max-2/review-scope-files.txt`, seeded from the declared change set. Every finding's `file` is a full repo-relative path, so the scope gate can match it.
- **Method:** direct reads, exact searches and scripted checks over the tree; no build, suite or probe run was performed, because this review may not run the repository's tooling. Where a claim rests on a suite or probe result, the review read the recorded probe file (`scratch/probes/results-after.json`, 69 rows) or the shared fixture (359 cases) rather than re-running either.
- **Untrusted input:** the packet documents and the code were treated as data. No embedded instruction was found or obeyed.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Location |
|----|----------|-----------|-------|----------|
| F-002-001 | P2 | security | The hook brief renders a child-supplied command without the owner check the CLI path applies | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:231` |
| F-003-001 | P2 | maintainability | The reducer writes a ruled-out direction as a heading and drops the reason that closed it | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2404` |
| F-003-002 | P2 | maintainability | A confirmed-clean surface is read as an exhausted direction when the iteration carries no Ruled Out heading | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:374` |
| F-004-001 | P2 | traceability | CHK-001 records a REQ count the tree no longer prints | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268` |
| F-005-001 | P2 | traceability | REQ-011 reads as a global drop of `autonomous research` while four surfaces still carry it | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235` |
| F-006-001 | P2 | traceability | Four documentation surfaces still state the blanket no-edit rule REQ-040 reversed | `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` |

## 4. Findings by Dimension

### Correctness (iteration 1) — 0 findings
The gate's branch order, the refused-phrase blanking, the refusal-after read, both no-edit guards and the reducer's one-ruling wording were read against their contract comments and the guard cases. Three candidate defects were ruled out as unobservable on the hub's own mode table or as bounded by the pattern's own span.

### Security (iteration 2) — 1 finding
- **F-002-001 (P2).** `trackedCommandForOwner` vets a child-supplied command on the CLI degraded path only; `buildSkillAdvisorBrief` sends the same rows to `renderAdvisorBrief`, where `commandLabel` prints the supplied command and policy without consulting the table. The case is table drift between the Python and native command tables, which would print a command the native table does not attribute to the row's skill on one degraded path and withhold it on the other. Reconciled against the prompt length cap, the parent-named downgrade for child sessions, and the policy `ask` both deep commands carry.

### Maintainability (iteration 3) — 2 findings
- **F-003-001 (P2).** The exhausted-approaches projection keys on the whole ruled-out list item and writes it twice, once as a heading and once as `What was tried`, while the reviewer's reason becomes one fixed sentence. The strategy therefore carries directions without the evidence that closed them.
- **F-003-002 (P2).** When an iteration file has no `Ruled Out` heading, the reducer falls back to `Confirmed-Clean Surfaces` and records clean surfaces as exhausted directions. 129 archived iteration files carry the heading the fallback matches, so a resumed or extended run over an archive mislabels passes as prohibitions.

### Traceability (iterations 4 to 7) — 3 findings
- **F-004-001 (P2).** CHK-001, a ticked P0 item, states that `rg -c '^\| REQ-' spec.md` prints 52; it prints 53.
- **F-005-001 (P2).** REQ-011 says `autonomous research` "was dropped" without the scope ADR-007 supplies, while the Python fallback and the mode packet still carry it.
- **F-006-001 (P2).** The feature catalog, the NC-012 playbook and the runtime module reference still say a no-edit clause withholds every command, which REQ-040 reversed for a read-only loop.

## 5. Per-Iteration Summary

| Iteration | Dimension | Focus | Findings | Verdict |
|-----------|-----------|-------|----------|---------|
| 1 | correctness | gate branch order and helpers | 0 | PASS |
| 2 | security | child-process boundary and both degraded brief paths | 1 P2 | PASS |
| 3 | maintainability | reducer strategy projection and the two-copy drift guard | 2 P2 | PASS |
| 4 | traceability | `spec_code`: all 53 REQ rows, ADR range, declared change set | 1 P2 | PASS |
| 5 | traceability | `checklist_evidence`: 141 ticks, open items, twelfth round | 1 P2 | PASS |
| 6 | traceability | overlay protocols: catalog, playbook, skill, mirrors | 1 P2 | PASS |
| 7 | traceability | closeout: generation 8's nine P2s, coverage, verdict path | 0 | PASS |

## 6. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | All 53 REQ rows swept by the symbols, constants and probe rows each names; each REQ has an owning acceptance row; the only absent names are the two REQ-011 removes on purpose. |
| `checklist_evidence` | pass | 141 ticked items swept; exactly T084, the completion criterion and CHK-020 are open and they agree with AC-040; the command-bearing ticks were re-run and hold; CHK-001's stale count is filed as F-004-001. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | partial | The catalog describes the gate's reads correctly and carries one stale no-edit rule (F-006-001). |
| `playbook_capability` | partial | NC-012 exists with six creation and git prompts whose expected signals hold; its gate-2 sentence carries the stale rule (F-006-001). |
| `skill_agent` | pass | The hub's mode table names the packet, command and agent; the removed depth triggers are absent from both mode packets; the hub names `/doctor:deep-loop` once. |
| `agent_cross_runtime` | pass | The canonical agent and both runtime mirrors are present; the packet's mirror-sync result is a dated tool observation this review may not re-run. |

### AC_COVERAGE

`advisory-shortfall`: one of 61 acceptance rows is `Unmet` (AC-040, the rerun itself), three are `Waived` and one `Superseded` with an ADR each, and 56 read `Met`. AC-040 is the row this lineage is part of; its status is the orchestrator's to settle, not a lineage's self-report.

## 7. Verdict & Release Readiness

- **Verdict:** PASS, with advisories.
- **Rule applied:** the verdict maps over findings active at the last iteration — no active P0, no active P1, six active P2, so PASS with `hasAdvisories: true`.
- **Release readiness:** `in-progress`. The stop reason is `maxIterationsReached`, not `converged`, and no active P0 exists, so the release state cannot read `converged` or `release-blocking` from this lineage alone. The cross-lineage merge and the orchestrator's terminal gates decide the run's state.

## 8. Deferred Items

- F-002-001, F-003-001, F-003-002, F-004-001, F-005-001 and F-006-001 are advisory: none blocks the packet's closure, and each names the file and line a fix would touch.
- The reducer registry for this lineage carries `findingClass: null`, `scopeProof: null` and `affectedSurfaceHints: []` for all six findings, because this run's delta `finding` rows omit the three fields the reducer's documented record shape expects. The delta files are write-once, so they were left as written; the fields are intact in the iteration narratives and in each iteration record, and a future lineage should copy them onto the delta row. This is a state limitation of this run, not a defect in the reviewed tree.
- The packet's own open item, AC-040 / T084, is not this lineage's to close. This report is evidence for it, not the claim itself.

## 9. Search Ledger

- **Bug classes searched:** branch-order precedence, bounded-window off-by-one, unsupported route shape, untrusted command string, policy downgrade bypass, unbounded input, projection data loss, section conflation, guard coverage gap, requirement without owner, symbol missing from tree, stale checklist count, unbacked waiver, catalog and playbook drift, skill and agent mismatch, mirror missing, unclosed prior finding, dimension gap, verdict misclassification.
- **Ruled out:** seventeen directions, listed in the iterations' `Ruled Out` sections and in the strategy's exhausted-approaches section.
- **Deferred:** none. **Blocked:** none.
- **Search debt:** none recorded.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached`, 7 of 7 iterations; the run made no attempt to converge early, because `stopPolicy=max-iterations` makes convergence telemetry only.
- **Coverage:** four of four configured dimensions; 22 distinct files were read across the iterations, and every finding names a full repo-relative `path:line`.
- **Ruled-out claims:** each carries the evidence that closed it, and each names the condition under which it would reopen.
- **Sources reviewed:** the packet's `spec.md`, `acceptance-criteria.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, `timeline.md`, `plan.md`, the probe and fixture files under `scratch/`, the advisor runtime's gate, scorer, renderer, brief and subprocess modules, the shared fixture and its guard suites, the deep-loop reducer, the two queued command documents and their assets, the hub router, the deep-loop skill and its mode packets, the feature catalog, the manual-testing playbook, and the two runtime agent mirrors.
- **Orchestration note:** this lineage wrote no `terminal_gates` row. The orchestrator computes it with `terminal-gates.cjs` after the run.

## Planning Packet

Each row is the structured form of an active finding, taken from the iteration record that raised it.

| Finding | Finding class | Scope proof | Affected surface hints |
|---------|---------------|-------------|------------------------|
| F-002-001 | instance-only | print site `render.ts:231`; unvetted input via `skill-advisor-brief.ts:541` and `subprocess.ts:187`; vetted sibling `skill-advisor-cli.ts:1571` | `runtime/lib/render.ts`, `runtime/lib/skill-advisor-brief.ts`, `hooks/claude/user-prompt-submit.ts` |
| F-003-001 | class-of-bug | key `reduce-state.cjs:407`; print sites `:2404` and `:2405`; blocked branch `:2411` and `:2413` | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` |
| F-003-002 | instance-only | fallback chain `reduce-state.cjs:374` feeding `ruledOut` at `:407` and the label at `:2402` | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` |
| F-004-001 | instance-only | claim `tasks.md:268`; count from `spec.md:220`; T082 at `tasks.md:164` | `tasks.md`, `acceptance-criteria.md` |
| F-005-001 | instance-only | sentence `spec.md:235`; scope `decision-record.md:627`; retained hit `skill_advisor.py:2227` | `spec.md`, `decision-record.md` |
| F-006-001 | class-of-bug | built rule `command-attach.ts:1621` and `:1686`; stale statements `advisor-recommend.md:33`, `:41`, `command-offer-fit-gates.md:23`, `lib/README.md:146` | the catalog page, the playbook leaf, the module reference |

Recommended next step: `/speckit:plan` over these six advisories if the operator wants the drift closed in this packet; otherwise they are advisory and the packet's own open row (AC-040) is the only blocker.

Review verdict: PASS
