---
title: "Tasks: Phase 2: adapter-and-record-contracts"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "adapter and record contracts tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: adapter-and-record-contracts

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

Three shell variables keep the commands short. Every command runs from the repository root with no tty, no token and no network.

| Variable | Value |
|----------|-------|
| `P` | `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts` |
| `D` | `$P/design` |
| `C` | `specs/system-skilled-bots/003-openbot-parity-build/contracts` |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the six channel record sections (`$C/records.md`). Verify: `rg -c '^## 1[1-6]\. ' $C/records.md` prints 6
- [ ] T002 Confirm the reference adapter and checker resolve (`specs/system-skilled-bots/context/tinychannels-main/`). Verify: `rg -n 'fn receive_ack_policy' specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs` prints line 66, and `rg -n 'pub async fn check_feature' specs/system-skilled-bots/context/tinychannels-conformance/src/lib.rs` prints line 374. The pre-expansion T002, "Record the four message types", is retired: its facts are the shapes of `design/capabilities.md` section 3, which T004 writes
- [ ] T003 Confirm the two-credential gap (`$C/records.md`). Verify: `rg -c 'bot_token|app_token|app_secret' $C/records.md` prints nothing and exits 1
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Write the keys, the facts, the matrix and the TypeScript shapes (`$D/capabilities.md`). Verify: `awk '/^## 2\. THE MATRIX/,/^Where each value/' $D/capabilities.md | rg -c '^\| `[a-zA-Z]+` \|'` prints 11 and `rg -c '^export (type|interface) ' $D/capabilities.md` prints 14
- [ ] T005 [P] Write every record, the derived names, the backoff data and the lease (`$D/records.md`). Verify: `rg -c '"schemaVersion": 1' $D/records.md` prints 9, `rg -c '^\| `(slack|whatsapp|signal|telegram)` \| `<secret>' $D/records.md` prints 8 and `rg -c '^\{ "BACKOFF_MS": \[0, 5000, 25000, 120000, 600000\], "MAX_ATTEMPTS": 5 \}$' $D/records.md` prints 1
- [ ] T006 [P] Write the common order and one section per transport (`$D/inbound-sequence.md`). Verify: `rg -c '^## [2-6]\. ' $D/inbound-sequence.md` prints 5 and `rg -c '^\| Policy \|' $D/inbound-sequence.md` prints 4
- [ ] T007 [P] Write the five rules and the fixture (`$D/conformance-rules.md`). Verify: `rg -c '^\| R[1-5] \|' $D/conformance-rules.md` prints 5, and `awk '/^## 2\. THE FIXTURE/,/^That is 25/' $D/conformance-rules.md | rg -o 'R1 R2|R3 R4 R5' | sort | uniq -c` prints 18 for `R1 R2` and 7 for `R3 R4 R5`
- [ ] T008 [P] Write the runbook (`$D/operator-runbook.md`). Verify: `rg -c '^\| (Preflight|Health|Rotation) \|' $D/operator-runbook.md` prints 12 and `rg -c 'bots secret set' $D/operator-runbook.md` prints 12
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Check no contract file changed (`$C`). The base commit is the one `goal.md` section 4 records at setup, so a contract edit this phase commits is caught as well as an uncommitted one. Verify: `git diff --name-only "$(rg -o 'base commit [0-9a-f]{40}' $P/goal.md | cut -d' ' -f3)"..HEAD -- $C` prints nothing
- [ ] T010 Check every unknown is marked (`$D/`). Verify: `rg -c 'UNKNOWN|not stated' $D/inbound-sequence.md $D/capabilities.md $D/operator-runbook.md | wc -l | tr -d ' '` prints 2, and `rg -n 'Confirm on the settings page' $D/operator-runbook.md` prints one line
- [ ] T011 Check no line of reference source appears in the design (`$D/`). Verify: `R=specs/system-skilled-bots/context/tinychannels-main; comm -12 <(find $R/src/providers $R/crates/tinychannels-bus $R/crates/tinychannels-runtime $R/crates/tinychannels-conformance -name '*.rs' -exec cat {} + | sort -u | awk 'length>30') <(sort -u $D/*.md) | wc -l | tr -d ' '` prints 0
- [ ] T012 Run the validator (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] T009 prints nothing
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' $P/spec.md` prints 9
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' $P/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies available. Verify: T001 to T003 print what they say
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No code is written in this phase. Verify: `find $D -type f ! -name '*.md' | wc -l | tr -d ' '` prints 0
- [ ] CHK-011 [P1] The documents carry the front matter version. Verify: `rg -l '^version: 1\.0\.0\.0$' $D/*.md | wc -l | tr -d ' '` prints 5
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' $P/acceptance-criteria.md` prints 9
- [ ] CHK-021 [P0] The conformance cases cover the matrix. Verify: T007 prints 18 and 7
- [ ] CHK-022 [P1] The backoff data is the table the design states. Verify: T005's third `rg -c` prints 1
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential value in the design. Verify: `rg -n 'xox[abp]-[0-9]|xapp-[0-9]|[0-9]{8,10}:[A-Za-z0-9_-]{30,}' $D/` prints nothing
- [ ] CHK-031 [P0] The webhook is authenticated before parse. Verify: `rg -n 'before any parse' $D/inbound-sequence.md` prints one line
- [ ] CHK-032 [P1] No real state-root path. Verify: `rg -n '/Users/michelkerkmeester' $D/` prints nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec and tasks name the same five documents. Verify: `rg -o 'design/(capabilities|records|inbound-sequence|conformance-rules|operator-runbook)\.md' $P/spec.md | sort -u | wc -l | tr -d ' '` prints 5
- [ ] CHK-041 [P1] Each design document cites its sources. Verify: `rg -l '\[SOURCE: ' $D/*.md | wc -l | tr -d ' '` prints 5
- [ ] CHK-042 [P2] The parent map names this child. Verify: `rg -n '002-adapter-and-record-contracts/ \|' $P/../spec.md` prints the map row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls $P` lists no file outside the six packet documents, `design/`, `scratch/` and the two metadata files
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find $P/scratch -type f ! -name .gitkeep` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | [ ]/6 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
