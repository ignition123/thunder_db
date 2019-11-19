package server


import(
	"net"
	"pojo"
)

func CallCacheMethod(conn net.Conn, QueryObject pojo.QueryParser){
	
	if QueryObject.Ch.Set != nil{
		Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Set.Key] = []byte(*QueryObject.Ch.Set.Val)
		conn.Write([]byte("OK"))
		conn.Write([]byte("\r\n"))
	}else if QueryObject.Ch.Get != nil{
		var value = Storage[*QueryObject.Ch.DB][*QueryObject.Ch.Get.Key]
		conn.Write(value)
		conn.Write([]byte("\r\n"))
	}else if  QueryObject.Ch.Del != nil{
		delete(Storage[*QueryObject.Ch.DB], *QueryObject.Ch.Del.Key)
		conn.Write([]byte("OK"))
		conn.Write([]byte("\r\n"))
	}
}