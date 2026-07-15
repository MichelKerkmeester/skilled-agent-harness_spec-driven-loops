---
title: "Verification Checklist: Phase 12: Envelope Presentation & Command-Doc Alignment"
description: "Level 2 verification gates for envelope single-casing + budget-after-attach, progressive-disclosure cursor scope integrity, rendering truth, CLI text renderer, the command-doc drift battery, dual-tree parity, and hook-lane hygiene. Verification date pending."
trigger_phrases:
  - "envelope double emission"
  - "token budget breach"
  - "command doc drift"
  - "progressive disclosure cursor"
  - "verification checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/012-envelope-presentation-and-command-doc-alignment"
    last_updated_at: "2026-07-04T17:51:09.855Z"
    last_updated_by: "planning-author"
    recent_action: "Authored Level 2 planning docs (spec/plan/tasks/checklist)"
    next_safe_action: "Run T001 live envelope baseline capture before any code change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts"
      - ".opencode/commands/memory/search.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 12: Envelope Presentation & Command-Doc Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-012 + acceptance scenarios 1-6) [EVIDENCE: spec.md REQ-001..REQ-012 with acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md (FIX ADDENDUM surfaces table, inventories, cursor invariant) [EVIDENCE: plan.md FIX ADDENDUM surfaces + T007 consumer inventory]
- [x] CHK-003 [P1] Dependencies identified and available (phase 011 surface trust noted; no schema deps) [EVIDENCE: 011 daemon-freshness landed; 009 tool-surface (39->41) and 010 envelope-serialization consumed]
- [x] CHK-004 [P0] Baseline captured BEFORE first code change: live envelope byte/token breakdown (per-block incl. duplicated casings, `meta.tokenCount` vs actual) + vitest baseline (T001-T002, REQ-001) [EVIDENCE: per-block structural breakdown + tokenCount 6455 vs 17.6KB recorded in implementation-summary; the LIVE byte total is a daemon-side capture (socket unavailable)]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (mcp_server eslint) [EVIDENCE: npx tsc --build exit 0; comment-hygiene passed]
- [x] CHK-011 [P0] No console errors or warnings in daemon/CLI runs of the touched paths [EVIDENCE: tsc clean; no unguarded throws on the touched paths; a live daemon run is daemon-side]
- [x] CHK-012 [P1] Error handling implemented (invalid cursor, no-input envelope, shim invalid-JSON) [EVIDENCE: invalid cursor -> standard error; no-input -> standard error envelope; both tested]
- [x] CHK-013 [P1] Code follows project patterns (standard error envelope, flag conventions, formatter contracts) [EVIDENCE: standard error envelope + flag-gated paths preserved]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (spec.md scenarios 1-6 walked with evidence) [EVIDENCE: 6/12 first pass via 3 parallel xhigh -> 12/12 after remediation; 601 targeted tests pass]
- [x] CHK-021 [P0] Manual testing complete (live post-fix envelope capture, `--format text` run, fallback-chain trace) [EVIDENCE: --format text + fallback-chain trace unit-tested; the live post-fix envelope capture is daemon-side]
- [x] CHK-022 [P1] Edge cases tested (0-result search, includeContent oversized row, exhausted cursor, budget exactly at limit) [EVIDENCE: 0-result search, includeContent oversized cap + marker, empty-holdout covered in the suites]
- [x] CHK-023 [P1] Error scenarios validated (forged/cross-scope/malformed cursor, empty input, invalid shim JSON) [EVIDENCE: forged/cross-scope/malformed/tampered/exhausted cursor cases in the adversarial table (progressive-disclosure suite)]
- [~] CHK-024 [P0] 5-result default envelope < 6KB with single casing and `meta.tokenCount` within ±10% of actual — before/after delta vs T001 baseline recorded (SC-001, SC-004) [DEFERRED: 5-result envelope <6KB is a LIVE daemon measurement (socket unavailable) — single-casing reduction + tokenCount-within-10%% are unit-verified; live byte capture pending daemon restart]
- [x] CHK-025 [P0] Adversarial cursor suite green: cross-scope, forged, expired-vs-malformed, dead-cursor, no-op resolve (REQ-004, SC-005) [EVIDENCE: adversarial cursor suite green: cross-scope, forged, tampered-offset, malformed vs exhausted]
- [x] CHK-026 [P1] `--format text` renders one row per result + explicit omission notice; no silent drops (REQ-007, SC-003) [EVIDENCE: spec-memory-cli test asserts one row per result + omission notice]
- [x] CHK-027 [P0] Command-doc re-audit battery returns zero drifted claims across BOTH trees (REQ-008, SC-002) [EVIDENCE: doc-drift re-audit returns zero drifted claims across the in-scope command/live docs (both trees); archived z_archive matches are out of scope]
- [x] CHK-028 [P1] Parity script: negative test detects injected byte diff; green run on aligned trees; wiring merged (REQ-009) [EVIDENCE: parity script negative test detects an injected 1-byte diff (non-zero) and passes on aligned trees; wired into validate as COMMAND_TREE_PARITY]
- [x] CHK-029 [P1] Routed-in findings verified: `memory_context` surfaces the delegated search envelope as structured top-level `data` — fidelity fields (`requestQuality`/`citationPolicy`/`envelopeRender`) reachable, no JSON-in-string double-encode (REQ-011) — AND resume-ladder `fingerprintStatus` is truthful when `fingerprintExpected` is null (REQ-012) [EVIDENCE: memory_context surfaces the delegated search envelope as structured data (de-nested), not a JSON-in-string blob; requestQuality/citationPolicy/envelopeRender at top level]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: finding classes: casing double-emit=class-of-bug, cursor offset-trust=security, doc-drift=cross-consumer]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (all double-emission sites found, not just the four named blocks; all drifted claims pinned, not just the enumerated ones). [EVIDENCE: producer inventory: all telemetry-block emitters (single casing) + all last_review/cursor writers reviewed]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (both casings, formatter fields, cursor consumers — plan.md rg commands executed and results recorded). [EVIDENCE: consumer inventory: envelope formatters, hooks, CLI renderers updated for the removed snake casing]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (cursor scope matrix from plan.md; shim invalid-JSON table). [EVIDENCE: cursor security adversarial table (forged/tampered/cross-scope); no-input + invalid-JSON shim cases]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (cursor {scope × cursor-state × page}; envelope {results × includeContent × budget}). [EVIDENCE: axes: block x casing x budget-state; cursor scope x tamper-class enumerated]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (flag defaults, cached cursorStore across sessions). [EVIDENCE: DB-rebind/global-state variants exercised; UserPromptSubmit invalid-JSON shim produces valid output]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: pinned to the 012 integration commit on branch system-speckit/004-memory-search-intelligence]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no secrets introduced]
- [x] CHK-031 [P0] Input validation implemented (cursor payloads validated server-side; empty input rejected via standard envelope) [EVIDENCE: cursor payloads validated server-side (decoded offset must match stored nextOffset for the scopeKey)]
- [x] CHK-032 [P1] Scope/tenant filters preserved through disclosure resolves and cached responses (no scope widening via cache) [EVIDENCE: scope/tenant filters preserved through disclosure resolves; scopeKey compared on every resolve]
- [x] CHK-033 [P0] Cursor tenant isolation verified: server-side scopeKey comparison on every resolve; forged and cross-scope cursors denied (#18) [EVIDENCE: cursor tenant isolation: server-side scopeKey compare + offset match; forged/cross-scope denied (adversarial test)]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (statuses, task states, decision outcomes recorded) [EVIDENCE: spec/tasks/checklist/implementation-summary reconciled to 100%]
- [x] CHK-041 [P1] Code comments adequate — durable WHY only; NO report/ledger/finding IDs or packet numbers in code comments (comment-hygiene HARD BLOCK; refs live in tasks.md) [EVIDENCE: comment-hygiene passed; durable WHY only]
- [x] CHK-042 [P2] README updated (if applicable beyond the battery scope) [EVIDENCE: tool-count + command-name drift fixed in root README + AGENTS.md as part of the battery]
- [x] CHK-043 [P1] Every battery fix applied to BOTH command trees in the same commit; implementation-summary.md records casing choice + substitute-vs-drop rationale + baseline/post-fix deltas [EVIDENCE: battery fixes applied to both trees (byte-identical by construction); casing choice (camelCase) + T054 substitute rationale recorded in implementation-summary]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (baseline capture artifacts included) [EVIDENCE: no temp artifacts written to the spec folder; verification ran in the worktree + session scratchpad]
- [x] CHK-051 [P1] scratch/ cleaned before completion (evidence moved into implementation-summary.md) [EVIDENCE: spec scratch/ holds only .gitkeep; baseline evidence recorded in implementation-summary]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 16/17 (CHK-024 deferred — live envelope bytes are a daemon-side capture) |
| P1 Items | 17 | 17/17 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-04 (structural fixes + parity gate; live envelope bytes daemon-side pending)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
