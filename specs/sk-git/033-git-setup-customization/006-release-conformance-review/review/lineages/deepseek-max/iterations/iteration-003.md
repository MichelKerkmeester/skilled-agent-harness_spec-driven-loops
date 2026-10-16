# Iteration 3 - Skill docs: authoring-standard conformance of the sk-git documentation

## Dispatcher

- Mode: review (fan-out lineage `deepseek-max`), iteration 3 of 5, stop policy `max-iterations`
- Focus: `maintainability` + `traceability` over the eight sk-git doc entries; judged against
  `sk-create-skill`, `sk-create-readme`, `sk-create-manual-testing-playbook`,
  `sk-create-feature-catalog`, and the Human Voice Rules; package validators run read-only
- Executor: this process (iterations run inline; no nested dispatch)

## Files Reviewed

- `.skilled/skills/sk-git/SKILL.md` — full read (579 lines)
- `.skilled/skills/sk-git/README.md` — full read (296 lines)
- `.skilled/skills/sk-git/assets/commit-message-template.md` — §1-§5 read; §7 existence and
  validator state checked
- `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md` —
  full read (102 lines)
- `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` — index structure,
  section titles, census tables and the doctor section read; scenario tree enumerated
- `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` — full read (69 lines)
- `.skilled/skills/sk-git/feature-catalog/feature-catalog.md` — doctor entry and structure read;
  whole file used by the catalog validator
- `.skilled/skills/sk-git/scripts/hooks/README.md` — structure and §3/§4 read (219 lines)

Validators run read-only (TMPDIR pointed into this lineage):

- `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py
  .skilled/skills/sk-git` → **FAIL, exit 1** — `package_skill.py --check`: "SKILL.md exceeds word
  limit (5038 words, max: 5000)"
- `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`
  → `PASS package=sk-git ... scenarios=46 categories=9 ... violations=0 warnings=0`, exit 0
- `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py`
  → `PACKAGE sk-git: PASS tier=fail violations=0`, exit 0
- `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on all eight files → VALID, exit 0
  (one document-type-fallback warning each for the playbook index and the catalog; one
  `non_sequential_numbering` warning in the catalog)
- `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` on all eight
  files: release-new files clean (`doctor-git-setup-check.md` 99/100, `doctor-git-settings.md`
  99/100); large semicolon counts on the long-standing docs (playbook index 53, hooks README 32,
  catalog 12) were sampled with `git diff <release-commit>^ <release-commit>` and are pre-existing
  prose, not release additions — not filed.

## Findings

### P0 Findings

No P0 findings.

### P1 Findings

1. **sk-git fails its own skill-packaging check: SKILL.md is 5038 words against a 5000 hard limit** -- `.skilled/skills/sk-git/SKILL.md:1` -- `package_skill.py --check` returns FAIL and exit 1 with "SKILL.md exceeds word limit (5038 words, max: 5000)" (`package_skill.py:101` sets `MAX_SKILL_MD_WORDS = 5000`; line 463 returns False on the hard limit, distinct from the 3000-word advisory at line 465). The wrapper `validate_skill_package.py .skilled/skills/sk-git` therefore exits 1, and the skill's own README §8 documents this exact command as reporting PASS (`README.md:272`), so the release's documented verification currently fails when run.
   Finding class: standards conformance / packaging validation failure
   Scope proof: `SKILL.md` is a manifest entry; the count, the limit and the failure are produced by the repo's own validator on the file as committed; `README.md:272` is the same manifest and cites the failing command.
   Affected surface hints: `package_skill.py --check` / `validate_skill_package.py` (skill packaging gate); `README.md:272` verification row; SKILL.md §4 ALWAYS #8 and the §3 `/doctor:git` section are the largest recent text blocks if trimming is needed.
   Case: a maintainer runs the README §8 verification row verbatim (`python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-git --check`) and gets `Result: FAIL` with exit 1 instead of the documented PASS.
   ```json
   {
     "type": "claim-adjudication",
     "claim": "The sk-git skill package fails the repository's skill-packaging check because SKILL.md exceeds the 5000-word hard limit.",
     "evidenceRefs": [
       ".skilled/skills/sk-git/SKILL.md:1-579 (5038 words measured by package_skill.py)",
       ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:101,463",
       ".skilled/skills/sk-git/README.md:272"
     ],
     "counterevidenceSought": "Checked whether the 5000 limit is advisory only (it is not: the 3000-word value is the advisory, the 5000 one returns False), whether the count excludes frontmatter or code blocks (the validator's own count is the contract number), and whether the failure predates the release (irrelevant to current conformance; the release edited SKILL.md and claims the check passes).",
     "alternativeExplanation": "The README's parenthetical about advisory snake_case findings could be read as covering all findings; it explicitly scopes to snake_case naming, and the word-limit result is a FAIL, not a warning.",
     "finalSeverity": "P1",
     "confidence": 0.95,
     "downgradeTrigger": "Downgrade to P2 if the packaging check is shown to be non-blocking for this repository's release process (e.g. excluded from CI and the skill-authorship contract)."
   }
   ```
   Skeptic/Referee pass: the skeptic challenge above found no path by which the validator passes today; the referee confirms P1 (fail-closed validator, self-documented as passing).

### P2 Findings

1. **SKILL.md's playbook census is stale** -- `.skilled/skills/sk-git/SKILL.md:573` -- the section claims "scenario files (`GIT-001`..`GIT-042`) across 8 categories", while the playbook holds `GIT-001`..`GIT-046` plus `DOC-369`..`DOC-384` across 9 category folders (the release added `doctor-commands/`). The same release updated the README to "9 categories" (`README.md:267,288`) but missed this line.
   Finding class: traceability / documentation drift
   Scope proof: both files are manifest entries; the tree enumeration (46 scenarios, 9 category dirs) and the playbook validator's own `scenarios=46 categories=9` line are the evidence.
   Affected surface hints: SKILL.md §8 playbook blurb; playbook index and doctor-commands/README census prose; README §8 verification text.
   Case: a reader uses the SKILL.md census to scope a validation run and under-counts the doctor scenarios; an auditor comparing the two docs finds them disagreeing.

2. **A documented validation command does not run as written** -- `.skilled/skills/sk-git/SKILL.md:573` -- "Run `bash .skilled/skills/sk-doc/scripts/validate_document.py manual-testing-playbook/manual-testing-playbook.md` for structural validation" invokes a Python script through `bash` (bash parses it as shell: `cite-drift: command not found`, non-zero exit) and passes a path that is relative to the skill root, so it also fails the file lookup when run from the repository root. `README.md:271` carries the runnable form (`python3 ... --type readme`).
   Finding class: traceability / documented command correctness
   Scope proof: the command was executed verbatim in both working directories and failed; the counterexample is the README's correct form.
   Affected surface hints: SKILL.md §8 validation instruction; `validate_document.py` invocation conventions; the validator's `--type`/path contract.
   Case: an operator copies the SKILL.md line and gets a bash parse error and a missing-file error instead of a structural validation result.

3. **Playbook index's canonical artifact list omits `doctor-commands/`** -- `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:18-27` -- the list names eight category folders while the package contains nine; the index's own §15 adds the DOC scenarios and line 33 calls the list above "the authoritative inventory", so the authoritative-inventory sentence points at a list that is missing a category.
   Finding class: traceability / documentation drift
   Scope proof: the folder exists and is indexed in §15 and the wave table; the list at 18-27 omits it.
   Affected surface hints: playbook index §"Canonical package artifacts"; §15 doctor section; doctor-commands/README cross-links.
   Case: an operator or tool that reads the canonical artifact list to enumerate categories will never visit `doctor-commands/` even though the playbook contains it.

4. **Playbook index range and count statements lag the tree** -- `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:603` -- §13 is titled `GIT-023..GIT-043` and opens "This category covers 18 scenarios" while it lists 13 (GIT-023..GIT-034 plus GIT-043); §8's title says `GIT-004..GIT-007` while the section also lists GIT-044..GIT-046 (line 221); the wave table repeats the stale ranges at lines 159 (Wave 1 `GIT-001..GIT-007`) and 161 (Wave 5 `GIT-023..GIT-043`).
   Finding class: traceability / documentation drift
   Scope proof: headings and scenario files counted directly; the playbook validator reports 46 scenarios across 9 categories, consistent with the tree, not with these ranges.
   Affected surface hints: index section titles, the per-wave census table, and any reader scoping a run by range.
   Case: someone running "Wave 5" by its declared range looks for GIT-035..GIT-041, which do not exist, and misses that GIT-043 belongs to its own section.

5. **Catalog entry omits the DEGRADED verdict from the battery's vocabulary** -- `.skilled/skills/sk-git/feature-catalog/feature-catalog.md:163` -- the doctor entry says `/doctor:git setup` "prints PASS, FAIL, SKIP or UNKNOWN for each", but the battery has five results (PASS, FAIL, SKIP, UNKNOWN, DEGRADED), as the sibling artifacts state (`doctor-git-setup.yaml` step 3, `doctor-git-presentation.txt` result row, `workflow-playbooks/doctor-git-settings.md`). A reader of the catalog alone would not expect a DEGRADED row or its exit-3 status.
   Finding class: traceability / documentation accuracy
   Scope proof: the catalog line is a manifest entry; the battery's five-valued result vocabulary and the exit-3 mapping are verified in iterations 1-2.
   Affected surface hints: catalog doctor entry; the feature-catalog doc consumed by routing and advisor surfaces.
   Case: an operator scripting against the catalog's list of possible verdicts treats DEGRADED as impossible and misreads a gate-saved-off run.

## Traceability Checks

- `spec_code` (core): partial — packet spec.md remains scaffold context; this iteration checked
  docs against their sk-doc contracts and cross-references, and the divergences are the findings.
- `checklist_evidence` (core): partial — no checklist.md rows; the validator set above is the
  release evidence for this surface.
- `skill_agent` (overlay): partial — SKILL.md's §3 `/doctor:git` section names the command and
  its router (`.skilled/commands/doctor/git.md`), and the router references back; the concrete
  drift is recorded in findings 1-5, none of it in that linkage.
- `agent_cross_runtime` (overlay): pending — `.hermes/skills/sk-git/SKILL.md` is iteration 4's subject.
- `feature_catalog_code` (overlay): partial — catalog validator PASS; one vocabulary drift
  recorded (finding 5).
- `playbook_capability` (overlay): partial — playbook validator PASS with 46/9; index census
  drift recorded (findings 3-4).

## Integration Evidence

- `feature-catalog/workflow-playbooks/doctor-git-settings.md` was checked against the battery and
  the route: eleven checks, the five verdicts, the exit-code mapping and the `--json` contract all
  match the code read in iterations 1-2; its test-file listing matches the tests that exist.
- `manual-testing-playbook/doctor-commands/doctor-git-setup-check.md` (`DOC-384`) was checked
  against `git-setup-check.cjs`: its eleven-row order, exit codes (0/3/1/2), `--json` shape and
  no-write claim all match; the playbook validator accepts its structure.
- `README.md:232` correctly routes an operator to `/doctor:git hooks`, `/doctor:git standards` and
  `/doctor:git setup` with the read-only and dry-run properties stated.
- `scripts/hooks/README.md` §3 lists the same six runtimes, files and events the battery's
  `TOOL_FILES`/`TOOL_HOOK_EVENTS` tables check, including Pi's `tool_call` and OpenCode's
  `tool.execute.before` carrying an import of `git-rule-checks.mjs`.

## Edge Cases

- The HVR scanner reports hard punctuation blockers on the long docs (playbook index 53, hooks
  README 32, catalog 12); release-commit diffs added 0-2 semicolon lines, so these are pre-existing
  prose, recorded but not filed against this release.
- `validate_document.py` warns `document_type_fallback` for the playbook index and the catalog
  (README rules applied); the packet-specific validators were run in addition, which is why both
  surfaces still carry a PASS.
- The catalog validator flags `non_sequential_numbering` (section 4 after 3) as a warning; the
  catalog's section order is deliberate and advisory-only.

## Confirmed-Clean Surfaces

- `validate_document.py` exits 0 on all eight files; `hvr_scan.py` is clean on the two assets the
  release added for the doctor surface (`doctor-git-setup-check.md` 99/100,
  `doctor-git-settings.md` 99/100).
- The new playbook scenario's contract matches the battery exactly: eleven checks in order, the
  five verdicts, the exit-code mapping, the `--json` payload shape, the `--tool nope` usage exit,
  and the changed-nothing pass condition.
- `commit-message-template.md` §7 is the single enforced rules block the hooks, the agent gate and
  CI read (SKILL.md §"Commit Message Logic" and the template cross-reference each other), and its
  §6 self-check lists the same subject/type/scope/body/trailer checks SKILL.md states.

## Ruled Out

- "The playbook tree and the index disagree on which files exist": ruled out — every index heading
  maps to a scenario file and every scenario file is indexed; the drift is in range/count prose.
- "The doctor scenario was written against a stale battery": ruled out — it names the eleven
  checks, order and exit codes that the code implements.
- "HVR hard blockers were introduced by the release's doc edits": ruled out for the three long
  docs by the release-commit diffs; the release-new presentation asset case is iteration 2's finding.

## Next Focus

- Dimension: traceability (cross-repo references) + correctness spot-check
- Focus area: `README.md` (root), `.skilled/commands/README.txt`,
  `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`,
  `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md`,
  `.hermes/skills/sk-git/SKILL.md`; search the repo for every listing of doctor commands,
  sk-git surfaces and `/doctor:git` targets that must name `setup`
- Reason: charter order; the report already lists every doctor command target and this iteration
  is where a stale or missing listing is most likely
- Required evidence: `route-validate.sh` (already green at iteration 2) plus repo-wide searches;
  diff of the Hermes mirror against the canonical sk-git SKILL.md
- Rotation status: skill docs complete; findings 1-5 stand unless a later iteration disproves one.

## Verdict

Review verdict: CONDITIONAL
