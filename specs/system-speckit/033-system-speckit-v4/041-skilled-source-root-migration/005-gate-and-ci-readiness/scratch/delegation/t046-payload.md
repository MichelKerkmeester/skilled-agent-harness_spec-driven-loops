# Edits for unit t046

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py`

OLD:

~~~~text
def _changed_destinations(repo_root: Path, ref: str) -> set[PurePosixPath]:
    """Return added, copied, renamed, and untracked destinations since ``ref``."""
~~~~

NEW:

~~~~text
def _changed_destinations(
    repo_root: Path, ref: str
) -> tuple[set[PurePosixPath], set[PurePosixPath]]:
    """Return added, copied, renamed, and untracked destinations since ``ref``.

    The second set holds the rename and copy destinations that keep their source
    basename: those moved an existing name rather than introducing one.
    """
~~~~

## Edit 2

File: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py`

OLD:

~~~~text
    changed: set[PurePosixPath] = set()
    index = 0
~~~~

NEW:

~~~~text
    changed: set[PurePosixPath] = set()
    kept_names: set[PurePosixPath] = set()
    index = 0
~~~~

## Edit 3

File: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py`

OLD:

~~~~text
            if index + 1 >= len(fields):
                raise GuardError("git returned a truncated rename/copy record")
            index += 1
            changed.add(_decode_path(fields[index]))
            index += 1
            continue
~~~~

NEW:

~~~~text
            if index + 1 >= len(fields):
                raise GuardError("git returned a truncated rename/copy record")
            source = _decode_path(fields[index])
            index += 1
            destination = _decode_path(fields[index])
            changed.add(destination)
            if destination.name == source.name:
                kept_names.add(destination)
            index += 1
            continue
~~~~

## Edit 4

File: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py`

OLD:

~~~~text
    changed.update(_decode_path(raw_path) for raw_path in untracked.split(b"\0") if raw_path)
    return changed
~~~~

NEW:

~~~~text
    changed.update(_decode_path(raw_path) for raw_path in untracked.split(b"\0") if raw_path)
    return changed, kept_names
~~~~

## Edit 5

File: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py`

OLD:

~~~~text
    for changed_path in _changed_destinations(repo_root, ref):
        for candidate in _candidate_prefixes(changed_path):
            if candidate in base_paths or _is_tree_exempt(candidate, completed_at_base):
                continue
~~~~

NEW:

~~~~text
    changed, kept_names = _changed_destinations(repo_root, ref)
    for changed_path in changed:
        for candidate in _candidate_prefixes(changed_path):
            if candidate in base_paths or _is_tree_exempt(candidate, completed_at_base):
                continue
            # A pure move keeps a grandfathered basename, so only the directories it
            # moved into can introduce a new name.
            if candidate == changed_path and changed_path in kept_names:
                continue
~~~~
