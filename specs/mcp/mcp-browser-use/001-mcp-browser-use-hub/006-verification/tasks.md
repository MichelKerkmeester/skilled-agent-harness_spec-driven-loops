---
title: "Tasks: Phase 6: verification"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "verification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: verification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked: waits on the operator's install yes |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/skills/mcp-browser-use`. `P` is `$H/mcp-bladebro/manual-testing-playbook`. "Step N" is row N of the 14-step plan in `spec.md` section 3. Tasks are refined from `../001-research/research/research.md` §8, §9, §11 and `iteration-006.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run steps 1-2 (preflight). Verify: step 1 prints `absent` and step 2 shows Node 14 or later plus a Chromium-family browser. Evidence 2026-11-21: `command -v bladebro || echo absent` printed `absent`, `node --version` printed `v26.13.0`, Google Chrome is at `/Applications/Google Chrome.app`.
- [x] T002 Ask the operator once for the install yes, naming the rollback (`goal.md`). Verify: the answer, yes or no, is recorded in the `goal.md` log before any step 3 output exists. Evidence: the `goal.md` log row "Install answer" quotes parent Q011, "Yes, agent profile only (Recommended)", written before the install ran.
- [x] T003 Run step 3 after a yes (`npm install -g bladebro`). Verify: `command -v bladebro` prints a path. On a no, record Bladebro as unverified on macOS, keep REQ-001 open as a blocker unless the operator approves a deferral, and continue at T011. Evidence: `npm install -g bladebro@4.8.2` exit 0, "added 2 packages"; `command -v bladebro` then resolved under the nvm global bin.
- [x] T004 Run step 4 then step 5 (`shasum -a 256` on the native binary before it runs, then `bladebro --version` and `bladebro doctor`). Verify: the digest matches the sidecar, the version prints `4.8.2` and doctor passes; a mismatch stops the run and uninstalls, a newer version sends a flag re-check to 004. Evidence: `shasum -a 256` of `bladebro/node_modules/bladebro-darwin-arm64/bladebro` printed `7324e502…5d8fa8`, equal to the v4.8.2 release sidecar `bladebro-darwin-arm64.sha256`, before the first run. `bladebro --version` printed `bladebro v4.8.2 (bfdb5c3)`. `bladebro doctor` exit 0, 12/14 passed with 2 advisories: the profile folder is created on first run, and v4.8.3 is available but stays unpinned.
- [x] T005 Run step 6 (MCP lane). Verify: the five `mcp__bladebro__*` tools appear. Evidence: an MCP stdio handshake against `bladebro mcp` listed `act,see,state,run,vision`. Code Mode, started against this worktree's `.utcp_config.json`, registered the `bladebro` manual with 5 tools, and a live `bladebro.bladebro_see` call returned the example.com text. Code Mode calls are synchronous: `await` fails.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create the Bladebro playbook (`/create:manual-testing-playbook` → `$P`). Verify: `$P/manual-testing-playbook.md` exists with one scenario per probe step. Evidence: `$P/manual-testing-playbook.md` plus 14 scenario files, BB-001 to BB-014, one per plan step; `validate-playbook-package.cjs` exit 0, 0 violations.
- [x] T007 Run steps 7-10, the agent-browser probe, and record the output (`$P`). Verify: step 7 records an `{ok, is_error, text}` envelope with exit 0, and steps 8-10 each record real output. Evidence: steps 7 to 10 each exit 0 with `{ok:true,is_error:false}`, recorded in `$H/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/`. The first optional `run @steps.json` exited 1 on a malformed step file the conducting session wrote; the corrected plan returned `status: completed`. Both are recorded.
- [x] T008 Confirm the R-SEC-1 profile choice and the R-SEC-2 terms check with the operator (`goal.md`). Verify: both answers are in the `goal.md` log before step 11. Evidence: the `goal.md` log row "Real-browser steps 11-13 widened" records R-SEC-1 (Aside binary, Aside's signed-in profile, `clone` mode, cookies only) and R-SEC-2 (`https://example.com` only, read-only) before step 11 ran.
- [x] T009 Run steps 11-13, the real-browser probe, in `clone` or `auto` mode against `https://example.com` (`$P`). Verify: step 13 records reads and refs working with injection off; a `blocked:` verdict is recorded and the probe stops. Evidence: `clone` mode FAILED. `rb on` exit 0 imported 3361 files, then `see content`, `see model` and `act eval` each exited 1 with "Chrome launch failed: no page target available", recorded as BB-012 FAIL and not retried. With the operator's go-ahead, `attach` mode was then probed against the running Aside on port 9333: page text, element model and `navigator.webdriver=false` all exit 0 (`$H/mcp-bladebro/benchmark/reports/2026-11-21--attach-probe--aside-browser/`). Deviation: the passing real-browser run used `attach`, not `clone` or `auto`.
- [x] T010 Run step 14, teardown (`bladebro rb off`, `bladebro stop`, uninstall after approval). Verify: `command -v bladebro` prints nothing and the data root is gone, unless the operator kept it. Evidence: `rb off`, `rb forget`, overrides reset to auto and `bladebro stop` all exit 0; Aside quit and port 9333 closed. The operator chose "Keep it installed (Recommended)", so the package and `~/.local/state/blade` stay.
- [x] T011 Update and run the Chrome DevTools and Aside playbooks (`$H/mcp-chrome-devtools/manual-testing-playbook/`, `$H/mcp-aside-devtools/manual-testing-playbook/`). Verify: each records a run dated after 005 and names no `mcp-tooling/` path. Evidence: Chrome DevTools 4 PASS and 1 FAIL (BDG-008: example.com no longer serves an `h1`); Aside 2 PASS, 2 FAIL and 1 SKIP with the app closed, then a re-run with the app running passed ASD-006, ASD-008 and ASD-009. All dated 2026-11-21 in each mode's `benchmark/reports/`; neither playbook names an `mcp-tooling/` path.
- [x] T012 Recreate and run the hub-routing scenarios (`$H/manual-testing-playbook/`). Verify: each mode has a scenario, and the Lighthouse scenario resolves `mcp-chrome-devtools`. Evidence: 7 scenarios under `$H/manual-testing-playbook/hub-routing/`, one per mode plus Lighthouse (MT-013 resolves `mcp-chrome-devtools`), the defer contract and two holdouts. First run 6 PASS, 1 FAIL (MT-H04 deferred). The operator changed MT-H04's gold to `defer`; `compiled-route-admission.cjs --hub mcp-browser-use` then reports 7 pass, 0 drift.
- [x] T013 Enroll the clean roots (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`). Verify: the playbook validator reports zero violations for `$P` and `$H/manual-testing-playbook`, then both lines are in the allowlist. Evidence: `validate-playbook-package.cjs` exit 0 with 0 violations for `$P` and `$H/manual-testing-playbook`; both lines are in the allowlist, beside the two moved mode roots.
- [x] T014 Run the approved two-stage replay benchmark: `skill_advisor.py` and `compiled-route.cjs --hub mcp-browser-use` on one real request per mode plus the three tie-break requests (`$H/benchmark/reports/compiled-routing/`). Verify: a run-label folder there holds the report, which records both stage results for all six requests and lists all three modes with stage-one and stage-two hit rates. Evidence: `$H/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/` holds the README, `results.csv`, the JSON record and `source.md`: 6 of 6 pass both stages, each mode 2 of 2, `mcp-tooling` below threshold throughout.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the alignment check (`/local-skilled-alignment`). Verify: the report lists no unresolved blocker. Evidence: run `20261121T153300Z` with an Opus critic gave 28 findings, 1 overturned. Every other one is fixed or settled by an operator decision. A fresh battery over the final tree prints 446 pass. Its one open row, the package check, predates this change. The 42 overflow packets pass strict validation.
- [x] T016 Validate the whole packet (parent folder). Verify: `validate.sh` with `--strict --recursive` prints RESULT: PASSED for parent and all children. Evidence: exit 0, `RESULT: PASSED` for the parent and all six children, 0 errors; warnings only in 001 (source tags) and 006 (memory block).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Deep-Review Remediation

The deep review in `../review/review-report.md` (verdict CONDITIONAL: 0 P0, 4 P1, 17 P2) drove this phase.

- [x] T017 Stop the compiled router rejecting prompts that only mention "forbidden" (the router `lib/router.cjs` in the authored hub bundle under `specs/sk-doc/z_archive/…/010-mcp-browser-use/`, promoted to `.skilled/bin/lib/compiled-routing/…/010-mcp-browser-use/`). Verify: a new 403 Forbidden canary case fails on the old router and passes on the fixed one, and the live front door routes it to `mcp-chrome-devtools`. Evidence: the canary harness run in memory printed `gold mismatch for chrome-devtools-http-403-forbidden: action reject but expected route` before the fix and `cases 15 gold built OK` after; `compiled-route.cjs --hub mcp-browser-use` on the 403 prompt prints `"action":"route"` with `mcp-chrome-devtools`. The policy hash stays `8793753e…`. Only this hub's two changed files were copied to the promoted tree, so the unrelated `007-sk-doc` drift is untouched.
- [x] T018 Check the stage-one gap for "chrome live manual" and "core web vitals" before changing anything. Verify: the advisor is replayed on each phrase alone. Evidence: "chrome live manual" already picks `mcp-browser-use` (0.87); "core web vitals" picks `sk-code` (0.90), whose `WEB_PERF` intent owns it. Declaring "chrome live manual" in `ROUTER.md` made "read the live manual for chrome extensions publishing" pick the hub (0.835, none before), so the edit was reverted. The finding is downgraded to P2 and left for the operator.
- [x] T019 Rewrite the Bladebro teardown runbook (`$P/teardown/uninstall-and-data-root.md`). Verify: the data root comes from `bladebro doctor`, removal waits for the operator's named-session confirmation, and the pass criterion checks the root is gone. Evidence: steps 1 to 6 do exactly that; `validate-playbook-package.cjs` still passes 14 scenarios with 0 violations and 0 warnings.
- [x] T020 Record a hub-routing run that supersedes the FAIL record (`$H/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing--post-review/`). Verify: every scenario is run live against the fixed router. Evidence: 7 of 7 PASS plus the 403 canary probe; admission `7 pass, 0 drift`; `compiled-route-admission.test.cjs` 29 of 29; the reports index lists the run first.
- [x] T021 Fix the cheap P2 doc and status findings. Verify: each edited doc validates. Evidence: the 005 summary description, the 005 and parent status rows (three unmet 005 requirements), the Bladebro install and wiring references (live run recorded, update path re-verifies), the Lighthouse catalog validation row and the hub README navigation table. Every edited doc validates with no new warning.
- [x] T022 Rerun every baselined gate. Verify: no count drops. Evidence: admission `--all` exit 0, guard exit 0, sync `--check` exit 1 on the same pre-existing `007-sk-doc` file as before, parent-skill-check OK with 0 warnings, intent-signal check PASSED, advisor vitest 2570 passed as before, `.skilled/bin` node tests 195 pass and 1 fail as before, `.skilled/bin` vitest 97 of 97.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Three mode playbook runs and a hub-routing run recorded, the Bladebro live run or its declined-install record, a benchmark report and an alignment report
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
