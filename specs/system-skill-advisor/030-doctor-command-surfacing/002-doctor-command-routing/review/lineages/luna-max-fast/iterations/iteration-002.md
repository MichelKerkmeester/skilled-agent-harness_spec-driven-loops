# Iteration 2 — Doctor command and runtime mirrors

## Dimension

Correctness and traceability across `/doctor:setup`, the doctor route manifest, diagnostic assets, and runtime mirrors.

## Files Reviewed

- `.skilled/commands/doctor/setup.md:1-61`
- `.skilled/commands/doctor/assets/doctor-setup.yaml:1-65`
- `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:1-87`
- `.skilled/commands/doctor/_routes.yaml:292-312`
- `.skilled/commands/doctor/assets/doctor-router-reach.yaml:1-124`
- `.skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml:1-120`
- `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:45-52,138-158,216-219,260-265`
- `.claude/commands/doctor/setup.md:1-61`
- `.codex/prompts/doctor-setup.md:1-12`
- `.cursor/commands/doctor-setup.md:1-61`
- `.pi/prompts/doctor-setup.md:1-12`
- `.hermes/prompts/doctor-setup.md:1-12`
- `.skilled/skills/sk-doc/sk-create-command/SKILL.md:354-366`
- `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:doctor family`

## Findings by Severity

The two P2 findings from iteration 1 remain active. The finding below is new in this pass.

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Doctor phrase reach can report stale scorer behavior as current** — `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:264-265` — The probe imports `runtime/dist/runtime/lib/scorer/fusion.js` directly (`:217-219`) and only checks that the built scorer exists. It does not check whether the artifact is newer than, or otherwise matches, the current scorer sources. A stale but present build therefore produces a completed reach report from old logic.
   - Finding class: stale-build-probe
   - Scope proof: The configured target includes the phrase-reach script, and the doctor router-reach workflow invokes it as its doctor-phrase check (`doctor-router-reach.yaml:97`).
   - Affected surface hints: `/doctor:skill-advisor router-reach`, generated advisor runtime, doctor phrase report.
   - Case: After a change in `runtime/lib/scorer/fusion.ts` stops an advertised phrase from reaching its bridge, the prior `dist/runtime/lib/scorer/fusion.js` still exists. The probe imports that old file and can report `STATUS=OK`, masking the current-source regression.
   - Recommendation: Add a build-freshness check or compare a source/build fingerprint; report the probe as indeterminate when the artifact is stale.

## Traceability Checks

- `route-validate.sh` passed: 14 routes validated, 38 script invocations resolve to workflow activity, J1 route-target parity passed, and K1/K2 found no read-only route declaring a write. It emitted two informational repeated-`--dry-run` warnings for skill-advisor and git targets.
- `command-catalog-mirror-check.cjs` passed: all 39 commands are listed in the command index and applicable hub metadata.
- `sync-runtime-mirrors.cjs --check` passed: 185 mirrors across eight runtime trees are in sync. The Claude and Cursor files also match the canonical setup router; Codex, Pi, and Hermes contain their generated entry-point wrappers.
- `validate_document.py --type command` passed for the canonical router with zero issues. The HVR scan exited 0 with no hard blockers; it reported two mechanical candidates on the router and review-only wording candidates.
- The setup presentation, route, workflow, and repair-command table agree on the five read-only legs and the listed repair commands by direct inspection.
- Runtime tests and the doctor phrase-reach probe were not run. The probe would create a temporary database directory under `os.tmpdir()` (`doctor-phrase-reach.cjs:152`), outside the bound write surface.

## Scope Conflicts

- The doctor phrase-reach validator was not executed because its controlled scoring regime creates and later removes a temporary directory outside the lineage. The result is therefore a static source review, not an observed probe result.
- The combined sk-code drift-guard entry point was not run because it creates a temporary output file with `mktemp` outside the lineage and deletes it afterward. This write boundary also prevents substituting the wrapper with its child guards without the approved gate.
- No write outside the lineage directory was performed.

## Next Dimension

Review DOC-385 through DOC-391, the playbook index, feature-catalog leaves, hook documentation, advisor README, and advisor SKILL.md against their sk-doc authoring contracts.

## Verdict

Review verdict: CONDITIONAL
