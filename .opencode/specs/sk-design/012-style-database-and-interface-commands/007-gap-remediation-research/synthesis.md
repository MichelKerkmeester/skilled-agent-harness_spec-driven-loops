# Gap-Remediation Research — Consolidated Synthesis

> Pulls the four forced 5-iteration GPT-5.6-SOL research runs into one remediation
> roadmap. Each gap's full evidence-backed plan is in `<child>/research/.../research.md`;
> this doc is the cross-gap decision + sequencing layer. Research is read-only; nothing
> in the styles tree or commands was changed.

---

## The four findings

### 003 — DB fate → research said SHELVE; **⚑ OPERATOR DECISION: WIRE / BUILD IT**
> **Operator override (final):** build the DB as forward infrastructure — "the original point was
> to actually build it, so we can use it for features we do not have yet." The shelve verdict below
> was explicitly *conditional* on the future roadmap being speculative; it is committed, not
> speculative. So the research's §10 **Wiring Plan** is now the build roadmap and the reactivation
> gates become the build/cutover acceptance criteria. Do **not** re-litigate this as "shelve."

The research reasoning, for the record (why it defaulted to shelve): formally shelve the dormant
SQLite runtime; keep the flat-file engine as the single
supported retrieval source. Weighted decision **85 (shelve) vs 54 (wire)**. Rationale: the
implementation is mature but there is **no product case now** — no SQLite generation on
disk, no workload trace, no human relevance set; all four design-mode consumers use only
bounded flat-file hydration through the storage-neutral facade. This is a **reversible "not
now"** with explicit reactivation gates (workload, materiality, ownership, parity, relevance,
demand). Deprecation removes `_db` runtime + `persistent-adapter.mjs` + `SK_DESIGN_STYLE_DB_MODE`,
routes `runQuery`/`runHydrate` straight to flat, and **keeps `retrieval-manifest.json`** (it is
the *flat* engine's freshness contract, not a DB artifact). Marks `015-styles-database-evolution`
superseded.

### 001 — Restructure → shallow ownership tree
The `styles/` root mixes **7,800 tracked files** (1,290 six-file bundles + 60 backend files) —
an ownership problem, not a retrieval problem. Target: `library/` (committed data) · `lib/`
(importable source) · `scripts/` (extractor) · `database/` (git-ignored mutable SQLite state) ·
`tests/` · `docs/`. Preserve all 17 modules 1:1, add only `lib/paths.mjs`, **no** compat aliases.
Migration through **two green mixed states** (decouple paths → move code/tests → move bundles +
flip defaults + verify ladder).

### 002 — Naming + manifests → kebab rename + consolidation
Rename map: `_db/`→`database/`, `_engine/`→`engine/`, `_harness/`→`harness/`,
`_manifest.json`→`manifest.json`, `_retrieval-manifest.json`→`retrieval-manifest.json`. **Two
checkpoints:** A = renames + reference updates at byte parity; B = versioned `manifest.json`
schema + shared projector, then remove `retrieval-manifest.json`. Source-of-truth model:
`manifest.json` = harness-owned corpus authority; per-style files = design content; a shared
deterministic projector derives retrieval records; the DB generation manifest stays distinct.

### 004 — Commands as literal prompts → rewrite bodies, keep architecture (your original ask)
Preserve the `/interface:*` architecture; **rewrite the command bodies** so each literally tells
the agent what to create/diagnose, why quality matters, what context to resolve, the outcome, and
the evidence ceiling. Expand the shared lifecycle **exactly once** via the runtime include
`@.opencode/skills/sk-design/shared/creation-contract.md` (OpenCode 1.18.4 confirmed — this
**resolves the prior research's open shared-fragment question**). Taste (palettes, type, timings,
verdicts) stays in the mode. Reconcile wrapper/presentation/YAML/metadata atomically.

---

## Cross-gap dependencies + sequencing

1. **003 (BUILD) is the anchor.** With the DB **kept and built**, `database/` holds a **real**
   git-ignored sqlite and `_db/`→`database/` is a genuine **rename** — build-DB and restructure are
   **complementary**, not conflicting. The **distribution-policy decision** (checked-in binary vs
   install-time prewarm; never lazy build) blocks the build — decide it first.
2. **001 + 002 are one restructure effort** — the rename map (002 Checkpoint A) is a facet of the
   move (001). `retrieval-manifest.json` is renamed in this work (003 explicitly defers its rename here).
3. **004 (commands) is independent** — it touches `commands/interface/*` + `creation-contract.md`,
   not the styles tree. It can proceed in parallel and is the deliverable you originally asked for.

**Recommended order:** 003 decision → (004 command rewrite ‖ 001+002 restructure).

---

## Operator decisions

- **003 DB-fate — DECIDED → WIRE / BUILD** (forward infrastructure; the deletion/shelve scope is void).
- **Open + blocking the build: distribution policy** — checked-in immutable generation binary (size
  policy) **vs** install-time prewarm. Never lazy query-time build. *This is the first thing to pick.*
- **Threshold** (research §9): the ≥30% + ≥25 ms p95 becomes the **cutover acceptance gate** (prove
  persistent beats legacy before flipping the default), not a shelve trigger — confirm when shadow data exists.
- **Sequencing** — 004 commands (independent, your original ask) ‖ DB-build + restructure (coupled).

---

## Where the detail lives

| Gap | Full research |
|---|---|
| Restructure | `001-restructure/research/lineages/sol-high-fast/research.md` (441 lines) |
| Naming+manifests | `002-naming-manifests/research/lineages/sol-high-fast/research.md` (337 lines) |
| DB fate | `003-db-fate/research/lineages/sol-high-fast/research.md` (231 lines) |
| Commands | `004-commands/research/lineages/sol-high-fast/research.md` (319 lines) |

Each ran 5/5 forced iterations (no early convergence), GPT-5.6-SOL high/fast, $0, 0 failures.
