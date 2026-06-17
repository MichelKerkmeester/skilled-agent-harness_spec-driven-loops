# Packet 028 — Synthesis Index (200-iteration campaign)

> **Why this directory exists.** The 028 campaign ran **150 read-only research iterations** across **5 children** + **2 external systems** + a **cross-packet revisit**. That volume outgrew a single `roadmap.md`, which now carries three stacked layers (pass-1 + broadening + 027-revisit). These `synthesis/*` docs are the **consolidated, digestible view**; `roadmap.md` and the per-child `research.md` remain the detailed/historical record.

## The campaign at a glance

| Body of work | Children | Iters | What it produced |
|---|---|---|---|
| **External mining** (aionforge + galadriel → 4 internal subsystems) | 001 Memory (38), 002 Code-Graph (24), 003 Skill-Advisor (18), 004 Deep-Loop (20) | **100** | The 6-spine candidate roadmap + the BROADENING ADDENDUM (net-deflationary corrections) |
| **Cross-packet revisit** (028 findings × 027's shipped code) | 005 revisit-027 (50) | **50** | The 027↔028 reconciliation ledger + the 027-REVISIT ADDENDUM |
| **Sibling + cross-cutting** (Advisor/Code-Graph × 027 + procedural + new angles) | 006 sibling-revisit (50) | **50** | The 006 ledger + `04-sibling-and-cross-cutting.md` |
| | | **200** | |

## Headline findings

1. **The external-mining roadmap is net-deflationary.** The broadening refuted ~12 over-claimed pass-1 candidates and tempered both meta-spines (determinism "strongest spine" → shared by 2-of-4; "promote-off-state" → 0-of-4 clean flips). A real spearhead survives (see `01-go-candidates.md`).
2. **028 is overwhelmingly net-additive to 027** — across all ten revisited subjects, **0 supersedes, 0 contradicts** (EXTENDS ×6 / ALREADY-COVERED ×1 / NO-TRANSFER ×3).
3. **027's shipped doctrine flows back into 028** (reverse transfer): its always-on fail-closed scrubber is the *pattern* for 028's C8; its always-on/default-off rule decides C8 + justifies C4-A; its shadow-gated reducers are the fix template for 028's dormant `newInfoRatio`; and 027's peck verification-discipline independently encodes 028's adversarial-verify methodology.
4. **No candidate has a measured before/after benefit number** — every leverage rating is structural inference. This is the highest residual across the whole campaign.
5. **The 006 sibling/cross-cutting round (+50 → 200) was net-additive and self-correcting** — it surfaced genuinely new cross-cutting wins (ANN tie-stability below RRF, a constitutional self-edit/CAS guard, a `source_kind`-gated render escaper) while **deferring** the weakest sibling candidates (advisor C1/QCR fix non-problems; the code-graph bi-temporal cluster has no consumer), **refuting** the naive cross-cutting-C8 generalization (reachability-gated), and **downgrading** procedural-outcome-ranking to proxy-only (no execution-success emitter exists). See `04`.

## How to read these docs

| Doc | Read it for |
|---|---|
| **`05-all-findings-plain-language.md`** | **Start here for the whole picture in plain English** — every finding from all 200 iterations as a **before → after feature change** (NEW vs EXISTING, what we'd do, current vs resulting behavior, the catch), grouped by subsystem with priority, plus the "what we're NOT doing" table and the honest caveats. |
| **`01-go-candidates.md`** | THE actionable list — every surviving candidate, deduplicated, dependency-ordered Wave-0/1/2, with corrected effort/seam. The input to a 028 *implementation* packet. (Now includes the 006 net-new folded into the Waves + a **dropped-candidate-recovery** section surfaced by the fresh-agent synthesis review.) |
| **`02-cross-packet-reconciliation.md`** | The 027↔028 verdict ledger + reverse transfers + methodology convergence + the 2 sibling-subsystem follow-ups. (Full detail: `../../005-revisit-027/research/research.md`.) |
| **`03-corrections-caveats-and-residuals.md`** | The honesty layer — what the campaign refuted/downgraded about its own claims, the GO-evidence caveats, and the single-most-likely-wrong items to verify before building. |
| **`04-sibling-and-cross-cutting.md`** | The 006 additions (+50 → 200): cross-cutting net-new (ANN tie-stability, constitutional self-edit guard, source_kind-gated render escaper, fan-out retry, red-team probe-gate) + the deferrals/refutations (C1/QCR/codegraph-bi-temporal deferred; cross-cutting-C8 refuted; procedural→proxy-only) + corrections to 01–03. Full ledger: `../../006-sibling-revisit/research/research.md`. |
| `../roadmap.md` | The detailed 6-spine candidate tables + the two append-only addenda (historical record). |
| `../../00{1..4}/research/research.md` | Per-subsystem internal baselines + candidate catalogs + broadening addenda. |
| `../../005-revisit-027/research/research.md` | The full cross-packet ledger (authoritative for the 005 packet). |

## Scope reminder

Research-only (spec §3). The packet ends at this evidence-backed roadmap + ledger; **implementation is a separate, later decision.** Nothing in these docs has been built or benchmarked.
