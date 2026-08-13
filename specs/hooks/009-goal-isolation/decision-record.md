---
title: "Decision Record: Explicit Session Scope for Cross-Runtime Goals"
description: "Choose explicit workspace, runtime, and session identity over the repository-wide active-goal singleton."
trigger_phrases:
  - "goal isolation decision"
  - "cross-runtime goal scope"
  - "active-goal migration"
  - "session goal state architecture"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation"
    last_updated_at: "2026-08-10T21:11:11Z"
    last_updated_by: "codex"
    recent_action: "Composite scope, archive containment, cross-process serialization, and packet closeout verified"
    next_safe_action: "Monitor session-isolated goals during normal use"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/hooks/goal/pi/goal-context.ts"
    session_dedup:
      fingerprint: "sha256:1cea0756040ca815adf841b41d21da987ba6df2648ff607b51531ef489f2e0c3"
      session_id: "goal-isolation-spec-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Pi management and lifecycle handlers share sessionManager.getSessionId()."
      - "Cursor injection is native-session scoped; prompt management remains unsupported."
      - "Legacy state is diagnostic-only and migrates only to an explicit validated scope."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Explicit Session Scope for Cross-Runtime Goals

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Key Cross-Runtime Goal State by Explicit Session Scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-10 |
| **Deciders** | Project owner and implementation reviewer |

---

<!-- ANCHOR:adr-001-context -->
### Context

OpenCode's native plugin proves the correct ownership model: it requires a session id, stores one file per session, queues mutations per session, and validates that the embedded session id matches the selected path. The runtime-neutral sibling deliberately chose one `active-goal.json` for Pi and Cursor. That choice cannot represent two active sessions.

The current core has three coupled failure modes:

1. A second goal replaces and archives the first even when another session is still using it.
2. Every Pi and Cursor reader selects the same last-written record because selection has no identity input.
3. Any session can increment, pause, complete, clear, or verify the shared record.

The management path is the harder half of the correction. Injection hooks already receive native session ids, but `/goal-pi` and `/goal-cursor` run a shell CLI that receives only user arguments. A session-scoped reader paired with a global writer would be incomplete and confusing, so management and injection must cut over together.

### Constraints

- Pi provides `ctx.sessionManager.getSessionId()` to extension handlers.
- Cursor lifecycle payloads expose `session_id` and define `conversation_id` as a compatibility field; Devin goal adapters remain decommissioned.
- The goal store remains repository-local by default and may be redirected with `MK_GOAL_STATE_DIR` for tests.
- Runtime hooks must fail open to the user's turn, but goal selection must never guess.
- Raw session identifiers should not appear in filenames or diagnostics by default.
- The legacy singleton may contain a real active objective whose owner is unknowable.
- OpenCode's existing per-session plugin store must remain compatible and independently tested.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: require an explicit goal scope composed from normalized workspace root, runtime namespace, and native session id for every runtime-neutral goal operation.

**How it works**: one resolver canonicalizes the workspace to its repository root, validates the runtime and session identity, and hashes `JSON.stringify([repositoryRoot, runtime, sessionId])` into one opaque 64-hex scope key. Scoped JSON uses `.goal-state/<scope-hash>.json`; archives use `.goal-state/.archive/<scope-key>/`. Runtime adapters supply identity from their native context; the management surface obtains that same identity without asking users to type it.

No reader or injection hook falls back to `active-goal.json`. The legacy singleton is quarantined and visible through diagnostics. An explicit migration action may bind it to a named scope or archive it, but session startup never claims it automatically.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit composite session scope** | Solves cross-session and cross-runtime collision; matches OpenCode precedent; deterministic tests. | Requires identity-aware management surfaces and migration work. | 9/10 |
| Keep one global record and add an `ownerSessionId` field | Small schema change. | Other sessions still read one file; every caller must filter perfectly; no concurrent active goals. | 3/10 |
| Store multiple goals in one registry and mark one selected per session | Central diagnostics and one file. | Larger contention and corruption blast radius; selection map recreates the same identity problem. | 6/10 |
| Use one `MK_GOAL_STATE_DIR` per process | Minimal core changes. | Does not survive or correlate sessions reliably; environment propagation is inconsistent; commands and hooks can diverge. | 4/10 |
| Reuse OpenCode's plugin files directly | Existing per-session schema and tests. | OpenCode-specific lifecycle, async APIs, usage fields, and status model do not match the runtime-neutral core. | 5/10 |

**Why this one**: the bug is missing ownership, so ownership must become a required input rather than an optional field or deployment convention. A composite scope is the smallest design that supports simultaneous sessions and prevents namespace collisions.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Each session reads and mutates only its own goal.
- Two Pi sessions can remain active with different objectives in one repository.
- Equal native ids from different runtimes cannot collide.
- Missing identity is observable and safe instead of silently selecting global state.
- The runtime-neutral system aligns with the already-proven OpenCode ownership model without sharing incompatible records.

**What it costs**:

- Command management must move closer to native runtime context. Mitigation: probe and use extension/tool APIs before altering the CLI contract.
- Existing singleton state does not auto-resume. Mitigation: preserve it, report it, and provide explicit migration or archival.
- Diagnostics and history need both current-scope and aggregate views. Mitigation: keep raw ids private and expose opaque scope metadata plus counts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Command and hook derive different keys | High | One shared resolver and an end-to-end set-then-inject canary test. |
| A partial rollout leaves global readers or writers | High | Release the core, manager, adapters, tests, and docs as one bundle. |
| Legacy migration binds the wrong owner | High | No automatic binding; explicit operator action only. |
| Hash or normalization collision | Medium | Include workspace and runtime namespace; use a collision-resistant digest; test adversarial ids. |
| Same-session cross-process writes race | Medium | Serialize read-modify-write lifecycle operations with private hashed filesystem mutexes and retain atomic rename for each final write. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The supported CLI reproduced active A being replaced by B; prior live Pi work recorded the same concurrent clobber. |
| 2 | **Beyond Local Maxima?** | PASS | Five storage and isolation approaches were compared, including the OpenCode reference design. |
| 3 | **Sufficient?** | PASS | Required composite scope fixes ownership without adding multi-goal orchestration inside a session. |
| 4 | **Fits Goal?** | PASS | Every change maps directly to preventing another session's goal from reaching or being mutated by the current AI. |
| 5 | **Open Horizons?** | PASS | The scope key can support future clone, parent-child, or aggregate diagnostics without weakening default isolation. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Implemented result**:

- The runtime-neutral core receives required scope on every public state operation.
- Pi extracts native identity for lifecycle and registered-command management; Cursor extracts hook identity; Devin goal adapters remain decommissioned.
- Runtime management uses a native identity-aware tool or command bridge rather than an unscoped shell call.
- The singleton becomes legacy-only data with explicit diagnostics and migration.
- Archive targets derive strict segment-safe identities, resolve under the real state root, and reject symlink escapes.
- Tests cover two simultaneous sessions, namespace collisions, missing identity, legacy state, hostile archives, and multiprocess lifecycle mutations.

**How to roll back**: disable goal injection with `MK_GOAL_PLUGIN_DISABLED=1`, revert the entire scoped bundle, retain all scoped and legacy data, and confirm new sessions receive no goal block. Do not merge scoped records into a new global active goal.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
