---
title: "Implementation Summary"
description: "Spec folders no longer get changelogs. The closing workflows, the phase scaffold and /create:changelog stopped creating them, and the generator stays behind a deprecation notice so the existing files still render."
trigger_phrases:
  - "deprecate nested changelogs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/025-deprecate-nested-changelogs"
    last_updated_at: "2026-10-27T16:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the deprecation, fixed the review findings"
    next_safe_action: "Commit on the worktree branch; push only on the operator's word"
    blockers: []
    key_files:
      - ".skilled/commands/speckit/assets/speckit-implement.yaml"
      - ".skilled/commands/speckit/assets/speckit-complete.yaml"
      - ".skilled/commands/create/assets/create-changelog-auto.yaml"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-025-deprecate-nested-changelogs"
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
| **Spec Folder** | 025-deprecate-nested-changelogs |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closing a packet no longer writes a changelog inside its spec folder, and neither does scaffolding a phase or running `/create:changelog`. Changelogs live in `.skilled/changelog/` and in each skill's own `changelog/` folder only.

### Phase 25: deprecate-nested-changelogs

`/speckit:implement` and `/speckit:complete` now end at `implementation-summary.md`. `create.sh --phase` writes no `**Changelog**:` line into a new child. `/create:changelog --nested` stops before its first setup question with a message that points at the global entry. The generator `nested-changelog.js` still renders the 64 existing packet changelogs, and every run prints a deprecation notice on stderr first, so stdout stays parseable for `--json` callers.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/speckit/assets/speckit-{implement,complete}.yaml` and both `-presentation.txt` | Modified | Drop the generator call, its output paths and the closeout changelog line |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Stop writing the changelog line and refresh note into a phase child |
| `.skilled/commands/create/changelog.md`, `assets/create-changelog-{auto,confirm}.yaml`, `create-changelog-presentation.txt`, `README.txt`, `.skilled/commands/README.txt` | Modified | Global-only workflow, `--nested` refused before setup |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts`, `runtime/cli/tests/nested-changelog.vitest.ts` | Modified | Deprecation notice before argument parsing, two tests that pin it |
| `.skilled/skills/sk-doc/sk-create-changelog/**`, `sk-doc/SKILL.md`, `command-metadata.json`, `sk-create-frontmatter/assets/frontmatter-templates.md` | Modified | Mark nested mode deprecated, drop `phase child` from the refusing intent |
| `.skilled/skills/system-spec-kit/{SKILL.md,README.md}`, `references/**`, `templates/{README.md,CONTRACT.md,changelog/README.md}`, feature catalog and playbook entries, `runtime/cli/spec-folder/README.md` | Modified | Say packet changelogs are deprecated and where changelogs live now |
| `system-spec-kit/changelog/v2.12.8.0.md`, `sk-create-changelog/changelog/v1.3.6.0.md`, `sk-doc/changelog/v2.3.21.0.md` and their version carriers, `.hermes/skills/**` | Created and modified | Release entries, version bumps and the regenerated Hermes copies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The CLI suite baseline went into `scratch/baseline/cli-suite.txt` first. Two lanes ran on DeepSeek V4.1 Flash through cli-pi (the closing workflows, the generator) and three on Opus medium (the changelog command, sk-doc docs, system-spec-kit docs). The conductor edited `create.sh` and checked every diff. One fresh Opus medium reviewer read the whole change and found no P0, two P1s and four P2s, all fixed: the router refused a plain "phase child" request, the `--nested` refusal came after the setup questions, a rejected flag skipped the notice, and four doc lines still read as live instructions or broke the comma rules. Then the CLI was rebuilt and the full suite rerun.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stop generating, keep the generator and the files | The operator chose it. Deleting 64 files and a tested generator buys nothing a stopped producer does not |
| Keep the `packet-local changelog` routing aliases in sk-doc | A request for one still reaches the mode that refuses it and offers the global entry, instead of falling to a generic route |
| Print the notice before parsing, on stderr | A rejected flag cannot skip it, and `--json` callers keep a clean stdout |
| Refuse `--nested` in the router and keep the YAML check | The router check stops it before any setup question, and the YAML check is a backstop if a caller loads the workflow directly |
| Leave `tests/fixtures/anchor-repair-sample/` alone | Those fixtures pin how older scaffolds are repaired, so they must keep the old changelog line |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -n -i "nested-changelog\|nested changelog\|packet-local changelog" .skilled/commands/speckit/` | No output, exit 1 |
| YAML parse of the two speckit and two create-changelog workflows | `yaml ok` |
| Throwaway `create.sh --phase` child, grep `Changelog` | 0 hits, throwaway removed |
| `nested-changelog.vitest.ts` | 12 passed. The notice test failed with the stderr line removed, and the rejected-flag test failed with parsing moved back ahead of the notice |
| Built `nested-changelog.js --mode bogus` | The notice prints, then `Expected --mode auto\|root\|phase` |
| `npm run typecheck`, `npm --prefix runtime/cli run build` | Both exit 0 |
| Full CLI suite against the baseline (191 files passed and 3 skipped, 2239 tests passed and 20 skipped) | 191 files passed and 3 skipped, 2241 tests passed and 20 skipped, rc=0: the two new tests, 0 failed (`scratch/after/cli-suite.txt`) |
| Closing sweep over `.skilled`, root docs and agent folders | Every hit is deprecation wording, a routing alias, a generated index, a fixture, a versioned entry or a skill's own `changelog/` folder |
| `find specs -path "*/changelog/changelog-*.md" -not -path "*/z_archive/*" \| wc -l` and `git status` on those paths | 64, and 0 changed |
| `validate_document.py` and `hvr_scan.py --all` on the three release entries | 0 issues, 100/100 each |
| `parent-skill-check.cjs .skilled/skills/sk-doc`, `sync-skills-hermes.cjs --check` | OK with 0 warnings, 67 copies in sync |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The generated trigger index still lists the nested changelog phrases.** `runtime/data/trigger-index.json` and the retrieval fixtures are rebuilt by the separate trigger-index job on main, so a search for "nested changelog" still finds the deprecated workflow page until that job runs. The page opens with its deprecation banner, so the hit cannot mislead.
<!-- /ANCHOR:limitations -->
