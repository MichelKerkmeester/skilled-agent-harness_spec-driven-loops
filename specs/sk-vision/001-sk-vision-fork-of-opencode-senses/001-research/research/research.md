---
title: "Feature Research: sk-vision fork of OpenCode Senses with Pi support"
description: "One-shot investigation of housing, fork baseline, and OpenCode plus Pi adapters for a local vision skill."
trigger_phrases:
  - "sk-vision research"
  - "opencode senses architecture"
  - "pi registerTool vision"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/001-research"
    last_updated_at: "2026-08-16T06:28:08.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Added continuity frontmatter for validator."
    next_safe_action: "Run validate.sh --strict on this child."
    blockers: []
    key_files:
      - "research/research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-research-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone skill, shipped v0.2.0, Pi registerTool, MIT rebrand."
---
# Feature Research: sk-vision fork of OpenCode Senses with Pi support

Complete research documentation for the first sk-vision child. Load-bearing claims use `[C]` confirmed, `[I]` inferred, `[U]` unknown.

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this file as the authoritative fork-and-adapter investigation for later children. Do not treat `../context/PLAN.md` as shipped behavior. Do not start `.opencode/skills/sk-vision/` until `002-skill-scaffold` exists.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-001
- **Feature/Spec**: [spec.md](../spec.md)
- **Status**: Complete
- **Date Started**: 2026-08-15
- **Date Completed**: 2026-08-15
- **Researcher(s)**: cursor-grok
- **Reviewers**: operator (plan approval)
- **Last Updated**: 2026-08-15

**Related Documents**:
- Spec: [spec.md](../spec.md)
- ADR: [decision-record.md](../decision-record.md)
- Upstream dump: [`../context/README.md`](../../context/README.md)
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:file-organization -->
## FILE ORGANIZATION

- Findings: this file
- Upstream source: `../../context/`
- Experiments: none (no GPU run)
- Pi types: `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/types.d.ts`
<!-- /ANCHOR:file-organization -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary
Fork OpenCode Senses into a first-party sk-skill and add CLI Pi support beside OpenCode. This child answers housing, baseline, and host-adapter questions only.

### Current Behavior
The packet started as `context/` only: Senses v0.2.0 sources, MIT LICENSE, no spec.md. Track `description.json` wrongly described `app-remote-agent-chat`. [C] `specs/sk-vision/description.json` before rewrite. `.opencode/specs` is a symlink to `specs/`. [C] `ls -l .opencode/specs`.

### Key Findings
1. **Shipped core is host-agnostic JSON-RPC** [C]: `python/runtime.py` is an NDJSON server; `src/runtime/client.ts` spawns it; `src/opencode/` is the only OpenCode import surface.
2. **PLAN.md is ahead of the code** [C]: README/package default `moondream2`; PLAN.md wants Moondream 3.1 plus audio/video/docs.
3. **Pi can register tools and attach images** [C]: Pi 0.84.2 `ExtensionAPI.registerTool` and `InputEvent.images?: ImageContent[]`.
4. **Standalone skill is the housing fit** [C]: class S matrix in `sk-create-skill` skill-root-metadata-contract.md; `sk-communication` already nests a package in a standalone skill.

### Recommendations

**Primary Recommendation**:
- Standalone `.opencode/skills/sk-vision/` containing the forked runtime, OpenCode plugin adapter, and Pi `registerTool` extension. Fork shipped v0.2.0. Rebrand env/cache. Keep MIT notice.

**Alternative Approaches**:
- Parent hub: only if OpenCode vs Pi need separate advisor identities (they do not today)
- MCP or bash CLI for Pi: fallback if an extension cannot ship, worse UX
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

### Executive Summary
OpenCode Senses already turns screenshots into guarded OCR and layout text for text-only OpenCode models. The dump under `context/` is that plugin plus a local Python Moondream runtime. sk-vision should fork that shipped image pipeline into a standalone skill and add a Pi extension that registers the same tools. Pi 0.84.2 already has `registerTool` and typed image attachments, so Pi is not limited to bash workarounds.

### Architecture Diagram

```
OpenCode plugin.ts          Pi extension.ts
  tools + attachments         registerTool + input.images
           \                       /
            \                     /
             v                   v
        PhotonProvider + context-builder
                     |
              RuntimeClient (NDJSON)
                     |
              python/runtime.py
                     |
              Moondream / Photon (local GPU)
```

### Quick Reference Guide

**When to use this approach**:
- Text-only coding models need screenshot/OCR/detect
- Operator has NVIDIA Ampere+ or Apple Silicon and accepts a ~3.9 GB first download

**When NOT to use this approach**:
- Native multimodal primary models that already see images and do not need grounded boxes
- Hosts without a plugin/extension surface and without willingness to run a local GPU runtime

**Key considerations**:
- Perception stays out of the reasoning model (Senses principle)
- Image text is untrusted data
- Do not block message submit on GPU

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Dump | Senses README and sources | [`../../context/README.md`](../../context/README.md) | High [C] |
| Dump | Plugin entry | [`../../context/src/plugin.ts`](../../context/src/plugin.ts) | High [C] |
| Dump | Tools | [`../../context/src/opencode/tools.ts`](../../context/src/opencode/tools.ts) | High [C] |
| Dump | Python RPC | [`../../context/python/runtime.py`](../../context/python/runtime.py) | High [C] |
| Dump | Design (unbuilt) | [`../../context/PLAN.md`](../../context/PLAN.md) | High as design, not as shipped [C] |
| Installed types | Pi 0.84.2 ExtensionAPI | `.../pi-coding-agent/dist/core/extensions/types.d.ts` | High [C] |
| Installed types | ImageContent | `.../pi-ai/dist/types.d.ts` | High [C] |
| Repo skill | sk-communication housing | `.opencode/skills/sk-communication/SKILL.md` | High [C] |
| Repo pin | Pi extensions live-load | `cli-pi/references/native-skills-and-extensions.md` | High [C] |
| npm types | `@opencode-ai/plugin` 1.17.15 | not installed in this workspace | Unknown [U] |
<!-- /ANCHOR:executive-overview -->

---

<!-- ANCHOR:core-architecture -->
## 4. CORE ARCHITECTURE

### System Components

#### Component 1: Python vision runtime
**Purpose**: Own model lifecycle and image ops.

**Responsibilities**:
- Lazy-load Moondream, serve NDJSON methods, unload GPU
- OCR, query, detect, point, crop, zoom, colors, diff, annotate, hash_search, reverse

**Dependencies**:
- Python 3.10–3.14 or `uv`; `moondream`; Pillow

**Key APIs/Interfaces**:
```text
Request : {"id": int, "method": str, "params": {...}}
Response: {"id": int, "result": {...}} | {"id": int, "error": {"code": str, "message": str}}
```
Methods listed in `runtime.py` header: ping, status, load, unload, query, caption, scene, detect, point, segment, ocr, metadata, crop, zoom, colors, diff, annotate, hash_search, reverse, shutdown. [C] `../../context/python/runtime.py` lines 19-39.

---

#### Component 2: TypeScript RuntimeClient + PhotonProvider
**Purpose**: Spawn Python, download HTTP images, expose `VisionProvider`.

**Responsibilities**:
- Auto-provision venv under cache dir
- Map tool requests to RPC methods
- Normalize bboxes

**Dependencies**: Node child_process; no OpenCode import in `runtime/` or `providers/` [C] file list.

---

#### Component 3: OpenCode adapter
**Purpose**: Register `senses_*` tools and auto-inspect attachments.

**Responsibilities**:
- `Plugin` factory: tools, `event` preload, `chat.message` inject, `dispose`
- Materialize clipboard data URLs to temp files

**Key APIs**: `@opencode-ai/plugin` `Plugin` and `tool()` as used in `plugin.ts` / `tools.ts`. [C] dump. Exact published `.d.ts` [U] (package not installed here).

---

#### Component 4: Pi adapter (planned)
**Purpose**: Same core, Pi-native tools and optional image auto-inspect.

**Responsibilities**:
- `ExtensionFactory` default export
- `pi.registerTool(ToolDefinition)`
- `pi.on("input", ...)` may transform text/images

**Key APIs**: [C] `ToolDefinition` at types.d.ts ~344-377; `registerTool` ~902; `InputEvent` ~628-638.

### Data Flow

```
User image -> host adapter -> PhotonProvider -> RuntimeClient -> runtime.py -> evidence string -> model context
```

**Flow Steps**:
1. Host receives path, data URL, or `ImageContent`
2. Provider resolves to a local file or data source
3. RPC method runs (or metadata/colors without the model)
4. `context-builder.ts` wraps output in untrusted-observation guards

### Integration Points

**External Systems**:
- **Hugging Face**: weight download on first load [C] README
- **Yandex**: only `senses_reverse` provider `yandex` [C] README Privacy
- **OpenCode / Pi**: host adapters only

**Internal Modules**:
- **sk-vision skill** (later): advisor identity and SYNC to `.opencode/plugins` / `.pi/extensions`
- **system-spec-kit**: this packet

### Dependencies

| Dependency | Version | Purpose | Critical? | Alternative |
|------------|---------|---------|-----------|-------------|
| moondream | as Senses pins | Local VLM | Yes | Other VisionProvider later |
| @opencode-ai/plugin | 1.17.15 in dump | OpenCode tools | Yes for OC | — |
| @earendil-works/pi-coding-agent | 0.84.2 installed | Pi extension API | Yes for Pi | MCP/bash fallback |
| bun | >=1.0 dump engines | Upstream build | No for fork | node/tsup later |
<!-- /ANCHOR:core-architecture -->

---

<!-- ANCHOR:technical-specifications -->
## 5. TECHNICAL SPECIFICATIONS

### API Documentation

#### Endpoint/Method 1: JSON-RPC `ocr`

**Purpose**: Exact text from an image.

**Signature**:
```json
{"id":1,"method":"ocr","params":{"source":{"type":"path","path":"..."},"kind":"all"}}
```

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| source | path or data | Yes | — | Image |
| kind | all/code/error | No | all | Filter |

**Returns**: `{ "text": "..." }` then wrapped by context-builder.

---

### Attribute Reference

| Attribute | Type | Default | Description | Valid Values |
|-----------|------|---------|-------------|--------------|
| SENSES_MODEL | string | moondream2 | VLM id | moondream2, moondream3.1-9B-A2B |
| Proposed SK_VISION_MODEL | string | moondream2 | Rebrand | same |

### Event Contracts

#### Event 1: OpenCode `message.part.updated`

**Trigger**: Image part attached to a draft [C] `plugin.ts` event hook.

**Payload**: plugin reads `event.properties.part`; fire-and-forget preload.

**Listeners**: `AttachmentInjector.preload`

#### Event 2: Pi `input`

**Trigger**: User submits prompt [C] `InputEvent`.

**Payload**:
```ts
{ type: "input", text: string, images?: ImageContent[], source: "interactive"|"rpc"|"extension" }
```

**Listeners**: planned sk-vision extension; may `{action:"transform", text, images}`.

### State Management

**State Structure**: Python `MODEL_STATE` dict in `runtime.py` (loaded flag, device, request_count).

**State Transitions**:
```
IDLE -> REQUEST -> LOAD -> INFERENCE -> CACHE -> IDLE -> UNLOAD
```

**State Persistence**: weights in HF cache; venv in `SENSES_VENV_DIR`; no evidence DB shipped.
<!-- /ANCHOR:technical-specifications -->

---

<!-- ANCHOR:constraints-limitations -->
## 6. CONSTRAINTS & LIMITATIONS

### Platform Limitations
- **GPU**: NVIDIA Ampere+ or Apple Silicon; 6 GB for default model [C] README Requirements
- **OS**: Linux, Windows AMD64, macOS [C] README

### Security Restrictions
- **Prompt injection**: image text must stay observation [C] `context-builder.ts` `INJECTION_GUARD`
- **Remote upload**: Yandex reverse search only when called [C] README Privacy

### Performance Boundaries
- **First call**: downloads weights ~3.9 GB plus venv [C] README
- **Warm calls**: README claims typically sub-second [I] not measured here
- **OpenCode inject**: 2s grace, never full GPU await [C] `attachments.ts`

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge | Notes |
|---------|--------|---------|--------|------|-------|
| N/A CLI skill | — | — | — | — | No browser UI |

Legend: N/A

### Rate Limiting
- **API Rate Limits**: none for local Photon; HF download may throttle without `HF_TOKEN` [C] README
- **Throttling Strategy**: optional token
- **Backoff Strategy**: operator retries provision
<!-- /ANCHOR:constraints-limitations -->

---

<!-- ANCHOR:integration-patterns -->
## 7. INTEGRATION PATTERNS

### Third-Party Service Integration

#### Service 1: OpenCode plugin load

**Purpose**: Discover the plugin from `opencode.json` `plugin` array.

**Integration Approach**:
```json
{ "plugin": ["./src/plugin.ts"] }
```
[C] `../../context/opencode.json`

**Configuration**: `enabled`, `autoInspect`, `reverseSearch`, `fetchTimeoutMs` [C] README Configuration

**Error Handling**: tool execute returns `SENSES_ERROR (...)` strings [C] `tools.ts` `fail()`

---

### Authentication Handling

**Authentication Method**: none for local inference. Optional `HF_TOKEN`, `MOONDREAM_API_KEY` for hosted/finetune [C] README.

**Implementation**: env vars only; do not commit secrets.

**Token Management**:
- Storage: operator environment
- Refresh: N/A
- Expiration: N/A

### Error Management

**Error Categories**:
| Category | HTTP Code | Handling Strategy | User Message |
|----------|-----------|-------------------|--------------|
| DEPENDENCY_MISSING | n/a | tell operator to provision | structured SENSES_ERROR |
| INVALID_INPUT | n/a | require path or image | structured SENSES_ERROR |
| Invalid Pi export | n/a | session fail-closed | startup error [C] cli-pi pin |

**Error Handling Pattern**:
```ts
return `SENSES_ERROR (${code}): ${message}`;
```

### Retry Strategies

**Retry Configuration**:
- Max Retries: client reconnect in RuntimeClient [I] from client.ts comment
- Initial Delay: not specified [U]
- Max Delay: tool `timeoutMs` default 120s [C] client.ts constructor
- Backoff Factor: [U]

**Retry Logic**: research does not re-implement; later child copies RuntimeClient.
<!-- /ANCHOR:integration-patterns -->

---

<!-- ANCHOR:implementation-guide -->
## 8. IMPLEMENTATION GUIDE

This child does not ship HTML/CSS. Later adapters follow these host recipes.

### Markup Requirements

**HTML Structure**: N/A. Evidence is text blocks, not DOM.

**Required Attributes**: N/A

**Accessibility Requirements**: TUI toasts on OpenCode via `input.client.tui.showToast` [C] `plugin.ts`; Pi tool `label`/`description` for the model [C] ToolDefinition.

---

### JavaScript Implementation

**Initialization** (Pi, planned):
```ts
export default function (pi: ExtensionAPI) {
  pi.registerTool(inspectTool);
  pi.on("input", async (event) => {
    if (!event.images?.length) return { action: "continue" };
    return { action: "continue" }; // bounded preload, do not block
  });
}
```

**Core Logic**: call PhotonProvider, return `contextBuilder.render*`.

**Event Handlers**: OpenCode `event` + `chat.message`; Pi `input` + optional `before_agent_start` (also has `images`).

**Cleanup**: OpenCode `dispose` closes RuntimeClient [C] plugin.ts; Pi session_shutdown should close the same client [I].

---

### CSS Specifications

**Required Styles**: N/A CLI.

**Responsive Breakpoints**: N/A

**Dark Mode Support**: N/A

---

### Configuration Options

| Option | Type | Default | Description | Example |
|--------|------|---------|-------------|---------|
| autoInspect | boolean | true | Inject evidence on attach | false |
| python | string | auto | Interpreter | /path/to/python |
| reverseSearch | auto/always | auto | Local hash on inspect | always |

**Configuration Example**: see README plugin options [C] `../../context/README.md`.
<!-- /ANCHOR:implementation-guide -->

---

<!-- ANCHOR:code-examples -->
## 9. CODE EXAMPLES & SNIPPETS

### Initialization Patterns

#### Pattern 1: Basic Initialization
OpenCode: `"plugin": ["sk-vision"]` after the package exists.

#### Pattern 2: Advanced Initialization with Options
```json
{ "plugin": [["sk-vision", { "autoInspect": false }]] }
```

---

### Helper Functions

#### Helper 1: makeImageSource
**Purpose**: path or data URL to `ImageSource` [C] `tools.ts`.

```ts
if (image) return { type: "data", data: image };
if (path) return { type: "path", path };
throw new SensesError("INVALID_INPUT", "...");
```

---

### API Usage Examples

#### Example 1: inspect
`senses_inspect({ path: "bug.png", question: "What error is shown?" })`

#### Example 2: Pi ImageContent
```ts
{ type: "image", data: "<base64>", mimeType: "image/png" }
```
[C] `pi-ai/dist/types.d.ts` ImageContent.

---

### Edge Case Handling

#### Edge Case 1: Clipboard image in OpenCode
**Problem**: stored as data URL in OpenCode DB.

**Solution**: materialize to `/tmp/senses-<hash>.<ext>` [C] `attachments.ts` header comment.

#### Edge Case 2: Pi session with invalid extension
**Problem**: bad default export.

**Solution**: fail-closed at startup [C] cli-pi native-skills-and-extensions.md. Keep factory valid.
<!-- /ANCHOR:code-examples -->

---

<!-- ANCHOR:testing-debugging -->
## 10. TESTING & DEBUGGING

### Test Strategies

**Unit Testing**:
- Dump already has `photon.test.ts` and `python/runtime.test.ts` [C] file list
- Later fork should keep them after rebrand

**Integration Testing**:
- `bun test` in upstream [C] package.json
- Pi: load extension in `pi --offline --approve` like existing `.pi/extensions`

**End-to-End Testing**:
- Attach a screenshot in OpenCode and in Pi
- Deferred to 004/005

### Debugging Approaches

**Common Issues**:
1. **CUDA OOM**: lower `SENSES_KV_CACHE_PAGES` [C] README
2. **PROVISION_FAILED**: delete venv cache and retry [C] README

**Debugging Tools**:
- `SENSES_DEBUG=1` stderr logs [C] README
- `senses_status` tool

**Logging Strategy**:
```ts
if (process.env.SENSES_DEBUG === "1") process.stderr.write(...)
```

---

### E2E Test Examples

#### Test 1: status tool
**Scenario**: runtime reachable without analyzing an image.

```text
Call senses_status / sk_vision_status; expect provider, device, loaded flag.
```

**Expected Result**: structured health, not a crash.

---

### Diagnostic Tools

**Built-in Diagnostics**: `status` RPC method [C] runtime.py

**Console Commands**:
- `python -c "import moondream"`
- `command -v pi`
<!-- /ANCHOR:testing-debugging -->

---

<!-- ANCHOR:performance-optimization -->
## 11. PERFORMANCE OPTIMIZATION

### Optimization Tactics

#### Tactic 1: smallest sufficient op
**Problem**: running detect+ocr+query on every attach wastes VRAM.

**Solution**: auto-inspect = scene + caption + OCR; tools for the rest [C] plugin/tools.

**Implementation**: `senses_inspect` without question uses Promise.all of caption, scene, ocr [C] tools.ts.

**Impact**: not measured here [U]

---

### Benchmarks

| Metric | Before | After | Improvement | Target |
|--------|--------|-------|-------------|--------|
| Warm inference | [U] | [U] | — | README "sub-second" [I] |
| First download | [U] | [U] | — | one-time ~3.9 GB [C] |

**Benchmark Environment**: not run (no GPU invocation this child)

### Rate Limiting Implementation

N/A local runtime; HF download is operator-network bound.

### Caching Strategies

**Cache Levels**:
1. **AttachmentInjector** max 32 entries keyed by path/mtime/size [C] attachments.ts
2. **Fetched URLs** under cache/fetched [C] README
3. **HF weights** under HF_HOME [C] README

**Cache Implementation**: later child copies those maps; rename cache root to `~/.cache/sk-vision`.
<!-- /ANCHOR:performance-optimization -->

---

<!-- ANCHOR:security-considerations -->
## 12. SECURITY CONSIDERATIONS

### Validation Approach

**Input Validation**:
```ts
makeImageSource(path, image) // requires one of the two
```

**Validation Rules**:
| Field | Type | Required | Validation | Error Message |
|-------|------|----------|------------|---------------|
| path/image | string | one of | INVALID_INPUT | SENSES_ERROR |
| bbox | numbers | when crop | normalized 0-1 [C] types.ts | provider error |

### Data Protection

**Sensitive Data Handling**:
- Screenshots stay local by default [C] README Privacy
- Do not log raw media [C] PLAN.md metrics; shipped debug logs are text [I]

**Data Sanitization**:
```
INJECTION_GUARD wraps all model-visible image text
```
[C] `context-builder.ts`

### Spam Prevention

**Prevention Mechanisms**:
- Reverse search remote is explicit [C]
- Fetch timeout `fetchTimeoutMs` default 60s [C] README

**Rate Limiting**: N/A

### Authentication & Authorization

**Authentication Flow**:
```
local GPU; no user login
```

**Authorization Checks**: N/A

**Security Headers**: N/A CLI
<!-- /ANCHOR:security-considerations -->

---

<!-- ANCHOR:future-proofing-maintenance -->
## 13. FUTURE-PROOFING & MAINTENANCE

### Upgrade Paths

**Version Migration**:
| From Version | To Version | Migration Steps | Breaking Changes |
|--------------|------------|-----------------|------------------|
| dump 0.2.0 | sk-vision 0.x | rebrand env/cache | SENSES_* names |
| image-only | PLAN.md phase 2 | new spec | new modalities |

**Backward Compatibility**: do not keep `opencode-senses` npm name.

### Compatibility Matrix

| Feature Version | Platform Version | Compatibility | Notes |
|----------------|------------------|---------------|-------|
| Senses 0.2.0 | OpenCode plugin 1.17.15 | [C] dump package.json | fork baseline |
| Pi adapter | Pi 0.84.2 | [C] types | registerTool + images |
| Pi adapter | older Pi | [U] | re-check types |

### Decision Trees

#### Decision 1: Pi integration
```
Need Pi vision tools?
├─ Yes, native tools -> registerTool extension (ADR-003)
│   └─ Because: types confirm API; repo already uses extensions
└─ Cannot ship extension -> MCP or bash CLI
    └─ Because: worse UX, last resort
```

### SPA Support

**Single Page Application Compatibility**: N/A

**SPA Initialization Pattern**: N/A

**Cleanup for Route Changes**: N/A
<!-- /ANCHOR:future-proofing-maintenance -->

---

<!-- ANCHOR:api-reference -->
## 14. API REFERENCE

### Attributes Table

| Attribute | Type | Default | Required | Description | Example |
|-----------|------|---------|----------|-------------|---------|
| enabled | boolean | true | No | Disable plugin | false |
| autoInspect | boolean | true | No | Inject on attach | true |

### JavaScript API

#### Method 1: `registerTool`

**Description**: Pi first-party custom tool registration.

**Signature**:
```ts
registerTool<TParams>(tool: ToolDefinition<TParams, TDetails, TState>): void
```
[C] types.d.ts ~902

**Parameters**:
- `tool.name` (string): LLM tool name
- `tool.parameters` (TypeBox schema): args
- `tool.execute(...)`: returns `AgentToolResult`

**Returns**: void

**Example**: [`.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts`](../../../../.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts) calls `pi.registerTool(editLinesTool)` [C].

---

### Events Reference

| Event Name | When Triggered | Payload | Cancelable |
|------------|---------------|---------|------------|
| OpenCode event message.part.updated | image attached | part | no; fire-and-forget [C] |
| OpenCode chat.message | submit | parts | await injector with 2s cap [C] |
| Pi input | submit | text, images | transform or handled [C] |
| Pi before_agent_start | after input | prompt, images | [C] types |

**Event Listener Example**: see implementation-guide Pi factory.

### Cleanup Methods

#### Method: `dispose` / session_shutdown

**Purpose**: kill Python child, free GPU.

**Usage**: OpenCode plugin `dispose` -> `client.close()` [C] plugin.ts.

**When to Call**:
- Plugin unload
- Pi session_shutdown [I]
<!-- /ANCHOR:api-reference -->

---

<!-- ANCHOR:troubleshooting-guide -->
## 15. TROUBLESHOOTING GUIDE

### Common Issues

#### Issue 1: upgrade-level.sh failed on this packet

**Symptoms**:
- `Checklist template not found: templates/addendum/level2-verify/checklist.md`

**Possible Causes**:
1. Addendum path no longer ships those files

**Solutions**:
1. Render `checklist.md.tmpl` / `decision-record.md.tmpl` / `research.md.tmpl` with `inline-gate-renderer.sh --level 3`

**Prevention**: do not rely on upgrade-level.sh until addendums exist

---

#### Issue 2: Pi vision tools missing

**Symptoms**:
- Model only has read/bash/edit/write/grep/find/ls

**Possible Causes**:
1. Extension not in `.pi/extensions/`
2. `--no-extensions`
3. Invalid export fail-closed

**Solutions**:
1. Confirm factory default export
2. `pi --extension path/to/sk-vision.ts`

---

### Error Messages

| Error Code/Message | Meaning | Solution | Related Documentation |
|-------------------|---------|----------|----------------------|
| DEPENDENCY_MISSING | no moondream | provision or SENSES_PYTHON | README |
| INVALID_INPUT | no path/image | pass one | tools.ts |
| INVALID extension | bad factory | fix default export | cli-pi pin |

### Solutions & Workarounds

#### Workaround 1: Pi without extension
**Problem**: cannot load TypeScript extensions

**Workaround**:
```bash
python runtime.py  # then call via bash JSON lines
```

**Trade-offs**: no schema, model must shell out
<!-- /ANCHOR:troubleshooting-guide -->

---

<!-- ANCHOR:acknowledgements -->
## 16. ACKNOWLEDGEMENTS

### Research Contributors
- OpenCode Senses authors: upstream plugin (MIT)
- cli-pi packet: live-confirmed extension loading
- deep-pi hashlines: live `registerTool` usage

### Resources & References
- `../../context/README.md`: shipped behavior
- Pi 0.84.2 `types.d.ts`: adapter contract

### External Tools & Libraries Used
- `@earendil-works/pi-coding-agent` 0.84.2
- OpenCode Senses 0.2.0 dump
<!-- /ANCHOR:acknowledgements -->

---

<!-- ANCHOR:appendix -->
## APPENDIX

### Glossary
- **Senses**: upstream OpenCode plugin
- **sk-vision**: this project's skill and fork
- **Photon**: Moondream inference runtime used by Senses
- **ImageContent**: Pi `{type:"image", data, mimeType}`

### Related Research
- [decision-record.md](../decision-record.md)
- cli-pi native-skills-and-extensions.md

### Change Log Detail
Initial one-shot research 2026-08-15.
<!-- /ANCHOR:appendix -->

---

<!-- ANCHOR:changelog-updates -->
## CHANGELOG & UPDATES

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-08-15 | 1.0.0 | Initial research completed | cursor-grok |

### Recent Updates
- 2026-08-15: Locked housing, fork baseline, Pi registerTool, MIT rebrand
<!-- /ANCHOR:changelog-updates -->
