---
title: "Tasks: the sk-design root router reads like its peers"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: the sk-design root router reads like its peers

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T###` is a stable task id. `[P]` marks a task that may run in parallel with its neighbours; tasks
without it are ordered. A task is `[x]` only when its stated evidence was observed, never because it
looked done.

All tasks below are complete. Evidence is named per task rather than summarised at the end.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Run the root-router contract validator across all six hubs; confirm it passes for every one
- [x] **T002** Read two conformant peers and the template to find the convention no gate encodes
- [x] **T003** List the divergences precisely before editing anything
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T004** Align the H1 with the frontmatter title, as every peer does
- [x] **T005** Add an intent table naming each intent, its mode and what the request asks for
- [x] **T006** Split the code block into `## 3. MACHINE-READABLE ROUTER` with the replay note
- [x] **T007** Declare `DEFAULT_RESOURCE` empty, with the reason written down
- [x] **T008** Renumber the closing section and rewrite it as the peers' bulleted contract
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T009** Root-router contract validator: zero issues
- [x] **T010** Resolve every `RESOURCE_MAP` path against disk
- [x] **T011** Rebuild the advisor and replay the sixteen phrases
- [x] **T012** Fleet metadata and leaf-manifest freshness
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Section skeleton matches the peers
- [x] `DEFAULT_RESOURCE` declared with its reason
- [x] 14 of 14 resource paths resolve
- [x] Replay byte-identical at generation 653
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`: the frozen scope and the REQ ids these tasks satisfy
- `plan.md`: the architecture, the rollback, and the decision records
- `acceptance-criteria.md`: the rows that decide whether this packet may close
- `implementation-summary.md`: what actually shipped, with the commit
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

A command counts as evidence only after its output and exit status were read. A green run lies in
several ways: a stale build, a wrong path, a silent no-op and an assertion-free check all exit 0.
Every gate below was required to print its own result line, and the contract validator passes before and after, so it proves only that nothing broke, not that the file conforms to the convention.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] Two peers and the template read before writing, since the convention is written in none of them alone
- [x] No keyword and no resource path edited, so a replay difference would mean a real mistake
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] Prose and structure only; the machine-readable block is byte-identical apart from its new preamble
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] Root-router contract validator: 0 issues
- [x] `RESOURCE_MAP`: 14 paths, 0 unresolved
- [x] Sixteen-phrase replay: byte-identical
- [x] Fleet metadata 13/13, leaf manifests 13 fresh
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Every divergence addressed, not only the missing section
- [x] `DEFAULT_RESOURCE` declared rather than left implicit, because a peer reader expects to find it
- [x] The closing section covers the same four routing rules the peers cover, including the same-mode
      tie case that is specific to this hub
- [x] The absence of any gate for this convention recorded as an open question rather than quietly
      accepted
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] No credential, token or key added, moved or logged
- [x] No new network call, and no dependency installed
- [x] File moves stay inside the repository; nothing is written outside it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] `spec.md` records that the validator passes either way, which is why this went unnoticed
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] One file changed; nothing else references its structure
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Result |
|------|--------|
| Root-router contract validator | 0 issues |
| `RESOURCE_MAP` paths | 14 of 14 resolve |
| Sixteen-phrase replay, generation 653 | Byte-identical |
| Fleet metadata | 13/13 |

The rewrite cost no routing. The convention it conforms to is enforced by nothing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] The machine-readable block remains the single replay source, now where a peer reader expects it
- [x] The class contract holds: every required file present, every forbidden file absent
- [x] Router paths resolve to leaves that exist on disk
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable in the runtime sense: this phase moves files and metadata and adds no code path on a
hot loop. The one measured quantity is advisor score, recorded per phrase in
`acceptance-criteria.md` rather than as a performance number.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] One commit, so the shared branch has no broken intermediate state
- [x] Replay run after an explicit rebuild
- [x] Rollback named in `plan.md` and reachable by a single revert
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] Moves recorded as renames, so authorship and history survive
- [x] Historical records left as written; only live references rewritten
- [x] No document claims a result that was not observed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder, taking the first `RESULT:` line
- [x] Generated metadata regenerated after the last document edit
- [x] No spec document still carries template prose
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | [x] Approved | 2026-09-06 |
| Claude Code | Implementer | [x] Approved | 2026-09-06 |
| `validate.sh --strict` | Automated gate | [x] Approved | 2026-09-06 |
<!-- /ANCHOR:sign-off -->
