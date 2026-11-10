# Iteration 002 — Authoring Validators and the sk-code Quality/Review Flow

## Focus

Key questions 3 and 4:

- Q3: Do the sk-doc authoring validators from v4.0.0.9 pass when run on sk-code, sk-design and sk-prompt themselves, and which check fails?
- Q4: Does the sk-code quality-config and review flow from v4.0.0.6 and v4.0.0.16 (Code Quality in Any Repository) work from its documented commands, and what part is untested?

## Actions Taken

1. Read the v4.0.0.9 note to enumerate the authoring validators it shipped: `validate_skill_package.py --strict`, `frontmatter-version.mjs verify`, the parent-skill doctor, the feature-catalog validator, the playbook validator and the citation scan.
2. Ran the package validator and parent-skill doctor against sk-code, sk-design and sk-prompt.
3. Ran `frontmatter-version.mjs verify --skill` for all three hubs.
4. Ran the playbook validator against each hub's `manual-testing-playbook` package, and the feature-catalog validator against each hub package id.
5. Read the v4.0.0.6 and v4.0.0.16 notes, then ran `quality-gate.cjs --help` and a real `--no-run` gate over one file, listed the review-mode scripts and the doctor command contract.

## Findings

### F1 — sk-prompt's playbook File table points one directory too high (bug, P2)

`clear-scoring/forty-of-fifty-threshold.md:82` lists `../../manual-testing-playbook.md` as the root playbook. From `clear-scoring/` that resolves to `sk-prompt/manual-testing-playbook.md`, which does not exist; the root page is `sk-prompt/manual-testing-playbook/manual-testing-playbook.md`, so the path is one level short. The v4.0.0.9 playbook validator reports it as `BACKTICK_PATH_UNRESOLVED` and still exits 0, by design ("warns about a backticked path that no longer resolves, without failing the run"), so this defect can live indefinitely.

- Type: bug
- Severity: P2
- Release: v4.0.0.9 (the File-table path check was added there; the bad path itself predates it)
- Confidence: high
- Evidence:
  - [SOURCE: .skilled/skills/sk-prompt/manual-testing-playbook/clear-scoring/forty-of-fifty-threshold.md:82] `| \`../../manual-testing-playbook.md\` | Root directory page and scenario summary |`
  - [SOURCE: .skilled/changelog/skilled/v4.0.0.9.md:105] "The playbook validator warns about a backticked path that no longer resolves, without failing the run"
- Verify:
  ```bash
  node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs \
    --package .skilled/skills/sk-prompt/manual-testing-playbook
  ```
  Expected: `PASS package=sk-prompt ... warnings=4`, one of them `BACKTICK_PATH_UNRESOLVED clear-scoring/forty-of-fifty-threshold.md:82`.

### F2 — v4.0.0.16 note documents a `--apply` flag the doctor command does not accept (drift, P2)

The note says `/doctor:sk-code quality` "plans the file from the repository's own scripts, writes it on `--apply`, refuses to overwrite one that exists and checks it". The command contract's argument hint is `[setup|quality] [--prompt=<text>] [--dry-run] | list | ?`, section 4 lists `--dry-run` as the only `quality` flag, and section 3 says a flag outside `allowed_flags` fails before YAML load. An operator who follows the note types `--apply` and gets the unknown-flag failure instead of a plan.

- Type: drift
- Severity: P2
- Release: v4.0.0.16
- Confidence: high that the flag is absent from the contract; medium that no alias path accepts it (the route manifest was not read)
- Evidence:
  - [SOURCE: .skilled/changelog/skilled/v4.0.0.16.md:122] "`/doctor:sk-code quality` plans the file from the repository's own scripts, writes it on `--apply`, refuses to overwrite one that exists and checks it."
  - [SOURCE: .skilled/commands/doctor/sk-code.md:3] `argument-hint: "[setup|quality] [--prompt=<text>] [--dry-run] | list | ?"`
  - [SOURCE: .skilled/commands/doctor/sk-code.md:35] "`--dry-run` belongs to `quality`, and it shows the init plan and stops before the write."
- Verify:
  ```bash
  grep -n -- '--apply' .skilled/commands/doctor/sk-code.md || echo NO_APPLY_FLAG
  ```
  Expected: `NO_APPLY_FLAG`.

### F3 — sk-design's manual-testing playbook has no operator scenarios, so the contract validates nothing there (improvement, P2)

The playbook validator returns `SKIP package=sk-design tier=FAIL_CLOSED scenarios=4 categories=3 operator=0 routing_gold_excluded=4` plus an advisory `RESULT_PERSISTENCE_MARKER_MISSING` warning. The package declares itself fail-closed, but a package with zero operator scenarios skips rather than fails, so sk-design's playbook can drift without a gate. The v4.0.0.9 note promises the check "reads each package's top-level `manual-testing-playbook.md` as well"; it reads it and then skips it.

- Type: improvement
- Severity: P2
- Release: v4.0.0.9
- Confidence: high for the observed skip; medium that a zero-operator package is unintended rather than an accepted tier
- Evidence:
  - [SOURCE: .skilled/changelog/skilled/v4.0.0.9.md:105] "The check now reads each package's top-level `manual-testing-playbook.md` as well."
- Verify:
  ```bash
  node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs \
    --package .skilled/skills/sk-design/manual-testing-playbook
  ```
  Expected: `SKIP package=sk-design ... operator=0 routing_gold_excluded=4`.

## Observations (command evidence, no narrative finding)

- **O1 — the quality gate runs from its documented path and reads the committed config.** `quality-gate.cjs --no-run --format text -- <one file>` printed `config: repo .skilled/skills/sk-code/sk-code-quality/repository/quality.json`, listed the built-in checks, applied the `review.todo-tracking` override from `sk-code-skilled`, and exited 4 (`UNVERIFIED`) because `--no-run` leaves required checks `LISTED`. A caller scripting the plan step must treat exit 4 as success.
- **O2 — the catalog validator cannot target two of the three hubs.** `--package sk-design --package sk-prompt` exits 2 with `package not found in feature-catalog discovery: sk-design, sk-prompt`; only `sk-code` has a catalog package and passes (`violations=0`). The v4.0.0.9 pull-request catalog check is therefore a no-op for two of the four hubs, not a pass.
- **O3 — version and package checks are clean.** `frontmatter-version.mjs verify`: sk-code `ok=265`, sk-design `ok=183 skip-no-frontmatter=2586`, sk-prompt `ok=38`. `validate_skill_package.py --strict`: PASS on all three. Parent-skill doctor: PASS with 0 warnings on sk-code and sk-design.
- **O4 — the review-mode scripts named by v4.0.0.6 exist.** `sk-code-review/scripts/` contains `check-review-final-line.js`, `check-review-findings.js` and `check-rule-copies.js`, matching the note's claim that a saved review is checked against the status-line and finding rules.

## Questions Answered

- Q3: **Yes — every hard validator passes on all three hubs; the only defect reported is a warning-level stale path in sk-prompt (F1).** Package validator, parent-skill doctor and frontmatter verify all exit 0 on sk-code, sk-design and sk-prompt. The playbook validator passes sk-code, skips sk-design (F3) and warns four times on sk-prompt, including F1. The catalog validator passes sk-code and refuses the other two as "not in feature-catalog discovery" (O2), so it neither passes nor fails them.
- Q4: **Yes for the documented read path; the documented write flag is wrong (F2), and the write/refusal half is untested here.** `quality-gate.cjs` runs from the exact path in the v4.0.0.16 note, discovers `repository/quality.json`, applies rule overrides and returns one verdict; the review checkers exist. `/doctor:sk-code quality` is real and its read half is specified in detail, but its `--apply` flag does not exist in the command contract, and its config-creation and refuse-over-existing paths are mutation-gated, so they could not be exercised under this run's read-only rules.

## Questions Remaining

- Q5: Do the `/create:*` commands match the sk-doc mode contracts (flags, defaults, outputs)?
- Q6: Do the `/design:*` commands and sk-design modes match the stated 29 chart forms and 27 diagram types?
- Q7: Does sk-prompt match its v4.0.0.0 note, and do the cli-* skills consume `cli-prompt-quality-card.md` consistently?
- Q8: Did the v4.0.0.16 changelog move leave stale changelog paths in these hubs?
- Q9: Do the v4.0.1.0 manual-testing playbooks point at existing files and commands?
- Q10: Which templates, references, assets or modes have no inbound route or duplicate another?
- Q11: What friction do the operator and AI user hit?
- Q12: What concrete extensions would let the hubs share validators, routing tests or templates?

## Next Focus

Iteration 3 should take Q5 and Q6: compare each `/create:*` command contract with the sk-doc mode contract it routes to (flags, defaults, outputs), then count the sk-design chart forms and diagram types against the 29 and 27 claims and their catalog files. Q8 is a cheap adjacent check: search the four hubs for changelog paths outside `.skilled/changelog/` and each skill's own `changelog/`.

## SCOPE VIOLATIONS

None. All research commands were read-only (`--help`, `--no-run`, `--package` validators in check mode); writes were limited to this iteration's narrative, its delta file, the append-gateway event file and the gateway's own state-log refresh.
