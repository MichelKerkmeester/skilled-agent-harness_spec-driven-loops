---
title: "Tasks: Phase 12: Envelope Presentation & Command-Doc Alignment"
description: "Task breakdown for envelope single-casing + budget-after-attach, progressive-disclosure cursor hardening, rendering truth, CLI text renderer, the command-doc drift battery (one task per drifted claim), dual-tree parity, and hook-lane hygiene. Finding refs cite deep-dive report §3/§5 (#N), ledger tags (L#, agent letters)."
trigger_phrases:
  - "envelope double emission"
  - "command doc drift battery"
  - "progressive disclosure cursor"
  - "format text renderer"
  - "token budget breach"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/012-envelope-presentation-and-command-doc-alignment"
    last_updated_at: "2026-07-04T17:51:09.855Z"
    last_updated_by: "planning-author"
    recent_action: "All tasks complete; 12 REQs; single-casing + cursor-leak fix + doc-drift battery; 563 tests"
    next_safe_action: "Phase 013 absorb-028-006-review-remediation-closeout"
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
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: envelope-presentation-and-command-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->

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

Finding references cite the deep-dive report (§3 `#N`, §5) and findings ledger (L#, Agent letters). Per the program comment-hygiene rule, these IDs live HERE — never in code comments.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Baseline capture and 🟡 verify-first battery — no behavior changes in this phase.

- [x] T001 Capture live envelope baseline BEFORE any change: one `memory_search` (5 results, default flags) — total bytes, per-block byte/token breakdown including each duplicated-casing block, `meta.tokenCount` vs actual serialized tokens; record in implementation-summary.md evidence (L7 🟢: 17.6KB / tokenCount 6,455 vs budget 3,500) (scratch/ capture, evidence in implementation-summary.md)
- [x] T002 Capture vitest baseline for touched suites (search/context/disclosure/formatters) — baseline-before-no-regressions (mcp_server tests)
- [x] T003 🟡-verify budget-before-attach + unreachable sanity guard at cited lines before fixing (E P2) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:608-625, ~1886-1969)
- [x] T004 🟡-verify cursor scopeKey loss after page 1 + client forgeability (#18, E P1) (.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:402)
- [x] T005 🟡-verify formatter drops `canonicalSource`/`documentType`/`_communityFallback` — reproduce WITHOUT the formatter mock (E P1) (.opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts)
- [x] T006 🟡-verify rendering-lane batch: session-dedup marks pre-truncation (E P2, memory-search.ts:1652); world-summary bare LIMIT no ORDER BY (E P2, memory-summaries.ts); blanket `semantic_match` label (E P2, result-explainability.ts); `includeContent` unbounded (E P2); no-input error shape (E P2) (mcp_server handlers + lib/search)
- [x] T007 [P] Consumer inventory: rg both casings of `artifactRouting`/`searchDecisionEnvelope`/`graphContribution`/`appliedBoosts` + formatter fields across `*.ts/*.js/*.cjs/*.md`; enumerate every double-emission site and every consumer; choose surviving casing (repo-wide rg, commands in plan.md FIX ADDENDUM)
- [x] T008 [P] **HARD PREREQUISITE for every doc-drift fix (T050-T067): each battery claim's exact file:line MUST be pinned and re-verified against the live file HERE before its fix edits — anchor drift is confirmed in this battery (T053's claim cited `manage.md` but the real drift lives in `assets/manage_presentation.txt:68`), per finding-is-a-hypothesis.** Doc-claim inventory: pin exact file:line in BOTH trees for every battery claim; record extra `/spec_kit:resume` slug hits outside the battery (lib/session, lib/errors READMEs, recovery-hints.ts) for 013-sweep disposition (.opencode/commands/, .claude/commands/, references/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Workstream A — Envelope

- [x] T010 Emit exactly one casing per telemetry block — kill the camelCase+snake_case double emission for `artifactRouting`/`graphContribution`/`searchDecisionEnvelope`/`appliedBoosts` + every other site from T007; update consumers of the removed casing in the same change (L7 🟢, §5) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [x] T011 Move token-budget enforcement AFTER graphContext/routing/envelope attach (E P2) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:~1886-1969)
- [x] T012 Delete the unreachable sanity guard (E P2) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:608-625)
- [x] T013 `meta.tokenCount` honesty: report the final serialized payload count, within ±10% of actual (L7 🟢) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts, memory-search.ts)
- [x] T014 Compact-row snippet floor: over-budget compaction hits metadata before result rows; no empty-snippet result rows in the default envelope (L7 🟢 compact:true empty snippets) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [x] T015 De-nest the delegated `memory_search` envelope in `memory_context`: it is wrapped as JSON-in-string (`content[0].text = JSON.stringify(innerEnvelope)` at ~:757/:761/:827/:925, re-parsed at ~:287/:305/:328), double-encoding results and burying `requestQuality`/`citationPolicy`/`envelopeRender` — the exact fidelity slots the search presentation contract renders (search.md:78-80) — below the top-level `data`. Surface those verdict fields at top-level `data` (verified absent: zero hits in memory-context.ts) (Agent I JSON-in-string, routed in from 013) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:~1088-1116, ~1900)

### Workstream B — Progressive Disclosure

- [x] T020 Store cursor `scopeKey` server-side and compare on EVERY resolve; deny forged/cross-scope cursors (P1 tenant leak, #18) (.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:402)
- [x] T021 Page-2+ resolves carry title/path/score/tier alongside snippet (§5 missing affordances) (.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts)
- [x] T022 Make exhausted vs invalid cursor responses distinguishable (§5) (.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts)
- [x] T023 Cached responses must not embed dead cursors — strip or refresh cursors on cache write/read (E) (.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts, memory-search.ts cache path)
- [x] T024 cursorStore holds ids+snippets only, not full result objects (E) (.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts)
- [x] T025 Decide substitute-vs-drop for the additive progressive-disclosure block (currently empty snippets + `detailAvailable:false`); implement the decision and record rationale + T001 byte evidence in implementation-summary.md (B OPT, L7 🟢) (.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts)

### Workstream C — Result Rendering

- [x] T030 Render `why` as a one-token suffix on result rows OR trace-gate its computation/emission; no more computed-but-never-rendered spend (I gap, §5) (.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts + render surfaces)
- [x] T031 Gate the `semantic_match` label on real vector attribution; non-vector lanes get truthful labels (E P2) (.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts)
- [x] T032 Formatter passes `canonicalSource`/`documentType`/`_communityFallback` through; fix the test that passed via formatter mock (E P1) (.opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts + tests/response-profile-formatters.vitest.ts)
- [x] T033 `includeContent` per-result cap + explicit truncation marker (E P2 multi-MB envelopes) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [x] T034 Session-dedup marks results "sent" AFTER budget truncation — truncated-away memories stay eligible (E P2) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1652)
- [x] T035 World-summary prelude: deterministic ORDER BY replacing the bare LIMIT (E P2, oldest-~75-only) (.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts)
- [x] T036 No-input/empty-query errors return the standard error envelope (E P2) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [x] T037 Resume-ladder `fingerprintStatus` honesty: the resume path hardcodes `fingerprintStatus:'verified'` (:484; type pinned to the lone literal at :267) while `fingerprintExpected` is `null` (:483) — a read-stability read with no expected-value comparison, so 'verified' overclaims. Report a truthful status (unverified/read-only, or compare an actual expected fingerprint) (Agent E, silent-drop #10 routed to 012) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:267,484)

### Workstream D — CLI

- [x] T040 `--format text`: minimal row renderer (title/path/score per result) + explicit omission notice for suppressed blocks; no silent row drops (I gap) (.opencode/skills/system-spec-kit/mcp_server/cli.ts + formatters/search-results.ts)

### Workstream E — Command-Doc Drift Battery (one task per drifted claim; fix BOTH trees)

**Gate:** T008 (doc-claim inventory) is a HARD prerequisite — no T050-T067 fix may edit until its claim's exact file:line is pinned and re-verified against the live file (anchor drift confirmed in this battery: T053).

- [x] T050 Envelope-fidelity flag documented default-OFF but code default-ON — align doc to code (#28, I P1) (.opencode/commands/memory/search.md:78 vs mcp_server/lib/search/search-flags.ts:702)
- [x] T051 `--intent:type` colon form documented but never parsed — document the real form (I) (.opencode/commands/memory/README.txt + search.md)
- [x] T052 `validate <useful|not>` documented vs actual `<true|false>` — align (I) (.opencode/commands/memory/README.txt)
- [x] T053 Stats presentation names a field the tool never returns: `assets/manage_presentation.txt:68` maps `memory_stats.totalRecords`, but the handler returns `totalMemories` (verified `handlers/memory-crud-stats.ts:307`) — align the presentation contract to the handler field. Anchor RE-PINNED from `manage.md` (zero hits, plan-review-confirmed) to the assets presentation file per finding-is-a-hypothesis (I) (.opencode/commands/memory/assets/manage_presentation.txt:68)
- [x] T054 Tool-coverage matrix cites tools not in allowed-tools — reconcile matrix rows (I) (.opencode/commands/memory/README.txt)
- [x] T055 README section order does not match the actual document — fix ordering claim (I) (.opencode/commands/memory/README.txt)
- [x] T056 README missing/wrong retention-sweep row — align to shipped behavior (I) (.opencode/commands/memory/README.txt + manage.md)
- [x] T057 README claims assets/ folder absent but it exists and is required — fix claim (I) (.opencode/commands/memory/README.txt)
- [x] T058 Hooks README documents a nonexistent `opencode/` folder — fix path (I) (.opencode/skills/system-spec-kit/mcp_server/hooks/README.md)
- [x] T059 Hooks README settings file name wrong — align to the actual settings file (I) (.opencode/skills/system-spec-kit/mcp_server/hooks/README.md)
- [x] T060 Stale `/spec_kit:resume` slug → `/speckit:resume` in hooks README; log extra occurrences from T008 for 013 disposition (I) (.opencode/skills/system-spec-kit/mcp_server/hooks/README.md)
- [x] T061 save_workflow schema "v37" → actual v41 (I) (.opencode/skills/system-spec-kit/references/memory/save_workflow.md)
- [x] T062 save_workflow retired-filename checklist removal (I) (.opencode/skills/system-spec-kit/references/memory/save_workflow.md)
- [x] T063 memory_system mangled DB_UPDATED_FILE path — fix (I) (.opencode/skills/system-spec-kit/references/memory/memory_system.md)
- [x] T064 memory_system 4-state vs actual 5-state model — align (I) (.opencode/skills/system-spec-kit/references/memory/memory_system.md)
- [x] T065 Resume presentation "history" hint drift — align hint to shipped behavior (I) (.opencode/commands/speckit/resume.md + memory resume presentation surface)
- [x] T066 search.md argument-resolution quoting drift — align documented quoting to parser behavior (I) (.opencode/commands/memory/search.md)
- [x] T067 manage health status enum drift — align documented enum to handler values (I) (.opencode/commands/memory/manage.md)
- [x] T068 Mirror every T050-T067 fix byte-identically into the second tree in the same commit (.claude/commands/memory/, .claude/commands/speckit/)
- [x] T069 Create the dual command-tree byte-parity check script (.opencode/commands ↔ .claude/commands) with a negative test, and wire it into validate.sh or CI (I contract) (system-spec-kit scripts, new file)

### Workstream F — Hook-Lane Hygiene

- [x] T070 Suppress the constitutional block (~2k tokens) after the first call in a fallback chain via `includeConstitutional:false` (I gap, §5) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts + memory-search.ts fallback callers, .opencode/commands/memory/search.md chain docs)
- [x] T071 Startup context truncation cuts at section boundaries, never mid-section (I gap) (.opencode/skills/system-spec-kit/mcp_server/hooks/claude/ startup builder)
- [x] T072 UserPromptSubmit shim invalid-JSON concat fix — malformed hook input must not concatenate into invalid output (I P2) (.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T080 Re-run the T001 baseline query: envelope < 6KB, single casing (no twin keys in payload), `meta.tokenCount` within ±10% of actual; record before/after delta in implementation-summary.md (SC-001, SC-004)
- [x] T081 Zero-drift re-audit: grep battery per T050-T067 claim across BOTH trees returns no drifted claims (SC-002)
- [x] T082 Parity script: negative test (injected byte diff detected) + green run on aligned trees (REQ-009)
- [x] T083 Vitest suites green; report delta vs T002 baseline — whole gate, not cherry-picked files (SC-005)
- [x] T084 Adversarial cursor suite green: cross-scope, forged, expired-vs-malformed, dead-cursor, no-op resolve (REQ-004)
- [x] T085 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exit 0
- [x] T086 Synchronize spec/plan/tasks/checklist statuses; complete implementation-summary.md with baseline, decisions (casing choice, substitute-vs-drop), and evidence pinned to fix SHA; refresh ../changelog/ entry per phase-context note
- [x] T087 Verify the two routed-in findings: `memory_context` top-level `data` surfaces `requestQuality`/`citationPolicy`/`envelopeRender` as structured fields (no JSON-in-string double-encode), and resume-ladder rows report a truthful `fingerprintStatus` (not 'verified' when `fingerprintExpected` is null) (T015, T037, REQ-011, REQ-012)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T080-T082 live capture + re-audit + parity)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..REQ-010, scenarios 1-6)
- **Plan**: See `plan.md` (FIX ADDENDUM: AFFECTED SURFACES, inventories, invariant)
- **Checklist**: See `checklist.md` (verification evidence gates)
- **Sources**: `../research/phase-decomposition.md` §012, `../research/deep-dive-report.md` §3 (#18, #28) + §5, `../research/findings-ledger.md` (Agent I + Agent E)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
