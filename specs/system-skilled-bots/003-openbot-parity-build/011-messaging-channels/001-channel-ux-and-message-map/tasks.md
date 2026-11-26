---
title: "Tasks: Phase 1: channel-ux-and-message-map"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "channel ux and message map tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: channel-ux-and-message-map

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

Two shell variables keep the commands short. Every command runs from the repository root with no tty, no token and no network.

| Variable | Value |
|----------|-------|
| `P` | `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map` |
| `D` | `$P/design` |

Two checks are long, so each is written once here and named by its output below.

The catalog check:

````bash
rg -c '^\| M[0-9]{2} \| ' $D/message-catalog.md; ls $D/golden/*.txt | wc -l | tr -d ' '; for r in channel-unlinked channel-locked answer-not-approver item-expired channel-group-approval channel-roster-missing item-answered-differently item-busy; do rg -q "\`$r\`" $D/message-catalog.md || echo "MISSING $r"; done; for f in $D/golden/*.txt; do t=$(sed -n '1p' "$f"); rg -qF -- "$t" $D/message-catalog.md || echo "DRIFT $(basename "$f")"; done
````

It prints 36, then 21 and no `MISSING` or `DRIFT` line.

The mockup check:

````bash
rg -c '^### [1-3]\.[1-4] ' $D/mockups.md; perl -CSD -ne 'if (/^```text/){$f=1;next} if (/^```/){$f=0;next} chomp; $n++ if $f && length($_) > 73; END{print $n+0, "\n"}' $D/mockups.md; node -e 'const b=4500+138+111, x=4500+138+123; console.log(b, b-4096, b-3900, x, x-4000, x-4096)'
````

It prints 12, then 0, then `4749 653 849 4761 761 665`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the source of every run message (`.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts`). Verify: `rg -n 'export function deliveryMessage' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` prints `171:export function deliveryMessage(`
- [ ] T002 Confirm the contracts this phase reads (`contracts/`). Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/contracts/*.md | wc -l | tr -d ' '` prints 9 and `rg -c '^\| `channel-' specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md` prints 9
- [ ] T003 Confirm the reference sources resolve (`specs/system-skilled-bots/context/`). Verify: `test -f specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs && test -f specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs && echo ok` prints `ok`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write where the text comes from and the 21-row catalog (`$D/message-catalog.md`). Verify: `awk '/^## 2\. THE CATALOG/,/^## 3\./' $D/message-catalog.md | rg -c '^\| M[0-9]{2} \| '` prints 21
- [ ] T005 Write the literal text and the rules for the varying fields (`$D/message-catalog.md`). Verify: `awk '/^## 3\. THE LITERAL TEXT/,/^## 4\./' $D/message-catalog.md | rg -c '^\| M[0-9]{2} \| '` prints 15
- [ ] T006 Write one golden per catalog row (`$D/golden/`). Verify: `ls $D/golden/*.txt | wc -l | tr -d ' '` prints 21
- [ ] T007 State the fatigue rule and the reply-text decision (`$D/message-catalog.md`). Verify: `rg -c 'fatigue notice never reaches a chat|The run.s reply text is not sent' $D/message-catalog.md` prints 2
- [ ] T008 [P] Write the chunk rule and the twelve mockups (`$D/mockups.md`). Verify: the mockup check prints 12, 0 and `4749 653 849 4761 761 665`
- [ ] T009 [P] Write the reply grammar (`$D/reply-grammar.md`). Verify: `rg -c '^\| [1-5] \| ' $D/reply-grammar.md` prints 5
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Check the catalog and the goldens agree (`$D/`). Verify: the catalog check prints 36 and 21 and no `MISSING` or `DRIFT` line
- [ ] T011 Check the mockups (`$D/mockups.md`). Verify: the mockup check prints 12, 0 and `4749 653 849 4761 761 665`
- [ ] T012 Check every action id in the mockups fits Telegram's 64 bytes (`$D/mockups.md`). Verify: `rg -o 'approval-v1:[0-9TZ-]+:[0-9]+' $D/mockups.md | awk '{ if (length($0) > 64) print }' | wc -l | tr -d ' '` prints 0
- [ ] T013 Check no fenced block reproduces reference source (`$D/`). Verify: `rg -n 'pub fn |impl |async fn |use crate::' $D/` prints nothing
- [ ] T014 Run the validator (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The catalog check and the mockup check print what Task Notation says
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

- [ ] CHK-010 [P0] No code is written in this phase. Verify: `find $D -type f ! -name '*.md' ! -name '*.txt' | wc -l | tr -d ' '` prints 0
- [ ] CHK-011 [P1] The documents carry the front matter version. Verify: `rg -l '^version: 1\.0\.0\.0$' $D/*.md | wc -l | tr -d ' '` prints 3
- [ ] CHK-012 [P1] Every golden ends with exactly one newline. Verify: `for f in $D/golden/*.txt; do tail -c 1 "$f" | od -An -c | rg -q '\\n' || echo "$f"; done` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' $P/acceptance-criteria.md` prints 9
- [ ] CHK-021 [P0] The catalog and the goldens agree. Verify: the catalog check prints no `DRIFT` line
- [ ] CHK-022 [P1] The chunk sizes add up. Verify: the `node -e` of the mockup check prints `4749 653 849 4761 761 665`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential in the design. Verify: `rg -n 'xox[abp]-[0-9]|xapp-[0-9]|[0-9]{8,10}:[A-Za-z0-9_-]{30,}' $D/` prints nothing
- [ ] CHK-031 [P0] Every message with bot-authored text is marked checked. Verify: `awk '/^## 2\. THE CATALOG/,/^## 3\./' $D/message-catalog.md | rg -c 'checked'` prints 4
- [ ] CHK-032 [P1] No real state-root path. Verify: `rg -n '/Users/michelkerkmeester' $D/` prints nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same three documents. Verify: `rg -o 'design/(message-catalog|mockups|reply-grammar)\.md' $P/spec.md | sort -u | wc -l | tr -d ' '` prints 3
- [ ] CHK-041 [P1] Each design document cites its sources. Verify: `rg -l '\[SOURCE: ' $D/*.md | wc -l | tr -d ' '` prints 3
- [ ] CHK-042 [P2] The parent map names this child. Verify: `rg -n '001-channel-ux-and-message-map/ \|' $P/../spec.md` prints the map row
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
| P1 Items | 10 | [ ]/10 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
