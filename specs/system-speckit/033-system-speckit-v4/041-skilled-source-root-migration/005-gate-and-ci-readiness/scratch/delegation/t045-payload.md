# Edits for unit t045

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py`

OLD:

~~~~text
    def write_many(self, paths: Iterable[str]) -> None:
        for path in paths:
            self.write(path)

~~~~

NEW:

~~~~text
    def write_many(self, paths: Iterable[str]) -> None:
        for path in paths:
            self.write(path)

    def move(self, source: str, destination: str) -> None:
        (self.root / destination).parent.mkdir(parents=True, exist_ok=True)
        self._git("mv", source, destination)

~~~~

## Edit 2

File: `.opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py`

OLD:

~~~~text
    def test_every_exemption_passes_both_modes(self) -> None:
~~~~

NEW:

~~~~text
    def test_changed_since_accepts_a_move_that_keeps_its_basename(self) -> None:
        self.repo.write("config/legacy_name.yaml")
        base = self.repo.commit("base with a grandfathered name")

        self.repo.move("config/legacy_name.yaml", "moved-config/legacy_name.yaml")
        result = self.repo.guard("--changed-since", base)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_changed_since_still_rejects_a_rename_to_a_new_snake_name(self) -> None:
        self.repo.write("config/legacy_name.yaml")
        base = self.repo.commit("base with a grandfathered name")

        self.repo.move("config/legacy_name.yaml", "config/other_name.yaml")
        result = self.repo.guard("--changed-since", base)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("config/other_name.yaml", result.stdout)

    def test_changed_since_still_rejects_a_move_into_a_new_snake_directory(self) -> None:
        self.repo.write("config/legacy_name.yaml")
        base = self.repo.commit("base with a grandfathered name")

        self.repo.move("config/legacy_name.yaml", "new_dir_x/legacy_name.yaml")
        result = self.repo.guard("--changed-since", base)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("new_dir_x", result.stdout)
        self.assertNotIn("new_dir_x/legacy_name.yaml", result.stdout)

    def test_every_exemption_passes_both_modes(self) -> None:
~~~~
