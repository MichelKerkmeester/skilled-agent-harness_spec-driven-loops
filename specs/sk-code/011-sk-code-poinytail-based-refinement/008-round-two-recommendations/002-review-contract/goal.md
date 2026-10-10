---
title: "Goal: Phase 2: review-contract"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/002-review-contract"
    last_updated_at: "2026-10-10T08:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-008-002-review-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: review-contract

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every finding in an sk-code review carry the case that proves it, make the review read the connected code before it reports, number findings once across the severity groups, and state the review agent's report order, with a checker that fails a finding that has no case or a numbering restart.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A finding's case is one `- Case:` sub-line anywhere in its block. The checker tests that the line exists and has text. The template fixes its position as the first sub-bullet. |
| D2 | Finding numbers run 1, 2, 3 and so on across the whole Findings section, so the first P1 finding continues after the last P0 finding. The checker fails a number that restarts or skips. |
| D3 | No version bump and no changelog entry in this fix. The sk-code-review frontmatter stays at 1.6.0.0, as child 005 left it, because a changelog entry is a release action. |
| D4 | The review-core finding schema takes the list number as the finding `id`, so the agent doc, the skill and the schema share one numbering. This goes beyond the brief's file list and can be dropped by amendment. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh; echo "exit=$?"` prints 54 lines that start with `PASS`, then `All rule-canary test cases passed`, then `exit=0`. The first case runs the canary on the real repository tree.
- [ ] From the repository root, `rg -n '^\s*- Case: ' .skilled/skills/sk-code/sk-code-review/SKILL.md .skilled/skills/sk-code/sk-code-review/README.md .skilled/skills/sk-code/sk-code-review/references/review-core.md | wc -l && rg -c 'Read the connected code' .skilled/skills/sk-code/sk-code-review/SKILL.md && rg -c 'numbered once across all three groups' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints `3`, then `1`, then `1`, and exits 0. The `3` is one `- Case:` line in each of the three files.
- [ ] From the repository root, `diff <(sed -n '/^### Read-Budget Discipline/,/^## 3\. ROUTING SCAN/p' .skilled/agents/review.md) <(sed -n '/^### Read-Budget Discipline/,/^## 3\. ROUTING SCAN/p' .claude/agents/review.md) && diff <(sed -n '/^### Issue Evidence Requirements/,/^### Self-Validation Protocol/p' .skilled/agents/review.md) <(sed -n '/^### Issue Evidence Requirements/,/^### Self-Validation Protocol/p' .claude/agents/review.md) && diff <(sed -n '/^## 8\. OUTPUT FORMAT/,/^### PR Review Report/p' .skilled/agents/review.md) <(sed -n '/^## 8\. OUTPUT FORMAT/,/^### PR Review Report/p' .claude/agents/review.md) && rg -c 'Reproducing case' .skilled/agents/review.md .claude/agents/review.md && rg -c 'connected code' .skilled/agents/review.md .claude/agents/review.md && rg -c 'Report order' .skilled/agents/review.md .claude/agents/review.md` prints nothing from the three diffs, then `3` and `1` for each file in the three counts, and exits 0.
- [ ] From the repository root, `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all && node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check && node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check && node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check && node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check; echo "exit=$?"` prints `all mirrors in sync`, a PASS line from each of the four `--check` commands, and `exit=0`.
- [ ] From the repository root, `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs && node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code && node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code ' && cmp .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json; echo "exit=$?"` prints `checked=14 fresh=14 failed=0`, `leaf-manifest.json OK`, a line ending in `fresh` for sk-code, no output from `cmp`, and `exit=0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/002-review-contract --strict` prints `RESULT: PASSED` and exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| C1 Harness prints 54 PASS lines and exits 0 | Done | `check-rule-copies.test.sh` printed 54 PASS lines, `All rule-canary test cases passed`, exit=0 (scratch/criteria-final-c1.txt) |
| C2 Case lines, Phase 1 step and numbering text present in the skill, README and review-core | Done | `rg -n '^\s*- Case: '` over the three files gave 3; `Read the connected code` gave 1; `numbered once across all three groups` gave 1; exit 0 |
| C3 Agent doc edits present and the Claude fork matches | Done | Three identical-range diffs empty, exit 0; `Reproducing case` 3 per agent file, `connected code` 1, `Report order` 1 |
| C4 Five mirror checks exit 0 | Done | check-agent-mirror-sync --all: 12 agents, all mirrors in sync; Codex and Pi --check: 12 agents in sync; Hermes --check: 70 copies in sync; runtime mirrors: 187 in sync; all exit 0 (orchestrator rerun after one generator run each) |
| C5 Leaf and compiled sk-code manifests fresh, archived copy identical | Done | `checked=14 fresh=14 failed=0`, `leaf-manifest.json OK`, `sk-code fresh`, `cmp` silent, exit 0 |
| C6 validate.sh --strict prints RESULT: PASSED | Done | `validate.sh <folder> --strict`: `RESULT: PASSED`, exit=0, Errors 0, Warnings 0 (scratch/validate-2.txt) |

### Deviations and findings

| Item | Note |
|------|------|
| Brief says the harness prints only PASS lines | The harness also prints `All rule-canary test cases passed`. C1 keeps that closing line. The count is 48 PASS lines today, plus 6 for the four new checker cases (the missing-case and restart cases each run twice). |
| Brief's file list omits two mirrors | `.hermes/skills/sk-code-review/SKILL.md` must regenerate for `sync-skills-hermes.cjs --check`, and the archived copy of the compiled manifest must follow the re-mint. Both are in the plan's Files to Change. |
| Drift guard reads git-tracked files | `verify_alignment_drift.py` lists files with `git ls-files`, so the new checker counts in the scan only once it is tracked. The builder reports the scan count as observed and does not stage the file. |
| Phase template's changelog line | It points to `../changelog/`, which does not exist under packet 011. Phases 004 and 005 left it unfilled too. D3 follows that precedent. |
| Interim route guard reported sk-code fresh before the re-mint | tasks.md T028 expected stale. Freshness compares the generation and the effective policy hash, and the SKILL.md body edits did not change that hash. The re-mint rewrote identical bytes (scratch/interim-guard.txt). |
| Full drift guard output names three guards | tasks.md T005 expects "all 2 guards PASSED". Before and after runs are identical (scratch/drift-before.txt, scratch/drift-after.txt). |
| Mirror checks T038 and T043 | The Codex, Pi and Hermes review copies await the orchestrator's generator run. The code, debug and orchestrate mirrors show drift from the sibling build, which this builder does not own. |
| Orchestrator verification, 2026-10-10 | All six criteria rerun after the generators: harness 54 PASS 0 FAIL, the case, connected-code and numbering lines found, the review fork sections identical, five mirror checks exit 0, leaf manifests 14/14 and sk-code fresh, strict validation 0 errors |
<!-- /ANCHOR:log -->
