---
title: "Implementation Summary"
description: "The README audit now counts 48 fewer broken references and two fewer invalid READMEs, because it stopped flagging runtime paths, package-relative paths and files that are not READMEs; the changelog check no longer reads SHA-256 as an id."
trigger_phrases:
  - "audit and validator accuracy implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt/006-audit-and-validator-accuracy"
    last_updated_at: "2026-10-27T10:30:00Z"
    last_updated_by: "lane-z2-conductor"
    recent_action: "Recorded what changed and how it was verified"
    next_safe_action: "Commit this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-z2-repo-doc-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-audit-and-validator-accuracy |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The README audit now counts 48 fewer broken references and two fewer invalid READMEs, because it stopped flagging runtime paths, package-relative paths and files that are not READMEs. The changelog check no longer reads SHA-256 as an id.

### README audit and changelog validator accuracy

A reference that does not resolve but names a git-ignored path inside the repo is reported under `resolved_references` with evidence `gitignored_runtime_path`; all such paths go to git in one `check-ignore` call. A bare token also resolves from the nearest folder above the README that holds a `package.json`. Discovery and the durable manifest accept only `README.md` and `README.markdown`, and a folder ending in `-fixture` is test input. The changelog id pattern skips SHA, AES, RSA, CRC and DES prefixes and now also matches task ids such as T039.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` | Modified | Gitignore pass, package-root base, exact README names, `-fixture` rule |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | Changelog id pattern |
| `.skilled/skills/sk-doc/scripts/tests/test_audit_readmes_accuracy.py` | Created | Seven audit regression tests |
| `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py` | Modified | Two id pattern tests |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerated | Removes `.claude/commands/create`, `.skilled/commands/create`, `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment-fixture` |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/README.md`, `.skilled/skills/sk-doc/scripts/tests/README.md` | Modified | Describe the checks and the new test |
| `.skilled/skills/sk-doc/changelog/v2.3.17.0.md` and four version carriers | Created, Modified | Patch entry |
| `.hermes/skills/sk-doc/SKILL.md` | Regenerated | Version line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor made the edits directly instead of through the dispatcher, because its own instructions forbid dispatching another agent. Each new test was run against the HEAD scripts to prove it fails before the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The folder of an ignored path must exist or be ignored | Without it, the rule `runtime/lib/**/*.js` cleared the doubled path `./adapters/ollama.js`, a real typo |
| Package-root base only for tokens without `./` or `../` | A dotted token names a path from the README; reading it from the package root made two wrong `vitest.config.ts` links resolve by accident |
| No symlink change | 0 of 98 broken references resolve from any of 479 symlinked aliases of their README folder, and `Path.resolve()` already follows symlinks on the target side |
| T ids added to the pattern | The brief requires T039 to warn; the old pattern never matched it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `audit_readmes.py` | 237 / 98 / 14 to 235 / 50 / 13 |
| Changelog check over 884 files | SHA-256 warnings 4 to 0; 2 files now warn on real T ids |
| New tests against HEAD scripts | 8 fail before, pass after |
| `run-script-tests.sh` | all sk-doc script tests passed, before and after |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two changelog entries now warn on task ids.** system-spec-kit `v0+/v0.3.0.6.md` (T005, T028, T033) and `v0+/v0.3.1.0.md` (T031); outside this packet's files.
2. **One package-relative hit lands on a build output.** `runtime/data/trigger-index.json` in the retrieval README resolves through the `runtime/cli/runtime` symlink into ignored `runtime/dist/`; the committed file sits at the skill's own `runtime/data/`.
3. **Local pytest is 9.1.1.** CI pins 8.4.2.
<!-- /ANCHOR:limitations -->
