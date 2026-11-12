# Research: Workflow protection for natural-chat sessions

Ten iterations, each a fresh `cli-pi` process on `deepseek-v4.1-flash-1017` at max effort, generation 2 of this packet's research. Compiled by the orchestrating session from `iterations/iteration-001.md` to `iteration-010.md`. Finding numbers below refer to those files.

## 1. The question

How can a natural-chat session get the protection of the spec-kit command workflows without the user typing a command, while staying flexible? A chat session that writes files loads `AGENTS.md`, the `system-spec-kit` skill and router, the authoring card, the packet templates and `validate.sh`. It does not load the three command workflow files.

## 2. Verdict

Do not route chat sessions into the command workflows. Carry the one missing obligation in files the chat path already reads: the authoring card and the plan template, plus one existing line of `AGENTS.md`. The edit set is seven amended lines in three existing files, with no new file, hook, command, validator rule or bullet (iteration 10, The Recommendation).

The missing obligation is narrower than "plan quality". It is the shape of a plan's phase lines: each one names the file it changes and ends with the command that proves it. That shape is decidable by a reader who did not write the plan, which is why it survived when the broader review-verdict idea did not (iteration 6, findings 3 to 5).

## 3. What the workflows check that chat does not (iterations 1 and 6)

- The workflow files carry six check families, and the chat path carries none of them as such (iteration 1, finding 1).
- Most are duplicated on the chat path by other means: level selection, templates, placeholder fill, both completion gates and `validate.sh`. The chat path's completion checks are the stronger version (iteration 1, findings 5 to 7).
- The gap is sequencing plus judgment, not content (iteration 1, finding 8).
- The chat path has no plan-review surface at all. The one verdict producer in the repository is the deep-review loop, and its verdict line is a self-report (iteration 6, findings 3 and 4).

## 4. Where an author-only plan gets through (iterations 1, 7 and 9)

- The card's plan-shape check is `rg -n '^## 4' <packet folder>/plan.md` [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:124]. It tests that a heading exists.
- That check false-passes on 118 of 4,812 loose matches (iteration 9, finding 3).
- The card's own worked example fails the shape rule the edit set proposes: it names no file and no proof command [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:120] (iteration 7, finding 1).
- The card and the plan template disagree about where the phases live. The template says `tasks.md` owns them, and the template wins because it is in the scaffolded file [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:126] (iteration 8, finding 5).

## 5. The mechanisms, ranked (iteration 10, finding 7)

| # | Mechanism | Marginal cost | Arrival | Enforcement | Verdict |
|---|---|---|---|---|---|
| 1 | Amended card and template lines | About 105 bytes added, three lines rewritten, nothing evicted | Every runtime that routes a plan or implement intent | Prose, with a validator-visible fill marker | Take it as the primary carrier |
| 2 | Amended existing `AGENTS.md` line 186 | One line extended, nothing evicted | Six of seven runtimes in full | Prose only | Take it as one amended line |
| 3 | New `AGENTS.md` bullet after line 181 | 283 to 293 bytes, which evicts two delivered rules on Devin | Seven of seven, net of two rules lost | Prose only | Rejected |
| 4 | Hook that injects the relevant step | A new hook concern, up to 2,048 characters a turn | Six adapters | Context only, cannot block | Rejected |
| 5 | Validator rule | A new rule and registry entry | Only when `validate.sh` runs | Real | Withdrawn: the shape has 0.62% corpus adoption, so it would be a new obligation |
| 6 | Session invoking the command itself | 60,098 to 93,496 bytes of workflow asset | Only when the advisor fires at 0.8 or above | Full | Rejected: that is the command path |

## 6. The edit set (iteration 10)

1. Card line 113: the rule sentence gains the shape. Each phase line names the file it changes in backticks and ends with `Verify:` and the proving command. It also carries the child-dispatch clause.
2. Card line 120: three compliant example lines replace the one non-compliant line.
3. Card line 123: the acceptance line restates the shape.
4. Card line 124: the verify becomes `rg -n '^## 4\. IMPLEMENTATION PHASES' <packet folder>/plan.md`.
5. Template line 124: the fill note teaches path plus proof, with a compliant GOOD example.
6. Template line 126: the `tasks.md` ownership sentence is qualified.
7. `AGENTS.md` line 186: the existing "Plan before acting" line is extended with the phase shape.

## 7. Level fit and opt-out (iterations 2 and 8)

- The lightness ladder already exists on both paths and uses the same numbers (iteration 2, finding 1).
- A level qualifier protects nothing here, because the phases section is the same at every level and `plan.md` is a Level 1 document (iteration 8, findings 1 and 2). The rule therefore applies at every level and costs one line shape, with no new artifact.
- The existing opt-out precedent is the bypass-phrase list on one `AGENTS.md` line, and it covers memory loading only (iteration 2, finding 5).

## 8. A delivery defect found along the way (iterations 4, 9 and 10)

`AGENTS.md` is 27,372 bytes. Devin reads each rule file up to 16,384 bytes [SOURCE: .devin/README.md:92]. So 10,988 bytes, everything from line 184 down, never reaches a Devin session (iteration 10, finding 8). That includes "Plan before acting", "Do not stop early" and "Settled stays settled". DSH receives no `AGENTS.md` at all (iteration 4, finding 3).

This is why the card is the primary carrier: a file opened by a tool read is not subject to that budget (iteration 5, finding 3). It is also why inserting a new bullet inside the delivered region costs two existing rules on that runtime (iteration 10, findings 1 to 5).

## 9. What not to build

- A routing gate in `AGENTS.md`, a new hook concern, a validator rule for the phase shape, a chat-mode copy of the workflow, or automatic command invocation.
- Anything withdrawn during the run: the review-verdict clause (iteration 6), the numeric level qualifier and the validator backstop (iteration 8), the shape-count verify and the inserted bullet (iterations 9 and 10).

## 10. Eliminated Alternatives

- Loading the workflows in chat: the heaviest option on a typo fix, and absent on runtimes with no command loader (iteration 2, finding 10 and iteration 4, finding 6).
- A review verdict on the chat path: no surface produces one, so the clause is unimplementable there (iteration 6, finding 5).
- A validator backstop: it would enforce a shape almost no existing plan has (iteration 8, finding 3).
- A new `AGENTS.md` bullet: priced in evicted rules, it is a net loss on Devin (iteration 10).
- Compressing the rule into the free 27-byte bracket: too small to state a shape and its proof (iteration 10, Ruled Out).

## 11. Divergence Map

- Saturated directions: none recorded in the registry.
- Pivots taken: three corrections of the run's own earlier iterations. Iteration 6 replaced the review-verdict clause. Iteration 8 withdrew the level qualifier and the backstop and corrected a corpus figure inflated about five times by gitignored files. Iteration 10 reversed iteration 9's placement after pricing the insertion in evicted rules.
- Pivot failures and audited overrides: none.
- Remaining frontier: whether the amended card line changes the plans chat sessions write, which no iteration measured, and the `AGENTS.md` size overrun, which no mechanism owns.

## 12. Open Questions

All five tracked questions are marked answered. Three things are unknown and not open research questions:

1. Whether the edit set works. It is prose, and no session was run against it.
2. Who checks the plan. The author still judges their own plan, and a decidable shape narrows that problem without removing it.
3. How often a chat request reaches the card. The router loads it on plan and implement intents, and a request matching neither may never load it (iteration 10, finding 6).

## 13. How this run differs from the archived one

The archived single-session pass on this question recommended three edits: a decisions clause in the plan template's architecture note, write verbs in the router's intent table and an opt-out phrase. This run did not reproduce that edit set. It converged on the phase-line shape and found the Devin size limit, which the archived pass missed. The two agree that the card is the right carrier and that the workflows should not be loaded in chat.

## 14. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10 of 10
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio by iteration, self-reported by each fresh agent: 0.90, 0.87, 0.85, 0.93, 0.90, 0.80, 0.83, 0.92, 0.86, 0.92
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Dispatch time per iteration in seconds: 149, 123, 93, 122, 95, 77, 83, 104, 139, 113
- Every iteration passed `verify-iteration.cjs` on its first dispatch

## 15. References

- `iterations/iteration-001.md` to `iterations/iteration-010.md` and `deltas/iter-001.jsonl` to `iter-010.jsonl`
- `AGENTS.md`, `.devin/README.md`, `.devin/SYNC.md`
- `.skilled/skills/system-spec-kit/ROUTER.md`, `references/workflows/spec-authoring-card.md`, `templates/core/plan.md.tmpl`
- `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml`
- `.skilled/hooks/`, `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`
