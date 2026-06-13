---
title: sk-code
description: Surface-aware code-work skill that detects WEBFLOW or OPENCODE and loads matching implementation, quality, debugging and verification resources before any completion claim.
trigger_phrases:
  - "code"
  - "implement"
  - "code quality"
  - "verification"
  - "webflow"
  - "opencode"
---

# sk-code

> The single code-work skill that detects your surface, loads your standards and refuses to call work done without fresh verification evidence. It is also the one skill you customize when you adopt this repo for your own stack.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Implementation, code quality, debugging and verification across WEBFLOW frontend and OPENCODE system surfaces |
| **Invoke with** | "code", "implement", "code quality", "verification", "webflow", "opencode" |
| **Works on** | Two detected surfaces (WEBFLOW, OPENCODE) plus an UNKNOWN fallback. MOTION_DEV is a cross-stack resource intent, not a surface. |
| **Produces** | Surface-appropriate code, quality gate evidence and fresh verification output before any completion claim |

---

## 2. OVERVIEW

### Why This Skill Exists

One generic code skill cannot serve a Webflow frontend and an OpenCode system with the same standards, build steps and verification commands. A single checklist either over-generalizes or fits only one stack. Hand-maintaining a separate skill per stack copies every shared improvement across all of them. And without an enforced verification step, an agent claims done after writing code it never ran. This skill detects which surface is in front of it, loads that surface's resources and refuses to claim completion until the surface's own verification commands have produced fresh evidence.

### What It Does

sk-code runs a four-axis routing model before it touches any code: surface detection first, then intent classification, then surface-specific resource loading and finally verification-evidence enforcement. It detects whether you are in WEBFLOW (frontend HTML/CSS/JS, Webflow conventions, animation libraries), OPENCODE (system code under `.opencode/`) or an UNKNOWN surface that needs clarification. Once the surface is locked, it classifies the task intent to load only the references you need. The Iron Law sits at the boundary between verification and completion: no claim of done without fresh verification evidence from the detected surface.

sk-code is also the one skill you edit when adopting this template repo for your own stack. Replace the shipped surface reference and asset trees with your stack's and update the marker map. Every other skill stays codebase-agnostic so upstream pulls stay clean.

---

## 3. QUICK START

**Step 1: Invoke it.** Gate 2 routing fires on code keywords, or you read the skill directly.

```bash
# Auto-routing through the skill advisor
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "implement a hero animation" --threshold 0.8

# Or read the runtime instructions
Read(".opencode/skills/sk-code/SKILL.md")
```

**Step 2: Confirm the detected surface.** The router prints the resolved surface before loading resources. It checks your CWD and target files for markers.

```bash
# WEBFLOW markers the router checks
ls src/2_javascript/ 2>/dev/null

# OPENCODE markers (path-based, wins precedence)
ls .opencode/ 2>/dev/null
```

**Step 3: Verify before you claim done.**

```bash
# WEBFLOW: minify, verify minification, test minified runtime plus browser evidence
node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs
# Expected: exit 0, minified output written

node .opencode/skills/sk-code/assets/webflow/scripts/verify-minification.mjs
# Expected: exit 0

node .opencode/skills/sk-code/assets/webflow/scripts/test-minified-runtime.mjs
# Expected: exit 0

# OPENCODE: alignment-drift plus targeted language tests
python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/<skill>
# Expected: exit 0, no drift reported
```

---

## 4. HOW IT WORKS

### The Routing Model

sk-code runs four axes in order: surface detection, intent classification, surface resources and verification evidence. Surface detection locks where the work happens. Intent classification picks which references and assets to load. The resource map then pulls only the files relevant to that surface and intent. Verification evidence is what the Iron Law requires before any completion claim.

### Surface Detection and Precedence

Two real surfaces exist: WEBFLOW for frontend HTML/CSS/JS, Webflow conventions and animation libraries, and OPENCODE for system code under `.opencode/`. When neither set of markers matches, the router falls through to UNKNOWN and asks you which surface and verification commands to use rather than guessing.

OPENCODE wins detection precedence over WEBFLOW. The reason is practical: `.opencode/` system tools sometimes ship frontend animation libraries internally. A first-match-WEBFLOW rule would misroute that system work to the wrong surface. The target or CWD path is the strongest unambiguous signal of which surface owns the task.

MOTION_DEV is not a surface. It is a cross-stack resource intent that supplements WEBFLOW or OPENCODE when the task touches the Motion.dev API. It never replaces surface detection and it is not a valid surface-override value.

### The Five Gated Phases

Work moves through a gated lifecycle, not a linear pipeline. Each phase has a defined entry condition and exit gate.

Phase 0 is Research, optional but recommended for unfamiliar or risky work. Phase 1 is Implementation: read the real files first, then write or modify code using surface patterns. The Phase 0 to Phase 1 transition runs the Design Restraint Ladder, a pre-write gate that picks the laziest viable rung before any new code (YAGNI, then a standard-library primitive, a native platform feature, an installed dependency, a one-line expression and only then minimal custom code); it runs after surface and intent routing and changes neither surface precedence nor the Iron Law. Phase 1.5 is the Code Quality Gate, required before claiming implementation is done. It applies P0, P1 and P2 checks and surface standards. For OPENCODE, this phase includes a comment-hygiene enforcement script that must exit with zero violations. Phase 2 is Debugging: trace one symptom to one root cause at a time, fix it and retest. Phase 3 is Verification: run the surface verification commands, collect fresh evidence and record it.

The five phases are distinct from the four-axis routing model. Routing decides what to load. Phases decide what to do and in what order.

### The Iron Law

No completion claim without fresh verification evidence from the detected surface. Saying "looks good" or "should work" before evidence exists is a violation. For WEBFLOW, evidence means the minify, verify-minification and test-minified-runtime scripts all exit zero, plus clean desktop and mobile browser console output when runtime behavior changed. For OPENCODE, evidence means the alignment-drift verifier exits zero across the changed scope, plus targeted language and project tests pass.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-code when you are writing, modifying, debugging or verifying code across either supported surface. Reach for it when you need surface-specific standards you cannot get from a generic code reference. Reach for it before you claim completion, because the Iron Law gives you the evidence you need.

Reach for `sk-code-review` when you need a findings-first review with severity classification and a formal review report. sk-code provides the surface evidence that `sk-code-review` consumes. Reach for `sk-doc` when the change is documentation-only, even if the file lives under `.opencode/skills/`. Reach for `sk-git` to commit and integrate the code that sk-code produced and verified.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code-review` | Owns findings format and severity model. Consumes sk-code's surface verification evidence. |
| `sk-doc` | Owns markdown and documentation quality. A docs-only SKILL.md edit routes here, not to sk-code. |
| `sk-git` | Owns git workspace setup, commit hygiene and finish workflow. Commits what sk-code produces and verifies. |
| `system-spec-kit` | Owns spec folders, memory and continuity. sk-code references the spec folder for verification evidence. |
| `mcp-chrome-devtools` | Provides browser evidence for WEBFLOW runtime verification. |

MOTION_DEV is a cross-stack resource intent that supplements WEBFLOW or OPENCODE when the task touches the Motion.dev API. It is not a surface, it is not a valid surface-override value and it never replaces surface detection.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Router resolves to UNKNOWN | Markers are absent or CWD is outside the workspace | Pass a `[surface: <name>]` override or confirm the markers exist. WEBFLOW needs `src/2_javascript/` or `*.webflow.js` files. OPENCODE needs a path under `.opencode/`. |
| Wrong surface loaded | Marker collision. OPENCODE wins precedence when `.opencode/` is the target. | Use `[surface: <name>]` to override. If the issue is structural, refine the detection rules in `references/stack_detection.md`. |
| Verification fails repeatedly | Required command was skipped, wrong command was run or an upstream dependency changed | Re-read `SKILL.md` Phase 3 for your surface. Confirm every required command ran with the right scope. Escalate after three failed cycles. |
| MOTION_DEV resources do not activate | The prompt used generic "animation" wording | Reference a specific Motion.dev API method or import. The intent route is conservative: generic mentions of "animation" or "motion" do not trigger it. |
| Comment-hygiene check blocks commit | A forbidden artifact label exists in a code comment | Run `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>` to see the violation. Replace the label with the durable reason instead. |

---

## 7. FAQ

**Q: How does sk-code differ from sk-code-review?**

A: sk-code owns surface detection and surface-specific standards plus verification evidence. sk-code-review owns the findings-first review format, severity model and baseline security, quality and test review. sk-code-review consumes sk-code's surface evidence. They are paired, not alternatives.

**Q: What surfaces are supported?**

A: WEBFLOW (frontend HTML/CSS/JS, Webflow conventions, animation libraries, CDN/minification) and OPENCODE (system code under `.opencode/`), plus an UNKNOWN fallback that asks for clarification. MOTION_DEV is a cross-stack resource intent, not a surface.

**Q: How do I add my own surface?**

A: Replace the shipped `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` trees with your stack's references and assets. Update `STACK_FOLDERS` and `RESOURCE_MAP` in `SKILL.md` to match. Your changes live inside sk-code, so upstream pulls on every other skill stay clean.

**Q: Why does OPENCODE win precedence over WEBFLOW?**

A: `.opencode/` system tools sometimes ship frontend animation libraries internally for their own preview UIs. A first-match-WEBFLOW rule would misroute that system work to the wrong surface. The target path is the strongest signal of ownership.

**Q: Why must verification evidence be fresh on every completion claim?**

A: Verification before completion is the gate that separates confident code from plausible-looking code. AI assistants frequently emit code that reads correctly but breaks under real inputs or fails the surface's own tests. The Iron Law forces the verification to run every time, so a stale pass from an earlier session cannot mask a new failure.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/README.md --type readme` reports zero issues |
| OPENCODE alignment | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-code/` exits 0 |
| STACK_FOLDERS surfaces | `python3 .opencode/skills/sk-code/assets/scripts/verify_stack_folders.py` exits 0 (every declared surface resolves to on-disk references and assets folders) |
| Comment hygiene | `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>` reports zero violations |
| WEBFLOW minification | `node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs` exits 0 |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/stack_detection.md`](./references/stack_detection.md) | Surface detection markers and the resolution chain |
| [`references/smart_routing.md`](./references/smart_routing.md) | Intent classification, the resource map, load tiers and verification commands |
| [`references/phase_detection.md`](./references/phase_detection.md) | The five gated phases and lifecycle |
| [`references/universal/`](./references/universal/) | Surface-agnostic quality, style, error-recovery and research references |
| [`references/webflow/`](./references/webflow/) | WEBFLOW surface: per-language implementation, debugging, verification, performance and deployment |
| [`references/opencode/`](./references/opencode/) | OPENCODE surface: per-language standards, shared patterns and hooks |
| [`references/motion_dev/`](./references/motion_dev/) | Cross-stack Motion.dev reference: API, timelines, scroll, performance, integration |
| [`assets/webflow/scripts/minify-webflow.mjs`](./assets/webflow/scripts/minify-webflow.mjs) | WEBFLOW minification build script |
| [`assets/webflow/scripts/verify-minification.mjs`](./assets/webflow/scripts/verify-minification.mjs) | WEBFLOW minification verification |
| [`assets/scripts/verify_alignment_drift.py`](./assets/scripts/verify_alignment_drift.py) | OPENCODE alignment-drift verifier |
| [`scripts/check-comment-hygiene.sh`](./scripts/check-comment-hygiene.sh) | Phase 1.5 comment-hygiene enforcement |
