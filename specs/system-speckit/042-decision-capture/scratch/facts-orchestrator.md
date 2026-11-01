# Facts confirmed by the orchestrator before planning (2026-11-01)

1. The decision-record template is ADR-only: `.skilled/skills/system-spec-kit/templates/addons/decision-record.md.tmpl` has the headings Metadata, Context, Constraints, Decision, Alternatives Considered, Consequences, Five Checks Evaluation and Implementation, and no question-and-answer section.
2. Level inference: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:203` returns Level 3 when `decision-record.md` exists and `spec.md` carries no level marker (the marker checks run first, at lines 196-201).
3. The Claude transcript stores each AskUserQuestion result as `toolUseResult = {questions, answers}`, where `answers` maps each question's text to the chosen option. Checked against this session's transcript `~/.claude/projects/<project>/<session>.jsonl`.
4. The Claude Code hook docs (https://code.claude.com/docs/en/hooks.md) say PreToolUse and PostToolUse match AskUserQuestion by name, and PostToolUse receives `tool_input` and `tool_response`, "the exact schema ... depends on the tool". Whether `tool_response` carries the answers is UNKNOWN until a live probe. No documented event pairs a plain chat question with its reply. The candidates are Stop's `last_assistant_message`, the next UserPromptSubmit `prompt`, and the transcript, which is "written asynchronously and may lag".
5. Live examples of hand-made Q&A logs: `barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion/decision-record.md` (Q01-Q46) and `specs/commands/002-doctor-audit-and-fixes/003-nested-skilled-root/decision-record.md`.

## Operator answers that shape this packet (verbatim, 2026-11-01)

| Question (short) | Options | Answer |
|---|---|---|
| Where should the verbatim answers live? | Tracked appendix (rec.); Gitignored queue only | Tracked appendix (Recommended) |
| Record process questions (Gate 3, worktree vs branch, commit/push permission)? | One-line class (rec.); Record in full; Filter out | Filter out |
| Capture plain chat questions too? | Yes, confirmed at save (rec.); Tool questions only | Yes, confirmed at save (Recommended) |
| Build now, where? | B) New 042-decision-capture (rec.); C) Child of 009; Later | B) New 042-decision-capture (Recommended) |

The operator's original request: "i want to make it more smart so that like now every answer to a question from ai like with ask question tool is recorded, but rewritten / optimized by ai not just raw transcript. Needs to be automated and/ or smartly integrated"
