READ-ONLY deep-context verification seat. Read/Grep only. Return ONLY findings JSON after BINDING lines. Never write files.

## gather-subject
Deprecate `.opencode/skills/cli-devin`; remove all ACTIVE references. THIS iteration = the deep-improvement model-benchmark RUNTIME CODE (the second executor router that supports cli-devin) + classify its benchmark methodology/state docs as active vs historical.

## shared current_focus — iteration 7 of 10 — SLICE cluster 7: deep-improvement model-benchmark code
1. `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` — the executor router flagged in iter3. Read it: find every cli-devin / devin / DEVIN branch, the supported-executors list/const, binary/flag mapping, and the exact edit (delete branch / remove from list). This is LIVE code — a missed branch routes to a non-existent skill. [HARD]
2. `.opencode/skills/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` (5 hits) + any other model-benchmark test — classify: are these test FIXTURES that must change, or historical eval records?
3. `.opencode/skills/deep-improvement/feature_catalog/04--model-benchmark-mode/model-dispatcher.md` — doc for the dispatcher; remove cli-devin from supported list.
4. `.opencode/skills/deep-improvement/references/model-benchmark/mixed_executor_methodology.md` (19 hits) — CLASSIFY: is this an active methodology doc (edit) or a historical benchmark write-up (leave)? Read enough to decide.
5. `.opencode/skills/deep-improvement/SKILL.md` — cli-devin in active executor options vs historical benchmark prose.
6. Grep `.opencode/skills/deep-improvement/` for any other cli-devin/devin ACTIVE site (exclude benchmarks/*/state/*.jsonl + eval outputs = historical).

## known-context
Iter3 found start-model-benchmark-loop.md + start-agent-improvement-loop.md reference dispatch-model.cjs's cli-devin executor support — so dispatch-model.cjs HAS a cli-devin branch. Confirm + line-resolve it. The deep-improvement benchmarks/ dirs contain MANY historical state/jsonl/eval files that mention cli-devin (the swe-1.6 benchmark runs) — these are historical-record, LEAVE them; only flag ACTIVE code/docs.

## output schema — ONLY this JSON after BINDING lines
```json
{ "findings": [
  { "path":"...", "symbol":"...", "kind":"integration_point|dependency|gap", "reuse":"remove|leave",
    "evidence":"path:line(s)", "relevance":0.0, "classification":"active-wiring|historical-record", "verified":true,
    "editType":"delete-branch|inline-edit|leave", "notes":"exact edit OR why-historical" } ] }
```
BINDING lines first (slice=deep-improvement-benchmark). Tool budget ~10-12.
