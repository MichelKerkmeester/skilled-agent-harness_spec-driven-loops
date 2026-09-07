---
title: "Ownership decisions for the 20 residual routing failures"
description: "Per-phrase disposition for the 18 outranked and 2 no-reach phrases left after the vocabulary fix. Nine were applied and verified; eight turn out not to be ownership questions at all, which is the finding that matters."
trigger_phrases:
  - "routing ownership table"
  - "outranked phrases"
  - "residual routing failures"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Ownership decisions for the 20 residual routing failures

<!-- ANCHOR:finding -->
## 1. THE FINDING THAT CHANGES THE PLAN

The plan assumed these 20 are ownership questions, fixable by editing which hub declares
what, with no scorer change. **Eight of them are not.**

`sk-design` already declares `design review`, `review this screen`, `review this deck`,
`review this layout` and `design review of this slide deck` as exact entries in its
`intent_signals`. `sk-code` declares **nothing that matches any of them** — its only
review vocabulary is `code review`, `pr review`, `security review`, `review packet docs`
and `p0 p1 p2 review`, none of which is a substring of any contested phrase, and neither
its `derived.intent_signals` nor its `description.json` keywords match either.

Both hubs nonetheless resolve through the `explicit_author` lane, and `sk-code` scores
higher:

| phrase | sk-code | sk-design | both lanes |
|---|---|---|---|
| `review this screen` | **0.7718** | 0.7246 | `explicit_author` |
| `review this layout` | **0.7599** | 0.7178 | `explicit_author` |
| `design review of this slide deck` | **0.7773** | 0.7267 | `explicit_author` |

An exact multi-word declaration is losing to a hub with no matching declaration at all.
Nothing can be removed from `sk-code` to fix it, because `sk-code` declares nothing
relevant, and removing the phrases from `sk-design` would make its routing worse rather
than better. **These are not resolvable by the vocabulary mechanism this step provides.**

That belongs to the scorer work, and it raises the value of that work above what the
decision record estimated: this is not a niche lexical-lane edge case, it is the single
largest group in the residue.
<!-- /ANCHOR:finding -->

---

<!-- ANCHOR:table -->
## 2. THE TABLE

Probed at advisor generation 714-716. `Winner` is the hub the advisor actually returns first.

| # | Phrase | Declared by | Winner | Disposition |
|---|--------|-------------|--------|-------------|
| 1 | `design review` | sk-design | sk-code 0.944 | **Escalate to scorer.** sk-design declares it exactly and loses. |
| 2 | `review this screen` | sk-design | sk-code 0.935 | **Escalate to scorer.** Same. |
| 3 | `design review of this slide deck` | sk-design | sk-code 0.938 | **Escalate to scorer.** Same, and sk-code has no slide-deck capability at all. |
| 4 | `review this deck` | sk-design | sk-code 0.928 | **Escalate to scorer.** Same. |
| 5 | `review this layout` | sk-design | sk-code 0.928 | **Escalate to scorer.** Same. |
| 6 | `iterative review` | system-deep-loop | sk-code 0.9284 vs 0.9256 | **Escalate to scorer.** A 0.003 margin, and iteration is deep-loop's defining property. |
| 7 | `review the docs` | sk-doc | sk-code 0.939 | **sk-doc yields is wrong; escalate.** Same shape as 1-5. |
| 8 | `review request` | system-deep-loop | sk-code 0.944 | **Operator call.** "Request a review" is deep-loop's command surface; "review this request" is sk-code's. Genuinely ambiguous. |
| 9 | `review bar` | sk-doc | sk-code 0.928 | **Rephrased.** It lives in sk-doc's `DOC_QUALITY` block and means a quality bar for documentation, but reads as a UI bar. Now `documentation review bar`, which sk-doc wins at 0.9421 over sk-code 0.9323. |
| 10 | `pass review` | sk-doc | sk-code 0.933 | **sk-doc yields.** A review passing is a code-review outcome, not a documentation one. |
| 11 | `browser debug` | mcp-tooling | sk-code 0.913 | **Operator call.** Chrome DevTools MCP versus debugging code in a browser. Both defensible. |
| 12 | `browser agent` | mcp-tooling | sk-code 0.870 | **Escalate to scorer.** Intended as "sk-code yields", but sk-code declares nothing matching, in ROUTER.md or `intent_signals`. Same shape as rows 1-7: there is nothing to yield. |
| 13 | `design tokens` | mcp-tooling **and** sk-design | sk-design 0.920 | **mcp-tooling yields.** The only phrase in the fleet declared twice. sk-design owns tokens; mcp-tooling's claim is incidental. |
| 14 | `spec kit runtime` | cli-external-orchestration | system-spec-kit 0.95 (exact tie) | **cli-external yields.** The runtime is system-spec-kit's by name. |
| 15 | `spec kit memory` | cli-external-orchestration | system-spec-kit 0.95 | **cli-external yields.** Same. |
| 16 | `skill benchmark` | sk-doc | system-deep-loop 0.830 | **sk-doc yields.** The benchmark harness is deep-loop's. |
| 17 | `create agent` | sk-doc | `create:agent` 0.82 | **No defect. Close.** A command surface winning a phrase that names that command is correct. Note the ranking is neither by score nor confidence: `create:agent` ranks first at score 0.513 while sk-doc sits second at 0.571. |
| 18 | `decision branch` | sk-design | sk-git 0.945 | **sk-design yields.** "Branch" reads as version control first. Rephrase sk-design's intent if it needs one. |
| 19 | `dom inspect` | mcp-tooling | nothing above bar | **Rephrase.** Two words, and it returned an empty response on first probe and a valid one on retry, so it is also intermittently a probe failure. |
| 20 | `show the full` | sk-doc | nothing above bar | **Drop the fragment.** It is a prefix of "show the full sk-doc toolkit", not a phrase. Declare the complete form instead. |
| 21 | `obsidian plugin` | sk-code | mcp-tooling 0.9187 vs 0.9164 | **Operator call, and new.** It surfaced at generation 734, not in the original twenty. sk-code declares it exactly plus three narrower variants; mcp-tooling declares only `obsidian`, `obsidian vault` and `obsidian mcp` and wins on bare-token overlap. Both hubs genuinely own an Obsidian surface (`sk-code-obsidian` builds a plugin, `mcp-obsidian` drives the vault). |
<!-- /ANCHOR:table -->

---

<!-- /ANCHOR:table -->

---

<!-- ANCHOR:hints -->
## 2b. THREE OF THESE ARE ONE HARDCODED TOKEN, NOT A DISPUTE

`CATEGORY_HINTS` in the lexical lane grants a flat **+0.38** whenever a bare token appears
in the prompt. `sk-code` holds 21 such tokens, among them `browser` and `layout`. Three
contested rows are decided entirely by that boost:

| phrase | hint that fires | declared by | won by |
|---|---|---|---|
| `browser debug` | `browser` | mcp-tooling | sk-code, 0.7591 to 0.6869 |
| `browser agent` | `browser` | mcp-tooling | sk-code |
| `review this layout` | `layout` | sk-design | sk-code |

In each case the winner declares nothing matching the phrase and the loser declares it
outright. The margin on `browser debug` is 0.072 against a boost of 0.38, so without the
hint mcp-tooling wins comfortably rather than narrowly.

That reframes the decision. It is not "which hub owns browser work", it is "should a bare
`browser` token hand sk-code every prompt containing the word, including one another hub
declares verbatim". The same question applies to `layout`, and to the other 19 tokens
nobody has audited.

The remaining seven carry no hint. A control settles what drives them: hold the artifact
noun and change only the verb.

| prompt | result |
|---|---|
| `critique this screen` | **sk-design 0.8373** — correct |
| `review this screen` | sk-code — wrong |

Same noun, same intent, opposite outcome. **The verb decides and the artifact does not**,
which is exactly the failure the original research named and exactly what artifact-noun
arbitration was proposed to fix. That proposal was cut from the plan on the reasoning that
`sk-code` legitimately owns review because it owns `sk-code-review`. The control shows the
reasoning does not hold: `sk-code` takes `review this screen` while having no claim on a
screen, and loses the same screen the moment the verb changes.

The mechanism is the overlap score saturating. `scoreTokenOverlap` ends
`Math.min(hits / Math.max(3, denominatorBasis), 1)`, and the lane feeds it a prompt whose
tokens have been expanded with synonyms while the denominator deliberately stays at the
original count, so recall rises without the divisor following. `review` expands to `audit`,
`findings` and `regression`, which turns a three-token prompt into six possible hits over a
divisor of three. Any hub matching three of the six reaches 1.0 and stops.

Both hubs clear that bar on `review this screen`. `sk-design` matches more — it has `screen`
and `this` on top of the shared `review`, `audit` and `findings` — and the cap throws the
difference away. The lane returns the same number for the hub that matched five tokens and
the hub that matched three, so it cannot separate them at all, and the outcome is settled by
whatever else contributes.

That is why the verb wins. Not because the verb is weighted, but because once the verb and
its synonyms saturate the lane, the noun that would have distinguished the two hubs is no
longer able to count. It also explains why the effect concentrates on short phrases: the
divisor floor of three means a two or three word prompt saturates on very little.

*Confidence boundary:* the formula and the saturation are read from
`lib/scorer/text.ts:100` and `lanes/lexical.ts:57-59`, and the token accounting above is a
hand model rather than an instrumented per-lane trace. What would settle it definitively is
logging the pre-clamp overlap value for both hubs on one contested phrase; if both exceed
1.0 before the clamp, the diagnosis is confirmed.

Narrowing a hint is a scorer-data change with fleet-wide reach, so it is not made here. It
is now a one-line change waiting on an ownership answer rather than an open investigation.
<!-- /ANCHOR:hints -->

---

<!-- ANCHOR:disposition -->
## 3. WHAT THIS MEANS FOR THE SEQUENCE

**Applied 2026-09-07, advisor generations 721-723: 9 rows.** 9, 10, 13, 14, 15, 16, 18, 19, 20.
Each verified after rebuild: the yielding hub no longer contests, and the intended winner
now takes the phrase alone or clearly. Row 17 needed nothing and is closed.

Rows 9 and 19 are the informative ones, because both were fixed by rewording rather than
by reassigning. `dom inspect` reached nobody as two words; as `inspect the dom` it routes
to mcp-tooling at 0.8906. `review bar` lost to sk-code; as `documentation review bar` it
wins at 0.9421. The original research argued short phrases fail on length rather than
vocabulary, and these confirm it directly: same hub, same intent, one more word, resolved.

That suggests a cheaper first move than arbitration for some of the escalated rows too.
Before changing the scorer, it is worth asking whether a contested phrase is simply
underspecified.

**Not resolvable by vocabulary: 8.** Rows 1-7 plus row 12, which was written as a yield
and turned out not to be one. Rows 8, 11 and 21 need an operator ruling.

**A margin this thin is fragile, not random, and the difference matters.** An earlier
version of this section called row 21 noise and said it moved on its own. Both were wrong.
Probed five times in a row the scores are identical to six decimals, 0.741689 against
0.737555, a deterministic gap of 0.004134. Nothing fluctuates.

What is true is that 0.004 is small enough for an unrelated edit to flip it, and one did:
the row was absent at generation 729 and present at 734, across a window holding this
session's own vocabulary changes and four commits from a concurrent session. The advisor
harvests documentation frontmatter, so the reachable causes are wide. That is sensitivity
to input, not instability in the scorer, and calling it noise would excuse a result that is
perfectly reproducible.

The practical reading is unchanged: a row separated in the third decimal is better treated
as unowned than owned. But it should be decided rather than waited out, because it will not
drift back on its own.

So the plan's step 2 target, "every hub prints a literal `RESULT: PASSED`", is **not
reachable through steps 1 and 2 alone.** Vocabulary editing closed 10 of the 20, counting
row 17 which needed nothing, and cannot reach the other 10.
Either the scorer work moves ahead of the gate-wiring step, or the gate lands with a dated
allowlist covering rows 1-8 and 11 and the residue is tracked rather than closed.

The second option is cheaper and honest, and it is what the plan's own step 3 already
proposes. That is what shipped: `router-reach-allowlist.json` carries the eleven, each
with its reason, dated and with a review date.

Final state at advisor generation 729: every hub `OK`, `RESULT: PASSED`, exit 0, with
`allowed=11` and no probe errors. The allowlist pins the winning hub as well as the
phrase, so a known dispute is forgiven and a new one is not, which was verified by
asserting a false winner and watching the run fail.
<!-- /ANCHOR:disposition -->
