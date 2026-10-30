---
title: "Tasks: manifest and template block"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md manifest tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: manifest and template block

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

**Variables.** `M` is `.skilled/commands/doctor/assets/agents-md-manifest.json`. `S` is `.skilled/commands/doctor/scripts/agents-md-manifest.cjs`. `L` is `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs`. `T` is `.skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `wc -l scratch/baseline.txt` prints a non-zero count and it names the 16374 anchor byte. — **Done.** `wc -l scratch/baseline.txt` printed `121`; the canary block names `  16374  #### Blast-Radius Management`.
- [x] T002 Read the canary's `AGENTS.md` string list and the gate 1 pointer line (`check-rule-copies.js`, `sync-gate1-pointers.cjs`). Verify: the four exact strings, the Iron Law line and the lookup line are written into `scratch/pins.txt`. — **Done.** `scratch/pins.txt` (49 lines) lists the four exact strings, the Iron Law concepts and line, all 21 anchor texts, the 16,384-byte prefix with its 32,768-byte ceiling, and the `lookup-trigger-index.mjs` line.
- [x] T003 Write the failing suite first (`T`). Verify: `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` exits non-zero on `Cannot find module`. — **Done.** exit 1, `Error: Cannot find module '../lib/agents-md-sections.cjs'`; the run is saved in `scratch/t003-failing-test.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the segmenter and the sha256 helper (`L`). Verify: `node --test T` reports the section-count and start-byte cases passing. — **Done.** `segmenter: 44 sections tile the root document and their start bytes match the table` and `segmenter: every authored match prefix finds exactly one section` both pass.
- [x] T005 Author the manifest's sections, pins, runtime copies, budget, markers and source URL (`M`). Verify: `node -e "const m=require('./.skilled/commands/doctor/assets/agents-md-manifest.json'); console.log(Object.keys(m.sections).length)"` prints `46`. — **Done at 44, not 46.** The command prints `44`: the root file carries 44 headings of level 1 to 4 and the design's own section table lists 44 rows, so the packet's `46` is a miscount. 30 pins (21 anchors), 6 runtime copies, the budget ceilings, the markers and the source URL are all authored.
- [x] T006 Implement `--write` and `--check` (`S`). Verify: `node S --write` then `node S --check` exits 0 and prints a `PASS` line naming the section and pin counts. — **Done.** `--write` printed `WROTE: 44 sections, 30 pins, 10 history bodies`; `--check` printed `PASS: 44 sections, 30 pins, derived matches AGENTS.md`, exit 0.
- [x] T007 Add the two refusal paths, one for an unregistered heading and one for an entry that matches nothing (`S`). Verify: `node --test T` reports both refusal cases passing. — **Done.** `generator refusal: a heading no authored entry matches exits 1 and names it` and `generator refusal: an authored entry that matches nothing exits 1 and names it` both pass; each names the heading or the id.
- [x] T008 Add the release-tag history with sha256 dedupe (`S`). Verify: `node --test T` reports the dedupe case passing and the history count is printed. — **Done.** `history: bodies are deduped by sha256 and never repeat a current body` passes and `history: the derived key holds one entry per distinct body` prints `history bodies: 12, read from the last 6 release tags`.
- [x] T009 Rewrite `AGENTS.md:3` to the measured wording (`AGENTS.md`). Verify: `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0 and prints `  16374  #### Blast-Radius Management` or a smaller byte. — **Done.** exit 0, and the deepest anchor prints `  16368  #### Blast-Radius Management`.
- [x] T010 Append the empty marked block (`AGENTS.md`). Verify: `grep -c 'skilled:repo-local:start' AGENTS.md` prints `1` and `wc -c < AGENTS.md` prints at most `27899`. — **Done.** `1` start marker, `1` end marker, `wc -c < AGENTS.md` printed `27888`.
- [x] T011 Regenerate the derived key after both root edits (`M`). Verify: `node S --check` exits 0. — **Done.** `--write` reported `12 history bodies` and `--check` printed `PASS: 44 sections, 30 pins, derived matches AGENTS.md`, exit 0.
- [x] T012 Add both root files to both path-filter lists (`.github/workflows/spec-kit-check.yml`). Verify: `grep -c "'AGENTS.md'" .github/workflows/spec-kit-check.yml` prints `2`. — **Done.** `grep -c` prints `2` for `'AGENTS.md'` and `2` for `'REPO RULES.md'`; the file still parses as YAML.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the whole child gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block --strict` prints `RESULT: PASSED`. — **Done.** `Summary: Errors: 0  Warnings: 0` then `RESULT: PASSED`, exit 0.
- [x] T014 Rerun every baseline command and report the delta (`scratch/baseline.txt`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` prints `PASS` and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`. — **Done.** gate 1 printed `PASS: 1 instruction files carry the root Gate 1 lookup.`; run-all printed `7 suite(s) passed, 0 failed` with 723 tests, up from the parent packet's 699 in 35 files. The other four are unchanged.
- [x] T015 Confirm no file outside the child's scope changed (`git status --porcelain`). Verify: the list names only the six files in `spec.md` section 3. — **Done.** The list names the six files plus this packet's own `scratch/baseline.txt`, `scratch/pins.txt` and `scratch/t003-failing-test.txt`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The manifest's byte count is reported in `implementation-summary.md` (82,621 bytes)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `/doctor:sk-skill` is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit. — **Met.** `19e6a0bc42 feat(sk-doc): report a skill's gaps against a parent hub with check --into-hub`.
- [x] CHK-002 [P0] The six baseline commands are recorded. Verify: `rg -c 'check-rule-copies' scratch/baseline.txt` prints at least `1`. — **Met.** `2`: the pre-change and post-change blocks.
- [x] CHK-003 [P1] The section table and pin list are read from the parent phase spec. Verify: `rg -c 'Blast-Radius Management' ../spec.md` prints at least `1`. — **Met.** `1`, from the parent phase spec's measured-behavior block. The full 44-row table and the pin rows come from the approved design, which the child documents defer to.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both scripts parse. Verify: `node --check .skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` and `node --check .skilled/commands/doctor/scripts/agents-md-manifest.cjs` both exit 0. — **Met.** both exit 0.
- [x] CHK-011 [P0] The manifest parses as JSON. Verify: `node -e "JSON.parse(require('node:fs').readFileSync('.skilled/commands/doctor/assets/agents-md-manifest.json','utf8'))"` exits 0. — **Met.** exit 0.
- [x] CHK-012 [P1] Every new file name is lowercase kebab. Verify: `git status --porcelain` lists no path with an uppercase letter. — **Met.** `agents-md-manifest.json`, `agents-md-manifest.cjs`, `agents-md-sections.cjs`, `agents-md-manifest.test.cjs`.
- [x] CHK-013 [P1] No code comment carries a packet, phase or task id. Verify: `rg -n 'AC-[0-9]{3}|REQ-[0-9]{3}|specs/' .skilled/commands/doctor/scripts/agents-md-manifest.cjs .skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` prints nothing. — **Met.** rg exit 1, no output. `check-comment-hygiene.sh -- <the three code files>` also exits 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`. — **Met.** AC-001 through AC-012 read `Met` with their evidence in the Status column.
- [x] CHK-021 [P0] The suite passes. Verify: `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` reports `fail 0`. — **Met.** `tests 24, pass 24, fail 0, skipped 0`.
- [x] CHK-022 [P1] Both refusal paths are exercised. Verify: the suite names the two refusal cases and both pass. — **Met.** `generator refusal: a heading no authored entry matches exits 1 and names it` and `generator refusal: an authored entry that matches nothing exits 1 and names it`.
- [x] CHK-023 [P1] The pin consumers still hold their text. Verify: the suite's consumer case passes with no skipped pin. — **Met.** `pins: every consumer file still holds the text its pin promises` walks all 30 pins and reads each consumer file; no pin is skipped.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret reaches the manifest. Verify: `rg -ni 'api[_-]?key|token|secret|password' .skilled/commands/doctor/assets/agents-md-manifest.json` prints nothing. — **Met in substance; the literal command matches one benign line and cannot print nothing.** The manifest is a byte-exact copy of the template, and the shipped sentence `Exact text, token or symbol` in the `code-search-tree` body contains the word `token`. The security check that matters was run instead and prints nothing: `rg -ni 'gh[pousr]_[A-Za-z0-9]{10,}|sk-[A-Za-z0-9]{16,}|AKIA[0-9A-Z]{12,}|BEGIN [A-Z ]*PRIVATE KEY|xox[baprs]-[A-Za-z0-9-]{10,}'` exits 1. No credential reaches the file; the word does, because the template ships it.
- [x] CHK-031 [P0] The generator writes only its own manifest path. Verify: the suite's write-spy case names one path. — **Met.** `derived key: --write composes the same derived key and writes only the manifest` asserts one recorded write, to the manifest path it was given.
- [x] CHK-032 [P1] No consumer repository path reaches a tracked file. Verify: `rg -n 'Users/|/home/' .skilled/commands/doctor/` prints nothing. — **Met for this child; the literal command matches four pre-existing fixture lines.** All four are synthetic example paths under `/Users/user/project` inside `scripts/tests/fixtures/sk-skill-convert/source/sk-git/`, untouched by this child. Scoped to the new files the command prints nothing (rg exit 1).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the six files. Verify: `rg -c 'agents-md-manifest.json' spec.md plan.md tasks.md` reports a count in each. — **Met.** `spec.md:2`, `plan.md:2`, `tasks.md:5`.
- [x] CHK-041 [P1] The manifest is not listed in the update engine's generated artifacts. Verify: `rg -n 'agents-md-manifest' .skilled/commands/doctor/update.md` prints nothing. — **Met.** rg exit 1, no output; `GENERATED_ARTIFACTS` in `release-update.cjs` names no manifest path.
- [x] CHK-042 [P2] The child's byte count is reported. Verify: `rg -n 'bytes' implementation-summary.md` prints the measured figure. — **Met.** The summary's measured table reads `27,888 bytes` for the template and `82,621 bytes` for the manifest.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary copies live under `scratch/`. Verify: `git status --porcelain` lists no temporary path outside `scratch/`. — **Met.** The only untracked paths beyond the six files are the three files in this packet's `scratch/`.
- [x] CHK-051 [P1] `scratch/` holds no generated copy of the manifest. Verify: `ls scratch/` lists only the baseline and pin notes. — **Met.** `baseline.txt`, `pins.txt` and `t003-failing-test.txt`: the baseline record, the pin notes, and the captured failing run the tasks require as evidence. No manifest copy.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

Two P0 and P1 rows record a literal command whose intent is met while the command itself matches benign text: `CHK-030` matches the word `token` inside the shipped template sentence, and `CHK-032` matches four pre-existing synthetic fixture paths. Both rows state the output they produced and the substantive check that was run in its place.

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
