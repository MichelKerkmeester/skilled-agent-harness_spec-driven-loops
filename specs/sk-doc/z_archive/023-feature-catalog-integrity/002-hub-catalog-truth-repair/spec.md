---
title: "Feature Specification: hub catalog truth repair"
description: "Ten hub-root feature catalogs mislead a reading agent: eight files cite retired compiled-routing directories, six roster and count claims contradict their own registries, four shipped capabilities have no catalog entry at all, and one safety claim about transport mutation is flatly wrong. This phase repairs them in four lanes, starting with the mechanical retired-path lane that takes the validator from 19 violations to 0."
trigger_phrases:
  - "hub catalog repair"
  - "retired compiled routing paths catalog"
  - "stale executor roster catalog"
  - "missing catalog leaf shipped feature"
  - "advisor phantom hook row"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/023-feature-catalog-integrity"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/002-hub-catalog-truth-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the hub-catalog repair phase from the track C synthesis"
    next_safe_action: "Run T001 confirm-against-HEAD, then start Lane A which is unblocked"
    blockers:
      - "Lanes B-D wait on 001's rulings; Lane A does not"
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Q2 description-parity strictness, ruled by 001"
      - "Q6 volatile-value policy, ruled by 001"
    answered_questions: []
---
# Feature Specification: Hub Catalog Truth Repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

> Phase adjacency under the `sk-doc/023-feature-catalog-integrity` parent: predecessor
> `001-catalog-enforcement-and-coverage` (rulings only; Lane A is unblocked); sibling
> `003-large-surface-catalog-reconciliation` runs in parallel on disjoint files.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-doc/023-feature-catalog-integrity` |
| **Findings** | 28 (10 P1, 18 P2) — every P1 in the track except the seven in `003` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
These are the catalogs an agent reads to learn what a hub does, and their leaves are indexed in the `leaf-manifest.json`
that every skill root carries — the progressive-disclosure surface that Lane C skill-benchmark `resourceRecall` scores
against. They are wrong in ways an agent will act on. `cli-external-orchestration` advertises four executor packets
against a registry that declares six, so an agent reading it will never consider `cli-devin` or `cli-pi`. `sk-prompt`
names packet directories `prompt-improve` and `prompt-models` when the registry keys and the directories on disk are
`sk-prompt-improve` and `sk-prompt-models`, which sends a consumer to a path that does not exist. `mcp-tooling` asserts
that transports "never mutate this workspace" while its own registry declares `mcp-figma` as export-only with local
writes, which is a safety claim rather than a wording nit. `system-skill-advisor` advertises a lifecycle-hook surface
with no file behind it, and that phantom row is the same defect as its 42-versus-41 feature count. Eight files cite
compiled-routing directories `011-runtime-engine` and `010-live-activation` when the live directories are `014-` and
`013-`, and those account for fourteen of the validator's nineteen violations. Separately, four capabilities that ship
today have no catalog entry at all, so agents rebuild what already exists.

### Purpose
Repair the ten hub-root catalogs so an agent reading them is not misled, and add the four missing leaves so shipped
capabilities are discoverable. Where the same fact is duplicated across catalogs, replace the copy with a link to the
owner rather than fixing the copy — the seven mirrored compiled-routing leaves are the proof case, one retired path
multiplied by seven.

### Non-Goals
- Any change to the validator or the standard. `001` owns those.
- `system-spec-kit` and the `system-deep-loop` nested catalogs beyond the single Lane A prose fix. `003` owns those.
- Duplicating runtime-owned facts into the CLI hub. `cli-pi` fan-out and Devin/Cursor containment belong to
  `system-deep-loop`; the CLI hub gets accurate six-mode routing and a cross-reference, not duplicate leaves.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Lane A — retired paths (mechanical, unblocked, starts immediately).** Eight files cite the retired compiled-routing
directories. Seven are SOURCE FILES cells across the mirrored `compiled-routing-and-legacy-fallback.md` leaves and
account for 14 of the 19 validator violations; the eighth is a prose citation in
`system-spec-kit/feature-catalog/governance/feature-flag-governance.md` that the validator cannot see because it only
reads `File`-column cells. Five further broken anchors sit in `system-skill-advisor` (`claude-hook.md`,
`goal-opencode-plugin.md`, `advisor-rebuild.md` twice, `projection.md`) and are the remaining 5 violations. Clearing
Lane A takes the validator from 19 to 0.

**Lane B — stale rosters and counts an agent will act on.** Four-versus-six CLI executors; retired `sk-prompt` packet
identifiers; sk-doc "twelve packets" when it is twelve modes over eleven packet owners; sk-design claiming three
`/interface:*` commands where two exist and assigning `interaction-states-pass.md` to a Motion mode the registry no
longer has; sk-code and system-deep-loop both calling default-on compiled routing "opt-in"; the advisor's frozen
167-tests-across-23-files baseline; and the `mcp-tooling` transport-mutation claim, which ranks above the other wording
fixes because it is a safety claim.

**Lane C — invisible shipped capabilities (four new leaves).** sk-design's authored-brand lane, sk-design's structural
fingerprint card selection (marked decision-support, not a public mode), sk-git's multi-runtime git preflight advisory,
and the advisor's `skill_graph_propagate_enhances` MCP tool.

**Lane D — advisor structural repair and hygiene.** The phantom `(not yet authored)` row and the feature count are one
work unit. The advisor root uses two-column Feature/File tables with no Description bodies, which makes root-to-leaf
description parity structurally impossible, so the root is reshaped to the governing H3/Description/Current-Reality/
Source-Files form **before** `001`'s parity rule is applied. Then the five description-parity findings at the ruled
strictness, and the two sk-git validation-anchor gaps.

### Out of Scope
- The validator, the standard, and the rulings. `001` owns them.
- `system-spec-kit/feature-catalog` beyond the single Lane A prose fix, and all `system-deep-loop` nested catalogs.
- Authoring an `mcp-code-mode` catalog.
- **`RC-008-02`.** Refuted at iteration 9 and confirmed repaired at HEAD. Do not resurrect.

### Findings in Scope

| ID | Sev | Lane | Note |
|----|-----|------|------|
| `RC-001-04` | P1 | A | Mirrored compiled-routing entries cite retired paths. **Merge group with `RC-006-02`.** The finding names seven files; the measured count is eight, because the eighth citation is in prose. |
| `RC-006-02` | P1 | A | Same defect from the sk-git angle. **Merge group with `RC-001-04`.** |
| `RC-001-05` | P1 | A, D | Advisor broken anchors plus a stale feature count. **Merge group with `RC-007-02`:** the phantom row is the 42nd counted feature. |
| `RC-007-02` | P1 | D | Phantom OpenCode lifecycle-hook surface. **Merge group with `RC-001-05`.** The row is plain text, not a link, which is why bijection reports zero violations for a catalog that has one. |
| `RC-005-01` | P1 | B | CLI hub omits two live executor modes. Root says "four" in four places; the registry declares six. |
| `RC-005-02` | P1 | B | Transport non-mutation wording conceals explicit local export writes. Safety-ranked. The registry already carries the correct nuance; the fix is to stop flattening it. |
| `RC-007-03` | P1 | B | Prompt catalog uses retired workflow and packet identifiers. Points a consumer at a nonexistent path. |
| `RC-002-01` | P1 | C | Authored-brand lane absent from the hub catalog. **Path correction:** the guard is at `shared/authored-brand/authored-brand-boundary.mjs`, not the `shared/scripts/` path the research cited, which does not exist. |
| `RC-006-01` | P1 | C | Live git preflight advisory absent from the canonical sk-git catalog. `sk-git/SKILL.md` explicitly claims the catalog covers every capability, so this is a self-contradiction. |
| `RC-007-01` | P1 | C | Live `skill_graph_propagate_enhances` tool absent from the catalog. |
| `RC-002-02` | P2 | C | Structural fingerprint card selection absent. Mark it decision-support, not a public mode. |
| `RC-002-03` | P2 | B | Interface command leaf claims three routers; two exist. |
| `RC-002-04` | P2 | B | `interaction-states-pass.md` assigned to a retired Motion owner. |
| `RC-002-05` | P2 | B | sk-code cross-reference mislabels default-on compiled routing as opt-in. **Merge group with `RC-004-03`.** |
| `RC-004-03` | P2 | B | Same mislabel in system-deep-loop. **Merge group with `RC-002-05`.** |
| `RC-004-05` | P2 | B | The deep-loop hub root offers no link to the nested runtime catalog, leaving 50 leaves undiscoverable from the hub a reader starts at. |
| `RC-006-03` | P2 | B | sk-doc conflates twelve modes with eleven packet owners, four times. |
| `RC-007-04` | P2 | B | Advisor retains an obsolete 167-tests-across-23-files baseline against a tree of 111 vitest files. Policy per **OPERATOR-DECISION (Q6)**. |
| `RC-005-03` | P2 | D | CLI leaf descriptions do not mirror root entries. Strictness per **OPERATOR-DECISION (Q2)**. |
| `RC-005-04` | P2 | D | MCP leaf descriptions do not mirror root entries. Strictness per **OPERATOR-DECISION (Q2)**. |
| `RC-006-07` | P2 | D | sk-git leaf descriptions do not mirror root. Strictness per **OPERATOR-DECISION (Q2)**. |
| `RC-006-08` | P2 | D | sk-doc leaf descriptions do not mirror root. Strictness per **OPERATOR-DECISION (Q2)**. |
| `RC-007-06` | P2 | D | sk-prompt leaf descriptions do not mirror root. Strictness per **OPERATOR-DECISION (Q2)**. |
| `RC-007-05` | P2 | D | Advisor root entries cannot satisfy title and description parity at all. Reshape the root **before** applying the parity rule. |
| `RC-006-04` | P2 | D | GitKraken catalog scope omits a currently documented provider. |
| `RC-006-05` | P2 | D | GitKraken entry has an em-dash validation row and no real anchor. Add a scenario or narrow the claim. |
| `RC-006-06` | P2 | D | The GitHub MCP leaf's only anchor exercises the `gh` CLI. Add a scenario or narrow the claim. |
| `RC-005-05` | P2 | B | Guardrail, not a repair. Packet-043 fan-out detail belongs to the runtime owner; produce a cross-reference and do not write duplicate leaves. Its value is in what it stops this phase from writing. |

Count: 28 findings, 10 P1 and 18 P2.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/{sk-code,sk-design,sk-doc,sk-prompt,system-deep-loop,...}/feature-catalog/compiled-routing-and-legacy-fallback.md` | Modify | Lane A: retired path substitution across the mirrored leaves |
| `.opencode/skills/system-spec-kit/feature-catalog/governance/feature-flag-governance.md` | Modify | Lane A: the one prose citation the validator cannot see |
| `.opencode/skills/system-skill-advisor/feature-catalog/**` | Modify | Lane A anchors, Lane C new leaf, Lane D reshape and phantom row |
| `.opencode/skills/cli-external-orchestration/feature-catalog/**` | Modify | Lane B roster, Lane D parity |
| `.opencode/skills/mcp-tooling/feature-catalog/**` | Modify | Lane B safety claim, Lane D parity |
| `.opencode/skills/sk-design/feature-catalog/**` | Modify | Lane B counts and owner, Lane C two new leaves |
| `.opencode/skills/sk-git/feature-catalog/**` | Modify | Lane C new leaf, Lane D anchors and parity |
| `.opencode/skills/sk-doc/feature-catalog/**` | Modify | Lane B mode-versus-packet, Lane D parity |
| `.opencode/skills/sk-prompt/feature-catalog/**` | Modify | Lane B retired identifiers, Lane D parity |
| `.opencode/skills/sk-code/feature-catalog/**` | Modify | Lane B opt-in mislabel |
| `.opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md` | Modify | Lane B opt-in mislabel and the nested-catalog link |

Read-only truth sources: each hub's `mode-registry.json`, `hub-router.json` and `SKILL.md`;
`.opencode/commands/interface/`; `skill-graph-tools.ts`; `sk-git/scripts/hooks/`;
`sk-design/shared/authored-brand/authored-brand-boundary.mjs`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero retired compiled-routing citations repo-wide | `rg -l "011-runtime-engine\|010-live-activation"` over `.opencode/skills/**/feature-catalog/` returns no files, prose included. Baseline: 8 files. |
| REQ-002 | Validator clean on the hub packages | `python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --strict` exits 0. Baseline: `FAIL: 19 violation(s)`, all `missing_source_path`. |
| REQ-003 | Every mode and packet count in a hub root is derived-correct | For each hub, the stated mode count equals `len(mode-registry.modes)` and the stated distinct packet count equals the number of distinct `packet` values. This is what catches sk-doc's twelve-versus-eleven. |
| REQ-004 | Every packet or workflowMode identifier named in a catalog resolves to a directory that exists | A check over all ten hub catalogs returns zero unresolved identifiers. This is what catches the `sk-prompt` retired ids. |
| REQ-005 | The transport-mutation claim matches the registry | No hub catalog asserts transports never mutate the workspace while its registry declares a `workspaceWrites` value other than none. The corrected wording carries the registry's nuance rather than flattening it. |
| REQ-006 | Four new Lane C leaves exist, each with a real implementation path and a real validation anchor | Each new leaf's SOURCE FILES entries resolve on disk and each validation anchor names a scenario that actually exercises the described behavior. |
| REQ-007 | No plain-text `.md` rows in any hub root table | Every root table row naming a `.md` is a markdown link to a file that exists. This closes the phantom row and the feature-count discrepancy together. |
| REQ-008 | The advisor root is reshaped before parity is applied | Advisor root entries carry H3, Description, Current Reality and Source Files, so parity is satisfiable at all. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Description parity holds at the ruled strictness across the five parity findings | The `001` parity check reports zero violations for the five affected catalogs. **OPERATOR-DECISION (Q2).** |
| REQ-010 | The `/interface:*` command count matches the filesystem | The sk-design catalog's stated count equals the number of files in `.opencode/commands/interface/`. Baseline: catalog says three, two exist. |
| REQ-011 | Every advisor and skill-graph tool appears in the advisor root | Every entry in `advisorToolDefinitions` and `skillGraphToolDefinitions` has a root row. Baseline: `skill_graph_propagate_enhances` is registered and dispatched but absent from the root table. |
| REQ-012 | The stale test baseline is handled per policy | The 167-tests-across-23-files snapshot is removed or replaced with a generated value. **OPERATOR-DECISION (Q6).** |
| REQ-013 | The two sk-git anchor gaps are closed honestly | For GitKraken and the GitHub MCP leaf, either a real validation scenario is added or the catalog claim is narrowed to what is actually tested. Narrowing is the default: a catalog that claims untested behavior is worse than one that claims less. |
| REQ-014 | Duplicated facts become links, not copies | Where the same fact appears in two catalogs, the copy is replaced by a link to the owner. No duplicate leaf is created for runtime-owned fan-out or containment behavior. |
| REQ-015 | The deep-loop hub root links the nested runtime catalog | A reader starting at the hub root can reach the 50 nested runtime leaves. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Validator violations on the hub packages go from **19 to 0**, with the baseline captured before the first
  edit and the delta reported.
- **SC-002**: Zero repo-wide hits for the retired compiled-routing directories, prose included, down from 8 files.
- **SC-003**: Zero plain-text `.md` rows in any hub root table; the advisor's feature count matches its leaf count.
- **SC-004**: All six derived assertions in REQ-003, REQ-004, REQ-010 and REQ-011 return zero mismatches.
- **SC-005**: Four new Lane C leaves exist, each citing a path and an anchor that were verified to exist.
- **SC-006**: All 28 findings are closed or carry a recorded operator deferral; `RC-008-02` is not reopened.
- **SC-007**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0 and the
  ten-lane `checklist.md` is closed with evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001` rulings (Q2 parity, Q6 volatile values) | Lane D cannot finish | Lane A and most of Lane B and C proceed without them |
| Dependency | `001`'s derived-assertion checks | The count and identifier checks would be hand-run | Hand-run them in T001 as evidence, then adopt the checks when `001` lands |
| Risk | A finding was repaired mid-flight and the "fix" re-breaks it | M | T001 re-checks the six roster and count claims first; iteration 9 already observed the "root prose updated without the leaf" pattern |
| Risk | Lane C leaves are authored from research paths that do not exist | H | The authored-brand guard path in the research is wrong; T001 re-derives every Lane C implementation path before authoring |
| Risk | Writing duplicate leaves for runtime-owned behavior | M | REQ-014 and `RC-005-05` make cross-referencing the rule |
| Risk | Reshaping the advisor root churns a large surface | M | Reshape before parity, in one pass, so parity is applied once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance dimension. This phase edits documentation only.

### Security
- **NFR-S01**: The corrected transport-mutation wording must not understate write behavior. When in doubt, state the
  broader write surface, because the failure mode is an agent trusting a false safety claim.
- **NFR-S02**: No catalog edit exposes a credential, token, or internal-only path.

### Reliability
- **NFR-R01**: Every claim written into a catalog is verified against a live source file or registry at the time of
  writing, and the source is named in the leaf.
- **NFR-R02**: No runtime code, registry, or script is modified. Catalog markdown only.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **A count that is correct in the root but stale in a leaf, or the reverse.** Check both; iteration 9 observed root
  prose updated without the leaf.
- **A retired path that appears in prose and in a table cell in the same file.** Both are fixed; only the cell is
  visible to today's validator.
- **A capability that ships but is deliberately not public.** The structural fingerprint card selection is
  decision-support; it gets an entry that says so rather than a public-mode entry.

### Error Scenarios
- **A Lane C feature turns out to have been removed since the research.** Then the finding is closed as self-healed,
  with evidence, and no leaf is authored.
- **A registry and its directory disagree.** Escalate rather than pick one. The catalog cannot be more correct than its
  source.

### State Transitions
- **Lane A completes before `001` lands.** Expected and desirable; Lane A is the 19-to-0 delta and depends on nothing.
- **`001` rules literal description parity instead of normalized.** Lane D's five parity findings become a larger
  rewrite; re-estimate rather than force the original shape.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Ten catalogs, four lanes, four new leaves, roughly 30 files |
| Risk | 6/25 | Documentation only; the real risk is writing a new false claim |
| Research | 8/20 | Every claim must be re-derived from a live registry or source |
| **Total** | **30/70** | **Level 2** |

Level 2 is earned by the ten-lane checklist and the file count, not by new mechanism. Promote to Level 3 only if the
operator wants Lane C's four new leaves treated as authoring work with their own decision record; the reading here is
that they are inventory entries for already-shipped code.
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **OPERATOR-DECISION (Q2)** — description-parity strictness, ruled by `001`. Governs `RC-005-03`, `RC-005-04`,
  `RC-006-07`, `RC-006-08`, `RC-007-06`.
- **OPERATOR-DECISION (Q6)** — volatile-value policy, ruled by `001`. Governs `RC-007-04`.
- Should the advisor's missing OpenCode hook leaf be authored as a current adapter entry, or consolidated into the
  existing OpenCode Plugin Bridge entry? Do not author it from the obsolete hook names; the live plugin surface is
  `event` plus `experimental.chat.system.transform`.
- Does `sk-git`'s GitKraken provider scope gap warrant a new leaf or an edit to the existing one?
<!-- /ANCHOR:questions -->
