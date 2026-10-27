---
title: "Implementation Summary"
description: "The deprecated packet changelog generator now refuses to create a new file, system-spec-kit SKILL.md fits its word cap again, and every doc, test and workflow the two alignment runs flagged matches the global-only contract."
trigger_phrases:
  - "alignment findings fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/026-alignment-findings-fixes"
    last_updated_at: "2026-10-27T19:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed F1 to F16 and F18, deferred F17 and closed the phase docs"
    next_safe_action: "Commit on the worktree branch, rebuild the trigger index after the rebase at push time"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts"
      - ".skilled/skills/system-spec-kit/SKILL.md"
      - ".skilled/skills/sk-doc/sk-create-changelog/SKILL.md"
      - ".skilled/commands/create/assets/create-changelog-auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-026-alignment-findings-fixes"
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
| **Spec Folder** | 026-alignment-findings-fixes |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet changelog generator can no longer create a changelog inside a spec folder. It still re-renders the ones that exist. The docs, tests and workflows that the two alignment runs flagged now say the same thing the code does.

### Phase 26: alignment-findings-fixes

`nested-changelog.js --write` on a packet with no changelog throws "Refusing to create <path>: spec folders no longer get changelogs. Write release notes with /create:changelog instead." before it makes any folder. An existing changelog re-renders byte-identical. The module and `main` carry `@deprecated`, the registry pointer names the real line, and a scaffold test pins that a new phase child has no `**Changelog**:` line. System-spec-kit `SKILL.md` is back under its word cap, its router no longer loads the deprecated page on every `/speckit:complete`, and the level-change notes point at `implementation-summary.md`. Sk-create-changelog speaks in one voice, refuses a packet-local request in its router and makes no guaranteed-routing claim.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` | Modified | Refuse `--write` with no existing file, `@deprecated` on the header and `main`, `--help` line reads "Re-render an existing changelog file (refuses a missing one)" |
| `runtime/cli/tests/nested-changelog.vitest.ts` and `runtime/cli/tests/create-root-numbering.vitest.ts` | Modified | Pin the refusal and the missing `**Changelog**:` line in a new phase child |
| `runtime/cli/core/spec-root-registry.ts` | Modified | Point at `nested-changelog.ts:601`, the `ensureApprovedSpecFolder` line |
| system-spec-kit `SKILL.md`, `references/workflows/{nested-changelog,quick-reference}.md`, `references/templates/template-guide.md` and `assets/template-mapping.md` | Modified | Word cap, router intent, level-change notes and `--write` wording |
| system-spec-kit `feature-catalog/feature-catalog.md`, `feature-catalog/tooling-and-scripts/nested-changelog-generator.md`, the resume playbook and `changelog/v2.12.10.0.md` | Modified | Catalog root and leaf wording, playbook step 7 and the unreleased entry |
| `.skilled/skills/sk-doc/sk-create-changelog/{SKILL.md,references/worked-examples.md,changelog/v1.3.6.0.md}` and `choose-four-part-bump.md` | Modified | Voice, NEVER rule, refusal branch, routing claim, stale trigger and global-only output |
| `.skilled/commands/create/assets/create-changelog-{auto,confirm}.yaml` | Modified | Drop `changelog_mode` and unwrap its guards |
| `.skilled/skills/sk-doc/changelog/v2.3.21.0.md` and `.hermes/skills/**` | Modified | Soften the routing claim and regenerate the Hermes copies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The 025 suite baseline of 2241 passed and 20 skipped held at `5b9509576a`. Three lanes ran on disjoint files: the code lane (F1 to F4), the system-spec-kit doc lane (F5 to F11) and the sk-doc lane (F12 to F16). Each new test failed with its fix reverted. The conductor then rebuilt the CLI and ran typecheck, the targeted tests, the full suite, the Hermes sync, the package validators and the S1, S2, S3, S4, S7, S9 and S11 battery. One fresh Opus medium reviewer read the whole change and found no P0. Its P1 was these closeout docs, and its two P2s (an em dash on system-spec-kit `SKILL.md` line 95 and semicolons on the playbook Expected line) were fixed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refuse before any directory is made | A refusal after `mkdirSync` would still leave an empty `changelog/` folder behind |
| Re-render existing changelogs as before | The operator kept the 64 existing files, so the generator still has to render them |
| Defer the F17 trigger-index rebuild to push time | origin/main is 9 commits ahead with its own trigger-index rebuild commits, so a rebuild of the large generated `trigger-index.json` here would conflict on rebase |
| Leave the three out-of-scope findings open | They are pre-existing and belong to the sk-doc checkers, the advisor and the alignment tooling |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Built generator `--write` on 025 | Exit 1, writes nothing |
| Built generator on 054/024 | Re-renders byte-identical |
| Targeted run of the three test files | 32 passed. Each new test failed with its fix reverted |
| `npm run typecheck` and the CLI build | Both exit 0 |
| Full CLI suite (`scratch/after/cli-suite.txt`) | 191 files passed and 3 skipped, 2242 tests passed and 20 skipped, rc 0. Baseline 2241 passed and 20 skipped. The +1 is the refusal test |
| `package_skill --check` on system-spec-kit | PASS at 4982 words (was FAIL at 5021) |
| Leaf-manifest freshness | 14/14 |
| `validate_catalog_package --package system-spec-kit` | Exit 0, no `root_leaf_description_mismatch` |
| `rg -n "changelog_mode" .skilled/commands/create/assets/` and a YAML load of both files | No output, both parse |
| sk-doc `validate_skill_package`, `quick_validate`, playbook package and `parent-skill-check` | All exit 0 |
| Hermes sync | 67 copies in sync |
| Battery S1 | 3/3 pass |
| Battery S2, S3, S4, S7, S9 and S11 | 70 pass and 2 fail. Both failures are the stale sk-doc compiled-routing manifest after the sk-create-changelog `SKILL.md` edit. The pre-commit gate re-mints it and the conductor rechecks after the commit |
| `validate.sh --strict --recursive` on 054 | Every child passes. The 054 parent fails on a `SOURCE_FINGERPRINT_MISMATCH` in its own `graph-metadata.json`. A repair-derived run on the parent should clear it, and that folder is outside this phase |
| Trigger index rebuild | Deferred to push time, not run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The trigger index is not rebuilt yet.** A search for "nested changelog" still finds the old phrases until it is. Rebuild it with `generate-trigger-index.mjs` after the rebase onto origin/main at push time.
2. **The sk-doc compiled-routing manifest is stale until the commit.** S2 and S7 each fail on it now. The pre-commit gate re-mints it, so rerun both after the commit.
3. **Three findings stay open.** The S5 README checkers treat slash commands as paths, the advisor ranks system-spec-kit first for packet-local changelog requests, and the alignment aggregator crashes on numeric finding ids and keeps critic-overturned severities.
<!-- /ANCHOR:limitations -->
