---
title: "Decision Record: Phase 2: review-mode-research"
description: "Two operator rulings of 2026-10-25: narrow the sibling-path check to the research content, and add a five-iteration second-model pass on DeepSeek through cli-devin."
trigger_phrases:
  - "review mode research decision record"
  - "ac-011 sibling path narrowing"
  - "second-model pass deepseek devin"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research/002-review-mode-research"
    last_updated_at: "2026-10-25T13:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Amended AC-011 per the operator and closed the phase"
    next_safe_action: "None. The phase is closed"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 2: review-mode-research

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Narrow the AC-011 sibling-path check to the research content

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | The operator, by question prompt, recorded by the orchestrating session |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-011 greps every file under `research/` for the sibling phase's research path and wants 0 everywhere. The first run printed 47 non-zero files, all quarantine copies the runtime's write-containment guard made while the sibling run wrote in the same worktree. The prompts for the second-model pass carry the instruction not to read the sibling's folder, so they name its path as well. None of these is research content, and after the first run the synthesis, the iteration files, the deltas and the state log printed 0.

### Constraints

- A run's own prompt has to name the sibling path to forbid reading it, so a whole-folder grep can never print 0 for the prompts.
- The quarantine copies were deleted with the operator's approval before this record was written.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to run AC-011's grep over the research content proper only, which is `research/research.md`, `research/iterations/`, `research/deep-research-state.jsonl` and `research/deltas/`.

**How it works**: the check becomes `grep -rc "001-quality-mode-research/research" research/research.md research/iterations research/deep-research-state.jsonl research/deltas`, run from this phase folder, with every count required to be 0. Prompts and dispatch receipts are out of scope, because they carry the prompt that holds the do-not-read rule.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Narrow the grep to the research content** | Tests what the criterion is for, no sibling content in the findings | Needs a record of why prompts are out of scope | 8/10 |
| Reword the prompt instruction so it names no path | The original grep could pass | A rule that names no path cannot forbid one, and the copies would still have needed removal | 4/10 |
| Waive AC-011 | Closes at once | Drops the only check that the two runs stayed apart | 2/10 |

**Why this one**: it keeps the check on the files that carry findings, which is where a sibling read would show.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- AC-011 tests the findings rather than the run's own instructions.

**What it costs**:
- A sibling path inside a prompt or receipt is no longer counted. Mitigation: those files hold the dispatched prompt, which is reviewed when it is rendered.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An executor echoes the do-not-read rule into an iteration file | M | Observed in the second-model pass. See Implementation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The original grep could not pass for prompts that must name the path |
| 2 | **Beyond Local Maxima?** | PASS | Rewording and waiving were weighed above |
| 3 | **Sufficient?** | PASS | One command over four paths |
| 4 | **Fits Goal?** | PASS | REQ-006 asks for no read of the sibling folder |
| 5 | **Open Horizons?** | PASS | The same scope works for any later iteration |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- AC-011's verification cell names the narrowed command and its observed output.

**Observed result, 2026-10-25, after iteration 15**: the narrowed grep printed 0 for `research/research.md`, the state log, every delta file and 13 of the 15 iteration files. It printed 1 each for `research/iterations/iteration-013.md`, line 17, and `research/iterations/iteration-014.md`, line 20. Both lines say that nothing under the sibling's `research/` folder was read. The second-model executor wrote them to attest that it obeyed the do-not-read rule. It is the same rule the prompts carry, not sibling content. Devin's own session records for the second-model iterations show no read, grep or glob call whose arguments name the sibling folder. One repo-wide search in iteration 12 listed sibling file names in its output, and no call opened any of them.

**Amendment, operator ruling of 2026-10-25**: the narrowed check may skip a line that only states the sibling folder was not read. The check becomes `grep -rn "001-quality-mode-research/research" research/research.md research/iterations research/deep-research-state.jsonl research/deltas | grep -vE '(was not read|Nothing under .* was read)'`, run from this phase folder, and it passes when it prints nothing. The lines it skips are `iteration-013.md and iteration-014.md` attestations, not sibling content. Re-run after the amendment: it printed nothing.

**How to roll back**: restore the original whole-folder grep in AC-011's verification cell.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Add a five-iteration second-model pass on DeepSeek through cli-devin

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | The operator, by question prompt, recorded by the orchestrating session |

---

<!-- ANCHOR:adr-002-context -->
### Context

The plan put the even iterations on DeepSeek V4.1 Flash 1017 through cli-pi. Pi was refused three times with HTTP 402 daily pacing, so all ten iterations ran on Luna, and every judgment in the synthesis was one model family's reading. The operator ruled to run five more iterations on DeepSeek flash through cli-devin, aimed at the INFERRED findings and the top recommendations, and then to refresh the synthesis so each recommendation states the second model's verdict.

### Constraints

- The run had completed, and the workflow halts on a completed session. Its `completed-continue` branch is deferred and not wired, and its rules forbid changing the config after initialization.
- The operator asked to continue the same lineage and state log, not to restart it.
- The two children must not run at the same time, because the write-containment guard copies a concurrent sibling's writes into quarantine.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: to reopen the completed lineage in place and raise `maxIterations` from 10 to 15, then run iterations 11 to 15 through the workflow's own `if_cli_devin` dispatch branch with `deepseek-v4-1-flash-max`.

**How it works**: the first synthesis was snapshotted as `research/synthesis-v1.md`, as the loop protocol asks before a completed packet is reopened. The config's `status` went from `complete` back to `initialized` and `maxIterations` to 15, which lets session classification take the `resume` branch. A `resumed` event went through the append gateway with `continuedFromRun` 10 and the session id and generation unchanged. Each iteration then ran the workflow's own steps, and synthesis set `status` back to `complete`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reopen in place and raise maxIterations** | Same lineage, same state log, iterations numbered 11 to 15 | Edits a config the workflow marks immutable | 7/10 |
| Restart the lineage | A live branch of the workflow | Moves the first ten iterations to an archive and numbers the new ones from 1, against the operator's ruling | 3/10 |
| A fresh packet for the second pass | No config edit | Splits one question across two packets | 2/10 |

**Why this one**: it is the only route that keeps the lineage and the state log the operator asked to continue, and the edit touches two fields the operator named.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Every ranked recommendation now carries a second model's verdict, in section 6a of `research/research.md`.

**What it costs**:
- The config was edited after initialization. Mitigation: only `status` and `maxIterations` changed, and this record names both.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A second-model claim is wrong | M | The orchestrator opened the lines behind each refuted or new claim before it entered the synthesis |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The synthesis said every judgment was one model family's reading |
| 2 | **Beyond Local Maxima?** | PASS | Restart and a fresh packet were weighed above |
| 3 | **Sufficient?** | PASS | Five iterations covered all 12 ranked rows |
| 4 | **Fits Goal?** | PASS | The operator ruled for it |
| 5 | **Open Horizons?** | PASS | The workflow's `completed-continue` branch, once wired, would replace the config edit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Executor: cli-devin, `--model deepseek-v4-1-flash-max`, which Devin resolves to `deepseek-v4-1-flash-1017-max`, DeepSeek V4.1 Flash Max. Devin has no effort flag, so the `max` tier is the model id's suffix. The dispatch branch passes `--permission-mode dangerous` and `--respect-workspace-trust false`.
- All five iterations verified on the first dispatch. Iteration 12 left a temporary event file, `research/.tmp-iter-012-event.json`, which is kept for the operator to decide on.
- `research/research.md` gained sections 6a and 6b, and its executor table, open questions and convergence report were refreshed.

**How to roll back**: restore `research/synthesis-v1.md` as `research/research.md`, set `maxIterations` back to 10 and remove iterations 11 to 15, their deltas, prompts and receipts.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
