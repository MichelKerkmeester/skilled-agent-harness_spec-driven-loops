---
title: "Implementation Summary: sk-interface-design integration test, MiMo v2.5 Pro vs DeepSeek v4 Pro"
description: "Both models, driven by sk-interface-design through the loop it shares with mcp-open-design, produced three self-contained designs each and independently avoided the same templated defaults. That convergence is the headline: the skill, not the model, did the steering."
trigger_phrases:
  - "design skill integration test result"
  - "mimo vs deepseek design verdict"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-design-skill-integration-test"
    last_updated_at: "2026-06-15T07:25:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Collected and verified six designs; wrote the MiMo vs DeepSeek comparison"
    next_safe_action: "Validate, commit, send designs to the user; offer live od generation"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/154-design-skill-integration-test/designs/mimo/NOTES.md"
      - ".opencode/specs/skilled-agent-orchestration/154-design-skill-integration-test/designs/deepseek/NOTES.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-154-design-skill-integration-test"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Run live Open Design generation as a user-confirmed follow-up?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 154-design-skill-integration-test |
| **Completed** | 2026-06-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two models ran the exact same brief: load sk-interface-design, follow the ground / anti-default / build loop it shares with mcp-open-design, and produce three self-contained HTML designs (a coffee-roaster landing page, an indie-podcast pricing page, a home-energy dashboard) plus a notes file. The headline result is the agreement: MiMo v2.5 Pro and DeepSeek v4 Pro independently rejected the same three templated defaults (the warm-brown serif coffee page, the purple-gradient three-card SaaS page, the dark-mode neon dashboard) and reached for grounded, subject-specific directions instead. When two different models steered the same way, the steering came from the skill, not the model.

### The designs are real and self-contained

All six pages carry their full styling inline, reference no external network resource, define a `:root` token system and use it through `var()` (MiMo 50 to 66 references per page, DeepSeek 31 to 48), ship three responsive breakpoints, honor `prefers-reduced-motion`, and contain real grounded copy with no placeholder text. Each opens correctly from disk with no network.

### Per-brief read

- **Meridian Roasters.** Both abandoned warm-cream-and-terracotta. MiMo went cool Pacific-Northwest blue-gray with a single copper accent and a roast-curve SVG as the signature. DeepSeek went steel-and-mist with conifer green and reframed each coffee as a precision "roast spec sheet". Two different but genuinely non-default takes.
- **Wavelength pricing.** The clearest divergence. MiMo built a light ivory page with studio-meter bars encoding storage tiers. DeepSeek built a dark broadcast-navy page with connected channel-strip columns and animated waveforms. Both avoided purple-gradient SaaS, by opposite base-tone bets.
- **Wattbird dashboard.** Both rejected dark-neon. MiMo used warm white plus forest green and an animated bird mascot whose wings respond to usage. DeepSeek used appliance white plus green-amber-red energy semantics and a radial gauge. Both read as domestic instruments rather than spaceship consoles.

### The MiMo vs DeepSeek verdict

Both passed the test. The separation is on rigor and adherence, not on whether they "got it":

| Dimension | MiMo v2.5 Pro | DeepSeek v4 Pro |
|-----------|---------------|-----------------|
| Avoided the templated default | Yes, all three | Yes, all three |
| Instruction adherence (house voice in NOTES) | Honored, no em dashes | Used em dashes throughout NOTES and titles, against the brief |
| Self-critique honesty | Claimed all contrast passes | More rigorous, flagged real borderline contrast (amber 2.4:1, conifer borderline) |
| NOTES match the shipped CSS | Cited hexes all present in the files | Wattbird NOTES cite amber `#F59E0B` that is absent from the file |
| Markup thoroughness | Richer, more ARIA (25 and 29 attributes on two pages), larger files | Leaner (6 and 10 ARIA), tighter files |
| Color confidence | Solid, restrained | Bolder bets (the navy pricing page) |

MiMo edges ahead on instruction adherence, accessibility markup, and notes-to-code fidelity. DeepSeek edges ahead on self-critique honesty and bolder color choices. Neither is a clear overall winner, and both validate that sk-interface-design changes model behavior in the intended direction.

### Live Open Design follow-up

After the user opened the app and chose the opencode connection (not vela), the same Meridian brief was generated live through Open Design's own engine via the `opencode` agent: one run pinned to `xiaomi/mimo-v2.5-pro` (MiMo) and one to `deepseek/deepseek-v4-pro` (DeepSeek), each confirmed by the run's start-event model field. Both built a real `index.html` (Barlow Condensed editorial type, brand kept, Portland-grounded) with no vela login. The shell unlock was `OD_SIDECAR_IPC_PATH`, which lets the socket-only daemon resolve. Live outputs are under `designs/open-design-live/{mimo,deepseek}/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `designs/open-design-live/{mimo,deepseek}/meridian-roasters.html` | Created | Live Open Design generations, model-pinned per arm |
| `designs/mimo/0{1,2,3}-*.html` + `NOTES.md` | Created | MiMo's three designs and rationale |
| `designs/deepseek/0{1,2,3}-*.html` + `NOTES.md` | Created | DeepSeek's three designs and rationale |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two cli-opencode seats ran concurrently under an identical brief (same three subjects, same constraints, same references), so the only variable was the model. MiMo ran as `xiaomi/mimo-v2.5-pro --variant high` and DeepSeek as `deepseek/deepseek-v4-pro --variant high`, both with the Gate-3 spec folder baked in. After both finished, the host verified the output rather than trusting the self-reports: it confirmed zero external references, checked that the claimed palette hexes actually appear in the CSS (which is how the DeepSeek amber drift was caught), confirmed no placeholder copy, and confirmed responsive plus reduced-motion blocks. The designs were not visually rendered, so this is a code-and-claims verification, not a pixel judgment.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Identical brief for both models | Hold everything constant except the model so differences are attributable to the model |
| Chose subjects where the AI default is tempting | A coffee page, a SaaS pricing page, and a dashboard are exactly where models fall into templates, so avoiding the default is a real test |
| Verified palette claims against the CSS | Self-reported notes are a hypothesis; opening the files caught the DeepSeek amber that never shipped |
| Fired live Open Design generation as a follow-up | After the user opened the app and chose the opencode connection over vela, drove `od run start --agent opencode` end to end with an explicit `--model` per arm. The unlock was setting `OD_SIDECAR_IPC_PATH` so the socket-only daemon resolves from the shell. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Six HTML files plus two NOTES exist | PASS |
| Self-contained (no external CDN, font, or script) | PASS, zero external references in all six |
| CSS variable token system | PASS, both models use `:root` plus `var()` |
| Responsive plus reduced-motion | PASS, three media queries and a reduced-motion block per page |
| Real grounded copy | PASS, zero lorem or placeholder |
| Palette notes match CSS | MOSTLY, except DeepSeek Wattbird amber `#F59E0B` is in the notes but not the file |
| House voice in NOTES | MiMo PASS, DeepSeek FAIL (em dashes) |
| Visual render quality | NOT JUDGED (files not rendered; user opens them to judge) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not visually rendered.** Verification covered structure, self-containment, palette fidelity, and adherence, not how the pages actually look. The user should open the six files in a browser to judge the visual result.
2. **mcp-open-design was also run live (follow-up).** After the app was opened, live `od run start --agent opencode` generated the Meridian Roasters landing page with `--model xiaomi/mimo-v2.5-pro` and again with `--model deepseek/deepseek-v4-pro`, end to end (discovery form, answer, build, index.html), with no vela login. The live designs are under `designs/open-design-live/`.
3. **Three designs per model is a small sample.** The convergence on avoided defaults is a strong signal but not a statistical claim.
4. **Correction to an earlier finding.** A previous version of this note wrongly claimed mcp-open-design's SKILL.md documents a non-existent `od run start`. That was wrong: `od run start` and `od ui respond` both exist and the skill is accurate (the top-level `--help` summary just omits `run`). The real finding from the live run: `od run start --agent opencode` without an explicit `--model` uses opencode's default model, not the app-config `agentModels.opencode` (MiMo), so the first exploratory run was the opencode default rather than MiMo and renamed the brand. Pin the model with `--model` to control it.
<!-- /ANCHOR:limitations -->
