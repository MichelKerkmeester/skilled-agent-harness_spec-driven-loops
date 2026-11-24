# Iteration 11: The skip list — what a small team does not need

## Focus
The skip list: enterprise, multi-tenant, Kubernetes, managed upgrades and mobile, each with the evidence that shows why a small team does not need it. Eighth of the nine additional questions.

## Actions Taken
- Read OpenBot's API tenancy model and its multi-organization condition.
- Read the enterprise sign-in and provisioning rules already encountered, with their licence and management-agent context.
- Read the Kubernetes promotion and upgrade tooling.
- Read the managed-upgrade service contract and what it sends.
- Read the phone app's own contract.
- Read the single-container deployment contract.

## Findings
1. Multi-tenancy is structural in OpenBot, not a switch: every API resource lives under `/api/v2/organizations/{organizationId}/...`, a deployment holds more than one organization only when `OPENBOT_ORGANIZATION_AUTHORITY` is `intelligence-platform` or `ops`, and a caller who is not a member gets `ORGANIZATION_NOT_FOUND` — the same answer as for an organization that does not exist. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:31]
2. Enterprise identity is a stack, not a setting: SSO through Google, Microsoft or Okta plus runtime SAML and OIDC providers, SCIM provisioning with a bearer token, a permanent administrator floor, and removal that deletes sessions and denies the address. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:419-430]
3. Kubernetes is a first-class release target with its own operator tooling: a Helm chart, a promotion command that verifies chart checksums and image digests, migration preflight, quiescence, a required verified backup, and per-release values. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:1-30]
4. Managed upgrades are a service relationship: the chart installs a management agent that enrolls with a team licence, heartbeats every minute over mutual TLS, and can let the vendor run upgrades — with an explicit opt-out and a documented list of what leaves the cluster. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:1-30]
5. Mobile is a separate product with its own compatibility burden: a React Native app styled with Uniwind and HeroUI Native that must tolerate every server released in the last 12 months and hide features the deployment does not offer. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/mobile/AGENTS.md:1-10]
6. The closest OpenBot shape to skilled bots is the single container: one image carrying the app, the API and Chromium, with optional embedded PostgreSQL, one published port, and a volume whose absence loses the audit trail. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:1-30]
7. Skilled bots' deployment model is the opposite end: a per-user launchd job, a user-level state root outside every checkout, a file queue and a derived SQLite index — no server, no database, no tenant, no network listener. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:3-12]
8. Skip list, with reasons [INFERENCE: based on findings 1-7]:
   - **Enterprise identity (SSO, SAML, SCIM):** needs a directory and a second population of users to administer; a few people already have OS or SSH identity (finding 2, iteration 5).
   - **Multi-tenant organizations:** needs a server that serves several customers and a database that enforces membership; skilled bots has one checkout and one state root per repository identity (findings 1 and 7).
   - **Kubernetes and Helm:** needs a cluster, a rollout policy and a backup operator; a launchd job and a file queue already provide scheduling and retry on one host (findings 3 and 7).
   - **Managed upgrades:** needs a vendor relationship and a licence service; the status index and the installer already report versions and install state (findings 4 and 7).
   - **Mobile:** needs a second client, an app store release cycle and a 12-month compatibility promise; a terminal client runs on the same host as the bots (finding 5).
9. What is worth keeping from each skipped area without adopting it: Kubernetes' digest pinning and verified backup become installer version pinning and a `bots status --rebuild` that never deletes on failure; managed upgrades' heartbeat becomes the status index's staleness warning; mobile's tolerant reader is unnecessary because the CLI and the bot files ship together. [INFERENCE: based on findings 1-7]

## Ruled Out
- A "lite" multi-tenant mode. Tenancy is in the URL space and the database schema; a lite version would be a second product.
- Adopting the Helm chart as the small-team install path. It installs a cluster workload with a management agent and a licence requirement.
- Shipping a mobile client before a terminal client exists. The terminal is the stated preference and the smaller build.

## Dead Ends
- Looking for a single-user mode in the Kubernetes chart: the personal edition is the single-user mode, and it is explicitly not the chart.
- Looking for a mobile web build in the phone app: it is a native React Native project, not a responsive web page.

## Edge Cases
- Ambiguous input: "enterprise" could mean the team edition or the paid Cloud. Both were treated as out of scope; the team edition's features that a small team can use are covered in the approvals and identity iterations.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md
- specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md
- specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md
- specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md
- specs/system-skilled-bots/context/OpenBot-main/mobile/AGENTS.md
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts

## Assessment
- New information ratio: 0.90
- Questions addressed: the skip list
- Questions answered: skip list with reasons

## Reflection
- What worked and why: each skipped feature has a visible dependency — a directory, a cluster, a licence service, an app store. Naming the dependency is a better reason than "we do not need it".
- What did not work and why: the Kubernetes and managed-upgrade docs are long operator runbooks; the first section of each carried the dependency and the rest was procedure.
- What I would do differently: check the chart's values for a `singleUser` flag before concluding the personal edition is the only single-user path.

## Recommended Next Focus
Reuse: code that can be lifted directly, with repository, path and license, ranked by how much of the gap it closes.
