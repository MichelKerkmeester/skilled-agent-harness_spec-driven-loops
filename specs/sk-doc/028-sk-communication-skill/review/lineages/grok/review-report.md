# Deep Review Report — sk-communication skill (fanout lineage: grok)

Session: `fanout-grok-1786552183697-d6ykc1`  
Target: `specs/sk-doc/028-sk-communication-skill` (spec-folder)  
Skill surface: `.opencode/skills/sk-communication/`  
Stop: `max-iterations` (5/5) · Threshold telemetry: 0.1  
Executor: cli-cursor / cursor-grok-4.5-high-fast  
Generated: 2026-08-12T16:41:00Z

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **Active P0** | 0 |
| **Active P1** | 2 (F001, F004) |
| **Active P2** | 6 (F002, F003, F005, F006, F007, F008) |
| **hasAdvisories** | true |
| **releaseReadinessState** | in-progress (blocked from converged by active P1) |
| **Scope** | Spec packet + authored standalone skill wrapper for `@portable-cli/communication-projection` |
| **Stop reason** | max-iterations reached (early composite convergence treated as telemetry only) |

The skill is a coherent advisor-routable class-S wrapper: REQ-002 invariants are stated, leaf-manifest leaves resolve on disk, privacy-before-ranking is implemented and tested, and a warm advisor smoke ranked `sk-communication` first. Two P1 gaps block unconditional ship readiness: a false public `./clients` export claim in SKILL/README, and under-evidenced T005 completion claims.

Canonical finding IDs are F001–F008. Reducer `SUMMARY-*` rows are ignored as scorecard-parse duplicates.

---

## 2. Planning Trigger

Route to `/speckit:plan` (or a small remediation packet) for:

1. Align advertised package subpath exports with `packages/cli-communication-projection/package.json` (remove `./clients`; add `./contracts` / `./versioning` if documenting public surfaces).
2. Strengthen T005 evidence with an advisor transcript or persisted COMM-001 benchmark report.
3. Optionally clear P2 advisories (assets leafRoot, fingerprint placeholders, COMM-001 catalog mapping, benchmark TODO, playbook coverage note).

Do **not** treat this as a changelog-only PASS path while F001/F004 remain active.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": ["F001", "F002", "F003", "F004", "F005", "F006", "F007", "F008"],
  "remediationWorkstreams": ["WS-1", "WS-2", "WS-3"],
  "specSeed": ["Strengthen T005 evidence", "Optional fingerprint honesty note"],
  "planSeed": ["Align export lists", "Capture advisor transcript for T005", "Drop assets leafRoot", "Finish benchmark README", "Document automated-only catalog features"],
  "findingClasses": ["api-contract-drift", "config-fs-drift", "policy-source-drift", "checklist-evidence-gap", "continuity-honesty", "playbook-catalog-mismatch", "doc-scaffold-residue", "playbook-coverage-gap"],
  "affectedSurfacesSeed": [".opencode/skills/sk-communication/SKILL.md", ".opencode/skills/sk-communication/README.md", "specs/sk-doc/028-sk-communication-skill/tasks.md", ".opencode/skills/sk-communication/leaf-manifest.config.json", ".opencode/skills/sk-communication/benchmark/README.md", ".opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md"],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | First/Last | Status |
|----|-----|-----------|-------|----------|------------|--------|
| F001 | P1 | correctness | Skill advertises non-existent `./clients` package subpath export | SKILL.md:130; README.md:61; package.json:16-56 | 1/5 | active |
| F002 | P2 | correctness | `leafRoots` includes missing `assets/` directory | leaf-manifest.config.json:6; assets/ absent | 1/1 | active |
| F003 | P2 | security | OpenCode Go retention deadline is dual-sourced | SKILL.md:152; presets.ts:48 | 2/2 | active |
| F004 | P1 | traceability | T005 completion evidence lacks advisor-run transcript | tasks.md:68 | 3/3 | active |
| F005 | P2 | traceability | Placeholder session_dedup fingerprints in packet docs | spec.md:23 (and siblings) | 3/3 | active |
| F006 | P2 | traceability | COMM-001 catalog cross-ref is a privacy feature | manual-testing-playbook.md:130 | 3/3 | active |
| F007 | P2 | maintainability | Benchmark README still contains scaffold TODO | benchmark/README.md:19 | 4/4 | active |
| F008 | P2 | maintainability | Five catalog features lack playbook scenario coverage | playbook.md:18 vs 11 catalog features | 5/5 | active |

---

## 4. Remediation Workstreams

### WS-1 — Public API docs (depends on: none)
- Findings: F001
- Actions: Edit SKILL.md + README export lists to match `package.json` exports; keep `src/clients/` only as internal path guidance in the routing table.
- Order: 1

### WS-2 — Completion evidence hygiene (depends on: none)
- Findings: F004, F005
- Actions: Persist advisor smoke / COMM-001 report into T005 evidence; recompute continuity fingerprints (outside this lineage write fence).
- Order: 2

### WS-3 — Scaffold and coverage advisories (depends on: WS-1 optional)
- Findings: F002, F003, F006, F007, F008
- Actions: Drop unused `assets` leafRoot; point SKILL OpenCode Go date at presets/assessor; clarify COMM-001 catalog mapping; finish benchmark README; document automated-only catalog features.
- Order: 3

---

## 5. Spec Seed

Minimal packet deltas implied by findings:

- tasks.md: replace T005 evidence with concrete advisor recommendation capture (skill id, confidence, exit status).
- Optional Level-1 note: continuity fingerprints must be non-zero before claiming freshness-complete.
- No new REQs required for F001 (documentation defect against existing package contract).

---

## 6. Plan Seed

1. Patch SKILL.md / README.md export lists (F001).
2. Capture advisor recommendation for the COMM-001 prompt and attach to T005 (F004).
3. Remove `assets` from leaf-manifest.config.json and regenerate manifest/aliases (F002).
4. Replace benchmark README TODO (F007).
5. Amend playbook coverage note for five unlinked catalog features (F008).
6. Re-run `validate_skill_package.py` / `ci-skill-root-metadata` after doc/config edits (verification outside this observation-only review).

---

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | partial | REQ-001 files present; REQ-002 invariants present; public export claim partial via F001 |
| `checklist_evidence` | core | fail | Level 1 (no checklist.md); T005 checked row under-evidenced (F004); zero fingerprints (F005) |
| `skill_agent` | overlay | notApplicable | No runtime agent definitions for this skill |
| `agent_cross_runtime` | overlay | notApplicable | Not an agent target |
| `feature_catalog_code` | overlay | pass | Feature files cite real package paths |
| `playbook_capability` | overlay | partial | 8 scenarios present; F006 mapping soft miss; F008 coverage gaps |

**AC_COVERAGE:** exempt (Level 1 packet; no `checklist.md`; lifecycle predicate not active).

---

## 8. Deferred Items

- P2 advisories F002, F003, F005, F006, F007, F008.
- Full package `npm run check` not executed inside this lineage (non-goal / observation budget).
- Resource Map Coverage Gate skipped (`resource-map.md` absent at init).
- Reducer `SUMMARY-*` duplicate IDs from scorecard parsing — ignore for remediation.

---

## Dimension Expansion Map

- Saturated directions: none recorded by reducer divergence state.
- Completed pivots: 0 · Failed pivots: 0 · Audited overrides: 0
- Selected review directions: D1→D2→D3→D4→stabilization (catalog/export completeness)
- Remaining frontier: none required under max-iterations stop; optional follow-on is remediation planning only.
- Council artifacts: none

---

## Search Ledger

*No search-depth state captured (legacy v1 record)*

- hasSearchDebt: false
- searchCoverage / candidateCoverage / searchDebt / ruledOutCandidates / cleanSearchProof: empty/absent

---

## 9. Audit Appendix

### Iteration table

| Run | Focus | Dimensions | New P0/P1/P2 | Ratio | Verdict line |
|-----|-------|------------|--------------|-------|--------------|
| 1 | Entry-point / leaf-root claims | correctness | 0/1/1 | 0.55 | CONDITIONAL |
| 2 | Privacy / secrets / telemetry | security | 0/0/1 | 0.09 | PASS |
| 3 | REQ / checklist / catalog / playbook | traceability | 0/1/2 | 0.41 | CONDITIONAL |
| 4 | Docs hygiene | maintainability | 0/0/1 | 0.08 | PASS |
| 5 | Catalog coverage stabilization | traceability+maintainability | 0/0/1 | 0.07 | PASS |

### Dimension coverage

| Dimension | Covered | Iterations |
|-----------|---------|------------|
| correctness | yes | 1 |
| security | yes | 2 |
| traceability | yes | 3, 5 |
| maintainability | yes | 4, 5 |

### Convergence telemetry

- stopPolicy: max-iterations (hard stop at 5)
- Final composite convergenceScore (reducer): ~0.93 (telemetry only; did not end run early)
- newFindingsRatio sequence: 0.55 → 0.09 → 0.41 → 0.08 → 0.07

### Adversarial P0 replay

No P0 findings were raised; no Hunter/Skeptic/Referee replay required.

### Advisor smoke (supporting F004 context)

Warm `skill-advisor` recommendation for the COMM-001 prompt returned `sk-communication` first (confidence ≈ 0.94). Behavior supports the claim; packet evidence still incomplete.

### File coverage (primary)

Reviewed: packet `spec.md`/`tasks.md`/`implementation-summary.md`; skill `SKILL.md`, `README.md`, `graph-metadata.json`, `leaf-manifest*`, `references/package-map.md`, feature-catalog index, playbook index + privacy scenario; package `package.json`, `src/privacy/router.ts`, `src/providers/executor.ts`, `src/providers/presets.ts`.

### Cross-reference appendix

#### Core Protocols
- `spec_code`: partial (F001)
- `checklist_evidence`: fail (F004, F005); Level 1 exempt from checklist.md

#### Overlay Protocols
- `skill_agent`: notApplicable
- `agent_cross_runtime`: notApplicable
- `feature_catalog_code`: pass
- `playbook_capability`: partial (F006, F008)

Review verdict: CONDITIONAL
