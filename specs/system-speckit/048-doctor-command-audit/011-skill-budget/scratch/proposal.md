# Proposal — `/doctor:speckit skill-budget`

## Verdict

**fix** — the target's paths, flags, CLI tool, exit-code contract and constants all exist and behave as the workflow assumes (see `reality-check.md` and `doctor-run.log`), but two concrete mismatches with the checkout need correction:

1. The route entry does not record the primary audit-script invocation, so the manifest is incomplete and `route-validate`'s script-existence check never covers it.
2. The workflow tells the executor to run the audit script via Bash without naming an interpreter, while the script is checked in mode 644 and fails with `EXIT=126 Permission denied` when run directly.

Neither breaks the happy path when an agent infers `python3` (the scripts README documents exactly that form), but both are real gaps between the doctor's text and the system it runs on.

## Evidence for the verdict

| Claim | Evidence |
|---|---|
| Every named path exists | `ls -l` on the route YAML, audit script, reference doc, CLI shim, quick_validate symlink (`reality-check.md` §1–§2) |
| All four flags work | `--json`, `--top-n=5`, `--project-ceiling=5600` exit 0; `--fail-over=5600` exits 1 with the documented FAIL line (`doctor-run.log` STEPs 2–5) |
| CLI health check works and its retryable contract holds | live run exit 0 (`doctor-run.log` STEP 0); `--warm-only`/exit 75 semantics in `skill-advisor.cjs:30,46–47,76–78` and `skill-advisor-cli.js:308,897–913` |
| Constants match the source of truth | import probe → `130 110 1536` (`doctor-run.log` STEP 7); contract JSON `descriptionBudget` → 130/110/1536/5600 |
| Route manifest validates | `bash …/route-validate.sh` → `OK … 10 routes validated` exit 0 (`doctor-run.log` STEP 8) |
| The script is read-only | no write calls in `audit_descriptions.py` (grep for write/mkdir/unlink/rename/shutil → no matches); mutation table `scripts/README.md:121` says "Read-only audit" |
| The workflow's literal "execute via Bash" fails | direct run → `Permission denied`, `EXIT=126` (`doctor-run.log` STEP 6) |

## Fix 1 — record the audit-script invocation in the route entry

- File: `.skilled/commands/doctor/_routes.yaml`
- Section: `routes` → `target: skill-budget` → `script_invocations` (lines 110–111)
- Old text:

```yaml
    script_invocations:
      - 'Warm-only: probe the existing system-skill-advisor IPC socket first; only when it answers, run node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --timeout-ms 500 --warm-only (the flag guarantees no daemon start; exit 75 = backend unavailable, retryable)'
```

- New text:

```yaml
    script_invocations:
      - 'python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root "$PWD"  # description-budget audit; read-only; the workflow command_mapping appends --json / --top-n / --fail-over / --project-ceiling'
      - 'Warm-only: probe the existing system-skill-advisor IPC socket first; only when it answers, run node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --timeout-ms 500 --warm-only (the flag guarantees no daemon start; exit 75 = backend unavailable, retryable)'
```

Why: the manifest is the canonical record of what a target runs, and every other script-based route lists its scripts. Adding the line also brings the audit script under `route-validate.py`'s I1 existence check (`route-validate.py:411–423`). Expected result: I1 still passes (the path exists); no other route changes.

## Fix 2 — name the interpreter in the workflow's audit activity

- File: `.skilled/commands/doctor/assets/doctor-skill-budget.yaml`
- Section: `workflow` → `phase_0_audit` → `activities`, line 90
- Old text:

```yaml
      - "Construct the command line and execute upstream_assets.audit_script via Bash."
```

- New text:

```yaml
      - "Construct the command line as python3 upstream_assets.audit_script --repo-root \"$PWD\" plus the flags from field_handling.command_mapping, then execute it via Bash."
```

Why: the script carries a `#!/usr/bin/env python3` shebang but is checked in without the executable bit, so the literal path execution fails (`EXIT=126`). The scripts README already documents the canonical form `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root .` (`scripts/README.md:105`); this edit makes the workflow say the same thing.

Alternative if a one-line YAML edit is not wanted: add `audit_command: 'python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root "$PWD"'` under `upstream_assets` and point the activity at it, or `chmod +x` the script so the shebang takes effect. The interpreter-naming edit is the smallest change that survives a fresh checkout (file modes can be lost by copy tooling; the workflow text cannot).

## Observations, recorded not fixed (doctor ecosystem, outside this target's fix set)

- **Shared startup menu is incomplete.** `doctor-speckit-presentation.txt:70` says `Press 1-11, 0, or X.` and the displayed menu (lines 10–23) omits 12 and 13, while the accepted-answers table accepts `` `12` → runtime-mirrors `` (line 39) and `` `13` → router-reach `` (line 40). Suggested edit if a shared-surface pass is taken: add the two menu rows using the manifest's one-line purposes and change the footer to `Press 1-13, 0, H, or X.` `route-validate`'s J1 parity check does not inspect the menu body, so it does not catch this.
- **Sibling-command one-liner is wrong.** `doctor-update-presentation.txt:176` describes `/doctor skill-budget` as "Advisor budget/status helper". The target audits description budgets; the advisor status probe is only a health check inside it. Suggested replacement: `Audit skill, command, and agent description budgets` (the manifest's own wording, `doctor-speckit-presentation.txt:99`).
- **Ephemeral artifact labels in doctor/subsystem text.** `audit_descriptions.py:290` prints the human report title with a packet label, and `quick_validate.py:16` carries one in its docstring. Neither affects behavior; both age badly. If touched, the report title should be plain: `Skill/Command/Agent Description Budget Audit`.
- **Runtime budget constant is hardcoded.** `audit_descriptions.py:69` fixes the Claude Code budget at 8,000 while the actual `SLASH_COMMAND_TOOL_CHAR_BUDGET` is unset in this checkout, so the printed default is correct today. If a runtime ever exports a non-default value, the report's "Default Claude Code budget" line will not reflect it.
- **Target-count drift in docs.** `.skilled/commands/README.txt:158` says "9 subsystems" and omits `router-reach`; feature-catalog docs repeat "nine"; the manifest holds 10 routes (`route-validate` B1). `README.txt` is already modified in this worktree by another audit, so this is left to that pass.

## FINDINGS — defects in the subsystem the doctor inspects (recorded, not fixed)

**F1. The project description budget is over its soft ceiling.**
Total 6,774 chars against the 5,600 ceiling; headroom −1,174 chars. Seven items are OVER-SOFT:

| Surface | Item | Chars | Soft target |
|---|---|---|---|
| skill | sk-code | 405 | 130 |
| agent | design | 267 | 130 |
| skill | cli-classifier | 155 | 130 |
| skill | cli-external-orchestration | 149 | 130 |
| skill | system-spec-kit | 147 | 130 |
| skill | sk-doc | 144 | 130 |
| skill | sk-design | 135 | 130 |

No item exceeds the 1,536-char hard cap, so the audit exits 0 without `--fail-over`; CI or pre-commit must pass `--fail-over=5600` to make this state non-zero. Evidence: `doctor-run.log` STEPs 1, 2 and 4.

**F2. Two counted command descriptions are not on the runtime surface the audit names.**
`.skilled/commands/goal-opencode.md` (32 chars) and `.skilled/commands/vision.md` (103 chars) have no counterpart under `.claude/commands` (33 `.md` files there vs 35 under `.skilled/commands`, excluding `assets`/`scripts`). The audit's stated purpose is the surfaces that feed Claude Code's available-skills list, so 135 chars of the 6,774 total are authored-surface, not Claude-visible. Either the two files should be mirrored or the audit's purpose sentence should say it counts the authored surface. Evidence: `comm -23` of the two `find` listings; `doctor-run.log` STEPs 1–2.

**F3. The doctor's own reference doc recommends an invocation the doctor rejects.**
`frontmatter-templates.md:302` and `sk-create-skill/references/shared/common-pitfalls.md:67` both say to run `/doctor skill-budget :auto`. The doctor family contract declares `mode_matrix.supported_modes: []`, the route lists no `:auto` flag (`_routes.yaml:106`), and the router rejects unknown flags (`speckit.md:34,65`), so the recommendation fails with a flag error. The fix belongs to those two sk-doc documents, not to the doctor. Evidence: `command-contract.json` `families.doctor.mode_matrix`; `reality-check.md` §6.

## Verification plan for the two fixes

1. Apply Fix 1 and run `bash .skilled/commands/doctor/scripts/route-validate.sh`; expect the same `OK` with `PASS: I1` (now covering the audit script path).
2. Apply Fix 2 and re-read the YAML with a parser (`python3 -c "import yaml; yaml.safe_load(open(...))"`); expect the same top-level keys and a valid scalar on line 90.
3. Re-run `python3 .skilled/commands/doctor/scripts/audit_descriptions.py` from the repo root; expect exit 0 and unchanged counts.
