---
title: "Implementation Summary"
description: "Phase 003 rewrites the cli-opencode docs and playbooks for OpenCode 2 only, regenerates the trigger index and fixtures, and writes the v2.0.0.0 changelog entry. The live deep-loop iteration and plugin scenario passed on OpenCode 2.3.2."
trigger_phrases:
  - "v1 docs and playbooks sweep implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep"
    last_updated_at: "2026-11-20T10:31:40Z"
    last_updated_by: "generate-context"
    recent_action: "Deep review generation 3 finished with verdict PASS and 8 P2 advisories"
    next_safe_action: "Decide whether to fix the 8 P2 advisories in a follow-up packet"
    packet_purpose: "Purpose: Every operator-facing document describes OpenCode 2 only, the derived artifacts match their sources, and the live v2 checks prove the result on the pinned binary."
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0b226698ea60e31e5b19bd9252d0009f4729e11ae25c3b342ea72e529f1a3c04"
      session_id: "closure-003-v1-docs-and-playbooks-sweep"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "df9261d4-6090-4b52-892b-db52ff291ccd"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-20T10:31:40Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 003-v1-docs-and-playbooks-sweep |
| **Completed** | 2026-11-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-opencode skill now documents OpenCode 2 only. The install guide has a section on removing an old OpenCode 1 install. The playbooks and references no longer carry v1 steps, except for dated observations that name OpenCode 1 on purpose. The deep-loop protocol and its presentation files no longer name `--pure`. The trigger index and the retrieval fixtures were regenerated, and the cli-opencode changelog entry `v2.0.0.0` says OpenCode 2 is the only supported major.

### Phase 3: v1-docs-and-playbooks-sweep

The changelog came from `/create:changelog` in `:auto` mode, with no GitHub release and no push. No `generate-context.js` or `/speckit:save` was run, because the orchestrator runs the save.

### Files Changed

The complete list is `git diff --name-only main`. The main files are these.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/cli-external-orchestration/cli-opencode/v2.0.0.0.md` (resolves to `.skilled/skills/cli-external-orchestration/cli-opencode/changelog/v2.0.0.0.md`) | Created | The cli-opencode changelog entry for v2.0.0.0 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modified | Version carrier set to 2.0.0.0 (changelog step 6). The stdin rule keeps its dated OpenCode 1 observation |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` | Modified | Section 8 describes removing an old OpenCode 1 install with `remove-v1` |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md`, `providers-and-models.md`, `integration-patterns.md`, `destructive-scope-violations.md` | Modified | v2-only text; dated observations kept; frontmatter trigger phrases moved to v2 vocabulary (section A.1) |
| `.skilled/skills/cli-external-orchestration/cli-opencode/README.md`, `ROUTER.md`, `assets/prompt-templates.md`, `manual-testing-playbook/**` | Modified | v2-only docs and playbooks; `run-plugin-scenario.sh` has no version argument |
| `.skilled/skills/cli-external-orchestration/feature-catalog/**` | Modified | The dual-version entry describes the OpenCode 1 refusal and runs OpenCode 2 |
| `.opencode/plugins/ARCHITECTURE.md` and the plugin READMEs | Modified | Plugin counts and the v2-only description |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`, `deep-research/...`, `.skilled/commands/deep/assets/*-presentation.txt` | Modified | `--pure` removed. The same change landed in phase 001 T020 |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Modified in phase 001 T020, verified here | Byte-identical to the generator's dry-run output (no `--write` run in this phase) |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/*.json` | Regenerated | `generate-trigger-index.mjs` only; `--check` exit 0 after the last spec edits |
| `scratch/*.txt` | Created | Evidence named by the tasks: `baseline.txt`, `live-version.txt`, `live.txt`, `doc-inventory.txt`, `locations.txt`, `changelog-baseline.txt`, `justified.txt` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The sweep grep and each task's Verify line were run. The closure notes name the Verify lines that were changed, and the ordering conditions that were not met. The changelog went through `check_changelog_shape.py` (PASS), `hvr_scan.py` (0 hard blockers) and `validate_document.py` (0 issues), and `extract_structure.py` gave DQI 89. The trigger index was regenerated, then checked with `--check` (exit 0) after the last spec edits. Two generator runs gave the same hash.

The live doctor battery and one live dispatch ran on OpenCode 2.3.2, and the session reader read 77 records from the v2 tables. The runtime-mirror checkers ran in check-only form. The deep-loop iteration and the plugin playbook scenario were not run in this closure; they ran later, as described below.

After closure, `/local-skilled-alignment` (42 findings, 0 P0) and `/local-doc-alignment` on an `opencode-v2-only` topic (60 findings, 30 P0) found more v1 leftovers. These included the OpenCode 1-only installer URL `https://opencode.ai/install`, `--dir`/`--pure`/`--prompt`/`--variant` on `opencode run`, examples without `</dev/null`, uppercase `--log-level`, and v2 subcommands that do not exist. Two fix lanes corrected them, plus the tests that sent `server.instance.disposed`. The deep contracts, the cli hub compiled route and the trigger index were then regenerated. Final state: the alignment battery passes 208 of 210 rows. The two failures predate the branch: root README.md:674 fails on main too, and a gitignored runtime file is absent from the worktree. The node gate is 831 of 833 (the same pre-existing failure), dispatch-audit 133 of 133, and the deep-loop subset 411 passed with 0 failures.

AC-004 was closed live on 2026-11-19. One `/deep:research` iteration ran on the cli-opencode executor on OpenCode 2.3.2 (completion receipt exitStatus 0, `verify-iteration.cjs` OK, artifacts in `research/`), and plugin scenario CO-056 passed. The Mac cleanup is recorded in `scratch/mac-cleanup.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The changelog is version 2.0.0.0, a major bump | Removing the OpenCode 1 launcher and the v1 argv is a breaking change for callers |
| SKILL.md is the only version carrier updated | The cli-opencode folder has no `description.json`, `hub-router.json` or `mode-registry.json`, so the workflow's step 6 touches only `SKILL.md` |
| Dated OpenCode 1 observations stay | They record what was seen on OpenCode 1 and carry their version tags |
| The dual-version feature-catalog entry is rewritten as a refusal entry, not retired | The entry now documents the refusal that the code still performs |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Doctor battery, default run | Exit 0; four v2 legs PASS (family, plugin-active, skill-visible, command-listed) |
| Live binary version | OpenCode 2.3.2, recorded in `scratch/live-version.txt` |
| Branch-contract vitest, `executor-branch-contract.vitest.ts` | Exit 0; 10 passed, 0 failed |
| `opencode-models-form.test.cjs` (`node --test`) | Exit 0; `# tests 14`, `# pass 14`, `# fail 0` |
| Retrieval suites (7 files, `--project cli`) | Exit 0; 257 passed, 0 failed |
| `generate-trigger-index.mjs` | Exit 0; published; `indexSha256` 0096cddc9e93eed7 |
| `generate-trigger-index.mjs --check` | Exit 0; 0 obsolete paths, 0 untrusted docs |
| Determinism (two generator runs) | Same `indexSha256` (0096cddc9e93eed7) both times |
| `compile-command-contracts.cjs --command deep/review` and `deep/research` (dry run) | Exit 0; output byte-identical to the two compiled contracts on disk |
| Repo-wide v1 sweep | 32 files, equal to `scratch/justified.txt` (32 lines, each with a reason), counting the wrapper refusal and its test added after closure |
| Runtime-mirror checkers (check-only) | 15 of 16 exit 0 with no drift; the one WARN is the Codex hooks approval for this worktree |
| `run-plugin-scenario.sh` | `bash -n` exit 0; live CO-056 run exit 0, PASS (see `scratch/live.txt`) |
| Changelog `v2.0.0.0` | Shape gate PASS; `validate_document` 0 issues; DQI 89; 49 entries against 48 at HEAD |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The ordering checks are waived, and three zero-match rows are superseded.** ADR-002 waives T001, CHK-001 and CHK-003, whose records are correct but were written after the edits. ADR-001 supersedes AC-002, AC-006 and AC-008 with replacement checks that exclude the survivors listed in `justified.txt`. CHK-013 is met through `scratch/files-outside-table.txt`, and CHK-042 through the README sentence.
2. **Every acceptance row is Met or Superseded.** `validate.sh --strict` prints `RESULT: PASSED` for this folder.
3. **Three v1 phrases remain in the trigger index outside changelogs.** Two are trigger phrases of older packets' `spec.md` (052 and 066), and one is the refusal feature-catalog entry. They are kept.
4. **The command-catalog prose divergences predate this branch.** The three `argumentHint` divergences (`/create:changelog`, `/deep:research`, `/deep:review`) are not in the diff against main, so this phase did not add them.
5. **Two remnants found at closure were fixed afterwards.** `.skilled/bun.lock` held only the v1 SDK and was deleted, and the `security-testing-and-exemptions.md` example now imports the repo's own `tool-identity.js` and `v2-bridge.js`.

---

<!-- /ANCHOR:limitations -->
