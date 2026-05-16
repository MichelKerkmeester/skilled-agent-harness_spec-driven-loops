# Iter 048 — Track 11: blast-radius analysis for deletes

## Methodology

Read `iteration-030.md` from `999-spec-026-restructure-research` and used `iteration-027.md` / `iteration-028.md` as source provenance. `iteration-029.md` is absent; only its prompt exists. I ran targeted basename searches across `.opencode`, `.codex`, `.claude`, `.gemini`, `opencode.json`, and `.utcp_config.json`, excluding each candidate packet path and `999-spec-026-restructure-research`.

One correction: iter 030 says 55 candidates, but the parsed delete-candidate table contains 54 rows.

## Per-delete blast radius

### Delete candidate 1: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/006-bge-m3-hybrid-evaluation`
- Confidence: HIGH
- Reference inventory: spec docs 14; graph 2; index 2; other packet docs 30. Example: `014-local-llama-cpp/009-cocoindex-ipc-fix/graph-metadata.json:13`
- Blast classification: DEEP
- Required cleanup if deleted: many predecessor/successor docs plus graph metadata
- Verdict: ABORT (move to archive)

### Delete candidate 2: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/008-finalize-and-commit`
- Confidence: HIGH
- Reference inventory: spec docs 10; index 2; other packet docs 56. Example: `014-local-llama-cpp/007-voyage-cleanup-and-egress-monitoring/spec.md:52`
- Blast classification: MEDIUM
- Required cleanup if deleted: `007-voyage-cleanup-and-egress-monitoring`, parent handover/spec, parent graph metadata
- Verdict: PROCEED_WITH_CLEANUP

### Delete candidate 3: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/016-llama-cpp-retrieval-quality-probe`
- Confidence: HIGH
- Reference inventory: spec docs 6; graph 2; index 4. Example: `017-llama-cpp-default-flip/graph-metadata.json:15`
- Blast classification: DEEP
- Required cleanup if deleted: successor packet graph/spec references
- Verdict: ABORT (move to archive)

### Delete candidate 4: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/019-readme-resource-map`
- Confidence: HIGH
- Reference inventory: graph 2; index 4; other packet docs 2. Example: `026-llm-model-runtime-inventory/graph-metadata.json:15`
- Blast classification: DEEP
- Required cleanup if deleted: graph metadata and sibling task references
- Verdict: ABORT (move to archive)

### Delete candidate 5: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/020-catalog-playbook-alignment-audit`
- Confidence: HIGH
- Reference inventory: graph 2; index 2; other packet docs 2. Example: `026-llm-model-runtime-inventory/graph-metadata.json:16`
- Blast classification: DEEP
- Verdict: ABORT (move to archive)

### Delete candidate 6: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/021-local-llm-legacy-review`
- Confidence: HIGH
- Reference inventory: spec docs 4; graph 4; index 2. Example: `022-local-llm-legacy-remediation/spec.md:20`
- Blast classification: DEEP
- Verdict: ABORT (move to archive)

### Delete candidate 7: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/023-post-remediation-re-review`
- Confidence: HIGH
- Reference inventory: other packet docs 8. Example: `022-local-llm-legacy-remediation/checklist.md:71`
- Blast classification: MEDIUM
- Required cleanup if deleted: 022 checklist/plan/tasks
- Verdict: PROCEED_WITH_CLEANUP

### Delete candidates 8-13
- `025-post-remediation-v2-re-review`: CONTAINED, PROCEED
- `026-post-batch-11-re-review`: CONTAINED, PROCEED
- `027-post-batch-12-final-re-review`: CONTAINED, PROCEED
- `030-post-029-final-re-review`: CONTAINED, PROCEED
- `031-post-batch-15-final-re-review`: CONTAINED, PROCEED

### Delete candidate 9: `026-llm-model-runtime-inventory`
- Confidence: HIGH
- Reference inventory: spec docs 2; graph 2. Example: `008-skill-advisor/013-skill-advisor-semantic-lane/graph-metadata.json:16`
- Blast classification: DEEP
- Verdict: ABORT (move to archive)

### Delete candidate 14: `037-llama-cpp-embedding-worker-deep-dive`
- Confidence: HIGH
- Reference inventory: spec docs 36; code refs 4; graph refs 12; symbolic refs 2. Example: `.opencode/skills/system-spec-kit/scripts/tests/validate-memory-quality-v8-overreach.vitest.ts:95`
- Blast classification: DEEP
- Verdict: ABORT (move to archive)

### Delete candidates 15-18
- `041-llama-cpp-metal-investigation`: SHALLOW, PROCEED_WITH_CLEANUP; cleanup parent graph metadata
- `043-cocoindex-coreml-ep-investigation`: CONTAINED, PROCEED
- `045-session-deep-review-2026-05-14`: CONTAINED, PROCEED
- `048-deep-review-cocoindex-wiring`: CONTAINED, PROCEED

### Delete candidates 19-24
- `054-code-folder-readmes`: DEEP, ABORT; graph refs from `007-code-graph/035` and `008-skill-advisor/024`
- `055-root-readme-realignment`: DEEP, ABORT; graph/spec refs from adjacent README packets
- `056-root-readme-deep-research`: DEEP, ABORT; graph/spec refs from `057` and `059`
- `057-root-readme-deeper-rewrite`: SHALLOW, PROCEED_WITH_CLEANUP
- `058-skill-md-realignment`: DEEP, ABORT; graph ref from `059`
- `059-cli-devin-deep-loop-alignment`: DEEP, ABORT; graph ref from `skilled-agent-orchestration/105`

### Delete candidates 25-42: `007-code-graph/*`
- `022-orphan-code-graph-db-cleanup`: MEDIUM, PROCEED_WITH_CLEANUP; parent graph/index cleanup
- `023-tsconfig-references-restructure`: MEDIUM, PROCEED_WITH_CLEANUP; parent graph/index cleanup
- `024-mcp-tool-rename-mk-code-index`: DEEP, ABORT; graph refs from 025, 032, 033, 034
- `025-skill-docs-sk-doc-alignment`: DEEP, ABORT; graph plus live skill doc reference
- `026-system-spec-kit-codegraph-residue-audit`: SHALLOW, PROCEED_WITH_CLEANUP
- `027-readmes-update`: DEEP, ABORT; graph refs
- `028-architecture-md`: SHALLOW, PROCEED_WITH_CLEANUP
- `029-public-readme-update`: SHALLOW, PROCEED_WITH_CLEANUP
- `030-manual-testing-verification`: SHALLOW, PROCEED_WITH_CLEANUP
- `031-deep-review-campaign-010-016`: DEEP, ABORT; graph refs from 032/033
- `032-deep-review-remediation`: DEEP, ABORT; graph refs from 033/034
- `033-deferred-fix-followup`: DEEP, ABORT; graph ref from 034
- `034-mcp-namespace-operational-sweep`: SHALLOW, PROCEED_WITH_CLEANUP
- `035-code-folder-readmes`: DEEP, ABORT; graph/spec/external refs
- `036-cli-devin-code-graph-hook`: SHALLOW, PROCEED_WITH_CLEANUP
- `037-system-code-graph-comprehensive-deep-review`: SHALLOW, PROCEED_WITH_CLEANUP
- `038-system-code-graph-deep-review-remediation`: SHALLOW, PROCEED_WITH_CLEANUP
- `039-system-code-graph-deferred-followon`: SHALLOW, PROCEED_WITH_CLEANUP

### Delete candidates 43-47: `007-code-graph/016-020`
- `016-scaffold-skill`: DEEP, ABORT; graph refs from extraction/topology packets
- `017-physical-move-and-database`: DEEP, ABORT; graph refs from 018/021
- `018-rewire-consumers-and-tool-registration`: DEEP, ABORT; graph refs from 019/021
- `019-doc-and-runtime-migration`: DEEP, ABORT; graph refs from 020/021
- `020-validation-and-cleanup`: DEEP, ABORT; graph refs from 021

### Delete candidate 48: `014/022-local-llm-legacy-remediation`
- Confidence: MEDIUM
- Reference inventory: spec docs 18; code refs 2; graph refs 6; index refs 2; other docs 18. Example: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:343`
- Blast classification: DEEP
- Verdict: ABORT (move to archive)

### Delete candidate 49: `014/002-code-graph-self-contained-package`
- Confidence: MEDIUM
- Reference inventory: listed path is missing; actual references point to `007-code-graph/002-code-graph-self-contained-package`. Spec docs 26; graph refs 8; index refs 14; external refs 6.
- Blast classification: DEEP
- Verdict: REQUIRES_REVIEW

### Delete candidate 50: `014/052-mk-spec-memory-rename`
- Confidence: MEDIUM
- Reference inventory: spec docs 34; graph refs 4; index refs 4; external refs 2. Example: `053-mk-spec-memory-rename-remediation/graph-metadata.json:9`
- Blast classification: DEEP
- Verdict: ABORT (move to archive)

### Delete candidate 51: `014/053-mk-spec-memory-rename-remediation`
- Confidence: LOW
- Reference inventory: index refs 2; external refs 2; other docs 40. Example: `052-mk-spec-memory-rename/review/deep-review-findings-registry.json:12`
- Blast classification: MEDIUM
- Verdict: PROCEED_WITH_CLEANUP

### Delete candidate 52: `014/050-all-skills-alignment-sweep`
- Confidence: LOW
- Reference inventory: index refs 2. Example: `014-local-llama-cpp/graph-metadata.json:33`
- Blast classification: SHALLOW
- Verdict: PROCEED_WITH_CLEANUP

### Delete candidate 53: `013/001-doctor-commands`
- Confidence: LOW
- Reference inventory: spec docs 116; graph refs 2; index refs 18; other docs 488. Example: `013-doctor-update-orchestrator/004-router-phase/graph-metadata.json:11`
- Blast classification: DEEP
- Verdict: ABORT (move to archive)

### Delete candidate 54: `013/002-sandbox-testing-playbook`
- Confidence: LOW
- Reference inventory: spec docs 46; index refs 6; other docs 304. Example: `013-doctor-update-orchestrator/001-doctor-commands/decision-record.md:238`
- Blast classification: MEDIUM
- Verdict: PROCEED_WITH_CLEANUP

## Aggregate

- Total delete candidates: 54
- CONTAINED (safe): 8
- SHALLOW: 7
- MEDIUM: 11
- DEEP (do not delete): 28
- Total cleanup operations needed if all PROCEED + PROCEED_WITH_CLEANUP execute: 150

## Recommended adjustment to delete list

- Aborted from delete list: `014/006`, `014/016`, `014/019`, `014/020`, `014/021`, `014/026-llm-model-runtime-inventory`, `014/037`, `014/054`, `014/055`, `014/056`, `014/058`, `014/059`, `007/024`, `007/025`, `007/027`, `007/031`, `007/032`, `007/033`, `007/035`, `007/016`, `007/017`, `007/018`, `007/019`, `007/020`, `014/022`, `014/002`, `014/052`, `013/001`
- Adjusted to PROCEED_WITH_CLEANUP: `014/008`, `014/023`, `014/041`, `014/057`, `007/022`, `007/023`, `007/026`, `007/028`, `007/029`, `007/030`, `007/034`, `007/036`, `007/037`, `007/038`, `007/039`, `014/053`, `014/050`, `013/002`
- Confirmed CONTAINED safe: `014/025`, `014/026-post-batch-11`, `014/027`, `014/030`, `014/031`, `014/043`, `014/045`, `014/048`

## JSONL delta row

```jsonl
{"iter_id":"048","timestamp_utc":"2026-05-16T04:02:50.164Z","executor":"cli-codex","model":"gpt-5.5","reasoning_effort":"medium","track":11,"status":"complete","deletes_evaluated":54,"deep_count":28,"aborts":28,"primary_evidence_files":["iter-027/028/029/030"]}
```