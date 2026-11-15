> **Resolved 2026-11-15: PASS 4/4 on the live rerun** (`matrix.md`, `vibe/checkpoints.tsv`).
> Two fixes closed it. The Vibe session reader now seeds from the committed snapshot generation
> that `CURRENT` names, plus the journal tail after `snapshot_sequence`, so a compaction that the
> snapshot absorbed is visible again (`.skilled/hooks/shared/session-readers/vibe.mjs`, reader
> tests 11/11). `compaction-context.mjs` also keeps its watermark under the payload cwd and
> remembers the compaction ids it already injected, because the runner's sandbox denied the
> watermark write into the checkout (session-lifecycle tests 29/29). The rerun recorded
> `compaction-checkpoint-recorded`, `reinjection-with-goal-slice` and
> `history-lookup-offer-injected`. The diagnosis below is kept as the record of the failure.

# VIB-HK-006 diagnosis: the compaction record is not in the journal the detector reads

Verdict: FAIL. The turn-start composer ran on the turn after `/compact` and delivered only its
advisor part, because the detector found no compaction. The cause is in the reader, not in the
scenario.

## What the run showed

Turn `compact` passed: the session journal tree holds one completed manual compaction.

| Fact | Value |
|---|---|
| Checkpoint entry | `checkpoint-compaction-91b7dc41-fc3e-5ed4-8e3c-1b169e126a66` |
| Details | `{"attempt":1,"summaryLength":1500,"trigger":"manual"}` |
| Found in | `chunks/b07a58a7….json` and `chunks/f2ffc17c….json` of the session store |
| Journal tail | `journal/0000000000000074.jsonl`, 667 records, sequences 74 to 740 |
| Generator snapshot | `generations/0000000000000073/checkpoint.json` reads `"compaction_count":1` |
| Detector watermark | no `ed98947a7390fccf.json` under `.skilled/skills/.state/vibe-compaction/`, so the detector never answered this session's compaction |

Turn `reinject` passed the request to a fresh turn start, and the `pre_agent_turn` record for
that turn carries one injected block, the advisor line:

```text
"user_content": [ {…"text":"Thanks. What should I pick up next in this packet?"},
  {"_meta":{"vibe.hookContext":true},"text":"Advisor: live; use system-spec-kit 0.82/0.18 pass."} ]
```

No block carrying `Context restored after a compaction.`, the goal slice or `## History Lookup`
exists anywhere in the store.

## Cause

Vibe writes a generation snapshot at the compaction, and that snapshot takes the journal records
with it: the store's retained journal starts at sequence 74 while `generations/0000000000000073`
already reads `compaction_count` 1. The compaction checkpoint therefore lives in `chunks/*.json`
and `generations/*/`, never in `journal/*.jsonl` when the next turn starts.

The detector reads only the journal directory:

- `.skilled/hooks/shared/session-readers/vibe.mjs:54` `journalFiles()` joins
  `<session root>/journal` and keeps the names matching `/^\d+\.jsonl$/`. Nothing else in the
  store is read.
- `.skilled/hooks/shared/session-readers/vibe.mjs:396` `compactionsSince()` walks
  `session.journalRecords`, which `loadVibeSession` built from those files alone
  (`.skilled/hooks/shared/session-readers/vibe.mjs:288`).
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:282` asks
  `listCompactions(session, watermark?.sequence ?? 0)`, and `:283` returns nothing when the list
  is empty.

The same detector backs `compaction-post-tool.mjs`, so the mid-turn binding reads the same
journal-only view.

## Minimal repro

The repro needs no API key: it builds the store shape the run recorded and calls the reader.

```bash
cd "$(git rev-parse --show-toplevel)" && R=$(mktemp -d) && mkdir -p "$R/journal" "$R/chunks" && node -e '
const fs = require("fs");
const root = process.argv[1];
const entry = { type: "checkpoint", kind: "compaction", id: "checkpoint-compaction-11111111-2222-3333-4444-555555555555", generationStatus: "completed", message: "Context compacted", details: { attempt: 1, summaryLength: 1500, trigger: "manual" } };
fs.writeFileSync(`${root}/chunks/compacted.json`, JSON.stringify([{ sequence: 73, entry }]));
const message = { id: "message-1", type: "message", role: "user", content: [{ type: "text", text: "hello" }] };
fs.writeFileSync(`${root}/journal/0000000000000074.jsonl`, `${JSON.stringify({ sequence: 74, sessionId: "synthetic", type: "projection_delta", payload: { delta: [{ op: "append_entry", entry: message }] } })}\n`);
' "$R" && SESSION_ROOT="$R" node -e '
import("./.skilled/hooks/shared/session-readers/vibe.mjs").then((m) => {
  const session = m.loadVibeSession({ transcriptPath: process.env.SESSION_ROOT });
  console.log("ok:", session.ok);
  console.log("journalRecords:", session.ok ? session.journalRecords.length : session.code);
  console.log("compactionsSince(0):", JSON.stringify(m.compactionsSince(session, 0)));
});'
```

Observed:

```text
ok: true
journalRecords: 1
compactionsSince(0): []
```

The chunk file in the same store holds
`checkpoint-compaction-11111111-2222-3333-4444-555555555555 manual`, so the session has one
completed manual compaction and the detector is given none.

Reproduced on the recorded run as well: `loadVibeSession` returned `ok: true` with 667 journal
records and `compactionsSince(session, 0)` returned `[]`, while the run's chunk store held the
completed `trigger: "manual"` checkpoint above.

## Proposed fix

Teach the reader the rolled store, and key the watermark by compaction id rather than by
sequence:

1. In `.skilled/hooks/shared/session-readers/vibe.mjs`, read `chunks/*.json` as a second source.
   Each file is a JSON array of projected entries, so a `kind: "compaction"` entry with
   `generationStatus: "completed"` is directly comparable with the journal-derived record.
2. Merge the two lists by compaction id in `compactionsSince()`, preferring the journal record
   because it carries a `sequence`, and let a chunk-only record carry the sequence it was
   written under (`generations/<seq>/checkpoint.json` names the generation, and the chunk file
   is listed in that generation's `manifest.json`).
3. Compare the newest compaction with `watermark.compactionId` in
   `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:282` instead of filtering on
   `sequence > watermark.sequence`, so a record whose sequence was rolled away still triggers
   exactly one re-injection.

A cheaper variant, if reading `chunks/` is too broad: treat a rise in a generation's
`checkpoint.json` `compaction_count` as the compaction signal, since the watermark already holds
one entry per session.

Whatever the shape, the re-injection must be provable from a store whose journal has rolled,
because that is what an interactive session hands the hook on the turn after `/compact`.

## Positive control

The same detector injects correctly when the checkpoint is in the journal, so nothing else in
the part is broken. Add the three records a working store would hold to a session root — a
message, the in-progress compaction and its completed replacement — and the detector returns
the whole block:

```bash
cd "$(git rev-parse --show-toplevel)" && R=$(mktemp -d) && mkdir -p "$R/journal" "$R/state" && node -e '
const fs = require("fs");
const root = process.argv[1];
const message = { id: "message-1", type: "message", role: "user", content: [{ type: "text", text: "hello" }] };
const start = { type: "checkpoint", kind: "compaction", id: "checkpoint-compaction-11111111-2222-3333-4444-555555555555", generationStatus: "in_progress", message: "Compacting context", details: { currentContextTokens: 9000, threshold: 10000 } };
const done = { type: "checkpoint", kind: "compaction", id: "checkpoint-compaction-11111111-2222-3333-4444-555555555555", generationStatus: "completed", message: "Context compacted", details: { attempt: 1, summaryLength: 1500, trigger: "manual" } };
const lines = [
  { sequence: 1, sessionId: "synthetic", type: "projection_delta", payload: { delta: [{ op: "append_entry", entry: message }] } },
  { sequence: 2, sessionId: "synthetic", type: "projection_delta", payload: { delta: [{ op: "append_entry", entry: start }] } },
  { sequence: 3, sessionId: "synthetic", type: "projection_delta", payload: { delta: [{ op: "replace_entry", entry: done }] } },
];
fs.writeFileSync(`${root}/journal/0000000000000001.jsonl`, lines.map((line) => JSON.stringify(line)).join("\n") + "\n");
' "$R" && SESSION_ROOT="$R" STATE_DIR="$R/state" VIBE_SPEC_FOLDER="specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios" node -e '
import("./.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs").then((ctx) => {
  const text = ctx.buildCompactionPart(
    { hook_event_name: "pre_agent", session_id: "synthetic", transcript_path: process.env.SESSION_ROOT, cwd: process.cwd() },
    { env: process.env, workspace: process.cwd(), stateDir: process.env.STATE_DIR },
  );
  console.log("length:", text.length);
  console.log("has goal slice:", text.includes("# Goal: Phase 22"));
  console.log("has history offer:", text.includes("## History Lookup"));
});'
```

Observed:

```text
length: 2503
has goal slice: true
has history offer: true
```

So the defect is the reader's scope, not the watermark, the state directory or the slice
renderer: a checkpoint the journal holds produces the exact text this scenario looks for, and
the same checkpoint rolled into the chunk store produces nothing.
