# Deep Review Report — sk-communication skill (fanout lineage: glm)

Session: `fanout-glm-1786554114570-0u7w7m`  
Target: `specs/sk-doc/028-sk-communication-skill` (spec-folder)  
Skill surface: `.opencode/skills/sk-communication/`  
Stop: `max-iterations` (5/5) · Threshold telemetry: 0.1  
Executor: cli-cursor / glm-5.2-max  
Generated: 2026-08-12T17:14:00Z

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **Active P0** | 0 |
| **Active P1** | 2 (F001, F004) |
| **Active P2** | 7 (F002, F003, F005, F006, F007, F008, F009) |
| **hasAdvisories** | true |
| **releaseReadinessState** | in-progress (blocked from converged by active P1) |
| **Scope** | Spec packet + authored standalone skill wrapper for `@portable-cli/communication-projection` |
| **Stop reason** | max-iterations reached (5/5); early composite convergence treated as telemetry only |

The skill is a coherent advisor-routable class-S wrapper: REQ-001 class-S root is structurally satisfied, REQ-002 invariants are all stated in SKILL.md (pipeline, both tiers, privacy-before-ranking, exact-original, content-free telemetry), REQ-003 advisor-discoverability is structurally satisfied via graph-metadata domains and intent signals. Privacy-before-ranking, egress consent, fail-closed on stale facts, and credential-references-not-values were all verified against `src/privacy/router.ts` and `src/providers/presets.ts` and hold. Two P1 gaps block unconditional ship readiness: a false public `./clients` export claim in SKILL/README (with bidirectional drift — `./contracts` and `./versioning` are exported but unadvertised), and under-evidenced T005 completion claims (the advisor smoke was never persisted per the playbook's own contract).

Canonical finding IDs are F001–F009. No P0 findings were raised; no adversarial P0 replay was required. Both P1 findings were adversarially re-verified in iteration 5 and confirmed not false positives.

---

## 2. Planning Trigger

Route to `/speckit:plan` (or a small remediation packet) for:

1. Align advertised package subpath exports with `packages/cli-communication-projection/package.json` (remove `./clients`; add `./contracts` and `./versioning`).
2. Strengthen T005 evidence by running COMM-001 via `run-manual-playbook-scenario.cjs` and attaching the persisted report path, or rephrase the evidence to cite a warm advisor recommendation capture stored in the packet.
3. Optionally clear P2 advisories: drop unused `assets` leafRoot; point SKILL OpenCode Go date at the package preset's `expiresAt`; recompute continuity fingerprints; clarify COMM-001 catalog mapping; finish benchmark README; document automated-only catalog features; reconcile SKILL.md §5/§7 sibling list with graph-metadata siblings.

Do **not** treat this as a changelog-only PASS path while F001/F004 remain active.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": ["F001", "F002", "F003", "F004", "F005", "F006", "F007", "F008", "F009"],
  "remediationWorkstreams": ["WS-1", "WS-2", "WS-3"],
  "specSeed": ["Strengthen T005 evidence", "Optional fingerprint honesty note"],
  "planSeed": ["Align export lists", "Capture advisor transcript for T005", "Drop assets leafRoot", "Replace benchmark README TODO", "Reconcile sibling edges", "Document automated-only catalog features"],
  "findingClasses": ["api-contract-drift", "config-fs-drift", "policy-source-drift", "checklist-evidence-gap", "continuity-honesty", "playbook-catalog-mismatch", "doc-scaffold-residue", "playbook-coverage-gap", "sibling-edge-drift"],
  "affectedSurfacesSeed": [".opencode/skills/sk-communication/SKILL.md", ".opencode/skills/sk-communication/README.md", "specs/sk-doc/028-sk-communication-skill/tasks.md", ".opencode/skills/sk-communication/leaf-manifest.config.json", ".opencode/skills/sk-communication/benchmark/README.md", ".opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md", ".opencode/skills/sk-communication/feature-catalog/feature-catalog.md"],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | First/Last | Status |
|----|-----|-----------|-------|----------|------------|--------|
| F001 | P1 | correctness | Skill advertises non-existent `./clients` package subpath export; bidirectional export-map drift | SKILL.md:130; README.md:61; package.json:16-56 | 1/5 | active |
| F002 | P2 | correctness | `leafRoots` includes missing `assets/` directory | leaf-manifest.config.json:6; assets/ absent | 1/1 | active |
| F003 | P2 | security | OpenCode Go retention deadline is dual-sourced | SKILL.md:152; presets.ts:48 | 2/2 | active |
| F004 | P1 | traceability | T005 completion evidence lacks advisor-run transcript | tasks.md:68; benchmark/reports/ (no dated run) | 3/5 | active |
| F005 | P2 | traceability | Placeholder session_dedup fingerprints in packet docs | spec.md:23 (and siblings) | 3/3 | active |
| F006 | P2 | traceability | COMM-001 catalog cross-ref maps to a privacy feature, not an advisor-routing feature | manual-testing-playbook.md:130 | 3/3 | active |
| F007 | P2 | maintainability | Benchmark README still contains scaffold TODO | benchmark/README.md:19 | 4/4 | active |
| F008 | P2 | traceability | Five catalog features lack playbook scenario coverage | feature-catalog.md (11 features) vs playbook.md:228-237 (6 covered) | 3/3 | active |
| F009 | P2 | maintainability | Sibling-edge drift between SKILL.md and graph-metadata.json | SKILL.md:183-185,211-213; graph-metadata.json:11-25 | 4/4 | active |

---

## 4. Remediation Workstreams

### WS-1 — Public API docs (depends on: none)
- Findings: F001
- Actions: Edit SKILL.md:130 and README.md:61 export lists to match `package.json` exports — drop `./clients`, add `./contracts` and `./versioning`. Keep `src/clients/` only as an internal subsystem path in the SKILL.md:49-56 routing table.
- Order: 1

### WS-2 — Completion evidence hygiene (depends on: none)
- Findings: F004, F005
- Actions: Run COMM-001 via `run-manual-playbook-scenario.cjs` and attach the persisted report path to T005 evidence (or rephrase to cite a warm advisor capture stored in the packet). Recompute continuity fingerprints via `generate-context.js` so the stored values reflect actual packet content.
- Order: 2

### WS-3 — Scaffold, edge, and coverage advisories (depends on: WS-1 optional)
- Findings: F002, F003, F006, F007, F008, F009
- Actions: Drop unused `assets` leafRoot and regenerate manifest/aliases; point SKILL OpenCode Go date at the package preset's `expiresAt` instead of hardcoding; clarify COMM-001 catalog mapping (add advisor-discoverability catalog feature or note the mapping is indirect); replace benchmark README TODO; document the five automated-only catalog features; reconcile SKILL.md §5/§7 sibling list with graph-metadata siblings (add `sk-git` to graph-metadata or `sk-doc` to SKILL.md, or rephrase).
- Order: 3

---

## 5. Spec Seed

Minimal packet deltas implied by findings:

- tasks.md: replace T005 evidence with a concrete persisted advisor recommendation capture (skill id, confidence, exit status, report path).
- Optional Level-1 note: continuity fingerprints must be non-zero before claiming freshness-complete.
- No new REQs required for F001 (documentation defect against existing package contract).

---

## 6. Plan Seed

1. Patch SKILL.md:130 and README.md:61 export lists (F001).
2. Run COMM-001 via `run-manual-playbook-scenario.cjs` and attach the persisted report to T005 (F004).
3. Remove `assets` from `leaf-manifest.config.json` and regenerate manifest/aliases (F002).
4. Replace benchmark README TODO with a one-paragraph description (F007).
5. Reconcile SKILL.md §5/§7 sibling list with graph-metadata.json siblings (F009).
6. Amend playbook coverage note for five unlinked catalog features (F008).
7. Re-run `validate_skill_package.py` / `ci-skill-root-metadata` after doc/config edits (verification outside this observation-only review).

---

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | partial | REQ-001/002/003 structurally satisfied; public export claim partial via F001; invariants verified against code |
| `checklist_evidence` | core | fail | Level 1 (no checklist.md); T005 checked row under-evidenced (F004); zero fingerprints (F005) |
| `skill_agent` | overlay | notApplicable | No runtime agent definitions for this skill |
| `agent_cross_runtime` | overlay | notApplicable | Not an agent target |
| `feature_catalog_code` | overlay | pass | 11 feature files all substantive and cite real package paths |
| `playbook_capability` | overlay | partial | 8 scenarios substantive; F006 mapping soft miss; F008 coverage gaps for 5 features |

**AC_COVERAGE:** exempt (Level 1 packet; no `checklist.md`; lifecycle predicate not active).

---

## 8. Deferred Items

- P2 advisories F002, F003, F005, F006, F007, F008, F009.
- Full package `npm run check` not executed inside this lineage (non-goal / observation budget).
- Resource Map Coverage Gate skipped (`resource-map.md` absent at init).
- Continuity fingerprint recompute (F005) is outside this lineage's write fence — must be run via `generate-context.js` in a follow-up.

---

## Dimension Expansion Map

- Saturated directions: none recorded by reducer divergence state.
- Completed pivots: 0 · Failed pivots: 0 · Audited overrides: 0
- Selected review direction: D1→D2→D3→D4→stabilization (adversarial P1 replay + broaden to under-reviewed surfaces)
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
| 3 | REQ / checklist / catalog / playbook | traceability | 0/1/3 | 0.41 | CONDITIONAL |
| 4 | Docs hygiene / sibling edges | maintainability | 0/0/2 | 0.08 | PASS |
| 5 | Stabilization / adversarial replay + broaden | traceability+maintainability | 0/0/0 | 0.07 | PASS |

### Dimension coverage

| Dimension | Covered | Iterations |
|-----------|---------|------------|
| correctness | yes | 1 |
| security | yes | 2 |
| traceability | yes | 3, 5 |
| maintainability | yes | 4, 5 |

### Convergence telemetry

- stopPolicy: max-iterations (hard stop at 5)
- Final composite convergenceScore (reducer): 0.82 (telemetry only; did not end run early)
- newFindingsRatio sequence: 0.55 → 0.09 → 0.41 → 0.08 → 0.07

### Adversarial P0 replay

No P0 findings were raised; no Hunter/Skeptic/Referee replay required.

### Adversarial P1 replay (iteration 5)

- F001 re-confirmed: `./clients` still absent from `package.json` exports; SKILL.md:130/README.md:61 still list it. P1 stands.
- F004 re-confirmed: `benchmark/reports/` still has only `README.md`, no dated run; tasks.md:68 still cites prose evidence. P1 stands.

### File coverage (primary)

Reviewed: packet `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md`/`description.json`; skill `SKILL.md`, `README.md`, `graph-metadata.json`, `leaf-manifest.config.json`, `leaf-manifest.json`, `leaf-aliases.json`, `references/package-map.md`, `feature-catalog/feature-catalog.md` + 2 per-feature files, `manual-testing-playbook/manual-testing-playbook.md` + 1 per-scenario file, `benchmark/README.md`; package `package.json`, `src/index.ts`, `src/privacy/router.ts`, `src/providers/presets.ts`, `src/clients/`.

### Cross-reference appendix

#### Core Protocols
- `spec_code`: partial (F001)
- `checklist_evidence`: fail (F004, F005); Level 1 exempt from checklist.md

#### Overlay Protocols
- `skill_agent`: notApplicable
- `agent_cross_runtime`: notApplicable
- `feature_catalog_code`: pass (11 files substantive)
- `playbook_capability`: partial (F006, F008)

Review verdict: CONDITIONAL
