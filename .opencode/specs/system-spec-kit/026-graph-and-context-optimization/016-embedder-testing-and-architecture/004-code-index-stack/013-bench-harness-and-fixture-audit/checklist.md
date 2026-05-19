---
title: "Verification Checklist: 016/004/013 Bench Harness Hardening + Fixture Audit"
description: "Level 2 verification checklist with evidence for harness hardening, fixture audit, corrected re-bench, documentation, and strict validation."
trigger_phrases: ["016/004/013 checklist", "bench harness verification"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit"
    last_updated_at: "2026-05-19T10:30:44Z"
    last_updated_by: "codex"
    recent_action: "Completed verification checklist"
    next_safe_action: "Strict validate packet"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004013"
      session_id: "016-004-013-checklist"
      parent_session_id: "016-004-013"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: 016/004/013 Bench Harness Hardening + Fixture Audit

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| P0 | Hard blocker | Cannot claim complete until passing |
| P1 | Required | Must pass or be explicitly documented |
| P2 | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec and requirements read before edits.
  - **Evidence**: `spec.md` §3-4 drove R1-R10 implementation.
- [x] CHK-002 [P0] Target files read before edits.
  - **Evidence**: both harness scripts, baseline fixture, README, ADR target, settings files, and current Phase 2 artifacts were read.
- [x] CHK-003 [P1] Sequential-thinking request handled honestly.
  - **Evidence**: three MCP calls returned `user cancelled MCP tool call`; implementation proceeded with visible planning and recorded limitation.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both harness scripts pass shell syntax checks.
  - **Evidence**: `bash -n run-phase2-smoke.sh` and `bash -n run-extended-bake-off-with-hybrid-rerank.sh` exit 0.
- [x] CHK-011 [P0] Output schema preserved.
  - **Evidence**: JSONL rows still emit the same keys; `OUTPUT_TAG` only changes file names.
- [x] CHK-012 [P1] Path extraction handles wrappers and filters mock literals.
  - **Evidence**: `scratch/test_path_extraction.py` covers backticks, import/require/from, quotes, line ranges, missing paths, empty output, dedupe, and existing non-mirror paths.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Pytest coverage passes.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest .../scratch/test_path_extraction.py -q` returned `14 passed`.
- [x] CHK-021 [P0] Fixture JSON is valid.
  - **Evidence**: `python -m json.tool` passed for audited and corrected fixture files.
- [x] CHK-022 [P0] Corrected re-bench completed.
  - **Evidence**: `phase2-comparison-corrected.md` reports `14/18` for baseline-bge, bge-path-class, and jina-v3.
- [x] CHK-023 [P1] Delta artifact explains measurement changes.
  - **Evidence**: `phase2-comparison-baseline-vs-corrected-delta.md` classifies harness, fixture, and residual regression cases.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned.
  - **Evidence**: Parser defect is `class-of-bug`; probe 10 fixture defect is `matrix/evidence`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed.
  - **Evidence**: Same helper pattern found in the Phase 2 and extended bake-off harnesses; both were patched.
- [x] CHK-FIX-003 [P0] Consumer inventory completed.
  - **Evidence**: JSONL row keys, summary Markdown, README, ADR, and corrected fixtures were reviewed.
- [x] CHK-FIX-004 [P0] Parser fix has adversarial tests.
  - **Evidence**: pytest covers backticks, import/require/from wrappers, quotes, line ranges, missing paths, empty output, dedupe, mirror-prefix paths, and existing non-mirror paths.
- [x] CHK-FIX-005 [P1] Matrix axes listed.
  - **Evidence**: Axis 1 is wrapper/malformed path shape; axis 2 is mirror-prefix versus filesystem existence; axis 3 is fixture indexed/excluded/missing status.
- [x] CHK-FIX-006 [P1] Hostile global-state variant considered.
  - **Evidence**: non-mirror path existence test changes cwd with `monkeypatch.chdir(tmp_path)`.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit artifacts.
  - **Evidence**: corrected JSONL, comparison, delta, and fixture audit files are committed as packet artifacts.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials added.
  - **Evidence**: changes are local scripts/docs/fixtures only.
- [x] CHK-031 [P1] Live DB accessed read-only.
  - **Evidence**: audit opened `.cocoindex_code/target_sqlite.db` with `mode=ro` and did not run `ccc reset` or `ccc index`.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] README updated with corrected fixture usage.
  - **Evidence**: `phase2-bench/README.md` documents corrected artifacts and re-run command.
- [x] CHK-041 [P0] ADR appended.
  - **Evidence**: ADR-016 appended to `004-spec-memory-embedder-bake-off/decision-record.md`.
- [x] CHK-042 [P0] Spec docs synchronized.
  - **Evidence**: `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` exist.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Generated audit artifacts live in scoped packet or phase2-bench folders.
  - **Evidence**: `evidence/fixture-audit-summary.md`, corrected fixture files, corrected comparison, and delta are under allowed scope.
- [x] CHK-051 [P1] Historical artifacts preserved.
  - **Evidence**: original `phase2-comparison.md` remains; corrected outputs use suffixes.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 12 | 12/12 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-19
**Verified By**: Codex
<!-- /ANCHOR:summary -->
