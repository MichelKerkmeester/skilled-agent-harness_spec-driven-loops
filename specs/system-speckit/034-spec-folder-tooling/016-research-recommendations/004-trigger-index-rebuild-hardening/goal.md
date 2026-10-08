---
title: "Goal: Phase 4: trigger-index-rebuild-hardening"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: trigger-index-rebuild-hardening

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the CI trigger-index rebuild job stage all four generator outputs with a post-commit check, skip only its own rebuild commit by an exact or marker guard, and retry a raced push once after regenerating and checking the index. The token is left as it is.

### Decisions

Frozen choices, decided 2026-10-08 by the operator. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Leave the token as it is: no `persist-credentials` change, no GitHub environment, no secret move, and the `skilled/**` trigger stays |
| D2 | Keep the rest: stage all four generated files, an exact-match or marker loop guard, and regenerate plus `--check` before the retry push |
| D3 | Built in wave 1 by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model opencode-go/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D4 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D5 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `git ls-tree` on a rebuild commit lists `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`, and the post-commit `--check` passes
- [ ] The job `if:` no longer uses `startsWith`: a commit whose subject only starts with the rebuild subject runs the job, and the job's own rebuild commit is skipped
- [ ] On a non-fast-forward push the log shows fetch, rebase, one `generate-trigger-index.mjs` run and `--check` before the single retry
- [ ] Non-fast-forward errors print a message distinct from auth or other failures
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
| Planning complete | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md all validate --strict |

### Deviations and findings

| Item | Note |
|------|------|
| Dropped research item | Research claimed the job runs "without set -e", but GitHub runs each `run:` step with `bash -e {0}` by default (visible in the job log as `shell: /usr/bin/bash -e {0}`). Dropped this item and removed all pipefail requirements. |
| Token decision | 2026-10-08, the operator chose to leave the token as it is and keep the `skilled/**` trigger. Token scoping and a main-only GitHub environment were considered because the ruleset-bypass token sits in the checkout credential while repository code runs, and `skilled/**` has no protection. Their requirements, tasks, acceptance rows and goal criteria are removed. At decision time `git ls-remote --heads origin` showed no `skilled/**` branch |
| Branch protection facts | Checked on 2026-10-08 with `gh api repos/{owner}/{repo}/rulesets` and `gh api repos/{owner}/{repo}/branches/main/protection`. Found: two rulesets, both targeting `~DEFAULT_BRANCH` (main). `main-protection` (id 11725786) is disabled. `message-contract-required` (id 24326453) is active. No ruleset targets `skilled/**`. Classic protection on main returns 404 "Branch not protected". So `skilled/**` has zero protection and main has only the active required status check. Token exposure risk stands, and the operator accepted it. |
<!-- /ANCHOR:log -->
