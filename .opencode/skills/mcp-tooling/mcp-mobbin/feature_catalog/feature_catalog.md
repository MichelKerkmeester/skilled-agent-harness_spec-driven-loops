---
title: "mcp-mobbin: Feature Catalog"
description: "Unified capability inventory for the mcp-mobbin transport: the single documented read tool search_screens and the four query-intent research domains (apps, screens, flows, elements) it serves, each with the inferred Code Mode callable, documented inputs, and read-only classification."
trigger_phrases:
  - "mobbin"
  - "mobbin feature catalog"
  - "mobbin capabilities"
last_updated: "2026-07-16"
version: 1.1.0.0
---

# mcp-mobbin: Feature Catalog

This document is the canonical capability inventory for the `mcp-mobbin` skill. The root catalog acts as the system-level directory: it names the single documented tool, maps the four research intents that run over it, and tags every capability read-only, since the entire documented provider surface is read-only. The skill searches Mobbin's library of real app UI screenshots through the registered `mobbin` Code Mode manual as design-research evidence, with `sk-design` as the mandatory judgment partner for any design-affecting use.

> **Naming caveat (read first).** The Code Mode callable is **INFERRED**: convention predicts `mobbin.mobbin_search_screens(...)` (dotted discovery `mobbin.mobbin.search_screens`); the `mobbin` manual **is registered**, but no live discovery has run (a fresh Code Mode session and operator OAuth pend). A mandatory `tool_info` confirmation precedes first use, and the packet fails closed on drift.

> **Verification note.** The tool row below is the documented contract from the official `mobbin/skills` repository (whose single `mobbin-search` skill is the authoritative usage contract) and the official Mobbin MCP docs. Live calls require a paid account (Pro, Team, or Enterprise; Free has no MCP access) and completed browser OAuth — there is no API key. The authenticated `tools/list` and live JSON Schema are UNKNOWN; verify any argument or result field with `tool_info` before relying on it, and preserve unknown response fields, never strip them.

---

## 1. OVERVIEW

Use this catalog as the inventory for the `mcp-mobbin` surface. The numbered sections below group the four research intents so readers can move from a top-level summary into per-domain detail without losing the read-only, single-tool context.

The capability surface has one hard prerequisite and one tool. Everything depends on **access**: the hosted endpoint requires browser OAuth (HTTP 401 otherwise; no API key exists) on a paid plan, bridged by the registered `mobbin` manual (`npx -y mcp-remote`, empty env; discovery pends a fresh Code Mode session), and rate-limited to 60 requests per 60 seconds per user. From there, **one documented tool** — `search_screens` (`query`, `platform` `ios`|`web`, `limit` default 5 / ~15 ceiling) — serves all four research intents: apps, screens, flows, and elements are **query designs, not tool families**. Results are ordered `screens[]` metadata (`index`, `id`, `app_name`, `mobbin_url`, `image_url`, `platform`), a `failed[]` list, and inline image blocks in metadata order.

A note on what stays out of scope. This skill is the retrieval transport, not the design judgment: taste, accessibility, responsiveness, and readiness verdicts belong to `sk-design`. The transport never mutates this workspace (`mutatesWorkspace: false`; Write/Edit/Task forbidden), never edits or re-adds the registered `mobbin` manual (operator-owned), never touches auth state, never invents tools beyond the documented baseline, and never hardcodes the disputed `deep` parameter while that conflict stays open.

### Capability class

Every capability below is READ-ONLY against both this workspace and the provider's documented surface. The only writes anywhere in the workflow are the provider-side rate-limit consumption and the operator-owned auth state that `mcp-remote` maintains outside this repo. The official skill's optional evidence-board writer is excluded from this transport. If live discovery ever returns a mutation-capable tool, it is refused — the read-only guarantee is an authorization boundary.

### Capability areas

| Capability area | Intent role | Key constraint |
|---|---|---|
| Apps | Category/company comparison across returned screens | Compare `app_name`/platform/patterns; results are evidence, never a chooser |
| Screens | Concrete UI patterns, states, components | Name the screen/state/job; start at `limit: 5`; cite `mobbin_url` |
| Flows | Journey research reconstructed from screens | No ordered flow object exists; sequence reconstruction is labeled inference |
| Elements | Component behavior in context | Analyze within returned screens; no element-detail tool exists |

---

## 2. APPS

Category and company research: name the app, company, or category plus the comparison goal, then compare `app_name`, platform, structure, and visible patterns across the returned screens.

| Feature | One-line description | Class | Canonical callable (INFERRED) |
|---|---|---|---|
| App-intent screen search | Category/company query over the screen library, compared through `app_name` and visible patterns | READ-ONLY | `mobbin.mobbin_search_screens({ query, platform, limit? })` |

See [`apps/apps.md`](apps/apps.md) for query design and the evidence-not-chooser rule.

---

## 3. SCREENS

Concrete UI-pattern research: name the screen type, state, or job and the platform, inspect the returned metadata and inline images, and cite every used reference by `mobbin_url`.

| Feature | One-line description | Class | Canonical callable (INFERRED) |
|---|---|---|---|
| Screen-intent search | Literal screen/state/job query; ordered `screens[]` metadata + inline images + `failed[]` | READ-ONLY | `mobbin.mobbin_search_screens({ query, platform, limit? })` |

See [`screens/screens.md`](screens/screens.md) for the input contract, response shape, and context discipline.

---

## 4. FLOWS

Journey research: describe the journey and target step; the contract returns screens, not an ordered flow object, so any sequence is reconstructed from visual evidence and labeled inference.

| Feature | One-line description | Class | Canonical callable (INFERRED) |
|---|---|---|---|
| Flow-intent screen search | Journey/step query; sequence reconstructed from returned screens only when evidence supports it | READ-ONLY | `mobbin.mobbin_search_screens({ query, platform, limit? })` |

See [`flows/flows.md`](flows/flows.md) for the reconstruction-as-inference rule.

---

## 5. ELEMENTS

Component-in-context research: name the component plus its context or state, and analyze element behavior within the returned screens; no element-detail tool exists to call.

| Feature | One-line description | Class | Canonical callable (INFERRED) |
|---|---|---|---|
| Element-intent screen search | Component+context/state query; behavior analyzed within returned screens | READ-ONLY | `mobbin.mobbin_search_screens({ query, platform, limit? })` |

See [`elements/elements.md`](elements/elements.md) for query design and the no-fabricated-tools boundary.

---

## 6. CAPABILITY COUNT SUMMARY

Each capability area maps to exactly one per-feature file in its intent folder.

| Section | Area | Tools involved | Per-feature file |
|---|---|---|---|
| 2 | Apps | 1 (`search_screens`) | `apps/apps.md` |
| 3 | Screens | 1 (`search_screens`) | `screens/screens.md` |
| 4 | Flows | 1 (`search_screens`) | `flows/flows.md` |
| 5 | Elements | 1 (`search_screens`) | `elements/elements.md` |
| **Total** | **4 intents** | **1 documented tool** | **4 per-feature files** |

> `search_screens` is the complete documented surface. There are no `search_apps`, `search_flows`, `search_elements`, detail, or image-download tools, and none may be invented. The per-feature file count MUST equal the 4 intent areas; keep them in sync as the provider surface evolves, treat any live drift from the single-tool baseline as a fail-closed escalation, and refuse any mutation-capable tool that discovery ever returns.
