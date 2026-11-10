---
title: "Decision Record: Exempt loader and doc rewrite guard"
description: "The decisions behind one exempt loader, a separate pinned list, one rewrite guard with hard and advisory tiers, and the DESIGN.md format spec staying a validator skip."
trigger_phrases:
  - "exempt loader decision"
  - "pinned list decision"
  - "doc rewrite guard decision"
  - "format spec validator skip"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard"
    last_updated_at: "2026-11-05T11:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the three phase decisions"
    next_safe_action: "Keep each ADR in step with plan.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Exempt loader and doc rewrite guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One guard script with hard and advisory tiers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-05 |
| **Deciders** | Orchestrator, operator |

---

### Context

The readability program used seven separate scratch tools to catch a rewrite that changed what a doc says. A refinement step that asks for seven commands gets skipped.

### Constraints
- A form-only rewrite moves and splits lines on purpose, so line loss alone cannot block.
- The guard has to run from a plain repository checkout with the standard library.

---

### Decision

**Summary**: Ship one `shared/scripts/doc-rewrite-guard.py --base <ref> [paths]`.

**Details**: Frontmatter beyond `version`, fenced blocks, citations, cited anchors and numbered sections, and exempt or pinned docs are hard checks that set exit code 1. Lost lines and intro changes are advisory and never change the exit code.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One guard, two tiers** | One step, one exit code | Advisory lines can be ignored | 8/10 |
| Ship the seven tools as they are | Already written | Seven entry points, duplicated diff logic | 3/10 |

**Why Chosen**: one command is the step people run, and the hard tier covers the change classes a reviewer had to catch by hand.

---

### Consequences

**Positive**:
- The Update Workflow and creation-workflow name one command.

**Negative**:
- Advisory output can be skipped - Mitigation: both workflow steps say to read every advisory line before commit.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| A hard check flags a legitimate rewrite | M | The finding names its rule, so the author can keep the claim and rewrite around it |

---

### Implementation

**Affected Systems**:
- `shared/scripts/doc-rewrite-guard.py` and its tests
- `sk-create-skill/references/skill/examples-and-maintenance.md` and `creation-workflow.md`

**Rollback**: revert the phase commit; no other script imports the guard.

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Pinned is a list, not an exempt entry

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-05 |
| **Deciders** | Operator |

---

### Context

The operator decided that docs whose strings a code check pins are protected from rewrites while their render checks still run.

### Constraints
- The exempt map hides render findings, which the operator ruled out for pinned docs.

---

### Decision

**Summary**: Add a `pinned` list to the render ledger, separate from the exempt map.

**Details**: The validator ignores the list, so pinned docs keep every render finding. The rewrite guard refuses any change to a pinned doc. `render_exempt.py` validates both lists with the same rules.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate pinned list** | Render checks still run | Two lists to keep | 8/10 |
| Pinned docs in the exempt map | One list | Hides their render findings | 2/10 |

**Why Chosen**: it matches the operator's ruling and keeps the findings visible.

---

### Consequences

**Positive**:
- `code-quality-standards.md` and `review-core.md` cannot be rewritten by accident.

**Negative**:
- A pinned doc's render findings can only be fixed through an operator-approved path - Mitigation: the guard names the pinning check, so the author knows whom to ask.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| A pinned doc is missing from the list | M | `--scan-pinned` lists literal reads; the list stays the record |

---

### Implementation

**Affected Systems**:
- `render-known-debt.json` `pinned`
- `render_exempt.py` and `doc-rewrite-guard.py`

**Rollback**: delete the `pinned` key; the loader treats a missing key as an empty list.

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The DESIGN.md format spec stays a validator skip

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-05 |
| **Deciders** | Operator |

---

### Context

The plan moved both of the validator's hard-coded skips into the exempt map. An exempt entry must name a consumer file that names the doc. The two Style Reference DESIGN.md files have one in `apply-design-md.cjs`. The five files in `FORMAT_SPEC_FILES`, `design-md-format.md` and four example DESIGN.md files, have no code consumer: they are skipped because other docs cite their section numbers as the format's ids.

### Constraints
- The consumer rule must stay strict, or a stale or invented entry would exempt a doc.

---

### Decision

**Summary**: Keep the five format-spec files as a validator skip and move only the two Style Reference files into the exempt map.

**Details**: The operator chose this on 2026-11-05. AC-001 named `FORMAT_SPEC_FILES` as removed, so it is superseded by AC-014, which checks the list holds only those five files.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the validator skip** | Consumer rule stays strict | A second home for docs no code reads | 8/10 |
| Allow a doc as a consumer | One mechanism | A consumer no longer has to be code | 4/10 |
| Validate the five files normally | No skip at all | Renumbers sections other docs cite by number | 2/10 |

**Why Chosen**: it keeps the rule that makes an exempt entry trustworthy and leaves the format's section ids alone.

---

### Consequences

**Positive**:
- Every exempt entry is backed by code that names its doc.

**Negative**:
- `FORMAT_SPEC_FILES` remains a second list - Mitigation: its comment states why each file is there.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| A new format-spec file is added without the list | L | The validator then reports its numbering, which is visible |

---

### Implementation

**Affected Systems**:
- `validate_document.py` `FORMAT_SPEC_FILES` and `should_exclude_path`
- `render-known-debt.json` Style Reference entries

**Rollback**: none needed; the skip is the state before this phase.

<!-- /ANCHOR:adr-003 -->
