---
title: Deep Review Report, packet 039 merge
description: Ten-iteration deep review of packet 039 as merged to main in 59e95420f3, range bd79708c2f..59e95420f3.
---

# Deep Review Report

## 1. Executive Summary

- Overall verdict: PASS
- hasAdvisories: true
- hasSearchDebt: true (13 deferred or blocked search-ledger rows, see section 9)
- Active findings after dedupe: P0 0, P1 0, P2 2. The reducer registry counts three P2 rows because iteration 8 reused the id R1-P2-001 for a refinement of the same defect (see section 3).
- Review scope: 49 files. They are the 19 non-generated files the range changed outside specs/ (the relaunch wrapper, core, Claude Stop adapter, CLI, seven relaunch test files, two OpenCode plugin tests, the handoff command, the sk-git skill and two manual-testing playbooks), plus packet 039 spec.md, goal.md and the spec.md and implementation-summary.md of children 001 to 014.
- Iterations: 10 dispatched, 9 complete, 1 recorded as error (iteration 5). Stop reason: maxIterationsReached (stop policy max-iterations).
- Executor: cli-codex, model gpt-6-luna, reasoning xhigh, service tier fast, for every iteration.
- Operator review focus: The code and docs packet 039 merged to main as 59e95420f3, range bd79708c2f..59e95420f3: skilled-loop wrapper notice and log, parked-record stamp, record without handoff, goal fallback bound, goal_ended carry, conformance stamp pin, title carry, question dialog refusal.

## 2. Planning Trigger

`/speckit:plan` is not required: no P0 or P1 is active. The two P2 advisories are small enough to fold into one follow-up child.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/bin/skilled-loop:1208", "title": "An empty startup checksum is not guarded, so a later readable checksum prints a false wrapper-changed notice and log line; README.md:112 states the opposite"},
    {"id": "R10-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md", "title": "The feature catalog does not describe the new wrapper-change notice or the wrapper-changed log event"}
  ],
  "remediationWorkstreams": ["Guard the startup checksum and align the README sentence", "Add the wrapper-change notice and log event to the feature catalog entry"],
  "specSeed": ["The wrapper treats an empty checksum on either side of the comparison as unknown, never as a change"],
  "planSeed": ["Add a failing-first wrapper test where the startup read is empty and the hop read succeeds", "Skip the comparison when started_wrapper_checksum is empty", "Add one catalog sentence for the notice and the wrapper-changed event"],
  "findingClasses": ["correctness", "traceability"],
  "affectedSurfacesSeed": [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/README.md", ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### R1-P2-001 (P2, correctness, first seen iteration 1, refined iteration 8, re-verified iteration 10)

- Title: An empty startup checksum is treated as a known baseline, so a wrapper-changed notice can fire when nothing changed.
- File: `.skilled/bin/skilled-loop:1208` and `:1472`, with the documentation side at `.skilled/hooks/session-relaunch/README.md:112`.
- Evidence: `started_wrapper_checksum=$(wrapper_checksum)` at line 1208 stores whatever the read returns, and `wrapper_checksum` returns nothing when the file cannot be read (lines 33 to 35). The guard at line 1472 checks only that the hop checksum is non-empty. A startup read that comes back empty followed by a successful hop read therefore differs and prints the notice and logs `wrapper-changed`. README line 112 says an empty checksum "prints and logs nothing", which holds only for the hop side.
- Impact: a false restart note and a false `wrapper-changed` log line in the narrow window where a checkout replaces the file exactly as the loop starts. No hop is blocked.
- Fix recommendation: skip the comparison when `started_wrapper_checksum` is empty (or re-read it at the first hop), and make the README sentence name both sides.
- Disposition: active. Dedupe note: iteration 8 recorded the README side under the same id with `refinementOf: R1-P2-001` at the same file:line and cluster. The workflow's content-hash and file:line-plus-title dedupe would keep the two rows apart because the titles differ. This report merges them by id and refinement link, so they count as one finding.
- findingClass: correctness. scopeProof: lines 1208 and 1472 and README line 112 were added in the range. affectedSurfaceHints: wrapper startup checksum, hop comparison, stderr notice, relaunch.log.

### R10-P2-001 (P2, traceability, iteration 10)

- Title: The feature catalog omits the new wrapper-change notice and the `wrapper-changed` log event.
- File: `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` (Killer And Wrapper section, near line 53).
- Evidence: the range adds the notice and event at `.skilled/bin/skilled-loop:1473` to `:1479`. A search of the catalog entry for `wrapper-changed` and `changed on disk` returns nothing.
- Impact: the catalog under-describes shipped behavior. No runtime effect.
- Fix recommendation: add one sentence to the catalog entry naming the stderr note and the log event.
- Disposition: active. findingClass: traceability. scopeProof: the notice and event were introduced in the range.

## 4. Remediation Workstreams

1. P0: none.
2. P1: none.
3. P2 advisories: (a) guard the empty startup checksum and correct README line 112, with a failing-first wrapper test; (b) add the notice and log event to the feature catalog entry.

## 5. Spec Seed

- The wrapper treats an empty checksum on either side as unknown, never as proof of a change.
- The feature catalog entry for the relaunch loop names every operator-visible signal the wrapper emits.

## 6. Plan Seed

- Write a wrapper harness test that makes the startup read fail and the hop read succeed, and confirm it prints the notice today.
- Change the comparison at line 1472 to also require a non-empty `started_wrapper_checksum`.
- Rewrite README line 112 so the empty-checksum sentence covers both reads.
- Add the catalog sentence.

## 7. Traceability Status

Core protocols:
- `spec_code`: pass. Iteration 9 matched the question-dialog, missing-handoff, goal fallback and goal_ended, generated-title, conformance-stamp and OpenCode database-isolation claims to current source and tests.
- `checklist_evidence`: pass. Iteration 9 scanned 93 Met acceptance rows, 197 ticked tasks and 364 ticked checklist rows across children 001 to 014, and resolved all 188 cited file:line references. One observation, not raised as a finding: the wrapper unreadable-file acceptance row rests on source lines only, and no test forces the read failure.

Overlay protocols:
- `playbook_capability`: partial. The Claude missing-transcript scenario (deferredAt stamp and `missing-transcript-path` log) and the killer-timeout scenario match the code and tests (iteration 10). Pi and OpenCode adapter mapping was not opened.
- `feature_catalog_code`: partial, one gap (R10-P2-001).
- `skill_agent`: partial. `.skilled/skills/sk-git/SKILL.md:322` now makes the Commit-Id retention claim conditional on the replayed message keeping the trailer (iteration 9). The commit hook implementation was outside the declared target.
- `agent_cross_runtime`: partial. The new behavior reviewed was Claude-only where a recorded reason exists (Codex is left unstamped by recorded disposition). Full Pi and OpenCode producer mapping was not done.
- `AC_COVERAGE`: pass for the Met rows checked in iteration 9.

The strategy file lists the traceability protocols as "BLOCKED, do not retry". That label is a reducer artifact: it turns a deferred status into an exhausted-approach entry. The orchestrator overrode it for iterations 9 and 10, which then ran the crosswalk and the overlay checks.

## 8. Deferred Items

- The empty-startup-checksum edge (R1-P2-001) and the unreadable-file acceptance row have no executed test. Both rest on source reading.
- Pi and OpenCode adapter parity for the new behaviors was not mapped.
- No fix in the packet was proven by a live hop (recorded limitation, not re-raised).
- Reducer defect, outside this target: deferred traceability statuses are rendered as "BLOCKED, do not retry" in the strategy's Exhausted Approaches section.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Selected directions beyond the four dimensions (stop policy max-iterations): goal and title edge cases (6), dialog guard ordering (6), plugin test isolation and killer timing (7), playbooks and README (8), checklist and spec crosswalk (9), overlay protocols and re-verification (10).
- Remaining frontier: Pi and OpenCode adapter mapping, and an executed test for the empty-startup checksum.

## 9. Search Ledger

- hasSearchDebt: true. The reducer reports 13 search-debt rows across iterations 1 to 9, each deferred or blocked. Examples: a remaining-surface check on subagent-guard and adapter-conformance tests (iteration 1), goal and title provenance and handoffPath sibling reads (iteration 2), the sk-git feature catalog (iteration 3), question-dialog stop ordering (iteration 6), killer timeout margin and Pi plugin parity (iteration 7), Pi and OpenCode adapter claims (iteration 8), and the sk-git rebase id behavior in the hook (iteration 9).
- Several of those were closed by later iterations: the killer timeout margin and the Claude missing-transcript path (iteration 10), and the sk-git line (iteration 9, documentation side). The reducer keeps the original rows.
- Per the report contract, a non-empty search debt carries the dashboard verdict as CONDITIONAL. The derived verdict, from the active findings alone, is PASS with advisories.
- Clean search proof: iterations 2, 3, 4, 6, 7 and 9 returned no new findings over 11 to 38 files each, and each records its ruled-out directions in its iteration file.

## 10. Audit Appendix

Convergence summary:
- newFindingsRatio by iteration: 1: 1.0, 2: 0, 3: 0, 4: 0, 5: error, 6: 0, 7: 0, 8: 0.5, 9: 0, 10: 0.33.
- Graph convergence score rose from 0.4 at iteration 1 to 0.893 after iteration 10. Convergence was telemetry only under the max-iterations policy.

Coverage summary:
- Dimensions covered: correctness (1, 6), security (2, 7), traceability (3, 8, 9, 10), maintainability (4). All four covered.

Iteration log:
- 1 correctness, complete, 9 files, P2 +1 (R1-P2-001). The leaf hit the 13-call budget after its gateway write.
- 2 security, complete, 11 files, no new findings.
- 3 traceability, insight, 20 files, no new findings.
- 4 maintainability, complete, 24 files, no new findings.
- 5 correctness, error. The first dispatch reached the 13-call budget before recording its state row. The single redispatch refused because the write-once iteration-005.md already existed. Recorded through the gateway as an iteration_error row. Its partial narrative found nothing new.
- 6 correctness, insight, 12 files, no new findings.
- 7 security, insight, 32 files, no new findings.
- 8 traceability, complete after one redispatch, 12 files, README refinement of R1-P2-001.
- 9 traceability crosswalk, complete, 38 files, no new findings.
- 10 overlay protocols and re-verification, complete after one redispatch, 11 files, P2 +1 (R10-P2-001).

Ruled-out claims: no P0 or P1 survived. The question-dialog refusal, record without handoff, goal fallback bound, goal_ended carry, generated-title carry, conformance stamp pin, OPENCODE_DB isolation and the killer test margin were each read against source and tests and found consistent with their children's claims.

Sources reviewed: the 49 scope files above, plus the acceptance-criteria.md and tasks.md files of children 001 to 014 (iteration 9) and the feature catalog entry (iteration 10).

Write containment: the guard quarantined copies of paths under `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/` during iterations 8 and 10. Those paths belong to another session's concurrent work in that packet, including its own review lineage, and were left on disk unchanged.

Core Protocols: spec_code pass, checklist_evidence pass.
Overlay Protocols: playbook_capability partial, feature_catalog_code partial, skill_agent partial, agent_cross_runtime partial.
