package main

import (
	"log"
	"main/models"
	"main/mongo"
	"time"

	"github.com/gorilla/websocket"
)

// Client contains info about a client
type Client struct {
	id      int64
	name    string
	conn    *websocket.Conn
	send    chan *models.Chat
	manager *ClientManager
}

// NewClient creates a new client
func NewClient(id int64, name string, conn *websocket.Conn, manager *ClientManager) *Client {
	return &Client{
		id,
		name,
		conn,
		make(chan *models.Chat),
		manager,
	}
}

// start the Client
func (c *Client) start() {
	c.manager.add <- c

	// read message from the client
	go func() {
		for {
			chat := new(models.Chat)
			err := c.conn.ReadJSON(chat)

			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Println(err)
				}

				c.manager.remove <- c
				return
			}

			chat.Timestamp = time.Now()
			log.Println(chat.SenderName, "says:", chat.Message)

			// add the chat to the database
			mongo.GetInstance().Insert(chat)

			c.manager.broadcast <- chat
		}
	}()

	// write message to the client
	go func() {
		for {
			select {
			case chat := <-c.send:
				if err := c.conn.WriteJSON(chat); err != nil {
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
