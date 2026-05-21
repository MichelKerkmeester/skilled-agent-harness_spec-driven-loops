DEEP-REVIEW SYNTHESIS

# Deep-Review Synthesis Phase

## SPEC FOLDER (pre-approved)

This is a synthesis pass for an existing deep-review packet. The review spec folder is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar` (option A: existing). All review-state artifacts already exist under that path's `review/` subdirectory. You are NOT writing to the reviewed code/specs — only to `<spec-folder>/review/*`. Gate 3 is satisfied by this pre-approved option-A pointer. Do not ask any spec-folder question.

The `<review-packet>` token used below resolves to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review`

So concretely:
- `<review-packet>/review-report.md` = `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/review-report.md`
- `<review-packet>/resource-map.md` = `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/resource-map.md`
- `<review-packet>/deep-review-state.jsonl` = `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/deep-review-state.jsonl`
- `<review-packet>/deep-review-config.json` = `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/deep-review-config.json`
- `<review-packet>/deep-review-findings-registry.json` = `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/deep-review-findings-registry.json`
- `<review-packet>/iterations/iteration-NNN.md` = `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/iterations/iteration-NNN.md`

## STATE

CONVERGENCE REACHED at iteration 6.

Final findings:
- P0=0 P1=2 P2=8 (after iter-006 downgrade of DR-003-P1-001 + DR-003-P1-002 to P2 advisories under solo-Mac deployment context)

Active P1 findings (release-blocking):
1. DR-002-P1-001: PROMOTE default does not reach runtime dispatch (`reranker.py:24` vs `config.py:770`)
2. DR-002-P1-002: CocoIndex MCP auto-ensure is gated by spec-memory's opt-in flag (`cli.py:151-155` + `ensure_rerank_sidecar.py:85-96`)

Active P2 findings (advisory):
3. DR-002-P2-001: REQ-006 wording vs D-004 (spec wants removal; D-004 keeps fallback class)
4. DR-003-P2-001: sidecar child inherits full env (advisory hardening)
5. DR-003-P2-002 (downgraded from P1-001): localhost sidecar lacks identity/auth (solo-Mac advisory)
6. DR-003-P2-003 (downgraded from P1-002): /rerank lacks payload bounds (solo-Mac advisory)
7. DR-004-P2-001: task ledger drift (T001-T025 unchecked vs implementation-summary shipped claim)
8. DR-004-P2-002: system-rerank-sidecar SKILL.md stale CocoIndex text
9. DR-005-P2-001: httpx is hidden mcp-coco-index dependency
10. DR-005-P2-002: sidecar catalog/playbook diverge from sk-doc split package

Verdict: CONDITIONAL (P1 findings present, blockers for PROMOTE default claim).
hasAdvisories: N/A (verdict not PASS).

## ASSIGNED FOCUS — SYNTHESIS

Generate the 9-section deep-review report at `<review-packet>/review-report.md` per the deep-review skill contract.

Read first:
- All iterations: review/iterations/iteration-001.md through iteration-006.md
- Strategy: review/deep-review-strategy.md
- Findings registry: review/deep-review-findings-registry.json
- State log: review/deep-review-state.jsonl

## OUTPUT CONTRACT

Produce these artifacts:

### 1. `<review-packet>/review-report.md`

9 required sections:

**1. Executive Summary**
- Overall verdict: CONDITIONAL
- hasAdvisories: N/A (P1 present, not PASS)
- P0/P1/P2 counts: 0 / 2 / 8
- Review scope summary: PROMOTE packet (commit c0941055f) + docs commit (131838c96)
- Total iterations: 6, convergence: CONVERGED at iter-6

**2. Planning Trigger**
- State that `/spec_kit:plan [remediation]` IS REQUIRED.
- Include a fenced ```json``` block labeled "Planning Packet" with required fields:
  - `triggered: true`
  - `verdict: "CONDITIONAL"`
  - `hasAdvisories: false`
  - `activeFindings`: array of all 10 findings with {id, severity, title, file, evidenceRefs, dimensions, findingClass}
  - `remediationWorkstreams`: ordered groups (P1 first, then P2 by theme)
  - `specSeed`: bullets for follow-on spec updates
  - `planSeed`: starter tasks for `/spec_kit:plan`
  - `findingClasses`: distinct classes (`cross-consumer`, `matrix/evidence`, `instance-only`)
  - `affectedSurfacesSeed`: list of (file -> remediation surface) mappings
  - `fixCompletenessRequired: true` (security-sensitive — DR-003 family)

**3. Active Finding Registry**
- Unified table for all 10 active findings.
- Columns: ID | Severity | Title | Dimension | File:Line | Evidence | Impact | Fix Recommendation | Disposition | FindingClass | ScopeProof | AffectedSurfaceHints

**4. Remediation Workstreams**
- WS-1 (P1 — runtime dispatch): fix `_rerank_via_sidecar_enabled()` to consume `Config.rerank_via_sidecar`, OR revert the PROMOTE/default doc claims. Update test_dispatch_off_by_default accordingly.
- WS-2 (P1 — launcher ensure): pass `skip_if_disabled=False` in `cli.py::_ensure_rerank_sidecar_for_mcp()`, OR refactor the helper gate to consider both `SPECKIT_CROSS_ENCODER` and `COCOINDEX_RERANK_VIA_SIDECAR`.
- WS-3 (P2 — spec wording): rewrite REQ-006/SC-005 to require no eager bundled load on default path while preserving lazy fallback class.
- WS-4 (P2 — task ledger): mark T001-T025 with shipped evidence and links, OR add note that ledger superseded by implementation-summary.
- WS-5 (P2 — sk-doc compliance): split sidecar catalog/playbook into per-feature files OR document a lightweight-skill exception. Remove mutable packet-history wording from evergreen claims.
- WS-6 (P2 — dependency): add `httpx` to mcp-coco-index pyproject.toml as direct dependency.
- WS-7 (P2 — security advisories): document the unauthenticated-localhost + unbounded-payload contracts in feature_catalog.md/manual_testing_playbook.md as accepted-under-solo-Mac caveats; consider local credential gate as future packet.
- WS-8 (P2 — env inheritance): tighten child-env allowlist in ensure_rerank_sidecar.py (exclude OPENAI/VOYAGE/SLACK/etc keys).
- WS-9 (P2 — stale skill text): update system-rerank-sidecar/SKILL.md:167-170 to reflect current CocoIndex consumer state.

**5. Spec Seed**
- Bullet seeds for `/spec_kit:plan` to ingest.
- Cover: dispatch fix, launcher fix, spec wording correction, sk-doc compliance, security caveats documentation.

**6. Plan Seed**
- Concrete starter tasks per workstream. ~9-15 tasks total.

**7. Traceability Status**
- Per protocol: spec_code (fail), checklist_evidence (fail), skill_agent (fail), agent_cross_runtime (notApplicable), feature_catalog_code (fail), playbook_capability (fail).
- Evidence: cite the iter-004 traceability gate results.

**8. Deferred Items**
- Items that don't block the verdict:
  - n=3 confirmation benchmark (per implementation-summary.md:141)
  - 30/73 → 15/73 baseline drift investigation (packet 007)
  - Sidecar identity/auth + payload bounds promotion to multi-user deployment (if ever supported)

**9. Audit Appendix**
- Convergence summary: 6 iterations, converged at iter-6 (newFindingsRatio=0 after stabilization, all 4 dimensions covered, gates pass)
- Coverage summary: 13 review-scope files + supporting files (cli.py, ensure_rerank_sidecar.py, rerank_sidecar.py, start.sh, sidecar tests, sk-doc templates) all read
- Ruled-out claims: any (none significant)
- Sources reviewed: 6 iteration narratives, 6 delta files, full state log
- Cross-reference appendix split into Core (spec_code, checklist_evidence) and Overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability)

### 2. `<review-packet>/resource-map.md`

Resource map per the deep-review skill: enumerate the touched/expected/absent paths from the review-scope set. Include:
- All 13 review-scope files
- Supporting files actually read across iterations: cli.py, ensure_rerank_sidecar.py, rerank_sidecar.py, start.sh, test_rerank_sidecar.py, sk-doc templates, observability.py, ensure-rerank-sidecar.cjs, cross-encoder.ts, pyproject.toml, arc parent spec/graph-metadata, review_core.md
- Resource map source: applied/T-*.md NOT present (no applied evidence exists for packet 006 since the implementation was already shipped before review)

### 3. Append final state event to `<review-packet>/deep-review-state.jsonl`

Final event:
```json
{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":6,"activeP0":0,"activeP1":2,"activeP2":8,"dimensionCoverage":1.0,"verdict":"CONDITIONAL","releaseReadinessState":"release-blocking","stopReason":"converged","timestamp":"<ISO-8601>"}
```

Append a second event for config status:
```json
{"type":"event","event":"config_status_changed","newStatus":"complete","timestamp":"<ISO-8601>"}
```

Also mutate config:
- Open `<review-packet>/deep-review-config.json` and set `status` field to `"complete"` and `releaseReadinessState` to `"release-blocking"`.

### 4. Final findings-registry.json update

Update `<review-packet>/deep-review-findings-registry.json`:
- `openFindings`: array of all 10 findings (full structured records with id, severity, title, file, evidenceRefs, dimension, findingClass, status='active' or 'downgraded')
- `dimensionCoverage`: all four set to true
- `findingsBySeverity`: P0=0 P1=2 P2=8
- `openFindingsCount`: 10
- `convergenceScore`: 1.0

## CONSTRAINTS

- LEAF agent. Target 15 tool calls, soft max 22, hard max 28 (synthesis is heavier than per-iter).
- Read-only against reviewed source/tests/docs/specs.
- BANNED: rm, mv, sed -i, git, modifications to reviewed paths.
- ALLOWED writes: only inside `<review-packet>/` (review-report.md, resource-map.md, deep-review-state.jsonl, deep-review-config.json, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md).

No `Review verdict:` line is required in the synthesis output (this is not an iteration).

## VERDICT REMINDER

Final verdict: CONDITIONAL. The two P1 findings (PROMOTE default dispatch + launcher ensure) are required-fix before the PROMOTE claim is true. All 8 P2 items are advisory but worth tracking via /spec_kit:plan as a remediation packet.
