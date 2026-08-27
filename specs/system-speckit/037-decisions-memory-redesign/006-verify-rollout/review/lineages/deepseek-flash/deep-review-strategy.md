# Deep Review Strategy - Session Tracking

## 2. TOPIC
Deep review of spec folder `specs/system-speckit/037-decisions-memory-redesign/006-verify-rollout` (phase 6 of packet 037): verify the EXECUTED constitutional-memory deprecation rollout — search plumbing, tier config, learned-triggers, command, root docs, advisor. Audit completeness: missed references, stray surfacing paths, dead enum/tier literals, broken fetch/cache/injection removals, evidence for REQ-001..005, packet hygiene. Target scope: `goal-file-manifest.txt` (41 paths, WORKSTREAM A).

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness (iterations 1-3: search core, handlers/hooks, server layer)
- [x] D2 Security (iteration 4)
- [x] D3 Traceability (iterations 5-6: spec_code, checklist_evidence, feature_catalog_code, playbook_capability)
- [x] D4 Maintainability (iterations 7-8: tests, eval, literals, docs census)
- [x] Final sweep + adversarial replay (iteration 10)
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- No fixes/implementation; observation-only.
- No test-suite execution or repo tooling (leaf lineage write surface).
- No audit beyond manifest scope + packet specs + immediate cross-references.
- No worktree/barter copies.

---

## 5. STOP CONDITIONS
- maxIterations (10) — stop policy is max-iterations; convergence before that is telemetry only.
- 3+ consecutive timeouts or state corruption (escalate).

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness (search core) | CONDITIONAL | 1 | Deprecation core correct (tier removed, scans stopped); F001: learned-triggers not flagged off; F002/F003 debt |
| D1 Correctness (handlers/hooks) | PASS | 2 | Handler/hook/API layer fully clean of constitutional; save/update paths do not touch learned-triggers |
| D1 Correctness (server layer) | PASS | 3 | CLI/context-server/API/schema clean; tier enum 6 values; strict allow-list excludes deprecated option |
| D2 Security | PASS | 4 | Path allow-list + canonical resolution; bulk-delete confirm gate; tenant filters; strict schema default; F004 P2 hardening |
| D3 Traceability (spec_code) | CONDITIONAL | 5 | Census verified: most DONE; F005 folder deletion not executed (8 files remain, 18 root links); F006 advisor keyword stale; F007 REQ-005 stale |
| D3 Traceability (overlays + hygiene) | CONDITIONAL | 6 | F008 catalog false claims (P1); F009 stale playbooks; F010 scaffold residue; F011 manifest gap; F007 upgraded P1 |
| D4 Maintainability | CONDITIONAL | 7-8 | F012 inert branches; F013 render.ts docstring; F002 refined; tests/fixtures mostly healthy |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 4 active (F001, F005, F007, F008)
- **P2 (Minor):** 2 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2 (iteration 10: replay only)
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Repo-root-relative grep sweeps with per-dir scoping; negative-evidence capture (zero matches = confirmed check).
- Checking tsconfig exclude for tests → explained why stale includeConstitutional params don't break typecheck. (iteration 1)

---

## 9. WHAT FAILED
- Relative-path recon from specs/ dir misread .opencode paths (corrected; recorded as process lesson). (recon)

---

## 10. EXHAUSTED APPROACHES (do not retry)
[None yet]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS
- DECISIONS.md-missing as standalone P0: phase 002 reversed the DECISIONS.md surface; absence is design-consistent, but 006 REQ-005 staleness remains a finding to confirm. (recon)
- "includeConstitutional still honored in production": ruled out — no production refs; removed from SearchArgs + schema. (iteration 1)
- "Prime SQL still scans constitutional": ruled out — memory-surface.ts has zero refs. (iteration 1)

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
SYNTHESIS COMPLETE (iteration 10) — verdict CONDITIONAL (P0:0, P1:4, P2:9); report at review-report.md; stop reason maxIterationsReached. Next action: /speckit:plan remediation per report lanes.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
### Bounded Context Snapshot
- Target pointers: 41 manifest files; packet specs 002-006; root docs; constitutional/ dir state (PRESENT, 23 md files, Aug 26 22:15 — check 004 rehome semantics in iteration 5-6).
- Behavior claims: 003 REQ-001..005; 004 REQ-001..004; 006 REQ-001..005.
- Reuse/conventions: severity contract; file:line evidence; typed adjudication packets.
- Risks/gaps: no live test execution; graph unavailable; manifest may miss files (memory-search.ts, learned-feedback.ts, memory-learned-maintenance.ts already found missing from manifest).
- resource-map.md not present. Skipping coverage gate.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 5 | 003 REQ-001/002 pass; 004 REQ-003 fail (F005); 006 REQ-003 wording unsatisfiable; REQ-004/005 live-suite pending |
| `checklist_evidence` | core | notApplicable | 6 | No checklist.md (Level 1); tasks.md template residue (F010) |
| `skill_agent` | overlay | notApplicable | - | spec-folder target |
| `agent_cross_runtime` | overlay | notApplicable | - | spec-folder target |
| `feature_catalog_code` | overlay | fail | 6 | 17 constitutional refs; false removed-behavior claims (F008) |
| `playbook_capability` | overlay | partial | 6 | 8 playbooks with removed behavior (F009) |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Status legend: pending | reviewed | findings. Grouped from goal-file-manifest.txt (41 paths) + discovered extras.

| Area | File | Dimensions | Last Iter | Findings | Status |
|------|------|-----------|-----------|----------|--------|
| search lib | mcp-server/lib/search/vector-index-store.ts | D1 | 2 | none | reviewed |
| search lib | mcp-server/lib/search/pipeline/stage1-candidate-gen.ts | D1 | 1 | none | reviewed |
| search lib | mcp-server/lib/search/vector-index-queries.ts | D1 | 2 | none | reviewed |
| search lib | mcp-server/lib/search/vector-index-mutations.ts | D1 | 2 | none | reviewed |
| search lib | mcp-server/lib/search/graph-search-fn.ts | D1 | 2 | none | reviewed |
| search lib+ | mcp-server/lib/search/learned-feedback.ts [EXTRA] | D1 | 1 | F001 | reviewed |
| search lib+ | mcp-server/lib/search/pipeline/stage2-fusion.ts [EXTRA] | D1 | 1 | F001 | reviewed |
| scoring | mcp-server/lib/scoring/importance-tiers.ts | D1 | 1 | none | reviewed |
| eval | mcp-server/lib/eval/eval-metrics.ts | - | - | - | pending |
| storage | mcp-server/lib/storage/post-insert-metadata.ts | D1 | 2 | none | reviewed |
| hooks | mcp-server/hooks/memory-surface.ts | D1 | 1 | none | reviewed |
| hooks | mcp-server/hooks/claude/compact-inject.ts | D1 | 2 | none | reviewed |
| handlers | mcp-server/handlers/memory-index.ts | D1 | 1 | none | reviewed |
| handlers | mcp-server/handlers/memory-search.ts [EXTRA] | D1 | 1 | F002 | reviewed |
| handlers | mcp-server/handlers/memory-save.ts | D1 | 2 | none | reviewed |
| handlers | mcp-server/handlers/memory-crud-update.ts | D1 | 2 | none | reviewed |
| handlers | mcp-server/handlers/memory-index-discovery.ts | D1 | 2 | none | reviewed |
| handlers | mcp-server/handlers/memory-bulk-delete.ts | D1 | 2 | none | reviewed |
| server | mcp-server/cli.ts | D1 | 3 | none | reviewed |
| server | mcp-server/context-server.ts | D1 | 3 | none | reviewed |
| server | mcp-server/api/index.ts | D1 | 3 | none | reviewed |
| server | mcp-server/api/indexing.ts | D1 | 2 | none | reviewed |
| tools | mcp-server/tool-schemas.ts | D1 | 1 | F002 | reviewed |
| tools | mcp-server/schemas/tool-input-schemas.ts | D1 | 3 | none | reviewed |
| tools | mcp-server/tools/types.ts | D1 | 3 | none | reviewed |
| tests | mcp-server/tests/vector-index-store-remediation.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/memory-save-index-scope.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/vector-index-store.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/eval-metrics.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/scoring-gaps.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/checkpoint-restore-invariant-enforcement.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/full-spec-doc-indexing.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/degree-computation.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/dual-scope-hooks.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/tiered-injection-turnNumber.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/scoring.vitest.ts | - | - | - | pending |
| tests | mcp-server/tests/decay.vitest.ts | - | - | - | pending |
| docs | system-spec-kit/constitutional/README.md | - | - | - | pending |
| docs | system-spec-kit/constitutional/memory-system-spec-kit-only.md | - | - | - | pending |
| docs | system-spec-kit/SKILL.md | - | - | - | pending |
| specs | 002-active-decisions-design/spec.md | - | - | - | pending |
| specs | 003-deprecation-mechanics/spec.md | - | - | - | pending |
| specs | 004-rehome-rules-content/spec.md | - | - | - | pending |
| specs | 005-advisor-integration/spec.md | - | - | - | pending |
| specs | 006-verify-rollout/spec.md | - | - | - | pending |
| research | 004-rehome-rules-content/research/research.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10 | Convergence threshold: 0.10 | Rolling STOP: 0.08 | No-progress: 0.05 | Stabilization passes: 1
- Session lineage: sessionId=fanout-deepseek-flash-1787807016319-a8sfw4, parentSessionId=null, generation=1, lineageMode=new
- Severity threshold: P2 | Target type: spec-folder
- Cross-reference: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Per-iteration budget: 12 tool calls, 20 minutes
- Started: 2026-08-27T07:05:00Z
<!-- MACHINE-OWNED: END -->
