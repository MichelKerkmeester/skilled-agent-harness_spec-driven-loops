---
title: "027 Fresh+Regression Deep-Review — 75 Seats, Three Models, 0 P0, 10 Verified P1"
description: "Fresh + regression deep-review of the 027 XCE epic: 75 single-pass seats across Opus 4.8 (claude2), GPT-5.5-fast (cli-opencode) and Kimi K2.7 (cli-opencode), with opposite-model adversarial verification of every code-defect P1. No P0; verified P1s concentrate in save-lock/migration/cache-generation code defects and parent-metadata drift."
trigger_phrases:
  - "027 fresh regression review report"
  - "027 75 seat three model review"
  - "027 round 3 deep review verdict"
importance_tier: "important"
contextType: "implementation"
---

# 027 Fresh+Regression Deep-Review — Review Report

> **Verdict: CONDITIONAL.** Zero P0 across all 75 seats and three models. Adversarial Round-2 verification reduced 16 code-defect "P1" candidates to **5 confirmed P1** (7 downgraded to P2, 3 refuted, 1 unverified). Direct host-checking confirmed a recurring **parent-metadata drift** cluster (omitted children, stale pointers, a 37→39 tool-count mismatch). The shipped behaviour largely holds; the real defects are a small set of write-path / lifecycle bugs plus documentation/control-metadata drift — the same class the prior epic-sweep flagged, recurring on newer phases.

Review target: `system-spec-kit/027-xce-research-based-refinement` (full epic). Round: `review/fresh-regression-75/`. This is an independent third round; it does **not** trust the prior epic-sweep `RESOLVED` verdict.

---

## 1. Method

**75 single-pass seats** (a seat = one angle × narrow slice × model = one iteration), spread across **15 fresh/under-covered angles** so no single loop could "converge early":

- **Models (3):** Opus 4.8 via the `claude2` binary (account #2, isolated per-seat config dir + OAuth token for parallelism), GPT-5.5-fast via `cli-opencode` (early seats), and **Kimi K2.7** (`kimi-for-coding/k2p7`, xhigh) via `cli-opencode` on its dedicated subscription pool (the GPT/codex quotas were exhausted mid-run; Kimi's 256k window also cleared the broad tree-wide seats that timed gpt-5.5 out). All seats strictly **read-only** (`--permission-mode plan` / no skip-permissions) — no working-tree mutations.
- **Angle taxonomy (fresh + regression):** regression-validation of the epic-sweep's 4 remediation commits; the carried §6 follow-ons; the three daemons (mk-spec-memory / mk-skill-advisor / mk-code-index) write-path & concurrency; launcher/re-election lifecycle; the new CLI front-doors; dead/unwired code; cross-runtime mirror parity; continuity/metadata integrity; WIP tracks 001/002/005; comment-hygiene & scope; security beyond secrets.
- **Reduce:** all `{type:"finding"}` deltas merged + deduped by `file:line` → `deep-review-findings-registry.json`.
- **Round-2 adversarial verification:** every **code-defect P1** re-checked by the **opposite model** (Opus-found → Kimi; gpt/Kimi-found → Opus), refute-first ("default to REFUTED if uncertain"). Doc/metadata P1s host-verified by direct file inspection.

---

## 2. Outcome

| Measure | Value |
|---------|-------|
| Seats completed | **75 / 75** (0 failed) |
| Raw findings | 116 (0 P0 · 41 P1 · 75 P2) |
| Unique (deduped) | 113 (0 P0 · 40 P1 · 73 P2) |
| Model attribution (raw) | Opus 81 · Kimi 19 · gpt-5.5 16 |
| **P0** | **0** |
| Round-2 on 16 code-defect P1s | **5 CONFIRMED · 7 DOWNGRADED→P2 · 3 REFUTED · 1 unverified** |
| Doc/meta P1s | 5 host-confirmed · ~19 asserted (cited, remediation-packet confirms) |
| Net confirmed actionable | ~10 P1 + ~80 P2 (advisory) |

---

## 3. Confirmed P1 — code defects (Round-2, opposite-model verified)

1. **`mcp_server/handlers/save/spec-folder-mutex.ts:37` — save mutex reaps live owners.** `isStaleLock` uses only mtime age; `owner.json` pid is never read back, the lock dir mtime is set once at mkdir and never refreshed, and acquire reaps purely on age → a still-alive long save (chunked embedding / slow provider) has its lock stolen by a second writer. This is the **twin** of the lock fixed in `generate-context.ts` by commit `7c17b07e01` ("save-lock liveness") — that fix never reached this module. *(Verified by Kimi.)*
2. **`mcp_server/lib/storage/history.ts:103` — legacy history rebuild outside a transaction.** The migration guard matches only legacy constraints; the rebuilt table runs in a separate auto-commit path after the migration tx commits → a mid-migration crash permanently loses the audit log. *(Verified by Kimi.)*
3. **`mcp_server/lib/search/vector-index-mutations.ts:101` — delete sweep never bumps causal-edges generation.** `invalidateGraphCaches()` clears degree/signals caches but never calls `bumpCausalEdgesGeneration`, while `deleteAncillaryMemoryRows` sweeps causal edges → stale causal-boost cache survives a delete. **Partial regression of epic-sweep fix #4.** *(Verified by Kimi.)*
4. **`.opencode/bin/mk-code-index-launcher.cjs:839` — bootstrap-lock TTL > deadline.** Reclaim threshold is 300s but the wait deadline is 120s, so any dead lock younger than 300s hits the 120s timeout before reclaim can fire → dead-socket respawn blocked. *(Verified by Kimi.)*
5. **`mcp_server/handlers/pe-gating.ts:351` — append-version paths discard manual `source_kind` carry.** `applyWriteProvenance` re-derives `source_kind` from incoming context only, dropping `retirePredecessorForActiveReindex`'s manual carry → a human predecessor's manual-overwrite protection is lost on PE-UPDATE. *(Verified by Kimi.)*

## 3b. Confirmed P1 — parent-metadata drift (host-verified directly)

6. **`000-release-cleanup/{spec.md,description.json}`** omit the on-disk child `000-spec-tree-consolidation` (exists on disk; 0 references).
7. **`003-advisor-and-codegraph/description.json`** omits live child `004-skill-advisor-suite-repair` (0 hits).
8. **`004-shared-infrastructure/description.json`** omits live child `009-code-graph-code-only-indexing` (0 hits).
9. **`feature_catalog.md:48`** documents "37 tools" but live `tool-schemas.ts` has **39** `name:` entries.
10. **Stale phase-parent pointers / completion-state drift** (root `graph-metadata.json:231`, `001-peck.../graph-metadata.json:113`, `005/spec.md:111` showing a shipped child as "Planned") — same R1–R4 class as the prior round, recurring on newer phases. *(Structural cluster confirmed; exact line-level fixes belong to the remediation packet.)*

## 3c. Asserted P1 (cited, host-verification deferred to remediation)

~19 further traceability/doc-truth P1s carry concrete `file:line` evidence but were not individually host-verified in this pass — notably the WIP-track completion claims (009 RSS pass, 013 gates "pending", 014 pre-remediation test counts), the `005/002-tri-system-deep-research` research.md mis-citations (3) + non-existent spec-folder reference, and the deep-improvement reviewer-benchmark wiring gaps. All are enumerated in `deep-review-findings-registry.json` and carried into the remediation packet, which confirms each before fixing.

---

## 4. Refuted / downgraded (Round-2)

**Refuted (false positives — correctly caught):**
- `skill-advisor-cli.ts:353` — front-door **does** gate mutations via `assertTrustedForMutation(trusted)` (defaults false; prompt-time blocked).
- `reconsolidation.ts:324` — gated by `isSaveReconsolidationEnabled()` (opt-in, **default OFF**) + plan-only planner default; intentional default-off ≠ bug.
- `run-benchmark.cjs:461` — fallback emits a stderr warning (not silent); `reviewer` scorer intentionally absent from that fixture runner per SKILL §304.

**Downgraded P1→P2 (real but lower severity / guarded):** the `/tmp` socket-trust pair (`spec-memory-cli.ts:753`, `code-index-cli.ts:924` — real `statSync`-not-`lstat`/no-uid gap, but single-user dev tool and the server enforces `st.uid`), the exit-0-on-error asymmetry (`spec-memory-cli.ts:982` — envelope `isError` still yields exit 1), the camelCase maintenance-block bypass (`mk-code-graph-bridge.mjs:18` — real gap, no current caller), and the launcher non-exclusive reclaim / double-spawn pair (`mk-spec-memory-launcher.cjs:478`, `mk-code-index-launcher.cjs:979`).

**Unverified (1):** `validate.sh:1062` CONTINUITY_FRESHNESS graduated-rollout claim — Round-2 seat parse-failed; re-verify during remediation.

---

## 5. P2 surface

~80 P2 (73 unique + 7 downgraded) — advisory hygiene, maintainability, and minor-traceability items across all 17 lineages. Not individually verified; full list in `deep-review-findings-registry.json`. Highest-density P2 lineages: `opus-memory-daemon`, `gpt-wip-verification`, `gpt-continuity-metadata`.

---

## 6. Verdict & next steps

**CONDITIONAL** — no release-blocking defect (0 P0), but **5 confirmed code P1s** (save-lock liveness, history-rebuild transaction, causal-generation bump, launcher TTL, provenance carry) and a confirmed **parent-metadata drift** cluster warrant remediation. Recurring signal across three independent rounds: **doc/control-metadata drifts ahead of code** on newer phases — a process gap, not a code-quality gap.

Remediation tracked in the companion `/speckit:plan` packet (no fixes applied this run). Machine-readable detail: `deep-review-findings-registry.json`, `round2/code-verdicts.json`, `round2-p1-worklist.json`.
