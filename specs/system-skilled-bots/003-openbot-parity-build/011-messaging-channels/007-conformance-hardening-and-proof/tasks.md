---
title: "Tasks: Phase 7: conformance-hardening-and-proof"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "conformance hardening and proof tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: conformance-hardening-and-proof

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

The shell variables, the temporary state root and the `was T0NN` convention are those of `../003-link-roster-and-answer-gate/tasks.md` Task Notation: `RT` is `.skilled/skills/system-skilled-bots/runtime`, `BOTS` is `node .skilled/bin/bots.cjs` and `CTX` is `specs/system-skilled-bots/context`. Every task that writes state runs on `T=$(mktemp -d) && mkdir -p "$T/checkout"` with `XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets` in front and `--repo "$T/checkout"` after, and `SKILLED_BOTS_STATE_ROOT` unset. Every command runs with no tty, no token and no network.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the five transports (`$RT/lib/`). Verify: `ls $RT/lib/channel-telegram.ts $RT/lib/channel-slack.ts $RT/lib/channel-signal.ts $RT/lib/channel-whatsapp.ts $RT/lib/channel-terminal.ts | wc -l | tr -d ' '` prints 5
- [ ] T002 Record the conformance rules, was T006 (`$CTX/tinychannels-main/crates/tinychannels-conformance/src/lib.rs`). Verify: `rg -n 'explicitly_unsupported|reached the mock platform' $CTX/tinychannels-main/crates/tinychannels-conformance/src/lib.rs` prints both
- [ ] T003 Record the fixture count (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md`). Verify: `rg -n '^That is 25 cases' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md` prints one line
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the capability-matrix driver (`$RT/tests/channel-support.ts`). Verify: `rg -n 'capabilityMatrix|conformanceCases' $RT/tests/channel-support.ts` prints both
- [ ] T005 Create the 25 rule cases and the three hardening cases, was T041 and T068 (`$RT/tests/channel-conformance.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-conformance.vitest.ts` prints no `failed`
- [ ] T006 [P] Append the notices section, was T043 (`.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`). Verify: `rg -n '^## 011-messaging-channels' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints one line and `rg -n 'tinychannels' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` exits 1
- [ ] T007 [P] Add the nine module rows, was T044 (`$RT/lib/README.md`). Verify: `rg -c 'channel(-[a-z]+)?\.ts' $RT/lib/README.md` prints 9
- [ ] T008 [P] Write the operator reference from the runbook, was T045 (`.skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md`). Verify: `rg -c '^\| (Preflight|Health|Rotation) \|' .skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` prints 12
- [ ] T009 [P] Name `bots channel` in the run mode and the hub, was T046 and T047 (`.skilled/skills/system-skilled-bots/bots-run/SKILL.md`, `.skilled/skills/system-skilled-bots/SKILL.md`). Verify: `rg -l 'bots channel' .skilled/skills/system-skilled-bots/bots-run/SKILL.md .skilled/skills/system-skilled-bots/SKILL.md | wc -l | tr -d ' '` prints 2
- [ ] T010 [P] Write the feature entry and its catalog row, was T048 and T049 (`.skilled/skills/system-skilled-bots/feature-catalog/`). Verify: `rg -n 'Source Files' .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/messaging-channels.md` prints the section and `rg -n 'messaging-channels.md' .skilled/skills/system-skilled-bots/feature-catalog/feature-catalog.md` prints the row
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Check the reference names every derived secret name (`.skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md`). Verify: `for n in '<secret>-bot' '<secret>-app-secret' '<secret>-verify-token' '<secret>-phone-number-id'; do rg -qF -- "$n" .skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md || echo "MISSING $n"; done` prints nothing
- [ ] T012 Prove the 18 undeclared cases (`$RT/tests/channel-conformance.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-conformance.vitest.ts -t "^R2 ")` prints `Tests  18 passed`
- [ ] T013 Prove the three hardening cases (`$RT/tests/channel-conformance.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-conformance.vitest.ts -t "^hardening ")` prints `Tests  3 passed`
- [ ] T014 Run the whole runtime suite, was T061 (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T015 Type-check the runtime, was T062 (`$RT/tsconfig.json`). Verify: `cd $RT && npm run typecheck` exits 0
- [ ] T016 Run the recursive validator on the parent, was T073 (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels --strict --recursive` prints `RESULT: PASSED`
- [ ] T017 Run the validator (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] T014, T015 and T016 pass from the final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
- **Parent specification**: See `../spec.md`
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

A blocked task is `[B]` with the reason on the same line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-0' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md` prints 4
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies available. Verify: T001 to T003 print what they say
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No runtime module changes in this child. Verify: `git diff --stat -- $RT/lib/*.ts` shows no line from this child's commit
- [ ] CHK-011 [P1] Every case name names a channel, an operation and a rule. Verify: `rg -c "it\('(telegram|slack|signal|whatsapp|terminal) [a-zA-Z]+ R[1-5]" $RT/tests/channel-conformance.vitest.ts` prints 25
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/acceptance-criteria.md` prints 4
- [ ] CHK-021 [P0] The suite passes. Verify: T014 prints no `failed`
- [ ] CHK-022 [P1] No test reaches a network. Verify: `rg -n 'https://' $RT/tests/channel-conformance.vitest.ts` exits 1
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] A mismatched sender id and a secret question reach no platform. Verify: T013 passes
- [ ] CHK-031 [P1] No credential in the operator reference. Verify: `rg -n 'xox[abp]-[0-9]|xapp-[0-9]|[0-9]{8,10}:[A-Za-z0-9_-]{30,}' .skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` exits 1
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The reference carries the Signal UNKNOWN. Verify: `rg -n 'may be lost' .skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` prints one line
- [ ] CHK-041 [P2] The parent map names this child. Verify: `rg -n '007-conformance-hardening-and-proof/ \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md` prints the map row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the nine files of the spec's Files to Change table change. Verify: `git status --short .skilled` lists no other path beyond children 003 to 006
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/scratch -type f ! -name .gitkeep` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | [ ]/6 |
| P1 Items | 7 | [ ]/7 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
