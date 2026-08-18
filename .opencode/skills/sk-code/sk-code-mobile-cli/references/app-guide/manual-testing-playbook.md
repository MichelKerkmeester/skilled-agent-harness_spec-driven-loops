---
title: "Pi Remote Manual Testing Playbook — canonical location"
description: "The Pi Remote manual testing playbook is maintained at the app repository root."
version: 1.0.0.0
---

# Pi Remote Manual Testing Playbook (canonical location)

The deterministic per-feature validation scenarios for Pi Remote (one scenario per catalog feature,
each naming a real Vitest regression command and a binary verdict) are maintained at the **app
repository root**:

- `manual-testing-playbook/manual-testing-playbook.md` (in the Pi Remote app repository)

Each scenario cross-references its matching [`feature-catalog.md`](feature-catalog.md) entry. This
surface keeps no duplicate copy.
