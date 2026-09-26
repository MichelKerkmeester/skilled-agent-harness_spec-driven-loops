---
title: "Changelog: Phase 11: cross-surface-references [060-create-goal-mode/011-cross-surface-references]"
description: "Chronological changelog for the Phase 11: cross-surface-references phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-09-26

> Spec folder: `specs/sk-doc/060-create-goal-mode/011-cross-surface-references` (Level 2)
> Parent packet: `specs/sk-doc/060-create-goal-mode`

### Summary

A reader who opens the root README, the sk-doc hub README, the @markdown agent or the sk-doc feature catalog now finds sk-create-goal and /create:goal next to the other create modes, and every count reads fifteen modes across fourteen packets. The skill advisor's command-bridge projection carries /create:goal and its freshness check passes again. The create command's asset tests and the advisor's command census both count the goal command. The changelog link and the command files already matched their siblings, so they were checked and left as they were.

### Added

- Search for documents that name a sibling create mode or command but not the goal mode. Evidence: rg over .skilled, the runtime folders and the root, outside specs and changelogs, found the root README, the sk-doc README, the @markdown agent and its copies, two sk-doc feature-catalog files and the advisor command bridges.
- Check the changelog hub. Evidence: .skilled/changelog/sk-doc/create-goal is a committed symlink to ../../skills/sk-doc/sk-create-goal/changelog and lists v1.0.0.0.md and v1.1.0.0.md, so no change was needed.
- Update the root README: fifteen modes across fourteen packets, a goal-authoring line and a /create:goal entry (README.md).
- Add /create:goal to the @markdown agent's valid-command list and template map, set its count to thirteen, carry the edit to the Claude, Pi and Codex copies and regenerate the Hermes copy (.skilled/agents/markdown.md).
- Add sk-create-goal to both feature-catalog mode lists and update their counts (.skilled/skills/sk-doc/feature-catalog/).
- Rebuild the create command asset roster from disk and set its YAML count to 26 (.skilled/commands/create/assets/tests/).

### Changed

- Compare the command's files with its siblings. Evidence: the router, the auto, confirm and presentation assets, and the copies for Claude, OpenCode, Codex, Pi, Cursor and Hermes all exist, and the catalog row is present.
- Record the operator's workspace choice. Evidence: "Current branch (main checkout)", 2026-09-26.
- Update the sk-doc hub README: description, overview, when-to-use, command list, FAQ and a related-documents row (.skilled/skills/sk-doc/README.md).
- Move the /speckit:save memory-save wording from the committed TypeScript projection into scoring-compatibility.json, then regenerate the command bridges (.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/).
- Set the advisor metadata census to 21 (.skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts).
- Run the agent and runtime mirror checks. Evidence: 12 agents in sync, 71 Hermes copies in sync, 170 runtime mirrors in sync.

### Fixed

- CHK-042 The out-of-scope README gaps are recorded, not fixed

### Verification

- python3 -m unittest discover .skilled/commands/create/assets/tests - 13 of 13 pass, where two failed before
- derive-command-bridges.cjs --check - "status": "fresh", where it was stale before
- Advisor typecheck, bridge and routing tests - Exit 0, and 22 of 22 pass
- Advisor full suite - 896 of 907 pass. The divergence ratchet fails on rr-iter3-093, and the committed Python scorer gives the same sk-prompt top result, so it predates this phase. Four records runtime and delivered bytes hook cases fail in a test another session added and has not committed
- Agent and runtime mirrors - 12 agents, 71 Hermes copies and 170 runtime mirrors in sync
- Edited documents - 0 issues on both READMEs and both catalog files, with HVR counts unchanged on every file
- sk-doc gates - Guard fresh, leaf manifest OK, command references OK, catalog mirror OK, package PASS, parent-skill OK, README manifest tests 11 of 11
- bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict - RESULT: PASSED for all 12 folders

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- The advisor's divergence ratchet still fails on rr-iter3-093. It comes from the live skill graph, not from this phase, and needs a ledger entry or a scorer fix from the advisor's owner.
- The root README's CREATE section still omits other existing commands and names /create:testing-playbook, which is not the current command.
- The trigger index was not regenerated. The next regeneration from a clean tree picks up this phase's phrases.
