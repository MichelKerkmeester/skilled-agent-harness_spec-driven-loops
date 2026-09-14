# Research: Does the rule router still reach and accurately describe the rules that exist?

Lineage: alignment (Stream B of sk-doc/055-governance-doc-alignment). Session:
fanout-alignment-1789357372647-ynq4so. Read-at commit: 94a72a4931
(94a72a493192a7c9f5e21199ccc8ced356356de1, 2026-09-13T17:17:51+02:00). Every finding
below cites file:line at that commit, where the tracked worktree was clean.

## 1. VERDICT

The router still reaches everything: 11 of 11 rule files, 1:1 in both directions, every
link resolving, the property guarded by the checker and by CI. It still phrased every
row correctly: 11 of 11 primary clauses are action-anchored, as its own first instruction
demands (REPO RULES.md:12). What it no longer does is describe: 7 of the 11 index
summaries are not their rule's own description words, the drift predates the five recent
edits, and none of the eight registered checker tests compares a summary to a
description, so nothing in the mechanism will ever catch it.

The five recent edits changed FM trigger phrases, Fires-when wording and bodies. They
created exactly one fresh divergence at the router, the It-settles omission of the
no-tables rule, and they touched no description line, which means the FM descriptions
themselves also lag the 09-12 bodies. The alignment surface is therefore three layers
deep: body, then description, then index. An alignment that only re-copies the
descriptions would ship three of the seven gaps all over again.

Findings, not actions: this lineage's scope ends at the evidence. Acting waits on the
sequencing question, exactly as 055 scoped it (055 spec.md:80,99).

## 2. ANSWER ONE: Reachability, PASS in both directions

Question: every rule file named by at least one trigger row, and every file a trigger
row names actually existing.

- PASS, both directions. The 11 trigger rows (REPO RULES.md:40-50) and the 11 files
  (repo-rules/, 154 to 230 lines each) form a 1:1 bijection with no orphan and no
  duplicate. Eleven links, eleven resolutions. (F-101, F-102, F-103)
- The property is not luck: checkCounts requires files == triggerRows == indexRows and
  checkWiring fails a rule with no trigger row, no index row, or an unresolved link
  (check-repo-rules.cjs:202-209, 211-246), and the CI workflow runs both, fail-closed
  (repo-rules-corpus.yml:1-11,17-23).
- Dating correction to the topic's premise: the flagged five (communication,
  evidence-and-proof, prevent-overengineering, skill-hub-routing,
  delegation-and-orchestration) are exactly the rule files edited AFTER the router's
  last touch (493859130e, 2026-09-12 11:47; the edits: 14:02, 14:14, 17:40). A sixth
  file, blast-radius.md, was edited the same day at 10:16, BEFORE the router, so it
  correctly does not belong in the flagged set. (F-104)

## 3. ANSWER TWO: Index accuracy, 4 of 11 summaries are their rule's own words

Question: one index row per rule file, each summary matching the rule's own description
frontmatter rather than a paraphrase that has drifted.

- Count: one row per file, 11 for 11, mechanically guarded (REPO RULES.md:58-68;
  check-repo-rules.cjs:202-209, 230-231). (F-201)
- Verdict, row by row against the FM lines: 4 verbatim (prevent-overengineering, blast
  radius, communication, handoff: REPO RULES.md:58,62,65,67); 2 one-token deltas (scope
  :59 vs scope-discipline.md:3; delegation :61 vs delegation-and-orchestration.md:3, and
  there the FM is the outlier against its own body, :45-47); 3 truncated of operative
  clauses (evidence :60 drops distinguish observed from derived from inferred, the rule's
  section-1 THREE TIERS distinction at evidence-and-proof.md:47; uncertainty :64 drops
  and halt on a contradiction, its contradiction-halt behavior at uncertainty-and-
  honesty.md:3,37,46; root-cause :63 drops that caused the failure, cosmetic); 2
  condensed paraphrases (presenting :66 vs presenting-decisions.md:3; hub routing :68 vs
  skill-hub-routing.md:3, which collapses the registered/routed/reachable distinction the
  file draws at :38,43,66-77 and loses the two-hubs confusion of :83-88). (F-202..F-205)
- Mechanism: no check of the eight (check-repo-rules.cjs:202-354, CHECKS at :355-360)
  compares a summary to a description, so all of this drift is invisible to the checker
  and to the CI that runs it. (F-206)
- Exoneration: the drift is NOT the 09-12 race. Four of the six unflagged files diverge
  although their descriptions predate the router's 11:47 touch (ced970a2c7 08-31,
  ecdb026354 09-11), and the five edits touched no description at all. The divergence
  was chosen or inherited when the router last landed. (F-105, F-207)
- Three layers: the descriptions themselves lag the 09-12 bodies. evidence-and-proof.md:3
  is silent on the receipt criterion its own section 1 now carries (:58-68, added 17:40),
  and communication.md:3 says nothing about the no-tables rule its section 5 now carries
  (:141-144, added 14:02). A verbatim-description index would still under-describe those
  two rules. (F-208)

## 4. ANSWER THREE: Trigger phrasing, clean, with two faithfully mirrored relaxations

Question: any row phrased as a topic is a defect by the router's own rule (REPO
RULES.md:12).

- All 11 primary clauses lead with the about-to verb: Add, Touch, Say, Hand, Delete,
  Diagnose, Answer, Write, Present, End, Wire (REPO RULES.md:40-50). Zero topic-phrased
  rows. (F-209)
- Two sub-clauses are completed events rather than about-to actions: :47 the reader says
  they did not follow, and :46 hit a contradiction between two things that must both be
  true. Both copy their rules' own Fires-when wording (communication.md:38, an event;
  uncertainty-and-honesty.md:37, a state). The relaxation lives in the rule files, the
  rows describe the rules that exist, which is what the topic's first sentence asks. By
  the router's own rule: zero defects. (F-209)
- One consequential omission: row :47's It-settles enumeration (sentence shape, plain
  words, punctuation, length, filler) omits the no-tables duty added three hours after
  the router landed (communication.md:141-144, added 14:02 by e2d5b7b572). It is the only
  It-settles enumeration the five edits made incomplete: :42's settles absorbs the 17:40
  receipt criterion under its existing what counts as proof. (F-210)

## 5. ANSWER FOUR: Competing rows and dead rows, three competitions resolved, two gaps, nothing dead

Question: overlapping rows that compete for the same action, and rows that could never
fire.

- Competing, resolved by composition: rows :42, :48, :49 all fire at turn-end and
  reporting. No conflict arises for the more-specific-wins rule (REPO RULES.md:15-17) to
  resolve, because the It-settles columns partition the obligations: proof standards
  (evidence-and-proof.md:173 CLOSE-OUT, confirmed by handoff-and-questions.md:52-54: a
  report about what happened), decision shape (presenting-decisions.md:45-46), and the
  handback (handoff-and-questions.md:56-58: a report about what happens next, a different
  document). Composition is what :15 licenses first. (F-301)
- Competing, guarded half-way: the fork-and-trade-off vocabulary appears in both row :48
  and row :49, and in both Fires-when lists (presenting-decisions.md:35,
  handoff-and-questions.md:38). The FM trigger phrases are disjoint, which the checker
  guards (:243-268), but the Fires-when prose and the near-identical row cells are
  guarded by nothing: the Fires-when check only requires the section to be non-empty
  (:331-354). (F-302)
- Under-reach, two gaps: skill-hub-routing.md:36 (creating a new skill under a hub, or
  refactoring one) has no clause in row :50, and the FM's refactoring a skill trigger has
  no row to land on; scope-discipline.md:36 (the also-fix temptation) is a distinct
  condition from row :41's noticed-in-passing. (F-303)
- Dead: none. No row could never fire, and no clause inside a row is dead. The
  spot-checked clause artifacts exist, including the fan-out lineage and deep loop of
  row :43, instantiated by this very invocation. (F-304)

## 6. ANSWER FIVE: The scope statement still describes the current eleven, on two
careful readings it does not spell out

Question: whether the scope statement, which records four deliberate widenings and
pre-refuses a fifth, still describes the current set (REPO RULES.md:75-109).

- The In-list covers all 11 files, and every clause maps to at least one existing file
  (REPO RULES.md:77-79,93-94). The presenting coverage is the only implicit one: it rides
  the wide reading of how the resulting reply reads, which the corpus itself justifies
  (communication.md:49-51, the recorded decision to move the decision shape out of
  communication; presenting-decisions.md:45-46; AGENTS.md section 8's two-paragraph
  structure). (F-305)
- The Delivery exclusivity sentence (:80-82) survives only through its own qualifier,
  rather than a specific action: handoff-and-questions.md:35 fires on every turn,
  substantive or not, a superset that also fires on every substantive reply. Read as raw
  exclusivity, the sentence is wrong. Both readings recorded. (F-306)
- The four widenings: #3 (routing, :91) and #4 (ask-surface, :98) are self-labeled, the
  earlier selection-refusal (:95-96) is honored by #4's naming-not-selecting design
  (:104-105); #1 and #2 are recoverable but unlabeled, as the delegation-posture clause
  (:79) and the Delivery clause (:80). The count of four is inferable, the numbering of
  the last two is explicit. (F-307)
- The fifth, pre-refused at :108-109, is still true today: no rule file picks between
  runtimes. Handoff resolves the question surface AT the given runtime
  (handoff-and-questions.md:122-123, the :127-131 table lists without selecting),
  delegation points at the selector (delegation-and-orchestration.md:73), skill-hub uses
  a repository-local checker (skill-hub-routing.md:85-86), and the 8db759d7af principle
  (name a hub, never a file within one) holds: the only dotted path left in the eleven is
  handoff-and-questions.md:128, a repository file. (F-307)
- Two Out-list sentences survive their scopes: which-command (REPO RULES.md:85-86) versus
  /rewrite:response (communication.md:170-171) and grep -a (evidence-and-proof.md:95),
  both predating the section-4 text (65a337865a, 08-31), chosen granularity rather than
  unnoticed drift. One confirmation clause rests on specs prose: the Pi ask extension is
  confirmed exactly where the rule says (.pi/PLUGINS.md:16-17, v2.10.0), but
  AskUserQuestion, which the Claude row's evidence cell calls Named in this repository
  (handoff-and-questions.md:127), appears in this repository only in specs/ prose (for
  example specs/sk-prompt/007-sk-prompt-parent/002-architecture-decision/
  implementation-summary.md:61,96), a generous reading, recorded as INFERRED. (F-308)

## 7. THE SEQUENCING QUESTION, NOTED NOT DECIDED

As briefed. 006's phase 003 will create repo-rules/[split-sibling].md, the other half of
the split, with its router row (specs/sk-communication/006-sk-communication-clarity/
spec.md:130), and its definition of done requires that the router reaches both halves
(:181). 055 defers acting until the question is answered (055 spec.md:32,80,99,136,157;
plan.md:33,167). What this research adds to the question: F-207. The 09-12 race did not
cause the current divergence, so today's gap does not force the order. Any urgency lives
in the future deltas, the 12th file and its row, which is the sequencer's call, not this
lineage's.

## 8. CONVERGENCE REPORT

| Field | Value |
|-------|-------|
| Stop reason | maxIterationsReached |
| Total iterations | 3 of 3 (forced depth, stopPolicy=max-iterations) |
| Questions answered | 5 of 5 (ratio 1.0) |
| newInfoRatio trend | 1.0, 0.6, 0.5 (mean 0.7) |
| Convergence threshold | 0.05 on newInfoRatio, telemetry only; convergence before the cap did not stop the loop, per the forced-depth contract |
| Findings recorded | 26 (8, 10, 8) |
| Ruled-out directions | 7, one per family, recorded in each iteration and delta |

## 9. QUALITY GUARDS

- Source diversity: four source classes, no finding resting on one of them: the governed
  texts (the router, the 11 rule files, AGENTS.md section 8), git history (10:16 through
  17:40 on 09-12, plus 08-31 and 09-11), the governance machinery (the 8-check checker,
  the CI workflow, the parent-skill checker), and the packet corpus (055 spec/plan/
  acceptance criteria, 006 spec, 006's iteration-005, 007's implementation-summary,
  .pi/PLUGINS.md, this lineage's invocation-metadata.json).
- Focus alignment: one focus per iteration, no question skipped. Against the brief's
  five (AC-003, acceptance-criteria.md:59): reachability both directions (F-101..F-104),
  index accuracy (F-201..F-208), action-phrased triggers (F-209, F-210), dead or
  overlapping rows (F-301..F-304), scope-statement drift (F-305..F-308).
- No single weak source: every finding carries at least two anchors, a text location and
  a diff, a commit, a directory listing or a machinery function. Three nuances are
  marked INFERRED, not counted as observations: the 8th check's provenance (F-106), the
  presenting mapping's wide reading (F-305), the specs-prose confirmation of the Claude
  question surface (F-308).

## 10. RECEIPTS

Executor: this process, no nested dispatch. Skill: cli-pi, model glm-5.3-flash,
reasoningEffort max, per the invocation and the runner-created invocation-metadata.json
in this directory. All three iterations ran inline in this one process. The read-at
commit 94a72a4931 governs every citation: the tracked worktree was clean there, so each
cited line was read at exactly that content. Answering the brief's companion demand
(the receipts name the model and effort behind each iteration, tasks.md:68, via T013):
model glm-5.3-flash, reasoning effort max, all iterations, no exceptions.

## 11. LIMITS, HONESTLY

- Depth: the five flagged rule files and the router were read in full. The six unflagged
  bodies were read at Fires-when, rule-statement and cited-section depth, not
 cover-to-cover; every claim about them cites the sections that were read.
- The 8th check's provenance: the checker's 6-to-8 growth landed by ab8f6a6878 (18:32),
whose message names the in-body-links check, while the 14:02 and 17:40 receipts record
6/6. Which of the other seven arrived in that same commit: UNKNOWN, marked, and no
finding depends on it.
- The working records (the three iteration files) were not scored against the Human
Voice Rules' document half; the reply-half duties were applied in the session's replies.
No finding depends on the records' prose.
- This process validated its own artifacts by read-only inspection (see the final-state
check in the session record). It ran no validate.sh, no generate-context.js, and no git
write, per the lineage's write-containment contract.

## 12. CONTINUATION

The 055 packet owns what happens next: the sequencing question (055 spec.md:32,136,157)
gates all acting on these findings (055 spec.md:80,99), and Stream C, the root-doc
staleness research, runs independently (AC-004, acceptance-criteria.md:60). Within this
lineage nothing remains: the 3 iterations, their deltas, the state log and this synthesis
are complete, and the reducer-owned surfaces (strategy, dashboard, findings registry)
carry the final counts.
