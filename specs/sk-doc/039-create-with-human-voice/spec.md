---
title: "Feature Specification: Add the sk-create-with-human-voice mode packet to the sk-doc hub"
description: "The Human Voice Rules have lived in sk-doc/shared/references/ for a long time and hundreds of files point at them, but nothing ran them. This packet adds the sk-doc mode that applies the standard: a scope gate, a scanner that parses the standard at run time, a judgment pass and a re-scan."
trigger_phrases:
  - "human voice mode"
  - "hvr application workflow"
  - "sk-create-with-human-voice"
  - "voice pass packet"
  - "apply the human voice rules"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add the sk-create-with-human-voice mode packet to the sk-doc hub

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Human Voice Rules are a 510-line linguistic standard at
`.opencode/skills/sk-doc/shared/references/hvr-rules.md`, and hundreds of files across this
repository point at that path. Nothing in the repository ran them. There is no checker, no
workflow, no scope boundary and no scoring method. The nearest thing to enforcement is one
step inside `sk-create-quality-control` that says "flag only issues that matter" and names
no method, so every consumer was left to eyeball 120 banned terms, 7 punctuation rules and
a dozen structural patterns by reading.

### Purpose

`sk-doc` gains a mode that applies the standard rather than describing it again: what may
be touched, in what order, with what arithmetic, and what proof the pass produces.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A new `sk-doc` workflow packet, `sk-create-with-human-voice`, carrying the workflow and nothing from the standard itself.
- A mechanical scanner that parses its term lists out of `hvr-rules.md` at run time and fails closed when it cannot.
- Integration on every applicable surface in `parent-skills-nested-packets.md` section 7, which for a `metadata`-routed mode is rows 1 through 9 and row 11.
- A `/create:with-human-voice` command with its router, presentation contract, both workflow YAMLs, its `command-metadata.json` entry and its four runtime mirrors.

### Out of Scope

- **Moving `hvr-rules.md`.** Hundreds of files carry the current path, most of them frozen spec documents, plus a spec-kit golden snapshot. Relocating it falsifies shipped history and breaks a test suite.
- **Editing `sk-create-quality-control`.** Its HVR step should delegate to this mode, but the packet belongs to a concurrent stream. Recorded as a recommendation in section 6 rather than applied.
- **Editing `repo-rules/communication.md`.** It references the standard's path, which did not move, so no change is required. The one-line note for its owner is in section 6.
- **Moving `HVR` or `human voice` aliases off `sk-create-quality-control`.** That would change a sibling packet's routing vocabulary, whose source of truth is its own `SKILL.md` keyword line, a file this packet does not own.
- **Regenerating the advisor command bridges.** `derive-command-bridges.cjs` rewrites `skill_advisor.py` and `projection.ts`, which a concurrent stream needs byte-stable. `/create:repo-rule` is the precedent: it shipped without a bridge.
- **A manual-testing playbook for the packet.** Optional at packet level. The four verification controls in the packet README cover the scanner.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-with-human-voice/` | Create | The mode packet: `SKILL.md`, `README.md`, two references, one asset, the scanner, two fixtures, changelog |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | Register the mode with ten aliases and a `metadata` routing class |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | Router signal, tie-break entry, and a new vocabulary class |
| `.opencode/skills/sk-doc/ROUTER.md` | Modify | Widen the `HVR` intent, repoint its leaves, extend `FULL_INVENTORY`, correct a wrong gloss |
| `.opencode/skills/sk-doc/SKILL.md` | Modify | Mode table row, packet counts, layout, fallback checklist, keywords |
| `.opencode/skills/sk-doc/README.md` | Modify | Hub overview, command list, document map |
| `.opencode/skills/sk-doc/description.json` | Modify | Doctor description and keywords |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modify | Advisor vocabulary: domains, intent signals, trigger phrases, entities |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Regenerate | Generated, never hand-edited |
| `.opencode/skills/sk-doc/command-metadata.json` | Modify | One entry for the new command |
| `.opencode/commands/create/with-human-voice.md` | Create | Thin command router |
| `.opencode/commands/create/assets/create-with-human-voice-*` | Create | Presentation contract plus auto and confirm workflow YAMLs |
| `.codex/prompts/`, `.pi/prompts/`, `.cursor/commands/`, `.claude/commands/` | Generate | Runtime command mirrors, produced by each runtime's generator |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `hvr-rules.md` stays at its current path, and no part of it is copied into the packet |
| REQ-002 | The mode is registered and reachable: `parent-skill-check` green on `.opencode/skills/sk-doc` with 14 modes and zero warnings |
| REQ-003 | The packet passes `package_skill.py --check --strict` |
| REQ-004 | The mode lands on every applicable surface of section 7. Row 10 does not apply, because the mode is `metadata`-routed |
| REQ-005 | The scanner derives every term from the standard at run time and fails closed rather than reporting a clean scan it did not perform |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Both routing stages agree for the mode's own phrasings, and no sibling mode loses traffic it held before |
| REQ-007 | The command validates as a command document and reaches all four runtime surfaces |
| REQ-008 | The scanner's gate is proved by a negative control: a deliberately dirty fixture, a clean one, and a broken standard that stops the run |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A request phrased as a voice request reaches the mode at both routing stages, with the packet's leaves loaded and none missing.
- **SC-002**: The scanner finds every mechanical class in the dirty fixture, nothing in the clean one, and nothing inside a fenced block or an inline code span.
- **SC-003**: All three gates end green, and the two pre-existing red results in the repository are unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `hvr-rules.md` section headings | The scanner parses by title, so a rename empties a list | Fail-closed floors stop the run with exit 2 rather than reporting clean. Renumbering is survived, renaming is not, and that is the intended asymmetry |
| Dependency | Three concurrent streams writing the same tree | A cross-packet edit corrupts another stream's work | Every change is inside this packet, the hub-root files, the new command and the spec folder. Cross-packet needs are recorded below rather than applied |
| Risk | Vocabulary overlap with `sk-create-quality-control` | Low | Both modes fire on "human voice" phrasings, which is correct: the audit reports the finding and this mode owns the method. Verified by replay, recorded below |
| Risk | The 100-point scale on a long document | Low | The mode reports hard blockers plus density past roughly 400 lines and states which basis it used |

### Recorded for other owners

These need files this packet does not own. Each is a proposal, not a change.

| Owner | File | Exact change |
|---|---|---|
| Stream 4 | `repo-rules/communication.md` | **No change required.** It references `.opencode/skills/sk-doc/shared/references/hvr-rules.md`, which did not move. An optional one-line addition after that reference: `The workflow that applies this standard is` `` `sk-doc`'s `sk-create-with-human-voice` mode. `` |
| Stream 2 | `sk-create-quality-control/SKILL.md` | Step 4 "Apply HVR Voice Review" currently names no method. Replace its body with a delegation: run `sk-create-with-human-voice` for the voice pass and report its findings in the `HVR Issues` row |
| Stream 2 | `sk-doc/mode-registry.json` | `sk-create-quality-control` declares `"command": "/doc:quality"`, and no such command exists on disk in any runtime. Either build it or set the field to `null` |
| Stream 5 | `sk-doc/ROUTER.md` | `DOC_QUALITY` has no `score this document` keyword, so that phrasing hits stage one and returns `surfaceIntents: []`. Pre-existing, unrelated to this packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A scan of a 200-line document completes in under a second on the repository's Python 3.9 runtime.
- **NFR-P02**: The scanner re-parses the standard on every invocation rather than caching, because a cached term list is the drift this packet exists to avoid.

### Correctness
- **NFR-S01**: The scanner never reports a clean result from a standard it could not parse. A parse below the declared floors exits 2.
- **NFR-S02**: Masked spans keep their original length, so every reported line and column matches the source file.

### Reliability
- **NFR-R01**: Renumbering a section of the standard does not change any scan result.
- **NFR-R02**: The packet carries no copy of any term list, so there is no second source that can disagree with the standard.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: no findings, exit 0. An empty file is not a failure.
- A document about the standard: reports every listed term as a blocker. The scope gate names this class and the mode refuses to give a bare score.
- A 900-line reference: soft deductions accumulate by length alone. The mode switches to hard blockers plus density and says so.

### Error Scenarios
- Missing standard: exit 2 with the read error. No scan is reported.
- Renamed section heading: exit 2 with a `parsed too thin` message naming the list that emptied.
- Unreadable target: exit 2 with the path that failed.

### State Transitions
- A rewrite that scores worse than the draft: reported as measured, never hidden behind the after-number.
- A banned term that carries the meaning: kept, and recorded as an accepted exception with the reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Twenty-two files: nine in the new packet, eight hub-root, four command, plus generated mirrors |
| Risk | 8/25 | One executable script and a routing change on a live hub. No existing packet edited, and every gate has a before-and-after measurement |
| Research | 12/20 | The section 7 integration contract, the leaf-resource contract, four runtime sync manifests and the standard itself all had to be read before authoring |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The scope was fixed by the brief, and the two judgment calls it left open (whether to move the standard, and whether the mode gets a command) are both resolved and recorded in `plan.md`.
<!-- /ANCHOR:questions -->

---
