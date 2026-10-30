---
title: "Implementation Summary"
description: "A `cd` that reaches the git command through an environment assignment no longer loses the directory, so the preflight advisory stops warning about files that are present in the worktree the command runs in."
trigger_phrases:
  - "advisory cd prefix env steps implementation summary"
  - "assignment step between cd and git summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/037-advisory-cd-prefix-env-steps"
    last_updated_at: "2026-10-30T16:45:00Z"
    last_updated_by: "code-agent"
    recent_action: "Widened the cd pattern, added four assertions, bumped the skill to 1.11.7.0"
    next_safe_action: "Operator reviews the diff and commits it"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs"
      - ".skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs"
      - ".skilled/skills/sk-git/changelog/v1.11.7.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-037-advisory-cd-prefix-env-steps"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 037-advisory-cd-prefix-env-steps |
| **Completed** | 2026-10-30 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A git command typed against a worktree is judged by that worktree's state even when the shell exports a variable between the `cd` and the git word. Before this change the two `export` shapes lost the directory, so `add-pathspec-matches-nothing` warned about files that were present in the directory the command actually ran in.

### Teach the git preflight advisory that environment assignments between cd and git keep the cd

The cd pattern now skips zero or more assignment-only steps before the git word. A step is an optional `export` followed by one or more `NAME=value` words, closed by `;` or `&&`, so a step that runs any other command still breaks the chain and leaves the directory unproven. That asymmetry is the point: the pattern accepts exactly the shape that cannot move the directory, and stays silent about the rest rather than guessing.

Four assertions sit beside the existing `cd` and `-C` cases. Three expect silence for the recognised shapes and one expects the advisory for `cd <worktree> && echo hi; git add <paths>`, where a non-assignment step sits between the two. The bare assignment shape already worked before the change, because the older pattern read the `;` as part of the value, and it is asserted so a later tightening cannot drop it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs` | Modified | The cd pattern skips assignment-only steps, and the comment says why an assignment cannot move the directory |
| `.skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` | Modified | Three shapes asserted silent, one asserted warning |
| `.skilled/skills/sk-git/SKILL.md` | Modified | Frontmatter version 1.11.7.0 |
| `.skilled/skills/sk-git/changelog/v1.11.7.0.md` | Created | Release note |
| `specs/sk-git/graph-metadata.json` | Modified | Track root lists the new packet, written by the scaffold step |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The pattern was checked directly before and after the edit, with the shipped regular expression extracted from the file rather than retyped, so the reading describes the code that ships. Then the three test files under the skill were run, each named explicitly, and the packet was validated with `validate.sh --strict` and scanned for unfilled placeholders.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Allow the assignment step inside the cd pattern rather than relaxing the advisory rule | The rule is right about a path that matches nothing. The defect was in which directory it read, so the fix belongs where the directory is resolved. |
| Require the step to close with `;` or `&&` | A step with no terminator runs into the next word, and the pattern could then read a command as an assignment value. |
| Keep the assertion set to four shapes | The three recognised shapes are the ones a shell produces today, and the rejected one is the boundary that proves the pattern is not simply skipping anything. |
| Leave `GIT_SHAPE` and `GIT_INVOCATION` untouched | Both already reach a git word behind a separate step, so the cd pattern was the only place the shape was lost. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` | PASS, 29 tests, 0 failures |
| `node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` | PASS, 38 tests, 0 failures |
| `node --test .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs` | PASS, 7 tests, 0 failures |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-git/037-advisory-cd-prefix-env-steps --strict` | PASS, `RESULT: PASSED` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/sk-git/037-advisory-cd-prefix-env-steps` | PASS, no placeholders |
| Shipped pattern against the four shapes | Silence for the three assignment shapes, warning for the `echo` shape |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A step that does more than assign still leaves the directory unproven.** A shape such as `cd <worktree> && export A=1 || true; git add ...` is not recognised, so the command is judged against the session checkout. The advisory may warn about a path that exists in the worktree. Read the pathspec before acting on that warning.
<!-- /ANCHOR:limitations -->

---
