package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"main/message"
)

// Mongo is a wrapper for the mongo database
type Mongo struct {
	client *mongo.Client
	chat   *mongo.Collection
}

var instance *Mongo

func init() {

	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://mongo:27017"))
	if err != nil {
		log.Panic(err)
	}

	if err := client.Connect(context.Background()); err != nil {
		log.Panic(err)
	}

	instance = &Mongo{
		client,
		client.Database("chat").Collection("chat"),
	}
}

// GetInstance returns the instance of Mongo
func GetInstance() *Mongo {
	return instance
}

// Insert inserts the given chat to the database
func (m *Mongo) Insert(message *message.Message) {
	_, err := m.chat.InsertOne(context.Background(), message)
	if err != nil {
		log.Panic(err)
	}
}

// Find finds existing chats from the database
func (m *Mongo) Find() *[]message.Message {
	cursor, err := m.chat.Find(context.Background(), bson.D{})
	if err != nil {
		log.Panic(err)
	}

	messages := make([]message.Message, 0)
	if err := cursor.All(context.Background(), &messages); err != nil {
		log.Panic(err)
	}

	return &messages
}
