---
title: "Tasks: Phase 1: chat-ux-and-pane-map"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "chat ux and pane map tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: chat-ux-and-pane-map

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

Two shell variables keep the commands short. Every command runs from the repository root with no tty.

| Variable | Value |
|----------|-------|
| `P` | `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map` |
| `D` | `$P/design` |

Three checks are long, so each is written once here and named by its output below.

The frame check, the screen's own, which counts characters rather than bytes:

````bash
perl -CSD -e 'local $/; $_=<>; @b = /```[^\n]*\n(.*?)```/gs; $bad=0; for $x (@b) { $h = ($x =~ tr/\n//); $w=0; for (split /\n/, $x) { $w = length($_) if length($_) > $w } $bad++ unless ($h==24&&$w==80)||($h==40&&$w==120)||($h==7&&$w<=30) } print "frames=", scalar(@b), " bad=$bad\n"' $D/mockups.md
````

It prints `frames=26 bad=0`.

The label check, which reads the drawn label column of the key table and looks for each label in a frame:

````bash
awk -F'|' '/^## 2\. THE KEY TABLE/,/^## 3\./' $D/key-map-delta.md | rg '^\| `' | awk -F'|' '{gsub(/^ +| +$/,"",$5); gsub(/`/,"",$5); print $5}' | sort -u | while IFS= read -r l; do rg -qF "$l" $D/mockups.md || echo "MISSING $l"; done | wc -l
````

It prints `0`, with leading spaces on macOS.

The payload check:

````bash
node -e 'const j=require(process.argv[1]); console.log(j.version, j.messages.length, Object.keys(j.messages[0]).length)' "$PWD/$D/chat-transcript.sample.json"
````

It prints `1 4 9`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the placeholder this phase replaces (`003-terminal-screen/001-ux-and-component-map/design/component-inventory.md`). Verify: `rg -n '^\| 6 \| Chat' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md` prints `30:| 6 | Chat | None | None | `placeholder` | 4 |`
- [ ] T002 Confirm the contracts this phase reads (`contracts/`). Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/contracts/*.md | wc -l` prints 9 and `rg -n '^\| D2 \|' specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md` prints one row
- [ ] T003 Confirm the reference sources resolve (`specs/system-skilled-bots/context/`). Verify: `test -f specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py && test -f specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/composer.rs && echo ok` prints `ok`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the frame grammar, the message drawing rule and the state index (`$D/mockups.md`). Verify: `rg -c '^\| C[0-9]+ \|' $D/mockups.md` prints 13
- [ ] T005 Draw the thirteen states at both sizes (`$D/mockups.md`). Verify: `rg -c '^### Chat, ' $D/mockups.md` prints 13 and the frame check prints `frames=26 bad=0`
- [ ] T006 Write the `chat` context, the key table, the footer lines and the approval record (`$D/key-map-delta.md`). Verify: `awk -F'|' '/^## 2\. THE KEY TABLE/,/^## 3\./' $D/key-map-delta.md | rg -c '^\| `'` prints 19 and the label check prints `0`
- [ ] T007 Write the six component rows and the retired placeholder row (`$D/component-rows.md`). Verify: `rg -c '^\| [0-9]+ \| ' $D/component-rows.md` prints 7
- [ ] T008 Write the pane contract and its sample payload (`$D/pane-contract.md`, `$D/chat-transcript.sample.json`). Verify: `rg -n 'chat worker thread of its own' $D/pane-contract.md` prints one line and the payload check prints `1 4 9`
- [ ] T009 [P] Write the loop session and the text forms (`$D/loop-transcript.md`). Verify: `rg -c '^\[hello\] > ' $D/loop-transcript.md` prints 6 and `rg -n '^\[hello\] > /exit$' $D/loop-transcript.md` prints one line
- [ ] T010 [P] Write the routing grammar (`$D/routing-grammar.md`). Verify: `rg -c '^\| [1-8] \| ' $D/routing-grammar.md` prints 8 and `rg -c 'bot-unknown' $D/routing-grammar.md` prints a number above 2
- [ ] T011 [P] Write the conversation block, the cap, the worked overflow and the injection table (`$D/prompt-boundary.md`). Verify: `node -e 'const a=[180,49,180,3721,3721,16295,192,0,2500]; const p=a.reduce((x,y)=>x+y)+8; const t=p+76+8230; console.log(p,t,t-16*199,p+16296)'` prints `26846 35152 31968 43142`, and `rg -o '26,846|35,152|31,968|43,142' $D/prompt-boundary.md | sort -u | wc -l` prints 4
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Check every frame (`$D/mockups.md`). Verify: the frame check prints `frames=26 bad=0`
- [ ] T013 Check every drawn label is in a frame (`$D/key-map-delta.md`). Verify: the label check prints `0`
- [ ] T014 Check every footer line fits 67 columns (`$D/key-map-delta.md`). Verify: `awk -F'|' '/^## 3\. THE FOOTER LINES/,/^## 4\./' $D/key-map-delta.md | rg '^\| `' | awk -F'|' '{print $4; print $6}' | tr -d ' ' | sort -nr | head -1` prints 67
- [ ] T015 Check no fenced block reproduces openhuman source (`$D/`). Verify: `rg -n 'pub fn |impl Composer' $D/` prints nothing
- [ ] T016 Run the validator (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The operator's approval is recorded in `$D/key-map-delta.md` section 6
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
- **Parent specification**: See `../spec.md`
- **Sibling children**: See `../002-conversation-runtime-and-chat-verb/` and `../003-chat-pane-and-proof/`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' $P/spec.md` prints 10
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' $P/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies available. Verify: T001 to T003 print what they say
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No code is written in this phase. Verify: `find $D -type f ! -name '*.md' ! -name '*.json' | wc -l` prints 0
- [ ] CHK-011 [P0] The sample payload parses. Verify: the payload check prints `1 4 9`
- [ ] CHK-012 [P1] The frames hold no tab character. Verify: `rg -c "$(printf '\t')" $D/mockups.md` prints nothing
- [ ] CHK-013 [P1] The documents carry the front matter version. Verify: `rg -l '^version: 1\.0\.0\.0$' $D/*.md | wc -l` prints 7
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' $P/acceptance-criteria.md` prints 10
- [ ] CHK-021 [P0] The frames are the right size. Verify: the frame check prints `frames=26 bad=0`
- [ ] CHK-022 [P1] Every label is drawn. Verify: the label check prints `0`
- [ ] CHK-023 [P1] The worked overflow adds up. Verify: the `node -e` in T011 prints `26846 35152 31968 43142`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential in the design. Verify: `rg -n 'ghp_|sk-[A-Za-z0-9]{20}|xox[bp]-' $D/` prints nothing
- [ ] CHK-031 [P0] The injection table covers every reserved tag. Verify: `rg -c '&lt;(/?)(conversation|bot|memory|skill_content)' $D/prompt-boundary.md` prints a number above 4
- [ ] CHK-032 [P1] No real state-root path. Verify: `rg -n '/Users/michelkerkmeester' $D/` prints nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same seven documents. Verify: `rg -o 'design/(mockups|key-map-delta|component-rows|pane-contract|loop-transcript|routing-grammar|prompt-boundary)\.md' $P/spec.md | sort -u | wc -l` prints 7
- [ ] CHK-041 [P1] Each design document cites its sources. Verify: `rg -c '\[SOURCE: ' $D/*.md | wc -l` prints 7
- [ ] CHK-042 [P2] The parent map names this child. Verify: `rg -n '001-chat-ux-and-pane-map' $P/../spec.md` prints the map row
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
| P0 Items | 10 | [ ]/10 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
