## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/keep-list.tsv`

OLD:

~~~~text
.hermes/SYNC.md	--args \.opencode/bin/mcp-code-mode-launcher\.cjs
~~~~

NEW:

~~~~text
.hermes/SYNC.md	--args \.opencode/bin/mcp-code-mode-launcher\.cjs
# The agent mirror library the gate readiness decision owns resolves the canonical agent through `.opencode/agents`, so its test fixtures build that path.
.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts	^  writeFile\(`\.opencode/agents/\$\{AGENT_NAME\}\.md`, CANONICAL\);$
.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts	^  const target = path\.join\(work, `\.opencode/agents/\$\{AGENT_NAME\}\.md`\);$
.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts	^  writeFile\(`\.opencode/agents/\$\{AGENT_NAME\}\.md`, canonicalMd\(CURRENT_BODY\)\);$
# A recorded routing corpus prompt, pinned by hash in the scorer baseline ratchet, stays as captured.
.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl	"id":"rr-iter2-019"
~~~~
