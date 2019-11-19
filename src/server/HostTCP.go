package server

import (
	"pojo"
	"net"
	"fmt"
	"os"
	"bufio"
	"time"
	"encoding/json"
)

type ServerConnection struct{
	connections map[net.Conn] time.Time
}

func HostTCP(configObj pojo.Config){

	server, err := net.Listen("tcp", *configObj.Server.Host +":"+ *configObj.Server.Port)

    if err != nil {
        fmt.Println("Error listening:", err.Error())
        os.Exit(1)
	}
	
	defer server.Close()

	fmt.Println("Listening on " + *configObj.Server.Host + ":" + *configObj.Server.Port+"...")

	CreateCacheDB()

    for {

		time.Sleep(1)

		conn, err := server.Accept()

		fmt.Println("connection accepted...")
		
        if err != nil {
            fmt.Println("Error accepting: ", err.Error())
		}

		var messageQueue = make(chan string)

		defer close(messageQueue)
		
		go recieveMessage(conn, messageQueue)

		go handleRequest(conn, messageQueue)
		
	}
}

func recieveMessage(conn net.Conn, messageQueue chan string){

	var stopIterate = false

	for{

		time.Sleep(1)

		if stopIterate{
			break
		}

		select {
			case val, ok := <-messageQueue:
				if ok{

					if val == "THUNDER_DISCONNECT"{
						break
					}

					parseMsg(val, conn)
    
				}else{
					fmt.Println("Connection closed!")
					fmt.Println("Channel closed!")
					stopIterate = true
					break
				
				}
			default:
				//fmt.Println("Waiting for messagses...")
		}
	}
}

func parseMsg(msg string, conn net.Conn){

	fmt.Println(msg)

	if msg == "PING"{

		conn.Write([]byte("PONG \r\n"))

	}else{

		var QueryObject = pojo.QueryParser{}

		pojoErr := json.Unmarshal([]byte(msg), &QueryObject)

		if pojoErr != nil{
			fmt.Println("Invalid message...")
			conn.Close()
			return
		}

		// Cache Query SET, GET, DEL method to be invoked

		if QueryObject.Ch != nil{
			callCacheMethod(conn, QueryObject)
		}
	}
}

func callCacheMethod(conn net.Conn, QueryObject pojo.QueryParser){
	
	if QueryObject.Ch.Set != nil{
		Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Set.Key] = []byte(*QueryObject.Ch.Set.Val)
		conn.Write([]byte("OK"))
		conn.Write([]byte("\r\n"))
	}else if QueryObject.Ch.Get != nil{
		var value = Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Get.Key]
		fmt.Println(string(value))
		conn.Write(value)
		conn.Write([]byte("\r\n"))
	}
}

func handleRequest(conn net.Conn, messageQueue chan string){
	
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