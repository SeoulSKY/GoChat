package routes

import (
	"net/http"

	"github.com/gorilla/mux"
)

// Route that can be registered
type Route struct {
	path    string
	handler func(w http.ResponseWriter, r *http.Request)
	method  string
}

var routes []*Route = make([]*Route, 0)

// RegisterRoute registers the given route
func RegisterRoute(route *Route) {
	routes = append(routes, route)
}

// AddRoutes adds routes to the given router
func AddRoutes(router *mux.Router) {
	for _, route := range routes {
		router.HandleFunc(route.path, route.handler).Methods(route.method)
	}
}
