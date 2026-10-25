---
title: "Decision Record: Phase 3: review-remediation"
description: "Two operator rulings of 2026-10-25: split the sk-code-quality P0 floor into a surface-neutral baseline and a JavaScript and CSS overlay, and build no review profile."
trigger_phrases:
  - "review remediation decision record"
  - "quality floor split"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research/003-review-remediation"
    last_updated_at: "2026-10-25T18:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the floor split and the no-profile ruling"
    next_safe_action: "None. The phase is closed"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 3: review-remediation

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Split the quality P0 floor into a baseline and a web overlay

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | The operator, relayed by the orchestrating session |

---

<!-- ANCHOR:adr-001-context -->
### Context

Research rank 1 of phase 1 found that `sk-code-quality` always loaded `overview-header-and-comments.md`, a web house style whose P0 items include a 67-character header and IIFE wrapping. Those items bound every `.js` or `.css` file, including this repository's ESM modules, where IIFE wrapping conflicts with the skilled JavaScript checklist. The deep review left the choice to the operator.

### Constraints

- The P0-blocks-completion rule stays.
- `RESOURCE_MAP["QUALITY"]` stays as it is.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to load the surface-neutral `../sk-code-skilled/assets/checklists/universal-checklist.md` on every pass, and the two house-style checklists only for a `.js` or `.css` target.

**How it works**: in `sk-code-quality/SKILL.md` the ALWAYS row, `DEFAULT_RESOURCE`, workflow step 3, ALWAYS rule 2 and the success criterion name the universal checklist. A new CONDITIONAL row loads `overview-header-and-comments.md` and `naming-init-formatting-and-css.md` for a `.js` or `.css` target. CQ-001's `expected_resources` follows `DEFAULT_RESOURCE`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Split the floor** | House-style P0 items bind only the files they fit | `leaf-manifest.json` needs a regeneration | 8/10 |
| Keep the current floor | No change | ESM files keep failing a P0 item that does not apply | 3/10 |

**Why this one**: the operator chose it, and the universal baseline already existed, so the split is mostly a pointer swap.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A non-web file no longer meets web P0 items by default.

**What it costs**:
- The hub's derived `leaf-manifest.json` is stale until it is regenerated. Mitigation: the orchestrator regenerates it, because another worker owns the hub derived files.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A `.js` or `.css` target is missed and loads only the baseline | M | The CONDITIONAL row names the file extensions plainly |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research rank 1 and the review's section 7a |
| 2 | **Beyond Local Maxima?** | PASS | Keeping the floor was weighed above |
| 3 | **Sufficient?** | PASS | Five pointer edits and one new row |
| 4 | **Fits Goal?** | PASS | It makes the mode more repo-agnostic |
| 5 | **Open Horizons?** | PASS | A surface can add its own CONDITIONAL rows later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `sk-code-quality/SKILL.md` (version 1.3.0.0), `README.md`, `changelog/v1.3.0.0.md` and the CQ-001 scenario.
- Research rank 1 in phase 1 is marked closed.

**How to roll back**: restore the five pointers to `overview-header-and-comments.md`, drop the CONDITIONAL row and the changelog entry, and restore CQ-001's first `expected_resources` entry.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Build no review profile

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | The operator, relayed by the orchestrating session |

---

<!-- ANCHOR:adr-002-context -->
### Context

Review research ranks 1, 3 and 5 proposed one repo-owned review profile carrying raise-only severity overrides, added checks, surface evidence and a never-skip list. Section 7a of the deep review left its path, schema, precedence and owner to the operator.

### Constraints

- No floor may be weakened by any extension.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: no review profile.

**How it works**: repository-specific risk comes in through sk-code surface or stack evidence. Barter's coder repository already covers its terraform and backend risk that way without forking review. The `### Extension Floors` section in `sk-code-review/SKILL.md` says what no extension may weaken. The section 9.3 depth alias now states its order as environment over default, because no config layer exists.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No profile** | No new schema, loader or precedence rule | A repository cannot raise severity in one file | 8/10 |
| Build the profile | One place for repository review policy | A schema and a loader with no repository asking for them | 4/10 |

**Why this one**: surface evidence already carries repository risk, and the floors already bound what an extension may do.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Review research ranks 1, 3 and 5 close as decided rather than deferred.

**What it costs**:
- A repository with review policy that no surface expresses has no home for it. Mitigation: the reopen trigger below.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A repository forks the review checklists instead | M | Reopen trigger: a repository edits its own copy of sk-code-review's checklists, its severity table or the section 9.2 never-skip taxonomy. If it reopens, copy sk-git's pattern: a repo-root `.sk-git/` style folder plus a git config key, managed by `/doctor:sk-code`, with the environment over the file and the floors over both |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Section 7a needed a ruling |
| 2 | **Beyond Local Maxima?** | PASS | Building the profile was weighed above |
| 3 | **Sufficient?** | PASS | The floors and surface evidence cover the stated needs |
| 4 | **Fits Goal?** | PASS | The mode stays repo-agnostic without a new file format |
| 5 | **Open Horizons?** | PASS | The reopen trigger and the pattern to copy are named |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `sk-code-review/SKILL.md` section 9.3 reads `resolved env > default`.
- The phase 2 open question, its ranked section and the review report section 7a record the decision.

**How to roll back**: reopen ranks 1, 3 and 5 in the phase 2 research and restore `config` in section 9.3 once a config layer exists.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
