---
title: "Decision Record: Completed-Run Extension (--extend=N)"
description: "Operator decisions for this packet: the generation-1 orchestrator choice and the four accepted open-question defaults (ADR-001 to ADR-004)."
trigger_phrases:
  - "001-completed-run-extension operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension"
    last_updated_at: "2026-11-17T20:00:00Z"
    last_updated_by: "operator-decision"
    recent_action: "Recorded ADR-001 to ADR-004: the four open-question defaults, accepted"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Completed-Run Extension (--extend=N)

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Convergence window on an extension: document it and warn, no forced coupling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Recommended default for open question 1: document the window and warn when nothing is queued. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Under `stopPolicy: convergence`, an extension with no new questions re-stops on `all_questions_answered` (research) or `all_dimensions_clean` (review) before it adds useful work. Parent `research.md` §12 item 5 asks whether `--extend` should require inbox question injection or candidate admission, or only document the window.

### Constraints

- REQ-013 already requires the docs to name the window and the consecutive-failure re-stop.
- Automatic question injection is out of scope for this phase (`spec.md` §3).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Document the `--convergence-mode=off` or `max-iterations` window and inbox injection as the ways to keep an extension running, and print a warning when `--extend` runs under `stopPolicy: convergence` with no pending inbox rows. Coupling stays optional.

**How it works**: The pre-classify step reads the inbox once. When the stop policy is `convergence` and no inbox row is pending, it prints a warning that names the window and continues; it does not refuse the extension.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Document the window and warn when nothing is queued** | No new required input; the operator sees the likely re-stop before any dispatch | An extension can still re-stop at once if the warning is ignored | 8/10 |
| Require inbox injection or candidate admission | An extension always has new work | Blocks legitimate extensions under `off` or `max-iterations`; adds a new required input | 5/10 |

**Why this one**: The operator accepted the recommended default. It keeps the flag simple and makes the coupling visible without forcing it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The operator learns before dispatch that an unchanged question set will re-stop.

**What it costs**:
- One inbox read and one warning line in the pre-classify step.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An operator ignores the warning and the extension re-stops at once | L | The docs required by REQ-013 name the window; the ledger still records one `run_extended` event |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Parent §12 item 5 left the coupling open |
| 2 | **Beyond Local Maxima?** | PASS | Required coupling was weighed and rejected |
| 3 | **Sufficient?** | PASS | REQ-013 plus the warning covers the re-stop case |
| 4 | **Fits Goal?** | PASS | Keeps `--extend` a plain flag (REQ-001) |
| 5 | **Open Horizons?** | PASS | Coupling can be added later without a ledger change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Both `loop-protocol.md` files and the command docs state the window (T019).
- The pre-classify step prints the warning under `convergence` with no pending inbox rows.

**How to roll back**: Remove the warning line; the documented window stays correct on its own.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Snapshot name keyed by generation and continuedFromRun

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Recommended default for open question 2. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

An extension keeps the generation, so a snapshot named by generation alone collides on a second extension of the same generation. Parent `research.md` §12 item 8 asks what the pre-extension synthesis snapshot is called. REQ-007 requires a name that does not collide.

### Constraints

- `continuedFromRun` grows on every extension (`spec.md` edge cases), so it is unique within a generation.
- The research `loop-protocol.md:562` line names the snapshot and must match.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Key the snapshot by `continuedFromRun` in both loops: `research/synthesis-v{generation}-r{continuedFromRun}.md` and `review/review-report-v{generation}-r{continuedFromRun}.md`.

**How it works**: Before the extension's first dispatch, the snapshot step copies `research/research.md` or `review/review-report.md` to that name. The research `loop-protocol.md:562` line and the review loop protocol are amended to the same names.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`-v{generation}-r{continuedFromRun}`** | Unique per extension; readable; ties the snapshot to the run count it froze | Longer name | 8/10 |
| Timestamp suffix | Always unique | Not tied to the run count; harder to match to a ledger event | 6/10 |

**Why this one**: The operator accepted the recommended default. The run count is already in the `run_extended` payload, so the snapshot and its event share a key.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Two extensions of one generation keep two snapshots, which AC-007 checks.

**What it costs**:
- Two doc lines and the YAML snapshot step carry the pattern.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The YAML step and `loop-protocol.md` drift apart | L | CHK-041 checks the snapshot line and the YAML step use the same name |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | REQ-007 needs a collision-free name |
| 2 | **Beyond Local Maxima?** | PASS | Timestamp naming weighed |
| 3 | **Sufficient?** | PASS | `continuedFromRun` is unique per extension |
| 4 | **Fits Goal?** | PASS | Same key as the `run_extended` payload |
| 5 | **Open Horizons?** | PASS | A later fork mode can add its own suffix |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Snapshot step in both YAMLs (T016).
- Research `loop-protocol.md:562` and the review loop protocol.

**How to roll back**: Revert the step and the two doc lines; existing snapshot files stay readable.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Extended config status is initialized, with every :confirm branch traced

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Recommended default for open question 3. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-003-context -->
### Context

The pre-classify step must leave the config in a status that `step_classify_session` lands on `resume`. Parent `research.md` §12 item 9 asks whether `initialized` is right and whether it classifies as `resume` in every `:confirm` branch.

### Constraints

- `initialized` is the only other status value the workflow writes today.
- A new status value would touch every reader of the config status.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Use status `initialized` for an extended config, and trace every `:confirm` branch from `step_classify_session` onward before the YAML edit (T004). No new `active` value is introduced.

**How it works**: The pre-classify step sets status from `complete` to `initialized`. T004 writes `scratch/confirm-branch-trace.md` with each branch, its file:line and its classification, and every branch must land on `resume` before the YAML edit.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`initialized` plus a traced :confirm path** | No new status value; uses what the workflow already writes | Correctness rests on the trace being complete | 8/10 |
| New `active` status | Distinguishes an extension in the config | Every config reader changes; larger blast radius | 4/10 |

**Why this one**: The operator accepted the recommended default. The trace makes the reuse safe without a new status value.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- No new status vocabulary; existing readers keep working.

**What it costs**:
- T004 is a required trace before the YAML edit, and it is still open.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An untraced `:confirm` branch classifies `initialized` differently | M | T004 traces every branch; CHK-004 stays open until the trace exists |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Classification must land on `resume` (REQ-003) |
| 2 | **Beyond Local Maxima?** | PASS | A new status value weighed |
| 3 | **Sufficient?** | PASS | Together with the T004 trace |
| 4 | **Fits Goal?** | PASS | Keeps the change inside the lineage path |
| 5 | **Open Horizons?** | PASS | A new value can still be added if the trace finds a gap |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- The pre-classify step in both YAMLs writes `initialized`.
- T004 trace in `scratch/confirm-branch-trace.md`.

**How to roll back**: Revert the pre-classify step; the config status vocabulary is unchanged.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Write run_extended only and suppress resumed on an extension

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Recommended default for open question 4. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-004-context -->
### Context

An extension lands on `resume`, where `on_resume` writes a `resumed` row today. Parent `research.md` §19 item 6 asks whether an extension writes both `resumed` and `run_extended`, or suppresses `resumed`.

### Constraints

- REQ-015 requires the five lifecycle sites to match the projected `extended` row, or the run reads as terminal until its first new iteration.
- REQ-008 requires one landing mechanism per loop, pinned by a test.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Write `run_extended` only and suppress the `resumed` row for an extension, so the ledger carries one event per lifecycle action.

**How it works**: The `on_resume` event choice checks whether the session is an extension. For an extension it appends `run_extended` and skips `resumed`. The legacy projections write `event: 'extended'`, which the five lifecycle sites match (REQ-015).
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`run_extended` only, `resumed` suppressed** | One event per lifecycle action; clean replay | Depends on REQ-015 landing with it | 8/10 |
| Both `resumed` and `run_extended` | No change to `on_resume` | Two events for one action; reducers must de-duplicate | 5/10 |

**Why this one**: The operator accepted the recommended default. It works only together with REQ-015, which this phase already requires.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The ledger reads one action as one event.

**What it costs**:
- `on_resume` gains an extension branch, and the five lifecycle sites must match `extended`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The lifecycle sites miss the `extended` row and the run reads as terminal | H | REQ-015 cases in both reducer suites |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Parent §19 item 6 left the event choice open |
| 2 | **Beyond Local Maxima?** | PASS | Writing both events weighed |
| 3 | **Sufficient?** | PASS | Paired with REQ-015 |
| 4 | **Fits Goal?** | PASS | REQ-008 asks for one landing mechanism |
| 5 | **Open Horizons?** | PASS | `run_extended` serves as the dashboard boundary (§19 item 7) |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `on_resume` event choice in both YAMLs.
- The five lifecycle sites in the two `reduce-state.cjs` files (REQ-006, REQ-015).

**How to roll back**: Revert the `on_resume` branch so `resumed` is written again; `run_extended` rows already in a ledger still project.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| OD-001 | 2026-11-17: open question 1, document the convergence window and warn when nothing is queued | Operator accepted the recommended default | Open question 1 | ADR-001, `spec.md` §10, T019 |
| OD-002 | 2026-11-17: open question 2, snapshot `synthesis-v{generation}-r{continuedFromRun}.md` and `review-report-v{generation}-r{continuedFromRun}.md` | Operator accepted the recommended default | Open question 2 | ADR-002, `spec.md` §10, T016 |
| OD-003 | 2026-11-17: open question 3, status `initialized` with every `:confirm` branch traced | Operator accepted the recommended default | Open question 3 | ADR-003, `spec.md` §10, T004 |
| OD-004 | 2026-11-17: open question 4, write `run_extended` only and suppress `resumed` | Operator accepted the recommended default | Open question 4 | ADR-004, `spec.md` §10, REQ-015 |
| OD-005 | 2026-11-17: amend REQ-010 to drop `.vibe/agents` from its grep and prove those mirrors by `sync-agents-vibe.cjs --check` | The Vibe generator writes each agent body as one TOML line, so the grep matched unrelated words such as "deferred tangents" on the same line as `completed-continue`; rewording unrelated agent prose would not hold | REQ-010 grep scope | `spec.md` REQ-010, AC-010 |
| Q001 | Run the 10-iteration generation-1 research as a headless account-2 Claude orchestrator with the native executor, because the deep-loop recursion guard blocks cli-claude-code from inside a Claude Code session. | Not stated. | None | research_archive/20261117T103614Z/, research.md §3 |
| Q002 | Accept all four recommended defaults for the extension open questions. | Not stated. | None | 001 decision-record.md ADR-001..004, spec.md §10 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

**OD-001 to OD-004** (2026-11-17, decider operator)

- Asked: the four open questions in `spec.md` §10, each offered with a recommended default.
- Operator answer, as relayed in the 2026-11-17 decision brief: accept all four recommended defaults (convergence window documented with a warn when nothing is queued; snapshot `synthesis-v{gen}-r{continuedFromRun}.md` and `review-report-v{gen}-r{run}.md`; status initialized with every `:confirm` branch traced; write only `run_extended` and suppress `resumed`).
- Recorded as: ADR-001 to ADR-004, each Accepted. The review snapshot's `r{run}` is recorded as `r{continuedFromRun}`, the key the accepted default names for both loops.

### Q001
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01J7frF71FbLf9JMFTmZki3F:0 -->

Question:
```text
You asked for cli-claude-code via claude2, but I can't run it from here. The deep-loop recursion guard blocks a cli-claude-code dispatch from inside a Claude Code session: CLAUDE_CODE_SESSION_ID is set and `claude` is in the process ancestry. That guard is deliberate and I won't bypass it. Separately, the research dispatcher ignores --config-dir; only review honors it. I'll log that bug as a finding. How should the 10 Opus 5.5 iterations run?
```

Options:
```text
A) claude2 headless orchestrator (Recommended)
B) Native in this session
C) Wait / I'll run it myself
```

Answer:
```text
A) claude2 headless orchestrator (Recommended)
```

### Q002
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01GXZervRj4ta5M1vXJ4deg8:1 -->

Question:
```text
Phase 001 (--extend) has four open questions. Accept all four recommended defaults? (1) Under convergence stop: document the --convergence-mode=off / max-iterations window and warn when nothing new is queued, rather than requiring new questions. (2) Snapshot named synthesis-v{gen}-r{continuedFromRun}.md (and review-report-v{gen}-r{run}.md). (3) The extended config gets status initialized, and every :confirm branch is traced to confirm it lands on resume. (4) Write only run_extended and suppress the resumed row.
```

Options:
```text
Accept all four (Recommended)
Require new questions
```

Answer:
```text
Accept all four (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
