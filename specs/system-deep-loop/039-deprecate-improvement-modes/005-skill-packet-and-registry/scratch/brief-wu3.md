GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/005-skill-packet-and-registry
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

The registry edits for these modes are already done in this tree; the compiler reads `.skilled/skills/system-deep-loop/mode-registry.json`.

ROLE: You update the deep-loop hub's compiled-routing stage for two removed modes. Nothing else.

Removed modes: `agent-improvement` and `model-benchmark` (packet `deep-improvement`). The hub registry now has three modes: `research`, `review`, `ai-council`.
Folder: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/

1. lib/registry-compiler.cjs
   - Delete the `IMPROVEMENT_MODES` constant (lines ~31-34) and its export near line 692.
   - Delete the shared-packet invariant block that uses it (lines ~184-193: `const improvementRows = ...` through the `fail('SHARED_PACKET_COLLAPSE', ...)` call and its closing brace). It guarded two modes sharing one packet, which no longer exists.
   - Change nothing else. Read the whole file first and confirm no other line depends on the deleted names.
2. lib/canary-router.cjs line ~20: the comment cites `model-benchmark` as its example of a command-bridge mode. Reword to keep the rule without naming a removed mode.
3. fixtures/canary-cases.v1.json: delete every case in `cases`, `advisorCases` and `noCollapseFixtures` whose expected or input mode is `agent-improvement` or `model-benchmark`, or whose text exists only to exercise them. Keep the file valid JSON. If `noCollapseFixtures` becomes empty, leave it as an empty array.

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the three files above only.
- Do not put spec paths, phase numbers or ticket ids in code comments.

VERIFY (run these; report each exit status)
  node -e "require('./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs')"
  node .skilled/bin/compiled-route-manifest.cjs freshness --hub system-deep-loop --skill-root .skilled/skills/system-deep-loop
  rg -n "IMPROVEMENT_MODES|SHARED_PACKET_COLLAPSE|agent-improvement|model-benchmark|deep-improvement" .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop
  rg -ln "002-system-deep-loop" .skilled/bin --glob '*.test.cjs' --glob '*.vitest.ts'

HANDBACK: list every file you changed, then each VERIFY command with its exit status and output. Name any test file the last command found; do not run or edit it. The freshness command is expected to report the activation manifest as stale; do not refresh it.
