# Iteration 8: What Devin Can Carry

## Focus

Read `.devin/` in full and the Devin CLI contract. Enumerate every repo-carriable surface Devin
supports and every one it does not, with the config file or flag that proves each. This is the
boundary any Devin parity work must respect.

## Findings

### F1. `.devin/` in full — six entries, three kinds of ownership

```
.devin/SYNC.md                    real file, 8488 bytes (the manifest)
.devin/agents/                    12 directories, each holding AGENT.md -> symlink
.devin/hooks/                     21 symlinks
.devin/hooks.v1.json              generated from hook-registry.json (iteration 6)
.devin/mcp_config.json            real file, Devin-owned
.devin/config.local.json          real file, mode 0600, gitignored
.devin/manual-testing-playbook -> ../.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook
```

**Observed parity, not asserted:** all **21** distinct `.opencode/**` scripts invoked by
`hooks.v1.json` have a matching resolving symlink in `.devin/hooks/` — missing count **0**, broken
count **0** — and all **12** `.devin/agents/<name>/AGENT.md` symlinks resolve (broken count **0**).
Extracted from the file's own `command` strings, so this checks the manifest's §6 requirement
("Every `.opencode/**` script `hooks.v1.json` invokes has a matching symlink in `hooks/`") directly.
[SOURCE: shell extraction of `.opencode/**` script paths from `.devin/hooks.v1.json` matched against
symlink targets in `.devin/hooks/`; broken-symlink probe over `.devin/agents`]

### F2. The carriable boundary, with proof per row

| Repo surface | Devin | Proof |
|---|---|---|
| Agents (12) | **yes** — nested directory shape | `.devin/agents/<name>/AGENT.md` → `../../../.claude/agents/<name>.md`, 12/12 resolve; `.devin/SYNC.md:29,37` |
| Hooks (8 events) | **yes** — richest event set of any runtime | `.devin/hooks.v1.json` top-level keys `SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PermissionRequest, Stop, PostCompaction, SessionEnd`; 21/21 script symlinks resolve |
| MCP servers | **yes** — Devin owns the file | `.devin/mcp_config.json`, `{"mcpServers": {"code_mode": …}}`; `.devin/SYNC.md:32,127` |
| Slash commands | **yes, but skill-derived** | `devin --help` documents `skills  Manage agent skills (slash commands and agent-triggered context blobs)`; `devin skills list` shows 12 repo-local `.opencode/skills/*` packets (`.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:257-275`) |
| Skills mirror | **not needed** | native discovery of `.opencode/skills/*`; no `.devin/skills/` authored (`.devin/SYNC.md:20`) |
| Mirrored commands | **no** | no loader in `devin --help`; `.devin/skills/` absent; retired by operator directive (commit `a2241041b0`, iteration 2) |
| Rules | **inherited, no local directory** | `devin rules paths` → `.windsurf/rules/*.md` (absent here) and `.cursor/rules/*.md`; `devin rules list` → `skill-routing [Cursor] · CLAUDE [Claude] · AGENTS [Standard] · global_rules [Windsurf]` (`.devin/SYNC.md:78-84`) |
| Goal | **injection only** | `.devin/hooks.v1.json:33,55` register `goal-inject.mjs` on `SessionStart` + `UserPromptSubmit`; no prompt-command surface to manage from (iteration 4) |
| One-shot prompts | **yes** | `--prompt-file <FILE>` and `[PROMPT]...` after `--` (`devin --help`) |
| Vision | **yes** | `sk-vision-inject` binding for devin; `.devin/hooks/sk-vision.mjs` symlink |
| Permission modes | **yes, 8 values** | `.devin/SYNC.md:90`: `normal`/`auto`, `accept-edits`, `dangerous`/`yolo`/`bypass`, `autonomous` (+`--sandbox`); `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:336` records that `--help` prints only 4 |
| Playbook | **yes** | `.devin/manual-testing-playbook` whole-dir symlink |
| Subagents | **yes** | `run_subagent` with `.devin/agents/<name>/AGENT.md` profiles (`.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:292`) |
| Plugins / cloud / ssh / acp | **yes** | `devin --help` subcommand list |

**The four surfaces Devin cannot carry, stated as a boundary:** a mirrored command tree, a
`.devin/skills/` mirror, a local `.devin/rules/` directory, and goal *management*. Each has a proof
above; none is an omission.

### F3. Devin is the only runtime with `PermissionRequest` and `PostCompaction` — and one is inert

`.devin/SYNC.md:88`: "It is the only runtime with `PermissionRequest` and `PostCompaction`." Two
consequences the manifest records honestly:

- **This repo dispatches with `--permission-mode bypass`**, under which `PermissionRequest` is never
  raised, so `permission-request-policy.mjs` is registered and inert. Guard coverage is intact because
  **`PreToolUse` still fires under bypass**, verified directly — the spec-gate and dispatch guards
  remain active. Only the approval prompt is absent.
- **`PostCompaction` has never been observed firing** — it needs a session long enough to trigger real
  compaction.
  [SOURCE: file:.devin/SYNC.md:92,129-130]

So Devin's two unique events are, in practice, one inert and one unobserved. The surface exists; the
value has not been demonstrated.

### F4. The strict-YAML constraint is Devin's one *silent* failure mode, and no gate covers it

"Devin's frontmatter parser is **stricter than Claude's or OpenCode's**. An unquoted `description:`
containing a colon is invalid YAML, and Devin silently drops the **entire file** rather than erroring
… This hid 12 of 36 commands from Devin while the other 24 registered normally, with no warning
anywhere. **Any mirrored file must survive a strict YAML parse.** Lenient parsers accepting it is not
evidence."
[SOURCE: file:.devin/SYNC.md:67-74]

`.devin/SYNC.md:128` names the gap: "**No strict-YAML gate.** Nothing blocks a colon-bearing unquoted
`description:` from being committed to a canonical file; it only surfaces as a silently missing command
in Devin." The failure is silent, the historical instance is 12 files, and the check is mechanical
(parse every canonical agent/command frontmatter with a strict parser). This is the highest
value-per-cost detector found so far — it protects every runtime's files, not just Devin's.

### F5. Stale PASS rows survive in the Devin playbook's results table

The cli-devin playbook carries a supersession note in its header:

> `DV-012`'s count is superseded (roster is 12; parity verified OK by the roster-mirror checker).
> `DV-014`'s evidence describes a mirrored command surface since removed by operator decision.
> `DV-016` was …

but the results table still contains, unmarked:

```
| `DV-012` | PASS | all 13 roster agents enumerated alongside subagent_explore/subagent_general |
| `DV-014` | PASS | 36/36 mirrored commands + 12/12 skills registered |
| `DV-016` | PASS | all 36 command frontmatters parse as valid YAML (0 invalid) |
```

The note is good practice; the table is what a skimmer reads first. Both superseded counts (13 agents,
36 commands) reappear here, matching the manifest drifts found in iterations 2, 3 and 5 — the same two
numbers, now in a third artifact.
[SOURCE: file:.devin/manual-testing-playbook/manual-testing-playbook.md:44-71]

### F6. The shape rule any future Devin parity work must obey

Combining this iteration with iterations 2 and 7, a repo-authored surface can reach Devin only as one
of four shapes:

1. **Nested symlink** — `.devin/agents/<name>/AGENT.md` (agents), `.devin/hooks/<script>` (hook
   scripts), whole-dir symlink for the playbook.
2. **A generated entry in a Devin-owned registry** — `hooks.v1.json` from `hook-registry.json`.
3. **A skill-shaped directory** — `.devin/skills/<name>/SKILL.md`, the shape the retired command mirror
   used, still supported by the runtime because skills *are* the slash surface.
4. **Nothing at all** — native discovery (`.opencode/skills/*`), inheritance (`.cursor/rules/*.md`,
   root `CLAUDE.md`/`AGENTS.md`), or the host's own file (`.devin/mcp_config.json`).

Shape 3 is the finding for a planner: if the operator ever wants the 35 authored commands reachable in
Devin, the mechanism is `.devin/skills/<flat-name>/SKILL.md` generated per command — the exact tree
`a2241041b0` deleted — and the strict-YAML constraint (F4) applies to every file in it.

## Sources Consulted

- Shell: `.devin/` inventory with file modes; symlink-resolution probe over `.devin/hooks` and
  `.devin/agents`; script-path extraction from `.devin/hooks.v1.json`; `ll` of the playbook row set
- `file:.devin/hooks.v1.json` (all 8 event keys, 21 distinct invoked scripts)
- `file:.devin/SYNC.md:8,20,29-37,67-92,98-101,126-130`
- `file:.devin/mcp_config.json`, `file:.devin/config.local.json`
- `file:.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:257-296,326-337`
- `file:.devin/manual-testing-playbook/manual-testing-playbook.md:44-71`
- Read-only git: `git show --stat a2241041b0` (iteration 2, reused here)

## Assessment

`newInfoRatio: 0.85` — The boundary is now enumerated with a config file, flag or live probe behind
every row, and two rows are load-bearing for any plan: the shape rule (F6) and the strict-YAML gate
(F4). New relative to earlier iterations: the hook mirror is verified complete (21/21, 0 broken,
0 missing), Devin's two unique events are one inert and one unobserved, and the stale counts have a
third home in the playbook's results table.

Confidence: **high**. The two parity claims in F1 are computed from the file's own contents and the
filesystem, and F2's rows cite either the binary's help output or a line in a manifest that was read.

## Reflection

Worked: checking `.devin/hooks/` against the scripts `.devin/hooks.v1.json` actually invokes, rather
than counting symlinks. Counting 21 links and comparing to 21 expected is a parity claim; extracting
the invoked paths and resolving each is a verification, and it is the same distinction the checkers in
this repo make between presence and equality.

Failed: nothing material. One caution recorded — `devin rules paths` and `devin skills list` were not
re-run in this session (only `--help`, `skills --help` and `version`, all read-only and side-effect
free); their outputs are quoted from `.devin/SYNC.md` and `cli-devin/SKILL.md`, so the rules-inheritance
and skill-discovery rows are second-hand. Marked as such.

Ruled out: reading Devin's zero-command surface as a parity debt. It is a boundary the runtime and an
operator directive both place; the honest row is "cannot carry", not "has not been carried".

## Recommended Next Focus

Iteration 9: Drift detection — is there a single gate that would notice a runtime falling behind on any
surface? If several partial gates exist, name each and its blind spot. Propose the cheapest detector
that would have caught the Devin command gap, and say what it would cost to run on every commit.
Carry forward the blind spots already named in this lineage: the strict-YAML silent drop (Devin, F4
above), token-set equality masking semantic agent drift (iteration 5), four unwired `--check` modes
(iteration 6), Hermes's scanner-quarantined skills (iteration 3, 61 of 68 loadable), the ungated Pi
guard bridges (iteration 7), and the four gates' change-scoped nature.
