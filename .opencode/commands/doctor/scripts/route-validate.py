#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOCTOR ROUTE VALIDATOR
# ───────────────────────────────────────────────────────────────
"""
route-validate.py — Canonical-manifest CI assertion for /doctor router.

Validates `.opencode/commands/doctor/_routes.yaml` against:
  A. YAML parse + schema_version
  B. Routes list integrity + required keys per route
  C. No duplicate target names
  D. Every route's YAML asset exists in assets/
  E. Mutation class is one of {read-only, add-only, mutates}
  F. Each route's mcp_tools is a subset of the router's frontmatter allowed-tools union
  G. Every route has ≥1 trigger phrase
  H. Flag-name collisions across targets (informational only)
  I. Every route's script_invocations resolve to an existing local script file
  J. Target-set parity across _routes.yaml, speckit.md's Workflow Assets table,
     and doctor_speckit_presentation.txt's menu/valid-targets/subsystem table
  K. Read-only mutation-policy: a `mutating: read-only` route may not declare a
     packet/file/DB write in its target YAML or grant a known-mutating MCP tool

Exit codes:
  0 — all assertions pass
  1 — at least one assertion failure
  2 — manifest missing or unparseable
"""
from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML required. Install via: pip3 install pyyaml", file=sys.stderr)
    sys.exit(3)


REQUIRED_KEYS = {
    "target",
    "yaml",
    "setup_vars",
    "allowed_flags",
    "mutating",
    "gate3_location",
    "mcp_tools",
    "trigger_phrases",
}
VALID_MUTATING = {"read-only", "add-only", "mutates"}

# Matches repo-relative local script paths inside script_invocations prose,
# e.g. ".opencode/bin/spec-memory.cjs" or ".opencode/commands/doctor/scripts/x.py"
SCRIPT_PATH_RE = re.compile(r"\.opencode/[^\s\"']+\.(?:cjs|mjs|js|py|sh)")

# MCP tools known to mutate state (indexing/rebuild/link/scan writers), used by
# assertion K to flag a `mutating: read-only` route that over-grants a mutator.
KNOWN_MUTATING_MCP_TOOLS = {
    "mcp__mk_spec_memory__memory_index_scan",
    "mcp__mk_spec_memory__memory_causal_link",
    "mcp__mk_skill_advisor__advisor_rebuild",
    "mcp__mk_skill_advisor__skill_graph_scan",
}

# Matches the write-activity prose used by target YAMLs ("Write to ...",
# "Write state log to ...", "Write report to ...") — see research.md DR-02.
WRITE_ACTIVITY_RE = re.compile(r"write\s+(?:state log\s+|report\s+)?to\b", re.IGNORECASE)

# ANSI colors (skip if not a TTY)
IS_TTY = sys.stdout.isatty()
def color(text: str, code: str) -> str:
    if not IS_TTY:
        return text
    return f"\033[{code}m{text}\033[0m"

def red(s):    return color(s, "31")
def green(s):  return color(s, "32")
def yellow(s): return color(s, "33")
def blue(s):   return color(s, "34")


class Result:
    def __init__(self):
        self.fails = 0
        self.warns = 0

    def fail(self, msg: str):
        print(f"{red('FAIL')}: {msg}", file=sys.stderr)
        self.fails += 1

    def warn(self, msg: str):
        print(f"{yellow('WARN')}: {msg}", file=sys.stderr)
        self.warns += 1

    def passed(self, msg: str):
        print(f"{green('PASS')}: {msg}")

    def info(self, msg: str):
        print(f"{blue('INFO')}: {msg}")


def parse_router_allowed_tools(router_path: Path) -> set[str]:
    """Extract allowed-tools list from the router .md frontmatter."""
    if not router_path.exists():
        return set()
    text = router_path.read_text(encoding="utf-8")
    # Find first '---' frontmatter block
    match = re.search(r"^---\n(.*?)\n---\n", text, re.DOTALL | re.MULTILINE)
    if not match:
        return set()
    fm_text = match.group(1)
    # Find the allowed-tools line (may span multiple physical lines if YAML-folded;
    # current format is a single comma-separated line)
    at_match = re.search(r"^allowed-tools:\s*(.+?)(?=\n\w|\Z)", fm_text, re.DOTALL | re.MULTILINE)
    if not at_match:
        return set()
    raw = at_match.group(1).strip()
    # Normalize: split on commas, strip whitespace
    tools = {t.strip() for t in raw.split(",") if t.strip()}
    return tools


def parse_speckit_targets(router_path: Path) -> set[str]:
    """Extract target names from speckit.md's Workflow Assets table rows,
    e.g. "| `memory` | `.opencode/commands/doctor/assets/doctor_memory.yaml` |"."""
    if not router_path.exists():
        return set()
    text = router_path.read_text(encoding="utf-8")
    return set(
        re.findall(
            r"^\|\s*`([a-z0-9-]+)`\s*\|\s*`\.opencode/commands/doctor/assets/",
            text,
            re.MULTILINE,
        )
    )


def parse_presentation_targets(presentation_path: Path) -> dict[str, set[str]]:
    """Extract the three target-name displays from doctor_speckit_presentation.txt:
    the numbered menu (via its Accepted-answers `target = \`name\`` rows), the
    "Valid targets:" comma list, and the subsystem manifest table rows."""
    empty = {"menu": set(), "valid_targets": set(), "subsystem": set()}
    if not presentation_path.exists():
        return empty
    text = presentation_path.read_text(encoding="utf-8")

    menu_targets = set(re.findall(r"target = `([a-z0-9-]+)`", text))

    valid_targets: set[str] = set()
    valid_match = re.search(r"Valid targets:\s*(.+)", text)
    if valid_match:
        valid_targets = {t.strip() for t in valid_match.group(1).split(",") if t.strip()}

    subsystem_targets = set(
        re.findall(
            r"^\|\s*`([a-z0-9-]+)`\s*\|\s*`doctor_[a-z0-9_-]+\.yaml`\s*\|",
            text,
            re.MULTILINE,
        )
    )

    return {"menu": menu_targets, "valid_targets": valid_targets, "subsystem": subsystem_targets}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--routes", required=True, help="Path to _routes.yaml")
    ap.add_argument("--router", required=True, help="Path to doctor.md (router)")
    ap.add_argument("--assets-dir", required=True, help="Path to assets/ dir")
    ap.add_argument("--presentation", required=True, help="Path to doctor_speckit_presentation.txt")
    ap.add_argument("--repo-root", required=True, help="Path to repository root (resolves script_invocations paths)")
    args = ap.parse_args()

    routes_path = Path(args.routes)
    router_path = Path(args.router)
    assets_dir  = Path(args.assets_dir)
    presentation_path = Path(args.presentation)
    repo_root = Path(args.repo_root)

    R = Result()

    R.info(f"Manifest:     {routes_path}")
    R.info(f"Router:       {router_path}")
    R.info(f"Assets:       {assets_dir}")
    R.info(f"Presentation: {presentation_path}")
    R.info(f"Repo root:    {repo_root}")
    print("")

    # ─────────────────────────────────────────────────────────────
    # A. MANIFEST PARSE + SCHEMA VERSION
    # ─────────────────────────────────────────────────────────────
    if not routes_path.exists():
        print(f"{red('ERROR')}: manifest not found at {routes_path}", file=sys.stderr)
        return 2

    try:
        with routes_path.open() as f:
            manifest = yaml.safe_load(f)
    except yaml.YAMLError as e:
        print(f"{red('ERROR')}: manifest parse error: {e}", file=sys.stderr)
        return 2

    R.passed("A1: manifest parses as YAML")

    schema_version = manifest.get("schema_version")
    if schema_version != 1:
        R.fail(f"A2: schema_version is {schema_version!r}; expected 1")
    else:
        R.passed("A2: schema_version is 1")

    # ─────────────────────────────────────────────────────────────
    # B. ROUTES LIST INTEGRITY
    # ─────────────────────────────────────────────────────────────
    routes = manifest.get("routes", [])
    if not isinstance(routes, list) or len(routes) == 0:
        R.fail("B1: .routes is empty or not a list")
        return 1 if R.fails else 0

    R.passed(f"B1: .routes has {len(routes)} entries")

    for i, route in enumerate(routes):
        if not isinstance(route, dict):
            R.fail(f"B2: route at index {i} is not a mapping")
            continue
        target = route.get("target", f"<no-target-at-index-{i}>")
        missing = REQUIRED_KEYS - set(route.keys())
        if missing:
            R.fail(f"B2: route '{target}' missing required keys: {', '.join(sorted(missing))}")

    if R.fails == 0:
        R.passed("B2: all routes have required keys")

    # ─────────────────────────────────────────────────────────────
    # C. DUPLICATE TARGET CHECK
    # ─────────────────────────────────────────────────────────────
    targets = [r.get("target") for r in routes if isinstance(r, dict)]
    seen = set()
    dupes = set()
    for t in targets:
        if t in seen:
            dupes.add(t)
        seen.add(t)
    if dupes:
        R.fail(f"C1: duplicate target names: {', '.join(sorted(dupes))}")
    else:
        R.passed("C1: no duplicate target names")

    # ─────────────────────────────────────────────────────────────
    # D. YAML ASSET EXISTENCE
    # ─────────────────────────────────────────────────────────────
    missing_assets = []
    for route in routes:
        if not isinstance(route, dict):
            continue
        target = route.get("target")
        yaml_name = route.get("yaml")
        if not yaml_name:
            continue
        yaml_path = assets_dir / yaml_name
        if not yaml_path.exists():
            R.fail(f"D1: route '{target}' references missing YAML asset: {yaml_path}")
            missing_assets.append(yaml_name)
    if not missing_assets:
        R.passed("D1: all route YAML assets exist")

    # ─────────────────────────────────────────────────────────────
    # E. MUTATION CLASS VALIDITY
    # ─────────────────────────────────────────────────────────────
    bad_muts = []
    for route in routes:
        if not isinstance(route, dict):
            continue
        target = route.get("target")
        mut = route.get("mutating")
        if mut not in VALID_MUTATING:
            R.fail(f"E1: route '{target}' has invalid mutating value: {mut!r} (expected one of {sorted(VALID_MUTATING)})")
            bad_muts.append(target)
    if not bad_muts:
        R.passed("E1: all mutation classes valid")

    # ─────────────────────────────────────────────────────────────
    # F. MCP TOOL SUBSET CHECK
    # ─────────────────────────────────────────────────────────────
    router_tools = parse_router_allowed_tools(router_path)
    if not router_tools:
        R.warn("F1: could not extract allowed-tools from router frontmatter; skipping F2 subset check")
    else:
        R.info(f"Router allowed-tools union: {len(router_tools)} entries")
        f2_failed = False
        for route in routes:
            if not isinstance(route, dict):
                continue
            target = route.get("target")
            mcp_tools = route.get("mcp_tools") or []
            for tool in mcp_tools:
                if tool not in router_tools:
                    R.fail(f"F2: route '{target}' lists mcp_tool '{tool}' but it is NOT in the router's allowed-tools union")
                    f2_failed = True
        if not f2_failed:
            R.passed("F2: all route mcp_tools are subsets of router allowed-tools union")

    # ─────────────────────────────────────────────────────────────
    # G. TRIGGER PHRASE NON-EMPTY
    # ─────────────────────────────────────────────────────────────
    g1_failed = False
    for route in routes:
        if not isinstance(route, dict):
            continue
        target = route.get("target")
        tps = route.get("trigger_phrases") or []
        if len(tps) < 1:
            R.fail(f"G1: route '{target}' has empty trigger_phrases (schema requires >=1 descriptive phrase per route)")
            g1_failed = True
    if not g1_failed:
        R.passed("G1: every route has ≥1 trigger phrase")

    # ─────────────────────────────────────────────────────────────
    # H. FLAG COLLISION (informational only)
    # ─────────────────────────────────────────────────────────────
    flag_owners: dict[str, list[str]] = {}
    for route in routes:
        if not isinstance(route, dict):
            continue
        target = route.get("target")
        flags = route.get("allowed_flags") or []
        for flag in flags:
            # Strip value portion: "--scope=A|B" → "--scope"; "--server <name>" → "--server"
            name = re.split(r"[ =]", flag, 1)[0]
            flag_owners.setdefault(name, []).append(target)
    for name, owners in flag_owners.items():
        if len(owners) > 1:
            R.warn(f"H1: flag '{name}' appears in multiple targets (allowed but informational): {', '.join(owners)}")

    # ─────────────────────────────────────────────────────────────
    # I. ROUTE -> LOCAL SCRIPT EXISTENCE
    # ─────────────────────────────────────────────────────────────
    i_failed = False
    for route in routes:
        if not isinstance(route, dict):
            continue
        target = route.get("target")
        invocations = route.get("script_invocations") or []
        for inv in invocations:
            for script_rel in SCRIPT_PATH_RE.findall(inv):
                script_path = repo_root / script_rel
                if not script_path.exists():
                    R.fail(f"I1: route '{target}' script_invocations references missing local script: {script_rel}")
                    i_failed = True
    if not i_failed:
        R.passed("I1: all route script_invocations resolve to existing local scripts")

    # ─────────────────────────────────────────────────────────────
    # J. TARGET-SET PARITY (manifest vs speckit.md vs presentation displays)
    # ─────────────────────────────────────────────────────────────
    manifest_targets = {t for t in targets if t}
    speckit_targets = parse_speckit_targets(router_path)
    presentation_targets = parse_presentation_targets(presentation_path)
    parity_checks = {
        "speckit.md Workflow Assets table": speckit_targets,
        "presentation menu (Accepted answers)": presentation_targets["menu"],
        "presentation 'Valid targets:' line": presentation_targets["valid_targets"],
        "presentation subsystem manifest table": presentation_targets["subsystem"],
    }
    j_failed = False
    for label, display_set in parity_checks.items():
        missing_from_display = manifest_targets - display_set
        extra_in_display = display_set - manifest_targets
        if missing_from_display or extra_in_display:
            details = []
            if missing_from_display:
                details.append(f"missing from {label}: {', '.join(sorted(missing_from_display))}")
            if extra_in_display:
                details.append(f"stale/extra in {label}: {', '.join(sorted(extra_in_display))}")
            R.fail(f"J1: target-set parity mismatch — {'; '.join(details)}")
            j_failed = True
    if not j_failed:
        R.passed("J1: _routes.yaml routes, speckit.md table, and all 3 presentation displays are in parity")

    # ─────────────────────────────────────────────────────────────
    # K. READ-ONLY MUTATION-POLICY
    # ─────────────────────────────────────────────────────────────
    k_failed = False
    for route in routes:
        if not isinstance(route, dict):
            continue
        target = route.get("target")
        if route.get("mutating") != "read-only":
            continue
        yaml_name = route.get("yaml")
        if yaml_name:
            yaml_path = assets_dir / yaml_name
            if yaml_path.exists():
                yaml_text = yaml_path.read_text(encoding="utf-8")
                if WRITE_ACTIVITY_RE.search(yaml_text):
                    R.fail(f"K1: route '{target}' is 'mutating: read-only' but its YAML ({yaml_path.name}) declares a write; reclassify as add-only/mutates or remove the write")
                    k_failed = True
        mcp_tools = route.get("mcp_tools") or []
        mutating_tools = sorted(set(mcp_tools) & KNOWN_MUTATING_MCP_TOOLS)
        if mutating_tools:
            R.fail(f"K2: route '{target}' is 'mutating: read-only' but grants known-mutating mcp_tools: {', '.join(mutating_tools)}")
            k_failed = True
    if not k_failed:
        R.passed("K1/K2: no read-only route declares a write or grants a mutating MCP tool")

    # ─────────────────────────────────────────────────────────────
    # SUMMARY
    # ─────────────────────────────────────────────────────────────
    print("")
    print("─────────────────────────────────────────────────────────────────")
    if R.fails == 0:
        print(f"{green('OK')}: route-validate — {len(routes)} routes validated, {R.warns} warnings")
        return 0
    else:
        print(f"{red('FAIL')}: route-validate — {R.fails} assertion failures, {R.warns} warnings", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
