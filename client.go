/*
A very simple TCP client written in Go.
This is a toy project that I used to learn the fundamentals of writing
Go code and doing some really basic network stuff.
Maybe it will be fun for you to read. It's not meant to be
particularly idiomatic, or well-written for that matter.
*/
package main

import (
	"bufio"
	"flag"
	"fmt"
	"net"
	"os"
	_"regexp"
	"strconv"
	"time"
)

var host = flag.String("host", "localhost", "The hostname or IP to connect to; defaults to \"localhost\".")
var port = flag.Int("port", 8900, "The port to connect to; defaults to 8000.")

func main() {
	flag.Parse()

	dest := *host + ":" + strconv.Itoa(*port)
	fmt.Printf("Connecting to %s...\n", dest)

	conn, err := net.Dial("tcp", dest)

	if err != nil {
		if _, t := err.(*net.OpError); t {
			fmt.Println("Some problem connecting.")
		} else {
			fmt.Println("Unknown error: " + err.Error())
		}
		os.Exit(1)
	}

	go readConnection(conn)

	for {
		fmt.Print("127.0.0.1:8900>")
		reader := bufio.NewReader(os.Stdin)
		text, _ := reader.ReadString('\n')

		// text := "PING\r\n"

		time.Sleep(10)

		conn.SetWriteDeadline(time.Now().Add(1 * time.Second))
		_, err := conn.Write([]byte(text))
		if err != nil {
			fmt.Println("Error writing to stream."+ err.Error())
			break
		}
	}
}

func readConnection(conn net.Conn) {

	for { 

		message, _ := bufio.NewReader(conn).ReadString('\n')
		fmt.Print(message)
		fmt.Print("127.0.0.1:8900>")
	}
}