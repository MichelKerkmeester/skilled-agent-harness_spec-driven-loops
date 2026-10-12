---
title: "Implementation Summary: Playbook root and stale refs"
description: "The playbook validator checks root playbook files too; their 70 unresolved paths went to 1, recorded as a Remaining row, and six stale references were fixed."
trigger_phrases:
  - "playbook root and stale refs implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs"
    last_updated_at: "2026-10-12T11:00:00Z"
    last_updated_by: "builder"
    recent_action: "Built the validator change and the doc fixes"
    next_safe_action: "Run the five-iteration deep review"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-022-003"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Playbook root and stale refs

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-playbook-root-and-stale-refs |
| **Completed** | 2026-10-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The playbook validator now checks backticked paths in each package's root `manual-testing-playbook.md`, not only in its scenarios. Run over the 57 root files of origin/main, that check printed 70 warnings in 13 files. It now prints 1, and that one is the Remaining row below. The scenario count is still 1, 002's RM-1, and every package run exits 0.

Most root fixes name a file from the base it actually sits under: a full repo path, a root-relative `../` path, or a `feature-catalog/` prefix that a catalog column had dropped. The cupt test modules in mcp-click-up belong to the external cupt project, so they are now named as files of that repository. Two cited tests had been deleted: one has a successor covering the same subject, and the other's subject went with the deleted memory engine, so its reference is removed. A test row marked "(if present)" named a file that never existed in git history and is removed too.

The six stale references 002 left as found are fixed. The DAC-002 scorer command was the one that mattered at run time: from its documented directory the vitest binary does not exist, and from the advisor runtime its `deep-ai-council` filter selects 0 of 22 tests and still exits 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modified | Check the root file |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | Modified | Root-file case |
| `.skilled/skills/sk-doc/` SKILL.md, ROUTER.md, description.json, hub-router.json, mode-registry.json, `changelog/v2.3.9.0.md` | Modified, Created | sk-doc 2.3.9.0 |
| `.hermes/skills/sk-doc/SKILL.md` and both sk-doc activation `manifest.json` copies | Regenerated | Mirror and compiled route in sync with the bump |
| 13 root `manual-testing-playbook.md` files | Modified | RR-2.01 to RR-2.13 |
| `cli-codex/references/codex-tools.md`, 14 sk-vision catalog files, 2 cli-cursor scenarios, the DAC-002 scenario, sk-design-diagram `references/import-export/export.md`, the doctor update test environment scenario | Modified | SR-1 to SR-6 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash, through cli-pi on DevPass at max thinking, made every code and doc edit outside this spec folder. The builder read each target first, chose the correction, and dispatched it as a literal old-to-new replacement, one ledger row per brief. A checker then compared every changed file byte for byte against HEAD plus the specified replacements: 41 files, 0 mismatches, no other file touched.

Commits: `d8188fdf35` scaffold, `0099d2c6d7` validator and sk-doc 2.3.9.0, `45d7fca7fd` root and stale reference fixes. The pre-commit hook raised each changed doc's own version.

### Ledger

| ID | Outcome | Proof or reason |
|----|---------|-----------------|
| RR-1 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` exits 0; with the validator line reverted to HEAD it exits 1 on the new `backtick-root-file` assertion |
| RR-2.01 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-classifier` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (root was 1): the served manifest path under `.skilled/bin/lib/compiled-routing/` |
| RR-2.02 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration` exits 0 and prints 0 (root was 3): full advisor runtime paths |
| RR-2.03 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-codex` exits 0 and prints 0 (root was 1): link text now equals its working href |
| RR-2.04 | Closed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-cursor` exits 0 and prints 1 root line (was 3) plus 002's scenario RM-1; the two hook paths now use `../../../` from the root. The line left is RM-1 below, kept because rewriting a path the scenario checks for absence is churn prevent-overengineering rules out |
| RR-2.05 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-opencode` exits 0 and prints 0 (root was 3): CO-013 now describes the unflagged default-agent route its scenario tests, CO-033 names the attached `SKILL.md` by its repo path, CO-037 uses `../../../sk-design/...` |
| RR-2.06 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package mcp-code-mode` exits 0 and prints 0 (root was 1): the "(if present)" row for a test that never existed in git history is removed |
| RR-2.07 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package mcp-tooling/mcp-click-up` exits 0 and prints 0 (root was 44): 7 cupt test modules named as files of the upstream cupt repository, 38 catalog rows given their `../feature-catalog/` prefix |
| RR-2.08 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package mcp-tooling/mcp-obsidian` exits 0 and prints 0 (root was 4): link text matches the href, as the root's other catalog links do |
| RR-2.09 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-code/sk-code-obsidian` exits 0 and prints 0 (root was 3): `references/` prefix |
| RR-2.10 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-design/sk-design-chart` exits 0 and prints 0 (root was 1): full sk-doc path |
| RR-2.11 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-design/sk-design-diagram` exits 0 and prints 0 (root was 1): full sk-doc path |
| RR-2.12 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-doc` exits 0 and prints 0 (root was 2): mode packet prefixes `sk-create-with-human-voice/` and `sk-create-agent/` |
| RR-2.13 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package system-skill-advisor` exits 0 and prints 0 (root was 3): `advisor-rebuild.vitest.ts` under the advisor runtime, the deleted parity test replaced by `hooks/runtime-parity.vitest.ts`, the deleted memory-engine schema test removed |
| SR-1 | Fixed | `grep -c 'codex/settings.json' .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md` prints 0 (was 4 lines); the example is now a `[mcp_servers.my-server]` table in `.codex/config.toml`, matching the scenario CX-025 and SKILL.md's `~/.codex/config.toml` |
| SR-2 | Fixed | `grep -rlE '^.{3}pi/sk-vision' .skilled/skills/sk-vision/feature-catalog \| wc -l` prints 0 (was 14 files); rows now read `hooks/pi/sk-vision.ts`, the skill-relative form the other rows use |
| SR-3 | Fixed | `grep -rE "Phase [0-9]{3}'s" .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook \| wc -l` prints 0 (was 3 lines: the named "Phase 011's" and the same label class in two siblings) |
| SR-4 | Fixed | `cd .skilled/skills/system-skill-advisor/runtime && node_modules/.bin/vitest run tests/scorer/native-scorer.vitest.ts -t "council deliberation"` exits 0 with 1 passed, 21 skipped; the old command's binary is absent under `system-spec-kit/runtime`, and its filter selects 0 of 22 tests from the advisor runtime |
| SR-5 | Fixed | `grep -c 'assets/index.html' .skilled/skills/sk-design/sk-design-diagram/references/import-export/export.md` prints 0 (was 1); the gallery came from the upstream source the skill was built from and never shipped, so the edge case now names a multi-diagram file |
| SR-6 | Fixed | `ls .skilled/commands/doctor/assets/doctor-update-*.yaml \| wc -l` prints 6, and the DOC-379 test environment scenario now says six |

### Remaining

| ID | Path and citing line | Why it stays |
|----|----------------------|--------------|
| RM-1 | `.cursor/worktrees.json` at `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:361` | The CU worktree scenario checks whether that file is present, and the repo ships none on purpose. It is the same path as 002's scenario RM-1 and stays for the same reason |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One validator line, no new rule | `backtickPathChecks` already resolves from the file, playbook, skill, hub and repository bases; the root file only needed to be passed in |
| cupt test modules reworded, not skipped by a rule | One package names them, and phase 002 handled the external Webflow project the same way |
| CO-013's root summary aligned with its scenario | The cited agent file does not exist because `general` is an OpenCode built-in that the contract forbids passing; fixing the path alone would have left the section contradicting its scenario |
| SR-3 covers two sibling labels as well | Both were the same internal phase label in user-facing text, in the same package |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate-playbook-package.cjs --strict` | Exit 0, 2 `BACKTICK_PATH_UNRESOLVED` lines: 1 root (RM-1) and 1 scenario (002's RM-1) |
| Validator tests | Exit 0; exit 1 with the validator line reverted |
| Byte-for-byte check of every dispatched edit | 41 files match HEAD plus the specified replacements, no other file changed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Root summaries can still drift from their scenarios in ways that are not paths.** For example the cli-opencode CO-033 summary still describes a raw `--agent deep-review` dispatch while its scenario runs `--command deep/review`. The validator compares root prompts only for lines labelled `Prompt:`.
<!-- /ANCHOR:limitations -->
