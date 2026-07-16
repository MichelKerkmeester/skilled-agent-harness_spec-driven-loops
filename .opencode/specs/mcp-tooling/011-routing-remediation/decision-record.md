---
title: "Decision Record: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability"
description: "ADR-001 adjudicates fallback-only vs universal-default semantics for routerPolicy.defaultResource (the review's blocking precondition); ADR-002 scopes route-gold hard-gate enforcement in the shared skill-benchmark harness as an opt-in flag defaulting on for hub-type skills."
trigger_phrases:
  - "defaultResource semantics adr"
  - "route-gold hard gate adr"
  - "routing remediation decisions"
  - "fallback vs universal default"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/011-routing-remediation"
    last_updated_at: "2026-07-16T19:05:00Z"
    last_updated_by: "claude"
    recent_action: "Authored ADR-001 and ADR-002, both Proposed"
    next_safe_action: "Operator rules on ADR-001 before WS1 implementation"
    blockers:
      - "ADR-001 stays Proposed until the operator confirms the fallback-only ruling"
    key_files:
      - "decision-record.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-routing-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "ADR-001 operator ruling: option (a) fallback-only recommended"
    answered_questions:
      - "Original hub ADRs do not define defaultResource; ADR-006 defines only defaultMode as a weak default with defer-on-ambiguity"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fallback-only semantics for routerPolicy.defaultResource

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (2026-07-16, Phase 0 gate: fallback-only, option (a) — ruling recorded in the Adjudication note below; operator may overturn) |
| **Date** | 2026-07-16 |
| **Deciders** | Operator (ruling required at implementation start) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`hub-router.json` declares `routerPolicy.defaultResource: ["mcp-chrome-devtools/SKILL.md"]`, and the deterministic consumer unions that default into EVERY route's resource set (`router-replay.cjs:514`: every entry of `router.defaultResource` is added to the assembled set regardless of the selected mode). That single mechanism produces the review's F002 P0 (Chrome contaminates all five non-Chrome routes) and amplifies F001 (a failed Figma route returns only the Chrome default) and F015 (packet gold rows disagree about whether always-loaded defaults belong in `expected_resources`). The review's planSeed makes this decision the explicit precondition: "Adjudicate fallback versus universal-default semantics before changing router data."

The hub's original ADR lineage was checked (`.opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/decision-record.md`). It does NOT rule on `defaultResource`: ADR-001's implementation section specifies only "base three outcomes (`single`, `orderedBundle`, `defer`), `routerPolicy.defaultMode:"mcp-chrome-devtools"`", and ADR-006 defines `defaultMode` as "a weak default: genuinely ambiguous non-matching queries should `defer`/disambiguate rather than silently default." The `defaultResource` field shipped in the router data without any ADR coverage. The lineage therefore cannot settle this decision by citation, but its defer-first, weak-default intent points the same direction as option (a).

### Constraints

- Whatever semantics are chosen must be implemented identically in the runtime router prose, the deterministic replay (`router-replay.cjs`), and the scenario gold (`expected_resources`) - divergence between these three is the F008/F014 mechanism.
- The chosen semantics must keep MT-H01's certified-clean Chrome-vs-Aside boundary intact.
- ADR-006's accepted defer-on-ambiguity posture is standing hub policy; this ADR must not silently contradict it.

> **Adjudication (2026-07-16, orchestrator ruling, operator may overturn):** Option (a) accepted. Basis: the hub's founding ADR-006 records defer-first intent ("genuinely ambiguous non-matching queries should defer/disambiguate rather than silently default") and `defaultResource` shipped with no ADR coverage; the reviewer's findings F002/F013 assume fallback-only semantics. Reversal path: git revert of the WS1 commit restores universal-default behavior.
<!-- adjudication-note -->

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option (a) - `defaultResource` applies ONLY on the no-signal fallback path; scored routes assemble exactly the selected mode's declared resources.

**How it works**: The resource assembler stops unioning `defaultResource` into scored routes; it is consulted only when zero modes score and the ADR-006 defer path does not fire (or, if the operator rules that zero-signal always defers, `defaultResource` becomes the defer-time suggestion rather than a loaded resource). All 13 hub scenarios' `expected_resources` then declare only mode-owned resources, and the route-gold gate (ADR-002) enforces exactly that. **Final ruling: this recommendation requires operator confirmation at implementation start (Phase 0 gate); the original hub ADRs do not pre-decide it.**
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **(a) Fallback-only defaultResource (chosen, pending ruling)** | Restores single-mode isolation (fixes F002 for all scored routes); matches the reviewer's evident intent ("no implicit Chrome contamination", spec seed) and ADR-006's weak-default posture; smallest diff to router data | Zero-signal behavior still needs one decision (fallback vs pure defer); replay and runtime both need the same branch change | 9/10 |
| (b) Remove defaultResource entirely; defer on no-signal | Simplest data model; no privileged packet at all; fully consistent with ADR-006 defer-first | Loses the "give the operator something on a dead prompt" affordance; slightly worse cold-start UX for genuinely toolless queries; more scenario churn (negative gold must assert empty resources everywhere) | 7/10 |
| (c) Keep universal base gold; every scenario declares the Chrome default in expected_resources | No router behavior change; only gold data changes | Blesses the contamination instead of fixing it: every non-Chrome route permanently loads an unrelated browser-debugging packet, violating the single-mode isolation the transport/hub canon requires; contradicts the review's F002 impact statement outright | 2/10 |

**Why this one**: The review found the mechanism, not just the symptom - correct routes receive an unrelated packet. Option (a) removes the contamination while preserving a deliberate, ADR-006-consistent story for zero-signal prompts, and it is the only option that fixes F002 without either over-deleting (b) or normalizing the defect (c).
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- All five non-Chrome routes stop loading the Chrome packet; exact-resource route gold becomes assertable (unblocks ADR-002 enforcement).
- The router data model finally has documented semantics for `defaultResource`, closing the ADR-coverage gap the lineage check exposed.

**What it costs**:
- Every consumer of the no-signal branch changes behavior (runtime prose, replay, negative gold). Mitigation: F013/F014 work items align all six packet fallback branches in the same phase, with parity assertions.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator rules differently at Phase 0 (option b or c) | M | The plan isolates the ADR-001-dependent edits in WS1/WS2 tasks so a different ruling changes data values, not the plan structure |
| Zero-signal UX degrades if fallback is removed without a defer message | L | Pair the ruling with an explicit defer/disambiguation outcome per ADR-006 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F002 is a verified P0; the review's planSeed names this adjudication as the blocking precondition |
| 2 | **Beyond Local Maxima?** | PASS | Three semantics (fallback-only, remove, universal-base) specified and scored; lineage ADRs checked for a prior ruling |
| 3 | **Sufficient?** | PASS | A single semantics decision plus consistent producer/consumer/gold edits; no new router machinery invented |
| 4 | **Fits Goal?** | PASS | Directly resolves the release-blocking contamination on the critical path to re-review PASS |
| 5 | **Open Horizons?** | PASS | Fallback-only semantics generalize to any future hub mode without re-litigating |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/mcp-tooling/hub-router.json` - `routerPolicy.defaultResource` retained but documented/consumed as fallback-only (or per operator ruling).
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` - resource assembly stops unioning defaults into scored routes (the line-514 union becomes fallback-branch-only).
- 13 hub `expected_resources` blocks and the six packet negative fixtures aligned to the ruled semantics.

**How to roll back**: `git revert` the WS1 commit(s); the frozen `benchmark/baseline/` report and Phase 0 regression fixtures preserve the pre-change behavior record for comparison.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Route gold becomes a hard benchmark gate via a harness-wide opt-in flag, default on for hub-type skills

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (2026-07-16, Phase 0 gate: scope confirmed as planned — harness-wide opt-in flag, default on for hub-type skills) |
| **Date** | 2026-07-16 |
| **Deciders** | Operator (with WS2 implementation) |

---

<!-- ANCHOR:adr-002-context -->
### Context

F008 (P0): the committed baseline benchmark reports PASS with `routeGoldRows: 0` while its own telemetry shows seven route-contract violations - the scenario loader parses `expected_intent`/`expected_resources` (`load-playbook-scenarios.cjs:313-316`), but the Mode A path never consumes them as pass/fail gold. Route-declaration checks (`hasRouteGold`) exist only on the Mode B live/codex executor paths. The scoring change must decide its scope: the harness at `system-deep-loop/deep-improvement/scripts/skill-benchmark/` is shared - sk-code, sk-design, sk-git, cli-external-orchestration, and system-deep-loop itself hold frozen benchmark baselines produced by it, and a silent harness-wide behavior change would invalidate those baselines retroactively.

### Constraints

- The fix must make a route mismatch impossible to certify as PASS for mcp-tooling (the review's spec seed: "a route mismatch cannot remain a PASS").
- Other skills' frozen baselines must remain interpretable: their historical reports were produced without route-gold gating and must not be re-scored or invalidated by default.
- A parse failure on an authored gold block must fail loudly (silent skip is the F008 mechanism).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Implement route-gold hard gating in the shared harness behind a harness-wide flag (e.g. a `routeGoldGate` run option), defaulting ON for hub-type skills (skills with a `hub-router.json`/`mode-registry.json` pair) and OFF otherwise; existing non-hub baselines stay valid.

**How it works**: Mode A scoring consumes every parsed `expected_intent`/`expected_resources`/negative assertion as gold rows; any mismatch fails the scenario and the run verdict. The flag's default is derived from the target skill's hub markers, so mcp-tooling (and other hubs) get enforcement without per-run ceremony, while non-hub skills opt in when their corpora are ready. The report records the flag state and the route-gold row count so a `routeGoldRows: 0` PASS on a hub-type skill is structurally impossible.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Harness-wide opt-in flag, default on for hub-type skills (chosen)** | One shared implementation; hubs get enforcement by default; other skills' frozen baselines preserved; flag state auditable in the report | Flag logic adds a small configuration surface; hub detection must be explicit and tested | 8/10 |
| mcp-tooling-only enforcement (skill-scoped fork or special case) | Zero risk to other consumers | Forks the shared harness's scoring semantics per skill; the same route-blindness bug stays live for every other hub (sk-code, sk-design, system-deep-loop are hubs too); invites drift | 4/10 |
| Unconditional harness-wide hard gate | Simplest semantics; every corpus with gold is enforced everywhere | Retroactively flips the meaning of other skills' frozen baselines and can break their CI comparisons without those owners' consent; exceeds this packet's mandate | 3/10 |

**Why this one**: The defect is a harness capability gap, not an mcp-tooling quirk, so the fix belongs in the shared harness - but blast radius to other consumers' frozen baselines is a named risk, and an opt-in flag with a hub-type default is the smallest shape that fixes F008 for every hub while leaving non-hub baselines untouched.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A PASS on a hub-type skill's Mode A benchmark becomes a real route-contract signal; F008's false-release mechanism is closed for all hubs, not just mcp-tooling.
- Gold parse failures fail loudly, closing the silent-skip channel.

**What it costs**:
- Other hub-type skills' NEXT benchmark runs may newly fail if their corpora carry latent route violations. Mitigation: their frozen baselines stay valid; new failures are true positives to be triaged by those owners, and the flag can be explicitly disabled per run during triage.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hub-type detection misclassifies a skill and silently disables the gate | M | Unit test the detection; the report prints flag state and route-gold row count for audit |
| Harness regression breaks non-mcp-tooling consumers | M | Run the harness vitest suite; control re-run of one non-mcp-tooling skill's Mode A benchmark with the flag off, verdict must be unchanged |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F008 is a verified P0: the CI gate certifies broken routing today |
| 2 | **Beyond Local Maxima?** | PASS | Skill-scoped and unconditional alternatives specified and scored against consumer blast radius |
| 3 | **Sufficient?** | PASS | One flag plus gold consumption in the existing scorer; no parallel scoring pipeline |
| 4 | **Fits Goal?** | PASS | Enables SC-002 (re-run under enforcement) and the route-violation control proof |
| 5 | **Open Horizons?** | PASS | Non-hub skills can opt in when ready; default can be widened later by a one-line policy change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `run-skill-benchmark.cjs` - flag plumbing, hub-type default derivation, report fields (flag state, route-gold row count).
- `load-playbook-scenarios.cjs` - loud failure on unparseable gold blocks.
- Mode A scoring path - consume intent/defer/resource assertions as hard gold (parity with the Mode B `hasRouteGold` contract).
- Harness `tests/` - new vitest coverage for gate-on, gate-off, hub detection, and parse-failure paths.

**How to roll back**: `git revert` the WS2 harness commit; the flag default makes partial rollback possible by policy change alone (set default off) without reverting the capability.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record: ADR-001 (defaultResource semantics, Proposed, operator ruling gates WS1) and ADR-002 (route-gold hard-gate scope, Proposed).
Write in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
