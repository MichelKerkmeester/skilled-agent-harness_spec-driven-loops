DEEP-REVIEW

# Deep-Review Iteration 4 — Traceability Pass

## STATE

STATE SUMMARY (auto-generated):
Iteration: 4 of 20
Dimension: traceability
Prior Findings: P0=0 P1=4 P2=2
  P1-001 (iter-002) PROMOTE default doesn't reach runtime
  P1-002 (iter-002) cocoindex MCP doesn't auto-spawn sidecar (skip_if_disabled gate)
  P1-003 (iter-003) localhost sidecar lacks identity/auth — same-host spoof
  P1-004 (iter-003) /rerank lacks payload bounds — same-host DoS
  P2-001 (iter-002) REQ-006 wording vs D-004
  P2-002 (iter-003) sidecar child inherits full env
Dimension Coverage: [inventory, correctness, security] (2/4)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Last 2 ratios: 1.0 (iter-002) -> compute_from_iter3
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 4 of 20
Mode: review
Dimension: traceability
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar
Prior Findings: P0=0 P1=4 P2=2

## PRIOR CONTEXT

Read these first:

- Strategy: .opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/review/deep-review-strategy.md
- Iteration narratives: review/iterations/iteration-001.md (inventory), iteration-002.md (correctness, 3 findings), iteration-003.md (security, 3 findings)
- Findings registry: review/deep-review-findings-registry.json
- State log: review/deep-review-state.jsonl

## SCOPE REMINDER

Two commits shipped:
1. `c0941055f` feat(016/008/006): cocoindex dedup via shared sidecar — PROMOTE
2. `131838c96` docs(system-rerank-sidecar): feature catalog + manual testing playbook

Files under review: see config.reviewScopeFiles or strategy §15.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS + GATES

Dimensions: correctness, security, traceability, maintainability.
Quality gates: evidence (file:line), scope (within review_scope_files), coverage (all dimensions touched before STOP).
Verdicts: FAIL (any P0) | CONDITIONAL (any P1, no P0) | PASS (no P0/P1; hasAdvisories=true if active P2 exist).

## CLAIM ADJUDICATION (mandatory for new P0/P1)

Every NEW P0/P1 finding must include in the iteration narrative:
- claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger

## ASSIGNED FOCUS — TRACEABILITY PASS

Run all 6 cross-reference protocols as binary gates. For each, report status (pass | partial | fail | blocked | notApplicable), evidence (file:line), and impact.

### Core Protocols (mandatory)

1. **`spec_code`** — map every REQ-NNN in spec.md §4 to actual implementation/test evidence:
   - REQ-001 (HttpSidecarRerankerAdapter dispatch) → reranker.py
   - REQ-002 (HTTP failures fall back to bundled) → reranker.py + test_http_sidecar_adapter.py
   - REQ-003 (sigmoid scores flow through unchanged) → reranker.py + test
   - REQ-004 (A/B benchmark with 5 files) → benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/
   - REQ-005 (decision rule applied) → benchmark_report.md §8
   - REQ-006 (bundled CrossEncoder REMOVED on PROMOTE) → reranker.py grep — note P2-001 wording drift
   - REQ-007 (SKILL.md + INSTALL_GUIDE.md docs) → grep COCOINDEX_RERANK_VIA_SIDECAR
   - REQ-008 (arc parent updated for phase 006) → arc 008 spec.md + graph-metadata.json
   - REQ-009 (strict-validate both packets exit 0/0) → validation evidence
   - REQ-010 (cocoindex auto-spawns sidecar at MCP startup) → cli.py + ensure_rerank_sidecar.py — note P1-002 gate

   Gate fails if any REQ-NNN lacks implementation or implementation contradicts the requirement.

2. **`checklist_evidence`** — tasks.md T001-T025 are all unchecked while implementation-summary.md claims shipped. Decide:
   - Acceptable Level 1 packet drift, or
   - Completion-evidence mismatch (P1/P2)
   Check tasks.md evidence column — does it cite shipped artifact or stay (pending)?

### Overlay Protocols

3. **`skill_agent`** — mcp-coco-index SKILL.md vs reranker dispatch + system-rerank-sidecar SKILL.md vs catalog/playbook claims:
   - mcp-coco-index SKILL.md:29 default dispatch claim — linked to P1-001
   - system-rerank-sidecar SKILL.md:167-170 "CocoIndex repointing is future work" vs catalog/playbook claims cocoindex is current default consumer

4. **`agent_cross_runtime`** — N/A; no new agents shipped.

5. **`feature_catalog_code`** — every section of feature_catalog.md maps to scripts/lib:
   - §2 endpoint contracts → rerank_sidecar.py (FastAPI routes)
   - §3 startup → rerank_sidecar.py + start.sh + .env.example
   - §4 process lifecycle → rerank_sidecar.py + start.sh
   - §5 score model → rerank_sidecar.py sigmoid scoring
   - §6 caching → rerank_sidecar.py + ensure_rerank_sidecar.py
   - §7 launcher integration → ensure_rerank_sidecar.py + cli.py + ensure-rerank-sidecar.cjs
   - §8 env config → rerank_sidecar.py + config.py + cross-encoder.ts
   - §9 observability → rerank_sidecar.py + observability.py
   - §10 consumers → reranker.py + cross-encoder.ts
   Gate fails when a catalog claim has no implementation, or implementation has no catalog entry.

6. **`playbook_capability`** — every RS-NNN scenario should be executable against actual capability:
   - RS-001..RS-005 → rerank_sidecar.py + tests/test_rerank_sidecar.py
   - RS-006..RS-008 → Node ensure helper + cross-encoder.ts
   - RS-009..RS-011 → cli.py + reranker.py + test_http_sidecar_adapter.py
   - RS-012..RS-013 → both ensure helpers + reranker.py fallback
   - RS-014..RS-016 → rerank_sidecar.py + start.sh
   - RS-017..RS-020 → rerank_sidecar.py + start.sh + reranker.py
   - RS-021..RS-023 → start.sh + .env.example + rerank_sidecar.py + ensure_rerank_sidecar.py
   Gate fails when an RS-NNN scenario has no executable command path or assumes capabilities that don't exist.

Score each gate as pass | partial | fail | blocked. Report gating failures explicitly.

For findings:
- Doc claim not backed by code → P1 if functional impact, P2 if doc-only drift
- Code change with no doc update → P2
- Missing test for a stated capability → P1 or P2 depending on risk

## OUTPUT CONTRACT

Same as prior iterations. Three artifacts:

1. `<review-packet>/iterations/iteration-004.md` with final line `Review verdict: PASS|CONDITIONAL|FAIL|PENDING`.
2. Append `"type":"iteration"` record to `<review-packet>/deep-review-state.jsonl`.
3. `<review-packet>/deltas/iter-004.jsonl` with at least one iteration record + one finding record per new finding.

After completing:
- Update strategy.md (§6 mark traceability if complete, §7 findings, §12 NEXT FOCUS = maintainability, §14/15 status)
- Update findings-registry.json

## CONSTRAINTS

- LEAF agent. Target 12 tool calls, soft max 18, hard max 24.
- Read-only against reviewed source/tests/docs/specs.
- BANNED: rm, mv, sed -i, git, modifications to reviewed paths.
- ALLOWED writes: only inside `<review-packet>/`.
- newFindingsRatio: severity-weighted P0=10, P1=5, P2=1. If any new P0 → ratio = max(calc, 0.50). If 0 findings → 0.0.
