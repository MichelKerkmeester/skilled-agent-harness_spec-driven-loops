## Edit 1

File: `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py`

OLD:

~~~~text
PATH_PREFIX_HINTS = (
    "./", "../", ".opencode/", "specs/",
)
~~~~

NEW:

~~~~text
PATH_PREFIX_HINTS = (
    "./", "../", ".skilled/", ".opencode/", "specs/",
)
~~~~

## Edit 2

File: `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py`

OLD:

~~~~text
        return True
    if lower.startswith(".opencode/") or lower.startswith("specs/"):
        return True
    if token.startswith("/"):
        if lower.startswith("/.opencode/") or lower.startswith("/specs/"):
            return True
~~~~

NEW:

~~~~text
        return True
    if lower.startswith((".skilled/", ".opencode/")) or lower.startswith("specs/"):
        return True
    if token.startswith("/"):
        if lower.startswith(("/.skilled/", "/.opencode/")) or lower.startswith("/specs/"):
            return True
~~~~

## Edit 3

File: `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py`

OLD:

~~~~text
                    token.startswith("./")
                    or token.startswith("../")
                    or lower.startswith(".opencode/")
                    or lower.startswith("specs/")
                )
~~~~

NEW:

~~~~text
                    token.startswith("./")
                    or token.startswith("../")
                    or lower.startswith((".skilled/", ".opencode/"))
                    or lower.startswith("specs/")
                )
~~~~

## Edit 4

File: `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py`

OLD:

~~~~text
                    or token.startswith("../")
                    or lower.startswith(".opencode/")
                    or lower.startswith("specs/")
~~~~

NEW:

~~~~text
                    or token.startswith("../")
                    or lower.startswith((".skilled/", ".opencode/"))
                    or lower.startswith("specs/")
~~~~

## Edit 5

File: `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py`

OLD:

~~~~text
            or token.startswith("../")
            or lower.startswith(".opencode/")
            or lower.startswith("specs/")
~~~~

NEW:

~~~~text
            or token.startswith("../")
            or lower.startswith((".skilled/", ".opencode/"))
            or lower.startswith("specs/")
~~~~
