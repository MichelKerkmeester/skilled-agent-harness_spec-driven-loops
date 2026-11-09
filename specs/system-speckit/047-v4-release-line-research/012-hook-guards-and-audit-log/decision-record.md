---
title: "Decision Record: Phase 12: hook-guards-and-audit-log"
description: "Decisions for the ask-surface guard and dispatch-audit fixes: the send-back contract, ordering with phases 010 and 011, and the review adjudication."
trigger_phrases:
  - "hook guards and audit log decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/012-hook-guards-and-audit-log"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded the phase decisions"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 12: hook-guards-and-audit-log

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Workflow deviations under an absent operator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

`/speckit:plan:auto` step 5 dispatches four `@context` explorers through the Task tool and both workflows end in a continuity save through `generate-context.js`. This orchestrator runs as a leaf that may not dispatch native agents, and goal G4 reserves code writes for CLI workers.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Explore inline from the parent synthesis evidence, run CLI workers one at a time, and keep continuity in the spec docs' `_memory` blocks instead of running the save writer.

**Details**: The plan YAML's own fallback ("Use inline planning activities below") covers the explorers. The research for this phase is the parent synthesis, so no phase `research/research.md` is created. cli-codex rule 15 keeps one CLI dispatch alive at a time without operator approval. The phase commit sets `SPECKIT_SKIP_SPEC_REMINT=1`, and no other hook skip, as the lead approved: the spec-remint pre-commit check refuses a commit that stages 047 docs while another 047 child has unstaged edits, which is always true with two orchestrators in one worktree. `repair-derived.cjs --apply` runs on the parent and this phase under the commit lock first, and the lead makes one final unbypassed commit.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Inline exploration, serial workers** | Breaks no rule | Slower | 8/10 |
| Parallel CLI workers | Faster | Breaks cli-codex rule 15 without approval | 3/10 |

**Why Chosen**: It is the only option that breaks no rule.

---

### Consequences

**Positive**:
- Every write traces to one brief.

**Negative**:
- Longer wall-clock time. Mitigation: one change per brief keeps each run short.

---

### Implementation

**Affected Systems**: none beyond this phase's files.

**Rollback**: not applicable; process decision.

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: At most one send-back per operator message

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

Four adapters keyed "sent back once" four ways: OpenCode on the assistant message, dsh on the turn number, Pi on the operator message, Claude on `stop_hook_active`.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: One contract: at most one send-back per operator message. OpenCode and dsh change; Claude and Pi already comply.

**Details**: OpenCode ignores user messages that are the guard's own reprompt, because OpenCode 2 delivers that reprompt as a user message.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per operator message** | Matches two runtimes and the core header | Two adapters change | 8/10 |
| Per assistant message | Matches OpenCode today | Lets one operator turn be sent back without limit | 3/10 |

**Why Chosen**: It bounds the guard to one interruption per thing the operator said.

---

### Consequences

**Positive**:
- Same behaviour on every runtime.

**Negative**:
- A genuinely new menu in the same operator turn is not sent back. Mitigation: the next operator message re-arms it.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Implement ahead of phases 010 and 011, commit after them

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

The lead ordered phases 009 to 016. Phase 012 touches only hook files that no spec-kit suite loads, and phase 009's 35-minute final suite run left the CLI worker idle.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Run 012's workers while 009's suites ran; commit 012 after 010 and 011 so commits keep phase order.

**Details**: No 012 file is shared with 009, 010 or 011, so neither order can change another phase's baseline.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Implement early, commit in order** | Uses idle worker time | Uncommitted work sits longer | 8/10 |
| Strict serial | Simplest | About an hour idle | 5/10 |

**Why Chosen**: It saves time without changing any phase's evidence.

---

### Consequences

**Positive**:
- Commits stay in phase order.

**Negative**:
- None measured.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: Cross-family review adjudication

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

DeepSeek V4.1 Flash max returned FAIL with one P1 and five P2 rows. The orchestrator confirmed the P1 at `.opencode/plugins/lib/v2-bridge.js:231-246`.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Fix the P1 and three P2s; record two P2s.

**Details**: Fixed: reprompt re-keying (P1), per-call git spawn, floating promises in codex and devin entrypoints, unused Pi import. Recorded: a numbered summary followed by a choice-worded question can fire (narrowing it would break `prose-menu-numbered.json`, whose closing question is a bare "Which ...?"); the OpenCode fallback key is window-relative when a message has no id, which OpenCode 2 always sets.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix confirmed rows, record judgment trade-offs** | No reproduced issue left open | Two edge cases stay | 8/10 |
| Fix all | Fewer edges | Breaks an existing positive fixture | 4/10 |

**Why Chosen**: The two recorded rows trade one false reprompt against missing a real menu.

---

### Consequences

**Positive**:
- The P1 is closed with a test that fails on the old code.

**Negative**:
- Two P2 edges remain, listed in the summary's limitations.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-004 -->
---

