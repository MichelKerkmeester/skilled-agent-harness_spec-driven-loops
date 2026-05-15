---
title: "Spec: Skill Advisor Isolation — Phase 1 (Pilot)"
description: "Phase 1 of extracted-skills isolation: remove system-skill-advisor cross-skill coupling from system-spec-kit build/test configs and relocate skill-owned docs/tests back to system-skill-advisor."
trigger_phrases:
  - "skill advisor isolation"
  - "extracted skills isolation"
  - "phase 1 skill advisor"
  - "016-skill-advisor-isolation"
importance_tier: "normal"
contextType: "implementation"
---

# Spec: Skill Advisor Isolation — Phase 1 (Pilot)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Parent** | `026-graph-and-context-optimization` |
| **Research** | `015-extracted-skills-isolation/research/research.md` (§3 Recommendation, §4 Packet 1) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`system-skill-advisor` was extracted from `system-spec-kit` but retains cross-skill coupling through:
1. `tsconfig.json` includes skill-advisor source files in spec-kit's type-check
2. `vitest.config.ts` includes skill-advisor tests/benches in spec-kit's test suite
3. `vitest.stress.config.ts` excludes skill-advisor directories
4. Spec-kit owns skill-advisor documentation and test files that belong under `system-skill-advisor/`

### Purpose
Fully decouple `system-skill-advisor` from `system-spec-kit` at the compile/test/documentation level. This is the pilot phase (lowest risk, zero TS import dependencies) defined in the 015 research.

### Key Finding (from 015 research)
`grep -rEln "^import.*system-skill-advisor" .opencode/skills/system-spec-kit/mcp_server/ --include="*.ts"` returns **zero results** — skill-advisor has no direct TS imports into spec-kit source. Only build-config and documentation coupling remain.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove system-skill-advisor from spec-kit `tsconfig.json` include/exclude
- Remove system-skill-advisor from spec-kit `vitest.config.ts` includes/excludes
- Remove system-skill-advisor from spec-kit `vitest.stress.config.ts` excludes
- Move 1 test file (`spec-kit-skill-advisor-plugin.vitest.ts`) to skill-advisor
- Move 3 stress-test files to skill-advisor
- Move 4 feature_catalog files to skill-advisor/06--mcp-surface/
- Move 3 manual_testing_playbook files to skill-advisor/01--native-mcp-tools/
- Update skill-advisor catalog/playbook references
- Verify spec-kit tsc compiles, skill-advisor vitest passes, validate new packet

### Out of Scope
- system-code-graph isolation (Phase 2/3)
- Any modification to system-code-graph files
- Changelog updates (historical record — per 015 research §1.5)
- CROSS-REF doc updates in spec-kit (deferred)

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | tsconfig.json has zero system-skill-advisor references | `grep "system-skill-advisor" tsconfig.json` returns empty |
| REQ-002 | vitest.config.ts has zero system-skill-advisor references | `grep "system-skill-advisor" vitest.config.ts` returns empty |
| REQ-003 | vitest.stress.config.ts has zero system-skill-advisor references | `grep "system-skill-advisor" vitest.stress.config.ts` returns empty |
| REQ-004 | Spec-kit test file moved to skill-advisor tests/ | File exists at `system-skill-advisor/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` |
| REQ-005 | 3 stress-test files moved to skill-advisor stress_test/skill-advisor/ | Files exist at destination |
| REQ-006 | 4 feature_catalog files moved to skill-advisor/06--mcp-surface/ | 4 files at destination with non-colliding numbers |
| REQ-007 | 3 playbook files moved to skill-advisor/01--native-mcp-tools/ | 3 files at destination with non-colliding numbers |
| REQ-008 | Spec-kit tsc --noEmit succeeds | No new compile errors introduced |
| REQ-009 | Skill-advisor vitest runs moved test successfully | `npx vitest run tests/spec-kit-skill-advisor-plugin.vitest.ts` passes |
| REQ-010 | 016 packet passes strict validation | `validate.sh --strict` exits 0 or warnings only |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system-spec-kit` has zero references to `system-skill-advisor` in build configuration
- **SC-002**: All moved files are owned by `system-skill-advisor` and discoverable via its catalog/playbook
- **SC-003**: No regression in existing build or test infrastructure
- **SC-004**: New 016 packet validates cleanly

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 015 research must be correct about zero TS imports | Invalid compile | Verified with grep before starting |
| Risk | Moved test imports may break | Test failure | Import paths validated pre-move; same directory depth |
| Risk | vitest config may not pick up moved files | Test not run | Broad `tests/**` and `stress_test/**` patterns confirmed |
| Dependency | Phase 1 must not touch system-code-graph | n/a | Explicit scope exclusion |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:related-docs -->
## 7. RELATED DOCUMENTS

- **Research**: `../015-extracted-skills-isolation/research/research.md`
- **Implementation Summary**: `implementation-summary.md` (this packet)

<!-- /ANCHOR:related-docs -->
