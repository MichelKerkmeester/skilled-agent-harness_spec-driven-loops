---
title: "Decision Record: Phase 3: repin"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "repin decision record"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "scaffold/003-repin"
    last_updated_at: "2026-11-06T07:23:11Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-repin"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 3: repin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A destination holding its pinned overlay bytes reads overlay-edited after a moved pin

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The build session |

---

<!-- ANCHOR:adr-001-context -->
### Context

After the pin moves, the engine read every guarded destination whose bytes differ from the new upstream file as `upstream-moved`. The whole-folder runtime copy leaves a destination holding exactly the overlay's `pinnedSha256` bytes, so no re-pin could ever apply cleanly.

### Constraints

- A destination that matches neither the pinned bytes nor the overlay copy still blocks.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a destination whose bytes equal the overlay's `pinnedSha256` reads `overlay-edited` after a moved pin.

**How it works**: `classifyDestination` checks the pinned hash before it reports `upstream-moved`, so `apply` writes the overlay over it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Treat pinned bytes as overlay-edited | Re-pins apply cleanly | One more branch in the classifier | 9/10 |
| Restore each file from the pin first | No classifier change | The hand restore step this design removes | 2/10 |

**Why this one**: It removes the restore step that every Barter re-pin needed, and a real conflict still blocks.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A re-pin applies over the copied runtime folders without a restore script.

**What it costs**:
- None beyond the branch.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A real conflict is read as overlay-edited | H | Only the exact pinned bytes take the branch, and the moved-pin tests still pass |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No re-pin applied cleanly without it |
| 2 | **Beyond Local Maxima?** | PASS | Two options were weighed |
| 3 | **Sufficient?** | PASS | The repin tests and the earlier moved-pin tests pass |
| 4 | **Fits Goal?** | PASS | It is the trap the design names |
| 5 | **Open Horizons?** | PASS | A project without a moved pin is unaffected |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `overlay-engine.cjs`: `classifyDestination`.

**How to roll back**: revert this phase's commit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The backup also holds the engine's own files

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The build session |

---

<!-- ANCHOR:adr-002-context -->
### Context

The touched set covers what the copy writes and deletes. A rollback of only that set would leave the new pin in the manifest and the new hashes in `sync-state.json`, so the tree would read as a finished re-pin.

### Constraints

- The copy group and the delete group equal the touched set exactly, so the backup list and the copy list still come from one set.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: a third backup group, `engine`, with the manifest, `sync-state.json`, the overlay destinations, the layout links and the regenerate outputs.

**How it works**: `backup.json` records each path in its group with its hash. `--rollback` restores all three groups and removes the paths the run created.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Back up the engine's files too | Rollback restores the pin and the state | A larger backup | 9/10 |
| Back up only the touched set | Smallest backup | Rollback leaves the new pin behind | 2/10 |

**Why this one**: Only it makes `status` pass again after a rollback, which SC-001 requires.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A rollback returns the tree to the state `status` read before the run.

**What it costs**:
- The backup is larger by the overlay destinations, which are already known paths.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A group misses a path the apply writes | M | The rollback test checks `status` passes after the restore |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | SC-001 fails without it |
| 2 | **Beyond Local Maxima?** | PASS | Two options were weighed |
| 3 | **Sufficient?** | PASS | The rollback test passes byte for byte |
| 4 | **Fits Goal?** | PASS | It is the rollback the design requires |
| 5 | **Open Horizons?** | PASS | A tree with no regenerate step backs up less |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `overlay-engine.cjs`: the repin backup groups.

**How to roll back**: revert this phase's commit.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The backup copies token-named files, and never a .env file

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The build session |

---

<!-- ANCHOR:adr-003-context -->
### Context

The secret guard refuses to read a token-named file that no manifest entry names. A re-pin overwrites whole runtime folders, and a byte-exact rollback needs the old bytes of every file it overwrites, whatever its name.

### Constraints

- A `.env` file is never read.
- Overlay walks keep refusing token-named files.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: the backup and the drift check read a token-named file the copy will overwrite, and a touched `.env` path refuses the whole run.

**How it works**: The backup reads only paths in the touched set, which are upstream paths. The stage copy leaves every `.env` file out.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Back up token files, refuse .env | Byte-exact rollback | The backup holds a copy of such a file | 8/10 |
| Refuse a token file in the touched set | No copy of any such file | Barter's runtime folders could never re-pin | 2/10 |

**Why this one**: It keeps the rollback byte-exact and keeps `.env` out entirely.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A rollback restores every overwritten file, including token-named ones.

**What it costs**:
- The run folder can hold a token-named file. It sits in the overlay folder, beside the overlay sources that already hold the same kind of file.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A run folder is committed with a secret in it | M | Only upstream paths are backed up, and `.env` is refused |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Rollback is not byte-exact without it |
| 2 | **Beyond Local Maxima?** | PASS | Two options were weighed |
| 3 | **Sufficient?** | PASS | The rollback test passes byte for byte, and the `.env` test fails when the refusal is removed |
| 4 | **Fits Goal?** | PASS | It serves NFR-R01 |
| 5 | **Open Horizons?** | PASS | A project can delete old run folders |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `overlay-engine.cjs`: the repin backup and the stage copy.

**How to roll back**: revert this phase's commit.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
