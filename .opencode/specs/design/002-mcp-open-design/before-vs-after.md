# What Changed in 145: Open Design as the Local Design Transport

> Spec 145 shipped a live-verified Open Design transport, made `sk-design-interface` the mandatory design judgment and retired the older hosted MagicPath path.

---

## THE UNIFYING PRINCIPLE

The packet is built around one operating rule. Open Design moves pixels and files, but it does not decide what good interface work is. `mcp-open-design` is the terminal transport. `sk-design-interface` is the design judgment. Any agent using Open Design for real design work must load the design skill first, ground itself in the live design system and then run the multi-turn Open Design flow.

That separation mattered because the earliest build still carried two risks. It inferred the generation flow from code rather than live operation, and it treated design judgment as conditional. The later phases corrected both. Live testing proved generation is multi-turn, `od artifacts create` is not a design path and the catalog plus playbook now state the design gate as mandatory.

That rule shaped every section below.

---

## 1. TERMINAL CONTROL AND THE FIRST SKILL

**Before**

Open Design was installed locally, but the framework did not have a reader-facing skill that told agents how to drive it from the terminal. The first question was not how to write docs, but whether a terminal path actually existed and which parts should be surfaced to agents.

**After**

Phase 001 produced the research answer. It confirmed the installed app path, the bundled `daemon-cli.mjs` entry, the terminal surface, the de-vendor order and the shape of the future skill. Phase 002 then built `mcp-open-design` as a full skill package at `.opencode/skills/mcp-open-design/`, shipped at commit `0508518ac9` with `SKILL.md`, three references, a feature catalog, a manual testing playbook, README, changelog and graph metadata.

**Impact**

Agents gained a documented transport for the installed Open Design desktop app. The package followed the existing `mcp-magicpath` shape so operators could read wiring, tool surface and `od` CLI behavior without learning a new documentation layout.

**Why a skill first**

A transport without a skill would leave every agent to rediscover wiring, verb classes and safety gates. The skill made the surface repeatable and auditable, even before the later live test corrected the generation flow.

---

## 2. LICENSING AND LIVE DESIGN GROUNDING

**Before**

`sk-design-interface` still carried MIT-derived `ui-ux-pro-max` data, scripts and notices. It also leaned on a cached design corpus rather than the live Open Design systems that the new transport made reachable.

**After**

Phase 003 removed the nine MIT CSVs, the data README, the design-search scripts, the MIT license notice and the third-party notices in the safe order: data first, notices second. It kept the Apache base, including `LICENSE.txt` and `design_principles.md`, and rewired the parity loop toward live Open Design reads through `mcp-open-design`. The result shipped at commit `b12ffd3d76` as Apache-2.0-only `sk-design-interface` `v1.1.0`.

**Impact**

The design skill stopped depending on vendored data and started grounding in the live design system. That made the later Open Design integration cleaner: agents no longer had a stale local corpus competing with the installed app.

**Why data first**

The order avoided a licensing gap. Removing notices before removing MIT-derived data would have left the tree with data but without the notice that explained it. The phase deliberately removed the data first and the notices after.

---

## 3. LIVE VERIFICATION CORRECTED THE RUN MODEL

**Before**

The first `mcp-open-design` release described generation as a one-shot `start_run` that returned finished files. That was a plausible reverse-engineering read, but it had not been proven against a live run. It also risked treating `od artifacts create` as a way to create a visible design.

**After**

Phase 004 ran a live generation and produced a real design, "Brackwater - Holy Island causeway crossing". The run proved generation is multi-turn: `od run start` reaches a discovery question form, and `od ui respond` triggers the build. It also proved `od artifacts create` only adds a file, with no run, render or preview update. Phase 007 then corrected every affected `mcp-open-design` doc, qualifying every `start_run` mention and separating artifacts from visible design creation.

**Impact**

The skill now teaches the flow the app actually uses. Agents do not expect one command to produce a finished design, and they do not confuse file creation with rendered output.

**Why the correction is central**

A transport skill is only safe if the run model is true. This was the highest-risk factual seam in the first release, so the packet treated the live result as the source of truth and rewrote the docs around it.

---

## 4. DESIGN JUDGMENT BECAME A HARD PRECONDITION

**Before**

`mcp-open-design` referenced `sk-design-interface`, but the reference was conditional. It applied when a read or run fed a design decision, and nothing explicitly blocked a generation step that skipped the design judgment. The feature catalog still described grounding as optional and on-demand.

**After**

Phase 011 made the coupling mandatory. `mcp-open-design/SKILL.md` gained a MANDATORY banner, a design gate, mandatory resource rows, a router precondition, a Run pre-step, an ALWAYS hard precondition and a NEVER rule forbidding UI output without `sk-design-interface`. Phase 012 then aligned the feature catalog and playbook, replacing optional language with hard-precondition framing and adding `GATE-001` with negative, positive and exemption controls.

**Impact**

Open Design is now clearly the transport, not the design brain. Any design work must load `sk-design-interface` first. Pure transport tasks like wiring and bare inventory stay exempt, which keeps the rule strong without blocking operator setup.

**Why not rely on a soft reference**

A soft reference works only when the agent remembers to care. The point of this packet was to make the design path reliable, so the coupling had to live in the routing gate, the run direction, the success criteria and the manual test surface.

---

## 5. DESIGN VARIATION AND PROMPT SUPPORT

**Before**

The design stack could still collapse into average outputs when a brief asked for several directions. `sk-prompt` also did not fully cover design-generation use cases for Open Design and MagicPath-style tools.

**After**

Phase 005 added `sk-design-interface/references/variation_diversity.md`, a grounded adaptation of string seed-of-thought for multi-direction briefs. It picks non-median starts over a median-excluded option space and records the procedure, combination rules, worked example and guardrails. Phase 006 added `sk-prompt/references/design_generation_patterns.md` plus `DESIGN_GEN` router wiring, grounding the multi-turn discovery flow in `mcp-open-design`.

**Impact**

The framework now has both sides of design generation. `sk-design-interface` steers the visual directions away from defaults, and `sk-prompt` helps craft prompts for the Open Design run loop without adding a new scoring pipeline.

**Why this stayed small**

Both phases changed documentation and routing, not code. The existing skills already had the right structure. They needed focused references and router entries, not new machinery.

---

## 6. MAGICPATH WAS RETIRED AFTER THE LOCAL PATH WORKED

**Before**

`mcp-magicpath` remained in the skill tree as the hosted MagicPath canvas path, and shared design references still pointed to it. That created two live design transports after Open Design had become the corrected local path.

**After**

Phase 008 deleted `.opencode/skills/mcp-magicpath/`, all 16 files. It re-centered `sk-design-interface`, `sk-prompt`, `mcp-open-design`, `mcp-figma` and the skills index on `mcp-open-design`, while preserving historical records. The live-reference grep found no remaining live `mcp-magicpath` references, and the later skill graph scan removed the node and edges from `skill-graph.sqlite`.

**Impact**

Agents now see one live design transport. Historical packet records still explain what MagicPath did, but active skill guidance points to Open Design.

**Why after phase 007**

Deprecation was only safe after the Open Design flow was both live-verified and corrected. Removing MagicPath before then would have replaced a known hosted path with a local path whose run model was still wrong.

---

## 7. LIVE PLAYBOOKS AND MODEL EVIDENCE

**Before**

The manual testing playbooks for both design skills existed, but they had not been run end to end. The integration claim between `sk-design-interface` and `mcp-open-design` also needed evidence from more than one model.

**After**

Phase 009 ran MiMo v2.5 Pro and DeepSeek v4 Pro on the exact same brief. Both rejected the same three defaults: the warm-brown serif coffee page, the purple-gradient three-card SaaS page and the dark-mode neon dashboard. Phase 010 then ran all 13 playbook scenarios live, with 12 PASS, 1 PARTIAL and 0 SKIP. Kimi K2.7 and DeepSeek v4 Pro passed every model-judgment scenario driven by `sk-design-interface`.

**Impact**

The skill behavior is supported by real artifacts and live operator scenarios, not just prose. The single partial is explicit: `WIRE-001` needs a fresh Code Mode session for live `tools/list` because Code Mode loads MCP stdio manuals at startup.

**Why model agreement matters**

One model producing a good result could be model taste. Two different models rejecting the same defaults under the same brief is stronger evidence that the steering came from the skill.

---

## 8. THE REVIEW AND REMEDIATION LAYER

**Before**

The first build and de-vendor phases had shipped, but the packet still needed live verification, at-location review and consistency fixes across the skill docs.

**After**

Phase 004 scoped 10 review slices across both skills and the research packet. Five `claude2-opus` seats judged `SKILL.md` accuracy, licensing, integration, research and coherence. Five `gpt-5.5-fast` seats checked references, catalog and playbook coverage, graph metadata and links. All 10 P0/P1 findings were fixed and re-validated, the P2 backlog was remediated and three WONTFIX items were recorded with rationale.

**Impact**

The packet did not stop at a green package check. It reconciled path accuracy, stale licensing wording, reciprocal edges, review evidence and live behavior before the later phases built on the result.

**Why review sits in the before-and-after**

The packet changed agent-facing contracts. A wrong path or stale rule in a skill document is a functional bug because agents act on what the document says. The review work closed that class of bug.

---

## CURRENT STATE

Spec 145 is complete as a phased packet. `mcp-open-design` is the live local transport for Open Design. `sk-design-interface` is Apache-2.0-only, grounded in live Open Design reads and mandatory for design work. `sk-prompt` has design-generation guidance. `mcp-magicpath` is deleted from the active skill tree and removed from the skill graph.

The verified run model is multi-turn: start the run, answer the discovery form and use `od ui respond` as the build trigger. `od artifacts create` only adds a file. The playbooks have live evidence across 13 scenarios, with `WIRE-001` still requiring a fresh Code Mode session for final `tools/list` confirmation. The remaining open items are explicit: formal operator-gated install wiring, full headless `od --no-open` confirmation, some per-verb auth details and judgment-based verification for visual variation quality.
