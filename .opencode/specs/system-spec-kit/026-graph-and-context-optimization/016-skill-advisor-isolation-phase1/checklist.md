---
title: "Verification Checklist: Skill Advisor Isolation — Phase 1"
description: "Verification checklist for Phase 1 of extracted-skills isolation."
trigger_phrases:
  - "skill advisor isolation checklist"
  - "phase 1 checklist skill advisor"
importance_tier: "normal"
contextType: "implementation"
---

# Verification Checklist: Skill Advisor Isolation — Phase 1

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER — cannot claim done until complete |
| **[P1]** | Required — must complete or get user approval |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:config -->
## Configuration Cleanup

- [x] CHK-001 [P0] tsconfig.json has zero `system-skill-advisor` references
  - **Evidence**: `grep -nE "system-skill-advisor" tsconfig.json` returns empty
- [x] CHK-002 [P0] vitest.config.ts has zero `system-skill-advisor` references
  - **Evidence**: `grep -nE "system-skill-advisor" vitest.config.ts` returns empty
- [x] CHK-003 [P0] vitest.stress.config.ts has zero `system-skill-advisor` references
  - **Evidence**: `grep -nE "system-skill-advisor" vitest.stress.config.ts` returns empty

<!-- /ANCHOR:config -->
---

<!-- ANCHOR:files-moved -->
## Files Moved

- [x] CHK-010 [P0] spec-kit-skill-advisor-plugin.vitest.ts at skill-advisor tests/
  - **Evidence**: File exists at `system-skill-advisor/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`
- [x] CHK-011 [P0] 3 stress test files at skill-advisor stress_test/skill-advisor/
  - **Evidence**: hooks-parity-stress, opencode-plugin-bridge-stress, README.md all present
- [x] CHK-012 [P0] 4 feature_catalog files at skill-advisor/06--mcp-surface/
  - **Evidence**: 06-skill-graph-scan.md through 09-skill-graph-validate.md present
- [x] CHK-013 [P0] 3 playbook files at skill-advisor/01--native-mcp-tools/
  - **Evidence**: 007-skill-graph-status.md through 009-skill-graph-validate.md present
- [x] CHK-014 [P1] spec-kit stress_test/skill-advisor/ directory removed
  - **Evidence**: `ls` returns "No such file or directory"

<!-- /ANCHOR:files-moved -->
---

<!-- ANCHOR:compile -->
## Compilation

- [x] CHK-020 [P1] spec-kit tsc --noEmit has only pre-existing errors
  - **Evidence**: All errors are pre-existing (code-graph contracts TS6305, TS2307, TS2345) or transitive chain errors from code-graph→skill-advisor (Phase 2/3 scope). No new errors from our changes.

<!-- /ANCHOR:compile -->
---

<!-- ANCHOR:tests -->
## Tests

- [x] CHK-030 [P0] Skill-advisor vitest runs moved test successfully
  - **Evidence**: `npx vitest run tests/spec-kit-skill-advisor-plugin.vitest.ts` — 1 test file, 30 tests passed

<!-- /ANCHOR:tests -->
---

<!-- ANCHOR:validation -->
## Spec Validation

- [x] CHK-040 [P1] 016 packet passes strict validation
  - **Evidence**: `validate.sh --strict` shows PASS or warnings only

<!-- /ANCHOR:validation -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 3 | 3/3 |

**Verification Date**: 2026-05-15

<!-- /ANCHOR:summary -->
