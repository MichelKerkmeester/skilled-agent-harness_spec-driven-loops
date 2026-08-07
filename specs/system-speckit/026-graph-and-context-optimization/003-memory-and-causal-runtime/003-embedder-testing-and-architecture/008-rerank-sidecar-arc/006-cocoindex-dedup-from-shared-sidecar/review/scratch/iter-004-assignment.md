## ASSIGNED FOCUS — TRACEABILITY PASS

Run all 6 cross-reference protocols as binary gates. For each, report status (pass | partial | fail | blocked | notApplicable), evidence (file:line), and impact.

### Core Protocols (mandatory)

1. **`spec_code`** — map every REQ-NNN in spec.md §4 to actual implementation/test evidence:
   - REQ-001 (HttpSidecarRerankerAdapter dispatch) → reranker.py
   - REQ-002 (HTTP failures fall back to bundled) → reranker.py + test_http_sidecar_adapter.py
   - REQ-003 (sigmoid scores flow through unchanged) → reranker.py + test
   - REQ-004 (A/B benchmark with 5 files) → benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/
   - REQ-005 (decision rule applied) → benchmark_report.md §8
   - REQ-006 (bundled CrossEncoder REMOVED on PROMOTE) → reranker.py grep — note P2-001 already flagged the wording drift
   - REQ-007 (SKILL.md + INSTALL_GUIDE.md docs) → grep for COCOINDEX_RERANK_VIA_SIDECAR
   - REQ-008 (arc parent updated for phase 006) → arc 008 spec.md + graph-metadata.json
   - REQ-009 (strict-validate both packets exit 0/0) → validation evidence
   - REQ-010 (cocoindex auto-spawns sidecar at MCP startup) → cli.py + ensure_rerank_sidecar.py — note P1-002 already flagged the gate

   Gate fails if any REQ-NNN lacks implementation, or implementation contradicts the requirement.

2. **`checklist_evidence`** — tasks.md T001-T025 are all unchecked while implementation-summary.md claims shipped. Decide:
   - Acceptable Level 1 packet drift, or
   - Completion-evidence mismatch (P1/P2 finding)
   Check `tasks.md` evidence column for each task — does it cite the shipped artifact or stay as `(pending)`?

### Overlay Protocols (applicable when there's substantive coverage)

3. **`skill_agent`** — mcp-coco-index SKILL.md vs reranker dispatch + system-rerank-sidecar SKILL.md vs catalog/playbook claims:
   - mcp-coco-index SKILL.md:29 default dispatch claim — already linked to P1-001
   - system-rerank-sidecar SKILL.md:167-170 "CocoIndex repointing is future work" vs catalog/playbook claims that cocoindex is current default consumer — note PV-003 from inventory

4. **`agent_cross_runtime`** — N/A; no new agents shipped.

5. **`feature_catalog_code`** — every section of feature_catalog.md should map to scripts/lib code:
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

6. **`playbook_capability`** — every RS-NNN scenario in manual_testing_playbook.md should be executable against actual command/test capability:
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
- Doc claim not backed by code → P1 if functional impact (e.g. P1-001-style), P2 if doc-only drift
- Code change with no doc update → P2
- Missing test for a stated capability → P1 or P2 depending on risk
