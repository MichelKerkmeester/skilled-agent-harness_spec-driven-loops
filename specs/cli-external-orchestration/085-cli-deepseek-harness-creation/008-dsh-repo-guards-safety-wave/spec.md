---
title: "Feature Specification: Phase 8: dsh-repo-guards-safety-wave"
description: "A dsh dispatch today runs with no spec gate, no dispatch preflight and no completion evidence, because no repo guard reaches the harness. This phase builds the repo-guards Cordis plugin bundle under .dsh/plugins/repo-guards/ that bridges the eight safety guards onto harness seams through the shared guard cores, each with a declared error policy."
trigger_phrases:
  - "dsh repo guards safety wave"
  - "phase 8 dsh repo guards safety wave"
  - "dsh repo-guards plugin"
  - "dsh guards patch"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: dsh-repo-guards-safety-wave

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 14 |
| **Predecessor** | 007-dispatch-recognition-and-stress-adapter |
| **Successor** | 009-dsh-context-guards-and-goal-bridge |
| **Handoff Criteria** | A keyless run with `--patch .dsh/patches/guards.patch.yml` fails only with `MISSING_CREDENTIAL` and names no failed plugin, the eight adapter suites pass and the decision record names the chosen mechanism |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: The first guard wave only. Eight safety adapters (`dispatch-audit`, `dispatch-preflight-lint`, `spec-gate-classify`, `spec-gate-enforce`, `completion-evidence`, `task-dispatch-guard`, `post-edit-quality`, `classifier-injection-screen`) in one relative-path Cordis bundle, the `guards.patch.yml` that loads it and the decision record for native plugin versus the Claude hook bridge. Context, git and MCP guards belong to phases 009 and 010.

**Dependencies**:
- `002-dsh-offline-contract-pin` for the relative-plugin boot proof and the `MISSING_CREDENTIAL` failure shape
- `004-dsh-runtime-folder-and-patches` for `.dsh/`, its `SYNC.md` and the route and lineage patches the keyless run composes with

**Deliverables**:
- `.dsh/plugins/repo-guards/` entry, eight adapters and tests beside them
- `.dsh/patches/guards.patch.yml`
- `.dsh/SYNC.md` and the packet's `references/guards-and-hooks.md` updated
- `decision-record.md` in this phase folder
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo's safety policy (spec gate, dispatch preflight, completion evidence, subagent dispatch checks, post-edit quality and the classifier injection screen) reaches Pi through 19 hand-authored extensions in `.pi/extensions/`, and nothing reaches dsh. The research found that the shipped Claude hook bridge is absent from the install and fails open on an unparsable config, so a dsh dispatch would run with no repo guard at all. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:220-225]

### Purpose
Every dsh dispatch that loads `guards.patch.yml` runs the same eight safety guards Pi runs, through the same shared cores, and each guard fails in the direction its decision record declares.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .dsh/plugins/repo-guards 2>&1
ls: .dsh/plugins/repo-guards: No such file or directory
$ ls .pi/extensions/*.ts | wc -l
      19
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build a relative-path Cordis plugin bundle at `.dsh/plugins/repo-guards/` whose adapters call the shared cores the Pi extensions import, such as `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` and `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`.
- Map each safety guard to its harness seam: `tools/pre-execute` for preflight, spec-gate enforce and task dispatch, `tools/post-execute` for audit, post-edit quality and the injection screen, `agent/pre-step` for spec-gate classify and `agent/turn-stopping` for completion evidence.
- Declare one error policy per guard and test it by throwing inside the shared core.
- Write `.dsh/patches/guards.patch.yml` that loads the bundle by relative path, and record the bundle in `.dsh/SYNC.md` and the packet's `references/guards-and-hooks.md`.
- Record native plugin versus the experimental Claude hook bridge in `decision-record.md`.

### Out of Scope
- `goal-context`, `session-start-context` and the later-wave context and git guards - phase 009 owns them.
- `mcp-route-guard` - phase 010 owns it, because it only applies when the MCP patch is mounted.
- Proof that the adapters deny and allow on real model tool calls - that needs a provider key and belongs to phase 013.
- Any change to the shared guard cores or to `.pi/extensions/` - the bundle is a consumer, never a second copy of policy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.dsh/plugins/repo-guards/` (entry module) | Create | Cordis plugin entry that registers the eight adapters on their seams |
| `.dsh/plugins/repo-guards/` (eight adapters) | Create | One adapter per safety guard, each calling its shared core |
| `.dsh/plugins/repo-guards/` (tests) | Create | Fixture parity and error-policy tests per adapter |
| `.dsh/patches/guards.patch.yml` | Create | Inserts the relative plugin rows |
| `.dsh/SYNC.md` | Modify | Names the bundle and the guards patch with mechanism and source |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md` | Modify | Seam map and error policy per guard |
| `decision-record.md` (this folder) | Create | Native plugin versus Claude hook bridge |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A keyless run under a disposable `DSH_HOME` with the route, lineage and `.dsh/patches/guards.patch.yml` patches fails only with `MISSING_CREDENTIAL`, and stderr names no failed plugin and no `startup-*.log` report |
| REQ-002 | For each of the eight guards, a test feeds a fixture tool call and asserts the same allow or deny the matching `.pi/extensions/<guard>.ts` gives for that input |
| REQ-003 | For each adapter, a test throws inside the shared core and asserts the declared error policy, with `spec-gate-enforce` and `dispatch-preflight-lint` failing closed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `rg -n -E 'specs/\|packet [0-9]\|phase [0-9]' .dsh/plugins` returns nothing |
| REQ-005 | `decision-record.md` names the chosen mechanism, the rejected one and the evidence (`hooks-claude-code` absent from the install, fail-open config parse) |
| REQ-006 | `.dsh/SYNC.md` and `references/guards-and-hooks.md` name `repo-guards` and `guards.patch.yml` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The keyless guarded run exits 1 with `MISSING_CREDENTIAL` as its only error, and `grep -c -i plugin` on its stderr prints 0.
- **SC-002**: The bundle's test command passes with eight parity cases and eight error-policy cases.
- **SC-003**: `rg -n -E 'specs/|packet [0-9]|phase [0-9]' .dsh/plugins` exits 1 with no output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 relative-plugin boot proof | Without it the bundle may never load and the guards are silently absent | Do not start the bundle until `002-dsh-offline-contract-pin/evidence/plugin-boot.txt` exists |
| Risk | Imports of shared cores fail under the harness resolver, or a guard fails open | High: repo policy silently absent on every dsh dispatch | Explicit error policy per guard, a throw test per adapter and the keyless boot run that must name no failed plugin [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:571] |
| Risk | Harness payload shapes differ from Pi (lowercase tool names, `subagent` payload) | Med: a guard matches nothing and allows everything | Fixture parity tests per guard against the Pi extension's verdict |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each adapter returns within the shared core's own budget and adds no network call.
- **NFR-P02**: N/A for throughput, because a dispatch is one session with one tool call stream.

### Security
- **NFR-S01**: No adapter reads, logs or forwards a provider key or a `.env` value.
- **NFR-S02**: `spec-gate-enforce` and `dispatch-preflight-lint` fail closed when their core throws.

### Reliability
- **NFR-R01**: A plugin load failure is visible on stderr, never swallowed, so the keyless boot run detects it.
- **NFR-R02**: Each adapter's error policy is pinned by a test, so a changed policy fails the suite.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a tool call with no path or command reaches the core unchanged and gets the Pi extension's verdict for the same empty input.
- Maximum input: a `bash` command that chains several dispatches is judged by `dispatch-rule-checks.mjs` as Pi judges it, with no truncation in the adapter.
- Failure path: a core that throws makes `spec-gate-enforce` deny the call and the advisory guards allow it with a logged warning, as the decision record declares.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One bundle, eight adapters, one patch, two docs and one decision record |
| Risk | 18/25 | Fail-open guards and resolver failures hide policy loss |
| Research | 8/20 | Seams and verdicts settled in research section 9.6, the resolver behavior settles in phase 002 |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Can a relative repo plugin import the shared guard cores and Node built-ins, and which imports fail? Phase 002's boot proof answers it before this phase starts. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:392]
- Does the adapter behave the same as the Pi bridge for denials and crashes on real tool calls? Fixtures answer it here, and the keyed pin in phase 013 confirms it. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:393]
<!-- /ANCHOR:questions -->

---

