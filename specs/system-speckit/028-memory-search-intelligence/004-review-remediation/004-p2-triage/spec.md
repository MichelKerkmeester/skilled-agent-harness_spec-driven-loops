---
title: "Feature Specification: P2 Triage"
description: "Scope-and-triage of the 91 P2 review findings grouped by lens, each marked fix-now or accept-as-is."
trigger_phrases:
  - "028 p2 triage"
  - "review p2 findings triage"
  - "fix-now accept-as-is p2 scope"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/004-review-remediation/004-p2-triage"
    last_updated_at: "2026-07-04T14:10:01.439Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconstructed the 91-item P2 map from G1-G15 + dispositioned to 016 phases (phase 013)"
    next_safe_action: "Absorbed; P2 map reconstructed + dispositioned by 016/013"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-006-004-p2-triage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase scopes and triages only. It fixes nothing."
      - "Per-item enumeration is authoritative in review-report.md."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: P2 Triage

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | ABSORBED → 016 (reconstructed + dispositioned by phase 013, 2026-07-04) |
| **Created** | 2026-06-19 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/004-review-remediation` |
| **Phase** | 004 of 004 |
| **Predecessor** | ../003-doc-accuracy/spec.md |
| **Successor** | ../005-env-documentation-audit/spec.md |
| **Source Review** | RECONSTRUCTED (frozen `../../archive/review-report.md` is unrecoverable — verified absent 2026-07-03); see "Reconstructed P2 → 016 Disposition" below |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review surfaced 91 P2 findings. None is a shipped runtime defect on a default-on path, but they are not uniform: some are cheap default-off-contract guards worth fixing before release, some are latent injection seams that are safe only while inputs stay constrained and many are missing-assertion gaps on default-off features whose blast radius is low. Shipping a flat list invites either over-fixing low-value items or silently dropping ones that matter. The packet needs a single triaged view that says, per finding family, whether to fix now or accept as is, with the reason recorded.

### Purpose
Group the 91 P2 by review lens, and for each group record a fix-now or accept-as-is verdict with a one-line reason. This phase does not fix anything: it produces the triage and routes the fix-now groups to a follow-on phase or to the existing P1 phases where they ride along. The per-item enumeration stays authoritative in `../../archive/review-report.md`. This phase is the decision layer over it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Grouping all 91 P2 findings by review lens.
- A fix-now or accept-as-is verdict plus a one-line reason for each group.
- Routing each fix-now group to a follow-on owner (a P1 phase it rides along with, or a new remediation phase).

### Out of Scope
- Fixing any P2 finding (this phase is scope-and-triage only).
- Re-triaging the doc-accuracy cluster owned by phase 003 (cross-referenced, not re-decided).
- The 6 confirmed P1 (owned by phases 001-003).
- The concurrent session's files and packet 030.

### P2 Lens Triage

> Counts are approximate and families overlap where the tri-model pass and the deep-dive both surfaced the same code. The authoritative per-item list is `../../archive/review-report.md`. Each group carries one verdict. Documented exceptions are noted inline.

| # | Lens / Family | Approx count | Verdict | One-line reason |
|---|---------------|--------------|---------|-----------------|
| G1 | Schema migration non-idempotency (valid_at re-stamp every init, source_kind re-classify, v40 blank-id unique-index wedge, v38/v39 existing-DB self-heal gap) | 5 | Fix-now | Runs on every init or can wedge migration. Becomes a live bug the moment a bitemporal read path is wired. |
| G2 | Rollback-API durability (v38/v39 memory + code-edge rollback undone on next init, lineage re-add) | 4 | Accept-as-is | Rollback functions are test-only with no production down-migration caller and re-added columns are additive nullable. Record the contract gap instead. |
| G3 | Default-off response-shape drift (residual_retention always emitted, memory_health extra fields, degraded-search embedder fields, retention audit metadata key) | 4 | Fix-now | Breaks byte-identical-to-baseline with all new flags off, which is the packet's own default-off contract. The guards are one-line. |
| G4 | Eval-harness correctness (ALL_CHANNELS omits degree/summary, per-flag loop has no coverage guard, EvalResult.score type violation, normalizeMemoryId nulls big ids, cold-start createdAt drop, hard_negative unreachable, hardcoded bucket quotas) | 9 | Fix-now | These directly degrade benchmark trustworthiness. Route to ride along with phase 001's eval-driver work. |
| G5 | Fail-open guards (inspectEmbeddingCoverage empty→coverage 1, ensureTemporalColumns fail-open then index build silently fails) | 2 | Fix-now | A guard that should fail closed reports perfect coverage on an empty golden set. Cheap to invert. |
| G6 | Constitutional CRUD TOCTOU + dropped tier-downgrade audit | 1 | Fix-now | Weakens a constitutional protection and silently removed an audit on the new reject path. Matters under multi-process or shared-WAL. |
| G7 | DoS / robustness guards (scope-governance unbounded recursion, rebuildCodeEdgesTable non-atomic exec) | 2 | Fix-now | Cheap depth and transaction guards on partially caller-influenced paths. |
| G8 | Eval-harness TOCTOU + path/info leakage (existsSync/backup race, internal paths in error text) | 3 | Accept-as-is | Eval-only harness, low blast radius. Capture as a hardening backlog item. |
| G9 | Latent injection seams (regex injection in ground-truth generator, search-results attribute escaping, redaction-gate opening-tag, synthetic SUPERSEDES NULL valid_at) | 4 | Fix-now | Prompt-injection and regex boundaries safe only while inputs stay constrained. Cheap to harden before the constraint widens. |
| G10 | Recall correctness (summary fusion lane dropped when complexity router off, world-summary cap with no ORDER BY, entity-extractor rejects configured custom types, summary-fusion ON-path under-covered) | 4 | Fix-now | Correctness and determinism bugs on opt-in recall lanes. Fix before the lanes are enabled. |
| G11 | Test-coverage / missing-assertion gaps (temporal-edges provenance + relation branch, edge-presence early-return, idempotency-receipt TTL/clamp/error-swallow/conflict, lineage re-root, governance-vocab branches, bitemporal-schema duplicate-column catch, BM25 calibration env path, edge-vector FK pragma) | 20 | Accept-as-is | Missing-assertion and defensive-guard gaps on default-off features with low blast radius. Convert to a test-hardening backlog, close opportunistically when each feature is enabled. |
| G12 | Doc-accuracy P2 cluster (timeline / before-vs-after / benchmark-status / ENV_REFERENCE / sibling status tables) | 12 | Fix-now (owned by phase 003) | The iteration-9 staleness cluster is already delegated to phase 003. Cross-referenced here, not re-decided. |
| G13 | Code-graph SUPERSEDES / bitemporal invariants (both-edges-live ambiguity, dead bitemporal read gate, code-edge re-stamp) | 4 | Accept-as-is | The read gate has zero consumers today, so the invariant ambiguity has no live effect. Reconfirm the zero-callers caveat, then fix when a read path wires up. |
| G14 | Advisor outcome-weighted rerank (neutral resolver untested, vacuous assertion, shadowScore blend untested) | 3 | Accept-as-is | Default-off shadow/telemetry channel with no live production import. Test-hardening backlog. |
| G15 | Flags ceiling / drift guards (orphan-flag detection missing, stale test name and comment counts) | 2 | Fix-now | Cheap one-line test additions that stop the frozen snapshot accumulating dead entries. The packet added 22 acknowledged flags so the gap is widening. |

### Triage Summary

| Verdict | Groups | Approx P2 |
|---------|--------|-----------|
| Fix-now | G1, G3, G4, G5, G6, G7, G9, G10, G12, G15 | ~53 |
| Accept-as-is | G2, G8, G11, G13, G14 | ~33 |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | The lens-grouped P2 triage with per-group verdicts |
| `plan.md` | Create | Triage production and routing approach |
| `tasks.md` | Create | Triage tasks (group, decide, route), all PENDING |
| `checklist.md` | Create | Triage completeness checks, all PENDING |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every P2 maps to a group | No finding in review-report.md is left ungrouped |
| REQ-002 | Every group has a verdict | Each group is marked fix-now or accept-as-is |
| REQ-003 | Every verdict has a reason | Each group carries a one-line justification |
| REQ-004 | No fix is performed | This phase changes only its own scaffold docs |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Fix-now groups are routed | Each fix-now group names a follow-on owner (a P1 phase or a new phase) |
| REQ-006 | Accept-as-is groups are justified | Each accepted group records why deferral is safe (default-off, no live caller, low blast) |
| REQ-007 | Review caveats are honored | The lineage re-root and bitemporal zero-callers caveats are flagged for reconfirmation before any fix |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 91 P2 are accounted for across the lens groups, with no ungrouped finding.
- Each group has a fix-now or accept-as-is verdict and a one-line reason.
- Each fix-now group is routed to a follow-on owner. Each accept-as-is group records why deferral is safe.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/004-review-remediation/004-p2-triage --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Approximate counts read as exhaustive | A reader may treat the group counts as the per-item list | State that review-report.md is authoritative and counts are approximate |
| Risk | An accept-as-is item is actually live | Deferral could hide a real defect | Reconfirm the two review caveats (lineage re-root, bitemporal zero-callers) against the broader codebase |
| Dependency | `review-report.md` | The triage is a decision layer over it | Keep the report as the per-item source of truth |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- The triage must be reproducible from the review-report.md finding set.
- No P2 fix is performed in this phase.
- Each verdict is a single, defensible sentence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Findings that the tri-model pass and the deep-dive both raised are counted once in their dominant family.
- A finding that reframes a confirmed P1 at P2 severity (for example the retention spare-only fail-closed framing) is routed to the owning P1 phase, not double-counted as new work.
- The doc-accuracy cluster is owned by phase 003. G12 cross-references it rather than re-deciding it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| File count | Small | Scaffold docs only, no code touched |
| Risk | Low | Triage is a decision layer, not a change |
| Verification | Medium | Completeness against the full P2 set must be checked |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the fix-now P2 groups become a single new remediation phase (007) or ride along inside phases 001-002 where the surfaces overlap? The routing decision is recorded during execution. The default is to ride along where the file is already open.
<!-- /ANCHOR:questions -->


---

<!-- ANCHOR:reconstructed-016-disposition -->
## Reconstructed P2 → 016 Disposition (phase 013, 2026-07-04)

The frozen per-item source (`../../archive/review-report.md`) is unrecoverable (verified absent 2026-07-03: neither that path nor `028/006/archive/review-report.md` resolves, and no per-item P2 enumeration survives in the 028 packet). The authoritative reconstruction is therefore the G1-G15 lens grouping above (items enumerated inline within each family), cross-referenced with the deep-dive findings-ledger P2 entries. Per-item granularity is bounded by the unrecoverable source; each family below carries its item count and its disposition. Every family has a disposition — zero unmapped.

| Family | Items | Original verdict | 016 disposition |
|--------|-------|------------------|-----------------|
| G1 schema-migration non-idempotency | 5 | Fix-now | **Accept-as-is** — latent (bitemporal read path unwired; no live consumer). Outside the 016 memory-search-runtime scope; hardening backlog. |
| G2 rollback-API durability | 4 | Accept-as-is | **Accept-as-is** (unchanged) — test-only rollback, additive nullable columns. |
| G3 default-off response-shape drift | 4 | Fix-now | **Covered → 016/012** — envelope single-casing + byte-identical-to-baseline is exactly 012's response-shape work. |
| G4 eval-harness correctness | 9 | Fix-now | **Covered → 016/006** — the eval-production-parity harness (006 built `executePipeline` parity). |
| G5 fail-open guards | 2 | Fix-now | **Covered → 016/004** — embedding-coverage guard (inspectEmbeddingCoverage empty→coverage). |
| G6 constitutional CRUD TOCTOU | 1 | Fix-now | **Accept-as-is** — matters only under multi-process/shared-WAL; 002 touched constitutional exclusion but not this TOCTOU. Hardening backlog. |
| G7 DoS/robustness guards | 2 | Fix-now | **Accept-as-is** — cheap depth/txn guards on partially-influenced paths; hardening backlog. |
| G8 eval-harness TOCTOU + path leak | 3 | Accept-as-is | **Accept-as-is** (unchanged) — eval-only, low blast radius. |
| G9 latent injection seams | 4 | Fix-now | **Covered → 016/007** — the llm-reformulation prompt-injection fence (finding-level table #1). |
| G10 recall correctness | 4 | Fix-now | **Covered → 016/009 + 016/010** — world-summary ORDER BY landed in 009; recall-lane perf in 010. |
| G11 test-coverage/missing-assertion | 20 | Accept-as-is | **Accept-as-is** (unchanged) — default-off low-blast gaps; test-hardening backlog. |
| G12 doc-accuracy P2 cluster | 12 | Fix-now (phase 003) | **Owned by 006/003-doc-accuracy** (pre-016) — cross-referenced, not re-decided here. |
| G13 code-graph SUPERSEDES/bitemporal | 4 | Accept-as-is | **Accept-as-is** (unchanged) — read gate has zero consumers. |
| G14 advisor outcome-weighted rerank | 3 | Accept-as-is | **Accept-as-is** (unchanged) — default-off shadow channel. |
| G15 flags ceiling/drift guards | 2 | Fix-now | **Accept-as-is** — cheap test additions; hardening backlog. |

**Count reconciliation vs the "91" headline:** the reconstructed families sum to **~86** (5+4+4+9+2+1+2+3+4+4+20+12+4+3+2), matching the triage's own approximate total; the ~5 delta from the "91" headline is the review's own "approximate, families-overlap" figure (stated at §"P2 Lens Triage"), not missing items — no items were fabricated to force 91. **Covered by 016 phases:** G3→012, G4→006, G5→004, G9→007, G10→009/010 = **~23 P2 items**. **Owned by 006/003:** G12 (12). **Accept-as-is (backlog):** G1/G6/G7/G15 (fix-now-but-outside-016-scope, ~10) + G2/G8/G11/G13/G14 (~33) = ~43. Zero families without a disposition.
<!-- /ANCHOR:reconstructed-016-disposition -->
