---
title: "Implementation Summary"
description: "Fixed PB-002's two defects across two independent advisor-scoring backends, plus 4 fresh-audit fix-now findings and the operator's accepted-risk decision on Open Design RUN side effects. Surfaced a new unresolved MR-004 logic-sync conflict and a pre-existing AI-004 bug, both documented not fixed."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 025 implementation summary"
  - "PB-002 fix summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/025-pb002-advisor-and-audit-bundle-fix"
    last_updated_at: "2026-07-07T21:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run validate.sh --strict, then commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/verdict-matrix.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pb002-advisor-fix-025"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-pb002-advisor-and-audit-bundle-fix |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh, independent Opus-max audit of sk-design's parent hub and all 6 subskills (run after phase 024 closed) cross-referenced the manual-testing playbook's remaining never-fixed items. Adversarial re-verification REFUTED two of its own claims (`MR-004`, `HM-004` — the cited facts were accurate but the causal mechanisms didn't reproduce), confirmed `PB-002` as a genuine live defect, and surfaced 4 independent fix-now findings plus 1 improvement needing an operator decision. The operator chose: apply the 3 trivial fix-now findings immediately, scope `PB-002` as this phase, and accept the Open Design RUN risk as-is.

This phase fixed `PB-002`'s two defects, discovering along the way that sk-design's advisor routing has two entirely independent scoring backends — a discovery that took two fix attempts to fully resolve — and, during its own regression sweep, surfaced a new unresolved conflict on `MR-004` that is explicitly NOT fixed here (out of scope, needs its own investigation).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-foundations/SKILL.md` | Edited | `family: sk-code` → `family: sk-design` (fix-now finding 1) |
| `.opencode/skills/sk-design/design-motion/SKILL.md` | Edited | `family: sk-code` → `family: sk-design` (fix-now finding 1) |
| `.opencode/skills/sk-design/design-audit/SKILL.md` | Edited | `family: sk-code` → `family: sk-design` (fix-now finding 1) |
| `.opencode/skills/sk-design/command-metadata.json` | Edited | 5 `preferSiblingWhen` entries reworded to stop presenting the nonexistent `/design:design-mcp-open-design` command (fix-now finding 2) |
| `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md` | Edited | `FR-001` index prompt synced to the feature-file's authoritative text (fix-now finding 3) |
| `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md` | Edited | ALWAYS #4 extended with the operator's accepted-risk decision on live `start_run` side effects |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Edited | `PHRASE_INTENT_BOOSTERS`: `"spacing rhythm"`, `"hierarchy and spacing"` (attempt 1 — fixes only the standalone CLI's local-fallback path) |
| `.opencode/skills/sk-design/SKILL.md` | Edited | Mode Vocabulary Guardrails `audit` bullet: new "single-axis static review" exception; version 1.4.1.0 → 1.4.2.0 |
| `.opencode/skills/sk-design/graph-metadata.json` | Edited | `intent_signals`/`derived.trigger_phrases`: design-scoped review/proof-gate phrases (attempt 2 — the fix that actually closed the live-daemon-path defect) |
| `.opencode/skills/sk-design/description.json` | Edited | `keywords` sync; version 1.4.1.0 → 1.4.2.0 (confirmed inert for daemon-scorer routing, kept for catalog consistency) |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/verdict-matrix.md` | Edited | PB-002 fix section, fresh-audit findings section, MR-004 logic-sync flag, AI-004 pre-existing-bug note, HM-004 operator-decision update |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Applied the 3 fix-now findings first (trivial, isolated edits — a front-matter field, 5 JSON string rewrites, one prompt-text sync) and documented the operator's Open Design RUN decision directly in the source skill file, not just in phase docs.

For PB-002, empirically re-tested the exact scenario prompt against the CURRENT live scoring path before assuming the fresh audit's cited evidence still held — this discipline mattered: the advisor probe genuinely still lost `sk-design` to `sk-code` (0.82 vs 0.8247), and the mode-resolution bundling defect also still reproduced. Attempt 1 fixed both with the same shape phase 024 had used before: a `skill_advisor.py` `PHRASE_INTENT_BOOSTERS` addition for the advisor half, and a `sk-design/SKILL.md` guardrail exception for the mode-resolution half. Live re-dispatch confirmed the mode-resolution half fully fixed — pure `foundations`, correct procedure card, confirmed/inferred sections, a dedicated proof-required section, zero mutating tool calls, zero "audit" mentions anywhere in the response — but the advisor half was completely unchanged, still `sk-code` top-1.

Investigating why surfaced a genuinely new architectural fact: the live dispatch's own `mk_skill_advisor_advisor_recommend` tool call consults a native TypeScript daemon, not the Python script the first fix edited. Confirmed via direct source grep of the daemon's indexer (`skill-graph-db.ts`) that it reads `graph-metadata.json`'s `intent_signals`/`derived.trigger_phrases` fields into its own sqlite-backed scoring table, and via `graph-metadata.json`'s own `derived.key_files` watch list that the daemon's chokidar file watcher picks up edits to that file live (debounced ~2-3 seconds, no restart needed) — confirmed empirically by the ~3-second gap between the file's mtime and the daemon's `lastGenerationBump` timestamp. Also confirmed, by grepping the daemon's entire TypeScript source tree for `"description.json"` (zero hits), that the parallel `description.json` edit made in the same fix pass was never going to reach this scoring path at all — it's consulted by some other, unrelated advisor surface, not the routing scorer.

Attempt 2 added the same design-scoped phrases to `graph-metadata.json` instead. Re-testing via the live daemon (both the in-session tool call and an independent daemon-backed CLI call, which agreed to float precision) confirmed `sk-design` moved from #2 (0.82) to top-1 at confidence 0.9095 — a decisive win, not a marginal one.

Regression-swept `AI-002` and `AI-004` through the SAME live daemon path (not the standalone script, which would have hidden the same backend-mismatch problem the first PB-002 attempt hit). Both stayed cleanly routed to `sk-code` (0.913 and 0.8993 respectively), confirming the new design-scoped phrases didn't leak into unrelated code-review or refactor prompts.

The sweep also tested `MR-004` for completeness, since its scenario file shares the same "audit"-framed design vocabulary. This produced a genuinely surprising result: `MR-004` FAILED on the live daemon path (`sk-code` 0.8719 top-1, `sk-design` #2 at 0.8507, flagged `ambiguous` by the scorer itself) — reproduced identically across two independent isolated dispatches. This directly conflicts with the fresh audit's own REFUTED verdict for the identical `MR-004` prompt, which found `sk-design` winning decisively (0.95 vs 0.86). Investigating the discrepancy (not just noting it) found the resolution: the fresh audit's test ran while the native daemon was reported unavailable ("stale"/"SIGTERM" trust state), so it exercised the Python local-fallback path — a different scorer entirely from the one this phase's sweep hit, which found the daemon live and answering. Neither test was wrong; they answered from two different, non-interchangeable backends whose availability is itself intermittent. Per the Logic-Sync Protocol, this is documented as an open conflict in `verdict-matrix.md` rather than silently treating either result as authoritative — `MR-004` needs its own investigation against the live daemon path specifically, out of this phase's PB-002-scoped mandate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-test PB-002 against the live path before trusting the fresh audit's cited evidence | The audit's own methodology (re-testing before trusting prior claims) is what caught two of its own findings as REFUTED; applying the same discipline here caught that the first fix attempt's success/failure needed empirical confirmation, not just a code diff |
| Investigate WHY the advisor fix didn't reach the live path, rather than re-tuning the same Python dict harder | The two scoring backends (Python local-fallback vs. native TS daemon) are architecturally separate; no amount of tuning `skill_advisor.py` would ever reach the daemon's own data source. Root-causing via direct source grep (not guessing) found the actual fix location in one step |
| Document the MR-004 conflict rather than silently pick a side or silently drop it | Per the project's Logic-Sync Protocol: when implementation evidence conflicts with prior evidence, escalate with both facts and a root cause, not a workaround. Here the root cause (daemon-availability-dependent backend switching) is itself a systemic finding worth preserving for whoever investigates MR-004 next |
| Keep the `description.json` edit despite confirming it's inert for this routing path | Removing it would be unnecessary churn for a harmless, already-applied edit; the important thing was confirming (not assuming) it doesn't matter for THIS fix, which is now documented so no future session wastes time re-editing the wrong file believing it's the fix mechanism |
| Do not expand scope to fix MR-004 in this phase | The operator's disposition for this phase was PB-002 specifically; MR-004's newly-discovered daemon-path failure is a different, not-yet-scoped problem that deserves its own investigation rather than a rushed fix bolted onto an already-complete phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| PB-002 advisor half (live daemon) | `sk-design` top-1, confidence 0.9095 (was #2 at 0.82) |
| PB-002 mode-resolution half (live dispatch) | Pure `foundations`, procedure card cited, confirmed/inferred separated, proof-required section present, zero mutating tool calls, zero "audit" mentions |
| Regression: `AI-002` (live daemon) | `sk-code` top-1, confidence 0.913 — clean |
| Regression: `AI-004` (live daemon) | `sk-code` top-1, confidence 0.8993 — unchanged from pre-fix state |
| Regression sweep discovery: `MR-004` (live daemon) | `sk-code` top-1, confidence 0.8719 vs `sk-design` 0.8507 (#2, ambiguous) — FAILS against the documented expectation; conflicts with the fresh audit's REFUTED verdict tested against a different backend; documented, not fixed |
| Fix-now finding 1 (family mislabel) | All 3 files confirmed `family: sk-design` |
| Fix-now finding 2 (nonexistent sibling command) | 5/5 `command-metadata.json` entries reworded; JSON validity confirmed |
| Fix-now finding 3 (`FR-001` prompt mismatch) | Index and feature-file prompts now identical |
| `opencode.json` mutation check | Clean (no `mcp` key) after every dispatch round in this phase |
| `git status --porcelain` after final round | No stray files from any dispatch |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`MR-004`'s live-daemon-path failure is discovered but NOT fixed by this phase.** It directly conflicts with the fresh audit's own REFUTED verdict for the identical prompt (which tested a different backend, live at a different moment). The root cause of the CONFLICT is understood (daemon-availability-dependent backend switching), but the root cause of MR-004's actual routing gap on the daemon path itself is not yet investigated. This needs its own phase.
2. **`skill_advisor.py`'s pre-existing `"design review"` bare-keyword-in-negation bug is confirmed real but not fixed.** `AI-004`'s prompt ("...not a visual or UI design review") wrongly scores `sk-design` top-1 via the standalone CLI's local-fallback path specifically — confirmed pre-existing via `git stash` (reproduces identically without any of this phase's or phase 024's changes). The live daemon path, which is what real dispatches actually use, is unaffected (confirmed via two independent regression checks in this phase). Low priority: fix if the standalone CLI probe is ever relied on directly for AI-004-shaped prompts.
3. **Two "improvement, fix-now" findings from the fresh audit were explicitly declined by the operator this round** (parent version-number alignment across `mode-registry.json`/`hub-router.json`/changelog; the transform-verb-precedence doc-symmetry gap for `excludedAliases.audit`) and remain open for a future session.
4. **`PB-006`, `PB-007`, `FR-001`'s behavioral-variance PARTIALs** were judged accept-as-is by the fresh audit (no file defect — the contract files fully specify each scenario's requirements) and were not re-tested in this phase.
<!-- /ANCHOR:limitations -->
