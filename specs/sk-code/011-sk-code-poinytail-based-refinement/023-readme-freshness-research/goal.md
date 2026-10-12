---
title: "Goal: Phase 23: readme-freshness-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "readme freshness research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research"
    last_updated_at: "2026-10-12T14:34:03Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-023"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 23: readme-freshness-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** List every stale, missing or wrong statement in the root README and its related READMEs after the v4.0.0.4 changes, each with evidence and the smallest wording fix.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run writes only under this folder. No README or product file changes. |
| D2 | The run uses `/deep:research` for 10 iterations on `cli-devin` with `deepseek-v4-1-flash-max`. A convergence stop before 10 is not done; a usage limit stops the run with no fallback. |
| D3 | Each fix row of `research/research.md` reads `\| F<n> \| <README path:line> \| <claim> \| <evidence> \| <class> \| <severity> \| <fix> \|`, grouped per README and ranked so F1 matters most. |
| D4 | Every fix passes .skilled/repo-rules/prevent-overengineering.md: the smallest correct wording change, no restructure. |
| D5 | An executor's report is a claim. The orchestrator reads every cited path:line before the synthesis uses it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/deep-research-state.jsonl`, run from the repository root, prints 10.
- [ ] `grep -cE '^\| F[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md`, run from the repository root, prints 1 or more.
- [ ] `grep -E '^\| F[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, so every fix row cites a path:line.
- [ ] `grep -E '^\| F[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md | grep -cvE '\| (STALE|MISSING|WRONG) \|'`, run from the repository root, prints 0, so every fix row names its class.
- [ ] `grep -c 'OK-VERIFIED' specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md`, run from the repository root, prints 1 or more.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research --strict`, run from the repository root, prints RESULT: PASSED.
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
| Packet scaffolded | Done | create.sh phase mode with `--with-goal` under the 011 epic |

### Deviations and findings

| Item | Note |
|------|------|
| Executor switched before any iteration | The brief first named cli-pi on the LLM gateway; the operator corrected it to cli-devin before any iteration ran. `devin models list` lists `deepseek-v4-1-flash-max` (DeepSeek V4.1 Flash Max), which is also in `DEVIN_SUPPORTED_MODELS`; cli-devin has no reasoning-effort flag, so max effort is the model id |
<!-- /ANCHOR:log -->
