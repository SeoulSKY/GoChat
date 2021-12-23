package main

import (
	"log"
	"strconv"
)

type ClientManager struct {
	clients map[int64]*Client

	broadcast chan *Chat

	add chan *Client

	remove chan *Client
}

// NewClientManager creates a new ClientManager
func NewClientManager() *ClientManager {
	return &ClientManager{
		make(map[int64]*Client),
		make(chan *Chat),
		make(chan *Client),
		make(chan *Client),
	}
}

// start the ClientManager
func (m ClientManager) start() {
	for {
		select {
		case client := <-m.add:
			if _, found := m.clients[client.id]; found {
				log.Panicln("Client id \"" + strconv.FormatInt(client.id, 10) + "\" already exists")
			}
			m.clients[client.id] = client
		case client := <-m.remove:
			delete(m.clients, client.id)
		case chat := <-m.broadcast:
			for _, client := range m.clients {
				client.send <- chat
			}
		}
	}
}
