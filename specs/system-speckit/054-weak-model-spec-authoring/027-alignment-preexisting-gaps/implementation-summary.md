---
title: "Implementation Summary"
description: "The README reference checker now fails only on real broken references, sk-doc wins packet-local changelog requests while spec-kit prompts stay put, and the alignment aggregator accepts numeric ids and applies the critic's overrides."
trigger_phrases:
  - "alignment preexisting gaps implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/027-alignment-preexisting-gaps"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Merged the README checkers with sk-doc/071 and closed the phase"
    next_safe_action: "None. The phase is complete"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py"
      - ".skilled/skills/sk-doc/scripts/tests/test_readme_checker_false_positives.py"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/sk-doc/ROUTER.md"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-alignment-preexisting-gaps"
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
| **Spec Folder** | 027-alignment-preexisting-gaps |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The README reference checker went from 608 unresolved references on seven READMEs to 0, and every one it still reports is a real broken path or typo. A request to write a changelog for a packet now reaches sk-doc's changelog mode, and the alignment aggregator no longer crashes on numeric ids or counts findings the critic overturned.

### Phase 27: alignment-preexisting-gaps

`check_readme_references.py` resolves a slash command against `.skilled/commands`, grouped and top-level, with mode checks. A bare name resolves repo-wide, and a path with a slash resolves only from the README folder or the repo root. Spec docs resolve through their `.tmpl`. It skips gitignored files, `.sk-code/`, `.sk-git/`, placeholders, home and absolute paths, fence comments, shell assignment keys and the labels of working links. A typo still fails. The stricter checker also exposed real broken references and shorthand in five READMEs, and those lines were fixed under the 2026-10-27 scope amendment.

For the advisor, sk-doc's CHANGELOG intent gained four phrases. That fixed 2 of the 4 changelog probes, so the conductor approved one scorer rule: when a write verb governs a changelog noun phrase and the prompt names a packet, nested folder or spec folder, sk-doc gets +0.12 and system-spec-kit -0.12. Other skills fall through to the later bonuses. The aggregator coerces ids to strings, applies the critic's `overrides` (refuted, duplicate, pre-existing or severity), reports ambiguous and stacked overrides, and writes `overturned.json`.

The count checker (`check_derived_readme_counts.py`) now verifies a claim against the folder the sentence names, or against a tree line, and reports claims it cannot verify separately, which `--strict` fails. It caught one real wrong count: `system-spec-kit/README.md:382` said "two committed scripts" for a folder of five, and the line now names the two scripts.

While the phase closed, main shipped `specs/sk-doc/071-readme-reference-debt`, a separate rewrite of the same two checkers built on `readme-check` marker blocks and built-in self-tests. The operator chose to merge both. The merged checkers keep every 071 rule, marker block and self-test and add this phase's resolution classes and folder-verified counts. Two fresh Opus high reviews then found regressions the merge introduced, among them a mid-word `#` cutting a fenced line short, unverified counts passing by default and a named folder judged by the README's own inventory, and two fix rounds closed every one with a regression test. An unverified count now failed by default, as 071's contract had it. Main then shipped a third rewrite, `specs/sk-doc/070-repo-doc-debt/007-alignment-fixes`, which checks every link, inventory row and tree line and fixed README debt across the repository. A fresh Opus high compared the two on both test suites and a full README sweep and recommended adopting main's checkers and porting only what they lacked: slash-command checks, placeholder and shortened-label handling, more count claim shapes and test-file names, and a deleted tracked file failing. That port replaced this branch's merged checkers, a third fresh Opus high review drove one more fix round, and READMEs naming retired commands were reworded as prose. Run on the same 987 tracked READMEs, main's checkers fail 336 on references and 59 on counts and the final ones 318 and 54, and no README that passes main's checkers fails the final ones.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modified | Main's sk-doc/070 checker with slash-command checks, placeholder handling, shortened-label handling and deleted-file detection ported on top |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Modified | Main's sk-doc/070 checker with more claim shapes, test-file names, tree lines without `#`, rate and result exclusions and named-folder counting ported on top |
| `.skilled/skills/sk-doc/scripts/tests/test_readme_checker_false_positives.py` | Created | Pytest cases for the ported capabilities, each shown to fail before its change |
| `README.md`, `.skilled/bin/README.md`, `.skilled/skills/sk-doc/README.md`, `.skilled/skills/sk-doc/sk-create-frontmatter/README.md`, `.skilled/skills/system-spec-kit/README.md` | Modified | Real broken references and shorthand the stricter checker exposed |
| `.skilled/skills/sk-doc/ROUTER.md`, `.skilled/skills/sk-doc/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Four CHANGELOG intent phrases, propagated by the generators |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `scoring-constants.ts` | Modified | The changelog-from-packet rule in `primaryIntentBonus` and its two constants |
| `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl` | Modified | 15 cases in total, five sk-doc changelog cases and ten controls, the thin-margin case included |
| The alignment command's aggregator (gitignored, operator-local), both workflow YAMLs and the presentation contract | Modified (gitignored) | Numeric ids, critic `overrides`, `overturned.json` and the Overturned count |
| `.skilled/hooks/README.md`, `.skilled/hooks/dispatch/README.md`, `.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/lib/README.md`, `.skilled/skills/system-spec-kit/runtime/lib/validation/README.md`, `.skilled/skills/sk-doc/sk-create-frontmatter/README.md`, `.skilled/skills/sk-design/sk-design-diagram/assets/style-reference/README.md` | Modified | Real defects the checkers proved, and counts or placeholders reworded so the checkers can verify them instead of a marker |
| `.skilled/skills/cli-external-orchestration/benchmark/README.md`, `.skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/README.md`, `.skilled/skills/sk-code/benchmark/README.md`, `specs/sk-doc/z_archive/019-skill-routing-refactor/research/post-019-angles/README.md` and six archived spec READMEs | Modified | A retired command named as a code span reworded as plain prose |
| `.skilled/bin/README.md`, `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/lifecycle/README.md`, `specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/scratch/README.md`, `specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/088-speckit-known-limitations-remediation/README.md`, `specs/system-speckit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/README.md` | Modified | `allow-count` entries with checked reasons for correct counts no rule can prove, and a stale entry removed |
| `specs/sk-code/016-review-mode-followups/` and `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/` docs and research files | Modified | The operator-local command name replaced by a description, so no tracked file names it |
| `.skilled/skills/system-spec-kit/changelog/v2.12.13.0.md`, `.skilled/skills/sk-doc/changelog/v2.3.24.0.md`, `.skilled/skills/sk-doc/sk-create-readme/changelog/v1.3.4.0.md`, `.skilled/skills/system-skill-advisor/changelog/v0.17.16.0.md` and their version carriers | Created and modified | Release entries, renumbered past the versions main shipped meanwhile |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor recorded the baselines (305 unresolved on the root README, 608 across seven, and system-spec-kit first on all four changelog probes), then ran three Opus medium lanes on disjoint files. Lane R took two review rounds, and every P1 they found was fixed with a regression test. Lane A's reviewer found two P1s, an over-broad pattern and an early return that skipped later bonuses, both fixed. Lane T's fresh reviewer found two P2s, both fixed, and the main checkout copy was synced. The conductor then ran the sk-doc script tests, the full advisor suite and its gates, the Hermes checks and strict validation of this phase. The first rebase renumbered this branch's system-spec-kit entry to v2.12.10.0 past main's v2.12.8.0 and v2.12.9.0. Main then moved again and took sk-doc v2.3.21.0, sk-create-readme v1.3.2.0 and advisor v0.17.10.0 and v0.17.11.0, so the second rebase moved them on, and later rebases settled them at spec-kit v2.12.13.0, sk-doc v2.3.24.0, sk-create-readme v1.3.4.0 and advisor v0.17.16.0, the last onto `8973d16740`, after restoring main's own advisor v0.17.12.0 entry that the earlier renumbering had overwritten. It also brought in sk-doc/071, which the operator chose to merge with this phase's checkers. An Opus medium agent merged them, two fresh Opus high reviews followed, and an Opus high agent fixed each round's findings. When main shipped sk-doc/070, a fresh Opus high compared the designs and recommended option B, an Opus high agent ported this phase's capabilities onto main's checkers, and a third review round was fixed the same way.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Allow one narrow scorer rule (2026-10-27 scope amendment) | Routing metadata alone moved 2 of 4 probes, and the operator directed "fix not fixed items" and then "fix all" |
| Gate the rule on a verb that directly governs the changelog noun phrase | A looser pattern pulled prompts such as "add a nested phase ... for the changelog work" off system-spec-kit |
| Let other skills fall through to the later bonuses | An early return skipped bonuses that other prompts depend on |
| Fix the README lines the stricter checker exposed (2026-10-27 scope amendment) | They were real broken references or shorthand, not checker false positives, and the operator said "fix all, perfect it" |
| Reword "Resume work on this packet" to "Resume work on this spec packet" | The prompt policy declines a 3-token prompt, so the golden case never reached the scorer |
| Merge this phase's checkers with sk-doc/071 instead of picking one (operator, 2026-10-27) | Each design caught defects the other missed, and neither passed the other side's READMEs |
| Adopt main's sk-doc/070 checkers and port only what they lack (fresh Opus high recommendation) | Main's version raised fewer false positives and checks inventory rows, while this phase's slash-command, label and count checks caught real defects it missed. A third merge would have brought back the package-root false positives |
| Fail an unverified count by default | 071 failed these closed, and a count that names no folder can hide a wrong number. An `allow-count` entry with its reason covers a deliberate one |
| Fix a README's prose where the checker can verify it, and use a marker only for correct text no rule can prove | A marker hides drift, while a verifiable sentence keeps being checked |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both merged checkers on ten READMEs, one per run | Every run exit 0. 608 unresolved references on the first seven before this phase, 0 after |
| Both `--self-test` runs, main's two test files and this phase's file | Both exit 0, `39 passed` |
| Sweep of all 987 tracked READMEs, main's checkers against the final ones on the same files | References 336 against 318, counts 59 against 54, and no README newly failing |
| `run-script-tests.sh` | Passes. `test_validation_switch.py` passes 8, and main's two checker test files and this phase's file pass 39 |
| Full advisor suite | 154 files, 1321 passed, 8 skipped, 0 failed on the final rebase |
| Golden, prompt-policy and holdout suites | 36 tests pass |
| Compiled-route-guard, compiled-route-admission `--all`, skill-graph-freshness `--strict`, router-intent-signals `--check`, skill_graph_compiler validation, typecheck, build | All exit 0 |
| Aggregator rerun on a copy of the DeepSeek run | 27 findings with P1=8 became 23 with P1=5 and overturned=4 |
| Aggregator on the numeric-id run | No crash |
| Full CLI suite | 2242 passed, 20 skipped, 0 failed on the final rebase, equal to the baseline |
| Hermes `sync-skills-hermes.cjs --check` and `sync-prompts-hermes.cjs --check` | 67 skill copies and 39 prompts in sync, both exit 0 |
| `diff -r` of the alignment assets against the main checkout | Exit 0 |
| `py_compile` on both checkers, `node --check` on the aggregator, YAML load of both workflows | All exit 0 |
| `validate.sh --strict` on this phase | `RESULT: PASSED` |
| Fresh Opus medium review of the whole phase | No P0. Its P1 and P2s were fixed |
| Fresh Opus high reviews of the merged and ported checkers | The merge drew 2 P1 and 7 P2, then 1 P1 and 3 P2, and the port 2 P1 and 5 P2. All fixed, each with a regression test |
| Rebase onto main, routing gates, Hermes check, trigger index, release entries | Rebased onto `18e085c52b` with no conflict left. The routing gates and `sync-skills-hermes.cjs --check` pass, `generate-trigger-index.mjs --check` exits 0, and the four release entries report 0 issues |
| `validate.sh --strict --recursive` on packet 054 | `RESULT: PASSED` for every folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **318 READMEs still fail the reference check and 54 the count check across the repository.** Every one of them also fails main's checkers, so none is a regression, and they are content debt outside this phase.
2. **The A1 fail-with-revert check is inferred.** The baseline and the metadata-only 2 of 4 state show the probes rank system-spec-kit without the fix. A golden-suite run with both fixes reverted would confirm it directly.
<!-- /ANCHOR:limitations -->
