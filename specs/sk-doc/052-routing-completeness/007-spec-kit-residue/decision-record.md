---
title: "Decision Record: spec-kit test-surface contract questions"
description: "Eight places where a test and the code it exercises assert opposite contracts, each written up with the evidence for both sides and a recommendation."
trigger_phrases:
  - "decision"
  - "record"
  - "contract question"
  - "test versus code"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/007-spec-kit-residue"
    last_updated_at: "2026-09-03T23:30:00Z"
    last_updated_by: "spec-kit-residue-implementer"
    recent_action: "Ran the suite to completion, split its residue, and recorded the ruling as ADR-009"
    next_safe_action: "Close the packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/bm25-index.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/channel-representation.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/storage/incremental-index.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-residue-decisions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Adjacent findings A1 and A2 are resolved by operator ruling: the tests follow the producer, and no system-deep-loop runtime code is touched."
      - "ADR-001 through ADR-004 and ADR-007 are superseded by 049-memory-decommission: every file they would edit is inside the mcp-server delete."
      - "ADR-005 and ADR-008 sit outside 049 and are implemented."
      - "The daemon recycle is superseded: 049 deletes the launcher, the plugin and the hook concern."
      - "ADR-009 splits the residue: 31 surviving failures grouped by mechanism, 150 plus 3 load failures inside the delete counted and left undiagnosed."
---
# Decision Record: spec-kit test-surface contract questions

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

Each entry below is a place where a test and the code it exercises assert opposite
things, so one of the two has to move. Every one carries the evidence for both
readings and a ruling, because picking a side is a design call and a silent test
edit would hide it.

ADR-001 through ADR-005 are the five contract questions this packet was asked to
decide. ADR-006 through ADR-008 came out of the residue. ADR-009 rules on the
residue itself, once the suite had been run to completion and its failures counted.

Two rules held throughout. A test was never edited to make a red check green, and
where a test asserts the right thing about code that moved, that is recorded as a
finding about the code.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The BM25 default flip

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded |
| **Date** | 2026-09-02 |
| **Deciders** | Operator |

### Resolution (2026-09-02)

**Superseded by `specs/system-speckit/049-memory-decommission`.** The operator's decision
stands as recorded: keep the opt-in default, move BM01 and T037.2, correct the three docs.
None of it is implemented, because all four subject files sit under
`.opencode/skills/system-spec-kit/mcp-server/`, which 049 phase `003-spec-memory-server-removal`
lists as `Delete` (spec.md §3, *Files to Change*, 1,480 files / 453,813 lines). Verified on
disk: `mcp-server/lib/search/bm25-index.ts`, `mcp-server/lib/search/hybrid-search.ts`,
`mcp-server/tests/search-extended.vitest.ts` and `mcp-server/tests/bm25-index.vitest.ts` all
exist and all sit under that prefix. 049 is still `Draft` and unmerged. That does not change
the answer, because editing a tree that is scheduled for deletion buys a green check that the
delete throws away.

---

<!-- ANCHOR:adr-001-context -->
### Context

`isBm25Enabled()` at `mcp-server/lib/search/bm25-index.ts:155-160` returns `false`
when `ENABLE_BM25` is unset. Two tests still assert it returns `true`:
`mcp-server/tests/search-extended.vitest.ts:98-102` (BM01) and
`mcp-server/tests/bm25-index.vitest.ts:413-416` (T037.2).

Commit `9f2efd7ae8d` (2026-07-02), *"031 remediation wave 7 (final) — BM25 default
flip, strict-schemas flag wiring"*, made the change. Its entire code delta is one
line: `if (!value) return true; // enabled by default` became `if (!value) return
false;`. The commit body gives the reason — the old default contradicted the
documented opt-in behavior. The packet's own task row closes the finding with
*"Verified via git diff (1 line)."* No suite was run, which is the whole mechanism of
the breakage.

### Constraints

- `ENABLE_BM25` is overloaded. It gates the in-memory JS engine **and** the
  FTS5-backed keyword lane. `mcp-server/lib/search/hybrid-search.ts:480` returns `[]`
  *before* the `shouldUseSqliteLexicalEngine(db)` branch at `:488`, so the flip also
  removed the FTS5-fed `bm25` channel from RRF fusion — a lane commit `7659ec57789`
  had deliberately preserved when it introduced the opt-in posture through a
  different variable, `SPECKIT_BM25_ENGINE`.
- The bm25 lane carries base weight 0.6 against FTS5's 0.3, per
  `feature-catalog/retrieval/hybrid-search-pipeline.md:31`.
- Both tests `delete process.env.ENABLE_BM25` inside the test body, so setting the
  flag in the ambient environment cannot fix either one.

### What the flag actually explains, measured

Running the four BM25 suites (`bm25-index`, `bm25-security`, `bm25-packed-inmemory`,
`search-extended`) with the flag off and then on:

| Run | Result |
|---|---|
| default, `ENABLE_BM25` unset | 12 failed, 172 passed (184) |
| `ENABLE_BM25=true` | 7 failed, 177 passed (184) |

The flag explains exactly five, and they are **not** the two default assertions. They
are `bm25-security` RD03 through RD06 (`rebuildFromDatabase`) and one
`bm25-packed-inmemory` warmup test — suites that need the engine live and silently
index nothing when it is off.

Seven survive the flag being on, and they split in two:

- **Two are the contract question**: `search-extended` BM01 and `bm25-index` T037.2,
  which assert the default is enabled.
- **Five are a separate defect**: `bm25-index` T038.5 and T039.3 through T039.6.
  `bm25Search` returns nothing through hybrid search, and `combinedLexicalSearch`
  returns no BM25 rows, *even with the engine explicitly enabled*. Deciding the default
  will not move any of these five.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep the opt-in default in the code, move the two tests, reconcile the
three stale docs, and file the lost FTS5 lane as its own defect.

**How it works**: `isBm25Enabled()` keeps returning `false` when `ENABLE_BM25` is
unset. BM01 and T037.2 are rewritten to assert the opt-in contract. The separate
follow-up moves the early return at `hybrid-search.ts:480` below the
`shouldUseSqliteLexicalEngine` branch at `:488`, so the FTS5 keyword lane survives
the flag being off.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep opt-in, move the tests** | Matches the shipped v3.0.1.3 migration note and the manual-testing playbook; does not re-open a closed finding | Three feature-catalog and env-reference docs still say ON and must be corrected in the same change | 8/10 |
| Revert to default-on | Restores the heavier lexical lane immediately; the flip shipped on a diff read alone | Re-breaks a published user-facing contract and re-opens finding 0200 | 5/10 |
| Split the variable | Fixes the real defect: one flag should not gate two lanes | Larger change, new env var to document and migrate | 7/10 |

**Why this one**: the opt-in posture is the newer, user-facing, published contract;
the lane loss is a separable bug that reverting would mask rather than fix.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The code, the changelog, the playbook and the tests finally agree on one default.
- The FTS5 lane regression is named and tracked instead of hiding inside a flag.

**What it costs**:
- Two tests are rewritten, which is a contract change and needs the operator's yes.
  Mitigation: this record is that request.
- Three documents still assert default-ON and become wrong the moment the tests move:
  `references/config/environment-variables.md:205`,
  `feature-catalog/retrieval/hybrid-search-pipeline.md:31`, and
  `feature-catalog/evaluation-and-measurement/bm25-only-baseline.md:29`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Retrieval quality already degraded in production since 2026-07-02 | H | Fix the `hybrid-search.ts:480` ordering as a separate, measured change |
| `ENABLE_BM25` is absent from `mcp-server/ENV-REFERENCE.md`, so the drift test at `tests/env-reference-drift.vitest.ts:291-300` does not cover it | M | Add the variable to the env reference |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two tests are red on every run and the docs contradict each other 3 against 3 |
| 2 | **Beyond Local Maxima?** | PASS | Revert and flag-split were both weighed against keeping the flip |
| 3 | **Sufficient?** | PASS | Two test edits plus three doc corrections; the lane fix is deliberately separate |
| 4 | **Fits Goal?** | PASS | The suite cannot be trusted while a default is asserted two ways |
| 5 | **Open Horizons?** | PASS | Naming the overloaded flag leaves the split available later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp-server/tests/search-extended.vitest.ts:98-102` and
  `mcp-server/tests/bm25-index.vitest.ts:413-416` assert `false`.
- The three documents above state opt-in.
- A separate change reorders `mcp-server/lib/search/hybrid-search.ts:480`.

**How to roll back**: revert the test and doc edits; `isBm25Enabled()` is untouched by
this decision, so no runtime rollback is needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Channel representation and the quality floor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded |
| **Date** | 2026-09-02 |
| **Deciders** | Operator |

### Resolution (2026-09-02)

**Superseded by `049-memory-decommission`.** The decision, keep the filter, move the six
tests, fix their titles, is unchanged and unimplemented. `mcp-server/lib/search/channel-representation.ts`,
`mcp-server/tests/channel-representation.vitest.ts` and `mcp-server/tests/channel-enforcement.vitest.ts`
were all confirmed on disk under the `mcp-server/` prefix that 049 phase 003 deletes. The two
further test files named in Context (`feature-eval-query-intelligence`,
`query-router-channel-interaction`) sit under the same prefix. Spending six assertion edits on
a tree scheduled for deletion returns nothing that survives the delete.

---

<!-- ANCHOR:adr-002-context -->
### Context

`analyzeChannelRepresentation` at `mcp-server/lib/search/channel-representation.ts:78`
filters results below `QUALITY_FLOOR = 0.005` (`:13`) at lines 102-108, **then**
computes under-represented channels at 123-129 from what survived. A channel whose
every result is sub-floor is therefore invisible, and its doc comment at `:66` says
so: *"Only checks channels with results at or above QUALITY_FLOOR."*

Six tests assert the opposite — that a wholly sub-floor channel still promotes a
representative:

- `tests/channel-representation.vitest.ts:114` (T3), `:262-269` (T10), `:393` (T18)
- `tests/channel-enforcement.vitest.ts:293` (T9), `:311` ("reserves top-k slots …
  below the floor")
- `tests/feature-eval-query-intelligence.vitest.ts:171`,
  `tests/query-router-channel-interaction.vitest.ts:284`

No test anywhere asserts the current filter-first behavior.

### Constraints

- The pair has already been reversed twice. `cbf4f4d111c` (2026-06-25) removed the
  floor gate deliberately and updated the tests in the same commit; `01ec95899fd`
  (2026-06-26) rewrote the constant's docstring to call the floor *"a calibration
  anchor, not an active promotion gate"*; `9958975f40c` (2026-07-02) reversed both
  and left the six tests untouched, verified by *"git-diff-verified against each
  dispatch's own self-reported file scope"* — a diff read, not a run.
- The tests contradict themselves. `tests/channel-representation.vitest.ts:248` is
  titled *"quality floor is exact — score 0.005 qualifies, 0.004 does not"* while its
  body at `:267-269` asserts 0.004 promotes. `tests/channel-enforcement.vitest.ts:18`
  still lists *"quality floor prevents low-quality promotions"* as covered.
- Blast radius is small and known: `analyzeChannelRepresentation` has exactly one
  production caller, `channel-enforcement.ts:110`, which has exactly one,
  `hybrid-search.ts:2074`.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: keep the filter-first code, move the six tests, and fix their titles and
file headers in the same edit.

**How it works**: `QUALITY_FLOOR` stays an active promotion gate. Each of the six
assertion bodies is rewritten to expect no promotion from a wholly sub-floor channel,
which is what every surviving sentence in those same files already says.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the gate, move the tests** | Agrees with the constant's docstring, both module doc comments, the feature catalog, and the tests' own titles | Reverses a considered 06-25 design decision a third time | 7/10 |
| Restore promotion below the floor | The tests were last verified by a run, not a diff; the 06-25 rationale (raw RRF scores cluster at 0.01-0.03, so weak-but-real channels sit near the floor) is real | Re-enables a 0.001 noise hit being rescored into mid-range by `normalizePromotedItems` (`channel-enforcement.ts:152-175`) and evicting a genuine result via `reservePromotionsInWindow` (`:177-235`) | 6/10 |

**Why this one**: the precision hazard is concrete and the durable prose is unanimous;
the flipped assertion bodies are the outlier.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One contract instead of two, asserted the same way in code, docs and tests.
- The self-contradicting titles stop teaching the next reader the wrong rule.

**What it costs**:
- Six assertion bodies change. Mitigation: this is a design reversal, so it needs an
  explicit yes rather than a quiet edit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Weak-but-real channels near the floor lose representation, which is what 06-25 set out to fix | M | Re-measure with the floor active before closing; the floor value is one constant |
| A third reversal by a future sweep citing stale prose | M | Whichever side loses, its documentation moves in the same change |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Six tests red across four files since 2026-07-02 |
| 2 | **Beyond Local Maxima?** | PASS | Both directions carry a dated commit and a stated rationale |
| 3 | **Sufficient?** | PASS | Assertion bodies plus their titles and headers; no module change |
| 4 | **Fits Goal?** | PASS | This is the largest single mechanism inside the residue |
| 5 | **Open Horizons?** | PASS | The floor stays one tunable constant |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The six assertion bodies listed in Context, plus
  `tests/channel-representation.vitest.ts:248` and
  `tests/channel-enforcement.vitest.ts:18`.

**How to roll back**: `git revert` the test commit. `channel-representation.ts` is not
touched, so runtime behavior is unaffected either way.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: `enforceSearchTokenBudget`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded |
| **Date** | 2026-09-02 |
| **Deciders** | Operator |

### Resolution (2026-09-02)

**Superseded by `049-memory-decommission`.** The decision to restore `enforceSearchTokenBudget`
and its call site stands, and is not implemented: `mcp-server/handlers/memory-search.ts` and
`mcp-server/tests/memory-search-token-budget.vitest.ts` both sit under the `mcp-server/` tree
049 phase 003 deletes. The handler enforces a budget for a `memory_search` tool that 049 removes
along with the other forty, so the restored code would have no caller after the delete.

---

<!-- ANCHOR:adr-003-context -->
### Context

`enforceSearchTokenBudget` exists nowhere in source or in `dist/`. Its only remaining
occurrences are in `mcp-server/tests/memory-search-token-budget.vitest.ts` (lines 12,
52, 98, 114, 141), where the destructured import resolves to `undefined` and all five
tests die on the first call.

The history is the finding:

| sha | date | what |
|---|---|---|
| `c8c4e79139e` | 2026-08-12 19:48 | added the enforcer and its test, with an ADR and a deep-review remediation reordering feedback telemetry after truncation |
| `e3a66403df2` | 2026-08-13 07:38 | a sync commit that **excluded** `memory-search.ts`, saying its staged diff *"deleted the whole token-budget-enforcement block … and independently looked like a real regression, not just a style violation"* |
| `0194a385218` | 2026-08-13 08:30 | restored the **test** file but not the handler code |
| `947f8a6b58e` | 2026-08-13 12:42 | landed the excluded deletion under the subject *"chore: land accumulated cross-session WIP (additive, no deletions)"* |

That subject's additivity claim is file-level: 1109 new files, zero file deletions. It
says nothing about content removed inside the 1032 modified files, and
`handlers/memory-search.ts` was one of them.

### Constraints

- There is a dispatch-level cap, but it is not a replacement.
  `context-server.ts:1212` calls `enforceEnvelopeResultBudget` against a 3500-token
  budget — and `git show c8c4e79139e~1` proves it already existed before the handler
  enforcer was added, so nothing was moved. The two coexisted by design; that
  commit's ADR-005 says the handler enforcer was *"kept independent after verifying it
  uses a different truncation strategy."*
- Four gaps the dispatch enforcer cannot close: it never trims below
  `ENVELOPE_RESULT_DISPLAY_FLOOR = 10` rows (`context-server.ts:503`); it bails on a
  single oversized result (`:551`); it drops tail-first rather than lowest-score-first;
  and it runs after `handleMemorySearch` has already logged implicit `search_shown`
  feedback, which is the exact bug the deleted call site addressed.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: restore the code and keep the test unchanged.

**How it works**: revert the `handlers/memory-search.ts` portion of `947f8a6b58e` —
re-add `enforceSearchTokenBudget`, its `layer-definitions` and `estimateTokens`
imports, its `__testables` entry, and the call before the
`isImplicitFeedbackLogEnabled()` block at what is now `:2273`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Restore the code** | Completes the restore `0194a385218` intended; a prior commit already called the deletion a regression on the record | Re-adds ~100 lines to a large handler | 9/10 |
| Delete the test | Smallest diff | Writes an accidental deletion down as the specification, and `memory_search` keeps silently exceeding its budget | 2/10 |

**Why this one**: the deletion was identified as a regression by the commit that
refused to take it, and landed four hours later inside a sweep that was not reviewing
content.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- `memory_search` enforces its own token budget again, lowest-score-first.
- Implicit `search_shown` feedback records only the rows actually returned.

**What it costs**:
- Responses that currently over-return will shrink. Mitigation: that is the intended
  contract, and `meta.tokenBudgetEnforcement` makes each truncation visible.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The restored code has drifted from the surrounding handler in three weeks | M | Restore from `git show c8c4e79139e` and run the five tests as the gate |
| Double truncation with the dispatch enforcer | L | Different strategies by design; ADR-005 of the original commit already examined this |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Five tests fail and the budget is unenforced in the handler |
| 2 | **Beyond Local Maxima?** | PASS | The dispatch-level cap was examined and found not to cover four cases |
| 3 | **Sufficient?** | PASS | A scoped revert of one commit's one file |
| 4 | **Fits Goal?** | PASS | The test is right and the code moved; that is the definition of a code finding |
| 5 | **Open Horizons?** | PASS | Restores the documented design rather than inventing one |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `mcp-server/handlers/memory-search.ts` regains the function, two imports, the
  `__testables` entry, and one call site.

**How to roll back**: revert that single commit; the five tests return to red, which is
the state before this decision.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The `anchor_id` fixture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded |
| **Date** | 2026-09-02 |
| **Deciders** | Operator |

### Resolution (2026-09-02)

**Superseded by `049-memory-decommission`.** Adding the five scope columns to `makeTestDb()`
remains the right call for the fixture, and is not implemented:
`mcp-server/tests/incremental-index-move-reconcile.vitest.ts` and the module it exercises,
`mcp-server/lib/storage/incremental-index.ts`, are both inside the `mcp-server/` delete. The
`memory_index` table the fixture replicates is the memory database 049 removes outright.

---

<!-- ANCHOR:adr-004-context -->
### Context

Six tests in `mcp-server/tests/incremental-index-move-reconcile.vitest.ts` fail with
`SqliteError: no such column: anchor_id`.

`makeTestDb()` at `:53-71` creates a `memory_index` with nine columns: `id`,
`spec_folder`, `file_path`, `canonical_file_path`, an optional `document_type`,
`file_mtime_ms`, `content_hash`, `embedding_status`, `updated_at`.

`reconcileMoves` at `mcp-server/lib/storage/incremental-index.ts:832-835` builds its
SELECT like this:

```
const docTypeAvailable = hasDocumentTypeColumn();
const selectSql = docTypeAvailable
  ? `SELECT id, document_type, anchor_id, tenant_id, user_id, agent_id, session_id FROM memory_index …`
  : `SELECT id, anchor_id, tenant_id, user_id, agent_id, session_id FROM memory_index …`;
```

It probes for exactly one optional column and selects five others unconditionally. The
real table has all six — the shipped `memory_index` carries 71 columns including
`anchor_id`, `tenant_id`, `user_id`, `agent_id` and `session_id` — so the fixture is
behind the schema, not ahead of it.

### Constraints

- The tolerant shape is already local. `hasDocumentTypeColumn()` at `:119` runs
  `PRAGMA table_info(memory_index)` and is the established precedent in this same
  file; the scope columns were added to the SELECT later without extending it.
- Git archaeology is unavailable. Both files' histories collapse to the squashed
  `cc77a1e550a` kebab-case migration, so the commit that added the scope columns
  cannot be dated on this branch.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: make the fixture current — add the five scope columns to `makeTestDb()` —
and leave the production SELECT unconditional.

**How it works**: the fixture gains `anchor_id`, `tenant_id`, `user_id`, `agent_id` and
`session_id`, matching the real table. The six tests then exercise the production query
as written instead of a narrower replica of it.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Make the fixture current** | The fixture becomes a truthful replica; no runtime change and no new probe on a hot path | Every future column addition needs the fixture updated, which is how this drifted | 8/10 |
| Extend `hasDocumentTypeColumn` into a general probe | Tolerant of any partial table; matches the local precedent | Adds a `PRAGMA` per column to a reconcile path, and tolerating a missing `anchor_id` in production would hide a real schema failure | 6/10 |
| Both | Belt and braces | The tolerance would never fire once the fixture is right; unearned code | 4/10 |

**Why this one**: the columns exist in every real database. A probe that can only ever
be false in production is a branch nobody exercises, and the drift is a fixture problem.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Six tests go green against the real query rather than a subset of it.
- The fixture stops being a second, narrower schema definition.

**What it costs**:
- The fixture must track `memory_index` additions. Mitigation: only columns this
  SELECT names matter, and the failure mode is loud.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Other fixtures in the tree carry the same drift | M | Recorded as an adjacent finding, not fixed here |
| A genuinely partial table in production would now throw rather than degrade | L | It would throw today too; nothing changes at runtime |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Six tests red on every run |
| 2 | **Beyond Local Maxima?** | PASS | The probe route is real and was weighed against the fixture route |
| 3 | **Sufficient?** | PASS | Five column declarations in one helper |
| 4 | **Fits Goal?** | PASS | Restores a test to exercising the production query |
| 5 | **Open Horizons?** | PASS | The probe remains available if a partial table ever appears |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `mcp-server/tests/incremental-index-move-reconcile.vitest.ts:53-71` gains five
  column declarations.

**How to roll back**: revert the fixture edit; the six tests return to red.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The `coverage-graph` test files

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Operator |

### Resolution (2026-09-02)

**Implemented.** Nothing here is inside 049: the four test files live under
`system-spec-kit/scripts/tests/`, and the repoint target
`.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/` belongs to `system-deep-loop`,
which 049 spec.md §3 names as out of scope. See the Outcome section below.

---

<!-- ANCHOR:adr-005-context -->
### Context

Test files under `system-spec-kit/scripts/tests/` import
`../../mcp-server/lib/coverage-graph/*.js`, which does not exist. The import is a
static top-level ESM import, so the module load fails and the file collects zero
tests — it reports as an errored file, not as a skip. There is no guard and no
`describe.skip` anywhere in the family.

The affected files, and what each imports:

| File | Broken import | Also imports |
|---|---|---|
| `coverage-graph-integration.vitest.ts:32` | `lib/coverage-graph/coverage-graph-db.js` | five live `scripts/lib/coverage-graph-*.cjs` |
| `coverage-graph-cross-layer.vitest.ts:22,27,32` | `coverage-graph-{db,query,signals}.js` | the same live CJS layer |
| `graph-convergence-parity.vitest.ts:11` | `coverage-graph-signals.js` | — |
| `session-isolation.vitest.ts:18-21` | `coverage-graph-db.js` **and** `handlers/coverage-graph/{query,status,convergence}.js` | — |

The decisive fact: **the subject was never deleted, it was moved.** Commit
`107c522599d` (2026-05-22), *"deep-loop FULL_ISOLATE transition — lib mv + script
shims + MCP removal + YAML cutover"*, shows `R098`/`R099`/`R100` renames of the three
`lib/coverage-graph/*.ts` modules out of the memory server, and `D` deletions of five
`handlers/coverage-graph/*.ts`. `6323b843425` (2026-07-08) moved them again to their
current home, `system-deep-loop/runtime/lib/coverage-graph/`. Every symbol the three
`lib`-importing files need is still exported there.

### Constraints

- The five `handlers/coverage-graph/*` modules `session-isolation.vitest.ts` imports
  were deleted deliberately, with *"no backward-compat aliases per user directive"* in
  the commit body. There is no relocated equivalent.
- These are the only tests guarding the CJS-to-TS parity contract that
  `scripts/lib/coverage-graph-convergence.cjs:2` still asserts in live source:
  *"sourceDiversity is an adapter replicating the MCP handler's canonical algorithm.
  Do not diverge."* That comment names the pre-move path and is itself stale.
- No npm script and no CI workflow names any of these files; they are collected by
  glob only.
- The two files under `mcp-server/tests/archive/` are separately dead by config
  exclusion, import only `vitest`, and should be left alone.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: repoint the three `lib`-only importers, and treat
`session-isolation.vitest.ts` as the delete candidate.

**How it works**: `coverage-graph-integration.vitest.ts`,
`coverage-graph-cross-layer.vitest.ts` and `graph-convergence-parity.vitest.ts` change
their import specifier to `../../../system-deep-loop/runtime/lib/coverage-graph/*`.
`session-isolation.vitest.ts` loses the describes that depend on the retired handler
surface; its `coverage-graph-db` imports can be repointed like the others.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Repoint the importers** | The subject is alive and exports every symbol; one line per import; restores the only parity check on a contract live source still asserts | The files have been dark for three and a half months, so they may surface real drift | 9/10 |
| Delete all of them | Smallest diff; nothing depends on them | Discards the only guard on a "do not diverge" contract and 46 assertions that would have to be re-derived | 3/10 |
| Restore the deleted handlers | Would make `session-isolation.vitest.ts` whole | Resurrects an MCP surface retired on an explicit directive | 1/10 |

**Why this one**: a move is not a decommission. The `lib` half was renamed, not
removed; only the `handlers` half was actually decommissioned, and only one file
depends on it.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The CJS-to-TS parity contract is checked again after three and a half months dark.
- Errored files stop being counted as failures with no diagnosis.

**What it costs**:
- Repointing may surface genuine drift that accumulated while the tests were dark.
  Mitigation: that is the point of restoring them, and it should be expected rather
  than treated as a regression from the repoint.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The repointed tests fail on real drift | M | Triage as its own finding; do not weaken the assertions |
| `scripts/lib/coverage-graph-convergence.cjs:2` and six docs still print the pre-move path | L | The `.cjs` comment pointer was repaired 2026-09-03 (A3). The six docs remain recorded, not fixed |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four files collect zero tests and report as failures |
| 2 | **Beyond Local Maxima?** | PASS | Delete, repoint and restore were each weighed |
| 3 | **Sufficient?** | PASS | One import specifier per file, plus one scoped deletion |
| 4 | **Fits Goal?** | PASS | Turns four unexplained red files into either coverage or a clean removal |
| 5 | **Open Horizons?** | PASS | Leaves the retired MCP surface retired |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Three import specifiers under `system-spec-kit/scripts/tests/`.
- `session-isolation.vitest.ts` loses its handler-dependent describes.

**How to roll back**: revert the import edits; the files return to failing at load,
which is the state before this decision.
<!-- /ANCHOR:adr-005-impl -->

### Outcome

**What changed**: the three `lib`-only importers now resolve
`../../../system-deep-loop/runtime/lib/coverage-graph/*`, and
`scripts/tests/session-isolation.vitest.ts` was deleted, its `handlers/coverage-graph/*`
imports name modules retired on an explicit no-aliases directive, with no relocated
equivalent.

**Before** (`vitest run` on the four files): 4 test files failed at module load,
`Tests  no tests`. Each errored with `Cannot find module '../../mcp-server/lib/coverage-graph/…'`.

**After** (`vitest run` on the three repointed files): `Test Files  1 failed | 2 passed (3)`,
`Tests  2 failed | 47 passed (49)`. Forty-seven assertions that had been dark for three and a
half months now run.

**The two remaining failures are the drift this ADR predicted**, both in
`coverage-graph-cross-layer.vitest.ts`, and neither was papered over:

1. *"handles empty graphs without errors in both layers"*, the test expects
   `claimVerificationRate: 0` for an empty graph.
   `computeResearchClaimVerificationRateFromData` returns `1.0` when there are no CLAIM nodes
   (`system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:599`). Vacuous truth
   against a zero floor: one of the two is wrong and it is a contract question, not a typo.
2. *"keeps research data invisible to review queries in the same spec folder"*, the test
   expects a FILE node with no **outgoing** COVERS/EVIDENCE_FOR edges to be a gap.
   `getCoverageGapRequirements` now defines the review requirement as a FILE with no
   **incoming** COVERS (`coverage-graph-query.ts:286`). The fixture's FILE does have an
   incoming COVERS, so no gap is reported. The direction was inverted deliberately at some
   point, a dimension covers a file, not the reverse, which makes the test the stale side.

Both producers live in `system-deep-loop/runtime/lib/coverage-graph/`, outside this packet's
frozen scope, and this ADR's own risk row says to triage such drift as its own finding rather
than weaken an assertion. They were recorded in Adjacent Findings below and left red.

**Resolved 2026-09-03 by operator ruling: the tests follow the producer, and no runtime code
is touched.** Both producers were read before either expectation moved, and both document the
behaviour the tests were contradicting. `computeResearchClaimVerificationRateFromData` carries
a doc comment saying an empty claim set is a vacuous pass returning `1.0`, because scoring it
`0` raises a blocker no unverified claim can ever clear and loops a converged graph forever.
`getCoverageGapRequirements` pairs `{ DIMENSION, outgoing }` with `{ FILE, incoming }`, and the
runtime's own `tests/unit/coverage-graph-query.vitest.ts:182` asserts that direction under the
title *"findCoverageGaps treats incoming COVERS edges as FILE coverage in review graphs"*. The
cross-layer fixture's single `review-dimension --COVERS--> review-file` edge therefore satisfies
both requirements at once, so the correct expectation is no gap. Neither assertion was loosened:
each states the current contract, with the reason in a one-line comment beside it. The empty-graph
test was renamed to name the convention it checks. The isolation test kept its title, which
describes namespace isolation rather than the gap rule and is still accurate. Verified green:
`Test Files 4 passed (4)`, `Tests 60 passed (60)`, exit 0, with the runtime's own coverage-graph
suite unchanged at `Tests 42 passed (42)`, exit 0.

<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The `clearBudget` infinite loop (implemented)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Operator |

### Resolution (2026-09-02)

**Already shipped in `59a597e37d`, before the 049 question arose.** Its subject,
`mcp-server/lib/enrichment/retry-budget.ts`, is inside the tree 049 phase 003 deletes, so the
fix is short-lived, but it was the reason the suite could not complete, and it was already
landed when this packet re-read the ADRs against 049. Nothing further to do.

---

<!-- ANCHOR:adr-006-context -->
### Context

The suite was believed not to complete because a long-lived worker accumulated cost
until it spun in a Map-delete rehash storm, with the module it stopped on innocent.
That is not what happens. Sampling the spinning worker gave the stack:

```
Builtins_MapPrototypeDelete
  → Runtime_MapShrink
    → OrderedHashTable<OrderedHashMap,2>::Rehash
      → OrderedHashTable::Allocate → NewFixedArrayWithFiller → GC
```

Bisecting the 36 modules that never reported in the stalling shard found exactly one
that never returns: `mcp-server/tests/retry-budget.vitest.ts` (exit 124 at a 90-second
bound; the other 35 all finished, the slowest in 4 seconds).

The producer is `mcp-server/lib/enrichment/retry-budget.ts:112`:

```ts
for (const budgetKey of retryBudget.keys()) {
  const entry = retryBudget.get(budgetKey);
  if (entry?.memoryId === memoryId) retryBudget.delete(budgetKey);
}
```

`retryBudget` is a `BoundedMap`, and `BoundedMap.get` at
`mcp-server/lib/memory/bounded-cache.ts:39-48` maintains LRU recency by
`super.delete(key); super.set(key, value)`. Reading a **non-matching** key inside a live
`keys()` iteration therefore moves it to the end of that iteration, so the loop never
reaches the end. Every pass performs a delete and a set, which is the rehash storm.

### Constraints

- The loop terminates only when every entry matches, so it is invisible whenever a
  single memory has a retry budget. The test at `tests/retry-budget.vitest.ts:72`
  seeds memories 51 and 52 and clears 52, which is the hanging shape.
- It is not test-only. `mcp-server/handlers/save/post-insert.ts:499` calls
  `clearBudget(id)` on the live save path.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: snapshot the entries before iterating, and stop reading through the
recency-touching accessor.

**How it works**: `clearBudget` now iterates `Array.from(retryBudget.entries())`.
`entries()` is the base `Map` iterator, which `BoundedMap` does not override, so it
does not reorder; `Array.from` fixes the sequence before any deletion.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Snapshot the entries** | Three lines; identical semantics; removes the loop entirely | None found | 10/10 |
| Stop the LRU touch in `BoundedMap.get` | Would fix every caller with this shape at once | Breaks LRU recency, which is the class's whole purpose, for every other user | 2/10 |
| Skip the file in the suite | Cheapest | Leaves a hang on the production save path | 0/10 |

**Why this one**: the bug is iterating a live LRU while touching it, not the LRU.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The save path can no longer hang at 100% CPU when clearing one memory's budget while
  another memory has one.
- The test suite completes.

**What it costs**:
- One array allocation per call, bounded by the map's 2,000-entry cap.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Other call sites iterate a `BoundedMap` while reading through `get` | M | Recorded as an adjacent finding to sweep separately |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A production function does not terminate |
| 2 | **Beyond Local Maxima?** | PASS | The `BoundedMap` route was weighed and rejected |
| 3 | **Sufficient?** | PASS | Three lines in one function |
| 4 | **Fits Goal?** | PASS | It is the reason the suite could not finish |
| 5 | **Open Horizons?** | PASS | Leaves `BoundedMap` semantics intact |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `mcp-server/lib/enrichment/retry-budget.ts` `clearBudget`.

**How to roll back**: revert that hunk. The suite returns to hanging, so this is not a
rollback anyone should want.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: The isolation guard against the default-resolver tests

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded |
| **Date** | 2026-09-02 |
| **Deciders** | Operator |

### Resolution (2026-09-02)

**Split, and nothing survives to implement.** The two halves land on opposite sides of 049.

- The five failing tests are `mcp-server/tests/memory-roadmap-flags.vitest.ts` (three) and
  `mcp-server/tests/db-lifecycle-paths.vitest.ts` (two). Both files sit under the `mcp-server/`
  prefix 049 phase 003 deletes, so all five assertions go with the tree.
- `.opencode/skills/system-spec-kit/shared/paths.ts` survives the delete, it is outside
  `mcp-server/` and 049 does not name it. But `resolveDatabaseDir` resolves the memory
  **database** directory, and that database is exactly what 049 decommissions. The surviving
  file has no surviving subject.

So the injectable base directory would be added to serve five tests that will not exist, on a
resolver whose product will not exist. The decision text stays on the record for the case where
049 is abandoned. It is not implemented now.

---

<!-- ANCHOR:adr-007-context -->
### Context

Five tests across two files fail with
`ProductionDatabaseResolutionError: Refusing to resolve the production database
directory in a test context`.

`shared/paths.ts:89-105` throws that error whenever `isTestContext()` is true and the
resolved directory is the production one. `isTestContext()` (`:67-77`) reads `VITEST`,
`NODE_ENV`, `SPECKIT_TEST` and `globalThis.__vitest_worker__`, so it is true for the
whole suite.

The five tests delete the db-dir environment variables **on purpose**, because the
behavior they exercise is the default resolution path:

- `tests/memory-roadmap-flags.vitest.ts:116` — "uses the shared database directory
  resolver when db-dir env vars are unset"
- `tests/memory-roadmap-flags.vitest.ts:129` — "rejects repo-local database symlinks
  that realpath outside allowed roots", which now gets the refusal instead of the
  `outside the allowed` error it asserts
- `tests/memory-roadmap-flags.vitest.ts:141` — "refreshes exported database path
  bindings when env overrides arrive after import"
- `tests/db-lifecycle-paths.vitest.ts:91` and `:95` — the same shape

These fail in isolation, so they are not collateral from another file. Confirmed by
running `tests/memory-roadmap-flags.vitest.ts` alone: 3 failed, 7 passed.

### Constraints

- The guard is correct policy and has its own suite asserting it,
  `tests/production-db-isolation.vitest.ts:74`.
- The third failure is the interesting one: the guard fires *before* the allowed-roots
  check, so a test about a different refusal can no longer reach its own assertion.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: give the resolver an injectable base directory so the default path can be
exercised against a throwaway root, rather than weakening the guard or deleting the
tests.

**How it works**: `resolveDatabaseDir()` takes the production root from a parameter
that defaults to today's value. The five tests pass a temp root, which exercises the
same resolution logic without ever naming the production directory. The guard is
untouched.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Inject the base directory** | Keeps the guard fail-closed and restores five real assertions | A production signature changes to serve a test | 7/10 |
| Rewrite the tests to assert the refusal | No production change | Deletes coverage of the default resolver and of the allowed-roots refusal; writes the collision down as the specification | 3/10 |
| Exempt these files from `isTestContext()` | Smallest | An exemption list is exactly how a fail-closed guard stops being fail-closed | 1/10 |

**Why this one**: the tests assert real behavior and the guard is real policy. Only a
seam change lets both stand.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Five assertions come back, including one about a refusal the guard currently masks.

**What it costs**:
- A production signature grows a parameter. Mitigation: default it, so no caller moves.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The injected root becomes a way to bypass the guard in production | M | Default the parameter and assert the default in `production-db-isolation.vitest.ts` |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Five tests red, one of them unable to reach its own assertion |
| 2 | **Beyond Local Maxima?** | PASS | Rewriting the tests and exempting the files were both weighed |
| 3 | **Sufficient?** | PASS | One defaulted parameter |
| 4 | **Fits Goal?** | PASS | Neither side is wrong, so only a seam change resolves it |
| 5 | **Open Horizons?** | PASS | The guard stays fail-closed by default |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `shared/paths.ts` `resolveDatabaseDir` and its callers in the five tests.

**How to roll back**: revert; the five tests return to red.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: The CLI-authority fixture and its repo-tree writes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Operator |

### Resolution (2026-09-02)

**Implemented.** `scripts/memory/generate-context.ts` is outside 049's delete list, 049 phase
001 *creates* under `scripts/memory/`, and phase 003's Files-to-Change table names nothing in
`scripts/`. 049's own open question about what replaces the save-path metadata refresh leaves
this entry point in play rather than scheduled for removal. See the Outcome section below.

---

<!-- ANCHOR:adr-008-context -->
### Context

Seven tests in `scripts/tests/generate-context-cli-authority.vitest.ts` fail with
`process.exit unexpectedly called with "1"`. The real error is on stderr:

```
Spec packet write blocked for "system-spec-kit/022-hybrid-rag-fusion":
collision class is divergent-duplicate (no readable packet roots).
```

The mechanism is `scripts/core/spec-root-collision-classifier.ts:146`. When a packet is
present in neither root, every allow branch falls through and it returns
`divergent-duplicate` / `reject` — deliberate, and covered by its own test at
`scripts/tests/spec-root-write-guard.vitest.ts:84`. The classifier is behaving as
specified.

What moved is the fixture. The test names
`.opencode/specs/system-spec-kit/022-hybrid-rag-fusion`; the packet now lives at
`specs/system-speckit/z_archive/022-hybrid-rag-fusion`. This is the same track rename
that broke the Gate 3 classifier fixture and two fixture-file paths, all four repaired
in this pass.

This one was **not** repaired, and that is the decision. `main()` does not stop at the
write guard. It goes on to `acquireCanonicalSaveLock`
(`scripts/memory/generate-context.ts:524`), which creates a `.canonical-save.lock`
directory **inside the packet**, and then to `updatePhaseParentPointersAfterSave`
(`:623`), which writes `derived.last_active_child_id` into the parent's
`graph-metadata.json`. Only `runWorkflow`, `loadCollectedData` and
`collectSessionData` are mocked; neither of those two is.

So repointing the fixture at the packet's real current location would make seven tests
green by having them mutate the repository on every run.

### Constraints

- The test cannot be made hermetic from the outside. `applyGate3Satisfaction` and
  `main()` resolve the workspace from `process.cwd()`, and `ClassificationOptions`
  (`shared/gate-3-classifier.ts:74-78`) has no `workspaceRoot` field, so there is no
  seam to inject a temp root through.
- The tests assert argument passthrough into `runWorkflow`. The packet identity is
  incidental fixture data, so no assertion has to change either way.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: give `main()` an injectable project root, then point the fixture at a
temp workspace.

**How it works**: `main()` accepts the project root the way it already accepts `argv`
and `stdinReader` — as a defaulted parameter. The test builds a throwaway packet under
a temp root and passes it, so the lock and the pointer update land in the temp tree.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Inject the project root** | Hermetic; immune to the next rename; no repository writes | A production entry point grows a parameter | 8/10 |
| Repoint at the packet's current location | One-line change, and it is what the other three fixtures needed | Restores a lock directory and a metadata write into a real archived packet on every run | 4/10 |
| Mock the write guard and the lock in the test | No production change | Mocks away the very code path under test; the next drift would be invisible | 3/10 |

**Why this one**: the one-line repoint is only cheap because the side effect is
invisible, and it was invisible last time too, which is how this stayed unnoticed.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- Seven assertions return, and the suite stops depending on the shape of the real
  `specs/` tree.

**What it costs**:
- One defaulted parameter on `main()`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The temp packet does not reproduce the real classifier inputs | M | Build it with the same helper shape the Gate 3 suite already uses for temp packets |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Seven tests red |
| 2 | **Beyond Local Maxima?** | PASS | The cheap repoint was costed and rejected on its side effect |
| 3 | **Sufficient?** | PASS | One defaulted parameter plus a temp fixture |
| 4 | **Fits Goal?** | PASS | Removes a whole class of rename-driven breakage |
| 5 | **Open Horizons?** | PASS | Nothing else has to move |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `scripts/memory/generate-context.ts` `main()` signature.
- `scripts/tests/generate-context-cli-authority.vitest.ts` fixture setup.

**How to roll back**: revert; the seven tests return to red, which is today's state.
<!-- /ANCHOR:adr-008-impl -->

### Outcome

**What changed**: `main()` in `scripts/memory/generate-context.ts` takes a third defaulted
parameter, `projectRoot: string = CONFIG.PROJECT_ROOT`, and binds `CONFIG.PROJECT_ROOT` to it
before parsing. That one assignment is enough because every downstream resolver already reads the root from
`CONFIG`: `resolveSpecFolderCanonical`, `assertSpecWriteAllowed`,
`resolveExistingSpecFolderPath` and `getSpecsDirectories`. The module documents that object as
mutable runtime config. Threading a parameter through four exported helpers instead would have
widened the change for no gain. The default keeps production behavior byte-identical.

`scripts/tests/generate-context-cli-authority.vitest.ts` now builds a throwaway workspace per
test, `specs/system-spec-kit/022-hybrid-rag-fusion` with a `spec.md`, plus a track-level
`graph-metadata.json`, under `os.tmpdir()`, passes that root to `main()`, and removes it
afterwards. The track-level metadata is required rather than decorative: a track folder holding
`NNN-` children is a phase parent, so the save path rewrites its pointers, and a real track
folder carries that file.

**Before**: `Tests  7 failed | 4 passed (11)`, every failure
`process.exit unexpectedly called with "1"` behind the stderr line
`Spec packet write blocked … collision class is divergent-duplicate`.

**After**: `Tests  11 passed (11)`, exit 0. No lock directory and no metadata write lands in
the repository.

<!-- /ANCHOR:adr-008 -->

<!-- ANCHOR:adr-009 -->
## ADR-009: The residue split, diagnosed against retired

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Operator |

### Resolution (2026-09-03)

**Accepted, and executed as a split.** The suite was run to completion and its residue measured
rather than estimated. Of 181 failing tests, 31 live in trees that survive 049 and each now sits
in a named mechanism group. The other 150, plus 3 files that fail at load and collect no tests,
live under `.opencode/skills/system-spec-kit/mcp-server/`, which 049 phase
`003-spec-memory-server-removal` §3 lists as `Delete`. Those are counted and attributed by file,
and deliberately not diagnosed.

---

<!-- ANCHOR:adr-009-context -->
### Context

Three criteria stood open when the rest of the phase closed. Each named a number taken from an
earlier reading rather than from a run: a suite that could not finish, roughly 115 failures with
a signature and no mechanism, and 25 references to names that do not exist. None of the three
numbers survived contact with a real run.

The sharded runner completed. Twelve shards each reported, the slowest took 409 seconds, and the
whole run took 34 minutes and 0 seconds of wall time over 2,040 seconds of shard time. No shard
exited 124, which is the bound the old single-worker run kept hitting. The totals were
`Test Files 98 failed \| 874 passed \| 16 skipped` and
`Tests 181 failed \| 14744 passed \| 317 skipped \| 1 todo`.

The failures are not spread evenly. Seventy-nine of the 98 failing files are under `mcp-server/`,
18 are under `system-spec-kit/scripts/tests/`, and one is under
`system-deep-loop/runtime/tests/`. The two surviving trees hold 31 of the 181 failures between
them.

The same split governs the untypechecked references. `mcp-server/tsconfig.tests.json` is the only
config in the workspace that type-checks a test file, and its `include` names
`tests/**`, `scripts/tests/**` and `lib/test-helpers/**` relative to `mcp-server/`, so the lane
and everything it covers are inside the delete. The surviving trees exclude their tests from
every config they have: `scripts/tsconfig.json` lists no `tests/` entry at all, and
`system-deep-loop/runtime/tsconfig.json` carries `tests/**/*.ts` in `exclude`.
<!-- /ANCHOR:adr-009-context -->

### Constraints

- 049 is `Draft` and unmerged. That does not change the answer, for the reason ADR-001 already
  gives: a green check inside a tree with a delete order against it is thrown away by the delete.
- 049 phase 003 §3 puts `scripts/spec/` out of scope in writing, and phases 001 and 004 *create*
  under `scripts/`. Nothing in the packet deletes `system-spec-kit/scripts/` or
  `system-deep-loop/runtime/`, so a failure in either tree is work that outlives the decommission.
- Diagnosing a mechanism is not free. Each of the 15 surviving groups took a producer read, and
  several took a reproduction. Spending that on 150 failures whose subject is scheduled for
  deletion buys nothing that the delete does not take back.

### Decision

Group the surviving failures by mechanism, in full. Count and attribute the deleted ones by file
and by the decisions already recorded against them, and do not diagnose them.

Fix the missing references that survive. Record the ones that do not.

### Alternatives Considered

| Option | Why rejected |
|--------|--------------|
| Diagnose all 181 by mechanism | 150 of them describe code with a delete order against it. The diagnosis would be read once and then deleted with its subject |
| Group all 181 by error signature | A signature is a symptom. Six failures reading `no such column: anchor_id` share a signature and, as ADR-004 already established, one mechanism. Grouping by text would have hidden that |
| Estimate rather than run | The estimate this phase inherited said 115. The run says 181. An estimate that is 36 percent low is not a baseline |
| Add a tests typecheck lane to the surviving trees | The two surviving trees report 469 and 283 non-reference type errors between them. A lane turned on today is red on its first run, which is the condition `mcp-server/tsconfig.tests.json` documents as the reason it reports rather than enforces |

### Consequences

- The suite criterion is closed on observation rather than on an assumption, and the observation
  is repeatable with one command.
- Every surviving failure has a mechanism, a count and a worked example, so the next person picks
  a group rather than a file.
- The deleted 150 are recorded as a count with an attribution, not as a diagnosis. If 049 is
  abandoned they come back undiagnosed, which is the same position the phase's five superseded
  ADRs leave their subjects in.
- The reference fixes land in a tree no typecheck lane covers, so they were proven by running the
  files rather than by a gate. Both ran green inside the same sharded run that produced the
  residue.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three criteria were open, and each rested on an unmeasured number |
| 2 | **Beyond Local Maxima?** | PASS | Diagnosing all 181 was costed and rejected against the delete list |
| 3 | **Sufficient?** | PASS | 31 grouped, 153 attributed, 27 references fixed, 21 recorded |
| 4 | **Fits Goal?** | PASS | Same test the phase applied to its eight ADRs, applied to its criteria |
| 5 | **Open Horizons?** | PASS | The 15 groups are independently actionable, and none blocks another |

**Checks Summary**: 5/5 PASS

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- `scripts/tests/tree-thinning.vitest.ts` type import.
- `scripts/tests/progressive-validation.vitest.ts` report type and three declarations.

**How to roll back**: revert both files, and the 27 references return to unresolved, which is today's
state. Neither edit reaches runtime, so a revert changes no behavior.
<!-- /ANCHOR:adr-009-impl -->

### Outcome

**What changed**: `tree-thinning.vitest.ts` adds `FileEntry` to the type import it already takes
from `../core/tree-thinning`, where that name is exported at line 45 as a compat alias of
`ThinFileInput`. Twenty annotations referenced a name the file never imported.

`progressive-validation.vitest.ts` declares the report shape that `progressive-validate.sh --json`
prints. Its producer is a shell script, so no module in the workspace can hold that contract, and
the declaration sits beside the assertions that read it. Resolving the name let the compiler run
definite-assignment analysis on three `let parsed` declarations that are written inside a callback,
so each takes the definite-assignment form.

**Before**: 27 `TS2304` findings across the two files, and 496 type errors in the surviving
`scripts/tests/` tree.

**After**: 0 `TS2304` findings and 469 type errors, which is 496 minus exactly the 27. Both files
contribute zero errors. Both ran green inside the sharded run, `tree-thinning` 28 tests and
`progressive-validation` 52 tests, in shards 10 and 11, after the edits landed.
<!-- /ANCHOR:adr-009 -->

---

---

---

<!-- ANCHOR:daemon-recycle -->
## Daemon recycle, superseded

The residue also raised the daemon-recycle concern: the spec-memory launcher restarts a
long-lived daemon whose worker state is what ADR-006 found spinning. It is **superseded by
`049-memory-decommission`**, and there is nothing left to decide.

049 phase `003-spec-memory-server-removal` §3 *Files to Change* lists all three surfaces as
deletions: `.opencode/bin/system-spec-memory-launcher.cjs` and `spec-memory.cjs` (*"Launcher and
CLI shim"*), `.opencode/plugins/system-spec-memory.js` (*"OpenCode plugin"*), and
`.opencode/hooks/spec-memory/` (*"Hook concern"*). All three were confirmed present on disk on
2026-09-02, and all three are named `Delete`. A recycle policy for a daemon that is being
removed has no subject.
<!-- /ANCHOR:daemon-recycle -->

---

<!-- ANCHOR:adjacent-findings -->
## Adjacent findings

Recorded, not fixed. Each sits outside this packet's frozen scope.

| # | Where | What | Why it is not fixed here |
|---|-------|------|--------------------------|
| A1 | `system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:599` | `computeResearchClaimVerificationRateFromData` returns `1.0` for a graph with no CLAIM nodes. The restored cross-layer test asserted `0` | **Resolved 2026-09-03.** Operator ruling: the test follows the producer. The producer's own doc comment states the convention, so the test now asserts `1` and its title names the vacuous pass |
| A2 | `system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:286` | The review coverage-gap requirement is a FILE with no **incoming** COVERS. The restored test asserted the older **outgoing** COVERS/EVIDENCE_FOR rule | **Resolved 2026-09-03.** Operator ruling: the test follows the producer. The runtime's own `coverage-graph-query.vitest.ts:182` asserts the incoming rule deliberately, so the test now expects no gap for a covered file |
| A3 | `system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:2` | The *"do not diverge"* parity comment named the pre-move MCP handler path | **Resolved 2026-09-03.** Comment-only repair of a dangling pointer, in the file both repaired tests load as the parity subject. No code changed |
| A4 | `system-spec-kit/scripts/tsconfig.json`, `system-deep-loop/runtime/tsconfig.json` | Neither config compiles a test file: the first lists no `tests/` entry in `include`, the second carries `tests/**/*.ts` in `exclude`. The only tests lane in the workspace is `mcp-server/tsconfig.tests.json`, and it covers `mcp-server/` alone | **Measured 2026-09-03, still open.** A lane over the two surviving trees reports 469 and 283 type errors once the 27 missing references are fixed, so switching one on today makes a red gate. `mcp-server/tsconfig.tests.json` documents that exact condition as its reason for reporting rather than enforcing. ADR-009 records the decision |
| A5 | `system-spec-kit/scripts/evals/import-policy-rules.ts:19` | `RELATIVE_INTERNAL_RUNTIME_IMPORT_RE` spells the directory `mcp_server`, and the directory is `mcp-server`, so the arm never matches an import into that directory. Corrected on 2026-09-04 after review: the same alternation also carries `shared`, which does match, so the arm is half-dead rather than dead and the original wording overstated it | Found by grouping the residue. The file survives 049 and its subject does not, exactly like ADR-007. A one-token fix, owned by whoever owns the eval policy |
| A6 | `system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts` | Its temp workspace has no track-level `graph-metadata.json`, so `updatePhaseParentPointer` throws `ENOENT` at `scripts/memory/generate-context.ts:594` | The same defect ADR-008 fixed in its own fixture, in a sibling test that never got the same treatment. Outside this phase's frozen file list |
| A7 | `system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts:14-25` | Three hard-coded paths name `036-deep-loop-innovation/001-deep-loop-market-research` and `.../016-whole-system-gate`. Those children are now `001-research-inputs-and-architecture` and `016-system-deep-loop-review`, so one spawn returns 127 and one read returns `ENOENT` | The same rename-driven breakage class ADR-008's seam change was meant to remove, in a test that reaches for the real tree rather than a root it was handed |
<!-- /ANCHOR:adjacent-findings -->
