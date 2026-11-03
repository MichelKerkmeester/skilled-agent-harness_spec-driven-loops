---
title: "DOC-367 -- Doctor skill-advisor target menu"
description: "Conversation scenario validating the missing-target menu and answer handling for `/doctor:skill-advisor`."
version: 1.0.0.0
---

# DOC-367 -- Doctor skill-advisor target menu

## 1. OVERVIEW

This scenario checks the `/doctor:skill-advisor` target-resolution gate on Claude Code. A missing target must show the six-target menu and wait for an explicit answer. It also checks unknown targets, cross-target flags and the route-manifest list.
OpenCode was tried on 2026-11-03 and dropped: OpenCode's command palette reports no matching command for /doctor:skill-advisor, so the command never sends; that gap is recorded for the runner-gaps phase.

### Why This Matters

The router must bind a target only after the operator chooses one. An invalid or missing answer must never start a workflow.

---

## 2. SCENARIO CONTRACT

Run the exact prompt and command sequence for DOC-367 on Claude Code and confirm each outcome and status.

- Objective: Prove the missing-target menu waits, maps supported answers to their documented results, rejects unknown targets and cross-target flags, renders the current route manifest, and starts a selected read-only target only after an explicit numeric answer.
- Real user request: `I have no doctor target selected. Show me the skill-advisor options and let me choose.`
- Prompt: `/doctor:skill-advisor`
- Expected execution process: Open the menu, cancel, reopen it and send `zz` twice, reopen it and request help, select 3, then check an unknown target, a flag owned by another target and the route-manifest list.
- Expected signals: The menu lists choices 1 through 6, H and X. X returns `STATUS=CANCEL`. The first `zz` re-emits the menu without a failure status; the second returns `STATUS=FAIL ERROR=unknown_selection`. H prints the symptom guide and repeats the menu. Answer 3 binds `skill-graph-freshness` and shows its read-only dashboard. An unknown target and a `tune --top-n=5` cross-target flag return their documented errors before loading a workflow. `list` prints all six current manifest targets with their workflow file names.
- Desired user-visible outcome: The operator sees the available targets and the selected target before its workflow runs.
- Pass/fail: PASS if the menu waits for an explicit answer, cancellation and invalid answers return their documented outcomes, H repeats the menu, 3 selects `skill-graph-freshness`, the two invalid invocations fail before workflow loading and `list` names all six manifest targets. FAIL if a workflow starts before a valid answer or an answer produces a different result.
- Classification: Manual scenario. Record PASS, FAIL or SKIP for Claude Code with a specific Claude Code or sandbox blocker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `/doctor:skill-advisor`

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code"
  ],
  "setup": [
    "find . -mindepth 1 -maxdepth 1 ! -name .conversation-scratch -exec rm -rf {} + && rm -f .conversation-scratch && git clone --no-hardlinks \"$CONVERSATION_REPO_ROOT\" .",
    "rm -rf .skilled && cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) if [ -d \"$CONVERSATION_REPO_ROOT/.claude\" ]; then rm -rf .claude && cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude; fi ;; opencode) if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode\" ]; then printf '%s\\n' 'OpenCode project config is unavailable'; exit 77; fi; rm -rf .opencode opencode.json && cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode ;; pi) if [ ! -d \"$CONVERSATION_REPO_ROOT/.pi\" ]; then printf '%s\\n' 'Pi project config is unavailable'; exit 77; fi; rm -rf .pi && cp -R \"$CONVERSATION_REPO_ROOT/.pi\" .pi ;; esac"
  ],
  "turns": [
    {
      "id": "menu",
      "send": "/doctor:skill-advisor",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'H) Help me decide' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'X) Cancel' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ /doctor:skill-advisor\") { after=1; menu=0; cancel=0; next } after && index($0, \"H) Help me decide\") { menu=1 } after && index($0, \"X) Cancel\") { cancel=1 } END { exit !(after && menu && cancel) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "[Aa]llow OpenCode to search the web",
          "optional": true,
          "answer": {
            "select": [
              "Reject"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "cancel",
      "send": "X",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'STATUS=CANCEL' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ X\") { after=1; cancelled=0; next } after && index($0, \"STATUS=CANCEL\") { cancelled=1 } END { exit !(after && cancelled) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "menu-before-invalid",
      "send": "/doctor:skill-advisor",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'H) Help me decide' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ /doctor:skill-advisor\") { after=1; menu=0; next } after && index($0, \"H) Help me decide\") { menu=1 } END { exit !(after && menu) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "first-invalid",
      "send": "zz",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'H) Help me decide' \"$CONVERSATION_TURN_DIR/screen.txt\" && ! grep -Fq 'STATUS=FAIL' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ zz\") { after=1; menu=0; failed=0; next } after && index($0, \"H) Help me decide\") { menu=1 } after && $0 ~ /^[[:space:]]*(⏺[[:space:]]+|●[[:space:]]+)?STATUS=FAIL([[:space:]]|$)/ { failed=1 } END { exit !(after && menu && !failed) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "second-invalid",
      "send": "zz",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'STATUS=FAIL' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'unknown_selection' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ zz\") { after=1; failed=0; unknown=0; next } after && $0 ~ /^[[:space:]]*(⏺[[:space:]]+|●[[:space:]]+)?STATUS=FAIL([[:space:]]|$)/ { failed=1; if (index($0, \"unknown_selection\")) unknown=1 } END { exit !(after && failed && unknown) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "menu-before-help",
      "send": "/doctor:skill-advisor",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'H) Help me decide' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ /doctor:skill-advisor\") { after=1; menu=0; next } after && index($0, \"H) Help me decide\") { menu=1 } END { exit !(after && menu) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "help",
      "send": "H",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'Pick by symptom:' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'Press 1-6, H, or X.' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'H) Help me decide' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ H\") { after=1; symptom=0; prompt=0; menu=0; next } after && index($0, \"Pick by symptom:\") { symptom=1 } after && index($0, \"Press 1-6, H, or X.\") { prompt=1 } after && index($0, \"H) Help me decide\") { menu=1 } END { exit !(after && symptom && prompt && menu) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "numeric-target",
      "send": "3",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then conversation_project=\"$(pwd -P)\" && conversation_messages=\"$(sqlite3 -readonly \"$HOME/.local/share/opencode/opencode.db\" \"SELECT session_message.data FROM session_v2 JOIN session_message ON session_message.session_id = session_v2.id WHERE session_v2.directory = '$conversation_project';\")\" && printf '%s\\n' \"$conversation_messages\" | grep -Fq 'Target: skill-graph-freshness' && printf '%s\\n' \"$conversation_messages\" | grep -Fq 'Mutation class: read-only'; else awk 'index($0, \"❯ 3\") { after=1; target=0; mutation=0; next } after && index($0, \"Target: skill-graph-freshness\") { target=1 } after && index($0, \"Mutation class: read-only\") { mutation=1 } END { exit !(after && target && mutation) }' \"$CONVERSATION_TURN_DIR/history.txt\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "unknown-target",
      "send": "/doctor:skill-advisor unknown-target",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'Unknown target: unknown-target' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'unknown_target' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ /doctor:skill-advisor unknown-target\") { after=1; target=0; status=0; next } after && index($0, \"Unknown target: unknown-target\") { target=1 } after && index($0, \"ERROR=\\\"unknown_target\\\"\") { status=1 } END { exit !(after && target && status) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "cross-target-flag",
      "send": "/doctor:skill-advisor tune --top-n=5",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fiq 'not valid for target' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'cross_target_flag_injection' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ /doctor:skill-advisor tune --top-n=5\") { after=1; flag=0; status=0; next } after && index($0, \"not valid for target\") { flag=1 } after && index($0, \"cross_target_flag_injection\") { status=1 } END { exit !(after && flag && status) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    },
    {
      "id": "list-manifest",
      "send": "/doctor:skill-advisor list",
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"opencode\" ]; then grep -Fq 'doctor-skill-advisor-tune.yaml' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'doctor-skill-advisor-rebuild.yaml' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'doctor-skill-graph-freshness.yaml' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'doctor-router-reach.yaml' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'doctor-skill-budget.yaml' \"$CONVERSATION_TURN_DIR/screen.txt\" && grep -Fq 'doctor-parent-skill.yaml' \"$CONVERSATION_TURN_DIR/screen.txt\"; else case \"$CONVERSATION_RUNTIME\" in pi) conversation_frame=\"$CONVERSATION_TURN_DIR/history.txt\" ;; *) conversation_frame=\"$CONVERSATION_TURN_DIR/screen.txt\" ;; esac; awk 'index($0, \"❯ /doctor:skill-advisor list\") { after=1; tune=0; rebuild=0; freshness=0; reach=0; budget=0; parent=0; next } after && index($0, \"doctor-skill-advisor-tune.yaml\") { tune=1 } after && index($0, \"doctor-skill-advisor-rebuild.yaml\") { rebuild=1 } after && index($0, \"doctor-skill-graph-freshness.yaml\") { freshness=1 } after && index($0, \"doctor-router-reach.yaml\") { reach=1 } after && index($0, \"doctor-skill-budget.yaml\") { budget=1 } after && index($0, \"doctor-parent-skill.yaml\") { parent=1 } END { exit !(after && tune && rebuild && freshness && reach && budget && parent) }' \"$conversation_frame\"; fi",
      "questions": [
        {
          "match": "[Ss]elect",
          "optional": true,
          "answer": {
            "select": [
              "select"
            ]
          }
        },
        {
          "match": "([Ss]pec folder|[Ss]pecification folder|[Gg]ate 3|[Ww]hich .*folder|[Dd]ocumentation)",
          "optional": true,
          "answer": {
            "reply": "D"
          }
        }
      ]
    }
  ]
}
```

- The first `send` matches the Prompt line.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md --runtime claude-code --scratch <fresh-scratch-outside-repository> --out <evidence-directory>`

### Expected

Claude Code checks anchor on the current echoed send in `screen.txt`, except numeric-target, which reads full `history.txt` because the dashboard can push the target line out of the visible frame. The manifest check matches workflow file names rather than backticked target words.

### Evidence

- Claude Code menu, help, error and manifest text from each turn's `screen.txt`, with numeric-target output from `history.txt`.
- The per-turn `check.txt` files and `checkpoints.tsv` row statuses.

### Pass / Fail

- **Pass**: Claude Code passes all turn checks, and the numeric answer selects `skill-graph-freshness`.
- **Fail**: Claude Code ignores a menu answer, starts a workflow before a valid answer or returns a status or target that disagrees with the expected result.

### Failure Triage

If the menu or help text differs, inspect the target-resolution section in `doctor-skill-advisor-presentation.txt`. If a status or target differs, inspect the input gate in `skill-advisor.md`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/skill-advisor.md](../../commands/doctor/skill-advisor.md)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt](../../commands/doctor/assets/doctor-skill-advisor-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:skill-advisor

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-367
- Feature name: Doctor skill-advisor target menu
- Command mode: `/doctor:skill-advisor`
- Mutation boundary: The selected diagnostic is read-only. Menu answers do not write repository state.
- Feature file path: `doctor-commands/doctor-skill-advisor-target-menu.md`
