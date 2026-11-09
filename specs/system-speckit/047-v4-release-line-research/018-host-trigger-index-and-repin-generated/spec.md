---
title: "Feature Specification: Phase 18: host-trigger-index-and-repin-generated"
description: "In a host repository that vendors Skilled, the Gate 1 lookup and the trigger index generator default to Skilled's packaged index, so Gate 1 never sees the host's packets and the host overwrites Skilled's generated retrieval files, which a re-pin then refuses. This phase makes both default to the host index and proves the re-pin refusal goes away."
trigger_phrases:
  - "host trigger index and repin generated"
  - "phase 18 host trigger index and repin generated"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: host-trigger-index-and-repin-generated

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-09 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 19 |
| **Predecessor** | 017-over-engineering-cuts |
| **Successor** | 019-template-marker-upgrade-and-staleness-scope |
| **Handoff Criteria** | Host lookup finds a host packet; Skilled reads its own index; staged re-pin prints no refuse line for the four retrieval files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the v4 release line remediation specification.

**Scope Boundary**: Items 1 and 2 of the operator's Barter handover: the host trigger index default, and the re-pin refusal of Skilled's generated retrieval files.

**Dependencies**:
- Barter's checkout at `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit` is read-only; anything that writes runs on a copy under the session temp folder.

**Deliverables**:
- Lookup and generator defaults that pick the host index in a host and the packaged index in Skilled.
- A staged re-pin over a copy with no `refuse:` line for the four retrieval files.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`lookup-trigger-index.mjs` fixes `DEFAULT_INDEX_PATH` relative to the script, so from a host root the AGENTS.md Gate 1 command reads Skilled's packaged index and misses every host packet. Barter works around it by regenerating the packaged index and its three fixtures for its own corpus, and the next re-pin refuses those four files as unowned and different from the old pin.

### Purpose
Gate 1 finds host packets with the shipped command, and a host never needs to touch Skilled's packaged retrieval files.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd barter/ai-speckit && node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --scoring-only -- "media player architecture refactor"
index      : db966147acd3d5af727cfe5740fce29a5189231fe209de8436cae632772d438d
(no host packet in the candidates)

$ ... --index .speckit-index/trigger-index.json --scoring-only -- "media player architecture refactor"
index      : b496a5e7842164e6892f3078c17ee737e14a891711cb1ceb7640294276ea80b4
(finds specs/fe-partners-app/media/003-media-player-architecture/spec.md)

$ cat specs/skilled-barter-overlays/.../042-repin-b9a1728984/scratch/evidence/v4020-stage-1-refused.txt
refuse: unowned .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json differs from the old pin (different bytes)
refuse: unowned .../fixtures/generation-diagnostics.json differs from the old pin (different bytes)
refuse: unowned .../fixtures/phrase-variants.json differs from the old pin (different bytes)
refuse: unowned .skilled/skills/system-spec-kit/runtime/data/trigger-index.json differs from the old pin (different bytes)
RESULT: FAILED
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lookup default: with no `--index`, read `<repo root>/.speckit-index/trigger-index.json` when the caller's repository is a host; otherwise the packaged index.
- Generator default: in a host, index the caller's repository and write to `.speckit-index/` by default, sidecars beside it; `--check` reads the same default.
- Update the docs that say nothing selects the host index (`runtime/data/README.md`, `references/structure/folder-structure.md`).
- Prove item 2 moot with a staged re-pin on a temporary copy of Barter.

### Out of Scope
- Editing Barter's checkout or its runbook - read-only for this phase; its runbook change is listed for the operator.
- An overlay-engine `generated` marker - not needed once the host stops writing the packaged files (decision record).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modify | Host index default |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modify | Host repo root and output default |
| A shared host-detection helper under `runtime/cli/retrieval/lib/` | Create | One rule for both scripts |
| `runtime/data/README.md`, `references/structure/folder-structure.md` | Modify | Host mode text |
| Tests beside each | Modify | Host and own-repo cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | From a host root, the lookup with no `--index` finds a host packet; in Skilled's own repository it still reads the packaged index. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | In a host, the generator with no `--out` writes `.speckit-index/trigger-index.json` over the host corpus and leaves the packaged files untouched. |
| REQ-003 | A staged re-pin over a copy whose packaged retrieval files were never regenerated prints no `refuse:` line for the four files. |
| REQ-004 | The retrieval test files and the cli vitest project keep every baseline pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The AGENTS.md Gate 1 command works unchanged in a host.
- **SC-002**: A host re-pin no longer needs the reset-and-restore step for the four retrieval files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Skilled's own repo misdetected as a host | High | Host only when `.speckit-index/` exists or the root's `.skilled` resolves outside the root; a test pins Skilled's own reading |
| Risk | CI rebuild workflow writes elsewhere | Med | Skilled is never a host, so its defaults do not move |
| Dependency | Barter copy size (9 GB) | Slow staging | Copy only what the overlay engine reads |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Host detection adds one `git rev-parse` and two stat calls per run.

### Security
- **NFR-S01**: The lookup never reads an index outside the caller's repository root unless `--index` names it.

### Reliability
- **NFR-R01**: An explicit `--index` or `--out` always wins over the default.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a host with no `.speckit-index/` yet; the lookup falls back to the packaged index and says so.
- Maximum input: Barter's full corpus.
- Failure path: cwd outside any git repository uses the packaged index.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two scripts, one helper, two docs |
| Risk | 16/25 | Gate 1 runs every turn in every repo |
| Research | 6/20 | Handover plus a read-only repro |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The host rule and the item 2 decision are in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
