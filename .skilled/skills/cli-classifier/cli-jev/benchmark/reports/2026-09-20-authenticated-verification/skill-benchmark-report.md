---
title: "cli-jev Playbook Run: 2026-09-20 authenticated verification"
description: "Recorded verdicts for the two credential-gated cli-jev scenarios, executed live with an operator-stored official key and no key in the environment."
trigger_phrases:
  - "cli-jev authenticated verification"
  - "jev live judgment run"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# cli-jev Playbook Run — 2026-09-20 authenticated verification

_Derived after the fact from this run's stored record, not written at run time._

---

## 1. RUN IDENTITY

| Field | Value |
|---|---|
| Date | 2026-09-20 |
| Playbook | `cli-usage/manual-testing-playbook/manual-testing-playbook.md` |
| Binary | `jev 0.6.2` (`uv tool install jev-cli`) |
| Provider | `official`; key stored through `jev auth set --provider official` read from stdin, never argv, and no provider key variable set in the environment |
| Executor | the orchestrator session for `001-cli-jev-creation`, run on the operator's behalf after the operator supplied the key |

---

## 2. VERDICT

**2 PASS, 0 FAIL, 0 SKIP** for the rows this run exists to execute — JEV-021 in full and JEV-022 in
full. The other twenty rows are unchanged from the phase-004 unauthenticated pass and are not
restated here.

| Scenario | Verdict | Evidence |
|---|---|---|
| JEV-021 | PASS | `auth status` exit 0 with `ok`/`stored`/store path; `auth status --provider vercel` exit 3 with the credential error and empty stdout; `auth test` exit 0 with `valid` and the model id; no stream carried a key value |
| JEV-022 | PASS | the three judgment calls each exited 0 with empty stderr: `noul` printed `0.95` inside `[0, 1]`, `choice` returned one of the two submitted keys, `score` printed `2.0` as the zero-based position of the third submitted level |

---

## 3. RAW EVIDENCE

Commands as run — the credential is in the store, not the environment:

```bash
jev auth status
jev auth status --provider vercel
jev auth test
jev noul   -q 'Does this message express urgency?' -s 'Please restore service today.' --value </dev/null
jev choice -q 'Which queue owns this?' -s @state.txt -o billing='Payment or refund' -o technical='Bug' </dev/null
jev score  -q 'How severe is this?' -s @state.txt -l 'no impact' -l 'degraded' -l 'outage' --value </dev/null
```

Observed stdout, with the exit status beside it:

| Command | Exit | stdout |
|---|---|---|
| `jev auth status` | 0 | `{"ok": true, "stored": true, "store": "$HOME/.config/jev-cli/credentials.json"}` |
| `jev auth status --provider vercel` | 3 | empty (stderr: `{"ok": false, "error": "stored vercel API key is empty"}`) |
| `jev auth test` | 0 | `{"ok": true, "valid": true, "model": "jev-1.13.0"}` |
| `jev noul … --value` | 0 | `0.95` |
| `jev choice …` | 0 | `{"model": "jev-1.13.0", "answers": {"answer": {"type": "choice", "choice": "billing", "confidence": 0.96, "probabilities": {"billing": 0.98, "technical": 0.02}}}, "usage": {"input_tokens": 341, "output_tokens": 31}}` |
| `jev score … --value` | 0 | `2.0` |

The `choice` and `score` calls ran against a three-line state describing a failing checkout; the
envelope names `jev-1.13.0` as the model on every call. A prefix search for the key over the
captured streams returned `0` matches.

---

## 4. DELTA AGAINST BASELINE

| Row | Baseline (`2026-09-20-phase-004-unauthenticated-pass`) | This run |
|---|---|---|
| JEV-021 | PASS for the unauthenticated half, SKIP for the authenticated half | PASS, both halves |
| JEV-022 | SKIP with the named blocker | PASS |
| All other rows | as recorded | unchanged, not re-run |

Two findings came out of this run.

1. Once a credential file exists, an absent provider is reported as `stored <provider> API key is
   empty` rather than `<provider> API key is not stored`. The source branch is
   `src/jev_cli/__init__.py:99`; both messages are exit 3 and both leave stdout empty.
2. The no-key rows in the other report are reproducible now only with the store pointed away —
   `XDG_CONFIG_HOME` at an empty directory — because a stored key otherwise resolves ahead of the
   credential check. The playbook's provider boundary carries the same note.
