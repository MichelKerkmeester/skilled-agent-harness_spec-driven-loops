---
title: cli-orca
description: "Route Orca-managed work so worktrees, terminals, automations and handoffs run on the flags the installed binary serves, then hand generic worktree, terminal, browser and orchestration requests to the right owner."
trigger_phrases:
  - "cli-orca readme"
  - "orca cli skill index"
  - "official orca skills package"
importance_tier: normal
contextType: general
version: 0.1.11.0
---

# cli-orca

> Run Orca worktrees, terminals, automations and handoffs on flags read from the installed binary, so a stale guide is never the source of truth.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Orca worktrees, terminals, automations, artifacts and handoffs |
| **Invoke with** | An Orca-qualified phrase such as `orca worktree` or an official skill named in an Orca context |
| **Works on** | One resolved executable, a live Orca runtime and the version-matched guide |
| **Produces** | Routed command work, its receipt and the boundary when another skill owns the request |

### What It Does

cli-orca is the routing contract for Orca CLI work. It covers managed worktrees and repository state, paired terminals, the embedded browser, automations, artifacts and full ownership handoffs. It also answers what an official Orca skill does and whether that skill is installed.

Each request resolves one executable, then loads the guide that executable serves, so the flags you run match the Orca build in front of you. Command detail stays in the binary rather than in this package.

The entry point is [SKILL.md](SKILL.md), which holds the operating workflow and the escalation triggers. [ROUTER.md](ROUTER.md) holds the lane table and the loading levels that decide what else loads.

---

## 2. QUICK START

**Step 1: Resolve the executable.**

Orca can run under more than one binary name. Use the first of these that exists. Keep it for the whole task:

1. `ORCA_CLI_COMMAND`, when it is set
2. `orca-dev` from a development checkout that sets `ORCA_DEV_REPO_ROOT`
3. `orca-ide`, on Linux outside an Orca-managed terminal
4. `orca`

**Step 2: Capture the version.**

```bash
command -v orca
orca --version
```

The first line prints the path of the binary. The second prints a bare version number, for example `1.4.259`. When step 1 selected a different name, substitute it for `orca` in this block and in every later command.

**Step 3: Load the guide for that build.**

```bash
orca skills get orca-cli --full
```

Prints the Orca CLI guide as Markdown, starting with a frontmatter block that carries `name: orca-cli`. A build that will not serve this guide is an escalation, not a reason to try another binary.

**Step 4: Start with a read.**

```bash
orca worktree list --json
```

The reply is one JSON object with `ok: true` and a `result.worktrees` array. Each entry carries an `id` in the form `<repoId>::<worktreePath>`. That full address is what later worktree commands accept.

---

## 3. HOW IT WORKS

Orca work arrives as a request rather than a command. The advisor matches Orca-qualified phrases. The lane router in `ROUTER.md` sorts the match into worktree, terminal, browser, automation or official-skill work. A runtime failure selects the recovery lane instead, because those signals name a broken state rather than a surface.

`SKILL.md` stays in context for the whole task. The selected lane loads one reference. The guide from the binary supplies the flags. A request that matches no lane returns `UNKNOWN_FALLBACK` and defers. A request that belongs to `sk-git` or another owner goes to that owner.

```text
                     ┌──────────────────────────────┐
                     │ Orca-qualified request       │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ Lane router in ROUTER.md     │
                     └──────────────┬───────────────┘
                                    │
               ┬────────────────────┴────────────────────┬
               │                                         │
               ▼                                         ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│ One lane                     │          │ orca-cli guide from the      │
│ reference                    │          │ binary                       │
└──────────────┬───────────────┘          └──────────────┬───────────────┘
               │                                         │
               ┴────────────────────┬────────────────────┴
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ orca commands                │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ Receipt, exit status and     │
                     │ escalation                   │
                     └──────────────────────────────┘
```

### One Lane, One Reference

Each lane names one reference, so a routed request costs one file rather than the whole package.

| Lane | What selects it | Reference |
|---|---|---|
| Worktree and handoff | `orca worktree`, `managed worktree`, `orca repository`, a `<repoId>::<path>` address | [`references/orca-cli-reference.md`](references/orca-cli-reference.md) |
| Terminal | `orca terminal`, `paired terminal` | [`references/session-and-runtime.md`](references/session-and-runtime.md) |
| Browser | `orca browser`, `orca embedded browser`, Orca tab refs | [`references/mutation-and-browser-boundaries.md`](references/mutation-and-browser-boundaries.md) |
| Automation and publishing | `orca automation`, `orca artifacts`, `orca skills` | [`references/mutation-and-browser-boundaries.md`](references/mutation-and-browser-boundaries.md) |
| Official skills | A named official skill that the request places in Orca | [`references/orca-skills/overview.md`](references/orca-skills/overview.md) |
| Recovery | Runtime stopped, executable missing, guide mismatch, ambiguous send | [`references/troubleshooting.md`](references/troubleshooting.md) |

`ROUTER.md` carries the same map with the signal weights, the loading levels, the resource map and the router pseudocode.

### The Guide Outranks This Skill

The installed runtime is versioned. Its flags move between releases. The skill keeps the routing contract and the safety boundaries local. Command detail comes from the binary. One section at a time is often enough:

```bash
orca skills get orca-cli --reference references/browser.md
```

Prints the `Built-in browser commands` section alone, opening with the rule to pin one page and snapshot it once. When the guide and a local reference disagree, the guide wins. A capability the guide does not establish is reported as unknown rather than guessed.

---

## 4. INTEGRATION & NAVIGATION

The Orca qualifier is the whole routing test. A bare `orca` mention never routes. The token also matches the `OpenOrca` model label and the GNOME Orca screen reader on Linux, so routing needs a qualified phrase or a named Orca surface. A few phrases qualify without the product name, such as `managed worktree`, `paired terminal`, `child worktree`, `$orca-cli` and `full ownership handoff`.

### Where a Request Goes Instead

| Request | Owner |
|---|---|
| Generic git worktrees or branch management with no Orca state | `sk-git` |
| Ordinary shell terminal commands with no Orca terminal involved | The normal coding workflow, which no skill owns |
| Chrome or Chromium CDP debugging, HAR capture, Lighthouse | `mcp-chrome-devtools` |
| Generic agentic browser work not tied to Orca state | `mcp-aside-devtools` |
| Supervised multi-agent coordination: runs, task DAGs, dispatches, worker waits | The official `orchestration` skill |
| Cursor cloud workers or Cursor worktrees | `cli-cursor` inside the `cli-external-orchestration` hub |
| An unrelated `OpenOrca` model label | No Orca route at all |

### State-Changing Work

Treat these as state-changing unless the live guide and the requested operation prove otherwise:

- Worktree create, set or remove, including setup hooks and archive operations.
- Terminal create, send, split, rename or close.
- Agent launch, handoff, account selection or authentication.
- Automation create, edit, run or remove.
- Browser navigation, form input, uploads, evaluation or downloads.
- Artifact share, update, unshare or delete, plus any skill-sharing or publishing action.

Ask for explicit authorization before mutating or destructive work. Read-only discovery needs none: listings, shows, reads, snapshots, `--help` and `agent-context --json`.

A worktree deletion keeps its archive-hook gate. `--force` does not bypass a failed archive hook, so a failed hook stops the removal.

---

## 5. THE EIGHT OFFICIAL SKILLS

Orca ships eight public skills as discovery stubs. Each stub says when to engage Orca and how to load the version-matched guide, because the real flags live in the binary. This skill keeps one local reference per name for the boundary and the handoff. It never restates a stub's flags as local truth.

Default agent setup usually installs three of the eight. One name, `linear-tickets`, is a legacy alias for `orca-linear` with the same command surface, so seven install rows cover the eight names.

| Official skill | What it covers | Local reference |
|---|---|---|
| `orca-cli` | Worktrees, folder contexts, terminals, repositories, automations, artifacts, comments and the embedded browser | [`references/orca-skills/orca-cli.md`](references/orca-skills/orca-cli.md) |
| `orchestration` | Runs, task DAGs, dispatches, worker waits, coordinator loops and multi-agent messaging | [`references/orca-skills/orchestration.md`](references/orca-skills/orchestration.md) |
| `computer-use` | GUI control of a visible app window through `orca computer` | [`references/orca-skills/computer-use.md`](references/orca-skills/computer-use.md) |
| `orca-linear` | Linear ticket work through `orca linear` | [`references/orca-skills/orca-linear.md`](references/orca-skills/orca-linear.md) |
| `linear-tickets` | Legacy bundled name for `orca-linear`, with the same command surface | [`references/orca-skills/linear-tickets.md`](references/orca-skills/linear-tickets.md) |
| `orca-emulator` | iOS Simulator control on macOS | [`references/orca-skills/orca-emulator.md`](references/orca-skills/orca-emulator.md) |
| `orca-emulator-android` | Android device and emulator control over adb | [`references/orca-skills/orca-emulator-android.md`](references/orca-skills/orca-emulator-android.md) |
| `orca-per-workspace-env` | Per-workspace environment recipes in `orca.yaml` | [`references/orca-skills/orca-per-workspace-env.md`](references/orca-skills/orca-per-workspace-env.md) |

`orca-linear` and `linear-tickets` are skill names, not CLI namespaces, so every command still runs as `orca linear`.

The local `cli-external-orchestration` hub dispatches external CLI executors, while the official `orchestration` skill coordinates supervised Orca workers. The names sit close and the surfaces are separate, so a request belongs to one of them.

---

## 6. TROUBLESHOOTING

Recovery follows one rule: keep the failure as evidence and stop before a retry becomes a silent reroute. Carry four things into an escalation: the original structured or text result, the exit status, the selected executable and the guide version.

| What you see | The one safe action | When to stop |
|---|---|---|
| No executable resolves | Report the exact path, output and exit status of each candidate that failed | Ask whether to install or configure Orca before trying anything else |
| The executable runs but the guide will not load | Use the earlier guide tier, then the command's own `--help` | Stop when `skills get` itself is unknown. Report that an update restores the guide |
| The runtime is stopped | Start Orca with `orca open --json` and retry the exact command once | Stop when the retry fails. Use only an authorized read-only path after that |
| Browser refs are stale | Run `orca snapshot --json` and retry with fresh refs | Stop when stale refs return after a re-snapshot, because the loop itself is broken |
| A worktree archive hook fails | Preserve the archive result and stop the removal | Stop. `--force` does not bypass the hook |

The full table in [references/troubleshooting.md](references/troubleshooting.md) adds the first check and the next check for every symptom.

---

## 7. VERIFICATION

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-orca/README.md --type readme
```

Prints `✅ VALID` on the first line. The report then names `Document type: readme`, closes with `Total issues: 0` and exits 0.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py .skilled/skills/cli-orca
```

Prints `Detected kind: standalone` and `package_skill.py --check: PASS (exit 0)`.

The routing fixtures live in [manual-testing-playbook/manual-testing-playbook.md](manual-testing-playbook/manual-testing-playbook.md). Eight scenarios cover advisor routing, handoff receipts, runtime recovery and ownership boundaries. Each run records `PASS`, `FAIL` or `SKIP` under [benchmark/reports/](benchmark/reports/).

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](SKILL.md) | The workflow, the rules and the escalation triggers |
| [`ROUTER.md`](ROUTER.md) | Intent map, resource map and loading levels |
| [`references/orca-cli-reference.md`](references/orca-cli-reference.md) | Command families, worktree addresses and JSON conventions |
| [`references/session-and-runtime.md`](references/session-and-runtime.md) | Executable resolution, runtime state, handoffs and terminal receipts |
| [`references/mutation-and-browser-boundaries.md`](references/mutation-and-browser-boundaries.md) | Authorization, archive hooks, browser ownership and untrusted content |
| [`references/troubleshooting.md`](references/troubleshooting.md) | Fail-closed recovery and the full symptom table |
| [`references/orca-skills/overview.md`](references/orca-skills/overview.md) | The official skill set, install commands and the boundary matrix |
| [`feature-catalog/feature-catalog.md`](feature-catalog/feature-catalog.md) | Current-state feature inventory behind the router |
| [`manual-testing-playbook/manual-testing-playbook.md`](manual-testing-playbook/manual-testing-playbook.md) | The operator scenarios and their verdict rules |
| [`assets/PROVENANCE.md`](assets/PROVENANCE.md) | Snapshot source, release revisions and digests |
| [`changelog/`](changelog/) | One entry per release |

<!-- readme-check
allow-ref orca.yaml | a file the reader creates in their own project, not part of this repository
-->
