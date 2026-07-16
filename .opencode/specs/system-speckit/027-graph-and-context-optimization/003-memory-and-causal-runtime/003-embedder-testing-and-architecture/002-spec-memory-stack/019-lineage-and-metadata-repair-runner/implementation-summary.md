---
title: "Implementation Summary: Lineage and Metadata Repair Runner"
description: "Repair runner and migration results for stale graph metadata and memory lineage failures."
trigger_phrases:
  - "lineage metadata repair summary"
  - "graph metadata migration summary"
  - "memory index scan repair results"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner"
    last_updated_at: "2026-05-19T20:08:00Z"
    last_updated_by: "codex"
    recent_action: "Completed repair runner and verification"
    next_safe_action: "Stage listed paths and commit with the draft message below"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs"
      - "/tmp/repair-graph-metadata-real-run.json"
      - "/tmp/scan-post-final4.json"
    session_dedup:
      fingerprint: "sha256:fc96028dbdd9f70c59d4fdfeea334592516c05563fd8a52ed37a39ef82104133"
      session_id: "codex-019-lineage-and-metadata-repair-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-lineage-and-metadata-repair-runner |
| **Completed** | 2026-05-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repair pass turned the scan from a metadata cleanup wall into a small, explicit residual list. A new direct-run runner now repairs graph metadata v1 shape, normalizes legacy importance tiers, compacts V8-rejected archived metadata, and realigns stale lineage keys with current memory identities.

### Repair Runner

The runner lives at `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs`. It supports `--dry-run`, `--scan-log`, `--root`, and `--no-lineage`, emits JSON reports, and writes backups under `/tmp/repair-graph-metadata-*` before real mutations.

### Migration Results

The first real pass touched 172 graph metadata files and repaired 337 stale lineage rows. Follow-up graph-only passes compacted V8-rejected graph metadata until the targeted classes were clear. Final scan result: 503 failures before this packet, 3 failures after this packet.

The remaining 3 failures are malformed `description.json` files in `013-embedder-testing-and-architecture/004-code-index-stack`. They are outside the allowed mutation scope for this packet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs` | Created | Adds the migration runner |
| `.opencode/specs/**/graph-metadata.json` | Modified | Normalizes v1 schema, accepted tier values, and V8-safe metadata |
| `.opencode/specs/.../002-spec-memory-stack/spec.md` | Modified | Receives phase-map injection from `create.sh` |
| `.opencode/specs/.../019-lineage-and-metadata-repair-runner/*` | Created/Modified | Documents scope, plan, tasks, verification, and handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation used the scan log as the authority for risky repairs. Graph metadata repair is file-backed and idempotent. Lineage repair is scan-driven and only updates version-1 predecessor rows whose stored logical key no longer matches the current `memory_index` row.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the runner under `mcp_server/scripts` | Existing direct-run maintenance scripts already live there, and this runner needs Node plus SQLite CLI access. |
| Map `importance_tier: "high"` to `important` | The enum source accepts `constitutional`, `critical`, `important`, `normal`, `temporary`, and `deprecated`; `important` preserves high-signal intent without claiming criticality. |
| Compact V8-rejected graph metadata | V8 rejects were driven by foreign packet relationships and noisy derived fields in graph metadata. Compacting only scan-rejected files keeps valid metadata untouched. |
| Leave malformed `description.json` files unchanged | They were not in the allowed mutation scope, and the requested deliverable was graph metadata plus lineage repair. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs` | PASS |
| Initial dry-run | PASS: 172 graph files and 337 lineage rows planned after narrowing over-broad canonical JSON writes |
| Real migration pass | PASS: 172 graph files changed, 337 lineage rows repaired, backups in `/tmp/repair-graph-metadata-2026-05-19T19-44-28-899Z` |
| Idempotency dry-run after first pass | PASS: graph changes 0, lineage changes 0 |
| V8 compaction passes | PASS: additional graph-only passes cleared graph metadata V8 count to 0 |
| Final direct scan | PASS for target classes: failed 3, E_LINEAGE 0, invalid graph schema 0, tier check 0, V8 0 |
| Final residual failures | OUT OF SCOPE: 3 malformed `description.json` files remain |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three description metadata failures remain.** The final scan reports malformed `description.json` files for 016/004/015, 016/004/017, and 016/004/018. Those files were outside the allowed mutation scope.
2. **SQLite repair is evidence-driven.** The lineage repair path requires a scan log containing `E_LINEAGE` predecessor ids. Without scan evidence, it does not infer database repairs.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Staging path list:
`.opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs`
`.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/004-deep-ai-council-playbook-graph-coverage/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/001-deep-review-three-tier-setup/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/109-subphase-recatalog-and-archive/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/110-auto-review-stretch-config-dedup-gates/001-mk-plugins-config-uplift/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/110-auto-review-stretch-config-dedup-gates/002-sk-code-review-uplift/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/111-base-files-renumbering-name-cleanup/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/112-commit-standards-and-retroactive-rewrite/001-prerequisites-and-baseline/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/112-commit-standards-and-retroactive-rewrite/002-commit-standards-definition/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/112-commit-standards-and-retroactive-rewrite/003-sk-git-skill-update/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/112-commit-standards-and-retroactive-rewrite/004-cli-devin-rewrite-prompts/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/112-commit-standards-and-retroactive-rewrite/005-retroactive-rewrite-execution/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/048-cli-testing-playbooks/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/049-mcp-testing-playbooks/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/051-cli-opencode-providers/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/053-cli-skill-removal-mcp-clickup/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/054-sk-code-merger/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/056-sk-code-fullstack-branch/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/058-spec-kit-ux-adoptions/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/059-agent-implement-code/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/060-sk-agent-improver-test-report-alignment/003-followup-research/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/060-sk-agent-improver-test-report-alignment/004-improve-agent-command-flow-stress-tests/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/060-sk-agent-improver-test-report-alignment/005-improve-agent-executable-wiring/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/060-sk-agent-improver-test-report-alignment/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/001-agent-context/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/002-agent-debug/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/004-agent-review/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/005-agent-orchestrate/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/006-agent-multi-ai-council/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/007-agent-improve-prompt/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/008-agent-deep-review/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/009-agent-deep-research/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/062-deep-loop-command-flow-stress-tests/001-deep-research-cp-scenarios/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/062-deep-loop-command-flow-stress-tests/002-deep-research-stress-runs/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/062-deep-loop-command-flow-stress-tests/003-deep-review-cp-scenarios/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/062-deep-loop-command-flow-stress-tests/004-deep-review-stress-runs/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/062-deep-loop-command-flow-stress-tests/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/063-sk-doc-agent-template-alignment/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/064-agent-create/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/065-skill-advisor-reindex-and-stress-test/001-baseline-reindex-and-stress-results/001-skill-reindex/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/065-skill-advisor-reindex-and-stress-test/001-baseline-reindex-and-stress-results/002-skill-router-stress-tests/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/065-skill-advisor-reindex-and-stress-test/001-baseline-reindex-and-stress-results/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/065-skill-advisor-reindex-and-stress-test/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/069-sk-code-motion-dev-and-playbook/006-routing-precision-fixes/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/076-sk-doc-missing-router-intents-bullet-aware-matrix/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/081-cli-copilot-deprecation-due-to-price-hike/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/082-sk-improve-prompt-rename/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/093-testing-playbooks-code-review-and-git/002-sk-git-playbook/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/093-testing-playbooks-code-review-and-git/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/094-playbook-prompt-naturalness/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/003-remediation/002-sk-deep-token-replace/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/003-remediation/004-hooks-resolver-tighten/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/003-remediation/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/005-remediation/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/006-cli-opencode-executor/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/008-remediation/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/graph-metadata.json`
`.opencode/specs/skilled-agent-orchestration/z_archive/100-multi-ai-council-main-agent-write-enforcement/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-release-readiness/001-fix-skill-advisor-fail-open-fallback/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-release-readiness/002-fix-additional-release-readiness-findings/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-audit/002-runtime-wiring-enterprise-readiness-audit/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-cross-cutting-cleanup-pass/002-search-query-rag-optimization/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-cross-cutting-cleanup-pass/004-search-rag-measurement-implementation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/001-phase-parent-validator-docs/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-cross-cutting-cleanup-pass/011-cli-matrix-adapter-runners/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-cross-cutting-cleanup-pass/013-evergreen-doc-packet-id-removal/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-cross-cutting-cleanup-pass/024-daemon-concurrency-fixes/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-followup-post-program/001-post-program-doc-and-state-cleanup/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-followup-post-program/003-post-program-quality-pass/003-testing-playbook-trio-alignment/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/012-copilot-target-authority-gate-helper/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/006-research/004-fix-deep-research-findings/001-fix-code-graph-consistency/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/006-research/004-fix-deep-research-findings/005-resource-leaks-silent-errors/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/006-research/004-fix-deep-research-findings/007-fix-topology-build-boundary/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/006-research/004-fix-deep-research-findings/010-fix-cli-orchestrator-doc-drift/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/001-reverse-parent-research-review-folders/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/008-sk-deep-cli-runtime-execution/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/009-system-hardening/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-external-project-adoption/002-code-graph-phase-runner-and-detect-changes/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-external-project-adoption/008-deep-research-review/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-external-project-adoption/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/001-code-graph-runtime-upgrades/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/007-code-graph-backend-resilience-implementation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/008-end-user-scope-default-and-opt-in/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/007-tree-sitter-parser-crash-resilience/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/014-extraction-design-and-decision-record/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/001-skill-graph-metadata-routing-boosts/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/010-skill-id-field-rename/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/012-sk-doc-documentation-alignment/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/013-remove-spec-kit-references/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/014-manual-testing-playbook-validation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/016-fix-deep-review-p2-findings-for-package-extraction/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/017-fix-deep-review-p1-findings-for-package-extraction/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/018-fix-followup-p2-findings-for-package-extraction/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/027-typescript-header-normalization/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/028-generated-js-declaration-alignment/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/029-python-package-header-policy/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/030-any-type-justification-sweep/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/007-cross-skill-enhancement-edge-propagation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/002-skill-advisor-scoring-engine/001-advisor-hook-brief-improvements/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/003-skill-advisor-routing-engine/003-smart-remediation-opencode-plugin/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-skill-advisor-production-hardening/001-deferred-remediation-telemetry-run/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/001-documentation-code-alignment/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-fix-deep-review-findings-for-causal-graph-channel-routing/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-implement-initial-doctor-command-set/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/003-consolidate-doctor-router-implementations/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/021-local-llm-legacy-review/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner/description.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner/checklist.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner/implementation-summary.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner/plan.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner/spec.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner/tasks.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/spec.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/003-install-guide-docs/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/001-cocoindex-swap/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/005-declarative-registry/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/006-install-guide-updates/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/002-deep-review-stack/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/001-skill-mds-audit/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/002-root-readme-update/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/003-embedder-pluggability-narrative/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/008-launcher-race-window-and-debug-log-hygiene/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/009-launcher-eperm-parity-fix/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/010-multi-client-stdio-socket-bridge/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/001-indexer-surface-investigation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/007-code-graph-029-public-readme-update/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/009-hook-parity-008-docs-impact-remediation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-054-code-folder-readmes/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-055-root-readme-realignment/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-058-skill-md-realignment/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-030-manual-testing-verification/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-031-deep-review-campaign-010-016/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-032-deep-review-remediation/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-033-deferred-fix-followup/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-034-mcp-namespace-operational-sweep/graph-metadata.json`
`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-code-graph-hld-lld/001-contract/graph-metadata.json`
`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-code-graph-hld-lld/002-lib-impl/graph-metadata.json`
`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-code-graph-hld-lld/003-handler/graph-metadata.json`
`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-code-graph-hld-lld/004-test/graph-metadata.json`
`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-code-graph-hld-lld/graph-metadata.json`
`.opencode/specs/system-spec-kit/z_archive/022-hybrid-rag-fusion/006-feature-catalog/graph-metadata.json`
`.opencode/specs/system-spec-kit/z_archive/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/graph-metadata.json`
`.opencode/specs/system-spec-kit/z_archive/022-hybrid-rag-fusion/015-manual-testing-per-playbook/003-discovery/graph-metadata.json`
`.opencode/specs/system-spec-kit/z_archive/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/graph-metadata.json`
`.opencode/specs/system-spec-kit/z_archive/022-hybrid-rag-fusion/015-manual-testing-per-playbook/007-evaluation/graph-metadata.json`
`.opencode/specs/system-spec-kit/z_archive/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/graph-metadata.json`

Draft commit header:

`fix(spec-kit): repair graph metadata and lineage drift`

Draft commit body:

Normalize stale graph metadata to the v1 shape, map legacy high tiers to important, and compact scan-rejected graph metadata that tripped V8. Add a direct-run repair runner with dry-run reporting and backup safety. Repair scan-proven stale lineage logical keys and verify memory_index_scan drops from 503 failures to 3 residual description metadata failures.
