## Shared rules for every phase author

Gate 3 is pre-resolved: your write authority is YOUR phase folder only, named in your brief. Do not
ask the documentation-scope question. Do NOT edit anything under `.opencode/` — this is authoring,
not implementation. Do not touch another phase's folder, the parent `goal.md` or the parent `spec.md`.

**Read first, in this order.**
1. `specs/sk-design/019-sk-design-diagram-upgrade/goal.md` — the parent decisions D1–D17. Your phase
   goal refines them by id; it never restates or contradicts them.
2. `specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/scratch/evidence/manual-review-opus.md`
   — the 38-file manual review: 34 numbered findings (F1–F34) and ten systemic patterns (S1–S10).
   Its per-file table, findings and systemic sections are the fact base for every phase.
3. An already-written sibling for shape: `005-checker-mutations-and-ci/` (spec.md, plan.md, tasks.md,
   goal.md). Match its structure, its density and its voice. Do not copy its content.

**What to write.** The scaffold already exists in your folder: `spec.md`, `plan.md`, `tasks.md`,
`acceptance-criteria.md`, `goal.md`, `implementation-summary.md`. Fill them. Keep the template
anchors and frontmatter intact. `implementation-summary.md` stays a scaffold — execution fills it.

**How to write.**
- Every task names the exact file it touches and the exact check that proves it. A task nobody can
  verify from the final state is not a task.
- Findings are referenced by their number in prose (`F12`), never invented. If your phase does not
  cover a finding the review raised in your area, say so and why.
- The nested `goal.md` carries: the phase objective in one sentence, the parent decision ids it
  refines, its own completion criteria as checkboxes that a command or a read can settle, and a
  binding line pointing back to the parent goal.
- Plain prose. No praise, no hedging, no future-work padding. Say what is true and what must hold.
- Comment hygiene is a hard block: never write a spec path, finding id or task id into any code
  comment you propose. Specs may name them freely; code comments carry the durable why only.

**Finish like this.** From the repository root, for YOUR folder only:
```
node .opencode/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js <folder> "$PWD"
node .opencode/skills/system-spec-kit/runtime/cli/dist/graph/backfill-graph-metadata.js <folder>
NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/runtime/cli/spec/validate.sh" <folder> --strict --no-recursive
```
Repeat until the output contains the literal line `RESULT: PASSED`. An exit code alone is not proof;
read the rule lines. Report at the end: the folder, the task count, the criteria count, and the
`RESULT:` line you actually saw.
