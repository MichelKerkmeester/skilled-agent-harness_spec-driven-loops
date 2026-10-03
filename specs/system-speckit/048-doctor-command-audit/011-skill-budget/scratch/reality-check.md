# Reality Check — `/doctor:speckit skill-budget`

Checked against worktree `079-doctor-command-audit`, HEAD `83616db9ba221a80d271b2b924b3a32664962ffd`.
The working tree is dirty from sibling audit tasks; nothing under the doctor assets for this target is modified (`git status --short -- .skilled/commands/doctor/_routes.yaml .skilled/commands/doctor/assets/doctor-skill-budget.yaml .skilled/commands/doctor/assets/doctor-speckit-presentation.txt .skilled/commands/doctor/scripts/audit_descriptions.py` returned empty).

Surfaces that define this target:

| Surface | File | Target rows |
|---|---|---|
| Router | `.skilled/commands/doctor/speckit.md` | `speckit.md:52` maps `skill-budget` to the workflow |
| Route entry | `.skilled/commands/doctor/_routes.yaml` | lines 103–116 |
| Workflow | `.skilled/commands/doctor/assets/doctor-skill-budget.yaml` | whole file |
| Presentation | `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | lines 17, 35, 59, 66, 70, 77, 99, 154–165 |
| Command family contract | `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | `families.doctor` |

Everything below was checked on this checkout. `doctor-run.log` in this folder holds the full command/output/exit-code record of the read-only doctor run.

## 1. Route entry components (`_routes.yaml:103–116`)

| Component | Status | Evidence (command → result) |
|---|---|---|
| `target: skill-budget` | present | `grep -n "target: skill-budget" -A 13 .skilled/commands/doctor/_routes.yaml` → line 103 |
| `yaml: doctor-skill-budget.yaml` | present | `ls -l .skilled/commands/doctor/assets/doctor-skill-budget.yaml` → 7,938 bytes |
| setup var `execution_mode` | present | workflow `user_inputs.execution_mode` (`doctor-skill-budget.yaml:46`); router forces `INTERACTIVE` (`speckit.md:32`) |
| setup var `json_output` | present | workflow `:47`, default `false` (`:57`), mapping `--json` (`:67`) |
| setup var `top_n` | present | workflow `:48`, default `10` (`:58`), mapping `--top-n=` (`:68`) |
| setup var `fail_over` | present | workflow `:49`, default `null` (`:59`), mapping `--fail-over=` (`:69`) |
| setup var `project_ceiling` | present | workflow `:50`, default `5600` (`:60`), mapping `--project-ceiling=` (`:70`) |
| flag `--json` | present | `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --help` → `--json` listed; run exit 0 (log STEP 2) |
| flag `--top-n=N` | present | same `--help` → `--top-n TOP_N`; `--top-n=5` run exit 0 (log STEP 3) |
| flag `--fail-over=N` | present | same `--help` → `--fail-over FAIL_OVER`; `--fail-over=5600` run exit 1, `FAIL: project total 6774 > fail_over threshold 5600` (log STEP 4) |
| flag `--project-ceiling=N` | present | same `--help` → `--project-ceiling PROJECT_CEILING`; run exit 0 (log STEP 5) |
| `mutating: read-only` | consistent | workflow `read_only: true` (`:18`, `:76`); audit script contains no write calls — `grep -nE "\.write_text\|\.write_bytes\|open\([^)]*['\"][wa]\|mkdir\|unlink\|shutil\|os\.remove\|Path\.rename" audit_descriptions.py` → no matches (exit 1) |
| `gate3_location: n/a` | consistent | read-only target; no file is written by the workflow or script (same grep as above) |
| `mcp_tools: []` | consistent | `grep -in "mcp" doctor-skill-budget.yaml` → no matches (exit 1); `grep -in "mcp" audit_descriptions.py` → no matches (exit 1) |
| script invocation `node .skilled/bin/skill-advisor.cjs` | present | `ls -l .skilled/bin/skill-advisor.cjs` → 6,567 bytes; `node .skilled/bin/skill-advisor.cjs --help` → lists `advisor_status` and exit `75 retryable daemon error` |
| CLI tool `advisor_status` | present | `--help` command list includes `advisor_status (advisor-status, advisorStatus)`; run exit 0 (log STEP 0) |
| flag `--workspace-root` | present | accepted in `--help` example and in the live run (log STEP 0) |
| flag `--format json` | present | accepted; live run returned a JSON envelope (log STEP 0) |
| flag `--timeout-ms 500` | present | accepted; live run exit 0; contract records `timeout_bounds.warm_probe_timeout_ms = 500` (`command-contract.json`) |
| flag `--warm-only` | present | accepted in `--help`; live run exit 0. Retryable semantics verified in source: `.skilled/bin/skill-advisor.cjs:30` `EXIT_RETRYABLE = 75`, `:46–47` detects `--warm-only`, `:76–78` maps a missing/stale dist to 75 when warm-only; dist `.skilled/skills/system-skill-advisor/runtime/dist/runtime/skill-advisor-cli.js:308` "warm-only just suppresses cold spawn", `:897–913` maps backend/ECONNREFUSED/ENOENT to 75 |
| trigger phrases (4) | present | `_routes.yaml:113–116`; manifest header `:7–14` states the field is inert until a harvester exists |
| **primary audit script invocation** | **absent from the route entry** | The route's `script_invocations` (`:110–111`) holds only the CLI health call. The audit script is named only by the workflow (`:36`). Consequence: route-validate's I1 check (`route-validate.py:411–423`) never guards the script's existence. This is a route-vs-workflow gap, not a missing path — see `proposal.md` Fix 1. |

## 2. Workflow YAML components (`doctor-skill-budget.yaml`)

| Component | Status | Evidence (command → result) |
|---|---|---|
| YAML parses | present | `python3 -c "import yaml; yaml.safe_load(open('.skilled/commands/doctor/assets/doctor-skill-budget.yaml'))"` → parses; top-level keys `action, field_handling, mutation_boundaries, operating_mode, output_format, purpose, role, skill_budget_doctor_invariant, upstream_assets, user_inputs, workflow` |
| `upstream_assets.contract` "local command design contract" | no file by that name | `grep -rn "local command design contract" .skilled/commands/doctor/assets/*.yaml` → 8 doctor workflows carry the same label; it is a convention, not a path. The machine-readable referent is `command-contract.json` (`families.doctor`), which exists (18,455 bytes) |
| `audit_script: .skilled/commands/doctor/scripts/audit_descriptions.py` | present but not executable | `ls -l …/audit_descriptions.py` → `-rw-r--r--` (mode 644; sibling scripts such as `route-validate.sh` are `-rwxr-xr-x`). Direct execution `.skilled/commands/doctor/scripts/audit_descriptions.py` → `/bin/bash: …: Permission denied`, `EXIT=126` (log STEP 6). Run via `python3` it exits 0 (log STEP 1) |
| `cli_health_command: node .skilled/bin/skill-advisor.cjs advisor_status … --warm-only` | present, behaves as assumed | live run exit 0 with `freshness: live`, `trustState`, `generation: 3` (log STEP 0) |
| `cli_health_policy` "exit 75 = backend unavailable, retryable; continue the audit" | consistent with source | see the `--warm-only` row in §1 |
| `reference_doc` `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | present | `ls -l` → 44,365 bytes |
| `doc_reference` anchor `#description-budget--trim-style` | present | `grep -n "^### Description Budget & Trim Style" frontmatter-templates.md` → line 262; heading slug matches the anchor |
| `field_handling.defaults` (`false` / `10` / `null` / `5600`) | consistent | script argparse defaults are `--top-n 10`, `--fail-over None`, `--project-ceiling 5600` (`--help`); contract `descriptionBudget.projectCeiling = 5600` |
| `command_mapping` flags | consistent | all four flags accepted (log STEPs 2–5) |
| `mutation_boundaries.read_only: true`, `forbidden_targets: ["**/*"]` | consistent | no write calls in the script (grep above); workflow issues no mutation command |
| invariant: walks skills, commands, agents | consistent | run output: `Items audited: 61 / skills 14 / commands 35 / agents 12 (unique names)` (log STEP 1) |
| invariant: reports per-item counts, top-N, total, headroom | consistent | human report contains all four sections; `--top-n=5` shortens the table only (log STEP 3) |
| invariant: never modifies frontmatter, re-indexes advisor, writes packet docs | consistent | script has no writes; workflow calls no advisor mutation tool (`advisor_rebuild` etc. absent) |
| invariant: exit non-zero only on fail-over or hard cap | consistent | script `main()` lines 432–441: JSON exits 1 when `exitOver`; human exits 1 when a HARD-FAIL exists or the fail-over threshold is exceeded. Live checks: no-fail-over run exit 0 (STEP 1), `--fail-over=5600` run exit 1 (STEP 4) |
| `output_format` `STATUS=OK` / `STATUS=FAIL ERROR="description budget exceeded threshold"` | consistent | matches the two observed exit modes above |
| phase 0 activity "Construct the command line and execute upstream_assets.audit_script via Bash" | ambiguous vs reality | the script is not executable and the activity names no interpreter; direct execution fails (EXIT=126). The scripts README documents the canonical form `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root .` (`scripts/README.md:105`). See `proposal.md` Fix 2 |
| phase 1 checkpoint option A `--fail-over=[project_ceiling]` | consistent | re-run exits 1 with `FAIL: project total 6774 > fail_over threshold 5600` (log STEP 4) |
| constants claim "130/110 soft, 1536 hard, 5600 project ceiling" | consistent | `python3 -c "import sys; sys.path.insert(0,'.skilled/skills/sk-doc/scripts'); import quick_validate as q; print(q.DESCRIPTION_SOFT_TARGET_SKILL, q.DESCRIPTION_SOFT_TARGET_COMMAND, q.DESCRIPTION_HARD_CAP)"` → `130 110 1536` (log STEP 7); contract JSON has `softMax` 130/110, `hardCap` 1536, `projectCeiling` 5600 |
| import path `QUICK_VALIDATE_DIR` (script lines 44–46) | present | `ls -l .skilled/skills/sk-doc/scripts/quick_validate.py` → symlink to `../shared/scripts/quick_validate.py`; import probe loaded it from that path (log STEP 7) |

## 3. Presentation components (`doctor-speckit-presentation.txt`)

| Component | Status | Evidence (command → result) |
|---|---|---|
| startup menu item `8) Audit Skill Description budget` | present | line 17 |
| accepted answer `` `8` → target = `skill-budget` `` | present | line 35 |
| help block `Description char-count over hard cap -> 8 Skill Budget` | present | line 59 |
| confusable pair `Skill Budget (8) audits CHAR COUNTS` | present | line 66 |
| valid-targets line | present | line 77; `bash .skilled/commands/doctor/scripts/route-validate.sh` → `PASS: J1 … in parity` (log STEP 8) |
| manifest row `skill-budget \| doctor-skill-budget.yaml \| read-only \| Audit skill, command, and agent description budgets` | present | line 99; matches `_routes.yaml:104,107` |
| read-only diagnostic summary template | present | lines 154–165 |
| setup dashboard template | present | lines 139–148; `Workflow: .skilled/commands/doctor/assets/[yaml]` resolves to the existing file |
| troubleshooting row `route-validate.sh` | present, runs clean | line 200; run exit 0, `OK: route-validate — 10 routes validated, 2 warnings` (log STEP 8) |
| setup prompts for skill-budget vars | absent, defaults cover them | presentation §3 (lines 106–133) carries no `json_output`/`top_n`/`fail_over`/`project_ceiling` prompt; all four have workflow defaults (`:56–60`), so the router's "resolve missing setup variables" step (`speckit.md:66`) has nothing to ask |
| footer `Press 1-11, 0, or X.` | **stale** | line 70, while accepted answers include `` `12` → runtime-mirrors `` (line 39) and `` `13` → router-reach `` (line 40); the displayed menu (lines 10–23) also omits 12 and 13. Shared-surface defect, recorded in `proposal.md` |

## 4. Environment variables

| Variable | Named at | Status | Evidence |
|---|---|---|---|
| `$PWD` | `doctor-skill-budget.yaml:37` (CLI health command) | present, expands correctly | live run (log STEP 0) used `--workspace-root /Users/…/079-doctor-command-audit` and exited 0 |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | reference doc `frontmatter-templates.md:271`; audit script comment `:69` (`CLAUDE_CODE_BUDGET_DEFAULT = 8000`) | unset in this checkout | `${SLASH_COMMAND_TOOL_CHAR_BUDGET:-<unset>}` → `<unset>`; `grep -rn` over `.claude/settings.json` and `.skilled` finds only the two documentation mentions. The 8,000 default therefore applies here; the audit's printed "Default Claude Code budget" is correct for this environment but cannot detect a non-default runtime setting |
| `SYSTEM_SKILL_ADVISOR_CLI_WARM_ONLY` / `SPECKIT_SKILL_ADVISOR_CLI_WARM_ONLY` | not named by this doctor (internal CLI defaults, `skill-advisor-cli.js:319–320`) | n/a | only relevant if the runtime exports them |

## 5. Doctor run summary (read-only)

Full record with command lines, outputs and exit codes: `doctor-run.log`.

| Step | Command (short) | Exit | Result |
|---|---|---|---|
| 0 | `node .skilled/bin/skill-advisor.cjs advisor_status … --warm-only` | 0 | `freshness: live`, `trustState.state: live`, `generation: 3` |
| 1 | `python3 …/audit_descriptions.py` | 0 | 61 items; total 6,774; ceiling 5,600; headroom −1,174; 7 OVER-SOFT; `WARN` |
| 2 | `… --json` | 0 | JSON envelope, `exitOver: false` |
| 3 | `… --top-n=5` | 0 | table truncated to 5 rows as documented |
| 4 | `… --fail-over=5600` | 1 | `FAIL: project total 6774 > fail_over threshold 5600` |
| 5 | `… --project-ceiling=5600 --top-n=3` | 0 | ceiling echoed as 5,600 |
| 6 | `./audit_descriptions.py` (direct) | 126 | `Permission denied` |
| 7 | import probe of `quick_validate` | 0 | `130 110 1536` from the shared module |
| 8 | `bash …/route-validate.sh` | 0 | `OK: route-validate — 10 routes validated, 2 warnings` |

## 6. Adjacent references checked (outside the route/workflow/presentation trio)

| Reference | Status | Evidence |
|---|---|---|
| `speckit.md:52` workflow table row | present | `grep -n "skill-budget" .skilled/commands/doctor/speckit.md` → line 52 |
| `doctor-update-presentation.txt:176` `/doctor skill-budget` one-liner | present but inaccurate | "Advisor budget/status helper" — the target audits description budgets; the advisor status probe is only a health check inside it |
| `frontmatter-templates.md:302` and `sk-create-skill/references/shared/common-pitfalls.md:67` recommend `/doctor skill-budget :auto` | invalid invocation | doctor family contract has `mode_matrix.supported_modes: []`; `_routes.yaml:106` lists no `:auto`; the router rejects unknown flags (`speckit.md:34`) |
| `scripts/README.md:105` canonical audit invocation | present | `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root .` |
| `.claude/agents` docstring claim "often a symlink" (`audit_descriptions.py:14`) | inaccurate but harmless | `file .claude/agents/ai-council.md` → regular UTF-8 text file; `.claude/skills` is the symlinked surface. All 12 agent descriptions are byte-identical between `.skilled/agents` and `.claude/agents` (per-file `description:` diff → no drift) |
| README/feature-catalog target counts | drift, sibling task in flight | `.skilled/commands/README.txt:158` says "9 subsystems" and omits `router-reach`; `.skilled/skills/system-spec-kit/feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19` says "nine subsystem YAML workflows"; the manifest holds 10 routes (`route-validate.sh` → `PASS: B1: .routes has 10 entries`). `README.txt` is already modified in this worktree by another audit |
| `.claude/commands` mirror coverage | 33 of 35 | `comm -23` of the two `find` lists → `./goal-opencode.md`, `./vision.md` exist under `.skilled/commands` but have no `.claude/commands` counterpart |

**Overall:** every path, script, command, flag and tool the route entry, workflow and presentation name exists and behaves as the workflow assumes, with two exceptions that are addressed as fixes in `proposal.md`: the workflow's audit-script activity names no interpreter while the script is mode 644, and the route entry omits the primary audit-script invocation.
