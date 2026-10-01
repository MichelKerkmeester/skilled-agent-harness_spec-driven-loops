---
title: "Alignment suggestion measurement"
description: "Measures, with zero model calls on the default run, whether a classifier picking one listed spec folder would beat the plain baseline when a save's alignment score falls below 50, then prints one verdict per opt-in arm."
trigger_phrases:
  - "alignment suggestion measurement"
  - "score-alignment-suggestion.ts"
  - "alignment suggestion scorer"
  - "alignment folder suggestion"
version: 2.4.0.0
---

# Alignment suggestion measurement (score-alignment-suggestion.ts)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures, with zero model calls on the default run, whether a classifier picking one listed spec folder would beat the plain baseline when a save's alignment score falls below 50, then prints one verdict per opt-in arm.

When a save's alignment score is below 50, the validator lists other spec folders. The script measures offline whether a classifier picking one listed folder would beat the plain baseline. It never wires a pick into a save. It holds no credential and reads none, and nothing is served: a live pick needs a later change, a `keep` and the operator's call.

---

## 2. HOW IT WORKS

### Zero-Call Default

Run it from `.skilled/skills/system-spec-kit/runtime/cli` as `npx tsx evals/score-alignment-suggestion.ts [switches]`. With no switch, or with `--report <dir>`, the run makes zero model calls and never starts `jev` or `cli-deem`. It counts alignment saves in tracked repository files, source code skipped, per save path, `cli` (the interactive `validateContentAlignment`) and `data` (`validateFolderAlignment`), then replays both paths. The run prints `census source: tracked files via git grep, source code skipped`, `committed: files=<n> events=<n> skipped_source=<n>`, `committed path cli: ... below50=<n> ...`, `committed path data: ...`, `replay cli: validateContentAlignment root=specs ...` and `replay data: validateFolderAlignment root=synthetic ...`.

A `--report`, `--rows-out` or `--out` path inside the repository is refused with `refused: --<flag> path is inside the repository` and exit 2. `--report <dir>` writes `report.json` with counts only. `--transcripts <dir>` counts events in transcripts the operator names. `--rows-out <file>`, which needs `--transcripts`, writes one row per low or infrastructure event that lists alternatives, with an empty `label` for the operator to fill.

### The Label Gate

Only the operator writes labels. `--score <rows file>` runs alone. With fewer than 30 labeled rows it prints `stop: fewer than 30 labeled rows (<n> labeled)` and exits 0 with no model call.

### The Two Arms

`--jev` and `--deem` need `--score` and `--out <dir>`, else exit 2. Jev runs first. Its gate prints `jev: path=<path> provider=<provider>` and needs `jev --version` to print `jev 0.6.2`, `jev auth status --provider <p>` to exit 0, and `--accept-payload`, because the payload is the operator's session summaries. A failed check prints one line: `jev arm skipped: jev not on PATH`, `version`, `no credential` or `payload not accepted`. Deem needs `cli-deem health` to pass, else `deem arm skipped: <reason>`. A skip changes nothing else.

### The Keep Rule And Verdict

The keep rule is fixed in code and printed before any call: `keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M`. Each arm prints one `verdict <jev|deem>: keep|kill|stop ...` line with `K= M= A= B= W= L= F= p= baseline=` and writes `report.json` and `calls.jsonl` under `--out`. Today the run stops at its label gate, because no operator labels exist yet, and a live Jev run waits on the operator's yes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | Script | Counts the alignment saves, replays both validator paths, runs the label gate and the two opt-in arms, and prints the verdict lines |
| `runtime/cli/spec-folder/alignment-validator.ts` | Shared | Read only: the script replays `validateContentAlignment`, `validateFolderAlignment` and `isArchiveFolder` from here |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` | Vitest | 42 cases, run from `runtime/cli` as `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts`, with every backend in the file a stub |
| `../../manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md` | Manual playbook | Playbook scenario 461 for the alignment suggestion measurement |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/alignment-suggestion-measurement.md`
