import { describe, expect, it, vi } from 'vitest';

const registerLlmBackfillFnMock = vi.hoisted(() => vi.fn());

vi.mock('../lib/search/graph-lifecycle.js', () => ({
  registerLlmBackfillFn: registerLlmBackfillFnMock,
}));

import { init } from '../lib/search/hybrid-search.js';

describe('LLM graph backfill bootstrap wiring', () => {
  it('registers the LLM backfill callback from the startup search initializer', () => {
    init({} as never, null, null);
    init({} as never, null, null);

    expect(registerLlmBackfillFnMock).toHaveBeenCalledOnce();
    expect(registerLlmBackfillFnMock).toHaveBeenCalledWith(expect.any(Function));
  });
});
