## Edit 1

File: `.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`

OLD:

~~~~text
)


def find_opencode_root(script_path: Path) -> Optional[Path]:
    """Find the enclosing .opencode directory for this script."""
    for parent in script_path.parents:
        if parent.name == '.opencode':
            return parent
~~~~

NEW:

~~~~text
)


# The source tree sits under .skilled or .opencode, and a checkout may link one name
# to the other. The script path arrives resolved, so it names the real directory.
SOURCE_ROOT_NAMES = ('.skilled', '.opencode')


def find_opencode_root(script_path: Path) -> Optional[Path]:
    """Find the enclosing source-root directory for this script."""
    for parent in script_path.parents:
        if parent.name in SOURCE_ROOT_NAMES:
            return parent
~~~~
