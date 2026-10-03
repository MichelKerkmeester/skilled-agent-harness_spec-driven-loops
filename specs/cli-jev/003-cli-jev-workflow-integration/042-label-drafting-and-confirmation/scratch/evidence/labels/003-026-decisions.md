# 003 and 026 label decisions

Both features read one private rows file drawn from the operator's Pi sessions. This log carries no session text.

## Files

- 003: labels written into the rows file's own `label` field, `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`. The file is untracked and listed in `.git/info/exclude`, so it never commits.
- 026: `~/.skilled/.labels/026-claims.jsonl` (mode 600), one `{id, claim}` row per turn, outside the repository at the operator-named folder.

## Method

- Draw: `build-verifier-fixture.cjs --pi ~/.pi/agent/sessions`, 50 Pi rows, 0 Claude rows. The operator approved sending the Pi-session excerpts to both labelers.
- Secret scan before any labeler saw the file: zero matches for key shapes (provider key prefixes, AWS, GitHub, Slack, private-key blocks, bearer tokens, key-value secrets). The first, broader pattern matched only skill names such as `sk-design-...`.
- Luna 6 max and SWE 2 max labeled each row on both questions, blind. They agreed on both labels for 47 of 49 shared rows. The parser dropped SWE's first row, `pi-9a32cf569778`, because SWE printed it on the same line as its progress text. The raw draft reads `not_met` and `no`, the same as Luna and the arbiter, so the drafters agree on 48 of 50 (`gates.md`, Single-draft rows).
- Opus 5.5 medium, run alone and delegated by the operator, settled every row.

## Arbiter rulings

- 003: each turn is judged against the whole session objective. A turn that finishes only its own step is `not_met`. `blocked` needs the turn to say progress depends on an outside dependency or an operator-only decision. A self-caused error is `not_met`.
- 026: `yes` needs the agent to assert completion in the last 400 characters. Tool output such as a validator's PASSED line is a check result, not a claim.

Result: 003 met 0, not_met 47, blocked 3. 026 yes 0, no 50. The one open call is pi-cc3cc010bbef, a 52-character turn of validator output. Its claim flips to `yes` if tool-output endings are meant to count as claims.

## Census

- 003, `node --preserve-symlinks score-verifier-labeled-set.cjs --set <rows file>`: `stop: no headroom`, exit 0. With no `met` row, the false-met rate the arm would improve cannot be measured. The census repeats the phase's recorded clamp finding, `clamp_defects=11`.
- 026, `score-completion-claims.mjs --rows <rows file> --labels ~/.skilled/.labels/026-claims.jsonl`: `regex accuracy: 46 of 50`, `regex false fires: 4` (completed, resolved, fixed and deployed once each), `stop: fewer than 5 labeled yes rows`, exit 0. The false fires are the feature's zero-call answer.
