# Deep Review Iteration 004

## Dispatcher

- Mode: review
- Target agent: deep-review
- Iteration: 4 of 5
- Generation: 2, lineage mode restart
- Dimension: maintainability
- Target: `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite`
- Focus: the five feature READMEs (decision-capture, completion-evidence, subagent-dispatch-guard, goal, session-lifecycle) as a library, their trees and runtime tables against the live folders and `hook-registry.json`, statements about removed fallbacks and aliases, and the phase 5/6 test changes.

## Files Reviewed

- `.skilled/hooks/decision-capture/README.md:52-86`
- `.skilled/hooks/completion-evidence/README.md:94-146`
- `.skilled/hooks/subagent-dispatch-guard/README.md:70-133`
- `.skilled/hooks/goal/README.md:120-172`
- `.skilled/hooks/session-lifecycle/README.md:131-207`
- `.skilled/hooks/subagent-dispatch-guard/pi/task-dispatch-guard.ts:7-8`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/005-closeout-follow-up-fixes/implementation-summary.md:78-79,120`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/006-codex-check-and-advisory-fixes/implementation-summary.md:72-77,86`
- Live folder enumeration for the five feature folders, including 44 symlinks.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new this iteration. Prior `R3-P1-001` (parent spec reports Complete while phase 7 is Draft) remains active and drives the verdict.

### P2 Findings

1. **Three feature README trees omit live entries that their own runtime tables name** -- `.skilled/hooks/decision-capture/README.md:71` -- the §4 tree ends at `vibe/` and omits the live `opencode/decision-capture.js` link folder that §3 `:57` names as the OpenCode entry in this folder. The same drift appears at `.skilled/hooks/subagent-dispatch-guard/README.md:102`, whose tree omits `vibe/deep-loop-guard.mjs`, named by §3 `:79`; and at `.skilled/hooks/session-lifecycle/README.md:188`, whose `vibe/` line omits the live `session-start.test.mjs`. [SOURCE: .skilled/hooks/decision-capture/README.md:57] [SOURCE: .skilled/hooks/subagent-dispatch-guard/README.md:79] [SOURCE: .skilled/hooks/session-lifecycle/README.md:203]
   - Case: a maintainer treating §4 as the folder manifest sees `opencode/` or `vibe/` absent, concludes the folder is an orphan, and deletes a live browsability link or an audit-relevant test that the loader map still depends on.
   - Evidence: `readdir` of the five feature folders shows `decision-capture/opencode/decision-capture.js`, `subagent-dispatch-guard/vibe/deep-loop-guard.mjs` and `session-lifecycle/vibe/session-start.test.mjs` all present; the three trees do not list them. Sibling trees do list their OpenCode link: completion-evidence at `:138-140`, goal at `:171`.
   - Finding class: class-of-bug
   - Scope proof: all five feature folders were enumerated and all five trees read in full. The omissions are three instances of one class; the other two trees (completion-evidence, goal) list every runtime entry.
   - Affected surface hints: ["decision-capture/README.md §4", "subagent-dispatch-guard/README.md §4", "session-lifecycle/README.md §4"]
   - Recommendation: add the `opencode/` and `vibe/` entries (and `session-start.test.mjs`) to the three trees, and say the folders hold browsability links.

2. **subagent-dispatch-guard still describes the Pi fallback and test alias that phase 5 removed** -- `.skilled/hooks/subagent-dispatch-guard/README.md:92` -- "The longer fallback specifier beside it resolves only through the test alias." Phase 5 changed all six Pi adapters to one import each with no fallback and deleted the alias and its dead-path tests. The live adapter's only static imports are the extension type and the shared kill-switch resolver, and no `fallback` or `alias` token remains in it. [SOURCE: .skilled/hooks/subagent-dispatch-guard/pi/task-dispatch-guard.ts:7] [SOURCE: specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/005-closeout-follow-up-fixes/implementation-summary.md:78]
   - Case: a reader trusts the sentence, keeps a dead Vitest alias in a config or carries a fallback specifier into a future Pi adapter edit, reintroducing exactly the load-path ambiguity phase 5 removed.
   - Evidence: the phase 5 record lists `task-dispatch-guard.ts` among the six adapters reduced to one import and records "The alias and the tests of the dead path are gone". A search of the live adapter finds only `@earendil-works/pi-coding-agent` and `../../shared/hook-flags.mjs` imports; the words `fallback` and `alias` do not occur. [SOURCE: specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/005-closeout-follow-up-fixes/implementation-summary.md:120]
   - Finding class: instance-only
   - Scope proof: all five feature READMEs were read in full. The only statement about a removed import fallback or test alias is line 92; the other "alias" mentions name live kill-switch aliases (`goal/README.md:202`, `completion-evidence/README.md:175`) and are not this class.
   - Affected surface hints: ["subagent-dispatch-guard/README.md §3", "subagent-dispatch-guard/pi/task-dispatch-guard.ts"]
   - Recommendation: replace the sentence with the single `../lib/` import the adapter now uses.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|---|---|---|---|
| `spec_code` | pass | `.skilled/hooks/decision-capture/README.md:57`, `.skilled/hooks/subagent-dispatch-guard/README.md:92`, `.skilled/hooks/session-lifecycle/README.md:203` | Trees, runtime tables and fallback prose compared against live folders, 44 symlinks and the phase 5/6 records. |
| `checklist_evidence` | partial | `.../005-closeout-follow-up-fixes/implementation-summary.md:111`, `.../006-codex-check-and-advisory-fixes/implementation-summary.md:108` | Phase 5/6 verification rows read; packet acceptance criteria were not re-run in this iteration. First recording, so no earlier status is downgraded. |

## Integration Evidence

- `hook-registry.json` holds `completion-evidence-stop` with 10-second Claude, Codex, Devin and Cursor bindings and a Pi extension, matching `completion-evidence/README.md:96-103`.
- `hook-registry.json` holds `goal-inject` with 10-second Cursor `sessionStart` and Devin `SessionStart`/`UserPromptSubmit` bindings, matching `goal/README.md:123-124`.
- README-named link paths checked live: `.dsh/plugins/repo-guards/adapters/decision-capture.mjs`, `.pi/extensions/decision-capture.ts`, `.opencode/plugins/tests/goal-doc-contract.test.cjs`, `.skilled/hooks/session-lifecycle/vibe/session-start.test.mjs`.
- OpenCode and Vibe real loaders remain `.opencode/plugins/` and `.vibe/plugins/repo-guards/`; the per-feature `opencode/` and `vibe/` folders are browsability links.

## Edge Cases

- The omitted entries are browsability links, not load-bearing paths: OpenCode globs `.opencode/plugins/` flat and Vibe loads `.vibe/plugins/`. Omitting them from a tree changes no runtime behavior, which is why both findings stay P2.
- The phase 6 test bodies were not read line by line inside the tool budget. The three Pi cases and the DSH Codex case are described by the phase record and `session-lifecycle/README.md:233`, but test clarity and isolation are recorded as deferred, not as a pass.
- `.skilled/hooks/README.md` is modified in the working tree; it was reviewed in earlier iterations and was not re-reviewed here.
- The second registry probe was blocked by `env-secret-guard` because the command text contained `process.env`. Session-lifecycle registry timeouts therefore carry no evidence this iteration and were not assessed.

## Confirmed-Clean Surfaces

- `completion-evidence/README.md` §4 tree and §3 table: every listed link exists, all four runtime adapters are under the owning skill, and the two OpenCode links are listed.
- `goal/README.md` §4 tree: all ten listed entries exist, including `goal-plugin.md`, the four runtime test files and the `opencode/` link.
- The two runtime tables checked against the registry (completion-evidence, goal) match the registered events and timeouts.

## Ruled Out

- Dead links after the renames: 44 symlinks under the five folders, 0 broken.
- Runtime tables naming missing real files: every sampled real path resolves, including the DSH and Pi decision-capture entries and the goal doc-contract test.
- Compact trees omitting `tests/README.md`: three trees summarize the tests folder by its suite only, while every §8 Related list links the folder README. This is a summarization convention, not stale drift, so it is not reported.

## Next Focus

Iteration 5 is the final stabilization pass. Recheck the carried `R3-P1-001` against the current phase 7 state, assess the deferred phase-6 test isolation, then run the objective proof set: the six missing directories, `codex-global-hooks-check` presence, both sync checks, the README validators, the test trees and `validate.sh --recursive --strict`.

Review verdict: CONDITIONAL
