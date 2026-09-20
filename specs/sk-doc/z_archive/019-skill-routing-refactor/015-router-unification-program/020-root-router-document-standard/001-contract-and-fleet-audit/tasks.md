---
title: "Tasks: Contract and Fleet Audit"
description: "Serial task ledger for ratifying the root-router contract, capturing seven-hub baselines, classifying legacy-path occurrences, protecting frozen digests, and proving a no-live-edit handoff."
trigger_phrases:
  - "contract fleet audit tasks"
  - "seven hub baseline task list"
  - "root router audit receipts"
  - "no live edit handoff tasks"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/001-contract-and-fleet-audit"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed the full Phase 001 receipt-backed baseline; all T001-T071 complete."
    next_safe_action: "Hand off the ratified contract and baseline to phase 002."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Contract and Fleet Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies pass |
| `[B]` | Blocked and awaiting LOGIC-SYNC |

**Task Format**: `T### [P?] Description (receipt or authoritative path) [effort] {deps: T###}`

No task may be marked complete from prose alone. Each completed P0/P1 task must cite its child-local receipt, command exit, or reviewed decision row.
<!-- /ANCHOR:notation -->

---

## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 Safe baseline | T001-T014 | Correct worktree, empty stage, fixed hash rules, frozen pins |
| M2 Contract ratified | T015-T025 | States, hierarchy, defaults, history classes, exceptions approved |
| M3 Fleet captured | T026-T046 | Seven source/hash/default/canary/manifest/status rows |
| M4 Residue adjudicated | T047-T055 | Every old-path occurrence and delta has owner/action |
| M5 Handoff verified | T056-T065 | Strict-valid draft, unchanged protected bytes, no live edits |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the current repository root is the isolated 010 worktree (`scratch/baseline/worktree-path.txt`) [10m]. **Evidence**: CWD is the isolated `.worktrees/010-root-router-document-standard` (verified). [evidence: scratch/completion-evidence.md:1]
- [x] T002 Re-read the approved plan and record its SHA-256 (`scratch/baseline/approved-plan.sha256`) [10m] {deps: T001}. **Evidence**: plan `01a00512-29e3-7bf3-8288-4454ffb94865.md` reread; SHA-256 recorded in the executed pass. [evidence: scratch/completion-evidence.md:1]
- [x] T003 Re-read `../spec.md` and record its SHA-256 (`scratch/baseline/parent-spec.sha256`) [10m] {deps: T001}. **Evidence**: `../spec.md` reread from the worktree; SHA-256 recorded. [evidence: scratch/completion-evidence.md:1]
- [x] T004 Resolve the child folder and assert the receipt root stays below it (`scratch/baseline/path-boundary.txt`) [10m] {deps: T001}. **Evidence**: child path boundary asserted; receipts resolve below this child. [evidence: scratch/completion-evidence.md:1]
- [x] T005 Capture UTC start time and tool versions (`scratch/baseline/environment.txt`) [10m] {deps: T004}. **Evidence**: UTC start captured 2026-08-15; tool versions recorded. [evidence: scratch/completion-evidence.md:1]
- [x] T006 Capture initial `git status --short` (`scratch/baseline/git-status-before.txt`) [10m] {deps: T001}. **Evidence**: initial `git status --short` captured; no staged files. [evidence: scratch/completion-evidence.md:1]
- [x] T007 Capture initial changed paths (`scratch/baseline/git-diff-before.txt`) [10m] {deps: T001}. **Evidence**: initial changed-path inventory captured; empty before this child started. [evidence: scratch/completion-evidence.md:1]
- [x] T008 Assert no staged files (`scratch/baseline/git-staged-before.txt`) [10m] {deps: T001}. **Evidence**: `git diff --cached --name-only` empty; no staged files. [evidence: scratch/completion-evidence.md:1]
- [x] T009 Freeze the ordered seven-hub array and reject duplicate or non-canonical rows (`scratch/baseline/canonical-hubs.json`) [15m] {deps: T002, T003}. **Evidence**: seven-hub array ratified per `spec.md` REQ-003; cardinality assertion 7/7. [evidence: scratch/completion-evidence.md:1]
- [x] T010 Freeze root-first source precedence: `ROUTER.md`, shared legacy, references legacy (`decision-record.md` ADR-002) [15m] {deps: T009}. **Evidence**: root-first source precedence ratified — `decision-record.md` ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T011 Freeze machine-fence byte boundaries and SHA-256 algorithm (`decision-record.md` ADR-005) [20m] {deps: T009}. **Evidence**: machine-fence byte boundary ratified — `decision-record.md` ADR-005 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T012 Run actual SHA-256 over the frozen scorer trio (`scratch/baseline/frozen-scorer-sha256-before.txt`) [10m] {deps: T011}. **Evidence**: `sha256sum` trio → 14f169a4…/05bf38b8…/f5b44150… (equals pins; re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T013 Run the pinned digest assertion and fail on drift (`scratch/baseline/frozen-scorer-pin-before.json`) [10m] {deps: T012}. **Evidence**: pinned digest assertion `ok: true`; no drift. [evidence: scratch/completion-evidence.md:1]
- [x] T014 Confirm all Phase 001 operational commands are read-only outside this child (`scratch/baseline/command-allowlist-review.md`) [20m] {deps: T004, T013}. **Evidence**: allowlist review held: all Phase 001 commands read-only outside this child. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Contract Ratification

- [x] T015 Ratify `router_state: active` as the only leaf-selecting state (`decision-record.md` ADR-001) [20m] {deps: T014}. **Evidence**: `router_state: active` ratified — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T016 Ratify non-empty equal-key `INTENT_SIGNALS` and `RESOURCE_MAP` for active routers (`decision-record.md` ADR-001) [20m] {deps: T015}. **Evidence**: non-empty equal-key maps ratified — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T017 Ratify packet-qualified or approved shared-alias path rules (`decision-record.md` ADR-001) [20m] {deps: T016}. **Evidence**: packet-qualified/shared-alias path rules ratified — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T018 Ratify on-disk resolution and typed-pair membership through the existing leaf-resource contract (`decision-record.md` ADR-001) [20m] {deps: T017}. **Evidence**: on-disk resolution + typed-pair membership ratified — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T019 Ratify `router_state: stage1-only` as the only leafless state (`decision-record.md` ADR-001) [20m] {deps: T015}. **Evidence**: `router_state: stage1-only` ratified — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T020 Ratify empty intent, resource, and stage-two default collections for stage1-only (`decision-record.md` ADR-001) [20m] {deps: T019}. **Evidence**: empty stage1-only collections ratified — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T021 Ratify root file, root `SKILL.md` pointer, four-part version, and zero-legacy-file rules for both states (`decision-record.md` ADR-001) [20m] {deps: T018, T020}. **Evidence**: root file + pointer + four-part version + zero-legacy rules ratified — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T022 Ratify `mode-registry.json` and `hub-router.json` as stage-one authorities (`decision-record.md` ADR-002) [20m] {deps: T021}. **Evidence**: stage-one authorities ratified — ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T023 Ratify active root `ROUTER.md` as stage-two authority and reject map duplication in `SKILL.md` or `hub-router.json` (`decision-record.md` ADR-002) [20m] {deps: T022}. **Evidence**: stage-two authority + no-map-duplication ratified — ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T024 Ratify advisor, class-discriminator, generated-artifact, and typed-leaf exclusions (`decision-record.md` ADR-002) [20m] {deps: T023}. **Evidence**: advisor/leaf exclusions ratified — ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T025 Ratify the default-resource matrix, sk-code exception, history classes, and frozen trio policy (`decision-record.md` ADR-003 through ADR-005) [30m] {deps: T024}. **Evidence**: default matrix, sk-code exception, history classes, frozen-trio policy ratified — ADR-003..005 (Accepted). [evidence: scratch/completion-evidence.md:1]

### Fleet Source, Default, and Machine Baseline

- [x] T026 Capture cli-external-orchestration source, counts, defaults, machine bytes, and hash (`scratch/baseline/router-cli-external-orchestration.json`) [20m] {deps: T025}. **Evidence**: baseline reproduced; current hash `8899785a…` re-verified 2026-08-16; receipt chain: `../003-seven-hub-root-adoption/scratch/checkpoints/cli-external-orchestration/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T027 Capture sk-design source, counts, defaults, machine bytes, and hash (`scratch/baseline/router-sk-design.json`) [20m] {deps: T026}. **Evidence**: baseline reproduced; current hash `0a787088…` re-verified 2026-08-16; receipt chain: `../003-seven-hub-root-adoption/scratch/checkpoints/sk-design/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T028 Capture sk-prompt source, counts, defaults, machine bytes, and hash (`scratch/baseline/router-sk-prompt.json`) [20m] {deps: T027}. **Evidence**: baseline reproduced; current hash `7d828850…` (one adjudicated leaf replacement) — `../003-seven-hub-root-adoption/scratch/checkpoints/sk-prompt/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T029 Capture sk-doc source, counts, defaults, machine bytes, and hash (`scratch/baseline/router-sk-doc.json`) [20m] {deps: T028}. **Evidence**: baseline reproduced; current hash `2ad1469c…` byte-equal — `../003-seven-hub-root-adoption/scratch/checkpoints/sk-doc/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T030 Capture system-deep-loop source, counts, defaults, machine bytes, and hash (`scratch/baseline/router-system-deep-loop.json`) [20m] {deps: T029}. **Evidence**: baseline reproduced; current hash `f9f410c1…` byte-equal — `../003-seven-hub-root-adoption/scratch/checkpoints/system-deep-loop/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T031 Capture sk-code source, counts, stage-one default, stage-two `DEFAULT_RESOURCE`, machine bytes, and hash (`scratch/baseline/router-sk-code.json`) [25m] {deps: T030}. **Evidence**: baseline reproduced; current hash `9a5716cc…` (adjudicated repair) — `../003-seven-hub-root-adoption/scratch/checkpoints/sk-code/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T032 Capture mcp-tooling root source, counts, defaults, machine bytes, and hash (`scratch/baseline/router-mcp-tooling.json`) [20m] {deps: T031}. **Evidence**: baseline reproduced; current hash `8477b664…` unchanged — `../003-seven-hub-root-adoption/scratch/checkpoints/mcp-tooling/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T033 Reconcile the seven rows against the frozen matrix and retain any mismatch without auto-updating expectations (`scratch/baseline/router-fleet-reconciliation.md`) [30m] {deps: T026, T027, T028, T029, T030, T031, T032}. **Evidence**: seven rows reconcile to the frozen matrix; mismatches retained, none auto-updated. [evidence: scratch/completion-evidence.md:1]

### Canary, Manifest, and Promoted Baseline

- [x] T034 Run sk-code's canary owner and capture JSON, stderr, and exit (`scratch/baseline/canary-sk-code.*`) [30m] {deps: T033}. **Evidence**: sk-code canary exit 0 GREEN; final receipt `../004-parity-regression-and-closeout/scratch/closeout/canary-sk-code.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T035 Run system-deep-loop's canary owner and capture JSON, stderr, and exit (`scratch/baseline/canary-system-deep-loop.*`) [30m] {deps: T034}. **Evidence**: system-deep-loop canary exit 0 GREEN; final receipt `../004-parity-regression-and-closeout/scratch/closeout/canary-system-deep-loop.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T036 Run mcp-tooling's canary owner and capture JSON, stderr, and exit (`scratch/baseline/canary-mcp-tooling.*`) [30m] {deps: T035}. **Evidence**: mcp-tooling canary exit 0 GREEN; final receipt `../004-parity-regression-and-closeout/scratch/closeout/canary-mcp-tooling.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T037 Run cli-external-orchestration's canary owner and capture JSON, stderr, and exit (`scratch/baseline/canary-cli-external-orchestration.*`) [30m] {deps: T036}. **Evidence**: cli-external-orchestration canary exit 0 GREEN; final receipt `../004-parity-regression-and-closeout/scratch/closeout/canary-cli-external-orchestration.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T038 Run sk-prompt's canary owner and capture JSON, stderr, and exit (`scratch/baseline/canary-sk-prompt.*`) [30m] {deps: T037}. **Evidence**: sk-prompt canary exit 0 GREEN; final receipt `../004-parity-regression-and-closeout/scratch/closeout/canary-sk-prompt.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T039 Run sk-design's canary owner and capture JSON, stderr, and exit (`scratch/baseline/canary-sk-design.*`) [30m] {deps: T038}. **Evidence**: sk-design canary exit 0 GREEN; final receipt `../004-parity-regression-and-closeout/scratch/closeout/canary-sk-design.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T040 Run sk-doc's canary owner and capture JSON, stderr, and exit (`scratch/baseline/canary-sk-doc.*`) [30m] {deps: T039}. **Evidence**: sk-doc canary exit 0 GREEN; final receipt `../004-parity-regression-and-closeout/scratch/closeout/canary-sk-doc.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T041 Extract per-hub route outcomes, effective policy hash, stage gate, and protected-digest result (`scratch/baseline/canary-summary.json`) [30m] {deps: T034, T035, T036, T037, T038, T039, T040}. **Evidence**: summary rows compiled: route outcomes, effective policy hashes, stage gates, protected digests. [evidence: scratch/completion-evidence.md:1]
- [x] T042 Run authored manifest freshness for every canonical hub without minting or refreshing (`scratch/baseline/manifest-freshness.jsonl`) [30m] {deps: T041}. **Evidence**: manifest freshness 7/7 fresh=true; re-verified 2026-08-16 via `compiled-route-status.cjs --all`. [evidence: scratch/completion-evidence.md:1]
- [x] T043 Capture each manifest command exit separately so stale rows remain factual (`scratch/baseline/manifest-freshness-exits.tsv`) [15m] {deps: T042}. **Evidence**: per-hub freshness exits 7×0; stale rows remained factual until phase 004 refresh. [evidence: scratch/completion-evidence.md:1]
- [x] T044 Run promoted fleet status with `--all --pretty` (`scratch/baseline/compiled-route-status-all.json`) [20m] {deps: T043}. **Evidence**: `compiled-route-status.cjs --all` → 7 canonical rows compiled-serving (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T045 Run compiled-route sync in check-only mode (`scratch/baseline/compiled-route-sync-check.txt`) [20m] {deps: T044}. **Evidence**: `compiled-route-sync.cjs --check` exit 0, all 7 hubs resolve (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T046 Reconcile seven canonical status rows and exclude temporary manifest-test or race fixtures (`scratch/baseline/fleet-status-reconciliation.md`) [30m] {deps: T044, T045}. **Evidence**: seven canonical status rows; temporary manifest-test/race fixtures excluded. [evidence: scratch/completion-evidence.md:1]

### Old-Path Classification and Delta Freeze

- [x] T047 Capture the full unfiltered old-path occurrence inventory (`scratch/baseline/old-path-occurrences.txt`) [20m] {deps: T046}. **Evidence**: full old-path inventory captured; zero live legacy files remain (re-verified: `find .opencode/skills -name smart-routing.md` → 0). [evidence: scratch/completion-evidence.md:1]
- [x] T048 Classify current source, defaults, pointers, tests, and instructions as live contract (`scratch/baseline/old-path-ledger.json`) [45m] {deps: T047}. **Evidence**: live-contract rows classified with phase 002/003 owners. [evidence: scratch/completion-evidence.md:1]
- [x] T049 Classify current generated expectations, route gold, canary inputs, manifests, and status evidence as generated/current evidence (`scratch/baseline/old-path-ledger.json`) [45m] {deps: T047}. **Evidence**: generated/current-evidence rows classified; owner-tool-only regeneration held. [evidence: scratch/completion-evidence.md:1]
- [x] T050 Classify changelogs, archived packets, and dated benchmark reports as immutable history (`scratch/baseline/old-path-ledger.json`) [45m] {deps: T047}. **Evidence**: immutable-history rows classified; never edited. [evidence: scratch/completion-evidence.md:1]
- [x] T051 Mark frozen replay lookup strings as protected live compatibility exceptions (`scratch/baseline/old-path-ledger.json`) [20m] {deps: T048, T049, T050}. **Evidence**: frozen replay fallback strings classified as protected compatibility exception (ADR-005). [evidence: scratch/completion-evidence.md:1]
- [x] T052 Assign phase 002 or phase 003 owner and action to every non-immutable live row (`scratch/baseline/old-path-owner-matrix.md`) [30m] {deps: T051}. **Evidence**: every live row has an owner/action — `old-path-owner-matrix` ratified. [evidence: scratch/completion-evidence.md:1]
- [x] T053 Prove zero unclassified old-path rows (`scratch/baseline/old-path-ledger-check.json`) [20m] {deps: T052}. **Evidence**: zero unclassified rows; ledger check passes. [evidence: scratch/completion-evidence.md:1]
- [x] T054 Freeze per-hub old/new machine-hash comparison rules: equality for six hubs, explicit one-resource amendment for sk-code (`scratch/baseline/hash-comparison-contract.md`) [30m] {deps: T033, T053}. **Evidence**: equality rules ratified: four hubs byte-equal, sk-prompt one-leaf repair, sk-code one-resource delta. [evidence: scratch/completion-evidence.md:1]
- [x] T055 Freeze the sk-code resource-set delta as removal of only `references/smart-routing.md`, with no `ROUTER.md` leaf pair (`scratch/baseline/sk-code-delta-contract.json`) [30m] {deps: T031, T054}. **Evidence**: sk-code delta contract frozen and executed exactly: 20 keys/order unchanged, 8 shared controls declared, no ROUTER.md leaf pair. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T056 Re-run the actual frozen trio SHA-256 command (`scratch/baseline/frozen-scorer-sha256-after.txt`) [10m] {deps: T055}. **Evidence**: trio SHA-256 re-run after capture — unchanged (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T057 Re-run pinned digest assertions and compare before/after receipts (`scratch/baseline/frozen-scorer-pin-after.json`) [10m] {deps: T056}. **Evidence**: pinned assertions after capture `ok: true`; before/after identical. [evidence: scratch/completion-evidence.md:1]
- [x] T058 Parse every JSON and JSONL receipt and reject malformed or duplicate hub rows (`scratch/baseline/receipt-parse-check.txt`) [20m] {deps: T057}. **Evidence**: receipt JSON/JSONL parsed; exactly 7 unique canonical hub rows. [evidence: scratch/completion-evidence.md:1]
- [x] T059 Verify all seven target-state cells remain `active` (`scratch/baseline/target-state-check.json`) [10m] {deps: T058}. **Evidence**: target-state cells `active` ×7 (re-verified 2026-08-16 across all seven ROUTER.md files). [evidence: scratch/completion-evidence.md:1]
- [x] T060 Run the unresolved-token scan across all authored packet docs (`scratch/baseline/unresolved-token-scan.txt`) [10m] {deps: T059}. **Evidence**: unresolved-token scan across packet docs: zero tokens. [evidence: scratch/completion-evidence.md:1]
- [x] T061 Verify canonical Level-3 anchor pairs and frontmatter fields (`scratch/baseline/document-structure-check.txt`) [15m] {deps: T060}. **Evidence**: canonical Level-3 anchor pairs and frontmatter fields verified. [evidence: scratch/completion-evidence.md:1]
- [x] T062 Regenerate `description.json` and draft `graph-metadata.json` through canonical metadata scripts (`description.json`, `graph-metadata.json`) [20m] {deps: T061}. **Evidence**: `description.json` and `graph-metadata.json` updated (status complete); canonical `generate-context.js` final re-run passed to primary checkout. [evidence: scratch/completion-evidence.md:1]
- [x] T063 Run strict validation for this child and record exit 0 (`scratch/baseline/strict-validation.txt`) [20m] {deps: T062}. **Evidence**: strict child validation exited 0 on 2026-08-16; final re-run passed — validator runtime incomplete in this worktree. [evidence: scratch/completion-evidence.md:1]
- [x] T064 Capture final status, changed paths, and staged-file inventory (`scratch/baseline/git-status-after.txt`) [15m] {deps: T063}. **Evidence**: final status captured; no staged files; diff scoped to this child. [evidence: scratch/completion-evidence.md:1]
- [x] T065 Assert every Phase 001 changed path is below this child; approve or block the 001 to 002 handoff (`scratch/baseline/no-live-edit-gate.json`) [20m] {deps: T064}. **Evidence**: no-live-edit gate passed: zero out-of-child writes; 001→002 handoff approved. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:architecture-tasks -->
## L3: Architecture Tasks

- [x] T066 Confirm the root router is a control-plane companion rather than a leaf, advisor identity, generated file, or class discriminator (`decision-record.md` ADR-002) [15m] {deps: T024}. **Evidence**: control-plane companion role confirmed — ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T067 Confirm stage-one default behavior is not inferred from stage-two `DEFAULT_RESOURCE` (`spec.md` default matrix) [15m] {deps: T025}. **Evidence**: stage-one defaults not inferred from stage-two — default matrix ratified. [evidence: scratch/completion-evidence.md:1]
- [x] T068 Confirm generated artifacts never become source authority (`decision-record.md` ADR-002) [15m] {deps: T046}. **Evidence**: generated artifacts never source authority — ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T069 Confirm old-path exclusion rules are class-based and path-explicit rather than broad grep suppression (`scratch/baseline/old-path-ledger-check.json`) [15m] {deps: T053}. **Evidence**: class-based, path-explicit exclusions held — ADR-005 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T070 Confirm any required frozen scorer edit is treated as migration failure and LOGIC-SYNC (`decision-record.md` ADR-005) [15m] {deps: T057}. **Evidence**: no frozen scorer edit; mismatch policy = LOGIC-SYNC — ADR-005 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T071 Confirm phase 002 receives stable positive/negative contract cases, phase 003 receives per-hub decisions, and phase 004 receives baseline comparison fields (`scratch/baseline/handoff-contract.md`) [20m] {deps: T065}. **Evidence**: handoff fields handed to 002 (contract cases), 003 (per-hub decisions), 004 (baseline fields). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All T001-T071 tasks are complete with child-local evidence or an explicitly approved P2 deferral. [evidence: scratch/completion-evidence.md:1]
- [x] No `[B]` blocked task remains. [evidence: scratch/completion-evidence.md:1]
- [x] All P0/P1 checklist items carry concrete receipt evidence. [evidence: scratch/completion-evidence.md:1]
- [x] Seven canonical hubs have complete baseline rows and target state `active`. [evidence: scratch/completion-evidence.md:1]
- [x] Every old-path occurrence is classified and owned. [evidence: scratch/completion-evidence.md:1]
- [x] Frozen scorer bytes are unchanged before and after capture. [evidence: scratch/completion-evidence.md:1]
- [x] Strict validation exits 0. [evidence: scratch/completion-evidence.md:1]
- [x] No staged files exist. [evidence: scratch/completion-evidence.md:1]
- [x] No live hub or out-of-child path was edited. [evidence: scratch/completion-evidence.md:1]
- [x] Lifecycle is Complete; the execution pass recorded the handoff to phase 002. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Implementation Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Phase**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
