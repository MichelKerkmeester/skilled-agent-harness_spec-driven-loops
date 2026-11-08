# Iteration 1: Q1/Q5 Groundwork — Commit-to-Doc Mapping, system-spec-kit Track Roots and History Locator

## Focus

Map all ten in-scope commits to the documentation surfaces that describe the behavior each one changed, then audit the system-spec-kit track-roots and history-locator docs (Q1) and the stale `specs/hooks/` / `SETUP.md` sweep plus changelog coverage (Q5). The sweep was widened to Q2-Q4 because the same `git show --stat` pass and repository-wide greps answered them with no extra dispatch.

## Actions Taken

- Read the agent definition, `deep-research-config.json`, `deep-research-strategy.md`, and state log (`4` lines, no iteration record yet).
- Ran `git show --stat` for all ten commits to identify every touched file.
- Ran repository-wide ripgrep passes over `.skilled`, `README.md`, `INSTALL-SKILLED.md`, `AGENTS.md`, `CLAUDE.md`, changelogs, doctor command docs and workflow assets for: `specs/hooks/`, `SETUP.md`, `research_archive`/`snake.?case`, module-header/`.d.ts`, `isolated chrome`, `onnxruntime`/`CUDA`, `coverage-graph`, track-root wording, and history-locator docs.
- Read the exact passages in the track-root feature catalog, spec CLI/lib READMEs, folder-structure reference, filesystem-naming convention, TypeScript checklist, and the doctor battery README.

## Findings

1. **Q1 — NEW surface: the lib README repeats the old track-root rule.** `runtime/cli/lib/README.md:121` says `compareTrackChildren()` compares a container's `children_ids` "with its numbered child directories". Commit a65d573299 now counts a numbered folder as a packet only when it holds `spec.md`, so this row is stale too; the Known Context named only the feature catalog and `spec/README.md`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/README.md:121]

2. **Q1 — the two known track-root gaps, with line detail.** `track-root-children-lists.md` §2 still says the writer sets `children_ids` to "its numbered packet folders, sorted" with no `spec.md` condition. `runtime/cli/spec/README.md:115-116` describes the sweep and refresh as comparing against "numbered child directories". `references/structure/folder-structure.md:121` also says a track's list holds "its direct numbered packets" without stating that a numbered folder with no `spec.md` is not a packet, so it is a third, borderline surface. [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md:32] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:115] [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:121]

3. **Q1 — the history-locator commit needs no doc change.** 190b103dd8 touches only `runtime/tests/history-locator.vitest.ts` (five added lines creating the hook state folder before each test). The feature catalog already records the runtime dependence on a writable state directory, and the playbook still invokes the same six Vitest files, so no doc is stale. [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:53] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:58]

4. **Q2 — the naming exemption is missing from two sections, not one.** `filesystem-naming-convention.md` §3's exemptions table (lines 48-56) has a Frozen-surfaces row but no `research_archive` row, and §5's frozen-history exception (lines 66-74) lists only `z_archive/`, changelogs and completed spec-folder history. `shared/scripts/README.md:50` keeps the generic "non-exempt snake_case" wording and names no exemption. No changelog records 509c2d707c; the nearest entry is the unrelated `synthesis_complete.json` exemption. [SOURCE: .skilled/skills/sk-doc/shared/references/filesystem-naming-convention.md:48] [SOURCE: .skilled/skills/sk-doc/shared/references/filesystem-naming-convention.md:66] [SOURCE: .skilled/skills/sk-doc/shared/scripts/README.md:50]

5. **Q2 — the sk-code checklist contradicts the new `.d.ts` exemption.** `sk-code-skilled/assets/checklists/typescript-checklist.md:47` still requires every TypeScript file to have "a TypeScript module header identifying the module", with no compiler-emitted declaration-file carve-out. 67fc950028 makes `verify_alignment_drift.py` skip the module header on compiler-emitted `.d.ts`, so a generated declaration file that is now compliant would fail this checklist. No sk-code prose doc states the exemption; the scripts README's description of the drift guard names neither the module header nor `.d.ts`. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md:47]

6. **Q3 — doctor and mcp-tooling docs are consistent; only changelog coverage is absent.** The battery is documented only at `.skilled/commands/doctor/scripts/README.markdown:109`, which 8da131af09 updated in the same commit; no `system-skilled-doctor` SKILL.md/reference names the battery, so nothing there is stale. cdd3c27db4 regenerates `leaf-aliases.json`, a generated projection; the only prose mentions are generic ("leaf manifest") and remain accurate. 9932b52352 removed "isolated chrome" from `hub-router.json` and updated `changelog/v1.9.7.0.md` in-commit; `ROUTER.md:94`'s keyword list contains no such phrase. No doc gap beyond the missing changelog entries. [SOURCE: .skilled/commands/doctor/scripts/README.markdown:109] [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:94] [SOURCE: .skilled/skills/mcp-tooling/changelog/v1.9.7.0.md:1]

7. **Q4 — the CI and gitignore changes have no prose surface at all.** A sweep of `.skilled` (Markdown/JSON), `README.md`, `INSTALL-SKILLED.md`, `AGENTS.md`, `CLAUDE.md`, doctor:ci docs/assets and the v4.0.2.0 release notes found zero mentions of the 19-workflow onnxruntime CUDA skip; the only `.gitignore` explanation for `coverage-graph-db/` is the inline comment at lines 444-445. Neither fix appears in a skill changelog or the release notes. The only onnxruntime hits outside package locks are the trigger index and advisor install guide, which are unrelated. [SOURCE: .gitignore:444] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:18]

8. **Q5 — the stale `specs/hooks/` set is much wider than the known lines.** Beyond `.skilled/hooks/session-relaunch/README.md:25-30`, live docs still carrying the old track path: `session-relaunch-pi-opencode.md` (8 refs: 429, 437, 512, 521, 537-539, 562), `session-relaunch-command-runtimes.md` (7: 391, 405, 445, 465-467, 487), `session-relaunch-claude.md` (6: 727, 735, 767, 790, 797, 857), `directive-lifecycle-dedup.md:99-100`, and `cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md:175`. The 2026-10-19 benchmark reports add 26/12/8 refs in their READMEs plus 2/2/1 in `source.md` files, and one remains in the cli-cursor benchmark `source.md`. Changelogs also cite the old path (`system-spec-kit` v2.8.4.0:16, v2.8.5.0:16, v2.9.1.0:17; `sk-doc` v2.3.12.0:17; `.skilled/changelog/skilled/v4.0.0.13.md:21`, v4.0.0.14.md:20) but those are frozen history under `filesystem-naming-convention.md` §5, not live links. `SETUP.md` appears only in `system-skilled-doctor/changelog/v1.1.1.0.md:3,15,24` (known), and no skill changelog or v4.0.2.0 entry records any of the ten fixes. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:429] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md:391] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:727] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md:99]

## Ruled Out

- Re-reporting the five Known Context items without new line detail; each was re-checked and only the added surfaces (lib README, §5, folder-structure line, wide stale set) are reported as new.
- Repointing `specs/hooks/` inside changelogs: `filesystem-naming-convention.md` §5 freezes changelog and archived history as the record of prior names.
- Treating 190b103dd8 as documentation-relevant: the commit is test-only and changes no user-visible behavior.

## Dead Ends

- Searching for an onnxruntime/CUDA statement in workflow standards: none exists in any Markdown or workflow asset, so there is no stale claim to correct, only an undocumented change.
- Searching `system-skilled-doctor` for battery/leaf-alias prose: the skill's docs never describe either, so nothing can be stale.

## Edge Cases

- Ambiguous input: "stale reference" for Q5 was read as a live-doc link, with changelog/archive hits recorded separately because the naming convention freezes them.
- Contradictory evidence: none.
- Missing dependencies: none; all sweeps and reads completed.
- Partial success: none; every committed surface resolved to a doc verdict.

## Questions Answered

- Q1, Q2, Q3, Q4 and Q5 were all answered at the line-detail level; the unanswered residual is policy (whether frozen changelog refs should be repointed), not evidence.

## Questions Remaining

- None of the five strategy questions remain open. Depth candidates for later iterations: whether the sk-code TypeScript style guide (not only the checklist) should state the `.d.ts` exemption, and whether v4.0.2.0 should be amended or a new release note should carry the ten CI repairs.

## Next Focus

Iteration 2 should verify the two remaining policy edges: read the sk-code TypeScript style-guide module-header sections for a second contradiction, and classify every `specs/hooks/` hit into live-doc vs frozen-history so the fix list is exact.

## Sources Consulted

- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md:25-70`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:105-121`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/README.md:121`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:108-124`
- `.skilled/skills/sk-doc/shared/references/filesystem-naming-convention.md:40-110`
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md:47`
- `.skilled/commands/doctor/scripts/README.markdown:95-109`
- `.skilled/skills/mcp-tooling/ROUTER.md:94`
- `.gitignore:444-445`
- `.skilled/changelog/skilled/v4.0.2.0.md` (full-file keyword sweep)
- Git `show --stat` for all ten commits.

## Assessment

- New information ratio: 0.85
- Questions addressed: Q1-Q5
- Questions answered: Q1-Q5

## Reflection

- What worked: `git show --stat` first, then a single vocabulary-driven ripgrep pass per question, exposed both known and new surfaces cheaply.
- What did not work: a first `rg` for `snake_case` over `.skilled/skills/sk-doc/references` targeted a non-existent path (`shared/references` is the real one), so the pass was rerun at the correct root.
- What I would do differently: resolve doc roots before sweeping; cite the exact exemption table rows rather than section numbers.

## SCOPE VIOLATIONS

None. No file outside the iteration narrative and delta was written during research; all researched paths were read-only.
