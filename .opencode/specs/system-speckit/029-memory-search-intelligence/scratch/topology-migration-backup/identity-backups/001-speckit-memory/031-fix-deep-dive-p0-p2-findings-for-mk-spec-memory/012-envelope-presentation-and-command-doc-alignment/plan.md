---
title: "Implementation Plan: Phase 12: Envelope Presentation & Command-Doc Alignment"
description: "Presentation-lane remediation for mk-spec-memory: de-duplicate envelope casing, enforce the token budget after attach, harden progressive-disclosure cursors, fix rendering truth, add a CLI text renderer, and align command docs with code across both duplicated trees."
trigger_phrases:
  - "envelope double emission"
  - "token budget breach"
  - "command doc drift"
  - "progressive disclosure cursor"
  - "dual command tree parity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/012-envelope-presentation-and-command-doc-alignment"
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
      session_id: "scaffold-scaffold/012-envelope-presentation-and-command-doc-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: envelope-presentation-and-command-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node 22+), CJS CLI entry (`spec-memory.cjs`), markdown command docs |
| **Framework** | MCP server (`mk-spec-memory`) + daemon-backed CLI; Claude/OpenCode hook shims |
| **Storage** | SQLite (better-sqlite3) — read-path presentation only; NO schema changes or migrations in this phase |
| **Testing** | Vitest (mcp_server suites) + live CLI envelope capture + grep-based doc re-audit battery |

### Overview
Fix the presentation lane in place: pick one telemetry casing and delete the twin emission, move token-budget enforcement after graphContext/routing/envelope attach (deleting the unreachable sanity guard at `memory-context.ts:608-625`), harden progressive-disclosure cursors with a server-side scopeKey, make rendered labels and fields truthful, add a real `--format text` renderer, then burn down the command-doc drift battery claim-by-claim in both command trees and wire a byte-parity check so they cannot silently fork again. Every 🟡 finding gets a confirm-before-fix verification pass; a live envelope byte/token baseline is captured before the first code change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3, sourced from deep-dive report §5 + ledger Agent I/E sections)
- [x] Success criteria measurable (spec.md §5: <6KB envelope, zero-drift re-audit, ±10% tokenCount, adversarial cursor suite)
- [x] Dependencies identified (phase 011 recommended-first for trustworthy live capture; no schema deps)

### Definition of Done
- [ ] All acceptance criteria met (spec.md REQ-001..REQ-012 + scenarios 1-6)
- [ ] Vitest suites green with delta reported against the REQ-001 baseline
- [ ] Docs updated (spec/plan/tasks/checklist synchronized; implementation-summary.md carries baseline + decisions + evidence)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered pipeline — this phase touches the presentation/serialization layer that wraps the search core, plus the documentation surfaces that describe it. No pipeline-stage or ranking changes.

### Key Components
- **Envelope assembler** (`handlers/memory-search.ts` post-processing): stamps telemetry blocks, session-dedup, includeContent, error envelopes.
- **Context composer / budget enforcer** (`handlers/memory-context.ts`): attaches graphContext/routing/envelope and enforces the token budget — currently in the wrong order, with a dead sanity guard.
- **Progressive-disclosure cursor store** (`lib/search/progressive-disclosure.ts`): issues/resolves pagination cursors; scope binding currently lost after page 1.
- **Renderers**: `lib/search/result-explainability.ts` (labels, `why`), `lib/response/profile-formatters.ts` (field passthrough), `formatters/search-results.ts` + `cli.ts` (`--format text`).
- **World-summary prelude** (`lib/search/memory-summaries.ts`): bare-LIMIT summary selection.
- **Doc surfaces**: `.opencode/commands/**` and its `.claude/commands/**` byte-mirror; `references/memory/save_workflow.md`, `references/memory/memory_system.md`, `mcp_server/hooks/README.md`.
- **Hook shims** (`mcp_server/hooks/claude/`): UserPromptSubmit JSON handling, startup context truncation, fallback-chain constitutional inclusion.

### Data Flow
Pipeline results → formatter/explainability stamping → telemetry + graphContext/routing/envelope attach → (fix: THEN budget enforcement) → single serialization → MCP response / CLI renderer → command docs describe what shipped. Cursor resolves re-enter through the disclosure store, which must re-check the stored scopeKey before touching results.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Envelope telemetry emission (memory-search.ts) | Emits every block in camelCase AND snake_case (L7 🟢) | Update: single casing per T007 inventory | Grep captured payload for twin keys; consumer grep both casings |
| Budget enforcement + sanity guard (memory-context.ts:608-625, ~1886-1969) | Enforces budget pre-attach; guard unreachable (E P2 🟡) | Update: enforce post-attach; delete guard | Unit test on ordering; live `meta.tokenCount` vs actual |
| Delegated-envelope nesting (memory-context.ts ~:757/:761/:925, ~:1088-1116) | Wraps the inner search envelope as JSON-in-string; fidelity fields buried (Agent I, routed in from 013) | Update: de-nest; surface requestQuality/citationPolicy/envelopeRender at top-level data | Envelope capture shows structured data + the three fields present |
| Resume-ladder fingerprintStatus (memory-context.ts:267,484) | Hardcodes 'verified' while fingerprintExpected is null (Agent E, silent-drop #10) | Update: truthful status; no 'verified' without an actual comparison | Resume-row assertion: null-expected → non-'verified' |
| Progressive-disclosure cursor store (progressive-disclosure.ts:402) | Scope binding lost after page 1; client-forgeable (#18 🟡) | Update: server-side scopeKey compare per resolve | Adversarial table tests (cross-scope, forged, expired, malformed, no-op) |
| Result explainability (result-explainability.ts) | Blanket `semantic_match`; `why` computed, never rendered (E P2 / I gap 🟡) | Update: gate label on vector attribution; render or trace-gate `why` | Rendered-output assertion per lane |
| Profile formatter (lib/response/profile-formatters.ts) | Drops `canonicalSource`/`documentType`/`_communityFallback` (E P1 🟡; test passes via mock) | Update: pass through | Formatter test WITHOUT mock |
| Session dedup (memory-search.ts:1652) | Marks "sent" before truncation (E P2 🟡) | Update: mark after truncation | Test: truncated-away row re-eligible next call |
| World-summary prelude (memory-summaries.ts) | Bare LIMIT, no ORDER BY — oldest ~75 rows only (E P2 🟡) | Update: deterministic ORDER BY | SQL assertion + result-set change test |
| CLI text renderer (cli.ts + formatters/search-results.ts) | `--format text` renders summary line only (I gap) | Update: minimal rows + omission notice | CLI snapshot test |
| Command docs ×2 trees (.opencode/commands, .claude/commands) | ~18 claims drifted from code (I) | Update: battery T050-T067 in both trees | Re-audit grep battery = zero drift |
| Command-tree parity (none today) | No sync check — silent fork risk (I contract) | Create: byte-parity script + wiring | Negative test (injected diff) + green run |
| Hook shims (mcp_server/hooks/claude/) | Constitutional block repeats per fallback call; mid-section startup truncation; invalid-JSON concat (I gap/P2) | Update: suppress after first call; boundary truncation; concat fix | Shim unit tests + fallback-chain trace |
| Reference docs (save_workflow.md, memory_system.md, hooks/README.md) | v37 vs v41, retired filenames, mangled path, 4/5-state, opencode/ folder, settings name, stale slug (I) | Update per claim | Per-claim grep after fix |

Required inventories:
- Same-class producers: `rg -n 'artifact_routing|search_decision_envelope|graph_contribution|applied_boosts' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'` (find every double-emission site, not just the four named blocks).
- Consumers of changed symbols: `rg -n 'artifactRouting|artifact_routing|searchDecisionEnvelope|search_decision_envelope|graphContribution|graph_contribution|appliedBoosts|applied_boosts|canonicalSource|documentType|_communityFallback' . --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.md'` before choosing the surviving casing.
- Matrix axes: cursor tests over {scope: same/cross/absent} × {cursor: valid/forged/expired/malformed} × {page: 1/2+/exhausted}; envelope tests over {results: 0/1/5} × {includeContent: on/off} × {budget: under/over}.
- Algorithm invariant: a cursor resolve MUST NOT return rows outside the scope the cursor was issued for (tenant isolation). Adversarial cases: forged scopeKey, cross-scope replay, expired-vs-malformed distinction, cursor for deleted results (dead cursor), no-op resolve.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline & Verify-First (no behavior changes)
- [ ] Capture the live envelope baseline: one `memory_search` (5 results, default flags) with total bytes, per-block byte/token breakdown including each duplicated casing, `meta.tokenCount` vs actual (REQ-001, T001)
- [ ] Capture vitest baseline for the touched suites (T002)
- [ ] Confirm every 🟡 finding at its cited file:line before fixing — budget order + dead guard, cursor scope loss, formatter drops, dedup timing, world-summary LIMIT, semantic_match blanket, includeContent unbounded (T003-T006)
- [ ] Run the consumer + doc-claim inventories (T007-T008)

### Phase 2: Core Implementation
- [ ] Workstream A — Envelope: single casing, budget-after-attach, guard deletion, tokenCount honesty, snippet floor, `memory_context` envelope de-nesting (T010-T015)
- [ ] Workstream B — Progressive disclosure: scopeKey, page-2+ metadata, exhausted-vs-invalid, dead-cursor purge, lean store, substitute-vs-drop decision (T020-T025)
- [ ] Workstream C — Rendering: `why`, label gating, formatter passthrough, content cap, dedup timing, ORDER BY, no-input envelope, resume `fingerprintStatus` honesty (T030-T037)
- [ ] Workstream D — CLI `--format text` renderer + omission notice (T040)
- [ ] Workstream E — Command-doc battery in both trees + parity script (T050-T069)
- [ ] Workstream F — Hook-lane hygiene: constitutional suppression, boundary truncation, shim JSON fix (T070-T072)

### Phase 3: Verification
- [ ] Re-measure the baseline query: envelope < 6KB, single casing, honest tokenCount (T080)
- [ ] Zero-drift re-audit + parity script green (T081-T082)
- [ ] Vitest suite + delta vs baseline; adversarial cursor suite green (T083-T084)
- [ ] Verify routed-in findings: `memory_context` envelope de-nest + truthful resume `fingerprintStatus` (T087)
- [ ] `validate.sh --strict` exit 0; docs + evidence synchronized (T085-T086)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Casing de-duplication, budget ordering, cursor scopeKey adversarial table, formatter passthrough (unmocked), dedup-after-truncation, world-summary ordering, shim invalid-JSON | Vitest (mcp_server suites) |
| Integration | Live daemon `memory_search` envelope capture (baseline + post-fix), `--format text` CLI output, fallback-chain constitutional suppression trace | spec-memory CLI + daemon, scratch capture scripts |
| Manual | Doc re-audit battery (grep per drifted claim, both trees), parity script negative test (injected byte diff) | rg/grep, parity script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 (daemon freshness/health truthfulness) | Internal | Yellow — recommended-first per program order | Live baseline capture untrustworthy on a stale/crashed surface; fall back to any session where memory_search answers, note caveat in evidence |
| Warm daemon + production DB (read-only) for baseline/post-fix capture | Internal | Green | Baseline deferred until surface is up; code work can proceed on vitest only, but SC-001 needs live capture |
| Vitest + existing mcp_server test suites | Internal | Green | None expected |
| No external/library dependencies | External | Green | n/a |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer breaks on the removed casing (hooks/CLI/dashboards parsing snake_case or camelCase twins), result rows get newly truncated below the snippet floor, or in-flight cursor failures exceed the exhausted-vs-invalid contract.
- **Procedure**: `git revert` the phase commits — this phase is presentation-lane and docs only (no schema changes, no migrations, no data mutation), so revert restores the prior envelope byte-for-byte. Doc edits and the parity script are additive files/text reverts. Re-run the REQ-001 baseline query after revert to confirm the envelope matches the captured baseline.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline + Verify-First + Inventories)
        │
        ├──► Workstream A (Envelope) ────────┐
        ├──► Workstream B (Disclosure) ──────┤
        ├──► Workstream C (Rendering) ───────┼──► Phase 3 (Verify)
        ├──► Workstream D (CLI) ─────────────┤
        ├──► Workstream E (Docs + Parity) ───┤
        └──► Workstream F (Hook Hygiene) ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 Setup (T001-T008) | Phase 011 recommended-first (surface trust) | All workstreams |
| Workstream A Envelope | T001, T003, T007 | Phase 3 (T080) |
| Workstream B Disclosure | T004 | Phase 3 (T084) |
| Workstream C Rendering | T005-T006 | Phase 3 (T083) |
| Workstream D CLI | T007 (casing choice) | Phase 3 (T080) |
| Workstream E Docs + Parity | T008 | Phase 3 (T081-T082) |
| Workstream F Hook Hygiene | T006 | Phase 3 (T083) |
| Phase 3 Verification | All workstreams | Phase close, 013 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 Baseline + Verify-First | Low | 1-2 hours |
| Workstreams A-D + F (code) | Medium | 5-7 hours |
| Workstream E (doc battery ×2 trees + parity script) | Medium | 3-4 hours |
| Phase 3 Verification | Low | 2 hours |
| **Total** | | **11-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] REQ-001 baseline captured (envelope bytes/tokens + vitest numbers) — this IS the rollback reference point
- [ ] No feature flags added — fixes to default-ON behavior ship direct per program cross-cutting rule
- [ ] Consumer inventory (T007) recorded so a casing-related breakage can be traced to a named consumer

### Rollback Procedure
1. `git revert` the phase commits (presentation lane + docs only; no daemon restart required beyond rebuild).
2. Rebuild dist and re-run the REQ-001 baseline query — envelope must match the captured baseline byte-for-byte semantics.
3. Smoke test: one `memory_search`, one cursor page-2 resolve, one `--format text` run.
4. Parity script re-run (doc reverts restore both trees together).

### Data Reversal
- **Has data migrations?** No — this phase touches serialization, rendering, docs, and hook shims only.
- **Reversal procedure**: N/A (no data writes; cursorStore is ephemeral session state).
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
