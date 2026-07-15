---
title: "Implementation Summary: system-skill-advisor Spec Consolidation [skilled-agent-orchestration/142-skill-advisor-spec-consolidation/implementation-summary]"
description: "Outcome of folding 4 stranded skill-advisor packets into the system-skill-advisor track via a full-track two-phase interleave: move, scoped reference repair, offline regeneration, root-JSON reconciliation, and regression-neutral-or-better validation."
trigger_phrases:
  - "skill-advisor consolidation summary"
  - "system-skill-advisor track result"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/142-skill-advisor-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration executed, regenerated, and validated regression-neutral-or-better"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Summary: system-skill-advisor Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-07-15 |
| **Branch** | `skilled/0048-skill-advisor-spec-consolidation` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The `system-skill-advisor` track consolidated into a single contiguous chronological sequence:

- **4 stranded packets folded in + the whole track interleave-renumbered to 000–017** (chronological): `004-skill-advisor-refinement`→`001`, `051-skill-advisor-reindex-and-stress-test`→`002`, `070-ambiguity-window-confidence-fix`→`003` (all three moved from SAO and predate the old track), `112-advisor-doc-trigger-harvest`→`012` (moved from SAO); the 13 existing packets shifted `001→004, 002→005, 003→006, 004→007, 005→008, 006→009, 007→010, 008→011, 009→013, 010→014, 011→015, 012→016, 013→017`; `000-migration-from-system-speckit` kept as the anchor.
- **Two-phase `git mv`** (old → `__mig_tmp_` → final) preserved rename history without transient collisions — mandatory because the entire track shifts and target numbers collide with live packets during the shuffle.
- **Reference repair** scoped to the migrated tree: category-qualified rewrites (both `skilled-agent-orchestration/` and `system-skill-advisor/` origins) applied before slug-qualified bare-number rewrites, so a `skilled-agent-orchestration/004-skill-advisor-refinement` token could not be mangled into `…/001`. Residual stale-identity in load-bearing `.md`/`.json`: **0**. Two in-scope stale self-identity fields were additionally corrected to the current folder basename — folder `003`'s implementation-summary `Spec Folder` value `084-…` (a ghost identity from a prior 084→070 rename that never touched the actual number map) and folder `012`'s value (which the repair had left category-qualified as `system-skill-advisor/012-…`) both set to their bare basename; the `084` **lineage** references (session_id, vitest test names) are historical records and were deliberately preserved.
- **Metadata regenerated** for every phase-parent folder (`backfill-graph-metadata.js --spec-folder`), with the global DB mtime unchanged; the track-root and `000` anchor fingerprints — which `backfill` refuses (track root has no own `spec.md` in the phase-parent sense / anchor edited by sed) — recomputed via the validator's own `computeSourceFingerprintForFolder`. Result: **0 fingerprint mismatches tree-wide**.
- **Track-root JSON reconciled**: `system-skill-advisor/graph-metadata.json` children_ids list all 18 packets `000`–`017` in order; the 4 movers pruned from the SAO root children_ids at landing (against origin's current SAO root, not the stale worktree copy).


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Recon + classification** — enumerated candidates, confirmed the Core 4 movers, excluded 030 (codex skill-routing command), 069 + 072 (skill-description budget/guardrails) per operator, and captured a combined pre-migration baseline (18 errors: SSA 4 + movers 14).
2. **Isolated worktree** — allocated `skilled/0048-skill-advisor-spec-consolidation` off the origin tip via the sk-git allocator.
3. **Move** — two-phase git-mv'd the whole track into `system-skill-advisor/000-017`.
4. **Scoped reference repair** — qualified-before-bare, slug-qualified rewrites (order-safe: no rewrite output equals another's input).
5. **Offline regeneration** — per-folder `backfill-graph-metadata`, root + anchor fingerprint recompute, and track-root children_ids reconciliation (DB-free).
6. **Verification** — recursive strict-validate vs the captured baseline measured by error count (18→8, regression-neutral-and-better) plus a source_fingerprint integrity re-derive (0 mismatches) and an independent GPT-5.6-LUNA read-only audit.


<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Two-phase git-mv** (over single-phase): the whole track shifts numbers, so target numbers collide with live packets during the shuffle; the tmp step removes all transient collisions.
- **Core 4 only** (operator): 030 is a codex skill-routing *command* packet; 069 + 072 are skill-description budget/guardrail work — not owned by the skill-advisor subsystem, so they stay in SAO.
- **112 → 012, strictly by date** (operator): the doc-trigger-harvest packet (06-11) precedes the 07-07 migration/migrated-items hub, so it interleaves before 013 rather than appending.
- **Error count, not the RESULT label, is the regression metric**: the validator labels any warning-bearing folder "RESULT: FAILED"; measuring errors avoided a false regression signal.
- **The 18→8 error drop is a real improvement, not a coverage gap**: regen refreshed stale `source_fingerprint`/specFolder metadata and two in-scope self-identity fields were corrected; the residual 8 are all pre-existing debt types a rename/repair/regen cannot create — `FOLDER_NAMING`×1 (the track root `system-skill-advisor` is a category root, not a `NNN-` packet; inherent to `--recursive`), `FRONTMATTER_MEMORY_BLOCK`×2 (continuity-frontmatter shape debt on the root + 017), `TEMPLATE_HEADERS`/`ANCHORS_VALID`/`SPEC_DOC_SUFFICIENCY`/`SCAFFOLD_NEVER_TOUCHED`×4 (all in folder 001, the ancient 004→001 mover), and `SPEC_DOC_INTEGRITY`×1 (folder 015's cross-tree dangling ref). Out of scope under SCOPE LOCK.
- **In-scope self-identity repair vs. out-of-scope pre-existing debt**: the migration's spec covers "bare self-refs within the migrated tree", so folder 003's and 012's stale `Spec Folder` fields were fixed to the current basename. Folder 015's remaining `SPEC_DOC_INTEGRITY` is a `before-vs-after.md` relative reference into another track (`../../system-speckit/028-memory-search-intelligence/…/changelog-000-013-drift-remediation.md`) that broke when the `028` track was re-nested in prior unrelated work — byte-identical to origin, same-depth renumber cannot have touched it, and repointing it would edit a cross-tree reference — so it is left stale per the scoped-repair rule.
- **SAO-root prune deferred to landing**: origin left `system-skill-advisor` untouched but changed the SAO root; pruning against origin's current root (not the stale worktree copy) avoids resurrecting the already-pruned `093` entry.


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- **Structural**: system-skill-advisor = 18 contiguous folders 000–017, no gaps/dups/temp; the 4 movers absent from SAO top-level.
- **Reference**: residual stale-identity grep = 0 in load-bearing `.md`/`.json` (old-number and old-path forms); residuals remain only in frozen `.out`/`.codexlog` session transcripts (historical, deliberately untouched).
- **Migration-invariant validators**: child-drift, disk-path-consistency, graph/description shape, per-packet folder-naming — all PASS; source_fingerprint integrity 0 mismatches.
- **Regression baseline**: combined pre-migration total errors = 18; post = 8; **zero folders gained errors** (the 3 folders showing `SPEC_DOC_INTEGRITY` post-migration were verified against origin — 003's `084` ghost and 012's `z_archive/112` were already failing pre-migration; 015's cross-tree ref is byte-identical to origin). The reduction is regen fixing stale metadata plus two in-scope self-identity repairs. Remaining 8 errors are pre-existing template/scaffold/frontmatter/naming debt + 1 cross-tree dangling ref, out of scope.
- **Independent audit**: GPT-5.6-LUNA (max, read-only) passed invariants A/C/D/E/F but caught a real **P1 (invariant B)** the count-based and validator-based checks missed: a bare-token prefix collision. The reference-repair token `001-skill-graph` (old top-level) is a literal prefix of the nested child slug `001-skill-graph-metadata-routing-boosts`, so the unanchored rewrite mangled that child's self-identity to a nonexistent `004-skill-graph-metadata-routing-boosts`. It evaded detection because (a) the recursive validate descends only to the 18 top-level packets, not grandchildren, and (b) `backfill` regenerated the child's own `graph-metadata.json` from disk (masking the drift in the other docs). **Fixed and re-verified**: an anchored revert (`004-skill-graph/004-…` → `004-skill-graph/001-…`) across 9 child-side files + the parent children_ids + the README listing; a deterministic tree-wide self-identity detector then reported **0** corrupted refs, and the child's active packet_id/spec_folder/specFolder/packet_pointer all resolve to the correct `001-` path. The two remaining occurrences live in frozen `000-…/review/` transcripts (historical findings that quote the path) and are left per the scoped-repair rule.


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

- **Performance**: all folder regen passes completed unattended.
- **Security**: no destructive op outside the migration path set; no global-DB write from the worktree (mtime-verified `2026-07-02 08:59:29`).
- **Reliability**: all moves preserve git rename history; the token map is deterministic and order-safe.


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Pre-existing doc-quality debt** in the migrated packets (template headers/anchors/scaffold markers) remains — deliberately untouched (SCOPE LOCK).
- **Cross-tree references** to the moved packets' old SAO paths (in other tracks/skills) are left as-is, consistent with the scoped-repair rule; memory search may resolve stale old paths until a future reindex.
- **Memory/vector reindex** skipped per operator.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

- **Executor**: the mechanical move + rewrite ran as deterministic scripts for correctness, with GPT-5.6-LUNA applied to independent verification (flagged deviation from "LUNA does the moves", consistent with the CLI + mcp-tooling + sk-prompt consolidations).
- **Track-root fingerprint recompute**: `backfill-graph-metadata.js` refuses track roots and the sed-edited 000 anchor, so those fingerprints were recomputed directly via the validator's own `computeSourceFingerprintForFolder` — same value the validator checks against.
- **Prefix-collision defect found post-repair (LUNA)**: the bare-token reference-repair, though qualified-before-bare and order-safe against the migration's own map, was NOT right-boundary-anchored, so old token `001-skill-graph` prefix-matched the nested child `001-skill-graph-metadata-routing-boosts`. The residual sweep (which searched for *old* numbers) could not detect this because the over-rewrite produced a *new*, nonexistent token. **Lesson**: a full-tree bare-number rewrite needs a right boundary (or a per-folder disk-existence check on every rewritten self-identity path) whenever a top-level slug can prefix a nested child slug. Caught by the independent LUNA audit + a deterministic self-identity-vs-disk detector, then fixed; no other victim existed tree-wide.


<!-- /ANCHOR:deviations -->
---
