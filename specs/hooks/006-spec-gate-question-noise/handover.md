---
title: "Session Handover - Pi Hook Latency & Gate-3 Question Noise"
description: "Handover for three threads: 036 committed post-wipe, 037 spec-gate question-noise implemented+validated (commit pending), 038 fresh-session latency proposal (pending decision)."
trigger_phrases:
  - "session"
  - "handover"
  - "resume"
  - "continue work"
  - "036"
  - "037"
  - "038"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/006-spec-gate-question-noise"
    last_updated_at: "2026-08-02T15:36:37Z"
    last_updated_by: "implementer"
    recent_action: "037 implemented, verified, validated; 036 committed"
    next_safe_action: "Decide packet 038 (fresh-session startup latency); push main branch when approved"
    blockers:
      - "skill-advisor daemon down: chokidar missing, IPC socket path over sun_path limit"
      - "main checkout hostile: concurrent git restore/clean wiped 036+037 work twice"
    key_files:
      - ".opencode/specs/hooks/006-spec-gate-question-noise/handover.md"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-spec-gate-question-noise"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Commit 037 on the worktree branch + merge to main so live pi picks up the fix?"
      - "Start packet 038 (fresh-session startup latency)?"
---
# Session Handover Document

Handover for 2026-08-02 late-evening state. Three threads: **036 (committed fdd295981a)**, **037 (implemented, verified, validated, committed e251617bef, merged to main 5ed153eaeb)**, **038 (proposed, not started)**.

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Written because: session compaction occurred; two data-loss incidents hit the main checkout; the next session must resume mid-flight work without re-deriving context.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-08-02 late-evening (pi session 019fc20d-0946-76c3-997b-d8ba7b1bef09 lineage, continued into the implementation session that wrote this refresh)
- **To Session:** next pi/opencode session in this repo
- **Phase Completed:** 036 committed (`fdd295981a`); 037 implemented, verified (core 71/0, runtime suites 47/47, live pi smoke), agent-validated (3× GPT 5.6 LUNA MAX FAST `APPROVED_WITH_NOTES`), packet validated (Errors 0; one evidence warning fixed in this refresh); 038 proposed
- **Handover Time:** 2026-08-02 evening local
- **Recent action**: implemented 037 end-to-end in worktree 0130; committed 036 after a third concurrent wipe

**HEAD state (main checkout):** `skilled/v4.0.0.0` with 036 commit `fdd295981a` on top. Worktree: `.worktrees/0130-system-spec-kit-spec-gate-question-noise` on branch `system-spec-kit/0130-spec-gate-question-noise` (holds 037 changes, uncommitted at refresh time).
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision     | Rationale | Impact                 |
| ------------ | --------- | ---------------------- |
| 036 fix = in-process advisor import in pi prompt-advisor.ts (no spawn bridge) | Pi awaits input handlers; spawn chain froze main thread; in-process mirrors opencode plugin and enables the 5-min cache | `hooks/pi/prompt-advisor.ts` + `lib/skill-advisor-brief.ts` cache-set fix; ~1.3s cold / 1-5ms repeats |
| 036 shared-lib cache fix: store only fingerprint-backed labels as cache skillLabels | command/registry labels (memory:save, command-*) never appear in freshness.skillFingerprints → false invalidation every call | `mcp-server/lib/skill-advisor-brief.ts`; benefits all runtimes |
| Fable-5 removed from injected hook text; directives restructured under a `Directives:` label | Model names churn; user requirement | `lib/render.ts`, `plugin-bridges/mk-skill-advisor-bridge.mjs`, 3 test files, playbook |
| 037: user chose **git worktree** ('a') for implementation | sk-git ask-first rule; isolation from main-checkout concurrent agents | worktree 0130 created via `worktree-naming.sh create system-spec-kit spec-gate-question-noise skilled/v4.0.0.0` |
| 037 core fix design: only the final non-trigger branch of `classifyIntent` changes (surface question when `triggersGate3 || isAnswerAttempt`, else `{status:'open', question:null}`) | Enforce hooks still deny/advise; mutating turns still re-ask; read-only turns go silent | `lib/spec-gate/spec-gate-core.mjs` ~line 806 + new exported `isAnswerAttempt` helper |
| 037 pi adapters: strip transcript after last `[user]` marker; key gate state on session-file basename (`file:` prefix) via shared `resolveSessionKey` | Harness embeds full history (triggers keyword regex: observed `create,fix` from 'Create a spec'/'Fix all'); pi session UUIDs are fresh per invocation | both pi adapters (classify + enforce) so they share one state key |
| 037 wording: options A/C/D instruct naming the folder path | Bare letters never parse in answerParse → gate stuck open | `GATE_3_QUESTION` in spec-gate-core.mjs + static copy at `AGENTS.md:127` |
| 038 (proposed, not yet decided): parallel/non-block session_start hooks + time-boxed advisor injection | Fresh-session delay measured: pi boot ~1.8s + extensions ~1-2.8s + cold advisor ~1.3s | new packet 038 (pending user decision) |

### 2.2 Blockers Encountered
**Blockers**: skill-advisor daemon DOWN (restart blocked); concurrent-process reverts in main checkout; worktree npm build fails (workspace deps)

| Blocker     | Status          | Resolution/Workaround |
| ----------- | --------------- | --------------------- |
| **INCIDENT 14:48:34**: concurrent process `git restore`-style reset of 10 skill-advisor files in main (all 036 code, uncommitted) | recovered | Re-extracted exact final contents from pi session transcript write/edit payloads and re-applied; verified build/tests/smoke. **Root process unidentified** — treat main working tree as hostile; commit early |
| **INCIDENT ~14:54-14:59**: main-checkout 037 packet folder deleted (untracked; likely concurrent `git clean -fd`) | recovered | 037 docs regenerated inside worktree 0130 (only session working there); commit early once implemented |
| Daemon restart: `listen EINVAL` — IPC socket path >104-char `sun_path` limit | open | start manually with `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor/<hash>` (probe expects `/tmp/mk-skill-advisor/697296aed00e/daemon-ipc.sock`) |
| Daemon restart: `Unable to load chokidar` (missing from both kits' node_modules) | open | pre-existing npm-install state issue (same family as `@opencode-ai/plugin/tool` missing) |
| Worktree `npm run build` fails TS2307 on workspace-scoped deps (zod, @modelcontextprotocol/sdk) through symlinked node_modules | known limitation | build toolchain on main post-merge; validation dist content does not depend on 037 changes |

### 2.3 Files Modified
**Key files**: see per-thread tables below.

**Thread A - 036 (COMPLETE — committed `fdd295981a` on `skilled/v4.0.0.0`, pushed):**

| File        | Change Summary | Status                 |
| ----------- | -------------- | ---------------------- |
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | in-process `handleClaudeUserPromptSubmit` import; no blocking-spawn bridge; fail-open | committed |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts` | cache-set stores only fingerprint-backed labels | committed |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Fable-5 removed; `Directives:` label; hygiene/governor bullets always ship | committed |
| `.opencode/skills/system-skill-advisor/mcp-server/tsconfig.build.json` | `../hooks/pi/**` excluded from build (pi loader runs .ts at runtime; package only in global install) | committed |
| `mcp-server/tests/legacy/advisor-brief-producer.vitest.ts` | AS9b mixed-label cache regression test | committed |
| `mcp-server/tests/legacy/advisor-renderer.vitest.ts` | new directive-format consts | committed |
| `mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | EXPECTED_FALLBACK_CONTEXT for AS2/AS3/AS6/CHK-021 | committed |
| `manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md` | transcript sample updated to new format | committed |
| `.pi/extensions/README.md` + `.pi/extensions/lib/README.md` | in-process advisor wiring docs | committed |
| `.opencode/specs/hooks/005-pi-input-hook-latency/` | all 7 packet files, validate --strict 0/0 | committed |

Verification performed at commit time: `npm run build` green; `npx vitest run` on the 3 suites = **41/41 pass**; `pi --offline --approve -p "Reply with exactly: OK"` → OK; `grep Fable-5` in dist = 0; dist rebuilt (new format confirmed).

Post-push refinement (SOL FAST review): `.opencode/plugins/mk-skill-advisor.js`, `mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`, `.opencode/plugins/tests/mk-skill-advisor.test.cjs` — fallback directives aligned to the canonical labeled format (Fable-5 removed everywhere; 14/14 plugin tests + 45/45 related vitest green). Awaiting commit at refresh time.

**Thread B - 037 (IMPLEMENTED + MERGED + PUSHED; refinement round awaiting commit):**

| File        | Change Summary | Status                 |
| ----------- | -------------- | ---------------------- |
| `hooks/lib/spec-gate/spec-gate-core.mjs` | question semantics (silent read-only, answer-attempt, path-over-skip, E=skip letter, `resolveSessionKey`, `sanitizePromptForClassify`) | committed `e251617bef`, merged, pushed; refinement edits applied on top |
| `hooks/lib/spec-gate/spec-gate-core.test.mjs` | corpus + semantics tests (72 pass) | same |
| `hooks/pi/spec-gate-classify.ts` | history/advisor strip via shared sanitizer + stable session key | same |
| `hooks/pi/spec-gate-enforce.ts` | same key derivation + session-file guard | same |
| `AGENTS.md` | Gate 3 options A-D instruct path replies | same |
| `.opencode/specs/hooks/006-spec-gate-question-noise/` | 8 packet files, validate --strict 0/0 | same; docs refreshed in refinement round |

**Thread C - 038 (proposed, nothing written):**

| File        | Change Summary | Status                 |
| ----------- | -------------- | ---------------------- |
| (new packet `038-...` under `cli-external-orchestration/`) | fresh-session startup latency: session_start non-blocking/parallel + time-boxed advisor injection | not started |

### 2.4 Traps & Scar Tissue

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
| ----------------- | -------------------- | -------------------------- | ------------------------- |
| Main checkout is shared with concurrent agents that run `git restore`/`git clean -fd` | any time; THREE hits on 2026-08-02 (14:48:34 file restore; 14:54-14:59 folder deletion; ~16:00 post-handover wipe of the restored 036 files) | load-bearing | commit early; never leave deliverables uncommitted; regenerate/verify before claiming done |
| `.pi/extensions/` deletion | my own bisect trap deleted it (`rm -rf` + failed `mv` restore) | defensive | extensions are TRACKED symlinks: `git checkout -- .pi/extensions` restores; never rm/mv the dir with traps |
| Session-transcript recovery | files reverted and uncommitted | load-bearing (used today) | transcript at `~/.pi/agent/sessions/--Users...Public--/2026-08-02T10-37-42-086Z_019fc20d....jsonl`; toolCall parts carry `name`+`arguments` with full write/edit payloads; extraction artifacts `/tmp/ops.pkl`, `/tmp/hookops.pkl` |
| Worktree validate.sh staleness gate | fresh-checkout sources newer than symlinked dist | load-bearing | copy main's built dist + `find dist -exec touch +`; symlink `mcp-server/node_modules` (workspace-scoped deps) and kit `node_modules`; `scripts/dist` must be a REAL copy (symlink breaks `isMainModule()` → empty CLI output) |
| validate.sh --strict details | EVIDENCE_CITED wants backticked/command/file:line evidence on P0/P1 items; ANCHOR markers required in ALL five docs; frontmatter recent_action/next_safe_action ≤96 chars; continuity last_updated_at within ~10min of regenerated graph-metadata | load-bearing | after any doc edit: bump frontmatter timestamps (python loop), regenerate description.json + graph-metadata, re-run validate.sh --strict |
| Comment hygiene HARD BLOCK | pre-commit gate blocks packet/task ids or spec paths in code comments | load-bearing | write the durable WHY only; never copy ids from docs into code |
| Gate 3 question noise (this packet's subject) | pi hands a fresh session UUID per invocation → per-turn state; embedded compaction history trips the keyword regex (`create,fix`) | load-bearing (being fixed by 037) | until 037 lands: expect the canned question each turn; answer with a folder path or explicit skip (bare letters never parse) |
| Harness spawns a fresh pi process per message | every message = new session → session_start hooks run per message | load-bearing | 038 thread: make session_start hooks cheap/non-blocking |
| skill-advisor daemon | launcher fails (chokidar missing; socket path length EINVAL); daemon was down all afternoon | defensive | daemon down does not break the hook (python subprocess fallback works); warm-daemon fast path is a 036 follow-up |
| `pi --offline -p` timing variance | 1.6-4.6s across identical runs | defensive | benchmark with ≥3 runs, report min/median, not single samples |

### 2.5 Measured Latency Numbers (fresh pi session, main checkout)
| Component | Cost |
| --------- | ---- |
| pi process boot (no extensions, `pi --version`) | ~1.1-1.8s |
| 13 extensions load + session_start hooks | ~1-2.8s (noisy; session-prime chain ~0.25s + 4 advisory checks ~0.25s) |
| cold advisor (first distinct prompt, python `skill_advisor.py --stdin`) | ~1.2-1.3s |
| repeat prompt within 5-min TTL (same process) | 1-5ms |
| OLD reverted chain (pre-restore) | up to ~2.8s per message (spawnSync budget) |

Input-path verdict (036 final): cold ~1.3s documented limitation shared by all runtimes; the advisor's python subprocess tail dominates, not the pi bridge.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** worktree `spec.md` for packet 006 (implementation complete; this handover sits beside it)
- **Next safe action**: commit 037 on the worktree branch (`system-spec-kit/0130-spec-gate-question-noise`), merge the single 037 commit into main so the installed pi extensions pick up the fix (the operator's live pi still runs main's OLD always-question code — restart pi after the merge), then decide 038
- **Cold-read order**: 1. this handover.md → 2. worktree 037 `implementation-summary.md` → 3. `checklist.md` → 4. `plan.md`+`tasks.md`
- **Context:** main checkout = 036 thread (committed); worktree 0130 = 037 thread (implemented, uncommitted); 038 = proposal only

### 3.2 Priority Tasks Remaining
1. **Commit 037** (worktree branch, conventional commit; no push without asking)
2. **Merge the 037 commit into main** (single-commit merge or cherry-pick; the worktree also carries unrelated graph-metadata churn that must NOT ride along)
3. **Operator decision: start packet 038** (fresh-session startup latency: parallel/non-block session_start hooks + time-boxed advisor injection with static-directives fallback + background cache warm; restart daemon with `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor/<hash>` after fixing chokidar) — recommended yes
4. 036 follow-up (recorded in 036 docs): warm-daemon fast path on the hot path
5. Cleanup: `/tmp/ops.pkl`, `/tmp/hookops.pkl`, `/tmp/restore-*.ts`, `/tmp/pi-full.out`, `/tmp/pi-err.out`, `/tmp/advisor-*.log`, `/tmp/037-validator-*.{json,err,exit}`, `/tmp/037-*.sh`, `/tmp/037-validate*`

### 3.3 Critical Context to Load
- [ ] Indexed save or continuity target: run `generate-context.js` after implementing 037; continuity edits go in `implementation-summary.md` frontmatter
- [ ] Spec file: worktree 037 `spec.md` (sections 1-9 + RELATED DOCUMENTS)
- [ ] Plan file: worktree 037 `plan.md` (quality gates G1-G5; phases T003-T012)
- [ ] 036 folder: main `.opencode/specs/hooks/005-pi-input-hook-latency/spec.md` (latency thread + amendment records)
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before handover, verify:
- [x] All in-progress work committed or stashed — 036 committed `fdd295981a`; 037 changes staged in the worktree branch (commit pending)
  - **Evidence**: `git log --oneline -2` on main shows `fdd295981a`.
- [x] Current context saved via `generate-context.js` or `_memory.continuity` in `implementation-summary.md` — continuity blocks refreshed across all five docs + this handover; description.json + graph-metadata.json regenerated
  - **Evidence**: `generate-description.js` + `backfill-graph-metadata.js` run; `validate.sh --strict` Errors 0.
- [x] No breaking changes left mid-implementation — 037 verified (core 71 pass, runtime suites 47/47, live pi smoke, 3 validator verdicts)
  - **Evidence**: `node --test` runs + smoke receipts in checklist CHK-020..024.
- [x] Tests passing (if applicable) — see above
  - **Evidence**: suite outputs recorded in checklist.
- [x] This handover document is complete — yes
  - **Evidence**: refreshed for the current state.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

- **pi hook file inventory** (13 extensions + lib): only the 3 input handlers (prompt-advisor, spec-gate-classify, goal-context) run per message; session_start fires session-start-context (spawnSync session-prime), session-start-advisories (4 sequential spawns), goal-context; the rest fire on tool events or lifecycle.
- **Injected per-message block** comes from `render.ts` (advisor line capped, `Directives:` block always full) + spec-gate-classify (question, only while gate open).
- **Pi session identity**: `getSessionId()` = fresh UUID per invocation; `getSessionFile()` stable per resumed conversation (`~/.pi/agent/sessions/--<path>--/`). Gate state lives under `.opencode/skills/.spec-gate-state/` keyed by hex-encoded session id (hence per-turn gates).
- **OpenCode bridge** for the advisor: `.opencode/plugins/mk-skill-advisor.js` (in-process, own cache). `plugin-bridges/mk-skill-advisor-bridge.mjs` carries the second copy of the directives text — keep in sync with render.ts.
- **claude/codex/devin/cursor** spec-gate adapters share `lib/spec-gate/spec-gate-core.mjs` — the F1 core fix must not break their suites (mutating-prompt tests at codex/spec-gate-codex.test.mjs:138, devin:146 stay green).
- Daemon probe path expected by `skill-advisor.cjs --warm-only`: `/tmp/mk-skill-advisor/697296aed00e/daemon-ipc.sock`.
- The user's earlier 'a' answer = sk-git option A (worktree) for 037; packet 005 used the current branch (option B) — do not conflate.
<!-- /ANCHOR:session-notes -->
