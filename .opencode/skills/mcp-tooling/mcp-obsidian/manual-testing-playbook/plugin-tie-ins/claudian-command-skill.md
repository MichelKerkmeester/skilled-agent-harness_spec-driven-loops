---
title: "OBS-025 -- claudian-command-skill"
description: "This scenario validates the Claudian file-layer contract by authoring a vault-level Claude Code slash command and a reusable skill inside a throwaway .claude/ tree, then verifying headlessly that the command filename maps to its command name with valid optional frontmatter, the skill's SKILL.md name equals its folder and satisfies the length and casing rules, its description and body are non-empty, and no legacy .claude/mcp.json was authored."
stage: routing
version: "0.1.0.0"
---

# OBS-025 -- claudian-command-skill

## 1. OVERVIEW

This scenario validates that the mode can operate Claudian at the file layer: inside a throwaway vault-level `.claude/` tree it authors one slash command (`.claude/commands/summarize.md`) and one reusable skill (`.claude/skills/vault-triage/SKILL.md`), then verifies the Claude Code artifact contract headlessly with python3, rg and git — the command filename maps to its command name, the skill `name` equals its folder and satisfies the 64-character lowercase-hyphen rule, the `description` and body are non-empty, and the legacy `.claude/mcp.json` Claudian removes at init is not present. Running the agent, invoking the command, and rendering diffs or a plan are in-app steps observable only after the operator launches a provider CLI.

### Why This Matters

Claudian owns no proprietary storage — it launches an already-installed provider CLI with the vault as the working directory and reads ordinary provider-native config: commands, skills and MCP declarations on disk. A slash command is discovered by its filename, so a name that does not survive the plugin's `[a-zA-Z0-9_/-]` sanitizer silently maps to a different command; a `SKILL.md` whose `name` does not equal its folder, exceeds 64 characters, or carries an empty `description` is rejected by the plugin's own validation. If the mode can author these files correctly and prove the contract from the files — while never authoring the `.claude/mcp.json` Claudian deletes at init — then Claudian's in-vault command and skill surface is fully delegable to the vault files.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-025
- Feature Name: Claudian in-vault command and skill authoring round-trip
- Scenario Objective: Author one vault-level slash command and one reusable skill in a throwaway `.claude/` tree, then verify the command filename maps to its command name with valid optional frontmatter, the skill `name` equals its folder and satisfies the length/casing rules, the `description` and body are non-empty, and no `.claude/mcp.json` was authored.
- Exact Prompt: Add a Claudian summarize slash command and a vault-triage skill to this vault's .claude config so I can invoke them from the chat pane.
- Exact Command Sequence: 1. Create the throwaway vault and `.claude/` tree 2. Write `.claude/commands/summarize.md` with optional frontmatter 3. Write `.claude/skills/vault-triage/SKILL.md` with required `name`/`description` and a body 4. Validate the command filename-to-name mapping and any frontmatter with python3 5. Validate the SKILL.md contract (name equals folder, length, casing, non-empty description and body) with python3 6. Confirm no `.claude/mcp.json` exists with rg/test 7. Prove exactly the two intended files changed with git
- Expected Signals: `summarize.md` filename sanitizes to the command name `summarize`; any command frontmatter is valid YAML; `SKILL.md` frontmatter carries a non-empty `name` equal to its folder `vault-triage`, matching `^[a-z0-9]+(-[a-z0-9]+)*$` and at most 64 characters, and a non-empty `description` at most 1024 characters; the SKILL.md body is non-empty; `.claude/mcp.json` is absent; git status shows exactly two files.
- Evidence: Command and skill file text, python validation output, rg/test result for the absent `mcp.json`, git status output.
- Pass/Fail Criteria: PASS if the command maps to its name, the SKILL.md contract holds, and no `.claude/mcp.json` was authored; FAIL if the filename does not sanitize to the intended command name, the SKILL.md name mismatches its folder or violates the length/casing rule, the description or body is empty, or `.claude/mcp.json` was written; SKIP if python3 is unavailable.
- Failure Triage: 1. Re-derive the command name by applying the `[^a-zA-Z0-9_/-] -> -` sanitizer to the filename stem and compare to the intended name. 2. Confirm the skill folder name and the `name` frontmatter are identical and match the lowercase-hyphen rule. 3. Measure the `name` (<=64) and `description` (<=1024) lengths and confirm the body is non-empty. 4. Delete any `.claude/mcp.json` — Claudian removes it at init, so it must not be authored. 5. Fix the file and re-run the checks.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Run entirely inside `/tmp/_pbtest-claudian`. Real vaults (MEGA/Documents/Obsidian, iCloud, Barter) are never read or written, and no provider CLI is launched. The checks prove the file layer only; a PASS never claims the agent ran, a command was invoked, or a diff or plan rendered.

### Prompt

Add a Claudian summarize slash command and a vault-triage skill to this vault's .claude config so I can invoke them from the chat pane.

### Commands

1. Create the throwaway vault and `.claude/` tree.

   ~~~sh
   VAULT="/tmp/_pbtest-claudian"
   rm -rf "$VAULT"
   mkdir -p "$VAULT/.claude/commands" "$VAULT/.claude/skills/vault-triage"
   ~~~

2. Write the slash command (Claude Code scope: `.claude/commands/`). The filename stem is the command name; frontmatter is optional.

   ~~~sh
   cat > "$VAULT/.claude/commands/summarize.md" <<'EOF'
   ---
   argument-hint: "[note path]"
   allowed-tools: "Read"
   ---
   Summarize the note at $ARGUMENTS in five bullet points, then list open questions.
   EOF
   ~~~

3. Write the reusable skill (`.claude/skills/<name>/SKILL.md`). `name` must equal the folder.

   ~~~sh
   cat > "$VAULT/.claude/skills/vault-triage/SKILL.md" <<'EOF'
   ---
   name: vault-triage
   description: Triage inbox notes into projects and areas.
   ---
   # Vault triage
   Read every note in Inbox/, propose a destination folder for each, and wait for approval before moving anything.
   EOF
   ~~~

4. Validate the command filename-to-name mapping and any frontmatter.

   ~~~sh
   python3 - "$VAULT/.claude/commands/summarize.md" <<'EOF'
   import os, re, sys
   path = sys.argv[1]
   stem = os.path.splitext(os.path.basename(path))[0]
   safe = re.sub(r"[^a-zA-Z0-9_/-]", "-", stem)
   assert safe == stem, f"filename {stem!r} would sanitize to {safe!r}; command name would not match"
   text = open(path).read()
   if text.startswith("---"):
       parts = text.split("---", 2)
       assert len(parts) >= 3, "frontmatter opened but not closed"
       try:
           import yaml
           fm = yaml.safe_load(parts[1])
           assert fm is None or isinstance(fm, dict), "frontmatter is not a mapping"
       except ImportError:
           print("note: pyyaml unavailable, frontmatter shape not parsed")
   assert text.split("---", 2)[-1].strip(), "command body (prompt) is empty"
   print(f"command name resolves to /{stem}; body present")
   EOF
   ~~~

5. Validate the SKILL.md contract (name equals folder, length, casing, non-empty description and body).

   ~~~sh
   python3 - "$VAULT/.claude/skills/vault-triage/SKILL.md" <<'EOF'
   import os, re, sys
   path = sys.argv[1]
   folder = os.path.basename(os.path.dirname(path))
   text = open(path).read()
   assert text.startswith("---"), "SKILL.md has no frontmatter"
   parts = text.split("---", 2)
   assert len(parts) >= 3, "frontmatter opened but not closed"
   fm_raw, body = parts[1], parts[2]
   def field(key):
       m = re.search(rf"^{key}\s*:\s*(.+)$", fm_raw, re.M)
       return m.group(1).strip().strip('"').strip("'") if m else None
   name = field("name")
   desc = field("description")
   assert name, "name is required"
   assert name == folder, f"name {name!r} must equal folder {folder!r}"
   assert re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name), f"name {name!r} is not lowercase-hyphen"
   assert len(name) <= 64, "Skill name must be 64 characters or fewer"
   assert desc, "description is required"
   assert len(desc) <= 1024, "description exceeds 1024 characters"
   assert body.strip(), "SKILL.md body is empty"
   print(f"skill OK: name={name!r} equals folder, description present ({len(desc)} chars), body present")
   EOF
   ~~~

6. Confirm no legacy `.claude/mcp.json` was authored (Claudian removes it at init).

   ~~~sh
   if [ -e "$VAULT/.claude/mcp.json" ]; then echo "FAIL: .claude/mcp.json must not be authored"; else echo "OK: no .claude/mcp.json"; fi
   rg -l "mcp\.json" "$VAULT/.claude" || echo "OK: no reference to an authored mcp.json"
   ~~~

7. Prove exactly the two intended files changed and no stray files.

   ~~~sh
   cd "$VAULT"
   git init -q
   git add -A
   git status --porcelain
   git diff --cached --stat
   ~~~

8. Grade honestly. A PASS proves the command and skill files satisfy the Claude Code provider contract at the file layer — filename maps to command name, SKILL.md name/description/body valid, no forbidden `mcp.json`. Launching a provider, invoking the command and seeing a diff or plan need an in-app run, so the PASS states that limitation rather than claiming the agent executed anything.

### Grading

| Verdict | Criteria |
|---|---|
| PASS | `summarize.md` filename sanitizes to `/summarize`; command body present and any frontmatter valid; `SKILL.md` `name` equals folder `vault-triage`, is lowercase-hyphen and <=64 chars; `description` present and <=1024 chars; body non-empty; no `.claude/mcp.json`; git shows exactly the two files; real vaults untouched |
| FAIL | Filename does not sanitize to the intended command name, SKILL.md name mismatches its folder or breaks the length/casing rule, empty description or body, `.claude/mcp.json` authored, or a real vault file was touched |
| SKIP | python3 unavailable (git is optional for the two-file proof; pyyaml is optional for the command frontmatter shape) |

---

### Cleanup

Remove the throwaway vault. Nothing outside `/tmp/_pbtest-claudian` was created, so this one command restores the machine to its prior state.

~~~sh
rm -rf /tmp/_pbtest-claudian
~~~

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [../../references/plugins/claudian/claudian.md](../../references/plugins/claudian/claudian.md) | Claudian plugin identity and in-vault index |
| [../../references/plugins/claudian/data-model.md](../../references/plugins/claudian/data-model.md) | Where each artifact lives on disk: slash commands, reusable skills, provider config, and the MCP guardrail (no Claudian-authored `.claude/mcp.json`) |
| [../../references/plugins/claudian/workflows.md](../../references/plugins/claudian/workflows.md) | Numbered recipes: register a provider CLI, author a skill/command, connect an MCP server, plan mode and `@`-mentions |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../references/plugins/claudian/troubleshooting.md](../../references/plugins/claudian/troubleshooting.md) | CLI not found, desktop-only, provider auth, the three-name confusion note, and in-app-search discoverability |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI operation boundary |

---

## 5. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-025
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/claudian-command-skill.md
