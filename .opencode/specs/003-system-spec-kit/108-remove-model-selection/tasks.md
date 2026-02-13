---
title: Tasks — Remove Model Selection Logic
level: 1
status: complete
created: 2026-02-11
---

# Tasks — Remove Model Selection Logic

## Wave 1: MD Command Files

- [x] **T001:** Remove worker model Q from `complete.md` + renumber downstream questions
- [x] **T002:** Remove worker model Q from `plan.md` + renumber downstream questions
- [x] **T003:** Remove worker model Q from `research.md` + renumber downstream questions
- [x] **T004:** Remove worker model Q from `implement.md` + renumber downstream questions
- [x] **T005:** Remove Q2 AI Model + Q4 Worker Model from `debug.md` + renumber + update mermaid diagram

## Wave 2: YAML Asset Files

- [x] **T006:** Clean `spec_kit_complete_auto.yaml` + `spec_kit_complete_confirm.yaml` (worker_model field, config, template lines)
- [x] **T007:** Clean `spec_kit_plan_auto.yaml` + `spec_kit_plan_confirm.yaml` (worker_model template lines)
- [x] **T008:** Clean `spec_kit_research_auto.yaml` + `spec_kit_research_confirm.yaml` (worker_model template lines)
- [x] **T009:** Clean `spec_kit_implement_auto.yaml` + `spec_kit_implement_confirm.yaml` (worker_model template lines)
- [x] **T010:** Clean `spec_kit_debug_auto.yaml` + `spec_kit_debug_confirm.yaml` (worker_model + selected_model + model_selection)

## Wave 3: Verification

- [x] **T011:** Verification grep across all 15 files — zero remaining `worker_model`/`selected_model`/`model_selection` references confirmed
