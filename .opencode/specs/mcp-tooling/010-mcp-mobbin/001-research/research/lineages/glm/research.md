# Mobbin MCP Developer Surface — Research Synthesis

**Lineage:** glm (executor B: cli-opencode / zai-coding-plan/glm-5.2)
**Session:** fanout-glm-1784199634206-lfqjyo
**Spec folder:** `.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research`
**Iterations:** 2 of 2 (stop policy: `max-iterations`)
**Compiled:** 2026-07-16T13:15:00Z

> Workflow-owned canonical synthesis. All load-bearing claims cite a source. Unresolved items are marked **INFERRED** or **UNKNOWN** — never papered over. Fetched content was treated as untrusted data throughout.

---

## 1. Executive Summary

The Mobbin MCP developer surface is a **remote Streamable HTTP** server at `https://api.mobbin.com/mcp` (manifest name `com.mobbin/mobbin`) that exposes **one design-research tool, `search_screens`**, returning real app screenshots as inline image content blocks plus metadata. It is consumed **url-only** in client config (no `command`/`args`, no local process, no static API key in any documented config). This makes it a clean fit for an **`mcp-mobbin` transport packet that is read-only, Code-Mode-only, and pairs with `sk-design` for visual judgment**.

A critical disambiguation surfaced: there are **two distinct Mobbin MCP servers** — the design-reference server at `api.mobbin.com/mcp` (the packet target) and a separate Mintlify docs-search server at `docs.mobbin.com/mcp`. They must not be conflated.

Two items remain unresolved by design and must be verified at install: the precise **auth/account-linking model** (no static client key is documented, but account identity is inferred to be server-side) and **free-vs-Pro plan gating** (entirely undocumented).

---

## 2. Background & Context

Mobbin is "the world's largest library of real app UI screenshots" `[SOURCE: https://github.com/mobbin/skills]`. The `mcp-mobbin` nested mode in the mcp-tooling hub will author a transport packet (phase 002) and register a `.utcp_config.json` manual (phase 003) to surface Mobbin's design-research capability through Code Mode's `call_tool_chain()`, with `sk-design` providing taste/judgment and the transport staying a pure data retriever.

This research phase (Phase 1) ran a 2-iteration deep-research loop in the `glm` lineage to ground phases 002/003 in verified findings rather than assumptions `[SOURCE: parent spec.md phase context]`.

---

## 3. Problem Statement

Phases 002 and 003 must author a transport packet and register a UTCP manual for an MCP server this repo has never run. The server's actual tool surface, credential model, plan gating, and read-only guarantees were unverified — authoring from assumptions would bake errors into the skill's tool_surface reference, the UTCP manual snippet, and the transport-contract claims `[SOURCE: parent spec.md §2]`.

---

## 4. Scope

**In scope (this lineage):** the design-reference Mobbin MCP developer surface — tool list + I/O, transport, auth posture, read-only eligibility, and the official design-research skill workflow — sufficient to specify the transport packet and `.utcp_config.json` manual.

**Out of scope:** implementing/installing the server (phase 004), editing `.utcp_config.json` (phase 003), authoring the packet (phase 002), and any path outside this lineage directory.

---

## 5. Key Questions & Answers

| ID | Question | Status | Answer |
|----|----------|--------|--------|
| KQ1 | Full tool surface (names + I/O + read-only) | **RESOLVED** | Design MCP exposes `search_screens` (`query`, `platform` ios\|web, `limit`, `deep` mode). Returns `{screens:[{index,id,app_name,mobbin_url,image_url,platform}],failed:[]}` + inline image blocks. `[SOURCE: mobbin-search SKILL.md]` |
| KQ2 | Credential model + provisioning | **INFERRED** | All documented client configs are url-only — no static API key/headers/OAuth field. Account identity inferred server-side; needs a live round-trip to confirm. `[SOURCE: mcp.json, skills README]` |
| KQ3 | Transport + install/run command | **RESOLVED** | Remote **Streamable HTTP** at `https://api.mobbin.com/mcp`; no local process; url-only client config. `[SOURCE: server.json remotes, mcp.json]` |
| KQ4 | Pro-plan gating / free-tier behavior | **UNKNOWN** | Undocumented in all fetched sources. Mobbin is freemium, so account-level usage limits almost certainly exist but are unverified. `[SOURCE: absence-of-evidence]` |
| KQ5 | Official mobbin/skills design-research workflows | **RESOLVED** | One skill `mobbin-search` driving `search_screens` via a 6-step workflow (plan → announce → call → respond/board → build board → more). `[SOURCE: mobbin/skills, mobbin-search SKILL.md]` |
| KQ6 | Phase-002 packet + `.utcp_config.json` manual shape | **RESOLVED** (shape) | Remote streamable-http packet, Code Mode only, read-only (`mutatesWorkspace:false`), tool `search_screens`, sk-design pairing; UTCP manual name `mobbin`, exposed tool `mobbin_search_screens`. Exact JSON schema deferred to phase 003. |

---

## 6. Methodology

Detached parallel fan-out lineage executing the deep-research loop protocol: `phase_init` (config/strategy/state/registry) → 2 evidence iterations (each: read state, convergence-as-telemetry check, WebFetch sources, write `iteration-NNN.md`, append JSONL delta, reducer-refresh strategy/registry/dashboard) → `phase_synthesis`. Per the stop policy, convergence before max iterations was treated as telemetry only and angles were broadened (READMEs → raw manifests → live docs endpoint → skill file) instead of synthesizing early. `progressiveSynthesis: true`.

---

## 7. Sources

- `[SOURCE: https://github.com/mobbin/mobbin-mcp-server]` — official server repo (metadata-only: README, mcp.json, server.json, rules/, .cursor-plugin/)
- `[SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json]` — design MCP manifest (`com.mobbin/mobbin` v1.0.1, `remotes:[{type:streamable-http, url:https://api.mobbin.com/mcp}]`)
- `[SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json]` — url-only client config `{mcpServers:{mobbin:{url:https://api.mobbin.com/mcp}}}`
- `[SOURCE: https://docs.mobbin.com/mcp]` — Mobbin Docs Mintlify MCP (secondary surface; disambiguation)
- `[SOURCE: https://github.com/mobbin/skills]` — official skills repo (MIT; prerequisites + mobbin-search overview + install)
- `[SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]` — `search_screens` tool contract + 6-step workflow
- Parent `spec.md` phase context + `context/website-link.md` — source link inventory and phase framing

`resource-map.md` was not present at init; the coverage gate was skipped (informational).

---

## 8. Tool Surface (Detailed)

### 8.1 Design-reference MCP (`api.mobbin.com/mcp`) — PRIMARY target

**Tool: `search_screens`**
- **Purpose:** server-side search of Mobbin's curated app-screen library; fetches every matching image and returns them inline.
- **Inputs** (from the skill's usage contract):
  - `query` (string) — search terms; use the user's words, go broad.
  - `platform` (`ios` | `web`) — infer from app context (web → web; SwiftUI/RN → ios; unclear → ask).
  - `limit` (int) — default `5`; bump toward ~15 for variety.
  - `deep` search mode — for complex queries.
- **Outputs:** metadata text block `{ screens: [{index, id, app_name, mobbin_url, image_url, platform}], failed: [...] }` followed by N inline image content blocks (one per `screens[]` entry, same order). `index` correlates image↔app; `image_url` is a debug/sanity reference.
- **Read-only:** confirmed — returns screenshots + metadata only. `mutatesWorkspace:false`.
- `[SOURCE: mobbin-search SKILL.md §3]`

> The exact JSON Schema for `search_screens` inputs was not published in the fetched sources (the skill describes usage, not the raw schema). Phase 002 should treat `{query, platform, limit}` as the documented contract and confirm the full schema against the live server at install.

### 8.2 Docs MCP (`docs.mobbin.com/mcp`) — SECONDARY, out of primary scope

A separate Mintlify docs-search server ("Mobbin Docs", transport `http`) exposing:
- `search_mobbin_docs` — search the Mobbin Docs knowledge base.
- `query_docs_filesystem_mobbin_docs` — read-only virtualized filesystem over the docs (`rg`/`grep`/`tree`/`cat`/`head`/`jq`, stateless, 30KB truncation).
- `submit_feedback` — report docs issues (the only non-purely-read action, and it belongs to the docs server, not the design server).
Self-declared "read-only and scoped to Mobbin Docs." `[SOURCE: https://docs.mobbin.com/mcp]`

---

## 9. Transport & Auth Model

**Transport:** remote **Streamable HTTP**. Declared in `server.json` as `remotes:[{type:"streamable-http", url:"https://api.mobbin.com/mcp"}]` `[SOURCE: server.json]`. There is no local `command`/`args`, no `npx`/`node` runtime, and no process to spawn — the client points at the URL.

**Auth (INFERRED, not confirmed):** every documented client config is url-only with no `headers`, `apiKey`, or OAuth field `[SOURCE: mcp.json, skills README]`. This strongly implies the MCP layer does not require a statically-configured secret. Account identity and any rate limits are most plausibly established server-side (per-session), possibly via an out-of-band browser/account-linking step the static configs omit. **What would confirm it:** a live authenticated `initialize`/`tools/call` round-trip against `api.mobbin.com/mcp` — explicitly out of scope for this read-only phase; phase 003 verifies at install.

---

## 10. Plan Gating (UNKNOWN)

None of `server.json`, `mcp.json`, the skills README/SKILL.md, or the docs MCP manifest document free-vs-Pro gating. Mobbin is a freemium product, so account-level usage limits (searches/day, screens per query) almost certainly exist and likely scale with plan; the `search_screens` `limit` ceiling (~15 per the skill) may itself be plan-derived. **This is unverified.** Phase 002 must document this as an open install-guide caveat and make no Pro/free claims it cannot cite `[SOURCE: absence-of-evidence across the four fetched sources]`.

---

## 11. Recommendations (phase 002/003 contract)

### Transport packet (`mcp-tooling/mcp-mobbin/`)
- Target **`https://api.mobbin.com/mcp`** (design refs), NOT `docs.mobbin.com/mcp`.
- Transport: remote **streamable-http**, **Code Mode only** via `call_tool_chain()`. No CLI sibling ships (no `mobbin` CLI).
- Read-only: `mutatesWorkspace:false`. The only mutating-ish tool (`submit_feedback`) belongs to the *docs* server, not this packet.
- Canonical tool for the manual: **`search_screens`** → UTCP name `mobbin.mobbin_search_screens` (mirrors `clickup.clickup_*` convention), exposing `{query, platform, limit}`.
- **sk-design pairing:** returns inline images for visual design research — pair with `sk-design` for taste; the transport never decides taste.
- Auth posture to document: no static key in config; verify account linking at install.

### `.utcp_config.json` mobbin manual (illustrative shape for phase 003)
```jsonc
// Conceptual — phase 003 authors the exact JSON against the live .utcp_config.json schema.
// Remote streamable-http MCP, url-only, surfaced through Code Mode call_tool_chain.
{
  "name": "mobbin",
  "transport": { "type": "streamable-http", "url": "https://api.mobbin.com/mcp" },
  "tools": ["search_screens"],
  "readOnly": true,
  "mutatesWorkspace": false
}
```
**Open for phase 003:** exact `.utcp_config.json` schema field names for a remote-HTTP manual (this lineage did not read `.utcp_config.json`, by design).

### Install-guide caveats (must carry forward)
- Confirm auth/account-linking via a live round-trip (KQ2 inferred).
- Document free/Pro gating as UNKNOWN (KQ4); do not invent a matrix.
- Confirm the `search_screens` full input JSON Schema against the live server.
- Verify the inline-image return path through Code Mode `call_tool_chain` (or whether visual inspection needs a sk-design side-channel).

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Read auth/plan-gating/tool-list from the server repo README | READMEs omit all three; canonical sources are docs + raw manifests + the consuming skill | github.com/mobbin/mobbin-mcp-server README | 1 |
| Local stdio process install (`npx`/`node` command) | The server is remote Streamable HTTP; client config is url-only, no `command`/`args` | mcp.json; server.json `remotes` | 1 |
| Target `docs.mobbin.com/mcp` (Mobbin Docs Mintlify MCP) as the design-reference server | It is a separate docs-search server ("Mobbin Docs"); design references live at `api.mobbin.com/mcp` | docs.mobbin.com/mcp manifest vs server.json | 2 |
| Confirm auth/gating from public static sources alone | None of the four fetched sources document client-side auth or plan gating; saturated — needs a live round-trip | server.json, mcp.json, docs manifest, skills README/SKILL.md | 2 |

---

## 12. Open Questions (carried to phase 002/003)

- **KQ2 (auth):** does `api.mobbin.com/mcp` require an OAuth/account-link step, or is it anonymous url-only? Default assumption = url-only, no static key. *(phase 003, install-time)*
- **KQ4 (gating):** what are the free-vs-Pro usage caps on `search_screens`? Default = UNKNOWN, document as caveat. *(phase 002/003)*
- Is the inline-image return usable through Code Mode `call_tool_chain`, or does visual inspection need a sk-design side-channel? *(phase 002)*
- Exact `search_screens` input JSON Schema (beyond `{query, platform, limit, deep}`). *(phase 003, live server)*
- Exact `.utcp_config.json` schema for a remote-HTTP manual. *(phase 003)*

---

## 13. Confidence & Evidence Quality

- **High confidence:** transport (remote streamable-http), tool surface (`search_screens` + I/O), two-server disambiguation, read-only posture. Multi-source (manifests + skill file + docs endpoint).
- **Inferred (not confirmed):** auth has no static client key — strong signal from url-only configs across two independent sources, but no live round-trip.
- **UNKNOWN:** free/Pro plan gating — absence of evidence; explicitly not guessed.
- Source diversity: 6 distinct fetched sources across 2 iterations; no single weak source carries a load-bearing claim.

---

## 14. Risks

- **Thin repo:** `mobbin-mcp-server` is metadata-only; the live server is the source of truth for tool schema and auth. Any future server-side change is invisible to this static research.
- **Inline images through Code Mode:** unverified that `call_tool_chain` faithfully passes image content blocks; may need a side-channel for visual inspection.
- **Auth drift:** if Mobbin later requires a client key, the url-only manual assumption breaks — re-verify at install and on any Mobbin release.

---

## 15. Convergence Report

```text
CONVERGENCE REPORT (glm lineage)
--------------------------------
Stop reason: maxIterationsReached (2/2, stop policy = max-iterations)
Iterations completed: 2
Questions answered: 4/6 resolved (1 inferred, 1 UNKNOWN)
Average newInfoRatio trend: [1.00, 0.85]  (mean 0.925)
Composite stop score (telemetry): ~0.175  (< 0.60; would NOT have voted STOP)
Signals:
  Rolling Avg (w=0.30): 0.925  >> 0.05  -> CONTINUE vote (telemetry only)
  MAD Noise (w=0.35): unavailable (needs 4 evidence iterations)
  Entropy (w=0.35): coverage 0.67 (< 0.85) -> CONTINUE vote
Legal-stop gates: n/a (stop driven by iteration cap, not convergence vote)
Graph gates: not_applicable (2 iterations)
```

The stop policy deliberately bounded the run at 2 iterations; convergence math confirms the "broaden angles, don't synthesize early" behavior was honored (signals would have continued).

---

## 16. Iteration Inventory

- `iterations/iteration-001.md` — broad survey (transport model, repo thinness, skills overview, image-inline, install).
- `iterations/iteration-002.md` — auth/gating + exact tool surface, two-server disambiguation, packet/manual shape.

State: `deep-research-config.json`, `deep-research-state.jsonl` (5 records), `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`.

---

## 17. Hand-off Notes

Phase 002 (packet authoring) can proceed against `search_screens` at `api.mobbin.com/mcp` with the read-only, Code-Mode-only, sk-design-pairing contract above. Phase 003 (`.utcp_config.json` manual) must (a) confirm auth/account-linking with a live round-trip, (b) carry the free/Pro gating UNKNOWN as an install caveat, and (c) resolve the exact UTCP schema for a remote-HTTP manual. No files outside `001-research/research/lineages/glm` were touched by this lineage.
