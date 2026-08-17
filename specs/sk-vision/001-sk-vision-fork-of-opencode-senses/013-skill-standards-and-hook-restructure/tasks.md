---
title: "Tasks: sk-vision standards + hook restructure"
description: "Task ledger for the sk-vision docs-to-standard rebuild and the Pi/OpenCode hooks consolidation."
trigger_phrases:
  - "sk-vision restructure tasks"
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
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/013-skill-standards-and-hook-restructure/tasks.md"
      - ".opencode/skills/sk-vision/hooks/opencode/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-013-skill-standards-and-hook-restructure"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision standards + hook restructure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Rebuild SKILL.md to the standalone-skill template, folding in the runtime reference. Evidence: SKILL.md 1,949 words; `package_skill.py --check: PASS`.
- [x] T002 Rebuild README.md to the README template. Evidence: README carries the full template section set.
- [x] T003 Delete `references/runtime-reference.md`; re-point `leafRoots` to `feature-catalog`; regenerate manifests. Evidence: `ci-skill-root-metadata.cjs` `OK [S] sk-vision`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move the Pi adapter to `hooks/pi/sk-vision.ts`. Evidence: `git status` delete of `pi/sk-vision.ts` + new `hooks/pi/`.
- [x] T005 Re-point `.pi/extensions/sk-vision.ts`; add the `.opencode/hooks/sk-vision/pi` mirror. Evidence: both resolve to the 20KB source.
- [x] T006 Author `hooks/opencode/sk-vision.ts` importing the shared `src` core. Evidence: default export type `function`.
- [x] T007 Add the OpenCode build entry; gitignore the artifact. Evidence: `build.ts` emits `hooks/opencode/sk-vision.js`; `git check-ignore` confirms ignore.
- [x] T008 Symlink `.opencode/plugins/sk-vision.js`; add the `.opencode/hooks/sk-vision/opencode` mirror. Evidence: both resolve.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Standards gate. Evidence: `validate_skill_package.py --check: PASS`; `ci-skill-root-metadata.cjs` `OK [S] sk-vision`.
- [x] T010 Build + load. Evidence: `bun run build` emits the `.js`; it exports a plugin `function`.
- [x] T011 Runtime regression. Evidence: `bun test` → 8 pass / 0 fail.
- [x] T012 Tool parity. Evidence: `hooks/pi/sk-vision.ts` registers 13 tools.
- [ ] T013 Commit the sk-vision-scoped changes on v4. Evidence: pending the commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation tasks marked `[x]`. Evidence: `tasks.md` T001-T012.
- [ ] Commit task T013 complete. Evidence: pending.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [x] Verification passed. Evidence: `implementation-summary.md` Verification table.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
