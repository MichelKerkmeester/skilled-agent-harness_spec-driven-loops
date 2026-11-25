---
title: "Tasks: Phase 1: ux-and-component-map"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ux and component map tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: ux-and-component-map

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

Two shell variables keep the commands short. Every command runs from the repository root.

| Variable | Value |
|----------|-------|
| `P` | `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map` |
| `D` | `$P/design` |

The frame check is one command and it is used three times, so it is written once here and named by its output elsewhere:

````bash
perl -CSD -e 'local $/; $_=<>; @b = /```[^\n]*\n(.*?)```/gs; $bad=0; for $x (@b) { $h = ($x =~ tr/\n//); $w=0; for (split /\n/, $x) { $w = length($_) if length($_) > $w } $bad++ unless ($h==24&&$w==80)||($h==40&&$w==120)||($h==7&&$w<=30) } print "frames=", scalar(@b), " bad=$bad\n"' $D/mockups.md
````

It prints `frames=53 bad=0`. It counts characters rather than bytes, which is why it is Perl and not `awk`: `awk` here counts the box-drawing rule as 240 bytes and reports every frame as bad.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the design folder is absent before the first write (`$D`). Verify: `ls crates/bots-tui/design` prints `No such file or directory`.
- [ ] T002 Confirm the four payload shapes are documented by the phases that own them (`../001-activity-and-actor/spec.md`). Verify: `rg -c 'REQ-002|REQ-003' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md` prints 2 and `rg -c 'REQ-007' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md` prints 1.
- [ ] T003 Confirm every reference source resolves (`specs/system-skilled-bots/context/`). Verify: `test -f specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs && test -f specs/system-skilled-bots/context/OpenGhost-main/ask-card.js && test -f specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts` exits 0.
- [ ] T004 Confirm the four screenshots resolve (`../context/screenshots/`). Verify: when `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/context/screenshots` exists, `ls` of its `*.png` and `*.jpg` files piped to `wc -l` prints 4. When it is absent, `test -d specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/context/screenshots || echo 'SKIP context-absent: screenshots, see research/context-manifest.md' >&2` names the skip, and manifest rows I01 to I04 record the four files.
- [ ] T005 Confirm the validator passes on the scaffold before the first edit (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Write the frame grammar and the state index (`$D/mockups.md`). Verify: `rg -c '^### ' $D/mockups.md` prints 27.
- [ ] T007 Draw the eighteen shell and pane states at both sizes (`$D/mockups.md`). Verify: `rg -c '^\*\*80x24\*\*$' $D/mockups.md` prints 26.
- [ ] T008 Draw the seven overlay states and the palette at both sizes (`$D/mockups.md`). Verify: `rg -c '^\*\*120x40\*\*$' $D/mockups.md` prints 26.
- [ ] T009 Draw the too-small screen and the "what the frames do not show" table (`$D/mockups.md`). Verify: `rg -n 'Too small · Ctrl\+D exit' $D/mockups.md` prints one line.
- [ ] T010 Write the six contexts and the key table (`$D/key-map.md`). Verify: `awk '/^## 2\. THE KEY TABLE/,/^## 3\./' $D/key-map.md | rg -c '^\| `'` prints 29.
- [ ] T011 Write the four rules that fix the pre-expansion keys and the selection rule (`$D/key-map.md`). Verify: `rg -c '^### ' $D/key-map.md` prints 4.
- [ ] T012 Write the unbound keys and the approval record (`$D/key-map.md`). Verify: `rg -n '^\| \*\*Approved\*\* \| Unmet \|' $D/key-map.md` prints one line.
- [ ] T013 Write the glyph table and the three glyphs this phase adds (`$D/glyph-table.md`). Verify: `awk '/^## 1\. THE GLYPH TABLE/,/^## 2\./' $D/glyph-table.md | rg -c '^\| `'` prints 7 and `awk '/^## 2\. THE THREE GLYPHS/,/^## 3\./' $D/glyph-table.md | rg -c '^\| `'` prints 3.
- [ ] T014 Write the inbox's own words and the ASCII fallback set (`$D/glyph-table.md`). Verify: `awk '/^## 5\. THE ASCII FALLBACK SET/,/^## 6\./' $D/glyph-table.md | rg -c '^\| `'` prints 2.
- [ ] T015 Write the colour rule (`$D/glyph-table.md`). Verify: `rg -n '^## 6\. COLOUR IS NEVER THE MEANING' $D/glyph-table.md` prints one line.
- [ ] T016 Write the thirteen-component inventory (`$D/component-inventory.md`). Verify: `rg -c '^\| [0-9]+ \| ' $D/component-inventory.md` prints 13.
- [ ] T017 Write the five shared states and the rules that apply to every component (`$D/component-inventory.md`). Verify: `rg -n '^## 2\. THE FIVE STATES EVERY DATA PANE SHARES' $D/component-inventory.md` prints one line.
- [ ] T018 Write the layout rules and the not-a-component table (`$D/component-inventory.md`). Verify: `rg -n '^## 5\. WHAT IS NOT A COMPONENT' $D/component-inventory.md` prints one line.
- [ ] T019 Write the requirements and the success criteria (`$P/spec.md`). Verify: `rg -c '^\| REQ-0' $P/spec.md` prints 11.
- [ ] T020 Write the phases, the testing strategy and the external orchestration section (`$P/plan.md`). Verify: `rg -n '^## External orchestration' $P/plan.md` prints one line.
- [ ] T021 Write the ordered tasks and the wave table (`$P/tasks.md`). Verify: `rg -c '^### Wave ' $P/tasks.md` prints 6.
- [ ] T022 Write one acceptance criterion per requirement (`$P/acceptance-criteria.md`). Verify: `rg -c '^\| AC-0' $P/acceptance-criteria.md` prints 11.
- [ ] T023 Write the durable directive and its completion criteria (`$P/goal.md`). Verify: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs $P` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T024 Check every frame's height and width (`$D/mockups.md`). Verify: the frame check in Task Notation prints `frames=53 bad=0`.
- [ ] T025 Check every `SOURCE` pointer resolves (`$D/`). Verify: the second command of the AC-001 block in `acceptance-criteria.md` prints 0. When `specs/system-skilled-bots/context` is absent it also writes one `SKIP context-absent` line per skipped pointer to stderr.
- [ ] T026 Check no openhuman source line is reproduced (`$D/`). Verify: `rg -c 'GNU GENERAL PUBLIC LICENSE' $D/` prints nothing and exits 1.
- [ ] T027 Check every component names at least one frame (`$D/component-inventory.md`). Verify: `awk '/^## 1\. THE INVENTORY/,/^## 2\./' $D/component-inventory.md | rg -c '^\| [0-9]+ \|.*\| [0-9]+(, [0-9]+)* \|$'` prints 13.
- [ ] T028 Check every drawn label in the key map appears in a frame (`$D/key-map.md`). Verify: `awk -F'|' '/^## 2\. THE KEY TABLE/,/^## 3\./' $D/key-map.md | rg '^\| `' | awk -F'|' '{gsub(/^ +| +$/,"",$5); gsub(/`/,"",$5); print $5}' | sort -u | while IFS= read -r l; do rg -qF "$l" $D/mockups.md || echo "MISSING $l"; done | wc -l` prints 0.
- [ ] T029 Run the validator (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
- [ ] T030 Record the approval row with its four fields (`$D/key-map.md`). Verify: `rg -c '^\| \*\*Approved\*\* \|' $D/key-map.md` prints 1.
- [ ] T031 Check the answered row's outcome word is carried (`$P/spec.md`, `$P/acceptance-criteria.md`, `$D/component-inventory.md`, `$D/glyph-table.md`). Verify: `rg -l 'outcome word' $P/spec.md $P/acceptance-criteria.md $D/component-inventory.md $D/glyph-table.md | wc -l` prints 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:waves -->
## Waves

A wave is a set of tasks that can run at once. Parallelism follows file overlap and nothing else: two workers never write the same file, so a wave's worker count is the number of distinct files it writes. A wave with one file gets one worker however many tasks it holds.

| Wave | Tasks | Files written | Executor | Model | Effort | Workers | Verify after the wave | Fallback order |
|------|-------|---------------|----------|-------|--------|---------|-----------------------|----------------|
| 1 | T001 to T005 | None: read-only | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 1 | T005 prints `RESULT: PASSED` | vibe, pi, opencode, devin, codex |
| 2 | T006 to T009 | `design/mockups.md` | `cli-mistral-vibe` | `deepseek-flash` | `max`, pinned by the model row | 1 | The frame check prints `frames=53 bad=0` and T006 prints 27 | pi, opencode, devin, codex |
| 3 | T010 to T018 | `design/key-map.md`, `design/glyph-table.md`, `design/component-inventory.md` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | T010 prints 29, T013 prints 7 then 3, T016 prints 13 | vibe, opencode, devin, codex |
| 4 | T019 | `spec.md` | `cli-opencode` | `opencode-go/deepseek-v4.1-flash#max` | `#max` | 1 | T019 prints 11 | vibe, pi, devin, codex |
| 5 | T020 to T023 | `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high`, `max` for `goal.md` | 4 | T023 exits 0 and T021 prints 6 | vibe, opencode, devin, codex |
| 6 | T024 to T031 | None: read-only | `cli-codex` | `gpt-6-luna` | `xhigh` on the `fast` tier | 1 | T024 prints `frames=53 bad=0`, T025 prints 0, T028 prints 0, T029 prints `RESULT: PASSED`, T031 prints 4 | vibe, pi, opencode, devin |

### Wave 1: Setup

One worker, because the five checks are one shell session and none of them writes a file. `cli-pi` at `high` is the mechanical route: the work is five commands and a reading of their output. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:61]

### Wave 2: the frames

One worker, because all four tasks write `design/mockups.md`. `cli-mistral-vibe` at `deepseek-flash` is the design route, and its roster row pins `thinking` to `max` with no flag to lower it, which is the effort this wave wants. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:65] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89]

### Wave 3: the three reference documents

Three workers, one per file: worker A takes T010 to T012 on `design/key-map.md`, worker B takes T013 to T015 on `design/glyph-table.md`, and worker C takes T016 to T018 on `design/component-inventory.md`. No two workers touch a file, so the three run at once. `cli-pi` at `--thinking max` is the design route when Vibe's roster is unavailable, and `--thinking` is a flag independent of the model id, so one route covers the effort. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:61]

### Wave 4: the specification

One worker, because the requirements and the success criteria are one document and the criteria are numbered against the requirements. `cli-opencode` carries the effort in the model id, so `#max` travels with the dispatch rather than depending on a config default. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:125]

### Wave 5: the packet documents

Four workers, one per file: `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md`. All four read `spec.md`, which wave 4 closed, and none of them writes another's file. `plan.md`, `tasks.md` and `acceptance-criteria.md` follow the specification, so they are mechanical and run at `high`; `goal.md` is authored from a template with a budget, so it runs at `max`.

### Wave 6: verification

One worker, because the checks are one shell session and the judgment is whether a frame's content matches the state it claims, which is the hardest reading in the packet. `cli-codex` at `gpt-6-luna` with `xhigh` on the `fast` tier is the route for that, and GPT models reach this packet only through Codex. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:138] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165]

### The fallback order

When an executor runs out of usage, fails its preflight or returns a run that does not meet its own completion contract, the wave moves to the next executor in this order:

1. `cli-mistral-vibe` `deepseek-flash` at `max`
2. `cli-pi` `llmgateway/deepseek-v4.1-flash-1017` at `high` or `max`
3. `cli-opencode` `opencode-go/deepseek-v4.1-flash` at `#high` or `#max`
4. `cli-devin` `deepseek-v4-1-flash-max`, probed with a trivial read-only call first because its quota is weekly [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:152] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]
5. `cli-codex` `gpt-6-luna` at `xhigh` on the `fast` tier

The order is the same for every wave, so a wave that falls back twice is visible as a deviation rather than as a silent substitution. The wave's own executor is tried first and is not repeated in the order above.

### The dispatch rules

| Rule | Why |
|------|-----|
| One change per brief: the file, the edit and the check that proves it | A brief that asks a child to read a subsystem before it edits spends its context first [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:168] |
| Redirect stdin on every non-interactive dispatch | A run that inherits the parent's stdin hangs with no output [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:130] |
| Pass `--offline` on every automated Pi dispatch | Without it a Pi run hung for over two minutes with no reachable network path [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] |
| Set `AI_SESSION_CHILD=1` and state the exemption in the prompt | The variable makes the waiver true; the prompt makes it observable |
| Count a Vibe run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` | A clean stdout proves nothing, because a denied tool call still exits 0 [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:116] |
| Name the model and the effort on every dispatch | A caller's config default is not reproducible [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:235] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165] |

The roster, the effort policy and the reasoning behind each row are in `plan.md` under "External orchestration". [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:199]
<!-- /ANCHOR:waves -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
- **Parent specification**: See `../spec.md`
- **Parent goal**: See `../goal.md`
- **Scope and exit**: See `../research/ui-advisory.md`, the row for `001-ux-and-component-map`
- **Sibling children**: See `../002-architecture-and-contracts/`, `../003-shell-and-navigation/`, `../004-panes/`, `../005-answer-flow/`, `../006-hardening-and-proof/`
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

A blocked task is `[B]` and names the command that blocks it. A `[P0]` check that cannot run here is a blocker, not a deferral.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The requirements are documented in `spec.md`. `rg -c '^\| REQ-0' $P/spec.md` prints 11.
- [ ] CHK-002 [P0] The technical approach is defined in `plan.md`. `rg -n '^## External orchestration' $P/plan.md` prints one line.
- [ ] CHK-003 [P1] Every dependency is available. `test -f specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

This packet writes no code, so these checks read the documents instead.

- [ ] CHK-010 [P0] Every fenced frame is exactly 24 or 40 lines and no line is wider than its size, and the too-small frame is exactly 7 lines and no line wider than 30. The frame check in Task Notation prints `frames=53 bad=0`.
- [ ] CHK-011 [P0] No document this packet authors carries a template placeholder. `rg -c 'FIL[L]:|YOUR_VALUE_HER[E]' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/goal.md $D/*.md` prints nothing and exits 1.
- [ ] CHK-012 [P1] Every document carries the template-source marker its template names. `rg -c 'SPECKIT_TEMPLATE_SOURC[E]' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/goal.md` prints 1 for each.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion's command runs here and prints its expected output. `rg -c '^\| AC-0' $P/acceptance-criteria.md` prints 11.
- [ ] CHK-021 [P0] Every `SOURCE` pointer resolves. T025 prints 0.
- [ ] CHK-022 [P1] Every drawn label in the key map appears in a frame. T028 prints 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No document reproduces a line of the GPL source it takes its design from. `rg -c 'GNU GENERAL PUBLIC LICENSE' $D/` prints nothing and exits 1.
- [ ] CHK-031 [P1] No document this packet authors carries a credential, a token or an absolute home path. `rg -c '/User[s]/|gh[p]_|AKIA[0-9A-Z]{16}' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/goal.md $D/*.md` prints nothing and exits 1. The continuity record `implementation-summary.md` is left out because its `workspace:` field records the checkout path by design.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` each name all four design documents. `rg -o 'design/(mockups|key-map|glyph-table|component-inventory)\.md' $P/spec.md | sort -u | wc -l` prints 4, and the same command over `plan.md` and `tasks.md` prints 4 each.
- [ ] CHK-041 [P2] `goal.md` names the parent goal it is bound to. `rg -n '003-terminal-screen/goal.md' $P/goal.md` prints one line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The four design documents live in `design/` and nothing else does. `ls $D | wc -l` prints 4.
- [ ] CHK-051 [P1] No temporary file is left in the packet. `ls $P | rg -c 'tmp|\.bak|~$'` prints nothing and exits 1.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->
