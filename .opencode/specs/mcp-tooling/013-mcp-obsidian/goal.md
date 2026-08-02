# Goal Prompt — mcp-obsidian (Obsidian CLI + MCP mode)

> Paste this as the session goal. Updated 2026-08-02 (Phase 1 + research.md done; Phase 9 authored; implementation reset to cli-codex TERRA/LUNA only).

---

**GOAL:** Ship `mcp-obsidian` — a new workflow mode of the `mcp-tooling` parent hub that drives Obsidian from BOTH a terminal CLI and an MCP tool, exactly like `mcp-click-up`. Outcome: an Obsidian vault operable from the terminal AND from agent sessions inside this framework.

**SPEC:** `.opencode/specs/mcp-tooling/013-mcp-obsidian/` (phase parent, **9 children**). Resume with `/speckit:resume mcp-tooling/013-mcp-obsidian`.

**PROGRESS:** Phases 1–7 **DONE** + Phase 9 authored. 61-file package built by TERRA+LUNA; registered across 6 hub files + `.utcp_config.json` + `.env.example` + repo README; leaf-manifest regenerated (also cleared a pre-existing mcp-click-up dangling ref); `parent-skill-check` **exit 0**; `route-validate` **PASS**; **advisor-discoverable** (index rebuilt — obsidian query → `mcp-tooling` top result; also fixed a session-wide `better-sqlite3` ABI outage). Runtime routes obsidian via the **legacy** path. REMAINING (need user/env): compiled-routing re-mint (fragile build-harness — deferred, legacy serves); Phase 8 live smokes — CLI needs `brew trust yakitrak/yakitrak` (or Go build); MCP needs Local REST API plugin + token in a running vault.

**DONE LOOKS LIKE:** a mode at `.opencode/skills/mcp-tooling/mcp-obsidian/` mirroring `mcp-click-up`'s tree — `mcp-servers/{obsidian-cli,obsidian-mcp}` (install pointers, NOT vendored code), `references/`, `scripts/{install,doctor}.sh`, `examples/`, `feature-catalog/`, `manual-testing-playbook/`, `SKILL.md`/`README.md`/`INSTALL-GUIDE.md`/`changelog/`. Registered across the 5 hub files + `.utcp_config.json` + `.env.example` + repo `README.md`, advisor-discoverable, verified end-to-end.

**PHASES:** 1 deep-research (DONE) · 2 tool-selection-and-scaffold · 3 cli-tool-integration · 4 mcp-server-integration · 5 skill-authoring · 6 feature-catalog-and-playbook · 7 hub-registration-and-advisor · 8 verification-and-closeout · 9 community-plugin-support (additive: file-layer knowledge for obsidian-flat-financing/Beancount, obsidian-tables/`.table.md` JSON, obsidian42-BRAT installer — `references/`+`assets/` already authored; Phase 5 folds them into the skill).

**LOCKED DECISIONS:** packet `013-mcp-obsidian`; classification = workflow mode (`cli-plus-mcp`) like mcp-click-up. **ADOPT-SET (verified):** CLI = official `obsidian` CLI (app-backed, desktop v1.12.4+) + `notesmd-cli` (Yakitrak, headless filesystem); MCP = cyanheads `obsidian-mcp-server@3.2.9` (`npx -y … @latest`, stdio, env `OBSIDIAN_API_KEY`/`OBSIDIAN_BASE_URL`/`OBSIDIAN_VERIFY_SSL`, needs Local REST API v4+ + running app). Both profiles; vaults exist on this machine.

**EXECUTOR POLICY (implementation):** Phases 2–8 implementation MUST be authored ONLY by cli-codex GPT-5.6 executors — **LUNA (max, fast)** and **TERRA (max, fast)**, both ALWAYS on the FAST service tier (`-c service_tier=fast`). NO Claude subagents for implementation. (Phase 1 research already used SOL/TERRA/LUNA.)

**NEXT ACTION:** build the `.opencode/skills/mcp-tooling/mcp-obsidian/` package (Phases 2–6, mirror mcp-click-up) using **cli-codex TERRA/LUNA only** — mcp-servers install-pointers, `SKILL.md` CLI↔MCP router, README/INSTALL-GUIDE/changelog, references (fold Phase 9 plugins), examples, feature-catalog, manual-testing-playbook. Then Phase 7 (hub registration — gated) + Phase 8 (verify).

**GOTCHAS:** `mcp-servers/` hold install pointers, not code · MCP registered only in `.utcp_config.json` · make the `.env` prefix == the manual name (clickup shipped `clickup_` vs `clickup_official`) · verify any npm name resolves (clickup's `@clickup/mcp-server` 404'd) · no dangling `references/INSTALL-GUIDE.md` · compiled-routing re-mint (Phase 7) is fragile, `SPECKIT_COMPILED_ROUTING=0` is the fallback · community plugins operate at the **FILE LAYER** (edit the data the plugin reads, not the UI).
