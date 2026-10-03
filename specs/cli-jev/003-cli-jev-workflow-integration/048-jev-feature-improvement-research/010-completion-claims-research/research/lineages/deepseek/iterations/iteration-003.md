# Iteration 3: Q3 - how to make the measurement more trustworthy

## Focus

Assess the 047 measurement's trustworthiness — label provenance, class balance, corpus-vs-consumer input, parameter tuning, and what a stronger protocol would pin — using 042/047 packet docs and the recorded run artifacts.

## Findings

### F3-01 - One runtime supplies every positive

All 10 label-yes rows are Claude turns. The 50-row Pi draw held 0 yes and closed 026 at its gate in 042 ("At least 5 labeled yes rows; 50 drawn rows held 0"); the run became possible only when 60 Claude turns supplied 10 positives. Class balance is 1:10, so every judged-column claim metric moves in 10-point steps — the judge's 6/10 claim recall is one row from 7/10.
[SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md:55]
[SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/spec.md:86]
[SOURCE: computed id-join over 026-rows.jsonl and 026-labels-047.jsonl]

### F3-02 - Labels are arbiter-decided, not operator-confirmed per row

042's ADR-001 replaced the chat review: the operator first said "Let fresh opus 5.5 xhigh decide", then "Opus decides, you see a digest", then "Opus medium", one arbiter at a time. Two blind drafters (Luna 6 max on cli-codex, SWE 2 max on cli-devin) supplied drafts; the label file was written by parser from the arbiter's output. The operator holds a veto, not a per-row confirmation.
[SOURCE: 042 spec.md:42-44]
[SOURCE: 042 implementation-summary.md:57,91]

### F3-03 - The label file drops provenance

Every row of `026-labels-047.jsonl` carries exactly `{id, claim}`: no labeler field, no rubric, no timestamp, no confidence. The scorer records only the file's sha256. A reader of the run alone cannot tell who decided a row or on what evidence; that basis lives in 042's decisions log outside the label file.
[SOURCE: ~/.skilled/.labels/026-labels-047.jsonl]
[SOURCE: report.json (labelsSha256 only)]

### F3-04 - The run replays exactly from recorded artifacts

`report.json` carries rowsSha256, labelsSha256, the census, the regex counts, the gate, exact BigInt-derived pWin/pLoss, latency, and jevVersion/provider/model. `calls.jsonl` carries all 331 calls. Independent replay reproduces A=102 B=93 W=13 L=4 F=0 and both tails exactly, so the arithmetic is auditable rather than trusted.
[SOURCE: ~/.skilled/.labels/runs/047-026-jev-20261002/report.json, calls.jsonl]
[SOURCE: independent replay of the exported functions]

### F3-05 - Corpus-vs-consumer input is not pinned

The scorer reads `raw_text` tails; the hooks feed the last assistant message (pi hook `claimTextFrom`; the Claude hook's stdin payload). The rows file carries only `objective` and `raw_text`, names no extractor, and no extractor exists in the repo. Rows whose tails are raw command output (pi-cc3cc010bbef: "done / Errors: 0 / RESULT: PASSED", labeled no) show the agent-prose vs harness-output boundary changes both the label and the detector's read.
[SOURCE: score-completion-claims.mjs:96-126]
[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts:27-31]
[SOURCE: ~/.skilled/.labels/026-rows.jsonl row pi-cc3cc010bbef]

### F3-06 - The verdict is tuned-parameter sensitive, and the tuning is post-hoc

The same 331 calls stop (margin) at YES_THRESHOLD 0.5 and keep at 0.7, at exact margin equality (A-B=11, 10*11 = 110). The keep rule and the margin line are fixed before the run; the call threshold and the pattern vocabulary are not frozen per run, so a "keep" produced by retuning would not be pre-registered evidence.
[SOURCE: score-completion-claims.mjs:53-54,480-489]
[SOURCE: replay of calls.jsonl at thresholds 0.5/0.6/0.65/0.7]

### F3-07 - No held-out set or live-corpus canary

The vitest suite pins synthetic fixtures — a 400-char-before-end edge, a flips stop, a margin stop, a keep — with a stub jev binary; it never touches the 110-row corpus. Nothing external anchors the live run, and the Q2 levers were tuned on the same rows the run scores.
[SOURCE: .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts:141,312,348,356]
[SOURCE: .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts:44-56 (stub)]

### F3-08 - Cost is recorded beside the rule, not inside it

Latency p50/p95 and call counts are recorded in report.json and stdout, but the keep rule tests accuracy delta alone (0.10 margin); its stated purpose includes "worth its cost" (README). A judge that is cheap and nearly break-even still stops (margin) — and a default-on decision would want measured cost inside the rule.
[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/README.md:39-43]
[SOURCE: report.json columns.jev.latency; score-completion-claims.mjs:480-489]

## Sources Consulted

- 042 packet: `spec.md` (label method, ADR-001), `implementation-summary.md`
- 047 packet: `spec.md`, `scratch/evidence/results.md`
- `~/.skilled/.labels/026-labels-047.jsonl`, `026-rows.jsonl`, `runs/047-026-jev-20261002/{report.json,calls.jsonl}`
- `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts`
- Commands: provenance greps; threshold replay; label/row joins (all read-only)

## Assessment

- newInfoRatio: 0.82
- Novelty justification: Separates what is already strong (replayable arithmetic, recorded calls) from what is weak (one-runtime positives, arbiter-decided labels with dropped provenance, unpinned corpus extraction, post-hoc tunables), which the 047 row alone does not show.
- Confidence: high on provenance and replay findings; medium on the production-impact reading of F3-05 (hooks' exact payloads are pinned by hook code, but no run logs what text a hook actually passed).

## Reflection

- Worked: reading the label method from 042's own record instead of guessing from the label file; replay for arithmetic trust.
- Failed: hunting for a corpus extractor in-repo — it does not exist, which is itself the finding.
- Ruled out: treating the labels as operator-confirmed at row level; ADR-001 is explicit that they are not.

## Recommended Next Focus

Q4: locate the other places in .skilled where this same judgment (does this text claim completion / should this gate fire) pays off, with concrete surfaces and file:line evidence.
