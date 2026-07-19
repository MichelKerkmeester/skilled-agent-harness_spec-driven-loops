#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: Reference Rewrite Executor Tests
# ───────────────────────────────────────────────────────────────
"""Disposable Git fixture tests for deterministic static reference rewrites."""

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

TEST_ROOT = Path(__file__).resolve().parent
SK_DOC_ROOT = TEST_ROOT.parents[1]
SHARED_SCRIPTS = SK_DOC_ROOT / "shared" / "scripts"
CHECKER = SHARED_SCRIPTS / "reference_checker.py"
EXECUTOR = SHARED_SCRIPTS / "reference_rewrite_executor.py"
DISPOSABLE_MARKER = ".rename-engine-disposable"
DISPOSABLE_CONTENT = "semantic-rename-engine disposable fixture\n"


class FixtureRepository:
    """A disposable Git repository with external plan inputs and journals."""

    def __init__(self, *, opt_in: bool = True) -> None:
        self._temporary_directory = tempfile.TemporaryDirectory()
        self.workspace = Path(self._temporary_directory.name)
        self.root = self.workspace / "repo"
        self.root.mkdir()
        self._git("init", "--quiet")
        self._git("config", "user.email", "rewrite@example.invalid")
        self._git("config", "user.name", "Reference Rewrite Fixture")
        self._git("config", "commit.gpgSign", "false")
        hooks = self.workspace / "hooks-disabled"
        hooks.mkdir()
        self._git("config", "core.hooksPath", str(hooks))
        if opt_in:
            self._git("config", "rename-engine.disposable", "true")

    def close(self) -> None:
        """Release the disposable repository."""
        self._temporary_directory.cleanup()

    def write(self, relative_path: str, content: str, *, executable: bool = False) -> None:
        """Write one UTF-8 fixture file with an optional executable bit."""
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        if executable:
            path.chmod(path.stat().st_mode | stat.S_IXUSR)

    def write_many(self, files: Iterable[tuple[str, str]]) -> None:
        """Write several UTF-8 fixture files."""
        for relative_path, content in files:
            self.write(relative_path, content)

    def symlink(self, relative_path: str, target: str) -> None:
        """Create a fixture symlink without following its target."""
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.symlink_to(target)

    def commit(self, message: str, *, allow_empty: bool = False) -> str:
        """Commit the fixture tree and return HEAD."""
        self._git("add", ".")
        arguments = ["commit", "--quiet", "-m", message]
        if allow_empty:
            arguments.append("--allow-empty")
        self._git(*arguments)
        return self._git("rev-parse", "HEAD").stdout.strip()

    def external_json(self, name: str, value: Any) -> Path:
        """Write one executor input outside the fixture repository."""
        path = self.workspace / name
        path.write_text(json.dumps(value, indent=2), encoding="utf-8")
        return path

    def run_checker(
        self,
        map_path: Path,
        base_sha: str,
        dispositions: Path | None = None,
    ) -> subprocess.CompletedProcess[str]:
        """Run the committed read-only checker against this fixture."""
        command = [
            "python3",
            str(CHECKER),
            "--repo",
            str(self.root),
            "--map",
            str(map_path),
            "--expected-base",
            base_sha,
        ]
        if dispositions is not None:
            command.extend(["--dispositions", str(dispositions)])
        return self._run(command)

    def run_executor(
        self,
        map_path: Path,
        ledger_path: Path,
        batch_id: str,
        *extra: str,
    ) -> subprocess.CompletedProcess[str]:
        """Run the real executor CLI against this fixture."""
        return self._run(
            [
                "python3",
                str(EXECUTOR),
                "--repo",
                str(self.root),
                "--map",
                str(map_path),
                "--ledger",
                str(ledger_path),
                "--batch",
                batch_id,
                *extra,
            ]
        )

    def snapshot(self) -> str:
        """Hash status, tracked modes, regular bytes and symlink targets."""
        digest = hashlib.sha256()
        status_output = self._git(
            "status", "--porcelain=v1", "-z", "--untracked-files=all"
        ).stdout
        digest.update(status_output.encode())
        manifest = self._git("ls-files", "--stage", "-z").stdout
        digest.update(manifest.encode())
        for record in manifest.split("\0"):
            if not record:
                continue
            metadata, relative_path = record.split("\t", 1)
            mode = metadata.split(" ", 1)[0]
            path = self.root / relative_path
            digest.update(relative_path.encode())
            digest.update(mode.encode())
            if mode == "120000":
                digest.update(os.readlink(path).encode())
            else:
                digest.update(path.read_bytes())
        return digest.hexdigest()

    def mode(self, relative_path: str) -> int:
        """Return permission bits for one regular fixture file."""
        return stat.S_IMODE((self.root / relative_path).stat().st_mode)

    def _run(self, command: list[str]) -> subprocess.CompletedProcess[str]:
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

    def _git(self, *arguments: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            ["git", *arguments],
            cwd=self.root,
            check=True,
            capture_output=True,
            text=True,
        )


def map_entry(
    map_id: str,
    source: str,
    target: str | None = None,
    *,
    classification: str = "rename",
    dependencies: list[str] | None = None,
) -> dict[str, Any]:
    """Build one explicit fixture decision without deriving its target."""
    value: dict[str, Any] = {
        "id": map_id,
        "source": source,
        "classification": classification,
        "dependencies": dependencies or [],
    }
    if classification == "rename":
        value["target"] = target
    else:
        value["reason"] = f"Fixture policy preserves {source}"
    return value


def semantic_map(base_sha: str, entries: list[dict[str, Any]]) -> dict[str, Any]:
    """Build one explicit semantic-map document."""
    return {"schema_version": 1, "base_sha": base_sha, "entries": entries}


# ───────────────────────────────────────────────────────────────
# 2. EXECUTOR INTEGRATION
# ───────────────────────────────────────────────────────────────


class ReferenceRewriteExecutorTests(unittest.TestCase):
    """Exercise deterministic planning and fixture-only apply safety."""

    def setUp(self) -> None:
        """Create a fresh disposable repository for each test."""
        self.repo = FixtureRepository()

    def tearDown(self) -> None:
        """Release the disposable repository after each test."""
        self.repo.close()

    def _fixture(self) -> tuple[str, Path, Path, dict[str, Any], str]:
        self.repo.write_many(
            [
                (DISPOSABLE_MARKER, DISPOSABLE_CONTENT),
                (
                    "src/old_module.ts",
                    "import '../scripts/old_script.sh';\n"
                    "export const snake_case_identifier = 1;\n",
                ),
                (
                    "src/consumer.ts",
                    "import './old_module';\n"
                    "const dynamicPath = require(resolveName(name));\n",
                ),
                ("scripts/old_script.sh", "#!/usr/bin/env bash\nsource ../src/old_module.ts\n"),
                (
                    "scripts/runner.sh",
                    "#!/usr/bin/env bash\nsource ./old_script.sh\n./old_script.sh\n",
                ),
                ("docs/old_guide.md", "# Old guide\n"),
                (
                    "docs/guide.md",
                    "---\nmodulePath: ../src/old_module.ts\nfrontmatter_field: unchanged\n---\n"
                    "[module](../src/old_module.ts)\n",
                ),
                (
                    "config/old_config.json",
                    '{"entryPath":"../src/old_module.ts","old_config":"identifier-only"}\n',
                ),
                ("config/old_settings.yaml", "modulePath: ../scripts/old_script.sh\n"),
                ("config/old_routes.toml", 'template_path = "../docs/old_guide.md"\n'),
                ("registry/old_entry.js", "export default {};\n"),
                ("registry/scripts.json", '{"scripts":{"start":"../scripts/old_script.sh"}}\n'),
                ("notes/off-ledger.txt", "plain text ../src/old_module.ts stays unchanged\n"),
                ("python_package/module_name.py", "value = 1\n"),
                ("SKILL.md", "# Tool contract\n"),
                ("dist/generated_file.js", "generated\n"),
                ("changelog/old_note.md", "frozen\n"),
            ]
        )
        self.repo.write(
            "scripts/old_script.sh",
            "#!/usr/bin/env bash\nsource ../src/old_module.ts\n",
            executable=True,
        )
        self.repo.write(
            "scripts/runner.sh",
            "#!/usr/bin/env bash\nsource ./old_script.sh\n./old_script.sh\n",
            executable=True,
        )
        self.repo.symlink("assets/old_link", "../src/old_module.ts")
        base_sha = self.repo.commit("complete executor fixture")
        entries = [
            map_entry(
                "m-js",
                "src/old_module.ts",
                "src/new-module.ts",
                dependencies=["m-shell"],
            ),
            map_entry(
                "m-shell",
                "scripts/old_script.sh",
                "scripts/new-script.sh",
                dependencies=["m-js"],
            ),
            map_entry("m-doc", "docs/old_guide.md", "docs/new-guide.md"),
            map_entry("m-config", "config/old_config.json", "config/new-config.json"),
            map_entry("m-yaml", "config/old_settings.yaml", "config/new-settings.yaml"),
            map_entry("m-toml", "config/old_routes.toml", "config/new-routes.toml"),
            map_entry("m-registry", "registry/old_entry.js", "registry/new-entry.js"),
            map_entry("m-link", "assets/old_link", "assets/new-link"),
            map_entry(
                "m-python",
                "python_package/module_name.py",
                classification="exempt",
            ),
            map_entry("m-tool", "SKILL.md", classification="tool-mandated"),
            map_entry("m-generated", "dist/generated_file.js", classification="generated"),
            map_entry("m-frozen", "changelog/old_note.md", classification="frozen"),
        ]
        map_path = self.repo.external_json("map.json", semantic_map(base_sha, entries))
        first = self.repo.run_checker(map_path, base_sha)
        self.assertEqual(first.returncode, 2, first.stdout + first.stderr)
        first_ledger = json.loads(first.stdout)
        dispositions = {
            row["site_key"]: {
                "disposition": "producer-routed",
                "rationale": "The fixture producer owns this dynamic expression",
                "evidence": [f"reviewed:{row['site_id']}"],
            }
            for row in first_ledger["rows"]
            if row["row_type"] == "dynamic-site" and row["status"] == "pending"
        }
        disposition_path = self.repo.external_json("dispositions.json", dispositions)
        checked = self.repo.run_checker(map_path, base_sha, disposition_path)
        self.assertEqual(checked.returncode, 0, checked.stdout + checked.stderr)
        ledger = json.loads(checked.stdout)
        ledger_path = self.repo.external_json("ledger.json", ledger)
        runtime_batch = next(
            batch
            for batch in ledger["reference_graph"]["scc_batches"]
            if batch["map_ids"] == ["m-js", "m-shell"]
        )
        return base_sha, map_path, ledger_path, ledger, runtime_batch["batch_id"]

    def _plan(self) -> tuple[Path, Path, dict[str, Any], str]:
        _, map_path, ledger_path, _, batch_id = self._fixture()
        result = self.repo.run_executor(map_path, ledger_path, batch_id)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        plan = json.loads(result.stdout)
        plan_path = self.repo.external_json("plan.json", plan)
        return map_path, ledger_path, plan, batch_id

    def test_dry_run_is_deterministic_complete_and_read_only(self) -> None:
        _, map_path, ledger_path, ledger, batch_id = self._fixture()
        baseline = self.repo.snapshot()

        first = self.repo.run_executor(map_path, ledger_path, batch_id)
        second = self.repo.run_executor(map_path, ledger_path, batch_id)

        self.assertEqual(first.returncode, 0, first.stdout + first.stderr)
        self.assertEqual(first.stdout, second.stdout)
        plan = json.loads(first.stdout)
        self.assertGreater(plan["summary"]["pending_rewrites"], 0)
        self.assertEqual(plan["batch"]["batch_rule"], "reference-graph-scc")
        self.assertEqual(plan["base_sha"], ledger["plan_identity"]["base_sha"])
        self.assertEqual(plan["head_sha"], ledger["plan_identity"]["head_sha"])
        self.assertEqual(plan["map_hash"], ledger["plan_identity"]["map_hash"])
        self.assertTrue(plan["engine_plan_id"])
        self.assertTrue(
            any(state["state"] == "routed-to-producer" for state in plan["site_states"])
        )
        kinds = {site["reference_kind"] for site in plan["sites"]}
        self.assertTrue(
            {
                "config-path",
                "js-module",
                "markdown-link",
                "registry-path",
                "shell-executable",
                "shell-source",
                "symlink-target",
            }.issubset(kinds)
        )
        self.assertEqual(self.repo.snapshot(), baseline)

    def test_apply_idempotent_rerun_and_rollback_preserve_modes(self) -> None:
        map_path, ledger_path, plan, batch_id = self._plan()
        plan_path = self.repo.external_json("plan-reviewed.json", plan)
        journal_path = self.repo.workspace / "journal.json"
        runner_mode = self.repo.mode("scripts/runner.sh")

        applied = self.repo.run_executor(
            map_path,
            ledger_path,
            batch_id,
            "--apply",
            "--plan",
            str(plan_path),
            "--journal",
            str(journal_path),
        )

        self.assertEqual(applied.returncode, 0, applied.stdout + applied.stderr)
        self.assertIn("./new-script.sh", (self.repo.root / "scripts/runner.sh").read_text())
        self.assertIn("./new-module", (self.repo.root / "src/consumer.ts").read_text())
        self.assertEqual(os.readlink(self.repo.root / "assets/old_link"), "../src/new-module.ts")
        self.assertEqual(self.repo.mode("scripts/runner.sh"), runner_mode)
        self.assertIn("old_config", (self.repo.root / "config/old_config.json").read_text())
        self.assertIn("frontmatter_field", (self.repo.root / "docs/guide.md").read_text())
        self.assertIn("old_module", (self.repo.root / "notes/off-ledger.txt").read_text())

        rerun = self.repo.run_executor(map_path, ledger_path, batch_id)
        self.assertEqual(rerun.returncode, 0, rerun.stdout + rerun.stderr)
        self.assertEqual(json.loads(rerun.stdout)["summary"]["pending_rewrites"], 0)

        rolled_back = self.repo.run_executor(
            map_path,
            ledger_path,
            batch_id,
            "--rollback",
            "--plan",
            str(plan_path),
            "--journal",
            str(journal_path),
        )
        self.assertEqual(rolled_back.returncode, 0, rolled_back.stdout + rolled_back.stderr)
        self.assertEqual(self.repo._git("status", "--porcelain").stdout, "")
        self.assertEqual(self.repo.mode("scripts/runner.sh"), runner_mode)
        self.assertEqual(os.readlink(self.repo.root / "assets/old_link"), "../src/old_module.ts")

    def test_blob_drift_regenerates_only_the_selected_scc(self) -> None:
        map_path, ledger_path, plan, batch_id = self._plan()
        plan_path = self.repo.external_json("plan-reviewed.json", plan)
        journal_path = self.repo.workspace / "journal.json"
        other_batch_before = (self.repo.root / "config/old_routes.toml").read_bytes()

        result = self.repo.run_executor(
            map_path,
            ledger_path,
            batch_id,
            "--apply",
            "--plan",
            str(plan_path),
            "--journal",
            str(journal_path),
            "--inject-drift-file",
            "src/consumer.ts",
        )

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        payload = json.loads(result.stdout)
        self.assertTrue(payload["regenerated"])
        consumer = (self.repo.root / "src/consumer.ts").read_text(encoding="utf-8")
        self.assertTrue(consumer.startswith("fixture drift\n"))
        self.assertIn("./new-module", consumer)
        self.assertEqual((self.repo.root / "config/old_routes.toml").read_bytes(), other_batch_before)
        journal = json.loads(journal_path.read_text(encoding="utf-8"))
        self.assertTrue(journal["regenerated"])
        rolled_back = self.repo.run_executor(
            map_path,
            ledger_path,
            batch_id,
            "--rollback",
            "--plan",
            str(plan_path),
            "--journal",
            str(journal_path),
        )
        self.assertEqual(rolled_back.returncode, 0, rolled_back.stdout + rolled_back.stderr)
        restored = (self.repo.root / "src/consumer.ts").read_text(encoding="utf-8")
        self.assertTrue(restored.startswith("fixture drift\n"))
        self.assertIn("./old_module", restored)

    def test_injected_failure_reports_and_replays_inverse_journal(self) -> None:
        map_path, ledger_path, plan, batch_id = self._plan()
        plan_path = self.repo.external_json("plan-reviewed.json", plan)
        journal_path = self.repo.workspace / "journal.json"
        baseline = self.repo.snapshot()

        result = self.repo.run_executor(
            map_path,
            ledger_path,
            batch_id,
            "--apply",
            "--plan",
            str(plan_path),
            "--journal",
            str(journal_path),
            "--inject-failure-after-writes",
            "1",
        )

        self.assertEqual(result.returncode, 2)
        journal = json.loads(journal_path.read_text(encoding="utf-8"))
        self.assertEqual(journal["state"], "failed-rolled-back")
        self.assertEqual(len(journal["completed_files"]), 1)
        self.assertEqual(len(journal["reverted_files"]), 1)
        self.assertEqual(self.repo.snapshot(), baseline)

    def test_dirty_tree_head_map_and_plan_drift_abort_before_write(self) -> None:
        map_path, ledger_path, plan, batch_id = self._plan()
        plan_path = self.repo.external_json("plan-reviewed.json", plan)
        journal_path = self.repo.workspace / "journal.json"
        baseline = self.repo.snapshot()
        self.repo.write("untracked.txt", "dirty\n")
        dirty = self.repo.run_executor(
            map_path,
            ledger_path,
            batch_id,
            "--apply",
            "--plan",
            str(plan_path),
            "--journal",
            str(journal_path),
        )
        self.assertEqual(dirty.returncode, 2)
        # A foreign untracked file is outside the ledger rewrite surface and still aborts the apply.
        self.assertIn("foreign changes", dirty.stderr)
        (self.repo.root / "untracked.txt").unlink()
        self.assertEqual(self.repo.snapshot(), baseline)

        tampered = dict(plan)
        tampered["ordered_operations"] = list(reversed(tampered["ordered_operations"]))
        tampered_path = self.repo.external_json("plan-tampered.json", tampered)
        rejected = self.repo.run_executor(
            map_path,
            ledger_path,
            batch_id,
            "--apply",
            "--plan",
            str(tampered_path),
            "--journal",
            str(journal_path),
        )
        self.assertEqual(rejected.returncode, 2)
        self.assertIn("ordered operations", rejected.stderr)
        self.assertEqual(self.repo.snapshot(), baseline)

        self.repo.write("advance.txt", "next commit\n")
        self.repo.commit("advance fixture head")
        head_rejected = self.repo.run_executor(
            map_path,
            ledger_path,
            batch_id,
            "--apply",
            "--plan",
            str(plan_path),
            "--journal",
            str(journal_path),
        )
        self.assertEqual(head_rejected.returncode, 2)
        self.assertIn("HEAD changed", head_rejected.stderr)

        map_value = json.loads(map_path.read_text(encoding="utf-8"))
        map_path.write_text(json.dumps(map_value, separators=(",", ":")), encoding="utf-8")
        map_rejected = self.repo.run_executor(map_path, ledger_path, batch_id)
        self.assertEqual(map_rejected.returncode, 2)
        self.assertIn("map hash", map_rejected.stderr)

    def test_zero_file_scan_is_a_hard_failure(self) -> None:
        _, map_path, ledger_path, ledger, batch_id = self._fixture()
        ledger["scan"]["scanned_reference_file_count"] = 0
        ledger_without_hash = dict(ledger)
        ledger_without_hash.pop("ledger_hash")
        canonical = json.dumps(
            ledger_without_hash,
            ensure_ascii=False,
            separators=(",", ":"),
            sort_keys=True,
        ).encode("utf-8")
        ledger["ledger_hash"] = hashlib.sha256(canonical).hexdigest()
        zero_path = self.repo.external_json("ledger-zero.json", ledger)

        result = self.repo.run_executor(map_path, zero_path, batch_id)

        self.assertEqual(result.returncode, 2)
        self.assertIn("zero-file scan", result.stderr)

    def test_outside_and_symlink_ancestor_sites_are_rejected(self) -> None:
        _, map_path, ledger_path, ledger, batch_id = self._fixture()
        outside_ledger = json.loads(json.dumps(ledger))
        site = next(
            site
            for row in outside_ledger["rows"]
            if row.get("map_id") == "m-js"
            for site in row["reference_sites"]
        )
        site["file"] = "../outside.ts"
        unhashed = dict(outside_ledger)
        unhashed.pop("ledger_hash")
        outside_ledger["ledger_hash"] = hashlib.sha256(
            json.dumps(
                unhashed,
                ensure_ascii=False,
                separators=(",", ":"),
                sort_keys=True,
            ).encode("utf-8")
        ).hexdigest()
        outside_path = self.repo.external_json("ledger-outside.json", outside_ledger)
        outside = self.repo.run_executor(map_path, outside_path, batch_id)
        self.assertEqual(outside.returncode, 2)
        self.assertIn("escapes or enters repository metadata", outside.stderr)

        source_directory = self.repo.root / "src"
        real_directory = self.repo.root / "real-src"
        source_directory.rename(real_directory)
        source_directory.symlink_to("real-src", target_is_directory=True)
        symlinked = self.repo.run_executor(map_path, ledger_path, batch_id)
        self.assertEqual(symlinked.returncode, 2)
        self.assertIn("traverses symlinked directory", symlinked.stderr)

    def test_leading_hyphen_is_option_terminated_and_collisions_abort(self) -> None:
        self.repo.write_many(
            [
                (DISPOSABLE_MARKER, DISPOSABLE_CONTENT),
                ("-old_name.js", "module.exports = 1;\n"),
                ("consumer.js", "require('./-old_name.js');\n"),
            ]
        )
        base_sha = self.repo.commit("leading hyphen")
        map_path = self.repo.external_json(
            "leading-map.json",
            semantic_map(base_sha, [map_entry("m-leading", "-old_name.js", "-new-name.js")]),
        )
        checked = self.repo.run_checker(map_path, base_sha)
        self.assertEqual(checked.returncode, 0, checked.stdout + checked.stderr)
        ledger = json.loads(checked.stdout)
        ledger_path = self.repo.external_json("leading-ledger.json", ledger)
        batch_id = ledger["reference_graph"]["scc_batches"][0]["batch_id"]
        result = self.repo.run_executor(map_path, ledger_path, batch_id)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        operation = json.loads(result.stdout)["ordered_operations"][0]
        self.assertEqual(operation["safe_argv"][:3], ["git", "mv", "--"])

        collision_pairs = [
            ("same-name.js", "same-name.js", "exact target collision"),
            ("Name.js", "name.js", "casefold target collision"),
            (
                "caf\u00e9.js",
                unicodedata.normalize("NFD", "caf\u00e9.js"),
                "nfc target collision",
            ),
        ]
        for first_target, second_target, expected in collision_pairs:
            with self.subTest(expected=expected):
                payload = semantic_map(
                    base_sha,
                    [
                        map_entry("m-a", "-old_name.js", first_target),
                        map_entry("m-b", "consumer.js", second_target),
                    ],
                )
                collision_path = self.repo.external_json(f"collision-{expected}.json", payload)
                rejected = self.repo.run_executor(collision_path, ledger_path, batch_id)
                self.assertEqual(rejected.returncode, 2)
                self.assertIn(expected, rejected.stderr)

    def test_apply_requires_both_disposable_opt_ins(self) -> None:
        map_path, ledger_path, plan, batch_id = self._plan()
        plan_path = self.repo.external_json("plan-reviewed.json", plan)
        journal_path = self.repo.workspace / "journal.json"
        self.repo._git("config", "--unset", "rename-engine.disposable")

        result = self.repo.run_executor(
            map_path,
            ledger_path,
            batch_id,
            "--apply",
            "--plan",
            str(plan_path),
            "--journal",
            str(journal_path),
        )

        self.assertEqual(result.returncode, 2)
        self.assertIn("rename-engine.disposable=true", result.stderr)
        self.assertFalse(journal_path.exists())


if __name__ == "__main__":
    unittest.main(verbosity=2)
