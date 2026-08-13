# Resume prompt — paste into a fresh session (pi or opencode)

You are resuming prior work in this repository: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

## Step 0 — READ THE HANDOVER FIRST (required, in full)

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/hooks/006-spec-gate-question-noise/handover.md

Then continue the cold-read order from the handover:
1. `.../006-spec-gate-question-noise/implementation-summary.md` (final-state record)
2. `.../006-spec-gate-question-noise/checklist.md` (verification evidence)
3. `.../006-spec-gate-question-noise/spec.md` and `plan.md` (scope + quality gates)

## Current state (2026-08-02 evening — do NOT redo completed work)

- **Packet 005 (pi input-hook latency): COMPLETE.** Code restored after a third concurrent wipe, verified (build green, 41/41 tests, smoke OK), committed `fdd295981a` on `skilled/v4.0.0.0`, pushed.
- **Packet 006 (spec-gate question noise): IMPLEMENTED + merged + pushed.** Verified (core suite green, runtime suites 47/47, live pi smoke: read-only silent / mutating asks, 3× GPT 5.6 LUNA MAX FAST validators `APPROVED_WITH_NOTES`), `validate.sh --strict` Errors 0 Warnings 0, committed `e251617bef` on the worktree branch, merged to main, pushed (remote tip `9229cb8f3e`). A SOL FAST refinement round was applied after the push (E=skip grammar, `sanitizePromptForClassify` moved into the core with tests, OpenCode bridge directive parity) — that round still needs its own commit + push.
- **Spec folder is pre-approved:** `.opencode/specs/hooks/006-spec-gate-question-noise` — Gate 3 is answered (option A). Do not re-ask it, do not create new packets without operator direction.

## Remaining work (ask the operator first)

1. Packet 038 (fresh-session startup latency: non-blocking/parallel `session_start` hooks + time-boxed advisor injection) — proposed, not started.
2. Local main branch is DIVERGED from origin (concurrent sessions' history). Pushing requires the temp-worktree cherry-pick dance (or a careful reconcile) — never force-push.
3. Worktree 0130 + branch `system-spec-kit/0130-spec-gate-question-noise` still exist; retire only with operator approval.

## Verification rules (hard)

- Never claim completion without: builds/tests passing where applicable, `validate.sh --strict` 0/0, and the worktree dist-staleness workarounds (handover §2.4).
- Comment hygiene HARD BLOCK: no packet/task ids or spec paths in code comments — write the durable WHY.
- After any packet-doc edit: bump frontmatter `last_updated_at`, regenerate `description.json` + `graph-metadata.json`, re-run `validate.sh --strict`.

## Tool gotchas (from handover §2.4 — read the full table)

- Worktree `npm run build` fails on workspace-scoped deps — build toolchain on main post-merge; the validation dist does not depend on hook changes.
- Never `rm`/`mv` `.pi/extensions` — the dir is tracked symlinks; restore with `git checkout -- .pi/extensions`.
- Skill-advisor daemon is DOWN (chokidar missing; IPC socket path over the sun_path limit). Flag it; do not rabbit-hole.
- Benchmark pi latency with ≥3 runs and report min/median — single samples are noise (1.6–4.6s spread observed).
