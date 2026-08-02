# Resume prompt — paste into a fresh session (pi or opencode)

You are resuming prior work in this repository: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

## Step 0 — READ THE HANDOVER FIRST (required, in full)

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0130-system-spec-kit-spec-gate-question-noise/.opencode/specs/cli-external-orchestration/037-spec-gate-question-noise/handover.md

Then continue the cold-read order from the handover:
1. `.../037-spec-gate-question-noise/spec.md`
2. `.../037-spec-gate-question-noise/implementation-summary.md`
3. `.../037-spec-gate-question-noise/plan.md` and `tasks.md`

## Context you must honor

- Main checkout branch is `skilled/v4.0.0.0`. The main working tree is SHARED with concurrent agent sessions that have already wiped uncommitted work twice today (a `git restore` at 14:48 and a `git clean`-style folder deletion at ~14:54). **Treat main as hostile**: verify before claiming, commit early, never leave deliverables uncommitted.
- Packet 036 (pi input-hook latency) is COMPLETE and was RESTORED on 2026-08-02; its 10 files exist as uncommitted modifications in main. **Do NOT revert, stash, or clean them. Do NOT commit them without asking the operator.**
- Packet 037 (spec-gate question noise) is scaffolded and validated (validate.sh --strict: Errors 0 Warnings 0) in worktree 0130; code implementation has NOT started.
- Spec folder is pre-approved: `.opencode/specs/cli-external-orchestration/037-spec-gate-question-noise` — Gate 3 is answered (option A). Do not re-ask it, do not create new packets without operator direction.

## Operator decisions to collect (ask; do not assume)

1. Commit the restored 036 work on the current branch? (recommended: yes — it is the only protection against the next concurrent revert)
2. Continue 037 implementation in worktree 0130? (recommended: yes — plan approved, scaffold validated)
3. Start packet 038 (fresh-session startup latency: non-blocking/parallel session_start hooks + time-boxed advisor injection)? (recommended: yes)

Wait for the operator's answers before implementing anything.

## If 037 implementation is approved — the plan is LOCKED (details in handover §2.1)

- **F1 core**: `lib/spec-gate/spec-gate-core.mjs` (~line 806) — while state is open, surface the question only when `classification.triggersGate3 || isAnswerAttempt(prompt)`; add the small exported `isAnswerAttempt` helper reusing the existing anchored answer regexes; keep `status: 'open'` so enforce hooks still deny/advise; the trigger branch stays as-is.
- **F2 pi adapter**: `hooks/pi/spec-gate-classify.ts` — classify only the substring after the last `[user]` marker in event.text (fallback: whole text).
- **F3 pi adapters**: key gate state on the session-file basename via a shared exported `resolveSessionKey({sessionId, sessionFile})` returning `file:<basename>` — applied identically in BOTH `spec-gate-classify.ts` and `spec-gate-enforce.ts`.
- **F4 wording**: `GATE_3_QUESTION` options A/C/D instruct naming the folder path; update the static copy at `AGENTS.md:127` for parity.
- **Tests**: update `spec-gate-core.test.mjs` lines ~151/169 (they assert the old always-question behavior); codex/devin mutating-prompt suites must stay green.
- **Verify**: `node --test` on `lib/spec-gate/spec-gate-core.test.mjs` + codex/cursor/devin suites; `validate.sh --strict` in the worktree; live pi smoke (read-only turn silent, mutating turn still asks).
- **Phase 3 fanout**: dispatch 3 parallel READ-ONLY GPT 5.6 LUNA MAX FAST validators: `opencode run --model openai/gpt-5.6-luna-fast --variant high --format json --dir <worktree-path>` with `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` and `</dev/null`; prompt each to load sk-code and state "Spec folder: <037 path> (pre-approved, skip Gate 3)". The parent is the single writer.
- **Commit early** with a conventional commit (owner-first grammar per sk-git); do not push without asking.

## Verification rules (hard)

- Never claim completion without: builds/tests passing where applicable, `validate.sh --strict` 0/0, and the worktree dist-staleness workarounds (handover §2.4).
- Comment hygiene HARD BLOCK: no packet/task ids or spec paths in code comments — write the durable WHY.
- After any packet-doc edit: bump frontmatter `last_updated_at`, regenerate `description.json` + `graph-metadata.json` (`generate-description.js`, `backfill-graph-metadata.js --all`), re-run `validate.sh --strict`.

## Tool gotchas (from handover §2.4 — read the full table)

- Worktree `npm run build` fails on workspace-scoped deps (zod, @modelcontextprotocol/sdk) — build toolchain on main post-merge; the validation dist does not depend on 037 changes.
- Never `rm`/`mv` `.pi/extensions` — the dir is tracked symlinks; restore with `git checkout -- .pi/extensions`.
- Skill-advisor daemon is DOWN (chokidar missing; IPC socket path over the sun_path limit). Flag it; do not rabbit-hole.
- Benchmark pi latency with ≥3 runs and report min/median — single samples are noise (1.6–4.6s spread observed).
