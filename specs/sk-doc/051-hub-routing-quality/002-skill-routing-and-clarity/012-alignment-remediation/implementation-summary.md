---
title: "Implementation Summary: Phase 12: alignment-remediation"
description: "The alignment run over the routing program found 34 findings and nine failing battery rows. All nine rows now pass, the sk-code quality, review and CI code meets sk-code-skilled's file-size and nesting rules, and the five sk-code playbooks validate with no warnings."
trigger_phrases:
  - "alignment remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/012-alignment-remediation"
    last_updated_at: "2026-10-28T23:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Closed every finding and reran the nine failing battery rows and the full gate set"
    next_safe_action: "Land the phase on main, then run the live advisor probe and the alignment recheck"
    blockers: []
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0266-alignment-remediation-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 12: alignment-remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-alignment-remediation |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two CI gates the routing program left red are green again: `sync-runtime-mirrors.cjs --check` and `validate-command-tree-parity.sh` both print `PASS: 201 mirrors across 9 trees are in sync`. All nine battery rows that failed in the alignment run now exit 0, and both README rows read `SUMMARY files=55 pass=55 fail=0`.

### Phase 12: alignment-remediation

The phase fixed each finding at the check or file that produced it. The mirror check now skips ignored paths, so it no longer expects a mirror for an ignored folder. The README checkers now tell a filename template from a path and a prose count from a file count, so they stop flagging READMEs that were already correct. Where a README was really wrong, the document changed: four unresolved paths, and the `.create-diff/` store name the sk-create-diff script writes.

The operator also asked for two things beyond the run's findings. First, the code in sk-code quality, review and CI had to follow sk-code-skilled. Second, every code-mode testing playbook had to be right. For the first, the three largest files were split at their seams:

- `quality-gate.cjs`: 2878 lines down to 134
- `quality-config.cjs`: 910 down to 61
- `check-comment-hygiene.sh`: 1013 down to 179
- `sk-code-quality-config.cjs`: 699 down to 213

`ci-report.cjs` and its test file were split too, and the oversized test files were split by behavior. Every script gained its `MODULE:` header, and no code file in the three modes is past 500 lines. For the second, the five playbook packages were audited against their own validator and against router-sync check 4, and all five now pass with no warnings.

### Files Changed

| Area | Action | Purpose |
|------|--------|---------|
| `system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` and its test | Modify | The expected mirror set skips every path the tree ignores, and five tests cover ignored, tracked, `local-*` and missing roots |
| `cli-external-orchestration/cli-{claude-code,codex,cursor,devin}/SKILL.md` | Modify | The child-preamble sentence is unconditional again, and cli-devin is under 5000 words |
| `cli-orca/SKILL.md`, `graph-metadata.json`, changelog | Modify | Two routing phrases reach cli-orca, which the local scorer rates 0.95 |
| `system-skill-advisor/runtime/lib/scorer/fusion.ts` and `tests/scorer/route-gates.vitest.ts` | Modify | For a cli skill, the tool's own name counts as naming the skill, so a `list` prompt that says Orca leaves the read-only floor. Three cases cover it |
| `sk-doc/sk-create-skill/` docs and playbook, `system-skill-advisor/SKILL.md` | Modify | `leaf-scopes.json` is documented, and the advisor names all five leaf roots |
| `sk-doc/sk-create-readme/scripts/check_readme_references.py`, `check_derived_readme_counts.py` | Modify | A template, a generated path and a prose count are not read as defects, and each new case has a self-test or pytest case |
| Root `README.md` and 17 skill and plugin READMEs | Modify | The command count reads 39, four unresolved paths resolve, and the sk-create-diff store name matches the script |
| `sk-code/sk-code-quality/scripts/` | Split and modify | `quality-gate.cjs` and `quality-config.cjs` become thin entries over `lib/gate-*.cjs` and `quality-config-*.cjs`. The comment-hygiene checker becomes a `lib/comment_hygiene/` package. Tests are split by behavior |
| `sk-code/sk-code-review/scripts/` | Modify and move | MODULE headers are added, and the review-output fixture moves under `scripts/tests/fixtures/review-output/` |
| `.skilled/commands/doctor/scripts/` | Split and modify | `sk-code-quality-config.cjs` and `ci-report.cjs` split into `lib/quality-*.cjs` and `lib/ci-report-*.cjs`, and the contract test lists the new files |
| `sk-code/sk-code-skilled/` guides | Modify | The four language standards state each shared rule the same way |
| Five sk-code `manual-testing-playbook/` packages | Modify and create | 92 audit findings are fixed, new scenarios are added for JavaScript, Rust, the quality doctor and each CI rule reference, and three prompts now meet router-sync check 4 |
| `sk-code/sk-code-ci/references/job-shape-rules.md` | Modify | The timeout ledger lists `changed-packet-validation` at 20 minutes and corrects five line citations |
| `.github/workflows/` (four files) | Modify | Duplicate path filters are removed. `changed-packet-validation` gets `filter: blob:none` and a 20-minute timeout |
| `.skilled/agents/prompt-improver.md` and its mirrors | Modify | The agent cites `.skilled/commands/prompt/improve.md` |
| Changelogs for every touched skill and mode | Create | One entry each, with the hub description and version carriers in step |
| Generated files | Regenerate | Hermes copies, compiled route manifests and their twins, deep-loop command contracts, and `skill-graph.json` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran in one worktree. Workers on DeepSeek V4.1 Flash each owned one finding group, with a disjoint file list. Every worker claim was checked by rerunning its check, not by trusting its report. The fixes landed in this order: wave one (the nine failing rows and the routing findings), the code alignment, the playbook audit, the file splits, the README work, and the regeneration. Each split was followed by its test suites. The last steps reran the nine battery rows from `scratch/before.md` into `scratch/after.md`, then the full 38-gate set, then `validate.sh --recursive --strict` on the parent.

One incident shaped the delivery. Mid-way, a worker ran a recursive delete on the worktree root, then pruned and re-added the worktree. That wiped the first wave of uncommitted fixes. Git held no copy, so 13 workers were rerun from their briefs. Every brief and the shared brief header now forbid recursive deletes, worktree commands and resets outside the worker's scratch folder. The main checkout and the other worktrees were confirmed intact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The sk-create-diff README now names `.create-diff/` instead of having the checker allowlist `.sk-create-diff/` as `plan.md` §5 proposed | The script's `STATE_DIR_NAME` is `.create-diff`, so the README was wrong and an allowlist would have hidden a real defect |
| The README count checker accepts an unknown word between number and noun only when the line names the folder it counts | A strict rule broke the "Three rule files live in `rules/`" case, which a folder listing proves. The marker self-test now uses a phrase that stays a count |
| The doctor CI and quality scripts joined the file list during the work | They hold the same code the sk-code alignment covers, so leaving them out would have left the rule half-applied |
| Workers moved from Luna to DeepSeek once Luna's quota ran out | The GPT rule forbids re-routing a GPT model, and the operator had already allowed moving work to DeepSeek |
| The mirror test falls back to a system temp folder when `RUNTIME_MIRROR_TEST_ROOT` is unset | A worker had made the variable mandatory, so a plain `node --test` threw before running a case |
| cli-orca was fixed in the live scorer, not with more signal phrases | The live daemon scored cli-orca first at 0.59 but capped it at confidence 0.25, because a prompt that opens with `list` sits on the read-only floor unless it names the skill. More phrases could not lift that cap. Only the `cli` family gets the bare tool name, because the suffixes of `sk-` and `mcp-` ids are ordinary words |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The nine failing battery rows, rerun in the worktree | 9 of 9 exit 0. The table is in `scratch/after.md` |
| `sync-runtime-mirrors.cjs --check` and `validate-command-tree-parity.sh` | `PASS: 201 mirrors across 9 trees are in sync.` |
| Both README rows over the 55 files | `SUMMARY files=55 pass=55 fail=0`, twice |
| `check_derived_readme_counts.py --self-test` and the four README-checker pytest files | Self-test PASS; 9, 28, 8 and 5 passed |
| `node --test` on the mirror test and on `quality-gate-*.test.cjs` | 5 of 5, and 96 of 96 |
| `test_audit_descriptions.py` | 13 passed |
| Rule canary, comment-hygiene, ceiling-report and typo-flag shell suites | All pass, canary 133 PASS |
| `doctor-ci-contract.test.cjs` | 15 of 15 |
| The five playbook validators and router-sync | warnings=0 each, and router-sync 5 of 5 |
| Live `advisor_recommend` from the worktree after a rebuild and a daemon restart | "List my Orca worktrees and open a terminal in the new one": cli-orca 0.8397. "list the managed worktrees in orca": cli-orca 0.9187. Before the scorer fix, both returned no recommendation |
| Routing accuracy, before and after the scorer fix | 155/195, 49/66, 19/24 both times, so the delta is zero |
| Advisor vitest suite | 156 files, 1348 passed, 8 skipped |
| Full gate set, `gates-wt.sh` | Recorded in `scratch/after.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A main checkout keeps the old scorer until its daemon restarts.** The fix ships in the advisor's TypeScript source. A running daemon serves the build it started with, so after landing, the build has to be rerun and the daemon restarted, as the changelog's upgrade line says.
2. **Large files outside the three modes were not audited.** These include `release-update.cjs`, `parent-skill-check.cjs`, `git-setup-check.cjs`, `verify_alignment_drift.py` and `router-replay-lib.cjs`. They sit past the 500-line guideline but outside this phase's scope, so they need their own pass.
<!-- /ANCHOR:limitations -->

---
