---
title: "Decision Record: pipeline command router inline — promote + drop bang + fold hardening"
description: "Records the choice of PATH A (promote the legacy body, drop the runtime bang, fold the autonomous directive) over keeping the bang or hand-authoring fresh triads, and the accepted deliberate reversal of packet 064's blessed compiled-stub stance for these 4 commands."
trigger_phrases:
  - "deep command router inline decision"
  - "promote drop bang fold hardening"
  - "compiled stub blessed variant reversal"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/012-deep-command-family-parity/004-pipeline-command-router-inline"
    last_updated_at: "2026-07-13T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded ADR-001 (PATH A) and ADR-002 (blessed-stub reversal)"
    next_safe_action: "Execute Phase 2 core implementation per plan.md"
---
# Decision Record: pipeline command router inline

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Promote the legacy body, drop the bang, and fold the autonomous directive (PATH A)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | Operator, Claude |

---

### Context

The operator wants all 7 `/deep:*` commands to share one self-describing router-triad shape. Four commands — `research`, `review`, `ai-council`, `alignment` — are still opaque ~10-line compiled-contract render stubs: frontmatter + an `# H1` + a single `!node render-command-contract.cjs --command deep/<name>` bang line that injects a compiled contract plus the legacy body at runtime. The committed file the operator opens is therefore not self-describing. We had to choose how to make each `command.md` a full inline `## 1..## 6` router while keeping the compile/render/drift pipeline in-repo.

### Constraints
- The pipeline must stay maintained in-repo (scripts, `compiled/*.contract.md`, `legacy/*.body.md`, `manifest.jsonl`, `command-injection-rollout.json`) — nothing deleted.
- The four must stay `fix` in the rollout so the render vitest `mode==='fix'` assertions stay green.
- Frontmatter `allowed-tools` must be preserved byte-for-byte — the drift checker's `checkToolAllowlist` depends on it.
- Autonomous (`:auto`) behaviour must be preserved after the bang is dropped.

---

### Decision

**We chose**: For each of the four commands, PROMOTE the content of its `assets/legacy/deep_<name>.body.md` (already a full `## 1..## 6` router) under the existing frontmatter + H1, REMOVE the bang line, and FOLD the command's compiled `autonomousExecutionDirective` into the promoted body as a short subsection.

**How it works**: The legacy body is lifted verbatim into the committed `command.md`, so the router is self-describing at rest. The `autonomousExecutionDirective` prose (the `:auto` "setup already resolved / do not halt for the CLAUDE.md Gate-3 gate under AUTONOMOUS + prebound spec folder / dispatch-only + route-proof" wording, from `assets/compiled/deep_<name>.contract.md`) is folded in as a subsection so autonomous behaviour survives without the bang. The pipeline stays dormant-but-maintained: the compiled contracts are recompiled, drift-checked, and render-compared, and the rollout keeps the four at `fix`. Dropping the bang decouples the LIVE runtime injection path; nothing is deleted.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **PATH A — promote + drop bang + fold hardening** | Self-describing `command.md` at rest; pipeline stays maintained; behaviour preserved; reversible by `git checkout` | Two representations of the router (inline body + legacy body) must be kept in sync | 9/10 |
| PATH B — hand-author fresh inline triads | Full editorial control of the inline body | Redundant work (the legacy body already is a full router); high drift risk vs. the compiler source | 5/10 |
| PATH C — keep the bang | No file movement | The compiled contract is injected at runtime and is NOT the file the operator opens, so it can't make `command.md` self-describing; the bang renders the router body twice and makes `validate_document.py` skip section checks (the `render-command-contract` marker triggers an early-return) | 3/10 |
| PATH D — delete the pipeline entirely | Single source of truth | Loses the maintained compile/render/drift safety net the operator explicitly wants kept | 2/10 |

**Why this one**: The compiled contract is a runtime injection, not the opened file, so only inlining the router makes `command.md` self-describing (rules out PATH C). The legacy body is already a full `## 1..## 6` router, so lifting it is lower-risk than re-authoring (rules out PATH B). The operator wants the pipeline kept (rules out PATH D). Investigation confirmed the machine-level Gate-3 satisfaction is driven by the spec-gate hook's runtime `classificationOptions` (execution mode + bound spec folder), NOT by parsing the injected compiled contract (no runtime code reads `gate3Precedence`); and the already-bang-less `agent-improvement`/`model-benchmark` triads run `:auto` with no compiled directive at all. So dropping the bang preserves machine behaviour, and folding the directive prose is belt-and-suspenders.

---

### Consequences

**What improves**:
- All 7 deep commands become self-describing router triads; the family reaches one uniform shape.
- `validate_document.py --type command` performs real section checks on the four (no `render-command-contract` early-return).
- The render/compile/drift safety net stays intact and reversible.

**What it costs**:
- The inline body and the legacy body now both represent the router. Mitigation: the legacy body stays the compiler source, recompiled and drift-checked, and the promotion lifts it verbatim so they start identical.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Bang drop changes machine-level Gate-3 satisfaction | M | Confirmed Gate-3 is driven by the hook's `classificationOptions`, not the injected contract; folded directive is belt-and-suspenders; live `:auto` smoke of research/review before merge |
| `allowed-tools` reformatted during promotion | M | Preserve frontmatter byte-for-byte; verify with `checkToolAllowlist` |
| Inline body drifts from legacy body over time | L | Legacy body stays the compiler source; drift sweep + render `--compare` catch divergence |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The four stubs are the only remaining non-uniform shape in the 8-command family |
| 2 | **Beyond Local Maxima?** | PASS | PATH B/C/D each weighed and rejected on concrete grounds |
| 3 | **Sufficient?** | PASS | Lifting the existing legacy router + folding the directive + recompile is the smallest change that makes the file self-describing while keeping the pipeline |
| 4 | **Fits Goal?** | PASS | Directly on the packet-064 "one uniform triad shape" critical path |
| 5 | **Open Horizons?** | PASS | Pipeline stays maintained; the change is reversible and does not foreclose future CI wiring |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `deep/{research,review,ai-council,alignment}.md` — stub replaced by the promoted inline router + folded directive; bang removed; frontmatter preserved.
- `assets/compiled/deep_{research,review,ai-council,alignment}.contract.md` — recompiled against the (unchanged) legacy bodies.
- create-command standard docs (`create-command/SKILL.md`, `command_router_template.md`, `command_template.md`) — corrected to stop citing these four as compiled-stub examples.

**How to roll back**: `git checkout` the four `command.md` files and the four recompiled contracts to restore the stub + bang; the pipeline scripts, rollout, and legacy bodies are untouched, so restoration is a pure revert.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Accept the reversal of packet 064's blessed compiled-stub stance for these 4 commands

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | Operator, Claude |

---

### Context

Earlier in packet 064, the compiled-stub shape (frontmatter + H1 + a single render bang) was a deliberate, blessed conformant variant: `research`/`review`/`ai-council` were intentionally kept as thin render stubs whose router body lived in the compiled contract + legacy body and was stitched in at render time. This phase inlines those routers and drops the bang, which directly contradicts that earlier stance. The reversal must be recorded explicitly rather than left implicit.

### Constraints
- The reversal applies only to the four render-pipeline commands (`research`, `review`, `ai-council`, `alignment`), not to the pipeline itself.
- The pipeline stays a maintained safety net; the reversal is about the LIVE runtime shape of `command.md`, not about retiring the compiler.

---

### Decision

**We chose**: Supersede 064's "compiled-stub is a blessed conformant variant" stance for these four commands. The self-describing inline router triad is now the single conformant shape for all 7 deep commands.

**How it works**: The compiled-stub shape is no longer accepted as conformant for the four commands. The pipeline stays present and maintained, but the committed `command.md` must be a full inline router. This is recorded as a deliberate, accepted reversal so future audits do not read it as accidental drift from 064.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept + record the reversal** | Honest audit trail; one conformant shape family-wide | Requires explicitly documenting a change of stance | 9/10 |
| Preserve the blessed-stub exception | No stated reversal | Leaves two conformant shapes; defeats the operator's uniform-shape goal | 3/10 |

**Why this one**: The operator's goal is one uniform, self-describing triad shape across all 7 commands. Keeping the blessed-stub exception would preserve exactly the inconsistency this phase removes. Recording the reversal keeps the audit trail honest.

---

### Consequences

**What improves**:
- One conformant shape for the whole deep command family; no special-case exception to remember.
- Future audits see an explicit, dated reversal instead of unexplained drift from 064.

**What it costs**:
- The 064 parent narrative now carries a superseded stance. Mitigation: this ADR is the durable record; the parent map is rolled up to point at phase 004.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future reader treats the reversal as accidental drift | L | This ADR records it as deliberate and dated; the parent rollup references phase 004 |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without the record, the inlining reads as an unexplained contradiction of 064 |
| 2 | **Beyond Local Maxima?** | PASS | The preserve-the-exception alternative was weighed and rejected |
| 3 | **Sufficient?** | PASS | A dated ADR is the minimal honest way to record a stance change |
| 4 | **Fits Goal?** | PASS | Directly supports the uniform-shape goal |
| 5 | **Open Horizons?** | PASS | Keeps the pipeline available; does not foreclose future variants if ever re-justified |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Packet stance: the blessed compiled-stub variant is superseded for the four render-pipeline commands.
- Documentation: this ADR plus the 064 parent Phase Documentation Map rollup record the change.

**How to roll back**: Reversing this stance means reverting ADR-001's promotion (restore the stubs + bang) and re-marking the four as `fix` blessed stubs; the stance record itself is documentation and needs no code change to undo.
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 2 packet with an added decision-record for the architectural reversal.
One ADR per major decision. Human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
