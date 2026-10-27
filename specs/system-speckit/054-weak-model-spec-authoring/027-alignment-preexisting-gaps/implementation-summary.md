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
    recent_action: "Recorded the count checker, the overrides contract and the whole-phase review"
    next_safe_action: "Run the closeout gates AC-008 to AC-011"
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
    completion_pct: 60
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
| **Completed** | Not yet. In Progress until the closeout gates AC-008 to AC-011 pass |
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

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modified | Resolve slash commands, bare names, scoped paths and spec templates, and skip the non-reference classes |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Modified | Verify each count claim against the folder or tree line it names, and report unverifiable claims separately |
| `.skilled/skills/sk-doc/scripts/tests/test_readme_checker_false_positives.py` | Created | 40 pytest cases, each fix shown to fail before it |
| `README.md`, `.skilled/bin/README.md`, `.skilled/skills/sk-doc/README.md`, `.skilled/skills/sk-doc/sk-create-frontmatter/README.md`, `.skilled/skills/system-spec-kit/README.md` | Modified | Real broken references and shorthand the stricter checker exposed |
| `.skilled/skills/sk-doc/ROUTER.md`, `.skilled/skills/sk-doc/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Four CHANGELOG intent phrases, propagated by the generators |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `scoring-constants.ts` | Modified | The changelog-from-packet rule in `primaryIntentBonus` and its two constants |
| `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl` | Modified | 15 cases in total, five sk-doc changelog cases and ten controls, the thin-margin case included |
| The alignment command's aggregator (gitignored, operator-local), both workflow YAMLs and the presentation contract | Modified (gitignored) | Numeric ids, critic `overrides`, `overturned.json` and the Overturned count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor recorded the baselines (305 unresolved on the root README, 608 across seven, and system-spec-kit first on all four changelog probes), then ran three Opus medium lanes on disjoint files. Lane R took two review rounds, and every P1 they found was fixed with a regression test. Lane A's reviewer found two P1s, an over-broad pattern and an early return that skipped later bonuses, both fixed. Lane T's fresh reviewer found two P2s, both fixed, and the main checkout copy was synced. The conductor then ran the sk-doc script tests, the full advisor suite and its gates, the Hermes checks and strict validation of this phase. New changelog entries are advisor v0.17.10.0 and sk-create-readme v1.3.2.0. Main has shipped system-spec-kit v2.12.8.0 and v2.12.9.0, so this branch's system-spec-kit entry renumbers to v2.12.10.0 at the rebase.
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
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check_readme_references.py` on the seven READMEs | `SUMMARY files=7 pass=7 fail=0`, exit 0. 608 unresolved before, 0 after |
| `check_derived_readme_counts.py` on the seven READMEs | `files=7 pass=7 fail=0 unverified=6`, exit 0. One real wrong count found and fixed |
| `run-script-tests.sh` | Passes. `test_validation_switch.py` passes 8. The new file holds 40 pytest cases, each fix shown to fail before it |
| Full advisor suite | 150 files, 1267 passed, 8 skipped, 0 failed (baseline 1253), before the thin-margin golden case. `scratch/after/advisor-suite.txt` holds an earlier run at 1263 passed |
| Golden, prompt-policy and holdout suites | 36 tests pass |
| Compiled-route-guard, compiled-route-admission `--all`, skill-graph-freshness `--strict`, router-intent-signals `--check`, skill_graph_compiler validation, typecheck, build | All exit 0 |
| Aggregator rerun on a copy of the DeepSeek run | 27 findings with P1=8 became 23 with P1=5 and overturned=4 |
| Aggregator on the numeric-id run | No crash |
| Spec-kit runtime diff | Empty, so the CLI suite was not needed |
| Hermes `sync-skills-hermes.cjs --check` and `sync-prompts-hermes.cjs --check` | 67 skill copies and 39 prompts in sync, both exit 0 |
| `diff -r` of the alignment assets against the main checkout | Exit 0 |
| `py_compile` on both checkers, `node --check` on the aggregator, YAML load of both workflows | All exit 0 |
| `validate.sh --strict` on this phase | `RESULT: PASSED` |
| Fresh Opus medium review of the whole phase | No P0. Its P1 and P2s are being fixed |
| Recursive validation, commit, rebase, trigger-index rebuild | Not run yet, AC-008 to AC-011 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The count checker leaves six claims unverified.** It cannot tie them to a folder or tree line, so it reports them separately instead of passing them, and `--strict` fails them.
2. **The A1 fail-with-revert check is inferred.** The baseline and the metadata-only 2 of 4 state show the probes rank system-spec-kit without the fix. A golden-suite run with both fixes reverted would confirm it directly.
3. **The trigger index is not rebuilt yet.** Rebuild it with `generate-trigger-index.mjs` after the rebase onto main, where the system-spec-kit entry also renumbers to v2.12.10.0.
<!-- /ANCHOR:limitations -->
