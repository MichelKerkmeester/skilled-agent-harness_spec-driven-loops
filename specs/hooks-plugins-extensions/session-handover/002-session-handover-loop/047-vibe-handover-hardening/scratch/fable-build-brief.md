# Brief: build the approved Vibe handover fixes

The operator approved your analysis findings F1, F2 (both parts), F3, F4, F5, F6, F7 and F9. F8 and the smaller parity gaps are out of scope.

## Pre-resolved gates (do not ask, nobody is at your prompt)

- Gate 3: spec folder `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/047-vibe-handover-hardening`, worktree `/Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening`. Work only there.
- The scope is frozen in that folder's `spec.md` §3 and `acceptance-criteria.md` AC-001 to AC-010. Read both first. AC-011, the live hop, is the orchestrator's, not yours.
- Write authority: the files in `spec.md` §3 "Files to Change", their tests (`.skilled/hooks/session-handover/tests/`, `.skilled/hooks/session-lifecycle/vibe/*.test.mjs`) and `.skilled/hooks/session-handover/README.md`. Nothing else. Do not edit spec docs.
- Code standard: read `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` and follow it. Comment hygiene is a hard rule: no spec, phase, finding or task ids (no "F1", "047", "REQ-") in code comments. Keep the durable why.
- Every change must leave other runtimes untouched: gate on the Vibe adapter or `runtime === 'vibe'`.
- No git add, commit, branch or push. Do not start a live Vibe or model session. Never read, write or name a dotenv file.

## Done means

1. Each of AC-001 to AC-010 has a test that fails on the old code and passes on the new. Show one mutation check per finding: revert the core line, see the test fail, restore.
2. `node --test .skilled/hooks/session-handover/tests/*.test.cjs` and `node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs` both pass. Report counts against the 1009 baseline.
3. `git -C <worktree> status --short` lists only files in your write authority.

## Return shape

For each finding: files and line ranges changed, the test name, the mutation result. Then the two suite counts with exit codes, the `git status --short` output, and anything you could not finish and why.
