# Sixth review of the 003 plans (after the fifth fix pass)

Fresh Opus high re-review, read-only. All review-5 findings closed, build order 001 to 011 holds. Paths are relative to the packet folder.

## P0
- R6-P0-1 003 CHK-030 (tasks.md:165) requires `rg 'env::var|std::env' $CRATE/src` to match nothing, but lib.rs must read std::env::args, so 003 cannot close. Fix: the pattern checks `env::var` only.

## P1
- R6-P1-1 003 REQ-003 (spec.md:164) and AC-006, AC-011, AC-012 give `bash crates/bots-tui/tests/fixtures/bots` while plan.md:124 gives `bash tests/fixtures/bots`, and cargo runs tests from the crate directory. Fix: build the path from env!("CARGO_MANIFEST_DIR") and use that wording everywhere.
- R6-P1-2 003 CHK-031 (tasks.md:166) conflicts with T031 and AC-011 (tasks.md:89): closed_input_writes_nothing lives in src/app.rs and reads the fixture's argv log, which CHK-031 forbids in src. Fix: scope CHK-030 and CHK-031 to non-test code, or move the test to tests/.
- R6-P1-3 011 plan.md:28 names channels/config.json, but no task, verb or schema creates it, and REQ-014 and REQ-019 and AC-019 rest on it. AC-019 (acceptance-criteria.md:72) runs against the real state root. Fix: define the schema and its writer, and run AC-019 on a temp XDG_STATE_HOME.
- R6-P1-4 A bots answer on the fatigue item queues a resume, and if bots enable runs before the next drain that resume dispatches the tenth failed run, which 002 REQ-006 forbids. 006 REQ-004 (spec.md:156) assumes the drain happens first. Fix in 006: bots enable drops a queued resume for that item, or the runner refuses resumes of a fatigue item.
- R6-P1-5 006 AC-007 (acceptance-criteria.md:60) runs bots inbox against the live state root and needs a delete item there. Fix: a temp state root or a vitest.

## P2
- R6-P2-1 011 SC-002, SC-004 and AC-003 say an unlinked message exits 4, but T042 and T063 concede no CLI command delivers a message. Say refused.
- R6-P2-2 011 T032 does not name the parser work `channel roster add ada --role owner` needs: bots.cjs:136-139 caps positionals by spec.ids and has no role option. Name it.
- R6-P2-3 006 REQ-004 says a channel can answer the fatigue item while 011 REQ-006 says it never reaches a chat. Align 006.
- R6-P2-4 003 plan.md:124 says fixture payloads live in files under tests/fixtures/, while 006 T041 and 010 T026 search the script itself. Fix the layout in 003 and say it once.
- R6-P2-5 011 T072 verifies only -t "expired", not the group-chat or concurrent cases. Add them.
- R6-P2-6 003 AC-009's Esc half and T030 need a tty: add a lib test fed an Esc event.
