---
title: "Decision Record: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "027-ask-surface-enforcement operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/003-ask-surface-enforcement"
    last_updated_at: "2026-11-08T10:45:01.230Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the prose-menu failure with both a turn-end hook and rule-text changes. | Rule text alone is what already failed. | None | REQ-001, REQ-002, REQ-003, plan.md |
| Q002 | Run the DeepSeek v4.1 flash research on the opencode-go provider after DevPass ran out of credit. | DevPass returned a 402 credit-limit error until 11/10, and opencode-go serves the same model. | None | research/fanout.json, research/lineages/deepseek/ |
| Q003 | Build enforcing guards for Claude Code, DSH, OpenCode and Pi, with advisory Codex and Devin adapters, planned first. | Not stated. | None | REQ-002, REQ-004, REQ-005, tasks.md T009-T013 |
| Q004 | Write the ask-surface conversation scenarios and run the full matrix on Claude Code, OpenCode, Pi and Devin, leaving Codex out for lack of usage. | No Codex usage is available; only opencode-go and the GPT provider through cli-codex, OpenCode, Pi and Devin. | None | tasks.md T020-T022, scratch/live-runs/, the 2026-11-08 ask-surface-guard run report |
| Q005 | Run the alignment check over this work's 67 files, narrowed from the 7,880-file HEAD scope that held other sessions' changes. | Not stated. | None | tasks.md T026, the 20261108T130844Z alignment run |
| Q006 | Run the four alignment review lanes and the critic on opencode-go DeepSeek V4.1 Flash max. | Not stated. | None | tasks.md T026, the 20261108T130844Z alignment run |
| Q007 | Fix every alignment finding: the three guard defects and all the doc gaps. | Not stated. Evidence: yes_no, option false, overlap 1, imperative true, shift false. | None | tasks.md T023-T027, AC-008 |
| Q008 | Rebuild the v4.0.2.0 GitHub release body from the amended entry and publish it, leaving the tag in place. | Not stated. | None | T029, .skilled/changelog/skilled/v4.0.2.0.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01E7Z62j6cVurTE5iFSKnX8m:1 -->

Question:
```text
How far should the fix go?
```

Options:
```text
Hook + rule text (Recommended)
Rule text only
Hook only
```

Answer:
```text
Hook + rule text (Recommended)
```

### Q002
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01W5kDMdQRzSbAMGxzJorQyF:0 -->

Question:
```text
DevPass (llmgateway) is out of credit until 11/10, so the DeepSeek v4.1 flash research run never started. How should the 5-iteration run go?
```

Options:
```text
opencode-go route (Recommended)
DeepSeek Harness (dsh)
Wait for 11/10 renewal
```

Answer:
```text
opencode-go route (Recommended)
```

### Q003
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01S6251BbqiRUSaoirBiUr7M:0 -->

Question:
```text
The research is done. How much of the ask-surface plan should I build now in specs/hooks-plugins-extensions/session-turn-boundaries/003-ask-surface-enforcement?
```

Options:
```text
All four enforcing runtimes (Recommended)
Rule text + Claude guard first
Plan only
```

Answer:
```text
All four enforcing runtimes (Recommended)
```

### Q004
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01M8AHikJLUd8nezqH3KNe3r:1 -->

Question:
```text
The sk-doc playbook's conversation runner can drive a real subject runtime and fails a turn whose scripted `select` answer finds no question-tool dialog. I can write ask-surface scenarios with it: (1) a bait turn ending in a menu that must end up in the tool dialog, with a check for the guard's re-prompt in history.txt, (2) the same turn under SYSTEM_ASK_SURFACE_DISABLED=1, where the menu stays prose, and (3) a numbered-summary turn the guard must leave alone. How far should I take it?
```

Options:
```text
Write + run on Claude Code (Recommended)
Write + run full matrix
Write only
```

Answer:
```text
Go for 2, but i dont have codex usage. only opencode go and gpt provider through cli codex, opencode, pi and SWE 2 MAX cli devin
```

### Q005
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01BKjY4LQgTV5JvsrymAJ63r:0 -->

Question:
```text
Alignment scope. Target: HEAD (branch), base origin/main, 51fc49ae75, 0 commits. The work is all uncommitted on main, and the resolver's HEAD scope pulled in 7,880 dirty files, mostly from other sessions. I narrowed the run's own scope.json to this work's 67 files (13 owners; packet scratch/ and research/ excluded), keeping the resolver's classification. The full HEAD scope is kept beside it as scope.head-full.json. Surfaces that fire: S1 code (18), S2 skill docs (22), S3 catalog (23), S4 playbooks (23), S5 READMEs (51), S6 changelogs (24), S9 commands (1), S11 runtime mirrors (31), S12 AGENTS.md and rules (2), S13 env docs (19), S14 packet validate (8), S15 CI parity. Quiet: S7, S8, S10. Battery rows planned: 59. How should the run go?
```

Options:
```text
Approve narrowed scope (Recommended)
Use full HEAD scope
Cancel
```

Answer:
```text
Approve narrowed scope (Recommended)
```

### Q006
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01QdxjHgw4hYu6uuW88WGcun:0 -->

Question:
```text
Battery finished: pass 50, fail 5, cannot run 0, not applicable 4. None of the 5 failures is in a file this work changed: playbook PATH_MISSING in session-relaunch scenarios (twice, S4 and the S15 fleet run), 10 broken links into the deleted specs/hooks/, a stale plugin count and sk-vision.js in .opencode/plugins/README.md, and a hooks/dsh/ path in .skilled/hooks/README.md line 210. Lanes that would run: A Code (S1, S15), B Skill docs (S2, S3, S4), C READMEs, changelogs, env docs (S5, S6, S13), D Routing, commands, mirrors, rules (S9, S11, S12). Preset opencode-go (default): cli-opencode opencode-go/deepseek-v4.1-flash at max; critic the same. The lanes and the critic are paid model calls (5 dispatches). Run them?
```

Options:
```text
Approve lanes (Recommended)
Battery-only
Cancel
```

Answer:
```text
Approve lanes (Recommended)
```

### Q007
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:chat:244ab8d6-efb9-4eea-a2cd-77ed5705166d:13f264a3-7feb-47da-83b0-3108225567e8 -->

Question:
```text
Nothing in the checkout was changed by this run. Your decision: should I fix the three guard bugs (A-2, A-1 with D-001, A-3) in packet 027 now, with the doc gaps after them? Once fixed, `/local-skilled-alignment --recheck=~/.local/state/local-skilled-alignment/Skilled/20261108T130844Z` confirms what closed.
```

Options: none

Answer:
```text
fix all
```

### Q008
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01CUwcq6fbmhgMsJgFh6fh1L:1 -->

Question:
```text
The v4.0.2.0 changelog entry now describes the guard, but the published GitHub release body still shows the old text. Should I rebuild the body with build_release_notes.py and run `gh release edit v4.0.2.0 --notes-file …`? The tag stays where it is, and you can undo by re-editing the body.
```

Options:
```text
Update the release (Recommended)
Leave GitHub as is
```

Answer:
```text
Update the release (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
