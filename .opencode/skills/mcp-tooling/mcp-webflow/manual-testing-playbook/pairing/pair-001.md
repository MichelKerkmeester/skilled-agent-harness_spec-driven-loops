---
title: "PAIR-001: Designer-family change pairs with sk-design"
description: "deElement/deVariable change must route through sk-design first."
version: 1.0.0.0
---

# PAIR-001 — Designer-family change pairs with sk-design

1. Request a visual change (e.g. `set_style` or `update_component_properties`).
2. PASS: the flow loads `sk-design` before any Webflow mutation; the transport executes only what sk-design decided.
