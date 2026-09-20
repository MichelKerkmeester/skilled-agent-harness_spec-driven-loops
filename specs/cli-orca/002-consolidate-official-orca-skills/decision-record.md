---
title: "Decision Record: Consolidate Official Orca Skills Into Standalone cli-orca"
description: "Architecture decisions behind the cli-orca extraction: class-S classification, the official-skill knowledge layer, snapshot storage, extraction order, and the worker model."
trigger_phrases:
  - "cli-orca decision record"
  - "adr extraction"
  - "class-S classification"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Consolidate Official Orca Skills Into Standalone cli-orca

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Extract the Orca CLI subject into a standalone class-S skill

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-20 |
| **Deciders** | Operator, orchestration session |

---

### Context

The mcp-tooling parent hub declares ten modes. Nine bridge MCP transports. The tenth, mcp-orca-cli, is a CLI-only workflow whose subject is stateful and version-bound. The hub's identity sentence, its mode table, its description keywords and its routing vocabulary must all carry that exception, and the hub cannot express version-matched CLI guidance at all.

### Constraints

- The hub's invariants must survive the change: registry modes, router signal keys and manifest entries stay aligned.
- The new root must be discoverable by the advisor, which requires an advisor identity.
- A standalone root may not carry hub-only files such as a registry, a router or a hub description.

---

### Decision

**Summary**: Remove the mode from the hub and promote its subject to a standalone class-S skill named `cli-orca`.

**Details**: The new root carries `SKILL.md`, `graph-metadata.json` and `leaf-manifest.config.json` as authored files, with the manifest and alias files generated. The hub drops the mode, its signal classes, its tie break entry, its stage-two map entries and every prose mention, then regenerates its manifest and re-runs its parent check.

---

### Alternatives Considered

| Alternative | Why it was not chosen |
|-------------|----------------------|
| Keep the mode in the hub | Perpetuates a permanent identity exception and gives the CLI surface no version-matched knowledge layer |
| Promote the subject without an upgrade | The extraction is only worth its blast radius if the new root also carries the official-skill knowledge |
| Make the new root a second hub | Adds a registry and router for a single subject, which the class-S contract exists to prevent |

---

### Consequences

**Positive**:
- The hub returns to a single responsibility with nine aligned modes.
- The CLI subject gains a root that can carry version-matched guidance and official-skill knowledge.
- Discovery improves because the advisor answers an Orca CLI prompt it previously ignored.

**Negative**:
- The extraction touches every hub discovery surface at once - Mitigation: one ordered edit pass plus the parent check immediately afterward.
- A new root adds one more class-S entry to the fleet catalogs - Mitigation: fleet catalog updates are part of the closing phase.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hub routing breaks silently | H | Parent check and routing replays compare against a captured before-state |
| The new root is not discoverable | M | Advisor replay with a positive prompt and an unrelated holdout |

---

### Implementation

**Affected Systems**: mcp-tooling hub metadata and router, the new cli-orca root, the advisor index, the fleet catalogs.

**Rollback**: Revert the hub edits by explicit path, delete the new root, and re-run the hub parent check.

---

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Carry each official skill as an authored reference plus a verbatim snapshot

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-20 |
| **Deciders** | Operator, orchestration session |

---

### Context

The vendored snapshot ships eight official skills, each as a short discovery stub whose real detail lives in version-matched guides inside the running CLI. A local skill that only names them is not useful, and one that copies them without provenance is not trustworthy.

### Constraints

- Upstream wording must not be paraphrased into something that looks official.
- The snapshot must remain byte-identical to its source, which rules out adding repository frontmatter to it.
- Each reference must follow the repository document contract to be maintainable.

---

### Decision

**Summary**: Author one reference per official skill in our own words with citations, and store each official `SKILL.md` verbatim as an asset with a provenance record.

**Details**: The references carry the routing guidance a user needs, including when the official surface is the wrong tool. The assets carry the exact upstream bytes plus the release revision, digest and refresh procedure. Version-matched detail is attributed to the guides that the stubs load at run time rather than being invented locally.

---

### Alternatives Considered

| Alternative | Why it was not chosen |
|-------------|----------------------|
| Reference the official skills by name only | Gives no usable guidance and no way to bound their use |
| Copy upstream text into the references and edit it | Blurs provenance and makes drift undetectable |
| Download the skills at run time | Adds a network dependency and loses reproducibility |

---

### Consequences

**Positive**:
- The knowledge layer is usable offline and traceable to a specific revision.
- Drift is detectable because the assets keep their exact bytes.

**Negative**:
- Two parallel representations of the same material - Mitigation: each reference links to its snapshot and states which one is authoritative for wording.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Upstream wording drifts | M | Provenance records the revision, digest and refresh procedure |
| A reference drifts from its snapshot | L | The reference cites the snapshot path and is reviewed against it |

---

### Implementation

**Affected Systems**: `references/orca-skills/**`, `assets/*.txt`, the skill router's reference table.

**Rollback**: Remove the assets and references, and drop their entries from the router and manifest.

---

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Keep verbatim snapshots outside the documentation extension scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-20 |
| **Deciders** | Orchestration session |

---

### Context

Two repository doc contracts require a four-part version field on skill documents under `references`, `assets`, `feature-catalog` and `manual-testing-playbook`. The official snapshots carry upstream frontmatter without that field. Adding the field would falsify the snapshot, and the gate offers no exemption for verbatim content.

### Constraints

- The snapshot bytes must stay identical to the vendored source.
- The repository gates must pass, because they are the completion authority.
- The deviation must be visible rather than silent.

---

### Decision

**Summary**: Store each snapshot with a `.md.txt` extension so the files leave the documentation scope while keeping their bytes.

**Details**: The gate enumerates documents by extension, so a non-markdown name keeps the content verbatim and the gate honest at the same time. The provenance file explains the extension and the refresh procedure, and this record makes the deviation explicit.

---

### Alternatives Considered

| Alternative | Why it was not chosen |
|-------------|----------------------|
| Add the version field to the snapshots | Falsifies upstream bytes and defeats the purpose of a verbatim snapshot |
| Exclude the assets directory in the gate | Weakens a fleet-wide gate for one local convenience |
| Omit the snapshots and keep only references | Loses the exact upstream wording the upgrade exists to preserve |

---

### Consequences

**Positive**:
- The gate passes without being weakened and the snapshots stay exact.

**Negative**:
- A reader may expect `.md` - Mitigation: the provenance file and the references name the extension and explain why.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future contributor renames the files back | L | The provenance file documents the reason and the gate failure mode |

---

### Implementation

**Affected Systems**: `assets/*.txt` and the provenance record.

**Rollback**: Rename the files and accept the gate failure, or add a version field if the operator prefers that trade.

---

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Remove the repository copy from the skill tree after proving equivalence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-20 |
| **Deciders** | Operator |

---

### Context

A 292 MB copy of the upstream repository lived inside the skill tree as research material. It is not referenced by any skill resource, it cannot be committed, and it dwarfs the skill it sits beside. The vendored copy under the packet context directory is the intended research home.

### Constraints

- The copy was never tracked, so no version-control history can recover it.
- The research corpus it holds is the source for the knowledge layer.
- A deletion of this size needs a proven equivalent before it happens.

---

### Decision

**Summary**: Delete the tree copy and keep the vendored snapshot as the single research copy, with an intact archive available for rollback.

**Details**: Equivalence was proven by recursive comparison against the vendored copy with zero differences, and an intact archive was located before removal. The provenance record and the baseline note carry the evidence.

---

### Alternatives Considered

| Alternative | Why it was not chosen |
|-------------|----------------------|
| Keep both copies | Doubles a large untracked tree for no benefit and invites drift |
| Compress the tree copy in place | Keeps the size problem and adds a second format to maintain |
| Move the tree copy into the packet context | Duplicates the vendored copy that already lives there |

---

### Consequences

**Positive**:
- The skill tree returns to a size proportional to its content.

**Negative**:
- Rollback depends on the archive and the vendored copy rather than on history - Mitigation: both were verified before removal.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The archive is lost later | L | The vendored copy remains byte-identical and the digests are recorded |

---

### Implementation

**Affected Systems**: the skill tree only.

**Rollback**: Restore from the archive or copy the vendored snapshot back into the tree.

---

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Dispatch research and writing passes to external read-only workers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-20 |
| **Deciders** | Operator |

---

### Context

The upgrade needs an inventory of eight official skills, an extraction of the CLI surface from version-matched guides, a routing boundary map, and roughly a dozen prose documents. Those passes read a large corpus and produce long artifacts, which is exactly the kind of work that saturates a single context.

### Constraints

- Workers are read-only and may not write outside the paths the brief names.
- Every load-bearing claim they produce needs a citation that resolves.
- Fatal-lane artifacts stay with the orchestrator: the routing contract and the identity metadata.

---

### Decision

**Summary**: Run research as three parallel read-only workers and writing as bounded single-document passes, each on a rostered external route with an automatic fallback.

**Details**: Each brief pre-resolves the documentation question, inlines the child-dispatch guidance, names the allowed read paths and the single write path, and requires path and line citations. Returns are validated and spot-checked before anything from them is used. The orchestrator authors the routing contract, the identity metadata and the hub edits itself.

---

### Alternatives Considered

| Alternative | Why it was not chosen |
|-------------|----------------------|
| Author everything in the orchestrator | Saturates one context on corpus reading that workers can do in parallel |
| Let workers write the routing contract | The contract encodes decisions that must stay with the orchestrator |
| Use one worker for the whole corpus | Loses parallel coverage and makes the fallback path all-or-nothing |

---

### Consequences

**Positive**:
- Research and prose scale past a single context window, and the orchestrator keeps the decisions.

**Negative**:
- Returns are unverified until checked - Mitigation: citation spot checks, document validation and content inspection before use.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A worker returns plausible but wrong content | M | Citations spot-checked against the source tree, documents validated |
| A rostered route hits a quota limit | M | The runner retries the second rostered route and records both attempts |

---

### Implementation

**Affected Systems**: the research artifacts under `scratch/` and the authored skill documents.

**Rollback**: Any returned document can be rewritten by the orchestrator or re-dispatched.

---

<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Keep the packet flat at Level 3 while the complexity score recommends phases

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-20 |
| **Deciders** | Operator |

---

### Context

The complexity scorer returns Level 3 with a phase recommendation for this work. The work itself is one ordered sequence of dependent steps with a single deliverable set, and the predecessor packet is a flat Level 3 packet.

### Constraints

- The packet must satisfy the Level 3 document contract.
- The migration record should stay comparable with the packet it documents.

---

### Decision

**Summary**: Author the packet as a flat Level 3 doc set and treat the phase recommendation as advisory.

**Details**: The phases live as sections inside `plan.md` and `tasks.md` rather than as child packets, which keeps the migration record in one place. If the work later splits into independently deliverable parts, a phased parent can be introduced then.

---

### Alternatives Considered

| Alternative | Why it was not chosen |
|-------------|----------------------|
| Create a phased parent with child packets now | Adds packet overhead for a sequence that does not deliver independently |
| Reduce the packet to Level 2 | Understates the blast radius and the verification burden |

---

### Consequences

**Positive**:
- One packet holds the whole migration record and matches the predecessor's shape.

**Negative**:
- A long packet - Mitigation: phases and milestones make the sequence navigable.

---

### Implementation

**Affected Systems**: this packet only.

**Rollback**: Split into a phased parent later if the work needs it.

---

<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Keep three deliberate Orca deferral mentions in the hub root files

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-20 |
| **Deciders** | Operator |

---

### Context

The extraction removes the Orca mode, its router signals, its vocabulary classes, its stage-two resource map entries and its manifest leaves from the hub. Three root-file mentions survive that sweep: a when-not-to-use bullet in the hub `SKILL.md`, a boundary sentence in the hub `README.md`, and a related-skills row that names the standalone skill.

### Constraints

- The hub must not appear to own Orca work any more, or a reader will route Orca requests back into it.
- The hub must still tell a reader where Orca work went, because the removal is invisible otherwise.

---

### Decision

**Summary**: Keep the three mentions as explicit cross-skill deferral statements and remove them from every machine-read routing artifact.

**Details**: No registry mode, router signal, vocabulary class, resource map entry, manifest leaf, catalog row or graph-metadata signal may name Orca. The three surviving prose mentions point at the standalone `cli-orca` skill and describe the boundary, so they carry the deferral contract rather than a stale claim of ownership.

---

### Alternatives Considered

| Alternative | Why it was not chosen |
|-------------|----------------------|
| Remove every Orca mention from the hub root files | Deletes the boundary contract and leaves readers with no pointer to the new owner |
| Keep the mode table row and mark it retired | A retired row still reads as hub membership and would keep the router signal alive |

---

### Consequences

**Positive**:
- A reader who arrives at the hub is told exactly which skill owns Orca work.
- The stale-reference sweep can assert that no machine-read artifact names the retired leaf path.

**Negative**:
- The word Orca still appears in three hub prose locations - Mitigation: each occurrence names `cli-orca` and is checked by the sweep with a documented exclusion for changelog history only.

---

### Implementation

**Affected Systems**: `.skilled/skills/mcp-tooling/{SKILL.md,README.md}`.

**Rollback**: Delete the three sentences if the deferral pointer is later expressed elsewhere.

---

<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Record the hub compiled-routing posture instead of republishing the activation manifest

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-20 |
| **Deciders** | Operator |

---

### Context

The hub's compiled routing depends on a promoted activation manifest at `.skilled/bin/lib/compiled-routing/013-live-activation/activation/<hub>/manifest.json`. Changing the hub mode set changes the policy hash that the manifest records, so `compiled-route-status.cjs` now reports `servingAuthority: legacy` with `causeCode: stale-manifest`. The tool that rebuilds the promoted closure cannot run, because its authored source root moved under `specs/sk-doc/z_archive/` before this work started.

### Constraints

- The extraction must not leave a hub that fails its own gates.
- A repair to the compiled-routing sync tooling is outside this packet's scope and was not approved.

---

### Decision

**Summary**: Record the posture as legacy authority, keep the prose router authoritative, and raise the republish as a follow-up item.

**Details**: The front door is designed to fall back to the prose smart-router when a hub is not compiled-serving. `parent-skill-check.cjs` still passes every hard invariant and `compiled-route-admission.cjs` still judges the hub as passing, so the hub routes correctly through its prose contract. The stale manifest is reported in the benchmark record and the implementation summary rather than being presented as compiled-serving evidence.

---

### Alternatives Considered

| Alternative | Why it was not chosen |
|-------------|----------------------|
| Re-point the sync tool at the archived authored tree and republish | Changes a shared runtime tool outside the approved scope |
| Copy the authored tree back to its old path | Recreates an archival decision this packet does not own |
| Leave the stale manifest unmentioned | Presents a degraded serving posture as if it were intact |

---

### Consequences

**Positive**:
- The hub keeps serving and every gate stays green.
- The posture is visible in one status command and in the recorded evidence.

**Negative**:
- The hub serves through the prose router instead of compiled tables - Mitigation: admission still passes and the republish is a named follow-up item.

---

### Implementation

**Affected Systems**: `.skilled/skills/mcp-tooling/**` routing artifacts, `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/**`.

**Rollback**: Republish the activation manifest once the sync tool can reach the authored tree.

---

<!-- /ANCHOR:adr-008 -->
