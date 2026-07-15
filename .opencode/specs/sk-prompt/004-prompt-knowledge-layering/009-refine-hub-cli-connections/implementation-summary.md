---
title: "Implementation Summary: refine-hub-cli-connections"
description: "Closed the C1–C10 seam-drift backlog from the 130 deep research: pointer-ized the precedence rule across all 5 cli-*, de-phantomed STAR, repaired the 4-model navigability/discovery dead-spot, completed the new-provider checklist, and extended + CI-wired the sync guard so none of it can silently regress."
trigger_phrases:
  - "refine hub cli summary"
  - "c1 c10 implementation"
  - "prompt layering remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/009-refine-hub-cli-connections"
    last_updated_at: "2026-06-03T06:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented C1-C10; guard green"
    next_safe_action: "Run validate --strict, then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/scripts/git-hooks/pre-commit"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "C7 dispatch matrix confirmed before scaffolding"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-refine-hub-cli-connections |
| **Completed** | 2026-06-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 3-layer prompt-knowledge architecture (sk-prompt → sk-prompt-models → cli-*) shipped in phases 001–008 had drifted at its seams. This phase closes the full C1–C10 backlog the 5-iteration deep research found, and — the keystone — makes the structure self-enforcing so it cannot drift again.

### The escalation rule is now pointer-only (C1, C2)
All five `cli-*/SKILL.md` Tier-3 deep-path bullets are now byte-identical pointers to the canonical card; the inlined trigger list (which had drifted in 4 of 5, dropping "policy" and "or audience") is gone. cli-devin also drops its inline RCAF/STAR/BUILD framework-choice restatement, keeping the "OWNED by the profile" pointer.

### STAR is no longer a phantom framework (C3, C4)
STAR/BUILD are now consistently labeled cli-devin task-shapes, never sk-prompt frameworks or a registry `fallback`. The hub `SKILL.md`, `swe-1.6.md` (§3 and the §4 template heading), and the `_index.md` row all agree with the registry's `fallback: null`.

### The four default-unverified models are navigable and discoverable (C5, C6, C7)
The `mimo-v2.5-pro` and `minimax-m3` profiles drop their embedded `opencode run` wrappers for a rule + pointer (mechanics belong in cli-*). The deepseek/kimi/qwen/glm profiles gain card↔profile back-links and the cli-opencode card links each profile directly, closing the bidirectional dead-spot. cli-opencode's `graph-metadata.json` now carries all four model names, so `qwen3.6` (previously unreachable by name) surfaces its executor.

### Adding a model can't build a zero-weight entry anymore (C8)
`pattern-index.md` §4 is now the single canonical new-provider checklist — it includes authoring the profile, the `_index.md` row, and the dispatch-matrix row that the old version omitted. The hub `SKILL.md` §3 points to it instead of carrying a divergent copy.

### The guard enforces all of it, automatically (C9 — keystone K2)
`check-prompt-quality-card-sync.sh` gains three structural checks (Tier-3 pointer-only, registry↔profile↔_index completeness, discovery reachability) and now runs as a blocking pre-commit gate (when a prompt-knowledge surface is staged) and in CI. Metadata rot in the hub's `graph-metadata.json` was also refreshed (C10).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-{opencode,codex,gemini,claude-code,devin}/SKILL.md` | Modified | C1: Tier-3 → canonical-card pointer (+ C2 in cli-devin); version bump |
| `sk-prompt-models/SKILL.md` | Modified | C3 STAR relabel + C8 §3 pointer; version 0.6.1.0 |
| `sk-prompt-models/references/models/swe-1.6.md` | Modified | C3: fallback=null prose; STAR template relabeled |
| `sk-prompt-models/references/models/_index.md` | Modified | C4: swe-1.6 fallback column |
| `sk-prompt-models/references/models/{mimo-v2.5-pro,minimax-m3}.md` | Modified | C5: wrapper → rule + pointer |
| `sk-prompt-models/references/models/{deepseek-v4-pro,kimi-k2.6,qwen3.6,glm-5.1}.md` | Modified | C6: card↔profile back-links |
| `cli-opencode/assets/prompt_quality_card.md` | Modified | C6: per-model cluster links |
| `cli-opencode/graph-metadata.json` | Modified | C7: deepseek/kimi/qwen/glm triggers |
| `sk-prompt-models/references/pattern-index.md` | Modified | C8: canonical new-provider checklist |
| `sk-prompt-models/graph-metadata.json` | Modified | C10: causal_summary/intent_signals/enhances/last_updated refresh |
| `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modified | C9: + CHECK 2/3/4 |
| `.opencode/scripts/git-hooks/pre-commit` | Modified | C9: blocking card-sync gate |
| `.github/workflows/prompt-card-sync.yml` | Created | C9: CI enforcement |
| 7 skills' `changelog/v*.md` | Created | Per-skill change records |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in dependency order (C3 → C1/C2 → C5/C8/C6/C7/C10 → C9 last) so the guard locked a clean state. The C7 dispatch-matrix unknown (which executor dispatches each clone) was confirmed from the registry before scaffolding. Confidence comes from the extended guard: it exits 0 on the clean tree, and each of the three new checks was proven to fire by planting a regression (inlined Tier-3, removed profile, stripped qwen trigger) and confirming a non-zero exit, then restoring.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pointer-ize the precedence rule, don't re-sync 5 copies | Re-syncing treats the symptom; hand-copies re-drift. A pointer to the one canonical card cannot drift. |
| Keep the four cluster profiles separate (DRY the note, not the profiles) | Each must stay 1:1 with its registry row for the completeness guard and future independent benchmarking. |
| Keep the guard structural (no semantic/NLP matching) | Pointer-presence / table-absence / membership checks are robust and fast; a prose matcher is brittle over-engineering. |
| Put the card-sync gate in the pre-commit orchestrator, not the comment-hygiene sub-hook | The orchestrator is where gates are composed; burying it in the hygiene file would hide it. |
| Bump versions + per-skill changelogs for all touched skills | Matches the established per-skill changelog convention. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Extended guard on clean tree | PASS (exit 0, all 4 checks) |
| Guard fires on planted CHECK 2/3/4 regressions | PASS (exit 1 each; restored) |
| SC-002: no Tier-3 enumeration / RCAF;STAR;BUILD choice in cli-*/SKILL.md | PASS (grep clean) |
| SC-003: every STAR ref reads as a cli-devin task-shape | PASS |
| SC-004: 4 clones round-trip card↔profile; cli-opencode carries all 4 triggers | PASS |
| Both edited `graph-metadata.json` parse as JSON | PASS |
| pre-commit hook + CI workflow syntax | PASS (`bash -n`, YAML parse) |
| `validate.sh --recursive --strict` on 130 parent | (run at close) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The shared default-unverified rationale is centralized in the `_index.md` status legend, not extracted into a separate linked note.** The four cluster profiles keep their individualized §3 reasoning; only the navigability links and the card-side block were DRY'd. Full prose extraction was judged higher-risk than its marginal value.
2. **CHECK 4 uses a family-token match** (e.g. `qwen` for `qwen3.6`). A future model whose id shares no family token with an existing one needs a one-line entry in the guard's `FAMILY` map; the default (first id segment) covers the common case.
<!-- /ANCHOR:limitations -->
