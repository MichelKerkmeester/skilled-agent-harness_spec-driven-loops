# Iteration 4: Maintainability - two authoring paths, one of them unguarded

## Dimension

Maintainability. The card that the four authoring intents load, the checklist that names itself the companion of the write recipe, the sync guard that compares them, and the playbook scenario that exercises the card end to end. The question is what a future editor can break without a red check.

## Files Reviewed

- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:20-162`
- `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:33-60`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:46,109-114`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:45-135`
- `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/fixes/status.txt`, `scratch/worktree/removal.txt`
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` (`versions` map against every `SPECKIT_TEMPLATE_SOURCE` stamp)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/template-version-parity.vitest.ts` (exists)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The card and the checklist describe different authoring surfaces, and the guard compares one sentence** - `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:150` - The checklist's step 4 requires `_memory.continuity` frontmatter and its step 5 requires `description.json` and `graph-metadata.json` to be refreshed after authoring ([SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:42-43]), and its post-checks add a cross-runtime mirror parity check ([SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:55]). The card, which is what `PLAN`, `IMPLEMENT`, `INTAKE` and `TEMPLATE_AUTHORING` load, runs from `BOUNDS` through `WHEN TO STOP AND ASK` without naming continuity, generated metadata, or mirror parity once ([SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:20-162]). The only comparison between the two documents is a negative grep for one retired sentence ([SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:110]), so a future edit that changes step 5 of the checklist, or that adds a required metadata step to the card, keeps the guard green. A weak model on the card path therefore ships a packet with stale generated metadata and the checklist's own reader would not notice the divergence.
   Finding class: followability-gap
   Scope proof: both documents were read in full; the guard's checklist check was read line by line and contains one negative pattern.
   Affected surface hints: authoring card, authoring checklist, card sync guard, metadata refresh scripts
   Case: the card's `CLOSE` section is edited to drop its validator step; no guard fails, because nothing compares the card's steps with the checklist's.

2. **The end-to-end card scenario leaves its own state behind and still reports cleanup** - `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:51` - Step 1 writes a scratch pointer into another packet's folder, `specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt`, and creates a `mktemp -d` that is never removed ([SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:51-54]). Step 4 removes only `specs/zz-pb-card` ([SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:112-116]), yet the expected output and the Pass condition both say `cleanup=ok` ([SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:128]). Two leftovers follow: the pointer file survives every run, and the reply file stays in a temp directory that no step owns. The consequence is already visible in phase 008, whose removal record has to carry an extra untracked path and a `--no-index` patch entry for exactly this file. Every other template-authoring scenario cleans its `$OUT` in its last step, so this one is the outlier.
   Finding class: non-hermetic-test-procedure
   Scope proof: all four steps and the Pass/Fail block read end to end; the other seven scenarios were compared for the same closing step.
   Affected surface hints: playbook scenario 483, phase 008 removal record, scratch hygiene
   Case: run the scenario twice; the second run reads the first run's pointer until step 1 overwrites it, and both temp directories stay under `$TMPDIR`.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | pass | hard | `template-version-parity.vitest.ts`; `spec-kit-docs.json` `versions` vs all 18 stamps | The manifest and every template stamp agree; a parity test already guards it. |
| `checklist_evidence` | partial | hard | `spec-folder-authoring-checklist.md:42-43,55` against the card | The checklist's steps 4 and 5 have no counterpart in the card. |
| `skill_agent` | partial | advisory | `SKILL.md` intents load the card; the guide is on-demand only | The router side of the claim holds. |
| `agent_cross_runtime` | notApplicable | advisory | - | No agent definition reviewed this iteration. |
| `feature_catalog_code` | pending | advisory | `feature-catalog/tooling-and-scripts/` leaves | Audited next. |
| `playbook_capability` | partial | advisory | `level-1-packet-authored-from-card.md:51-116` | The scenario's cleanup claim covers one of its two leftovers. |

## Verdict

Two P2 findings. The template registry, the version parity test and the router side of the card all hold under the checks this iteration ran; the two gaps are in what future edits can break silently.

## Next Dimension

Traceability, overlay. The four catalog leaves the packet added, read against the code they describe.

Review verdict: PASS
