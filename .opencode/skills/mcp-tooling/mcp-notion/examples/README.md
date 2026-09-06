---
title: "mcp-notion - Example Workflows"
description: "Index of Code Mode Notion workflows for the mcp-notion mode: page create, data-source query, and add relation, each shown as a self-contained call_tool_chain pattern."
trigger_phrases:
  - "notion examples"
  - "notion code mode workflows"
  - "notion page create example"
  - "notion data source query example"
importance_tier: "supporting"
contextType: "reference"
version: 0.1.0.0
---

# mcp-notion - Example Workflows

> Illustrative Code Mode workflows for the `mcp-notion` mode. Each is a self-contained `call_tool_chain` pattern against the official Notion MCP.

---

## 1. OVERVIEW

This directory indexes practical Notion agent workflows. Notion is MCP-only, so every workflow runs through Code Mode `call_tool_chain({ code: "..." })` against the `notion` manual: there is no CLI.

Three workflows are documented below:

- **Page create**: create a page under a parent, with properties and an initial paragraph.
- **Data-source query**: read rows from a data source with a filter (read-only).
- **Add relation**: set a relation property linking one page to another.

The snippets are illustrative. Tool identifiers follow the local stdio server's kebab pattern (`create-a-page`, `query-data-source`, …); **confirm every name live with `list_tools()` / `tool_info()`** before running: the local and remote backends name tools differently.

---

## 2. REQUIREMENTS

```bash
# Verify the runtime and registration
bash .opencode/skills/mcp-tooling/mcp-notion/scripts/doctor.sh
```

| Requirement | Minimum | Notes |
|---|---|---|
| `notion` manual | Registered in `.utcp_config.json` | Lets Code Mode resolve `notion["..."]` calls |
| `notion_NOTION_TOKEN` | Set before running | `export notion_NOTION_TOKEN="ntn_YOUR_TOKEN"` so Code Mode can resolve the manual |
| Notion integration | Shared into the target parent page or database | A token sees only content explicitly shared with it |
| Scratch parent page ID and data source ID | On hand | Needed for safe testing |

---

## 3. USAGE EXAMPLES

### 3.1 PAGE CREATE

Create a page under a known parent, set a title, and append an initial paragraph.

```javascript
await call_tool_chain({
  code: `
    const page = await notion["notion_create-a-page"]({
      parent: { page_id: "PARENT_PAGE_ID" },
      properties: { title: [{ text: { content: "Weekly Notes" } }] }
    });
    await notion["notion_append-block-children"]({
      block_id: page.id,
      children: [{
        type: "paragraph",
        paragraph: { rich_text: [{ text: { content: "Created via Code Mode." } }] }
      }]
    });
    return page.id;
  `
});
```

Confirm the real tool names first: the create-page and append-children tools are the two used here.

---

### 3.2 DATA-SOURCE QUERY

Read rows from a data source with a filter. This is read-only and safe to run against real data.

```javascript
await call_tool_chain({
  code: `
    const rows = await notion["notion_query-data-source"]({
      data_source_id: "DATA_SOURCE_ID",
      filter: { property: "Status", status: { equals: "In progress" } },
      page_size: 25
    });
    return rows.results.map(r => r.id);
  `
});
```

An empty result (`[]`) is valid: never fabricate rows. Queries target the **data source**, not the database container (Notion API 2.0.0).

---

### 3.3 ADD RELATION

Set a relation property on one page so it links to another. Relations are how Notion connects rows across data sources.

```javascript
await call_tool_chain({
  code: `
    const updated = await notion["notion_update-page-properties"]({
      page_id: "SOURCE_PAGE_ID",
      properties: {
        "Related project": { relation: [{ id: "TARGET_PAGE_ID" }] }
      }
    });
    return updated.id;
  `
});
```

The relation property ("Related project" here) must already exist on the source page's data-source schema. For a dual relation, Notion updates the paired property on the target automatically.

---

### 3.4 PREFLIGHT BEFORE ANY WRITE

```javascript
// Confirm the integration is connected before mutating anything.
await call_tool_chain({ code: `return await notion["notion_retrieve-bot-user"]({});` });
```

---

### 3.5 SCRATCH-SAFE ROUND-TRIP

Create in a scratch parent, read back, then archive (reversible): never hard-delete, there is no hard delete.

```javascript
await call_tool_chain({
  code: `
    const p = await notion["notion_create-a-page"]({
      parent: { page_id: "SCRATCH_PARENT_ID" },
      properties: { title: [{ text: { content: "scratch" } }] }
    });
    const readback = await notion["notion_retrieve-a-page"]({ page_id: p.id });
    await notion["notion_archive-a-page"]({ page_id: p.id });   // trash, reversible
    return readback.id;
  `
});
```

---

## 4. RELATED RESOURCES

- [`../feature-catalog/FEATURE-CATALOG.md`](../feature-catalog/FEATURE-CATALOG.md): the full 24-tool + 5-gap capability inventory
- [`../manual-testing-playbook/manual-testing-playbook.md`](../manual-testing-playbook/manual-testing-playbook.md), scratch-safe test scenarios
- [`../scripts/README.md`](../scripts/README.md), setup and diagnostic scripts
