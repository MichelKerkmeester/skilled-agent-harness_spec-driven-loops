---
title: "Decision Record: Relocate the model registry + all model benchmarks into sk-prompt-small-model; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only [template:level_3/decision-record.md]"
description: "Three ratified decisions: benchmarks migrated wholesale to the hub; model-profiles.md deleted outright; deep-improvement model-benchmark hub-only with no local override."
trigger_phrases:
  - "model registry ADR"
  - "benchmark relocation decision"
  - "sk-prompt forkable decision"
  - "deep-improvement hub-only decision"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-relocate-model-registry-and-benchmarks"
    last_updated_at: "2026-06-03T04:03:34Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Decision record authored with three ratified ADRs"
    next_safe_action: "Spec complete — no further action required"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/131-relocate-model-registry-and-benchmarks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Relocate the model registry + all model benchmarks into sk-prompt-small-model; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Move All Benchmark Run-Data to the Hub Wholesale

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-03 |
| **Deciders** | MichelKerkmeester |

---

<!-- ANCHOR:adr-001-context -->
### Context

Benchmark run-data (fixtures, profiles, synthesis) for six model/prompt evaluations lived inside individual spec sub-phase directories. This made the data invisible to other sessions, impossible to cross-reference across runs, and stranded if the spec folder was archived or deleted. We needed to decide whether to keep per-spec copies, symlink from a hub, or move everything to the hub.

### Constraints

- Spec sub-phases are not permanent storage; they are work records that can be archived
- deep-improvement's .cjs benchmark scripts are already path-agnostic, so no harness changes are needed for a move
- The six runs represent significant evaluation effort that should be durable and discoverable
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Move all benchmark run-data wholesale to `sk-prompt-small-model/benchmarks/<name>/`, gut each sub-phase to a doc shell, and leave a `BENCHMARK-RELOCATED.md` pointer.

**How it works**: Each of the six sub-phase directories retains only its spec-kit documentation (spec.md, plan.md, tasks.md, etc.) and a `BENCHMARK-RELOCATED.md` file that records the hub destination. The full run-data — fixtures, profiles, harness outputs, and synthesis — lives exclusively in `sk-prompt-small-model/benchmarks/`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move wholesale to hub** | Single source of truth; durable; cross-referenceable | Sub-phase shells need pointers | 9/10 |
| Keep per-spec copies | No sub-phase changes needed | Data fragmentation; duplication; invisible to other sessions | 3/10 |
| Symlink from hub to spec | Hub as canonical; spec dirs still "contain" data | Symlinks fragile across worktrees and archives | 5/10 |

**Why this one**: Wholesale move gives durable, discoverable data in one place. The .cjs scripts' path-agnosticism means zero harness changes. Pointers in gutted sub-phases prevent confusion for anyone navigating old paths.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- All benchmark history is visible from a single directory listing
- Future benchmark runs land in the hub automatically (after deep-improvement routing update)
- Spec sub-phases can be archived without losing evaluation data

**What it costs**:
- Six sub-phase directories require gutting and pointer creation. Mitigation: scripted `BENCHMARK-RELOCATED.md` generation; one-time effort.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Old path cached in MCP memory index | L | Run `memory_index_scan` after migration |
| Consumer misses the move and reads from stale path | M | Repoint all ~121 refs; grep-verify post-migration |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Six sub-phases of benchmark data fragmented across spec folders; no cross-run visibility |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; wholesale move scores highest |
| 3 | **Sufficient?** | PASS | Move + pointer is the simplest complete solution |
| 4 | **Fits Goal?** | PASS | Hub consolidation is the primary goal of this spec |
| 5 | **Open Horizons?** | PASS | Hub layout scales to future benchmark runs without structural changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Six spec sub-phase benchmark dirs: content moved to hub, `BENCHMARK-RELOCATED.md` added
- `sk-prompt-small-model/benchmarks/`: six new named subdirectories with migrated run-data

**How to roll back**: `git mv` in reverse for each of the six sub-phase dirs; remove hub subdirs; delete `BENCHMARK-RELOCATED.md` files.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Delete model-profiles.md Outright

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-03 |
| **Deciders** | MichelKerkmeester |

---

<!-- ANCHOR:adr-002-context -->
### Context

`sk-prompt/references/model-profiles.md` was a human-readable markdown mirror of `model-profiles.json`. It was created to make the registry browsable without parsing JSON, but became a maintenance burden: any registry update required editing both files, and the two had drifted. We needed to decide whether to keep the MD file in hub location, convert it to auto-generated output, or delete it.

### Constraints

- The JSON is the authoritative source; the MD was always derived
- No tooling auto-generates the MD from JSON in this skill system
- The hub JSON is directly readable and can be queried with standard tools
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Delete `model-profiles.md` outright; the JSON registry at `sk-prompt-small-model/assets/model-profiles.json` is the single source of truth.

**How it works**: The file is removed from the repository. Any consumer that previously used the MD for human-readable browsing uses the JSON directly or queries it with `node -e` or `jq`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete outright** | No drift risk; single source of truth | Loses human-readable format | 9/10 |
| Move MD to hub alongside JSON | Keeps human-readable format | Two files to keep in sync; drift risk persists | 4/10 |
| Auto-generate MD from JSON on each update | Always in sync | Requires new tooling; adds build step | 6/10 |

**Why this one**: The MD provided no capability that the JSON lacks for tooling consumers. Human readers can use `jq` or `node -e` to inspect the JSON. Deleting removes the drift problem permanently with no new tooling investment.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No dual-maintenance burden; JSON is authoritative without a shadow copy
- sk-prompt becomes grep-clean of registry references, completing its forkable status

**What it costs**:
- Human readers lose a pre-rendered markdown view of the registry. Mitigation: `jq . model-profiles.json` or `node -e "console.log(JSON.stringify(require('./...'), null, 2))"` provides equivalent readability.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone expects MD file at old path | L | Git history retains the file; `BENCHMARK-RELOCATED.md` pattern is not used here but deletion is in commit log |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | MD was a stale mirror causing drift; JSON is sufficient |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; deletion scores highest |
| 3 | **Sufficient?** | PASS | Deletion eliminates the problem completely |
| 4 | **Fits Goal?** | PASS | sk-prompt forkability requires zero registry references |
| 5 | **Open Horizons?** | PASS | JSON-only pattern is consistent with all other registry surfaces |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `sk-prompt/references/model-profiles.md` deleted from repository

**How to roll back**: `git show HEAD~1:.opencode/skills/sk-prompt/references/model-profiles.md > restore.md` and re-add the file.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: deep-improvement Model-Benchmark Writes to Hub Only (No Local Override)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-03 |
| **Deciders** | MichelKerkmeester |

---

<!-- ANCHOR:adr-003-context -->
### Context

deep-improvement has multiple operational modes: agent-improvement, prompt-improvement, and model-benchmark. Prior to this spec, model-benchmark outputs defaulted to a spec-local directory, which is why the six historical benchmark runs ended up scattered across sub-phase folders. We needed to decide whether to keep spec-local as default with a hub override option, make hub the default with local fallback, or lock hub-only with no override.

### Constraints

- Agent-improvement and prompt-improvement work on a per-spec basis and must stay spec-local; only model-benchmark needs hub routing
- deep-improvement .cjs harness scripts are already path-agnostic (they accept `output_dir` from YAML config)
- Consistency is more valuable than flexibility here: if outputs can go to spec-local, they will, recreating the fragmentation problem
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Lock deep-improvement model-benchmark output to `sk-prompt-small-model/benchmarks/{run_label}` exclusively, with no spec-local default and no per-invocation override.

**How it works**: `auto.yaml` and `confirm.yaml` for the model-benchmark command set `output_dir` to the hub path. SKILL.md documents this as a hard routing rule. The .cjs harness scripts read `output_dir` from YAML and write there without modification.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hub-only, no override** | Guarantees hub consolidation; no fragmentation risk | No flexibility for offline/sandboxed runs | 9/10 |
| Hub default, spec-local override | Flexible | Override path recreates fragmentation problem | 5/10 |
| Spec-local default, hub as named option | Backward compatible | Default behavior contradicts the consolidation goal | 2/10 |

**Why this one**: The only failure mode of hub-only is an offline environment where the hub path is unavailable — which is the same constraint as any other skill asset. Flexibility in output location recreates the original problem immediately.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Every future model-benchmark run automatically lands in the hub; no manual relocation needed
- Cross-run comparison is possible without navigating spec folders
- Other deep-improvement modes (agent-improvement, prompt-improvement) are unaffected and remain spec-local

**What it costs**:
- No local output option for model-benchmark. Mitigation: hub path is always accessible in the same working tree where deep-improvement runs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hub path doesn't exist on a fresh clone | M | Hub dir creation is part of setup; validate in pre-run check |
| User expects spec-local output | L | SKILL.md and YAML comments document hub-only routing clearly |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Spec-local default caused the fragmentation problem this spec solves |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; hub-only scores highest |
| 3 | **Sufficient?** | PASS | YAML `output_dir` change is the complete implementation |
| 4 | **Fits Goal?** | PASS | Hub consolidation is the primary goal; routing change enforces it perpetually |
| 5 | **Open Horizons?** | PASS | Hub-only is consistent with how other persistent skill assets are managed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `deep-improvement/commands/auto.yaml`: `output_dir` set to `sk-prompt-small-model/benchmarks/{run_label}`
- `deep-improvement/commands/confirm.yaml`: same change
- `deep-improvement/SKILL.md`: hub-only routing documented in model-benchmark section

**How to roll back**: Revert `output_dir` in both YAML files to the previous spec-local path; update SKILL.md accordingly.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
