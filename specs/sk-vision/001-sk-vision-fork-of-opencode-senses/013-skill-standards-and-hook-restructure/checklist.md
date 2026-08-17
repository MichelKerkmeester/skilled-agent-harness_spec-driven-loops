---
title: "Verification Checklist: sk-vision standards + hook restructure"
description: "Verification Date: 2026-08-17"
trigger_phrases:
  - "sk-vision restructure checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/013-skill-standards-and-hook-restructure"
    last_updated_at: "2026-08-17T10:28:40.000Z"
    last_updated_by: "claude"
    recent_action: "Rebuilt sk-vision docs and consolidated host adapters under hooks/."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/013-skill-standards-and-hook-restructure/checklist.md"
      - ".opencode/skills/sk-vision/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-013-skill-standards-and-hook-restructure"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision standards + hook restructure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented. **Evidence**: `spec.md` section 4.
- [x] CHK-002 [P0] Approach defined. **Evidence**: `plan.md` sections 3-4.
- [x] CHK-003 [P1] Standards + exemplar identified. **Evidence**: `sk-create-skill` templates and the `system-skill-advisor` hooks mirror.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Docs pass the standards gate. **Evidence**: `validate_skill_package.py --check: PASS`.
- [x] CHK-011 [P0] SKILL.md under the word cap. **Evidence**: `wc -w SKILL.md` = 1,949 (< 5k).
- [x] CHK-012 [P1] OpenCode adapter imports the shared core, not a copy of it. **Evidence**: `hooks/opencode/sk-vision.ts` imports `../../vision-runtime/src/*`.
- [x] CHK-013 [P1] Build artifact excluded from version control. **Evidence**: `git check-ignore` on `hooks/opencode/sk-vision.js`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All P0 acceptance criteria met. **Evidence**: `spec.md` REQ-001 through REQ-006 and `implementation-summary.md` Verification.
- [x] CHK-021 [P0] OpenCode adapter builds and loads. **Evidence**: `bun run build` emits the `.js`; default export type `function`.
- [x] CHK-022 [P0] No runtime regression. **Evidence**: `bun test` → 8 pass / 0 fail.
- [x] CHK-023 [P1] Tool parity preserved. **Evidence**: `hooks/pi/sk-vision.ts` registers 13 tools.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Change class: `skill-structure` + `docs-standards`. **Evidence**: `spec.md` Problem Statement.
- [x] CHK-FIX-002 [P0] All four host load paths inventoried. **Evidence**: `.pi/extensions/sk-vision.ts`, `.opencode/plugins/sk-vision.js`, `.opencode/hooks/sk-vision/{pi,opencode}`.
- [x] CHK-FIX-003 [P0] Each host load path resolves. **Evidence**: `test -e` resolves all four host symlinks (`.pi/extensions/sk-vision.ts`, `.opencode/plugins/sk-vision.js`, both mirrors).
- [x] CHK-FIX-004 [P1] Dangling parallel-work symlink repaired. **Evidence**: `.pi/extensions/sk-vision.ts` re-pointed to `hooks/pi/sk-vision.ts`.
- [x] CHK-FIX-005 [P1] Evidence pinned. **Evidence**: `implementation-summary.md` Verification table.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added. **Evidence**: the diff is docs, adapter source, symlinks, and a build entry only.
- [x] CHK-031 [P1] No publishing regressions. **Evidence**: no `publishConfig` change; SKILL.md keeps the `opencode-senses` prohibition.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. **Evidence**: `spec.md`, `plan.md`, `tasks.md` describe the same three workstreams.
- [x] CHK-041 [P1] Docs match reality. **Evidence**: SKILL.md's `hooks/` references now resolve on disk.
- [x] CHK-042 [P2] Design decisions recorded. **Evidence**: `implementation-summary.md` Key Decisions.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Skill owns one hooks source tree. **Evidence**: `hooks/pi` and `hooks/opencode` under the skill; host paths symlink in.
- [x] CHK-051 [P1] Scope isolation. **Evidence**: `git status` shows only `.opencode/skills/sk-vision` and the sk-vision host paths changed; unrelated checkout work untouched.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-060 [P0] All checklist items marked `[x]` with evidence. **Evidence**: `checklist.md` CHK-001 through CHK-061.
- [x] CHK-061 [P0] Class-S metadata valid. **Evidence**: `ci-skill-root-metadata.cjs` `OK [S] sk-vision`.
<!-- /ANCHOR:summary -->
