#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: CREATE-BENCHMARK FAMILY REGISTRY PARITY
# ───────────────────────────────────────────────────────────────
"""Validate create-benchmark family routing and resource parity.

Usage: python3 test_create_benchmark_family_registry.py
Output: A PASS line or an assertion describing the first registry mismatch.
"""

import ast
import re
from pathlib import Path


GUIDE_ONLY_FAMILIES = frozenset({"agent_improvement"})
RESOURCE_KEY_ALIASES = {"mcp_promotion": "shared"}
CONFORMANCE_ASSETS = frozenset(
    {
        "conformance-benchmark-contract-template.md",
        "conformance-benchmark-fixture-manifest-template.md",
        "conformance-benchmark-lane-config-template.md",
        "conformance-benchmark-readme-template.md",
    }
)
CONFORMANCE_GUIDE = "conformance-benchmark-authoring-guide.md"
LANE_OWNED_TEMPLATE_PATTERN = re.compile(
    r"(?:^|[_-])(runner|rubric|scorer|adapter|reducer)(?:[_-]|$)",
    re.IGNORECASE,
)


def _extract_families(skill_text: str) -> tuple[str, ...]:
    """Return the literal FAMILIES discriminator from the SKILL router."""
    match = re.search(r"FAMILIES\s*=\s*(\[[^\]]+\])", skill_text, re.DOTALL)
    assert match, "create-benchmark SKILL.md has no literal FAMILIES list"
    families = ast.literal_eval(match.group(1))
    assert isinstance(families, list) and all(
        isinstance(family, str) for family in families
    ), "FAMILIES must be a literal list of strings"
    assert len(families) == len(set(families)), "FAMILIES contains duplicate keys"
    return tuple(families)


def _extract_family_table(skill_text: str) -> str:
    """Return only the benchmark family table section."""
    match = re.search(
        r"### Benchmark Families\n(?P<table>.*?)\n### Routing Decision",
        skill_text,
        re.DOTALL,
    )
    assert match, "create-benchmark SKILL.md has no Benchmark Families table"
    return match.group("table")


def _resource_keys(root: Path) -> set[str]:
    """Return direct child directory names for a resource root."""
    assert root.is_dir(), f"resource root missing: {root}"
    return {path.name for path in root.iterdir() if path.is_dir()}


def validate_registry() -> None:
    """Assert router, resources, projections, and ownership boundaries agree."""
    sk_doc_root = Path(__file__).resolve().parents[2]
    benchmark_root = sk_doc_root / "create-benchmark"
    assets_root = benchmark_root / "assets"
    references_root = benchmark_root / "references"
    skill_text = (benchmark_root / "SKILL.md").read_text(encoding="utf-8")
    readme_text = (benchmark_root / "README.md").read_text(encoding="utf-8")
    families = _extract_families(skill_text)
    family_table = _extract_family_table(skill_text)

    assert GUIDE_ONLY_FAMILIES <= set(families), (
        "guide-only family allowlist must remain a subset of FAMILIES"
    )
    for family in families:
        resource_key = RESOURCE_KEY_ALIASES.get(family, family.replace("_", "-"))
        reference_dir = references_root / resource_key
        asset_dir = assets_root / resource_key
        assert reference_dir.is_dir(), (
            f"family '{family}' is missing references/{resource_key}/"
        )
        if family in GUIDE_ONLY_FAMILIES:
            continue
        assert asset_dir.is_dir(), f"family '{family}' is missing assets/{resource_key}/"

    resource_keys = _resource_keys(assets_root) | _resource_keys(references_root)
    # Disk dirs are kebab-case; map each back to the token that documents it — the snake_case
    # family key for the benchmark families, or the dir's own name (shared) when no family key
    # kebab-cases to it.
    doc_token_by_dir = {family.replace("_", "-"): family for family in families}
    for resource_key in sorted(resource_keys):
        token = f"`{doc_token_by_dir.get(resource_key, resource_key)}`"
        assert token in family_table, (
            f"resource key '{resource_key}' is missing from the SKILL family table"
        )
        assert token in readme_text, (
            f"resource key '{resource_key}' is missing from create-benchmark README.md"
        )

    conformance_asset_dir = assets_root / "conformance-benchmark"
    conformance_assets = {
        path.name for path in conformance_asset_dir.iterdir() if path.is_file()
    }
    assert CONFORMANCE_ASSETS <= conformance_assets, (
        "conformance_benchmark is missing one or more required templates: "
        f"{sorted(CONFORMANCE_ASSETS - conformance_assets)}"
    )
    guide_path = references_root / "conformance-benchmark" / CONFORMANCE_GUIDE
    assert guide_path.is_file(), f"conformance_benchmark guide missing: {guide_path}"

    for template_path in assets_root.rglob("*template*"):
        if not template_path.is_file():
            continue
        assert not LANE_OWNED_TEMPLATE_PATTERN.search(template_path.stem), (
            "family assets must not template lane-owned runners, rubrics, scorers, "
            f"adapters, or reducers: {template_path}"
        )

    print(
        "PASS: create-benchmark family registry parity "
        f"({len(families)} families, {len(resource_keys)} resource keys)"
    )


if __name__ == "__main__":
    validate_registry()
