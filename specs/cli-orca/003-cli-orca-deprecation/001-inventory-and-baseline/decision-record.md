---
title: "Decision Record: Phase 1: inventory-and-baseline"
description: "Why the cli-orca removal runs as four phases, what stays as history, and the operator answers that fixed its scope."
trigger_phrases:
  - "cli orca deprecation decisions"
  - "cli orca removal operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-orca/003-cli-orca-deprecation/001-inventory-and-baseline"
    last_updated_at: "2026-11-24T10:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the phasing decision and the operator answers"
    next_safe_action: "Operator review, then commit and merge the worktree branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-orca-deprecation-001-inventory-and-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove cli-orca completely, including its changelog folder"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

# Decision Record: Phase 1: inventory-and-baseline

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Run the removal as a four-phase packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Operator, claude-opus-5-5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

`recommend-level.sh --loc 400 --files 45 --architectural` printed Level 2 with a phase score of 30 out of 50. The phase rule in `phase-definitions.md` section 2 also needs Level 3, so the tool recommended no phases. The operator asked for the removal to follow the earlier multi-phase skill deprecations, and the closest one, the Hermes removal, ran at the same scale as three phases.

### Constraints

- An explicit operator instruction outranks a rule file's default.
- Each phase must still validate on its own.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a phase parent with four Level 2 children: inventory and baseline, runtime code and tests, docs and registries with the deletion, regeneration and proof.

**How it works**: Each child holds one kind of change and one handoff check, so a failing check points at one phase.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four phases** | Matches the operator's ask and the Hermes precedent; one check per phase | More packet docs than one Level 2 folder | 8/10 |
| One Level 2 packet | What the level tool recommends | Ignores the operator's ask | 4/10 |
| Six phases with a deep-research run, like sk-vision | Deepest inventory | sk-vision touched about 300 files; this touches about 25, so an `rg` inventory covers it | 3/10 |

**Why this one**: It follows the operator's instruction at the size the work needs.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Each phase has its own baseline-to-after check.

**What it costs**:
- Four sets of packet docs. Mitigation: the children stay short.

| Risk | Impact | Mitigation |
|------|--------|------------|
| A validator rule expects phases only at Level 3 | L | `validate.sh --recursive --strict` is the gate, and it is run on the parent |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator asked for the phased workflow |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes compared above |
| 3 | **Sufficient?** | PASS | Four phases, no research phase |
| 4 | **Fits Goal?** | PASS | Every phase removes or proves removal |
| 5 | **Open Horizons?** | PASS | Same shape as the Hermes and sk-vision removals |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `specs/cli-orca/003-cli-orca-deprecation/` and its four children.

**How to roll back**: Delete the packet folder before merge, or `git revert` the merge commit after it.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The packet lives at `specs/cli-orca/003-cli-orca-deprecation`. | Not stated. | none | ../spec.md |
| Q002 | The work runs in a new git worktree. | Not stated. | none | ../spec.md |
| Q003 | Full removal, including `.skilled/changelog/cli-orca`; `specs/` and released changelogs stay. | Not stated. | none | ../spec.md |
| Q004 | The reason is low use against steady upkeep. | Not stated. | none | ../spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

### Q001

Question:
```text
Gate 3 (AGENTS.md §2): where should the cli-orca deprecation packet live?
```

Answer:
```text
C) specs/cli-orca/003-cli-orca-deprecation (Recommended)
```

### Q002

Question:
```text
Git workspace (AGENTS.md §5 requires your choice): main currently has another session's staged mcp-browser-use changes. Where should the removal run?
```

Answer:
```text
A) Create a git worktree (Recommended)
```

### Q003

Question:
```text
How complete should the removal be?
```

Answer:
```text
Full removal incl. changelog dir
```

### Q004

Question:
```text
Why is cli-orca being deprecated? This goes in the problem statement.
```

Answer:
```text
Unused / upkeep cost
```
<!-- /ANCHOR:operator-answers-verbatim -->
