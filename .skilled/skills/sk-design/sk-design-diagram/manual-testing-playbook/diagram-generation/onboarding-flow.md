---
title: "DIA-003 -- Onboarding flow"
description: "This scenario validates the style-guide gate and onboarding approval behavior in Claude Code for `DIA-003`. It focuses on preserving the shipped guide after a decline and applying only approved token changes."
stage: routing
version: 1.0.4.0
---

# DIA-003 -- Onboarding flow

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `DIA-003`.

---

## 1. OVERVIEW

This scenario validates the style-guide gate and URL onboarding approval flow for `DIA-003` in Claude Code. It checks that a decline leaves the shipped guide untouched and that later approval changes only the semantic roles token table.

OpenCode and Pi were tried on 2026-11-03 and dropped: OpenCode edited style-guide.md outside the semantic-roles token table after approval, and Pi asks for the URL inside a tabbed multi-question dialog with dark-mode questions this script does not answer.

### Why This Matters

The style-guide gate protects a project's visual identity before the first diagram. Onboarding proposes extracted tokens, so a decline must leave the existing guide intact and approval must not rewrite unrelated guidance.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DIA-003` in Claude Code and confirm the expected signals without contradictory evidence.

- Objective: verify that the default-skin gate runs, URL onboarding proposes mapped tokens, a decline leaves `style-guide.md` unchanged and explicit approval changes only the semantic roles token table
- Real user request: `Onboard the diagram skill to my site.`
- Prompt: `This is the first diagram in this project. The style guide is still at the shipped default accent. Please onboard the project from my site and map its palette and fonts to the semantic roles in .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md.`
- Expected execution process: setup copies the `.claude` project configuration for Claude Code. The agent detects the shipped default accent and asks whether to customize the guide. A website-source dialog is answered with its website-URL option, and a plain-chat URL request receives `https://example.com`. If Claude Code proposes an inferred source in a confirmation dialog, the script selects `Different site` and supplies the fixture URL when asked. The agent extracts colors and fonts from the supplied URL, maps them to semantic roles with confidence values, checks AA contrast and previews the token-table diff. It asks for approval before writing. After the scripted decline, the scratch guide remains byte-identical to its baseline. After the explicit approval, only the semantic roles token table changes.
- Expected signals: the gate question appears before any diagram; the supplied URL is collected rather than silently inferred; a role-mapping table shows confidence values; the proposal is limited to the semantic roles token table; the decline leaves `style-guide.md` unchanged; approval changes only that table.
- Desired user-visible outcome: an auditable token proposal, no file change after decline and a final guide containing only the approved token-table changes.
- Pass/fail: PASS if the gate runs, the scripted URL is used, the proposal appears, the declined turn leaves the guide unchanged and the approved turn changes only the semantic roles token table; FAIL if the gate or URL request is skipped, an inferred source is used without confirmation, the guide changes before approval or any content outside that table changes. Claude Code's check reads proposal text from full scrollback and compares the declined guide with its baseline.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This is the first diagram in this project. The style guide is still at the shipped default accent. Please onboard the project from my site and map its palette and fonts to the semantic roles in .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md.`

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code"
  ],
  "setup": [
    "git init",
    "printf '# Diagram onboarding scratch project\\n' > README.md",
    "if [ -z \"$CONVERSATION_REPO_ROOT\" ]; then printf '%s\\n' 'CONVERSATION_REPO_ROOT is required'; exit 1; fi",
    "rm -rf .skilled",
    "if [ ! -d \"$CONVERSATION_REPO_ROOT/.skilled\" ]; then printf '%s\\n' 'skill installation unavailable'; exit 77; fi",
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "for name in .claude .opencode opencode.json .pi; do rm -rf \"$name\"; done",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) if [ ! -d \"$CONVERSATION_REPO_ROOT/.claude\" ]; then printf '%s\\n' 'Claude project configuration unavailable'; exit 77; fi; cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude ;; opencode) if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode\" ]; then printf '%s\\n' 'OpenCode project configuration unavailable'; exit 77; fi; cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json; cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode ;; pi) if [ ! -d \"$CONVERSATION_REPO_ROOT/.pi\" ]; then printf '%s\\n' 'Pi project configuration unavailable'; exit 77; fi; cp -R \"$CONVERSATION_REPO_ROOT/.pi\" .pi ;; *) printf 'Unsupported conversation runtime: %s\\n' \"$CONVERSATION_RUNTIME\"; exit 1 ;; esac",
    "mkdir -p .scenario-baseline",
    "if [ ! -f .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md ]; then printf '%s\\n' 'installed style-guide fixture unavailable'; exit 77; fi",
    "cp .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md .scenario-baseline/style-guide.md",
    "if ! command -v curl >/dev/null 2>&1; then printf '%s\\n' 'network precondition unavailable: curl is missing'; exit 77; fi",
    "if ! curl -fsS --max-time 10 https://example.com -o /dev/null; then printf '%s\\n' 'network precondition unavailable: example.com is unreachable'; exit 77; fi"
  ],
  "turns": [
    {
      "id": "decline-proposal",
      "send": "This is the first diagram in this project. The style guide is still at the shipped default accent. Please onboard the project from my site and map its palette and fonts to the semantic roles in .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md.",
      "questions": [
        {
          "match": "Allow OpenCode to search the web",
          "answer": {
            "select": [
              "No"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ii]s .* (?:right|correct) source",
          "answer": {
            "select": [
              "Different site"
            ]
          },
          "optional": true
        },
        {
          "match": "[Pp]ull from your [Ww]ebsite [Uu][Rr][Ll]",
          "answer": {
            "select": [
              "Pull from your website URL"
            ]
          },
          "optional": true
        },
        {
          "match": "(?:[Ww]hat|[Ww]hich|[Gg]ive|[Pp]rovide|[Tt]ell me).*?(?:[Uu][Rr][Ll]|[Ww]ebsite|[Ss]ite|[Ss]ource)",
          "answer": {
            "other": "Please use https://example.com as the source site."
          },
          "optional": true
        },
        {
          "match": "([Aa]pprov|[Aa]pply|[Ww]rite|[Ss]ave)[^?]{0,100}([Pp]roposal|[Tt]oken|[Ss]tyle[ -]guide|[Dd]iff)[^?]*[?]|([Pp]roposal|[Tt]oken[ -]table|[Dd]iff)[^?]{0,100}([Aa]pprov|[Aa]pply|[Ww]rite|[Ss]ave)[^?]*[?]",
          "answer": {
            "select": [
              "No"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ll]ight or dark|[Dd]ark or light|primary mode",
          "answer": {
            "other": "Light"
          },
          "optional": true
        },
        {
          "match": "(?:[Ww]hat|[Ww]hich|[Gg]ive|[Pp]rovide|[Tt]ell me).*?(?:[Uu][Rr][Ll]|[Ww]ebsite|[Ss]ite|[Ss]ource)",
          "answer": {
            "reply": "Yes. Please use https://example.com as the source site."
          },
          "optional": true
        },
        {
          "match": "[Uu]nable to (fetch|access|browse)|[Cc]annot (reach|access|browse|fetch)|[Cc]an't (reach|access|browse|fetch)|[Nn]etwork (unavailable|error)|[Ww]eb (fetch|access|browse)",
          "answer": {
            "reply": "I cannot provide a different source. Please report that the site could not be read."
          },
          "optional": true
        },
        {
          "match": "([Aa]pprov|[Aa]pply|[Ww]rite|[Ss]ave)[^?]{0,100}([Pp]roposal|[Tt]oken|[Ss]tyle[ -]guide|[Dd]iff)[^?]*[?]|([Pp]roposal|[Tt]oken[ -]table|[Dd]iff)[^?]{0,100}([Aa]pprov|[Aa]pply|[Ww]rite|[Ss]ave)[^?]*[?]",
          "answer": {
            "reply": "No. I decline this proposal. Do not write any changes to .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md."
          },
          "optional": true
        },
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation (scope|folder|path)|[Ss]cope.*documentation",
          "answer": {
            "reply": "D"
          },
          "optional": true
        },
        {
          "match": "[Ll]ight or dark|[Dd]ark or light|primary mode",
          "answer": {
            "reply": "Light is the primary mode."
          },
          "optional": true
        }
      ],
      "check": "case \"$CONVERSATION_RUNTIME\" in claude-code|pi) after_send=$(awk '!after && index($0, \"references/foundations/style-guide.md.\") { after=1; seen=1; next } after { print } END { if (!seen) exit 2 }' \"$CONVERSATION_TURN_DIR/history.txt\") || { echo 'send echo missing from history.txt'; exit 1; }; printf '%s\\n' \"$after_send\" | grep -Fq '#eb6c36' && printf '%s\\n' \"$after_send\" | grep -Eiq 'paper.*(high|medium|low)' && printf '%s\\n' \"$after_send\" | grep -Eiq 'ink.*(high|medium|low)' && printf '%s\\n' \"$after_send\" | grep -Eiq 'accent.*(high|medium|low)' && printf '%s\\n' \"$after_send\" | grep -Eiq 'contrast|diff|preview' && printf '%s\\n' \"$after_send\" | grep -Fq 'Yes. Please use https://example.com as the source site.' && printf '%s\\n' \"$after_send\" | grep -Fq 'I decline this proposal.' ;; opencode) : ;; *) printf 'Unsupported conversation runtime: %s\\n' \"$CONVERSATION_RUNTIME\"; exit 1 ;; esac && cmp -s .scenario-baseline/style-guide.md .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md && echo 'proposal declined; installed style-guide.md unchanged'"
    },
    {
      "id": "approve-proposal",
      "send": "I approve the recommended token changes. Please apply them to the style guide.",
      "questions": [
        {
          "match": "[Pp]roposal.*(missing|unavailable)|[Nn]o proposal|[Ww]ebsite.*(access|fetch|browse)|[Nn]etwork.*(unavailable|error)|[Cc]annot apply|[Cc]an't (access|browse|fetch)",
          "answer": {
            "select": [
              "No"
            ]
          },
          "optional": true
        },
        {
          "match": "([Aa]pply|[Ww]rite|[Ss]ave)[^?]{0,100}([Tt]oken|[Ss]tyle[ -]guide|[Dd]iff)[^?]*[?]|([Tt]oken|[Ss]tyle[ -]guide|[Dd]iff)[^?]{0,100}([Aa]pply|[Ww]rite|[Ss]ave)[^?]*[?]",
          "answer": {
            "select": [
              "Yes"
            ]
          },
          "optional": true
        },
        {
          "match": "[Pp]roposal.*(missing|unavailable)|[Nn]o proposal|[Ww]ebsite.*(access|fetch|browse)|[Nn]etwork.*(unavailable|error)|[Cc]annot apply|[Cc]an't (access|browse|fetch)",
          "answer": {
            "reply": "There is no site-derived proposal. Leave the style guide unchanged."
          },
          "optional": true
        },
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation (scope|folder|path)|[Ss]cope.*documentation",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "awk 'FNR == 1 { file_no++; in_roles = 0; in_table = 0 } { line = $0; if (line == \"#### Semantic roles\") in_roles = 1; if (in_roles && line == \"| Role | Purpose | Default (light) | Default (dark) |\") { header[file_no] = 1; in_table = 1; in_roles = 0; norm[file_no] = norm[file_no] line \"\\n\"; next } if (in_table && line ~ /^\\|/) { if (line ~ /^\\|[[:space:]]*[-:]+[[:space:]|:-]*$/) norm[file_no] = norm[file_no] line \"\\n\"; else rows[file_no]++; next } if (in_table) { closed[file_no] = 1; in_table = 0 } norm[file_no] = norm[file_no] line \"\\n\" } END { if (file_no != 2 || !header[1] || !header[2] || !closed[1] || !closed[2] || rows[1] == 0 || rows[2] == 0 || norm[1] != norm[2]) exit 1; print \"outside semantic roles token table unchanged\" }' .scenario-baseline/style-guide.md .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md && ! cmp -s .scenario-baseline/style-guide.md .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md && echo 'only semantic roles token table changed'"
    }
  ]
}
```

- The first `send` matches the scenario contract prompt exactly.
- Setup runs once for Claude Code and copies its `.claude` project configuration to the scratch project.
- Plain-chat questions are answered with reply, including the URL and optional Gate 3 answer D. Source, decline and approval dialogs use select. Each question pattern identifies the question and does not match either scripted send.
- The Claude Code check searches `history.txt` after the echoed send, and `history.txt` retains full scrollback.
- Setup exits 77 with a one-line reason when the skill installation, Claude Code project configuration (`.claude`), style-guide fixture or network connection is missing. The checks otherwise read the installed scratch guide and captured turn evidence without writing to the repository.

### Commands

1. `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md --runtime claude-code --scratch /tmp/conv-dia003 --out /tmp/conv-dia003-out`

The scratch project and evidence directory are outside the repository.

### Expected

The Claude Code run shows the gate question because the installed scratch style guide still has the shipped default accent. It requests or confirms the source URL, then maps colors and fonts to semantic roles, shows confidence values and contrast checks and previews a diff limited to the semantic roles token table. The check reads the proposal from full turn scrollback and compares the scratch guide with its baseline after the declined answer. After explicit approval, the check confirms that content outside the token table is unchanged and that the guide did change.

### Evidence

Capture Claude Code's `setup.log`, the gate, source and approval questions, the selected or supplied URL, the role-mapping table and confidence values, the diff preview, the decline and approval responses, each turn's `question-N.txt` and `check.txt`, and the runner's `result.json` and `checkpoints.tsv`. Keep `screen.txt` and `history.txt` for Claude Code. The first check reads full `history.txt` after the echoed send. The approval check reads the baseline and installed scratch `style-guide.md` files for Claude Code.

### Pass / Fail

- **Pass**: the gate runs, the supplied URL is used, the token proposal appears, the decline leaves `style-guide.md` unchanged and explicit approval changes only the semantic roles token table. Claude Code's check confirms the proposal from full scrollback and compares the declined guide with its baseline.
- **Fail**: the gate or URL request is skipped, an inferred source is used without confirmation, the guide changes before approval, the proposal omits the mapping or contrast checks, or the approved change touches content outside the token table.

- **Skip**: setup reports a missing skill installation, the Claude Code project configuration (`.claude`), the style-guide fixture or network connection. It exits 77 with a one-line reason before the Claude Code session starts.

### Failure Triage

1. If Claude Code is SKIP, use setup's one-line blocker and make the skill installation, Claude Code project configuration, style-guide fixture or network access available before rerunning.
2. Confirm the scratch guide's light `accent` value is still the shipped default `#eb6c36`.
3. If extraction produces no mapping, inspect the captured Claude Code output for a URL-fetch or readability failure, then record the specific cause.
4. If Claude Code processes an inferred site without asking for or confirming the URL, keep the turn failed and report a skill bug against the source-request contract in `SKILL.md` and `references/foundations/onboarding.md`.
5. If a question is unmatched, capture its exact wording and add an optional answer for Claude Code whose pattern does not match either send.
6. If the declined turn changes the guide, compare it with the setup baseline copy and record the failed turn evidence.
7. If approval changes content outside the token table, compare the scratch guide with its setup baseline and record the extra changes as a failure.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [`../../feature-catalog/diagram-generation/onboarding-flow.md`](../../feature-catalog/diagram-generation/onboarding-flow.md) | Feature-catalog source describing the onboarding contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Style-guide gate before the first diagram |
| `../../references/foundations/onboarding.md` | URL extraction, role mapping, contrast checks and approval workflow |
| `../../references/foundations/style-guide.md` | Default tokens and the semantic roles token table |

---

## 5. SOURCE METADATA

- Group: DIAGRAM GENERATION
- Playbook ID: DIA-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `diagram-generation/onboarding-flow.md`
