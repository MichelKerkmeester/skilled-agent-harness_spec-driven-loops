---
title: "Feature Specification: Phase 12: Envelope Presentation & Command-Doc Alignment"
description: "memory_search emits a 17.6KB envelope for 5 results by double-emitting every telemetry block in camelCase and snake_case, enforces its token budget before graphContext/routing/envelope attach (meta.tokenCount 6,455 vs budget 3,500), leaks cursor scope across tenants, and ships command docs with ~18 claims drifted from code across two duplicated command trees."
trigger_phrases:
  - "envelope double emission"
  - "token budget breach"
  - "command doc drift"
  - "progressive disclosure cursor"
  - "single casing envelope"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/012-envelope-presentation-and-command-doc-alignment"
    last_updated_at: "2026-07-03T09:58:00Z"
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
    open_questions:
      - "Which casing survives the envelope de-duplication (camelCase vs snake_case) — pending T007 consumer inventory"
      - "Substitute-vs-drop for the additive progressive-disclosure block — decided in T025, recorded in implementation-summary.md"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: envelope-presentation-and-command-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 13 |
| **Predecessor** | 011-daemon-freshness-and-health-truthfulness |
| **Successor** | 013-absorb-028-006-review-remediation-closeout |
| **Handoff Criteria** | 5-result default `memory_search` envelope < 6KB with single-casing telemetry and honest `meta.tokenCount`; cursor scope enforced server-side with adversarial tests green; command-doc re-audit shows zero drifted claims in both trees; parity check script wired and exiting 0; `--format text` renders result rows; `memory_context` returns structured (non-double-encoded) top-level `data` with truthful resume `fingerprintStatus` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Deep dive remediation phase children specification.

**Scope Boundary**: Presentation, serialization, and documentation lane only — envelope assembly, budget ordering, progressive disclosure, result rendering, CLI text output, command-doc truth, command-tree parity, and hook-lane presentation hygiene. No ranking semantics (phase 007), no indexing/save-path changes (phases 001-004), no daemon exit taxonomy or hook fallback surfacing (phase 011), no envelope serialization performance work (phase 010).

**Dependencies**:
- Phase 011 (daemon freshness / health truthfulness) recommended-first per program execution order: the T001 live envelope baseline needs a trustworthy daemon + CLI surface. Not hard-blocking — baseline can be captured on any session where `memory_search` answers.
- No schema or migration dependencies; this phase is read-path presentation plus docs.

**Deliverables**:
- Single-casing envelope with budget enforced after graphContext/routing/envelope attach, dead sanity guard deleted, honest `meta.tokenCount`, and a compact-row snippet floor.
- Progressive-disclosure cursor hardening (server-side scopeKey, page-2+ metadata, exhausted-vs-invalid, no dead cursors in cached responses, lean cursorStore) plus the substitute-vs-drop decision for the additive block.
- Result-rendering truth: `why` rendered or trace-gated, `semantic_match` gated on real vector attribution, formatter field passthrough, `includeContent` per-result cap, session-dedup mark-after-truncation, world-summary deterministic ordering, standard no-input error envelope.
- CLI `--format text` minimal row renderer with omission notice.
- Command-doc drift battery (one fix per drifted claim, both trees) + byte-parity check script wired into validation/CI.
- Hook-lane hygiene: constitutional block suppression after first fallback-chain call, startup truncation at section boundaries, UserPromptSubmit shim invalid-JSON concat fix.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Live-measured (deep-dive report §5, ledger L7 🟢): a 5-result `memory_search` returns a 17.6KB envelope because every telemetry block is double-emitted in camelCase AND snake_case (`artifactRouting`/`artifact_routing`, `graphContribution`/`graph_contribution`, `searchDecisionEnvelope`/`search_decision_envelope`, `appliedBoosts`/`applied_boosts`), while the token budget is enforced BEFORE graphContext/routing/envelope attach — so results get compacted to empty snippets while metadata survives, and `meta.tokenCount` reports 6,455 against an "enforced" budget of 3,500. Presentation drops or mislabels what matters: `why` is computed but never rendered, every row is labeled `semantic_match`, the formatter drops handler-stamped fields, `--format text` silently discards all result rows, and progressive-disclosure cursors lose scope binding after page 1 (client-forgeable tenant leak, finding #18). On top of that, the command docs have ~18 claims drifted from code (starting with the envelope-fidelity flag documented default-OFF but actually default-ON, finding #28) across two byte-duplicated command trees with no sync check.

### Purpose
A default 5-result search envelope under 6KB that tells the truth (one casing, honest token count, real labels, visible `why`), cursors that cannot cross scope, a usable text format, and command docs whose every checked claim matches code — verified by a zero-drift re-audit and a wired parity check.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Envelope**: single casing per telemetry block (kill the camelCase+snake_case double emission); budget enforcement moved AFTER graphContext/routing/envelope attach; delete the unreachable sanity guard (`memory-context.ts:608-625`, enforcement region ~1886-1969); `meta.tokenCount` honesty; compact-row snippet floor so result rows survive before metadata does.
- **`memory_context` envelope shape**: de-nest the delegated `memory_search` envelope so it is not double-encoded as JSON-in-string (`memory-context.ts` ~:757/:761/:925), and surface the fidelity verdict fields (`requestQuality`/`citationPolicy`/`envelopeRender`) at the top-level `data` the search presentation contract renders (search.md:78-80) — routed in from the 013 sweep.
- **Progressive disclosure**: cursor `scopeKey` stored server-side and compared on every resolve (#18); page-2+ rows carry title/path/score/tier; exhausted vs invalid cursors distinguishable; cached responses must not embed dead cursors; cursorStore holds ids+snippets, not full results; substitute-vs-drop decision for the additive block.
- **Result rendering**: `why` rendered as a one-token suffix or emission trace-gated; `semantic_match` label gated on real vector attribution; formatter passes `canonicalSource`/`documentType`/`_communityFallback`; `includeContent` per-result cap with truncation marker; session-dedup marks "sent" AFTER truncation; world-summary prelude gets a deterministic ORDER BY; no-input errors return the standard error envelope; resume-ladder `fingerprintStatus` reports a truthful status instead of a hardcoded `'verified'` when no expected fingerprint is compared (`memory-context.ts:267,484`).
- **CLI**: `--format text` minimal row renderer plus an explicit omission notice for suppressed blocks.
- **Command-doc drift battery**: one task per drifted claim (envelope-fidelity default, `--intent` forms, validate true/false, stats field names, tool matrix rows, README section order + retention-sweep row + assets claim, hooks README opencode/ folder + settings file name + `/spec_kit:resume` slug, save_workflow v37→v41 + retired-filename checklist, memory_system DB_UPDATED_FILE path + 4/5-state model, resume history hint, search.md arg quoting, health status enum), applied to both trees.
- **Dual command-tree parity**: byte-parity check script for `.opencode/commands` ↔ `.claude/commands`, wired into validate or CI.
- **Hook-lane hygiene**: constitutional block suppressed after the first call in a fallback chain (`includeConstitutional:false`); startup truncation at section boundaries; UserPromptSubmit shim invalid-JSON concat fix.

### Out of Scope
- Exit-75 taxonomy, dist-freshness, hook fallback visibility — phase 011 owns the daemon/ops surface.
- Envelope single-serialization performance (the ~8× JSON round-trip) — phase 010 (E OPT); this phase changes WHAT is emitted, not how many times it is serialized.
- Ranking/score semantics, trust badges, confidence calibration display — phase 007 and the 013 sweep; presentation here only stops mislabeling, it does not re-rank.
- Trigger-phrase quality and matcher/cache behavior — phase 005.
- Tracker closeout and the 91-P2 triage table — phase 013.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts | Modify | Single-casing telemetry emission; `includeContent` per-result cap + truncation marker; session-dedup mark-after-truncation (~:1652); standard no-input error envelope |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts | Modify | Budget enforcement after graphContext/routing/envelope attach (~:1886-1969); delete unreachable sanity guard (:608-625); `meta.tokenCount` honesty; fallback-chain constitutional suppression; de-nest delegated search envelope + surface fidelity fields (~:757/:761/:925, ~:1088-1116); truthful resume-ladder `fingerprintStatus` (:267,484) |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts | Modify | Server-side cursor scopeKey + per-resolve compare (:402); page-2+ metadata; exhausted-vs-invalid; lean cursorStore; no dead cursors in cached responses; substitute-vs-drop outcome |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts | Modify | `why` one-token suffix render or trace-gated emission; `semantic_match` gated on vector attribution |
| .opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts | Modify | Pass `canonicalSource`/`documentType`/`_communityFallback` through to rendered results |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts | Modify | World-summary prelude deterministic ORDER BY (replace bare LIMIT) |
| .opencode/skills/system-spec-kit/mcp_server/cli.ts + formatters/search-results.ts | Modify | `--format text` minimal row renderer + omission notice |
| .opencode/skills/system-spec-kit/mcp_server/hooks/claude/ (user-prompt-submit + startup builder) | Modify | Invalid-JSON concat fix; startup truncation at section boundaries |
| .opencode/commands/memory/ (README.txt, search.md, manage.md, save.md) | Modify | Doc-drift battery fixes (see tasks T050-T067) |
| .claude/commands/memory/ (mirror tree) | Modify | Identical battery fixes mirrored |
| .opencode/commands/speckit/resume.md (+ .claude mirror) | Modify | Resume presentation history hint; stale slug references |
| .opencode/skills/system-spec-kit/references/memory/save_workflow.md | Modify | Schema v37→v41; retired-filename checklist removal |
| .opencode/skills/system-spec-kit/references/memory/memory_system.md | Modify | DB_UPDATED_FILE mangled path; 4-state vs 5-state model |
| .opencode/skills/system-spec-kit/mcp_server/hooks/README.md | Modify | opencode/ folder claim; settings file name; `/spec_kit:resume` → `/speckit:resume` slug |
| system-spec-kit scripts (command-tree parity check) | Create | Byte-parity check `.opencode/commands` ↔ `.claude/commands` + validate/CI wiring |
| mcp_server vitest suites (search/context/disclosure/formatters) | Modify | Adversarial cursor tests; casing, budget-order, formatter-passthrough, dedup-timing, ordering tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **Baseline before changes** (program contract): capture one live `memory_search` envelope byte/token breakdown — total bytes, per-block sizes including each duplicated-casing block, `meta.tokenCount` vs actual serialized tokens — plus a vitest baseline for the touched suites | Breakdown recorded in implementation-summary.md evidence BEFORE the first code change; vitest baseline numbers captured |
| REQ-002 | **Envelope single casing**: exactly one casing emitted per telemetry block (`artifactRouting`, `graphContribution`, `searchDecisionEnvelope`, `appliedBoosts`, plus any other double-emitted block found by inventory); surviving casing chosen from the T007 consumer inventory | Serialized envelope contains no camelCase/snake_case twin keys (grep on captured payload); consumers of the removed casing updated in the same change |
| REQ-003 | **Budget after attach + honest tokenCount**: token budget enforced AFTER graphContext/routing/envelope attach; unreachable sanity guard (`memory-context.ts:608-625`) deleted; `meta.tokenCount` reflects the final serialized payload; compact-row snippet floor keeps result rows renderable before metadata survives | Post-fix capture: `meta.tokenCount` within ±10% of actual serialized token count; over-budget path compacts metadata before result rows; guard code absent |
| REQ-004 | **Cursor scope integrity** (#18, tenant leak): `scopeKey` stored server-side and compared on every resolve; forged/cross-scope cursors denied; page-2+ rows carry title/path/score/tier; exhausted vs invalid distinguishable; cached responses embed no dead cursors; cursorStore holds ids+snippets only | Adversarial table tests pass: cross-scope resolve, forged cursor, expired vs malformed, no-op page; page-2 payload shows metadata fields |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | **Rendering truth**: `why` rendered as one-token suffix or emission trace-gated; `semantic_match` label only when vector attribution is real; formatter passes `canonicalSource`/`documentType`/`_communityFallback` | Rendered output shows `why` (or emission gated + documented); non-vector rows carry a non-`semantic_match` label; formatter test asserts field passthrough WITHOUT mocking the formatter |
| REQ-006 | **Content/dedup hygiene**: `includeContent` per-result cap + truncation marker; session-dedup marks "sent" AFTER budget truncation; world-summary prelude deterministic ORDER BY; empty input returns the standard error envelope | Oversized-content test shows capped content + marker; truncated-away results are re-eligible next call; summary query carries ORDER BY; no-input call returns standard error shape |
| REQ-007 | **CLI text format**: `--format text` renders minimal result rows (title/path/score) plus an explicit omission notice for suppressed blocks | CLI invocation with `--format text` shows one row per result + notice; no silent row drops |
| REQ-008 | **Command-doc drift battery**: every enumerated drifted claim fixed in BOTH trees (see tasks T050-T067) | Re-audit battery (grep per claim) returns zero drifted claims |
| REQ-009 | **Dual-tree parity**: byte-parity check script comparing `.opencode/commands` ↔ `.claude/commands`, wired into validate or CI | Script exits non-zero on injected byte diff (negative test) and 0 on the aligned trees; wiring merged |
| REQ-010 | **Hook-lane hygiene**: constitutional block suppressed after first call in a fallback chain (`includeConstitutional:false`); startup truncation cuts at section boundaries; UserPromptSubmit shim invalid-JSON concat fixed | Fallback-chain trace shows constitutional block once; truncated startup context ends at a section boundary; shim test with invalid JSON input produces valid output |
| REQ-011 | **`memory_context` envelope de-nesting** (Agent I, routed in from 013): the delegated `memory_search` envelope is not double-encoded as JSON-in-string; `requestQuality`/`citationPolicy`/`envelopeRender` are reachable at the top-level `data` | Envelope capture shows the inner search result as structured `data` (not a JSON-string blob); the three fidelity fields appear at top level when the source envelope carries them |
| REQ-012 | **Resume-status honesty** (Agent E, silent-drop #10): resume-ladder rows do not report `fingerprintStatus:'verified'` unless an expected fingerprint was actually compared; a read-stability-only read reports a truthful status | Resume-ladder row with `fingerprintExpected:null` reports a non-`'verified'` status; test asserts the status reflects whether a comparison occurred |

### Acceptance Scenarios

1. **Given** default flags on a warm daemon, **When** `memory_search` returns 5 results, **Then** the envelope is < 6KB, contains exactly one casing per telemetry block, and `meta.tokenCount` is within ±10% of the actual serialized size.
2. **Given** a page-1 cursor issued under scope A, **When** it is resolved under scope B or with a forged payload, **Then** the resolve is denied with an invalid-cursor error that is distinguishable from an exhausted-cursor response.
3. **Given** a valid page-2 resolve, **When** results return, **Then** each row carries title, path, score, and tier alongside its snippet.
4. **Given** `includeContent:true` with an oversized result, **When** the envelope is built, **Then** content is capped per-result with a truncation marker and session-dedup marks only the results actually sent after truncation.
5. **Given** `--format text`, **When** a search returns results, **Then** minimal rows render for every result with an explicit notice for omitted blocks.
6. **Given** the re-audit battery and parity script, **When** run after the doc fixes, **Then** zero drifted claims are found in either tree and the parity check exits 0.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 5-result default `memory_search` envelope < 6KB (baseline: 17.6KB live-measured), verified against the same query used in the REQ-001 baseline.
- **SC-002**: Zero drifted doc claims on the re-audit battery across both command trees; parity script wired and green.
- **SC-003**: `--format text` is usable — result rows visible, omissions explicit.
- **SC-004**: `meta.tokenCount` within ±10% of the actual serialized payload; over-budget compaction hits metadata before result rows (snippet floor respected).
- **SC-005**: Cursor adversarial suite green (cross-scope, forged, expired-vs-malformed); vitest delta vs the REQ-001 baseline shows no regressions.
- **SC-006**: `memory_context` surfaces the delegated search result as structured top-level `data` (no JSON-in-string double-encode; `requestQuality`/`citationPolicy`/`envelopeRender` reachable), and resume-ladder `fingerprintStatus` is truthful — never a blanket `'verified'` when `fingerprintExpected` is null (REQ-011, REQ-012).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 011 daemon/CLI trust for live baseline | Baseline capture unreliable if surface is stale/crashed | Run 011 first per program order; verify daemon health before T001 |
| Risk | Consumers parse the casing being removed (hooks, CLI, tests, dashboards) | Silent breakage on de-duplication | T007 consumer inventory (rg both casings across ts/js/cjs/md) BEFORE choosing surviving casing; update consumers in same change |
| Risk | Budget-after-attach newly truncates result rows that previously survived | Fewer visible results | Compact-row snippet floor: metadata compacts before result rows; scenario 1 + SC-004 verify ordering |
| Risk | Cursor scope tightening invalidates in-flight cursors | One-time resolve failures at deploy | Exhausted-vs-invalid distinction gives clients an actionable error; cursors are short-lived session artifacts |
| Risk | Doc battery edits drift the two command trees apart mid-phase | Silent fork the phase exists to prevent | Mirror every edit in the same commit; REQ-009 parity script lands before phase close |
| Risk | 🟡 findings are agent-verified, not all live-reproduced | Fixing a misread symptom | Verify-first tasks T003-T006 confirm each 🟡 finding at cited file:line before the fix (finding-is-a-hypothesis) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which casing survives the envelope de-duplication — camelCase (TS-native) or snake_case? Decided by the T007 consumer inventory; recorded in implementation-summary.md.
- Substitute-vs-drop for the additive progressive-disclosure block (currently emits empty snippets with `detailAvailable:false`): substitute the compact layer for full results, or drop the block entirely (B OPT)? Decided in T025 with the byte-cost evidence from T001; recorded in implementation-summary.md.
- Where does the parity check wire — `validate.sh` rule, standalone CI step, or both? Decided in T069 based on where the doctor/validate surfaces already run tree checks.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: 5-result default `memory_search` envelope < 6KB serialized (baseline 17.6KB); `meta.tokenCount` within ±10% of actual.
- **NFR-P02**: No added warm-search latency from this phase — presentation reordering and casing removal only; single-serialization perf work stays in phase 010.

### Security
- **NFR-S01**: Cursor tenant isolation — a resolve never returns rows outside the scope the cursor was issued for; scopeKey held server-side, never trusted from the client.
- **NFR-S02**: Hook shim output remains valid JSON under malformed input (no concat-corruption of the hook channel).

### Reliability
- **NFR-R01**: Over-budget compaction is deterministic and ordered — metadata compacts before result rows (snippet floor); no empty-snippet result rows in the default envelope.
- **NFR-R02**: Doc-drift battery is regression-guarded — parity script fails the build on any byte divergence between the two command trees.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty/no-input query: standard error envelope returned (REQ-006), never a bare string or partial payload.
- Oversized result content with `includeContent:true`: capped per-result with an explicit truncation marker (REQ-006).
- 0-result search: envelope still single-casing, budget-honest, and text-format renderable.

### Error Scenarios
- Forged or cross-scope cursor: denied with invalid-cursor error, distinguishable from exhausted (REQ-004).
- Cursor referencing pruned/dead results: treated as dead cursor — cached responses must not re-emit it (T023).
- UserPromptSubmit shim receives invalid JSON: output stays valid, no concatenation of error text into the payload (REQ-010).

### State Transitions
- Result truncated away by budget: session-dedup must NOT have marked it sent — re-eligible on the next call (REQ-006).
- Fallback chain second/third call: constitutional block suppressed via `includeConstitutional:false` (REQ-010).
- Startup context over limit: truncation lands on a section boundary, never mid-section (REQ-010).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | ~10 code files + 2 command trees + 3 reference docs + 1 new script; edits shallow (presentation lane, no schema/migrations) |
| Risk | 10/25 | One security fix (cursor scope); casing removal has consumer blast-radius but full inventory + revert path; docs are low-risk |
| Research | 8/20 | 🟡 verify-first battery + consumer/doc-claim inventories; findings already pinned to file:line by the deep dive |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
