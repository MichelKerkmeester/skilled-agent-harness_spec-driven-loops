---
title: "Implementation Plan: Phase 8: restore-and-phase-numbering"
description: "Extend archive.sh, relocate.mjs and create.sh in place: relocate gains one exit status for a close whose only failure is a moved packet's validation, the restore reads it and asks the relocate preflight before it moves anything, and the phase numbering loop reads z_archive. Prove each with a case that fails before the fix."
trigger_phrases:
  - "restore and phase numbering plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: restore-and-phase-numbering

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | bash, Node.js ESM (`.mjs`) and TypeScript test files |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest, run from `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
This phase changes three scripts and the README in `runtime/cli/spec/` and three suites, and adds no file. `relocate.mjs` gains one exit status, `archive.sh` reads it and asks the relocate preflight before a restore, `create.sh` reads the parent's `z_archive/` when it numbers a phase, and `README.md` states the added status. Proof is three reproductions in a `mktemp` copy that end as the requirements state, and cases that fail before the fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 006 and 007 are committed
- [ ] T001 reproduced A6, A7 and A9 in a `mktemp` copy
- [ ] T002 listed every caller of `relocate.mjs` that reads its exit status

### Definition of Done
- [ ] All three requirements pass their acceptance check in `SCRATCH`
- [ ] From `runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/archive-track.vitest.ts tests/archive-numbering.vitest.ts tests/relocate.vitest.ts` exits 0
- [ ] `bash -n` on `archive.sh` and `create.sh` and `node --check` on `relocate.mjs` exit 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place script extension

### Key Components
- **Close verdict** (`relocate.mjs`, the return at line 1285 and the header at lines 34 to 36): exit 2 covers a failed step and a failed closing validation today, so `archive.sh:392` cannot tell a stopped restore from a finished one. Reading the existing status fails for that reason. The planned move is one added status, 3, for a run whose steps and sweep all passed and whose only failure is a moved packet's validation. Such a run has landed in the sense phase 006 fixes: its completion mark is set once the sweep has passed, so the same call again prints `relocate: nothing to do` and exits 0. Both phases mean the same thing by landed.
- **Restore verdict** (`archive.sh` `restore_on_next_number`, lines 361 to 397): status 3 prints the success line and a warning that names the packet, and the script exits 0. Any other non-zero status keeps `Restore did not finish` and exit 1. `archive.sh:12` sets `set -euo pipefail` and line 392 tests the call with `if !`, which drops the status, so the call becomes `status=0; node … || status=$?` and the branches read `$status`.
- **Mixed-track refusal** (`archive.sh` restore, lines 658 to 716): before the `mv` and before the renumbering call, the restore runs the relocate preflight for the same move without `--apply`. The preflight already holds the mixed-track rule at `relocate.mjs:536-554`, so no sub-track predicate is copied into `archive.sh`. The restore refuses only when the preflight output holds the mixed-track line (`would hold flat packets`). Any other preflight result leaves the restore as it is today. Reading the exit status fails here, because the preflight also exits 2 for a dirty track root, which is what an archive leaves until it is committed.
- **Phase numbering** (`create.sh`, lines 1808 to 1821): the loop gains a second glob over `"$FEATURE_DIR"/z_archive/`. The highest number comes from both globs, and the last existing phase, which names the predecessor, from the live glob only.

### Data Flow
`archive.sh --restore` resolves the archived folder and its home, asks the preflight, then either moves the folder itself or hands the move to `relocate.mjs`, whose exit status decides the message. `create.sh --phase --parent` reads the highest phase number, live or archived, and numbers the new children after it.

### Shared Contracts
The owner of the exit status is `relocate.mjs`. Its callers are `archive.sh:392` and the two suites. The contract is the list at lines 34 to 36: statuses 0, 1 and 2 keep their meaning, except that a close whose only failure is a moved packet's validation moves from 2 to 3. That is an amendment to decision D1 of phase 006 for this one case, and both goals say so. It also amends REQ-001 and REQ-012 of phase 001, which say 2 on any failure. That phase is Complete and is not edited, so the parent `spec.md` Operator Decisions carry the amendment. The exit-code sentence in the `relocate.mjs` row of `runtime/cli/spec/README.md`, line 120, changes with the header.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reproduces A6, A7 and A9 in a `mktemp` copy and lists the callers of `relocate.mjs`. Implementation adds one failing case and then one fix per requirement in `create.sh`, `relocate.mjs` and `archive.sh`. Verification reruns the reproductions, runs the three suites and validates this folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The suite command is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/archive-track.vitest.ts tests/archive-numbering.vitest.ts tests/relocate.vitest.ts`, run from `runtime/cli`, and it must exit 0.

Each changed surface gets one happy-path case and one edge case, and each fails before its fix. The numbering cases assert the created folder name and the Predecessor row. The restore cases assert the exit status, the printed line and where the folder is afterwards. The edge cases are a step that really fails, a track with no sub-track, an archive followed by a restore with no commit in between, and an archive that holds only a lower number.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash`, `node`, `git` and the vitest binary at `.skilled/skills/system-spec-kit/node_modules/.bin/vitest`. No new package. Phases 006 and 007 must be committed first.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a restore that stopped partway is reported as done, or `create.sh --phase --parent` numbers a phase that already exists.
- **Procedure**: revert the one commit that carries this phase. The three scripts return to the phase 007 state together.
<!-- /ANCHOR:rollback -->

---
