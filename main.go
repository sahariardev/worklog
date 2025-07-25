package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

var assets embed.FS

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "worklog",
		Width:  400,
		Height: 475,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		AlwaysOnTop:      true,
		BackgroundColour: &options.RGBA{R: 244, G: 244, B: 244, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
