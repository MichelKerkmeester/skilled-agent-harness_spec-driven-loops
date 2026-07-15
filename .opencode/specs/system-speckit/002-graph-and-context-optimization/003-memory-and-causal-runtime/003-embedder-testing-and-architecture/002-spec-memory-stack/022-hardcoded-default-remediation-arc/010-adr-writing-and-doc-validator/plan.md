---
title: "Plan: 022/010 ADR Writing and Doc Validator"
description: "4 ADRs + validate-doc-model-refs.js authored via cli-devin SWE-1.6 dispatch."
trigger_phrases: ["022/010 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator"
    last_updated_at: "2026-05-23T17:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan re-authored with proper frontmatter"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002314"
      session_id: "016-002-022-010-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["cli-devin dispatch produced 4 ADRs + validator + AMENDMENT"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/010 ADR Writing and Doc Validator

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Close 022 arc with 4 ADRs governing implemented behavior + sk-doc drift validator.
### Overview
cli-devin SWE-1.6 dispatch; ~10 min wall-clock; produced 4 ADRs in decision-record.md + AMENDMENT to 004 decision-record + validate-doc-model-refs.js (12KB, executable).
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- Council-recommended ADR scope received
- Validator script spec finalized
### Definition of Done
- 4 ADRs in decision-record.md
- AMENDMENT in 004 decision-record.md
- validate-doc-model-refs.js exists + --help works
- Strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Doc-only ADR authoring + Node.js validator that parses registry.ts + registered_embedders.py via regex.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
Create directory; read ADR template from 004 decision-record.
### Phase 2: Implementation
- Write decision-record.md with 4 ADRs (A: skill-advisor calibration; B: ADR-013/014 amendment; C: profile.ts scope; D: doc cross-checking)
- Write validate-doc-model-refs.js (~220 lines)
- Append AMENDMENT to 004 decision-record.md
- Write 5 Level 2 spec docs + description.json + graph-metadata.json
### Phase 3: Verification
--help check; dry-run check; AMENDMENT grep; strict-validate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Validator self-test: --help and bare invocation. Exit 0 = no drift; exit 1 = drift detected.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- All other 022 phases shipped (ADR-A/B/C/D document their changes)
- registry.ts + registered_embedders.py canonical sources
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git restore` 004 decision-record + `git rm` 010 packet + `git rm` validator script.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES
Final phase — closes the arc. ADR-B references ADR-013/014 in shipped 004 packet.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE
| Phase | Est | Actual |
|---|---|---|
| Setup | 10 | 5 |
| Implementation | 60 | 8 |
| Verify | 10 | 5 |
| Total | 80 min | ~18 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK
If ADR-B amendment to 004 needs revision, edit in place; original ADR-013/014 text remains unchanged.
<!-- /ANCHOR:enhanced-rollback -->
