# Iteration 1: Correctness - the two authoring guards read as programs

## Dimension

Correctness. The phase 004/005 guard scripts `check-example-drift.sh` and `check-card-sync.sh`, and the comparison library they call, `runtime/cli/utils/template-structure.js`. The question is not whether the guards exit 0 on today's tree - they do - but whether each guard's exit code still tracks the condition it claims to prove.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:1-44`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:1-120`
- `.skilled/skills/system-spec-kit/runtime/cli/utils/template-structure.js:893-975`
- `.skilled/skills/system-spec-kit/leaf-manifest.json` (`modes` array, one entry)
- `.skilled/skills/system-spec-kit/leaf-aliases.json` (card entry present)
- `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:36`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` (172 lines, under the 260-line cap)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None. The two false-negative paths below need a broken environment (no `rg` on PATH) or a shape the packet never produces (anchor reordering), so neither currently hides a defect in the reviewed tree.

### P2 Findings

1. **The drift guard discards `out_of_order_anchor`, so a reordered example passes** - `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:35` - The guard forwards the comparison report through `rg '^(missing_anchor|extra_anchor)'` for both its print loop and its status test (lines 35 and 39). The comparison library also emits a third drift class, `out_of_order_anchor` ([SOURCE: .skilled/skills/system-spec-kit/runtime/cli/utils/template-structure.js:921]), computed by the same `compareRequiredSequence` pass that the template contract uses for ordering. Nothing else in the skill consumes that line either: a repo-wide `rg -n "out_of_order"` over `.skilled/skills/system-spec-kit` returns only the two emitters at `template-structure.js:912,921` and no reader. An example whose anchors are all present but emitted in the wrong order therefore prints no FAIL line and leaves `status` at 0.
   Finding class: gate-false-negative
   Scope proof: guard lines 35 and 39 read directly; the emitter at `template-structure.js:921` and the absence of any consumer were both checked with `rg`.
   Affected surface hints: example drift guard, template-structure comparison library, phase 004 handoff criterion
   Case: move `<anchor:scope>` below `<anchor:problem>` in `templates/examples/level-2/spec.md`; the guard still prints `EXAMPLE_DRIFT_OK`.

2. **`check-card-sync.sh` asks `jq -e` a per-mode question and reads only the last answer** - `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:98` - `jq -e '.modes[].leaves | index($p) != null'` streams one boolean per mode, and `-e` sets the exit status from the *last* output only. With more than one mode the check passes when only the final mode lists the card and fails when only an earlier one does. Today `leaf-manifest.json` carries a single mode (`jq '.modes | keys'` prints `[0]`), so the defect is latent; the guard's own contract, however, is "the leaf inventory lists it" for the whole inventory.
   Finding class: gate-false-negative
   Scope proof: guard line 98 read directly; the mode count was read from `leaf-manifest.json` with `jq`, so the latent state is observed rather than inferred.
   Affected surface hints: card sync guard, leaf manifest, phase 005 handoff criterion
   Case: add a second mode to `leaf-manifest.json` that omits `references/workflows/spec-authoring-card.md`; the guard still prints `PASS leaf-manifest`.

3. **The drift guard reports success when `rg` is not installed** - `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:35` - The script runs under `set -uo pipefail` without `-e` and never checks that `rg` resolves. When the binary is absent, both `rg` invocations fail with 127: the print pipeline's failure is discarded (its output is the loop in a subshell), and the status test at line 39 is `rg -q ... && status=1`, so a command-not-found on the left side leaves `status` at 0 and flow reaches `echo EXAMPLE_DRIFT_OK` (line 43). A guard whose tool is missing reports the tree as clean.
   Finding class: gate-false-negative
   Scope proof: guard lines 5, 35, 39 and 43 read directly; the failure path follows from `set -uo pipefail` plus the `&&` status test.
   Affected surface hints: example drift guard, ripgrep dependency, phase 004 handoff criterion
   Case: run the guard in a container without ripgrep; it prints `EXAMPLE_DRIFT_OK` and exits 0.

4. **The checklist check proves only that the old sentence is gone** - `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:110` - Check 5 is titled "The checklist sends a reader to a filled example, not the gated source root", but its whole body is a negative grep for the retired sentence. Deleting the checklist's example pointer altogether - the sentence at [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:36] that sends a reader to `templates/examples/` - leaves the guard at `pass checklist`. The positive half of the claim is untested.
   Finding class: gate-coverage-gap
   Scope proof: guard lines 109-114 read directly; the pointer the check is named for is present once in the checklist at line 36 and is not grepped for.
   Affected surface hints: card sync guard, authoring checklist, card followability
   Case: remove line 36 from the checklist; `check-card-sync.sh` still reports `CARD SYNC OK`.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `004-template-section-fill-guidance/spec.md` REQ for the drift guard; `check-example-drift.sh:35,39` | The guard exists and runs; two of its three drift classes plus the missing-tool path do not reach the exit code. |
| `checklist_evidence` | pending | hard | `004-template-section-fill-guidance/acceptance-criteria.md`, `005-weak-model-authoring-card/acceptance-criteria.md` | The two guard rows are audited in the checklist-evidence pass. |
| `skill_agent` | notApplicable | advisory | - | No skill definition reviewed this iteration. |
| `agent_cross_runtime` | notApplicable | advisory | - | No agent definition reviewed this iteration. |
| `feature_catalog_code` | pending | advisory | `feature-catalog/**` guard leaves | Catalog claims about the guards are audited in a later pass. |
| `playbook_capability` | pending | advisory | `manual-testing-playbook/` guard scenarios | Scenario claims are audited in a later pass. |

## Verdict

Four P2 findings, no P0 or P1. Both guards do exit 0 on the current tree for the shapes the packet exercises; the holes are in drift classes and environments the tree does not currently contain.

## Next Dimension

Security. The packet's own operating instructions: scratch paths, worktree handling, and the destructive verbs the playbook scenarios ask an operator to run.

Review verdict: PASS
