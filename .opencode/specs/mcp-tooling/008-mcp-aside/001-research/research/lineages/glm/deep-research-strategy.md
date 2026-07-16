# Deep Research Strategy - Aside Developer Surface (Lineage: glm)

## 2. TOPIC
Aside browser developer surface for an mcp-tooling skill mode: the Aside CLI command surface and the Aside MCP server (tools, auth, transport, install, session/daemon model) per https://docs.aside.com/help/developers#use-mcp — AI-browser-automation workflows (navigate, DOM inspection, screenshots, console/network capture), contrast with Chrome DevTools bdg patterns, everything needed to author the mcp-aside-devtools packet (CLI-primary + Code Mode MCP fallback) and register an aside UTCP manual in .utcp_config.json.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] q-cli-surface: Full Aside CLI command surface (install, run, session, account, exec, repl, mcp)
- [ ] q-mcp-server: Aside MCP server mechanics (transport, invocation, tool set, auth)
- [ ] q-auth-model: Auth/account model for CLI and MCP (multi-account, providers, sign-in)
- [ ] q-session-daemon: Session/daemon model (aside --session, REPL, lifecycle)
- [ ] q-ai-workflows: AI-browser-automation workflows (navigate, DOM, screenshots, console/network)
- [ ] q-cd-contrast: Contrast with Chrome DevTools bdg patterns (CLI-primary vs MCP)
- [ ] q-utcp-manual: Registering an aside UTCP manual in .utcp_config.json
- [ ] q-skill-packet: Authoring the mcp-aside-devtools packet (CLI-primary + Code Mode MCP fallback)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- This research does NOT implement the skill packet — it produces the evidence needed to author it.
- This research does NOT evaluate Aside's GUI / consumer browser UX beyond what intersects the developer surface.
- This research does NOT cover pricing/subscription economics beyond noting plan-gated model access relevant to auth.
- This research does NOT reverse-engineer undocumented/proprietary Aside internals beyond the public docs.

---

## 5. STOP CONDITIONS
- maxIterations (2) reached (stopPolicy: max-iterations; convergence is telemetry only, broaden angles instead of synthesizing early).
- Public docs surface exhausted with no further authoritative source available.
- Security concern discovered in findings (proprietary code or credentials) — escalate.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] q-cli-surface: Full CLI surface mapped — install (curl), run (`aside "<prompt>"`), session (`--session`), account (`account list/status/use`, `--account`), exec (`-m model`), repl, mcp (iteration 1)
- [x] q-mcp-server: `aside mcp` = MCP server over stdio; mcp.json registration documented; tool set NOT enumerated in public docs (runtime discovery needed) (iteration 1)
- [x] q-auth-model: Multi-account; three provider tiers (Aside built-in needs sign-in / Subscription OAuth / API BYO key) (iteration 1)
- [x] q-session-daemon: Resumable `--session`; account-scoped persistent state; task modes (Default/Incognito) + permission modes (Read-only/Guard/Full-access) (iteration 1)
- [x] q-ai-workflows: Two-tier surface (NL agent + deterministic REPL); navigate/inspect/screenshot/download/multi-step/approval; console/network via REPL not named CLI subcommands (iteration 2)
- [x] q-cd-contrast: Aside = agentic+REPL+account/auth/permissions vs bdg = imperative CDP+local/no-auth; shared CLI-primary+MCP-fallback architecture (iteration 2)
- [x] q-utcp-manual: Exact JSON manual defined — name 'aside', stdio, command 'aside', args ['mcp'], env {}; auth account-based (iteration 2)
- [x] q-skill-packet: Full authoring checklist — SKILL.md + INSTALL_GUIDE + references + scripts/install.sh + UTCP manual + mode-registry.json entry (iteration 2)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Direct fetch of canonical docs.aside.com/help/developers: yielded complete documented CLI command surface in one pass (iteration 1)
- Fetching linked AI-providers/tasks/security pages: enriched auth/session/permission model far beyond the developer page (iteration 1)
- Reusing mcp-chrome-devtools SKILL.md as structural template: made packet authoring checklist concrete and architecture contrast rigorous (iteration 2)
- Reading the real .utcp_config.json: produced an exact drop-in aside manual JSON instead of a hypothetical one (iteration 2)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Public docs do not enumerate the specific MCP tools exposed by `aside mcp` (no tool manifest); tool set must be discovered at runtime via Code Mode discovery (iteration 1)
- Public docs do not name the full REPL function surface beyond `openTab`; exact console/network capture API requires runtime `--help`/discovery (iteration 2)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `npm install -g aside`: Documented installer is a curl script (releases.aside.com/install.sh), not npm (iteration 1, evidence: https://docs.aside.com/help/developers)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
All 8 key questions answered across 2 iterations. Carried-forward gaps (require runtime, not docs):
- aside MCP tool inventory — discover via `search_tools`/`list_tools` against live `aside mcp` (out of research scope; packet prescribes discovery)
- aside REPL full function surface — discover via `aside repl --help` (out of research scope)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[maxIterations (2) reached — stopPolicy: max-iterations. Convergence was telemetry only (rollingAvg 0.825). No early synthesis.] Next operational step (out of research scope): author the mcp-aside-devtools packet from this research, register the aside UTCP manual in .utcp_config.json, add the mode to mcp-tooling/mode-registry.json, and validate against a live `aside mcp` server via Code Mode runtime discovery.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

This is a codebase-scoped target. Relevant pointers gathered from the workspace:

- **Reference sibling skill:** `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` — establishes the CLI-primary + Code Mode MCP fallback pattern the `mcp-aside-devtools` packet must mirror (bdg CLI primary, `chrome-devtools-mcp` via Code Mode fallback, `--isolated=true` parallel instances).
- **UTCP manual registration format:** `.utcp_config.json` — `manual_call_templates[]` entries with `{name, call_template_type:"mcp", config.mcpServers.{name}.{transport:"stdio", command, args, env}}`. Existing manuals: `chrome_devtools_1/2`, `clickup_official`, `figma`, `github`, `gitkraken`, `open_design`, `refero`.
- **mcp-tooling hub:** `.opencode/skills/mcp-tooling/SKILL.md` — parent hub routing to mcp-chrome-devtools + mcp-click-up modes plus mcp-figma transport; the aside packet would register as a new mode under this hub.
- **mcp-code-mode skill:** `.opencode/skills/mcp-code-mode/SKILL.md` — Code Mode orchestration via `call_tool_chain()`, the MCP fallback transport.
- **Chrome DevTools bdg patterns:** `bdg cdp --list/--describe`, `bdg <url>`, `bdg status/stop`, `bdg dom screenshot/query/eval`, `bdg console --list`, `bdg network har` — the contrast baseline for AI-browser-automation workflow comparison.
- **Integration points:** new packet at `.opencode/skills/mcp-tooling/mcp-aside-devtools/`; new UTCP manual entry `aside` in `.utcp_config.json`; registration in mcp-tooling `mode-registry.json`.
- **Constraints:** Aside CLI is installed via curl install script (not npm); MCP server is `aside mcp` over stdio; auth is account-based (Aside account sign-in) plus BYO provider API keys. resource-map.md not present at init.

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 2
- Convergence threshold: 0.05 (telemetry only; stopPolicy = max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle: detached-fanout lineage (new); session fanout-glm-1784196482911-9atmiq
- Current generation: 1
- Started: 2026-07-16T12:08:00Z
