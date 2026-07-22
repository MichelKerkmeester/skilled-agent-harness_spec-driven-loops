---
title: "Plan: Research + Refactor the sk-design /interface:* Design Commands"
description: "Plan: web-informed research into design-command patterns, then refactor the five /interface:* commands to conformant thin routers aligned with the sk-doc create-command standard, then test + benchmark + verify real invocation."
trigger_phrases:
  - "interface command refactor plan"
  - "thin router create-command alignment plan"
  - "design command research refactor plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/009-interface-command-research-refactor"
    last_updated_at: "2026-07-22T10:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Refactored to thin routers; test 8/8; real invocation verified."
    next_safe_action: "Commit + push Phase 2/3."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-doc/create-command/assets/command-contract.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-009-interface-command-research-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: Research + Refactor the sk-design /interface:* Design Commands

<!-- ANCHOR:summary -->
## 1. SUMMARY

Research how leading tools structure design commands (web-informed), then refactor the five `/interface:*`
commands to conformant **thin routers** aligned with the `sk-doc` create-command standard (the operator's
chosen topology), then test + benchmark + verify real invocation. Deep research ran via direct SOL-fast
dispatches (the `/deep:research` loop group-kills opencode at iteration dispatch — a framework bug) plus
native Opus-4.8 web research.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `research.md` with ranked, source-cited findings.
- All 5 commands are router-detected (PRESENTATION BOUNDARY) with exactly one `@`-include of the shared contract.
- `interface-command-contract.test.mjs` green.
- The create-command machine contract references the live `/interface:*` surface (0 stale `/design`).
- A real `/interface:design` invocation routes (Route Proof + STATUS + @-include expansion).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The create-command standard classifies this family as a mode-pair **router**: a thin `.md` dispatcher that
owns a presentation asset (the normative prompt) + paired `_auto`/`_confirm` workflows. The 012/008 rewrite
had inverted this to literal bodies; Phase 2 restores the router topology (base `d0e838c73c~1`) and layers
the one `@`-include + the machine-contract refresh. Design taste stays in the sk-design modes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Research** — SOL-fast web dispatches + native Opus; synthesize `research.md`.
2. **Refactor** — restore the 5 routers + presentations + test to the conformant router base; add one `@`-include per router; refresh `command-contract.json` to `/interface:*`.
3. **Test + benchmark + verify** — contract test green; per-command conformance scorecard; real invocation routes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test interface-command-contract.test.mjs` (8/8) is the automated conformance harness. A per-command
scorecard records router-detection, `@`-include count, no-taste, and modes-wired. Real invocation is
verified by dispatching `/interface:design` and confirming router output + `@`-include expansion.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The `sk-doc` create-command standard (authoring contract + template-rules + machine contract).
- The pre-012/008 router base (`d0e838c73c~1`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The refactor is a scoped restore + targeted edits on an isolated worktree branch. Rollback is `git revert`;
the shipped commands return to the 012/008 literal state. No runtime/data touched.
<!-- /ANCHOR:rollback -->
