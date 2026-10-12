---
title: "Goal: Playbook root and stale refs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook root and stale refs goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs"
    last_updated_at: "2026-10-12T10:00:00Z"
    last_updated_by: "builder"
    recent_action: "Closed the phase: build, review and review fixes"
    next_safe_action: "Orchestrator merges the branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-022-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Playbook root and stale refs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the playbook validator check backticked paths in root playbook files too, resolve or explain every root warning that check finds, and fix the six stale references phase 002 left as found.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The root-file check is report-only, like the scenario check, and has a test that fails without it. |
| D2 | Each root warning gets the narrowest change: the corrected path, its successor, removal when no successor exists, wording that no longer reads as a repo path, or a Remaining row. |
| D3 | Link and wording corrections are doc maintenance recorded by each doc's own version, not a skill release (operator ruling). sk-doc gets one bump and changelog entry for the validator change. |
| D4 | No `version:` line is edited by hand; the pre-commit hook raises changed docs. |
| D5 | Every ledger row ends Fixed with a backticked command proof or Closed with a reason that prevent-overengineering or an operator decision backs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `V=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs; S=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md; node $V --strict >/dev/null 2>&1 && o=$(node $V --strict 2>&1 | grep BACKTICK_PATH_UNRESOLVED); n=$(printf '%s\n' "$o" | grep -c ' manual-testing-playbook\.md:'); m=$(printf '%s\n' "$o" | grep -vc ' manual-testing-playbook\.md:'); r=$(grep -cE '^\| RM-[0-9]+ \| .+ \| .+ \|$' $S); [ "$n" = "$r" ] && [ "$m" = 1 ] && echo ok`, run from the repository root, prints ok.
- [x] `grep -cE '^\| (RR-1|RR-2\.[0-9]{2}|SR-[1-6]) \| (Fixed|Closed) \|' specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md`, run from the repository root, prints 20.
- [x] `S=specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md; grep -E '^\| (RR|SR)-[0-9.]+ \| Fixed \|' $S | grep -vcF "$(printf '\140')"; grep -E '^\| (RR|SR)-[0-9.]+ \| Closed \|' $S | grep -vcE 'prevent-overengineering|operator decision'`, run from the repository root, prints 0 twice.
- [x] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs >/dev/null && echo ok`, run from the repository root, prints ok.
- [x] `cat .skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md .skilled/skills/sk-vision/feature-catalog/*/*.md .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/*.md .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/*/*.md .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/*/*.md .skilled/skills/sk-design/sk-design-diagram/references/import-export/export.md .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/*.md | grep -cE 'codex/settings\.json|[|] .pi/sk-vision\.ts|Phase [0-9]{3}.s |-t "deep-ai-council"|assets/index\.html|the five .\.skilled/commands/doctor'`, run from the repository root, prints 0.
- [x] `git log --no-merges --format= --name-only --diff-filter=A --grep='^Spec: sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs$' -- .skilled/skills | grep /changelog/`, run from the repository root, prints exactly `.skilled/skills/sk-doc/changelog/v2.3.9.0.md`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--parent`, `--level 2` and `--with-goal` |
| Build | Done | Commits `0099d2c6d7` (validator, sk-doc 2.3.9.0) and `45d7fca7fd` (root and stale reference fixes): root warnings 70 to 1, recorded as RM-1 |
| Review | Done | `/deep:review :auto`, 5 iterations: 0 P0, 0 P1, 5 P2; CONDITIONAL from one search-debt item, closed by an observed revert run |
| Review fixes | Done | Commit `3c808f6d55` fixed R2, R4 and R5; R3 fixed in the parent continuity; R1 rejected |
| Criteria | Done | 1 ok; 2 prints 20; 3 prints 0 and 0; 4 ok; 5 prints 0; 6 prints the sk-doc v2.3.9.0 entry only; 7 RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Baseline | 70 root warnings in 13 files and 1 scenario warning on origin/main `b4d4e90192` |
| CO-013 root summary | Aligned with its scenario beyond the path, because the cited agent file cannot exist: `general` is an OpenCode built-in the contract forbids passing |
| SR-3 siblings | The same phase label class in two sibling lines of cli-cursor was fixed with the named one |
<!-- /ANCHOR:log -->
