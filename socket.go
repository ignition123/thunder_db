package main

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
