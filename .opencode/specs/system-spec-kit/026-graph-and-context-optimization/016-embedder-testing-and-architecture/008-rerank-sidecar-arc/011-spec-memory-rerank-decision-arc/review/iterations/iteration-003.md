# Iteration 003 - Traceability Review

**Dimension:** Traceability  
**Date:** 2026-05-21  
**Files Reviewed:** 
- spec.md (011 parent)
- 005-opt-in-only-closure/spec.md
- 005-opt-in-only-closure/implementation-summary.md
- lib/search/search-flags.ts
- lib/search/confidence-scoring.ts
- tests/scoring-opt-in.vitest.ts
- system-spec-kit/SKILL.md
- system-rerank-sidecar/SKILL.md

---

## Dimension: Traceability

### Traceability Protocol Coverage

**Core Protocols:**
- **spec_code:** PASS - Requirements in 011/005 spec.md trace clearly to implementation
- **checklist_evidence:** PARTIAL - Implementation evidence present but not explicitly linked to checklist items

**Overlay Protocols:**
- **skill_agent:** PARTIAL - SKILL.md docs updated but lack explicit traceability to spec packet
- **agent_cross_runtime:** NOT APPLICABLE - No cross-runtime agents involved
- **feature_catalog_code:** NOT APPLICABLE - No feature catalog involved
- **playbook_capability:** NOT APPLICABLE - No playbook involved

---

## Findings by Severity

### P2 Findings

#### P2-001: Missing explicit traceability markers in SKILL.md documentation
- **File:** .opencode/skills/system-spec-kit/SKILL.md:1-100
- **Evidence:** The implementation-summary.md §Docs Updated states that SKILL.md was updated with "Reranking (opt-in)" section documenting the OFF-by-default decision. However, the actual SKILL.md file does not contain an explicit section header or traceability marker that references the 011/005 spec packet or the arc evidence. The opt-in semantics are mentioned in the skill description but not explicitly linked to the decision arc.
- **Finding Class:** documentation_traceability
- **Scope Proof:** Read of system-spec-kit/SKILL.md lines 1-100 shows no explicit "Reranking (opt-in)" section or reference to 011/005
- **Affected Surface Hints:** ["documentation", "SKILL.md", "traceability"]
- **Recommendation:** Add an explicit section in system-spec-kit/SKILL.md with heading "## Reranking (opt-in)" that includes a reference to the 011/005 spec packet and the arc evidence trail. This improves documentation traceability for future maintainers.

---

## Traceability Checks

### spec_code Protocol
- **Status:** PASS
- **Evidence:** 
  - 011/005 spec.md REQ-001 through REQ-008 clearly define requirements
  - implementation-summary.md §Code Changes maps each requirement to specific file:line changes
  - search-flags.ts:99-108 implements SPECKIT_CROSS_ENCODER default flip
  - search-flags.ts:111-126 implements isRerankerExpected() helper
  - confidence-scoring.ts:256-262 conditions WEIGHT_RERANKER penalty on isRerankerExpected()
  - All changes are traceable from spec → implementation summary → actual code

### checklist_evidence Protocol
- **Status:** PARTIAL
- **Evidence:**
  - implementation-summary.md §Verification shows test passes and strict-validate exit 0
  - However, there is no explicit mapping between checklist items in spec.md §Requirements and the verification evidence
  - The verification section shows test results but does not explicitly reference REQ-004 (new vitest) or REQ-008 (strict-validate)
- **Gap:** Checklist evidence exists but lacks explicit item-level traceability

### skill_agent Protocol
- **Status:** PARTIAL
- **Evidence:**
  - system-spec-kit/SKILL.md and system-rerank-sidecar/SKILL.md were updated per implementation-summary.md §Docs Updated
  - system-rerank-sidecar/SKILL.md:12 explicitly mentions "spec-memory (opt-in only via SPECKIT_CROSS_ENCODER=true or RERANKER_LOCAL=true)"
  - However, there is no explicit reference to the 011/005 spec packet or the arc evidence trail in either SKILL.md
- **Gap:** Documentation updates lack explicit traceability markers to the spec packet that mandated them

---

## Verdict

**CONDITIONAL with hasAdvisories=true**

**Rationale:**
- Core spec_code traceability is strong - requirements map clearly to implementation
- Documentation traceability has gaps (P2 finding) but these are advisory, not functional
- No P0 or P1 findings in traceability dimension
- The implementation correctly implements the spec requirements; the gaps are in documentation cross-references

---

## Next Dimension

**Maintainability** - Review code patterns, clarity, documentation quality, and safe follow-on change cost for the implemented changes.
