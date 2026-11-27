# Iteration 8: Net-new from `openhuman-full` — the licence map and six capabilities no phase covers

## Focus

Net-new capabilities in `context/openhuman-full`'s 21 vendored crates, ranked by value to a small
team. The dispatch names `openhuman-full` as the first-read repo because no earlier run studied it.
Iteration 3 established that `openhuman-main/vendor/*` is 21 empty directories and that
`openhuman-full` is the checkout that actually carries the code
[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-003.md].

Two things came out of this iteration that were not the stated focus and matter more than it: a
licence map of all ten reference repos (F-8-1), which changes the verb for three of them from "lift"
to "mirror", and the discovery that the vendored tree is a coherent product stack rather than a
grab-bag — 21 crates that share a `TinyBus` module protocol, a `tinystoragedrivers` storage port
layer and a `tinysecurity` policy layer.

`steer.md` does not exist in the lineage directory at the time of this iteration; it is listed among
the sources as absent.

## Findings

### F-8-1 — Three of the ten reference repos are GPL-3.0, and every vendored crate in `openhuman-full` is GPL-3.0

Cross-cutting; affects every phase that cited these repos.

| Repo | Licence | Evidence |
|---|---|---|
| `OpenBot-main` | MIT | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] |
| `OpenMausBot-main` | Apache-2.0 | [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:2] |
| `rakazo-main` | Apache-2.0 | [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2] |
| `openhuman-main` | **GPL-3.0** | [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2] |
| `openhuman-full` | **GPL-3.0** | [SOURCE: specs/system-skilled-bots/context/openhuman-full/LICENSE:1-2] |
| `OpenGhost-main` | MIT | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1] |
| `hermes-muse-main` | MIT | [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1] |
| `turnstone-main` | Apache-2.0 | [SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:1-2] |
| `buzz-main` | Apache-2.0 | [SOURCE: specs/system-skilled-bots/context/buzz-main/LICENSE:1-2] |
| `tinychannels-main` | **GPL-3.0** | [SOURCE: specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2] |

Inside `openhuman-full`, all 21 vendored workspaces declare GPL-3.0 in their own `Cargo.toml`:
nineteen are `license = "GPL-3.0-only"` and two are `license = "GPL-3.0-or-later"` (`tinyflows`,
`tinyhumans-sdk`) [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/Cargo.toml:2]
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyflows/Cargo.toml:2]
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyhumans-sdk/Cargo.toml:2]. Each
workspace also ships its own `LICENSE` file whose first line is "GNU GENERAL PUBLIC LICENSE"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/LICENSE:1].

Observed. The consequence is a rule the plan does not state and the three earlier syntheses do not
carry: **for `openhuman-main`, `openhuman-full` and `tinychannels-main`, read the design and write
your own implementation; do not copy code.** That covers iterations 1 through 7 of this lineage —
the `activity-groups.ts` group titles, the `routine-firing.ts` firing frame, the `render.rs` overflow
ladder, the `capabilities.rs` record and the `conformance` honesty check are all *designs* that can
be reimplemented from a description, and none of them may be lifted as source. The MIT and
Apache-2.0 repos (`OpenBot-main`, `OpenGhost-main`, `hermes-muse-main`, `turnstone-main`,
`buzz-main`, `rakazo-main`, `OpenMausBot-main`) can be lifted with attribution.

This also corrects a reading of the 001 synthesis's skip list, which says "OpenMausBot's
`enterprise/` is not Apache-2.0"
[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:13].
The repo root is Apache-2.0; the exception is a subdirectory. The skip-list row is about the
subdirectory, not the repo.

### F-8-2 — An inbound event pipeline that filters noise before the agent sees it, with one terminal disposition per event

Net-new. No phase covers it: 011 is transport, 001 is the activity surface, and nothing decides
whether an inbound event should reach the agent at all.

`tinyeventqueues` (89,431 lines) is "External event management and queuing: durably queue noisy
inbound events and filter them the way a person filters noise, before they reach an agent"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates/tinyeventqueues/src/lib.rs:1-2].
The pipeline is eight named stages:

```text
ingress → normalize → gate → coalesce → salience → attention lanes
        → cadence / ingestion budget → dispatch (host callback)
```
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates/tinyeventqueues/src/lib.rs:8-11]

and "every ingested event ends in exactly one terminal `Disposition`: delivered, context, digest,
dead, or dropped with a `Reason`"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates/tinyeventqueues/src/lib.rs:13-15].
Dedupe is built in: ingesting the same event twice yields `Disposition::Accepted` then
`Disposition::Duplicate`
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates/tinyeventqueues/src/lib.rs:47-53].
Storage is behind ports — `Arc<dyn QueueStore>` for work and `Arc<dyn DocumentStore>` for state — and
time comes from an injectable `Clock` so tests drive it with a `ManualClock`
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates/tinyeventqueues/src/lib.rs:19-23].
Configuration is two strict JSON files, `queues.json` and `pipeline.json`
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates/tinyeventqueues/src/lib.rs:27-30].

Observed. The transferable idea is the **terminal disposition**. A bot that receives events from
five transports needs an answer to "what happened to this event" that is not "it went to the agent"
or "it did not". Five outcomes — delivered, context (kept as background, not acted on), digest
(rolled into a summary), dead (failed permanently), dropped with a reason — is a vocabulary the plan
has nowhere. `coalesce` and `salience` are the two stages worth studying hardest: they are where
"the way a person filters noise" is actually implemented.

### F-8-3 — A data-egress policy: classify what is leaving, then check it against a mode

Net-new. Phase 008 is the vault (where secrets are stored); nothing in the plan governs what data may
leave the machine.

`tinysecurity-egress` is "Native immutable scoped privacy and URL policy"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress/src/lib.rs:1].
Two layers:

- **A URL canonicalization guard.** `parse()` rejects input longer than 8192 bytes, any control
  character or whitespace, any backslash, and any authority containing `@` or `%`
  [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress/src/url_guard.rs:12-26],
  then validates the port before WHATWG normalization
  [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress/src/url_guard.rs:27-40].
  The `@` rejection is the userinfo trick (`https://trusted.com@evil.com`); the `%` rejection is
  percent-encoded hostnames; the whitespace rejection is header injection.
- **A privacy check.** `check()` rejects a request that carries a `transformation`, whose
  `DataCategory` is `Unknown`, or whose category is not in the policy's allowed set; rejects
  `PrivacyMode::LocalOnly` when the request has no local capability; and rejects
  `PrivacyMode::Sensitive` outright for `Credentials`, `Identifiers` and `OpaqueBrowserTraffic`
  [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress/src/privacy.rs:7-30].

Observed. The design decision worth mirroring is that the *caller declares a data category* and the
policy decides, rather than the policy inspecting the payload. `Unknown` is rejected rather than
defaulted, so a new call site cannot silently opt out by forgetting to classify. `OpaqueBrowserTraffic`
as a category is the detail that shows this was designed against a real leak: a browser session's
traffic cannot be classified, so it is treated as the most sensitive thing there is.

### F-8-4 — Bounded redaction that also scans prompts and tool definitions, and reports a content-free change tally

Net-new. Phase 008 stores secrets; nothing scans text on the way out, and nothing scans a tool
definition for injected instructions.

`tinysecurity-redact` is "Bounded native secret/identifier redaction and contextual intent scanning"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:1].
Four bounds are constants: `MAX_INPUT = 65_536`, `MAX_OUTPUT = 131_072`, `MAX_DEPTH = 32`, and
`MARKER = "[REDACTED]"` [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:28-31].
The result type is `Sanitized<T>`, documented as "A JSON value after content sanitation, paired with
a content-free change tally"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:33-35].
The API surface includes `ScanPromptRequest`, `ScanPromptScoredRequest2` and
`ScanToolDefinitionRequest`
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:23-26],
and the crate has separate `prompt.rs`, `score.rs`, `structured.rs` and `extended.rs` modules
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:16-20].
The doc comment is explicit about what it does *not* do: "no network I/O, authorization, protocol
sanitation or skill-package scanning"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:3-4].

Observed. Three things to mirror. First, **the bounds are constants, not configuration** — a
redactor with a configurable input limit is a redactor someone will raise. Second, **the change tally
is content-free**: the caller learns that three things were redacted without learning what they
were, which is what makes it safe to log. Third, **tool definitions are scanned**, not just user
text — a tool's description is attacker-controlled input in any system that lets a third party
contribute tools, and the plan has no such check.

### F-8-5 — Pluggable token compression as a separate engine with a host-supplied configuration mapping

Net-new. Phase 005 is memory; nothing in the plan compresses context to fit a budget.

`tinyjuice` (636,193 lines, the largest vendored crate) is "Pluggable token compression for OpenHuman
and other Rust hosts. TinyJuice owns the reusable TokenJuice compression engine. Hosts provide
configuration mapping, optional ML callbacks, savings attribution, and their own…"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyjuice/crates/tinyjuice/src/lib.rs:1-4].
It ships as a loadable module: "The published `tinyjuice` crate stays bus-agnostic. This private
workspace crate is the separately shipped native module that keeps the compression engine and its
dependency tree out of an embedding host"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyjuice/crates/tinyjuice-module/src/lib.rs:1-4].

Observed. The architectural decision is the finding: compression is a *separate process or module*
with a narrow contract, not a function called inside the agent loop. That is what lets it be
replaced, and it is what keeps a 636k-line dependency tree out of the host. The "savings attribution"
phrase is the second idea — the engine reports how many tokens it saved, so the feature can be
justified rather than assumed.

### F-8-6 — Voice in and out as a module with a platform hotkey listener

Net-new. No phase covers voice.

`tinyvoice` (567,904 lines) has four member crates: `tinyvoice`, `tinyvoice-bus`,
`tinyvoice-hotkey-win` and `tinyvoice-module`
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyvoice/crates/tinyvoice-module/src/lib.rs:1-5].
The module crate is a loadable `TinyBus` adapter whose "`cdylib` output is the target-specific binary
distributed in GitHub releases"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyvoice/crates/tinyvoice-module/src/lib.rs:3-5].
The existence of a `tinyvoice-hotkey-win` crate is the design signal: the push-to-talk key is
platform-specific and is isolated in its own crate rather than branched inside the engine.

Observed. Ranked low for a small team (see the table below) because voice is a second input modality
and the terminal is the client, but the *shape* is worth noting: a platform-specific concern gets its
own crate, not an `if cfg!(windows)` inside the engine.

### F-8-7 — Document synthesis: a typed spec turned into real office-format bytes

Net-new. No phase produces a document.

`tinydocs` (83,976 lines) is "Agent-friendly document synthesis and text extraction in Rust.
`tinydocs` turns a typed, validated document spec into real office-format bytes. It is built for
hosts that let a language model produce documents"
[SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/crates/tinydocs/src/lib.rs:1-4].

Observed. The design decision is the split: the model produces a *typed, validated spec*, and a
deterministic renderer turns it into bytes. The model never emits the file format. That is the same
principle as the plan's structured records, applied to an output the plan does not have. Ranked
medium: a small team does want "write me a report as a .docx", and this is the only reference that
does it without asking the model to be a serialiser.

## Ranked net-new table

Value to a small team, 1 (low) to 5 (high). Size is Rust lines in the vendored workspace.

| Rank | Crate | Lines | Value | What it is | Covered by plan or §13? |
|---|---|---|---|---|---|
| 1 | `tinysecurity` | 288,030 | 5 | Egress policy, redaction, prompt/tool-definition scanning, audit batches, sandbox planning, approval, crypto | No. 006 covers approvals, 008 covers storage; egress, redaction and prompt scanning are absent |
| 2 | `tinyeventqueues` | 89,431 | 5 | Inbound event noise pipeline with five terminal dispositions | No |
| 3 | `tinyjuice` | 636,193 | 4 | Pluggable token compression as a separate module | No |
| 4 | `tinydocs` | 83,976 | 4 | Typed document spec to office-format bytes | No |
| 5 | `tinysearch` | 87,179 | 3 | Provider-backed web search behind one service | No |
| 6 | `tinyvoice` | 567,904 | 3 | Voice in/out plus a platform hotkey crate | No |
| 7 | `tinystoragedrivers` | 72,569 | 3 | 14 storage ports including `-fence`, `-secrets`, `-blob`, `-document`, `-kv`, `-queue` | Partly: 008 covers secrets storage |
| 8 | `tinyconnectors` | 113,104 | 2 | Provider registry, scope catalogs, preferences, sync | Yes: §13 row 7 skips the connector catalogue |
| 9 | `tinycomputer` | 630,174 | 2 | Desktop accessibility, browser, cursor, engine | Yes: §13 row 6 skips the browser farm and container computer |
| 10 | `tinybox` | 159,147 | 2 | Jail, microVM, docker, ssh, sync sandboxes | Yes: §13 row 6 skips gVisor and the container computer |
| 11 | `tinyagents` | 510,260 | 2 | Agent definition, harness, hooks, orchestration, registry, runtime, session, tasks | Partly: 002 and 010 cover the runtime and conversations |
| 12 | `tinyflows` | 242,273 | 2 | Workflow automation with schedule, catalog, copilot, adaptive | Partly: 002 covers the routine layer |
| 13 | `tinymcp` | 150,644 | 2 | MCP client | No, but 009's skill mechanism covers the need |
| 14 | `tinymemory` | 99,763 | 2 | Memory API, integrations, tools, plus `tinyredact` | Yes: 005 covers memory |
| 15 | `tinyskills` | 78,138 | 2 | Skill packages and drivers | Yes: 009 covers skills |
| 16 | `tinywallet` | 129,856 | 1 | Multi-chain wallet primitives and x402 payments | No, and no need |
| 17 | `tinyhosts` | 67,066 | 1 | Deploy a Next.js app and its database to a host | Yes: §13 rows 3 and 4 skip deployment |
| 18 | `tinybus` | 79,755 | 1 | Module protocol shared by every other crate | No, but it is infrastructure for a stack the plan does not build |
| 19 | `tinychannels` | 273,669 | 1 | Channel adapters and conformance | Yes: 011 covers channels |
| 20 | `tinyhumans-sdk` | 13,407 | 1 | Typed client for the vendor backend | No, and it is a vendor lock |
| 21 | `tiny-artifacts` | 6,720 | 1 | Artifact storage | No, and 008 covers storage |

The three worth a phase of their own are `tinysecurity`'s egress and redaction layer,
`tinyeventqueues`' disposition pipeline, and `tinyjuice`'s out-of-process compression. Everything
below rank 4 is either already covered by a phase or by a §13 skip row, or is a vendor lock.

## Ruled Out

- **Reading `tinycomputer`, `tinybox`, `tinyagents`, `tinyflows`, `tinymcp`, `tinymemory` and `tinyskills` in depth.** Each is either covered by a phase (005, 009, 002, 010) or by a §13 skip row (row 6 covers the container computer, browser farm and gVisor). Reading them would produce evidence for capabilities the plan has already decided against. Their line counts and member-crate lists are recorded in the table so a later iteration can pick one up without re-inventorying.
- **Reading `tinywallet`, `tinyhosts`, `tinyhumans-sdk`, `tiny-artifacts`.** Ranked 1 on value; `tinyhumans-sdk` is a typed client for one vendor's backend, which is a lock the plan should not take.
- **Treating the vendored tree as one artefact.** The first read assumed 21 independent crates. They share a `TinyBus` module protocol and a `tinystoragedrivers` port layer, so they are one product stack. That changes the ranking: a crate that is infrastructure for a stack the plan is not building ranks low even when it is large.

## Dead Ends

- **Lifting code from `openhuman-full`, `openhuman-main` or `tinychannels-main`.** All three are GPL-3.0 (F-8-1). Any plan text that says "copy this file" from those repos is wrong. Candidate for the reducer's exhausted list: "lift code from a GPL-3.0 reference".
- **A per-crate licence check.** The licence is uniform across all 21 vendored workspaces, so a per-crate table adds nothing beyond F-8-1's two exceptions (`tinyflows`, `tinyhumans-sdk`, both `-or-later`).

## Edge Cases

- Ambiguous input: "give its size" could mean disk size or line count. Resolved to Rust line count, because disk size is dominated by vendored dependencies and `.git` and says nothing about the work. Both were measured; only line count is reported.
- Contradictory evidence: none between sources. But F-8-1 contradicts the *practice* of iterations 1 through 7, which described GPL-3.0 code as liftable. Recorded as a correction to this lineage's own earlier framing rather than as a source conflict.
- Missing dependencies: `steer.md` absent (checked before this iteration). `tinyvoice`'s workspace `Cargo.toml` has no top-level `license` key, so its licence is taken from its `LICENSE` file and its member crates rather than from the manifest.
- Partial success: none. All planned reads resolved.

## Sources Consulted

- `specs/system-skilled-bots/context/{OpenBot-main,OpenMausBot-main,rakazo-main,openhuman-main,openhuman-full,OpenGhost-main,hermes-muse-main,turnstone-main,buzz-main,tinychannels-main}/LICENSE`
- `specs/system-skilled-bots/context/openhuman-full/vendor/*/Cargo.toml` (21 workspaces)
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates/tinyeventqueues/src/lib.rs:1-60`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress/src/{lib.rs,url_guard.rs,privacy.rs}`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:1-35`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinyjuice/crates/{tinyjuice,tinyjuice-module}/src/lib.rs`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinyvoice/crates/tinyvoice-module/src/lib.rs`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/crates/tinydocs/src/lib.rs`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinystoragedrivers/crates/tinystoragedrivers-fence/src/lib.rs`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinyconnectors/crates/tinyconnectors-sync/src/lib.rs`
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/crates/tinycomputer-accessibility/src/lib.rs`
- `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md` (section 13 skip list)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-003.md`
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md` (absent)

## Assessment

- New information ratio: 0.93
- Questions addressed: what the ten repos' licences are; what `openhuman-full`'s 21 vendored crates contain; which of them carry a capability neither the plan nor the §13 skip list covers; how each ranks by value to a small team and how large each is
- Questions answered: all four

Six of seven findings are fully new capabilities (F-8-2 through F-8-7). F-8-1 is a licence map that
adds no capability but reframes three repos' liftability and therefore the verb in every earlier
iteration's "lift" recommendation. (6 + 0.5×1) / 7 = 0.93.

## Reflection

- What worked and why: reading the workspace `Cargo.toml` and the `crates/` listing before reading any source. That inventory took two calls and produced the whole ranking; reading source first would have produced detail about three crates and no map. The `//!` doc comment at the top of each `lib.rs` is the highest-value line in a Rust crate, and 21 of them fit in one call.
- What did not work and why: the first attempt looked for `src/lib.rs` at each workspace root and found nothing for 15 of 21 crates, because each vendored crate is itself a workspace with its members under `crates/`. The `find -maxdepth 3 -name lib.rs` retry found them. The lesson is that "vendored crate" here means "vendored workspace".
- What I would do differently: check licences first, before reading any code. F-8-1 would have changed how iterations 1 through 7 phrased their recommendations, and it cost one call to establish.

## Recommended Next Focus

Net-new from the remaining six repos — `buzz-main`, `hermes-muse-main`, `rakazo-main`,
`OpenMausBot-main`, `OpenGhost-main`, `turnstone-main` — for capabilities neither the fourteen
phases nor the §13 skip list covers. Iterations 1 through 7 read these repos for phase evidence, so
the question is different: what do they have that no phase asked for? Candidates already visible
from this iteration's reading: `buzz-main`'s `benchmarks/` folder and its `buzz-test-client` E2E
suite, `hermes-muse-main`'s `dashboard/` and `desktop/` folders, and `turnstone-main`'s
`eval_attachments.json`. All are MIT or Apache-2.0, so anything found there is liftable — which
makes this the highest-value remaining iteration.
