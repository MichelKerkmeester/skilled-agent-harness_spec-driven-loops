---
iteration: 1
dimension: correctness
focus: 015-P0 styles-DB foundation (commit bf0986cecd) — atomicity (REQ-001), telemetry residency (REQ-002), oracle parity (REQ-003)
sessionId: fanout-minimax-m3-high-1784606267078-bpkeoi
generation: 1
lineageMode: new
status: complete
filesReviewed:
  - .opencode/skills/sk-design/styles/_db/generation-manifest.mjs
  - .opencode/skills/sk-design/styles/_db/stage-telemetry.mjs
  - .opencode/skills/sk-design/styles/_db/oracle/differential-oracle.mjs
  - .opencode/skills/sk-design/styles/_db/oracle/query-set.mjs
  - .opencode/skills/sk-design/styles/_db/oracle/replay-fixtures.mjs
  - .opencode/skills/sk-design/styles/_db/oracle/relevance-judgments.mjs
  - .opencode/skills/sk-design/styles/_db/__tests__/manifest.test.mjs
  - .opencode/skills/sk-design/styles/_db/__tests__/telemetry.test.mjs
  - .opencode/skills/sk-design/styles/_db/__tests__/oracle.test.mjs
  - .opencode/skills/sk-design/styles/_db/__tests__/judgments.test.mjs
  - .opencode/skills/sk-design/styles/_db/indexer.mjs (lines 1026-1180)
  - .opencode/skills/sk-design/styles/_db/operator.mjs (lines 58-186)
findingsCount: 2
findingsNew: 2
findingsSummary: P0=0, P1=0, P2=2
newFindingsRatio: 0.67
timestamp: 2026-07-21T05:58:00.000Z
durationMs: 180000
---

# Iteration 1 — Correctness on 015-P0 styles-DB (REQ-001, REQ-002, REQ-003)

## Scope

Audit the 015 Phase-0 styles-DB foundation (`bf0986cecd`) for correctness against the three
acceptance requirements in the charter:

- **REQ-001** — manifest publishes atomically (single fsynced pointer flip), rolls back
  correctly, and retention never prunes the current or sole rollback generation.
- **REQ-002** — stage telemetry is residency-honest: a genuine (non-faked) unattributed
  bucket, and native-vs-JS labels that match the actual work each span brackets.
- **REQ-003** — differential oracle proves real byte-for-byte parity across the FULL
  scenario matrix (incl. vector + cursor lanes) at 1x/10x/100x, from goldens captured
  post-change.

Observation-only audit — read code + run the existing tests; no remediation in this
packet.

## Findings

### F1 [P2] — `stage-telemetry.mjs:119` clamps the negative-gap signal

**Severity**: P2 (advisory). **Category**: Correctness / honest accounting.

**Evidence**:
- `.opencode/skills/sk-design/styles/_db/stage-telemetry.mjs:119`:
  `const unattributedMs = Math.max(0, elapsedMs - total);`
- `.opencode/skills/sk-design/styles/_db/__tests__/telemetry.test.mjs:45-47`:
  ```
  assert.ok(summary.unattributedMs >= 0, 'unattributed cost must never be negative');
  assert.equal(summary.unattributedMs, Math.max(0, summary.elapsedMs - summary.total));
  ```

**What this is**: when two spans overlap (concurrent async work bracketed by separate
`recorder.span()` calls), the sum of `latencyMs` can exceed the wall-clock `elapsedMs`.
The `Math.max(0, ...)` clamps the negative to zero, surfacing it as "0 ms unattributed"
rather than a real negative overlap signal.

**Why it's an advisory, not a blocker**: the file header (stage-telemetry.mjs:5-15)
documents the bucket as "the wall time that fell outside every span", which is the
non-overlap residual. When spans overlap, "outside every span" is mathematically
undefined; the current behavior (clamp to zero) is a defensible choice and the test
locks it in. The design contract reads "Work that runs outside every span therefore
surfaces honestly" — overlapping work is *not* outside every span, so the clamp is
consistent with the documented contract.

**No-op recommendation**: nothing for this packet. If the team later wants overlap
visibility, a separate `overlapMs` field would be additive; the existing
`unattributedMs` stays as documented.

### F2 [P2] — `generation-manifest.mjs:251` temp-path has millisecond-scale uniqueness

**Severity**: P2 (advisory). **Category**: Correctness / robustness.

**Evidence**:
- `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs:251`:
  `const temporaryPath = ${pointerPath}.tmp-${process.pid}-${Date.now()};`
- The next line opens with `'wx'` (exclusive create), so a colliding path throws
  `EEXIST` instead of corrupting state.

**What this is**: two `writeManifestPointer` calls in the same process within the same
millisecond will produce identical temp paths; the second `open(..., 'wx')` fails. For
serial publishes (the documented usage), this never matters; only contrived
"two-publishes-per-ms" sequences surface it.

**Why it's an advisory, not a blocker**: production callers serialize through a single
operator queue (`operator.mjs`), so this scenario is not reachable in normal operation.
A monotonic counter or random suffix would harden the contract, but the current shape
is consistent with the rest of the package's PID-based staging naming (see
`indexer.mjs:1055` — same `${pid}-${Date.now()}` pattern).

**No-op recommendation**: nothing for this packet.

## Confirmed-correct claims (negative findings — no defect)

### REQ-001 — atomicity, rollback, retention

- `generation-manifest.mjs:249-271` `writeManifestPointer` writes payload → fsyncs file →
  renames over pointer → fsyncs containing directory. This is the canonical atomic
  publish pattern; the directory fsync is what survives a crash mid-rename.
- `generation-manifest.mjs:121-148` test "an interrupted pointer flip is atomic and
  never leaves a temp file" exercises a `afterRename` hook that throws AFTER the
  rename. The test correctly accepts EITHER outcome (`gen1` or `gen2` pointer) because
  rename is the commit point; post-rename failures do not roll back the pointer.
  Crucially, the test asserts no `.tmp-` files remain (line 146-147).
- `indexer.mjs:1137-1180` `rollbackStyleDatabase` enforces that the rollback target
  resolves inside the database directory, validates `PRAGMA integrity_check`, and
  republishes the pointer atomically. No escape path, no silent partial rollback.
- `operator.mjs:129-155` `pruneStyleDatabaseGenerations` keeps `currentGenerationPath`,
  `rollbackGenerationPath`, AND every artifact referenced by the current manifest.
  Multi-artifact retention is honored because `currentManifestArtifacts` resolves every
  manifest role and adds the absolute paths to the keep set (line 138-140).
- `operator.mjs:81-121` `getStyleDatabaseStatus` exposes the rollback target even when
  no pointer exists (`published: false` case, line 91). The most recent generation is
  offered as the rollback candidate.
- `generation-manifest.mjs:295-307` `pruneManifestGenerations` never removes an
  artifact shared with a retained manifest — verified by
  `manifest.test.mjs:180-203`.
- Live verification: `node --test __tests__/manifest.test.mjs` → **9/9 pass**.

### REQ-002 — telemetry residency honesty

- `stage-telemetry.mjs:19-22` `RESIDENCY` is a frozen enum (`native` | `js-resident`);
  `assertResidency` (line 26-30) rejects any other value at construction time.
- `stage-telemetry.mjs:54-68` `record` produces a frozen record with explicit
  `latencyMs`, `items`, `throughputPerSecond`, `rssDeltaBytes`. There is no "unattributed"
  residency tag — unattributed is a DERIVED field in `summary()`, not a recorded bucket.
- `stage-telemetry.mjs:104-129` `summary` computes `elapsedMs` from a real
  `overall()` window (or the first-span/last-span fallback) and `unattributedMs` from
  the residual. The telemetry claims the residual is genuinely measured.
- `__tests__/telemetry.test.mjs:109-135` test "query telemetry brackets each native SQL
  and JS-resident step in its true bucket" asserts the residency of every bracket on a
  real query (`editorial serif`): `request.fingerprint=JS_RESIDENT`,
  `transaction.begin=NATIVE`, `transaction.commit=NATIVE`,
  `cards.attribution.encode=JS_RESIDENT`, `generation.read=NATIVE`,
  `generation.verify=JS_RESIDENT`, `eligibility.load=NATIVE`,
  `eligibility.facets.load=NATIVE`, `eligibility.facets.assemble=JS_RESIDENT`. The
  residency labels match the work each bracket names.
- `__tests__/telemetry.test.mjs:131-135` asserts the side-channel contract: the query
  DTO is byte-identical with and without telemetry.
- `__tests__/telemetry.test.mjs:137-157` test "the vector lane splits its native fetch
  from JS-resident cosine work" confirms `lane.vector.fetch=NATIVE`,
  `lane.vector.cosine=JS_RESIDENT` for the vector lane.
- Live verification: `node --test __tests__/telemetry.test.mjs` → **9/9 pass**.

### REQ-003 — oracle parity across the FULL scenario matrix at 1x/10x/100x

- `oracle/query-set.mjs:29-42` defines 9 scenarios explicitly covering every required
  lane: `structured-only`, `fts-text`, `facet-filter`, `exclusions`, **`vector-only`**,
  **`hybrid`**, `degraded-disable-fts`, `exact-reuse`, **`paged`** (with a cursor
  `follow` function that exercises the cursor lane).
- `oracle/replay-fixtures.mjs:24` `REPLAY_SCALES = {'1x': 13, '10x': 130, '100x': 1_300}`
  matches REQ-003 verbatim.
- `oracle/replay-fixtures.mjs:70-75` `scaledOracleEmbedder` produces a deterministic
  two-dimensional vector derived from the document bytes (pure hash function), so the
  vector lane reproduces byte-for-byte without a real model.
- `oracle/golden/index.json` pins the SHA-256 of every captured scenario.
- `oracle/golden/scales.json` pins the digest of the full-matrix captures per scale.
- `__tests__/oracle.test.mjs:131-142` test "the full oracle matrix replays with drained
  vectors at every replay scale" iterates every scale and asserts the captured hash
  matches the committed golden — this is exactly what REQ-003 demands.
- `__tests__/oracle.test.mjs:102-116` test "an ordering or tie-break change alters the
  canonical bytes" guards against silent ordering drift: reversing the cards changes
  the canonical hash, so the golden would catch it.
- `__tests__/oracle.test.mjs:88-100` test "a missing golden file is reported rather than
  silently passing" prevents a regression where a missing golden could masquerade as a
  pass.
- Live verification: `node --test __tests__/oracle.test.mjs` → **8/8 pass** in ~4.5s.

### REQ-005 — relevance judgments are honestly labeled

- `oracle/relevance-judgments.mjs:225-244` `buildJudgmentSeed` produces a seed with
  `humanLabelingRequired: true` and a warning string stating "No row here is
  human-authored gold."
- The two label sources (`authored-similar`, `silver-heuristic`) are both derived from
  real signals (resolved `style_relationships` and cross-lane agreement), not invented.
- `__tests__/judgments.test.mjs:38-44` test "no judgment row is presented as human
  gold" hard-asserts that `label_source` is never `'human'` or `'gold'`.
- `__tests__/judgments.test.mjs:98-104` test "the seed regenerates deterministically
  from the judgment fixture" proves the committed seed is reproducible from the fixture
  — no manual fabrication required to regenerate.

## Comment hygiene check

- All code comments reviewed in `generation-manifest.mjs`, `stage-telemetry.mjs`,
  `differential-oracle.mjs`, `query-set.mjs`, `replay-fixtures.mjs`,
  `relevance-judgments.mjs`, `indexer.mjs` (lines 1026-1180), and `operator.mjs`
  (lines 58-186) are descriptive of WHY the code does what it does (durable publish,
  honest accounting, etc.) or describe the contract.
- **No** REQ-xxx / packet / phase / task / ADR identifiers are embedded in any code
  comment in these files. The `[HARD]` comment-hygiene rule is upheld.

## Verdict

- **P0**: 0
- **P1**: 0
- **P2**: 2 (both advisories; no remediation required for this packet)

Iteration ran without surfacing any blocking correctness defect. The 015-P0 foundation
satisfies REQ-001, REQ-002, REQ-003, and the REQ-005 honesty claim to the standard the
charter sets.

Review verdict: PASS