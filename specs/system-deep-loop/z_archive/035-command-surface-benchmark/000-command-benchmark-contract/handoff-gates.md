---
title: "Command Benchmark Phase Handoff Gates"
description: "Frozen gate commands, evidence obligations, and accepted exit codes for phases 000 through 010 of the command-surface benchmark packet."
trigger_phrases:
  - "command benchmark handoff gates"
  - "command benchmark phase gate"
  - "command benchmark exit codes"
importance_tier: "important"
contextType: "implementation"
---

# Command Benchmark Phase Handoff Gates

## 1. OVERVIEW

These gates define the evidence contract between phases 000 through 010. A successor starts only after its predecessor records the named command, accepted exit, and concrete evidence.

## 2. GATE POLICY

Every phase must satisfy its row before its successor begins. `0` is the only accepted gate exit unless the row explicitly names a retry state. Exit `75` means the executor never received a valid behavioral cell and the cell must be rerun; it never satisfies a handoff. A command that produces a valid subject `FAIL` may still exit `0` because instrument success and subject conformance are separate.

Commands are run from the repository root. Downstream phases that author a path named below must preserve the frozen path and command-line interface or return to phase 000 for a contract amendment.

Common bindings:

```bash
PACKET=.opencode/specs/system-deep-loop/066-command-surface-benchmark
PACKAGE=.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface
LANE_CONFIG=$PACKAGE/lane-config.json
EVIDENCE_ROOT=$SPEC_FOLDER/evidence/command-benchmark/$RUN_ID
```

## 3. PER-PHASE GATE TABLE

| Phase | Gate command | Required evidence | Accepted exit |
| --- | --- | --- | ---: |
| `000-command-benchmark-contract` | `G000` census and taxonomy reconciliation | Prompt-sync PASS; `36` sources; `36` mirrors; topology counts `27 / 2 / 5 / 2`; total `36`; unclassified `0`. | `0` |
| `001-create-benchmark-conformance-family` | `G001` package, document, JSON, authoring-only, and family-parity checks | Four template sources and guide validate; shipped package exists; JSON parses; family parity passes and fails closed in its negative fixture; dry authoring invokes no adapter or benchmark run. | `0` |
| `002-deterministic-fixtures-oracle` | `G002` independent-oracle verifier | Clean control has zero findings; eight public and four held-out defect fixtures exactly match frozen expected codes and locations; hashes and oracle provenance match; production adapter is not imported. | `0` |
| `003-command-contract-adapter` | `G003` syntax, reference, and adapter tests | Adapter syntax passes; discovery equals the frozen source inventory; S1-S5 fixtures match oracle expectations; generic document finding types are absent. | `0` |
| `004-command-lane-integration` | `G004` scoping, full-corpus alignment, and evidence-integrity verifier | `sk-doc / docs / sk-doc-command` resolves; all 36 commands are covered; convergence is true; zero corrupt deltas; raw and reduced finding counts/codes agree; generic and peer adapters never share scope in one run. | `0` |
| `005-command-behavior-evaluator` | `G005` shared framework tests | Schema-v2 direct-dispatch, postcondition, setup-misbind, and boundary fixtures pass; schema-v1 parsing and DAB-001 through DAB-011 scores are unchanged; one hermetic v2 result is scored. | `0` |
| `006-command-topology-pilot` | `G006` four-topology pilot capture and reconciliation | One workflow, subaction, direct-tool/plugin, and monolithic scenario each has a pinned Claude result and one GPT result; evidence agrees on target and boundary classification; no unresolved retryable cell. | `0` per cell and reconciliation |
| `007-command-scenario-rollout` | `G007` scenario-package and baseline reconciliation | Exactly DAB-012 through DAB-027 exist; IDs, index rows, hashes, and baseline rows agree; all 16 Claude cells are quotable; DAB-001 through DAB-011 remain unchanged. | `0` |
| `008-bounded-command-matrix` | `G008` bounded matrix scheduler and manifest reconciliation | Every required driver or leaf cell is a result or predeclared skip; fixture hashes match; contested cells have three recorded samples; no scoring logic exists in the scheduler. | `0`; `75` is retry-only |
| `009-command-benchmark-command` | `G009` command validation, reference/sync gates, and hermetic launcher smoke | Command and assets validate; references resolve; census becomes `37 / 37`; conformance-only, behavior-only, and `--axis=all` smoke paths complete; a deliberate subject failure reports `INSTRUMENT=VALID`. | `0` |
| `010-scorecard-and-closeout` | `G010` closeout reconciliation and recursive strict validation | Final `37 / 37` census; separate deterministic and behavioral scorecard sections; remediation backlog; family, launcher, mirror, references, adapter/reducer, metadata, map, graph, checklist, and summaries agree. | `0` |

## 4. FROZEN COMMAND BUNDLES

### G000 — Contract freeze

```bash
node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs --check

awk -F'|' '
  /^\| `\.opencode\/commands\// {
    topology=$4
    gsub(/^[[:space:]]+|[[:space:]]+$/, "", topology)
    counts[topology]++
    total++
  }
  END {
    printf "workflow=%d subaction=%d direct=%d monolithic=%d total=%d\n",
      counts["`workflow router`"], counts["`subaction router`"],
      counts["`direct-tool/plugin router`"], counts["`monolithic`"], total
    ok = total == 36 &&
      counts["`workflow router`"] == 28 &&
      counts["`subaction router`"] == 2 &&
      counts["`direct-tool/plugin router`"] == 5 &&
      counts["`monolithic`"] == 2
    exit(ok ? 0 : 1)
  }
' "$PACKET/000-command-benchmark-contract/topology-taxonomy.md"
```

The source and mirror count commands in `census-snapshot.md` are part of G000 and must each print `36`.

### G001 — Authoring family

```bash
python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py \
  .opencode/skills/sk-doc/create-benchmark --check --strict

python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
  .opencode/skills/sk-doc/create-benchmark/assets/conformance_benchmark/conformance_benchmark_readme_template.md --type readme
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
  .opencode/skills/sk-doc/create-benchmark/assets/conformance_benchmark/conformance_benchmark_contract_template.md --type readme
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
  .opencode/skills/sk-doc/create-benchmark/assets/conformance_benchmark/conformance_benchmark_lane_config_template.md --type readme
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
  .opencode/skills/sk-doc/create-benchmark/assets/conformance_benchmark/conformance_benchmark_fixture_manifest_template.md --type readme
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
  .opencode/skills/sk-doc/create-benchmark/references/conformance_benchmark/conformance_benchmark_authoring_guide.md --type readme

python3 -c 'import json,sys; json.load(open(sys.argv[1], encoding="utf-8"))' "$PACKAGE/lane-config.json"
python3 -c 'import json,sys; json.load(open(sys.argv[1], encoding="utf-8"))' "$PACKAGE/fixtures/fixture-manifest.json"
node --test .opencode/skills/sk-doc/create-benchmark/scripts/tests/conformance-benchmark-family-parity.test.cjs
```

The phase-owned parity test path is frozen by this contract. Its negative fixture must remove one family asset directory in an isolated temporary copy and observe a nonzero test assertion without mutating the live package.

### G002 — Independent oracle

```bash
node .opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/verify-command-oracle.cjs \
  --manifest "$PACKAGE/fixtures/fixture-manifest.json" \
  --require-clean-zero \
  --require-public 8 \
  --require-held-out 4
```

Exit `0` means exact expected-set equality and verified hashes, not merely that the verifier ran. The verifier path and flags are the interface phase 002 must implement.

### G003 — Peer adapter

```bash
node --check .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs
node .opencode/commands/scripts/validate-command-references.cjs
node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/sk-doc-command.test.cjs
```

The adapter test must import expectations from the frozen manifest, not oracle implementation helpers.

### G004 — Lane integration

```bash
node .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs \
  --lane-config "$LANE_CONFIG" --json

opencode run --command deep/alignment -- \
  --lane-config "$LANE_CONFIG" \
  --spec-folder "$SPEC_FOLDER" \
  :auto

node .opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/verify-command-lane-run.cjs \
  --alignment-dir "$SPEC_FOLDER/alignment" \
  --expected-corpus 36
```

The phase-owned verifier must fail on incomplete coverage, non-convergence, corrupt deltas, raw/reduced mismatch, or peer/generic scope collision.

### G005 — Behavior evaluator

```bash
node --test .opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs
```

Phase 005 extends this suite. The gate remains the shared test entry point rather than a packet-local duplicate.

### G006 — Four-topology pilot

```bash
node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/command-topology-pilot.test.cjs
```

The phase-owned test reconciles DAB-012 through DAB-015 contracts with the eight captured Claude/GPT result records and rejects `env_error`, missing provenance, topology duplication, or an uncovered topology.

### G007 — Scenario rollout

```bash
node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/command-scenario-rollout.test.cjs
node --test .opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs
```

The phase-owned reconciliation test owns the exact 16-row set and pinned baseline presence; the shared suite owns backward compatibility for DAB-001 through DAB-011.

### G008 — Bounded matrix

```bash
node .opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs \
  --matrix .opencode/skills/system-deep-loop/deep-alignment/assets/command_benchmark/command_benchmark_matrix.json \
  --out-dir "$EVIDENCE_ROOT/behavioral"
```

The scheduler interface is frozen as `--matrix` plus `--out-dir`. Exit `0` requires manifest reconciliation; `75` preserves retry evidence and blocks handoff.

### G009 — Launcher

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
  .opencode/commands/deep/command-benchmark.md --type command
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py \
  .opencode/commands/deep/command-benchmark.md
node .opencode/commands/scripts/validate-command-references.cjs
node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs --check
node .opencode/commands/scripts/smoke-command-benchmark.cjs \
  --spec-folder "$SPEC_FOLDER" \
  --run-id "$RUN_ID"
```

The smoke script must cover `conformance`, `behavior`, and `all`, then inject one subject defect and confirm the terminal envelope keeps `INSTRUMENT=VALID` separate from subject `FAIL`.

### G010 — Closeout

```bash
node .opencode/commands/scripts/validate-command-references.cjs
node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs --check
node .opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/verify-command-benchmark-closeout.cjs \
  --packet "$PACKET" \
  --expected-corpus 37
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$PACKET" --recursive --strict
```

The closeout verifier must reject averaged axes, missing remediation links, any census other than `37 / 37`, and conflicting completion state across packet surfaces.

## 5. HANDOFF EVIDENCE RULE

Each phase records the exact command, exit code, relevant counts or hashes, and evidence path in its implementation summary. A prose claim such as “tests pass” is insufficient. The successor consumes the recorded evidence and re-runs cheap gates when its inputs can drift, especially census, hashes, scoping, reference resolution, and prompt sync.
