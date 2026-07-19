#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: REFERENCE CHECKER TESTS
# ───────────────────────────────────────────────────────────────
"""Disposable Git fixtures for the read-only reference checker and ledger."""

from __future__ import annotations

import hashlib
import json
import os
import stat
import subprocess
import tempfile
import unittest
import unicodedata
from pathlib import Path
from typing import Any, Iterable


# ───────────────────────────────────────────────────────────────
# 1. FIXTURE SUPPORT
# ───────────────────────────────────────────────────────────────

CHECKER = (
    Path(__file__).resolve().parents[2]
    / "shared"
    / "scripts"
    / "reference_checker.py"
)


class FixtureRepository:
    """A disposable Git repository with external map and disposition inputs."""

    def __init__(self) -> None:
        self._temporary_directory = tempfile.TemporaryDirectory()
        self.workspace = Path(self._temporary_directory.name)
        self.root = self.workspace / "repo"
        self.root.mkdir()
        self._git("init", "--quiet")
        self._git("config", "user.email", "checker@example.invalid")
        self._git("config", "user.name", "Reference Checker Fixture")
        self._git("config", "commit.gpgSign", "false")
        disabled_hooks = self.workspace / "hooks-disabled"
        disabled_hooks.mkdir()
        self._git("config", "core.hooksPath", str(disabled_hooks))

    def close(self) -> None:
        """Release the disposable workspace."""
        self._temporary_directory.cleanup()

    def write(self, relative_path: str, content: str = "fixture\n", *, executable: bool = False) -> None:
        """Create one fixture file with deterministic UTF-8 content and mode."""
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        if executable:
            path.chmod(path.stat().st_mode | stat.S_IXUSR)

    def write_many(self, files: Iterable[tuple[str, str]]) -> None:
        """Create several fixture files."""
        for relative_path, content in files:
            self.write(relative_path, content)

    def symlink(self, relative_path: str, target: str) -> None:
        """Create a fixture symlink without traversing its target."""
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.symlink_to(target)

    def commit(self, message: str, *, allow_empty: bool = False) -> str:
        """Commit the fixture tree and return its full object ID."""
        self._git("add", ".")
        args = ["commit", "--quiet", "-m", message]
        if allow_empty:
            args.append("--allow-empty")
        self._git(*args)
        return self._git("rev-parse", "HEAD").stdout.strip()

    def write_json_input(self, name: str, payload: Any) -> Path:
        """Write checker input outside the scanned Git worktree."""
        path = self.workspace / name
        path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        return path

    def run_checker(
        self,
        map_path: Path,
        expected_base: str,
        *,
        state: str = "pre",
        dispositions: Path | None = None,
    ) -> subprocess.CompletedProcess[str]:
        """Invoke the real CLI against this disposable worktree."""
        command = [
            "python3",
            str(CHECKER),
            "--repo",
            str(self.root),
            "--map",
            str(map_path),
            "--expected-base",
            expected_base,
            "--state",
            state,
        ]
        if dispositions is not None:
            command.extend(["--dispositions", str(dispositions)])
        environment = os.environ.copy()
        environment["PYTHONPYCACHEPREFIX"] = str(self.workspace / "pycache")
        return subprocess.run(
            command,
            cwd=self.root,
            check=False,
            capture_output=True,
            text=True,
            env=environment,
        )

    def git_snapshot(self) -> str:
        """Hash tracked identities, modes, worktree bytes, symlinks, and status."""
        digest = hashlib.sha256()
        digest.update(self._git("status", "--porcelain=v1", "-z", "--untracked-files=all").stdout.encode())
        manifest = self._git("ls-files", "--stage", "-z").stdout
        digest.update(manifest.encode())
        for raw_record in manifest.split("\0"):
            if not raw_record:
                continue
            metadata, relative_path = raw_record.split("\t", 1)
            mode = metadata.split(" ", 1)[0]
            path = self.root / relative_path
            digest.update(relative_path.encode())
            digest.update(mode.encode())
            if mode == "120000":
                digest.update(os.readlink(path).encode())
            else:
                digest.update(path.read_bytes())
        return digest.hexdigest()

    def _git(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            ["git", *args],
            cwd=self.root,
            check=True,
            capture_output=True,
            text=True,
        )


def map_entry(
    map_id: str,
    source: str,
    target: str,
    order: int,
    *,
    closure_id: str | None = None,
    classification: str = "rename",
    dependencies: list[str] | None = None,
) -> dict[str, Any]:
    """Build one explicit fixture map entry without deriving its target."""
    entry = {
        "id": map_id,
        "source": source,
        "classification": classification,
        "dependencies": dependencies or [],
    }
    if classification == "rename":
        entry["target"] = target
    else:
        entry["reason"] = f"Fixture policy decision for {map_id}"
    return entry


def semantic_map(base_sha: str, entries: list[dict[str, Any]]) -> dict[str, Any]:
    """Build a fixture semantic-map payload."""
    return {
        "schema_version": 1,
        "base_sha": base_sha,
        "entries": entries,
    }


# ───────────────────────────────────────────────────────────────
# 2. INTEGRATION MATRIX
# ───────────────────────────────────────────────────────────────


class ReferenceCheckerIntegrationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.repo = FixtureRepository()

    def tearDown(self) -> None:
        self.repo.close()

    def _full_fixture(self) -> tuple[str, Path]:
        self.repo.write_many(
            [
                (
                    "src/old_module.ts",
                    "import '../scripts/old_script.sh';\nexport const snake_case_identifier = 1;\n",
                ),
                (
                    "src/consumer.ts",
                    "import './old_module';\n"
                    "const x = require(resolveName(name));\n"
                    "const files = glob('./*.ts');\n",
                ),
                ("lib/old_widget/index.ts", "export const widget = true;\n"),
                ("src/index-consumer.ts", "import '../lib/old_widget';\n"),
                ("scripts/old_script.sh", "#!/usr/bin/env bash\nsource ../src/old_module.ts\n"),
                ("scripts/runner.sh", "source ./old_script.sh\n./old_script.sh\nsource \"$ROOT/tool.sh\"\n"),
                ("docs/old_guide.md", "# Old guide\n"),
                (
                    "docs/guide.md",
                    "---\nmodulePath: ../src/old_module.ts\nold_config: identifier-only\n---\n"
                    "[module](../src/old_module.ts)\n",
                ),
                (
                    "config/old_config.json",
                    '{"entryPath":"../src/old_module.ts","old_config":"not/a/mapped/path"}\n',
                ),
                ("config/old_settings.yaml", "modulePath: ../scripts/old_script.sh\n"),
                ("config/old_routes.toml", 'template_path = "../docs/old_guide.md"\n'),
                ("registry/old_entry.js", "export default {};\n"),
                ("registry/scripts.json", '{"scripts":{"start":"../scripts/old_script.sh"}}\n'),
                ("python_package/module_name.py", "value = 1\n"),
                ("SKILL.md", "# Tool contract\n"),
                ("dist/generated_file.js", "generated\n"),
                ("changelog/old_note.md", "frozen\n"),
            ]
        )
        self.repo.write("scripts/old_script.sh", "#!/usr/bin/env bash\nsource ../src/old_module.ts\n", executable=True)
        self.repo.symlink("assets/old_link", "../src/old_module.ts")
        base = self.repo.commit("complete reference fixture")
        entries = [
            map_entry(
                "m-js",
                "src/old_module.ts",
                "src/new-module.ts",
                0,
                closure_id="closure-runtime",
                dependencies=["m-shell"],
            ),
            map_entry(
                "m-shell",
                "scripts/old_script.sh",
                "scripts/new-script.sh",
                1,
                closure_id="closure-runtime",
                dependencies=["m-js"],
            ),
            map_entry("m-doc", "docs/old_guide.md", "docs/new-guide.md", 2),
            map_entry("m-config", "config/old_config.json", "config/new-config.json", 3),
            map_entry("m-yaml", "config/old_settings.yaml", "config/new-settings.yaml", 4),
            map_entry("m-toml", "config/old_routes.toml", "config/new-routes.toml", 5),
            map_entry("m-reg", "registry/old_entry.js", "registry/new-entry.js", 6),
            map_entry("m-link", "assets/old_link", "assets/new-link", 7),
            map_entry("m-index", "lib/old_widget/index.ts", "lib/new-widget/index.ts", 8),
            map_entry(
                "m-python",
                "python_package/module_name.py",
                "python_package/module_name.py",
                9,
                classification="exempt",
            ),
            map_entry(
                "m-tool",
                "SKILL.md",
                "SKILL.md",
                10,
                classification="tool-mandated",
            ),
            map_entry(
                "m-generated",
                "dist/generated_file.js",
                "dist/generated_file.js",
                11,
                classification="generated",
            ),
            map_entry(
                "m-frozen",
                "changelog/old_note.md",
                "changelog/old_note.md",
                12,
                classification="frozen",
            ),
        ]
        return base, self.repo.write_json_input("map.json", semantic_map(base, entries))

    def test_complete_matrix_emits_cas_ready_read_only_ledger(self) -> None:
        base, map_path = self._full_fixture()
        baseline = self.repo.git_snapshot()

        pending = self.repo.run_checker(map_path, base)
        self.assertEqual(pending.returncode, 2, pending.stdout + pending.stderr)
        pending_ledger = json.loads(pending.stdout)
        dynamic_rows = [
            row for row in pending_ledger["rows"] if row["row_type"] == "dynamic-site"
        ]
        self.assertGreaterEqual(len(dynamic_rows), 3)
        dispositions = {
            row["site_key"]: {
                "disposition": "producer-routed",
                "rationale": "Fixture producer owns the dynamic path expression",
                "evidence": [f"reviewed:{row['site_id']}"],
            }
            for row in dynamic_rows
            if row["status"] == "pending"
        }
        disposition_path = self.repo.write_json_input("dispositions.json", dispositions)

        result = self.repo.run_checker(map_path, base, dispositions=disposition_path)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        ledger = json.loads(result.stdout)
        self.assertTrue(ledger["accepted"])
        self.assertEqual(ledger["plan_identity"]["base_sha"], base)
        self.assertEqual(ledger["plan_identity"]["head_sha"], base)
        self.assertEqual(
            ledger["plan_identity"]["pre_write_revalidation"],
            [
                "head-equals-base",
                "map-hash-equals-plan",
                "clean-tree",
                "source-target-set-and-order-equals-plan",
            ],
        )
        self.assertEqual(ledger["scan"]["symlink_count"], 1)
        self.assertGreater(ledger["scan"]["tracked_file_count"], 0)
        self.assertEqual(self.repo.git_snapshot(), baseline)

        rows_by_id = {
            row["map_id"]: row
            for row in ledger["rows"]
            if row["row_type"] == "map-entry"
        }
        self.assertEqual(set(rows_by_id), {f"m-{name}" for name in [
            "js", "shell", "doc", "config", "yaml", "toml", "reg", "link", "index",
            "python", "tool", "generated", "frozen",
        ]})
        self.assertEqual(rows_by_id["m-python"]["status"], "preserved")
        self.assertEqual(rows_by_id["m-tool"]["decision"], "tool-mandated")

        kinds = {
            site["reference_kind"]
            for row in rows_by_id.values()
            for site in row["reference_sites"]
        }
        self.assertTrue(
            {
                "js-module",
                "markdown-link",
                "config-path",
                "registry-path",
                "shell-source",
                "shell-executable",
                "symlink-target",
            }.issubset(kinds)
        )
        raw_values = {
            site["raw_value"]
            for row in rows_by_id.values()
            for site in row["reference_sites"]
        }
        self.assertNotIn("old_config", raw_values)
        self.assertNotIn("snake_case_identifier", raw_values)
        self.assertIn("../src/old_module.ts", raw_values)

        runtime_batch = next(
            batch
            for batch in ledger["reference_graph"]["scc_batches"]
            if batch["map_ids"] == ["m-js", "m-shell"]
        )
        self.assertEqual(runtime_batch["map_ids"], ["m-js", "m-shell"])
        self.assertEqual(runtime_batch["extensions"], [".sh", ".ts"])
        self.assertEqual(runtime_batch["batch_rule"], "reference-graph-scc")

        js_site = rows_by_id["m-js"]["reference_sites"][0]
        expected_blob = self.repo._git(
            "ls-files", "--stage", "--", js_site["file"]
        ).stdout.split()[1]
        self.assertEqual(js_site["preimage_blob_hash"], expected_blob)
        self.assertEqual(js_site["cas_rule"], "regenerate-on-preimage-drift")
        for operation in ledger["plan_identity"]["ordered_operations"]:
            if operation["classification"] != "rename":
                self.assertEqual(operation["operation"], "preserve")
                self.assertIsNone(operation["safe_argv"])
                continue
            self.assertEqual(operation["safe_argv"][:3], ["git", "mv", "--"])

    def test_ambiguous_extension_and_index_resolution_fails(self) -> None:
        self.repo.write("src/thing.ts", "export default 1;\n")
        self.repo.write("src/thing/index.ts", "export default 2;\n")
        self.repo.write("src/consumer.ts", "import './thing';\n")
        base = self.repo.commit("ambiguous module")
        map_path = self.repo.write_json_input(
            "map.json",
            semantic_map(base, [map_entry("m-thing", "src/thing.ts", "src/new-thing.ts", 0)]),
        )

        result = self.repo.run_checker(map_path, base)
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
        ledger = json.loads(result.stdout)
        self.assertTrue(any("ambiguous mapped reference" in error for error in ledger["errors"]))

    def test_post_state_rejects_stale_source_reference(self) -> None:
        self.repo.write("src/old_name.ts", "export default 1;\n")
        self.repo.write("src/consumer.ts", "import './old_name';\n")
        base = self.repo.commit("pre rename state")
        map_path = self.repo.write_json_input(
            "map.json",
            semantic_map(base, [map_entry("m-name", "src/old_name.ts", "src/new-name.ts", 0)]),
        )

        result = self.repo.run_checker(map_path, base, state="post")
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
        ledger = json.loads(result.stdout)
        self.assertTrue(any("stale source reference" in error for error in ledger["errors"]))

    def test_missing_mapped_source_fails_with_map_location(self) -> None:
        self.repo.write("sentinel.txt", "keeps the scan denominator non-zero\n")
        base = self.repo.commit("missing source")
        map_path = self.repo.write_json_input(
            "map.json",
            semantic_map(
                base,
                [map_entry("m-missing", "src/missing_name.ts", "src/missing-name.ts", 0)],
            ),
        )

        result = self.repo.run_checker(map_path, base)
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
        ledger = json.loads(result.stdout)
        self.assertTrue(
            any("map m-missing: pre state" in error for error in ledger["errors"])
        )


# ───────────────────────────────────────────────────────────────
# 3. HARD FAILURE GATES
# ───────────────────────────────────────────────────────────────


class ReferenceCheckerFailureGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.repo = FixtureRepository()

    def tearDown(self) -> None:
        self.repo.close()

    def test_zero_tracked_files_is_a_hard_failure(self) -> None:
        base = self.repo.commit("empty", allow_empty=True)
        map_path = self.repo.write_json_input(
            "map.json",
            semantic_map(base, [map_entry("m-missing", "old_name.js", "new-name.js", 0)]),
        )
        result = self.repo.run_checker(map_path, base)
        self.assertEqual(result.returncode, 2)
        self.assertIn("zero files", result.stderr)

    def test_dirty_tree_and_head_drift_abort_before_scan(self) -> None:
        self.repo.write("old_name.js", "module.exports = 1;\n")
        base = self.repo.commit("base")
        map_path = self.repo.write_json_input(
            "map.json",
            semantic_map(base, [map_entry("m-name", "old_name.js", "new-name.js", 0)]),
        )
        self.repo.write("untracked.txt", "dirty\n")
        dirty = self.repo.run_checker(map_path, base)
        self.assertEqual(dirty.returncode, 2)
        self.assertIn("dirty tree", dirty.stderr)

        (self.repo.root / "untracked.txt").unlink()
        self.repo.write("second.txt", "next\n")
        self.repo.commit("advance head")
        stale = self.repo.run_checker(map_path, base)
        self.assertEqual(stale.returncode, 2)
        self.assertIn("stale plan", stale.stderr)

    def test_map_hash_is_bound_to_exact_map_bytes(self) -> None:
        self.repo.write("old_name.js", "module.exports = 1;\n")
        base = self.repo.commit("base")
        payload = semantic_map(
            base, [map_entry("m-name", "old_name.js", "new-name.js", 0)]
        )
        first_path = self.repo.write_json_input("map.json", payload)
        first = self.repo.run_checker(first_path, base)
        self.assertEqual(first.returncode, 0, first.stdout + first.stderr)
        first_hash = json.loads(first.stdout)["plan_identity"]["map_hash"]

        first_path.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
        second = self.repo.run_checker(first_path, base)
        self.assertEqual(second.returncode, 0, second.stdout + second.stderr)
        second_hash = json.loads(second.stdout)["plan_identity"]["map_hash"]
        self.assertNotEqual(first_hash, second_hash)

    def test_leading_hyphen_operands_are_option_terminated(self) -> None:
        self.repo.write("-old_name.js", "module.exports = 1;\n")
        base = self.repo.commit("leading hyphen")
        map_path = self.repo.write_json_input(
            "map.json",
            semantic_map(base, [map_entry("m-leading", "-old_name.js", "-new-name.js", 0)]),
        )
        result = self.repo.run_checker(map_path, base)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        operation = json.loads(result.stdout)["plan_identity"]["ordered_operations"][0]
        self.assertEqual(
            operation["safe_argv"],
            ["git", "mv", "--", "-old_name.js", "-new-name.js"],
        )

    def test_exact_casefold_and_nfc_target_collisions_abort(self) -> None:
        self.repo.write("a_name.js", "a\n")
        self.repo.write("b_name.js", "b\n")
        base = self.repo.commit("collision sources")
        collision_targets = [
            ("same-name.js", "same-name.js", "exact target collision"),
            ("Name.js", "name.js", "casefold target collision"),
            (
                "caf\u00e9.js",
                unicodedata.normalize("NFD", "caf\u00e9.js"),
                "nfc target collision",
            ),
        ]
        for first_target, second_target, expected in collision_targets:
            with self.subTest(expected=expected):
                entries = [
                    map_entry("m-a", "a_name.js", first_target, 0),
                    map_entry("m-b", "b_name.js", second_target, 1),
                ]
                path = self.repo.write_json_input(
                    f"map-{hashlib.sha1(expected.encode()).hexdigest()}.json",
                    semantic_map(base, entries),
                )
                result = self.repo.run_checker(path, base)
                self.assertEqual(result.returncode, 2)
                self.assertIn(expected, result.stderr)


if __name__ == "__main__":
    unittest.main(verbosity=2)
