---
title: "Goal: Phase 25: external-surface-priority-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "external surface priority research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research"
    last_updated_at: "2026-10-13T12:00:00Z"
    last_updated_by: "verification-pass"
    recent_action: "Verified the merged two-round synthesis and set the final recommendations"
    next_safe_action: "Operator picks which of phases P8 to P11 to build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-025"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 25: external-surface-priority-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Recommend, with evidence, how a user's own sk-code surface outranks sk-code-opencode once the obsidian and webflow example surfaces are deleted, while the operator's repository keeps its order.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run writes only under this folder. No skill, script, command or README changes; delete experiments run in a copy outside the worktree. |
| D2 | `/deep:research` runs two lineages of 10 iterations, stop policy max-iterations: `dsflash-devin` on `cli-devin` with `deepseek-v4-1-flash-max`, and `luna-max-fast` on `cli-codex` with `gpt-6-luna`, effort max, tier fast. An unavailable executor stops the run with no substitute. |
| D3 | `research/research.md` holds F rows `\| F<n> \| <ORDER, PRESENCE, BREAK, DOC or OK> \| <claim> \| <evidence> \| <severity> \| <lineage> \|`, ranked R rows, rejected X rows, proposed P rows and a section on where the lineages disagree. |
| D4 | Every recommendation passes .skilled/repo-rules/prevent-overengineering.md and names the cheaper move it rejects. |
| D5 | An executor's report is a claim. The orchestrator reads every cited path:line and reruns the delete experiment before the synthesis uses it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `for L in dsflash-devin luna-max-fast; do grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/$L/deep-research-state.jsonl; done`, run from the repository root, prints 10 twice (round one).
- [ ] `for L in swe2max-devin luna-max-fast-r2; do grep -c '"type":"iteration"' specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/$L/deep-research-state.jsonl; done`, run from the repository root, prints 10 twice (round two).
- [ ] `grep -E '^\| F[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md | grep -cvE '\| (ORDER|PRESENCE|BREAK|DOC|OK) \|.*[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, and the same grep without the inverted filter counts 1 or more rows, so every F row names its class and cites a path:line.
- [ ] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, and `grep -cE '^\| R1 \|'` on the same file prints 1.
- [ ] `grep -cE '^\| X[0-9]+ \|'` and `grep -cE '^\| P[0-9]+ \|'` on specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md each print 1 or more, and `grep -ciE '^## .*disagree'` on it prints 1 or more.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research --strict`, run from the repository root, prints RESULT: PASSED.
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
| Packet scaffolded | Done | create.sh phase mode with `--with-goal` under the 011 epic; create.sh numbered it 023, so the folder and its ids were renamed to 025 |
| Lineage A, dsflash-devin | Done | 10 iterations on `devin -p --model deepseek-v4-1-flash-max`, all receipts exit 0, all verified first time |
| Lineage B, luna-max-fast | Done | 10 iterations on `codex exec --model gpt-6-luna` effort max tier fast; iterations 4 and 5 ended by SIGTERM at 570 s after writing their artifacts, both verified |
| Spot-check | Done | The orchestrator reread every anchor in `research/research.md` section 9, corrected three line citations and one lineage B citation, and reran the delete, data-removal and reorder experiments in its own full-tree copy |
| Synthesis | Done | `research/research.md`: F1 to F33, R1 to R5, X1 to X9, P1 to P4 and the disagreement section |
| Round two, lineage C, swe2max-devin | Done | 10 iterations on `devin -p --model swe-2-max --permission-mode dangerous`, all receipts exit 0, all verified on the first dispatch |
| Round two, lineage D, luna-max-fast-r2 | Done | Iterations 1 to 4 on `codex exec --model gpt-6-luna` effort max tier fast; 5 to 10 on `pi -p --fast --offline --model openai/gpt-6-luna --thinking xhigh` |
| Round two merge | Done | `fanout-merge.cjs` merged 4 lineages; fan-out resource map regenerated from 40 delta sources |
| Round two synthesis | Done | A fresh synthesizer merged both rounds into `research/research.md` (F1 to F82, R1 to R10, X1 to X19, P1 to P7) |
| Verification pass | Done | A fresh verifier checked 105 claims against the iterations and the repo in six throwaway copies (V0 to V7), corrected 13 findings, added F83 to F96 and X20 to X24, and wrote section 13 (Verification pass) and section 14 (Final recommendations: R1, R9, R3, R2, R7, R4, R8 in phases P8 to P11) |
| Criteria rerun 2026-10-13 | Done | Criterion 1 prints 10 and 10; criterion 2 prints 10 and 10; criterion 3 prints 0 with 96 F rows counted; criterion 4 prints 0 and `R1` once; criterion 5 counts 24 X rows, 11 P rows and 1 disagreement heading; criterion 6 prints `RESULT: PASSED` (0 errors, 1 warning: the five recorded SOURCE_TAGS in lineage D iterations 6 and 7) |

### Deviations and findings

| Item | Note |
|------|------|
| Numbered 025 | Phases 023 and 024 exist on `worktrees/122-readme-freshness-research` and are not on origin/main; the orchestrator merges the two branches |
| Hand-run YAML, sequential lineages | The fan-out runner runs a whole lineage in one long process, which does not fit the brief's foreground-only rule, so each iteration was dispatched in the foreground, A then B, through the YAML's own dispatch branches, as 023 did for one lineage |
| Timeout 570 s | One foreground call is capped at ten minutes; luna iterations 4 and 5 reached it after writing their artifacts |
| Round two parallelism | Lineage C and D iteration N ran concurrently in one foreground call (C1 with D1; then C2 to C10 with D's next iteration). Paired wall time 345 to 561 s; after C finished, D 7 to 10 ran alone |
| Round two timeouts | Each dispatch was capped at 540 s so a pair fits one ten-minute call. Codex D1 and D2 and pi D6 and D7 timed out with nothing written and were redispatched once with reduced scope, as the YAML's timeout rule says; codex D5 timed out and was redispatched on cli-pi after the operator's executor switch; pi D5's first attempt exited in 2 s because `--fast` placed before the prompt swallowed it, fixed by placing it after `-p` |
| Round two D8 state record | The pi dispatch for D8 was killed at 540 s after writing the iteration file and delta but before its gateway record; the orchestrator handed the leaf's own iteration record (first line of `deltas/iter-008.jsonl`, status timeout) to `append-mode-event.cjs`, and verify then passed |
| Round two scope breach, repaired | Lineage C iteration 6 lost its copy path between shell commands and ran the removal checklist in the worktree: 226 deletions, 5 modified files and 65 untracked files. The orchestrator restored the tracked files from HEAD, removed the untracked ones and confirmed guard, parent-skill-check and sync green; the main checkout was untouched. From iteration 7 the driver pre-creates two copies per dispatch, passes their literal paths and requires a `cd`-and-check on every copy command, and after-dispatch status counts stayed 0. Lineage D iteration 4 ran during the breach and may have read the mutated tree |
| Throwaway-copy exception | The prompt pack bans rm and mv; the preamble allowed them only inside a copy outside the worktree, and `git status` confirmed no out-of-scope write after every iteration |
<!-- /ANCHOR:log -->
