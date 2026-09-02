---
title: "Decision Record: Phase 1: source-inventory-and-placement"
description: "Where sk-create-chart lives, why the standalone option lost, what the source's noncommercial licence blocks, and which of the 57 binary assets cross."
trigger_phrases:
  - "chart placement decision"
  - "mode or standalone skill"
  - "polyform licence conflict"
  - "chart binary asset disposition"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/001-source-inventory-and-placement"
    last_updated_at: "2026-09-02T10:30:00Z"
    last_updated_by: "phase-1-implementer"
    recent_action: "Recorded the placement verdict, the licence conflict, and the binary-asset split"
    next_safe_action: "Take ADR-002 to the operator, since it blocks phase 4"
    blockers:
      - "ADR-002 is Proposed, not Accepted. Phase 4 cannot start until the operator rules on the PolyForm against MIT conflict."
    key_files:
      - "specs/sk-doc/051-sk-create-chart/001-source-inventory-and-placement/research/inventory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-1-source-inventory-and-placement"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "ADR-002: may a noncommercial-only work be redistributed inside a public MIT repository"
    answered_questions:
      - "ADR-001: mode packet under sk-doc, not a standalone skill"
      - "ADR-003: 12 binary assets cross, 45 do not"
---
# Decision Record: Phase 1: source-inventory-and-placement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: sk-create-chart is a workflow mode packet under the sk-doc hub

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 1 implementer, from measured comparison |
| **Satisfies** | REQ-002, SC-002, US-001 |

---

### Context

The packet is named `sk-create-chart`, and the name suggests a mode under the documentation hub.
The parent spec deliberately refused to answer from the name, because the subject sits further
from documentation than any current sibling and the source is comparable in size to the largest
existing mode. Those two facts pull in opposite directions.

Phase 3 builds to whatever this decides, and phase 5 wires it. Getting it wrong costs a rebuild
of both.

### Constraints

- The metadata contract is class-dependent. A hub root and a standalone root both require
  `graph-metadata.json`, while `description.json`, `mode-registry.json` and `hub-router.json` are
  hub-only and forbidden on a standalone root. Source: `skill-root-metadata-contract.md` §3.
- A hub projects exactly one advisor identity. A nested `metadata` mode has no advisor entry of
  its own, so its vocabulary reaches the advisor only through the hub's `graph-metadata.json`.
  Source: `parent-skills-nested-packets.md` §7 row 6.
- The operator's instruction is to keep the source as literal as possible.

---

### The comparison, run before the verdict

REQ-002 requires the hub modes this was compared against, with file counts and subject. All 14
mode folders under `sk-doc`, measured with `find <dir> -type f | wc -l` and `du -sk`:

| Mode | Files | KB | Subject |
|------|------:|---:|---------|
| `sk-create-diagram` | 190 | 1,896 | HTML/SVG technical diagrams across 27 types, plus ASCII flowcharts |
| `sk-create-skill` | 74 | 1,036 | Scaffolding a skill or a parent hub |
| `sk-create-diff` | 40 | 372 | Before/after document review as a self-contained HTML report |
| `sk-create-feature-catalog` | 39 | 284 | Feature-catalog inventory packages |
| `sk-create-benchmark` | 37 | 396 | Benchmark packages and inputs |
| `sk-create-manual-testing-playbook` | 26 | 232 | Manual-testing-playbook packages |
| `sk-create-readme` | 24 | 276 | Folder READMEs and install guides |
| `sk-create-with-human-voice` | 23 | 220 | Applying and scoring the Human Voice Rules |
| `sk-create-command` | 23 | 232 | OpenCode slash commands |
| `sk-create-repo-rule` | 22 | 192 | Repo-local rules under `repo-rules/` |
| `sk-create-changelog` | 20 | 168 | Global and packet-local changelog entries |
| `sk-create-quality-control` | 19 | 156 | Validating, scoring and optimizing an existing document |
| `sk-create-agent` | 18 | 160 | OpenCode agents |
| `sk-create-frontmatter` | 18 | 228 | The YAML frontmatter contract |

Hub total: 818 files, 9,512 KB, 15 registered modes across 14 folders. Every mode is
`routingClass: "metadata"` and `packetKind: "workflow"`, and 14 of 15 are
`backendKind: "template-scaffold"`.

Against the standalone siblings, measured the same way, excluding vendor directories:

| Standalone skill | Files | Subject |
|------------------|------:|---------|
| `system-spec-kit` | 6,202 | Spec-folder workflow and continuity |
| `sk-design-md-generator` | 8,034 | Extracting a live site's CSS into a style reference |
| `system-skill-advisor` | 838 | Routing requests to skills |
| `sk-communication` | 791 | Projecting terse output to plain English |
| `sk-vision` | 160 | Local OCR and image inspection |
| `sk-git` | 127 | Worktrees, commits, PRs |
| `sk-prompt` | 89 | Prompt engineering |
| `mcp-code-mode` | 72 | MCP orchestration |
| `sk-design` | 33 | UI values, interaction and motion |

---

### Decision

**Summary**: Build `sk-create-chart` as a workflow mode packet at
`.opencode/skills/sk-doc/sk-create-chart/`, registered as a sixteenth mode in the hub.

**Details**: `packetKind: "workflow"`, `backendKind: "template-scaffold"`,
`advisorRouting.routingClass: "metadata"`, matching all fifteen existing modes. The packet root
carries no `graph-metadata.json`, no `description.json`, no `mode-registry.json` and no
`hub-router.json`, because those are root-level files and a mode packet is not a root. Phase 5
registers it across the eleven surfaces in `parent-skills-nested-packets.md` §7.

---

### Three facts decided it

**One. `sk-doc` is the only place in the fleet that already ships an HTML template corpus.**
A search for directories holding more than five `.html` files across all of `.opencode/skills/`
returns exactly one result: `sk-doc/sk-create-diagram/assets/examples`, with 34. Counting every
`.html` file per top-level skill gives `sk-doc` 45, `sk-code` 3, and `sk-design-md-generator` 9 of
which all 9 are inside `node_modules`. No other skill ships any. The source is 50 HTML templates.
There is one precedent for this payload shape in this repository and it is inside `sk-doc`.

**Two. The subject distance is smaller than the brief assumed, and it is measurable.**
`sk-create-diagram/SKILL.md` already lists, in its own selection guide: Bar chart for
"Quantitative comparison across categories", Line chart for "Continuous trends over time",
Scatter plot for "Distribution and correlation between two variables", Radar for "Multiple
entities scored across 3-5 quantitative criteria", plus Gantt, Timeline and Quadrant. `sk-doc`'s
`graph-metadata.json` carries `diagram` and `flowchart` in `domains`, and "create diagram" and
"html svg diagram" in `intent_signals`. The hub's identity already includes generating a visual
artifact from data. Charting is an extension of a jump this hub already made and shipped, not a
new one.

**Three. The workflow shape matches the registered backend kind exactly.**
The source's `SKILL.md` is a template-first contract: consult the catalog, open the matching
gallery, find the named card block, take its render code, assemble per the single-file skeleton.
It states this as a hard constraint rather than a preference. That is `template-scaffold`, which
is the `backendKind` of 14 of the 15 modes already registered.

**Size did not decide it.** At 124 source files, or 67 once the imagery is dropped,
`sk-create-chart` would be the second-largest mode after `sk-create-diagram`'s 190 and well
inside the 18 to 190 range. It would also be unremarkable among standalone skills, which run from
33 to 8,034 files. Size is compatible with both options, so it discriminates between neither.
Recording that is the point: the brief flagged size as one of the two facts pulling in opposite
directions, and on measurement it pulls in neither.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mode packet under `sk-doc`** | The only precedent for an HTML-template payload is here. Backend kind matches 14 of 15 siblings. The hub's identity already covers visual-artifact generation. Overlap with `sk-create-diagram` becomes an in-hub tie-break that the router can actually resolve | Widens the hub to 16 modes. `sk-doc` grows by roughly 5 MB of retained PNGs. Chart vocabulary enters a hub whose name says documentation | 8/10 |
| Standalone skill at `.opencode/skills/sk-create-chart/` | Its own advisor identity, so data-viz phrasing does not compete with documentation vocabulary. No change to `sk-doc`'s identity | The overlap with `sk-create-diagram` does not disappear, it becomes cross-hub and loses its tie-break. `sk-create-*` is exclusively `sk-doc`'s mode namespace today, so the name would contradict the fleet's grammar. It requires a full standalone metadata set and an advisor identity built from nothing | 5/10 |
| Surface packet under `sk-doc` | Read-only evidence bases are cheap to add and advisor-invisible | Wrong by contract. A surface packet is read-only reference material supporting an existing workflow, and this has its own lifecycle and writes files. `parent-skills-nested-packets.md` §6 rules it out | 2/10 |

**Why the standalone option lost.** Its one real advantage is a clean advisor identity for chart
phrasing, and that advantage does not survive contact with `sk-create-diagram`. Both skills would
answer to "make me a bar chart" whichever way this goes, because `sk-create-diagram` already
claims bar, line, scatter and radar by name. The difference is where that contest gets resolved.

Inside one hub, contention is resolved by machinery that exists for it: `hub-router.json`
carries `routerPolicy.tieBreak`, an ordered list that must be an exact permutation of the
registry, and `ambiguityDelta`, currently 1. Two modes competing for a phrase is the case that
machinery was built for.

Across two hubs there is no tie-break. Resolution falls to whichever advisor confidence score
happens to be higher on the day. Choosing standalone would take a disambiguation problem that has
a designed answer and convert it into one that has none. That is what cost it the decision, and
the naming grammar only corroborates it.

---

### Consequences

**Positive**:
- Phase 3 builds a mode packet, which is the shape `sk-create-skill` already scaffolds.
- Phase 5 follows the documented eleven-surface procedure rather than inventing a standalone
  advisor identity.
- The `sk-create-diagram` overlap gets a designed resolution instead of an accidental one.

**Negative**:
- `sk-doc`'s advisor identity widens into data visualization. Mitigation: keep the aliases narrow
  per `skill-hub-routing.md` §4, and replay each new alias against a plausible out-of-domain
  phrase before shipping it.
- The hub grows by roughly 5 MB, over half its current 9,512 KB, from the 12 retained report
  PNGs. Mitigation: ADR-003 records the cheaper alternative and what it would cost.
- Sixteen modes is a large hub. Mitigation: none needed yet. The two-stage router is built for
  this and 15 already work.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `sk-create-chart` and `sk-create-diagram` misroute against each other | M | Phase 5 replays real chart phrasings through both stages and tunes `tieBreak`, rather than trusting a green gate |
| Chart vocabulary in `graph-metadata.json` captures traffic the hub cannot serve | M | Narrow aliases, replayed against out-of-domain phrases before shipping |
| The mode is registered but unreachable | H | `parent-skills-nested-packets.md` §7 lists eleven surfaces and notes that five have no gate at all. Phase 5 checks all eleven, and a green `parent-skill-check` is not accepted as integration |

---

### Implementation

**Affected Systems**: `sk-doc/mode-registry.json`, `hub-router.json`, root `ROUTER.md` including
its `FULL_INVENTORY` block, `graph-metadata.json`, `description.json`, hub `SKILL.md` mode table,
`leaf-manifest.json`, and the runtime command mirrors. Phase 5 owns all of them.

**Rollback**: Phase 3 and 4 create files under a single new directory, so reverting is deleting
`.opencode/skills/sk-doc/sk-create-chart/`. Phase 5 edits shared hub files, so from that point
rollback is a git revert of the registration commit rather than a directory removal.

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The source's noncommercial licence blocks phase 4 pending an operator decision

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed, awaiting operator decision |
| **Date** | 2026-09-02 |
| **Deciders** | Operator. This is a licensing judgment, not a measurable fact |
| **Satisfies** | REQ-004 |

---

### Context

The brief asked whether the licence permits this adoption at all, and on what terms. It does not
permit it cleanly.

**OBSERVED**, from `LICENSE` in the clone: the source is under PolyForm Noncommercial License
1.0.0. Only a noncommercial purpose is a permitted purpose. Redistribution and modification are
both granted, for a permitted purpose. The Notices clause requires the terms or their URL to
travel with any part of the software. The No Other Rights clause states that "These terms do not
allow you to sublicense or transfer any of your licenses to anyone else."

**OBSERVED**, from `LICENSE` in this repository: MIT, copyright 2025 Michel Kerkmeester,
granting every recipient the right to "use, copy, modify, merge, publish, distribute, sublicense,
and/or sell". **OBSERVED**, from `git remote -v`: this repository is published at
`https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git`.

**DERIVED**: vendoring the source into this repository unchanged would hand every downstream
recipient an MIT grant, covering commercial use and sublicensing, that the upstream licensor
explicitly did not give.

A grep for `Required Notice:` across the clone finds hits only inside `LICENSE` itself, at lines
35 and 38, where line 38 is the template's own worked example. No attribution string is mandated.

---

### Decision

**Summary**: No decision is taken here. This phase surfaces the conflict, blocks phase 4 on it,
and hands the operator the options. Phases 2 and 3 are unaffected, because neither copies source
content into the skills tree.

**Details**: Phase 1 is read-only by design, and the phase that would create the exposure is
phase 4. Recording the conflict now is the whole value of having found it now.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Carve-out directory** | The ported files keep `LICENSE` beside them and a note saying those files are PolyForm-NC and not MIT. Honours the Notices clause. Distribution is expressly granted | The public repository still ships noncommercial-only files, and a downstream commercial user of the MIT repo would be infringing without knowing it. Root `LICENSE` needs an exception note | 7/10 |
| Ask upstream to dual-licence or relicence | Removes the conflict outright | Depends on a third party answering. The repository has one commit and one author, so it is at least a small ask | 6/10 |
| Port only the authored guidance, not the templates | The guidance is what makes the skill good, and rewriting templates independently avoids copying | Guts the adoption. The templates are the thing being adopted, and the parent spec's Out of Scope forbids discarding them while claiming to adopt | 3/10 |
| Vendor it as-is under MIT | Simplest | Misrepresents the upstream grant to every downstream recipient. Not available | 0/10 |
| Drop the adoption | No exposure | Loses a capability the repository has no answer for | 2/10 |

No score here is a recommendation. The carve-out scores highest on mechanics, and mechanics is
not the question. The question is whether the operator's use and redistribution are noncommercial
within the meaning of the licence, and that is theirs to answer.

---

### Consequences

**Positive**:
- The conflict is found in a read-only phase, at zero cost, rather than after 20 MB has been
  copied into a public tree.

**Negative**:
- Phase 4 cannot start until this is answered. Phases 2 and 3 can proceed in the meantime.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The adoption ships and downstream users receive a licence the upstream author did not grant | H | Phase 4 blocked on this ADR reaching Accepted or Rejected |
| The conflict is quietly resolved by not thinking about it | H | Recorded as an UNKNOWN in the inventory and as a blocker in the implementation summary, not only here |

---

### Implementation

**Affected Systems**: none yet. This ADR gates phase 4.

**Rollback**: not applicable. Nothing was changed.

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: 12 of the 57 binary assets cross, and 45 do not

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 1 implementer, from reference tracing |
| **Satisfies** | REQ-005 |

---

### Context

The 57 binary assets are 19,159,589 bytes, roughly 93 percent of the clone. R-003 in the spec
names the failure directly: porting them by default because dropping them felt like a loss. So
the split was made by tracing what references each asset, not by judging which images look
useful.

---

### Decision

**Summary**: Port `docs/assets/reports/report-01.png` through `report-12.png`, 5,099,809 bytes.
Drop the other 45, 14,059,780 bytes.

**Details**: The twelve are required by `scripts/validate.mjs:44`, which pushes each onto its
required-files list, and referenced once each by `templates/reports/index.html` as the visual
index of the report library. The other 45 are referenced only from `README.md`, `README.en.md`
and `examples/README.md`, at 43, 43 and 1 references respectively. `SKILL.md`, the file an agent
reads, references `docs/assets` exactly once, and that reference points at the retained set.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Port 12, drop 45** | Keeps every asset something other than a README depends on. `validate.mjs` runs unmodified, satisfying the phase 4 handoff criterion | Adds 4,980 KB to a 9,512 KB hub | 8/10 |
| Port all 57 | Nothing to decide, nothing lost | Adds 18,710 KB, nearly tripling the hub, to carry GitHub marketing imagery into a tree whose consumer is an agent | 3/10 |
| Drop all 57 and amend the validator | Smallest result by far | Requires editing `scripts/validate.mjs:44` and twelve references in `templates/reports/index.html`, which is exactly the divergence "as literal as possible" rules out | 5/10 |

**Why porting all 57 lost**: the animated GIFs alone are 8,357,942 bytes and exist to show motion
in a GitHub README. This repository has no README surface that renders them and no agent that
reads them.

**Why dropping all 57 lost**: it breaks the source's own validator, which phase 4 is required to
run green from the new path.

---

### Consequences

**Positive**:
- The phase 4 handoff criterion stays achievable without editing source scripts.
- 14,059,780 bytes stay out of the tree.

**Negative**:
- `sk-doc` still grows by over half its current size. Mitigation: U-04 in the inventory records
  re-encoding as an option phase 4 can measure, and the drop-and-amend alternative stays open if
  the operator prefers bytes to literalness.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A dropped asset turns out to be referenced from a ported file | M | Every reference was traced by grep before the split. Phase 4 reruns the trace against the new location |

---

### Implementation

**Affected Systems**: phase 4's migration list.

**Rollback**: a dropped asset is refetchable from the recorded upstream commit.

<!-- /ANCHOR:adr-003 -->

---

## RELATED DOCUMENTS

- **Inventory and census**: See `research/inventory.md`
- **Specification**: See `spec.md`
