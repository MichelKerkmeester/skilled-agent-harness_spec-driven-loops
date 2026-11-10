# Iteration 6 — CLI continuity across runtimes

## Findings

1. Codex CX-017, Claude Code CC-015/CC-016, OpenCode CO-018/CO-019, and Devin resume-continue all meet Q2: each needs a follow-up exchange that uses prior session state or an explicitly captured session id. Add shared-runner conversation companions for supported interactive-session continuity, but keep each existing headless CLI flag/ID check as primary evidence because runner restart resumes its own session and does not invoke every exact `-p`, `exec resume`, `--continue`, or `-s` command. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork.md:27-33 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/continue-previous-conversation.md:27-33 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id.md:27-33 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md:29-35 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md:29-35 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/session-continuity/resume-continue.md:23-29 — Q2]

2. Cursor CU-015/CU-016 and Hermes HERMES-011 are also Q2 because Turn 2 must recover a prior session, but keep them manual. Cursor and Hermes are not among the validator's accepted conversation runtimes, so a JSON block cannot currently be run without an out-of-scope adapter addition. Track these as adapter-dependent candidates rather than rewriting their exact CLI checks. [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/continue-same-session.md:27-34 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/resume-explicit-chat-id.md:27-34 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/session-continuity/resume-captured-session-id.md:29-36 — Q2] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:39, 581-583 — unsupported runtime]

3. Keep OpenCode CO-020 fork-and-share manual. The second dispatch must branch from a parent into a distinct session, making it Q2, but the JSON schema exposes only restart and compact actions and its runner adapter resumes the same session. Until fork is a supported conversation action, a JSON rewrite would not test the new session-id invariant. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md:29-35 — Q2] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:46-50 — Q2 action boundary]

4. Keep OpenCode CO-026 parallel-detached-session and CO-027 worker-farm-loop as single-prompt command scenarios. They launch independent sessions and verify IDs/files with shell output, but do not depend on a later user answer or continuation of one session; several workers are not a multi-turn conversation. Their OpenCode-version constraints and `< /dev/null` regression are better served by the present command harness. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/parallel-detached-session.md:33-37 — Q4] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/worker-farm-loop.md:33-37 — Q4]

5. Rank CO-019, CC-016 and CX-017 highest among CLI continuity updates because explicit session-id resume prevents confusion between the latest session and the intended one; add CC-015, CO-018 and Devin as same-session companions. Value is high, authoring cost is low-to-medium, and execution cost is medium per supported runtime. Defer Cursor/Hermes and OpenCode fork until adapters/actions exist; retain detached worker tests at Q4. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md:29-35 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id.md:27-33 — Q2] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:346-357 — value and cost]

## SCOPE VIOLATIONS

- The workflow's parent-spec writes, resource-map emission, fanout merge, and post-synthesis validation remain outside the dispatch's lineage-only write surface. Iteration artifacts and gateway state are confined to this lineage.
- The YAML's per-iteration executor dispatch is satisfied inline as instructed; no nested executor was launched.

## Questions Answered

- Which existing CLI continuity cases need more than one exchange and qualify at Q2?
- Which of those can the shared runner execute and which command-level details remain outside its exact surface?
- Which apparent multi-session scenarios are not conversational and stay Q4?

## Questions Remaining

- Which remaining CLI lifecycle features, especially goals and hooks, need an answer or persistent state after restart?
- Which packages from skill-advisor, MCP and the remaining workflow modes should be Q1/Q2/Q3/Q4?
- What comprehensive package matrix and priority list should synthesis deliver?

## Sources Consulted

- .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork.md
- .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/continue-previous-conversation.md
- .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id.md
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md
- .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/session-continuity/resume-continue.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/continue-same-session.md
- .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/resume-explicit-chat-id.md
- .skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/session-continuity/resume-captured-session-id.md
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/parallel-detached-session.md
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/worker-farm-loop.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md

## Assessment

Five findings add several session-id continuity cases across CLI mode packages and distinguish them from unsupported fork and detached-session behavior. These reinforce the Q2 CLI candidate set, while preserving exact external-command evidence. newInfoRatio = 0.72.

## Reflection

Q2 describes the need for cross-turn state, but a JSON companion should only claim the interactive session behavior it actually exercises. Headless resume flags, fork IDs, detached processes and parallel worker counts still need their command-level checks.

## Recommended Next Focus

Review the remaining operator-control candidates in the central /doctor and skill-advisor packages, then reconcile the complete 56-root census and rank only the candidates that survive the scope and runner-fit checks.

Timestamp: 2026-11-02T18:00:17Z
