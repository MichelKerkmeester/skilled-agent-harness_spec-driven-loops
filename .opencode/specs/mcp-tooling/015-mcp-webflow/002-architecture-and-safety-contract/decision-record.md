---
title: "Decision Record: mcp-webflow architecture and safety contract (Phase 2 freeze)"
description: "Frozen decisions for the Webflow MCP 2.0 transport mode: classification, backend, authentication, permissions, confirmation and rollback policy, design pairing, and smoke target."
trigger_phrases:
  - "webflow decision record"
  - "mcp-webflow contract"
  - "webflow architecture freeze"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/002-architecture-and-safety-contract"
    last_updated_at: "2026-08-02T18:40:32Z"
    last_updated_by: "pi"
    recent_action: "Froze the architecture and safety contract from Phase 1 evidence"
    next_safe_action: "Phase 3 integrates the approved transport without re-deciding architecture"
    blockers: []
    key_files:
      - "decision-record.md"
      - "safety-matrix.md"
      - "../001-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Classification: transport (both lineages converged)"
      - "Backend: remote OAuth MCP with local-token fallback"
---
# Decision Record — mcp-webflow Architecture and Safety Contract

Source of evidence: `../001-deep-research/research/research.md` (cross-lineage synthesis; both lineages agree on every decision below unless noted).

## D1. Mode classification — `transport`

- `packetKind: transport`, `mutatesWorkspace: false` (mirrors `mcp-figma`/`mcp-mobbin` registry shape).
- Rationale (research.md §9): the hub registers external integrations as transport leaves; all Webflow mutations land in Webflow's cloud via Data/Designer APIs; `run_workflow` executes Webflow-side managed workflows. The transport executes; the hub orchestrates.
- Consequence: the mode's agent tool surface forbids workspace mutation tools (Write/Edit/Task); Webflow operations flow only through the MCP bridge (`mcp__code_mode__call_tool_chain`).

## D2. Backend and transport — official Webflow MCP 2.0

- Primary: **remote OAuth mode** (`https://mcp.webflow.com/sse`, `mcp-remote` transport) — zero local secrets; per-site/per-workspace consent; only site owners/admins can authorize. Accepted as experimental with a pinned version.
- Fallback (deterministic default for automation): **local bearer token** — `npx -y webflow-mcp-server@latest` (pinned in Phase 3), `WEBFLOW_TOKEN`, Node 22.3.0+.
- **Version-surface reconciliation (Phase 3 must-do)**: the public `webflow/mcp-server` README shows `/sse` without resources while hosted docs describe the newer remote surface; pin the transport version and record the tested endpoint in the packet.
- Designer Bridge App: required only for canvas-bound Designer operations; not part of the baseline data path.

## D3. Authentication and secret contract

- Token kinds: Site Token (single site), Workspace Token (read-only only — no `site` scope), OAuth token (multi-site).
- **Least privilege**: baseline automation token carries read-only scopes (`cms:read`, `pages:read`, `sites:read`, `assets:read`, `components:read`, `forms:read`, `authorized_user:read`); escalate to `sites:write` only for the staging publish test.
- Repository files and logs record **names and setup methods only** — never token values (`WEBFLOW_TOKEN` and scope names are the only strings that may appear). `.env.example` carries the variable name with an empty value.
- Role gate: only site owners/admins may authorize the MCP server — document this in the install guide.

## D4. Permission boundary (frozen)

- **Allowed through the bridge**: all read-only tools; draft-safe mutations (beyond scope checks); gated destructive/publish/deploy tools (see `safety-matrix.md`).
- **Forbidden at all times**: publishing to production `customDomains`; any operation on a production site from smoke flows; workspace-token writes; blind replay of ambiguous non-idempotent writes after errors.
- Agent tool surface: `allowed: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]`, `forbidden: [Write, Edit, Task]`, `mutatesWorkspace: false`.

## D5. Confirmation, precondition, evidence, and rollback policy (frozen)

| Class | Confirmation | Preconditions | Evidence required | Rollback |
|---|---|---|---|---|
| Read-only | none | scope check | tool output | n/a |
| Draft-write | none | scope check; target id present | tool output | revert content or discard draft |
| Destructive | **operator confirmation** | idempotency guard; target id | before/after listing | CMS: re-publish prior content; Designer: version-history snapshot re-publish; API-level site restore UNKNOWN → treated as unsupported |
| Publish | **operator confirmation** | staging-first: `publishToWebflowSubdomain` only (never `customDomains`); optional single `pageId`; one-publish-per-minute queue respected | publish receipt | re-publish prior content/snapshot |
| Deploy | **operator confirmation** | workflow/script id; target environment named | run receipt | Webflow-side workflow controls; script removal is a destructive class |

## D6. Design-judgment pairing (frozen)

- Designer-family operations (deElement, deStyle, deVariable, deComponents, deAsset, `update_page_settings`) **MUST load `sk-design`** before execution; the transport never decides taste.
- Data-family operations (CMS CRUD, analytics, scripts, workflows, webhooks, comments) run transport-only.

## D7. Live-smoke target (approved pattern; provisioning is a Phase 3/8 operator action)

- Dedicated test workspace + dedicated test site (free Starter plan).
- Baseline: read-only scopes only.
- Only mutating test: single-page publish to `publishToWebflowSubdomain` (`*.webflow.io`), with rollback = re-publish prior content.
- Never: production `customDomains`, workspace-token writes, bulk deletes.

## D8. Residual risks (accepted at freeze)

1. Remote OAuth experimental status — mitigated by pinned version + local-token fallback.
2. No API-level site restore — destructive class therefore requires the strongest confirmation.
3. Version-surface contradiction between README and hosted docs — must be resolved by Phase 3 wiring evidence.
