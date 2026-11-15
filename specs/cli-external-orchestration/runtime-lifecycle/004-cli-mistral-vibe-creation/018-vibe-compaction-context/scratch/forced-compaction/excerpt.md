# Forced-compaction run: the re-injection lands after the compaction

Run 2026-11-14 on `vibe 3.1.2`, `compaction-probe`, from a scratch cwd with the
rendered home hooks, `VIBE_SPEC_FOLDER` bound to this packet and phase 014's
small-window config.

## Command shape

```bash
bash specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/018-vibe-compaction-context/scratch/forced-compaction/run.sh
```

`run.sh` exports `VIBE_SPEC_FOLDER`, then calls
`.vibe/plugins/repo-guards/fixtures/run-fixture.sh` with `hooks.toml` (the
rendered home copy), `prompt.txt`, the `compaction-probe` alias and
`.vibe/plugins/repo-guards/fixtures/compaction/config.toml`. The script creates
its own fresh `VIBE_HOME` and `--output-dir` under `mktemp`.

The prompt opens with the instruction to read `lines.txt` with the file read
tool and stop, then carries 1,200 padding lines. The padding crosses the 10,000
token floor the fixture window sets, so the first completion compacts before it
answers.

## Outcome record

`export.json` records `exit_code` `0`, `outcome` `finished` and
`vibe_version` `3.1.2`.

## Journal

`session/journal/0000000000000001.jsonl` holds one automatic compaction:

```text
COMPACTION replace_entry checkpoint-compaction-08aac491-e815-5d50-8ee1-413cfb2eada5 completed {"attempt":1,"summaryLength":1217,"trigger":"automatic"}
```

The next tool call is the `read_file` at sequence 34. Its `post_tool_call`
result carries a second text block, the detector's re-injection:

```text
Context restored after a compaction.

# Goal: Phase 18: vibe-compaction-context

## DURABLE DIRECTIVE

**Objective:** Give a Vibe session its goal slice, history lookup offer and handoff pointer back once after every compaction.
```

`session/journal/0000000000000048.jsonl` is the empty second journal file Vibe
created; the run wrote no record into it.

## Watermark

`watermark.json` is the detector's state file for this session:

```json
{"compactionId":"08aac491-e815-5d50-8ee1-413cfb2eada5","sequence":14}
```

It names the compaction the injection answered, and its sequence is the
completed record's own sequence.

## Re-read

```bash
node -e '
const fs=require("fs");
for (const line of fs.readFileSync("session/journal/0000000000000001.jsonl","utf8").split("\n").filter(Boolean)) {
  const rec=JSON.parse(line);
  if (rec.sequence === 14) for (const op of rec.payload?.delta ?? []) {
    const e=op.entry ?? {};
    if (e.kind === "compaction") console.log("COMPACTION", e.id, e.generationStatus);
  }
  if (rec.sequence === 34) for (const block of rec.payload?.result?.result?.output?.tool_result?.content ?? []) {
    if (String(block.text).includes("**Objective:**")) console.log("INJECTION", String(block.text).slice(0, 80));
  }
}
'
```

Observed: `COMPACTION checkpoint-compaction-08aac491-e815-5d50-8ee1-413cfb2eada5 completed`
then `INJECTION Context restored after a compaction.`
