# Deep Review Iteration 005 — Closing Recheck (correctness) + Unreached Cache/Lifecycle Slice

## Dispatcher

- Route: `mode=review`, `target_agent=deep-review`, `execution=single_review_iteration`.
- Run: `2026-11-23T21:02:32.908Z`, generation 4, lineageMode `restart`, iteration 5 of 5 (JSONL-derived count = 4 prior `type:"iteration"` records; dispatch said 5 of 5 — they agree).
- Review target: `.skilled/skills/system-skill-advisor` (read-only). Pack root: `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/review/`.
- Doctrine loaded before severity calls: `.skilled/skills/sk-code/sk-code-review/references/review-core.md` §2 (severity + reach calibration) and §3 (evidence rules).
- Two jobs this pass, as dispatched: (1) re-verify all 16 active findings at HEAD and record the outcome, with the most attention on R2-P1-001, the only P1; (2) cover the modules earlier passes never reached (`lifecycle/`, `freshness/`, `derived/`, `skill-graph/`, `cross-skill-edges/`, `prompt-cache.ts`, `source-cache.ts`) for stale-cache, rebuild-race and missing-invalidation defects.

## Files Reviewed

| Path:line | Purpose this pass |
| --- | --- |
| `runtime/advisor-server.ts:225-268` | P1 recheck: `resolveTrustedCaller` at HEAD |
| `.skilled/bin/system-skill-advisor-launcher.cjs:55-88` | P1 recheck: the launcher that supplies `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT` (outside target, cited as context) |
| `runtime/lib/auth/trusted-caller.ts:1-40` | P1 recheck: what `requireTrustedCaller` actually reads |
| `runtime/skill-advisor-cli.ts:1105-1130`, `:743-762` | P1 + R2-P2-002: spawn env passthrough; prompt-time refusal |
| `runtime/scripts/skill_advisor.py:245-275` | P1: `LAUNCHER_ONLY_ENV_KEYS` names the trust var; the bridge child never sees it |
| `references/graph/propagate-enhances.md:70-82` | P1: the invariant in prose (in scope because code contradicts it) |
| `runtime/lib/scorer/fusion.ts:1185-1195`, `:1250-1260`, `:1300-1312`, `:1446`, `:1458-1470` | R1-P2-001..005 recheck |
| `runtime/lib/shadow/shadow-sink.ts:130-145` | R2-P2-001 recheck |
| `runtime/tools/advisor-contract-keys.ts:1-14` | R3-P2-001 recheck |
| `feature-catalog/cli-surface/skill-advisor-cli.md:1-8`, `:16`, `:52`, `:61-67` | R3-P2-002 sharpening + `feature_catalog_code` protocol |
| `runtime/schemas/` listing | R3-P2-001: `tool-input-schemas.ts` does not exist |
| `hooks/pi/prompt-advisor.ts:18-40` | R4-P2-003 recheck |
| `runtime/scripts/skill_advisor.py:50-54`, `:4147-4148` | R4-P2-004 recheck |
| `runtime/lib/policy-plan.ts:200-232` | R4-P2-006 recheck |
| `runtime/lib/prompt-cache.ts:1-211` (full) | New coverage: TTL, key, eviction, invalidation |
| `runtime/lib/source-cache.ts:1-85` (full) | New coverage: TTL/LRU, invalidation hook |
| `runtime/lib/freshness.ts:340-392` | New coverage: the one `getOrCompute` call site |
| `runtime/lib/freshness/cache-invalidation.ts:1-73` (full) | New coverage: generation-monotonic guard |
| `runtime/lib/freshness/generation.ts:1-264` (full) | New coverage: publish, lock, token CAS |
| `runtime/lib/skill-graph/skill-graph-db.ts:1035-1075`, pragma/transaction sites | New coverage: rebuild transaction boundary |
| `runtime/lib/cross-skill-edges/metadata-loader.ts` (cache grep) | New coverage: no cache present |
| `runtime/stress-test/skill-advisor/generation-cache-invalidation-stress.vitest.ts:95-195` | New finding: which lock branches the suite covers |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. **R2-P1-001 remains ACTIVE at P1.** Severity is retained, not downgraded, and the reason is the doctrine rather than a judgement call — see "R2-P1-001 Severity Adjudication" below.

### P2 Findings

1. **The corrupt-lock reclaim deletes a lock another publisher is still acquiring** -- .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:186-191 -- `acquireGenerationLock` publishes the lock token non-atomically: it creates the lock with `openSync(lockPath, 'wx')` and writes `pid:acquiredAtMs:token` in a second syscall (`:154-158`). A concurrent publisher that hits `EEXIST` in that window reads the file while it is still zero-length; `readLockTokenAndAge` maps an empty file to `{token: null, ageMs: null}` (`:139-146`), and the nil branch then removes the lock **unconditionally**, with no second read and no token comparison (`:186-191`) — the very compare-and-swap the module comment at `:117-127` says protects reclamation. Both publishers then enter the critical section, both read the same `current.generation`, and both write `generation + 1` for two different content states, one `sourceSignature` overwriting the other.
Finding class: class-of-bug (TOCTOU / non-atomic lock publication)
Scope proof: the acquisition has exactly two statements between owning the inode and publishing the token (`:155-157`), and the reclaim path has three branches (`:176-191`); only the stale branch re-reads and compares the token (`:174-185`), while the nil branch and the `token === null` fallback both `rmSync` without confirmation. The stress suite exercises stale-token reclamation twice (`runtime/stress-test/skill-advisor/generation-cache-invalidation-stress.vitest.ts:145-171`, `:182-191`) and never the empty-file branch between `open` and `write`, so no existing test pins the behaviour either way.
Affected surface hints: `runtime/lib/freshness/generation.ts:154-158` the create-then-write pair -> `:139-146` the empty-file read -> `:186-191` the unconditional reclaim -> `runtime/lib/freshness/cache-invalidation.ts:45` the generation guard that assumes one number per committed state -> `runtime/advisor-server.ts:157-180` and `runtime/lib/daemon/watcher.ts:103` the publishers that can overlap
Case: the daemon's watcher rebuilds while an operator runs `advisor_rebuild`; the second publisher's `readLockTokenAndAge` lands between the first publisher's `openSync` and `writeFileSync`, sees `''`, deletes the live lock, and both publish generation N+1. A client that caches "I am current at generation N+1" now holds that belief against a state it never fetched, and the counter that freshness pairs with the database records one number for two states.

## R2-P1-001 Severity Adjudication (the only P1)

**Outcome: ACTIVE, P1 retained, evidence sharpened.** Confidence 0.85 → 0.85; `downgradeTrigger` unchanged.

What holds at HEAD, read directly:

- The code default is fail-closed: `resolveTrustedCaller` returns `process.env.SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT === 'trusted'` when transport metadata is silent [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:248], and its own comment promises that "absent/unknown transport metadata must fail CLOSED (untrusted)" [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:243-247].
- The shipped launcher inverts that effective default: `REPO_ENV_DEFAULTS` sets `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted'` [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:73-82], the CLI passes its environment straight through to the launcher [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1115-1121], and the gate then accepts a `_meta`-less caller [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/auth/trusted-caller.ts:23-36].
- So the input class the comment promises to reject — absent caller authority — is accepted in the shipped configuration. Reach is named: any same-user socket client that sends no `_meta`.

Why not P2, which is where I started: reach calibration is explicit — "When a guard, a thrown error or a doc line promises to reject an input class and the promise fails for an input in that class, the gap is a correctness finding and keeps `P1` or higher" (`.skilled/skills/sk-code/sk-code-review/references/review-core.md` §2). The failing promise is a doc line in the guarded function itself, and the input (absent metadata) is exactly the class it names. Impact-side arguments do not retire that.

Why not P0, which the security framing used to imply: `metadata.trusted === true` short-circuits to trusted before the environment is consulted [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:237-240], so any caller able to send a frame can self-grant the authority. The gate was never an authentication boundary, and the launcher default therefore grants nothing a caller could not assert. That lowers impact to "a guardrail that does not guard" and keeps the finding at P1, not P0.

Counterevidence considered and how it changed the record:

1. The launcher comment states the split deliberately: "repo policy, not code policy: the advisor's code defaults are deliberately the safer behavior … A live environment value or a `.env` entry still wins" [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:68-72]. Deliberate does not make the in-code promise true; it makes the promise stale. Recorded, not resolved.
2. The feature-catalog CLI entry describes the gate accurately, including the daemon-side knob: "fail-closed trusted-mutation gate (`--trusted` / `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED`, daemon-side `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT`)" [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md:3]. So the catalog is not the drifted surface; only the reference doc and the function comment are.
3. The Python bridge never sees the variable, by design: it is listed in `LAUNCHER_ONLY_ENV_KEYS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:255-263], so the fallback path has no equivalent inversion. The finding is scoped to the daemon, as first recorded.

One secondary defect folded in rather than filed separately (to avoid double-counting one surface): `references/graph/propagate-enhances.md:76` states "Trusted-caller authentication is required … Untrusted callers receive an authentication error", which no configuration provides — trust is caller-declared at `advisor-server.ts:237-240`. The fix for R2-P1-001 should correct that sentence to say "a trusted flag is required", not "authentication".

## Traceability Checks

- `spec_code` — **fail** (hard, applicable). The documented invariant is unmet at HEAD: [SOURCE: .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:76] claims authentication plus a refusal for untrusted callers; the resolver honours caller-declared trust and the shipped launcher makes absent authority trusted [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:237-248]. Not raised to pass, and the severity reclassification does not change the protocol status: the invariant is false in every configuration, in two different ways.
- `feature_catalog_code` — **partial** (warn, applicable). The CLI entry's gate description is accurate and names the daemon-side env knob [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md:3]; 7 of 7 root-relative `runtime/tests/...` rows resolve [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md:61-67]. The one gap is the inline citation at `:16`, which writes `tests/skill-advisor-cli-manifest-parity.vitest.ts` without the `runtime/` prefix its sibling rows use, so it does not resolve from the repo root (the file exists at `runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts`). That is R3-P2-002, sharpened below, not a new finding.
- `checklist_evidence` — **notApplicable** (carried from iteration 3): the packet has no checklist or acceptance file.
- `skill_agent`, `agent_cross_runtime` — not run this pass. They need agent-definition and runtime-mirror surfaces, and the closing pass budget went to the carried-finding recheck and the unreached cache/lifecycle slice. Recorded as unrun, not as pass.

## Integration Evidence

Exact surfaces checked as producers/consumers, not as nearby files:

- `runtime/handlers/advisor-recommend.ts:528` calls `advisorPromptCache.invalidateSourceSignatureChange(sourceSignature)`, and `runtime/lib/skill-advisor-brief.ts:513` does the same from an `onCacheInvalidation` listener registered at `:27`. Prompt-cache invalidation is wired on both the request path and the freshness event, so the cache is not the stale surface I expected to find.
- `runtime/lib/source-cache.ts:83` `clearAdvisorSourceCache` has no production caller; its consumers are `runtime/tests/legacy/advisor-freshness.vitest.ts:114`, `:254`, `:303`. The cache is nonetheless correct because the key carries content: [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:386-391] keys on `workspaceRoot:sourceSignature:generation`, so a rebuild produces a different key rather than a stale hit.
- `runtime/lib/cross-skill-edges/metadata-loader.ts` holds no cache (grep for `cache|mtime|Date.now` returns nothing), so the cross-skill edge path cannot serve a stale load.
- `runtime/lib/skill-graph/skill-graph-db.ts:1045-1058` runs the doc-trigger harvest after `tx()` at `:1042`, deliberately: the comment at `:1045-1048` explains that reference and asset edits never touch the node hashes, so doc work cannot be gated by them. A throw in `harvestSkillDocs` therefore aborts before `setMetadata('last_scan_timestamp')` (`:1068`) and before the caller publishes a generation (`runtime/advisor-server.ts:161-170`), leaving freshness stale rather than falsely live. Safe ordering — recorded under Ruled Out.
- `runtime/lib/freshness/generation.ts:215-232` publishes after releasing the lock, which is the interleaving `cache-invalidation.ts:31-45` was written for; the guard compares generations and drops strictly older events.

## Verification of Carried Findings (all 16, at HEAD)

| ID | Sev | Status at HEAD | Evidence |
| --- | --- | --- | --- |
| R2-P1-001 | P1 | **Active, retained, sharpened** | `advisor-server.ts:237-248` + `launcher.cjs:73-82` + `propagate-enhances.md:76`; see adjudication above |
| R1-P2-001 | P2 | Active | `fusion.ts:1188-1191` assigns the RRF score into the same `score` the threshold, abstain and bonus stages consume |
| R1-P2-002 | P2 | Active | `fusion.ts:1254-1255` gates the command tie-break on `!promptLower.includes('/')`, so any path disables it |
| R1-P2-003 | P2 | Active | `fusion.ts:1446` returns `passing` while `:1462` computes `ambiguous` on `ranked` |
| R1-P2-004 | P2 | Active | `fusion.ts:1304-1306` counts tokens by `length > 1`, which admits "the", "can", "it" |
| R1-P2-005 | P2 | Active | `fusion.ts:544-552` keeps a single `binding` holder per target |
| R2-P2-001 | P2 | Active | `shadow-sink.ts:136-141` `mkdirSync`/`appendFileSync` with no mode and no owner check |
| R2-P2-002 | P2 | Active | `skill-advisor-cli.ts:747-761` refuses prompt-time mutations; the daemon dispatch has no prompt-time concept (the flag exists only in the CLI and `hooks/lib/skill-advisor-cli-fallback.ts:207-212`) |
| R3-P2-001 | P2 | Active | `advisor-contract-keys.ts:7-9` names `skill_advisor/tools/advisor-recommend.ts`, `skill_advisor/tools/advisor-validate.ts` and `schemas/tool-input-schemas.ts`; the real files are `runtime/tools/…` and `runtime/schemas/advisor-tool-schemas.ts`, and `ls runtime/schemas` shows no `tool-input-schemas.ts` |
| R3-P2-002 | P2 | Active, sharpened | `skill-advisor-cli.md:16` cites `tests/skill-advisor-cli-manifest-parity.vitest.ts`; from the repo root that path does not resolve, while the same table's rows at `:61-67` are root-relative and do. Scope narrowed: the suite itself exists at `runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts`, so this is a prefix defect only |
| R4-P2-001 | P2 | Active | Carried from iteration 4 (`advisor-tool-schemas.ts:588`, repository-wide search returns the definition only); no counterevidence found |
| R4-P2-002 | P2 | Active | Carried (`fusion.ts:1104-1471`, 368 lines; `command-attach.ts:257-373`) |
| R4-P2-003 | P2 | Active | `hooks/pi/prompt-advisor.ts:22-23` `PI_ADVISOR_DEFAULT_BUDGET_MS = 2500` and `:30-38` the copied parse; source is `hooks/claude/user-prompt-submit.ts:182` |
| R4-P2-004 | P2 | Active | `skill_advisor.py:52` `ADVISOR_PROMPT_MAX_CHARS = 10_000` and `:4147` `_LOOP_OWNER_CONFIDENCE_FLOOR = 0.82` mirror `advisor-tool-schemas.ts:257` and `scoring-constants.ts:185-192` |
| R4-P2-005 | P2 | Active | Carried (`skill_advisor.py:5258-5268` vs `prompt-policy.ts:245`; TS guard in `runtime/tests/legacy/`) |
| R4-P2-006 | P2 | Active | `policy-plan.ts:203-211` bare `catch { return undefined; }`, sole consumer at `:228` |

No carried finding is a false positive at HEAD. One is sharpened (R3-P2-002, scope reduced to a path prefix), one is re-adjudicated with retained severity (R2-P1-001). Totals after this pass: **P0 = 0, P1 = 1, P2 = 16** (15 carried + R5-P2-001).

## Edge Cases

- **Prompt-cache clock**: `get` and `set` both default to `performance.now()` (`prompt-cache.ts:114`, `:145`), so expiry is monotonic and self-consistent; no `Date.now()` call enters the class. A caller that passes its own `nowMs` in one method and not the other would mix clocks, but no production caller passes it. Not filed.
- **`evictOldestUntilBelowLimit` is FIFO, not LRU** (`prompt-cache.ts:186-196`): a re-`set` of an existing key keeps its original Map position. The method and its docstring say "oldest", not "least recently used", so the code is honest about what it does; not filed, recorded as a naming trap for a future reader.
- **`source-cache.getOrCompute` freezes the TTL of the first writer** (`source-cache.ts:66-80`): a later call with a different `ttlMs` reuses the original `expiresAt`. Single caller with a single constant today (`freshness.ts:387-391`), so this is latent rather than live. Recorded, not filed.
- **`invalidateSkillGraphCaches` lets equal generations through** (`cache-invalidation.ts:45` uses `<`, not `<=`), so a duplicate generation number notifies listeners twice. That is benign today and becomes load-bearing only if R5-P2-001's lost-bump path is hit, which is why R5-P2-001 names that guard as an affected surface.
- **Empty-lock reclaim window is not reproducible on demand**: it needs a read that lands between another process's `openSync` and `writeFileSync`. R5-P2-001 is therefore proven by two-statement ordering plus the read mapping at `:139-146`, not by a failing probe; no test in `runtime/stress-test/skill-advisor/` covers the nil-token branch.
- **R2-P2-002 reachability after the P1 re-adjudication**: with trust self-assertable (`advisor-server.ts:237-240`), the direct-socket client loses nothing by the P1's default inversion that it could not take itself. The two findings are not merged because their fixes differ: R2-P1-001 is a default plus doc correction, R2-P2-002 is moving the prompt-time refusal into the daemon so both doors share one rule.
- **Coverage this pass is partial by budget.** Read fully: `prompt-cache.ts`, `source-cache.ts`, `cache-invalidation.ts`, `generation.ts`. Read partially: `freshness.ts` (the cache call site and generation branch), `skill-graph-db.ts` (the rebuild transaction and pragmas), `metadata-loader.ts` (cache grep only). **Not read**: `runtime/lib/lifecycle/*.ts`, `runtime/lib/derived/*.ts`, `runtime/lib/cross-skill-edges/{detect-inbound-enhances,apply-graph-metadata-patch,context-template}.ts`, `runtime/lib/skill-graph/{bfs-traversal,doc-frontmatter,metadata-sanitizer,skill-graph-queries}.ts`. Recorded as deferred, not as clean.

## Confirmed-Clean Surfaces

- **Cache invalidation on rebuild is wired, not missing**: both the request path (`advisor-recommend.ts:528`) and the freshness listener (`skill-advisor-brief.ts:513`) drop entries whose `sourceSignature` changed, and the source cache keys on the signature itself (`freshness.ts:386-391`). The stale-cache direction the dispatch named is not a defect in these four modules.
- **Generation publish is atomic**: temp file, `fsync`, `rename`, directory `fsync`, temp cleanup on failure (`generation.ts:93-114`), so readers never observe a half-written counter.
- **Lock release is token-checked** (`generation.ts:160-171`): a publisher that lost the lock does not delete the new holder's file.
- **Python fallback cannot inherit the trust inversion**: the variable is launcher-only (`skill_advisor.py:255-263`).
- **No cache in the cross-skill-edge loader** (`metadata-loader.ts`): nothing to invalidate.
- **Comment hygiene at HEAD**: the lines read this pass carry no artifact labels; the `specs/<packet>` mentions that exist (e.g. `generation.ts:56-66`) state why a cwd must be anchored, which is durable WHY.

## Ruled Out

- A stale `getAdvisorFreshness` entry surviving a rebuild: the cache key includes `sourceSignature` and `generation` (`freshness.ts:386-391`), so a rebuild misses rather than hits.
- A missing invalidation hook on the prompt cache: both `advisor-recommend.ts:528` and `skill-advisor-brief.ts:513` invalidate on signature change.
- A cache in the cross-skill-edge metadata loader: no cache exists (`metadata-loader.ts`, grep for `cache|mtime|Date.now` is empty).
- A rebuild race through the *stale*-lock branch: that branch re-reads and compares the token before deleting (`generation.ts:174-185`), and the stress suite pins it twice.
- A partial rebuild when the doc harvest fails: the harvest runs after the node transaction but before `setMetadata('last_scan_timestamp')` and before any generation publish (`skill-graph-db.ts:1042-1068`, `advisor-server.ts:161-170`), so the failure leaves freshness stale rather than live.
- A clock mismatch inside the prompt cache: both ends default to `performance.now()` (`prompt-cache.ts:114`, `:145`), and no production caller overrides `nowMs`.
- `clearAdvisorSourceCache` being dead as a correctness defect: the only consumers are legacy tests, but the cache is key-correct, so the export is unused rather than broken.

## SCOPE VIOLATIONS

None. No write was attempted outside the three permitted state files; all probes ran read-only and any scratch file was placed under the private temp directory.

## Next Focus

- Dimension: none remaining (4/4 reviewed; iteration budget exhausted at 5 of 5).
- Focus area: none — this was the closing pass. Remaining work belongs to remediation, not to another review iteration.
- Reason: `maxIterations` reached; `stopPolicy` is `max-iterations`, so the loop stops here by configuration rather than by convergence.
- Rotation status: correctness, security, traceability, maintainability all reviewed. This pass: 1 new P2, 0 new P1/P0, 1 severity re-adjudication (R2-P1-001 retained at P1), 1 finding sharpened (R3-P2-002).
- Blocked/productive carry-forward: nothing was blocked this pass; the deferred slice (`lifecycle/`, `derived/`, most of `cross-skill-edges/` and `skill-graph/`) is named in the edge cases for a follow-up run.
- Required evidence for remediation: a file:line fix plus a test for R2-P1-001's promise (either the comment and default agree, or the launcher comment owns the behaviour and the reference doc stops saying "authentication"); an `openSync`-then-`write` replacement plus an empty-lock test for R5-P2-001.
- Recovery note: if a future pass re-runs these modules, start with `lifecycle/` and `derived/`, which no generation of this review has read.

## Verdict

No active P0. One active P1 (R2-P1-001, retained after re-adjudication under the doctrine's reach calibration). One new P2 (R5-P2-001). So the verdict is CONDITIONAL.

Review verdict: CONDITIONAL
