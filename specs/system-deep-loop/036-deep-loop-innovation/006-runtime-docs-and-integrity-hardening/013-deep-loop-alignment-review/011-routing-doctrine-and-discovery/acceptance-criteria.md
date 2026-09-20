---
title: "Acceptance Criteria: routing doctrine and discovery vocabulary"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: routing doctrine and discovery vocabulary

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/011-routing-doctrine-and-discovery
**Level:** 2
**Status:** Complete
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given any graduated hub, When its live compiled policy is loaded, Then no policy carries `defaultResource` and the schema forbids the property | `loadHubEngine()` for all five hubs: no such key; `compiled-policy.v1.schema.json` `additionalProperties: false` | Met | - |
| AC-002 | REQ-001 | Given each hub's two artifacts, When they are read together, Then each states the concept the other does not | Four hubs declare `fallback-only` plus a contract naming the stage-two preamble as the other concept; `mcp-tooling` already carried the semantics key | Met | - |
| AC-003 | REQ-002 | Given a hub whose JSON lists fallback resources and whose ROUTER.md declares an empty preamble, When the contract key is read, Then it says the array is the zero-signal fallback and never the preamble | `system-deep-loop`, `cli-external-orchestration`, `sk-doc` all carry that sentence | Met | - |
| AC-004 | REQ-002 | Given `sk-design`, which carries no `defaultResource` key at all, When its two artifacts are compared, Then it lists no resource that never loads | `sk-design` ROUTER.md `DEFAULT_RESOURCE = []` and no JSON key; nothing claims a preamble | Met | - |
| AC-005 | REQ-003 | Given the deep-loop keyword block, When it is read, Then no retired family remains | Six terms removed; 26 keywords, no duplicates, `conformance` count 0 | Met | - |
| AC-006 | REQ-003 | Given the discovery terms, When they are read, Then no retired family remains | `standard-authority` and `skill benchmark` removed; 26 trigger phrases and 12 key topics, no duplicates, zero residual | Met | - |
| AC-007 | REQ-003 | Given each retired term, When the registry, command metadata, and router vocabulary are searched, Then none names a live family | Zero hits for all six across the hub outside changelog and benchmark history | Met | - |
| AC-008 | REQ-004 | Given the edits, When the guard runs, Then every hub is fresh and both manifest copies are byte-identical | `node .opencode/bin/compiled-route-guard.cjs`, exit 0, five hubs fresh | Met | - |
| AC-009 | REQ-004 | Given the edits, When each hub's class contract is checked, Then every root conforms | `ci-skill-root-metadata.cjs`: checked 13, passed 13, failed 0, exit 0 | Met | - |
| AC-010 | REQ-001 | Given the change, When the root-router contract fixtures run, Then they pass | `root-router-contract.test.cjs`: all positive and negative fixtures passed, exit 0 | Met | - |
| AC-011 | REQ-001 | Given the change, When the runtime suite runs, Then it exits zero | `npx vitest run --no-coverage` in `runtime/`: 154 files, 2678 passed, 8 skipped, observed exit 0 | Met | - |
| AC-013 | REQ-003 | Given the `SKILL.md` keyword edit, When the command-contract drift check runs, Then the three generated contracts carry the hub's current source digest | Recompiled; `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts` pass 40/40 | Met | - |
| AC-014 | REQ-004 | Given the source edits and the re-minted manifests, When they are committed together, Then HEAD is coherent again | A concurrent commit staged the manifests alone; observed at HEAD, the guard exits 1 and four hubs serve `legacy`. Committing the sources restores agreement; the split is recorded in `implementation-summary.md` §5 | Met | - |
| AC-012 | REQ-001 | Given the one failing root-metadata case, When it is reproduced with the packet edits stashed, Then it fails identically | Fails at baseline with the same `testFleetDiscoveryUsesTheAuthoredMarker` assertion; it expects the retired `sk-design-md-generator` hub | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001 carried this packet. The adjudication could not be made from the two documents, because
they disagree by design and neither one runs; it could only be made from the compiled policy the
engine actually loads, and that shows the schema forbidding the property outright. That single
measurement turned a contested edit into a naming fix: the field was never the preamble, it is
the zero-signal fallback, and every hub's own `SKILL.md` route loop already consumes it as one.
AC-008 and AC-009 prove the re-mint landed and still serves.

Two things were decided rather than built. No gate compares the two artifacts, because the only
existing cross-artifact check rejects a literal legacy path and nothing else, and the suite has no
obvious home for a new one; the absence is recorded instead. And `sk-design` was left without the
key rather than given an invented value, because a hub whose author deliberately declared no
preamble is a different case from a hub whose two artifacts disagree.
<!-- /ANCHOR:closure -->
