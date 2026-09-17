#!/usr/bin/env python3
"""Exercise manifest discovery, exclusions and the full-root README walk."""

from __future__ import annotations

import json
import sys
from pathlib import Path


TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
SCRIPT_DIR = REPO / ".opencode/skills/sk-doc/sk-create-readme/scripts"
sys.path.insert(0, str(SCRIPT_DIR))
import audit_readmes


def main() -> int:
    root = REPO.resolve()
    readmes = {path.relative_to(root).as_posix() for path in audit_readmes.find_readmes(root)}
    failures = []

    for required in (".pi/extensions/README.md", ".github/workflows/README.md"):
        if required not in readmes:
            failures.append(f"missing discovered README: {required}")
    if any(path.startswith(".opencode/skills/sk-doc/scripts/tests/") for path in readmes):
        failures.append("fixture-owned README was included in the audit")

    fixture_manifest = json.loads(
        (TESTS / "exclusions/exclusion-fixture-manifest.json").read_text(encoding="utf-8")
    )
    if len(fixture_manifest["classes"]) != 21:
        failures.append(f"expected 21 exclusion classes, got {len(fixture_manifest['classes'])}")
    for class_name in fixture_manifest["classes"]:
        fixture_path = TESTS / "exclusions" / class_name.replace("_", "-") / "README.md"
        actual = audit_readmes.classify_path(root, fixture_path)
        if actual not in audit_readmes.DISPOSITION_PATH_CLASSES:
            failures.append(f"fixture {class_name} was not classified: {actual}")

    manifest_path = TESTS / "code-folder/durable-directory-manifest.json"
    if not manifest_path.exists():
        failures.append(f"missing frozen manifest: {manifest_path}")
    else:
        current = audit_readmes.build_durable_manifest(root)
        frozen = audit_readmes.load_manifest(manifest_path)
        if set(current["directories"]) != set(frozen["directories"]):
            failures.append("frozen durable-directory manifest is not reproducible")
        reproduction = audit_readmes.manifest_reproduction(root, manifest_path)
        if not reproduction["raw_candidate_set_reproduced"]:
            failures.append("manifest reproduction assertion failed")
        if reproduction["gaps"] and any("fixture" in gap for gap in reproduction["gaps"]):
            failures.append("fixture path appeared as an actionable gap")
        print(
            "MANIFEST "
            f"derived={reproduction['derived_count']} frozen={reproduction['frozen_count']} "
            f"baseline={reproduction['baseline_prose_count']} gaps={len(reproduction['gaps'])} "
            f"exclusions={len(reproduction['exclusions'])} reproduced={reproduction['raw_candidate_set_reproduced']}"
        )

    print(f"DISCOVERY readmes={len(readmes)} pi_extensions={'.pi/extensions/README.md' in readmes} github_workflows={'.github/workflows/README.md' in readmes}")
    print(f"EXCLUSIONS classes={len(fixture_manifest['classes'])} fixture_readmes_scored={any('scripts/tests/' in path for path in readmes)}")
    if failures:
        print("FAILURES:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
