---
title: "Feature Specification: sk-design Styles & Commands Gap-Remediation Research"
description: "Phase parent for forced GPT-5.6-SOL deep-research on the four confirmed gaps in the sk-design styles library and /interface:* commands, feeding an evidence-backed remediation plan."
trigger_phrases:
  - "styles gap remediation research"
  - "sk-design styles restructure research"
  - "interface commands literal prompts research"
importance_tier: "important"
contextType: "research"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/007-gap-remediation-research"
    last_updated_at: "2026-07-21T06:45:00Z"
    last_updated_by: "gap-research"
    recent_action: "Placed gap-analysis; launched 4 forced SOL research runs (children 001-004)."
    next_safe_action: "Converge the four syntheses into one remediation plan."
    blockers: []
    key_files:
      - "gap-analysis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gap-research-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: manifest/phase-parent.spec | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: sk-design Styles & Commands Gap-Remediation Research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 (phase parent) |
| **Status** | In Progress |
| **Type** | Deep-research (forced depth) → remediation input |
| **Parent Packet** | `012-style-database-and-interface-commands` |
| **Predecessor** | `006-retire-design-alias-namespace` |
| **Successor** | None (remediation packets follow this research) |
| **Created** | 2026-07-21 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The operator identified structural and strategic gaps in the sk-design **styles library** and the
**`/interface:*` commands**. Each gap was confirmed against the actual repo state in `gap-analysis.md`
(this folder). Before any restructure, this packet runs **forced** deep-research — **5 iterations per
gap, no early convergence** (`--stop-policy=max-iterations`), **GPT-5.6-SOL high/fast** via
cli-opencode — to produce evidence-backed remediation designs, one per gap.

The research is read-and-recommend only; it does not mutate the styles tree or the commands. Its
syntheses feed a subsequent remediation packet (or packets).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

Four consolidated gaps (from `gap-analysis.md`):

- **Restructure [A1+A5]** — separate 1,290 downloaded style folders from backend code; align to the
  proven `deep-loop/runtime` architecture.
- **Naming + manifests [A2+A3]** — kebab-case conformance for `_db`/`_engine`/`_harness`/manifests;
  reconcile the two overlapping manifests into one source of truth.
- **DB fate [A4]** — the dormant SQLite DB (no `.sqlite` on disk, `legacy` default): wire it in or shelve it.
- **Commands as literal prompts [B]** — rewrite `/interface:*` as literal design prompts (the researched-
  but-unshipped deliverable).

**Out of scope:** executing any restructure/rename/command rewrite (that is remediation, gated on this research).
<!-- /ANCHOR:scope -->

---

## 4. PHASE DOCUMENTATION MAP

| Child | Gap | Research question (forced 5-iter, SOL high/fast) | Status |
|-------|-----|--------------------------------------------------|--------|
| `001-restructure` | A1+A5 | Target folder layout + migration to separate data from code, aligned to `runtime` | In research |
| `002-naming-manifests` | A2+A3 | Kebab rename map + manifest consolidation into one source of truth | In research |
| `003-db-fate` | A4 | Wire-in vs shelve decision framework for the dormant SQLite DB | In research |
| `004-commands` | B | Literal-prompt `/interface:*` command bodies + shared-fragment mechanism | In research |

Each child owns its `research/` artifact tree (deep-research state, iterations, deltas, `research.md`).

---

## 5. OPEN QUESTIONS

- Do the four remediations become one restructure packet + one command packet, or more granular?
- DB fate (003) is a strategic fork that gates the restructure (001) target layout — resolve first.

---

## RELATED DOCUMENTS

- `gap-analysis.md` — the evidence-confirmed gap list this research investigates.
- `../002-research-design-commands/research/research.md` — the prior 20-iter commands research (gap B origin).
- `../../015-styles-database-evolution/001-foundation/` — the styles-DB foundation (gap A3/A4 code).
