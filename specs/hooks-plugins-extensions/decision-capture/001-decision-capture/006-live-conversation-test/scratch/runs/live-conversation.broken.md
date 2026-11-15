---
title: "decision-capture-live-conversation -- Decision capture live conversation"
description: "This scenario validates decision capture across a timed live conversation, queue and nudge checks, two saves, compaction and restart."
trigger_phrases:
  - "decision capture live conversation"
  - "decision capture runtime matrix"
  - "live decision capture scenario"
version: 1.0.0.0
---

# decision-capture-live-conversation -- Decision capture live conversation

This document captures the live conversation contract, expected execution, per-stage checks, source anchors and metadata for decision capture.

---

## 1. OVERVIEW

This scenario drives a real interactive subject through product questions, a full-auto save, context compaction, a restart and a repeat save in an isolated scratch project.

### Why This Matters

Fixture-based scenarios do not prove that real answers survive the runtime question surface, compaction and restart, or that save-time capture leaves the scratch record stable. The per-turn checks keep the queue, nudge and decision record visible as the conversation runs.

---

## 2. SCENARIO CONTRACT

Operators run the exact conversation script for decision-capture-live-conversation and record each stage result with its evidence path.

- Feature ID: decision-capture-live-conversation
- Objective: Prove that product answers are captured once, process questions are excluded, the save writes the expected decisions, compaction and restart preserve the queue, and a repeat save is byte-identical.
- Real user request: I am adding a status badge to the demo widget. Ask me the product questions, keep my answers through compaction and a restart, then show that saving them twice does not duplicate the record.
- Prompt: Add a status badge to the demo widget in this project. Ask me product questions only when I tell you to.
- Expected execution process: Build the scratch repository in the runner's current folder, run S0 through S11 in one interactive session, and copy queue, consumed log, nudge files and decision record into each turn evidence folder. Run the kill-switch scenario separately for S12.
- Expected signals: S1 asks the Gate 3 process question and records no process answer; S2 to S4 add three queued product answers; S5 adds a plain chat answer without a hook queue row; S6 saves four decisions; S7 to S9 add three more answers across compaction and restart; S10 saves seven decisions; S11 leaves the record byte-identical.
- Desired user-visible outcome: A PASS, FAIL or SKIP for every stage, with the observed value and evidence path, plus one populated runtime matrix row.
- Pass/fail: PASS when each applicable expected value is observed and the real repository baselines remain unchanged. FAIL when a subject deviation or an expected value mismatch is recorded. SKIP only when the stage cannot apply on the runtime and the named blocker is recorded.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: Add a status badge to the demo widget in this project. Ask me product questions only when I tell you to.

### Stage Table

Every turn uses delay_ms [5000, 15000]; every answer uses delay_ms [3000, 8000]. The runner draws the pauses from its recorded seed.

| Stage | Human turn or action | Answer the human gives | Pause | Checkpoint observable | Expected |
|-------|----------------------|-----------------------|-------|------------------------|----------|
| S0 | Check-only turn: record baselines after setup | none | turn range | Real repository status with ignored files, real queue content hash, scratch queue listing | Baselines saved to the turn evidence folder; scratch queue has no JSONL rows |
| S1 | "Add a status badge to the demo widget in this project. Ask me product questions only when I tell you to." | Gate 3: A) Existing, specs/demo/001-demo | turn and answer ranges | Scratch queue row count and process-question matches; screen.txt shows the Gate 3 question | 0 queue rows, 0 process-question matches, question visible |
| S2 | "Before you write anything, ask me with your question tool which colour the badge uses. One choice." | select Amber | turn and answer ranges | Queue rows and distinct keys, new answer, nudge lines in screen.txt, nudge file value | 1 row, 1 key, answer Amber, 1 nudge line, nudge value 1 |
| S3 | "Now ask me which platforms the badge must support. Let me pick several." | select every offered platform | turn and answer ranges | Queue rows and distinct keys, new answer, nudge lines, nudge file value | 2 rows, 2 keys, answer contains all three selected labels, 1 nudge line, nudge value 2 |
| S4 | "Ask me for the badge label with a few options. I will type my own." | choose Other and type Needs review | turn and answer ranges | Queue rows and distinct keys, new answer, nudge lines, nudge file value | 3 rows, 3 keys, answer Needs review, 1 nudge line, nudge value 3 |
| S5 | "Do not use the tool this time. End your reply with one plain question to me about whether the badge should blink." | reply No, keep it static. | turn and answer ranges | Queue rows, nudge lines and nudge file value; screen.txt shows the blink question and reply | 3 rows, 0 nudge lines, nudge value 3 |
| S6 | /speckit:save specs/demo/001-demo --full-auto | none | turn range | Decision rows and appendix items, consumed rows and distinct keys, answer text, process-question count, SPECKIT_LEVEL before and after, queue rows, pendingRecords and consumed row growth | 4 rows, 4 items, 4 consumed rows and keys, no decided text equals its verbatim answer, process count 0, level unchanged, queue remains 3, pendingRecords 0, consumed growth 4, nudge value 0 |
| S7 | "Ask me with the tool whether the badge sits left or right of the title." | select Right | turn and answer ranges | Queue rows and keys, new answer, nudge lines and nudge file value | 4 rows, 4 keys, answer Right, 1 nudge line, nudge value 1 |
| S8 | Two turns: S8-compact compacts context and saves the queue hash; S8-ask sends "Ask me with the tool which size the badge uses." | select Small | each turn and answer use their ranges | Queue hash before and after compaction, then rows, keys, answer, nudge lines and nudge file value | Queue hash unchanged after compaction; then 5 rows, 5 keys, answer Small, 1 nudge line, nudge value 2 |
| S9 | S9-restart restarts into the same session; S9-ask sends "Ask me with the tool whether the badge has a tooltip." | select Yes | each turn and answer use their ranges | Queue files and rows, distinct keys, new answer, nudge lines and the new answer's session id | 6 rows across files, 6 keys, answer Yes, 1 nudge line, session id recorded |
| S10 | /speckit:save specs/demo/001-demo --full-auto | none | turn range | Decision rows and appendix items, consumed rows and keys, process-question count, pendingRecords and consumed row growth | 7 rows, 7 items and keys, process count 0, pendingRecords 0, consumed growth 3, nudge value 0 |
| S11 | /speckit:save specs/demo/001-demo --full-auto again | none | turn range | Byte comparison against the S10 decision record, consumed row count, nudge lines | Comparison exits 0, 7 consumed rows, 0 nudge lines |

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
    "git init -q",
    "mkdir -p .claude .opencode .codex .pi .devin .skilled/skills/.state",
    "for d in .claude .opencode .codex .pi .devin; do cp -R \"$CONVERSATION_REPO_ROOT/$d/.\" \"$d/\"; done",
    "cp \"$CONVERSATION_REPO_ROOT/AGENTS.md\" AGENTS.md && cp \"$CONVERSATION_REPO_ROOT/CLAUDE.md\" CLAUDE.md",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/hooks\" .skilled/hooks && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/bin\" .skilled/bin && ln -s \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit\" .skilled/skills/system-spec-kit",
    "bash \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh\" --path specs/demo/001-demo --name \"demo widget\" --level 3 --with-lazy-addons",
    "python3 -c 'from pathlib import Path; p=Path(\".codex/config.toml\"); s=p.read_text(); marker=\"[features]\\n\"; s=s.replace(marker, marker+\"default_mode_request_user_input = true\\n\", 1) if marker in s else \"default_mode_request_user_input = true\\n\"+s; p.write_text(s)'",
    "cat > .conversation-check.sh <<'BASH'\n#!/usr/bin/env bash\nset -u\nstage=\"$1\"\nRUNTIME=\"$CONVERSATION_RUNTIME\"\nP=\"$PWD\"\nQ=\"$P/.skilled/skills/.state/decision-capture\"\nCONSUMED=\"$Q/consumed.jsonl\"\nRECORD=\"$P/specs/demo/001-demo/decision-record.md\"\nSPEC=\"$P/specs/demo/001-demo/spec.md\"\nRUN=\"$CONVERSATION_RUN_DIR\"\nTURN=\"$CONVERSATION_TURN_DIR\"\nmkdir -p \"$RUN\" \"$TURN\"\ncapture() {\n  python3 - \"$Q\" \"$CONSUMED\" \"$RECORD\" \"$TURN/screen.txt\" \"$SPEC\" <<'PY' > \"$TURN/metrics.tsv\"\nimport hashlib\nimport json\nimport re\nimport sys\nfrom pathlib import Path\nq, consumed_path, record_path, screen_path, spec_path = map(Path, sys.argv[1:])\nqueue_files = sorted(p for p in q.glob('*.jsonl') if p.name != 'consumed.jsonl') if q.exists() else []\nqueue_rows = []\nfor path in queue_files:\n    for line in path.read_text(encoding='utf-8', errors='replace').splitlines():\n        if line.strip():\n            try:\n                value = json.loads(line)\n                queue_rows.append(value if isinstance(value, dict) else {'raw': line})\n            except Exception:\n                queue_rows.append({'raw': line})\nconsumed_lines = consumed_path.read_text(encoding='utf-8', errors='replace').splitlines() if consumed_path.is_file() else []\nconsumed_rows = []\nfor line in consumed_lines:\n    if line.strip():\n        try:\n            value = json.loads(line)\n            consumed_rows.append(value if isinstance(value, dict) else {'raw': line})\n        except Exception:\n            consumed_rows.append({'raw': line})\nkeys = [str(row.get('key', '')) for row in queue_rows if row.get('key')]\nconsumed_keys = {str(row.get('key', '')) for row in consumed_rows if row.get('key')}\npending = len({key for key in keys if key not in consumed_keys})\nlast = queue_rows[-1] if queue_rows else {}\ndef clean(value):\n    return ' '.join(str(value or '').split())\nanswer = last.get('answer', '')\nif isinstance(answer, list):\n    answer = ', '.join(str(value) for value in answer)\nquestion = clean(last.get('question', ''))\nsession = next((str(value) for key, value in last.items() if 'session' in str(key).lower() and value), '')\nrecord = record_path.read_text(encoding='utf-8', errors='replace') if record_path.is_file() else ''\nscreen = screen_path.read_text(encoding='utf-8', errors='replace') if screen_path.is_file() else ''\nspec = spec_path.read_text(encoding='utf-8', errors='replace') if spec_path.is_file() else ''\nrecord_rows = re.findall(r'(?m)^\\|\\s*Q\\d+\\s*\\|', record)\nrecord_items = re.findall(r'(?m)^### Q\\d+\\s*

### Runtime Matrix

Record one row per runtime with these columns: Runtime, CLI version, Model, Question tool (AskUserQuestion, question, request_user_input, ask-user-question, ask_user_question or no answer surface), Answer path (live hook, save-time sweep or none), S1 to S12 (each PASS, FAIL or SKIP with one reason), Nudge sequence observed, Verdict, Evidence folder.

### Checkpoint Derivation

For each runtime, derive the 13-row checkpoints.tsv from the runner's main run and the separate kill-switch run. Copy the main-run rows for S0 to S7 and S9 to S11, merge S8-compact and S8-ask into one S8 row with both evidence paths and observed values, then append S12 from the kill-switch run. Keep the columns stage, status, evidence path and observed value.

### Stage Marks and Siblings

A subject deviation is FAIL and quotes the DEVIATION line. A stage that does not apply is SKIP with its first-line blocker. The checks read CONVERSATION_RUNTIME; for runtimes other than claude-code, the live hook and Stop nudge checks exit 77 with a blocker that names the runtime. The runtime matrix records those nudge cells as SKIP until a sibling adds that surface.

The sibling folders are specs/system-speckit/043-decision-capture/002-table-row-matching, specs/system-speckit/043-decision-capture/003-codex-and-pi-capture, specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture and specs/system-speckit/043-decision-capture/005-chat-question-detection. Each sibling adds stages as S13 and up or a variant such as S5b, never renumbers, and appends a matrix row with the commit it tests.

### Commands

1. Run the scenario once for each runtime with the 065 runner, recording its seed and model.
2. Run the kill-switch scenario separately for the same runtime and scratch-project isolation.
3. Preserve each runner turn folder, the queue and consumed copies, nudge files, decision-record copies, the real-repository baseline and the final repository snapshot.
4. Derive the 13-row checkpoints.tsv and append the runtime matrix row from the two runs.

### Expected

S0 captures the real repository status and queue hash before the conversation. S1 captures the Gate 3 question in screen.txt while the scratch queue remains empty. S2 to S4 create one queue row each. S5 adds the static badge answer through the plain chat transcript without changing the queue. S6 consumes four product answers, leaves the three hook rows in the queue, and clears the nudge. S7 to S9 add the remaining three answers, with the queue hash stable across compaction and restart. S10 writes seven rows and seven appendix items. S11 is byte-identical to the S10 record.

### Evidence

Keep the runner's screen.txt, question captures, check output and exit code for every turn. Each check copies current queue JSONL files, consumed.jsonl, nudge files and decision-record.md into CONVERSATION_TURN_DIR; S0 also saves the real repository status and decision-capture content hash there. The runner's checkpoint row records turn id, status, attempts, evidence folder and the check's final observed-value line.

### Pass / Fail

- **Pass**: Every applicable check matches the Stage Table, the S8 compaction and S9 restart preserve the queue hash, S6 and S10 report pendingRecords=0, and S11's record comparison exits 0.
- **Fail**: A check prints DEVIATION, a question or answer differs from the script, a queue key is duplicated, a save omits or duplicates an answer, a nudge count differs, the repeated record changes, or the real repository status or queue hash differs from its baseline.
- **Skip**: A stage cannot apply on the runtime and the check prints its blocker as the first output line before the observed value.

### Failure Triage

1. If a check prints DEVIATION, quote that line in the runtime row, retain both retry attempts when the turn has retry 1, and mark the stage FAIL.
2. S3 uses three plausible labels, Web, iOS and Android. The labels in answer.select must match what the subject offers; if the offered labels differ, update the scripted labels to their exact text before running.
3. If the runner cannot answer a question because the runtime has no answer surface, keep pane or transcript evidence and record no answer surface in the matrix. Do not record a successful answer.
4. The Stop nudge is Claude-only. For a runtime other than claude-code, the check reads CONVERSATION_RUNTIME, prints a first line naming the blocker and exits 77. Record the nudge cell as SKIP with that blocker, as documented by .skilled/hooks/README.md.
5. If S6 or S10 reports nonzero pendingRecords, compare queue keys to consumed.jsonl before treating the save as successful. If S11 differs, retain both decision-record copies and the comparison output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [operator-decision-capture](../../feature-catalog/ux-hooks/operator-decision-capture.md) | Feature contract for operator decision capture |

### Implementation And Test Anchors

| File | Role |
|---|---|
| specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md section 3 | Stage values, scratch project, evidence store, runtime matrix and sibling rule |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md REQ-001 to REQ-013 | Conversation, capture, save, kill-switch and matrix requirements |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and turn outcomes |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Stop nudge text and behavior |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Decision rows, verbatim appendix and consumed keys |

Provenance: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-live-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/decision-capture-live-conversation.md

, record)\nrecord_answers = {}\nfence_char = chr(96)\nanswer_pattern = re.compile(r'(?ms)^Answer:\\s*\\n+(' + re.escape(fence_char) + r'{3,})text\\s*\\n(.*?)\\n\\1\\s*

### Runtime Matrix

Record one row per runtime with these columns: Runtime, CLI version, Model, Question tool (AskUserQuestion, question, request_user_input, ask-user-question, ask_user_question or no answer surface), Answer path (live hook, save-time sweep or none), S1 to S12 (each PASS, FAIL or SKIP with one reason), Nudge sequence observed, Verdict, Evidence folder.

### Checkpoint Derivation

For each runtime, derive the 13-row checkpoints.tsv from the runner's main run and the separate kill-switch run. Copy the main-run rows for S0 to S7 and S9 to S11, merge S8-compact and S8-ask into one S8 row with both evidence paths and observed values, then append S12 from the kill-switch run. Keep the columns stage, status, evidence path and observed value.

### Stage Marks and Siblings

A subject deviation is FAIL and quotes the DEVIATION line. A stage that does not apply is SKIP with its first-line blocker. The checks read CONVERSATION_RUNTIME; for runtimes other than claude-code, the live hook and Stop nudge checks exit 77 with a blocker that names the runtime. The runtime matrix records those nudge cells as SKIP until a sibling adds that surface.

The sibling folders are specs/system-speckit/043-decision-capture/002-table-row-matching, specs/system-speckit/043-decision-capture/003-codex-and-pi-capture, specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture and specs/system-speckit/043-decision-capture/005-chat-question-detection. Each sibling adds stages as S13 and up or a variant such as S5b, never renumbers, and appends a matrix row with the commit it tests.

### Commands

1. Run the scenario once for each runtime with the 065 runner, recording its seed and model.
2. Run the kill-switch scenario separately for the same runtime and scratch-project isolation.
3. Preserve each runner turn folder, the queue and consumed copies, nudge files, decision-record copies, the real-repository baseline and the final repository snapshot.
4. Derive the 13-row checkpoints.tsv and append the runtime matrix row from the two runs.

### Expected

S0 captures the real repository status and queue hash before the conversation. S1 captures the Gate 3 question in screen.txt while the scratch queue remains empty. S2 to S4 create one queue row each. S5 adds the static badge answer through the plain chat transcript without changing the queue. S6 consumes four product answers, leaves the three hook rows in the queue, and clears the nudge. S7 to S9 add the remaining three answers, with the queue hash stable across compaction and restart. S10 writes seven rows and seven appendix items. S11 is byte-identical to the S10 record.

### Evidence

Keep the runner's screen.txt, question captures, check output and exit code for every turn. Each check copies current queue JSONL files, consumed.jsonl, nudge files and decision-record.md into CONVERSATION_TURN_DIR; S0 also saves the real repository status and decision-capture content hash there. The runner's checkpoint row records turn id, status, attempts, evidence folder and the check's final observed-value line.

### Pass / Fail

- **Pass**: Every applicable check matches the Stage Table, the S8 compaction and S9 restart preserve the queue hash, S6 and S10 report pendingRecords=0, and S11's record comparison exits 0.
- **Fail**: A check prints DEVIATION, a question or answer differs from the script, a queue key is duplicated, a save omits or duplicates an answer, a nudge count differs, the repeated record changes, or the real repository status or queue hash differs from its baseline.
- **Skip**: A stage cannot apply on the runtime and the check prints its blocker as the first output line before the observed value.

### Failure Triage

1. If a check prints DEVIATION, quote that line in the runtime row, retain both retry attempts when the turn has retry 1, and mark the stage FAIL.
2. S3 uses three plausible labels, Web, iOS and Android. The labels in answer.select must match what the subject offers; if the offered labels differ, update the scripted labels to their exact text before running.
3. If the runner cannot answer a question because the runtime has no answer surface, keep pane or transcript evidence and record no answer surface in the matrix. Do not record a successful answer.
4. The Stop nudge is Claude-only. For a runtime other than claude-code, the check reads CONVERSATION_RUNTIME, prints a first line naming the blocker and exits 77. Record the nudge cell as SKIP with that blocker, as documented by .skilled/hooks/README.md.
5. If S6 or S10 reports nonzero pendingRecords, compare queue keys to consumed.jsonl before treating the save as successful. If S11 differs, retain both decision-record copies and the comparison output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [operator-decision-capture](../../feature-catalog/ux-hooks/operator-decision-capture.md) | Feature contract for operator decision capture |

### Implementation And Test Anchors

| File | Role |
|---|---|
| specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md section 3 | Stage values, scratch project, evidence store, runtime matrix and sibling rule |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md REQ-001 to REQ-013 | Conversation, capture, save, kill-switch and matrix requirements |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and turn outcomes |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Stop nudge text and behavior |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Decision rows, verbatim appendix and consumed keys |

Provenance: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-live-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/decision-capture-live-conversation.md

)\nfor match in re.finditer(r'(?ms)^### (Q\\d+)\\s*\\n(.*?)(?=^### Q\\d+\\s*$|\\Z)', record):\n    answer_match = answer_pattern.search(match.group(2))\n    if answer_match:\n        record_answers[match.group(1)] = clean(answer_match.group(2))\ndecisions = {}\nfor line in record.splitlines():\n    if re.match(r'^\\|\\s*Q\\d+\\s*\\|', line):\n        cells = [cell.strip() for cell in line.strip('|').split('|')]\n        if len(cells) > 1:\n            decisions[cells[0]] = clean(cells[1])\nequal_decisions = sum(1 for key, value in record_answers.items() if decisions.get(key) == value)\nqueue_digest = hashlib.sha256()\nfor path in queue_files:\n    queue_digest.update(path.name.encode('utf-8'))\n    queue_digest.update(b'\\0')\n    queue_digest.update(path.read_bytes())\nnudges = []\nfor path in sorted(q.glob('*.nudge')) if q.exists() else []:\n    text = path.read_text(encoding='utf-8', errors='replace').strip()\n    try:\n        nudges.append(int(text))\n    except ValueError:\n        nudges.append(0)\nnudge_value = sum(nudges)\nnudge_line = 'operator answer(s) captured this session are not in a decision record yet'\nqueue_process = sum(1 for row in queue_rows if re.search(r'(?i)(spec folder|gate 3)', json.dumps(row, ensure_ascii=False)))\nrecord_process = len(re.findall(r'(?i)(spec folder|gate 3)', record))\nlevel_match = re.search(r'(?m)^<!--\\s*SPECKIT_LEVEL:\\s*([^>]+?)\\s*-->

### Runtime Matrix

Record one row per runtime with these columns: Runtime, CLI version, Model, Question tool (AskUserQuestion, question, request_user_input, ask-user-question, ask_user_question or no answer surface), Answer path (live hook, save-time sweep or none), S1 to S12 (each PASS, FAIL or SKIP with one reason), Nudge sequence observed, Verdict, Evidence folder.

### Checkpoint Derivation

For each runtime, derive the 13-row checkpoints.tsv from the runner's main run and the separate kill-switch run. Copy the main-run rows for S0 to S7 and S9 to S11, merge S8-compact and S8-ask into one S8 row with both evidence paths and observed values, then append S12 from the kill-switch run. Keep the columns stage, status, evidence path and observed value.

### Stage Marks and Siblings

A subject deviation is FAIL and quotes the DEVIATION line. A stage that does not apply is SKIP with its first-line blocker. The checks read CONVERSATION_RUNTIME; for runtimes other than claude-code, the live hook and Stop nudge checks exit 77 with a blocker that names the runtime. The runtime matrix records those nudge cells as SKIP until a sibling adds that surface.

The sibling folders are specs/system-speckit/043-decision-capture/002-table-row-matching, specs/system-speckit/043-decision-capture/003-codex-and-pi-capture, specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture and specs/system-speckit/043-decision-capture/005-chat-question-detection. Each sibling adds stages as S13 and up or a variant such as S5b, never renumbers, and appends a matrix row with the commit it tests.

### Commands

1. Run the scenario once for each runtime with the 065 runner, recording its seed and model.
2. Run the kill-switch scenario separately for the same runtime and scratch-project isolation.
3. Preserve each runner turn folder, the queue and consumed copies, nudge files, decision-record copies, the real-repository baseline and the final repository snapshot.
4. Derive the 13-row checkpoints.tsv and append the runtime matrix row from the two runs.

### Expected

S0 captures the real repository status and queue hash before the conversation. S1 captures the Gate 3 question in screen.txt while the scratch queue remains empty. S2 to S4 create one queue row each. S5 adds the static badge answer through the plain chat transcript without changing the queue. S6 consumes four product answers, leaves the three hook rows in the queue, and clears the nudge. S7 to S9 add the remaining three answers, with the queue hash stable across compaction and restart. S10 writes seven rows and seven appendix items. S11 is byte-identical to the S10 record.

### Evidence

Keep the runner's screen.txt, question captures, check output and exit code for every turn. Each check copies current queue JSONL files, consumed.jsonl, nudge files and decision-record.md into CONVERSATION_TURN_DIR; S0 also saves the real repository status and decision-capture content hash there. The runner's checkpoint row records turn id, status, attempts, evidence folder and the check's final observed-value line.

### Pass / Fail

- **Pass**: Every applicable check matches the Stage Table, the S8 compaction and S9 restart preserve the queue hash, S6 and S10 report pendingRecords=0, and S11's record comparison exits 0.
- **Fail**: A check prints DEVIATION, a question or answer differs from the script, a queue key is duplicated, a save omits or duplicates an answer, a nudge count differs, the repeated record changes, or the real repository status or queue hash differs from its baseline.
- **Skip**: A stage cannot apply on the runtime and the check prints its blocker as the first output line before the observed value.

### Failure Triage

1. If a check prints DEVIATION, quote that line in the runtime row, retain both retry attempts when the turn has retry 1, and mark the stage FAIL.
2. S3 uses three plausible labels, Web, iOS and Android. The labels in answer.select must match what the subject offers; if the offered labels differ, update the scripted labels to their exact text before running.
3. If the runner cannot answer a question because the runtime has no answer surface, keep pane or transcript evidence and record no answer surface in the matrix. Do not record a successful answer.
4. The Stop nudge is Claude-only. For a runtime other than claude-code, the check reads CONVERSATION_RUNTIME, prints a first line naming the blocker and exits 77. Record the nudge cell as SKIP with that blocker, as documented by .skilled/hooks/README.md.
5. If S6 or S10 reports nonzero pendingRecords, compare queue keys to consumed.jsonl before treating the save as successful. If S11 differs, retain both decision-record copies and the comparison output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [operator-decision-capture](../../feature-catalog/ux-hooks/operator-decision-capture.md) | Feature contract for operator decision capture |

### Implementation And Test Anchors

| File | Role |
|---|---|
| specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md section 3 | Stage values, scratch project, evidence store, runtime matrix and sibling rule |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md REQ-001 to REQ-013 | Conversation, capture, save, kill-switch and matrix requirements |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and turn outcomes |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Stop nudge text and behavior |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Decision rows, verbatim appendix and consumed keys |

Provenance: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-live-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/decision-capture-live-conversation.md

, spec)\nmetrics = {\n    'queue_files': len(queue_files),\n    'queue_lines': len(queue_rows),\n    'queue_keys': len(set(keys)),\n    'queue_answer': clean(answer),\n    'queue_question': question,\n    'queue_question_lc': question.lower(),\n    'queue_question_color': int(bool(re.search(r'(?i)colou?r', question))),\n    'queue_process_matches': queue_process,\n    'queue_pending': pending,\n    'queue_sha': queue_digest.hexdigest(),\n    'consumed_lines': sum(1 for line in consumed_lines if line.strip()),\n    'consumed_keys': len(consumed_keys),\n    'record_rows': len(record_rows),\n    'record_items': len(record_items),\n    'record_process_matches': record_process,\n    'record_answer_text': clean(' '.join(record_answers.values())).lower(),\n    'record_answer_equal_decisions': equal_decisions,\n    'screen_nudges': sum(1 for line in screen.splitlines() if nudge_line in line),\n    'screen_gate3': int(bool(re.search(r'(?i)(spec folder|gate 3|which.{0,60}folder)', screen))),\n    'screen_blink': int(bool(re.search(r'(?i)blink', screen))),\n    'screen_static_answer': int('no, keep it static.' in screen.lower()),\n    'session_id': clean(session),\n    'nudge_value': nudge_value,\n    'level': level_match.group(1).strip() if level_match else '',\n}\nfor key, value in metrics.items():\n    print(f'{key}\\t{value}')\nPY\n}\nvalue() { awk -F '\\t' -v wanted=\"$1\" '$1 == wanted { sub(/^[^\\t]*\\t/, \"\"); print; exit }' \"$TURN/metrics.tsv\"; }\ncopy_state() {\n  if [ -d \"$Q\" ]; then find \"$Q\" -maxdepth 1 -type f \\( -name '*.jsonl' -o -name '*.nudge' \\) -exec cp -p {} \"$TURN/\" \\; 2>/dev/null || true; fi\n  if [ -f \"$RECORD\" ]; then cp -p \"$RECORD\" \"$TURN/decision-record.md\"; fi\n}\nfinish() { capture; copy_state; printf 'observed=%s\\n' \"$1\"; exit \"$2\"; }\ndeviation() { printf 'DEVIATION: %s\\n' \"$1\"; finish \"$2\" 1; }\nskip_stage() { printf 'BLOCKER: %s\\n' \"$1\"; finish \"$2\" 77; }\ncapture\nqueue_lines=\"$(value queue_lines)\"\nqueue_keys=\"$(value queue_keys)\"\nqueue_answer=\"$(value queue_answer)\"\nqueue_question_lc=\"$(value queue_question_lc)\"\nqueue_pending=\"$(value queue_pending)\"\nqueue_sha=\"$(value queue_sha)\"\nconsumed_lines=\"$(value consumed_lines)\"\nconsumed_keys=\"$(value consumed_keys)\"\nrecord_rows=\"$(value record_rows)\"\nrecord_items=\"$(value record_items)\"\nrecord_process=\"$(value record_process_matches)\"\nrecord_answers=\"$(value record_answer_text)\"\nrecord_equal=\"$(value record_answer_equal_decisions)\"\nscreen_nudges=\"$(value screen_nudges)\"\nnudge_value=\"$(value nudge_value)\"\ncase \"$stage\" in\n  S0)\n    mkdir -p \"$RUN/baseline\"\n    git -C \"$CONVERSATION_REPO_ROOT\" status --short --ignored specs .skilled/skills/.state > \"$TURN/repo-status.txt\"\n    cp \"$TURN/repo-status.txt\" \"$RUN/baseline/repo-status.txt\"\n    python3 - \"$CONVERSATION_REPO_ROOT/.skilled/skills/.state/decision-capture\" <<'PY' > \"$TURN/real-queue.sha256\"\nimport hashlib\nimport sys\nfrom pathlib import Path\np = Path(sys.argv[1])\nif not p.exists():\n    print('ABSENT')\nelse:\n    h = hashlib.sha256()\n    for item in sorted(x for x in p.rglob('*') if x.is_file()):\n        h.update(item.relative_to(p).as_posix().encode('utf-8'))\n        h.update(b'\\0')\n        h.update(item.read_bytes())\n    print(h.hexdigest())\nPY\n    cp \"$TURN/real-queue.sha256\" \"$RUN/baseline/real-queue.sha256\"\n    printf '%s\\n' \"$(value level)\" > \"$RUN/baseline/SPECKIT_LEVEL\"\n    printf '%s\\n' \"$consumed_lines\" > \"$RUN/consumed-before.count\"\n    if [ \"$queue_lines\" != 0 ] || [ \"$(value queue_files)\" != 0 ]; then deviation 'scratch queue is not empty at baseline' \"stage=S0 queue_files=$(value queue_files) queue_lines=$queue_lines\"; fi\n    finish \"stage=S0 baseline=saved scratch_queue_files=$(value queue_files) scratch_queue_rows=$queue_lines real_queue_sha=$(cat \"$TURN/real-queue.sha256\")\" 0\n    ;;\n  S1)\n    if [ \"$(value screen_gate3)\" != 1 ]; then deviation 'Gate 3 process question is not visible in screen.txt' \"stage=S1 screen_gate3=$(value screen_gate3) queue_rows=$queue_lines\"; fi\n    if [ \"$queue_lines\" != 0 ] || [ \"$(value queue_process_matches)\" != 0 ]; then deviation 'Gate 3 process answer was captured in the queue' \"stage=S1 queue_rows=$queue_lines process_matches=$(value queue_process_matches)\"; fi\n    finish \"stage=S1 queue_rows=$queue_lines process_matches=$(value queue_process_matches) question_visible=$(value screen_gate3)\" 0\n    ;;\n  S2|S3|S4|S5|S7|S8-ask|S9-ask)\n    if [ \"$RUNTIME\" != claude-code ]; then skip_stage \"Stop-hook nudge is only installed for claude-code; runtime=$RUNTIME\" \"stage=$stage runtime=$RUNTIME\"; fi\n    case \"$stage\" in\n      S2)\n        if [ \"$(value queue_question_color)\" != 1 ]; then deviation 'subject did not ask the badge colour question' \"stage=S2 queue_rows=$queue_lines question=$queue_question_lc\"; fi\n        if [ \"$queue_lines\" != 1 ] || [ \"$queue_keys\" != 1 ] || [ \"$queue_answer\" != Amber ] || [ \"$screen_nudges\" != 1 ] || [ \"$nudge_value\" != 1 ]; then deviation 'colour answer, queue or nudge differs from the expected values' \"stage=S2 queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\"; fi\n        finish \"stage=S2 queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\" 0\n        ;;\n      S3)\n        case \"$queue_question_lc\" in *platform*) ;; *) deviation 'subject did not ask the platform question' \"stage=S3 queue_rows=$queue_lines question=$queue_question_lc\" ;; esac\n        answer_lc=\"$(printf '%s' \"$queue_answer\" | tr '[:upper:]' '[:lower:]')\"\n        case \"$answer_lc\" in *web*ios*android*|*web*android*ios*|*ios*web*android*|*ios*android*web*|*android*web*ios*|*android*ios*web*) ;; *) deviation 'platform answer does not contain Web, iOS and Android' \"stage=S3 queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer\" ;; esac\n        if [ \"$queue_lines\" != 2 ] || [ \"$queue_keys\" != 2 ] || [ \"$screen_nudges\" != 1 ] || [ \"$nudge_value\" != 2 ]; then deviation 'platform queue or nudge differs from the expected values' \"stage=S3 queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\"; fi\n        finish \"stage=S3 queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\" 0\n        ;;\n      S4)\n        case \"$queue_question_lc\" in *label*) ;; *) deviation 'subject did not ask for the badge label' \"stage=S4 queue_rows=$queue_lines question=$queue_question_lc\" ;; esac\n        if [ \"$queue_lines\" != 3 ] || [ \"$queue_keys\" != 3 ] || [ \"$queue_answer\" != 'Needs review' ] || [ \"$screen_nudges\" != 1 ] || [ \"$nudge_value\" != 3 ]; then deviation 'label answer, queue or nudge differs from the expected values' \"stage=S4 queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\"; fi\n        finish \"stage=S4 queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\" 0\n        ;;\n      S5)\n        if [ \"$(value screen_blink)\" != 1 ] || [ \"$(value screen_static_answer)\" != 1 ]; then deviation 'subject did not ask the plain blink question or the scripted reply is absent' \"stage=S5 screen_blink=$(value screen_blink) scripted_reply=$(value screen_static_answer)\"; fi\n        if [ \"$queue_lines\" != 3 ] || [ \"$screen_nudges\" != 0 ] || [ \"$nudge_value\" != 3 ]; then deviation 'plain chat answer changed the queue or nudge count' \"stage=S5 queue_rows=$queue_lines screen_nudges=$screen_nudges nudge_value=$nudge_value\"; fi\n        finish \"stage=S5 queue_rows=$queue_lines screen_nudges=$screen_nudges nudge_value=$nudge_value\" 0\n        ;;\n      S7)\n        case \"$queue_question_lc\" in *left*right*|*right*left*) ;; *) deviation 'subject did not ask the left or right question' \"stage=S7 queue_rows=$queue_lines question=$queue_question_lc\" ;; esac\n        if [ \"$queue_lines\" != 4 ] || [ \"$queue_keys\" != 4 ] || [ \"$queue_answer\" != Right ] || [ \"$screen_nudges\" != 1 ] || [ \"$nudge_value\" != 1 ]; then deviation 'position answer, queue or nudge differs from the expected values' \"stage=S7 queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\"; fi\n        printf '%s\\n' \"$queue_sha\" > \"$RUN/pre-compact.sha\"\n        finish \"stage=S7 queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\" 0\n        ;;\n      S8-ask)\n        case \"$queue_question_lc\" in *size*) ;; *) deviation 'subject did not ask the badge size question' \"stage=S8-ask queue_rows=$queue_lines question=$queue_question_lc\" ;; esac\n        if [ \"$queue_lines\" != 5 ] || [ \"$queue_keys\" != 5 ] || [ \"$queue_answer\" != Small ] || [ \"$screen_nudges\" != 1 ] || [ \"$nudge_value\" != 2 ]; then deviation 'size answer, queue or nudge differs from the expected values' \"stage=S8-ask queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\"; fi\n        printf '%s\\n' \"$queue_sha\" > \"$RUN/pre-restart.sha\"\n        finish \"stage=S8-ask queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges nudge_value=$nudge_value\" 0\n        ;;\n      S9-ask)\n        case \"$queue_question_lc\" in *tooltip*) ;; *) deviation 'subject did not ask the tooltip question' \"stage=S9-ask queue_rows=$queue_lines question=$queue_question_lc\" ;; esac\n        if [ \"$queue_lines\" != 6 ] || [ \"$queue_keys\" != 6 ] || [ \"$queue_answer\" != Yes ] || [ \"$screen_nudges\" != 1 ] || [ -z \"$(value session_id)\" ]; then deviation 'tooltip answer, queue, nudge or session id differs from the expected values' \"stage=S9-ask queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges session_id=$(value session_id)\"; fi\n        printf '%s\\n' \"$(value session_id)\" > \"$TURN/session-id.txt\"\n        finish \"stage=S9-ask queue_rows=$queue_lines keys=$queue_keys answer=$queue_answer screen_nudges=$screen_nudges session_id=$(value session_id)\" 0\n        ;;\n    esac\n    ;;\n  S6|S10)\n    expected_count=4\n    expected_growth=4\n    if [ \"$stage\" = S10 ]; then expected_count=7; expected_growth=3; fi\n    if [ \"$record_rows\" != \"$expected_count\" ] || [ \"$record_items\" != \"$expected_count\" ] || [ \"$consumed_lines\" != \"$expected_count\" ] || [ \"$consumed_keys\" != \"$expected_count\" ] || [ \"$record_process\" != 0 ] || [ \"$queue_pending\" != 0 ] || [ \"$nudge_value\" != 0 ]; then deviation 'save counts, process filter, pendingRecords or nudge value differs from the expected values' \"stage=$stage queue_rows=$queue_lines record_rows=$record_rows record_items=$record_items consumed_rows=$consumed_lines consumed_keys=$consumed_keys process_matches=$record_process pendingRecords=$queue_pending nudge_value=$nudge_value\"; fi\n    if [ \"$stage\" = S6 ]; then\n      prior=\"$(cat \"$RUN/consumed-before.count\" 2>/dev/null || printf 0)\"\n      if [ \"$(value level)\" != \"$(cat \"$RUN/baseline/SPECKIT_LEVEL\" 2>/dev/null)\" ]; then deviation 'SPECKIT_LEVEL changed during the save' \"stage=S6 level_before=$(cat \"$RUN/baseline/SPECKIT_LEVEL\" 2>/dev/null) level_after=$(value level)\"; fi\n    else\n      prior=\"$(cat \"$RUN/consumed-S6.count\" 2>/dev/null || printf 0)\"\n    fi\n    growth=$((consumed_lines - prior))\n    if [ \"$growth\" != \"$expected_growth\" ]; then deviation 'consumed row growth differs from the expected value' \"stage=$stage pendingRecords=$queue_pending consumed_row_growth=$growth expected_growth=$expected_growth\"; fi\n    if [ \"$stage\" = S6 ]; then\n      for expected in amber needs review 'no, keep it static.' web ios android; do case \"$record_answers\" in *\"$expected\"*) ;; *) deviation \"decision record is missing verbatim answer text: $expected\" \"stage=S6 record_answers=$record_answers\" ;; esac; done\n      if [ \"$queue_lines\" != 3 ] || [ \"$record_equal\" != 0 ]; then deviation 'S6 queue count or decided-versus-verbatim comparison differs from the expected value' \"stage=S6 queue_rows=$queue_lines decided_equals_answer=$record_equal\"; fi\n      printf '%s\\n' \"$consumed_lines\" > \"$RUN/consumed-S6.count\"\n      cp \"$RECORD\" \"$RUN/decision-record-S6.md\"\n    else\n      cp \"$RECORD\" \"$RUN/decision-record-S10.md\"\n    fi\n    finish \"stage=$stage queue_rows=$queue_lines record_rows=$record_rows record_items=$record_items consumed_rows=$consumed_lines pendingRecords=$queue_pending consumed_row_growth=$growth nudge_value=$nudge_value\" 0\n    ;;\n  S8-compact)\n    before=\"$(cat \"$RUN/pre-compact.sha\" 2>/dev/null || true)\"\n    if [ -z \"$before\" ] || [ \"$queue_sha\" != \"$before\" ]; then deviation 'queue hash changed during compaction or the pre-compaction hash is missing' \"stage=S8-compact queue_sha_before=$before queue_sha_after=$queue_sha\"; fi\n    printf '%s\\n' \"$queue_sha\" > \"$TURN/queue.sha256\"\n    printf '%s\\n' \"$queue_sha\" > \"$RUN/queue-S8-compact.sha\"\n    finish \"stage=S8-compact queue_sha=$queue_sha unchanged=true\" 0\n    ;;\n  S9-restart)\n    before=\"$(cat \"$RUN/pre-restart.sha\" 2>/dev/null || true)\"\n    if [ -z \"$before\" ] || [ \"$queue_sha\" != \"$before\" ] || [ \"$queue_lines\" != 5 ] || [ \"$queue_keys\" != 5 ]; then deviation 'queue changed during restart or the pre-restart state differs' \"stage=S9-restart queue_sha_before=$before queue_sha_after=$queue_sha queue_rows=$queue_lines keys=$queue_keys\"; fi\n    printf '%s\\n' \"$queue_sha\" > \"$TURN/queue.sha256\"\n    finish \"stage=S9-restart queue_rows=$queue_lines keys=$queue_keys queue_sha=$queue_sha unchanged=true\" 0\n    ;;\n  S11)\n    if [ ! -f \"$RUN/decision-record-S10.md\" ] || ! cmp -s \"$RUN/decision-record-S10.md\" \"$RECORD\"; then deviation 'repeat save changed decision-record.md or the S10 snapshot is missing' 'stage=S11 cmp=failed'; fi\n    if [ \"$consumed_lines\" != 7 ] || [ \"$screen_nudges\" != 0 ] || [ \"$nudge_value\" != 0 ]; then deviation 'repeat save changed the consumed or nudge count' \"stage=S11 consumed_rows=$consumed_lines screen_nudges=$screen_nudges nudge_value=$nudge_value\"; fi\n    finish \"stage=S11 cmp=0 consumed_rows=$consumed_lines screen_nudges=$screen_nudges\" 0\n    ;;\n  *) deviation 'unknown stage id' \"stage=$stage\" ;;\nesac\nBASH\nchmod +x .conversation-check.sh"
  ],
  "turns": [
    {
      "id": "S0",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "bash .conversation-check.sh S0"
    },
    {
      "id": "S1",
      "send": "Add a status badge to the demo widget in this project. Ask me product questions only when I tell you to.",
      "delay_ms": [
        5000,
        15000
      ],
      "questions": [
        {
          "match": "([Ss]pec folder|[Gg]ate 3|which .*folder)",
          "answer": {
            "reply": "A) Existing, specs/demo/001-demo"
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "bash .conversation-check.sh S1"
    },
    {
      "id": "S2",
      "send": "Before you write anything, ask me with your question tool which colour the badge uses. One choice.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "[Cc]olou?r",
          "answer": {
            "select": [
              "Amber"
            ]
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "bash .conversation-check.sh S2"
    },
    {
      "id": "S3",
      "send": "Now ask me which platforms the badge must support. Let me pick several.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": ".*platform",
          "answer": {
            "select": [
              "Web",
              "iOS",
              "Android"
            ],
            "multi": true
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "bash .conversation-check.sh S3"
    },
    {
      "id": "S4",
      "send": "Ask me for the badge label with a few options. I will type my own.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "[Ll]abel",
          "answer": {
            "other": "Needs review"
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "bash .conversation-check.sh S4"
    },
    {
      "id": "S5",
      "send": "Do not use the tool this time. End your reply with one plain question to me about whether the badge should blink.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "[Bb]link",
          "answer": {
            "reply": "No, keep it static."
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "bash .conversation-check.sh S5"
    },
    {
      "id": "S6",
      "send": "/speckit:save specs/demo/001-demo --full-auto",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "bash .conversation-check.sh S6"
    },
    {
      "id": "S7",
      "send": "Ask me with the tool whether the badge sits left or right of the title.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "([Ll]eft|[Rr]ight)",
          "answer": {
            "select": [
              "Right"
            ]
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "bash .conversation-check.sh S7"
    },
    {
      "id": "S8-compact",
      "action": "compact",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "bash .conversation-check.sh S8-compact"
    },
    {
      "id": "S8-ask",
      "send": "Ask me with the tool which size the badge uses.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "[Ss]ize",
          "answer": {
            "select": [
              "Small"
            ]
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "bash .conversation-check.sh S8-ask"
    },
    {
      "id": "S9-restart",
      "action": "restart",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "bash .conversation-check.sh S9-restart"
    },
    {
      "id": "S9-ask",
      "send": "Ask me with the tool whether the badge has a tooltip.",
      "delay_ms": [
        5000,
        15000
      ],
      "retry": 1,
      "questions": [
        {
          "match": "[Tt]ooltip",
          "answer": {
            "select": [
              "Yes"
            ]
          },
          "delay_ms": [
            3000,
            8000
          ]
        }
      ],
      "check": "bash .conversation-check.sh S9-ask"
    },
    {
      "id": "S10",
      "send": "/speckit:save specs/demo/001-demo --full-auto",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "bash .conversation-check.sh S10"
    },
    {
      "id": "S11",
      "send": "/speckit:save specs/demo/001-demo --full-auto",
      "delay_ms": [
        5000,
        15000
      ],
      "check": "bash .conversation-check.sh S11"
    }
  ]
}
```

### Runtime Matrix

Record one row per runtime with these columns: Runtime, CLI version, Model, Question tool (AskUserQuestion, question, request_user_input, ask-user-question, ask_user_question or no answer surface), Answer path (live hook, save-time sweep or none), S1 to S12 (each PASS, FAIL or SKIP with one reason), Nudge sequence observed, Verdict, Evidence folder.

### Checkpoint Derivation

For each runtime, derive the 13-row checkpoints.tsv from the runner's main run and the separate kill-switch run. Copy the main-run rows for S0 to S7 and S9 to S11, merge S8-compact and S8-ask into one S8 row with both evidence paths and observed values, then append S12 from the kill-switch run. Keep the columns stage, status, evidence path and observed value.

### Stage Marks and Siblings

A subject deviation is FAIL and quotes the DEVIATION line. A stage that does not apply is SKIP with its first-line blocker. The checks read CONVERSATION_RUNTIME; for runtimes other than claude-code, the live hook and Stop nudge checks exit 77 with a blocker that names the runtime. The runtime matrix records those nudge cells as SKIP until a sibling adds that surface.

The sibling folders are specs/system-speckit/043-decision-capture/002-table-row-matching, specs/system-speckit/043-decision-capture/003-codex-and-pi-capture, specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture and specs/system-speckit/043-decision-capture/005-chat-question-detection. Each sibling adds stages as S13 and up or a variant such as S5b, never renumbers, and appends a matrix row with the commit it tests.

### Commands

1. Run the scenario once for each runtime with the 065 runner, recording its seed and model.
2. Run the kill-switch scenario separately for the same runtime and scratch-project isolation.
3. Preserve each runner turn folder, the queue and consumed copies, nudge files, decision-record copies, the real-repository baseline and the final repository snapshot.
4. Derive the 13-row checkpoints.tsv and append the runtime matrix row from the two runs.

### Expected

S0 captures the real repository status and queue hash before the conversation. S1 captures the Gate 3 question in screen.txt while the scratch queue remains empty. S2 to S4 create one queue row each. S5 adds the static badge answer through the plain chat transcript without changing the queue. S6 consumes four product answers, leaves the three hook rows in the queue, and clears the nudge. S7 to S9 add the remaining three answers, with the queue hash stable across compaction and restart. S10 writes seven rows and seven appendix items. S11 is byte-identical to the S10 record.

### Evidence

Keep the runner's screen.txt, question captures, check output and exit code for every turn. Each check copies current queue JSONL files, consumed.jsonl, nudge files and decision-record.md into CONVERSATION_TURN_DIR; S0 also saves the real repository status and decision-capture content hash there. The runner's checkpoint row records turn id, status, attempts, evidence folder and the check's final observed-value line.

### Pass / Fail

- **Pass**: Every applicable check matches the Stage Table, the S8 compaction and S9 restart preserve the queue hash, S6 and S10 report pendingRecords=0, and S11's record comparison exits 0.
- **Fail**: A check prints DEVIATION, a question or answer differs from the script, a queue key is duplicated, a save omits or duplicates an answer, a nudge count differs, the repeated record changes, or the real repository status or queue hash differs from its baseline.
- **Skip**: A stage cannot apply on the runtime and the check prints its blocker as the first output line before the observed value.

### Failure Triage

1. If a check prints DEVIATION, quote that line in the runtime row, retain both retry attempts when the turn has retry 1, and mark the stage FAIL.
2. S3 uses three plausible labels, Web, iOS and Android. The labels in answer.select must match what the subject offers; if the offered labels differ, update the scripted labels to their exact text before running.
3. If the runner cannot answer a question because the runtime has no answer surface, keep pane or transcript evidence and record no answer surface in the matrix. Do not record a successful answer.
4. The Stop nudge is Claude-only. For a runtime other than claude-code, the check reads CONVERSATION_RUNTIME, prints a first line naming the blocker and exits 77. Record the nudge cell as SKIP with that blocker, as documented by .skilled/hooks/README.md.
5. If S6 or S10 reports nonzero pendingRecords, compare queue keys to consumed.jsonl before treating the save as successful. If S11 differs, retain both decision-record copies and the comparison output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root playbook and scenario index |
| [operator-decision-capture](../../feature-catalog/ux-hooks/operator-decision-capture.md) | Feature contract for operator decision capture |

### Implementation And Test Anchors

| File | Role |
|---|---|
| specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md section 3 | Stage values, scratch project, evidence store, runtime matrix and sibling rule |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md REQ-001 to REQ-013 | Conversation, capture, save, kill-switch and matrix requirements |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md | JSON conversation schema and turn outcomes |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Stop nudge text and behavior |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Decision rows, verbatim appendix and consumed keys |

Provenance: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-live-conversation
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/decision-capture-live-conversation.md

