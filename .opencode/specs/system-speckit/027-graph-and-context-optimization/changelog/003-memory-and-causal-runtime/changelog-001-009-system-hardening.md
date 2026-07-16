---
title: "System Hardening: Post-Consolidation Research and Remediation Train"
description: "Six Tier 1 research and review iterations converged via autonomous overnight execution. Two P0s, eight P1s, six P2s, five validator rules plus nineteen 015-residual findings closed across six remediation children. Gate 3 F1 jumped from 68.6 percent to 97.66 percent. Advisor accuracy rose from 53.5 percent to 60.0 percent."
trigger_phrases:
  - "019 system hardening"
  - "post-consolidation hardening train"
  - "canonical save hardening"
  - "nfkc unification hardening"
  - "routing accuracy hardening"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/009-system-hardening` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

After the 2026-04-18 026-train consolidation, six high-leverage investigation items remained unaddressed: a delta-review of 015 findings, Q4 NFKC robustness, description.json regen strategy, Gate 3 and skill-advisor routing accuracy, template-validator joint audit plus canonical-save pipeline invariants. All six items carried concrete risk: the `save_lineage` field was silently dropped on every canonical save, packets 007 through 010 had no root `spec.md` plus both HARD-block classifiers had no offline accuracy baseline.

A research-first umbrella packet (019-system-hardening) coordinated the full wave. Child `001-initial-research` ran six deep-research and deep-review sub-packets across three dispatch waves. All six iterations converged, producing a findings registry of 40 entries (2 P0, 8 P1, 6 P2, 5 validator rules, 19 residuals). Six remediation children (002 through 007) shipped autonomously via `cli-codex gpt-5.4 high fast` in one overnight execution. The full umbrella was marked implementation-complete on 2026-04-19.

### Added

- `shared/unicode-normalization.ts` NFKC canonical fold utility with hidden-character stripping, combining-mark stripping plus a high-risk confusable fold table (children 002, Greek omicron and Cyrillic variants added)
- `mcp_server/tests/security/adversarial-unicode.vitest.ts` (NEW) adversarial round-trip corpus covering RT1-RT10 across Gate 3, shared provenance, trigger phrases plus hook-state validation (91 tests)
- `scripts/rules/check-canonical-save.sh` (NEW) and `scripts/rules/check-canonical-save-helper.cjs` (NEW) enforcing five new canonical-save validator rules via `validate.sh`
- `scripts/lib/validator-registry.json` (NEW) and `scripts/lib/validator-registry.ts` (NEW) single-source registry for all 33 rules with IDs, aliases, paths, severities, descriptions, strict-only flags plus category tags
- `tests/routing-accuracy/labeled-prompts.jsonl` (NEW) and `tests/routing-accuracy/score-routing-corpus.py` (NEW) offline accuracy evaluation harness for Gate 3 and skill-advisor classifiers
- `mcp_server/lib/description/description-schema.ts` (NEW) and `mcp_server/lib/description/description-merge.ts` (NEW) unified description-regen contract with five field classes and a merge-preserving repair lane
- `scripts/lib/frontmatter-grandfather-allowlist.json` (NEW) bounded cutoff for legacy semantic-frontmatter exceptions (2026-05-01 cutoff)

### Changed

- `scripts/core/workflow.ts` now forwards `saveLineage: 'same_pass'` through `GraphMetadataRefreshOptions`. Closes P0 save-lineage writeback bug where `derived.save_lineage` was silently dropped on every canonical save.
- `mcp_server/api/indexing.ts` widened to accept `GraphMetadataRefreshOptions` so callers can pass `{ now, saveLineage: 'same_pass' }` in the same write pass
- `scripts/lib/trigger-phrase-sanitizer.ts` and Gate 3 classifier routed through the shared `canonicalFold()` path so NFKC normalization, hidden-character stripping plus confusable detection apply uniformly before classification
- `mcp_server/lib/search/folder-discovery.ts` and `mcp_server/lib/description/repair.ts` both route through `mergeDescription()` so field-level merge policy is consistent across schema-valid writes and R4 schema-error repairs
- `mcp_server/handlers/session-resume.ts` returns a compact minimal payload (graph and search readiness, cached summary, structural context, session quality, graph operations, hints) rather than full memory-recovery fields
- `scripts/spec/validate.sh` now generates all canonical rule names, severities plus help text from `validator-registry.json` via `validator_registry_query()` and `emit_rule_script()`
- `scripts/rules/check-frontmatter.sh` rejects empty `title`, `description`, `trigger_phrases`, `importance_tier` plus `contextType` fields. `mcp_server/lib/validation/spec-doc-structure.ts` treats empty-string continuity fields as missing.
- `scripts/rules/check-anchors.sh` rejects duplicate opening anchor IDs to match `preflight.ts` parity
- `mcp_server/core/config.ts` canonicalizes symlink targets before allowed-root checks and refreshes exported database path bindings after late environment overrides

### Fixed

- `derived.save_lineage` was silently dropped on every canonical save because `workflow.ts` called `refreshGraphMetadata()` without forwarding the `saveLineage` option. The `GraphMetadataRefreshOptions` path and `same_pass` forwarding fix closes P0 number 2 from the research wave.
- Packets 007, 008, 009, 010 carried metadata without a root `spec.md`, making them invisible to graph traversal and strict validation. Coordination-parent `spec.md` files were added for all four. Closes P0 number 1.
- Gate 3 false-positive rate dropped from 31 false-false cases to 1 by extending `RESUME_TRIGGERS` with deep-loop write markers and adding a mixed-tail write exception. Gate 3 F1 rose from 68.6 percent to 97.66 percent.
- Advisor surface accuracy rose from 53.5 percent to 60.0 percent via command-surface normalization (`command-memory-save`, `command-spec-kit-resume`, `command-spec-kit-deep-research`, `command-spec-kit-deep-review` now normalize to their owning skills).
- `mcp_server/lib/validation/save-quality-gate.ts` now ignores whitespace-only trigger phrases that previously produced false quality-gate failures.
- `hooks/claude/session-prime.ts` emits a visible startup-brief warning on brief-path regression instead of silently proceeding.

### Verification

| Check | Result |
|-------|--------|
| `workflow-canonical-save-metadata` vitest suite | 11 of 11 pass |
| `follow-up-api` vitest suite | 19 of 19 pass |
| `canonical-save-validation` vitest suite | 6 of 6 pass |
| `adversarial-unicode.vitest.ts` (RT1-RT10, 91 tests) | 91 of 91 pass |
| Gate 3 vitest corpus | 47 of 47 pass |
| Advisor test suite | 44 of 44 pass |
| Description suites (`description-merge`, `repair`, `folder-discovery`) | 117 of 117 pass |
| `spec-doc-structure.vitest` | 14 of 14 pass |
| Recursive 026 validator pack (19 phases) | 0 errors, 0 warnings |
| Gate 3 F1 score (offline corpus) | 68.6 percent to 97.66 percent |
| Advisor accuracy (offline corpus) | 53.5 percent to 60.0 percent |

### Files Changed

| File | What changed |
|------|--------------|
| `scripts/core/workflow.ts` | Forwards `saveLineage: 'same_pass'` via `GraphMetadataRefreshOptions`. Closes P0 save-lineage writeback. |
| `mcp_server/api/indexing.ts` | Widened to accept `GraphMetadataRefreshOptions` for same-pass lineage persistence. |
| `scripts/lib/unicode-normalization.ts` (NEW) | NFKC canonical fold utility with confusable fold table, hidden-character stripping plus combining-mark stripping. |
| `mcp_server/tests/security/adversarial-unicode.vitest.ts` (NEW) | 91-test adversarial round-trip corpus covering RT1-RT10. |
| `scripts/lib/validator-registry.json` (NEW) | Single-source registry for all 33 validator rules. |
| `scripts/lib/validator-registry.ts` (NEW) | Typed registry loader used by `validate.sh` and rule scripts. |
| `scripts/rules/check-canonical-save.sh` (NEW) | Five canonical-save validator rules enforced by `validate.sh`. |
| `scripts/rules/check-canonical-save-helper.cjs` (NEW) | CommonJS helper wired into `validate.sh` dispatch. |
| `scripts/spec/validate.sh` | Rule names, severities plus help text generated from registry. Category split for `authored_template` vs `operational_runtime`. |
| `scripts/rules/check-frontmatter.sh` | Rejects empty semantic frontmatter fields. |
| `scripts/rules/check-anchors.sh` | Rejects duplicate opening anchor IDs for parity with `preflight.ts`. |
| `mcp_server/lib/description/description-schema.ts` (NEW) | Description field-class schema with five classes. |
| `mcp_server/lib/description/description-merge.ts` (NEW) | Unified merge helper routing both schema-valid writes and repair lane. |
| `mcp_server/lib/search/folder-discovery.ts` | Routes through `mergeDescription()` for consistent field-level merge policy. |
| `mcp_server/lib/description/repair.ts` | Routes through `mergeDescription()` so R4 schema-error repair uses same merge policy. |
| `mcp_server/handlers/session-resume.ts` | Returns compact minimal payload omitting full memory-recovery fields. |
| `mcp_server/core/config.ts` | Symlink canonicalization before allowed-root checks. Late-env override refresh for exported DB path bindings. |
| `mcp_server/lib/validation/save-quality-gate.ts` | Ignores whitespace-only trigger phrases. |
| `mcp_server/lib/validation/spec-doc-structure.ts` | Treats empty-string continuity fields as missing. |
| `mcp_server/hooks/claude/hook-state.ts` | Semantic validation for pending compact-prime payloads. |
| `mcp_server/hooks/shared-provenance.ts` | Instruction contamination and suspicious-prefix checks moved to post-canonicalization path. |
| `scripts/lib/frontmatter-grandfather-allowlist.json` (NEW) | Bounded grandfather exceptions with 2026-05-01 cutoff. |
| `scripts/lib/trigger-phrase-sanitizer.ts` | Routed through shared `canonicalFold()` for NFKC normalization before classification. |

### Follow-Ups

- Resolve pre-existing baseline test failures unrelated to this umbrella (`handler-memory-save`, `transaction-manager-recovery`, `startup-brief` suites) as a separate packet.
- Calibrate advisor accuracy beyond 60.0 percent once the broader corpus labeling from packet 005 routing-accuracy converges.
- Evaluate Tier 2 candidates (DR-2 runtime-matrix review, DR-3 018 adversarial, SSK-DR-2 boundary audit) against current system state to determine if any qualify for promotion.
