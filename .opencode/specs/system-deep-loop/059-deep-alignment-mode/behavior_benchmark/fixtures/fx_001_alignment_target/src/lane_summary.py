#!/usr/bin/env python3
"""Summarize a resolved deep-alignment lane list into a short human report.

Small, standalone helper used as fixture code: it takes the kind of lane
tuples scoping.cjs already resolves (authority, artifactClass, scope) and
renders them as a compact one-line-per-lane summary, with no side effects
and no dependency on any particular authority's own tooling.
"""

from __future__ import annotations

from typing import Any, Dict, List


def summarize_scope(scope: Dict[str, Any]) -> str:
    """Render one lane's scope as a short human-readable string."""
    scope_type = scope.get("type")
    if scope_type == "branchRange":
        return f"{scope.get('from')}..{scope.get('to')}"
    values = scope.get("values") or []
    return ", ".join(values)


def summarize_lanes(lanes: List[Dict[str, Any]]) -> List[str]:
    """Render each resolved lane as one 'authority / artifactClass / scope' line."""
    lines = []
    for lane in lanes:
        authority = lane.get("authority", "unknown")
        artifact_class = lane.get("artifactClass", "unknown")
        scope_summary = summarize_scope(lane.get("scope", {}))
        lines.append(f"{authority} / {artifact_class} / {scope_summary}")
    return lines


if __name__ == "__main__":
    example_lanes = [
        {"authority": "sk-doc", "artifactClass": "docs", "scope": {"type": "paths", "values": ["docs/"]}},
        {"authority": "sk-code", "artifactClass": "code", "scope": {"type": "globs", "values": ["src/**"]}},
    ]
    for line in summarize_lanes(example_lanes):
        print(line)
