---
title: "Implementation Summary: AGENTS.md Communication Quality Section"
description: "Added a dedicated Communication Quality section to the universal AGENTS.md and reconciled the Codex voice spec, lifting only net-new craft principles from the 003 context."
trigger_phrases:
  - "implementation summary"
  - "communication quality"
  - "agents.md"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/003-communication-quality"
    last_updated_at: "2026-08-07T08:44:03Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Summarized shipped §8 section and .codex reconciliation"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".codex/AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: AGENTS.md Communication Quality Section

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-communication-quality |
| **Completed** | 2026-08-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every runtime now finds its cross-runtime communication rules in one place. The universal `AGENTS.md` gained a dedicated `## 8. COMMUNICATION QUALITY` section, and the deeper Codex voice spec was reconciled so the two files agree instead of drifting. The work started from the `context/` source (a Reddit r/codex thread on frontier-model verbosity) but lifted only the handful of principles genuinely missing from both files — the rest was already covered, more thoroughly, in `.codex/AGENTS.md`.

### Root AGENTS.md — new §8
A dedicated, self-contained section with three subsections and a closing caveat: **Writing** (one idea per sentence / SVO; atomic paragraphs; plain words with progressive jargon disclosure; cut filler; vary the rhythm; match length to the question; lead-with-the-recommendation-but-earn-it), **Recommendations & Honesty** (recommend one approach + trade-off; separate required from optional; name the specific failure a best practice prevents; state assumptions when evidence is missing), and **Turn Framing** (the Ask→Do frame for complex or ambiguous requests). It links only to §1 and §7 — no reference to `.codex` — and closes with "these shape delivery, not rigor — over-constraining voice backfires."

### Codex voice-spec reconciliation
Four small additive edits keep `.codex/AGENTS.md` in step: an early-commitment caveat in §3, required/optional + best-practice-honesty bullets in §4, a new Register subsection in §6, and a new Construction subsection in §7. The reconciliation deliberately imported one-idea/SVO/atomic but NOT "keep it short," because `.codex` already prescribes varied medium-length rhythm — adding "short" would have contradicted it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | New §8 Communication Quality; renumber §8→§9, §9→§10 |
| `.codex/AGENTS.md` | Modified | 4 additive edits (§3, §4, §6, §7) reconciling net-new principles |
| `specs/agents/003-communication-quality/spec.md` | Created | Level 2 specification |
| `specs/agents/003-communication-quality/plan.md` | Created | Implementation plan |
| `specs/agents/003-communication-quality/tasks.md` | Created | Task breakdown |
| `specs/agents/003-communication-quality/checklist.md` | Created | Verification checklist |
| `specs/agents/003-communication-quality/implementation-summary.md` | Created | This summary |
| `specs/agents/003-communication-quality/description.json` | Created | Packet metadata |
| `specs/agents/003-communication-quality/graph-metadata.json` | Created | Graph metadata |

`CLAUDE.md` updated automatically — it is a symlink to `AGENTS.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the source and both target files directly before editing. The key finding — that `.codex/AGENTS.md` already covered ~70% of the source — turned the task from "copy the good bits" into "add only what's missing and reconcile." Renumbering was proven safe by grepping every `§8/§9/§10` reference first: the only hit points at an external file (`quick-reference.md §8`), so no in-doc navigation broke.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dedicated §8 instead of extending §1 | Operator chose a visible, expandable home; §1 was already the densest section |
| Both files, reconciled | Root reaches every runtime; `.codex` is the deep Codex spec — keeping them in sync prevents drift |
| Imported one-idea/SVO/atomic but not "keep it short" | `.codex` already prescribes varied medium rhythm; adding "short" would contradict it |
| Excluded model-internals claims and hard word budgets | Forum opinion, not authority; length already handled per-mode in `.codex` |
| Cross-link §1/§7 rather than move them | Avoids scope creep and broken references |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -nE '^## [0-9]+\.' AGENTS.md` | PASS — headers sequential 1..10 |
| `grep -nE '(§|Section )(8|9|10)\b' AGENTS.md` | PASS — sole hit is external-file ref `quick-reference.md §8`, correctly untouched |
| `.codex/AGENTS.md` header integrity | PASS — sections 1..12 intact |
| Diff stat | PASS — `AGENTS.md` +33/-3, `.codex/AGENTS.md` +14/-1; no unrelated files |
| No-duplication read vs §1 and `.codex` | PASS — each added bullet is net-new or an explicit cross-link |
| `validate.sh --strict` | PASS — see run output in this session (exit 0/1, no errors) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two homes for voice guidance** — root §8 and `.codex/AGENTS.md` are intentionally cross-linked, not merged; future editors must keep both consistent.
2. **Codex-only propagation** — the sentence-craft additions to `.codex` reach only Codex; other runtimes rely on root §8 alone (acceptable, since root is universal).
3. **Source is practitioner opinion** — only communication craft was lifted; model-internals claims were excluded by design.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| ~6 net-new bullets into a new section | Delivered as 3 named subsections + closing caveat | Operator chose a dedicated section, which invited light structure |

<!-- /ANCHOR:deviations -->
