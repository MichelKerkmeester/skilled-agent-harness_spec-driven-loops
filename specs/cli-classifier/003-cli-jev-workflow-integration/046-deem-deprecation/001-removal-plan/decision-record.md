---
title: "Decision Record: Phase 1: removal-plan"
description: "The four decisions the Deem removal works from: remove rather than mark, a one-mode cli-classifier hub, --deem as an unknown flag, and history left as it is."
trigger_phrases:
  - "deem removal decisions"
  - "one-mode classifier hub"
  - "deem unknown flag"
  - "deem history untouched"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan"
    last_updated_at: "2026-10-02T11:30:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Recorded ADR-001 to ADR-004"
    next_safe_action: "Check the inventory draft"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-001-removal-plan"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 1: removal-plan

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Remove Deem rather than mark it deprecated

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-02 |
| **Deciders** | The operator, in chat |

---

<!-- ANCHOR:adr-001-context -->
### Context

The operator said "Stop and deprecate deem completely" and "lets deperecate deem cli completely and only keep cli jev". A deprecated-but-present `cli-deem` would keep a mode, 20 arms, their tests and docs that nothing should call.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Delete the `cli-deem` packet and its Hermes copy, and cut every scorer's Deem switch, arm, helpers, tests and docs.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove** | Nothing left to maintain or route to | A later return to Deem means rebuilding from git history | 9/10 |
| Mark deprecated and keep | Easy to revive | Keeps dead code, tests and routing | 3/10 |

**Why this one**: it follows the operator's words.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One classifier to maintain, test and route.

**What it costs**:
- A later return to Deem means rebuilding from git history.

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator's request of 2026-10-02 |
| 2 | **Beyond Local Maxima?** | PASS | Two options compared |
| 3 | **Sufficient?** | PASS | No extra machinery |
| 4 | **Fits Goal?** | PASS | Jev as the only classifier |
| 5 | **Open Horizons?** | PASS | The hub stays open to a new mode |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: phases 002 to 004 apply this decision to the rows `inventory.md` gives them.

**How to roll back**: Each phase's commits are path-scoped, so `git revert` restores a removed part.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: `cli-classifier` stays a parent hub with one mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-02 |
| **Deciders** | The operator, in chat |

---

<!-- ANCHOR:adr-002-context -->
### Context

The operator said "Cli classifier still needs to stay a parent hun tho" and "In case we want to support future classifiers". The checks allow one mode: `parent-skill-check.cjs:354` fails only a hub with zero modes, the cli-classifier registry compiler fails only zero modes (`registry-compiler.cjs:153`), and its router clarifies only when more than one mode ties (`router.cjs:205`), so the clarify contract's two-alternative floor (`decision-contract.cjs:383`) is never reached.

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Keep every parent-hub file with `cli-jev` as the only mode and its routing compiled.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One-mode parent hub** | A new classifier is one new mode | A hub with one mode looks heavier than it needs to | 8/10 |
| Flatten to a plain `cli-jev` skill | Simpler today | Rebuilding the hub later, against the operator's words | 2/10 |

**Why this one**: it follows the operator's words.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One classifier to maintain, test and route.

**What it costs**:
- A hub with one mode looks heavier than it needs to.

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator's request of 2026-10-02 |
| 2 | **Beyond Local Maxima?** | PASS | Two options compared |
| 3 | **Sufficient?** | PASS | No extra machinery |
| 4 | **Fits Goal?** | PASS | Jev as the only classifier |
| 5 | **Open Horizons?** | PASS | The hub stays open to a new mode |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: phases 002 to 004 apply this decision to the rows `inventory.md` gives them.

**How to roll back**: Re-add a mode through `mode-registry.json` and the hub router.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: `--deem` becomes an unknown flag

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-02 |
| **Deciders** | The operator, in chat |

---

<!-- ANCHOR:adr-003-context -->
### Context

Twenty scorers take `--deem`. After removal a caller could still pass it.

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Each scorer drops the switch, so `--deem` reaches its existing unknown-flag path. No special message names Deem.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unknown flag** | No Deem wording left in the code | A caller gets a generic error | 8/10 |
| A message saying Deem was removed | Clearer to an old caller | Keeps Deem wording in 20 scripts | 4/10 |

**Why this one**: it follows the operator's words.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- One classifier to maintain, test and route.

**What it costs**:
- A caller gets a generic error.

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator's request of 2026-10-02 |
| 2 | **Beyond Local Maxima?** | PASS | Two options compared |
| 3 | **Sufficient?** | PASS | No extra machinery |
| 4 | **Fits Goal?** | PASS | Jev as the only classifier |
| 5 | **Open Horizons?** | PASS | The hub stays open to a new mode |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: phases 002 to 004 apply this decision to the rows `inventory.md` gives them.

**How to roll back**: Restore the switch from git history.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: History, released changelogs and the Deem server stay as they are

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-02 |
| **Deciders** | The operator, in chat |

---

<!-- ANCHOR:adr-004-context -->
### Context

`specs/` and released changelog entries record what happened. The local Deem server and `~/.local/share/deem` are outside the repository.

<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Leave `specs/`, every released changelog entry, the server and its folder untouched. New changelog entries record the removal.

<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Leave history** | The record stays true | `git grep deem` still finds history | 9/10 |
| Scrub history too | A clean grep | Rewrites the record | 1/10 |

**Why this one**: it follows the operator's words.

<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- One classifier to maintain, test and route.

**What it costs**:
- `git grep deem` still finds history.

<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator's request of 2026-10-02 |
| 2 | **Beyond Local Maxima?** | PASS | Two options compared |
| 3 | **Sufficient?** | PASS | No extra machinery |
| 4 | **Fits Goal?** | PASS | Jev as the only classifier |
| 5 | **Open Horizons?** | PASS | The hub stays open to a new mode |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: phases 002 to 004 apply this decision to the rows `inventory.md` gives them.

**How to roll back**: Nothing to undo.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---
