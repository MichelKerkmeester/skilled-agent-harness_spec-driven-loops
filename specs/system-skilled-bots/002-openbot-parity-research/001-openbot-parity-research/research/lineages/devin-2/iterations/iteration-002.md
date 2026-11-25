# Iteration 2: Skip list, license-gated reuse, and a ranked build order

## Focus

Frontier node F-1-006 (depth 1, scope OpenBot-main/docs/deployment.md, OpenBot-main/docs/kubernetes-upgrades.md, every repo's LICENSE): Which OpenBot parts does a small team not need (enterprise, multi-tenant, Kubernetes, managed upgrades, mobile), which code in the eight repos can be reused directly under its license, and what ranked build order should a first build packet follow?

## Actions Taken

1. Read OpenBot's deployment, Kubernetes promotion and managed-upgrade documents.
2. Read OpenBot's personal-edition and app-guideline documents for edition and mobile scope.
3. Read all eight repositories' license headers.
4. Inspected reuse candidates in OpenBot, OpenMausBot, Rakazo, OpenGhost, Hermes Muse and Turnstone.
5. Read the OpenMausBot licensing carve-out and the enterprise directory boundary.

## Findings

1. OpenBot ships as one container carrying the app, the API and Chromium, with either an external PostgreSQL or an embedded one, so a small team can run the whole product on one host with no cluster. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:3-17]
2. OpenBot's supervisor is what gives each person or isolated bot its own container; without it every bot shares one computer, which the deployment doc calls fine for one team trusting its bots and explicitly not fine as a tenant boundary. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:66-71]
3. Kubernetes is a second deployment shape with two Helm charts, a management agent, release-manifest promotion and GitOps output; it exists to give each person a computer and to scale the API apart from browsers, neither of which a small team needs. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:212-225] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:1-5]
4. Managed upgrades are a fleet feature: a management agent heartbeats to CopilotKit, Flux installs named releases inside a maintenance window, and every database-migrating upgrade needs a verified backup; a small team can upgrade by hand and skip all of it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:3-6] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:31-50] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:125-169]
5. The team edition adds one "Everyone" admin scope above "Every Bot" and "This Bot", with admin pages for the same eight primitives plus vault and team; a few people on one machine do not need that policy layer. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:124-131] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:145-154]
6. Mobile is a separate Expo/React Native app with a deliberately limited launch scope (three focus areas, no Computer screen), so terminal-first parity does not need it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md:3] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md:74-108]
7. License matrix: OpenBot, OpenGhost and Hermes Muse are MIT; OpenMausBot, Rakazo, Turnstone and Buzz are Apache-2.0; openhuman is GPL-3.0. OpenMausBot's Apache-2.0 grant excludes everything under `enterprise/`, which is source-available under a separate enterprise license. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:2-3] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md:1-12] [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:2-3] [SOURCE: specs/system-skilled-bots/context/buzz-main/LICENSE:2-3]
8. Directly liftable routine code exists in permissive repositories: OpenBot's `app/src/lib/routines/plan.ts` and `shared/routine-firing.ts` (MIT), OpenMausBot's `server/routine-schedules.ts`, `server/routine-cron-text.ts` and `server/routine-wake-retry.ts` (Apache-2.0), and Rakazo's `packages/core/src/routines/schedule.ts` (Apache-2.0). [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:73-151] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:52-79] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/routine-schedules.ts:1-30] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/routine-cron-text.ts:39-52] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/routine-wake-retry.ts:1-37] [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts:1-30]
9. Other liftable pieces target the other seven parts: OpenGhost's hook-compatible rules engine for approvals (MIT), Hermes Muse's owned-job table and watch prompt for routines (MIT), and Turnstone's output-guard judge for activity/approval review (Apache-2.0). [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:1-10] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py:40-55] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/output_guard_judge.py:1-30]
10. Ranked build order for a first build packet: (1) routine block plus deterministic planner and routine list, (2) approvals inbox and activity feed over the existing needs-you items and run records, (3) terminal conversation with per-bot memory, (4) memory and skill mapping onto Skilled skills and spec-kit, (5) apps and secret vault over MCP and Code Mode, (6) per-bot computer exposure over worktrees, (7) small-team sign-in and roles only when a shared host is used. The first three reuse existing substrate; conversation and memory are the largest new surfaces; the last item is deferred until a second person shares a host. [INFERENCE: based on findings 1-9 and the trigger, needs-you and run-record substrate read in iteration 1]

## Ruled Out

- Lifting openhuman code directly: its GPL-3.0 license would impose copyleft on the combined work, so it is a design reference only.
- Copying OpenMausBot's `enterprise/` code: the directory is outside the Apache-2.0 grant and needs a commercial license for production use.
- Adopting OpenBot's Kubernetes charts or managed-upgrade agent for a small team: both solve fleet problems (per-person computers, many installs) that a single host does not have.

## Dead Ends

- Reading OpenBot's deployment doc alone would have suggested Kubernetes is the normal path; the minimum-size and single-container sections show the one-host path is fully supported.
- A license file alone is not enough for OpenMausBot: its `LICENSING.md` carve-out removes `enterprise/` from the Apache grant, which a LICENSE-only reading would have missed.

## Edge Cases

- Ambiguous input: none. F-1-006 names the skip list, reuse and build-order scope explicitly.
- Contradictory evidence: none. The deployment, Kubernetes and managed-upgrade documents describe different deployment shapes without disagreeing.
- Missing dependencies: none. All license and documentation files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:3-17
- specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:66-71
- specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:212-225
- specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:1-5
- specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:3-6
- specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:31-50
- specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:125-169
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:124-131
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:145-154
- specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md:3
- specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md:74-108
- specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-2
- specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:2-3
- specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md:1-12
- specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2
- specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2
- specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1-2
- specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1-2
- specs/system-skilled-bots/context/turnstone-main/LICENSE:2-3
- specs/system-skilled-bots/context/buzz-main/LICENSE:2-3
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:73-151
- specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:52-79
- specs/system-skilled-bots/context/OpenMausBot-main/server/routine-schedules.ts:1-30
- specs/system-skilled-bots/context/OpenMausBot-main/server/routine-cron-text.ts:39-52
- specs/system-skilled-bots/context/OpenMausBot-main/server/routine-wake-retry.ts:1-37
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts:1-30
- specs/system-skilled-bots/context/OpenGhost-main/rules.js:1-10
- specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py:40-55
- specs/system-skilled-bots/context/turnstone-main/turnstone/core/output_guard_judge.py:1-30

## Assessment

- New information ratio: 0.85
- Questions addressed: F-1-006
- Questions answered: F-1-006

## Reflection

- What worked and why: Reading the deployment documents before the licenses separated what a small team actually runs from what a fleet needs, so the skip list followed from deployment shape rather than from feature names.
- What did not work and why: A license-file-only pass would have misclassified OpenMausBot's enterprise directory as Apache-2.0; only the licensing carve-out document made the boundary visible.
- What I would do differently: Inspect each repository's licensing notes before its code, so the reuse list is filtered by grant before effort is spent reading candidates.

## Recommended Next Focus

Work the depth-2 node F-2-007 (until-outcome evaluation) next, because it is the smallest remaining piece of the routine layer and it decides whether `until` can reuse the existing precheck field. Then take F-2-008 (sentence planner), F-2-009 (missed windows and floor), and F-2-010 (routine guardrails). After the routine depth-2 nodes, broaden to the remaining eight parts, starting with approvals and activity because they reuse the needs-you store and run records.
