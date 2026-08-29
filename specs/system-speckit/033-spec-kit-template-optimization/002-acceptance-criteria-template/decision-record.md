---
title: "Decision Record: Acceptance Criteria Template as Packet Closure Gate"
description: "Decisions behind making acceptance-criteria.md canonical and closure-gating, and behind keeping it optional in the Level contract."
trigger_phrases:
  - "acceptance criteria decisions"
  - "ac closure adr"
  - "closure gate rationale"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/002-acceptance-criteria-template"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built the acceptance-criteria template, contract entry and closure gate"
    next_safe_action: "Execute the reference sweep and close the remaining criteria"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-033-002-acceptance-criteria-template"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Decision Record: Acceptance Criteria Template as Packet Closure Gate

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Make acceptance-criteria.md the closure gate, with ADR-backed waivers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-29 |
| **Deciders** | Operator, Claude Code |

---

<!-- ANCHOR:adr-001-context -->
### Context

Acceptance criteria were authored in two places and owned by neither: a column in the `spec.md` requirements table and prose blocks under user stories, traced separately in `checklist.md`. The `AC_COVERAGE` rule shipped by phase 001 could only count table cells and reported at INFO, so a packet could be declared complete with criteria that were never met and never consciously dropped.

### Constraints

- 2,588 existing Level 2/3/3+ packets must not begin failing validation.
- `check-files.sh` resolves required documents from the Level contract and has no notion of a packet's age.
- Level 1 has no acceptance-criteria document, so it cannot lose its inline criteria.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `acceptance-criteria.md` is the canonical home for acceptance criteria at Levels 2, 3 and 3+, and the `AC_CLOSURE` rule decides whether the packet may close.

**How it works**: The gated template renders only at Levels 2, 3 and 3+. A packet is closeable when every criterion is `Met`, `Waived` or `Superseded`; a waived or superseded row must name an ADR that exists in `decision-record.md`. Unmet rows block only a packet that claims completion, so work in progress is unaffected.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical document plus closure rule** | One place to look; the gate can verify waivers | Requires a new rule and a migration story | 9/10 |
| Keep criteria in spec.md, add a closure ledger | Lower template churn | The same criterion lives in two files and drifts | 5/10 |
| Promote AC_COVERAGE from INFO to ERROR | No new document | Still counts table cells; no waiver concept at all | 3/10 |

**Why this one**: only a dedicated document can carry a status and a waiver per criterion, which is what makes the gate checkable rather than advisory.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- "Complete" becomes a claim about criteria rather than about a ticked checklist.
- Dropping a criterion leaves a written trace instead of vanishing silently.
- `AC_COVERAGE` counts a real denominator instead of inferring one from table cells.

**What it costs**:
- Every new Level 2/3/3+ packet carries one more document. Mitigation: it is scaffolded, and it replaces content that used to be duplicated across `spec.md` and `checklist.md`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The gate fires across the existing tree | H | Dated cutoff; an unreadable date degrades to advisory |
| Waivers become a rubber stamp | M | The cited ADR must exist; a dangling reference fails |
| Level 1 loses acceptance criteria | M | The column is gated per level, not deleted |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A packet could be closed with unmet criteria; AC_COVERAGE was INFO-only by design |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed above; the cheapest was rejected for being uncheckable |
| 3 | **Sufficient?** | PASS | One template, one rule, one contract entry; no new grandfathering mechanism |
| 4 | **Fits Goal?** | PASS | The packet exists to make the template contract carry its weight |
| 5 | **Open Horizons?** | PASS | The cutoff is an env-overridable constant, so the rollout can be widened later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `templates/addons/acceptance-criteria.md.tmpl` gated to Levels 2, 3 and 3+.
- `templates/spec-kit-docs.json` gains the document, its version and its section gates.
- `scripts/rules/check-ac-closure.sh` plus its `validator-registry.json` entry.
- `scripts/rules/check-ac-coverage.sh` counts from the canonical document.
- `templates/core/spec.md.tmpl` drops the acceptance-criteria column above Level 1.

**How to roll back**: set `SPECKIT_AC_CLOSURE=false` to disable the gate without touching files; to remove it entirely, delete the registry entry and `check-ac-closure.sh`, drop `acceptance-criteria.md` from `optionalAddonDocs` and its `sectionGates`, and revert the two template edits.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep the document optional in the Level contract and let AC_CLOSURE own presence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-29 |
| **Deciders** | Operator, Claude Code |

---

<!-- ANCHOR:adr-002-context -->
### Context

The goal prompt specified listing `acceptance-criteria.md` in `requiredAddonDocs` for Levels 2, 3 and 3+, on the reasoning that `check-files.sh` would then enforce it without a new presence rule. Reading the resolver showed `docs()` returns `requiredCoreDocs` plus `requiredAddonDocs` and that `FILE_EXISTS` hard-errors on any missing entry, with no cutoff awareness anywhere in that path.

### Constraints

- Decision D3 froze the rollout as forward-only with no backfill.
- 2,588 existing packets sit at the affected levels.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: list the document under `optionalAddonDocs` and let `AC_CLOSURE` own its presence, because that rule is cutoff-aware and `FILE_EXISTS` is not.

**How it works**: `FILE_EXISTS` stays silent about the document. `AC_CLOSURE` fails a post-cutoff packet that lacks it and reports INFO for a pre-cutoff one.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Optional entry, AC_CLOSURE owns presence** | Honors D3 exactly; one cutoff-aware owner | Diverges from the goal's literal wording | 9/10 |
| requiredAddonDocs plus cutoff logic in check-files.sh | Matches the goal's wording | Teaches packet age to a shared rule every packet runs | 4/10 |
| requiredAddonDocs as written | Simplest edit | Fails 2,588 packets immediately; violates D3 | 1/10 |

**Why this one**: D3 is a frozen decision and the goal's item 2 was an implementation hint whose stated rationale — that no new rule was needed — no longer held once the closure rule existed.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Existing packets are untouched, which is what D3 asked for.
- One rule owns both presence and content, so the cutoff is applied in a single place.

**What it costs**:
- Reading `spec-kit-docs.json` alone no longer tells you the document is mandatory. Mitigation: `validation-rules.md` and both level tables state the requirement.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader assumes "optional" means truly optional | M | The Level tables and the rule documentation both say otherwise |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The literal instruction would have broken 2,588 packets |
| 2 | **Beyond Local Maxima?** | PASS | Three placements weighed |
| 3 | **Sufficient?** | PASS | No change to the shared file-presence rule |
| 4 | **Fits Goal?** | PASS | Serves D3, which outranks the item-2 hint |
| 5 | **Open Horizons?** | PASS | Promotion to requiredAddonDocs stays available once the tree has caught up |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `spec-kit-docs.json` lists the document under `optionalAddonDocs` for Levels 2, 3 and 3+.
- `check-ac-closure.sh` fails a post-cutoff packet that is missing it.

**How to roll back**: move the entry from `optionalAddonDocs` to `requiredAddonDocs` once every live packet carries the document, and delete the presence branch from the rule.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
