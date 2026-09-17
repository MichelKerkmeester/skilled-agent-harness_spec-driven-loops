## Edit 1

File: `.skilled/commands/doctor/scripts/route-validate.py`

OLD:

~~~~text
# e.g. ".skilled/bin/skill-advisor.cjs" or ".skilled/commands/doctor/scripts/x.py"
SCRIPT_PATH_RE = re.compile(r"\.opencode/[^\s\"']+\.(?:cjs|mjs|js|py|sh)")

# Advisor CLI invocation shape for cli_commands entries: the repo-relative shim
~~~~

NEW:

~~~~text
# e.g. ".skilled/bin/skill-advisor.cjs" or ".skilled/commands/doctor/scripts/x.py"
SCRIPT_PATH_RE = re.compile(r"\.(?:skilled|opencode)/[^\s\"']+\.(?:cjs|mjs|js|py|sh)")

# Advisor CLI invocation shape for cli_commands entries: the repo-relative shim
~~~~

## Edit 2

File: `.skilled/commands/doctor/scripts/route-validate.py`

OLD:

~~~~text
        re.findall(
            r"^\|\s*`([a-z0-9-]+)`\s*\|\s*`\.opencode/commands/doctor/assets/",
            text,
~~~~

NEW:

~~~~text
        re.findall(
            r"^\|\s*`([a-z0-9-]+)`\s*\|\s*`\.(?:skilled|opencode)/commands/doctor/assets/",
            text,
~~~~
