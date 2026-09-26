import React, { useState } from 'react';

export function Checkout({
  quantity,
  save,
}: {
  quantity: number;
  save: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  async function submit() {
    setSaving(true);
    try {
      await save();
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  }
  return (
    <section>
      <h1>Your order</h1>
      <output aria-label="Order total">{(quantity * 12.5).toFixed(2)}</output>
      <button
        data-testid="checkout"
        aria-label={`Pay for ${quantity} items`}
        disabled={quantity === 0 || saving}
        onClick={submit}
      >
        Pay
      </button>
      {error && <p role="alert">{String('Payment failed. Try again.')}</p>}
    </section>
  );
}
