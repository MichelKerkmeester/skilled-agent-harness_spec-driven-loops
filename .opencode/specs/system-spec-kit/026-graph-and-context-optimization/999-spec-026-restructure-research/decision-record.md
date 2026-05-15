---
title: "Decision Record: 999 — 026 restructure research"
description: "Architectural decisions for the 999 research packet and the proposed restructure pattern."
trigger_phrases:
  - "999 decisions"
  - "026 restructure ADRs"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
    last_updated_at: "2026-05-15T22:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored Level 3 decision-record with initial ADRs"
    next_safe_action: "Add ADR-006+ as the synthesis surfaces new decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:5e54e0a4c0a4f08a9f9eaa6f4f88b6e2b5fb1c5d4c2a8f7e2e0c8a5d4f3b2a1c"
      session_id: "999-decision-record"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: 999 — 026 restructure research

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

Architectural decisions for the 999 deep-research packet. ADRs 1-5 cover the research methodology (decided at scaffold time). ADR-6+ get added as the synthesis surfaces decisions for the follow-on restructure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use cli-devin SWE-1.6 as the research executor

**Status:** Accepted
**Date:** 2026-05-15
**Context:** Need a cost-efficient model for 40 read-only iter dispatches that analyze the 026 phase parent. Options: native (Opus) — too expensive at 40 iter; cli-codex (gpt-5.5) — overkill for read-only analysis; cli-opencode (deepseek-v4-pro) — also overkill; cli-devin (SWE-1.6) — coding-specialized + cheap.

**Decision:** cli-devin SWE-1.6, with the deep-loop iter contract from packet 059 (research-iter recipe pinned via `--agent-config`).

**Consequences:**
- Cost: ~40 × $0.10-0.20 per iter ≈ $4-8 total. Affordable.
- Wall-clock: ~5-15 min per iter × 40 ≈ 3-10 hours. Acceptable for autonomous run.
- Quality: SWE-1.6 needs strong per-iter prompt structure (framework / pre-planning / scoped RQ / output contract). Each prompt is pre-authored — no on-the-fly templating.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: 40-iter run with convergence threshold 0.0

**Status:** Accepted
**Date:** 2026-05-15
**Context:** /spec_kit:deep-research supports early-exit on low new-info ratio. For a meta-analysis like 026 restructure, redundant coverage is preferable to undercoverage — the cost of missing a load-bearing context is high; the cost of one extra iter is small.

**Decision:** convergenceThreshold: 0.0 (disables early exit). All 40 iter run regardless of overlap.

**Consequences:**
- Wall-clock cost: 40 iter always, even if iter 20 already covers all material.
- Quality benefit: every track gets its planned coverage; synthesis pass can dedupe.
- No surprise stops: the loop runs to completion.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Pre-authored per-iter prompts (no template engine)

**Status:** Accepted
**Date:** 2026-05-15
**Context:** Initial design considered a bash driver that templates iter prompts from a single skeleton + per-iter variables. User pivoted to "good pre-made prompts etc" — preferring hand-authored prompts over generated ones.

**Decision:** Author all 40 iter prompts up-front as self-contained dispatch payloads. No template engine. Each prompt is editable individually before dispatch.

**Consequences:**
- Prompts can be tweaked per-iter without breaking a template
- Some prompt repetition (the 4-batch structure for tracks 2-5 is identical except for target packet)
- Dispatch is mechanically simpler — a one-line `devin --prompt-file <path>` per iter
- The user retains visibility into every iter's RQ before it runs
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Dispatcher captures stdout → iter file (not Write capability in recipe)

**Status:** Accepted
**Date:** 2026-05-15
**Context:** The research-iter recipe from packet 059 is intentionally read-only (Read + Grep + Glob + Bash, no Write). The iter prompts say "Write to: <path>" but devin can't Write. Options: (a) add narrow Write scope to the recipe, requires `<packet-root>` substitution and recipe drift; (b) dispatcher captures stdout to the iter file. Option (b) keeps the recipe pure read-only and works because devin in -p mode prints structured output to stdout when Write is unavailable.

**Decision:** run-loop.sh captures `devin --print` stdout directly to `research/iterations/iteration-NNN.md`. Stderr goes to `research/logs/iteration-NNN.log`. The dispatcher also extracts the JSONL row from the iter output and appends to `deep-research-state.jsonl`.

**Consequences:**
- Recipe stays read-only — no recipe edits needed
- Devin's stdout IS the iter file (clean separation)
- The "Write to: <path>" wording in iter prompts is now effectively a hint; devin produces the same content via stdout
- JSONL append is dispatcher-side, not devin-side
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: 999 phase number signals impermanence

**Status:** Accepted
**Date:** 2026-05-15
**Context:** New phases under 026 typically take the next sequential number (016 at the time of this packet). This packet is temporary — it produces a restructure proposal that, once executed, makes 999 obsolete. A sequential 016 would persist in 026's structure as historic clutter; using 999 signals "delete me after I'm done".

**Decision:** Use phase number 999 for the research packet. The follow-on restructure packet handles its own cleanup including `git rm -rf 999-...`.

**Consequences:**
- Out-of-band number (999 not 016) signals impermanence to future operators
- The follow-on restructure must explicitly delete this packet — checklist item P1 captures that
- Operators searching 026 by number land first on 015 / 016 (sequential) — 999 is correctly demoted in search
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Implementation executor preference (deepseek-v4-pro → cli-devin → SWE-1.6)

**Status:** Accepted
**Date:** 2026-05-15
**Context:** The follow-on restructure execution involves file moves, content merges, parent-doc rewrites — large structured editing work. Options ranked by capability:
- deepseek-v4-pro via cli-opencode: strongest reasoning + structured-output for complex multi-file refactors
- cli-devin (DeepSeek v4 model on Devin): same family, accessed differently
- SWE-1.6 (Devin's default): coding-specialized but smaller, needs clearer prompts

Per memory `feedback_rm8_mitigation_works_under_deepseek`, deepseek-v4-pro via cli-opencode has proven RM-8 destructive-scope mitigation. Per `feedback_opencode_pure_flag_required_for_deepseek`, the cli-opencode invocation needs `--pure` flag.

**Decision:** Primary executor for restructure: deepseek-v4-pro via cli-opencode. Fallback if dispatch fails: cli-devin (DeepSeek v4). Last resort: SWE-1.6 with explicitly clearer prompts (the restructure broken into smaller scoped operations).

**Consequences:**
- The restructure execution prompts must be DEEPSEEK-pinned by default
- A fallback path is documented in the implementation plan
- SWE-1.6 fallback requires the operations to be smaller — one-merge-at-a-time vs one-batch-at-a-time
- Recovery baseline commit hash logged so any executor can roll back cleanly
<!-- /ANCHOR:adr-006 -->
