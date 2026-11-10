---
title: "Implementation Summary"
description: "The five items phases 001 to 005 left open are closed, each with a test or a grep, and two alignment passes over the touched skills left no finding open: the frontend surface now reads the same in its SKILL.md, ROUTER.md, hub routing, references, assets and the repo docs that describe it."
trigger_phrases:
  - "open items and alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals/006-open-items-and-alignment"
    last_updated_at: "2026-11-03T18:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed the open items and two alignment passes; every gate green"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/hub-router.json"
      - ".skilled/bin/tests/compiled-route-admission.test.cjs"
      - "scratch/alignment-fixes.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Merge conflicts on generated files: regenerate them (operator, 2026-11-03, both merges)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-open-items-and-alignment |
| **Completed** | 2026-11-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The compiled-route suites pass again, a same-mode tie in sk-design's router no longer throws, and a plan-only save now says it left the continuity fields unwritten. Every skill this packet touched now describes the frontend surface the same way, from its SKILL.md and ROUTER.md to the root README and the always-loaded quality floor.

### Phase 6: open-items-and-alignment

The five open items each landed as their own commit with a test or a grep. Then `/local-skilled-alignment` ran twice over the branch, with every lane and the critic on DeepSeek V4.1 Flash through opencode-go. The first pass found drift across the frontend references, the surface counts, the scorers' folded keywords and the signal provenance. The second pass found what the first pass's fixes still left: React Native still called unsupported in two front doors, a changelog that said routing was unchanged after aliases landed, the surface ranked behind CI in the tie-break, and no gold scenario for the surface. `scratch/alignment-fixes.md` maps every finding to its commit, or to the reason it was left.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modified | Corpus pin at the live size, 85 with the frontend scenario |
| `009-sk-design/lib/canary-router.cjs`, authored and served | Modified | Defines `compareText` for the intent-name tie order |
| `.skilled/bin/tests/compiled-route-sk-design-tie.test.cjs` | Created | Three tied same-mode intents sort by name |
| `system-spec-kit/runtime/cli/core/workflow.ts` and its vitest | Modified | Plan-only save summary line |
| `system-spec-kit/changelog/v2.12.31.0.md`, `SKILL.md` | Created, modified | Trigger-index warning and plan-only line |
| Every hub router, the policy cards and the leaf replay | Modified | A folded keyword counts once |
| `generate-router-intent-signals.cjs` and its tests | Modified | Seeds provenance on a hub's first write |
| `sk-code/hub-router.json`, `ROUTER.md`, changelog | Modified | Frontend ranks ahead of CI; four reach-proven aliases |
| `sk-code/manual-testing-playbook/compiled-routing/surface-alone-frontend-compiled-routing.md` | Created | Gold route for the frontend surface |
| `sk-code-frontend/` references, SKILL.md, playbook, changelog | Modified, created | Overview headings, three-scenario playbook, v1.0.1.0 |
| Root README, skills catalog, quality floor, hub description, Hermes `SYNC.md`, sk-create-skill and sk-doc catalog docs | Modified | Three surfaces, React Native supported, provenance rule as shipped |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix came from a DeepSeek V4.1 Flash max brief run through `opencode run`, was checked in this session and committed on its own. The tie and plan-only fixes were reverted with their tests kept, and the tests failed until the fixes came back. Routing changes ran a compiled-route sync, the gates, then `--finalize`. Each alignment pass ran scope, battery, four lanes, ten probes and the critic, then a recheck against the fixed tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rank the frontend surface ahead of CI | The parent-hub guide places a new surface ahead of the existing ones, or it loses every keyword tie to them; phase 001 planned "just ahead of the fallback", a constraint the new order still keeps |
| Concede probe P03 | "where the focus ring sits" ties three skills at 0.82 and is a design decision; the implementation phrasing reaches sk-code at 0.84, so an alias would take a real design route |
| Regenerate conflicted generated files | The operator chose it at both merges |
| Run the harness from a worktree copy | The harness folder is a symlink to the main checkout, so it would have checked main |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Compiled-route suites | 101 tests, 101 pass, exit 0 |
| sk-create-skill tests | 103 pass, 0 fail |
| Trigger-index and save vitests | 132 pass, 1 skipped, 4 files |
| Revert tests | Tie: fail 1 reverted, pass 1 restored. Plan-only: 1 of 8 fails reverted, 8 of 8 restored |
| Hub status | All seven `compiled-serving` and `fresh`; 55 served copies match |
| Reach, every hub, concurrency 2 | `outranked=0`, `wrong-hub=0`, `RESULT: PASSED` |
| Admission, router-sync, signal check | Every hub passes; 5/5; 0 missing, 0 orphans |
| Playbooks | sk-code 27, sk-code-frontend 3, mcp-figma 20, fundamentals 14, all PASS |
| Second recheck | 4 resolved, 1 still open (D-02, a substring false positive), 11 settled by review |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The alignment harness checks the main checkout from a worktree.** Its folder is a gitignored symlink, so `REPO_ROOT` resolves to main. Copy it into the worktree before a run, as this phase did.
2. **`recheck.cjs` throws `EISDIR` on a finding whose file is a directory link**, and it reports a fix as still open when the old text is a substring of the new. Both are in the operator-local harness and were settled by hand here.
3. **Probe P03 stays on sk-design.** A focus-ring placement prompt with an accessible-label clause routes to design fundamentals by a tie.
<!-- /ANCHOR:limitations -->

---
