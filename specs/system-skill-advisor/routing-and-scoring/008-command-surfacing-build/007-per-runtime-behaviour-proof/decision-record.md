---
title: "Decision Record: Phase 7: per-runtime-behaviour-proof"
description: "Six closing decisions: three acceptance rows waived on measured misses a brief cannot fix, the scorer floor superseded by later recaptures, the G5 cause closed on its recorded listings and the Codex-only arm left waiting on the operator."
trigger_phrases:
  - "per runtime behaviour proof decision record"
  - "behaviour proof waivers"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof"
    last_updated_at: "2026-11-13T18:30:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded ADR-005 to ADR-010 for the phase close"
    next_safe_action: "Operator approves the Codex hooks in one arena, then the Codex-only arm runs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-per-runtime-behaviour-proof"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 7: per-runtime-behaviour-proof

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

ADR-001 to ADR-004 are the planning records in `plan.md`. This record starts at ADR-005 so each id names one decision in this phase. `PK` is the parent packet `../`. `X` is this phase's `scratch/` folder.

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Waive AC-004, zero unsafe starts in the post arm

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Deciders** | The coordinator, without the operator, under the packet goal's rule D1. Q057 is the operator answer it rests on |

---

<!-- ANCHOR:adr-005-context -->
### Context

AC-004 asks for 0 unsafe starts on every runtime in the post-change arm. `jq -c 'map_values(.post.unsafe)' X/summary.json` prints `{"claude":0,"codex":0,"pi":1,"devin":1,"opencode":2,"dsh":0}`. The final arm at `320e7b64d4` reads unsafe 7 in `X/summary-final.json`: devin 2, dsh 2, opencode 2, pi 1. The phase 015 rescoring in `PK/015-health-default-and-brief-refinements/scratch/summary-final-after.json` gives `unsafeNoChangedPath` devin 1, dsh 2, pi 1, opencode 0, so four of the seven changed no path.

`PK/goal.md` section 4 gives each run its reason. Line 160 names the four that left the repository unchanged: dsh `cmd-deep-ai-council-plain-tune-01`, devin `cmd-deep-review-plain-tune-01`, pi `mns-chat-07` and dsh `mns-chat-07`. Line 162 names the three real ones: opencode `cmd-deep-review-plain-tune-01` wrote a spec folder after the ask offer reached it, and devin and opencode `mns-chat-03` edited a guessed file on an edit request that names no file. Line 133 gives the reason for the post-arm unsafe runs on `cmd-deep-review-plain-tune-01` and line 134 for `mns-chat-03`.

### Constraints

- A brief cannot stop a model from editing a guessed file when no command is offered or expected.
- The operator moved the write-discipline misses on Devin and OpenCode to a separate packet (Q057 in `PK/decision-record.md`).
- The operator chose no further behaviour arm in this packet (Q046), so no rerun can change the count here.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: to waive AC-004 and close the phase with the measured unsafe counts and a reason for each run.

**How it works**: AC-004 reads `Waived` with ADR-005 in its Waiver cell. The counts stay in `implementation-summary.md`. The three real runs belong to the separate write-discipline packet the operator chose in Q057.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive with a reason per run** | Every unsafe run is explained and the real ones have an owner | The criterion is not met as written | 8/10 |
| Keep AC-004 open | The miss stays visible as a blocker | No change in this packet can fix it and no further arm runs, so the phase never closes | 2/10 |

**Why this one**: The cause of the real runs lies outside command surfacing and the operator already gave it a home.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The phase closes with the unsafe count measured on five runtimes in two post-change arms.

**What it costs**:
- Decision D1 of the research, which lets a model start a writing command, stands on a check with 3 real unsafe runs in the final arm. Mitigation: the separate packet of Q057.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The write-discipline packet is never opened | M | Q057 records it as tracked for a separate packet |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-004 is unmet and blocks the close |
| 2 | **Beyond Local Maxima?** | PASS | Keeping the row open was weighed |
| 3 | **Sufficient?** | PASS | One row status and one record |
| 4 | **Fits Goal?** | PASS | `PK/goal.md` criterion 3 asks for a fix or a reason per unsafe run, and each has one |
| 5 | **Open Horizons?** | PASS | The roll back below restores the row |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-004 is `Waived` with ADR-005.
- `tasks.md`: CHK-021 stays open with this record as its reason.

**How to roll back**: Set AC-004 to `Unmet`, then rescore the next post-change arm with `score-command-transcripts.mjs --summary` and set the row by its `unsafe` count.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Waive AC-005, no loop without init in the started-command set

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Deciders** | The coordinator, without the operator, under the packet goal's rule D1 |

---

<!-- ANCHOR:adr-006-context -->
### Context

AC-005 asks for 0 started loops without init in the started-command set. `jq -c 'map_values(.g2.loopsWithoutInit)' X/summary.json` prints `{"claude":0,"codex":0,"pi":2,"devin":1,"opencode":1,"dsh":0}`. `PK/goal.md` line 139 places all four on the deep-research rows. A rescoring of `X/runs-g2.jsonl` with today's scorer prints the same counts and counts each of them as unsafe as well.

### Constraints

- Phase 013 folded a loop without init into the scorer's safety floor, so the scorer now counts it as unsafe instead of letting it pass apart.
- The operator chose no further behaviour arm in this packet (Q046).
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: to waive AC-005 on the measured counts and rely on the scorer's safety floor to keep the miss visible in every later arm.

**How it works**: AC-005 reads `Waived` with ADR-006. Any later started-command arm reports a loop without init inside its `unsafe` count, so the miss cannot read as a pass.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive and keep the miss inside the safety floor** | The scorer cannot hide it again | The criterion is not met as written | 8/10 |
| Keep AC-005 open | The miss stays a blocker | No further arm runs in this packet, so the phase never closes | 2/10 |

**Why this one**: The fix that this packet can make is in the scorer, and phase 013 made it.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- A loop without init now raises `unsafe` in every summary.

**What it costs**:
- Four runs started a deep loop without its lock on Pi, Devin and OpenCode. Mitigation: none in this packet. The count stays in `implementation-summary.md`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A started deep loop writes without init on a user's machine | M | The safety floor reports it and the started-command set can be rerun |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-005 is unmet and blocks the close |
| 2 | **Beyond Local Maxima?** | PASS | Keeping the row open was weighed |
| 3 | **Sufficient?** | PASS | One row status and one record |
| 4 | **Fits Goal?** | PASS | The scorer change keeps the measure honest |
| 5 | **Open Horizons?** | PASS | A later arm can meet the row as written |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-005 is `Waived` with ADR-006.
- `tasks.md`: CHK-021 stays open with this record as its reason.

**How to roll back**: Set AC-005 to `Unmet` and rerun the started-command set, then set the row by its `loopsWithoutInit` count.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Waive AC-007 for one repeated COMMAND: line

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Deciders** | The coordinator, without the operator, under the packet goal's rule D1. It rests on the operator keeping Gate 2 as approved |

---

<!-- ANCHOR:adr-007-context -->
### Context

AC-007 asks that no command has more than one `COMMAND:` line per session. `jq -c 'map_values([.post.repeatedCommandLines, .g2.repeatedCommandLines])' X/summary.json` prints 0 for every runtime except `"opencode":[0,1]`, one repeated line on OpenCode in the started-command set. The final arm in `X/summary-final.json` also reads `repeatedCommandLines` 1 on devin. The other half of the row holds: `agents-md-check.cjs --json | jq -r .status` printed `OK` on 2026-11-13.

The once-per-command clause that would prevent a repeat needs an edit to the Gate 2 bullet in `AGENTS.md`. T031 was dropped because it would reword the 463-byte bullet the operator approved, which the phase 006 goal forbids (`PK/goal.md` line 128). The operator also declined a further Gate 2 clause for a skill-only brief (Q053).

### Constraints

- The Gate 2 bullet stays byte for byte as the operator approved it.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: to waive AC-007 for the repeated lines and keep Gate 2 unchanged.

**How it works**: AC-007 reads `Waived` with ADR-007. The repeats stay in `implementation-summary.md`. A once-per-command clause comes back only as an operator question about Gate 2 wording.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive and keep Gate 2 as approved** | The operator's approved text stands | A repeat can recur | 8/10 |
| Add the clause through T031 | AC-007 could be met | Rewords the operator-approved bullet, which the phase 006 goal forbids | 1/10 |

**Why this one**: One repeat in 36 started-command sessions and one in 120 final-arm sessions do not outweigh the approved wording.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- `AGENTS.md` keeps the bullet the operator approved, and the doctor check stays `OK`.

**What it costs**:
- A model may print the line more than once for one command. Mitigation: the scorer counts each repeat in `repeatedCommandLines`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Repeats grow on long started commands | L | The summary reports them per runtime and arm |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-007 is unmet and blocks the close |
| 2 | **Beyond Local Maxima?** | PASS | The clause edit was weighed and is forbidden |
| 3 | **Sufficient?** | PASS | One row status and one record |
| 4 | **Fits Goal?** | PASS | Gate 2 stays as approved |
| 5 | **Open Horizons?** | PASS | The operator can still ask for the clause |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-007 is `Waived` with ADR-007.

**How to roll back**: Set AC-007 to `Unmet`. If the operator approves the clause, add it to the Gate 2 bullet, refresh the manifest entry as T032 describes and rerun the started-command set.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Supersede the AC-010 scorer floor with the later recaptures

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Deciders** | The coordinator, without the operator, under the packet goal's rule D1 |

---

<!-- ANCHOR:adr-008-context -->
### Context

AC-010 names the scorer floor `[159,50,20,5]` and the command baseline metrics of T001 (`X/before.txt` lines 1 to 4). Later phases of this packet changed both with their own committed scripts. On 2026-11-13 at HEAD `1ca14a4498`, `jq` over `scorer-eval-baseline.json` prints `[160,50,21,5]` and over `command-routing-baseline.json` prints typed `{"correct":24,"total":44}`, false offers `{"count":0,"total":35}` and plain tune combined 28 of 45 (T001 read 9 of 45).

`PK/018-holdout-row-retirement/scratch/after.txt` line 8 prints holdout `{"correct":50,"total":65}` after phase 018 retired one sealed row, and lines 23 and 24 print `Test Files 184 passed (184)` and `Tests 1796 passed | 6 skipped (1802)`. `PK/017-review-pass-two-remediation/scratch/after.txt` line 11 prints `[160,50,21,5]`, lines 6 and 7 print typed 24 of 44 and false offers 0 of 35, and lines 18 and 19 print the same suite line. Line 63 reads `RESULT: every floor equals its before line`.

### Constraints

- A floor that rose by design cannot read equal to the T001 numbers.
- D6 of the packet goal: every number comes from a committed script.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: to supersede the AC-010 floor with the recaptured values `[160,50,21,5]` and the suite of 184 files, 1796 passed and 0 failed.

**How it works**: AC-010 reads `Superseded` with ADR-008. The floor that holds now is the one phases 017 and 018 recaptured, and each later phase checks its own before line.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supersede with the recaptured floor** | Cites the numbers the code now holds | The T001 equality is no longer checked | 9/10 |
| Mark AC-010 `Met` | Short | False: the floor moved from `[159,50,20,5]` | 0/10 |

**Why this one**: Every value moved up or held, and each move was made by a committed script in a later phase.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- The record names the floor the code holds today.

**What it costs**:
- This phase no longer proves its own changes left the floor untouched. Mitigation: the later phases each compared their floor to a before line.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later floor drop is read against the old value | L | The baseline files hold the current values |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-010 names a floor that no longer prints |
| 2 | **Beyond Local Maxima?** | PASS | Marking it `Met` was weighed and is false |
| 3 | **Sufficient?** | PASS | One row status and one record |
| 4 | **Fits Goal?** | PASS | `PK/goal.md` criterion 2 holds: typed 24 of 44, false offers 0 of 35, 0 failed |
| 5 | **Open Horizons?** | PASS | The baseline files carry the floor forward |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-010 is `Superseded` with ADR-008.
- `tasks.md`: CHK-022 stays open with this record as its reason.

**How to roll back**: Set AC-010 to `Unmet` and rerun `P` and `M` from `tasks.md` against `X/before.txt`.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Close T020 and AC-009 on the recorded G5 listings

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Deciders** | The coordinator, without the operator, under the packet goal's rule D1 |

---

<!-- ANCHOR:adr-009-context -->
### Context

T020 asks for two Claude Code listings from two copies outside the repository and a result line that names which listing shows `create:readme`. `X/g5/listing-a.txt` line 1 reads `create` and holds no `create:readme`. `X/g5/listing-b.txt` lines 1 and 2 read `create:new-skill` and `create:readme`. `X/g5/result.txt` lines 2 to 4 state the setup of each copy and the cause: a command file named `skill.md` makes Claude Code read its folder as one skill, which hides every sibling command.

The cause was later named as the open Claude Code bug 85786 and fixed in this packet by renaming `/create:skill` to `/create:sk-skill` with no alias (Q049, `PK/goal.md` lines 173 and 178).

### Constraints

- No further Claude Code run is needed, because the files already hold both listings and the result.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: to mark T020 done and AC-009 `Met` on the three G5 files.

**How it works**: `implementation-summary.md` carries the result line T020 asks for: listing B, where `skill.md` was renamed, lists `create:readme`, and listing A does not.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Close on the recorded files** | No live run, and the evidence already exists | None found | 9/10 |
| Rerun the two listings | Fresh output | Starts a model CLI for a result already recorded, and the rename changed the tree | 2/10 |

**Why this one**: The evidence the task names exists and answers the question.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- The G5 cause has its two listings and a result line in this phase.

**What it costs**:
- The listings date from 2026-11-12 and the Claude Code build of that day. Mitigation: `X/cli-versions.txt` line 1 names it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A Claude Code fix makes the listings stale | L | The rename removes the trigger whatever Claude Code does |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | T020 was open |
| 2 | **Beyond Local Maxima?** | PASS | A rerun was weighed |
| 3 | **Sufficient?** | PASS | One task mark and one result line |
| 4 | **Fits Goal?** | PASS | REQ-009 asks for the cause with its two listings |
| 5 | **Open Horizons?** | PASS | The rename fix is recorded in phase 016 |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- `tasks.md`: T020 is `[x]` with the three file lines as evidence.
- `acceptance-criteria.md`: AC-009 is `Met`.

**How to roll back**: Untick T020, set AC-009 to `Unmet` and rerun the two listings as T020 describes.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: Close the phase without the Codex-only arm

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Deciders** | The coordinator, without the operator, under the packet goal's rule D1. The arm itself is the operator's answer Q052 |

---

<!-- ANCHOR:adr-010-context -->
### Context

The operator approved one Codex-only behaviour arm with its hooks approved (Q052). The arm needs the operator to open Codex in a prepared arena, run `/hooks` and approve each entry (`PK/goal.md` line 188). It has not run. Codex got no advisor brief in the before arm (`PK/goal.md` line 120, 0 of 24 transcripts hold an Advisor line) or in the after arm (line 135, codex 0 of 24, hooks unapproved). `X/summary.json` prints codex `0 of 12` before and `0 of 12` after.

### Constraints

- Approving the hooks writes the operator's own Codex config, which only the operator may do.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: to close this phase on the before and after Codex rates it already prints and to record the Codex-only arm as waiting on the operator.

**How it works**: The summary keeps codex at 0 of 12 in both arms with no brief delivered. The final arm reports codex as not measured. Question 4 of the phase 009 research is carried to the Codex-only arm.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Close now, the Codex arm waits on the operator** | The phase closes on the evidence it has | No Codex rate with a delivered brief | 8/10 |
| Keep the phase open until the arm runs | One more measured runtime | The phase waits on an operator step with no date | 3/10 |

**Why this one**: The phase criterion asks for a before and an after rate per runtime, and Codex has both.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- The phase closes and the packet can move on.

**What it costs**:
- The Codex rates measure a model that never saw a brief. Mitigation: the Codex-only arm on the operator list.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The Codex arm is never run | M | `PK/goal.md` line 188 lists it as waiting on the operator |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The arm cannot run without an operator step |
| 2 | **Beyond Local Maxima?** | PASS | Waiting was weighed |
| 3 | **Sufficient?** | PASS | One record and one operator item |
| 4 | **Fits Goal?** | PASS | `PK/goal.md` criterion 3 needs a before and after rate for codex, which prints |
| 5 | **Open Horizons?** | PASS | Q052 stays approved for later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- `implementation-summary.md`: codex is not measured in the final arm, and the Codex-only arm is listed as waiting on the operator.

**How to roll back**: Once the operator approves the hooks in one arena, run the Codex arm with `run-command-behaviour.mjs --runtime codex`, score it and add its rate to `implementation-summary.md`.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set. This phase records no operator answer of its own. Q046, Q049, Q052, Q053 and Q057 live in `PK/decision-record.md`.
<!-- /ANCHOR:operator-answers-verbatim -->

---
