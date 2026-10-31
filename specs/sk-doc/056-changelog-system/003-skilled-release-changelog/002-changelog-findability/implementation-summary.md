---
title: "Implementation Summary: Phase 2: changelog-findability"
description: "Every changelog entry now carries the five search keys a spec document carries. Both changelog writers produce them and the sk-doc validator blocks an entry that lacks them."
trigger_phrases:
  - "changelog findability summary"
  - "changelog findability stage 2"
  - "changelog retrofit results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/061-skilled-release-changelog/002-changelog-findability"
    last_updated_at: "2026-09-27T15:13:05Z"
    last_updated_by: "generate-context"
    recent_action: "Parent re-verified phase 2, aligned the sk-doc hub version and ran the Hermes sync"
    next_safe_action: "Commit phase 2 in owner-split commits, rebuild the committed trigger index and push"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-changelog/SKILL.md"
      - ".skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts"
      - ".skilled/skills/system-spec-kit/templates/changelog/phase.md"
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
    session_dedup:
      fingerprint: "sha256:aad7bf56619627557af3a8ab2350579adec273cea6a5cb7169f78357d260ca89"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 2: changelog-findability

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-changelog-findability |
| **Status** | Complete |
| **Completed** | 2026-09-27, awaiting the parent's commit |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every changelog in the repository can now be found the way a spec document is found. A lookup for `sk-git v1.0.0.0`, `skilled v3.4.0.0` or `memory store and search changelog` ranks that entry first with an exact match, where before the entry did not rank at all.

### Phase 2: changelog-findability

New entries are born findable. sk-create-changelog's contract, template, worked example and both `/create:changelog` workflows write and check a five-key frontmatter block, and two playbook scenarios cover it. The nested generator derives an identity phrase from each packet changelog's path and writes it where the templates used to write three shared phrases.

Old entries were made findable. All 1,959 entries gained their missing keys without a changed body byte. Identity phrases come from each path and descriptions from each entry's opening sentence. The 532 skill and release entries that declared no phrase received topic phrases from DeepSeek V4.1 Flash lanes behind a checker. The five retired template phrases left all 468 packet changelogs that carried them.

The contract now holds. `validate_document.py` blocks an entry that lacks the block, a key, a trigger phrase or a phrase naming its version. Three component entries record the change: sk-create-changelog 1.3.0.0, system-spec-kit 4.1.2.0 and sk-doc 2.2.1.0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` | Modified | Derives and renders the identity phrase |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts` | Modified | Phase, root and long-name cases |
| `.skilled/skills/system-spec-kit/templates/changelog/phase.md`, `root.md` | Modified | One `{{CHANGELOG_IDENTITY_PHRASE}}` member replaces three defaults |
| `.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md` | Modified | A Search Metadata section with the rule |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modified | Frontmatter Contract, step 4, both check lists and version 1.3.0.0 |
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modified | The block in both skeletons |
| `.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md` | Modified | The example block and its annotation |
| `.skilled/commands/create/assets/create-changelog-auto.yaml`, `create-changelog-confirm.yaml` | Modified | Generate the block in step 4 and check it in step 5 |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/**` | Created, Modified | CHG-011, CHG-012 and the index section |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | The changelog frontmatter check |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modified | Five required fields for the changelog type |
| `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py` | Modified | Five cases for the check |
| `sk-create-changelog/changelog/v1.3.0.0.md`, `system-spec-kit/changelog/v4.1.2.0.md`, `sk-doc/changelog/v2.2.1.0.md` | Created | One entry per changed component |
| `.skilled/skills/system-spec-kit/SKILL.md`, `.skilled/skills/sk-doc/SKILL.md` | Modified | Each `version:` names its newest entry |
| `.skilled/skills/sk-doc/mode-registry.json`, `description.json`, `hub-router.json`, `ROUTER.md` | Modified | The hub version 2.2.1.0 in every file that states it, set by the parent |
| `.hermes/skills/sk-doc/SKILL.md`, `sk-create-changelog/SKILL.md`, `system-spec-kit/SKILL.md` | Modified | Hermes copies regenerated by the parent's sync |
| 45 release, 542 skill and 1,372 packet-local entries | Modified | Frontmatter only |
| This folder's documents | Modified | The Stage 2 record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each file edit that carried authored text ran as a one-change DeepSeek V4.1 Flash lane on cli-pi, with only read, edit and write tools, and its result was compared byte for byte with the expected file before it counted. Edits that repeat across many files ran as scripts with a dry run first. Judgment ran in read-only cli-devin lanes, three at a time, and a record counted only after the checker admitted it and git status showed no change. The retrofit applied one kind at a time after a dry run whose sampled blocks were read by hand, and a scripted read of the git diff then proved every hunk sits inside the leading block.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Identity phrases come from the path (ADR-001, accepted) | The path already names the component, version, packet and phase, so both writers apply one pure rule |
| Descriptions quote the opening sentence (ADR-002, accepted and amended) | 517 of 529 entries state their summary first. The sentence rule keeps a stop inside a word, such as `v1.3` or `SKILL.md`, because the first rule turned 123 openings into fragments |
| DeepSeek lanes do only judgment work behind a checker (ADR-003, accepted) | 437 records ran through the checker, and every one was admitted before any reached a file |
| `validate_document.py` enforces the block after the retrofit (ADR-004, accepted) | The check landed on a tree that already passed it, so it flagged no retrofitted entry |
| The templates stop writing the defaults, and the old ones are gone (ADR-005, accepted) | The operator asked that every changelog be as findable as a spec document |
| The template placeholder is `{{CHANGELOG_IDENTITY_PHRASE}}` | The templates are in the index corpus, and `{{TRIGGER_PHRASE}}` would have made them the owner of "trigger phrase" |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Stage 2 baseline | Final tree |
|-------|------------------|------------|
| Retrieval suites | 71 of 71, exit 0 | 71 of 71, exit 0 |
| Nested changelog suite | 3 of 3, exit 0 | 6 of 6, exit 0 |
| `npm run typecheck` in `runtime/cli` | exit 0 | exit 0 |
| Changelog validator tests | 2 passed | 7 passed |
| Playbook package | PASS, 10 scenarios in 4 categories | PASS, 12 scenarios in 5 categories |
| `check-frontmatter-versions.sh` | 2,955 files, exit 0 | 2,957 files, exit 0 |
| Drift guards | exit 0, 0 errors | exit 0, 0 errors |
| Scratch index | 3,288,752 bytes, 28,555 phrases, 11,719 paths | 3,533,560 bytes (7.44 percent more), 31,919 phrases, 12,259 paths, 0 malformed, no negative class added |
| Cold lookup, p95 and max over three runs | 70 to 90 ms and 70 to 95 ms | 60 to 65 ms and 62 to 66 ms |
| Findability probes | Every target absent | Every identity and topic target first at 1.0, both negative controls unscored |
| Residue | 1,959 entries missing something, 468 default carriers | 0 and 0 |
| Parent re-verification | - | All 1,959 bodies byte-identical to HEAD, 534 new descriptions with no fragment, 77 of 77 vitest cases and 7 pytest cases passing, the validator passing 1,959 of 1,962 entries with the 3 failures already present at HEAD, and every identity probe first on a fresh scratch index |
| Ripgrep lane | - | `rg-wrapper.mjs structured --json` returns an exact `trigger_phrases` hit for `skilled v3.4.0.0`, `sk-git v1.0.0.0` and `mcp daemon reliability provider dispose changelog`, one phrase per kind |
| Second retrofit run | - | 0 of 1,959 entries changed and 0 phrases stripped, as the orchestrator observed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The committed index is rebuilt after this phase's commits.** The parent rebuilds it and its fixtures from committed content in the commit that follows them.
2. **Eight entries escape the new check.** The validator types five entries in a folder named for fixtures as unknown and three with install-guide names as install guides. Their metadata is complete, but the check does not guard them, and the three install-guide entries fail the install-guide rules exactly as they did before this phase.
3. **Archived and containment copies stay outside the retrofit.** The index does not read `z_archive`, and the check flags 59 of its 226 changelog files and 4 review containment copies.
4. **Some child documents carry an older version.** The READMEs of sk-create-changelog (1.1.0.12) and sk-doc (2.1.0.65) and the nested changelog reference (3.6.0.7) keep versions from before their skills' new entries. The version gate checks format only, so it passes them.
5. **The generator pastes a spec title raw inside double quotes.** A title that contains `"` would break the rendered frontmatter and stop the index from publishing. No current title does.
6. **The Skilled v4.0.0.2 release notes do not mention this change yet.** That entry is the operator's draft.
<!-- /ANCHOR:limitations -->

---
