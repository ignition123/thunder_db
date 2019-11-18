package server

import (
	"pojo"
	"net"
	"fmt"
	"os"
	"bufio"
)

var messageQueue []string

func HostTCP(configObj pojo.Config){

	server, err := net.Listen("tcp", *configObj.Server.Host +":"+ *configObj.Server.Port)

    if err != nil {
        fmt.Println("Error listening:", err.Error())
        os.Exit(1)
	}
	
	defer server.Close()

	fmt.Println("Listening on " + *configObj.Server.Host + ":" + *configObj.Server.Port)

	go recieveMessage()

    for {
        // Listen for an incoming connection.
		conn, err := server.Accept()
		
        if err != nil {
            fmt.Println("Error accepting: ", err.Error())
		}
	
        // Handle connections in a new goroutine.
        go handleRequest(conn)
	}
}

func recieveMessage(){

	var counter = 0;

	for{

		if len(messageQueue) > 0{

			fmt.Println(counter)
			counter += 1
			fmt.Print(messageQueue[0]+"\r\n") // First element
			messageQueue = messageQueue[1:]   // Dequeue
		}
	}
}

func handleRequest(conn net.Conn){
	
	defer conn.Close()

	scanner := bufio.NewScanner(conn)

	for {
		ok := scanner.Scan()

		if !ok {
			break
		}

		var message = scanner.Text()

		if len(message) > 0{
			messageQueue = append(messageQueue, message)

			conn.Write([]byte("Hello client"))
		}
	}
}