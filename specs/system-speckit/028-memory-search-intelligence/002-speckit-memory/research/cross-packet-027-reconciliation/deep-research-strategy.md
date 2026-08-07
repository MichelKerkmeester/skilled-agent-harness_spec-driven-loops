---
title: Deep Research Strategy - Revisit 027 Through the 028 Lens
description: Session tracking for the cross-packet revisit of 027's refinements against 028's aionforge/galadriel findings.
trigger_phrases:
  - "deep research strategy"
  - "revisit 027 strategy"
  - "cross packet reconciliation session"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for the cross-packet revisit research session. For each subject packet 027 shipped, records whether 028's external findings supersede / extend / contradict / already-cover the live 027 implementation, across iterations.

---

## 2. TOPIC
Revisit the subjects packet 027 (XCE-Derived Spec Kit Refinement) tackled — memory write-safety/provenance, retention/TTL, causal-edge lifecycle + tombstones + frontmatter promoter, learning feedback reducers, incremental memory index + statediff reconciliation, semantic trigger matching, vector/BM25 search resilience + score-scale + response-policy gate, daemon re-election + advisor reconnect + IPC cap, observability + continuity, and memclaw derived-memory write safety — through the lens of packet 028's findings (`../research/roadmap.md` BROADENING ADDENDUM + child `research.md`) mined from aionforge-memory (Rust) and galadriel (Python): edge-presence bi-temporal currentness, bounded anti-flood Beta posterior, content-addressed idempotency, determinism + generation watermark, query-class routing, graceful-degrade discipline. Live 027 code/docs under `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/**` and the implicated subsystem sources. Read-only.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Retention/TTL × bi-temporal close + forget-allowlist — should 027's tier-aware delete-sweep become a temporal-close (028 C3-A/C3-D), and does aionforge-forget's 6-label allowlist refine 027's constitutional/critical/pinned tier gate?
- [ ] Q2: Provenance/write-safety × content-addressed idempotency + ingest-bypass — does 027's source_kind + write-ingress + write-provenance.ts guard cover 028's recall-trust ingest-bypass (envelope.ts:284-295 wrapper bypassed by extraction-adapter.ts:247), and does content-addressed identity (C4-A/C4-B) strengthen 027's dedup?
- [ ] Q3: Causal-edge lifecycle/tombstones/promoter × full bi-temporal model — do 028's four-timestamp validity windows + SUPERSEDES/CONTRADICTS + conflict auto-invalidation (C3-A/B/C) extend or fork 027's causal-edge tombstones + frontmatter→edge promoter?
- [ ] Q4: Feedback reducers × bounded Beta posterior — should 027's learning feedback reducers adopt 028's anti-flood bounded Beta posterior (D2/C4), given 028 found the estimator is raw-frequency (feedback-calibration.ts:173-177,230-237) with no Beta math? (Sharpest direct overlap.)
- [ ] Q5: Incremental index/statediff × determinism + generation watermark — is 027's incremental memory index output deterministic (content-derived ordering, idempotent no-op rescan), and should statediff reconciliation carry a generation watermark (028 Q6-C1, stale=error)?
- [ ] Q6: Semantic triggers × query-class routing — could 027's semantic trigger matcher use 028's 5-class retrieval-class router (single/multi-hop/temporal/entity/quote) as an additive axis?
- [ ] Q7: Daemon re-election/reconnect/IPC × graceful-degrade + reliability trust — does 028's degrade-discipline (exit-75, degrade-to-remaining, report honestly) strengthen 027's advisor reconnect + mk-code-index proxy, and could daemon re-election use a reliability signal for which owner/launcher to trust?
- [ ] Q8: Search resilience/score-scale/reranking/response-policy gate × deterministic RRF + active-channel denominator — how do 027's score-scale + reranking + response-policy + archived/deprecated-inclusion fixes interact with 028's deterministic RRF + content-derived tie-breaks + active-channel-denominator (C-X1) + query-class-gated response?
- [ ] Q9: Observability/continuity × consolidation gauges + newInfoRatio-ingest — does 028's per-tick gauge taxonomy (lag/pending/failed) extend 027's memory observability, and how does 027's continuity meet bi-temporal as-of-known-at reads?
- [ ] Q10: Memclaw derived-memory write safety × content-addressed derived IDs + idempotent async consolidation — does 028's content-addressed derived identity (derived_id=sha256(triple+source+rule_version), C4-B) + idempotent async consolidation (C4-A/C4-C/C-G1) strengthen 027's derived-memory write safety under crash-replay?
- [ ] Q11 (capstone): Where does 028 contradict or already-cover 027 — and does 028's "promote-off-state is 0-of-4 clean flips" finding temper 027's confidence that its own default-off feature flags are cheap to flip on? Produce the reconciliation ledger.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any revisit candidate (deferred to a later packet).
- Modifying 027's shipped code or the external reference systems.
- Re-deriving 028's four-subsystem roadmap (this child builds on it).

---

## 5. STOP CONDITIONS
- All eleven key questions have a cited, code-mapped reconciliation verdict.
- 52 iterations reached (ceiling), bringing the packet to ~150 cumulative.
- Genuine saturation: newInfoRatio below 0.03 across the rolling window AND no unexplored 027 surface remains after a broadening attempt.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: Retention/TTL × bi-temporal close + forget-allowlist — should 027's tier-aware delete-sweep become a temporal-close (028 C3-A/C3-D), and does aionforge-forget's 6-label allowlist refine 027's constitutional/critical/pinned tier gate?

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
027↔028 overlap map (verify against live code; each is a hypothesis until the 027 code is opened):
- 027 retention sweep (tier-aware delete + audit deny) ↔ 028 C3-A edge-presence close / C3-D tombstone-vs-temporal-close / aionforge-forget allowlist.
- 027 source_kind provenance guard + write-provenance.ts default-human + automated-never-overwrites-manual ↔ 028 C4-A idempotency receipts (content-addressed) / C4-B derived-id / recall-trust ingest-bypass gap.
- 027 causal-edge tombstones + frontmatter→edge promoter ↔ 028 C3-A/B/C four-timestamp bi-temporal + SUPERSEDES/CONTRADICTS.
- 027 learning feedback reducers (default-off, shadow) ↔ 028 D2/C4 bounded Beta posterior; 028 finding: estimator is raw-frequency, no Beta math.
- 027 incremental index + statediff reconciliation ↔ 028 determinism (content-derived order, idempotent no-op) + Q6-C1 generation watermark.
- 027 semantic triggers ↔ 028 C2-A 5-class retrieval-class router.
- 027 daemon re-election + advisor reconnect + mk-code-index proxy + IPC cap ↔ 028 graceful-degrade (C9/exit-75) + reliability-weighted trust.
- 027 score-scale + reranking + response-policy gate + archived/deprecated inclusion ↔ 028 deterministic RRF + C-X1 active-channel denominator + query-class gating.
- 027 observability + continuity ↔ 028 consolidation gauges + bi-temporal as-of reads.
- 027 memclaw derived-memory safety ↔ 028 C4-B content-addressed derived id + idempotent async consolidation.
- 027 unifying rule (results-affecting → default-off flag; protections → always-on) ↔ 028 "promote-off-state is 0-of-4 clean flips" caution.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 52 (brings packet to ~150 cumulative across 001-005)
- Convergence threshold: 0.03
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-06-16T20:15:00Z
