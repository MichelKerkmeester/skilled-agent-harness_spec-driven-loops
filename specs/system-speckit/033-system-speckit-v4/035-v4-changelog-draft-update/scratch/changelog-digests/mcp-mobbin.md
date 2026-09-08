# mcp-mobbin changelog digest

Skill path: `.opencode/skills/mcp-tooling/mcp-mobbin/` · Versions covered: v1.0.0.0 to v1.1.0.0 (all entries in the changelog folder, only two exist) · Date range: 2026-07-16 to 2026-08-04.

---

## Per-version digest, newest first

### v1.1.0.0 (released 2026-08-04, `changelog/v1.1.0.0.md`)

A README-only rewrite. Per `v1.1.0.0.md` the README moved from a tabular reference card to the narrative purpose-first shape of the refined skill README template, using the `mcp-obsidian` README as the pilot model. It gained a one-line pitch blockquote under the H1, a problem-first OVERVIEW section titled Why This Skill Exists, and a capability section called The Three-Tool Search Surface with one table row per live-discovered tool. The body was rewritten as numbered ALL-CAPS H2 sections with dividers and AT A GLANCE first, passing the Human Voice Rules greps for zero em dashes, zero semicolons, zero Oxford commas and zero banned words. The README version field went from 1.0.0.0 to 1.1.0.0, and the VERIFICATION section was corrected to state the actual version field carried by the live SKILL.md. The entry explicitly records that nothing else changed: the three-tool surface, the registered wiring state, the browser-OAuth model and the `sk-design` judgment boundary all stayed as documented, and no SKILL.md, no other skill README, no template and no vault file was touched. No rename, no removal, no moved path, no changed default and no breaking change.

### v1.0.0.0 (released 2026-07-16, `changelog/v1.0.0.0.md`)

First release. Per `v1.0.0.0.md` the packet shipped `mcp-mobbin` as a read-only Mobbin app-design research transport inside the `mcp-tooling` hub, declared `packetKind: transport` and `mutatesWorkspace: false`. It reaches the hosted Mobbin service through the registered `mobbin` Code Mode manual, which launches `npx -y mcp-remote https://api.mobbin.com/mcp` over stdio. A pre-auth discovery fixture dated 2026-07-16 recorded three read-only tools rather than the one public tool the earlier research assumed: `mobbin.mobbin.search_screens`, `mobbin.mobbin.search_flows` and `mobbin.mobbin.search_sections`, callable in TypeScript as `mobbin.mobbin_search_screens(...)` and its siblings. Every session still has to run `list_tools` and `tool_info` before its first call and fail closed on drift. `search_screens` takes a `mode` of `deep`, `standard` or `fast`, plus `exclude_screen_ids` and `image_format`. Access is documented for Pro, Team and Enterprise plans only, authentication is browser OAuth through DCR and PKCE S256 with no API key or auth environment variable anywhere, and the published rate contract is 60 requests per 60 seconds per user with `Retry-After` honored on HTTP 429. Runtime authority is Read, Bash, Grep, Glob and Code Mode calls, with Write, Edit and Task forbidden. The release also carried a feature catalog with app, screen, flow and element intent pages, three worked examples, three references (`tool-surface.md`, `mcp-wiring.md`, `troubleshooting.md`), a preserved manual reference shape in `assets/`, read-only `scripts/install.sh` and `scripts/doctor.sh`, and a nine-scenario manual testing playbook. Design-affecting use must load `sk-design` first, since the transport issues no taste, accessibility or readiness verdicts. Authenticated call results, OAuth completion and inline-image fidelity were all left labeled Inferred or UNKNOWN pending an operator browser round trip on a paid account.

Flags for this version, per `v1.0.0.0.md`:

- RENAME: within `search_screens`, `fast` is documented as a deprecated alias for `standard`, so the two mode names resolve to the same behavior.
- No removal, no moved path, no changed default and no breaking change is recorded, because this is the first release.

---

## Facts the v4 draft gets wrong or misses

- The draft's only mention of the skill is one bullet at line 386 of `CHANGELOG-v4.0.0.0.md`, reading "a read-only transport for design research". `v1.0.0.0.md` records a concrete three-tool surface (`search_screens`, `search_flows`, `search_sections`) confirmed by a dated live-discovery fixture, and `v1.1.0.0.md` names that surface again as The Three-Tool Search Surface. The draft names none of it.
- The draft omits the access gate. `v1.0.0.0.md` states Mobbin MCP is available on Pro, Team and Enterprise plans only, and that authentication is browser OAuth with no API key or auth environment variable. That is a hard prerequisite a reader of line 386 cannot infer.
- The draft omits the published rate contract of 60 requests per 60 seconds per user recorded in `v1.0.0.0.md`.
- The draft omits the honesty posture. `v1.0.0.0.md` states that authenticated calls, OAuth completion, authenticated response shapes and image fidelity were left Inferred or UNKNOWN pending an operator round trip on a paid account. The draft presents the transport as plainly delivered.
- Draft line 393 says the design transports "defer to the design-judgment skill for taste". That is directionally right but coarser than the entries. `v1.0.0.0.md` routes judgment to `sk-design` and separately pairs with `sk-design-md-generator` when a measured Style Reference of extracted tokens is wanted. The draft collapses the two.
- The draft carries nothing at all from `v1.1.0.0.md`. The 2026-08-04 README rewrite to the narrative purpose-first template, with the `mcp-obsidian` pilot as the model, is absent from the draft.

---

## Current version and identity

- SKILL.md frontmatter version: `1.0.0.0` (`.opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md`, frontmatter `version: 1.0.0.0`).
- Version drift worth flagging: the newest changelog entry is `v1.1.0.0.md` and `README.md` line 10 carries `version: 1.1.0.0`, while SKILL.md still carries `1.0.0.0`. `v1.1.0.0.md` is internally consistent with this, since it states the release changed only the README and left SKILL.md untouched.
- Identity: a MODE, not a hub and not standalone. `mcp-mobbin/` holds no `mode-registry.json` of its own, and its parent `.opencode/skills/mcp-tooling/` holds `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`. That registry lists `mcp-mobbin` as one of the hub's design transports, with `packetKind: transport`, `mutatesWorkspace: false`, `routingClass: "metadata"` and `backendKind: code-mode-remote-mcp`, reached through the registered `mobbin` manual.
