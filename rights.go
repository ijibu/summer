package summer

import (
	"sync"
)

type (
	Rights struct {
		Groups  []string
		Actions []string
	}

	GroupsList struct {
		sync.Mutex
		list map[string][]string
	}
)

// Add new group
func (g *GroupsList) Add(name string, actions ...string) {
	g.Lock()
	defer g.Unlock()

	if g.list == nil {
		g.list = map[string][]string{}
	}
	if g.list[name] == nil {
		g.list[name] = []string{}
	}
	g.list[name] = uniqAppend(g.list[name], actions)
}

func (g *GroupsList) Get(names ...string) (actions []string) {
	actions = []string{}
	g.Lock()
	defer g.Unlock()

	for _, name := range names {
		if g.list[name] != nil {
			actions = uniqAppend(actions, g.list[name])
		}
	}
	return
}
