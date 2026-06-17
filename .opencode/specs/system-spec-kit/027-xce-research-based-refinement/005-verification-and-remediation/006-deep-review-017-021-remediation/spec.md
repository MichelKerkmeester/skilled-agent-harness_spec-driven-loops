---
title: "Feature Specification: Deep-Review 017-021 Remediation [027/002/005/006]"
description: "Close the confirmed, code-verified findings from the 50-pass multi-model deep review of 027/002 phases 017-021 (search/output intelligence, reindex cancellation, maintenance-grace re-election, background embedding, cooperative heavy phases). 1 confirmed P1, rest P2 / doc-drift / test-debt. Scope = remediation only; no fixes applied at scaffold time."
trigger_phrases:
  - "017-021 remediation"
  - "deep review 017 021 remediation"
  - "search output intelligence remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "deep-review-remediation-author"
    recent_action: "Authored remediation packet from 017-021 deep-review syntheses; all findings carried as tasks"
    next_safe_action: "verify c006 renderer then begin per-file remediation"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-deep-review-017-021-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the slash-command renderer substitute $ARGUMENTS raw or shell-quoted? (gates the c006 P1 severity)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Deep-Review 017-021 Remediation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

A 50-pass multi-model deep review (deepseek-v4-pro, mimo-v2.5-pro, kimi-k2.7, opus-4.8) of 027/002 phases **017-021** produced five verdicted syntheses: **four PASS (018, 019, 020, 021) + one CONDITIONAL (017)**, with **0 confirmed P0**, **1 confirmed P1**, and the remainder P2 (maintainability, test-debt, doc-drift). This packet captures every confirmed, code-verified finding as a remediation task so the work can be closed in a later, separate implementation step.

The single P1 is **c006 `commands/memory/search.md:17`** — an unquoted trailing `-- $ARGUMENTS` in the `/memory:search` §0 argument-resolution header, flagged independently by two models. Its severity is **lock-gated**: the FIRST task verifies whether the slash-command renderer substitutes `$ARGUMENTS` raw (shell-injection / glob-corruption sink) versus shell-quoted (downgrades to a P2 doc-note). The dominant P2 across phase 017 is **systemic scaffold-vs-shipped doc drift** in all 7 children (spec/plan/tasks/graph-metadata still read "planned/scaffold" while the code shipped at `completion_pct: 100`).

**Key Decisions**: severity-lock the P1 behind a renderer-behavior verification before quote-hardening (ADR-001); honor the syntheses' downgrade rulings rather than re-escalating (ADR-002); split the P2 backlog into per-phase + cross-cutting workstreams traceable to each synthesis finding (ADR-003).

**Critical Dependencies**: the five synthesis docs under `027/002/review/synthesis/` are the source of truth; no re-review is performed here.
<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 (one confirmed P1; rest P2) |
| **Status** | not-started — findings carried as tasks; no fixes applied |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Source reviews** | 017 (CONDITIONAL) · 018 (PASS) · 019 (PASS) · 020 (PASS) · 021 (PASS) |
| **Findings carried** | 0 P0 · 1 P1 · ~20 P2 (code + doc + test) |
| **Handoff Criteria** | Each task fixed-or-downgraded-with-evidence; the P1 verified-then-resolved; code fixes test-gated (baseline→delta); doc/metadata reconciliations validate.sh --strict clean. |
<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 027/002 phases 017-021 shipped working, tested code, but the 50-pass review surfaced a set of confirmed residual issues: one bounded shell-exposure P1 in the `/memory:search` command contract, several maintainability/observability/test-debt P2s in the search and reindex/maintenance code, and pervasive spec-folder doc drift where canonical docs still describe scaffold/planned state while the implementation-summaries record completed work. Left unaddressed, the P1 corrupts queries containing shell metacharacters, and the doc drift makes the phases un-auditable from their own spec docs.

### Purpose
Carry every confirmed finding from the five syntheses into a single, traceable remediation packet — severity-tagged, target-file-named, and marked confirmed-by-code vs needs-in-task-verification — so a later implementation step can close them with no re-discovery. This packet authors documentation only; it applies no fixes and edits no reviewed code or 017-021 phase docs.
<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 1 confirmed P1 (c006 `search.md:17` unquoted `$ARGUMENTS`) including the renderer-behavior verification that gates its severity.
- The 017 c004 confidence-calibration maintainability P2 cluster (isotonic equal-mean merge, PAV duplication, calibration-cache content-invalidation, weight-sum invariant assertion).
- The 017 systemic scaffold-vs-shipped doc drift across all 7 children (spec/plan/tasks/graph-metadata).
- The 017 c002/c003/c001/c005 minor code + doc P2 nits.
- The 018 `cancelledJobIds` Set leak + `'cancelled'`-missing-from-`isSuccessfulStatus` count bug + the two missing-unit-coverage gaps + two cosmetic code nits.
- The 019 doc-drift cluster (non-existent `mcp_server/bin/...` paths, `jobId` vs `labels[]` marker schema, 60s vs 180s TTL, "unprotected" embedding-queue claim, untracked extracted module, stale test fixtures) + three optional code-hardening nits.
- The 020 test-hygiene fix (`__resetMaintenanceMarkerForTest` on-disk marker), the inherited "schema unchanged" wording, and residual cosmetic items.
- The 021 flagship empty-files-branch `timedPhase` symmetry fix, the near-dup-repair discarded count, the cancelled-run pending under-report, and the doc reconciliation that follows fix #1.

### Out of Scope
- Applying any code or doc fix during this scaffold step (a later implementation step does that).
- Editing any reviewed code file or any 017-021 phase spec doc (this packet authors only its own docs).
- Re-running or re-litigating the deep review; the syntheses' verdicts and downgrades are accepted as-is.
- Findings the syntheses **rejected / refuted / already-resolved** (e.g. 018 mimo-1 post-restart fast-cancel; 020 D6/D7/D8 atomic-write-throw family; 021 B8 deploy-lag) — explicitly NOT carried.
- The launcher lease-heartbeat mid-scan re-election and synchronous-path cancellability (the phases' own documented follow-ons).

### Files to Change

This packet writes ONLY its own docs. The table below records the remediation TARGET files that a later step will touch (paths absolute under repo root). It is the authoritative target manifest — no file is touched by this packet.

| File Path | Change Type (later step) | Description |
|-----------|--------------------------|-------------|
| `.opencode/commands/memory/search.md` | Verify-then-Modify | [P1] verify renderer `$ARGUMENTS` handling; quote-harden §0 if raw |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modify | weight-sum assertion; cache content-invalidation; quality-array guard (017 c004/c002) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts` | Modify | isotonic equal-mean merge; PAV drift-guard (017 c004) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts` | Modify | SQL param-array programmatic build; classifyStatus fallback (017 c003) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify (optional) | adjustedBudget placeholder-then-patch; cosine reorder-depth flag (017 c001/c005) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts` | Modify | clear `cancelledJobIds` on terminal `setJobState` (018) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | `'cancelled'` in `isSuccessfulStatus`; empty-files `timedPhase`; near-dup count; near-dup cancel hook; de-dup causal import (018/021) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts` | Modify | recompute pending counts before cancel returns, or document asymmetry (021) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Modify (optional) | `__resetMaintenanceMarkerForTest` on-disk rm; dedup/log hardening (019/020) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/batch-processor.vitest.ts` | Create/Modify | `processBatches` `shouldAbort` coverage (018) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/job-store.vitest.ts` | Create/Modify | `isCancelRequestedFast` Set lifecycle coverage (018) |
| `027/002/017-…/<c001-c007>/{spec.md,plan.md,tasks.md,graph-metadata.json}` | Modify | reconcile scaffold→shipped (017 systemic) |
| `027/002/019-…/{spec.md,plan.md,tasks.md,implementation-summary.md}` + 019/020 test fixtures | Modify | path/schema/TTL/limitation doc reconciliation (019/020) |
| `027/002/021-…/{implementation-summary.md,spec.md,plan.md}` | Modify | qualify `timedPhase` claim (021 A2) |
<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

_None. The review found 0 confirmed P0 across all five phases._

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resolve the c006 `$ARGUMENTS` exposure at its verified severity | The renderer's `$ARGUMENTS` substitution behavior is confirmed by evidence; if raw, `/memory:search` queries containing `*`, `?`, `$(…)`, backticks, `;`, `\|`, `&`, `>` resolve to the verbatim typed string and the arg-echo still matches; if shell-quoted, the finding is recorded as a downgraded P2 doc-note with the evidence. |

### P1 - Required (doc reconciliation, gates clean PASS of the reviewed phases)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Reconcile the 017 systemic scaffold-vs-shipped doc drift | All 7 children's `spec.md`/`plan.md`/`tasks.md` reflect real shipped scope (or are explicitly marked superseded by `implementation-summary.md`), and `graph-metadata.json` Status/Key Files match reality. |
| REQ-003 | Reconcile the 019 doc cluster | Non-existent `mcp_server/bin/...` paths corrected to `.opencode/bin/...`; marker schema documented as `labels[]`; TTL documented as 180s; embedding-queue limitation reworded to per-tick protection; extracted module + retry-manager tracked in Files-to-Change; test fixtures use the real `labels` shape. |

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Close the 018 cancellation-accuracy P2s | `cancelledJobIds` cleared on every terminal `setJobState` (incl. `'failed'`); `'cancelled'` counted distinctly (not as `failed`); direct unit coverage for `shouldAbort` + the Set lifecycle. |
| REQ-005 | Close the 021 instrumentation P2s | Empty-files branch wrapped in `timedPhase` (timing + marker refresh symmetry); near-dup-repair count captured; cancelled-run `pendingRemaining`/`pendingRows` recomputed-or-documented. |
| REQ-006 | Close the 017 c004 maintainability cluster + minor 017/019/020 nits | Each item fixed or accepted-with-documented-reason against its synthesis evidence. |
<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The c006 P1 is closed at its verified severity — either quote-hardened (raw renderer) or recorded as a downgraded P2 doc-note (quoting renderer) — with the verification evidence cited.
- **SC-002**: Every confirmed finding from the five syntheses maps to exactly one task in `tasks.md` (no orphan finding, no fabricated finding).
- **SC-003**: Each carried task is tagged confirmed-by-code or needs-in-task-verification, severity-tagged, and traceable to its synthesis line.
- **SC-004**: No rejected/refuted/already-resolved finding is carried as an actionable fix.
- **SC-005**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The five synthesis docs (`017-…` through `021-…-synthesis.md`) | Source of truth for every task | Cited per task; no re-review performed |
| Risk | c006 severity is renderer-dependent | Quote-hardening a renderer that already quotes is dead work; skipping when it is raw leaves a live sink | Severity-lock: REQ-001 verifies renderer behavior BEFORE any edit |
| Risk | 017 doc drift is high-volume (7 children) | A bulk regen could clobber a child's real `implementation-summary.md` | Reconcile spec/plan/tasks/graph-metadata only; prefer per-child `generate-context.js`; never overwrite impl-summary content |
| Risk | Re-escalating downgraded findings | Re-litigating the review wastes effort and contradicts verified evidence | Honor synthesis verdicts; refuted items are out of scope, not re-opened |
| Risk | Line numbers drift before the later step runs | A cited `file:line` no longer matches | Each code task re-confirms the cite against the live file before editing (finding-is-a-hypothesis discipline) |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: No carried task may introduce a behavior change beyond the synthesis-described fix; the reviewed deliverables stay behaviorally intact.
- **NFR-C02**: Code fixes are test-gated — baseline captured, whole gate re-run, delta reported (per `regression-baseline-and-delta`).

### Traceability
- **NFR-T01**: Every task names its exact target file and a concrete change, and cites its synthesis finding id / line.
- **NFR-T02**: Confidence is explicit per task (confirmed-by-code vs needs-in-task-verification).

### Safety
- **NFR-S01**: This packet performs no writes outside its own folder; no reviewed code or 017-021 phase doc is touched.
<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### The c006 severity fork
- **Renderer substitutes raw** (impl-summary's "one word per argument" implies this): the sink is live → quote-harden (`set -f` / restructure) and add metacharacter verification cases → finding stays P1 until closed.
- **Renderer shell-quotes `$ARGUMENTS` into one token**: the outer-shell expansion never reaches user text → downgrade to a P2 header doc-note; no code change.

### Doc-reconciliation boundaries
- **A child's `implementation-summary.md` is the truth source**: reconcile the scaffold docs TO it; never the reverse, and never regenerate over real impl-summary content.
- **020 inherits 019's `jobId`→`labels[]` wording**: reconcile both phases' "schema unchanged" claims together, not in isolation.

### Refuted-but-real items
- **019/020 atomic-write-throw family (D6/D7/D8)**: `atomicWriteFile` never throws — do NOT add try/catch rollback, an uncaught-exception handler, or wrap the synchronous foreground scan. These are explicitly out of scope.
<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Rating | Note |
|-----------|--------|------|
| **Blast radius** | Medium | ~6 code files + a command template + tests + multiple doc folders across 5 phases; each fix is small and localized |
| **Reversibility** | High | Every code fix is an independent test-gated commit; every doc reconciliation is git-reversible; the on-disk marker is TTL-ephemeral |
| **Coupling** | Low-Medium | `handlers/memory-index.ts` spans 018 + 021 findings (distinct line ranges); the rest are file-isolated |
| **Verification cost** | Medium | Per-suite baseline→delta for code; validate.sh --strict for docs; one live renderer probe for the P1 |
| **Net complexity** | Medium | Justifies Level 3 (decision-record for the severity-lock + reconcile-direction decisions); not 3+ (no enterprise governance, multi-agent sign-off) |
<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | c006 sink left live (renderer is raw, fix skipped) | H | L | REQ-001 verify-first lock; metacharacter test cases |
| R-002 | Bulk doc regen clobbers a real impl-summary | M | M | Per-child reconcile of scaffold docs only; no impl-summary overwrite |
| R-003 | A carried code fix regresses cancellation/instrumentation | M | L | Test-gated, baseline→delta; synthesis-scoped change only |
| R-004 | Cited line numbers stale by implementation time | L | M | Re-confirm cite against live file before edit |
| R-005 | Refuted finding mistakenly fixed | L | L | Rejected items enumerated as out-of-scope in §3 and tasks.md |
<!-- /ANCHOR:risk-matrix -->
---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Close the verified P1 safely (Priority: P1)

**As a** maintainer of the `/memory:search` command, **I want** the `$ARGUMENTS` exposure resolved at its true severity, **so that** queries with shell metacharacters resolve verbatim without me doing dead work on a renderer that already quotes.

**Acceptance Criteria**:
1. Given the renderer substitutes `$ARGUMENTS` raw, When a query contains `*`/`$(…)`/`;`/`\|`, Then after the fix it resolves to the verbatim typed string and the arg-echo matches.
2. Given the renderer shell-quotes `$ARGUMENTS`, When the verification runs, Then the finding is recorded as a downgraded P2 doc-note with evidence and no code edit is made.

### US-002: Audit a reviewed phase from its own docs (Priority: P1)

**As an** auditor, **I want** each 017-021 phase's spec/plan/tasks/graph-metadata to match what shipped, **so that** I can trace the implementation without reading the review.

**Acceptance Criteria**:
1. Given a reconciled child, When I read its `graph-metadata.json`, Then Status and Key Files match the shipped `implementation-summary.md`.
2. Given 019's docs, When I follow a Files-to-Change path, Then it resolves to a real file (`.opencode/bin/...`, not `mcp_server/bin/...`).

### US-003: Trust the cancellation counts (Priority: P2)

**As an** operator cancelling a reindex, **I want** cancelled files and the pending backlog reported accurately, **so that** a cancel does not inflate the failure count or hide committed-but-pending work.

**Acceptance Criteria**:
1. Given a cancelled file, When the scan result is tallied, Then it is not counted as `failed`.
2. Given a cancelled trigger-embedding run, When the envelope is read, Then `pendingRemaining`/`pendingRows` reflect committed work (or the asymmetry is documented).
<!-- /ANCHOR:user-stories -->
---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does the OpenCode/Claude slash-command renderer substitute `$ARGUMENTS` **raw** into the outer shell, or **shell-quoted** as a single token? **OPEN — gates the c006 P1 severity (REQ-001 first task).** The impl-summary's "expands one word per argument" wording suggests raw, but this must be confirmed against the renderer before any edit.
- For the 017 doc-drift sweep: populate the scaffold docs with real content, or mark them explicitly superseded by `implementation-summary.md`? **DEFERRED to the implementation step** — both satisfy REQ-002; pick per-child based on whether the impl-summary is self-sufficient.
- Should the optional cosmetic nits (017 c001/c005, 019/020 marker dedup/log) be done now or deferred? **DEFERRED** — non-blocking; bundle only if a packet is open.
<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **017 synthesis**: `../../review/synthesis/017-search-and-output-intelligence-implementation-synthesis.md`
- **018 synthesis**: `../../review/synthesis/018-reindex-scan-responsiveness-and-cancellation-synthesis.md`
- **019 synthesis**: `../../review/synthesis/019-maintenance-grace-daemon-survives-reelection-synthesis.md`
- **020 synthesis**: `../../review/synthesis/020-maintenance-grace-background-embedding-synthesis.md`
- **021 synthesis**: `../../review/synthesis/021-cooperative-heavy-phases-synthesis.md`
<!-- /ANCHOR:related-docs -->
