---
title: "Spec: 022/010 ADR Writing and Doc Validator — 4 ADRs closing 022 arc + sk-doc drift detector"
description: "Closing the 022 hardcoded-default-remediation arc by authoring 4 ADRs governing what was implemented across packets 022/001, 022/004a, and 022/004b, plus a sk-doc validator that catches future doc-implementation drift early. ADR-A: skill-advisor calibration as contractual constants. ADR-B: verification clause amendment for ADR-013 + ADR-014. ADR-C: profile.ts scope coverage (parallel resolution chains). ADR-D: doc-implementation cross-checking mandate with validate-doc-model-refs.js script."
trigger_phrases:
  - "022/010 ADR writing"
  - "ADR-A skill-advisor calibration"
  - "ADR-B verification clause"
  - "ADR-C profile.ts scope"
  - "ADR-D doc cross-checking"
  - "validate-doc-model-refs.js"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator"
    last_updated_at: "2026-05-23T15:17:00Z"
    last_updated_by: "devin"
    recent_action: "Authored 4 ADRs and validator script closing 022 arc"
    next_safe_action: "Wire validate-doc-model-refs.js to pre-commit or CI"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/validate-doc-model-refs.js"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator/decision-record.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002310"
      session_id: "022-010-adr-writing-and-doc-validator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-A: SKILL_ADVISOR_COMPAT_CONTRACT.defaults is now canonical source of truth"
      - "ADR-B: Verification clause amended to cover inline || fallback patterns"
      - "ADR-C: All 3 spec-memory resolution chains documented and covered"
      - "ADR-D: validate-doc-model-refs.js script detects doc drift"
---
<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/.templates/spec-core.md | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/010 ADR Writing and Doc Validator

<!-- ANCHOR:metadata -->
## 1. METADATA

|| Field | Value |
||---|---|
|| Status | Complete |
|| Type | ADR authoring + validator script |
|| Owner | devin (SWE-1.6) |
|| Parent | `../spec.md` (022-hardcoded-default-remediation-arc) |
|| Predecessor | `../001-profile-ts-fallback-fix/`, `../004a-skill-advisor-compat-contract-consolidation/`, `../004b-skill-advisor-interface-and-env-vars/` |
|| Estimated wall-clock | 90 min (ideal) / 150 min (ceiling) |
|| Risk class | LOW |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 022 arc remediated hardcoded defaults across skill-advisor (14 P0 findings) and spec-memory (3 P0 findings), but the architectural decisions were not formally captured as ADRs. Additionally, doc drift persisted after model-default changes (5 P0 findings in 021 audit) with no automated detection mechanism.

Purpose: Author 4 ADRs documenting the architectural decisions made during 022 remediation, and ship a validator script that catches future doc-implementation drift at PR time.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Author `decision-record.md` with 4 ADRs (A, B, C, D) following the template from `004-spec-memory-embedder-bake-off/decision-record.md`
- ADR-A: Skill-Advisor Calibration as Contractual Constants
- ADR-B: Verification Clause Amendment for ADR-013 + ADR-014
- ADR-C: profile.ts Scope Coverage (Parallel Resolution Chains)
- ADR-D: Doc-Implementation Cross-Checking Mandate
- Write `validate-doc-model-refs.js` validator script (~180-220 lines) in `.opencode/skills/sk-doc/scripts/`
- Append AMENDMENT section to `004-spec-memory-embedder-bake-off/decision-record.md`
- Create 5 Level 2 spec docs (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md)
- Create description.json and graph-metadata.json

### Out of Scope

- CI wiring of validate-doc-model-refs.js (deferred; 1-shot run is immediate use case)
- Modifying existing ADR text in 004 decision-record.md (amendment is append-only)
- Spec docs for sibling phases (each phase ships independently)

### Files Changed

|| File | Change |
||---|---|
|| `010-adr-writing-and-doc-validator/decision-record.md` | Create (4 ADRs) |
|| `010-adr-writing-and-doc-validator/spec.md` | Create |
|| `010-adr-writing-and-doc-validator/plan.md` | Create |
|| `010-adr-writing-and-doc-validator/tasks.md` | Create |
|| `010-adr-writing-and-doc-validator/checklist.md` | Create |
|| `010-adr-writing-and-doc-validator/implementation-summary.md` | Create |
|| `010-adr-writing-and-doc-validator/description.json` | Create |
|| `010-adr-writing-and-doc-validator/graph-metadata.json` | Create |
|| `sk-doc/scripts/validate-doc-model-refs.js` | Create (validator script) |
|| `004-spec-memory-embedder-bake-off/decision-record.md` | Modify (append AMENDMENT section) |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

|| # | Requirement |
||---|---|
|| R1 | decision-record.md exists with 4 ADRs (A, B, C, D) following template |
|| R2 | Each ADR has Status, Context, Decision, Consequence subsections |
|| R3 | ADR-B cross-refs AMENDMENT section in 004 decision-record.md |
|| R4 | validate-doc-model-refs.js script exists, executable, --help works |
|| R5 | validate-doc-model-refs.js loads canonical models from registry.ts and registered_embedders.py |
|| R6 | validate-doc-model-refs.js scans .opencode/skills/**/*.md excluding changelog/, scratch/, benchmarks/, *archive*, research/iterations/ |
|| R7 | validate-doc-model-refs.js detects drift (non-canonical model cited as default) |
|| R8 | validate-doc-model-refs.js has --verbose flag for debugging |
|| R9 | AMENDMENT section appended to 004 decision-record.md (no existing content modified) |
|| R10 | 5 Level 2 spec docs created (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) |
|| R11 | description.json and graph-metadata.json created |
|| R12 | Strict-validate phase 010 exits 0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1–R12 all pass.
- 4 ADRs accurately capture architectural decisions from 022 remediation.
- validate-doc-model-refs.js runs successfully (exit 0 or 1 with valid drift report).
- AMENDMENT section is present in 004 decision-record.md.
- Phase 010 strict-validates cleanly.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

1. Create directory structure for 010 packet.
2. Read existing ADR template from 004 decision-record.md.
3. Write decision-record.md with 4 ADRs (A, B, C, D).
4. Write validate-doc-model-refs.js validator script.
5. Test validate-doc-model-refs.js --help and dry-run.
6. Append AMENDMENT section to 004 decision-record.md.
7. Create 5 Level 2 spec docs.
8. Create description.json and graph-metadata.json.
9. Run verification gates.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **Validator false positives**: Model-name pattern may match non-model strings. Mitigated by org-prefix whitelist and context markers.
- **ESM vs CommonJS**: Node.js project uses ES modules. Mitigated by using import syntax and fileURLToPath for __dirname.

Dependencies:
- 004 decision-record.md (template reference).
- registry.ts (canonical model source).
- registered_embedders.py (canonical model source).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

(none — scope locked)
<!-- /ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 9. NON-FUNCTIONAL REQUIREMENTS

- **Performance**: Validator scans all skill docs; should complete in <10s.
- **Reliability**: Exit codes 0 (no drift) and 1 (drift found) are stable.
- **Maintainability**: Script is self-documenting with --help; canonical sources are extensible.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 10. EDGE CASES

- Model names in code blocks or quotes should be detected if context markers present.
- Intentional historical references (marked with "former default", "superseded") should not flag as drift.
- Canonical model lists may be empty if registry files are missing; script should handle gracefully.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 11. COMPLEXITY

|| Dimension | Score | Justification |
||---|---|---|
|| LOC | ~120 lines ADR + ~220 lines validator | Medium |
|| Files | 10 new + 1 modified | Bounded |
|| Behavior risk | Low (documentation-only + non-blocking validator) | No runtime impact |
|| Total | **Low** | Bench-diff not required |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:cross-links -->
## 12. CROSS-LINKS

- **Parent arc**: `../spec.md`
- **Template reference**: `../004-spec-memory-embedder-bake-off/decision-record.md`
- **Canonical sources**: `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embedders/registered_embedders.py`
- **Validator location**: `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js`
- **Sibling phases**: `../001-profile-ts-fallback-fix/`, `../004a-skill-advisor-compat-contract-consolidation/`, `../004b-skill-advisor-interface-and-env-vars/`
<!-- /ANCHOR:cross-links -->
