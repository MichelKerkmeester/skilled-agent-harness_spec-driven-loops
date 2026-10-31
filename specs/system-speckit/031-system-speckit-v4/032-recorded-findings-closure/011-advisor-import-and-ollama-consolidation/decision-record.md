---
title: "Decision Record: Advisor import and Ollama consolidation"
description: "Why the advisor suite criterion is waived for four failures that predate this child, and where each one is routed to be fixed."
trigger_phrases:
  - "advisor suite waiver"
  - "pre-existing advisor failures"
  - "memory save bridge stale"
  - "settings parity regex"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/011-advisor-import-and-ollama-consolidation"
    last_updated_at: "2026-09-07T21:40:00Z"
    last_updated_by: "implementation-session"
    recent_action: "Recorded the waiver for the advisor suite criterion"
    next_safe_action: "Fix the routed failures in children 014 and 016"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implementation-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Advisor import and Ollama consolidation

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Waive the whole-suite criterion for four failures this child did not cause

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-07 |
| **Deciders** | implementation session, under the parent program's decision D5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

Criterion AC-002 says the advisor's own test suite passes after the merge. It ran to completion and thirteen assertions in four files failed. None of the four touches embeddings, the Ollama transport or a `@spec-kit/shared` specifier, and each fails against files this child never edited: two tests still bridge the retired `/memory:save` command in `lib/scorer/projection.ts` and count 21 metadata entries where 20 are expected; one test asserts the Claude hook command path under `mcp-server/dist/hooks/claude/` while `.claude/settings.json` has pointed at `runtime/dist/hooks/claude/` since the hooks moved; and three daemon job-semantics assertions failed once and passed on a rerun. Every suite this change touches passes: golden prompts, factory parity, the new specifier test and the shared package's own suite.

### Constraints

- Scope is frozen to the advisor's specifiers and the two Ollama implementations; `projection.ts`, the hook registration files and the daemon tests belong to other children.
- The parent program's decision D5 forbids deferring a row without a named owner.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Waive AC-002 for the four pre-existing failures and route each to the child whose scope owns the surface.

**How it works**: The stale `/memory:save` bridge and the metadata count go to child 016, whose charter is the cross-session operator items. The settings-parity regex goes to child 014, which regenerates the hook registration files and owns their tests. The job-semantics flake is re-run under child 016 and recorded either way. Each child's task list carries the item by name.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive and route to the owning children** | Scope stays frozen; every failure has a named fix | The suite stays red until 014 and 016 land | 8/10 |
| Fix all four inside this child | Suite green now | Edits three surfaces outside the frozen scope in one commit | 4/10 |
| Mark AC-002 Met with a note | Nothing to write | The criterion says the suite passes, and it does not | 1/10 |

**Why this one**: A criterion that fails for reasons outside the change should not be silently marked Met, and the fixes belong where their surfaces are edited anyway.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The four failures are named, attributed and owned instead of hidden behind a green checkbox.
- Children 014 and 016 gain concrete, already-diagnosed tasks.

**What it costs**:
- The advisor suite reports failures until those children land. Mitigation: the routed tasks are the next items in the program's order.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A routed child closes without fixing its item | M | Each item is a numbered task in that child's list, and the parent map names the waiver |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The suite fails and the criterion cannot honestly be Met |
| 2 | **Beyond Local Maxima?** | PASS | Fixing in place and marking Met were both weighed |
| 3 | **Sufficient?** | PASS | One record, three routed tasks |
| 4 | **Fits Goal?** | PASS | Every finding still gets fixed inside the program |
| 5 | **Open Horizons?** | PASS | The owning children edit those surfaces anyway |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `014-registration-schema-unification/tasks.md` gains the settings-parity regex task.
- `016-cross-session-operator-items/tasks.md` gains the `/memory:save` bridge removal, the metadata count and the job-semantics rerun.

**How to roll back**: Delete this record, set AC-002 back to Unmet, and remove the three routed tasks; the failures then block this child until fixed here.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
