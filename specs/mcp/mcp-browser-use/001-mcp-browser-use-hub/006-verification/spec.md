---
title: "Feature Specification: Phase 6: verification"
description: "Per-mode playbooks under the new hub, the 14-step live Bladebro macOS plan behind the install stop-for-yes, a two-stage routing benchmark and /local-skilled-alignment."
trigger_phrases:
  - "phase 6 verification"
  - "mcp-browser-use playbooks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: verification

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/505-mcp-browser-use-hub` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-routing-and-surfaces |
| **Successor** | None |
| **Handoff Criteria** | Program closes: every mode has a recorded playbook run, the routing benchmark covers all three modes, and the alignment report has no open blocker |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes specification.

Scope is refined from `../001-research/research/research.md` §8 (KQ6), §9 (KQ7) and §11, with the full 14-row table from `../001-research/research/iterations/iteration-006.md` finding 1. That table is the source; `research.md` §8 compresses it. Two edits to it are noted under the table below.

**Scope Boundary**: Testing and reporting. A fix found here goes back to the phase that owns the file: a Bladebro flag or output that differs from the packet goes to 004, a routing miss to 005.

**Dependencies**:
- 002-005 complete.
- **Install stop-for-yes (parent D5).** Bladebro is installed only after the operator says yes to this exact rollback: `npm uninstall -g bladebro`, then remove the data root `bladebro doctor` reports (`~/.local/state/blade` or `~/.blade`) once no needed named session remains.
- `/local-skilled-alignment` (`.skilled/commands/local-skilled-alignment.md`).
- `/create:manual-testing-playbook` for the new playbooks.

**Deliverables**:
- A manual testing playbook per mode under the new hub, each with a recorded run; the Bladebro one carries the 14-step macOS run.
- The hub-routing playbook scenarios recreated under `mcp-browser-use` (003 removed them from `mcp-tooling`).
- A routing benchmark report covering all three modes: a two-stage replay (advisor `skill_advisor.py` plus hub router `compiled-route.cjs`) of six real requests, one per mode plus the three tie-break requests in `../005-routing-and-surfaces/plan.md` section 5, archived under `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/`.
- A `/local-skilled-alignment` findings report.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Chrome DevTools and Aside have playbooks, but they test the packets where they sat before 003. Bladebro has none, and every Bladebro claim in 004 is upstream documentation read on 2026-11-21, not observed output. Upstream never ran its live browser probes on macOS, and the operator works on macOS. Nothing yet proves the hub works end to end.

### Purpose
Recorded evidence that each mode works from the new hub, Bladebro included on macOS in both its agent-browser and real-browser lanes, and that routing and connected surfaces agree.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ command -v bladebro || echo absent
absent
$ ls .skilled/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook .skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook
.skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook:
agent-task
cli-lifecycle
devtools-parity
intra-routing-recall
manual-testing-playbook.md
mcp-transport
probes-and-gaps
recovery-and-failure
repl-evidence

.skilled/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook:
cli-bdg-lifecycle
console-and-network
dom-and-screenshot
intra-routing-recall
manual-testing-playbook.md
mcp-parallel-instances
protocol-discovery
recovery-and-failure
```
Measured 2026-11-21, before 003 moves the packets.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ask the operator once for the Bladebro install yes with the rollback above, and record the answer in `goal.md`.
- After the yes, run the 14-step macOS plan below and record each step's real output next to its expected output in the Bladebro playbook.
- Create the Bladebro playbook with `/create:manual-testing-playbook`, and update the Chrome DevTools and Aside playbooks for their new paths, then run all three.
- Recreate the hub-routing scenarios under `.skilled/skills/mcp-browser-use/manual-testing-playbook/`, including one Lighthouse request that must land on `mcp-chrome-devtools`.
- Add the two new playbook roots to `playbook-failclosed-allowlist.txt` once each validates with zero violations. That file makes a listed root a blocking gate, so a root is added only when it is clean.
- Run the routing benchmark: a two-stage replay (advisor `skill_advisor.py` plus hub router `compiled-route.cjs`) of six real requests, one per mode plus the three tie-break requests in `../005-routing-and-surfaces/plan.md` section 5. Archive it as a run-label folder under `$H/benchmark/reports/compiled-routing/` in the `mcp-tooling` archive layout (operator-approved 2026-11-21, section 7).
- Run `/local-skilled-alignment` on the change.

#### The 14-step macOS plan

Every command is Bladebro v4.8.2 syntax read 2026-11-21. Re-verify flags against the installed binary before relying on output (R-SEC-3). Steps 3-14 run only after the install yes.

| # | Phase | Command | Expected output | Rollback |
|---|-------|---------|-----------------|----------|
| 1 | Preflight | `command -v bladebro \|\| echo absent` | `absent` | none (read-only) |
| 2 | Preflight | `node --version`; confirm a Chromium-family browser | Node 14 or later; a Chrome or Chromium binary | none (read-only) |
| 3 | Install | `npm install -g bladebro`, optional dependencies left enabled; the package runs no postinstall script | global package plus native `bladebro-darwin-arm64` or `bladebro-darwin-x64` | `npm uninstall -g bladebro` |
| 4 | Pin evidence | `shasum -a 256` of the resolved native binary under `$(npm root -g)`, against the release sidecar, before the binary runs | arm64 `sha256:7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8`, x64 `sha256:d839f5f8a8bed8f616e68029350b1c36f8bc12ee2a16deb32b6f7df93a5a36c3` | a mismatch stops the run: uninstall per step 3 and report |
| 5 | Install verify | `bladebro --version`, then `bladebro doctor` | `4.8.2`; health pass, the data root (`~/.local/state/blade` or `~/.blade`) and the browser found | set `CHROME_PATH` or install a Chromium-family browser, re-run doctor |
| 6 | MCP lane | register `mcpServers.bladebro = {"command":"bladebro","args":["mcp"]}`, restart the client | five `mcp__bladebro__*` tools: act, see, state, run, vision | remove the entry, restart the client |
| 7 | Agent-browser probe | `bladebro see content https://example.com --json` | page text in `{ok, is_error, text}`, exit 0 | `bladebro stop` |
| 8 | Agent-browser probe | `bladebro see model --json`, then `bladebro act click --text '<unique text>'` | controls with refs; the click dispatched once, exit 0 | `bladebro stop`; inspect the page before re-issuing an unknown-outcome mutation |
| 9 | Agent-browser probe | `bladebro vision --marks --json` | a PNG with an `image_path` and interactive marks | `bladebro stop` |
| 10 | Agent-browser probe | `bladebro state tabs`; optionally `bladebro run @steps.json` | tab list; a plan returns `{"status":"completed"}` or `"stopped"` | `bladebro stop`; isolate with `BLADE_HOME` or `BLADE_FRESH=1` before launch |
| 11 | Real-browser probe | `bladebro rb status --json`; `bladebro rb use <id>`; `bladebro rb profile <key>` | current lane and the operator-chosen browser and profile | `bladebro rb off` |
| 12 | Real-browser probe | `bladebro rb on` in `clone` or `auto` mode | real-browser mode on the host display, injection off, the five tools and refs working | `bladebro rb off`; `bladebro rb forget` removes the clone |
| 13 | Real-browser probe | repeat `see content` and `see model --json` in real mode | reads, refs and actions work without the injection layer | `bladebro rb pause` blocks input; `bladebro rb resume` re-enables |
| 14 | Teardown | `bladebro rb off`; `bladebro stop`; after approval `npm uninstall -g bladebro` and remove the doctor-reported data root | agent lane restored, daemon stopped, package and profile removed | re-run step 3, then steps 4-13 |

Steps 7-10 are the agent-browser probe and steps 11-13 the real-browser probe for REQ-001.

**Edits to the `iteration-006.md` table.** The digest check moves ahead of the first run of the binary: there it was step 5, after `bladebro doctor` had already executed it, and R-SEC-3 says to verify the native package "before use". Step 3 now states that the package runs no postinstall script, which the source records in its command column; that is why installing before the digest check is safe.

**Gates on steps 11-13.** Under R-SEC-1, the operator picks the browser profile and account before step 11 hands control over, and `profile` mode is never used on a live branded Chrome 136+. Under R-SEC-2, the operator confirms the target site's terms before step 12; the probe target is `https://example.com`. A `blocked:` verdict ends the probe; it is reported, never routed around.

### Out of Scope
- Fixing findings in place: each fix returns to the phase that owns the file.
- Rerouting Bladebro requests if Bladebro fails on macOS: that is a routing change 005 would own, and no other mode covers stealth. A failed run is recorded, rolled back and the mode marked unverified on macOS.
- Installing Bladebro without the operator yes (parent D5).

### Files to Change

`H` is `.skilled/skills/mcp-browser-use`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `$H/mcp-bladebro/manual-testing-playbook/` | Create | Bladebro playbook with the 14-step run and its recorded output |
| `$H/mcp-chrome-devtools/manual-testing-playbook/` | Modify | Point at the new hub; record a run |
| `$H/mcp-aside-devtools/manual-testing-playbook/` | Modify | Point at the new hub; record a run |
| `$H/manual-testing-playbook/` | Create | Hub-routing scenarios, the Lighthouse request included |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modify | Add the two new roots once each validates clean |
| `$H/benchmark/reports/compiled-routing/` | Create | Two-stage replay report for the six requests, in a run-label folder, plus the benchmark index |
| `/local-skilled-alignment` report | Create | Findings report at the path the command writes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bladebro runs live on macOS | The Bladebro playbook records real output for steps 7-10 (agent-browser) and 11-13 (real-browser). A declined install does not meet it: REQ-001 and the parent's live-run criterion stay open as a recorded blocker unless the operator approves a deferral |
| REQ-002 | Each mode has a recorded playbook run | Each of the three mode playbooks has a results entry dated after 005 |
| REQ-003 | Install only after the yes | `goal.md` records the operator's yes, with the rollback, before step 3's output |
| REQ-004 | The pin is checked | Step 4 records the SHA-256 result before the binary first runs, and step 5 records `bladebro --version`; a version other than 4.8.2 sends a re-check of the quoted flags back to 004 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The routing benchmark covers all three modes | A report under `$H/benchmark/reports/compiled-routing/` records the advisor result and the `compiled-route.cjs` result for each of the six requests (one per mode plus three tie-break), and lists each mode with its stage-one and stage-two hit rate |
| REQ-006 | The alignment check has no open blocker | The `/local-skilled-alignment` report lists no unresolved blocker |
| REQ-007 | Hub-routing scenarios live under the new hub | `$H/manual-testing-playbook/` holds the scenarios, and the Lighthouse one resolves `mcp-chrome-devtools` |
| REQ-008 | New playbook roots are enforced | Both new roots are in the allowlist, and the playbook validator reports zero violations for each |
| REQ-009 | Teardown leaves the host clean | After step 14, `command -v bladebro` prints nothing and the data root is gone, unless the operator chose to keep it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three mode playbooks and one hub playbook with recorded runs exist under the new hub.
- **SC-002**: The benchmark report and the alignment report exist and name `mcp-browser-use`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator install approval | No live Bladebro evidence | Ask once with the rollback; if declined, record Bladebro as unverified on macOS and keep REQ-001 open as a blocker unless the operator approves a deferral |
| Risk | Bladebro fails on macOS | High | Record the failure as a finding, roll back per step, mark the mode unverified on macOS, send packet corrections to 004 |
| Risk | Upstream moved past v4.8.2 | Med | REQ-004; re-read the pinned docs before step 7 |
| Risk | The real-browser probe touches a signed-in profile | High | R-SEC-1 and R-SEC-2 gates on steps 11-13; `clone` or `auto`, never `profile` on live branded Chrome |
| Risk | A digest mismatch | High | Step 4 stops the run before the binary executes, and uninstalls |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No question is open.

### Answered

- **Which tool produces the routing benchmark?** Answered by the operator 2026-11-21: **the two-stage replay, approved.** `/create:benchmark` does not fit: its workflow registers only the `mcp_promotion` family, stops on any other family, and wants a source packet with `decision-record.md` (`.skilled/commands/create/assets/create-benchmark-auto.yaml`), and the `mcp-tooling` routing harness that produced its `benchmark/reports/` was retired (`.skilled/skills/mcp-tooling/benchmark/README.md`). The benchmark is the advisor plus `compiled-route.cjs` replay of one real request per mode and the three tie-break requests, archived as a run-label folder under `$H/benchmark/reports/compiled-routing/` in the `mcp-tooling` archive layout.
<!-- /ANCHOR:questions -->

---
