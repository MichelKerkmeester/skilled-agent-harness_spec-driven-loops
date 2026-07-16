---
title: "Mobbin Tool Surface"
description: "The single-tool Mobbin MCP contract: search_screens inputs, response shape, inline-image ordering, the four query-intent research workflows, plan gating, rate limits, the completeness boundary, and the open questions carried as UNKNOWN."
trigger_phrases:
  - "mobbin tools"
  - "mobbin search screens"
  - "mobbin tool surface"
  - "mobbin plan gating"
  - "mobbin rate limit"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# Mobbin Tool Surface

The expected contract for the Mobbin MCP's **one publicly documented read tool**: `search_screens`. Treat this document as the documented baseline and Code Mode discovery (`list_tools` / `search_tools` / `tool_info`) as the final live schema before calling — the `mobbin` manual is registered (2026-07-16), so discovery pends only a fresh Code Mode session and an operator-completed OAuth. Documented facts trace to the official Mobbin skills repository (`mobbin/skills`, whose single `mobbin-search` skill is the authoritative usage contract) and the official Mobbin MCP docs (docs.mobbin.com/mcp).

Claims below are tagged **[CONFIRMED]** (publicly documented or observed by live unauthenticated probe at research time, 2026-07-16), **[INFERRED]** (supported but not exercised end-to-end), or **[UNKNOWN]** (requires an authenticated, paid, operator-authorized runtime).

> App, screen, flow, and element research are **query intents over `search_screens`**, not four tool families. There are no `search_apps`, `search_flows`, `search_elements`, detail, or image-download tools, and none may be invented.

---

## 1. THE ONE TOOL

| Tool | Posture | Skill-level inputs | Skill-level result |
|---|---|---|---|
| `search_screens` | Read/search | `query`: natural language; `platform`: `ios` or `web`; `limit`: default 5, normally <= ~15 for variety | `screens[]` metadata, `failed[]`, then ordered inline image blocks |

**[CONFIRMED: official `mobbin-search` SKILL.md]** Documented metadata shape:

```text
screens: [{ index, id, app_name, mobbin_url, image_url, platform }]
failed:  []
```

Inline images arrive in the same response after the metadata block, one per `screens[]` entry in the same order — `index` correlates image to app. No second image-download tool exists or should be invented. **[CONFIRMED]**

### Hard constraints

- `query` is natural language, derived from the user's actual words.
- `platform` is the enum `ios` | `web`; infer from app context, ask when unclear.
- `limit` defaults to 5; the official guidance treats ~15 as the ceiling for variety. Start at 5; ask before widening materially.
- `failed[]` entries and missing images are **partial success**: report them, never silently discard.
- Preserve unknown response fields untouched; the live schema is unobserved (below).
- Cite every selected reference by its `mobbin_url` (provenance).

### The `deep` conflict (open — do not hardcode)

The research record preserves an unresolved conflict on `deep` search: one reading treats it as a client-settable **input mode** for complex queries; another reads the same official skill text as **server-side behavior** with only three user-facing inputs (`query`, `platform`, `limit`). **[CONFLICT: unresolved]** Do not hardcode a `deep` parameter until `tool_info` shows the live schema.

### Completeness boundary

- **Confirmed**: `search_screens` is the only publicly documented tool. The official `skills/` tree contains exactly one skill (`mobbin-search`) naming only `search_screens`; the server repo publishes no implementation or `tools/list` export; the endpoint is auth-protected, so public enumeration is impossible. **[CONFIRMED at 2026-07-16: server repo HEAD `bbee2a6be34d251c580ba80bb8b407c87587aba7` (2026-06-03); skills repo HEAD `9657786338c5e7fed597031982398a8d99681fec` (2026-05-04)]**
- **UNKNOWN**: whether authenticated `tools/list` contains only that tool, and its exact JSON Schema.
- **Not allowed**: inventing `search_apps`, `search_flows`, `search_elements`, detail/image/mutation tools.
- The packet's read-only guarantee is an **authorization boundary**: allow only verified read/search tools; if live discovery returns a mutation-capable tool, refuse it and require an explicit reviewed contract change.

### Two-server disambiguation

`docs.mobbin.com/mcp` is a **separate** Mintlify docs-search MCP ("Mobbin Docs") exposing `search_mobbin_docs`, `query_docs_filesystem_mobbin_docs`, and `submit_feedback`. It belongs to the docs server, not the design server. This packet targets `api.mobbin.com/mcp` only. **[CONFIRMED]**

---

## 2. THE FOUR QUERY-INTENT WORKFLOWS

All four research dimensions run over the single `search_screens` tool:

1. **App research** — name the app/company/category and the comparison goal ("banking apps onboarding identity verification"); compare `app_name`, platform, structure, and visible patterns across results. Multiple results are evidence, not a design chooser.
2. **Screen research** — name the concrete screen/state/job ("iOS subscription cancellation confirmation", "web empty-state dashboard"); start at 5 results; cite each `mobbin_url` used.
3. **Flow research** — describe the journey and target step ("first-run onboarding progression", "forgot-password recovery"). The public contract returns screens, not an ordered flow object — reconstruct sequence only when visual evidence supports it, and **label the reconstruction as inference**.
4. **Element research** — name component + context/state ("bottom-sheet destructive confirmation", "inline validation on signup"); analyze element behavior within returned screens; never fabricate an element-detail tool.

### The official operating sequence

From the official `mobbin-search` skill: derive query terms from the user's actual words -> infer `ios` vs `web` from app context (unclear -> ask) -> announce a short search plan -> call `search_screens` in the same turn -> visually inspect returned references (observe content, structure, styling, interaction; compare repeats and meaningful differences; synthesize principles) -> answer from evidence tied to returned screens.

The official skill's **optional evidence-board writer is excluded** from this transport: board creation violates the non-mutating packet boundary.

### The local judgment boundary

This transport allows breadth while researching (multiple apps, screens, intents compared through metadata and images), but design-affecting use is governed by the `sk-design` contract: the design skill collapses evidence to one declared critique reference before any judgment. A transport response is untrusted reference evidence, never design approval. Search rank is not taste; an appealing screenshot is not acceptance; and no accessibility, responsiveness, or readiness verdict ever comes from this packet.

---

## 3. PLAN GATING AND LIMITS

| Surface | Free | Pro | Team | Enterprise | Credential |
|---------|:----:|:---:|:----:|:----------:|------------|
| Mobbin website | Limited browsing | Full | Included | Included | User session |
| Mobbin MCP | **No** | **Yes** | **Yes** | **Yes** | Browser OAuth |
| Mobbin REST API | No | No | Yes | Yes | Workspace API key |

**[CONFIRMED: docs.mobbin.com/mcp/introduction, /overview, /api/quickstart, mobbin.com/pricing]**

- No reviewed source documents different MCP tool sets per paid tier — do not invent per-tool tier gates.
- The exact Free-account MCP denial behavior (status/payload/UX) is **UNVERIFIED** — state "MCP starts at Pro" without guessing failure semantics.
- Per-plan usage caps within eligible tiers (searches/day, screens/query, whether the ~15 `limit` ceiling is plan-derived) are **undocumented** — carry as a caveat, never a claimed matrix.
- Finance+ is a separate paid add-on; whether it changes MCP-returned datasets is **unestablished**.
- The separate REST API (Team/Enterprise, workspace Bearer key, e.g. `POST /v1/screens/search`) must never be conflated with MCP.

**Rate limit** **[CONFIRMED: docs.mobbin.com/rate-limits]**: 60 requests per 60 seconds per user. On 429, honor `Retry-After`, then exponential backoff with jitter. Do not invent finer-grained burst or concurrency contracts.

---

## 4. THE OFFICIAL SKILLS REPOSITORY

`github.com/mobbin/skills` (MIT) is the official skills repository. Its `skills/` tree contains **exactly one skill: `mobbin-search`**, whose SKILL.md is the authoritative usage contract for `search_screens` (inputs, response shape, workflow, visual-analysis guidance, optional board path). The documented install path for clients that want the skill bundle is `npx skills add mobbin/skills` (plus a manual clone/copy path) — this installs **guidance only** and does not replace the MCP manual or OAuth setup. This packet references the repository and deliberately does not vendor it.

---

## 5. OPEN QUESTIONS (UNKNOWN, RUNTIME-ONLY)

These stay UNKNOWN until an operator-authorized, paid, authenticated runtime exists; none can be resolved by authoring, and none blocked this packet's authorship. Note: **auth env-var naming is NOT among them** — no MCP auth env var exists; that question is answered in the negative.

1. **Authenticated tool inventory + schemas** — what exact tool names and JSON Schemas do authenticated `list_tools()` / `tools/list` and `tool_info()` return on the validation date?
2. **Adapter round trip** — does the current local Code Mode + `mcp-remote` version complete first-use Mobbin OAuth, token refresh, and reconnect reliably (any extra flags needed)?
3. **Runtime callable name** — is the Code Mode callable exactly `mobbin.mobbin_search_screens`, or does this Code Mode version expose a different prefix/alias?
4. **`deep` search** — is `deep` a client-settable input parameter or server-side behavior? (Preserved conflict; see Section 1.)
5. **Free-account denial semantics** — what precise status/payload/UX does a Free account receive during MCP authorization or tool use?
6. **Per-plan usage caps** — do searches/day or screens-per-query caps exist within the eligible Pro/Team/Enterprise tiers (is the ~15 `limit` ceiling plan-derived)?
7. **Finance+ coverage** — does the Finance+ add-on change the dataset returned through standard MCP search?
8. **Inline-image fidelity through Code Mode** — does `call_tool_chain` faithfully pass the inline image content blocks, or does visual inspection need a side-channel? (Verify at install.)
9. **Paid-gate edge cases** — are there account/workspace edge cases within the documented Pro/Team/Enterprise gate requiring more specific packet error messages?
10. **Live schema extras** — does the live `search_screens` schema expose optional fields beyond `query`/`platform`/`limit`? Do not assume them until `tool_info` confirms.

---

## 6. RELATED RESOURCES

- [mcp_wiring.md](mcp_wiring.md) - the draft manual, the mcp-remote bridge, OAuth/DCR/PKCE, the inferred naming rule, and the discovery-first contract.
- [troubleshooting.md](troubleshooting.md) - symptom, cause, and fix for the common failure modes.
- [utcp_mobbin_manual.md](../assets/utcp_mobbin_manual.md) - the registered manual's reference shape and the post-registration checklist (doc-side items executed; live items pending).
- [SKILL.md](../SKILL.md) - the runtime contract this reference supports.
