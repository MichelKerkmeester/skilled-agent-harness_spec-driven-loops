---
title: "Decision Record: Phase 7: gap-closure"
description: "Why the Codex live hook is not added, why a lone chat candidate is not auto-accepted, and why the OpenCode sweep loads SQLite lazily instead of splitting its mapping into a new module."
trigger_phrases:
  - "gap closure decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/007-gap-closure"
    last_updated_at: "2026-11-02T17:46:39Z"
    last_updated_by: "template-author"
    recent_action: "Recorded the three gap decisions"
    next_safe_action: "Implement the six changes in tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 7: gap-closure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: No Codex live hook

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-02 |
| **Deciders** | Orchestrator, on the operator's go-ahead to implement the research |

---

<!-- ANCHOR:adr-001-context -->
### Context
The research split on this. DeepSeek noted that `.skilled/skills/.state/decision-capture/probe/codex.json` records a hook seeing the answer and that `.codex/hooks.json` already registers project PostToolUse and Stop hooks, so a user who trusts the repo hooks would run one more. Luna noted that the save-time rollout sweep already captures every answer and that the 006 Codex run passed on it alone.

### Constraints
- A live adapter must keep its mapping in step with `sweep-codex.mjs`, the way the Pi and OpenCode adapters do.
- Without a save, neither path writes a record.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Keep the save-time rollout sweep as the only Codex capture path.

**How it works**: Nothing changes in code. `coverage-rationale.md` records the reason for the Codex cell: the hook would add a sixth adapter whose only gain is a live nudge.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rollout sweep only** | No new adapter; proven in the 006 run | No live nudge on Codex | 8/10 |
| Live PostToolUse adapter | Live nudge for users who trust the hooks | Another mapping to keep in step; needs hook trust | 5/10 |

**Why this one**: Every answer reaches the record through the sweep already, so the hook would add maintenance for a reminder only.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**:
- One fewer adapter and mapping to maintain.

**What it costs**:
- Codex users get no live reminder. Mitigation: the save step lists pending answers, including orphaned ones.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future Codex rollout format change breaks the sweep | M | The sweep tests run on a redacted live sample and fail on a format change |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The decision avoids building something, recorded so it is not reopened without a new fact |
| 2 | **Beyond Local Maxima?** | PASS | Both lineages argued opposite sides |
| 3 | **Sufficient?** | PASS | The 006 Codex row passed on the sweep alone |
| 4 | **Fits Goal?** | PASS | The goal needs every answer recorded, not a live reminder |
| 5 | **Open Horizons?** | PASS | A hook can still be added if the reminder becomes the need |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation
**What changes**:
- `.skilled/hooks/coverage-rationale.md`: the Codex cell reason.

**How to roll back**: Revert the rationale paragraph.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: No auto-accept for a lone chat candidate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-02 |
| **Deciders** | Orchestrator, on the operator's go-ahead to implement the research |

---

<!-- ANCHOR:adr-002-context -->
### Context
The research proposed accepting a chat candidate without the saving model's judgment when it is the only candidate on its reply, and asked for a probe first. The probe fed the detector one question followed by an off-topic reply.

### Constraints
- The detector pairs by position, not by meaning.
- A wrong pair writes a false decision into a record.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision
**We chose**: Keep the saving model's judgment for every chat candidate.

**How it works**: No change. `chatCandidatesFromTurns` on `Should the badge be blue or amber?` followed by `actually first fix the login bug` returns one candidate, `chat:a1:u1`, so a lone candidate can still be a non-answer.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Model judges every candidate** | A non-answer is left out | One judgment per candidate at save | 9/10 |
| Auto-accept lone candidates | No judgment for the common case | Records an off-topic reply as a decision | 3/10 |

**Why this one**: The probe shows the lone case is exactly where an off-topic reply lands.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences
**What improves**:
- No false decision from an off-topic reply.

**What it costs**:
- The saving model still reads each candidate. Mitigation: none needed; this is the current behavior.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A model accepts a non-answer anyway | L | The 006 scenario checks the record after each save |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Settles the research's open probe |
| 2 | **Beyond Local Maxima?** | PASS | Tested against a concrete counterexample |
| 3 | **Sufficient?** | PASS | No change needed |
| 4 | **Fits Goal?** | PASS | The goal needs rewritten decisions that are true |
| 5 | **Open Horizons?** | PASS | Reopen with a detector that reads meaning |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation
**What changes**:
- None.

**How to roll back**: Nothing to roll back.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Load SQLite lazily instead of a new mapping module

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-02 |
| **Deciders** | Orchestrator, on the operator's go-ahead to implement the research |

---

<!-- ANCHOR:adr-003-context -->
### Context
The OpenCode plugin keeps its own copy of the answer mapping because importing `sweep-opencode.mjs` pulls `node:sqlite` at load, and Bun, which loads OpenCode plugins, has no `node:sqlite`: `bun -e "import('./.skilled/hooks/decision-capture/bin/sweep-opencode.mjs')"` prints `No such built-in module: node:sqlite`.

### Constraints
- The plugin must keep loading under Bun.
- No new file unless the cheaper move fails.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision
**We chose**: Load `node:sqlite` inside the sweep's two database functions, so the plugin can import `openCodeAnswerRecords` directly.

**How it works**: The sweep resolves `DatabaseSync` through `createRequire` when `loadOpenCodeParts` or `latestOpenCodeSession` runs. The plugin builds one completed tool part from the hook input and passes it to `openCodeAnswerRecords`, then marks the records as `hook`, the way the Pi extension does.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Lazy load in the sweep** | No new file; one mapping | The sweep's import is less obvious to a reader | 8/10 |
| New `lib/opencode-records.mjs` | The split is explicit | A new file for one function | 6/10 |
| Keep the copy | No change | Two mappings drift; same keys are only tested | 4/10 |

**Why this one**: It removes the copy without adding a file, and a Bun import proves the plugin still loads.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences
**What improves**:
- One OpenCode mapping instead of two.

**What it costs**:
- A reader of the sweep finds the SQLite import inside a function. Mitigation: a comment names Bun as the reason.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit reintroduces a top-level SQLite import | M | The Bun import check in the tasks catches it |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The copy is the one duplicate the research confirmed |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | No new file |
| 4 | **Fits Goal?** | PASS | Keeps live and swept OpenCode keys identical |
| 5 | **Open Horizons?** | PASS | Bun gaining node:sqlite would make the lazy load harmless |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation
**What changes**:
- `bin/sweep-opencode.mjs`: lazy SQLite load.
- `.opencode/plugins/decision-capture.js`: imports `openCodeAnswerRecords`, drops `answerMap`.

**How to roll back**: Revert both files in the 007 commit.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.
<!-- /ANCHOR:operator-answers-verbatim -->

---
