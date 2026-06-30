---
title: sk-code
description: Multi-stack coding standards and verification. Detects the active code surface, loads matching resources and enforces verification before any completion claim.
trigger_phrases:
  - "code"
  - "implement"
  - "code quality"
  - "verification"
  - "webflow"
  - "opencode"
---

# sk-code

> Detect which code surface you are in, load its standards and refuse to call anything done until you have fresh verification evidence.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Code implementation, quality gates, debugging and verification across two surfaces |
| **Invoke with** | "code", "implement", "verify" or auto-routing when code files change |
| **Works on** | WEBFLOW (HTML, CSS, JavaScript, animation libraries) and OPENCODE (skills, agents, MCP servers, scripts, config) with an UNKNOWN fallback |
| **Produces** | Surface-appropriate implementation, quality evidence and a verification record before any done claim |

---

## 2. OVERVIEW

### Why This Skill Exists

One generic code skill cannot serve a Webflow frontend and an OpenCode system with the same standards, build steps and verification commands. A single checklist either over-generalizes or fits only one stack. Hand-maintaining a separate skill per stack is worse because every shared improvement has to be copied across all of them. Worst of all, without an enforced verification step an agent claims done after writing code it never ran.

### What It Does

sk-code is the single code-work skill. It detects the active code surface, classifies the intent, loads that surface's implementation, quality, debugging and verification resources, and enforces the Iron Law: no completion claim without fresh verification evidence from the detected surface. It is also the one skill you edit when adopting this template repo for your own stack. You replace the shipped per-surface references and assets with yours. Every other skill stays codebase-agnostic so upstream pulls stay clean.

---

## 3. QUICK START

**Step 1: Surface detection happens automatically.** The router reads your CWD and changed files, then picks WEBFLOW or OPENCODE. When neither matches, it asks rather than guessing.

```bash
# Check which surface the router detects
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "implement a new animation" --threshold 0.8
```

Output: the skill advisor returns sk-code with a surface attribution based on your workspace markers.

**Step 2: Run the primary workflow.** The router loads the right surface resources and phases begin. For OpenCode work, a comment-hygiene gate runs before commit.

```bash
# Phase 1.5 comment-hygiene check (OPENCODE surface)
bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/skills/my-new-skill/SKILL.md
```

Output: zero violations means the file passes. Any violation prints the offending line and exits non-zero.

**Step 3: Verify before you rely on it.** Each surface has its own verification commands. The Iron Law blocks a completion claim until these produce fresh evidence.

```bash
# OPENCODE surface verification
python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/my-new-skill/
```

Output: reports alignment status and exits zero when the scope is clean. Non-zero means drift was detected and must be fixed before claiming done.

---

## 4. HOW IT WORKS

### Surface Detection and Precedence

The router runs two axes in order: surface detection, then intent classification, then surface resources, then verification evidence.

Detection is context-aware from CWD plus changed and target files. There are two real surfaces plus a fallback:

| Surface | What matches |
|---|---|
| **WEBFLOW** | Webflow and vanilla frontend work: HTML, CSS, JavaScript, plus animation libraries like GSAP, Lenis, Swiper, HLS and FilePond |
| **OPENCODE** | System work under `.opencode/`: skills, agents, commands, MCP servers, hooks, scripts, tests, JSON, TypeScript, JavaScript, Python, Shell |
| **UNKNOWN** | Neither surface matched. The router asks you to confirm the surface rather than guessing |

OPENCODE wins precedence over WEBFLOW. This is a deliberate design choice: `.opencode/` tools sometimes ship frontend animation libraries internally, and a first-match-WEBFLOW rule would misroute system work. When both markers are present, OPENCODE takes priority.

MOTION_DEV is not a surface. It is a cross-stack resource intent that supplements WEBFLOW or OPENCODE when the task touches the Motion.dev API. It never replaces surface detection. If your task references Motion.dev endpoints or integration patterns, the router loads `references/motion_dev/` alongside the active surface's resources.

### Intent Routing

After surface detection, the router classifies the task intent and loads the matching resource set. The resource map covers implementation, code quality, debugging, verification, testing, deployment, performance, animation, forms, config and more. The router loads the top intent plus a close second when the scores are near, so you get focused guidance rather than the whole library.

### The Five Gated Phases

The phase lifecycle is distinct from the routing model. Each phase gates the next:

| Phase | Name | What happens |
|---|---|---|
| 0 | Research | Understand unfamiliar code or risky changes. Optional but required for complex work. |
| 1 | Implementation | Read the real files first, then write or modify code using surface patterns. |
| 1.5 | Code Quality Gate | Apply P0/P1/P2 checks and surface standards. Required before claiming implementation done. |
| 2 | Debugging | Trace one symptom to one root cause at a time. Required when tests or runtime fail. |
| 3 | Verification | Run surface verification commands and record evidence. Required before any done claim. |

### The Iron Law

No completion claim without fresh verification evidence from the detected surface. This is the rule that keeps an agent honest. Writing code is not enough. Running it once last week is not enough. The surface's own verification commands must produce passing output in the current session before you say "done."

### Template Customization

sk-code is the only skill end users edit when adopting this template repo for their own stack. You replace the shipped `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` trees with your stack's resources, then update the surface markers and resource map. Your changes live in `references/<surface>/` and `assets/<surface>/`, so they do not collide on a pull. Every other skill stays codebase-agnostic.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-code when doing code work: writing, modifying, debugging, testing or verifying code. Reach for it before any completion claim. Skip it for documentation-only changes, git workflow, pure browser inspection or formal findings-first review output.

### Boundaries with Sibling Skills

| Skill | What it owns | How it relates to sk-code |
|---|---|---|
| `sk-code-review` | Findings format, severity model, baseline security and quality review | Consumes sk-code's surface evidence and produces the review output |
| `sk-doc` | Markdown, documentation prose, README and spec-folder writing | Owns docs even when the file lives under `.opencode/skills/` |
| `sk-git` | Git worktree setup, Conventional Commits, PR creation and cleanup | Commits and integrates what sk-code produces |
| `system-spec-kit` | Spec folders, memory and continuity | Owns the documentation layer that wraps code work |

A docs-only edit to a SKILL.md headline routes to sk-doc, not sk-code, because it changes prose rather than executable behavior.

### Key Files

| Path | Role |
|---|---|
| [`SKILL.md`](./SKILL.md) | The surface-aware router contract, the phases, the Iron Law and the rules |
| [`references/stack_detection.md`](./references/stack_detection.md) | Surface markers and the resolution chain |
| [`references/smart_routing.md`](./references/smart_routing.md) | Intent classification, the resource map and verification commands |
| [`references/phase_detection.md`](./references/phase_detection.md) | The gated phase lifecycle |
| [`references/universal/`](./references/universal/) | Surface-agnostic quality, style and error-recovery references |
| [`references/webflow/`](./references/webflow/) | Webflow surface: per-language, implementation, debugging, verification |
| [`references/opencode/`](./references/opencode/) | OpenCode surface: per-language standards, shared patterns, hooks |
| [`references/motion_dev/`](./references/motion_dev/) | Cross-stack Motion.dev reference: quick start, principles, integration |
| [`assets/webflow/`](./assets/webflow/) | Webflow scripts, checklists, templates, integrations and patterns |
| [`assets/opencode/`](./assets/opencode/) | OpenCode authoring checklists and the spec-folder-write recipe |
| [`assets/motion_dev/`](./assets/motion_dev/) | Motion.dev install card, playbook entries and snippets |
| [`assets/scripts/verify_alignment_drift.py`](./assets/scripts/verify_alignment_drift.py) | The OpenCode alignment-drift verifier |
| [`scripts/check-comment-hygiene.sh`](./scripts/check-comment-hygiene.sh) | The Phase 1.5 comment-hygiene enforcement script |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Router resolves to UNKNOWN | Markers are absent or CWD is outside the workspace | Pass a `[surface: <name>]` override or confirm the markers exist in your project |
| Wrong surface loaded | Marker collision in a mixed workspace | Use the surface override or refine detection. Remember OPENCODE wins over WEBFLOW by design. |
| Verification fails repeatedly | Surface rules not met or commands missing | Re-read the surface rules, confirm every required command ran, escalate after three cycles |
| MOTION_DEV resources do not activate | Task used generic "animation" wording | Reference a specific Motion.dev API or endpoint so the router classifies it as motion intent |
| Comment-hygiene script reports violations | A code comment contains a forbidden artifact label (spec path, packet id, ADR id) | Rewrite the comment to state the durable WHY without the perishable label |

---

## 7. FAQ

**Q: How does sk-code differ from sk-code-review?**

A: sk-code owns surface detection and surface-specific standards plus verification evidence. sk-code-review owns the findings format, severity model and baseline review. They work together: sk-code produces the surface evidence that sk-code-review consumes.

**Q: What surfaces are supported?**

A: Two real surfaces: WEBFLOW and OPENCODE, plus an UNKNOWN fallback. MOTION_DEV is a cross-stack resource intent, not a surface. It supplements the active surface when the task touches the Motion.dev API.

**Q: How do I add a surface for my own stack?**

A: Edit the shipped `references/` and `assets/` trees to match your stack. Update the surface markers in `references/stack_detection.md` and the resource map in `references/smart_routing.md`. This is the one skill you customize. Every other skill stays codebase-agnostic.

**Q: Why does OPENCODE win precedence over WEBFLOW?**

A: `.opencode/` tools sometimes ship frontend animation libraries internally. If WEBFLOW matched first, those system-work files would get routed to the wrong surface. OPENCODE takes priority to prevent that misroute.

**Q: When does the comment-hygiene gate run?**

A: During Phase 1.5 for the OPENCODE surface. The script at `scripts/check-comment-hygiene.sh` scans for forbidden artifact labels in code comments. Zero violations are required before commit.

---

## 8. VERIFICATION

Run these checks to confirm sk-code works in your environment.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/README.md --type readme` reports zero issues |
| Alignment drift (OPENCODE) | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-code/` exits zero |
| Comment hygiene | `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/skills/sk-code/SKILL.md` exits zero |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md` reports zero issues |
| Behavior | Run the playbook scenarios under `manual_testing_playbook/` in a live session |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/stack_detection.md`](./references/stack_detection.md) | Surface markers and the resolution chain |
| [`references/smart_routing.md`](./references/smart_routing.md) | Intent classification, resource map, load tiers and verification commands |
| [`references/phase_detection.md`](./references/phase_detection.md) | The gated phase lifecycle |
| [`references/universal/`](./references/universal/) | Surface-agnostic quality, style and error-recovery references |
| [`references/webflow/`](./references/webflow/) | Webflow surface standards and resources |
| [`references/opencode/`](./references/opencode/) | OpenCode surface standards and resources |
| [`references/motion_dev/`](./references/motion_dev/) | Cross-stack Motion.dev reference |
| [`assets/webflow/scripts/`](./assets/webflow/scripts/) | Webflow minification and verification scripts |
| [`assets/opencode/checklists/`](./assets/opencode/checklists/) | Authoring checklists surfaced at write-time |
| [`assets/scripts/verify_alignment_drift.py`](./assets/scripts/verify_alignment_drift.py) | OpenCode alignment-drift verifier |
| [`scripts/check-comment-hygiene.sh`](./scripts/check-comment-hygiene.sh) | Phase 1.5 comment-hygiene enforcement |
