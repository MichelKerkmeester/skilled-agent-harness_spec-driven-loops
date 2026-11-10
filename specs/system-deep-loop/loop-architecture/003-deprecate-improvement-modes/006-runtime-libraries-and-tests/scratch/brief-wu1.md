GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/039-deprecate-improvement-modes/006-runtime-libraries-and-tests
It lives in the main checkout; you do not write to it. You write only in the current directory, which is a git worktree.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

ROLE: You delete the runtime libraries and tests of retired deep-loop lanes. Nothing else.

Removed lanes: `agent-improvement`, `model-benchmark`, `skill-benchmark` and their shared base `deep-improvement-common` (also spelled `deep-improvement` or `improvement` as a mode alias), plus the packet `.skilled/skills/system-deep-loop/deep-improvement/` and its loop host. They are the "improvement family". Remaining deep-loop modes: research, review and ai-council (decision kinds `deep-review`, `deep-ai-council`, research where present).

STEP 1. Delete these folders with git rm -r -q (all under .skilled/skills/system-deep-loop/runtime/lib/):
  agent-improvement-ledger-schema  agent-improvement-reducers  agent-improvement-sealed-artifacts
  model-benchmark-ledger-schema    model-benchmark-reducers    model-benchmark-sealed-artifacts
  deep-improvement-common-ledger-schema  deep-improvement-common-reducers  deep-improvement-common-sealed-artifacts
STEP 2. Delete these files with git rm -q:
  .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-improvement-ledgers-contract.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/agent-improvement-ledger-schema.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/agent-improvement-reducers.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/agent-improvement-sealed-artifacts.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/model-benchmark-ledger-schema.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/model-benchmark-reducers.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/model-benchmark-sealed-artifacts.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-ledger-schema.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-reducers.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-sealed-artifacts.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/deep-improvement-ledgers-contract.vitest.ts
  .skilled/skills/system-deep-loop/runtime/tests/unit/host-driven-improvement.vitest.ts

DON'T
- BANNED OPERATIONS: git commit, git push, git checkout, git reset, git stash, git rebase, git branch, rm -rf, npm install, editing anything under specs/.
- ALLOWED WRITE PATHS: the deletions above only. Do not edit any file; the next work unit fixes the importers.

VERIFY
  git status --short .skilled/skills/system-deep-loop/runtime | wc -l
  rg -ln "agent-improvement-ledger-schema|model-benchmark-ledger-schema|deep-improvement-common|deep-improvement-ledgers-contract|agent-improvement-reducers|model-benchmark-reducers|sealed-artifacts" .skilled/skills/system-deep-loop/runtime/lib .skilled/skills/system-deep-loop/runtime/scripts .skilled/skills/system-deep-loop/runtime/tests

HANDBACK: list what you deleted, then the two VERIFY outputs (the second lists the importers the next unit fixes).
