---
title: "Chrome DevTools Code Mode Manuals - registered-state snapshot"
description: "Registered-state snapshot of the chrome_devtools_1 and chrome_devtools_2 manual entries in .utcp_config.json, with the dual-manual-for-parallelism rationale. Verify, don't re-add."
trigger_phrases:
  - "chrome devtools utcp config"
  - "chrome_devtools_1 manual"
  - "chrome_devtools_2 manual"
  - "chrome devtools code mode snapshot"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Chrome DevTools Code Mode Manuals - registered-state snapshot

Registered-state snapshot of BOTH Chrome DevTools manual entries in this repo's Code Mode config. **These manuals are ALREADY registered in `.utcp_config.json` — verify them, do not re-add them.**

---

## 1. OVERVIEW

### Purpose

The MCP fallback path of mcp-chrome-devtools runs through Code Mode: two manuals, `chrome_devtools_1` and `chrome_devtools_2`, each launching the `chrome-devtools-mcp` server over stdio via `npx`. This asset captures the exact registered entries so agents can verify the live config against a known-good snapshot instead of re-deriving (or worse, duplicating) them.

### Provenance and verification contract

- **Source of truth:** the repo root `.utcp_config.json` (`manual_call_templates` array). This file is a SNAPSHOT of that source, extracted programmatically with `jq` on 2026-07-16.
- **Verify, don't re-add:** confirm the entries exist before any MCP browser call. If the live config drifts from this snapshot, the live config wins — update this snapshot, never "fix" the config to match it without operator intent.
- **Verification command** (from SKILL.md §3 Configuration Check):

```bash
cat .utcp_config.json | jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))'
```

### Why two manuals (dual-manual-for-parallelism)

Per SKILL.md §3, MCP uses `--isolated=true` so each instance runs in its own browser process: multiple parallel browser sessions become possible with no session conflicts between instances, and registering multiple instances (`chrome_devtools_1`, `chrome_devtools_2`) enables parallel testing — e.g. comparing production and staging simultaneously (INSTALL_GUIDE.md Pattern 6). The `bdg` CLI cannot provide this: it exposes one global session lifecycle with no session selector (references/cdp_patterns.md §8), so genuine parallel browser control is exactly what the second manual exists for.

---

## 2. REGISTERED ENTRIES (byte-true from .utcp_config.json)

**Key points:**
- Both entries are `call_template_type: "mcp"`, transport `stdio`, launched via `npx`.
- The npm package is pinned (`chrome-devtools-mcp@0.26.0` as of this snapshot) — note that `INSTALL_GUIDE.md` §4 shows `chrome-devtools-mcp@latest` as the generic install snippet; the live registration pins the version. The live config wins.
- Both carry `--isolated=true` (the parallelism prerequisite) and an empty `env` (no credentials needed).
- Tool naming follows `{manual_name}.{manual_name}_{tool_name}`, e.g. `chrome_devtools_1.chrome_devtools_1_navigate_page`.

### chrome_devtools_1

```json
{
  "name": "chrome_devtools_1",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "chrome_devtools_1": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "chrome-devtools-mcp@0.26.0",
          "--isolated=true"
        ],
        "env": {}
      }
    }
  }
}
```

### chrome_devtools_2

```json
{
  "name": "chrome_devtools_2",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "chrome_devtools_2": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "chrome-devtools-mcp@0.26.0",
          "--isolated=true"
        ],
        "env": {}
      }
    }
  }
}
```

---

## 3. CALL EXAMPLE

Discover first, then call through Code Mode's `call_tool_chain()`, closing pages in a `finally` block (SKILL.md §3 MCP Session Cleanup):

```typescript
call_tool_chain(`
  try {
    await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "https://example.com" });
    const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    return screenshot;
  } finally {
    // close pages so no browser instance leaks
  }
`)
```

For the parallel pattern across both manuals, see `INSTALL_GUIDE.md` §6 Pattern 6 and the playbook scenario BDG-015.

---

## 4. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - §3 MCP approach, isolated instances, invocation pattern.
- [../INSTALL_GUIDE.md](../INSTALL_GUIDE.md) - §4 UTCP configuration steps and §10 MCP tools reference.
- [../mcp-servers/chrome-devtools-mcp/README.md](../mcp-servers/chrome-devtools-mcp/README.md) - The Code Mode server behind these manuals (nothing vendored).
- [../feature_catalog/mcp_parallel_instances/dual_instance_parallel.md](../feature_catalog/mcp_parallel_instances/dual_instance_parallel.md) - The parallelism capability these two entries enable.
