# Iteration 6: KQ6 macOS verification step list for Bladebro

## Focus

Produce a macOS verification step list for Bladebro: install → live **agent-browser** probe → live **real-browser** probe, each step with its expected output and its rollback. Interpretation (edge case): "verify" means *author the runnable plan*, not execute it — installing Bladebro is an explicit non-goal and an operator stop-for-yes owned by phase 006 [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/spec.md:45-46]. "Agent-browser" and "real-browser" are Bladebro's own documented modes — the **Agent browser** (Bladebro-owned profile) and **Your browser** (`rb`, real-browser mode) [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md]. The iteration-1 BLOCKED direction "live `bladebro` probes" was respected: no binary was installed and no live probe was run; all Bladebro claims are pinned to **v4.8.2**, published 2026-11-20T16:33:56Z, read 2026-11-21, still the latest release (re-confirmed via the releases API this iteration) [SOURCE: https://api.github.com/repos/dondai44423/bladebro/releases/latest].

## Actions Taken

1. Read state: config (iteration 6, sessionId `2026-11-21T08:29:48.000Z`, `progressiveSynthesis: true`, budget 24 calls), state JSONL (5 prior iteration records, iteration_start for 6 present), strategy (KQ6 next focus; "live `bladebro` probes" BLOCKED), findings registry (KQ1-KQ5 answered/resolved; KQ6-KQ8 open).
2. Verified packet-local write boundary: `iterations/iteration-006.md` and `deltas/iter-006.jsonl` absent, `research/research.md` present, no reducer-owned file scheduled for write.
3. Read the research charter's KQ6 "answered means" bar [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:73], the 006-verification dependency/REQ-001 [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/spec.md:45-46,126], and phase KQ5/KQ6 synthesis slots [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:95,109].
4. Fetched upstream `docs/setup.md`, `docs/tools.md`, `docs/browser-modes.md` and `docs/configuration.md` (the attach/lane docs named by `tools.md`), re-used the iteration-002 setup capture, and re-confirmed the v4.8.2 pin plus macOS asset digests from the releases API.

## Findings

### Finding 1 — The step list ( answers KQ6's "answered means" bar )

Each row is one step with its command, expected output and rollback. All commands are Bladebro v4.8.2 CLI syntax fetched 2026-11-21; re-verify flags against the installed binary because upstream ships fast [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md].

| # | Phase | Step / command | Expected output | Rollback |
|---|-------|----------------|-----------------|----------|
| 1 | Preflight | `command -v bladebro \|\| echo absent` | `absent` on this host today [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:81-84] — establishes install is needed | none (read-only) |
| 2 | Preflight | `node --version`; confirm a Chromium-family browser is installed | Node ≥ 14 for the npm launcher; a Chrome/Chromium binary for either probe lane [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md] | none (read-only) |
| 3 | Install (operator yes) | `npm install -g bladebro` — leave optional dependencies enabled, no postinstall script [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md] | global package plus native `bladebro-darwin-arm64` (Apple Silicon) or `bladebro-darwin-x64` (Intel) installed | `npm uninstall -g bladebro` [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/spec.md:46] |
| 4 | Install verify | `bladebro doctor` | health check passes; prints the resolved data root (`~/.local/state/blade` or legacy `~/.blade` on macOS) and the discovered browser [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/configuration.md] | if no browser found, set `CHROME_PATH` or install a Chromium-family browser, then re-run doctor [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/configuration.md] |
| 5 | Pin evidence | `bladebro --version`; record read date | `4.8.2`; asset SHA-256 arm64 `sha256:7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8`, x64 `sha256:d839f5f8a8bed8f616e68029350b1c36f8bc12ee2a16deb32b6f7df93a5a36c3` from the v4.8.2 release [SOURCE: https://api.github.com/repos/dondai44423/bladebro/releases/latest] | none (read-only); standalone path: verify a downloaded binary with `shasum -a 256 -c <asset>.sha256` before use and `bladebro --rollback` only if the standalone updater was used [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md] |
| 6 | MCP lane probe | register `mcpServers.bladebro = { "command":"bladebro", "args":["mcp"] }` (or `npx -y bladebro mcp` without global install), then restart the client | `mcp__bladebro__act/see/state/run/vision` appear from the binary's MCP schema [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md] | remove the `mcpServers.bladebro` entry and restart the client |
| 7 | Agent-browser probe | `bladebro see content https://example.com --json` | main text of the page; JSON envelope `{ok, is_error, text}`, exit code 0 (1 = execution failure, 2 = usage error) [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md] | `bladebro stop` shuts down the owned daemon/browser [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md] |
| 8 | Agent-browser probe | `bladebro see model --json` then `bladebro act click --text '<unique text>'` | controls with refs; the click is accepted and dispatched once, exit 0 [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md] | `bladebro stop`; if a mutation's outcome is unknown after disconnect, inspect the destination before re-issuing [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md] |
| 9 | Agent-browser probe | `bladebro vision --marks --json` | PNG saved with an `image_path` and interactive marks [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md] | `bladebro stop` |
| 10 | Agent-browser probe | `bladebro state tabs`, then optionally `bladebro run @steps.json` | tab list; for a plan, `{"status":"completed"}` with one-based step outcomes (or `"stopped"`) [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md] | `bladebro stop`; for isolation set `BLADE_HOME` or `BLADE_FRESH=1` before launch so no state lands in the ordinary profile [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] |
| 11 | Real-browser probe | `bladebro rb status --json`; `bladebro rb use <id>`; `bladebro rb profile <key>` | current lane/selection and live state; chosen Chromium-family browser and profile selected [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] | `bladebro rb off` returns to the agent browser [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] |
| 12 | Real-browser probe | `bladebro rb on` — on macOS use mode `clone` (or default `auto`, which imports a clone when no live debug endpoint exists) | real-browser mode active on the host display; page injection disabled; the five tools and element refs still work [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] | `bladebro rb off` (switch back); `bladebro rb forget` removes the imported clone [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] |
| 13 | Real-browser probe | repeat `bladebro see content <page>` + `bladebro see model --json` while in real mode | perception/refs/actions available without the injection layer — this is the real-browser probe's pass condition [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] | `bladebro rb pause` blocks input/navigation/downloads/tabs while reads and eval stay available; `bladebro rb resume` re-enables [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md] |
| 14 | Teardown | `bladebro rb off`; `bladebro stop`; after operator approval `npm uninstall -g bladebro` and remove the data root reported by doctor (`~/.local/state/blade` / `~/.blade`) | lane back to agent browser, daemon stopped, package and profile removed; record the run result in the 006 playbook | re-install via step 3 and re-run steps 4-13; do not delete the data root before confirming no needed named sessions remain [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/configuration.md] |

The two probe pass conditions map directly to 006's REQ-001 ("an agent-browser probe and a real-browser probe with their output"): steps 7-10 are the agent-browser probe, steps 11-13 the real-browser probe [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/spec.md:126].

### Finding 2 — The two lanes are the same five tools, so the probe script is reusable

All browser modes expose the same five tools; the only difference is lane selection and the injection layer, which real-browser mode disables [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md]. This means the agent-browser and real-browser probe steps share commands 7-10/13 and differ only in the `rb on` selection (step 12) — a single recorded playbook covers both.

### Finding 3 — macOS real-browser mode must avoid the default Chrome profile

`rb mode profile` launches on the live profile and requires closing the browser first; branded Chrome 136+ refuses remote debugging on its default data directory. `clone` imports a copy (source stays open, auto-refreshes on newer logins/cookies/storage) and `attach` connects to a caller-owned debug endpoint and leaves the browser open on detach [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md]. The step list therefore defaults to `clone`/`auto` and reserves `attach` for the leave-open case.

### Finding 4 — Isolation and cleanup are built into the plan

The agent browser owns a dedicated profile that persists across orderly shutdowns; `BLADE_HOME` overrides the data root and `BLADE_FRESH=1` requests an ephemeral profile, so probes need not pollute the operator's ordinary Bladebro data [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md]. `bladebro stop` shuts down the owned daemon/browser and must be run after changing browser configuration, because a running daemon retains its launch settings [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md] [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/configuration.md].

### Finding 5 — Signed-in real-browser probing is consent-and-profile gated

Real-browser mode can act in authenticated sessions; the operator must choose the profile/account before handing control, and `attach` mode is the way to leave a caller-owned browser open [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md]. Profiles, named sessions and artifacts are private, and detection/capture output must be re-captured per session and redacted for cookie/credential values [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:75,130-135]. These are the exact constraints KQ7 will turn into 004 safety-rule mitigations.

### Finding 6 — Version pin re-confirmed and macOS digests captured

Re-running the releases API this iteration still returns `v4.8.2` as latest (published 2026-11-20T16:33:56Z), so the iteration-1 pin holds for the plan. macOS arm64 asset `bladebro-darwin-arm64` (digest `sha256:7324e502...`) and x64 `bladebro-darwin-x64` (digest `sha256:d839f5f8...`) are published with `.sha256` sidecars [SOURCE: https://api.github.com/repos/dondai44423/bladebro/releases/latest]. The README/setup table names the npm packages `bladebro-darwin-arm64` / `bladebro-darwin-x64` while the release assets also carry `macos-aarch64` / `macos-x86_64` aliases with identical digests — both refer to the same binaries.

## Questions Answered

- **KQ6 — answered.** The 14-step macOS verification plan (preflight → install → pin → MCP probe → agent-browser probe → real-browser probe → teardown), each step with an expected output and a rollback, meets the bar at [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:73] and is synthesized into `research.md` and the 006 per-phase handoff.

## Questions Remaining

- KQ1 (capability matrix drafted but not yet registry-resolved), KQ7 (security risks), KQ8 (Aside overlap decision).

## Ruled Out

- Running any live `bladebro` probe or installing the binary: the iteration-1 BLOCKED "live `bladebro` probes" direction and the charter/install non-goal still apply [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]. The plan is authored from pinned upstream docs, not executed.
- Broad web search for Bladebro facts: still BLOCKED from iteration 1; the official docs were directly reachable via the docs index.

## Dead Ends

None. `docs/browser-modes.md` was named by the already-captured `docs/tools.md`, so the real-browser attach workflow was found without any search.

## Edge Cases

- **Ambiguous input**: "agent-browser"/"real-browser" could be generic terms; selected Bladebro's documented "Agent browser" and "Your browser" (`rb`) modes [SOURCE: https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md]. "Verification" resolved to authoring the step list, not executing it.
- **Contradictory evidence**: none new. Asset naming differs between the setup table (`*-darwin-*`) and release assets (`*-macos-*`), but digests match, so both are recorded rather than collapsed into one claim. Iteration 1's Lighthouse contradiction remains open and is KQ1-owned.
- **Missing dependencies**: `bladebro` is absent from PATH, so expected outputs are pinned upstream evidence rather than observed command results; the plan has an explicit doctor/version verification step (steps 4-5) to confirm them on the installed binary.
- **Partial success**: none — all targeted docs and the releases API were fetched.

## Sources Consulted

- https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/setup.md (fetched 2026-11-21; v4.8.2 pin)
- https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/tools.md (fetched 2026-11-21)
- https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/browser-modes.md (fetched 2026-11-21)
- https://raw.githubusercontent.com/dondai44423/bladebro/main/docs/configuration.md (fetched 2026-11-21)
- https://api.github.com/repos/dondai44423/bladebro/releases/latest (v4.8.2, re-confirmed 2026-11-21)
- https://api.github.com/repos/dondai44423/bladebro/contents/docs (iteration 1-2, reused)
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:73,81-84,98-100
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/spec.md:45-46,126
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:95,109
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-002.md:19-21
- .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:75,130-135

## Assessment

- New information ratio: 0.88 — six findings are new (lane mapping, macOS profile constraint, isolation/cleanup, consent gating, the step list itself, macOS digests); two partially reuse iteration 1-2 setup/pin evidence (install path, MCP registration) now cast as verification steps. (6 + 0.5×2)/8 = 0.875, rounded 0.88.
- Questions addressed: KQ6. Questions answered: KQ6.
- Questions remaining: KQ1 (matrix drafted, not yet registry-resolved), KQ7 (security), KQ8 (Aside overlap).

## Reflection

- **Worked**: `docs/tools.md`'s closing line named `docs/browser-modes.md`, which defines exactly the two probe lanes KQ6 asks for; fetching it plus `configuration.md` turned a guessed "headless vs headed" step list into a cited one with real commands and macOS-specific constraints.
- **Did not work**: nothing failed. The only limitation is that expected outputs are upstream evidence, not observed results, because install is a non-goal — mitigated by explicit doctor/version verification steps in the plan.
- **What I would do differently**: nothing for KQ6; for KQ7, re-use the consent/profile-gating and supply-chain evidence captured here rather than re-fetching the same docs.

## Recommended Next Focus

KQ7: turn the constraints captured here into security findings the 004 safety rules can quote — signed-in profiles (profile/account consent, attach to leave caller-owned browsers open), stealth and site terms of service, and the npm binary supply chain (optional-dependency native packages, no postinstall script, published SHA-256 digests) — each with a concrete mitigation, using the pinned v4.8.2 docs already fetched.
