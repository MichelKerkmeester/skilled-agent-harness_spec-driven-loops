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

- [ ] T001 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `wc -l scratch/baseline.txt` prints a non-zero count and it names the 16374 anchor byte.
- [ ] T002 Read the canary's `AGENTS.md` string list and the gate 1 pointer line (`check-rule-copies.js`, `sync-gate1-pointers.cjs`). Verify: the four exact strings, the Iron Law line and the lookup line are written into `scratch/pins.txt`.
- [ ] T003 Write the failing suite first (`T`). Verify: `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` exits non-zero on `Cannot find module`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the segmenter and the sha256 helper (`L`). Verify: `node --test T` reports the section-count and start-byte cases passing.
- [ ] T005 Author the manifest's sections, pins, runtime copies, budget, markers and source URL (`M`). Verify: `node -e "const m=require('./.skilled/commands/doctor/assets/agents-md-manifest.json'); console.log(Object.keys(m.sections).length)"` prints `46`.
- [ ] T006 Implement `--write` and `--check` (`S`). Verify: `node S --write` then `node S --check` exits 0 and prints a `PASS` line naming the section and pin counts.
- [ ] T007 Add the two refusal paths, one for an unregistered heading and one for an entry that matches nothing (`S`). Verify: `node --test T` reports both refusal cases passing.
- [ ] T008 Add the release-tag history with sha256 dedupe (`S`). Verify: `node --test T` reports the dedupe case passing and the history count is printed.
- [ ] T009 Rewrite `AGENTS.md:3` to the measured wording (`AGENTS.md`). Verify: `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0 and prints `  16374  #### Blast-Radius Management` or a smaller byte.
- [ ] T010 Append the empty marked block (`AGENTS.md`). Verify: `grep -c 'skilled:repo-local:start' AGENTS.md` prints `1` and `wc -c < AGENTS.md` prints at most `27899`.
- [ ] T011 Regenerate the derived key after both root edits (`M`). Verify: `node S --check` exits 0.
- [ ] T012 Add both root files to both path-filter lists (`.github/workflows/spec-kit-check.yml`). Verify: `grep -c "'AGENTS.md'" .github/workflows/spec-kit-check.yml` prints `2`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run the whole child gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block --strict` prints `RESULT: PASSED`.
- [ ] T014 Rerun every baseline command and report the delta (`scratch/baseline.txt`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` prints `PASS` and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`.
- [ ] T015 Confirm no file outside the child's scope changed (`git status --porcelain`). Verify: the list names only the six files in `spec.md` section 3.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The manifest's byte count is reported in `implementation-summary.md`
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

- [ ] CHK-001 [P0] `/doctor:sk-skill` is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit.
- [ ] CHK-002 [P0] The six baseline commands are recorded. Verify: `rg -c 'check-rule-copies' scratch/baseline.txt` prints at least `1`.
- [ ] CHK-003 [P1] The section table and pin list are read from the parent phase spec. Verify: `rg -c 'Blast-Radius Management' ../spec.md` prints at least `1`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Both scripts parse. Verify: `node --check .skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` and `node --check .skilled/commands/doctor/scripts/agents-md-manifest.cjs` both exit 0.
- [ ] CHK-011 [P0] The manifest parses as JSON. Verify: `node -e "JSON.parse(require('node:fs').readFileSync('.skilled/commands/doctor/assets/agents-md-manifest.json','utf8'))"` exits 0.
- [ ] CHK-012 [P1] Every new file name is lowercase kebab. Verify: `git status --porcelain` lists no path with an uppercase letter.
- [ ] CHK-013 [P1] No code comment carries a packet, phase or task id. Verify: `rg -n 'AC-[0-9]{3}|REQ-[0-9]{3}|specs/' .skilled/commands/doctor/scripts/agents-md-manifest.cjs .skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`.
- [ ] CHK-021 [P0] The suite passes. Verify: `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` reports `fail 0`.
- [ ] CHK-022 [P1] Both refusal paths are exercised. Verify: the suite names the two refusal cases and both pass.
- [ ] CHK-023 [P1] The pin consumers still hold their text. Verify: the suite's consumer case passes with no skipped pin.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret reaches the manifest. Verify: `rg -ni 'api[_-]?key|token|secret|password' .skilled/commands/doctor/assets/agents-md-manifest.json` prints nothing.
- [ ] CHK-031 [P0] The generator writes only its own manifest path. Verify: the suite's write-spy case names one path.
- [ ] CHK-032 [P1] No consumer repository path reaches a tracked file. Verify: `rg -n 'Users/|/home/' .skilled/commands/doctor/` prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the six files. Verify: `rg -c 'agents-md-manifest.json' spec.md plan.md tasks.md` reports a count in each.
- [ ] CHK-041 [P1] The manifest is not listed in the update engine's generated artifacts. Verify: `rg -n 'agents-md-manifest' .skilled/commands/doctor/update.md` prints nothing.
- [ ] CHK-042 [P2] The child's byte count is reported. Verify: `rg -n 'bytes' implementation-summary.md` prints the measured figure.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary copies live under `scratch/`. Verify: `git status --porcelain` lists no temporary path outside `scratch/`.
- [ ] CHK-051 [P1] `scratch/` holds no generated copy of the manifest. Verify: `ls scratch/` lists only the baseline and pin notes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
