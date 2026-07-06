---
title: "Design Parity Transport (Open Design terminal)"
description: "How Open Design's terminal transport realizes each step of the real-UI loop: read a system, reuse before generating, route revisions, check the render via the run's previewUrl and artifacts, and self-heal a stalled run. The design judgment these mechanics serve lives in sk-design's real_ui_loop.md."
trigger_phrases:
  - "open design parity transport"
  - "open design fidelity check previewurl"
  - "open design reuse before generate"
  - "open design run self healing"
importance_tier: normal
contextType: implementation
version: 1.4.0.2
---

# Design Parity Transport (Open Design terminal)

This reference is the Open Design terminal side of the real-UI loop. The loop itself — ground -> reuse -> render -> check the real render -> revise -> hand off — and all of its judgment is owned by `sk-design` in [`../../sk-design/design-interface/references/design-process/real_ui_loop.md`](../../sk-design/design-interface/references/design-process/real_ui_loop.md). This file records only HOW Open Design's transport realizes each step. Read it alongside the run flow in `SKILL.md` §3 (the Run Direction) when an Open Design read or run feeds a design decision.

`mcp-open-design` is the transport; `sk-design` is the mandatory judgment (see `SKILL.md` MANDATORY PAIRING banner). This file never restates the design judgment; it maps the loop's steps onto `od` mechanics.

---

## 1. INTAKE — read a system

For an installed Open Design app, read a matching system via the read-only tools (`od mcp` get_file/search_files, or `od tools design-systems read`): its `DESIGN.md` for direction, `tokens.css` for the paste-ready `:root` tokens, and `components.html` for reusable markup. Resolve exactly one system from the subject and brief (never a chooser — that is `sk-design`'s rule). The read is live and never cached into the repo; copying Open Design content would attach its per-source license.

## 2. REUSE BEFORE GENERATE

When an Open Design system is the ground, reuse its `tokens.css` tokens and `components.html` components (read live, never copied) before authoring net-new. The adherence check from the real-UI loop §3 applies to the reused tokens and components: flag raw values, one-off spacing, and hand-rolled duplicates of system components.

## 3. REVISION ROUTING

Targeted feedback (real-UI loop §4) routes as a follow-up message on the run conversation (`od run start --conversation <id>`) or an `od ui respond` answer that names the element and the single change. There are no inline comment threads, so the revision grammar is the agent classifying feedback precisely, not reading app comments.

## 4. FIDELITY CHECK — the run's render

A finished generation run is multi-turn. Turn 1 returns a discovery question-form with zero files. Answering it (`od ui respond` or a follow-up message) fires the build run that writes the design files (`index.html` and friends) and gives the project an `entryFile` and a `previewUrl`. Poll `get_run(runId)` (`od run watch`/`info`), fetch the written files with `get_artifact`, and open the `previewUrl` to inspect the render. Because Open Design is local-first, that `previewUrl` is local and not gated behind a remote sign-in, so it is directly inspectable.

The pass/fail bar is the real-UI loop's, unchanged: the render must clear the `ux_quality_reference.md` floor AND survive the anti-default critique. A `previewUrl` that merely renders is not a pass.

**Run self-healing:** a run left `awaiting_input` has produced no design and is not done, so answer the discovery form to fire the build. If the build run does not reach a completed state, read its status via `get_run` (`od run watch`), adjust the brief or the form answers, and re-run. Cap retries at two, then surface the failure.

## 5. GENERATED-VS-PRESENTATIONAL BOUNDARY

Treat generated design files as one-way, because a re-run overwrites them, so application logic lives in a wrapper or adaptation rather than in the generated output. Reused Open Design tokens and components are read live and adapted, never copied into the repo as a source of truth. Open Design's mutating verbs (`create_project`, `start_run`, the artifact writes) are STOP-and-confirm points, reuse stays read-only, and token export is local files only.

---

## RELATED

- [`../../sk-design/design-interface/references/design-process/real_ui_loop.md`](../../sk-design/design-interface/references/design-process/real_ui_loop.md) — the transport-agnostic real-UI loop and all of its judgment.
- [`../SKILL.md`](../SKILL.md) — the Run Direction (§3) and the mandatory `sk-design` pairing.
- [`tool_surface.md`](./tool_surface.md) — the MCP tools, the surface/gate/omit policy, and the live-verification requirement.
