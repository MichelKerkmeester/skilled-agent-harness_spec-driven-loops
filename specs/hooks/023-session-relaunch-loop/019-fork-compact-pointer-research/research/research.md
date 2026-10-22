# Deep Research: the session-relaunch compact-pointer misfire into forked sub-agents

Lineage: `deepseek-pi` · Session: `fanout-deepseek-pi-1792608380069-rdh5rh` · Iterations: 10 · Stop: max iterations reached

---

## 1. EXECUTIVE SUMMARY

On 2026-10-21 the Claude SessionStart hook `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` logged `compact-pointer` three times for session `0b9dc60c-478f-4659-8191-2da52f1cd765` (14:44:41.453Z, 15:30:23.714Z, 17:42:12.039Z). The parent session did not compact that day. Every one of those three fires executed inside a **fork sub-agent**, not in the parent.

The mechanism is not a race and not a mis-registration. A fork inherits the parent's `session_id`, and the platform emits `SessionStart` with `source: "compact"` inside the fork. The hook's only gate is `payload.source === 'compact'`, the very value the platform sets for a fork, so the hook cannot tell a fork from its parent and advertises the parent's open handoff note to a sub-agent that must not claim it.

The two fork replies at 15:17 and 15:33 refused the claim. That refusal was model judgment, not a control: `claimHandoff` would have accepted it.

## 2. PROBLEM AND EVIDENCE STANDARD

The question was fourfold: what the SessionStart payload holds for a fork versus the parent, where fork transcripts live, which paths share the hazard, and what the smallest correct fix plus its proof test is. Every finding in this report carries a file/line citation or a quoted log/transcript line; where a value could not be recovered from local artifacts it is named UNKNOWN rather than assumed.

## 3. THE HOOK'S DECISION PATH

`compact-pointer.mjs` reads stdin, then:

1. `if (payload.source !== 'compact') return done();` — the only source gate (`compact-pointer.mjs:67`).
2. `const sessionId = payload.session_id;` with a format check (`:69-70`).
3. `nudge.writeState(sessionId, 0)` — resets the nudge ladder for that session id **before any other guard** (`:73`).
4. `if (nudge.handoffPending({ sessionId })) return done();` (`:80`).
5. `nudge.openNotePathFor({ repoRoot, sessionId })` (`:82`) then `logEvent('compact-pointer', …)` and `emit(...)` with `afterCompaction: true` (`:85-92`).

The hook is registered on the SessionStart event with an empty matcher (`.claude/settings.json:173`), so it runs for every source and relies entirely on step 1.

## 4. WHAT THE PAYLOAD CARRIES

The repository's own hook contract documents the canonical Claude SessionStart payload as `source` (`startup`/`compact`/`resume`/`clear`), `session_id`, `transcript_path`, `stop_hook_active`, `context_window_tokens` — and no agent id, subagent flag or fork marker (`.skilled/hooks/session-lifecycle/README.md:55`).

Inside the fork at 15:30, a second independent SessionStart hook recorded:

```
INFO [speckit-hook:session-prime] SessionStart triggered (source: compact, session: 0b9dc60c-478f-4659-8191-2da52f1cd765)
```

(quoted from the fork transcript `…/<parent-session>/subagents/agent-ae7668a35ed03d742.jsonl:195`, stderr of `session-prime`).

So for a fork: `source = compact`, `session_id = <parent id>`, and nothing that names the agent. The fork's own `transcript_path` value is **UNKNOWN locally** — no artifact on this machine records it (iteration 5 finding 3) — which is why the recommended fix is deliberately neutral to it.

## 5. WHERE FORK TRANSCRIPTS LIVE

`~/.claude/projects/<project-slug>/<parent-session-id>/subagents/agent-<agentId>.jsonl` with a sibling `agent-<agentId>.meta.json`. The directory is named after the **parent** session id, and the meta file carries the fork marker that the hook never sees:

```json
{"agentType":"fork","isFork":true,"spawnDepth":1,"description":"…","toolUseId":"toolu_…","requestShape":"background","model":"inherit","finished":true}
```

Each transcript record also carries `agentId` and `isSidechain: true`. Neither field reaches the hook payload.

## 6. TIMELINE RECONSTRUCTION

| Time (UTC) | Artifact | Event |
|---|---|---|
| 14:07:33 | note `20261021T140733Z-0b9dc60c.md` | prepare wrote the parent's handoff note, `loop_id:` empty, still `status: open` |
| 14:44:41.453 | `relaunch.log` | `compact-pointer sessionId=0b9dc60c… note=…20261021T140733Z-0b9dc60c.md` |
| 14:44:41.466 | `subagents/agent-aea1c7f90bbedad3d.jsonl:273` | `hook_success` `SessionStart:compact` inside the fork |
| 15:17:38.926 | `subagents/agent-aea1c7f90bbedad3d.jsonl:462` | fork reply that refuses the claim |
| 15:29:16.367 | `session-prime` cache | compact cache for the parent session id, written with no parent record at 15:29 and no boundary |
| 15:30:23.714 | `relaunch.log` | second `compact-pointer` |
| 15:30:23.729 | `subagents/agent-ae7668a35ed03d742.jsonl:193` | `SessionStart:compact` inside a second fork |
| 17:42:12.039 | `relaunch.log` | third `compact-pointer` |
| 17:42:12.061 | `subagents/agent-a94347aac9778aa86.jsonl:152` | `SessionStart:compact` inside a third fork |

The parent transcript's `compact_boundary` records are 2026-10-19T02:59:33, 05:45:39, 10:42:10, 15:24:00 and 2026-10-20T08:02:23, 16:19:05 — six records, **none on 2026-10-21**. Its last `SessionStart:compact` hook attachment is 2026-10-20T16:19:06.293Z.

## 7. WHY THE HOOK RESOLVES THE PARENT'S NOTE

`openNotePathFor` selects by filename suffix `-<first 8 chars of session_id>.md` plus `status: open` and a frontmatter `session_id` match (`nudge.cjs:307-333`, `SESSION_ID_PREFIX_LENGTH = 8` at `:38`). A fork's session id is the parent's id, so the suffix, the status and the frontmatter all match the parent's open note. There is no agent dimension anywhere on that path.

## 8. HAZARD TABLE

| Path | Shares the hazard? | Consequence observed or implied |
|---|---|---|
| `compact-pointer` (SessionStart) | Yes — fires in forks | Emits the parent's pointer with a false "this session was compacted" claim; resets the parent's nudge level to 0 |
| `session-prime` (SessionStart) | Yes — fires in forks | Injects the parent's cached compact brief; forwards `{session_id, boundary: compact}` to the directive-lifecycle store for the parent |
| `spec-gate` state | State keyed by `hex(session_id)` | A fork writes the parent's gate record |
| `claim` (CLI) | Yes — accepts the instruction | `claimHandoff` validates only that the session id is well formed and the note is open (`relaunch-core.cjs:576-592`); a fork's claim would succeed |
| `context-nudge` (UserPromptSubmit / PostToolUse) | Code shares it | Not dispatched inside forks in the observed run; if it were, it would persist the level under the parent's id |
| `stop-arm` (Stop) | Code shares it | Not dispatched inside forks; if it were, the killer would watch a fork transcript while arming the parent's loop record |
| codex / pi / hermes / opencode adapters | No pointer equivalent | The pointer exists only in the Claude adapter (iteration 7) |

## 9. THE SMALLEST CORRECT FIX

Three edits, all inside the Claude adapter and the relaunch lib:

1. **Boundary evidence.** Emit only when the transcript named by `payload.transcript_path` holds a `{"type":"system","subtype":"compact_boundary","timestamp":…}` record whose timestamp is **strictly after** the note's `created_at`. A fork's SessionStart implies a compaction that never wrote a boundary, so every observed fire is suppressed.
2. **One delivery per compaction.** Record the delivery as (note path, boundary timestamp) in the relaunch state directory and skip a repeat. This closes the residual case where the parent really compacted and ignored its own pointer, and it makes 14:44 / 15:30 / 17:42 collapse to at most one.
3. **Guard order.** Move `nudge.writeState(sessionId, 0)` below the guards so a suppressed fire has no side effect on the parent's ladder.

A missing `transcript_path` is "cannot verify" and should fail closed with its own `compact-pointer-skipped reason=no-transcript` log row, because a wrong emission can get the parent's note claimed while a wrong suppression leaves the note open and reclaimable.

## 10. TESTS THAT PROVE IT

In `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`, with one new fixture helper that writes a transcript containing a boundary record:

- **A** boundary after the note → compacted-session context + claim command + `{level:0}`.
- **B** no boundary (the reproduced fork case) → empty stdout, level file still `{level:2}`.
- **C** boundary before the note → empty stdout.
- **D** no `transcript_path` → empty stdout and a `compact-pointer-skipped reason=no-transcript` row in `relaunch.log`.

Test B is the regression test for this incident. Test D is what makes a future silent disable impossible.

## 11. ELIMINATED ALTERNATIVES

| Alternative | Why eliminated |
|---|---|
| Read a fork marker from the payload | The documented payload contract carries no agent/fork field |
| Tear down the whole hook surface as forking-unsafe | PostToolUse and Stop adapters never ran inside the forks; the radius is SessionStart plus the seed |
| Patch only the seed text | The fork would still be pushed to claim the parent's note; the text is a symptom |
| Infere compaction from the nudge state file | The hook overwrites that file, so it cannot be evidence |
| Reuse an existing transcript reader | Nothing in the tree parses compaction boundaries and the tail helper is not exported |
| Fail open on a missing transcript | Reproduces the observed misfire whenever the path is absent |
| Register a SubagentStart marker hook | Adds a new registration where a transcript check inside the existing hook suffices |
| Store the delivery marker in the note frontmatter | The marker would travel with the parent's note into a future claim |

## 12. OPEN QUESTIONS

- A fork's exact `transcript_path` value. It does not change the recommended fix, which behaves identically whether that path names the fork transcript or the parent's.
- Who wrote the parent-keyed compact cache at 15:29:16.367Z. It proves only that a cache entry is not evidence of a compaction, which is why `session-prime` needs the same boundary check.
- Whether `session-prime`'s directive-lifecycle notification should also be gated; the notification writes a `compact` boundary for the parent session and its consumer was outside this lineage's read budget.

## 13. DIVERGENCE MAP

No divergent pivots were taken. Saturated directions: payload-side fork detection (saturated in iteration 2, re-confirmed in 10). Remaining frontier: the agent-scoped state model across the hook family, which is a design question larger than this defect.

## 14. RECOMMENDATION

Land the three edits with tests A-D in one change. Treat the note-claim path separately: `claimHandoff` should refuse a claim from a process whose session is a fork, or the pointer fix remains the only barrier.

## 15. SCOPE LIMITS OF THIS LINEAGE

The workflow's post-synthesis `step_writeback_spec_findings` and `step_validate_post_synthesis_spec_doc` write into the packet's `spec.md`, outside this lineage's write authority. Both were left unrun deliberately; the packet-level synthesis and validation remain the parent run's step.

## 16. REFERENCES

- `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`
- `.skilled/hooks/session-relaunch/lib/context-usage.cjs`
- `.skilled/hooks/session-relaunch/claude/context-nudge.mjs`
- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`
- `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`
- `.skilled/hooks/session-lifecycle/README.md`
- `.skilled/hooks/README.md`
- `.claude/settings.json`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts`
- `os.tmpdir()/skilled-relaunch-501/relaunch.log`
- `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765.jsonl`
- `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/subagents/agent-{aea1c7f90bbedad3d,ae7668a35ed03d742,a94347aac9778aa86}.jsonl`

---

## Appendix: Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0 key questions (three open items recorded as UNKNOWNs above)
- Convergence threshold: 0.1 (newInfoRatio); stop policy `max-iterations` ran every iteration by design
- newInfoRatio trend: 0.90, 0.60, 0.70, 0.50, 0.40, 0.55, 0.45, 0.35, 0.45, 0.20
- Findings recorded: 61 across 10 iterations
- Divergence summary: no divergent pivots; one saturated direction (payload-side fork detection)

---

## Orchestrator Verification

Checked by the orchestrating session against the files and transcripts after the lineage finished. A lineage finding is a claim until something run confirms it.

### Confirmed

- `compact-pointer.mjs:67` is the only source gate, and `nudge.writeState(sessionId, 0)` at `:73` runs before the `handoffPending` and open-note guards.
- `claimHandoff` (`relaunch-core.cjs:577-592`) checks only a well-formed session id and `status: open`, so a fork's claim would succeed.
- The three fork transcripts exist under `0b9dc60c-…/subagents/`, each `agent-<id>.meta.json` carries `"agentType":"fork","isFork":true`, and each records `SessionStart:compact` hook runs at 14:44:41, 15:30:23 and 17:42:11–12, matching the three `compact-pointer` log lines.

### Refuted: the boundary-evidence fix as written

Section 9 edit 1 assumes "a fork's SessionStart implies a compaction that never wrote a boundary", and section 12 says the fix "behaves identically whether that path names the fork transcript or the parent's". Both are false. Each fork's own transcript holds a `compact_boundary` written just before its hook fired:

| Fork | `compact_boundary` | `SessionStart:compact` hooks |
|---|---|---|
| `agent-aea1c7f90bbedad3d.jsonl` | line 262, 14:44:41.365Z, auto | lines 272-276, from 14:44:41.453Z |
| `agent-ae7668a35ed03d742.jsonl` | line 176, 15:30:23.366Z, auto | lines 192-196, from 15:30:23.718Z |
| `agent-a94347aac9778aa86.jsonl` | line 133, 17:42:11.188Z, auto | lines 149-153, from 17:42:11.480Z |

If a fork's `transcript_path` names its own transcript, the boundary check passes and the misfire continues. No local artifact records that value.

### Corrected fix (inferred, needs one probe)

Gate the pointer on two checks, either of which suppresses the fork case whichever path the payload carries:

1. Emit only when `path.basename(payload.transcript_path) === \`${payload.session_id}.jsonl\``. The parent's transcript is named after its session id. A fork's is `agent-<agentId>.jsonl` under `subagents/`.
2. Keep the boundary check against the transcript at that path, with the boundary strictly after the note's `created_at`. When the payload names the parent's transcript, that transcript holds no new boundary, as the parent's record for 2026-10-21 shows.

Keep edits 2 (one delivery per compaction) and 3 (reset the nudge level only after the guards) from section 9, and the fail-closed missing-path case.

Before building, confirm with one probe what `transcript_path` a fork's SessionStart payload carries: a throwaway SessionStart hook that appends its stdin to a scratch file, then a fork that compacts. The tests in section 10 gain a case E: `transcript_path` ending in `subagents/agent-<id>.jsonl` with a boundary after the note gives empty stdout.

---

## Second Review (Claude Opus 5.5, high effort)

A fresh read-only reviewer judged sections 1-16 and the Orchestrator Verification. Verdict: sound with changes. The orchestrator re-checked the claims marked confirmed below.

### Corrections to the record

- **Six fires, not three.** `relaunch.log` holds `compact-pointer` rows for `0b9dc60c` at 14:44:41, 15:30:23, 17:42:12, 18:52:58, 18:55:09 and 19:03:48. The 18:52 and 18:55 fires are forks `agent-a36ffa708c556c7d3` and `agent-a6f6e865b6605e24f` (reviewer's finding; the files exist, the timestamps were not re-checked by the orchestrator).
- **The 19:03:48 fire is the parent's genuine compaction (confirmed).** The parent transcript has SessionStart:compact hooks at lines 20067-20071 from 19:03:48.202Z, and its `compact_boundary` at line 20048 is timestamped 19:03:49.376Z, after the hooks. The parent claimed its note at 19:03:55.375Z, so the pointer delivered correctly once.
- **The boundary-evidence fix would have blocked that delivery.** The parent's boundary record carries a timestamp later than its own hooks, so a check that the transcript holds a boundary after the note fails at hook time. The reviewer reports the same order in four of the parent's seven compactions (inferred from its scan, not re-checked).
- **A fork most likely receives the parent's `transcript_path` (strong inference, unconfirmed).** The reviewer read Claude Code 2.1.303's minified SessionStart payload builder: `transcript_path` comes from the session's own file path, with no agent context. If so, the orchestrator's basename check passes for every fork and suppresses nothing.
- **"PostToolUse and Stop never ran inside forks" is unproven.** Only hooks that print something leave a transcript attachment, so their absence proves nothing.

### Missed hazards

- `session-prime` and the PreCompact cache share one slot keyed by the parent's session id. A fork's PreCompact can overwrite the parent's pending compact brief, and a parent compaction could inject a fork's brief. This also answers the 15:29:16 cache question: fork `ae7668a35ed03d742` began compacting at 15:29:16.004.
- Forks compacted several times before the note existed. Each fire would have reset the parent's nudge level at `compact-pointer.mjs:73` without logging (inferred).

### Revised fix

At SessionStart with `source: compact`, suppress when a file under `<dirname(transcript_path)>/<session_id>/subagents/agent-*.jsonl`, modified in the last 10 s, ends with a `compact_boundary` timestamped no more than 5 s before the hook started. Forks write theirs 0.09-0.9 s before their hooks, and no fork boundary fell near 19:03:48. Keep the basename check, the guard-order change and the fail-closed missing-path row. Drop the parent-boundary requirement. A parent and fork compacting within the same 5 s fails closed and leaves the note open.

Tests in `claude-adapters.test.cjs`:

- **F:** parent transcript with no boundary, fork boundary at now-0.3 s, `transcript_path` naming the parent → empty stdout, level unchanged.
- **G:** fork boundary at now-60 s → pointer delivered (the 19:03 case).
- **H:** `transcript_path` naming the fork file → empty stdout.

Then replay the six real fires against the real transcripts with an injectable clock: five suppressed, 19:03 delivered.

The one-shot SessionStart stdin probe remains the only way to confirm what `transcript_path` a fork receives, and should run before the build.
