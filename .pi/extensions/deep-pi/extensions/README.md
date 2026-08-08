# DeepPi Extension Source

---

## 1. OVERVIEW

Contains the `deeppi.ts` extension entry point and the `deeppi/` implementation subfolder. The entry point wires together stability tracking, telemetry, storm-breaker retry economy, hash-anchored editing, and persistent statistics into a single Pi extension that activates only for `deepseek/deepseek-v4-flash` and `deepseek/deepseek-v4-pro`.

---

## 2. DIRECTORY TREE

```text
extensions/
├── deeppi.ts          # Extension entry point — registers hooks and the /deeppi command
└── deeppi/            # Implementation modules
    ├── eligibility.ts
    ├── hashlines.ts
    ├── stability.ts
    ├── stats.ts
    ├── stormbreaker.ts
    ├── telemetry.ts
    └── utils.ts
```

---

## 3. KEY FILES

| File | Role |
| --- | --- |
| `deeppi.ts` | Default export `deepPi(pi: ExtensionAPI)` that creates stability, telemetry, storm-breaker, and hashline state; registers `session_start`, `model_select`, `session_shutdown` hooks; and registers the `/deeppi` command. Contains `warnOnUnrecognizedModel`, `syncModel`, `buildReport`, `flushStats`, and `errorText` closures. |
| `deeppi/` | Implementation modules for eligibility, hash-anchored editing, prefix stability, statistics persistence, retry economy, telemetry, and shared utilities. See [deeppi/README.md](./deeppi/README.md). |

---

## 4. BOUNDARIES

- `deeppi.ts` imports only from `./deeppi/*.js` and from `@earendil-works/pi-coding-agent`.
- The `deeppi/` modules import from each other and from `node:` built-ins and `@earendil-works/pi-coding-agent`.
- No module in this folder imports from `pi-cache-optimizer` or `shared/`.

---

## 5. RELATED

- [deeppi/ README](./deeppi/README.md)
- [deep-pi README](../README.md)
- [Changes from Upstream](../CHANGES-FROM-UPSTREAM.md)
