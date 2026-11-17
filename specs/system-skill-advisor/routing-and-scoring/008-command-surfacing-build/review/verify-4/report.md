# Review pass four, verification of findings

Verifier: Opus 5.5 high, 2026-11-14, read-only on code. Probes in `probes/`. The holdout rule held: command-prompts.jsonl was only read through `jq 'del(.prompt)'`.

Count: confirmed P0 0, P1 3, P2 15. Rejected 3.

- SA4-P1-002: CONFIRMED P1. A refusal over "A or B" keeps the second command. `do not run /create:agent or /create:readme` gives `/create:readme (start)` on the top row; `never use /create:readme or /create:feature-catalog` gives `/create:feature-catalog (start)`; `do not run /deep:review, or /deep:research` gives `/deep:research (ask)`. Fix: carry a refusal over or-lists in `commandOnlyMentioned` (command-attach.ts).
- SA4-P1-001: CONFIRMED, accepted limit, P2 (020 spec.md:242, T017). Retired name typed in a refusal.
- SA4-P1-003: CONFIRMED, deliberate tradeoff, P2 (020 T021, T024, P017). Broad creation words.
- SA4-P2-001: CONFIRMED P2. Add `(?:the )?` to `COMMAND_BARE_ASK_LEAD`; the question also puts `/doctor:update (ask)` on the top row.
- SA4-P2-002: CONFIRMED P2. advisor-recommend.md:39, the lead row keeps its command.
- SA4-P2-003: CONFIRMED P2. command-meaning-matching.md:65, 17 becomes 28.
- SA4-P2-004: CONFIRMED P2. Phase 020 spec.md:122, :184 and AC-007 say 10, the code uses 9.
- SA4-P2-005: CONFIRMED P2. Add a test row with each root fix.
- R4-P2-001: CONFIRMED P2. codex.mjs:167 opens the caller's locator after containment resolved another path (symlink swap probe). Read `storePath`; keep `recordedSessionId` on `transcriptPath`.
- R4-P2-002: REJECTED. The first returned row always leads (fusion.ts:1617-1618; 0 of 195 labeled and 0 of 78 doctor rows differ).
- R4-P2-003: CONFIRMED P2. README:121 should name `parent-named only`.
- iter1-P1-offeredas-not-persisted: CONFIRMED P1. `offeredAs` is dropped by `backfillRunLog` (shown by run) and by `run-command-behaviour.mjs:1183-1187` (by reading). A partner-side command then counts as an offer.
- iter2-P1-fit-decline-ungated: REJECTED. A move from 8 to 9 already fails the suite (slice test compares the whole block); the 8 of 24 is accepted by P041.
- iter1-P2-heredoc-delimiter: CONFIRMED P2. End markers with `-` or `.` are read as commands; no stored number moves.
- iter1-P2-shell-read-not-start: CONFIRMED, raised to P1. A shell `cat` of a command document then a write gives `started:false`. A scorer copy accepting shell reads moves 7 of 12 stored start lines (codex pre 0 to 1 of 12, codex post 0 to 1, pi pre 0 to 3 of 11, dsh post 6 to 9 of 12). `takenLoop` misses such loops, and phase 026 T024 builds on `readDocument`.
- iter2-P2-live-holdout-guard-baseline-only: CONFIRMED P2. Check the live capture too.
- iter3-P2-attached-metrics-unpinned: REJECTED. command-routing-slice.vitest.ts:277-280 compares the whole block.
- iter3-P2-pair-doc-shared-rows: CONFIRMED P2. README: the paired block needs a shared owned row.
- iter4-P2-paired-arm-key-collision: CONFIRMED P2 (hand-written logs only). Reserve `paired`.
- iter4-P2-unscored-only-dead-field: CONFIRMED P2. Delete the field.
- DR4-P2-001: CONFIRMED P2. The A11 row should name the by-hand fix for a malformed row.

Fixes that overlap phase 026: offeredAs and the shell-read start must land before 026 T002 and its sessions. The pair doc, the `paired` name and `unscoredOnly` can fold into 026 T018 and T019.

Seen outside the 21, not graded: `The /doctor:update command is documented in the README` puts `/create:readme (start)` on the top row. `/doctor:deep-loop (run, add-only)` as third row on deep-loop refusals falls under P007.
