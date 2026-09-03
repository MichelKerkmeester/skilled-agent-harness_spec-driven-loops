---
trigger_phrases: []
---
ROLE: You are the MARKDOWN agent (template-first documentation executor). Load the `sk-doc` skill and specifically its command-authoring packet at `.opencode/skills/sk-doc/sk-create-command/SKILL.md`. Follow that packet's standards and templates EXACTLY. Read `.opencode/skills/sk-doc/sk-create-command/assets/command-template.md` before writing.

CONTEXT (pre-resolved — do NOT ask, do NOT stop):
- Spec folder: `specs/sk-communication/002-sk-communication-triggers` (pre-approved, skip Gate 3; do NOT emit the A/B/C/D/E documentation-scope question).
- This is a NEW root OpenCode slash command. You are a non-interactive leaf executor.

TASK: Author exactly one file: `.opencode/commands/rewrite-response.md` → invocation `/rewrite-response`. Do not create or edit any other file.

WHAT THE COMMAND DOES (command 1 of the sk-communication trigger pair):
`/rewrite-response` triggers the ACTIVE AI (the one executing the command) to rewrite ITS OWN most recent assistant reply into sk-communication plain English, entirely IN-CONTEXT.

HARD CONSTRAINTS the command body MUST enforce on the executing AI:
1. NO local LLM and NO external LLM, NO CLI dispatch, NO provider. The AI applies the rules to itself, in-context only.
2. Display-only projection: the command MUST NOT modify any file or any canonical state. It re-emits a plain-English rendering of the prior turn only. Canonical bytes (transcript/history) stay unchanged. It is NOT a file edit.
3. Preserve MEANING exactly; scope is the assistant's most recent message only.
4. Preserve PROTECTED SPANS byte-for-byte: fenced code blocks, inline code, file paths, shell commands, URLs, numbers, identifiers, and any quoted/literal values must appear unchanged in the rewrite.
5. If there is no prior assistant message to rewrite, say so and stop with a structured status.

THE REWRITE RUBRIC — make it SELF-CONTAINED inside the command so it needs no package at runtime. Distill it from the authentic projection rubric: the package constant `COPY_EDITING_INSTRUCTION` in `.opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts` ("Rewrite only the [target] message in plain English. Output only the rewrite."; temperature 0.2; copyEditingScope 'assistant-message-only'; protected-spans/1.0.0), plus the plain-English standard in `.opencode/skills/sk-communication/SKILL.md`. Concretely the rubric is: one idea per sentence; plain words; cut filler and hedging; keep meaning and every technical token exact; calm, low-embellishment tone; output only the rewritten reply.

BEHAVIOR / OPTIONS:
- No required arguments (it operates on the immediately preceding assistant turn). Therefore NO mandatory input gate is required.
- Optional flag `[--show-original]`: when present, show the original reply first, then the rewrite, each clearly labeled. Default (no flag): output the rewrite only, prefixed by a one-line label that it is a plain-English rewrite.

STANDARDS (from sk-create-command):
- Frontmatter: single-line action-oriented `description` (target ≤110 chars); `argument-hint: "[--show-original]"`. This command uses NO tools (pure in-context reasoning) — OMIT `allowed-tools` entirely; never add tools it does not use.
- Body: `## N. SECTION-NAME` full-integer H2 headings; actionable/executable steps; two or three example invocations; structured status output (e.g. `STATUS=OK`, `STATUS=NOOP REASON="no prior assistant message"`).
- Body hygiene (HARD): NO design rationale, NO spec/packet ids or paths, NO development notes anywhere in the shipped command body.

VERIFY before finishing (run these; ensure exit 0; include their exit codes and output in your final report):
- `python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .opencode/commands/rewrite-response.md`
- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/commands/rewrite-response.md --type command`

OUTPUT: Write the file, run the two validators, then return a final report containing: the file path, both validator exit codes, the validator output, and a two-line summary of what the command does. Return raw status text — you are a leaf executor and your final text IS the return value.
