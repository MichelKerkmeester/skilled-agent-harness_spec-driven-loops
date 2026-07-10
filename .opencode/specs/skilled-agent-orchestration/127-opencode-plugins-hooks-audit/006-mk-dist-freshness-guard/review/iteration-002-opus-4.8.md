# Iteration 2 - Opus 4.8 (high) cross-check - mk-dist-freshness-guard

> **Executor:** Claude Opus 4.8 (`claude-opus-4-8 --effort high`, plan mode) via cli-claude-code through account2, read-only, 2026-07-10.
> **Purpose:** independently verify iteration-1 (GPT-5.6-Sol-Fast) findings and surface issues the first pass missed.

## Net assessment

All 7 prior findings hold on the real code: F2/F5/F6/F7 confirmed as-stated, and F1/F3/F4 confirmed in mechanism but downgraded P1->P2 because each is an advisory/warn-only guard whose worst case is a missed or delayed non-blocking warning under atypical conditions. Net: zero P0/P1 after this pass — five surviving P2s (F1,F2,F3,F4,F5) plus F6(P2) and F7(refinement). Added 5 new findings: a real coverage-parity divergence (O1), a retroactive-warning design gap (O2), and three refinements (cache never anchors to dist identity O3, orphan .tmp accumulation O4, over-broad .json watching O5).

**Prior findings adjudicated:** 7 - 3 adjusted, 4 confirmed. **New findings this pass:** 5.

**Parity (Opus view):** The two surfaces share the same core checker and therefore inherit its hash/mtime gap (F1) and error==fresh blindness (F2). Their trigger philosophies genuinely diverge and neither strictly dominates: Claude checks per-edit and immediately but only the edited file's package (O1) and can overrun its 10s hook budget (F4) and crash on non-dict JSON (F5); OpenCode checks all packages and contains exceptions per-handler but warns up to 2 min late post-edit (F3) and only retroactively at bash dispatch (O2). Bringing them to true parity means giving OpenCode a per-edit invalidation and giving Claude a check-all pass plus a robust non-dict-input guard and a shared timeout budget.

## 1. Verification of iteration-1 findings

| Prior ID | GPT sev | Opus verdict | Opus sev | Adjudication note |
|----------|---------|--------------|----------|-------------------|
| F1 | P1 | **adjusted** | P2 | Confirmed the mechanism: dist-freshness.cjs:430 fast-path returns fresh only on hash match; on hash mismatch it defers to the mtime comparison (445-471) and, when newestSourceMtime<=distMtime, re-blesses the new hash and returns fresh (473-488). So a content change whose mtime is not newer than dist is silently fresh. Downgraded P1->P2: normal edits and `git checkout`/branch-switch set mtime=now (detected as stale), so the false-negative only fires with mtime-preserving restores (tar -p, rsync --times, backdated touch). Note the cache is self-written by the checker (330,473), never by a build, so the stored hash anchors to 'last blessed source', not 'what dist was built from' — that is the deeper reason the mtime fallback is load-bearing. |
| F2 | P1 | **confirmed** | P2 | Confirmed both surfaces. freshnessError sets stale:false (dist-freshness.cjs:359); check-all derives status purely from stale filter (590-592) so an all-error run reports status:'fresh' exit 0. In the plugin, stalePackages filters `.stale` (58) so error objects are dropped, and refreshStale's catch (97) is effectively dead for per-package errors because checkPackageFreshness RETURNS error objects rather than throwing — so a systematically broken checker (e.g. a renamed dir in sourceCandidates -> missing -> error) is invisible: not stale, not injected, not even logged. Real blind spot. Held at P2 rather than P1 because the guard is advisory/warn-only and fail-open by explicit design (module header line 6). |
| F3 | P1 | **adjusted** | P2 | Confirmed: staleForInjection reuses staleCache for STALE_CACHE_TTL_MS=120000 (28,110). tool.execute.before bails on any non-bash tool (119) and only refreshes on the risky-bash regex, so Edit/Write of a watched source never invalidates the cache; the injected brief can read 'fresh' for up to 2 min post-edit. The Claude PostToolUse hook checks per-edit immediately, so it is a genuine parity gap. Downgraded P1->P2: the signal is advisory system-context, not a block, and the 2-min lag only matters when an edit is followed by an injection turn with no intervening risky bash / session boundary. |
| F4 | P1 | **adjusted** | P2 | Confirmed the arithmetic: claude-posttooluse.sh runs the comment checker with timeout=8 (72) then the dist checker with timeout=8 (97) sequentially, while .claude/settings.json:92 caps the whole PostToolUse hook at 10s. Worst case 16s > 10s, so if the comment checker consumes its full budget the harness SIGKILLs the hook before/while the dist checker runs, losing the dist warning and logging a hook timeout. Downgraded P1->P2: consequence is a lost advisory warning plus a harness timeout log, not a block or data corruption (hook is fail-safe exit 0); checkers are single-file and fast in practice. |
| F5 | P1 | **confirmed** | P2 | Confirmed contract violation. The try at claude-posttooluse.sh:39-44 wraps ONLY sys.stdin.read()+json.loads; the dict assumptions at 47 (data.get), 52-53 (tool_input.get), and 59 (cwd) are outside it and main() has no top-level guard. Valid-but-non-object JSON breaks 'always exits 0': `[]`/`"s"`/`123`/`null` -> data.get AttributeError at 47; `{"tool_input":null}` -> None.get at 53; `{"cwd":null}` -> os.path.join(None,...) TypeError in resolve_checker. All uncaught -> traceback + exit 1. Also note `except (json.JSONDecodeError, Exception)` (42) is redundant (Exception subsumes JSONDecodeError). P2: the Claude harness sends a well-formed object in practice, so the plausible real trigger is a present-but-null field like tool_input/cwd. |
| F6 | P2 | **confirmed** | P2 | Confirmed. From check-dist-staleness.sh script_dir (.opencode/skills/sk-code/code-quality/scripts), '../../../..' (line 19) climbs code-quality->sk-code->skills->.opencode, resolving repo_root to <root>/.opencode. Line 31/34 then append '.opencode/skills/...', yielding <root>/.opencode/.opencode/skills/... — the checker is not found and the fallback silently no-ops. Correct depth is 5 ('../../../../..'). Impact stays P2: the fallback only triggers when os.getcwd() lacks the checker (line 30-32); the wired hook cds to CLAUDE_PROJECT_DIR so the primary path resolves and the fallback is dead code in normal use. (Verified the sibling fallback in claude-posttooluse.sh:30-35 is correct — __file__/../<name> lands in scripts/.) |
| F7 | refinement | **confirmed** | refinement | Confirmed. sessionWarned only .add()s (133); there is no session.deleted / disposal handler, unlike other plugins. appendGuardLog (66-74) appends with no rotation or size bound. Both grow unbounded in a long-lived process — sessionWarned by distinct session count (small), the log by write count. Low impact; refinement is the right tier. |

## 2. New findings (missed by iteration 1)

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| O1 | P2 | parity | `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:524` | Coverage divergence: Claude warns only for the edited file's package; OpenCode warns for ALL stale packages | high |
| O2 | refinement | parity | `.opencode/plugins/mk-dist-freshness-guard.js:117` | Risky-bash trigger refreshes the cache but surfaces the warning one turn late | high |
| O3 | refinement | bug | `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:430` | Freshness cache is never anchored to dist/build identity, so dist reverts/tampering with unchanged source read as fresh | med |
| O4 | refinement | bug | `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:267` | Orphan .tmp cache files accumulate on crash between write and rename | med |
| O5 | refinement | bug | `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:15` | '.json' in SOURCE_EXTENSIONS makes data/config JSON count as watched sources, risking false stale warnings | med |

### Detail

#### O1 - Coverage divergence: Claude warns only for the edited file's package; OpenCode warns for ALL stale packages
- **Severity / Category / Confidence:** P2 / parity / high
- **Location:** `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:524`
- **Evidence:** The Claude path (check-dist-staleness.sh -> `check-file --file <edited>`) resolves exactly one package via packageForSourceFile (519-522); an unmatched file (e.g. a README) returns status:'unmatched' stale:false and warns nothing, and a stale package B is never surfaced when the edit was in package A. The OpenCode plugin injects buildBrief over checkAllFreshness().filter(stale) every turn (plugin 58,142), so it reports every stale package regardless of what was just edited.
- **Impact:** The two surfaces disagree on what they surface after the same edit: OpenCode keeps warning about pre-existing/cross-package staleness; Claude goes silent unless the just-edited file maps to a stale watched package. A dist left stale by a different file/session is invisible on the Claude surface.
- **Proposed fix:** Give the Claude PostToolUse path a check-all pass (or additionally run check-all) so cross-package staleness surfaces there too, or document the intentional 'edited-file-scoped' contract and align expectations.

#### O2 - Risky-bash trigger refreshes the cache but surfaces the warning one turn late
- **Severity / Category / Confidence:** refinement / parity / high
- **Location:** `.opencode/plugins/mk-dist-freshness-guard.js:117`
- **Evidence:** tool.execute.before matches the risky-bash regex and calls refreshStale('risky-bash') (122) but never mutates `output`/blocks or injects anything; the refreshed stale list only reaches the agent at the next experimental.chat.system.transform (140-148). So for the very `opencode run`/`validate.sh` dispatch the guard exists to protect, the warning appears only on the following chat turn — after the risky command already executed against stale dist.
- **Impact:** The guard's stated purpose ('warn when a Bash dispatch is about to trust stale dist', header 4-5) is met retroactively, not preventively; the dispatch it targets runs before the agent sees the brief.
- **Proposed fix:** If OpenCode's tool.execute.before can annotate output or short-circuit, surface the stale brief at dispatch time; otherwise document that the warning is next-turn and by design.

#### O3 - Freshness cache is never anchored to dist/build identity, so dist reverts/tampering with unchanged source read as fresh
- **Severity / Category / Confidence:** refinement / bug / med
- **Location:** `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:430`
- **Evidence:** The stored cache holds only {version, sourceHash} (264-273) and is written by the checker itself (330,473), never by the build. The fast-path at 430 returns fresh on sourceHash match WITHOUT re-checking dist mtime/identity. If the dist entry is later reverted to an older/hand-edited build while source stays byte-identical (hash unchanged), the check still returns fresh. Missing-dist is caught (383) but present-but-stale-dist under unchanged source is not.
- **Impact:** Compounds F1: staleness detection can only ever be as good as source-side signals; a dist that regresses without a source change is undetectable. Narrow but a genuine conceptual gap for a freshness guard.
- **Proposed fix:** Record dist identity (mtime or content hash of distEntry) alongside sourceHash in the cache and invalidate 'fresh' when the recorded dist identity no longer matches; ideally have builds write the cache post-compile.

#### O4 - Orphan .tmp cache files accumulate on crash between write and rename
- **Severity / Category / Confidence:** refinement / bug / med
- **Location:** `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:267`
- **Evidence:** writeStoredSourceHash writes to `${cachePath}.${process.pid}.tmp` then renameSync (267-269). If the process crashes or is SIGKILLed between writeFileSync and renameSync (plausible under the F4 hook-timeout SIGKILL while a check-file run is mid-write), the .pid.tmp file is left in the package's dist directory with no cleanup path anywhere in the module.
- **Impact:** Slow accumulation of `.dist-freshness-*.json.<pid>.tmp` artifacts inside watched dist dirs; harmless functionally but untidy and never garbage-collected.
- **Proposed fix:** On startup or in writeStoredSourceHash, best-effort unlink stale `*.tmp` siblings, or write to an OS temp dir before rename.

#### O5 - '.json' in SOURCE_EXTENSIONS makes data/config JSON count as watched sources, risking false stale warnings
- **Severity / Category / Confidence:** refinement / bug / med
- **Location:** `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:15`
- **Evidence:** SOURCE_EXTENSIONS includes '.json' (15) and isWatchedSourceFile matches any watched extension (198-200). For packages without a sourceExtensions override, every .json under a directory candidate is hashed as source — e.g. system-skill-advisor includes the 'data' dir (115) and mcp_server includes 'schemas'/'configs' (58-63). Editing a non-compiled data/fixture .json bumps the source hash and (with a newer mtime) reports the dist stale. system-code-graph avoids this by overriding sourceExtensions to TS-only (149), showing the broad default is a known sharp edge.
- **Impact:** Benign, non-build JSON edits can raise 'STALE DIST' warnings for packages whose data JSON isn't actually compiled, eroding trust in the guard (cry-wolf).
- **Proposed fix:** Restrict '.json' watching to manifest basenames plus build-relevant config JSON, or add sourceExtensions/excludedSegments overrides (or an explicit data-dir exclusion) for packages that ship non-compiled JSON like system-skill-advisor's 'data'.

