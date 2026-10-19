---
title: "Goal: Phase 28: surface-setup-hardening-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "surface setup hardening research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research"
    last_updated_at: "2026-10-13T17:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Ran both lineages, verified the findings and wrote the synthesis"
    next_safe_action: "Operator picks whether to scaffold build phases P1 and P2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 28: surface-setup-hardening-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Recommend, with checked evidence, how to harden the rule that only sk-code-skilled and sk-code-review matter to an external user and that a new surface outranks sk-code-skilled, how to smooth that user's setup, and whether the setup belongs in a doctor command or a sk-code mode.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run writes only under this folder and the epic's phase rows. Experiments run in throwaway copies under the session scratchpad's `028/` folder, never in a worktree or the main checkout. |
| D2 | `/deep:research` runs two lineages of five iterations, stop policy max-iterations, concurrency 2: `deepseek-max` on `cli-devin` with `deepseek-v4-1-flash-max` and `swe-max` on `cli-devin` with `swe-2-max`. A lineage that hits `resource_exhausted` alone switches to `pi -p --no-extensions --model llmgateway/deepseek-v4.1-flash --thinking max`. |
| D3 | `research/research.md` holds F rows `\| F<n> \| <class> \| <claim> \| <evidence path:line> \| <NEW or ALREADY-COVERED> \| <CONFIRMED or REJECTED> \| <lineage> \|`, ranked R rows, a doctor-versus-mode section, rejected X rows and P rows each with a goal sketch. |
| D4 | A lineage's claim is a hypothesis. The orchestrator checks each load-bearing finding against the tree with a command or a file read before marking it CONFIRMED. |
| D5 | Every recommendation passes .skilled/repo-rules/prevent-overengineering.md: it names the failure it prevents, the smallest change and the cheaper move that fails. Operator ruling R5 stands. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `for L in deepseek-max swe-max; do grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/lineages/$L/deep-research-state.jsonl; done`, run from the repository root, prints 5 twice.
- [ ] `grep -E '^\| F[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+.*\| (NEW|ALREADY-COVERED[^|]*) \| (CONFIRMED|REJECTED) \|'`, run from the repository root, prints 0, and the same grep without the inverted filter counts 1 or more rows.
- [ ] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, and `grep -cE '^\| R1 \|'` on the same file prints 1.
- [ ] On specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research/research/research.md, `grep -cE '^\| X[0-9]+ \|'` prints 1 or more, `grep -ciE '^## .*doctor.*mode'` prints 1 or more, and `grep -cE '^\| P[0-9]+ \|'` and `grep -cE '^#### Goal sketch: P[0-9]+'` print the same number, 1 or more.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research --strict`, run from the repository root, prints RESULT: PASSED.
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
| Packet scaffolded | Done | create.sh phase mode with `--with-goal` under the 011 epic at Level 1; recommend-level.sh printed Level 0 (Quick) for `--loc 0 --files 3`, and Level 1 is the lowest create.sh writes |
| Base copy | Done | Full-tree APFS copy with provisioned `node_modules`, `specs/` cut to the compiled-routing closure, one commit; control battery exit 0 four times |
| Lineage deepseek-max | Done | Five iterations on `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous`, all receipts exit 0, all verified first time |
| Lineage swe-max | Done | Five iterations on `devin -p --model swe-2-max --permission-mode dangerous`, all receipts exit 0; iteration 5 recovered as logged below |
| Merge | Done | `fanout-merge.cjs` and the fan-out resource map from 10 delta sources |
| Verification | Done | Five concurrent DeepSeek verifier agents plus the orchestrator's rereads and experiments E1 to E6; 30 findings CONFIRMED, 2 REJECTED |
| Synthesis | Done | `research/research.md`: F1 to F32, R1 to R5, X1 to X11, P1 and P2 with goal sketches |

### Deviations and findings

| Item | Note |
|------|------|
| Dispatch shape | The YAML's `step_fanout_spawn_cli` runs whole lineages in `fanout-run.cjs`, which outlasts the ten-minute foreground cap, and the brief bars waiting on a detached job. The orchestrator ran the YAML's per-iteration steps instead, both lineages dispatched together each round (concurrency 2), through the YAML's own `cli-devin` branch, as 025 did |
| Simplified steps | As in 025: no single-loop telemetry rows, no executor block patched into the state projection (the gateway owns that file), no per-lineage convergence closeout; the loop locks were taken by a short-lived process, so each refresh and release used its recorded pid and nonce |
| swe-max iteration 5 | The leaf wrote its narrative and delta, then hit the 560 s limit before calling the gateway, so `verify-iteration.cjs` failed `state_record_missing`. The orchestrator recorded the leaf's own line-1 record from `deltas/iter-005.jsonl` through the gateway instead of redispatching, because the narrative and delta are write-once; verification then passed |
| Write containment | Running both lineages at once made each dispatch's containment guard quarantine the sibling lineage's new files; every flagged path is inside this folder, and the quarantine records are kept with the run |
| Verification fan-out | Operator rule received mid-run: five `cli-devin` `deepseek-v4-1-flash-max` agents ran concurrently, one area each (provisioning, compiled routing, doctor family, leftover references, scaffold and advisor), each in its own `028/v<n>-*` copies; no Devin throttling, so no `pi` fallback. The orchestrator checked each verdict and rejected one sub-answer (V4.6 searched only `.skilled/` for the README block) |
| Out-of-scope writes by verifiers | One verifier redirected check output to `o1.txt` and `o2.txt` at the worktree root; the orchestrator removed both. Another appended keywords to `.skilled/skills/sk-code/description.json` and restored it itself with `git checkout --`; `git status` showed the file clean |
| GPT fast-mode rule | Received mid-run; no GPT model was used by any lineage, verifier or the synthesis |
| Criterion 2 wording | Amended before any synthesis existed so the regex follows D3's column order (citation, then coverage, then verdict) |
| Base copy commit | The throwaway base repo under the scratchpad was committed with hooks disabled; no project commit used `--no-verify` |
<!-- /ANCHOR:log -->
