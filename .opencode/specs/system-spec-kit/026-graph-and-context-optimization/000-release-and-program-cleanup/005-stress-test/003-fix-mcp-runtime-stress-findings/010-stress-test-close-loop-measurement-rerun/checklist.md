---
title: "Verification Checklist: Stress-Test Rerun v1.0.2"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
description: "P0/P1/P2 quality gates for the v1.0.2 stress-test re-run. P0 must pass before findings.md ships; P1 should pass; P2 are nice-to-haves."
trigger_phrases:
  - "010 checklist"
  - "v1.0.2 quality gates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-fix-mcp-runtime-stress-findings/010-stress-test-close-loop-measurement-rerun"
    last_updated_at: "2026-04-28T20:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Strict validator hygiene update"
    next_safe_action: "Run recursive strict validator"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Verification Checklist: Stress-Test Rerun v1.0.2

> Each item cites the spec REQ or success criterion that drives it. Mark complete only with verifiable evidence (file path, command output, or score row). Single scorer (this AI session); flag any cells that warrant a second-reviewer pass under P2.

---

<!-- ANCHOR:p0-gates -->
## P0 — Blockers (MUST pass before findings ship)

### Pre-flight
- [ ] **CHK-P0-001** [P0] **REQ-001 — daemon-version attestation**: `ccc --version` reports `0.2.3+spec-kit-fork.0.2.0` — captured to `./runs/preflight.log` line 1
- [ ] **CHK-P0-002** [P0] **REQ-001 — memory_context smoke probe**: `meta.tokenBudgetEnforcement.preEnforcementTokens` populated; `meta.intent.taskIntent.classificationKind:"task-intent"`; `data.queryIntentRouting.classificationKind:"backend-routing"` — captured verbatim to `./runs/preflight.log`
- [ ] **CHK-P0-003** [P0] **REQ-001 — code_graph_status**: `data.readiness.freshness:"fresh"`, `freshnessAuthority:"live"` — captured verbatim
- [ ] **CHK-P0-004** [P0] **REQ-001 — memory_causal_stats**: all 6 `by_relation` keys present; `data.health` agrees with `data.meetsTarget`; `data.deltaByRelation` populated; `data.balanceStatus` populated — captured verbatim

### Dispatch
- [ ] **CHK-P0-005** [P0] **REQ-002 — all 30 cells dispatched**: 27 base (cli-codex × 9 + cli-copilot × 9 + cli-opencode × 9) + 3 ablation (cli-opencode-pure on S1/S2/S3); each cell has all 4 artifacts (prompt.md, `output.txt`, `meta.json`, score.md)
- [ ] **CHK-P0-006** [P0] **REQ-002 — exit_code = 0 across 30 cells**: enumerate `./runs/{cell}/{cli-N}/meta.json` and confirm all 30 are clean; no failed dispatches
- [ ] **CHK-P0-007** [P0] **REQ-014 — I2 weak-quality preamble applied**: `./scripts/prompts/I2.md` opens with the deterministic preamble guaranteeing `memory_search` returns `quality:weak`

### Scoring
- [ ] **CHK-P0-008** [P0] **REQ-003 — v1.0.1 4-dim rubric scoring**: each score.md has the 4-dim table summing 0-8 (no missing dim)
- [ ] **CHK-P0-009** [P0] **REQ-008..013 — Fork-Telemetry Assertions per applicable cell**:
  - [ ] S1, S2, S3 cells (REQ-008): `dedupedAliases`, `uniqueResultCount`, `rankingSignals` checked
  - [ ] Q1 cells (REQ-009): `fallbackDecision` checked (presence on blocked path; absence on fresh path)
  - [ ] Q3 cells (REQ-010): `path_class` + `raw_score` preserved
  - [ ] I2 cells (REQ-011): `responsePolicy.noCanonicalPathClaims` + `safeResponse` checked **— gates SC-003**
  - [ ] All I-cells (REQ-012): `meta.intent.taskIntent.classificationKind` + `paraphraseGroup` checked
  - [ ] Token-budget envelope (REQ-013): `preEnforcementTokens` + `returnedTokens` + `actualTokens === returnedTokens` invariant verified
- [ ] **CHK-P0-010** [P0] **REQ-004 — Delta classification per cell**: each score.md cites v1.0.1 baseline + delta + classification (WIN / NEUTRAL / REGRESSION)
- [ ] **CHK-P0-011** [P0] **REQ-006 — Zero unresolved REGRESSION cells**: every REGRESSION explained as measurement artifact, mapped to known regression, or escalated as P0 follow-up

### Synthesis
- [ ] **CHK-P0-012** [P0] **REQ-005 — Per-packet verdict table populated**: 7 rows in findings.md (one per packet 003-009) with verdict per row
- [ ] **CHK-P0-013** [P0] **REQ-007 — Frozen baseline preserved**: `git diff ../001-…/findings.md` shows ONLY a single appended forward-pointer line; zero deletions or modifications above it

### Headline success criteria
- [ ] **CHK-P0-014** [P0] **SC-001**: at least one WIN per packet 003-009 in the per-packet verdict table
- [ ] **CHK-P0-015** [P0] **SC-003**: I2 cli-opencode v1.0.2 score ≥ 6/8 (recovers from v1.0.1 1/10 catastrophic hallucination)

---

<!-- /ANCHOR:p0-gates -->

<!-- ANCHOR:p1-gates -->
## P1 — Required (complete OR user-approved deferral)

- [ ] **CHK-P1-001** [P1] **REQ-015 — Per-CLI averages re-tabulated**: findings.md includes a v1.0.1-vs-v1.0.2 side-by-side averages table for all 4 CLI variants
- [ ] **CHK-P1-002** [P1] **REQ-016 — Memory DB re-indexed**: `memory_index_scan` ran on this packet's path post-synthesis; succeeded with indexed file count > 0
- [ ] **CHK-P1-003** [P1] **SC-002 — Zero unresolved REGRESSION cells**: same gate as REQ-006 (P0) — listed here as a stricter restate
- [ ] **CHK-P1-004** [P1] **SC-006 — `validate.sh --strict` passes**: zero blocking errors at packet root (same clean profile as other 011 leaf packets)
- [ ] **CHK-P1-005** [P1] **HANDOVER §2.1 status updated**: `Scaffolded` → `Closed` with closure evidence row in §1 Closed-Since-Original-Handover table

---

<!-- /ANCHOR:p1-gates -->

<!-- ANCHOR:p2-gates -->
## P2 — Refinements (nice-to-have)

- [ ] **CHK-P2-001** [P2] **REQ-017 — v1.0.3 rubric candidates documented**: if v1.0.2 surfaces saturation or collapsing dimensions, findings.md §Recommendations identifies candidate dim changes for a future v1.0.3 packet
- [ ] **CHK-P2-002** [P2] **REQ-018 — N=3 variance pass per cell**: optional second + third runs of each cell to assess single-scorer variance. Out of scope for the initial v1.0.2 sweep; tracked here as future work
- [ ] **CHK-P2-003** [P2] **Second-reviewer pass on the load-bearing cell (I2 cli-opencode)**: SC-003 is the headline criterion; a second-reviewer pass on the I2 cli-opencode score under both rubric and Fork-Telemetry Assertions would harden the closure evidence
- [ ] **CHK-P2-004** [P2] **Cell-to-prompt-version drift check**: confirm `./scripts/prompts/{S,Q,I}*.md` (other than the I2 preamble change) match `../001-…/scripts/prompts/{S,Q,I}*.md` byte-for-byte; document any drift
- [ ] **CHK-P2-005** [P2] **Cross-CLI version drift note**: capture `codex --version`, `copilot --version`, `opencode --version` to `./runs/preflight.log` for v1.0.2 reproducibility

---

<!-- /ANCHOR:p2-gates -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Sweep operator | | | Single scorer (this session) — flag P2 second-reviewer needs |
| Reviewer (P2) | | | Optional; recommended for I2 cli-opencode (SC-003 load-bearing) |
<!-- /ANCHOR:sign-off -->
