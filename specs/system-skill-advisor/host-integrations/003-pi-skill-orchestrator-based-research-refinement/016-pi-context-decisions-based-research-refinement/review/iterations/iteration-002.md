# Iteration 002 - Security plus Python/TypeScript parity

## Dispatcher

- Generation 5, iteration 2 of 3, native executor (opus), lineageMode restart, sessionId 2026-11-23T21:41:17.101Z.
- Iteration number derived from the state log: one prior `type:"iteration"` record, so this is iteration 2 (matches the dispatch).

## Dimension

Security, with the operator's Python/TypeScript parity job. Operator focus addressed: the three jobs in the pack. (1) socket_hijack, the trust default, the shadow log and the prompt-time refusal were each settled against code plus a probe. (2) python_ts_parity was settled by running both suites. (3) runtime/lib/cross-skill-edges/ and handlers/skill-graph/query.ts were read; status.ts and validate.ts were not reached and are deferred to iteration 3.

## Files Reviewed

- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts (33, 414-422, 747-779, 1086-1101, 1185-1212)
- .skilled/skills/system-skill-advisor/runtime/advisor-server.ts (231-261, 312-345)
- .skilled/skills/system-skill-advisor/runtime/lib/ipc/socket-server.ts (full, re-export)
- .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts (20-40, 236-256, 300-325, 420-470), context evidence, outside the declared target
- .skilled/bin/system-skill-advisor-launcher.cjs (62-80, 185-205, 325-345), context evidence
- .skilled/bin/lib/launcher-ipc-bridge.cjs (168-187), context evidence
- .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts (92, 210)
- .skilled/skills/system-skill-advisor/runtime/lib/daemon/lease.ts, state-mutation.ts, watcher.ts (permission grep)
- .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts (48-54, 76-150, 163-170)
- .skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/apply-graph-metadata-patch.ts (30-127), index.ts (62), metadata-loader.ts (25-50, 200-215)
- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/propagate-enhances.ts (18, 41-75), query.ts (34-51, 134-135, 183-185)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The CLI and hook fallback connect to a fixed /tmp socket without checking who owns the directory or the socket** -- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1097 -- Both the CLI and the hook fallback default the socket dir to the fixed path `/tmp/system-skill-advisor` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:33] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:210]. `ensureSocketEnvironment` runs `mkdirSync(..., { mode: 0o700 })`, which does nothing when the directory already exists, and then rejects only a group- or world-writable mode [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1097-1100]. It never compares `stat.uid` with the caller's uid, and the connect path passes the path straight to `net.createConnection` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1204-1207] [SOURCE: .skilled/bin/lib/launcher-ipc-bridge.cjs:168-170]. A grep for `getuid|lstat|isSocket|.uid` over the CLI and the bridge finds no client-side owner check. The server half treats this as an in-scope threat: its comment names "an attacker-planted dir on a shared host" and it refuses a directory owned by another uid [SOURCE: .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:440-451]. So the planted directory blocks the real daemon from binding, and the client still connects to whatever is listening there. Probe (/private/tmp/dr530-iter2/probe.mjs, exit 0): a 0755 directory passes the CLI's mode-only test, and `/private/tmp` is mode 1777, so any local account can create `/tmp/system-skill-advisor` first. The probe's server-side line is a constant comparison and is not cited as evidence.
   Finding class: missing-ownership-check-on-trust-boundary
   Scope proof: skill-advisor-cli.ts and skill-advisor-cli-fallback.ts are in reviewScopeFiles; the server comparison is context evidence only.
   Affected surface hints: skill-advisor-cli.ts ensureSocketEnvironment and connect path, hooks/lib/skill-advisor-cli-fallback.ts env default, .skilled/bin/lib/launcher-ipc-bridge.cjs connect, every host hook that shells to the CLI.
   Case: on a shared machine another account creates /tmp/system-skill-advisor (mode 0755) with a listening socket before the owner's first session, and every prompt hook then sends the user's prompt to that listener and injects its forged recommendation brief into the model context, while the real daemon refuses to bind.

```json
{"type":"security","claim":"The advisor CLI and hook fallback trust a pre-existing /tmp/system-skill-advisor directory owned by any uid, so a planted listener receives prompts and answers with forged briefs","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:33",".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1097",".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1204",".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:210",".skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:440"],"counterevidenceSought":"Grepped the CLI and launcher-ipc-bridge.cjs for getuid, lstat, isSocket and .uid before connect (none); checked whether the server-side owner check protects the client (it only stops the real daemon binding); checked whether the default dir is per-user (it is a fixed /tmp path).","alternativeExplanation":"The repository is meant for single-user developer machines, where no second local account exists; then the risk is theoretical.","finalSeverity":"P1","confidence":0.7,"downgradeTrigger":"Downgrade to P2 if the default socket dir becomes per-user (for example under the 0700 advisor DB dir or $TMPDIR on macOS) or if the deployment is documented and enforced as single-user only."}
```

Skeptic/referee (compact): single-user laptops are the common case, and the attacker needs a local account. The code's own server half names the shared-host attacker as in scope, and the client half undoes that defence, so the finding is not speculative. Not P0: it needs a second local account and acts before the owner's daemon starts. Held at P1.

### P2 Findings

1. **The daemon trust gate is a caller assertion, and the shipped launcher turns a missing assertion into trusted, against the server's own comment** -- .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324 -- Recheck of generation-4 R2-P1-001. It still holds as a contradiction: the launcher sets `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted'` [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:74], `resolveTrustedCaller` returns that default when `_meta` carries no authority [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:248], and the frame handler's comment says a call without the caller block "see[s] an untrusted caller, so mutations stay refused" [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324-326]. Downgraded from P1 after the skeptic pass: `resolveTrustedCaller` already accepts `trusted: true` or `callerAuthority: 'trusted'` from the caller-supplied `_meta` [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:239-241], so a hostile client never needed the default. Even in the `tcp://` mode that `listenOnce` supports [SOURCE: .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:317-320], the default adds no reach. The gate guards cooperative callers against accidental mutation, and only the 0600 socket in an owner-checked 0700 directory is a real boundary. Related: the prompt-time mutation refusal exists only in the CLI [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:747-779], and a grep for `promptTime|PROMPT_TIME` over advisor-server.ts, handlers/ and lib/ finds nothing daemon-side. Hooks reach the daemon only through the CLI, so this is defence in depth.
   Finding class: contract-comment-contradicts-shipped-config
   Scope proof: advisor-server.ts and skill-advisor-cli.ts are in reviewScopeFiles; the launcher is context evidence.
   Affected surface hints: advisor-server.ts frame-handler comment and resolveTrustedCaller, launcher REPO_ENV_DEFAULTS, docs that describe the trust gate as fail-closed.
   Case: a cooperative client that sends advisor.call skill_graph_scan with no _meta block runs as trusted under the repo launcher, though the comment above the call says the mutation is refused.

2. **The opt-in shadow sink appends raw prompts to a path that is not gitignored, with no file mode and no guard on the default path** -- .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:136 -- With no env path the sink writes to `runtime/../data/shadow-deltas.jsonl` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:50-53], and `git check-ignore -v .skilled/skills/system-skill-advisor/data/shadow-deltas.jsonl` exits 1, so the path is not ignored. The append uses default umask modes and no `O_NOFOLLOW` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:135-139]. The workspace containment check runs only for the env path [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:102-116]. Its `canonicalize` walks up to the first existing ancestor, so a dangling symlink at the final name passes the check, and `appendFileSync` then creates the symlink's target [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:76-90]. The sink is off by default [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:167-170], which caps this at P2.
   Finding class: sensitive-data-at-rest
   Scope proof: shadow-sink.ts in reviewScopeFiles.
   Affected surface hints: shadow-sink.ts recordShadowDelta and resolveShadowDeltaPath, .gitignore coverage for system-skill-advisor/data/.
   Case: an operator sets SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED=1 for a calibration run, and the raw user prompts land in an untracked, unignored data/shadow-deltas.jsonl that a later `git add -A` commits.

## Traceability Checks

- spec_code: partial. The server comment at advisor-server.ts:324-326 contradicts the shipped launcher default (launcher :74). The server-side socket comment (shared socket-server.ts:440-442) states a threat model that the client half does not honour. Packet spec docs were not read this iteration and stay planned for iteration 3.
- checklist_evidence: notApplicable. The review target is a skill code tree with no checklist rows for these modules.

## Integration Evidence

- Launcher: .skilled/bin/system-skill-advisor-launcher.cjs:74 (REPO_ENV_DEFAULTS trust default) and :340 (0700 DB dir).
- Shared IPC server: .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:440-451 (owner and mode check), :575-579 (0600 socket, symlink refusal).
- Client bridge: .skilled/bin/lib/launcher-ipc-bridge.cjs:168-187.
- Hook fallback: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:210.

## Python/TypeScript Parity (job 2)

- `npx vitest run tests/parity tests/deep-loop-offer-cases.vitest.ts` from runtime/: Test Files 9 passed (9), Tests 206 passed (206). The summary line is the evidence; the exit status was not captured, because `PIPESTATUS` ran in a subshell and printed empty.
- `python3 tests/python/test_skill_advisor.py`: Summary pass=130, fail=0, including DEEP-LOOP-GATE (118 shared offer cases agree), BRIDGE-PARITY (37 launcher keys) and the STRIP parity rows.
- No disagreement between the Python fallback and the TypeScript scorer exists within the shared corpus. This claims nothing beyond the corpus. `git status --porcelain -- .skilled/skills/system-skill-advisor` was empty after the runs, so the suites left no files.

## Edge Cases

- Contradiction with generation 4: R2-P1-001 was P1 there and is P2 here. Both sides are cited above; the deciding fact is advisor-server.ts:239-241, where a caller can assert trust itself.
- Partial coverage: handlers/skill-graph/status.ts and validate.ts were not read inside the 24-call budget and are deferred to iteration 3.
- The socket probe's `serverAcceptsForeignOwnedDir` field compares a constant and proves nothing; only the mode-only acceptance and the /tmp mode are cited.

## Confirmed-Clean Surfaces

- .skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts:33-46: discovery uses Dirent `isDirectory()` and `isFile()` (lstat semantics), so symlinked directories and symlinked graph-metadata.json files are skipped.
- .skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/index.ts:62 passes `skillsRoot` to applyEnhanceEdge, so the lexical boundary check at apply-graph-metadata-patch.ts:36-41 runs on the live path, and propagate-enhances.ts:53-58 confines the root to the workspace.
- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/query.ts:50-51: limit and depth are clamped (1-200, 1-10).
- .skilled/skills/system-skill-advisor/runtime/lib/daemon/lease.ts:96,169: the lease dir is 0700 and the DB 0600.

## Ruled Out

- python_ts_parity disagreement: both suites pass (206/206 vitest, 130/0 Python); no divergent case within the shared corpus.
- Symlink escape through cross-skill-edges apply: discovery skips symlinks, and the apply guard receives the root.
- Prompt-time refusal as a separate finding: folded into P2-001 as defence-in-depth evidence, because hooks reach the daemon only through the CLI.

## Next Focus

- Dimension: traceability, plus maintainability if budget allows.
- Focus area: handlers/skill-graph/status.ts and validate.ts (deferred), the packet spec docs against code (spec_code), the trust-gate and socket docs against the code above, and the production-dead lifecycle modules from iteration 1.
- Reason: security covered; traceability and maintainability are the two remaining dimensions in the last iteration.
- Rotation status: correctness and security covered (2/4).
- Blocked/productive carry-forward: running the suites settled parity in two calls (productive). Do not reopen parity or cross-skill-edges symlink handling.
- Required evidence: file:line plus a probe or test reading per finding.

Review verdict: CONDITIONAL
