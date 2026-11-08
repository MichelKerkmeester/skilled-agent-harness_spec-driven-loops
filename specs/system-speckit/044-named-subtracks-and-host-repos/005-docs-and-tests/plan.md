---
title: "Implementation Plan: Phase 5: docs-and-tests"
description: "Correct the docs that drifted from the sub-track code, then repair the two weak tests: two new create.sh cases and a rewritten archive parent-derivation case, each proved by a negative control that breaks the behavior and shows the test fail."
trigger_phrases:
  - "docs and tests plan"
  - "negative control test repair plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: docs-and-tests

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, TypeScript tests run by Vitest, bash (`create.sh`) |
| **Framework** | None; spec-kit docs and its Vitest project `cli` |
| **Storage** | None |
| **Testing** | Vitest in `.skilled/skills/system-spec-kit/runtime/cli/tests/`, plus `rg` and `grep` before-and-after checks for each doc line |

### Overview
Doc fixes come last in the remediation, after phases 001 to 003 settle the behavior they describe. Each doc line gets a before check that prints the wrong text and an after check that prints the corrected text. The two new `create.sh` cases and the rewritten parent-derivation case are characterization tests, so a negative control proves each one: break the behavior locally, see the case fail, restore the line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `scratch/baseline.txt` holds the pass and fail count of `create-track-refresh.vitest.ts`, `graph-metadata-refresh.vitest.ts`, `track-roots.vitest.ts` and `subtrack-fixture.vitest.ts`, taken before the first edit.
- [ ] Phases 001 to 003 are Complete, and the operator has answered D-005a, D-005b and D-005c.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.

### Definition of Done
- [ ] Every requirement in `spec.md` section 4 is met with evidence.
- [ ] The section 5 command prints zero failures and the baseline totals plus the new cases.
- [ ] `git diff --stat` after the last negative control shows only the files in `spec.md` section 3.
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc corrections plus characterization tests. No new component.

### Key Components
- **The doc lines**: `folder-structure.md:115`, `lib/README.md:121`, the feature-catalog track-root page, and `tasks.md:38`, `plan.md:84`, `implementation-summary.md:129` in the 044 packet.
- **The two new cases**: in `create-track-refresh.vitest.ts`, built on `buildSubtrackTree`.
- **The rewritten case**: in `graph-metadata-refresh.vitest.ts`, using a three-segment identity such as `demo/z_old/001-kept` so the `z_` check is the one that decides.

### Data Flow
A broken line of code, then the case that must fail, then the restored line and the passing case. For the docs, the wrong text, then the corrected text.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline and confirms phases 001 to 003 and the three decisions. Implementation repairs the tests with their negative controls, then corrects the docs. Verification reruns the test command, checks the diff scope, and validates the whole 044 packet recursively. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run from `.skilled/skills/system-spec-kit/runtime/cli` after `npm run build` in `runtime/`:

```bash
npx vitest run --config ../../vitest.config.ts --project cli tests/create-track-refresh.vitest.ts tests/graph-metadata-refresh.vitest.ts tests/track-roots.vitest.ts tests/subtrack-fixture.vitest.ts
```

Negative controls, one per test, each restored before the next: remove the `z_` condition in `isDeclaredSubtrackFolder` (`graph-metadata-parser.ts:854-873`) for the parent-derivation case; remove the `graph-metadata.json` existence guard in `refresh_track_level` (`create.sh`, about line 1012) for the missing-metadata case; make the refresh warning unreachable for the failure case. For the parent-derivation case the control also runs against the current four-segment case first, which must still pass, because that shows it cannot fail for its stated reason.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package. Phases 001 to 003 Complete, a current `runtime/dist` build, and the operator's answers to D-005a, D-005b and D-005c.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a test fails after a repair, or a doc edit makes the 044 packet stop validating. Revert the one commit with `git revert <sha>`; the test repairs and each doc group land as separate commits. If a negative control leaves a source edit behind, `git diff` names the file and `git checkout -- <file>` restores it.
<!-- /ANCHOR:rollback -->

---
