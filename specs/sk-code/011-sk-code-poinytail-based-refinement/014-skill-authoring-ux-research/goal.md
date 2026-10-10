---
title: "Goal: Phase 14: skill-authoring-ux-research"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research"
    last_updated_at: "2026-10-10T18:50:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-skill-authoring-ux-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 14: skill-authoring-ux-research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a verified, source-cited synthesis in research/research.md that names the root cause of each 092 authoring error class inside sk-create-skill and system-skill-advisor and ranks the smallest authoring-time changes that would stop it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One `/deep:research` `:auto` lineage, label t3-dsflash-llmgw, runs up to ten iterations on DeepSeek V4.1 Flash at max effort through cli-pi and the LLM Gateway route; the fallback is `cline-pass/deepseek-v4.1-flash` |
| D2 | This phase is read-only research. The run writes only under research/ and the packet docs, and no file under .skilled/ changes |
| D3 | A claim is Verified only when the orchestrator ran the command or read the cited line itself; otherwise it is Inferred |
| D4 | Every recommendation passes the reversal-cost order in .skilled/repo-rules/prevent-overengineering.md, and every idea that fails it is listed with the reason |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/research/lineages/t3-dsflash-llmgw/deep-research-state.jsonl`, run from the repository root, prints a number from 3 to 10.
- [ ] `grep -cE '^## [0-9]+\. (Root Causes|Rejected Ideas|Proposed Implementation Phases)$' specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/research/research.md`, run from the repository root, prints 3.
- [ ] `grep -cE '^Evidence status: (Verified|Inferred)' specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/research/research.md`, run from the repository root, prints 7 or more.
- [ ] `grep -o '\[SOURCE: [^]]*\]' specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/research/research.md | sed -E 's/\[SOURCE: (.*):([0-9]+)\]/\1 \2/' | sort -u | while read f l; do [ -f "$f" ] && [ "$(wc -l < "$f")" -ge "$l" ] || echo "BAD $f:$l"; done`, run from the repository root, prints no BAD line.
- [ ] `git diff --name-only 5d9c970447 HEAD -- .skilled`, run from the repository root, prints nothing.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research --strict`, run from the repository root, prints RESULT: PASSED.
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
| Packet scaffolded and parent rows added | Done | create.sh --phase --parent added 014; parent spec.md phase-map row and parent goal.md binding row added by hand |
| Lineage run | Done | 10 iteration records; fan-out succeeded 1, failed 0, no containment advisory; LLM Gateway route throughout, no usage limit, no cline switch or wait |
| Claims verified by the orchestrator | Done | Battery 12/17 and 2/5 via skill-advisor.cjs; lane attribution for N1, N5, P1; leaf drift and partial version bump reproduced in scratch copies; intent-signal check exit 1; freshness panel STALE with exit 0 |
| Synthesis written | Done | research/research.md: 3 required sections, 9 evidence-status lines, 31 resolving SOURCE tags |
| Strict validation | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Phase number 14 while 12 and 13 are absent here | Sibling tracks add 012 and 013 in other worktrees. create.sh numbers after the highest existing child, so a temporary empty 013 folder was made for the scaffold run and removed, with its traces taken out of the parent spec.md and graph-metadata.json |
| Lineage corrections | The lineage said the file-path pull comes from the derived lane; attribution shows the explicit lane skill-name point and the executor-delegation lift. Recorded in research.md E3 |
| Parent goal budget | With the binding row the parent durable slice is 4,064 characters, over 4,000; without it check-goal reports a missing row. Left for the master orchestrator to cut at merge |
| Parent goal.md binding row | The track brief allowed only the parent spec.md row. sk-create-goal's phase-add workflow requires one parent binding row, so one row was added and nothing else in the parent goal changed. The parent chat slice changed and is the master orchestrator's to resend |
<!-- /ANCHOR:log -->
