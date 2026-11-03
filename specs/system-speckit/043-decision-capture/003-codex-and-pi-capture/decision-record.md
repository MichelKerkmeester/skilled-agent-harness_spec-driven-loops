---
title: "Decision Record: Phase 3: codex-and-pi-capture"
description: "Why two acceptance criteria written before the live probes were superseded by criteria that match what the probes observed in Codex and Pi."
trigger_phrases:
  - "codex and pi capture decision record"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/003-codex-and-pi-capture"
    last_updated_at: "2026-11-02T10:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded why AC-001 and AC-003 were superseded"
    next_safe_action: "Run the 006 live re-proof for Codex and Pi"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-003-codex-and-pi-capture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 3: codex-and-pi-capture

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Close the probe criteria on what the live probes observed

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-02 |
| **Deciders** | The orchestrating session, on the live probe evidence. The operator approved both probes (parent decision record Q007) and the Codex flag (parent Q006). |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-001 and AC-003 were written before either runtime had been probed live, and each predicted a result the probe then contradicted.

AC-001 expected the Pi probe to stay offline, so its status would read `transcript-observed, hook UNKNOWN`. With the operator's consent, a live probe in a scratch project logged the `tool_result` event, and it carries `details.answers`. The status is now `observed: hook and transcript both carry the answer`, so the string AC-001 names can no longer appear.

AC-003 expected a Plan-mode Codex session to call `request_user_input_async`. That tool returns only `{"accepted":true}`, and its answer arrives later as an ordinary user message with nothing tying it to the call. With `default_mode_request_user_input` on, which the operator approved, Codex 0.164 calls the synchronous `request_user_input` instead. Its PostToolUse `tool_response` and its rollout `function_call_output` both hold the answers JSON, keyed by the call id.

### Constraints

- A criterion is never renumbered or edited into a different claim. It is superseded, and a new row takes the next free id.
- The replacement must be checkable against the probe files, the same way the originals were.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: supersede AC-001 with AC-010 and AC-003 with AC-011, each stating the result the live probe observed.

**How it works**: AC-010 requires `probe/pi.json` to show the hook and the session file both carrying `details.answers`. AC-011 requires `probe/codex.json` to show the synchronous `request_user_input` call tied to its answer in both the hook payload and the rollout. Codex takes branch (a): `sweep-codex.mjs` reads the rollout at save time.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supersede with criteria that match the observation** | The record says what is true and keeps the original claim visible | Two more rows | 9/10 |
| Mark AC-001 and AC-003 Met | No new rows | Each row's Then clause names a result that did not happen | 1/10 |
| Waive them | Short | A waiver drops the requirement, but the requirement was met in a stronger form | 4/10 |

**Why this one**: the requirements behind both rows were met, by a better path than the rows predicted. Superseding records that without claiming the old wording held.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Codex answers land with their call ids, so the save-time reader and any later hook produce one key per answer.
- Pi capture runs live through the extension, with the session reader as a backstop under the same key.

**What it costs**:
- The Codex path depends on `default_mode_request_user_input` being on. Mitigation: the repo's `.codex/config.toml` sets it, and the README coverage row names the rollout reader.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later Codex release changes the answers JSON | M | `sweep-codex.test.mjs` runs on a redacted live sample, so a shape change fails it |
| A Codex session runs with the flag off and calls the async tool | L | Nothing is queued for that call. The 006 re-proof checks the flagged path |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The packet cannot close with two rows whose wording is false |
| 2 | **Beyond Local Maxima?** | PASS | Met, Waived and Superseded were compared above |
| 3 | **Sufficient?** | PASS | Two rows, each checked by one `jq` command |
| 4 | **Fits Goal?** | PASS | The parent goal needs every runtime with an answer surface to capture |
| 5 | **Open Horizons?** | PASS | The new rows describe the shapes the readers depend on |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-001 and AC-003 read `Superseded` against ADR-001; AC-010 and AC-011 are added.
- `spec.md` and `plan.md`: one line each names Codex branch (a).

**How to roll back**: set AC-001 and AC-003 back to `Unmet`, delete AC-010 and AC-011, and delete this record.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.
<!-- /ANCHOR:operator-answers-verbatim -->

---
