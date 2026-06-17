---
title: "Implementation Summary: Agent mirror repoint"
description: "Phase 005: repointed the five native deep-loop agent bodies (deep-context, deep-research, deep-review, deep-improvement, ai-council) across all three runtime mirrors (.opencode, .claude, .codex), holding three-way body parity and the ai-council persist-artifacts.cjs/output_schema.md lockstep. Agent names kept; shipped as part of the deep-loop merge; per-phase checklist was not independently gate-run."
trigger_phrases:
  - "deep-loop-workflows phase 005 summary"
  - "agent mirror repoint shipped"
  - "three-way agent parity done"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/005-agent-mirror-repoint"
    last_updated_at: "2026-06-16T07:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Wrote phase 005 impl-summary from spec/plan/tasks/checklist evidence"
    next_safe_action: "Reconcile per-phase checklist evidence if a standalone gate run is required"
    blockers: []
    key_files:
      - ".opencode/agents/"
      - ".claude/agents/"
      - ".codex/agents/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-005-impl-summary-remediation-156"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Per-phase checklist was not fully gate-run; the phase shipped inside the deep-loop merge"
---
# Implementation Summary: Agent mirror repoint

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 005 of 009 |
| **Status** | Shipped (as part of the deep-loop merge) |
| **Date** | 2026-06-15 |
| **Depends on** | phase 004 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The five native deep-loop agent bodies repointed their skill references onto the merged `deep-loop-workflows` packet across all three runtime mirrors, while keeping agent names and dispatch contracts unchanged:

- **Fifteen agent mirror files** repointed — the five agents (`deep-context`, `deep-research`, `deep-review`, `deep-improvement`, `ai-council`) each as a real three-file mirror under `.opencode/agents`, `.claude/agents`, and `.codex/agents` (not symlinks), so no runtime is left pointing at an old skill path.
- **The ai-council lockstep contract** — the highest-effort triplet (~27 path edits) — had its agent body, the `persist-artifacts.cjs` literal paths, and `output_schema.md` references rewritten together so the council helper paths all resolve under `deep-loop-workflows/ai-council/`.
- **Three-way body parity** was held per mode (one worker owned all three mirrors of a mode), with the per-runtime "Path Convention" line whitelisted as the only expected diff.
- **Agent names were kept** — the decision that a skill rename does not force an agent rename (the ai-council/deep-ai-council asymmetry is the precedent), so all dispatch identities stayed `deep-context`, `deep-research`, `deep-review`, `deep-improvement`, and `ai-council`.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The repoint ran as a gated phase in the deep-loop merge pipeline after phase 004's command repoint. A serial preflight confirmed the phase-001 baseline, the phase-003 `mode-registry.json`, the completed phase-004 command repoint, and — critically — that the `.codex/agents/*.toml` mirrors are hand-maintained derived files (guarded by the mirror-sync verifier) rather than machine-regenerated, so an edit would not be overwritten by a stale generator. An exact old-to-new repoint map was built for the 15 target files only; then each mode triplet was edited independently from the canonical `.opencode` body and re-aligned across `.claude` and `.codex`. Verification was read-only and cross-cutting: normalized three-way mirror-body parity, stale old-skill-path grep over the target set, Codex TOML parse, and unchanged dispatch names. Read-only analysis and parity capture ran on `gpt-5.5-fast`; the file edits ran on `opus-4.8`; the orchestrator reduced and validated. The five old skill directories stayed live, keeping each mode triplet independently revertible.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Keep the five agent names** — a skill rename does not force an agent rename; the long-standing ai-council/deep-ai-council asymmetry is the precedent, so dispatch contracts stay stable.
- **One worker per mode triplet** — keeping all three mirrors of a mode under a single editor keeps parity local and avoids cross-runtime drift.
- **Confirm Codex TOML is hand-maintained before editing** — the `.codex/agents/*.toml` `developer_instructions` bodies are derived but hand-maintained, so edits are safe; a found active generator would have halted the phase for a scope amendment.
- **Preserve out-of-set references** — `deep-review`'s `sk-code-review/references/review_core.md` reference is intentionally left as-is, and the per-runtime "Path Convention" line is whitelisted as an expected diff.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- The phase shipped as part of the deep-loop merge, which is functionally validated at the runtime level by the **351 `deep-loop-runtime` tests** and the **packet-156 review** covering the merged surface.
- The intent of the phase holds across runtimes: the five agents keep their names, exist as real three-file mirrors, and the ai-council helper paths were rewritten in lockstep with `persist-artifacts.cjs` and `output_schema.md`.
- **The per-phase checklist was not fully gate-run** — `checklist.md` records 0/18 P0, 0/6 P1, and 0/2 P2 verified ("pending execution"), so the normalized three-way parity check, the stale-path grep, the five-file Codex TOML parse, the dispatch-identity check, the phase-001 artifact parity replay, and `validate.sh --strict` on this folder were not independently executed and evidenced at the per-phase level. Completion confidence rests on the merge-level test suite and the packet-156 review rather than this phase's own recorded checklist.
- Structural validation of this spec folder (`validate.sh --strict`) passes after this summary was authored.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The per-phase verification checklist was never marked off item-by-item; its parity, grep, TOML-parse, identity, and baseline-replay evidence rows remain "pending execution" even though the work shipped. A standalone gate run would be needed to convert merge-level confidence into per-phase recorded evidence.
- Phase-001 artifact parity is documented as a behavior-preservation goal with a native-agent-nondeterminism fallback; byte-identical replay hashes are not separately evidenced in this packet, so the strongest available evidence is the merge-level suite plus normalized body parity, unchanged permissions, and unchanged dispatch identities.
- Command YAML (phase 004) and advisor edges (phase 006) were out of scope here; the old skills remained live until phase 009.

<!-- /ANCHOR:limitations -->
