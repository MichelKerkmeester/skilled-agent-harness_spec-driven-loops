---
title: "Routing Parity Fixtures: Phase 3 — scaffold hub"
description: "Static representative prompts that freeze current sk-code routing-intent expectations for post-cutover comparison; baseline capture runs later on main."
trigger_phrases:
  - "sk-code routing parity fixtures"
  - "sk-code scaffold routing fixtures"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/003-scaffold-hub"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented static routing-parity fixture expectations for the scaffold hub"
    next_safe_action: "Capture the live routing baseline on main during the later routing benchmark/cutover phases"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Routing Parity Fixtures: Phase 3 — scaffold hub

<!-- SPECKIT_LEVEL: 1 -->

These fixtures are **static expectations**, not a captured baseline. They freeze the current routing intent that later phases should compare against after the nested hub cutover. The actual baseline capture runs later on `main` during the routing benchmark/cutover work.

Every prompt below is expected to route to the single `sk-code` hub identity first, then resolve to the listed mode and surface tag.

| ID | Representative Prompt | Expected Hub | Expected Resolved Mode | Expected Surface Tag |
|----|-----------------------|--------------|------------------------|----------------------|
| RPF-001 | "Implement a Webflow interaction that initializes Lenis smooth-scroll and guards Swiper startup behind the Webflow ready event." | `sk-code` | `implement` | `WEBFLOW` |
| RPF-002 | "Update an OpenCode TypeScript MCP handler to add a missing JSON validation branch and keep the existing alignment verifier workflow green." | `sk-code` | `implement` | `OPENCODE` |
| RPF-003 | "Add a tiny helper to normalize a file count in this unknown repository; inspect the stack before editing." | `sk-code` | `implement` | `UNKNOWN` |
| RPF-004 | "Integrate Motion.dev scroll gestures into a cross-stack animation flow that also touches the existing Webflow frontend script." | `sk-code` | `implement` | `MOTION_DEV` |
| RPF-005 | "Run the Phase-1.5 quality gate: check P0/P1/P2 author issues, comment hygiene, and the surface checklist for recent code edits." | `sk-code` | `quality` | `OPENCODE` |
| RPF-006 | "Phase 3 verify: gather Iron Law evidence, run language-specific verification commands, and report the fresh results without editing files." | `sk-code` | `verify` | `OPENCODE` |
| RPF-007 | "Debug the failing build by tracing the root cause, avoid symptom fixes, and recover from the current test failure." | `sk-code` | `debug` | `OPENCODE` |
| RPF-008 | "Use sk-code-review to perform a findings-first security and correctness review of this PR." | `sk-code` | `review` | `OPENCODE` |

Notes:
- `RPF-003` intentionally freezes the unknown-surface fallback as `UNKNOWN` while still resolving to implementation mode.
- `RPF-004` treats Motion.dev as a peer resource/surface tag over the shared surface router, while the workflow remains implementation.
- `RPF-008` freezes the legacy explicit `sk-code-review` intent expectation: the post-cutover system should resolve it through the `sk-code` hub to `review` mode before the legacy route is removed.
