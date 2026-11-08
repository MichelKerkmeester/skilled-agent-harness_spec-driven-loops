# Iteration 005 — upgrade/update surface, create.sh + templates, check-goal exit reproduction

## FOCUS

Carried from iteration 4 (whose Devin dispatch failed on quota): key questions 6 and 7, plus a fixture reproduction of the `check-goal --all` exit-code claim recorded in iteration 3. Gate 3 pre-resolved; run directory is the only write authority; every command read-only, `check`, or `/tmp` fixture work.

## ACTIONS TAKEN

1. Read `/doctor:update` end to end (104 lines) and its owned-asset table, then ran the release engine's own help and a read-only `check`.
2. Enumerated test references per engine subcommand to find the step with no test.
3. Scaffolded two fresh packets with `create.sh` into `/tmp/iter5-probe` (Level 2 with `--track other`, Level 1 plain) and ran `validate.sh --strict` on each.
4. Built a `/tmp/goalcorpus` fixture (two packets, goal.md copied from a real packet plus an over-budget appendix) and ran `check-goal.cjs --all` and a single-packet run on the same content.

Commands actually run this iteration:

```
node .skilled/commands/doctor/scripts/release-update.cjs check --repo . --offline --json   # EXIT 0
node .skilled/commands/doctor/scripts/release-update.cjs --help                            # EXIT 0
bash .../runtime/cli/spec/create.sh --short-name probe-packet --level 2 --track other "probe packet"   # in /tmp: EXIT 1
bash .../runtime/cli/spec/create.sh --short-name probe-packet --level 2 --track other "probe packet"   # with vendored templates: EXIT 0
bash .../runtime/cli/spec/validate.sh specs/other/001-probe-packet --strict                # RESULT: PASSED, EXIT 0
bash .../runtime/cli/spec/create.sh --short-name no-track --level 1 "no track packet"      # EXIT 0
bash .../runtime/cli/spec/validate.sh specs/001-no-track --strict                          # RESULT: PASSED, EXIT 0
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all --root /tmp/goalcorpus   # EXIT 0, parent-budget_findings=2
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs /tmp/goalcorpus/specs/other/001-alpha  # EXIT 0, 5/5 PASS
```

## FINDINGS

### F1 — `check-goal --all` exits 0 while reporting findings (reproduced; deepens the iteration-3 claim)

- type: bug
- severity: P1
- release introduced: v4.0.0.2 (goal system)
- confidence: 0.95
- evidence: the corpus branch returns on errors only — `return report.errors.length === 0 ? 0 : 2;` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:703]. The single-packet branch below it returns 1 for "findings, no errors": `if (result.errors.length > 0) return 2; return result.passed ? 0 : 1;` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:714].
- repro (ran): fixture corpus at `/tmp/goalcorpus` with two packets; output `parent-budget_findings=2` and two `FINDING parent-budget` lines, `ALL_EXIT=0`.
- why it matters: any CI or hook that gates on the `--all` exit status is green while the printed report lists findings. The two entry points answer "are there findings?" with different exit vocabularies.
- verify: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all --root /tmp/goalcorpus; echo "exit=$?"`

### F2 — the same packet yields a finding in corpus mode and a silent PASS in single-packet mode (new)

- type: bug
- severity: P1
- release introduced: v4.0.0.2
- confidence: 0.9
- evidence: corpus mode reports `FINDING parent-budget specs/other/001-alpha: configured durable-slice budget could not be resolved` from the finding text at [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:351]; the per-packet path routes the same check through `runOneCheck('parent-budget', ...)` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:641] and prints `4/5 PASS parent-budget findings=0` for the identical directory content.
- repro (ran): the two runs at the end of ACTIONS TAKEN, same fixture, `ALL_EXIT=0` versus `ONE_EXIT=0` with `RESULT: PASSED (5/5 checks)`.
- why it matters: an unresolvable budget is the one condition an operator most needs told, and the per-packet form — the one a human runs — reports it as a pass. F1 and F2 together mean the corpus mode is the only mode that can see the condition, and it is the mode that cannot fail a gate.
- verify: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs /tmp/goalcorpus/specs/other/001-alpha | grep parent-budget`

### F3 — `create.sh` resolves its templates from the target repo, not from its own location (new)

- type: bug (UX for the operator)
- severity: P1 for a first-time external user, P2 inside this repo
- release introduced: not isolated (present at v4.0.2.0)
- confidence: 0.95
- evidence: `TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/.skilled/skills/system-spec-kit/templates}"` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2253], with the same expression repeated at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1477] and [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1665], and the failure text `Error: Templates directory not found at $TEMPLATES_BASE` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2260].
- repro (ran): from an empty git repo at `/tmp/iter5-probe`, `create.sh --short-name probe-packet --level 2 --track other "probe packet"` printed `Error: Templates directory not found at /private/tmp/iter5-probe/.skilled/skills/system-spec-kit/templates`, exit 1. Copying only `templates/` into that path made the identical command succeed, exit 0.
- why it matters: the script's own shared libraries resolve from `SCRIPT_DIR` (it sources `../lib/shell-common.sh`, `../lib/git-branch.sh`, `../lib/template-utils.sh` relative to itself), so one half of the script is location-relative and the other half is cwd-relative. A user who runs the shipped script against another checkout gets a template-not-found error naming a path they never mentioned. `SPECKIT_TEMPLATES_BASE` is the undocumented escape hatch — it appears in no help text.
- verify: `cd /tmp && mkdir -p probe0 && cd probe0 && git init -q && bash <repo>/.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --short-name x --level 1 "x"; echo "exit=$?"`

### F4 — a fresh Level 1 and a fresh Level 2 packet both PASS `--strict` but always carry two warnings, one of which marks the packet unfiled while its sibling rule blesses the same marker (new)

- type: misalignment (validate rule pair disagree) + UX
- severity: P2
- release introduced: not isolated (present at v4.0.2.0)
- confidence: 0.75
- evidence: both probes end `Summary: Errors: 0  Warnings: 2` / `RESULT: PASSED`. The warnings are `! MEASURED_BEHAVIOR: Measured behavior block holds no command output and no N/A: line with a reason — spec.md: the measured-behavior block is empty` and `+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity normalization drift detected (soft detector) — identity=scaffold/001-no-track / identity=001-no-track`. In the same run `+ METADATA_DISK_PATH_CONSISTENCY` passes with the note "metadata paths carry the scaffold marker; the packet is not filed yet", and `graph-metadata.json` carries `"packet_id": "other/001-probe-packet"` while the warning compares against `scaffold/other/001-probe-packet` (the pointer written at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:944]).
- what the answer to Q7 actually is: yes, `create.sh` plus the shipped Level 1 and Level 2 templates produce a packet that passes `validate.sh --strict` with zero errors and no hand edits. The 37 `[YOUR_VALUE_HERE:]` tokens in Level 1 are reported by `! PLACEHOLDER_FILLED` as a warning only while the packet is Draft, which is the intended contract and clears as the operator fills them.
- why it matters: the two warnings are unfixable at scaffold time — `CANONICAL_SAVE_*` needs a canonical save, `MEASURED_BEHAVIOR` needs a measured run — so every new packet opens on a yellow report. A warning that every packet carries regardless of quality trains the operator to read warnings as noise, which is the same failure mode as a check that cannot fail (F1).
- residual: I did not read the rule source for `MEASURED_BEHAVIOR`. No template under `templates/level-1/` or `templates/level-2/` contains the phrase "measured", so the block the rule wants is not scaffolded by `create.sh`; confirming which file the rule reads is the next step.
- verify: `cd /tmp/iter5-probe && bash <repo>/.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/001-no-track --strict | grep -E "MEASURED_BEHAVIOR|CANONICAL_SAVE_PACKET_IDENTITY|METADATA_DISK_PATH"`

### F5 — the `/doctor:update` router and the release engine publish two different action sets (new)

- type: drift
- severity: P2
- release introduced: v4.0.0.3 (the release-aware update workflow)
- confidence: 0.9
- evidence: the router resolves `check`, `align`, `apply`, `rollback`, `record-base` or `compat` [SOURCE: .skilled/commands/doctor/update.md:38] and lists `compat` as an action accepting `--dry-run` and `--offline` [SOURCE: .skilled/commands/doctor/update.md:44]. The engine's USAGE line is `<check|align|decide|apply|rollback|record-base|unlock>` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:54] — it has no `compat`, and it has `decide` and `unlock`, which the router never mentions.
- how the router covers the gap: `compat` is a YAML-only workflow whose phases call `upgrade-legacy.mjs` and use the engine only for `check`; `decide` and `unlock` are invoked from inside the align and apply YAMLs, which is why the router's human-facing action list does not need them. So the action sets differ by design, and the doc is right about what an operator may type.
- why it matters anyway: the flag matrix in the router (§3, lines 39-44) is a hand-maintained second copy of `FLAG_SETS` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:62] with no cross-check. `align` is documented as accepting `--dry-run` and the engine's align set does contain `dry_run`; nothing in the contract test compares the two lists — the test reads the router only to confirm each action owns a workflow YAML [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:49]. A new engine flag would ship undocumented and no test would notice.
- verify: `node .skilled/commands/doctor/scripts/release-update.cjs --help | head -1` versus `grep -n "accepts" .skilled/commands/doctor/update.md`

### F6 — `check` reports aggregate status `unknown` whenever `--offline` is used, even though the local position is fully known (new, UX)

- type: ux
- severity: P2
- release introduced: v4.0.0.3
- confidence: 0.85
- evidence (ran): `check --repo . --offline --json` exits 0 and prints `"upstream": {"status": "unknown", "error": "offline mode"}`, `"checkout": {"position": "ahead", "aheadBy": 1, "behindBy": 0, "dirty": true}`, and a top-level `"status": "unknown"` alongside 30-plus fully classified units.
- why it matters: `--offline` is the only mode a hook or an air-gapped operator can use, and it collapses a known, actionable answer ("ahead by 1, dirty") into the same token as "cannot tell". The dashboard has to choose between showing the position the engine already computed and obeying `status`. A separate `upstreamStatus` field, or falling back to the checkout position when upstream is unknown, would keep both.
- verify: `node .skilled/commands/doctor/scripts/release-update.cjs check --repo . --offline --json | grep -E '"status"|"position"'`

### F7 — which step has no test (answer to the second half of Q6)

Engine subcommand → test-file references: `check`, `align`, `decide`, `apply`, `rollback`, `record-base`, `unlock` are each named in `.skilled/commands/doctor/scripts/tests/release-update.test.cjs`; `compat` has `doctor-update-compat.test.cjs` plus `doctor-update-compat-integration.test.cjs`. No action is unreferenced. The step that carries no test is the **router-to-engine parity** step: nothing asserts that the documented action/flag matrix matches `FLAG_SETS`, which is exactly the seam F5 shows drifting. I did not run the suite (read-only remit), so this is reference coverage, not behavioural coverage — a referenced action may still lack a negative-path assertion.

## QUESTIONS ANSWERED

None fully. Progress below is carried as a residual.

- PARTIAL for Q7: "Do create.sh and the level templates produce a packet that passes validate.sh --strict without hand edits…" — yes, on both Level 1 and Level 2, `RESULT: PASSED`, 0 errors, 2 warnings (F4). The second half — whether the fill notes agree with sk-doc and the template canon — was NOT assessed: no sk-doc template-format rule was read this iteration.

## QUESTIONS REMAINING

- Q6 residual: only `check` was executed. `align --dry-run`, `apply --dry-run`, `rollback --dry-run` and `compat --dry-run` were read (update.md §§3-7, the compat YAML's phase list and command table [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:36]) but not run, so the dry-run preview path is unverified end to end.
- Q7 residual: the template fill-note question against sk-doc canon, and the `MEASURED_BEHAVIOR` rule's source file.
- F2 needs one more probe: whether the divergence is the unresolved-budget case only, or every check whose `options` differ between corpus and packet paths.
- Q3 residual unchanged (freshness signal; `--check` contract in retrieval-conventions.md). Q4 residual unchanged (stale-index gate absent from the resume YAML).
- Q8-Q12 untouched: v4.0.0.13-v4.0.2.0 doc drift, dead scripts, operator friction across the speckit commands, sk-code/sk-doc conformance, concrete extensions.

## NEXT FOCUS

Iteration 6: run the four `--dry-run` preview paths (`align`, `apply`, `rollback`, `compat`) against a /tmp clone to close Q6; then Q8 (v4.0.0.13-v4.0.2.0 doc drift in system-spec-kit SKILL.md and references), using the path-limited diffs for the two doc releases.

## SCOPE VIOLATIONS

None. All fixture work ran under `/tmp` (`/tmp/iter5-probe`, `/tmp/goalcorpus`); no repository file was created, edited, staged, renamed or deleted.
