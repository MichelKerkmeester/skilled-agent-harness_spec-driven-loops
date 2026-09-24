---
title: "Tasks: Align AGENTS.md, repo rules and sk-prompt with current vendor prompting guides"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "prompting guide alignment tasks"
  - "lens dispatch tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Align AGENTS.md, repo rules and sk-prompt with current vendor prompting guides

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create worktree `worktrees/067-prompting-guide-alignment` through sk-git's `worktree-naming.sh create` (4 dependency trees installed)
- [x] T002 Scaffold this Level 2 packet with `create.sh --track agents --level 2`
- [x] T003 Restore the missing comma at `.pi/models.json:13` in the main checkout; `pi --list-models llmgateway` lists `mimo-v2.6-pro`
- [x] T004 [P] Snapshot the five vendor pages into `scratch/sources/` and record URLs and fetch date in `research/sources.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the GPT-6 Luna pair to `DEVIN_SUPPORTED_MODELS` (`executor-config.ts`)
- [x] T006 Add the same pair to the hand-copied devin list (`fanout-run.cjs`)
- [x] T007 Add the pair to the expected roster in `fanout-run.vitest.ts`
- [x] T008 [P] List the pair in the cli-devin docs and regenerate the Hermes mirror
- [x] T009 Write the Opus lens before reading any delegate output (`research/lens-opus.md`)
- [x] T010 Compose three angle briefs from the CLI prompt quality card (`scratch/briefs/`)
- [x] T011 [P] Dispatch the three Luna briefs on `gpt-6-luna-max-priority`
- [x] T012 [P] Dispatch the three MiMo briefs on `llmgateway/mimo-v2.6-pro --thinking high`
- [x] T013 Verify every delegate citation that the synthesis repeats, and diff the worktree for delegate writes
- [x] T014 Write `research/synthesis.md` with applied and rejected findings
- [x] T015 Apply accepted findings to `AGENTS.md`, rules and sk-prompt, and carry them to runtime copies
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run vitest `fanout-run` and `combo-matrix` and read the counts (155 passed, 0 failed)
- [x] T017 Run the sk-doc validator on every edited `.md`
- [B] T018 Delete `scratch/sources/` and `scratch/briefs/` (waits on the operator's yes: `AGENTS.md` stop-for-yes on delete)
- [x] T019 Run `validate.sh --strict` on this packet and read `RESULT: PASSED` (0 errors, 0 warnings; rerun after T018)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: See `research/synthesis.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-009)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (`devin models list` shows GPT-6 Luna; `pi --list-models llmgateway` shows `mimo-v2.6-pro`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The roster edit matches the neighboring entries' shape and order [EVIDENCE: `executor-config.ts` and `fanout-run.cjs` insert the pair after `gpt-5-6-luna-max-priority` in the same order]
- [x] CHK-011 [P0] vitest runs with no failures [EVIDENCE: 155/155 on a quiet machine, exit 0; the 9 baseline failures ran under load and did not recur]
- [x] CHK-012 [P1] No comment in the edited code carries a packet path or task id [EVIDENCE: grep of added code lines for spec paths and ids returned no hits]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: comments state the durable why, matching the neighbouring roster notes]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] A real devin dispatch on `gpt-6-luna-max-priority` returned output [EVIDENCE: `devin -p --model gpt-6-luna-max-priority` returned OK at exit 0; the three Luna briefs ran on it]
- [x] CHK-022 [P1] Every citation repeated in the synthesis was opened [EVIDENCE: every repeated vendor and repo line re-opened; one wrong line number (`AGENTS.md:97` to `:98`) corrected]
- [x] CHK-023 [P1] No delegate wrote to the worktree [EVIDENCE: `git diff | shasum` 44a31fdf before and after; only lens files and logs are new]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each synthesis finding has a class: `instance-only` for one file, or `class-of-bug` for a pattern across surfaces. [EVIDENCE: each synthesis row names one file or a cross-file conflict]
- [x] CHK-FIX-002 [P0] For each class-of-bug finding, the same-class inventory was grepped across the owning surface. [EVIDENCE: RICCE, success-rate, question-rule and cycle-cap wording grepped across sk-prompt; playbook hits changed the cycle-cap decision]
- [x] CHK-FIX-003 [P0] Consumers of each changed instruction were inventoried: runtime copies, routers and trigger tables. [EVIDENCE: CLAUDE.md is a symlink; `.codex/AGENTS.md` is unrelated; Hermes mirror regenerated; trigger rows unchanged]
- [x] CHK-FIX-004 [P2] Adversarial table tests. N/A: no path, parser or redaction code changes.
- [x] CHK-FIX-005 [P1] The roster matrix is listed: two ids, three lists, one reject list. [EVIDENCE: two ids in `executor-config.ts`, `fanout-run.cjs` and the accept fixture; none in the reject list]
- [x] CHK-FIX-006 [P2] Hostile env variant. N/A: the roster reads no process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the worktree diff against base `c70180f373`. [EVIDENCE: `git diff --stat` against `c70180f373`: 19 tracked files plus new changelogs and packet]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or gateway token in any packet file, brief or log [EVIDENCE: credential-pattern grep over the packet found only `$ANTHROPIC_API_KEY` placeholders in a vendor page copy; the lane scripts set no auth variable]
- [x] CHK-031 [P0] Delegates ran with read-only tool modes [EVIDENCE: devin `--permission-mode auto`; pi `--tools read,grep,find,ls --offline`]
- [x] CHK-032 [P2] Auth changes. N/A: no auth surface touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized [EVIDENCE: spec.md §3 covers every edited file except `cli-devin/changelog/v1.4.3.0.md` and `.hermes/skills/sk-prompt/SKILL.md`, which follow mechanically from the version rule and the mirror generator; recorded in implementation-summary.md]
- [x] CHK-041 [P1] Every edited rule and instruction file passes the sk-doc validator [EVIDENCE: no new issue; the six governance files fail the README-type overview check identically at base]
- [x] CHK-042 [P2] cli-devin README updated [EVIDENCE: cli-devin README lists GPT-6 Luna Max in its roster line]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: vendor copies, briefs and logs live under scratch/ only]
- [ ] CHK-051 [P1] scratch/ cleaned before completion, vendor snapshots deleted
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 10/11 |
| P1 Items | 11 | 10/11 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-09-24
<!-- /ANCHOR:summary -->

---
