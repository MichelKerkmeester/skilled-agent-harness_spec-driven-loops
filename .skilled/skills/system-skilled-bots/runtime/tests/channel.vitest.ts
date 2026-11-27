// bots channel: the adapter contract, the config entry, the reply table and token redaction.

import { readFileSync, statSync } from 'node:fs';
import { userInfo } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  CAPABILITY_KEYS,
  CAPABILITY_MATRIX,
  CHANNEL_NAMES,
  channelConfigFile,
  checkDeclared,
  readChannelConfig,
  redactToken,
  REPLIES,
} from '../lib/channel.js';
import { fakeTransport, runBots, temporaryStateRoot } from './channel-support.js';
import { cleanupTemp, REAL_CHECKOUT } from './support.js';

import type { ChannelInbound, ChannelOutboundIntent } from '../lib/channel.js';

afterEach(cleanupTemp);

/** The item every reply and intent in this file names. */
const ITEM = '20261125T210504Z-3f9d2b11';

/** The refusal every undeclared operation answers with, whatever the transport. */
const UNSUPPORTED = {
  ok: false,
  error: {
    kind: 'unsupported',
    message: expect.any(String),
    unsupported: true,
    retryable: false,
    sentBeforeError: false,
  },
};

/** A text intent, the one operation every transport declares. */
function textIntent(): ChannelOutboundIntent {
  return { kind: 'text', idempotencyKey: 'k-text', conversationId: '81234567', text: 'hi', itemId: null, choices: null };
}

/** A buttons intent, the operation a transport without buttons must refuse. */
function buttonsIntent(): ChannelOutboundIntent {
  return {
    kind: 'buttons',
    idempotencyKey: 'k-buttons',
    conversationId: '81234567',
    text: 'hi',
    itemId: ITEM,
    choices: ['YES', 'NO'],
  };
}

describe('bots channel', () => {
  it('refuses an undeclared operation', async () => {
    const fake = fakeTransport({ name: 'telegram', capabilities: { buttons: false, receiveText: false, groupKnown: false } });

    const declared = fake.declaredCapabilities();
    for (const key of CAPABILITY_KEYS) expect(declared[key]).toBe(key === 'sendText');

    for (const kind of ['buttons', 'edit', 'react', 'file'] as const) {
      const intent: ChannelOutboundIntent = {
        kind,
        idempotencyKey: `k-${kind}`,
        conversationId: '81234567',
        text: 'hi',
        itemId: kind === 'buttons' ? ITEM : null,
        choices: kind === 'buttons' ? ['YES', 'NO'] : null,
      };
      await expect(fake.send(intent)).resolves.toEqual(UNSUPPORTED);
    }

    const sent = await fake.send(textIntent());
    expect(sent.ok).toBe(true);
    if (sent.ok) {
      expect(Array.isArray(sent.receipt.platformMessageIds)).toBe(true);
      expect(typeof sent.receipt.primaryPlatformMessageId).toBe('string');
    }

    for (const name of CHANNEL_NAMES) {
      expect(CAPABILITY_MATRIX[name].sendText).toBe(true);
      expect(CAPABILITY_MATRIX[name].edit).toBe(false);
      expect(CAPABILITY_MATRIX[name].react).toBe(false);
      expect(CAPABILITY_MATRIX[name].file).toBe(false);
    }

    expect(checkDeclared('signal', CAPABILITY_MATRIX.signal, buttonsIntent())).toEqual(UNSUPPORTED);
    expect(checkDeclared('signal', CAPABILITY_MATRIX.signal, textIntent())).toBeNull();
  });

  it('builds the message model', async () => {
    const fake = fakeTransport({ name: 'telegram' });
    const seen: ChannelInbound[] = [];
    await fake.start({ push: (message) => seen.push(message) });

    const typed = fake.deliver({ text: 'hello', conversation: { id: '81234567', isGroup: false }, sender: { id: '81234567' } });
    expect(Object.keys(typed).sort()).toEqual([
      'actionId',
      'channel',
      'conversation',
      'messageId',
      'raw',
      'replyToId',
      'sender',
      'text',
      'timestampUnixMs',
    ]);
    expect(Object.keys(typed.conversation).sort()).toEqual(['id', 'isGroup']);
    expect(Object.keys(typed.sender)).toEqual(['id']);
    expect(typed.actionId).toBeNull();
    expect(typed.channel).toBe('telegram');
    expect(typeof typed.timestampUnixMs).toBe('number');
    expect(seen).toEqual([typed]);

    const press = fake.deliver({ text: '', actionId: 'approval-v1:20261125T210504Z-3f9d2b11:2' });
    expect(press.actionId).toMatch(/^approval-v1:[0-9TZ-]+[0-9a-f]+:[0-9]+$/);
    expect(press.text).toBe('');

    const intent: ChannelOutboundIntent = {
      kind: 'buttons',
      idempotencyKey: 'notice-20261125T210504Z-3f9d2b11-telegram',
      conversationId: '81234567',
      text: 'Press a button to answer.',
      itemId: ITEM,
      choices: ['email', 'chat'],
    };
    expect(intent.itemId).toBe(ITEM);
    expect(intent.choices).toEqual(['email', 'chat']);

    const sent = await fake.send(intent);
    expect(sent.ok).toBe(true);
    if (sent.ok) {
      expect(Array.isArray(sent.receipt.platformMessageIds)).toBe(true);
      expect(typeof sent.receipt.primaryPlatformMessageId).toBe('string');
    }
    expect(fake.calls).toContainEqual({ op: 'send', intent });
  });

  it('writes the config entry', () => {
    const world = temporaryStateRoot();
    const me = userInfo().username;

    expect(runBots(world, ['channel', 'roster', 'add', me, '--role', 'owner']).status).toBe(0);
    expect(runBots(world, ['channel', 'link', 'telegram']).status).toBe(0);

    const file = channelConfigFile(world.stateRoot, world.identity);
    expect(readChannelConfig(world.stateRoot, world.identity)).toEqual({
      ok: true,
      value: { schemaVersion: 1, channels: { telegram: { secret: 'telegram', enabled: true } } },
    });
    const raw = readFileSync(file, 'utf8');
    expect(JSON.parse(raw)).toEqual({ schemaVersion: 1, channels: { telegram: { secret: 'telegram', enabled: true } } });
    expect(raw).not.toMatch(/token/i);
    expect(statSync(file).mode & 0o777).toBe(0o600);

    expect(runBots(world, ['channel', 'link', 'slack', '--secret', 'team-slack']).status).toBe(0);
    expect(readChannelConfig(world.stateRoot, world.identity)).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        channels: {
          telegram: { secret: 'telegram', enabled: true },
          slack: { secret: 'team-slack', enabled: true },
        },
      },
    });

    expect(runBots(world, ['channel', 'unlink', 'telegram']).status).toBe(0);
    expect(readChannelConfig(world.stateRoot, world.identity)).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        channels: {
          telegram: { secret: 'telegram', enabled: false },
          slack: { secret: 'team-slack', enabled: true },
        },
      },
    });

    const tooLong = runBots(world, ['channel', 'link', 'whatsapp', '--secret', 'a'.repeat(49)]);
    expect(tooLong.status).toBe(4);
    expect(tooLong.stderr).toContain('secret-name-invalid');
    const afterRefusal = readChannelConfig(world.stateRoot, world.identity);
    expect(afterRefusal.ok).toBe(true);
    if (afterRefusal.ok) expect(afterRefusal.value.channels.whatsapp).toBeUndefined();

    expect(runBots(world, ['channel', 'link', 'whatsapp', '--secret', 'a'.repeat(48)]).status).toBe(0);
  }, 120_000);

  it('matches every reply golden', () => {
    const golden = join(
      REAL_CHECKOUT,
      'specs',
      'system-skilled-bots',
      '003-openbot-parity-build',
      '011-messaging-channels',
      '001-channel-ux-and-message-map',
      'design',
      'golden',
    );
    const read = (name: string): string => readFileSync(join(golden, name), 'utf8').replace(/\n$/, '');
    const item = ITEM;

    expect(Object.keys(REPLIES).sort()).toEqual([
      'M07',
      'M08',
      'M09',
      'M10',
      'M11',
      'M12',
      'M13',
      'M14',
      'M15',
      'M16',
      'M17',
      'M18',
      'M19',
      'M20',
    ]);

    expect(REPLIES.M07({ choice: '2', itemId: item, actor: 'ada' })).toBe(read('M07-answer-recorded.txt'));
    expect(REPLIES.M08({ itemId: item })).toBe(read('M08-answer-duplicate.txt'));
    expect(REPLIES.M09({ channel: 'telegram', code: '482913' })).toBe(read('M09-link-code.txt'));
    expect(REPLIES.M10({ actor: 'ada' })).toBe(read('M10-link-confirmed.txt'));
    expect(REPLIES.M11({ channel: 'telegram' })).toBe(read('M11-channel-unlinked.txt'));
    expect(REPLIES.M12({ codesLeft: 2 })).toBe(read('M12-link-code-wrong.txt'));
    expect(REPLIES.M13({ seconds: 247 })).toBe(read('M13-channel-locked.txt'));
    expect(REPLIES.M14({ actor: 'mallory' })).toBe(read('M14-answer-not-approver.txt'));
    expect(REPLIES.M15({ itemId: item, instant: '2026-11-26T21:05:04Z' })).toBe(read('M15-item-expired.txt'));
    expect(REPLIES.M16()).toBe(read('M16-channel-group-approval.txt'));
    expect(REPLIES.M17()).toBe(read('M17-channel-roster-missing.txt'));
    expect(REPLIES.M18({ itemId: item, instant: '2026-11-25T21:06:30Z' })).toBe(read('M18-item-answered-differently.txt'));
    expect(REPLIES.M19({ itemId: item })).toBe(read('M19-item-busy.txt'));
    expect(REPLIES.M20({ highest: 2 })).toBe(read('M20-reply-not-a-choice.txt'));

    expect(REPLIES.M07({ choice: 'NO', itemId: item, actor: 'ada' })).toBe(
      `Answer NO recorded for item ${item} by ada. The run resumes.`,
    );
    expect(REPLIES.M13({ seconds: 0.2 })).toContain('for 1 more seconds');
  });

  it('redacts a token in a URL', () => {
    expect(redactToken('https://api.telegram.org/bot123:abc/getUpdates', '123:abc')).toBe(
      'https://api.telegram.org/bot<redacted>/getUpdates',
    );

    const error = new Error('request to https://api.telegram.org/bot123:abc/sendMessage failed, reason: 123:abc');
    const redacted = redactToken(error.message, '123:abc');
    expect(redacted).toContain('bot<redacted>/sendMessage');
    expect(redacted).not.toContain('123:abc');
    expect(redacted.split('<redacted>')).toHaveLength(3);

    expect(redactToken('no token here', '')).toBe('no token here');
    expect(redactToken('no token here', null)).toBe('no token here');
  });
});
