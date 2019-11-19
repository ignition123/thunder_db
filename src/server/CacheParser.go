package server


import(
	"net"
	"pojo"
	"fmt"
)

func CallCacheMethod(conn net.Conn, QueryObject pojo.QueryParser){
	
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