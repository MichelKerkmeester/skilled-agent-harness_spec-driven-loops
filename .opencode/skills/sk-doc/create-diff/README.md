# create-diff

## 1. OVERVIEW

`create-diff` is a preview-gated before/after document review orchestration mode for locally edited documents. It describes how the future engine will capture a baseline, compare an AI-edited document, and hand off an accessible self-contained local report without Git.

## 2. WHEN TO USE

Use it for a local Markdown or text document review outside Git, with HTML, DOCX, and PDF support planned for the engine. Use explicit before/after file pairs when no valid baseline is available. Use git/sk-git for Git-backed diffs, sk-design for visual comparison, and create-quality-control for auditing or validating an existing document.

## 3. WHAT'S INSIDE

- `SKILL.md` — the preview contract, routing rules, orchestration workflow, and escalation boundaries.
- `changelog/` — versioned registration notes.
- The create-diff engine is pending in packet 136; this mode does not fabricate engine commands or implement its algorithms.

## 4. QUICK START

Preview status: the engine is pending packet 136 core phases 002–005. Read `SKILL.md`, confirm the target document, baseline state, explicit before/after pair if needed, and output path, then follow the documented workflow until the engine lands. See `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/` for the engine design.

## 5. HUB RELATIONSHIP

`create-diff` is a nested workflow packet of the `sk-doc` parent hub. The shared backbone lives at `../shared`. The single advisor identity and workflow registry live at the hub root. This packet has no packet-local `graph-metadata.json`.
