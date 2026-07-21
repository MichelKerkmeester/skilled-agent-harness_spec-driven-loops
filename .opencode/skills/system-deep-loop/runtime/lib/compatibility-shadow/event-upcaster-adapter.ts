// ───────────────────────────────────────────────────────────────────
// MODULE: Event Upcaster Adapter
// ───────────────────────────────────────────────────────────────────

import { readEvent } from '../event-envelope/index.js';

import type {
  EventReadResult,
  EventTypeRegistry,
  StoredEventBytes,
} from '../event-envelope/index.js';

/** Route historical event bytes through the canonical envelope read boundary. */
export function readCompatibilityEvent(
  input: StoredEventBytes,
  registry: EventTypeRegistry,
): EventReadResult {
  return readEvent(input, registry);
}
