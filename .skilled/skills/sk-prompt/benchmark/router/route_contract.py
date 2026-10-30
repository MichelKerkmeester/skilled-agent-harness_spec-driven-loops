#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SK-PROMPT ROUTE CONTRACT
# ───────────────────────────────────────────────────────────────

"""Run the documented router block against recorded fixtures.

Routing is declared in prose and pseudocode, so it can drift from what a reader
expects with nothing to catch it. This harness executes the real ROUTER.md block
in-process and compares its decisions to fixtures, which makes routing checkable
without a model in the loop.
"""

import json
import re
import sys
from pathlib import Path

ROUTER = Path(__file__).resolve().parents[2] / "ROUTER.md"
ROUTER_HEADING = "### Smart Router Pseudocode"
FENCE_PATTERN = re.compile(r"```python[ \t]*\n(.*?)```", re.S)
DEFAULT_LOAD_LEVEL = "STANDARD"


def die(message):
    """Report a setup problem the harness cannot correct and stop with exit 2."""
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(2)


def show(value):
    """Render a value so expected and actual read the same way in a report line."""
    return json.dumps(value, ensure_ascii=False)


def extract_block():
    """Return the single python fenced block that follows the router heading."""
    if not ROUTER.exists():
        die(f"router not found: {ROUTER}")
    text = ROUTER.read_text(encoding="utf-8")
    start = text.find(ROUTER_HEADING)
    if start < 0:
        die(f"heading not found in {ROUTER.name}: {ROUTER_HEADING}")
    blocks = FENCE_PATTERN.findall(text[start:])
    if not blocks:
        die(f"no python block found under {ROUTER_HEADING}")
    if len(blocks) > 1:
        die(f"expected one python block under {ROUTER_HEADING}, found {len(blocks)}")
    return blocks[0]


def build_route():
    """Execute the documented block and return its routing entry point."""
    source = extract_block()
    namespace = {
        "__file__": str(ROUTER),
        "__name__": "sk_prompt_router",
        "load": lambda path: None,
    }
    exec(compile(source, str(ROUTER), "exec"), namespace)
    route = namespace.get("route_prompt_improver_resources")
    if not callable(route):
        die("router block does not define route_prompt_improver_resources")
    return route


def compare(fixture, route):
    """Return one report line per mismatch, comparing only the expected keys."""
    fixture_id = fixture.get("id", "<no id>")
    expect = fixture.get("expect") or {}
    result = route(fixture.get("request", ""))
    if not isinstance(result, dict):
        return [f"FAIL {fixture_id}: result expected a dict got {show(result)}"]

    lines = []
    if "intents" in expect:
        got = result.get("intents")
        got = list(got) if isinstance(got, (list, tuple)) else got
        if got != expect["intents"]:
            lines.append(f"FAIL {fixture_id}: intents expected {show(expect['intents'])} got {show(got)}")
    if "resources" in expect:
        got = result.get("resources")
        got = list(got) if isinstance(got, (list, tuple)) else got
        if got != expect["resources"]:
            lines.append(f"FAIL {fixture_id}: resources expected {show(expect['resources'])} got {show(got)}")
    if "load_level" in expect:
        got = result.get("load_level", DEFAULT_LOAD_LEVEL)
        if got != expect["load_level"]:
            lines.append(f"FAIL {fixture_id}: load_level expected {show(expect['load_level'])} got {show(got)}")
    return lines


def main(argv):
    if len(argv) != 2:
        die("usage: route_contract.py <fixtures.json>")
    fixtures_path = Path(argv[1])
    if not fixtures_path.exists():
        die(f"fixtures not found: {fixtures_path}")
    try:
        fixtures = json.loads(fixtures_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        die(f"fixtures are not valid JSON: {error}")
    if not isinstance(fixtures, list) or not fixtures:
        die("fixtures file must hold a non-empty JSON list")

    route = build_route()
    failing = 0
    for fixture in fixtures:
        lines = compare(fixture, route)
        if lines:
            failing += 1
            for line in lines:
                print(line)

    total = len(fixtures)
    if failing:
        print(f"FAILED {failing}/{total} fixtures")
        return 1
    print(f"PASSED {total}/{total} fixtures")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
