---
title: "Decision Record: Template Compliant Level 3 Fixture [template:examples/level_3/decision-record.md]"
description: "Current-template Level 3 decision record fixture."
trigger_phrases:
  - "fixture"
  - "decision record"
  - "level 3"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/scripts/test-fixtures/063-template-compliant-level3"
    last_updated_at: "2026-06-11T00:00:00Z"
    last_updated_by: "validator-fixture"
    recent_action: "Regenerated the Level 3 decision record fixture"
    next_safe_action: "Run strict validation for fixture 063"
---
# Decision Record: Template Compliant Level 3 Fixture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Level 3 for Clean High-Coverage Fixture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-11 |
| **Deciders** | Validator Fixture Maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The validator needs a clean fixture that exercises the highest standard documentation level without requiring Level 3+ governance sections. Fixture 063 already owns Level 3 compliance coverage, but its content had drifted from current templates.

### Constraints
- Must pass strict validation with no errors.
- Must remain separate from intentional warning fixtures.
- Must include concrete evidence in checklist and implementation summary files.
- Must stay scoped to static markdown fixtures.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Use Level 3 as the clean high-coverage validator fixture level.

**Details**: Fixture 063 will include the six standard Level 3 markdown files and align each one to the current template header and anchor contract. Level 3+ governance sections remain out of scope, while intentional warning behavior remains in fixture 054.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Level 3 clean fixture** | Exercises decision records, L2 addenda, and L3 addenda | More files to maintain | 9/10 |
| Level 2 clean fixture only | Smaller fixture | Misses decision-record and L3 checks | 5/10 |
| Level 3+ clean fixture | Maximum governance coverage | Requires sections not needed for standard validation | 4/10 |

**Why Chosen**: Level 3 provides the broadest standard template coverage while staying lean enough for deterministic validator tests.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Strict validation has a clean Level 3 example.
- Decision-record validation has an accepted ADR example.
- Consuming tests can distinguish clean and intentionally broken fixtures.

**Negative**:
- Six markdown files must be refreshed when Level 3 templates change. Mitigation: keep template source comments and anchors explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Template changes break fixture | M | Regenerate from current templates |
| Fixture becomes too verbose | L | Keep content concrete but concise |
| Warning behavior leaks into clean fixture | M | Keep fixture 054 unchanged and separate |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary | Pass | Level 3 clean fixture validates the standard high-coverage path |
| Beyond Local Maxima | Pass | Compared Level 2 and Level 3+ alternatives |
| Sufficient | Pass | Covers six standard Level 3 files |
| Fits Goal | Pass | Supports strict validator regression tests |
| Open Horizons | Pass | Leaves Level 3+ governance fixture possible later |

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

**Affected Systems**:
- `.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/spec.md`
- `.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/plan.md`
- `.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/tasks.md`
- `.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/checklist.md`
- `.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/decision-record.md`
- `.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/implementation-summary.md`

**Rollback**: Re-align the failing fixture file with the current Level 3 template and rerun strict validation.

<!-- /ANCHOR:adr-001-impl -->

---

<!-- /ANCHOR:adr-001 -->
