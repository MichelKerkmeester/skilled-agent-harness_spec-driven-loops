---
title: "Decision Record: Phase 1: skill-and-tag-move"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "skill and tag move decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/001-skill-and-tag-move"
    last_updated_at: "2026-11-06T07:23:08Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-skill-and-tag-move"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 1: skill-and-tag-move

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Graph edges use enhances, not siblings

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The build session |

---

<!-- ANCHOR:adr-001-context -->
### Context

The skill graph validator blocks a skill with zero edges, and it blocks a `siblings` edge whose target does not list the skill back. The first draft named `system-spec-kit` and `mcp-code-mode` as siblings, which failed nine `sk-skill` converter tests through the validator's symmetry warnings.

### Constraints

- `skill_graph_compiler.py --validate-only` treats symmetry and zero-edge warnings as errors.
- Editing `system-spec-kit` or `mcp-code-mode` graph metadata widens this phase past its scope.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: two `enhances` edges, to `system-spec-kit` at 0.4 and `mcp-code-mode` at 0.3.

**How it works**: the validator checks symmetry only for `depends_on`, `siblings` and `conflicts_with`, so an `enhances` edge needs no change in its target.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`enhances` edges** | No change outside this skill | A weaker relation than siblings | 8/10 |
| Mirrored `siblings` edges | States the peer relation | Edits two other skills' metadata | 5/10 |

**Why this one**: the commands do build on those skills' scripts, which is what `enhances` says, and nothing outside the new skill changes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The graph validator passes and the doctor suite is back to 1005 of 1005.

**What it costs**:
- The advisor's sibling boost does not link the skills. Mitigation: none needed, since the new skill ranks first for its own prompts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later validator adds an `enhances` symmetry rule | L | Rerun the validator after any advisor change |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A zero-edge skill fails the validator |
| 2 | **Beyond Local Maxima?** | PASS | Siblings were tried first and failed |
| 3 | **Sufficient?** | PASS | Two edges clear the validator |
| 4 | **Fits Goal?** | PASS | The phase needs a valid skill |
| 5 | **Open Horizons?** | PASS | A sibling pair can be added later in both skills |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.skilled/skills/system-skilled-doctor/graph-metadata.json` `edges.enhances` holds two edges, and `edges.siblings` is empty.

**How to roll back**: revert this phase's commit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

The design rulings that bind this phase are recorded in `../research/design-decisions.md`, Q001 to Q008. The build session's own answers are below.

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| OD-001 | The build packet is a new track, `specs/system-skilled-doctor/001-skill-and-overlay-build/` | Recommended option | - | The packet location |
| OD-002 | The build happens in a git worktree | Recommended option; the main checkout is shared with another session | - | `worktrees/320-system-skilled-doctor` |
| OD-003 | Job d005a is left alone | It belongs to another session's packet | - | Not carried |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **OD-001.** Question: where should the build packet go. Options: New track (Recommended), Under 003 in specs/other, Under system-speckit. Answer: "New track (Recommended)".
- **OD-002.** Question: where should the build happen. Options: Create a git worktree (Recommended), Work on current branch. Answer: "Create a git worktree (Recommended)".
- **OD-003.** Question: what to do with job d005a. Options: Leave it (Recommended), Rerun it here. Answer: "Leave it (Recommended)".
<!-- /ANCHOR:operator-answers-verbatim -->

---
