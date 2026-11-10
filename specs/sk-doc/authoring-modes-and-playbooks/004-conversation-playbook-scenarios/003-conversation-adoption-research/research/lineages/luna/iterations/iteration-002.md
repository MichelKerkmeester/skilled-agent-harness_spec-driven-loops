# Iteration 2 — CLI continuity, restart and compaction

## Findings

1. The existing Codex CX-017, OpenCode CO-018, Cursor CU-015 and Hermes HERMES-011 session-continuity scenarios all meet Q2 because each requires a second exchange that relies on prior state. Update style selectively: Codex and OpenCode can gain JSON conversation companions for interactive continuity, but retain their exact headless command checks; Cursor and Hermes stay manual until adapters exist because the runner accepts only Claude Code, OpenCode, Codex, Pi and Devin. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork.md]

2. Update OpenCode CO-046 with a two-send JSON conversation: its current single prompt triggers a shell command, but the asserted `[session-relaunch]` marker must appear on a later captured request, so Q2 is yes. Keep the request-capture and event-file checks as evidence alongside the turn-by-turn runner checks; the current shell procedure also covers v1/v2 plugin paths. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md]

3. Add a Pi-only JSON conversation companion to PI-020 for `/compact` followed by a state check or follow-up send. The current scenario explicitly skips `session_compact` in print mode and leaves `/compact` as an optional manual check; this is a Q2 gap because context must survive compaction, and the Pi adapter already exposes `/compact` plus per-turn checks. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges.md]

4. The system-spec-kit Claude, Pi/OpenCode and command-runtime session-relaunch scenarios are Q2 candidates because task state crosses a process handoff, but keep their current wrapper and hook checks as the primary evidence. The shared runner's `restart` exits and resumes the same session ID through each adapter; it does not run `skilled-loop`, create or claim a handoff note, or prove Stop-hook arming. A JSON companion would add value only for the post-handoff operator exchange and must be labeled as partial coverage. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md]

5. Rank PI-020 interactive compaction and CO-046 later-request capture first: both close an explicit uncovered Q2 behavior with one supported runtime and moderate authoring/run cost. Rank Codex/OpenCode continuity companions next, preserving exact CLI evidence; defer Cursor/Hermes conversion until adapters land. Keep system-spec-kit wrapper handoff scenarios manual until the runner can execute the wrapper lifecycle; replacing their shell evidence with same-session restart would give false coverage. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges.md]

## SCOPE VIOLATIONS

- The workflow's parent-spec writes, resource-map emission, fanout merge, and post-synthesis validation remain outside the dispatch's lineage-only write surface. Iteration artifacts and gateway state are confined to this lineage.
- The YAML's per-iteration executor dispatch is satisfied inline as instructed; no nested executor was launched.

## Questions Answered

- Which runtime-specific scenarios need to split because the runner lacks a matching adapter?
- Which question-tool, restart and compaction behaviors have no scenario yet?
- Which candidates rank highest by value and execution cost?

## Questions Remaining

- Which exact scenarios in every skill and mode meet Q2 or Q3, and which remain Q1 or Q4?
- Which question-tool and cross-runtime behaviors lack conversation coverage beyond the CLI lifecycle examples?
- Which candidates provide the best value/cost across the complete 56-package corpus?

## Sources Consulted

- .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork.md
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md
- .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/continue-same-session.md
- .skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/session-continuity/resume-captured-session-id.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md
- .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs

## Assessment

Five findings: four scenario-level results and one cost/value ranking. The highest-value direct additions are one-runtime conversations for Pi interactive compaction and OpenCode's later-request relaunch marker. Exact CLI resume and wrapper handoff evidence should remain intact because the runner restarts the supported interactive session rather than executing those headless command or wrapper contracts. newInfoRatio = 0.84.

## Reflection

Q2 identifies more conversation-worthy behavior than the shared runner can faithfully execute as-is. A format change is justified only where the runner's live-session turns and checks exercise the actual behavior; unsupported runtimes and wrapper-specific handoffs need an explicit boundary or future adapter coverage.

## Recommended Next Focus

Continue the corpus audit beyond CLI lifecycle scenarios: inspect question-tool flows, Q3 release/parity cases, and each remaining skill/mode package for existing JSON scripts, multi-turn contracts, and one-shot scenarios that should stay single prompt.

Timestamp: 2026-11-02T17:53:00Z
