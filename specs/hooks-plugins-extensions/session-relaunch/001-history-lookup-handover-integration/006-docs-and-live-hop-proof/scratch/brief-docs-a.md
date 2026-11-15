REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/006-docs-and-live-hop-proof

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


TASK (catalog and playbooks)
1. .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:
   rewrite the entry so it describes the claim-time offer. Keep the file name. Add the fragment rule sentence.
2. .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md: rewrite the index summary of that feature.
3. .skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md:
   rewrite the one paragraph that places the lookup after a compaction.
4. .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:
   rewrite as a claim-time scenario (prepare a handoff, claim it, run the printed command, check the
   refusals). Keep the file name and the page's section layout.
5. The two pages compaction-history-recall-conversation.md and
   compaction-history-recall-baseline-conversation.md in the same folder describe a compaction offer
   that no longer exists, and hop-recall-conversation.md and hop-recall-baseline-conversation.md
   already cover the hop. Delete the two compaction-recall pages with plain `rm` and remove their
   rows or links from every playbook index or README that lists them
   (find them with `rg -n "compaction-history-recall" .skilled --glob '*.md' --glob '*.json'`).
6. Verify: run the playbook validator
   `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`
   the way its usage text says for the system-spec-kit playbook, and paste its last lines (0 violations).
   `rg -n "Offers one bounded, read-only history lookup after a compaction|Trigger a live compaction|When a compaction hook minted a fresh locator" .skilled --glob '*.md'` prints nothing.

ALLOWED WRITE PATHS (nothing else)
- .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md
- .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
- .skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/** (only the files named or found in steps 4 and 5)
