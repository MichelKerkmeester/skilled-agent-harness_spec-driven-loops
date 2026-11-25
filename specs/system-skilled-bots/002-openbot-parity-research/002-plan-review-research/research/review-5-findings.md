# Fifth review of the 003 plans (after the fourth fix pass)

Fresh Opus high re-review, read-only. Paths are relative to the packet folder. Build order 001 to 011.

## P0
- R5-P0-1 003 REQ-003 (spec.md:164) and plan.md:75 have cli.rs always spawn `node <skilled-tree>/.skilled/bin/bots.cjs`, while the fixture is a bash script (T012 runs `bash .../fixtures/bots`) and nothing points cli.rs at it, so AC-006, AC-011 and AC-012 cannot pass. Fix: cli.rs takes the program and its arguments, defaulting to node plus bots.cjs, the tests pass the fixture path, and REQ-003 says so.

## P1
- R5-P1-1 002's fatigue item is created in routine-state.ts evaluateFatigue (002 plan.md:62, T010), a file 006 never names, so it is born with grants null against parent spec.md:128. Fix: add that writer to 006 REQ-004, 006's file table and 006 T017. Also 006 plan.md:136 still says 002 answers "with a direct write", and 006 T017's `rg "resume: false"` passes once 002 lands so it proves nothing: fix both.
- R5-P1-2 003 T006 makes an empty lib.rs and the mod lines arrive only at T017, so T008 to T010 and T016 run 0 tests and T013 to T015 (--test render_keys) cannot import render. Fix: each module task adds its own mod line.
- R5-P1-3 011 uses a repo-root THIRD_PARTY_NOTICES.md (spec.md:168, T043, plan.md:53, AC-018) while the parent (spec.md:114) and 001, 006, 008, 010 use the skill-level file with ## <phase> sections. Fix: point 011 at the skill-level file under ## 011-messaging-channels.
- R5-P1-4 011 T052 and T065 run against the real state root: a leftover roster would refuse real terminal answers, T065 runs link before any roster exists (channel-roster-missing), and no CLI command can deliver an unlinked message. Fix: temp checkout with XDG_STATE_HOME, add the roster before link, prove the unlinked case in cli-channel.vitest.ts.

## P2
- R5-P2-1 011 spec.md:106 "twelve-verb table" is 18 after 001 to 010 (activity, routines, ui, remember, secret, skill, chat added) and implies inbox and run take --scope. Fix the count and the scope claim.
- R5-P2-2 006 spec.md:103 says a terminal answer needs no roster while 011 REQ-021 checks a present roster on the terminal: align, and say what bots enable and the screen do when that check refuses.
- R5-P2-3 bots answer on a fatigue item from the CLI, screen or a channel still queues a resume: state what happens (011 and 006).
- R5-P2-4 011 tasks jump from T049 to T052, T072's second command has no cd $RT, and the file table lacks answer.vitest.ts.
- R5-P2-5 006: "cannot reach the state root" overstates codex, cursor and deepseek confinement (they block writes, not reads, and OS temp stays writable). Reword.
- R5-P2-6 003: the fixture must also cover 004's status --json change (parent spec.md:129).
