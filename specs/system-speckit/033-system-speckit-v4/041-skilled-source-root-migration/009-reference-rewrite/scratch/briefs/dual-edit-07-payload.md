## Edit 1

File: `.skilled/skills/sk-doc/shared/scripts/validate_document.py`

OLD:

~~~~text
    is_claude = '/.claude/agents/' in f'/{path_str}' or path_str.startswith('.claude/agents/')
    is_opencode = '/.opencode/agents/' in f'/{path_str}' or path_str.startswith('.skilled/agents/')

    if not is_claude and not is_opencode:
~~~~

NEW:

~~~~text
    is_claude = '/.claude/agents/' in f'/{path_str}' or path_str.startswith('.claude/agents/')
    is_opencode = any(f'/{root}/agents/' in f'/{path_str}' for root in ('.skilled', '.opencode'))

    if not is_claude and not is_opencode:
~~~~
