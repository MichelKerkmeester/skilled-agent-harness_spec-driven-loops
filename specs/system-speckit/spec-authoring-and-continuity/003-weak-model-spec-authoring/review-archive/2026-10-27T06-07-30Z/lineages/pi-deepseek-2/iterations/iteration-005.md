# Iteration 5 - The two guard scripts the packet added, tested for sensitivity rather than presence

## Focus

Correctness of the guards themselves: does `check-example-drift.sh` fail when examples drift, does `check-card-sync.sh` fail when the four card surfaces diverge, and can either of them report success without testing anything? Presence of an `EXAMPLE_DRIFT_OK` line is not evidence; the test applied here is a mutation probe and a dependency probe, both run against throwaway copies.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:1-44` (whole file)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:1-172` (whole file)
- `.skilled/skills/system-spec-kit/templates/examples/` (`level-1`, `level-2`, `level-3`, `level-3+`, `README.md`)
- `.skilled/skills/system-spec-kit/templates/core/*.tmpl` (section and `<!-- FILL: ... GOOD: ... WEAK: ... -->` counts)
- Probe runs of both guards against the shipped tree, against a copied `level-2` tree with one anchor removed, against an empty `level-*` tree, and against the copied tree with `rg` removed from `PATH`
- `package.json`, `.skilled/package.json`, `.skilled/skills/system-spec-kit/package.json` (ripgrep declaration check)
- `specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/acceptance-criteria.md:58,62`
- `specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/spec.md:24,43`

## Findings

### P0 Findings

None.

### P1 Findings

1. **Both new guards depend on `rg` with no preflight and no declaration, and without it the drift guard reports `EXAMPLE_DRIFT_OK` on a tree with a missing anchor** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:31` -- The guard's only drift reporting path is `printf '%s\n' "$report" | rg '^(missing_anchor|extra_anchor)'` (`:31`) plus `printf ... | rg -q ... && status=1` (`:39`). With `//bin` scratch space on `PATH` holding `node` but not `rg`, the same mutated copy that fails with `FAIL ...: missing_anchor metadata` prints `EXAMPLE_DRIFT_OK` and exits 0. `check-card-sync.sh` has the same undeclared dependency at its checklist check, where a missing `rg` makes the `if` fall through to `pass`. Neither script preflights `command -v rg`, and `rg` appears in no `package.json`, so the dependency is undocumented. The consequence is direct: parent completion criterion 4 (`goal.md:93`), phase 004's handoff criterion (`004/spec.md:43`) and phase 009's `C4` line all read a single `EXAMPLE_DRIFT_OK` string, and that string is reachable on a machine without ripgrep while anchors are missing.
   - Claim: the drift guard can print its success string on a tree that has drifted.
   - Evidence refs: `check-example-drift.sh:31`, `:39`; `check-card-sync.sh:114`; probe output `FAIL ... missing_anchor metadata` versus `EXAMPLE_DRIFT_OK` under the same input.
   - Counterevidence sought: a caller that preflights ripgrep, or a package declaration. `rg -l "\brg -" runtime/cli/spec/*.sh` returns only these two scripts, `rg -c "command -v rg"` returns nothing, and no `package.json` names ripgrep or a ripgrep package.
   - Alternative explanation: the guards are only ever run from an environment where `rg` is guaranteed, e.g. an agent session. Rejected as a reason to accept it: phase 004 and phase 009 both record the guard's exit status as the gate, and the guard is shipped as a public script of the skill with a `Usage` line and exit codes.
   - Final severity: P1, confidence 0.9.
   - Downgrade trigger: a preflight or a dependency pin added to either script, or a caller that refuses to run without ripgrep.

### P2 Findings

1. **The card-sync guard's fourth surface is checked only negatively, so a checklist that sends a reader nowhere passes** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:113` -- The header states the guard reads four surfaces, one of which is "the checklist that sends a reader to a filled example" (`:5-7`). The implemented check is `if rg -q 'Read templates from \`.skilled/skills/system-spec-kit/templates/\`' "$CHECKLIST"; then fail ... else pass ...`, which fires only when the checklist names the templates root. A checklist that never mentions the card, never names an example, or was emptied of its pointers passes, because absence of one bad string is the whole assertion. The other three surfaces are checked positively (card exists and is short, each intent block names the card, the manifest and alias file list it).
2. **The drift guard has no coverage floor over the example tree, so a level directory holding no `.md` file fails only by accident** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:18` -- `for example in "$dir"/*.md` leaves the glob unexpanded when no `.md` exists, which feeds the literal path to `awk` and produces `FAIL ...: description does not end with a period` plus an `awk: can't open file` line on stderr. It fails closed, which is the right direction, but the failure is an artifact of glob expansion rather than a stated check, and the message names a description defect where the real defect is an empty or renamed example. Recorded as advisory rather than as a correctness break.

## Traceability Checks

- **Guard sensitivity, proven rather than assumed**: a copy of `templates/examples/level-2` with `<!-- ANCHOR:metadata -->` removed fails with `missing_anchor metadata` and exit 1; the unmodified copy prints `EXAMPLE_DRIFT_OK` and exits 0. The anchor comparison is real and delegated to `template-structure.js compare`.
- **Card-sync sensitivity**: all nine checks pass on the shipped tree (`card-exists (172 lines)`, four intents, `guide-on-demand-only`, `leaf-manifest`, `leaf-aliases`, `checklist`). Each positive check is an existence assertion over a parsed surface, so removing the card or its manifest entry fails closed.
- **Phase 004's section-guidance claim**: every `##` section of every core template carries one `<!-- FILL: ... GOOD: ... WEAK: ... -->` comment — `spec.md.tmpl` 24/24, `plan.md.tmpl` 18/18, `tasks.md.tmpl` 22/22, `implementation-summary.md.tmpl` 6/6. The fill-test count of 16 in `004/spec.md:43` counts required sections at the tested level, not all sections, so no contradiction.
- **Phase 004 AC-005/AC-009** (`004/acceptance-criteria.md:58,62`): AC-005's evidence is the guard's own success string, which is exactly the string finding 1 shows can be produced without the comparison having run; AC-009's failing-first evidence (`drift guard: description holds an HTML comment tail`) does prove the description rules fire.
- Overlay protocols: `skill_agent` and `agent_cross_runtime` deferred to iteration 6; `playbook_capability` to iteration 7.

## Confirmed-Clean Surfaces

- The drift guard's description rules are real and were shown firing: the phase 004 failing-first record holds `drift guard: description holds an HTML comment tail`, and every shipped example satisfies the three rules.
- No vacuous pass over an empty tree: an empty `level-2` produces exit 1, not success. Ruled out as a fail-open.
- `check-card-sync.sh` handles its own argument errors (`--skill-root` without a path exits 2, unknown option exits 2) and reads its usage block from its own header, so `--help` cannot drift from the documented contract.
- Neither guard writes a file, matching both headers' "Read-only" statement: `set -euo pipefail`, no redirect, no temp file.

## Assessment

Dimensions addressed: correctness

One P1 and two P2 findings. The guards are not theatre — the anchor comparison catches a single removed anchor — but the drift guard's success string is reachable without ripgrep, and the string is the gate for three separate criteria in this packet. The card-sync gap is narrower: one of its four claimed surfaces is asserted only by absence.

## Next Focus

Iteration 6 (traceability, overlay protocols `skill_agent` and `agent_cross_runtime`): phase 006's claim that every speckit and doctor command and every doc-authoring agent names the card, the v2.3 token form and the guard scripts where it describes authoring. Check the audit table's rows against the files, look for shipped assets that still describe `checklist.md` or the pre-v2.3 hint form, and compare the markdown agent definition across the runtime directories.

Review verdict: CONDITIONAL
