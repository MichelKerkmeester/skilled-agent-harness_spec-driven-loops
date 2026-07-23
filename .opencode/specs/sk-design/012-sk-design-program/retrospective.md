---
title: "sk-design program retrospective"
description: "What the sk-design program shipped, what was planned but not built, and the opportunities that remain — a per-packet honest accounting across the five themed phases (research, style database, interface commands, hallmark, reviews)."
trigger_phrases:
  - "sk-design program retrospective"
  - "sk-design what shipped what missed"
  - "sk-design opportunities"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program"
    last_updated_at: "2026-07-23T07:04:12Z"

    last_updated_by: "spec-author"
    recent_action: "Author program retrospective from per-packet status"
    next_safe_action: "Operator reviews the opportunities backlog"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# sk-design program retrospective

> An honest accounting of the whole sk-design program, drawn from each packet's recorded `spec.md` status. Read alongside the program `spec.md` phase map.

## 1. SHIPPED

**Research (phase 001) — converged and fed the builds.**
- `001-research/001-research-style-database` — **Complete.** Recommended the sqlite+embeddings DB pattern.
- `001-research/002-research-design-commands` — **Complete.** Drove the `/interface:*` creation-command redesign.
- `001-research/005-gap-remediation-research` (4 lanes: restructure, naming/manifests, DB-fate, commands) — research produced the four remediation designs that governed the build (recorded status lines read "In Progress" but the lineage iterations converged).

**Style database (phase 002) — core built, evolution partial.**
- `002-style-database/001-style-database` — **Implementation complete**, bounded-fixture verified; persistent activation pending the full-corpus go/no-go.
- `002-style-database/002-foundation` — **Complete** (measurement/contract/rollback plane; 69/69 tests).
- `002-style-database/006-library-restructure` — **Complete** for the restructure (G1–G3); the manifest-v2 Checkpoint B was deferred.
- `002-style-database/007-persistent-db-activation` — **Implemented**: build + contract/oracle parity + perf proven; the cutover is human-gated and the default stays `legacy`.
- `002-style-database/008-styles-folder-readmes` — **Complete.**

**Interface commands (phase 003) — fully shipped.**
- `003-interface-commands/001-interface-commands` — **Complete** (16/16 tests): the five `/interface:*` creation commands + shared contract.
- `003-interface-commands/002-retire-design-alias-namespace` — **Complete**: `/interface:*` is the sole public surface.
- `003-interface-commands/003-interface-command-rewrite` — **Implemented**: bodies rewritten to literal creation prompts (a live include-sentinel item was deferred).
- `003-interface-commands/004-interface-command-research-refactor` — **Complete**: thin-router refactor + usefulness improvements applied and verified.
- `003-interface-commands/005-interface-command-benchmark` — **Complete**: structure axis + three live model legs scored.

**The hallmark design system (phase 004) — all five adoption lanes shipped.**
- `004-hallmark-design-system/001-surgical-fixes` — **Complete.**
- `004-hallmark-design-system/002-evidence-envelopes` — **Complete.**
- `004-hallmark-design-system/003-authored-cards` — **Complete.**
- `004-hallmark-design-system/004-brand-first-lane` — **Complete.**
- `004-hallmark-design-system/005-measured-composition-and-retrieval-facets` — **Complete.**

**Reviews & remediation (phase 005) — the shipped work was reviewed and hardened.**
- `005-reviews-and-remediation/001-review-remediation` — **Complete.**
- `005-reviews-and-remediation/003-remediation-program-review` — **Complete**: review executed, findings human-verified.
- `005-reviews-and-remediation/004-post-review-remediation` — **Complete.**

## 2. PLANNED BUT NOT BUILT

**Style-database evolution beyond the foundation — Planned:**
- `002-style-database/003-js-capabilities` — Planned.
- `002-style-database/004-measured-native` — Planned.
- `002-style-database/005-growth` — Planned.
- `002-style-database/009-styles-readme-create-readme-alignment` — Planned.
- `002-style-database/010-manual-testing-playbook-and-db-readme` (+ its two children) — Planned.

**Deferred sub-items within otherwise-shipped packets:**
- `006-library-restructure` Checkpoint B (manifest v2 + shared projector; then remove `retrieval-manifest.json`) — deferred.
- `003-interface-command-rewrite` live include sentinel — deferred.

## 3. GATED (built, not activated)

- **Persistent style DB (`007-persistent-db-activation`)** — the persistent SQLite backend is built and its parity + perf are proven, but the default remains `legacy` until a full-corpus SLO go/no-go (≥30% AND ≥25 ms p95 improvement, or an approved SLO breach) passes. The DB the program set out to build exists but is not the live read path.

## 4. OPPORTUNITIES

1. **Activate the persistent style DB.** It is built and proven; only the SLO go/no-go + a kill-switch-guarded cutover remain (`002-style-database/007-persistent-db-activation`). This is the highest-value, lowest-remaining-effort item.
2. **Finish the style-DB evolution** (js-capabilities, measured-native, growth) once the persistent DB proves its worth in production use.
3. **Land restructure Checkpoint B** (manifest v2 + shared deterministic projector), which stabilizes the DB indexer's source-hash inputs and lets `retrieval-manifest.json` be retired.
4. **Ship the interface-command live include sentinel** deferred from `003-interface-command-rewrite`.
5. **Reconcile the Rust-opportunities verdict** (`001-research/003-styles-database-rust-opportunities`) with the broader `system-speckit` Rust-backend research before any native adoption.
6. **Close the open review** — `005-reviews-and-remediation/002-session-shipped-work-review` is recorded "In Review"; land its findings or mark it complete.
