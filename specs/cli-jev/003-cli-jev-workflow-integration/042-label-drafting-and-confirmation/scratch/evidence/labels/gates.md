# Label gates: draws, baselines and zero-call results

Every command below ran from the worktree root on 2026-10-01 with no `--jev` and no `--deem`, so no model, `jev` or Deem call was made. Each feature's method, arbiter rulings and checks are in its `NNN-decisions.md` beside this file.

## Draws

| Feature | Command | Result |
|---|---|---|
| 003 / 026 | `build-verifier-fixture.cjs --pi ~/.pi/agent/sessions --out .skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | `rows=50 pi=50 claude=0`, exit 0 |
| 029 | `score-severity-replay.cjs --write-label-sheet <scratchpad>` | 95 rows, exit 0 |
| 030 | `score-fanout-pairs.cjs --write-pair-sheet <scratchpad>` | 60 rows, all cross-body, exit 0 |
| 032 | `cite-drift-scan.mjs --draw --seed 20260929 --labels <scratch/build>` | `rows=40 live=20 constructed=20 commit=ebcc68e8edb4`, exit 0 |
| 034 | `hvr_reader_lens.py --draw --seed 20260929 --labels <scratch/build>` | 50 rows per category, `candidate_rows` 0, 2 and 25, exit 0 |
| 006, 023, 027, 035 | none | The rows existed. 006's 100 rows and 035's 90 rows are committed, 023's 24 rows come from `../../tools/list-023-rows.mjs --take 24`, and 027's 5 rows are the census sample |
| 031 | none | The census mines 0 rows. 36 rows were authored from 36 fix commits, see `031-decisions.md` |

## Baselines before labeling

| Label file | State at HEAD `ebcc68e8ed` |
|---|---|
| `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` | sha256 `a894d36672e121d066d60935532846c6d1f834bea3133a20e2d4b281973eac3d`, every label null |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl` | sha256 `e2084693bd4cf804644abe880d3842bcd51026f856a841a80326a68e8af55d29`, 60 natural labels null |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/planted.jsonl` | sha256 `ba0e64ffceaf571ab37803116dd9b4a963c4a7cd689a2c4e89179f28dfac01e6`, 30 sentences null |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl` | absent |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr-reader-lens-labels.jsonl` | absent |
| `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | absent (untracked, excluded) |
| `~/.skilled/.labels/026-claims.jsonl`, `029-labels.jsonl`, `030-labels.jsonl`, `031-fixture.jsonl` | absent; folder created for this phase, mode 700 |
| `027-gold-reads.jsonl`, `023-labels.jsonl` (this folder) | absent |

## Zero-call gate results

| Feature | Label file | Gate line | Reading |
|---|---|---|---|
| 003 | rows file `label` field | `stop: no headroom` | 0 met, 47 not_met, 3 blocked: no false-met rate to improve |
| 006 | committed rows file | `labeled=98`, rule 4 F1 0.8299, rule 5 F1 0.0263, `labeled_violation_rate=79/98` | No numeric gate. The lint misses nearly every rule 5 failure |
| 023 | `023-labels.jsonl` | `labeled: 24`, `baseline agreement: 101/168 = 0.6012`, `planned calls: deem=168 jev=505` | Gate open |
| 026 | `~/.skilled/.labels/026-claims.jsonl` | `stop: fewer than 5 labeled yes rows` | 0 claims in 50 turns, regex false fires 4 |
| 027 | `027-gold-reads.jsonl` | not consulted on a default run | The written reads disagree with the derived gold on 3 of 5, so a switched run would stop |
| 029 | `~/.skilled/.labels/029-labels.jsonl` | `gate: open K=95 negatives=22` | Recorded severity right on 73 of 95 |
| 030 | `~/.skilled/.labels/030-labels.jsonl` | `planned calls: jev 181, deem 120` | Gate open. The merge is right only on the 12 `different` pairs |
| 031 | `~/.skilled/.labels/031-fixture.jsonl` | `fixture: rows=36`, `baseline: read_code 29/36`, keep-rule line | Gate open, 29/36 is under the no-headroom line |
| 032 | `cite-drift-labels.jsonl` | `headroom: baseline=0.3250 margin=0.10` | Gate open. 11 of 20 live citations drifted |
| 034 | `hvr-reader-lens-labels.jsonl` | `stop: fewer than 2 categories can pass` | No headroom in any category |
| 035 | `labels.jsonl` + `planted.jsonl` | `headroom: baseline wrong on 34 of 90 rows` | Gate open. The lexical screen caught 1 of 30 planted sentences |

## Single-draft rows

`../../compare/summary.txt` marks 12 rows `single-draft`. Every one has a second draft, and none was lost to a labeler skipping it. There are two reasons.

1. SWE 2 max printed its first JSON row on the same line as its progress text, for example `...Reading the blind rows file now.{"id":"d01",...}`. The draft parser reads only lines that open with `{`, so it skipped that row. The value is in the raw output under `<scratchpad>/w14/drafts/NNN-swe.last.txt`. This hit eight rows from seven drafts, since 003 and 026 share one.
2. Luna 6 max rewrote four 006 row ids into paths that do not exist, such as `036-cli-lineage-nesting-and-containment-guard` for `036-deep-loop-innovation/028-cli-lineage-nesting-and-containment-guard`. Its values sit under those wrong ids in `../../drafts/006-luna.jsonl`.

| Feature | Row | Luna | SWE | Arbiter | With both drafts |
|---|---|---|---|---|---|
| 003 | `pi-9a32cf569778` | not_met | not_met (recovered) | not_met | agreed |
| 026 | `pi-9a32cf569778` | no | no (recovered) | no | agreed |
| 006 | `071-.../002-hermes-contract-pin/goal.md:88` | true/true | false/false (recovered) | false/false | split |
| 006 | `hooks/016-.../goal.md:96` | false/false (wrong id) | false/false | false/false | agreed |
| 006 | `036-.../011-restore-never-through-symlink/goal.md:81` | true/true (wrong id) | true/true | false/false | agreed, flipped |
| 006 | `036-.../028-cli-lineage-nesting-and-containment-guard/goal.md:71` | false/false (wrong id) | true/false | false/false | split |
| 006 | `033-.../001-goal-unification-research/goal.md:78` | false/false (wrong id) | false/false | false/false | agreed |
| 029 | F001 | not_a_finding | real (recovered) | not_a_finding | split |
| 031 | d01 | reproduce | instrument (recovered) | reproduce | split |
| 034-a | SY01 | no | no (recovered) | no | agreed |
| 034-b | FA01 | no | no (recovered) | no | agreed |
| 035 | N01 | clean | clean (recovered) | clean | agreed |

No recovered draft was matched to its row before the arbiter ran. The arbiter judged every row from its source, so a recovered draft changes no label. Three recovered drafts disagree with the arbiter: 006 `goal.md:88`, 029 F001 and 031 d01. Each feature's decisions log records the arbiter's ruling for its row.
