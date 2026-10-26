// ───────────────────────────────────────────────────────────────────
// MODULE: Repair Hint Order Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';
import { writeRepairHint } from '../lib/validation/orchestrator.js';
import type { ValidationReport } from '../lib/validation/orchestrator.js';

const FIXTURE_FOLDER = 'specs/example-track/001-sample-packet';

// The hint reads only the folder and each entry's rule and status, so the
// fixture carries just those fields rather than a full report whose engine,
// level and summary it would never look at.
function hintOutput(entries: Array<{ rule: string; status: string }>): string {
  const report = { folder: FIXTURE_FOLDER, entries } as unknown as ValidationReport;
  const writeSpy = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
  try {
    writeRepairHint(report);
    return writeSpy.mock.calls.map((call) => String(call[0])).join('');
  } finally {
    writeSpy.mockRestore();
  }
}

describe('repair hint ordering', () => {
  it('offers the apply command before the preview option', () => {
    const lines = hintOutput([{ rule: 'GENERATED_METADATA_DRIFT', status: 'error' }]).split('\n');

    // The repair command is the answer to the failure, so the copyable line has
    // to carry the flag that performs the repair. A hint whose first showing of
    // the command is a dry run leaves the reader to read on before anything is
    // fixed, which is the ordering this test pins.
    const commandIndex = lines.findIndex((line) => line.includes('repair-derived.cjs'));
    expect(commandIndex).toBeGreaterThanOrEqual(0);
    expect(lines[commandIndex]).toContain('--apply');

    // The preview stays available, but only as something offered after the fix.
    const optionalIndex = lines.findIndex((line) => line.includes('Optional'));
    expect(optionalIndex).toBeGreaterThan(commandIndex);
  });

  it('prints nothing when no recomputable rule failed', () => {
    expect(hintOutput([{ rule: 'GENERATED_METADATA_DRIFT', status: 'pass' }])).toBe('');
  });
});
