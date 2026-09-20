---
title: "Implementation Summary: Pi skill-discovery bridge"
description: "Design-verified 4-candidate .pi/settings.json discovery strategy and an 8-step live-verification protocol; live probe reached Pi's provider-credential gate and stopped there, same as phase 001."
trigger_phrases:
  - "pi skill discovery summary"
  - "pi settings.json skills implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/004-pi-skill-discovery-bridge"
    last_updated_at: "2026-07-27T09:53:30Z"
    last_updated_by: "claude-code"
    recent_action: "Live probe blocked on credentials; Candidate A accepted"
    next_safe_action: "Commit phase 004; start phase 005"
    blockers: ["Discovery-shape confirmation needs provider credentials this machine lacks"]
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 90
    open_questions: ["Does discovery flatten the 39 nested-mode SKILL.md files? Still UNKNOWN pending credentials."]
    answered_questions: ["Candidate A's settings.json shape parses and is accepted by Pi with no syntax error, confirmed live"]
---
# Implementation Summary: Pi skill-discovery bridge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-pi-skill-discovery-bridge |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase designs, and hands off, the answer to one open question the earlier phases could not settle on their own: when Pi's native `SKILL.md` discovery is pointed at this repo's `.opencode/skills/` tree, does it respect the 12-hub single-advisor-identity architecture, or does it flatten all 39 nested-mode files into independently-invokable skills? The design work — 4 candidate configurations, an 8-step verification protocol, and a decision framework — was already substantively drafted during the packet's initial scaffolding pass. This phase's job was to close it out honestly: attempt the live probe for real, and record exactly how far it got instead of assuming either outcome.

### Discovery-surface inventory

The inventory this phase's design reasons about: `find .opencode/skills -iname SKILL.md | wc -l` returns 51 total `SKILL.md` files in the full dependency-installed environment (12 hub-level identities + 39 nested-mode files, including 2 unrelated vendor files inside `sk-design/design-md-generator/backend/node_modules/playwright-core/`). In this specific worktree checkout the same command returns 48 (the vendor files are absent because their `node_modules` is gitignored and not installed here) — both numbers are cited honestly rather than picking whichever looks better, since `find .opencode/skills -maxdepth 2 -iname SKILL.md` (the 12 hub-root paths that actually matter to this phase's design) returns 12 in both environments.

### Live-verification attempt

I built a scratch `.pi/settings.json` (`{"skills": [".opencode/skills"]}`, Candidate A: Whole-Tree Pointer) in an isolated scratch directory and ran `pi --offline --approve -p "list every skill you have discovered, one per line"` against it. The config parsed and was accepted with no syntax error — a real signal, since an invalid `.pi/extensions/*.ts` is known (from phase 001) to fail the whole session. The dispatch then reached Pi's provider-credential gate and stopped there, identically to phase 001's finding ("No API key found"), before any skill-list response could be observed. This confirms the config shape itself is well-formed; it does not confirm whether discovery is hub-respecting or flattened.

### Files Changed

No repository files were changed by this phase. It is design-and-decision work; the settings.json probe ran against a session scratch directory outside the repo, never against `.pi/settings.json` at the repo root (writing that file to the repo root stays explicitly out of scope until a later, separately-approved implementation step).

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Closed out phase 004: status, evidence, and the accepted decision recorded |
| `implementation-summary.md` | Created | This document |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The 4 candidate configurations and the 8-step protocol were already drafted during the packet's initial authoring pass, before any of phases 002-003's real execution work began; this phase's own job was verification and closeout, not fresh design. I ran the live probe myself directly (not delegated to LUNA, since there was no code to write) using the exact Candidate A config, hit the same credential wall phase 001 hit, and recorded that result honestly rather than marking the live-execution checklist items as done. No LUNA/GLM-5.2 dispatch was used for this phase: there is no code diff to implement or review, only a design decision to record, so the packet's dispatch protocol (implement via LUNA, review via GLM-5.2) does not apply to a phase with zero code surface.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Accept Candidate A (Whole-Tree Pointer, `"skills": [".opencode/skills"]`) as the initial production shape once phase 001's credential blocker clears | It is syntactically valid (confirmed live), matches pi.dev's own documented cross-harness example shape, and is the simplest config to maintain — narrowing to 12 enumerated hub paths (Candidate B) or a curated mirror (Candidate C) only earns its complexity if Candidate A is later confirmed to flatten routing in a way that actually matters |
| Do not mark CHK-021/022/023 (live-execution items) as done | The actual discovery-shape question — hub-respecting vs. flattened — is still genuinely unconfirmed; marking them complete would silently assume an answer the credential gate never let me observe |
| Skip a GLM-5.2 review dispatch for this phase | The packet's per-phase protocol reviews LUNA's diff; this phase produced no diff (no code, no config applied to the repo), so there is nothing for an independent reviewer to check beyond what's already recorded here |
| Explicit re-verification trigger: re-run this exact probe once provider credentials exist on this machine | The decision above is provisional, not final — it must not silently calcify into an unverified assumption once the actual blocker (credentials, not the config itself) is resolved |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live probe: `pi --offline --approve -p "list every skill you have discovered, one per line"` with Candidate A's `.pi/settings.json` | PARTIAL — config parsed with no syntax error, reached the provider-credential gate, blocked before a skill-list response; same root cause as phase 001, not a new bug |
| Discovery-surface inventory re-confirmed live in this worktree | PASS — 48 total / 12 hub-root `SKILL.md` files here (vendor-file delta vs. the 51-file full-install figure explained, not a contradiction) |
| Cross-check: every `spec.md` REQ-00x maps to a plan/task artifact | PASS — all 8 requirements (REQ-001..008) map to a named section |
| Dependency status re-confirmed: 003 and 001 both landed | PASS — `mode-registry.json` has 6 modes including `cli-pi`/`cli-devin`; phase 001's `implementation-summary.md` documents the install |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The central discovery-shape question (hub-respecting vs. flattened) is still unconfirmed.** The live probe reached Pi's provider-credential gate and stopped there before any skill-list response was observable. This is the same root-cause blocker phase 001 documented (no provider API key configured on this machine), not a new gap. Re-run the exact same probe once credentials exist, per the re-verification trigger above.
2. **Candidates B (Enumerated-Hub-Paths), C (Curated-Mirror), and D (`--skill`-Flag-Per-Hub) remain untested.** Only Candidate A was probed, since it is the simplest and the one accepted provisionally. If Candidate A is later confirmed to flatten routing in a way that matters, phases B/C/D's designs (already drafted in `plan.md` §3) are ready to test without redesign.
3. **`sk-design`'s 2 vendor `SKILL.md` files (REQ-008)** remain an open P2 follow-up, not resolved in this phase — noted in `spec.md` §10 Open Questions.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
