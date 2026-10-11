---
title: "Implementation Summary"
description: "A named changelog mode such as 'sk-doc changelog' routes to its skill again, and the advisor runtime declares the Node range its build tools need."
trigger_phrases:
  - "advisor doc target and engines implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/012-advisor-doc-target-and-engines"
    last_updated_at: "2026-10-10T21:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-014-012-advisor-doc-target-and-engines"
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
| **Spec Folder** | 012-advisor-doc-target-and-engines |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A named changelog mode such as 'sk-doc changelog' routes to its skill again, and the advisor runtime declares the Node range its build tools need.

### Phase 12: advisor-doc-target-and-engines

DOC_FILE_SUFFIX in the explicit lane now treats changelog as a doc-file target only in its file forms, `changelog.md` or a `changelog/` path, so a skill name followed by the word changelog keeps its explicit mention and author phrases (review finding P1-01). The bounded alternatives keep `readme` from matching `readmes`. `engines.node` in the runtime package.json and the lockfile root is now `^20.19.0 || >=22.12.0`, the range vite and rolldown declare (P2-08).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | changelog only in file forms |
| `.skilled/skills/system-skill-advisor/runtime/tests/name-mention-scoring.vitest.ts` | Modify | Two cases |
| `.skilled/skills/system-skill-advisor/runtime/package.json`, `package-lock.json` | Modify | engines range |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One DeepSeek V4.1 Flash max build through cli-pi on the LLM gateway wrote the cases and the regex. The orchestrator found the builder's `(?!\w)` bound also blocked `changelog/v1.md`, moved the path form outside the bound, set the engines range, ran the new case against the committed scorer and rebuilt dist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| File forms only | The review's smallest fix; the bare word names a mode |
| Copy the toolchain range exactly | A wider range promised support the build dependencies do not give |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/name-mention-scoring.vitest.ts` | 7 passed; against the committed scorer 1 failed, 6 passed |
| `npx vitest run` | 137 files, 1026 passed, 0 failed |
| `npm run typecheck` | exit 0 |
| advisor CLI on the review prompts | sk-doc 0.744 over sk-git 0.621; sk-doc 0.855 |
| `advisor-battery.py` | positives 14/17, negatives-false-positive 0/5 |
| engines check | ^20.19.0 || >=22.12.0 in both files |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The Python scorer is aligned in phase 013.
<!-- /ANCHOR:limitations -->

---
