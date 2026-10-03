---
title: "Decision Record: Phase 3: update"
description: "The split renamed the workflow the audit inventoried, so AC-001 is recorded as superseded rather than left describing a file that no longer exists."
trigger_phrases:
  - "doctor update split decision"
  - "doctor-update yaml superseded"
  - "release updater over rebuild"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/003-update"
    last_updated_at: "2026-10-02T23:12:59Z"
    last_updated_by: "implementation"
    recent_action: "ADR-001 recorded: AC-001 superseded by the command split"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - "specs/system-speckit/048-doctor-command-audit/003-update/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-003-update"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 3: update

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Supersede the pre-split inventory criterion through the command split

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-02 |
| **Deciders** | The operator widened this phase from an audit to a redesign. The settled design in `scratch/design.md` and decision record DR-Q4-001 in `research/research.md` section 9 carry the decision; the operator may overturn it. |

---

<!-- ANCHOR:adr-001-context -->
### Context

This phase opened as an audit of `/doctor:update`, then a database rebuild whose workflow lived in `.skilled/commands/doctor/assets/doctor-update.yaml`. AC-001 required `scratch/reality-check.md` to list every path, script, command, flag and environment variable that the route and that workflow named, each marked present, moved or missing with the command that showed it. The audit was completed, and it is the evidence the verdict rests on.

The verdict then grew into a redesign. The rebuild's mutation boundary forbids writes to skill bodies and its rollback rests on VACUUM snapshots, so it cannot host a release apply. The split moved the rebuild to `/doctor:rebuild` and renamed its workflow to `doctor-rebuild.yaml`, while `/doctor:update` became the release-aware updater whose bare invocation runs the read-only check. After that, the criterion's subject pairing no longer exists: the route no longer names `doctor-update.yaml`, and `doctor-update.yaml` no longer exists.

### Constraints

- The audit evidence is real and the verdict rests on it; rewriting or deleting `scratch/reality-check.md` would discard the record behind the decision.
- Criterion ids are stable once written. AC-001 cannot be renumbered or redefined in place.
- A reader meeting this criterion after the split must not read it as a description of the current tree.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: record AC-001 as `Superseded`, citing this record, and keep `scratch/reality-check.md` as the audit evidence behind the verdict.

**How it works**: the acceptance table points here for the reason, and its verification cell names the audit file and the rename that retired the criterion's subject. A reader who wants the pre-split inventory can still read it; a reader checking the current tree follows `/doctor:rebuild` and `doctor-rebuild.yaml` instead.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record AC-001 as superseded** | Keeps the audit as history, states plainly that the subject moved, keeps the closure gate honest | The criterion no longer reads as a task someone can re-run | 9/10 |
| Reword AC-001 to point at `doctor-rebuild.yaml` | The row would describe the current tree | Rewrites a criterion whose evidence was gathered against the pre-split file and hides the rename | 5/10 |
| Mark AC-001 `Met` | The quietest close | Claims a criterion still describes the tree when its subject moved; a reader looking for `doctor-update.yaml` finds nothing | 2/10 |
| Delete AC-001 | A shorter table | Discards the audit trail and breaks the stable-id rule | 1/10 |

**Why this one**: the criterion was satisfied as an audit and retired as a description of the current tree. Recording the supersession says both things instead of pretending one of them away.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive:**
- The audit stays readable as history, and the closure gate sees a backed supersession rather than an unbacked waiver.
- A reader checking the current tree is pointed at the split decision (DR-Q4-001) and the renamed workflow.

**Negative:**
- The criterion no longer describes an action anyone can rerun against the current tree.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->
