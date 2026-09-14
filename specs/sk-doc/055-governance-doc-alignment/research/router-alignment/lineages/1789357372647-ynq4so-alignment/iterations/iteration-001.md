# Iteration 001 - Reachability in both directions, artifact existence, edit recency

Read at: 94a72a4931 (94a72a493192a7c9f5e21199ccc8ced356356de1, 2026-09-13T17:17:51+02:00).
Every evidence citation below was read at that commit, where the tracked worktree was
clean (untracked additions only: the fanout lock, build dist, and this research tree).

## Focus

Question 1 (reachability both directions) plus the recency question: which rule files
carry edits later than the router, and what did those edits touch.

## Findings

**F-101. The governed corpus is exactly 11 rule files, and all 11 exist.**

Evidence: repo-rules/ contains exactly blast-radius.md, communication.md,
delegation-and-orchestration.md, evidence-and-proof.md, handoff-and-questions.md,
presenting-decisions.md, prevent-overengineering.md, root-cause-and-debugging.md,
scope-discipline.md, skill-hub-routing.md, uncertainty-and-honesty.md (154, 202, 230,
221, 165, 156, 164, 159, 164, 122, 144 lines; 1881 lines of rule bodies) at
94a72a4931. No additional markdown, no gap. The research topic's premise of 11 files
is met.

**F-102. Forward reachability: every rule file is named by at least one trigger row,
each by exactly one.**

The 11 trigger rows (REPO RULES.md:40-50) link, in order: prevent-overengineering.md,
scope-discipline.md, evidence-and-proof.md, delegation-and-orchestration.md,
blast-radius.md, root-cause-and-debugging.md, uncertainty-and-honesty.md,
communication.md, presenting-decisions.md, handoff-and-questions.md,
skill-hub-routing.md at 94a72a4931. That is a 1:1 bijection with the 11 files of
F-101: no rule file is orphaned, no row points at nothing.

This property is mechanically guarded: checkWiring fails a rule with no trigger row and
fails any row whose link does not resolve (check-repo-rules.cjs:211-246, with the
no-trigger-row diagnostic at :230 and the existsSync test at :219), and checkCounts
requires files == triggerRows == indexRows (:202-209) at 94a72a4931.

**F-103. Reverse reachability: every file a trigger row names actually exists.**

Each of the 11 row links resolves to an existing repo-rules/*.md at 94a72a4931 (the
same 11 paths as F-101, the 11 link targets checked against the directory listing).
Rows also name artifacts in their trigger text beyond the rule files themselves:
ROUTER.md, graph-metadata.json and the SKILL.md mode table (REPO RULES.md:50) are
skill-hub artifacts rather than rule files, and they exist: .opencode/skills/sk-doc/
ROUTER.md and .opencode/skills/sk-doc/graph-metadata.json are present, the mode-table
surface is what skill-hub-routing.md:37,72 govern, and the parent-skill checker the
row's gate-result clause leans on (.opencode/commands/doctor/scripts/parent-skill-check.cjs)
is present at 94a72a4931.

**F-104. The router's last edit predates all five flagged rule edits, and the flag
list is exactly the set of post-router edits.**

Timeline, all 2026-09-12, +0200:

- 10:16 bc2c04ba18: the corpus checker was created (339 lines). In the same commit
  blast-radius.md (2 lines), prevent-overengineering.md (4), AGENTS.md (13) and REPO
  RULES.md (18) were also touched.
- 11:47 493859130e: the LAST touch REPO RULES.md has received to date (the commit
  lands in-flight work from a concurrent session, and it is the commit this router's
  current text, including section 4's widenings, dates to).
- 14:02 e2d5b7b572: delegation-and-orchestration.md (19 lines cut) and communication.md
  (3 FM trigger phrases plus the no-tables section), plus the new CI workflow.
- 14:14 8db759d7af: communication.md (1 line: the hvr path becomes a capability
  reference), prevent-overengineering.md (4 lines), skill-hub-routing.md (13 lines).
- 17:40 4bc3e78b10: evidence-and-proof.md (+11, the receipt criterion) and AGENTS.md
  (1 line).

Evidence: the git log over REPO RULES.md and repo-rules/ at 94a72a4931, plus
per-commit author timestamps. The union of rule files edited AFTER 11:47 is exactly
{communication, evidence-and-proof, prevent-overengineering, skill-hub-routing,
delegation-and-orchestration}: precisely the five the research topic flags. Blast-
radius's 09-12 edit at 10:16 is correctly outside that list, because it landed before
the router's 11:47 touch. The topic's five are therefore exactly the files whose
current bodies the router has never seen, in the mechanical, exit-code-free sense.

**F-105. What the five edits touched, and what they did not.**

Cross-reading the three post-11:47 commit diffs at 94a72a4931: NONE of the five edits
touched any description: frontmatter line. They touched:

- FM trigger_phrases: communication.md gained three (no tables, don't use tables in
  chat, table or prose), now at communication.md:15-17.
- Fires-when wording: delegation-and-orchestration.md:37 shortened to a single clause.
- Body content: communication.md:141-144 (the no-tables rule), communication.md:118
  (the hvr reference rewritten to route through sk-doc), evidence-and-proof.md:58-68
  (the receipt criterion, the 4bc3e78b1c addition),
  prevent-overengineering.md:66-75 (the code-skill reroute), skill-hub-routing.md:68
  and 85-88 and 106-110 (the capability routes).

Consequence: any description-vs-index divergence on these five files predates the
edits. The divergence comparison itself is iteration 2's focus.

**F-106. The enforcement machinery exists, gained its automatic trigger the same day,
and grew.**

The checker (check-repo-rules.cjs) was created at 10:16 (bc2c04ba18, 339 lines) and
grew by 18:32 (ab8f6a6878, whose message: check links inside rules, not only router
rows). Today it registers 8 checks: count parity (:202-209), row coverage (:211-246),
trigger-phrase uniqueness (:243-268), line ceiling (:265-282), frontmatter keys
(:279-296), divider parity (:294-310), rule-body links (:307-334) and Fires-when
non-emptiness (:331-354), assembled in the CHECKS list at :355-360, all at 94a72a4931.
The CI workflow runs the checker on pull requests that touch the router, any rule
file, or the checker itself, and fails closed when the guard file is absent
(repo-rules-corpus.yml:1-11 paths, :17-23 the GUARD check with exit 1) at 94a72a4931.

Honesty note: the 14:02 (e2d5b7b572) and 17:40 (4bc3e78b1c) commit messages both record
RESULT: PASSED (6/6 checks), which matches a 6-check era, and the 18:32 commit then
brought the count to 8. Its message names the in-body-links check; the Fires-when
check's arrival at that same commit is inferred, its message does not name it. The
6th-to-8th growth of that one check is therefore: UNKNOWN, marked, and it does not
affect any finding below, which depend only on what the current 8-check script covers.

**F-107. The sequencing question's facts, noted not decided, as the topic asks.**

The 006 packet's phase 003 will create repo-rules/[split-sibling].md, described as the
other half of the split, with its router row (specs/sk-communication/006-sk-communication-
clarity/spec.md:130), and its definition of done requires that the split landed and the
router reaches both halves (006 spec.md:181). The 055 packet defers acting on this
lineage's findings until the sequencing question (does governance alignment land before
or after 006's phase 003) is answered (055 spec.md:32, 80, 99, 136, 157; plan.md:33,
167) at 94a72a4931. Which order one aligns in, this research does not decide.

**F-108. Runtime-confirmation facts gathered for later questions.**

.pi/PLUGINS.md:16-17 records @juicesharp/rpiv-ask-user-question v2.10.0, which is the
confirmation the handoff rule's Pi row cites (handoff-and-questions.md:128). A
repository-wide search for AskUserQuestion (excluding node_modules) finds it only in
specs/ prose, for example specs/sk-prompt/007-sk-prompt-parent/002-architecture-decision/
implementation-summary.md:61 and :96, and NOT in AGENTS.md, .claude/ or .pi/
configuration, at 94a72a4931. The 006 research had already noted that the question
surfaces are per-runtime and partly unverified (specs/sk-communication/
006-sk-communication-clarity/001-research-communication-context/research/iterations/
iteration-005.md:59) at 94a72a4931.

## What was tried and ruled out (negative knowledge)

- Dating each FM description line by git blame: dropped. The five questions ask about
  the current state, not provenance, and F-104's commit-level dating already answers
  the recency question without it.
- Reading the .pi/skills/ mirrors of the rule files: dropped. The governed corpus this
  router routes to is the repo-root copies under repo-rules/; the mirrors are a
  different governance surface than the one the topic names.

## Convergence telemetry

newInfoRatio = 1.0 (fully new: the bijection, the dating, the touchpoint inventory, the
machinery note and the 006 facts are all first-touch). Novelty justification: no prior
iteration exists, so nothing here overlaps accumulated knowledge. 1.0 exceeds the 0.05
threshold, which under this skill's semantics means keep going. Telemetry only:
stopPolicy=max-iterations forces iteration 2 regardless.

## What worked

Commit-level git dating up front. It converted may-not-have-reached-the-router from an
impression into a mechanical ordering, identified exactly which five files iteration 2
must compare, and corrected the topic's premise by one: a SIXTH file (blast-radius.md)
was edited the same day, but before the router, so it does not belong in the flagged
set.

## What failed

Nothing. No check failed, no source was unavailable.

## Next Focus (into strategy)

- Iteration 2: index accuracy, one row per rule file, each summary against its own
  description frontmatter; and trigger-row phrasing under the action-not-topic rule
  (REPO RULES.md:12).
