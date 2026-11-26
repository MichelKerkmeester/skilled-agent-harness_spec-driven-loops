---
title: "Tasks: Phase 9: sk-code-browser-evidence"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk code browser evidence tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: sk-code-browser-evidence

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the `sk-code-frontend` row as HEAD holds it (`.skilled/skills/sk-code/ROUTER.md`). Verify: `git show HEAD:.skilled/skills/sk-code/ROUTER.md | rg -c 'page rendered in a browser'` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Name the `mcp-browser-use` hub and its three browser modes in the `sk-code-frontend` row (`.skilled/skills/sk-code/ROUTER.md`). Verify: `rg -c 'mcp-browser-use' .skilled/skills/sk-code/ROUTER.md` prints 1, and the row names Chrome DevTools, Aside and Bladebro.
- [x] T003 Bump the router to 2.3.24.0, and sk-code to 3.12.2.0 in `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` (`.skilled/skills/sk-code/`). Verify: `rg -o -m1 '"?version"?: ?"?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+"?' <each of the five files>` prints 2.3.24.0 for `ROUTER.md` and 3.12.2.0 for the other four.
- [x] T004 Add the changelog entry (`.skilled/skills/sk-code/changelog/v3.12.2.0.md`). Verify: `rg -n '^version: 3.12.2.0' .skilled/skills/sk-code/changelog/v3.12.2.0.md` prints one line.
- [x] T005 Amend the parent phase map, row 9, and the handoff row from 008 to 009 (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md`). Verify: `rg -n '^\| 9 \|' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` prints one line ending in `Complete`, and `rg -n '^\| 008-live-runs-and-playbook-fixes \| 009-sk-code' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` prints one line.
- [x] T006 Add the 009 binding row to the parent goal (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md`). Verify: `rg -n '009-sk-code-browser-evidence/goal.md' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` prints one line.
- [x] T007 Replace every template token and placeholder in this packet (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence/*.md`). Verify: `rg -o 'YOUR_VALUE_HERE|FILL:|To be defined|scaffold/' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence/{spec,plan,goal,implementation-summary}.md | wc -l` prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the parent-skill checker on sk-code (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`). Verify: prints `OK: parent-skill-check — all hard invariants passed, 0 warnings` and exits 0.
- [x] T009 Run the router sync verifier (`.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`). Verify: prints `router-sync: 5/5 checks passed` and exits 0.
- [x] T010 Validate this packet strictly (`.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`). Verify: `validate.sh specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence --strict` prints `RESULT: PASSED`.
- [x] T011 Validate the parent and its children recursively, strict (`validate.sh specs/mcp/mcp-browser-use/001-mcp-browser-use-hub --recursive --strict`). Verify: every folder it names prints `RESULT: PASSED`.
- [x] T012 Run the goal checker on this packet and on the parent (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`). Verify: each run prints `RESULT: PASSED`.
- [x] T013 Follow-up: name the hub in `sk-code/SKILL.md` and ask page-speed claims for two numbers (`sk-code/SKILL.md`, `sk-code-frontend/references/web-performance-and-loading.md`). Verify: `parent-skill-check.cjs .skilled/skills/sk-code` prints `OK`. Evidence: `OK: parent-skill-check — all hard invariants passed, 0 warnings`; router-sync `5/5 checks passed`.
- [x] T014 Follow-up: hand cli-orca's non-Orca browser work to the hub (`.skilled/skills/cli-orca/`). Verify: `grep -rn "mcp-aside-devtools\|mcp-chrome-devtools" .skilled/skills/cli-orca` prints nothing. Evidence: 0 lines; both `FOREIGN_OWNERS` browser values read `mcp-browser-use`; catalog validator `PASS: 0 violations`.
- [x] T015 Follow-up: rewrite the dead `mcp-tooling/mcp-chrome-devtools` paths in `local-webflow` (outside this repository). Verify: a grep for that path in the skill prints nothing. Evidence: 11 paths in 8 files rewritten, 0 left; every new path resolves from `.skilled/skills/local-webflow`.
- [x] T016 Write conversation scenario RD-006 and list it in the playbook root (`.skilled/skills/sk-code/manual-testing-playbook/`). Verify: `validate-playbook-package.cjs --package sk-code` prints `PASS` with `operator=22` and `violations=0`. Evidence: `PASS package=sk-code tier=FAIL_CLOSED scenarios=31 categories=8 operator=22 routing_gold_excluded=9 violations=0 warnings=0`, exit 0. Before the run, the scenario's check passed its two passing cases and failed its five failing cases on hand-built transcripts, including one whose tool results quote `chrome_devtools_live` and `aside`.
- [x] T017 Run RD-006 once live on Claude Code (`run-conversation-scenario.cjs`). Verify: the runner's `matrix.md` holds a verdict, and the check's last line names the branch or the failure. Evidence: four runs on Claude Code 2.1.330 with claude-opus-5-5. Run 1 was refused with `SETUP_CHANGED_REPO`, because this packet's files were edited during setup. Run 2 skipped, because the copied sign-in check missed the JSON `"loggedIn": true` that `claude auth status` now prints; the check now reads that field. Run 3 failed on a brittle `sk-code/ROUTER.md` signal, and a plain-chat pattern matched the subject's own report text; the signal was dropped and the chat patterns now need a question mark. Run 4, the recorded one: `FAIL 0/1 CHECK_FAILED`, check line `the reply claims the change without browser evidence or NOT RUN`. The subject changed `styles.css` to `#1e3a8a`, made no browser call and wrote "I didn't open the page in a browser". Recorded in `.skilled/skills/sk-code/benchmark/reports/2026-11-23--manual-testing-playbook--frontend-browser-evidence-conversation/`.
- [x] T018 Put the browser step where a small frontend change meets it: a pre-completion checklist line in `sk-code-frontend/references/frontend-practice.md` (1.0.6.0), then, after run 5 failed, an ALWAYS rule in `sk-code/SKILL.md` §4 that points every completion report at the surface's §5 row (sk-code 3.12.4.0, `changelog/v3.12.4.0.md`). Verify: `parent-skill-check.cjs .skilled/skills/sk-code` prints `OK` and router-sync prints `5/5`. Evidence: `OK: parent-skill-check — all hard invariants passed, 0 warnings`; `router-sync: 5/5 checks passed`.
- [x] T019 Rerun RD-006 live after each fix. Verify: each run's check line. Evidence: run 5, after the checklist line, `FAIL`; the subject wrote that "a one-value CSS change didn't need that guidance, so I didn't load it". Run 6, after the SKILL.md rule, `FAIL` with `the reply claims the change without browser evidence or NOT RUN`; the subject quoted the rule and wrote "This session has no browser tool, so I couldn't do that", although `bdg`, `aside` and `bladebro` are installed as CLIs. Run 6 is recorded in `.skilled/skills/sk-code/benchmark/reports/2026-11-23--manual-testing-playbook--frontend-browser-evidence-after-skill-rule/`.
- [x] T020 Fix the runner for Claude Code 2.1.330's review screen, which shows "Review your answers" with no "Ready to submit" line (`scripts/run-conversation-scenario.cjs`). Verify: `node scripts/tests/run-conversation-scenario.test.cjs` prints `PASS conversation runner suite`. Evidence: PASS; the old pattern misses the new fixture (`old false new true`).
- [x] T021 Stop a browser started inside the runner's sandbox from crash-looping. Run 10's subject found `bladebro`, as the new rule asks, and its daemon relaunched a crashing Chrome until stopped by hand; 88 Chrome crash reports fell inside that run, none on the earlier day Bladebro ran unsandboxed. The cause is inferred: Chrome cannot set up its own macOS sandbox inside the seatbelt. The runner now passes `CONVERSATION_SANDBOX` to setup, launch setup and checks. RD-006 skips under `seatbelt`, runs with `--no-sandbox`, records the browser daemons already running and stops the ones it started from an `EXIT` trap. Verify: the runner suite passes, the new sandbox test fails on the old runner, and stub CLIs show the trap stops only run-started daemons. Evidence: suite PASS; old runner `FAIL refusals: setup and check see the recorded sandbox mode`; setup exits 77 under `seatbelt`; stubs logged `bladebro stop` and `bdg stop` only when neither was running before, and the check kept its exit code and last line.
- [x] T022 Run RD-006 live with `--no-sandbox` and a guard that stops the run and both browser CLIs after three Chrome crash reports. Verify: the check line. Evidence: `PASS 1/1`, `branch=evidence mode=bdg browser-calls=9`; the subject opened the page in its own headless `bdg` session, saved a screenshot and reported no console errors; 0 Chrome crash reports; no Bladebro daemon or active `bdg` session afterwards. Recorded in `.skilled/skills/sk-code/benchmark/reports/2026-11-23--manual-testing-playbook--frontend-browser-evidence-pass/`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Automated checks passed (T008 to T012). The live scenario RD-006 failed until the third rule fix and the sandbox fix, then passed (T022).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
