# mcp-refero changelog digest

Skill path: `.opencode/skills/mcp-tooling/mcp-refero/`
Versions covered: v1.0.0.0 (oldest) to v1.1.0.0 (newest). Only two changelog entries exist, so all of them are covered.
Date range: v1.0.0.0 is dated 2026-07-16. v1.1.0.0 carries no release date in its entry.

---

## Per Version, Newest First

### v1.1.0.0 (`v1.1.0.0.md`)

A documentation-only conformance pass on `README.md` from the skill-readme refinement packet. The README was rewritten purpose-first on the refined standalone template: a one-line pitch blockquote, an AT A GLANCE table, a problem-first OVERVIEW, then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION and RELATED DOCUMENTS, with numbered ALL-CAPS H2 headers and `---` dividers. A new capability table named the Refero Tool Surface now lists all eight tools across the three layers inside OVERVIEW. The README version field moved from `1.0.0.0` to `1.1.0.0`, and a stale claim in its VERIFICATION section was corrected: the section had told readers to expect `version: 1.1.0.0` in the SKILL.md frontmatter, and it now documents `version: 1.0.0.0`, the value the file actually carries. Prose was cleared of em dashes, semicolons and Oxford commas. Nothing else moved: `SKILL.md` stayed at `1.0.0.0`, no reference set, feature-catalog card or playbook scenario changed, and the `v1.0.0.0` changelog entry stayed byte-identical (`v1.1.0.0.md`).

### v1.0.0.0 (`v1.0.0.0.md`)

First release, dated 2026-07-16. It delivered `mcp-refero` as the read-only Refero design-reference transport inside the `mcp-tooling` hub, declared `packetKind: transport` and `mutatesWorkspace: false`. `SKILL.md` defined the activation signals, a guarded five-intent router, discovery-first execution, a styles to screens to flows research funnel, access limits and read-only safety rules. Runtime authority was minimal: Read, Bash, Grep, Glob and Code Mode calls allowed, with Write, Edit and Task forbidden. The transport reused the already-registered `refero` Code Mode manual, which launches `npx -y mcp-remote https://api.refero.design/mcp`, and kept that registered object verify-only rather than editing `.utcp_config.json` or adding a second manual. The release documented eight read-only tools across three layers: style search and detail, screen search plus detail plus similarity plus image retrieval, and flow search and detail. A 2026-07-16 discovery fixture confirmed all eight registry names pre-authentication in the dotted doubled form such as `refero.refero.refero_search_styles`, with TypeScript callables such as `refero.refero_refero_search_styles(args)`, and per-session `list_tools` plus `tool_info` re-confirmation stayed mandatory with fail-closed behavior on drift. Schema facts recorded: `response_format?: "json" | "md"` defaulting to `"md"` on style and screen search, a required `platform: "ios" | "web"` on screen search, and `refero_get_screen_image` accepting no `response_format`. Screen identifiers are UUIDs while flow identifiers are numeric. On access, the entry states the Free plan has no MCP access at all and Pro is the first supported tier, carrying a published quota of 8,000 tool calls per month, with unauthenticated calls returning HTTP 401. The local `mcp-remote` bridge prefers HTTP, uses browser OAuth on port 3334 and stores operator-owned auth state under `~/.mcp-auth`, requiring Node.js 18 or newer, with the project on Node 24 and an observed Node 25 crash flagged for diagnosis. The packet also shipped a `feature-catalog/` with a root inventory, three domain overviews and one leaf per tool, three worked `examples/`, a nine-scenario manual testing playbook, read-only `scripts/install.sh` and `scripts/doctor.sh` (whose healthy unauthenticated probe result is HTTP 401), three `references/` documents (`tool-surface.md`, `mcp-wiring.md`, `troubleshooting.md`), an `assets/utcp-refero-manual.md` snapshot, a `README.md` and an `INSTALL-GUIDE.md`. Design authority was explicitly withheld: any design-affecting use loads `sk-design` first, and the transport issues no taste, accessibility or readiness verdicts (`v1.0.0.0.md`).

No rename, removal, moved path, changed default or breaking change is recorded in either entry. Both are additive or documentation-only.

---

## Facts The V4 Draft Gets Wrong Or Misses

Comparison against `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`.

- Nothing in the draft contradicts these entries. Draft line 385 describes `mcp-refero` as "a read-only design-reference transport that searches styles, screens and flows", which matches `v1.0.0.0.md` exactly. Draft line 391, that the design transports defer to the design-judgment skill for taste, matches the Boundaries section of `v1.0.0.0.md`.
- MISSING: the access gate. `v1.0.0.0.md` states the Free plan has no MCP access at all and that Pro is the first supported tier with a published quota of 8,000 tool calls per month. The draft mentions no plan requirement or quota for `mcp-refero` anywhere, so a reader on a Free plan learns of the wall only after installing.
- MISSING: the setup prerequisites. `v1.0.0.0.md` records the `npx -y mcp-remote https://api.refero.design/mcp` bridge, browser OAuth on port 3334, operator-owned auth state under `~/.mcp-auth` and a Node.js 18 or newer floor with an observed Node 25 crash. The draft says nothing about any of it.
- MISSING: the doubled-prefix naming trap. `v1.0.0.0.md` documents that Refero tools resolve as `refero.refero_refero_<tool>` inside Code Mode, confirmed by the 2026-07-16 discovery fixture. This is the single most likely first-call failure for a user and the draft never mentions it.
- MISSING: the size of the surface. `v1.0.0.0.md` documents eight read-only tools across three layers, and `v1.1.0.0.md` adds a capability table naming all eight. The draft gives only the three-word "styles, screens and flows" summary with no tool count.
- MISSING: v1.1.0.0 entirely. The README conformance release described in `v1.1.0.0.md` has no representation in the draft. That is defensible for a documentation-only pass, but note that the version divergence it locked in is real and reader-visible: `README.md` is at 1.1.0.0 while `SKILL.md` is still at 1.0.0.0.
- NOT VERIFIABLE FROM THESE ENTRIES: draft line 288 says Refero styles "were pulled into a local token library after a 50-style pilot came back clean". Neither `v1.0.0.0.md` nor `v1.1.0.0.md` mentions a local token library, a pilot or a style database. That claim belongs to a different packet and cannot be confirmed or refuted here.

---

## Current Version And Identity

- Version in `SKILL.md` frontmatter: `1.0.0.0`. Note that `README.md` was moved to `1.1.0.0` by `v1.1.0.0.md` while `SKILL.md` was deliberately left at `1.0.0.0`, so the newest changelog entry number does not match the skill version.
- Identity: a MODE, specifically a transport mode. There is no `mode-registry.json` at `.opencode/skills/mcp-tooling/mcp-refero/` (the skill root holds no JSON files at all). Its parent `.opencode/skills/mcp-tooling/mode-registry.json` carries the entry, listing `mcp-refero` in the `transports` array at line 22 and defining it at lines 172 to 192 with `packetKind: "transport"`, `backendKind: "code-mode-remote-mcp"`, `packet: "mcp-refero"` and `packetSkillName: "mcp-refero"`. Its allowed tool surface is Read, Bash, Grep, Glob and `mcp__code_mode__call_tool_chain`, with Write, Edit and Task forbidden, matching the `allowed-tools` line in the SKILL.md frontmatter.
