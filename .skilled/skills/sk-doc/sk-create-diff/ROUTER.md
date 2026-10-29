---
title: "Create Diff Router"
description: "Sibling router for sk-create-diff: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-diff router"
  - "sk-create-diff routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Create Diff Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this packet when the ask is to review what an AI or a person changed in a locally
edited document, to capture a baseline before an edit, or to compare two explicit versions of a
document that is not in Git — Markdown, text, HTML, DOCX or a text-layer PDF. It routes to three
resource families: the reference set under `references/`, which starts at `references/README.md` and
extends to the CLI, capability-and-fidelity, workflow, accessibility-contract and worked-example
documents; the worked-example fixtures under `assets/`; and the two packet scripts,
`scripts/create_diff.py` and `scripts/validate_report.py`, which carry the comparison and the report
check themselves. A visual or design comparison, and any code or Git diff, is out of scope and
routes to another packet.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`auto_capture_compare`** — "review edits", "before/after", "before after review", "document change report" or "what changed" fires it at weight 4, and it pairs with the snapshot-backed shape: capture the baseline before the edit, then compare the live file against it. The block below carries no per-intent `RESOURCE_MAP`, so a scoring intent loads the whole discovered inventory — every markdown file under `references/` and `assets/`, in sorted path order — while `references/README.md` is the default resource the no-match path loads on its own.
- **`explicit_pair`** — "compare two files", "old and new", "before and after files" or "explicit pair" fires it at weight 4, and it needs no stored state: two explicit versions go straight into `compare-pair`. It loads the same discovered inventory as the intent above, for the same reason, and `references/README.md` is again the default resource.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail that does not fit the short summary: the intent bullets, the flat resource topology and the resource-discovery pseudocode.

This packet ships a flat `references/` route-map and worked-example fixtures under `assets/`; there are no `references/<key>/` or `assets/<key>/` subdirectories to infer. Routing is intent-based:

- If the request clearly asks for a before/after document review, route here and pick the workflow shape in section 3 (automatic baseline vs. explicit pair).
- If the target document, baseline state, or output path is unclear, use `UNKNOWN_FALLBACK`: confirm the document, whether a baseline exists, and the report path before acting.
- If a referenced resource is missing, do not invent a path — use the nearest guidance in `references/README.md` and report the gap.
- Do not hijack routing from functional siblings when the intent is not clearly a document before/after review.

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Two workflow shapes for one intent: automatic (snapshot-backed) or explicit pair.
INTENT_MODEL = {
    "auto_capture_compare": {"weight": 4, "keywords": ["review edits", "before/after", "before after review", "document change report", "what changed"]},
    "explicit_pair": {"weight": 4, "keywords": ["compare two files", "old and new", "before and after files", "explicit pair"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target document (and its format)",
    "Confirm whether a baseline snapshot already exists",
    "Confirm the output report path",
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
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: target/baseline/output unclear
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    shape = max(scores, key=scores.get)                       # Tier 2: workflow shape resolved
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"shape": shape, "resources": loaded}
```
