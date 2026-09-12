# Iteration 11: Weakest-evidenced angle of run 1 — A1 binding, verification pass (D1)

- **Lineage:** glm (cli-pi, glm-5.3-flash) - Program iteration 11 of 15, run 1 of 5 in this lineage (charter allocation table, row 11)
- **Angle choice:** A1 (session-to-packet binding) is the weakest-evidenced of A1-A8 that allocations 12-14 do not already own. Run 1's decisive A1 second pass (deepseek iteration-009) declared its own failure scenarios "scenario analyses grounded in the code paths cited" rather than readings, and the load-bearing carrier claim — that `lastSpecFolder` "is written by the *stop* path, so a fresh session's first turn has none" (`deepseek/research.md:51-52`) — was carried into the chosen D1 (O1-B) without anyone reading the writers. A5/A6+A7/A8+A2 have dedicated iterations 12-14.
- **Question:** Does the run-1 binding evidence survive contact with the repo: who actually writes `lastSpecFolder` and when, do the 009 citations resolve as printed, and does the 'unbound' vocabulary precedent exist where run 1 said it does?

## Actions Taken

1. Line-verified `resolveGoalScope` and the legacy constants in the goal core (A1-1, A1-2 re-check).
2. Grepped every `lastSpecFolder` occurrence under `.opencode` (readers vs writers).
3. Read the stop hook's detection/retarget region in source (not the compiled copy run 1's synthesis cited through).
4. Read the three cross-runtime readers run 1 cited (pi, codex, devin) and the compiled session-prime consumer.
5. Verified the objective-vs-goal.md copy semantics (playbook §6) and the 009 requirement/ADR lines.

12 evidence calls (at the TCB cap): 4 bash (awk/greps), 8 reads.

## Findings

### F1. The carrier claim is directionally right but structurally wrong: there is more than one writer, and "stop path" is only half the story

`lastSpecFolder` is a field of the *speckit hook state* schema, not of the goal store: `HookStateSchema` defines `lastSpecFolder: z.string().min(1).nullable()` alongside `claudeSessionId`, `speckitSessionId`, `sessionSummary`, `pendingCompactPrime` (`[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:224-234]`, field at `:228`).

- **Writer 1 — the stop hook, confirmed:** the stop handler refreshes, then patches: `if (!currentSpecFolder && detectedSpec.specFolder) { patch.lastSpecFolder = detectedSpec.specFolder; retargetReason = 'no_previous_packet' }` (`[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:518-521]`), and the retarget branch writes it too (`:528-534`). It reads the previous value at `:513` after an explicit "refresh ... so [the preference] does not lock in a stale generation" (`:505-509`).
- **Writer 2 — prompt-side, evidenced but unnamed:** the Codex stop adapter's own comment states "The lifecycle **prompt/stop** hooks persist lastSpecFolder at `${tmpdir()}/speckit-claude-hooks/<sha256(cwd).slice(0,12)>/<sha256(sessionId).slice(0,16)>.json`" (`[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs:56-58]`), and the stop source separately speaks of "another writer [that] advanced the packet target between handler entry and this step" (`[SOURCE: .../claude/session-stop.ts:505-509]`). Two independent in-repo comments say a non-stop writer persists the field. **INFERRED, not confirmed:** the second writer is `user-prompt-submit.ts` (present in the same source directory, `runtime/hooks/claude/`); the confirming grep of that file's assignments was the call not spent at the 12-call cap. What would confirm it: `grep -n "lastSpecFolder" .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` showing an assignment.
- **Run 1's timing consequence holds anyway:** every cross-runtime *reader* run 1 cited is indeed a reader, failing open to `null` when the state file is absent — pi (`[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts:39-50]`, path+hashes at `:41-43`), codex (`[SOURCE: .../codex/completion-evidence-stop.cjs:61-72]`), devin ("same lastSpecFolder state the Stop/completion-evidence hooks read ... read/parse failure falls through silently", `[SOURCE: .../devin/post-compaction.cjs:81-95]`). And the shipped prime-time consumer only *suggests*: "Last active spec folder: ${state.lastSpecFolder}\nRun `/speckit:resume` against it for full context." (`[SOURCE: .opencode/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js:135-138]`; also the shorter "Last active:" variant at `:84-87`). That prime hint **is** the "suggestion the operator confirms, never an automatic bind" that run 1 (deepseek iteration-006, F6.3) proposed as a design — it already ships.

### F2. CORRECTION — the ambiguity citation in run 1's synthesis does not resolve as printed

`deepseek/research.md:44` cites `session-stop.ts:112` for the detector's `ambiguous_transcript`. In the source, `:112` is the `specFolder: string | null;` field of the result interface; the enum member lives in `SpecFolderDetectionReason` at `:103` (and in the outcome union at `:96`) (`[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:96]`, `[SOURCE: .../session-stop.ts:103]`, `[SOURCE: .../session-stop.ts:111-114]`). The substantive claim — the repo's own detector names the ambiguous case and it is exactly the nested-packet hazard — is unchanged. Resolving citation: `session-stop.ts:103`.

### F3. CORRECTION — every decision-record citation in run 1's D1/D7 narrative is shifted; the ADR's constraint lines are 65/72/73/85/87, not 36/41/43/47/51

Run 1 (deepseek iteration-006, F2-F3; research.md:56-57) cites `decision-record.md:36` ("management and injection must cut over together"), `:41` ("fail open ... never guess"), `:43` (opaque filenames), `:47` (scope-key composition + paths), `:51` (no fallback). Those line numbers land in the frontmatter/heading/anchor region. The statements actually resolve at:

| Run 1 cited | Actual | Statement |
|---|---|---|
| `:36` | `[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:65]` | "management and injection must cut over together" |
| `:41` | `[SOURCE: .../decision-record.md:72]` | "Runtime hooks must fail open to the user's turn, but goal selection must never guess." |
| `:43` | `[SOURCE: .../decision-record.md:73]` | "Raw session identifiers should not appear in filenames or diagnostics by default." |
| `:47` | `[SOURCE: .../decision-record.md:85]` | the resolver "hashes `JSON.stringify([repositoryRoot, runtime, sessionId])` into one opaque 64-hex scope key. Scoped JSON uses `.goal-state/<scope-hash>.json`; archives use `.goal-state/.archive/<scope-key>/`" |
| `:51` | `[SOURCE: .../decision-record.md:87]` | "No reader or injection hook falls back to `active-goal.json`. ... session startup never claims it automatically." |

Bonus resolutions run 1 never cited: the ADR decision sentence itself is at `:83`; the recorded mitigation for key-derivation drift — "One shared resolver and an end-to-end set-then-inject canary test" — is at `[SOURCE: .../decision-record.md:129]`, which is theprescription D1's bind resolver needs; the high-impact "Legacy migration binds the wrong owner" risk resolves at `:131`.

### F4. REFUTED-AND-REPLACED — the 'unbound' precedent does not live in the CLI; it lives in 009's requirement table

Run 1 (deepseek iteration-009, F2) asserted "the status values already known to the core (`active`, `paused`, `completed`, `cleared`, and the `unbound` concept **the CLI prints** for malformed legacy state)". A targeted grep finds **zero** occurrences of `unbound` in `.opencode/hooks/goal/lib/goal-core.cjs` and `.opencode/hooks/goal/bin/goal.cjs`. The token does occur in 009's requirements: REQ-012 — "Resume with the same native id restores the same goal; a new or forked id starts **unbound** unless an explicit clone action is specified" (`[SOURCE: specs/hooks/009-goal-isolation/spec.md:152]`). Residual UNKNOWN: whether `unbound` appears in the plugin or pi adapter (the repo-wide grep's head cut; the two goal-surface files are conclusive as claimed). This resolves it-010's open gap #3: the vocabulary precedent **exists at the requirement layer** (`009/spec.md:152`), so adopting it is continuity with the packet's own language, not code compatibility — and the "malformed legacy" mechanism run 1 described remains UNVERIFIED.

### F5. The scope-key evidence survives line-verification; one new migration fact

`resolveGoalScope` throws `MISSING_SESSION_ID` at `:177` and `INVALID_SESSION_ID` at `:179`; the workspace is normalized by `resolveRepoRoot` at `:187`; the legacy key is `` `${runtime}-${sessionDigest}` `` at `:190`; the composite key is `sha256(JSON.stringify([workspace, runtime, sessionId]))` at `:191-193`; the scoped record path `join(stateDir, '<scopeKey>.json')` at `:203`; the legacy variant at `:205` (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:174-193]`, `[SOURCE: .../goal-core.cjs:203-206]`). Run 1's A1-1/A1-2 (packet nowhere in goal identity; fail-closed) are **confirmed**. New: legacy adoption is conditional — `canAdoptLegacyScope = resolve(stateDir) === resolve(workspaceStateDir)` at `:195` — so a store redirected via the state-dir env (`STATE_DIR_ENV = 'OPENCODE_GOAL_STATE_DIR'`, `[SOURCE: .../goal-core.cjs:42]`) never adopts legacy scoped keys. Migration-note fact for D2.

### F6. The objective-copy semantics are stronger than run 1 recorded, and they close the loop on it-009's record split

The playbook is more categorical than the "copy" wording run 1 quoted: "Nothing copies one into the other; the resync rule in Section 5 is the bridge, and **the operator's hands carry it**" (`[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:100-106]`, key sentence `:103-104`, the categorical sentence `:105-106`). Today there is no channel at all by which the record's objective updates except a human paste; the session objective is "a string the runtime holds for the current session and judges completion against" (`:103-104`). This **confirms** iteration-009's F1 split (objective = operator copy in the record; goalPrompt = read from the file) and sharpens D4: the resend→paste loop is the only freshness channel, which makes the resend's correctness (D4's edge trigger) more valuable, not less.

### F7. NEW FINDING — the ADR and the implemented core spell the env constants differently

The ADR says the store "may be redirected with `MK_GOAL_STATE_DIR` for tests" (`[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:71]`) and the rollback says "disable goal injection with `MK_GOAL_PLUGIN_DISABLED=1`" (`[SOURCE: .../decision-record.md:166]`). The implemented constants are `STATE_DIR_ENV = 'OPENCODE_GOAL_STATE_DIR'` and `DISABLED_ENV = 'OPENCODE_GOAL_PLUGIN_DISABLED'` (`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:42-43]`). Whether the core also honors the `MK_` spellings elsewhere was not verified (TCB); as written, the requirement's vocabulary and the code's vocabulary have drifted — the same class of documentation-rot run 1 recorded as R9 for the playbook.

## Corrections ledger (run 1 → run 2)

| # | Surface | Run 1 said | Run 2 verdict | Resolving citation |
|---|---------|-----------|---------------|--------------------|
| 1 | Carrier writers | `lastSpecFolder` "written by the *stop* path" | Half-right: a prompt-side writer also persists it (two in-repo comments); identity of writer 2 inferred, unconfirmed | `completion-evidence-stop.cjs:56-58`; `session-stop.ts:505-509` |
| 2 | Detector enum | `session-stop.ts:112` | Off by 9; `ambiguous_transcript` is at `:103` (union `:96`) | `session-stop.ts:103` |
| 3 | ADR-001 lines | `:36/:41/:43/:47/:51` | All shifted; true lines `:65/:72/:73/:85/:87` | `decision-record.md:65,72,73,85,87` |
| 4 | 'unbound' precedent | "the CLI prints" it | Token absent from CLI+core; precedent is REQ-012 at the requirement layer | `009/spec.md:152` |
| 5 | Env spelling | (not noticed) | ADR `MK_GOAL_*` vs code `OPENCODE_GOAL_*` | `decision-record.md:71,166`; `goal-core.cjs:42-43` |
| 6 | Scope-key + requirements citations | A1-1/A1-2, REQ-001/006/010, SC-004 | **Confirmed as cited** | `goal-core.cjs:174-193,203-206`; `009/spec.md:136,141,150,164` |

## What worked / what failed / ruled out

- **Worked:** grepping for writers before trusting run 1's "written by the stop path" — the two-writer structure surfaced in one grep; reading the ADR body rather than trusting its citations.
- **Failed (recorded, not silently fixed):** the malformed-legacy CLI grep ran with a bad relative path and returned empty — the "malformed legacy" output wording remains UNVERIFIED; the repo-wide `unbound` grep hit its head cut inside test sandboxes, leaving plugin/pi occurrences unchecked; the writer-2 identity confirmation read was not spent (TCB 12/12).
- **Ruled out:** (a) *the CLI 'unbound' precedent as the reason to reuse the vocabulary* — the precedent lives at `009/spec.md:152`; (b) *lastSpecFolder as an implicit primary binding* — confirmed dead, and now with shipped-behavior evidence: the prime hint (`dist/hooks/claude/session-prime.js:135-138`) plus the ADR's "session startup never claims it automatically" (`decision-record.md:87`) are the confirm-don't-claim pattern.

## Assessment

- `newInfoRatio`: 0.6 — genuinely new: the two-writer carrier structure, the systematic citation drift in run 1's D1/D7 evidence, the relocated 'unbound' precedent, the env-spelling drift, and the shipped prime-time suggestion; the scope-key arithmetic and 009 requirements were confirmations of claims run 1 had already evidenced.
- Convergence telemetry: 0.6 >> 0.05 threshold — not converged; irrelevant this lineage, which stops at maxIterations.
- Confidence: high on F2-F7 (lines read directly); F1's writer-2 identity is the only inference, flagged with its 1-call confirmation.

## Recommended Next Focus

Iteration 12 (A5): verify run 1's runtime feasibility table line-by-line — the only angle whose run-1 verdict was "answered-partial" — and attempt to close the UNKNOWN host-injection caps.
