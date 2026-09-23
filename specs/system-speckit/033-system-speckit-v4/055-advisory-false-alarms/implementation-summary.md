---
title: "Implementation Summary"
description: "A shell-expanded pathspec no longer draws a sk-git advisory and a cited document no longer tricks the completion sentinel into warning about a packet that has its evidence."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/055-advisory-false-alarms"
    last_updated_at: "2026-09-23T19:11:00Z"
    last_updated_by: "implementing-agent"
    recent_action: "Fixed both false alarms at their producers and verified them with a negative control"
    next_safe_action: "Operator approves pushing branch 065 to main and skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs"
      - ".skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "055-implementation-2026-09-23"
      parent_session_id: null
    completion_pct: 95
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
| **Spec Folder** | 055-advisory-false-alarms |
| **Completed** | 2026-09-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two advisories no longer warn about problems that were never there. The sk-git hook no longer tells you a `git add` matched nothing when the shell was about to expand the path. The completion sentinel no longer warns that a packet lacks evidence because a reply cited one of its documents.

### Stop the sk-git pathspec advisory and the completion-evidence sentinel from raising false alarms

When you stage files through a variable such as `git add -- $A/file`, the hook now stays quiet instead of warning that the path matches nothing. The parser marks any pathspec that needs the shell and the two checks that report an absence skip it. Checks that look for something present were already silent. The destructive-command checks still fire. When a reply cites `specs/<track>/<packet>/implementation-summary.md:16`, the sentinel now checks the packet folder rather than a path made of the file name and its line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs | Modified | `parseGitCommand` returns `pathsResolved`. `add-pathspec-matches-nothing` and `commit-pathspec-empty-change` stay silent when it is false |
| .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs | Modified | A `$`, backtick or `~` pathspec never reads as matching nothing |
| .skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs | Modified | `resolveSpecFolderFromText` trims a line suffix and a trailing file name |
| .skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts | Modified | A cited `path:line` document resolves to its folder |
| specs/system-speckit/033-system-speckit-v4/spec.md | Modified | Phase-map and transition rows for this phase |
| specs/system-speckit/033-system-speckit-v4/graph-metadata.json | Modified | Re-derived so the parent lists this phase as a child |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both alarms were first reproduced with a scratch script against the unmodified modules. The baselines were captured before any edit. MiMo V2.6 Pro wrote each code edit and each doc through cli-pi on the LLM Gateway route, one change per brief. Each edit was checked byte for byte against a generated expected file. The orchestrating session ran every check. The negative control swapped the old sources back in, watched each new test fail and restored the new sources byte-identical. Main moved while the work sat uncommitted, so the branch was fast-forwarded and every check ran again on the merged tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mark the pathspec in the parser, not in each check | The parser is where the literal text is produced. It already reports an unknowable directory the same way |
| Guard only the two checks that report an absence | A literal `$X/...` never matches, so checks looking for something present were already silent. Guarding the shared context helper would also have muted `git reset --hard $REF` |
| Keep the resolver's contract of any path under `specs/` | The existing test pins an unnumbered path, so the fix trims the file name and line suffix rather than requiring numbered segments |
| One packet for both fixes, numbered 055 | The operator asked for one packet under the system-speckit v4 parent. Main had taken 051 to 053 and another branch holds 054 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reproduction before the fix | Observed: `git add -- $A/README.md`, `` git add `echo README.md` `` and `git add ~/x.md` raised `add-pathspec-matches-nothing`, `git commit --only $A/README.md -m x` raised `commit-pathspec-empty-change` and the resolver returned `.../implementation-summary.md:16` for a cited document. The sentinel's own log holds three such advisories from one session |
| Baselines | sk-git check suite 25 of 25, sentinel suite 23 of 23 |
| Negative control | PASS: on the old sources the new sk-git test failed (25 of 26) and the new sentinel test failed with `expected 'specs/some-track/123-some-packet/impl…' to be 'specs/some-track/123-some-packet'` (23 of 24). The new sources were restored byte-identical |
| sk-git suites (`node --test` on both test files) | PASS: 33 of 33 on the merged tree |
| Sentinel suite | PASS: 24 of 24 |
| Completion-evidence stop-hook suite | PASS: 7 of 7 |
| Full spec-kit root project | PASS: 1294 of 1307 tests in 109 files passed on the merged tree with 13 skipped and none failed. An earlier run on the original base under the runtime config reported 7 failed tests in 4 files. Three of those files failed only because a fresh worktree lacks their build outputs. The fourth, the Pi spec-gate suite, fails only under that config because the path alias it needs is defined in the root config alone. It passes 9 of 9 under the root config |
| Scratch replay after the fix | PASS on the original base and again on the merged tree: every expansion form is silent, `git reset --hard $REF` still raises `reset-hard-discards-changes` on a tree with changes and the cited document resolves to `specs/system-skill-advisor/029-fix-remaining-advisor-defects` |
| Comment hygiene on the four edited files | PASS: exit 0 |
| Packet strict validation (`validate.sh --strict`) | PASS: RESULT: PASSED, Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hook still reads git commands inside quoted strings and heredoc bodies.** A literal such as `echo "x && git add missing.txt"` is parsed as a git command. A pathspec with `$` there is now silent. A shell-aware tokenizer would close the rest.
2. **A document cited from a packet subfolder resolves to the subfolder.** The resolver has no filesystem access, so `.../scratch/notes.md:3` points the evidence check at `scratch`.
3. **A single-quoted `'$A/x'` is treated as unresolved.** The shell passes it as written. The check now stays silent for it, which is the fail-open direction.
4. **The push waits on the operator.** The work sits on `worktrees/065-fix-advisory-false-alarms` until the operator approves the push to main and skilled/v4.0.0.0.
<!-- /ANCHOR:limitations -->

---
