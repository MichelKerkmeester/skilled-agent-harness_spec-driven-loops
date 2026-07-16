# Iteration 13: External Mining — aionforge consolidation.md + capture.md → Memory

## Focus
Round B mining: consolidation + capture docs for NET-NEW Memory candidates beyond C4-A/B/C/C-G1. Read-only.

## Findings — NET-NEW candidates (7; newInfoRatio 0.58)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| capture-time-near-dup-verdict (near-dup on the HOT path vs nearest active episode, cosine≥0.95, still-written + resemblance on receipt) | handlers/save/dedup.ts:17 (exact SHA + 0.88 thresh); memory-index.ts:696 (repair backfill, async) | M/M | BUILD | CONFIRMED |
| injection-strip-and-flag-on-write (anchored multi-token injection markers stripped + injection_flags on episode, fail-closed) | memory-save.ts:3819 (secret redaction only; injection = GAP) | M/M | BUILD | CONFIRMED-gap |
| durable-retry-budget-and-pass-classify (Transient vs Fatal; max_retries from DURABLE failed-audit, not in-memory; poison-pill→failed+excluded) | quality-loop.ts (in-memory `nies`=2); embedding-pipeline.ts:11 | M/S | FIX | CONFIRMED |
| trust-gated-quarantine-reconcile-signal (quarantine only when either side ≥0.7 trust; surfaced signal; recall excludes by CONTRADICTS edge) | reconsolidation-bridge.ts:114-163 (advisory only) | M/M | BUILD | CONFIRMED |
| detail-retention-summarize-guard (derived summary must name ≥0.9 entities AND mean conf ≥0.6 else skipped-not-written; content-addressed note id) | pe-gating.ts/pe-orchestration.ts (no retention guard = GAP) | M/M | BUILD | CONFIRMED-gap |
| writer-supersedes-hint-evidence (writer names a live episode it replaces; oracle-free validation; stored as Origin.supersedes, never auto-retires target) | causal-links-processor.ts:69 (post-hoc edge, no save-time hint) | L/M | BUILD | CONFIRMED |
| contiguous-prefix-stop-and-startup-reset (tick stops at first non-consolidating episode; cursor tracks only contiguous prefix; reset in_progress→raw on startup) | GAP (no consolidator loop; adjacent to C4-C) | M/M | BUILD | INFERRED |

**Already covered:** C4-A (idempotency-receipts at memory-index.ts:37), C4-B (content-addressed IDs), C4-C (consolidation cursor), C-G1 (cadence tick). The contiguous-prefix-stop + startup-reset is the DURABILITY layer C4-C's cursor needs.

## Key question (for synthesis)
Internal Memory is **doc/chunk-granular — no per-turn "episode" boundary**. aionforge's whole capture↔consolidation split presumes immutable per-turn episodes. Either adopt an episode-boundary model (scope decision) OR graft these capture-side candidates (near-dup verdict, injection-strip, supersedes-hint) onto the existing chunk-save path.

## Next Focus
Capture-side hardening (near-dup verdict, injection-strip) + the durable retry/prefix-stop consolidation layer. Feeds Round C (episode-boundary scope decision).
