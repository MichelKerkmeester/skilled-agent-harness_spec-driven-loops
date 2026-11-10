---
title: "Implementation Plan: Phase 3: metadata-write-safety"
description: "Guard refresh-track-roots against writing through a symlinked graph-metadata.json, and let its --apply seed a missing sub-track file so the repair the sweep prints clears the pre-push block. Each change starts from a red case in track-roots.vitest.ts."
trigger_phrases:
  - "metadata write safety plan"
  - "refresh track roots write guard plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: metadata-write-safety

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`refresh-track-roots.mjs`), TypeScript tests run by Vitest |
| **Framework** | None; spec-kit CLI scripts |
| **Storage** | `graph-metadata.json` per track and sub-track |
| **Testing** | Vitest in `.skilled/skills/system-spec-kit/runtime/cli/tests/` |

### Overview
One script changes: `runtime/cli/spec/refresh-track-roots.mjs`. Before it writes, it runs `lstat` on the metadata path and refuses a symlink. Where the file is absent for a declared sub-track, it writes a minimal track-root-shaped file instead of refusing. Each behavior starts as a red case in `track-roots.vitest.ts`, shown failing on the unchanged script.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `scratch/baseline.txt` holds the pass and fail count of `track-roots.vitest.ts`, `create-track-refresh.vitest.ts`, `archive-track.vitest.ts` and `subtrack-fixture.vitest.ts`, taken before the first edit.
- [x] The operator has answered D-003a and D-003b; both recommendations are recorded in `spec.md` section 7.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.

### Definition of Done
- [x] Every requirement in `spec.md` section 4 is met with evidence in `tasks.md` and the scratch logs.
- [x] The required 11-file suite reports 194 passed, 0 failed, four above the 190-test baseline; the `create-track-refresh` and `archive-track` counts remain 20 and 60.
- [x] The two Measured Behavior cases, rerun in isolated temporary workspaces, give the fixed results.
- [x] Docs updated (spec/plan/tasks and implementation summary).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single guard at the write site. The reader stays read-only and unchanged.

### Key Components
- **The write block in `refresh-track-roots.mjs`** (`:90-94` and `:107`): checks `lstat` before `writeFileSync`, counts a symlink as a failure, and handles an absent sub-track file by seeding it.
- **The seed**: `schema_version` 1, `packet_id` and `spec_folder` the sub-track id, `parent_id` the track, `children_ids` from the reader, an empty `manual` block and a minimal `derived` block, the shape the fixture builder already uses. `repair-derived.cjs` fills the rest later.

### Data Flow
`--apply`, then the reader's track list, then per track: `lstat` the metadata path, then refuse a link, seed an absent sub-track file, or compare and rewrite as today.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline, the operator's answers and the no-symlink check. Implementation adds the red cases, then the guard and the seed. Verification reruns the test set and the two Measured Behavior cases. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run from `.skilled/skills/system-spec-kit/runtime/cli` after `npm run build` in `runtime/`:

```bash
npx vitest run --config ../../vitest.config.ts --project cli tests/track-roots.vitest.ts tests/create-track-refresh.vitest.ts tests/archive-track.vitest.ts tests/subtrack-fixture.vitest.ts
```

Every new case is shown failing on the unchanged script first, except the unreadable-file case, which guards the seed against clobbering and passes on the unchanged script by design. The symlink cases point at a file outside `specs/`, as the fixture's `linked-target/` does.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package. Phase 002 landed, a current `runtime/dist` build, and the operator's answers to D-003a and D-003b.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a flat-track refresh case fails, or a host reports a refresh that now refuses a symlinked metadata file it relied on. Revert the one commit with `git revert <sha>`; the guard and the seed land as separate commits, so a revert removes one and keeps the other.
<!-- /ANCHOR:rollback -->

---
