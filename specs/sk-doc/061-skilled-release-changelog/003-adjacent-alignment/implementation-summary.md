---
title: "Implementation Summary: Phase 3: adjacent-alignment"
description: "The surfaces next to the changelog work now match it: /create:changelog resolves hub skills, the validator checks every changelog entry and the nested generator renders any title safely."
trigger_phrases:
  - "adjacent-alignment summary"
  - "changelog surface fixes results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/061-skilled-release-changelog/003-adjacent-alignment"
    last_updated_at: "2026-09-27T18:34:57Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 3 with 12 of 12 criteria Met on the final tree"
    next_safe_action: "Commit by owner, rebuild the trigger index from committed content, then push"
    blockers: []
    key_files:
      - ".skilled/commands/create/assets/create-changelog-auto.yaml"
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts"
      - ".skilled/changelog/skilled/v4.0.0.2.md"
    session_dedup:
      fingerprint: "sha256:ec931ee5140dc406c27fd095f06f946d0211a5e900d11a57be4527e7340969b0"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 3: adjacent-alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-adjacent-alignment |
| **Status** | Complete |
| **Completed** | 2026-09-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The tools and docs around changelogs now match what phases 1 and 2 made of them. A run of `/create:changelog sk-doc` finds the hub's version and the validator checks all 1,968 entries Gate 1 can see. A quote in a spec title no longer breaks a packet changelog.

### Phase 3: adjacent-alignment

Hub skills resolve to their own changelogs. A hub such as `sk-doc` keeps a folder of links in `.skilled/changelog/`, one per mode plus `parent`, so the workflow found no version there and would have written beside the links. Step 2 of both workflows now resolves a hub to `parent` or to the link whose target is the changed mode's changelog. The mode contract, CHG-001 and the docs describe the rule.

The validator checks every entry. It used to type three packet changelogs about install guides as install guides, and to skip five in a phase folder named for its fixtures. The changelog folder now decides the type first, and a folder whose name starts with a spec number is never a fixture tree.

Packet changelogs render safely. The generator escapes the title, description and identity phrase for the double-quoted YAML the templates wrap them in, and it fills the template in one pass with a function, so `$&` or `$'` in a value stays literal.

The rest caught up. The command and mode READMEs, the retrieval library README, the frontmatter reference and the `.opencode` manifests describe what ships. Two catalogs and one playbook scenario cover the new behavior, and the v4.0.0.2 draft gains a Changelogs section. Two packets stored `parent_id` as the string `"null"` and now store JSON null.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/create/assets/create-changelog-auto.yaml`, `create-changelog-confirm.yaml` | Modified | Hub resolution in step 2, the hub scan commands and the `{component}` rule |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modified | The hub rule, the identity-phrase note and version 1.3.1.0 |
| `.skilled/skills/sk-doc/sk-create-changelog/README.md` | Modified | Search metadata, the release gate and a troubleshooting row for hubs |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/**` | Modified | CHG-001, CHG-006 and the index |
| `.skilled/commands/create/README.txt` | Modified | The changelog row, the example, the FAQ and the troubleshooting fix |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | Type by folder first, and numbered folders out of the fixture rule |
| `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py` | Modified | Three cases |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modified | The changelog entry type and a corrected validator claim |
| `.skilled/skills/sk-doc/feature-catalog/**` | Created, Modified | The changelog check entry in a new Document Validation group |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts`, `tests/nested-changelog.vitest.ts` | Modified | Escaped values, literal pasting and a case for both |
| `.skilled/skills/system-spec-kit/feature-catalog/**`, `manual-testing-playbook/**` | Created, Modified | The generator entry and scenario 458 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | Modified | The fourth corpus root |
| `.opencode/SYNC.md`, `.opencode/README.md` | Modified | Rows for the links that exist |
| `.skilled/changelog/skilled/v4.0.0.2.md` | Modified | Two bullets, a Changelogs section and one upgrade note |
| `specs/system-speckit/027-*/graph-metadata.json`, `specs/sk-git/023-*/graph-metadata.json` | Modified | `parent_id` as JSON null, without the stale review flag |
| `sk-create-changelog/changelog/v1.3.1.0.md`, `sk-doc/changelog/v2.2.2.0.md`, `system-spec-kit/changelog/v4.1.3.0.md` | Created | One entry per changed component |
| Each `SKILL.md` version, the sk-doc hub's four other version files and 10 child docs | Modified | The new versions, with child values from `frontmatter-version.mjs` |
| `.hermes/skills/sk-doc/SKILL.md`, `sk-create-changelog/SKILL.md`, `system-spec-kit/SKILL.md` | Modified | Regenerated by the Hermes sync |
| This folder and the parent `spec.md` | Created, Modified | The phase record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each defect was reproduced before its fix. The version reader ran on the hub folders, the old validator ran on the eight entries and HEAD's renderer ran on a scratch packet with a quoted title. Each fix landed where the behavior is produced, with a test that fails on the old code. The docs were corrected against the fixed behavior, then the versions were computed and the Hermes copies regenerated. Every check ran again on the final tree, and each baseline was compared with its rerun.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve a hub in step 2, not in the reader or the write | Both read the resolved path, so one rule covers them |
| The changelog folder decides the type before a word in the name | The folder is the stronger signal, and the order leaves a real `INSTALL-GUIDE.md` alone |
| Exempt numbered folders from the fixture rule instead of listing them | Any spec packet may be named for its fixtures, and a list would need upkeep |
| Fill the template with one replacer function instead of escaping `$` | A function hands each value over verbatim, and one pass never rescans a value for placeholders |
| Remove the review flag along with the string | The flag marks a parent kept through a refresh, and a refresh drops it once `parent_id` is null |
| Record the frontmatter reference change in the sk-doc entry | The change documents the hub's validator check, so the hub entry is where a reader looks for it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Before this phase | Final tree |
|-------|-------------------|------------|
| Version reader on `sk-doc` and `sk-code` | No version | The hub folders still read none, and their links read `v2.2.2.0` and `v4.2.3.0` |
| Validator on the eight mistyped entries | 3 failed as install guides, 5 skipped | 8 typed `changelog`, 8 valid |
| Renderer on a quoted title | YAML error, summary lost | Parses, summary literal |
| Sweep of all 2,222 changelog files | 66 failed, 8 skipped | 63 failed, the same files, 3 templates skipped |
| Entries Gate 1 can see | 1,960 of 1,968 checked as changelogs | 1,968 of 1,968 checked and passing |
| Changelog validator and exclusion tests | 9 cases at HEAD | 12 cases, all passing |
| Full sk-doc pytest | 117 passed and 2 failed in the rename-tooling suite | 121 passed and 1 failed in the same suite. That test passes alone |
| Five cli vitest suites and `npm run typecheck` | - | 81 of 81, exit 0 |
| Catalog validators, sk-doc and system-spec-kit | 6 and 84 findings | 6 and 84, none new |
| Playbook packages | PASS, PASS | PASS, PASS, CHG-006's voice score 99 to 100 |
| `check-frontmatter-versions.sh` | exit 0 | 2,960 files, exit 0 |
| Drift guards | exit 0 | exit 0, no warning on a changed file |
| Hermes copies | 3 drifted | 71 in sync |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The committed index is rebuilt after the phase's commits.** It is rebuilt from committed content in the commit that follows them.
2. **Packet 027 still fails strict validation.** `FRONTMATTER_MEMORY_BLOCK` and `SPEC_DOC_SUFFICIENCY` record documents only its owner can write. Its metadata path check now passes.
3. **Archived and containment copies still fail the changelog check.** 59 files in `z_archive` and 4 review containment copies lack the block, as they did before phase 2.
4. **The version tool rejects two index names as explicit targets.** `frontmatter-version.mjs` reads `feature-catalog.md` and `manual-testing-playbook.md` as catalog roots, so their values came from a discovery run and were set by hand.
5. **A spec title that starts with "The" reads twice in a generated description.** The template writes `for the {title} spec root`, so a title such as `The "Quiet" Session` renders as `the The`.
6. **The validator types a spec document only from an absolute path.** A relative `specs/...` path types it as a README.
<!-- /ANCHOR:limitations -->

---
