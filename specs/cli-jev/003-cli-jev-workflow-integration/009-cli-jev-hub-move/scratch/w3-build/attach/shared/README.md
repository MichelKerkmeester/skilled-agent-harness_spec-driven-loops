# cli-classifier/shared - packet-shared tier

## 1. OVERVIEW

`shared/` holds packet-shared, workflow-layer helpers that are deliberately non-discoverable: it is
not a packet, carries no `graph-metadata.json`, and never appears in `mode-registry.json`.

This hub currently ships no shared helpers. Its two transports, `cli-usage` (mode `cli-jev`) and
`cli-deem`, each keep their own references and scripts. Anything a future packet needs in common goes
here with its own README, and stays out of the two-axis packet model by design.

---

## 2. RELATED

- [`../SKILL.md`](../SKILL.md) - the hub's routing contract and its two transport modes.
- [`../mode-registry.json`](../mode-registry.json) - the packet registry this folder stays out of.
