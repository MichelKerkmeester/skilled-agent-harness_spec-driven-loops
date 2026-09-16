---
title: "Gate filters under a linked root"
description: "Question 4: with .opencode reached through a link, which commit and push gates still find their scripts, and which path filters silently miss changes staged under .skilled/."
---

# Gate filters under a linked root (Q4)

**Result:** with `.opencode` resolving through a link, every gate still finds its script. Seven path filters test the literal `.opencode/` prefix, though, so a change staged under `.skilled/` goes through without the gate checking it, and nothing is printed. Shapes A and B behave the same on all twelve gates. A control in the same repository with no move and the same edits under `.opencode/` trips every one of those filters. The misses come from the layout, not from the probe.

## Method

Run by the orchestrator on 2026-09-16 with `SYSTEM_HOOKS_DISABLED` unset. Commands are the `../plan.md` §Probe P4 block plus a second staging round. The shape clones are `links-shape-a` (`.opencode -> .skilled`) and `links-shape-b` (seven per-entry links), each with a layout commit first. The control is the `rehearsal` clone checked out at base `d26f0c60ca`, with the same edits staged under `.opencode/`. Traces sit in `/tmp/skilled-probes-003/logs/`: `shape-{a,b}-pre-commit.trace`, `shape-{a,b}-pre-push.trace`, `links-shape-{a,b}-pre-commit-round2.trace`, and `control-pre-commit.trace`, `control-pre-push.trace`, `rehearsal-pre-commit-round2.trace` for the control.

- **Round 1** staged edits to `agents/markdown.md` and `skills/sk-doc/README.md`, then ran pre-commit, committed and ran pre-push on the new commit.
- **Round 2** staged edits to `skills/cli-external-orchestration/cli-pi/SKILL.md` and `commands/doctor/assets/doctor-mcp-install.yaml`, then ran pre-commit with `SPECKIT_SKIP_MIRROR_PARITY=1`. Round 1 pre-commit in the shapes stopped at mirror parity, because the shallow clones have no installed dependencies (`Cannot find module '@spec-kit/shared/workspace/repo-root.mjs'`). Skipping that one gate let the trace reach the three gates after it.

Staging through the link fails in both shapes: `git add .opencode/agents/markdown.md` exits 128 with `fatal: pathspec '.opencode/agents/markdown.md' is beyond a symbolic link`. A hook's own `git diff --cached -- .opencode/...` pathspec does not error. It matches nothing and exits 0.

## Gates

Line numbers are in `.opencode/scripts/git-hooks/` at base. "Shape A" and "Shape B" columns hold one row each, 24 rows in all.

| Gate | Script found (A / B) | Filter result, shape A | Filter result, shape B | Control, no move |
|------|----------------------|------------------------|------------------------|------------------|
| Comment hygiene (`pre-commit:45-50`) | yes / yes | no path filter; the checker ran on both `.skilled/` files (rc 2, a non-code file) | same as A | ran |
| Agent mirror sync (`pre-commit:90-98`) | yes / yes | `^\.(opencode\|claude)/agents/` matched 0 of 2 staged paths, gate skipped silently | same as A | matched 1, gate ran and printed `BLOCKED [gate:agent-mirror-sync]` |
| Mirror parity (`pre-commit:120-190`) | yes / yes | runs on every commit; its checkers ran through the link and failed on the clone's missing dependencies | same as A | ran |
| Prompt card sync (`pre-commit:199-202`) | yes / yes | `^\.opencode/skills/(cli-external-orchestration/...)` grep matched 0, guard not run | same as A | matched 1, `check-prompt-quality-card-sync.sh` ran |
| MCP mutation class (`pre-commit:221-224`) | yes / yes | `^\.opencode/(...commands/doctor/assets/doctor-mcp-install\.yaml)$` matched 0, guard not run | same as A | matched 1, `check-mcp-mutation-class.sh` ran |
| Compiled routing re-mint (`pre-commit:253-262`) | yes / yes | pathspecs `.opencode/skills/*/SKILL.md` and siblings returned nothing, re-mint not run | same as A | returned `cli-pi/SKILL.md`, `compiled-route-manifest.cjs refresh` ran |
| Spec metadata re-mint (`pre-commit:422-425`) | yes / yes | pathspec `specs/**/*.md`, independent of the root; nothing staged there | same as A | same |
| Mass-deletion ceiling (`pre-push:34-47`, `:97-119`) | yes / yes | guard sourced through the link, `mass_deletion_verdict 0`, pass | same as A | engaged |
| Push-permission gate (`pre-push:50-55`) | yes / yes | `NAMING_AVAILABLE=1`; the `skilled/v0.0.0.0-probe` ref skips it by design | same as A | same |
| Skill change detector (`pre-push:121-123`) | n/a | `git diff --quiet <old> <new> -- .opencode/skills` exit 0: the `.skilled/skills/sk-doc/README.md` change counted as no skill change | same as A | detected, `[[ 1 -eq 1 ]]` |
| Skill metadata gate (`pre-push:209-215`) | yes / yes | not run, because the detector said no change | same as A | ran `ci-skill-root-metadata.cjs`, which failed open on the clone's missing dependencies |
| Route guard (`pre-push:251-252`) | yes / yes | ran through the link: "All hubs fresh or excused" | same as A | ran |
| Routing bytes parity (`pre-push:280-290`) | n/a | `git diff --quiet` over `.opencode/...` globs; a `.skilled/` routing file change could not match | same as A | pathspecs match `.opencode/` paths |

Seven silent misses under both shapes: agent mirror sync, prompt card sync, MCP mutation class, compiled routing re-mint, the skill change detector, the skill metadata gate it feeds, and routing bytes parity. Every pre-push hook run exited 0.

## Implications

- Shape A: gates keep finding scripts through the link, but seven filters miss `.skilled/` edits. Phase 005 must add a `.skilled/` alternative to each of those filters before the move, and prove each with a staged `.skilled/` edit that trips it.
- Shape B: identical to shape A on every gate. Per-entry links neither help nor hurt the filters.
- Shape C: filters miss in the same seven places, and every gate whose script sits in a dropped entry also loses its script. `rename-rehearsal.md` shows that silent disengagement for the mass-deletion guard, the push-permission gate and the skill metadata gate.
