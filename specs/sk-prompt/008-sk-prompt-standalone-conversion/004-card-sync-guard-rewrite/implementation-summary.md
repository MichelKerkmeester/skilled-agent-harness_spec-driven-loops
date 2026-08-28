---
title: "Implementation Summary"
description: "The drift guard now enforces the two invariants that still exist and passes clean, and a pre-existing defect in the pre-commit hook's path regex - which had been silently excluding the surfaces it was meant to catch - was found and fixed while rewriting it."
trigger_phrases:
  - "008 phase 004 summary"
  - "card-sync-guard-rewrite results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/008-sk-prompt-standalone-conversion/004-card-sync-guard-rewrite"
    last_updated_at: "2026-08-28T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 4 complete; acceptance checks recorded"
    next_safe_action: "Execute 005-cli-orchestration-repoint"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-004-card-sync-guard-rewrite"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Keep CHECK 1 and CHECK 2 rather than retire the guard"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-card-sync-guard-rewrite |
| **Completed** | 2026-08-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The drift guard now enforces the two invariants that still exist and passes clean, and a pre-existing defect in the pre-commit hook's path regex - which had been silently excluding the surfaces it was meant to catch - was found and fixed while rewriting it.

### Two checks removed, two kept and repointed

The registry-completeness and discovery-reachability checks existed only to validate the deleted model registry against itself. The table-inlining and pointer-only checks compare executor cards against a canonical home that survives, so they were kept and their canonical-location header moved to the surviving paths.

### A latent hook defect surfaced

The pre-commit regex named `prompt_quality_card.md` and `cli_prompt_quality_card.md` - underscored filenames that do not exist in this repository - and a top-level path that was never valid. It could not have matched the surfaces it was written to guard. The replacement is self-tested against four paths that must match and one that must not.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/check-prompt-quality-card-sync.sh` | Modify | Excise the two registry-reading checks; repoint the canonical-location header |
| `.github/workflows/prompt-card-sync.yml` | Modify | Describe the two checks that remain |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | Correct the staged-path regex and the remediation pointer |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The guard was run against the post-deletion tree first, so the failure and the exact surviving PASS lines were observed rather than assumed. The excision was made as one contiguous span with an assertion on both boundary markers, so a partial edit would have raised rather than silently truncated the script. Both the guard and the hook were syntax-checked before being run, and the regex was proven with a positive and negative case rather than by reading it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep CHECK 1 and CHECK 2 rather than retire the guard | Their subject - the canonical card and the executor cards that delegate to it - survives, so the drift class they prevent is still live. |
| Fix the pre-commit regex rather than leave it | It was already broken in a way that disabled the hook silently; leaving it would have carried a known-dead guard forward. |
| Assert on both excision boundaries | A find-based span removal that silently matches nothing is the failure mode that produces a subtly wrong script. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guard exit status | PASS - `GUARD PASS`, exit 0 |
| CHECK 1 across four executor cards | PASS |
| CHECK 2 across four executor SKILL.md files | PASS |
| Guard and hook syntax | PASS - `bash -n` clean on both |
| Pre-commit regex self-test | PASS - 4 match, 1 control correctly does not |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The guard no longer verifies that every adopted model is reachable by name.** That check had no subject once the registry was deleted. If a per-model discovery concept returns, the check would need to be rewritten against whatever holds that data, not restored as-is.
2. **CHECK 2 tests for the presence of a pointer string, not that the pointer resolves.** A card naming the canonical file but at a wrong relative depth still passes this guard; the markdown link-integrity checker is what catches that class, and it was run separately.
<!-- /ANCHOR:limitations -->

---
