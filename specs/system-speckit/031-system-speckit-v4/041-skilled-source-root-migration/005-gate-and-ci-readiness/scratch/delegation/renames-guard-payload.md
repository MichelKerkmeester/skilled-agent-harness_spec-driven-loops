# Edits for unit renames-guard

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py`

OLD:

~~~~text
    """Return added, copied, renamed, and untracked destinations since ``ref``.

    The second set holds the rename and copy destinations that keep their source
    basename: those moved an existing name rather than introducing one.
    """
    raw = _git(
~~~~

NEW:

~~~~text
    """Return added, copied, renamed, and untracked destinations since ``ref``.

    The second set holds the rename destinations that keep their source basename:
    those moved an existing name rather than introducing one. A copy leaves the
    original in place, so it adds a name and stays checked.
    """
    raw = _git(
~~~~

## Edit 2

File: `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py`

OLD:

~~~~text
            destination = _decode_path(fields[index])
            changed.add(destination)
            if destination.name == source.name:
                kept_names.add(destination)
            index += 1
~~~~

NEW:

~~~~text
            destination = _decode_path(fields[index])
            changed.add(destination)
            if status.startswith("R") and destination.name == source.name:
                kept_names.add(destination)
            index += 1
~~~~
