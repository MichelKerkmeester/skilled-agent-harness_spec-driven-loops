---
title: "Implementation Summary: Phase 6: codex-persona-tool-mapping"
description: "The Codex dispatch rule now requires a tool-mapping line above an inlined persona, the canonical persona contract states it for every CLI, and two live read-only runs read their file."
trigger_phrases:
  - "codex persona tool mapping implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/006-codex-persona-tool-mapping"
    last_updated_at: "2026-11-14T14:16:38Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 6 with all seven acceptance rows Met"
    next_safe_action: "Review the six phases on the local branch and decide whether to merge"
    packet_purpose: "Purpose: A Codex child given any agent persona knows which of its own tools stand in for the persona's, so a read-only persona still reads and a silent empty run cannot pass as done."
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-codex/SKILL.md"
      - ".skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md"
    session_dedup:
      fingerprint: "sha256:08a1168f3081e3eb2dcb5a349a208223f5ae71e7f6a694a4d61a7d9e4347c6f7"
      session_id: "7b3d8afd-85b7-4568-b947-3f44f177431d"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "7b3d8afd-85b7-4568-b947-3f44f177431d"
      workspace: "/Users/michelkerkmeester/worktrees/public/377-agent-contract-and-registry-alignment"
      savedAt: "2026-11-14T14:16:38Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-codex-persona-tool-mapping |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An orchestrator composing a Codex dispatch is now told to put a tool-mapping line above the inlined persona, and how to catch a run that read nothing. The agent personas name Claude Code tools, and `codex exec` has only its shell.

### The rule and its text

Rule 17 of `cli-codex/SKILL.md` gained one bullet. It requires the line directly above the inlined persona and holds the 52-word text to copy. The text maps Read to `cat` or `sed -n`, Grep to `rg` and Glob to `find` or `ls`, allows `wc`, and ends `Run no other command.` It names read commands only.

### The failure signature

The dispatch gotchas went from five to six. The new one says a read-only dispatch can exit 0 having read nothing, names the run observed on codex-cli 0.167.2 whose report ended `FILES READ: none`, and tells the orchestrator to ask for a `FILES READ:` line and treat an empty one as a failed dispatch.

### The canonical contract

Section 6.3 of `sk-prompt/assets/cli-prompt-quality-card.md` gained one paragraph. It requires a tool-mapping line above the persona block wherever the child's tools differ from the names the persona uses, and points at Rule 17 for the Codex text.

### Version

The packet went from 1.9.15.1 to 1.9.16.0 with a matching changelog entry. The hub's version did not move, because the hub rule binds it to the hub's own changelog.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modified | Rule 17, the sixth gotcha and the version |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modified | The tool-mapping paragraph in section 6.3 |
| `.skilled/skills/cli-external-orchestration/cli-codex/changelog/v1.9.16.0.md` | Created | The release entry |
| Two compiled-routing `manifest.json` files for the hub | Regenerated | The commit gate re-mints the route hash when a skill file in the hub changes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrating session read the Codex skill, the canonical card and the six other mode packets, and saved the baseline and a table of the other modes. It ran the two live Codex dispatches itself through `codex exec`, on `gpt-6-luna` at medium on the fast tier with `--sandbox read-only`. It ran them before the rule text was written, so a failing mapping line could still have changed the text.

It then computed the expected content of the three files. DeepSeek V4.1 Flash at max, through `cli-opencode` on the LLM Gateway route, made the changes in three dispatches, and each was accepted only when the file equalled its expected file byte for byte. All three were accepted on the first run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The rule is kept although the control run read its file | The spec named this outcome as a risk and rests the rule on the one failure observed on codex-cli 0.167.2. The rule text and the changelog both call the failure intermittent |
| The literal text lives in `cli-codex/SKILL.md` and the card states the general rule | The words are specific to a runtime with only a shell. The card serves seven modes and three of them have a native persona surface |
| The mapping text names read commands only | Phase decision D1. A dispatch that writes states its write surface in the task |
| The hub version stays at 2.0.0.0 | The hub's version rule binds it to the hub's changelog, and the last cli-codex release left it unchanged too |
| The probes ran before the documents changed | A probe that showed the line not working would have changed the text, and the documents would have needed a second edit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Acceptance criteria | 7 of 7 `Met`, none waived, see `acceptance-criteria.md` |
| `tasks.md` checklist | Every P0 and P1 item checked with its output. The one P2 item is deferred with its reason |
| Probe with the mapping line, codex-cli 0.169.0 | Report ends `FILES READ: .skilled/agents/README.txt`. One command run, `cat` on that file |
| Control without the line, same version | Report ends `FILES READ: .skilled/agents/README.txt`. Two commands run, the trigger-index lookup and `cat` |
| Each changed file against its expected file, `cmp` | Three files identical |
| `rg -c -i 'tool mapping'` on the skill file and on the card | 1 and 1, both 0 before |
| `rg -c 'FILES READ: none' cli-codex/SKILL.md` | 2, 0 before |
| `ci-hub-vocabulary-source.cjs --hub cli-external-orchestration` | `checked=1 hub(s), drift=0`, `RESULT: PASSED`, exit 0 |
| `frontmatter-version.mjs verify --skill cli-external-orchestration` | `440 files | ok=440`, exit 0 |
| `check-prompt-quality-card-sync.sh` | `GUARD PASS`, exit 0 |
| Agent files changed in this phase | None |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The failure did not reproduce.** On codex-cli 0.169.0 the prompt without the mapping line read its file. The rule rests on one run observed on 0.167.2, and nothing here shows the line prevents that failure.
2. **One run each way.** With the line the child ran the one read command. Without it the child also ran a `node` lookup script. That is one sample each, so it suggests the line narrows what the child runs and does not prove it.
3. **`cli-deepseek-harness` may need the same line.** Its documents name no read tool. No run confirmed a failure, so it is a follow-up and not a change.
4. **The deep-loop runner inlines a persona for a Codex executor with no mapping line.** `agentPersonaBlock` in `fanout-run.cjs` is a consumer the plan listed as not one. The runner is out of this phase's scope.
5. **The other five modes were read, not run.** The table in `scratch/other-modes.md` comes from each mode's documents.
6. **`cli-codex/README.md` was not changed.** It does not describe persona injection, so the P2 item had no passage to extend.
<!-- /ANCHOR:limitations -->

---
