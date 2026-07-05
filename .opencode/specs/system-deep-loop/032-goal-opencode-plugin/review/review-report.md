# Review Report — OpenCode /goal Plugin (packet 032, full scope, phases 001–021)

> Merged from a 2-lineage fan-out: `minimax-review` (executor `cli-opencode model=minimax/MiniMax-M3`) and
> `kimi-review` (executor `cli-opencode model=kimi-for-coding/k2p7`), each running its own independent
> 10-iteration deep-review loop against the same target (`.opencode/specs/deep-loops/032-goal-opencode-plugin`,
> all dimensions). Generated 2026-07-04. Full per-lineage detail lives in
> `lineages/minimax-review/review-report.md` and `lineages/kimi-review/review-report.md`.

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Merged verdict** | **CONDITIONAL** (strongest-restriction: neither lineage found a P0) |
| **Merged active findings** | P0=0, P1=17, P2=51 as reported (68 total; after orchestrator adjudication: 1 P1 refuted, 2 P1 downgraded, 1 known overlap — see §10) |
| **Iterations** | 10/10 per lineage (20 total), stop-policy `max-iterations` (forced full depth, no early convergence stop) |
| **Release-readiness** | `release-blocking` (P1 > 0) |
| **Test-suite ground truth (empirical, minimax-review iteration 010)** | 101 tests / 101 pass / 0 fail (8 `.cjs` files, 2.18s) |

Both independently-run reviewer models agree: **no P0 (blocker) findings** — the shipped `mk-goal.js` plugin's security surface (prompt-injection sanitizer, secret redaction) and completion-verifier fail-closed behavior hold up under adversarial re-check, and the test suite is fully green. Both also agree on **CONDITIONAL**, driven by P1-level issues. Where they diverge is *what kind* of P1:

- **minimax-review (14 P1)** is almost entirely **spec/doc bookkeeping drift** — three-way status disagreements between `spec.md`/`graph-metadata.json`/`implementation-summary.md` for phases 009 and 012, a stale "6-file test suite" narrative (actual: 8 files / 101 tests), a stale "16-seam" test-contract narrative (actual: 17 seams), an orphaned `009-diagnostic-review/` folder with no spec docs, and an audit dossier (`scratch/2026-07-03-four-reviewer-audit-findings.md`) that documents pre-fix state as if still current.
- **kimi-review (3 P1)** is almost entirely **runtime correctness/security** — two genuine race conditions in `mk-goal.js` (a continuation in-flight lock race reachable from `session.idle`, and a sweep/archive path that can resurrect an active goal file written mid-sweep by a queued mutator) plus one checklist-overclaim finding shared in spirit with minimax's status-drift cluster.

**Read together, these are complementary, not contradictory**: the packet's *documentation* is more out of sync with reality than its *code*, and the *code* has two narrow but real concurrency bugs that a pure doc-focused pass wouldn't have caught. Kimi's 34 P2 findings also add a long tail of smaller code-quality items (error-swallowing in `appendGoalJsonl`/`sweepOrphanedActiveStates`, incomplete secret-redaction patterns, budget/retry edge cases) that minimax's 17 P2 findings didn't surface, and vice versa (minimax's P2s lean toward catalog/playbook parity and template boilerplate).

## 2. Process Notes (read before acting on lineage-level "failed" status)

- **minimax-review's process-level status is misleading — its content is complete and valid.** The fan-out orchestrator (`fanout-run.cjs`) classified `minimax-review` as `failed` (`orchestration-summary.json`) solely because MiniMax's `synthesis_complete` event wrote `"stopReason":"max-iterations (10/10)"` instead of the canonical enum literal `"maxIterationsReached"` that the harness's post-run invariant check requires. All 10 iterations, the full findings registry, dashboard, and `review-report.md` were written correctly and are used in this merge. This is a **format-contract miss by the MiniMax dispatch, not a review failure** — worth a follow-up fix to the deep-review SKILL.md's stop-reason instruction wording for cli-opencode lineages, since kimi-review wrote the correct value.
- **Kimi's lineage genuinely ran on `kimi-for-coding/k2p7`, not a silent swap.** Its report's "Executor note" ("the configured cli-opencode executor was not available; fallback to native Read/Grep/Glob") describes the deep-review protocol's own per-*iteration* sub-dispatch concept (irrelevant inside a single detached CLI session, which cannot recursively spawn further executors) — not the top-level model. `ps aux` confirmed a single `opencode run --model kimi-for-coding/k2p7` process alive for the full ~28-minute run, and it is the one that produced all 10 iterations directly.
- **Kimi's JSONL timestamps are unreliable.** `orchestration-summary.json` flagged 12 of 13 timestamped events as `after_window` (some 2+ hours in the future relative to real wall-clock, in suspiciously round 10-minute increments) — Kimi appears to have fabricated round timestamps rather than reading the real clock. This affects only the *provenance timestamp field*, not the substance of its findings.

## 3. Merged Active Finding Registry

Full per-finding detail (file:line, evidence, dimension) is in the two lineage reports. Summary by theme:

### P0 — none (both lineages agree)

### P1 (17 total: 14 minimax + 3 kimi, no overlap)

| Theme | Count | Source | Key IDs |
|-------|-------|--------|---------|
| Spec/graph/impl-summary status drift (phases 009, 012, 015, 016) | 6 | minimax F006/F014/F015, kimi F008 (checklist overclaim) | — |
| Stale packet narrative (test-suite count, seam-pin count) | 2 | minimax F030, F018 | — |
| Orphan/undocumented phase folder (`009-diagnostic-review/`) | 1 | minimax F001 | — |
| Audit-dossier staleness (pre-fix state presented as current) | 4 | minimax F010, F012, F026, F009 | — |
| Catalog/playbook parity gaps | 2 | minimax F021, F024/F025 | — |
| `description.json`/`graph-metadata.json` field drift | 2 | minimax F002, F007 | — |
| **Continuation lock race** (session.idle can double-fire continuation) | 1 | kimi F009 | `mk-goal.js:2091` |
| **Sweep/archive resurrection race** (queued mutator write after sweep read) | 1 | kimi F010 | `mk-goal.js:1231` |

### P2 (51 total: 17 minimax + 34 kimi, no overlap)

Kimi's 34 P2s skew toward runtime hardening (error-swallowing, secret-redaction gaps, retry/budget parsing edge cases, magic constants, dead-code branches). Minimax's 17 P2s skew toward doc/template hygiene (changelog placeholder rows, stale `lastUpdated`, playbook depth disparity). Full lists in the per-lineage reports.

## 4. Planning Trigger

CONDITIONAL routes to `/speckit:plan`. Recommended grouping for a remediation phase:

1. **Status reconciliation** (spec.md / graph-metadata.json / implementation-summary.md three-way alignment for phases 009, 012, 015, 016) — minimax F006/F014/F015 + kimi F008/F025/F026.
2. **Concurrency fixes in `mk-goal.js`** (highest real-risk item in this review) — kimi F009 (continuation lock race) and F010 (sweep/archive resurrection race); both are narrow, well-localized fixes with clear file:line evidence.
3. **Audit-dossier refresh** — `scratch/2026-07-03-four-reviewer-audit-findings.md` documents several already-fixed items (F4/F5/DOC-2/e-2.2) as open; refresh before any future phase reads it as ground truth.
4. **Narrative/count corrections** — "6-file/97-test" → "8-file/101-test", "16-seam" → "17-seam", orphan folder documented or removed.
5. **Security/quality tail** — Kimi's P2 cluster (redaction gaps, error-swallowing, budget-parsing edge cases) as a lower-priority hardening pass.

## 5. Traceability Status

| Protocol | minimax-review | kimi-review |
|----------|-----------------|-------------|
| `spec_code` | partial (4 iterations) | partial |
| `checklist_evidence` | n/a (only phase 016 has checklist.md) | fail (phase 016 checklist overclaim) |
| `skill_agent` | partial | not exercised |
| `agent_cross_runtime` | partial (9 surface points, 1 translation) | not exercised |
| `feature_catalog_code` | partial | pass |
| `playbook_capability` | partial | pending (not exercised) |

## 6. Deferred Items

- Resource-map coverage gate skipped in both lineages (`resource-map.md` absent at spec-folder root).
- `playbook_capability` protocol not exercised by kimi-review.
- Full P2 lists (51 items) deferred to the per-lineage reports rather than duplicated here.

## 7. Audit Appendix

- `deep-review-findings-registry.json` (this directory): merged registry, 68 open findings, `mergedVerdict: CONDITIONAL`, produced by `fanout-merge.cjs`.
- `fanout-attribution.md` (this directory): per-lineage iteration/convergence/salvage summary.
- `orchestration-summary.json` (this directory): fan-out process-level result — `succeeded: 1, failed: 1` (see §2 for why `minimax-review`'s process classification should not be read as a content failure).
- Prior lineage (documentation-staleness audit, 10 iterations, GPT-5.5-fast, superseded by this broader-scope run) archived at `review_archive/2026-07-04-documentation-staleness-audit/`.

## 8. Lineage Metadata

| Field | minimax-review | kimi-review |
|-------|-----------------|-------------|
| Model | `minimax/MiniMax-M3` | `kimi-for-coding/k2p7` |
| Session ID | `fanout-minimax-review-1783146823455-7q45s6` | `fanout-kimi-review-1783146823455-7q45s6` |
| Iterations | 10/10 | 10/10 |
| Stop reason (as written) | `max-iterations (10/10)` (non-canonical string — see §2) | `maxIterationsReached` (canonical) |
| Wall-clock duration | ~25.6 min | ~27.5 min |

## 9. Next Steps

- `/speckit:plan` against the 5 remediation groups in §4, reusing the merged registry (`deep-review-findings-registry.json`) as ground truth, **filtered through the §10 adjudication** (skip the refuted finding; treat downgrades at their adjudicated severity).
- Do not open `/create:changelog` until the adjudicated P1 count reaches 0 (currently 14–15 after adjudication).

## 10. Orchestrator Adjudication (independent verification pass, 2026-07-04)

Every P1 was re-verified against the live code/docs before acceptance; high-signal P2s were spot-checked. Findings are hypotheses until confirmed.

### Refuted (1 P1)

- **kimi F009 (continuation lock race) — REFUTED.** The claimed check-then-act race at `mk-goal.js:2091-2095` requires an `await` between `continuationLocks.has()` and `.add()`; there is none — the pair is synchronous and cannot interleave in single-threaded Node. The only `await` (`recoverProviderUsageLimitIfDue`) sits *before* the check, which is safe. The lock set is initialized at plugin construction (`mk-goal.js:2474`) and passed by both production call sites. No double-fire path exists as described.

### Downgraded (2 P1 → P2)

- **minimax F011 (duplicate `tokens_used`/`budget_tokens_used` etc.) — real but P2 maintainability, not P1 security.** Verified at `mk-goal.js:2319-2329`: canonical fields plus `budget_`-prefixed aliases are both emitted. It is a back-compat/transition artifact with no security consequence. **This is also the one confirmed overlap between lineages** — kimi F013 is the same finding (the "zero overlap" note in earlier drafts of §1 was wrong).
- **minimax F007 (`last_active_child_id` points at Planned phase 018) — premise no longer true.** Current `graph-metadata.json` has `last_active_child_id: null`, which is legal (resume falls back to listing children). At most a P2 advisory to set it to a real Complete child.

### Confirmed with reframed direction (the status-drift cluster)

Phases 009, 012, 015, 016 all show spec.md/graph-metadata = `Planned`/`Draft` while implementation-summary = `Complete` (verified in all four). Both models reported the *disagreement* correctly, but their remediation framings point opposite ways: minimax F008 assumes the impl-summaries are scaffold boilerplate; kimi F008 frames phase 016's checklist as an "overclaim." **Both directions are wrong: the work shipped** (103/103 tests pass, fresh run 2026-07-04; the phase deliverables exist in code). The correct fix is to flip spec.md Status rows and regenerate graph metadata to `Complete` — do not revert checklists or impl-summaries.

### Confirmed as reported

- **kimi F010 (sweep/archive resurrection TOCTOU) — CONFIRMED; the one real runtime bug in this review.** `sweepOrphanedActiveStates` (`mk-goal.js:1231`) makes its staleness decision (stat + readFile + `updatedAtMs` check) *outside* the per-session mutation queue, then calls `archiveGoalStateFile`, which enqueues a rename **without re-validating staleness inside the queue**. A goal-write queued between the read and the rename gets archived while active. Window is narrow (file must already be ≥30 days stale and receive a write mid-sweep), and the goal is recoverable from archive — P1/P2 boundary, but the fix is trivial: re-check `updatedAtMs` inside the enqueued operation.
- **minimax F030/F018 (stale counts)** — verified: 8 goal test files (not 6); `__test` exposes 17 seams (not 16); full suite currently 103/103 (includes 2 non-goal guard tests).
- **minimax F001 (orphan `009-diagnostic-review/`)** — verified: contains only review-loop artifacts, no spec.md/description.json, yet its name matches the phase-child pattern, so it pollutes phase discovery.
- **minimax F002 (`description.json` level)** — verified: `"level": "phase"` vs spec.md `phase parent`.
- **minimax F010/F012/F026 (audit-dossier staleness)** — verified: dossier F4 is mitigated (`handleEvent` gates on `enabled`, `mk-goal.js:2496`); dossier F5 is mitigated (unicode-aware role folding, `mk-goal.js:339-347`); dossier e-2.2's raw-`Date.now()` claim no longer holds (sole remaining `Date.now()` is the `nowMs()` fallback at line 265).
- **minimax F024/F025 (catalog gaps)** — verified: `speckit-goal-offer-contract.test.cjs` appears in neither feature catalog (grep count 0 in both); the two catalogs carry different descriptions for `mk-goal-state.test.cjs`.
- **minimax F021 (SKILL.md `Task` drift)** — verified: `deep-review/SKILL.md` `allowed-tools` includes `Task` while the agent contract forbids it. Note: this is a finding about the deep-review skill itself, outside packet 032's scope — track it separately.
- **kimi P2 spot-checks** — F024 (wall-clock cap measured from `startedAtMs`, never reset on resume: confirmed at `mk-goal.js:1394/1032/1976`), F005 (redaction misses Google `AIza` keys, PEM blocks, raw hex: confirmed by inspection of `mk-goal.js:380-389`), F006 (role sanitizer requires a colon delimiter: confirmed), F022 (smoke mode returns `would_fire` before the `promptAsync` availability check: confirmed as written; arguably intentional for a dry-run signal).

### Adjudicated totals

**P0=0, P1≈14 (17 reported − 1 refuted − 2 downgraded), P2≈53.** Verdict remains **CONDITIONAL**. The dominant remediation is one status-reconciliation + dossier-refresh + catalog-sync documentation sweep; the only code fix that must land is the kimi F010 sweep TOCTOU re-validation, followed by the P2 hardening tail at leisure.

---

**END OF REPORT**
