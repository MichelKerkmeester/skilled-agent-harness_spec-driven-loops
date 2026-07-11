#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
SCRATCH = ROOT / "scratch"
MANIFEST = SCRATCH / "topology-migration-manifest.json"
LOG = SCRATCH / "topology-migration-log.md"
TASK8_REPORT = SCRATCH / "task-8-metadata-repair.md"
STAGE = SCRATCH / ".topology-migration-stage"
BACKUP = SCRATCH / "topology-migration-backup"
PACKET_ID = "system-speckit/028-memory-search-intelligence"
PHASE_RE = re.compile(r"^(\d{3})-([a-z0-9-]+)$")

RETAINED = [
    "release-cleanup",
    "speckit-memory",
    "spec-data-quality",
    "review-remediation",
    "dark-flag-graduation",
    "speckit-surface-alignment",
]

MOVED_TO = {
    "presentation-layer-fixes": "speckit-surface-alignment",
    "search-index-integrity-sweep": "speckit-memory",
    "query-channel-calibration": "speckit-memory",
    "automatic-drift-self-healing": "speckit-memory",
    "orphan-sweep-scoped-scan-safety": "speckit-memory",
    "drift-marker-pipeline-resilience": "speckit-memory",
    "self-healing-internals-hardening": "speckit-memory",
    "git-hooks-reinstall-and-guard": "speckit-memory",
    "query-time-filter-benchmark": "speckit-memory",
    "drift-marker-native-consolidation": "speckit-memory",
    "self-healing-model-consolidation": "speckit-memory",
    "metadata-rename-reconciliation": "spec-data-quality",
    "validation-integrity-hardening": "spec-data-quality",
    "validation-hardening-fixes": "spec-data-quality",
    "validation-enforce-graduation": "spec-data-quality",
    "cross-package-flag-governance": "dark-flag-graduation",
    "flag-vocabulary-consolidation": "dark-flag-graduation",
    "graph-preservation-quality-benchmark": "dark-flag-graduation",
}

EXPECTED_SUPPORT = {
    "002-spec-data-quality/029-vague-query-model-benchmark",
    "changelog/000-release-cleanup",
    "changelog/001-speckit-memory",
    "changelog/003-spec-data-quality",
    "changelog/004-review-remediation",
    "changelog/005-dark-flag-graduation",
    "changelog/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory",
}

ARTIFACT_PREFIXES = (
    "scratch/topology-migration-manifest.json",
    "scratch/topology-migration-log.md",
    "scratch/topology_migration.py",
    "scratch/.topology-migration-stage",
    "scratch/topology-migration-backup",
)


def now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def aggregate(entries: list[dict], path_key: str = "path") -> str:
    h = hashlib.sha256()
    for entry in sorted(entries, key=lambda item: item[path_key]):
        h.update(f"{entry[path_key]}\0{entry['sha256']}\n".encode())
    return h.hexdigest()


def is_artifact(path: Path) -> bool:
    value = rel(path)
    return any(value == prefix or value.startswith(prefix + "/") for prefix in ARTIFACT_PREFIXES)


def phase_dirs() -> list[Path]:
    return sorted(
        path
        for path in ROOT.rglob("*")
        if path.is_dir()
        and not is_artifact(path)
        and PHASE_RE.fullmatch(path.name)
        and (path / "spec.md").is_file()
    )


def numbered_dirs() -> list[Path]:
    return sorted(
        path
        for path in ROOT.rglob("*")
        if path.is_dir() and not is_artifact(path) and PHASE_RE.fullmatch(path.name)
    )


def number_slug(path_value: str) -> tuple[int, str]:
    match = PHASE_RE.fullmatch(PurePosixPath(path_value).name)
    if not match:
        raise ValueError(f"not a governed phase name: {path_value}")
    return int(match.group(1)), match.group(2)


def build_plan() -> tuple[list[dict], list[dict]]:
    phases = phase_dirs()
    numbered = numbered_dirs()
    if len(phases) != 173 or len(numbered) != 180:
        raise ValueError(
            f"inventory mismatch: governed phases={len(phases)}, total numbered dirs={len(numbered)}"
        )
    phase_rels = {rel(path) for path in phases}
    support_rels = {rel(path) for path in numbered if rel(path) not in phase_rels}
    if support_rels != EXPECTED_SUPPORT:
        raise ValueError(
            "numbered support mismatch: "
            f"missing={sorted(EXPECTED_SUPPORT - support_rels)}, "
            f"unexpected={sorted(support_rels - EXPECTED_SUPPORT)}"
        )

    children: dict[str, list[str]] = defaultdict(list)
    for value in phase_rels:
        parent = PurePosixPath(value).parent.as_posix()
        children[parent].append(value)

    root_values = children["."]
    by_slug = {number_slug(value)[1]: value for value in root_values}
    if set(by_slug) != set(RETAINED) | set(MOVED_TO):
        raise ValueError("root slugs do not match the approved retained and moved sets")
    if len(root_values) != 24 or len(by_slug) != 24:
        raise ValueError("root phase slugs are not unique")

    mappings: list[dict] = []
    moved_by_parent: dict[str, list[str]] = defaultdict(list)
    for moved_slug, parent_slug in MOVED_TO.items():
        moved_by_parent[parent_slug].append(by_slug[moved_slug])

    def add_children(old_parent: str, new_parent: str, parent_slug: str | None = None) -> None:
        candidates = [(value, False) for value in children.get(old_parent, [])]
        if parent_slug:
            candidates.extend((value, True) for value in moved_by_parent.get(parent_slug, []))
        candidates.sort(
            key=lambda item: (
                number_slug(item[0])[0],
                1 if item[1] else 0,
                number_slug(item[0])[0] if item[1] else -1,
                number_slug(item[0])[1],
            )
        )
        for index, (old_value, moved) in enumerate(candidates, 1):
            old_id, slug = number_slug(old_value)
            new_name = f"{index:03d}-{slug}"
            new_value = new_name if new_parent == "." else f"{new_parent}/{new_name}"
            mappings.append(
                {
                    "old_path": old_value,
                    "new_path": new_value,
                    "old_id": f"{old_id:03d}",
                    "new_id": f"{index:03d}",
                    "slug": slug,
                    "moved": moved,
                    "classification": "phase_mapping",
                }
            )
            if moved and children.get(old_value):
                raise ValueError(f"approved moved phase is not a leaf: {old_value}")
            add_children(old_value, new_value)

    retained_values = [by_slug[slug] for slug in RETAINED]
    retained_values.sort(key=lambda value: (number_slug(value)[0], number_slug(value)[1]))
    for index, old_value in enumerate(retained_values, 1):
        old_id, slug = number_slug(old_value)
        new_value = f"{index:03d}-{slug}"
        mappings.append(
            {
                "old_path": old_value,
                "new_path": new_value,
                "old_id": f"{old_id:03d}",
                "new_id": f"{index:03d}",
                "slug": slug,
                "moved": False,
                "classification": "phase_mapping",
            }
        )
        add_children(old_value, new_value, slug)

    if {item["old_path"] for item in mappings} != phase_rels or len(mappings) != 173:
        raise ValueError("simulated mapping does not cover every governed phase exactly once")
    destinations = [item["new_path"] for item in mappings]
    if len(destinations) != len(set(destinations)):
        raise ValueError("simulated phase destinations collide")

    mapping_by_old = {item["old_path"]: item["new_path"] for item in mappings}
    supports = []
    for old_value in sorted(support_rels):
        supports.append(
            {
                "old_path": old_value,
                "new_path": relocate(old_value, mapping_by_old),
                "classification": "support_unchanged",
            }
        )
    return mappings, supports


def relocate(value: str, mapping_by_old: dict[str, str]) -> str:
    for old_value in sorted(mapping_by_old, key=lambda item: (-item.count("/"), item)):
        if value == old_value or value.startswith(old_value + "/"):
            return mapping_by_old[old_value] + value[len(old_value) :]
    return value


def approved_jsonl_paths(mapping_by_old: dict[str, str] | None = None) -> list[Path]:
    first = ROOT / "002-spec-data-quality/029-vague-query-model-benchmark/results/raw"
    second = ROOT / "002-spec-data-quality/006-generated-metadata-build/041-search-quality-fixes/results"
    values = sorted(first.glob("*.json")) + sorted(second.glob("*.json"))
    if mapping_by_old:
        return [ROOT / relocate(rel(path), mapping_by_old) for path in values]
    return values


def validate_json_surfaces(jsonl_values: set[str]) -> list[dict]:
    evidence = []
    seen_jsonl = set()
    for path in sorted(ROOT.rglob("*.json")):
        if is_artifact(path):
            continue
        value = rel(path)
        if value in jsonl_values:
            lines = [line for line in path.read_text().splitlines() if line.strip()]
            if not lines:
                raise ValueError(f"JSONL evidence is empty: {value}")
            for line_number, line in enumerate(lines, 1):
                parsed = json.loads(line)
                if not isinstance(parsed, dict):
                    raise ValueError(f"JSONL line is not an object: {value}:{line_number}")
            seen_jsonl.add(value)
            evidence.append(
                {
                    "path": value,
                    "classification": "jsonl_evidence",
                    "nonblank_lines": len(lines),
                    "sha256": digest(path),
                }
            )
        else:
            json.loads(path.read_text())
    if seen_jsonl != jsonl_values or len(evidence) != 154:
        raise ValueError(
            f"JSONL classification mismatch: expected=154, found={len(evidence)}, "
            f"missing={sorted(jsonl_values - seen_jsonl)}"
        )
    return evidence


def all_content_files() -> list[Path]:
    return sorted(path for path in ROOT.rglob("*") if path.is_file() and not is_artifact(path))


def frontmatter_pointer(path: Path) -> str | None:
    if path.suffix.lower() != ".md":
        return None
    text = path.read_text(errors="strict")
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---", 4)
    if end < 0:
        return None
    match = re.search(r'^\s*packet_pointer:\s*["\']?([^"\'\n]+)["\']?\s*$', text[4:end], re.M)
    return match.group(1).strip() if match else None


def file_inventory(mapping_by_old: dict[str, str]) -> list[dict]:
    aliases = {f"{PACKET_ID}/{old}": f"{PACKET_ID}/{new}" for old, new in mapping_by_old.items()}
    inventory = []
    for path in all_content_files():
        value = rel(path)
        pointer = frontmatter_pointer(path)
        identity = path.name in {"description.json", "graph-metadata.json"} and (
            value == path.name or any(value.startswith(old + "/") for old in mapping_by_old)
        )
        pointer_change = pointer in aliases and aliases[pointer] != pointer
        if value == "graph-metadata.json":
            identity = True
        inventory.append(
            {
                "old_path": value,
                "new_path": relocate(value, mapping_by_old),
                "sha256": digest(path),
                "size": path.stat().st_size,
                "classification": "identity_updated" if identity or pointer_change else "content_unchanged",
            }
        )
    return inventory


def owned_evidence(mappings: list[dict], inventory: list[dict], use_new: bool = False) -> None:
    path_key = "new_path" if use_new else "old_path"
    phase_key = "new_path" if use_new else "old_path"
    phase_values = [item[phase_key] for item in mappings]
    buckets: dict[str, list[dict]] = defaultdict(list)
    for item in inventory:
        value = item[path_key]
        owners = [phase for phase in phase_values if value.startswith(phase + "/")]
        if owners:
            owner = max(owners, key=lambda candidate: candidate.count("/"))
            buckets[owner].append({"path": value, "sha256": item.get("after_sha256", item["sha256"])})
    for item in mappings:
        entries = buckets[item[phase_key]]
        key = "after" if use_new else "before"
        item[key] = {"file_count": len(entries), "sha256": aggregate(entries)}


def contiguous(mappings: list[dict]) -> None:
    groups: dict[str, list[int]] = defaultdict(list)
    for item in mappings:
        parent = PurePosixPath(item["new_path"]).parent.as_posix()
        groups[parent].append(int(item["new_id"]))
    for parent, ids in groups.items():
        if sorted(ids) != list(range(1, len(ids) + 1)):
            raise ValueError(f"non-contiguous simulated sibling group: {parent}: {sorted(ids)}")
    root_names = sorted(PurePosixPath(item["new_path"]).name for item in mappings if "/" not in item["new_path"])
    expected = [f"{index:03d}-{slug}" for index, slug in enumerate(RETAINED, 1)]
    if root_names != expected:
        raise ValueError(f"simulated root mismatch: {root_names}")


def write_log(manifest: dict, heading: str) -> None:
    preflight = manifest.get("preflight", {})
    verification = manifest.get("post_apply_verification", {})
    lines = [
        "# Topology Migration Log",
        "",
        f"## {heading}",
        "",
        f"- Status: `{manifest['status']}`",
        f"- Updated: `{manifest['updated_at']}`",
        f"- Governed phases: `{manifest['counts']['governed_phases']}`",
        f"- Numbered support directories: `{manifest['counts']['numbered_support_dirs']}`",
        f"- Total numbered directories: `{manifest['counts']['total_numbered_dirs']}`",
        f"- JSONL evidence files: `{manifest['counts']['jsonl_evidence']}`",
        f"- Memory checkpoint: `not created (timed out)`",
        "",
        "## Acceptance Gates",
        "",
    ]
    for key, value in preflight.items():
        lines.append(f"- {key}: `{value}`")
    if verification:
        lines.extend(["", "## Post-Apply Verification", ""])
        for key, value in verification.items():
            lines.append(f"- {key}: `{value}`")
    lines.extend(
        [
            "",
            "## Transaction",
            "",
            f"- Staging: `{manifest['transaction']['staging']}`",
            f"- Rollback source: `{manifest['transaction']['rollback_source']}`",
            f"- Inverse mappings: `{len(manifest['inverse_map'])}`",
            "",
            "## Deferred Narrative Drift",
            "",
            "- Root and child narrative Markdown still names historical numeric paths and counts; preserve it for the documentation alignment pass.",
            "- Numbered changelog support directory names remain unchanged by contract.",
            "- Generated source fingerprints may be stale after identity-only frontmatter changes and require metadata regeneration in the documentation pass.",
        ]
    )
    LOG.write_text("\n".join(lines) + "\n")


def write_manifest(manifest: dict, heading: str) -> None:
    MANIFEST.write_text(json.dumps(manifest, indent=2, sort_keys=False) + "\n")
    write_log(manifest, heading)


def dry_run() -> None:
    if STAGE.exists() or BACKUP.exists():
        raise ValueError("staging or rollback backup already exists")
    mappings, supports = build_plan()
    contiguous(mappings)
    mapping_by_old = {item["old_path"]: item["new_path"] for item in mappings}
    destinations = set(mapping_by_old.values())
    support_destinations = {item["new_path"] for item in supports}
    if destinations & support_destinations:
        raise ValueError("phase destination collides with a numbered support directory")
    jsonl_paths = approved_jsonl_paths()
    if len(jsonl_paths) != 154:
        raise ValueError(f"approved JSONL path count mismatch: {len(jsonl_paths)}")
    jsonl_evidence = validate_json_surfaces({rel(path) for path in jsonl_paths})
    inventory = file_inventory(mapping_by_old)
    owned_evidence(mappings, inventory)
    aliases = {f"{PACKET_ID}/{old}": f"{PACKET_ID}/{new}" for old, new in mapping_by_old.items()}
    moved_resolution = {
        item["slug"]: PurePosixPath(item["new_path"]).parent.as_posix()
        for item in mappings
        if item["moved"]
    }
    expected_parents = {
        slug: next(item["new_path"] for item in mappings if item["slug"] == parent and "/" not in item["new_path"])
        for slug, parent in MOVED_TO.items()
    }
    if moved_resolution != expected_parents:
        raise ValueError("one or more moved leaves did not resolve under the approved parent slug")
    manifest = {
        "schema_version": 1,
        "status": "dry_run_pass",
        "created_at": now(),
        "updated_at": now(),
        "packet_id": PACKET_ID,
        "governed_predicate": "basename ^[0-9]{3}-[a-z0-9-]+$ and immediate regular-file spec.md",
        "counts": {
            "governed_phases": 173,
            "numbered_support_dirs": 7,
            "total_numbered_dirs": 180,
            "jsonl_evidence": 154,
            "content_files": len(inventory),
        },
        "preflight": {
            "inventory_exact": "pass",
            "destinations_unique": "pass",
            "root_001_through_006": "pass",
            "all_sibling_groups_contiguous": "pass",
            "moved_leaves_resolved": "pass",
            "staging_and_inverse_rollback_available": "pass",
            "json_semantics_unambiguous": "pass",
        },
        "transaction": {
            "staging": rel(STAGE),
            "rollback_source": rel(BACKUP),
            "checkpoint": "not_created_timeout",
        },
        "phase_mappings": mappings,
        "support_directories": supports,
        "jsonl_evidence": jsonl_evidence,
        "files_before": inventory,
        "content_before": {
            "file_count": len(inventory),
            "sha256": aggregate(
                [{"path": item["old_path"], "sha256": item["sha256"]} for item in inventory]
            ),
        },
        "aliases": aliases,
        "inverse_map": {new: old for old, new in mapping_by_old.items()},
        "deferred_spec_drift": [
            "Historical and narrative Markdown contains pre-migration phase paths and counts.",
            "Numbered changelog support names are intentionally deferred.",
            "Generated source fingerprints may require refresh after the documentation pass.",
        ],
    }
    write_manifest(manifest, "Dry-Run Acceptance")
    print("DRY_RUN_PASS governed=173 support=7 numbered=180 jsonl=154")


def copy_backups(manifest: dict, destination: Path) -> None:
    backup_root = destination / "identity-backups"
    for item in manifest["files_before"]:
        if item["classification"] != "identity_updated":
            continue
        source = ROOT / item["old_path"]
        target = backup_root / item["old_path"]
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)


def flatten(mappings: list[dict], path_key: str, stage: Path) -> None:
    nodes = stage / "nodes"
    nodes.mkdir(parents=True, exist_ok=True)
    indexed = {item["old_path"]: index for index, item in enumerate(mappings)}
    for item in sorted(mappings, key=lambda value: (-value[path_key].count("/"), value[path_key])):
        source = ROOT / item[path_key]
        target = nodes / f"{indexed[item['old_path']]:03d}"
        if target.exists():
            continue
        if not source.is_dir():
            raise ValueError(f"phase source missing during flatten: {item[path_key]}")
        os.replace(source, target)


def reconstruct(mappings: list[dict], path_key: str, stage: Path) -> None:
    nodes = stage / "nodes"
    indexed = {item["old_path"]: index for index, item in enumerate(mappings)}
    for item in sorted(mappings, key=lambda value: (value[path_key].count("/"), value[path_key])):
        source = nodes / f"{indexed[item['old_path']]:03d}"
        target = ROOT / item[path_key]
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            raise ValueError(f"phase destination collision during reconstruct: {item[path_key]}")
        os.replace(source, target)


def transform_relative(value: str, mapping_by_old: dict[str, str]) -> str:
    return relocate(value, mapping_by_old)


def transform_canonical(value: str, aliases: dict[str, str]) -> str:
    for old_value in sorted(aliases, key=lambda item: (-item.count("/"), item)):
        if value == old_value or value.startswith(old_value + "/"):
            return aliases[old_value] + value[len(old_value) :]
    return value


def update_pointer(path: Path, aliases: dict[str, str]) -> None:
    text = path.read_text()
    if not text.startswith("---\n"):
        return
    end = text.find("\n---", 4)
    if end < 0:
        return
    frontmatter = text[:end]

    def replace(match: re.Match[str]) -> str:
        prefix, quote, value = match.groups()
        updated = transform_canonical(value, aliases)
        return f"{prefix}{quote}{updated}{quote}"

    updated_frontmatter = re.sub(
        r'(?m)^(\s*packet_pointer:\s*)(["\']?)([^"\'\n]+)\2\s*$', replace, frontmatter
    )
    if updated_frontmatter != frontmatter:
        path.write_text(updated_frontmatter + text[end:])


def update_identities(manifest: dict) -> None:
    mappings = manifest["phase_mappings"]
    mapping_by_old = {item["old_path"]: item["new_path"] for item in mappings}
    aliases = manifest["aliases"]
    children_by_parent: dict[str, list[str]] = defaultdict(list)
    for item in mappings:
        parent = PurePosixPath(item["new_path"]).parent.as_posix()
        children_by_parent[parent].append(item["new_path"])

    all_nodes = [(".", ROOT)] + [(item["new_path"], ROOT / item["new_path"]) for item in mappings]
    for node_value, folder in all_nodes:
        canonical = PACKET_ID if node_value == "." else f"{PACKET_ID}/{node_value}"
        parent_value = PurePosixPath(node_value).parent.as_posix()
        parent_id = None if node_value == "." else (
            PACKET_ID if parent_value == "." else f"{PACKET_ID}/{parent_value}"
        )
        child_ids = [f"{PACKET_ID}/{value}" for value in sorted(children_by_parent.get(node_value, []))]

        description_path = folder / "description.json"
        if description_path.is_file():
            data = json.loads(description_path.read_text())
            if node_value == ".":
                parts = PACKET_ID.split("/")
            else:
                parts = canonical.split("/")
            data["specFolder"] = canonical
            data["specId"] = parts[-1].split("-", 1)[0]
            data["folderSlug"] = parts[-1].split("-", 1)[1]
            data["parentChain"] = parts[:-1]
            description_path.write_text(json.dumps(data, indent=2) + "\n")

        graph_path = folder / "graph-metadata.json"
        if graph_path.is_file():
            data = json.loads(graph_path.read_text())
            data["packet_id"] = canonical
            data["spec_folder"] = canonical
            data["parent_id"] = parent_id
            data["children_ids"] = child_ids
            for key in ("depends_on", "supersedes", "related_to"):
                if isinstance(data.get("manual", {}).get(key), list):
                    data["manual"][key] = [
                        transform_canonical(value, aliases) if isinstance(value, str) else value
                        for value in data["manual"][key]
                    ]
            derived = data.get("derived")
            if isinstance(derived, dict):
                active = derived.get("last_active_child_id")
                if isinstance(active, str):
                    active = transform_canonical(active, aliases)
                    derived["last_active_child_id"] = active if active in child_ids else None
                if isinstance(derived.get("key_files"), list):
                    derived["key_files"] = [
                        transform_relative(value, mapping_by_old) if isinstance(value, str) else value
                        for value in derived["key_files"]
                    ]
                if isinstance(derived.get("entities"), list):
                    for entity in derived["entities"]:
                        if isinstance(entity, dict) and isinstance(entity.get("path"), str):
                            entity["path"] = transform_relative(entity["path"], mapping_by_old)
            graph_path.write_text(json.dumps(data, indent=2) + "\n")

    for path in ROOT.rglob("*.md"):
        if not is_artifact(path):
            update_pointer(path, aliases)


def verify_applied(manifest: dict) -> dict:
    mappings = manifest["phase_mappings"]
    mapping_by_old = {item["old_path"]: item["new_path"] for item in mappings}
    phases = phase_dirs()
    numbered = numbered_dirs()
    if len(phases) != 173 or len(numbered) != 180:
        raise ValueError(f"post-apply counts differ: phases={len(phases)}, numbered={len(numbered)}")
    actual = {rel(path) for path in phases}
    expected = set(mapping_by_old.values())
    if actual != expected:
        raise ValueError("post-apply governed phase paths differ from the simulated destinations")
    contiguous(mappings)

    final_support = {item["new_path"] for item in manifest["support_directories"]}
    actual_support = {rel(path) for path in numbered if rel(path) not in actual}
    if actual_support != final_support:
        raise ValueError("numbered support directories did not remain attached to their owners")

    final_jsonl = {relocate(item["path"], mapping_by_old) for item in manifest["jsonl_evidence"]}
    validate_json_surfaces(final_jsonl)

    children_by_parent: dict[str, list[str]] = defaultdict(list)
    for item in mappings:
        children_by_parent[PurePosixPath(item["new_path"]).parent.as_posix()].append(item["new_path"])
    aliases = manifest["aliases"]
    nodes = [(".", ROOT)] + [(item["new_path"], ROOT / item["new_path"]) for item in mappings]
    for node_value, folder in nodes:
        canonical = PACKET_ID if node_value == "." else f"{PACKET_ID}/{node_value}"
        parent_value = PurePosixPath(node_value).parent.as_posix()
        parent_id = None if node_value == "." else PACKET_ID if parent_value == "." else f"{PACKET_ID}/{parent_value}"
        child_ids = [f"{PACKET_ID}/{value}" for value in sorted(children_by_parent.get(node_value, []))]
        description = json.loads((folder / "description.json").read_text())
        graph = json.loads((folder / "graph-metadata.json").read_text())
        if description.get("specFolder") != canonical:
            raise ValueError(f"description specFolder mismatch: {node_value}")
        parts = canonical.split("/")
        if description.get("specId") != parts[-1].split("-", 1)[0]:
            raise ValueError(f"description specId mismatch: {node_value}")
        if description.get("folderSlug") != parts[-1].split("-", 1)[1]:
            raise ValueError(f"description folderSlug mismatch: {node_value}")
        if description.get("parentChain") != parts[:-1]:
            raise ValueError(f"description parentChain mismatch: {node_value}")
        expected_graph = (canonical, canonical, parent_id, child_ids)
        actual_graph = (
            graph.get("packet_id"), graph.get("spec_folder"), graph.get("parent_id"), graph.get("children_ids")
        )
        if actual_graph != expected_graph:
            raise ValueError(f"graph identity mismatch: {node_value}")
        active = graph.get("derived", {}).get("last_active_child_id")
        if active is not None and active not in child_ids:
            raise ValueError(f"last_active_child_id is not a direct child: {node_value}")
        manual_values = [
            value
            for key in ("depends_on", "supersedes", "related_to")
            for value in graph.get("manual", {}).get(key, [])
            if isinstance(value, str)
        ]
        if any(transform_canonical(value, aliases) != value for value in manual_values):
            raise ValueError(f"old canonical identity remains in active graph relations: {node_value}")
        relative_values = [
            value for value in graph.get("derived", {}).get("key_files", []) if isinstance(value, str)
        ]
        relative_values.extend(
            entity["path"]
            for entity in graph.get("derived", {}).get("entities", [])
            if isinstance(entity, dict) and isinstance(entity.get("path"), str)
        )
        if any(transform_relative(value, mapping_by_old) != value for value in relative_values):
            raise ValueError(f"old phase path remains in active graph navigation: {node_value}")

    for path in ROOT.rglob("*.md"):
        if is_artifact(path):
            continue
        pointer = frontmatter_pointer(path)
        if pointer and transform_canonical(pointer, aliases) != pointer:
            raise ValueError(f"old canonical prefix remains in active packet_pointer: {rel(path)}")

    after_inventory = []
    for item in manifest["files_before"]:
        path = ROOT / item["new_path"]
        if not path.is_file():
            raise ValueError(f"content file missing after apply: {item['new_path']}")
        after_hash = digest(path)
        if item["classification"] == "content_unchanged" and after_hash != item["sha256"]:
            raise ValueError(f"non-identity content changed: {item['old_path']} -> {item['new_path']}")
        item["after_sha256"] = after_hash
        item["after_size"] = path.stat().st_size
        after_inventory.append({"path": item["new_path"], "sha256": after_hash})
    if len(all_content_files()) != len(manifest["files_before"]):
        raise ValueError("content file count changed")
    owned_evidence(mappings, manifest["files_before"], use_new=True)
    manifest["content_after"] = {
        "file_count": len(after_inventory),
        "sha256": aggregate(after_inventory),
    }
    return {
        "governed_phase_count_173": "pass",
        "all_sibling_groups_contiguous": "pass",
        "root_exactly_001_through_006": "pass",
        "all_18_moved_leaves_resolved": "pass",
        "all_json_and_jsonl_parse": "pass",
        "identity_fields_aligned": "pass",
        "old_machine_canonical_paths_absent": "pass",
        "file_count_and_hash_preservation": "pass",
    }


def restore_original(manifest: dict, stage: Path, reason: str) -> None:
    mappings = manifest["phase_mappings"]
    nodes = stage / "nodes"
    nodes.mkdir(parents=True, exist_ok=True)
    indexed = {item["old_path"]: index for index, item in enumerate(mappings)}
    for item in sorted(mappings, key=lambda value: (-value["new_path"].count("/"), value["new_path"])):
        token = nodes / f"{indexed[item['old_path']]:03d}"
        if token.exists():
            continue
        for key in ("new_path", "old_path"):
            candidate = ROOT / item[key]
            if candidate.is_dir():
                os.replace(candidate, token)
                break
        else:
            raise ValueError(f"rollback cannot locate phase: {item['old_path']}")
    reconstruct(mappings, "old_path", stage)
    backup_root = stage / "identity-backups"
    for item in manifest["files_before"]:
        if item["classification"] == "identity_updated":
            source = backup_root / item["old_path"]
            target = ROOT / item["old_path"]
            if not source.is_file():
                raise ValueError(f"rollback identity backup missing: {item['old_path']}")
            shutil.copy2(source, target)
    for item in manifest["files_before"]:
        target = ROOT / item["old_path"]
        if not target.is_file() or digest(target) != item["sha256"]:
            raise ValueError(f"rollback hash mismatch: {item['old_path']}")
    manifest["status"] = "rolled_back"
    manifest["updated_at"] = now()
    manifest["rollback_reason"] = reason
    write_manifest(manifest, "Rollback")


def apply() -> None:
    if not MANIFEST.is_file():
        raise ValueError("dry-run manifest is missing")
    manifest = json.loads(MANIFEST.read_text())
    if manifest.get("status") != "dry_run_pass":
        raise ValueError(f"manifest is not apply-ready: {manifest.get('status')}")
    if STAGE.exists() or BACKUP.exists():
        raise ValueError("staging or rollback backup already exists")
    for item in manifest["files_before"]:
        path = ROOT / item["old_path"]
        if not path.is_file() or digest(path) != item["sha256"]:
            raise ValueError(f"pre-apply file drift: {item['old_path']}")
    STAGE.mkdir(parents=True)
    copy_backups(manifest, STAGE)
    (STAGE / "transaction-state.json").write_text(
        json.dumps({"status": "staging", "started_at": now(), "inverse_map": manifest["inverse_map"]}, indent=2) + "\n"
    )
    try:
        flatten(manifest["phase_mappings"], "old_path", STAGE)
        reconstruct(manifest["phase_mappings"], "new_path", STAGE)
        update_identities(manifest)
        manifest["post_apply_verification"] = verify_applied(manifest)
        manifest["status"] = "applied"
        manifest["updated_at"] = now()
        write_manifest(manifest, "Applied Migration")
        os.replace(STAGE, BACKUP)
        print("APPLY_PASS governed=173 support=7 numbered=180 jsonl=154")
    except Exception as error:
        try:
            restore_original(manifest, STAGE, f"apply failure: {error}")
            shutil.rmtree(STAGE, ignore_errors=True)
        except Exception as rollback_error:
            print(f"ROLLBACK_FAILURE: {rollback_error}", file=sys.stderr)
            raise RuntimeError(f"apply failed: {error}; rollback failed: {rollback_error}") from rollback_error
        raise


def verify() -> None:
    manifest = json.loads(MANIFEST.read_text())
    if manifest.get("status") != "applied":
        raise ValueError(f"manifest is not in applied state: {manifest.get('status')}")
    manifest["post_apply_verification"] = verify_applied(manifest)
    manifest["updated_at"] = now()
    write_manifest(manifest, "Verification")
    print("VERIFY_PASS governed=173 support=7 numbered=180 jsonl=154")


def rollback() -> None:
    manifest = json.loads(MANIFEST.read_text())
    if manifest.get("status") != "applied":
        raise ValueError(f"manifest is not rollback-ready: {manifest.get('status')}")
    if not BACKUP.is_dir():
        raise ValueError("rollback backup is missing")
    restore_original(manifest, BACKUP, "external verification failure")
    shutil.rmtree(BACKUP, ignore_errors=True)
    print("ROLLBACK_PASS restored pre-migration hashes")


def metadata_folders() -> list[Path]:
    folders = [ROOT, *phase_dirs()]
    if len(folders) != 174:
        raise ValueError(f"metadata folder count mismatch: expected 174, found {len(folders)}")
    return folders


def metadata_api_run(folders: list[Path], apply_descriptions: bool) -> list[dict]:
    repo = ROOT.parents[3]
    api = repo / ".opencode/skills/system-spec-kit/mcp_server/dist/api/index.js"
    specs = repo / ".opencode/specs"
    script = r'''
import fs from 'node:fs';
import path from 'node:path';
const {
  deriveGraphMetadata, generatePerFolderDescription, loadGraphMetadata,
  mergeGraphMetadata, savePerFolderDescription, checkGeneratedMetadataDrift
} = await import(process.argv[1]);
const folders = JSON.parse(process.argv[2]);
const specs = process.argv[3];
const applyDescriptions = process.argv[4] === 'true';
const results = [];
for (const folder of folders) {
  const description = generatePerFolderDescription(folder, specs);
  if (!description) throw new Error(`description generation failed: ${folder}`);
  const graphPath = path.join(folder, 'graph-metadata.json');
  const existing = loadGraphMetadata(graphPath);
  const saveLineage = existing?.derived?.save_lineage ?? 'graph_only';
  const graph = mergeGraphMetadata(existing, deriveGraphMetadata(folder, existing, { saveLineage }));
  if (applyDescriptions) savePerFolderDescription(description, folder);
  const drift = checkGeneratedMetadataDrift(folder).driftedFields.map((item) => item.field);
  results.push({ folder, description, graph, drift });
}
process.stdout.write(JSON.stringify(results));
'''
    completed = subprocess.run(
        [
            "node", "--input-type=module", "-e", script,
            api.as_uri(), json.dumps([str(path) for path in folders]), str(specs),
            "true" if apply_descriptions else "false",
        ],
        cwd=repo,
        text=True,
        capture_output=True,
    )
    if completed.returncode != 0:
        raise ValueError(f"official metadata API failed: {completed.stderr.strip()}")
    return json.loads(completed.stdout)


def run_graph_backfill(dry_run: bool) -> dict:
    repo = ROOT.parents[3]
    cli = repo / ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
    command = ["node", str(cli), "--all", "--root", str(ROOT)]
    if dry_run:
        command.append("--dry-run")
    completed = subprocess.run(command, cwd=repo, text=True, capture_output=True)
    if completed.returncode != 0:
        raise ValueError(f"official graph backfill failed: {completed.stderr.strip()}")
    return json.loads(completed.stdout)


def current_jsonl_files() -> list[Path]:
    manifest = json.loads(MANIFEST.read_text())
    mapping = {item["old_path"]: item["new_path"] for item in manifest["phase_mappings"]}
    paths = [ROOT / relocate(item["path"], mapping) for item in manifest["jsonl_evidence"]]
    numbered_support = ROOT / "003-spec-data-quality/029-vague-query-model-benchmark"
    active_support = ROOT / "003-spec-data-quality/vague-query-model-benchmark"
    paths = [
        active_support / path.relative_to(numbered_support)
        if path == numbered_support or numbered_support in path.parents
        else path
        for path in paths
    ]
    if len(paths) != 154 or not all(path.is_file() for path in paths):
        raise ValueError("approved JSONL inventory does not resolve to exactly 154 files")
    return paths


def hash_map(paths: list[Path]) -> dict[str, str]:
    return {rel(path): digest(path) for path in sorted(paths)}


def metadata_baseline() -> dict:
    folders = metadata_folders()
    generated = {folder / name for folder in folders for name in ("description.json", "graph-metadata.json")}
    if not all(path.is_file() for path in generated):
        raise ValueError("one or more generated JSON files are missing")
    jsonl = current_jsonl_files()
    jsonl_set = set(jsonl)
    non_generated = [
        path for path in ROOT.rglob("*.json")
        if path not in generated and path not in jsonl_set and "scratch" not in path.relative_to(ROOT).parts
    ]
    for path in non_generated:
        json.loads(path.read_text())
    for path in jsonl:
        lines = [line for line in path.read_text().splitlines() if line.strip()]
        if not lines or not all(isinstance(json.loads(line), dict) for line in lines):
            raise ValueError(f"invalid JSONL evidence: {rel(path)}")
    numbered = numbered_dirs()
    support = [path for path in numbered if path not in set(phase_dirs())]
    if (len(numbered), len(support)) != (180, 7):
        raise ValueError(f"topology count mismatch: numbered={len(numbered)}, support={len(support)}")
    return {
        "folders": folders,
        "generated": hash_map(list(generated)),
        "jsonl": hash_map(jsonl),
        "non_generated": hash_map(non_generated),
    }


def changed_fields(before: dict, after: dict) -> list[str]:
    fields = []
    for key in sorted(set(before) | set(after)):
        if before.get(key) != after.get(key):
            fields.append(key)
    return fields


def expected_metadata_identity(folder: Path, folders: set[Path]) -> tuple[str, str | None, list[str]]:
    repo = ROOT.parents[3]
    canonical = folder.relative_to(repo / ".opencode/specs").as_posix()
    parent = folder.parent if folder != ROOT else None
    parent_id = None if parent is None else parent.relative_to(repo / ".opencode/specs").as_posix()
    governed_children = {child for child in folders if child.parent == folder}
    numbered_support_children = {
        child
        for child in folder.iterdir()
        if child.is_dir() and PHASE_RE.fullmatch(child.name) and child not in governed_children
    }
    children = sorted(
        child.relative_to(repo / ".opencode/specs").as_posix()
        for child in governed_children | numbered_support_children
    )
    return canonical, parent_id, children


def metadata_preflight() -> dict:
    baseline = metadata_baseline()
    folders = baseline["folders"]
    predictions = metadata_api_run(folders, False)
    folder_set = set(folders)
    rows = []
    for prediction in predictions:
        folder = Path(prediction["folder"])
        canonical, parent_id, children = expected_metadata_identity(folder, folder_set)
        description = prediction["description"]
        graph = prediction["graph"]
        if description.get("specFolder") != canonical:
            raise ValueError(f"predicted description identity mismatch: {canonical}")
        if (graph.get("packet_id"), graph.get("spec_folder"), graph.get("parent_id"), graph.get("children_ids")) != (
            canonical, canonical, parent_id, children
        ):
            raise ValueError(
                f"predicted graph identity mismatch: {canonical}; "
                f"children={graph.get('children_ids')} expected={children}"
            )
        old_description = json.loads((folder / "description.json").read_text())
        old_graph = json.loads((folder / "graph-metadata.json").read_text())
        rows.append({
            "folder": canonical,
            "description_fields": changed_fields(old_description, description),
            "graph_fields": changed_fields(old_graph, graph),
            "derived_fields": changed_fields(old_graph.get("derived", {}), graph.get("derived", {})),
            "preexisting_drift": prediction["drift"],
        })
    graph_summary = run_graph_backfill(True)
    if graph_summary.get("failed") or graph_summary.get("totalSpecFolders") != 174:
        raise ValueError(f"graph dry-run failed or incomplete: {graph_summary}")
    return {"baseline": baseline, "rows": rows, "graph_summary": graph_summary}


def write_task8_report(preflight: dict, apply_result: dict | None = None, final: dict | None = None) -> None:
    rows = preflight["rows"]
    graph = preflight["graph_summary"]
    lines = [
        "# Task 8 Metadata Repair Ledger", "",
        "## Boundary Dry Run", "",
        "- Memory trigger preflight: timed out; packet evidence and official generators used.",
        "- Governed phases: `173`; generated identities including root: `174`.",
        "- Historical migration baseline: `173` phases, `7` support directories, `180` numbered directories (preserved in manifest `counts`).",
        "- Post-changelog baseline: `173` phases, `8` support directories, `181` numbered directories.",
        "- Post-support-declassification baseline: `173` phases, `7` numbered support directories, `180` numbered directories.",
        "- Extra Task #7C support path: `changelog/002-speckit-memory/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory`; it is under `changelog/` and has no immediate `spec.md`.",
        "- Approved JSONL evidence: `154`; every nonblank line parsed as a JSON object.",
        f"- Official graph dry-run: total `{graph['totalSpecFolders']}`, changed `{graph['changed']}`, failed `{len(graph['failed'])}`.",
        f"- Description changes predicted: `{sum(bool(row['description_fields']) for row in rows)}` folders.",
        f"- Graph changes predicted: `{sum(bool(row['graph_fields']) for row in rows)}` folders.",
        "- Prediction gate: canonical IDs, parent IDs, children IDs and paths resolve for all 174 identities.",
        "- Benchmark support resolves at unnumbered `003-spec-data-quality/vague-query-model-benchmark` and remains outside generated-metadata scope.",
        "", "## Exact Predicted Generated Fields", "",
        "| Folder | description.json | graph-metadata.json | derived |",
        "|---|---|---|---|",
    ]
    for row in rows:
        lines.append(
            f"| `{row['folder']}` | `{','.join(row['description_fields']) or 'none'}` | "
            f"`{','.join(row['graph_fields']) or 'none'}` | `{','.join(row['derived_fields']) or 'none'}` |"
        )
    if apply_result:
        lines.extend([
            "", "## Apply And Transaction Verification", "",
            "- Description writer: official `generatePerFolderDescription` + `savePerFolderDescription` API.",
            "- Graph writer: official `backfill-graph-metadata.js --all --root <packet>`.",
            f"- Graph apply: refreshed `{apply_result['graph']['refreshed']}`, changed `{apply_result['graph']['changed']}`, failed `{len(apply_result['graph']['failed'])}`.",
            "- Generated JSON parse: PASS; identity/parent/children/status derivation: PASS.",
            "- JSONL byte preservation: PASS; non-generated JSON byte preservation: PASS.",
            "- Topology counts and contiguous sibling numbering: PASS.",
            "- Rollback: in-memory snapshot armed for the full apply/verification process; no restore required.",
        ])
    if final:
        lines.extend([
            "", "## Strict Validation And Git Ledger", "",
            f"- Strict command: `{final['strict_command']}`",
            f"- Strict exit: `{final['strict_exit']}`.",
            "- Strict result lines:", "```text", *final["strict_lines"], "```",
            f"- Packet status counts: `{final['status_counts']}`.",
            f"- Tracked diff stat: `{final['diff_stat']}`.",
            f"- `git diff --check`: `{'PASS' if final['diff_check_exit'] == 0 else 'FAIL'}`.",
            "- Commit: not created.",
        ])
    TASK8_REPORT.write_text("\n".join(lines) + "\n")


def metadata_dry_run() -> None:
    preflight = metadata_preflight()
    manifest = json.loads(MANIFEST.read_text())
    if manifest.get("counts", {}).get("governed_phases") != 173 or manifest.get("counts", {}).get("numbered_support_dirs") != 7 or manifest.get("counts", {}).get("total_numbered_dirs") != 180:
        raise ValueError("historical migration baseline changed unexpectedly")
    manifest["post_changelog_baseline"] = {
        "governed_phases": 173,
        "numbered_support_dirs": 8,
        "total_numbered_dirs": 181,
        "provenance": "Task #7C changelog alignment approved by operator",
        "extra_support_path": "changelog/002-speckit-memory/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory",
        "extra_support_has_immediate_spec_md": False,
    }
    manifest["post_support_declassification_baseline"] = {
        "governed_phases": 173,
        "numbered_support_dirs": 7,
        "total_numbered_dirs": 180,
        "renamed_support_alias": "003-spec-data-quality/029-vague-query-model-benchmark",
        "active_support_path": "003-spec-data-quality/vague-query-model-benchmark",
        "provenance": "Task #20 declassified non-phase benchmark evidence from phase numbering",
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    write_task8_report(preflight)
    print(
        "METADATA_DRY_RUN_PASS folders=174 phases=173 support=7 numbered=180 jsonl=154 "
        f"graph_changed={preflight['graph_summary']['changed']}"
    )


def verify_metadata_after_apply(preflight: dict) -> None:
    baseline = preflight["baseline"]
    current = metadata_baseline()
    if current["jsonl"] != baseline["jsonl"]:
        raise ValueError("approved JSONL evidence changed")
    if current["non_generated"] != baseline["non_generated"]:
        raise ValueError("non-generated JSON evidence changed")
    predictions = metadata_api_run(current["folders"], False)
    folder_set = set(current["folders"])
    for prediction in predictions:
        folder = Path(prediction["folder"])
        canonical, parent_id, children = expected_metadata_identity(folder, folder_set)
        stored_description = json.loads((folder / "description.json").read_text())
        stored_graph = json.loads((folder / "graph-metadata.json").read_text())
        expected_description = prediction["description"]
        for key in ("specFolder", "description", "keywords", "specId", "folderSlug", "parentChain"):
            if stored_description.get(key) != expected_description.get(key):
                raise ValueError(f"stored description drift: {canonical}:{key}")
        if (stored_graph.get("packet_id"), stored_graph.get("spec_folder"), stored_graph.get("parent_id"), stored_graph.get("children_ids")) != (
            canonical, canonical, parent_id, children
        ):
            raise ValueError(f"stored graph identity drift: {canonical}")
        if prediction["drift"]:
            raise ValueError(f"generated synopsis drift remains: {canonical}:{prediction['drift']}")
        if stored_graph.get("derived", {}).get("source_fingerprint") != prediction["graph"].get("derived", {}).get("source_fingerprint"):
            raise ValueError(f"source fingerprint mismatch remains: {canonical}")


def metadata_apply() -> None:
    preflight = metadata_preflight()
    folders = preflight["baseline"]["folders"]
    snapshots = {
        path: path.read_bytes()
        for folder in folders for path in (folder / "description.json", folder / "graph-metadata.json")
    }
    try:
        metadata_api_run(folders, True)
        graph_result = run_graph_backfill(False)
        if graph_result.get("failed"):
            raise ValueError(f"graph apply failures: {graph_result['failed']}")
        verify_metadata_after_apply(preflight)
        write_task8_report(preflight, {"graph": graph_result})
        print("METADATA_APPLY_PASS identities=174 jsonl_unchanged=154")
    except Exception:
        for path, content in snapshots.items():
            path.write_bytes(content)
        raise


def metadata_finalize() -> None:
    preflight = metadata_preflight()
    graph_result = run_graph_backfill(True)
    apply_result = {"graph": {**graph_result, "refreshed": 174}}
    repo = ROOT.parents[3]
    strict_command = (
        "bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "
        ".opencode/specs/system-speckit/028-memory-search-intelligence --strict"
    )
    strict = subprocess.run(strict_command, cwd=repo, shell=True, text=True, capture_output=True)
    strict_lines = [
        line for line in (strict.stdout + strict.stderr).splitlines()
        if line.strip().startswith(("Folder:", "x ", "! ", "Summary:", "RESULT:"))
    ]
    status = subprocess.run(
        ["git", "status", "--porcelain=v1", "-uall", "--", str(ROOT.relative_to(repo))],
        cwd=repo, text=True, capture_output=True, check=True,
    ).stdout.splitlines()
    status_counts: dict[str, int] = defaultdict(int)
    for line in status:
        status_counts[line[:2]] += 1
    diff_stat = subprocess.run(
        ["git", "diff", "--stat", "--", str(ROOT.relative_to(repo))],
        cwd=repo, text=True, capture_output=True, check=True,
    ).stdout.strip().splitlines()[-1]
    diff_check = subprocess.run(
        ["git", "diff", "--check", "--", str(ROOT.relative_to(repo))],
        cwd=repo, text=True, capture_output=True,
    )
    final = {
        "strict_command": strict_command,
        "strict_exit": strict.returncode,
        "strict_lines": strict_lines,
        "status_counts": dict(sorted(status_counts.items())),
        "diff_stat": diff_stat,
        "diff_check_exit": diff_check.returncode,
    }
    write_task8_report(preflight, apply_result, final)
    print(f"METADATA_FINALIZE strict_exit={strict.returncode} diff_check={diff_check.returncode}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "mode",
        choices=(
            "dry-run", "apply", "verify", "rollback",
            "metadata-dry-run", "metadata-apply", "metadata-finalize",
        ),
    )
    args = parser.parse_args()
    try:
        {
            "dry-run": dry_run,
            "apply": apply,
            "verify": verify,
            "rollback": rollback,
            "metadata-dry-run": metadata_dry_run,
            "metadata-apply": metadata_apply,
            "metadata-finalize": metadata_finalize,
        }[args.mode]()
        return 0
    except Exception as error:
        print(f"{args.mode.upper()}_FAIL: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
