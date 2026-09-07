# sk-design is not in the compiled-routing closure

Five hubs resolve through a compiled router contract before falling back to the
prose routing in their `SKILL.md`. This one does not.

```
node .opencode/bin/compiled-route.cjs --hub sk-doc    --prompt "write a readme"
  {"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[...],
   "effectivePolicyHash":"ca422b43...","generation":5}

node .opencode/bin/compiled-route.cjs --hub sk-design --prompt "what padding should this have"
  {"servingAuthority":"legacy","hubId":"sk-design"}
```

## What gates membership

Three things, and this hub satisfies none of them.

1. `HUB_CHILD` in the runtime engine lists `sk-code`, `system-deep-loop`,
   `mcp-tooling`, `cli-external-orchestration` and `sk-doc`.
2. `HUBS` in `compiled-route-guard.cjs` lists the same five, so the pre-push gate
   never inspects this hub.
3. A rollout package under `009-parent-hub-rollout/`. Five exist, numbered 001 to
   004 and 007, each carrying `fixtures`, `harness` and `lib`. The two measured
   run about 1,000 lines across 5 files. Numbers 005 and 006 are absent, which is
   consistent with this hub having been dismantled before it was ever rolled out.

`isCanonicalHubId` is only a name-pattern check and passes for `sk-design`, so the
name is not what blocks it.

## What joining would take

The generic compiler at `001-sk-code/lib/registry-compiler.cjs` is the fallback for
a hub without a bespoke one, and it accepts this hub's registry and router shape. A
direct call fails only on `all authored source bytes must be supplied`, which is an
input-assembly problem rather than a structural rejection: the compiler wants the
full authored byte set, not just the two JSON files.

So the work is a rollout package mirroring the five that exist, plus two
registrations. It is not a one-line addition, and it touches runtime shared by every
hub, which is why it is written down here rather than attempted at the end of a long
session.

## Why it matters

Compiled routing is deterministic and replayable; the prose path is neither. The
gate that refuses a push when a hub's compiled inputs stop compiling also does not
watch this hub, so the failure mode that blocked a push earlier in this packet would
go unnoticed here.
