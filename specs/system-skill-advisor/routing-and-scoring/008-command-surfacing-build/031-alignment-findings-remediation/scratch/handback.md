# Hand-back: alignment findings this phase does not build

This phase builds the in-scope P0 and P1 findings of the alignment run at `~/.local/state/local-skilled-alignment/352-command-surfacing-research/20261115T123946Z` (RUN). The findings below are left to their owners. Each line names the finding id, its severity, the file and line RUN gave and the owner. The close-out rechecks every file and line with `rg -n` and corrects a number that moved. The text of each finding is in RUN's `findings.json`.

## Folded in or closed here, not handed back

- **C-05** (P2) `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:36`. One Vibe sentence is folded into this file by T005, which already edits it.
- **BAT-05** (P2) the command-reference validator row. It closes with D-01 (T003).
- **D-04** (P2) `.skilled/skills/system-skill-advisor/graph-metadata.json:88`. It closes only if T009 keeps the `vibe prompt advisor` phrase. When T010 declines it, D-04 is handed back to the advisor skill with the P02 decline line.

## Handed back

### The advisor skill (`.skilled/skills/system-skill-advisor`)

- **A-01** (P2) `runtime/lib/scorer/fusion.ts:1231`. The typed-command exception in `withholdWritingCommandsOnNoEdit` compares a full tracked key with the row's first word, so it never fires for a subcommand row. Code, outside this phase's files.
- **A-02** (P2) `runtime/tests/doctor-brief-render.vitest.ts:94`. The companion assertion flips to `(parent-named only)` when the suite runs with `AI_SESSION_CHILD=1`. This phase's suite runs unset it.
- **A-03** (P2, pre-existing) `runtime/tests/legacy/advisor-freshness.vitest.ts:292`. AS10 failed once under full load and passed alone at planning (12 of 12).
- **B-S2-01** (P2) `README.md:244`, also `SKILL.md:205` and `ARCHITECTURE.md:142`. The runtime lists leave out Vibe.
- **B-S2-02** (P2) `hooks/skill-advisor-hook.md:111`. The `Starting a surfaced command` table has no Vibe row.
- **B-S2-03** (P2) `runtime/lib/README.md:130`. `advisor-disabled.ts` is missing from the tree and the key-files table.
- **B-S3-01** (P2, outside the range) `feature-catalog/feature-catalog.md:31`. No Vibe leaf in the hooks-and-plugin group.
- **B-S3-02** (P2) `feature-catalog/scorer-fusion/command-meaning-matching.md:26` and `README.md:176`. The docs say 46 command rows, the generated bridges hold 47.
- **X-02** (P2) `feature-catalog/feature-catalog.md:20`. No catalog entry for the workflow measure.
- **D-05** (P2) `changelog/v1.1.0.0.md:110`. The doctor-helper check is described as end to end, while the P07 prompt returned nothing. T015 may change what P07 returns, so the line is read again at close.
- **X-03** (P2) `runtime/scripts/skill_advisor.py:278`. The Python fallback has no alias group for the retired `/create:skill` spelling.
- **ENV-01** (P2) `runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1244`. `SKILL_ADVISOR_FRESH_PROMPTS_PATH` is read and not listed in `.env.example`.

### The spec-kit skill (`.skilled/skills/system-spec-kit`)

- **C-09** (P2) `runtime/ENV-REFERENCE.md:75`. The Source column leaves out `runtime/lib/advisor-disabled.ts`.
- **A-04** (P2, outside the range) `runtime/cli/evals/check-source-dist-alignment.ts:286`. The same stale `dist` state as BAT-01, which T002 rebuilds. It is a local build state, not a tree defect.
- **B-S4-02** (P2, pre-existing) `manual-testing-playbook/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md:55`. The same violation as BAT-02. Main fixed it after the last catch-up merge, so the next merge clears it. Do not edit it on this branch.

### The doctor skill and command (`.skilled/skills/system-skilled-doctor`, `.skilled/commands/doctor`)

- **C-07** (P2) `.skilled/skills/system-skilled-doctor/changelog/v1.1.7.0.md:24`. No Vibe entry for the wiring check's `.vibe/hooks.toml` leg.
- **X-06** (P2) `.skilled/commands/doctor/assets/doctor-install.yaml:46`. `/doctor:install` leaves Vibe out with no stated reason, as it states one for DSH.

### The sk-doc hub (`.skilled/skills/sk-doc`)

- **BAT-04** (P2) and **D-02** (P2) `ROUTER.md:173`. `mode packet` is outranked by system-spec-kit. RUN's lane showed it fails on `origin/main` too.

### Root documents and the framework changelog

- **C-02** (P2) `README.md:776`. The runtime section leaves out Vibe.
- **C-04** (P2) `README.md:781`. The disable paragraph under-describes `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`.
- **X-04** (P2) `README.md:184`, `CONTRIBUTING.md:27`, `INSTALL-SKILLED.md:57` and `PUBLIC-RELEASE.md:91`. The runtime counts disagree.
- **C-06** (P2) `.skilled/changelog/skilled/v4.0.2.1.md:104`. The open release notes name neither the Vibe document line nor the direct-call abstention.
- **C-08** (P2, outside the range) `.env.example:672`. The same unlisted variable as ENV-01.

### Hooks and agents

- **BAT-03** (P2) and **C-01** (P2, pre-existing) `.skilled/hooks/README.md:206`. The README counts fourteen test files where 18 exist, unchanged from the merge base.
- **D-06** (P2, outside the range) `.skilled/agents/code.md:55` and its five generated mirrors. The fallback still passes the prompt as inline JSON.
- **D-07** (P2, outside the range) `~/.claude/CLAUDE.md:65`. The user-global copy predates the stdin form. The operator owns that file.

### This packet

- **X-05** (P2) `../030-vibe-runtime-parity/spec.md:58`. The gap accounting names twelve gaps and lists eleven. G4 appears nowhere in the phase. Owner: the coordinator, as a correction to a closed phase.

### Packet 004 and the alignment command

- **`.vibe/SYNC.md:115`**. It says no CI job names a Vibe generator, which T004 makes false. The operator keeps the Vibe gaps with packet 004 (`specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/`).
- **The S11 row of the alignment surface map** (part of X-01). `.skilled/commands/assets/local-skilled-alignment/surface-map.yaml:316-350` names only `sync-runtime-mirrors.cjs` and the Codex and Pi checks, so an S11 pass says nothing about Vibe. The folder is a link into the main checkout's private command, and the change is three check rows and two globs. Owner: the operator's `/local-skilled-alignment` command.

## Pre-existing P0 rows, recorded here and cleared by a merge

- **BAT-02**, **BAT-06** and **BAT-07** fail on the merge base `28a6d40f81f` and on this branch, pass on `origin/main` (`d67182e887b` at planning) and sit in files byte-equal to the merge base. T002 records them again at build time. A catch-up merge of `origin/main` clears all three, and that merge is the coordinator's call.
