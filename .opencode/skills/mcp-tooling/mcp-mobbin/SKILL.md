---
name: mcp-mobbin
description: "Mobbin MCP transport: read-only app/screen/flow design research via Code Mode; sk-design owns the judgment."
compatibility: Requires a paid Mobbin plan for MCP (Pro, Team, or Enterprise; Free has no MCP access), the npx mcp-remote bridge, Node.js >=18, and a browser OAuth round-trip on first use.
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.2.0.0
user-invocable: true
---

<!-- Keywords: mobbin, mobbin-mcp, app-design-research, screen-examples, ux-flow-references, search-screens, mcp-remote, code-mode, sk-design, design-research-transport -->

# Mobbin (mcp-mobbin)

Search **Mobbin's library of real app UI screenshots** ("the world's largest library of real app UI screenshots" per the official repo) from an agent through the **Mobbin MCP via Code Mode**: one documented tool, `search_screens`, answering app, screen, flow, and element research as query intents. This packet is a read-only TRANSPORT (`packetKind: transport`, `mutatesWorkspace: false`): every call goes against the external hosted Mobbin service, never this repo, and it is **never the taste authority**. Any design-affecting use pairs with `sk-design` first. Deep operational detail lives in [`references/tool-surface.md`](references/tool-surface.md) and [`references/mcp-wiring.md`](references/mcp-wiring.md).

> **Discovery status (read first).** The `mobbin` Code Mode manual **IS REGISTERED** in this repo's `.utcp_config.json` (registered 2026-07-16 by an operator; this packet never edits the config), and **live discovery RAN 2026-07-16, pre-auth** (fixture: `references/discovery-fixture-2026-07-16.json`): `list_tools` returned **THREE** read tools — registry names `mobbin.mobbin.{search_screens,search_flows,search_sections}` (dot-separated), TS callables `mobbin.mobbin_search_screens(...)` etc. per the fixture's `Access as:` lines — superseding the research's one-public-tool baseline. Operator browser OAuth is still pending for CALLS. Per-session `tool_info` re-confirmation stays MANDATORY before relying on any name: confirm, then call, and fail closed on drift.
>
> **Access trap.** Mobbin MCP access is documented for **Pro, Team, and Enterprise — not Free**. Authentication is **browser OAuth only** (DCR + PKCE S256, `openid` scope): **no static API key or auth env var exists for MCP** — that question is answered in the negative, not open. Unauthenticated calls return HTTP 401. The service is rate-limited to **60 requests per 60 seconds per user**.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user wants to:
- Search Mobbin for real-app design references: screens for a UI pattern or state, apps for category comparison, flows for journey steps, or elements for component behavior in context.
- Find screen examples from shipped apps ("show me iOS banking onboarding screens", "web empty-state dashboard examples").
- Research how real products handle a flow or journey through screen evidence ("first-run onboarding progression", "forgot-password recovery").
- Wire, verify, or troubleshoot the registered `mobbin` Code Mode manual, its OAuth authentication, its plan gating, or its rate limit.

**Keyword Triggers**: "mobbin", "mobbin mcp", "app design research", "screen examples", "ux flow references", "real app screenshots", "search mobbin".

### Use Cases

**App research (read-only).** Name the app, company, or category plus the comparison goal ("banking apps onboarding identity verification"); compare `app_name`, platform, structure, and visible patterns across results. Multiple results are evidence, not a design chooser.

**Screen research (read-only).** Name the concrete screen, state, or job ("iOS subscription cancellation confirmation"); start at 5 results; cite each `mobbin_url` used.

**Flow research (read-only).** Describe the journey and target step. The public contract returns screens, not an ordered flow object — reconstruct sequence only when visual evidence supports it, and label the reconstruction as inference.

**Element research (read-only).** Name component plus context/state ("bottom-sheet destructive confirmation", "inline validation on signup"); analyze element behavior within returned screens.

**Wiring and auth verification.** Report the manual's registration state honestly (presence is the healthy result; absence is a failure symptom to escalate), explain the OAuth-only model and plan gate, and never repair auth state yourself.

### When NOT to Use

**Skip this skill when:**
- The work is the design judgment itself (palette, type, layout, taste verdicts, accessibility or readiness calls). That is `sk-design`; this packet is only its evidence transport.
- The task is styles, screens, or flows research through Refero. That is `mcp-refero`, the sibling transport.
- The task is Figma work (inspect, tokens, render, Code Connect). That is `mcp-figma`.
- The task is browser automation, live-page inspection, or visual preview of a built page. That is `mcp-chrome-devtools`.
- The work is generic app coding with no design-reference input: use `sk-code`.
- The target is Mobbin's documentation search. `docs.mobbin.com/mcp` is a **separate** Mintlify docs-search MCP, not the design-reference server; this packet targets `api.mobbin.com/mcp` only.
- The user asks to change this repo's files, edit the registered `.utcp_config.json` manual, or repair auth state. This transport forbids Write/Edit/Task, never mutates the workspace, and the registered manual is operator-owned.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route on **narrow Mobbin-specific signals only**. Generic "design", "UI", or "screen" phrasing belongs to `sk-design`, Refero references to `mcp-refero`, Figma work to `mcp-figma`, and browser work to `mcp-chrome-devtools`.

```bash
# Signal detection (pseudo)
echo "$REQUEST" | grep -qiE 'mobbin' && ROUTE="MCP_MOBBIN"
echo "$REQUEST" | grep -qiE 'app design research|real app (screenshots|screens)|ux flow reference' && ROUTE="MCP_MOBBIN"
# generic design/UI phrasing WITHOUT these signals -> sk-design, not this packet
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify wiring state (mobbin manual registered; presence expected — absence is a failure to escalate)
    +- STEP 1: Score intent -> APPS | SCREENS | FLOWS | ELEMENTS | WIRING_AUTH | TROUBLESHOOT
    +- Phase 1: Design-affecting? -> load sk-design FIRST (judgment owner), then return here for retrieval
    +- Phase 2: Discovery (list_tools / tool_info confirms the callable name)   [MANDATORY; needs a fresh Code Mode session]
    +- Phase 3: Retrieval (search_screens with intent-shaped query; limit 5; platform ios|web)
    +- Phase 4: Verify (evidence cited by mobbin_url; failed[] reported; unknowns preserved; no invented tools)
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring. This skill uses a **flat intent router**: no keyed `references/<key>/` subdirectories. References are the primary loaded resources; the single asset is the registered manual's reference shape.

```text
references/tool-surface.md      # the one-tool surface, args, response shape, workflows, plan gating
references/mcp-wiring.md        # registered manual, mcp-remote bridge, OAuth/DCR/PKCE, naming, discovery
references/troubleshooting.md   # failure modes + fixes
assets/utcp-mobbin-manual.md    # Registered manual's reference shape + post-registration checklist
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| CONDITIONAL | Research intent (apps/screens/flows/elements) | `references/tool-surface.md` (tool contract + workflow baseline) |
| CONDITIONAL | Wiring / auth intent | `references/mcp-wiring.md`, `assets/utcp-mobbin-manual.md` |
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
    "APPS":         {"keywords": [("app design research", 4), ("app research", 4), ("competitor", 3), ("app comparison", 3), ("banking apps", 2), ("category", 2), ("how do apps", 2), ("real apps", 3)]},
    "SCREENS":      {"keywords": [("screen", 4), ("screen examples", 4), ("ui pattern", 3), ("empty state", 3), ("first open", 3), ("onboarding screen", 3), ("component example", 3), ("screenshot", 3), ("paywall", 2), ("settings", 2), ("dashboard", 2)]},
    "FLOWS":        {"keywords": [("flow", 4), ("ux flow", 4), ("user flow", 4), ("journey", 4), ("start to finish", 3), ("multi-step", 3), ("progression", 2), ("forgot password", 2), ("checkout", 2), ("signup process", 2)]},
    "ELEMENTS":     {"keywords": [("element", 4), ("bottom sheet", 3), ("inline validation", 3), ("component behavior", 3), ("button state", 2), ("tab bar", 2), ("modal", 2), ("confirmation dialog", 2)]},
    "WIRING_AUTH":  {"keywords": [("wiring", 4), ("utcp", 4), ("oauth", 4), ("mcp-remote", 4), ("authenticate", 4), ("pkce", 3), ("manual", 3), ("register", 3), ("token", 3), ("plan", 2), ("install", 2), ("setup", 2)]},
    "TROUBLESHOOT": {"keywords": [("error", 4), ("failed", 4), ("401", 4), ("not working", 4), ("not resolving", 4), ("429", 3), ("rate limit", 3), ("timeout", 3), ("unauthorized", 3), ("denied", 3)]},
}

# Benchmark-facing mirror of INTENT_MODEL in the standard {weight, keywords} shape
# the skill-benchmark router-replay reads (the tuple form above parses to zero
# intents there). Runtime scoring uses INTENT_MODEL; this block changes no routing.
# Per-intent weight = the MAX per-keyword weight in INTENT_MODEL for that intent
# (all six resolve to 4). Keys and keywords MUST stay identical to INTENT_MODEL;
# keep the two blocks in sync whenever either one is edited.
INTENT_SIGNALS = {
    "APPS":         {"weight": 4, "keywords": ["app design research", "app research", "competitor", "app comparison", "banking apps", "category", "how do apps", "real apps"]},
    "SCREENS":      {"weight": 4, "keywords": ["screen", "screen examples", "ui pattern", "empty state", "first open", "onboarding screen", "component example", "screenshot", "paywall", "settings", "dashboard"]},
    "FLOWS":        {"weight": 4, "keywords": ["flow", "ux flow", "user flow", "journey", "start to finish", "multi-step", "progression", "forgot password", "checkout", "signup process"]},
    "ELEMENTS":     {"weight": 4, "keywords": ["element", "bottom sheet", "inline validation", "component behavior", "button state", "tab bar", "modal", "confirmation dialog"]},
    "WIRING_AUTH":  {"weight": 4, "keywords": ["wiring", "utcp", "oauth", "mcp-remote", "authenticate", "pkce", "manual", "register", "token", "plan", "install", "setup"]},
    "TROUBLESHOOT": {"weight": 4, "keywords": ["error", "failed", "401", "not working", "not resolving", "429", "rate limit", "timeout", "unauthorized", "denied"]},
}

RESOURCE_MAP = {
    "APPS":         ["references/tool-surface.md"],
    "SCREENS":      ["references/tool-surface.md"],
    "FLOWS":        ["references/tool-surface.md"],
    "ELEMENTS":     ["references/tool-surface.md"],
    "WIRING_AUTH":  ["references/mcp-wiring.md", "assets/utcp-mobbin-manual.md"],
    "TROUBLESHOOT": ["references/troubleshooting.md", "references/mcp-wiring.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the research intent: apps, screens, flows, or elements (all are query intents over search_screens)",
    "Confirm the mobbin manual's registration state (registered; absence is a failure symptom to escalate, never repair)",
    "Confirm the account has a paid plan (Pro, Team, or Enterprise); Free has no MCP access",
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

def route_mobbin_resources(request: str):
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

### First Step (Always): report the wiring state honestly

The `mobbin` manual **is registered** in this repo's `.utcp_config.json` (registered 2026-07-16 by an operator, never by this packet). `scripts/doctor.sh` reports the state read-only: manual presence is the healthy result, and **absence is now an ERROR** (a broken or reverted registration to escalate, never repair). Because manuals load at Code Mode startup and OAuth is still pending, discovery through a fresh Code Mode session is mandatory before any call:

```typescript
// Live-confirmed dotted discovery names (2026-07-16 fixture):
//   mobbin.mobbin.search_screens · mobbin.mobbin.search_flows · mobbin.mobbin.search_sections
const all = await list_tools();
// MANDATORY per session: confirm the exact callable + schema before relying on any name
const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" });
```

Both the dotted discovery names and the callable form are **CONFIRMED by live discovery 2026-07-16** (`references/discovery-fixture-2026-07-16.json`; the convention-derived prediction held exactly). Discovery ran **pre-auth** — `tools/list` and schemas needed no OAuth; authenticated CALLS remain operator-gated. If a future discovery shows different names, missing tools, unexpected new tools, or a mutation-capable tool, **fail closed**: report the drift; a changed provider surface requires a reviewed packet update, not an improvised call.

### The live three-tool surface (supersedes the one-tool baseline, 2026-07-16)

The research's **one publicly documented tool** baseline is superseded: live pre-auth discovery on 2026-07-16 listed **three** read-only search tools. All three passed the mutation-refusal check (no mutation-capable tool in the listing). Full fixture schemas and the completeness boundary: [`references/tool-surface.md`](references/tool-surface.md).

| Tool | Posture | Required inputs (fixture schema) | Optional inputs (fixture schema) |
|---|---|---|---|
| `search_screens` | Read/search | `query`; `platform` `"ios"`\|`"web"` | `mode` `"deep"`\|`"standard"`\|`"fast"` (deprecated alias); `limit`; `exclude_screen_ids[]`; `image_format` `"webp"`\|`"jpg"` |
| `search_flows` | Read/search | `query` (one journey); `platform` `"ios"`\|`"web"` | `limit`; `page` (max 20); `image_format` |
| `search_sections` | Read/search | `query` (one website section) | `limit`; `page`; `image_format` |

Declared `search_screens` output (fixture): `{ query, screens: [{ id, image_url, mobbin_url, app_name, platform }] }` — the research-documented `index`/`failed[]` fields do not appear in the declared schema; verify the actual response shape on the first authenticated call. **The `deep` conflict is RESOLVED**: search mode is a client-settable input on `search_screens` (`"deep"` = AI-powered relevance pipeline for nuanced queries; `"standard"` = low latency; `"fast"` = deprecated alias for standard). Never invent `search_apps`, `search_elements`, or any detail/image-download/mutation tool beyond the discovered inventory.

### Calling through Code Mode

> **Callable-name status.** The callable is confirmed by live discovery 2026-07-16 (`references/discovery-fixture-2026-07-16.json`): registry name `mobbin.mobbin.search_screens`, TS callable `mobbin.mobbin_search_screens(args)`. The call below quotes the confirmed form; the live RESPONSE behavior is still unexercised (authenticated calls pend operator OAuth), so re-confirm with `tool_info` per session.

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_screens({
      query: "iOS banking app onboarding identity verification",
      platform: "ios",
      limit: 5
    });
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() };
  `
});
```

Mandatory discovery-first sequence: `list_tools()` or `search_tools({ task_description: "Mobbin screen design research", limit: 10 })` -> filter to the `mobbin` manual -> `tool_info()` on the exact dotted name -> only then `call_tool_chain({ code })`. Cite every selected reference by its `mobbin_url`.

### Research workflows (query intents over the three live tools)

App, screen, and element research remain intent-specific query designs over `search_screens`; flow and website-section research now have dedicated live-discovered tools (2026-07-16):

1. **App research** — name the app/company/category and comparison goal ("banking apps onboarding identity verification"); compare `app_name`, platform, structure, visible patterns.
2. **Screen research** — name the concrete screen/state/job ("iOS subscription cancellation confirmation", "web empty-state dashboard"); start at 5 results; cite each `mobbin_url` used.
3. **Flow research** — use `search_flows`: describe one user journey ("onboarding with personalization steps"); it returns ordered flow objects (`screens[].position`, `actions[]`, `screen_count`), superseding the old screens-only reconstruction guidance. Label anything beyond the returned ordering as inference.
4. **Element research** — name component + context/state ("bottom-sheet destructive confirmation", "inline validation on signup"); analyze element behavior within returned screens; never fabricate an element-detail tool.
5. **Website-section research** — use `search_sections`: describe one section ("pricing page with plan comparison table"); results carry `site_name` and section images.

Official skill operating sequence: derive query terms from the user's actual words -> infer `ios` vs `web` from app context (unclear -> ask) -> announce a short search plan -> call `search_screens` in the same turn -> visually inspect returned references (observe content, structure, styling, interaction; compare repeats and meaningful differences; synthesize principles) -> answer from evidence tied to returned screens. The official skill's optional evidence-board writer is **excluded** from this transport (read-only boundary).

Context discipline: start `limit: 5`; ask before widening materially (do not exceed ~15 just for variety); report `failed[]` entries and missing images as partial success, never silently discard; retain `mobbin_url` as provenance for every selected reference.

### Auth, plans, and limits

- **Auth**: browser OAuth only — protected-resource discovery, Dynamic Client Registration (RFC 7591), authorization-code + PKCE S256, `openid` scope. **No static Mobbin API key exists for MCP**; the API-key Bearer model belongs to the separate Team/Enterprise REST API and must never be conflated with MCP. Client access is revocable from Mobbin Account Settings -> MCP. Adapter auth state persists under `~/.mcp-auth` (or `MCP_REMOTE_CONFIG_DIR`) and is **operator-owned**: never inspect, clear, or repair it. A live unauthenticated probe returned HTTP 401 with a `WWW-Authenticate` pointer to the protected-resource metadata — a pre-authorization 401 is the **expected** challenge, not a missing-key error. End-to-end OAuth through the local Code Mode + `mcp-remote` bridge is **Inferred**, not verified: no operator has completed the flow in this repo's record.
- **Plans**: MCP on **Pro, Team, and Enterprise; Free is excluded** (state "MCP starts at Pro"; the exact Free denial status/payload/UX is UNVERIFIED — do not guess failure semantics). No reviewed source documents different MCP tool sets per paid tier — do not invent per-tool tier gates. Per-plan usage caps within eligible tiers are undocumented; Finance+ is a separate paid add-on whose MCP result coverage is unestablished.
- **Rate limit**: **60 requests per 60 seconds per user**; on 429 honor `Retry-After`, then exponential backoff with jitter.
- **Transport**: the provider itself is a hosted remote server over **Streamable HTTP** at `https://api.mobbin.com/mcp` — there is no local package to install; the official repo is metadata-only. The local bridge is `npx -y mcp-remote` over stdio (HTTP-first, SSE fallback only on HTTP 404; experimental, externally versioned; Node 18+ and working `npx` are prerequisites).

---

## 4. RULES

### ✅ ALWAYS

1. **ALWAYS confirm callables with `tool_info` before first use.** The `mobbin.mobbin_search_screens` form is **CONFIRMED by live discovery 2026-07-16** (fixture `references/discovery-fixture-2026-07-16.json`; registry names are dotted `mobbin.mobbin.<tool>`). Fail closed on any drift from the live three-tool baseline (`search_screens`, `search_flows`, `search_sections`).
2. **ALWAYS load `sk-design` first for any design-affecting request.** This packet is the transport; `sk-design` is the mandatory cross-hub judgment partner. Transport output can never satisfy taste, accessibility, responsiveness, or readiness gates by itself.
3. **ALWAYS report the manual's registration state honestly.** The `mobbin` manual is registered in `.utcp_config.json`: presence means verify read-only and proceed to discovery; absence is a **failure symptom** (a broken or reverted registration) to escalate to the operator, never to repair from this packet.
4. **ALWAYS follow the documented input contract**: `query` from the user's actual words, `platform` `ios`|`web` (infer from context; unclear -> ask), `limit` starting at 5 and never exceeding ~15 without asking. Preserve unknown response fields untouched.
5. **ALWAYS cite evidence by `mobbin_url`** and report `failed[]` entries and missing images as partial success, never silently discarding them.
6. **ALWAYS treat this packet as read-only against this repo** (`mutatesWorkspace: false`). All reads happen against the external Mobbin service; Write, Edit, and Task are forbidden tools for this transport.

### ⛔ NEVER

1. **NEVER use Write, Edit, or Task through this packet.** It is a TRANSPORT: it retrieves external evidence and changes nothing in this workspace. Hand file changes to the owning workflow skill.
2. **NEVER edit, re-draft, or re-add the `mobbin` manual in `.utcp_config.json`.** The registered entry is operator-owned. The reference shape in [`assets/utcp-mobbin-manual.md`](assets/utcp-mobbin-manual.md) exists for verification and escalation, not for this packet to apply or repair.
3. **NEVER invent an API key or auth env var.** No `MOBBIN_API_KEY` or any MCP auth env var exists — the manual's `env` stays empty, and the auth env-var question is answered in the negative, not open. Never accept credentials in prompts or tool arguments; never print Authorization headers, OAuth codes, token responses, adapter debug logs, or auth-cache contents.
4. **NEVER claim OAuth works end-to-end.** It is **Inferred** pending an operator-completed authorization; report it as such. Never inspect, clear, or repair `~/.mcp-auth` / `MCP_REMOTE_CONFIG_DIR` — reauthorization is an explicit operator action.
5. **NEVER invent tool schemas or tool families beyond the discovered inventory.** The live pre-auth listing (2026-07-16) contains exactly `search_screens`, `search_flows`, and `search_sections`. No `search_apps`, `search_elements`, detail, image-download, or mutation tools exist to call. The `deep` question is resolved — `mode: "deep" | "standard" | "fast"` is a real client input on `search_screens` — but do not assume undeclared parameters on any tool.
6. **NEVER target `docs.mobbin.com/mcp`.** That is a separate Mintlify docs-search MCP; the design-reference server this packet owns is `api.mobbin.com/mcp` only. Likewise never conflate the OAuth MCP with the separate API-key REST API.
7. **NEVER treat search rank or image appeal as a taste verdict**, never average strong references into a generic middle, and never copy or cache third-party reference content (screenshots, images) into this repo.

### ⚠️ ESCALATE IF

1. **ESCALATE IF authentication is required** (HTTP 401 beyond the expected pre-auth challenge, OAuth prompt, browser round-trip). Completing browser OAuth is **operator-only**; surface the step and wait. Headless sessions need an operator-visible escalation, never a workaround.
2. **ESCALATE IF discovery shows catalog drift**: a different callable name than the inferred form, unexpected new tools, or any mutation-capable tool. Refuse mutation-capable tools outright; a provider-surface change requires a reviewed packet update.
3. **ESCALATE IF the account is Free-tier or rate-limited** (entitlement denial or 429 beyond the `Retry-After` + backoff protocol), reporting the provider's message verbatim without guessing denial semantics.
4. **ESCALATE IF the manual is missing or malformed in `.utcp_config.json`.** The registered entry is operator-owned; a broken or reverted registration is reported with the reference shape in the asset, and any config change stops with the operator.
5. **ESCALATE IF retrieved evidence conflicts with an `sk-design` reference lock or decision ledger**, asking which source prevails before any design conclusion is drawn.

---

## 5. REFERENCES

### Core References

- [tool-surface.md](references/tool-surface.md) - The live three-tool contract (fixture schemas for `search_screens`, `search_flows`, `search_sections`), the resolved `deep` mode, the query-intent workflows, plan gating, the completeness boundary, and the open questions.
- [mcp-wiring.md](references/mcp-wiring.md) - The registered `mobbin` manual, the mcp-remote bridge (remote Streamable HTTP vs local stdio adapter), OAuth/DCR/PKCE, the confirmed naming (2026-07-16 fixture), and the discovery-first contract, with CONFIRMED/INFERRED/UNKNOWN tagging.
- [troubleshooting.md](references/troubleshooting.md) - Failure modes and fixes (pre-auth 401, no tools resolving, 429, Free-account denial, drift).

### Templates and Assets

- [utcp-mobbin-manual.md](assets/utcp-mobbin-manual.md) - The registered manual's reference shape exactly as researched (registered 2026-07-16, byte-identical to the live config), plus the post-registration checklist (doc-side items executed; live items pending).

### Reference Loading Notes

- `tool-surface.md` is the baseline (always). Load `mcp-wiring.md` and the manual asset for wiring/auth intent, `troubleshooting.md` for errors.
- Keep Section 2 (SMART ROUTING) as the single routing authority.

---

## 6. SUCCESS CRITERIA

**Wiring reporting complete when:**
- ✅ The manual's registration state was reported honestly (presence verified read-only; absence escalated as a failure), nothing in `.utcp_config.json` was touched, and discovery (`list_tools` / `tool_info`) either confirmed the callable or the session/auth/entitlement blocker was escalated to the operator.

**Retrieval complete when:**
- ✅ Discovery preceded any call, the documented input contract was honored (`query`, `platform`, `limit` starting at 5), results were cited by `mobbin_url`, `failed[]` and missing images were reported as partial success, and no invented tool or parameter was used.

**Design-affecting use complete when:**
- ✅ `sk-design` was loaded first, the transport supplied only requested evidence, and no taste, accessibility, or readiness verdict was issued from transport output.

**Always:**
- ✅ No workspace file changed, no credential was invented, printed, or cached, no auth state was touched, no unpublished limit or schema was invented, and every capability claim stayed within the documented record or was labeled Inferred/UNKNOWN.

---

## 7. INTEGRATION POINTS

### Tool Usage Guidelines

- **Code Mode** (`mcp__code_mode__call_tool_chain`) owns every Mobbin call, including discovery (`list_tools`, `search_tools`, `tool_info`) — the registered manual resolves in a fresh Code Mode session (manuals load at startup).
- **Read/Grep/Glob** load references and check the manual's registration state in `.utcp_config.json` read-only.
- **Bash** runs only the read-only `scripts/doctor.sh` diagnostics; this transport has no other shell role (Code Mode owns the stdio process launch, so the packet never runs `npx` itself).

### Cross-Workflow Contracts

- **`sk-design`** is the mandatory cross-hub judgment pairing: it owns intake, mode selection, reference locks, and every taste/accessibility/readiness verdict. The pairing lifecycle: `sk-design` gathers goal, surface, inputs, constraints, proof expectations -> selects the smallest design-judgment mode (interface, foundations, motion, or audit) -> this packet retrieves cited screens through Code Mode -> results return to the selected judgment mode -> `sk-design`, not transport rank or images alone, owns the decision. Pure setup/doctor or factual tool-surface reporting makes no design verdict, but the pairing still applies to anything design-affecting.
- **`mcp-code-mode`** is the substrate: manuals, `{manual}.{manual}_{tool}` naming, discovery, and the error-envelope discipline all come from it. The current local config surface documents `stdio`/`sse` manual shapes, which is why the registered manual bridges through `mcp-remote` rather than declaring direct Streamable HTTP.
- **`mcp-refero`** is the closest sibling: another remote-MCP-via-`mcp-remote`, read-only, OAuth-gated design-research transport in this hub. **`mcp-figma`** is the hub's original Figma transport. Neither overlaps this packet's Mobbin surface.

### External Tools

- **Mobbin MCP** (`https://api.mobbin.com/mcp`): the external, paid, hosted design-research service (manifest identity `com.mobbin/mobbin` v1.0.1; provider transport Streamable HTTP). Not vendored, not mirrored, no local package exists.
- **mcp-remote** (npm, experimental, externally versioned): the stdio-to-HTTP bridge Code Mode launches via `npx` from the registered manual. HTTP-first transport strategy with SSE fallback only on HTTP 404; Node 18+ required.
- **Official Mobbin skills repo** (`github.com/mobbin/skills`, MIT): contains exactly one skill, `mobbin-search`, the authoritative usage contract for `search_screens`. `npx skills add mobbin/skills` installs guidance only; it does not replace the MCP manual or OAuth.

### Knowledge Base Dependencies

**Required**: `references/tool-surface.md` (tool contract baseline). **Conditional**: `mcp-wiring.md` + `assets/utcp-mobbin-manual.md` (wiring/auth), `troubleshooting.md` (errors).

---

## 8. QUICK REFERENCE

| Item | Value |
|---|---|
| Endpoint | `https://api.mobbin.com/mcp` (hosted remote, Streamable HTTP; local bridge `npx -y mcp-remote`) |
| Manual | `mobbin` — **REGISTERED** in `.utcp_config.json` (2026-07-16); discovery DONE 2026-07-16 pre-auth (`references/discovery-fixture-2026-07-16.json`); OAuth pends the operator for CALLS (reference shape in `assets/utcp-mobbin-manual.md`) |
| Callable form | `mobbin.mobbin_search_screens(...)` — **CONFIRMED 2026-07-16**; registry names dotted `mobbin.mobbin.<tool>`; re-confirm via `tool_info` per session |
| Tool surface | THREE live tools: `search_screens` (`query`, `platform` `"ios"`\|`"web"`, `mode` `"deep"`\|`"standard"`\|`"fast"`, `limit`, `exclude_screen_ids`, `image_format`), `search_flows` (`query`, `platform`, `limit`, `page`), `search_sections` (`query`, `limit`, `page`) |
| Result | Declared: `search_screens` `{query, screens[{id, app_name, mobbin_url, image_url, platform}]}`; `search_flows`/`search_sections` add `page`, `has_next_page`; live response shape untested pre-OAuth |
| Workflows | Apps / screens / elements = query intents over `search_screens`; flows = `search_flows`; website sections = `search_sections` |
| Auth | Browser OAuth (DCR, PKCE S256, `openid`) — **no API key, no auth env var**; state in `~/.mcp-auth`, operator-owned |
| Plans | Free: NO MCP · Pro/Team/Enterprise: MCP eligible; per-plan caps undocumented |
| Rate limit | 60 requests / 60 seconds / user; on 429 honor `Retry-After`, then backoff with jitter |
| Open items | Authenticated calls + live response shapes unexercised; OAuth end-to-end Inferred; inline-image fidelity through `call_tool_chain` UNKNOWN (naming + inventory + `deep` mode: resolved 2026-07-16) |
| Judgment | `sk-design`, always, for anything design-affecting |

---

## 9. REFERENCES AND RELATED RESOURCES

The router (Section 2) discovers reference and asset docs dynamically. Start from `references/tool-surface.md` for the tool contract and workflows, `references/mcp-wiring.md` for the bridge and auth model, and `references/troubleshooting.md` for failures.

Assets: `assets/utcp-mobbin-manual.md` (the registered manual's reference shape, byte-identical to the researched sol/luna drafts and to the live `.utcp_config.json` entry), loaded for wiring/auth intent.

Scripts: `scripts/doctor.sh` (read-only, non-interactive diagnostics; manual absence now reported as an ERROR — a broken or reverted registration; optional endpoint probe gated behind `MOBBIN_DOCTOR_LIVE=1`, expecting the documented HTTP 401) and `scripts/install.sh` (non-interactive verify-only posture check: Node 18+/npx, manual presence, and the operator-only OAuth pointer).

Examples: `examples/README.md` plus worked Code Mode walkthroughs (smoke search, platform-filtered flow research, element intent), all quoting the 2026-07-16 discovery-confirmed callables with the mandatory per-session `tool_info` confirmation first.

Related skills: `sk-design` (the mandatory judgment pairing), `mcp-code-mode` (the substrate), `mcp-refero` (the closest sibling transport), `mcp-figma` (the hub's Figma transport), `mcp-chrome-devtools` (browser preview only), `sk-code` (adapting evidence into an app), and `system-spec-kit` when packet documentation or memory continuity applies.

Install guide: [INSTALL_GUIDE.md](INSTALL_GUIDE.md).

Upstream: the Mobbin MCP is the hosted paid service at `api.mobbin.com/mcp` (docs at docs.mobbin.com/mcp; the official `mobbin/mobbin-mcp-server` repository is registration metadata only). The official [mobbin/skills](https://github.com/mobbin/skills) repository (MIT) holds the single `mobbin-search` skill; this packet references it and deliberately does not vendor it.
