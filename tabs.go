package summer

import (
	"sort"
)

type (
	tab struct {
		Order  int
		Title  string
		Link   string
		Active bool
	}

	tabs []*tab
)

func (slice tabs) Len() int {
	return len(slice)
}

func (slice tabs) Less(i, j int) bool {
	if slice[i].Order != slice[j].Order {
		return slice[i].Order < slice[j].Order
	}
	return slice[i].Title < slice[j].Title
}

func (slice tabs) Swap(i, j int) {
	slice[i], slice[j] = slice[j], slice[i]
}

func getTabs(panel *Panel, name string, u *UsersStruct) interface{} {
	modulesListMu.Lock()
	tabsList := tabs{}
	if modulesList[name] == nil {
		return obj{"title": name, "icon": "", "list": tabsList}
	}

	current := modulesList[name]
	parent := current
	if current.GetSettings().GroupTo != nil {
		parent = current.GetSettings().GroupTo
	}
	if checkRights(panel, parent.GetSettings().Rights, u.Rights) {
		for _, module := range modulesList {
			sett := module.GetSettings()
			if sett.GroupTo == parent && checkRights(panel, sett.Rights, u.Rights) {
				tabsList = append(tabsList, &tab{
					Order:  sett.MenuOrder,
					Title:  sett.GroupTitle,
					Link:   "/" + sett.PageRouteName + "/",
					Active: module == current,
				})
			}
		}
	}
	modulesListMu.Unlock()
	sort.Sort(tabsList)
	if len(tabsList) > 0 {
		tabsList = append(tabs{&tab{
			Order:  parent.GetSettings().MenuOrder,
			Title:  parent.GetSettings().GroupTitle,
			Link:   "/" + parent.GetSettings().PageRouteName + "/",
			Active: parent == current,
		}}, tabsList...)
	}
	return obj{"title": parent.GetSettings().Title, "icon": parent.GetSettings().Icon, "list": tabsList}
}