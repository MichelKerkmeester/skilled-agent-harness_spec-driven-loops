---
title: "Implementation Plan: Phase 6: review-follow-ups"
description: "Write five failing cases first, then align the track-segment rule across the reader, parser, repair, validate and orchestrator, make archive.sh create missing sub-track metadata, widen the validate.sh sub-track packet glob, and fix two messages."
trigger_phrases:
  - "review follow ups plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: review-follow-ups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node ESM and CommonJS, TypeScript |
| **Framework** | None; spec-kit's Vitest project `cli` |
| **Storage** | None |
| **Testing** | Vitest in `.skilled/skills/system-spec-kit/runtime/cli/tests/` |

### Overview
The track reader is the reference. Each consumer gets the reader's track-name rule, so a sub-track exists for all of them or for none. The tests come first and are shown failing on the pre-phase code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The follow-up list in `../morning-handoff.md` names each gap.

### Definition of Done
- [x] Every requirement in `spec.md` section 4 is met with evidence.
- [x] Full cli and core suites run, with any failure compared against the pre-phase baseline.
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One predicate, copied per language, held equal by a parity test.

### Key Components
- **Track-name rule**: not hidden, not `node_modules`, not `z_*`, not a packet number, no `spec.md`.
- **Parity test**: `subtrack-predicate-parity.vitest.ts`, which now also plants a declared sub-track under five kinds of non-track folder.

### Data Flow
The reader decides; every other consumer's answer is compared with it per case.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Write the five cases, run them red, fix each consumer, run them green, prove red again by reverse-applying only the code patch, then run the full suites and validate the packet. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run from `.skilled/skills/system-spec-kit` after `npm run build` in `runtime/`, because `validate.sh` runs the compiled orchestrator:

```bash
npx vitest run --project cli subtrack-predicate-parity validate-subtrack create-track-containment track-roots create-track-refresh graph-metadata-refresh
```

The red proof keeps the test edits and reverse-applies the code patch with `git apply -R`, then reapplies it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package. A current `runtime/dist` build.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a flat-track regression after landing. Revert the phase commit with `git revert <sha>`; it touches only the files in `spec.md` section 3.
<!-- /ANCHOR:rollback -->
