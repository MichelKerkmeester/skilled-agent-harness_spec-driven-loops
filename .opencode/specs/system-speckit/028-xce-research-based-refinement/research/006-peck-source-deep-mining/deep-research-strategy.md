---
title: Deep Research Strategy — 027/006 peck-source net-new mechanism mining
description: Mine peck-master's actual source (beyond the 2026-06-02 README pass that produced T1-T4) for net-new adoptable mechanisms + re-evaluate the deferred T1; synthesize a sub-packet proposal for 027.
---

# Deep Research Strategy — Session Tracking

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high / timeout 1000s / read-only / orchestrator-written artifacts / parallel background batches of 4
**Packet:** `research/006-peck-source-deep-mining/` (folder-scoped iterations 001-018; new lineage, separate packet)
**Session:** `2026-06-06-027-peck-source-deep-mining`

---

## 2. TOPIC
Beyond the already-adopted T2/T3/T4 and the deferred T1, what NET-NEW adoptable mechanisms does peck-master's ACTUAL implementation (agent prompts, CLI commands, reflect skill, revim-* benchmark harness, model/cost choices) offer system-spec-kit's verification/quality surfaces — and is the deferred T1 per-AC coverage gate now adoptable? Per-mechanism verdict in {ADOPT, ADAPT, DEFER, SKIP}. Deliverables: research.md verdict matrix + sub-packet-proposal.md for a new 027 child.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (planned foci)
- [x] 001 implementer escalation/anti-thrash discipline -> ADOPT one-sentence-root-cause + story-amendment-not-workaround; ADAPT verify-loop budget/reviewer-contradiction/cost-framing (newInfoRatio 0.68)
- [x] 002 verdict-freshness binding -> ADOPT: bind checklist evidence to content fingerprint (reuse session_dedup.fingerprint) + clean-tree precondition; current validation only checks timestamp lag + sha256 syntax (newInfoRatio 0.72)
- [x] 003 numeric weighted severity rubric -> ADAPT only (+/-2 context aid + optional non-gating riskScore); SKIP literal >=4 block (over-blocks P2-advisory) (newInfoRatio 0.45)
- [x] 004 reviewer token-budget read discipline -> ADOPT for @review; ADAPT for deep loops (must not override P0 rereads) (newInfoRatio 0.72)
- [x] 005 anti-verdict-softening + anti-gaming -> ADOPT "don't relabel Fail as conditional/partial" + ADAPT anti-truncation; SKIP deep-review iteration verdict (already shipped); DEFER label-gaming into T1 (newInfoRatio 0.55)
- [x] 006 revim-* BENCHMARK harness -> ADOPT concept / ADAPT into deep-improvement Lane B: reviewer-prompt regression over real fixtures + EXPECTED VERDICTS; spec-kit lacks the known-bug-class reviewer shape (newInfoRatio 0.85, highest)
- [x] 007 CLI command mechanics -> ADAPT phase-aware packet-load FILES manifest for /speckit:resume; SKIP branch-per-story + empty-commit ledger (anti-teachings re-confirmed) (newInfoRatio 0.62)
- [x] 008 deferred T1 re-evaluation -> ADOPT-AS-PACKET (own staged sibling packet): AC table + AC_COVERAGE rule (floor 0.9, WARNING->ERROR) + manual escape + deep-review binding + L2+ opt-in; reuse existing AC/evidence/reviewer infra (newInfoRatio 0.58)
- [x] 009 cheap-model-gates -> ADAPT opt-in/benchmark-gated cheap-model severity preset; DEFER as blanket default (broad/security surfaces risk false PASS); deep-review defaults to native Opus; routing plumbing already exists (newInfoRatio 0.48)
- [x] 010 reflection bounded-cap/promotion residue -> T2's 004 left residue: ADAPT (a) total guidance cap + (b) recurrence->promotion [low-risk]; DEFER (c) human-gated prune/demote lifecycle [high-risk]; 004 phase still pending - coordinate (newInfoRatio 0.72)
- [ ] 011 (reserve) story assertion-format (precondition+action->observable outcome) vs AC format across levels / what 002 shipped
- [ ] 012 (reserve) parallel-reviewer dispatch + on_complete commit hooks vs eval-DB verdict ledger
- [ ] 013 (reserve) product.md current-state living doc vs phase-parent spec / description.json (did T4 fully generalize?)
- [ ] 014 (reserve) anti-teaching boundary re-confirmation (what NOT to adopt; keep the sub-packet scoped)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No source/spec/template implementation during research (report only; spec edits are a separate Gate-3 pass).
- Do NOT re-derive T2/T3/T4 (already adopted via 001/{002,003,004}); only assess the DELTA between peck-as-implemented and what shipped.
- Do NOT retread the 005 exhausted XCE/memory-internal code paths (orthogonal axis).
- No wholesale peck-philosophy import ("delete plans/docs"); mechanisms must be philosophy-neutral for spec-kit (per the 2026-06-02 anti-teachings).

---

## 5. STOP CONDITIONS
- Run the 10 planned foci (001-010); then extend with reserve foci (011-014) only if the last batch mean newInfoRatio >= ~0.4 with material open questions.
- Converge (stop) when a batch mean newInfoRatio < 0.15, OR reserve exhausted, OR 14 iterations reached, OR explicit operator stop.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- 001: spec-kit lacks peck's explicit escalation gates (one-sentence-root-cause; story-amendment-not-workaround). ADOPT.
- 002: spec-kit completion is NOT bound to HEAD/content; `session_dedup.fingerprint` is never recomputed; `CONTINUITY_FRESHNESS` only checks timestamp lag. Real gap -> ADOPT freshness binding.
- 003: spec-kit has weighted convergence but not per-finding numeric calibration; the useful delta is `±2 context`, NOT the literal `>=4 blocks`. ADAPT (docs/schema), SKIP literal cutoff.
- 004: spec-kit has numeric TCB (max-12 calls) but not peck's qualitative per-read justification. ADOPT @review; ADAPT deep loops.
- 005: spec-kit has general honesty + verify-before-claiming but not the sharp "do not relabel a Fail as conditional/partial". ADOPT (completion ritual); ADAPT anti-truncation for final reports.
- 006: spec-kit Lane B/C benchmarks lack peck's reviewer-prompt regression shape (real fixture state + EXPECTED VERDICT oracle). ADOPT concept -> ADAPT into Lane B as a reviewer-fixture type + scorer. (highest novelty 0.85)
- 007: net-new = a phase-aware packet-load FILES manifest for /speckit:resume; the git-audit mechanics (empty-commit ledger, branch-per-story) stay rejected.
- 008: T1 is NOW adoptable post-026 as a STAGED STANDALONE packet (reuse AC syntax/evidence/deep-review). Recommend its OWN sibling packet, NOT folded into 006; benchmark via 006.
- 009: cheap-model-gates routing already exists; net-new is the POLICY (benchmark-gated cheap severity first-pass). ADAPT opt-in; DEFER blanket (broad/security false-PASS risk). Pairs with 006.
- 010: 004 left residue — total guidance cap + recurrence->promotion (ADAPT, low-risk) and prune/demote lifecycle (DEFER, high-risk; 004 still pending).
<!-- /ANCHOR:answered-questions -->

---

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading peck's AGENT PROMPTS line-by-line against the LIVE spec-kit code (validators, agent defs, constitutional rules) surfaced concrete gaps the README-level 2026-06-02 pass missed — each finding carries dual peck+spec-kit `file:line` citations. (batch 1)
- gpt-5.5-fast --variant high showed good judgment on over-adoption traps (003 rejected literal `>=4 blocks`; 004 flagged P0-reread override) rather than rubber-stamping every peck mechanism. (batch 1)
- Parallel background batch of 4 read-only dispatches completed in ~3.5 min wall-clock; orchestrator-writes pattern kept all state externalized. (batch 1, batch 2)
- Revisiting "already-adopted" teachings (005 anti-softening, 008 T1, 010 reflection) for the DELTA between peck-as-implemented and what shipped surfaced real residue without re-deriving the teaching. (batch 2)
- Reading peck's untouched benchmark/ harness (006) opened the run's highest-novelty thread — the test substrate for every other adoption. (batch 2)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Re-deriving T2/T3/T4 from peck's README — already done (2026-06-02 `001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md`). 006 mines SOURCE for net-new only.
- XCE/PRAT/memory-internal code-path mining — exhausted by research phases 001-005 (see `research/005-live-rescope-coco-purge/deep-research-strategy.md` exhausted-approaches).
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
COMPLETE. 13 discovery iterations (001-013, gpt-5.5-fast) converged; synthesized research.md + sub-packet-proposal.md. Then 5 cross-model verify iterations (014-018, MiniMax-M3) CONFIRMED all headline findings (T6/T10/T1-core/completeness; 0 refutations), sharpened the T1 design (assertion-format hard prereq, canonical AC location, lifecycle opt-in), and ENDORSED the proposal with one applied must-fix (011 <-> pending 001/002 template sequencing). Deliverables final; awaiting operator approval to scaffold 010 -> 009 -> 011.
<!-- /ANCHOR:next-focus -->
