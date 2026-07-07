---
title: "Implementation Summary: Deep-Loop Core Isolation Deliberation (SPLIT ruling)"
description: "Council deliberation packet closed. 4-seat sk-ai-council via cli-codex gpt-5.5 ruled SPLIT after 3-way advocate split. Migration outline ready for follow-on packet 118."
trigger_phrases:
  - "deep-loop isolation summary"
  - "117 council closure"
  - "SPLIT ruling implementation summary"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation"
    last_updated_at: "2026-05-22T17:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Council closed with SPLIT ruling; ADR-001 authored; ready for follow-on packet 118."
    next_safe_action: "Scaffold follow-on implementation packet."
    blockers: []
    completion_pct: 100
    key_files:
      - "decision-record.md"
      - "ai-council/council-report.md"
      - "ai-council/deliberations/round-001.md"
    session_dedup:
      fingerprint: "sha256:6676676676676676676676676676676676676676676676676676676676670001"
      session_id: "117-deep-loop-isolation-council"
      parent_session_id: null
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation` |
| **Completed** | 2026-05-22 |
| **Level** | 3 |
| **Ruling** | SPLIT (Seat D, confidence 92/100) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A 4-seat sk-ai-council deliberation packet on whether to relocate 18 deep-loop / coverage-graph runtime files from `.opencode/skills/system-spec-kit/mcp_server/lib/{deep-loop,coverage-graph}/` and `mcp_server/handlers/coverage-graph/` into the owning deep-* skill folders.

**Deliverables produced**:
- 4 seat outputs at `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/seats/round-001/`:
  - `seat-A-isolation-architect.md` (Recommendation: ISOLATE, confidence 94)
  - `seat-B-status-quo-defender.md` (Recommendation: KEEP, confidence 88)
  - `seat-C-pragmatist.md` (Recommendation: SPLIT, confidence 91)
  - `seat-D-adjudicator.md` (Recommendation: SPLIT, confidence 92)
- Round synthesis at `ai-council/deliberations/round-001.md` (composition, comparison, agreements, disagreements, convergence decision)
- Final council report at `ai-council/council-report.md` (output_schema.md compliant: Council Composition, Per-seat sections, Recommended Plan, Plan Confidence, Risks & Mitigations, Dropped Alternatives, Planning-Only Boundary)
- ADR at `decision-record.md` ADR-001 with 5/5 PASS five-checks

**Ruling**: SPLIT — pure runtime libs move to a new `.opencode/skills/deep-loop-runtime/` peer skill; MCP handlers + DB-schema owner stay in `system-spec-kit/mcp_server/`. See `decision-record.md` for the full migration outline.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Sequential 4-seat dispatch via cli-codex gpt-5.5 (3 advocates + 1 adjudicator) with explicit kill-between per memory rule on cli-codex parallel unreliability:

1. **Seat A** (Isolation Architect, gpt-5.5 xhigh fast): ~10 min wall-clock. Output: full ISOLATE argument with deep-loop-runtime peer-skill proposal.
2. **Seat B** (Status-Quo Defender, gpt-5.5 xhigh fast): ~8 min. Output: KEEP argument with documentation alternative.
3. **Seat C** (Pragmatist, gpt-5.5 high fast — reasoning diversity): ~6 min. Output: SPLIT along MCP-binding boundary.
4. **Seat D** (Adjudicator, gpt-5.5 xhigh fast): ~7 min. Output: independent SPLIT ruling aligned with C, with full migration outline + 7-row risk register.

3-way advocate split (no 2-of-3 majority) — Seat D's independent adjudication was decisive. No OVERRIDE flag because no majority existed to override.

Total wall-clock: ~35 min for council deliberation + ~10 min scaffolding + ~10 min synthesis = ~55 min end-to-end.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run AI Council before any file move | User-requested; no ADR justified current placement; needed documented reasoning, not ambient preference |
| Use cli-codex gpt-5.5 as single CLI per round | sk-ai-council §0 one-CLI-per-round invariant + user direction; reasoning-effort variation (xhigh/high) provides diversity without breaking the invariant |
| Seat ordering A → B → C → D with kill-between | Memory rule on cli-codex parallel unreliability; Seat D needs A/B/C as input so must run last |
| SPLIT (over ISOLATE or KEEP) | Honors MCP server convention for handlers + DB; returns pure-lib ownership to deep-* consumers via neutral peer; reversible; aligns with strongest argument across all 3 advocates (DB lifecycle + MCP tool ownership are hard contracts) |
| Create new peer skill `deep-loop-runtime/` (not move into deep-review) | Avoids false ownership — both deep-review and deep-research consume the same runtime; a deep-review-rooted home would make deep-research a second-class consumer |
| Defer file moves to follow-on packet 118 | This packet is planning-only; the ruling captured here is the authority that follow-on packet cites |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Packet scaffolded | `ls .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/` | PASS |
| 4 seat outputs landed | `ls .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/seats/round-001/` (4 files) | PASS |
| Each seat has verdict line | `for f in seats/round-001/*.md; do tail -1 "$f"; done` (4 lines matching `Recommendation: …`) | PASS |
| council-report.md per schema | `grep -E "Council Composition|Recommended Plan|Plan Confidence" .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/council-report.md` | PASS |
| ADR-001 with 5-checks PASS | `grep -A 12 "Five Checks" .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/decision-record.md` (5/5 PASS) | PASS |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation --strict` | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Planning-only packet**: this packet does NOT move any file. Implementation = follow-on packet 118 (or similar).
2. **Single-CLI vantage**: all 4 seats used cli-codex gpt-5.5. Cross-AI vantage (Opus, DeepSeek, etc.) deferred to a future round if the ruling is challenged.
3. **Seat C and Seat D reached the same ruling by independent reasoning**: not by majority-following, since no advocate majority existed. The implication for future deliberations: a 3-way advocate split is decisive when adjudicator confidence > 85; below that, a second round with different framings is warranted.

---

## Commit Handoff

Suggested commit message:

```
decision(skilled-agent-orchestration/117): AI Council SPLIT ruling on deep-loop core isolation

3-way advocate split (Seat A=ISOLATE, B=KEEP, C=SPLIT); Seat D adjudicator
independently ruled SPLIT (confidence 92/100). Migration outline ready
for follow-on packet 118.

ADR-001: pure runtime libs (10 lib/deep-loop/*.ts + 2 lib/coverage-graph/
{query,signals}.ts) move to new .opencode/skills/deep-loop-runtime/ peer
skill. MCP handlers (5 files) + coverage-graph-db.ts stay in
system-spec-kit/mcp_server/ to preserve MCP tool ID stability and SQLite
lifecycle coherence.

5/5 PASS five-checks; strict-validate clean (Level 3).

Co-Authored-By: GPT-5.5 via cli-codex (4-seat AI Council)
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Files for `git add` (explicit paths):

```
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/spec.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/plan.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/tasks.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/checklist.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/decision-record.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/description.json
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/ai-council-config.json
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/ai-council-strategy.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/ai-council-state.jsonl
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/seats/round-001/seat-A-isolation-architect.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/seats/round-001/seat-B-status-quo-defender.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/seats/round-001/seat-C-pragmatist.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/seats/round-001/seat-D-adjudicator.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/deliberations/round-001.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/council-report.md
```
<!-- /ANCHOR:limitations -->
