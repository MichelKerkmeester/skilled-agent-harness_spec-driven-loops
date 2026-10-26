---
title: "Decision Record: Phase 1: quality-mode-research"
description: "Three operator rulings of 2026-10-25: narrow the sibling-path check to the research content, add a five-iteration second-model pass on DeepSeek through cli-devin, and scope the .skilled boundary check to the two subject mode folders."
trigger_phrases:
  - "quality mode research decision record"
  - "ac-011 sibling path narrowing"
  - "second-model pass deepseek devin"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research/001-quality-mode-research"
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
# Decision Record: Phase 1: quality-mode-research

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

AC-011 greps every file under `research/` for the sibling phase's research path and wants 0 everywhere. The first run printed 47 non-zero files. Ten were `research/prompts/iteration-N.md`, which carry the instruction not to read the sibling's folder. The other 37 were quarantine copies the runtime's write-containment guard made while the sibling run wrote in the same worktree. None was research content, and the synthesis, the iteration files, the deltas and the state log printed 0.

### Constraints

- A run's own prompt has to name the sibling path to forbid reading it, so a whole-folder grep can never print 0 for the prompts.
- The quarantine copies were deleted with the operator's approval before this record was written.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to run AC-011's grep over the research content proper only, which is `research/research.md`, `research/iterations/`, `research/deep-research-state.jsonl` and `research/deltas/`.

**How it works**: the check becomes `grep -rc "002-review-mode-research/research" research/research.md research/iterations research/deep-research-state.jsonl research/deltas`, run from this phase folder, with every count required to be 0. Prompts and dispatch receipts are out of scope, because they carry the prompt that holds the do-not-read rule.
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

**Observed result, 2026-10-25, after iteration 15**: the narrowed grep printed 0 for `research/research.md`, the state log, every delta file and 14 of the 15 iteration files. It printed 1 for `research/iterations/iteration-011.md`, line 17, which reads `` `002-review-mode-research/research/` was not read.`` The second-model executor wrote that line to attest that it obeyed the do-not-read rule. It is the same rule the prompts carry, not sibling content. Devin's own session records for the second-model iterations show no read, grep or glob call whose arguments name the sibling folder. One repo-wide search in iteration 13 listed two sibling file names and their match line numbers in its output, and no call opened either file.

**Amendment, operator ruling of 2026-10-25**: the narrowed check may skip a line that only states the sibling folder was not read. The check becomes `grep -rn "002-review-mode-research/research" research/research.md research/iterations research/deep-research-state.jsonl research/deltas | grep -vE '(was not read|Nothing under .* was read)'`, run from this phase folder, and it passes when it prints nothing. The lines it skips are `iteration-011.md` attestations, not sibling content. Re-run after the amendment: it printed nothing.

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
| 3 | **Sufficient?** | PASS | Five iterations covered all 14 ranked rows |
| 4 | **Fits Goal?** | PASS | The operator ruled for it |
| 5 | **Open Horizons?** | PASS | The workflow's `completed-continue` branch, once wired, would replace the config edit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Executor: cli-devin, `--model deepseek-v4-1-flash-max`, which Devin resolves to `deepseek-v4-1-flash-1017-max`, DeepSeek V4.1 Flash Max. Devin has no effort flag, so the `max` tier is the model id's suffix. The dispatch branch passes `--permission-mode dangerous` and `--respect-workspace-trust false`.
- Iterations 11, 12, 14 and 15 verified on the first dispatch. Iteration 13's first dispatch sent its gateway call to `research/deltas/` instead of `research/`, so `verify-iteration.cjs` reported `state_record_missing`. The workflow's one redispatch then verified. That first attempt left a stray ledger, a state copy and lock folders under `research/deltas/`, which were deleted with the operator's approval, along with `research/.iter-014-event.json`.
- `research/research.md` gained sections 6a and 6b, and its executor table, open questions and convergence report were refreshed.

**How to roll back**: restore `research/synthesis-v1.md` as `research/research.md`, set `maxIterations` back to 10 and remove iterations 11 to 15, their deltas, prompts and receipts.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Scope the .skilled boundary check to the two subject mode folders

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | The operator, by the run brief, recorded by the orchestrating session after the packet's deep review |

---

<!-- ANCHOR:adr-003-context -->
### Context

AC-009 and CHK-032 test parent decision D1, which says no file under `.skilled/` changes. The literal check, `git diff --stat $BASE_SHA -- ':/.skilled'`, compares the whole folder with the baseline. Concurrent CI wiring and doctor work edited other `.skilled/` paths in this worktree while the runs were active. The literal command printed 120 changed files when this phase closed and 131 at a later HEAD. No iteration log records a write to any of them. The operator directed the check to the two subject mode folders, and until this record the only trace of that direction was a Key Decisions row in the phase 2 implementation summary.

### Constraints

- Other sessions write to `.skilled/` in the same worktree, so a whole-folder diff cannot isolate this packet's writes.
- Phase 3 of this packet edits the two mode folders on purpose to apply the review findings. A diff that ends at HEAD would then test that phase, not the research runs.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: to scope the boundary check to `.skilled/skills/sk-code/sk-code-quality` and `.skilled/skills/sk-code/sk-code-review`, over the commit range the research runs covered.

**How it works**: the check is `git diff --stat f8671e07c2 ee8c7e6f24 -- .skilled/skills/sk-code/sk-code-quality .skilled/skills/sk-code/sk-code-review`, run from the repository root. It passes when it prints nothing. `f8671e07c2` is the Baseline in the parent goal log. `ee8c7e6f24` is the commit that recorded the second-model pass and closed the research. At the close, `git status --short --untracked-files=all` on the same two paths also printed 0 lines.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope to the two folders over the research range** | Tests the runs' own subjects and stays true after later phases | Other `.skilled/` paths are covered only by the iteration logs | 8/10 |
| Keep the whole-folder diff | Matches D1 word for word | Cannot pass while other sessions share the worktree | 2/10 |
| Scope to the two folders but end at HEAD | One command, no fixed end commit | Fails as soon as phase 3 lands its fixes | 4/10 |
| Waive AC-009 | Closes at once | Drops the only boundary check on D1 | 1/10 |

**Why this one**: it keeps a command that could fail if a run had written to its subject, and it stays reproducible after the remediation phase.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- AC-009, CHK-032 and goal criterion 3 name one command with an observable result.

**What it costs**:
- A run write to a `.skilled/` path outside the two folders is no longer caught by a diff. Mitigation: each iteration log records the run's writes, and none names such a path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A run wrote to a hub file that another session also edited | L | The iteration logs record every run write, and none touches `.skilled/` |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The literal check printed changed files no run wrote |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives were weighed above |
| 3 | **Sufficient?** | PASS | One command over two folders and a fixed range |
| 4 | **Fits Goal?** | PASS | D1 exists to keep the runs off the skills they study |
| 5 | **Open Horizons?** | PASS | The fixed range stays valid after any later phase |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- AC-009 is set to `Superseded` with this record in its Waiver cell, and its verification names the scoped command.
- CHK-032 in `tasks.md` and goal criterion 3 point at the same command.

**Observed result, 2026-10-25**: the scoped command printed nothing. The whole-folder form, `git diff --stat f8671e07c2 HEAD -- .skilled`, printed 131 files changed, all outside the two folders.

**How to roll back**: restore the whole-folder command in AC-009 and set its Status back to `Unmet`.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
