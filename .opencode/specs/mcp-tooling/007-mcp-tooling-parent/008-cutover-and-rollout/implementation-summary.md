---
title: "Implementation Summary: Phase 8: cutover-and-rollout"
description: "The core cutover gate passes STRICT and 0/0; the two rollout items carried over from phase 006 (advisor DB rebuild, CLAUDE.md/AGENTS.md prose) were closed on 2026-07-16."
trigger_phrases:
  - "cutover rollout summary"
  - "phase 008 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-16T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Closed both deferred rollout items; phase complete"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/SKILL.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "mcp-tooling becomes the sixth canon-clean parent hub after sk-code, sk-design, system-deep-loop, sk-doc, sk-prompt"
---
# Implementation Summary: Phase 8: cutover-and-rollout

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-cutover-and-rollout |
| **Completed** | 2026-07-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`mcp-tooling` passes the same structural canon gate the other five parent hubs pass, and the whole mcp-tooling track validates cleanly. Two rollout items — not part of this phase's own terminal gates, but carried over from phase 006 — stay visibly open rather than silently dropped.

### Terminal Gates

`parent-skill-check.cjs .opencode/skills/mcp-tooling` at STRICT reports all hard invariants passed with 0 warnings (checks 1a through 9b). `validate.sh --recursive --strict` across the whole 007-mcp-tooling-parent track reports 9/9 folders `PASSED` with 0 errors and 0 warnings. A repo-wide stale-reference grep sweep for the three old flat skill-folder paths returns only historical spec/changelog/playbook-fixture text outside this packet — no live functional referrer was missed. The known-deferred click-up OAuth-vs-`@clickup/mcp-server` config drift (from phase 005) is confirmed still-deferred, not silently dropped. The parent `graph-metadata.json` is rolled up: `derived.status` and `derived.last_active_child_id` reflect the program's current state.

### What Stays Open

Predecessor phase 007 did not formally complete — the Lane-C skill-benchmark was deferred — and this phase proceeded on the core structural gates regardless, per operator direction, rather than blocking on a formal 007 sign-off. Two items carried over from phase 006 remained open at the 2026-07-10 write-up and were re-confirmed then as still-deferred, not dropped: the advisor skill-graph DB rebuild and the CLAUDE.md/AGENTS.md figma-transport prose restatement. Both were closed on 2026-07-16 (see the dated section below).

### Rollout closure (2026-07-16)

Both carried-over items are now done. The advisor skill-graph DB was rebuilt with `node .opencode/bin/skill-advisor.cjs advisor_rebuild --json '{"force":true}' --trusted` (the first un-forced attempt skipped with reason `status-live`, so the rebuild was forced): `rebuilt: true`, 18 skills, generation 11997 to 11998, corroborated by `skill-graph.sqlite` metadata `last_scan_timestamp: 2026-07-16T13:42:43.336Z` with `scannedFiles: 18`. `advisor_validate --json '{"confirmHeavyRun":true}' --trusted` returned status ok with overallAccuracy 0.77 and no failures listed. Post-rebuild warm-daemon probes routed all three new transport phrasings top-1 to `mcp-tooling`: aside 0.726 (confidence 0.91), refero 0.783 (confidence 0.941), mobbin 0.682 (confidence 0.887). The CLAUDE.md and AGENTS.md prose was repointed: both files' Open Design dispatch rule (line 65 in each) and UI/design-work quick-reference row (line 459 in each) now name the `mcp-tooling` hub and its three design transports; the CLAUDE.md change is committed in `c471ec7fcaf`, the AGENTS.md change is in the working tree. The ClickUp auth/config drift stays tracked, deliberately unresolved: `005-foldin-clickup-and-figma/spec.md:114` keeps it Out of Scope as a deferred follow-up and `spec.md:143` REQ-005 requires it documented-not-fixed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../graph-metadata.json` (parent) | Modified | Status and `last_active_child_id` rollup |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ran the terminal gates directly (`parent-skill-check.cjs` STRICT, `validate.sh --recursive --strict`), a repo-wide stale-reference sweep, and a visibility re-check of both phase 005's and phase 006's known deferrals, then rolled up the parent packet metadata.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Proceed on the core gates despite phase 007 not formally completing | The Lane-C benchmark is a measurement activity, not a blocker for the structural canon gate; the operator directed this reconciliation to reflect what actually executed |
| Treat "canon-clean" as the structural gate, not full rollout completeness | Matches the sk-code/sk-design/sk-prompt precedent, where a canon-clean declaration was followed by a separately-tracked hardening tail |
| Re-surface the phase 006 deferrals here rather than let them go quiet at cutover | Mirrors the existing REQ-004 pattern for the click-up drift: known deferrals stay visible through the terminal gate, not silently dropped |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `parent-skill-check.cjs .opencode/skills/mcp-tooling` (STRICT) | PASS — 0 warnings |
| `validate.sh --recursive --strict` (whole track) | PASS — 9/9 folders, Errors: 0, Warnings: 0 |
| Repo-wide stale-reference sweep | PASS — zero live hits outside historical text |
| Click-up drift still-deferred check | PASS — `SKILL.md` still documents OAuth/`mcp-remote` |
| Advisor-DB + CLAUDE.md prose still-deferred check (2026-07-10) | PASS (confirmed deferred at the time) — both closed 2026-07-16, rows below |
| Parent rollup | PASS — `derived.status`/`last_active_child_id` reconciled |
| Advisor skill-graph DB rebuild (2026-07-16) | PASS — `advisor_rebuild --json '{"force":true}' --trusted` rebuilt: true, 18 skills, generation 11997 to 11998 |
| Advisor heavy validation (2026-07-16) | PASS — `advisor_validate` status ok, overallAccuracy 0.77, no failures |
| Post-rebuild routing probes (2026-07-16) | PASS — aside/refero/mobbin phrasings 3-of-3 top-1 `mcp-tooling` (0.726/0.783/0.682) |
| CLAUDE.md + AGENTS.md prose repoint (2026-07-16) | PASS — `CLAUDE.md:65,459` + `AGENTS.md:65,459` name the mcp-tooling hub and its three design transports |
| Click-up drift still-tracked re-check (2026-07-16) | PASS — `005-foldin-clickup-and-figma/spec.md:114` and `:143` (REQ-005) keep it deferred, not dropped |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Advisor skill-graph DB rebuild — RESOLVED 2026-07-16.** Carried over from phase 006 and open at the original write-up; closed by the forced `advisor_rebuild` (18 skills, generation 11997 to 11998) plus heavy validation, see Rollout closure above.
2. **CLAUDE.md/AGENTS.md figma-transport prose — RESOLVED 2026-07-16.** Carried over from phase 006; both files now name the `mcp-tooling` hub and its three design transports at lines 65 and 459 (AGENTS.md change still uncommitted in the working tree at write time).
3. **Phase 007 Lane-C benchmark not run** — the figma-transport routing carve-out question it was meant to resolve empirically stays open; an informal cross-check substituted for the formal independent review. Phase 010's holdout suite (6-of-6 mode coverage) now enables that run, but does not substitute for it.
4. **A follow-on canon-hardening tail may follow** — per the sk-code/sk-doc/sk-prompt precedent, not pre-scoped here.
5. **ClickUp auth/config drift stays deferred by design** — tracked at `005-foldin-clickup-and-figma/spec.md:114` and `:143`; deliberately not resolved in this phase.
<!-- /ANCHOR:limitations -->
