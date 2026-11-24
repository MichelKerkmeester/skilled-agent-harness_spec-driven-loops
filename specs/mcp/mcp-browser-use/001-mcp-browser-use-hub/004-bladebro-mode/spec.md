---
title: "Feature Specification: Phase 4: bladebro-mode"
description: "Author the mcp-bladebro mode packet: CLI first with a transport-driven Code Mode MCP fallback, agent-browser default and gated real-browser lanes, R-SEC-1/2/3 safety rules, and Aside's scope unchanged."
trigger_phrases:
  - "phase 4 bladebro mode"
  - "bladebro mode packet"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: bladebro-mode

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/505-mcp-browser-use-hub` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-mode-relocation |
| **Successor** | 005-routing-and-surfaces |
| **Handoff Criteria** | The Bladebro packet is registered in the hub registry and routers, and the hub check passes with three modes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes specification.

Scope is refined from `../001-research/research/research.md` §3 (KQ1), §4 (KQ2), §7 (KQ5), §9 (KQ7), §10 (KQ8) and §11, with the quotable safety text from `../001-research/research/iterations/iteration-007.md`.

**Scope Boundary**: The `mcp-bladebro` packet, its hub registration and its `.utcp_config.json` manual. Installing Bladebro is not part of this phase.

**Dependencies**:
- 002 and 003 complete; the 002 scaffold left an `mcp-bladebro/` stub to fill.
- Bladebro upstream pinned at v4.8.2, published 2026-11-20, read 2026-11-21 (`research.md` header). Re-read the releases API before authoring; if the latest release moved, re-check the flags this packet quotes.

**Deliverables**:
- `.skilled/skills/mcp-browser-use/mcp-bladebro/` with `SKILL.md` `name: mcp-bladebro`, its own `ROUTER.md`, `README.md`, references and `changelog/`.
- A `bladebro` manual in `.utcp_config.json` for the Code Mode fallback.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Bladebro has no mode in this repository. It is not installed here and `.utcp_config.json` carries no manual for it, so an agent has no documented way to call its CLI or its MCP server (`bladebro mcp`, stdio, five tools: act, see, state, run, vision).

### Purpose
Agents can drive Bladebro through a packet that says when to use the CLI, when to fall back to its MCP server through Code Mode, which browser lane to pick and which actions are off limits.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ command -v bladebro || echo absent
absent
$ rg -c bladebro .utcp_config.json; echo "exit=$?"
exit=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Packet identity:** folder, `workflowMode` and `packetSkillName` are all `mcp-bladebro`; `packetKind: workflow`, `backendKind: cli-plus-mcp`, `routingClass: metadata` (`research.md` §5, §7).
- **Lane rule (parent D2, `research.md` §4):** detect with `command -v bladebro`, then `bladebro doctor`. Use the CLI when installed. Use the installed `bladebro mcp` through Code Mode when the task needs composition with other Code Mode tools, parallel isolated sessions, or an MCP-only capability. When the binary is missing or neither works, hand the install decision to the operator. The install is pinned to `bladebro@4.8.2`, and a launch through `npx -y bladebro@4.8.2 mcp` counts as an install that needs the same operator yes. The fallback is transport-driven, not capability-driven: the CLI and MCP share the same five handlers.
- **Browser lanes:** the owned agent-browser profile is the default. The real-browser `rb` lanes (`auto`, `clone`, `profile`, `attach`, plus `pause`/`resume`, `off`, `forget`) run only on explicit request. On macOS prefer `clone` or `auto`; keep `attach` for a browser that must stay open; never `profile` on a live branded Chrome 136+ (`research.md` §8).
- **Safety rules R-SEC-1, R-SEC-2, R-SEC-3**, written into the packet verbatim as below (`research.md` §9; text from `iteration-007.md` findings 1-3).
- **Limits and who covers them (`research.md` §3):** no HAR (Chrome DevTools `bdg network har`), no heap or performance trace (Chrome DevTools), no Lighthouse (Chrome DevTools, MCP `lighthouse_audit` only), no raw CDP passthrough (Chrome DevTools), no cross-origin iframes (Chrome DevTools CDP frame methods, or Aside's Playwright frames).
- **Aside boundary (`research.md` §10):** Aside keeps deterministic signed-in work. Bladebro takes the complement: stealth on a signed-in site, `rb attach` to a caller-owned browser that must stay open, and agentic branching signed-in workflows.
- Register the mode in the hub registry and routers, regenerate the leaf manifest, and add the `.utcp_config.json` manual.

#### Safety rules, verbatim

**R-SEC-1 signed-in profiles.** "Default to the Bladebro-owned agent-browser profile; use `BLADE_HOME`/`BLADE_FRESH=1` for task isolation. Any real-browser (`rb`) lane requires an explicit operator request, and the operator must select the profile/account before control is handed over. Use `attach` whenever the browser must remain caller-owned and open; do not use `profile` on a live branded Chrome. Gate mutations behind `rb pause`/`rb resume` and keep consent-sensitive actions human-in-the-loop. Never pass `--account` to `aside mcp` or `aside repl`, and keep a single-writer lock per account/profile. Re-capture detection output each session and redact cookie/credential values."

**R-SEC-2 stealth and site terms of service.** "Treat stealth as operator-authorized only. Before enabling a real-browser lane on a target site, the operator must confirm the site's terms of service and access rules; do not use Bladebro to evade CAPTCHAs, anti-bot walls, or access controls where doing so breaches those terms or applicable law. A `blocked:` verdict is terminal — report it and stop; do not re-issue the action, swap fingerprints, or otherwise route around the challenge. Keep stealth usage and the pinned v4.8.2 benchmark claim in the packet changelog, and prefer the agent-browser lane where stealth is not required."

**R-SEC-3 npm binary supply chain.** "Installation remains an operator stop-for-yes owned by 006 — never install implicitly. Pin the exact version the packet was authored against (v4.8.2) and record its read date in the packet changelog. Leave optional dependencies enabled but verify the resolved native package's SHA-256 against the published release sidecars (`shasum -a 256 -c`) before use; for higher assurance prefer the standalone prebuilt binary plus digest over npm. Re-verify CLI flags against the installed binary before relying on captured output. Roll back with `npm uninstall -g bladebro`, and remove the doctor-reported data root only after confirming no needed named sessions remain."

### Out of Scope
- Installing Bladebro: an operator stop-for-yes handled in 006 (parent D5).
- Changing Aside's scope: KQ8 answered no, so nothing in the Aside packet changes here (`research.md` §10).
- Stage-two hub `ROUTER.md` maps and advisor vocabulary: 005 owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md | Create | `name: mcp-bladebro`; lane rule, browser lanes, R-SEC-1/2/3, limits |
| .skilled/skills/mcp-browser-use/mcp-bladebro/ROUTER.md | Create | Packet machine router |
| .skilled/skills/mcp-browser-use/mcp-bladebro/README.md, references/, changelog/ | Create | Companions; the changelog records the v4.8.2 pin and read date |
| .skilled/skills/mcp-browser-use/mode-registry.json | Modify | The `mcp-bladebro` entry carries the real packet |
| .skilled/skills/mcp-browser-use/hub-router.json | Modify | Signals and the tie-break against Chrome DevTools and Aside |
| .skilled/skills/mcp-browser-use/leaf-manifest.json | Regenerate | After the Bladebro leaves exist (`research.md` §5) |
| .utcp_config.json | Modify | `bladebro` manual: `call_template_type: mcp`, stdio, `command: bladebro`, `args: ["mcp"]`, the same shape as the `aside` manual |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet states one CLI-or-MCP lane rule | The packet `SKILL.md` names the `command -v bladebro` check, `bladebro doctor`, and the Code Mode fallback to `bladebro mcp` |
| REQ-002 | Safety rules cover every KQ7 finding, verbatim | `rg -c 'R-SEC-1\|R-SEC-2\|R-SEC-3'` on the packet `SKILL.md` prints at least 3, and each rule's text matches section 3 |
| REQ-003 | The hub registers three modes | `jq -r '.modes[].workflowMode' .skilled/skills/mcp-browser-use/mode-registry.json` includes `mcp-bladebro`, and the count is 3 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Limits point to the mode that covers them | Each of the five KQ1 gaps in section 3 names `mcp-chrome-devtools` or `mcp-aside-devtools` |
| REQ-005 | Aside's scope is unchanged | `git diff --stat .skilled/skills/mcp-browser-use/mcp-aside-devtools` prints nothing for this phase |
| REQ-006 | The version pin is recorded | The packet changelog names v4.8.2 and the read date |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0 with three modes.
- **SC-002**: `jq . .utcp_config.json` exits 0 and `rg -c bladebro .utcp_config.json` prints at least 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Upstream Bladebro releases often (about 40 in four months) | Packet goes stale | Pin v4.8.2 with its read date in the packet changelog; re-read the releases API before authoring (R-SEC-3) |
| Risk | Real-browser lanes touch signed-in profiles | High | R-SEC-1: agent-browser default, explicit request plus operator-chosen profile for `rb` |
| Risk | Stealth used against a site's terms | High | R-SEC-2: operator ToS gate, `blocked:` is terminal |
| Risk | Every packet claim is upstream documentation, not observed behavior | Med | 006 runs the live macOS plan and corrects the packet through this phase if output differs (`research.md` §12) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. KQ8 answered no: Bladebro does not take over Aside's deterministic signed-in work, so Aside's scope does not change (`research.md` §10).
<!-- /ANCHOR:questions -->

---
