---
title: "Feature Specification: Human Voice Rules standard ownership and packet template conformance"
description: "The Human Voice Rules standard sits in sk-doc/shared/ while the mode that applies it sits beside it, and that mode's references and assets diverge from the sk-create-skill templates."
trigger_phrases:
  - "hvr standard ownership"
  - "move hvr-rules into the packet"
  - "human voice packet conformance"
  - "hvr scanner default rules path"
  - "sk-create-with-human-voice template alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Human Voice Rules standard ownership and packet template conformance

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-01 |
| **Branch** | `skilled/v4.0.0.0` (no branch created for this packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Human Voice Rules standard lives at `.opencode/skills/sk-doc/shared/references/hvr-rules.md`,
in the hub's shared tier, while the only mode that applies it, `sk-create-with-human-voice`,
sits one directory over and reads that file at run time. Shared means every mode may reach it.
Here exactly one mode owns the workflow and one more consumes it through a declared alias, so
the shared placement buys nothing and costs a hop. The second problem is smaller and separate:
that mode's four authored references and assets diverge from the shapes
`sk-create-skill/assets/skill/` prescribes, most visibly an off-enum `contextType` and a missing
`## 1. OVERVIEW` opening section.

### Purpose

The standard lives inside the packet that applies it, every live consumer points at the new
path, the frozen record keeps the old one, and the packet's references and assets match the
templates their own hub publishes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Move `hvr-rules.md` from the hub's shared tier into `sk-create-with-human-voice/references/`.
- Repoint every live consumer, including the scanner that parses the standard at run time,
  the hub router, the generated leaf manifest and alias projection, the spec-kit templates
  that emit an HVR reference line, and the fixtures and golden snapshot that record that line.
- Conform the packet's four authored references and assets to
  `sk-create-skill/assets/skill/skill-reference-template.md` and `skill-asset-template.md`.
- Record the reversal in the packet changelog as a new version entry.

### Out of Scope

- The content of the standard. Section numbering, term lists, tables and prose stay byte-identical
  except for the frontmatter block the reference template governs. The scanner keys on section
  titles, so a content edit is a separate blast radius from a move.
- The 614 frozen spec documents under `specs/` that carry the old path. They record what was true
  when written, exactly as every other rename this session has left them.
- Historical benchmark reports and released changelog entries carrying the old path. Same reason.
- The `contextType: reference` drift in sibling packets. Eleven other files across `sk-doc` carry
  the same off-enum value, and fixing them is a fleet sweep rather than this packet's scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/shared/references/hvr-rules.md` | Delete (moved) | Source of the move |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` | Create | Destination, content unchanged |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` | Modify | `DEFAULT_RULES_PATH` walks one directory, not three |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/**` | Modify | SKILL.md, README.md, references, assets, scripts README, changelog |
| `.opencode/skills/sk-doc/ROUTER.md` | Modify | Two `RESOURCE_MAP` rows |
| `.opencode/skills/sk-doc/leaf-aliases.json` | Modify | Alias `diskPath` for `sk-create-quality-control` |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Regenerate | Generated artifact |
| `.opencode/skills/sk-doc/README.md` | Modify | Shared-tier resource table row |
| `.opencode/skills/sk-doc/manual-testing-playbook/**` | Modify | Three scenarios naming the resource path |
| `.opencode/skills/sk-doc/shared/**` | Modify | Two cross-links out of the shared tier |
| `.opencode/skills/sk-doc/sk-create-quality-control/**` | Modify | Three consumer links |
| `.opencode/skills/sk-doc/sk-create-readme/**` | Modify | Seven consumer links |
| `.opencode/skills/sk-doc/sk-create-skill/assets/**` | Modify | Two README templates |
| `.opencode/skills/sk-communication/**` | Modify | Three consumer links |
| `.opencode/commands/create/**`, `.opencode/commands/rewrite/**` | Modify | Command docs and workflow YAML |
| `repo-rules/communication.md` | Modify | One rule-set link |
| `.opencode/skills/system-spec-kit/templates/**` | Modify | Ten templates and examples emitting the HVR line |
| `.opencode/skills/system-spec-kit/scripts/test-fixtures/**` | Modify | Five fixtures recording that line |
| `.opencode/skills/system-spec-kit/scripts/tests/fixtures/**` | Modify | One expected phase-creation fixture |
| `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Regenerate | Eight snapshot occurrences |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `hvr-rules.md` resolves at `sk-create-with-human-voice/references/hvr-rules.md` and no longer exists under `shared/references/` |
| REQ-002 | `hvr_scan.py` finds the standard with no `--rules` argument, and its fail-closed floors still fire on a renamed section |
| REQ-003 | No live consumer points at the old path. Frozen spec docs, released changelog entries and benchmark reports keep theirs |
| REQ-004 | The hub's four gates stay green: package check, parent-skill-check at 0 warnings, root-metadata at 14/14, and the spec-kit suite no worse than baseline |
| REQ-005 | The standard's body is unchanged apart from the frontmatter block the reference template governs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every authored reference and asset in the packet opens with `## 1. OVERVIEW` and carries an on-enum `contextType` |
| REQ-007 | The packet changelog records the reversal rather than editing the released v1.0.0.0 entry that stated the standard would not move |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -l "shared/references/hvr-rules" -g '!specs/**'` returns only frozen artifacts, each named in the implementation summary with the reason it stays.
- **SC-002**: The scanner's clean fixture exits 0, its dirty fixture exits 1, and a standard with a renamed section 6 exits 2.
- **SC-003**: All four gates report green from the final state, with the whole gate rerun rather than a focused subset.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The scanner silently reads no standard | High. A fail-open scan certifies a dirty document | The scanner already fails closed on thin parses. Prove it with the negative control rather than trusting the design |
| Risk | The golden snapshot goes stale against the edited templates | Medium. Breaks the spec-kit suite for anyone else | Regenerate with `-u` and rerun the whole suite, comparing counts against a baseline captured first |
| Risk | `ROUTER.md` resource paths stop resolving | High. `parent-skill-check` 12a fails and hub routing degrades | Every `RESOURCE_MAP` path must dual-read to a typed pair in `leaf-manifest.json`. Regenerate the manifest before rechecking |
| Dependency | `leaf-manifest.json` is generated | A hand edit fails the byte-drift check | Regenerate with `generate-leaf-manifest.cjs --write` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The scanner's run time is unchanged. It reads one file either way, and the path is resolved once at import.
- **NFR-P02**: The hub's resource-loading cost is unchanged. The standard is one leaf before and after, and only its typed pair moves.

### Security
- **NFR-S01**: No new file is read outside the hub. The alias `diskPath` stays hub-contained, which the manifest generator enforces.
- **NFR-S02**: No credential, network call or execution surface changes.

### Reliability
- **NFR-R01**: The scanner fails closed. A standard it cannot parse to the minimum term floors exits 2 rather than reporting a clean scan.
- **NFR-R02**: Every gate is rerun whole from the final state rather than sampled.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: the scanner reads an empty target and reports no findings, exit 0. Unchanged by the move.
- Maximum length: the standard is 21 KB and parsed in full on every run. Unchanged.
- Invalid format: a standard whose section titles no longer match parses thin and exits 2.

### Error Scenarios
- Standard missing at the default path: `load_rules` raises `OSError`, the scanner prints its read error and exits 2.
- A caller passing `--rules` explicitly: unaffected. The flag overrides the default either way.
- A consumer still holding the old path: the file is gone, so the failure is loud rather than a silently stale read.

### State Transitions
- Partial completion: a move without the scanner edit leaves the scanner exiting 2 on every run, which is visible immediately rather than latent.
- Manifest regenerated before the alias edit: the byte-drift check fails, which is the intended ordering signal.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | 28 files, roughly 350 changed lines, one generated artifact and one snapshot |
| Risk | 20/25 | Touches a run-time parser, a hub router contract and a shared template set |
| Research | 12/20 | The reference inventory had to be measured rather than trusted |
| **Total** | **51/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator reversed the earlier do-not-move instruction, and the count that justified it was measured rather than assumed.
<!-- /ANCHOR:questions -->

---
