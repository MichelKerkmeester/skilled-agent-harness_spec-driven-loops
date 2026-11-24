# Iteration 5: Frontier node F-2-008 — what the other three repos do

## Focus

Frontier node F-2-008 (depth 2, scope `turnstone-main`, `OpenMausBot-main`, `rakazo-main`): what do these three do for apps, secrets and a bot's computer, and which of the three is simplest to copy?

## Actions Taken

1. Listed each repo's top level and read its licence.
2. Read `rakazo-main/docs/bot-secrets.md` and `docs/computer-runtime.md`.
3. Read `turnstone-main/docs/mcp-oauth.md`, `docs/oauth-storage.md` and `docs/openshell.md`.
4. Read `OpenMausBot-main/docs/bitwarden.md` and `docs/computer-use-integration.md`, and listed the connector's sandbox profiles.

## Findings

1. All three are **Apache 2.0**, so code can be lifted with attribution and a NOTICE. [SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1]
2. rakazo's secret model is the **closest to a drop-in**: the bot calls `request_secret` with a reference name and an HTTPS service origin, the value is encrypted in Postgres `vault_credentials`, and `list_secrets` returns names, destinations and auth configuration without values. [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:3]
3. rakazo **injects by proxying the request**, not by handing over the value: the bot calls `secret_request` with `name`, `url` and `method`, and the backend decrypts and injects. [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:25]
4. rakazo states the boundary as a rule: "The model has no tool for reading these values … Injecting a site credential into an AI-controlled shell command, file or arbitrary environment variable would let those commands read it, so those paths are not exposed." [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:37]
5. rakazo's computer is a **pluggable sandbox provider** (E2B / Daytona / Boat / Docker / desktop-fake) behind an `AgentHomeStore`, and the agent runtime runs in the API/worker process, not inside the sandbox. [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/computer-runtime.md:3]
6. turnstone does **per-(user, MCP server) OAuth 2.1 + PKCE delegation**, so each user authorizes a remote MCP server with their own identity "rather than sharing a single bearer token across the deployment." [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/mcp-oauth.md:3]
7. turnstone's per-user OAuth is **opt-in per `mcp_servers` row and dark by default**: "Local-auth Turnstone installs with no `oauth_user` rows exercise zero new code paths." [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/mcp-oauth.md:5]
8. turnstone keeps tokens in **one encrypted store with a deployment keyring**: a Fernet key in `config.toml`, accepted only from that file and not from environment variables, with an ordered list for rotation where the first key encrypts new writes and all keys are tried on read. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/oauth-storage.md:8]
9. turnstone's sandbox is **kernel-enforced and layered**: Landlock for filesystem, network namespace + seccomp + HTTP CONNECT proxy for network, `setuid` drop for process, and proxy-level secret resolution so API keys never sit in sandbox memory. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/openshell.md:5]
10. OpenMausBot **delegates secrets to an external password manager**: Bitwarden (beside 1Password) connected in Settings → Vault, with `bw://<item>[/<field>]` references, values read at the moment a bot uses one and masked wherever text crosses to a bot or a transcript. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/docs/bitwarden.md:3]
11. OpenMausBot's computer is **the desktop itself**: an Electron main process with a CUA host spawning `cua-driver` over a private socket, plus a `WebContentsView` pool with per-bot persist partitions driven over CDP. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/docs/computer-use-integration.md:12]
12. OpenMausBot's connector is a **host agent with its own sandbox profiles** — an AppArmor profile and a seccomp JSON — rather than a cloud service. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/connector/profiles/omb-home-narrow.apparmor:1]

## Ruled Out

- Copying OpenMausBot's computer: it is an Electron desktop shell driving a native CUA driver, which is the desktop path D4 deprioritises and the largest possible lift.
- Copying turnstone's OAuth stack wholesale: it is a Python service with a Fernet keyring and a per-server admin form, sized for a multi-node deployment rather than a few people on one host.
- Treating any of the three as a connector catalogue: none ships a catalogue of apps; rakazo and turnstone both assume you bring the service, and OpenMausBot assumes you bring the password manager.

## Dead Ends

- Looking for a shared "vault" module across the three: each solves it differently (Postgres table, Fernet store, external password manager), so there is no single thing to lift. The reusable part is the *shape*, not the code.

## Edge Cases

- Ambiguous input: "simplest to copy" could mean least code or least new concept. Selected interpretation: least new concept, because the build is scoped to a small team and the cost is comprehension, not lines.
- Contradictory evidence: none.
- Missing dependencies: none; all three repos are present and their docs are the design record.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/context/turnstone-main/LICENSE:1
- specs/system-skilled-bots/context/turnstone-main/docs/mcp-oauth.md:1-35
- specs/system-skilled-bots/context/turnstone-main/docs/oauth-storage.md:1-35
- specs/system-skilled-bots/context/turnstone-main/docs/openshell.md:1-20
- specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:1
- specs/system-skilled-bots/context/OpenMausBot-main/docs/bitwarden.md:1-40
- specs/system-skilled-bots/context/OpenMausBot-main/docs/computer-use-integration.md:1-30
- specs/system-skilled-bots/context/OpenMausBot-main/connector/profiles/omb-home-narrow.apparmor:1
- specs/system-skilled-bots/context/rakazo-main/LICENSE:1
- specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:1-40
- specs/system-skilled-bots/context/rakazo-main/docs/computer-runtime.md:1-35

## Assessment

- New information ratio: 1.0
- Questions addressed: What do turnstone-main, OpenMausBot-main and rakazo-main do for apps, secrets and a bot's computer, and which of the three is simplest to copy?
- Questions answered: What do turnstone-main, OpenMausBot-main and rakazo-main do for apps, secrets and a bot's computer, and which of the three is simplest to copy?

## Reflection

- What worked and why: reading each repo's `docs/` directory rather than its source. All three write decision documents that state the boundary and the reason, which is exactly the reusable artefact — the code is Apache 2.0 but the *reasoning* is what a small-team build needs.
- What did not work and why: looking for a shared vault module assumed convergence; the three diverge completely, so the comparison had to be by shape rather than by code.
- What I would do differently: rank by "least new concept" from the start. rakazo wins because its secret model is one table, one proxy call and one rule, and it needs no external service.

## Recommended Next Focus

What is the smallest secret store skilled bots can add that keeps a value write-only, injects it without the bot reading it, and records each use in the run record?
