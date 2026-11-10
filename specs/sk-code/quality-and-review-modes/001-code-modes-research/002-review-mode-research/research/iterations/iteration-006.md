# Iteration 006: Review and quality boundary

## Focus

Angle 6: Review and quality boundary (Q6). Determine whether review reads quality-gate evidence, which mode reports or fixes, and how the checklists and routing tie-break divide the work.

## Actions Taken

- Read the active config, state log, strategy, and Q6 prompt. The lineage session id is `2026-10-25T08:49:26Z`; Q6 is unchecked in the strategy.
- Read the quality mode, review mode, both code-quality checklists, and the two sk-code routing files. Searched the review packet for `CODE_QUALITY_RESULT`, `code-quality/v1`, `checklists_loaded`, and `p0_p1_p2_decisions`; `rg` returned no matches (exit 1).
- No live quality-to-review run was performed, so runtime handoff behavior remains unverified.

## Findings

- **OBSERVED — Review reports; quality fixes.** Review declares a findings-first pass with no edits and loads its code-quality checklist on every invocation. The checklist covers non-security production defects and prioritizes silent failures and data corruption. The quality mode instead runs after implementation, selects its own target-path checklist, fixes in-scope gate failures, and leaves findings-only output to review. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:33] `Review-only pass: findings-first output with no code edits` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:99] `Every invocation, including security/correctness reviews` [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:25] `systematic pass for non-security defects` [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:33] `Prioritize silent-failure and data-corruption risks above stylistic concerns` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:15] `leaves findings-only output to sk-code-review` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:181] `then load the target-path checklist` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:184] `Fix gate failures in place`.

- **DERIVED — The shared name marks an overlay, not a shared job.** Both files use the heading `Code Quality Checklist`, but review's asset is the broad non-security defect baseline. [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:15] `Code Quality Checklist` [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:12] `Code Quality Checklist`. Quality mode's separately named nested checklist validates implementation style; it says to use that checklist as the web overlay for formal review. The root `CODE_QUALITY` resource map also lists review's checklist, while the hub tie-break orders `sk-code-quality` ahead of `sk-code-review`. A clearly separate pair of intents can still route as an ordered bundle. [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:25] `systematic pass for non-security defects` [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:20] `style standards before claiming implementation is complete` [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:40] `formal findings-first review output` [SOURCE: .skilled/skills/sk-code/ROUTER.md:292] `sk-code-review/assets/code-quality-checklist.md` [SOURCE: .skilled/skills/sk-code/hub-router.json:7] `["sk-code-quality", "sk-code-review", "sk-code-ci", "sk-code-skilled"]` [SOURCE: .skilled/skills/sk-code/hub-router.json:10] `code intents route to an ordered workflow-mode list`.

- **INFERRED — Gate evidence is not guaranteed to reach review.** Quality mode can emit an advisory envelope containing loaded checklists and checker outputs. Review's documented contract describes its own baseline and available surface standards, but no named consumer for that envelope; the targeted search also found no envelope field names in the review packet. Thus the written contract does not guarantee that review sees the prior gate's checks or accepted deferrals. Actual runtime pass-through is UNKNOWN. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:215] `checklists_loaded: <checklist paths loaded, or none>` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:216] `checker_outputs: <comment-hygiene and dist-staleness results` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:223] `status is fixed to advisory` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:57] `Surface standards evidence (when available)`.

  Candidate follow-up: let review accept that envelope as optional read-only context while keeping its independent review baseline. Effort S; risk: stale advisory evidence could lead a reviewer to skip a needed check. Needs a live quality-then-review scenario before the handoff contract is settled. This child-to-child handoff needs no hub routing change; any routing change must update both `hub-router.json` and `ROUTER.md`. It affects the `sk-code-quality` / `sk-code-review` sibling handoff; user-authored mode integration is outside Q6.

## Questions Answered

- Q6 Review and quality boundary: does review read what the quality gate checked, who reports and who fixes, and how do the shared checklist name and the tie-break order divide the work? [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-strategy.md:32] `Q6 Review and quality boundary: does review read`.

## Questions Remaining

- Q2–Q5 remain carried-forward open questions in the dispatch context. Q2–Q4 are also marked answered in the strategy, so that state discrepancy remains unresolved here.
- Q7–Q10 remain scheduled and unanswered. This iteration does not change reducer-owned state.

## Next Focus

Angle 7: Surface packets (Q7). [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-strategy.md:172] `7 | Surface packets (Q7)`
