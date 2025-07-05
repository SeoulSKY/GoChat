package main

import (
	"log"
	"main/routes"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var PORT = 4000

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func main() {
	router := mux.NewRouter().PathPrefix("/api").Subrouter()
	manager := NewClientManager()
	manager.start()

	// endpoint for smoke test
	router.HandleFunc("/helloworld", func(w http.ResponseWriter, r *http.Request) {
		_, err := w.Write([]byte("Hello World!"))
		if err != nil {
			log.Panic(err)
		}
	}).Methods("GET")

	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Panic(err)
		}

		client := NewClient(time.Now().UnixNano(), conn, manager)
		client.start()
	})

	routes.AddRoutes(router)

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	originsOk := handlers.AllowedOrigins([]string{"http://localhost:5173", "http://localhost:3000", "https://gochat.seoulsky.dev"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})

	log.Printf("Running at localhost:%d\n", PORT)
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(PORT), handlers.CORS(headersOk, originsOk, methodsOk)(router)))
}
