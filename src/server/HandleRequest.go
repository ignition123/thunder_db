package server

import (
	"net"
	"fmt"
	"bufio"
	"time"
)

func HandleRequest(conn net.Conn, messageQueue chan string){
	
	defer conn.Close()

	scanner := bufio.NewScanner(conn)

	for {

		time.Sleep(1)

		ok := scanner.Scan()

		if !ok {
			messageQueue <- "THUNDER_DISCONNECT"
			break
		}

		err := conn.SetReadDeadline(time.Now().Add(10 * time.Hour))

		if err != nil {
			fmt.Println("Error in tcp connection: "+err.Error())
			messageQueue <- "THUNDER_DISCONNECT"
			break
		}

		var message = scanner.Text()

		if len(message) > 0{
			messageQueue <- message
		}
	}

	close(messageQueue)
}