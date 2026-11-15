REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/004-history-preview-readability

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful TypeScript maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the two files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Touch nothing else, except that the build in VERIFY regenerates `dist/`.

TASK (one change): a model turn's preview today is the first 160 characters of its blocks with every tool call JSON-serialized whole, so a turn that opens with a tool call previews as `{"type":"toolCall","id":"call-...`. Make the preview read as text: the turn's text blocks, then each tool call as its name and its compact arguments.

Root = /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
H = Root/.skilled/hooks/session-handover/history
P = H/lib/navigator.ts
T = H/tests/history-search-browse.vitest.ts

1. In P, replace exactly this function:

```
function previewFor(item: RecoveryHistoryItem): string {
  const content = item.kind === 'user' ? item.userMessage.content : item.assistantMessage.content;
  return contentText(content).replace(/\s+/g, ' ').trim().slice(0, 160);
}
```

with:

```
// A tool call reads as its name and its arguments, never as the block object, whose id and
// type field tell a reader nothing about what the turn did.
function previewFor(item: RecoveryHistoryItem): string {
  const text = item.kind === 'user'
    ? contentText(item.userMessage.content)
    : item.assistantMessage.content
      .flatMap((block) => {
        if (block === null) return [];
        if (block.type === 'text') return [block.text];
        return [`${block.name} ${serialized(block.arguments)}`];
      })
      .join(' ');
  return text.replace(/\s+/g, ' ').trim().slice(0, 160);
}
```

2. In T, inside `describe('browse', () => {`, directly after the closing `});` of the test titled `'walks backward and forward from an anchor with previous and next ids'`, add:

```

  it('previews a tool call by its name and arguments, not the block object', () => {
    const references = navigator().browse({ direction: 'forward', count: 5 });
    const preview = (historyId: string) =>
      references.find((reference) => reference.historyId === historyId)?.preview;
    expect(preview('history-turn-1')).toBe(
      'The lookup contract lives in docs/design.md. read_file {"path":"docs/design.md"}',
    );
    expect(preview('history-turn-mixed')).toBe(
      'Public answer after paging. read_file {"path":"docs/answer.md"}',
    );
    for (const reference of references) {
      expect(reference.preview).not.toContain('"type":"toolCall"');
      expect(reference.preview).not.toContain('call-read');
    }
  });
```

Do not change any other test in T.

VERIFY: from H run `npx tsc -p tsconfig.json --noEmit`, then `npm test`, then `npm run build`, and report the `Tests` line of the test run and the exit status of each command. If an existing test fails because it pinned the old preview text, report its name and its assertion exactly, and do not change it.
