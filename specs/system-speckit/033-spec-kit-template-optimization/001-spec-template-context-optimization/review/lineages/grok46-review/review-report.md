# Deep Review Report: 034-spec-template-context-optimizations

**Lineage:** grok46-review · sessionId `fanout-grok46-review-1786566874028-sks2q2` · executor cli-cursor / cursor-grok-4.6-xhigh · generation 1
**Loop:** 5 iterations, stop-policy max-iterations (convergence telemetry only) · convergence threshold 0.10
**Reviewed:** 2026-08-12T20:38:24Z – 2026-08-12T20:58:00Z
**Target:** `specs/system-speckit/034-spec-template-context-optimizations` (spec-folder)
**resource_map_present:** false (coverage-gate section omitted; lineage `resource-map.md` emitted at synthesis)

---

## 1. Executive Summary

**Verdict: CONDITIONAL** · active P0=0, P1=6, P2=11 · `hasAdvisories=false` · `releaseReadinessState=in-progress`

The four implementation phases are committed (`c8c4e79139`) and the packet's own `validate.sh --strict` exits 0. Focused vitest for golden snapshots, research gating, and memory-search token budget is green. Packet docs still contradict that machine state: tasks remain open, Status still says uncommitted, implementation-summary still reports snapshot failures that do not exist, REQ-006 still names a shared helper ADR-005 rejected, and open plan/task text would regress AC_COVERAGE back to warn. SCOPE_ADHERENCE's canonical-doc skip matches basename only.

Scope: packet docs plus Files to Change surfaces (manifest templates, renderer, AC_COVERAGE, scope-adherence, memory_search). Sibling `pi-flash-review` findings were re-verified, not copied.

Stop reason: `maxIterationsReached` (5/5). Composite convergenceScore 0.95 is telemetry only.

---

## 2. Planning Trigger

Verdict CONDITIONAL routes to `/speckit:plan` for reconciliation, not greenfield implementation. A PASS would have routed to `/create:changelog`; that is blocked while any P1 remains.

Primary work: (a) make packet completion claims match the committed tree and green gates; (b) amend REQ-006 / T030 / plan Phase 3 to the shipped contracts; (c) restrict SCOPE_ADHERENCE's canonical-doc exception to the packet folder under review.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "fixCompletenessRequired": true,
  "activeFindings": [
    {"id": "F001", "severity": "P1", "findingClass": "spec-code-contradiction"},
    {"id": "F002", "severity": "P1", "findingClass": "stale-verification-claim"},
    {"id": "F003", "severity": "P1", "findingClass": "stale-current-state"},
    {"id": "F006", "severity": "P1", "findingClass": "control-bypass"},
    {"id": "F009", "severity": "P1", "findingClass": "spec-code-contradiction"},
    {"id": "F013", "severity": "P1", "findingClass": "regression-footgun"},
    {"id": "F004", "severity": "P2", "findingClass": "stale-doc-claim"},
    {"id": "F005", "severity": "P2", "findingClass": "stale-doc-claim"},
    {"id": "F007", "severity": "P2", "findingClass": "over-accept"},
    {"id": "F008", "severity": "P2", "findingClass": "parser-fragility"},
    {"id": "F010", "severity": "P2", "findingClass": "ac-coverage-shortfall"},
    {"id": "F011", "severity": "P2", "findingClass": "spec-precision"},
    {"id": "F012", "severity": "P2", "findingClass": "stale-continuity"},
    {"id": "F014", "severity": "P2", "findingClass": "architecture-claim-drift"},
    {"id": "F015", "severity": "P2", "findingClass": "stale-continuity"},
    {"id": "F016", "severity": "P2", "findingClass": "stale-doc-claim"},
    {"id": "F017", "severity": "P2", "findingClass": "overlay-gap"}
  ],
  "findingClasses": [
    "spec-code-contradiction",
    "stale-verification-claim",
    "stale-current-state",
    "control-bypass",
    "regression-footgun",
    "stale-doc-claim",
    "over-accept",
    "parser-fragility",
    "ac-coverage-shortfall",
    "spec-precision",
    "stale-continuity",
    "architecture-claim-drift",
    "overlay-gap"
  ],
  "affectedSurfacesSeed": [
    "tasks.md",
    "checklist.md",
    "spec.md",
    "plan.md",
    "implementation-summary.md",
    "decision-record.md",
    "scaffold-golden-snapshots.vitest.ts",
    "check-scope-adherence.sh",
    "check-ac-coverage.sh",
    "validator-registry.json",
    "memory-search.ts",
    "spec.md.tmpl",
    "plan.md.tmpl",
    "tasks.md.tmpl",
    "implementation-summary.md.tmpl",
    "template-guide.md",
    "inline-gate-renderer.ts",
    "manual-testing-playbook",
    "feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md"
  ],
  "remediationWorkstreams": [
    {"id": "L1", "title": "Packet state reconciliation", "findingIds": ["F001", "F002", "F003", "F012", "F015"]},
    {"id": "L2", "title": "Spec/plan/task contract repair", "findingIds": ["F009", "F013", "F004", "F005", "F014", "F016"]},
    {"id": "L3", "title": "SCOPE_ADHERENCE hardening", "findingIds": ["F006", "F007", "F008"]},
    {"id": "L4", "title": "AC_COVERAGE honesty", "findingIds": ["F010", "F011"]},
    {"id": "L5", "title": "Overlay documentation", "findingIds": ["F017"]}
  ],
  "specSeed": [
    "Refresh Status and continuity so Complete matches the feat commit and green gates (F001, F003).",
    "Amend REQ-006 to enforceSearchTokenBudget + getTokenBudget, or revert to a shared helper (F009).",
    "Keep REQ-004 as INFO/advisory; stop describing warn as the promotion target (F013).",
    "State REQ-002 as per-template inline gates unless a shared include is extracted (F014).",
    "Replace the 944-line constant with a render command (F004).",
    "Name the STDOUT read path as omit --out-dir (F016)."
  ],
  "planSeed": [
    "Mark shipped tasks [x] with evidence or demote tasks.md as non-authoritative (F001).",
    "Rewrite T030 / plan Phase 3 to INFO/advisory (F013).",
    "Rewrite T040 to enforceSearchTokenBudget (F009).",
    "Restrict canonical-doc skip to $folder and add a negative test for other/spec.md (F006).",
    "Rewrite implementation-summary §5 to the green vitest output (F002)."
  ]
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | findingClass | First/Last | Status |
|----|-----|-----|-------|----------|--------------|------------|--------|
| F001 | P1 | correctness | Packet completion state is internally contradictory | tasks.md:47 — T004 and T010–T053 `[ ]`; checklist CHK-011..019 `[x]`; spec Status Complete; validate.sh --strict exit 0 | spec-code-contradiction | 1/5 | active |
| F002 | P1 | correctness | implementation-summary reports golden-snapshot failures that do not exist | implementation-summary.md:87 vs :97; vitest scaffold-golden-snapshots + research-template-gating 10/10 pass | stale-verification-claim | 1/5 | active |
| F003 | P1 | correctness | Status still says uncommitted / awaiting commit after the feat commit landed | spec.md:47; git log `c8c4e79139`; plan.md continuity completion_pct 5 / implement Phase 1 | stale-current-state | 1/5 | active |
| F006 | P1 | security | SCOPE_ADHERENCE treats any basename-matching canonical doc as in-scope | check-scope-adherence.sh:136 `changed_file##*/`; vitest locks it in at check-scope-adherence.vitest.ts:64 | control-bypass | 2/5 | active |
| F009 | P1 | traceability | REQ-006 still requires shared enforceTokenBudget after ADR-005 rejected sharing | spec.md:113; decision-record.md ADR-005; memory-search.ts:2384 `enforceSearchTokenBudget` | spec-code-contradiction | 3/5 | active |
| F013 | P1 | maintainability | Open plan/task text still prescribes warn-severity AC_COVERAGE | plan.md:84; tasks.md:65 T030 `[ ]`; validator-registry.json:78 severity info; check-ac-coverage.sh:172 RULE_STATUS=pass | regression-footgun | 4/5 | active |
| F004 | P2 | correctness | REQ-001 still cites a 944-line ungated research template | spec.md:108; source 948 lines; L1 render 175; L3 render 944 | stale-doc-claim | 1/1 | active |
| F005 | P2 | correctness | AC_COVERAGE registry copy still says opt-in after default-on | validator-registry.json:85; check-ac-coverage.sh defaults SPECKIT_AC_COVERAGE true | stale-doc-claim | 1/1 | active |
| F007 | P2 | security | Declared-prefix matching uses substring containment | check-scope-adherence.sh:141 `*"/$declared_prefix"*` | over-accept | 2/2 | active |
| F008 | P2 | security | Change-set splitting destroys paths that contain whitespace | check-scope-adherence.sh:67 `tr '[:space:]'` | parser-fragility | 2/2 | active |
| F010 | P2 | traceability | Complete packet has 0/8 AC_COVERAGE evidence | checklist.md:29; validate.sh `AC_COVERAGE WARNING: 0/8`; RULE_STATUS pass | ac-coverage-shortfall | 3/5 | active |
| F011 | P2 | traceability | Under-coverage message says WARNING not INFO | check-ac-coverage.sh:223 vs spec.md:112 INFO-level message | spec-precision | 3/3 | active |
| F012 | P2 | traceability | implementation-summary still lists REQ-005 contract as an open question | implementation-summary.md:24; CHK-002 `[x]`; rule header documents MK_SCOPE_* | stale-continuity | 3/3 | active |
| F014 | P2 | maintainability | REQ-002 shared ungated core is per-template inline gates, not a shared include | spec.md.tmpl:1; no `*core*` under templates/manifest/; T020 still `[ ]` | architecture-claim-drift | 4/5 | active |
| F015 | P2 | maintainability | Continuity fingerprints are the all-zero placeholder across packet docs | spec.md:24 and the other five packet docs | stale-continuity | 4/4 | active |
| F016 | P2 | correctness | REQ-003 / T022 name a --stdout flag the renderer does not have | tasks.md:62; spec.md:119; template-guide.md:85 omit `--out-dir`; renderer usage `--out-dir` | stale-doc-claim | 5/5 | active |
| F017 | P2 | correctness | No playbook scenario for SCOPE_ADHERENCE or handleMemorySearch token budget | playbook glob/grep 0 hits; catalog only mentions rules in spec-validation-rule-engine.md:64 | overlay-gap | 5/5 | active |

**scopeProof / affectedSurfaceHints:** reducer-owned values live in `deep-review-findings-registry.json` for each ID above. Disposition of every row: `active`. Resolved: none.

---

## 4. Remediation Workstreams

| Lane | Findings | Order | Notes |
|------|----------|------:|-------|
| **L1: Packet state reconciliation** | F001, F002, F003, F012, F015 | 1 | Mark shipped tasks, refresh Status/continuity, rewrite §5 verification, clear the REQ-005 open question, replace zero fingerprints. |
| **L2: Spec/plan/task contract repair** | F009, F013, F004, F005, F014, F016 | 2 | Amend REQ-006 and T040; rewrite T030/plan Phase 3 to INFO; pin 944 to a command; registry description default-on; state inline-gate architecture; name omit `--out-dir`. |
| **L3: SCOPE_ADHERENCE hardening** | F006, F007, F008 | 2 | Folder-scoped canonical skip + negative test; prefix match without substring; newline/NUL split. |
| **L4: AC_COVERAGE honesty** | F010, F011 | 3 | AC-id rows or Manual-infeasible; rename WARNING → advisory/INFO. Does not change the CONDITIONAL verdict by itself. |
| **L5: Overlay documentation** | F017 | 3 | Playbook scenarios or explicit notApplicable rationale. |

P0 lane: none.

---

## 5. Spec Seed

- Status / current-state: drop "(uncommitted) / awaiting commit go-ahead" once the feat commit is the sanctioned baseline (F003). Reconcile tasks.md authority (F001).
- REQ-001: replace "944 lines" with a reproducible `inline-gate-renderer --level N` measurement (F004).
- REQ-002: describe per-template `<!-- IF level:... -->` gated copies, or require a real shared include (F014).
- REQ-003: document omit `--out-dir` as the STDOUT path; keep "(or equivalent)" only if a `--stdout` alias is added (F016).
- REQ-004: keep INFO/advisory + `RULE_STATUS=pass`; do not re-introduce warn as the acceptance target (F013). Optionally require an INFO-worded message (F011).
- REQ-006: name `enforceSearchTokenBudget` + `getTokenBudget('memory_search')`, citing ADR-005 (F009).
- REQ-005: keep warn-severity; require the canonical-doc exception to be packet-folder scoped (F006).

---

## 6. Plan Seed

1. (L1) Mark T010–T053 (and T004 if baselines exist) `[x]` with command evidence, or add a tasks.md banner that checklist/spec own completion. Refresh spec.md Status and plan.md/tasks.md continuity (`completion_pct`, `next_safe_action`).
2. (L1) Rewrite implementation-summary §5 to the green vitest output; delete the "4 failures" sentence; clear the REQ-005 open question.
3. (L2) Amend spec.md REQ-006 and tasks.md T040 to `enforceSearchTokenBudget`. Rewrite T030 and plan.md Phase 3 to default-on INFO/advisory.
4. (L3) Change `changed_file##*/` skip to paths under `$folder`; add a vitest that `other/spec.md` warns. Tighten prefix match; stop splitting on all whitespace.
5. (L4) Add AC-id traceability rows for REQ-001..006 or mark Manual-infeasible. Rename the under-coverage message.
6. (L5) Add playbook scenarios or document overlay notApplicable.
7. Re-run `validate.sh --strict` on this packet and the focused vitest suites; report baseline → delta.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Gate | Status | Evidence | Unresolved drift |
|----------|------|--------|----------|------------------|
| `spec_code` | hard | **partial** | spec.md:47, spec.md:113, plan.md:84, check-scope-adherence.sh:136; validate.sh --strict exit 0; vitest 10/10 + memory-search-token-budget 5/5 | F001, F002, F003, F006, F009, F013 |
| `checklist_evidence` | hard | **partial** | checklist.md fully `[x]` with evidence text; tasks.md still open; AC_COVERAGE 0/8 | F001, F010 |

`gatingFailures` recorded by the reducer on the last iteration summary: 0 fail-status protocols. Core protocols are partial, not fail.

**AC_COVERAGE** (lifecycle-active Level-2 Complete packet): **advisory-shortfall** · covered/total **0/8** · floor **8/8**. Message text says WARNING; `RULE_STATUS` stays `pass`; registry severity `info`. Does not change the verdict enum.

### Overlay Protocols

| Protocol | Gate | Status | Evidence | Unresolved drift |
|----------|------|--------|----------|------------------|
| `skill_agent` | advisory | notApplicable | spec-folder target | — |
| `agent_cross_runtime` | advisory | notApplicable | spec-folder target | — |
| `feature_catalog_code` | advisory | **partial** | spec-validation-rule-engine.md:64 names AC_COVERAGE + SCOPE_ADHERENCE | no dedicated handleMemorySearch budget feature (F017) |
| `playbook_capability` | advisory | **partial** | playbook has no SCOPE_ADHERENCE or search-handler-budget scenario | F017 |

---

## 8. Deferred Items

- F004, F005, F007, F008, F010, F011, F012, F014, F015, F016, F017 — P2 advisories; do not block CONDITIONAL by themselves.
- Zero `session_dedup` fingerprints (F015) until a real `generate-context.js` save (out of scope for this lineage).
- Full-repo scripts suite caveat in implementation-summary.md:99 — not re-run here.
- Coverage-graph sqlite upsert skipped (fan-out write isolation); graph_convergence events are graphless CONTINUE telemetry.
- Memory save / `generate-context.js` skipped (writes the spec packet).

---

## Dimension Expansion Map

Records breadth only. Does not alter the Executive Summary verdict, hasAdvisories, finding registry, or adversarial self-check.

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated / swept directions: none (stopPolicy max-iterations; all four configured dimensions covered plus one broadening pass)
- Council artifact references: none
- Selected review directions: D1 correctness → D2 security → D3 traceability → D4 maintainability → iter-5 adversarial replay + overlays
- Remaining frontier: none recorded (hard stop at iteration 5)

---

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

- `searchCoverage.requiredBugClasses`: []
- `candidateCoverage`: covered/ruledOut/deferred/blocked all empty
- `searchDebt`: []
- `ruledOutCandidates`: []
- `cleanSearchProof`: []
- `hasSearchDebt`: false
- `graphCoverageMode`: none

Dashboard verdict stays CONDITIONAL from active P1s, not from search debt.

---

## 10. Audit Appendix

### Convergence replay

Recomputed from JSONL iteration records only (stopPolicy max-iterations; legal-stop vetoes do not apply at the ceiling):

| Iter | Dimension | newFindingsRatio | New P0/P1/P2 | Cumulative open | graphDecision |
|------|-----------|------------------|--------------|-----------------|---------------|
| 1 | correctness | 1.00 | 0/3/2 | 5 | CONTINUE |
| 2 | security | 0.29 | 0/1/2 | 8 | CONTINUE |
| 3 | traceability | 0.27 | 0/1/3 | 12 | CONTINUE |
| 4 | maintainability | 0.18 | 0/1/2 | 15 | CONTINUE |
| 5 | correctness/security/traceability | 0.05 | 0/0/2 | 17 | CONTINUE (then hard stop) |

- Last graphSignals: dimensionCoverage=1, findingStability=0.05, p0ResolutionRate=1, evidenceDensity=1.6, hotspotSaturation=0.7
- graphConvergenceScore: 0.87 · reducer convergenceScore: 0.95
- Replay vs persisted: both say CONTINUE until `iteration_count >= 5`; stopReason `maxIterationsReached`
- Claim-adjudication events: runs 1–5 `passed: true`; no missing P0/P1 packets
- Corruption: 0 malformed JSONL lines

### Dimension / file coverage

| Dimension | Iterations | Open findings |
|-----------|------------|--------------:|
| correctness | 1, 5 | 7 |
| security | 2, 5 | 3 |
| traceability | 3, 5 | 4 |
| maintainability | 4 | 3 |

### Ruled-out claims (do not reopen without new evidence)

- Red golden snapshots on the current tree — vitest 10/10 (iter 1)
- Missing `description.json` `level` — validate.sh DESCRIPTION_SHAPE pass, `"level": "2"`
- REQ-001 L1 collapse missing — L1 render 175 lines
- memory_search exec/secrets injection
- git `MK_SCOPE_BASE` injection (`diff --name-only "$scope_base" --`)
- Renderer `--out-dir` as sandbox escape (operator-chosen dir, basename writes)
- Forcing shared `enforceTokenBudget` as a security defect — ADR-005
- Sibling F010 unmarked phase-number collision — tasks.md:35 note
- Sibling claim that research.md.tmpl has no automated render proof — `research-template-gating.vitest.ts`

### Adversarial P1 replay (iter 5)

All six active P1s still hold against the current tree. F002 refined (§5 vs §6 contradiction). F006 refined (vitest locks in basename skip). No downgrades.

### Sources reviewed

Packet: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, decision-record.md, description.json.
Implementation: research.md.tmpl, spec.md.tmpl, template-guide.md, validator-registry.json, check-ac-coverage.sh, check-scope-adherence.sh (+ vitest), memory-search.ts, inline-gate-renderer.ts, scaffold-golden-snapshots.vitest.ts, research-template-gating.vitest.ts, validation-rules.md, feature-catalog spec-validation-rule-engine.md, playbook index.

### Cross-reference appendix

See §7. Core: spec_code partial, checklist_evidence partial. Overlay: skill_agent / agent_cross_runtime notApplicable; feature_catalog_code / playbook_capability partial (F017).
