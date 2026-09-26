phase-add check, 2026-09-26, on a copy of the fixture
before: 3 phase dirs, 3 exact binding rows
create.sh --phase --parent <copy> --phases 1 --phase-names phase-add-check --level 2 --with-goal: exit 0; map row 4 and 004-phase-add-check/ added
after adding one row: 4 phase dirs, 4 exact binding rows
validate --no-recursive --strict on the copy parent: SPEC_DOC_SUFFICIENCY pass, SPECDOC_SUFFICIENCY_006 count 0
goal.cjs packet: packet_budget=ok; chat_slice contains 004-phase-add-check/goal.md
