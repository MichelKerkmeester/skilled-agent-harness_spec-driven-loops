---
title: Deep Review Iteration 002
description: Security pass over the hook trust boundaries - audit scrubber, kill-switch resolver, stdin caps and adapter write paths.
trigger_phrases:
  - "hook library cleanup deep review iteration 2 security"
importance_tier: normal
contextType: review
---

# Iteration 002 — Security: hook trust boundaries in the cores

## Dispatcher

Resolved route: `mode=review target_agent=deep-review`. Iteration 2 of 5, generation 2, lineage `restart`, run `2026-11-16T11:20:27.056Z`. Dimension: security only. Focus taken from the strategy Next Focus: the cli-dispatch audit scrubber, the shared kill-switch resolver, the stdin deadline and body caps, and raw command or secret logging in three adapter families.

## Files Reviewed

- `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1106` — SECRET_PATTERNS, scrub, truncate, buildAuditLine, appendAuditLog, recordDispatch (read 1085-1292).
- `.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs:782` — scrubber regression cases (read 782-896).
- `.skilled/hooks/shared/hook-flags.cjs:243` — resolve(), precedence, aliases, DEFAULT_OFF (whole file).
- `.skilled/hooks/shared/hook-flags.mjs:12` — ESM facade over the CommonJS resolver.
- `.skilled/hooks/shared/hook-adapter-shared.cjs:27` — MAX_STDIN_BYTES, readStdin deadline and cap settle.
- `.skilled/hooks/shared/hook-stdin-deadline.test.mjs:40` — 18 spawned adapters; executed, 22/22 pass.
- `.skilled/hooks/decision-capture/lib/capture-core.mjs:370` — queue append mode.
- `.skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs:705` — appendWarningLog and the warning-detail sites at 1013 and 1038.
- `.skilled/hooks/subagent-dispatch-guard/pi/task-dispatch-guard.ts:23` — Pi prompt extraction.
- `.skilled/hooks/completion-evidence/dsh/completion-evidence.mjs` — no write path.
- `.gitignore:264` — `.skilled/logs/` is ignored.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Credential-bearing URLs pass the dispatch audit scrubber unredacted** — `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1106` — the seven SECRET_PATTERNS cover flags, `NAME=value` assignments whose name carries token/key/secret/password, `Authorization` Bearer/Basic and colon headers, provider prefixes, PEM blocks and bare JWTs, but no pattern anchors on URL userinfo. A command carrying `http://user:password@host` reaches the JSONL line intact.
   Finding class: `security_control_bypass`
   Scope proof: patterns read at 1106-1135; the assignment pattern at 1116 keys on the variable name, so `HTTPS_PROXY` never matches; a probe of the exported `buildAuditLine` returned `LEAK "HTTPS_PROXY=http://alice:hunter2@proxy.corp:8080 opencode run 'audit me'"` and `LEAK "opencode run --base-url https://alice:hunter2@host/v1 'x'"` while `--api-key`, `--access-token`, `Authorization: Bearer` and a PEM block all returned `REDACTED`.
   Affected surface hints: `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs`, all seven `recordDispatch` call sites, `.skilled/logs/cli-dispatch-audit.log`.
   Case: a developer exports proxy credentials on the dispatch line or passes `--base-url` with userinfo; the password lands in cleartext in a log that outlives the turn, and every later reader inherits it.
   In-file claim contradicted: lines 1101-1105 state the scrubber exists so a token never lands on disk.
   Counterevidence sought: the log directory is gitignored, limiting exposure to the local machine, and the operator must choose to embed credentials in the command. Downgrade trigger: credential-bearing URLs unreachable through the shipped adapters' command sources. Confidence 0.9.

2. **The audit log takes default umask permissions while the sibling hook state log uses 0600** — `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1243` — `appendFileSync(logPath, ...)` passes no `mode`, and `mkdirSync` at 1234 no mode either, so `.skilled/logs/cli-dispatch-audit.log` takes the process umask, which creates files `-rw-r--r--` here. `capture-core.mjs:370` writes the decision queue with `{ mode: 0o600 }` for the same class of operator text.
   Finding class: `missing_file_permission`
   Scope proof: append path read at 1230-1248; `.skilled/logs/completion-sentinel-advisories.log` is `-rw-r--r--` under this umask; the capture queue sets 0600 explicitly at 370.
   Affected surface hints: `.skilled/logs/cli-dispatch-audit.log` and its `.1` rotation copy.
   Case: two accounts share a workstation checkout; one dispatches a CLI with a prompt naming a customer or an internal host and a token shape the scrubber does not know; the other account reads the whole line from the 0644 log.
   Counterevidence sought: the directory is gitignored and usually single-user, and the line is length-bounded and scrubbed for the named shapes. Downgrade trigger: a deployment that creates `.skilled/logs` 0700. Confidence 0.8.

## Traceability Checks

- `spec_code` — **partial**. The code agrees with D1 (kill-switch names and concern keys unchanged, `hook-flags.cjs:38-97`) and with D2 for the cores read. It does not fully meet the audit library's own "never lands on disk" claim for credential-bearing URLs (finding 1), and its log mode differs from the sibling writer (finding 2). Evidence: `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1106`, `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1243`, `.skilled/hooks/decision-capture/lib/capture-core.mjs:370`.

## Integration Evidence

- Seven `recordDispatch` call sites were enumerated (`.skilled/hooks/cli-dispatch/{claude,codex,devin,dsh,pi}` and `.opencode/plugins/cli-dispatch-audit.js:114`); every one delegates to the single scrubbed pipeline at `dispatch-audit.mjs:1264`, so no second, unscrubbed audit writer exists.
- The audit destination is `.skilled/logs/cli-dispatch-audit.log` (`dispatch-audit.mjs:1196`), which `.gitignore:264` excludes from the repository.

## Edge Cases

- No `cli-dispatch-audit.log` exists in this checkout, so its mode was inferred from the writer's absent `mode` option plus the umask proven by `.skilled/logs/completion-sentinel-advisories.log`. Recorded as inference, not observation.
- The Bearer pattern consumes the closing quote of a quoted header, so `Authorization: Bearer [REDACTED]` loses its `"`. Cosmetic; the secret is still removed.
- The audit line's `skill` field is not scrubbed. It is drawn from the matcher's fixed set at `dispatch-audit.mjs:1165-1185`, not from command text, so no secret can travel through it.
- `readStdin` resolving `''` at the byte cap makes a capped call indistinguishable from an empty payload. That is the documented fail-open choice, not a defect.

## Confirmed-Clean Surfaces

- Named secret forms all redact in a live probe and in tests 782-896: `--api-key`, `--token`, `--secret`, `--password`, `--access-token` (through the hyphenated `-token` suffix), `NAME=value` with a secret-bearing name, `Authorization: Bearer|Basic`, colon-form headers, `sk-`/`sk_live_`/`pk_live_`/`ghp_`/`xox*`/`AKIA` prefixes, PEM blocks and bare JWTs.
- Scrub-then-truncate order: the full command is scrubbed before `truncateCommand` (`dispatch-audit.mjs:1168-1169`), so no secret can be split at the 500-character boundary.
- Scrub failure is fail-closed for disclosure: `buildAuditLine` returns null on any internal error (1187-1189) and `recordDispatch` writes nothing (1286).
- Kill-switch precedence: `resolve()` returns the environment value whenever the key is present, even blank (`hook-flags.cjs:243-246`), so the environment shadows the file per key as documented at 216; a blank env value suppresses a file kill; `LEGACY_ALIASES` are additive by design, not a precedence inversion.
- Stdin bounds: 64 MiB cap with the end/timer race settled once (`hook-adapter-shared.cjs:27,40-49,70`); the deadline probe of 18 adapters passed 22/22.
- No raw prompt or secret logging in the three named families: decision-capture appends operator answers to a 0600 queue (`capture-core.mjs:370`); the subagent guard's warning details name agent, mode and counts only (1013, 1038) and go to a bounded state log (705); the DSH completion-evidence adapter has no write path.

## Ruled Out

- Scrubber missing `--api-key`, bearer, JWT or PEM forms — ruled out by live probe and tests.
- Kill-switch environment/file precedence inversion — ruled out; per-key environment priority is implemented and documented.
- Unbounded stdin read — ruled out; cap and deadline both settle and the deadline suite passes.
- Adapter logging raw command text or a secret in decision-capture, completion-evidence or subagent-dispatch-guard — ruled out by reading the write paths.
- A second, unscrubbed audit writer — ruled out; all seven call sites share `recordDispatch`.

## SCOPE VIOLATIONS

None. All writes stayed under `review/`.

## Next Focus

Iteration 3, traceability: verify the seven phase documents and the rewritten concern READMEs against the live paths and behaviors they claim, and run the core and overlay protocols. First evidence: `spec_code` and `checklist_evidence` over phases 1 to 6, then `agent_cross_runtime` across the seven runtime mirror roots. The two security findings are reported, not fixed.

Review verdict: PASS
