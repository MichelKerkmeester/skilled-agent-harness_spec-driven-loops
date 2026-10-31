---
title: "Implementation Summary"
description: "Every doctor command now has one home: 61 manual scenarios and a merged environment guide under .skilled/manual-testing-playbook/, with the skill playbooks pointing at it instead of carrying their own copies."
trigger_phrases:
  - "central doctor playbook implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/005-central-doctor-playbook"
    last_updated_at: "2026-10-31T16:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the move, the index edits and the closeout corrections"
    next_safe_action: "None - packet closed; the orchestrator refreshes description.json and graph-metadata.json"
    blockers:
      - "The two generated metadata files still hold scaffold-era derived fields; repair-derived.cjs is the fix, and the orchestrator owns those files"
    key_files:
      - ".skilled/manual-testing-playbook/manual-testing-playbook.md"
      - ".skilled/manual-testing-playbook/doctor-commands/README.md"
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
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
| **Spec Folder** | 005-central-doctor-playbook |
| **Status** | Complete |
| **Completed** | 2026-10-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader who wants to check any doctor command now opens one folder. The 57 scenarios that lived across six skill playbooks moved into `.skilled/manual-testing-playbook/doctor-commands/`, four commands that had no scenario got one, and the six category guides became one environment guide at the top of the package. Each skill playbook and feature catalog kept the feature it describes and points at the central scenario instead of holding a copy.

### Phase 5: central-doctor-playbook

The doctor family was documented by whatever skill owned a neighbouring feature. That put `/doctor:update` in one package and `/doctor:git` in another, under six READMEs that each described the environment in their own words. The move gives the family one index, one environment guide and one coverage list, so the question "is every doctor command covered" is answered by reading one page instead of six.

Four commands had no scenario before the move: `/doctor:sk-skill check`, `/doctor:sk-skill convert`, `/doctor:agents-md check` and `/doctor:agents-md embed-restore`. DOC-402 to DOC-405 close that gap, and the coverage list now names all 16 commands. Two moved scenarios also arrived with ids that collided with numbers already in use, so DOC-393 became DOC-400 and DOC-394 became DOC-401.

The playbook validator had to learn the new package or the move would be invisible to the check that decides whether a package is complete. It now discovers `.skilled/manual-testing-playbook`, the fail-closed allowlist names it, and a discovery test fails when it drops out of either.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/manual-testing-playbook/manual-testing-playbook.md` | Created | The package root, carrying the merged environment guide |
| `.skilled/manual-testing-playbook/doctor-commands/README.md` | Created | The category index and the merged guide for the doctor family |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-install.md` and `doctor-symlink.md` | Moved | The two scenarios phase 3 wrote, now filed with the family |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-helper-read-only-pick.md` and `doctor-helper-writing-handoff.md` | Moved and renumbered | DOC-393 to DOC-400 and DOC-394 to DOC-401 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-sk-skill-check.md` | Created | DOC-402, the `/doctor:sk-skill check` scenario |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-sk-skill-convert.md` | Created | DOC-403, the `/doctor:sk-skill convert` scenario |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-agents-md-check.md` | Created | DOC-404, the `/doctor:agents-md check` scenario |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-agents-md-embed-restore.md` | Created | DOC-405, the `/doctor:agents-md embed-restore` scenario |
| `scratch/old-doctor-readmes/` | Created | The old category READMEs, kept outside the package |
| The six skill playbook indexes under `.skilled/skills/*/manual-testing-playbook/` | Modified | Doctor rows dropped, counts corrected, each index linking the central package |
| `.skilled/skills/sk-code/feature-catalog/quality-gate/codebase-agnostic-quality-gate.md` and `.skilled/skills/sk-code/feature-catalog/doctor-commands/ci-workflow-doctor-and-switches.md` | Modified | sk-code-quality and sk-code-ci catalog links re-pointed |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` | Modified | sk-git catalog links re-pointed |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` | Modified | Catalog links re-pointed, and its version raised because the body changed |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modified | Discovers the central package |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modified | Names the central package |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | Modified | Discovery test for the central package |
| `.skilled/skills/mcp-code-mode/leaf-manifest.json`, `leaf-aliases.json`, and the sk-git and system-skill-advisor equivalents | Regenerated | Scenario counts and paths |
| `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | Modified | Expectations at 48 scenarios across 9 categories |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/playbook-provenance-paths.vitest.ts` and `workflow-invariance.vitest.ts` | Modified | The provenance walk covers the central package |
| `.skilled/skills/sk-doc` code-folder fixtures and the trigger index | Regenerated | Path and vocabulary changes |
| Runtime mirror trees and the pi, codex and hermes prompt mirrors | Regenerated | Generator output only; no mirror was hand-edited |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The move came first, one skill at a time, with `git mv` so the history follows each scenario to its new home. The link sweep ran next: 314 links inside the moved files and seven files outside the package, with 0 left unresolved. Two ids collided with numbers already in the package, so they were renumbered rather than reused, and the four missing scenarios were written to the next free numbers in the sequence.

The skill side came second, because those edits depend on the files having moved: six indexes dropped their doctor rows and their counts, and four feature catalogs had their links re-pointed. The catalogs stayed where they were. A catalog describes the feature its skill owns; the scenario is the shared procedure, and a copy inside the skill would drift from the central one.

The validator and the fixtures came third, since every count and path they pin changes with the move. `validate-playbook-package.cjs` learned the package, the allowlist named it, and a discovery test was added. The leaf manifests and aliases were regenerated for mcp-code-mode, sk-git and system-skill-advisor, the advisor expectations moved to 48 across 9, the provenance walk took the central package into its scan, and the sk-doc fixtures and the trigger index were regenerated.

Closeout took four corrections, and each one had a check behind it. Nine central files had no `Provenance:` line, so `playbook-provenance-paths` failed; the seven moved advisor routing and setup scenarios, the category README and the root each got one `Provenance: manual only - ...` line. DOC-391 still said the setup target table had 19 rows, when main already had 23 and the two new rows make 25, so it now says 25. The advisor index still said "all 62 scenario files", which failed `manual-testing-playbook.vitest.ts`, so it now says 48. And the D1 lane had rewritten a path inside the released changelog `.skilled/skills/sk-code/changelog/v3.9.23.0.md`; that edit was reverted, because a released changelog records history.

The verification ran from the final tree in this order: the package validator, the fleet run, the duplicate-id count, the empty-folder check, the coverage count, the spec-kit and advisor suites, the Python harness, the trigger index, the mirror and prompt syncs, and the route and phrase probes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Moved the scenarios with `git mv` instead of copy and delete | The history is how a reader finds the old procedure and who changed it; a copy breaks that trail at the moment the file matters most. |
| Archived the old category READMEs in `scratch/old-doctor-readmes/` rather than in the package | The merge would otherwise lose the per-skill wording, and the package is what a reader sees; `scratch/` keeps the wording recoverable without publishing it. |
| Renumbered the two colliding ids to the next free numbers, DOC-400 and DOC-401 | An id is stable once written, so reusing a live number would point two scenarios at one reference. |
| Left the feature catalogs in their skills and re-pointed only their links | A catalog describes the feature its skill owns; the scenario is the shared procedure, and a skill-local copy would drift from the central one. |
| Corrected the stale counts in the docs, never in the checks | The check names the truth. Teaching it 62 or 19 would hide the drift it exists to catch. |
| Reverted the link rewrite in the released changelog | A released changelog records what shipped at that version. Editing its paths rewrites history instead of describing it. |
| Fixed the nine missing `Provenance:` lines rather than exempting the files | A provenance line is the only record that a scenario is manual-only, and an exemption would let the next moved file arrive without one. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook` | PASS, exit 0: `PASS package=.skilled/manual-testing-playbook tier=FAIL_CLOSED scenarios=61 categories=1 operator=61 routing_gold_excluded=0 violations=0 warnings=12`. The 12 warnings are `BACKTICK_PATH_UNRESOLVED` on example paths the scenarios carried before the move. |
| The no-argument fleet run | PASS, exit 0: 52 PASS and 4 SKIP. Diffed against main's verdicts, the only difference is the new `PASS package=.skilled/manual-testing-playbook` line. |
| Duplicate `DOC-` id count over the 61 central scenarios | 0. |
| `ls -d .skilled/skills/*/manual-testing-playbook/doctor-commands` | No matches: no skill keeps a doctor-commands folder. |
| Coverage count across the central scenarios | Every one of the 16 doctor commands is named by at least one scenario: `setup 5, helper 2, env 6, update 8, git 14, sk-code 4, ci 4, sk-skill 2, agents-md 5, speckit 4, runtime-mirrors 3, skill-advisor 8, deep-loop 5, mcp 6, install 1, symlink 2`. |
| `npx vitest run --config ../../vitest.config.ts --project cli tests/workflow-invariance.vitest.ts tests/playbook-provenance-paths.vitest.ts` | PASS: 2 files, 5 tests passed. |
| `npx vitest run tests/manual-testing-playbook.vitest.ts tests/scorer/native-scorer.vitest.ts` | PASS: 2 files, 23 tests passed. |
| `python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | PASS: `pass=89, fail=0`. |
| `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` | PASS, exit 0: `stale documents: 0`. |
| `sync-runtime-mirrors.cjs --check`, the pi, codex and hermes prompt syncs, `derive-command-bridges.cjs --check` | PASS: `211 mirrors across 9 trees are in sync`, `43 prompts are in sync` from each prompt sync, and `"status": "fresh"` from the deriver. |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | PASS: `OK: 28 routes validated, 10 warnings`. Main has 24 routes and 5 warnings; the five new warnings are the informational H1 shared-flag kind on `/doctor:symlink`. |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | PASS: `STATUS=OK phrases=184 bridges=32`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Twelve warnings remain on the package.** `validate-playbook-package.cjs` reports 12 `BACKTICK_PATH_UNRESOLVED` warnings, all on example paths the scenarios carried before the move. They name example paths, not live ones, so they were recorded rather than edited out of a procedure.
2. **Every central scenario is manual only.** The `Provenance: manual only - ...` line on each one says so. Nothing executes these steps, so a scenario is as current as the last reader who ran it.
3. **A moved file needs a provenance line, or the walk fails.** Nine files arrived without one and `playbook-provenance-paths` caught it. A future move adds a line or it fails the same way.
4. **Coverage counts hits, not one scenario per command.** The list reads `setup 5` and `git 14` because one scenario can name several commands. A command is covered when a scenario names it, not when a scenario exists for it alone.
5. **The old guides live only in this packet's scratch folder.** They are kept for the wording they carried, and they are not published, so a reader will not find them in the package.
6. **The Python harness and the route and phrase probes are regression evidence, not criteria.** They pass and are recorded here, but no acceptance criterion rests on them.
<!-- /ANCHOR:limitations -->

---
