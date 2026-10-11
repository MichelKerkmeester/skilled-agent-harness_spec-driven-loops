---
title: "Goal: Onboarding fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "onboarding fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes"
    last_updated_at: "2026-10-11T19:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-021-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Onboarding fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a fresh clone that follows only the numbered README steps reach a routed request, with every failure on the way naming its cause.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `.claude/settings.json` does not change: R3 is closed by the operator decision of 2026-10-11. |
| D2 | Generated mirrors are changed through their source and generator, never by hand. |
| D3 | Every ledger row in `spec.md` ends Fixed with a command proof or Closed with a written reason that prevent-overengineering or an operator decision backs. |
| D4 | Changed behavior gets a test that fails before the change and passes after it. |
| D5 | Each touched skill is bumped once, with one changelog entry. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -cE '^\| R[0-9]+ \| (Fixed|Closed) \|' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes/implementation-summary.md`, run from the repository root, prints 14.
- [ ] `grep -E '^\| R[0-9]+ \| Fixed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes/implementation-summary.md | grep -vcF "$(printf '\140')"` prints 0, and `grep -E '^\| R[0-9]+ \| Closed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes/implementation-summary.md | grep -vcE 'prevent-overengineering|operator decision'` prints 0, both run from the repository root.
- [ ] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes/implementation-summary.md; [ "$(grep -cE '^\| T[0-9]+ \| .+ \| before: exit [1-9][0-9]* \| after: exit 0 \|$' $F)" = "$(grep -cE '^\| T[0-9]+ \|' $F)" ] && grep -qE '^\| T1 \|' $F && echo ok`, run from the repository root, prints ok.
- [ ] `B=$(git log -1 --format=%H --grep='scaffold the open ends remediation phases'); for s in $(git diff --name-only $B HEAD -- .skilled/skills | cut -d/ -f3 | sort -u); do [ "$(git diff --name-only --diff-filter=A $B HEAD -- .skilled/skills/$s/changelog | wc -l | tr -d ' ')" = 1 ] && git diff $B HEAD -- .skilled/skills/$s/SKILL.md | grep -q '^+version:' || echo $s; done`, run from the repository root, prints nothing.
- [ ] `B=$(git log -1 --format=%H --grep='scaffold the open ends remediation phases'); git log --format=%H $B..HEAD -- .claude/settings.json | wc -l | tr -d ' '`, run from the repository root, prints 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--with-goal`; spec.md lists every ledger row |
| Build | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
