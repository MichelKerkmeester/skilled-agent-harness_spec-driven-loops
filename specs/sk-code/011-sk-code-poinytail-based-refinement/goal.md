---
title: "Goal: sk-code Ponytail 5 refinement"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement"
    last_updated_at: "2026-10-09T18:03:12Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: sk-code Ponytail 5 refinement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build and verify every refinement phase.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | codex 002-6, haiku 007-8, sonnet 009; 010-11 Opus plan, DeepSeek build, sonnet verify |
| D2 | Reports are claims: rerun criteria; halt after 3 failed repairs |
| D3 | One sk-git worktree, no raw git; edit packet copy |
| D4 | Commit per phase or round; no push |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read a phase's child goal first**; it binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-ponytail-deep-research/goal.md` |
| 002 | `002-surface-contract-alignment/goal.md` |
| 003 | `003-doctrine-pass/goal.md` |
| 004 | `004-webflow-checker-fix/goal.md` |
| 005 | `005-review-output-additions/goal.md` |
| 006 | `006-guard-retirement-notes/goal.md` |
| 007 | `007-follow-up-fixes/goal.md` |
| 008 | `008-round-two-recommendations/goal.md` |
| 009 | `009-round-two-follow-ups/goal.md` |
| 010 | `010-round-three-remediation/goal.md` |
| 011 | `011-round-four-remediation/goal.md` |
| 012 | `012-post-merge-deep-review/goal.md` |
| 013 | `013-root-cause-and-ux-research/goal.md` |
| 014 | `014-skill-authoring-ux-research/goal.md` |
| 015 | `015-closeout/goal.md` |
| 016 | `016-residual-closeout/goal.md` |
| 017 | `017-release-changelog/goal.md` |
| 018 | `018-create-sh-unknown-options/goal.md` |
| 019 | `019-routing-miss-fixes/goal.md` |
| 020 | `020-open-ends-research/goal.md` |
| 021 | `021-open-ends-remediation/goal.md` |
| 022 | `022-doc-version-and-playbook-paths/goal.md` |
| 023 | `023-readme-freshness-research/goal.md` |
| 024 | `024-readme-freshness-fixes/goal.md` |
| 025 | `025-external-surface-priority-research/goal.md` |
| 026 | `026-external-surface-priority-build/goal.md` |

**Precedence.** Decisions outrank child detail, which outranks any summary.
Name a conflict, never resolve it silently.

**Stop.** Only the criteria below decide done.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement --recursive --strict` prints `RESULT: PASSED` 27 times, none FAILED
- [ ] `grep -lr --include=implementation-summary.md 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement | grep -vc /001-ponytail` prints 107
- [ ] `git log --format='%(trailers:key=Spec,valueonly)' | grep -c '^sk-code/011-'` prints 100+; `git status --short` is empty
- [ ] `node .skilled/bin/compiled-route-guard.cjs` exits 0 with sk-code `fresh`; `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "code review my obsidian plugin"` prints `"action":"route"`, no `servingAuthority`
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`, `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` and `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exit 0
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs --all` and `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exit 0
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
| 001 ponytail deep research | Done | `001-ponytail-deep-research/goal.md` log; strict validation passed 2026-10-09 |
| 002 surface contract alignment | Done | Commit `ee78fc56b9`; all seven child criteria rerun by the orchestrator and passed; strict validation passed |
| 003 doctrine pass | Done | All seven child criteria rerun by the orchestrator and passed; strict validation passed; three dispatches, all stops were task or brief wording |
| 004 webflow checker fix | Done | All seven child criteria rerun by the orchestrator and passed; strict validation passed |
| 005 review output additions | Done | All seven child criteria rerun by the orchestrator and passed; strict validation passed |
| 007 follow-up fixes | Done | Five children planned and built by haiku xhigh agents, each rerun by the orchestrator and committed |
| 006 guard retirement notes | Done | All seven child criteria rerun by the orchestrator and passed; strict validation passed |
| 008 round-two recommendations | Done | Five children planned and built by haiku xhigh agents, each rerun by the orchestrator and committed |
| 009 round-two follow-ups | Done | Five children planned and built by Sonnet 5.5 xhigh agents, each rerun by the orchestrator and committed |
| 010 round-three remediation | Done | Seven children planned by Opus 5.5 medium, built by DeepSeek V4.1 Flash max, verified by Sonnet 5.5 high; doc-claims 4/4 and all four drift guards pass; one commit per child |
| 011 round-four remediation | Done | Eight children planned by Opus 5.5 medium, built by DeepSeek V4.1 Flash max, verified and reviewed by Sonnet 5.5 high. Reviewer findings in five children were fixed through the same chain. One commit per child |
| 001 research round three | Done | Twenty DeepSeek V4.1 Flash iterations, orchestrated by Opus 5.5 high; rounds one and two unchanged; commit 00b905bda0 |

### Deviations and findings

| Item | Note |
|------|------|
| Durable slice cut, 2026-10-10 | The 014 binding row took the slice to 4,064 characters. The objective and decision cells were shortened to 3,798 so the two sibling rows still fit; every decision, binding row and criterion is kept |
| No acceptance-criteria.md in any child | Every child is Level 1; each child goal takes its criteria from its spec's REQ and SC rows and its tasks' verification commands |
| Criterion 3 amended 2026-10-09 | sk-git's commit contract bars phase identifiers in subjects, so the phase is checked through each commit's `Spec:` trailer instead of its subject |
| Criterion 1 count corrected to 8 | `--recursive` validates one level: the parent and its seven direct children. 007's own goal covers its five children (6 PASSED) |
| Research round two 2026-10-10 | Ten more 001 iterations on DeepSeek V4.1 Flash (cli-pi, max), orchestrated by Opus 5.5 high; committed as one more 001 commit, so criterion 3 counts 11 |
| 007 added 2026-10-10 | The operator chose to fix the follow-ups as child 007 with haiku xhigh agents; criteria 1 to 3 counts, D1, D4 and D6 amended to cover it |
| 009 and round three added 2026-10-10 | The operator chose child 009 for the five round-two follow-ups, built by Sonnet 5.5, and a third 001 research round run beside it; criteria 1 to 3 counts, the objective, D1 and D4 amended |
| 016 grown to ten children 2026-10-11 | The closeout review found three code P2s, each fixed in its own child, and a final gate child closed the ledger; criteria 1 to 3 counts amended to 17, 88 and 100 |
| 010 added 2026-10-10 | The operator chose child 010 to fix every round-three finding and the five 009 follow-ups; criteria 1 to 3 counts, the objective, D1 and D4 amended |
| 011 added 2026-10-10 | The operator chose round four for the eleven items round three left open, then added child 008 for a session-aware tie-break; criteria 2 and 3 counts, the objective, D1, D3 and D4 amended |
| 012 added 2026-10-10 | The operator chose child 012, a ten-iteration post-merge deep review on DeepSeek V4.1 Flash; criteria 1 and 2 counts amended, and decisions D2, D3, D5, D6 and D7 shortened to keep the durable slice under 4,000 characters. Criterion 3 counts `main..HEAD` on the epic branch and no longer applies once the epic is on main |
| 012 fix phases added 2026-10-10 | The operator chose to fix 012's confirmed P2s 1 to 10 in five 012 children; criterion 2 count amended from 36 to 41. Criterion 1 stays 13, because the recursive run counts direct children. Criterion 3 is left for the master orchestrator |
| Integration 2026-10-11 | 012, 013 and 014 were built on separate branches and merged on one integration branch. Binding rows 013 and 014 added; criterion 1 amended to 15 (the parent and 14 direct children) and criterion 2 to 69. Criterion 3 counted `main..HEAD`, which is empty once the epic is on main, so it now counts the epic's `Spec:` trailers reachable from HEAD (80 before integration) and keeps the clean-tree check; the unpushed-branch check is dropped because it cannot hold on main |
| Closeout added 2026-10-11 | Child 015 closes every item the epic left open, fixed with proof or closed with a written reason; criterion 1 amended to 16 (the parent and 15 direct children) and criterion 2 to 78 (nine closeout summaries) |
| 019 added 2026-10-11 | Child 019 fixes three routing misses the closeout closed as one-caller mechanisms; criteria 1 and 2 counts amended to 20 and 91. To fit the new binding row, D5 and D6 were shortened by a word each. No criterion was removed |
| 018 added 2026-10-11 | Child 018 makes create.sh refuse unknown options; criteria 1 and 2 counts amended to 19 and 90. To fit the new binding row, D2, D3, D5 and D7 were shortened, criterion 3's grep pattern was cut to the `sk-code/011-` prefix, which matches the same trailers, and criterion 5 joins its three commands. No criterion was removed |
| 020 added 2026-10-11 | Child 020 scaffolds five read-only ten-iteration loops on the epic's open ends; binding row added, criterion 1 amended to 20 (the parent and 19 direct children) and criterion 2 to 95 (the five 020 child summaries once complete). The new row took the slice to 4,014 characters, so D1 and D3 were shortened and criteria 1, 3 and 4 reworded with the same checks; no criterion was removed. If a 019 child lands from another branch, criteria 1 and 2 need one more amendment |
| Criterion 6 path amended 2026-10-11 | The deep-improvement packet was retired, so the agent mirror checker now runs from `.skilled/bin/check-agent-mirror-sync.cjs`; the check itself is unchanged |
| 017 added 2026-10-11 | Child 017 records the epic's user-facing changes in the v4.0.0.4 release entry; criteria 1 and 2 counts amended to 18 and 89, and the objective shortened to keep the durable slice under 4,000 characters |
| Integration 2026-10-11, open ends | Branches 110, 105, 106, 108 and 109 merged on one integration branch, keeping both the 019 and 020 rows. Criterion 1 amended to 21 (the parent and 20 direct children) and criterion 2 to 97, both as printed. The slice was 4,037 characters, so the objective was shortened, D5 was dropped because the stop paragraph and criteria 1 and 2 already decide done, D6 was folded into D4, D7 was shortened, criterion 3 drops the default `HEAD` and criterion 4 joins its checks with a semicolon; no criterion was removed |
| 021 added 2026-10-11 | Child 021 scaffolds four build phases for every open ends recommendation; binding row added, criterion 1 amended to 22 (the parent and 21 direct children, as printed) and criterion 2 stays 97, as printed, until the four 021 summaries complete. The new row took the slice to 4,011 characters, so D3, D4 and criteria 1 and 6 were shortened with the same checks; no criterion was removed |
| Integration 2026-10-12, open ends remediation | Branches 115, 113, 114 and 112 merged on `worktrees/116-rem-integration`, with colliding skill versions renumbered in merge order. The four 021 summaries reached `completion_pct: 100`, so criterion 2 is amended from 97 to 101, as printed; criterion 1 stays 22 |
| 022 added 2026-10-12 | Child 022 scaffolds two build phases, per-doc versions and playbook path repair; binding row added, criterion 1 amended to 23 (the parent and 22 direct children, as printed) and criterion 2 stays 101, as printed, until the two 022 summaries complete, when it becomes 103. The new row took the slice to 4,079 characters, so D7 was folded into D2, D1 lost its `Build:` prefix, D4 lost the finished 002-011 commit order, and criteria 1, 3, 4 and 5 were reworded with the same checks; the slice is 3,999 characters and no criterion was removed |
| Integration 2026-10-12, doc version and playbook paths | Branches 119 and 118 merged on `worktrees/120-docver-integration`; 002's sk-doc release renumbered from 2.3.7.0 to 2.3.8.0. The two 022 summaries reached `completion_pct: 100`, so criterion 2 is amended from 101 to 103, as printed; criterion 1 stays 23 |
| 023 added 2026-10-12 | Child 023 runs a read-only ten-iteration research on whether the root README and its related READMEs hold after v4.0.0.4, on cli-devin with DeepSeek V4.1 Flash max; binding row added, criterion 1 amended to 24 (the parent and 23 direct children). Criterion 2 stays 104, as printed, until the 023 summary completes, when it becomes 105. The new row took the slice to 4,075 characters, so the objective, D2, the binding, precedence and stop lines and criteria 1 and 3 were reworded with the same checks; the slice is 3,993 characters and no criterion was removed |
| Closeout 2026-10-12, README freshness research | The 023 run finished ten iterations on cli-devin and its summary reached `completion_pct: 100`, so criterion 2 is amended from 104 to 105, as printed; criterion 1 stays 24 |
| 024 added 2026-10-12 | Child 024 applies the 023 README fixes F1 to F23 and retires doctor check 13c, per the operator ruling that every doc keeps its own version; binding row added, criterion 1 amended to 25 (the parent and 24 direct children). Criterion 2 stays 105, as printed, until the 024 summary completes, when it becomes 106. The new row took the slice to 4,063 characters, so the binding, precedence and stop lines were reworded and the stop line lost its evaluator clause; the slice is 3,988 characters and no decision, binding row or criterion was removed |
| Closeout 2026-10-12, README freshness fixes | The 024 summary reached `completion_pct: 100` after its five-iteration review, so criterion 2 is amended from 105 to 106, as printed; criterion 1 stays 25 |
| 025 added 2026-10-12 | Child 025 runs a read-only research, two ten-iteration lineages on cli-devin DeepSeek V4.1 Flash max and cli-codex GPT-6 Luna max fast, on how a user's own sk-code surface should outrank sk-code-opencode once the obsidian and webflow examples are deleted. It is numbered 025 because 023 and 024 exist on `worktrees/122-readme-freshness-research`, not yet on main. Binding row added; criterion 1 amended to 24 (the parent and 23 direct children on this branch, as printed), criterion 2 stays 104 until the 025 summary completes, when it becomes 105. The row took the slice to 4,011 characters, so the objective, D2, binding, precedence and stop lines and criteria 1 and 3 were reworded with the same checks; the slice is 3,998 characters and no criterion was removed |
| 025 complete 2026-10-12 | Both lineages ran ten iterations and the 025 summary reached `completion_pct: 100`, so criterion 2 is amended from 104 to 105, as printed on this branch; criterion 1 stays 24 |
| Merge 2026-10-12, surface priority research | Branch 123 merged with origin/main, which carries 023 and 024; 025 keeps its number, its binding row follows 024, and criteria 1 and 2 are amended to 26 and 107, as printed after the merge. The merge took the slice to 4,082 characters, so the binding table's Phase column now names only the number |
| 025 round two 2026-10-12 | 025 reopened for a second round: two more ten-iteration lineages, cli-devin SWE 2 Max and GPT-6 Luna (cli-codex max fast for iterations 1 to 4, then cli-pi xhigh fast by operator change), merged with round one; the merged synthesis follows. The 025 summary drops to `completion_pct: 85`, so criterion 2 is amended from 107 to 106, as printed; it returns to 107 when the synthesis lands. Criterion 1 stays 26 |
| 025 verified 2026-10-13 | A fresh verifier checked the merged synthesis against the 40 iterations and the repository and set the final recommendations; the 025 summary returns to `completion_pct: 100`, so criterion 2 is amended from 106 to 107, as printed. Criterion 1 stays 26 |
| 026 added 2026-10-13 | Child 026 plans the build of the 025 final recommendations R1, R2, R3, R4, R7, R8 and R9 and the drop of `ROUTER.md` from doctor check 13a, as five Level 2 children with goals; binding row added, criterion 1 amended from 26 to 27 (the parent and 26 direct children, as printed). Criterion 2 was recounted and stays 107, as printed, because 026 is planned and its five summaries sit at `completion_pct: 0`; it becomes 112 when they complete. The slice is 3,573 characters with the new row, so nothing was cut |
| Handed off, not built here | D2 Codex mirror gap (deep-improvement and git hooks) and D4 stdin deadline (hooks); recorded in the parent spec |
<!-- /ANCHOR:log -->
