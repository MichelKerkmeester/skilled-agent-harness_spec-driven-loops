## Edit 1

File: `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py`

OLD:

~~~~text
MD_PATH_TOKEN_RE = re.compile(r'(?<![\w])(?:[A-Za-z0-9_.-]+/)*[A-Za-z0-9_.-]+\.md\b')
REPO_PATH_TOKEN_RE = re.compile(r'(?<![\w])(?:\.opencode|\.claude|\.codex)/[A-Za-z0-9_./-]+')
WORKFLOW_MODE_INVENTORY_RE = re.compile(
~~~~

NEW:

~~~~text
MD_PATH_TOKEN_RE = re.compile(r'(?<![\w])(?:[A-Za-z0-9_.-]+/)*[A-Za-z0-9_.-]+\.md\b')
REPO_PATH_TOKEN_RE = re.compile(r'(?<![\w])(?:\.skilled|\.opencode|\.claude|\.codex)/[A-Za-z0-9_./-]+')
WORKFLOW_MODE_INVENTORY_RE = re.compile(
~~~~

## Edit 2

File: `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py`

OLD:

~~~~text
# left unchecked instead of risking a false positive this script cannot substantiate.
REPO_RELATIVE_PREFIXES = ('.opencode/', '.claude/', '.codex/')

# A trailing `:123` or `:123-145` line-range locator (a real, documented citation style
~~~~

NEW:

~~~~text
# left unchecked instead of risking a false positive this script cannot substantiate.
REPO_RELATIVE_PREFIXES = ('.skilled/', '.opencode/', '.claude/', '.codex/')

# A trailing `:123` or `:123-145` line-range locator (a real, documented citation style
~~~~
