---
title: "Doctor commands overview"
description: "The doctor routers split checks by owner (`/doctor:speckit`, `/doctor:skill-advisor`, `/doctor:deep-loop`, `/doctor:runtime-mirrors`, `/doctor:sk-code`, `/doctor:git`, `/doctor:ci`, `/doctor:sk-skill`, `/doctor:agents-md` and `/doctor:setup`) and dispatch to their subsystem routes."
trigger_phrases:
  - "doctor commands"
  - "/doctor"
  - "run doctor subsystem diagnostic"
  - "skill advisor rebuild doctor"
  - "how do I diagnose and repair a spec-kit subsystem"
version: 1.7.7.0
---

# Doctor commands

## 1. OVERVIEW

Category covering the doctor routers split by owner: `/doctor:speckit` for spec-kit retrieval, `/doctor:skill-advisor <target>` with six targets, `/doctor:deep-loop` and `/doctor:runtime-mirrors`, `/doctor:ci <report|scaffold|toggle>` for GitHub Actions workflows, `/doctor:sk-skill <check|convert>` for skill format work, `/doctor:agents-md <check|embed|restore>` for the root instruction file, plus `/doctor:helper`, which names the command that fits a described problem, `/doctor:setup`, the read-only onboarding check across all of them, and standalone `/doctor:update`, `/doctor:mcp install|debug`, `/doctor:env`, `/doctor:sk-code` and `/doctor:git <hooks|standards|setup>` commands.

This category documents the doctor command surface that diagnoses and repairs spec-kit subsystems. Each router owns the routes of one subsystem, and all of them read one route manifest checked by one CI assertion. Each command has manual testing scenarios in the playbook of the skill it checks, except the `scaffold` and `toggle` targets of `/doctor:ci`, which have none yet.

---

## 2. HOW IT WORKS

The shipped surface splits by owner. `/doctor:speckit` takes no target and diagnoses spec-kit retrieval: the trigger index, its lookup and the ripgrep recipes. `/doctor:skill-advisor <target>` owns six targets: `tune`, `rebuild`, `skill-graph-freshness`, `router-reach`, `skill-budget` and `parent-skill`. The `rebuild` target rebuilds `skill-graph.sqlite` through the advisor CLI behind a backup. `/doctor:deep-loop` takes only `--scope`, and `/doctor:runtime-mirrors` takes no arguments. `/doctor:setup` takes no target: it lists every doctor command and runs the sk-code setup, sk-git setup, trigger index, runtime mirror and skill advisor status checks read-only, naming one repair command per failing check. Standalone `/doctor:update` carries check, align, gated apply, rollback, record-base and compat actions and owns release migration. `/doctor:mcp install|debug`, `/doctor:env`, `/doctor:sk-code` and `/doctor:git <hooks|standards|setup>` complete the set. `/doctor:ci` owns three targets. `report` (the default, read-only) lists every GitHub Actions workflow with its switch state. `scaffold` writes one new workflow after a yes. `toggle` changes one switch variable after a yes, but it refuses to switch off the master or message-contract switch.

The route manifest declares every target's location and mutation class so Gate 3 can be answered per-route before execution. Routes marked `read-only` may inspect and report without a spec-folder write path. `add-only` routes may create scoped logs, snapshots, or evidence after Gate 3 is satisfied. `mutates` routes follow the same spec-folder discipline as any other file or database mutation. A CI assertion verifies the manifest against the router source.

`/doctor:agents-md <check|embed|restore>` answers the same question for the root instruction file. `check` is the default and read-only: it reports twelve rows from the shipped manifest, covering the install state, the sections lost or reordered, how current each shipped body is, every pin, the delivery budget, the shape of the repository block, the lines only the repository carries, each runtime copy, the `REPO RULES.md` router and the template's own purity, and it reads `UNKNOWN` rather than `PASS` for a row it cannot prove. `embed` composes every target in memory, prints the targets, the diffs, the new block, the budget, the preservation ledger and a plan digest, and writes only when that digest comes back: it backs up every path it will touch, writes inside its own allowlist and proves against the bytes on disk that no repository line was dropped, restoring from the backup itself when one was. `restore` puts back exactly the paths one recorded run's `manifest.json` names. A repository already in its target state gets `NOTHING TO DO`, and no route stages or commits anything.

The playbook peer at `manual-testing-playbook/doctor-commands/` holds the scenarios for the five commands this skill owns: `/doctor:speckit`, `/doctor:runtime-mirrors`, `/doctor:env`, `/doctor:update` and `/doctor:helper` (DOC-349 to DOC-361, DOC-381, DOC-393 and DOC-394), plus the two live-session rows for `/doctor:agents-md` (DOC-396 and DOC-397), which record what a Devin session and a Cursor window actually see rather than what the engines write. The other commands are tested where they belong: `/doctor:skill-advisor` and `/doctor:setup` in the system-skill-advisor playbook, `/doctor:deep-loop` in the system-deep-loop playbook, `/doctor:git` in the sk-git playbook and `/doctor:mcp` in the mcp-code-mode playbook, each under its own `doctor-commands/` category. `/doctor:ci report` is tested in the sk-code playbook (DOC-392). `scaffold` and `toggle` have no manual scenario yet. The `/doctor:ci` script tests are `ci-report.test.cjs` and `doctor-ci-contract.test.cjs` in `.skilled/commands/doctor/scripts/tests/`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/commands/doctor/speckit.md` | Router | `/doctor:speckit` spec-kit retrieval diagnostic, no target |
| `.skilled/commands/doctor/skill-advisor.md` | Router | `/doctor:skill-advisor <target>` argv-positional dispatch for the six advisor targets |
| `.skilled/commands/doctor/deep-loop.md` | Router | `/doctor:deep-loop` coverage-graph and convergence diagnostic |
| `.skilled/commands/doctor/runtime-mirrors.md` | Router | `/doctor:runtime-mirrors` mirror-parity diagnostic |
| `.skilled/commands/doctor/sk-code.md` | Router | `/doctor:sk-code setup` read-only sk-code setup check |
| `.skilled/commands/doctor/setup.md` | Router | `/doctor:setup` read-only onboarding check that lists every doctor target and runs five setup checks |
| `.skilled/commands/doctor/helper.md` | Router | `/doctor:helper` free-text routing over the route manifest, with a read-only pick run in place and a writing pick handed back as one line |
| `.skilled/commands/doctor/agents-md.md` | Router | `/doctor:agents-md <check\|embed\|restore>` three targets over one shipped manifest, with `check` as the bare-command target |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Manifest | The shipped sections, pins, runtime copies, delivery budget and router rows, plus the generated `derived` key that carries each body's hash |
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | Engine | The read-only check: twelve rows A1 to A12, `--root` and `--json`, and exit 0, 1 or 2 |
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs` | Engine | `plan`, `apply --plan-digest` and `restore --run`, with the backup, the write allowlist and the post-write preservation proof |
| `.skilled/commands/doctor/scripts/agents-md-manifest.cjs` | Generator | `--write` and `--check` for the manifest's `derived` key, and the refusal of a heading the authored rows do not cover |
| `.skilled/commands/doctor/_routes.yaml` | Manifest | Route manifest exposing each target's location and mutation class |
| `.skilled/commands/doctor/update.md` | Command | `/doctor:update` release-aware check, align, apply, rollback, record-base and compat workflows |
| `.skilled/commands/doctor/mcp.md` | Command | `/doctor:mcp install\|debug` MCP infra surface |
| `.skilled/commands/doctor/env.md` | Command | `/doctor:env` guided environment switches |
| `.skilled/commands/doctor/git.md` | Command | `/doctor:git <hooks\|standards\|setup>` hook gate settings, `.sk-git/` rule changes and a read-only setup check |
| `.skilled/commands/doctor/ci.md` | Router | `/doctor:ci report\|scaffold\|toggle` GitHub Actions workflow report, scaffold and switch toggle |
| `manual-testing-playbook/doctor-commands/README.md` | Playbook | Scope of the doctor scenarios and the DOC- ID series across playbooks |
| `manual-testing-playbook/doctor-commands/*.md` | Playbook | Per-scenario Markdown specs (DOC-349 to DOC-361, DOC-381, DOC-393, DOC-394, DOC-396 and DOC-397) |

### Validation

| File | Layer | Role |
|------|-------|------|
| `.skilled/commands/doctor/scripts/route-validate.sh` | Validator | CI assertion that verifies the route manifest against the router source |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Validator | Operator-scenario contract check for each playbook that holds doctor scenarios |
| `.skilled/skills/sk-doc/scripts/validate_document.py` | Validator | Markdown structure and HVR validator for the playbook README and category overview |
| `.skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` | Validator | The manifest generator: the 44 sections, the match prefixes, the pins, the release history and every refusal |
| `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | Validator | The check engine over the nine composed fixture recipes: the state each one plants, the row it must fail, the exit codes, JSON parity and the tree digests |
| `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` | Validator | The embed engine: the plan writing nothing, the digest refusal, the allowlist, the preservation proof, the restore and the second run's `NOTHING TO DO` |

---

## 4. SOURCE METADATA
- Group: Doctor commands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `doctor-commands/category-overview.md`
