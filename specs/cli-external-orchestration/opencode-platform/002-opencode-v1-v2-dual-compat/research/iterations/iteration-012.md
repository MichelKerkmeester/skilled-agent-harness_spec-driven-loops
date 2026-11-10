# Iteration 012 — A4c: v2 replacements for the four lost plugin triggers

## Focus

Settle, from primary evidence, whether the events and message reads that four repo plugins depend on exist in OpenCode 2.0.32: `session.idle` (system-completion-sentinel), `session.compacted` (system-skill-advisor), `session.created` + latest-user-prompt read (system-spec-gate), and the same pair for opencode-goal. Iteration 6 concluded from the OpenAPI document that "there is no compaction-completed event", that "for idle there is no event either", and that a grep across event-ish namespaces "returned … **not one native event type name**" [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-006.md:63] [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-006.md:69] [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-006.md:75]. That conclusion was drawn from the wrong artifact.

## Actions Taken

1. Extracted the string tables from the 2.0.32 platform binary (`~/.local/opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe`) and grepped for session-scoped event namespaces.
2. Located two distinct contiguous name tables and read them in full to classify them by contents rather than by guess.
3. Grepped for hook vocabulary (`create.before`, `execute.before`, `execute.after`) and for `SessionStatus` / bare status words.
4. The last grep returned a single over-long line — and that line turned out to be the **bunfs bundle's actual module source**, including the Effect-Schema event definitions, the config schema, and the ACP event reducer. That is the decisive primary artifact for this iteration; the rest of the actions are corroboration of it.
5. Re-read iteration 6's F4 and F5 to state precisely what is overturned and what merely needs amending.

## Findings

### F1 (P0) — `session.idle` and `session.compacted` are first-class v2 event types. Iteration 6's F4 is overturned.

The bundle source defines both with explicit schemas:

```js
var bo=Vt({type:"session.compacted",schema:{sessionID:ka}}),Ro=ur(bo);
…
Mo=Vt({type:"session.idle",schema:{sessionID:ka}}),et=ur(Fo,Mo);
```

and both definition-sets are folded into the union that the host registers:

```js
jo=ur(...pt,…,…et,…Ro,…Eo)
```

`et` = `[session.status, session.idle]`; `Ro` = `[session.compacted]`. So on 2.0.32 both events exist, carry `{sessionID}` payloads, and are part of the registered event vocabulary. **`system-completion-sentinel` ports without a redesign**, and `system-skill-advisor` keeps an event, not just a hook.

### F2 (P0) — `SessionStatus` is a three-way union, and `session.status` is a second, richer idle signal.

```js
Ao=w([n({type:C("idle")}),
     n({type:C("retry"),attempt:ft,message:t,action:b(n({reason,provider,title,message,label,link})),next:ft}),
     n({type:C("busy")})]).annotate({identifier:"SessionStatus"}),
Fo=Vt({type:"session.status",identifier:"SessionStatusUpdated",schema:{sessionID:ka,status:Ao}})
```

`session.status` with `status.type === "idle"` is a *richer* signal than v1's `session.idle`, because the same stream also distinguishes `busy` and `retry` (with `attempt`, `next`, and a structured `action`). A plugin that wants "is the host done *and* did it retry" should read `session.status`, not `session.idle`.

### F3 (P0) — The OpenAPI document's silence about event names is by design, not evidence of absence. Logic-sync resolved.

`/api/event` (iteration 6, operationId `event.subscribe`) carries `V2EventEncoded`, which iteration 6 correctly found resolves to `{type:string, contentMediaType:"application/json"}` — a deliberately untyped envelope. The names therefore *cannot* appear in the document, and their absence there says nothing about the host. Both of iteration 6's statements and this iteration's are true at once; the record to carry forward is: **the contract does not enumerate events, the implementation does, and the implementation is the authority for plugin work.** Iteration 6's F5 stands only as a statement about `v2-openapi.json`; read as a statement about the host it is wrong [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-006.md:75].

### F4 (P0) — `session.execution.*` is emitted and consumed at runtime, with a terminal classification.

The ACP reducer switches on the real stream:

```js
function Ah(e,o,s){switch(o.type){
  case"session.step.started":…
  case"session.step.ended":return{state:{...Vi(e,o.data.tokens),finish:o.data.finish},outputs:[]};
  case"session.step.failed":…
  case"session.execution.succeeded":return{state:e,outputs:[],terminal:"succeeded"};
  case"session.execution.interrupted":return{state:e,outputs:[],terminal:"interrupted"};
  case"session.execution.failed":return{state:{...e,executionError:o.data.error},outputs:[],terminal:"failed"};
```

and `Mh()` maps `session.execution.started` → `status:"running"`, `succeeded` → `completed`, `interrupted` → `interrupted`, `failed` → `failed`. That subscription is `e.client.event.subscribe()`, i.e. the same stream a plugin would consume. `session.execution.succeeded|failed|interrupted` is a **confirmed** turn-completion push signal, and `interrupted` is information v1's `session.idle` never carried.

### F5 (P0) — Compaction has four events, not just a hook.

`session.compaction.started`, `.ended`, `.failed`, and `.delta` are all handled:

```js
case"session.compaction.started":case"session.compaction.ended":case"session.compaction.failed":{
  let y=oh(o,e.compactions,fs(s,a!==void 0)); …}
case"session.compaction.delta":{let y=sh(e.compactions.get(l),o.data.text,…) …}
```

So `session.compacted` is not the only compaction signal — there is a full start/end/fail/delta lifecycle, plus the `context` hook with `SessionRequestKind` that iteration 6 found. Iteration 6's F4 ("compaction is a hook in v2, not an event") is **half wrong**: there is a hook *and* an event family. `system-skill-advisor` gains a choice, not a gap.

### F6 (P1) — Message reading on v2 is `message.list`, not a `session.messages` tree request.

```js
e.message.list({sessionID:s.id,limit:200,cursor:l})   // and order:"asc"
… _((d)=>[d.data,Ds(d.cursor.next)])
```

with route `/api/session/:sessionID/message`. For `system-spec-gate` this replaces the v1 `ctx.client.session.messages({sessionID, path:{id}})` tree request entirely. A plugin can also build a cache from the stream instead of polling, since `session.text.delta` carries `{assistantMessageID, delta}` and `session.tool.success` carries `{sessionID,id,content,metadata}`.

### F7 (P1) — The v2 config key is `plugins`, plural. There is no `plugin` key.

```js
plugins:It.pipe(b).annotate({description:"Ordered plugin enablement directives and external package declarations"}),
```

`It = w([t, re])` where `re` is `Config.Plugin.Entry = {package, options}` — so the value is an array of either a bare string or `{package, options}`. Iteration 8's open question is answered for v2: **v2 reads `plugins`.** A v1-only `plugin` key has no home in `Config.Info` and, given an Effect schema with no such field, is dropped. This is a genuine dual-config divergence, not a tolerance question.

### F8 (P1) — `agents` (plural) is the v2 agent surface, and the agent shape is wider than v1's.

```js
class C1 extends Se("Config.Agent")({model:U$,request:B,system:t,description:t,
  mode:z(["subagent","primary","all"]).pipe(b),hidden:D,color:xt,steps:nr,disabled:D,
  permissions:Cg.pipe(b)})
…agents:G(t,C1)  // plus default_agent:t
```

Note `permissions` (**plural**), the three-value `mode` enum, and `steps`/`hidden`/`color`/`disabled` all existing on the v2 side. Iteration 5's carried questions about those keys are settled for v2: they are real. Whether v1 tolerates them is still open.

### F9 (P1) — One model string can serve v2: `provider/model#variant` is schema-legal.

```js
dt=t.check(Ea(/^[^/#]+\/[^#]+(?:#[^#]+)?$/u))
U$=w([dt,L]).pipe(je(L,{decode:jt((o)=>typeof o==="string"?gt(o):o),encode:Lo({strict:!1})}))
```

The accepted string form and the structured `{providerID, modelID, variant?}` form are the same schema, with `#variant` optional. `opencode -m provider/model#variant` is therefore a legitimate v2 recipe. The v1 leg of that question stays open.

### F10 (P1) — `permission.*` keeps its v1 names; `question.*` does not.

```js
Te=Vt({type:"permission.asked",schema:Ae.fields})   // Ae: id, sessionID, permission, patterns, metadata, always, tool:{messageID,callID}
Ee=Vt({type:"permission.replied",schema:{sessionID,requestID,reply:Fe}})   // Fe = ["once","always","reject"]
```

and questions are `form.*`:

```js
if(o.type==="form.created"&&(o.data.form.sessionID===s.sessionID||l)) …{form:o.data.form…}
…o.type==="form.replied"||o.type==="form.cancelled"?o.data.id:…
```

with `client.session.form.reply({sessionID, formID, answer})` and `.form.cancel({sessionID, formID, message})`. Any plugin branching on `question.*` needs a `form.*` branch on v2. `permission.*` needs none.

### F11 (P2) — Two new observability events worth using rather than reimplementing.

`session.skill.activated` and `session.instructions.updated` are in the registered vocabulary. `system-skill-advisor` currently infers skill activation from prompt text; v2 tells it directly.

### F12 (P2) — `session.inbox.*` is the turn-start gate in v2.

```js
if(o.type==="session.inbox.delivered"&&o.data.inboxID===s.start.id)return{state:{...e,started:!0},outputs:[]};
if(!e.started)return{state:e,outputs:[]};
```

So `session.created` alone is *not* sufficient to know a turn began — the reducer deliberately waits for `session.inbox.delivered`. A `session.created`-triggered plugin that reads the latest user prompt must be prepared for the prompt to not be there yet.

### F13 (P2) — Toast and prompt-append payload shapes are now known.

```js
wo=Vt({type:"tui.toast.show",schema:{title:b(t),message:t,variant:z(["info","success","warning","error"]),duration:nr}})
Uo=Vt({type:"tui.prompt.append",schema:{text:t}})
```

This closes the "what shape does `showToast` take in v2" sub-question for `sk-vision` even though the emit path (event vs `ctx.tui`) is still unverified.

### F14 (P2) — `synthetic` and `ignored` text parts are transcript-only, not prompt text.

```js
tn=n({id:r(m),type:C("text"),text:t,synthetic:r(D),ignored:r(D),time:…,metadata:…})  // SessionV1.TextPartInput
…
let a=s.filter((p)=>p.type!=="text"||!p.synthetic&&!p.ignored),
    l=a.flatMap((p)=>p.type==="text"?[p.text]:[]).join("\n")
```

The prompt builder drops text parts marked `synthetic` or `ignored`. Combined with the `session.synthetic` event and the `POST /api/session/:sessionID/synthetic` route, v2 has a host-authored transcript channel, but it is **not** a way to put text in front of the model. Content injection must go through `context.system` on the session hook. Marking: mechanism confirmed, intended semantics inferred.

### F15 (P2) — `plugin.check` is the sanctioned probe, and the plugin feature set is three-valued.

`plugin.check`, `plugin.list`, `plugin.add`, `plugin.update`, `plugin.updated` exist as RPC/event names, and

```js
ct=n({server:C(!0),tui:C(!0),rpc:C(!0)}).annotate({identifier:"Plugin.Features"})
X$=w([n({status:C("active")}),n({status:C("failed"),error:t,ref:t})]).annotate({identifier:"Plugin.State"})
S3=n({id:WS,source:V$,features:ct,state:X$}).annotate({identifier:"Plugin.Info"})
```

So a plugin is declared with `features: {server, tui, rpc}` and `state: active|failed`. There is **no `hooks` feature flag** — hook registration is not a declared capability, which matters for a uniform dual-version plugin template (v2 will not tell you whether your hooks attached).

## Design: v1 trigger → v2 trigger, per plugin

| Plugin | v1 trigger (today) | v2 trigger (designed) | Strength | Evidence |
|---|---|---|---|---|
| `system-completion-sentinel` | `session.idle` | `session.idle` — **unchanged**; optionally `session.execution.succeeded\|failed\|interrupted` for terminal detail and `session.status` for busy/retry awareness | Confirmed | F1, F2, F4 |
| `system-skill-advisor` | `session.compacted` | `session.compaction.ended` (fires per compaction with a tracked record) or `session.compacted` (still defined); re-inject via `context.system` on the next request | Confirmed | F1, F5 |
| `system-spec-gate` | `session.created` + read latest user prompt | `session.created` (same name) + prompt via `message.list({sessionID, limit, order})`, or read the request parts from the `context` hook; gate readiness on `session.inbox.delivered` | Confirmed | F1, F6, F12 |
| `opencode-goal` | `session.created` / `session.idle` | same names; add `session.step.started/ended` for per-step counters and `session.synthetic` for host-authored entries | Confirmed | F1, F4, F14 |

### Irreducible gaps and residual risks

- **Part-shape divergence, not trigger divergence.** v2's `SessionV1.Part` union adds `compaction`, `subtask`, `step-start`, `step-finish`, `patch`, `snapshot`, `agent`, `retry` and reshapes `tool` state into `pending|running|completed|error`. A plugin that walks message parts needs a per-version branch even though its *trigger* ports cleanly. This is the real dual-compat cost, and it was not visible from the event names alone.
- **`chat.params` / `chat.message` have no event peer** — they are hooks in the plugin surface, not stream events, on both versions. No replacement needed, and none available.
- **`shell.env` did not appear** in any grep (`create.before`, `execute.before`, `execute.after` did). The capability that three repo plugins are suspected of using (carried P1 from iteration 1) remains **UNVERIFIED on v2** — absence of a string is not absence of a feature when the string may be constructed.
- **`tui.toast.show` emit path** — the event and its payload exist; whether a plugin may `emit` it, or must use a `ctx` surface (iteration 3's unverified `ctx.tui`), is still open.
- **Hook attachment is unobservable.** With `features` limited to `{server, tui, rpc}` (F15), v2 gives no signal that a `session.hook` failed to register. A silent hook failure is exactly the class of bug that the v1 `session.idle` outage would produce.

## Questions Answered

- Does v2 emit any compaction event at all, and what should replace `session.compacted`? — **Answered.** `session.compaction.started/ended/failed/delta` exist and are consumed by the runtime; `session.compacted` also still exists. (iteration 4 P0)
- Can `session.idle` be derived reliably from `session.execution.*`? — **Answered, and the premise dissolves.** `session.idle` exists natively; `session.execution.*` is a richer *additional* signal. (iteration 4/6 P0)
- Which v2 event scheme is current — `session.next.*` / `permission.v2.*` or `session.execution.*` / `form.*`? — **Answered.** `session.execution.*` and `form.*`; there is no `session.next.*` and no `permission.v2.*`. (iteration 4 P1)
- `ctx.session.messages(...)` signature vs the v1 tree request — **Answered.** It is `message.list({sessionID, limit, cursor, order})` over `/api/session/:id/message`, returning `{data, cursor:{next}}`. (iteration 3 P0)
- Does v2's loader accept unknown top-level keys on a plugin definition? — **Partly.** `Plugin.Info` is `{id, source, features, state}` with no extension point; `plugin.check` is the sanctioned probe. A per-key verdict is still owed. (iteration 3/6 P0)
- Does v2 honour `plugin` (singular)? — **Answered.** No: `Config.Info` declares `plugins` (plural) and nothing else. (iteration 8 P1)
- Is the event stream native names or RPC frames only? — **Answered.** Native names; iteration 6's finding was about the document's untyped envelope. (iteration 6 P0)
- Does v2 tolerate `provider/model#variant`? — **Answered.** Yes, by schema regex. (iteration 10 P1, v2 half)
- What is `tui.toast.show`'s payload? — **Answered** (`{title?, message, variant, duration?}`); emit path still open. (iteration 3 P1, partial)
- Does v2 accept `mode: all`? — **Answered.** `["subagent","primary","all"]` is the enum. (iteration 5 P1)

## Questions Remaining

- Does **v1 1.19.3** accept `-m provider/model#variant`? The v2 half is now settled (F9); the dual-model-string decision needs the v1 half.
- Is `shell.env` a real v2 hook? Absent from every grep; the string may be constructed at runtime.
- Can a v2 plugin **emit** `tui.toast.show`, or is `ctx.tui` required? (blocks `sk-vision`)
- What exactly does `plugin.check` report for a definition carrying an extra top-level key? One call would settle the whole "uniform definition shape" question.
- Do v1 and v2 both accept `.opencode/plugins/*.js` flat files, given `plugins` is now a *config array* on v2? The v2 config key is a plugin-enablement list, which makes the flat-directory discovery question more urgent, not less — iteration 10's P0 stands.
- What is `Config.Plugin.Entry.package` resolved against — npm, a local path, or both? `It = w([string, {package, options}])` suggests a string form exists but does not say what it names.
- Does the `context` session hook fire for `SessionRequestKind` compaction and title requests, and does appending to `context.system` there survive into the provider prompt? (carried from iteration 6, now the *primary* injection route for two plugins)
- Does v1's event stream include `session.execution.*` (so one subscriber can serve both), or is that family v2-only? New, and cheap to probe.
- All earlier carried questions not listed above remain open.

## Next Focus

A4d — **the flat-plugin discovery question is now the last blocking unknown for the install story.** v2's `plugins` config is an enablement array, not evidence either way about `.opencode/plugins/*.js`; iteration 10's P0 has now survived three iterations. Settle it directly: create a throwaway project outside this repo with `.opencode/plugins/probe.js`, run 2.0.32 `plugin.check` (F15 gives the sanctioned route) or `plugin list`, and record whether the flat file appears as a `Plugin.Source{type:"local", path}` entry. In the same probe, answer the extra-key question by declaring a definition with one unknown top-level key and reading `Plugin.State`. Then close the v1 half of `provider/model#variant` with a single `opencode -m <provider>/<model>#<variant> run --help`-adjacent smoke on 1.19.3.
