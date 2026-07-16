---
title: "Implementation Summary: 022/002b CocoIndex Reranker Doc Prose Resync"
description: "Shipped 9 doc edits closing 4 P0 reranker doc-drift findings + corrected daemon-log observability claim (silent-success on load is normal; positive load-trace was a wishful prose claim never observed in practice)."
trigger_phrases:
  - "022/002b shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose"
    last_updated_at: "2026-05-23T17:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 002b shipped — 4 P0 reranker doc-drift closed + observability correction"
    next_safe_action: "Move to phase 003 (codex agents); investigation already complete, 10-min ship"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/007-reranker-opt-in.md"
      - ".opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022d5"
      session_id: "016-002-022-002b-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 002b shipped closing 4 P0 + 1 observability correction"
      - "Council-recommended phase ordering followed: 002b first per ai-council/executor-instructions.md"
      - "Memory entry project_2026_05_19_cocoindex_arc_shipped.md updated for Qwen3-0.6B canonical"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/002b CocoIndex Reranker Doc Prose Resync

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 3 docs |
| Tests added | 0 (docs-only) |
| Typecheck | n/a (no code) |
| Audit findings closed | f-iter006-002, f-iter006-003, f-iter006-004, f-iter006-005 (4 P0 reranker doc-drift) + 1 observability-claim correction (newly surfaced during 002b verification) |
| Council recommendation honored | Yes — phase 002b shipped first per `<parent>/ai-council/executor-instructions.md` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### `.opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/007-reranker-opt-in.md`

8 prose-site edits:
- Frontmatter description: BAAI → Qwen/Qwen3-Reranker-0.6B
- §1 Overview: model name + size (~2.3 GB → ~1.1 GB) + 023B follow-on context (registered_embedders.py:256 reference)
- §1 Why This Matters: BGE→Qwen3 swap rationale (023B; +1 hit/73, -32% p95, Apache-2.0)
- §2 Scenario Contract: Objective + Real user request + Prompt + Expected execution + Expected signals — daemon-log silent-success language; positive load-trace claim removed
- §2 Pass/Fail: warn-on-failure preserved as fail signal; positive-trace claim removed
- §3 Test Execution steps 3-6: cache path updated; grep command changed from `rerank|bge|crossencoder` to `warn|error|fallback|fail` (the latter actually matches daemon-log behavior)
- §3 Expected steps 4-6 + Evidence + Pass/Fail: aligned with silent-success semantics
- §3 Failure Triage items 1-4: Qwen3-0.6B params (~600M) + size (~1.1 GB); RerankerAdapter warning as the actual failure signal
- §4 Source Files: cache directory path updated to Qwen3; BGE entry kept as fallback row

### `.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md`

1 edit covering 3 prose sites at lines 402-407: CFG-007 Description + Scenario Contract Prompt summary + Expected signals — all swap BAAI → Qwen3 + correct daemon-log silent-success behavior.

### `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md`

1 edit at line 202: Skill internals reranker.py callout — `Qwen/Qwen3-Reranker-0.6B` as current default; BGE retained as opt-in fallback note (preserves historical record).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Main-agent direct execution (no cli-X dispatch) per council `executor-instructions.md` Phase 002b contract. ~35 minutes wall-clock total:

1. **Pre-edit verification (10 min):**
   - Read `registered_embedders.py:256` to confirm canonical default → `Qwen/Qwen3-Reranker-0.6B` confirmed.
   - Measure Qwen3 disk footprint at HF cache → 1.1 GB verified.
   - Grep daemon.log for model-load identifiers → 0 hits across 509KB log. **Discovery:** daemon does NOT emit positive load-trace lines on successful CrossEncoder init. Original doc prose was wishful for ANY reranker.
2. **Edits (15 min):** 9 Edit calls (8 on 007, 1 each on playbook + benchmarks README).
3. **Verification (10 min):**
   - Ban-list grep on BAAI: 1 hit in benchmarks/README fallback + 1 in 007 Source Files fallback row — both historical/fallback context (correct).
   - Canonical grep on Qwen3: 7 total hits across 3 files (1 + 3 + 3) — all in current-default contexts.
   - Stale-size grep on "~2.3 GB": 2 hits both in historical/fallback prose (correct).
4. **Spec docs authored post-execution.**
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Council's abort signal #1 considered but not applied.** The council said "Qwen3 footprint cannot be verified → defer 002b". Footprint WAS verifiable (1.1 GB confirmed); the unverifiable piece was the daemon-log identifier. Rather than defer the whole phase, the daemon-log discovery (positive load-trace doesn't exist) became part of the scope: corrected the prose to silent-success semantics. This closes the doc-drift cleanly without abandoning the phase.
- **Original wishful prose corrected rather than just translated.** Translating "daemon log shows BAAI X" → "daemon log shows Qwen3 X" would have perpetuated a false claim. Instead, prose rewritten to "silent success is normal; warnings appear only on failure paths" — factually aligned with `reranker.py` observed behavior (logger.warning() only).
- **Grep command in step 6 changed from `rerank|bge|crossencoder` to `warn|error|fallback|fail`.** The former returns 0 hits regardless of reranker model (because the daemon doesn't log model names). The latter matches actual failure-signal behavior — operators get a meaningful test result.
- **BGE references preserved in 3 places** (007 Source Files fallback row, 007 §1 size-comparison line, benchmarks/README opt-in fallback note) — historical/fallback context preserved per the audit's intent.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- `rg "Qwen/Qwen3-Reranker-0.6B" <3 files>` → 7 hits (1 playbook + 3 benchmarks/README + 3 in 007)
- `rg "BAAI/bge-reranker-v2-m3" <3 files>` → 2 hits both in historical/fallback context
- `rg "~?2\.3 GB" <3 files>` → 2 hits both in historical/fallback context
- Manual prose review of daemon-log silent-success language across 7 prose sites
- Strict-validate phase 002b → exit 0 (after this doc set + parent metadata update)
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- Daemon-log behavior validated by current observation (live log empty of reranker-specific events). If future CocoIndex versions add explicit reranker load tracing, the docs may need re-update — that would be a forward-looking change, not drift remediation.
- `Alibaba-NLP/gte-multilingual-reranker-base` pin example in 007 §3 Optional Supplemental Checks left unchanged — it's an intentional override-path test, not a default citation.

### Commit Handoff

Suggested message:

```
docs(022/002b): resync CocoIndex reranker doc prose to Qwen/Qwen3-Reranker-0.6B canonical + correct daemon-log observability claim

Closes 4 P0 audit findings from packet 021 (reranker side, deferred from phase 002):
- 007-reranker-opt-in.md: 8 prose sites BAAI/bge-reranker-v2-m3 → Qwen/Qwen3-Reranker-0.6B (size 2.3 GB → 1.1 GB)
- manual_testing_playbook.md CFG-007 row: 3 prose sites
- benchmarks/README.md reranker.py callout

Bonus: corrected daemon-log false claim across 7 prose sites. The original
"daemon log shows BAAI cross-encoder load activity" was never accurate
(verified 0 hits in 509KB live daemon.log). Prose now describes silent-success
load semantics with warnings appearing only on failure paths via logger.warning().
Grep command in step 6 updated from `rerank|bge|crossencoder` to
`warn|error|fallback|fail` to match observable behavior.

BGE references preserved as opt-in fallback / historical reference per audit intent.
Verified Qwen3-0.6B disk footprint at 1.1 GB.
```

Suggested explicit paths:

```
.opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/007-reranker-opt-in.md
.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose/
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/graph-metadata.json
```
<!-- /ANCHOR:limitations -->
