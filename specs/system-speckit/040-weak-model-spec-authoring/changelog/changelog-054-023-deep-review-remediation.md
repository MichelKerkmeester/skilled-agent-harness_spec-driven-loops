---
title: "Changelog: Phase 23: deep-review-remediation [054-weak-model-spec-authoring/023-deep-review-remediation]"
description: "Chronological changelog for the Phase 23: deep-review-remediation phase."
trigger_phrases:
  - "weak model spec authoring deep review remediation changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-27

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/023-deep-review-remediation` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

An unfilled value token can no longer hide behind a quoted code fence in a v2.3 doc, and create.sh --path can no longer write a packet outside the repository through an existing symlink. The other nine findings of the deep review are fixed too, so the packet's records say what the repository holds.

### Added

- Rerun the build and the full spec-kit suite. Verify: npm run build exits 0 and npx vitest run prints 0 failed files.
- CHK-003 Dependencies identified: the runtime build, rebuilt before each test run.
- CHK-010 bash -n passes on create.sh and check-placeholders.sh, and npm run build exits 0.
- CHK-011 No new warning: the build prints no TypeScript error after the unused regex was removed.
- CHK-030 No hardcoded secrets: the diff adds none.

### Changed

- Merge the two lineages and adjudicate every P1 against the code (../review/review-report.md). Verify: fanout-merge.cjs printed "active_p0":0,"active_p1":4, and the report keeps 2 P1 after adjudication.
- [P] Strip a CRLF carriage return in the awk scanner and match only space or tab around a fence, as TS does. Verify: without the strip line, the CRLF rows print 2 failed; with it they pass.
- [P] Rewrite the shell rule's header, and remove the dead Draft-token branch in the shell and TS legacy paths. Verify: rg -n 'CLARIFICATION_MARKER_RE' $R/lib/validation/orchestrator.ts prints nothing.
- No [B] blocked tasks remaining
- Every row of acceptance-criteria.md is Met
- CHK-001 Requirements documented in spec.md: REQ-001 to REQ-006.

### Fixed

- Scaffold this phase and add map and transition rows to the parent (../spec.md). Verify: ls ../023-deep-review-remediation lists the six docs.
- [P] Close a token-gated fence only on its own marker, in both scanners ($R/lib/validation/orchestrator.ts, $R/cli/rules/check-placeholders.sh). Verify: before the fix, placeholder-token-gate.vitest.ts printed Tests 8 failed | 56 passed (64); after it, the file passes.
- [P] Snapshot only the .md and .json files the repair writes, by sha256 (orchestrator.ts). Verify: draft-auto-repair.vitest.ts passes.
- [P] Resolve an existing --path target before the containment checks, keep the name as given, and refuse the repository root ($R/cli/spec/create.sh). Verify: create-path-containment.vitest.ts passes, and its escape case failed before the fix with expected +0 not to be +0.
- [P] Record a disposition for each phase 020 audit finding (../020-alignment-audit-fixes/scratch/audit/findings.json). Verify: a node -e count prints 46 {"fixed":46}.
- Correct the docs and records: validation-rules.md, the three /speckit:* docs, phase 010 REQ-001, phase 021's commit state, and the parent goal and spec. Verify: rg -n 'calls now include' .skilled/commands/speckit prints nothing.

### Verification

- Fence rows on the old code - `Tests 8 failed \
- --path escape case on the old code - Failed with expected +0 not to be +0; passes after
- CRLF rows without the awk strip - 2 failed; pass with it
- Runtime build - npm run build exit 0
- Full spec-kit suite - `Test Files 301 passed \
- test-validation-extended.sh - PLACEHOLDER_FILLED 8/8, RESULT: PASSED
- Verdict blast radius - Two v2.3-or-later docs in specs/ hold a token and a fence, both in packet 054
- Hermes copies - PASS: 67 Hermes skill copies in sync

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modified | Fence matching, digest snapshot, dead branch removed |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` | Modified | Same fence matching, CRLF strip, true header, dead branch removed |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Judge an existing --path by its real target, refuse the root |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts` | Modified | Seven fence rows across both stamps and statuses |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-path-containment.vitest.ts` | Created | Outside link, broken link, file, root, inside link, new folder |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modified | A recursive run repairs each Draft child |
| `.skilled/commands/speckit/{plan,implement,complete}.md` | Modified | Warn-only rules without changelog tense |
| `.skilled/skills/system-spec-kit/SKILL.md, changelog/v2.12.5.0.md, Hermes copy` | Modified, Created | Release 2.12.5.0 |
| `../goal.md, ../spec.md, ../010-/spec.md, ../021-/` | Modified | Phase set, push record, REQ-001, commit state |
| `../020-alignment-audit-fixes/scratch/audit/findings.json` | Modified | 46 dispositions, all fixed, each with evidence |

### Follow-Ups

- Validate the packet. Verify: validate.sh specs/system-speckit/054-weak-model-spec-authoring --strict --recursive prints RESULT: PASSED for every folder.
- All tasks marked [x]
- CHK-FIX-007 Evidence is pinned to the phase commit once it exists.
- --track still follows a symlink. A track that exists as a link to another tree receives the packet there, by design. Remove the link first when that is not wanted.
- The deep review's DeepSeek lineage did not exit. Its pi process stayed idle after writing its report and was stopped by hand; the fan-out runner's stall watchdog warns but does not end a lineage whose work is done.
