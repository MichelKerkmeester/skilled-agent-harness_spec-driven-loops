---
title: "Decision Record: Narrow exceptions for documentation gate remediation"
description: "Records how the global link guard distinguishes active broken links from intentional fixtures and future-copy template placeholders."
trigger_phrases:
  - "link guard exception decision"
  - "intentional fixture exclusion"
  - "template placeholder allowlist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/007-fix-post-closeout-gates-for-readme-fleet"
    last_updated_at: "2026-08-05T08:05:14Z"
    last_updated_by: "phase-executor"
    recent_action: "Recorded narrow-exception decision"
    next_safe_action: "Apply the classification matrix to each finding"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-fix-post-closeout-gates-for-readme-fleet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Narrow exceptions for documentation gate remediation

<!-- SPECKIT_LEVEL: 3 -->

---
<!-- ANCHOR:adr-001 -->
## ADR-001: Preserve the link guard's signal with narrow exceptions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-05 |
| **Deciders** | Repository maintainer and phase executor |

---
<!-- ANCHOR:adr-001-context -->
### Context

The global Markdown link guard reports 96 unresolved references. Some are active documentation defects. Others occur in deliberately invalid test fixtures or templates that name artifacts a future consumer will create. Treating every report as a source-document repair would corrupt test inputs and turn templates into misleading static packages. Ignoring broad directories would hide real defects.

### Constraints

- The guard must remain strict for all active skill, command, and agent documentation.
- Negative fixtures must retain invalid targets so their owning tests still exercise failure handling.
- Template exceptions must be auditable at the source-reference level.
- Real links must resolve from the source directory or repository root.
<!-- /ANCHOR:adr-001-context -->

---
<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Correct real source links, exclude only named test-fixture path classes, and allowlist only exact template placeholder pairs.

**How it works**: The baseline matrix assigns an action class to every finding. Active documents receive corrected targets. A fixture stays intentionally invalid only if it lives in a recognized fixture tree. A template placeholder receives an exact `(source file, raw reference)` allowlist entry only when copying the template requires the consumer to create that target.
<!-- /ANCHOR:adr-001-decision -->

---
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|------:|
| **Correct targets with narrow exceptions** | Preserves real guard coverage and fixture semantics | Requires a classification pass | 10/10 |
| Rewrite every unresolved reference | Fewer policy entries | Corrupts negative fixtures and future-copy templates | 2/10 |
| Exclude all template directories | Quick to implement | Hides new real template defects | 3/10 |
| Disable the global guard | Removes noise | Removes the verification signal entirely | 0/10 |

**Why this one**: The selected policy preserves the guard's stated promise. It fixes active documentation while keeping only evidence-backed exceptions visible in code review.
<!-- /ANCHOR:adr-001-alternatives -->

---
<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- A green global guard means active documentation links resolve.
- Negative fixture payloads continue to test invalid-link behavior.
- Template exceptions are reviewable as individual source-reference pairs.

**What it costs**:

- The guard configuration gains a small maintained exception list. Mitigation: every entry requires a recorded reason and a full guard rerun.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An exception hides an active defect | High | Limit it to a fixture class or exact pair and review the resolved target matrix |
| A future template change adds an unlisted placeholder | Low | The guard fails until a reviewer classifies the new reference |
| A repaired link targets the wrong duplicate filename | Medium | Resolve from the source directory and inspect the intended destination |
<!-- /ANCHOR:adr-001-consequences -->

---
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The global link guard currently fails with 96 reports. |
| 2 | **Beyond Local Maxima?** | PASS | The matrix considers repairs, exact allowlists, and fixture exclusions. |
| 3 | **Sufficient?** | PASS | It fixes active defects without widening validation blind spots. |
| 4 | **Fits Goal?** | PASS | Restoring gate trust is the direct post-closeout objective. |
| 5 | **Open Horizons?** | PASS | Exact exceptions make future deviations visible rather than silently accepted. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---
<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- The link guard receives only verified fixture exclusions and exact template allowlist pairs.
- Source documents receive corrected relative paths when their target should exist today.
- Version gaps and CLI README navigation are corrected in their owning documents.

**How to roll back**: Restore the failed file group with `git restore -- <paths>`, rerun the scoped check, and then rerun the global guard before trying a narrower correction.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
