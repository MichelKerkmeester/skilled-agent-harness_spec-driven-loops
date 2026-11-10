---
title: "Feature Specification: Phase 9: dsh-context-guards-and-goal-bridge"
description: "The dsh native goal service reads no packet goal.md, so a dsh session works without the bound packet goal the goal posture rule requires on every runtime. This phase adds goal-context and session-start-context adapters to the repo-guards bundle and ships or defers each later-wave context and git guard with its reason."
trigger_phrases:
  - "dsh context guards and goal bridge"
  - "phase 9 dsh context guards and goal bridge"
  - "dsh goal-context adapter"
  - "dsh packet goal bridge"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: dsh-context-guards-and-goal-bridge

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 15 |
| **Predecessor** | 008-dsh-repo-guards-safety-wave |
| **Successor** | 010-dsh-mcp-code-mode |
| **Handoff Criteria** | The goal-context test shows the injected context equals the `chat_slice` from `goal.cjs packet` with no frontmatter, each optional adapter is shipped or recorded as deferred with its reason and the phase 008 keyless boot still holds with the extended guards patch |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: The second guard wave in the existing `.dsh/plugins/repo-guards/` bundle. `goal-context` and `session-start-context` are required. `prompt-advisor` ships off in the lineage patch. `session-compact-context`, `session-stop-context`, `session-start-advisories`, `git-preflight-advisory`, `git-message-gate` and `decision-capture` are optional, each shipped or recorded as deferred. `session-relaunch` is not ported, because the outer runner owns process restart.

**Dependencies**:
- `008-dsh-repo-guards-safety-wave` for the bundle entry, its error policy table and `.dsh/patches/guards.patch.yml`

**Deliverables**:
- `.dsh/plugins/repo-guards/` adapters for `goal-context` and `session-start-context`, plus each optional adapter that ships, with tests
- `.dsh/patches/guards.patch.yml` extended, `.dsh/SYNC.md` and the packet's `references/guards-and-hooks.md` updated
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The dsh native goal service holds one goal per session and reads no `goal.md`, so a dsh dispatch never sees the bound packet goal. Session-start context and compaction recovery reach Pi through `.pi/extensions/session-start-context.ts` and `session-compact-context.ts`, and nothing carries them to dsh. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/research.md:211]

### Purpose
A dsh session receives the bound packet goal as the exact `chat_slice` that `goal.cjs packet` prints, plus session-start context, through the repo-guards bundle.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .dsh/plugins/repo-guards 2>&1
ls: .dsh/plugins/repo-guards: No such file or directory
$ ls .pi/extensions/goal-context.ts .pi/extensions/session-start-context.ts
.pi/extensions/goal-context.ts
.pi/extensions/session-start-context.ts
$ node .skilled/hooks/goal/bin/goal.cjs packet specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research --workspace "$PWD" | grep -c "^chat_slice="
1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `goal-context` adapter at `agent/pre-step` or system-prompt assembly that resolves the bound packet through `.skilled/hooks/goal/lib/goal-core.cjs` and injects only its `chat_slice`.
- Add a `session-start-context` adapter at `agent/created` that injects the output of the session-prime adapter the Pi extension runs.
- Add `prompt-advisor` at `agent/pre-step`, switched off in the lineage patch because an advisor brief is noise for a fan-out leaf.
- Ship or defer each optional adapter (`session-compact-context` on `compaction/summary`, `session-stop-context` on `agent/disposed`, `session-start-advisories` on `agent/created`, `git-preflight-advisory` and `git-message-gate` on `bash` git calls, `decision-capture`), recording every deferral with its reason.
- Extend `.dsh/patches/guards.patch.yml`, `.dsh/SYNC.md` and the packet's `references/guards-and-hooks.md`.

### Out of Scope
- The eight safety guards - phase 008 owns them and this phase must not change their behavior.
- `mcp-route-guard` - phase 010 owns it.
- `session-relaunch` - not relevant, because a one-shot leaf never relaunches. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/research.md:249]
- Native dsh goal rounds - the lineage patch keeps `goal-round-driver` off, so the bundle is the only goal path.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.dsh/plugins/repo-guards/` (`goal-context`, `session-start-context` adapters) | Create | Required context adapters |
| `.dsh/plugins/repo-guards/` (`prompt-advisor` adapter) | Create | Shipped, off in the lineage patch |
| `.dsh/plugins/repo-guards/` (optional adapters) | Create or defer | Each of the six later-wave guards shipped or recorded as deferred |
| `.dsh/plugins/repo-guards/` (tests) | Create | Goal slice, session-start, compaction and git message fixtures |
| `.dsh/patches/guards.patch.yml` | Modify | Rows for the new adapters |
| `.dsh/patches/lineage.patch.yml` | Modify | `prompt-advisor` off for fan-out leaves |
| `.dsh/SYNC.md` | Modify | Names the new adapters and every deferral |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md` | Modify | Seam map for the second wave |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A test feeds a fixture packet `goal.md` and asserts the context `goal-context` injects holds the `chat_slice` that `node .skilled/hooks/goal/bin/goal.cjs packet <fixture>` prints and none of the frontmatter |
| REQ-002 | A test on an `agent/created` fixture asserts `session-start-context` injects the session-prime output the Pi extension injects for the same workspace |
| REQ-003 | The phase 008 keyless boot criterion still holds with the extended `.dsh/patches/guards.patch.yml`: exit 1, `MISSING_CREDENTIAL` and no failed plugin on stderr |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A test on a `compaction/summary` fixture event asserts packet context is restored, or `session-compact-context` is recorded as deferred with its reason |
| REQ-005 | `git-message-gate`, if shipped, passes the sk-git message-contract fixtures used by `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` |
| REQ-006 | Each optional adapter is either present in `.dsh/plugins/repo-guards/` with a test or named as deferred with a reason in `.dsh/SYNC.md` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The goal-context test passes and its injected text contains no `_memory:` or `packet_pointer` line.
- **SC-002**: The keyless guarded boot with the extended patch exits 1 with `MISSING_CREDENTIAL` as its only error.
- **SC-003**: `rg -c 'deferred' .dsh/SYNC.md` plus the count of shipped optional adapters equals 6.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 008 bundle entry and error policy table | No bundle to extend, so the phase cannot start | Start only after phase 008 acceptance rows are Met |
| Risk | Compaction and disposal seams carry less shutdown evidence | Med: `session-compact-context` or `session-stop-context` passes on fixtures and does nothing live | Defer either adapter with its reason when a fixture cannot reach the seam, and leave live proof to phase 013 [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/research.md:246-247] |
| Risk | Goal context leaks frontmatter or exceeds the budget | Med: the leaf works from a wrong or oversized directive | Inject only `chat_slice`, never the raw file, and assert it in the REQ-001 test |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: `goal-context` resolves the packet once per session start and reuses it, adding no network call.
- **NFR-P02**: N/A for throughput, because a dispatch is one session.

### Security
- **NFR-S01**: Injected context is the packet slice only and carries no frontmatter, env value or key.
- **NFR-S02**: Advisory adapters never block a tool call.

### Reliability
- **NFR-R01**: A context adapter that fails logs to stderr and lets the session continue, because missing context must not block a dispatch.
- **NFR-R02**: The phase 008 safety adapters keep their tests green after the extension.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a workspace with no bound packet makes `goal-context` inject nothing and log that no goal is bound.
- Maximum input: a packet slice at the 4,000-character budget is injected whole, never truncated.
- Failure path: an unreadable `goal.md` logs one stderr line and the session continues without goal context.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Two required and seven optional adapters, two patches and two docs |
| Risk | 10/25 | Context only, advisory by default, no fail-closed guard added |
| Research | 8/20 | Compaction and disposal seams need fixture probing |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does `agent/pre-step` or system-prompt assembly carry the goal slice more reliably for a headless one-shot session? Decided during T004 by the REQ-001 fixture, with the choice recorded in `implementation-summary.md`.
- Does the `compaction/summary` seam fire in a headless run short enough to be a fan-out leaf? The keyed pin in phase 013 answers it live.
<!-- /ANCHOR:questions -->

---

