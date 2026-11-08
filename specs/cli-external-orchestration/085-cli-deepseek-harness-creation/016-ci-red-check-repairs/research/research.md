---
title: "Deep Research: Documentation Coverage of the CI Red-Check Repairs on Main"
description: "Synthesis of a 5-iteration deep-research loop auditing whether ten CI red-check repair commits on main (190b103dd8 to 478cdec696) are fully and correctly documented across skill docs, playbooks, changelogs and the v4.0.2.0 release notes."
trigger_phrases:
  - "ci red check documentation audit"
  - "stale specs hooks references"
  - "track roots spec.md rule docs"
  - "d.ts module header exemption docs"
importance_tier: normal
contextType: research
---

# Deep Research: Documentation Coverage of the CI Red-Check Repairs on Main

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1.0 -->

<!-- ANCHOR:deep-research-ci-red-check-docs -->

## 1. Research Topic

Audit whether the CI red-check repair work on main is fully and correctly documented. Commits in scope: 190b103dd8, 509c2d707c, 8da131af09, 95f704cfc0, cdd3c27db4, 9932b52352, 67fc950028, a65d573299, b8d66a38f7, 478cdec696. For each change, find every doc that describes the touched behavior and report what is missing, stale or misaligned, with file:line. Also sweep for stale references to `specs/hooks/` and `SETUP.md`. Five gaps were known before the run and are not repeated as new below.

## 2. Executive Summary

The work is not fully documented. Beyond the five known gaps, the run found four more stale doc rows for two of the ten commits, a stale `specs/hooks/` set far wider than the one README the operator knew about, and 22 live `goal.md` files that still point at the old track. Two commits with real behavior changes, the track-root `spec.md` rule and the compiler-emitted `.d.ts` exemption, each leave a doc that now contradicts the code. Five commits need no prose change: their docs were updated in the same commit, or the behavior has no prose surface. The missing changelog coverage splits by tag: six fixes shipped inside tag `v4.0.2.0` without a line in its notes, and four landed after the tag.

## 3. Key Findings: system-spec-kit (Q1)

- **NEW, P2.** `.skilled/skills/system-spec-kit/runtime/cli/lib/README.md:121` says `compareTrackChildren()` compares `children_ids` "with its numbered child directories as sets". After a65d573299 a numbered folder counts as a packet only when it holds `spec.md`, so this row is stale like the two known rows (feature catalog line 32, `runtime/cli/spec/README.md:115-116`, both verified).
- **NEW, advisory.** `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:121` says a track's `children_ids` lists "its direct numbered packets". That stays true under the new packet definition, but it never states the `spec.md` gate. `README.md:241-243` uses packet wording and matches the new rule.
- 190b103dd8 touches only `runtime/tests/history-locator.vitest.ts`. The feature catalog (`feature-catalog/context-preservation/compaction-history-lookup.md:53`) and playbook (`manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:58`) stay accurate. No doc change is needed.

## 4. Key Findings: Guard Changes (Q2)

- **NEW, P2.** `.skilled/skills/sk-doc/shared/references/filesystem-naming-convention.md` §5 "Frozen-history exception" (about lines 66-74) lists `z_archive/`, changelogs and completed spec-folder history, with no `research_archive/`. The known §3 gap continues into §5.
- **NEW, advisory.** `.skilled/skills/sk-doc/shared/scripts/README.md:50` describes `check_no_new_snake_case.py` as rejecting "non-exempt snake_case" names without naming any exemption. It is not wrong, but it does not name the new exemption.
- **NEW, P2.** `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md:47` ("File has TypeScript module header identifying the module") contradicts 67fc950028, which exempts compiler-emitted declaration files (`verify_alignment_drift.py:565` `DECLARATION_SUFFIXES = (".d.ts", ".d.mts", ".d.cts")`, gated on a trailing `//# sourceMappingURL=` at `:577`).
- **NEW, P2.** `.skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md:36` says "All TypeScript files MUST begin with a module header block". This is the same contradiction in the style guide. A fix should name compiler-emitted declarations only, because hand-authored `.d.ts` files (`formatting-imports-and-coexistence.md:294`) have no source-map trailer and still need the header.

## 5. Key Findings: Doctor and mcp-tooling (Q3)

- No stale docs. 8da131af09 updated its only prose surface, `.skilled/commands/doctor/scripts/README.markdown:109,188-193`, in the same commit. cdd3c27db4 regenerated a projection, and `sk-doc/shared/README.md:50`'s count ("five alias entries, four of them `shared/` paths") still matches `leaf-aliases.json`. After 9932b52352, no "isolated chrome" alias remains in `mcp-tooling/ROUTER.md:94`, `hub-router.json`, its README, `description.json` or its playbook. The remaining "isolated" prose describes the `--isolated=true` flag and is correct. 9932b52352 also updated `mcp-tooling/changelog/v1.9.7.0.md` in the same commit.

## 6. Key Findings: CI and Repo Hygiene (Q4)

- No prose surface describes the onnxruntime CUDA skip (95f704cfc0) anywhere in `.skilled` docs, `README.md`, `INSTALL-SKILLED.md`, `AGENTS.md`, the doctor:ci docs or the v4.0.2.0 notes. Nothing is stale, but the change is undocumented. `coverage-graph-db/` (b8d66a38f7) is explained only by the inline comment at `.gitignore:444-445`.
- **NEW detail on the known changelog gap, P2.** Checked with `git merge-base --is-ancestor`: six fixes are ancestors of tag `v4.0.2.0` (190b103dd8, 509c2d707c, 8da131af09, 95f704cfc0, cdd3c27db4, 9932b52352), so v4.0.2.0 shipped them with no line in `.skilled/changelog/skilled/v4.0.2.0.md`. A grep of that file for onnx, research_archive, coverage-graph, isolated chrome, declaration and `.d.ts` returns nothing. Four fixes postdate the tag (67fc950028, a65d573299, b8d66a38f7, 478cdec696). Under `sk-create-changelog/SKILL.md:245-263`, the first group fits the published-entry amendment path (Docs and Tooling, Smaller Fixes, about `v4.0.2.0.md:209-217`). The second group needs a new, strictly greater version file. Iteration 4 named the tag's head commit `a7b158d712`, dated 13:59:47; I did not re-check that.

## 7. Key Findings: Stale `specs/hooks/` and `SETUP.md` (Q5)

- **NEW, P2: live playbooks.** I checked every line below with `rg`:
  - `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:429,437,512,521,537,538,539,562`
  - `.../plugins-and-hooks/session-relaunch-command-runtimes.md:391,405,445,465,466,467,487`
  - `.../plugins-and-hooks/session-relaunch-claude.md:727,735,767,790,797,857`
  - `.../ux-hooks/directive-lifecycle-dedup.md:99,100`
  - `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md:175`
  - The known `.skilled/hooks/session-relaunch/README.md` hits are lines 25, 26, 27, 28 and 30.
- **NEW, P2: live goal state.** 22 non-archived `goal.md` files under `specs/` still name `specs/hooks/`. Two examples show the cost: `specs/hooks-plugins-extensions/023-session-relaunch-loop/034-default-off-opt-in/goal.md:58` is an unchecked acceptance box whose command validates a path that no longer exists, and `.../011-post-fix-remediation/goal.md:10` sets `packet_pointer: "specs/hooks/..."`. 478cdec696 did not touch goal state.
- **NEW, P2 (found during orchestrator verification).** `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:3913` has a redirect whose `to` target is `specs/hooks/002-injection-bloat-reduction/per-prompt-injection-audit/`. That folder now exists only under `specs/hooks-plugins-extensions/`, so the redirect lands on a dead path.
- **NEW, advisory: benchmark reports.** The 2026-10-19 session-relaunch benchmark reports carry many hits. One README has 26, and `outcomes/*.json` have 10-17 each. The 2026-08-11 `skill-benchmark-report.json` files have 12-17 each, and `cli-cursor/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/source.md:14` has one. These are recorded run outputs. Whether they count as frozen history is a policy call.
- **NEW, advisory.** `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json:1018,2176` records `topScoringPaths` under the old track. These are captured measurement output, so repointing them would falsify the record.
- `SETUP.md`: no live reference outside `.skilled/skills/system-skilled-doctor/changelog/v1.1.1.0.md:3,15,24`, which is known and is frozen history.

## 8. What Worked

- Running `git show --stat` per commit first, then sweeping only the doc surfaces each touched behavior has.
- Reading the guard script beside the style guide, which turned a checklist note into a confirmed second contradiction.
- One tag-ancestry probe settled whether to amend v4.0.2.0 or write a new version file.

## 9. What Failed / Limitations

- Iteration 2's first dispatch reported completion but wrote no artifacts. It was redispatched once per the workflow and the second attempt succeeded.
- The leaf sweeps covered Markdown only. The orchestrator's non-Markdown sweep added the redirect-map and probe-fixture items.
- The leaf marked all five strategy questions answered after iteration 1. The remaining four iterations went to depth and verification under the max-iterations stop policy.

## 10. Recommendations

1. Add the `spec.md` packet gate to `track-root-children-lists.md:32`, `runtime/cli/spec/README.md:115-116` and `runtime/cli/lib/README.md:121`. Optionally add it to `folder-structure.md:121`.
2. Add `research_archive/` to `filesystem-naming-convention.md` §3 and §5.
3. Add a compiler-emitted declaration carve-out to `typescript-checklist.md:47` and `overview-strict-and-naming.md:36`.
4. Repoint the live playbooks, the session-relaunch README, `goal-hook.md:175`, the 22 `goal.md` files and the `cite-drift-redirects.json:3913` target to `specs/hooks-plugins-extensions/`.
5. Amend v4.0.2.0 for the six in-tag fixes, and write the four post-tag fixes into the next version file.

## Eliminated Alternatives

- Repointing `specs/hooks/` inside changelogs and completed spec transcripts: `filesystem-naming-convention.md` §5 freezes them.
- Treating the `specs/hooks/` strings in `.skilled/hooks/session-relaunch/tests/*.cjs`, `pi/session-relaunch.test.ts` and `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:164-276` as stale links: these are synthetic fixture paths the tests build in temp directories.
- Extending v4.0.2.0 in place as an open release: the tag exists.

## Divergence Map

No divergent pivots were taken. The run used default convergence mode with a max-iterations stop policy. Saturated directions: none recorded by the registry. Remaining frontier: the policy call on benchmark reports and recorded fixtures.

## 12. Open Questions

- Should recorded benchmark reports and probe fixtures count as frozen history, like changelogs?
- Should `folder-structure.md:121` and `README.md:241-243` state the `spec.md` gate explicitly, though they are not wrong today?

## 13. Configuration

- Iterations: 5 of 5 (stop policy max-iterations)
- Executor: cli-opencode `opencode-go/deepseek-v4.1-flash`, variant `max`, run on the OpenCode 1 binary (`opencode1`, 1.19.4), timeout 2400 s
- Convergence threshold: 0.05; mode default
- New-info ratios: 0.85, 0.75, 0.40, 0.65, 0.27

## 14. Scope Notes

Read-only outside this spec folder. No `.env` file and nothing under `barter/` was opened. Findings marked NEW were checked against the files by the orchestrator, except the tag-head commit id and timestamp in section 6.

## 15. Sources Referenced

- `research/iterations/iteration-001.md` through `iteration-005.md`
- `research/resource-map.md`
- The file:line citations in sections 3-7

## 16. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: Q1/Q3 re-verification (0.40); run 4: tag ancestry, alias count, track-root wording (0.65); run 5: final stale-reference sweep and remediation register (0.27)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

## 17. Next Steps

- Open an implementation packet for recommendations 1-4, then a changelog pass for recommendation 5.

<!-- /ANCHOR:deep-research-ci-red-check-docs -->
