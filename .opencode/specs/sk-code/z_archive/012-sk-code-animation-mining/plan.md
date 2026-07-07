---
title: "Plan: sk-code Animation Surface Mining"
description: "Outsource the web-motion-skill analysis + draft implementation to gpt-5.5-fast (xhigh, cli-opencode) in an isolated wt/0006 worktree under RM-8, then review the diff and integrate the additive parts into sk-code's animation references/assets/routing on main, drift-guard-validated."
trigger_phrases:
  - "sk-code animation mining plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/012-sk-code-animation-mining"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Drafted the outsource + worktree + integrate plan"
    next_safe_action: "Create the wt/0006 worktree and dispatch gpt-5.5"
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
# Plan: sk-code Animation Surface Mining

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase creation + reviewed integration are mine; the deep analysis and draft implementation are outsourced to **gpt-5.5-fast (xhigh) via cli-opencode**, run inside an isolated **`wt/0006-sk-code-animation`** git worktree (RM-8 isolation). gpt-5.5 mines `web-motion-skill` for the additive animation-principle layer + visual-verification recipe, drafts the new sk-code artifacts + the `smart_routing.md` wiring in the worktree, and writes its rationale. I then review the worktree diff, integrate only the vetted, genuinely-additive parts into main, run the drift guard, and attribute MIT.

### Technical Context
sk-code's animation surface lives at `references/motion_dev/` + `assets/motion_dev/` + `references/webflow/implementation/animation_workflows.md`, routed via `smart_routing.md` §5 (MOTION_DEV map) + §11 (RESOURCE_MAP, ANIMATION/MOTION_DEV/PERFORMANCE intents), guarded by `skill-benchmark/tests/sk-code-router-sync.vitest.ts`.

### Overview
Outsource the intellectual work safely (worktree + scoped prompt), keep the prod skill protected (reviewed integration), and prove correctness with the existing drift guard.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
The worktree exists off a recorded HEAD baseline; the gpt-5.5 prompt enumerates sk-code's current animation surface + the RM-8 BANNED/ALLOWED scope.

### Definition of Done
Additive artifacts wired into §11; `sk-code-router-sync.vitest.ts` green on main; MIT attribution present; the worktree diff was human-reviewed; weak drafts dropped; decision-record captures provenance.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Outsourced-analysis-in-worktree with reviewed integration — the heavy lifting runs sandboxed, the prod skill changes only through a vetted merge.

### Key Components
The gpt-5.5 dispatch (cli-opencode `openai/gpt-5.5-fast --variant xhigh`, omit `--agent`, `--format json`, `--dir <worktree>`, `</dev/null`, generous `gtimeout -k`); the `wt/0006` worktree; sk-code's `references/motion_dev/` + `smart_routing.md`; the drift guard.

### Key Decisions
- **Worktree, not main (RM-8 L2).** `--dangerously-skip-permissions` grants FS-wide write; prose scope alone once let a dispatch delete 44 files. The worktree contains any damage.
- **gpt-5.5, not deepseek (RM-8 L4).** The user-chosen, careful model for write-capable dispatch.
- **Additive-delta only.** The prompt enumerates the 6 existing motion_dev refs so gpt-5.5 does not re-document them.
- **Drift guard in main, not the worktree.** A bare worktree lacks gitignored `node_modules`; the guard runs on main after integration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- sk-code WEBFLOW/MOTION_DEV surface: `references/motion_dev/`, `assets/motion_dev/snippets/`, `references/smart_routing.md`.
- The skill-benchmark drift guard (`sk-code-router-sync.vitest.ts`) — must stay green.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Create the `wt/0006-sk-code-animation` worktree off HEAD (sk-git method, user-chosen); record the baseline commit; compose the RM-8-scoped gpt-5.5 prompt.

### Phase 2: Core Implementation
Dispatch gpt-5.5 in the worktree: clone web-motion-skill, deep-analyze vs sk-code's surface, draft the additive ref(s)/snippet(s) + `smart_routing.md` §5/§11 wiring + an attribution notice, and write its analysis/rationale.

### Phase 3: Verification
Review the worktree diff + rationale; integrate only the vetted additive parts into main's sk-code; run `sk-code-router-sync.vitest.ts` (+ optionally the sk-code skill-benchmark) green; copy the analysis to `proposals/`; remove the worktree.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`npx vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts` (from `deep-improvement/scripts`) green on main after wiring; optionally a router-mode sk-code skill-benchmark to confirm the new refs route under ANIMATION/MOTION_DEV. Content quality is human-reviewed (no automated test for prose).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `web-motion-skill` MIT repo (cloned by gpt-5.5), sk-code's current animation surface, and the router drift guard.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing lands in main until reviewed integration, so rollback is "don't integrate" (drop the worktree). Post-integration: revert the sk-code commit; the worktree branch `wt/0006` preserves the drafts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 (worktree + prompt) → 2 (gpt-5.5 drafts in worktree) → 3 (review + integrate + verify). Phase 3 gates what reaches main.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Small for me (phase + worktree + dispatch + reviewed integration); the analysis effort is gpt-5.5's (one long xhigh dispatch).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
HEAD baseline recorded; worktree created off it; drift guard green pre-change on main.

### Rollback Procedure
Discard the worktree (`git worktree remove`); if already integrated, single-commit revert of the sk-code change.

### Data Reversal
None — docs/assets/routing only; no persisted state.
<!-- /ANCHOR:enhanced-rollback -->
