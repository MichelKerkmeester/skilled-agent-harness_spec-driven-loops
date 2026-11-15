# Live hop

One Claude Code hop under `skilled-loop` (Sonnet, medium effort), run `lookup-after-r5` of the hop-recall harness.

- Sender session: `af022209-55f6-445f-8c7c-a7d3a53e48af`
- Receiver session: `e0fe5978-fce2-461a-a545-c343125737f8`
- The claim output carried `## History Lookup` after the note body.
- Command the receiver ran, copied from the section:

```
(cd "$(git rev-parse --show-toplevel)" && node .skilled/hooks/session-handover/bin/history-lookup.mjs --session 'af022209-55f6-445f-8c7c-a7d3a53e48af' --handle 'hl1_b881fdfb05b5391099628de199b4e221' search '{"query":"K073"}')
```

- Reply: a `references` list whose first entry is the sender's model turn that printed the codes, with a preview that holds `K073`.
- Receiver's answer to the question: `PDSNMMBW`, which is the correct code. The note did not hold it (`note_leaked=0`).

Evidence: `../../001-hop-recall-baseline/scratch/runs/lookup-after-r5/`.
