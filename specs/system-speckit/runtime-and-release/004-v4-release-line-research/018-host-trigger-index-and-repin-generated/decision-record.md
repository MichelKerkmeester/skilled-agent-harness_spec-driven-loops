---
title: "Decision Record: Phase 18: host-trigger-index-and-repin-generated"
description: "Decisions for the host trigger index default: how a host is recognised and why the re-pin needs no generated-file marker."
trigger_phrases:
  - "host trigger index and repin generated decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/018-host-trigger-index-and-repin-generated"
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
# Decision Record: Phase 18: host-trigger-index-and-repin-generated

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
## ADR-002: Recognise a host from its own layout

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

The lookup and generator resolve their defaults from the script location, which is inside Skilled in every install. A host keeps `.skilled` as a symlink or vendored tree whose real path is outside the host root; Skilled's checkout holds a real `.skilled` directory.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: A root is a host when it has `.speckit-index/` or its `.skilled` resolves outside it. The lookup reads an existing host index file; the generator uses the host test.

**Details**: The lookup does not use the host test because a host with no index yet must keep a working Gate 1; the packaged index is the fallback. Explicit flags always win.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Layout signals** | No configuration; Skilled cannot match by accident | A host that copies `.skilled` in as a real directory needs `.speckit-index/` first | 8/10 |
| A config file naming the index | Explicit | One more file every host must create | 5/10 |
| Always use the caller's git root | Simple | Skilled's own checkout would index itself from any cwd, including linked worktrees elsewhere | 3/10 |

**Why Chosen**: It needs nothing from a host that it does not already have.

---

### Consequences

**Positive**:
- The shipped Gate 1 command works in a host.

**Negative**:
- A host with a real copied `.skilled` and no index is not detected until its first explicit `--out`.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Item 2 closes through item 1

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

The overlay engine refuses an unowned file that differs from the old pin. Barter's four refused files were Skilled's packaged retrieval outputs, regenerated for Barter's corpus.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: No generated-file marker in the overlay engine. With the host default, the packaged files stay at the pin and the engine has nothing to refuse.

**Details**: Proof on a scratch host copy: negative control 4 `refuse:` lines and `RESULT: FAILED`; after the bare generation 0 `refuse:` lines and `RESULT: STAGED`. Barter's runbook should drop step 1 and run the bare generator at step 5.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stop the writes** | No engine change, fixes the cause | Barter's runbook needs a two-line edit | 9/10 |
| Manifest-marked regenerated files in the engine | Tolerates any host | New engine contract for a symptom | 4/10 |

**Why Chosen**: Fix at the producer, not the consumer.

---

### Consequences

**Positive**:
- The re-pin needs no reset step for these files.

**Negative**:
- A host still on the old runbook keeps regenerating the packaged files until it updates.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: Review

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

GPT is out of quota until 2026-11-13, so the second-family review is Claude's.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: PASS. The diff was read line by line; `parseArgs` leaves `indexPath` undefined so the host default is reachable, in-process `loadIndex()` callers keep the packaged default, and both done-when lines were rerun by the reviewer.

**Details**: No defect found.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Claude review** | Different family from the writer | Not the planned GPT lens | 8/10 |

**Why Chosen**: Only other family available.

---

### Consequences

**Positive**:
- Independent check of every claim.

**Negative**:
- None.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-004 -->
---

