# Advisor State-Containment — Deep Research (Investigation)

> Deep-research packet investigating whether the skill-advisor stray-state-directory
> containment is actually resolved. Anchored to `system-skill-advisor/017-advisor-audit-and-state-containment` (Draft, 0%).

## Problem
The advisor (and other runtime writers) leak nested `.opencode` / `.advisor-state` directories into `specs/`.
Live symptom: 23 nested `.opencode` dirs under `specs/`, plus `.advisor-state` under `specs/hooks/008…`,
`specs/mcp-tooling/013…`, `specs/system-deep-loop/z_archive/026…`. Packet 017 is Draft at 0% — nothing shipped.

## Research questions
1. Root cause: which runtime writers leak state, and why does the advisor workspace/state resolver still land inside a `specs/` subtree?
2. Did any partial containment ship (v3.6.0.0..HEAD), or is it entirely unbuilt?
3. The correct fix (resolver refuses to land under `specs/`, writers redirect to repo root) + a verification that proves it.

## Method
10 deep-research iterations, no early convergence, split executors via cli-devin: 5 × `grok-4-6-xhigh`, 5 × `deepseek-v4-pro-max`. Findings grounded in the actual advisor resolver code + hooks + the 017 packet.
