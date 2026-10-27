---
title: "Changelog: Phase 22: advisor-routing-and-local-install [054-weak-model-spec-authoring/022-advisor-routing-and-local-install]"
description: "Chronological changelog for the Phase 22: advisor-routing-and-local-install phase."
trigger_phrases:
  - "weak model spec authoring advisor routing and local install changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-27

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/022-advisor-routing-and-local-install` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 022 closes the four items phase 021 left open:
- **Doctor routing.** "disable comment hygiene gate" now routes to `/doctor:git hooks` instead of sk-code.
- **Typed `/deep:research` prompts.** A typed `/deep:research :auto` prompt now routes to system-deep-loop in the live advisor, instead of to the system-spec-kit skill it depends on.
- **Draft auto-repair.** Prompts naming the draft auto-repair route to system-spec-kit again.
- **Private commands.** A private `local-*` command now reaches every worktree from one copy in the primary checkout.

sk-git is now 1.9.7.0.

### Added

- `typed-command-routing.vitest.ts`, with a test for the graph bound, the chained bound and the suffix strip, plus controls. The Python test T243-SA-029 covers the twin.
- `_wn_link_local_commands` in `worktree-naming.sh`, run by `provision`, with fixture tests. Also added: the sk-git release note `v1.9.7.0.md`.

### Changed

- **Doctor route.** The `/doctor:git hooks` route has a lead phrase, and the bridges are regenerated.
- **Graph lane.** It reports how much support each seed lends each target. In fusion, a seed named by a typed slash command can lift a neighbour up to itself but never past it, and a chain of such seeds settles to a fixed point.
- **Prompt lanes.** All five lanes that read the prompt, and the Python twin, drop `:auto`, `:confirm`, `:autopilot` and `:unattended` after a slash command.
- **Advisor phrases.** `draft auto-repair` is restored in system-spec-kit's phrases, and `skill-graph.json` is recompiled.

### Fixed

- The doctor-routing-slice test, which failed before this packet started.
- The live rr-iter3-168 misroute, worth 0.008, and Draft-auto-repair prompts routing to no skill.
- The private alignment command existed only in worktree 217.

### Verification

- Advisor suite 150 of 150 files, 1243 tests, up from 1 failed of 149. Python twin `pass=85, fail=0`.
- Each new test fails without its fix. The independent review's one P2 is fixed, and its test fails on the old bound.
- The five probe prompts route correctly both live and local.
- sk-git harness `PASS=171 FAIL=0`, and `FAIL=8` against the previous script.
- The routing drift workflow's static checks, graph freshness and the bridge check all pass. Hermes reports `PASS: 67`.
- `validate.sh` on packet 054, `--strict --recursive`: 23 of 23 `RESULT: PASSED`.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/commands/doctor/_routes.yaml` | Modified | Hooks route lead phrase |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/` (fusion, text, projection, six lanes) | Modified | Seed bound, prompt tokenizer, lead phrase |
| `.skilled/skills/system-skill-advisor/runtime/scripts/` (`skill_advisor.py`, bridges, `skill-graph.json`) | Modified | Twin strip, bridges, recompiled graph |
| `.skilled/skills/system-skill-advisor/runtime/tests/` | Created, Modified | Typed-command tests, T243-SA-029 |
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modified | `draft auto-repair` restored |
| `.skilled/skills/sk-git/` (provision script, its test, SKILL.md, release note) and the Hermes copy | Modified, Created | Link step, rule 8, 1.9.7.0 |

### Follow-Ups

- Private `local-*` skills are not linked into worktrees; linking them changes what advisor and graph tests see in a worktree.
- The rr-iter3-168 live margin is one millionth, held by the bound rather than by evidence.
