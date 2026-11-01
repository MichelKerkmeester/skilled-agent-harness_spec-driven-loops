---
title: "Tasks: Phase 5: optional-parent-decision-record"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "optional parent decision record tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: optional-parent-decision-record

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables** (run shell commands from the repository root):
- `S` = `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md`
- `V` = `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`
- `P` = `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/005-optional-parent-decision-record`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the parent-structure paragraph (`$S`). Verify: `sed -n '142p' "$S"` prints one line naming the lean trio and, after the edit, the optional decision record.
- [x] T002 Read the Phase Parent row (`$V`). Verify: `sed -n '208p' "$V"` prints one row that starts with `| **Phase Parent** |`.
- [x] T003 Confirm the repo already allows an optional parent-level document (`$S`). Verify: `sed -n '76p' "$S"` prints a series-parent line containing "optional `timeline.md`".
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the parent-structure paragraph so heavy docs live in the phase children with one optional exception (`$S`). Verify: `sed -n '142p' "$S"` prints "One exception is optional: a parent may carry a `decision-record.md`" and no longer prints "live exclusively in the phase children".
- [x] T005 Align the Phase Parent row with the same exception (`$V`). Verify: `sed -n '208p' "$V"` prints "except an optional `decision-record.md` for decisions that span the phases".
- [x] T006 Confirm the edit stayed inside the two named lines (`$S`, `$V`). Verify: `git diff --numstat -- "$S" "$V"` prints `1	1` before each of the two paths and no other path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Validate this child packet (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict` reports every content rule passing and names only `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` as errors.
- [x] T008 Validate the parent folder (`$P/..`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P/.." --strict` reports the parent and all five children passing on every content rule, with `GENERATED_METADATA_INTEGRITY` the parent's only error.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `git diff --numstat` shows one added and one removed line in each of the two reference files
- [x] Every content rule passes; the only failing rules are the two generated-metadata rules that `repair-derived.cjs --apply` owns
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

