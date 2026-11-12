---
title: "Tasks: Phase 5: point-chat-sessions-at-authoring-card"
description: "Task Format: one action, one file and one Verify command with its expected result"
trigger_phrases:
  - "point chat sessions at authoring card tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: point-chat-sessions-at-authoring-card

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

**Task Format**: T### [P?] Description (file path). Verify: command prints expected output

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

These three tasks check that each carrier delivers its text to a session that types no command. They change nothing.

- [x] T001 Check the scaffold carrier: `create.sh` prints a `Next steps` block on both its phase path and its standard path (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Verify: `rg -c -F 'echo "  Next steps:"' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints 2. Evidence: current command printed `2`; the build's pre-edit snapshot at `../scratch/build-evidence.md:128` also counted `2` against baseline `b0e6e1c00f`.
- [x] T002 Check the notice carrier: the gate core returns the mutation notice, and all seven runtime adapters load that core (`.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`). Verify: `rg -c -F 'detail: GATE_3_MUTATION_NOTICE' .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` prints 1, and `rg -l -F 'spec-gate-core' .skilled/hooks/spec-gate/*/*enforce* .opencode/plugins/system-spec-gate.js | wc -l` prints 7. Evidence: current commands printed 1 and 7. The build receipt records the pre-edit count of 7 and confirms the adapter paths were unchanged from the baseline (`../scratch/build-evidence.md:161`).
- [x] T003 Check the router carrier and record its limit: the skill tells every invocation to read `ROUTER.md`, and the top-level advisor does not pick the skill for a plain write (`.skilled/skills/system-spec-kit/SKILL.md`). Verify: `rg -c -F 'before selecting skill-local resources' .skilled/skills/system-spec-kit/SKILL.md` prints 1, and `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a --keep flag to the rotate-logs script"}' --format json | python3 -c 'import json,sys; ids=[r["skillId"] for r in json.load(sys.stdin)["data"]["recommendations"]]; print("system-spec-kit present" if "system-spec-kit" in ids else "system-spec-kit absent")'` prints `system-spec-kit absent`. Evidence: the current skill check printed `1`. The current advisor rerun was degraded with no recommendations, so its wrapper's `system-spec-kit absent` output is not treated as proof. The pre-edit instruction count is recorded at `../scratch/build-evidence.md:131`; the valid non-degraded advisor result is recorded at line 141 and in `../001-research-egm-checks-and-chat-path-gaps/scratch/trust-checks.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each edit task names one edit file. The edit file holds the exact OLD text and the exact NEW text. Replace OLD with NEW and change nothing else. When OLD is not found exactly once, stop, mark the task `[B]` and write `Open question:` with the task id in `goal.md`.

- [x] T004 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/scratch/edit-T004.txt`: add the card as the first phase Next steps item through the shared output constant (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Verify: `bash -n .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh && rg -c -F '0. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints 1. Evidence: the current command exited 0 and printed 1. Reconstructing HEAD with only T004's exact OLD-to-NEW edit also made `rg -c` print 1; the build driver recorded an exact match before T005 at `../scratch/build-evidence.md:162`.
- [x] T005 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/scratch/edit-T005.txt`: connect the standard scaffold to the shared card output constant (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Verify: `rg -c -F 'echo "    $SPEC_AUTHORING_CARD_NEXT_STEP"' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints 2. Evidence: the current command printed 2 call sites at lines 2209 and 2418; T008's recorded test checks both rendered outputs at `../scratch/build-evidence.md:153`.
- [x] T006 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/scratch/edit-T006.txt`: replace its OLD line with its NEW lines so the standard scaffold helper fails when the card path is missing from the output (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`). Verify: `rg -c -F 'create.sh did not name the authoring card for level' .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` prints 1. Evidence: `rg` printed `1`.
- [x] T007 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/scratch/edit-T007.txt`: replace its OLD line with its NEW lines so the phase scaffold helper fails when the card path is missing from the output (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`). Verify: `rg -c -F 'create.sh did not name the authoring card for phase parent' .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` prints 1. Evidence: `rg` printed `1`.
- [x] T008 Run the scaffold test file; change nothing (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-passes-its-own-gate.vitest.ts` exits 0 with no failed test. If the command fails, change no file: mark this task `[B]` and copy the failing test names into `goal.md` under `Open question:`. Evidence: `../scratch/build-evidence.md:153` records the exact command's rerun with exit 0, 6 tests passed, and no obsolete or written snapshots. This dispatch did not rerun Vitest, per the task instruction.
- [x] T009 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/scratch/edit-T009.txt`: replace its OLD lines with its NEW lines to add the card sentence as the last line of `GATE_3_MUTATION_NOTICE` (`.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`). Verify: `node -e "import('./.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs').then(m=>console.log(m.GATE_3_MUTATION_NOTICE.split('\n').at(-1)))"` prints `Once the folder is chosen, write its spec documents by following .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md.` Evidence: command printed that exact sentence.
- [x] T010 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/scratch/edit-T010.txt`: replace its OLD lines with its NEW lines so the expected notice in the test carries the same sentence (`.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs`). Verify: `rg -c -F 'Once the folder is chosen, write its spec documents by following .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md.' .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` prints 1. Evidence: `rg` printed `1`.
- [x] T011 Run the gate core test file; change nothing (`.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs`). Verify: `node --experimental-test-module-mocks --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` exits 0 and its summary reads `fail 0`. If the command fails, change no file: mark this task `[B]` and copy the failing test names into `goal.md` under `Open question:`. Evidence: `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/build-evidence.md:52` records this exact command, exit 0, `pass 110`, `fail 0`.
- [x] T012 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/scratch/edit-T012.txt`: replace its OLD line with its NEW line to add six write verbs to the IMPLEMENT keywords (`.skilled/skills/system-spec-kit/ROUTER.md`). Verify: `python3 -c 'import json,re,pathlib; t=pathlib.Path(".skilled/skills/system-spec-kit/ROUTER.md").read_text(); kw=json.loads(re.search(r"\"IMPLEMENT\": \{\"weight\": 3, \"keywords\": (\[[^\]]*\])", t).group(1)); p="add a --keep flag to the rotate-logs script"; print([k for k in kw if re.search(r"(?<![a-z0-9])"+re.escape(k)+r"(?![a-z0-9])", p)])'` prints `['add']`. Evidence: command printed `['add']`.
- [x] T013 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/scratch/edit-T013.txt`: replace its OLD text with its NEW text so the router's prose list of IMPLEMENT keywords matches the keyword row (`.skilled/skills/system-spec-kit/ROUTER.md`). Verify: `rg -c -F '"fix", "update" and "write" requests' .skilled/skills/system-spec-kit/ROUTER.md` prints 1, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` ends with `CARD SYNC OK`. Evidence: `rg` printed `1`; check-card-sync ended with `CARD SYNC OK`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Validate this packet's documents; change nothing (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card --strict --quiet` prints `RESULT: PASSED`. Evidence: the prior strict run printed `RESULT: PASSED (errors=0 warnings=0)`; this closeout reruns the command after its document edits, and the current output is reported in the final status line.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked [x]
- [x] No [B] blocked tasks remain.
- [x] The scaffold and gate core test runs exit 0 (T008, T011), the router probe prints `['add']` (T012) and the validator prints `RESULT: PASSED` (T014). Evidence: build receipts for T008/T011 and final T014 output.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md

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
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] rg -n '^\| REQ-00[1-4] \|' spec.md prints all four requirement rows. Evidence: the command printed requirement rows at lines 118, 119, 125 and 126.
- [x] CHK-002 [P0] rg -n 'IMPLEMENTATION PHASES|TESTING STRATEGY|AFFECTED SURFACES|PHASE DEPENDENCIES' plan.md prints the defined approach and Level 2 addenda. Evidence: the command printed headings at lines 85, 96, 131 and 152.
- [x] CHK-003 [P1] test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md confirms the canonical card dependency exists. Evidence: exit 0; the card file exists.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] rg -n -F 'echo "    $SPEC_AUTHORING_CARD_NEXT_STEP"' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh finds both scaffold output branches. Evidence: the command printed lines 2209 and 2418.
- [x] CHK-011 [P0] rg -n -F 'spec-authoring-card.md' .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs finds the shared mutation notice. Evidence: the command printed line 178.
- [x] CHK-012 [P1] rg -n -A 4 '"IMPLEMENT"' .skilled/skills/system-spec-kit/ROUTER.md shows write-intent signals and the existing resource map. Evidence: the command printed the keyword row at line 163 and the existing card mapping at lines 203-208.
- [x] CHK-013 [P1] git diff --check -- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs .skilled/skills/system-spec-kit/ROUTER.md .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs reports no whitespace errors. Evidence: exit 0 with no output.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] T008's scaffold test command exits 0 for standard and phase outputs. Evidence: `../scratch/build-evidence.md:153` records exit 0, 6 tests passed, and no obsolete or written snapshots.
- [x] CHK-021 [P0] node --experimental-test-module-mocks --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs exits 0 with the updated notice expectation. Evidence: `../scratch/build-evidence.md:52` records exit 0, `pass 110`, `fail 0`.
- [x] CHK-022 [P1] T012's keyword probe prints `['add']` for the measured plain-language prompt. Evidence: T012 printed `['add']`.
- [x] CHK-023 [P1] T001, T002 and T003 printed their expected pre-edit counts and the advisor result is recorded. Evidence: pre-edit HEAD receipts show 2 scaffold blocks, 1 gate-core reference and 1 skill instruction (`../scratch/build-evidence.md:128-131`); the pre-edit adapter count is 7 (`../scratch/build-evidence.md:161`); the non-degraded advisor result before any edit is recorded at `../scratch/build-evidence.md:141` and in child 001's `scratch/trust-checks.md`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] rg -n '^\| REQ-00[1-4] \|' spec.md confirms each requirement has explicit proof coverage. Evidence: all four rows printed at lines 118, 119, 125 and 126.
- [x] CHK-FIX-002 [P0] rg -n -F 'Next steps:' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh inventories both scaffold producers. Evidence: the command printed lines 2206 and 2415.
- [x] CHK-FIX-003 [P0] rg -n 'GATE_3_MUTATION_NOTICE|IMPLEMENT|authoring-card' .skilled/skills/system-spec-kit/runtime .skilled/skills/system-spec-kit/ROUTER.md inventories changed behavior and focused consumers. Evidence: exit 0 with hits including ROUTER.md lines 39, 163 and 203-208, plus runtime matches.
- [x] CHK-FIX-004 [P0] Review spec.md scope; record N/A because this packet changes chat routing and static text, with no security, path, parser, or redaction fix. Evidence: reviewed the scope and requirements; changes cover static guidance and router signals, with no such fix surface.
- [x] CHK-FIX-005 [P1] rg -n 'Matrix axes:' plan.md confirms the scaffold, mutation-state and intent axes and their planned rows. Evidence: the command printed the matrix-axis line at 146.
- [x] CHK-FIX-006 [P1] Review changed files and test scope; record N/A because this packet does not change process-wide environment or global-state handling. Evidence: reviewed the five-file source/test diff; it changes no process-wide environment or global-state handling.
- [x] CHK-FIX-007 [P1] Record the implementation revision and focused command output in the packet log before closure. Evidence: `goal.md` Progress row records build baseline `b0e6e1c00f`, current `main` HEAD `412bb9e456ce`, the uncommitted source edits and T011/T012/T013 outputs.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Review the five files in spec.md's Files to Change table; record N/A because none handles credentials or secrets. Evidence: reviewed the five source/test changes; they handle scaffold text, routing signals and assertions, not credentials or secrets.
- [x] CHK-031 [P0] Review spec.md REQ-001 through REQ-004; record N/A because this packet adds no input parser or validation boundary. Evidence: reviewed all four requirements; they add static pointers and route keywords, not an input parser or validation boundary.
- [x] CHK-032 [P1] Review spec.md scope; record N/A because no authentication or authorization surface changes. Evidence: reviewed the scope and five changed files; none changes authentication or authorization.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] rg -n 'REQ-00[1-4]|T0(0[1-9]|1[0-4])|AC-00[1-4]' spec.md plan.md tasks.md acceptance-criteria.md confirms cross-document references. Evidence: the command returned matching requirement, task and acceptance references across all four documents.
- [x] CHK-041 [P1] Review the scoped diff; confirm any new source comments explain durable behavior without packet or task IDs. Evidence: reviewed the five-file source/test diff; it adds no source comments.
- [x] CHK-042 [P2] Record N/A: no README is in this packet's Files to Change table. Evidence: N/A; the spec table names no README.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] find specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card -maxdepth 1 -name '.backup-*' -print returns no paths. Evidence: exit 0 and no paths printed.
- [x] CHK-051 [P1] find specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card -maxdepth 1 -type d -name '.backup-*' -print returns no paths. Evidence: exit 0 and no paths printed.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---



