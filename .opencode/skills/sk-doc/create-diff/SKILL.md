---
name: create-diff
description: Preview create-diff: local Git-free AI-edited document before/after review; baseline, explicit-pair fallback, accessible report.
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

### Smart Router Pseudocode

This packet ships no `references/` or `assets/` folder, so `discover_markdown_resources()` always
returns an empty set and `load_if_available()` is a graceful no-op. Routing degrades cleanly to
`UNKNOWN_FALLBACK` or the explicit before/after file-pair fallback described above; nothing crashes
on the empty inventory.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"  # packet ships no references/ or assets/; load_if_available is a graceful no-op here

# Single-purpose packet: one intent, scored from this packet's conservative activation phrases.
INTENT_MODEL = {
    "before_after_diff": {"weight": 4, "keywords": ["create diff report", "document before/after review", "before/after document diff", "document change report"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target document",
    "Confirm whether a baseline exists",
    "Confirm the output path",
]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, inventory, loaded, seen) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(request) -> dict:
    text = request.text.lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    return scores

def route_diff_request(request):
    inventory = discover_markdown_resources()                # always empty: no packet-local refs/assets
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: target/baseline/output unclear
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)  # no-op: inventory is empty
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                      # Tier 2: before_after_diff resolved
    # No packet-local resources ship with this packet; return the resolved route as-is.
    return {"intent": intent, "resources": loaded}
```

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

### ⛔ NEVER

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
