---
title: "Feature Specification: Phase 5: resume-detection-and-single-workflow"
description: "/speckit:resume picks a packet by modification time when no argument is given, so it can open another session's packet. It also searches a root that does not exist, offers retired MCP fallbacks and runs from two workflow files that have drifted apart. This phase makes resume read the calling session's own pointers first and run from one workflow file."
trigger_phrases:
  - "resume detection and single workflow"
  - "phase 5 resume detection and single workflow"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: resume-detection-and-single-workflow

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-code-review-and-dispatch-policy |
| **Successor** | 006-save-search-handoff-contracts |
| **Handoff Criteria** | `assets/speckit-resume.yaml` is the only resume workflow file, every finding this phase owns in the parent Findings Ledger is closed, and `acceptance-criteria.md` has no `Unmet` row |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift specification.

**Scope Boundary**: The `/speckit:resume` command only. That is its router `resume.md`, its two workflow files, its presentation file and every file that names one of the two workflow files by path. This phase owns the parent ledger rows whose Phase column is 5.

**Dependencies**:
- Phase 3 (`003-execution-mode-and-autopilot-contract`) settles the `execution_mode` and `mode_overrides.confirm` shape in the lifecycle workflows. The merged resume workflow copies that shape as it stands after phase 3.
- The writer-owned `_memory.continuity.session_ref` pointer (`.skilled/commands/speckit/save.md` lines 23 to 25) and the relaunch handoff notes (`.skilled/commands/speckit/handoff.md` Step 3) already exist. This phase reads them and changes neither.
- The phase-parent pointer reader `resolvePhaseParentPointerHop` in `.skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts` and the ladder ranking in `buildResumeLadder` are the source of truth the workflow text is corrected to match.

**Deliverables**:
- One workflow file `assets/speckit-resume.yaml` that carries both modes, with the two old files deleted.
- Session detection that reads the calling session's handoff note and `session_ref` before anything else, and never auto-selects a packet by modification time.
- A resume router with a flag table, and presentation text that names one start-new command and no retired source.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
When `/speckit:resume` runs with no folder argument, its workflow ranks packets and then falls back to the most recently modified one, so an agent can resume a packet another session was working on. The workflow never reads the two places that record which packet this session owns: the `session_ref` pointer the save writer mints and the relaunch handoff note. It also searches `.opencode/specs/`, which does not exist, offers a semantic and MCP fallback it declares unavailable, skips a handover older than 24 hours even when nothing newer exists and names a "telemetry store" without saying where it is. The auto and confirm variants live in two files that have drifted, and the operator is told to start new work with `/speckit:complete` in one place and `/speckit:plan` in another.

### Purpose
An agent that runs `/speckit:resume` with no argument opens the packet the calling session owns or says it found none, and it reads that rule from one workflow file whose text matches the resume library and the router.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg -n -o 'roots: \[[^]]*\]|by mtime \| head -[0-9]|resume work session context|the telemetry store|handover.md \(<24h[^"]*|semantic/MCP fallback|use_mcp_tools_directly|call_mcp_through_code_mode|after_step: [0-9]|suggest /speckit:complete' .skilled/commands/speckit/assets/speckit-resume-auto.yaml
57:roots: ["specs/", ".opencode/specs/"]
72:by mtime | head -3
75:resume work session context
78:by mtime | head -1
82:the telemetry store
86:suggest /speckit:complete
92:handover.md (<24h old)
102:handover.md (<24h) first, else walk the continuity ladder without prompting; stop as soon as one safe next action can be named
154:semantic/MCP fallback
200:after_step: 4
219:suggest /speckit:complete
235:use_mcp_tools_directly
242:call_mcp_through_code_mode
```

Line 78 is the last detection tier: it takes the single most recently modified packet file. Line 57 names `.opencode/specs/`, a root this repository does not have. Line 200 ends the auto file after step 4, while `speckit-resume-confirm.yaml` ends after step 5.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Merge `speckit-resume-auto.yaml` and `speckit-resume-confirm.yaml` into one `speckit-resume.yaml` that selects its mode through `execution_mode`, `applies_to: confirm` and `mode_overrides.confirm`, the mechanism plan, implement and complete already use. The new file replaces two files, so it adds no file. Without the merge the two copies keep drifting, as `after_step: 4` against `after_step: 5` shows.
- Rewrite session detection so the calling session's handoff note and `session_ref` come first, and no tier picks a packet by modification time alone.
- Remove the fixed-phrase trigger tier, the `.opencode/specs/` root, the semantic and MCP fallback and the two MCP rules.
- Correct the phase redirect, the handover age rule and the start-new command so they match `resume-ladder.ts`, the access-telemetry store and the README.
- Add a flag table to `resume.md` and point every reference to the two old files at the merged file.

### Out of Scope
- The lifecycle workflows `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml` - their mode contract is phase 3 and their shared blocks are phase 7.
- The save writer, `session_ref` minting and the handoff note format - phase 6 owns the save and handoff contracts, and the scripts themselves are out of scope for the whole packet.
- The README lines that do not name a resume asset, including the ladder order in its lines 333 and 378 and the search examples at lines 284 and 304 - phase 8 aligns the README with the final workflows.
- `resume-ladder.ts`, `access-telemetry.ts` and `session-relaunch.cjs` - the workflow text is corrected to match them, never the reverse.
- The `goal_prompting` block inside the resume workflow - phase 7 decides where shared blocks live.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-resume.yaml` | Create | The single resume workflow for both modes, with the corrected detection and loading rules |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` | Delete | Replaced by the merged file |
| `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | Delete | Replaced by the merged file |
| `.skilled/commands/speckit/resume.md` | Modify | One workflow target for both modes, a flag table and `--no-redirect` in the argument hint |
| `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` | Modify | Start-new command, Source values and the `purpose_row` pointer |
| `.skilled/commands/speckit/README.txt` | Modify | The asset tree and the workflow asset line name the merged file |
| `.skilled/skills/system-spec-kit/command-metadata.json` | Modify | One resume workflow resource |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | One resume execution target |
| `.skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md` | Modify | One resume workflow row |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | Modify | Asset list names the merged file and its resume check still runs |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Modify | Workflow list names the merged file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

All paths below are under `.skilled/commands/speckit/` unless a row names another root.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | (closes R1) With no folder argument, `session_detection` in `assets/speckit-resume.yaml` reads two session-owned sources before any other tier. First, a note under `.skilled/skills/.state/session-relaunch/handoffs/` whose `claimed_by` or `session_id` frontmatter equals the calling session id, newest `created_at` first, gives the packet in its `spec_folder` field. A value of `none` means Gate 3 was skipped and resume reports no packet. Second, a packet whose `_memory.continuity.session_ref.sessionId` equals the calling session id. The session id is `$CLAUDE_CODE_SESSION_ID` on Claude Code or the id the runtime passes, as `handoff.md` states. When no id is known both sources are skipped. Test: `rg -n -e 'session-relaunch/handoffs' -e 'claimed_by' -e 'session_ref.sessionId' assets/speckit-resume.yaml` prints lines that sit inside the `session_detection` block. |
| REQ-002 | (closes R1) No detection tier selects a packet by modification time alone. Under `execution_mode` auto, when neither an argument nor a session-owned source names a packet, resume prints the No Session result and asks for a path. Under confirm, it may list up to three recent packets, each labelled as not matched to this session, and waits for the operator's choice. Test: `rg -n 'by mtime' assets/speckit-resume.yaml` prints only lines inside a confirm-only block, and `rg -n -B6 'not matched to this session' assets/speckit-resume.yaml` shows `applies_to: confirm` in its context. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | (closes R2) The fixed-phrase tier `tier_3_triggers` and the "Trigger phrase matching" entry in `priority_order` are removed. Test: `rg -n -e 'resume work session context' -e 'tier_3_triggers' -e 'Trigger phrase matching' assets/speckit-resume.yaml` prints nothing. |
| REQ-004 | (closes R3) The resume workflow and presentation name no semantic or MCP source. The step 1 "semantic/MCP fallback" and "semantic/memory fallback" activities, the `use_mcp_tools_directly` and `call_mcp_through_code_mode` rules and the confirm `crash_recovery` "MCP enrichment" text are gone. The Resume Brief Source values match the six dashboard values `handover`, `continuity`, `spec_docs`, `ripgrep_context`, `ripgrep_anchor` and `combined`. Test: `rg -n -i -e 'mcp' -e 'semantic/' assets/speckit-resume.yaml assets/speckit-resume-presentation.txt` prints nothing. |
| REQ-005 | (closes R4) Detection searches `specs/` only. The `.opencode/specs/` root, the alias normalization line and the `{.opencode/,}` glob prefixes are removed. Test: `rg -n '\.opencode/' assets/speckit-resume.yaml` prints nothing. |
| REQ-006 | (closes R5) `assets/speckit-resume.yaml` is the only resume workflow. It declares `execution_mode` with `source: "$ARGUMENTS"`, `values: [auto, confirm]` and `default: confirm`, a `checkpoints:` list of real step keys, `applies_to: confirm` on every confirm-only block and a `mode_overrides.confirm` block for the interactive wording. It has one `termination.after_step` equal to its last step number. Both old files are deleted. Test: `ls assets/speckit-resume*.yaml` prints only `assets/speckit-resume.yaml`, and `rg -c -e '^execution_mode:' -e '^mode_overrides:' -e '^checkpoints:' -e 'after_step:' assets/speckit-resume.yaml` prints 4. |
| REQ-007 | (closes R5) Every file that names `speckit-resume-auto.yaml` or `speckit-resume-confirm.yaml` names `speckit-resume.yaml` instead, and the presentation's `purpose_row` sentence names one workflow. The test's resume `purpose_row` check still runs on the merged file. Test: `rg -l 'speckit-resume-[a-z]+\.yaml' .skilled .opencode` prints nothing, and `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` with a PASS line for `speckit-resume.yaml keeps the shared purpose label shape in purpose_row`. |
| REQ-008 | (closes R6) The phase redirect names the store it reads. It first reads `last_active_child_id` and `last_active_at` from `.skilled/skills/system-spec-kit/runtime/database/access-telemetry.json` under the parent's track-relative path as the key. When `SPEC_KIT_DB_DIR` is set, the file lives in that directory instead. It then falls back to `graph-metadata.json` `derived.last_active_child_id`. That is the order `resolvePhaseParentPointerHop` uses. Test: `rg -n 'access-telemetry.json' assets/speckit-resume.yaml` prints one line, and `rg -n 'the telemetry store' assets/speckit-resume.yaml` prints nothing. |
| REQ-009 | (closes R7) The start-new command is `/speckit:plan` in the workflow and the presentation, matching `README.txt` line 378 and the resume library's no-context hint. Test: `rg -n 'speckit:complete' assets/speckit-resume.yaml assets/speckit-resume-presentation.txt` prints nothing, and `rg -n 'speckit:plan' assets/speckit-resume-presentation.txt` prints the Q0 and No Session lines. |
| REQ-010 | (closes R8) No handover is skipped for its age. A `handover.md` of any age is read. When both `handover.md` and `_memory.continuity` exist, continuity wins unless the handover carries a packet pointer and fingerprint that match, the rule `buildResumeLadder` applies in `resume-ladder.ts`. The brief reports the age of the source it used. Test: `rg -n '<24h' assets/speckit-resume.yaml` prints nothing, and `rg -n 'unbound handover' assets/speckit-resume.yaml` prints the ranking line. |
| REQ-011 | (closes R9) `resume.md` carries a Workflow Flag Surface table, in the shape `implement.md` uses, with rows for `<spec-folder>`, `--phase-folder` and `--no-redirect`. Its `argument-hint` names `--no-redirect`. Test: `rg -n -e '^[|] .--no-redirect. [|]' -e '^[|] .--phase-folder. [|]' resume.md` prints two lines, and `rg -n '^argument-hint:.*--no-redirect' resume.md` prints one line. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: In a session whose id matches no handoff note and no `session_ref`, `/speckit:resume :auto` with no argument prints `STATUS=FAIL ERROR="no active session"` and opens no packet.
- **SC-002**: In a session that claimed a handoff note, `/speckit:resume :auto` with no argument opens the note's `spec_folder`.
- **SC-003**: `ls .skilled/commands/speckit/assets/speckit-resume*.yaml` prints one file, and both consumer tests pass with `failed=0` and `fail 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3's `execution_mode` shape | If phase 3 changes the rule wording after this merge, resume carries the old wording | Start this phase after phase 3 closes and copy the rule from `speckit-plan.yaml` as it stands then |
| Risk | Five files outside `.skilled/commands/speckit/` name the old files | A missed one breaks a test or routes an agent to a deleted file | Run `rg -l 'speckit-resume-[a-z]+\.yaml' .skilled .opencode` before closing and require no output |
| Risk | A runtime that exposes no session id cannot use the session-owned sources | Resume on that runtime finds no packet without an argument | The handoff note and `/speckit:handoff` already pass the folder as an argument, so the relaunch path keeps working. The No Session result tells the operator to give a path |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
N/A. This phase changes workflow text an agent reads. It runs no service and adds no runtime cost to measure.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: no argument, no session id and no matching note or `session_ref` gives the No Session result under auto, and a labelled list to choose from under confirm.
- Maximum input: several handoff notes match the session id. Resume takes the one with the newest `created_at` and names it in the brief.
- Failure path: a matching note whose `spec_folder` is empty or names a missing folder is skipped, and detection moves to the `session_ref` source. A malformed `session_ref` counts as absent, as `save-workflow.md` Session Reference states.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Eleven files: one created, two deleted, four command files and five consumers of the old file names |
| Risk | 9/25 | Detection changes which packet an agent opens. Two tests guard the file names |
| Research | 6/20 | The session pointer, handoff notes, telemetry store and ladder ranking were read during authoring |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Decided 2026-11-14: this phase updates the five consumers outside `.skilled/commands/speckit/` that name the old resume workflow files (D-01). REQ-007 holds it, because the merge breaks them if they keep the old names.
- Decided 2026-11-14: confirm mode may list recently modified packets when no session-owned source matches, each labelled as not matched to this session, and the operator chooses (D-16). REQ-002 holds it, so the agent never picks the packet.
- The parent ledger says no file defines the telemetry store (R6). It is defined: `access-telemetry.ts` writes `access-telemetry.json` under `runtime/database/`. The defect is that the workflow does not name it, and REQ-008 is written to that.

None
<!-- /ANCHOR:questions -->

---


