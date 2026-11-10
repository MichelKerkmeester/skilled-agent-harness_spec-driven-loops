# Completeness critic: packet 054 alignment audit

Read-only. No repository file edited, no git write, no build or test suite run.

## New findings (not in lanes A to D)

### X1 (P2, literal) `.env.example` leaves out the new `SPECKIT_DRAFT_AUTO_REPAIR` switch

- Evidence: `rg -c SPECKIT_DRAFT_AUTO_REPAIR .env.example` returns nothing. The switch is read in `runtime/cli/spec/validate.sh` and `runtime/lib/validation/orchestrator.ts`, documented at `runtime/ENV-REFERENCE.md:207`, and the v2.12.0.0 changelog (`changelog/v2.12.0.0.md:72`) tells operators to set it. `.env.example` was last brought to "list every operator-settable variable" in `eb4e982ca1`, and its validate section (`.env.example:174-179`) lists `SPECKIT_STRICT`, `SPECKIT_QUIET` and `SPECKIT_RULES` beside it. Every other `SPECKIT_*` token the 054 code diff adds is either already listed or is the `SPECKIT_TEMPLATE_SOURCE` marker, which is not an env var.
- Fix: insert one line after `.env.example:179`.
  - old: `# SPECKIT_RULES=                        # Comma-separated subset of rules to run`
  - new: `# SPECKIT_RULES=                        # Comma-separated subset of rules to run` followed by a new line `# SPECKIT_DRAFT_AUTO_REPAIR=true        # Graduated ON: a strict full-rule validate on a Draft packet repairs derived metadata once; 0/false/off keeps it read-only`

### X2 (P2, literal) The complexity matrix still lists `effort-est` after the 054 trim removed effort estimation

- Evidence: `.skilled/skills/system-spec-kit/assets/complexity-decision-matrix.md:44` reads `| 56-79       | 3     | Full         | Level 2 + decision-record                   | dep-graph (ASCII), effort-est |`. Commit `62e4661e01` (phase 016) deleted the `| Effort estimation ...` row from this same file, and the 016 implementation summary says these files now have "no effort row". `template-compliance-contract.md:143` says "The template carries no effort-estimation section".
- Fix:
  - old: `| dep-graph (ASCII), effort-est |`
  - new: `| dep-graph (ASCII)             |`

### X3 (P2, judgment) Per-task effort wording survives in the examples and two template references

- Evidence: the core tasks template's format line is `T### [P?] Description (file path). Verify: <command> prints <expected output>` (`templates/core/tasks.md.tmpl:53`), with no effort field. The filled examples and two references still teach effort estimates:
  - `templates/examples/level-2/tasks.md:3,18,32,131`: "with effort estimates", the `[effort]` token in the Task Format, and "- Effort estimates per task". Task rows such as `:58` carry `[1h]`, and the phase headings at `:51` and `:75` carry hour ranges.
  - `templates/examples/level-3/tasks.md:32` and `templates/examples/level-3+/tasks.md:33`: `[effort]` in the Task Format.
  - `references/templates/level-specifications.md:121`: "- Estimated effort per task" under the Level 1 tasks.md required sections.
  - `references/templates/template-guide.md:126` and `:459`: "- Estimated effort per task".
  Phase 016 removed effort estimation from the templates, the examples and these same reference files (`62e4661e01` deleted the "Effort estimation" lines in `level-specifications.md`). The scope line in `016-scaffold-filler-section-trim/spec.md:78` says "in the templates and the filled examples". A model that copies an example is still shown an effort field that the template no longer has, and this is the copy behavior 015 and 016 set out to stop.
- Fix: in the three example tasks.md files, drop `[effort]` from the Task Format line so it matches the template, drop the `[Nh]` suffixes and the hour ranges in the phase headings, and remove the "effort estimates" wording in the description, the EXAMPLE comment and the trailing LEVEL 2 comment. Delete the "- Estimated effort per task" bullet at `level-specifications.md:121`, `template-guide.md:126` and `template-guide.md:459`. Rerun `check-example-drift.sh` afterwards. Leave the `Actual Effort` rows in the implementation-summary examples alone: they record what happened, not an estimate the template asks for.

## Gaps closed (checked and found aligned)

1. **Deleted add-on mentions across the whole repo** (not only scope.txt). I searched for `before-after|roadmap|resource-map` and the `.tmpl` names over `.skilled`, `.hermes`, `.claude`, `.codex`, `.pi`, `.cursor`, `.devin`, `.github`, the root README, AGENTS.md and CONTRIBUTING.md, excluding specs/, node_modules, dist and changelog history. That came to 502 hits. Every one was one of these: the deep-loop's own research or review resource-map ledger; the legacy packet-root `resource-map.md` reader lists in the runtime libs and in `speckit-resume-*.yaml` (old packets still hold one, and lane D cites 013 spec.md:81 as the reason detection was kept on purpose); `/create:diff` before/after; generic "roadmap" prose; or generated retrieval fixtures and trigger-index paths into specs/. None refers to a removed spec-kit template, and no `--with-roadmap`, `--with-before-after` or `addons/(roadmap|before|resource)` reference remains anywhere.
2. **Stale counts.** No "41 rules", "41-rule", "18 templates", or ten/nine/eight add-on count remains outside changelogs and specs.
3. **Template contract docs** (`templates/CONTRACT.md`, `EXTENSION-GUIDE.md`, `MIGRATION.md`), which no lane read. None names a removed add-on. MIGRATION.md's add-on list is `decision-record.md` and `timeline.md`.
4. **Orchestrate agent copies.** Lane D's F1 lists four copies. `.devin/agents/orchestrate/AGENT.md` and `.cursor/agents/orchestrate.md` are symlinks onto `.claude/agents/orchestrate.md` (`.devin/SYNC.md` section 2), so the `.claude` edit fixes them too. A plain `rg` (which does not follow symlinks) finds the `exit code 0 or 1, NOT 2` line in exactly the five files lane D named.
5. **Benchmark reports class** (16 files under `system-spec-kit/benchmark/reports/2026-10-25--*`, which neither scope.txt nor any lane covered). Checked against `sk-create-benchmark` SKILL.md section 6:
   - Both folder names follow `<date>--<subject>--<variant>`, with `manual-testing-playbook` and `model-eval` as the subjects.
   - Each holds README.md, results.csv and source.md, the same shape as the 2026-10-19 peers.
   - The index `reports/README.md:27-28` has rows for both.
   - `validate_document.py --type readme` prints `VALID ... Total issues: 0` for the index, both READMEs and both source.md files. I read the printed verdicts. The rc I captured was the pipe's, not the validator's, so the exit status is not observed.
   - No em dash appears in any of them.
6. **Deep-loop catalog and playbook files** that 054 touched (6 files in `deep-research` and `deep-review`, outside scope.txt). The diff of `6df0a21a0d` only rewords "template-shaped" to "ten-category" and bumps per-file versions, which matches the add-on removal. `validate_catalog_package.py --package system-deep-loop/deep-research` and the same for `deep-review` print `PASS tier=fail violations=0`. `validate-playbook-package.cjs` exits 0 on both playbooks. Its deep-research census mismatch warning (`manual-testing-playbook.md:30`, 54 vs 62) comes from `f2f2704fb3` (2026-07-11), so it predates 054.
7. **Env switch documentation.** `SPECKIT_DRAFT_AUTO_REPAIR` is in ENV-REFERENCE.md:207, so the env-reference drift guard is satisfied. It is missing only from `.env.example` (X1). `SPECKIT_QUIET` in `.env.example` dates from `eb4e982ca1`, before 054.
8. **Guard wiring.** `check-example-drift.sh` and `check-card-sync.sh` are wired into the speckit plan, implement and complete yaml `guard_scripts_command` and documented in the README, the catalog and the playbook.
9. **Scope-gap confirmation.** I rebuilt the list from the 46 commits that touched `specs/system-speckit/054-weak-model-spec-authoring`. They touched 184 non-spec files, and 124 of those are not in scope.txt. The extra 124 are create and speckit yamls, agents, deep-loop docs, benchmark reports, templates, examples, references and tests. The lanes covered them, except the classes closed above in items 5 and 6. The rebuilt list is in `critic-wm-files.txt` and `critic-notinscope.txt`, both in this folder. Scope.txt's `.github/workflows` and `CONTRIBUTING.md` entries come only from the other 054 packet (`054-decommission-debt-fixes`), so they are outside the weak-model audit.
10. **Example stamps.** The filled examples carry `v2.2` stamps while the core templates are at `v2.4`. I did not report this: the examples already hold the v2.4 Measured Behavior block, `templates/examples/README.md` says examples "are not source templates", and no standard I found requires their stamps to track the template's version. Confirming this needs the `check-example-drift.sh` contract, which I did not run (no scripts under a running suite).

Not run: any test suite, `check-example-drift.sh`, or a build.
