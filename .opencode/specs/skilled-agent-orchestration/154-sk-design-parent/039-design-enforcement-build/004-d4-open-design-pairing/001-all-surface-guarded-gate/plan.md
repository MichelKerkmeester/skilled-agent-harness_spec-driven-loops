---
title: "Implementation Plan: All-surface guarded proxy + openDesignDesignPrecondition contract"
description: "Authoring plan for a guarded-proxy boundary CONTRACT (references/guarded_proxy.md + policy) that normalizes MCP/HTTP/CLI/Skills requests and enforces a deny-by-default DESIGN_PROOF_TOKEN precondition before inner-agent spawn / build-fire."
trigger_phrases:
  - "guarded proxy plan"
  - "opendesigndesignprecondition contract"
  - "all-surface gate design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/001-all-surface-guarded-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Confirm the guarded proxy plan against the delivered contract and mark phases done"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: All-surface guarded proxy + openDesignDesignPrecondition contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | Markdown CONTRACT/POLICY reference doc — NOT a live running server, no executable code ships in this phase |
| **Deliverable** | New `.opencode/skills/mcp-open-design/references/guarded_proxy.md` + an embedded JSON policy block (its policy) |
| **Validates** | `DESIGN_PROOF_TOKEN v1` per `.opencode/skills/sk-design/references/design_proof_token.md` (boundary-side contract, §6–§7) |
| **Classification source** | `.opencode/skills/mcp-open-design/references/tool_surface.md` §2 (the ~18-tool inventory) and §3 (surface/gate/omit policy) |
| **Anchor** | `.opencode/skills/mcp-open-design/SKILL.md:209` — one daemon, four interchangeable surfaces; existing `design_gate` prose at SKILL.md:164–175 |

### Overview
One Open Design daemon backs four interchangeable surfaces (stdio MCP, HTTP API, `od` CLI, in-app Skills), so no single per-surface hook covers them all. The only convergent chokepoint is the run/build boundary — the point just before an inner agent is spawned and a build is fired. This phase authors a CONTRACT that defines a guarded proxy at that chokepoint: it normalizes any surface's request into one canonical shape, then runs `openDesignDesignPrecondition` as a deny-by-default validator that requires a valid, fresh `DESIGN_PROOF_TOKEN` for every design-feeding or mutating call while letting pure-transport calls pass untouched. The contract also names — honestly, not silently — the residual it cannot close: the daemon ships unmodifiable inside the Mac app, so a raw-HTTP-port call or an in-app Skills-UI message that reaches the daemon without traversing the agent-side adapter cannot be forced through the proxy.

This is a documentation/contract authoring task. The plan specifies WHAT `guarded_proxy.md` must say; it does not stand up a proxy, modify the daemon, or rewrite `SKILL.md`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Convergent chokepoint identified (run/build boundary; SKILL.md:209 evidence)
- [x] Token boundary contract available and read (`design_proof_token.md`, the precondition validates THIS)
- [x] Tool inventory + safe/gate/omit classification available (`tool_surface.md` §2–§3)
- [x] Residual is known and must be named (bundled daemon is unmodifiable)

### Definition of Done
- [x] `guarded_proxy.md` defines the boundary, the request-normalization contract, the precondition, and the exemption model
- [x] An embedded JSON policy block enumerates guarded vs exempt tools, derived from `tool_surface.md`
- [x] The daemon-side residual is stated as out of scope, not hidden
- [x] Acceptance scenarios are specified in the doc and verified in `checklist.md`
- [x] Evergreen [HARD]: no spec/packet/phase IDs or spec paths in the authored doc

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deny-by-default boundary contract anchored at the single convergent run/build chokepoint. The guarded proxy is an agent-side logical boundary over the four wired adapters — not a daemon-side interceptor.

### Key Components (of the CONTRACT the doc defines)
- **Canonical request shape**: one normalized object every surface adapter maps into (surface, tool/verb, mutation class, `feedsDesignDecision`, explicit target, `designProofToken`, payload digest inputs).
- **Surface adapters**: MCP / HTTP / CLI / Skills translators that produce the canonical shape; lossless on the security-relevant fields.
- **Two-axis classifier**: `(mutationClass × feedsDesignDecision)` → GUARDED or EXEMPT. Mirrors SKILL.md `design_gate`: RUN is always design work, and a design-feeding READ is design work too.
- **`openDesignDesignPrecondition`**: the deny-by-default validator. For GUARDED requests it delegates token validity to the `DESIGN_PROOF_TOKEN` boundary contract (schema, digests, file hashes, modes, time/TTL, replay, surface-binding) and adds a canonical surface-match check. Emits ALLOW or DENY.
- **Exemption allowlist**: a POSITIVE list of pure-transport tools that bypass the token requirement; anything unlisted defaults to GUARDED.
- **Policy block**: the machine-readable JSON enumerating guarded vs exempt tools, derived from `tool_surface.md`.
- **Residual statement**: the named, out-of-scope daemon-side bypass.

### Data Flow (the contract specifies)
1. A request arrives on one of the four surfaces (MCP / HTTP / CLI / Skills).
2. The matching adapter normalizes it into the canonical request shape.
3. The two-axis classifier labels it GUARDED or EXEMPT using the policy block.
4. EXEMPT (pure-transport, non-design-feeding read) → pass through untouched.
5. GUARDED → `openDesignDesignPrecondition` runs the `DESIGN_PROOF_TOKEN` boundary validation plus the surface-match check.
6. VALID fresh token → ALLOW → inner-agent spawn / build-fire proceeds. Any failure, missing token, unreadable input, or ambiguous classification → DENY (fail closed).
7. Direct-to-daemon paths that skip the adapter (raw HTTP port, in-app Skills chat) are named as the residual the proxy cannot govern.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Ground the contract
- [x] Re-read the token boundary contract (`design_proof_token.md` §2 schema, §6 boundary, §7 acceptance, §8 consumers).
- [x] Re-read `tool_surface.md` §2 (read-only 11 / mutating 5 / destructive 2) and §3 (surface / gate / omit).
- [x] Read SKILL.md:209 (one daemon, four surfaces) and the `design_gate` prose at SKILL.md:164–175.
- [x] Fix the canonical request field set and the GUARDED-vs-EXEMPT rule before writing prose.

### Phase 2: Author guarded_proxy.md
- [x] Section 1 — Purpose: guarded-proxy boundary; CONTRACT not a running server; why the run/build chokepoint.
- [x] Section 2 — Boundary placement: agent-side, before inner-agent spawn / build-fire; the four wired adapters it governs.
- [x] Section 3 — Request-normalization contract: canonical request shape (field table) + per-surface adapter mapping; lossless on security fields.
- [x] Section 4 — Two-axis classification: `mutationClass × feedsDesignDecision` → GUARDED/EXEMPT, cross-referencing `tool_surface.md` and `design_gate`.
- [x] Section 5 — `openDesignDesignPrecondition`: deny-by-default contract; delegate token validity to `DESIGN_PROOF_TOKEN`; surface-match check; fail-closed rules; ALLOW/DENY decision.
- [x] Section 6 — Exemption allowlist: positive list of pure-transport tools; unlisted → GUARDED; must NOT block legitimate non-design transport.
- [x] Section 7 — Policy block: embedded JSON enumerating `guarded[]` vs `exemptTransport[]`, derived from `tool_surface.md`.
- [x] Section 8 — Residual & boundary of enforceability: name the daemon-side bypass (raw HTTP port + in-app Skills UI), out of scope because the bundled daemon is unmodifiable.
- [x] Section 9 — Acceptance: the three acceptance conditions stated in-doc.

### Phase 3: Verification
- [x] Confirm the three acceptance scenarios are specified (deny on every wired surface; exempt passes; residual named).
- [x] Evergreen grep: no spec/packet/phase IDs or spec paths in `guarded_proxy.md`.
- [x] Internal references resolve to `design_proof_token.md` and `tool_surface.md`.
- [x] Two-axis classifier covers every tool in the `tool_surface.md` inventory (no tool unclassified).
- [x] OPTIONAL thin cross-link from SKILL.md anchor — DEFERRED: SKILL.md left untouched to hold scope to the one new doc.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This is a contract doc; "tests" are structural and acceptance-coverage checks, not runtime tests.

| Check Type | Scope | Method |
|-----------|-------|--------|
| Acceptance coverage | Deny on each wired surface without token; exempt passes; residual named | Read each acceptance scenario back against the doc body |
| Evergreen [HARD] | No spec/packet/phase IDs or spec paths in the authored doc | `rg` for `specs/`, packet IDs, `NNN-`, phase tokens |
| Reference integrity | Precondition delegates to `design_proof_token.md`; classification derives from `tool_surface.md` | Resolve relative links; confirm cited section names exist |
| Classifier completeness | Every tool in `tool_surface.md` §2 maps to GUARDED or EXEMPT | Diff policy-block tool set against the §2 inventory |
| Structure | Markdown valid, headings/anchors present, JSON policy block parses | Markdown lint + `jq` over the fenced JSON block |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `design_proof_token.md` (token boundary contract) | Internal (read-only) | Green | Precondition cannot delegate token validity; the gate has nothing to validate |
| `tool_surface.md` §2/§3 (tool inventory + classification) | Internal (read-only) | Green | Policy block cannot enumerate guarded vs exempt sets |
| `SKILL.md:209` + `design_gate` prose (164–175) | Internal (read-only) | Green | Loses the one-daemon-four-surfaces evidence and the design-feeding-read rule |
| Bundled Open Design daemon | External (unmodifiable) | Named residual | Cannot be governed; explicitly out of scope (drives the residual statement) |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The contract proves inconsistent with the token boundary contract, or a reviewer rejects the enforcement model.
- **Procedure**: Delete `references/guarded_proxy.md`; if the optional SKILL.md cross-link line was added, remove that single line. Purely additive documentation — no runtime, daemon, or wiring impact.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Ground) ──> Phase 2 (Author guarded_proxy.md + policy) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Ground | None | Author |
| Author | Ground | Verify |
| Verify | Author | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Ground the contract | Low | 30–45 minutes |
| Author guarded_proxy.md + policy block | Medium | 2–3 hours |
| Verification (acceptance, evergreen, classifier completeness) | Low | 45–60 minutes |
| **Total** | | **3.25–4.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-authoring Checklist
- [x] Confirm no existing `references/guarded_proxy.md` would be overwritten (it is a new file)
- [x] Feature flag configured (N/A — static reference doc, no runtime toggle)
- [x] Monitoring alerts set (N/A — no runtime surface)

### Rollback Procedure
1. **Immediate**: Delete `.opencode/skills/mcp-open-design/references/guarded_proxy.md`.
2. **Cross-link**: If a SKILL.md anchor line was added, revert that one line only.
3. **Verify**: Confirm `mcp-open-design` references render with no dangling link to the removed doc.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — additive documentation only; nothing persisted outside the doc file.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Contract/doc authoring task: deliverable is references/guarded_proxy.md + embedded JSON policy
- PLANNING ONLY: no live target edits, no codex, no strict-validate in this phase
-->
