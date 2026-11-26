---
title: "Resource Map — Audit the Skilled v4.2.0.0 release notes against the work shipped since v4.1.0.0, and report what is missing, what has drifted and what is broken. Inputs, read-only: - Release notes: .skilled/changelog/skilled/v4.2.0.0.md (926 lines, not tagged yet). - Window: git range v4.1.0.0..HEAD. The 1084 non-merge commits, one per line as \"hash date subject\", are in specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt. Use git show, git log -- <path> and git diff on that range for detail. - Recently touched packets: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt (21 spec folders; read their spec.md and implementation-summary.md). Definitions: - MISSING: a user-visible change in the window (a new or removed command, flag, skill, mode, hook, script, default or behavior) that the release notes never mention. - DRIFT: a release-note claim (a flag, path, count, default, version, test number or behavior) that the current code or docs contradict. - BUG: a defect in code changed in the window, shown by reading the code or running a read-only command. Key questions: 1. Which commits in the window change user-visible behavior with no entry in the notes? Check each notes section in turn: Deep Loop, Fan-Out Runs, Dispatch and Safety, Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, Upgrade Notes. 2. Which of the 21 recent packets shipped work the notes do not cover, or describe the shipped work differently from the notes? 3. Which concrete claims in the notes (flags, paths, counts, test results, removed items) no longer match HEAD, including work that landed after a section was written? 4. Which changes in the window introduced a bug, a dead reference or a broken cross-link? Rules: cite a commit hash and a file:line for every finding, plus the release-notes line it concerns. Mark each finding MISSING, DRIFT or BUG with a severity of P0, P1 or P2. Say when you could not confirm something. Do not edit any file outside your own research lineage folder."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 128
- **By category**: READMEs=0, Documents=45, Commands=10, Agents=0, Skills=50, Specs=14, Scripts=4, Tests=1, Config=4, Meta=0
- **Missing on disk**: 53
- **Scope**: research convergence output for 007-v4-2-0-0-release-audit-research
- **Generated**: 2026-11-25T09:26:29.091Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/opencode-v2-battery.yml:79,123-144 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/plugins/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/skilled-loop-shell.sh:127-138,189-192 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/bin/skilled-loop:483-487,1460-1477 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.2.0.0.md | Cited | OK | Citations=10; Iterations=10 |
| .skilled/changelog/skilled/v4.2.0.0.md:435-438,823 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.2.0.0.md:635-681,727-748 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:49-53,1101-1124 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:17-23,223-251 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/hooks/session-handover/bin/session-handover.cjs:419-421,897 | Cited | MISSING | Citations=1; Iterations=1 |
| 0d1725f86e526026eb821b61620a2653749b9009 | Cited | MISSING | Citations=1; Iterations=1 |
| 0fde65e7b6989905abfc4498319d33058e62aad6 | Cited | MISSING | Citations=1; Iterations=1 |
| 1a350b1512bdabbf861d63fe5c1ca2bf343c8522 | Cited | MISSING | Citations=1; Iterations=1 |
| 1b7fe3e1a26ff0b808b5d78bb17bb032caa46ead | Cited | MISSING | Citations=1; Iterations=1 |
| 3c8df5974389ceb5a19994d961cad6c612a5eaf2 | Cited | MISSING | Citations=1; Iterations=1 |
| 7c656e5dd799e8b873c5fe8a67ba3fa55a985731 | Cited | MISSING | Citations=1; Iterations=1 |
| 12fe3abc66b48bab326a08b08accbc3c2c00f8ef | Cited | MISSING | Citations=1; Iterations=1 |
| 15fe7306bca6e92332b827d129cdc799b74efeae | Cited | MISSING | Citations=2; Iterations=2 |
| 73d98332fff08fc272162e870897ffc568d5325f | Cited | MISSING | Citations=1; Iterations=1 |
| 512be46971ab0b86fe3ca45850ff9f488d3aa3bb | Cited | MISSING | Citations=1; Iterations=1 |
| 527fc5f9d434dac875527da753f52af49acdf638 | Cited | MISSING | Citations=1; Iterations=1 |
| 957f47570f381cfc42c2d90d151771dfe695647e | Cited | MISSING | Citations=2; Iterations=2 |
| 978b74e8df739105e59e8be611a19b8b79bb89db | Cited | MISSING | Citations=1; Iterations=1 |
| 5913aebc267b50c4cdb1ccc0ddf6441ae3e53639 | Cited | MISSING | Citations=1; Iterations=1 |
| 09076dd4e0f75020e94ef812574615cf69eb8c2d | Cited | MISSING | Citations=1; Iterations=1 |
| 61112481bc3de60fe9b1373e0f1059f4a2fd227d | Cited | MISSING | Citations=1; Iterations=1 |
| a9a8a878daddcc7f0030ee81dc58c3dd81e82ca5 | Cited | MISSING | Citations=1; Iterations=1 |
| b3fea67595ede5d47ce0d9ef57629bd46aedda8f | Cited | MISSING | Citations=1; Iterations=1 |
| c06a73d348ec85d3603fe7420dca1a56f2f3b6b1 | Cited | MISSING | Citations=1; Iterations=1 |
| c7f38f295d282f34efc292a7bc611c2019fb489e | Cited | MISSING | Citations=1; Iterations=1 |
| d57563b175a34e8e4e4f9e3f697adb1922cfb001 | Cited | MISSING | Citations=1; Iterations=1 |
| ec3ed74ad01edad7311aadfe7a117d4010b10919 | Cited | MISSING | Citations=1; Iterations=1 |
| local Markdown link scan of .skilled/changelog/skilled/v4.2.0.0.md: zero missing targets | Cited | MISSING | Citations=1; Iterations=1 |
| research/deep-research-state.jsonl | Cited | MISSING | Citations=1; Iterations=1 |
| research/deltas/iter-001.jsonl | Cited | MISSING | Citations=1; Iterations=1 |
| research/deltas/iter-008.jsonl | Cited | MISSING | Citations=1; Iterations=1 |
| research/lineages/devin/deep-research-state.jsonl | Cited | MISSING | Citations=1; Iterations=1 |
| research/lineages/devin/deltas/iter-009.jsonl | Cited | MISSING | Citations=1; Iterations=1 |
| research/lineages/devin/iterations/iteration-001.md | Cited | MISSING | Citations=1; Iterations=1 |
| research/lineages/devin/iterations/iteration-009.md | Cited | MISSING | Citations=1; Iterations=1 |
| steer.md (checked before iteration and before classifying findings; absent) | Cited | MISSING | Citations=1; Iterations=1 |
| steer.md (checked before iteration and before resolving the note/code conflict; absent) | Cited | MISSING | Citations=1; Iterations=1 |
| steer.md (checked before iteration; absent) | Cited | MISSING | Citations=3; Iterations=3 |
| steer.md (checked; absent) | Cited | MISSING | Citations=1; Iterations=1 |
| steer.md checked before iteration 10; absent | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep/assets/deep-research.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-install-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-setup-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/overlay-engine.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/overlay-engine.cjs:1220-1251,1426-1633,2226-2228 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/overlay-engine.cjs:1220-1251,1426-1633,2226-2228,4160-4164,4533-4535 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/overlay-engine.cjs:4160-4164,4533-4535 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/release-update.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:28,301-329 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/mcp-browser-use/mcp-bladebro/INSTALL-GUIDE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-browser-use/mcp-bladebro/mcp-servers/bladebro-cli/README.md:24-27,50-58 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-browser-use/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/changelog/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/changelog/v3.12.5.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/changelog/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:214-235,253-255 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-readme/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/changelog/v1.11.15.0.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/scripts/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:119-125,184-208 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-doctor/references/overlays.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/hooks-plugins-extensions/decision-capture/001-decision-capture/016-stop-hook-auto-record/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/implementation-summary.md | Cited | MISSING | Citations=1; Iterations=1 |
| specs/sk-git/worktree-lifecycle/008-provision-skill-graph-database/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-git/worktree-lifecycle/008-provision-skill-graph-database/implementation-summary.md:59-72,109-114 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-doctor/007-overlay-framework-root-layout/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-config.json | Cited | OK | Citations=7; Iterations=7 |
| specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-state.jsonl | Cited | OK | Citations=7; Iterations=7 |
| specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-strategy.md | Cited | OK | Citations=7; Iterations=7 |
| specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt | Cited | OK | Citations=5; Iterations=5 |
| specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt | Cited | OK | Citations=6; Iterations=6 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/lib/v2-bridge.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/skilled-loop-shell.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-handover/lib/relaunch-core.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/opencode-v2-battery.yml | Cited | OK | Citations=1; Iterations=1 |
| .pi/settings.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json | Cited | OK | Citations=1; Iterations=1 |
| research/lineages/devin/findings-registry.json | Cited | MISSING | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| codex | lineages/codex/deltas/iter-001.jsonl |
| codex | lineages/codex/deltas/iter-002.jsonl |
| codex | lineages/codex/deltas/iter-003.jsonl |
| codex | lineages/codex/deltas/iter-004.jsonl |
| codex | lineages/codex/deltas/iter-005.jsonl |
| codex | lineages/codex/deltas/iter-006.jsonl |
| codex | lineages/codex/deltas/iter-007.jsonl |
| codex | lineages/codex/deltas/iter-008.jsonl |
| codex | lineages/codex/deltas/iter-009.jsonl |
| codex | lineages/codex/deltas/iter-010.jsonl |
| devin | lineages/devin/deltas/iter-001.jsonl |
| devin | lineages/devin/deltas/iter-002.jsonl |
| devin | lineages/devin/deltas/iter-003.jsonl |
| devin | lineages/devin/deltas/iter-004.jsonl |
| devin | lineages/devin/deltas/iter-005.jsonl |
| devin | lineages/devin/deltas/iter-006.jsonl |
| devin | lineages/devin/deltas/iter-007.jsonl |
| devin | lineages/devin/deltas/iter-008.jsonl |
| devin | lineages/devin/deltas/iter-009.jsonl |
| devin | lineages/devin/deltas/iter-010.jsonl |
