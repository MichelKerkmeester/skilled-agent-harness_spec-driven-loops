---
title: "Plan — sk-code Mobile-CLI mode — design plan (plan-only) [sk-code/008-sk-code-mobile-cli-mode/001-mode-design-plan/plan]"
description: "Delivery plan for sk-code Mobile-CLI mode — design plan (plan-only)."
trigger_phrases:
  - "plan"
  - "code"
  - "mobile"
  - "cli"
  - "mode"
  - "001"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/008-sk-code-mobile-cli-mode/001-mode-design-plan"
    last_updated_at: "2026-08-24T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled to the Level 1 template contract"
    next_safe_action: "Implement the plan when this workstream is scheduled"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan — sk-code Mobile-CLI mode — design plan (plan-only)

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Ground the plan in the hub's real contract, then design the new surface packet against it. Read
`sk-code/SKILL.md` §2, `mode-registry.json`, `ROUTER.md`, and an existing surface packet as the
template, and produce a plan document that specifies every artifact the future `sk-code-mobile-cli`
packet needs and how it encodes this packet's conventions. Write no skill, registry, or
graph-metadata file — the deliverable is the plan.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Plan-only — no app or skill build, so the gate is documentary, not the app CDP gate:

```text
# Grounding check (read-only): confirm the cited hub contract exists and is quoted accurately
node .opencode/bin/compiled-route.cjs --hub sk-code --prompt "code work on apps/pi-remote-web" || true
```

The gate passes only when: the plan cites `sk-code/SKILL.md` §2 and the real `mode-registry.json`
schema; every hub convention (surface-packet contract, registry entry, graph-metadata identity,
surface marker, folded workflow doctrine, verification commands) maps to a concrete packet section;
the plan explains how the token library, `@ds` grammar, and editability guardrails are encoded; and
the plan states that building the mode is out of scope for this packet and lists the exact files a
follow-on build packet would create.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- This phase's plan document(s) only. **No files under `.opencode/skills/sk-code/` are written.**
- The plan lists (for the future build packet, not created here):
  `.opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md`,
  `.opencode/skills/sk-code/sk-code-mobile-cli/graph-metadata.json`,
  the `mode-registry.json` edit, the `shared/` surface-marker edit, and the workflow-doctrine symlinks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Delivery

1. Read the hub contract: `sk-code/SKILL.md` §2 Smart Routing (the two-axis model, surface packets
   as read-only evidence), `mode-registry.json` (the `workflowMode`/`packetKind`/`backendKind`
   discriminator and the `extensions.surface-axis` list), `ROUTER.md` (stage-two surface routing),
   and `shared/` (the surface-detection layer). Cite each.
2. Specify the packet identity: folder `sk-code-mobile-cli` (folder == `packetSkillName`), and its
   `graph-metadata.json` advisor-identity file (schema, `skill_id`, `family: sk-code`, edges),
   noting that `description.json`/`mode-registry.json`/`hub-router.json` stay hub-only.
3. Specify the `mode-registry.json` entry: `workflowMode: "sk-code-mobile-cli"`,
   `packetKind: "surface"`, `backendKind: "evidence-base"`, read-only `toolSurface`, aliases, and
   `advisorRouting.routingClass: "metadata"`; plus adding it to `extensions.surface-axis.surfaces`.
4. Specify the surface-detection marker: a new `PI_REMOTE`/`MOBILE_CLI` signal in `shared/` that
   matches `apps/pi-remote-web/` (and the app's siblings), and its precedence versus `OPENCODE` and
   `WEBFLOW` (this app is a Vite/React frontend, so define whether it overrides the generic frontend
   surface for these paths).
5. Specify the folded workflow doctrine: symlink `shared/references/workflow-implement.md`,
   `workflow-debug.md`, `workflow-verify.md` into the packet, as the existing surfaces do.
6. Specify the encoded conventions: how the packet's evidence carries the token library layering,
   the `@ds` inline-comment grammar, the editability guardrails, and the verification command set,
   so a workflow mode bundling this surface applies them automatically.
7. State the out-of-scope boundary and enumerate the exact files a follow-on build packet creates.

### Phase 2 — Verification

Run the quality gate from the final state and confirm the spec's acceptance criteria are met.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Plan-only — no app or skill build, so the gate is documentary, not the app CDP gate:

```text
# Grounding check (read-only): confirm the cited hub contract exists and is quoted accurately
node .opencode/bin/compiled-route.cjs --hub sk-code --prompt "code work on apps/pi-remote-web" || true
```

The gate passes only when: the plan cites `sk-code/SKILL.md` §2 and the real `mode-registry.json`
schema; every hub convention (surface-packet contract, registry entry, graph-metadata identity,
surface marker, folded workflow doctrine, verification commands) maps to a concrete packet section;
the plan explains how the token library, `@ds` grammar, and editability guardrails are encoded; and
the plan states that building the mode is out of scope for this packet and lists the exact files a
follow-on build packet would create.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Read-only references (grounding, not changed): `.opencode/skills/sk-code/SKILL.md` (§2 Smart
  Routing), `.opencode/skills/sk-code/mode-registry.json`, `.opencode/skills/sk-code/ROUTER.md`,
  `.opencode/skills/sk-code/shared/`, and an existing surface packet (`sk-code-webflow` or
  `sk-code-opencode`) as the structural template.
- Inbound: this packet's Phase 1 decision and Phase 2 token library + `@ds` grammar are the
  conventions the planned mode encodes.
- Outbound: a future, separate build packet would create `.opencode/skills/sk-code/sk-code-mobile-cli/`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the landing commit. The change is scoped and reversible; there is no data migration.
<!-- /ANCHOR:rollback -->

---

