---
title: "Goal: CLI Versus MCP"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/019-official-obsidian-cli/001-cli-versus-mcp"
    last_updated_at: "2026-09-02T20:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive from the measured comparison"
    next_safe_action: "Correct the stale package pin, then decide the voice sweep"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-019-001-cli-versus-mcp"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: CLI Versus MCP

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short, because
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give an agent one measured default for app-backed Obsidian work and the conditions for leaving it, so the choice between the official CLI and the MCP server is answered rather than offered.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The official `obsidian` CLI is the default app-backed surface. The MCP server keeps a specialist role and is not dropped |
| D2 | Every cell of the comparison traces to a command that was run and read. No capability is inferred from vendor documentation |
| D3 | The operator's vault is restored to its found state, and the file counts prove it |
| D4 | `SKILL.md` is compiled-policy input. The replacement text is prepared and the file is not edited here |
| D5 | Nothing is graded through a pipe. Once the app is up the CLI exits 0 on failure, so output decides, not status |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The decision table in `references/cli-versus-mcp.md` still reads 106 CLI commands against 12 MCP tools, and still sends only section patching, in-note replace, tag writes and JSON frontmatter values, or batches past roughly 21 calls, to the MCP server
- [ ] Every `obsidian-mcp-server` version in `README.md` and `INSTALL-GUIDE.md` matches what `npm view obsidian-mcp-server version` reports, or the pin is dropped in favour of the `@latest` launch the same documents already describe
- [ ] The human-voice hard blockers across `mcp-obsidian` markdown are below a stated target, or the sweep is deferred in writing with the count it was deferred at
- [ ] The readiness probe decides on command output rather than on exit status, in `scripts/doctor.sh` and in every document that teaches the probe
- [ ] The `daily:read` side effect of creating today's daily note is documented wherever the command is listed
- [ ] `validate.sh <this phase> --strict` prints `RESULT: PASSED` with rule lines visible
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

The measurement shipped as `dcd2fa62b5 feat(mcp-obsidian): measure the CLI against the MCP server, and pick a default`, followed by `10ec4d8b5f docs(mcp-obsidian): land the three edits made after the comparison was committed`. The readiness probe was repaired earlier, in `f140793f3a fix(mcp-obsidian): stop the readiness probe passing on an app that cannot answer`. Everything below was re-confirmed against the working tree on 2026-09-02.

| Item | State | Evidence |
|------|-------|----------|
| Both surfaces measured live in both app states | Done | 106 CLI commands enumerated, roughly sixty CLI invocations, 37 MCP tool calls, all receipts under `scratch/evidence/` |
| The decision table and its thresholds | Done | `references/cli-versus-mcp.md` carries the 24-row table, the four MCP-only capabilities and the 21-call break-even |
| Package version pin | Done | `npm view obsidian-mcp-server version` reported `3.5.0` again on 2026-09-02, and the four stale pins now read `3.5.0`: `INSTALL-GUIDE.md` lines 3, 64 and 94, and `SKILL.md:641`. The launch line still resolves through `npx -y obsidian-mcp-server@latest`, so the pin stays descriptive |
| CHK-010 made truthful about `scratch/` | Done | `tasks.md:116` no longer calls `scratch/` git-ignored. It now records that this repository does not ignore it and points at limitation 7. Measured state: 515 untracked files plus the tracked `.gitkeep`, and `git check-ignore` matches nothing |
| Human-voice blockers across the skill | Pending | `hvr_scan.py --json` over all 170 markdown files under `mcp-obsidian` reports 2,119 hard blockers. Concentrated in `SKILL.md` at 113, `references/notion-migration.md` at 75, and three plugin data models at 57, 57 and 44 |
| Readiness probe reads output | Done | `scripts/doctor.sh:56` requires a non-empty `obsidian version` string, not just exit 0, and line 61 states that in-app failures exit 0 and print `Error:` on stdout. `references/obsidian-cli-commands.md:280` and `references/troubleshooting.md:177` say the same |
| `daily:read` side effect documented | Done | `references/cli-versus-mcp.md:156` and `references/official-cli-agent-usage.md:247-254`, both marking it as a read-shaped command that writes |
| Vault restored | Done | 234 markdown and 1582 total files before and after, plugin back to `enabled false`, `pgrep -x Obsidian` empty |
| `validate.sh --strict` on this phase | Done | Recorded against AC-010 and the parent recursive run, re-run at authoring time |

### Deviations and findings

| Item | Note |
|------|------|
| `scratch/` is evidence, and it stays | 516 untracked files: `runt.sh`, `run.sh`, `mcpcall.cjs`, `mcpseq.cjs`, five `calls-*.json` and `evidence/`. They are the receipts behind every cell of the comparison and are already cited by `tasks.md` T001 to T007, `plan.md` sections on the runners, and `acceptance-criteria.md` AC-003. Nothing was deleted |
| The scaffold's claim that `scratch/` is git-ignored is wrong | `tasks.md` CHK-010 calls it git-ignored while limitation 7 records that it is not. The files were unstaged by hand and show as untracked. The task text was the stale half, corrected on 2026-09-02 |
| The MCP measurement needed a plugin the operator keeps off | The comparison therefore describes what the MCP server can do, not what it does in this vault. As configured it does nothing, and the plugin was switched back to disabled |
| Three daily-note writers were not exercised | `daily:append`, `daily:prepend` and a bare mutating command write to the operator's vault outside a scratch note. Whether the appenders also create the note is untested |
| Where `delete` without `permanent` puts the file is unresolved | It reported `Moved to trash` and the file was in neither the vault `.trash` nor `~/.Trash`. The vault count is back to baseline, so it left the vault |
| A concurrent session moved HEAD mid-run | It reverted uncommitted edits to six tracked skill files, which were re-applied and re-staged, and its commit `08eb67a0de` swept this packet's scaffold into itself. No history was rewritten to correct that |
| The two documentation validators disagree on spec docs | `validate_document.py` types them as general and objects to the anchors that `validate.sh` requires. Pre-existing, reproduced on untouched files, and the spec gate is the authority |
<!-- /ANCHOR:log -->
