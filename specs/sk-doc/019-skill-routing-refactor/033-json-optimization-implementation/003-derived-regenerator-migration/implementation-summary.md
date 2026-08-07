---
title: "Implementation Outcome: Derived Regenerator + Fleet Migration + Freshness Gate"
description: "Shipped: a gitignore-tolerant skill-root derived regenerator, a CI freshness gate wired into routing-registry-drift.yml, and a corpus-neutral fleet pass that pruned one untracked reference; migrated onto v4's 033/sk-create-skill structure."
trigger_phrases:
  - "derived regenerator migration outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration"
    last_updated_at: "2026-07-29T14:03:10Z"
    last_updated_by: "claude-code"
    recent_action: "Built regenerator + freshness gate + CI wiring; corpus-neutral fleet pass"
    next_safe_action: "Phase 004 scaffold-journey delta"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation-003-derived-regenerator-migration-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How the regenerator handles gitignored build/install artifacts referenced in derived — resolved: treat gitignored paths as valid (never prune, never flag stale) so the outcome is stable across built and clean checkouts."
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Derived Regenerator + Fleet Migration + Freshness Gate

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-29 |
| **Track** | sk-doc |
| **Depends On** | Phase 001 (canonical `derived` schema decision — Accepted), Phase 002 (pinned routing baseline) |
| **Blast Radius** | HIGH — the regenerator can write all 11 live skill-root `graph-metadata.json` files the running advisor reads; this pass changed one, corpus-verified neutral |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`regenerate-skill-derived.cjs` — a preserve-first skill-root derived regenerator that keeps authored fields (`causal_summary`, the TS lifecycle/redirect capabilities) verbatim and prunes only structural references (`key_files`, `source_docs`, `entities`) that no longer resolve to a real file. `ci-skill-derived-freshness.cjs` — a fleet gate mirroring the existing leaf-manifest freshness pattern (regenerate in memory, compare, fail on drift), wired into `routing-registry-drift.yml`'s class-contract step alongside the root-metadata and leaf-manifest gates. `tests/skill-derived-regenerator.test.cjs` — unit coverage for the repair logic and the gate. This is the 3/3-lineage-agreed O1 finding from the 029 research: the `derived` block had no regenerator and no freshness gate, so it could drift silently.

Delivered onto v4's `033`/`sk-create-skill` structure (renumbered + renamed from the original `030`/`create-skill` line by a concurrent session); the tooling relocated cleanly since it resolves the repo root by directory depth, not a hardcoded path.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Setup confirmed this phase's 001/002 inputs are byte-identical to the line it was authored against (same ADR-001 Python-core-plus-TS-additive decision, same pinned corpus hash `9f30cc5e…`), so the work is drop-in compatible. A first dry-run flagged two roots as stale — both because their `derived` referenced files absent from a clean checkout: system-spec-kit's `scripts/dist/memory/generate-context.js` (a gitignored build artifact) and mcp-code-mode's `mcp-server/package.json` (untracked). The naive prune of the build artifact would have dropped real routing signal, so the regenerator gained **gitignore-tolerance**: a path that does not exist on disk but is gitignored is treated as valid (it is real on a built/installed tree). system-spec-kit's dist reference is therefore preserved untouched; mcp-code-mode's `package.json` — untracked, not gitignored, genuinely not part of the committed tree — is pruned, which is the correct alignment of the derived block to committed reality.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Gitignore-tolerant existence check (new this migration).** A derived reference may legitimately point at a build or install artifact that is present on a built tree but absent from a fresh worktree or an unbuilt CI runner. Pruning it would drop routing signal and make the fleet's derived blocks diverge by checkout state, and a freshness gate that failed on such references would red every clean checkout. So `keyFileExists`/`skillFileExists` now treat a gitignored path as present. This keeps the gate CI-safe in the dependency-light `routing-drift` job with no build step. **Preserve-first, never overwrite `causal_summary`** — it is authored judgment. **Additive CI wiring** — one script, one workflow line, revertible independently of any data change.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Confirmed in the worktree:
- Regenerator dry-run across all 11 roots: 10 unchanged, 1 change (mcp-code-mode prunes its untracked `package.json` reference); system-spec-kit's gitignored dist reference preserved.
- `ci-skill-derived-freshness.cjs` → `checked=11 fresh=11 stale=0 errored=0`, exit 0 — passes on a clean checkout (no build) via gitignore-tolerance.
- `tests/skill-derived-regenerator.test.cjs` → passes.
- **Corpus neutrality (HIGH-blast gate):** the pinned-regime top-3 capture is **176/195 full, 53/72 holdout — identical with and without this phase's change** (verified by capturing with the change reverted, the change applied, and adjacent already-shipped work reverted; all three identical). The change does not move routing.
- Only `mcp-code-mode/graph-metadata.json` changed among live roots (one untracked reference pruned).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The pinned 002 baseline records holdout top-3 at 55/72 (0.7639); the current v4 base measures 53/72 (0.7361). This 2-prompt gap is **pre-existing on v4 and independent of this phase** — it is present with all of this session's work reverted, so it is either a stale-scorer-dist measurement artifact (the capture runs against a separately-built dist) or a concurrent-session routing change, and is out of this phase's scope to resolve. This phase does not decide the canonical schema authority (001's job, consumed as input), does not touch intent-signal quality (O6) or command-metadata ingestion (O7), and does not fix system-spec-kit's derived reference pointing at a build artifact rather than its source (`scripts/memory/generate-context.ts`) — tolerated here rather than repointed, to keep this pass strictly corpus-neutral; a source-repoint is a separate content decision.
<!-- /ANCHOR:limitations -->
