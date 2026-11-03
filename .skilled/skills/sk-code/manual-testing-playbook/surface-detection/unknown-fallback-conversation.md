---
title: "SD-004 -- UNKNOWN Fallback After Clarification"
description: "This scenario validates Claude Code's answer-dependent resource loading for an unsupported Go request and its verification guidance after clarification."
version: 1.0.0.0
---

# SD-004 -- UNKNOWN Fallback After Clarification

This document captures the conversation contract, execution flow, source anchors and metadata for SD-004.

---

## 1. OVERVIEW

This scenario validates Claude Code's UNKNOWN fallback after the user answers runtime and verification questions for an unsupported Go request.

### Why This Matters

The existing Claude Code UNKNOWN fallback scenario stops when sk-code asks for clarification. This companion checks that the user's verification answer adds shared verification guidance while the unsupported Go surface stays UNKNOWN.

OpenCode and Pi were tried on 2026-11-03 and dropped: OpenCode asked no clarifying question for the unknown Go surface, and Pi asks its questions in a tabbed four-question dialog (surface, intent, verification, ID policy) this script does not answer.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for SD-004 on Claude Code, then confirm the expected signals without contradictory evidence.

- Objective: Confirm the Go answer remains on the UNKNOWN surface and the verification answer loads shared verification guidance.
- Real user request: Add a request-ID middleware to my Go HTTP server in cmd/api/main.go and return it in the X-Request-ID response header.
- Prompt: Use sk-code to add a request-ID middleware to my Go HTTP server in cmd/api/main.go and return it in the X-Request-ID response header.
- Expected execution process: The runner copies .skilled/ and Claude Code's project configuration into the scratch project. Claude Code keeps its existing empty-target setup, receives the Go request, answers the runtime and verification questions, then explains what the answers mean without editing files or running commands.
- Expected signals: The response identifies the surface as UNKNOWN and the intent as VERIFICATION. Claude Code's session transcript under ~/.claude/projects/<encoded scratch cwd>/ records Read tool_use entries for ROUTER.md, shared/references/stack-detection.md, shared/references/phase-detection.md, shared/references/universal/code-quality-standards.md and shared/references/workflow-verify.md. The transcript shows no read under sk-code-skilled/.
- Desired user-visible outcome: Claude Code's response explains that the Go target is outside the supported surface and identifies the shared verification guidance selected for the supplied commands.
- Pass/fail: PASS if both required clarification questions are captured, Claude Code's transcript contains the expected resource evidence without a sk-code-skilled/ read, the response after the second send identifies UNKNOWN and VERIFICATION, and cmd/api/main.go remains absent. FAIL if a required question is skipped, an expected resource is missing, a sk-code-skilled/ resource is read, the route is incorrect or the target is edited.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: Use sk-code to add a request-ID middleware to my Go HTTP server in cmd/api/main.go and return it in the X-Request-ID response header.

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code"
  ],
  "setup": [
    "if [ ! -d \"$CONVERSATION_REPO_ROOT/.skilled\" ]; then printf '%s\\n' 'repository skills are missing'; exit 77; fi",
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) ;; opencode|pi) mkdir -p cmd/api && printf '%s\\n' 'module example.com/request-id-fixture' '' 'go 1.24' > go.mod && printf '%s\\n' 'package main' '' 'import \"net/http\"' '' 'func main() {' '    http.HandleFunc(\"/healthz\", func(w http.ResponseWriter, _ *http.Request) {' '        w.WriteHeader(http.StatusNoContent)' '    })' '    _ = http.ListenAndServe(\":8080\", nil)' '}' > cmd/api/main.go && shasum -a 256 go.mod cmd/api/main.go > .go-fixture-before.sha256 ;; *) printf '%s\\n' 'Unsupported conversation runtime'; exit 77 ;; esac",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) if [ ! -d \"$CONVERSATION_REPO_ROOT/.claude\" ]; then printf '%s\\n' 'Claude Code project configuration is missing'; exit 77; fi; cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude ;; opencode) if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode\" ]; then printf '%s\\n' 'OpenCode project configuration is missing'; exit 77; fi; cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode ;; pi) if [ ! -d \"$CONVERSATION_REPO_ROOT/.pi\" ]; then printf '%s\\n' 'Pi project configuration is missing'; exit 77; fi; mkdir -p .pi && cp -R \"$CONVERSATION_REPO_ROOT/.pi/.\" .pi/ && printf '%s\\n' \"$(pwd -P)\" > .pi-session-marker ;; *) printf '%s\\n' 'Unsupported conversation runtime'; exit 77 ;; esac",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) if ! command -v claude >/dev/null 2>&1; then printf '%s\\n' 'Claude Code CLI is unavailable'; exit 77; fi; auth_status=$(claude auth status 2>&1 || true); if printf '%s\\n' \"$auth_status\" | grep -Eiq 'not[[:space:]]+(authenticated|logged in)|unauthenticated|authenticated[^[:alnum:]]+false|logged[[:space:]]+in[^[:alnum:]]+false|401|login required'; then printf '%s\\n' 'Claude Code OAuth is not authenticated'; exit 77; elif ! printf '%s\\n' \"$auth_status\" | grep -Eiq 'authenticated|logged in|oauth|setup-token'; then printf '%s\\n' 'Claude Code authentication status is unavailable'; exit 77; fi; if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.anthropic.com/; then printf '%s\\n' 'Claude Code network access is unavailable'; exit 77; fi ;; opencode) if ! command -v opencode >/dev/null 2>&1; then printf '%s\\n' 'OpenCode CLI is unavailable'; exit 77; fi; opencode_data=$XDG_DATA_HOME; if [ -z \"$opencode_data\" ]; then opencode_data=$HOME/.local/share; fi; if [ ! -f \"$opencode_data/opencode/auth.json\" ] || ! grep -Fq '\"llmgateway\"' \"$opencode_data/opencode/auth.json\"; then printf '%s\\n' 'OpenCode llmgateway login is unavailable'; exit 77; fi; if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.llmgateway.io/ >/dev/null 2>&1; then printf '%s\\n' 'LLM Gateway network access is unavailable'; exit 77; fi; if ! command -v sqlite3 >/dev/null 2>&1; then printf '%s\\n' 'sqlite3 is required for OpenCode transcript checks'; exit 77; fi ;; pi) if ! command -v pi >/dev/null 2>&1; then printf '%s\\n' 'Pi CLI is unavailable'; exit 77; fi; pi_agent=$PI_CODING_AGENT_DIR; if [ -z \"$pi_agent\" ]; then pi_agent=\"$HOME/.pi/agent\"; fi; if [ ! -s \"$pi_agent/auth.json\" ] && ! env | grep -q '_API_KEY=.'; then printf '%s\\n' 'Pi login unavailable: no auth.json or provider API key'; exit 77; fi ;; *) printf '%s\\n' 'Unsupported conversation runtime'; exit 77 ;; esac"
  ],
  "turns": [
    {
      "id": "clarify-go",
      "send": "Use sk-code to add a request-ID middleware to my Go HTTP server in cmd/api/main.go and return it in the X-Request-ID response header.",
      "questions": [
        {
          "match": "([Ww]hich|[Ww]hat|[Hh]ow|[Cc]an you confirm|[Pp]lease confirm).{0,120}([Vv]erif|[Tt]est command|[Tt]ests? (?:to|should|would)|go test|go vet|[Vv]alidat)",
          "answer": {
            "other": "go test ./... and go vet ./..."
          },
          "optional": true
        },
        {
          "match": "([Ww]hich|[Ww]hat|[Ii]s this|[Cc]an you confirm|[Pp]lease confirm).{0,120}([Rr]untime|[Ss]urface|[Ss]tack|[Ll]anguage|[Ff]ramework|[Mm]odule|[Ss]erver|[Ff]ile|[Tt]arget|[Pp]ath)",
          "answer": {
            "other": "This is a standalone Go 1.24 module using net/http. The target is cmd/api/main.go, outside .skilled."
          },
          "optional": true
        },
        {
          "match": "[Ii]nbound X-Request-ID|X-Request-ID header from the caller|[Rr]euse.{0,40}X-Request-ID",
          "answer": {
            "other": "Reuse a valid inbound X-Request-ID; otherwise generate a new one."
          },
          "optional": true
        },
        {
          "match": "([Ww]hich|[Ww]hat|[Hh]ow|[Cc]an you confirm|[Pp]lease confirm).{0,120}([Vv]erif|[Tt]est command|[Tt]ests? (?:to|should|would)|go test|go vet|[Vv]alidat)",
          "answer": {
            "reply": "Use go test ./... and go vet ./... as the verification set."
          },
          "optional": true
        },
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation.{0,30}[Ff]older|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        },
        {
          "match": "([Ww]hich|[Ww]hat|[Ii]s this|[Cc]an you confirm|[Pp]lease confirm).{0,120}([Rr]untime|[Ss]urface|[Ss]tack|[Ll]anguage|[Ff]ramework|[Mm]odule|[Ss]erver|[Ff]ile|[Tt]arget|[Pp]ath)",
          "answer": {
            "reply": "This is a standalone Go 1.24 module using net/http. The target is cmd/api/main.go, outside .skilled."
          },
          "optional": true
        },
        {
          "match": "[Ii]nbound X-Request-ID|X-Request-ID header from the caller|[Rr]euse.{0,40}X-Request-ID",
          "answer": {
            "reply": "Reuse a valid inbound X-Request-ID header, and generate a new ID when it is missing."
          },
          "optional": true
        }
      ],
      "check": "grep -Eiq '[Rr]untime|[Ss]urface|[Vv]erif|[Ss]tack|[Ff]ramework' \"$CONVERSATION_TURN_DIR\"/question-*.txt 2>/dev/null || { printf '%s\\n' 'sk-code asked no clarifying question for the unknown Go surface'; exit 1; }; test -s \"$CONVERSATION_TURN_DIR/question-1.txt\" && test -s \"$CONVERSATION_TURN_DIR/question-2.txt\" && case \"$CONVERSATION_RUNTIME\" in claude-code) test ! -e cmd/api/main.go ;; opencode|pi) fixture_current=$(shasum -a 256 go.mod cmd/api/main.go) && fixture_expected=$(cat .go-fixture-before.sha256) && test \"$fixture_current\" = \"$fixture_expected\" ;; *) exit 1 ;; esac && case \"$CONVERSATION_RUNTIME\" in claude-code) T=\"$HOME/.claude/projects/$(pwd -P | sed 's|[^A-Za-z0-9]|-|g')\"; R=$(grep -hE '\"name\"[[:space:]]*:[[:space:]]*\"Read\"' \"$T\"/*.jsonl 2>/dev/null) ;; opencode) opencode_data=$XDG_DATA_HOME; if [ -z \"$opencode_data\" ]; then opencode_data=$HOME/.local/share; fi; db=\"$opencode_data/opencode/opencode.db\"; project_sql=$(pwd -P | sed \"s/'/''/g\"); R=$(sqlite3 -readonly \"$db\" \"SELECT m.data FROM session_v2 AS s JOIN session_message AS m ON m.session_id = s.id WHERE s.directory = '$project_sql';\") ;; pi) project=$(pwd -P); marker=.pi-session-marker; test -s \"$marker\" && grep -Fq \"$project\" \"$marker\" || exit 1; pi_agent=$PI_CODING_AGENT_DIR; if [ -z \"$pi_agent\" ]; then pi_agent=\"$HOME/.pi/agent\"; fi; R=$(for f in \"$pi_agent\"/sessions/*/*.jsonl; do if [ -f \"$f\" ] && [ \"$f\" -nt \"$marker\" ] && grep -Fq \"$project\" \"$f\"; then cat \"$f\"; fi; done) ;; *) exit 1 ;; esac && printf '%s\\n' \"$R\" | grep -Fq 'ROUTER.md' && printf '%s\\n' \"$R\" | grep -Fq 'shared/references/stack-detection.md' && printf '%s\\n' \"$R\" | grep -Fq 'shared/references/phase-detection.md' && printf '%s\\n' \"$R\" | grep -Fq 'shared/references/universal/code-quality-standards.md' && printf '%s\\n' \"$R\" | grep -Fq 'shared/references/workflow-verify.md' && ! printf '%s\\n' \"$R\" | grep -Fq 'sk-code-skilled/' && echo 'questions=runtime+verification reads=expected+no-skilled target=unchanged'"
    },
    {
      "id": "report-resources",
      "send": "Thanks. What does that mean for my request? I only need guidance; please do not edit files or run commands.",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation.{0,30}[Ff]older|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "case \"$CONVERSATION_RUNTIME\" in claude-code) response=$(awk 'index($0, \"Thanks. What does that mean for my request? I only need guidance; please do not edit files or run commands.\") { after=1; next } after { print }' \"$CONVERSATION_TURN_DIR/screen.txt\") ;; opencode) response=$(cat \"$CONVERSATION_TURN_DIR/screen.txt\") ;; pi) response=$(awk 'index($0, \"Thanks. What does that mean for my request? I only need guidance; please do not edit files or run commands.\") { after=1; next } after { print }' \"$CONVERSATION_TURN_DIR/history.txt\") ;; *) exit 1 ;; esac && printf '%s\\n' \"$response\" | grep -Fq 'UNKNOWN' && printf '%s\\n' \"$response\" | grep -Fq 'VERIFICATION' && case \"$CONVERSATION_RUNTIME\" in claude-code) test ! -e cmd/api/main.go ;; opencode|pi) fixture_current=$(shasum -a 256 go.mod cmd/api/main.go) && fixture_expected=$(cat .go-fixture-before.sha256) && test \"$fixture_current\" = \"$fixture_expected\" ;; *) exit 1 ;; esac && echo 'surface=UNKNOWN intent=VERIFICATION target=unchanged'"
    }
  ]
}
```

The first send matches the scenario contract prompt exactly.
- Setup copies .skilled/ and Claude Code's project configuration into the scratch project. Claude Code keeps the existing empty-target flow and runs its prerequisite, authentication and network checks; a missing requirement skips Claude Code with a one-line reason.
- Claude Code's scripted verification-dialog answer selects go test ./... and go vet ./...; a plain-chat documentation-scope question is answered with D. The verification matcher accepts common equivalent wording while staying distinct from both sends.
- The first check confirms both required clarification questions were captured, the scratch target remains absent, and the Claude Code session transcript contains the expected resources without a sk-code-skilled/ read.
- The second request asks for guidance without naming a surface, intent, resource list or tool. Claude Code's check reads text after the echoed send in screen.txt.
- Both checks read only evidence or scratch state. They do not write under CONVERSATION_REPO_ROOT.

### Commands

1. node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback-conversation.md --runtime claude-code --scratch /tmp/skc-sd004-scratch --out /tmp/skc-sd004-evidence

The scratch and evidence directories are outside the repository.

### Expected

The first turn asks for runtime and verification context, and the Claude Code transcript check shows the resources loaded for that route. The second answer identifies UNKNOWN and VERIFICATION without creating or changing the target file.

### Evidence

The runner's matrix.md, per-runtime result.json and checkpoints.tsv, and per-turn screen.txt, history.txt, question captures and check.txt files record the questions, rendered replies and check results.

Turn 1 transcript evidence is read from Claude Code's session source:

- Claude Code: Read tool_use lines in ~/.claude/projects/<encoded scratch cwd>/*.jsonl.
Turn 2 response evidence is read from screen.txt after the echoed send. The checks search for UNKNOWN and VERIFICATION with substring matching so Claude Code's reply prefix and Markdown rendering do not affect the result.

Claude Code's turn checks confirm that cmd/api/main.go remains absent.

### Pass / Fail

- **Pass**: Both required clarification questions are captured. Claude Code's transcript contains the expected resource evidence and no sk-code-skilled/ read. The response after the second send identifies UNKNOWN and VERIFICATION, and cmd/api/main.go remains absent.
- **Fail**: A required question is not asked, an expected resource is absent, a sk-code-skilled/ resource is read, the response gives another surface or intent, or the target is edited.

### Failure Triage

If a clarification question is missing, inspect the UNKNOWN fallback prompt in ../../ROUTER.md. If Claude Code asks about the target, confirm the empty-target setup is intact before the run. If the verification resource is missing or another resource appears, compare the answer-dependent route with the VERIFICATION map and UNKNOWN loading rule in ../../ROUTER.md. If a SKILLED-specific resource appears, check that the Go target path remains outside .skilled/ and that surface detection stays UNKNOWN. If transcript evidence is missing, check Claude Code's session source above and confirm the scratch path matches pwd -P.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `unknown-fallback.md` | Existing single-prompt UNKNOWN fallback scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../ROUTER.md` | UNKNOWN fallback and surface-aware resource loading rules |
| `../../shared/references/stack-detection.md` | Surface markers and UNKNOWN detection rules |
| `../../shared/references/workflow-verify.md` | Shared verification guidance selected from the answer |

---

## 5. SOURCE METADATA

- Group: Surface Detection
- Playbook ID: SD-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `surface-detection/unknown-fallback-conversation.md`
