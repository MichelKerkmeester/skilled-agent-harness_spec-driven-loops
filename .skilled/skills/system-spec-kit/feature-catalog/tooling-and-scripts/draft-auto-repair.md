---
title: "Draft auto-repair"
description: "Runs the derived-metadata repair once during a strict validate of a Draft packet whose every error is recomputable, names each file it rewrote and validates again."
trigger_phrases:
  - "Draft auto-repair"
  - "SPECKIT_DRAFT_AUTO_REPAIR"
  - "validate repairs derived metadata"
  - "strict validate rewrote"
version: 1.0.0.0
---

# Draft auto-repair

## 1. OVERVIEW

Draft auto-repair settles recomputable metadata inside a `validate.sh --strict` run. A packet still being written often fails only on facts the repository can recompute, such as a graph file that no longer matches an edited summary. The validator fixes those itself and saves the author a round.

The repair never touches authored text. Every other path leaves the packet byte for byte as it was.

---

## 2. HOW IT WORKS

### When It Runs

The strict CLI run runs the repair once when all of these hold.

- The first report failed and the run used `--strict`.
- The `Status` row of `spec.md` reads Draft.
- Every error entry belongs to the derived set: `DESCRIPTION_SHAPE`, `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `GRAPH_METADATA_SHAPE` and `METADATA_DISK_PATH_CONSISTENCY`. `SPEC_DOC_INTEGRITY` is left out, because the repair tool fixes it only in part.
- A repository root holding `repair-derived.cjs` and `validate.sh` sits above the packet.

A packet with one authored error beside the derived ones is not repaired and goes back to its author.

### When It Refuses

The run skips the repair when the `SPECKIT_DRAFT_AUTO_REPAIR` switch is `0`, `false` or `off`, when the `CI` variable is set, or when `SPECKIT_RULES` names a subset of rules. A CI run checks a committed tree, and a narrowed run never evaluated the content rules it left out. Calling `validateFolder` as a library never writes.

### What It Prints

The run prints `Draft auto-repair:` with the reason, then one `rewrote <path>` line for each packet file whose content changed, then a note that it validated again. The report that follows is the second run. When the repair fails or rewrites nothing, the note says so and the first report stays. The notice goes to stderr under `--json` and `--quiet`, so stdout stays one report.

### Read-Only Tools

The repair tool runs the validator itself, so it starts the child validator with the switch at `0`. The other read-only tools that run the validator as a child do the same, so they never write.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Handler | Decides the refusal, runs the repair once and prints the notice |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Script | Documents the switch in its help text and starts the orchestrator |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Script | Rewrites the derived metadata |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/draft-auto-repair.vitest.ts` | Vitest | Proves the repair case and hashes the packet on every refusal |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/draft-auto-repair-rewrites-derived.md` | Manual playbook | Scenario 486, the rewrite and the switch |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/draft-auto-repair.md`

Related references:
- [derived-packet-repair.md](derived-packet-repair.md) - the tool the validator runs and the line it draws between derived and authored
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) - the engine whose strict run hosts the repair
