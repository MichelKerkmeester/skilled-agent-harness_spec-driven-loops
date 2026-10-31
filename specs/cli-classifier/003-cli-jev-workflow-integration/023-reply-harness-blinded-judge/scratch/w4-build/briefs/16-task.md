TASK: create the skill's next changelog entry, a new file whose full text is given below.
F = .skilled/skills/sk-communication/changelog/v1.4.0.0.md (new; the only file you create). The folder holds `v1.0.0.0.md` to `v1.3.0.0.md`; do not touch them.
Write F with exactly the text between the two fence lines below: no fence lines, nothing added, nothing reworded, one trailing newline.
```markdown
---
title: "sk-communication v1.4.0.0, An Offline Check for Model Judges"
description: "Adds judge-agreement.mjs, which measures offline whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores."
trigger_phrases:
  - "sk-communication v1.4.0.0"
  - "sk-communication 1.4.0.0"
  - "offline check for model judges"
  - "label gate"
importance_tier: "normal"
contextType: "general"
version: 1.4.0.0
---
# 1.4.0.0, An Offline Check for Model Judges

The reply comparison can now test a model judge before anyone trusts one. A new script measures whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores, and it calls no model until the operator has graded 20 replies.

## Why This Release

The comparison scored replies on mechanical checks alone, and nobody had measured whether those checks agree with a human reader. A model judge could read the masked replies, but without human grades there was no way to tell a trustworthy judge from an unreliable one.

## What's New at a Glance

- **A census comes first.** `judge-agreement.mjs` joins every masked reply to its reply file by the SHA-256 of the reply text. It prints how many replies exist, how many are distinct and how often the mechanical scores agree with the operator's grades.
- **No model call happens below the label gate.** With fewer than 20 graded replies the run prints `stop: fewer than 20 labeled replies`. A baseline that already agrees on more than 90 percent of graded cells prints `no headroom`.
- **Each judge sits behind its own switch.** `--deem` asks the local Deem server after its health check, and `--jev` asks the hosted Jev service after its version and credential checks. A failed check skips that judge and never starts the other one.
- **The keep rule is fixed before any run.** Each judge column prints one verdict line: `keep`, `kill` or a `stop` with its reason. Coverage, an exact sign test over replies and a 10-point gain over the baseline decide it.
- **Reply text leaves the machine only on request.** `--jev` sends reply text to a hosted service, so a masked file that git does not track also needs `--accept-payload`. Deem keeps everything on this machine.
- **A verdict feeds nothing.** `compare.mjs` and the release gate never read it, and using a judge anywhere would need a change of its own.

## Upgrade

No migration required. Every existing script runs as before, and the new script writes nothing unless it is given `--out`.
```

Accept when: 1 file created (F), no other file changed, and both checks pass.
Checks you run, from the repo root:
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/changelog/v1.4.0.0.md` (expect `VALID`, exit 0)
- `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-communication/changelog/v1.4.0.0.md` (expect `hard blockers:          0`)
