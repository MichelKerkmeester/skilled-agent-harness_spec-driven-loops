---
title: "Goal: Phase 6: verification"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "verification goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification"
    last_updated_at: "2026-11-21T08:11:48Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-21-browser-use-hub-plan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Recorded evidence shows each mcp-browser-use mode working from the new hub, Bladebro live on macOS, with routing benchmarked and connected surfaces aligned.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Bladebro is installed only after an operator yes that names the rollback. |
| D2 | A failed live run is recorded as a finding, not hidden by a retry. |
| D3 | The real-browser steps run only after the operator picks the profile (R-SEC-1) and confirms the target site's terms (R-SEC-2). |
| D4 | A Bladebro failure is recorded and rolled back, never rerouted to another mode from this phase. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] The goal.md log records the operator's install answer before any step 3 output
- [x] The Bladebro playbook records real output for plan steps 7-10 and 11-13 on macOS
- [x] Step 4 records a SHA-256 check against the release sidecar before the binary first runs, and step 5 records bladebro --version
- [x] Each of the three mode playbooks records a run dated after 005
- [x] A routing benchmark report under .skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/ records advisor and hub-router results for one request per mode plus three tie-break requests, with a hit rate per mode
- [x] The local-skilled-alignment report lists no unresolved blocker
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Draft scope written | Done | spec.md marked refined after 001-research |
| Refine from 001-research | Done | spec.md section 3 carries the 14-row plan from `iteration-006.md` with its rollback column and the R-SEC gates; plan.md and tasks.md follow it |
| Re-level | Done | `recommend-level.sh --loc 500 --files 7 --json` printed `recommended_level: 1`, score 38, with 7 = the Files to Change rows; stays Level 1 |
| Install answer | Recorded before step 3 | Operator, 2026-11-21, parent decision Q011: "Yes, agent profile only (Recommended)" to installing `bladebro@4.8.2` pinned, SHA-256 checked before first run, rollback `npm uninstall -g bladebro` plus removing its data root |
| Bladebro live run | Done | Steps 1-10 PASS on macOS arm64 in the isolated agent profile, digest matched the v4.8.2 sidecar before first run; recorded in `mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/` (12 PASS, 1 FAIL, 1 SKIP) |
| Attach probe | Done, PASS | After the clone failure the operator asked to kill Aside so attach could be tried (2026-11-21). Aside started with `--remote-debugging-port=9333`; `bladebro see content`, `see model` and `act eval` with `--port 9333` each exit 0, `webdriver=false`. Aside quit afterwards and the port closed. Recorded in `mcp-bladebro/benchmark/reports/2026-11-21--attach-probe--aside-browser/` |
| Mode playbook runs | Done | Chrome DevTools 4 PASS, 1 FAIL (BDG-008, example.com has no `h1`). Aside first run 2 PASS, 2 FAIL, 1 SKIP with the app closed, re-run with the app running 3 PASS |
| Hub routing | Done | 7 scenarios; MT-H04 deferred against an Aside gold. Operator: "Gold to defer (Recommended)". Admission now 7 pass, 0 drift for the hub and passes for all 8 hubs |
| Routing benchmark | Done | `benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/`: 6 of 6 pass both stages, each mode 2 of 2 |
| Uninstall | Declined | Operator: "Keep it installed (Recommended)". Rollback stays available: `npm uninstall -g bladebro` and `rm -rf ~/.local/state/blade` |
| Alignment check | Done | Run `20261121T153300Z` with an Opus critic gave 28 findings, 1 overturned. Every other one is fixed or settled by an operator decision. Operator: "Delete them", "Add bare 'devtools' (Recommended)", "Add a section now (Recommended)", "Tune the advisor". A fresh battery prints 446 pass. The one open row, the package check, predates this change. The 42 overflow packets pass strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| Benchmark producer | `/create:benchmark` registers only `mcp_promotion`; the operator approved the two-stage replay on 2026-11-21 (`spec.md` section 7) |
| Failure fallback changed | The draft routed Bladebro to Chrome DevTools on failure; that is a 005 routing change and Chrome has no stealth, so a failure is now recorded, rolled back and marked unverified |
| Hub-routing scenarios | 003 removes them from `mcp-tooling`; this phase recreates them under the new hub |
| Digest check moved earlier | `iteration-006.md` ran `bladebro doctor` before the SHA-256 check; R-SEC-3 wants the check before use, so it is now step 4 |
| Real-browser steps 11-13 widened | Parent Q011 first limited the run to the isolated agent profile. On 2026-11-21 the operator lifted that for one probe: "Try it now, example.com only", then "just cookie based like when use aside browser use, not aside password manager". R-SEC-1: the Aside browser binary with Aside's signed-in `Default` profile ("Work") in `clone` mode, never `profile` mode. R-SEC-2: the only target is `https://example.com`, read-only, no sign-in and no form submit. Aside's password manager lives outside the cloned profile folder and is not used |
| Real-browser probe on Aside: FAIL | 2026-11-21. Step 11 set `rb use --binary /Applications/Aside.app/Contents/MacOS/Aside`, `rb mode clone` and a staged copy of Aside's `Default` profile with `Login Data*`, `Web Data*` and `Affiliation Database*` left out, because the profile held 4 saved passwords and the operator asked for cookies only. Step 12 `rb on` exit 0, imported 3361 files (594.9 MB). Step 13 `see content`, `see model` and `act eval` each exit 1: "Chrome launch failed: no page target available". The launch log shows DevTools listening, so Aside accepts CDP, but the launched instance exposed no page target and its extensions logged "Aside can't connect to its local service". Not retried. Step 14 `rb off`, `rb forget`, overrides reset to auto, `bladebro stop`, staged copy deleted. Evidence: scratchpad `bb/step11.txt` to `bb/step14b.txt` and `bb/step13-launch.log` |
| Declined install is not done | A no leaves REQ-001 and the parent's live-run criterion open as a blocker unless the operator approves a deferral |
<!-- /ANCHOR:log -->
