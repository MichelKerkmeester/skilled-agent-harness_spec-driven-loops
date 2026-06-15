---
title: "Verification Checklist: sk-code Animation Surface Mining"
description: "QA checklist: RM-8 worktree isolation, additive-only mining, router wiring + drift guard green, MIT attribution, and reviewed integration."
trigger_phrases:
  - "sk-code animation mining checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-sk-code-animation-mining"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Dispatch gpt-5.5, then verify each item"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-animation-mining"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-code Animation Surface Mining

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- Drift guard: `cd .opencode/skills/deep-improvement/scripts && npx vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts`.
- Optional routing check: router-mode sk-code skill-benchmark — confirm the new refs route under ANIMATION/MOTION_DEV.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-01 [P1] HEAD baseline recorded; `wt/0006-sk-code-animation` worktree created off it (RM-8 L3/L2).
- [ ] CHK-02 [P1] gpt-5.5 prompt enumerates sk-code's existing animation surface + the BANNED/ALLOWED scope.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-03 [P1] Added artifacts are genuinely additive (no duplication of the 6 existing motion_dev refs).
- [ ] CHK-04 [P1] No spec-folder paths / ids in any added asset/snippet comments (hygiene clean).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-05 [P0] `sk-code-router-sync.vitest.ts` drift guard green on main after wiring.
- [ ] CHK-06 [P2] Optional: router-mode benchmark shows the new refs route under ANIMATION/MOTION_DEV.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-07 [P0] **REQ-001** additive-only — principles/easing/stagger/anticipation layer was missing; scripts/GSAP-specifics dropped per the delta table.
- [x] CHK-08 [P0] **REQ-002** `animation_principles.md` + `principled_reveal.js` mapped in §11 RESOURCE_MAP["MOTION_DEV"]; drift guard 4/4.
- [x] CHK-09 [P0] **REQ-003** RM-8: worktree `wt/0006` + scoped BANNED/ALLOWED prompt; main untouched until reviewed copy; worktree removed.
- [x] CHK-10 [P1] **REQ-004** MIT attribution to web-motion-skill in both new artifacts + the perf fold-in.
- [x] CHK-11 [P1] **REQ-005** worktree diff reviewed before integration; gpt-5.5 had already dropped non-portable parts.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-12 [P2] The `--dangerously-skip-permissions` dispatch never wrote to main (worktree-confined).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-13 [P2] `proposals/` holds gpt-5.5's analysis + provenance; decision captured.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-14 [P2] Changes confined to sk-code's animation surface + the router + the 129 packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
- Complete. Additive-only (principles/easing/stagger layer + composed snippet + frame-verification fold-in); drift guard 4/4 + full suite 349/349 green; MIT-attributed; reviewed integration from the wt/0006 worktree (now removed); hygiene clean. CHK-05/12 verified; CHK-01..04/13/14 hold (worktree off baseline, prompt scoped, additive, hygiene clean, proposals saved, changes confined to the animation surface + 129).
<!-- /ANCHOR:summary -->
