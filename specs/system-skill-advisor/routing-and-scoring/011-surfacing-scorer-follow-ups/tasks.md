---
title: "Tasks: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check"
description: "Ordered tasks for the advisor surfacing follow-ups. Each completed task names its evidence. Evidence is the work record, plus the checks run for this packet."
trigger_phrases:
  - "surfacing scorer follow ups tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Shell variables used in this list:
- `R` is `.skilled/skills/system-skill-advisor/runtime/`.
- `P` is `specs/system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups/`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the Level 2 packet (`P`). Verify: `ls P` lists `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and `scratch`.
- [x] T002 Record the clean advisor baseline on origin/main `9cda2018330` (`P/scratch/advisor-baseline.txt`). Verify: `rg -n 'Tests ' P/scratch/advisor-baseline.txt` prints a line that reads `6 failed | 2389 passed | 8 skipped (2403)`.
- [x] T003 [P] Triage each reported claim against the scorer code and record a verdict for each (`P/scratch/work-record.md`). Verify: `rg -c '^\| [0-9] \|' P/scratch/work-record.md` prints 8.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add command phrase tolerance to the explicit lane (`R/lib/scorer/lanes/explicit.ts`). Verify: `rg -c '^\s*it\(' R/tests/scorer/command-phrase-tolerance.vitest.ts` prints 4, and the recorded run passed these tests after they failed before the change.
- [x] T005 Stop a single-word phrase from matching inside a hyphenated name (`R/lib/scorer/lanes/explicit.ts`, `hasPlainMention`). Verify: `rg -c '^\s*it\(' R/tests/name-mention-scoring.vitest.ts` prints 10, and the describe block at line 139 holds the 3 new tests. The recorded run passed them after they failed before the change.
- [x] T006 Skip the `review` token boost for ticket-status wording (`R/lib/scorer/lanes/explicit.ts`). Verify: `rg -c '^\s*it\(' R/tests/scorer/review-status-wording.vitest.ts` prints 2, and the recorded run passed them after they failed before the change.
- [x] T007 Read command bridges from the generated JSON at runtime, with the compiled block as fallback (`R/lib/scorer/command-bridge-loader.ts`, `R/lib/scorer/projection.ts`). Verify: `rg -c '^\s*it\(' R/tests/scorer/command-bridge-loader.vitest.ts` prints 3, and `rg -n 'loadCommandBridges' R/lib/scorer/projection.ts` prints the line that sets `COMMAND_BRIDGES`.
- [x] T008 Keep the wide-cluster floor at current behavior (`R/lib/scorer/ambiguity.ts`, `R/tests/scorer/advisor-quality-049-003.vitest.ts`). Operator decision on 2026-11-17. No code change. Verify: `git log --oneline -1 1c80022452b` prints `1c80022452b fix(system-skill-advisor): stop calling a confidence floor or a held skill a tie`.
- [x] T009 Keep the command ranking below the owner skill at current behavior (`R/lib/scorer/fusion.ts`). Operator decision on 2026-11-17. No code change. Verify: `sed -n '143p' specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md` prints the line that keeps the 0.08 command tie-break.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the advisor vitest suite after all four fixes, then `npm run build`. Verify: the recorded run printed 2407 passed, 0 failed and 8 skipped across 188 files, and `npm run build` exited 0 (`P/scratch/work-record.md`).
- [x] T011 Run the typecheck. Verify: `tsc --noEmit -p tsconfig.build.json` exited 0 (`P/scratch/work-record.md`).
- [x] T012 Run the vendoring project's corpus read-only on the clean build, then on the fixed build, after a daemon restart. Verify: the recorded main set shows top-1 19 of 36 on both builds, and surfaced commands rose from 1 of 7 to 2 of 7 (`P/scratch/work-record.md`).
- [x] T013 Check per-lane attribution on `advisor_recommend`, and close the claim with no code change. Verify: the recorded run with `"options":{"includeAttribution":true}` returns `laneBreakdown` and `why_recommended` on the ticket prompt (`P/scratch/work-record.md`).
- [x] T014 Check the named CLI prompts on the built CLI. Verify: the recorded results show the re-pin prompt surfaces `command-doctor-overlay-repin`, the ticket prompt tops mcp-tooling, and "review my code" stays with sk-code (`P/scratch/work-record.md`).
- [x] T015 Close the index freshness claim as not confirmed, with no code change. Verify: `rg -n 'inferred' P/scratch/work-record.md` prints the verdict line, which marks the verdict as inferred.
- [x] T016 Run `validate.sh --strict` until it prints `RESULT: PASSED`. Verify: the last run prints `RESULT: PASSED`. Evidence: `validate.sh --strict` printed `RESULT: PASSED` on 2026-11-17 after the implementation summary was written and `repair-derived.cjs --apply` re-derived the metadata.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T014)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task that waits on a decision stays `[ ]` and names the decision in its text. No task waits on a decision now, because both operator decisions were recorded on 2026-11-17.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` section 4 holds REQ-001 to REQ-008. Verify: `rg -c '^\| REQ-0' P/spec.md` prints 8.
- [x] CHK-002 [P0] `plan.md` section 4 names the three phases. Verify: `rg -c '^(Setup records|Implementation adds|Verification runs)' P/plan.md` prints 3.
- [x] CHK-003 [P1] Dependencies identified and listed in `plan.md` section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `tsc --noEmit -p tsconfig.build.json` exits 0 (recorded in the work record).
- [x] CHK-011 [P0] `npm run build` exits 0 (recorded in the work record).
- [x] CHK-012 [P1] Missing or malformed bridge JSON returns null, and the compiled block is used. The loader test covers both (recorded).
- [x] CHK-013 [P1] The loader renders the JSON the way the deriver renders the compiled block. The shipped-JSON test compares the two (recorded).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' P/acceptance-criteria.md` prints 8.
- [x] CHK-021 [P0] The named CLI prompts give the expected top result on the built CLI (recorded in T014).
- [x] CHK-022 [P1] Edge case: the test "leaves a bare problem word beside a phrase-matched skill" passed in the recorded run (`R/tests/scorer/doctor-handoff-command.vitest.ts`).
- [x] CHK-023 [P1] Error scenarios: the loader test covers a missing file and a malformed file (recorded).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: items 1, 4 and 5 are class-of-bug fixes in the shared phrase matcher and token boosts of `lanes/explicit.ts`. Item 6 is cross-consumer (`COMMAND_BRIDGES`).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `hasPlainMention` has three call sites, all in `lanes/explicit.ts`, and no other file defines one. `TOKEN_BOOSTS` is read only in `lanes/explicit.ts`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `COMMAND_BRIDGES` is consumed by `projection.ts`, `ambiguity.ts` (`OWNER_BY_BRIDGE_ID`) and the scorer README. `skill-graph-db.ts` reads the JSON file on its own. The loader parity test proves the consumers get the same rows. The scorer README is updated.
- [x] CHK-FIX-004 [P0] Security, path, parser, or redaction fixes include adversarial table tests. Evidence: the phrase changes carry negative tables: scattered words, missing leading word and skill rows in `command-phrase-tolerance.vitest.ts`, hyphen-joined words in `name-mention-scoring.vitest.ts`, and code-review wording in `review-status-wording.vitest.ts`.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: axes are prompt shape (exact, close wording, scattered, hyphen-joined, ticket status, code review) and row kind (command, skill). 12 new advisor tests, plus the 45-row vendoring prompt set before and after.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: N/A. The changed code reads no environment or global state (`process.env` and `globalThis` appear in none of the added lines). The loader reads one file path fixed by its own location.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Open: nothing is committed. The evidence sits on an uncommitted tree on top of `9cda2018330`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the changed files. Evidence: a scan of the diff and the new files for key, secret, password and token assignments found none.
- [x] CHK-031 [P0] Missing or malformed bridge JSON returns null, and the compiled block replaces it. The loader test covers this (recorded).
- [x] CHK-032 [P1] N/A: the change adds no auth or authz surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree on status and decisions. Evidence: spec.md and acceptance-criteria.md both say Complete, and both operator decisions read the same in spec, tasks and the implementation summary.
- [x] CHK-041 [P1] Code comments adequate. Evidence: each new rule carries a comment saying why. No comment names a packet, task or finding id.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: `lib/scorer/README.md` lists `command-bridge-loader.ts` and describes the runtime JSON read and its fallback.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only. Verify: `ls P/scratch` lists only `.gitkeep`, `advisor-baseline.txt`, `request-from-vendoring-project.md` and `work-record.md`.
- [x] CHK-051 [P1] `scratch/` cleaned before completion. Evidence: scratch keeps only the request, the work record and the baseline, which are the evidence for the closed claims. The temporary run files live outside the packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 7/12 |
| P1 Items | 13 | 7/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-17
<!-- /ANCHOR:summary -->

---
