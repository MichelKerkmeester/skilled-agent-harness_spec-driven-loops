## Edit 1

File: `.skilled/skills/sk-code/sk-code-review/SKILL.md`

OLD:

~~~~text
    files = " ".join((workspace_files or []) + (changed_files or [])).lower()

    if ".opencode/" in files or keyword_present("jsonc", text) or keyword_present("mcp", text):
        return "sk-code:code-opencode"
~~~~

NEW:

~~~~text
    files = " ".join((workspace_files or []) + (changed_files or [])).lower()

    if ".skilled/" in files or ".opencode/" in files or keyword_present("jsonc", text) or keyword_present("mcp", text):
        return "sk-code:code-opencode"
~~~~
