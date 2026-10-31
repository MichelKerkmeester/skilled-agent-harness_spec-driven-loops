---
title: "Implementation Summary: Phrase cleanup hardening"
description: "Phase 16 is complete. The cleanup tool writes atomically and routes no-frontmatter files to a fixer, all 18 template kinds are seeded and pinned, and a pre-commit lint blocks added template-default and editor-fallback phrases."
trigger_phrases:
  - "phrase cleanup hardening implementation"
  - "template phrase cleanup summary"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening"
    last_updated_at: "2026-10-08T12:19:59Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "Commit with wave 2"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/scripts/git-hooks/lib/gates.tsv"
      - ".skilled/scripts/git-hooks/README.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup-hardening.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-lint-hook.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-integration.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

# Implementation Summary: Phrase cleanup hardening

<!-- ANCHOR:summary -->

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-phrase-cleanup-hardening |
| **Status** | Complete |
| **Completed** | 2026-10-08 |
| **Level** | 2 |

## Status

This phase is **complete**. Built in wave 2 by GPT-6 Luna max on the fast tier through cli-codex, reviewed once by DeepSeek V4.1 Flash max through cli-pi, and verified by the orchestrator. Paths below are relative to the repository root, and `CLI` stands for `.skilled/skills/system-spec-kit/runtime/cli`.

## What Was Built

- **Atomic write.** `writeFileAtomically` (`CLI/spec/template-phrase-cleanup.mjs:224`) opens a temp file in the target's directory with the target's mode (`wx`, then `fchmod`), writes and closes it, then renames it over the target. A failure unlinks the temp file and is reported as `write failed: ...`. `beforeHash` and `afterHash` are still recorded around the call.
- **All 18 template kinds.** The census (`CLI/spec/template-phrase-census.mjs:28`) maps 18 kinds to their templates: the five built-in kinds (spec, plan, tasks, implementation-summary, acceptance-criteria) and thirteen add-on kinds (decision-record, phase-parent spec, review spec, research spec, resource-map, handover, debug-delegation, research, before-after, timeline, roadmap, review-report, goal). `documentKindForPath` (line 362) tells the three packet-type `spec.md` files apart by their template marker. The cleanup tool resolves kinds through it and `seededPhrases` seeds `<slug> <suffix>` for each add-on kind, taking the slug two folders up for `research/research.md` and `review/review-report.md`.
- **create.sh seeding.** `seed_template_document` (`CLI/spec/create.sh:394`) replaces a document's exact template block with one slug phrase. Thirteen new default lists (lines 456 to 525) and the call sites at lines 546 to 550 and 692 to 701 cover the new kinds, and the phase-parent path now seeds its `spec.md` (line 1724).
- **No-frontmatter routing.** A file with no opening delimiter is no longer counted as skipped. `runCleanup` returns it in a `routed` list with the fixer `fill-frontmatter`, the `upgrade-legacy.mjs` path, its `--roots <packet> --apply` arguments and a runnable command. The tool reports the route and does not run the fixer.
- **Pre-commit lint.** `CLI/spec/template-phrase-lint.mjs` compares the trigger phrases of each staged Markdown file with its HEAD version and grades only the added ones with `judgeTriggerPhrase`. `template-default` and `editor-fallback` block (exit 1); every other negative class prints a warning and exits 0. `.skilled/scripts/git-hooks/pre-commit:146` runs it, and `SPECKIT_SKIP_PHRASE_LINT=1` skips it. If the linter, `node` or git is unavailable, the gate warns and lets the commit through.
- **Hook registry.** `.skilled/scripts/git-hooks/lib/gates.tsv:8` registers `templatePhraseLint`, and `.skilled/scripts/git-hooks/README.md` counts eight blocking pre-commit gates and lists the bypass.
- **Tests.** `template-phrase-cleanup-hardening.vitest.ts` (3 tests), `template-phrase-lint-hook.vitest.ts` (6, running the real hook in a throwaway repository), `template-phrase-integration.vitest.ts` (1), plus two additions to `create-root-numbering.vitest.ts`: the 18-kind pin and a case for the phase, review and research scaffolds.

## Verification

| Check | Result |
|-------|--------|
| `npx vitest run --config vitest.config.ts` over the five phase files, from the skill root | 5 files passed, 43 tests passed, rc 0 (3 hardening, 6 lint hook, 1 integration, 16 create-root-numbering, 17 unchanged cleanup and census) |
| `template-phrase-census.mjs --root specs --json`, read only | Exits 0 and counts documents for all 18 kinds, the lowest being `debugDelegation` 1 |
| `bash -n .skilled/scripts/git-hooks/pre-commit` | rc 0 |
| `git-hook-gates.cjs list` from the doctor scripts | Lists `templatePhraseLint`, `pre-commit`, on by default, `SPECKIT_SKIP_PHRASE_LINT`; `STATUS=OK GATES=13` |
| Direct `create.sh --phase` run by the orchestrator | The parent `spec.md` was seeded with `seed proof phase probe phase parent spec`, which the judge grades `null`; the throwaway packet was removed |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`, wave 2 final | rc 0; 167 files passed and 3 skipped, 1,682 tests passed and 19 skipped; legacy and validation suites 0 failed. Wave 1 final was 162 files and 1,648 tests; the baseline was 161 files and 1,639 tests |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check`, CLI typecheck | rc 0 each |
| `node --test runtime/tests/hooks/*.test.mjs` | 184 tests, 181 pass, 0 fail |
| `validate.sh --strict` on this folder | `RESULT: PASSED` |

The cli suite count covers all of wave 2, not only this phase, so its rise over the wave 1 count is shared with phases 6, 7 and 10. The five-file run, the census run, `bash -n` and the gate listing were rerun by this closing pass on macOS; the suite, `check`, typecheck and hook-test rows come from the orchestrator's wave 2 gate run.

## Review

DeepSeek V4.1 Flash reviewed read-only through cli-pi on the OpenCode Go route. One round, three findings, all fixed:

| Finding | Class | Fix |
|---------|-------|-----|
| F1: the phase-parent, review and research kinds were keyed on file names `create.sh` never writes, because they render into `spec.md` | P0 | Keyed on packet type through `documentKindForPath`; a test scaffolds real phase, review and research packets and checks the seeded phrase |
| F2: the umask narrowed the mode of a file after the atomic write | P2 | The temp file is opened with the target's mode and `fchmod`ed to it; a test pins `0664` under a `022` umask |
| F3: the new gate was missing from `lib/gates.tsv` and the hooks README | P2 | Row `pre-commit templatePhraseLint SPECKIT_SKIP_PHRASE_LINT yes ...` added and the README counts updated; the write set was widened to both files |

## Deviations

- **Write set widened to the hook registry.** `.skilled/scripts/git-hooks/lib/gates.tsv` and `.skilled/scripts/git-hooks/README.md` were not in Files to Change. The review widened the set so the new gate is registered like its neighbours, because the registry is what `/doctor:git hooks` lists and what the persistent `speckit.hooks.<key>` switch reads. Both are now in spec.md.
- **The lint helper was missing from the Files to Change table.** plan.md planned a new lint module; `CLI/spec/template-phrase-lint.mjs` is now in the table.
- **The test list names concrete files.** The `runtime/cli/tests/*.vitest.ts` row now names the three new files and the two existing ones.
- **No pre-rename hash check.** tasks.md T003 described hashing the temp file before the rename. The built write renames after a complete write and close, and `afterHash` is read back from the target.
- **The atomic-write failure is simulated by an injected rename failure,** not by killing a process mid-write.
- **Packet types are resolved by marker, not by file name** (review F1), so the census reads `spec.md` content to classify it.
- **No README for the atomic write.** Files to Change names none, so the strategy is recorded here.
- **No dedicated clean-phrase hook test.** The unchanged-phrase and single-token cases stage valid files and exit 0; no case stages only a clean added phrase.
- **A pinned gate count broke CI after the push.** Registering the gate raised the registry to 13 rows, and `.skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs` still pinned `GATES=12`. The phase gates did not run the doctor suites, so Spec-Kit Check on main caught it (runs 37783662061 and 37783839054). The orchestrator moved the pin to 13; `run-all.sh` then passed 7 of 7 suites.
- **No changelog refresh.** The phase context asks for one, but no `changelog/` folder exists under the parent or the track.

## Follow-ups Outside This Phase

- `writeFileAtomically` does not call `fsync`, so it guards against a partial file from a crash or an error, not against power loss between the rename and the disk flush. Read from the code; not exercised.
- The atomic write was exercised on macOS only. The spec risk table asks for Linux and Windows, and neither was run.
- `create.sh` does not scaffold resource-map, handover, debug-delegation, research or review-report, so their seeding is proven by the recipe pin and the call-site check, not by a fresh scaffold.
- The lint grades every staged Markdown file whose frontmatter has a `trigger_phrases` list, not only spec documents, and it fails open when the linter, `node` or git is unavailable.
- Only a missing opening frontmatter delimiter routes to the fixer. Frontmatter that opens but does not parse is still reported as skipped.

## How to Resume

1. Read spec.md section 7 for the decisions and the questions answered during the build.
2. Rerun the five phase test files from the skill root with `npx vitest run --config vitest.config.ts`.
3. Run `validate.sh --strict` on this folder before any further completion claim.

<!-- /ANCHOR:summary -->
