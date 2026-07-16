# Deep Research Strategy - glm lineage

**Topic:** Mobbin MCP developer surface for an mcp-tooling transport mode
**Session:** fanout-glm-1784199634206-lfqjyo (detached parallel fan-out lineage)
**Executor:** cli-opencode / zai-coding-plan/glm-5.2
**Status:** maxIterations (2/2) reached → synthesis

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] KQ1: Full Mobbin MCP tool surface — **ANSWERED: design MCP exposes `search_screens` (query/platform/limit, deep mode); returns inline image blocks. Docs MCP is a separate server.**
- [~] KQ2: Credential model — **PARTIAL/INFERRED: all documented client configs are url-only, no static API key; account linking likely server-side. Needs live round-trip to confirm.**
- [x] KQ3: Transport — **ANSWERED: remote Streamable HTTP, `https://api.mobbin.com/mcp`, no local process.**
- [ ] KQ4: Pro-plan gating — **UNKNOWN: undocumented in all fetched sources; treat as open install-guide caveat.**
- [x] KQ5: mobbin/skills workflows — **ANSWERED: one skill `mobbin-search` driving `search_screens`.**
- [x] KQ6: Phase-002 packet + manual shape — **ANSWERED: remote streamable-http packet targeting `search_screens`; Code Mode only; read-only; sk-design pairing; manual field shape derived (exact schema deferred to phase 003).**
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not implementing or installing the Mobbin MCP server (phase 002/003 author; phase 004 deploys).
- Not evaluating Mobbin as a design tool (we evaluate its MCP developer surface only).
- Not researching competitor MCP design-research servers.
- Not modifying any path outside this lineage dir.

---

## 5. STOP CONDITIONS
- maxIterations (2) reached — `max-iterations` stop policy. (Reached.)
- Source repositories return 404 / do not exist. (Did not occur.)
- Security concern discovered. (None.)

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- **KQ1** (iter 2): Design MCP exposes `search_screens` (inputs: `query`, `platform` ios|web, `limit` default 5 ~15 max, `deep` mode). Returns `{screens:[{index,id,app_name,mobbin_url,image_url,platform}],failed:[]}` + inline image blocks. [SOURCE: mobbin-search SKILL.md]
- **KQ3** (iter 1): Remote Streamable HTTP at `https://api.mobbin.com/mcp`; no local process; url-only config. [SOURCE: server.json `remotes`, mcp.json]
- **KQ5** (iter 1/2): One official skill `mobbin-search` driving `search_screens`; 6-step workflow (plan → announce → call → respond/board → build board → more). [SOURCE: mobbin/skills]
- **KQ6** (iter 2): Packet = remote streamable-http, Code Mode only, read-only (`mutatesWorkspace:false`), tool `search_screens`, sk-design pairing; manual name `mobbin`, exposed tool `mobbin_search_screens`. [SOURCE: derived from server.json + SKILL.md + hub pattern]

**Inferred (not confirmed):** KQ2 — url-only configs imply no static client API key; verify at install.
**UNKNOWN:** KQ4 — free/Pro gating undocumented.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading raw `server.json` + `mcp.json` + live `docs.mobbin.com/mcp` together exposed the two-server conflation trap (iter 2).
- `mobbin-search` SKILL.md gave the exact tool name + full I/O contract — best single source for the packet (iter 2).
- Both-repo README survey in one pass established transport model decisively (iter 1).
- Treating WebFetch output as untrusted data throughout (iter 1–2).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- READMEs omit auth/plan-gating/tool-list (iter 1).
- Could not confirm auth end-to-end (no live authenticated round-trip) (iter 2).
- Free/Pro gating undocumented in all fetched sources (iter 2).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### README-level source mining -- PRODUCTIVE (iterations 1-2)
- What worked: repo READMEs established transport + skills overview; raw manifests + SKILL.md gave exact tool surface.
- Prefer for: any future Mobbin-surface question — go to raw manifests + the consuming skill, not top-level READMEs.

### Confirming auth/gating from public static sources -- BLOCKED (iteration 2, 1 attempt)
- What was tried: server.json, mcp.json, docs MCP manifest, skills README/SKILL.md.
- Why blocked: none document client-side auth or plan gating.
- Do NOT retry: re-reading the same static sources. To confirm auth/gating requires a live `initialize`/`tools/call` round-trip against `api.mobbin.com/mcp` (phase 003 install-time).
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "Read auth/plan-gating/tool-list from server repo README": ruled out — omitted (iter 1, github.com/mobbin/mobbin-mcp-server).
- "Local stdio process install (npx/node)": ruled out — remote streamable-http, url-only (iter 1, mcp.json).
- "Target docs.mobbin.com/mcp (Mobbin Docs Mintlify MCP) as the design server": ruled out — it is a separate docs-search server; design refs are at api.mobbin.com/mcp (iter 2, server.json + docs manifest).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 1 (README → raw manifests/SKILL.md exposed tool surface)
- Failed pivots: 0
- Saturated: static-public-source mining for auth/gating (cannot be confirmed without live round-trip)
- Pivot lineage: READMEs → raw manifests + docs endpoint (disambiguation) → SKILL.md (exact tool)
- Remaining frontier: live auth round-trip (phase 003); exact `.utcp_config.json` schema for remote-HTTP manual (phase 003); free/Pro gating matrix (Mobbin product team / install-time)
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- KQ2 (auth): confirm whether `api.mobbin.com/mcp` needs an OAuth/account-link step; default assumption = url-only, no static key. (phase 003)
- KQ4 (gating): free-vs-Pro usage caps on `search_screens`; default = UNKNOWN, document as caveat. (phase 002/003)
- Is the inline-image return path usable through Code Mode `call_tool_chain`, or does it need a sk-design side-channel for visual inspection? (phase 002)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
maxIterations reached — no further iterations. Hand-off to synthesis, then phase 002 (packet authoring) and phase 003 (`.utcp_config.json` manual + install-time auth/gating verification).
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

**Sources:**
- https://github.com/mobbin/mobbin-mcp-server — official Mobbin MCP server (metadata repo)
- https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json — design MCP manifest (`com.mobbin/mobbin`, streamable-http remote)
- https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json — url-only client config
- https://docs.mobbin.com/mcp — Mobbin Docs Mintlify MCP (secondary, disambiguation)
- https://github.com/mobbin/skills + https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md — design-research skill + `search_screens` tool contract
- https://mobbin.com/mcp — product overview (not fetched; referenced)

**Phase framing:** Phase 1 of mcp-mobbin nested mode (mcp-tooling hub). Deliverable `research/research.md`. Phase 002 authors packet; phase 003 edits `.utcp_config.json`. This lineage = executor B (glm), 2 iterations.

### Bounded Context Snapshot
- Reuse candidates: existing mcp-tooling transport siblings (mcp-chrome-devtools, mcp-figma, mcp-click-up).
- Integration points: `.utcp_config.json` (phase 003), `.opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md` (phase 002).
- Constraints: read-only transport, Code Mode only, LEAF, WebFetch = untrusted data.

**resource-map.md not present; skipping coverage gate.**

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 2 (stop-policy: max-iterations) — REACHED
- Convergence threshold: 0.05 (telemetry only)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Started: 2026-07-16T13:00:00Z · Ended: 2026-07-16T13:13:00Z
