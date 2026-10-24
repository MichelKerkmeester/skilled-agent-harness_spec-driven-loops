---
title: "Implementation Summary"
description: "Phase 3 is planned and not started: it will turn the core template hints into value tokens and add a Draft lifecycle to the placeholder gate for v2.3 docs."
trigger_phrases:
  - "versioned placeholder gate implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate"
    last_updated_at: "2026-10-23T11:27:22Z"
    last_updated_by: "generate-context"
    recent_action: "Wrote versioned placeholder gate docs"
    next_safe_action: "Continue with phase 004 plan and tasks"
    blockers: []
    key_files:
      - "specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-versioned-placeholder-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-versioned-placeholder-gate |
| **Status** | Draft |
| **Completed** | Not started |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This summary is rewritten when the phase closes.

### Phase 3: versioned-placeholder-gate

When it runs, this phase turns 217 authoring hints in the five core templates into `[YOUR_VALUE_HERE: ...]` tokens and stamps the templates v2.3. A packet scaffolded from them then fails strict validation once its Status leaves Draft with a hint still unfilled, and only warns while it is Draft. Packets with an older stamp keep exactly the verdict they have today. The planning session measured this against a scratch copy of the repository: strict results over 4,766 folders came out identical before and after, and the new test failed first and went red under all three scripted breaks.

The planning session also found three side effects it does not fix. They are listed under Known Limitations and in `goal.md` section 4 as operator items.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` | Created | Phase plan, written before execution |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The conductor runs `tasks.md` T001 to T021 itself with saved tools, and no worker model edits a file. The one model call is a read-only review through `cli-codex` with `gpt-6-luna`. The phase makes no commit, because the operator commits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the existing `[YOUR_VALUE_HERE: ...]` token | The validator already knows it, so no new grammar needs teaching |
| Gate on the v2.3 stamp and the exact Status word Draft | A stamp keeps every existing packet on its old rule, and a warning does not fail strict |
| Convert by script and keep the scaffolder's own texts | `create.sh` replaces some hints at scaffold time, and a hand edit could break that |
| Update the orchestrator and the shell rule together | `validate.sh` runs the orchestrator and a test compares the shell rule with it |
| Record the scanner defects, the era flip and the upgrade-level copy | Fixing them is outside the frozen file list |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict validation of this phase folder | Run at phase close by `tasks.md` T021 |
| New test, three mutations and census compare | Run by `tasks.md` T007, T010 and T015 |
| Spec-kit suite against the phase 1 start | Run by `tasks.md` T017 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The era report flips.** The manifest bump makes `repo-era.mjs` count v2.2 stamps as legacy: in this repository the legacy count went from 2,374 to 17,824 on the scratch copy. The operator decides whether to accept it.
2. **The post-edit scanner is blind in two ways.** It exits 1 on a hint inside a fenced block and exits 0 on a token that has a colon. This phase records both and fixes neither.
3. **`upgrade-level.sh` copies tokens into older docs.** A v2.2 doc that gains a template section then holds tokens that error. The planning run showed that one existing test hard-coded the old plan stamp, and T013 fixes that line.
4. **Suite duration and the real-tree result are unknown until T017 runs.** The planning session ran the suite only on a scratch copy.
<!-- /ANCHOR:limitations -->

---
