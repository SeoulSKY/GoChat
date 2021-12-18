package main

import (
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func listen(conn *websocket.Conn) {
	for {
		_, p, err := conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Println(err)
			}
			return
		}

		// just for preventing compile error
		fmt.Println(string(p))
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Failed to load .env file", err)
	}

	router := mux.NewRouter()

	// endpoint for smoke test
	router.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		_, err := w.Write([]byte("Hello From Go"))
		if err != nil {
			log.Panic(err)
		}
	}).Methods("GET")

	router.HandleFunc("/chat", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Panic(err)
		}

		go listen(conn)
	})

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	originsOk := handlers.AllowedOrigins([]string{os.Getenv("WEB_SERVER_HOST")})
	methodsOk := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})

	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), handlers.CORS(headersOk, originsOk, methodsOk)(router)))
}
