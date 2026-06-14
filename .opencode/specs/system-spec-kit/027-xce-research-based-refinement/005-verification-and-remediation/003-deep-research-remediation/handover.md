---
title: "Handover — 029 Deep-Research Remediation (careful-queue tail)"
description: "Fresh-session handover after the original-backlog careful tail was ground out (10 further commits this session: L7 honesty + independents, L9 doc/code, tri-010/011/119, tri-105 divergence-health). Both original goals and the round-2 review are closed; the only remaining work is THREE packet-scale builds plus a defer-by-design bucket, all routed to a dedicated follow-on per operator decision: tri-105 vector reconcile, tri-148 launcher front-proxy port, and the hash-class synthetic replay pool."
trigger_phrases:
  - "029 remediation handover"
  - "deep research remediation resume"
  - "resume 029"
  - "careful queue tail"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/003-deep-research-remediation"
    last_updated_at: "2026-06-13T13:30:00Z"
    last_updated_by: "orchestrate-tail-grind"
    recent_action: "Original-backlog tail closed: 10 commits, verify-first"
    next_safe_action: "Create follow-on packet: tri-105/tri-148/replay-pool + defer-bucket"
    blockers: []
    key_files:
      - "L7-shadow-feedback-honesty/disposition.md"
      - "L9-pxx-sweep/disposition.md"
      - "backlog/remediation-backlog.json"
    session_dedup:
      fingerprint: "sha256:2003d4aca44bb943b1eae69b36f1d9ebe8fe3f8a5e907a323dbee96013ac03b3"
      session_id: "029-remediation-tail-grind-2026-06-13"
      parent_session_id: "029-remediation-resume-2026-06-12"
    completion_pct: 97
    open_questions: []
    answered_questions: []
---
# Handover — 029 Deep-Research Remediation (careful-queue tail)

> **Read this first, then STOP and confirm understanding before acting** (per the project compaction/handover protocol). State as of commit `e4f19478e5`, pushed.

## 0. WHERE THE PROGRAM STANDS

Both original goals are RESOLVED:

- **Goal A (dashboard adherence)** — resolved as a measurement artifact, not a model limitation: raw slash text in an `opencode run` message never invokes the command runtime; with `--command <family>/<name>` dispatch, gpt-5.5 medium renders the envelope 3/3. Protocol codified in commit `41cd6907c7`; see `L8-command-adherence/disposition.md` and memory `natural-behavior-command-tests`.
- **Goal B (verify-first remediation)** — seven code waves shipped, each adversarially Fable-verified pre-commit: ~184 of 198 findings CLOSED. The single-writer DB lock is live (a second daemon exits 86 naming the holder; the launcher bridges it) — the corruption class that opened this program is structurally eliminated and has not recurred since.
- **15-seat deep review (round-2, 2026-06-13)** — a multi-model review of this program's OWN fixes surfaced 18 P1 + 33 P2. All are now CLOSED across Waves A–F plus follow-ons (each implemented and verified with gpt-5.5-fast xhigh; Fable retired), and the verdict moved CONDITIONAL PASS → PASS — see `final-review/deep-review-report.md`. The L5 advisor carefuls (tri-033/036/040/041/083/156/173/180) all shipped or were adjudicated by-design; the **L5 code queue is empty** (only tri-138 deferred by design). This is a distinct track from the original-backlog careful tail in §3 below, whose L7/L2/L4/L9 lanes remain open.

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

## 2.5. THIS SESSION (original-backlog tail grind, 2026-06-13 — newest first)

- `c86424df8a` tri-105 — vector surface divergence health (reconcile deferred to follow-on).
- `4630de6c4b` tri-115 — surface feedback-retention report in the sweep MCP response.
- `c5b2777530` tri-072/073 — causal-reducer dry-run guards + feedback dedup gate.
- `5dc32c2ee1` tri-012/133 — feedback-retention active reachability + shadow criteria (doc).
- `9804341ce2` tri-119 — trust-validate sessionId in memory_validate (IDOR + regression test).
- `a4d3f2d5e6` tri-011 — shadow retention mode adjudicated by-design + ENV clarity.
- `94cadd0c06` tri-010 — verify_integrity checks the active vector surface.
- `6cbb7b457c` tri-007/008/009 — honest typed skip when no shadow replay pool exists.
- `cb5bad82a4` tri-080 — count files skipped for unsupported language during scan.
- `cab4ab1c1c` doc-wave — vector table roles, launcher lease, consumption telemetry honesty.

Verify-first found tri-107/081/139 + L2-F4 ALREADY-CORRECT (no edit needed). The AI Council report (`ai-council/council-report.md`) set the roadmap; the operator routed the 3 packet-scale builds + the defer-by-design bucket to a dedicated follow-on.

## 3. REMAINING WORK — all routed to a dedicated follow-on packet (operator decision 2026-06-13)

This session ground out the original-backlog careful tail (10 commits, gpt-5.5-fast xhigh verify-first — see §2.5). What CLOSED:

- **L7** — cluster A honesty half (tri-007/008/009: typed `no-replay-pool` skip + inert catalog claim); independents (tri-072 causal dry-run guards, tri-073 feedback dedup gate, tri-119 sessionId IDOR guard + regression test); cluster B (tri-012/133 documented / shadow-vs-union already distinguished); cluster C (tri-115 surface feedback-retention report; tri-011/136 adjudicated by-design — shadow is a tested observe-only contract — with the "silent" kernel closed via ENV doc).
- **L9** — tri-080 (unsupported-language scan counter), tri-104 (telemetry doc); tri-106/107/081/139/149 verified ALREADY-CORRECT; tri-105 divergence-health shipped.
- **L5** — tri-010 (verify_integrity now measures the active vector surface).

What REMAINS — three packet-scale builds + a defer-by-design bucket, folded into ONE dedicated follow-on:

| Item | Why follow-on |
|---|---|
| **tri-105 vector reconcile** | Live measure: active surface vec_768=10381 vs success/vec_memories=10072 — 6 orphans + 308 non-success-with-vectors + 5 missing-success. Resolving touches ~314 live rows in a corruption-history subsystem → needs backup + daemon-quiesced op. (Divergence HEALTH already shipped; only the data reconcile is deferred.) |
| **tri-148 launcher front-proxy** | Not a wiring change — replicates spec-memory's full packet-140 supervision scaffold (crash-loop guard, owner-disposal-race guard, relaunch backoff, process-group reap) into mk-code-index-launcher.cjs; a subtle error reintroduces the SIGTERM/relaunch flap + DB corruption the epic fixed. Needs the live-daemon adoption harness. |
| **Replay pool** (tri-007/009/103; feeds L2 tri-022/131) | Build a privacy-preserving hash-class synthetic corpus (NO raw query text — invariant) + shadow-eval integration. New subsystem; honesty half already shipped. |
| **Defer-by-design bucket** | tri-138 (health budget — consumer-aware design; doctor reads data.routing), tri-163 (key_files↔COVERED_BY crosswalk — design-first, don't patch), tri-129/135 (write-path stress + live-dim eval harnesses — test-infra), L3 (replay-time validity of deleted-memory receipts), and the pre-existing `memory-save-extended:637` NULL content_text test (separate subsystem investigation, stash-proven not ours). |
| **L9/L2 tail — verify-first each** | tri-108/109 (indexer skip / ingest-queue honesty), tri-111/113/117/121/122/124 (ranking/telemetry smalls), carry-overs 125/158, L2 tri-031 (repair-nodes skip-list honesty). Council-deprioritized + NOT individually re-verified this session — the stale-disposition pattern means several are likely already-fixed; re-confirm before implementing. |

Structure the follow-on as design units (vector-truth, shadow/feedback+replay, launcher parity) per the AI Council report at `ai-council/council-report.md`. Recorded non-blocking verifier nits carry too: tri-140 regression-only coverage; L2 F2/F3 (orchestrator ignores recovery.status; refusal-by-throw remnants).

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
