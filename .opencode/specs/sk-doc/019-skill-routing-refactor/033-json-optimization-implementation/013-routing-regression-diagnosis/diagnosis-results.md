# Diagnosis Results — Routing Regression (holdout top-1/top-3, delegation)

Measurement host: main-tree build for the pre-fix numbers; worktree native build
(`capturedAtSha: ba7e798843`) for the post-fix numbers. Both runs use the capture
script's reproducible regime (empty `MK_SKILL_ADVISOR_DB_DIR`, semantic disabled,
`VITEST=true`, lane-weight overrides cleared). Corpus/holdout/ambiguity hashes are
byte-identical to the pins in `../002-baseline-capture/baseline/`, so the
comparison is valid. Raw captures are in `evidence/`.

## 1. Metric set: pin vs pre-fix vs post-fix

| Metric | Pin (sha `1e0ad1d9ba`) | Pre-fix HEAD | Post-fix HEAD | Restored |
|---|---|---|---|---|
| `holdout_top1` | 53/72 | 51/72 | 53/72 | yes |
| `holdout_top3` | 55/72 | 53/72 | 55/72 | yes |
| `buckets.delegation` | 10/11 | 8/11 | 10/11 | yes |
| `full_corpus_top1` | 151/195 | 151/195 | 151/195 | unchanged |
| `full_corpus_top3` | 176/195 | 176/195 | 176/195 | unchanged |
| `ambiguity_top1` | 17/24 | 17/24 | 17/24 | unchanged |
| `buckets.review` | 24/31 | 24/31 | 24/31 | unchanged |
| `buckets.memory_save` | 27/32 | 27/32 | 27/32 | unchanged |

Corpus hashes (identical pin/live): corpus `sha256:9f30cc…4aa677`, holdout
`sha256:88a7f7…bac80a`, ambiguity `sha256:07cd2c…f8214d`.

## 2. Changed prompts — enumerated (REQ-002)

The net `-2` on both holdout and delegation is exactly **two** prompts changing
prediction, not four cancelling to two. Both are `cli-*` delegation cases, and both
appear in the delegation fixture and the holdout set:

| Prompt | Expected | Baseline prediction | Pre-fix prediction | Post-fix prediction |
|---|---|---|---|---|
| `dispatch this to MiniMax-M3` | `cli-opencode` | `cli-opencode` | `sk-prompt` | `cli-opencode` |
| `send it to kimi-for-coding/k2p7` | `cli-opencode` | `cli-opencode` | `null` | `cli-opencode` |

Baseline predictions are established from the pin (captured at sha `1e0ad1d9ba`,
which recorded delegation 10/11 and holdout 53/72) together with the mechanism
proof below: restoring the path returns exactly these two prompts to
`cli-opencode` and no other prompt moves.

The third delegation miss — `delegate to codex` (expected `none`, predicted
`cli-codex`) — is **pre-existing**, not part of this regression: the pin was
10/11 (one miss), and that miss is this codex-abstain case. It is unchanged
before and after the fix, and is out of scope here (noted for phase 018).

## 3. Attribution (REQ-003) — surfaces bisected independently

The program changed two routing surfaces since the pin: (a) eighteen skill-root
metadata files, and (b) three advisor scorer sources
(`executor-delegation.ts`, `lanes/lexical.ts`, `scorer/projection.ts`).

- **`lanes/lexical.ts`** — pure extraction of an inline array into a local; no
  behavioural change. Not the cause.
- **`scorer/projection.ts`** — adds `reduceDerivedPathEntry` (path-noise
  reduction on `key_files`/`source_docs`). Feeds only the lexical keyword lane,
  not the delegation alias table; had zero net effect here (`full_corpus`,
  `ambiguity`, `review`, `memory_save` all held).
- **eighteen metadata files** — the fix left every one of them at the HEAD state
  and the full regression resolved, so the metadata surface contributed **zero**.
  That is the independent bisection: only the scorer surface was reverted, and
  the drop closed completely.
- **`scorer/executor-delegation.ts`** — **the cause.** Its
  `loadFilesystemAliasData` reads the small-model registry from a hardcoded path
  `.opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json`. Commit
  `9efb3fc5612` ("rename both mode packets and keys to the sk- prefix") renamed
  that mode packet directory `prompt-models` → `sk-prompt-models` but did not
  update the scorer's path. At HEAD `existsSync(modelProfilesPath)` is false, the
  model-alias table is empty, and bare model mentions (`MiniMax-M3`, `Kimi`)
  no longer lift to their `cli-opencode` executor.

No movement was left unattributed; nothing is UNKNOWN (REQ-021/CHK-021).

## 4. Caused vs inherited (REQ-004)

**Caused, not inherited.** The pin was captured directly at sha `1e0ad1d9ba`
(`capturedAtSha` in `../002-baseline-capture/baseline/capture-scorer-eval-baseline.stdout.txt`)
and recorded `holdout_top1` 53/72, delegation 10/11 — i.e. the baseline sha
already measured a *healthy* number, not 51/72. The rename commit `9efb3fc5612`
lands after that pin and before HEAD, and reverting its effect on the scorer path
restores the pinned numbers exactly. A literal re-checkout-and-rebuild of
`1e0ad1d9ba` is infeasible (the mcp-server `package.json` is gitignored and not
tracked at that sha, so the toolchain cannot be reconstructed there) and would be
redundant: the pin *is* the baseline-sha measurement, taken at capture time by
the baseline-capture phase. See spec.md Amendment A-001.

## 5. Disposition (REQ-005): FIX

One-line path correction in `executor-delegation.ts`:
`'prompt-models'` → `'sk-prompt-models'`, with a durable comment coupling the
path to the on-disk mode-packet directory name so a future rename cannot silently
re-orphan it. Behind the corpus gate, all three regressed metrics return to their
pinned values with no other metric regressing (§1, REQ-006). No baseline artifact
was re-pinned; `capture-…mjs --write` was never run and `002-baseline-capture/`
is byte-identical (REQ-007, CHK-019).
