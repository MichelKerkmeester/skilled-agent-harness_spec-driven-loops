---
title: "Decision Record: Phase 6: live-conversation-test"
description: "Why the clean-repository check runs against a mirror root and why the Claude nudge is read from the subject transcript instead of the pane."
trigger_phrases:
  - "live conversation test decision record"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test"
    last_updated_at: "2026-11-02T12:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded why AC-003 and AC-009 were superseded"
    next_safe_action: "Run the remaining runtimes against the mirror root"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-006-live-conversation-test"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 6: live-conversation-test

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Check the clean repository against a mirror root

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-02 |
| **Deciders** | The orchestrating session, on two failed runs. The operator set the run order in the parent decision record, Q012. |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-003 compares a content hash of the real queue folder before and after each run. The 065 runner takes the same hash over `specs/` and `.skilled/skills/.state/decision-capture/`, and fails the run as `REPO_CHANGED` on any difference.

Other sessions write to that folder whenever their own operator answers a question. Two sibling runs on 2026-11-02 passed every check and still failed `REPO_CHANGED`. In both, the only changed file belonged to session `fe0c9990`: its own Claude hook queued a release question at 11:26:28, inside the run window 11:21:41 to 11:27:33, and its Stop hook rewrote its nudge file between 11:28:18 and 11:34:16. The subject wrote nothing to the real repository in either run.

So the check as written fails whenever the operator works in another session, which says nothing about the subject.

### Constraints

- D4 stays whole: no test writes to this repository's packets or its decision-capture state.
- The runner belongs to the 065 packet and is not edited here.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: run the 065 runner with its own `--repo-root` option pointed at a mirror root, and guard the real repository separately.

**How it works**: the mirror holds a real, empty `specs/` and a real, empty `.skilled/skills/.state/decision-capture/`, which are the two trees the runner hashes. Everything the scenario setup copies or links (`.claude`, `.opencode`, `.codex`, `.pi`, `.devin`, `AGENTS.md`, `opencode.json`, `.skilled/hooks`, `.skilled/bin`, `.skilled/commands`, `.skilled/repo-rules`, `.skilled/skills/system-spec-kit`) is a symlink to the real repository, so the subject runs the current code. Around each run the wrapper also records the real repository's `git status --short --untracked-files=all specs` and the file names in its real decision-capture folder, and diffs them. AC-016 replaces AC-003.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mirror root plus a real-repository guard** | The runner's strict check measures only the subject, and the real repository is still checked | Content edits to an existing ignored file in the real state folder are not hashed | 8/10 |
| Keep the real root and attribute each change by session id | No setup change | The runner verdict stays FAIL, so no row could read pass | 3/10 |
| Ask the operator to stop all other sessions during every run | Strict check on the real root | Blocks the operator for hours | 2/10 |

**Why this one**: it keeps the runner's verdict meaningful and loses only a case the subject cannot reach. A subject queues under its own new session id, so a write to the real state folder appears as a new file name.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A `REPO_CHANGED` verdict now means the subject wrote outside its scratch project.

**What it costs**:
- Two guards to read per run instead of one. Mitigation: the wrapper prints both diffs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A subject edits an existing ignored file in the real state folder | L | Capture writes only its own session's files, which are new names |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two passing runs failed on another session's writes |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | The runner's own option, plus one wrapper |
| 4 | **Fits Goal?** | PASS | D3 and D4 both hold |
| 5 | **Open Horizons?** | PASS | Works for every runtime the scenario lists |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-003 reads `Superseded` against ADR-001, and AC-016 is added.

**How to roll back**: set AC-003 back to `Unmet`, delete AC-016, and run without `--repo-root`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Read the Claude nudge from the subject transcript

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-02 |
| **Deciders** | The orchestrating session, on the Claude run's transcript. |

---

<!-- ANCHOR:adr-002-context -->
### Context

AC-009 counts nudge lines in the pane captures. The Claude Stop hook is registered async, so Claude Code does not draw its `systemMessage`. It stores it as an `async_hook_response` attachment and hands it to the model with the next prompt. Every pane in the Claude run counted 0, while the transcript holds five nudges: 1, 2 and 3 after S2, S3 and S4, 1 after S7 and 3 after S9.

The nudge written after S8 never arrived. The hook wrote the value 2 to the nudge file, and S9 restarted the session before the next prompt, so the pending message was dropped. The answer itself was not lost: it stayed queued, and the S9 nudge counted it.

### Constraints

- The nudge text and the hook registration are not changed here.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: supersede AC-009 with AC-017, which reads the nudges from the subject transcript and records the restart loss as observed behavior.

**How it works**: `nudge-sequence.txt` lists each prompt and each Stop response in time order, taken from the subject's own transcript in the scratch project's Claude project folder.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read the transcript, record the restart loss** | Measures what the model receives | The evidence is a derived list, not a pane | 8/10 |
| Make the Stop hook synchronous | The pane would show it | Every turn waits on the hook, and it changes a shared registration outside this child | 3/10 |
| Mark AC-009 Met | No new row | The pane counts it names are all 0 | 1/10 |

**Why this one**: the nudge exists to reach the model, and the transcript is where it does.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The nudge evidence matches how Claude Code delivers async hook output.

**What it costs**:
- A nudge emitted just before a session exits is never shown. Mitigation: the next Stop after a restart counts every pending answer again.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A session ends for good right after an answer | L | The answer stays queued, and the next save's sweep reports it as pending |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-009's evidence source cannot show an async message |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | One derived file per Claude run |
| 4 | **Fits Goal?** | PASS | The nudge exists to make the save happen |
| 5 | **Open Horizons?** | PASS | The loss at restart is written down for a later hook change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-009 reads `Superseded` against ADR-002, and AC-017 is added.

**How to roll back**: set AC-009 back to `Unmet` and delete AC-017.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Codex decision-capture runs start with the project hooks untrusted, because trusting them would also trust the operator's own global hooks. | Codex captures only at save time, so no capture path depends on a hook. | Parent Q008 (trust Codex hooks in the 006 runs), for these runs | implementation-summary.md Known Limitations, scratch/live-runs/codex-run1/attempts/README.md |
| Q002 | Every save turn in the live scenario sends a plain request naming save.md instead of the /speckit:save slash command. | Codex has no /speckit:save command, and a scenario sends one text to every runtime. | None | decision-capture-live-conversation.md S6, S10, S11 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:2cdc1c20-d541-4a71-ba53-999a34105259:toolu_01RufF4Uz4JkxQxTsAB6KDbi:0 -->

Question:
```text
The Codex decision-capture run stopped at launch, before any turn, with HOOK_TRUST_OUTSIDE_PROJECT. Codex's start screen said '23 hooks are new or changed'. The scratch project has only 14, so 9 come from your own ~/.codex/hooks.json (Orca, Nodeterm and GitKraken entries you haven't trusted yet). The runner won't 'Trust all' when that would also trust your global hooks, and your Codex config is unchanged (hook-trust.json: ok, nothing added). Codex captures answers only at save time through the rollout sweep, so the project hooks don't affect what this run proves. How should I run it?
```

Options:
```text
Run with hooks untrusted (Recommended)
I'll trust my global hooks first
```

Answer:
```text
Run with hooks untrusted (Recommended)
```

### Q002
<!-- source: claude:2cdc1c20-d541-4a71-ba53-999a34105259:toolu_01GVvgwxL2WDFqr7BU77Mp6k:0 -->

Question:
```text
The Codex decision-capture run reached the save at S6 and stopped: Codex answered "Unrecognized command '/speckit:save'". Codex reads custom prompts only from ~/.codex/prompts, and that folder holds speckit-complete, -implement, -plan and -resume from July 14, but no speckit-save. So a Codex user can't start the save by slash command today. The scenario's save turns send the same text to every runtime, and the four passing runs (Claude, OpenCode, Pi, Devin) used '/speckit:save …'. How should the Codex save be reached?
```

Options:
```text
Plain save request, all runtimes (Recommended)
Install speckit-save globally
Ask 065 for per-runtime sends
```

Answer:
```text
Plain save request, all runtimes (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
