# VIB-HK-007 procedure: an automatic mid-turn compaction needs a model window the runner cannot install

Verdict: **OPERATOR-ONLY**. The automatic compaction fires on the model's context window, and the runner installs the repository's window, so no runner turn can reach the threshold.

The shared conversation runner cannot drive this scenario. The live run recorded the reason:
the session reported `ctx 16.9k/256k` and the journal held no `kind` `compaction` entry, so both
turn checks reported the same blocker.

## Why the runner cannot drive it

The automatic compaction fires on the model's context window, and the runner gives the subject
the repository's window:

1. `prepareVibeHome()` in the runner copies `<checkout>/.vibe/config.toml` into the fresh
   `VIBE_HOME` at launch, and setup commands run before that, so a scenario cannot replace the
   file. The rendered config of the recorded run holds the two roster rows and neither
   `max_context_length` nor `auto_compact_threshold`.
2. A scenario's `env` cannot pin `VIBE_HOME`: the `vibe` adapter's `launch()` sets
   `ctx.scriptEnv.VIBE_HOME` to the home it just created, after the scenario's own keys are in
   place.
3. The interactive launch passes no `--model` (`vibe --help` documents it as headless-only) and
   the runner exposes no launch-argument option, so the fixture's `compaction-probe` row, which
   pins `max_context_length = 20000`, cannot be selected.

Without that row the subject keeps 256k tokens of window, and no prompt a scenario can type
crosses the compaction threshold.

## Manual steps

Run this from the repository root with `MISTRAL_API_KEY` exported.

1. Confirm the fixture exists:
   `.vibe/plugins/repo-guards/fixtures/compaction/config.toml` carries the probe row with
   `max_context_length = 20000`.
2. Bind a packet so the re-injection has a goal slice to carry:
   `export VIBE_SPEC_FOLDER=specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios`.
3. Run the recorded forced-compaction fixture:
   `bash specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/018-vibe-compaction-context/scratch/forced-compaction/run.sh`.
   It creates its own `VIBE_HOME` and `--output-dir`, renders this checkout's hooks, and sends a
   prompt that reads a document large enough to cross the probe window before the turn answers.
4. Find the session store the script printed, then read the compaction and the tool call after
   it:

   ```bash
   node -e '
   const fs = require("fs");
   const root = process.argv[1];
   for (const line of fs.readFileSync(root + "/journal/0000000000000001.jsonl", "utf8").split("\n").filter(Boolean)) {
     const record = JSON.parse(line);
     for (const op of record.payload?.delta ?? []) {
       const entry = op.entry ?? {};
       if (entry.kind === "compaction") console.log("COMPACTION", entry.id, entry.generationStatus, JSON.stringify(entry.details));
     }
     for (const block of record.payload?.result?.result?.output?.tool_result?.content ?? []) {
       if (String(block.text).includes("Context restored after a compaction.")) {
         console.log("REINJECTION at sequence", record.sequence, String(block.text).slice(0, 80));
       }
     }
   }
   ' <session-root>
   ```

   The phase 018 record of this run prints one `COMPACTION` line for
   `checkpoint-compaction-08aac491-…` and then one `REINJECTION` line at the `read_file` call
   that followed it.

## What a passing record shows

- One `kind` `compaction` checkpoint with `generationStatus` completed in the session journal.
- One tool result after it carrying `Context restored after a compaction.` and the packet's
  `# Goal:` slice, which is the injection `compaction-post-tool.mjs` added to the tool result.
- A watermark file under `.skilled/skills/.state/vibe-compaction/` whose `compactionId` names
  that checkpoint.

## Known limit on the operator run

The detector reads `<session root>/journal/*.jsonl` only. When a session's store rolls its
journal and folds the records into `chunks/` and `generations/`, the checkpoint is no longer
visible and no injection happens; that is what the recorded `VIB-HK-006` run shows and what its
diagnosis proposes to fix. Keep the forced run to one turn so the checkpoint stays in the journal
tail, as the phase 018 record does.
