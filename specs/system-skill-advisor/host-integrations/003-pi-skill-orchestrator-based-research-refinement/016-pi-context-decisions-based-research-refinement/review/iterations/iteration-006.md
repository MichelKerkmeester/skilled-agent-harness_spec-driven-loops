# Iteration 6: security depth, trust-boundary scan, Python twin and P1 recheck

## Dispatcher

- Run 6 of 7 (extended run, lineage completed-continue, generation 5, session 2026-11-23T21:41:17.101Z), native @deep-review LEAF, HEAD `52f0bcb9a98`.
- Iteration number derived from the state log: 5 iteration records, so this is 6, matching the prompt pack.
- Operator focus addressed: the review stayed on runtime/ (lib, handlers, scripts including the Python fallback) and hooks/. Prose docs were read only where a code comment contradicts the code (metrics.ts:172).

## Dimension

Security, with a maintainability tail. Search debt was zero, so this pass went deep on three jobs: (1) a trust-boundary scan of the socket client, bridge, hook adapters and every temp-dir writer; (2) a Python twin check for G5-I5-P2-001; (3) a recheck of G5-I1-P1-001 and G5-I2-P1-001 at HEAD.

## Files Reviewed

- .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:171-330, :418-440, :505-520
- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:49, :283
- .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:225-295
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:30-147
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:38-145 (grep of the guard sites)
- .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:80-150 (grep of the guard sites)
- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:215-250
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1088-1104
- .skilled/bin/lib/launcher-ipc-bridge.cjs:95-175 (context for G5-I2-P1-001, outside the target)
- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:30-62
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:743-747, :918-924, :974-978
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1607-1652, :4835-4856, :5040-5075
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:495-559

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The hook metrics store writes on every prompt into a shared temp folder with no owner, mode or symlink check, so another local user can redirect the append and the chmod onto any file the victim owns** -- .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:171 -- The store root is `join(tmpdir(), 'speckit-skill-advisor-metrics')` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:171], and each file name is the first 16 hex characters of sha256 over the workspace path [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:278-287], so the path can be computed from the workspace path. `ensureParentDir` runs `mkdir(..., { recursive: true, mode: 0o700 })`, which keeps an existing directory as it is, then `chmod(dir, 0o700)`. When that chmod fails, as it does on a directory another uid owns, the code only sets `dirReady = false` and goes on writing [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:259-266]. The write is `appendFile(path, ...)` followed by `securePrivateLog`, which is `chmod(path, 0o600)` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:308-309] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:271-276]. Both calls follow a symlink at the final name, and nothing calls lstat or compares a uid anywhere in the file. The writer is on by default. `persistAdvisorHookDiagnosticRecord` passes `requireDebug: false`, and its comment says the record "is written on every prompt" [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:422-428]. The Claude hook imports and calls it [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:49] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:283]. The readers also take whatever an attacker-owned folder holds: `readAdvisorHookOutcomeRecords` and `readAdvisorHookDiagnosticRecords` keep every well-formed line [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:432-440] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:515-520], and `advisor_status` and `advisor_validate` report from them [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:340] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:685]. The two sibling stores in this skill hold the rule this store skips. The route receipts refuse a symlinked folder, a folder owned by another uid and an open mode [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:282-290]. The lifecycle store applies the same check with `secure_stat` and `O_NOFOLLOW` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:38-41] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:62-69]. The comment at metrics.ts:172 says "only that user may read them", which the code does not ensure. Probe (/private/tmp/dr-iter6/probe.mjs, exit 0) against the built `runtime/dist/runtime/lib/metrics.js` with `TMPDIR=/private/tmp/dr-iter6/t`: a 0755 metrics folder held a symlink `<hash>-outcomes.jsonl -> victim.txt`. After one `persistAdvisorHookOutcomeRecord` call, victim.txt carried the appended JSON line, and its mode went from 644 to 600. The probe ran as one uid, so it proves the symlink follow and the target chmod only. The cross-user step, where the folder chmod fails and the write goes ahead anyway, rests on the code at :263-265.
   Finding class: trust-boundary-defect
   Scope proof: metrics.ts and user-prompt-submit.ts are in reviewScopeFiles; the probe imported the built dist export and wrote only under /private/tmp/dr-iter6
   Affected surface hints: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:171-176, :259-276, :299-326, :418-440, :505-520; .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:283; the owner check to reuse is .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:282-290
   Case: on a Linux host where TMPDIR is unset and tmpdir() is /tmp, another local account creates /tmp/speckit-skill-advisor-metrics mode 0755 and puts a symlink at <sha256(workspace)[0:16]>-diagnostics.jsonl pointing to ~/.bashrc; the victim's next Claude prompt appends a diagnostic JSON line to ~/.bashrc and sets its mode to 0600, and the attacker can also plant forged outcome lines that advisor_validate reports as real.

```json
{"type":"trust-boundary","claim":"metrics.ts writes on every prompt into tmpdir()/speckit-skill-advisor-metrics with no owner, mode or symlink check, and a failed folder chmod does not stop the append and file chmod, which follow a symlink at the final name","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:171",".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:259-266",".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:271-276",".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:308-309",".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:422-428",".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:283","probe /private/tmp/dr-iter6/probe.mjs exit 0: target appended, mode 644 -> 600"],"counterevidenceSought":"grep for lstat, getuid, uid and O_NOFOLLOW in metrics.ts (none); checked whether the writer is debug-gated (diagnostics and outcomes pass requireDebug:false); checked the macOS tmpdir (per-user 0700, so not reachable there); checked whether the sibling stores share a guard helper that metrics calls (they do not)","alternativeExplanation":"On macOS, os.tmpdir() is the per-user /var/folders/.../T, which is 0700, so a single-user Mac cannot be attacked this way. The written content is a closed-schema record the attacker does not choose, so the primitive is integrity damage and a chmod, not code execution","finalSeverity":"P1","confidence":0.8,"downgradeTrigger":"Downgrade to P2 if the runtime is documented and enforced as macOS-only with a per-user TMPDIR, or if every supported host sets a per-user TMPDIR before the hook runs"}
```

Skeptic/referee (compact): the skeptic says the content is not attacker-chosen and macOS is not exposed. The referee keeps P1 on the threat model G5-I2-P1-001 already accepted: a shared /tmp with another local account. Here the victim process writes and chmods through an attacker-chosen symlink by default on every prompt, which is stronger than the shadow-sink case (G5-I2-P2-002, off by default, P2). The code carries darwin and win32 branches (launcher-ipc-bridge.cjs:122), so other platforms are in scope. Calibration poisoning through forged outcome lines was not traced and is not claimed.

### P2 Findings

None.

## Python twin of G5-I5-P2-001 (job 2)

Ruled out. The TypeScript defect needs two things together: a seed bound that caps a target below a typed-command holder and records `heldBelow` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:529-557], and a withhold that sets `passes_threshold: false` on a mentioned command while leaving its score and its cap in place (fusion.ts:1014-1026). The Python fallback has neither. `_apply_graph_boosts` only adds transitive boosts and never caps a target [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1607-1652], and a grep for `held_below|heldBelow|ceiling|seed|1e-6` over skill_advisor.py finds no bound. The Python deep-loop gate drops a mentioned or unasked run row outright with `continue` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4848-4855] rather than keeping it as a capped holder. Its only ambiguity check, the low-information abstention, clusters on raw `_score` and confidence with no held-below exception [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5056-5065]. So no Python twin exists. The missing seed bound is itself a parity gap, but no case was built to show a routed difference, so it is carried to iteration 7 rather than raised.

## Recheck of the open P1s at HEAD 52f0bcb9a98 (job 3)

| Finding | Status | Mitigation candidate and why it does not close it |
|---|---|---|
| G5-I1-P1-001 scoped scan deletes unseen skills | Still holds | `requireTrustedCaller` gates the scan [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:35-37], but the shipped launcher makes every caller trusted (G5-I2-P2-001), and the defect is an accidental wipe by a cooperative caller in any case. The scan still accepts any in-workspace root (scan.ts:44-51) and publishes `state: 'live'` (scan.ts:55-60). `DELETE ... NOT IN` is unchanged at skill-graph-db.ts:745, and so are the call at :976 and the empty-only guard at :921. |
| G5-I2-P1-001 fixed /tmp socket, no owner check | Still holds | The bridge adds a scope subfolder for the default dir [SOURCE: .skilled/bin/lib/launcher-ipc-bridge.cjs:101-107] [SOURCE: .skilled/bin/lib/launcher-ipc-bridge.cjs:147-150]. The scope is the first 12 hex characters of sha256 over the canonical database dir, which is a predictable repo path, so an attacker can compute it and pre-create that subfolder too. The CLI still checks only the parent's mode bits [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1095-1101], and neither level compares a uid. |

## Traceability Checks

- spec_code (core): partial. A new comment-versus-code contradiction: metrics.ts:172 says only the owning user may read the logs, but :259-276 lets a foreign-owned folder through. The two contradictions carried forward (G5-I1-P1-001, G5-I2-P2-001) are unchanged.
- checklist_evidence (core): not run this iteration.

## Integration Evidence

- Claude hook surface: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:283 wires the metrics writer into every prompt.
- Launcher bridge: .skilled/bin/lib/launcher-ipc-bridge.cjs:101-150, read as context for the G5-I2-P1-001 recheck. It sits outside the review target, so no finding is raised against it.

## Edge Cases

- The probe could not simulate a second uid. The cross-user step is code evidence (metrics.ts:263-265), and the narrative says so.
- On macOS the default tmpdir() is per-user, so the new P1 needs Linux or a shared TMPDIR. That is the downgrade trigger.
- The diagnostics trim path writes a temp file named `${path}.${pid}.${Date.now()}.tmp` without `wx` (metrics.ts:314-316), inside the same unchecked folder. It is folded into the P1 because the fix, an owner-checked folder, closes both.

## Confirmed-Clean Surfaces

- .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:282-290: checks owner, mode and symlink on both base and folder before read, write and remove.
- .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:92-96, :141: uid check plus a `wx` 0600 temp file and a rename.
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:38-145: descriptor-anchored, `O_NOFOLLOW`, `secure_stat` on every open.
- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:231-235: spawn with an argv array, no shell, the prompt on stdin.
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:120-136: argv-only spawnSync, the request on stdin, and the Python binary taken from the same user's env.

## Ruled Out

- Python twin of G5-I5-P2-001: no seed bound and no capped withheld holder in skill_advisor.py (see job 2).
- Command strings built from prompt text: no `shell: true`, `exec(` or `execSync` with prompt data in runtime/ or hooks/ outside tests and benches.

## Next Focus

- Dimension: maintainability (final pass, iteration 7).
- Focus area: whether the Python fallback's missing seed bound (skill_advisor.py:1607-1652 against fusion.ts:495-559) gives a routed difference on a constructed typed-command prompt; then the synthesis carry list.
- Reason: job 2 showed the bound exists only in TypeScript; a parity gap needs a case before it becomes a finding.
- Rotation status: all four dimensions covered; the extension passes clear depth.
- Blocked/productive carry-forward: do not reopen the trust-boundary scan of hooks/lib, the parity suites, the playbook sweep, or the handler and lifecycle scans. Productive: probes on dist exports under /private/tmp.
- Required evidence: a constructed prompt run through both languages, with the Python and TypeScript top rows side by side.

## Verdict

Three P1s are active (G5-I1-P1-001, G5-I2-P1-001, G5-I6-P1-001) and no P0. This pass added one P1 and no P2.

Review verdict: CONDITIONAL
