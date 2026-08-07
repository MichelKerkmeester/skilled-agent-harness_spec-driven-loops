# Iteration 32 (Round N adversarial): skip-closed promoter-fork — DOWNGRADED to theoretical

## Focus
Adversarially verify whether a closed frontmatter edge can actually be hard-deleted in production. Read-only.

## Findings (newInfoRatio 0.7) — DOWNGRADES iteration-012
**VERDICT: REFUTED-THEORETICAL.** Mechanically possible, but no automatic producer + recoverable, so NOT a real latent data-loss risk as framed.
- The frontmatter promoter only ever emits `derived_from` + `enabled` — never `contradicts`/`supersedes` (`frontmatter-promoter.ts:70-92`).
- The only systematic `contradicts` emitter is the OPT-IN supersession backfill (default OFF, `relation-backfill.ts:364`), which is conflict-guarded to SKIP rather than invalidate when a valid conflicting edge already exists on the pair (`:548-555`). So inserting over a pre-existing frontmatter edge suppresses the collision instead of closing the frontmatter edge.
- `sweepCausalEdges` writes a tombstone with `restore_metadata` BEFORE `deleteEdgesByIds` (`sweep.ts:242-269`) → recoverable, not data-loss.
- Reaching `invalid_at` on a live frontmatter pair requires a MANUAL `memory_causal_link({relation:'contradicts'})` + removing the child from `children_ids`. No automatic background path.

**Consequence:** the missing `invalid_at` filter in the cleanup SELECT is real hygiene, but skip-closed-in-sweep is **NOT a Wave-0 gating blocker for C3-A** — it's a low-priority defensive hardening (a manual edge + recoverable tombstone). The M8 "top sequencing constraint" is overstated. LEVERAGE M→L, EFFORT S.

## Most-likely-wrong
Did not exhaustively trace reconsolidation.ts's (source,target) selection to prove a `supersedes` can never align with a frontmatter parent→child pair — but it's a near-duplicate path, not an automatic frontmatter producer.

## Next Focus
Downgrade skip-closed in the ledger: hygiene (still ship it before C3-A as cheap insurance) but NOT the gating data-loss blocker iter-012 framed. Correct the sequencing-constraint headline.
