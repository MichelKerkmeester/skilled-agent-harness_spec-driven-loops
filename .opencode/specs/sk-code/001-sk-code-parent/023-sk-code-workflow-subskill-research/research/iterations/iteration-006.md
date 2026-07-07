# Iteration 6: README and checklist contradiction pass

## Focus

This iteration checked target READMEs, checklist assets, and script documentation for contradictions against the ranked proposals from iteration 5. The selected interpretation was narrow: validate whether ancillary docs weaken, strengthen, or re-rank the five proposals without editing any `sk-code` skill files.

## Findings

1. The `code-verify` README strengthens the top-ranked verifier proposal: it tells users to run `python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py` for stack-folder integrity, while iteration 5 showed that script still parses an obsolete `STACK_FOLDERS` contract. This confirms the defect is user-facing documentation plus executable drift, not merely an internal stale script. [SOURCE: .opencode/skills/sk-code/code-verify/README.md:98] [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py:64] [SOURCE: research/iterations/iteration-005.md]
2. The `code-verify` README and `SKILL.md` both use `references/webflow-verification/*` display labels that map to sibling `../code-webflow/references/verification/*` links, while the universal verification checklist still names older monolithic paths like `references/webflow/verification/verification_workflows.md`. This strengthens the stale-path normalization proposal and narrows it: fix both display text and checklist body paths so users see the real sibling-packet owner consistently. [SOURCE: .opencode/skills/sk-code/code-verify/README.md:99] [SOURCE: .opencode/skills/sk-code/code-verify/README.md:114] [SOURCE: .opencode/skills/sk-code/code-verify/assets/universal-verification_checklist.md:71] [SOURCE: .opencode/skills/sk-code/code-verify/assets/universal-verification_checklist.md:120]
3. The `code-debug` README also confirms path-label drift: it points Webflow debugging to sibling `../code-webflow/...` links, but labels those links as `assets/webflow-debugging_checklist.md` and `references/webflow-debugging/*`. This does not change the proposal ranking, but broadens stale-path normalization beyond `SKILL.md` into READMEs and checklist assets. [SOURCE: .opencode/skills/sk-code/code-debug/README.md:48] [SOURCE: .opencode/skills/sk-code/code-debug/README.md:105] [SOURCE: .opencode/skills/sk-code/code-debug/README.md:106]
4. The `code-verify` README confirms the shared handoff schema proposal because it describes the lifecycle only in prose: verification reads the handoff, reports baseline/current/delta/claim scope, and sends failures to owning siblings, but no field schema or required handoff block is supplied. The proposal remains a contract clarification, not a new process. [SOURCE: .opencode/skills/sk-code/code-verify/README.md:58] [SOURCE: .opencode/skills/sk-code/code-verify/README.md:66] [SOURCE: .opencode/skills/sk-code/code-verify/README.md:70]
5. `code-verify/assets/scripts/README.md` only inventories the three scripts and generic handoff purpose; it does not explain that `verify_stack_folders.py` still targets an old architecture. This is partially redundant with finding 1, but adds a smaller proposal detail: if the verifier remains, its script README should state the current registry/surface-packet integrity contract and expected clean/failing semantics. [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/README.md:60] [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/README.md:70] [SOURCE: .opencode/skills/sk-code/code-verify/assets/scripts/README.md:72]

## Ruled Out

- Re-ranking stale-path cleanup above the broken verifier: README/checklist evidence makes path drift broader, but the verifier remains higher impact because it is advertised as a runnable integrity check. [SOURCE: .opencode/skills/sk-code/code-verify/README.md:98]
- Treating sibling links as completely broken: several Markdown links target sibling packet paths, but their visible labels and checklist body text remain stale. The issue is inconsistent owner/path vocabulary, not universal link absence. [SOURCE: .opencode/skills/sk-code/code-verify/README.md:114]
- Editing target README/checklist files during research; the run is research-only and target skills remain read-only. [SOURCE: .opencode/specs/sk-code/001-sk-code-parent/023-sk-code-workflow-subskill-research/research/deep-research-strategy.md:29]

## Dead Ends

- Another broad grep over historical changelogs is unlikely to improve current proposals; it mostly explains why old `STACK_FOLDERS` and monolithic path labels still exist rather than changing what should be upgraded now.
- Re-reading already-covered `SKILL.md` sections is now low value unless a reducer requests exact patch planning.

## Edge Cases

- Ambiguous input: none; the continuation explicitly requested the same bound target and ranked proposals.
- Contradictory evidence: ancillary docs sometimes link to current sibling files while displaying old monolithic labels; resolved as path-vocabulary drift rather than missing-resource failure.
- Missing dependencies: no required state was missing; resource-map generation remains outside this leaf iteration's allowed write set.
- Partial success: the contradiction pass completed, but convergence is not legally reached because new evidence still materially broadens stale-path scope.

## Sources Consulted

- .opencode/skills/sk-code/code-verify/README.md:58
- .opencode/skills/sk-code/code-verify/README.md:66
- .opencode/skills/sk-code/code-verify/README.md:70
- .opencode/skills/sk-code/code-verify/README.md:98
- .opencode/skills/sk-code/code-verify/README.md:99
- .opencode/skills/sk-code/code-verify/README.md:114
- .opencode/skills/sk-code/code-verify/assets/universal-verification_checklist.md:71
- .opencode/skills/sk-code/code-verify/assets/universal-verification_checklist.md:120
- .opencode/skills/sk-code/code-verify/assets/scripts/README.md:70
- .opencode/skills/sk-code/code-debug/README.md:48
- .opencode/skills/sk-code/code-debug/README.md:105
- research/iterations/iteration-005.md

## Assessment

- New information ratio: 0.40
- Questions addressed:
  - What coverage gaps exist across `SKILL.md`, `references/`, and `assets/`?
  - What friction do users or agents encounter when routing, loading, applying, or verifying these skills?
  - Which upgrade proposals have the highest leverage and clearest evidence?
- Questions answered:
  - Ancillary README/checklist docs do not overturn the iteration 5 ranking; they strengthen proposal 1 and broaden proposal 3.
  - Stale path normalization must cover `code-verify` and `code-debug` READMEs/checklist assets, not just primary `SKILL.md` contracts.

## Reflection

- What worked and why: Checking READMEs/checklists against the ranked matrix found user-facing confirmation without redoing the full inventory.
- What did not work and why: Broad grep returned many historical changelog hits; current README/checklist evidence was more actionable than archaeology.
- What I would do differently: Next iteration should either run a final low-new-information convergence synthesis or stop at max only if reducer policy requires additional confirmation.

## Recommended Next Focus

Perform a final convergence check focused on whether any remaining target asset contradicts the top five proposal ordering; if none, synthesize final ranked recommendations and mark convergence once `newInfoRatio <= 0.05`.
