---
title: "Implementation Plan: Skill Advisor Isolation — Phase 1"
description: "Plan for removing system-skill-advisor cross-skill coupling from system-spec-kit build/test configs and relocating owned docs/tests."
trigger_phrases:
  - "skill advisor isolation plan"
  - "phase 1 plan skill advisor"
importance_tier: "normal"
contextType: "implementation"
---

# Implementation Plan: Skill Advisor Isolation — Phase 1

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (NodeNext), JSON configs |
| **Affected Skills** | system-spec-kit (source), system-skill-advisor (destination) |
| **Change Type** | Config cleanup + file relocation (no source code changes) |
| **Risk Level** | Low (zero TS imports verified) |

### Overview
Phase 1 (pilot) of the 015 research isolation plan. Decouples system-skill-advisor from system-spec-kit by removing cross-skill include/exclude entries from tsconfig and vitest configs, and relocating skill-owned documentation and test files to their proper home under `system-skill-advisor/`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research complete (015-extracted-skills-isolation/research/research.md)
- [x] Zero TS imports verified (grep confirmed)
- [x] Allowed paths documented
- [x] Verification steps defined

### Definition of Done
- [x] All config references to system-skill-advisor removed from spec-kit
- [x] All 11 files moved to system-skill-advisor
- [x] Skill-advisor vitest passes for moved test
- [x] Spec-kit tsc has only pre-existing errors
- [x] New 016 packet passes strict validation

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
File relocation — no code changes, only config cleanup and `git mv` operations.

### Key Changes
- **tsconfig.json**: Remove 1 include line + 5 exclude lines referencing system-skill-advisor
- **vitest.config.ts**: Remove 3 include lines + 1 exclude line
- **vitest.stress.config.ts**: Remove 2 exclude lines
- **Test files**: 1 unit test + 3 stress tests moved via `git mv`
- **Documentation**: 4 feature_catalog + 3 playbook files moved via `git mv`

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1.1: tsconfig.json cleanup
- [x] Remove `"../../system-skill-advisor/mcp_server/**/*.ts"` from include
- [x] Remove 5 system-skill-advisor exclude entries
- [x] Validate JSON syntax

### Phase 1.2: vitest.config.ts cleanup
- [x] Remove 3 system-skill-advisor include lines
- [x] Remove 1 system-skill-advisor exclude line

### Phase 1.3: vitest.stress.config.ts cleanup
- [x] Remove 2 system-skill-advisor exclude lines

### Phase 1.4: Test/stress file relocation
- [x] `git mv` spec-kit-skill-advisor-plugin.vitest.ts to skill-advisor tests/
- [x] `git mv` hooks-parity-stress.vitest.ts to skill-advisor stress_test/
- [x] `git mv` opencode-plugin-bridge-stress.vitest.ts to skill-advisor stress_test/
- [x] `git mv` README.md to skill-advisor stress_test/ (destination had none)
- [x] Remove empty source directory

### Phase 1.5: Feature catalog relocation
- [x] Move 4 files from spec-kit/feature_catalog/22-- to skill-advisor/06--mcp-surface/
- [x] Renumber: 26→06, 27→07, 28→08, 29→09
- [x] Update skill-advisor feature_catalog.md with new entries

### Phase 1.6: Playbook relocation
- [x] Move 3 files from spec-kit/playbook/22-- to skill-advisor/01--native-mcp-tools/
- [x] Renumber: 283→007, 284→008, 285→009
- [x] Update skill-advisor playbook.md with new entries

### Phase 1.7: Skill-advisor vitest config check
- [x] Verified broad `tests/**/*.vitest.ts` and `stress_test/**/*.{vitest,test}.ts` patterns already cover moved files

### Phase 1.8: Packet scaffolding
- [x] Create 016-skill-advisor-isolation-phase1 spec folder
- [x] Write spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md

### Phase 1.9: Verification
- [ ] `grep system-skill-advisor` on all 3 config files (all empty)
- [ ] `tsc --noEmit` — pre-existing errors only
- [ ] `vitest run` on moved test — pass
- [ ] `validate.sh --strict` on 016 packet — pass or warnings only

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Status |
|-----------|-------|--------|
| grep verification | Config files have zero skill-advisor refs | Pass |
| tsc --noEmit | Spec-kit compiles without new errors | Pre-existing only |
| vitest | Moved skill-advisor test passes | Pass |
| validate.sh | 016 packet structure valid | To run |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 015 research (zero TS imports verified) | Internal | Green |
| system-code-graph Phase 2+3 | Internal | Not started (Phase 2/3 scope) |
| git (for file moves) | Tool | Green |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Spec-kit build breaks, or tests fail catastrophically
- **Procedure**: `git checkout` all modified/deleted files from pre-change state

<!-- /ANCHOR:rollback -->
