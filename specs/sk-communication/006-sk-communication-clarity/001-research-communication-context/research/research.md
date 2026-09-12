---
title: "Research: sk-communication clarity context"
description: "Ten-iteration classification of three external communication sources against this repository's communication stack, with an owning-surface map, a contradiction page and three grounded answers to the packet's open questions."
trigger_phrases:
  - "sk-communication clarity research"
  - "communication candidate map"
  - "contradiction page"
  - "owning surface map"
  - "colon rule conflict"
importance_tier: important
contextType: general
---

# Research: sk-communication clarity context

Ten iterations, convergence disabled by operator request. Executor `cli-pi`, model
`deepseek-v4.1-flash` through the DevPass LLM Gateway, thinking pinned to `max`.

| Measure | Value |
|---|---|
| Iterations completed | 10 |
| Key findings | 93 |
| Ruled-out directions | 37 |
| Sources cited | 72 code, 27 other |
| Final convergence score | 0.94 |
| Open questions remaining | 5 (carried to phase 002 as decisions, not as gaps) |

---

## 1. VERDICT

All three routes the packet asked about are warranted, and they are not alternatives. Forty-seven
raw recommendations across the three sources collapse to **29 failure-keyed candidates**. They
distribute across the existing rule files, the wording standard and the skill's benchmark folder
without needing a new root-doc clause.

Three results change the packet's own plan:

1. **`repo-rules/communication.md` must split before it absorbs anything.** It takes 10 of the 29
   candidates, the largest single allocation, and it already records its own length ceiling and a
   prior split at `communication.md:49-51`. The split is the default first step of phase 003, not a
   contingency. The seam the merge exposes is sentence and paragraph mechanics against reply shape.
2. **The wording standard should not split into halves.** The document-versus-reply line already
   binds in prose at `repo-rules/communication.md:119-126`. A file split moves the
   `VOICE PERSONALITY` exclusion into the reply half and adds a row rather than removing it, because
   that exclusion's reason is message ownership rather than documentness
   (`sk-communication/SKILL.md:176-181`). Only the scoring-band exclusion genuinely disappears, and
   a precedent exists at `hvr-rules.md:38`. The shape that fits is a base plus a supplement.
3. **The ADHD contract is neither a rule nor a mode.** Seven of its ten rules are delivery
   invariants this repository's own convention would load unconditionally. Three are
   reader-conditional and need a mode carried by fail-closed operator machinery. The binding
   convention is stated at `repo-rules/communication.md:41-42`: a rule about how replies read has to
   load whenever a reply is being written.

---

## 2. WHAT EACH SOURCE CONTRIBUTES

### `context/clarity.md`

Eighteen rules. Ten covered by a named stack line, three partial, five new.

The five new ones share a shape: they govern decisions made before the first sentence, or
relations between sentences, and the stack begins at the sentence.

| Rule | Why it is new |
|---|---|
| 1 and 2, the reader model | Choosing the reader, and the gap between what they hold and what they need, both decided before drafting. The nearest stack lines model the operator only after the request arrives. |
| 10, say the relation | `repo-rules/communication.md:74` is sentence-internal, so nothing governs the link between two sentences. |
| 15, each paragraph earns the next | The atomic-paragraph rule optimises local independence, a different axis. |
| 17, cut and reorder | No owning surface at all. The rewrite command is display-only (`commands/rewrite/response.md:17-20`) and the skill bars file editing (`sk-communication/SKILL.md:57`). |

### `context/claude-style-patch-main/STYLE.md`

Thirty-four discrete recommendations. Fourteen covered, eleven partial, six new, three conflicting.

The distinctive contribution is named tics with repairs attached, which is a different enforcement
shape from a rule with a rationale. Three items have no owning surface: the verbless-fragment ban,
the label-before-payload principle that unifies the colon and fragment bans, and a reply-level
numbering scheme, since the repository's numbering rules sit in the document half that
`communication.md:121-126` excludes from replies.

### `context/i-have-adhd-main`

Two halves, and the mechanism half carries more than the rule half. It ships a session-start
injection behind an opt-in flag, runtime manifests with a mirror kept in sync, a blind-judged eval
harness with a weighted rubric and a blocking class, and a release gate with four numbered
conditions. The rule half sharpens the handback rather than adding to it.

---

## 3. CONTRADICTION PAGE

Four conflict candidates named across the run. One closed, three open. Each open one needs a
written decision in phase 002 either way.

| # | Conflict | Point of disagreement | Status |
|---|---|---|---|
| C-1 | ADHD cause-then-fix versus the evidence rules | May a reply name a single cause when several remain consistent with the evidence? | Open. Repo wins in principle. Qualifier drafted: keep the cause-then-fix order, make the cause's epistemic status explicit when no run confirms it. |
| C-2 | The colon rule versus the em-dash replacement | May a colon introduce a non-list clause? `communication.md:104-106` and `hvr-rules.md:114` offer the colon; `STYLE.md:25-29` forbids the clause form. | Open. Operator decision. Adoption would amend both and would need to grandfather the rule files' own label-then-list convention. |
| C-3 | Not-X-but-Y | May a genuinely competing contrast take the antithesis shape? | **Closed.** `hvr-rules.md:140-145` bans it outright and is the stricter side. No change. |
| C-4 | The "load-bearing" ban | Does a word ban reach framework vocabulary that loads every turn? The term appears four times across `AGENTS.md` and `repo-rules/`. | Open. Scope decision: confine the ban to user-facing reply prose and exempt repo-owned framework wording. |

C-2 and C-4 are scope questions, reply prose against documents and framework prose. C-1 is an
epistemic question and is the only one with a mechanical resolution.

**The colon conflict is not abstract.** The rule that offers the colon demonstrates the banned
pattern in the sentence doing the offering: `communication.md:105` reads "A dash is usually hiding a
decision you have not made:" followed by a clause. A second instance sits at `:113`.

---

## 4. OWNING-SURFACE MAP

Two constraints held throughout. `communication.md` records its own length ceiling, and
`sk-communication` is blocked as a rule owner because it is a display-only lane.

- **`communication.md`: 10 of 29.** Requires the split named in the verdict.
- **The wording standard: 6 of 29.** Two are reply-facing, so their adoption flows through the
  voice-half delegation at `communication.md:116-126`. Both surfaces must move together or the rule
  loads for documents and not for replies.
- **The skill's `benchmark/` folder: 2 of 29.** A measurement surface, not a rule surface, so the
  skill's no-rubric rule stays intact.
- **No new root-doc clause.** The two-clause floor in `AGENTS.md` §8 is deliberate and the 29
  candidates do not need it.
- **No surface today: 4 candidates.** The editing lane, one gap statement, one unverified item and
  one lowest-value item. Recorded as the honest residuum rather than forced onto an existing file.

---

## 5. MEASUREMENT

The harness and the release gate belong to phase 005, and the baseline must be captured before
phases 003 and 004 change anything, or no regression claim is possible afterwards.

The ADHD source's four release conditions do not all transfer. The condition requiring a powered
blind human study has no equivalent capability here, and a gate that claims it would rest on
evidence this repository cannot produce. Phase 005's gate must name that gap rather than inherit
the condition.

Iteration 10 proposed reply cases keyed to named candidates, each case being a prompt plus the
observable that separates pass from fail, plus one negative control: a reader asking for a
restatement, which the adopted rules should not change. The control is what distinguishes a harness
that measures the rules from one that measures the label.

---

## 6. WHAT WAS RULED OUT

Thirty-seven directions were investigated and eliminated. The ones that matter for phase 002:

- **`sk-communication` as an owning surface for any wording rule.** Its own contract makes it a
  display-only lane that carries no rubric.
- **A pre-writing reader-model rule hiding inside `presenting-decisions.md` §3.** Checked and
  absent, which is why clarity rules 1 and 2 are new rather than partial.
- **Rule 10 as covered by `communication.md:74`.** That clause is sentence-internal.
- **Rule 15 as covered by the atomic-paragraph rule.** Atomicity and progression are different axes.
- **The comment-tic half as covered by the wording standard.** That standard's scope is documents
  (`hvr-rules.md:29`), so it cannot reach code comments.
- **Reading the ADHD source as carrying a reply-quality rubric.** Its rubric grades agent task
  performance, not prose.

---

## 7. RUN INTEGRITY

Every iteration wrote its three required artifacts and every iteration fails the workflow's
mechanical gate on one reason, `route_proof_missing`, deterministically across all ten. The cause
is downstream of the research: the prompt pack documents a legacy record shape, the append gateway
upcasts it, and the upcast projection drops the route-proof fields the gate then requires. The
leaves wrote those fields correctly into their delta files. The gate failure therefore says nothing
about the findings.

Iteration 8 was dispatched twice. The first attempt was killed at the 899-second executor timeout
because its brief asked for a repository-wide enumeration inside an iteration budgeted at three to
five actions. The brief was narrowed and the retry completed in about 220 seconds. The wrapper
returned zero on the killed attempt, so only the artifact check caught it.

Iteration 6 declared the five key questions answered and recommended holding. Convergence was
disabled by operator request, so iterations 8 through 10 were steered onto named open questions
rather than allowed to restate the inventory. Each of those three produced a decision-shaped answer,
and iteration 8's answer corrected the framing of the packet's own open question.

---

## 8. HANDOFF TO PHASE 002

The allocation table phase 002 needs is the 29-candidate map in
`iterations/iteration-004.md` F1 and F3, as corrected by `iterations/iteration-006.md` F2, which
revised the evidence set on one conflict row.

Phase 002 has to record five decisions, not discover them:

1. C-2, the colon question, with the grandfather clause for the rule files' own convention.
2. C-4, the "load-bearing" scope question.
3. C-1's qualifier, which is drafted and needs adoption or rejection.
4. The wording-standard shape: base plus supplement rather than two halves.
5. The reader-profile split: seven unconditional rules, three needing a mode, and which surface
   carries the mode.

One prerequisite belongs to phase 003 rather than 002: the `communication.md` split must land before
any of its ten candidates are written into it.
