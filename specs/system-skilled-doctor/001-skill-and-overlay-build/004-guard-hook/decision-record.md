---
title: "Decision Record: Phase 4: guard-hook"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "guard hook decision record"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "scaffold/004-guard-hook"
    last_updated_at: "2026-11-06T07:23:12Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-guard-hook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 4: guard-hook

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The Cursor binding carries no fallback chain

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The build session |

---

<!-- ANCHOR:adr-001-context -->
### Context

Most bindings wrap their adapter in a `|| { fallback }` chain that prints an allow envelope when the adapter cannot run. Cursor blocks a tool call on exit 2. With the chain, the shell runs the fallback on that exit, prints an allow envelope after the refusal and exits 0, so Cursor never sees the refusal.

### Constraints

- The other runtimes keep their usual fallback.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `fallback: none` on the Cursor binding.

**How it works**: The registered Cursor command runs the adapter alone, so its exit 2 reaches Cursor. A test runs the registered command and expects exit 2 on an owned path.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| No fallback for Cursor | The refusal reaches Cursor | A missing adapter fails without the drift note | 9/10 |
| Keep the envelope fallback | Same as other Cursor hooks | The guard never refuses in Cursor | 1/10 |

**Why this one**: Only it lets the guard refuse in Cursor at all.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Cursor refuses an edit to an owned file.

**What it costs**:
- A missing Cursor adapter is reported by `/doctor:runtime-mirrors` rather than by a drift note in the session.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Other Cursor deny hooks have the same chain | M | Named as a follow-up. `spec-gate-enforce` and `task-dispatch-guard` were not changed or tested here |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The test failed with exit 0 before the change |
| 2 | **Beyond Local Maxima?** | PASS | Two options were weighed |
| 3 | **Sufficient?** | PASS | The registered-command test passes |
| 4 | **Fits Goal?** | PASS | It is the guard's purpose |
| 5 | **Open Horizons?** | PASS | Other runtimes are unaffected |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `hook-registry.json`: the Cursor binding of `overlay-guard`.

**How to roll back**: revert this phase's commit and rerun the registration generator.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The guard fails open on an engine error

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The build session |

---

<!-- ANCHOR:adr-002-context -->
### Context

The guard ships to every Skilled repository. An engine that cannot load, times out or reports an error must not stop every edit in a session.

### Constraints

- A refusal needs the engine's own `refuse:` answer.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: allow the edit with one stderr line when the engine errors or takes longer than 3 seconds.

**How it works**: The core refuses only on exit 1 with a `refuse:` line. Any other result allows.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Fail open | An engine fault never blocks a session | An owned file can be edited during a fault | 8/10 |
| Fail closed | No owned edit slips through | An engine fault blocks every edit | 3/10 |

**Why this one**: The overlay check in `/doctor:overlay status` still catches an edit that slips through, so blocking every edit costs more than it saves.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A broken engine never stops an agent's work.

**What it costs**:
- An owned file can be edited while the engine is broken.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An owned edit lands during a fault | L | `status` reports it as `live-edited`, and `apply --capture` moves it into the overlay |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The guard runs in every repository |
| 2 | **Beyond Local Maxima?** | PASS | Two options were weighed |
| 3 | **Sufficient?** | PASS | The engine-error test allows the edit |
| 4 | **Fits Goal?** | PASS | It matches the other guard hooks |
| 5 | **Open Horizons?** | PASS | A later release can tighten it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `lib/overlay-guard.cjs`: the decision on the engine's result.

**How to roll back**: revert this phase's commit and rerun the registration generator.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: No OpenCode adapter in this release

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The build session |

---

<!-- ANCHOR:adr-003-context -->
### Context

The plan names five runtimes: Claude, Codex, Cursor, Devin and Pi. OpenCode adapters are plugins in a fixed folder, and Barter's OpenCode plugin also applied overlays after an edit, which the operator ruled out.

### Constraints

- No hook applies overlays after an edit.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: ship adapters for the five planned runtimes and record OpenCode as covered by `status`.

**How it works**: The coverage matrix in `.skilled/hooks/README.md` marks OpenCode `by-design` and names `/doctor:overlay status` as what reports an edit made there.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Five runtimes now | Matches the plan | OpenCode edits are caught later, not refused | 7/10 |
| Port Barter's OpenCode plugin | Six runtimes | Carries the post-edit apply the operator dropped | 2/10 |

**Why this one**: It keeps to the plan and to the ruling against a post-edit apply.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The five runtimes with pre-write events refuse an owned edit.

**What it costs**:
- An OpenCode session can edit an owned file, and `status` reports it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An OpenCode edit is lost at the next re-pin | M | `repin` refuses while an owned destination is live-edited, so the edit is captured first |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The plan names five runtimes |
| 2 | **Beyond Local Maxima?** | PASS | Two options were weighed |
| 3 | **Sufficient?** | PASS | The coverage matrix records the gap |
| 4 | **Fits Goal?** | PASS | It follows the operator's ruling |
| 5 | **Open Horizons?** | PASS | An OpenCode adapter can be added later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.skilled/hooks/README.md`: the coverage row.

**How to roll back**: revert this phase's commit and rerun the registration generator.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
