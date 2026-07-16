# Iteration 003 — Deterministic validation blind spots

## Focus

RQ3: identify command-surface defects missed by `validate_document.py --type command` and the 066 benchmark, then define deterministic checks.

## Evidence and findings

### F08 — Three reported P0 route cycles are comment-derived false positives

The alignment report marks cycles through `create_readme_auto.yaml`, `create_readme_confirm.yaml`, and `doctor/_routes.yaml` as P0. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/004-command-lane-integration/alignment/alignment-report.md:8-26] The cited create lines are comments naming the source command, not route instructions. [SOURCE: .opencode/commands/create/assets/create_readme_auto.yaml:28-43] The doctor line is a “Read by” comment. [SOURCE: .opencode/commands/doctor/_routes.yaml:1-14] The adapter extracts command-looking targets from raw YAML text, then builds cycles without edge-kind filtering. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:387-420]

Candidate delta: parse YAML, walk only schema-declared executable route fields, preserve source location and edge kind, and exclude comments, examples, and provenance strings.

Acceptance criterion: the three current comments produce zero edges; fixtures containing actual cyclic dispatch fields produce S3 failures with an executable edge trace.

### F09 — Reference validation excludes three routed families

The reference checker describes existence validation but hard-codes only `create`, `deep`, and `design`, then scans their YAML assets. [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:11-25] [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:39-46] [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:142-151] `speckit`, `memory`, and `doctor` are in the requested routing surface and own executable assets, so broken references there can escape this check.

Candidate delta: derive reference families from the command inventory and each command contract's declared assets rather than a family constant.

Acceptance criterion: deleting or misspelling a declared target in any of the six routed families fails the same reference check; the report lists exact covered commands and asset roots.

### F10 — The command census can drift while mirror sync remains green

The completed command-lane packet froze a 36-command topology and reserved a later delta to 37. [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/000-command-benchmark-contract/implementation-summary.md:42-60] The current mirror sync reports 38 prompts because it compares the generated mirror count only to the current discovered inventory, not an approved census. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:217-225] Therefore source and mirror can drift together and still pass.

Candidate delta: add a reviewed command-census manifest containing source path, family, topology, mirror name, and approval packet; make inventory discovery a comparison input rather than the source of truth.

Acceptance criterion: an unmanifested command, a missing manifested command, or a topology/mirror-name change fails with a manifest delta; an explicit manifest update is required to accept it.

### F11 — Cross-layer semantics remain unchecked

The benchmark rules cover mirrors/reachability, subaction maps/cycles, declared required tools, destructive flags, and presentation markers. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:365-493] They do not compare argument requirements, mode defaults, timeout bounds, or prose claims to runtime consumers. A concrete miss: `deep/research` says a timeout flag can raise the limit above four hours, while runtime defines four hours as a hard maximum and only permits narrowing. [SOURCE: .opencode/commands/deep/research.md:140-146] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1139-1149]

Candidate delta: add contract parity checks for argument optionality, mode matrix, timeout min/default/max, destructive confirmation, and asset ownership, reading authoritative runtime constants or exported schemas.

Acceptance criterion: a fixture changing either side of each contract produces a named mismatch; live `deep/research` timeout prose fails until aligned with runtime.

## Ruled out

- Accepting benchmark severity without reproducing the graph edge. Findings are hypotheses until the producer is traced.
- Regex improvements over raw YAML. A more complex regex still cannot reliably distinguish comments from executable fields.
- Treating mirror parity as census control. Two synchronized generated surfaces can drift together.

## Iteration assessment

New-info ratio: 0.82. This iteration both invalidated three apparent P0s and found four deterministic coverage gaps: edge semantics, family coverage, approved census, and cross-layer contract parity.
