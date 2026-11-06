---
title: "Feature Specification: Phase 14: playbook-docs-and-closeout"
description: "Governance docs still describe seven CLI runtimes, no cli-deepseek-harness playbook exists and the trigger index returns nothing for deepseek harness, so the shipped runtime would be contradicted by its own docs and indexes. This phase adds the playbook, reconciles every governance doc and generated index to eight runtimes and closes the packet with a recursive strict validation."
trigger_phrases:
  - "playbook docs and closeout"
  - "phase 14 playbook docs and closeout"
  - "dsh manual testing playbook"
  - "deepseek harness closeout"
  - "eight runtime docs reconciliation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: playbook-docs-and-closeout

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
| **Phase** | 14 of 15 |
| **Predecessor** | 013-dsh-live-contract-pin |
| **Successor** | 015-dsh-hook-parity |
| **Handoff Criteria** | Every playbook scenario has a recorded result, the trigger index returns the packet for "deepseek harness", no governance doc carries a stale "seven" count and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Write and run the `cli-deepseek-harness` manual testing playbook, reconcile governance docs and generated indexes to the eighth runtime, and reconcile completion metadata across the parent and every child. No new runtime behavior is built here.

**Dependencies**:
- `002-dsh-offline-contract-pin` through `013-dsh-live-contract-pin`, all complete
- `013-dsh-live-contract-pin` sets which routes the docs may call "supported"

**Deliverables**:
- The packet `manual-testing-playbook/`, the `.dsh/manual-testing-playbook` link, the hub playbook entry and final feature-catalog text
- Changelogs (packet, hub, `.skilled/changelog/skilled/`) and governance docs: `AGENTS.md`, `README.md`, `SECURITY.md`, `.skilled/skills/README.txt`, `.skilled/CROSS-CLI.md`, `ENV-REFERENCE.md`, `.env.example` (names only)
- Regenerated `agents-md-manifest.json`, sk-doc code-folder manifests, a rebuilt `trigger-index.json` and reconciled completion metadata
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eleven files across the repo root and the hub still match a "seven" runtime count, the `cli-deepseek-harness` packet has no playbook, and the trigger index returns no result for "deepseek harness". If the packet closed now, its docs and indexes would contradict the shipped runtime and nothing would prove the packet validates as a whole.

### Purpose
Every governance doc and index names eight runtimes correctly, the playbook has a recorded result per scenario and the parent packet passes recursive strict validation.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c -i 'seven (cli|runtime|mode|bridge)' AGENTS.md README.md SECURITY.md .skilled/skills/cli-external-orchestration .skilled/skills/README.txt
README.md:3
.skilled/skills/cli-external-orchestration/README.md:3
.skilled/skills/cli-external-orchestration/changelog/v1.7.0.0.md:1
.skilled/skills/cli-external-orchestration/changelog/v1.7.13.0.md:1
.skilled/skills/cli-external-orchestration/graph-metadata.json:1
.skilled/skills/cli-external-orchestration/SKILL.md:1
.skilled/skills/cli-external-orchestration/mode-registry.json:3
.skilled/skills/cli-external-orchestration/cli-hermes/feature-catalog/hub-registration/hub-mode-registration.md:1
.skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:2
.skilled/skills/cli-external-orchestration/feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md:2
.skilled/skills/cli-external-orchestration/description.json:1
exit 0

$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "deepseek harness" | rg '"results"|normalizedQuery'
  "normalizedQuery": "deepseek harness",
  "results": [],
exit 0

$ ls .skilled/skills/cli-external-orchestration/cli-deepseek-harness
ls: .skilled/skills/cli-external-orchestration/cli-deepseek-harness: No such file or directory
exit 1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the `cli-deepseek-harness` manual testing playbook, link it from `.dsh/` and the hub, and record a result per scenario.
- Reconcile `AGENTS.md`, `README.md`, `SECURITY.md`, `.skilled/skills/README.txt`, `.skilled/CROSS-CLI.md`, `ENV-REFERENCE.md` and `.env.example` to eight runtimes.
- Add packet, hub and repo changelog entries and finalize the feature-catalog text.
- Regenerate `agents-md-manifest.json`, the sk-doc code-folder manifests and `trigger-index.json`.
- Reconcile completion metadata in the parent `spec.md`, `goal.md` and every child, then run the recursive strict validation.

### Out of Scope
- New runtime behavior or route promotion - phases 006 and 013 own them
- Rewriting historical changelog entries that say "seven" - they record past releases
- Key values in `.env.example` - only variable names are allowed

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/manual-testing-playbook/` | Create | Playbook scenarios and results |
| `.dsh/manual-testing-playbook` | Create | Link to the packet playbook |
| `.skilled/skills/cli-external-orchestration/` playbook entry, feature catalog, `changelog/` | Modify and Create | Hub playbook row, final catalog text, hub changelog |
| `.skilled/changelog/skilled/` | Create | Repo release entry |
| `AGENTS.md`, `README.md`, `SECURITY.md` | Modify | Eighth runtime, counts, key-handling note |
| `.skilled/skills/README.txt`, `.skilled/CROSS-CLI.md`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example` | Modify | Runtime lists and env variable names |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Regenerate | Manifest from `AGENTS.md` |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modify | Packet directories and README verdicts |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | Rebuilt trigger index |
| Parent `spec.md`, `goal.md` and each child's completion metadata | Modify | Reconciled completion state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every playbook scenario has a recorded result, and key-gated scenarios cite phase 013 evidence or are marked blocked with the reason |
| REQ-002 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/085-cli-deepseek-harness-creation --strict --recursive` prints `RESULT: PASSED` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The `/doctor:agents-md` check reports the regenerated manifest in sync, and the sk-doc code-folder tests pass |
| REQ-004 | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "deepseek harness"` returns the packet |
| REQ-005 | `rg -n -i 'seven (cli\|runtime\|mode\|bridge)' AGENTS.md README.md SECURITY.md .skilled/skills/cli-external-orchestration .skilled/skills/README.txt` returns no stale count outside historical changelog entries |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The recursive strict validation of the parent prints `RESULT: PASSED` and the trigger index returns the packet for "deepseek harness".
- **SC-002**: The "seven" count command from Measured Behavior matches only the two historical changelog files, down from eleven files today.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002 to 013 complete | Docs describe behavior that does not exist yet | Start only after each child validates strict, checked by the recursive run |
| Risk | Docs call a route "supported" that phase 013 did not prove | High | Copy the verified or "configured, not verified" status from phase 013 evidence word for word |
| Risk | Generated index or manifest drift | Med | Regenerate with each owning script, never hand-edit, and rerun the checks |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the phase changes docs and indexes and serves no traffic.
- **NFR-P02**: N/A: playbook scenarios reuse phase 013 latency evidence rather than measuring again.

### Security
- **NFR-S01**: `.env.example` lists `LLMGATEWAY_API_KEY` and `OPENCODE_API_KEY` by name only, with no value.
- **NFR-S02**: `SECURITY.md` states that dsh dispatches never read a repo-root `.env`.

### Reliability
- **NFR-R01**: Every generated file is reproduced by its generator with zero diff.
- **NFR-R02**: Completion metadata agrees across the parent and every child.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a playbook scenario with no key available is marked blocked with the reason, never left blank.
- Maximum input: the recursive validation covers all 14 children plus the parent in one run.
- Failure path: any child failing strict validation makes the recursive run print `RESULT: FAILED` and blocks closure.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 25 files across governance docs, changelogs, manifests and every child |
| Risk | 8/25 | Docs and generated indexes, each with a check |
| Research | 3/20 | Content comes from earlier phases |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The phase plan's "seven" sweep also matches historical hub changelog entries. This phase treats those as history and excludes them, which the closeout records.
<!-- /ANCHOR:questions -->

---
