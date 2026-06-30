---
title: "Decision Record: lightweight CI, guard-not-codegen, seam-guard, tracked manifest, benchmark re-anchor"
description: "Five ADRs for phase 004 of the parent-nested-skill-pattern epic: ADR-001 chooses a lightweight CI gate (npx vitest + setup-python) over heavy npm ci; ADR-002 keeps the hardcoded projection maps plus a CI drift-guard rather than codegen now, so the advisor never reads the registry at runtime; ADR-003 strengthens the dependency-seams guard to catch the .cjs path.resolve array-form reach-in; ADR-004 force-adds the runtime package.json past .opencode/.gitignore so CI can install it; ADR-005 re-anchors the sk-code playbook counts as the benchmark's own regression anchors."
trigger_phrases:
  - "lightweight CI over npm ci adr"
  - "guard not codegen advisor maps adr"
  - "dependency-seams cjs path.resolve adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-parent-nested-skill-pattern/004-improvement-implementation"
    last_updated_at: "2026-06-15T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the five implementation ADRs for the improvement-implementation phase"
    next_safe_action: "Track the registry codegen follow-on; close out"
    blockers: []
    key_files:
      - ".github/workflows/routing-registry-drift.yml"
      - ".opencode/skills/deep-loop-runtime/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-004-improvement-implementation-decision-record"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Decision Record: implementation choices for the improvement-research findings

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Lightweight CI (npx vitest + setup-python) over heavy npm ci

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-15 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Making the C-plus routing guarantee real (finding #1) means a PR CI gate that runs the routing drift-guard, the parity suites, and `/doctor:parent-skill`. The first cut ran `npm ci` in `system-skill-advisor/mcp_server` to get a runtime for those suites, but that manifest is untracked and pulls heavy deps, so a fresh CI clone would fail on install.

### Constraints

- `system-skill-advisor/mcp_server/package.json` is untracked, so a fresh CI clone cannot install from it.
- Its closure pulls a `file:` sibling, `@huggingface/transformers`, and native `better-sqlite3` — heavy and failure-prone in a cold CI environment.
- The routing surface under test is dependency-free: `aliases.ts` has no imports, `workspace-root.ts` is node-only, and the suites shell to a stdlib-only `python3` dump.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: rewrite the gate to `npx --yes vitest@4.1.6` plus `actions/setup-python`, running the routing suites directly against the dependency-free surface instead of standing up the advisor's full manifest.

**How it works**: the workflow (`71a066c004`) installs only vitest and Python, then runs the routing drift-guard, the parity suites, and `/doctor:parent-skill` — none of which import the advisor's heavy deps.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Lightweight npx vitest + setup-python (chosen)** | Fast, reliable fresh-clone install; no convention change | Exercises only the routing surface | 9/10 |
| Track the advisor manifest and run `npm ci` | Full advisor runtime in CI | Broad convention change + heavy native/ML downloads for zero routing-coverage gain | 3/10 |
| Vendor a minimal CI-only lockfile | Avoids the untracked manifest | Second source of truth to keep in sync; more drift risk | 4/10 |

**Why this one**: the surface under test imports none of the advisor's heavy deps, so installing them buys no coverage and only adds fresh-clone failure modes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A fresh CI clone installs cleanly and quickly; no broad manifest-tracking convention change.
- No native/ML download flakiness in the gate.

**What it costs**:
- The gate exercises only the routing surface, not the full advisor install. Mitigation: that surface is exactly what the drift-guard and `/doctor` coverage check protect.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future check needs the advisor runtime | L | Treat manifest-tracking as a separate decision; do not make this gate heavy pre-emptively |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | C-plus needs a real CI gate; the heavy `npm ci` path could not install in a fresh clone |
| 2 | **Beyond Local Maxima?** | PASS | Considered tracking the manifest and vendoring a lockfile before choosing the lightweight path |
| 3 | **Sufficient?** | PASS | The routing surface is dependency-free, so vitest + python is the minimal viable runtime |
| 4 | **Fits Goal?** | PASS | Directly delivers the "drift caught in CI" guarantee that makes C-plus real |
| 5 | **Open Horizons?** | PASS | Leaves a clean path to add advisor-runtime coverage later as a separate decision |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.github/workflows/routing-registry-drift.yml` installs `vitest@4.1.6` via `npx` and Python via `actions/setup-python`, then runs the routing suites + `/doctor:parent-skill`.

**How to roll back**: `git restore .github/workflows/routing-registry-drift.yml` to drop the workflow, or revert `71a066c004` to return to the `npm ci` form (which CI cannot install).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep the hardcoded projection maps + a CI drift-guard rather than codegen now

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (revisitable; codegen tracked as a follow-on) |
| **Date** | 2026-06-15 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The research's top pick (finding #3, i01) was to codegen the advisor projection maps from `mode-registry.json` so they cannot drift. The maps are currently hand-maintained in `skill_advisor.py` and `aliases.ts`, and the "C-plus" guarantee is that they stay in sync with the registry.

### Constraints

- The advisor must not read `mode-registry.json` at runtime — doing so couples the advisor to a sibling skill's file and breaks the one-identity boundary.
- A codegen step must byte-match the current maps exactly, or it silently changes routing.
- The phase's mandate is invariant-preserving implementation, not a refactor that changes how routing resolves.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: keep the maps hardcoded and assert their sync with a CI drift-guard plus the `/doctor` advisor-sync coverage check, and defer the codegen as a tracked follow-on.

**How it works**: `parent-skill-check.cjs` check 4b asserts the canonical skill's `advisorRouting` matches the map exactly and check 4c WARNs on uncovered non-canonical lexical modes; the CI gate (`b08346a9bc`) runs both on every PR, so divergence fails CI without the advisor ever reading the registry.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hardcoded maps + CI drift-guard + /doctor coverage (chosen)** | Reliable drift-catching today; zero runtime coupling | Maps stay hand-maintained until codegen lands | 9/10 |
| Codegen the maps from the registry now | Maps cannot drift | Generator must byte-match live maps; a careful refactor that risks a routing change this phase must avoid | 5/10 |
| Make the advisor read the registry at runtime | No generator needed | Couples the advisor to a sibling skill's file; breaks one-identity | 2/10 |

**Why this one**: A3 (coverage check) + A4 (CI gate) deliver reliable drift-catching with no runtime coupling, leaving codegen as a clean low-urgency follow-on.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Drift is reliably caught in CI without the advisor reading the registry; the one-identity boundary stays intact.

**What it costs**:
- The maps remain hand-maintained until the codegen lands. Mitigation: the CI gate plus the coverage check fail the PR on any divergence, so a stale map cannot ship silently.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A map edit slips past review | M | The drift-guard + parity suites fail the PR on divergence |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | C-plus requires the maps to provably stay in sync with the registry |
| 2 | **Beyond Local Maxima?** | PASS | Weighed codegen and runtime-registry-read before choosing guard-plus-defer |
| 3 | **Sufficient?** | PASS | A3 + A4 catch any drift in CI; the guarantee holds without codegen |
| 4 | **Fits Goal?** | PASS | Directly delivers the drift-catching half of making C-plus real |
| 5 | **Open Horizons?** | PASS | Codegen stays a clean follow-on against the same registry |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `commands/doctor/scripts/parent-skill-check.cjs` gains check 4b (canonical exact-match) and check 4c (non-canonical coverage WARN).
- The advisor maps in `skill_advisor.py` / `aliases.ts` are left as-is (guarded, not generated).

**How to roll back**: revert the check 4b/4c additions in `parent-skill-check.cjs`; the maps and CI gate are independent and can stay.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Strengthen the dependency-seams guard to catch the .cjs path.resolve array-form reach-in

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-15 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-003-context -->
### Context

Cluster B added a `dependency-seams.vitest.ts` guard to prove `deep-loop-runtime` never reaches into `system-spec-kit/node_modules`. The first version matched only the `.ts` contiguous path form, but the runtime also reached in via a `.cjs` `path.resolve(...)` array form (the tsx-loader boot) in `loop-lock.cjs` and `fanout-merge.cjs`.

### Constraints

- The two Cluster-C reach-ins used exactly the array form the first guard version did not see.
- A guard that misses a real reach-in form gives false confidence the seam is clean.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: strengthen the `dependency-seams` guard to also catch the `.cjs` `path.resolve(...)` array-form reach-in, not just the `.ts` contiguous path.

**How it works**: the guard now matches both reach-in shapes, so a green result means no `system-spec-kit/node_modules` reach-in exists in either `.ts` or `.cjs` form.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Catch both contiguous and array forms (chosen)** | Matches every reach-in form the runtime uses | Slightly more pattern surface | 9/10 |
| Match only the `.ts` contiguous path | Simplest | Leaves the `.cjs` array form (the actual reach-ins) unguarded | 2/10 |
| Generic no-`system-spec-kit` text grep | Broad coverage | Flags legitimate doc references and the by-design `depends_on` edge | 3/10 |

**Why this one**: it targets exactly the two reach-in shapes the runtime actually uses, so green means a genuinely clean seam.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The guard fails on either reach-in form, so the MCP-free-but-self-contained seam stays honest.

**What it costs**:
- Marginally more pattern surface in the guard. Mitigation: patterns are pinned to the two known reach-in shapes, not a broad text match.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A novel reach-in shape appears | L | Add its pattern when seen; the two known forms are covered today |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The two real reach-ins used the form the first guard missed |
| 2 | **Beyond Local Maxima?** | PASS | Considered a broad text grep before pinning to the two reach-in shapes |
| 3 | **Sufficient?** | PASS | Both forms the runtime uses are now caught |
| 4 | **Fits Goal?** | PASS | Protects the self-containment guarantee from finding #4 |
| 5 | **Open Horizons?** | PASS | Easy to extend with a new pattern if a novel shape appears |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `deep-loop-runtime` `dependency-seams.vitest.ts` matches both the `.ts` contiguous path and the `.cjs` `path.resolve(...)` array form.

**How to roll back**: revert the array-form pattern in `dependency-seams.vitest.ts`; the guard reverts to `.ts`-only matching.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Force-add deep-loop-runtime/package.json past .opencode/.gitignore

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-15 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-004-context -->
### Context

Runtime self-containment (finding #4) requires `deep-loop-runtime` to ship its own dependency manifest. The repo's `.opencode/.gitignore` keeps local-only `package.json` / `node_modules` out of git by default, so a freshly authored manifest would be untracked and invisible to CI.

### Constraints

- CI (and any fresh clone) can only install from a tracked manifest.
- There is an existing precedent: `system-spec-kit/mcp_server/package.json` is force-added past the same ignore rule for the same reason.
- The runtime's native dep (`better-sqlite3`) must match `system-spec-kit`'s version for ABI safety.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: force-add `deep-loop-runtime/package.json` and `package-lock.json` past the local-only `.opencode/.gitignore`, pinning better-sqlite3 12.10.0 / zod 4.4.3 / tsx 4.21.0 to match `system-spec-kit`.

**How it works**: the manifest is tracked despite the ignore rule, mirroring the `system-spec-kit/mcp_server` precedent, so `npm ci` installs it cleanly in CI and on a fresh clone.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Force-add just this manifest (chosen)** | Tracks exactly what CI needs; consistent with precedent | A tracked file under an ignored tree is a small surprise | 9/10 |
| Leave the manifest local-only | No ignore exception | CI cannot install it; self-containment is unverifiable in CI | 2/10 |
| Relax `.opencode/.gitignore` globally | Simple rule | Starts tracking every local `package.json` / `node_modules` | 2/10 |

**Why this one**: it tracks the single manifest CI needs, consistent with the existing `system-spec-kit/mcp_server` exception.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- `npm ci` installs cleanly in CI (88 pkgs) and a fresh clone has a working runtime at pinned, ABI-safe versions.

**What it costs**:
- A tracked manifest under an otherwise-ignored tree is a small surprise. Mitigation: it follows an established precedent and is documented here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Pinned versions drift from `system-spec-kit` | M | Pins chosen to match; bump both together for ABI safety |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | An untracked manifest is invisible to CI; self-containment must be CI-verifiable |
| 2 | **Beyond Local Maxima?** | PASS | Considered local-only and a global ignore relax before the targeted force-add |
| 3 | **Sufficient?** | PASS | One tracked manifest gives CI and fresh clones a working runtime |
| 4 | **Fits Goal?** | PASS | Required to verify the self-containment guarantee from finding #4 |
| 5 | **Open Horizons?** | PASS | Follows the existing mcp_server precedent; no new convention to maintain |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `deep-loop-runtime/package.json` + `package-lock.json` are force-added (`git add -f`) past `.opencode/.gitignore`, with better-sqlite3 12.10.0 / zod 4.4.3 / tsx 4.21.0 pinned.

**How to roll back**: `git rm --cached` the two files to untrack them and restore the prior ignore behavior.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Re-anchor the sk-code playbook counts rather than treat them as out-of-scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-15 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-005-context -->
### Context

Restoring skill-benchmark Lane C surfaced 3 stale parser anchors: the sk-code playbook had grown from 24 to 28 scenarios (19 routing + 2 advisor + 7 browser). These counts could be read as documentation drift outside this phase's scope, but they are the benchmark's own regression anchors.

### Constraints

- The counts belong to `deep-loop-workflows`' own tests, which Lane C exercises.
- The drift was confirmed real by running the parser, not assumed.
- Leaving them stale keeps Lane C red at HEAD, which blocks the phase's "suites green" gate.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: re-anchor the sk-code playbook counts (24→28, confirmed by running the parser) as part of this phase, because they are the benchmark's own regression anchors rather than unrelated documentation.

**How it works**: the 3 stale parser anchors were updated to the parser-confirmed inventory (19 routing + 2 advisor + 7 browser), restoring Lane C to green (`216e9448d8`).
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Re-anchor to parser-confirmed counts (chosen)** | Restores Lane C on evidence; keeps anchors honest | A doc/anchor change lands inside an implementation phase | 9/10 |
| Treat the counts as out-of-scope doc drift | Narrower diff | Lane C stays red; the phase cannot claim green suites | 2/10 |
| Bump the counts to silence the parser without verifying | Fast | Risks hiding a real scenario regression | 1/10 |

**Why this one**: the change is to the benchmark's own anchors and was driven by running the parser, so it is a real regression fix, not cosmetic.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Lane C is green (71/71) on a verified scenario inventory; the benchmark's anchors reflect reality.

**What it costs**:
- A doc/anchor change lands inside an implementation phase. Mitigation: the change is to the benchmark's own anchors and was parser-driven, not cosmetic.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The playbook grows again and re-staling the anchors | L | Re-run the parser when the playbook scenario set changes |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Lane C was red at HEAD until the anchors matched the real scenario count |
| 2 | **Beyond Local Maxima?** | PASS | Considered out-of-scope and blind-bump before the parser-verified re-anchor |
| 3 | **Sufficient?** | PASS | The parser-confirmed counts restore Lane C to 71/71 |
| 4 | **Fits Goal?** | PASS | Required to satisfy the phase's "suites green at HEAD" gate |
| 5 | **Open Horizons?** | PASS | Re-running the parser is the standard refresh path going forward |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- The 3 stale parser anchors are updated to the parser-confirmed sk-code playbook inventory (19 routing + 2 advisor + 7 browser = 28).

**How to roll back**: revert the anchor edits in `216e9448d8`; Lane C returns to its prior (red) state.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
