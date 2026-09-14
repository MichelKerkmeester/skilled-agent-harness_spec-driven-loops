# Iteration 002 - Index accuracy against the description frontmatter, and trigger-row phrasing

Read at: 94a72a4931 (94a72a493192a7c9f5e21199ccc8ced356356de1, 2026-09-13T17:17:51+02:00).
Every evidence citation below was read at that commit. One focus, two halves: the 11
index summaries of REPO RULES.md section 3 against the 11 description: frontmatter
lines of repo-rules/*.md, and the 11 trigger rows of section 2 against the router's own
action-not-topic instruction (REPO RULES.md:12).

## Findings

**F-201. The index carries exactly one row per rule file, 11 for 11.**

REPO RULES.md:58-68 is eleven rows, each linking one of the 11 files of F-101, in the
same order as the trigger table, at 94a72a4931. Count and coverage are mechanically
guarded: checkCounts requires files == triggerRows == indexRows (check-repo-rules.cjs:
202-209) and checkWiring fails a rule with no index row (:230-231, the no-index-row
diagnostic) at 94a72a4931. The question's premise (one index row per rule file) holds.

**F-202. Four of the eleven summaries are the description frontmatter, verbatim.**

- prevent-overengineering: REPO RULES.md:58 equals prevent-overengineering.md:3.
- blast radius: :62 equals blast-radius.md:3.
- communication: :65 equals communication.md:3.
- handoff and questions: :67 equals handoff-and-questions.md:3.

All four verified by direct comparison of the two lines at 94a72a4931.

**F-203. Two summaries differ from the description frontmatter by one token.**

- scope discipline: REPO RULES.md:59 reads deliverable, adjacent where the FM
  (scope-discipline.md:3) reads deliverable; adjacent. Punctuation only.
- delegation and orchestration: :61 reads no single model's verdict where the FM
  (delegation-and-orchestration.md:3) reads no single model verdict. One letter.
  Honesty note: the rule's own rule sentence, delegation-and-orchestration.md:45-47,
  reads no single model's verdict, so the INDEX matches the body and the FM
  description is the outlier. On this file, FM and body disagree at 94a72a4931.

**F-204. Three summaries truncate operative clauses of the description.**

- evidence and proof: :60 reads A claim is only as strong as the observation behind
  it. and stops. The FM (evidence-and-proof.md:3) continues: distinguish observed from
  derived from inferred. That clause is the file's organizing distinction, its section 1
  THREE TIERS (:47). Dropped at 94a72a4931.
- root cause: :63 reads every fix names the mechanism. and stops. The FM
  (root-cause-and-debugging.md:3) continues: that caused the failure. Cosmetic, the
  weakest of the three, recorded for completeness.
- uncertainty and honesty: :64 reads mark the confidence you actually have. and stops.
  The FM (uncertainty-and-honesty.md:3) continues: and halt on a contradiction. The
  contradiction halt is a load-bearing behavior of that rule (its Fires-when lists the
  contradiction case at :37, its section 1 owns the confidence bands at :46). Dropped
  at 94a72a4931.

**F-205. Two summaries are condensed paraphrases, not the description.**

- presenting decisions: :66 reads When the reader has to decide, put the verdict first
  and recommend one path. The FM (presenting-decisions.md:3) also carries or act on
  what you found and say where you are going before a long stretch of work. Both
  dropped clauses are operative: they correspond to the file's Fires-when scope
  (presenting-decisions.md:35-39, about to report what a long autonomous run found)
  and its intended-path duty. At 94a72a4931.
- hub routing: :68 reads registered is not routed, and a gate run without its hub
  argument checks something else. The FM (skill-hub-routing.md:3) reads: a nested mode
  registered on one surface is not reachable, and a per-hub gate run without its hub
  argument reports on a hub you did not touch. The row collapses the
  registered/routed/reachable distinction the file draws precisely (skill-hub-routing.md:
  38,43,66-77) and loses the two-hubs confusion that section 3 of the rule exists to
  prevent (:83-88). At 94a72a4931.

Score: 4 verbatim, 2 one-token deltas, 5 paraphrased-shortened. On the question's own
criterion (each summary matching the rule's own description, rather than a paraphrase
that has drifted), 4 of 11 pass cleanly, 7 do not, of which 5 are the paraphrase
family.

**F-206. Why the drift survives: no check of the eight compares a summary to a
description.**

The 8 registered checks (check-repo-rules.cjs:202-354, CHECKS at :355-360, at
94a72a4931) cover counts, wiring, FM-trigger-phrase uniqueness across files (:243-268),
line ceiling, FM key presence, divider parity, body links and Fires-when non-emptiness.
None compares an index summary to the rule's description. Every one of the five
divergences in F-202 to F-205 is therefore structurally invisible to the machinery that
was built, one day earlier, to catch corpus drift. The CI workflow (repo-rules-
corpus.yml:1-11,17-23) runs this same 8-check script, so the invisibility holds in CI
as well, at 94a72a4931.

**F-207. The five recent edits did not cause the index drift, and the exoneration is
mechanical.**

The 6 unflagged files' description lines last changed 2026-08-31 (root-cause,
uncertainty: ced970a2c7) and 2026-09-11 (handoff, presenting: ecdb026354), all before
the router's 11:47 touch (F-104), while the 5 flagged files' descriptions were untouched
by their 09-12 edits (F-105). Yet 4 of those 6 unflagged files diverge (scope,
presenting, root-cause, uncertainty per F-203/F-204/F-205). Therefore the 11:47 author
of the current section 3 had every current description in hand and still shipped 5
non-verbatim rows: the divergence was chosen or inherited at 493859130e, not produced by
the later race the topic worries about. At 94a72a4931. This corrects the topic's
framing: aligning the router TODAY would not have been sufficient even on 09-12 before
14:02, because the gap is not a race.

**F-208. The staleness is three layers deep: body, then description, then index.**

The description frontmatter lines themselves lag the 09-12 bodies: evidence-and-
proof.md:3 says nothing about the receipt criterion its own section 1 now carries
(:58-68, added 17:40 4bc3e78b1c), and communication.md:3's act after one pass says
nothing about the no-tables rule its section 5 now carries (:141-144, added 14:02
e2d5b7b572), both at 94a72a4931. So even a verbatim-FM index would still under-describe
those two rules. The alignment surface is bigger than the router: body, then FM, then
index, drift in that order.

**F-209. Trigger-row phrasing: the action-not-topic rule is honored in all 11 primary
clauses, with two faithfully-mirrored event sub-clauses.**

The instruction (REPO RULES.md:12): match on the action you are about to take, not the
topic of the request. Primary clause of every row, at 94a72a4931:

- :40 Add a file, module, class... ; :41 Touch a file... ; :42 Say done... ;
  :43 Hand work... ; :44 Delete, overwrite... ; :45 Diagnose a failure... ;
  :46 Answer without certainty... ; :47 Write any substantive reply... ;
  :48 Present a recommendation... ; :49 End a turn... ; :50 Wire, rewire...

All eleven lead with the about-to verb. No row is phrased as a topic. Two sub-clauses
are completed events rather than about-to actions:

- :47 the reader says they did not follow, which mirrors the rule's own Fires-when
  (communication.md:38, The reader has signalled they did not understand, an event);
- :46 hit a contradiction between two things that must both be true, which mirrors
  uncertainty-and-honesty.md:37 (Two things that must both be true are not., a state).

Verdict: zero defects by the router's own rule. The two relaxations live in the rule
files' own Fires-when phrasing, which the rows copy faithfully: the rows describe the
rules that exist, which is what the topic's first sentence asks. Any stricter reading
would indict the files' own wording, not the router.

**F-210. One It-settles enumeration demonstrably lags the five edits, and only one.**

Row :47's It-settles reads: How a reply reads: sentence shape, plain words, punctuation,
length, filler (REPO RULES.md:47). The no-tables rule, added 14:02 (e2d5b7b572,
F-105), is not represented, although it is now a numbered duty of section 5
(communication.md:141-144) at 94a72a4931. Timing: the router landed 11:47, the tables
rule 14:02, three hours fifteen minutes later. By contrast row :42's settles (What
counts as proof, how a green run lies, what an honest close-out contains) absorbs the
17:40 receipt criterion (evidence-and-proof.md:58-68) under its existing what counts as
proof, so it is not stale. Observed, at 94a72a4931: exactly one of the eleven It-settles
enumerations was made incomplete by the five edits, and it is the one whose rule grew a
new obligation.

## What was tried and ruled out (negative knowledge)

- Scoring divergence by similarity distance: dropped. The question asks whether each
  summary matches the FM rather than a paraphrase that has drifted, which is a verdict
  about matching, not a distance. Binary per-row classification, recorded above.
- Attributing the section-3 divergence to the 09-12 race: disproven by F-207's dating.
  Four divergent rows belong to files whose descriptions the race never touched.

## Convergence telemetry

newInfoRatio = 0.6 (partially new: the 11 artifacts and their FM lines were inventoried
in iteration 1, so the comparison's inputs were known; its outcomes, the 4/2/5 verdict,
the mechanism gap, the exoneration and the three-layer model, are new; 0.5 plus the 0.10
simplicity bonus for a model that reduces the question to one ordered comparison). Above
the 0.05 threshold: keep going. Telemetry only, stopPolicy=max-iterations forces
iteration 3.

## What worked

Comparing every row against the FM text word by word BEFORE reading the diffs: the
4/2/5 outcome, then the dating, produced the exoneration for free, because the flag
list and the divergence list do not intersect.

## What failed

Nothing. No check failed. One honesty note recorded in F-106 at iteration 1 (the 8th
check's provenance) remains UNKNOWN and is carried, not hidden.

## Next Focus (into strategy)

- Iteration 3: overlapping rows competing for the same action, rows that could never
  fire, and the scope statement (REPO RULES.md:75-109) against the current 11.
