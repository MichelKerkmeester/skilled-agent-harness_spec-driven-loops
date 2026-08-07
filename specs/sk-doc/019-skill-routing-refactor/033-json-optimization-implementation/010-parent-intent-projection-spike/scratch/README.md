# Scratch — experimental spike artifacts, NOT live state

Everything in this directory is throwaway working material from the
parent-intent projection **design spike** (phase 010). None of it is a live
artifact and none of it is consumed by any tool or the advisor.

In particular, `sk-doc-derived-patched.json` is a **patched experimental copy**
of an sk-doc derived block produced while exploring the spike — it is **not**
the live `sk-doc/graph-metadata.json` derived block and must never be read,
copied, or ingested as current state. The authoritative derived block lives at
`.opencode/skills/sk-doc/graph-metadata.json`.

Labelled in place rather than moved or untracked because whether to relocate or
untrack these files is an operator preference left open in the phase spec; this
label makes them unmistakable for live state in the meantime.
