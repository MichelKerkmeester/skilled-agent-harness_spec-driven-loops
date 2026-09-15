# Reply harness

Mechanical plumbing for the reply comparison. No script here calls a model, the model step belongs to the operator.

## What each piece does

- `cases.json`. The frozen case set. One entry per case plus the negative control, copied word for word from the measurement baseline. Every scoring script reads it and refuses a malformed copy rather than skipping one.
- `rubric.json`. Seven weighted dimensions whose weights sum to 1, plus one blocking class. A reply that loses the observable its case keys on fails its row regardless of score. Nothing in this file names a condition, a commit or a date, so a judge reading it learns nothing about which side it scores.
- `generate-prompts.mjs`. Builds one prompt file per case under `--out`, plus a `manifest.json` recording the condition, the rule-set source, the case ids, the rule file hashes, the hash of `cases.json` and the time. Every subprocess it and `score.mjs` start carries a timeout, so an unattended run ends on its own. With `--condition before` it assembles the rule set from the recorded commit with `git show`. With `--condition after` it reads the same paths from the working tree. Both sides get the same system section: the repository root doc section 8, the root rules file and every file under its rules folder.
- `score.mjs`. Scores one reply per case. Takes `--condition`, `--replies` and `--out`, plus `--prompts` naming the prompts directory the replies answered. With `--prompts` it refuses to score when `cases.json` no longer matches the `casesHash` the prompt manifest recorded, or when the manifest was generated for the other condition, so a case edited mid-run stops the run instead of skewing it. Runs the scanner over each reply through a temp file and counts findings by severity, then applies one deterministic predicate per case. It weighs the dimensions and records whether the blocking class fired. A reply may carry a `<caseId>.meta.json` with the provider and the change kind. Rows whose change kind is `no-op` land under their own key, apart from the rule rows. A malformed case set or a missing reply stops the run with a non-zero exit and a message naming the file.
- `blind.mjs`. Takes `--a`, `--b` and `--out`. Copies both replies for each case under random labels A and B into masked files that carry no provenance, and writes the order record mapping labels back to conditions under a separate sealed file. This is the bare text a judge, human or model, reads.
- `compare.mjs`. Takes `--before` and `--after` results files. Prints the per-dimension delta for every dimension including the ones that did not move, the control's scores on both sides, the count of no-op rows on each side and the after-side blocking rows. Exits non-zero when the control moved or a blocking class fired on the after side.
- `release-gate.md`. The observable conditions the comparison must satisfy, each naming the command or artifact behind it, plus the gap.

## Run order

1. `node generate-prompts.mjs --condition before --out <before prompts dir>` and the same with `--condition after` into its own directory. Use one directory per condition.
2. Feed each prompt file to a model by hand. Save each reply as `<caseId>.md` in a replies directory. A reply may carry a `<caseId>.meta.json` beside it. Keep the control's reply out of the no-op kind or the comparison loses its control row.
3. `node score.mjs --condition <condition> --replies <replies dir> --prompts <prompts dir> --out results/<condition>.json`
4. `node blind.mjs --a <before replies dir> --b <after replies dir> --out <masked dir>` when a blinded judge reads the replies. The judge scores by `rubric.json` outside these scripts.
5. `node compare.mjs --before results/before.json --after results/after.json`

The predicate mechanics are plain text checks over the reply. The retention check for the coverage case reads the backticked tokens in the case prompt as the items asked for, and the frozen prompts carry none, so on these cases the cap side carries the check and the judge weighs retention. A reply that declares nothing open needs no closing next-action line. A reply that declares something open must close by naming one genuinely open step.
