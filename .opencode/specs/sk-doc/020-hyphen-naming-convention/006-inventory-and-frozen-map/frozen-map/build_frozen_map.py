#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path, PurePosixPath
from typing import Any, Iterable


PINNED_BASE = "2bccd03be9f1f0813ece6089761470cfcdc3b84a"
SK_GIT_PILOT_COMMIT = "8e391f9691b92e4af2d8f5c8120a70eb75c2f4e0"
PROMPT_PRODUCER = ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
PROMPT_REGRESSIONS = {
    ".codex/prompts/agent_router.md",
    ".codex/prompts/goal_opencode.md",
}


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(
        value, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")


def digest(value: Any) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def run(repo: Path, arguments: list[str]) -> bytes:
    result = subprocess.run(
        ["git", "-C", str(repo), *arguments],
        check=False,
        capture_output=True,
    )
    if result.returncode:
        raise RuntimeError(
            result.stderr.decode("utf-8", errors="replace").strip()
            or f"git exited {result.returncode}"
        )
    return result.stdout


def has_prefix(path: PurePosixPath, roots: Iterable[PurePosixPath]) -> bool:
    return any(path == root or root in path.parents for root in roots)


def stable_id(prefix: str, source: PurePosixPath, target: PurePosixPath | None) -> str:
    value = source.as_posix() + "\0" + (target.as_posix() if target else "")
    return f"{prefix}-{hashlib.sha256(value.encode('utf-8')).hexdigest()[:20]}"


def tracked_manifest(repo: Path) -> tuple[dict[PurePosixPath, dict[str, str]], set[PurePosixPath]]:
    raw = run(repo, ["ls-files", "--stage", "-z"])
    files: dict[PurePosixPath, dict[str, str]] = {}
    for record in raw.split(b"\0"):
        if not record:
            continue
        metadata, raw_path = record.split(b"\t", 1)
        mode, object_id, stage = metadata.decode("ascii").split(" ")
        if stage != "0":
            raise RuntimeError(f"unresolved index stage {stage}")
        path = PurePosixPath(raw_path.decode("utf-8", errors="surrogateescape"))
        files[path] = {"mode": mode, "object_id": object_id}
    nodes = set(files)
    for path in files:
        nodes.update(tuple(path.parents)[:-1])
    return files, nodes


def pilot_rows(repo: Path) -> list[tuple[PurePosixPath, PurePosixPath]]:
    raw = run(
        repo,
        [
            "diff-tree",
            "-r",
            "-M",
            "--name-status",
            f"{SK_GIT_PILOT_COMMIT}^",
            SK_GIT_PILOT_COMMIT,
            "--",
            ".opencode/skills/sk-git",
        ],
    ).decode("utf-8", errors="surrogateescape")
    rows: list[tuple[PurePosixPath, PurePosixPath]] = []
    for line in raw.splitlines():
        fields = line.split("\t")
        if len(fields) == 3 and fields[0].startswith("R"):
            rows.append((PurePosixPath(fields[1]), PurePosixPath(fields[2])))
    if len(rows) != 66:
        raise RuntimeError(f"expected 66 sk-git pilot renames, found {len(rows)}")
    return sorted(rows)


def transformed_target(
    source: PurePosixPath,
    rename_paths: set[PurePosixPath],
    canonical_root: Any,
) -> PurePosixPath:
    parts: list[str] = []
    cursor = PurePosixPath()
    for part in source.parts:
        cursor /= part
        if cursor not in rename_paths:
            parts.append(part)
            continue
        root_target = canonical_root(part)
        parts.append(root_target if root_target is not None else part.replace("_", "-"))
    return PurePosixPath(*parts)


def classify_candidates(
    repo: Path,
    files: dict[PurePosixPath, dict[str, str]],
    nodes: set[PurePosixPath],
    guard: Any,
    engine: Any,
) -> dict[PurePosixPath, tuple[str, str]]:
    completed_roots = {
        path.parent
        for path in files
        if path.name == "implementation-summary.md"
        and path.parts[:2] == (".opencode", "specs")
    }
    expanded_frozen_names = frozenset(
        {"archive", "archives", "archived", "completed", "history"}
    )
    prompt_root = PurePosixPath(".codex/prompts")
    candidates: dict[PurePosixPath, tuple[str, str]] = {}
    for path in sorted(nodes):
        if not guard._uses_snake_case(path.name) and not has_prefix(path, {prompt_root}):
            continue
        detected = engine._classify_exemption(repo, path)
        if detected is not None:
            candidates[path] = detected
        elif has_prefix(path, completed_roots) or set(path.parts) & expanded_frozen_names:
            candidates[path] = ("frozen", "completed or historical surface is append-only")
        else:
            candidates[path] = ("rename", "authored filesystem name uses snake_case")
    return candidates


def collision_report(
    entries: list[dict[str, Any]],
    nodes: set[PurePosixPath],
) -> dict[str, Any]:
    rename_entries = [
        entry
        for entry in entries
        if entry["classification"] == "rename"
        and entry.get("disposition") == "pending"
    ]
    source_paths = {PurePosixPath(entry["source"]) for entry in rename_entries}
    targets = [(entry["id"], PurePosixPath(entry["target"])) for entry in rename_entries]
    retained = {
        path
        for path in nodes
        if not any(candidate in source_paths for candidate in (path, *path.parents))
    }
    errors: list[dict[str, str]] = []

    def keys(path: PurePosixPath) -> dict[str, str]:
        value = path.as_posix()
        return {
            "exact": value,
            "casefold": value.casefold(),
            "nfc": unicodedata.normalize("NFC", value),
            "casefold+nfc": unicodedata.normalize("NFC", value).casefold(),
        }

    for mode in ("exact", "casefold", "nfc", "casefold+nfc"):
        owners: dict[str, tuple[str, str]] = {}
        for entry_id, target in targets:
            key = keys(target)[mode]
            if key in owners:
                errors.append(
                    {
                        "mode": mode,
                        "path": target.as_posix(),
                        "conflict": owners[key][1],
                    }
                )
            owners[key] = (entry_id, target.as_posix())
        retained_index = {keys(path)[mode]: path.as_posix() for path in retained}
        for _, target in targets:
            key = keys(target)[mode]
            if key in retained_index:
                errors.append(
                    {
                        "mode": mode,
                        "path": target.as_posix(),
                        "conflict": retained_index[key],
                    }
                )
    return {
        "modes": ["exact", "casefold", "nfc", "casefold+nfc"],
        "collision_count": len(errors),
        "collisions": errors,
    }


def producer_manifests(paths: Iterable[str]) -> list[str]:
    selected = set()
    for raw in paths:
        path = PurePosixPath(raw)
        lowered = path.name.lower()
        if (
            lowered in {"package.json", "plugin.json", "hooks.json"}
            or "manifest" in lowered
            or "registry" in lowered
            or path.as_posix() == PROMPT_PRODUCER
        ):
            selected.add(path.as_posix())
    return sorted(selected)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    repo = args.repo.resolve()
    head = run(repo, ["rev-parse", "HEAD"]).decode("ascii").strip()
    if head != PINNED_BASE:
        raise RuntimeError(f"HEAD {head} does not equal pinned base {PINNED_BASE}")
    if run(repo, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]):
        raise RuntimeError("map generation requires a clean repository")

    scripts = repo / ".opencode/skills/sk-doc/shared/scripts"
    sys.path.insert(0, str(scripts))
    import check_no_new_snake_case as guard
    import reference_checker_core as checker
    import reference_checker_models as checker_models
    import rename_engine_core as engine
    from naming_root_resolver import canonical_root

    checker._python_package_roots = lambda manifest: frozenset()

    files, nodes = tracked_manifest(repo)
    candidates = classify_candidates(repo, files, nodes, guard, engine)
    pending_paths = {path for path, value in candidates.items() if value[0] == "rename"}

    entries: list[dict[str, Any]] = []
    for source in sorted(candidates):
        classification, reason = candidates[source]
        target = (
            transformed_target(source, pending_paths, canonical_root)
            if classification == "rename"
            else None
        )
        row: dict[str, Any] = {
            "id": stable_id("map", source, target),
            "source": source.as_posix(),
            "classification": classification,
            "dependencies": [],
            "reason": reason,
            "kind": "file" if source in files else "directory",
            "observed_at_sha": PINNED_BASE,
        }
        if classification == "rename":
            assert target is not None
            row.update(
                {
                    "target": target.as_posix(),
                    "disposition": "pending",
                    "source_exists": True,
                    "target_exists": target in nodes,
                }
            )
        if has_prefix(source, {PurePosixPath(".codex/prompts")}):
            row["producer"] = PROMPT_PRODUCER
            row["output_policy"] = "regenerate-from-producer"
            row["producer_fix_required"] = source.as_posix() in PROMPT_REGRESSIONS
            row["manual_rename_allowed"] = False
        entries.append(row)

    for source, target in pilot_rows(repo):
        if source in nodes or target not in nodes:
            raise RuntimeError(f"invalid already-applied state: {source} -> {target}")
        entries.append(
            {
                "id": stable_id("map", source, target),
                "source": source.as_posix(),
                "target": target.as_posix(),
                "classification": "rename",
                "dependencies": [],
                "reason": "sk-git kebab pilot landed before this map epoch",
                "kind": "file",
                "observed_at_sha": PINNED_BASE,
                "disposition": "already-applied",
                "source_exists": False,
                "target_exists": True,
                "pilot_commit": SK_GIT_PILOT_COMMIT,
            }
        )
    entries.sort(key=lambda row: (row["source"], row["id"]))

    provisional = {
        "schema_version": 1,
        "artifact_schema": "sk-doc-frozen-rename-map/v1",
        "base_sha": PINNED_BASE,
        "entries": entries,
    }
    args.output.write_text(
        json.dumps(provisional, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    engine_map = engine.load_semantic_map(args.output)

    repository = checker.GitRepository(repo)
    manifest = repository.tracked_manifest()
    observations, skipped_files, contents = checker._scan_observations(repository, manifest)
    checker_map_full = checker_models.load_semantic_map(args.output)
    checker_map = checker_models.SemanticMap(
        semantic_map_id=checker_map_full.semantic_map_id,
        base_sha=checker_map_full.base_sha,
        map_hash=checker_map_full.map_hash,
        entries=checker_map_full.rename_entries,
    )
    tracked_paths = frozenset(item.path for item in manifest)
    sites, site_errors, _, observed_edges = checker._resolve_static_sites(
        observations,
        checker_map,
        tracked_paths,
        contents,
        "auto",
    )
    if site_errors:
        raise RuntimeError("static reference resolution failed: " + " | ".join(site_errors))

    by_id = {entry["id"]: entry for entry in entries}
    for owner, dependency in sorted(observed_edges):
        by_id[owner]["dependencies"].append(dependency)
    for entry in entries:
        entry["dependencies"] = sorted(set(entry["dependencies"]))

    args.output.write_text(
        json.dumps(provisional, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    engine_map = engine.load_semantic_map(args.output)

    checker_map_full = checker_models.load_semantic_map(args.output)
    checker_map = checker_models.SemanticMap(
        semantic_map_id=checker_map_full.semantic_map_id,
        base_sha=checker_map_full.base_sha,
        map_hash=checker_map_full.map_hash,
        entries=checker_map_full.rename_entries,
    )
    graph, graph_errors = checker._reference_graph(checker_map, observed_edges)
    if graph_errors:
        raise RuntimeError("reference graph failed: " + " | ".join(graph_errors))

    dynamic_rows: list[dict[str, Any]] = []
    disposition_map: dict[str, dict[str, Any]] = {}
    for observation in observations:
        if not observation.dynamic:
            continue
        if observation.automatic_disposition:
            disposition = observation.automatic_disposition
            rationale = "literal glob pattern is bounded without executing the glob"
            evidence = [observation.expression]
        else:
            disposition = "manual-review-required"
            rationale = "dynamic expression cannot be rewritten safely without execution-time review"
            evidence = [
                value
                for value in (observation.expression, observation.site_key)
                if value
            ]
        supplied = {
            "disposition": disposition,
            "rationale": rationale,
            "evidence": evidence,
        }
        disposition_map[observation.site_id] = supplied
        dynamic_rows.append(
            {
                "site_id": observation.site_id,
                "site_key": observation.site_key,
                "file": observation.file.as_posix(),
                "line": observation.line,
                "column": observation.column,
                "reference_kind": observation.reference_kind,
                "expression": observation.expression,
                **supplied,
            }
        )
    dynamic_rows.sort(key=lambda row: (row["file"], row["line"], row["column"], row["site_id"]))

    rename_by_id = {
        entry["id"]: entry for entry in entries if entry["classification"] == "rename"
    }
    pending_ids = {
        entry_id
        for entry_id, entry in rename_by_id.items()
        if entry["disposition"] == "pending"
    }
    pending_engine_entries = tuple(
        entry for entry in engine_map.entries if entry.entry_id in pending_ids
    )
    batch_plan = engine._plan_batches(pending_engine_entries)
    batch_by_member = {
        member: batch["id"] for batch in batch_plan for member in batch["members"]
    }
    batch_by_path = {
        entry[path_key]: batch_by_member[entry_id]
        for entry_id, entry in rename_by_id.items()
        if entry_id in pending_ids
        for path_key in ("source", "target")
    }
    batch_by_basename: dict[str, set[str]] = defaultdict(set)
    for path, batch_id in batch_by_path.items():
        batch_by_basename[PurePosixPath(path).name].add(batch_id)
    dynamic_by_batch: dict[str, list[dict[str, Any]]] = defaultdict(list)
    unbound_dynamic: list[dict[str, Any]] = []
    for row in dynamic_rows:
        owners = set()
        file_owner = batch_by_path.get(row["file"])
        if file_owner is not None:
            owners.add(file_owner)
        for token in re.findall(r"[A-Za-z0-9_.-]+", row["expression"]):
            owners.update(batch_by_basename.get(token, set()))
        if owners:
            for batch_id in sorted(owners):
                dynamic_by_batch[batch_id].append(row)
        else:
            unbound_dynamic.append(row)

    manifest_by_path = {item.path: item for item in manifest}
    batch_records: list[dict[str, Any]] = []
    batch_hash_by_id: dict[str, str] = {}
    for batch in batch_plan:
        member_entries = [rename_by_id[member] for member in batch["members"]]
        static_sites = sorted(
            (
                site
                for member in batch["members"]
                for site in sites.get(member, [])
            ),
            key=lambda site: (site["file"], site["span_start"], site["site_id"]),
        )
        symlinks: list[dict[str, Any]] = []
        for entry in member_entries:
            source = PurePosixPath(entry["source"])
            tracked = manifest_by_path.get(source)
            if tracked is not None and tracked.is_symlink:
                symlinks.append(
                    {
                        "path": source.as_posix(),
                        "endpoint": os.readlink(repo.joinpath(*source.parts)),
                        "mode": tracked.mode,
                    }
                )
        for site in static_sites:
            if site["reference_kind"] == "symlink-target":
                symlinks.append(
                    {
                        "path": site["file"],
                        "endpoint": site["raw_value"],
                        "mode": "120000",
                    }
                )
        symlinks = sorted(
            {json.dumps(row, sort_keys=True): row for row in symlinks}.values(),
            key=lambda row: (row["path"], row["endpoint"]),
        )
        dynamic_sites = dynamic_by_batch.get(batch["id"], [])
        manifests = producer_manifests(
            [site["file"] for site in static_sites]
            + [row["file"] for row in dynamic_sites]
        )
        dependency_entries = {
            dependency
            for entry in member_entries
            for dependency in entry["dependencies"]
            if dependency in pending_ids and dependency not in batch["members"]
        }
        read_set = {
            entry["source"] for entry in member_entries
        } | {
            rename_by_id[dependency]["source"] for dependency in dependency_entries
        } | {
            rename_by_id[dependency]["target"] for dependency in dependency_entries
        } | {
            site["file"] for site in static_sites
        } | {
            row["file"] for row in dynamic_sites
        } | set(manifests)
        write_set = {
            path
            for entry in member_entries
            for path in (entry["source"], entry["target"])
        } | {
            site["file"] for site in static_sites
        } | {
            row["path"] for row in symlinks
        } | set(manifests)
        touch_set = {
            "source_target_paths": [
                {
                    "map_id": entry["id"],
                    "source": entry["source"],
                    "target": entry["target"],
                }
                for entry in sorted(member_entries, key=lambda row: row["source"])
            ],
            "static_reference_sites": static_sites,
            "dynamic_reference_dispositions": dynamic_sites,
            "symlink_endpoints": symlinks,
            "producer_manifests": manifests,
            "read_set": sorted(read_set),
            "write_set": sorted(write_set),
        }
        touch_set_hash = digest(touch_set)
        dependency_hash = digest(
            [
                {"batch_id": dep, "batch_hash": batch_hash_by_id[dep]}
                for dep in batch["depends_on"]
            ]
        )
        batch_payload = {
            "batch_id": batch["id"],
            "members": batch["members"],
            "depends_on": batch["depends_on"],
            "dependency_hash": dependency_hash,
            "touch_set_hash": touch_set_hash,
            "touch_set": touch_set,
        }
        batch_hash = digest({"base_sha": PINNED_BASE, **batch_payload})
        batch_payload["batch_hash"] = batch_hash
        batch_records.append(batch_payload)
        batch_hash_by_id[batch["id"]] = batch_hash

    candidate_identity = [
        {
            "id": entry["id"],
            "source": entry["source"],
            "target": entry.get("target"),
            "classification": entry["classification"],
            "disposition": entry.get("disposition"),
        }
        for entry in entries
    ]
    candidate_set_hash = digest(candidate_identity)
    full_graph_identity = {
        "nodes": graph["nodes"],
        "edges": graph["edges"],
        "scc_batches": graph["scc_batches"],
    }
    graph_hash = digest(full_graph_identity)
    epoch_core = {
        "epoch_id": f"epoch-000-{PINNED_BASE[:12]}-{candidate_set_hash[:12]}",
        "map_base_sha": PINNED_BASE,
        "parent_epoch_hash": "0" * 64,
        "candidate_set_hash": candidate_set_hash,
        "graph_hash": graph_hash,
    }
    epoch = {**epoch_core, "epoch_hash": digest(epoch_core)}

    class_counts = Counter(entry["classification"] for entry in entries)
    disposition_counts = Counter(
        entry["disposition"]
        for entry in entries
        if entry["classification"] == "rename"
    )
    regression_rows = [
        entry
        for entry in entries
        if entry["source"] in PROMPT_REGRESSIONS
    ]
    if len(regression_rows) != 2 or not all(
        row.get("producer_fix_required") and row["classification"] == "generated"
        for row in regression_rows
    ):
        raise RuntimeError("prompt regression classification is incomplete")

    artifact: dict[str, Any] = {
        "schema_version": 1,
        "artifact_schema": "sk-doc-frozen-rename-map/v1",
        "base_sha": PINNED_BASE,
        "epoch": epoch,
        "inventory": {
            "source": "Git stage-zero manifest plus implied directories at map base",
            "tracked_file_count": len(files),
            "filesystem_node_count": len(nodes),
            "candidate_definition": "snake_case filesystem nodes plus every .codex/prompts descendant and reconciled sk-git pilot rows",
            "total_candidates": len(entries),
            "classification_counts": dict(sorted(class_counts.items())),
            "rename_disposition_counts": dict(sorted(disposition_counts.items())),
            "unknown_count": 0,
            "codex_prompt_count": sum(
                has_prefix(PurePosixPath(entry["source"]), {PurePosixPath(".codex/prompts")})
                for entry in entries
            ),
            "prompt_regressions": sorted(PROMPT_REGRESSIONS),
            "prompt_producer": PROMPT_PRODUCER,
            "prompt_fix_policy": "fix producer and regenerate outputs; never hand-rename generated prompts",
            "sk_git_pilot_commit": SK_GIT_PILOT_COMMIT,
            "collision_report": collision_report(entries, nodes),
        },
        "entries": entries,
        "reference_graph": {
            **full_graph_identity,
            "graph_hash": graph_hash,
            "observed_static_edge_count": len(observed_edges),
        },
        "dynamic_reference_dispositions": {
            "total": len(dynamic_rows),
            "bound_to_pending_batches": sum(len(rows) for rows in dynamic_by_batch.values()),
            "unbound": len(unbound_dynamic),
            "rows": dynamic_rows,
            "unbound_rows": unbound_dynamic,
        },
        "producer_manifests": [
            {
                "producer": PROMPT_PRODUCER,
                "outputs": ".codex/prompts/*",
                "manual_output_rename_allowed": False,
                "producer_fix_required_for": sorted(PROMPT_REGRESSIONS),
            }
        ],
        "pending_batches": batch_records,
        "already_applied": [
            {
                "map_id": entry["id"],
                "source": entry["source"],
                "target": entry["target"],
                "pilot_commit": entry["pilot_commit"],
            }
            for entry in entries
            if entry.get("disposition") == "already-applied"
        ],
        "scan_evidence": {
            "reference_checker_compatibility": {
                "state_projections": "pending=pre and already-applied=post",
                "directory_state_owner": "semantic rename engine",
                "python_package_scope": "package directory names only; descendants remain reference-scannable",
                "tool_files_modified": False,
            },
            "tracked_manifest_hash": digest(
                [
                    {
                        "path": path.as_posix(),
                        **files[path],
                    }
                    for path in sorted(files)
                ]
            ),
            "reference_observation_count": len(observations),
            "static_reference_site_count": sum(len(rows) for rows in sites.values()),
            "dynamic_reference_site_count": len(dynamic_rows),
            "skipped_reference_file_count": len(skipped_files),
            "engine_plan_expected_summary": {
                "map_entries": len(entries),
                "rename_entries": sum(
                    entry["classification"] == "rename" for entry in entries
                ),
                "pending": sum(
                    entry.get("disposition") == "pending" for entry in entries
                ),
                "already_at_target": sum(
                    entry.get("disposition") == "already-applied" for entry in entries
                ),
                "skipped": sum(
                    entry["classification"] != "rename" for entry in entries
                ),
                "batches": len(engine._plan_batches(engine_map.entries)),
            },
        },
    }
    digest_payload = {
        "base_sha": artifact["base_sha"],
        "epoch": artifact["epoch"],
        "inventory": artifact["inventory"],
        "entries": artifact["entries"],
        "reference_graph": artifact["reference_graph"],
        "dynamic_reference_dispositions": artifact["dynamic_reference_dispositions"],
        "producer_manifests": artifact["producer_manifests"],
        "pending_batches": artifact["pending_batches"],
        "already_applied": artifact["already_applied"],
    }
    artifact["integrity"] = {
        "algorithm": "sha256",
        "digest_scope": "canonical JSON of base, epoch, inventory, entries, graph, dispositions, producers, batches and already-applied rows",
        "map_digest": digest(digest_payload),
        "binds_base_sha": PINNED_BASE,
    }
    args.output.write_text(
        json.dumps(artifact, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    engine.load_semantic_map(args.output)
    print(
        json.dumps(
            {
                "output": str(args.output),
                "total_candidates": len(entries),
                "classification_counts": dict(sorted(class_counts.items())),
                "rename_disposition_counts": dict(sorted(disposition_counts.items())),
                "pending_batch_count": len(batch_records),
                "map_digest": artifact["integrity"]["map_digest"],
                "candidate_set_hash": candidate_set_hash,
                "graph_hash": graph_hash,
                "dynamic_sites": len(dynamic_rows),
                "static_sites": artifact["scan_evidence"]["static_reference_site_count"],
            },
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
