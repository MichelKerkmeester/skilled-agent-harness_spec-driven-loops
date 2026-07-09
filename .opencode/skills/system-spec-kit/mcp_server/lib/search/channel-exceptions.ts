// ───────────────────────────────────────────────────────────────
// MODULE: Channel Exceptions
// ───────────────────────────────────────────────────────────────

interface ChannelException {
  channel: string;
  reason: string;
  source: string;
}

const MAX_CHANNEL_EXCEPTION_REASON_LENGTH = 160;

function clampChannelExceptionReason(reason: string): string {
  const normalized = reason.trim();
  if (normalized.length <= MAX_CHANNEL_EXCEPTION_REASON_LENGTH) return normalized;
  return `${normalized.slice(0, MAX_CHANNEL_EXCEPTION_REASON_LENGTH - 1)}…`;
}

function appendChannelException(
  target: ChannelException[] | undefined,
  channel: string,
  reason: string,
  source: string,
): ChannelException {
  const entry: ChannelException = {
    channel,
    reason: clampChannelExceptionReason(reason),
    source,
  };

  if (target) {
    const duplicate = target.some((existing) => (
      existing.channel === entry.channel
      && existing.reason === entry.reason
      && existing.source === entry.source
    ));
    if (!duplicate) target.push(entry);
  }

  return entry;
}

export {
  type ChannelException,
  appendChannelException,
};
