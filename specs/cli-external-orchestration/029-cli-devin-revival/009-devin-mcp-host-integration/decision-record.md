---
title: "Decision Record: Devin MCP-host integration"
description: "4 ADRs governing the Devin MCP-host integration phase: two-tier permission policy, additive-phase confirmation, embedding tier choice, working-directory/cold-bootstrap contract."
trigger_phrases: ["devin mcp host ADR", "devin two-tier permission policy"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/009-devin-mcp-host-integration"
    last_updated_at: "2026-07-24T06:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Authored 4 ADRs for phase 009; all Proposed, none yet Accepted"
    next_safe_action: "Live-verify ADR-001's mutation-tool enumeration before implementation"
    blockers: ["devin auth login needed for live verification of all 4 ADRs"]
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Which embedding tier is reliable in Devin's sandbox without Ollama?"]
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->
# Decision Record: Devin MCP-host integration

<!-- ANCHOR:adr-001 -->
## ADR-001: Two-tier permission policy

<!-- ANCHOR:adr-001-context -->
### Context
Devin's MCP permission matchers (`mcp__<server>__<tool>`, `mcp__<server>__*`, `mcp__*`) can restrict which tools a session may call, but cannot substitute for server-side trust enforcement. `mk-spec-memory` has no independent caller-trust gate at all - anything the matcher allows, the server executes. `mk-skill-advisor` has its own trust-default mechanism (`MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted`), but that mechanism was designed for OpenCode's transport model, not Devin's permission surface, and copying it into a shared, committed Devin config would silently grant broad mutation trust to every Devin session that reads the file.

**Constraints**: the policy must be shared (so every maintainer gets safe defaults without individual setup) but must never let a mutation happen by accident, and must still allow a maintainer who explicitly wants to enable advisor mutations to do so without editing the shared file (which would then grant that trust to everyone).
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: A two-tier config split. Tier 1 (`.devin/config.json`, committed, shared) registers all 3 servers with exact per-tool read-only allows and explicit deny/ask for every mutation tool - no trust-default flag of any kind. Tier 2 (`.devin/config.local.json`, gitignored, individual) is where a maintainer who accepts the mutation risk sets `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` (or equivalent) for themselves only.

**How it works**: Devin's own config precedence (session > project-local > project > user, confirmed in phase 001) means a maintainer's local override layers on top of the shared file without modifying it. Anyone who never creates a local override gets the safe, deny-by-default posture automatically.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| (a) Two-tier split [chosen] | Safe shared default; explicit, auditable, individual opt-in only | Two files to maintain instead of one | 9/10 |
| (b) Single shared file with mutations allowed by default | Simplest to author | Every Devin session for every maintainer gets mutation trust by default - the exact risk this phase exists to prevent | 1/10 |
| (c) Single shared file with mutations always denied, no opt-in path at all | Safest on paper | No path for a maintainer who genuinely needs advisor mutation access without editing the shared file for everyone | 4/10 |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
- What improves: mutation access is deny-by-default for everyone, with a real, individually-scoped opt-in path that doesn't require editing shared config.
- What it costs: two files to keep in sync conceptually (Tier 1's deny list must match Tier 2's example opt-in list).
- Risks table:
  | Risk | Impact | Mitigation |
  |---|---|---|
  | A maintainer commits their real `.devin/config.local.json` by accident | H | `.gitignore` entry (T010) + CHK-032 explicit git-status verification |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Necessary? | PASS | `mk-spec-memory` has no independent trust gate; a wrong default here is a real security-relevant mistake |
| 2 | Beyond Local Maxima? | PASS | Single-file always-allow and single-file always-deny-no-opt-out were both considered and rejected |
| 3 | Sufficient? | PASS | Covers both the safe-default need and the legitimate opt-in need |
| 4 | Fits Goal? | PASS | Directly matches the research's own §7.3 recommendation |
| 5 | Open Horizons? | PASS | Additional maintainers can each create their own Tier 2 file without touching Tier 1 |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
- What changes: `.devin/config.json` (Tier 1, new), `.devin/config.local.json.example` (Tier 2 template, new), `.gitignore` update.
- How to roll back: delete both files and the gitignore line; no server or launcher code is touched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Additive phase, not folded into 002-008

<!-- ANCHOR:adr-002-context -->
### Context
The MCP-host surface could conceivably be folded into an existing phase (e.g. phase 003's skill packet, or phase 008's hook-adapter work), since all are "Devin integration" in a loose sense.

**Constraints**: MCP-host registration is host-level config, unrelated to CLI-executor dispatch (phase 002), skill-packet structure (phase 003), or hook lifecycle events (phase 008/004). Mixing concerns risks destabilizing the higher-priority core revival phases with unrelated, externally-blocked verification work.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision
**We chose**: Keep this as a wholly separate, additive phase (009), depending only on phase 001 (the live contract pin), not on 002-008.

**How it works**: This phase can be implemented, verified, and closed independently of whether 002-008 have landed - its only shared dependency with them is the packet-wide `devin auth login` blocker.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| (a) Separate additive phase [chosen] | Clean separation of concerns; matches the research's own explicit recommendation | One more phase folder to maintain | 9/10 |
| (b) Fold into phase 003 (skill packet) | Fewer phases | Skill packet is per-executor-mode structure, not a natural home for host-level MCP config | 2/10 |
| (c) Fold into phase 008 (hook parity) | Some conceptual overlap (both are "Devin capabilities") | Hook adapters cover lifecycle events, not MCP registration - different protocol entirely | 2/10 |
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences
- What improves: phase 008's already-large scope (9 new adapter files) isn't further burdened with an unrelated concern; this phase can proceed independently once phase 001's contract is available.
- What it costs: one more phase folder in the packet.
- Risks table:
  | Risk | Impact | Mitigation |
  |---|---|---|
  | None identified specific to this decision | - | - |
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Necessary? | PASS | The research explicitly recommended this exact structure |
| 2 | Beyond Local Maxima? | PASS | Folding into 003 or 008 was considered and rejected as conceptually mismatched |
| 3 | Sufficient? | PASS | A standalone phase fully covers the MCP-host scope |
| 4 | Fits Goal? | PASS | Matches the packet's established pattern of adding new phases for genuinely new concerns (mirrors 008 itself) |
| 5 | Open Horizons? | PASS | Future MCP-host expansion (more servers) would extend this phase, not require a new one |
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation
- What changes: this phase folder itself (`009-devin-mcp-host-integration/`).
- How to roll back: delete the folder; nothing elsewhere in the packet references it as a hard dependency.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Embedding/network tier selection for mk-spec-memory

<!-- ANCHOR:adr-003-context -->
### Context
`mk-spec-memory`'s embedding cascade tries Ollama first, then a local hugging-face model (~250-600MB download on first use), then a cloud provider (OpenAI/Voyage). Devin's sandboxed Linux environment may not have Ollama available, and a silent fallback to a large first-run download or an unexpected cloud API call could surprise a maintainer.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision
**We chose**: Explicitly select and document one embedding tier for the Devin deployment context, rather than relying on the cascade's implicit fallback behavior. The exact tier choice is deferred to live verification (T017) - this ADR's decision is that a choice will be made and documented, not left to chance.

**How it works**: T017 verifies which tier is actually reachable in a real Devin sandbox; the winning tier is recorded in `implementation-summary.md` and referenced from the reference doc (T012), so a future maintainer knows what to expect rather than discovering it via an unexpected first-run delay or API call.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| (a) Explicit, live-verified choice [chosen] | No surprise first-run behavior; documented for future maintainers | Requires a live test to determine | 8/10 |
| (b) Trust the existing cascade's implicit fallback | No extra work | Could silently trigger a large first-run download or an unexpected cloud API call under Devin | 3/10 |
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences
- What improves: predictable, documented embedding behavior under Devin instead of an implicit, potentially-surprising cascade.
- What it costs: one live-verification task before this phase can close.
- Risks table:
  | Risk | Impact | Mitigation |
  |---|---|---|
  | The chosen tier becomes unavailable in a future Devin sandbox image | L | Re-verify if Devin's sandbox environment changes materially |
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Necessary? | PASS | An undocumented embedding fallback is a real operational surprise risk |
| 2 | Beyond Local Maxima? | PASS | Trusting the implicit cascade was considered and rejected |
| 3 | Sufficient? | PASS | One documented, verified tier is sufficient for this phase's scope |
| 4 | Fits Goal? | PASS | Matches NFR-P01's "no silent dependency on a missing local daemon" requirement |
| 5 | Open Horizons? | PASS | Re-verifiable if Devin's sandbox environment changes |
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation
- What changes: the chosen tier is documented in `implementation-summary.md` and `cli-devin/references/mcp-host-integration.md`; no code change to `mk-spec-memory` itself.
- How to roll back: N/A - this is a documented operational choice, not a code change.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Working-directory and cold-bootstrap contract

<!-- ANCHOR:adr-004-context -->
### Context
Devin's MCP config schema has no `cwd` field (confirmed in the research), yet all 3 launchers assume repo-root invocation and may run `npm install`/builds on first start (native modules: `better-sqlite3`, `sqlite-vec`, tree-sitter/WASM). Without an explicit contract, a Devin session launched from an unexpected directory, or one that assumes prebuilt artifacts exist, could fail silently or behave unpredictably.
<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
### Decision
**We chose**: Treat repo-root invocation and cold-bootstrap success as things to prove live across all 4 Devin session modes (fresh/resumed/sandboxed/handed-off), not assume from the schema's absence of a `cwd` field or from macOS-local development success.

**How it works**: T016 and T017 test this directly; any mode that fails to resolve repo-root or fails to bootstrap natively is documented as a known gap in `implementation-summary.md`, not silently glossed over.
<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| (a) Live-verify across all 4 session modes [chosen] | Only way to know the real behavior; matches this repo's general "confirm, don't assume" discipline | Requires 4 separate live test passes | 8/10 |
| (b) Assume repo-root works because the launchers already normalize CWD for OpenCode | Less work | OpenCode's own invocation guarantees may not hold for Devin's process model | 3/10 |
<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-consequences -->
### Consequences
- What improves: a documented, evidence-based understanding of exactly which Devin session modes work reliably.
- What it costs: 4 separate live test passes instead of one assumed-good pass.
- Risks table:
  | Risk | Impact | Mitigation |
  |---|---|---|
  | One or more session modes genuinely doesn't resolve repo-root correctly | M | Documented as a known gap, not silently claimed working |
<!-- /ANCHOR:adr-004-consequences -->

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Necessary? | PASS | No `cwd` field in Devin's schema makes this a genuine open question, not a formality |
| 2 | Beyond Local Maxima? | PASS | Assuming OpenCode's guarantee transfers was considered and rejected as unverified |
| 3 | Sufficient? | PASS | 4 session modes cover every documented Devin session type |
| 4 | Fits Goal? | PASS | Directly resolves research gap "does Devin invoke relative launcher commands from repo root in all session modes" |
| 5 | Open Horizons? | PASS | Re-testable if Devin adds new session modes in the future |
<!-- /ANCHOR:adr-004-five-checks -->

<!-- ANCHOR:adr-004-impl -->
### Implementation
- What changes: none to the launchers themselves; this ADR governs verification scope only (T016/T017).
- How to roll back: N/A - verification-only.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `../research/research.md` (source research, esp. §6 operational gaps, §7.3 two-tier policy)
