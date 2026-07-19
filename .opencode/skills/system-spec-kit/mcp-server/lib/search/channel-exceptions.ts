// ───────────────────────────────────────────────────────────────
// MODULE: Channel Exceptions
// ───────────────────────────────────────────────────────────────

interface ChannelException {
  channel: string;
  reason: string;
  source: string;
}

type ChannelSkipType = 'planned' | 'runtime' | 'exception';

interface ChannelSkipDetail {
  channel: string;
  reason: string;
  type: ChannelSkipType;
}

const MAX_CHANNEL_EXCEPTION_REASON_LENGTH = 160;
const CHANNEL_SKIP_PRECEDENCE: Record<ChannelSkipType, number> = {
  planned: 0,
  runtime: 1,
  exception: 2,
};

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

function appendChannelSkipDetail(
  target: ChannelSkipDetail[],
  detail: ChannelSkipDetail,
): void {
  const existingIndex = target.findIndex((entry) => entry.channel === detail.channel);
  if (existingIndex < 0) {
    target.push({ ...detail });
    return;
  }

  const existing = target[existingIndex];
  if (existing && CHANNEL_SKIP_PRECEDENCE[detail.type] > CHANNEL_SKIP_PRECEDENCE[existing.type]) {
    target[existingIndex] = { ...detail };
  }
}

export {
  type ChannelException,
  type ChannelSkipDetail,
  type ChannelSkipType,
  appendChannelException,
  appendChannelSkipDetail,
};
