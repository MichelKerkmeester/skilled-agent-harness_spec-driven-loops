---
title: "Changelog: Drift Remediation [000-release-cleanup/013-drift-remediation]"
description: "Chronological changelog for the post-release drift-audit remediation phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "drift remediation"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-27

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup/013-drift-remediation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup`

### Summary

A 50-iteration, multi-model drift audit of packet 028 converged 175 findings (6 P0, 91 P1, 78 P2) — each an LLM hypothesis with file:line evidence. This phase remediated and verified every one under a two-role contract: gpt-5.5-fast high implemented the fixes, and opus did both pre-fix triage (read the cited file, mark REAL or FALSE-POSITIVE) and post-fix verification (git-diff + re-read the real file; never trust the implementer's self-report). The remediation ledger (`remediation-ledger.jsonl`) reached 100% terminal: **131 fixed-verified + 44 false-positive**. No regressions — a captured baseline showed the one failing test (a gate-3 classifier case referencing the renamed `/deep:start-research-loop`) was pre-existing from the deep-loop merge, not introduced here.

### Changed

- **P0s (phase 001):** the read-only doctor routes dropped meaningless mutation flags; the causal-graph DB-path inversion and the codex model pins were corrected.
- **Stale DB + tool counts (phase 002):** the retired per-profile `context-index__*.sqlite` names canonicalized to `context-index.sqlite`; tool counts corrected to spec-memory 39, skill-advisor 9, code-index 8.
- **opencode-go + codex pins (phase 003):** the removed opencode-go gateway purged from its last straggler (the matrix adapter `DEFAULT_MODEL`, fixed at the adapter not just its test); all 13 codex agents on gpt-5.5.
- **Tool grants (phase 004):** agent MCP grants reconciled across .claude/.opencode/.codex (opencode via the `permission:` block, not `mcpServers:`); command allowed-tools squared with workflow needs; the markdown agent body re-synced.
- **Spec housekeeping (phase 005):** graph-metadata `key_files`/`entities` paths normalized to the repo-relative invariant; `migrated` flags added to the lean phase parents; all phase parents set to `level: phase`; stale "Pending" child checklists closed.
- **Remaining P1/P2 (phase 006):** undocumented env vars added to ENV_REFERENCE (`MEMORY_ALLOWED_PATHS`, `MEMORY_BASE_PATH`, `MEMORY_DB_PATH`, the MCP_* preflight + session vars); the `_V1` flag names corrected to their graduated forms; search-flags JSDoc, gate-3 RESUME_TRIGGERS, memory commands, schema-version and tool-count docs reconciled; the routing-registry drift-guard CI now triggers on push-to-main and self-edits.
- **Changelog reconciliation:** the 007 changelogs' "bitemporal pending" notes resolved against the 011 follow-up that wired the writer; the v3.7 retrieval-shape claim clarified (classifier on for everyone, routing opt-in behind `SPECKIT_RETRIEVAL_CLASS_ROUTING`).

### False-Positives

44 findings were confirmed false-positive with evidence — generic test-fixture model ids in the frozen deep-loop runtime, historically-accurate changelogs, hallucinated references, by-design states (review-record packets waive docs; before-vs-after is an intentional cross-cutting doc), advisor/code-graph maintenance tools that are correctly not command-exposed, and the lean-trio migration of the completed 005 packet (cosmetic + the generators do not reconcile a migrated populated parent; its level metadata was corrected instead).

### Notes

This packet was relocated from `028/008-drift-remediation` to `028/000-release-cleanup/013-drift-remediation` so the drift remediation sits with the release-cleanup track. The remediation ledger is the per-finding source of truth.
