ROLE: You restructure the section headings of one Markdown file. You move existing text; you do not rewrite it.

CONTEXT: Work from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration.
File: .skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/manual-testing-playbook.md
Its H2 sections are now `## 1. HOW TO RUN`, `## 2. EVIDENCE RULES`, `## 3. SCENARIO INDEX`, `## 4. RUN RECORD`, `## 5. FAILURE TRIAGE`. The playbook validator requires `OVERVIEW`, `GLOBAL PRECONDITIONS`, `GLOBAL EVIDENCE REQUIREMENTS` and `DETERMINISTIC COMMAND NOTATION`.

ACTION:
1. Read the file in full.
2. Change the heading `## 1. HOW TO RUN` to `## 1. OVERVIEW`.
3. Cut the fenced code block that starts with the line ```` ```bash ```` directly under that heading (three lines: the opening fence, the `command -v jev && jev --version` line, the closing fence). Section 1 then starts with the paragraph `Each scenario is its own file ...` and keeps the `Categories:` list.
4. Directly after section 1's `---` divider, insert a new section: the heading `## 2. GLOBAL PRECONDITIONS`, a blank line, the three-line code block you cut in step 3 byte for byte, a blank line, `---`, a blank line.
5. Change the heading `## 2. EVIDENCE RULES` to `## 3. GLOBAL EVIDENCE REQUIREMENTS`. Keep its body unchanged.
6. Directly after that section's `---` divider, insert this text exactly, then a blank line, `---`, a blank line:

```
## 4. DETERMINISTIC COMMAND NOTATION

Each scenario file gives its commands in a fenced `bash` block under `### Commands`. Run that block
exactly as written, from the repository root, with the provider variables the scenario names cleared
or set as it says.
```

7. Renumber the last three headings: `## 3. SCENARIO INDEX` to `## 5. SCENARIO INDEX`, `## 4. RUN RECORD` to `## 6. RUN RECORD`, `## 5. FAILURE TRIAGE` to `## 7. FAILURE TRIAGE`.
8. Run and print the result line and exit status of each:
   `python3 .skilled/skills/sk-doc/scripts/validate_document.py <File>`
   `python3 .skilled/skills/sk-doc/scripts/validate_document.py <File> --type playbook`
   `grep -c '^| \[JEV-' <File>`

FORMAT: Reply with the step 8 output, then `DONE` or `BLOCKED: <reason>`.

Rules: Edit only this one file. Change no other line: every scenario row, every command, every blockquote and every word about privacy, credentials or gates stays exactly as written. No git commands that write (add, commit, stash, checkout, restore, reset, mv, rm). No installs. Never open a .env file.
