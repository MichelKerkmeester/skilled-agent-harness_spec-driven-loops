---
title: sk-doc Command Adapter: standardSource, discover, check
description: The command-surface peer adapter contract for mirror identity, target reachability, route integrity, capability and safety consistency and presentation ownership.
trigger_phrases:
  - "sk-doc command adapter"
  - "command surface alignment"
  - "command contract findings"
  - "command peer adapter"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# sk-doc Command Adapter

The `sk-doc-command` peer adapter checks cross-artifact integrity across the canonical OpenCode command corpus. It keeps the existing `sk-doc` authority and `docs` artifact class while applying command-specific rules through the standard three-method adapter contract.

---

## 1. OVERVIEW

### Contract

The adapter implements:

```text
discover(scope) -> { artifacts, nodes }
standardSource(authority) -> sources and rules
check(artifact, rules[, options]) -> findings
```

The adapter does not register itself. Lane registration and live alignment execution belong to the integration owner.

### Ownership Boundary

This adapter owns cross-file command conformance:

- canonical source and generated mirror identity
- declared target reachability
- route-graph integrity across four execution topologies
- declared capability and destructive-action safety consistency
- presentation ownership across routers and declared assets.

Generic command-Markdown validation remains owned by `validate_document.py --type command`. The adapter never calls that validator, translates its messages or emits its finding types.

---

## 2. STANDARDSOURCE("SK-DOC")

`standardSource('sk-doc')` returns the sources used by the peer adapter:

| Group | Source | Purpose |
| --- | --- | --- |
| Validator | `.opencode/commands/scripts/validate-command-references.cjs` | Shared command target, mirror and topology inventory signals |
| Inventory | `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` | Exact live canonical-source and generated-mirror parity gate |
| Template canon | `.opencode/skills/sk-doc/create-command/SKILL.md` | Command frontmatter, routing, capability and presentation rules |
| Topology rules | Command topology taxonomy | Execution-ownership classification for workflow, subaction, direct-tool/plugin and monolithic commands |
| Adapter rules | `sk_doc_command_adapter.md` | S1 to S5 finding definitions and mapping |
| Deviations | `sk_doc_command_known_deviations.md` | Peer-specific suppression data |

Calling `standardSource()` with an authority other than `sk-doc` throws. The peer selector changes the adapter module, not the lane authority.

---

## 3. DISCOVER(SCOPE)

`discover(scope)` accepts the shared `paths`, `globs` and `branchRange` shapes. Path and glob scopes select only canonical command sources from the shared command-reference inventory. Support directories, `README.md` files and compiled contract files stay outside the inventory, matching the prompt-sync source contract.

Before returning a live inventory, `discover()` runs `sync-prompts.cjs --check`. The method stops when prompt sync fails or its count differs from the shared inventory. A `branchRange` scope returns empty artifacts and nodes because this peer audits the live command surface.

Each artifact is `{ path }`. Each parallel node uses the shared `FILE` shape and carries `authority: sk-doc`, `artifactClass: docs`, `adapter: sk-doc-command` and the classified topology in metadata.

---

## 4. CHECK(ARTIFACT, RULES, OPTIONS)

`check()` accepts one discovered command source. A direct caller may pass a repository-shaped directory with `fullCorpus: true` to evaluate a complete fixture tree in one call. The engine-compatible `check(artifact, rules, options)` form and the direct `check(artifact, options)` form return the same flat finding shape:

```js
{
  code: 'CMD-S2-WORKFLOW-TARGET-MISSING',
  severity: 'P0',
  dimension: 'S2',
  location: '.opencode/commands/example.md:20',
}
```

The adapter sorts and de-duplicates findings by code, location and severity before applying peer-specific deviations.

---

## 5. DIMENSIONS AND FINDING CODES

### S1: Mirror Identity

S1 compares canonical source inventory and generated runtime mirrors. The shared reference checker provides source-to-mirror ownership and identity locations. The prompt-sync CLI remains the exact live parity gate.

| Code | Severity | Location |
| --- | --- | --- |
| `CMD-S1-MIRROR-MISSING` | P0 | Expected mirror path, line 1 |
| `CMD-S1-MIRROR-DRIFT` | P1 | First mismatched mirror identity line |
| `CMD-S1-ORPHAN-MIRROR` | P1 | Canonical pointer line in the orphan mirror |

### S2: Target Reachability

S2 checks concrete `.opencode/commands/` targets declared by canonical command sources. Parameterized targets remain outside deterministic resolution.

| Code | Severity | Location |
| --- | --- | --- |
| `CMD-S2-WORKFLOW-TARGET-MISSING` | P0 | First source line declaring the missing YAML |
| `CMD-S2-PRESENTATION-TARGET-MISSING` | P1 | First source line declaring the missing presentation asset |
| `CMD-S2-EXECUTION-TARGET-MISSING` | P0 | First source line declaring another missing execution target |

### S3: Route-Graph Integrity

S3 applies topology-aware route checks. Subaction labels must agree with their target workflow's declared subaction. Workflow assets must not point back to the command that owns them. Commands that satisfy no topology fail closed.

| Code | Severity | Location |
| --- | --- | --- |
| `CMD-S3-SUBACTION-TARGET-MISMATCH` | P1 | Source route line |
| `CMD-S3-ROUTE-CYCLE` | P0 | Back-edge line in the workflow asset |
| `CMD-S3-TOPOLOGY-UNCLASSIFIED` | P0 | Canonical source line 1 |

### S4: Capability And Safety Consistency

S4 compares each workflow's `required_tools` with the command frontmatter `allowed-tools`. It also blocks destructive workflows that explicitly disable confirmation.

| Code | Severity | Location |
| --- | --- | --- |
| `CMD-S4-CAPABILITY-UNDECLARED` | P1 | Undeclared required-tool line |
| `CMD-S4-DESTRUCTIVE-WITHOUT-CONFIRMATION` | P0 | `requires_confirmation: false` line |

### S5: Presentation Ownership

S5 is intentionally conservative. It reports an explicit `[presentation:<marker>]` duplicated between a source router and a declared asset, or a byte-exact presentation asset copied into the source. Natural router prose never triggers S5.

| Code | Severity | Location |
| --- | --- | --- |
| `CMD-S5-PRESENTATION-OWNER-DUPLICATED` | P2 | Explicit duplicated marker in the source |
| `CMD-S5-PRESENTATION-ASSET-LEAKED` | P2 | Start of the exact copied asset block |

---

## 6. FOUR-TOPOLOGY COVERAGE

Classification follows execution ownership with this precedence:

1. `direct-tool/plugin router`
2. `subaction router`
3. `workflow router`
4. affirmative `monolithic`

The shared reference-checker self-test materializes one clean source for each topology and requires all four classifications with zero unresolved declared targets. The live baseline classifies every canonical command with zero unclassified rows.

---

## 7. NON-CIRCULAR FIXTURE PROOF

The production adapter depends only on live command canon, the shared reference checker, prompt sync, the topology contract and its peer deviation document. It does not load fixture expectations or the independent classifier implementation.

The adapter test imports the production adapter and reads the frozen expectation JSON as test data. It compares the returned finding arrays exactly for every public and held-out fixture. The separate boundary verifier scans the production file for forbidden provenance references.

---

## 8. KNOWN DEVIATIONS

Every finding passes through `sk_doc_command_known_deviations.md`. The initial list is empty because no command-specific exception has evidence strong enough to suppress an S1 to S5 finding. Generic document-validation messages cannot become peer deviations.

---

## 9. VERIFICATION

Use these checks before integrating the peer selector:

```bash
node --check .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs
node --check .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs
node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command-adapter.test.cjs
node .opencode/commands/scripts/validate-command-references.cjs --self-test
node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs --check
```

These checks prove syntax, frozen fixture parity, clean-control behavior, four-topology reference coverage and canonical discovery count. They do not register or execute a live alignment lane.

---

## 10. REFERENCES AND RELATED RESOURCES

- [sk_doc_command_known_deviations.md](./sk_doc_command_known_deviations.md), the peer-specific suppression list.
- [sk-doc-command.cjs](../../scripts/adapters/sk-doc-command.cjs), the executable adapter.
- [discover_contract.md](../discover_contract.md), the shared discovery input and output contract.
- [lane_config_schema.md](../lane_config_schema.md), the shared lane shape and peer selector field.
- [sk_doc_adapter.md](./sk_doc_adapter.md), the reference adapter structure mirrored by this peer.
