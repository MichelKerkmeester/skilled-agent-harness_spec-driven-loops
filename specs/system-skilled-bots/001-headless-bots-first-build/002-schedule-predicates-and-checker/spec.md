---
title: "Feature Specification: Phase 2: schedule-predicates-and-checker"
description: "Bots need a cron string turned into launchd calendar entries that fire exactly like cron, or refused. They also need a checker that fails a bad BOT.md before anything installs it. This phase builds the translator, the label grammar, the slot lister and the definition checker, and settles the weekday-only question with a live probe."
trigger_phrases:
  - "schedule predicates and checker"
  - "phase 2 schedule predicates and checker"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: schedule-predicates-and-checker

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-22 |
| **Branch** | `scaffold/002-schedule-predicates-and-checker` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 8 |
| **Predecessor** | 001-contracts-and-state-root |
| **Successor** | 003-manual-runner |
| **Handoff Criteria** | The weekday probe result is recorded with dates, plist text and fire log. The translator, label grammar and slot lister are callable predicates with tests. The checker passes the clean fixture and fails each negative fixture with its invariant id. The probe plist is removed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Build system-skilled-bots: file-defined headless agent bots run on a schedule or event specification.

**Scope Boundary**: Schedule predicates and the definition checker only. This phase installs no bot, renders no bot plist and registers no doctor command. The one launchd job it touches is a hand-written weekday probe that calls no runner and no agent.

**Dependencies**:
- Phase 1 (`001-contracts-and-state-root`): the `BOT.md` parser, field predicates, `bots/config.json` reader and repository identity. The checker and the label grammar import them.
- Phase 3 (`003-manual-runner`) does not depend on this phase. The two run in parallel after phase 1, so the probe wait holds no runner work.
- Phase 6 (`006-launchd-installer`) consumes the translator, the label grammar and the slot lister.
- Phase 8 (`008-hub-wiring`) registers the checker as a doctor command.
- Standing rules: parent spec §6. That section names the weekday probe as the one stated exception to the scheduling invariant.

**Deliverables**:
- Cron to calendar-dictionary translator that is exact or refuses (research.md §7).
- Label grammar for one launchd agent per bot schedule (research.md §7).
- Slot lister built from the translator's own expanded output (research.md §7, §16 Q4).
- Definition checker script with the §6 output contract and negative fixtures (research.md §6).
- A recorded live observation of a `Weekday`-only calendar job (research.md §16 Q1).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A bot author writes a cron string, and launchd only takes calendar dictionaries that hold one integer per key. A wrong translation fires a bot on the wrong days or twice, and nobody is watching an unattended run. The repository has no cron evaluator and no checker for a user-authored file outside `.skilled`, so a bad `BOT.md` would only fail at its first fire (research.md §6, §7).

### Purpose
Every cron string either becomes calendar entries that fire as cron would or is refused with a named reason, and every `BOT.md` is checked by one script that imports the same predicates the installer will use.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ grep -n 'Weekday' /usr/share/man/man5/launchd.plist.5
474:.It Sy Weekday <integer>
478:.Nm Weekday
exit 0

$ ls -A .skilled/skills/system-skilled-bots | wc -l
       0
```

The man page names `Weekday` only as a key and in the rule for when both `Day` and `Weekday` are set (lines 474 to 479). It also says a missing key is a wildcard (line 450). It says nothing specific about `Weekday` alone. The skill folder exists and is empty, so no translator, label or checker exists yet.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Install a hand-written `Weekday`-only probe job on the first day of the phase and record what it does across at least one matching and one non-matching day (research.md §16 Q1).
- Build the cron translator: exact calendar dictionaries or a refusal with an invariant id. Apply a dictionary cap. Refuse `@reboot`, `@AppleNotOnBattery` and the percent-stdin form. Emit every-minute as `StartInterval 60` (research.md §7).
- Build the label grammar from repository identity, bot id and schedule index (research.md §7).
- Build the slot lister from the translator's expanded dictionaries, never from a second cron evaluator, with a tested daylight-saving rule (research.md §7, §16 Q4).
- Build the definition checker with the `PASS|FAIL|WARN|INFO: <id>: <message>` contract, exits 0, 1 and 2, a strict switch and one negative fixture per invariant (research.md §6).
- Refuse a definition set whose `bots/config.json` has no `identity` key when the repository has no remote. This is a `FAIL` with its own invariant id. The operator chose an explicit `identity` in config for a repository with no remote (operator decision, 2026-11-22). That identity takes the same `owner/name` shape phase 1 accepts, for example `local/tool`. Phase 1's reader rejects any other shape with `identity-invalid`.

### Out of Scope
- The installer, `bootstrap`, `bootout` and any bot plist. Phase 6 owns them, and nothing may be scheduled before the runner and its kill switches exist (research.md §1 decision 6, §15).
- The doctor command surface. Phase 8 registers it, because nothing is reported routed before the wiring phase (research.md §15 step 9).
- The `isolation: worktree` invariant. It needs the provisioned-path list, which phase 4 adds with its fixture.
- Fire-time slot accounting in the runner. Phase 6 uses the lister at fire time. This phase only builds and tests the lister.
- Edits to the worked example in phase 1 or research.md. If the probe forces a refusal, this phase hands the change to phase 1.

### Files to Change

Paths under the skill are proposed. Phase 1 settles the code layout and the language. Extensions follow that decision.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts` | Create | Cron string to calendar dictionaries, `StartInterval 60`, or a refusal with an invariant id |
| `.skilled/skills/system-skilled-bots/runtime/lib/label.ts` | Create | Build and parse `com.skilled.bots.<identity>.<bot-id>.<schedule-index>` |
| `.skilled/skills/system-skilled-bots/runtime/lib/slot-lister.ts` | Create | List the slots between two instants from the translator's output |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Create | Definition checker with the §6 output contract |
| `.skilled/skills/system-skilled-bots/runtime/tests/` | Create | Unit tests for translator, label and lister |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/` | Create | One clean `BOT.md` plus one defect per invariant |
| `~/Library/LaunchAgents/com.skilled.probe.weekday.plist` | Create, then Delete | Temporary probe that appends a timestamp to a log outside the checkout. Removed at close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The weekday probe is installed, observed on at least one matching and one non-matching day, and recorded with dates, plist text and the fire log. The phase cannot close before this record exists. |
| REQ-002 | The translator rule for a `Weekday`-only cron matches the probe result: emit the key alone if the probe fired only on matching days, refuse the form if not. A `Day`-only cron takes the same rule by inference, because the same wildcard sentence covers both keys. The probe does not test `Day` alone. |
| REQ-003 | `*/15 0-23/2 * * *` (every 15 minutes in every second hour) yields 48 dictionaries. A cron that restricts both `Day` and `Weekday` yields one dictionary per time, never two. |
| REQ-004 | `@reboot`, `@AppleNotOnBattery`, the percent-stdin form and any expansion past the dictionary cap each fail with their own invariant id. `@reboot` parses and still fails the translate check. |
| REQ-005 | The checker prints one `PASS\|FAIL\|WARN\|INFO: <id>: <message>` line per finding and exits 0 when every hard invariant passes, 1 on a failure and 2 when the target is missing or the audit cannot finish. |
| REQ-006 | No code path in this phase calls `launchctl bootstrap` or writes a plist with the `com.skilled.bots.` prefix. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The strict switch changes advisory findings only. A hard failure stays a failure with or without it. |
| REQ-008 | The checker imports the phase 1 field predicates and the phase 2 translator and label grammar. It restates no executor enum, budget bound or cron rule. |
| REQ-009 | The slot lister and the translator agree on a shared fixture set, including one daylight-saving boundary, and the lister handles the `StartInterval 60` case. |
| REQ-010 | Two repositories with the same bot id produce two different labels. A label parses back to its identity, bot id and schedule index. |
| REQ-011 | Every negative fixture starts from the clean definition with one injected defect, and its test asserts the invariant id. |
| REQ-012 | In a repository with no remote, a definition set whose `bots/config.json` has no `identity` key fails the checker with exit 1 and a `FAIL:` line carrying its own invariant id. The same set with `identity` set in the `owner/name` shape, for example `local/tool`, passes that invariant. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The probe log shows fire timestamps on matching weekdays and the decision record names the resulting translator rule.
- **SC-002**: The translator test suite passes, including the 48-dictionary case and each refusal by id.
- **SC-003**: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <fixtures>/clean` exits 0 and each defect fixture exits 1 with its invariant id on a `FAIL:` line.
- **SC-004**: `rg -n 'launchctl bootstrap' .skilled/skills/system-skilled-bots` prints no code line, and `ls ~/Library/LaunchAgents | rg com.skilled.probe` prints nothing at close.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 field predicates and repository identity | The checker and the label grammar cannot import what is not built | Build the translator and the lister first. They need no phase 1 code. Start the checker once phase 1 lands |
| Risk | The weekday probe needs calendar days | High: the phase cannot close until it is observed | Install it on day one. Phase 3 does not wait for it |
| Risk | The probe shows `Weekday` alone does not behave like cron | High: the flagship worked example `0 9 * * 1-5` is refused | Translator refuses the form. Hand the example change to phase 1 and research.md §5 |
| Risk | The probe is read as a breach of the scheduling invariant | Med | It calls no runner or agent, uses a label outside the hub prefix and is removed at close. Parent spec §6 names it as the one stated exception |
| Risk | The slot lister drifts from the translator | Med: `scheduled_at` and the skipped-slot summary would lie | The lister reads only the translator's output. A shared fixture set tests both |
| Risk | launchd behavior across a daylight-saving change is not documented | Med | The lister's own rule is decided and tested. launchd's behavior is marked unverified |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Translating one cron string at the dictionary cap finishes in under 50 ms on the build host.
- **NFR-P02**: Listing a week of slots for a five-minute schedule finishes in under 200 ms.

### Security
- **NFR-S01**: The checker is read-only. It writes nothing inside the checkout, a vendored tree or the state root.
- **NFR-S02**: The probe plist runs only `/bin/sh` to append `date` output to a log outside the checkout. It reads no environment secret and calls no agent.

### Reliability
- **NFR-R01**: The translator is deterministic. The same cron string always yields the same ordered dictionary list.
- **NFR-R02**: The checker exits 2, never 0, when it cannot read the target or finish the audit.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: an empty cron string fails translate with its own invariant id. An empty `bots/` folder makes the checker print one `INFO:` line and exit 0.
- Maximum input: an expansion past the dictionary cap is refused with its invariant id, never truncated. Weekday `7` maps to `0`, so `0,7` yields one Sunday entry.
- Failure path: a repository with no remote and no `identity` in `bots/config.json` is a hard failure with its own invariant id, never a guessed identity. An `identity` outside the `owner/name` shape fails through phase 1's `identity-invalid`. A missing target folder exits 2 with a `FAIL:` line naming the path. A definition that fails to parse is a hard failure with exit 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three library modules, one checker script, tests and fixtures. My estimate is 12 to 20 files |
| Risk | 12/25 | A wrong translation fires unattended agents on the wrong days. No installer ships here |
| Research | 12/20 | The weekday rule and the daylight-saving rule need a live probe and a decision |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does a `Weekday`-only calendar entry fire only on that weekday? Answered by the probe, not by the operator. Blocks close (research.md §16 Q1).
- What does launchd do with a calendar slot that a daylight-saving change skips or repeats? UNKNOWN. The lister's rule is decided in `decision-record.md`. launchd's own behavior stays unverified.
- How does the checker detect a secret literal in the body? Phase 3 decides the detector. This phase ships the invariant id only once that predicate exists, or defers it to phase 3.
<!-- /ANCHOR:questions -->

---
