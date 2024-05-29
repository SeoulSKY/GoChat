package main

import (
	"log"
	"main/models"
	"strconv"
)

// ClientManager manages clients
type ClientManager struct {
	clients map[int64]*Client

	broadcast chan *models.Message

	add chan *Client

	remove chan *Client
}

// NewClientManager creates a new ClientManager
func NewClientManager() *ClientManager {
	return &ClientManager{
		make(map[int64]*Client),
		make(chan *models.Message),
		make(chan *Client),
		make(chan *Client),
	}
}

// start the ClientManager in a goroutine
func (m ClientManager) start() {
	go func() {
		for {
			select {
			case client := <-m.add:
				if _, found := m.clients[client.id]; found {
					log.Panicln("Client id \"" + strconv.FormatInt(client.id, 10) + "\" already exists")
				}
				m.clients[client.id] = client
			case client := <-m.remove:
				delete(m.clients, client.id)
			case message := <-m.broadcast:
				for _, client := range m.clients {
					client.send <- message
				}
			}
		}
	}()
}
