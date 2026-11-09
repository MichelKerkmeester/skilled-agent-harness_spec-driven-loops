---
title: "Decision Record: Phase 22: linked-project-host-index"
description: "Decisions for Gate 1 and the generator in a project checkout that links into a host."
trigger_phrases:
  - "linked project host index decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/022-linked-project-host-index"
    last_updated_at: "2026-11-09T15:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the phase decisions"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-lead"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 22: linked-project-host-index

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Resolve the owning host in the lookup, not in setup

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Lead orchestrator (operator relayed the Barter handover) |

---

### Context

A Barter project links `.skilled` and `specs` into `ai-speckit` and keeps no index, so a bare lookup read the packaged index. The handover offered two fixes: resolve the owner in the lookup, or have `/doctor:symlink` link `.speckit-index` into each project.

### Constraints
- Barter's checkouts are read-only from this session.

---

### Decision

**Summary**: The lookup reads the caller's own index, then the index of the repository that holds the real location of its `.skilled` tree, then the packaged one.

**Details**: The owner is the git toplevel of the vendored tree's real directory, and it counts only when it differs from the caller and keeps an index. Nothing walks up arbitrary ancestors, because an unrelated repository higher up the filesystem is not this project's host. `isHostRepository` is unchanged.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Resolve in the lookup** | Works for every linked project with no setup step | One more git call when the caller has no index | 9/10 |
| Link `.speckit-index` in `/doctor:symlink` | Simple | Every unlinked project stays broken, and the fix lives in setup | 5/10 |

**Why Chosen**: It fixes the place the wrong answer came from.

---

### Consequences

**Positive**:
- Barter drops its run-from-ai-speckit workaround.

**Negative**:
- A project whose host is a separate repository from the vendored tree's own git root is not found. Mitigation: `--index` still works.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Default scope and path form for a linked project

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Lead orchestrator (operator relayed the Barter handover) |

---

### Context

The host index spells paths relative to the host (`specs/backend-system/...`), while the project's own `specs` link holds `backoffice/...`. From one project, the other tracks are noise.

### Constraints
- Barter's checkouts are read-only from this session.

---

### Decision

**Summary**: Reading an owner's index, the default scope is the folder the project's `specs` link points to, relative to the host. Paths stay host-relative, and the text output prints `paths : relative to <host>`.

**Details**: `--spec-folder ""` unscopes, and an explicit `--spec-folder` wins. A project whose `specs` is a real folder, or links outside the host, gets no default scope. `parseArgs` now keeps an empty value distinct from a missing one.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope to the linked track, host-relative paths** | Only the project's packets, paths match the index | A cross-track answer needs `--spec-folder ""` | 8/10 |
| Unscoped, host-relative | No hidden results | Other tracks crowd the answer | 5/10 |
| Rewrite paths to project-relative | Matches the project tree | Diverges from the index and other tools | 3/10 |

**Why Chosen**: Paths stay one spelling everywhere, and the scope line says what applied.

---

### Consequences

**Positive**:
- A Gate 1 answer from a project names that project's packets first.

**Negative**:
- A question about another track from inside a project needs `--spec-folder ""`.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Generation stays at the host root, and review

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Lead orchestrator (operator relayed the Barter handover) |

---

### Context

A bare generation from a linked project would write a second, partial index, because `isHostRepository` is true there. Goal G4 asks for the other model family to review each diff, and cli-codex is out of quota until 2026-11-13.

### Constraints
- Barter's checkouts are read-only from this session.

---

### Decision

**Summary**: A bare generation from a linked project with no index of its own exits 2 and names the host; explicit `--repo-root` or `--out` win, and a project with its own `.speckit-index/` is not refused. The lead (Claude) reviewed every DeepSeek diff.

**Details**: The review found one gap in the first diff: a linked project with its own index was refused by the generator although the lookup reads that index first. A follow-up brief exempted it and added a case.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Refuse and name the host** | No partial index, clear next step | One more refusal path | 8/10 |
| Generate the host index from the project | Convenient | Writes another repository from a project checkout | 4/10 |

**Why Chosen**: Generation keeps one owner, as the handover asked.

---

### Consequences

**Positive**:
- A partial index cannot appear in a project.

**Negative**:
- No GPT review on this phase.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
