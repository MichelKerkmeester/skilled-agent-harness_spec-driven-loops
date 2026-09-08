# mcp-click-up changelog digest

Skill path: `.opencode/skills/mcp-tooling/mcp-click-up/`
Versions covered: v1.0.0.0 through v1.1.0.0 (all 3 entries in `changelog/`, fewer than 10 exist)
Date range: 2026-05-31 to 2026-07-16 (v1.1.0.0 carries no release date in its frontmatter or body)

---

## Per-version digest, newest first

### v1.1.0.0 (`v1.1.0.0.md`, no date)

A README-only rewrite. `README.md` was rebuilt on the refined skill README template from the skill-readme-refinement packet so the mode matches the mcp-obsidian pilot standard and the mcp-tooling hub carries one consistent README set across its modes. The new shape is a one-line pitch blockquote under the H1, an AT A GLANCE table first, a problem-first OVERVIEW that names the reader's situation before any feature list, and a ClickUp Operation Layer capability table covering task statuses, time tracking, documents, goals and OKRs, plus offline task reads. The body was rewritten to the Human Voice Rules with zero em dashes, zero semicolons, zero Oxford commas and zero banned words, including inside table cells and code blocks, and the cupt health check command was switched from a semicolon-based Python one-liner to `python3 -m json.tool`. RENAME: the RELATED DOCUMENTS and FAQ entries were repointed from the unresolvable `references/INSTALL-GUIDE.md` target to `INSTALL-GUIDE.md` at the packet root, and RELATED DOCUMENTS gained links to `feature-catalog/FEATURE-CATALOG.md` and `manual-testing-playbook/manual-testing-playbook.md`. The entry states the README frontmatter version moved `1.0.0.7` to `1.1.0.0` and that no `SKILL.md`, reference, script, feature catalog, playbook or template file was touched, so no routing behavior, command surface or install path changed.

### v1.0.1.0 (`v1.0.1.0.md`, released 2026-07-16)

Added a top-level `INSTALL-GUIDE.md` at the packet root so mcp-click-up reached install-guide parity with the sibling packets `mcp-chrome-devtools` and `mcp-figma`, which already carried a front door. The front door promotes and reorganizes the content of `references/INSTALL-GUIDE.md` into an AI-first install block, a component and architecture overview, prerequisites and cupt install, authentication by token and by OAuth, optional Code Mode MCP configuration, verification, troubleshooting and a resources table, with the entry stating that every command and configuration block derives from existing files rather than being invented. The link direction was a deliberate decision: `references/INSTALL-GUIDE.md` keeps its full content and stays the smart router's INSTALL-intent target under `SKILL.md` section 2 RESOURCE_MAP, so every inbound link from `SKILL.md`, `README.md`, `examples/README.md`, both `mcp-servers` READMEs, `scripts/doctor.sh` and `references/mcp-tools.md` still resolves, and the reference simply gained a pointer note to the new front door. `SKILL.md` was bumped to 1.0.1.0 and its section 8 links the front door. The entry calls the change documentation-only with no install path, script or routing behavior changed, so nothing here is breaking.

### v1.0.0.0 (`v1.0.0.0.md`, released 2026-05-31)

The initial release. It shipped an 8-section `SKILL.md` with operation-based routing pseudocode covering activation triggers and anti-patterns, INTENT_SIGNALS scoring with a RESOURCE_MAP and a `route_clickup_resources()` routine, the cupt CLI primary path against the official ClickUp MCP secondary path, and the agent invariants for status resolution, dry-run, `--json` and empty-queue handling. Installation came as `scripts/install.sh`, which detects Python 3.8 or newer, installs cupt through pipx with a pip fallback, verifies with `cupt --version` and prints the official ClickUp MCP config JSON without writing any file, plus an `INSTALL-GUIDE.md` with validation checkpoints. Three references landed: a complete cupt command reference, a guide to the official ClickUp MCP's 46 tools with Code Mode `call_tool_chain()` invocation patterns, and a troubleshooting guide. Two example scripts covered the tagged work queue and timer management, and a manual testing playbook shipped 5 phases across 16 test files. The recorded architecture decisions are cupt as the primary CLI, the official MCP as secondary, operation-based routing because the two surfaces differ, pipx preferred over pip for isolation, and printing the MCP config snippet rather than auto-modifying `opencode.json`. Known limitations recorded at the time were a client-side and therefore slow cupt team filter, an MCP that needs Node and npx for `@clickup/mcp-server`, and cupt being a community tool whose future maintenance depends on its author. An explicit anti-pattern is that this is not `@krodak/clickup-cli`.

---

## Facts the v4 draft gets wrong or misses

Compared against `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`.

- The draft describes the hub's members purely as MCP bridges (line 36 and line 377), but `v1.0.0.0.md` records that ClickUp is a two-path mode where the **cupt CLI is the primary surface** and the official ClickUp MCP is only the secondary path for documents, goals and bulk work. A reader of the draft would not learn that daily ClickUp work runs through a Python CLI installed by pipx rather than through MCP.
- Draft line 377 credits the hub as a whole with shipping "install front doors". `v1.0.1.0.md` shows the mcp-click-up front door was added on 2026-07-16 specifically to reach parity with `mcp-chrome-devtools` and `mcp-figma`, which already had one, so the front doors arrived per mode over time rather than as a single hub-wide delivery.
- The draft never mentions the README standardization pass. `v1.1.0.0.md` records that mode READMEs were rewritten onto a refined template against the mcp-obsidian pilot so the hub carries one consistent README set, which is a hub-level consistency change the draft's MCP Tooling section omits.
- The draft records a path move only for `mcp-figma` (lines 403 and 444). Nothing in the three mcp-click-up entries records a path move, rename or removal for this mode, so the draft is not wrong to omit one.
- Version skew worth checking before the draft claims a version: `v1.1.0.0.md` bumps only the **README** frontmatter to 1.1.0.0 and explicitly leaves `SKILL.md` untouched, so `SKILL.md` still reads 1.0.1.0 while the changelog's newest entry is 1.1.0.0. The two files disagree by design, not by error, but any draft sentence naming a single mcp-click-up version needs to say which file it means.
- No BREAKING change, removal or changed default appears in any of the three entries, so there is nothing in this mode the draft's upgrade or "repoint what moved" guidance (line 444) needs to add.

---

## Current version and identity

- `SKILL.md` frontmatter version: **1.0.1.0** (`name: mcp-click-up`).
- `README.md` frontmatter version: **1.1.0.0**, matching the newest changelog entry.
- Identity: **a mode, not a hub and not standalone.** The skill root `.opencode/skills/mcp-tooling/mcp-click-up/` has no `mode-registry.json`, no `hub-router.json`, no `description.json` and no `graph-metadata.json`. Its parent `.opencode/skills/mcp-tooling/` carries `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` and `ROUTER.md`, and that registry lists mcp-click-up with `"workflowMode": "mcp-click-up"` and `"packet": "mcp-click-up"`, classed as a workflow packet rather than a transport packet.
