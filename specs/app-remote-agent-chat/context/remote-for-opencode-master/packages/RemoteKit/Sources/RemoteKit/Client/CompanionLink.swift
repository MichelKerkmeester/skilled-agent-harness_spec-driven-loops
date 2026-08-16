import CryptoKit
import Foundation
import Network

/// Where a `CompanionLink` points.
public enum LinkTarget {
    /// The companion server inside this same process, over 127.0.0.1. The
    /// key is `LoopbackTrust`'s — minted at launch, never persisted — so a
    /// workspace works on a Mac with zero pairings.
    case local(SymmetricKey)
    /// The primary paired device, wherever it is: Bonjour on the LAN, the
    /// punched UDP path from anywhere.
    case paired
    /// One specific paired peer — the workspace talking to a chosen Mac.
    case peer(PairedPeer)
}

/// One request to a companion: find a path → Wire handshake → sealed
/// request → stream of sealed events. The single implementation of "talk
/// to the Mac", shared by the phone and the desktop workspace; ported from
/// Tomte with the attachment shaping removed (protocol v1 carries no
/// payloads that need it yet).
///
/// For `.paired`, two paths tried in order:
///
/// 1. **Bonjour + TCP**, when the Mac is on the same network. Several
///    companions can share a LAN — not least this Mac's own server — so
///    discovery yields *candidates* and each gets a brief trial; a refusal
///    or silence advances to the next.
/// 2. **The punched UDP path** (Transport/Punch.swift), which works from
///    anywhere. The devices meet through the address candidates they
///    publish to the user's own CloudKit record; no server of ours.
///
/// The handshake and everything above it are identical on every path, so
/// the rest of this file doesn't know or care which one it got.
public final class CompanionLink {
    private let target: LinkTarget
    private var browser: NWBrowser?
    private var transport: WireTransport?

    public init(target: LinkTarget = .paired) {
        self.target = target
    }

    /// How long to give the local network before falling back. Bonjour on a
    /// network where the Mac *is* present resolves in well under a second.
    private static let bonjourTimeout: TimeInterval = 2
    /// How long each LAN candidate gets to produce a challenge and a sealed
    /// `ready` before we move on. Short: a companion that is going to
    /// answer, answers immediately.
    private static let lanHandshakeTimeout: TimeInterval = 4
    /// How many discovered companions get a trial before we punch. This
    /// Mac's own server counts as one, so two spare slots cover a desk with
    /// a second Mac on it.
    private static let lanCandidateLimit = 3
    /// The punched path has already proved it carries packets by the time we
    /// hold a transport; this only waits out retransmission on a lossy link.
    private static let punchedHandshakeTimeout: TimeInterval = 15

    /// "iPhone" or "Mac" — the word for the device this code is running on.
    private static var selfNoun: String {
        #if os(iOS)
        "iPhone"
        #else
        "Mac"
        #endif
    }

    public func cancel() {
        browser?.cancel()
        browser = nil
        transport?.close()
        transport = nil
    }

    /// Runs the full exchange. Local problems (unpaired, no path, impostor)
    /// surface as `failed` events so callers have one error path.
    public func run(_ request: Wire.Request) -> AsyncStream<Wire.Event> {
        AsyncStream { continuation in
            switch self.target {
            case let .local(key):
                Task { @MainActor in
                    await self.runLocal(key: key, request: request, continuation: continuation)
                }
            case .paired:
                guard let peer = PairingStore.primary,
                      let channelKey = try? PairingStore.channelKey(for: peer) else {
                    self.fail(
                        "This \(Self.selfNoun) isn't paired with a Mac yet.",
                        continuation
                    )
                    return
                }
                Task { @MainActor in
                    // The shared client, not forPeer(_:): the phone calls
                    // PunchClient.shared.invalidate() on foregrounding, and
                    // that must hit the instance that actually dials.
                    await self.runPaired(
                        peer, punch: PunchClient.shared, channelKey: channelKey,
                        request: request, continuation: continuation
                    )
                }
            case let .peer(peer):
                guard let channelKey = try? PairingStore.channelKey(for: peer) else {
                    self.fail(
                        "The pairing with \(peer.name) is broken — pair the two Macs again.",
                        continuation
                    )
                    return
                }
                Task { @MainActor in
                    await self.runPaired(
                        peer, punch: PunchClient.forPeer(peer), channelKey: channelKey,
                        request: request, continuation: continuation
                    )
                }
            }
            continuation.onTermination = { [weak self] _ in
                Task { @MainActor in self?.cancel() }
            }
        }
    }

    /// The loopback path: no discovery, no punching, no pairing — just this
    /// process's own server on the local port.
    @MainActor
    private func runLocal(
        key: SymmetricKey,
        request: Wire.Request,
        continuation: AsyncStream<Wire.Event>.Continuation
    ) async {
        let endpoint = NWEndpoint.hostPort(host: "127.0.0.1", port: .init(rawValue: Wire.port)!)
        let lan = TCPTransport(NWConnection(to: endpoint, using: .tcp))
        transport = lan
        switch await exchange(
            over: lan, channelKey: key, request: request,
            continuation: continuation,
            deadline: Self.lanHandshakeTimeout, constrained: false
        ) {
        case .committed:
            return
        case let .refused(event):
            continuation.yield(event)
            continuation.yield(Wire.Event(kind: "done"))
            continuation.finish()
        case .dead:
            discard(lan)
            fail("Couldn't reach the agent server on this Mac.", continuation)
        }
    }

    /// The paired path: LAN candidates on trial first, then the punch.
    @MainActor
    private func runPaired(
        _ peer: PairedPeer,
        punch: PunchClient,
        channelKey: SymmetricKey,
        request: Wire.Request,
        continuation: AsyncStream<Wire.Event>.Continuation
    ) async {
        // The LAN first, but only on trial: finding a companion over
        // Bonjour is not the same as being able to talk to it, and until
        // the conversation actually starts the punch stays in reserve. A
        // refusal is remembered, not surfaced — it may simply be the wrong
        // Mac answering first.
        var refusal: Wire.Event?
        for endpoint in await bonjourEndpoints() {
            let lan = TCPTransport(NWConnection(to: endpoint, using: .tcp))
            transport = lan
            switch await exchange(
                over: lan, channelKey: channelKey, request: request,
                continuation: continuation,
                deadline: Self.lanHandshakeTimeout, constrained: false
            ) {
            case .committed:
                return
            case let .refused(event):
                refusal = event
                discard(lan)
            case .dead:
                discard(lan)
            }
        }
        switch await punch.open() {
        case let .success(punched):
            transport = punched
            switch await exchange(
                over: punched, channelKey: channelKey, request: request,
                continuation: continuation,
                deadline: Self.punchedHandshakeTimeout, constrained: true
            ) {
            case .committed:
                return
            case let .refused(event):
                discard(punched)
                continuation.yield(event)
                continuation.yield(Wire.Event(kind: "done"))
                continuation.finish()
            case .dead:
                discard(punched)
                if let refusal {
                    continuation.yield(refusal)
                    continuation.yield(Wire.Event(kind: "done"))
                    continuation.finish()
                } else {
                    fail("Couldn't start a conversation with your Mac.", continuation)
                }
            }
        case let .failure(error):
            if let refusal {
                // A Mac on the LAN turned us away by name; that verdict is
                // more useful than the punch's transport error.
                continuation.yield(refusal)
                continuation.yield(Wire.Event(kind: "done"))
                continuation.finish()
            } else {
                fail(error.localizedDescription, continuation)
            }
        }
    }

    /// Every companion visible on this network, discovery order, capped.
    /// Empty rather than an error: finding none is the ordinary case away
    /// from home.
    @MainActor
    private func bonjourEndpoints() async -> [NWEndpoint] {
        await withCheckedContinuation { cont in
            var settled = false
            let params = NWParameters()
            params.includePeerToPeer = true
            let browser = NWBrowser(
                for: .bonjour(type: Wire.bonjourType, domain: nil),
                using: params
            )
            let finish: ([NWEndpoint]) -> Void = { endpoints in
                guard !settled else { return }
                settled = true
                browser.cancel()
                cont.resume(returning: endpoints)
            }
            browser.browseResultsChangedHandler = { results, _ in
                // Settling on the first change loses nothing: a companion
                // that shows up later than its own network's Bonjour flood
                // was not going to win the trial anyway, and waiting the
                // timeout out would cost every request two seconds.
                if !results.isEmpty {
                    finish(Array(results.map(\.endpoint).prefix(Self.lanCandidateLimit)))
                }
            }
            browser.start(queue: .main)
            self.browser = browser
            DispatchQueue.main.asyncAfter(deadline: .now() + Self.bonjourTimeout) { finish([]) }
        }
    }

    /// Stops a transport we're abandoning from ever yielding into the stream
    /// the next attempt is about to use.
    @MainActor
    private func discard(_ transport: WireTransport) {
        transport.onBytes = nil
        transport.onClosed = nil
        transport.onSendProgress = nil
        transport.close()
        if self.transport === transport { self.transport = nil }
    }

    private func fail(_ message: String, _ continuation: AsyncStream<Wire.Event>.Continuation) {
        var e = Wire.Event(kind: "failed")
        e.text = message
        // This failure was made here, not received: the Mac never answered.
        e.local = true
        continuation.yield(e)
        continuation.yield(Wire.Event(kind: "done"))
        continuation.finish()
    }

    /// A transport that died with the answer still in flight. Distinct from
    /// `fail` because the two need opposite responses: a failure is a
    /// verdict to show, an interruption is a socket to rebuild — the
    /// overwhelmingly common cause on the phone is iOS suspending the app.
    /// No `done` follows, which is what tells the caller the turn is
    /// unfinished.
    private func interrupt(
        _ message: String?, _ continuation: AsyncStream<Wire.Event>.Continuation
    ) {
        var e = Wire.Event(kind: "interrupted")
        e.text = message
        continuation.yield(e)
        continuation.finish()
    }

    // MARK: - Handshake + streaming

    /// What became of one transport's trial.
    private enum Outcome {
        /// The companion proved itself and the request is away — or a
        /// terminal protocol error was already surfaced. Either way, no
        /// other path should be tried.
        case committed
        /// The companion refused us by name. Another candidate may still be
        /// the right Mac; the caller decides whether the verdict stands.
        case refused(Wire.Event)
        /// Silence, timeout, or a closed socket before commitment.
        case dead
    }

    private enum Stage {
        case awaitingChallenge
        case awaitingReady(Wire.SecureChannel)
        case streaming(Wire.SecureChannel)
        /// The exchange ended on its own terms — the close that follows a
        /// clean `done` isn't the answer being cut off.
        case finished
    }

    /// Runs the handshake and, if it succeeds, streams the answer. Returns
    /// as soon as the outcome is decided, leaving the caller free to try
    /// another path on anything but `.committed`.
    @MainActor
    private func exchange(
        over transport: WireTransport,
        channelKey: SymmetricKey,
        request: Wire.Request,
        continuation: AsyncStream<Wire.Event>.Continuation,
        deadline: TimeInterval,
        constrained: Bool
    ) async -> Outcome {
        await withCheckedContinuation { decided in
            var settled = false
            let decide: (Outcome) -> Void = { outcome in
                guard !settled else { return }
                settled = true
                decided.resume(returning: outcome)
            }
            self.handshake(
                over: transport, channelKey: channelKey,
                request: request, continuation: continuation,
                constrained: constrained, decide: decide
            )
            DispatchQueue.main.asyncAfter(deadline: .now() + deadline) {
                decide(.dead)
            }
        }
    }

    private func handshake(
        over transport: WireTransport,
        channelKey: SymmetricKey,
        request: Wire.Request,
        continuation: AsyncStream<Wire.Event>.Continuation,
        constrained: Bool,
        decide: @escaping (Outcome) -> Void
    ) {
        var framer = LineFramer()
        var stage = Stage.awaitingChallenge
        let clientNonce = Wire.Security.nonce()
        let deviceName = DeviceIdentity.name

        func finish() {
            stage = .finished
            transport.close()
            continuation.finish()
        }

        func handle(_ frame: Data) {
            switch stage {
            case .finished:
                return

            case .awaitingChallenge:
                guard let event = try? JSONDecoder().decode(Wire.Event.self, from: frame),
                      event.kind == "challenge", let serverNonce = event.text
                else {
                    decide(.committed)
                    fail("Your Mac answered in a way this app doesn't understand.", continuation)
                    finish()
                    return
                }
                let auth = Wire.Auth(
                    name: deviceName,
                    nonce: clientNonce,
                    tag: Wire.Security.authTag(
                        channelKey: channelKey, serverNonce: serverNonce,
                        clientNonce: clientNonce, name: deviceName
                    ),
                    compress: true
                )
                guard var data = try? JSONEncoder().encode(auth) else { return }
                data.append(0x0A)
                transport.send(data)
                let sessionKey = Wire.Security.sessionKey(
                    channelKey: channelKey, serverNonce: serverNonce, clientNonce: clientNonce
                )
                stage = .awaitingReady(Wire.SecureChannel(key: sessionKey))

            case let .awaitingReady(channel):
                // Either the sealed `ready` (the Mac's proof of identity) or
                // a plain refusal.
                if let plain = channel.open(frame),
                   let event = try? JSONDecoder().decode(Wire.Event.self, from: plain),
                   event.kind == "ready" {
                    stage = .streaming(channel)
                    // Surface the capabilities to the caller before the
                    // answer, so screens can adapt.
                    continuation.yield(event)
                    // Shaping happens here and not earlier because only now
                    // is it known which path carries this: images get their
                    // smaller transit copy on the punched wire, where every
                    // kilobyte is seconds.
                    let outgoing = constrained ? request.thinned() : request
                    guard let payload = try? JSONEncoder().encode(outgoing) else { return }
                    let body = event.compress == true
                        ? Wire.Squeeze.pack(payload) : payload
                    guard let sealed = channel.seal(body) else { return }
                    transport.send(sealed)
                    decide(.committed)
                    return
                }
                if let event = try? JSONDecoder().decode(Wire.Event.self, from: frame),
                   event.kind == "failed" {
                    // Refused by name. The caller knows whether other
                    // candidates remain; nothing reaches the stream yet.
                    decide(.refused(event))
                    stage = .finished
                    transport.close()
                    return
                }
                decide(.committed)
                fail("Couldn't verify that this is your Mac. Try pairing again.", continuation)
                finish()

            case let .streaming(channel):
                guard let opened = channel.open(frame),
                      let plain = Wire.Squeeze.unpack(opened),
                      let event = try? JSONDecoder().decode(Wire.Event.self, from: plain)
                else {
                    interrupt("The connection to your Mac was interrupted.", continuation)
                    finish()
                    return
                }
                continuation.yield(event)
                if event.kind == "done" { finish() }
            }
        }

        transport.onBytes = { data in
            for frame in framer.push(data) { handle(frame) }
        }
        transport.onClosed = { [weak self] reason in
            if case .streaming = stage {
                stage = .finished
                self?.interrupt(reason, continuation)
            } else {
                decide(.dead)
            }
        }
        transport.start()
    }
}
