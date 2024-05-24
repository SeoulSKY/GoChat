package main

import (
	"github.com/gorilla/websocket"
	"log"
	"main/message"
	"main/mongo"
	"time"
)

// Client contains info about a client
type Client struct {
	id      int64
	conn    *websocket.Conn
	send    chan *message.Message
	manager *ClientManager
}

// NewClient creates a new client
func NewClient(id int64, conn *websocket.Conn, manager *ClientManager) *Client {
	return &Client{
		id,
		conn,
		make(chan *message.Message),
		manager,
	}
}

// start the Client in goroutines
func (c *Client) start() {
	c.manager.add <- c

	// read message from the client
	go func() {
		for {
			message := new(message.Message)
			if err := c.conn.ReadJSON(message); err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Println(err)
				}

				c.manager.remove <- c
				return
			}

			message.Timestamp = time.Now()
			log.Println(message.SenderName, "says:", message.Text)

			// add the message to the database
			mongo.GetInstance().Insert(message)

			c.manager.broadcast <- message
		}
	}()

	// write message to the client
	go func() {
		for {
			select {
			case message := <-c.send:
				if err := c.conn.WriteJSON(message); err != nil {
					if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
						log.Println(err)
					}

					c.manager.remove <- c
					return
				}
			}
		}
	}()
}
