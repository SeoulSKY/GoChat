package models

import "time"

// Message contains info about a message
type Message struct {
	SenderName string    `json:"senderName"`
	Text       string    `json:"text"`
	Timestamp  time.Time `json:"timestamp"`
}
