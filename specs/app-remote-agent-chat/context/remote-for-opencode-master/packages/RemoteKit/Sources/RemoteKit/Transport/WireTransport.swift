import Foundation
import Network

/// A bidirectional byte stream carrying the `Wire` protocol, independent of
/// how the bytes actually travel.
///
/// There are two: a TCP connection found over Bonjour on the local network,
/// and a punched UDP path that works from anywhere (see Punch). The handshake
/// and every request above this line are identical on both — which is the
/// point, and the reason `Wire` was newline-framed from the start.
public protocol WireTransport: AnyObject {
    /// Delivered on the main queue, in order.
    var onBytes: ((Data) -> Void)? { get set }
    /// Delivered on the main queue at most once. Nil reason means a clean
    /// close rather than a fault.
    var onClosed: ((String?) -> Void)? { get set }
    /// Cumulative (delivered, queued) send bytes, on the main queue. Only
    /// the punched transport reports honestly — it has acks. TCP holds
    /// the property and stays silent, which is fine: the LAN moves a
    /// heavy frame faster than a progress line could be read.
    var onSendProgress: ((Int, Int) -> Void)? { get set }

    func start()
    func send(_ data: Data)
    func close()
}

extension PunchTransport: WireTransport {}

/// The LAN transport: `Wire` over a TCP `NWConnection`.
public final class TCPTransport: WireTransport {
    public var onBytes: ((Data) -> Void)?
    public var onClosed: ((String?) -> Void)?
    /// Never called — see the protocol note.
    public var onSendProgress: ((Int, Int) -> Void)?

    private let connection: NWConnection
    private var finished = false

    public init(_ connection: NWConnection) {
        self.connection = connection
    }

    public func start() {
        connection.stateUpdateHandler = { [weak self] state in
            switch state {
            case let .failed(error):
                self?.finish(error.localizedDescription)
            case .cancelled:
                self?.finish(nil)
            default:
                break
            }
        }
        connection.start(queue: .main)
        receive()
    }

    public func send(_ data: Data) {
        connection.send(content: data, completion: .contentProcessed { _ in })
    }

    public func close() {
        connection.cancel()
    }

    private func receive() {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 64 * 1024) {
            [weak self] data, _, isComplete, error in
            guard let self else { return }
            if let data, !data.isEmpty { onBytes?(data) }
            if isComplete || error != nil {
                connection.cancel()
                finish(error?.localizedDescription)
                return
            }
            receive()
        }
    }

    private func finish(_ reason: String?) {
        guard !finished else { return }
        finished = true
        onClosed?(reason)
        // The handlers hold this connection's owner; keeping them past the
        // close leaks it.
        onBytes = nil
        onClosed = nil
    }
}
