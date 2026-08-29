---
title: "CS-003: OPENCODE Plus Motion.dev Supplementary References"
description: "Verify OPENCODE target precedence wins for a TypeScript tool that includes a Motion.dev preview, while motion_dev references load as supplementary context."
version: 3.5.0.5
---

# CS-003: OPENCODE Plus Motion.dev Supplementary References

## 1. OVERVIEW

This scenario verifies mixed-marker precedence. A `.opencode/` TypeScript tool may include a Motion.dev preview or animation fixture, but the target path still owns the work. The AI must detect `OPENCODE`, load TypeScript/OpenCode standards, and use `motion_dev/` only as supplementary API context.

---

## 2. SCENARIO CONTRACT

**Realistic user prompt**:
```text
Before editing .opencode/skills/sk-doc/scripts/preview-server.ts for a Motion demo, how should sk-code route the request?
```

**Expected detection markers** (verbatim from `references/stack-detection.md`):
```bash
# 1. OPENCODE (highest precedence — disambiguates mixed-marker workspaces)
# CWD under .opencode/ OR any changed/target file under .opencode/
```

**Expected surface**: `OPENCODE`

**Expected references loaded** (exact relative paths under `.opencode/skills/sk-code/`):
- `references/stack-detection.md`
- `references/smart-routing.md`
- `references/smart-routing.md`
- `sk-code-opencode/references/typescript/quick-reference/template-naming-and-types.md`
- `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md`
- `sk-code-opencode/references/typescript/quality-standards/overview-and-type-system.md`
- `sk-code-webflow/references/animation/quick-start.md`
- `sk-code-webflow/references/animation/integration-patterns.md`
- `sk-code-webflow/references/animation/animate-and-timelines.md`

**Expected assets loaded**:
- `sk-code-opencode/assets/checklists/universal-checklist.md`
- `sk-code-opencode/assets/checklists/typescript-checklist.md`
- `sk-code-webflow/assets/animation/snippets/es-module-bootstrap.js`

**Expected NOT loaded as authoritative surface guidance**:
- `sk-code-webflow/references/implementation/webflow-patterns/overview-limits-and-collection-lists.md`
- `sk-code-webflow/assets/checklists/verification_checklist.md`

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

### Prompt

- Prompt: `Before editing .opencode/skills/sk-doc/scripts/preview-server.ts for a Motion demo, how should sk-code route the request?`

### Commands

1. Dispatch the exact prompt through the cross-CLI universal-prompt harness with `SCENARIO_ID=CS-003` on each configured CLI runtime.
2. Capture the raw transcript per runtime to `/tmp/skc-CS-003-<cli>.txt`.
3. Capture the structured routing result (surface, references, assets, agent dispatch) per runtime to `results/CS-003-<cli>.yaml`.
4. Diff each `results/CS-003-<cli>.yaml` against the reference/asset set declared in §2 SCENARIO CONTRACT.

### Expected

Expected signals: the structured result in `results/CS-003-<cli>.yaml` reports surface `OPENCODE` and the reference/asset set declared in §2 SCENARIO CONTRACT, with no agent dispatched.

### Evidence

Evidence: `/tmp/skc-CS-003-<cli>.txt` (raw per-runtime transcript) and `results/CS-003-<cli>.yaml` (structured routing result) for each configured CLI runtime.

### Pass / Fail

- **Pass**: surface is `OPENCODE`, TypeScript/OpenCode references load, Motion.dev references load as supplementary context, Webflow guidance is not treated as the owning surface, and no agent is dispatched.
- **Fail**: surface is `WEBFLOW` or `UNKNOWN`, TypeScript standards are missing, or an agent is dispatched.

### Failure Triage

1. If `WEBFLOW` wins, check that OPENCODE target/CWD has early-return precedence.
2. If TypeScript refs are missing, verify `.ts` language sub-detection.
3. If Motion.dev refs are missing, inspect `MOTION_DEV` intent scoring for `motion.dev` and `animate()`.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` - Root directory page and scenario summary.
- `.opencode/skills/sk-code/shared/references/stack-detection.md` - OPENCODE precedence rule.
- `.opencode/skills/sk-code/shared/references/smart-routing.md` - OPENCODE and MOTION_DEV maps.
- `.opencode/skills/sk-code/sk-code-opencode/references/typescript/quick-reference/template-naming-and-types.md` - Expected TypeScript route.
- `.opencode/skills/sk-code/sk-code-webflow/assets/animation/snippets/es-module-bootstrap.js` - Supplementary Motion ESM pattern.

---

## 5. SOURCE METADATA

- Group: Cross-Stack Routing
- Playbook ID: CS-003
- Created: 2026-05-05
- Critical path: Yes
- Destructive: No
- Sandbox: read-only routing analysis
- Concurrent-safe: Yes
- Last validated: pending Phase D matrix
