---
title: "DOC-409 -- Doctor update apply conversation"
description: "Conversation scenario validating declined and approved release apply turns, their writes and the recorded rollback path."
version: 1.0.0.0
---

# DOC-409 -- Doctor update apply conversation

## 1. OVERVIEW

This scenario clones the shared doctor update fixture into the runner scratch project. It declines an apply plan, confirms the fixture stays unchanged, approves the same plan, records the rebuild choice and restores the fixture. If the shared fixture is absent, the checks record SKIP.

### Why This Matters

Release apply must wait for approval, write only the planned paths and keep a rollback record that restores the disposable fixture.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for DOC-409 and inspect the plan, declined state, approved writes and rollback result.

- Objective: Prove a declined apply writes no release-managed files, an approved apply writes only the planned paths with a rollback record, the post-apply battery and rebuild prompt run in order, and rollback restores the target paths.
- Real user request: `Apply the release update I aligned, keep a rollback path and restore this fixture after the check.`
- Prompt: `/doctor:update apply --decisions=.skilled/release/runs/doctor-apply-conversation/decisions.json --release=v4.0.0.2 --offline --scope=skill:sk-code/sk-code-webflow,skill:sk-git`
- Preconditions: The shared fixture .worktrees/.doctor-update-test-environment must exist and be clean. It contains release v4.0.0.2 and its committed base. Setup exits 77 with a one-line reason when the fixture is absent or when the OpenCode CLI or project configuration is unavailable. Node, git and the selected runtime CLI must be available.
- Expected execution process: Clone the fixture into scratch, prepare an alignment run with the three Webflow decisions and deferred skill:sk-git, then run the decline, approval, rebuild-choice and rollback sequence on Claude Code and OpenCode.
- Expected signals: Each runtime shows the two Webflow changelogs and the release base and divergence records, while marking skill:sk-git as deferred. No leaves release-managed files changed. Approval completes the post-apply battery and offers the rebuild choice before STATUS=APPLIED. Answering no records reindex as skipped and the stale-index warning. rollback.json names all four planned paths, the apply lock is absent and rollback restores the target paths.
- Desired user-visible outcome: The operator sees the complete plan before deciding, gets a retained rollback path after approval and leaves the scratch fixture at its starting content.
- Pass/fail: PASS when every requested runtime passes, the decline writes no release-managed files, approval writes only the planned paths with a rollback record, the rebuild choice is recorded as skipped and rollback restores the target-path baseline. SKIP when the shared fixture is absent or OpenCode and its project configuration are unavailable. FAIL when a decline writes, a write falls outside the plan, the rollback record is missing or rollback leaves a target changed.
- Classification: Manual scenario. Record PASS, FAIL or SKIP for each requested runtime with a specific runtime or sandbox blocker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `/doctor:update apply --decisions=.skilled/release/runs/doctor-apply-conversation/decisions.json --release=v4.0.0.2 --offline --scope=skill:sk-code/sk-code-webflow,skill:sk-git`

### Conversation Script

```json conversation
{
  "runtimes": ["claude-code", "opencode"],
  "setup": [
    "if [ ! -d \"$CONVERSATION_REPO_ROOT/.worktrees/.doctor-update-test-environment\" ]; then printf '%s\\n' 'SKIP: shared fixture .worktrees/.doctor-update-test-environment is missing'; exit 77; fi",
    "find . -mindepth 1 -maxdepth 1 ! -name .conversation-scratch -exec rm -rf {} + && rm -f .conversation-scratch && git clone --no-hardlinks \"$CONVERSATION_REPO_ROOT/.worktrees/.doctor-update-test-environment\" .",
    "rm -rf .skilled && cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "case \"$CONVERSATION_RUNTIME\" in\n  claude-code)\n    if [ -d \"$CONVERSATION_REPO_ROOT/.claude\" ]; then rm -rf .claude && cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude; fi\n    ;;\n  opencode)\n    if ! command -v opencode >/dev/null 2>&1; then printf '%s\\n' 'SKIP: OpenCode CLI unavailable'; exit 77; fi\n    if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode\" ]; then printf '%s\\n' 'SKIP: OpenCode project configuration unavailable'; exit 77; fi\n    cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json && rm -rf .opencode && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode\n    ;;\n  *)\n    printf '%s\\n' \"Unsupported runtime: $CONVERSATION_RUNTIME\" >&2\n    exit 2\n    ;;\nesac",
    "test ! -e .skilled/release/.apply.lock && test ! -e .skilled/release/runs/doctor-apply-conversation && node .skilled/commands/doctor/scripts/release-update.cjs align --repo . --release v4.0.0.2 --offline --scope skill:sk-code/sk-code-webflow,skill:sk-git --out .skilled/release/runs/doctor-apply-conversation --json > ../doctor-update-align.json && node .skilled/commands/doctor/scripts/release-update.cjs decide --repo . --run .skilled/release/runs/doctor-apply-conversation --path .skilled/skills/sk-code/sk-code-webflow/SKILL.md --decision keep-local --json && node .skilled/commands/doctor/scripts/release-update.cjs decide --repo . --run .skilled/release/runs/doctor-apply-conversation --path .skilled/skills/sk-code/sk-code-webflow/changelog/v1.0.0.0.md --decision adopt-release --json && node .skilled/commands/doctor/scripts/release-update.cjs decide --repo . --run .skilled/release/runs/doctor-apply-conversation --path .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.0.0.md --decision adopt-release --json && node .skilled/commands/doctor/scripts/release-update.cjs decide --repo . --run .skilled/release/runs/doctor-apply-conversation --unit skill:sk-git --defer --json && shasum -a 256 .skilled/skills/sk-code/sk-code-webflow/changelog/v1.0.0.0.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.0.0.md .skilled/release/base.json > ../doctor-update-before.sha256 && git status --porcelain -- .skilled/release/base.json .skilled/release/divergence.json .skilled/skills/sk-code/sk-code-webflow/changelog/v1.0.0.0.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.0.0.md > ../doctor-update-status-before.txt && git status --porcelain --untracked-files=all | cut -c4- | sort > ../doctor-update-paths-before.txt"
  ],
  "turns": [
    {
      "id": "declined-plan",
      "send": "/doctor:update apply --decisions=.skilled/release/runs/doctor-apply-conversation/decisions.json --release=v4.0.0.2 --offline --scope=skill:sk-code/sk-code-webflow,skill:sk-git",
      "questions": [{"match": "[Ss]pec[- ]folder|documentation[ -]scope","answer": {"reply": "D"},"optional": true},{"match": "[Ss]elect","answer": {"select": ["select"]},"optional": true}],
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ /doctor:update apply\") { after=1; plan=0; unit=0; deferred=0; next } after && index($0, \"Release Apply Plan\") { plan=1 } after && index($0, \"skill:sk-git\") { unit=1 } after && index($0, \"deferred\") { deferred=1 } END { exit !(after && plan && unit && deferred) }' \"$CONVERSATION_TURN_DIR/history.txt\"; else grep -Fq 'Reply yes to approve the planned writes' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi && grep -Fq '.skilled/skills/sk-code/sk-code-webflow/changelog/v1.0.0.0.md' .skilled/release/runs/doctor-apply-conversation/plan.json && grep -Fq '.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.0.0.md' .skilled/release/runs/doctor-apply-conversation/plan.json && grep -Fq '.skilled/release/base.json' .skilled/release/runs/doctor-apply-conversation/plan.json && grep -Fq '.skilled/release/divergence.json' .skilled/release/runs/doctor-apply-conversation/plan.json && grep -Fq 'skill:sk-git' .skilled/release/runs/doctor-apply-conversation/decisions.json && shasum -a 256 -c ../doctor-update-before.sha256 && test ! -e .skilled/release/.apply.lock && test ! -e .skilled/release/runs/doctor-apply-conversation/rollback.json"
    },
    {
      "id": "decline",
      "send": "no",
      "questions": [{"match": "[Ss]pec[- ]folder|documentation[ -]scope","answer": {"reply": "D"},"optional": true},{"match": "[Ss]elect","answer": {"select": ["select"]},"optional": true}],
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ no\") { after=1; status=0; next } after && index($0, \"STATUS=DECLINED\") { status=1 } END { exit !(after && status) }' \"$CONVERSATION_TURN_DIR/history.txt\"; else grep -Fq 'STATUS=DECLINED' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi && shasum -a 256 -c ../doctor-update-before.sha256 && test ! -e .skilled/release/.apply.lock && test ! -e .skilled/release/runs/doctor-apply-conversation/rollback.json"
    },
    {
      "id": "approved-plan",
      "send": "/doctor:update apply --decisions=.skilled/release/runs/doctor-apply-conversation/decisions.json --release=v4.0.0.2 --offline --scope=skill:sk-code/sk-code-webflow,skill:sk-git",
      "questions": [{"match": "[Ss]pec[- ]folder|documentation[ -]scope","answer": {"reply": "D"},"optional": true},{"match": "[Ss]elect","answer": {"select": ["select"]},"optional": true}],
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ /doctor:update apply\") { after=1; plan=0; next } after && index($0, \"Release Apply Plan\") { plan=1 } END { exit !(after && plan) }' \"$CONVERSATION_TURN_DIR/history.txt\"; else grep -Fq 'Reply yes to approve the planned writes' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi && grep -Fq '.skilled/skills/sk-code/sk-code-webflow/changelog/v1.0.0.0.md' .skilled/release/runs/doctor-apply-conversation/plan.json && grep -Fq '.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.0.0.md' .skilled/release/runs/doctor-apply-conversation/plan.json && grep -Fq '.skilled/release/base.json' .skilled/release/runs/doctor-apply-conversation/plan.json && grep -Fq '.skilled/release/divergence.json' .skilled/release/runs/doctor-apply-conversation/plan.json && grep -Fq 'skill:sk-git' .skilled/release/runs/doctor-apply-conversation/decisions.json && shasum -a 256 -c ../doctor-update-before.sha256 && test ! -e .skilled/release/runs/doctor-apply-conversation/rollback.json"
    },
    {
      "id": "approve-apply",
      "send": "yes",
      "questions": [{"match": "[Ss]pec[- ]folder|documentation[ -]scope","answer": {"reply": "D"},"optional": true},{"match": "[Ss]elect","answer": {"select": ["select"]},"optional": true}],
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ yes\") { after=1; status=0; next } after && index($0, \"STATUS=APPLIED\") { status=1 } END { exit !(after && status) }' \"$CONVERSATION_TURN_DIR/history.txt\"; else grep -Fq 'STATUS=APPLIED' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi && test -s .skilled/release/runs/doctor-apply-conversation/rollback.json && grep -Fq '.skilled/skills/sk-code/sk-code-webflow/changelog/v1.0.0.0.md' .skilled/release/runs/doctor-apply-conversation/rollback.json && grep -Fq '.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.0.0.md' .skilled/release/runs/doctor-apply-conversation/rollback.json && grep -Fq '.skilled/release/base.json' .skilled/release/runs/doctor-apply-conversation/rollback.json && grep -Fq '.skilled/release/divergence.json' .skilled/release/runs/doctor-apply-conversation/rollback.json && test ! -e .skilled/release/.apply.lock && git status --porcelain --untracked-files=all | cut -c4- | sort > ../doctor-update-paths-after.txt && comm -13 ../doctor-update-paths-before.txt ../doctor-update-paths-after.txt > ../doctor-update-paths-added.txt && test -z \"$(grep -vE '^(\\.skilled/release/runs/.*|\\.skilled/release/base\\.json|\\.skilled/release/divergence\\.json|\\.skilled/skills/sk-code/sk-code-webflow/changelog/v1\\.0\\.0\\.0\\.md|\\.skilled/skills/sk-code/sk-code-webflow/changelog/v1\\.1\\.0\\.0\\.md)$' ../doctor-update-paths-added.txt)\" && grep -Fq '.skilled/release/base.json' ../doctor-update-paths-after.txt && grep -Fq '.skilled/release/divergence.json' ../doctor-update-paths-after.txt && grep -Fq '.skilled/skills/sk-code/sk-code-webflow/changelog/v1.0.0.0.md' ../doctor-update-paths-after.txt && grep -Fq '.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.0.0.md' ../doctor-update-paths-after.txt"
    },
    {
      "id": "skip-advisor-rebuild",
      "send": "no",
      "questions": [{"match": "[Ss]pec[- ]folder|documentation[ -]scope","answer": {"reply": "D"},"optional": true},{"match": "[Ss]elect","answer": {"select": ["select"]},"optional": true}],
      "check": "grep -Fq 'skipped' .skilled/release/runs/.doctor-update.last-run.json && test -s .skilled/release/runs/doctor-apply-conversation/rollback.json && test ! -e .skilled/release/.apply.lock"
    },
    {
      "id": "rollback-plan",
      "send": "/doctor:update rollback --run=.skilled/release/runs/doctor-apply-conversation",
      "questions": [{"match": "[Ss]pec[- ]folder|documentation[ -]scope","answer": {"reply": "D"},"optional": true},{"match": "[Ss]elect","answer": {"select": ["select"]},"optional": true}],
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ /doctor:update rollback\") { after=1; preview=0; next } after && index($0, \"Release Rollback Preview\") { preview=1 } END { exit !(after && preview) }' \"$CONVERSATION_TURN_DIR/history.txt\"; else grep -Fq 'Reply yes to approve the rollback' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi && test -s .skilled/release/runs/doctor-apply-conversation/rollback.json"
    },
    {
      "id": "rollback",
      "send": "yes",
      "questions": [{"match": "[Ss]pec[- ]folder|documentation[ -]scope","answer": {"reply": "D"},"optional": true},{"match": "[Ss]elect","answer": {"select": ["select"]},"optional": true}],
      "check": "if [ \"$CONVERSATION_RUNTIME\" = \"claude-code\" ]; then awk 'index($0, \"❯ yes\") { after=1; status=0; next } after && index($0, \"STATUS=ROLLED_BACK\") { status=1 } END { exit !(after && status) }' \"$CONVERSATION_TURN_DIR/history.txt\"; else grep -Fq 'STATUS=ROLLED_BACK' \"$CONVERSATION_TURN_DIR/screen.txt\"; fi && shasum -a 256 -c ../doctor-update-before.sha256 && test ! -e .skilled/release/divergence.json && test ! -e .skilled/release/.apply.lock && git status --porcelain -- .skilled/release/base.json .skilled/release/divergence.json .skilled/skills/sk-code/sk-code-webflow/changelog/v1.0.0.0.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.0.0.md | diff - ../doctor-update-status-before.txt"
    }
  ]
}
```

- The first send matches the Prompt line. Setup runs once per runtime, exits 77 with a one-line reason when its required precondition is missing, and records the alignment checksums, status lines and changed-path baseline. Setup copies .claude for Claude Code. For OpenCode it copies opencode.json and .opencode.
- Claude Code plan and rollback checks read history.txt after the echoed send. OpenCode plan and rollback-preview checks read the final approval prompt from screen.txt. Its decline, apply and rollback checks read final status lines from screen.txt. Both runtimes also check plan.json, decisions.json, checksums, rollback.json, the lock and scratch Git state.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md --runtime claude-code,opencode --scratch <fresh-scratch-outside-repository> --out <evidence-directory>`

### Expected

Both runtime runs must leave the fixture checksums unchanged after no, apply only the four planned paths plus workflow run-state records after yes, and release the apply lock. The rebuild choice records reindex as skipped. The final rollback restores the four paths' starting content and Git status. The run skips if the shared fixture is missing or OpenCode setup cannot find its CLI or project configuration.

### Evidence

- Claude Code: history.txt plan, decline, apply and rollback status checks after the echoed send.
- OpenCode: screen.txt final-frame approval prompts and decline, apply and rollback status lines.
- Both runtimes: plan.json and decisions.json, the declined and approved checksums, rollback.json, the apply lock and the Git path snapshots.
- The rebuild turn: .skilled/release/runs/.doctor-update.last-run.json, rollback.json and the lock state.

### Pass / Fail

- **Pass**: Every requested runtime passes each turn. The decline changes no release-managed path, approval changes only the four planned paths plus workflow run-state records, rollback.json names them and rollback restores the fixture.
- **Skip**: The shared fixture is absent, or OpenCode and its project configuration are unavailable.
- **Fail**: Any runtime reports the wrong status, the decline writes, approval changes an unplanned path, rollback data is missing, the lock remains or rollback does not restore the baseline.

### Failure Triage

If the plan differs, inspect the alignment decisions in `.skilled/release/runs/doctor-apply-conversation/decisions.json`. If the rollback record omits a written path, inspect `release-update.cjs` write order. If a checksum differs after rollback, inspect the engine rollback result and its skipped paths.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Existing command-level scenario: [DOC-359](doctor-update-apply.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../commands/doctor/update.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-update-apply.yaml](../../commands/doctor/assets/doctor-update-apply.yaml)
- Release engine: [.skilled/commands/doctor/scripts/release-update.cjs](../../commands/doctor/scripts/release-update.cjs)
- Fixture guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:update apply

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-409
- Feature name: Doctor update apply conversation
- Command mode: `/doctor:update apply`
- Mutation boundary: Release writes and rollback run only inside the disposable scratch clone.
- Feature file path: `doctor-commands/doctor-update-apply-conversation.md`
