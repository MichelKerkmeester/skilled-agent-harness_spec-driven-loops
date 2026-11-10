---
title: "Implementation Plan: Phase 2: subtrack-predicate"
description: "Bring the validator, orchestrator and archive copies of the declared-sub-track rule into line with the reader, skip symlinked numbered packets in recursive validation, and lock the answer with one cross-consumer parity test, each change starting from a red case."
trigger_phrases:
  - "subtrack predicate plan"
  - "sub-track rule parity plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: subtrack-predicate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | bash (`validate.sh`, `archive.sh`), TypeScript compiled to `runtime/dist`, Node ESM and CommonJS |
| **Framework** | None; spec-kit CLI scripts and the validation orchestrator |
| **Storage** | `description.json` per track and sub-track |
| **Testing** | Vitest in `.skilled/skills/system-spec-kit/runtime/cli/tests/` |

### Overview
The reader's rules are the reference: a numbered name matches `^\d{3}(?:[-_].+)?$`, a symlinked description or folder never declares a sub-track, and `.`-prefixed, `node_modules` and `z_*` folders are never candidates. Each consumer is brought to that answer, test first, and one parity test runs the same folder matrix through all of them. The design question of whether the copies stay is D-002a.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `scratch/baseline.txt` holds the pass and fail count of every file in the section 5 command, taken before the first edit.
- [x] The operator has answered D-002a and D-002b.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.

### Definition of Done
- [x] Every requirement in `spec.md` section 4 is met with evidence, and the optional REQ-006 is either met or marked deferred.
- [x] `npm run build` in `runtime/` exits 0, then the section 5 command prints zero failures and the baseline totals plus the new cases.
- [x] `bash -n` on `validate.sh` and `archive.sh` exits 0.
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reference implementation plus parity test. The reader (`track-roots.mjs`) is the reference, and the parity test is the guard.

### Key Components
- **`has_subtrack_declaration` and the sub-track packet loop in `validate.sh`**: take the reader's name pattern, refuse a symlinked description with `-L`, exclude hidden and `node_modules` folders, and skip `-L` numbered packet directories.
- **`isDeclaredSubTrack` and `hasSubTrackLevel` in `orchestrator.ts`**: take the same three rules; `PACKET_FOLDER_RE` stops being a stricter pattern than the reader's.
- **`is_declared_subtrack` in `archive.sh`**: takes the same three rules.
- **`subtrack-predicate-parity.vitest.ts`**: builds each matrix folder once and asks the reader, `validate.sh`, `archive.sh`, the parser and `repair-derived.cjs`; the orchestrator is reached through `validate.sh` after a build.

### Data Flow
One matrix folder, then each consumer's yes or no, then an equality check against the reader's answer.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline and the operator's answers. Implementation writes the parity matrix and the P2-2 and P2-8 cases red, then aligns each consumer and corrects the 044 claim. Verification reruns the whole test set against the baseline. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run from `.skilled/skills/system-spec-kit/runtime/cli` after `npm run build` in `runtime/`:

```bash
npx vitest run --config ../../vitest.config.ts --project cli tests/subtrack-predicate-parity.vitest.ts tests/validate-subtrack.vitest.ts tests/track-roots.vitest.ts tests/archive-track.vitest.ts tests/graph-metadata-refresh.vitest.ts tests/repair-derived.vitest.ts tests/create-track-refresh.vitest.ts tests/subtrack-fixture.vitest.ts
bash -n spec/validate.sh && bash -n spec/archive.sh
```

Every new case is shown failing on the unchanged code first. The matrix reuses `buildSubtrackTree` and adds the missing folders; the symlink cases point outside `specs/`, as the fixture's `linked` folder does.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package. A current `runtime/dist` build, phase 001 landed, and the operator's answers to D-002a and D-002b.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a flat-track case fails, or a push that validated before stops validating. Revert the one commit with `git revert <sha>`; each consumer change lands as its own commit, so a revert removes one consumer's alignment and the parity test then names it.
<!-- /ANCHOR:rollback -->

---
