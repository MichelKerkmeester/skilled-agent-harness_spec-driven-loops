# Iteration 4: Local OpenAI gateway fronting official CLIs vs private-endpoint proxies

## Focus
Whether a localhost OpenAI-compatible gateway fronting the **official CLIs** (`cursor-agent`, `devin`) is a distinct, ToS-safer case from the private-endpoint proxies already ruled out, and what the nested-harness consequences are for Pi's tool loop.

## Actions Taken
- Fetched `https://github.com/tageecc/cursor-agent-api-proxy` (52★) — a CLI-spawn OpenAI proxy.
- Fetched `https://github.com/timxx/Cursor-To-OpenAI` (fork of eisbaw) — a reverse-engineered protobuf proxy.
- Cross-referenced the Cursor staff ruling (iteration 2) against both architectures.
- Re-read `cli-cursor/references/cli-reference.md` print/headless mode and `cli-devin/references/cli-reference.md` print/ACP mode for the subprocess surfaces a gateway would front.

## Findings

### F1. Two distinct proxy architectures exist in the wild
First-hand fetch of two community projects reveals the critical architectural split:

| Project | Stars | What it fronts | Auth | ToS class |
|---------|-------|----------------|------|-----------|
| `tageecc/cursor-agent-api-proxy` | 52 | **Official `cursor-agent` CLI subprocess** (`agent login` or `CURSOR_API_KEY`) | Official client | CLI-spawn (safer axis) |
| `timxx/Cursor-To-OpenAI` | 1 | **Private Cursor backend directly**, via reverse-engineered protobuf | Your token, non-official client | Reverse-engineered (blocked) |

`cursor-agent-api-proxy` installs the official Cursor CLI, logs in via `agent login` (or `CURSOR_API_KEY` headless), then runs `cursor-agent-api` on `http://localhost:4646` exposing an OpenAI-compatible `/v1` surface. `Cursor-To-OpenAI` explicitly states "Protocol implementation based on **reverse-engineered protobuf schemas**" and talks to the private backend directly with bidirectional HTTP/2 streaming. [SOURCE: https://github.com/tageecc/cursor-agent-api-proxy README] [SOURCE: https://github.com/timxx/Cursor-To-OpenAI README]

### F2. The reverse-engineered class is the already-ruled-out ToS violation
`Cursor-To-OpenAI` is exactly the class the Cursor staff ruling (iteration 2) blocks: it reverse-engineers the private protobuf protocol and calls private, non-public client endpoints with the user's token from a non-official client. This maps directly onto ToS §1.5(i) (reverse engineer / derive underlying structure) and the staff's "calling private endpoints outside official clients" framing. This class is already ruled out for this packet. [SOURCE: https://forum.cursor.com/t/.../167778 (iteration 2)] [SOURCE: https://cursor.com/terms-of-service §1.5]

### F3. The CLI-spawn class is architecturally distinct but ToS-ambiguous
`cursor-agent-api-proxy` fronts the **official `cursor-agent` subprocess** — the authorized client makes the upstream calls, not the proxy. This is a genuinely different architecture from the private-endpoint proxies: the proxy never touches `api2.cursor.sh` directly; it spawns `cursor-agent` (print/one-shot mode) and relays the final text as an OpenAI completion. On the **auth/client axis**, this is closer to "using the official client," which the staff listed as a supported path. However, the staff's concern was framed around "calling private endpoints outside official clients" and "using your subscription outside official clients" — a CLI-spawn relay still **exposes the subscription to a third-party harness** (Pi), which may remain a §1.5 concern depending on whether "official client" is read as the process making the HTTP call (CLI-spawn passes) or the end-to-end user surface (Pi-as-harness fails). This is a **genuine ambiguity** that the staff letter does not resolve. [SOURCE: https://github.com/tageecc/cursor-agent-api-proxy README] [SOURCE: https://forum.cursor.com/t/.../167778 (iteration 2)]

### F4. The nested-harness problem breaks Pi's native tool loop
Both Cursor and Devin official CLIs run an **agent harness** (tool loop, planning, file edits). `cursor-agent -p` / `devin -p` print mode and `devin acp` all execute the vendor's agent loop, not raw model completions. A Pi `models.json` provider pointing at a CLI-spawn gateway would receive a **nested agent**: Pi sends a prompt + tool definitions, the gateway forwards to `cursor-agent`/`devin`, the vendor CLI runs its **own** tool loop (ignoring or double-executing Pi's tools), and returns a final text blob. Consequences:
- Pi's native tool streaming (tool-call deltas, stop-reason events per iteration 1 F8) is lost; Pi sees one final assistant string.
- Pi's tool definitions are not honored by the vendor harness; the vendor harness uses its own tools.
- Agent-harness latency (planning, multi-step) is added on every "completion," making interactive `/model` use slow.
- Double-tool-execution risk: both Pi and the vendor harness may try to run tools.

[SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:252-260] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:560] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:395-499 (iteration 1)]

### F5. A CLI-spawn gateway is technically feasible as a Pi custom provider
Despite the nested-harness cost, a CLI-spawn gateway is **technically feasible** as a Pi `models.json` provider: `baseUrl: "http://localhost:4646/v1"`, `api: "openai-completions"`, a dummy `apiKey`, and a `models[]` list mirroring the repo's 21-id Cursor allowlist (or Devin's curated six families). Pi would treat it as a local OpenAI-compatible server (like Ollama/vLLM). The gateway translates `/v1/chat/completions` into `cursor-agent -p "<prompt>" --model <id>` and returns the final text as a non-streaming or single-chunk completion. This is the same pattern Pi already supports for local servers. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:122-156 (iteration 1)] [SOURCE: https://github.com/tageecc/cursor-agent-api-proxy README]

### F6. Devin has no equivalent CLI-spawn proxy in the wild; the shape would be worse
No community Devin CLI-spawn OpenAI proxy was found. A Devin analog would front `devin -p` (print mode) or `devin acp` (ACP stdio). `devin -p` spawns a full Devin **session** per request — Devin sessions are long-running agent tasks (minutes), so per-completion latency would be severe and unsuitable for interactive `/model` use. `devin acp` is ACP JSON-RPC over stdio; a gateway would have to translate ACP↔OpenAI, and Devin's ACP still runs an agent harness. Neither Devin surface offers a raw-completions mode. [SOURCE: devin acp --help output (iteration 3)] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:560]

### F7. The repo already has a CLI-spawn executor; a Pi gateway would duplicate it
This repo's `cli-cursor` and `cli-devin` skills already dispatch to the official CLIs as executors (shell-out, print mode, enforced allowlists). A Pi `/model` row backed by a CLI-spawn OpenAI gateway would **duplicate** that dispatch with extra hops (Pi → gateway → CLI → vendor backend) and a protocol translation layer, while inheriting the nested-harness cost. The parent spec explicitly keeps the existing executor dispatch out of scope. So even the technically-feasible CLI-spawn gateway offers no architectural advantage over the existing executor for this repo; it only adds a Pi-picker affordance at the cost of a worse tool loop. [SOURCE: specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/spec.md (parent spec, scope)] [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md:43-73 (iteration 2)]

## Questions Answered
- Q4 (full): A local OpenAI-compatible gateway can front the official CLIs and be wired as a Pi `models.json` provider (technically feasible). But it is ToS-ambiguous for Cursor (CLI-spawn uses the official client, but still exposes the subscription to a third-party harness — unresolved by the staff letter), and the nested-harness problem breaks Pi's native tool streaming and adds latency. The reverse-engineered-proxy subclass is already ruled out. For Devin, no CLI-spawn proxy exists and the session-based surfaces would be worse. The repo already has a CLI-spawn executor, so a Pi gateway duplicates it with extra cost.

## Questions Remaining
- Q5 Ranked verdict and parent-purpose alignment

## Dead Ends
- Reverse-engineered protobuf proxies (Cursor-To-OpenAI class): already ruled out, confirmed as the blocked class.

## Ruled Out
- **Reverse-engineered OpenAI proxies to private Cursor/Devin backends** (re-confirmed as the blocked class, distinct from CLI-spawn).

## Reflection
What worked: fetching two contrasting community projects first-hand made the architectural split concrete — CLI-spawn (official client) vs reverse-engineered (private backend). What failed: no Devin CLI-spawn proxy exists to study. Negative knowledge: even the ToS-safer CLI-spawn class pays a nested-harness cost that breaks Pi's tool loop, and the repo already has the executor dispatch it would duplicate.

## Assessment
- newInfoRatio: 0.70
- Novelty justification: The two-project architectural contrast, the CLI-spawn-vs-reverse-engineered ToS split, the nested-harness tool-loop break, the technical feasibility of a Pi `models.json` gateway, and the duplication of the existing executor were all new to this packet.
- Confidence: high on the two project architectures (first-hand READMEs) and the nested-harness logic; medium on the Cursor CLI-spawn ToS ambiguity (genuine unresolved gap); low on Devin CLI-spawn feasibility (no exemplar).

## Recommended Next Focus
Iteration 5: ranked verdict — order the three paths (token-reuse HTTP, reverse-engineered proxy, CLI-spawn gateway) by technical feasibility and account-safety, map each to the parent spec's purpose, and state the recommendation and open feature requests to track.

## SCOPE VIOLATIONS
None.
