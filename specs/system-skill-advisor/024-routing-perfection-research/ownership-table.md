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
<!-- /ANCHOR:table -->

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
and turned out not to be one. Rows 8 and 11 still need an operator ruling.

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
