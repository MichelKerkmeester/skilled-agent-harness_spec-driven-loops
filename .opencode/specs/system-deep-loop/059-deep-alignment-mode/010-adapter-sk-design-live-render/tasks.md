---
title: "Tasks: Phase 10: adapter-sk-design-live-render"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 010"
  - "adapter sk-design live-render"
  - "chrome-devtools audit"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render"
    last_updated_at: "2026-07-11T14:57:13Z"
    last_updated_by: "claude"
    recent_action: "T001-T013 all done; adapter built+dry-ran, zero chrome-devtools sites"
    next_safe_action: "Phase 008 resolves module-selection + lane-key gaps (plan.md Architecture)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "006/008 were NOT actually blockers for building this adapter's code -- this adapter is self-contained against phase 005's contract; 006/008 only gate the module-selection/lane-key wiring, not this file's own correctness"
---
# Tasks: Phase 10: adapter-sk-design-live-render

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirmed phase 005 adapter contract signature by reading `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_adapter.md` and `scripts/adapters/sk-doc.cjs` in full before this build started; the three-method shape and the caller-supplied-evidence pattern (§4.2 `checkRealityAlignment`) were reused directly.
- [x] T002 Re-read `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` for currency — found it defines a child-agent/small-model routing-proof envelope, not a render interface; this corrected the plan's original framing rather than merely confirming it (adapter spec Section 8).
- [x] T003 [P] Re-read `accessibility_performance.md` and `anti_patterns_production.md`; v1 rubric unchanged, thresholds cited verbatim into `THRESHOLDS`.
- [x] T004 [P] Re-read `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` header (CLI `bdg` + Code Mode MCP orchestrator, confirmed real); confirmed no direct dispatch to it exists anywhere in this build.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- Gate opened by operator approval 2026-07-11; these tasks did not actually require 006/008 to exist -- this adapter is self-contained against phase 005's contract, and 006/008 only gate downstream wiring (module-selection, lane-key), not this file's own correctness. -->

- [x] T005 Implemented `discover(scope)` over renderable UI targets — `url`/`componentEntry` classification, no directory/glob expansion (documented scope-down). Live-verified: 4-value input -> 2 kept, 2 correctly filtered (leading-slash route, glob metachar).
- [x] T006 Implemented `standardSource(authority)` loading the live-audit rubric sources plus concrete AA-floor thresholds. Live-verified via CLI `standard-source`.
- [x] T007 Implemented `check(artifact, rules, options)` as a pure-function dispatch wrapper — it validates caller-supplied `options.renderResult.dispatchedThrough === 'design-mcp-open-design'` rather than calling the transport itself (adapter spec Section 4 explains why it cannot dispatch standalone). Findings carry `layer: 'live-render'` plus a `producedBy` field. Live-verified across 6 scenarios (7 findings total in the full-measurements case).
- [x] T008 Named this adapter's known-deviation/accepted-convention list location (`references/adapters/sk_design_live_render_known_deviations.md`, authority-local, sibling to phase 006's future list) — file not yet created since no real live-render run has produced a finding to seed it with (honest, not a gap papered over); `loadKnownDeviations()` degrades to `[]`, live-verified.
- [x] T009 Wired VERIFY-FIRST as an evidence-label mechanism (`confirmed`/`inferred` keyed on `renderResult.renderedAt`); the true "re-render before assertion" guarantee is documented as a caller contract this stateless function cannot mechanically enforce (adapter spec Section 5) — stated honestly rather than claimed as fully automatic.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Dry-ran the adapter against synthetic targets and caller-supplied render evidence (7 CLI invocations total). No live `design-mcp-open-design` MCP dispatch exists to test against in this environment — that transport requires an agent tool-use loop this manual pass does not have; what was verified is the pure-function boundary itself, matching this adapter's actual design (it never dispatches).
- [x] T011 Grepped both new files for direct `mcp-chrome-devtools` call sites: `rg -n "mcp-chrome-devtools|mcp__.*chrome" .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md` — zero call sites, only prose explaining why the tool is not called.
- [x] T012 Confirmed the adapter returns the documented `render-unavailable` P1 finding (not an error, not a fabricated pass) when `options.renderResult` is omitted — live CLI-verified.
- [x] T013 Updated `checklist.md` with evidence for each item (see that file).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (7 CLI dry-runs, all producing the designed output; `node --check` clean; dispatch-boundary grep clean)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
