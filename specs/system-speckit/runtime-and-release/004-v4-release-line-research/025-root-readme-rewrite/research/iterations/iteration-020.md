# Iteration 20: The Runtime Roster a Rewrite Must Publish

## Focus

All five key questions are answered and the registry holds zero open questions, so no dispatch focus was supplied. This is the final iteration of 20. Iteration 19 left one rewrite hazard explicitly unresolved: the root README states runtime support as six names at `README.md:16` and eight at `README.md:184`, and it recorded that "the rewrite still needs a runtime matrix to resolve it" without settling which roster is current.

This iteration settles that roster. The selected interpretation: a runtime is supported only when a tracked repo-root runtime folder ships adapter files for it. Prose lists are corroboration, not the oracle. The check therefore covers three things at once — the six-vs-eight conflict, whether every named runtime has a shipped folder, and whether any name carried by the research question text (Hermes) still exists.

Deferred alternatives: a broad Q4 re-audit (blocked in strategy §9 since iteration 10), an independent re-count of skills or templates (blocked in iterations 6, 11 and 14), and editing `research.md` to fold the roster correction (outside this dispatch's write scope; recorded under SCOPE VIOLATIONS).

## Actions Taken

1. Read `deep-research-config.json`, the 46-line `deep-research-state.jsonl` (19 iteration records plus `iteration_start` rows), `deep-research-strategy.md`, `findings-registry.json` (zero open questions) and `iteration-019.md`.
2. Listed the nine candidate runtime directories named across the strategy and the README, then counted tracked files and top-level entries per folder.
3. Searched `.skilled/changelog/skilled/v4.0.2.1.md` for the runtime roster, the roster-check sentence and the eight-runtime naming.
4. Searched `INSTALL-SKILLED.md`, the doctor references and the changelog set for DSH, Mistral Vibe and Hermes.
5. Read the doctor's `runtimeFolders` manifest and the six-name summary line in `README.md`.
6. Confirmed `.hermes` is absent from disk and that `cli-external-orchestration` v2.0.0.0 records the removal of the `cli-hermes` mode.

## Findings

### F1 (P1) — The shipped runtime roster is eight; the six-name summary at `README.md:16` is stale

Four independent oracles agree on the same eight runtimes: Claude Code, Codex, Cursor, Devin, OpenCode, Pi, DeepSeek Harness (DSH) and Mistral Vibe.

- The tree: eight tracked runtime folders exist, each carrying a substantial shipped adapter set — `.claude` 99 tracked files, `.codex` 89, `.cursor` 90, `.devin` 49, `.dsh` 148, `.opencode` 89, `.pi` 183, `.vibe` 203. [SOURCE: .claude] [SOURCE: .codex] [SOURCE: .cursor] [SOURCE: .devin] [SOURCE: .dsh] [SOURCE: .opencode] [SOURCE: .pi] [SOURCE: .vibe]
- Install prose: `README.md:184` and `INSTALL-SKILLED.md:57` carry the same sentence naming all eight. [SOURCE: README.md:184] [SOURCE: INSTALL-SKILLED.md:57]
- Release prose: `v4.0.2.1` states the `env-secret-guard` "runs on Claude Code, Codex, Cursor, Devin, OpenCode, Pi, DSH and Mistral Vibe" and that the roster check "checks all eight folders". [SOURCE: .skilled/changelog/skilled/v4.0.2.1.md:80] [SOURCE: .skilled/changelog/skilled/v4.0.2.1.md:355]
- The doctor's machine-readable manifest enumerates the same eight: `"runtimeFolders": [".claude", ".codex", ".cursor", ".devin", ".dsh", ".opencode", ".pi", ".vibe"]`. [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:193]

`README.md:16` names only six — "Built for Claude Code, Codex, OpenCode, Pi Agent, Devin and Cursor CLI" — omitting DSH and Mistral Vibe, both of which ship tracked folders and both of which the v4.0.2.1 changelog places on the dotenv guard. The six-name sentence is the stale half of the conflict, not the eight-name one. [SOURCE: README.md:16] [INFERENCE: based on the eight tracked runtime folders and the two independent eight-name prose sources against the six-name line]

### F2 (P1) — Hermes is a removed runtime and a removed CLI mode; the strategy's Q2 text still names it

`v4.0.0.0` shipped Hermes as "the seventh runtime, as `cli-hermes`" with a repo-root `.hermes/` folder carrying generated skill copies, an agent link and a `repo-guards` plugin. [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:189] [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:191]

Neither survives. `.hermes` is absent from the repository root, and `cli-external-orchestration` v2.0.0.0 records "the removal of the cli-hermes mode, which leaves seven CLI modes". A search for "hermes" outside `specs/` returns only changelog history — no current skill, command, hook or runtime folder. [SOURCE: .skilled/skills/cli-external-orchestration/changelog/v2.0.0.0.md:3] [INFERENCE: based on the absent `.hermes` directory and a repo-wide search whose only hits are historical changelog entries]

The hazard is in the packet, not the README: strategy Q2's question text lists "Hermes" among the runtimes to inventory. A rewrite brief assembled from that question text would resurrect a runtime that was removed, and the README currently carries no Hermes claim to correct. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:35]

### F3 (P2) — The doctor's `runtimeFolders` manifest is the machine-readable roster the rewrite can cite

The doctor reference enumerates the eight runtime folders twice: once in prose as "the runtime folders", and once as the `repin.runtimeFolders` JSON array used by re-pin. That array is the only machine-readable roster in the tree; every other roster statement is prose in a README, an install guide or a changelog. [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:182] [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:193]

This gives the rewrite a single authoritative list to build its runtime matrix from, rather than reconciling six-name and eight-name prose by hand. It also means a future runtime addition has one manifest to update, which is the claim the rewrite can make safely.

### F4 (P2) — The canonical eight-runtime sentence already exists verbatim in two files

`README.md:184` and `INSTALL-SKILLED.md:57` are byte-identical: "Open the repository in any of the eight runtimes: OpenCode, Claude Code, Codex, Cursor, Devin, Pi, DeepSeek Harness (DSH) or Mistral Vibe." [SOURCE: README.md:184] [SOURCE: INSTALL-SKILLED.md:57]

The rewrite does not need to author a runtime sentence. It needs to replace the six-name summary at `README.md:16` with the already-published eight-name wording and keep the install-guide copy in step. Reusing the existing sentence also preserves the name ordering a reader has already seen in the install path.

## Questions Answered

None newly. Q1-Q5 were answered in iterations 1-8 and remain answered; this iteration closes the last unresolved claim inside Q2's inventory.

## Questions Remaining

None tracked. One hand-off for the rewrite owner:

- Publish eight runtimes — Claude Code, Codex, Cursor, Devin, OpenCode, Pi, DeepSeek Harness (DSH), Mistral Vibe — and do not list Hermes. Reuse the `README.md:184` / `INSTALL-SKILLED.md:57` sentence and retire the six-name line at `README.md:16`.

## Ruled Out

- **Treating `README.md:16`'s six-name list as the current roster.** It omits DSH and Mistral Vibe, both shipped and tracked (148 and 203 files).
- **Listing Hermes as a supported runtime.** `.hermes` is absent and the CLI mode was removed in `cli-external-orchestration` v2.0.0.0.
- **Using top-level directory entry counts as a support measure.** `.dsh` has 8 entries and 148 tracked files, `.vibe` 8 entries and 203 tracked files; entry count measures layout, not support.
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the runtime claim set.
- **Editing `research.md` to fold the roster correction.** Outside this dispatch's allowed write paths; recorded under SCOPE VIOLATIONS.

## Dead Ends

- **`ls -1A <runtime-dir> | wc -l` as a runtime-support oracle.** It reports shallow folder layout (8-21 entries) and says nothing about whether the runtime's adapters ship. The tracked-file count and the `runtimeFolders` manifest are the oracles.
- **Searching the current README for a Hermes claim to correct.** There is none; the only trace of Hermes is historical changelog prose and the strategy question text. The correction belongs in the brief, not in a README claim row.

## Edge Cases

- Ambiguous input: no dispatch focus was supplied. The selected interpretation — settle the runtime roster rather than re-open a README claim — is recorded in Focus, with blocked alternatives under Ruled Out.
- Contradictory evidence: three roster statements disagree — six names at `README.md:16`, eight at `README.md:184` / `INSTALL-SKILLED.md:57`, and Hermes as a seventh runtime in the `v4.0.0.0` changelog. Resolved in favour of the current tree plus the `v4.0.2.1` changelog and the doctor manifest; the Hermes removal is documented in `cli-external-orchestration` v2.0.0.0. All three sides are cited above rather than collapsed.
- Missing dependencies: none. Every path measured exists; the registry carries zero open questions.
- Partial success: the read-only roster measurement is complete. The synthesis fold is workflow-owned and outside this dispatch's write scope.

## Sources Consulted

- `README.md:16`, `:184`
- `INSTALL-SKILLED.md:57`
- `.skilled/changelog/skilled/v4.0.2.1.md:80`, `:355`
- `.skilled/changelog/skilled/v4.0.0.0.md:189`, `:191`
- `.skilled/skills/cli-external-orchestration/changelog/v2.0.0.0.md:3`
- `.skilled/skills/system-skilled-doctor/references/overlays.md:182`, `:193`
- `.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe` (git-index tracked-file counts)
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:35`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/findings-registry.json` (zero open questions)
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-019.md`

## Assessment

- New information ratio: 0.85
- Questions addressed: the runtime roster inside Q2, left unresolved by iteration 19.
- Questions answered: none newly; Q1-Q5 remain answered.

## Reflection

- What worked and why: asking set membership instead of counting names. The six-vs-eight conflict cannot be settled by preferring one prose line; it needed a membership test — does every named runtime have a tracked folder, and does every tracked folder appear in a prose list? Four oracles answered it in five calls. Searching the removed name across non-spec files is what surfaced the Hermes lineage: a README-only or strategy-only check would have missed the `v4.0.0.0`/`v2.0.0.0` pair entirely.
- What did not work and why: nothing failed this iteration, but the first instinct was to treat `README.md:184` as the only oracle. That would have confirmed eight and still missed that Hermes had once been a runtime, leaving the strategy's Q2 text as a live trap. The changelog search was the call that turned a count into a roster history.
- What I would do differently: when a strategy question lists candidate names, verify each name still exists before treating the question text as an inventory. Question text ages; the tree does not.

## Next Focus

None required. Every tracked question is answered, every numeric claim a rewrite would publish has an oracle or a documented correction, and the runtime roster is now measured against the tree. The one remaining action is the workflow-owned synthesis fold in `research.md` — the §5B/§5D/§5 corrections listed in iteration 19 plus the roster statement below.

## SCOPE VIOLATIONS

- **`research.md` synthesis update not executed.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-020.md` and `deltas/iter-020.jsonl`. No mutation was executed. The replacement text this iteration contributes:
  - Runtime roster row: "8 runtimes — Claude Code, Codex, Cursor, Devin, OpenCode, Pi, DeepSeek Harness (DSH), Mistral Vibe — each with a tracked repo-root adapter folder; `.hermes` was removed, do not list Hermes."
  - README:16 claim row: "six-name summary omits DSH and Mistral Vibe; reuse the eight-name sentence already at `README.md:184` / `INSTALL-SKILLED.md:57`."
  - Q2 close-out note: the strategy's Q2 question text names Hermes, which no longer ships; the question is answered, but the brief must not copy its candidate list verbatim.
