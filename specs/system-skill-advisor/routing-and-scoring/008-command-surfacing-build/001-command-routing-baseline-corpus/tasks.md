---
title: "Tasks: Phase 1: command-routing-baseline-corpus"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "command routing baseline corpus tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: command-routing-baseline-corpus

<!-- SPECKIT_LEVEL: 3+ -->

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

Every command runs in `.skilled/skills/system-skill-advisor/runtime/`. `RA` is `scripts/routing-accuracy`. `C` is `scripts/routing-accuracy/command-prompts.jsonl`. `B` is `scripts/routing-accuracy/command-routing-baseline.json`. `S` is this packet's `scratch/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Build the runtime so the scorer import is fresh (`dist/runtime/lib/scorer/fusion.js`). Verify: `npm run build` exits 0 and `ls dist/runtime/lib/scorer/fusion.js` prints the path.
- [x] T002 Confirm the four pinned numbers before any file is added (`$RA/scorer-eval-baseline.json`). Verify: `node $RA/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'` prints `[158,50,20,5]`.
- [x] T003 Write the list of tracked commands as `/namespace:name`, one per line (`$S/commands.txt`). Verify: `wc -l < $S/commands.txt` prints 44 and `grep -c local-skilled-alignment $S/commands.txt` prints 0.
- [x] T004 Write, per command, the TypeScript-enabled projection ids from `command-bridges.generated.json` that map to it (`$S/command-bridge-map.json`). Verify: `jq 'length' $S/command-bridge-map.json` prints 44 and `jq '[.[] | select(length == 0)] | length' $S/command-bridge-map.json` prints the count of unreachable commands, which is above 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add one `typed` row per command, the prompt starting with the slash command (`$C`). Verify: `jq -r 'select(.row_type=="typed") | .expected_command' $C | sort -u | wc -l` prints 44.
- [x] T006 Add at least two `plain` rows per command, one `tune` and one `holdout`, none containing the command string (`$C`). Verify: `jq -r 'select(.row_type=="plain") | [.expected_command,.split] | @tsv' $C | sort -u | wc -l` prints 88 and `jq -r 'select(.row_type=="plain") | select(.prompt | test("/[a-z-]+:[a-z-]+")) | .id' $C | wc -l` prints 0.
- [x] T007 Add at least 20 `must-not-start` rows with `expected_command` null, at least 8 of them plain research or review requests with no depth wording and `source` set to `d3-plain` (`$C`). Verify: `jq -r 'select(.row_type=="must-not-start") | .expected_command' $C | sort | uniq -c` prints one line with a count of 20 or more and the value `null`, and `jq -r 'select(.source=="d3-plain") | .id' $C | wc -l` prints 8 or more.
- [x] T008 Add one `near-miss` row per owner skill, with `expected_top` the skill and `expected_command` null (`$C`). Verify: `jq -r 'select(.row_type=="near-miss") | .expected_top' $C | sort -u | wc -l` equals `jq -r '.entries[].skillId' scripts/command-bridges/command-bridges.generated.json | sort -u | wc -l`.
- [x] T009 Add at least 10 `slash-variant` rows: partial slash, backtick-quoted command and a question about a command (`$C`). Verify: `jq -r 'select(.row_type=="slash-variant") | .id' $C | wc -l` prints 10 or more, and `jq -e 'has("id") and has("prompt") and has("row_type") and has("split") and has("expected_command") and has("expected_top") and has("expected_policy") and has("source")' $C | sort -u` prints `true` only.
- [x] T010 Confirm no new prompt repeats a prompt in the four existing corpora (`$C`). Verify: `comm -12 <(cat $RA/labeled-prompts.jsonl $RA/holdout-prompts.jsonl $RA/ambiguity-prompts.jsonl $RA/doctor-prompts.jsonl | jq -r '.prompt' | sort -u) <(jq -r '.prompt' $C | sort -u) | wc -l` prints 0 and `jq -r '.prompt' $C | sort | uniq -d | wc -l` prints 0.
- [x] T011 Write the capture script with an exported `scoreCommandCorpus()`, the pinned regime, `--write`, and exit 2 on a stale build, an empty corpus or a row naming an unknown command (`$RA/capture-command-routing-baseline.mjs`). Verify: `node $RA/capture-command-routing-baseline.mjs | jq '.commands | length'` prints 44, and `node $RA/capture-command-routing-baseline.mjs --bogus; echo $?` prints 2.
- [x] T012 Write the baseline (`$B`). Verify: `node $RA/capture-command-routing-baseline.mjs --write > /dev/null && jq -c '[(.commands | length), (.unreachable | length > 0), (.metrics | has("false_offer")), (.metrics | has("agreement")), (.metrics.plain_recall_at_1 | has("holdout"))]' $B` prints `[44,true,true,true,true]`.
- [x] T013 Add the slice test: live score equals baseline, every command file has rows, corpus hash matches (`tests/command-routing-slice.vitest.ts`). Verify: `npx vitest run tests/command-routing-slice.vitest.ts` reports 0 failed.
- [x] T014 [P] Add the three new files to the folder's structure table (`$RA/README.md`). Verify: `grep -c 'command-prompts.jsonl\|capture-command-routing-baseline.mjs\|command-routing-baseline.json' $RA/README.md` prints 3 or more.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the three gates together (`tests/command-routing-slice.vitest.ts`). Verify: `npx vitest run tests/command-routing-slice.vitest.ts tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts` reports 0 failed.
- [x] T016 Re-run the pinned numbers after all files exist (`$RA/scorer-eval-baseline.json`). Verify: the T002 command prints `[158,50,20,5]` and `git status --short $RA/scorer-eval-baseline.json` prints nothing.
- [x] T017 Prove the slice test fails on a changed label: change one `expected_command` in the corpus, run the test, then restore the file (`$C`). Verify: the run reports failed tests with the row id in the message, and after `git checkout -- $C` or the saved copy is restored the test reports 0 failed.
- [x] T018 Prove the capture is repeatable (`$RA/capture-command-routing-baseline.mjs`). Verify: `diff <(node $RA/capture-command-routing-baseline.mjs) <(node $RA/capture-command-routing-baseline.mjs)` prints nothing.
- [x] T019 Run the whole suite and record the slice test's time (`implementation-summary.md`). Verify: `npm test` reports 0 failed and `rg -n 'command-routing-slice' implementation-summary.md` in this packet prints the measured time.
- [x] T020 Confirm only the five planned files changed (`spec.md` section 3). Verify: `git status --short .` lists `$C`, `$RA/capture-command-routing-baseline.mjs`, `$B`, `tests/command-routing-slice.vitest.ts` and `$RA/README.md` and nothing else.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `jq '.commands | length' scripts/routing-accuracy/command-routing-baseline.json` prints 44 and the T015 run reports 0 failed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`. Its ARCHITECTURE DECISION RECORD section holds ADR-001 to ADR-003.
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

Each line below names the command or task that answers it.

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the blocking fact, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The four pinned numbers are confirmed before the first file is added: T002 prints `[158,50,20,5]`
- [x] CHK-002 [P0] The command list holds 44 entries and no private command: T003
- [x] CHK-003 [P1] The build is fresh: T001
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check scripts/routing-accuracy/capture-command-routing-baseline.mjs` exits 0
- [x] CHK-011 [P0] `npx vitest run tests/command-routing-slice.vitest.ts` prints no warning and 0 failed
- [x] CHK-012 [P1] The three exit 2 paths are exercised: unknown flag, empty corpus copy, row with an unknown command
- [x] CHK-013 [P1] `rg -n 'specs/|REQ-|ADR-|T0[0-9][0-9]|008-command' scripts/routing-accuracy/capture-command-routing-baseline.mjs tests/command-routing-slice.vitest.ts` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is `Met` with observed evidence
- [x] CHK-021 [P0] The ratchet and the holdout gate pass with the new files present: T015
- [x] CHK-022 [P1] A changed label makes the slice test fail: T017
- [x] CHK-023 [P1] The whole suite passes: T019
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n -i 'token|secret|password|api[_-]?key' scripts/routing-accuracy/command-prompts.jsonl scripts/routing-accuracy/capture-command-routing-baseline.mjs` prints one line, the phrase `design tokens` in a prompt, and no credential
- N/A for input validation beyond CHK-012 and for auth: the script reads committed fixtures and opens no socket.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md` section 3, `plan.md` section 3 and T020 name the same five files
- [x] CHK-042 [P1] The folder README names the three new files: T014
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The command list, the bridge map and any corpus copy used by T017 live under this packet's `scratch/`
- [x] CHK-051 [P1] `ls scratch/` in this packet shows no corpus copy at close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001 is followed: the slice test compares to `command-routing-baseline.json` and asserts no per-row pick
- [x] CHK-101 [P1] ADR-002 and ADR-003 are followed: `jq -r '.split' $C | sort -u` prints `holdout`, `none` and `tune`, and no row has an `expected_second` key
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] The slice test finishes under the 30 second test timeout, and the time is in `implementation-summary.md`: T019
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

N/A: the phase ships a fixture, a script and a test. Nothing is deployed, and the rollback in `plan.md` section 7 is a file delete.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No dependency is added: `git diff --stat package.json package-lock.json` prints nothing
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] The parent `spec.md` phase map row for this phase and this packet's `spec.md` state the same handoff criterion
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decides the commit and the start of phase 002 | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

