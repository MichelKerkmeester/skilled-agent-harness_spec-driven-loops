---
title: "Implementation Summary: Rust opportunities research"
description: "Completed 20-iteration deep-research study on what Rust could add/improve for the sk-design styles database. Verdict: no Rust now."
_memory:
  continuity:
    packet_pointer: "sk-design/013-styles-database-rust-opportunities"
    last_updated_at: "2026-07-20T07:07:01Z"
    last_updated_by: "spec-author"
    recent_action: "Research complete (20/20); verdict = no Rust now, JS-first + measurement"
    next_safe_action: "Adopt the roadmap via sk-design/015-styles-database-evolution"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-codex/research.md"
      - ".opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should the styles DB be rewritten in Rust? No — the hot path is already native; value is in new JS-first capabilities, Rust only if measured."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: Rust opportunities research

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 013-styles-database-rust-opportunities |
| **Level** | 2 |
| **Status** | COMPLETE (research) |
| **Follow-on** | sk-design/015-styles-database-evolution (the adoption plan) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A completed deep-research study — two independent GPT-5.6-SOL lineages (cli-codex + cli-opencode), 10 iterations each, no early convergence — each producing a ranked opportunity matrix + phased path + eliminated-alternatives table.

### Files Created / Changed

- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` — the packet record.
- `research/lineages/{sol-codex,sol-opencode}/research.md` — the two syntheses (deliverable).
- `research/**` — fanout state, deltas, prompts, dashboards.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Launched via `fanout-run.cjs` (loop-type research), seeded with the residency grounding so iterations hunted capability-unlocks rather than re-deriving that the hot path is native.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **No Rust rewrite now.** SQLite/FTS5 are already native; the JS math (cosine/RRF/tokenizer) is tiny + parity-sensitive over ~1,290 bundles, off by default — fails the residency/materiality/scale gates.
- **The real prize is new capability, JS-first:** local multimodal inference (text + CLIP screenshot embeddings) via Node ONNX/Transformers.js/Sharp; a Rust core only later, if measurements or a second consumer justify it.
- **Rejected:** porting the hot path, custom Rust SQLite extension, custom HNSW today, Rust file-watcher, Rust hashing.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Both lineages completed 10/10 iterations [TESTED: research/orchestration-summary.json].
- Findings residency-honest; no native-work credited [SOURCE: research/lineages/sol-opencode/research.md:196].
- `validate.sh 013 --strict` → Errors 0 [TESTED: strict validation run].

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

No production query trace, chosen embedding model, or labeled relevance set yet — every Rust recommendation is conditional on measuring first. Those measurements are Phase-0 work in the follow-on plan (015).

<!-- /ANCHOR:limitations -->
