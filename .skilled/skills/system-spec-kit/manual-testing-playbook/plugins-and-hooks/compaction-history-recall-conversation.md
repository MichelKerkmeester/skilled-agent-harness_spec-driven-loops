---
title: "compaction-history-recall-conversation -- Compaction history recall conversation"
description: "This scenario measures whether a compacted session recovers a detail that compaction dropped when the history lookup is offered."
trigger_phrases:
  - "compaction history recall conversation"
  - "history lookup recall with lookup"
version: 1.0.1.0
---

# compaction-history-recall-conversation -- Compaction history recall conversation

This document captures the recall scenario contract, its conversation script, the checks and the source anchors.

---

## 1. OVERVIEW

A command prints 120 codes once and deletes its own data, a filler turn adds bulk, the subject compacts, and the next prompt asks for one code. The lookup CLI is present, so the compaction offers the `## History Lookup` section.

### Why This Matters

The deterministic suites and the earlier live runs prove the lookup can return a turn when asked to. They do not show whether a model that lost a detail to compaction recovers it more often with the lookup than without it, or whether it reaches for the lookup unprompted. This pair answers both: the two scenarios differ only in whether the lookup CLI exists in the project, so the offer is made in one and gated off in the other.

---

## 2. SCENARIO CONTRACT

Operators run this scenario and [compaction-history-recall-baseline-conversation](compaction-history-recall-baseline-conversation.md) on the same runtimes, then compare their observed lines.

- Feature ID: compaction-history-recall-conversation
- Objective: measures whether a compacted session recovers a detail that compaction dropped when the history lookup is offered
- Real user request: a long session compacts, and the user then asks for one value a command printed early in the session.
- Prompt: `Run sh show-codes.sh. It issues one-time codes and clears them once shown, which is expected. Tell me how many codes it printed.`
- Expected execution process: setup writes `codes.txt` and `show-codes.sh`, which prints the codes and deletes `codes.txt`. Turn one runs it, turn two reads `AGENTS.md`, turn three compacts, and turn four asks for the code printed for `K073`.
- Expected signals: `answer.txt` holds `PDSNMMBW`, and the final check prints `observed=runtime=<id> answer=correct lookup_ran=<0|1> native_recall=<0|1> transcript_read=<0|1>`. `lookup_ran=1` means the subject ran the lookup CLI after the recall prompt without being told to.
- Desired user-visible outcome: the subject finds the code it can no longer see.
- Pass/fail: PASS if `answer.txt` holds `PDSNMMBW`, FAIL if `answer.txt` is missing or holds another value, or `show-codes.sh` never ran.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run sh show-codes.sh. It issues one-time codes and clears them once shown, which is expected. Tell me how many codes it printed.`

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code",
    "opencode",
    "codex",
    "pi",
    "devin"
  ],
  "setup": [
    "test -f \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js\" || { echo 'history lookup CLI is not built: run npm run build in .skilled/skills/system-spec-kit/runtime'; exit 77; }",
    "git init -q",
    "mkdir -p specs .claude .opencode .codex .pi .devin .skilled/skills",
    "for d in .claude .opencode .codex .pi .devin; do cp -R \"$CONVERSATION_REPO_ROOT/$d/.\" \"$d/\"; done",
    "node -e 'const fs=require(\"fs\");const c=JSON.parse(fs.readFileSync(process.env.CONVERSATION_REPO_ROOT+\"/opencode.json\",\"utf8\"));delete c.mcp;fs.writeFileSync(\"opencode.json\",JSON.stringify(c,null,2))'",
    "cp \"$CONVERSATION_REPO_ROOT/AGENTS.md\" AGENTS.md && ln -s AGENTS.md CLAUDE.md",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/hooks\" .skilled/hooks && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/bin\" .skilled/bin",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit\" .skilled/skills/system-spec-kit",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/commands\" .skilled/commands && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/repo-rules\" .skilled/repo-rules",
    "python3 -c 'from pathlib import Path; p=Path(\".codex/config.toml\"); s=p.read_text(); k=\"default_mode_request_user_input\"; marker=\"[features]\\n\"; s=s if k in s else (s.replace(marker, marker+k+\" = true\\n\", 1) if marker in s else k+\" = true\\n\"+s); p.write_text(s)'",
    "node -e 'const A=\"ABCDEFGHJKMNPQRSTUVWXYZ23456789\";let x=20261108;const r=()=>{x=(x*1103515245+12345)%2147483648;return x};const L=[];for(let i=1;i<=120;i++){let v=\"\";for(let j=0;j<8;j++)v+=A[r()%A.length];L.push(\"K\"+String(i).padStart(3,\"0\")+\" \"+v)}require(\"fs\").writeFileSync(\"codes.txt\",L.join(\"\\n\")+\"\\n\")'",
    "printf '#!/bin/sh\\ncat codes.txt && rm -f codes.txt\\n' > show-codes.sh"
  ],
  "trust_hooks": true,
  "turns": [
    {
      "id": "show-codes",
      "send": "Run sh show-codes.sh. It issues one-time codes and clears them once shown, which is expected. Tell me how many codes it printed.",
      "delay_ms": [
        3000,
        8000
      ],
      "questions": [
        {
          "match": "([Ss]pec folder|[Dd]ocumentation)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "set -u; if [ -e codes.txt ]; then printf 'DEVIATION: show-codes.sh did not run\\n'; exit 1; fi; printf 'observed=codes_shown_once\\n'"
    },
    {
      "id": "filler",
      "send": "Read AGENTS.md and tell me in one sentence what it is for.",
      "delay_ms": [
        3000,
        8000
      ],
      "check": "printf 'observed=agents_md_bytes=%s\\n' \"$(wc -c < AGENTS.md | tr -d ' ')\""
    },
    {
      "id": "compact",
      "action": "compact",
      "timeout_ms": 600000,
      "check": "printf 'observed=compacted\\n'"
    },
    {
      "id": "recall",
      "send": "What code did show-codes.sh print for K073? Write only that code to answer.txt.",
      "delay_ms": [
        3000,
        8000
      ],
      "timeout_ms": 600000,
      "questions": [
        {
          "match": "([Ss]pec folder|[Dd]ocumentation)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "set -u; T=\"$CONVERSATION_TURN_DIR\"; [ -f answer.txt ] && cp -p answer.txt \"$T/answer.txt\"; got=$(tr -d '[:space:]' < answer.txt 2>/dev/null || true); if [ \"$got\" = PDSNMMBW ]; then answer=correct; elif [ -z \"$got\" ]; then answer=missing; else answer=wrong; fi; tail_txt=$(awk -v s='print for K073' 'index($0,s){buf=\"\";hit=1;next} hit{buf=buf $0 \"\\n\"} END{printf \"%s\", buf}' \"$T/history.txt\" 2>/dev/null); lookup=0; printf '%s' \"$tail_txt\" | grep -qF 'history/cli.js' && lookup=1; transcript=0; printf '%s' \"$tail_txt\" | grep -qE '\\.claude/projects|\\.codex/sessions|sessions\\.db|opencode\\.db|\\.pi/agent/sessions' && transcript=1; native=0; printf '%s' \"$tail_txt\" | grep -qiE 'searched memor|recalled|searched (the )?(session|conversation)' && native=1; line=$(printf 'observed=runtime=%s answer=%s lookup_ran=%s native_recall=%s transcript_read=%s' \"$CONVERSATION_RUNTIME\" \"$answer\" \"$lookup\" \"$native\" \"$transcript\"); printf '%s\\n' \"$line\"; [ \"$answer\" = correct ]"
    }
  ]
}
```

### Commands

1. Build the lookup helper first: `cd .skilled/skills/system-spec-kit/runtime && npm run build`. Setup skips the runtime with exit 77 when `cli.js` is missing.
2. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md --runtime <id[,id...]> --scratch <scratch-dir> --out <evidence-dir> --seed 7`
3. Run [compaction-history-recall-baseline-conversation](compaction-history-recall-baseline-conversation.md) with the same runtimes and seed into a separate evidence folder.
4. Record each runtime's model beside `matrix.md`, then tabulate the `answer` and `lookup_ran` fields of both runs side by side.

The scratch directory must be outside the repository.

### Expected

The subject compacts, sees the lookup section, runs the printed command or a `search` for `K073`, and writes `PDSNMMBW` to `answer.txt`. The check passes on the correct code and records whether the lookup ran.

### Evidence

Each turn folder keeps `screen.txt`, `history.txt` and `check.txt`, and the recall turn copies `answer.txt`. The last line of the recall check is the observed value: runtime, answer, whether the lookup CLI ran after the recall prompt, whether the runtime's own history search ran (`native_recall`, which Claude Code shows as `searched memories`) and whether the subject read a runtime session store itself.

### Pass / Fail

- **Pass**: `answer.txt` holds `PDSNMMBW`.
- **Fail**: `answer.txt` is missing or holds another value, or `show-codes.sh` never ran.

### Failure Triage

1. If the first turn fails with DEVIATION, the subject never ran `show-codes.sh`; quote its reply from `screen.txt`.
2. If the compact turn fails, check whether the runtime refused to compact; Pi refuses a session it judges small, so record that as the runtime's blocker.
3. If the answer is wrong and `lookup_ran=0`, read `history.txt` after the recall prompt to see whether the section reached the model. On Devin the section arrives with the next prompt, not at compaction.
4. `lookup_ran` is read from the scrollback after the recall prompt. A runtime that prints injected hook text to the pane could raise it without a tool call, so confirm a positive against the tool call in `history.txt`.
5. On Codex the script sets `trust_hooks`, because untrusted project hooks never run and no offer is made. The hooks call `node` from the subject's `PATH`; a `node` that fails to start makes every hook fall back silently, so confirm `node --version` works in the runtime's shell before reading a Codex result.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [compaction-history-lookup](../../feature-catalog/context-preservation/compaction-history-lookup.md) | Feature contract for the compaction history lookup |
| [compaction-history-lookup](compaction-history-lookup.md) | The single-prompt scenario for the offer gates and refusals |

### Implementation And Test Anchors

| File | Role |
|---|---|
| .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts | Offer gate that requires the CLI inside the session's checkout |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts | The lookup command the section prints |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and exit outcomes |

Provenance: manual only - a live multi-turn conversation that the shared conversation runner drives in a scratch project

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: compaction-history-recall-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/compaction-history-recall-conversation.md
