---
title: "Orca CLI Router"
description: "Sibling router for cli-orca: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-orca router"
  - "cli-orca routing"
importance_tier: normal
contextType: general
version: 1.0.1.0
router_state: active
skill_pointer: SKILL.md
---

# Orca CLI Router

The machine router for [`SKILL.md`](../../../.skilled/skills/cli-orca/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

An Orca-qualified multi-word phrase reaches cli-orca: `orca worktree` or `managed worktree`, `orca terminal` or `paired terminal`, `orca browser` or `orca embedded browser`, `orca automation`, `orca artifacts` or `orca skills`, a named official Orca skill that the request also places in Orca, and the runtime failure states of a stopped runtime, a missing executable, a guide mismatch or an ambiguous send. The router picks from the worktree, terminal, browser, automation and official-skill reference families, and from the recovery lane when a failure signal selects it, while a bare `orca` token, an `OpenOrca` model label and generic worktree, terminal or browser vocabulary select nothing. A request that belongs to `sk-git`, `mcp-chrome-devtools`, `mcp-aside-devtools`, the official `orchestration` skill or `cli-cursor` is handed to that owner rather than loading a local file.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **WORKTREE** — "orca worktree / managed worktree / orca repository / child worktree / orca cli / orca handoff / $orca-cli / full ownership handoff" requests load `references/orca-cli-reference.md`, the family that carries worktree state, repository bindings and full ownership handoffs.
- **TERMINAL** — "orca terminal / paired terminal" requests load `references/session-and-runtime.md`, which holds the terminal receipts and liveness verdicts these requests are judged by.
- **BROWSER** — "orca browser / orca embedded browser" requests load `references/mutation-and-browser-boundaries.md`, the ownership boundary between this browser, the CDP tools and the generic agentic browser.
- **AUTOMATIONS** — "orca automation / orca artifacts / orca skills" requests load `references/mutation-and-browser-boundaries.md` as well, because automations, artifacts, skill sharing and publishing share one permission and mutation boundary.
- **ORCA_SKILLS** — "orca-cli / orchestration skill / computer-use / linear-tickets / orca-linear / orca-emulator / orca-emulator-android / orca-per-workspace-env" requests load `references/orca-skills/overview.md`, and only when the request also places the name in Orca: a bare official skill name falls back instead of claiming the lane.
- **RECOVERY** — "runtime stopped / executable missing / guide mismatch / ambiguous send" requests load `references/troubleshooting.md`; it names runtime failure states rather than Orca surfaces, so it is the one lane entered without an Orca qualifier.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail behind the short summary: the lane and phase tables, the loading levels and the authoritative router pseudocode.

### Primary Detection Signals

| Signal | Lane |
|--------|------|
| `orca worktree`, `managed worktree`, `orca repository`, worktree id `<repoId>::<path>` | Worktree and handoff lane, [`references/orca-cli-reference.md`](../../../.skilled/skills/cli-orca/references/orca-cli-reference.md) |
| `orca terminal`, `paired terminal` | Terminal lane, [`references/session-and-runtime.md`](../../../.skilled/skills/cli-orca/references/session-and-runtime.md) |
| `orca browser`, `orca embedded browser`, Orca tab snapshots or refs | Browser lane, [`references/mutation-and-browser-boundaries.md`](../../../.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md) |
| `orca automation`, `orca artifacts`, `orca skills` | Automation and publishing lane, [`references/mutation-and-browser-boundaries.md`](../../../.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md) |
| Any named official skill in an Orca context | Official skills index, [`references/orca-skills/overview.md`](../../../.skilled/skills/cli-orca/references/orca-skills/overview.md) |
| Runtime stopped, executable missing, guide mismatch, ambiguous send | Recovery lane, [`references/troubleshooting.md`](../../../.skilled/skills/cli-orca/references/troubleshooting.md) |

### Phase Detection

| Phase | What happens |
|-------|--------------|
| Discovery | Identify the Orca surface and resolve exactly one executable |
| Preflight | Capture version, help output, agent context and the matching guide |
| Execution | Run the lane's commands with `--json` wherever the surface supports it |
| Verification | Compare the structured result against the requested state and report the receipt |

### Resource Loading Levels

| Level | Content |
|-------|---------|
| L0 | `SKILL.md` and this `ROUTER.md`, always in context once activated |
| L1 | The one reference selected by the lane table above |
| L2 | The version-matched guide served by the binary: `orca skills get orca-cli --full`, or `--reference references/<file>.md` for one guide section |

### Smart Router Pseudocode

```python
import re
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/orca-skills/overview.md"

INTENT_SIGNALS = {
    "WORKTREE": {"weight": 4, "keywords": ["orca worktree", "managed worktree", "orca repository", "child worktree", "orca cli", "orca handoff", "$orca-cli", "full ownership handoff"]},
    "TERMINAL": {"weight": 4, "keywords": ["orca terminal", "paired terminal"]},
    "BROWSER": {"weight": 4, "keywords": ["orca browser", "orca embedded browser"]},
    "AUTOMATIONS": {"weight": 3, "keywords": ["orca automation", "orca artifacts", "orca skills"]},
    "ORCA_SKILLS": {"weight": 4, "keywords": ["orca-cli", "orchestration skill", "computer-use", "linear-tickets", "orca-linear", "orca-emulator", "orca-emulator-android", "orca-per-workspace-env"]},
    # The recovery lane names runtime failure states rather than Orca surfaces, so it is the one
    # lane that may be entered without an Orca qualifier.
    "RECOVERY": {"weight": 3, "keywords": ["runtime stopped", "executable missing", "guide mismatch", "ambiguous send"]},
}

FOREIGN_OWNERS = {
    "generic git worktree": "sk-git",
    "chrome devtools protocol": "mcp-chrome-devtools",
    "agentic browser": "mcp-aside-devtools",
    "supervised orchestration dag": "the official orchestration skill",
    "openorca model label": "the pi runtime cache extension",
    "gnome screen reader": "no owner, ask the operator",
}

UNKNOWN_FALLBACK = {
    "load_level": "UNKNOWN_FALLBACK",
    "action": "defer",
    "message": "No Orca-qualified phrase matched. A bare 'orca' token never routes here.",
}

RESOURCE_MAP = {
    "WORKTREE": ["references/orca-cli-reference.md"],
    "TERMINAL": ["references/session-and-runtime.md"],
    "BROWSER": ["references/mutation-and-browser-boundaries.md"],
    "AUTOMATIONS": ["references/mutation-and-browser-boundaries.md"],
    "ORCA_SKILLS": ["references/orca-skills/overview.md"],
    "RECOVERY": ["references/troubleshooting.md"],
}

def _guard_in_skill(relative_path: str) -> str:
    """Resolve a resource inside the skill root and refuse anything else."""
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    """Every routable resource, so a signal can never name a file that does not exist."""
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

ORCA_PLACEMENT = re.compile(r"(?:^|[^a-z0-9])\$?orca(?![a-z0-9])")


def _places_in_orca(text: str) -> bool:
    """True when the request names Orca itself, which is what qualifies a bare official skill name."""
    return bool(ORCA_PLACEMENT.search(text))


def orca_qualified_phrases(request: str) -> list[str]:
    """The request's signals: Orca-qualified phrases plus the sanctioned compound surfaces.

    The recovery lane is state-based by design, so it needs no Orca qualifier; the official-skill
    names carry one only when the request also places them in Orca, which route() enforces.
    """
    text = request.lower()
    return [keyword for signals in INTENT_SIGNALS.values() for keyword in signals["keywords"] if keyword in text]

def route(request: str) -> dict:
    signals = orca_qualified_phrases(request)
    if not signals:
        return dict(UNKNOWN_FALLBACK)
    foreign = [owner for phrase, owner in FOREIGN_OWNERS.items() if phrase in request.lower()]
    if foreign and not any(signal.startswith("orca") for signal in signals):
        return {"action": "defer", "owners": foreign}
    lane = max(INTENT_SIGNALS, key=lambda name: sum(signal in signals for signal in INTENT_SIGNALS[name]["keywords"]))
    if lane == "ORCA_SKILLS" and not _places_in_orca(request.lower()):
        # An official skill name routes only when the request also places it in Orca, so a bare
        # name falls back instead of claiming the lane on its own.
        return dict(UNKNOWN_FALLBACK)
    resources = RESOURCE_MAP[lane]
    missing = [resource for resource in resources if resource not in discover_markdown_resources()]
    if missing:
        return {"action": "halt", "reason": f"unregistered resource: {missing}"}
    return {"action": "load", "load_level": lane, "resources": [_guard_in_skill(path) for path in resources]}
```
