---
title: "Chronological Timeline [system-spec-kit/030-memory-search-intelligence-impl/timeline]"
description: "Chronological build sequence of the 030 Wave-0 implementation session: the 9 code commits in order plus the 2 review-caught candidate drops, with what shipped and how each was verified."
trigger_phrases:
  - "030 timeline"
  - "030 build sequence"
  - "030 commit order"
  - "wave-0 chronological order"
  - "which 030 candidate shipped when"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-memory-search-intelligence-impl"
    last_updated_at: "2026-06-19T00:00:00Z"
    recent_action: "Authored chronological build timeline from git history"
    next_safe_action: "Use this file to trace what shipped when and in which commit"
    completion_pct: 100
---
# 030 Chronological Timeline

> **Sort key:** git commit order on `system-speckit/028-memory-search-intelligence`, **oldest → newest**
> (the build order), taken from `git log --oneline --reverse 1ecc531431..HEAD`. This is the literal
> sequence the Wave-0 work landed in, not the candidate-number order from the spec.
>
> **What this packet did.** It shipped the ship-ready Wave-0 spearhead from packet 028's research
> roadmap: additive, reversible, no-benchmark changes across four retrieval subsystems. 11 of 13
> candidates shipped. 2 were dropped mid-sequence after an adversarial review caught a regression or
> a false premise. The authoritative candidate roster is [`spec.md`](./spec.md) §14 CANDIDATE STATUS.
> The shipped-vs-deferred split is in [`implementation-summary.md`](./implementation-summary.md).
>
> **How each candidate was built.** One candidate at a time: read the seam, implement (codex `gpt-5.5`
> `xhigh` for substantial changes, native opus as fallback, trivial edits done directly), add a focused
> unit test, run typecheck plus build plus the touched suite, run an independent opus adversarial review
> on the higher-risk changes, fix findings, then a scoped commit. The two drops are the review step
> doing its job.
>
> **Candidate numbers are NOT build order.** Candidates 5, 7, 12, 13 were drafted as "(this commit)" in
> the spec while sequencing was still open. Their real landing commits are recorded below. Candidate 6
> never landed at all.

---

## 0. Quick answer - the build sequence

```
 1. 738e118751  fix(deep-research)  candidate 1   Q6-anchor strategy markers
 2. 484b77b589  feat(memory-search) candidate 2   C9 graceful embedder-degrade
 3. bec0eed27f  feat(memory-search) candidates 3+4 ANN tie-stable + C5-B content tiebreak
 4. e1c6a3c793  feat(memory)        candidates 8+9+10 gauges + skip-closed + CAS guard
      └── DROP: candidate 11 (system-kind-exclusion) - live-DB review blocked it
 5. 1c065566fa  docs(030)           reconcile status - record candidate 11 dropped
 6. 65cfcea513  feat(memory-search) candidate 5   C-X1 bonus denominator + C6-A decay clock
      └── DROP: candidate 6 (C4-A idempotency default-on) - handleMemoryUpdate regression
 7. 18c8582e33  refactor(memory)    candidate 7   centralized content-id module
 8. 46812f12a8  feat(deep-loop)     candidate 12  merge order + pool gauges + graceful self-stop
 9. e21caf5de6  feat(code-graph)    candidate 13  RRF-additive rank-time trust
10. ab5459fb6d  docs(030)           full-scope packet docs + closeout
```

> 10 commits in the range. 8 carry candidate code, 2 are docs (the mid-sequence status reconcile and
> the final closeout). The two drops happen inside the code stream, not as commits of their own.

---

## A. The build sequence - commit by commit

Each entry is one commit in order, with what shipped and how it was verified. The verification pattern
is the same throughout: codex implement, opus adversarial review on the risky ones, scoped commit.

### 1. `738e118751` - candidate 1: Q6-anchor strategy markers

**fix(deep-research): add the 7 reducer anchor markers to the strategy template**

The shipped `deep_research_strategy.md` template carried none of the `ANCHOR:*` markers the
deep-research `reduce-state.cjs` reducer requires, so the reducer hard-failed "Missing anchor section
key-questions" on the first reduce after iteration 1. This commit wraps the seven reducer-owned
sections (key-questions, answered-questions, what-worked, what-failed, exhausted-approaches,
ruled-out-directions, next-focus) with their anchor pairs so a freshly-copied strategy file reduces
deterministically. It also scaffolds the 030 implementation packet itself.

**Verified:** the reducer regex matched all seven anchor pairs. Foundation commit for the rest of the
Wave-0 stream.

### 2. `484b77b589` - candidate 2: C9 graceful embedder-degrade

**feat(memory-search): graceful embedder-degrade to lexical instead of empty**

When the embedder returned a null or empty embedding, the search pipeline threw internally and the
error was swallowed to empty candidates. This commit degrades to lexical (BM25/FTS) candidate
generation and reports `embedder_available:false` / `vector_search_skipped:true` instead. The
embedder-success happy path stays byte-identical. A documented in-scope addition (benign, zero live
blast radius because every caller pre-validates) turns pre-existing input throws into a typed
`Stage1InputError` that propagates to the caller, plus a defensive handler-level concept guard.

**Verified:** tsc plus build pass. 440 search/pipeline tests pass (2 pre-existing unrelated failures
confirmed identical on baseline via stash), plus a new 5-case `stage1-embedder-degrade` vitest and a
gate-d envelope assertion. Independent opus adversarial review returned SHIP (degrade traced to BM25, happy
path byte-identical via `git diff -w`, metadata plumbed through cache).

### 3. `bec0eed27f` - candidates 3 and 4: ANN tie-stable ORDER BY plus C5-B content tiebreak

**feat(memory-search): content-derived deterministic tiebreaks (ANN + RRF/comparator)**

Ties on the primary ranking key were resolved by DB row-iteration order or float noise, so which rows
survived a LIMIT into fusion was unstable run to run. Two content-derived stable tiebreaks land here,
both leaving the primary ordering untouched. ANN appends `, m.id ASC` to the four ranked
`ORDER BY distance` queries so equal-distance rows order stably (candidate 3). RRF plus the
deterministic comparator tiebreak on `content_hash` ASC (COALESCE to canonical id) after the unchanged
primary score, applied to the ranking-contract comparator and all five RRF output sorts (candidate 4).
The tiebreak is content-derived so it stays stable across re-imports rather than rowid-incidental.
Only exact ties change. Non-tied ordering is byte-identical.

**Verified:** tsc plus build pass. 40 targeted determinism tests plus 303 ranking/search tests pass.
The three broad-batch failures (adaptive-ranking e2e shadow-replay, embedder socket timeout,
memory-save dry-run) were confirmed pre-existing on baseline via stash.

### 4. `e1c6a3c793` - candidates 8, 9, 10: enrichment gauges, skip-closed sweep, constitutional CAS guard

**feat(memory): constitutional CAS guard + enrichment gauges + skip-closed sweep hygiene**

Three small independent Memory MCP hardening candidates batched into one commit. The constitutional
self-edit / CAS guard on `memory_update` adds an unconditional assertion that rejects an edit removing
a constitutional row's own protection (`E_CONSTITUTIONAL_SELF_EDIT`), plus an optional `expectedHash`
compare-and-swap that rejects a stale-read overwrite (`E_STALE_CONSTITUTIONAL_UPDATE`). The
non-constitutional update path stays byte-identical and `expectedHash` is an additive optional tool
param (candidate 10). The enrichment gauges expose pending plus failed counts off the existing
`post_insert_enrichment_status` aggregation with no new state (candidate 8). The skip-closed sweep adds
`AND invalid_at IS NULL` to the frontmatter promoter cleanup so it skips already temporally-closed
causal edges (candidate 9, defensive).

**Verified:** tsc plus build pass. 114 search/crud/schema/health/promoter tests pass. Independent opus
review returned candidate 10 SHIP (the security-critical self-edit block is unconditional and correct,
and the CAS opt-in plus a now-dead downgrade-audit branch are P2 polish).

> **DROP - candidate 11 (M-system-kind-exclusion).** This commit was supposed to carry a fourth
> candidate that excluded `source_kind='system'` rows from default recall on the premise that they were
> substrate noise. The opus review checked the live 734 MB database and disproved the premise:
> `source_kind='system'` is 9,592 canonical spec-docs including 29 constitutional rules, not noise. The
> cheap predicate would have hidden roughly 49% of recall. The candidate was pulled from the batch and
> deferred to Wave-1, which needs a real substrate signal plus a constitutional/spec-doc short-circuit
> plus live-DB validation before any default filtering.

### 5. `1c065566fa` - docs: reconcile candidate status

**docs(030): reconcile candidate status - 1-4/8-10 done, 11 deferred to Wave-1**

A mid-sequence docs commit that records the real branch state in `spec.md` §14: candidates 1-4 and
8-10 committed and reviewed, candidate 11 dropped to Wave-1 with the live-DB evidence, candidates 5, 6,
7, 12, 13 still remaining. This is the spec catching up to the drop that just happened in commit 4.

### 6. `65cfcea513` - candidate 5: C-X1 bonus denominator plus C6-A decay clock

**feat(memory-search): RRF bonus-denominator option + pure rank-time decay clock**

Two determinism/decay primitives, both byte-identical on the default path. C-X1 gives
`fuseResultsMulti` an explicit `bonusOverChannels` option: default `active` reproduces today's
active-channel-count denominator exactly, and opt-in `configured` divides the convergence bonus over
the configured channel set so a zeroed channel does not distort survivors' bonus (the roadmap's
`bonusOverChannels` name was fictional, so this is the real `fuseResultsMulti` API). C6-A makes FSRS
recency decay a pure rank-time function of a caller-supplied `nowMs`, with reinforcement (`trackAccess`)
kept as a separate write event. The default ambient-clock scored output is byte-identical and the
no-timestamp skip guard is restored so C6-A is a pure refactor.

**Verified:** tsc plus build pass. 463 fusion/decay/search tests pass (1 pre-existing adaptive-ranking
failure confirmed on baseline via stash). Independent opus review returned both SHIP with defaults
byte-identical traced arithmetically. Its one finding (a no-timestamp row being newly reinforced) was
fixed by restoring the skip guard before commit.

> **DROP - candidate 6 (C4-A idempotency default-on).** C4-A proposed flipping idempotency receipts on
> by default. The cheap version was to flip `SPECKIT_MEMORY_IDEMPOTENCY` on and trust existing paths.
> When that flip was tried it activated the idempotency/near-dup path on `memory_update` and broke 11
> `handleMemoryUpdate` tests (they pass 55/0 on baseline with the flag off). The roadmap had already
> flagged C4-A as needing deferred-wiring care rather than a clean flip, and the replay leg was
> refuted. The candidate was deferred to Wave-1+, which needs proper save/update-path scoping. Unlike
> candidate 11, candidate 6 never reached a commit at all.

### 7. `18c8582e33` - candidate 7: centralized content-id module

**refactor(memory): centralize content-id hashing into one module (byte-identical)**

Two distinct content-id hashes were computed via duplicated inline SHA-256 code: a content-body hash in
the memory parser and a canonical-field JSON hash in the idempotency receipts. This commit extracts the
shared SHA-256-hex formula into `lib/content-id.ts` while keeping the two identities distinct
(`hashContentBody` for the body hash, `hashCanonicalJson` for the canonical-field hash, preserving
`normalizeForHash`). No emitted hash value changes, so existing rows and receipts stay valid.

**Verified:** tsc plus build pass. 77 memory-crud plus idempotency tests pass, including a byte-identical
parity test that proves the old-formula output equals the refactored output for both hashes.

### 8. `46812f12a8` - candidate 12: Deep-Loop merge order, pool gauges, graceful self-stop

**feat(deep-loop): deterministic merge order + pool gauges + graceful self-stop**

Three fan-out backend improvements, additive with happy-path orchestration unchanged. The merge applies
a deterministic content-derived total-order sort on top of the existing id-or-title dedup so merged
research/review findings order reproducibly across runs (the dedup alone was not a total order). The
pool adds read-side lag/pending/failed counters on its events and final summary without changing
orchestration, and it deliberately does not duplicate the upstream failure classification. The run now
flushes a partial summary marked `stopped:true` on SIGINT/SIGTERM (children died silently before), and
an empty or no-new-findings tick is recorded as valid convergence rather than failure.

**Verified:** `node --check` clean on all three `.cjs`. 58 fan-out unit tests pass. Mutation-checked
(merge-order, gauge, and stopped-marker tests confirmed to fail on injected mutations, then green when
restored). Comment-hygiene plus alignment-drift plus strict spec validation pass.

### 9. `e21caf5de6` - candidate 13: Code-Graph RRF-additive rank-time trust

**feat(code-graph): RRF-additive rank-time trust for impact context (neutral-order-preserving)**

The code-graph impact/neighborhood context ranked callers and callees by raw DB/rowid order and ignored
the confidence plus evidenceClass metadata already carried on edges. This commit blends trust into
ranking as an RRF-additive term, not a score multiplier (a multiplicative-neutral blend was shown to
re-order ties versus the rowid baseline). The formula is
`rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor`, with evidenceClassFactor
EXTRACTED/STRUCTURED 0.01, INFERRED 0.004, AMBIGUOUS 0.002, absent/unknown 0. A neutral edge with no
trust metadata gets reliability 0, so the rankScore preserves the exact baseline order. A trusted edge
gets a bounded additive boost. The boost magnitudes are an unbenchmarked default. The order-stability
gate (neutral equals baseline) is the ship criterion and tuning the magnitudes is a documented
follow-up.

**Verified:** tsc plus build pass. 56 code-graph ranking/impact/gold-battery tests pass, including the
neutral-byte-identical and trusted-boost tests. The 8 full-package failures are unrelated IPC/launcher
sandbox EPERM socket failures plus a pre-existing IPC drift guard. This is the last code commit and was
the spec's flagged needs-benchmark/effort-M item, so it shipped last with the explicit order-stability
check against the rowid baseline.

### 10. `ab5459fb6d` - docs: full-scope packet docs and closeout

**docs(030): full-scope packet docs + closeout (Wave-0 implementation complete)**

The closeout commit authors the Level-3 packet docs covering all 11 shipped plus 2 deferred candidates.
`plan.md` / `tasks.md` / `checklist.md` carry each candidate's implemented/tested/reviewed/committed
evidence, with the two deferred shown as deferred with explicit block reasons rather than disguised as
incomplete. `decision-record.md` records the Wave-0-ship-ready-only scope (028 is research,
implementation deferred), the two drops with evidence (C4-A breaks 11 `handleMemoryUpdate` tests and
system-kind hides 9,592 live spec-docs including 29 constitutional rules), the byte-identical-default
discipline, and the Q4-C1 unbenchmarked-magnitude follow-up. `implementation-summary.md` records the
commits, the per-subsystem verification, the deferred Wave-1 path, and the residual follow-ups.

**Closeout verification:** the combination of all candidate commits is green on the touched-subsystem
suites (666 memory plus 80 code-graph plus 58 deep-loop tests pass). The broad-suite failures were
confirmed pre-existing on baseline `1ecc531431` (IPC/launcher/fixture drift, no 030 candidate-seam
failure). `validate.sh --strict` passed with 0 errors and 0 warnings.

---

## B. The two drops in sequence

The session shipped 11 of 13 candidates. The two it did not ship were caught by the adversarial review
step, in build order:

| Order | Candidate | Where it died | Why | Wave-1 path |
|-------|-----------|---------------|-----|-------------|
| First | **11, M-system-kind-exclusion** | inside batch commit `e1c6a3c793`, recorded by `1c065566fa` | live-DB review found `source_kind='system'` is 9,592 canonical spec-docs incl. 29 constitutional rules, not substrate noise, and the cheap predicate hides ~49% of recall | build a true substrate signal + constitutional/spec-doc short-circuit + live-DB validation |
| Second | **6, C4-A idempotency default-on** | between `1c065566fa` and `65cfcea513`, never committed | flipping `SPECKIT_MEMORY_IDEMPOTENCY` on broke 11 `handleMemoryUpdate` tests (55/0 on baseline with it off) and the replay leg was refuted | scope save/update-path behavior properly before any default flip, with `handleMemoryUpdate` regression gates |

Both drops are deliberate, evidence-backed, and documented as Wave-1 follow-ups. Neither is partial
work left dangling: candidate 11 was pulled from a batch before the batch committed, and candidate 6
never reached a commit.

---

## C. Subsystems touched

The 8 code commits landed across four subsystems plus one deep-research reducer-template fix:

| Subsystem | Path | Candidates landed |
|-----------|------|-------------------|
| Deep Research reducer template | `deep-loop-workflows/deep-research/assets/` | 1 (Q6-anchor) |
| Memory search / ranking | `system-spec-kit/mcp_server` (search pipeline, RRF, decay) | 2, 3, 4, 5 |
| Memory store / hygiene | `system-spec-kit/mcp_server` (CRUD, content-id, gauges, causal sweep) | 7, 8, 9, 10 |
| Deep Loop | `deep-loop-runtime/scripts` (fanout merge/pool/run) | 12 |
| Code Graph | `system-code-graph/mcp_server` (impact context ranking) | 13 |
