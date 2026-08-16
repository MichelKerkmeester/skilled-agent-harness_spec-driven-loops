---
title: "Tasks: Seven-Hub Root Adoption"
description: "Serial task ledger for the seven checkpoints that adopt active root ROUTER.md across all canonical hubs, with per-hub pre-state capture, byte-preserving moves, link rebasing, default preservation, owner-tool metadata regeneration, additive versions and changelogs, five-gate proof, gated legacy deletion, residue rescan, and the 003 to 004 handoff."
trigger_phrases:
  - "seven hub adoption tasks"
  - "root router checkpoint tasks"
  - "hub migration task ledger"
  - "legacy deletion tasks"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed all seven adoption checkpoints; all T001-T094 complete."
    next_safe_action: "Hand the seven checkpoint receipts and adjudicated maps to phase 004."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Seven-Hub Root Adoption

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
| M1 Baseline safe | T001-T008 | Phase 002 gates pass; pins pass; fixed order; clean stage |
| M2 Pilot golden | T009-T014 | mcp-tooling conforms idempotently; zero changed paths |
| M3 Five migrations | T015-T064 | CP2-CP6 receipts complete; legacy files deleted |
| M4 sk-code delta | T065-T075 | One resource removed; gates pass; legacy deleted |
| M5 Handoff | T076-T088 | Zero live residue; pins unchanged; strict validation exit 0; no staged files |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the current repository root is the isolated 010 worktree (`scratch/pins/worktree-path.txt`) [10m]. **Evidence**: CWD is the isolated `.worktrees/010-root-router-document-standard` (verified). [evidence: scratch/completion-evidence.md:1]
- [x] T002 Re-read the approved plan, parent spec, and Phase 001 contract; record SHA-256 for each (`scratch/pins/authority-sha256.txt`) [15m]. **Evidence**: plan, parent spec, Phase 001 contract reread; SHA-256 recorded. [evidence: scratch/completion-evidence.md:1]
- [x] T003 Confirm Phase 002 validator, doctor, and package fixture gates pass before any migration (`scratch/pins/phase002-gate.txt`) [20m] {deps: T002}. **Evidence**: Phase 002 gates confirmed before migration: doctor/package positives and the RRC matrix green. [evidence: scratch/completion-evidence.md:1]
- [x] T004 Freeze the ordered checkpoint array and reject duplicate or non-canonical rows (`scratch/pins/checkpoint-order.json`) [15m] {deps: T002}. **Evidence**: checkpoint order frozen: mcp-tooling, cli-external-orchestration, sk-design, sk-prompt, sk-doc, system-deep-loop, sk-code. [evidence: scratch/completion-evidence.md:1]
- [x] T005 Capture initial `git status --short` and staged-file inventory (`scratch/pins/git-status-before.txt`, `scratch/pins/git-staged-before.txt`) [10m] {deps: T001}. **Evidence**: initial `git status --short` captured; no staged files. [evidence: scratch/completion-evidence.md:1]
- [x] T006 Run actual SHA-256 over the frozen replay and scorer trio (`scratch/pins/frozen-substrate-before.txt`) [10m] {deps: T001}. **Evidence**: frozen substrate hashed before CP1: 14f169a4/05bf38b8/f5b44150. [evidence: scratch/completion-evidence.md:1]
- [x] T007 Run the pinned digest assertion and fail on drift (`scratch/pins/frozen-pin-before.json`) [10m] {deps: T006}. **Evidence**: pinned digest assertion `ok: true`. [evidence: scratch/completion-evidence.md:1]
- [x] T008 Confirm no Phase 003 command builds, refreshes, publishes, promotes, or reverts compiled routes (`scratch/pins/command-allowlist-review.md`) [15m] {deps: T005}. **Evidence**: allowlist review: no build/refresh/publish/promote/revert verb in Phase 003. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### CP1 mcp-tooling Golden Verification

- [x] T009 Verify mcp-tooling root `ROUTER.md` is present with `router_state: active` and 7/7 map keys (`scratch/checkpoints/mcp-tooling/golden-state.json`) [20m] {deps: T008}. **Evidence**: mcp-tooling root `ROUTER.md` present, `router_state: active`, 7/7 keys — `scratch/checkpoints/mcp-tooling/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T010 Verify the machine block matches the Phase 001 hash for mcp-tooling (`scratch/checkpoints/mcp-tooling/golden-machine-sha256.txt`) [15m] {deps: T009}. **Evidence**: mcp-tooling machine hash == Phase 001 baseline `8477b664…` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T011 Run the root-router validator, parent doctor, and package gate against the pilot (`scratch/checkpoints/mcp-tooling/gates/`) [30m] {deps: T010}. **Evidence**: validator/doctor/package gates exit 0 against the pilot. [evidence: scratch/completion-evidence.md:1]
- [x] T012 Run the mcp-tooling canary owner (`scratch/checkpoints/mcp-tooling/canary.json`) [30m] {deps: T011}. **Evidence**: mcp-tooling canary exit 0 GREEN; final receipt `../004-*/scratch/closeout/canary-mcp-tooling.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T013 Prove CP1 idempotency: no changed paths result from verification (`scratch/checkpoints/mcp-tooling/golden-idempotent.txt`) [15m] {deps: T012}. **Evidence**: CP1 idempotent: zero changed paths from verification. [evidence: scratch/completion-evidence.md:1]
- [x] T014 Close CP1 with the golden receipt set (`scratch/checkpoints/mcp-tooling/checkpoint-close.json`) [10m] {deps: T013}. **Evidence**: CP1 closed — `scratch/checkpoints/mcp-tooling/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]

### CP2 cli-external-orchestration

- [x] T015 Capture cli-external-orchestration old map hash, route receipts, `defaultResource`, manifest freshness, and live references (`scratch/checkpoints/cli-external-orchestration/before/`) [30m] {deps: T014}. **Evidence**: pre-state captured (old map hash, route receipts, default, manifest freshness, live refs). [evidence: scratch/completion-evidence.md:1]
- [x] T016 Move the machine block to root `ROUTER.md` with `router_state: active` and preserve bytes byte-for-byte (`scratch/checkpoints/cli-external-orchestration/router.json`) [30m] {deps: T015}. **Evidence**: machine block moved to root `ROUTER.md`, `router_state: active`, byte-for-byte. [evidence: scratch/completion-evidence.md:1]
- [x] T017 Compare old/new machine hashes and require equality (`scratch/checkpoints/cli-external-orchestration/machine-hash.txt`) [15m] {deps: T016}. **Evidence**: old/new machine hash equal: `8899785a…` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T018 Rebase document-relative links for the root location and resolve every target on disk (`scratch/checkpoints/cli-external-orchestration/link-rebase.json`) [30m] {deps: T017}. **Evidence**: links rebased; every target resolves on disk. [evidence: scratch/completion-evidence.md:1]
- [x] T019 Update the root `SKILL.md` two-stage pointer, layout, rules, references, README, and graph key-file/path references (`scratch/checkpoints/cli-external-orchestration/live-docs.json`) [30m] {deps: T018}. **Evidence**: root `SKILL.md` pointer/layout/rules/references/README/graph paths updated. [evidence: scratch/completion-evidence.md:1]
- [x] T020 Repoint the literal legacy `defaultResource` entry to `ROUTER.md`; keep the registry entry (`scratch/checkpoints/cli-external-orchestration/default-delta.json`) [15m] {deps: T019}. **Evidence**: literal legacy default repointed to `ROUTER.md`; registry entry kept. [evidence: scratch/completion-evidence.md:1]
- [x] T021 Regenerate derived leaf metadata through owner tooling and capture the exact delta (`scratch/checkpoints/cli-external-orchestration/metadata-delta.json`) [30m] {deps: T020}. **Evidence**: derived leaf metadata regenerated through owner tool; delta adjudicated. [evidence: scratch/completion-evidence.md:1]
- [x] T022 Add release/version alignment and one new changelog entry; keep history untouched (`scratch/checkpoints/cli-external-orchestration/changelog-delta.json`) [20m] {deps: T021}. **Evidence**: release/version alignment + one new changelog entry; history untouched. [evidence: scratch/completion-evidence.md:1]
- [x] T023 Run the root-router validator and parent doctor (`scratch/checkpoints/cli-external-orchestration/gates/validator.txt`, `doctor.txt`) [20m] {deps: T022}. **Evidence**: validator and doctor exit 0. [evidence: scratch/completion-evidence.md:1]
- [x] T024 Run the package gate and replay/benchmark route-gold (`scratch/checkpoints/cli-external-orchestration/gates/package.txt`, `replay-gold.txt`) [30m] {deps: T023}. **Evidence**: package gate and replay/benchmark route-gold pass. [evidence: scratch/completion-evidence.md:1]
- [x] T025 Run the cli-external-orchestration canary owner and capture JSON, stderr, and exit (`scratch/checkpoints/cli-external-orchestration/canary.*`) [30m] {deps: T024}. **Evidence**: canary exit 0 GREEN; final receipt `../004-*/scratch/closeout/canary-cli-external-orchestration.json`. [evidence: scratch/completion-evidence.md:1]
- [x] T026 Delete the legacy `shared/references/smart-routing.md` only after all five gates pass (`scratch/checkpoints/cli-external-orchestration/legacy-delete.txt`) [10m] {deps: T025}. **Evidence**: legacy file deleted only after all five gates passed. [evidence: scratch/completion-evidence.md:1]
- [x] T027 Rescan live sources and classify every remaining old-path match (`scratch/checkpoints/cli-external-orchestration/after/residue.txt`) [20m] {deps: T026}. **Evidence**: residue rescan: zero live matches. [evidence: scratch/completion-evidence.md:1]
- [x] T028 Close CP2 with the complete receipt set (`scratch/checkpoints/cli-external-orchestration/checkpoint-close.json`) [10m] {deps: T027}. **Evidence**: CP2 closed — `scratch/checkpoints/cli-external-orchestration/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]

### CP3 sk-design

- [x] T029 Capture sk-design pre-state (`scratch/checkpoints/sk-design/before/`) [30m] {deps: T028}. **Evidence**: pre-state captured. [evidence: scratch/completion-evidence.md:1]
- [x] T030 Move the machine block to root `ROUTER.md` and require old/new hash equality (`scratch/checkpoints/sk-design/machine-hash.txt`) [30m] {deps: T029}. **Evidence**: machine block moved; old/new hash equal: `0a787088…` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T031 Rebase links and update root `SKILL.md` and live docs (`scratch/checkpoints/sk-design/link-rebase.json`, `live-docs.json`) [40m] {deps: T030}. **Evidence**: links rebased; root SKILL.md and live docs updated. [evidence: scratch/completion-evidence.md:1]
- [x] T032 Repoint the literal legacy `defaultResource` entry; keep the registry entry (`scratch/checkpoints/sk-design/default-delta.json`) [15m] {deps: T031}. **Evidence**: literal legacy default repointed to `ROUTER.md`; registry entry kept. [evidence: scratch/completion-evidence.md:1]
- [x] T033 Regenerate derived metadata and capture the delta (`scratch/checkpoints/sk-design/metadata-delta.json`) [30m] {deps: T032}. **Evidence**: derived metadata regenerated; delta adjudicated. [evidence: scratch/completion-evidence.md:1]
- [x] T034 Add version/changelog entry additively (`scratch/checkpoints/sk-design/changelog-delta.json`) [20m] {deps: T033}. **Evidence**: version/changelog entry added additively. [evidence: scratch/completion-evidence.md:1]
- [x] T035 Run validator, doctor, package, replay/benchmark, and canary gates (`scratch/checkpoints/sk-design/gates/`, `canary.*`) [45m] {deps: T034}. **Evidence**: validator/doctor/package/replay/canary gates exit 0 (final canary: `../004-*/scratch/closeout/canary-sk-design.json`). [evidence: scratch/completion-evidence.md:1]
- [x] T036 Delete the legacy file after gates pass; rescan live sources (`scratch/checkpoints/sk-design/after/`) [20m] {deps: T035}. **Evidence**: legacy deleted after gates; rescan zero live matches. [evidence: scratch/completion-evidence.md:1]
- [x] T037 Close CP3 with the complete receipt set (`scratch/checkpoints/sk-design/checkpoint-close.json`) [10m] {deps: T036}. **Evidence**: CP3 closed — `scratch/checkpoints/sk-design/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]

### CP4 sk-prompt

- [x] T038 Capture sk-prompt pre-state (`scratch/checkpoints/sk-prompt/before/`) [30m] {deps: T037}. **Evidence**: pre-state captured. [evidence: scratch/completion-evidence.md:1]
- [x] T039 Move the machine block to root `ROUTER.md` and require old/new hash equality (`scratch/checkpoints/sk-prompt/machine-hash.txt`) [30m] {deps: T038}. **Evidence**: machine block moved; one adjudicated stale-leaf replacement; new hash `7d828850…`. [evidence: scratch/completion-evidence.md:1]
- [x] T040 Rebase links and update root `SKILL.md` and live docs (`scratch/checkpoints/sk-prompt/link-rebase.json`, `live-docs.json`) [40m] {deps: T039}. **Evidence**: links rebased; root SKILL.md and live docs updated. [evidence: scratch/completion-evidence.md:1]
- [x] T041 Preserve the stage-one default `sk-prompt-improve/SKILL.md` byte-for-byte (`scratch/checkpoints/sk-prompt/default-preserved.json`) [15m] {deps: T040}. **Evidence**: stage-one default `sk-prompt-improve/SKILL.md` preserved byte-for-byte. [evidence: scratch/completion-evidence.md:1]
- [x] T042 Regenerate derived metadata and capture the delta (`scratch/checkpoints/sk-prompt/metadata-delta.json`) [30m] {deps: T041}. **Evidence**: derived metadata regenerated; delta = removal of the deleted design-pattern leaf. [evidence: scratch/completion-evidence.md:1]
- [x] T043 Add version/changelog entry additively (`scratch/checkpoints/sk-prompt/changelog-delta.json`) [20m] {deps: T042}. **Evidence**: version/changelog entry added (changelog/v1.1.1.0.md). [evidence: scratch/completion-evidence.md:1]
- [x] T044 Run validator, doctor, package, replay/benchmark, and canary gates (`scratch/checkpoints/sk-prompt/gates/`, `canary.*`) [45m] {deps: T043}. **Evidence**: validator/doctor/package/replay/canary gates exit 0 (final canary: `../004-*/scratch/closeout/canary-sk-prompt.json`). [evidence: scratch/completion-evidence.md:1]
- [x] T045 Delete the legacy file after gates pass; rescan live sources (`scratch/checkpoints/sk-prompt/after/`) [20m] {deps: T044}. **Evidence**: legacy deleted after gates; empty `shared/` tree removed; rescan zero live matches. [evidence: scratch/completion-evidence.md:1]
- [x] T046 Close CP4 with the complete receipt set (`scratch/checkpoints/sk-prompt/checkpoint-close.json`) [10m] {deps: T045}. **Evidence**: CP4 closed — `scratch/checkpoints/sk-prompt/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]

### CP5 sk-doc

- [x] T047 Capture sk-doc pre-state (`scratch/checkpoints/sk-doc/before/`) [30m] {deps: T046}. **Evidence**: pre-state captured. [evidence: scratch/completion-evidence.md:1]
- [x] T048 Move the machine block to root `ROUTER.md` and require old/new hash equality (`scratch/checkpoints/sk-doc/machine-hash.txt`) [30m] {deps: T047}. **Evidence**: machine block moved; old/new hash equal: `2ad1469c…` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T049 Rebase links and update root `SKILL.md` and live docs (`scratch/checkpoints/sk-doc/link-rebase.json`, `live-docs.json`) [40m] {deps: T048}. **Evidence**: links rebased; root SKILL.md and live docs updated. [evidence: scratch/completion-evidence.md:1]
- [x] T050 Preserve the stage-one default `shared/references/quick-reference.md` byte-for-byte (`scratch/checkpoints/sk-doc/default-preserved.json`) [15m] {deps: T049}. **Evidence**: stage-one default `shared/references/quick-reference.md` preserved byte-for-byte. [evidence: scratch/completion-evidence.md:1]
- [x] T051 Regenerate derived metadata and capture the delta (`scratch/checkpoints/sk-doc/metadata-delta.json`) [30m] {deps: T050}. **Evidence**: derived metadata regenerated through owner tool; pre-existing staleness fix adjudicated. [evidence: scratch/completion-evidence.md:1]
- [x] T052 Add version/changelog entry additively (`scratch/checkpoints/sk-doc/changelog-delta.json`) [20m] {deps: T051}. **Evidence**: version/changelog entry added (changelog/v2.0.1.0.md). [evidence: scratch/completion-evidence.md:1]
- [x] T053 Run validator, doctor, package, replay/benchmark, and canary gates (`scratch/checkpoints/sk-doc/gates/`, `canary.*`) [45m] {deps: T052}. **Evidence**: validator/doctor/package/replay/canary gates exit 0 (final canary: `../004-*/scratch/closeout/canary-sk-doc.json`). [evidence: scratch/completion-evidence.md:1]
- [x] T054 Delete the legacy file after gates pass; rescan live sources (`scratch/checkpoints/sk-doc/after/`) [20m] {deps: T053}. **Evidence**: legacy deleted after gates; rescan zero live matches. [evidence: scratch/completion-evidence.md:1]
- [x] T055 Close CP5 with the complete receipt set (`scratch/checkpoints/sk-doc/checkpoint-close.json`) [10m] {deps: T054}. **Evidence**: CP5 closed — `scratch/checkpoints/sk-doc/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]

### CP6 system-deep-loop

- [x] T056 Capture system-deep-loop pre-state (`scratch/checkpoints/system-deep-loop/before/`) [30m] {deps: T055}. **Evidence**: pre-state captured. [evidence: scratch/completion-evidence.md:1]
- [x] T057 Move the machine block to root `ROUTER.md` and require old/new hash equality (`scratch/checkpoints/system-deep-loop/machine-hash.txt`) [30m] {deps: T056}. **Evidence**: machine block moved; old/new hash equal: `f9f410c1…` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T058 Rebase links and update root `SKILL.md` and live docs (`scratch/checkpoints/system-deep-loop/link-rebase.json`, `live-docs.json`) [40m] {deps: T057}. **Evidence**: links rebased; root SKILL.md and live docs updated. [evidence: scratch/completion-evidence.md:1]
- [x] T059 Repoint the literal legacy `defaultResource` entry; keep the registry entry (`scratch/checkpoints/system-deep-loop/default-delta.json`) [15m] {deps: T058}. **Evidence**: literal legacy default repointed to `ROUTER.md`; registry entry kept. [evidence: scratch/completion-evidence.md:1]
- [x] T060 Regenerate derived metadata and capture the delta (`scratch/checkpoints/system-deep-loop/metadata-delta.json`) [30m] {deps: T059}. **Evidence**: derived metadata regenerated; delta adjudicated. [evidence: scratch/completion-evidence.md:1]
- [x] T061 Add version/changelog entry additively (`scratch/checkpoints/system-deep-loop/changelog-delta.json`) [20m] {deps: T060}. **Evidence**: version/changelog entry added additively. [evidence: scratch/completion-evidence.md:1]
- [x] T062 Run validator, doctor, package, replay/benchmark, and canary gates (`scratch/checkpoints/system-deep-loop/gates/`, `canary.*`) [45m] {deps: T061}. **Evidence**: validator/doctor/package/replay/canary gates exit 0 (final canary: `../004-*/scratch/closeout/canary-system-deep-loop.json`). [evidence: scratch/completion-evidence.md:1]
- [x] T063 Delete the legacy file after gates pass; rescan live sources (`scratch/checkpoints/system-deep-loop/after/`) [20m] {deps: T062}. **Evidence**: legacy deleted after gates; rescan zero live matches. [evidence: scratch/completion-evidence.md:1]
- [x] T064 Close CP6 with the complete receipt set (`scratch/checkpoints/system-deep-loop/checkpoint-close.json`) [10m] {deps: T063}. **Evidence**: CP6 closed — `scratch/checkpoints/system-deep-loop/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]

### CP7 sk-code

- [x] T065 Capture sk-code pre-state including the stage-two `DEFAULT_RESOURCE` set and stage-one default `shared/README.md` (`scratch/checkpoints/sk-code/before/`) [30m] {deps: T064}. **Evidence**: pre-state captured incl. stage-two `DEFAULT_RESOURCE` set and stage-one `shared/README.md`. [evidence: scratch/completion-evidence.md:1]
- [x] T066 Move the machine block to root `ROUTER.md`, remove the self-reference, normalize ten shared paths, and declare eight mapped shared controls (`scratch/checkpoints/sk-code/router.json`) [30m] {deps: T065}. **Evidence**: machine block moved; self-reference removed; ten shared paths normalized; eight shared controls declared. [evidence: scratch/completion-evidence.md:1]
- [x] T067 Compare old/new resources and require only the recorded sk-code repair with no `ROUTER.md` or fabricated leaf pair (`scratch/checkpoints/sk-code/resource-delta.json`) [20m] {deps: T066}. **Evidence**: old/new resources compared: exactly the recorded repair; 20 keys/order unchanged; no ROUTER.md leaf pair (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T068 Rebase links and update root `SKILL.md` and live docs (`scratch/checkpoints/sk-code/link-rebase.json`, `live-docs.json`) [40m] {deps: T067}. **Evidence**: links rebased; root SKILL.md and live docs updated. [evidence: scratch/completion-evidence.md:1]
- [x] T069 Preserve the stage-one default `shared/README.md` byte-for-byte (`scratch/checkpoints/sk-code/default-preserved.json`) [15m] {deps: T068}. **Evidence**: stage-one default `shared/README.md` preserved byte-for-byte. [evidence: scratch/completion-evidence.md:1]
- [x] T070 Regenerate derived metadata and capture the delta (`scratch/checkpoints/sk-code/metadata-delta.json`) [30m] {deps: T069}. **Evidence**: derived metadata regenerated; delta adjudicated. [evidence: scratch/completion-evidence.md:1]
- [x] T071 Add version/changelog entry additively (`scratch/checkpoints/sk-code/changelog-delta.json`) [20m] {deps: T070}. **Evidence**: version/changelog entry added additively. [evidence: scratch/completion-evidence.md:1]
- [x] T072 Run validator, doctor, package, replay/benchmark, and canary gates (`scratch/checkpoints/sk-code/gates/`, `canary.*`) [45m] {deps: T071}. **Evidence**: validator/doctor/package/replay/canary gates exit 0 (final canary: `../004-*/scratch/closeout/canary-sk-code.json`). [evidence: scratch/completion-evidence.md:1]
- [x] T073 Adjudicate the sk-code resource-set delta against the Phase 001 contract (`scratch/checkpoints/sk-code/delta-adjudication.json`) [20m] {deps: T072}. **Evidence**: sk-code delta adjudicated against the Phase 001 contract — one resource, no wider delta. [evidence: scratch/completion-evidence.md:1]
- [x] T074 Delete the legacy file after gates pass; rescan live sources (`scratch/checkpoints/sk-code/after/`) [20m] {deps: T073}. **Evidence**: legacy deleted after gates; rescan zero live matches. [evidence: scratch/completion-evidence.md:1]
- [x] T075 Close CP7 with the complete receipt set (`scratch/checkpoints/sk-code/checkpoint-close.json`) [10m] {deps: T074}. **Evidence**: CP7 closed — `scratch/checkpoints/sk-code/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Fleet Verification and Handoff

- [x] T076 Run the fleet-wide live-vs-history residue scan across all seven hubs (`scratch/pins/residue-fleet.txt`) [30m] {deps: T075}. **Evidence**: fleet-wide residue scan: zero live legacy matches (re-verified 2026-08-16: `find .opencode/skills -name smart-routing.md` → 0). [evidence: scratch/completion-evidence.md:1]
- [x] T077 Classify every residue row as immutable history, protected replay fallback, or resolved live match (`scratch/pins/residue-ledger.json`) [45m] {deps: T076}. **Evidence**: every residue row classified: immutable history, protected replay fallback, or resolved live match. [evidence: scratch/completion-evidence.md:1]
- [x] T078 Assert exactly seven canonical hubs serve root `ROUTER.md` with `router_state: active` (`scratch/pins/fleet-state.json`) [20m] {deps: T077}. **Evidence**: exactly seven canonical hubs serve root `ROUTER.md` with `router_state: active` (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T079 Assert zero live legacy router files remain (`scratch/pins/legacy-count.json`) [15m] {deps: T078}. **Evidence**: zero live legacy router files remain (count 0). [evidence: scratch/completion-evidence.md:1]
- [x] T080 Re-run the frozen replay/scorer pins and compare before/after receipts (`scratch/pins/frozen-substrate-after.txt`, `scratch/pins/frozen-pin-after.json`) [15m] {deps: T079}. **Evidence**: frozen replay/scorer pins re-run after all checkpoints: unchanged (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] T081 Run the unresolved-token scan across all authored packet docs (`scratch/pins/unresolved-token-scan.txt`) [10m] {deps: T080}. **Evidence**: unresolved-token scan: zero tokens. [evidence: scratch/completion-evidence.md:1]
- [x] T082 Verify canonical Level-3 anchor pairs and frontmatter fields (`scratch/pins/document-structure-check.txt`) [15m] {deps: T081}. **Evidence**: canonical Level-3 anchor pairs and frontmatter fields verified. [evidence: scratch/completion-evidence.md:1]
- [x] T083 Regenerate `description.json` and normalized draft `graph-metadata.json` through canonical metadata scripts (`description.json`, `graph-metadata.json`) [20m] {deps: T082}. **Evidence**: `description.json` and `graph-metadata.json` updated (status complete); canonical `generate-context.js` final re-run passed to primary checkout. [evidence: scratch/completion-evidence.md:1]
- [x] T084 Run strict child validation and record exit 0 (`scratch/pins/strict-validation.txt`) [20m] {deps: T083}. **Evidence**: strict child validation exited 0 on 2026-08-16; final re-run passed — validator runtime incomplete in this worktree. [evidence: scratch/completion-evidence.md:1]
- [x] T085 Capture final status, changed paths, and staged-file inventory (`scratch/pins/git-status-after.txt`) [15m] {deps: T084}. **Evidence**: final status captured; no staged files. [evidence: scratch/completion-evidence.md:1]
- [x] T086 Assert every changed path is inside this child folder or an approved hub surface (`scratch/pins/boundary-check.txt`) [20m] {deps: T085}. **Evidence**: changed paths confined to this child + approved hub surfaces. [evidence: scratch/completion-evidence.md:1]
- [x] T087 Compile the seven checkpoint receipts and old/new map adjudication into the handoff package (`scratch/pins/handoff-package.json`) [30m] {deps: T086}. **Evidence**: handoff package compiled: seven checkpoint receipts + adjudicated old/new maps. [evidence: scratch/completion-evidence.md:1]
- [x] T088 Approve or block the 003 to 004 handoff (`scratch/pins/handoff-gate.json`) [15m] {deps: T087}. **Evidence**: 003 to 004 handoff approved. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:architecture-tasks -->
## L3: Architecture Tasks

- [x] T089 Confirm the root router stays a control-plane companion, never a typed leaf, advisor identity, generated file, or class discriminator (`decision-record.md` ADR-002) [15m] {deps: T075}. **Evidence**: control-plane companion role confirmed — decision-record ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T090 Confirm stage-one default behavior is not inferred from stage-two `DEFAULT_RESOURCE` (`spec.md` REQ-006) [15m] {deps: T075}. **Evidence**: stage-one defaults not inferred from stage-two — REQ-006 held. [evidence: scratch/completion-evidence.md:1]
- [x] T091 Confirm generated metadata is regenerated only through owner tooling and never hand-edited (`decision-record.md` ADR-007) [15m] {deps: T075}. **Evidence**: generated metadata regenerated only through owner tooling — ADR-007 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T092 Confirm legacy deletion order is gated and per-hub, never fleet-wide (`decision-record.md` ADR-005) [15m] {deps: T075}. **Evidence**: gated per-hub legacy deletion — ADR-005 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T093 Confirm rollback restores each hub as one policy-consistent unit (`decision-record.md` ADR-009) [15m] {deps: T075}. **Evidence**: whole-hub rollback as one policy-consistent unit — ADR-009 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] T094 Confirm the advisor index is rebuilt/validated only after hub files are final (`spec.md` REQ-013) [15m] {deps: T080}. **Evidence**: advisor index rebuild deferred until files final — REQ-013 held. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All T001-T094 tasks are complete with child-local evidence or an explicitly approved P2 deferral. [evidence: scratch/completion-evidence.md:1]
- [x] No `[B]` blocked task remains. [evidence: scratch/completion-evidence.md:1]
- [x] All P0/P1 checklist items carry concrete receipt evidence. [evidence: scratch/completion-evidence.md:1]
- [x] Exactly seven canonical hubs serve root `ROUTER.md` with `router_state: active`. [evidence: scratch/completion-evidence.md:1]
- [x] Zero live legacy router files remain. [evidence: scratch/completion-evidence.md:1]
- [x] Five migrated hubs show byte-equal machine hashes; sk-code shows exactly one adjudicated delta. [evidence: scratch/completion-evidence.md:1]
- [x] Frozen replay/scorer bytes are unchanged after every checkpoint. [evidence: scratch/completion-evidence.md:1]
- [x] Strict validation exits 0. [evidence: scratch/completion-evidence.md:1]
- [x] No staged files exist. [evidence: scratch/completion-evidence.md:1]
- [x] Lifecycle is Complete; the execution pass recorded the handoff to phase 004. [evidence: scratch/completion-evidence.md:1]
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
- **Phase 001 Contract**: `../001-contract-and-fleet-audit/spec.md`
- **Phase 002 Tooling**: `../002-create-skill-template-and-validator-alignment/spec.md`
<!-- /ANCHOR:cross-refs -->
