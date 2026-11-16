---
title: "Handover to Barter: the stale capture after a scan, and host capture files"
description: "The stale command routing capture after a skill graph scan was not reproduced in Skilled. This file says what Barter records at the next occurrence, and how Barter holds its own captured routing values in host capture files."
trigger_phrases:
  - "handover to barter stale capture after scan"
  - "barter host capture file command routing baseline"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Barter: the stale capture after a scan, and host capture files

Skilled's session may not write under `barter/ai-speckit`. This file holds the work only a Barter session can do. It answers item 10 of `../../../system-skilled-doctor/001-skill-and-overlay-build/010-fix-barter-repin-handover-items-for-overlay-engine/handover-from-barter-024.md` and item 4 of `../../../system-skilled-doctor/001-skill-and-overlay-build/012-fix-barter-022-handover-items-for-doctor-scripts/handover-from-barter-022.md`.

Nothing here applies until Barter re-pins to a Skilled commit that holds this change. It is in worktree `425-repin-engine-limits-intake` and is not committed yet.

## 1. The stale capture: not reproduced

Skilled ran the report's shape ten times on a private copy of its tree. Each run ran the trusted scan and the capture in one shell command, then captured again 60 seconds later. Five runs first removed `"the stylesheet"` from sk-code's `ROUTER.md` and ran `generate-router-intent-signals.cjs --write`. That keyword decides the `top` of `cmd-design-extract-plain-holdout-01`, one of the two rows Barter inferred. Five runs started a fresh advisor daemon, and five used one that was already running.

All ten runs printed `same`. In the flipped runs the first capture already held the new `top` (`sk-doc`). The lines are in `scratch/repro-results.txt`.

By reading, the default capture's `top` depends only on files: each skill's `graph-metadata.json` and `SKILL.md`, the built scorer and a few data files. It points the scorer at an empty database folder, so it never reads what the scan writes. In every run, no file the capture reads changed between the two captures. Only the scan's own generation file changed. A 200 ms poll on sk-code's `graph-metadata.json` saw only the original and the regenerate write, so no daemon or scan rewrote it.

So in Skilled the capture cannot return a value from before the scan unless a file it reads still holds old bytes. Something in Barter's setup would have to rewrite or delay such a file. That is a hypothesis, not a finding.

## 2. What Barter records at the next occurrence

Record these in the same shell command, before anything else runs:

1. **Where the capture runs.** `node -e "console.log(require('fs').realpathSync('.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs'))"`. A linked `.skilled` makes the capture read the linked checkout's files, not the host's.
2. **The hash of every `graph-metadata.json`** under `.skilled/skills`, taken right after the regenerate step, right after the first capture and right before the second one: `shasum -a 256 .skilled/skills/*/graph-metadata.json`.
3. **Both captures in full**, saved to two files, not only the `top` that changed. Diff their `rows` to name the row.
4. **The advisor processes alive** before and after the scan: `pgrep -fl 'system-skill-advisor-launcher|advisor-server'`.
5. **Any other writer on the tree.** Note a file sync tool, an editor or a watcher that runs on the checkout. A second `apply` or regenerate run started from another shell counts too.

`scratch/repro-capture-after-scan.sh` in this packet records all of this for one run. It takes `--tree`, a copy of the checkout, and refuses to run in a git checkout because it edits files.

## 3. Host capture files

A host with its own hub vocabulary now keeps its own captures beside the upstream ones. Two tests read a host file when one exists, and the upstream file otherwise:

| Test | Upstream file | Host file |
|------|---------------|-----------|
| `tests/command-routing-slice.vitest.ts` | `scripts/routing-accuracy/command-routing-baseline.json` | `scripts/routing-accuracy/command-routing-baseline.host.json` |
| `tests/parity/local-native-divergence-ratchet.vitest.ts` | `tests/parity/fixtures/local-native-approved-divergences.json` | `tests/parity/fixtures/local-native-approved-divergences.host.json` |

Paths are relative to `.skilled/skills/system-skill-advisor/runtime`. Every row stays guarded on the host. A row that moves later still fails the test against the host file.

## 4. What Barter does

1. **Re-pin to the Skilled commit that holds this change.**
2. **Write the two host files from Barter's own checkout**, from the runtime folder:

   ```bash
   node scripts/routing-accuracy/capture-command-routing-baseline.mjs > scripts/routing-accuracy/command-routing-baseline.host.json
   node scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs | tail -n +2 > tests/parity/fixtures/local-native-approved-divergences.host.json
   ```

   The ledger capture prints a one-line summary before the ledger, so `tail -n +2` drops it. Do not use `--write` for either: it writes the upstream file.
3. **Remove the overlays that rewrote single rows** of `command-routing-baseline.json` and `local-native-approved-divergences.json`. The host files replace them.
4. **Run the two tests.** Both should print 0 failed.
5. **Recapture a host file when an intended change moves a row.** The slice test's failure message names the redirect command when it read the host file.

## 5. Limits to know about

- **A host file is read whole.** It replaces the upstream file for that test. It does not merge with it.
- **The ledger capture keeps an approval's reason only when upstream's ledger holds the same entry.** A divergence only Barter has gets the capture's default reason. Edit the reason in the host file by hand when it matters.
- **The runs ran the generator directly, not the overlay engine's `apply`.** Barter's overlays may also write sk-code's `graph-metadata.json`. Skilled's copy had no such overlays.
- **The scan used no embedder in Skilled's runs.** The copy's scan reported `embedded=0 embedFailed=14`, adapter unavailable. The default capture does not read embeddings, so this should not matter for the report. Barter's runs may have taken the embedding path.
