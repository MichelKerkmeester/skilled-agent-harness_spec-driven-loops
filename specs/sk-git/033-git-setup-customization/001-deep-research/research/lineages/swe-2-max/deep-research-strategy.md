---
title: "Deep Research Strategy: doctor-style setup path for sk-git"
trigger_phrases: []
---
# Deep Research Strategy: doctor-style setup path for sk-git

## Research Topic

Design a doctor-style setup path for sk-git that lets a repository user adapt sk-git to their own repository, the way `/doctor:sk-code setup` lets them adapt sk-code. Study the sk-code precedent, then map every customizable part of sk-git — for each: what a user would want to change, where it is set today, what breaks when it is changed or removed, and what a read-only setup check would need to prove. Decide placement (`/doctor:git` new action vs separate command), name ideas to reject with reasons, and end with proposed implementation phases.

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node is intentionally skipped.
- All writes are bounded to this lineage directory. Spec writeback, parent/shared telemetry, continuity/memory save, and git staging are out of scope.
- `resource-map.md` was not present at initialization; this lineage emits its own resource map from the completed deltas.
- The sk-code precedent lives in `.skilled/commands/doctor/sk-code.md` + `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` + the sk-code adaptation guide; design rationale lives in `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build` and `029-surface-setup-build`.
- The sk-git customization surface lives in `.skilled/skills/sk-git/` (SKILL.md, hard-rules.json, commit template/rules, branch allowlist, worktree naming, Commit-Id allocator, hook trust, `.skilled/scripts/git-hooks/`, preflight advisory) plus `.skilled/commands/doctor/git.md`.

## Key Questions

- [ ] How does `/doctor:sk-code setup` work mechanically — command surface, check-script contract, check taxonomy, output shape, exit codes?
- [ ] What did the 026/029 sk-code packets decide about what belongs in a setup check vs what stays out?
- [ ] What is the complete inventory of sk-git customizable parts, and where is each set today?
- [ ] For each part: what does a user change, and what breaks when it is changed or removed?
- [ ] What must a read-only setup check prove for each part (existence, parse, values, wiring)?
- [ ] Should setup live in `/doctor:git` as a new action or a separate command — and which alternative ideas should be rejected, with reasons?
- [ ] What implementation phases should the synthesis propose?

## Answered Questions

_(none yet)_

## What Worked

_(to be filled by iterations)_

## What Failed

_(to be filled by iterations)_

## Exhausted Approaches

_(none yet)_

## Ruled-Out Directions

_(none yet)_

## Next Focus

Iteration 1: the sk-code doctor precedent — `.skilled/commands/doctor/sk-code.md`, `sk-code-setup-check.cjs`, and the sk-code adaptation guide.
