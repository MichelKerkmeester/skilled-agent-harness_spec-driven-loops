# cli-classifier shared tier

## 1. OVERVIEW

`shared/` holds packet-shared, workflow-layer helpers that are deliberately non-discoverable: it is
not a packet, carries no `graph-metadata.json`, and never appears in `mode-registry.json`.

It ships two helpers under `scripts/`. `jev-transport.mjs` answers a jev `choice` or `noul` question
through Pi's classifier runtime or the `jev` CLI, and `scorer-report.mjs` holds the report pieces the
classifier scorers share. Scorers in sk-doc, system-deep-loop, system-spec-kit and this hub's
`benchmark/` import them. `scripts/README.md` describes both modules.

---

## 2. DIRECTORY TREE

```text
shared/
├── README.md
└── scripts/
    ├── README.md
    ├── jev-transport.mjs        # Pi-first route with the jev CLI as fallback
    ├── scorer-report.mjs        # Row pin, probability-aware pick, margin and bootstrap lines
    └── tests/
        ├── README.md
        ├── jev-transport.test.mjs
        └── scorer-report.test.mjs
```

Anything a future packet needs in common goes here with its own README, and stays out of the
two-axis packet model by design.
