---
title: "Feature Specification: Phase 12: manual-testing-scenarios"
description: "Adds 33 operator scenarios to the system-skilled-bots manual testing playbook for everything phases 001 to 011 deliver, conversation scenarios first, then executes every one of them and records PASS or FAIL with evidence."
trigger_phrases:
  - "manual testing scenarios"
  - "phase 12 manual testing scenarios"
  - "openbot parity manual testing playbook"
  - "conversation scenarios for bots chat"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: manual-testing-scenarios

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 14 |
| **Predecessor** | 011-messaging-channels |
| **Successor** | 013-skilled-and-doc-alignment |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh --strict` prints `RESULT: PASSED` for this folder. The successor reads the corpus and the run folder this phase leaves, and nothing else. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the OpenBot parity build. Phases 001 to 011 each land a slice of the runtime: activity and the actor, routines, the terminal screen, the working place, memory, approval grants, per-bot apps, the vault, skills, conversations and messaging channels. Each one closes on its own automated suite, and no phase proves that an operator can drive the slice from a terminal. This phase writes that proof as a corpus of manual scenarios and then runs it.

**Scope Boundary**: The manual testing playbook under `.skilled/skills/system-skilled-bots/manual-testing-playbook/`, its root index, and the run folder the recorder writes under `benchmark/reports/`. The eleven phase specs are read and never edited. No runtime module, CLI verb, test or crate changes.

**Dependencies**:
- The eleven phase specs, which name every verb and record a scenario asserts [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:140]
- The playbook package contract, which fixes the folder shape, the five-section file order and the result-persistence rule [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:67] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:158] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:215]
- The `/create:manual-testing-playbook` command, whose router binds the presentation contract and the workflow YAML [SOURCE: .skilled/commands/create/manual-testing-playbook.md:11]
- The existing 25-scenario corpus, whose category folders, `BOT-NNN` ids and one-bash-block execution form this phase extends [SOURCE: .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md:1]
- The shipped stub executor, which lets a scenario dispatch a real run without calling a model [SOURCE: .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-run/needs-you-park-and-hold.md:1]

**Deliverables**:
- 33 new scenario files in ten new category folders, `BOT-026` to `BOT-058`
- The root index's ten new category sections, its updated counts, its preconditions and its wave plan
- One run folder under `benchmark/reports/` holding `results.csv`, `README.md` and `source.md`, and the run's row in `benchmark/reports/README.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every parity slice closes on an automated suite that calls its modules directly. Nothing proves the operator-facing path: that `bots chat` appends a message and dispatches a run, that an answer carrying `--scope deny` records a denial, that a memory proposal is confirmed rather than silently written, that a channel reply from a non-approver is refused. The existing playbook stops at the pre-parity surface, so its 25 scenarios say nothing about any of the eleven phases.

### Purpose
One corpus that an operator can run from a plain terminal, covering every verb and record the eleven phases deliver, with each verdict recorded as `PASS` or `FAIL` and its evidence saved.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

The eight verbs the eleven phases add do not exist yet, `bots inbox` takes no `--json`, and the playbook holds the pre-parity corpus only.

```text
$ for v in activity routines ui remember secret skill chat channel; do printf '%-10s ' "$v"; node .skilled/bin/bots.cjs $v 2>&1 | head -1; done
activity   bots: unknown verb: activity
routines   bots: unknown verb: routines
ui         bots: unknown verb: ui
remember   bots: unknown verb: remember
secret     bots: unknown verb: secret
skill      bots: unknown verb: skill
chat       bots: unknown verb: chat
channel    bots: unknown verb: channel
$ node .skilled/bin/bots.cjs inbox --json; echo "exit=$?"
bots: inbox takes no --json
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
exit=2
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots | grep -E '^(PASS|FAIL)'
PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=25 categories=7 operator=19 routing_gold_excluded=6 violations=0 warnings=0
```

The corpus holds 25 scenario files in 7 category folders, and the package validator passes them. Every number this spec states about the corpus as it stands quotes that last line; the 33 new files, 58 total and 17 categories are this phase's targets.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add 33 scenario files, `BOT-026` to `BOT-058`, in ten new kebab-case category folders, each carrying the five numbered sections in order and the eight fields the package validator requires [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:158]
- Write the nine conversation scenarios first, as multi-turn operator conversations with the bots CLI in one bash block whose turns are numbered, so a message, a parked question, an answer and a resumed run are one scenario rather than four
- Name in each scenario the verb and the record its phase defines, with a citation to that phase's requirement line, so a reader checks the scenario against the requirement it proves
- Compute every timing scenario's slot at run time from the current clock plus two minutes, and use a short loop for the `until` and fatigue scenarios, so no scenario waits for a future day
- Execute every created scenario and record its `PASS` or `FAIL` with its evidence through `record-playbook-run.cjs`, the one writer of a run folder [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:215]
- Fix a `FAIL` in the scenario, or file it as a defect naming the phase, the requirement and the observed line
- Extend the root index with the ten new category sections, the updated counts, the preconditions and the wave plan

### Out of Scope
- A scenario for a behavior no phase delivers - the corpus proves what 001 to 011 built, and a scenario for a later packet would assert a verb that does not exist
- A real Telegram, Slack, Signal or WhatsApp account as a requirement - the channel scenarios run on the fake transport the phase 011 conformance rules already use [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:204], and a real account is an optional operator prerequisite that records `SKIP` when absent
- The `json conversation` runner style - the shared runner plays turns into an AI runtime session, and the subject here is the bots CLI, so the multi-turn form is one bash block with numbered turns, which the existing corpus already uses [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:306]
- Editing the eleven phase specs, the runtime, the CLI, the tests or the Rust crate - this phase reads them and writes documentation only
- A new automated test - the phases own their suites, and this phase's proof is the recorded manual verdict

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md` | Modify | Ten new category sections, the updated counts, the preconditions, the wave plan and the scenario table rows |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/conversations/` | Create | Nine conversation scenarios, `BOT-026` to `BOT-034` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/routines/` | Create | Five routine scenarios, `BOT-035` to `BOT-039` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/activity/` | Create | Three activity and actor scenarios, `BOT-040` to `BOT-042` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/terminal-screen/` | Create | Three screen scenarios, `BOT-043` to `BOT-045` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/working-place/` | Create | Two working-place scenarios, `BOT-046` and `BOT-047` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/memory/` | Create | Three memory scenarios, `BOT-048` to `BOT-050` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/apps/` | Create | Two app scenarios, `BOT-051` and `BOT-052` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/vault/` | Create | Three vault scenarios, `BOT-053` to `BOT-055` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/skills/` | Create | Two skill scenarios, `BOT-056` and `BOT-057` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/channels/` | Create | One channel queue scenario, `BOT-058` |
| `.skilled/skills/system-skilled-bots/benchmark/reports/<dated-run-label>/` | Create | The run folder the recorder writes: `results.csv`, `README.md` and `source.md` |
| `.skilled/skills/system-skilled-bots/benchmark/reports/README.md` | Create | The run index the recorder writes, with the run's row |

### Scenario Inventory

One row per new scenario. The phase column names the spec whose requirement the scenario proves, and the conversation rows come first because a conversation is the only form that proves a message, a parked question, an answer and a resumed run in one pass.

| ID | Category | Phase | What it proves |
|----|----------|-------|----------------|
| BOT-026 | conversations | 010 | `bots chat` appends one human and one bot message and dispatches one run [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:152] |
| BOT-027 | conversations | 010 | `@bot` routes a message to the named bot, and a bot with no `BOT.md` is refused `bot-unknown` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:155] |
| BOT-028 | conversations | 010, 001 | a parked chat run is answered with `--scope once` and the resume appends its bot message [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:168] |
| BOT-029 | conversations | 001, 006 | `--scope deny` records `deny`, and `--scope always` is refused `grant-scope-unsupported` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:156] |
| BOT-030 | conversations | 006 | the item carries `grants` and the inbox line prints its kind, rung and scope [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153] |
| BOT-031 | conversations | 005 | a `[REMEMBER]` line becomes a `memory-proposal`, `confirm` appends the fact and `reject` appends nothing [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152] |
| BOT-032 | conversations | 009 | `bots skill propose` writes the draft and one `skill-proposal` item, and the answer records the decision with no resume [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:163] |
| BOT-033 | conversations | 011 | a link and a numbered reply answer an item through the fake transport [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:190] |
| BOT-034 | conversations | 011 | a channel answer from a non-approver is refused `answer-not-approver` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:187] |
| BOT-035 | routines | 002 | the routine block renders and `bots routines` lists it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:173] |
| BOT-036 | routines | 002 | a routine's cron start installs and fires at the slot computed at run time [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:162] |
| BOT-037 | routines | 002 | the `until` outcome sets `completed` and records `untilMetAt` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:165] |
| BOT-038 | routines | 002 | a cron start under 900 seconds is refused `routine-floor-15-minutes` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:166] |
| BOT-039 | routines | 002 | ten consecutive failures disable the bot and raise one item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:167] |
| BOT-040 | activity | 001 | `bots activity` groups rows under the seven ids in order [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:151] |
| BOT-041 | activity | 001 | `bots inbox --json` carries the item fields [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] |
| BOT-042 | activity | 001 | the actor is recorded on the answer and on the run record [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:155] |
| BOT-043 | terminal-screen | 003 | the screen refuses without the binary and exits 4 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162] |
| BOT-044 | terminal-screen | 003 | the inbox pane answers with `y` and `n` through `bots answer --scope` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:167] |
| BOT-045 | terminal-screen | 003 | the banner and the overlay draw every key they bind [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:169] |
| BOT-046 | working-place | 004 | the prompt names the working place and the record carries the branch [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:143] |
| BOT-047 | working-place | 004 | `bots status` prints `branch` and `worktree` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:146] |
| BOT-048 | memory | 005 | `bots remember` appends and `--list` prints the entry [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:146] |
| BOT-049 | memory | 005 | the memory block is injected and an empty file injects nothing [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:151] |
| BOT-050 | memory | 005 | the 60-entry and 3,600-byte bound refuses the next append [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:148] |
| BOT-051 | apps | 007 | `apps:` filters `utcp.json` and records `posture.apps` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:142] |
| BOT-052 | apps | 007 | `apps-unknown-server` fails the checker [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:141] |
| BOT-053 | vault | 008 | `bots secret set` stores a value and `list` prints no value [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:146] |
| BOT-054 | vault | 008 | the secret reaches the child and `secretsUsed` records the name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:152] |
| BOT-055 | vault | 008 | a printed secret is redacted and records `secret-in-output` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:164] |
| BOT-056 | skills | 009 | a `skills:` list injects the body at the skills position [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161] |
| BOT-057 | skills | 009 | `skills-over-budget` refuses a list whose bodies cross the cap [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162] |
| BOT-058 | channels | 011 | the send queue records `unknown` and never retries [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:195] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The playbook gains one scenario file per inventory row in a kebab-case category folder, each carrying the five numbered sections in order and the eight fields the package validator requires, so `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS` with `violations=0` |
| REQ-002 | The conversation scenarios come first: nine files under `conversations/`, each a multi-turn operator conversation with the bots CLI in one bash block whose turns are numbered, covering `bots chat` and `@bot` routing, an answer with `--scope`, the item's `grants`, a memory confirmation, a skill proposal review and the channel fake transport |
| REQ-003 | Every scenario names the verb and the record its phase defines and cites that phase's requirement line, so a reader checks the scenario against the requirement it proves |
| REQ-004 | Every timing scenario computes its slot at run time from the current clock plus two minutes and names no future day, and the `until` and fatigue scenarios use a short loop with no wait |
| REQ-005 | Every created scenario is executed and its `PASS` or `FAIL` recorded with its evidence in `benchmark/reports/<dated-run-label>/results.csv` through `record-playbook-run.cjs`, which is the one writer of that folder |
| REQ-006 | Every `FAIL` is either fixed in the scenario or filed as a defect naming the phase, the requirement and the observed line, and no `FAIL` is left unnamed |
| REQ-007 | The root playbook index gains the ten new category sections, the updated scenario and category counts, the preconditions the new scenarios need and the wave plan |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | A real channel account is an optional operator prerequisite: the channel scenarios run on the fake transport, and a scenario that names a real account records `SKIP` with the missing account as its blocker |
| REQ-009 | The root index's scenario table lists every id with its category and its feature-catalog link, and a scenario with no catalog entry says so |
| REQ-010 | `benchmark/reports/README.md` gains the run's row, so the corpus's execution is visible from the skill's benchmark index |
| REQ-011 | The corpus holds no scenario for a behavior no phase delivers, and every phase requirement the inventory names has a scenario, so the inventory table and the files on disk agree |
| REQ-012 | Every scenario's check runs without a tty: the terminal-screen scenarios prove the binary's refusal, the lib-level key handling and the `bots answer` write by commands that need no terminal |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=58 categories=17 operator=52 routing_gold_excluded=6 violations=0 warnings=0`
- **SC-002**: `results.csv` holds one row per created scenario, each `PASS` or `FAIL` with a reason and an evidence path
- **SC-003**: no `FAIL` is left both unfixed and unfiled
- **SC-004**: every timing scenario's slot is computed at run time, proved by `rg -n 'date -v\+2M' <file>` printing the computation
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The eleven phase specs | A scenario names a verb a phase renamed, and the scenario proves nothing | Read the phase spec at authoring time and cite its requirement line, so a rename breaks the citation rather than the scenario silently |
| Dependency | The shipped stub executor | A scenario cannot dispatch a run without calling a model | The stub is the stand-in the existing corpus already uses, and it is first on PATH in every scenario's world |
| Dependency | The package validator | A malformed scenario file fails the package rather than one scenario | Run the validator after each authoring wave, not once at the end |
| Risk | A scenario waits for a future day | High: the corpus cannot be executed in one sitting | Compute the slot at run time from the current clock plus two minutes, and bound the wait at three minutes |
| Risk | A scenario needs a tty | High: the check cannot run in this environment | Every check is a command that needs no terminal, and the screen's key handling is proved at the lib level |
| Risk | A real channel account is treated as required | Medium: the channel scenarios never run | The fake transport is the default, and a real account is an optional prerequisite that records `SKIP` |
| Risk | The corpus drifts from the phases | Medium: a scenario asserts a shape the phase changed | Each scenario cites its phase requirement line, and the inventory table names the phase per row |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The whole corpus executes in under 20 minutes on one machine, with the one schedule scenario bounded at 3 minutes
- **NFR-P02**: One scenario's bash block runs in under 60 seconds, except the schedule scenario

### Security
- **NFR-S01**: No scenario writes a real secret value or a real channel token; every scenario uses a temp state root and a `pb-` bot id
- **NFR-S02**: A scenario that would print a stored secret prints the redacted form only, so the evidence never carries a value

### Reliability
- **NFR-R01**: A scenario that cannot run records `SKIP` with its blocker, never a silent pass
- **NFR-R02**: A scenario's verdict is reproducible from its own bash block alone, with no step that depends on another scenario having run
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a state root with no items makes `bots inbox --json` print `[]` and leaves every activity group empty, and the scenario asserts the empty shape rather than a missing line
- Maximum input: a memory file at 60 entries and 3,600 bytes refuses the next append with `bots: memory-full: <path> (<n> entries, <b> bytes)` and exit 1, leaving the file unchanged
- Failure path: a scenario whose command exits non-zero records `FAIL` with the exit status and the line that disagreed, and the run folder keeps both
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 33 new files, one root index, one run folder; no runtime change |
| Risk | 8/25 | No production surface; the risk is a scenario that cannot run or that waits |
| Research | 6/20 | The eleven phase specs are the source, and the playbook contract is already written |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the corpus use the `json conversation` runner style? Decision: no. The runner plays turns into an AI runtime session, and the subject here is the bots CLI, so the multi-turn form is one bash block with numbered turns, which the existing corpus already uses [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:306]. Reversal condition: if a scenario must prove how an AI runtime answers a bot's question, that scenario takes the runner style and records `SKIP` when tmux or the runtime is absent
- Does a real channel account gate the channel scenarios? Decision: no. The fake transport proves the contract, and a real account is an optional operator prerequisite that records `SKIP` with the missing account as its blocker [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:204]
- How many scenarios does the corpus gain? Decision: 33, one per requirement cluster rather than one per requirement, because a scenario that asserts one field of one record costs a full bash block and proves less than a scenario that drives the verb end to end
- Does this phase edit the eleven phase specs? Decision: no. A scenario that finds a phase's behavior wrong files a defect against that phase, and the phase's own packet carries the fix
<!-- /ANCHOR:questions -->

---

