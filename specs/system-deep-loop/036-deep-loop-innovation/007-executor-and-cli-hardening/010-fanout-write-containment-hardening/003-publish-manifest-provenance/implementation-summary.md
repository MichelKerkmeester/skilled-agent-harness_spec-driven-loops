---
title: "Implementation Summary"
description: "The attribution table and merged registry now name each lineage's executor kind, model and reasoning effort from the invocation metadata the runner already writes."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/003-publish-manifest-provenance"
    last_updated_at: "2026-09-14T08:24:17Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Read executor provenance in the merge and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-publish-manifest-provenance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-publish-manifest-provenance |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The attribution table and the merged registry now name each lineage's executor. The per-lineage loader in `runtime/scripts/fanout-merge.cjs` reads `invocation-metadata.json`, which the runner writes beside every lineage before dispatch, and takes kind, model and reasoning effort from its `effectiveConfig`; the old state-log and summary lookups remain as fallbacks and `unknown` is printed only when no source has the value. A new `buildLineageExecutors` helper adds a label-keyed `lineageExecutors` map to both the research and review merge outputs. Re-running the merge over the retained research directory turned four `unknown` rows into `cli-devin`, `cli-codex` and `cli-opencode` with their models.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi, briefed with the loader lines, the provenance file and the retained lineages. The delegate ran the read-path test against the unmodified script first, then its file, the result-envelopes consumer and typecheck. The orchestrator reviewed the diff, re-ran the merge in place on the packet's research directory, and ran the whole deep-loop suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read invocation metadata rather than add a publish manifest | The runner already persists the provenance before dispatch; the worktree publish manifest is removed in the last phase |
| Keep the old lookups as fallbacks | Artifacts that predate the file still merge |
| Sort labels before building the map | The serialized registry does not depend on lineage arrival order |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Read-path test against unmodified script | FAIL as expected: `lineageExecutors` undefined |
| `fanout-merge.vitest.ts` (56), `result-envelopes.vitest.ts` (30), typecheck | PASS, exit 0 |
| Merge re-run on the packet's research directory | attribution table has zero `unknown` rows, 66 key findings |
| Full deep-loop suite | `npm test` in the runtime: 156 files, 2663 passed, 7 skipped, exit 0, 1304 s |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Review merges.** No review-shaped run is retained, so the review map is proven by the unit test rather than a real directory.
<!-- /ANCHOR:limitations -->

---


