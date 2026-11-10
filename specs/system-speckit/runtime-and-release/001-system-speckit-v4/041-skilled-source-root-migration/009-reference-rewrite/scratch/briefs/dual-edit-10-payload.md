## Edit 1

File: `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py`

OLD:

~~~~text
    ".github/",
    ".opencode/",
    "opencode.json",
~~~~

NEW:

~~~~text
    ".github/",
    ".skilled/", ".opencode/",
    "opencode.json",
~~~~

## Edit 2

File: `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py`

OLD:

~~~~text
        return False
    if value.startswith(("./", "../", "/", "~/", ".opencode/", ".github/")):
        return True
~~~~

NEW:

~~~~text
        return False
    if value.startswith(("./", "../", "/", "~/", ".skilled/", ".opencode/", ".github/")):
        return True
~~~~
