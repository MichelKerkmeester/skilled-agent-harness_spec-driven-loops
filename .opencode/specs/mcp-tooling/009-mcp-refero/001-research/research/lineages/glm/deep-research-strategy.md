---
title: "Deep Research Strategy — lineage:glm (fanout-glm-1784198125985-iw9229)"
description: "Persistent research plan for the GLM detached fan-out lineage on the Refero MCP developer surface."
importance_tier: normal
contextType: planning
version: 1.14.0.29
---

# Deep Research Strategy — lineage:glm

Detached fan-out lineage. Executor: `cli-opencode` model `zai-coding-plan/glm-5.2`. `stopPolicy = max-iterations` (2): convergence signals are telemetry-only; each iteration broadens review angles rather than synthesizing early. All artifacts live under `lineages/glm/`.

## 2. TOPIC

Refero MCP developer surface for an mcp-tooling transport mode — the Refero MCP server per https://refero.design/mcp (tool surface, auth, rate limits, transport via mcp-remote) and the official `refero_skill` repo at https://github.com/referodesign/refero_skill. Goal: everything needed to author the `mcp-refero` transport packet (read-only, Code Mode only, sk-design judgment pairing) atop the EXISTING `refero` manual in `.utcp_config.json` (`npx -y mcp-remote https://api.refero.design/mcp`).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Q1: What tools does the Refero MCP server expose — names, parameters, and response shapes — for UI-design-reference search across apps, screens, flows, and elements?
- [ ] Q2: What auth model does the Refero MCP expect through `mcp-remote` (anonymous, OAuth, API key)? Where do credentials come from?
- [ ] Q3: What rate limits apply to the Refero MCP, and do they differ between free and paid tiers?
- [ ] Q4: What is the free vs paid gating — which tools / capabilities / result volumes are free vs paid-only?
- [ ] Q5: What conventions does the official `refero_skill` repo document (structure, usage, prompt patterns) that the `mcp-refero` transport packet should mirror?
- [ ] Q6: How should a read-only, Code-Mode-only transport packet be authored atop the existing `npx -y mcp-remote https://api.refero.design/mcp` manual, and how does it pair with `sk-design` judgment?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Authoring the actual `mcp-refero` skill files (that is phase 002 / 002-skill-authoring).
- Modifying `.utcp_config.json` or hub routing files (phase 003 / 003-hub-integration).
- Live probing of `https://api.refero.design/mcp` that mutates state — research is read-only; any live call is discovery only.
- Documenting design judgment (palette/type/critique) — that is `sk-design`'s domain; this packet is the transport.

---

## 5. STOP CONDITIONS

- `maxIterations` (2) reached — terminal stop for this lineage (`maxIterationsReached`).
- Unrecoverable source unavailability of BOTH pinned links AND the `.utcp_config.json` manual.
- A security concern surfaced in findings (credentials/proprietary code) — escalate, do not continue.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 (tool surface): 8 read-only tools across 3 layers — answered by iteration 1 (see iteration-001.md F1).
- Q5 (skill-repo conventions): MIT; SKILL.md + references/ + assets/; "keep SKILL.md focused, detail in references/" — answered by iteration 1 (F5).
- Q6 (transport-packet design): read-only Code-Mode-only peer of mcp-figma, atop the existing mcp-remote manual, paired with sk-design — answered by iteration 1 (F5, F6).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Fetching raw GitHub `references/mcp-tools.md` + `SKILL.md`: gave an authoritative parameter-level tool inventory (iteration 1).
- Cross-referencing `.utcp_config.json` manual: confirmed endpoint + mcp-remote transport path (iteration 1).
- Comparing against mcp-figma sibling: established the skill-vs-transport distinction cleanly (iteration 1).
- Re-deriving the mcp-refero packet layout from the in-repo mcp-figma references: concrete file-level blueprint for phase 002, no external guessing (iteration 2).
- Probing alternate refero.design URLs: converted "unknown gating" into a confirmed negative-knowledge finding (iteration 2).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `refero.design/{mcp,root,pricing}` are all JS-rendered SPAs; WebFetch returned only the title — no pricing/gating/rate-limit body anywhere (iterations 1-2).
- Rate limits and free-vs-paid tier boundaries are genuinely undocumented in every authoritative source — an external gap, not a research shortfall.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Web-fetching refero.design/mcp body -- BLOCKED (iteration 1, 1 attempt)
- What was tried: WebFetch (markdown) on https://refero.design/mcp.
- Why blocked: client-rendered SPA yields only a title string; no crawlable structured content.
- Do NOT retry: scraping that URL for structured pricing/gating data. Use the GitHub repo, the README's pricing signals, or `refero.design` root/pricing instead.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Scraping the SPA body of `refero.design/mcp` for structured data (iteration 1; SPA returns only a title via WebFetch).
- Further scraping of `refero.design/*` SPA routes (root, pricing) for pricing/gating (iteration 2; all routes yield only the title — pricing/gating facts are not web-crawlable).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet (convergence mode off; telemetry only)
- Remaining frontier: broadening angles into auth depth, gating, and transport-packet conventions
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q3 (rate limits): CONFIRMED UNDOCUMENTED in all authoritative sources — unverified gap, resolve via live probe in a later phase.
- Q4 (free vs paid gating): only signal is craft-knowledge-no-account vs live-MCP-needs-auth; exact tier boundaries UNDOCUMENTED — unverified gap.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[max-iterations reached — final iteration complete.] Next step is SYNTHESIS: consolidate F1-F10 into `lineages/glm/research.md` — the 8-tool inventory, the read-only transport design atop the existing manual, the OAuth/Bearer auth lifecycle with the first-use browser-sign-in constraint, the unverified gating/rate-limit gap (flagged for live-probe later), the mcp-figma-mapped packet layout, and the sk-design pairing principle — handing phase 002 a no-further-discovery authoring brief.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot (from packet docs + repo artifacts)

- **Pinned sources**: `context/website-link.md` → `https://refero.design/mcp` (product/MCP page) and `https://github.com/referodesign/refero_skill` (official skill repo).
- **Existing transport**: `.utcp_config.json` manual `refero` — `call_template_type: mcp`, transport `stdio`, command `npx -y mcp-remote https://api.refero.design/mcp`, empty `env`. This is the live Code Mode transport under test; read-only reference (not modified in this phase).
- **Sibling pattern**: `.opencode/skills/mcp-tooling/mcp-figma/` — an existing MCP transport mode (CLI-primary + optional Code Mode MCP). Establishes the transport-packet convention: SKILL.md + references (tool_surface, mcp_wiring, troubleshooting) + assets (utcp manual, env template). `mcp-refero` will be read-only/Code-Mode-only (no CLI primary), a simpler shape than mcp-figma.
- **Hub router**: `.opencode/skills/mcp-tooling/` is a parent hub; `mcp-refero` will register in `mode-registry.json` (phase 003, not this phase).
- **Phase map**: 001-research → 002-skill-authoring → 003-hub-integration → 004-validation-and-handoff. This lineage feeds 002.
- resource-map.md not present; skipping coverage gate.

### Source of truth
Research is read-only discovery over web sources + the repo's `.utcp_config.json` manual. Live-surface claims not directly probed must be marked inferred.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 2 (`stopPolicy: max-iterations`; convergence telemetry-only)
- Convergence threshold: 0.05 (advisory only under max-iterations stop policy)
- Per-iteration budget: ≤12 tool calls
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output (this lineage)
- Lifecycle branches: `new` (this run); `resume`/`restart` live
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `lineages/glm/.deep-research-pause`
- Current generation: 1
- Started: 2026-07-16T12:35:00Z
