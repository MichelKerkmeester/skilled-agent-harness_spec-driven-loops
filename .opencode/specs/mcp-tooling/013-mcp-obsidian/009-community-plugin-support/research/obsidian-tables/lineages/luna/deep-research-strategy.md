---
title: Deep Research Strategy - obsidian-tables fan-out lineage
description: Persistent research plan for the obsidian-tables file-layer knowledge base.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

This detached lineage investigates the obsidian-tables plugin with source-first evidence and produces a verified file-layer knowledge base. The reducer owns machine-managed sections; iteration agents write only iteration artifacts, deltas, and append-only state records.

## 2. TOPIC

Deep-dive research on `aztekgold/obsidian-tables`, resolving the exact `.table.md` JSON schema, feature surface, commands/settings, AI file workflows, and troubleshooting behavior.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What are the exact top-level keys and per-column structures for every supported type, including option/color storage and formula behavior?
- [ ] How do rows, views, filters, multi-level sorts, reordering, exports, and embeds serialize at the file layer?
- [ ] What commands, settings, and user-facing feature behavior must an AI account for when operating the vault?
- [ ] Which create, patch, import, query, migration, and safe in-place editing workflows are valid for an AI?
- [ ] What malformed-file, parsing, formula, and edge-case symptoms are observable, and what recipes avoid them?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not reverse-engineer unrelated Obsidian plugins or the minified installed bundle when repository source is available.
- Do not implement plugin changes; report the data model and operational workflows only.
- Do not infer undocumented schema fields without source or clearly marked inference.

## 5. STOP CONDITIONS

- Run all five configured iterations; convergence is telemetry only under `max-iterations`.
- Synthesis must preserve unresolved questions and distinguish source-confirmed facts from inference.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `columnOrder` is not a reliable active per-view ordering mechanism in current `main`; it is serialized but not consumed by the renderer. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `columnOrder` is not a reliable active per-view ordering mechanism in current `main`; it is serialized but not consumed by the renderer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `columnOrder` is not a reliable active per-view ordering mechanism in current `main`; it is serialized but not consumed by the renderer.

### A top-level table `id` or `order` key is not part of the current `TableData` interface. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A top-level table `id` or `order` key is not part of the current `TableData` interface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A top-level table `id` or `order` key is not part of the current `TableData` interface.

### An embed alias is not arbitrary display text only; it is interpreted as a view name and may mutate the table by creating that view. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: An embed alias is not arbitrary display text only; it is interpreted as a view name and may mutate the table by creating that view.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An embed alias is not arbitrary display text only; it is interpreted as a view name and may mutate the table by creating that view.

### Assuming CSV multiline fields, strict IDs, policy enforcement, or exact version validation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Assuming CSV multiline fields, strict IDs, policy enforcement, or exact version validation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming CSV multiline fields, strict IDs, policy enforcement, or exact version validation.

### Do not overwrite a `.table.md` file with raw JSON; its frontmatter and fenced block are part of the file contract. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Do not overwrite a `.table.md` file with raw JSON; its frontmatter and fenced block are part of the file contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not overwrite a `.table.md` file with raw JSON; its frontmatter and fenced block are part of the file contract.

### Do not treat `tableRenderer` as a visual renderer choice in v1.5.0. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Do not treat `tableRenderer` as a visual renderer choice in v1.5.0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not treat `tableRenderer` as a visual renderer choice in v1.5.0.

### Do not use direct `.csv` table editing when the goal is a persisted vault mutation. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Do not use direct `.csv` table editing when the goal is a persisted vault mutation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not use direct `.csv` table editing when the goal is a persisted vault mutation.

### Patching by row index or column name is not robust. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Patching by row index or column name is not robust.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Patching by row index or column name is not robust.

### Replacing an entire `.table.md` with JSON is not a safe migration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Replacing an entire `.table.md` with JSON is not a safe migration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing an entire `.table.md` with JSON is not a safe migration.

### The installed minified `main.js` is not needed for the current schema resolution; repository source is authoritative for this pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The installed minified `main.js` is not needed for the current schema resolution; repository source is authoritative for this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The installed minified `main.js` is not needed for the current schema resolution; repository source is authoritative for this pass.

### Treating display date formats as formula `date()` parsing formats. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating display date formats as formula `date()` parsing formats.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating display date formats as formula `date()` parsing formats.

### Treating formula em dashes as literal stored values. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating formula em dashes as literal stored values.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating formula em dashes as literal stored values.

### Treating persisted formula output as always fresh is not justified. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating persisted formula output as always fresh is not justified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating persisted formula output as always fresh is not justified.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A top-level table `id` or `order` key is not part of the current `TableData` interface. (iteration 1)
- The installed minified `main.js` is not needed for the current schema resolution; repository source is authoritative for this pass. (iteration 1)
- `columnOrder` is not a reliable active per-view ordering mechanism in current `main`; it is serialized but not consumed by the renderer. (iteration 2)
- An embed alias is not arbitrary display text only; it is interpreted as a view name and may mutate the table by creating that view. (iteration 2)
- Do not overwrite a `.table.md` file with raw JSON; its frontmatter and fenced block are part of the file contract. (iteration 3)
- Do not treat `tableRenderer` as a visual renderer choice in v1.5.0. (iteration 3)
- Do not use direct `.csv` table editing when the goal is a persisted vault mutation. (iteration 3)
- Patching by row index or column name is not robust. (iteration 4)
- Replacing an entire `.table.md` with JSON is not a safe migration. (iteration 4)
- Treating persisted formula output as always fresh is not justified. (iteration 4)
- Assuming CSV multiline fields, strict IDs, policy enforcement, or exact version validation. (iteration 5)
- Treating display date formats as formula `date()` parsing formats. (iteration 5)
- Treating formula em dashes as literal stored values. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Which commands/settings and file-layer workflows are safest for AI operation? (iteration 1)
- How views, filters, sorting, column/row reorder, CSV export, and embeds serialize and behave in practice? (iteration 1)
- What exact malformed-file and formula-error symptoms should troubleshooting recipes cover? (iteration 1)
- What malformed JSON, markdown extraction, CSV, and formula error messages are observable? (iteration 2)
- What safe read/patch/query/migration recipes avoid corrupting `.table.md` wrappers? (iteration 2)
- What commands/settings and format-specific file creation/import behavior must an AI account for? (iteration 2)
- What malformed JSON, Markdown extraction, CSV, and formula error messages and recovery steps are observable? (iteration 3)
- What exact safe create/add/patch/query/migration recipes should the final knowledge base prescribe? (iteration 3)
- Which source claims are implementation caveats versus intended behavior? (iteration 3)
- What is the complete malformed-file/formula-error catalog, including exact user-visible symptoms and recovery choices? (iteration 4)
- Which AI recipes need explicit warnings for formula limits, commas in multi-select values, stale computed cells, and missing views? (iteration 4)
- No material source question remains for the requested current `main` scope. Version drift after the inspected repository state is an external maintenance concern. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
No material source question remains for the requested current `main` scope. Version drift after the inspected repository state is an external maintenance concern.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Resource map: `resource-map.md` is absent at init; coverage gate skipped.
- Target spec folder already exists, but this detached lineage is write-contained and does not mutate parent spec documents.
- Primary evidence target: GitHub repository source and README for `aztekgold/obsidian-tables`; installed `main.js` is explicitly out of scope except as a fallback symptom source.
- Expected output: source-cited schema, workflows, feature/command/settings inventory, and troubleshooting recipes for file-layer AI operation.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stop policy is `max-iterations`)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Packet boundary: this `lineages/luna` directory only
- Session: `fanout-luna-1785673258726-kcaoky`
- Executor: `cli-codex`, model `gpt-5.6-luna`
