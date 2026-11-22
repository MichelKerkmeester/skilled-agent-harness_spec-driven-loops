# Iteration 1: KQ1 capability matrix (Bladebro / Chrome DevTools / Aside)

## Focus

Build the cited capability matrix for KQ1 over ten dimensions: page model, actions, console/network logs, HAR, heap/perf trace, Lighthouse, raw CDP, iframes, signed-in profiles and stealth. Interpretation of "Chrome DevTools": the union of the `bdg` CLI and `chrome-devtools-mcp` via Code Mode, as defined by the local `mcp-chrome-devtools` packet. Upstream Bladebro claims are pinned to **v4.8.2** (published 2026-11-20T16:33:56Z, [SOURCE: https://api.github.com/repos/dondai44423/bladebro/releases/latest]), **read 2026-11-21**.

## Actions Taken

1. Read state: config, state JSONL, strategy, findings registry; derived iteration 1 (no prior `type:"iteration"` records), sessionId `2026-11-21T08:29:48.000Z`, `progressiveSynthesis: true`.
2. Read the research charter (`spec.md`) and the `mcp-tooling` hub root `SKILL.md` / `ROUTER.md`.
3. Read both local mode packets' `SKILL.md` and `feature-catalog.md` (Chrome DevTools and Aside).
4. Fetched Bladebro upstream README and `docs/tools.md`, plus the releases/latest API for the version pin.

## Findings

### Capability matrix — KQ1

| Dimension | Bladebro v4.8.2 (read 2026-11-21) | Chrome DevTools (`bdg` + chrome-devtools-mcp) | Aside |
|---|---|---|---|
| **Page model** | `see model` (default: interactive elements + refs), `see content` (main text), `see outline` (headings), `see find` / `see scope`, `see extract` (`auto`/`links`/`forms`/`json`); large reads offload to a paged artifact [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md#see] [SOURCE: https://github.com/dondai44423/bladebro#the-five-tools] | `bdg dom query` and `bdg dom eval`; DOM/Page addressable through CDP; MCP exposes navigation, screenshot, viewport and element tools [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:91-104] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:102-104] | Playwright `page` API in `aside repl`: `page.$eval`, `page.evaluate`, `page.content()`, `snapshot(page)`; no typed `aside dom` subcommand [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:198-201] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:135-136] |
| **Actions** | `act`: navigate/back/forward/reload, click/type/fill/clear/select/press, `read`, hover/scroll/wait, upload/download/pdf, `collect`/`paginate`, `batch`; `run` plans with branches, bounded loops and up to 1000 steps; accepted click dispatches once [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md#act] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md#run] | `bdg <url>` single global session, `bdg dom eval`, `bdg cdp <Method>` (300+ CDP methods), `Emulation.setDeviceMetricsOverride`; MCP clicks, form fill, hover, keyboard, waits, multi-tab management [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:45-57] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:100-104] | Agent-task CLI `aside "<task>"` / `aside exec` / `--session` / `--account`; deterministic `aside repl "<JavaScript>"` (`openTab`); MCP `aside.aside_repl({title, code})` only for composition [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:55-63] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:77-104] |
| **Console / network logs** | `see logs: "console" \| "network" \| "xhr"`; xhr gives method, status, full URL (query intact) and header *names* only, failures first; reads past 30 endpoints or 12 KB offload to an artifact; `clear: true` empties the ring [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md#see] | `bdg console --list` (JSON, pipe to `jq`); `bdg network getCookies` / `bdg cdp Network.setCookie`; MCP console messages [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:117-130] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:207-210] | Reachable only through `page.on('console'\|'request'\|'response')` in the repl, status `skip-valid` (needs a bound session); packet explicitly forbids claiming native dedicated console/network tools [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:145-148] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:139-140] |
| **HAR** | No HAR tool in the five-tool surface; `see logs` is an in-memory ring, not an exported HAR [INFERENCE: based on the five tools in README and the `see logs` contract in tools.md] | `bdg network har <path>` exports a HAR; `examples/performance-baseline.sh` includes a HAR trace [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:127-130] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:174-177] | **Gap — no native HAR**; a HAR-equivalent must be assembled from `page.on` events [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:204] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:141] |
| **Heap / perf trace** | No heap-snapshot or performance-trace tool among the five tools [SOURCE: https://github.com/dondai44423/bladebro#the-five-tools] | Raw CDP covers HeapProfiler/Performance domains among 53; `bdg cdp <Method>` executes any discovered method; `animation-testing.sh` and `performance-baseline.sh` supply traces; SKILL rule 7 names heap snapshots and traces as captures [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:137] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:80-83] | `page.evaluate(performance.getEntriesByType(...))` gives timing only — no heap snapshot and no trace [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:124] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:144] |
| **Lighthouse** | No Lighthouse tool in the five-tool surface [INFERENCE: based on the five tools in README and tools.md] | Listed as a routing intent ("run a Lighthouse or performance trace") but the 30-feature catalog has no dedicated Lighthouse feature — performance work is CDP/script based [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:49-53] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:227-238] | **Gap — no Lighthouse**; external tooling required [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:207] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:145] |
| **Raw CDP** | CDP is internal transport ("Agent or CLI → Bladebro → Chromium DevTools Protocol → live browser"); no raw CDP method passthrough tool is exposed [SOURCE: https://github.com/dondai44423/bladebro#how-it-works] [INFERENCE: five tools contain no CDP command surface] | Full surface: 300+ methods across 53 domains, self-documenting via `--list` / `--describe` / `--search`, then `bdg cdp <Method> '<json>'`; MCP is a 26-tool subset [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:17] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:61-83] | **Gap — no CDP passthrough**; Playwright API only [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:210] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:150] |
| **iframes** | Cross-origin iframe content is explicitly outside the supported tool surface; open shadow roots are covered by selector matching; `see scope` inspects a subtree [SOURCE: https://github.com/dondai44423/bladebro#limits] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md#act] | Reachable through raw CDP DOM/Page frame methods (`bdg cdp`); no dedicated iframe feature in the catalog [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:61-83] [INFERENCE: frame access follows from generic CDP DOM methods] | Via Playwright frame APIs only (Playwright `Page` is fixture-confirmed); no dedicated iframe feature documented [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:116] [INFERENCE: Playwright Page exposes frames, but no packet feature names it] |
| **Signed-in profiles** | "Your browser" mode via `bladebro rb on` uses an installed Chromium-family browser and selected profile; auto mode attaches to a debug endpoint or imports a copy; page injection is off; `rb status`, `rb pause`, `rb off`; named sessions save cookies/storage; warning that actions can affect the account [SOURCE: https://github.com/dondai44423/bladebro#browser-modes] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md#state] | `chrome_devtools_live` runs `chrome-devtools-mcp --autoConnect` against the user's own signed-in Chrome, opens background pages and closes only the page ID it opened; it is a fallback, not the default — isolated instances start logged out [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:84-90] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:163-166] | Requires the installed, signed-in account (macOS only; built-in models fail closed when signed out); `--account` selects a task account, password-manager autofill is a stated benefit; permission modes Read only / Guard / Full; MFA, CAPTCHA, vault unlock and approvals pause tasks [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:21-37] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:109-116] |
| **Stealth** | Explicit "real stealth" claim with anti-detection/stealth topics and a published `STEALTH_BENCH.md` + `stealth-bench-sites.csv` benchmark; real-browser mode disables page injection [SOURCE: https://github.com/dondai44423/bladebro#about] [SOURCE: https://github.com/dondai44423/bladebro#browser-modes] | No stealth or anti-detection feature in the packet; live mode relies on remote debugging at `chrome://inspect/#remote-debugging` [INFERENCE: based on SKILL.md lines 84-90 and the 30-feature catalog with no stealth entry] | No stealth or anti-detection feature; agentic work runs under a signed-in account with permission gates [INFERENCE: based on SKILL.md lines 109-122 and the 18-capability catalog with no stealth entry] |

### Standalone findings

1. Bladebro's upstream version is pinned at **v4.8.2**, published 2026-11-20T16:33:56Z; assets include macOS arm64/x64 binaries with published SHA-256 digests [SOURCE: https://api.github.com/repos/dondai44423/bladebro/releases/latest].
2. Bladebro ships exactly five MCP tools — `act`, `see`, `state`, `run`, `vision` — and the CLI reuses the same handlers, so MCP and CLI capability is symmetric by design [SOURCE: https://github.com/dondai44423/bladebro#the-five-tools] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md].
3. Chrome DevTools is the only one of the three with a genuine raw-CDP and HAR surface; Aside documents those as explicit gaps and Bladebro does not expose them [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:61-83] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:145].
4. Signed-in work is reachable in all three, but by different mechanisms: Bladebro "your browser" attach/copy, Chrome `--autoConnect` live instance (fallback), Aside signed-in account (default) [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:21-37].
5. The "where each stops" boundary: Chrome stops at agentic goal completion; Aside stops at CDP/HAR/stealth/parallel isolation; Bladebro stops at HAR, Lighthouse, heap trace, raw CDP and cross-origin iframes [INFERENCE: cross-product of matrix gaps].
6. Lighthouse is a genuine contradiction to carry forward: the hub router advertises it as Chrome DevTools intent, while the feature catalog has no dedicated Lighthouse feature [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:49-53] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:227-238].

## Questions Answered

- **KQ1 — answered.** The matrix above has all ten required rows with a source or inference marker in every cell, plus a "where each stops" boundary finding.

## Questions Remaining

7 questions: KQ2 (CLI vs Code Mode lane rule), KQ3 (hub contract), KQ4 (blast radius), KQ5 (naming), KQ6 (macOS verification), KQ7 (security), KQ8 (Aside overlap).

## Ruled Out

- Broad web search for Bladebro capability facts: unnecessary once the official README and `docs/tools.md` were reachable.
- Live `bladebro` probes: the binary is absent from PATH and installation is an explicit non-goal; KQ6 owns live verification.

## Dead Ends

None definitive. The GitHub landing page did not render a version number, so the releases API was used to pin v4.8.2.

## Edge Cases

- **Ambiguous input**: "Chrome DevTools" could mean only the CLI or only the MCP server; selected the local packet's union of `bdg` + `chrome-devtools-mcp`, and marked MCP's subset nature in the raw-CDP cell.
- **Contradictory evidence**: Lighthouse is a routing intent but not a catalog feature — both claims are preserved above and the conflict is marked unresolved for a later iteration.
- **Missing dependencies**: `bladebro` absent from PATH, so no live probe; the capability matrix rests on upstream documentation pinned to v4.8.2.
- **Partial success**: none — all planned sources were read.

## Sources Consulted

- https://github.com/dondai44423/bladebro (README, read 2026-11-21)
- https://api.github.com/repos/dondai44423/bladebro/releases/latest
- https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md
- .skilled/skills/mcp-tooling/SKILL.md, .skilled/skills/mcp-tooling/ROUTER.md
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md, feature-catalog/feature-catalog.md
- .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md, feature-catalog/feature-catalog.md

## Assessment

- New information ratio: 1.0 (all 9 findings are first-iteration facts newly gathered from the two packets and pinned upstream; no prior research existed).
- Questions addressed: KQ1. Questions answered: KQ1.

## Reflection

- **Worked**: local feature catalogs give line-addressable capability claims; `docs/tools.md` supplies Bladebro's per-tool surface with exact flags.
- **Did not work**: the GitHub repo landing page omitted the release number; the releases/latest API supplied the pin.
- **Next adjustment**: pin the version on every future upstream fetch, then use the already-captured preflight commands in the two packets to draft the KQ2 lane rules without re-reading whole packets.

## Recommended Next Focus

KQ2: draft one CLI-versus-Code-Mode lane rule per mode (Bladebro, Chrome DevTools, Aside) using the detection commands already captured in the packets — `command -v bladebro` / `bladebro doctor`, `command -v bdg` / `bdg status`, `command -v aside` / `aside --version` — with each mode's fallback trigger and the source lines just read.
