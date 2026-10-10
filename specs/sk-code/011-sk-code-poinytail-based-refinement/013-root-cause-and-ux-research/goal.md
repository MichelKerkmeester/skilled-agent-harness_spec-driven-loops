---
title: "Goal: Phase 13: root-cause-and-ux-research"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research"
    last_updated_at: "2026-10-10T18:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-013-root-cause-and-ux-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 13: root-cause-and-ux-research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a checked synthesis in research/research.md of the root causes behind the process errors and open product issues of the sk-code Ponytail refinement epic, and of what would make this framework work for external users who adopt it in their own repositories, ending in small implementation phases ranked by external-user impact against cost.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One /deep:research lineage runs ten iterations on DeepSeek V4.1 Flash at max effort through cli-pi on the llmgateway route, with stop policy max-iterations. If that route fails, the cline-pass route replaces it. |
| D2 | This phase is research only. No product file changes; every write stays in this packet folder and the one phase-map row in the parent spec.md. |
| D3 | Every load-bearing claim in the synthesis is marked VERIFIED, after the orchestrator read the cited line or ran the command, or INFERRED. |
| D4 | Every proposed fix passes .skilled/repo-rules/prevent-overengineering.md. An idea that fails it is listed as rejected, with the reason. |
| D5 | Each proposed phase names the one file it changes and the command that proves it. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/research/lineages/dsflash-llmgw/deep-research-state.jsonl`, run from the repository root, prints 10.
- [ ] `grep -cE '^## [0-9]+\. (Proposed Implementation Phases|Rejected Ideas)$' specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/research/research.md`, run from the repository root, prints 2.
- [ ] `grep -cE '\[(VERIFIED|INFERRED)\]' specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/research/research.md`, run from the repository root, prints 10 or more.
- [ ] `grep -o '\[SOURCE: [^]]*\]' specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/research/research.md | sed -E 's/\[SOURCE: (.*):([0-9]+)\]/\1 \2/' | sort -u | while read f l; do [ -f "$f" ] && [ "$(wc -l < "$f")" -ge "$l" ] || echo "BAD $f:$l"; done`, run from the repository root, prints no BAD line.
- [ ] `git diff --name-only 5d9c970447 HEAD -- . ':!specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research' ':!specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md'`, run from the repository root, prints nothing.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research --strict`, run from the repository root, prints RESULT: PASSED.
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
| Packet scaffolded | Done | create.sh appended phase 12; the folder was renamed to 013 because sibling tracks own 012 and 014 |
| Lineage run | Done | fanout-run.cjs ran 18:40Z to 19:10Z on llmgateway; summary succeeded 1, containment advisory 0; criterion 1 printed 10 |
| research.md sections | Done | criterion 2 printed 2 on 2026-10-10 |
| Verification marks | Done | criterion 3 printed 22 on 2026-10-10 |
| SOURCE tags | Done | criterion 4 printed no BAD line on 2026-10-10 |
| Strict validation | Done | validate.sh --strict printed Errors: 0 Warnings: 1 and RESULT: PASSED, exit 0, on 2026-10-10 |
| Product files unchanged | Pending commit | criterion 5 is rerun after the commit |

### Deviations and findings

| Item | Note |
|------|------|
| Fan-out runner with one lineage | The brief names one executor, which on its own selects the single-executor path. The run uses the workflow's fan-out step with one cli-pi lineage instead, as the referenced r3-dsflash-llmgw lineage did, so Pi runs the loop and the orchestrator runs synthesis |
| No route switch | The llmgateway route never hit its usage limit, so the cline-pass fallback and the reset wait the operator allowed were not needed |
| Strict warning left in place | SOURCE_TAGS warns on one tag in the lineage's write-once iteration-001.md: heal-spec-docs.cjs sits under runtime/cli/spec/, not runtime/cli/. The orchestrator synthesis does not repeat the bad path |
| Close-out event not appended | synthesis-closeout.cjs produced a synthesis_complete event scoped to the lineage run, which the lineage already recorded; the fan-out root has no run of its own |
<!-- /ANCHOR:log -->
