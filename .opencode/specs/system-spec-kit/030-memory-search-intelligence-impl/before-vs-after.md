# What Changed in Memory Search Intelligence: The 030 Wave-0 Implementation

> The ship-ready spearhead of packet 028's research roadmap. Eleven candidates landed across four retrieval subsystems as additive, reversible, individually tested changes. Two candidates were dropped from Wave-0 once evidence proved their cheap versions were unsafe. Every shipped change keeps default behavior byte-identical or fixes behavior that was measurably wrong.

---

## THE UNIFYING PRINCIPLE

030 is the implementation of a research-only packet. Packet 028 ran a 200-iteration deep-research campaign mining external memory systems and produced a ranked improvement roadmap for the four internal retrieval subsystems. That research did not authorize broad implementation. It identified candidate seams. 030 exists to ship only the Wave-0 spearhead, the candidates the broadening pass confirmed are additive, reversible, small-effort and safe without a schema migration or a measured baseline.

The roadmap carried an honest caveat that shaped everything below. No candidate has a measured before-and-after benefit number. Every leverage and effort estimate is structural inference, not a promised delta. So the rule for the packet was simple. Ship for correctness and reversibility, not for an unproven performance win. A candidate that only adds a knob keeps its default byte-identical and proves it. A candidate that touches a ranking path proves neutral order is preserved before it ships. A candidate whose cheap version turns out to break tests or damage live recall is deferred with evidence rather than forced through under a Wave-0 label.

That rule produced two clean drops. The idempotency default-flip broke eleven update-path tests. The system-kind recall filter would have hidden half the useful corpus on the live database. Both were deferred to Wave-1 with the blocking evidence recorded, because a Wave-0 packet that ships a known regression or a known recall loss is not a Wave-0 packet.

The work landed as scoped per-candidate commits on the 028 branch. Each candidate followed the same loop. Read the seam, patch only that seam, add a focused test, run candidate verification, request opus review for the higher-risk changes, then commit. Nothing was pushed to main and nothing was deployed.

---

## 1. MEMORY MCP: SEARCH, RANKING AND CONTENT IDENTITY

Most of the Wave-0 candidates land here, in the retrieval pipeline and the store hygiene paths under `system-spec-kit/mcp_server`. They split into graceful degradation, deterministic ordering, centralized content identity, and health visibility.

### 1. GRACEFUL EMBEDDER DEGRADE

**Before**

Recall threw on a null embedding. When the embedder was unavailable, the candidate-generation stage hit a null vector and the whole search failed rather than returning anything. A search that should have degraded to lexical matching instead returned an error or an empty set, and the caller had no signal that the vector lane was the reason.

**After**

The candidate-generation stage now detects an unavailable embedder and degrades to lexical search with `useVector=false` rather than throwing. The search response reports `embedder_available:false` so the caller can see that the vector lane was skipped and the result came from the lexical path. The change ships always-on because it is a correction to a fail-hard path, not a new feature.

A reviewed scope addition landed inside the same seam. Invalid Stage 1 input no longer collapses into a silent fallback. It now propagates as a typed `Stage1InputError` with a handler concept guard, so a genuinely malformed query fails with a typed error instead of being mistaken for embedder degradation. The successful degradation path is unchanged by this addition.

**Impact**

A search during an embedder outage returns lexical results with an honest flag rather than failing. A malformed query reports a typed error rather than masquerading as a degraded vector lane. The two failure modes are now distinguishable.

**Why always-on**

This is a correction to behavior that was wrong. A search that throws on a recoverable condition is a defect, and degrading to lexical is the fail-safe outcome. The input-validation tightening is benign and zero-live-blast, scoped to Stage 1 input, and was accepted in review.

### 2. DETERMINISTIC TIEBREAKS: ANN ORDER AND CONTENT-DERIVED FUSION

**Before**

Two ranking paths were run-unstable on ties. The four ranked ANN queries ordered only by distance, so when several rows shared a distance, which of them survived the LIMIT into fusion was not stable across runs. Separately, the fusion comparator and the RRF output sorts had no content-derived tiebreak, so rows that tied on score could come back in different relative orders on different runs. The primary ranking was correct, but the tail was nondeterministic.

**After**

The four ranked ANN `ORDER BY distance` queries now append a stable `m.id ASC` tiebreak, so which tied rows survive the LIMIT into fusion is run-stable. The deterministic comparator and all five RRF output sorts gained a `content_hash`-ascending tiebreak, coalescing to id for BM25 and nullable cases, so content-derived ordering stability holds even when scores tie. Primary ranking order was verified unchanged. The three broad-batch failures observed during this work were confirmed pre-existing on the baseline.

**Impact**

A query that returns tied rows returns them in the same order every time. The set that survives the ANN LIMIT into fusion is stable, so a tie at the cutoff no longer flickers between runs. Recall and primary ranking are untouched.

**Why always-on**

Determinism on ties is a correctness property, not a tuning lever. A stable tiebreak cannot change the primary ranking and was proven not to. It only removes run-to-run flicker at the tail.

### 3. RANKING KNOBS WITH BYTE-IDENTICAL DEFAULTS

**Before**

The RRF fusion stage hard-coded its active-channel bonus denominator, so there was no named seam to adjust how the overlap bonus was computed. The decay clock was tied to wall time at a point that made it awkward to feed a caller-supplied `nowMs`, so rank-time decay could not be driven cleanly from the caller's notion of now.

**After**

The fusion stage now exposes the active-channel bonus denominator as a named `bonusOverChannels` option, defaulting to `active`. The default path was traced arithmetically and proven byte-identical to the prior behavior, so adding the knob changed nothing for existing callers. The rank-time decay clock was made to read a caller-supplied `nowMs`, and the no-timestamp skip guard was restored so the change is a pure refactor with no default drift. Opus review returned SHIP.

**Impact**

The overlap bonus and the decay clock are now adjustable through named parameters rather than hard-coded constants, which is what a future tuning pass needs. Until that pass runs, every existing caller sees the exact same scores it saw before.

**Why default byte-identical**

Ranking paths are regression-sensitive. A small numeric difference can reorder results and look like a recall regression. The ship gate for an optional ranking knob was a byte-identical default proof, so the scaffolding can land without claiming any unmeasured relevance change.

### 4. CENTRALIZED CONTENT IDENTITY

**Before**

The SHA-256 content-hashing logic lived in two places. The content-body hash was computed inline in the memory parser, and the canonical-field hash lived in the idempotency-receipts path. The two formulas were maintained separately, so a future change risked drifting one identity computation away from the other.

**After**

Content identity was centralized into one `lib/content-id.ts` module exposing two primitives: `hashContentBody` for the content-body hash and `hashCanonicalJson` for the canonical-field hash. The parser and the receipts path now call the shared module. A parity test proves the centralized hashes are byte-identical to the prior inline outputs, so this is a pure refactor with no behavior change. Legacy bare-hex identity was preserved by parameterizing the formula.

**Impact**

There is now one source of truth for content identity. The two callers cannot drift apart, and a future idempotency or dedup feature has a single primitive to build on rather than two parallel implementations to keep in sync.

**Why additive and behavior-preserving**

Consolidating a duplicated formula into one module is structural. The parity test pins the outputs, so nothing downstream that depends on a content hash sees a different value.

### 5. HEALTH VISIBILITY & STORE HYGIENE

**Before**

The background-enrichment status surface reported some state but did not expose pending and failed counts as health gauges, so an operator could not see how many enrichment jobs were waiting or had failed. Separately, the frontmatter promoter's cleanup pass did not guard against already-invalidated generated causal edges, so a cleanup could touch edges that were already closed.

**After**

Two read-side gauges for `pending` and `failed` background-enrichment states were added by aliasing onto the existing `getBackgroundEnrichmentStats` data, so the counts surface in health output with no new state and no new query. The frontmatter promoter cleanup now adds `AND invalid_at IS NULL` to its predicate, so it skips already-invalidated generated causal edges. This is defensive hardening, not a gate. When pending or failed enrichment states are absent, the gauges return zero.

**Impact**

An operator can see pending and failed enrichment counts in health output. Causal-graph cleanup leaves already-closed generated edges intact rather than re-touching them.

**Why additive**

The gauges reuse existing status data and add no background state. The cleanup guard is a defensive predicate that can only prevent a redundant operation, never change a correct one.

### 6. CONSTITUTIONAL EDIT PROTECTION

**Before**

The constitutional edit path had no guard against an edit that removed a row's protection, and no compare-and-set precondition on the current hash. An update that downgraded a constitutional row, or one that wrote against a stale view of the row's content, could land without being caught.

**After**

The constitutional edit path now carries a non-self-edit assertion and an `expectedHash` precondition. An edit that would remove constitutional protection is rejected. When the caller supplies `expectedHash` and it does not match the current row, the write is rejected as a stale compare-and-set rather than overwriting newer content. The default fails closed for constitutional protection. Opus review returned SHIP, with two P2 polish notes recorded: the CAS check is opt-in, and a now-dead downgrade-audit branch remains.

**Impact**

A governance maintainer cannot accidentally strip protection from a constitutional row, and a stale update cannot clobber a newer one when the caller opts into the hash precondition. The non-constitutional update path is unchanged.

**Why fail-closed**

Constitutional rows are load-bearing. Rejecting a protection-removing edit by default is the safe outcome, and a legitimate repair can route through a reviewed path. The CAS precondition only engages when the caller supplies `expectedHash`, so existing non-CAS callers are not restricted.

---

## 2. CODE GRAPH: IMPACT RANKING

The code graph picked up one Wave-0 candidate, a rank-time trust signal for impact context that had to be added without perturbing the existing peer order.

### 1. RRF-ADDITIVE RANK-TIME TRUST

**Before**

The code-graph impact context ranked its results by a structural score that did not fold in any edge-level trust or confidence signal. The roadmap proposed blending trust into the rank, but the obvious multiplicative-neutral form would have re-ordered ties against the rowid baseline, which is exactly the kind of silent ranking drift the packet refused to ship.

**After**

Impact context now blends trust as an RRF-additive term: `rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor`. The blend is additive, not multiplicative, so the neutral case stays byte-identical to the baseline rather than re-ordering ties. The structural weight is unmutated. The neutral order was verified byte-identical against the baseline as the ship gate. The boost magnitudes are deliberately unbenchmarked, so magnitude tuning is a documented follow-up rather than a claimed win.

**Impact**

The impact ranker can now lift trusted edges when confidence and evidence class justify it, without disturbing the order of peers that carry no trust signal. A scoped impact query returns the same neutral order it did before until a trusted edge actually changes the picture.

**Why neutral-order-preserving, magnitude deferred**

A multiplicative-neutral blend looks mathematically tidy but reorders ties against the rowid baseline, so it was rejected. The additive form ships because its neutral order is provably identical to the baseline. The boost magnitude is a relevance-tuning question that needs benchmark data the packet does not have, so it is held back as a follow-up rather than guessed.

---

## 3. DEEP LOOP: FANOUT BEHAVIOR AND A REDUCER-TEMPLATE FIX

Deep Loop picked up two changes: a one-line-but-load-bearing fix to the deep-research strategy template, and a trio of fanout improvements plus graceful self-stop.

### 1. DEEP-RESEARCH STRATEGY ANCHORS

**Before**

The deep-research `reduce-state.cjs` reducer requires seven `ANCHOR:*` marker pairs in the strategy document to parse it. The shipped strategy template did not carry those markers, so the reducer hard-failed on the very first reduce of any deep-research run that used the template as-is.

**After**

The seven required `ANCHOR:*` marker pairs were added to the shipped `deep_research_strategy.md` template. The reducer regex was verified against the result and all seven markers match, so the reducer no longer hard-fails on first reduce.

**Impact**

A deep-research run started from the shipped template now reduces cleanly on its first pass rather than crashing the reducer. The template and the reducer contract are back in sync.

**Why a pure fix**

This corrects a contract mismatch between a template and the tool that consumes it. There is no behavioral choice here, only the markers the reducer was always expecting.

### 2. FANOUT DETERMINISM, GAUGES & GRACEFUL SELF-STOP

**Before**

The fanout merge had no deterministic total order beyond its dedup, so a merge of equally-ranked lineages could order them differently across runs. The fanout pool exposed no lag, pending or failed gauges. And a fanout run that caught a SIGINT or SIGTERM mid-flight left no partial summary and gave no signal that it had been stopped rather than completed. An empty tick was not treated as a valid convergence.

**After**

Three fanout changes landed together. The merge gained a deterministic total order on top of its existing id-or-title dedup, so equally-ranked lineages now merge in a stable order. The pool gained lag, pending and failed gauges. The run now flushes a partial summary marked `stopped:true` on SIGINT or SIGTERM and treats an empty tick as a valid convergence rather than a stall. The change was verified with `node --check`, fifty-eight fanout tests, and mutation checks, and it deliberately did not duplicate the upstream failure-class computation.

**Impact**

A fanout merge produces the same order every time. The pool reports its lag and its pending and failed counts. A run that is interrupted leaves a partial summary that says it was stopped, and an empty convergence tick is recognized as convergence rather than treated as a hang.

**Why additive and verified**

The merge order is a determinism property proven by tests. The gauges add observability without changing behavior. The graceful-stop path only adds a clean shutdown summary where there was none, and the empty-tick convergence recognizes a state the loop already reaches.

---

## 4. THE TWO DEFERRED CANDIDATES

Two roadmap rows were carried into Wave-0 as candidates and then deliberately dropped once their evidence came in. They are not partial work. They are decisions, each with blocking evidence and a Wave-1 path.

### Candidate 6: Idempotency receipts default-on (C4-A)

The candidate proposed flipping `SPECKIT_MEMORY_IDEMPOTENCY` on by default. The cheap version was to flip the flag and trust the existing paths. Flipping it on activates the idempotency and near-duplicate path on `memory_update` and breaks eleven `handleMemoryUpdate` tests that pass with the flag off. The roadmap had already flagged C4-A as needing deferred-save wiring care rather than a clean flip, and the replay-and-conflict leg the candidate leaned on had been refuted. So the flip was deferred to Wave-1 with the regression recorded. The content-id primitive from candidate 7 shipped and stays as future infrastructure for the proper version, which has to scope save-path idempotency separately from update-path semantics before any default flip.

### Candidate 11: System-kind recall exclusion (M-system-kind-exclusion)

The candidate proposed excluding `source_kind='system'` rows from default recall on the hypothesis that they were substrate noise. Opus review checked the live 734MB database and disproved the premise. The `source_kind='system'` set is 9,592 canonical spec-doc rows including 29 constitutional rules, not substrate noise. The cheap predicate would have hidden roughly half of useful recall, and an admin opt-in does not rescue a default that hides load-bearing memories. So the filter was deferred to Wave-1. The real version needs a true substrate signal, a constitutional and spec-doc short-circuit, and live-database validation before it can change default recall.

Both drops are the unifying principle applied to the packet's own candidates. A change that can damage results or hide load-bearing rows does not ship on a structural guess. It ships when the evidence supports it, or it waits.

---

## CURRENT STATE

Eleven Wave-0 candidates shipped as scoped commits on the 028 branch (`738e118751` through `e21caf5de6`, with the docs closeout in `ab5459fb6d`). None of them required a schema migration. The shipped changes are either always-on corrections to behavior that was wrong (graceful embedder degrade, deterministic tiebreaks, the constitutional edit guard, the enrichment gauges and cleanup hygiene, the deep-research anchor fix, the fanout determinism and self-stop) or additive scaffolding with a byte-identical default proof (the RRF bonus and decay knobs, the centralized content-id module, the RRF-additive code-graph trust blend). The ranking and impact paths that gained knobs or trust signals keep their default order byte-identical, proven by parity and neutral-order checks.

Two candidates remain unshipped by decision, each with concrete evidence and a Wave-1 intake. Candidate 6 needs save-path idempotency scoped separately from update-path semantics before the default can flip. Candidate 11 needs a true substrate signal plus a constitutional and spec-doc short-circuit and live-database validation before it can filter default recall.

Verification used the touched-area composition suite as the reliable gate rather than the broad Memory MCP suite, which fails and stalls in a known IPC and launcher region that reproduces on the baseline at `1ecc531431`. The touched-area run passed: 666 Memory MCP tests across the search, CRUD, fusion, decay, idempotency, causal, health and formatter files, 80 Code Graph context, query, budget, resolver and verify tests, and 58 Deep Loop fanout tests. Typecheck and build are clean on both packages, `node --check` is clean on the three fanout scripts, and `validate.sh --strict` is green on the packet with zero errors and zero warnings.

Two honest residuals remain. The Q4-C1 boost magnitude is unbenchmarked, so its neutral order is the ship gate and magnitude tuning is a follow-up. And the pre-existing broad Memory MCP suite failures sit outside this packet's scope, classified against the baseline rather than fixed here.
