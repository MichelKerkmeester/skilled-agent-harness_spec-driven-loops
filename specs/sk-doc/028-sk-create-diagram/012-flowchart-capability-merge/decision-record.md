---
title: "Decision Record: sk-create-diagram flowchart capability merge"
description: "Architecture decisions for absorbing sk-create-flowchart's ASCII/markdown capability into sk-create-diagram as a second output format."
trigger_phrases:
  - "diagram flowchart merge decisions"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/012-flowchart-capability-merge"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "claude"
    recent_action: "Authored architecture decisions before dispatch"
    next_safe_action: "Dispatch build to GPT-5.6-luna-fast (max)"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: sk-create-diagram flowchart capability merge

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Merge flowchart formats under sk-create-diagram

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-12 |
| **Deciders** | Operator and implementation agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

`sk-create-flowchart` and `sk-create-diagram` serve overlapping workflow and decision-tree requests through separate routes. The former produces ASCII/markdown content, while the latter produces HTML/SVG diagrams. Keeping both as competing live targets creates routing ambiguity and duplicates the conceptual flowchart capability.

### Constraints

- Preserve the existing HTML/SVG flowchart type and its 27-type catalog position.
- Keep the source skill resources available for rollback and reference.
- Preserve the original ASCII validator contract and pattern content.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add an explicit `html-svg` versus `ascii-markdown` output-format dial to `sk-create-diagram`.

**How it works**: The merged skill resolves the output format before selecting an HTML/SVG type or an ASCII pattern. The existing `references/types/type-flowchart.md` remains the HTML/SVG flowchart reference, while the ported ASCII resources use `references/ascii-format/` and `assets/ascii-patterns/`.

The source skill and `/create:flowchart` command redirect to the merged diagram workflow instead of being deleted.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Format dial in one skill** | One routing owner, preserves both output grammars, explicit distinction | Requires hub and command updates | 9/10 |
| Keep both skills fully independent | Smallest immediate file change | Retains routing ambiguity and duplicated capability | 5/10 |
| Delete `sk-create-flowchart` immediately | Removes duplicate package | Higher blast radius and loses rollback content | 4/10 |
| Add `ascii-markdown` as type #28 | Simple type list extension | Collides with the existing HTML/SVG flowchart type | 3/10 |

**Why this one**: The format dial matches the operator's distinction between markdown ASCII output and HTML/SVG output. A redirect is reversible and avoids deleting shipped content before the merge is proven.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Flowchart-shaped requests have one merged routing owner.
- Authors can select ASCII/markdown or HTML/SVG without learning two overlapping skills.
- Existing HTML/SVG flowchart behavior remains separate and stable.

**What it costs**:

- Hub metadata, command assets, and manifests need synchronized updates. Mitigation: parse and integrity checks run after every projection change.
- The source skill remains as a redirectable package until an explicit deletion decision. Mitigation: document the preservation boundary and avoid treating it as a live target.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ambiguous format signal | M | Retain existing fallback behavior and ask rather than invent a format when needed. |
| Stale advisor index | H | Rebuild and validate the live advisor after JSON edits. |
| Broken relative links in the port | M | Compare source and target references and run the target validator. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator requested one skill supporting both markdown and HTML output formats. |
| 2 | **Beyond Local Maxima?** | PASS | Independent and additive alternatives were considered before choosing the format dial. |
| 3 | **Sufficient?** | PASS | The merge ports existing resources, adds routing, and avoids unrelated type rewrites. |
| 4 | **Fits Goal?** | PASS | The implementation directly joins the two overlapping flowchart workflows. |
| 5 | **Open Horizons?** | PASS | Preserved source files leave a later deletion decision reversible. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Add ASCII references, pattern assets, and the validator under `sk-create-diagram`.
- Add format-first routing to the diagram skill and command assets.
- Merge flowchart aliases into diagram routing projections while retaining the source signal.
- Redirect `sk-create-flowchart/SKILL.md` and `/create:flowchart`.

**How to roll back**: Revert the merge-scoped target skill, command, hub metadata, and packet implementation changes. The original source skill resources remain in place as the comparison and recovery baseline.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## Related Documents

- Specification: `spec.md`
- Plan: `plan.md`
- Packet root: `../spec.md`
