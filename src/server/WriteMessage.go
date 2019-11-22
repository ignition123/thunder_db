package server

import(
	"bytes"
	"encoding/binary"
	"net"
	"fmt"
)

func WriteBytes(conn net.Conn, message []byte){

	// buffer memory for packet size

	var packetBuffer bytes.Buffer

	buff := make([]byte, 4)

	binary.LittleEndian.PutUint16(buff, uint16(len(message) + 2))

	packetBuffer.Write(buff)

	// buffer memory for status

	buff := make([]byte, 2)

	binary.LittleEndian.PutUint8(buff, uint8(len(message)))

	packetBuffer.Write(buff)

	// message in byte array

	packetBuffer.Write(message)
	
	_, err := conn.Write(packetBuffer.Bytes())

	if err != nil {
		fmt.Println("Error writing to stream."+ err.Error())
	}
}