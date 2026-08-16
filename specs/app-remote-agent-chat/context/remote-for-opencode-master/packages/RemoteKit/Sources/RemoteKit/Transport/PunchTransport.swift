import CryptoKit
import Foundation
import OSLog

/// The wire format of the punched UDP path: punch probes and, once a path is
/// found, the packets of a reliable ordered stream.
///
/// Every packet carries an HMAC keyed by the pairing channel key. That is not
/// about confidentiality — `Wire.SecureChannel` still seals the payloads end
/// to end, exactly as it does over TCP. It is about the fact that a UDP
/// socket open to the internet will receive junk: scanners, stale datagrams
/// from a previous session, and anyone who guesses the port. Without a tag,
/// an off-path attacker who could forge a source address could inject
/// sequence numbers and desynchronise or reset the stream. The tag covers the
/// session id too, so packets from an earlier session can't be replayed into
/// this one.
struct PunchPacket {
    enum Kind: UInt8 {
        /// Punch probe. Sent at every candidate endpoint until one answers,
        /// and periodically thereafter to hold the NAT mapping open.
        case ping = 1
        /// Answer to a ping, sent to the address the ping was *observed*
        /// from — which is the peer's real mapped endpoint.
        case pong = 2
        /// Client asks to start a stream. Retransmitted until the server's
        /// first packet proves it arrived.
        case open = 3
        case data = 4
        case ack = 5
        case fin = 6
    }

    /// Chosen to stay well under any real path MTU once the 49-byte header
    /// and tag are added — fragmented UDP is far likelier to be dropped by
    /// the middleboxes this whole mechanism exists to get through.
    static let payloadLimit = 1100
    private static let headerSize = 17
    private static let tagSize = 32

    var kind: Kind
    /// 0 for punch probes; a random per-stream id afterwards.
    var session: UInt64
    var seq: UInt32
    /// Highest contiguous sequence number the sender has received.
    var ack: UInt32
    var payload: Data

    init(kind: Kind, session: UInt64 = 0, seq: UInt32 = 0, ack: UInt32 = 0, payload: Data = Data()) {
        self.kind = kind
        self.session = session
        self.seq = seq
        self.ack = ack
        self.payload = payload
    }

    func encoded(key: SymmetricKey) -> Data {
        var out = Data(capacity: Self.headerSize + payload.count + Self.tagSize)
        out.append(kind.rawValue)
        withUnsafeBytes(of: session.bigEndian) { out.append(contentsOf: $0) }
        withUnsafeBytes(of: seq.bigEndian) { out.append(contentsOf: $0) }
        withUnsafeBytes(of: ack.bigEndian) { out.append(contentsOf: $0) }
        out.append(payload)
        out.append(Data(HMAC<SHA256>.authenticationCode(for: out, using: key)))
        return out
    }

    /// Nil for anything that isn't a well-formed, correctly tagged packet —
    /// callers drop those silently, since on an open UDP socket they are
    /// noise rather than errors.
    static func decode(_ data: Data, key: SymmetricKey) -> PunchPacket? {
        guard data.count >= headerSize + tagSize else { return nil }
        let body = data.prefix(data.count - tagSize)
        let tag = data.suffix(tagSize)
        guard HMAC<SHA256>.isValidAuthenticationCode(tag, authenticating: body, using: key)
        else { return nil }
        let bytes = [UInt8](body)
        guard let kind = Kind(rawValue: bytes[0]) else { return nil }
        return PunchPacket(
            kind: kind,
            session: Self.uint64(bytes, 1),
            seq: Self.uint32(bytes, 9),
            ack: Self.uint32(bytes, 13),
            payload: Data(bytes[headerSize...])
        )
    }

    private static func uint32(_ b: [UInt8], _ i: Int) -> UInt32 {
        (UInt32(b[i]) << 24) | (UInt32(b[i + 1]) << 16) | (UInt32(b[i + 2]) << 8) | UInt32(b[i + 3])
    }

    private static func uint64(_ b: [UInt8], _ i: Int) -> UInt64 {
        (0 ..< 8).reduce(UInt64(0)) { ($0 << 8) | UInt64(b[i + $1]) }
    }
}

/// A reliable, ordered byte stream over the punched UDP path.
///
/// The phone and Mac already speak a newline-framed JSON protocol designed
/// for a stream (`Wire`), and the handshake in particular depends on order:
/// challenge, then auth, then the sealed `ready`. Datagrams give neither
/// order nor delivery, so this puts back the two properties `Wire` needs and
/// nothing else — no congestion control, no flow control, no half-close.
/// The traffic is one small request and a stream of small events; the whole
/// point is to be simple enough to reason about, since a subtle bug here
/// looks like "the agent stopped talking mid-answer" from the outside.
///
/// Sequence numbers start at 1 in each direction and are per-packet, not
/// per-byte. Acks are cumulative: "I have everything through N".
public final class PunchTransport {
    /// Whether we opened the stream (phone) or accepted it (Mac). Only the
    /// client retransmits `open`.
    enum Role { case client, server }

    /// Delivered on the main queue, in order, as a byte stream — feed
    /// straight into `LineFramer`.
    public var onBytes: ((Data) -> Void)?
    /// Send progress as (bytes the peer has acknowledged, bytes queued),
    /// cumulative over the stream's life, on the main queue. What makes
    /// "Sending your photo… 40%" possible: acks are the only honest
    /// measure of arrival on a lossy path — bytes *sent* say nothing.
    public var onSendProgress: ((Int, Int) -> Void)?
    /// Delivered on the main queue exactly once. Nil reason means the peer
    /// closed cleanly.
    public var onClosed: ((String?) -> Void)?
    /// Called on the transport's own queue whenever the stream ends, however
    /// it ends — the owning service uses it to forget this session.
    var onTeardown: (() -> Void)?

    /// Follows the peer if its mapping moves mid-session — cellular NATs do
    /// rebind, and the packets that arrive from the new address are already
    /// proven authentic by their tag.
    private(set) var peer: PeerEndpoint
    let session: UInt64

    private let socket: UDPSocket
    private let key: SymmetricKey
    private let role: Role
    private let queue: DispatchQueue
    private let logger: Logger
    /// True on the phone, where the socket exists only for this stream and
    /// the socket's receive handler holds this object — closing it on
    /// teardown is what breaks that cycle. False on the Mac, whose one socket
    /// outlives every stream that runs over it.
    private let ownsSocket: Bool

    // Send side.
    private var nextSeq: UInt32 = 1
    private var unacked: [(seq: UInt32, payload: Data, sentAt: Date, attempts: Int)] = []
    private var backlog = Data()
    private var lastSentAt = Date()
    private var queuedBytes = 0
    private var ackedBytes = 0

    // Receive side.
    private var expected: UInt32 = 1
    private var reorder: [UInt32: Data] = [:]
    private var lastHeardAt = Date()
    private var heardFromPeer = false

    private var timer: DispatchSourceTimer?
    private var closed = false

    /// Sender window, in packets. Small on purpose: the payloads are tiny and
    /// a burst larger than this on a freshly punched path just invites loss.
    private static let window = 32
    /// Bound on how far ahead of `expected` we hold out-of-order packets.
    private static let reorderLimit = 128
    private static let minimumRTO: TimeInterval = 0.25
    private static let maximumRTO: TimeInterval = 2.0
    private static let maximumAttempts = 12
    /// No packet of any kind for this long and the path is gone. Generous,
    /// because the Mac may be thinking for a while between events — but the
    /// keepalive below means silence really does mean silence.
    private static let idleTimeout: TimeInterval = 30
    /// Send something at least this often, so a NAT mapping that would expire
    /// during a long model turn stays open.
    private static let keepalive: TimeInterval = 8

    init(
        socket: UDPSocket,
        peer: PeerEndpoint,
        session: UInt64,
        key: SymmetricKey,
        role: Role,
        queue: DispatchQueue,
        logger: Logger,
        ownsSocket: Bool
    ) {
        self.socket = socket
        self.peer = peer
        self.session = session
        self.key = key
        self.role = role
        self.queue = queue
        self.logger = logger
        self.ownsSocket = ownsSocket
    }

    /// Starts the retransmit/keepalive clock. The client also starts sending
    /// `open` here; the server is already open by virtue of having received
    /// one.
    public func start() {
        queue.async { [self] in
            guard timer == nil, !closed else { return }
            if role == .client { transmit(PunchPacket(kind: .open, session: session)) }
            let t = DispatchSource.makeTimerSource(queue: queue)
            t.schedule(deadline: .now() + 0.1, repeating: 0.1)
            t.setEventHandler { [weak self] in self?.tick() }
            t.resume()
            timer = t
        }
    }

    /// Queues bytes for delivery. Safe to call from any queue.
    public func send(_ data: Data) {
        queue.async { [self] in
            guard !closed else { return }
            queuedBytes += data.count
            backlog.append(data)
            drainBacklog()
        }
    }

    /// Clean shutdown: tell the peer, then tear down locally.
    public func close() {
        queue.async { [self] in
            guard !closed else { return }
            transmit(PunchPacket(kind: .fin, session: session))
            finish(reason: nil, notify: false)
        }
    }

    /// Called by the owning service, on `queue`, for every packet that
    /// carries this stream's session id.
    func handle(_ packet: PunchPacket, from source: PeerEndpoint) {
        guard !closed else { return }
        if source != peer {
            let was = peer.text
            logger.notice(
                "peer moved from \(was, privacy: .public) to \(source.text, privacy: .public)"
            )
            peer = source
        }
        lastHeardAt = Date()
        heardFromPeer = true
        acknowledge(through: packet.ack)

        switch packet.kind {
        case .open:
            // A retransmitted open — the client hasn't heard us yet. Our ack
            // rides on every packet, so an empty ack is the cheapest reply.
            transmit(PunchPacket(kind: .ack, session: session, ack: expected - 1))
        case .data:
            receiveData(packet)
        case .ack, .ping, .pong:
            break
        case .fin:
            finish(reason: nil, notify: true)
        }
    }

    // MARK: - Receive

    private func receiveData(_ packet: PunchPacket) {
        if packet.seq >= expected {
            if packet.seq == expected {
                var delivered = packet.payload
                expected += 1
                // A gap that has since been filled by buffered packets.
                while let next = reorder.removeValue(forKey: expected) {
                    delivered.append(next)
                    expected += 1
                }
                if !delivered.isEmpty {
                    // Read the handler at delivery time, not capture time:
                    // the owner installs it on main right after `start()`.
                    DispatchQueue.main.async { [weak self] in self?.onBytes?(delivered) }
                }
            } else if packet.seq < expected + UInt32(Self.reorderLimit) {
                reorder[packet.seq] = packet.payload
            }
        }
        // Ack unconditionally, including for duplicates: a duplicate means
        // the peer never saw our previous ack.
        transmit(PunchPacket(kind: .ack, session: session, ack: expected - 1))
    }

    // MARK: - Send

    private func acknowledge(through ack: UInt32) {
        guard ack > 0 else { return }
        var freed = 0
        unacked.removeAll { entry in
            guard entry.seq <= ack else { return false }
            freed += entry.payload.count
            return true
        }
        if freed > 0 {
            ackedBytes += freed
            // Read the handler at delivery time on main, same discipline
            // as `onBytes` — the owner installs it after `start()`.
            let (acked, queued) = (ackedBytes, queuedBytes)
            DispatchQueue.main.async { [weak self] in
                self?.onSendProgress?(acked, queued)
            }
        }
        drainBacklog()
    }

    private func drainBacklog() {
        while !backlog.isEmpty, unacked.count < Self.window {
            let size = min(backlog.count, PunchPacket.payloadLimit)
            let chunk = backlog.prefix(size)
            backlog = backlog.dropFirst(size)
            let seq = nextSeq
            nextSeq += 1
            unacked.append((seq, Data(chunk), Date(), 1))
            transmit(PunchPacket(
                kind: .data, session: session, seq: seq,
                ack: expected - 1, payload: Data(chunk)
            ))
        }
    }

    private func transmit(_ packet: PunchPacket) {
        socket.send(packet.encoded(key: key), to: peer)
        lastSentAt = Date()
    }

    // MARK: - Clock

    private func tick() {
        guard !closed else { return }
        let now = Date()

        if now.timeIntervalSince(lastHeardAt) > Self.idleTimeout {
            finish(reason: "The connection to your Mac timed out.", notify: true)
            return
        }

        // The client keeps saying `open` until the server answers; without
        // this, a single lost open would hang the whole attempt.
        if role == .client, !heardFromPeer,
           now.timeIntervalSince(lastSentAt) >= Self.minimumRTO {
            transmit(PunchPacket(kind: .open, session: session))
        }

        for index in unacked.indices {
            let entry = unacked[index]
            let rto = min(Self.maximumRTO, Self.minimumRTO * pow(2, Double(entry.attempts - 1)))
            guard now.timeIntervalSince(entry.sentAt) >= rto else { continue }
            guard entry.attempts < Self.maximumAttempts else {
                finish(reason: "Lost the connection to your Mac.", notify: true)
                return
            }
            unacked[index].sentAt = now
            unacked[index].attempts += 1
            transmit(PunchPacket(
                kind: .data, session: session, seq: entry.seq,
                ack: expected - 1, payload: entry.payload
            ))
        }

        if now.timeIntervalSince(lastSentAt) >= Self.keepalive {
            transmit(PunchPacket(kind: .ping, session: session, ack: expected - 1))
        }
    }

    private func finish(reason: String?, notify: Bool) {
        guard !closed else { return }
        closed = true
        timer?.cancel()
        timer = nil
        if let reason { logger.notice("punched stream closed: \(reason, privacy: .public)") }
        if ownsSocket {
            socket.onDatagram = nil
            socket.close()
        }
        onTeardown?()
        // Clear the handlers only after delivering, on the queue that owns
        // them: they hold the object that owns this transport, so leaving
        // them in place would leak the whole connection.
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            if notify { onClosed?(reason) }
            onBytes = nil
            onClosed = nil
        }
    }
}
