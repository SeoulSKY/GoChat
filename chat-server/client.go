package main

import (
	"github.com/gorilla/websocket"
	"log"
	"main/models"
	"main/mongo"
	"time"
)

// Client contains info about a client
type Client struct {
	id      int64
	conn    *websocket.Conn
	send    chan *models.Message
	manager *ClientManager
}

// NewClient creates a new client
func NewClient(id int64, conn *websocket.Conn, manager *ClientManager) *Client {
	return &Client{
		id,
		conn,
		make(chan *models.Message),
		manager,
	}
}

// start the Client in goroutines
func (c *Client) start() {
	c.manager.add <- c

	// read models from the client
	go func() {
		for {
			message := new(models.Message)
			if err := c.conn.ReadJSON(message); err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseNoStatusReceived, websocket.CloseGoingAway,
					websocket.CloseAbnormalClosure) {
					log.Println(err)
				}

				c.manager.remove <- c
				return
			}

			message.Timestamp = time.Now()

			// add the models to the database
			mongo.GetInstance().Insert(message)

			c.manager.broadcast <- message
		}
	}()

	// write models to the client
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
