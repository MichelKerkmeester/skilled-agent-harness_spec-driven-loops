---
title: "Goal: Phase 13: anchor-contract-alignment"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment"
    last_updated_at: "2026-10-09T11:20:00Z"
    last_updated_by: "closeout-worker"
    recent_action: "Closeout pass 3: criteria checked against the evidence, see the Log"
    next_safe_action: "None for this phase. Criterion 4 needs the parent decision"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "acceptance-criteria.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: ["Which anchor rules should ANCHORS_VALID check? Operator chose option 2 on 2026-10-08"]
---
# Goal: Phase 13: anchor-contract-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make ANCHORS_VALID report nesting, except `adr-NNN` holding `adr-NNN-*`, and duplicate closers, ship nesting as a warning after phase 001 and as an error after phase 011, and make the code, registry and docs say the same thing.

### Decisions

Frozen choices, decided 2026-10-08 by the operator. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Option 2: a nesting check that allows `adr-NNN` to contain `adr-NNN-*`, the decision-record layout |
| D2 | Duplicate closers are detected: a name closed more times than it is opened |
| D3 | Nesting is a warning after phase 001 lands and an error after phase 011 lands. 013 depends on 001 and 011 |
| D4 | Template-sequence order is rejected |
| D5 | Baseline the corpus before each severity step |
| D6 | Built in wave 4 by GPT-6 Luna max on the fast tier through cli-codex: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 codex -a never exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox workspace-write "<brief>" </dev/null`. One brief per task group in tasks.md, each naming its files and the check that proves it |
| D7 | Reviewed read-only by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route with `--tools read,grep,find,ls`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D8 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] Vitest fixtures pass: nested `questions` reported, `adr-001` holding `adr-001-context` allowed, a duplicate closer reported
- [ ] A nesting finding is a warning before phase 011 lands and an error after, shown by a fixture checking the severity
- [x] `sed -n '109p' .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` and validation-rules.md Anchor Rules describe exactly what the code checks
- [ ] A baseline and a comparison report exist for each step, as files in this packet's scratch/ folder
- [x] `validate.sh --strict` on this packet prints RESULT: PASSED

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

### Deviations and findings

| Item | Note |
|------|------|
| Anchor rules decided | 2026-10-08, the operator chose option 2 with the `adr-NNN` allowance plus duplicate closers. The allowance is needed because the decision-record template nests by design, so a literal "no nesting" rule fails a correct template |
| Severity steps decided | Warning after 001, error after 011, because about 416 live packets nest today, 403 of them only through the old `questions` layout |
| Order rejected | Template-sequence order would add about 45 live and 95 archived failures with no repair, and regrade the corpus on template edits |
| Closeout pass 3 (2026-10-09) | Criteria 1, 3 and 5 checked against the evidence. Criterion 2: the warning state was shown at step A, and its test was replaced at step B, so no live fixture shows it. Criterion 4 stays open: step A has a baseline only, with no comparison file. See implementation-summary.md Open Items |
<!-- /ANCHOR:log -->

---
