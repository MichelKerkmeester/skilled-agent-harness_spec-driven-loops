# 028 — Corrections, Caveats & Residuals (the honesty layer)

> What the 200-iteration campaign **refuted or downgraded about its own claims**, the evidence caveats on the GO list, and the items to **verify before building**. Read this alongside `01-go-candidates.md` — every "GO" here carries a known soft spot. The campaign was net-deflationary and **fabricated no benefit numbers**. (The 006 / +50-iter self-corrections are folded into §A and §C below.)

## A. Self-corrections the campaign made (don't trust the pass-1 framing)

**External mining (broadening, 100-iter) — ~12 candidates refuted/tempered. Meta-spines recalibrated:**
- "Determinism is the strongest unifying spine" → genuinely shared by **2-of-4** (Code-Graph/Deep-Loop reuse is thinner than billed).
- "Promote-the-off-state-flag is the single biggest pattern" → **0-of-4 clean flips** (only Memory C4-A is literal, and even it needs deferred-wiring).
- Advisor **C4** "graduation of a Beta estimator" → **no Beta math exists** (the estimator is raw-frequency) — C4 is a build.
- Deep-Loop **D2** "keystone reliability signal" → **wholly absent net-new build** (every input `r=0.5`).
- Ship-first **C3-A** "clean flip" → **read-side build** (`SPECKIT_TEMPORAL_EDGES` already ON).
- Advisor **C5** "~13% confidence skew" → **unsourced** (grep = zero); capture a baseline before quoting.

**027-revisit (50-iter) — adversarial rounds corrected the mapping:**
- **Q2 ingest-bypass hole → REFUTED** (`working_memory` carries no content; ingest is pointer-only; the cited "wrapper" is bare serialization). Candidate withdrawn.
- **skip-closed-in-sweep "TOP gating blocker / LEVERAGE H" → downgraded to recoverable hygiene** (no automatic producer creates the collision; the sweep tombstones before deleting). It ships as cheap defensive hardening, not a data-loss gate.
- **C8 seam moved** getSessionMemories → getTieredContent (the first seam was an unread renderer), then **upgraded** from threat-gated to a real must-fix once the write→recall→prompt loop was traced.
- **Q4 Beta flip → falsified** (the protect-gate reads only tier/pin; no vote tally to flood).
- **Q5 total-comparator → non-issue** (`Set<number>` from INTEGER PK).
- **Q6 / Q7 → killed** (trigger gate is a shadow-only no-op; owner-election is a liveness mutex, not a ranking problem).
- **two-primitive module "clean S" → coupling-risk** (centralizing identity risks diverging from legacy bare-hex hashes; Primitive B's token-stripping is receipt-specific).

**Sibling + cross-cutting (006, +50-iter) — additional self-corrections (banked in `../../006-sibling-revisit/research/research.md`, verified against `001`/`004` deltas):**
- **C-G1 / C4-C "the gap is the durable cursor" → OVERSTATED.** A cadence-gated consolidation engine with a durable cursor **already exists** (`consolidation.ts:518-548`, `consolidation_state.last_run_at`, weekly interval, idempotent locked cycle) — it is merely **save-triggered, never clock-driven**. C-G1 shrinks to "add a clock-driver around the existing cursor" (S-M); do **not** block it on building C4-C. (001 iter-29 G29-01, iter-30 H30-02, iter-37 J37-01.)
- **galadriel prompt-cache (~84%) as a determinism justification → INVALID for an MCP server.** The ~84% is an in-process-agent property (galadriel caches its *own* stable prefix across its `messages.create()` turns); an out-of-band MCP server's recall lands in the *client's* mutable tail and makes no API calls. Determinism stands on **reproducibility/testability**, not prompt-cache — drop the prompt-cache rationale wherever it justifies a determinism candidate. (001 iter-29 G29-02.)
- **D-reproducible-fold "PROMOTE (reuse 001)" → REFUTED.** No reusable content-derived ordering/fold helper exists to reuse: the tie-break is **inline** (`council-graph-query.ts:280`) and the fold registry-specific. A shared helper must be **extracted first** (the net-new `D-orderhelper` prereq), so Deep-Loop's determinism reuse is BUILD-new, not a promote. (004 iter-5 F5-02 / O5-01.)
- **C4-A "flip + deferred-save wiring" → the replay-into-deferred-save leg is dead.** C4-A's surviving value is **receipt-default-on + content-addressed idempotent ids** (the crash-replay-id mechanism, 001 iter-30 H30-03); the specific "wire replay/conflict into the deferred/canonical save path" leg was **refuted** (001 iter-27 F27-02). Do not bill C4-A as needing deferred-save replay wiring.
- The cross-cutting-**C8** generalization and **procedural-outcome-ranking** were also self-corrected here (refuted/reachability-gated and proxy-only respectively) — see §C and `04`.

## B. GO-evidence caveats (read before quoting any leverage)

- **No candidate has a measured before/after benefit number.** Every leverage/effort rating is **structural inference**. Treat every H/S as inferred, not validated.
- **C5's "~13%" is unsourced** — do not cite it.
- **C-X1**, **Q6-C1**, **Q6-C2**, **closed-vocab**, **C9** are **weaker** than their pass-1 billing (each caveated in `roadmap.md`).
- Determinism "byte-identical-by-default" GOs are **conditional** on the still-open fusion-bonus unit test.
- **C4-A is not a clean one-line flip** — the deferred/canonical save path is receipt-excluded, and the flag is overloaded (also enables near-duplicate hints).
- **C4-B's `derived_id` must include anchors** or the legacy anchor-inclusive UNIQUE backfill rejects.
- **C5-B is a reorder-of-ties**, not a stabilization — the comparator is already total via the unique rowid; C5-B's value is content-derived stability (survives id reassignment / cross-DB), which downstream byte-caches may notice.

## C. Single most-likely-wrong + unverified residuals

- **THE single most-likely-wrong (whole campaign): the C8 verdict.** Its seam moved once under adversarial pressure, and its leverage rests on the threat model — *is "who can write a memory" a real injection vector?* Round O found the loop does close (arbitrary `memory_save` content → secrets-only scrub → raw HOT-tier render → agent loop). But if memories are effectively trusted-author-only, C8 down-scopes toward a no-op. **006 refinement:** the broad *cross-cutting* C8 generalization was **refuted/reachability-gated** (Code-Graph render is JSON-escaped + trusted-source; the Deep-Loop prompt-pack sink is dead-code), so C8 stays **Memory-scoped**. The robust surviving residual is the **`source_kind`-gated content-body escaper** (`render.ts:81-97` primitive promoted onto the recalled body, gated by the already-stored `source_kind`; the tag survives to render but is never consumed there — see `04`), which is *more durable* than the threat-model down-scope above.
- **006 runner-up-wrong (procedural write-path):** procedural-outcome-ranking is **PROXY-ONLY** — no execution-success emitter exists (the Completion-Verification gate has zero skill attribution; only recommendation-acceptance is captured), so Beta-reliability-over-execution-outcomes is a **net-new write-path build**, not a free byproduct of a present signal.
- **C3-B four-timestamp additivity is UNVERIFIED at source** — no migration spec exists to read; "additive-M, no reader rewrites" holds only if C3-C "Current" reads stay on `active_memory_projection`. If "Current" replaces the projection with causal edge-presence reads, the cost crosses to **L** (~12 JOIN sites / 2 writers).
- Q2 residual (different axis): the session/prompt-context renderers were partly traced; the confirmed unescaped path is `getTieredContent` HOT-tier.
- The peck ≈ newInfoRatio convergence is the **non-consumption sub-defect** specifically; newInfoRatio is dormant in the *structured* convergence module only (the prose loop does consume it).

## D. Source-of-truth note (the structured artifacts lag the narrative)

The per-child `findings-registry.json` and `deep-research-dashboard.md` do **not** record the withdrawn/downgraded dispositions and show stale "next focus" pointers. **Authoritative synthesis = these `synthesis/*` docs + `roadmap.md` + the per-child `research.md` (esp. `005-revisit-027/research/research.md` and `006-sibling-revisit/research/research.md`).** Do not read the registry/dashboard as the verdict record.

**006 deviation (a different shape from the registry-lag above):** child 006 has **no `deltas/`, no per-iteration `iterations/*.md`, and no dashboard** — its per-iteration findings were consolidated directly into `006-sibling-revisit/research/research.md` (sole-authoritative), and `006-sibling-revisit/research/deep-research-state.jsonl` carries the 50-row count. For 006 the `research.md` ledger *is* the raw record; there is no structured artifact to cross-check it against (so the 006 ledger's internal tally was re-reconciled during the fresh-agent synthesis review).

**Flagged doc-defect (006, no-transfer but worth recording):** the Code-Mode `SKILL.md` describes its transport as "atomic," but the tested CM-025 behavior is "best-effort, no rollback" — a documentation/behavior contradiction (no-transfer to the memory packet, but a real correctness-of-docs caveat).
