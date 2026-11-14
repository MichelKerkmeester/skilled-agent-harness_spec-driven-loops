---
title: "Goal: Phase 18: sk-git-rebase-sentence"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sk-git rebase sentence goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence"
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase goal from spec.md and acceptance-criteria.md"
    next_safe_action: "Build the phase from tasks.md after the operator's workspace choice"
    blockers: []
    key_files: [".skilled/skills/sk-git/SKILL.md", ".skilled/scripts/git-hooks/prepare-commit-msg"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-sk-git-rebase-sentence"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Why did 16 picks of the rebase on 2026-11-13 at 20:41 keep their id? Task T003 reads that rebase's reflog."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 18: sk-git-rebase-sentence

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The sk-git skill says what the commit hook does to a `Commit-Id` during a rebase, backed by a saved throwaway-repository probe, and the change ships as sk-git `1.11.12.0` with its changelog entry.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The sentence is written from `scratch/rebase-probe.txt` and claims nothing the probe did not show. |
| D2 | The commit hook and its test do not change. No rebase case is added to the hook test, because the hook does not change and its cherry-pick case pins the branch a rebase pick takes. |
| D3 | A documentation fix is a `patch` bump under sk-doc's changelog rules: `1.11.11.0` becomes `1.11.12.0`, written through `/create:changelog`. |
| D4 | The probe writes git state only in its own temporary repository. The reflog read is read-only. |
| D5 | A document child, as children 009 and 014 are. No code changes, so parent D1's failing-first test does not apply, and the probe is the evidence. |
| D6 | Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `scratch/rebase-probe.txt` holds four blocks, a pick onto a moved base, an unchanged leading commit, a reword and `git rebase --apply`, each with the git version, the id before, the `CHERRY_PICK_HEAD` state and the id after.
- [ ] `rg -c 'A rebase keeps an id only when the replayed message still carries one' .skilled/skills/sk-git/SKILL.md` prints nothing with exit 1.
- [ ] `rg -n '^version:' .skilled/skills/sk-git/SKILL.md` prints `6:version: 1.11.12.0` and `ls .skilled/skills/sk-git/changelog/v1.11.12.0.md` exits 0.
- [ ] `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-git` and `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` both exit 0.
- [ ] `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence --strict` prints `RESULT: PASSED`.
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
| Review findings | Done | 2026-11-14. Alignment run B-01, P1: the rebase sentence is false, with a probe that showed `0000002` become `0000004`, which the orchestrator reproduced. Alignment run C-1, P2: no version bump or changelog entry. Both independent reviews confirmed B-01, and review FH read 106 of 122 rebase picks re-minted and 16 kept |
| Code read | Done | 2026-11-14 at `99d197475d`: the hook re-mints on `CHERRY_PICK_HEAD` at lines 125, 240 and 286 and never names a rebase, and its test has no rebase case. The output is quoted in `spec.md` Measured Behavior |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written. `implementation-summary.md` is written after the build |
| Build | Pending | Tasks T001 to T014 |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| No hook test | The brief asked the restraint pass to decide whether a rebase case in the hook test is earned. It is not: the hook does not change, its cherry-pick case pins the same branch, and a rebase case would test git's behavior, which the saved probe records for this version |
| Phase 9 row | AC-004 of phase 9 was Met on a search for the sentence, not on the hook. It keeps its status and gains a dated note, because the criterion as written was met and the sentence it checked was wrong |
| 16 kept ids | Open. Task T003 checks whether git left those commits unreplayed. The cause is unknown until then |
<!-- /ANCHOR:log -->
