---
title: "Implementation Summary: Hallmark reuse research"
description: "Completed 20-iteration study of the Hallmark design skill; produced a per-asset reuse/learning matrix and a licensing verdict feeding the 016 adoption plan."
_memory:
  continuity:
    packet_pointer: "sk-design/014-hallmark-design-skill-research/001-research"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Research complete (20/20); reuse matrix + MIT verdict feed 016-hallmark-adoption"
    next_safe_action: "Execute the 016-hallmark-adoption phases"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/research.md"
      - ".opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-opencode/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Can we reuse Hallmark for sk-design? Clean-room ADAPT of surgical heuristics into existing modes; MIT allows copy with notice; external assets excluded; no new modes/commands."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: Hallmark reuse research

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 001-research |
| **Level** | 2 |
| **Status** | COMPLETE (research) |
| **Follow-on** | sk-design/016-hallmark-adoption (the 4-phase adoption plan) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A completed deep-research study — two independent GPT-5.6-SOL lineages (cli-codex + cli-opencode), 10 iterations each, no early convergence — each producing a per-asset reuse/learning matrix (COPY/ADAPT/LEARN/INSPIRE-NEW/SKIP), a licensing verdict, ranked adoptions, and an eliminated-alternatives table.

### Files Created / Changed

- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` — the packet record.
- `research/lineages/{sol-codex,sol-opencode}/research.md` — the two syntheses (deliverable).
- `research/**` — fanout state, deltas, prompts.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Cloned Hallmark (MIT, minus `.git`) into `../external/hallmark/`; launched the fanout with a seed mapping Hallmark's 4 verbs to sk-design's 5 modes and forcing a per-asset verdict + licensing check.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Adapt, don't replace.** sk-design's 5 modes already own Hallmark's 4 verbs; fold in surgical heuristics via clean-room adaptation. No 6th mode, no new commands.
- **Licensing:** MIT — copy allowed with notice; clean-room preferred; external images/fonts/third-party assets SKIP.
- **Boundary invariant:** authored/invented design (brand-first) must never enter the measured `DESIGN.md`/`tokens.json`/corpus.
- **Top adoptions:** hero/media fix, multi-page coherence, ~7-15 audit probes, asset manifest, a measured Motion section in `DESIGN.md`, semantic motion character, structural cards, and a new brand-first lane.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Both lineages completed 10/10 iterations [TESTED: `orchestration-summary.json`].
- 158 file citations path/line-range checked (codex adversarial pass) [SOURCE: research/lineages/sol-codex/research.md:185].
- `validate.sh 014 --recursive --strict` → Errors 0 [TESTED: strict validation run].

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Effort estimates are planning-only; no implementation spike ran. Audit-probe precision, brand-first demand, and third-party-notice placement are implementation-phase decisions carried into `016-hallmark-adoption`.

<!-- /ANCHOR:limitations -->
