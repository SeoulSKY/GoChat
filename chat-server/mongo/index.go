package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"main/models"
	"os"
)

// Mongo is a wrapper for the mongo database
type Mongo struct {
	client *mongo.Client
	chat   *mongo.Collection
}

var instance *Mongo

func init() {
	var host string
	if _, ok := os.LookupEnv("DOCKER"); ok {
		host = "mongo"
	} else {
		host = "localhost"
	}

	client, err := mongo.NewClient(options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:27017", host)))
	if err != nil {
		log.Panic(err)
	}

	if err := client.Connect(context.Background()); err != nil {
		log.Panic(err)
	}

	instance = &Mongo{
		client,
		client.Database("GoChat").Collection("chat"),
	}
}

// GetInstance returns the instance of Mongo
func GetInstance() *Mongo {
	return instance
}

// Insert inserts the given chat to the database
func (m *Mongo) Insert(message *models.Message) {
	_, err := m.chat.InsertOne(context.Background(), message)
	if err != nil {
		log.Panic(err)
	}
}

// Find finds existing chats from the database
func (m *Mongo) Find() *[]models.Message {
	cursor, err := m.chat.Find(context.Background(), bson.D{})
	if err != nil {
		log.Panic(err)
	}

	messages := make([]models.Message, 0)
	if err := cursor.All(context.Background(), &messages); err != nil {
		log.Panic(err)
	}

	return &messages
}
