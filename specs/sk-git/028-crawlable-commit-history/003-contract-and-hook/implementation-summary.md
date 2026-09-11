---
title: "Implementation Summary"
description: "The approved grammar is now code: the commit-msg hook whitelists and polices the new trailers, an allocator mints ordinals under a lock, a prepare-commit-msg hook stamps them, and the sk-git skill says so, all with harnesses."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/003-contract-and-hook"
    last_updated_at: "2026-09-11T07:16:28Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the contract-and-hook phase with four verified commits"
    next_safe_action: "Open phase 004 with the search-surface dispatch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-contract-and-hook |
| **Completed** | 2026-09-11 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A commit made through these hooks now carries a unique seven-digit address and, when told the packet, a Spec path, and the hook refuses a malformed or duplicate id. Four dispatches on cli-pi with DeepSeek V4.1 Flash produced the code and the documents, and every harness was run again by the conductor before each commit.

### Phase 3: contract-and-hook

[What this feature does and why it exists. 1-2 paragraphs. Use direct address.
Explain what the user gains, not what files you touched.]

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/scripts/git-hooks/commit-msg` | Modified | Colon-only trailer branch, shape and duplicate checks |
| `.opencode/scripts/git-hooks/tests/commit-msg.test.sh` | Created | Nine-case harness |
| `.opencode/skills/sk-git/scripts/commit-id-naming.sh` | Created | Ordinal allocator with lock, high-water and rebuild |
| `.opencode/skills/sk-git/scripts/tests/commit-id-naming.test.sh` | Created | 35-case harness |
| `.opencode/scripts/git-hooks/prepare-commit-msg` | Created | Stamper |
| `.opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh` | Created | 43-case harness |
| `.opencode/scripts/git-hooks/README.md`, `tests/README.md` | Modified | Inventory rows |
| `.opencode/skills/sk-git/SKILL.md` | Modified | ALWAYS 5, body contract, self-check, NEVER 11, four rules condensed under the word cap |
| `.opencode/skills/sk-git/assets/commit-message-template.md` | Modified | Trailer paragraph in template and examples, overview section |
| `.opencode/skills/sk-git/references/commit-workflows.md` | Modified | Step 5 |
| `.opencode/skills/sk-git/references/quick-reference.md` | Modified | Spec env example and Find commits queries |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four briefs, one change each, in the order the decisions fixed: hook whitelist first, allocator, stamper, then documents. Each child returned evidence, and the conductor re-ran every harness and validator before committing. The first detached child died silently with an empty log after writing the hook edit; the attached background runner was used from then on and is recorded as this phase's one architecture decision. SKILL.md crossed the 5,000-word package cap by 114 words, so four ALWAYS rules that restated their references were condensed. Four commits landed on the worktree branch: `43f727bc1b`, `cda76b4ad9`, `e5a85ced55`, `3bfb4619c6`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hook before stamper, as separate commits | A stamped body of machine keys would satisfy the four-path gate until the whitelist landed |
| Duplicate scan excludes HEAD | An amend keeps its id, and a cherry-pick's copy is never HEAD |
| Allocator failure never blocks a commit | The commit-msg hook still validates; a dead allocator must not stop work |
| Trim SKILL.md prose rather than raise the cap | The cap is fleet-wide and out of scope; the trimmed rules already pointed at their references |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| commit-msg.test.sh | PASS=9 FAIL=0 |
| commit-id-naming.test.sh | PASS=35 FAIL=0 |
| prepare-commit-msg.test.sh | PASS=43 FAIL=0, including a real commit through both hooks |
| worktree-naming.test.sh and pre-commit.test.sh | still passing, 71 and 22 |
| run-all-drift-guards.sh | all 3 guards PASSED |
| validate_document.py x4 and package_skill.py --check | VALID x4, Result: PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not live on this machine yet.** The global hooks path points at the main clone, so the stamper runs for real only after the merge. The harness proves it in a fixture with its own hooks path.
2. **Spec is opt-in.** The stamper adds `Spec:` only when `SPECKIT_COMMIT_SPEC` is set. Nothing guesses a packet from paths, on purpose.
3. **History carries no ids yet.** The allocator previews 0000001 until phase 005 retrofits the history and rebuilds the high-water.
<!-- /ANCHOR:limitations -->

---


