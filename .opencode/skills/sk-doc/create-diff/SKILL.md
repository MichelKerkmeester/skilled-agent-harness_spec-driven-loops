---
name: create-diff
description: Preview-gated sk-doc mode that orchestrates the create-diff engine to produce a local, Git-free before/after review of an AI-edited document, with automatic baseline capture, explicit-pair fallback, and an accessible self-contained report.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---
<!-- Keywords: create-diff, document diff, before after review, before/after document, local html diff report, document snapshot, ai edit review -->

# Create Diff

Preview status: the underlying `create-diff` engine is pending packet-136 core phases 002–005. Until it lands, this mode documents the workflow and routes to explicit before/after files; it must not add packet-local `graph-metadata.json`.

## 1. WHEN TO USE

Use this mode when a user wants a before/after review of a locally edited document—Markdown or text today, with HTML, DOCX, and PDF later—outside Git: capture a baseline before an AI edit, then show what changed after.

PREVIEW — engine pending core phases 002–005 (packet 136); until then this mode explains the workflow and falls back to explicit before/after file pairs.

When NOT to use:

- Code or source diffs; use git/sk-git.
- Anything already in Git; use git/sk-git.
- Design or visual comparison; use sk-design.
- Auditing or validating an existing document; use create-quality-control.

## 2. SMART ROUTING

Use simple intent routing with no keyed resource discovery and no `references/<key>/` subdirectories. Conservative activation phrases are “create diff report”, “document before/after review”, “before/after document diff”, and “document change report”.

UNKNOWN_FALLBACK: If the request is ambiguous or the engine is unavailable, confirm the target document, whether a baseline exists, and the output path before acting. Explain the preview status rather than fabricating a diff.

Do not hijack routing from functional siblings when the intent is not clearly a document before/after review.

## 3. HOW IT WORKS

The mode drives the orchestration workflow; all capability checks, comparison algorithms, parsing, rendering, and report generation belong to the engine, not this mode.

1. Check whether the document format is supported.
2. Capture a baseline before the authorized edit. This ordering is invariant.
3. After a successful write, invoke the engine to compare the before and after states and produce a self-contained local report.
4. If no valid baseline exists, route to an explicit before/after file pair.
5. Hand off the local report path.

PREVIEW: Until the engine exists, steps 2–4 are documented intent. Tell the user that the engine is pending and offer the explicit-pair workflow.

## 4. RULES

### ✅ ALWAYS

- Keep everything local: no network, upload, or telemetry.
- Capture the baseline before the edit.
- Delegate all diff, parse, and render work to the engine.
- State the preview status honestly.
- Keep the report accessible.
- Read a file before editing it.

### ❌ NEVER

- Never reimplement diff, parse, snapshot, or render logic in this mode.
- Never claim the engine exists or that a diff was produced when it was not.
- Never add packet-local `graph-metadata.json` or `description.json`.
- Never send document content off-machine.

### ⚠️ ESCALATE

- When the engine is not yet available and the user needs a real diff now.
- When the document format is unsupported or limited.
- When no baseline exists and no explicit pair is provided.
- When the target path is unknown.

## 5. SUCCESS CRITERIA

The task is successful when:

- The mode routes only genuine before/after document-review requests and defers code/Git diffs, design comparison, and existing-document auditing to their correct owners.
- The preview status is stated plainly whenever the engine is unavailable, with the explicit-pair fallback offered instead of a fabricated diff.
- When the engine is present, the baseline is captured before the edit and the after-edit comparison is delegated to the engine, with the local report path handed off.
- No diff, parser, snapshot, or report logic is reimplemented in this mode, and no packet-local advisor metadata is created.
- All processing stays local: no network, upload, or telemetry.

## 6. REFERENCES

Engine design, packet 136:

- Parent contract: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/spec.md`
- This mode's contract: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/006-opencode-skill-and-accessibility/spec.md`
- Research synthesis: `.opencode/specs/skilled-agent-orchestration/136-standalone-document-diff-skill/001-research-and-requirements/research/research.md`

Shared sk-doc standards live at `../shared/`. The single advisor identity and workflow registry live at the sk-doc hub root, not in this packet.
