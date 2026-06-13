---
title: "Handover — 029 Deep-Research Remediation (careful-queue tail)"
description: "Fresh-session handover after seven verified code waves: the DB-corruption class is structurally eliminated, the dashboard-adherence question is resolved as a harness artifact, ~184 of 198 findings are closed, and what remains is the enumerated careful queue (L7 shadow clusters, L2 interlocked four, L5 carefuls, L4 front-proxy parity, L9 write-path stress)."
trigger_phrases:
  - "029 remediation handover"
  - "deep research remediation resume"
  - "resume 029"
  - "careful queue tail"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation"
    last_updated_at: "2026-06-12T21:25:00Z"
    last_updated_by: "claude-fable-orchestrator"
    recent_action: "Waves 4-7 committed+pushed, all Fable-verified; ~184/198 closed"
    next_safe_action: "Pick next careful unit from lane dispositions (L7/L2/L5/L4)"
    blockers: []
    key_files:
      - "L5-advisor-correctness/disposition.md"
      - "L7-shadow-feedback-honesty/disposition.md"
      - "backlog/remediation-backlog.json"
    session_dedup:
      fingerprint: "sha256:2003d4aca44bb943b1eae69b36f1d9ebe8fe3f8a5e907a323dbee96013ac03b3"
      session_id: "029-remediation-resume-2026-06-12"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Handover — 029 Deep-Research Remediation (careful-queue tail)

> **Read this first, then STOP and confirm understanding before acting** (per the project compaction/handover protocol). State as of commit `e4f19478e5`, pushed.

## 0. WHERE THE PROGRAM STANDS

Both original goals are RESOLVED:

- **Goal A (dashboard adherence)** — resolved as a measurement artifact, not a model limitation: raw slash text in an `opencode run` message never invokes the command runtime; with `--command <family>/<name>` dispatch, gpt-5.5 medium renders the envelope 3/3. Protocol codified in commit `41cd6907c7`; see `L8-command-adherence/disposition.md` and memory `natural-behavior-command-tests`.
- **Goal B (verify-first remediation)** — seven code waves shipped, each adversarially Fable-verified pre-commit: ~184 of 198 findings CLOSED. The single-writer DB lock is live (a second daemon exits 86 naming the holder; the launcher bridges it) — the corruption class that opened this program is structurally eliminated and has not recurred since.

Branch `028-mcp-to-cli-tool-transition` is pushed and current on GitHub (the push gate was opened by the operator; the remote repo was renamed to `opencode--skilled-agent-loops-with-spec-kit-memory`). The root README was restored to the spec-memory-first framing and aligned with all 027 features (`9fea79bbbc`).

## 1. HARD CONSTRAINTS (unchanged, non-negotiable)

- Branch `028-mcp-to-cli-tool-transition`; NEVER merge/push to main.
- Scoped commits only: `git add -- <paths>` then `git commit --only -F <msgfile> -- <paths>` (note: `-m` must come BEFORE `--`, or use `-F`). Never `git add -A` — shared git index with concurrent sessions.
- Comment-hygiene HARD BLOCK: durable WHY only; never finding/spec/phase/ADR/REQ ids in code comments.
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Verify-first: every fix gets a fresh adversarial re-verify against its original proof before commit (a SEPARATE fresh-context seat with a "try to refute" framing — that independence caught the tri-041 recommend-path cost this session). Storage/security/launcher code is hand-implemented or hard-fenced. The verifiers caught 15+ real defects this program.
- **Models (operator policy, updated 2026-06-13): Fable 5 is RETIRED.** Implement AND verify both use `cli-opencode openai/gpt-5.5-fast --variant xhigh` (keep seats narrow-sliced or budget gtimeout 1200s+ — xhigh exits 124 mid-read on broad scopes). Verification briefs are READ-ONLY (bake an ADMINISTRATIVE read-only line so they don't trip Gate 3; keep them a fresh seat, never the implementing seat). EXCEPTION: testing through manual-testing playbooks → MiMo (`xiaomi/mimo-v2.5-pro --variant high`, COSTAR-lean prompts). Dispatch shape: `AI_SESSION_CHILD=1 gtimeout -k 60 <secs> opencode run … </dev/null`; ≤3 concurrent opencode launches, staggered. Do NOT dispatch claude2 with `--model claude-fable-5` (model-access error). See memory `operator-model-dispatch-policy`.

## 2. WHAT SHIPPED (commit trail, newest first)

- `e4f19478e5` wave 7 — priming slims before results truncation (tri-140); review-report.md + iteration-pack metadata become retrievable, one coherent index policy (tri-189/191); code-graph scope labels expose glob narrowing (tri-161).
- `4913ddf6f9` wave 6 — opt-in shadow-delta sink (tri-168); memory_save metadataRefresh advisory (tri-015); phase-parent resume redirect, escape-safe both pointer shapes (tri-020); promoter + BM25 scope-then-limit stress floors (tri-130/132).
- `fb419dedbc` wave 5 — dual-margin ambiguity renders in brief/render/bridge (tri-037/089); init-skill-graph rebuilds the runtime SQLite (tri-086); CLI manifest parity suite (tri-098); derived-freshness validation warnings (tri-172).
- `b8c6371669` wave 4 — validation suites on the tracked test path with regenerated strict-green fixtures (tri-065/066/067 + 18-case shell-suite repair); boundary-aware keyword routers (tri-169); python advisor alias + OR-composed dual-margin ambiguity (tri-034/174); age-haircut generated_at (tri-035); lane-weights env allowlisted (tri-038); Claude hook timeout threading (tri-088).
- `9fea79bbbc` README restoration (operator-requested).
- Earlier waves/sessions: the single-writer lock (live-237), shared secret scrubber + fail-closed CLI save lane (tri-016), idempotency receipts flag-ON correctness, LIKE-escape hardening (tri-006), apply-pipeline safety packet (L2, 7/7), exit-taxonomy smoke + bare-apply guard (tri-145/186), L8 `--command` protocol, and the program-wide doc class.

## 3. REMAINING WORK — the careful queue (per-lane dispositions are the source of truth)

| Lane file | Open items |
|---|---|
| `L2-codegraph-apply-safety/disposition.md` | tri-022 (durable shadow telemetry), tri-029 (prune-excludes artifact), tri-031 (repair-nodes skip-list honesty), tri-131 (semantic-trigger stress; after tri-022) |
| `L4-launcher-lifecycle/disposition.md` | tri-148 (code-index front-proxy parity) |
| `L5-advisor-correctness/disposition.md` | carefuls: tri-033 (explicit-name misroute FIRST), tri-036, tri-040/041 (interlocked), tri-083 (after 033/034), tri-156, tri-173, tri-180; tri-138 deferred by design |
| `L6-save-continuity-truth/disposition.md` | tri-163 (key_files↔COVERED_BY crosswalk — design first, don't patch) |
| `L7-shadow-feedback-honesty/disposition.md` | clusters A (replay pool: 007/008/009/103), B (promotion: 012/133), C (shadow pause: 011/115/136), + 072/073/119 |
| `L9-pxx-sweep/disposition.md` | Part A: 080, 104, 105 (careful), 108/109 (careful); Part C: 111, 113, 117, 121, 122, 123, 124, 129 (careful), 135 (careful), 142; carry-overs 125, 158; tri-064 scoped follow-up |

Recorded non-blocking nits from the verifiers (fix opportunistically): the tri-140 trimmed branch has regression-only test coverage; L2 F2/F3 follow-ons (orchestrator ignores recovery.status; refusal-by-throw remnants).

## 4. OPERATIONAL NOTES

- DB healthy; single-writer lock live. Transparent daemon recycle applies to spec-memory only; code-index/advisor adopt dist changes at next respawn; launcher `.cjs` changes need a fresh launcher process.
- Several mcp_server dists were rebuilt this session (spec-kit, advisor, code-graph) — live daemons adopt on their next respawn.
- Known environment-baseline test failures (NOT regressions, all stash-proven): advisor settings-driven-invocation-parity (35, local settings divergence), code-graph launcher-lease (15), code-graph security-hardening mkdtemp (cwd-dependent), spec-kit spec-doc-structure (3), memory-save-extended content_hash backfill (1). The scripts-workspace vitest binary segfaults when invoked standalone — run scripts tests through `mcp_server` vitest (combined config) instead.
- The scripts workspace `package.json` is gitignored by design; durable test-path wiring lives in the tracked `mcp_server/package.json` (`test:spec-validation`).
- Operator follow-ups still queued: Task #57 (before-vs-after.md expansion), 145-spec dedupe check, Dependabot 12 moderate on default branch, optional README badge-URL update to the renamed repo.

## 5. HOW TO RESUME

1. Re-read this handover; summarize understanding; wait for operator confirm (compaction protocol).
2. Confirm DB health (`node .opencode/bin/spec-memory.cjs memory_stats --json '{}' --format json --timeout-ms 120000`) and exactly one `context-server.js` daemon.
3. Pick the next unit from §3 in risk order (L7 clusters and L2 four are the meatiest; tri-033 is the first L5 careful). Per finding: re-confirm still-real if code moved → implement (hand/fence by class) → fresh Fable adversarial re-verify against the original proof → scoped lane commit → disposition update → push (gate is open).
