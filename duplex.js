class JsonSocket extends Duplex {  
    constructor(socket) {
      super({ objectMode: true });
  
      // used to control reading
      this._readingPaused = false;
  
      // wrap the socket if one was provided
      if (socket) this._wrapSocket(socket);
    }
  
    // more code...
}

var obj = new JsonSocket();
