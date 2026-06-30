---
title: "Plan: 022/002b CocoIndex Reranker Doc Prose Resync"
description: "3 file doc-prose rewrites: 007-reranker-opt-in.md (8 prose sites) + manual_testing_playbook.md (1 row) + benchmarks/README.md (1 callout). Council-recommended first-in-order per executor-instructions.md."
trigger_phrases:
  - "022/002b plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose"
    last_updated_at: "2026-05-23T17:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored post-execution"
    next_safe_action: "n/a — phase shipped"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022d2"
      session_id: "016-002-022-002b-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Main-agent direct chosen over cli-devin: 3 docs with verified canonicals + verified daemon-log behavior is below dispatch ROI"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/002b CocoIndex Reranker Doc Prose Resync

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Council-recommended phase order per `<parent>/ai-council/executor-instructions.md` placed 002b first. Reranker prose corrections were deferred from phase 002 because they require Qwen3-0.6B disk footprint verification AND daemon-log identifier verification. Both verifications completed at start of this phase; daemon-log identifier discovered to be NONEXISTENT (silent success on load) — required prose rewrite of observability claims, not just string swap.

### Overview

3 file edits, ~10 prose sites. Main-agent direct Edit. No new files. Below cli-X dispatch ROI threshold once daemon-log discovery resolved scope.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Qwen3-Reranker-0.6B disk footprint verified (1.1 GB at HF cache) — DONE
- Daemon-log identifier verified (NONEXISTENT; silent success on load) — DONE
- 3 target file/site surfaces enumerated — DONE
- Council recommendation reviewed (`executor-instructions.md` §Phase 002b) — DONE

### Definition of Done

- All R1–R5 verifications pass
- Strict-validate exit 0
- Parent arc graph-metadata `children_ids` extended with `002b-cocoindex-reranker-doc-prose`
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Doc-only prose rewrite. Two correction classes per file:
1. **Canonical-name swap** (BAAI → Qwen3-0.6B) with footprint correction (~2.3 GB → ~1.1 GB)
2. **Observability claim correction** (positive load-trace claim → silent-success-is-normal language; warn-on-failure preserved as fail signal)

### Key Components

- `007-reranker-opt-in.md`: 8 prose sites across frontmatter + §1 + §2 + §3 (steps/expected/evidence/pass-fail/triage/source-files)
- `manual_testing_playbook.md:402,407`: CFG-007 Description + Scenario Contract + Expected signals row
- `benchmarks/README.md:202`: Skill internals reranker.py callout
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-Edit Verification

1. Read `registered_embedders.py:256` to confirm `DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"` — confirmed.
2. Measure Qwen3 disk footprint at `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B` — 1.1 GB confirmed.
3. Grep daemon.log for model-load identifiers — 0 hits across 509KB log; discovered silent-success pattern.

### Phase 2: Core Implementation

8 Edit calls on 007 covering all prose sites + 1 Edit on manual_testing_playbook.md + 1 Edit on benchmarks/README.md.

### Phase 3: Verification

- `rg "Qwen/Qwen3-Reranker-0.6B" <3 files>` → ≥3 hits with ≥1 per file (got 7 total)
- `rg "BAAI/bge-reranker-v2-m3" <3 files>` → remaining hits limited to historical/fallback context (got 1 in benchmarks/README.md fallback callout; 1 in 007 §3 Source Files cache fallback row)
- `bash validate.sh 002b-cocoindex-reranker-doc-prose --strict` → exit 0
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation-only. No automated tests. Verification by grep ban-list per R1–R4.

Manual prose review of 007 §3 step 6 prose to confirm the new grep command (`grep -Ei "warn|error|fallback|fail"` instead of `grep -Ei "rerank|bge|crossencoder"`) accurately reflects daemon-log behavior.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 002 shipped (embedder side; established the scope-split pattern)
- Council convergence-report.md + executor-instructions.md (provided dispatch contract + abort signal logic)
- `registered_embedders.py:256` (canonical default value)
- 023B follow-on benchmark (drove Qwen3-0.6B promotion over jina-v3)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git restore` on the 3 changed files. Reverts docs to pre-edit state (stale reranker name + wishful daemon-log claim). No behavior or state corruption — code defaults already correct.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

Phase 002b is independent of all other 022 phases. Council-recommended ordering places it before 003 because "reranker context warm" from phase 002 discovery; functionally could ship in any order.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Estimate | Actual |
|---|---|---|
| Verification | 10 min | ~10 min (footprint + daemon-log grep) |
| Edits | 30 min | ~15 min (8 Edits on 007, 1 each on the other 2) |
| Verify + doc | 20 min | ~10 min (ban-list grep + spec docs) |
| Total | 60 min | ~35 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

If a manual-testing run executes the new step 6 grep (`grep -Ei "warn|error|fallback|fail"`) and false-positives on unrelated daemon warnings, narrow the grep to reranker-specific keywords (`grep -E "RerankerAdapter|CrossEncoder|sentence_transformers"`) and update the prose accordingly. Low likelihood — daemon does not currently emit reranker-specific warnings during normal operation.
<!-- /ANCHOR:enhanced-rollback -->
