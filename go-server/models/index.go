package models

import "time"

// Chat contains info about a chat
type Chat struct {
	SenderName string    `json:"senderName"`
	Message    string    `json:"message"`
	Timestamp  time.Time `json:"timestamp"`
}
