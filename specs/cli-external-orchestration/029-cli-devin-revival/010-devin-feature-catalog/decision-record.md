---
title: "Decision Record: Devin feature catalog"
description: "ADR-001: the hook evidence-state set and why it is enforced as a content requirement rather than a shared create-feature-catalog schema change."
trigger_phrases: ["devin feature catalog decision record", "hook evidence state"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/010-devin-feature-catalog"
    last_updated_at: "2026-07-24T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected ADR-001 to use event-specific evidence states"
    next_safe_action: "Re-run the corrected-schema matrix at implementation time if runtime version changed"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Devin feature catalog

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Hook evidence-state set: content requirement vs. schema change

### Metadata
| Field | Value |
|---|---|
| **Status** | Proposed |
| **Date** | 2026-07-24 |
| **Deciders** | claude-code (authoring), operator (approval) |

---

<!-- ANCHOR:adr-001-context -->
### Context
The corrected registration schema produced six lifecycle events under `devin -p`, while `PermissionRequest` and `PostCompaction` remain unobserved or empty. The catalog must preserve those event-specific distinctions instead of flattening every adapter to active or dormant.

`create-feature-catalog`'s own schema has no dedicated field for "this documented capability is currently non-functional pending an upstream fix." We needed to decide whether to propose a schema change to the shared skill, or enforce accuracy purely as a content requirement within the existing per-feature-file structure.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Enforce a 3-value evidence-state set as a mandatory content field within each hook file's existing `## 2. HOW IT WORKS` section, not a shared schema change.

**How it works**: Every hook file states exactly one of `observed live`, `registered, unobserved` or `no adapter, explicit empty registration`, cites dated evidence and preserves adapter-specific caveats. `spec.md` and `checklist.md` enforce the discipline without changing shared templates.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| **(a) Content-requirement state set [chosen]** | No shared-skill change; scoped to this catalog and reversible | Relies on manual evidence checks rather than a schema validator | 8/10 |
| (b) Propose a `create-feature-catalog` schema change (a dedicated `status:` frontmatter field) | Would be machine-checkable across the whole `sk-doc` family | Out of scope for this phase to modify a shared skill; would need its own separate proposal and buy-in beyond this packet | 4/10 |
| (c) Omit the `hooks` category until phase 008 fully lands | Avoids the accuracy problem entirely by deferring it | Leaves the catalog incomplete for the packet's single highest-scrutiny capability; contradicts the operator's explicit ask | 2/10 |

**Why this one**: Option (a) prevents both false-live and false-dormant claims without modifying a shared skill. Option (b) remains a separate `sk-doc` proposal; option (c) would leave the requested catalog incomplete.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The `hooks` category can exist and be complete (8/8 events) without ever misrepresenting coverage, satisfying the operator's request without waiting for phase 008 to fully land.

**What it costs**:
- Accuracy depends on a manual spot-check (CHK-024) at catalog-authoring time and at any future re-verification, not an automated schema-level guarantee.

**Risks**:
| Risk | Impact | Mitigation |
|---|---|---|
| A future editor of the catalog changes a `hooks` entry's status without re-verifying live | M | CHK-024 requires the cross-check every time the catalog is touched, not just at initial authoring |
| The 3 states prove insufficient for a future partial event state | L | Revisit only when that state is observed. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | Without an enforced enum, the catalog's highest-scrutiny category is exactly where an accuracy failure would do the most damage. |
| 2 | **Beyond Local Maxima?** | PASS | A shared-skill schema change (option b) was considered and correctly deferred as out of this phase's scope, not ignored. |
| 3 | **Sufficient?** | PASS | The 3 values cover every state in the corrected event matrix. |
| 4 | **Fits Goal?** | PASS | Directly implements the operator's "mention every hook" request without misrepresenting any of them. |
| 5 | **Open Horizons?** | PASS | Revisit if a 4th state becomes real, or if a shared-skill schema change later becomes worth proposing separately. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation
**What changes**: `cli-devin/feature-catalog/hooks/*.md` (8 future files) each carry the 3-value evidence state in prose and cite a dated source.

**How to roll back**: Delete the `hooks/` category folder and its root-catalog entries. No shared `create-feature-catalog` file is ever touched, so no reversal is needed there.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
