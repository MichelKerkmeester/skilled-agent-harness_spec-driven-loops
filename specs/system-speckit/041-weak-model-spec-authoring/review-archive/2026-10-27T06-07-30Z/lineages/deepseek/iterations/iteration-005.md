# Iteration 5: Correctness - the card's commands against the artifacts they point at

## Dimension

Correctness. The authoring card's step-by-step acceptance commands checked against the scaffold it prescribes, the example it tells the model to imitate, and the validator output it promises.

## Files Reviewed

- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:20-172`
- `.skilled/skills/system-spec-kit/templates/examples/level-1/tasks.md`
- `.skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md:20-60`
- `.skilled/skills/system-spec-kit/templates/examples/level-3/tasks.md`
- `.skilled/skills/system-spec-kit/templates/examples/level-3+/tasks.md`
- `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:38-90`
- `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:1-100`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2070-2140`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1330-1360`
- `specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/spec.md:95-105`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The example the card tells a weak model to imitate uses the task format the card forbids** -- `.skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md:32` -- Step 4 tells the reader to open a rendered example and says the examples are "safe to imitate for shape"; step 7 then requires every task line to end with a `Verify:` clause, and the v2.3 tasks template's own format is `T### [P?] Description (file path). Verify: <command> prints <expected output>`. The Level 1, 2, 3 and 3+ examples instead declare `Task Format: T### [P?] Description (file path) [effort]` and contain no `Verify:` line at all. Phase 005's Out of Scope records "Rewriting the filled example task lines" as a known deferral, but the card's instruction to imitate the example still points at the contradicting format, and the example's notation block is the concrete model a weak model copies.
   Finding class: followability-contradiction
   Scope proof: all four example task files were read; the template format line is `tasks.md.tmpl:53`; the card's step 4 and step 7 were read; phase 005's Out of Scope line names the deferral.
   Affected surface hints: authoring card step 4 and step 7, four example task files, tasks template format
   Case: a weak model reads the Level 2 example, copies `T### ... [effort]` for its own tasks, and fails the card's own step 7 acceptance command with zero `Verify:` lines.

```json
{
  "type": "claim-adjudication",
  "findingId": "R5-P1-001",
  "claim": "The card tells a weak model to imitate an example whose task format contradicts the Verify: format the card and the v2.3 template require.",
  "evidenceRefs": [
    ".skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md:32",
    ".skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:53",
    ".skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:62,110-122",
    "specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/spec.md:101"
  ],
  "counterevidenceSought": "Checked whether another card step narrows 'shape' to section structure only; step 4 names spec.md and tasks.md together and the example's own Task Format line is the only task-format guidance inside it. Checked whether the examples were regenerated for v2.3; all four still carry v2.2 stamps and no Verify: lines.",
  "alternativeExplanation": "A model that follows the card's steps in order reads step 7 after step 4, so the explicit rule may win over the example. Rejected as a full explanation because the example is the concrete artifact and the card calls it safe to imitate, which is the failure mode this packet exists to prevent.",
  "finalSeverity": "P1",
  "confidence": 0.78,
  "downgradeTrigger": "Downgrade to P2 if the card says the examples are for section shape only and the example Task Format lines are updated to the Verify: form.",
  "transitions": [{ "iteration": 5, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

### P2 Findings

1. **The card's task acceptance command fails a correctly completed packet** -- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:122` -- The command compares `rg -c 'Verify: '` with `rg -c '^- \[ \] T[0-9]'` and expects the same number. The second pattern counts pending tasks only, while `Verify:` lines remain on tasks marked `[x]`, and step 7 itself tells the model to mark tasks `[x]` after their verify command passes. A finished packet therefore reports more `Verify:` lines than pending tasks and fails the card's acceptance line, even though every task ends with a Verify clause.
   Finding class: acceptance-command-error
   Scope proof: the card's step 7 rules and command were read; the template's `[x]` notation is `tasks.md.tmpl:40-50`.
   Affected surface hints: authoring card step 7, tasks template notation
   Case: a packet with three tasks, all marked `[x]` and each carrying `Verify:`, prints `3` and `0` and fails the card's own check.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | fail | hard | `spec-authoring-card.md:52,110-122`; `examples/level-2/tasks.md:34`; `tasks.md.tmpl:53` | The card's example advice and its format rule disagree. |
| `checklist_evidence` | pending | hard | - | Deferred to the checklist pass. |
| `skill_agent` | partial | advisory | `spec-authoring-card.md:18` | Same dangling guide pointer as iteration 4. |
| `agent_cross_runtime` | pending | advisory | - | Audited later. |
| `feature_catalog_code` | partial | advisory | `versioned-placeholder-gate.md:36` | Same leaf as iteration 1. |
| `playbook_capability` | pending | advisory | - | Audited later. |

## Edge Cases

- The Level 1 example is also v2.2 and also has no `Verify:` lines, so the contradiction is not limited to one level.
- The card's step 9 promise matches the orchestrator: `Summary: Errors: 0` is printed above `RESULT: PASSED` (`orchestrator.ts:1353-1354`).
- `create.sh` does create `scratch/` on both the normal and subfolder paths (`create.sh:2111-2112`), so the card's step 3 acceptance holds.
- The goal template's section 4 is LOG, so the card's "write an open question in `goal.md` section 4" lands in the log rather than the frontmatter's `open_questions` field; the packet's own goal uses the log this way, so it is consistent practice rather than a defect.

## Confirmed-Clean Surfaces

- The card's scaffold command flags all exist and are accepted: `--skip-branch`, `--with-goal`, `--level`, `--track`, `--short-name`.
- `recommend-level.sh` accepts `--loc` and `--files` and prints a level, including Level 0, which the card maps to Level 1.
- The card's step 9 validator command and output strings match `validate.sh`'s summary and result lines.
- The card's step 8 token command is correct for the three documents it names; its coverage gap is already reported as R1-P2-003.

## Ruled Out

- A wrong level mapping in the card: ruled out; `recommend-level.sh` documents Level 0 and the card's fallback is deliberate.
- A missing `scratch/` directory after `create.sh`: ruled out; both scaffold paths create it.
- A mismatch between the card's validator strings and the real output: ruled out at `orchestrator.ts:1353-1354`.

## Next Focus

Iteration 6 - traceability - `checklist_evidence` across the nine child `acceptance-criteria.md` files: every row's evidence checked for a command and an observed result, and every phase's checklist verified against the tasks it claims to close.

Review verdict: CONDITIONAL
