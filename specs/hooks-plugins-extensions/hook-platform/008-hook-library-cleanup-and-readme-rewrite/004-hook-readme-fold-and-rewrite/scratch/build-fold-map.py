#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: HOOK FOLD MAP BUILDER
# ───────────────────────────────────────────────────────────────

"""
List every link in a link-only hook folder with its target and its event.

Run it from the repository root. The event of a Claude, Codex, Cursor or Devin
link is read from the hook registry. The event of a Pi, DSH, OpenCode or Vibe
link is read from the file the link points to, or from the Vibe hook table.

Usage: python3 build-fold-map.py
Output: scratch/fold-map.tsv with a header row, and scratch/deleted-readmes.txt
        with the README path of each link-only folder that holds one.
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

ROOT = Path(".").resolve()
HOOKS = Path(".skilled/hooks")
REGISTRY = Path(".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json")
VIBE_TABLE = Path(".vibe/hooks.toml")
VIBE_WRAPPERS = Path(".vibe/plugins/repo-guards")
SCRATCH = Path(__file__).resolve().parent
README_NAME = "README.md"
REGISTRY_RUNTIMES = ("claude", "codex", "cursor", "devin")
NOT_REGISTERED = "None registered"
NOT_REGISTERED_SOURCE = "no registry binding, hook key or hook table entry names the file"
PI_ADAPTERS = Path(".skilled/skills/system-spec-kit/runtime/hooks/pi")
DSH_ADAPTERS = Path(".skilled/skills/system-spec-kit/runtime/hooks/dsh")

PI_EVENT = re.compile(r"""\bpi\.on\(\s*["']([a-z_]+)["']""")
DSH_EVENT = re.compile(r"""\.on\(\s*["']([a-z]+/[a-z-]+)["']""")
OPENCODE_KEY = re.compile(r"""^\s*(?:async\s+)?["']([a-z]+(?:\.[a-z]+)+)["']\s*[:(]""", re.MULTILINE)
OPENCODE_TYPE = re.compile(r"""[=!]==\s*["']([a-z]+(?:\.[a-z]+)+)["']""")
VIBE_ENTRY = re.compile(r"""type\s*=\s*"([a-z_]+)"(?:(?!\[\[).)*?command\s*=\s*"([^\n]*)\"""", re.DOTALL)

# ───────────────────────────────────────────────────────────────
# 2. EVENT LOOKUP
# ───────────────────────────────────────────────────────────────


def registry_events(runtime: str, link: Path) -> List[str]:
    """Return the registry bindings of one runtime whose script is this link or its target."""
    hooks = json.loads(REGISTRY.read_text(encoding="utf-8"))["hooks"]
    target = link.resolve()
    # A TypeScript adapter is registered through its compiled twin.
    compiled = Path(str(target).replace("/runtime/hooks/", "/runtime/dist/hooks/")).with_suffix(".js")
    wanted = {target, (ROOT / link).absolute(), compiled}
    found: List[str] = []
    for hook in hooks:
        for binding in hook.get("bindings", {}).get(runtime, []):
            script = ROOT / binding.get("script", "")
            if script.resolve() not in wanted and script.absolute() not in wanted:
                continue
            matcher = binding.get("matcher")
            label = binding["event"] + (f" ({matcher})" if matcher else "")
            found.append(f"{label} [id {hook['id']}, timeout {binding.get('timeout')}]")
    return found


def source_events(pattern: "re.Pattern[str]", target: Path) -> List[str]:
    """Return the event names a pattern finds in the linked file, without repeats."""
    text = target.read_text(encoding="utf-8", errors="replace")
    return sorted(set(pattern.findall(text)))


def caller_events(pattern: "re.Pattern[str]", adapters: Path, target: Path) -> Tuple[List[str], str]:
    """Return the events of the adapter that names a script the runtime does not load itself."""
    for adapter in sorted(adapters.glob("*")):
        if not adapter.is_file() or ".test." in adapter.name:
            continue
        text = adapter.read_text(encoding="utf-8", errors="replace")
        if target.name in text:
            return sorted(set(pattern.findall(text))), f"{adapter.as_posix()}, which runs the script"
    return [], ""


def vibe_events(link: Path) -> List[str]:
    """Return the Vibe hook types whose command, or whose wrapper, names this link's file."""
    table = VIBE_TABLE.read_text(encoding="utf-8")
    target_name = link.resolve().name
    found: List[str] = []
    for hook_type, command in VIBE_ENTRY.findall(table):
        wrapper = re.search(r"repo-guards/([\w.-]+)", command)
        wrapper_text = ""
        if wrapper and (VIBE_WRAPPERS / wrapper.group(1)).is_file():
            wrapper_text = (VIBE_WRAPPERS / wrapper.group(1)).read_text(encoding="utf-8", errors="replace")
        if link.name in command or target_name in command or target_name in wrapper_text:
            found.append(hook_type)
    return sorted(set(found))


def lookup(runtime: str, link: Path) -> Tuple[str, str]:
    """Return (event, where it was read) for one link."""
    target = link.resolve()
    if runtime in REGISTRY_RUNTIMES:
        return " + ".join(registry_events(runtime, link)), REGISTRY.name
    if runtime in ("pi", "dsh"):
        pattern, adapters = (PI_EVENT, PI_ADAPTERS) if runtime == "pi" else (DSH_EVENT, DSH_ADAPTERS)
        events = source_events(pattern, target)
        if events:
            return ", ".join(events), "the on(...) calls in the real file"
        events, source = caller_events(pattern, adapters, target)
        return ", ".join(events), source
    if runtime == "opencode":
        events = sorted(set(source_events(OPENCODE_KEY, target) + source_events(OPENCODE_TYPE, target)))
        return ", ".join(events), "hook keys and event types in the plugin file"
    if runtime == "vibe":
        return ", ".join(vibe_events(link)), VIBE_TABLE.as_posix()
    return "None. A core module the adapters import.", "folder name"


# ───────────────────────────────────────────────────────────────
# 3. ENTRY POINT
# ───────────────────────────────────────────────────────────────


def main() -> int:
    """Walk the hooks tree and write the two files."""
    rows: List[List[str]] = []
    deleted: List[str] = []
    unresolved: Dict[str, int] = {}
    for folder in sorted(p for p in HOOKS.rglob("*") if p.is_dir() and not p.is_symlink()):
        if "node_modules" in folder.parts:
            continue
        entries = sorted(entry for entry in folder.iterdir() if entry.name != README_NAME)
        if not entries or not all(entry.is_symlink() for entry in entries):
            continue
        if (folder / README_NAME).is_file():
            deleted.append((folder / README_NAME).as_posix().replace(".skilled/", "", 1))
        for link in entries:
            event, source = lookup(folder.name, link)
            if not event:
                event, source = NOT_REGISTERED, NOT_REGISTERED_SOURCE
                unresolved[folder.as_posix()] = unresolved.get(folder.as_posix(), 0) + 1
            target = os.path.relpath(link.resolve(), ROOT)
            rows.append([folder.parent.name, folder.name, link.name, target, event, source])

    header = ["feature", "runtime", "link", "real file", "event", "event read from"]
    lines = ["\t".join(header)] + ["\t".join(row) for row in rows]
    (SCRATCH / "fold-map.tsv").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (SCRATCH / "deleted-readmes.txt").write_text("\n".join(deleted) + "\n", encoding="utf-8")
    pairs = len({(row[0], row[1]) for row in rows})
    print(f"FOLDMAP rows={len(rows)} folders={pairs} readmes={len(deleted)} not_registered={sum(unresolved.values())}")
    for folder, count in sorted(unresolved.items()):
        print(f"  {NOT_REGISTERED} {folder} links={count}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
