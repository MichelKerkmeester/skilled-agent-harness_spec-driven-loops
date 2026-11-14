---
title: "Feature Specification: Phase 21: brief-head-parity"
description: "The same prompt gives Claude a head that names a command and OpenCode a head that names none, because the recommend handler keeps the command on the head only for one request shape. OpenCode can also print a raw command row id as the skill to use, the companion line prints a command with no policy word and a command can print twice. This phase makes the head row the same for every request shape and fixes the three render defects."
trigger_phrases:
  - "brief head parity"
  - "phase 21 brief head parity"
  - "opencode head drops the command"
  - "companion line policy word"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: brief-head-parity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 23 |
| **Predecessor** | 020-command-offer-fit-guards |
| **Successor** | 022-workflow-measure-soundness |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the advisor suite and the plugin tests report 0 failed, every floor line equals its line in `scratch/before.txt`, `scratch/repro-after.txt` prints `same head: true` on all 17 prompts and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). The operator's core need is that a model lands on the best correct workflow more often on every runtime. A runtime whose head drops the command, or names a row id no model can run, cannot land there. The alignment reviews of 2026-11-14 (`../review/fable-alignment-2026-11-14/`) derived the OpenCode gap from code. The planning probe captured it from the real plugin and found one more defect the reviews did not name.

**Scope Boundary**: the recommend handler, the brief renderer, the OpenCode plugin, their three test files and two documents that show the companion line. No scorer file, attach module, hook, corpus row, committed baseline, head wording, `AGENTS.md` wording or model run.

**Dependencies**:
- The advisor suite and the plugin tests are green on the start commit (T001).
- Phase 020 edits `lib/command-attach.ts` and `lib/scorer/fusion.ts`. The two phases share no file. The after checks here are written so they hold whether or not phase 020 has landed.

**Deliverables**:
- A head row that carries its command under every request shape, in `handlers/advisor-recommend.ts`.
- A companion line that prints its policy word and never repeats the head's command, in `lib/render.ts`.
- An OpenCode head labelled from the first passing row, in `.opencode/plugins/system-skill-advisor.js`.
- `scratch/repro-after.txt`, the two-path head probe after the change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The recommend handler strips a command from the hub head whenever a lower row carries the same command, unless the caller asked for the top pick alone. The Claude hook asks that way and OpenCode does not, so `make a manual testing playbook for the login flow` reaches Claude as `use sk-doc → /create:manual-testing-playbook (start)` and reaches an OpenCode model as `use sk-doc` with no command. The OpenCode plugin also labels the head from the first row the CLI returned, even when that row does not pass, so one prompt prints `use command-doctor-sk-skill-convert 0.95/0.12 pass.` with the scores of `sk-doc`. The companion line prints `Also: /doctor:speckit` with no run, start or ask word, and a command the head already names prints again under it.

### Purpose
Every runtime's model reads the same head for the same prompt, each printed command carries its policy word and no command or row id is printed that the model could misread.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# node --import <tsx loader> scratch/planning/probe-heads.mts, 2026-11-14, commit 16c9757ac0, advisor daemon live.
# The claude line is the hook's request through resultFromCliData and renderAdvisorBrief.
# The opencode line is the real plugin spawning the advisor CLI. Full output: scratch/planning/probe-heads.before.txt
# (17 prompts: 13 print "same head: true", 4 print "same head: false", 6 lines hold "| Also: /doctor").
PROMPT: make a manual testing playbook for the login flow
  claude:   Advisor: live; use sk-doc → /create:manual-testing-playbook (start) 0.95/0.12 pass.
  opencode: Advisor: live; use sk-doc 0.95/0.12 pass.
  same head: false
PROMPT: document the new skill and create a feature catalog for it
  claude:   Advisor: live; use sk-doc 0.95/0.12 pass.
  opencode: Advisor: live; use command-doctor-sk-skill-convert 0.95/0.12 pass.
  same head: false
PROMPT: do not run it, just tell me what /doctor:update would change
  claude:   Advisor: live; ambiguous: system-skilled-doctor → /doctor:update (ask) 0.82/0.26 vs sk-doc 0.82/0.26 pass. | Also: /doctor:update
  opencode: Advisor: live; ambiguous: system-skilled-doctor → /doctor:update (ask) 0.82/0.26 vs sk-doc 0.82/0.26 pass. | Also: /doctor:update
  same head: true
PROMPT: the trigger index lookup returns nothing for my packet, do not change anything
  claude:   Advisor: live; use system-spec-kit 0.95/0.12 pass. | Also: /doctor:speckit
  opencode: Advisor: live; use system-spec-kit 0.95/0.12 pass. | Also: /doctor:speckit
  same head: true
PROMPT: create a new agent definition for a security reviewer
  claude:   Advisor: live; use sk-doc → /create:agent (start) 0.82/0.12 pass.
  opencode: Advisor: live; use sk-doc → /create:agent (start) 0.82/0.12 pass.
  same head: true
PROMPT: thorough deep review of the readme I wrote for the hooks folder
  claude:   Advisor: live; ambiguous: system-deep-loop → /deep:review (ask) 0.95/0.16 vs sk-doc 0.93/0.12 pass.
  opencode: Advisor: live; ambiguous: system-deep-loop → /deep:review (ask) 0.95/0.16 vs sk-doc → /create:readme (start) 0.93/0.12 pass.
  same head: false
PROMPT: run a deep review on the manual testing playbook I wrote for login
  claude:   Advisor: live; ambiguous: sk-doc → /create:manual-testing-playbook (start) 0.95/0.16 vs system-deep-loop 0.92/0.12 pass.
  opencode: Advisor: live; ambiguous: sk-doc 0.95/0.16 vs system-deep-loop → /deep:review (ask) 0.92/0.12 pass.
  same head: false
```
<!-- /ANCHOR:measured-behavior -->

### Mechanism per Finding

| Finding | Where it comes from | Fix |
|---------|---------------------|-----|
| A-2 | `enrichCompiledRoutes` keeps the head's command only when `topOnly` is set, and the plugin's request does not set it. The same option decides whether the partner of an ambiguous head carries a command, so the two ambiguous prompts in the block above differ at the partner too | The head row keeps its command under every shape (T003), and the plugin sends `compiledRouteTopOnly` as every hook does, so the partner row is the same (T014) |
| A-3 | The run log's offer is a replay of the Claude hook, which differed from the OpenCode head | Fixed for runs made after this phase by T003 and T014, because the head and its partner no longer depend on the runtime. The stored runs are not changed: their `offeredCommand` was recorded at run time from the Claude replay, and no rescore rewrites it. Phases 022 and 023 print that as a limit beside every number read from a stored non-Claude run |
| A-4, the OpenCode head, found by the planning probe | The plugin takes `recommendations[0]` as the head label before the renderer filters to passing rows | The label comes from the first passing row (T006) |
| A-7 | `companionCommandLabel` adds a marker only in a child session | The companion prints its policy word (T004) |
| B-9, second half | The companion is the first passing doctor bridge below the head, even when the head already prints its command | A companion equal to the head's command or the partner's is dropped (T005) |
| B-10 | Reported as a command row leading its owner | The row order reproduces: `create:agent 0.8235` sits above `sk-doc 0.8924` in the returned list (`../020-command-offer-fit-guards/scratch/planning/probe-offers.before.txt`). The rendered head already names the skill first, `use sk-doc → /create:agent (start)`, on both paths. What is left is how the head words the command, which is B-5 and waits on the operator. No change |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Keep the command on the head row for every request shape in `enrichCompiledRoutes`.
- Print the policy word on the companion line.
- Drop a companion line that repeats the command the head or its partner already prints.
- Label the OpenCode head from the first passing row.
- Send `compiledRouteTopOnly` from the OpenCode plugin, the request option every hook already sends. Without it the partner of an ambiguous head carries a command on OpenCode and none on Claude, which the head-row fix alone does not change.
- Correct the two documents that show the companion line's form.

### Out of Scope
- The head wording `use <skill> → <command> (<policy>)` (B-5) - changing it invalidates every measured arm and nothing shows a better wording without a new arm, which the operator ruled out. It waits on the operator with the arm decision (parent goal log).
- The Gate 2 policy sentences in `AGENTS.md` (B-6) - that wording is the operator's to approve.
- The printed confidence of a command row that leads its owner (B-10) - the label already names the owner first and no behaviour was shown to depend on the number.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime` and `SKA` is `.skilled/skills/system-skill-advisor`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/handlers/advisor-recommend.ts` | Modify | The head keeps its command in `enrichCompiledRoutes` |
| `ADV/lib/render.ts` | Modify | `companionCommandLabel` prints the policy word, and the companion pick skips a repeated command |
| `.opencode/plugins/system-skill-advisor.js` | Modify | The head label comes from the first passing row, and `advisorCliRequest` sends `compiledRouteTopOnly: true` |
| `ADV/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modify | The head row is the same under both shapes |
| `ADV/tests/doctor-brief-render.vitest.ts` | Modify | The companion's policy word and the dropped repeat |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modify | The head label when the first row does not pass, and the request option |
| `SKA/README.md`, `SKA/hooks/skill-advisor-hook.md` | Modify | The companion line's form |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The typed recall, false offer, typed delivery and eval lines equal their lines in `scratch/before.txt`, and neither the plain tune count nor the sealed plain count under the fixture regime is lower. |
| REQ-002 | For one prompt and one compiled route, the first recommendation carries the same `command` with `compiledRouteTopOnly` set and unset. |
| REQ-003 | The head probe prints `same head: true` for all 17 prompts, two of them ambiguous heads whose partner differed, and no printed line holds `command-doctor-`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A companion line reads `Also: <command> (<policy>)` outside a child session and keeps `(parent-named only)` inside one where it has it today. |
| REQ-005 | A brief whose head or partner prints a command prints no companion line with the same command. |
| REQ-006 | The OpenCode head never names a row that does not pass the thresholds, and names the first row that does. |
| REQ-007 | `SKA/README.md` and `SKA/hooks/skill-advisor-hook.md` show the companion line with its policy word. |
| REQ-008 | No code comment added by this phase names a spec path, a phase, a task, a finding or a requirement id. |
| REQ-009 | The request the OpenCode plugin sends to the advisor CLI carries `options.compiledRouteTopOnly` set to `true`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node --import <tsx loader> scratch/planning/probe-heads.mts` prints `same head: true` 17 times and `same head: false` never, where it printed 13 and 4.
- **SC-002**: The advisor suite and the plugin tests report 0 failed, and the floor lines are unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon answers the CLI the probe and the plugin spawn | The head probe cannot run | T011 marks itself `[B]` with the error. The three test files prove each change without the daemon |
| Risk | The head and the command's own row now both carry the command in the full list | Low: the renderer prints the head and one partner, and T005 drops a companion that repeats it | The handler case that pins a silent hub beside its command row stays for a hub that is not the head |
| Risk | The plugin now gets a route for the top pick alone, so a lower row it reads loses its route | Low: the brief prints the head and one partner, and the hooks have sent this option since the handler gained it | T014 runs every plugin test, and the head probe in T011 compares both paths on 17 prompts |
| Risk | A longer companion line passes the head length cap and is dropped whole | Med: the cap drops the companion, never the head | `command-head-length.vitest.ts` runs in T004, and the existing case for a companion that does not fit stays |
| Risk | The plain tune attached count moves, because a head that leads with a hub now carries the command in the default shape | Med: it is a pinned floor, and a rise is a real delivery gain | T010 records the line. A higher count is recorded as a gain and the floor recapture is the coordinator's, a lower count is `[B]` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: No change adds a subprocess or a file read. The handler runs the same route lookups as before.

### Security
- **NFR-S01**: Every label part still passes `sanitizeSkillLabel`, and the policy word comes from the generated command row, never from prompt text.

### Reliability
- **NFR-R01**: A brief with no passing row still prints the fallback head it prints today.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a result with no passing recommendation renders the fallback head, and the plugin's label falls back to the first row for its status metadata only.
- Maximum input: three passing rows where the head, the partner and a doctor bridge all name one command print that command once.
- Failure path: a companion whose command row has no policy prints the command alone, as today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Eight files, about 220 lines with tests, two runtimes |
| Risk | 12/25 | Changes what every runtime's model reads on the head, guarded by golden briefs and floors |
| Research | 8/20 | Both render paths captured by a probe, one defect found beyond the reviews |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Level: `recommend-level.sh --loc 220 --files 9` printed Level 1. Decision: Level 2, because the closure gate is `acceptance-criteria.md`.
- Does the plain tune attached count rise when the head keeps its command in the default shape? Not measured at planning. T010 records the line, and a rise is reported as a delivery gain with the floor recapture left to the coordinator.
<!-- /ANCHOR:questions -->

---


