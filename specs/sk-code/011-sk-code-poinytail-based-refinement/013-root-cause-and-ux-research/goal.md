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
    last_updated_at: "2026-10-10T19:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Widened the goal to the fix phases"
    next_safe_action: "Build the phases in order"
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

**Objective:** Trace the refinement epic's errors to their root causes in research/research.md and ship the ranked fixes this track owns, so an adopter's compiled-route rebuild, tests, canaries, Pi denial text, Node floor and hook stdin coverage hold on a clean checkout.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research and builds run on DeepSeek V4.1 Flash through cli-pi on llmgateway at max effort; cline-pass replaces it when DevPass is limited. |
| D2 | Each phase owns disjoint files. Git hooks, generators, the advisor runtime and the changelog workflow belong to the skill-authoring track; a fix needing them becomes a recorded handoff. |
| D3 | A builder's report is a claim. The orchestrator reruns every check, and every new test gets one failing-before run. |
| D4 | Every change passes .skilled/repo-rules/prevent-overengineering.md. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-compiled-route-manifest-suite | `001-compiled-route-manifest-suite/goal.md` |
| 002-admission-corpus-pin | `002-admission-corpus-pin/goal.md` |
| 003-stale-jev-canary | `003-stale-jev-canary/goal.md` |
| 004-pi-ambiguous-denial | `004-pi-ambiguous-denial/goal.md` |
| 005-readme-node-floor | `005-readme-node-floor/goal.md` |
| 006-hook-late-write-test | `006-hook-late-write-test/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/research/lineages/dsflash-llmgw/deep-research-state.jsonl`, run from the repository root, prints 10.
- [ ] `grep -cE '^## [0-9]+\. (Proposed Implementation Phases|Rejected Ideas)$' specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/research/research.md`, run from the repository root, prints 2.
- [ ] `grep -cE '\[(VERIFIED|INFERRED)\]' specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/research/research.md`, run from the repository root, prints 10 or more.
- [ ] `node .skilled/bin/compiled-route-sync.cjs --check >/dev/null 2>&1; echo $?`, run from the repository root, prints 0.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs | tail -1`, run from the repository root, prints `all hubs failures 0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research --strict --recursive`, run from the repository root, prints RESULT: PASSED.
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
| Product files unchanged | Done | criterion 5, as amended, printed nothing after commit bd2d084c85 |
| Phase 001 | Done | fde8a56d87; sync --check exit 1 to 0; manifest suite 26 to 42 of 42; guard exit 0 |
| Phase 002 | Done | 48c4d4284f; admission suite 28 to 29 of 29 |
| Phase 003 | Done | 6df2b9c3b5; all hub canaries 1 failure to 0 |
| Phase 004 | Done | 7cd3e8e5db; Pi lint suite 35, then 1 failed with the new test, then 36 of 36 |
| Phase 005 | Done | 54f9d041fd and 4a8a4065b6; README Node.js 20.19+ |
| Phase 006 | Done | 54b4547bff; hook stdin suite 39 to 40 of 40; system-spec-kit 2.7.2.1 |

### Deviations and findings

| Item | Note |
|------|------|
| Fan-out runner with one lineage | The brief names one executor, which on its own selects the single-executor path. The run uses the workflow's fan-out step with one cli-pi lineage instead, as the referenced r3-dsflash-llmgw lineage did, so Pi runs the loop and the orchestrator runs synthesis |
| No route switch | The llmgateway route never hit its usage limit, so the cline-pass fallback and the reset wait the operator allowed were not needed |
| Strict warning left in place | SOURCE_TAGS warns on one tag in the lineage's write-once iteration-001.md: heal-spec-docs.cjs sits under runtime/cli/spec/, not runtime/cli/. The orchestrator synthesis does not repeat the bad path |
| Close-out event not appended | synthesis-closeout.cjs produced a synthesis_complete event scoped to the lineage run, which the lineage already recorded; the fan-out root has no run of its own |
| Criterion 5 amended 2026-10-10 | The commit's spec-remint gate re-derived the parent graph-metadata.json to list this child, which is derived metadata of the phase-map row, not a product file. The criterion now excludes that one file as well. Sibling tracks adding 012 and 014 will touch the same children list, so the merge needs a re-derive |
| Scope widened 2026-10-10 | The operator added fixes 1, 2, 3, 6, 7, 8 and 9 as phase children. The product-file criterion is replaced by the fixes' own outcome checks and a recursive strict validation. Fixes 4 and 5 went to the skill-authoring track |
| Handoff: advisor runtime engines | `.skilled/skills/system-skill-advisor/runtime/package.json` declares no engines, so npm never warns below 20.19 at its install. Owned by the skill-authoring track |
| Handoff: version collision | Phase 006 minted system-spec-kit 2.7.2.1 from the local folder. If another track mints the same number, the merge renumbers |
| Fixes 4 and 5 | The pre-commit trust hint and the changelog mint check moved to the skill-authoring track by operator direction |
<!-- /ANCHOR:log -->
