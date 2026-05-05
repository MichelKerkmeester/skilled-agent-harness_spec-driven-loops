---
title: "CS-003: OPENCODE Plus Motion.dev Supplementary References"
description: "Verify OPENCODE target precedence wins for a TypeScript tool that includes a Motion.dev preview, while motion_dev references load as supplementary context."
---

# CS-003: OPENCODE Plus Motion.dev Supplementary References

## 1. OVERVIEW

This scenario verifies mixed-marker precedence. A `.opencode/` TypeScript tool may include a Motion.dev preview or animation fixture, but the target path still owns the work. The AI must detect `OPENCODE`, load TypeScript/OpenCode standards, and use `motion_dev/` only as supplementary API context.

---

## 2. SCENARIO CONTRACT

**Realistic user prompt**:
```text
Update .opencode/skill/sk-doc/scripts/preview-server.ts so its docs preview page can show a small motion.dev animate() demo. Analyze how sk-code should route this before any edit.
```

**Expected detection markers** (verbatim from `references/router/code_surface_detection.md`):
```bash
# 1. OPENCODE (highest precedence — disambiguates mixed-marker workspaces)
# CWD under .opencode/ OR any changed/target file under .opencode/
```

**Expected surface**: `OPENCODE`

**Expected references loaded** (exact relative paths under `.opencode/skill/sk-code/`):
- `references/router/code_surface_detection.md`
- `references/router/intent_classification.md`
- `references/router/resource_loading.md`
- `references/opencode/shared/universal_patterns.md`
- `references/opencode/shared/code_organization.md`
- `references/opencode/typescript/quick_reference.md`
- `references/opencode/typescript/style_guide.md`
- `references/opencode/typescript/quality_standards.md`
- `references/motion_dev/quick_start.md`
- `references/motion_dev/integration_patterns.md`
- `references/motion_dev/animate_and_timelines.md`

**Expected assets loaded**:
- `assets/opencode/checklists/universal_checklist.md`
- `assets/opencode/checklists/typescript_checklist.md`
- `assets/motion_dev/snippets/es_module_bootstrap.js`

**Expected NOT loaded as authoritative surface guidance**:
- `references/webflow/implementation/webflow_patterns.md`
- `assets/webflow/checklists/verification_checklist.md`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff surface is `OPENCODE`, TypeScript/OpenCode references load, Motion.dev references load as supplementary context, Webflow guidance is not treated as the owning surface, and no agent is dispatched.
- **FAIL** iff surface is `WEBFLOW` or `UNKNOWN`, TypeScript standards are missing, or an agent is dispatched.

**Failure triage**:
1. If `WEBFLOW` wins, check that OPENCODE target/CWD has early-return precedence.
2. If TypeScript refs are missing, verify `.ts` language sub-detection.
3. If Motion.dev refs are missing, inspect `MOTION_DEV` intent scoring for `motion.dev` and `animate()`.

---

## 3. TEST EXECUTION

Run this scenario through the Phase 005 universal prompt using `SCENARIO_ID=CS-003`.

Evidence files:
- `/tmp/skc-CS-003-<cli>.txt`
- `specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/005-playbook-cross-cli-execution/results/CS-003-<cli>.yaml`

---

## 4. SOURCE FILES

- `.opencode/skill/sk-code/references/router/code_surface_detection.md` - OPENCODE precedence rule.
- `.opencode/skill/sk-code/references/router/resource_loading.md` - OPENCODE and MOTION_DEV maps.
- `.opencode/skill/sk-code/references/opencode/typescript/quick_reference.md` - Expected TypeScript route.
- `.opencode/skill/sk-code/assets/motion_dev/snippets/es_module_bootstrap.js` - Supplementary Motion ESM pattern.

---

## 5. SOURCE METADATA

- **Created**: 2026-05-05
- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: read-only routing analysis
- **Concurrent-safe**: Yes
- **Last validated**: pending Phase D matrix
