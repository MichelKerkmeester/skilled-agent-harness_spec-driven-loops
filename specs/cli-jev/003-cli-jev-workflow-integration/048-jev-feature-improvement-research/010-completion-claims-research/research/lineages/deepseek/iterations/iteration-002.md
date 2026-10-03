# Iteration 2: Q2 - how to raise accuracy or lower cost

## Focus

Enumerate and quantify accuracy and cost levers for the detector and the judge, using the recorded 047 run artifacts (no new model calls).

## Findings

### F2-01 - The threshold is a zero-call lever that flips the verdict

Replaying the recorded 331 nouls with the same modal call rule but a yes threshold of 0.7 (instead of `YES_THRESHOLD = 0.5`) gives A=104, L=1, A-B=11: margin passes at exact equality (10*11 = 110), the sign test passes (pWin = 0.001709), F=0, so the verdict would be `keep` on the same calls. At 0.6 or 0.65 the margin still fails at A-B=10. This is post-hoc tuning on the measured corpus, and the margin passes exactly at its boundary, so a held-out check is required before trusting it (see Q3).
[SOURCE: score-completion-claims.mjs:53-54,465-472]
[SOURCE: replay of ~/.skilled/.labels/runs/047-026-jev-20261002/calls.jsonl]

### F2-02 - One added word catches three claims for free

Adding `complete` to the pattern catches 3 of the 10 missed claims ("The goal is complete") with no new false fire: TP 0->3, FP stays 7, FN 10->7, accuracy 0.8455->0.8727. The pattern already ships `completed` but not `complete`.
[SOURCE: completion-evidence-sentinel.cjs:64]
[SOURCE: in-memory replay over 026-rows.jsonl x 026-labels-047.jsonl]

### F2-03 - Closing-position anchoring trades nothing

Scoring the match inside only the last 160 characters cuts false fires 7->3 with recall unchanged: accuracy 0.8455->0.8818. The four recovered false fires sat mid-tail (a checklist item, a status table, a variable assignment, a failure report); all seven share those shapes.
[SOURCE: completion-evidence-sentinel.cjs:113-119]
[SOURCE: in-memory replay with a 160-char closing slice]

### F2-04 - Vocabulary without context swings precision

A broad candidate list (complete|done|committed|pushed|passes|green|clean|ready|verified|nothing left) reaches TP 9/10 but FP 18: accuracy falls to 0.8273 and precision to 9/27. Vocabulary must ship with context rules and a call threshold, not alone.
[SOURCE: in-memory replay over the labeled corpus]

### F2-05 - The judge is not a recall fix by itself

At its 0.5 call rule the judge is 102/110 correct: yes on 6/10 claims (recall 0.6) and on 4/100 non-claims. Its 13 wins split into 7 false-fire rejections plus 6 claim catches; its 4 losses include one 0.95 call on a Pi tail ending in raw output ("done / Errors: 0 / RESULT: PASSED") labeled no — a boundary the label treats as harness output, not a claim.
[SOURCE: calls.jsonl replay joined to labels; rows pi-cc3cc010bbef, claude-17fb882878fc, pi-6d04941605f5, pi-9a42c7527ae9]

### F2-06 - Reruns are unearned on this corpus

F=0: all 110 rows voted unanimously across three passes. A one-call-per-row design (110+1 calls) would have reproduced the same column at a third of the calls; reruns should be reserved for rows whose scores sit near the call threshold.
[SOURCE: 047 stdout "flips: 0"; calls.jsonl shows no split rows]

### F2-07 - Measured per-call cost

331 calls, all measured: mean 329 ms, p50 320 ms, p95 391 ms; Pi rows p50 319 ms vs Claude 320 ms; estimated payload 24,735 input tokens (~75 tokens per judgment). No unmeasured rows and no visible retries.
[SOURCE: 047 stdout; calls.jsonl aggregation]

### F2-08 - Batching does not reduce row calls

The pinned CLI has `choice` (keyed yes/no) and `run` (batched questions), but `run` takes one state and several questions — it does not merge distinct states, so per-row call count is unchanged. Real levers are gating the judge (run it only when the regex is silent or ambiguous) and threshold/rerun shaping.
[SOURCE: .skilled/skills/cli-classifier/cli-jev/references/cli-reference.md:46-49,96-98]

## Sources Consulted

- `~/.skilled/.labels/runs/047-026-jev-20261002/calls.jsonl`, `report.json`, `~/.skilled/.labels/runs/047-026-jev.stdout.txt` (read-only)
- `.skilled/skills/cli-classifier/cli-jev/references/cli-reference.md`, `cli-jev/SKILL.md`
- `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` (lines 53-54, 465-472, 508-532)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` (lines 60-64, 113-119)
- Commands: threshold replay + vocabulary/context replay + W/L join over the recorded calls (all in-memory, no writes, no model calls)

## Assessment

- newInfoRatio: 0.80
- Novelty justification: The threshold replay shows the margin verdict is not fixed by the judge's information — the same calls keep at a 0.7 call rule — and the pattern replays convert "missing claims" into a short, testable vocabulary and context list; both are new to this packet.
- Confidence: high on the replays (recorded inputs, deterministic scripts); medium on production effect, because the threshold and patterns were tuned on the same 110 rows that measure them.

## Reflection

- Worked: replaying the recorded calls instead of re-calling the model — exact, free, and honest about what the same evidence supports.
- Failed: broad vocabulary expansion alone; it buys recall by tripling false fires.
- Ruled out: per-row batching as a cost lever (`run` is one state, many questions); single-rerun as a universal default (F=0 is corpus-specific).

## Recommended Next Focus

Q3: what makes this measurement trustworthy or not — label provenance and class balance, corpus-vs-hook input mismatch, tuning risk, and what a stronger protocol would pin.
