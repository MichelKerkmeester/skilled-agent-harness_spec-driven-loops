---
title: "Feature Specification: Phase 1: trigger-index-freshness"
description: "The committed trigger index is stale, its phrase-quality bucket can never carry one of its seven classes, and the retrieval lane's own documents describe paths that no longer exist. This phase plans the regeneration and the corrections that make the doctor's verdicts evidence-backed."
trigger_phrases:
  - "trigger index freshness"
  - "stale trigger index"
  - "retrieval conventions symlink"
  - "ripgrep version pin"
  - "byte-identical regeneration"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: trigger-index-freshness

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The trigger index at `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` no longer matches the corpus it indexes, and the doctor that diagnoses it can only see the drift through file mtimes. This phase regenerates the committed index and its three sidecars through `/doctor:rebuild`, makes the `folder-token-fallback` phrase class reachable at generation so one phrase stops getting two labels, and corrects the retrieval lane's own claims about symlinks, versions and the acceptance packet's paths.

**Key Decisions**: Regeneration runs through `/doctor:rebuild`, never from the read-only doctor; `folder-token-fallback` becomes reachable by sharing the validator's `packetFolderTokens` derivation; the doctor's staleness verdict uses `generate-trigger-index.mjs --check --json` with mtime demoted to supporting evidence.

**Critical Dependencies**: The `/doctor:rebuild` orchestrator and the generator's scratch-build contract; `route-validate.sh` parity across the manifest, the router and the presentation; the retrieval parity vitest suite.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-03 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-release-update-customization-signals |
| **Handoff Criteria** | Every acceptance criterion is Met, Waived or Superseded, and the regenerated index reports fresh |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Fix the spec-kit defects the doctor command audit recorded specification.

**Scope Boundary**: The retrieval lane's committed artifacts (index and three sidecars), the generator's phrase-quality path, the doctor's `speckit-retrieval` workflow asset, `retrieval-conventions.md`, the retrieval `README.md`, and the acceptance packet's continuity block. No other subsystem's files are touched.

**Dependencies**:
- `/doctor:rebuild` runs the generator over the whole corpus in one pass; the doctor itself never writes the index.
- `bash .skilled/commands/doctor/scripts/route-validate.sh` must stay green after the doctor asset changes.
- The retrieval vitest suites must stay green after the conventions and corpus changes.

**Deliverables**:
- A fresh committed index plus the three generator-written sidecars, all four carrying the same `manifestHash`.
- A `folder-token-fallback` class that can appear in `generation-diagnostics.json`, with a test proving it.
- The evidence-backed staleness activity in `doctor-speckit-retrieval.yaml`, with mtime reported as supporting evidence.
- Corrected retrieval documents and the acceptance packet's continuity paths, plus a re-tested ripgrep version pin and a named owner for the byte-identical proof.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`generate-trigger-index.mjs --check --json` exits 1 on this checkout: the committed index is stale (176 documents differ, 175 indexed paths are missing, 23,052 documents scanned in the planning run) and the corpus manifest hash has moved past the index's. The doctor's own staleness signal is mtime-based and fired on checkout noise in the audit, so the doctor is right about the content only by accident. Separately, the phrase judge's `folder-token-fallback` class is unreachable at generation because `generate-trigger-index.mjs:260` calls `judgeTriggerPhrase(normalized)` with no folder context, while the per-document validator passes folder tokens at `check-grep-convention-helper.mjs:187`; the committed bucket therefore has six classes where `README.md:93` promises the class list. Four documents then describe a tree that is not there: `retrieval-conventions.md` §9 and `README.md:94` both name symlinks that were deleted, the conventions pin ripgrep 14.1.1 while this host runs 15.2.0, and the acceptance packet's continuity block lists `.opencode/skills/system-spec-kit/scripts|data` paths that no longer exist.

### Purpose
Leave the committed index fresh, its diagnostics honest about which phrase classes they can carry, and the retrieval lane's documents and version pins matched to the tree and host the doctor actually runs on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerate `trigger-index.json` and `fixtures/corpus-manifest.json`, `fixtures/generation-diagnostics.json`, `fixtures/phrase-variants.json` through `/doctor:rebuild`.
- Make `folder-token-fallback` reachable at generation and prove it with a test, keeping the committed diagnostics schema unchanged unless a bump is required.
- Add the `generate-trigger-index.mjs --check --json` activity to the doctor's phase 0 and report mtime as supporting evidence in phase 1.
- Correct `retrieval-conventions.md` §9 root coverage and §2.5/§4 ripgrep pins; correct `runtime/cli/retrieval/README.md:94`; correct the acceptance packet's continuity `key_files`.
- Name `/doctor:rebuild` as the owner of the `index_regenerates_byte_identical` proof.

### Out of Scope
- Fixing the frozen acceptance fixtures' pinned snapshot hash or `ripgrepVersion` — `README.md:79` declares them captured snapshots whose mismatch is not a staleness signal.
- Changing the index schema, the lookup ranking or the ripgrep recipe semantics.
- Making the doctor regenerate anything: its mutation boundary stays report-and-state-log only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | Fresh index over the current corpus |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | Regenerate | Sidecar 1 of the same generator run |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | Regenerate | Sidecar 2; carries the `phraseQuality` bucket |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | Regenerate | Sidecar 3 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modify | Judge each phrase with the folder tokens of its owning documents |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Modify | Cover a folder-token phrase in the bucket |
| `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modify | Add the `--check` activity; demote mtime; update the policy comment |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | §9 root row; §2.5 and §4 version pins |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Remove the `CLAUDE.md` symlink claim; keep the bucket promise accurate |
| `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md` | Modify | Continuity `key_files` name the live tree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The committed trigger index and its three sidecars are regenerated from the current corpus through `/doctor:rebuild`, and all four artifacts carry one `manifestHash` |
| REQ-002 | `folder-token-fallback` is reachable at generation: the generator judges each phrase with the folder tokens of the documents that own it, reusing `packetFolderTokens`, and a test proves the class appears |
| REQ-003 | The doctor's `speckit-retrieval` phase 0 runs `generate-trigger-index.mjs --check --json` as its staleness evidence, and phase 1 reports the mtime sample as supporting evidence rather than as the verdict |
| REQ-004 | `retrieval-conventions.md` §9 stops asserting a `.opencode/specs` symlink that is absent in this checkout, and the retrieval parity suite stays green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `runtime/cli/retrieval/README.md:94` says Claude reads the root `AGENTS.md` directly, matching `sync-gate1-pointers.cjs:7` |
| REQ-006 | The acceptance packet's continuity `key_files` name the live `.skilled/skills/system-spec-kit/runtime/{cli/retrieval,data}` paths |
| REQ-007 | The conventions' ripgrep version pins are re-tested against the host version and updated, leaving the frozen fixtures untouched |
| REQ-008 | `doctor-speckit-retrieval.yaml` names `/doctor:rebuild` as the owner of the byte-identical regeneration proof |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` exits 0 and reports `fresh: true` with zero stale documents and zero missing documents.
- **SC-002**: `generation-diagnostics.json` carries a `folder-token-fallback` key when the corpus contains a folder-token phrase, and no phrase is counted as `single-token` by the generator where the per-document validator reports `folder-token-fallback`.
- **SC-003**: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and `rg -n "CLAUDE\.md is a symlink|14\.1\.1"` over the two corrected documents finds no stale claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/doctor:rebuild` orchestrator | The index cannot be regenerated by this phase's build without it | Run its generator leg directly only if the orchestrator blocks, and record the deviation |
| Risk | Regeneration bakes untracked work into the committed index | A later clone indexes documents that are not committed | Regenerate from a clean corpus state or record which untracked paths were indexed |
| Risk | Folder-token judgment changes bucket semantics | Downstream readers of `phraseQuality` misread a class count | State the counting rule in the diagnostics contract and cover it with a test |
| Risk | Convention edits break the parity suite | CI fails on a table the test parses | Edit the table and the test's expected set in the same change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The added `--check` activity costs one corpus walk (17.9 s in the audit, 11.7 s in the planning run); it stays a phase-0 report-only step and never runs per lookup.

### Security
- **NFR-S01**: No new credential, network or write surface; the doctor stays read-only and writes only its report and state log.

### Reliability
- **NFR-R01**: A missing or unreadable index still yields the documented exit classes (2 or higher, never a no-hit), and the added activity degrades to a named signal rather than a crash.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an empty corpus yields an index with zero documents; `--check` exits 0 and the doctor reports `STATUS=MISSING` only when the file itself is absent.
- Maximum length: the corpus walk is unbounded by design; the doctor reports the duration instead of a limit.

### Error Scenarios
- External service failure: none — every step is local file and process work.
- Network timeout: not applicable; the lane has no network call.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 11, LOC: ~120 changed plus regenerated artifacts, Systems: 1 (retrieval lane) |
| Risk | 8/25 | Auth: N, API: N, Breaking: N (schema unchanged) |
| Research | 10/20 | The generator and judge paths were read; the bucket semantics need one design choice |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: `/doctor:rebuild`, parity suite, route validator |
| **Total** | **40/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Regeneration writes a hash that no other checkout can reproduce | M | L | Use the generator's deterministic publish path; compare two runs before committing |
| R-002 | Folder-token change regresses existing single-token counts | M | M | Snapshot the current bucket before the change and diff after |
| R-003 | Version-pin edit invalidates the frozen fixture's meaning | L | L | Leave the fixture; state the policy in the README where it is already stated |

---

## 11. USER STORIES

### US-001: Trustworthy staleness verdict (Priority: P0)

**As an** operator running `/doctor:speckit speckit-retrieval`, **I want** the staleness verdict to come from the generator's content comparison, **so that** a noisy checkout cannot make a stale index look fresh or a fresh index look stale.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: One label per phrase (Priority: P0)

**As a** maintainer reading `generation-diagnostics.json`, **I want** the `folder-token-fallback` class to appear when the corpus carries such a phrase, **so that** the generator and the per-document validator report the same class for the same phrase.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Does a reachable `folder-token-fallback` need a diagnostics `schemaVersion` bump, or can schema 2 absorb a new key? The build decides after reading `artifact.mjs`'s shape assertion.
- Should the mtime sample stay in phase 0 or move to phase 1 as supporting evidence? The build decides with the activity text that keeps both readings reproducible.
- Do the frozen fixtures' `ripgrepVersion` fields get a note or stay untouched? The README's frozen-snapshot policy says untouched; the build confirms.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


