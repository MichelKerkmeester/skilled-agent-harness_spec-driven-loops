---
title: "Decision Record: Phase 2: schedule-predicates-and-checker"
description: "Proposed decisions for the schedule predicates and checker: the probe-decided weekday rule, the dictionary cap, the daylight-saving slot rule, the label grammar and where the checker lives."
trigger_phrases:
  - "schedule predicates and checker decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker"
    last_updated_at: "2026-11-22T10:48:28Z"
    last_updated_by: "spec-writer"
    recent_action: "Wrote five proposed decisions for the phase"
    next_safe_action: "Install the weekday probe and record its observation under ADR-001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-schedule-predicates-and-checker"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 2: schedule-predicates-and-checker

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Weekday-only cron follows the live probe

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, 2026-11-24: emit |
| **Date** | 2026-11-22 |
| **Deciders** | Phase implementer, decided by the probe evidence. Not an operator decision |

---

<!-- ANCHOR:adr-001-context -->
### Context

The man page says a missing calendar key is a wildcard and describes the either-matches rule only when both `Day` and `Weekday` are set (research.md §7, `/usr/share/man/man5/launchd.plist.5` lines 448 to 479). No iteration tested whether `{Hour: 9, Minute: 0, Weekday: 1}` fires on Mondays only (research.md §16 Q1). The hub's own worked example, `0 9 * * 1-5`, depends on the answer (research.md §5). This decision blocks phase close.

**Probe observation:** fired on Monday only. The probe was installed on Sunday 2026-11-22 at 18:46:04 with Weekday 1 at 12:00, so Monday 2026-11-23 was the matching day and Tuesday 2026-11-24 the non-matching day. The whole fire log is one line:

```text
2026-11-23T12:00:04+0100 Mon
```

`probe-weekday.sh status`, run on 2026-11-24 at 12:07:11, printed `runs = 1` and `last exit code = 0`, exit 0. The host stayed awake through both slots: `pmset -g log` has its last Sleep entry on 2026-11-21 and no Sleep, Wake or DarkWake entry from 2026-11-22 to 2026-11-24. The Monday fire landed 4 seconds after its slot, so it is no catch-up fire. The full record is in `scratch/probe-result.txt`. The probe plist as loaded:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.skilled.probe.weekday</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string>
    <string>-c</string>
    <string>/bin/date '+%Y-%m-%dT%H:%M:%S%z %a' &gt;&gt; "$HOME/.local/state/skilled-probe/weekday.log"</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>12</integer>
    <key>Minute</key>
    <integer>0</integer>
    <key>Weekday</key>
    <integer>1</integer>
  </dict>
</dict>
</plist>
```

**Probe status (2026-11-24):** removed. `probe-weekday.sh remove` printed `removed`, exit 0. Then `ls ~/Library/LaunchAgents | rg com.skilled.probe` printed nothing, exit 1, and `launchctl print gui/501/com.skilled.probe.weekday` exited 113.

### Constraints

- The probe is a hand-written plist that only appends `date` to a log outside the checkout. It calls no runner and no agent.
- Its label, `com.skilled.probe.weekday`, sits outside the `com.skilled.bots.` prefix, so no hub sweep or status row can mistake it for a bot.
- It is the one stated exception to the rule that nothing is scheduled before the runner and its kill switches exist. It is removed before close.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Emit a `Weekday`-only cron as calendar dictionaries with that key alone if the probe fires only on matching days, and refuse the form with its own invariant id if it does not. A `Day`-only cron takes the same rule. That is an inference from the shared wildcard sentence (line 450), because the probe tests `Weekday` alone.

**How it works**: Install the probe on day one. Read its log after one matching and one non-matching day. Set the translator rule and its test to the observed result. If the rule is refuse, hand the change of the worked example to phase 1 and research.md §5.

**Interim rule until the probe runs**: refuse. A cron that restricts only one of the two day fields fails translate with `cron-single-day-field-unverified`, behind the one constant `SINGLE_DAY_FIELD_RULE` in `cron-translator.ts`. Refusing is the conservative side of this decision's own alternatives: a wrong emit could fire an unattended bot every day, and a wrong refuse only blocks an install. The same refusal covers `0 9 * * 1-5`, `0 0 1 * *`, `@weekly`, `@monthly` and `@yearly`. If the probe fires only on matching days, the flip is that constant plus its test.

**Outcome (2026-11-24)**: the probe fired only on its matching day, so `SINGLE_DAY_FIELD_RULE` is now `emit`. A lone `Weekday` or `Day` key is emitted alone, and the test asserts the dictionaries for `0 9 * * 1-5`, `0 0 1 * *` and `@weekly`. The worked example needs no handoff to phase 1.

**Found while building**: cron reads the two day fields as AND, not OR, when either field starts with `*` (for example `*/2` beside a weekday). launchd's documented two-key rule is either-match, so that form has no exact translation and is refused with `cron-day-fields-and`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Decide by probe (chosen)** | Grounds the rule in observed behavior | Needs at least two calendar days | 9/10 |
| Assume cron behavior, emit without a probe | No wait | An unattended bot could fire every day | 3/10 |
| Refuse the form without a probe | Safe | Refuses the flagship weekday example for no proven reason | 5/10 |

**Why this one**: The question is factual and cheap to observe, and the cost of a wrong guess lands on unattended runs.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The weekday rule rests on a recorded fire log, not on a reading of the man page.
- Phase 6 can install a weekday bot with a tested translation.

**What it costs**:
- The phase waits on calendar days. Mitigation: start the probe first, and phase 3 runs in parallel.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The probe misses a fire because the host sleeps through the slot | M | launchd fires at the next wake (man page lines 456 to 459). Keep the host awake at the slot time on both observed days, or extend the probe |
| A catch-up fire after wake lands on a non-matching day and looks like a wrong fire | M | Read `pmset -g log` beside the probe log. Count only fires within a minute of the slot time |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The worked example and every weekday bot depend on it |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | One plist and two days |
| 4 | **Fits Goal?** | PASS | Blocks phase 6 weekday installs |
| 5 | **Open Horizons?** | PASS | Settles the question once for every later backend that reads the same cron string |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `cron-translator` gets one rule and one test for the weekday-only form, and the same rule for the day-only form.
- `decision-record.md` gets the probe observation.

**How to roll back**: `launchctl bootout gui/$(id -u)/com.skilled.probe.weekday`, then delete `~/Library/LaunchAgents/com.skilled.probe.weekday.plist`. The translator rule is one branch and its test.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Dictionary cap of 128 entries

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-002-context -->
### Context

A calendar key holds one integer, so cron lists and steps multiply into an array of dictionaries. `*/15 0-23/2 * * *` gives 48 (research.md §7). The translator needs a cap and must refuse past it, never truncate.

### Constraints

- The cap must be at least 48, or the acceptance fixture refuses itself.
- A refusal is a named invariant, not a silent cut.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We propose**: Cap the expansion at 128 dictionaries and refuse a larger one with its own invariant id.

**How it works**: The translator counts the product of the expanded fields before it builds the array. Above 128 it returns the cap refusal and the count it would have produced.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **128 (chosen)** | Covers 48 and hourly every-15-minutes (96) with room | Still refuses `*/5 9-17 * * 1-5` (540) | 8/10 |
| 64 | Smaller plists | Refuses the 96-entry every-15-minutes form | 5/10 |
| 256 or no cap | Accepts more forms | Large plists nobody reviews. No cap means unbounded files | 4/10 |

**Why this one**: 128 is the smallest power of two above the common every-15-minutes form, and a refusal names the count so the author can split the schedule.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Every installed plist stays small enough to read.
- An author sees the would-be count in the refusal.

**What it costs**:
- Some dense schedules are refused. Mitigation: the author splits them into several schedule entries, which the label grammar already indexes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A useful schedule is refused | L | The refusal message names the count and the split |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The translator needs a bound |
| 2 | **Beyond Local Maxima?** | PASS | Three values compared |
| 3 | **Sufficient?** | PASS | One constant |
| 4 | **Fits Goal?** | PASS | Phase 6 reads the same constant |
| 5 | **Open Horizons?** | PASS | The constant can rise later without a format change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- One exported constant in `cron-translator`, imported by the checker.

**How to roll back**: Change the constant and its test.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Slot lister rule across a daylight-saving change

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Phase implementer. The launchd side stays unverified |

---

<!-- ANCHOR:adr-003-context -->
### Context

The runner must list the slots one wake fire stood for, to write `scheduled_at` and a skipped-slot summary. The research ruled out a second cron evaluator, so the lister reads the translator's dictionaries. No iteration designed its daylight-saving behavior (research.md §7, §16 Q4). This record takes launchd calendar keys as local wall-clock values. The man page names no time zone, so that reading is unverified. What launchd does with a skipped or repeated local hour is UNKNOWN. No source in the research covers it.

### Constraints

- The lister never parses cron.
- The rule must be testable under a fixed `TZ` without waiting for a real clock change.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We propose**: List slots in local wall-clock time. A slot whose local time does not exist in a spring-forward gap is not listed. A slot in a repeated fall-back hour is listed once, at its first occurrence.

**How it works**: The lister walks each local day in the range, builds each matching wall-clock time from the dictionaries and converts it to an instant. A time that does not round-trip is dropped. A repeated time keeps its earlier instant. For `StartInterval 60` it lists one slot per 60 seconds after the last run, with no calendar alignment. Built as proposed. ECMAScript resolves an ambiguous local time to its earlier instant, which is the first occurrence this rule wants; the fall-back test pins it under `TZ=Europe/Amsterdam`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Local time, drop gap, first occurrence (chosen)** | Simple, deterministic, never double-counts | May differ from launchd at a clock change | 7/10 |
| List in UTC | No clock-change cases | launchd keys are local, so every slot would be off by the offset | 2/10 |
| Shift a gap slot to the first instant after it | Mirrors some cron daemons | Unverified for launchd, and adds a slot that may never fire | 5/10 |

**Why this one**: The lister feeds accounting, not firing, so a rule that never invents or doubles a slot is the safe choice until launchd's behavior is observed.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- `scheduled_at` and the skipped-slot summary have one defined meaning.
- The agreement test covers the boundary case.

**What it costs**:
- A slot launchd may fire inside a gap is not in the list. Mitigation: the runner classes such a fire as late or catch-up, and the record keeps the raw fire time.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| launchd behavior differs from the lister at a real clock change | M | Mark it unverified in the docs. A probe across a real change is later work |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 6 needs the list |
| 2 | **Beyond Local Maxima?** | PASS | Three rules compared |
| 3 | **Sufficient?** | PASS | One walk over local days |
| 4 | **Fits Goal?** | PASS | Required for slot accounting |
| 5 | **Open Horizons?** | PASS | A later probe can tighten the rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `slot-lister` with the rule and a fixture under a fixed `TZ`.

**How to roll back**: Replace the rule branch and its fixture.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Label grammar `com.skilled.bots.<identity>.<bot-id>.<schedule-index>`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-004-context -->
### Context

Every repository installs into the same `~/Library/LaunchAgents`, so a bare bot id lets two repositories collide (research.md §7). The repository's existing agents use the `com.skilled.` prefix, for example `com.skilled.orphan-sweep` in `.skilled/scripts/launchagents/README.md`.

### Constraints

- The label must parse back to its parts so status and the uninstall sweep can find orphans.
- Identity comes from phase 1. An unknown identity cannot form a label.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We propose**: Build labels as `com.skilled.bots.<identity>.<bot-id>.<schedule-index>`, with identity reduced to a label-safe slug, and refuse when identity is unknown.

**How it works**: `label` builds and parses the four parts. The identity slug lowercases the identity and writes every character outside `[a-z0-9-]` as `_` plus two hex digits, `_` included, so the slug holds no dot and decodes exactly: `local/tool` becomes `local_2ftool`. The `com.skilled.bots.` prefix marks hub labels. The probe uses `com.skilled.probe.weekday`, which the parser rejects as not a hub label.

**Drain label**: phase 6 installs one queue-drain agent per repository identity, and that agent has no bot id or schedule index. Its label is `com.skilled.bots.<identity>.drain`. `label` builds and parses this form beside the bot form. The bot id `drain` is reserved, so no bot label can be read as a drain label. A checker invariant enforces the reservation and fails a `BOT.md` whose `id` is `drain`.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Prefix plus identity, id and index (chosen)** | No collisions, sweepable, parseable | Long labels | 8/10 |
| Bot id only | Short | Two repositories collide | 1/10 |
| Hash of the whole tuple | Short and unique | Not readable in `launchctl list` | 5/10 |

**Why this one**: Readable labels make `launchctl print` and the orphan sweep usable by a person.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Two repositories with the same bot id never share a job.

**What it costs**:
- A slug step for identity. Mitigation: the slug rule is tested with a round trip.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Two identities slug to the same string | M | The parser test includes a near-collision pair, and the installer refuses a label already owned by another identity |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Collision is a known failure |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes compared |
| 3 | **Sufficient?** | PASS | String build and parse |
| 4 | **Fits Goal?** | PASS | Phase 6 and phase 7 read it |
| 5 | **Open Horizons?** | PASS | New backends can keep the same tuple |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `label` module and its round-trip test, for the bot form and the drain form.
- One checker invariant that refuses the reserved bot id `drain`.

**How to roll back**: Replace the module before phase 6 installs anything. Nothing is installed in this phase.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Checker lives in the skill's scripts folder

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-005-context -->
### Context

The research names the checker a new doctor command (research.md §6). The command surface moves to phase 8, and nothing is reported routed before then. The existing doctor scripts live in `.skilled/commands/doctor/scripts/`, and `parent-skill-check.cjs` there is the model for the output contract.

### Constraints

- This phase must not register a doctor command.
- Phase 8's doctor asset must be able to call the script by path.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We propose**: Create the checker at `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`, beside its predicates, and let phase 8 point the doctor asset at it.

**How it works**: The script imports the skill's own runtime modules by relative path. Phase 8 adds the doctor YAML asset that runs it.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Skill scripts folder (chosen)** | No edit to a shared folder before wiring, imports stay local | The doctor folder does not list it until phase 8 | 8/10 |
| `.skilled/commands/doctor/scripts/` | Beside the other checkers | Touches a shared surface before the wiring phase | 5/10 |

**Why this one**: Keeping the script with its predicates avoids an early shared edit and keeps imports short.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- No shared doctor file changes in this phase.

**What it costs**:
- Phase 8 must add the asset. Mitigation: phase 8 scope already lists it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The body-secret invariant needs phase 3's detector | M | Ship that invariant when phase 3 lands the detector, or defer it to phase 3. Do not write a second detector here |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The checker must exist before phase 6 |
| 2 | **Beyond Local Maxima?** | PASS | Two homes compared |
| 3 | **Sufficient?** | PASS | One script |
| 4 | **Fits Goal?** | PASS | Phase 8 wires it |
| 5 | **Open Horizons?** | PASS | Moving it later is a path change in one asset |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `bot-check.cjs`, its fixtures and tests under the skill folder.

**How to roll back**: Delete the script and its fixtures. No other file references it before phase 8.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | If the weekday probe did not fire cleanly, phase 002 would stay open with the probe installed for another Monday, while 006 and 008 still closed. | Not stated. | None | ADR-001, AC-001, scratch/probe-result.txt |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01SrMxhpdYJTUNuvdUrkGKVk:1 -->

Question:
```text
Today's 12:00 probe is the evidence that the Monday-only schedule rule holds. What should I do if it doesn't fire cleanly, for example because the Mac is asleep at 12:00 and launchd fires it late or not at all?
```

Options:
```text
Leave 002 open (Recommended)
Close on Monday alone
```

Answer:
```text
Leave 002 open (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
