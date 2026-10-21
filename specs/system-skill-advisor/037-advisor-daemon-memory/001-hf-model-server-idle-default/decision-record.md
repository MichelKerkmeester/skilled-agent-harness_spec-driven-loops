---
title: "Decision Record: Phase 1: hf-model-server-idle-default"
description: "Why the model server idle timeout defaults to 10 minutes, and why the live check at the default timeout was replaced by the launcher eviction tests."
trigger_phrases:
  - "hf model server idle default decision"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 1: hf-model-server-idle-default

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Default the idle timeout to 10 minutes

<!-- ANCHOR:adr-001-context -->
### Context

Three cold starts on this machine on 2026-10-21 took 20,303 ms, 462 ms and 407 ms to the first embedding. The first run downloaded the model into the new worktree's empty cache under `node_modules/@huggingface/transformers/.cache`, so it measures a first install, not an eviction. A warm embedding took 8 to 10 ms. The loaded server held 462 to 521 MB.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Unset, blank and non-numeric values give a 10-minute timeout. `0` or a negative value keeps the server loaded.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

1. **15 or 30 minutes**: rejected. A reload costs under half a second, so holding about 470 MB longer buys little.
2. **Under 5 minutes**: rejected. A burst of queries with short pauses would reload the model over and over.
3. **Non-numeric values disable eviction**: rejected. A typo would silently bring back the all-day resident cost.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- The first embedding after a 10-minute pause waits about half a second longer.
- An operator who wants the old behaviour sets `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN=0`.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Replace the live default-timeout check with the launcher eviction tests

<!-- ANCHOR:adr-002-context -->
### Context

AC-005 asked for a live launcher to drop its model server after the default timeout. The model server socket `/tmp/system-skill-advisor/hf-embed.sock` is shared by every checkout, and a client embedding only starts it through a launcher that holds spawn authority. A driven embedding from worktree 189 stopped with "no live launcher or model-server spawn authority exists". An advisor query alone starts no model server, because routing does not embed, and eviction skips a server that has never embedded.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

AC-005 is superseded by AC-006. The default is proven by the unit cases in `launcher-model-server-idle-eviction.vitest.ts`. Eviction and the lazy respawn are proven by the case "evicts only after a successful idle embed and re-arms the lazy demand listener" in the same file, which drives the launcher's supervision code with a short timeout.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

1. **Keep AC-005 open**: rejected. Setting up spawn authority by hand would test a contrived setup, not the default.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- No run on this machine has yet shown a launcher-owned model server unloading after 10 real minutes. The first ordinary session that embeds and then idles will show it in `ps`.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->

---
