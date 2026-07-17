---
name: mcp-refero
description: "Refero MCP transport: read-only UI design-reference search (styles, screens, flows) via Code Mode; sk-design owns the judgment."
compatibility: Requires a Refero Pro plan (Free has no MCP access), the npx mcp-remote bridge, and Node.js >=18; this project's Code Mode currently runs on Node 24.
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.0.0.0
user-invocable: true
---

<!-- Keywords: refero, refero-mcp, design-reference, ui-reference-search, refero-search-styles, refero-screens, refero-flows, mcp-remote, code-mode, sk-design, design-reference-transport -->

# Refero (mcp-refero)

Search **Refero's library of real shipped UI** (150,000+ app screens, 6,000+ user flows per the official repo) from an agent through the **Refero MCP via Code Mode**: styles for visual direction, screens for concrete UI patterns, flows for multi-step journeys. This packet is a read-only TRANSPORT (`packetKind: transport`, `mutatesWorkspace: false`): every read and "write" happens against the external Refero service, never this repo, and it is **never the taste authority**. Any design-affecting use pairs with `sk-design` first. Deep operational detail lives in [`references/tool-surface.md`](references/tool-surface.md) and [`references/mcp-wiring.md`](references/mcp-wiring.md).

> **Naming trap (read first).** Inside `call_tool_chain`, Refero tools resolve with a **DOUBLED prefix**: the callable form is `refero.refero_refero_<tool>(...)` (for example `refero.refero_refero_search_styles`), because Code Mode's `{manual}.{manual}_{tool}` rule applies to tools whose own names already begin with `refero_`. **CONFIRMED by live discovery 2026-07-16** (`references/discovery-fixture-2026-07-16.json`): `list_tools` returned all eight registry names in the dotted doubled form `refero.refero.refero_<tool>` — pre-auth, no OAuth needed for discovery — and the fixture's `Access as:` line shows the TS callable `refero.refero_refero_search_styles(args)`. Per-session `tool_info` re-confirmation stays mandatory: confirm, then call, and fail closed on drift.
>
> **Access trap.** Live MCP access is paid and authenticated. The Free plan has **no MCP access at all** (denial, not a reduced tool set). Pro is the first tier with MCP and carries a published quota of **8,000 tool calls per month**. Unauthenticated calls return HTTP 401.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user wants to:
- Search Refero for design references: visual styles, real app screens, or user flows.
- Find real-app screen examples for a UI pattern, state, or component ("show me real onboarding screens", "empty-state examples from shipped apps").
- Pull the full detail of a shortlisted style, screen, or flow (metadata, tokens, step goals, screenshots) as evidence for a design decision.
- Research a company's or domain's shipped UI through screen or flow queries and `site` metadata.
- Wire, verify, or troubleshoot the `refero` Code Mode manual, its OAuth or Bearer authentication, or its plan gating.

**Keyword Triggers**: "refero", "refero mcp", "design reference", "ui reference search", "real app screens", "refero styles", "refero flows", "search refero".

### Use Cases

**Styles research (read-only).** Search 3-5 semantic angles for visual direction, inspect metadata, then fetch full style references for shortlisted UUIDs. Styles cover web marketing and product pages only.

**Screens research (read-only).** Literal semantic queries (screen type, component, state, company) plus a required platform (`web` or `ios`); fetch detail for the most relevant UUIDs; similar screens and images only when text cannot answer.

**Flows research (read-only).** Search task journeys, fetch one relevant numeric flow, and use its ordered step goals, actions, and system responses.

**Wiring and auth verification.** Confirm the existing `refero` manual is registered, discovery resolves the doubled-prefix names, and authentication state is what the operator expects. Never repair auth state yourself.

### When NOT to Use

**Skip this skill when:**
- The work is the design judgment itself (palette, type, layout, taste verdicts, accessibility or readiness calls). That is `sk-design`; this packet is only its evidence transport.
- The task is app or screen research through Mobbin. That is `mcp-mobbin` (a future sibling transport, not this packet).
- The task is browser automation, live-page inspection, or visual preview of a built page. That is `mcp-chrome-devtools`.
- The work is generic app coding with no design-reference input: use `sk-code`.
- The user asks to change this repo's files, the `.utcp_config.json` manual, or auth state. This transport forbids Write/Edit/Task and never mutates the workspace.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route on **narrow Refero-specific signals only**. Generic "design", "UI", or "screen" phrasing belongs to `sk-design`, Figma work to `mcp-figma`, and browser work to `mcp-chrome-devtools`.

```bash
# Signal detection (pseudo)
echo "$REQUEST" | grep -qiE 'refero' && ROUTE="MCP_REFERO"
echo "$REQUEST" | grep -qiE 'design reference|ui reference search|real app (screens|examples|flows)' && ROUTE="MCP_REFERO"
# generic design/UI phrasing WITHOUT these signals -> sk-design, not this packet
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify wiring (refero manual registered; Code Mode reachable; auth state operator-confirmed)
    +- STEP 1: Score intent -> STYLES | SCREENS | FLOWS | WIRING_AUTH | TROUBLESHOOT
    +- Phase 1: Design-affecting? -> load sk-design FIRST (judgment owner), then return here for retrieval
    +- Phase 2: Discovery (list_tools / tool_info confirms the doubled-prefix callables)   [MANDATORY]
    +- Phase 3: Retrieval funnel (search -> metadata shortlist -> get_* detail -> similar -> image last)
    +- Phase 4: Verify (evidence cited by source URL; unknown fields preserved; no invented limits)
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring. This skill uses a **flat intent router**: no keyed `references/<key>/` subdirectories. References are the primary loaded resources; the single asset is the paste-ready manual snapshot.

```text
references/tool-surface.md      # the 8-tool surface, args/bounds, workflows, plan gating
references/mcp-wiring.md        # manual, mcp-remote bridge, OAuth/Bearer, naming, discovery
references/troubleshooting.md   # failure modes + fixes
assets/utcp-refero-manual.md    # verified manual snapshot (already registered) + Bearer alternative
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| CONDITIONAL | Research intent (styles/screens/flows) | `references/tool-surface.md` (tool contract + workflow baseline) |
| CONDITIONAL | Wiring / auth intent | `references/mcp-wiring.md`, `assets/utcp-refero-manual.md` |
| CONDITIONAL | Setup / error intent | `references/troubleshooting.md` |
| FALLBACK | Zero-score routes only | `references/tool-surface.md` suggested (never auto-loaded) |
| ALWAYS (design work) | Retrieved evidence feeds a design decision | `sk-design` modes, loaded before any taste call |

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../../sk-doc/create-skill/assets/skill/skill_smart_router.md). Guard paths, discover at runtime, score intents, and fall back when unsure. Because this skill has no keyed resource subdirectories, intent selects from the flat resource inventory below.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/tool-surface.md"
# Fallback-only: DEFAULT_RESOURCE is a defer-time suggestion, never unioned
# into a route's loaded set. Scored routes load exactly RESOURCE_MAP[intent];
# zero-score routes load nothing and ask for disambiguation instead.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"
MIN_CONFIDENCE = 1
AMBIGUITY_DELTA = 1

INTENT_MODEL = {
    "STYLES":       {"keywords": [("style", 4), ("visual direction", 4), ("design reference", 3), ("aesthetic", 3), ("look and feel", 3), ("design language", 3), ("landing page", 2), ("typography reference", 2), ("palette reference", 2)]},
    "SCREENS":      {"keywords": [("screen", 4), ("ui pattern", 4), ("similar screens", 4), ("real app", 3), ("empty state", 3), ("component example", 3), ("screenshot", 3), ("modal", 2), ("dashboard", 2), ("onboarding", 2), ("settings", 2), ("ui element", 2)]},
    "FLOWS":        {"keywords": [("flow", 4), ("user flow", 4), ("journey", 4), ("multi-step", 3), ("steps", 2), ("checkout", 2), ("cancel subscription", 2), ("signup process", 2)]},
    "WIRING_AUTH":  {"keywords": [("wiring", 4), ("utcp", 4), ("oauth", 4), ("bearer", 4), ("mcp-remote", 4), ("authenticate", 4), ("manual", 3), ("token", 3), ("register", 3), ("plan", 2), ("subscription", 2), ("install", 2), ("setup", 2)]},
    "TROUBLESHOOT": {"keywords": [("error", 4), ("failed", 4), ("401", 4), ("connection closed", 4), ("not resolving", 4), ("not working", 4), ("sigsegv", 4), ("429", 3), ("quota", 3), ("timeout", 3), ("broken", 3), ("unauthorized", 3)]},
}

# Benchmark-facing mirror of INTENT_MODEL in the standard {weight, keywords} shape
# the skill-benchmark router-replay reads (the tuple form above parses to zero
# intents there). Runtime scoring uses INTENT_MODEL; this block changes no routing.
# Per-intent weight = the MAX per-keyword weight in INTENT_MODEL for that intent
# (all five resolve to 4). Keys and keywords MUST stay identical to INTENT_MODEL;
# keep the two blocks in sync whenever either one is edited.
INTENT_SIGNALS = {
    "STYLES":       {"weight": 4, "keywords": ["style", "visual direction", "design reference", "aesthetic", "look and feel", "design language", "landing page", "typography reference", "palette reference"]},
    "SCREENS":      {"weight": 4, "keywords": ["screen", "ui pattern", "similar screens", "real app", "empty state", "component example", "screenshot", "modal", "dashboard", "onboarding", "settings", "ui element"]},
    "FLOWS":        {"weight": 4, "keywords": ["flow", "user flow", "journey", "multi-step", "steps", "checkout", "cancel subscription", "signup process"]},
    "WIRING_AUTH":  {"weight": 4, "keywords": ["wiring", "utcp", "oauth", "bearer", "mcp-remote", "authenticate", "manual", "token", "register", "plan", "subscription", "install", "setup"]},
    "TROUBLESHOOT": {"weight": 4, "keywords": ["error", "failed", "401", "connection closed", "not resolving", "not working", "sigsegv", "429", "quota", "timeout", "broken", "unauthorized"]},
}

RESOURCE_MAP = {
    "STYLES":       ["references/tool-surface.md"],
    "SCREENS":      ["references/tool-surface.md"],
    "FLOWS":        ["references/tool-surface.md"],
    "WIRING_AUTH":  ["references/mcp-wiring.md", "assets/utcp-refero-manual.md"],
    "TROUBLESHOOT": ["references/troubleshooting.md", "references/mcp-wiring.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the layer: styles (visual direction), screens (UI patterns), or flows (journeys)",
    "Confirm the refero manual is registered and discovery (tool_info) confirms the doubled-prefix callables",
    "Confirm the account has a Pro (or higher) plan; Free has no MCP access at all",
    "If the evidence will influence a design decision, load sk-design first; this transport never decides taste",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)               # raises if path escapes the skill
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {d.relative_to(SKILL_ROOT).as_posix() for d in docs}

def classify_intents(request: str):
    text = (request or "").lower()
    scores = {i: 0 for i in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw, w in cfg["keywords"]:
            if kw in text:
                scores[intent] += w
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    primary, top = ranked[0]
    if top == 0:
        return (None, None, scores)   # unrouted -> no intent selected; fallback branch disambiguates
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_refero_resources(request: str):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [i for i in (primary, secondary) if i]
    loaded, seen, notices = [], set(), []

    def load_if_available(rel: str) -> bool:
        guarded = _guard_in_skill(rel)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)
            return True
        if guarded not in inventory:
            notices.append(f"Resource not found in inventory: {guarded}")
        return False

    if max(scores.values() or [0]) < MIN_CONFIDENCE:
        # Fallback-only: nothing is loaded on a zero-score route; the default
        # reference is offered as a suggestion beside the disambiguation ask.
        return {"intents": intents, "load_level": "UNKNOWN_FALLBACK", "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
                "suggested_fallback": DEFAULT_RESOURCE, "resources": loaded, "notices": notices}
    for intent in intents:
        for rel in RESOURCE_MAP.get(intent, []):
            load_if_available(rel)
    return {"intents": intents, "intent_scores": scores, "resources": loaded, "notices": notices}
```

---

## 3. HOW IT WORKS

### First Step (Always): confirm wiring, then discover

The `refero` manual is **already registered** in this repo's `.utcp_config.json` (`npx -y mcp-remote https://api.refero.design/mcp`, stdio, empty env). Verify it is present (read-only grep, or `scripts/doctor.sh`), never re-add it, and never edit it. Then discover the live callables through Code Mode before any call:

```typescript
// Discovery names appear dotted: refero.refero.refero_search_styles
const all = await list_tools();
// MANDATORY: confirm the exact callable + schema before relying on any name
const info = await tool_info({ tool_name: "refero.refero_refero_search_styles" });
```

The doubled-prefix callable form (`refero.refero_refero_<tool>`) is **confirmed by live registry evidence** (2026-07-16 discovery fixture, `references/discovery-fixture-2026-07-16.json`): all eight tools were live-listed pre-auth as `refero.refero.refero_{search_styles,search_screens,get_style,get_similar_screens,get_screen_image,get_screen,search_flows,get_flow}`, resolving the research record's conflicting derivations — the single-prefix derivation is dead. Discovery is pre-auth; authenticated CALLS remain operator-gated. The per-session `tool_info` confirmation step is still not optional. If discovery shows the eight tools missing, renamed, or expanded, **fail closed**: report the drift; a changed provider surface requires a reviewed packet update, not an improvised call.

### The 8-tool surface (three layers)

The expected contract (authoritative docs baseline; `tool_info` is the final live schema). Full args, bounds, and result shapes: [`references/tool-surface.md`](references/tool-surface.md).

| Layer | Tool | Required args | Notes |
|---|---|---|---|
| Styles | `refero_search_styles` | `query` | `page` (default 1) pagination |
| Styles | `refero_get_style` | exactly one of `style_id` \| `style_ids[]` | Full styles are ~10-15k chars each; batch 3-4 |
| Screens | `refero_search_screens` | `query`, `platform: "web"\|"ios"` | Returns UUID records with `site`, `ux_patterns`, `ui_elements` |
| Screens | `refero_get_screen` | exactly one of `screen_id` \| `screen_ids[]` | Never pass `image_size` or `include_similar` here |
| Screens | `refero_get_similar_screens` | `screen_id` | `limit` 1-20, default 10 (the only tool with `limit`) |
| Screens | `refero_get_screen_image` | `screen_id` | `image_size: "thumbnail"\|"full"` (default thumbnail); returns raw image |
| Flows | `refero_search_flows` | `query`, `platform: "web"\|"ios"` | Returns **numeric** flow IDs |
| Flows | `refero_get_flow` | exactly one of `flow_id` \| `flow_ids[]` (numbers) | Ordered steps: goal, action, system response |

Hard constraints: styles and screens use **UUID strings**, flows use **numeric IDs**; the two are not interchangeable. Search pagination uses `page`, never legacy `limit`/`offset`. There are **no** `search_apps`/`get_app`/`search_elements`/`get_element` tools; apps and elements are query facets, inspected through `site` and `ui_elements` in results. `response_format` is documented on the **seven text-returning tools** and must **never** be passed to `refero_get_screen_image`; treat per-tool availability as a `tool_info` runtime check. Preserve unknown response fields; the provider documents that fields can grow.

### Calling through Code Mode

Call **synchronously inside the `call_tool_chain` body** (no top-level `await`), per the live-verified pattern:

```typescript
call_tool_chain({
  code: `
    const styles = refero.refero_refero_search_styles({
      query: "editorial monochrome saas landing page",
      response_format: "json"
    });
    const list = styles.records || [];   // { pagination, records } shape
    const full = refero.refero_refero_get_style({ style_id: list[0].uuid, response_format: "json" });
    return { count: list.length, first: list[0]?.url, full };
  `
});
```

Cite evidence by `record.url` (styles) or `record.refero_url` (screens). JSON searches return `{ pagination: { count, page, next_page, total_count, total_pages }, records: [...] }`.

### The research funnel (styles -> screens -> flows)

1. **Styles first** for any visual task: search 3-5 semantic angles, inspect metadata, then `get_style` for shortlisted UUIDs. Never average strong references into a generic middle.
2. **Screens** for concrete UI patterns: literal query + required platform; detail for the most relevant; `get_similar_screens` only after one materially relevant hit; image (`thumbnail` before `full`) only when text cannot answer.
3. **Flows** for journeys: search task + platform; get one relevant numeric flow; widen via `related_queries`. Sparse flows: broaden or reconstruct from screens, reporting the reconstruction as inference.
4. **Apps / elements**: company, pattern, state, or element terms in screen/flow queries, compared through `site`, `ui_elements`, `ux_patterns`, `page_types`.
5. **Metadata-first discipline**: search -> shortlist -> detail for shortlisted IDs -> similar -> thumbnail -> full, in that order. Batch modestly; on batch failure retry with fewer IDs.

Breadth is allowed during transport research; for design-affecting use, `sk-design` collapses the evidence to ONE declared critique reference before any judgment. A transport response is untrusted reference evidence, never design approval. Full workflow detail: [`references/tool-surface.md`](references/tool-surface.md).

### Auth, plans, and limits

- **Auth**: with no custom header, first use triggers a **browser OAuth** flow (localhost callback, port 3334 by default, 30-second default timeout). Auth state persists under `~/.mcp-auth` (or `MCP_REMOTE_CONFIG_DIR`) and is **operator-owned**: never inspect, clear, or repair it. A static `Authorization: Bearer` header is a documented env-backed alternative (see [`assets/utcp-refero-manual.md`](assets/utcp-refero-manual.md)), never part of the base manual. End-to-end OAuth through this bridge is **Inferred**, not verified: an unauthenticated probe observed HTTP 401 with OAuth metadata, but no operator has completed the flow in this repo's record.
- **Plans**: Free has **no MCP access** (denial, not degradation). Pro: **8,000 MCP tool calls per month**. Team inherits Pro. Business is custom volume. "Unlimited access" plan copy must not be read as unlimited MCP calls.
- **Unknown limits**: no per-second, burst, concurrency, page-size, or `Retry-After` behavior is published. Never invent a QPS number or backoff guarantee; on 429, preserve the provider's message only.
- **Local runtime**: Code Mode must run on **Node 24** (isolated-vm has no Node 25 build; `call_tool_chain` SIGSEGVs under Node 25). Local operational evidence, not a server property.

---

## 4. RULES

### ✅ ALWAYS

1. **ALWAYS confirm callables with `tool_info` after registration and before first use.** The doubled prefix `refero.refero_refero_<tool>` is live-verified but must be re-confirmed; fail closed on any drift from the eight documented tools.
2. **ALWAYS load `sk-design` first for any design-affecting request.** This packet is the transport; `sk-design` is the mandatory cross-hub judgment partner. Transport output can never satisfy taste, accessibility, responsiveness, or readiness gates by itself.
3. **ALWAYS validate documented unions, enums, and bounds before calling**: exactly-one-of ID unions, UUID vs numeric ID typing, the `platform` enum, `page >= 1`, similar-screens `limit` 1-20, and the image-size enum. Pass unknown response fields through untouched.
4. **ALWAYS follow the metadata-first funnel**: search and shortlist on metadata, fetch detail only for shortlisted IDs, similar screens only after one relevant hit, images last (`thumbnail` before `full`).
5. **ALWAYS call synchronously inside the `call_tool_chain` body** (no top-level `await`) and cite results by their source URL (`url` / `refero_url`).
6. **ALWAYS treat this packet as read-only against this repo** (`mutatesWorkspace: false`). Reads and writes happen against the external Refero service only; Write, Edit, and Task are forbidden tools for this transport.

### ⛔ NEVER

1. **NEVER use Write, Edit, or Task through this packet.** It is a TRANSPORT: it retrieves external evidence and changes nothing in this workspace. Hand file changes to the owning workflow skill.
2. **NEVER edit `.utcp_config.json`'s `refero` manual.** It is validated as-is (verify, do not re-add, do not modify), and never add a second Refero manual or a Bearer token to the base manual.
3. **NEVER claim OAuth works end-to-end.** It is **Inferred** pending an operator-completed authorization; report it as such. Never inspect, clear, or repair `~/.mcp-auth` / `MCP_REMOTE_CONFIG_DIR`, and never accept, print, or cache credentials.
4. **NEVER invent rate limits, page sizes, retry contracts, or backoff numbers.** Only the monthly Pro quota (8,000 calls) is published; on 429, relay the provider's own message.
5. **NEVER pass `response_format` to `refero_get_screen_image`**, and never use the deprecated legacy surface: `_tool`-suffixed names, `get_design_guidance`, numeric screen IDs, `limit`/`offset` search pagination, or `image_size`/`include_similar` on `refero_get_screen`.
6. **NEVER treat search rank or similarity as a taste verdict**, never average strong references into a generic middle, and never copy or cache third-party reference content into this repo.
7. **NEVER model Free-plan access as a reduced tool set.** Free has no MCP access at all; report the entitlement denial and stop.

### ⚠️ ESCALATE IF

1. **ESCALATE IF authentication is required** (HTTP 401, OAuth prompt, token needs). Completing browser OAuth or obtaining a Bearer token is **operator-only**; surface the step and wait.
2. **ESCALATE IF discovery shows catalog drift**: a documented tool missing or renamed, unexpected new tools, or schemas that contradict [`references/tool-surface.md`](references/tool-surface.md). A provider-surface change requires a reviewed packet update.
3. **ESCALATE IF the account is Free-tier or quota-limited** (entitlement denial, 429, or quota exhaustion), reporting the provider's message verbatim.
4. **ESCALATE IF `call_tool_chain` drops the connection** (`-32000 Connection closed`), which locally indicates a Node 25 runtime; the Node 24 pin is an operator-side fix.
5. **ESCALATE IF retrieved evidence conflicts with an `sk-design` reference lock or decision ledger**, asking which source prevails before any design conclusion is drawn.

---

## 5. REFERENCES

### Core References

- [tool-surface.md](references/tool-surface.md) - The 8-tool contract: arguments, bounds, ID typing, result shapes, the research funnel, plan gating, and the deprecated-surface negative knowledge.
- [mcp-wiring.md](references/mcp-wiring.md) - The registered `refero` manual, the mcp-remote bridge (transport strategy, OAuth, auth state), the doubled-prefix naming rule, and the discovery-first contract.
- [troubleshooting.md](references/troubleshooting.md) - Failure modes and fixes (401, tools not resolving, Node 25 SIGSEGV, sparse flows, quota, batch failures).

### Templates and Assets

- [utcp-refero-manual.md](assets/utcp-refero-manual.md) - The verified `.utcp_config.json` manual snapshot (already registered: verify, do not re-add) plus the env-backed Bearer-header alternative, marked alternative-only.

### Reference Loading Notes

- `tool-surface.md` is the baseline (always). Load `mcp-wiring.md` and the manual asset for wiring/auth intent, `troubleshooting.md` for errors.
- Keep Section 2 (SMART ROUTING) as the single routing authority.

---

## 6. SUCCESS CRITERIA

**Wiring verification complete when:**
- ✅ The `refero` manual was confirmed present in `.utcp_config.json` read-only (no edit, no re-add), and discovery (`list_tools` / `tool_info`) confirmed the doubled-prefix callables, or the auth/entitlement blocker was escalated to the operator.

**Retrieval complete when:**
- ✅ The funnel order was followed (search -> metadata shortlist -> detail -> similar -> image last), IDs matched their documented typing, results were cited by source URL, and unknown fields were preserved.

**Design-affecting use complete when:**
- ✅ `sk-design` was loaded first, the transport supplied only requested evidence, and no taste, accessibility, or readiness verdict was issued from transport output.

**Always:**
- ✅ No workspace file changed, no credential was printed or cached, no auth state was touched, no unpublished limit was invented, and every capability claim stayed within the documented or live-confirmed record.

---

## 7. INTEGRATION POINTS

### Tool Usage Guidelines

- **Code Mode** (`mcp__code_mode__call_tool_chain`) owns every Refero call, including discovery (`list_tools`, `search_tools`, `tool_info`).
- **Read/Grep/Glob** load references and verify the manual's presence in `.utcp_config.json` read-only.
- **Bash** runs only the read-only `scripts/doctor.sh` diagnostics; this transport has no other shell role (Code Mode owns the stdio process launch, so the packet never runs `npx` itself).

### Cross-Workflow Contracts

- **`sk-design`** is the mandatory cross-hub judgment pairing: it owns intake, mode selection, register, reference locks, and every taste/accessibility/readiness verdict. `interface` is the primary Refero consumer; `audit` may evaluate against evidence; `foundations` can interpret explicit style-system evidence; `motion` may use flow sequences. This packet retrieves only requested evidence and returns it to the design mode.
- **`mcp-code-mode`** is the substrate: manuals, `{manual}.{manual}_{tool}` naming, prefixed env vars (`refero_<NAME>` if a token is ever wired via env), discovery, and the error-envelope discipline all come from it.
- **`mcp-figma`** is the sibling Figma transport in this hub; **`mcp-mobbin`** is a planned future sibling for Mobbin research. Neither overlaps this packet's Refero surface.

### External Tools

- **Refero MCP** (`https://api.refero.design/mcp`): the external, paid, read-only design-reference service. Requires a Pro (or higher) plan and authentication; not vendored, not mirrored.
- **mcp-remote** (npm, intentionally unpinned in the manual; version 0.1.38 at research time, self-described experimental): the stdio-to-HTTP bridge Code Mode launches via `npx`. HTTP-first transport strategy; do not force SSE.

### Knowledge Base Dependencies

**Required**: `references/tool-surface.md` (tool contract baseline). **Conditional**: `mcp-wiring.md` + `assets/utcp-refero-manual.md` (wiring/auth), `troubleshooting.md` (errors).

---

## 8. QUICK REFERENCE

| Item | Value |
|---|---|
| Endpoint | `https://api.refero.design/mcp` (remote HTTP; bridged by `npx -y mcp-remote`) |
| Manual | `refero` in `.utcp_config.json` (already registered; verify, never edit) |
| Callable form | `refero.refero_refero_<tool>(...)` (doubled prefix — confirmed by 2026-07-16 discovery fixture; registry names are dotted `refero.refero.refero_<tool>`; re-confirm via `tool_info` per session) |
| Layers | Styles (2 tools) · Screens (4 tools) · Flows (2 tools) |
| ID typing | Styles/screens: UUID strings · Flows: numeric IDs |
| `response_format` | Seven text tools only; never on `refero_get_screen_image` |
| Funnel | styles -> screens -> flows; metadata first; image last (`thumbnail` before `full`) |
| Style batches | 3-4 UUIDs per `get_style` (each ~10-15k chars) |
| Plans | Free: NO MCP · Pro: 8,000 calls/month · Team: inherits Pro · Business: custom |
| Unknowns | Per-second/burst/concurrency/429 behavior unpublished; OAuth end-to-end Inferred |
| Local runtime | Code Mode on Node 24 (Node 25 SIGSEGVs); synchronous calls, no top-level `await` |
| Judgment | `sk-design`, always, for anything design-affecting |

---

## 9. REFERENCES AND RELATED RESOURCES

The router (Section 2) discovers reference and asset docs dynamically. Start from `references/tool-surface.md` for the tool contract and workflows, `references/mcp-wiring.md` for the bridge and auth model, and `references/troubleshooting.md` for failures.

Assets: `assets/utcp-refero-manual.md` (the verified, already-registered manual snapshot plus the Bearer alternative), loaded for wiring/auth intent.

Scripts: `scripts/doctor.sh` (read-only, non-interactive diagnostics; optional endpoint probe gated behind `REFERO_DOCTOR_LIVE=1`) and `scripts/install.sh` (verify-only posture check: runtime prerequisites, manual presence read-only, operator-only auth boundaries; nothing is installed or modified).

Examples: `examples/` carries worked Code Mode walkthroughs (the full styles -> screens -> flows funnel, a metadata-first lookup, and a screen-image fetch), each opening with the mandatory `tool_info` confirmation and marking OAuth-gated steps SKIP-valid.

Related skills: `sk-design` (the mandatory judgment pairing), `mcp-code-mode` (the substrate), `mcp-figma` (the sibling Figma transport), `mcp-chrome-devtools` (browser preview only), `sk-code` (adapting evidence into an app), and `system-spec-kit` when packet documentation or memory continuity applies.

Install guide: [install-guide.md](install-guide.md).

Upstream: the Refero MCP is the paid service at [refero.design/mcp](https://refero.design/mcp) (docs at doc.refero.design). The official [referodesign/refero_skill](https://github.com/referodesign/refero_skill) repository (MIT, default branch `master`) is a design **methodology** skill and a peer of `sk-design`; this packet deliberately does not vendor or duplicate it.
