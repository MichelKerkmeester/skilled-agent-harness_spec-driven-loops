# Claims To Verify (review input, not established fact)

Three claims were raised against this packet's handover by a prior session. Each is UNVERIFIED.
Confirm or refute each one against the repository. Do not assume any is correct.

## Claim 1 — the handover's `--mode text` trap is false

`handover.md` §2.4 states "pi has no `--mode text`" and §5 states the only non-interactive flag is
`-p`/`--print`. The counter-claim is that `--mode text` DOES exist and is pi's default output mode,
citing the installed binary at `~/.local/lib/node_modules/@earendil-works/pi-coding-agent`:

- `dist/cli/args.js:42` accepts `text`, `json` and `rpc`
- `dist/cli/args.js:274` help text reads `Output mode: text (default), json, or rpc`

If the counter-claim holds, the trap row is a false lesson, and `--mode text` occurrences across the
cli-pi skill tree and `.pi/custom-providers.md` are correct rather than defects. Check both directions.

## Claim 2 — the single validator warning is misattributed

`handover.md` §4 and §5 note 6 both name `AC_COVERAGE` as the one remaining warning. The counter-claim
is that `AC_COVERAGE` reports as a pass and the actual warning is `FRONTMATTER_MEMORY_BLOCK` with five
issues, one of them inside `handover.md` itself. Re-run the validator and read the markers.

## Claim 3 — the acceptance-criteria arithmetic is wrong

`handover.md` §5 note 6 says 16 of 21 criteria are flagged, 6 of them from the first pass, concluding
the deficit predates this pass. The counter-claim is 15 flagged, 7 from the first pass, and all 8
criteria written by the second pass flagged, making the majority of the deficit new. Count them.

## Also in scope

These three claims do not bound the review. Audit the whole change set on its own terms:
both CLI rosters and SKILL.md files, the three `.pi` config files, the dispatch playbook, the
deep-loop executor config and its test, and the packet documents.
