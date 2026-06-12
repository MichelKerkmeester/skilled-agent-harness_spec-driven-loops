---
title: "Handover — 029 Deep-Research Remediation + Dashboard-Adherence True-Solution Investigation"
description: "Fresh-session handover: the remaining verify-first remediation of 198 findings across 9 lanes, the two held storage/security P0s, the live DB-corruption emergency, and the operator's new request — a fresh Fable 5 must find a TRUE (not doc-only) solution to command render-contract adherence."
trigger_phrases:
  - "029 remediation handover"
  - "dashboard adherence true solution"
  - "deep research remediation resume"
  - "resume 029"
importance_tier: "important"
contextType: "implementation"
---
# Handover — 029 Deep-Research Remediation + Dashboard True-Solution

> **Read this first, then STOP and confirm understanding before acting** (per the project compaction/handover protocol). Everything below is the state as of the handoff commit.

## 0. THE TWO ACTIVE GOALS

**Goal A — the operator's NEW request (do this in the fresh session, highest novelty):**
Ask a **fresh Fable 5 agent (via claude2)** to *investigate and produce a TRUE solution* to command-dashboard render-contract adherence. Context: doc-only fixes were shipped and **empirically failed** — gpt-5.5 medium rendered free prose on all three `/memory:search` probes, never the `MEMORY:SEARCH … STATUS` envelope, even after the inlined MUST-template, Presentation Boundary sections, filled examples, and field-mapping tables (commits `c3911dfe2f`, `93bd498744`, disposition `ef4afeae83`). The operator does NOT want another round of prose-tweaking. Fable should determine the real mechanism that makes a mid-tier executor emit an exact output envelope — candidates to evaluate, not presuppose: mechanical post-processing of tool output (orchestrator reformats into the envelope), a CI golden-fixture lint that asserts the shape (research rec R8), giving the memory family YAML workflow assets (rec R7), structured tool responses that ARE the envelope (move rendering into the tool, not the prompt), or a "envelope mandatory even at low-confidence — represent confidence inside it" contract change. Fable's job: read the evidence (the disposition + the two research syntheses below), reproduce/confirm, and return a concrete, ranked, implementable solution with the tradeoffs — then we implement the winner with gpt-5.5-fast high + Fable re-verify.

**Goal B — the standing remediation program (continue verify-first):**
"Create remediation phases to fix every single finding from critical → high → medium → low → decorative. During phase creation a Fable 5 agent (via claude2) verifies the issue. Use gpt-5.5 high fast for implementation." Plus: "fix every finding from deep research regarding command dashboards" (= Goal A's lane). The 2 refuted findings are excluded; everything else real is in scope.

## 1. HARD CONSTRAINTS (carry forward, non-negotiable)

- Branch `028-mcp-to-cli-tool-transition`. **NEVER merge/push to main.** Currently **269 commits ahead of upstream**; push is operator-gated and BLOCKED on GitHub secret-scanning (a fake fixture). Do not push.
- Scoped commits only: `git add -- <paths>` then `git commit --only -- <paths>`. Never `git add -A` (shared git index with concurrent sessions — a bare commit sweeps other sessions' staged files).
- Comment-hygiene HARD BLOCK: durable WHY only in code comments; never finding/spec/phase/ADR/REQ ids. Pre-commit gate enforces.
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Verify-first is mandatory and earned its keep**: this session a seat GUTTED the secret scrubber (228→17 lines) and another shipped a reindex regression — both caught only by human diff review + Fable adversarial re-verify. **Storage/security/launcher code is hand-implemented or given hard-fenced briefs (exact import paths, absolute prohibitions, scope-locked file lists), never open-ended seats.** Always Fable-re-verify a fix against its original proof before committing.
- Models: implement = `cli-opencode openai/gpt-5.5-fast --variant high` (include `</dev/null`, `--dangerously-skip-permissions`, `--dir "$PWD"`, `AI_SESSION_CHILD=1 gtimeout -k 60 <secs>`). Verify = Fable 5 via claude2 (`CLAUDE_CONFIG_DIR=/Users/michelkerkmeester/.claude-account2 /Users/michelkerkmeester/.superset/bin/claude -p "$(cat brief)" --model claude-fable-5 --permission-mode bypassPermissions`); native Fable fallback on "session limit". Codex usage-limit → fall back to MiMo (`xiaomi/mimo-v2.5-pro --variant high`). ≤3 concurrent opencode launches.

## 2. 🔴 LIVE EMERGENCY — DB corruption recurs (most important operational item)

The spec-memory DB (`.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`) corrupted **three times in this session**, always Tree 8 (`memory_index`). Each recovered via `.recover` → rebuild FTS → swap (runbook in memory `spec-memory-db-corruption-repair-runbook`). Current DB is healthy (~12,123 rows, single daemon serving).

**Root cause (confirmed, not MEGA):** multiple sessions cold-spawn competing daemon writers — TWO `context-server.js` processes were observed writing the same SQLite at one corruption. (The MEGA-sync theory was floated then DISPROVEN: `.opencode` is already excluded by the existing `/Users/michelkerkmeester/MEGA/.megaignore` `-:.*` dotfile rule; explicit DB-dir exclusions were added as harmless defense-in-depth only.) This IS backlog finding **`live-237`** in L1.

**The fix (held for careful hand-work):** daemon-side single-instance enforcement — a daemon must acquire an exclusive lock at DB-open (lockfile beside the DB with liveness + stale-clear, or socket-bind-as-lock) and refuse to serve a DB path another live process holds. The IPC socket-server (`shared/ipc/socket-server.ts`) is the *secondary-client bridge*, NOT the DB-access guard — the lock must sit at DB-open. A careless lock could wedge all daemons or strand a stale lock; design carefully. **Until shipped, keep ONE warm daemon; never run a second.** This protects everything else and should be among the first fresh-session tasks.

## 3. WHAT SHIPPED THIS SESSION (029 program)

Verify-first complete on the whole backlog: a Fable wave (claude2, ~22 batches) re-verified all 195 tri/live findings against current code → **190 STILL-REAL, 5 duplicates**, + 8 pre-confirmed adherence recs = **198 implementable** (banked in `029/backlog/remediation-backlog.json`, `verdict:"STILL-REAL"`).

Fixed + Fable-re-verified:
- **`tri-003`** reindex-retire source-kind guard — deprecates predecessor (frees the unique slot, no insert regression) AND carries the manual tier forward to the successor. Fable initially flagged a regression in the first cut (skip-retire collided on the unique index); corrected. Commit `61b529fde3`.
- **`tri-004`** auto-promotion source-kind guard — check-before-write + atomic update-time manual predicate (TOCTOU-safe). Fable verdict CLOSED. Commit `61b529fde3`.
- **L8 doc fixes (5 of 8 recs)** — commits `c3911dfe2f`, `93bd498744`. Structural improvements kept, but adherence NOT achieved (see Goal A + `L8-command-adherence/disposition.md`).

## 4. REMAINING WORK — 196 findings across the lanes

Backlog: `029/backlog/remediation-backlog.json` (every item has a Fable `verdict` + proof). Per-finding research evidence: `028-tri-system-deep-research/research/findings-registry.json` (per-finding `verify_proof`) and `028-…/research/research.md` (the 7-lane synthesis + ranked remediation order).

| Lane | Remaining | Risk / handling |
|------|----------:|-----------------|
| L1 security/safety | 4 (of 6) | `live-237` daemon lock (P0, §2), `tri-016` scrubber parity (see §5), catalog-doc P1, query-fingerprint redaction P1 — hand/fenced |
| L2 code-graph apply safety | 28 | confirm-gating destructive ops, repair-nodes honesty, rollback snapshot ordering — careful, mostly storage-adjacent |
| L3 idempotency flag-ON | 5 | receipt key variance, loser replay, update-path winner — blockers before any flag-ON |
| L4 launcher lifecycle | 15 | port spec-memory launcher's lease/heartbeat/reconnect to mk-code-index — careful .cjs |
| L5 advisor correctness | 35 | explicit-name override, alias substring, `derived.last_updated_at` freshness, dead env readers — mixed code+doc |
| L6 save/continuity truth | 17 | continuity application, metadata refresh, resume redirect, handover template/parser mismatch — mostly safe doc/code |
| L7 shadow/feedback honesty | 19 | build privacy-preserving replay pool + durable telemetry, OR retire unenforceable promotion prose |
| L8 command adherence | 3 (R4 shipped; R7/R8 + Goal A open) | **Goal A** — true solution; R7 workflow assets, R8 CI golden-fixture lint |
| L9 P2/P3 sweep | 65 | lowest risk, doc-heavy — good for fenced seats |

Recommended order (from research synthesis): security/safety P0s → code-graph apply safety → idempotency → launcher parity → advisor → save/continuity → shadow/feedback. Doc-heavy lanes (L6/L9) can move fast with fenced gpt-5.5 seats; storage/launcher/security need hand or hard-fence.

## 5. `tri-016` SCRUBBER PARITY (in-progress, specific gotcha)

The CLI save lane (`scripts/core/workflow.ts` → `generate-context`) lacks the fail-closed secret scrubber that `memory_save` has. The canonical scrubber is `mcp_server/lib/parsing/secret-scrubber.ts` (`scrubSecretsDetailed`). **scripts/ cannot import it at runtime** — the mcp_server package only exports its `dist/api` surface; the tsconfig path alias `@spec-kit/mcp-server/*` satisfies typecheck but the compiled CLI fails at runtime resolution. **The correct fix: promote the scrubber to `@spec-kit/shared/parsing/secret-scrubber` as the single source of truth and re-export it from `mcp_server/lib/parsing/secret-scrubber.ts`** (shared resolves via `"./*": "./dist/*.js"`, so shared must be built). This is a careful cross-package refactor of a security module — hand-implement, verify all existing mcp_server consumers still resolve, then scrub the composed save fields fail-closed. Two seat attempts were reverted (one gutted the scrubber). Do NOT hand this to an open seat.

## 6. KEY FILES / POINTERS

- Active packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation/` (spec.md = phase parent; backlog/; L1-security-safety/; L8-command-adherence/disposition.md).
- Dashboard evidence for Goal A: `029/L8-command-adherence/disposition.md` + `027/011-command-presentation-workflow-separation/006-presentation-adherence-research/research/research.md` (the MiMo+DeepSeek convergent diagnosis + 8 ranked recs).
- Command surfaces: `.opencode/commands/{memory,speckit,create,deep,doctor}/` + their `assets/*_presentation.md`. The working verbatim-render exemplar is `doctor/` (static menu); the failing dynamic one is `memory/search.md` + `memory/assets/search_presentation.md`.
- Research program: `027/028-tri-system-deep-research/` (50 angles, registry).
- DB recovery runbook: memory `spec-memory-db-corruption-repair-runbook`.

## 7. ALSO QUEUED (operator tasks, not yet done)

- **Task #57** — expand `027-xce-research-based-refinement/before-vs-after.md` to full detail (cover all phases incl. 017–029, finding-remediation, playbook+stress, DB recovery, research programs).
- **145-spec cleanup** — `skilled-agent-orchestration/145-advisor-doc-trigger-harvest` is a real orphaned packet (5 memory-DB rows, descriptions.json + graph-metadata entries) duplicating `027/018`; MiMo recommended delete-and-dedupe, but DIFF its content against `027/018` first (created during a concurrent-session window) before deleting. The `001-var-folders-…` ghost does not exist anywhere — no action.
- Pre-existing follow-ons: FTS5 LIKE-metachar hardening (#51), push 028 (#50, secret-scan blocked).

## 8. HOW TO RESUME

1. Re-read this handover; summarize understanding; wait for operator confirm (compaction protocol).
2. Confirm DB health: `node .opencode/bin/spec-memory.cjs memory_stats --json '{}' --format json --timeout-ms 120000`; ensure exactly ONE `context-server.js` daemon.
3. Goal A: dispatch the fresh Fable 5 investigation (claude2) into the dashboard true-solution, reading the §6 evidence.
4. Goal B: pick the next lane by §4 risk order; for each finding — Fable verify still-real → gpt-5.5-fast high implement (hand/fence storage-security) → Fable re-verify → scoped lane commit → update backlog disposition.
