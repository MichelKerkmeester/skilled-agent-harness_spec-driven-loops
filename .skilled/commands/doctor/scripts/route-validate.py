#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOCTOR ROUTE VALIDATOR
# ───────────────────────────────────────────────────────────────
"""
route-validate.py validates the canonical manifest for the routed doctor commands.

Every route names the command that owns it; that command's router is
<doctor-dir>/<name>.md and its presentation is
<assets-dir>/doctor-<name>-presentation.txt.

Validates `.skilled/commands/doctor/_routes.yaml` against:
  A. YAML parse + schema_version
  B. Routes list integrity + required keys per route; each route's command names
     an existing doctor router
  C. No duplicate target names
  D. Every route's YAML asset exists in assets/
  E. Mutation class is one of {read-only, add-only, mutates}
  F. Each route's mcp_tools is a subset of its router's frontmatter allowed-tools
     union; each cli_commands entry invokes the advisor CLI with a known command
  G. Every route has ≥1 trigger phrase
  H. Flag-name collisions across targets (informational only)
  I. Every route's script_invocations resolve to an existing local script file
  J. Per command, target-set parity between _routes.yaml and the router's
     targets table; a command with more than one route also keeps parity with its
     presentation's menu, valid-targets line and subsystem table
  K. Read-only mutation-policy: a `mutating: read-only` route may not declare a
     packet/file/DB write in its target YAML or grant a known-mutating advisor
     command
  L. Workflow activity coverage: every local script a route's
     script_invocations names is invoked by that route's workflow YAML (its
     repo-relative path or its file name appears in a parsed YAML value, so a
     comment alone does not count)

Usage:
    python3 route-validate.py --routes <_routes.yaml> --doctor-dir <doctor/>
        --assets-dir <assets/> --repo-root <root>

Exit codes:
  0 - all assertions pass
  1 - at least one assertion failure
  2 - manifest missing, unparseable, empty or not a mapping
  3 - PyYAML missing
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Set

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML required. Install via: pip3 install pyyaml", file=sys.stderr)
    sys.exit(3)


# ───────────────────────────────────────────────────────────────
# 1. CONSTANTS
# ───────────────────────────────────────────────────────────────

REQUIRED_KEYS = {
    "command",
    "target",
    "yaml",
    "setup_vars",
    "allowed_flags",
    "mutating",
    "gate3_location",
    "trigger_phrases",
}
# A route declares the tool surface it uses in exactly one of these forms: MCP
# tool ids, or advisor CLI invocations.
TOOL_DECLARATION_KEYS = ("mcp_tools", "cli_commands")
VALID_MUTATING = {"read-only", "add-only", "mutates"}
COMMAND_RE = re.compile(r"^/doctor:([a-z0-9-]+)$")

# Matches repo-relative local script paths inside script_invocations prose,
# e.g. ".skilled/bin/skill-advisor.cjs" or ".skilled/commands/doctor/scripts/x.py"
SCRIPT_PATH_RE = re.compile(r"\.(?:skilled|opencode)/[^\s\"']+\.(?:cjs|mjs|js|py|sh)")

# Advisor CLI invocation shape for cli_commands entries: the repo-relative shim
# path plus the set of commands the CLI itself exposes.
ADVISOR_CLI_RELATIVE_PATH = ".skilled/bin/skill-advisor.cjs"
ADVISOR_CLI_COMMANDS = {
    "advisor_recommend",
    "advisor_rebuild",
    "advisor_status",
    "advisor_validate",
    "skill_graph_scan",
    "skill_graph_query",
    "skill_graph_status",
    "skill_graph_validate",
    "skill_graph_propagate_enhances",
}

# Advisor commands known to mutate state (index/rebuild writers), used by
# assertion K to flag a `mutating: read-only` route that over-grants a mutator.
# skill_graph_propagate_enhances mutates only in its apply form, which no route
# declares today.
KNOWN_MUTATING_ADVISOR_COMMANDS = {
    "advisor_rebuild",
    "skill_graph_scan",
}

# Matches the write-activity prose used by target YAMLs ("Write to ...",
# "Write state log to ...", "Write report to ...") so a read-only route
# can be flagged for describing a write it isn't allowed to perform.
WRITE_ACTIVITY_RE = re.compile(r"write\s+(?:state log\s+|report\s+)?to\b", re.IGNORECASE)


# ───────────────────────────────────────────────────────────────
# 2. OUTPUT
# ───────────────────────────────────────────────────────────────

IS_TTY = sys.stdout.isatty()


def color(text: str, code: str) -> str:
    """Wrap text in an ANSI color code when stdout is a terminal."""
    if not IS_TTY:
        return text
    return f"\033[{code}m{text}\033[0m"


def red(text: str) -> str:
    """Color text red."""
    return color(text, "31")


def green(text: str) -> str:
    """Color text green."""
    return color(text, "32")


def yellow(text: str) -> str:
    """Color text yellow."""
    return color(text, "33")


def blue(text: str) -> str:
    """Color text blue."""
    return color(text, "34")


class Result:
    """
    Collects assertion outcomes and prints each one as it is recorded.

    Attributes:
        fails: Number of failed assertions so far
        warns: Number of informational warnings so far
    """

    def __init__(self) -> None:
        self.fails = 0
        self.warns = 0

    def fail(self, msg: str) -> None:
        """Print a FAIL line to stderr and count it."""
        print(f"{red('FAIL')}: {msg}", file=sys.stderr)
        self.fails += 1

    def warn(self, msg: str) -> None:
        """Print a WARN line to stderr and count it."""
        print(f"{yellow('WARN')}: {msg}", file=sys.stderr)
        self.warns += 1

    def passed(self, msg: str) -> None:
        """Print a PASS line."""
        print(f"{green('PASS')}: {msg}")

    def info(self, msg: str) -> None:
        """Print an INFO line."""
        print(f"{blue('INFO')}: {msg}")


# ───────────────────────────────────────────────────────────────
# 3. PARSERS
# ───────────────────────────────────────────────────────────────

def yaml_string_values(node: Any, out: List[str]) -> List[str]:
    """
    Collect every string key and value from a parsed YAML tree.

    Comments are dropped by the parser, so only text the workflow actually
    carries counts.

    Args:
        node: Parsed YAML node (mapping, sequence or scalar)
        out: List the strings are appended to

    Returns:
        The same list, for chaining
    """
    if isinstance(node, dict):
        for key, value in node.items():
            yaml_string_values(key, out)
            yaml_string_values(value, out)
    elif isinstance(node, list):
        for value in node:
            yaml_string_values(value, out)
    elif isinstance(node, str):
        out.append(node)
    return out


def workflow_mentions_script(workflow_text: str, script_rel: str) -> bool:
    """Report whether workflow text names a script by repo path or exact file name."""
    if script_rel in workflow_text:
        return True
    name = script_rel.rsplit("/", 1)[-1]
    return re.search(r"(?<![\w.-])" + re.escape(name) + r"(?![\w.-])", workflow_text) is not None


def parse_router_allowed_tools(router_path: Path) -> Set[str]:
    """Extract allowed-tools list from the router .md frontmatter."""
    if not router_path.exists():
        return set()
    text = router_path.read_text(encoding="utf-8")
    match = re.search(r"^---\n(.*?)\n---\n", text, re.DOTALL | re.MULTILINE)
    if not match:
        return set()
    fm_text = match.group(1)
    # The allowed-tools value may span folded lines; today it is one comma-separated line.
    at_match = re.search(r"^allowed-tools:\s*(.+?)(?=\n\w|\Z)", fm_text, re.DOTALL | re.MULTILINE)
    if not at_match:
        return set()
    raw = at_match.group(1).strip()
    return {t.strip() for t in raw.split(",") if t.strip()}


def command_name(route: Dict[str, Any]) -> Optional[str]:
    """The router name a route's command points at, e.g. /doctor:speckit -> speckit."""
    match = COMMAND_RE.match(str(route.get("command", "")))
    return match.group(1) if match else None


def router_path_for(doctor_dir: Path, name: str) -> Path:
    return doctor_dir / f"{name}.md"


def presentation_path_for(assets_dir: Path, name: str) -> Path:
    return assets_dir / f"doctor-{name}-presentation.txt"


def parse_router_targets(router_path: Path) -> Set[str]:
    """Extract target names from a router's targets table rows,
    e.g. "| `memory` | `.skilled/commands/doctor/assets/doctor-memory.yaml` |"."""
    if not router_path.exists():
        return set()
    text = router_path.read_text(encoding="utf-8")
    return set(
        re.findall(
            r"^\|\s*`([a-z0-9-]+)`\s*\|\s*`\.(?:skilled|opencode)/commands/doctor/assets/",
            text,
            re.MULTILINE,
        )
    )


def parse_presentation_targets(presentation_path: Path) -> Dict[str, Set[str]]:
    """Read target displays and use only answer rows for visible startup-menu numbers."""
    empty: Dict[str, Set[str]] = {"menu": set(), "valid_targets": set(), "subsystem": set()}
    if not presentation_path.exists():
        return empty
    text = presentation_path.read_text(encoding="utf-8")

    startup = re.search(r"```text(.*?)```", text, re.DOTALL)
    visible_answers = set(
        re.findall(r"^\s*(\d+)\)", startup.group(1) if startup else "", re.MULTILINE)
    )
    answer_targets = re.findall(
        r"^\|\s*`(\d+)`\s*\|\s*target = `([a-z0-9-]+)`\s*\|",
        text,
        re.MULTILINE,
    )
    menu_targets = {target for number, target in answer_targets if number in visible_answers}

    valid_targets: Set[str] = set()
    valid_match = re.search(r"Valid targets:\s*(.+)", text)
    if valid_match:
        valid_targets = {t.strip() for t in valid_match.group(1).split(",") if t.strip()}

    subsystem_targets = set(
        re.findall(
            r"^\|\s*`([a-z0-9-]+)`\s*\|\s*`doctor-[a-z0-9-]+\.yaml`\s*\|",
            text,
            re.MULTILINE,
        )
    )

    return {"menu": menu_targets, "valid_targets": valid_targets, "subsystem": subsystem_targets}


def advisor_cli_command_name(entry: Any) -> Optional[str]:
    """Extract the advisor command named by one cli_commands entry.

    Returns None when the entry does not invoke the advisor CLI shim.
    """
    if not isinstance(entry, str):
        return None
    tokens = entry.split()
    if ADVISOR_CLI_RELATIVE_PATH not in tokens:
        return None
    for token in tokens[tokens.index(ADVISOR_CLI_RELATIVE_PATH) + 1:]:
        if not token.startswith("-"):
            return token
    return None


def advisor_cli_commands(route: Dict[str, Any]) -> Set[str]:
    """Command names declared by a route's cli_commands entries."""
    entries = route.get("cli_commands")
    if not isinstance(entries, list):
        return set()
    names = (advisor_cli_command_name(entry) for entry in entries)
    return {name for name in names if name}


# ───────────────────────────────────────────────────────────────
# 4. MANIFEST ASSERTIONS (A, B)
# ───────────────────────────────────────────────────────────────

def load_manifest(routes_path: Path, result: Result) -> Optional[Dict[str, Any]]:
    """
    Load the manifest and record A1. Prints the error itself on failure.

    Args:
        routes_path: Path to _routes.yaml
        result: Assertion collector

    Returns:
        The parsed mapping, or None when the manifest is missing, unparseable,
        empty or not a mapping (the caller exits 2)
    """
    if not routes_path.exists():
        print(f"{red('ERROR')}: manifest not found at {routes_path}", file=sys.stderr)
        return None
    try:
        with routes_path.open(encoding="utf-8") as handle:
            manifest = yaml.safe_load(handle)
    except yaml.YAMLError as exc:
        print(f"{red('ERROR')}: manifest parse error: {exc}", file=sys.stderr)
        return None
    if not isinstance(manifest, dict):
        shape = "empty" if manifest is None else f"a {type(manifest).__name__}, not a mapping"
        print(f"{red('ERROR')}: manifest top level is {shape}: {routes_path}", file=sys.stderr)
        return None
    result.passed("A1: manifest parses as YAML")
    return manifest


def check_schema_version(manifest: Dict[str, Any], result: Result) -> None:
    """A2: schema_version must be 1."""
    schema_version = manifest.get("schema_version")
    if schema_version != 1:
        result.fail(f"A2: schema_version is {schema_version!r}; expected 1")
    else:
        result.passed("A2: schema_version is 1")


def check_routes_list(manifest: Dict[str, Any], result: Result) -> Optional[List[Any]]:
    """B1: routes must be a non-empty list. Returns it, or None on failure."""
    routes = manifest.get("routes", [])
    if not isinstance(routes, list) or len(routes) == 0:
        result.fail("B1: .routes is empty or not a list")
        return None
    result.passed(f"B1: .routes has {len(routes)} entries")
    return routes


def check_required_keys(routes: Sequence[Any], result: Result) -> None:
    """B2: every route is a mapping with the required keys and a tool declaration."""
    b2_failed = False
    for i, route in enumerate(routes):
        if not isinstance(route, dict):
            result.fail(f"B2: route at index {i} is not a mapping")
            b2_failed = True
            continue
        target = route.get("target", f"<no-target-at-index-{i}>")
        missing = REQUIRED_KEYS - set(route.keys())
        if missing:
            result.fail(f"B2: route '{target}' missing required keys: {', '.join(sorted(missing))}")
            b2_failed = True
        if not any(key in route for key in TOOL_DECLARATION_KEYS):
            result.fail(f"B2: route '{target}' declares neither {' nor '.join(TOOL_DECLARATION_KEYS)}")
            b2_failed = True
    if not b2_failed:
        result.passed("B2: all routes have required keys")


# ───────────────────────────────────────────────────────────────
# 5. ROUTE ASSERTIONS (C TO H)
# ───────────────────────────────────────────────────────────────

def check_duplicate_targets(targets: Sequence[Any], result: Result) -> None:
    """C1: no target name appears twice."""
    seen = set()
    dupes = set()
    for t in targets:
        if t in seen:
            dupes.add(t)
        seen.add(t)
    if dupes:
        result.fail(f"C1: duplicate target names: {', '.join(sorted(dupes))}")
    else:
        result.passed("C1: no duplicate target names")


def check_yaml_assets(routes: Sequence[Dict[str, Any]], assets_dir: Path, result: Result) -> None:
    """D1: every route's workflow YAML exists in the assets directory."""
    missing_assets = []
    for route in routes:
        target = route.get("target")
        yaml_name = route.get("yaml")
        if not yaml_name:
            continue
        yaml_path = assets_dir / yaml_name
        if not yaml_path.exists():
            result.fail(f"D1: route '{target}' references missing YAML asset: {yaml_path}")
            missing_assets.append(yaml_name)
    if not missing_assets:
        result.passed("D1: all route YAML assets exist")


def check_mutation_classes(routes: Sequence[Dict[str, Any]], result: Result) -> None:
    """E1: every mutating value is a known class."""
    bad_muts = []
    for route in routes:
        target = route.get("target")
        mut = route.get("mutating")
        if mut not in VALID_MUTATING:
            result.fail(f"E1: route '{target}' has invalid mutating value: {mut!r} (expected one of {sorted(VALID_MUTATING)})")
            bad_muts.append(target)
    if not bad_muts:
        result.passed("E1: all mutation classes valid")


def check_commands(routes: Sequence[Dict[str, Any]], doctor_dir: Path, result: Result) -> None:
    """B3: every route's command is /doctor:<name> and that router file exists."""
    b3_failed = False
    for route in routes:
        target = route.get("target")
        name = command_name(route)
        if name is None:
            result.fail(f"B3: route '{target}' has command {route.get('command')!r}; expected /doctor:<name>")
            b3_failed = True
        elif not router_path_for(doctor_dir, name).exists():
            result.fail(f"B3: route '{target}' names {route.get('command')} but {router_path_for(doctor_dir, name)} does not exist")
            b3_failed = True
    if not b3_failed:
        result.passed("B3: every route's command names an existing doctor router")


def check_tool_declarations(routes: Sequence[Dict[str, Any]], doctor_dir: Path, result: Result) -> None:
    """F1-F3: mcp_tools stay inside their router's union; cli_commands name known advisor commands."""
    f2_failed = False
    for route in routes:
        target = route.get("target")
        tools = route.get("mcp_tools") or []
        name = command_name(route)
        if not tools or name is None:
            continue
        router_tools = parse_router_allowed_tools(router_path_for(doctor_dir, name))
        if not router_tools:
            result.warn(f"F1: could not extract allowed-tools from {name}.md frontmatter; skipping F2 for route '{target}'")
            continue
        for tool in tools:
            if tool not in router_tools:
                result.fail(f"F2: route '{target}' lists mcp_tool '{tool}' but it is NOT in {name}.md's allowed-tools union")
                f2_failed = True
    if not f2_failed:
        result.passed("F2: all route mcp_tools are subsets of their router's allowed-tools union")

    f3_failed = False
    for route in routes:
        target = route.get("target")
        entries = route.get("cli_commands")
        if entries is None:
            continue
        if not isinstance(entries, list):
            result.fail(f"F3: route '{target}' cli_commands is not a list")
            f3_failed = True
            continue
        for entry in entries:
            command = advisor_cli_command_name(entry)
            if command is None:
                result.fail(f"F3: route '{target}' cli_commands entry does not invoke {ADVISOR_CLI_RELATIVE_PATH}: {entry!r}")
                f3_failed = True
            elif command not in ADVISOR_CLI_COMMANDS:
                result.fail(f"F3: route '{target}' cli_commands entry names unknown advisor command '{command}': {entry!r}")
                f3_failed = True
    if not f3_failed:
        result.passed("F3: every cli_commands entry invokes the advisor CLI with a known command")


def check_trigger_phrases(routes: Sequence[Dict[str, Any]], result: Result) -> None:
    """G1: every route carries at least one trigger phrase."""
    g1_failed = False
    for route in routes:
        target = route.get("target")
        if len(route.get("trigger_phrases") or []) < 1:
            result.fail(f"G1: route '{target}' has empty trigger_phrases (schema requires >=1 descriptive phrase per route)")
            g1_failed = True
    if not g1_failed:
        result.passed("G1: every route has ≥1 trigger phrase")


def report_flag_collisions(routes: Sequence[Dict[str, Any]], result: Result) -> None:
    """H1: informational warning for a flag name shared by targets of one command.

    Targets of different commands never share a parse, so only a collision
    inside one router is worth a warning.
    """
    flag_owners: Dict[tuple, List[str]] = {}
    for route in routes:
        target = route.get("target")
        for flag in route.get("allowed_flags") or []:
            # Strip the value portion: "--scope=A|B" and "--server <name>" both name the flag only.
            name = re.split(r"[ =]", flag, 1)[0]
            flag_owners.setdefault((route.get("command"), name), []).append(target)
    for (command, name), owners in flag_owners.items():
        if len(owners) > 1:
            result.warn(f"H1: flag '{name}' appears in multiple {command} targets (allowed but informational): {', '.join(owners)}")


# ───────────────────────────────────────────────────────────────
# 6. CROSS-FILE ASSERTIONS (I TO L)
# ───────────────────────────────────────────────────────────────

def check_script_invocations(routes: Sequence[Dict[str, Any]], repo_root: Path, result: Result) -> None:
    """I1: every script a route invokes exists under the repo root."""
    i_failed = False
    for route in routes:
        target = route.get("target")
        for inv in route.get("script_invocations") or []:
            for script_rel in SCRIPT_PATH_RE.findall(inv):
                if not (repo_root / script_rel).exists():
                    result.fail(f"I1: route '{target}' script_invocations references missing local script: {script_rel}")
                    i_failed = True
    if not i_failed:
        result.passed("I1: all route script_invocations resolve to existing local scripts")


def check_target_parity(
    routes: Sequence[Dict[str, Any]],
    doctor_dir: Path,
    assets_dir: Path,
    result: Result,
) -> None:
    """J1: per command, manifest targets match the router table and, for a
    multi-route command, every presentation display."""
    by_command: Dict[str, Set[str]] = {}
    for route in routes:
        name = command_name(route)
        if name and route.get("target"):
            by_command.setdefault(name, set()).add(route["target"])
    j_failed = False
    for name, manifest_targets in sorted(by_command.items()):
        parity_checks = {f"{name}.md targets table": parse_router_targets(router_path_for(doctor_dir, name))}
        if len(manifest_targets) > 1:
            presentation_targets = parse_presentation_targets(presentation_path_for(assets_dir, name))
            parity_checks.update({
                f"{name} presentation menu (Accepted answers)": presentation_targets["menu"],
                f"{name} presentation 'Valid targets:' line": presentation_targets["valid_targets"],
                f"{name} presentation subsystem manifest table": presentation_targets["subsystem"],
            })
        for label, display_set in parity_checks.items():
            missing_from_display = manifest_targets - display_set
            extra_in_display = display_set - manifest_targets
            if missing_from_display or extra_in_display:
                details = []
                if missing_from_display:
                    details.append(f"missing from {label}: {', '.join(sorted(missing_from_display))}")
                if extra_in_display:
                    details.append(f"stale/extra in {label}: {', '.join(sorted(extra_in_display))}")
                result.fail(f"J1: target-set parity mismatch — {'; '.join(details)}")
                j_failed = True
    if not j_failed:
        result.passed(f"J1: targets are in parity with their router and presentation across {len(by_command)} commands")


def check_read_only_policy(routes: Sequence[Dict[str, Any]], assets_dir: Path, result: Result) -> None:
    """K1/K2: a read-only route neither describes a write nor grants a mutating advisor command."""
    k_failed = False
    for route in routes:
        target = route.get("target")
        if route.get("mutating") != "read-only":
            continue
        yaml_name = route.get("yaml")
        if yaml_name:
            yaml_path = assets_dir / yaml_name
            if yaml_path.exists() and WRITE_ACTIVITY_RE.search(yaml_path.read_text(encoding="utf-8")):
                result.fail(f"K1: route '{target}' is 'mutating: read-only' but its YAML ({yaml_path.name}) declares a write; reclassify as add-only/mutates or remove the write")
                k_failed = True
        mutating_commands = sorted(advisor_cli_commands(route) & KNOWN_MUTATING_ADVISOR_COMMANDS)
        if mutating_commands:
            result.fail(f"K2: route '{target}' is 'mutating: read-only' but grants known-mutating advisor commands: {', '.join(mutating_commands)}")
            k_failed = True
    if not k_failed:
        result.passed("K1/K2: no read-only route declares a write or grants a mutating advisor command")


def check_workflow_activity(routes: Sequence[Dict[str, Any]], assets_dir: Path, result: Result) -> None:
    """L1: every script a route invokes is named by a value in its workflow YAML."""
    l_failed = False
    l_checked = 0
    for route in routes:
        target = route.get("target")
        yaml_name = route.get("yaml")
        invocations = route.get("script_invocations") or []
        if not yaml_name or not invocations:
            continue
        yaml_path = assets_dir / yaml_name
        if not yaml_path.exists():
            continue  # D1 already reports the missing asset
        try:
            workflow_doc = yaml.safe_load(yaml_path.read_text(encoding="utf-8"))
        except yaml.YAMLError as e:
            result.fail(f"L1: route '{target}' workflow YAML ({yaml_path.name}) does not parse: {e}")
            l_failed = True
            continue
        workflow_text = "\n".join(yaml_string_values(workflow_doc, []))
        for inv in invocations:
            for script_rel in SCRIPT_PATH_RE.findall(inv):
                l_checked += 1
                if not workflow_mentions_script(workflow_text, script_rel):
                    result.fail(f"L1: route '{target}' declares {script_rel} in script_invocations but no activity in {yaml_path.name} invokes it")
                    l_failed = True
    if not l_failed:
        result.passed(f"L1: all {l_checked} route script invocations are invoked by their workflow YAML")


# ───────────────────────────────────────────────────────────────
# 7. MAIN
# ───────────────────────────────────────────────────────────────

def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    """Parse the validator's command line."""
    ap = argparse.ArgumentParser()
    ap.add_argument("--routes", required=True, help="Path to _routes.yaml")
    ap.add_argument("--doctor-dir", required=True, help="Path to the doctor command dir holding each <name>.md router")
    ap.add_argument("--assets-dir", required=True, help="Path to assets/ dir holding the workflows and presentations")
    ap.add_argument("--repo-root", required=True, help="Path to repository root (resolves script_invocations paths)")
    return ap.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> int:
    """
    Run every assertion group and print a summary.

    Args:
        argv: Command-line arguments; defaults to sys.argv[1:]

    Returns:
        0 when every assertion passes, 1 on any failure, 2 when the manifest
        cannot be used
    """
    args = parse_args(argv)
    routes_path = Path(args.routes)
    doctor_dir = Path(args.doctor_dir)
    assets_dir = Path(args.assets_dir)
    repo_root = Path(args.repo_root)

    result = Result()
    result.info(f"Manifest:     {routes_path}")
    result.info(f"Doctor dir:   {doctor_dir}")
    result.info(f"Assets:       {assets_dir}")
    result.info(f"Repo root:    {repo_root}")
    print("")

    manifest = load_manifest(routes_path, result)
    if manifest is None:
        return 2
    check_schema_version(manifest, result)

    routes = check_routes_list(manifest, result)
    if routes is None:
        return 1
    check_required_keys(routes, result)

    route_maps = [route for route in routes if isinstance(route, dict)]
    targets = [route.get("target") for route in route_maps]
    check_commands(route_maps, doctor_dir, result)
    check_duplicate_targets(targets, result)
    check_yaml_assets(route_maps, assets_dir, result)
    check_mutation_classes(route_maps, result)
    check_tool_declarations(route_maps, doctor_dir, result)
    check_trigger_phrases(route_maps, result)
    report_flag_collisions(route_maps, result)
    check_script_invocations(route_maps, repo_root, result)
    check_target_parity(route_maps, doctor_dir, assets_dir, result)
    check_read_only_policy(route_maps, assets_dir, result)
    check_workflow_activity(route_maps, assets_dir, result)

    print("")
    print("─────────────────────────────────────────────────────────────────")
    if result.fails == 0:
        print(f"{green('OK')}: route-validate — {len(routes)} routes validated, {result.warns} warnings")
        return 0
    print(f"{red('FAIL')}: route-validate — {result.fails} assertion failures, {result.warns} warnings", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
