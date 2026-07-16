---
name: mcp-mobbin
description: "Mobbin MCP transport: read-only app/screen/flow design research via Code Mode; sk-design owns the judgment."
compatibility: Requires a paid Mobbin plan for MCP (Pro, Team, or Enterprise; Free has no MCP access), the npx mcp-remote bridge, Node.js >=18, and a browser OAuth round-trip on first use.
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.1.0.0
user-invocable: true
---

<!-- Keywords: mobbin, mobbin-mcp, app-design-research, screen-examples, ux-flow-references, search-screens, mcp-remote, code-mode, sk-design, design-research-transport -->

# Mobbin (mcp-mobbin)

Search **Mobbin's library of real app UI screenshots** ("the world's largest library of real app UI screenshots" per the official repo) from an agent through the **Mobbin MCP via Code Mode**: one documented tool, `search_screens`, answering app, screen, flow, and element research as query intents. This packet is a read-only TRANSPORT (`packetKind: transport`, `mutatesWorkspace: false`): every call goes against the external hosted Mobbin service, never this repo, and it is **never the taste authority**. Any design-affecting use pairs with `sk-design` first. Deep operational detail lives in [`references/tool_surface.md`](references/tool_surface.md) and [`references/mcp_wiring.md`](references/mcp_wiring.md).

> **Discovery trap (read first).** The `mobbin` Code Mode manual **IS REGISTERED** in this repo's `.utcp_config.json` (registered 2026-07-16 by an operator; this packet never edits the config), but **live discovery has NOT run**: manuals load at Code Mode startup, so the tools resolve only in a fresh Code Mode session, and operator browser OAuth is still pending. Until discovery runs, the Code Mode callable name is **INFERRED**: convention predicts dotted discovery `mobbin.mobbin.search_screens` and callable `mobbin.mobbin_search_screens(...)`, but a **`tool_info` confirmation is MANDATORY** before relying on any name. Confirm, then call, and fail closed on drift.
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
references/tool_surface.md      # the one-tool surface, args, response shape, workflows, plan gating
references/mcp_wiring.md        # registered manual, mcp-remote bridge, OAuth/DCR/PKCE, naming, discovery
references/troubleshooting.md   # failure modes + fixes
assets/utcp_mobbin_manual.md    # Registered manual's reference shape + post-registration checklist
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| ALWAYS | Every invocation | `references/tool_surface.md` (tool contract + workflow baseline) |
| CONDITIONAL | Wiring / auth intent | `references/mcp_wiring.md`, `assets/utcp_mobbin_manual.md` |
| CONDITIONAL | Setup / error intent | `references/troubleshooting.md` |
| ALWAYS (design work) | Retrieved evidence feeds a design decision | `sk-design` modes, loaded before any taste call |

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../../sk-doc/create-skill/assets/skill/skill_smart_router.md). Guard paths, discover at runtime, score intents, and fall back when unsure. Because this skill has no keyed resource subdirectories, intent selects from the flat resource inventory below.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/tool_surface.md"
MIN_CONFIDENCE = 1
AMBIGUITY_DELTA = 1

INTENT_MODEL = {
    "APPS":         {"keywords": [("app design research", 4), ("app research", 4), ("competitor", 3), ("app comparison", 3), ("banking apps", 2), ("category", 2), ("how do apps", 2), ("real apps", 3)]},
    "SCREENS":      {"keywords": [("screen", 4), ("screen examples", 4), ("ui pattern", 3), ("empty state", 3), ("onboarding screen", 3), ("component example", 3), ("screenshot", 3), ("paywall", 2), ("settings", 2), ("dashboard", 2)]},
    "FLOWS":        {"keywords": [("flow", 4), ("ux flow", 4), ("user flow", 4), ("journey", 4), ("multi-step", 3), ("progression", 2), ("forgot password", 2), ("checkout", 2), ("signup process", 2)]},
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
    "SCREENS":      {"weight": 4, "keywords": ["screen", "screen examples", "ui pattern", "empty state", "onboarding screen", "component example", "screenshot", "paywall", "settings", "dashboard"]},
    "FLOWS":        {"weight": 4, "keywords": ["flow", "ux flow", "user flow", "journey", "multi-step", "progression", "forgot password", "checkout", "signup process"]},
    "ELEMENTS":     {"weight": 4, "keywords": ["element", "bottom sheet", "inline validation", "component behavior", "button state", "tab bar", "modal", "confirmation dialog"]},
    "WIRING_AUTH":  {"weight": 4, "keywords": ["wiring", "utcp", "oauth", "mcp-remote", "authenticate", "pkce", "manual", "register", "token", "plan", "install", "setup"]},
    "TROUBLESHOOT": {"weight": 4, "keywords": ["error", "failed", "401", "not working", "not resolving", "429", "rate limit", "timeout", "unauthorized", "denied"]},
}

RESOURCE_MAP = {
    "APPS":         ["references/tool_surface.md"],
    "SCREENS":      ["references/tool_surface.md"],
    "FLOWS":        ["references/tool_surface.md"],
    "ELEMENTS":     ["references/tool_surface.md"],
    "WIRING_AUTH":  ["references/mcp_wiring.md", "assets/utcp_mobbin_manual.md"],
    "TROUBLESHOOT": ["references/troubleshooting.md", "references/mcp_wiring.md"],
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
        return ("WIRING_AUTH", None, scores)   # unrouted -> start by reporting the wiring state
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_mobbin_resources(request: str):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [primary] + ([secondary] if secondary else [])
    loaded, seen, notices = [], set(), []

    def load_if_available(rel: str) -> bool:
        guarded = _guard_in_skill(rel)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)
            return True
        if guarded not in inventory:
            notices.append(f"Resource not found in inventory: {guarded}")
        return False

    load_if_available(DEFAULT_RESOURCE)
    if max(scores.values() or [0]) < MIN_CONFIDENCE:
        return {"intents": intents, "load_level": "UNKNOWN_FALLBACK", "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST, "resources": loaded, "notices": notices}
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
// Convention predicts dotted discovery: mobbin.mobbin.search_screens
const all = await list_tools();
// MANDATORY: confirm the exact callable + schema before relying on any name
const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" });
```

Both the dotted discovery name and the callable form are **INFERRED from the Code Mode `{manual}.{manual}_{tool}` convention** (mirroring `clickup.clickup_*`) — no live discovery has run, because no fresh Code Mode session has loaded the registered manual yet and the endpoint is auth-protected pending operator OAuth. If discovery ever shows different names, missing tools, unexpected new tools, or a mutation-capable tool, **fail closed**: report the drift; a changed provider surface requires a reviewed packet update, not an improvised call.

### The one-tool surface

The complete **publicly documented** baseline is one read tool. Full args, response shape, and the completeness boundary: [`references/tool_surface.md`](references/tool_surface.md).

| Tool | Posture | Documented inputs | Documented result |
|---|---|---|---|
| `search_screens` | Read/search | `query` (natural language); `platform` `ios`\|`web`; `limit` default 5, normally <= ~15 for variety | `screens[]` metadata, `failed[]`, then ordered inline image blocks |

Documented metadata shape:

```text
screens: [{ index, id, app_name, mobbin_url, image_url, platform }]
failed:  []
```

Inline images arrive in the same response after the metadata block, one per `screens[]` entry in the same order — `index` correlates image to app. **No second image-download tool exists or should be invented.** Hard boundaries: what the authenticated `tools/list` actually contains, and the live JSON Schema of `search_screens`, are **UNKNOWN** until an operator-authorized authenticated discovery run. Never invent `search_apps`, `search_flows`, `search_elements`, or any detail/image/mutation tool. An **open conflict** exists on whether `deep` search is a client-settable input or server-side behavior — do not hardcode a `deep` parameter until `tool_info` confirms it.

### Calling through Code Mode

> **Callable-name caveat.** The exact Code Mode callable name is unconfirmed — it pends live discovery in a fresh Code Mode session with operator OAuth completed. The call below is **illustrative** (schema unconfirmed until `tool_info`), quoting the convention-derived form.

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

### Research workflows (app / screen / flow / element = query intents)

There are **not** four tool families — all four research dimensions are intent-specific query designs over `search_screens`:

1. **App research** — name the app/company/category and comparison goal ("banking apps onboarding identity verification"); compare `app_name`, platform, structure, visible patterns.
2. **Screen research** — name the concrete screen/state/job ("iOS subscription cancellation confirmation", "web empty-state dashboard"); start at 5 results; cite each `mobbin_url` used.
3. **Flow research** — describe the journey and target step ("first-run onboarding progression", "forgot-password recovery"). The contract returns screens, not an ordered flow object — reconstruct sequence only when visual evidence supports it and label reconstruction as inference.
4. **Element research** — name component + context/state ("bottom-sheet destructive confirmation", "inline validation on signup"); analyze element behavior within returned screens; never fabricate an element-detail tool.

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

1. **ALWAYS confirm callables with `tool_info` before first use.** The `mobbin.mobbin_search_screens` form is convention-derived and **INFERRED**; the manual is registered but no live discovery has run (a fresh Code Mode session plus operator OAuth pend). Fail closed on any drift from the documented single-tool baseline.
2. **ALWAYS load `sk-design` first for any design-affecting request.** This packet is the transport; `sk-design` is the mandatory cross-hub judgment partner. Transport output can never satisfy taste, accessibility, responsiveness, or readiness gates by itself.
3. **ALWAYS report the manual's registration state honestly.** The `mobbin` manual is registered in `.utcp_config.json`: presence means verify read-only and proceed to discovery; absence is a **failure symptom** (a broken or reverted registration) to escalate to the operator, never to repair from this packet.
4. **ALWAYS follow the documented input contract**: `query` from the user's actual words, `platform` `ios`|`web` (infer from context; unclear -> ask), `limit` starting at 5 and never exceeding ~15 without asking. Preserve unknown response fields untouched.
5. **ALWAYS cite evidence by `mobbin_url`** and report `failed[]` entries and missing images as partial success, never silently discarding them.
6. **ALWAYS treat this packet as read-only against this repo** (`mutatesWorkspace: false`). All reads happen against the external Mobbin service; Write, Edit, and Task are forbidden tools for this transport.

### ⛔ NEVER

1. **NEVER use Write, Edit, or Task through this packet.** It is a TRANSPORT: it retrieves external evidence and changes nothing in this workspace. Hand file changes to the owning workflow skill.
2. **NEVER edit, re-draft, or re-add the `mobbin` manual in `.utcp_config.json`.** The registered entry is operator-owned. The reference shape in [`assets/utcp_mobbin_manual.md`](assets/utcp_mobbin_manual.md) exists for verification and escalation, not for this packet to apply or repair.
3. **NEVER invent an API key or auth env var.** No `MOBBIN_API_KEY` or any MCP auth env var exists — the manual's `env` stays empty, and the auth env-var question is answered in the negative, not open. Never accept credentials in prompts or tool arguments; never print Authorization headers, OAuth codes, token responses, adapter debug logs, or auth-cache contents.
4. **NEVER claim OAuth works end-to-end.** It is **Inferred** pending an operator-completed authorization; report it as such. Never inspect, clear, or repair `~/.mcp-auth` / `MCP_REMOTE_CONFIG_DIR` — reauthorization is an explicit operator action.
5. **NEVER invent tool schemas or tool families.** The authenticated `tools/list` is unobserved; `search_screens` is the only documented tool. No `search_apps`, `search_flows`, `search_elements`, detail, image-download, or mutation tools exist to call, and no `deep` parameter may be hardcoded while the input-vs-server-behavior conflict stays open.
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

- [tool_surface.md](references/tool_surface.md) - The single-tool contract: inputs, response shape, inline-image ordering, the four query-intent workflows, plan gating, the completeness boundary, and the open questions.
- [mcp_wiring.md](references/mcp_wiring.md) - The registered `mobbin` manual, the mcp-remote bridge (remote Streamable HTTP vs local stdio adapter), OAuth/DCR/PKCE, the inferred naming, and the discovery-first contract, with CONFIRMED/INFERRED/UNKNOWN tagging.
- [troubleshooting.md](references/troubleshooting.md) - Failure modes and fixes (pre-auth 401, no tools resolving, 429, Free-account denial, drift).

### Templates and Assets

- [utcp_mobbin_manual.md](assets/utcp_mobbin_manual.md) - The registered manual's reference shape exactly as researched (registered 2026-07-16, byte-identical to the live config), plus the post-registration checklist (doc-side items executed; live items pending).

### Reference Loading Notes

- `tool_surface.md` is the baseline (always). Load `mcp_wiring.md` and the manual asset for wiring/auth intent, `troubleshooting.md` for errors.
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

**Required**: `references/tool_surface.md` (tool contract baseline). **Conditional**: `mcp_wiring.md` + `assets/utcp_mobbin_manual.md` (wiring/auth), `troubleshooting.md` (errors).

---

## 8. QUICK REFERENCE

| Item | Value |
|---|---|
| Endpoint | `https://api.mobbin.com/mcp` (hosted remote, Streamable HTTP; local bridge `npx -y mcp-remote`) |
| Manual | `mobbin` — **REGISTERED** in `.utcp_config.json` (2026-07-16); discovery pends a fresh Code Mode session; OAuth pends the operator (reference shape in `assets/utcp_mobbin_manual.md`) |
| Callable form | `mobbin.mobbin_search_screens(...)` — **INFERRED**; confirm via `tool_info` in a fresh Code Mode session before first use |
| Tool surface | ONE documented tool: `search_screens` (`query`, `platform` `ios`\|`web`, `limit` default 5, <= ~15) |
| Result | `screens[]` (`index, id, app_name, mobbin_url, image_url, platform`) + `failed[]` + ordered inline images |
| Workflows | Apps / screens / flows / elements = query intents over `search_screens`, not tool families |
| Auth | Browser OAuth (DCR, PKCE S256, `openid`) — **no API key, no auth env var**; state in `~/.mcp-auth`, operator-owned |
| Plans | Free: NO MCP · Pro/Team/Enterprise: MCP eligible; per-plan caps undocumented |
| Rate limit | 60 requests / 60 seconds / user; on 429 honor `Retry-After`, then backoff with jitter |
| Open items | Authenticated `tools/list` + live schema UNKNOWN; `deep` parameter conflict open; OAuth end-to-end Inferred |
| Judgment | `sk-design`, always, for anything design-affecting |

---

## 9. REFERENCES AND RELATED RESOURCES

The router (Section 2) discovers reference and asset docs dynamically. Start from `references/tool_surface.md` for the tool contract and workflows, `references/mcp_wiring.md` for the bridge and auth model, and `references/troubleshooting.md` for failures.

Assets: `assets/utcp_mobbin_manual.md` (the registered manual's reference shape, byte-identical to the researched sol/luna drafts and to the live `.utcp_config.json` entry), loaded for wiring/auth intent.

Scripts: `scripts/doctor.sh` (read-only, non-interactive diagnostics; manual absence now reported as an ERROR — a broken or reverted registration; optional endpoint probe gated behind `MOBBIN_DOCTOR_LIVE=1`, expecting the documented HTTP 401) and `scripts/install.sh` (non-interactive verify-only posture check: Node 18+/npx, manual presence, and the operator-only OAuth pointer).

Examples: `examples/README.md` plus worked Code Mode walkthroughs (smoke search, platform-filtered flow research, element intent), all quoting the INFERRED callable with the mandatory `tool_info` confirmation first.

Related skills: `sk-design` (the mandatory judgment pairing), `mcp-code-mode` (the substrate), `mcp-refero` (the closest sibling transport), `mcp-figma` (the hub's Figma transport), `mcp-chrome-devtools` (browser preview only), `sk-code` (adapting evidence into an app), and `system-spec-kit` when packet documentation or memory continuity applies.

Install guide: [INSTALL_GUIDE.md](INSTALL_GUIDE.md).

Upstream: the Mobbin MCP is the hosted paid service at `api.mobbin.com/mcp` (docs at docs.mobbin.com/mcp; the official `mobbin/mobbin-mcp-server` repository is registration metadata only). The official [mobbin/skills](https://github.com/mobbin/skills) repository (MIT) holds the single `mobbin-search` skill; this packet references it and deliberately does not vendor it.
