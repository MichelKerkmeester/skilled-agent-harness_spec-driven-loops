REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/005-deprecate-compaction-offer

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.

ROLE
You are a TypeScript test engineer restoring test coverage that was removed by mistake.

CONTEXT
R = .skilled/skills/system-spec-kit/runtime. The suite R/tests/history-locator-adapters.vitest.ts
was deleted when the post-compaction history lookup offer was removed from the Pi, Devin and DSH
compaction adapters. That suite also tested behaviour that STAYS: the compaction summary, the spec
folder line, the packet purpose line and the `/speckit:resume` recovery pointer. Those cases must
come back. The deleted file is saved for reference at
specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/005-deprecate-compaction-offer/scratch/old-history-locator-adapters.vitest.ts.txt
The adapters as they are now: R/hooks/pi/session-compact-context.ts,
R/hooks/dsh/session-compact-context.mjs, R/hooks/devin/post-compaction.cjs. Read all three first.

TASK
Create R/tests/compaction-adapters.vitest.ts. Port these cases from the old file, adapted to the
adapters' current exports and output, with every locator, handle and lookup-section assertion removed:
- Pi: "keeps the summary and spec folder only when no live session id exists" (now simply: the
  message carries the summary and the spec folder), "names the packet purpose of the last active
  spec folder", "walks up from a packet subfolder to the packet purpose", "adds no packet purpose
  for a last spec folder outside the workspace", and the long-summary case reduced to: the
  `/speckit:resume` recovery pointer stays whole when a long summary fills the budget.
- Devin: "keeps the recovery pointer whole when a long summary fills the budget".
- DSH: "offers nothing when the compaction failed", "keeps the summary and recovery pointer" and
  "names /speckit:resume once when the primed context already names it".
Add one assertion per runtime that the emitted text does not contain `History Lookup`.
Do not change any adapter. If a case cannot be ported because the behaviour no longer exists,
say so in the report and leave it out.
Then update two docs that name the deleted suite so they name the new one:
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/packet-purpose-pi-compaction.md (lines near 60 and 105)
and .skilled/skills/system-spec-kit/feature-catalog/context-preservation/packet-purpose-carry.md (line near 66).
Verify and paste the last 5 lines:
(cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/compaction-adapters.vitest.ts)   exits 0
(cd .skilled/skills/system-spec-kit/runtime && npx tsc --noEmit -p tsconfig.json)   exits 0

ALLOWED WRITE PATHS (nothing else)
- .skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/packet-purpose-pi-compaction.md
- .skilled/skills/system-spec-kit/feature-catalog/context-preservation/packet-purpose-carry.md

BANNED OPERATIONS
- Any git command that changes state. Editing any adapter, any other test or any other file.
- Reading or naming any secrets or dotenv file.
- Code comments that mention spec paths, packet numbers, phase numbers or task ids.

OUTPUT
End with a short report: the cases ported, any left out and why, and the verification output.
