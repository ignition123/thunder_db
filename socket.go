package main

<<<<<<< HEAD
// HTTP server with WebSocket endpoint
func Server() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){

		ws, err := NewHandler(w, r)

		if err != nil{
			// handle error
		}

		if err = ws.Handshake(); err != nil {
			// handle error
		}
	});
}
		

// NewHandler initializes a new handler
func NewHandler(w http.ResponseWriter, req *http.Request) (*WS, error) {
	hj, ok := w.(http.Hijacker)
	if !ok {
		// handle error
	}               
}

// Handshake creates a handshake header
func (ws *WS) Handshake() error {

	hash := func(key string) string {
		h := sha1.New()
		h.Write([]byte(key))
		h.Write([]byte("258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))

	return base64.StdEncoding.EncodeToString(h.Sum(nil))
	}(ws.header.Get("Sec-WebSocket-Key"))
}

// Recv receives data and returns a Frame
func (ws *WS) Recv() (frame Frame, _ error) {
	frame = Frame{}
	head, err := ws.read(2)
	if err != nil {
		// handle error
	}
}

// Send sends a Frame
func (ws *WS) Send(fr Frame) error {
	// make a slice of bytes of length 2
	data := make([]byte, 2)

	// Save fragmentation & opcode information in the first byte
	data[0] = 0x80 | fr.Opcode
	if fr.IsFragment {
		data[0] &= 0x7F
	}
}

// Close sends a close frame and closes the TCP connection
func (ws *Ws) Close() error {
    f := Frame{}
    f.Opcode = 8
    f.Length = 2
    f.Payload = make([]byte, 2)
    binary.BigEndian.PutUint16(f.Payload, ws.status)
    if err := ws.Send(f); err != nil {
        return err
    }
    return ws.conn.Close()
}
=======
import (
	"fmt"
	"net"
	"os"
	"time"
)

func main() {
	server, err := net.Listen("tcp", "127.0.0.1:9100")

	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}

	defer server.Close()

	for {

		time.Sleep(1)

		conn, err := server.Accept()

		fmt.Println("connection accepted...")

		if err != nil {
			fmt.Println("Error accepting: ", err.Error())
		}

		defer conn.Close()

	}
}
>>>>>>> a205f1e8464f625c2c213a33f13d1dad8373dca2
