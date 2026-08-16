import CryptoKit
import Foundation
import OSLog

/// The cross-network path between phone and Mac: UDP hole punching over the
/// candidates both devices publish to their shared CloudKit record.
///
/// This is the mechanism the Phase-0 spike validated on real hardware —
/// cellular phone to a Mac behind a home router, no relay, no VPN, no port
/// forwarding (see pairing-spike/DESIGN.md). What the spike measured, this
/// runs for real: the same STUN-over-the-punch-socket trick, the same
/// tunnel-interface exclusion, the same authenticated probes.
///
/// The shape of the problem, in one paragraph. Two devices behind NATs can
/// each send outbound, and a NAT that has seen an outbound packet to X will
/// let X's reply back in. So if both sides fire packets at the other's public
/// address at roughly the same time, each one's NAT opens for the other and a
/// direct path exists. The hard part is not the punch — it is being ready to
/// punch simultaneously without a server telling both sides "now". Our answer
/// is that the Mac never stops: it holds a door open toward the phone's last
/// known addresses all day (see `PunchListener.pingInterval`), so when the
/// phone dials, the Mac's side is already open.
///
/// What is deliberately absent: a relay. The spike found roughly one network
/// in the tested matrix where symmetric NAT on both ends defeats the punch,
/// and the honest answer there is a TURN-style relay we would have to host.
/// Until that exists, a failed punch reports itself as a failed punch.
enum Punch {
    /// All punch state — sockets, streams, timers — lives on this queue.
    /// Callbacks out to the app hop to main.
    static let queue = DispatchQueue(label: "com.timwilliams.opencodego.punch")
    static let logger = Logger(subsystem: "com.timwilliams.opencodego", category: "punch")

    static func sessionID() -> UInt64 {
        var value: UInt64 = 0
        withUnsafeMutableBytes(of: &value) {
            _ = SecRandomCopyBytes(kSecRandomDefault, 8, $0.baseAddress!)
        }
        // 0 is reserved for punch probes, which belong to no stream.
        return value == 0 ? 1 : value
    }

    /// This device's own candidate list: every non-tunnel LAN address, plus
    /// the reflexive one if STUN has answered. Both are published, because
    /// the same pair of devices is on the same Wi-Fi some of the time and
    /// across the world the rest of it, and neither side knows which.
    static func candidates(localPort: UInt16, reflexive: PeerEndpoint?) -> [String] {
        var out = LocalAddresses.ipv4().map { "\($0):\(localPort)" }
        if let reflexive { out.append(reflexive.text) }
        return out
    }

    static func describe(_ endpoints: [PeerEndpoint]) -> String {
        endpoints.isEmpty ? "none" : endpoints.map(\.text).joined(separator: ",")
    }

    /// Does this rendezvous record belong to the peer we expect?
    ///
    /// It may not. A legacy record's name is fixed per role (`peer-phone`),
    /// so a *second* device of that role signed into the same Apple ID — a
    /// Simulator during development, a family iPad, a replaced handset —
    /// overwrites it wholesale, identity key included. Pairing survives
    /// that, because the channel key each side stores is untouched; the
    /// rendezvous does not. Punching at whatever addresses happen to be in
    /// the record means firing packets at a stranger forever while the real
    /// peer waits.
    ///
    /// So the identity in the record is checked against the peer it should
    /// be, and a mismatch is refused loudly rather than acted on.
    static func recordBelongs(to peer: PairedPeer, record: PeerRecord) -> Bool {
        guard peer.pubKeyAgreement == record.pubKeyAgreement else {
            logger.error("""
            rendezvous record belongs to '\(record.deviceName, privacy: .public)', \
            not the paired '\(peer.name, privacy: .public)' — ignoring its addresses. \
            Re-pair to take the record back.
            """)
            return false
        }
        return true
    }

    /// Where a peer's rendezvous record lives: its own device record under
    /// the modern scheme, the fixed counterpart name under the legacy one.
    static func recordName(for peer: PairedPeer) -> String {
        peer.legacy ? DeviceRole.current.peer.recordName : DeviceID.recordName(for: peer.id)
    }

    /// Serialises candidate writes, newest wins.
    ///
    /// Two publishes are routinely in flight at once — one from the startup
    /// tick, one from STUN answering a few hundred milliseconds later — and
    /// CloudKit does not promise they land in the order they were made. When
    /// the older one lands last it erases the reflexive address, leaving this
    /// device advertising nothing but a LAN address. That is invisible on the
    /// same network and total failure from anywhere else, and it persists
    /// until the next periodic publish two minutes later. Observed: at
    /// 16:48:56 the Mac published `192.168.68.74:49247` *after* the correct
    /// pair, and cellular could not reach it until 16:50:55.
    static let publisher = CandidatePublisher()

    static func publish(
        endpoints: [String], connectRequest: Bool, cloud: PairingCloud
    ) async {
        await publisher.publish(
            endpoints: endpoints, connectRequest: connectRequest, cloud: cloud
        )
    }

    /// Errors are logged rather than swallowed: when the punch fails, "did my
    /// address ever reach the other device" is the first question, and a
    /// silent `try?` here makes it unanswerable.
    fileprivate static func write(
        endpoints: [String], connectRequest: Bool, cloud: PairingCloud
    ) async {
        guard
            let agreement = try? PairingKeyStore.agreementKey(),
            let signing = try? PairingKeyStore.signingKey()
        else {
            logger.error("no keypair on this device — cannot publish candidates")
            return
        }
        var fields: PairingCloud.Fields = [.identity, .endpoints]
        if connectRequest { fields.insert(.connectRequest) }
        do {
            try await cloud.upsertSelf(PeerRecord(
                deviceName: DeviceIdentity.name,
                role: .current,
                pubKeyAgreement: agreement.publicKey.rawRepresentation,
                pubKeySigning: signing.publicKey.rawRepresentation,
                heartbeatAt: Date(),
                endpoints: endpoints,
                connectRequestedAt: connectRequest ? Date() : nil
            // A legacy peer only ever reads the fixed-name record, so our
            // candidates must keep landing there for as long as one exists.
            ), fields: fields, includeLegacy: PairingStore.peers().contains(where: \.legacy))
            logger.notice(
                "published candidates: \(endpoints.joined(separator: ","), privacy: .public)"
            )
        } catch {
            logger.error(
                "publishing candidates failed: \(error.localizedDescription, privacy: .public)"
            )
        }
    }
}

/// One writer for the rendezvous record, so a slow write can never land on
/// top of a newer one. Requests that arrive while a write is in flight are
/// coalesced: only the newest set of endpoints is worth writing, but a
/// connect request is sticky — dropping one would cost the peer its cue to
/// start punching.
actor CandidatePublisher {
    private var inFlight = false
    private var queued: (endpoints: [String], connectRequest: Bool)?

    func publish(endpoints: [String], connectRequest: Bool, cloud: PairingCloud) async {
        guard !inFlight else {
            let stickyRequest = connectRequest || (queued?.connectRequest ?? false)
            queued = (endpoints, stickyRequest)
            return
        }
        inFlight = true
        defer { inFlight = false }
        var job: (endpoints: [String], connectRequest: Bool)? = (endpoints, connectRequest)
        while let next = job {
            await Punch.write(
                endpoints: next.endpoints, connectRequest: next.connectRequest, cloud: cloud
            )
            job = queued
            queued = nil
        }
    }
}

// MARK: - Reflexive address discovery

/// Tracks what STUN says our address looks like from outside, over the same
/// socket the punch will use.
final class ReflexiveProbe {
    private(set) var reflexive: PeerEndpoint?
    private var pendingTxids: [Data] = []

    /// Fires a binding request at each server. DNS resolution blocks, so the
    /// whole thing runs off the punch queue and sends from there.
    func probe(over socket: UDPSocket) {
        for (host, port) in Stun.servers {
            DispatchQueue.global(qos: .utility).async { [weak self] in
                guard let ip = Stun.resolve(host) else { return }
                let (message, txid) = Stun.bindingRequest()
                Punch.queue.async {
                    guard let self else { return }
                    self.pendingTxids.append(txid)
                    if self.pendingTxids.count > 8 { self.pendingTxids.removeFirst() }
                    socket.send(message, toHost: ip, port: port)
                }
            }
        }
    }

    /// Returns true if the datagram was a STUN response (and therefore not a
    /// punch packet). `changed` reports whether our address moved, which is
    /// the cue to republish candidates.
    func consume(_ data: Data) -> (handled: Bool, changed: Bool) {
        for txid in pendingTxids {
            guard let mapped = Stun.parseReflexive(data, txid: txid) else { continue }
            let changed = reflexive != mapped
            reflexive = mapped
            if changed {
                Punch.logger.notice("reflexive endpoint: \(mapped.text, privacy: .public)")
            }
            return (true, changed)
        }
        return (false, false)
    }
}

// MARK: - Mac side

/// The Mac's half of the cross-network path: one long-lived UDP socket that
/// publishes where it can be reached, keeps a hole open toward the phone, and
/// hands accepted streams to `AgentServer`.
///
/// Runs alongside the Bonjour listener rather than replacing it. On the same
/// network the LAN path is faster to establish and involves no CloudKit round
/// trip at all, so the phone still prefers it; this is what happens when the
/// phone is anywhere else.
public final class PunchListener {
    /// Called on the main queue with each accepted stream.
    public var onStream: ((PunchTransport) -> Void)?

    /// Everything the listener knows about one paired peer: its key (which
    /// is also how its packets identify themselves), where to punch, and
    /// how urgently.
    private struct PeerSlot {
        let peer: PairedPeer
        let key: SymmetricKey
        var candidates: [PeerEndpoint] = []
        var urgentUntil = Date.distantPast
    }

    private var socket: UDPSocket?
    private var slots: [PeerSlot] = []
    private let cloud = PairingCloud()
    private let probe = ReflexiveProbe()
    private var streams: [UInt64: PunchTransport] = [:]

    private var nextStunAt = Date.distantPast
    private var nextPublishAt = Date.distantPast
    private var nextPollAt = Date.distantPast
    private var nextPingAt = Date.distantPast
    private var timer: DispatchSourceTimer?
    private var running = false
    private var rejected = 0
    private var lastProbeSource: PeerEndpoint?

    /// How often the Mac re-asks STUN where it is. NAT mappings and public
    /// addresses do change; a stale reflexive candidate is a dead one.
    private static let stunInterval: TimeInterval = 120
    private static let publishInterval: TimeInterval = 120
    /// How quickly the Mac notices the phone wants in. This bounds the
    /// worst-case connect time when the phone has just changed networks and
    /// the Mac has never sent anything to its new address — see the note in
    /// `PunchDialer` about why that case exists.
    private static let pollInterval: TimeInterval = 5
    /// Idle keepalive toward the phone's candidates. Under a minute, because
    /// UDP mappings on consumer routers commonly expire around 30–60s, and
    /// this ping is what makes the Mac's side of the punch already-open when
    /// the phone eventually dials. It costs ~50 bytes.
    private static let pingInterval: TimeInterval = 20
    /// Cadence while the phone is actively dialling.
    private static let urgentPingInterval: TimeInterval = 0.25
    private static let urgentWindow: TimeInterval = 30

    public init() {}

    public func start() {
        // Slots are rebuilt on every start() — RemoteServer re-kicks this
        // whenever the pairing list changes, and a new peer must start
        // being punched at without an app restart.
        let fresh: [PeerSlot] = PairingStore.peers().compactMap { peer in
            guard let key = try? PairingStore.channelKey(for: peer) else { return nil }
            return PeerSlot(peer: peer, key: key)
        }
        Punch.queue.async { [self] in
            let known = Set(slots.map(\.peer.id))
            slots = fresh.map { candidate in
                // Keep what a surviving slot has learned; its candidates
                // took real round trips to earn.
                slots.first { $0.peer.id == candidate.peer.id } ?? candidate
            }
            if running, known != Set(fresh.map(\.peer.id)) {
                nextPollAt = .distantPast
            }
            guard !running else { return }
            // Unpaired: there is nobody to punch to, and no key to
            // authenticate with. The listener starts when pairing completes.
            guard !slots.isEmpty else { return }
            do {
                let socket = try UDPSocket()
                socket.onDatagram = { [weak self] data, host, port in
                    // Already on the socket's queue; hop to ours so all
                    // punch state has a single owner.
                    Punch.queue.async {
                        self?.receive(data, from: PeerEndpoint(host: host, port: port))
                    }
                }
                self.socket = socket
                running = true
                let t = DispatchSource.makeTimerSource(queue: Punch.queue)
                t.schedule(deadline: .now(), repeating: 0.25)
                t.setEventHandler { [weak self] in self?.tick() }
                t.resume()
                timer = t
                Punch.logger.notice(
                    "punch listener up on local port \(socket.localPort(), privacy: .public), \(self.slots.count, privacy: .public) peer(s)"
                )
            } catch {
                Punch.logger.error(
                    "punch listener failed to bind: \(error.localizedDescription, privacy: .public)"
                )
            }
        }
    }

    public func stop() {
        Punch.queue.async { [self] in
            running = false
            timer?.cancel()
            timer = nil
            for stream in streams.values { stream.close() }
            streams.removeAll()
            socket?.onDatagram = nil
            socket?.close()
            socket = nil
        }
    }

    // MARK: Clock

    private func tick() {
        guard running, let socket else { return }
        let now = Date()

        if now >= nextStunAt {
            nextStunAt = now.addingTimeInterval(Self.stunInterval)
            probe.probe(over: socket)
        }
        if now >= nextPublishAt {
            nextPublishAt = now.addingTimeInterval(Self.publishInterval)
            publishCandidates()
        }
        if now >= nextPollAt {
            nextPollAt = now.addingTimeInterval(Self.pollInterval)
            pollPeers()
        }
        if now >= nextPingAt, slots.contains(where: { !$0.candidates.isEmpty }) {
            let urgent = slots.contains { now < $0.urgentUntil }
            nextPingAt = now.addingTimeInterval(
                urgent ? Self.urgentPingInterval : Self.pingInterval
            )
            sendProbes()
        }
    }

    private func sendProbes() {
        guard let socket else { return }
        for slot in slots where !slot.candidates.isEmpty {
            let ping = PunchPacket(kind: .ping).encoded(key: slot.key)
            for candidate in slot.candidates {
                socket.send(ping, to: candidate)
            }
        }
    }

    private func publishCandidates() {
        guard let socket else { return }
        let endpoints = Punch.candidates(
            localPort: socket.localPort(), reflexive: probe.reflexive
        )
        Task { await Punch.publish(endpoints: endpoints, connectRequest: false, cloud: cloud) }
    }

    private func pollPeers() {
        let targets = slots.map(\.peer)
        Task { [cloud] in
            for target in targets {
                let record: PeerRecord?
                do {
                    record = try await cloud.fetchPeer(named: Punch.recordName(for: target))
                } catch {
                    Punch.logger.error(
                        "peer fetch failed: \(error.localizedDescription, privacy: .public)"
                    )
                    continue
                }
                guard let record else { continue }
                guard Punch.recordBelongs(to: target, record: record) else {
                    Punch.queue.async { [weak self] in
                        self?.update(target.id) { $0.candidates = [] }
                    }
                    continue
                }
                let candidates = record.endpoints.compactMap(PeerEndpoint.init)
                let requestedAt = record.connectRequestedAt
                Punch.queue.async { [weak self] in
                    guard let self else { return }
                    update(target.id) { slot in
                        if candidates != slot.candidates {
                            slot.candidates = candidates
                            Punch.logger.notice(
                                "'\(target.name, privacy: .public)' candidates: \(Punch.describe(candidates), privacy: .public)"
                            )
                            // New addresses: don't wait out the idle
                            // interval, the peer may be dialling them now.
                            self.nextPingAt = .distantPast
                        }
                        if let requestedAt,
                           Date().timeIntervalSince(requestedAt) < Self.urgentWindow {
                            if slot.urgentUntil < Date() {
                                let age = Int(Date().timeIntervalSince(requestedAt))
                                let aiming = Punch.describe(slot.candidates)
                                Punch.logger.notice(
                                    "'\(target.name, privacy: .public)' is dialling (request \(age, privacy: .public)s old) — punching at \(aiming, privacy: .public)"
                                )
                            }
                            // From now, not from `requestedAt`: this poll can
                            // be up to `pollInterval` late, and anchoring to
                            // the request time silently spent that lateness
                            // out of the window we punch in.
                            slot.urgentUntil = Date().addingTimeInterval(Self.urgentWindow)
                            self.nextPingAt = .distantPast
                        }
                    }
                }
            }
        }
    }

    private func update(_ peerID: String, _ edit: (inout PeerSlot) -> Void) {
        guard let index = slots.firstIndex(where: { $0.peer.id == peerID }) else { return }
        edit(&slots[index])
    }

    // MARK: Receive

    private func receive(_ data: Data, from source: PeerEndpoint) {
        guard running, let socket else { return }
        let stun = probe.consume(data)
        if stun.handled {
            // Only a *changed* address is worth a CloudKit write; STUN
            // answers arrive on every refresh and mostly say the same thing.
            if stun.changed { publishCandidates() }
            return
        }
        // Which peer sent this is whichever key decodes it — the packet
        // authenticates and identifies in one step. Peers number in the
        // single digits and an HMAC check costs microseconds.
        guard let (packet, key) = decode(data) else {
            // Something reached our socket and wasn't ours. Usually internet
            // background noise, but if it correlates with a dial attempt it
            // means the peer's packets ARE arriving and the key is wrong.
            rejected += 1
            if rejected % 10 == 1 {
                let detail = "\(rejected) so far, latest \(data.count) bytes from \(source.text)"
                Punch.logger.notice(
                    "dropped unauthenticated datagram (\(detail, privacy: .public))"
                )
            }
            return
        }

        if packet.session == 0 {
            // A probe from the phone. Answering it is what opens our NAT for
            // the address it actually arrived from, which may be nothing like
            // the candidate list.
            if packet.kind == .ping {
                if lastProbeSource != source {
                    lastProbeSource = source
                    Punch.logger.notice(
                        "probe from \(source.text, privacy: .public) — answering"
                    )
                }
                socket.send(PunchPacket(kind: .pong).encoded(key: key), to: source)
            }
            return
        }
        if let stream = streams[packet.session] {
            stream.handle(packet, from: source)
            return
        }
        guard packet.kind == .open else { return }
        accept(session: packet.session, from: source, key: key, socket: socket)
    }

    private func decode(_ data: Data) -> (PunchPacket, SymmetricKey)? {
        for slot in slots {
            if let packet = PunchPacket.decode(data, key: slot.key) {
                return (packet, slot.key)
            }
        }
        return nil
    }

    private func accept(
        session: UInt64, from source: PeerEndpoint, key: SymmetricKey, socket: UDPSocket
    ) {
        let stream = PunchTransport(
            socket: socket, peer: source, session: session, key: key,
            role: .server, queue: Punch.queue, logger: Punch.logger, ownsSocket: false
        )
        stream.onTeardown = { [weak self] in self?.streams[session] = nil }
        streams[session] = stream
        stream.start()
        Punch.logger.notice(
            "accepted punched stream from \(source.text, privacy: .public)"
        )
        DispatchQueue.main.async { [onStream] in onStream?(stream) }
    }
}

// MARK: - Phone side

/// The phone's half, and a long-lived one.
///
/// The obvious shape — punch afresh for every request — is wrong here, and
/// expensively so: the phone asks the Mac for index status every 30 seconds
/// (every 3 while indexing), and a CloudKit write plus a STUN round trip plus
/// a punch on that cadence is absurd. So this holds one socket open for the
/// life of the app and remembers the endpoint that last worked.
///
/// A remembered endpoint is never trusted blindly, because NAT mappings die
/// quietly: each request first pings it and waits briefly for an answer,
/// which costs one round trip and turns a stale path into a re-punch instead
/// of a mysterious timeout. Between requests the Mac's own keepalives keep
/// arriving and get answered here, which is usually what keeps the mapping —
/// and therefore the fast path — alive at all.
public final class PunchClient {
    /// The dynamic-target client: dials whatever `PairingStore.primary` is
    /// at the moment of the call. The phone's one instance.
    public static let shared = PunchClient()

    /// One client per explicit peer, created on demand and kept — each
    /// holds a socket, a proven path, and a reflexive probe worth reusing.
    @MainActor private static var registry: [String: PunchClient] = [:]

    @MainActor
    public static func forPeer(_ peer: PairedPeer) -> PunchClient {
        if let existing = registry[peer.id] { return existing }
        let client = PunchClient(fixed: peer)
        registry[peer.id] = client
        return client
    }

    /// Pinned target, nil for the dynamic client.
    private let fixed: PairedPeer?

    private var target: PairedPeer? { fixed ?? PairingStore.primary }

    private enum Dial {
        case idle
        /// Checking whether the remembered endpoint still answers.
        case verifying
        /// Full punch: every candidate the Mac has published.
        case punching
    }

    private var socket: UDPSocket?
    private let cloud = PairingCloud()
    private let probe = ReflexiveProbe()
    private var streams: [UInt64: PunchTransport] = [:]

    /// The endpoint that last answered us.
    private var provenPeer: PeerEndpoint?
    private var candidates: [PeerEndpoint] = []

    private var dial = Dial.idle
    private var waiters: [(Result<PeerEndpoint, PairingError>) -> Void] = []
    private var timer: DispatchSourceTimer?
    private var deadline = Date.distantPast
    private var nextFetchAt = Date.distantPast
    private var nextAnnounceAt = Date.distantPast

    /// How long to wait for the remembered endpoint to answer before giving
    /// up on it. One RTT is typically 20–80 ms; this is generous for cellular
    /// and still barely noticeable.
    private static let verifyWindow: TimeInterval = 1.5
    /// How long to keep punching. Long enough to cover the Mac's poll
    /// interval, since the slow case is the Mac learning this phone's brand
    /// new address before it can punch back.
    private static let attemptWindow: TimeInterval = 45
    private static let probeInterval: TimeInterval = 0.25
    /// The Mac may publish a fresh reflexive candidate seconds into our
    /// attempt; re-read its record while we punch rather than committing to
    /// the list we started with.
    private static let refetchInterval: TimeInterval = 3
    /// How often to restate the connect request during a long attempt. Just
    /// under the Mac's urgent window, so the window never expires mid-punch.
    private static let reannounceInterval: TimeInterval = 12

    private init(fixed: PairedPeer? = nil) {
        self.fixed = fixed
    }

    /// A stream to the peer, or a message fit to show the user.
    public func open() async -> Result<PunchTransport, PairingError> {
        guard let peer = target, let key = try? PairingStore.channelKey(for: peer) else {
            return .failure(.network(
                "This \(DeviceRole.current.noun) isn't paired with a Mac yet."
            ))
        }
        let endpoint: PeerEndpoint
        switch await path(to: peer, key: key) {
        case let .success(found): endpoint = found
        case let .failure(error): return .failure(error)
        }
        return await withCheckedContinuation { cont in
            Punch.queue.async { [self] in
                guard let socket else {
                    cont.resume(returning: .failure(.network("Lost the connection to your Mac.")))
                    return
                }
                let session = Punch.sessionID()
                let stream = PunchTransport(
                    socket: socket, peer: endpoint, session: session, key: key,
                    role: .client, queue: Punch.queue, logger: Punch.logger, ownsSocket: false
                )
                stream.onTeardown = { [weak self] in self?.streams[session] = nil }
                streams[session] = stream
                stream.start()
                cont.resume(returning: .success(stream))
            }
        }
    }

    /// Is there a path to the Mac right now? The same dial as `open`,
    /// stopping short of starting a stream — for the connection indicator,
    /// which wants the answer without giving the Mac a conversation to open
    /// and immediately abandon. A successful check leaves the proven
    /// endpoint behind it, so the next real question skips the search.
    public func reachable() async -> Result<Void, PairingError> {
        guard let peer = target, let key = try? PairingStore.channelKey(for: peer) else {
            return .failure(.network(
                "This \(DeviceRole.current.noun) isn't paired with a Mac yet."
            ))
        }
        return await path(to: peer, key: key).map { _ in () }
    }

    /// Drops the remembered endpoint. Worth calling when the app returns to
    /// the foreground, since iOS will have suspended the socket and the NAT
    /// mapping behind it has probably lapsed.
    public func invalidate() {
        Punch.queue.async { [self] in provenPeer = nil }
    }

    // MARK: Finding a path

    private func path(to peer: PairedPeer, key: SymmetricKey) async -> Result<PeerEndpoint, PairingError> {
        await withCheckedContinuation { cont in
            Punch.queue.async { [self] in
                if socket == nil {
                    do {
                        let fresh = try UDPSocket()
                        fresh.onDatagram = { [weak self] data, host, port in
                            Punch.queue.async {
                                self?.receive(
                                    data, from: PeerEndpoint(host: host, port: port), key: key
                                )
                            }
                        }
                        socket = fresh
                        probe.probe(over: fresh)
                    } catch {
                        cont.resume(returning: .failure(
                            .network("Couldn't open a network connection on this \(DeviceRole.current.noun).")
                        ))
                        return
                    }
                }
                waiters.append { cont.resume(returning: $0) }
                guard dial == .idle else { return } // one dial serves everyone
                if let provenPeer {
                    dial = .verifying
                    deadline = Date().addingTimeInterval(Self.verifyWindow)
                    Punch.logger.notice(
                        "checking remembered path \(provenPeer.text, privacy: .public)"
                    )
                } else {
                    beginPunching(peer)
                }
                startTimer(peer: peer, key: key)
            }
        }
    }

    private func beginPunching(_ peer: PairedPeer) {
        Punch.logger.notice("punching: no remembered path")
        dial = .punching
        deadline = Date().addingTimeInterval(Self.attemptWindow)
        nextFetchAt = .distantPast
        // Re-ask where we are: this socket may have been open for hours, and
        // publishing yesterday's reflexive address punches at nothing.
        if let socket { probe.probe(over: socket) }
        nextAnnounceAt = Date().addingTimeInterval(Self.reannounceInterval)
        announce(peer)
    }

    private func startTimer(peer: PairedPeer, key: SymmetricKey) {
        timer?.cancel()
        let t = DispatchSource.makeTimerSource(queue: Punch.queue)
        t.schedule(deadline: .now(), repeating: Self.probeInterval)
        t.setEventHandler { [weak self] in self?.tick(peer: peer, key: key) }
        t.resume()
        timer = t
    }

    private func tick(peer: PairedPeer, key: SymmetricKey) {
        guard let socket, dial != .idle else { return }
        let now = Date()
        if now >= deadline {
            switch dial {
            case .verifying:
                // The remembered endpoint has gone quiet. Punch properly.
                Punch.logger.notice("remembered path went quiet; re-punching")
                provenPeer = nil
                beginPunching(peer)
            case .punching:
                // The one log line that matters when this fails in the wild:
                // what we aimed at, and what we told the Mac about ourselves.
                let detail = "aimed at \(Punch.describe(candidates)); "
                    + "our reflexive \(probe.reflexive?.text ?? "unknown"); "
                    + "our locals \(LocalAddresses.ipv4().joined(separator: ","))"
                Punch.logger.error(
                    "punch failed after \(Int(Self.attemptWindow), privacy: .public)s — \(detail, privacy: .public)"
                )
                settle(.failure(.network(
                    "Couldn't reach your Mac. Make sure the companion app is running on it and it's awake."
                )))
            case .idle:
                break
            }
            return
        }
        let ping = PunchPacket(kind: .ping).encoded(key: key)
        if dial == .verifying, let provenPeer {
            socket.send(ping, to: provenPeer)
            return
        }
        if now >= nextFetchAt {
            nextFetchAt = now.addingTimeInterval(Self.refetchInterval)
            fetchPeer(peer)
        }
        // Keep saying we want in. The Mac only learns of a dial on its poll,
        // and it punches hard for a fixed window after noticing — so a single
        // announcement at the start of a long attempt lets that window lapse
        // while we are still trying. Re-announcing renews it.
        if now >= nextAnnounceAt {
            nextAnnounceAt = now.addingTimeInterval(Self.reannounceInterval)
            announce(peer)
        }
        for candidate in candidates { socket.send(ping, to: candidate) }
    }

    private func settle(_ result: Result<PeerEndpoint, PairingError>) {
        dial = .idle
        timer?.cancel()
        timer = nil
        let pending = waiters
        waiters = []
        for waiter in pending { waiter(result) }
    }

    /// Publish where we are and that we want in — the Mac's poll picks both
    /// up and starts punching back.
    private func announce(_ peer: PairedPeer) {
        guard let socket else { return }
        let endpoints = Punch.candidates(
            localPort: socket.localPort(), reflexive: probe.reflexive
        )
        Task { await Punch.publish(endpoints: endpoints, connectRequest: true, cloud: cloud) }
        fetchPeer(peer)
    }

    private func fetchPeer(_ target: PairedPeer) {
        Task { [cloud] in
            let record: PeerRecord?
            do {
                record = try await cloud.fetchPeer(named: Punch.recordName(for: target))
            } catch {
                Punch.logger.error(
                    "Mac record fetch failed: \(error.localizedDescription, privacy: .public)"
                )
                return
            }
            guard let record else {
                Punch.logger.error("no Mac record in CloudKit — nothing to punch at")
                return
            }
            guard Punch.recordBelongs(to: target, record: record) else {
                Punch.queue.async { [weak self] in self?.candidates = [] }
                return
            }
            let found = record.endpoints.compactMap(PeerEndpoint.init)
            let age = Int(Date().timeIntervalSince(record.heartbeatAt))
            Punch.queue.async { [weak self] in
                guard let self else { return }
                if found != candidates {
                    let detail = "\(Punch.describe(found)) (heartbeat \(age)s ago)"
                    Punch.logger.notice("Mac candidates: \(detail, privacy: .public)")
                }
                candidates = found
            }
        }
    }

    // MARK: Receive

    private func receive(_ data: Data, from source: PeerEndpoint, key: SymmetricKey) {
        let stun = probe.consume(data)
        if stun.handled {
            // Our reflexive address only just became known; republish so the
            // Mac can aim at it.
            if stun.changed, dial == .punching, let peer = target { announce(peer) }
            return
        }
        guard let socket, let packet = PunchPacket.decode(data, key: key) else { return }

        if packet.session != 0 {
            streams[packet.session]?.handle(packet, from: source)
            return
        }
        switch packet.kind {
        case .ping:
            // The Mac's keepalive. Answering it is what holds our side of the
            // mapping open between requests.
            socket.send(PunchPacket(kind: .pong).encoded(key: key), to: source)
            prove(source)
        case .pong:
            prove(source)
        default:
            break
        }
    }

    /// Anything that arrives from the peer is proof the path works in the
    /// direction that matters — better evidence than any published candidate.
    private func prove(_ peer: PeerEndpoint) {
        if provenPeer != peer {
            provenPeer = peer
            let kind = peer.host.isPrivateIPv4 ? "LAN" : "reflexive"
            Punch.logger.notice(
                "punched path to \(peer.text, privacy: .public) [\(kind, privacy: .public)]"
            )
        }
        if dial != .idle { settle(.success(peer)) }
    }
}
