# Review Verification

Two fresh Opus 5.5 reviewers at high effort ran read-only on 2026-09-28. Review A covered the advisor entries (`review-a-advisor.md`). Review B covered the seven other component entries and the lines added to the v4.0.0.2 release notes (`review-b-components-and-release.md`). Each brief named the files, the sources of truth and the shape of the answer, and neither carried an expected conclusion. Each wrote only its own report.

Every finding below was checked against the source it cites before anything changed. "Confirmed" means the cited file, line or commit says what the finding claims.

## Review A

- **A-01 confirmed, fixed.** `010-review-advisories-and-codex-cleanup/implementation-summary.md:57` says the long-prompt defect turned up while verifying the phase 6 review's fixes, and the thirteen findings in `008-cross-cli-manual-testing/implementation-summary.md` Known Limitations include no prompt length. The same error sat in the v4.0.0.2 "What Five CLIs Found" list (B19).
- **A-02 confirmed, fixed.** The parent `spec.md` phase map gives the research recommendations to phases 2 to 4, while the prompt clamp and the stdin transport came from the review. The sentence now says most of the hook changes are ones the research recommended.
- **A-03 confirmed, fixed.** `001-deep-research/research/research.md:100` and parent `spec.md:140` name A/B tests as well as replays.
- **A-04 confirmed, fixed.** The system-spec-kit shim passes `Math.min(operatorBudgetMs, 2500 - 300)` at `runtime/hooks/claude/user-prompt-submit.ts:106-110`.
- **A-05 and A-06 confirmed, fixed.** sk-create-changelog `SKILL.md:264` takes topic phrases from the entry's own text. The new phrases are "casual prompts skip the advisor" and "turn without a suggestion".
- **A-07 confirmed, fixed with a different lead-in.** cd0df4a38e left the plugin file exporting only its factory. The upgrade note uses "Plugin helpers moved." rather than "Repoint.", because `assets/changelog-template.md:126` keeps the Adopt, Repoint and Drop lead-ins for a release with all three kinds of upgrade work.
- **A-08 confirmed in code, fixed.** At ad44092f36^ the shared hook's only non-test path was `buildSkillAdvisorBriefFromCli` (`hooks/claude/user-prompt-submit.ts:271-290`), its probe looked only under `.opencode/bin` (`hooks/lib/skill-advisor-cli-fallback.ts:173-176`), `.opencode/` held no `bin` at that commit or at the v4.0.0.0 tag, and Pi loads the same hook module (`hooks/pi/prompt-advisor.ts:40-50`). Every runtime that runs the hook lost its brief in v4.0.0.0, not Pi alone.
- **A-09, A-10 and A-11 follow from A-08, fixed.**
- **A-12 confirmed, added to v0.11.2.0.** 89569a7f81 added `resolveCompiledRouteStatusModule`. Before it the plugin read only `../bin`, and neither the v4.0.0.0 nor the v4.0.0.1 tag carries `.opencode/bin` (`git ls-tree`).

## Review B

- **B01 confirmed, fixed.** system-spec-kit `feature-catalog/tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md:28` still says hooks use `--warm-only`, and packet 030 never touched that file. The bullet now states only what was checked: the READMEs name `SPECKIT_RUNTIME` (codex `:20`, cursor `:48`, devin `:37`) and the cap (claude `:21`), and `cli-runtime-warm-only-fallbacks.md:30` and `:34` carry `--no-warm-only`, the prompt check and the status lines.
- **B02 confirmed, fixed.** The shim reads the budget with `Number.parseInt`.
- **B03 confirmed, fixed.** The shim stops the hook, and the hook gives up on its advisor call.
- **B04 confirmed, fixed.** `create.sh:1217-1231` continues from the highest existing phase folder and `:1489` labels the phase with that number.
- **B05 confirmed, fixed.** The relabeled files are `description.json` files under `specs/`, repository data rather than system-spec-kit.
- **B06 confirmed, added.** The cd0df4a38e diff shows step 4 ran vitest from a folder where the imports do not resolve and step 6 called a retired wrapper. The scenario itself states the reason the entry gives.
- **B07 and B09 confirmed, fixed.** The research key list at 9ccb4dd416^ already had `candidate.id`, and `runtime/scripts/synthesis-closeout.cjs:201` adds `candidate.findingId`.
- **B08 accepted, bullet removed.** The ledger census is a maintainer check that no reader of the release acts on.
- **B10 and B23 confirmed, fixed.** cli-codex `references/hook-contract.md:44-47` and `README.md:241` load a checkout's hooks only when the checkout is trusted. Both upgrade notes now put the trust step first.
- **B11 judgment, not applied.** Nothing runs the installer in write mode on its own. The only automatic caller is `.cursor/hooks.json`, which runs `--check`. The documented setup already trusts the checkout, so a trusted checkout loses nothing and runs each hook once instead of twice. An untrusted checkout keeps its user-wide copies until someone runs the installer, and the upgrade note now names the trust step before the run. Marking the change Breaking would make cli-codex 2.0.0.0 in the expanded format (sk-create-changelog `SKILL.md:202` and `:250`). What would change this call: evidence that operators run the installer to register hooks for a checkout they do not trust.
- **B12 judgment, not applied.** The installer sits in `.skilled/bin`, which no changelog component owns, and cli-codex's hook contract documents it at `references/hook-contract.md:106`. The change stays where Codex users read about hooks. The operator may move it to the release notes alone.
- **B13 partly confirmed, fixed as a count correction.** The scenario's adapter table listed seven before and after cd0df4a38e. Only its prose said eight, and the code-graph adapter had left on 2026-07-27 (302c7535b8). The entry records the corrected count, not a change in what the scenario tests.
- **B14 confirmed, fixed.** The six-file list was a file inventory.
- **B15 confirmed, added.** sk-code-opencode `references/shared/alignment-verification-automation.md:58-61` and `:122-126`.
- **B16 confirmed, partly applied.** The phrase this phase added is gone, which leaves the four topic phrases the release entry carried before. Cutting those to two would rewrite another packet's release metadata, so that stays with the operator.
- **B17 confirmed, fixed.** `hooks/pi/prompt-advisor.ts:10-22` gives Pi the hook's own uncapped budget, 2,500 ms by default, plus a 300 ms margin.
- **B18 confirmed, fixed** from the e18d6073b8 body.
- **B19 and B20 confirmed, fixed.** The argv defect is `006-fanout-deep-review/review/review-report.md:88`, and the long-prompt defect is the A-01 evidence.
- **B21 confirmed, fixed.** The stop-policy paragraph has its own H4. The shared close-out sentence left the release notes, since the deep-loop runtime entry carries it.
- **B22 confirmed, added** from the 852e7cb6c2 body.

## The Orchestrator's Own Pass

The commit trace (`../advisor-commit-trace.txt`) covers all 48 advisor commits since 2026-09-12, not only packet 030's, and the release tags date each fix.

- **O-1, added.** bed9458f13 let two-character executor names reach the scorer. The Skilled v4.0.0.0 release notes record it at line 289, and the advisor changelog did not.
- **O-2, added.** b6f743a0a5, e7b5c29707, 5abee9a3a6 and ca1d6be398 let the advisor find its repository root and launcher under either root name.
- **O-3, added.** 099990cf34 and f5a89115b1 put `cli-jev` and `sk-design` in the advisor's default compiled-route set, which held five hubs before (`runtime/lib/compiled-routing-flag.ts` at 099990cf34^).
- **O-4, fixed.** Two v0.11.2.0 bullets described states that lasted one day and never reached a tag: the uncached plugin (63ad140f9b to 0dde3965d3) and the flags read from `.skilled` by name (a8be338ea6 to a099d0c93c). Both now describe the change between releases, checked against the plugin at ec33385ae5^ and the hook at the same commit.
- **O-5, fixed.** v0.11.2.0 used "Repoint." as its only upgrade lead-in, against `assets/changelog-template.md:126`.
- **O-6, fixed.** The v0.12.0.0 sentence about hooks that never start the daemon described fixes to system-spec-kit's catalog, and the advisor's own `feature-catalog/cli-surface/skill-advisor-cli.md:57` still says "warm-only". The sentence left the advisor entry.
- **O-7, fixed.** The deep-loop runtime topic phrase "grok 4.7 cursor allowlist" carried a number and is now "cursor grok model allowlist".
- **O-8, confirmed with no change.** The one routing replay that defers, "use codex to review the hook installer", predates this work. The hub's inputs differ from HEAD only in their version line, and the re-minted manifest differs from HEAD's only in `effectivePolicyHash` (`../final-gates.txt`).

## Limits

The fixes were checked against their sources and rerun through `validate_document.py` and `hvr_scan.py` (`../entry-checks.txt`). No third reviewer read the final text.

## Left With the Operator

- System-spec-kit `skill-advisor-cli-daemon-backed-surface.md:28` and the advisor's `skill-advisor-cli.md:57` still describe the hook path as warm-only.
- The v4.0.0.2 release entry carries four topic phrases, and "v4.0.0.2 goal changes" carries a version number. The contract allows one or two phrases without a number.
- The advisor's `runtime/lib/compiled-routing-flag.ts:26` comment names a numbered packet path, `014-runtime-engine/lib/resolve.cjs`.
