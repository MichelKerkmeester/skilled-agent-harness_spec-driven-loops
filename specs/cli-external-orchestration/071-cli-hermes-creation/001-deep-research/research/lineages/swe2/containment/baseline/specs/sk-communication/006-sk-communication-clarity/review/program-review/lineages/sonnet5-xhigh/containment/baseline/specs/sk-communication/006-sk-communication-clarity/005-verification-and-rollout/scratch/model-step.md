# Model step, run by the conductor

The harness never calls a model. The conductor fed each generated prompt to the same model under the same settings on both sides, so the two conditions differ only in the rule set inside the prompt.

- Model: `llmgateway/glm-5.3-flash` through `pi -p --offline`, thinking `medium` on both sides, stdin closed, one reply file per case plus a meta file carrying provider and changeKind `n/a`, since no projection ran.
- Before condition: rule set assembled from commit `4512473abdec9c7f0ea02126f85bb5c709b2ac26`, the commit the phase 003 baseline recorded. After condition: the working tree.

## Attempt 1, discarded, kept under `runs/attempt-1/`

Five of fourteen replies came back empty. Three of the frozen case prompts are research descriptions rather than runnable prompts ("Review X", "Run the tests and tell me", "a task where a tangent surfaces"), and the model spent its whole ten-minute budget in open-ended tool use before the alarm killed it. The scorer accepted the empty files as 0.5 rows, and the control "moved" by 0.01 on the scanner's tell count between two honest wordings.

Three harness corrections followed, all in the harness and none in a rule:

1. `cases.json` gained an `operatorPrompt` per case, a concrete instantiation both conditions share. The frozen `prompt` stays verbatim as the case's definition and its observable is unchanged.
2. `score.mjs` refuses an empty reply instead of scoring it.
3. `compare.mjs` judges the control on its observable, the restatement predicate and its blocking flag, and prints its weighted score as information. `release-gate.md` condition 1 says the same.

## Attempt 2

Regenerated both sides from the instantiated prompts with a fifteen-minute alarm. Results under `runs/results/`, masked copies under `runs/blind/`, comparison output in `runs/results/compare.txt`.
