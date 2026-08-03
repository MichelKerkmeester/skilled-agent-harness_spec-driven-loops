---
name: mcp-webflow
description: "Webflow MCP 2.0 transport: Data/Designer API via Code Mode; frozen safety classes, least-privilege auth, sk-design pairing."
compatibility: "Requires the official webflow-mcp-server (Node 22.3.0+ for local mode), a WEBFLOW_TOKEN (site token for automation; workspace tokens read-only) or the remote OAuth flow (https://mcp.webflow.com/mcp), and Code Mode."
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.3.0.0
user-invocable: true
---

<!-- Keywords: mcp-webflow, webflow, webflow-mcp, webflow mcp 2.0, cms, publish-site, publish-collection-items, designer, bridge-app, webflow-token, sk-design, webflow-transport, code-mode -->

# Webflow (mcp-webflow)

Official **Webflow MCP 2.0** transport for the `mcp-tooling` hub: operate Webflow sites, pages, CMS
collections, components, variables, assets, scripts, workflows, webhooks, and Designer state through
the official `webflow-mcp-server` (npm) or the remote Webflow MCP service, reached via Code Mode.
The transport executes; the hub orchestrates; `sk-design` owns taste.

> **Discovery status (read first).** The `webflow` Code Mode manual **IS REGISTERED** in this repo's
> `.utcp_config.json` (stdio `npx -y webflow-mcp-server@latest`, `WEBFLOW_TOKEN` env). Live tool
> discovery and calls are **BLOCKED pending an operator-provided token and a dedicated non-production
> test site**. The documented inventory is dual-surface: the **remote deployed surface** — **31 tools /
> 220 actions** from the official docs (2026-08-03, `references/action-reference.md`) — and the
> **local OSS server** — 18 modules (`references/tool-surface.md`). The frozen safety contract applies
> to both. Per-session `list_tools()`
> re-confirmation stays MANDATORY before relying on any name: confirm, then call, and fail closed on
> drift. Callable names follow the Code Mode convention (`webflow.webflow.<tool>` registry /
> `webflow.webflow_<tool>` TypeScript) — **UNVERIFIED** until authenticated discovery.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user wants to:

- Read Webflow site, page, CMS, component, script, workflow, webhook, or Designer state
  (`list_*`, `get_*`, `query_*`, `search_*` families).
- Mutate Webflow content: CMS collection items (create/update), page settings, static content,
  scripts, webhooks, 301 redirects, robots.txt.
- Publish or deploy: `publish_site`, `publish_collection_items`, `run_workflow` — **always gated**.
- Perform Designer-family edits: elements, styles, variables, components, assets, pages
  (`de*` tools) — **always paired with `sk-design`**.
- Wire, verify, or troubleshoot the registered `webflow` Code Mode manual, its auth, scopes,
  rate limits, or the Designer Bridge App boundary.

### Use Cases

- CMS content operations on a dedicated test site (read, draft-write, staged publish).
- Page metadata and static-content edits with explicit draft vs publish intent.
- Designer canvas changes (elements, styles, variables, components) — with `sk-design`.
- Workflow and script operations under the deploy gate.
- Webhook, redirect, robots.txt, and AI Q&A surface (Enterprise-gated where noted).

### When NOT to Use

- Design judgment itself — load `sk-design` (this transport never decides taste).
- Workspace-level administration outside the documented scope model.
- Anything that must touch a **production site from a smoke/test flow** — that is structurally
  forbidden (staging subdomain only).
- Unverified tool names — never call from memory (discovery first).

---

## 2. SMART ROUTING

Routing is registry-driven via the `mcp-tooling` hub (`hub-router.json` → `mode-registry.json`).
`mcp-webflow` is a `transport` mode (`backendKind: code-mode-stdio-mcp`, `mutatesWorkspace: false`)
resolved on Webflow signals; `sk-design` is the mandatory cross-hub judgment partner for
Designer-family operations.

### Signal Detection

| Signal | Route | Action |
|--------|-------|--------|
| "webflow", "webflow mcp", "webflow cms/site/page" | mcp-webflow | load this packet, discover first |
| "change/design/set ... in webflow" (element/style/variable/component) | mcp-webflow + `sk-design` | load both; design judgment first |
| "publish/deploy webflow" | mcp-webflow (PB/DP gates) | confirmation flow |
| "figma/refero/mobbin/clickup/chrome ..." | sibling modes | never route to webflow |
| no tool signal | DEFER (no-mode-scored) | ask for disambiguation |

### Smart-Router Pseudocode

```text
RESOURCE_BASES = ["SKILL.md", "references", "feature-catalog", "assets"]

def discover_markdown_resources():
    # recursively collect *.md under each base; returns relative paths
    inventory = set()
    for base in RESOURCE_BASES:
        for path in walk(base):                    # recursive traversal
            if path.endswith(".md"):
                inventory.add(relative_path(path))
    return inventory

def _guard_in_skill(relative_path):
    # only packet-owned resources may carry this mode's routing semantics
    return relative_path not in {"../", "shared/", "node_modules/"}

def load_if_available(resource):
    # load a resource only when it exists on disk and is guarded; never fabricate
    if exists(resource) and _guard_in_skill(resource):
        return read(resource)
    return None

def score_intent(intent):
    # weighted signal scoring: webflow aliases, design verbs, sibling tool names
    signals = {"webflow": 0.0, "design": 0.0, "sibling_tool": None}
    for alias in WEBFLOW_ALIASES:                  # webflow, webflow mcp, webflow cms, ...
        if alias in intent: signals["webflow"] += 1.0
    for verb in DESIGN_VERBS:                      # change/design/set + element/style/variable/...
        if verb in intent: signals["design"] += 1.0
    for mode, names in SIBLING_MODES.items():      # figma/refero/mobbin/clickup/chrome
        if any(n in intent for n in names): signals["sibling_tool"] = mode
    return signals

def route(intent):
    inventory = discover_markdown_resources()      # recursive, guarded
    signals = score_intent(intent)
    if signals["sibling_tool"] and signals["webflow"] == 0:
        return signals["sibling_tool"]
    if signals["webflow"] >= TIEBREAK:
        return "mcp-webflow" + (" + sk-design" if signals["design"] else "")
    return UNKNOWN_FALLBACK                        # defer + disambiguation checklist

UNKNOWN_FALLBACK_CHECKLIST = [
    "Restate the request and the tool signals you found.",
    "Offer the candidate modes (webflow / sibling modes) explicitly.",
    "Ask which mode the user intends; never default to mcp-webflow on ambiguity.",
    "If webflow is chosen, run discovery-first before any call.",
]
```

### Guarded Intent Router

| User intent pattern | Route | Notes |
|---------------------|-------|-------|
| "read/list/get webflow ..." (pages, cms, sites, scripts, workflows, components, webhooks) | RO | scope check only |
| "create/update webflow ..." (draft intent, no publish verb) | DW | confirm target + draft vs live choice for CMS |
| "delete/remove webflow ..." | DS | **confirmation** + rollback statement + before/after listing |
| "publish webflow ..." | PB | **confirmation**; staging-first; single page when possible |
| "run a webflow workflow" | DP | **confirmation**; name the workflow + inputs; blast-radius note |
| "change the hero heading / style / variable / component in webflow" | DW + `sk-design` | Designer-family: load `sk-design` before execution |
| "webflow" alone | discover-first | enumerate safe read inventory; never auto-execute |

---

## 3. HOW IT WORKS

### 3.1 Operation Classes and Gates (FROZEN)

Every Webflow operation maps to exactly one class; the gate applies at the agent level before any
`tools/call` reaches the bridge.

| Class | Meaning | Gate | Rollback |
|-------|---------|------|----------|
| **RO** read-only | `list_*`, `get_*`, `query_*`, `ask_webflow_ai`, guide, activity logs | none (scope check) | n/a |
| **DW** draft-write | CMS draft items, page settings, static content, scripts, redirects, webhooks, Designer canvas edits | none (scope check; target id present) | revert content / discard draft |
| **DS** destructive | `delete_collection_items`, `delete_all_site_scripts`, `delete_all_page_scripts`, `delete_webhook`, `delete_301_redirect`, `delete_robots_txt`, `remove_element`, `remove_attribute`, `remove_style`, `remove_properties`, `delete_variable`, `unregister_component` | **operator confirmation** (idempotency guard; before/after listing) | re-publish prior content; Designer version-history snapshot; API-level site restore UNKNOWN → treated as unsupported |
| **PB** publish | `publish_site`, `publish_collection_items`, `update_page_settings` with publishing-status change | **operator confirmation**; staging-first (`publishToWebflowSubdomain` only, never `customDomains`); optional single `pageId`; 1 publish/min queue | re-publish prior content/snapshot |
| **DP** deploy | `run_workflow` (local OSS surface only — the remote surface has no workflow tool) | **operator confirmation**; named target environment | Webflow-side workflow controls; script removal is DS |
| **UNKNOWN** | any tool/action not in the researched inventory (either surface) | **prohibited until classified** from the live schema — never inferred as DW | n/a — do not execute |

### 3.2 Critical Semantics

- **CMS semantics are surface-specific**: on the remote surface, create/update item actions create
  **drafts**; `publish_collection_items`/`unpublish_collection_items` publish/unpublish live (PB,
  no staging-domain target). On the local OSS surface, items can be created/deleted directly in the
  live site or queued — the client must choose. Never assume draft-safety across surfaces.
- **Nothing auto-publishes**; publishing is always a separate explicit action.
- **One publish per minute** queue; plan-based general limits (60/120 rpm) with `Retry-After` on
  429 — honor it, never blind-replay ambiguous non-idempotent writes.
- **Staging vs production is structural**: `publishToWebflowSubdomain` (`*.webflow.io`) is the only
  publish target allowed from smoke/test flows; a single `pageId` limits blast radius.
- **Unknown tools fail closed**: anything not in the researched inventory is class **UNKNOWN** and
  PROHIBITED until the live schema classifies it — never inferred as DW, and never DS/PB/DP by default.

### 3.3 Execution Protocol

1. **Discover first (mandatory)**: `list_tools()` in the session; compare names against
   `references/tool-surface.md`; on drift record it and fail closed for mismatched tools.
2. **Classify** the target tool against the frozen matrix.
3. **Apply the gate** (confirmation for DS/PB/DP with expected output + rollback statement).
4. **Execute**; capture evidence; redact token-bearing output.

### 3.4b Surface Applicability

Every tool reference in this packet is labeled by surface: **remote** (31 tools / 220 actions,
`references/action-reference.md`), **local OSS** (18 modules, `references/tool-surface.md`), or
**both**. Actions named only in one surface (e.g., `run_workflow` — local; `insert_whtml` — remote)
must not be called against the other. Discovery compares the live `list_tools` result against the
surface the pinned manual actually resolves.

### 3.4 Wiring

| Concern | Value |
|---------|-------|
| Manual | `webflow` in `.utcp_config.json` (stdio `npx -y webflow-mcp-server@latest`, `WEBFLOW_TOKEN` env) |
| Env name | `webflow_WEBFLOW_TOKEN` in `.env.example` (name only) |
| Local server | `webflow-mcp-server` npm, Node 22.3.0+ |
| Remote endpoint | `https://mcp.webflow.com/mcp` (hosted docs) / `/sse` (README) — reconcile per session |
| Bridge App | Required only for Designer (`de*`) tools; auto-installs on OAuth authorization |

### 3.5 Authentication Posture

- **Remote mode** (primary for humans): OAuth per-site/per-workspace consent; zero local secrets;
  only site owners/admins can authorize; `mcp-remote` is experimental — pin the version.
- **Local mode** (deterministic for automation): `WEBFLOW_TOKEN` site token with least-privilege
  scopes (read-only baseline: `cms:read`, `pages:read`, `sites:read`, `assets:read`,
  `components:read`, `forms:read`, `authorized_user:read`); escalate to `sites:write` only for the
  staging publish test. Workspace tokens: read-only only (no `site` scope). `custom_code` scopes
  are Data-Client-app-only.
- Token values live only in the operator environment; the repo carries names and placeholders.

### 3.6 Version-Surface Reconciliation

The public `webflow/mcp-server` README documents `/sse` + no resources, while current hosted docs
describe the remote Streamable HTTP surface at `https://mcp.webflow.com/mcp` (registry
`com.webflow/mcp` 2.0.0) with read-only resources and Agent Instructions. Treat the deployed
remote surface and the OSS snapshot as different surfaces until a version-specific reconciliation
lands; the local stdio server is the deterministic baseline for automation.

---

## 4. RULES

### ✅ ALWAYS
- Discover first; fail closed on drift.
- Classify before executing; apply the frozen gate.
- Confirm destructive/publish/deploy immediately before the call with expected output and
  rollback statement.
- Publish to `publishToWebflowSubdomain` only from smoke/test flows; single `pageId` when possible.
- Honor `Retry-After`; respect the 1-publish/min queue.
- Route Designer-family operations through `sk-design`.
- Keep token values out of the repository, logs, and transcripts (redact tool output).

### ⚠️ ESCALATE

- Escalate to the operator (and, for design work, `sk-design`) when: an operation's class is
  ambiguous from the live surface, a bulk write's blast radius cannot be enumerated, discovery
  drift affects the target tool, a publish target is unclear (production vs staging), or a
  confirmation was given for a different operation than the one about to execute.
- Escalation means: stop, state the facts, and ask — never guess the class or the gate.

### ⛔ NEVER
- Never call an unverified tool name from memory.
- Never publish to production `customDomains` from any automated or test flow.
- Never use workspace-token writes.
- Never blind-replay a failed non-idempotent write.
- Never treat CMS mutations as implicitly draft-safe.
- Never perform API-level site backup/restore — it does not exist in the Data API v2 surface.

---

## 5. SUCCESS CRITERIA

- **SC-001**: Every Webflow operation is classified and gated before execution; no un-gated
  destructive/publish/deploy call; UNKNOWN actions are never executed.
- **SC-002**: Discovery runs per session and drift is recorded; no tool is called from memory.
- **SC-003**: Designer-family operations always pair with `sk-design`.
- **SC-004**: Smoke/test flows never touch production (`customDomains`); staging subdomain only.
- **SC-005**: No token value or account identifier enters the repository, logs, or transcripts.

---

## 6. INTEGRATION POINTS

| Surface | Role | Status |
|---------|------|--------|
| `mcp-tooling` hub | registry (`mode-registry.json`), router (`hub-router.json`), smart-routing, leaf-manifest, advisor metadata | registered (2026-08-02) |
| `sk-design` | cross-hub judgment partner for Designer-family operations | mandatory pairing |
| `.utcp_config.json` | `webflow` stdio manual | registered; token env from operator |
| `.env.example` | `webflow_WEBFLOW_TOKEN` name only | added |
| `mcp-servers/webflow-mcp/` | server pointer + pinned-version fixture slot | present; pin after first verified session |

---

## 7. QUICK REFERENCE

| Class | Gate | Example tools |
|-------|------|---------------|
| RO | none (scope check) | `list_sites`, `list_pages`, `list_collection_items`, `ask_webflow_ai` |
| DW | none (scope check) | `update_page_settings`, `create_collection_items`, `add_inline_site_script` |
| DS | confirmation + rollback | `delete_collection_items`, `delete_all_site_scripts`, `remove_element` |
| PB | confirmation + staging-first | `publish_site`, `publish_collection_items` |
| DP | confirmation | `run_workflow` |

Docs: `INSTALL-GUIDE.md` · `references/mcp-wiring.md` · `references/tool-surface.md` ·
`references/troubleshooting.md` · `feature-catalog/` · `manual-testing-playbook/` ·
`scripts/doctor.sh` · `assets/utcp-webflow-manual.md`

---

## 8. REFERENCES AND RELATED RESOURCES

- `INSTALL-GUIDE.md` — operator setup: token, scopes, verification, version pinning.
- `references/mcp-wiring.md` — Code Mode wiring, auth, scope model, rate limits, Bridge App
  boundary, version-surface table.
- `references/action-reference.md` — complete remote-surface action reference (31 tools, 220 actions, required parameters).
- `references/tool-surface.md` — local OSS 18-module tool inventory with risk classes.
- `references/troubleshooting.md` — failure modes and never-list.
- `feature-catalog/` — capability cards (cms, publish-deploy, designer, site-pages-scripts).
- `manual-testing-playbook/` — 12 scenarios across discovery, read, draft, safety gates,
  pairing, and negative classes.
- `scripts/` — `doctor.sh` (verify-only) and `install.sh`.
- `assets/utcp-webflow-manual.md` — registered-manual reference shape.
- `mcp-servers/webflow-mcp/README.md` — server pointer and pinned-version fixture slot.
- `changelog/` — release notes (v1.0.0.0 scaffold, v1.1.0.0 depth upgrade, v1.2.0.0 template
  alignment).
- Research base: `../../specs/mcp-tooling/015-mcp-webflow/001-deep-research/research/research.md`.
