---
title: "Tasks: Doc-Truth, Completion-Claim & Runtime-Mirror Reconciliation"
description: "One task per deep-review finding in this sub-phase (42 total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/006-doc-truth-completion-and-mirrors"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "code-remediation-agent"
    recent_action: "All 42 findings resolved; 7 deferred code P2s now fixed and reconciled"
    next_safe_action: "Optional follow-on: T042 resolveActiveProfileDbPath code-wiring"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doc-Truth, Completion-Claim & Runtime-Mirror Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] 006-S1 Capture the subsystem test/validation baseline.
- [x] 006-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

- [x] 006-T001 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md:120` — Add `000-spec-tree-consolidation/` to the 000-release-cleanup phase documentation map with its `Complete` status, and refresh description/metadata so generated child listings agree with graph-metadata _[asserted — fix as stated]_
- [x] 006-T002 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:128` — Promote the 001 research/doctrine row to `Complete`, update 001-research-and-doctrine child rows for peck and gem to completed aggregate statuses, and refresh graph/description metadata so status fiel _[asserted — fix as stated]_
- [x] 006-T003 · `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48` — Update the root catalog and spec-memory CLI catalog entries to 39, refresh the memory README coverage matrix, and adjust any 37-tool ownership lint/test wording to the current TOOL_DEFINITIONS length. _[asserted — fix as stated]_
- [x] 006-T004 · `.opencode/skills/system-spec-kit/feature_catalog/retrieval/session-recovery-spec-kit-resume.md:64` — Replace all feature-catalog spec_kit_*.yaml asset references with the live speckit_*.yaml paths and run a catalog source-file existence check over feature_catalog/**/*.md. _[asserted — fix as stated]_
- [x] 006-T005 · `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:160` — Exclude category README/package-map files from scenario_files, or rename the check to count all playbook markdown files. If excluding them, update the hard-coded count from 410 to 407 and recompute th _[asserted — fix as stated]_
- [x] 006-T006 · `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:130` — Choose one taxonomy and apply it consistently: either allow per-scenario PARTIAL everywhere, or keep scenario PARTIAL forbidden and redefine feature/packet PARTIAL as an aggregate evidence state deriv _[asserted — fix as stated]_
- [x] 006-T007 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights/tasks.md:50` — Update 009 plan.md and tasks.md to mark the 111MB/current-corpus-pass evidence as superseded, state the realistic 1x breach at phase close, and point to 010/phase-017 as the closure. _[asserted — fix as stated]_
- [x] 006-T008 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/013-provenance-injection/tasks.md:88` — Reconcile phase 013 docs: mark T023-T026 and the final completion criterion complete with the exact evidence already recorded, fill CHK-021/022/023/042, update the verification summary counts and stal _[asserted — fix as stated]_
- [x] 006-T009 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness/checklist.md:77` — Update CHK-021 to the remediated 12/12 flag-on evidence, and either confirm CHK-023 is intentionally a separate historical 10-test flag-off run or update it to the current recorded evidence style; kee _[asserted — fix as stated]_
- [x] 006-T010 · `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1062` — Either correct the docs (validation_rules.md:93-105, 006 implementation-summary.md:82, CLAUDE.md/AGENTS.md) to state that enabling SPECKIT_COMPLETION_FRESHNESS blocks --strict completion regardless of _[unverified(parse-fail)]_
- [x] 006-T011 · `.opencode/skills/sk-code/SKILL.md:1` — Either (a) amend REQ-005/SC-002 to state the predicate is orchestrator/contract-owned and explicitly accept that direct sk-code invocations are not gated, reclassifying the sk-code edit as a tracked d _[asserted — fix as stated]_
- [x] 006-T012 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate/spec.md:133` — Update the spec's file tables and command references to the actual paths, or create symlinks/aliases where the spec claims they live. _[asserted — fix as stated]_
- [x] 006-T013 · `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json:8` — Add a shipped reviewer profile (e.g., `reviewer-regression.json`) listing the four `reviewer-*.json` fixtures, and reference it in the command examples. _[asserted — fix as stated]_
- [x] 006-T014 · `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:461` — Add `reviewer` to `VALID_SCORERS` and route reviewer-shaped fixtures to `reviewer-scorer.cjs`, or clearly document that reviewer scoring must use the command/YAML path. _[refuted-Round2 → harden-anyway]_
- [x] 006-T015 · `.opencode/skills/deep-loop-workflows/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:750` — Create `model-benchmark-mode/reviewer-prompt-regression-fixtures.md` (or equivalent) with the MB-R01 execution contract, commands, and expected signals. _[asserted — fix as stated]_
- [x] 006-T016 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md:8` — Re-verify the finding against the full function body and either remove/refute the P0 or cite the exact unguarded lines that prove manual rows are lost. _[asserted — fix as stated]_
- [x] 006-T017 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md:9` — Correct the citation to the actual guard-free lines or downgrade/refute the finding and update the synthesis. _[asserted — fix as stated]_
- [x] 006-T018 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md:10` — Identify any genuinely unscrubbed durable field and cite the exact write line, or refute the finding. _[asserted — fix as stated]_
- [x] 006-T019 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/implementation-summary.md:30` — Correct the Spec Folder value to 002-tri-system-deep-research and align it with description.json/graph-metadata.json. _[asserted — fix as stated]_
- [x] 006-T020 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/spec.md:32` — Update spec.md status to Complete, refresh the _memory continuity block to match implementation-summary.md, and regenerate graph-metadata.json so derived.status is not in_progress. _[asserted — fix as stated]_
- [x] 006-T021 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/spec.md:111` — Update parent 005 spec.md row 004 status from 'Planned' to 'Complete' (or 'In Progress' if Unit C follow-on is tracked open), then either keep T012 [x] truthfully or note the residual follow-on. _[asserted — fix as stated]_
- [x] 006-T022 · `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:525` — Pass a larger or unbounded max to matchSemanticTriggers (e.g. limit*4) and let filterSemanticMatchesByScope reduce to the final scoped set, then slice to limit — mirroring the lexical limit*2 over-fet _[P2 — FIXED in commit b2c42edd09: `max: limit * 4` over-fetch then scope-filter]_
- [x] 006-T023 · `.opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/feedback-retention-learning-modes.md:20` — Reword to 'Off mode runs no feedback-driven audit or retention decisions; the baseline TTL sweep still deletes expired non-protected rows' and adjust step 3 to expect baseline deletion. _[P2]_
- [x] 006-T024 · `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:663` — After the detach attempt, assert get_attached_vector_path(jobDb)===null before renaming (re-detach or throw otherwise) instead of swallowing all errors as 'not attached'; and/or add a file-identity (f _[P2 — FIXED in commit b2c42edd09: post-detach assertion + source-kind carry]_
- [x] 006-T025 · `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3570` — Either feed the FULL request payload (not the fingerprint subset) into the payload hash so same-key/different-payload conflicts can actually be detected, or remove the conflict/markResponseWithReceipt _[P2 — FIXED: corrected the misleading comments at both call sites (memory-save + memory-crud-update) to state the conflict status is structurally unreachable (payload===fingerprint), keeping the branch as fail-safe defense-in-depth]_
- [x] 006-T026 · `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3585` — Select id in the active-row query and honor the replay only when it equals extractMemoryIdFromResponse(lookup.response) (and/or the receipt's stored memory_id); otherwise drop the receipt and fall thr _[P2 — FIXED: active-row query now SELECTs id and replay is honored only when activeRow.id matches extractMemoryIdFromResponse(lookup.response); same id-check added to memory-crud-update.ts]_
- [x] 006-T027 · `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1824` — Add a bounded periodic sweep (e.g. opportunistically on write or on a timer) in addition to the boot prune, or document that TTL only applies across restarts. _[P2 — FIXED: documented that the boot prune is the only sweep (TTL enforced across restarts only) and the bounded unbounded-growth tradeoff, with a pointer to add a periodic/on-write sweep if mid-run expiry is needed]_
- [x] 006-T028 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/002-memory-store-and-search/changelog-002-010-bm25-warmup-churn-reduction.md:23` — Choose the authoritative preserved benchmark number or add the missing 743MB artifact, then normalize the 010 changelog, parent spec, before-vs-after summary, and implementation-summary frontmatter/bo _[P2]_
- [x] 006-T029 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/005-mcp-cli-stress-tests/spec.md:25` — Replace the fabricated 'sha256:1111...' value with either the canonical zero placeholder (sha256:000...0) if no real fingerprint was captured, or a genuine buildContinuityFingerprint(content) value re _[P2]_
- [x] 006-T030 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:87` — Either (a) relocate before-vs-after.md to a changelog rollup / child and keep only navigational bridges at the parent, or (b) if these are accepted reorg-bridge artifacts, update spec.md:87 to enumera _[P2]_
- [x] 006-T031 · `.opencode/skills/deep-loop-workflows/deep-context/scripts/loop-lock.cjs:60` — Point deep_context_auto/confirm.yaml at the runtime adapter (deep-loop-runtime/scripts/loop-lock.cjs) with --lock-path/--packet-id/--owner-pid, or align the deep-context wrapper's flag names and defau _[P2 — FIXED via the recommendation's third option: documented the intentional divergence (flag contract, 1h vs 5min TTL, in-process require) in BOTH wrapper headers; no correctness break since each YAML matches its wrapper, and the host-driven loop genuinely needs in-process require + longer TTL]_
- [x] 006-T032 · `lib/storage/ports/graph-traversal.ts:57` — Either drop collectWeightedWalk/collectDirectedReachability from the GraphTraversal port (callers can use the bfs-traversal module functions directly, as they already do internally), or add a one-line _[P2 — FIXED via the recommendation's second option: added a reserved/contract-only doc comment on the two unused passthroughs explaining they are db-agnostic primitives kept for the contract test, mirroring the unadopted-port note in lexical-search.ts]_
- [x] 006-T033 · `.claude/agents/deep-review.md:11` — Change .claude/agents/deep-review.md:11 to: **Path Convention**: Use only `.claude/agents/*.md` as the canonical runtime path reference. — matching its deep-context/deep-research Claude siblings. Add  _[P2]_
- [x] 006-T034 · `.claude/agents/review.md:11` — Change `.opencode/agents/*.md` -> `.claude/agents/*.md` at .claude/agents/review.md:11; apply the same fix to .claude/agents/deep-review.md for full runtime parity. _[P2]_
- [x] 006-T035 · `.codex/agents/orchestrate.toml:787` — In the Codex mirror, change the row to 'This orchestrate.toml file' (or make it extension-neutral, e.g. 'this agent definition file') so each mirror's self-reference matches its own format. _[P2]_
- [x] 006-T036 · `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:159` — In §7, note explicitly that the Evidence Group is carried as the `evidence` field on a deep-loop JSONL iteration record (not as a free-standing AGENT_IO_EVIDENCE text envelope appended to agent output _[P2]_
- [x] 006-T037 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/002-scoped-preexec-and-handoff-gates/spec.md:209` — Reconcile the spec: keep the centralized-predicate design and rewrite REQ-005/SC-002 to reference the orchestrator/contract surface (or an explicit sk-code Phase-0 reminder), removing the literal 'sk- _[P2]_
- [x] 006-T038 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/001-finding-remediation/remediation-plan.md:32` — Correct the downgraded count to 57, fix the P1 column to sum to 132, and either triage the 8 untriaged downgrades with a p2_decision or soften the 'of which fixed/waived per P2 rules' claim to reflect _[P2]_
- [x] 006-T039 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/plan.md:52-54` — Mark the Definition of Done checkboxes [x] or remove them if superseded by tasks.md. _[P2]_
- [x] 006-T040 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/004-residual-design-units/spec.md:28` — Reconcile spec.md frontmatter (completion_pct, recent_action, next_safe_action) to the resolved state and update the §3 Unit A row counts to the implemented 91-row reality, or add a one-line 'implemen _[P2]_
- [x] 006-T041 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement (commit 6ed0f30a2f)` — Future bulk snapshots should be committed as a neutral chore (no per-epic scope prefix) or split by owning packet; explicitly tag any 'not independently verified' content so a later verification pass  _[P2]_
- [x] 006-T042 · `.opencode/commands/doctor/assets/doctor_update.yaml:409` — Resolve the active-profile DB selection (resolveActiveProfileDbPath now exists) and remove the inline TODO, or move the remaining work to a spec-doc task and replace the comment with a concise why. _[P2]_
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] 006-V1 validate.sh --strict; cross-runtime body-diff + grep checks.
- [x] 006-V2 Whole-gate delta reported (no regressions).
- [x] 006-V3 Update each finding's status in the registry (fixed/refuted).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 42 findings resolved: 41 fixed/refuted-with-reason ([x]); 1 no-doc-action ([x], T041). The 7 previously-deferred code findings have now all been remediated and marked [x] — they required production `.ts`/`.cjs` edits that were completed in two separate code passes (see below).

**Resolution notes:**
- **Refuted (kept as corrected docs):** T014 (`run-benchmark.cjs` `--scorer reviewer` warns-then-falls-back to pattern by design — reviewer scoring runs via `reviewer-scorer.cjs`/command YAML; confirmed + documented in the new MB-R01 scenario and presentation contract). T016/T017/T018 (the three research P0s were re-verified against full function bodies and refuted — the source-kind guards and scrubber already exist in live code; research.md §1 now records the refutation with corrected coordinates).
- **No-doc-action:** T041 (forward-looking commit-hygiene process advice; the recommendation states no action on shipped state — git history is immutable and out of scope).
- **Code findings (resolved, were [B]):** T022 (memory-triggers.ts) + T024 (reindex.ts) fixed in commit b2c42edd09 (scope-then-limit over-fetch; post-detach assertion + source-kind ingress). T025/T026 (memory-save.ts), T027 (context-server.ts), T031 (loop-lock.cjs), T032 (graph-traversal.ts) fixed in a follow-on code pass: idempotency replay identity check + sibling memory-crud-update.ts, conflict-unreachable comment correction, boot-only-TTL documentation, intentional loop-lock divergence documented in both wrapper headers, and graph-traversal reserved/contract-only note. tsc --noEmit clean; target vitest suites unchanged vs baseline (1 pre-existing context-server T56 source-regex failure, unrelated). T042's phase-id comment-hygiene was fixed (label removed, logic unchanged); only its optional code-wiring (`resolveActiveProfileDbPath`) remains as a follow-on code task.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: `../../../review/fresh-regression-75/deep-review-findings-registry.json` (epic-root review dir)
- Coverage: `../fix-coverage.json`
<!-- /ANCHOR:cross-refs -->
