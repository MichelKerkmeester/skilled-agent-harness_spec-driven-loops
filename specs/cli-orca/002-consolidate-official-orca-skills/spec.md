---
title: "Feature Specification: Consolidate Official Orca Skills Into Standalone cli-orca"
description: "Extract the mcp-orca-cli workflow mode out of the mcp-tooling parent hub into a standalone class-S skill named cli-orca, and upgrade it to carry the routing knowledge of all eight official Orca Agent Skills from the vendored snapshot."
trigger_phrases:
  - "cli-orca extraction"
  - "mcp-orca-cli migration"
  - "official Orca skills consolidation"
  - "standalone Orca CLI skill"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Consolidate Official Orca Skills Into Standalone cli-orca

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The mcp-tooling hub carries a tenth mode named mcp-orca-cli. Its subject is not an MCP transport at all: it is a stateful CLI whose worktrees, terminals, browser state, automations, artifacts and skill sharing are Orca-managed. Keeping that subject inside a hub whose identity is MCP tool bridging creates a permanent boundary problem, and it hides the fact that Orca ships eight separate public Agent Skills that a local skill should know about.

This packet dissolves the hub membership and promotes the subject into a standalone class-S skill named cli-orca. The new skill owns version-matched Orca CLI routing and carries one authored reference per official Orca skill plus a verbatim asset snapshot of each official SKILL.md. The predecessor packet, mcp-tooling/021-mcp-orca-cli, moves to cli-orca/001-mcp-orca-cli as a live packet with a supersession addendum.

**Key Decisions**: classify the new root as class S (no registry, no router, no description.json), delete the 292 MB repository copy that lived inside the skill tree, embed each official skill as an authored reference plus a verbatim snapshot, dispatch research and writing work to external read-only workers, and keep the class-S package shape from the sk-create-skill templates.

**Current implementation state**: complete, after a post-closure review cycle recorded on the operator's instruction. The extraction stands: the snapshot copy was removed with a verified equivalent, the research wave returned three cited reports, the hub runs at nine aligned modes, and the skill corpus, packet move, fleet catalog updates and sixteen-gate close-out suite all passed. The cycle added five recorded review iterations, a fresh-context synthesis fix list, seven applied remediations and a full playbook run; the gate suite shows zero failing gates across every run, and the playbook's runtime wave then ran live — `ORCA-005` and `ORCA-007` in-session, `ORCA-006` via a detached stop/restart driver — to an 8 PASS / 0 FAIL / 0 SKIP record, so the run supports a release recommendation.

**Critical Dependencies**: the vendored Orca snapshot at `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main`, the sk-create-skill class-S contract, the mcp-tooling hub invariants, and the system-spec-kit strict validator.

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Packet role** | Migration and upgrade record for the new cli-orca skill |
| **Runtime posture** | Documentation-only work, no Orca runtime mutation |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Overview

Move the Orca CLI subject out of the mcp-tooling parent hub into a standalone class-S skill named cli-orca, with all eight official Orca skills embedded.

### Problem Statement

The mcp-tooling hub routes ten modes through one advisor identity. Nine of them bridge MCP transports. The tenth, mcp-orca-cli, is a CLI-only workflow whose subject belongs to a different class of tool. Three concrete costs follow. The hub's own description has to name a non-MCP member in every mode count and boundary paragraph. The mode's vocabulary lives inside the hub's stage-one and stage-two routers, which cannot express version-matched Orca CLI guidance. And no local skill knows that Orca ships eight separate official Agent Skills, so a user who asks for an official Orca surface gets no local entry point.

### Purpose

Deliver one standalone cli-orca skill that owns the Orca CLI routing surface and knows every official Orca skill, while the mcp-tooling hub keeps only its transport modes and its existing invariants.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A new class-S skill at `.skilled/skills/cli-orca/` with the full package shape from the sk-create-skill templates.
- Authoring one reference per official Orca skill and one verbatim snapshot per official SKILL.md, with provenance records.
- Removing every mcp-orca-cli reference from the mcp-tooling hub surfaces and regenerating the hub manifest.
- Moving `specs/mcp-tooling/021-mcp-orca-cli` to `specs/cli-orca/001-mcp-orca-cli` with re-pointed metadata and a supersession addendum.
- Track metadata for `specs/cli-orca` plus the removal of 021 from the mcp-tooling track metadata.
- Fleet catalog updates in `.skilled/skills/README.txt` and the skill-root metadata contract.
- Advisor graph re-ingestion and the full gate suite.

### Out of Scope

- Any change to mcp-code-mode or to the sibling mcp-* hub members.
- Orca installation, authentication, or mutating probes against a live runtime.
- Compiled-routing activation promotion for the new skill.
- `description.json`, `mode-registry.json` or `hub-router.json` on the new skill, which the class-S contract forbids.

### Files to Change

| Area | Paths |
|------|-------|
| New skill | `.skilled/skills/cli-orca/**` |
| Hub removal | `.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,ROUTER.md,SKILL.md,README.md,description.json,graph-metadata.json,leaf-manifest.json,feature-catalog/**,manual-testing-playbook/**,changelog/v1.8.0.0.md}` |
| Hub evidence moved | `.skilled/skills/mcp-tooling/benchmark/reports/orca-integration/**` to `specs/cli-orca/001-mcp-orca-cli/benchmark/` |
| Spec packets | `specs/cli-orca/001-mcp-orca-cli/**`, `specs/cli-orca/002-consolidate-official-orca-skills/**`, `specs/cli-orca/{description.json,graph-metadata.json}`, `specs/mcp-tooling/{description.json,graph-metadata.json}` |
| Fleet catalogs | `.skilled/skills/README.txt`, `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `.skilled/skills/cli-orca` conforms to the class-S contract: `SKILL.md`, `graph-metadata.json` and `leaf-manifest.config.json` authored, `leaf-manifest.json` and `leaf-aliases.json` generated, no hub-only files present. |
| REQ-002 | The hub's `routerSignals` keys, `tieBreak` array, registry mode list, manifest reachability and `ROUTER.md` key sets all agree at nine modes. |
| REQ-003 | No `mcp-orca-cli` or `.pi/skills/mcp-tooling/mcp-orca-cli` reference survives outside preserved changelog history and the moved benchmark evidence. |
| REQ-004 | `specs/cli-orca/002-consolidate-official-orca-skills` and `specs/cli-orca/001-mcp-orca-cli` both print `RESULT: PASSED` under the strict spec validator. |
| REQ-005 | The eight official skill snapshots exist and are byte-identical to the vendored source, with provenance that records each release revision and digest. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The advisor recommends `cli-orca` for an Orca CLI prompt and stays silent for the `OpenOrca` holdout after re-ingestion. |
| REQ-007 | `specs/cli-orca` track metadata exists and the mcp-tooling track metadata no longer lists 021. |
| REQ-008 | The fleet catalogs name eight class-S roots and describe the cli-* family as CLI tool surfaces rather than only dispatch executors. |
| REQ-009 | Every authored skill document passes `validate_document.py` with zero blocking issues. |
| REQ-010 | A five-iteration deep review of `.skilled/skills/cli-orca` records one verdict line per iteration, appends each iteration to the JSONL ledger, and produces a loop report under the packet's `review/` directory. |
| REQ-011 | A fresh-context synthesis returns a prioritised fix list in which every finding cites the file and line it lands in. |
| REQ-012 | Every justified finding is remediated, each change is proven by a check, and no gate that passed in the pre-remediation baseline fails afterwards. |
| REQ-013 | The eight playbook scenarios run in wave order and each outcome is recorded with its transcript, exit status and reason under the skill's dated benchmark reports. |
| REQ-014 | No live secret remains in the repository: the leaked upstream client key in the vendored snapshot is redacted and the redaction is recorded in the decision record. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The class-S root metadata gate passes with no FORBIDDEN, MISSING or STALE rows.
- The mcp-tooling parent check reports nine modes and zero warnings.
- The standalone package validator exits clean.
- The stale-reference search returns nothing outside preserved history.
- Both spec packets validate strictly.
- The advisor answers an Orca CLI prompt with `cli-orca` and ignores the unrelated `OpenOrca` label.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

| Risk | Mitigation |
|------|------------|
| The 292 MB repository copy is deleted before equivalence is proven | Equivalence was verified with `diff -rq` against the vendored spec copy and an intact archive remains available for rollback |
| Hub removal breaks routing silently | The parent check and advisor replay were captured before extraction so the after-state is measured against a baseline |
| Snapshots drift from upstream | Copies are byte-compared and hash-checked against the manifest, and the provenance file records the refresh procedure |
| External workers return plausible but wrong content | Every returned document is validated and its citations are spot-checked before use |

### Dependencies

- The vendored snapshot at `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main`
- The class-S contract in `sk-doc/sk-create-skill`
- A live Orca runtime for any mutation observation, which remains operator-gated

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

No runtime performance surface. The skill is documentation and routing metadata.

### Security

No credentials are read, printed or stored. Browser and terminal payloads remain untrusted data in every authored document.

### Reliability

The gates are deterministic. A failing gate blocks the completion claim rather than being waived.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

| Case | Handling |
|------|----------|
| The skill-tree copy is already absent | Equivalence is proven against the archive and the vendored copy, and the absence is recorded rather than treated as a new finding |
| A verbatim upstream file cannot satisfy the repository doc contracts | The snapshot keeps its bytes and leaves the `.md` doc scope by extension, recorded as a deliberate deviation |
| An external worker route hits a quota limit | The runner retries the second rostered route automatically and records both attempts |
| The advisor returns no recommendation for an Orca prompt | The before-state is recorded as observed and the after-state is compared against it |

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:assumptions -->
## 9. ASSUMPTIONS

- The vendored snapshot is the authoritative source for official skill wording.
- The operator's five confirmed decisions hold for the whole run.
- The repository gates remain the completion authority, and a green validator alone is not integration.

<!-- /ANCHOR:assumptions -->
