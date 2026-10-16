# Iteration 2 - Command surface: traceability + maintainability of /doctor:git

## Dispatcher

- Mode: review (fan-out lineage `deepseek-max`), iteration 2 of 5, stop policy `max-iterations`
- Focus: `traceability` + `maintainability` over the five command-scope entries; judged against
  `.skilled/skills/sk-doc/sk-create-command/` (router/presentation split), with prose judged by
  the Human Voice Rules (`sk-create-with-human-voice/`)
- Executor: this process (iterations run inline; no nested dispatch)

## Files Reviewed

- `.skilled/commands/doctor/git.md` — full read (91 lines)
- `.skilled/commands/doctor/assets/doctor-git-setup.yaml` — full read (61 lines)
- `.skilled/commands/doctor/assets/doctor-git-presentation.txt` — full read (271 lines)
- `.skilled/commands/doctor/_routes.yaml` — `/doctor:git` block and header schema read
  (lines 1-39, 237-290); whole manifest consumed by the validator
- `.skilled/commands/doctor/scripts/README.md` — full read (174 lines)

Validators run read-only (TMPDIR pointed into this lineage):

- `bash .skilled/commands/doctor/scripts/route-validate.sh` → `OK: route-validate — 14 routes
  validated, 2 warnings` (informational multi-target flag warnings), exit 0
- `bash .skilled/commands/doctor/scripts/route-validate.sh --self-test` → all negative fixtures
  rejected, exit 0
- `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/git.md`
  → `VALID`, one warning `command_description_over_soft_target`
- `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py
  .skilled/commands/doctor/git.md` → PASS
- `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` on `git.md`
  (no hard blockers, ceiling 97/100) and on `doctor-git-presentation.txt` (4 hard blockers,
  ceiling 80/100)
- `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs` →
  `routers=34 clean=34 path-drift=0 shape-drift=0`, exit 0

## Findings

### P0 Findings

No P0 findings.

### P1 Findings

No P1 findings.

### P2 Findings

1. **Presentation asset carries four hard semicolon blockers** -- `.skilled/commands/doctor/assets/doctor-git-presentation.txt:262` -- the next-step suggestion table prose uses semicolons at 262:154, 263:64, 263:144 and 264:97. `hvr_scan.py` reports `hard blockers: 4` and exit 1 for this asset, and the HVR standard bans them by rule: "No em dashes, semicolons or Oxford commas" (`.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-publish-supplement.md:90`). The fenced prompt blocks at lines 107 and 117 carry semicolons too, but the scanner masks fenced blocks, so only the table prose decides the verdict.
   Finding class: standards conformance / prose quality
   Scope proof: finding is inside `doctor-git-presentation.txt`, a manifest entry; all four occurrences are in its last table (lines 260-268).
   Affected surface hints: the presentation contract's next-step suggestions; any HVR voice pass over the v4.0.0.11 command surface starts from these blockers; `sk-create-command` presentation asset authoring.
   Case: a reader or evaluator runs `hvr_scan.py` over the release's presentation assets; this file fails with four hard blockers, unlike `git.md` which passes clean, so the asset cannot be signed off under the steer's Human Voice Rules.

2. **`git.md` description exceeds the 110-character soft target** -- `.skilled/commands/doctor/git.md:2` -- the frontmatter description is 133 characters ("Switch shipped git hook gates on or off, change the commit, PR and branch rules in .sk-git/ and check which sk-git settings are live."), against the `sk-create-command` rule "Target descriptions at or under 110 characters" (`sk-create-command/SKILL.md:212`). The shared validator agrees and prints `command_description_over_soft_target` (133 > 110), pointing at the per-document budget style.
   Finding class: standards conformance / documentation budget
   Scope proof: the description line is in `git.md`, a manifest entry; the validator run is cited above.
   Affected surface hints: command metadata budget (`validate_document.py --type command`), the command's frontmatter description, the doctor command-family description budget.
   Case: the release's own validator flags this file with a warning, so the command cannot be called validator-clean; the wording needs a shorter description rather than a cross-reference to the fuller router body.

3. **Scripts README's test-location claim is inaccurate for one script** -- `.skilled/commands/doctor/scripts/README.md:21` -- "Every script has a test under `tests/`, and one runner executes them all." The runner does execute a suite for `skill-graph-freshness.cjs`, but that suite is not under `tests/`: it lives at `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` (documented at `tests/README.md:52` and invoked by `tests/run-all.sh:100`). A reader using this README's sentence to audit coverage by listing `tests/` will conclude one script is untested.
   Finding class: documentation accuracy / traceability
   Scope proof: the sentence is at line 21 of `scripts/README.md`, a manifest entry; the counterexamples are the cited files.
   Affected surface hints: `scripts/README.md` §1 coverage claim; `tests/README.md` §2 suite table; `tests/run-all.sh` freshness panel step.
   Case: an operator enumerates `tests/` to confirm the coverage claim, finds no freshness suite, and either files a false bug or distrusts the coverage statement; the accurate statement needs the one-clause exception.

## Traceability Checks

- `spec_code` (core): partial — the packet's `spec.md` remains scaffold context per the charter;
  the command surface was instead checked against its authoring contract and its own manifest,
  and the two disagree only where recorded above.
- `checklist_evidence` (core): partial — no `checklist.md` rows exist; the release's validation
  evidence for this surface is the validator set run above, which passes except as recorded.
- `skill_agent` (overlay): partial — `git.md` carries `<!-- skill_agent: sk-git -->` and the
  route manifest names `/doctor:git`; the SKILL.md side of the contract is iteration 3's subject.
- `agent_cross_runtime` (overlay): notApplicable this iteration — no agent files in the command scope.
- `feature_catalog_code` (overlay): pending — catalog and playbook entries are iterations 3-4's subject.
- `playbook_capability` (overlay): pending — same.

## Integration Evidence

- `_routes.yaml` `/doctor:git` entries (lines 237-290) vs `git.md` §4 table: targets, YAMLs,
  flags and the `--target=` alias agree; `route-validate` J1 confirms parity across router,
  presentation and manifest, and L1 confirms each declared script invocation is performed by its
  workflow asset.
- `/doctor:git setup` route ↔ `doctor-git-setup.yaml` ↔ `doctor-git-presentation.txt` ↔ battery:
  the YAML's eleven checks and their order match `git-setup-check.cjs` `CHECKS`; the exit-code
  mapping (0/1/2/3) matches the battery header and the presentation's result block; the
  `--tool=<name>` surface matches the battery's six-tool list.
- `doctor-git-presentation.txt:108-110` names four whole-hook kill switches
  (`SYSTEM_GIT_COMMIT_HOOKS_DISABLED`, `SYSTEM_GIT_HOOKS_CHECK_DISABLED`, `SK_GIT_PREFLIGHT_DISABLED`,
  `SYSTEM_GIT_WORKTREE_GUARD_DISABLED`): all four resolve in `.skilled/hooks/` (hook-flags.env,
  hook-flags.env.example, shared/hook-flags.cjs, and the two hooks' READMEs).
- `scripts/README.md` §6 read-only boundary for `git-setup-check.cjs` matches iteration 1's
  no-write finding.

## Edge Cases

- `route-validate` emits two informational warnings (shared `--dry-run` flag across sibling
  targets); they are allowed by contract and not findings.
- The presentation's fenced `text` blocks legitimately contain semicolons; the HVR scanner masks
  them, so the finding is scoped to the unfenced table prose only.
- The HVR scan is operator-invoked, not a CI gate (no workflow references `hvr_scan.py`); the
  finding rests on the steer's instruction to judge all prose by the Human Voice Rules.

## Confirmed-Clean Surfaces

- Router shape: `git.md` carries the mandatory input gate immediately after frontmatter, the
  canonical numbered sections 1-6, the blocking core (`OWNED ASSETS` + `PRESENTATION BOUNDARY`),
  no inline startup/dashboard/result templates, and a 59-character `argument-hint`.
- Presentation ownership: startup menu, help block, route-manifest display, change plans, result
  templates and next-step suggestions all live in the presentation asset; the router only
  references it.
- Mutation classes: hooks/standards `mutates` with concrete `gate3_location` values, setup
  `read-only` with `n/a` — consistent across manifest, router table and presentation.
- `generate-command-routers.cjs` reports zero path and shape drift across all 34 routers.

## Ruled Out

- "The presentation names kill switches that do not exist": ruled out — all four resolve in the
  hook flag sources (cited above).
- "The setup YAML's check list or exit-code mapping drifts from the battery": ruled out — both
  match the code read in iteration 1.
- "Router/presentation/manifest target sets diverge": ruled out — `route-validate` J1 passes and
  its self-test proves the check fails when they do.

## Next Focus

- Dimension: maintainability + traceability (skill docs)
- Focus area: `.skilled/skills/sk-git/SKILL.md`, `README.md`, `assets/commit-message-template.md`,
  the two manual-testing-playbook files, the two feature-catalog files, and
  `scripts/hooks/README.md`; judge against `sk-create-skill`, `sk-create-readme`,
  `sk-create-manual-testing-playbook` and `sk-create-feature-catalog` contracts and run the
  playbook/catalog validators
- Reason: charter order (code -> command -> skill docs); iteration 2 leaves the sk-git skill's own
  contract unjudged
- Required evidence: `validate_document.py` on each doc; playbook and catalog validators under
  `.skilled/skills/sk-doc/`; `hvr_scan.py` over the doc prose; catalog/playbook expected coverage
  of `/doctor:git setup`
- Rotation status: command surface complete; code and command return only for cross-checks.

## Verdict

Review verdict: PASS
