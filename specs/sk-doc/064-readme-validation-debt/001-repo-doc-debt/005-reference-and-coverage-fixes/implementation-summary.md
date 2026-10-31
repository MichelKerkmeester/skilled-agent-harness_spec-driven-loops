---
title: "Implementation Summary"
description: "All 96 broken README references are classified, the 56 real ones now name a file that exists or read as words, the 13 coverage gaps are closed, and the 27 hits left are accurate references the audit reads from the wrong folder."
trigger_phrases:
  - "reference and coverage fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt/005-reference-and-coverage-fixes"
    last_updated_at: "2026-10-27T14:00:00Z"
    last_updated_by: "lane-b-conductor"
    recent_action: "Recorded what changed and how it was verified"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-b-reference-and-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-reference-and-coverage-fixes |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 96 broken README references are classified, the 56 real ones now name a file that exists or read as words, the 13 coverage gaps are closed, and the 27 hits left are accurate references the audit reads from the wrong folder.

### Repo doc debt reference and coverage fixes

The audit cannot tell a dead pointer from an accurate one, because it resolves every token from the README's own folder and from the repo root. A hook README quotes a symlink target the way `readlink` spells it, one level below the README, so the audit lands on a path that never existed. A runtime README writes `lib/config/` because the import in the code is relative to `runtime/`, which holds the nearest `package.json`. Neither sentence is wrong, and rewriting them to please the checker would have made them worse.

So each of the 96 findings was classified before anything was edited: 19 point at gitignored runtime artifacts, 10 are package-relative, 11 are placeholders, and 56 are real drift. The 56 were repaired against the files that exist now: symlink targets became the repository path of the same file, compiled `.js` names cite the tracked `.ts` source, a truncated log name was completed, two vitest commands moved to the skill root with `--config vitest.config.ts`, and three findings with no target at all read as words instead of a path. The 13 coverage gaps got one accurate sentence each, written after reading the artifact that the folder holds.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/**/README.md` | Modified | 22 READMEs: placeholder names, compiled `.js` names, package-relative shorthand, the retrieval index path and two vitest commands |
| `.skilled/hooks/**/README.md` | Modified | 14 READMEs: symlink targets now give the repository path of the same file |
| `.skilled/skills/sk-doc/**/README.md` | Modified | 4 READMEs: placeholder agent, skill, packet and spec paths |
| Other `.skilled` trees and `README.md` | Modified | 12 READMEs under `bin`, `logs`, `scripts`, `sk-git`, `sk-code`, `mcp-tooling`, `system-deep-loop`, `system-skill-advisor` and the repo root |
| 59 READMEs in total | Modified | 52 carried a broken reference; the other 7 carried a coverage gap alone, and each coverage finding got one sentence |
| 11 `*/changelog/v<next>.md` | Created | system-spec-kit 2.12.7.0, sk-git 1.9.9.0, system-skill-advisor 0.17.6.0, sk-doc 2.3.18.0, sk-create-agent 1.0.2.0, sk-create-goal 1.4.3.0, sk-create-skill 1.5.8.0, sk-code 3.9.5.0, mcp-aside-devtools 1.1.3.0, system-deep-loop 1.6.10.0, deep-loop runtime 1.9.10.0 |
| `SKILL.md`, plus `description.json`, `mode-registry.json` and `hub-router.json` where the hub carries a version | Modified | Version carriers, moved to the same version as the changelog entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A classification pass, then batched edits per tree, then the repo's own checks in the order they had to pass. The classification pass took each finding in turn: `git check-ignore -v` for rule 1, the nearest ancestor holding a `package.json` for rule 2, a placeholder shape for rule 3, and whatever survived all three was real drift under rule 4. That pass is what turned 96 findings into a work list of 56 edits plus 13 sentences.

The edits went out per README group rather than per finding, so the hook READMEs that share one symlink convention moved together and the 22 system-spec-kit READMEs were split by subtree. Every diff was read in full before its check reran. Two of the repairs could be run rather than argued about: the spec-gate suite passes 9 tests and the retrieval suites pass 222 tests in 6 files from the new command, and `node --check` exits 0.

Then the checks. The fast checker reran the audit's own extract and resolve functions over the 59 READMEs in scope and printed 96 broken and 13 coverage before, 27 broken and 0 coverage after. The README validator exits 0 on 59 of 59, before and after. The manifest and parity tests pass with no baseline rewrite, and the repo markdown link guard reports 7663 files and 13976 links with none broken.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|---------|
| Classify before editing, with the four rules in order | 29 of the 96 findings were accurate text, so a find-and-replace pass would have damaged 30 percent of what it touched |
| Leave rule-1 and rule-2 text exactly as written | A gitignored log path and a package-relative import are correct where they stand; rewriting them to satisfy the checker would trade a true sentence for a green count |
| Give the repository path of the same file instead of the symlink spelling | A reader opens the README, not the symlink, so the path has to resolve from where the reader stands |
| Cite the tracked `.ts` source instead of the compiled `.js` name | The `.js` output exists only after a build, and a checkout has no build; the source is what a reader can open |
| Turn the import examples into prose | The sources use `.js` specifiers under nodenext, so a literal import line would name a file that is not in the tree |
| Run the two vitest commands from the skill root with `--config vitest.config.ts` | The config sits at the skill root, so the old per-folder command could not find it; both suites were run from the new form and pass |
| Describe the three targetless findings in words | A guessed path reads better for a week and lies afterwards; the sentence keeps the claim that the artifact belongs there |
| Rerun the fast checker instead of the whole-tree audit | The earlier whole-tree run hung on the fsmonitor daemon, and the fast checker is the audit's own two functions over the same 59 files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fast checker over the 59 READMEs | 96 broken / 13 coverage before, 27 broken / 0 coverage after; the 27 are 17 rule-1 and 10 rule-2 items |
| `validate_document.py --type readme` on the 59 | exit 0 on 59 of 59, before and after |
| `test_readme_manifest.py` | `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible`, exit 0 |
| `test_readme_verdict_parity.py` | `PARITY PASS: verdict diff is empty`, exit 0, no baseline rewrite |
| `check-markdown-links.cjs` from the link workflow | `7663 files, 13976 links checked, 0 broken`, exit 0 |
| `parent-skill-check.cjs` on sk-doc, sk-code, mcp-tooling and system-deep-loop | exit 0, every hard invariant met, 0 warnings |
| Hermes skill sync | `Wrote 0 of 67 Hermes skill copies`, already current |
| Spec-gate vitest suite from the new command | 9 tests pass |
| Retrieval vitest suites from the new command | 222 tests in 6 files pass, `node --check` exits 0 |
| The 11 changelog entries | `validate_document.py` exit 0 on each, `hvr_scan` 0 hard blockers |
| `validate.sh --strict` on this folder | `RESULT: PASSED`, Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **27 hits still count as broken.** 17 are gitignored runtime artifacts and 10 are package-relative shorthand. Both are accurate where they stand, and teaching the audit about symlink folders and package roots is a separate change.
2. **Two session-relaunch state paths may stay flagged.** `.skilled/hooks/session-relaunch/README.md` names `.skilled/skills/.state/session-relaunch/handoffs/` and its `hop-history.log`. Both are gitignored, but their folder does not exist in a fresh checkout and the folder itself is not ignored, so a lane that resolves gitignored paths by folder existence may still count them.
3. **The whole-tree audit was not rerun at the final state.** The earlier repo-wide run hung on the fsmonitor daemon. The fast checker runs the audit's own extract and resolve functions over the 59 READMEs in scope, which is the same code on the same files.
4. **`.skilled/commands/create/readme.md` stays excluded.** The audit's exclusion list covers it and it is out of scope here.
5. **Three findings read as words instead of a path.** `.opencode/specs` is not a folder in this repo, `.skilled/release/base.json` exists only on the fixture branch, and the optimizer's promotion reports are created on first write. A reader gets the artifact named and no path to click.
<!-- /ANCHOR:limitations -->

---

## Evidence Table

One row per broken-reference finding. `Rule` is the classification that decided the outcome: 1 for a gitignored runtime artifact, 2 for a package-relative path, 3 for a placeholder, 4 for real drift.

| # | README | Reference | Rule | Evidence or fix |
|---|---|---|---|---|
| 1 | `.skilled/bin/lib/README.md` | `bin/lib/` | 2 | `.skilled/package.json` root, `.skilled/bin/lib/` exists |
| 2 | `.skilled/bin/README.md` | `.opencode/specs` | 4 | no such folder (check-ignore shows only the `!specs` negation); described in words |
| 3 | `.skilled/hooks/codex-watchdog/README.md` | `.skilled/logs/codex-hooks-watchdog.log` | 1 | `.gitignore:299:*.log` |
| 4 | `.skilled/hooks/completion/README.md` | `../../../plugins/system-speckit-completion.js` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 5 | `.skilled/hooks/completion/README.md` | `../../../skills/system-spec-kit/runtime/hooks/claude/` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 6 | `.skilled/hooks/completion/README.md` | `../../../skills/system-spec-kit/runtime/hooks/codex/` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 7 | `.skilled/hooks/completion/README.md` | `../../../skills/system-spec-kit/runtime/hooks/cursor/` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 8 | `.skilled/hooks/completion/README.md` | `../../../skills/system-spec-kit/runtime/hooks/devin/` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 9 | `.skilled/hooks/completion/README.md` | `../../../skills/system-spec-kit/runtime/hooks/pi/` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 10 | `.skilled/hooks/completion/README.md` | `.skilled/skills/.state/completion-sentinel/advisory-dedup.json` | 1 | `.gitignore:138:.skilled/skills/.state/*/*` |
| 11 | `.skilled/hooks/dispatch/README.md` | `../../../plugins/` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 12 | `.skilled/hooks/dist-freshness/README.md` | `../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 13 | `.skilled/hooks/dist-freshness/README.md` | `.skilled/logs/dist-freshness-guard.log` | 1 | `.gitignore:299:*.log` |
| 14 | `.skilled/hooks/git-hooks-check/README.md` | `../../../bin/check-git-hooks.sh` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 15 | `.skilled/hooks/git-live-follow/README.md` | `../../../bin/git-live-follow.sh` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 16 | `.skilled/hooks/git-primary-reconcile/README.md` | `../../../bin/git-primary-reconcile.sh` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 17 | `.skilled/hooks/git-worktree-guard/README.md` | `../../../bin/worktree-guard.sh` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 18 | `.skilled/hooks/hook-install/README.md` | `../../../bin/install-codex-hooks.mjs` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 19 | `.skilled/hooks/mcp-route-guard/README.md` | `../../../plugins/mcp-route-guard.js` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 20 | `.skilled/hooks/README.md` | `../../../plugins/` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 21 | `.skilled/hooks/README.md` | `../../../plugins/session-relaunch.js` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 22 | `.skilled/hooks/README.md` | `.skilled/hooks/hook-flags.env` | 1 | `.gitignore:386:.skilled/hooks/hook-flags.env` |
| 23 | `.skilled/hooks/session-cleanup/README.md` | `../../../scripts/session-cleanup.sh` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 24 | `.skilled/hooks/session-relaunch/README.md` | `../../../plugins/session-relaunch.js` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 25 | `.skilled/hooks/session-relaunch/README.md` | `../../../specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/scratch/spike/SPIKE-REPORT.md` | 1 | scratch `.gitignore:1:*` in the spike's packet |
| 26 | `.skilled/hooks/session-relaunch/README.md` | `../../../specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/scratch/spike/SPIKE-REPORT.md` | 1 | scratch `.gitignore:1:*` in the spike's packet |
| 27 | `.skilled/hooks/session-relaunch/README.md` | `../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-codex.md` | 1 | scratch `.gitignore:1:*` in the spike's packet |
| 28 | `.skilled/hooks/session-relaunch/README.md` | `../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-cursor-hermes.md` | 1 | scratch `.gitignore:1:*` in the spike's packet |
| 29 | `.skilled/hooks/session-relaunch/README.md` | `../../../specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/scratch/spike/SPIKE-devin.md` | 1 | scratch `.gitignore:1:*` in the spike's packet |
| 30 | `.skilled/hooks/session-relaunch/README.md` | `.skilled/hooks/hook-flags.env` | 1 | `.gitignore:386:.skilled/hooks/hook-flags.env` |
| 31 | `.skilled/hooks/session-relaunch/README.md` | `.skilled/skills/.state/session-relaunch/handoffs/` | 1 | `.gitignore:138:.skilled/skills/.state/*/*` |
| 32 | `.skilled/hooks/session-relaunch/README.md` | `.skilled/skills/.state/session-relaunch/hop-history.log` | 1 | `.gitignore:299:*.log` |
| 33 | `.skilled/hooks/shared/README.md` | `../../shared/hook-adapter-shared.cjs` | 4 | adapter-relative import; prose names this folder's `hook-adapter-shared.cjs` |
| 34 | `.skilled/logs/README.md` | `.skilled/logs/cli-dispatch-audit.log` | 1 | `.gitignore:299:*.log` |
| 35 | `.skilled/logs/README.md` | `.skilled/logs/dist-freshness-guard.log` | 1 | `.gitignore:299:*.log` |
| 36 | `.skilled/scripts/git-hooks/README.md` | `.skilled/logs/autostash-orphan-alerts` | 4 | truncated name; now `.skilled/logs/autostash-orphan-alerts.log` (gitignored, rule 1 after the fix) |
| 37 | `.skilled/skills/.state/completion-sentinel/README.md` | `../../../logs/completion-sentinel-advisories.log` | 1 | resolves to `.skilled/logs/completion-sentinel-advisories.log`, `.gitignore:299:*.log` |
| 38 | `.skilled/skills/mcp-tooling/mcp-aside-devtools/examples/README.md` | `./fixtures` | 3 | `./<fixtures-dir>` (output folder argument) |
| 39 | `.skilled/skills/mcp-tooling/mcp-aside-devtools/examples/README.md` | `./my-evidence` | 3 | `./<evidence-dir>` |
| 40 | `.skilled/skills/sk-code/README.md` | `../../shared/references/` | 4 | now `.skilled/skills/sk-code/shared/references/` |
| 41 | `.skilled/skills/sk-doc/shared/scripts/README.md` | `.skilled/hooks/hook-flags.env` | 1 | `.gitignore:386:.skilled/hooks/hook-flags.env` |
| 42 | `.skilled/skills/sk-doc/sk-create-agent/README.md` | `.skilled/agents/agent-name.md` | 3 | `.skilled/agents/<agent-name>.md` |
| 43 | `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md` | `packet/goal.md` | 3 | `<packet>/goal.md` |
| 44 | `.skilled/skills/sk-doc/sk-create-skill/README.md` | `.skilled/skills/my-skill` | 3 | `.skilled/skills/<skill-name>` |
| 45 | `.skilled/skills/sk-git/scripts/hooks/README.md` | `../../../../../plugins/sk-git-message-gate.js` | 4 | symlink target spelled from the link's folder; now the `.skilled/...` repository path (readlink confirms the target) |
| 46 | `.skilled/skills/sk-git/scripts/hooks/README.md` | `../skills/sk-git/scripts/lib/git-rule-checks.mjs` | 4 | plugins-relative; now `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs` |
| 47 | `.skilled/skills/system-deep-loop/runtime/lib/deep-research-authority/README.md` | `../per-mode-authority-flip/index.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 48 | `.skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/README.md` | `../authorized-ledger/index.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 49 | `.skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/README.md` | `../event-envelope/index.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 50 | `.skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/README.md` | `../locks-and-fencing/durable-file.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 51 | `.skilled/skills/system-skill-advisor/runtime/lib/embedders/adapters/README.md` | `./adapters/ollama.js` | 4 | compiled name; prose names this folder's `ollama.ts` |
| 52 | `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` | `.skilled/release/base.json` | 4 | exists only on the fixture branch; described in words |
| 53 | `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` | `.skilled/release/runs/` | 1 | `.skilled/release/.gitignore:2:runs/` |
| 54 | `.skilled/skills/system-spec-kit/README.md` | `specs/022-big-feature/` | 3 | `specs/<NNN-parent>/` |
| 55 | `.skilled/skills/system-spec-kit/README.md` | `specs/042-my-feature/` | 3 | `specs/<NNN-name>/` |
| 56 | `.skilled/skills/system-spec-kit/README.md` | `specs/[project]/042-my-feature/` | 3 | `specs/<track>/<NNN-name>/` |
| 57 | `.skilled/skills/system-spec-kit/README.md` | `specs/[project]/NNN-feature/` | 3 | `specs/<track>/<NNN-name>/` |
| 58 | `.skilled/skills/system-spec-kit/runtime/cli/optimizer/README.md` | `audit/promotion-reports/` | 4 | created by `promote.cjs` on first write, absent in the tree; diagram describes it in words |
| 59 | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | `../../vitest.config.ts` | 4 | command now runs from the skill root with `--config vitest.config.ts` (6 files, 222 tests pass) |
| 60 | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | `runtime/data/trigger-index.json` | 4 | now `../../data/trigger-index.json`, which exists |
| 61 | `.skilled/skills/system-spec-kit/runtime/cli/sweep/README.md` | `.opencode/specs` | 4 | no such folder (check-ignore shows only the `!specs` negation); described in words |
| 62 | `.skilled/skills/system-spec-kit/runtime/handlers/README.md` | `lib/discovery/` | 2 | `runtime/package.json` root, `runtime/lib/discovery/` exists |
| 63 | `.skilled/skills/system-spec-kit/runtime/handlers/save/README.md` | `api/index.ts` | 2 | `runtime/package.json` root, `runtime/api/index.ts` exists |
| 64 | `.skilled/skills/system-spec-kit/runtime/handlers/save/README.md` | `handlers/save/spec-folder-mutex.ts` | 2 | `runtime/package.json` root, file exists |
| 65 | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/README.md` | `../claude/session-stop.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 66 | `.skilled/skills/system-spec-kit/runtime/hooks/devin/README.md` | `../claude/session-stop.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 67 | `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` | `../vitest.config.ts` | 4 | command now runs from the skill root with `--config vitest.config.ts` (9 tests pass) |
| 68 | `.skilled/skills/system-spec-kit/runtime/hooks/opencode/README.md` | `../hooks/shared/hook-flags.cjs` | 4 | plugins-relative; now `.skilled/hooks/shared/hook-flags.cjs` |
| 69 | `.skilled/skills/system-spec-kit/runtime/hooks/opencode/README.md` | `../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | 4 | plugins-relative; now the `.skilled/skills/...` path |
| 70 | `.skilled/skills/system-spec-kit/runtime/hooks/README.md` | `hooks/lib/` | 2 | `runtime/package.json` root, `runtime/hooks/lib/` exists |
| 71 | `.skilled/skills/system-spec-kit/runtime/lib/config/README.md` | `./capability-flags.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 72 | `.skilled/skills/system-spec-kit/runtime/lib/config/README.md` | `./spec-doc-paths.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 73 | `.skilled/skills/system-spec-kit/runtime/lib/config/README.md` | `lib/config/` | 2 | `runtime/package.json` root, `runtime/lib/config/` exists |
| 74 | `.skilled/skills/system-spec-kit/runtime/lib/continuity/README.md` | `lib/continuity/` | 2 | `runtime/package.json` root, `runtime/lib/continuity/` exists |
| 75 | `.skilled/skills/system-spec-kit/runtime/lib/continuity/README.md` | `lib/resume/` | 2 | `runtime/package.json` root, `runtime/lib/resume/` exists |
| 76 | `.skilled/skills/system-spec-kit/runtime/lib/README.md` | `./resume/resume-ladder.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 77 | `.skilled/skills/system-spec-kit/runtime/lib/README.md` | `./utils/canonical-path.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 78 | `.skilled/skills/system-spec-kit/runtime/lib/README.md` | `./validation/orchestrator.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 79 | `.skilled/skills/system-spec-kit/runtime/lib/resume/README.md` | `lib/resume/` | 2 | `runtime/package.json` root, `runtime/lib/resume/` exists |
| 80 | `.skilled/skills/system-spec-kit/runtime/lib/search/README.md` | `api/index.ts` | 2 | `runtime/package.json` root, `runtime/api/index.ts` exists |
| 81 | `.skilled/skills/system-spec-kit/shared/embeddings/providers/README.md` | `adapters/ollama.ts` | 4 | wrong depth; now `../adapters/ollama.ts` |
| 82 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../chunking.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 83 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../context-types.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 84 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../embeddings/auto-select.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 85 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../embeddings/registry.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 86 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../frontmatter/parse-frontmatter.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 87 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../ipc/socket-server.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 88 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../parsing/secret-scrubber.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 89 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../parsing/spec-doc-health.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 90 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../predicates/boolean-expr.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 91 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../utils/jsonc-strip.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 92 | `.skilled/skills/system-spec-kit/shared/tests/README.md` | `../utils/retry.js` | 4 | compiled output; now cites the tracked `.ts` source, which exists |
| 93 | `.skilled/skills/system-spec-kit/templates/changelog/README.md` | `specs/example` | 3 | `specs/<track>/<NNN-name>` |
| 94 | `.skilled/skills/system-spec-kit/templates/README.md` | `./node_modules/.bin/vitest` | 1 | after `cd .skilled/skills/system-spec-kit`, `.gitignore:53:**/node_modules` |
| 95 | `.skilled/skills/system-spec-kit/templates/README.md` | `specs/example` | 3 | `specs/<track>/<NNN-name>` |
| 96 | `README.md` | `.skilled/hooks/hook-flags.env` | 1 | `.gitignore:386:.skilled/hooks/hook-flags.env` |
