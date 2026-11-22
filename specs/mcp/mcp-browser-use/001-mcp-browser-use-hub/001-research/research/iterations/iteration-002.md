# Iteration 2: KQ2 CLI-versus-Code-Mode lane rules

## Focus

Draft one lane rule per mode — Bladebro, Chrome DevTools (`bdg` + chrome-devtools-mcp), Aside — each with a detection command and a fallback trigger. Interpretation: "CLI" is the mode's native binary (`bladebro`, `bdg`, `aside`); "MCP through Code Mode" is its registered UTCP manual invoked through `call_tool_chain()`. No live probes were run: live `bladebro` probes are BLOCKED from iteration 1 and KQ6 owns live verification [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/deep-research-strategy.md:96-100]. Bladebro claims use the v4.8.2 pin from iteration 1 (published 2026-11-20T16:33:56Z, read 2026-11-21); `docs/setup.md` was fetched from the repo's `main` on 2026-11-21, so its flags are read-date evidence to re-confirm against the installed binary.

## Actions Taken

1. Read state: config (iteration 2, sessionId `2026-11-21T08:29:48.000Z`, `progressiveSynthesis: true`), state JSONL, strategy (focus KQ2; two BLOCKED directions), findings registry (6 key findings, 0 resolved).
2. Reused the iteration-001 narrative and `research.md` instead of re-reading full packets; verified `iteration-002.md` did not exist and that `research/research.md` is the only in-scope synthesis file.
3. Read the lane-comparison, preflight and fallback sections of both local mode `SKILL.md` files with line-anchored reads and targeted greps.
4. Read the research charter's KQ2 "answered means" bar and the measured binary-availability fixture.
5. Listed Bladebro's `docs/` via the releases API and fetched `docs/setup.md` for the CLI detection/health command and the MCP registration form.

## Findings

### Lane rule 1 — Bladebro (new mode; CLI-preferred, transport fallback)

- **Detection**: `command -v bladebro`, then `bladebro doctor` as the health check. On this host `command -v bladebro` returns **absent** [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:81-84]. Upstream setup gives `npm install -g bladebro` followed by `bladebro doctor`; npm selects the native package through optional dependencies (macOS `bladebro-darwin-arm64` / `bladebro-darwin-x64`), there is no postinstall script, and standalone binaries plus SHA-256 checksums are on GitHub Releases [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md].
- **Default lane**: CLI when the binary is present — it carries the same five handlers as MCP and is the self-documenting, token-efficient transport [SOURCE: https://github.com/dondai44423/bladebro#the-five-tools] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md].
- **Fallback trigger**: switch to Bladebro MCP (`bladebro mcp`, stdio; `mcpServers.bladebro.args = ["mcp"]`) when browser work must be chained with other Code Mode tools or the binary/doctor is unavailable and an MCP client can launch it via `npx -y bladebro mcp` [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md]. If `command -v bladebro` fails and Code Mode cannot launch it, neither lane is available: report the install command and hand the decision to the operator — installing is an explicit non-goal for this run [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100].

### Lane rule 2 — Chrome DevTools (`bdg` + Code Mode MCP)

- **Detection**: `command -v bdg`, then `bdg --version 2>&1`; health/session check `bdg status`. Install hint if absent: `npm install -g browser-debugger-cli@alpha` [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:61] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:204]. On this host `bdg` is at `/opt/homebrew/bin/bdg` [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:81-84].
- **Default lane**: CLI `bdg` for fast, low-token inspection — full 300+ CDP methods across 53 domains with `--list` / `--describe` / `--search`, HAR export, and shell-scriptable JSON [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:55] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:118-119].
- **Fallback trigger**: MCP via Code Mode when the CLI is unavailable, when work must chain with other MCP tools, for parallel isolated sessions (`--isolated=true`, e.g. `chrome_devtools_1` / `chrome_devtools_2`), complex typed TypeScript automation, or type-safe invocation [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:63-65] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:106-112]. Confirm registration with `cat .utcp_config.json | jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))'` [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:92-96]. Costs to weigh: higher token cost, Code Mode dependency, and a CDP subset versus the CLI's full surface [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:114-119]. Signed-in browser work is a special case: `chrome_devtools_live` (`chrome-devtools-mcp --autoConnect`) is the fallback for work an isolated instance cannot do, with Aside the default owner [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:84-90].

### Lane rule 3 — Aside (CLI, two sub-lanes; MCP composition fallback)

- **Detection** — preflight always, in order: `command -v aside` → `aside --version 2>&1` → `aside --help 2>&1` [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:67-73]. On this host `aside` is at `/Users/michelkerkmeester/.local/bin/aside` [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:81-84]. If absent, report the official macOS-only install command and let the operator decide — never install implicitly [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:75].
- **Default lane**: CLI with two sub-lanes — `aside "<prompt>"` / `aside exec` for outcome-oriented, approval-gated agent tasks; `aside repl "<JavaScript>"` for deterministic, evidence-friendly steps (tab, snapshot, screenshot) [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:53-63].
- **Fallback trigger**: composition with other Code Mode tools, or a capability that exists only on the discovered MCP surface → `aside mcp` (local stdio process) via Code Mode, callable `aside.aside_repl(args)` [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:55] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:93-105]. Rediscover the inventory every session (`tools.listChanged: true`; one `repl` tool is version-pinned evidence, not a contract), never pass `--account` to `aside mcp` or `aside repl`, and close the stdio process in `try/finally` because there is no public `daemon`/`status`/`stop` command [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:100-104] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:118-122].

### Cross-mode findings

1. The three packets share one policy — CLI first, MCP via Code Mode for composition — so the hub can express one uniform `laneRule` shape with per-mode detection and fallback fields [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:3] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:3] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md].
2. Bladebro's CLI and MCP reuse the same five handlers, so its fallback is **transport-driven, not capability-driven** — unlike Chrome DevTools, where MCP is explicitly a CDP subset and lacks self-documenting `--list`/`--describe` [SOURCE: https://github.com/dondai44423/bladebro#the-five-tools] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:114-119].
3. Signed-in work is already cross-mode-routed rather than mode-local: Aside is the default owner, Chrome's `--autoConnect` live instance is its fallback, and Bladebro offers a third mechanism (`rb on`, attach/import, injection off) that KQ8 must place [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:86-90] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:28].
4. Detection output is version-pinned fixture evidence, not a permanent contract: re-capture `--help`/inventory per session, never freeze flags from memory, keep captures out of the repository, and redact cookie/credential values [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:75] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:130-135].

## Questions Answered

- **KQ2 — answered.** Three lane rules, each with a detection command and a fallback trigger, plus four cross-mode findings. Bar checked against [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:69].

## Questions Remaining

7 questions: KQ3 (hub contract), KQ4 (blast radius), KQ5 (naming), KQ6 (macOS verification), KQ7 (security), KQ8 (Aside overlap); KQ1's capability matrix is drafted but the registry does not yet mark it resolved.

## Ruled Out

- No new directions ruled out this iteration. The two iteration-1 BLOCKED directions (broad Bladebro web search; live `bladebro` probes) were not retried.

## Dead Ends

None. The docs list endpoint exposed `docs/setup.md` directly, so no broader search was needed.

## Edge Cases

- **Ambiguous input**: "CLI" could mean any helper script; selected each mode's primary binary and stated the MCP registration form explicitly.
- **Contradictory evidence**: none new. Iteration 1's Lighthouse contradiction (router intent vs no catalog feature) remains open.
- **Missing dependencies**: `bladebro` is absent from PATH and install is a non-goal, so its detection and fallback rest on pinned upstream `setup.md` rather than a live probe.
- **Partial success**: none — all planned local sections and the upstream setup doc were read.

## Sources Consulted

- https://api.github.com/repos/dondai44423/bladebro/contents/docs
- https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md (fetched 2026-11-21; v4.8.2 pin carried from iteration 1)
- https://github.com/dondai44423/bladebro#the-five-tools
- https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:3,55,61,63-65,84-96,106-123,196-212
- .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:3,44,53-75,77-122,126-142,165-169,186
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:62-100
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-001.md:28,82-85

## Assessment

- New information ratio: 1.0 — all seven findings are new lane-rule conclusions; none duplicate iteration 1's capability findings.
- Questions addressed: KQ2. Questions answered: KQ2.

## Reflection

- **Worked**: the packets' "Lane Comparison" and "Preflight" sections are line-addressable and already contain detection commands and fallback triggers, so no broad re-reading was needed.
- **Did not work**: nothing failed; the only constraint was the absent `bladebro` binary, which upstream `setup.md` covered.
- **Next adjustment**: carry the three detection/fallback pairs into KQ3's `mode-registry.json` / `hub-router.json` shapes and check them against `mcp-tooling`'s actual files.

## Recommended Next Focus

KQ3: read `mcp-tooling`'s `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json` and `leaf-manifest.json`, then propose the `mcp-browser-use` contract shapes (routingClass and packetKind per mode) checked field-by-field against those files, reusing the KQ2 lane fields as the router's per-mode detection/fallback entries.
