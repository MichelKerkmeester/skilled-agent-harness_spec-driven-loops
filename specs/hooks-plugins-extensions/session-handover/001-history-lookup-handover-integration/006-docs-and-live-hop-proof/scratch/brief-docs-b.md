REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/006-docs-and-live-hop-proof

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.

ROLE
You are a technical writer correcting existing docs to match shipped behaviour. You change no code.

THE SHIPPED BEHAVIOUR (the only facts you may state; do not invent others)
- The history lookup lets a model search, browse and load earlier turns of a session, read-only.
- It is NO LONGER offered after a compaction on any runtime. The Claude, Pi, DSH, Devin and Vibe
  compaction hooks mint no locator and print no lookup section. The OpenCode plugin
  `.opencode/plugins/session-history-lookup.js` was deleted. Compaction summaries and the
  `/speckit:resume` pointer are unchanged.
- It is offered when a handoff note is CLAIMED. `prepare` (session handover CLI
  `.skilled/hooks/session-handover/bin/session-handover.cjs`) stores a locator for the SENDING
  session with provenance source `handover`. `claim` mints a fresh locator for the sender and prints
  a `## History Lookup` section after the note body, then the sentence
  "Use it for a detail this note does not spell out, before you guess."
- The printed command is `node .skilled/hooks/session-handover/bin/history-lookup.mjs --session <id> --handle <hl1_...> <operation> <json>`.
  The session handover concern owns that entry. The TypeScript source and build stay in
  `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/`.
- Only Claude Code and Codex senders get a locator. The section is withheld when the sender has no
  transcript, when the note names another runtime, when the sender ran in another checkout, or when
  the runtime is not built. The claim then prints what it printed before.
- A locator is fresh for 30 minutes from the claim. Replies stay capped and read-only.
- Search matches whole identifier parts, split on `- . / : _` and on case changes, not arbitrary
  substrings. Use this exact example sentence where the task asks for the fragment rule:
  A query matches whole word parts, so 'live' does not match 'delivery'.
- Measured on Claude Code, same harness before and after: before, 0 of 6 receivers attempted a
  lookup. Do not state an after number; another step records it.

STYLE
Edit in place and keep each file's existing structure, frontmatter, headings and tables. Plain
sentences. No em dashes, no semicolons, no dated run transcripts, no spec paths or packet numbers.
Where the docs say `session-relaunch` for the hook folder or CLI, the current name is `session-handover`.

BANNED OPERATIONS
- Any git command that changes state. Editing code, tests or any file outside ALLOWED WRITE PATHS.
- Reading or naming any secrets or dotenv file.

OUTPUT
End with a short report: files changed, each verification command with its output, and anything
you could not do.


TASK (READMEs, skill doc, contract and release note)
For each file, find every sentence about the history lookup (`rg -n -i "history lookup|history locator|session-history-lookup|history/cli.js"`)
and correct it to the shipped behaviour. Remove sentences that describe a compaction-time mint or offer.
1. README.md (repository root): retitle the "History after compaction" block to "History across a
   handover" and rewrite it. Add the fragment rule sentence.
2. .skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md: the producer is now the
   session handover (prepare and claim), not the compaction adapters. Add the fragment rule sentence.
3. .skilled/hooks/session-handover/README.md: document the locator at prepare and the section at claim.
4. .skilled/skills/system-spec-kit/SKILL.md and .skilled/skills/system-spec-kit/runtime/hooks/claude/README.md:
   drop the compaction-offer sentence.
5. The hook READMEs under .skilled/skills/system-spec-kit/runtime/hooks/ for codex, pi, devin and dsh,
   and .skilled/hooks/session-lifecycle/vibe/README.md: drop the compaction-time lookup sentences.
6. .opencode/plugins/README.md and .opencode/plugins/ARCHITECTURE.md: remove the
   `session-history-lookup.js` rows and mentions.
7. .skilled/hooks/injection-contract.md, .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md
   and .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection-conversation.md:
   correct any statement that a compaction adds a lookup section.
8. .skilled/changelog/skilled/v4.0.2.2.md (an unreleased note): add one short section, in the
   file's existing style and placed before "## How It Was Checked", titled "History Lookup Moves to
   the Handover". Say what changed for a user in four to six sentences, including that the shared
   Claude transcript reader now reads one message written as several lines as one turn, which
   stopped the lookup from refusing sessions that ran tools in parallel. Do not touch older changelogs.
Verify: `rg -n "session-history-lookup" --glob '*.md' --glob '!specs/**' --glob '!**/changelog/v*' --glob '!.skilled/changelog/skilled/v4.0.2.0.md' --glob '!.skilled/changelog/skilled/v4.0.2.1.md' .`
prints nothing, `rg -n "History after compaction" README.md` prints nothing, and
`rg -c "'live' does not match 'delivery'" README.md .skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md` prints 1 or more for each.

ALLOWED WRITE PATHS (nothing else)
- README.md
- .skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md
- .skilled/hooks/session-handover/README.md
- .skilled/skills/system-spec-kit/SKILL.md
- .skilled/skills/system-spec-kit/runtime/hooks/claude/README.md, codex/README.md, pi/README.md, devin/README.md, dsh/README.md (same hooks folder)
- .skilled/hooks/session-lifecycle/vibe/README.md
- .opencode/plugins/README.md and .opencode/plugins/ARCHITECTURE.md
- .skilled/hooks/injection-contract.md
- .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md
- .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection-conversation.md
- .skilled/changelog/skilled/v4.0.2.2.md
