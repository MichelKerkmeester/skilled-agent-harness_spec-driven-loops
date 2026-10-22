---
title: "Tasks: Phase 56: command-folder-guard-and-readme-baseline"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "command folder guard and readme baseline tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 56: command-folder-guard-and-readme-baseline

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the three Known Limitations 055 recorded and state what each one needs: a guard for the upstream glob, a per-file command-folder check, and a verdict baseline rebuilt from the tracked set (`../055-command-support-into-commands/implementation-summary.md`)
- [x] T002 Record the baseline the after-run is compared with: battery unit tests 51/51 at `781797ce9d`, and the README verdict baseline at 978 entries (`scratch/verification.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `listNonCommandFiles`, which walks `command/` and `commands/` under `.opencode`, follows links while ending a cycle on a visited real path, and maps both the relative path and the extension-less stem of every non-`.md` file to that file, leaving out a stem a `.md` command already owns (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`)
- [x] T004 Return that map from `allowedCommandSources` as `nonCommand`, beside the `required` and `allowed` sets the leg already read (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`)
- [x] T005 Fail a listed name in `legCommandListed` when the `nonCommand` map explains it, checked before the allowlist skip so a global or inherited folder owning the same name cannot hide it; a missing `.md` command keeps failing as before (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`)
- [x] T006 Cover the check with C14, a listed README that fails even when a global `.md` command owns its name, and C15, the walker's name and stem mapping with a command-owned stem left out (`.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`)
- [x] T007 Fix the P1 from review round 1: v2 built-ins failed when a non-command file shared their stem, so built-ins on v2 and configured MCP prompts became exempt and C16 pins both, while v1 keeps the same stem a stray because it registers no built-ins (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`)
- [x] T008 Work review round 2, which returned PASS with 5 P2s: replace the stale comment above `legCommandListed`, add C17 for a symlinked command folder, and record the four remaining P2s rather than fix them (`scratch/verification.txt`)
- [x] T009 Rebuild `baseline-readme-verdicts.json` from the tracked set with `test_readme_verdict_parity.py --write`: 8 tracked READMEs added, one stale entry removed for the deleted `.skilled/skills/sk-code/shared/assets/patterns/README.md`, and 0 existing verdicts changed (`.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the battery unit tests: 51/51 before and 55/55 after C14 to C17, then prove the check is load-bearing by removing it from `legCommandListed`, which turns C14 red, and restoring it, which turns it green again (`scratch/verification.txt`)
- [x] T011 Run the live battery on both versions with the new check in place: every leg PASS, 4 on v1 and 4 on v2, with the v2 read taken on a private `serve` and the shared service untouched (`scratch/battery-live.txt`)
- [x] T012 Confirm the rebuilt baseline and the sk-doc scripts: `baseline_files=985 diff_entries=0 PASS` on the parity rerun, and 38 PASS with 0 FAIL from `run-script-tests.sh` (`scratch/verification.txt`)
- [x] T013 Run the tracked smoke suites: plugins 533/533 and hook node tests 914/914 over 30 files. Both grew on main since 055's 516 and 889, and neither suite covers the files this phase changed (`scratch/verification.txt`)
- [x] T014 Fill this phase's four docs, add the parent map and handoff rows for 056, and append one sentence to each of 055's three Known Limitations saying how this phase closes it (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`, `../055-command-support-into-commands/implementation-summary.md`)
- [x] T015 Commit and push to main — `d39360163c` on main (guard and baseline)
- [ ] T016 Confirm CI green at the pushed commit (`implementation-summary.md`)
- [x] T017 Update the v4.0.0.13 changelog and related docs — the changelog now names the `.markdown` move and the unchanged lists (40 on v1, 42 on v2), adds the new failure rule, records 55 as the battery unit test row and an upgrade note for `.skilled/command-support/` links, and its glance list is back to 12; `doctor/scripts/README.markdown` states the rule, its exemptions and the command-owned-name exception; both validate with 0 issues, the live-doc search found no other stale reference, and the fact check returned PASS with 2 P2s, both fixed (`scratch/verification.txt`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every task marked `[x]`, including T015 to T017
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the unit tests, the revert proof, the live battery on both versions and the parity rerun all read as recorded
- [ ] T015 to T017 close after the push: the commit on main, CI green on it, and the changelog updated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification record**: See `scratch/verification.txt`
- **Live battery transcript**: See `scratch/battery-live.txt`
<!-- /ANCHOR:cross-refs -->

---
