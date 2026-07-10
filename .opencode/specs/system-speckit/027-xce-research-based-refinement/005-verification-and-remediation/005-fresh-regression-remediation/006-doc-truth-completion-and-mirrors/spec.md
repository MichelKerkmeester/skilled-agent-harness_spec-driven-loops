---
title: "Feature Specification: Doc-Truth, Completion-Claim & Runtime-Mirror Reconciliation"
description: "Remediation sub-phase of the 027 fresh+regression deep-review: 42 findings (21 P1) in this subsystem, each carried as a task with its registry recommendation. Scaffold only — no fixes applied."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/006-doc-truth-completion-and-mirrors"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "35 doc-truth/mirror findings fixed/refuted; 7 deferred to a code phase"
    next_safe_action: "Code phase handles deferred T022/T024-T027/T031/T032 + T042 wiring"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doc-Truth, Completion-Claim & Runtime-Mirror Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (35 fixed/refuted; 7 deferred to a code phase) |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Findings** | 42 (21 P1 / 21 P2) |
| **Handoff Criteria** | Every listed finding fixed-or-refuted-with-reason, each code fix test-gated; validate.sh --strict; cross-runtime body-diff + grep checks. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Sub-phase of `005-fresh-regression-remediation` (phase parent). It owns the subsystem cluster from the fresh+regression deep-review's findings registry. Per operator directive every finding is carried (refuted ones as hardening, asserted ones fix-as-stated). Source: `../../review/fresh-regression-75/deep-review-findings-registry.json`.

**Scope Boundary**: only findings assigned to this sub-phase by `fix-coverage.json`. No cross-phase edits.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-review surfaced 42 findings in this subsystem. Left unaddressed they risk real defects (data integrity / lifecycle / safety) plus robustness and traceability debt. This sub-phase remediates each.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: the 42 findings enumerated in tasks.md (and `fix-coverage.json`).
**Out of scope**: findings owned by sibling sub-phases; any change outside the cited files + their tests.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** (006-T001, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md:120`: Add `000-spec-tree-consolidation/` to the 000-release-cleanup phase documentation map with its `Complete` status, and refresh description/metadata so generated child listings agree with graph-metadata
- **R2** (006-T002, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:128`: Promote the 001 research/doctrine row to `Complete`, update 001-research-and-doctrine child rows for peck and gem to completed aggregate statuses, and refresh graph/description metadata so status fiel
- **R3** (006-T003, asserted — fix as stated) — `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`: Update the root catalog and spec-memory CLI catalog entries to 39, refresh the memory README coverage matrix, and adjust any 37-tool ownership lint/test wording to the current TOOL_DEFINITIONS length.
- **R4** (006-T004, asserted — fix as stated) — `.opencode/skills/system-spec-kit/feature_catalog/01--retrieval/session-recovery-spec-kit-resume.md:64`: Replace all feature-catalog spec_kit_*.yaml asset references with the live speckit_*.yaml paths and run a catalog source-file existence check over feature_catalog/**/*.md.
- **R5** (006-T005, asserted — fix as stated) — `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:160`: Exclude category README/package-map files from scenario_files, or rename the check to count all playbook markdown files. If excluding them, update the hard-coded count from 410 to 407 and recompute th
- **R6** (006-T006, asserted — fix as stated) — `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:130`: Choose one taxonomy and apply it consistently: either allow per-scenario PARTIAL everywhere, or keep scenario PARTIAL forbidden and redefine feature/packet PARTIAL as an aggregate evidence state deriv
- **R7** (006-T007, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights/tasks.md:50`: Update 009 plan.md and tasks.md to mark the 111MB/current-corpus-pass evidence as superseded, state the realistic 1x breach at phase close, and point to 010/phase-017 as the closure.
- **R8** (006-T008, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/013-provenance-injection/tasks.md:88`: Reconcile phase 013 docs: mark T023-T026 and the final completion criterion complete with the exact evidence already recorded, fill CHK-021/022/023/042, update the verification summary counts and stal
- **R9** (006-T009, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness/checklist.md:77`: Update CHK-021 to the remediated 12/12 flag-on evidence, and either confirm CHK-023 is intentionally a separate historical 10-test flag-off run or update it to the current recorded evidence style; kee
- **R10** (006-T010, unverified(parse-fail)) — `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1062`: Either correct the docs (validation_rules.md:93-105, 006 implementation-summary.md:82, CLAUDE.md/AGENTS.md) to state that enabling SPECKIT_COMPLETION_FRESHNESS blocks --strict completion regardless of
- **R11** (006-T011, asserted — fix as stated) — `.opencode/skills/sk-code/SKILL.md:1`: Either (a) amend REQ-005/SC-002 to state the predicate is orchestrator/contract-owned and explicitly accept that direct sk-code invocations are not gated, reclassifying the sk-code edit as a tracked d
- **R12** (006-T012, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate/spec.md:133`: Update the spec's file tables and command references to the actual paths, or create symlinks/aliases where the spec claims they live.
- **R13** (006-T013, asserted — fix as stated) — `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json:8`: Add a shipped reviewer profile (e.g., `reviewer-regression.json`) listing the four `reviewer-*.json` fixtures, and reference it in the command examples.
- **R14** (006-T014, refuted-Round2 → harden-anyway) — `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:461`: Add `reviewer` to `VALID_SCORERS` and route reviewer-shaped fixtures to `reviewer-scorer.cjs`, or clearly document that reviewer scoring must use the command/YAML path.
- **R15** (006-T015, asserted — fix as stated) — `.opencode/skills/deep-loop-workflows/deep-improvement/manual_testing_playbook/manual_testing_playbook.md:750`: Create `09--model-benchmark-mode/reviewer-prompt-regression-fixtures.md` (or equivalent) with the MB-R01 execution contract, commands, and expected signals.
- **R16** (006-T016, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md:8`: Re-verify the finding against the full function body and either remove/refute the P0 or cite the exact unguarded lines that prove manual rows are lost.
- **R17** (006-T017, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md:9`: Correct the citation to the actual guard-free lines or downgrade/refute the finding and update the synthesis.
- **R18** (006-T018, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md:10`: Identify any genuinely unscrubbed durable field and cite the exact write line, or refute the finding.
- **R19** (006-T019, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/implementation-summary.md:30`: Correct the Spec Folder value to 002-tri-system-deep-research and align it with description.json/graph-metadata.json.
- **R20** (006-T020, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/spec.md:32`: Update spec.md status to Complete, refresh the _memory continuity block to match implementation-summary.md, and regenerate graph-metadata.json so derived.status is not in_progress.
- **R21** (006-T021, asserted — fix as stated) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/spec.md:111`: Update parent 005 spec.md row 004 status from 'Planned' to 'Complete' (or 'In Progress' if Unit C follow-on is tracked open), then either keep T012 [x] truthfully or note the residual follow-on.
- **R22** (006-T022, P2) — `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:525`: Pass a larger or unbounded max to matchSemanticTriggers (e.g. limit*4) and let filterSemanticMatchesByScope reduce to the final scoped set, then slice to limit — mirroring the lexical limit*2 over-fet
- **R23** (006-T023, P2) — `.opencode/skills/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/feedback-retention-learning-modes.md:20`: Reword to 'Off mode runs no feedback-driven audit or retention decisions; the baseline TTL sweep still deletes expired non-protected rows' and adjust step 3 to expect baseline deletion.
- **R24** (006-T024, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:663`: After the detach attempt, assert get_attached_vector_path(jobDb)===null before renaming (re-detach or throw otherwise) instead of swallowing all errors as 'not attached'; and/or add a file-identity (f
- **R25** (006-T025, P2) — `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3570`: Either feed the FULL request payload (not the fingerprint subset) into the payload hash so same-key/different-payload conflicts can actually be detected, or remove the conflict/markResponseWithReceipt
- **R26** (006-T026, P2) — `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3585`: Select id in the active-row query and honor the replay only when it equals extractMemoryIdFromResponse(lookup.response) (and/or the receipt's stored memory_id); otherwise drop the receipt and fall thr
- **R27** (006-T027, P2) — `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1824`: Add a bounded periodic sweep (e.g. opportunistically on write or on a timer) in addition to the boot prune, or document that TTL only applies across restarts.
- **R28** (006-T028, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/002-memory-store-and-search/changelog-002-010-bm25-warmup-churn-reduction.md:23`: Choose the authoritative preserved benchmark number or add the missing 743MB artifact, then normalize the 010 changelog, parent spec, before-vs-after summary, and implementation-summary frontmatter/bo
- **R29** (006-T029, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/005-mcp-cli-stress-tests/spec.md:25`: Replace the fabricated 'sha256:1111...' value with either the canonical zero placeholder (sha256:000...0) if no real fingerprint was captured, or a genuine buildContinuityFingerprint(content) value re
- **R30** (006-T030, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:87`: Either (a) relocate before-vs-after.md to a changelog rollup / child and keep only navigational bridges at the parent, or (b) if these are accepted reorg-bridge artifacts, update spec.md:87 to enumera
- **R31** (006-T031, P2) — `.opencode/skills/deep-loop-workflows/deep-context/scripts/loop-lock.cjs:60`: Point deep_context_auto/confirm.yaml at the runtime adapter (deep-loop-runtime/scripts/loop-lock.cjs) with --lock-path/--packet-id/--owner-pid, or align the deep-context wrapper's flag names and defau
- **R32** (006-T032, P2) — `lib/storage/ports/graph-traversal.ts:57`: Either drop collectWeightedWalk/collectDirectedReachability from the GraphTraversal port (callers can use the bfs-traversal module functions directly, as they already do internally), or add a one-line
- **R33** (006-T033, P2) — `.claude/agents/deep-review.md:11`: Change .claude/agents/deep-review.md:11 to: **Path Convention**: Use only `.claude/agents/*.md` as the canonical runtime path reference. — matching its deep-context/deep-research Claude siblings. Add 
- **R34** (006-T034, P2) — `.claude/agents/review.md:11`: Change `.opencode/agents/*.md` -> `.claude/agents/*.md` at .claude/agents/review.md:11; apply the same fix to .claude/agents/deep-review.md for full runtime parity.
- **R35** (006-T035, P2) — `.codex/agents/orchestrate.toml:787`: In the Codex mirror, change the row to 'This orchestrate.toml file' (or make it extension-neutral, e.g. 'this agent definition file') so each mirror's self-reference matches its own format.
- **R36** (006-T036, P2) — `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:159`: In §7, note explicitly that the Evidence Group is carried as the `evidence` field on a deep-loop JSONL iteration record (not as a free-standing AGENT_IO_EVIDENCE text envelope appended to agent output
- **R37** (006-T037, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/002-scoped-preexec-and-handoff-gates/spec.md:209`: Reconcile the spec: keep the centralized-predicate design and rewrite REQ-005/SC-002 to reference the orchestrator/contract surface (or an explicit sk-code Phase-0 reminder), removing the literal 'sk-
- **R38** (006-T038, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/001-finding-remediation/remediation-plan.md:32`: Correct the downgraded count to 57, fix the P1 column to sum to 132, and either triage the 8 untriaged downgrades with a p2_decision or soften the 'of which fixed/waived per P2 rules' claim to reflect
- **R39** (006-T039, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/plan.md:52-54`: Mark the Definition of Done checkboxes [x] or remove them if superseded by tasks.md.
- **R40** (006-T040, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/004-residual-design-units/spec.md:28`: Reconcile spec.md frontmatter (completion_pct, recent_action, next_safe_action) to the resolved state and update the §3 Unit A row counts to the implemented 91-row reality, or add a one-line 'implemen
- **R41** (006-T041, P2) — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement (commit 6ed0f30a2f)`: Future bulk snapshots should be committed as a neutral chore (no per-epic scope prefix) or split by owning packet; explicitly tag any 'not independently verified' content so a later verification pass 
- **R42** (006-T042, P2) — `.opencode/commands/doctor/assets/doctor_update.yaml:409`: Resolve the active-profile DB selection (resolveActiveProfileDbPath now exists) and remove the inline TODO, or move the remaining work to a spec-doc task and replace the comment with a concise why.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every finding resolved (fixed, or refuted-with-reason recorded in the registry).
- validate.sh --strict; cross-runtime body-diff + grep checks.
- No regression to prior epic-sweep remediations; whole-gate delta reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Asserted findings may be false positives (Round-2 refuted 3/16 code candidates) — confirm against cited code before editing.
- Doc/metadata edits must keep validate.sh --strict green.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; raise per-task if a cited finding proves refuted on inspection.
<!-- /ANCHOR:questions -->
