# Review Report: skill authoring remediation commits

Range `191aea6baa..03e31f902b` on `worktrees/095-skill-authoring-ux-research`, base `bb3878b570`. One cli-pi lineage (`lineages/dsflash-llmgw`, DeepSeek V4.1 Flash, max effort, llmgateway) ran five iterations; the synthesizer reran or reread every finding before keeping it. Verdict: **CONDITIONAL**, 0 P0, 2 P1, 10 P2.

## 1. The Python battery drop

The Python battery is not a regression from this range. `skill_advisor.py` first tries the compiled TypeScript scorer through a Node bridge, and only when that probe reports unavailable does it fall back to its own local scorer, warning on stderr (`skill_advisor.py:4881-4902`, `_warn_native_fallback` at `:4682`). The 9/17 and 1/5 numbers are that local scorer.

| Command (from the tree root) | 095 (this range) | 094 (untouched) |
|------------------------------|------------------|-----------------|
| battery, default path | 15/17, 0/5 (three runs) | 13/17, 2/5 |
| battery with `--force-local` | 9/17, 1/5 | 9/17, 1/5 |
| battery with `--force-native` | 15/17, 0/5 | 13/17, 2/5 |

`--force-local` gives the same nine wins and the same per-prompt results (P8, P15, P16 `none 0`; N1 sk-code 0.95) in both trees, so the change to the Python mirror in 479186cfed moves nothing on this battery. When the orchestrator's 9/17 reading was taken, the native probe in 095 reported unavailable. The generation file was rewritten at 00:06:47 local by `advisor-server-startup-scan` (generation 25, `live`), and the native path has been live since. The exact reason the earlier probe gave is not recoverable now. The stderr line `Native advisor unavailable (<reason>; ...)` would have named it.

**Smallest fix:** in `011-round-four-remediation/003-hub-surface-precedence/scratch/advisor-battery.cjs`, pass `--force-native` (or fail when a row's `source` is not `native`), so that a degraded probe stops the battery instead of silently switching scorers. No product change is needed for the drop itself. The partial Python mirror is finding P2-07.

## 2. P1 Findings

### P1-01. A skill name before "changelog" counts as a doc target, flipping sk-doc changelog prompts

`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:271`: `DOC_FILE_SUFFIX = /^\s*(?:skill\.md|router\.md|readme(?:\.md)?|changelog)/`. "sk-doc changelog" is how a user names sk-doc's changelog mode. The rule drops sk-doc's explicit mention, and through `targetsOwnDocFile` (`:297`, applied at `:383` and `:389`) it also skips every sk-doc intent signal whenever a write verb is present.

Evidence: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.8 --force-native`, compared between trees:
- "Create a changelog entry for sk-git with the sk-doc changelog mode." 094: sk-doc 0.9035, sk-git 0.8372. 095: **sk-git 0.8528**, sk-doc 0.82 (top-1 flips).
- "Write a sk-doc changelog for the new release." 094: sk-doc 0.95. 095: sk-doc 0.82, tied with sk-design 0.82.

**Smallest fix:** drop `changelog` from `DOC_FILE_SUFFIX`, or match only the file form (`changelog\.md|changelog/`). Add one vitest case with the prompt above.

### P1-02. A staged deletion never selects its skill, so the skill authoring gate skips it

`.skilled/scripts/git-hooks/pre-commit:323` runs `git diff --cached --name-only --diff-filter=ACMR`. When a commit only removes a file under a skill, no skill is selected and none of the three checks run. Leaf manifests list `assets/` and `references/` files (sk-code's lists 163 `references/` entries). The only CI job that runs leaf-manifest freshness, `routing-registry-drift.yml`, has no general `references/**` trigger. A `git rm` of a reference file therefore ships a stale manifest past both the gate and CI. The lineage reproduced the filter in `lineages/dsflash-llmgw/probe/d-filter`.

**Smallest fix:** `--diff-filter=ACMRD`. The existing `-f "$SKILL_ROOT/leaf-manifest.json"` and `mode-registry.json` guards already keep a whole-skill removal from false-blocking. Add a deletion case to `tests/pre-commit.test.sh`.

## 3. P2 Findings

### P2-01. `--strict` freshness gates timestamps, not content or family

`.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:188-191` decides staleness from timestamps only, and family mismatches are reported but never set `strictProblem` (`:252-262`). The CI step is named "compiled json matches graph-metadata" (`.github/workflows/routing-registry-drift.yml:220-226`).

Probe: a copy of the tree (via `SKILL_GRAPH_FRESHNESS_ROOT`) with one signal added to sk-code's graph-metadata and its derived stamp left alone. `--strict` exited 0 while the compiled `signals["sk-code"]` no longer matched disk. The cli-classifier edit in 827e44abc8 itself left the newest source stamp at 2026-10-04, and `skill_graph_compiler.py --validate-only` returns before compiling (`:1135`).

**Fix:** under `--strict`, compare compiled `signals` and `families` with disk, or compile to a temp file and diff.

### P2-02. The catalog validator's missing-path exemption hides real misses

`.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:438-459` has three problems:
- **Any gitignored path passes.** `_present_or_ignored(root, root/'.skilled/skills/system-skill-advisor/runtime/dist/runtime/hanlders/typo-never-existed.js')` returns `True`.
- **Any dangling link passes** through `lexists`, including the genuinely broken `.skilled/changelog/cli-jev/{parent,cli-usage}`.
- **The result depends on the machine,** because `git check-ignore` also reads `.git/info/exclude` and `core.excludesFile`.

**Fix:** pass a dangling link only when its resolved target is ignored by the repository's `.gitignore`. Report an absent ignored path as a note, not a pass. Run `check-ignore` with `-c core.excludesFile=/dev/null`.

### P2-03. The skill authoring gate checks the working tree, not the index

`pre-commit:342`, `:351` and `:360` run the three checks against `$SKILL_ROOT` on disk. An author who regenerates `leaf-manifest.json` but never stages it passes the gate and commits the stale copy, and the block message's own "then git add" step is exactly the one that goes unchecked.

**Fix:** fail when a derived file the checks read is modified but unstaged (`git diff --quiet -- <derived>`).

### P2-04. The gate skips silently when node or a creator script is missing

`pre-commit:315` and `:339-367`. Sibling gates warn or block in the same case (`:155-160`, `:180-188`).

**Fix:** inside the toolchain repo, print a warning for a missing node and block on a missing repo-wide script, as mirror parity does.

### P2-05. The gate fails closed without python3

The doctor treats a failed `python3 --dump-routing-maps` as a hard fail (`parent-skill-check.cjs:968`), but the gate only guards on `node` (`pre-commit:315`). On a machine without python3, every commit that stages a hub file blocks.

**Fix:** guard the doctor call on `command -v python3`, with a warning.

### P2-06. Confirm mode checks for an upstream version collision but has no remedy

`create-changelog-confirm.yaml:501` checks for a collision. Auto increments the BUILD segment (`create-changelog-auto.yaml:516-518`); confirm defines no action.

**Fix:** copy auto's increment instruction.

### P2-07. The Python fallback still scores names inside paths and doc targets

`skill_advisor.py:4295` uses `_matches_phrase_boundary`, with flank class `[a-z0-9_-]` (`:2677`). The mirror covered only the guard and the `findings` removal. No ledger entry records the divergence, and the parity corpus has no `.skilled/` path prompt.

**Fix:** port `hasPlainMention` and `targetsOwnDocFile`, or record the divergence class.

### P2-08. The `engines.node` range is wider than the toolchain it cites

`runtime/package.json:6-8` and the lockfile root declare `>=20.19.0`. vite 8.2.2 and rolldown 1.2.7 in `system-spec-kit/package-lock.json` declare `^20.19.0 || >=22.12.0`.

**Fix:** use the same range.

### P2-09. Two validator behavior changes ship without a changelog line

03e31f902b changed `package_skill.py` (sk-create-skill, after its 1.5.2.0 entry was written) and `validate_catalog_package.py` (sk-create-feature-catalog, still 1.0.1.2). Neither changelog mentions either change.

**Fix:** add a line to v1.5.2.0 and a build bump for sk-create-feature-catalog, or record them for the merge-time hub bump.

### P2-10. `regenerate-skill-derived.cjs` lost its executable bit

`git diff --summary bb3878b570..03e31f902b` shows mode `100755 => 100644` in dffd7f98e2. The file keeps its `#!/usr/bin/env node` shebang, and its usage lines show direct invocation. No caller runs it directly today.

**Fix:** `git update-index --chmod=+x`.

## 4. Predating the Range

- `.skilled/changelog/cli-jev/parent` and `cli-usage` are dangling links (the `cli-jev` skill folder does not exist). P2-02 makes them invisible to the catalog validator.

## 5. Refuted or Clean

- **surfaceHint injection:** the front door parses with first-match `indexOf` and the prompt arrives on stdin, so a hint such as `--hub` cannot change the hub. Unknown values are ignored.
- **Upstream changelog grep matching mode folders:** the local and upstream maxima were equal for every component at HEAD. No remote or no upstream branch falls back to local numbering as written.
- **Gate cost:** nothing on a commit with no staged skill. With a staged hub the doctor took 0.68 to 1.66 s (sk-code, system-deep-loop, sk-doc).
- **Untrusted-clone wording:** accurate. Every gate reads `$SOURCE_ROOT`, and the notice names the setting the trust block reads.
- **Comment hygiene** across all added code comments: clean.
- **Overengineering:** `surfaceHint` answers a contract sk-code's SKILL.md and ROUTER.md already state. `--strict` has the CI caller.
- **The 1.5.2.0 claim "no scorer reads description.json":** true. Neither scorer source references it.
- **Claims reproduced:** the T3 TS battery reads 14/17 and 0/5. Goal budgets: the 011 parent at 3,798 and 014 at 3,246, both `ok`. Version carriers match their newest changelog for system-skill-advisor 0.15.0.0, sk-create-changelog 1.3.4.0 and sk-create-skill 1.5.2.0.
- **Known gaps, not defects:** sk-vision dist, `create-journey-proof.test.cjs`. `test_rename_tooling_fixture_harness.py` and its harness are unchanged in `main..HEAD`, so this range cannot have caused its hang. Whether it hangs at main was not run.

## 6. Verification From the Final State

- `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh`: 85 passed, 0 failed.
- Advisor vitest, the three new files: 22 passed. The full suite: 1024 passed, 6 skipped (137 files), equal to the 827e44abc8 baseline.
- `generate-leaf-manifest-stale-message.test.cjs`: 1 pass. `test_validate_catalog_package.py`: ALL PASS. `test_create_skill_contract.py`: 29 passed.
- `generate-router-intent-signals.cjs --check`: missing=0, RESULT: PASSED. `skill-graph-freshness.cjs --strict`: exit 0.
- Fail-without-fix for each new test was established by the lineage reading the pre-change sources at `bb3878b570`, not by executing the suites against them.

## 7. Run Notes

- `fanout-run.cjs` with one cli-pi lineage, 22:14Z to 22:34Z. Summary: succeeded 1, containment advisory 0. `fanout-merge.cjs`: verdict CONDITIONAL, active P0 0, P1 1.
- The lineage's state log holds iteration 5 twice, so `grep -c '"type":"iteration"'` prints 6 for 5 iterations.
- DevPass never hit its limit, so no switch to cline-pass was needed.
- The deep-review agent definition was inlined through the lineage's `steer.md`, which the runner tells the child to read before every iteration. The runner has no Pi persona-injection option.
