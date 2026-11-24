# Iteration 4: Frontier node F-2-007 — how the computer is provisioned and bounded

## Focus

Frontier node F-2-007 (depth 2, scope `OpenBot-main/shared/computer-token.ts`, `OpenBot-main/shared/computer-start.ts`, `OpenBot-main/shared/bot-browser.ts`): how is OpenBot's computer provisioned and bounded (supervisor, container image, sandbox provider, per-tenant token), and what is the smallest equivalent for a small team?

## Actions Taken

1. Read `shared/computer-start.ts` for the start budget and why it is that long.
2. Read `shared/bot-browser.ts` for the browser's shape and the recording rule.
3. Read the `agent-computer` and `supervisor` services in `docker-compose.yml`.
4. Read `shared/computer-token.ts` for the token derivation.

## Findings

1. The computer is **a container of its own, not a mode of the server**: entrypoint `/app/bin/openbot-computer`, "so what a Bot's shell can read is what this service is given below and not one setting of the server's: no database address, no keys, no licence." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:352]
2. It is **loopback-only** because "this process drives a browser holding real logins; COMPUTER_TOKEN is the request control, and loopback keeps the surface off routed networks." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:360]
3. The browser is **headed by default** on the container's own X server, because "bot checks such as Cloudflare's challenge" treat headless worse; `headless` is opt-in for a smaller footprint. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:381]
4. Browser capacity is **bounded by count, idle time and memory**: `COMPUTER_MAX_BROWSERS` defaults to 8, `COMPUTER_BROWSER_IDLE_MS` to 30 minutes, and at 85% of the container's memory it closes browsers nobody is using, least recently used first, down to ten points under. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:386]
5. Files persist on **two volumes**: `agent-workspace:/workspace` and `agent-profiles:/profiles`, the second "so logins survive container restarts". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:420]
6. A shared computer still **separates bots**: `COMPUTER_SEPARATE_WORKSPACES: "on"` gives every bot without a computer of its own "its own folder of files and its shell starts there". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:401]
7. The supervisor is the **only holder of the Docker socket**, which is "root-equivalent on the host", and it "only exposes Bot-level verbs". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:435]
8. Each per-bot computer is created **from the same image with its own token**, derived from the deployment token and whose computer it is, so "a Bot that reads its own computer's token opens no other." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:461]
9. gVisor is **opt-in, not default**: `COMPUTER_RUNTIME=runsc` runs every computer under gVisor "when the host has it. Left unset each computer is an ordinary container and shares the host kernel." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:470]
10. Egress is **per bot**: `EGRESS_PROXY_<BOT>` is "derived from the Bot's id, so there is no fixed list to write out the way COMPUTER_TOKEN is." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:367]
11. Start cost is **real and budgeted**: a computer that was asleep or is new "costs a node, a pod and a browser launch to come up, and on a busy day that has taken over a minute and a half", so the server waits 180 s rather than reporting a failed step. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1]

## Ruled Out

- Treating the computer as a sandbox mode: it is a separate service with its own image, entrypoint, volumes and token. A sandbox flag on an executor cannot stand in for it.
- Assuming gVisor is the boundary: it is opt-in, and the documented default is an ordinary container sharing the host kernel. The real boundary is the container plus the per-computer token.

## Dead Ends

- Searching for a `supervisor/` or `agent-computer/` directory in this checkout: both are published images referenced by name, so their source is not here. The compose file's comments are the contract, and they are unusually explicit about why each setting exists.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: the supervisor and computer images are external (`ghcr.io/copilotkit/openbot-supervisor`), so provisioning internals are read from the compose contract rather than from source. Recorded as a confidence limit.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml:342-470
- specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1-16
- specs/system-skilled-bots/context/OpenBot-main/shared/bot-browser.ts:1-40
- specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:40-90

## Assessment

- New information ratio: 1.0
- Questions addressed: How is OpenBot's computer provisioned and bounded (supervisor, container image, sandbox provider, per-tenant token) and what is the smallest equivalent for a small team?
- Questions answered: How is OpenBot's computer provisioned and bounded (supervisor, container image, sandbox provider, per-tenant token) and what is the smallest equivalent for a small team?

## Reflection

- What worked and why: reading `docker-compose.yml` as a design document. Every setting carries a comment saying what breaks without it, which is exactly the information a parity build needs and which no README states.
- What did not work and why: looking for the supervisor's source assumed it is in this repo; it is a published image, so the compose contract is the ceiling of what can be read here.
- What I would do differently: for any service-shaped primitive, read the compose file before the code. It names the boundary (loopback, token, volumes, runtime) in one place.

## Recommended Next Focus

What do turnstone-main, OpenMausBot-main and rakazo-main do for apps, secrets and a bot's computer, and which of the three is simplest to copy?
