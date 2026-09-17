# Edits for unit renames-tests

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py`

OLD:

~~~~text
        (self.root / destination).parent.mkdir(parents=True, exist_ok=True)
        self._git("mv", source, destination)

    def commit(self, message: str) -> str:
~~~~

NEW:

~~~~text
        (self.root / destination).parent.mkdir(parents=True, exist_ok=True)
        self._git("mv", source, destination)

    def stage_all(self) -> None:
        self._git("add", ".")

    def commit(self, message: str) -> str:
~~~~

## Edit 2

File: `.opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py`

OLD:

~~~~text
        self.assertNotIn("new_dir_x/legacy_name.yaml", result.stdout)

    def test_every_exemption_passes_both_modes(self) -> None:
        self.repo.write_many(
~~~~

NEW:

~~~~text
        self.assertNotIn("new_dir_x/legacy_name.yaml", result.stdout)

    def test_changed_since_still_rejects_a_copy_that_keeps_a_snake_name(self) -> None:
        self.repo.write("config/legacy_name.yaml", "a\nb\nc\n")
        base = self.repo.commit("base with a grandfathered name")

        self.repo.write("copied-config/legacy_name.yaml", "a\nb\nc\n")
        self.repo.write("config/legacy_name.yaml", "a\nb\nc\nd\n")
        self.repo.stage_all()
        result = self.repo.guard("--changed-since", base)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("copied-config/legacy_name.yaml", result.stdout)

    def test_every_exemption_passes_both_modes(self) -> None:
        self.repo.write_many(
~~~~
