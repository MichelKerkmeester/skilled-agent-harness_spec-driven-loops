---
title: "Implementation Summary: sk-doc Spec Consolidation [skilled-agent-orchestration/143-sk-doc-spec-consolidation/implementation-summary]"
description: "Outcome of folding fifteen documentation-authoring packets into the sk-doc track via a full-track two-phase interleave: move, scoped reference repair, offline regeneration, root-JSON authoring, and regression-neutral-or-better validation."
trigger_phrases:
  - "sk-doc consolidation summary"
  - "sk-doc track result"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-doc-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration executed, regenerated, and validated regression-neutral-or-better"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Summary: sk-doc Spec Consolidation

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
| **Branch** | `skilled/0049-sk-doc-spec-consolidation` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The `sk-doc` track consolidated into a single contiguous chronological sequence:

- **15 documentation-authoring packets folded in from `skilled-agent-orchestration/` + the whole track interleave-renumbered to 001–019** (chronological by creation date); slugs preserved from source. SAO movers landed at `001`–`014` and `016`; the four pre-existing sk-doc packets shifted `014-sk-doc-parent→015`, `016-benchmark-authoring-centralization→017`, `015-sk-doc-router-alignment→018`, `017-hyphen-naming-convention→019`; `999-create-diff-mode` kept unchanged as a separate preview marker.
- **Two-phase `git mv`** (old → `__mig_tmp_` → final) preserved rename history without transient collisions — mandatory because the entire track shifts and target numbers collide with live packets during the shuffle.
- **Reference repair** scoped to the migrated tree: category-qualified rewrites (`skilled-agent-orchestration/`, `sk-doc/`, `z_archive/` origins) applied before slug-qualified bare-number rewrites, order-safe (no rewrite output equals another's input). The bare-rewrite left boundary excludes `/` so dead-category `03--commands-and-skills/…` paths stayed intact. Residual stale-identity in load-bearing `.md`/`.json`: **0**.
- **Metadata regenerated** for every phase-parent folder (`backfill-graph-metadata.js --spec-folder`), with the global DB mtime unchanged. The track root — which `backfill` refuses as a non-`NNN-` folder — got a hand-authored `spec.md` plus a `source_fingerprint` recomputed via the validator's own `computeSourceFingerprintForFolder`, and its `manual.related_to` set to a schema-valid object. Result: **0 fingerprint mismatches tree-wide**.
- **Track-root surface authored**: `sk-doc/graph-metadata.json` children_ids list all 20 packets (`001`–`019` + `999`) plus `z_archive`; `spec.md`, `description.json`, and `context-index.md` (the migration bridge with the renumber table) created. The 15 movers are pruned from the SAO root children_ids at landing (against origin's current SAO root, not the stale worktree copy).


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Recon + classification** — enumerated candidates, confirmed 15 clear movers, excluded `017-cmd-create-prompt`, `032`, `077`, `069`, `072` (borderline/doc-adjacent, operator-kept in SAO) and `112-advisor-doc-trigger-harvest` (advisor-owned), and captured a full-depth pre-migration baseline (94 errors over 56 source-path folders).
2. **Isolated worktree** — allocated `skilled/0049-sk-doc-spec-consolidation` off the origin tip via the sk-git allocator.
3. **Move** — two-phase git-mv'd the whole track into `sk-doc/001-019` (2404 renames).
4. **Scoped reference repair** — qualified-before-bare, slug-qualified rewrites (1797 files changed).
5. **Offline regeneration** — per-folder `backfill-graph-metadata`, track-root spec + JSON authoring, root fingerprint recompute, and children_ids reconciliation (DB-free).
6. **Verification** — full-depth per-packet recursive strict-validate vs the captured baseline, a tree-wide source_fingerprint integrity re-derive (0 mismatches), a deterministic self-identity-vs-disk detector (0 corrupted refs), and an independent GPT-5.6-LUNA read-only audit.


<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Two-phase git-mv** (over single-phase): the whole track shifts numbers, so target numbers collide with live packets during the shuffle; the tmp step removes all transient collisions.
- **15 clear movers only** (operator): `017-cmd-create-prompt` is prompt-authoring (arguably sk-prompt); `032`/`077`/`069`/`072` are borderline doc-adjacent; `112` is advisor-owned — all kept in SAO.
- **999 kept separate** (operator): the create-diff preview marker stays at `999`, outside the chronological `001`–`019` interleave.
- **`/`-excluded bare-rewrite left boundary**: moved packets carry dead-category `03--commands-and-skills/012-…` paths; excluding `/` from the left boundary kept those legacy refs byte-intact instead of half-corrupting them.
- **Root authored to the skill-advisor pattern, not the sk-prompt pattern**: a hand-authored root `graph-metadata.json` is "live" generated metadata, which flips on the enforced canonical-save checks the old bare root saw as "not applicable". Rather than ship the sk-prompt root's 5-error profile (placeholder fingerprint + bare-string `related_to` + no root spec.md), the root got a real `spec.md` + recomputed `source_fingerprint` + populated `source_docs` + object-shaped `related_to` (mirroring the just-landed system-skill-advisor root), taking it from 5 errors to 2 — only `FOLDER_NAMING` and the `packet_pointer` single-segment rule, both inherent to any skill-named track root and identical to the old root's 2. Net root delta: neutral.
- **Error count, not the RESULT label, is the regression metric**: the validator labels any warning-bearing folder "RESULT: FAILED"; measuring errors avoided a false regression signal.


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- **Structural**: `sk-doc` = 19 contiguous folders `001`–`019` plus the separate `999`, no gaps/dups/temp; the 15 movers absent from SAO top-level.
- **Reference (migration-created)**: residual grep for the OLD mover paths (`skilled-agent-orchestration/<mover>`) in self-identity fields = **0**; **0** broken qualified `sk-doc/NNN-…` self-refs — so the migration created zero broken current-track identity, and the prefix-collision class from the skill-advisor consolidation is ruled out by the right-boundary-anchored bare rewrite. Residuals to old mover paths remain only in frozen `.out`/`.codexlog` transcripts (historical, deliberately untouched).
- **Reference (pre-existing debt, LUNA-surfaced)**: a comprehensive self-identity-vs-disk resolver (any prefix, whole tree incl. grandchildren) found **258 non-resolving self-identity refs** in the moved packets' nested docs — pointing to ancient numbers (`125-sk-doc-parent`, `117-skill-anchor-toc-removal`, `133-catalog-playbook`, `025-cmd-create-feature-catalog`), the dead `03--commands-and-skills/` category, and unqualified bare cells. These are **pre-existing** (the packets carried them from prior reorgs), proven by identical origin-vs-worktree occurrence counts for every such token (e.g. `125-sk-doc-parent` 238=238, `03--commands-and-skills` 2426=2426) and net-zero add/remove in the migration diff. They predate and are untouched by this consolidation — out of scope under SCOPE LOCK, consistent with the prior consolidations. The initial `sk-doc/`-prefixed-only detector reported 0 because it skipped non-`sk-doc/` self-refs; the independent LUNA audit caught the blind spot, and the comprehensive re-check confirmed 0 are migration-created.
- **Migration-invariant validators**: child-drift, disk-path-consistency, graph/description shape, per-packet folder-naming — all PASS; source_fingerprint integrity 0 mismatches.
- **Regression baseline**: pre-migration full-depth baseline = 94 errors over 56 folders. The post-migration per-packet recursive re-validate covers 123 folders + the root (deeper than the baseline's shallower capture) and totals 143 errors, but **0 folders gained errors** on the identical (slug-matched) set, and the error-TYPE deltas are all safe: `SPEC_DOC_INTEGRITY` held flat at **16 → 16** (the reference-repair introduced zero broken refs), `GENERATED_METADATA_INTEGRITY` **3 → 0** and `GENERATED_METADATA_DRIFT` **1 → 0** (regen fixed four), and the increases (`FILE_EXISTS` +16, `SECTION_COUNTS` +17, `LEVEL_MATCH` +17, `ANCHORS_VALID` +1) live entirely in the 67 additional grandchild folders the baseline never validated — all pre-existing template/scaffold debt types a rename/repair/regen cannot create.
- **Independent audit**: GPT-5.6-LUNA (max, read-only) audited contiguity, stale-identity/over-rewrite, root metadata, reference correctness, and the record packet against files on disk. It confirmed A (contiguity) and the record packet clean, and surfaced the pre-existing self-identity debt (invariant B) that the first detector's blind spot had hidden — a true observation of a pre-existing condition, verified above as not migration-created. (LUNA was gtimeout-bounded and did not emit a final deduplicated verdict; its raw B categories were reconciled by the deterministic origin-vs-worktree count comparison.)


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

- **Pre-existing doc-quality debt** in the migrated packets (template headers/anchors/scaffold markers/section counts/level match) remains — deliberately untouched (SCOPE LOCK). The deeper per-packet validation surfaced more of it than the baseline's shallower capture, but none is migration-created.
- **258 pre-existing stale self-identity refs** in the moved packets' nested docs (ancient-number/dead-category/unqualified self-identity from prior reorgs) remain — verified pre-existing (origin-vs-worktree count parity) and left as-is per SCOPE LOCK, consistent with the prior consolidations. A future dedicated cleanup packet could normalize them; it is not this migration's scope.
- **Cross-tree references** to the moved packets' old SAO paths (in other tracks/skills) are left as-is, consistent with the scoped-repair rule; memory search may resolve stale old paths until a future reindex.
- **Memory/vector reindex** skipped per operator.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

- **Executor**: the mechanical move + rewrite ran as deterministic scripts for correctness, with GPT-5.6-LUNA applied to independent verification (consistent with the CLI + mcp-tooling + sk-prompt + skill-advisor consolidations).
- **perl `-0` slurp bug**: the first reference-repair pass used `perl -0`, which set `$/` to null and collapsed the substitution file into one record (0 substitutions, "files changed: 0"); removing `-0` restored per-line reads and the pass changed 1797 files.
- **Root fingerprint recompute + schema fix**: `backfill-graph-metadata.js` refuses the non-`NNN-` track root, so its `source_fingerprint` was recomputed directly via the validator's own `computeSourceFingerprintForFolder`, and `manual.related_to` was corrected from a bare string to a schema-valid `packetReferenceSchema` object (the same latent shape defect the sk-prompt root shipped with).
- **Baseline depth asymmetry**: the pre-migration baseline captured 56 folders; the post-migration re-validate ran per-packet `--recursive` and reached 123, so the raw totals are not directly comparable. The regression claim rests on the slug-matched per-folder delta (0 gained), the flat `SPEC_DOC_INTEGRITY` count, and the origin-vs-worktree self-identity count parity — not the raw total.
- **Self-identity detector blind spot (lesson)**: the first detector only resolved `sk-doc/`-prefixed self-identity fields and reported 0, missing 258 non-`sk-doc/` pre-existing stale refs. The independent LUNA audit caught this. A self-identity-vs-disk detector MUST resolve refs of ANY prefix against the full specs tree, and the pre-existing-vs-regression call MUST be made by comparing token occurrence counts against origin — not by the post-migration count alone.


<!-- /ANCHOR:deviations -->
---
