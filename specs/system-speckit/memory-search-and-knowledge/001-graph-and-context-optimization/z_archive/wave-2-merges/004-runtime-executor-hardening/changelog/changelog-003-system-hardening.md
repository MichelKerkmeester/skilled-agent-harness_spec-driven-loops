---
title: "Runtime Executor Hardening Phase 004/003: System Hardening"
description: "Research-first umbrella coordinating 6 Tier 1 investigations into canonical-save invariants, 015 delta review, NFKC robustness, description.json regen, routing accuracy, and template-validator alignment. 40 findings closed across 6 sub-phases. P0 fixes for missing root spec.md and save-lineage writeback."
trigger_phrases:
  - "phase 004/003 changelog"
  - "system hardening post-consolidation"
  - "019 research umbrella"
  - "canonical save invariants"
  - "NFKC unification hardening"
  - "routing accuracy hardening"
  - "description regen contract"
  - "template validator alignment"
importance_tier: "critical"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-18 to 2026-04-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/004-runtime-executor-hardening` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/004-runtime-executor-hardening`

### Summary

The 2026-04-18 consolidation that shipped 016, 017, and 018 left six high-leverage investigation items unaddressed: three 026 close-out candidates and three system-spec-kit-wide candidates. This phase dispatched them as one research wave (001-initial-research) followed by six implementation sub-phases (002 through 007). All six Tier 1 iterations converged. The research surface produced 40 total findings across 2 P0, 8 P1, 6 P2, 5 validator rules, and 19 residuals. The two P0 fixes (packets 007/008/009/010 missing root `spec.md` and `save_lineage` runtime writeback bug in `workflow.ts`) were closed in sub-phase 002.

### Added

- **Sub-phase 002 (canonical-save-hardening)**: `refreshGraphMetadata()` now accepts `GraphMetadataRefreshOptions`. Canonical-save workflow passes `{ now, saveLineage: 'same_pass' }`, persisting `derived.save_lineage`. Coordination-parent `spec.md` files added for packets 007, 008, 009, 010. Five new canonical-save validator rules: `CANONICAL_SAVE_ROOT_SPEC_REQUIRED`, `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED`, `CANONICAL_SAVE_LINEAGE_REQUIRED`, `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`, `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`.
- **Sub-phase 003 (NFKC unification)**: Canonical Unicode fold utility at `shared/unicode-normalization.ts` with NFKC normalization, hidden-character stripping, combining-mark stripping, high-risk confusable fold table. Instruction contamination and suspicious-prefix detection moved to post-canonicalization paths. Fold table expanded for Greek omicron/rho and adjacent high-risk Greek/Cyrillic role-word lookalikes. Semantic validation for pending compact-prime payloads wired into Claude/Gemini/Copilot session-prime readers. Compact-cache provenance contract metadata with `sanitizerVersion` and runtime fingerprints. Shared adversarial Unicode round-trip corpus RT1-RT10 covering Gate 3, shared provenance, trigger phrases, and hook-state validation.
- **Sub-phase 004 (routing-accuracy)**: Advisor command-surface normalization in `skill_advisor.py` (command-memory-save, command-spec-kit-resume, command-spec-kit-deep-research, command-spec-kit-deep-review normalize to owning skills). Gate 3 routing in `gate-3-classifier.ts` extended with deep-loop write markers. Broader resume/context markers plus narrow mixed-tail write exception plus negation/prompt-only/read-only deep-loop guards. Gate 3 F1 improved from 68.6% to 97.66%. Joint false positives reduced from 22 to 1.
- **Sub-phase 005 (description-regen-contract)**: Dedicated description schema with explicit field classes (canonical-derived, canonical-authored, tracking, known authored optional, reserved-key passthrough). Unified `mergeDescription()` helper routing both schema-valid write lane and 018 R4 schema-error repair lane through same field-level policy. `PerFolderDescription` extended to model preserved authored optional fields directly in live folder-discovery surface. 117/117 targeted vitest pass.
- **Sub-phase 006 (residual-015-backlog)**: Closes 19 residual findings from delta review across 6 clusters. DB boundary hardening (symlink canonicalization). Advisor degraded-state visibility. Resume minimal contract (compact payload). Review graph semantics (separate `coverage_gaps` from `uncovered_questions`). Documentation parity (MCP-code-mode README, folder routing, troubleshooting, env vars). Hygiene (whitespace-only trigger phrase ignore, startup-brief warning).
- **Sub-phase 007 (template-validator-contract)**: Rank 1 registry canonicalization (`validator-registry.json` + `validator-registry.ts`). Rank 2 frontmatter semantics (reject empty title/description/trigger_phrases/importance_tier/contextType). Rank 3 anchor parity (reject duplicate opening anchor IDs). Rank 4 reporting split (`authored_template` vs `operational_runtime`). Rank 5 template repair (`level_3/decision-record.md` stale comment terminator).

### Changed

- `skill_advisor.py` + `skill_advisor_runtime.py` surface malformed source metadata and skipped cache records as degraded health.
- `handlers/session-resume.ts` returns compact minimal payload omitting full memory recovery fields.
- `handlers/coverage-graph/query.ts` separates `coverage_gaps` from `uncovered_questions`. `status.ts` fails closed when scoped signals or momentum cannot be computed.
- `core/config.ts` canonicalizes symlink targets before allowed-root checks. Refreshes exported database path bindings after late environment overrides.
- `save-quality-gate.ts` ignores whitespace-only trigger phrases.
- `hooks/claude/session-prime.ts` emits visible startup-brief warning on brief-path regression.
- `validate.sh` reads all canonical rule names/severities/paths/help from registry via `validator_registry_query()`.

### Fixed

- P0 #1: Packets 007, 008, 009, 010 were missing root `spec.md` files. All four now have root spec docs with non-empty `derived.source_docs` and `save_lineage: "same_pass"`.
- P0 #2: `save_lineage` runtime writeback bug in `workflow.ts`. `refreshGraphMetadata()` now persists `derived.save_lineage` via `GraphMetadataRefreshOptions`.
- Gate 3 F1 improved from 68.6% to 97.66%. Joint false positives reduced from 22 to 1.
- NFKC unification: 91/91 adversarial Unicode tests pass. Fullwidth, zero-width, combining-mark, confusable variants all evaluated after folding.
- Description regen: field-level merge policy prevents overwriting hand-authored fields. 117/117 targeted tests pass across all 28 rich `description.json` files.
- 19 residual 015-backlog findings closed across 6 clusters.

### Verification

- Sub-phase 002: P0 #1 verified by checking all four packets have fresh root `spec.md`. P0 #2 verified by checking `derived.save_lineage === 'same_pass'` in graph-metadata. 026 recursive canonical-save pack passes with 007-010 grandfathering window.
- Sub-phase 003: 91/91 adversarial Unicode tests pass. Full-suite completion intentionally unclaimed (workspace baseline red on unrelated suites).
- Sub-phase 004: Gate 3 F1 97.66%. Advisor accuracy 60.0%. Joint TT 115 / FT 5 / FF 1.
- Sub-phase 005: 117/117 targeted vitest pass. 28 rich `description.json` files verified for field-level merge preservation.
- Sub-phase 006: 6 clusters of 015-delta-review findings closed. Individual proofs per cluster.
- Sub-phase 007: Validator regression passes. Template v2.2 frontmatter + anchor parity enforced.
- All sub-phases: `tsc --noEmit` clean per commit. `validate.sh --strict` clean per sub-phase.

### Files Changed

| File | What changed |
|------|--------------|
| `scripts/core/workflow.ts` | `refreshGraphMetadata` accepts `GraphMetadataRefreshOptions`. `save_lineage` now persists. |
| `mcp_server/lib/code-graph/` (multiple) | Coordination-parent `spec.md` added for packets 007, 008, 009, 010. |
| `shared/unicode-normalization.ts` (NEW) | Canonical NFKC fold utility combining normalization, hidden-character strip, combining-mark strip, confusable fold table. |
| `shared/gate-3-classifier.ts` | Deep-loop write markers, resume/context markers, negation guards added. |
| `skill_advisor.py` + `skill_advisor_runtime.py` | Command-surface normalization, degraded-state visibility. |
| `mcp_server/lib/description/description-schema.ts` (NEW) | Dedicated description schema with explicit field classes. |
| `mcp_server/lib/description/description-merge.ts` (NEW) | Unified `mergeDescription()` helper with field-level policy. |
| `mcp_server/lib/search/folder-discovery.ts` | `PerFolderDescription` extended for preserved authored optional fields. |
| `scripts/lib/validator-registry.json` (NEW) | Rule registry with IDs, aliases, paths, severities. |
| `scripts/lib/validator-registry.ts` (NEW) | Typed loader for rule registry. |
| `scripts/spec/validate.sh` | Reads canonical rules from registry via `validator_registry_query()`. |
| `scripts/spec/rules/check-frontmatter.sh` | Rejects empty frontmatter fields. |
| `scripts/spec/rules/check-anchors.sh` | Rejects duplicate opening anchor IDs. |
| `handlers/session-resume.ts` | Compact minimal payload (omits full memory recovery). |
| `handlers/coverage-graph/query.ts` | Separates `coverage_gaps` from `uncovered_questions`. |
| `core/config.ts` | Symlink canonicalization before allowed-root checks. |

Six sub-phases. Sub-phase 001 (research) dispatched 6 Tier 1 iterations via `cli-codex gpt-5.4 high fast`. Sub-phases 002-007 shipped implementation via `cli-codex gpt-5.4 high fast` in 4 waves.

### Follow-Ups

- **NFKC full-suite completion**: Workspace baseline has unrelated test failures. Targeted adversarial tests pass. Full-suite claim intentionally unclaimed.
- **cli-copilot `--allow-all-tools` blocker**: Narrower CLI permission surface remains a future enhancement.
- **Tier 2/3 items**: Remain in backlog unless promoted by future findings.
- **Advisor accuracy target**: 60.0% corpus accuracy reached. Further gains require training data or model changes.