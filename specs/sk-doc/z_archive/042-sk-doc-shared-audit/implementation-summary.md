---
title: "Implementation Summary: sk-doc shared/ audit"
description: "Audited 14 items under sk-doc/shared, kept 8 unchanged, repaired 5 and removed 1 orphan, after proving each defect with the check that exposed it."
trigger_phrases:
  - "sk-doc shared audit summary"
  - "shared backbone repair result"
  - "shared orphan removal"
  - "llmstxt validator fiction"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/042-sk-doc-shared-audit"
    last_updated_at: "2026-08-31T20:10:00Z"
    last_updated_by: "stream-3"
    recent_action: "Audited shared/ and repaired five files"
    next_safe_action: "Hand spec.md section 9 proposals to their owners"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/references/frontmatter-versioning.md"
      - ".opencode/skills/sk-doc/shared/references/quick-reference.md"
      - ".opencode/skills/sk-doc/shared/references/core-standards.md"
      - ".opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md"
      - ".opencode/skills/sk-doc/shared/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "stream-3-042-sk-doc-shared-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does any shared file belong inside a single mode? No. Every file with real consumers has consumers in two or more packets, or is reached through leaf-aliases.json."
      - "Does any shared file belong under repo-rules/? No. The naming canon is enforced by gates that live in shared/scripts, and REPO RULES.md has no naming trigger row."
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
| **Spec Folder** | 042-sk-doc-shared-audit |
| **Completed** | 2026-08-31 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The audit found no dead weight worth moving and no file worth deleting, which is the outcome an honest audit reaches most of the time. What it did find was rot: one shared reference had been failing the hub's own document validator, six template paths across two files stopped resolving when the hub gave up its root `assets/` directory, and both of the hub's structural standards documented an `llms.txt` document class with an enforcement level that no validator, no rule file and no file in the repository backs. Ten claims that a reader would have acted on were false. They are now true.

### Verdicts

Fourteen items were audited: seven references, five assets, one placeholder and `shared/README.md`. Eight came out at "keep, unchanged" with real consumers and correct placement. Five carried proved defects and were repaired in place. One, `assets/.gitkeep`, was the only orphan and was removed.

Two files looked like orphans and were not. `skill-contract.json` and `template-rules.json` are cited by path in zero documents, because their loaders resolve them from `__dirname`. `template-rules.json` turns out to be the most load-bearing file in the folder: it is the document-type contract behind `validate_document.py`, which every packet's delivery gate runs.

`hvr-rules.md` stays exactly where it is. 244 files repo-wide carry its path, 202 of them frozen spec history, plus ten `system-spec-kit` templates, six of its test fixtures and a golden snapshot. Moving it would falsify the record and break a test suite in another skill.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/shared/references/frontmatter-versioning.md` | Modified | Section 1 renamed to `OVERVIEW AND SCOPE` so the file stops failing `validate_document.py`; the dead `scripts/frontmatter-version.*` pointer replaced with two links that resolve |
| `.opencode/skills/sk-doc/shared/references/quick-reference.md` | Modified | Six non-resolving paths repaired, the packet enumeration replaced by a pointer to `mode-registry.json`, the `llms.txt` enforcement claim corrected, `git-commit` replaced by `sk-git` |
| `.opencode/skills/sk-doc/shared/references/core-standards.md` | Modified | The `llmstxt` detection and enforcement rows removed and replaced by the real `--type` list, the command template path corrected, the dead `document_style_guide.md` pointer dropped |
| `.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md` | Modified | Section 7 now names the three gates that enforce the canon instead of describing a classifier that never did; section 8 no longer carries packet identifiers into an evergreen reference |
| `.opencode/skills/sk-doc/shared/README.md` | Modified | Two false symlink claims and the scaffold-phase language replaced with the facts a repo-wide symlink walk returned, plus the hook and facade constraints that make `shared/scripts/` immovable |
| `.opencode/skills/sk-doc/shared/assets/.gitkeep` | Deleted | Orphan placeholder in a directory holding five tracked files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines first, into this packet, before any edit. Every claim was reproduced before it was called a finding, and two of them carried a negative control. The `frontmatter-versioning.md` fix was applied to a scratch copy and watched to move from exit 1 to exit 0 before the real file was touched. The claim that `validate_document.py` enforces a filename rule was tested by validating a scratch file deliberately named `my_under_score.md`; it passed clean, which is what proved the claim false.

Path repairs were checked against the filesystem with `find` and `ls`, never against another document, because a document citing a document is how the six dead paths survived in the first place. The markdown link guard never caught them: they sit inside backticks, not inside markdown links.

Nothing is committed and the git index was never touched. The `.gitkeep` removal was deliberately moved out of the index and back into the worktree so it sits in the same class as the five content edits, and so a path-scoped commit from a concurrent stream cannot sweep it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep every file with consumers where it is | Eleven of the twelve have consumers in two or more packets. The twelfth, `llmstxt-templates.md`, has one, and its move was costed and rejected on its own terms rather than on the count |
| Reject moving `llmstxt-templates.md` into sk-create-quality-control | The alias table already routes it to that mode. Moving it costs edits in `ROUTER.md`, `leaf-aliases.json`, a `leaf-manifest.json` regeneration and one packet template, and buys nothing measurable |
| Reject promoting the naming canon to `repo-rules/` | Its three enforcing gates live in `shared/scripts/`, and `REPO RULES.md` routes on the action taken, where naming has no trigger row. A rule file added there would be loaded by nothing |
| Replace the packet enumeration rather than update it | The tree in `quick-reference.md` had already gone stale once and would go stale again the next time a packet lands. Its own closing paragraph already told the reader to read `mode-registry.json` |
| Delete the `llms.txt` enforcement rows rather than build the validator | The rows describe a document class the repository has never produced. Removing a false claim is in scope for an audit; adding a validator is not |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` across all 11 shared markdown files | PASS 11 of 11. Baseline was 10 of 11, with `frontmatter-versioning.md` failing on `missing_required_section: overview` |
| `check-markdown-links.cjs` | PASS, 0 broken under `sk-doc/shared/`. Repo-wide count back to the baseline 3, all pre-existing in `system-spec-kit/assets/template-mapping.md` |
| `leaf-resource-contract.test.cjs` | PASS, unchanged from baseline |
| `parent-skill-check.cjs .opencode/skills/sk-doc` | PASS, all hard invariants, 0 warnings, including `10b-byte-drift` on the generated `leaf-manifest.json`. It failed transiently mid-run on another stream's unregistered `sk-create-with-human-voice` directory and cleared when that stream registered its mode |
| `git status` under `shared/` | 6 worktree changes, 0 staged, 0 committed |
| `validate.sh specs/sk-doc/042-sk-doc-shared-audit --strict` | `RESULT: PASSED`, Errors: 0, Warnings: 0 |
| Negative control, D1 | Scratch copy moved exit 1 to exit 0 under the proposed heading rename, before the real file was edited |
| Negative control, D6 | `my_under_score.md` validated clean at exit 0, proving `validate_document.py` applies no filename rule |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`shared/scripts/` was audited only for consumers, not for content.** It is propose-only for this stream: `sk-doc/scripts/` holds six facade symlinks into it, and `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:38` hard-codes a path into it. Its own `.gitkeep` is the same orphan removed from `assets/` and is left in place for the same reason.
2. **The mismatch between the hub's defer fallback and the defer question is recorded, not fixed.** `hub-router.json` hands a confused caller a validation cheat sheet rather than a mode list. Only the owner of the hub-root files can change `routerPolicy.defaultResource`, so `spec.md` section 9.1 states the observation and stops there.
3. **`quick-reference.md` still duplicates the quality-gate and DQI tables in `validation.md`.** Both are routed and both are loaded on the doc-quality path, so the duplication has a real cost. Collapsing it is a content rewrite of a file that had no proved factual defect in those sections, which put it outside this packet's scope.
4. **Nothing is committed.** Six worktree changes sit uncommitted by design, because three other agents share this tree.
<!-- /ANCHOR:limitations -->

---
