---
title: "Decision Record: Devin feature catalog"
description: "ADR-001: the hooks-category dormancy-status enum and why it's enforced as a content requirement rather than a schema change to create-feature-catalog."
trigger_phrases: ["devin feature catalog decision record", "hooks dormancy status enum"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/010-devin-feature-catalog"
    last_updated_at: "2026-07-24T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored ADR-001 for the dormancy-status enum"
    next_safe_action: "Resolve at implementation time, re-verifying phase 004/008's status first"
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
## ADR-001: Hooks-category dormancy-status enum: content requirement vs. schema change

### Metadata
| Field | Value |
|---|---|
| **Status** | Proposed |
| **Date** | 2026-07-24 |
| **Deciders** | claude-code (authoring), operator (approval) |

---

<!-- ANCHOR:adr-001-context -->
### Context
Phase 004 confirmed, via exhaustive live-probing, that Devin's hook system never fires under `devin -p`. Phase 008 will build 6 more adapters against the same confirmed constraint. Once `cli-devin/feature-catalog/`'s `hooks` category exists, it must never let a reader believe more coverage exists than actually does -- the exact failure mode this whole packet's "verify live, never assume" discipline exists to prevent.

`create-feature-catalog`'s own schema has no dedicated field for "this documented capability is currently non-functional pending an upstream fix." We needed to decide whether to propose a schema change to the shared skill, or enforce accuracy purely as a content requirement within the existing per-feature-file structure.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Enforce a 3-value dormancy-status enum as a mandatory content field within each `hooks` per-feature file's existing `## 2. HOW IT WORKS` section, not a schema change to `create-feature-catalog` itself.

**How it works**: Every `hooks` per-feature file states its status as exactly one of `built, confirmed dormant`, `planned, inherits the same dormancy finding`, or `status unknown, re-verify live` -- each citing a dated source (phase 004's `implementation-summary.md` Verification table, or a later re-verification). This is a content discipline enforced by `spec.md` REQ-004/REQ-005/REQ-006 and `checklist.md` CHK-013/CHK-024, not a new template field other `sk-doc` packages would need to adopt.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| **(a) Content-requirement enum [chosen]** | No shared-skill change needed; scoped entirely to this phase's own docs; reversible without touching `create-feature-catalog` | Relies on manual/spot-check discipline (CHK-024) rather than an automated schema check | 8/10 |
| (b) Propose a `create-feature-catalog` schema change (a dedicated `status:` frontmatter field) | Would be machine-checkable across the whole `sk-doc` family | Out of scope for this phase to modify a shared skill; would need its own separate proposal and buy-in beyond this packet | 4/10 |
| (c) Omit the `hooks` category until phase 008 fully lands | Avoids the accuracy problem entirely by deferring it | Leaves the catalog incomplete for the packet's single highest-scrutiny capability; contradicts the operator's explicit ask | 2/10 |

**Why this one**: Option (a) solves the immediate, real risk (overstating dormant hooks as active) without requiring authority this phase doesn't have (modifying a shared `sk-doc` skill). Option (b) is a reasonable future idea, not dismissed, but belongs to a separate, `sk-doc`-scoped proposal. Option (c) directly contradicts the operator's request that the catalog cover every hook.
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
| The enum's 3 values prove insufficient for a future, more nuanced hook state (e.g. partially working) | L | Revisit this ADR if that state actually arises; not solved speculatively now |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | Without an enforced enum, the catalog's highest-scrutiny category is exactly where an accuracy failure would do the most damage. |
| 2 | **Beyond Local Maxima?** | PASS | A shared-skill schema change (option b) was considered and correctly deferred as out of this phase's scope, not ignored. |
| 3 | **Sufficient?** | PASS | 3 values cover every state phase 004/008's actual findings can produce today. |
| 4 | **Fits Goal?** | PASS | Directly implements the operator's "mention every hook" request without misrepresenting any of them. |
| 5 | **Open Horizons?** | PASS | Revisit if a 4th state becomes real, or if a shared-skill schema change later becomes worth proposing separately. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation
**What changes**: `cli-devin/feature-catalog/hooks/*.md` (8 files, future implementation) each carry the 3-value enum in prose, cited to a dated source.

**How to roll back**: Delete the `hooks/` category folder and its root-catalog entries. No shared `create-feature-catalog` file is ever touched, so no reversal is needed there.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
