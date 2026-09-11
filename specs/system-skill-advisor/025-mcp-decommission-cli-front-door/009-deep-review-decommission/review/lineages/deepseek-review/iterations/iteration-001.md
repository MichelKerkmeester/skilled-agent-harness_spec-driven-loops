# Iteration 1: D1 Correctness - the doctor MCP route against the post-decommission tree

## Focus

- **Dimension(s)**: correctness (primary), traceability (secondary)
- **Scope investigated**: the live `/doctor:mcp` command route and everything it dispatches to - `.opencode/commands/doctor/_routes.yaml`, `.opencode/commands/doctor/mcp.md`, `.opencode/commands/doctor/scripts/mcp-doctor.sh`, `.opencode/commands/doctor/assets/doctor-mcp-install.yaml`, `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml`
- **Brief classes covered**: class 1 (surviving advisor MCP artifact/path on a live surface), class 3 (interconnected surfaces outside the advisor package), class 4 (commands printed in any document that would fail if a reader ran them), class 6 (names that outlived their referent)
- **Reproduction constraint**: this lineage is write-contained to its artifact directory, so no command that writes to disk was executed. Every repro below is a read-only probe whose output is quoted verbatim.

### Why this surface first

The review brief's six classes all ask "what still describes a transport that is gone". The doctor route is the highest-blast-radius candidate because it is the only live surface whose job is to *tell an operator the truth about the advisor's transport registration*, and it is invoked by trigger phrases ("MCP server broken", "MCP connection failure") rather than by a reader browsing docs.

## Scorecard

- Dimensions covered: correctness, traceability
- Files reviewed: 6
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: MCP install workflow for the advisor cannot succeed, and carries a keyless orphan server block, `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:113-116` and `:118-129`.

  The `servers.system_skill_advisor` entry declares its health checks and entry point against the renamed tree (`:104` `entry_point: "runtime/dist/runtime/advisor-server.js"`, `:108-112` `runtime/...` paths) but its install contract still points at the deleted directory:

  ```
  $ rg -n "mcp-server" .opencode/commands/doctor/assets/doctor-mcp-install.yaml
  114:      - "cd {skill_dir}/mcp-server && npm install"
  115:      - "cd {skill_dir}/mcp-server && npm run build"
  116:    fallback_build: "cd {skill_dir}/mcp-server && npm install && npm run build"
  ```

  `{skill_dir}` resolves to `.opencode/skills/system-skill-advisor` (`:103`), so both the primary and the fallback install step `cd` into a path that does not exist:

  ```
  $ test -d .opencode/skills/system-skill-advisor/mcp-server && echo EXISTS || echo MISSING
  MISSING
  $ test -d .opencode/skills/system-skill-advisor/runtime && echo EXISTS
  EXISTS
  ```

  The same file also holds a second, **keyless** server block nested inside `servers.system_skill_advisor`:

  ```
  $ sed -n '99,100p;116,120p;129,131p' .opencode/commands/doctor/assets/doctor-mcp-install.yaml
  servers:
    system_skill_advisor:
      fallback_build: "cd {skill_dir}/mcp-server && npm install && npm run build"

      label: "System Code Graph"
      runtime: node
      entry_point: "mcp-server/dist/index.js"
      ...
      fallback_build: "cd {skill_dir} && npm install && npm run clean && ./node_modules/.bin/tsc --build ./tsconfig.json"

    code_mode:
  ```

  Lines 118-129 repeat `label`, `runtime`, `entry_point`, `health_checks`, `install_steps` and `fallback_build` under the advisor key without a server name of their own. No `*code-graph*` skill exists (`ls .opencode/skills/` lists 13 entries, none of them a code-graph skill), so the block's `mcp-server/dist/index.js` paths resolve against the advisor directory and exist nowhere. Whichever way a YAML parser resolves duplicate keys, the entry is wrong: last-key-wins makes the advisor's effective `entry_point` and health checks the code-graph ones (both dead), and first-key-wins leaves an unreachable orphan block that a future reader will "repair" into the file.

  **Impact**: `/doctor:mcp install --server system_skill_advisor` (route at `.opencode/commands/doctor/_routes.yaml:212-214`, sub-action `install`) reports a repair path that fails, and the advisor is presented to operators as an installable MCP server.

- **F002**: the live doctor script still declares the advisor an MCP server and permanently reports it as unwired, `.opencode/commands/doctor/scripts/mcp-doctor.sh:59`, `:269`, `:297-303`, `:360`, `:399`, `:415`.

  ```
  $ sed -n '58,60p' .opencode/commands/doctor/scripts/mcp-doctor.sh
  Servers Checked:
    system_skill_advisor      Skill Advisor (Node.js MCP, advisor_recommend + skill_graph_*)
    code_mode             Code Mode (Node.js MCP, TypeScript tool orchestration)
  ```

  The config-wiring check still expects a declaration that the packet removed on purpose:

  ```
  $ sed -n '409,416p' .opencode/commands/doctor/scripts/mcp-doctor.sh
    local -a config_files=(
      "opencode.json|json-mcp|OpenCode"
      ".claude/mcp.json|json-mcpServers|Claude Code"
      ".vscode/mcp.json|json-vscode-mcp|VS Code / Copilot"
    )

    local -a servers=("system_skill_advisor" "code_mode")
  ```

  ```
  $ rg -n "system_skill_advisor|skill_advisor" opencode.json .claude/mcp.json .codex/config.toml .cursor/mcp.json .pi/mcp.json
  (no output; exit 1)
  ```

  Because `detect_and_check_configs()` runs unconditionally and iterates `servers=(system_skill_advisor code_mode)`, every `/doctor:mcp` run now emits `record_warn ... "Not wired"` for the advisor in all three scanned configs. A diagnostic that reports a deliberately-removed registration as a warning is worse than a stale comment: an operator following it will try to re-register the advisor, which is the single outcome the packet exists to prevent.

  Two further stale strings in the same file, both operator-visible:

  ```
  $ rg -n "mcp-server/node_modules|MCP server expects stdio|Ran npm install" .opencode/commands/doctor/scripts/mcp-doctor.sh
  300:    _log log_pass "mcp-server/node_modules installed"
  303:    _log log_fail "mcp-server/node_modules missing — needs npm install"
  360:        process.exit(0); // MCP server expects stdio — exiting is normal
  399:    _log log_info "Ran npm install + npm run build in mcp-server/"
  ```

  The check at `:297-303` tests `$skill_dir/runtime/node_modules` (correct) while printing `mcp-server/node_modules` (deleted), and `:399` prints the same dead path after a successful repair.

### P2, Suggestion

- **F003**: the MCP debug workflow still enumerates the advisor as a supported MCP server, `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml:27`, `:42`, `:90`, `:108-122`.

  ```
  $ rg -n "supported servers|system_skill_advisor" .opencode/commands/doctor/assets/doctor-mcp-debug.yaml | head -5
  27:  supported servers (skill-advisor, code-mode), cross-reference
  42:    system_skill_advisor: ".opencode/skills/system-skill-advisor/INSTALL-GUIDE.md"
  90:  system_skill_advisor: .opencode/skills/system-skill-advisor/INSTALL-GUIDE.md
  108:  system_skill_advisor:
  ```

  Counterevidence, which downgrades this below F001/F002: this same file's repair actions were already rewritten to the renamed tree (`:110-122` use `.opencode/skills/system-skill-advisor/runtime`), and the advisor's real install guide is transport-free. So the hit is the server *membership* and the guide binding, not a broken command - documentation-level drift, not an execution failure.

  Note also that the advisor's own documentation is clean. The negative control:

  ```
  $ rg -n "\bMCP\b" .opencode/skills/system-skill-advisor/README.md .opencode/skills/system-skill-advisor/INSTALL-GUIDE.md
  README.md:86:... There is no MCP transport to fall back to.
  INSTALL-GUIDE.md:52:- No runtime configuration: ... there is no MCP registration step.
  INSTALL-GUIDE.md:164:... There is no plugin bridge or MCP client in the chain ...
  ```

  All three are negative statements about a removed transport, which is the correct post-decommission voice. The defect is confined to the doctor command family, not the advisor package.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/commands/doctor/_routes.yaml:212-214`; `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:104` vs `:114-116` | The packet's normative claim "no runtime config declares the advisor as an MCP server, the CLI answers every capability" is false on the doctor surface: it still declares the advisor among the servers it installs and repairs. The remaining class-3 surfaces were not yet swept this iteration. |
| checklist_evidence | blocked | hard | `{spec_folder}/` holds no `checklist.md` (Level 1 scaffold) | Nothing to verify yet; scheduled with the packet-claims pass. |
| feature_catalog_code | notApplicable | advisory | advisor package docs are transport-free (`F003` negative control) | Overlay protocol reserved for the documentation pass. |
| playbook_capability | notApplicable | advisory | - | Scheduled for the maintainability pass. |

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "The MCP install workflow's advisor entry cannot complete from the final state, because its install_steps and fallback_build cd into the deleted mcp-server/ directory, and the same entry contains a keyless second server block whose paths exist in no skill directory.",
  "evidenceRefs": [
    ".opencode/commands/doctor/assets/doctor-mcp-install.yaml:113-116",
    ".opencode/commands/doctor/assets/doctor-mcp-install.yaml:118-129",
    ".opencode/commands/doctor/assets/doctor-mcp-install.yaml:103-104",
    ".opencode/commands/doctor/_routes.yaml:212-214"
  ],
  "counterevidenceSought": "Read the whole servers block (lines 99-146) to check whether mcp-server belongs to a different server entry; checked whether a code-graph skill exists to own lines 118-129; checked whether the packet exempted doctor configs anywhere. The sibling debug workflow (doctor-mcp-debug.yaml:110-122) was rewritten to runtime/, which shows the rename was carried into the doctor family and this file was missed rather than exempted. 007's residue record lists 12 exempt 'MCP server' lines and does not list this file.",
  "alternativeExplanation": "The install steps could be intentional dead text kept for a legacy MCP-only path no operator uses. Rejected: the route is live (_routes.yaml:212-214 with trigger phrases 'MCP install', 'reinstall MCP'), the file's own health checks were rewritten to runtime/, and an unkeyed duplicate server block is not a documented decision anywhere in the packet.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade to P2 if the doctor MCP route is deleted or its advisor entry removed before this packet closes, or if an owning packet accepts the file as out of scope with a written exemption.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "mcp-doctor.sh still presents the advisor as an MCP server and, because its config-wiring check runs unconditionally over servers=(system_skill_advisor code_mode), every /doctor:mcp run reports the deliberately-removed advisor registration as 'Not wired'.",
  "evidenceRefs": [
    ".opencode/commands/doctor/scripts/mcp-doctor.sh:59",
    ".opencode/commands/doctor/scripts/mcp-doctor.sh:409-416",
    ".opencode/commands/doctor/scripts/mcp-doctor.sh:300",
    ".opencode/commands/doctor/scripts/mcp-doctor.sh:360"
  ],
  "counterevidenceSought": "Searched all five runtime configs for any advisor declaration (none), verified the script's advisor health checks otherwise use runtime/ paths, and checked whether the default MCP-server set is filtered by a server allowlist that could exclude the advisor. FILTER_SERVER only narrows an operator-provided --server value; it does not remove system_skill_advisor from the default set.",
  "alternativeExplanation": "The advisor could still be listed so the doctor can health-check its daemon, with the 'Not wired' warning being harmless. Rejected as a resolution but retained as context: the health checks do target the live daemon, so the entry is partly useful; the defect is that the file also asserts MCP membership and emits a false not-wired warning on every run.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if the config-wiring check is made advisor-aware (i.e. skips the advisor or asserts the opposite contract) while the help text keeps its current wording.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Assessment

- New findings ratio: 1.0 (first iteration; all three findings are first-sight)
- Dimensions addressed: correctness, traceability
- Novelty justification: three independent live surfaces in the doctor command family, each with a distinct failure mode (an install path that cannot resolve, a check that permanently misreports, a server-membership claim). Severity weighting: two P1 (5.0 each) plus one P2 (1.0) over a cumulative weighted total of 11.0.

## Ruled Out

- **The advisor package's own transport documentation**: `.opencode/skills/system-skill-advisor/{README.md,INSTALL-GUIDE.md,SKILL.md}` mention MCP only in negative statements or in reference to unrelated servers. Evidence: the `rg` output in F003.
- **The route trigger phrases** ("MCP server broken", "MCP debug" in `_routes.yaml`): these are search aliases for the doctor route, not claims about the advisor. Kept out of the finding set; recorded here as an intentional survivor. Evidence: `_routes.yaml:225-234`.
- **`system_skill_advisor` as a health-check name** (as opposed to a registration claim): the dist entry, launcher and shared-dependency checks at `mcp-doctor.sh:271-301` all resolve against the renamed tree and would pass. Evidence: `sed -n '271,301p'`.

## Dead Ends

- **Executing `/doctor:mcp --json` as a reproduction**: refused by this lineage's write containment (the doctor script and its fix mode mutate the workspace and `node_modules`). Reproduction stays at the read-only probe level and the report says so.

## Recommended Next Focus

Iteration 2 (D2 Security, plus the correctness residue in the launcher and runtime code): audit the trust-default rehoming and the launcher's stale transport names - `.opencode/bin/system-skill-advisor-launcher.cjs` (its operator-visible action strings and the two rehomed env settings), `.opencode/plugins/system-skill-advisor.js` (bridge-named state and its undocumented timeout env), and `runtime/lib/context/caller-context.ts` (`MCPCallerContext`).

Review verdict: CONDITIONAL
