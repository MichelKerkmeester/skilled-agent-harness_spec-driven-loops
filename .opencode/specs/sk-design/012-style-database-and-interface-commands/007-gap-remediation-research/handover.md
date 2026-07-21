# Handover — sk-design Styles Library & /interface:* Commands Remediation

> Program-level handover. The gap research is DONE; four evidence-backed decisions are made
> (one overridden by the operator). Below: the decisions, the current state, and the
> dependency-ordered roadmap the next session executes.

---

## 1. Where we are

The operator flagged structural + strategic gaps in `sk-design/styles/**` and the `/interface:*`
commands (evidence-confirmed in `gap-analysis.md`). Four **forced 5-iteration GPT-5.6-SOL** research
runs (`007/00{1..4}/research/…/research.md`, no early convergence, $0, 0 failures) produced
evidence-backed remediation designs. `synthesis.md` is the cross-gap roadmap. **All research is
read-only — nothing in the styles tree or commands was changed.**

## 2. Decisions (LOAD-BEARING)

| Gap | Research verdict | **Operator decision** |
|---|---|---|
| **003 DB-fate** | shelve (85 vs 54) | **⚑ OVERRIDDEN → WIRE / BUILD IT.** The shelve verdict was explicitly *conditional* on the future roadmap being speculative. Operator: "the original point was to actually build it, so we can use it for features we do not have yet." Future-leverage is a **committed** direction → build the DB as forward infrastructure. |
| 001 restructure | shallow ownership tree | ✅ proceed |
| 002 naming+manifests | kebab rename + consolidate | ✅ proceed |
| 004 commands | rewrite bodies to literal prompts | ✅ proceed (operator's *original* ask) |

**The 003 override cascades:** the research's §10 "Wiring Plan If Kept" + its reactivation gates are
now the **build roadmap + cutover acceptance criteria** (not a deprecation). With the DB kept, the
restructure's `database/` dir holds a **real** git-ignored sqlite, and `_db → database/` is a genuine
**rename** (not a deletion). Build-DB and restructure are now complementary.

## 3. Dependency-ordered roadmap (what the next session builds)

Each becomes its own implementation packet. Recommended order:

1. **DB BUILD (the wire decision) — the anchor effort.** Home: `015-styles-database-evolution` (NOT
   superseded — it's the active build packet). Steps from research §10:
   - **First decision (blocking): distribution policy** — checked-in immutable generation binary
     (under a size policy) **vs** mandatory install/prewarm. **Never** lazy query-time builds
     (integrity-sensitive reads must not mutate/walk the corpus). *Operator must pick a or b.*
   - Build + publish the first real full-corpus generation (index all 1,290 styles), capture
     size/build-time/RSS.
   - Own the lifecycle: extraction→rebuild/reconciliation, refresh, monitoring, repair.
   - Shadow → prove facade/oracle parity + relevance → gate the cutover → flip default with a
     legacy kill-switch + observation window. Keep `retrieval-manifest.json` (flat freshness contract).
2. **STYLES RESTRUCTURE (001+002) — coupled with the build.** Shallow ownership tree:
   `library/` (data) · `lib/` (source) · `scripts/` · `database/` (git-ignored sqlite) · `tests/` ·
   `docs/`; preserve 17 modules 1:1 + add `lib/paths.mjs`; no compat aliases; migrate through 2 green
   mixed states. Kebab rename map: `_db→database`, `_engine→engine`, `_harness→harness`,
   `_manifest.json→manifest.json`, `_retrieval-manifest.json→retrieval-manifest.json`.
3. **COMMAND REWRITE (004) — independent, smaller, operator's original ask.** Rewrite `/interface:*`
   command bodies to literal self-contained design prompts; expand the shared lifecycle once via
   `@.opencode/skills/sk-design/shared/creation-contract.md` (OpenCode 1.18.4 confirmed); taste stays
   in the mode; reconcile wrapper/presentation/YAML/metadata atomically. Can run in parallel.

## 4. Current artifacts + state

- **Worktree:** `.worktrees/0093-sk-design-012-gap-research` (branch `sk-design/0093-012-gap-research`, off v4 tip).
- **This packet (`007`):** `gap-analysis.md` (evidence), `synthesis.md` (roadmap), `handover.md` (this),
  `spec.md`, + 4 research children each with `research/…/research.md`.
- **Detail lives in:** `00{1..4}/research/lineages/sol-high-fast/research.md` (441/337/231/319 lines).
- **Commit status:** committing `007` to v4 as a research delivery (research complete; implementation pending).
  The 4 research children are **research-artifact holders** (spec.md + research/), not implementation
  packets — full Level-2 docs are authored in the implementation packets, not here.

## 5. Also shipped this session (context, already on v4)

- Deep review (DeepSeek + MiniMax, 10 iters) → 2 P1s found + fixed → `cb0ad1cc4b`, `72c4f8e57f`.
- Main tree synced to v4 (clean, current). 020 deep-loop artifacts preserved outside the repo.

## 6. How to resume

Read `007/synthesis.md` (roadmap) + `gap-analysis.md` (evidence) + the relevant `research.md`. Start
with the **distribution-policy decision** (§3.1) — it blocks the DB build. Then open the DB-build packet
under `015`, and (in parallel) the command-rewrite packet. The 003 WIRE decision is the one thing that
must not be re-litigated as "shelve" — it's an operator call.
