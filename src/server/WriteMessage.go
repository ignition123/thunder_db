package server

import(
	"bytes"
	"encoding/binary"
	"net"
	"fmt"
)

func WriteBytes(conn net.Conn, message []byte){

	var packetBuffer bytes.Buffer

	buff := make([]byte, 4)

	binary.LittleEndian.PutUint32(buff, uint32(len(message)))

	packetBuffer.Write(buff)

	packetBuffer.Write(message)
	
	_, err := conn.Write(packetBuffer.Bytes())

	if err != nil {
		fmt.Println("Error writing to stream."+ err.Error())
	}
}