---
title: "Implementation Summary"
description: "compiled-route-sync.cjs --check now fails when a served copy of a traced authored file is missing or differs from it."
trigger_phrases:
  - "compiled route content check implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout/006-compiled-route-content-check"
    last_updated_at: "2026-10-11T12:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-015-006-compiled-route-content-check"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-compiled-route-content-check |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

compiled-route-sync.cjs --check now fails when a served copy of a traced authored file is missing or differs from it.

### Phase 6: compiled-route-content-check

check() takes a runtimeRoot option that defaults to the real serving root. After tracing, it reads each closure file and the file at the same relative path under the serving root, which is where build() copies it. A missing copy or any byte difference is collected, and after the closure listing the function throws one error naming every such file and the two ways to repair it: rebuild, or copy a re-minted activation manifest back to its authored path. A clean tree ends with `all N served copies match their authored files`. The test builds a fresh serving root in a sandbox, passes check, appends a line to the served resolver and expects the `differs` error, then deletes it and expects the `missing` error.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/compiled-route-sync.cjs` | Modify | check() compares bytes |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modify | One test |
| `.skilled/bin/README.md` | Modify | One line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first: it failed with `Missing expected exception` against the old check(), then passed with the fix.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compare manifests as well as code | Today all 55 match, so including the seven manifests costs nothing and catches an authored copy left behind after a re-mint |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test --test-name-pattern='check fails when a served file' .skilled/bin/tests/compiled-route-manifest.test.cjs` | fail 1 before (Missing expected exception), pass 1 after |
| `node .skilled/bin/compiled-route-sync.cjs --check` | all 55 served copies match their authored files, exit 0 |
| admission, front-door, manifest and surface-hint test files | 29, 1, 43 and 6 pass, 0 fail |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. None.
<!-- /ANCHOR:limitations -->

---
