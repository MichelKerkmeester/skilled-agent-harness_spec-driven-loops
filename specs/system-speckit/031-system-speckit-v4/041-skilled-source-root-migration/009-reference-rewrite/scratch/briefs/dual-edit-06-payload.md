## Edit 1

File: `.skilled/skills/sk-doc/shared/scripts/reference_checker_extractors.py`

OLD:

~~~~text
LITERAL_PATH_PATTERN = re.compile(
    r"(?<![\w./-])((?:\.opencode|\.claude|\.codex|\.github)/[\w.-]+(?:/[\w.-]+)*)(?![\w/-])"
)
~~~~

NEW:

~~~~text
LITERAL_PATH_PATTERN = re.compile(
    r"(?<![\w./-])((?:\.skilled|\.opencode|\.claude|\.codex|\.github)/[\w.-]+(?:/[\w.-]+)*)(?![\w/-])"
)
~~~~
