# Ledger: communication-handoff.md

Before 10803 B, after 8564 B, cut 2239 B (20.7%). Version 1.6.0.1 to 1.6.0.2.

| Part | Before B | After B | Action |
|---|---|---|---|
| Frontmatter | 1085 | 1085 | Version bump only |
| Header (title, routed-from, subordination) | 279 | 279 | Kept verbatim |
| Fires when | 434 | 434 | Kept verbatim |
| The rule | 235 | 235 | Kept verbatim |
| 1. THE HANDBACK IS A SEPARATE THING FROM THE STATUS | 2001 | 1444 | Cut restatement and rationale, both failure lines kept |
| 2. WHAT COUNTS AS AN OPERATOR ACTION | 672 | 629 | Cut rationale clause |
| 3. NOTHING TO DO IS ALSO AN ANSWER | 401 | 237 | Cut rationale paragraph, failure line kept |
| 4. WHEN THE THING YOU NEED IS A DECISION | 1108 | 739 | Cut rationale and restatement, failure line kept |
| 5. THE QUESTION SURFACE IS PER RUNTIME | 1229 | 1009 | Cut rationale and restatement, table kept |
| 6. WHAT IS STILL RUNNING, AND WHAT RESUMES YOU | 1775 | 1061 | Cut boilerplate intro and rationale tails, failure line kept |
| 7. WHAT THIS RULE IS NOT | 629 | 457 | Cut rationale and restatement |
| 8. SELF-CHECK | 955 | 955 | Kept verbatim |

## Dropped sentences

§1
- "`AGENTS.md` §10 and [`evidence-and-proof.md`](evidence-and-proof.md) §10 already require an honest status: what ran, what is inferred, what only the operator can verify, and whether the work is edited, committed, pushed or dirty. That is a report about what happened." Shortened to "The status `AGENTS.md` §10 and evidence-and-proof §10 require reports what happened." [restatement: the status contents live in `AGENTS.md` §10 and `evidence-and-proof.md` §10]
- "The handback is a report about what happens next, and it is a different document." Shortened to "The handback reports what happens next, and it is a different document." [boilerplate]
- "A status that ends at "what only you can verify" has told the operator that something is theirs without telling them what to do about it." [rationale]
- "The cadence is triggered, not timed." [restatement: the triggers are listed in the next sentence, "It fires when the direction of the work changes..."]
- ", since a paraphrased "do not" is the first thing a resume loses" [rationale]
- "The handback is the part read under time pressure, and a reader who stops halfway through a reply should still have hit it." Shortened to "**Position it last**, so a reader who stops halfway through a reply has still hit it." [rationale: the time-pressure clause]
- ", so the claim is provable in the reply" [rationale]
- ", because a result with no command behind it is a claim" [rationale]

§2
- ", and it is worse than a short list, because" Replaced by a colon. [rationale]

§3
- "An empty handback and an omitted handback look identical to a reader, and they mean opposite things. One says the work is clear, the other says you did not check." [rationale: the failure line that follows carries the section]

§4
- "A question in prose competes with everything else in the reply and usually loses." [rationale]
- "When what you need is a choice between named alternatives, present it as a choice." [restatement: lives in "**Ask as a structured choice when all three hold:**" and its first condition, "The alternatives are nameable"]
- "A structured choice for something you could have decided yourself hands the work back rather than doing it, and" [rationale: the failure line names "a menu that appears for something the operator expected you to handle"]
- "A choice offered without a recommendation is the analysis handed over instead of finished." [rationale]

§5
- "The surface that carries it varies, so resolve it at the runtime you are in rather than assuming one." Shortened to "Resolve the surface at the runtime you are in rather than assuming one." [boilerplate]
- ", which is the same obligation in the only form available" [rationale]
- "The fallback is never worse than a prose question, so there is no runtime where this section permits burying the ask in a paragraph." [restatement: lives in "**A runtime with no such surface is not exempt.**"]

§6
- "A turn can end with nothing for the operator to do and still not be finished, because work you started is running where they cannot see it." [rationale: the failure line carries it]
- "Two things close that gap, and each is written only when it is true." [boilerplate, and restatement: "only when true" lives in "**Neither is ceremony.**"]
- ", earned because the operator is tracking parallel work rather than reading a claim" [rationale]
- "A row that only says a thing exists has told the operator what they already assumed." [rationale]
- "From the outside, a turn waiting on the operator and a turn waiting on a machine look identical, and this line is the only thing that separates them." [rationale]
- ", because an empty in-flight block is a status manufactured out of nothing" [rationale]
- "claiming you will continue by yourself when you cannot is worse than claiming nothing, because the operator stops watching a lane that has already stalled." Rewritten as the ban "and never claims it will continue by itself." [rationale: the comparison and the because-tail. The ban is kept]

§7
- "More questions is the failure this rule is most likely to be misread into" [rationale: the bullet heading "Not licence to ask more" states the misreading]
- "a handback listing your own unfinished work is that refusal wearing this rule as cover." [restatement: lives in the §2 table row "Work you left undone and are reframing as theirs" and in `AGENTS.md` §3]
