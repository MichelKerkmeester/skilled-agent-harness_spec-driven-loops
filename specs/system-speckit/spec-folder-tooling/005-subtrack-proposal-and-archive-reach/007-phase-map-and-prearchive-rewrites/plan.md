---
title: "Implementation Plan: Phase 7: phase-map-and-prearchive-rewrites"
description: "Extend the reference rewrites of relocate.mjs in place: a bare folder name is rewritten inside the moved phase's own parent folders, and a source under z_archive gains its pre-archive id as a second spelling. Prove both with cases that fail before the fix."
trigger_phrases:
  - "phase map and prearchive rewrites plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: phase-map-and-prearchive-rewrites

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`) and TypeScript test files |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest, run from `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
This phase changes the rewrite transform of `runtime/cli/spec/relocate.mjs` and two suites. The transform gains a bare-name pass that reads only the parent folder of a phase whose parent is unchanged, a row rule for a re-parented phase, and a second spelling for a source under `z_archive/`. Proof is `rg` printing nothing for the old name after a renumber in a `mktemp` copy, and cases that fail before the fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 006 is committed
- [ ] T001 reproduced A2 for a renumber and for a re-parent, and A8, in a `mktemp` copy
- [ ] T002 listed every place a `create.sh --phase` scaffold writes a bare sibling name

### Definition of Done
- [ ] All four requirements pass their acceptance check in `SCRATCH`
- [ ] From `runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place script extension

### Key Components
- **Bare-name pass** (`buildTransform`, from line 608): for an entry whose parent is a packet and is unchanged by the move, the old bare folder name is rewritten in that parent's `spec.md` and `goal.md` and in the sibling children's `spec.md`. The moved child's own Spec Folder row in `implementation-summary.md` joins that list only if T001 shows `repair-derived.cjs` leaves it stale. The name matches only at the start of a line or after a character that is not a letter, a digit, an underscore or a hyphen, so `scaffold-003-gamma` in a `session_id` stays as written and `001-a` never matches inside a longer name. Widening `wholeIdPattern` fails, because it runs over every text file under `specs/` and a bare `NNN-slug` there would match other packets' children. The pass is a second, folder-scoped rule beside it.
- **Row rule** (same transform): a re-parent never takes the bare-name pass, which would leave the old parent naming a folder it does not hold. The rows `spec.md` lists under In Scope are removed from the old parent and added to the new one, and each sibling or own Predecessor and Successor row is set from the phases the parent holds after the move. Each removed, added or set row is printed in the run report, and so is a new parent that has no map or binding table to take a row.
- **Second spelling** (`buildTransform` id map): an entry whose source sits directly in a `z_archive/` also maps `<home>/<name>`, the id it had before it was archived, to its destination. The second spelling applies only when the destination is not under `z_archive/`, so a move from one archive to another rewrites nothing extra, and never when a live folder holds that id. No option is added, because the spelling follows from the source path and `archive.sh:392` is the one caller that needs it.

### Data Flow
`buildPlan` runs the transform over every text file and collects the rewrites. The new rules add rewrites to the same list, so they are printed by a dry run, counted as work and applied by the existing rewrite step.

### Shared Contracts
The owner is `relocate.mjs`. `archive.sh:392` calls it for a renumbering restore. The contract that must not break is that a dry run prints every rewrite the apply will make, which holds because the new rules feed the same list.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reproduces A2 and A8 in a `mktemp` copy and lists the places a phase scaffold writes a bare sibling name. Implementation adds one failing case and then one rewrite rule per requirement in `relocate.mjs`. Verification reruns the reproductions, runs the two suites and validates this folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The suite command is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts`, run from `runtime/cli`, and it must exit 0.

Each rewrite gets one happy-path case and one edge case, and each fails before its fix. The cases assert on the text of the documents after the run. The edge cases hold what must stay: a second phase parent with a child of the same bare name, a `session_id` that ends in the old name, and a live folder that holds the pre-archive id. The two suites stub `repair-derived.cjs`, so the Spec Folder row is checked in `SCRATCH` with the true writers and not in a suite case.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `git`, `rg` and the vitest binary at `.skilled/skills/system-spec-kit/node_modules/.bin/vitest`. No new package. Phase 006 must be committed first. Phase 008 edits `archive.sh` around the same restore call and starts after this phase is committed.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a run rewrites a bare folder name in a document outside the moved phase's parent folders, or redirects a reference to a live packet.
- **Procedure**: revert the one commit that carries this phase. Sources must be committed before a relocate run, so `git checkout -- specs` restores any document the run rewrote.
<!-- /ANCHOR:rollback -->

---
